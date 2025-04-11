import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'
import {In} from 'typeorm'

import {processor, ProcessorContext, Block as ContextBlock, Extrinsic} from './processor'
import {Block, Transaction, Account, Statistics} from './model'
import {initProcessor} from './initProcessor'

// Интерфейс для расширенных данных экстринзика
interface ExtendedExtrinsic extends Extrinsic {
    signature?: any
    signer?: any
    indexInBlock?: number
}

// Главная функция
async function main() {
    // Сначала инициализируем процессор с динамическим определением начального блока
    await initProcessor()
    
    // Затем запускаем процессор
    processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
        // Получаем данные блоков
        const blocks = getBlocks(ctx)
        
        // Получаем данные транзакций
        const transactions = getTransactions(ctx, blocks)
        
        // Получаем аккаунты
        const accounts = await getAccounts(ctx, transactions)
        
        // Обновляем статистику
        const statistics = await updateStatistics(ctx, blocks, transactions, accounts)
        
        // Сохраняем все сущности в базу данных
        await ctx.store.upsert([...accounts.values()])
        await ctx.store.upsert(blocks)
        await ctx.store.upsert(transactions)
        
        if (statistics) {
            await ctx.store.upsert(statistics)
        }
    })
}

// Преобразуем данные блоков из контекста в наши модели
function getBlocks(ctx: ProcessorContext): Block[] {
    const blocks: Block[] = []
    
    for (const block of ctx.blocks) {
        const header = block.header
        
        blocks.push(new Block({
            id: header.height.toString(),
            hash: header.hash,
            timestamp: new Date(header.timestamp!),
            validator: header.validator || '',
            status: 'finalized',
            size: undefined // Не рассчитываем размер блока в MVP
        }))
    }
    
    return blocks
}

// Преобразуем данные транзакций из контекста в наши модели
function getTransactions(ctx: ProcessorContext, blocks: Block[]): Transaction[] {
    const transactions: Transaction[] = []
    const blockMap = new Map(blocks.map(b => [b.id, b]))
    
    for (const block of ctx.blocks) {
        const blockEntity = blockMap.get(block.header.height.toString())
        
        if (!blockEntity) continue
        
        // Перебираем все экстринзики (транзакции) в блоке
        for (const extrinsic of block.extrinsics as ExtendedExtrinsic[]) {
            // Пропускаем неподписанные экстринзики (системные)
            if (!extrinsic.signature) continue
            
            const from = extrinsic.signer
            let to: string | undefined
            let amount: bigint | undefined
            let txType = 'unknown'
            
            // Определяем тип транзакции и получателя
            if (extrinsic.call?.name === 'Balances.transfer') {
                txType = 'transfer'
                to = extrinsic.call.args.dest
                amount = BigInt(extrinsic.call.args.value || 0)
            }
            
            // Создаем сущности аккаунтов
            const fromAccount = new Account({
                id: from ? ss58.codec('substrate').encode(from) : 'system',
                balance: 0n,
                updatedAt: new Date()
            })
            
            let toAccount: Account | undefined
            if (to) {
                toAccount = new Account({
                    id: ss58.codec('substrate').encode(to),
                    balance: 0n,
                    updatedAt: new Date()
                })
            }
            
            // Определяем статус транзакции (упрощенно для MVP)
            const status = extrinsic.success ? 'success' : 'failed'
            
            // Создаем транзакцию
            transactions.push(new Transaction({
                id: extrinsic.hash || `${block.header.height}-${extrinsic.indexInBlock || extrinsic.index}`,
                block: blockEntity,
                blockNumber: block.header.height,
                timestamp: new Date(block.header.timestamp!),
                from: fromAccount,
                to: toAccount,
                amount: amount,
                fee: extrinsic.fee || 0n,
                status: status,
                type: txType,
                data: JSON.stringify(extrinsic.call?.args || {})
            }))
        }
    }
    
    return transactions
}

// Получаем и обновляем аккаунты
async function getAccounts(ctx: ProcessorContext, transactions: Transaction[]): Promise<Map<string, Account>> {
    // Собираем все id аккаунтов из транзакций
    const accountIds = new Set<string>()
    for (const tx of transactions) {
        if (tx.from) accountIds.add(tx.from.id)
        if (tx.to) accountIds.add(tx.to.id)
    }
    
    // Ищем существующие аккаунты в базе
    const existingAccounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
    const accountMap = new Map<string, Account>(existingAccounts.map((a: Account) => [a.id, a]))
    
    // Создаем новые аккаунты, если они не существуют
    for (const id of accountIds) {
        if (!accountMap.has(id)) {
            accountMap.set(id, new Account({
                id,
                balance: 0n,
                updatedAt: new Date()
            }))
        }
    }
    
    return accountMap
}

// Обновляем общую статистику
async function updateStatistics(
    ctx: ProcessorContext, 
    blocks: Block[], 
    transactions: Transaction[],
    accounts: Map<string, Account>
): Promise<Statistics | undefined> {
    if (blocks.length === 0) return undefined
    
    // Ищем существующую статистику или создаем новую
    let stats = await ctx.store.get(Statistics, 'current')
    if (!stats) {
        stats = new Statistics({
            id: 'current',
            totalBlocks: 0,
            totalTransactions: 0,
            totalAccounts: 0,
            averageBlockTime: 0,
            lastBlock: 0,
            updatedAt: new Date()
        })
    }
    
    // Находим последний блок
    const lastBlock = blocks.reduce((max, b) => {
        const blockNum = parseInt(b.id)
        return blockNum > max ? blockNum : max
    }, 0)
    
    // Обновляем статистику
    stats.totalBlocks += blocks.length
    stats.totalTransactions += transactions.length
    stats.totalAccounts = accounts.size
    stats.lastBlock = Math.max(stats.lastBlock, lastBlock)
    stats.updatedAt = new Date()
    
    // Рассчет среднего времени между блоками можно добавить позже
    
    return stats
}

// Запускаем основную функцию
main().catch(err => {
    console.error('Ошибка запуска процессора:', err)
    process.exit(1)
})

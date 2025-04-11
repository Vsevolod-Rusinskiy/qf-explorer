import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'
import {In} from 'typeorm'
import {DataSource} from 'typeorm'

import {processor, ProcessorContext, Block as ContextBlock, Extrinsic} from './processor'
import {Block, Transaction, Account, Statistics} from './model'
import {initProcessor} from './initProcessor'

// Расширяем интерфейс Store для добавления метода query
interface ExtendedStore extends Store {
    query?: (sql: string, parameters?: any[]) => Promise<any[]>
    getDataSource?: () => DataSource
}

// Интерфейс для расширенных данных экстринзика
interface ExtendedExtrinsic extends Extrinsic {
    signature?: any
    signer?: any
    indexInBlock?: number
}

// Главная функция
async function main() {
    console.log("Запуск главной функции процессора...")
    // Сначала инициализируем процессор с динамическим определением начального блока
    await initProcessor()
    
    // Затем запускаем процессор
    processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
        console.log("Обработка блока...")
        try {
            // Получаем данные блоков
            const blocks = getBlocks(ctx)
            console.log(`Получено блоков: ${blocks.length}`)
            
            // Получаем данные транзакций
            const transactions = getTransactions(ctx, blocks)
            console.log(`Получено транзакций: ${transactions.length}`)
            
            // Получаем аккаунты
            console.log("Начинаем получать аккаунты...")
            const accounts = await getAccounts(ctx, transactions)
            console.log(`Получено аккаунтов: ${accounts.size}`)
            
            // Обновляем статистику
            console.log("Обновляем статистику...")
            const statistics = await updateStatistics(ctx, blocks, transactions, accounts)
            
            // Сохраняем все сущности в базу данных
            console.log("Сохраняем аккаунты в базу данных...")
            await ctx.store.upsert([...accounts.values()])
            
            console.log("Сохраняем блоки в базу данных...")
            await ctx.store.upsert(blocks)
            
            console.log("Сохраняем транзакции в базу данных...")
            await ctx.store.upsert(transactions)
            
            if (statistics) {
                console.log("Сохраняем статистику в базу данных...")
                await ctx.store.upsert(statistics)
            }
            
            console.log("Блок успешно обработан и сохранен в базу данных.")
        } catch (error) {
            console.error("Ошибка при обработке блока:", error)
            throw error
        }
    })
}

// Преобразуем данные блоков из контекста в наши модели
function getBlocks(ctx: ProcessorContext): Block[] {
    const blocks: Block[] = []
    
    for (const item of ctx.blocks) {
        // Получаем данные блока из контекста
        const block = new Block({
            id: item.header.height.toString(),
            hash: item.header.hash,
            timestamp: new Date(item.header.timestamp || Date.now()),
            validator: item.header.validator || '',
            status: 'finalized',
            size: undefined // Не рассчитываем размер блока в MVP
        })
        
        blocks.push(block)
    }
    
    return blocks
}

// Преобразуем данные транзакций из контекста в наши модели
function getTransactions(ctx: ProcessorContext, blocks: Block[]): Transaction[] {
    const transactions: Transaction[] = []
    const blockMap = new Map(blocks.map(b => [b.id, b]))
    
    // Обрабатываем каждый блок
    for (const contextBlock of ctx.blocks) {
        const blockId = contextBlock.header.height.toString()
        const block = blockMap.get(blockId)
        
        if (!block) continue
        
        // Обрабатываем каждый экстринзик в блоке
        for (const extrinsic of contextBlock.extrinsics as ExtendedExtrinsic[]) {
            // В этом MVP-е мы просто создаем пустые транзакции с минимумом данных
            const tx = new Transaction({
                id: extrinsic.hash || `${blockId}-${extrinsic.indexInBlock || 0}`,
                blockNumber: contextBlock.header.height,
                timestamp: block.timestamp,
                status: 'success', // Упрощаем для MVP
                type: 'unknown' // По умолчанию
            })
            
            // Устанавливаем связь с блоком
            tx.block = block
            
            transactions.push(tx)
        }
    }
    
    return transactions
}

// Получаем аккаунты из транзакций и базы данных
async function getAccounts(ctx: ProcessorContext, transactions: Transaction[]): Promise<Map<string, Account>> {
    console.log("Вход в функцию getAccounts...")
    
    // Собираем все id аккаунтов из транзакций
    const accountIds = new Set<string>()
    for (const tx of transactions) {
        if (tx.from) accountIds.add(tx.from.id)
        if (tx.to) accountIds.add(tx.to.id)
    }
    
    // Добавляем тестовые аккаунты для MVP если их нет
    if (accountIds.size === 0) {
        accountIds.add('test_account_1')
        accountIds.add('test_account_2')
    }
    
    console.log(`Найдено уникальных ID аккаунтов: ${accountIds.size}`)
    console.log("ID аккаунтов:", [...accountIds])
    
    try {
        const extendedStore = ctx.store as ExtendedStore
        let tableExists = false
        let tableStructure = []
        
        // Проверяем существование таблицы account разными способами
        try {
            if (extendedStore.query) {
                // Прямой SQL запрос, если метод query доступен
                const result = await extendedStore.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = 'account'
                    )
                `)
                tableExists = result && result[0] && result[0].exists
                console.log("Существует ли таблица account (через SQL):", tableExists)
                
                if (tableExists) {
                    tableStructure = await extendedStore.query(`
                        SELECT column_name, data_type, is_nullable
                        FROM information_schema.columns
                        WHERE table_name = 'account'
                    `)
                    console.log("Структура таблицы account:", tableStructure)
                }
            } else {
                // Косвенная проверка через findBy
                try {
                    // Если таблица существует, запрос не должен выдать ошибку
                    await ctx.store.findBy(Account, {id: "test_check"})
                    tableExists = true
                } catch (e) {
                    // Анализируем ошибку, чтобы понять, существует ли таблица
                    const error = e as Error
                    if (error.message.includes("relation") && error.message.includes("not exist")) {
                        tableExists = false
                    } else {
                        // Другая ошибка, предполагаем что таблица существует
                        tableExists = true
                    }
                }
                console.log("Существует ли таблица account (через findBy):", tableExists)
            }
        } catch (e) {
            console.error("Ошибка при проверке существования таблицы:", e)
        }
        
        // Если таблица не существует, прерываем процесс
        if (!tableExists) {
            console.error("ВАЖНО: Таблица account не существует! Не можем продолжить обработку.")
            throw new Error("Таблица account не существует")
        }
        
        // Ищем существующие аккаунты в базе
        console.log("Пытаемся найти существующие аккаунты...")
        
        // Собираем существующие аккаунты различными способами
        let existingAccounts: Account[] = []
        let existingAccountsRaw: any[] = []
        
        // Пробуем прямой SQL запрос, если доступен
        if (extendedStore.query && accountIds.size > 0) {
            try {
                existingAccountsRaw = await extendedStore.query(`
                    SELECT id, balance, updated_at FROM account
                    WHERE id IN (${[...accountIds].map(id => `'${id}'`).join(', ') || "''"})`
                )
                console.log(`Найдено аккаунтов через SQL: ${existingAccountsRaw.length}`)
            } catch (e) {
                console.error("Ошибка при SQL запросе аккаунтов:", e)
            }
        }
        
        // Пробуем через TypeORM
        if (accountIds.size > 0) {
            try {
                console.log("Пытаемся найти аккаунты через TypeORM...")
                existingAccounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
                console.log(`Найдено аккаунтов через TypeORM: ${existingAccounts.length}`)
            } catch (e) {
                console.error("Ошибка при поиске аккаунтов через TypeORM:", e)
            }
        }
        
        const accountMap = new Map<string, Account>()
        
        // Если SQL-запрос сработал, но TypeORM - нет, используем данные из SQL
        if (existingAccountsRaw.length > 0 && existingAccounts.length === 0) {
            console.log("Используем данные из SQL-запроса...")
            for (const row of existingAccountsRaw) {
                accountMap.set(row.id, new Account({
                    id: row.id,
                    balance: BigInt(row.balance || 0),
                    updatedAt: new Date(row.updated_at)
                }))
            }
        } else if (existingAccounts.length > 0) {
            // Используем данные из TypeORM
            console.log("Используем данные из TypeORM...")
            for (const account of existingAccounts) {
                accountMap.set(account.id, account)
            }
        }
        
        // Создаем новые аккаунты, если они не существуют
        console.log("Создаем недостающие аккаунты...")
        for (const id of accountIds) {
            if (!accountMap.has(id)) {
                console.log(`Создаем новый аккаунт с ID: ${id}`)
                accountMap.set(id, new Account({
                    id,
                    balance: 0n,
                    updatedAt: new Date()
                }))
            }
        }
        
        console.log(`Всего аккаунтов для возврата: ${accountMap.size}`)
        return accountMap
    } catch (error) {
        console.error("Ошибка в функции getAccounts:", error)
        // В случае ошибки создаем пустые аккаунты
        console.log("Создаем пустые аккаунты из-за ошибки...")
        const accountMap = new Map<string, Account>()
        for (const id of accountIds) {
            accountMap.set(id, new Account({
                id,
                balance: 0n,
                updatedAt: new Date()
            }))
        }
        console.log(`Создано пустых аккаунтов: ${accountMap.size}`)
        return accountMap
    }
}

// Обновляем общую статистику
async function updateStatistics(
    ctx: ProcessorContext, 
    blocks: Block[], 
    transactions: Transaction[],
    accounts: Map<string, Account>
): Promise<Statistics | null> {
    if (blocks.length === 0) return null
    
    try {
        // Пытаемся найти существующую статистику
        const existing = await ctx.store.findOneBy(Statistics, {id: 'current'})
        
        // Создаем новую или обновляем существующую
        const stats = existing || new Statistics({
            id: 'current',
            totalBlocks: 0,
            totalTransactions: 0,
            totalAccounts: 0,
            averageBlockTime: 0,
            lastBlock: 0,
            updatedAt: new Date()
        })
        
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
        
        return stats
    } catch (error) {
        console.error("Ошибка при обновлении статистики:", error)
        return null
    }
}

// Запускаем основную функцию
main().catch((err: Error) => {
    console.error("Критическая ошибка:", err)
    process.exit(1)
})

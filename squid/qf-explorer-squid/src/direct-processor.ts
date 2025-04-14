import * as dotenv from 'dotenv'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { DataSource } from 'typeorm'
import { processor } from './processor'
import { Account, Block, Transaction, Statistics } from './model'
import { initProcessor } from './initProcessor'

// Загружаем .env файл
dotenv.config()

// Создаем конфигурацию TypeORM
const dataSourceConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'squid',
    synchronize: false,
    logging: true,
    entities: [Account, Block, Transaction, Statistics]
}

// Количество последних блоков для обработки
const BLOCKS_LIMIT = 10

async function main() {
    console.log('Запуск процессора с прямыми настройками TypeORM...')
    console.log(`Будет обработано не более ${BLOCKS_LIMIT} последних блоков`)
    
    try {
        // Создаем источник данных TypeORM
        const dataSource = new DataSource(dataSourceConfig)
        
        // Подключаемся к базе данных напрямую
        await dataSource.initialize()
        console.log('Соединение с базой данных успешно установлено')
        
        // Проверяем структуру таблиц
        console.log('Проверка структуры таблиц...')
        const tables = await dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
        console.log('Таблицы в базе данных:', tables.map((t: any) => t.tablename))
        
        // Закрываем явное соединение
        await dataSource.destroy()
        
        // Инициализируем процессор с настройками начального блока
        // и ограничиваем количество блоков
        await initProcessor(BLOCKS_LIMIT)
        
        // Запускаем процессор с нашими TypeORM настройками
        await processor.run(new TypeormDatabase({
            supportHotBlocks: true,
            stateSchema: 'public',
            isolationLevel: 'READ COMMITTED'
        }), async (ctx) => {
            try {
                // Получаем данные блоков
                const blocks: Block[] = []
                const processedAccounts = new Map<string, Account>()
                const transactions: Transaction[] = []
                
                for (const item of ctx.blocks) {
                    const block = new Block({
                        id: item.header.height.toString(),
                        hash: item.header.hash,
                        timestamp: new Date(item.header.timestamp || Date.now()),
                        validator: item.header.validator || '',
                        status: 'finalized'
                    })
                    blocks.push(block)
                    
                    // Обработка транзакций в блоке
                    for (const extrinsic of item.extrinsics) {
                        try {
                            // Создаем идентификатор транзакции
                            const txId = `${item.header.height}-${extrinsic.index}`
                            
                            // Получаем вызов и его данные, если они доступны
                            const call = extrinsic.call ? await extrinsic.getCall() : null
                            
                            // Создаем транзакцию с доступными данными
                            const tx = new Transaction({
                                id: txId,
                                blockNumber: parseInt(block.id),
                                timestamp: new Date(item.header.timestamp || Date.now()),
                                status: extrinsic.success ? 'success' : 'failed',
                                type: call?.name || 'unknown'
                            })
                            tx.block = block
                            
                            // Устанавливаем плату за транзакцию, если доступна
                            if (extrinsic.fee) {
                                tx.fee = extrinsic.fee
                            }
                            
                            // Анализируем события для поиска информации о переводе
                            for (const event of extrinsic.events) {
                                if (event.name === 'Balances.Transfer') {
                                    try {
                                        const args = event.args
                                        if (args && args.from && args.to) {
                                            // Извлекаем адреса отправителя и получателя
                                            const fromAddress = args.from.toString()
                                            const toAddress = args.to.toString()
                                            
                                            // Добавляем аккаунты, если они еще не обработаны
                                            if (!processedAccounts.has(fromAddress)) {
                                                processedAccounts.set(fromAddress, new Account({
                                                    id: fromAddress,
                                                    balance: 0n,
                                                    updatedAt: new Date()
                                                }))
                                            }
                                            
                                            if (!processedAccounts.has(toAddress)) {
                                                processedAccounts.set(toAddress, new Account({
                                                    id: toAddress,
                                                    balance: 0n,
                                                    updatedAt: new Date()
                                                }))
                                            }
                                            
                                            // Устанавливаем отправителя и получателя
                                            const sender = processedAccounts.get(fromAddress)
                                            const recipient = processedAccounts.get(toAddress)
                                            
                                            if (sender) {
                                                tx.from = sender
                                            }
                                            
                                            if (recipient) {
                                                tx.to = recipient
                                            }
                                            
                                            // Устанавливаем сумму перевода, если доступна
                                            if (args.amount) {
                                                tx.amount = BigInt(args.amount.toString())
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Ошибка при обработке события Balances.Transfer:', error)
                                    }
                                }
                            }
                            
                            transactions.push(tx)
                        } catch (error) {
                            console.error('Ошибка при обработке экстринзика:', error)
                        }
                    }
                }
                
                console.log(`Обработка ${blocks.length} блоков с ${transactions.length} транзакциями и ${processedAccounts.size} аккаунтами...`)
                
                // Сохраняем блоки
                if (blocks.length > 0) {
                    await ctx.store.upsert(blocks)
                    console.log('Блоки успешно сохранены')
                }
                
                // Сохраняем аккаунты
                if (processedAccounts.size > 0) {
                    await ctx.store.upsert(Array.from(processedAccounts.values()))
                    console.log('Аккаунты успешно сохранены')
                }
                
                // Сохраняем транзакции
                if (transactions.length > 0) {
                    await ctx.store.upsert(transactions)
                    console.log('Транзакции успешно сохранены')
                }
                
                // Создаем или обновляем статистику
                try {
                    const existing = await ctx.store.findOneBy(Statistics, { id: 'current' })
                    const stats = existing || new Statistics({
                        id: 'current',
                        totalBlocks: 0,
                        totalTransactions: 0,
                        totalAccounts: 0,
                        averageBlockTime: 0,
                        lastBlock: 0,
                        updatedAt: new Date()
                    })
                    
                    stats.totalBlocks += blocks.length
                    stats.totalTransactions += transactions.length
                    stats.totalAccounts = processedAccounts.size
                    stats.lastBlock = blocks.length > 0 ? parseInt(blocks[blocks.length - 1].id) : stats.lastBlock
                    stats.updatedAt = new Date()
                    
                    await ctx.store.upsert(stats)
                    console.log('Статистика успешно обновлена')
                } catch (error) {
                    console.error('Ошибка при обновлении статистики:', error)
                }
                
                console.log('Обработка блока успешно завершена')
            } catch (error) {
                console.error('Ошибка при обработке блока:', error)
                throw error
            }
        })
    } catch (error) {
        console.error('Критическая ошибка:', error)
        process.exit(1)
    }
}

main().catch(console.error) 
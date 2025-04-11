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

async function main() {
    console.log('Запуск процессора с прямыми настройками TypeORM...')
    
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
        
        // Проверяем колонки в таблицах
        for (const table of ['account', 'block', 'transaction', 'statistics']) {
            const columns = await dataSource.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '${table}'
            `)
            console.log(`Структура таблицы ${table}:`, columns)
        }
        
        // Закрываем явное соединение
        await dataSource.destroy()
        
        // Инициализируем процессор с настройками начального блока
        await initProcessor()
        
        // Запускаем процессор с нашими TypeORM настройками
        await processor.run(new TypeormDatabase({
            supportHotBlocks: true,
            stateSchema: 'public',
            isolationLevel: 'READ COMMITTED'
        }), async (ctx) => {
            try {
                // Получаем данные блоков
                const blocks: Block[] = []
                for (const item of ctx.blocks) {
                    const block = new Block({
                        id: item.header.height.toString(),
                        hash: item.header.hash,
                        timestamp: new Date(item.header.timestamp || Date.now()),
                        validator: item.header.validator || '',
                        status: 'finalized'
                    })
                    blocks.push(block)
                }
                console.log(`Обработка ${blocks.length} блоков...`)
                
                // Сохраняем блоки
                if (blocks.length > 0) {
                    await ctx.store.upsert(blocks)
                    console.log('Блоки успешно сохранены')
                }
                
                // Создаем и сохраняем тестовые аккаунты
                const accounts = [
                    new Account({ id: 'test_account_1', balance: 1000n, updatedAt: new Date() }),
                    new Account({ id: 'test_account_2', balance: 500n, updatedAt: new Date() })
                ]
                await ctx.store.upsert(accounts)
                console.log('Тестовые аккаунты успешно сохранены')
                
                // Создаем и сохраняем тестовые транзакции
                const transactions: Transaction[] = []
                if (blocks.length > 0) {
                    const block = blocks[0]
                    const tx = new Transaction({
                        id: `tx-test-${Date.now()}`,
                        blockNumber: parseInt(block.id),
                        timestamp: block.timestamp,
                        status: 'success',
                        type: 'transfer'
                    })
                    tx.block = block
                    tx.from = accounts[0]
                    tx.to = accounts[1]
                    tx.amount = 100n
                    tx.fee = 1n
                    transactions.push(tx)
                    
                    await ctx.store.upsert(transactions)
                    console.log('Тестовые транзакции успешно сохранены')
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
                    stats.totalAccounts = accounts.length
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
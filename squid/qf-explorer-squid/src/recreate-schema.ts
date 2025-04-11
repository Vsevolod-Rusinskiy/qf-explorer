import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

// Загружаем переменные окружения из .env
dotenv.config()

async function main() {
  console.log('Подключение к базе данных...')
  
  // Создаем подключение к базе данных
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'squid',
    logging: true
  })

  try {
    // Устанавливаем соединение
    await dataSource.initialize()
    console.log('Соединение с базой данных установлено')

    // Удаление всех существующих таблиц
    console.log('Удаление существующих таблиц...')
    await dataSource.query(`
      DROP TABLE IF EXISTS "transaction" CASCADE;
      DROP TABLE IF EXISTS "account" CASCADE;
      DROP TABLE IF EXISTS "block" CASCADE;
      DROP TABLE IF EXISTS "statistics" CASCADE;
    `)
    
    // Создание таблицы account
    console.log('Создание таблицы account...')
    await dataSource.query(`
      CREATE TABLE "account" (
        "id" character varying NOT NULL,
        "balance" numeric,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
      )
    `)

    // Создание таблицы block
    console.log('Создание таблицы block...')
    await dataSource.query(`
      CREATE TABLE "block" (
        "id" character varying NOT NULL,
        "hash" character varying NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
        "validator" character varying,
        "status" character varying,
        "size" integer,
        CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id")
      )
    `)
    
    // Создание индексов для таблицы block
    console.log('Создание индексов для таблицы block...')
    await dataSource.query(`
      CREATE INDEX "IDX_b906d8c42a8d5d72a9eda2a5d2" ON "block" ("hash");
      CREATE INDEX "IDX_5c67cbf2c684147554e7eb2b50" ON "block" ("timestamp");
    `)

    // Создание таблицы transaction
    console.log('Создание таблицы transaction...')
    await dataSource.query(`
      CREATE TABLE "transaction" (
        "id" character varying NOT NULL,
        "block_number" integer NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
        "amount" numeric,
        "fee" numeric,
        "status" character varying NOT NULL,
        "type" character varying,
        "data" character varying,
        "block_id" character varying,
        "from_id" character varying,
        "to_id" character varying,
        CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
      )
    `)
    
    // Создание индексов для таблицы transaction
    console.log('Создание индексов для таблицы transaction...')
    await dataSource.query(`
      CREATE INDEX "IDX_d5fd95f61d6ee1c6bd1dfb4e29" ON "transaction" ("block_id");
      CREATE INDEX "IDX_9c3519229240326d68db4fc7be" ON "transaction" ("block_number");
      CREATE INDEX "IDX_3c2734f6f4273d4e1e13f4e363" ON "transaction" ("timestamp");
      CREATE INDEX "IDX_232f8e85d7633bd6ddfad42169" ON "transaction" ("from_id");
      CREATE INDEX "IDX_0ec19d61e7ed472f2e0733876c" ON "transaction" ("to_id");
      CREATE INDEX "IDX_08995f3d91240e8c726f6626c3" ON "transaction" ("amount");
      CREATE INDEX "IDX_9838aac22a4e31d33bfe833d3f" ON "transaction" ("status");
    `)

    // Создание таблицы statistics
    console.log('Создание таблицы statistics...')
    await dataSource.query(`
      CREATE TABLE "statistics" (
        "id" character varying NOT NULL,
        "total_blocks" integer NOT NULL,
        "total_transactions" integer NOT NULL,
        "total_accounts" integer NOT NULL,
        "average_block_time" double precision NOT NULL,
        "last_block" integer NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_c3c7befbce6a9e2c542a8552572" PRIMARY KEY ("id")
      )
    `)

    // Добавление внешних ключей
    console.log('Добавление внешних ключей...')
    await dataSource.query(`
      ALTER TABLE "transaction" ADD CONSTRAINT "FK_7db11932327301e0bfb95960adc" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "transaction" ADD CONSTRAINT "FK_99298f25613c7c4d7c8a77f9a40" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "transaction" ADD CONSTRAINT "FK_7de44fdf7c9e64d9fd4b8a1de36" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `)

    // Вставляем тестовые данные
    console.log('Вставка тестовых данных...')
    
    // Тестовые аккаунты
    await dataSource.query(`
      INSERT INTO "account" ("id", "balance", "updated_at")
      VALUES 
        ('test_account_1', 1000, NOW()),
        ('test_account_2', 500, NOW())
    `)
    
    // Тестовый блок
    await dataSource.query(`
      INSERT INTO "block" ("id", "hash", "timestamp", "validator", "status", "size")
      VALUES ('1', '0x123abc', NOW(), 'validator1', 'finalized', 1024)
    `)
    
    // Тестовая транзакция
    await dataSource.query(`
      INSERT INTO "transaction" ("id", "block_number", "timestamp", "amount", "fee", "status", "type", "data", "block_id", "from_id", "to_id")
      VALUES ('0xtx1', 1, NOW(), 100, 1, 'success', 'transfer', '{}', '1', 'test_account_1', 'test_account_2')
    `)
    
    // Тестовая статистика
    await dataSource.query(`
      INSERT INTO "statistics" ("id", "total_blocks", "total_transactions", "total_accounts", "average_block_time", "last_block", "updated_at")
      VALUES ('current', 1, 1, 2, 0.1, 1, NOW())
    `)

    console.log('Проверка созданных таблиц...')
    const tables = await dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
    console.log('Таблицы в базе данных:', tables.map((t: any) => t.tablename))

    console.log('Схема успешно пересоздана с тестовыми данными!')
  } catch (error) {
    console.error('Ошибка при выполнении операций с базой данных:', error)
  } finally {
    // Закрываем соединение
    if (dataSource.isInitialized) {
      await dataSource.destroy()
      console.log('Соединение с базой данных закрыто')
    }
  }
}

main().catch(console.error) 
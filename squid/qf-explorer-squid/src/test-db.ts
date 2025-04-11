import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

// Загружаем переменные окружения из .env
dotenv.config()

// Определяем таблицы явно
const entities = [
  {
    name: 'account',
    columns: {
      id: { type: 'varchar', isPrimary: true },
      balance: { type: 'numeric', isNullable: true },
      updated_at: { type: 'timestamp with time zone', isNullable: false }
    }
  },
  {
    name: 'block',
    columns: {
      id: { type: 'varchar', isPrimary: true },
      timestamp: { type: 'timestamp with time zone', isNullable: false },
      height: { type: 'numeric', isNullable: false }
    }
  }
]

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

    // Показать все таблицы
    const tables = await dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
    console.log('Таблицы в базе данных:', tables.map((t: any) => t.tablename))

    // Вставляем тестовый аккаунт
    try {
      await dataSource.query(`
        INSERT INTO account (id, balance, updated_at) 
        VALUES ('test_account_1', 1000, NOW())
        ON CONFLICT (id) DO UPDATE 
        SET balance = 1000, updated_at = NOW()
      `)
      console.log('Тестовый аккаунт успешно добавлен')
    } catch (error) {
      console.error('Ошибка при вставке аккаунта:', error)
      // Показываем структуру таблицы
      console.log('Структура таблицы account:')
      const accountColumns = await dataSource.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'account'
      `)
      console.log(accountColumns)
    }

    // Вставляем тестовый блок
    try {
      await dataSource.query(`
        INSERT INTO block (id, timestamp, height) 
        VALUES ('test_block_1', NOW(), 100)
        ON CONFLICT (id) DO UPDATE 
        SET timestamp = NOW()
      `)
      console.log('Тестовый блок успешно добавлен')
    } catch (error) {
      console.error('Ошибка при вставке блока:', error)
      // Показываем структуру таблицы
      console.log('Структура таблицы block:')
      const blockColumns = await dataSource.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'block'
      `)
      console.log(blockColumns)
    }

  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error)
  } finally {
    // Закрываем соединение
    if (dataSource.isInitialized) {
      await dataSource.destroy()
      console.log('Соединение с базой данных закрыто')
    }
  }
}

main().catch(console.error) 
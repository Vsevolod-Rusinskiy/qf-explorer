# Схема базы данных QF Explorer

## Таблицы

### 1. block
Таблица для хранения информации о блоках

| Поле         | Тип          | Описание                    | Индекс     |
|--------------|--------------|----------------------------|------------|
| id           | ID          | Номер блока (primary key)   | PRIMARY KEY|
| hash         | String      | Хеш блока                  | ✓          |
| timestamp    | DateTime    | Время создания блока       | ✓          |
| validator    | String      | Адрес валидатора           |            |
| status       | String      | Статус блока               |            |
| size         | Int         | Размер блока в байтах      |            |

### 2. transaction
Таблица для хранения информации о транзакциях

| Поле         | Тип          | Описание                    | Индекс     |
|--------------|--------------|----------------------------|------------|
| id           | ID          | Хеш транзакции (primary key)| PRIMARY KEY|
| blockNumber  | Int         | Номер блока                | ✓          |
| timestamp    | DateTime    | Время создания транзакции  | ✓          |
| from         | Account     | Аккаунт отправителя        | ✓          |
| to           | Account     | Аккаунт получателя         |            |
| amount       | BigInt      | Сумма передачи             | ✓          |
| fee          | BigInt      | Комиссия за транзакцию     |            |
| status       | String      | Статус транзакции          | ✓          |
| type         | String      | Тип транзакции             |            |
| data         | String      | Данные транзакции (JSON)   |            |

### 3. account
Таблица для хранения информации об аккаунтах

| Поле         | Тип          | Описание                    | Индекс     |
|--------------|--------------|----------------------------|------------|
| id           | ID          | Адрес аккаунта (primary key)| PRIMARY KEY|
| balance      | BigInt      | Текущий баланс             |            |
| updatedAt    | DateTime    | Время последнего обновления |            |

### 4. statistics
Таблица для хранения общей статистики сети

| Поле              | Тип          | Описание                        | Индекс     |
|-------------------|--------------|--------------------------------|------------|
| id                | ID          | Всегда 'current' (primary key)  | PRIMARY KEY|
| totalBlocks       | Int         | Общее количество блоков         |            |
| totalTransactions | Int         | Общее количество транзакций     |            |
| totalAccounts     | Int         | Общее количество аккаунтов      |            |
| averageBlockTime  | Float       | Среднее время между блоками (мс)|            |
| lastBlock         | Int         | Последний обработанный блок     |            |
| updatedAt         | DateTime    | Время последнего обновления     |            |

## Связи между таблицами

1. `transaction.block` → `block`
   - Каждая транзакция принадлежит одному блоку
   - Один блок может содержать много транзакций (`@derivedFrom`)

2. `transaction.from` → `account`
   - Каждая транзакция имеет отправителя
   - Один аккаунт может быть отправителем многих транзакций (`@derivedFrom`)

3. `transaction.to` → `account`
   - Каждая транзакция может иметь получателя (опционально)
   - Один аккаунт может быть получателем многих транзакций (`@derivedFrom`)

## Индексы

### block
- PRIMARY KEY (id)
- INDEX ON (hash)
- INDEX ON (timestamp)

### transaction
- PRIMARY KEY (id)
- INDEX ON (blockNumber)
- INDEX ON (timestamp)
- INDEX ON (amount)
- INDEX ON (status)

### account
- PRIMARY KEY (id)

### statistics
- PRIMARY KEY (id)

## Примечания

1. Все ID поля используются как первичные ключи
2. Временные метки (DateTime) хранятся в UTC
3. Денежные значения (amount, fee, balance) хранятся как BigInt для точности
4. Поле data в transaction хранит дополнительные данные в формате JSON
5. В таблице statistics id всегда имеет значение 'current', так как хранится только текущая статистика
6. Все связи между таблицами реализованы через GraphQL директивы @derivedFrom 
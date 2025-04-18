# QF Block Explorer Planning

https://github.com/QuantumFusion-network/spec/issues/244

Этот репозиторий содержит документацию по планированию разработки блок-эксплорера для блокчейна QuantumFusion Network.

## Архитектура проекта

```
+-----------------------------------------------------------------------+
|                          User Interface (UI)                          |
|         (React/Next.js, Mobile Apps, or 3rd-Party Consumers)         |
+-----------------------------------------------------------------------+
                                 |
                                 | (GraphQL/WebSockets)
                                 ▼
+-----------------------------------------------------------------------+
|                       Hasura GraphQL Engine                          |
|       (Auto-generated schema, real-time subscriptions, rate limiting) |
+-----------------------------------------------------------------------+
                                 |
                                 |
                                 ▼
+-----------------------------------------------------------------------+
|                   PostgreSQL Database (Explorer Data)                 |
|            (Blocks, Txs, Events, Accounts, Staking, Contracts)        |
+-----------------------------------------------------------------------+
                                 |
                                 |
                                 ▼
+-----------------------------------------------------------------------+
|                        Squid SDK Indexer Layer                        |
|      (Subscribes to QFN, processes blocks & extrinsics, stores in DB) |
+-----------------------------------------------------------------------+
                                 |
                                 |
                                 ▼
+-----------------------------------------------------------------------+
|                   QFN Nodes & Polkadot Finality Data                  |
|         (0.1s blocks, NPoS staking, SPIN consensus, Polkadot bridging)|
+-----------------------------------------------------------------------+
```

## Содержимое

- **[original-issue.md](original-issue-ru.md)** - оригинальное описание требований к MVP блок-эксплорера от команды QF. Включает полные требования, методологию, ожидаемые результаты, критерии успеха и информацию о DevNet.

- **[architecture-overview.md](architecture-overview.md)** - описание архитектуры блок-эксплорера и технологического стека.

- **[implementation-stages.md](implementation-stages.md)** - поэтапный план реализации базовой функциональности блок-эксплорера (без работы со смарт-контрактами, которая запланирована на следующий этап).

- **[user-journey.md](user-journey.md)** - подробное описание пользовательского пути в приложении с техническими деталями по использованию GraphQL API.

- **[project-structure.md](project-structure.md)** - детальная структура проекта и организация кода.

- **[fsd-nextjs-integration.md](fsd-nextjs-integration.md)** - руководство по интеграции Feature-Sliced Design с Next.js App Router.

- **[fsd-eslint-config.md](fsd-eslint-config.md)** - конфигурация ESLint для обеспечения соблюдения архитектуры FSD.

- **[progress-tracking.md](progress-tracking.md)** - текущее состояние проекта и отслеживание прогресса по всем этапам разработки.

## Использование

Эти документы предназначены для планирования разработки демонстрационного прототипа блок-эксплорера для QuantumFusion Network. Они могут быть использованы как отправная точка для:

1. Понимания требований к полному MVP блок-эксплорера
2. Планирования разработки минимального прототипа
3. Оценки времени и ресурсов, необходимых для создания функционирующего прототипа

## Поэтапная реализация

Для эффективной разработки план реализации MVP разделен на несколько этапов:

### Этап 1 - Базовая функциональность (8-9 дней)
- Индексация и отображение блоков, транзакций и аккаунтов
- Базовый поиск и навигация
- Интерфейс с ручным обновлением данных
- Базовая защита API (CORS и rate limiting)

### Этап 2 - Работа со смарт-контрактами и безопасность (7-10 дней)
- Деплой смарт-контрактов
- Взаимодействие с функциями контрактов
- Отображение данных контрактов
- Авторизация пользователей (JWT)
- Защита маршрутов и API-эндпоинтов
- Управление доступом к функциям контрактов

Текущая документация по реализации в файле `implementation-stages.md` относится только к Этапу 1. Полный MVP согласно требованиям в `original-issue-ru.md` будет достигнут после реализации обоих этапов.

## Текущий прогресс

На данный момент:

- ✅ **Фронтенд**: Создана базовая структура проекта на Next.js
- ✅ **UI**: Реализованы страницы для просмотра блоков и деталей блока с заглушками
- ✅ **Бэкенд**: Настроена индексация блоков через Squid SDK
- ✅ **API**: Настроена Hasura GraphQL Engine

Для получения детальной информации по прогрессу каждого этапа см. [progress-tracking.md](progress-tracking.md).

## Подключение к QF DevNet

Для подключения к DevNet QuantumFusion используйте следующие ресурсы:

- RPC эндпоинт: `wss://dev.qfnetwork.xyz/wss`
- Блок-эксплорер: [https://dev.qfnetwork.xyz/#/explorer](https://dev.qfnetwork.xyz/#/explorer)
- Фаусет (для получения тестовых токенов): [https://dev.qfnetwork.xyz/faucet.html](https://dev.qfnetwork.xyz/faucet.html)
- GitHub репозиторий с нодой: [https://github.com/QuantumFusion-network/qf-solochain](https://github.com/QuantumFusion-network/qf-solochain)
- Версия DevNet: v0.0.3

## Технологический стек

- **Фронтенд**: React/Next.js с TypeScript, Feature-Sliced Design (FSD) архитектура
  - Apollo Client для работы с GraphQL API (Hasura)
- **API**: 
  - Hasura GraphQL Engine для GraphQL API
  - WebSockets для будущей поддержки реального времени
- **База данных**: PostgreSQL для хранения данных блокчейна
- **Индексация**: Squid SDK для обработки блоков и транзакций
- **Блокчейн**: Подключение к нодам QFN через RPC

## Следующие шаги

После изучения этой документации следующим шагом будет:

1. Настройка Apollo Client во фронтенде
2. Создание базовых UI компонентов
3. Разработка страниц транзакций и аккаунтов
4. Добавление поиска
5. Настройка WebSocket для обновлений в реальном времени

## �� Памятка по запуску проекта

### 1. Запуск базы данных и Hasura
```bash
cd docker
docker-compose up -d
```

### 2. Запуск Squid процессора
```bash
cd squid
npm install
npm run build
npm run start
```

### 3. Запуск NestJS API
```bash
cd api/qf-explorer-api
npm install
npm run start:dev
```

### 4. Проверка работы
- Hasura Console: http://localhost:8080
- API эндпоинты:
  - Обновление данных: `POST http://localhost:3000/processor/update`
  - Проверка статуса: `GET http://localhost:3000/processor/status`

### 5. Остановка проекта
```bash
cd docker
docker-compose down
```


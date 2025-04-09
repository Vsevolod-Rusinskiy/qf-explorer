# Этапы разработки блок-эксплорера QF - Фаза 1 (без смарт-контрактов)

## 1. Настройка окружения (1 день)
- Установка Node.js, Docker и Docker Compose
- Настройка PostgreSQL в Docker
- Установка Squid SDK: `npm install @subsquid/cli -g`
- Создание Next.js проекта: `npx create-next-app@latest explorer-frontend --typescript --tailwind --eslint`
- Настройка Hasura GraphQL Engine через Docker
- Установка библиотек: `npm install @polkadot/api @apollo/client graphql`

## 2. Бэкенд: Индексация блоков (2 дня)
- Инициализация Squid проекта: `sqd init qf-explorer-squid`
- Настройка подключения к QFN: `wss://dev.qfnetwork.xyz/wss`
- Создание типов данных для блокчейна с Squid typegen
- Определение схемы данных в PostgreSQL:
  ```sql
  CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,
    block_number BIGINT NOT NULL,
    block_hash TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    validator TEXT,
    status TEXT
  );
  
  CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    tx_hash TEXT NOT NULL,
    block_id INT REFERENCES blocks(id),
    from_address TEXT NOT NULL,
    to_address TEXT,
    amount TEXT,
    status TEXT,
    timestamp TIMESTAMP NOT NULL
  );
  ```
- Реализация процессоров для обработки блоков и экстринзиков

## 3. Бэкенд: API для фронтенда (1 день)
- Создание NestJS приложения:
  ```bash
  nest new explorer-backend
  ```
- Установка Swagger для NestJS:
  ```bash
  npm install @nestjs/swagger swagger-ui-express
  ```
- Настройка Swagger в main.ts:
  ```typescript
  // main.ts
  import { NestFactory } from '@nestjs/core';
  import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
  import { AppModule } from './app.module';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    const config = new DocumentBuilder()
      .setTitle('QF Explorer API')
      .setDescription('API для блок-эксплорера QF Network')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    await app.listen(3000);
  }
  bootstrap();
  ```
- Добавление Swagger декораторов к контроллерам:
  ```typescript
  // blocks.controller.ts
  import { Controller, Get, Param } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { BlocksService } from './blocks.service';
  import { BlockDto } from './dto/block.dto';
  
  @ApiTags('blocks')
  @Controller('blocks')
  export class BlocksController {
    constructor(private readonly blocksService: BlocksService) {}
    
    @Get()
    @ApiOperation({ summary: 'Получить список последних блоков' })
    @ApiResponse({ 
      status: 200, 
      description: 'Список блоков',
      type: [BlockDto]
    })
    findAll() {
      return this.blocksService.findAll();
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Получить блок по идентификатору' })
    @ApiResponse({ 
      status: 200, 
      description: 'Данные блока',
      type: BlockDto
    })
    findOne(@Param('id') id: string) {
      return this.blocksService.findOne(+id);
    }
  }
  ```
- Настройка структуры NestJS приложения:
  ```
  /src
    /modules
      /blocks
        blocks.module.ts
        blocks.service.ts
        blocks.controller.ts
      /transactions
        transactions.module.ts
        transactions.service.ts
        transactions.controller.ts
      /accounts
        accounts.module.ts
        accounts.service.ts
        accounts.controller.ts
    /shared
      /interfaces
      /dto
      /utils
    app.module.ts
    main.ts
  ```
- Настройка Hasura с PostgreSQL
- Создание GraphQL схемы (авто-генерация через Hasura)
- Определение запросов для основных данных:
  ```graphql
  query GetLatestBlocks {
    blocks(order_by: {block_number: desc}, limit: 10) {
      id
      block_number
      block_hash
      timestamp
      validator
    }
  }
  
  query GetTransactionsByBlockId($blockId: Int!) {
    transactions(where: {block_id: {_eq: $blockId}}) {
      id
      tx_hash
      from_address
      to_address
      amount
      status
    }
  }
  ```
- Настройка базовой защиты API:
  - Настройка CORS для разрешенных доменов
  - Базовое ограничение количества запросов (rate limiting)

## 4. Фронтенд: Базовая структура (1 день)
- Создание Next.js проекта с TypeScript:
  ```bash
  npx create-next-app@latest explorer-frontend --typescript --tailwind --eslint
  ```
- Организация кода по Feature-Sliced Design (FSD) архитектуре:
  ```
  /src
    /1_app            # Инициализация приложения
    /2_processes      # Процессы приложения
    /3_pages         # Композиция виджетов в страницы
    /4_widgets       # Составные компоненты интерфейса
    /5_features      # Интерактивные функции (поиск, навигация)
    /6_entities      # Бизнес-сущности (блоки, транзакции, аккаунты)
    /7_shared        # Переиспользуемые компоненты и утилиты
  ```
- Настройка Apollo Client для работы с GraphQL API (Hasura):
  ```bash
  npm install @apollo/client graphql
  ```
  ```typescript
  // src/7_shared/api/graphql-client.ts
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  
  export const apolloClient = new ApolloClient({
    uri: 'http://localhost:8080/v1/graphql',
    cache: new InMemoryCache()
  });
  ```
- Установка и настройка React Query для работы с REST API:
  ```bash
  npm install @tanstack/react-query
  ```
- Настройка Orval для генерации API-клиентов из OpenAPI:
  ```bash
  npm install orval --save-dev
  ```
- Создание конфигурации Orval:
  ```javascript
  // orval.config.js
  module.exports = {
    qfExplorer: {
      output: {
        mode: 'tags-split',
        target: 'src/7_shared/api/rest/generated.ts',
        schemas: 'src/7_shared/api/rest/model',
        client: 'react-query',
        override: {
          mutator: {
            path: 'src/7_shared/api/rest/axios-client.ts',
            name: 'customInstance',
          }
        }
      },
      input: {
        target: 'http://localhost:3000/api-json',
      }
    }
  }
  ```
- Создание провайдеров для API:
  ```typescript
  // src/1_app/providers/api-provider.tsx
  import { ApolloProvider } from '@apollo/client';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { apolloClient } from '7_shared/api/graphql-client';
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  
  export const ApiProvider = ({ children }) => (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ApolloProvider>
  );
  ```

## 5. Фронтенд: Список блоков и детали блока (1 день)
- Реализация запроса для получения последних блоков
- Создание компонента таблицы блоков с пагинацией
- Разработка страницы деталей блока с информацией:
  - Номер и хеш блока
  - Временная метка
  - Валидатор
  - Список транзакций
- Добавление кнопки обновления данных

## 6. Фронтенд: Транзакции и аккаунты (1 день)
- Компонент списка транзакций с фильтрацией
- Страница деталей транзакции:
  - Хеш транзакции
  - Статус транзакции (с обновлением)
  - Отправитель и получатель
  - Сумма и комиссия
- Страница информации об аккаунте:
  - Адрес и баланс
  - История транзакций
  - Возможность копирования адреса

## 7. Фронтенд: Поиск и дополнительные функции (1 день)
- Реализация глобального поиска:
  ```typescript
  async function search(query: string) {
    if (query.match(/^[0-9]+$/)) {
      // Поиск по номеру блока
      return searchByBlockNumber(parseInt(query));
    } else if (query.startsWith('0x') && query.length === 66) {
      // Поиск по хешу транзакции
      return searchByTransactionHash(query);
    } else if (query.startsWith('0x') || query.startsWith('5')) {
      // Поиск по адресу аккаунта
      return searchByAccountAddress(query);
    }
    return null;
  }
  ```
- Добавление статистики сети на главную страницу:
  - Количество блоков
  - Время между блоками
  - Общее количество транзакций
- Применение стилей с QF брендингом

## 8. Тестирование и развертывание (1 день)
- Тестирование всех компонентов:
  ```bash
  npm test
  ```
- Оптимизация производительности:
  - Кеширование данных в Apollo Client
  - Использование React.memo для компонентов
- Сборка фронтенда:
  ```bash
  npm run build
  ```
- Настройка CI/CD для автоматического развертывания:
  - Docker-compose для всех компонентов
  - Настройка Nginx для раздачи статики фронтенда

## Общая архитектура развертывания

```
+------------------------------------------+
|               Nginx (80/443)             |
+------------------------------------------+
              /            \
             /              \
+---------------------+  +------------------------+
| React App (Static)  |  | Hasura GraphQL (8080) |
+---------------------+  +------------------------+
                            |
                         +----------------------+
                         | PostgreSQL (5432)    |
                         +----------------------+
                            |
                         +----------------------+
                         | Squid Indexer        |
                         +----------------------+
                            |
                         +----------------------+
                         | QFN Node Connection  |
                         +----------------------+
```

Общая продолжительность: примерно 8-9 дней для базовой версии без функциональности смарт-контрактов.

**Примечание**: Полная реализация MVP согласно требованиям в original-issue-ru.md, включая функциональность смарт-контрактов, потребует дополнительно 7-10 дней разработки. 
# Структура проекта QF Explorer

## Структура папок верхнего уровня

```
/qf-explorer/
  /frontend/                  # Фронтенд-приложение Next.js
  /squid/                     # Индексер на Squid SDK
  /api/                       # NestJS REST API
    /src/
      /processor/            # Модуль управления процессором
        processor.controller.ts
        processor.service.ts
        processor.module.ts
      /common/              # Общие утилиты и типы
      app.module.ts
      main.ts
  /hasura/                    # Конфигурация Hasura GraphQL Engine
  /docker/                    # Docker-конфигурации для развертывания
  /docs/                      # Документация проекта
  .gitignore                 # Игнорируемые файлы
  README.md                  # Основное описание проекта
```
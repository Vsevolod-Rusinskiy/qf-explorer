# Интеграция Feature-Sliced Design с Next.js App Router

## Обзор

Данный документ описывает подход к интеграции методологии Feature-Sliced Design (FSD) с маршрутизацией Next.js App Router. Этот подход позволяет сочетать преимущества обеих архитектур:

- Использовать файловую маршрутизацию Next.js для создания страниц
- Сохранить слоистую архитектуру FSD для лучшей организации кода
- Обеспечить хорошую разделяемость компонентов и логики

## Структура проекта

```
src/
  app/                      # Папка Next.js App Router + слой app из FSD
    _providers/             # Провайдеры приложения (не часть маршрутизации)
      apollo-provider.tsx
      theme-provider.tsx
      providers.tsx         # Композиция всех провайдеров
    _styles/                # Глобальные стили
    _config/                # Конфигурация приложения
    layout.tsx              # Корневой лейаут Next.js с провайдерами
    page.tsx                # Главная страница (/)
    some-route/             # Маршрут /some-route
      page.tsx              # Страница маршрута (импортирует из 3_pages)
    
  3_pages/                  # Композиция виджетов в страницы
    home/
      ui/
        home-page.tsx       # Компонентная реализация главной страницы
    some-route/
      ui/
        some-route-page.tsx # Компонентная реализация страницы
    
  4_widgets/                # Составные компоненты интерфейса
    header/
    footer/
    
  5_features/               # Интерактивные функции
    auth/
    theme-switcher/
    
  6_entities/               # Бизнес-сущности
    user/
    product/
    
  7_shared/                 # Переиспользуемые компоненты и утилиты
    api/
    ui/
    lib/
    config/
```

## Принципы интеграции

### 1. Папка `app`

Папка `app` выполняет двойную функцию:
- **Маршрутизация**: Через файловую систему Next.js
- **Инициализация приложения**: Через предоставление провайдеров и глобальных стилей

### 2. Файлы страниц в App Router

Файлы `page.tsx` внутри папки `app` выполняют только роль точек входа маршрутизации и должны быть максимально простыми:

```tsx
// app/some-route/page.tsx
import { SomeRoutePage } from '@/3_pages/some-route/ui/some-route-page'

export default function Page() {
  return <SomeRoutePage />
}
```

### 3. Специальные файлы Next.js

Next.js использует специальные файлы в папке `app`:
- `layout.tsx` - для определения макетов
- `loading.tsx` - для индикаторов загрузки
- `error.tsx` - для обработки ошибок
- `not-found.tsx` - для страницы 404

Эти файлы также должны быть тонкими и делегировать основную логику компонентам из FSD-слоев:

```tsx
// app/layout.tsx
import { Providers } from './_providers/providers'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 4. Папки с префиксом подчеркивания

Для папок, которые не должны быть частью маршрутизации, используйте префикс подчеркивания:
- `_providers/` - провайдеры контекста
- `_styles/` - глобальные стили
- `_config/` - конфигурации на уровне приложения

### 5. Основной код в FSD-слоях

Вся содержательная часть логики страниц должна находиться в соответствующих FSD-слоях:
- Компоненты страниц - в слое `3_pages`
- Составные элементы UI - в слое `4_widgets`
- Обособленная функциональность - в слое `5_features`
- Бизнес-сущности - в слое `6_entities`
- Переиспользуемый код - в слое `7_shared`

### 6. Отказ от слоя `2_processes`

В большинстве проектов слой `2_processes` часто остается неиспользуемым. Его можно исключить, если:
- Процессы приложения реализуются на уровне страниц
- Используются маршруты Next.js для управления потоком приложения
- Нет сложных, многошаговых бизнес-процессов, требующих отдельного слоя

## Примеры реализации

### Пример страницы с данными

```tsx
// 3_pages/users/ui/users-page.tsx
import { UsersTable } from '@/4_widgets/users-table'
import { UserSearch } from '@/5_features/user-search'
import { PageHeader } from '@/7_shared/ui/page-header'

export const UsersPage = () => {
  return (
    <div>
      <PageHeader title="Пользователи" />
      <UserSearch />
      <UsersTable />
    </div>
  )
}

// app/users/page.tsx
import { UsersPage } from '@/3_pages/users/ui/users-page'

export default function Page() {
  return <UsersPage />
}
```

### Пример использования API-роутов Next.js

```tsx
// app/api/users/route.ts
import { getUsers } from '@/6_entities/user/api'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await getUsers()
  return NextResponse.json(users)
}
```

### Пример провайдеров в App Router

```tsx
// app/_providers/providers.tsx
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/5_features/theme/ui/theme-provider'
import { apolloClient } from '@/7_shared/api/graphql/apollo-client'

const queryClient = new QueryClient()

export const Providers = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
```

## Преимущества подхода

1. **Четкая структура**: Код организован в слои согласно FSD, что улучшает навигацию
2. **Повторное использование**: Компоненты легко переиспользовать между проектами
3. **Изоляция**: Каждый слой имеет свою зону ответственности
4. **Маршрутизация**: Используются преимущества файловой маршрутизации Next.js
5. **SSR/SSG**: Легко применять серверный рендеринг и статическую генерацию Next.js
6. **Масштабирование**: Структура хорошо масштабируется с ростом проекта

## Рекомендации по организации кода

1. **Атомарные коммиты**: Старайтесь, чтобы изменения в разных слоях были в разных коммитах
2. **Именование слоев**: Рекомендуется использовать цифровой префикс (1_, 3_, 4_...) для автоматической сортировки
3. **Публичный API**: Каждый слой должен экспортировать свои публичные части через index.ts
4. **Импорты**: Слои могут импортировать только из нижележащих слоев, никогда из вышележащих
5. **Тестирование**: Тесты для компонентов стоит располагать рядом с самими компонентами в той же директории

## Потенциальные проблемы и решения

### Проблема: Разделение Server и Client Components

В Next.js App Router есть разделение на серверные и клиентские компоненты. Чтобы правильно интегрировать это с FSD:

1. Определите компоненты как серверные по умолчанию
2. Используйте директиву `'use client'` только там, где необходимо
3. Создавайте отдельные директории для серверных и клиентских компонентов, если это важно
   ```
   some-feature/
     ui/
       client/  # Клиентские компоненты с 'use client'
       server/  # Серверные компоненты (по умолчанию)
   ```

### Проблема: Данные на уровне маршрутов

Next.js позволяет получать данные на уровне маршрутов. Для соблюдения FSD:

1. Выделяйте логику получения данных на уровень сущностей:
   ```tsx
   // 6_entities/user/api/getUsers.ts
   export async function getUsers() {
     // Логика получения данных
   }
   
   // app/users/page.tsx
   import { getUsers } from '@/6_entities/user/api'
   import { UsersPage } from '@/3_pages/users/ui/users-page'
   
   export default async function Page() {
     const users = await getUsers()
     return <UsersPage users={users} />
   }
   ```

## Заключение

Данный подход к интеграции FSD с Next.js App Router позволяет получить преимущества обеих методологий и создавать хорошо структурированные, масштабируемые приложения. Главное помнить, что App Router служит точкой входа и маршрутизации, а вся бизнес-логика и компоненты должны располагаться в соответствующих FSD-слоях.

Использовать этот подход стоит гибко, адаптируя его под конкретные нужды проекта и команды. 
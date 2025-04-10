# Feature-Sliced Design: Универсальное руководство

## Обзор

Feature-Sliced Design (FSD) - методология организации кода, основанная на принципах разделения кода по слоям и слайсам. Этот подход обеспечивает:

- Организацию кода в соответствии с бизнес-логикой
- Хорошую масштабируемость проекта
- Независимость и переиспользуемость компонентов
- Строгую инкапсуляцию с помощью публичных API
- Независимость от фреймворков и библиотек

## Структура проекта

```
src/
  1_app/                      # Инициализация приложения
    _providers/               # Провайдеры контекста
    _styles/                  # Глобальные стили
    _config/                  # Глобальная конфигурация
    index.ts                  # Точка входа в приложение
    
  2_processes/                # [Опционально] Бизнес-процессы
    auth-flow/                # Процесс аутентификации
    payment-flow/             # Процесс оплаты
    index.ts                  # Публичный API слоя
    
  3_pages/                    # Страницы приложения
    home/
      ui/
        home-page.tsx         # Компонентный слой страницы
      index.ts                # Публичный API слайса
    product/
      ui/
        product-page.tsx      # Компонентный слой страницы
      index.ts                # Публичный API слайса
    index.ts                  # Публичный API слоя
    
  4_widgets/                  # Композиционные блоки интерфейса
    header/
      ui/
        header.tsx            # Компонентный слой виджета
      index.ts                # Публичный API слайса
    footer/
      ui/
        footer.tsx            # Компонентный слой виджета
      index.ts                # Публичный API слайса
    index.ts                  # Публичный API слоя
    
  5_features/                 # Интерактивные функции
    auth/
      ui/
        login-form.tsx        # Компонентный слой фичи
      model/
        types.ts              # Типы
        auth-store.ts         # Состояние
      api/
        auth-api.ts           # API-клиент
      index.ts                # Публичный API слайса
    index.ts                  # Публичный API слоя
    
  6_entities/                 # Бизнес-сущности
    user/
      ui/
        user-card.tsx         # Представление сущности
      model/
        types.ts              # Типы
        user-store.ts         # Состояние
      api/
        user-api.ts           # API-клиент
      index.ts                # Публичный API слайса
    index.ts                  # Публичный API слоя
    
  7_shared/                   # Переиспользуемые компоненты и утилиты
    api/
      client.ts               # Базовый API-клиент
      index.ts                # Публичный API
    ui/
      button/
        ui/
          button.tsx          # Компонент кнопки
        index.ts              # Публичный API компонента
      index.ts                # Публичный API UI-компонентов
    lib/
      hooks/                  # Повторно используемые хуки
      helpers/                # Вспомогательные функции
      index.ts                # Публичный API библиотек
    config/
      index.ts                # Публичный API конфигураций
    index.ts                  # Публичный API слоя
```

## Принципы FSD

### 1. Слои

Проект разделен на слои, от наиболее общих (внизу) до наиболее специфичных (вверху):

1. **shared** — переиспользуемые модули, утилиты, UI-компоненты
2. **entities** — бизнес-сущности
3. **features** — функциональность для пользователя
4. **widgets** — композиция сущностей и фич в самостоятельные блоки
5. **pages** — композиция виджетов в страницы
6. **processes** — бизнес-процессы, объединяющие страницы
7. **app** — инициализация приложения, провайдеры, стили

### 2. Слайсы

Внутри каждого слоя код организован в слайсы — функциональные модули, связанные с конкретной бизнес-функцией:

- Слой **entities**: `user`, `product`, `order`, ...
- Слой **features**: `auth`, `cart`, `product-rating`, ...
- Слой **widgets**: `header`, `footer`, `product-card`, ...

### 3. Сегменты

Внутри каждого слайса код организован в сегменты по техническому назначению:

- **ui** — компоненты представления
- **model** — бизнес-логика и состояние
- **api** — взаимодействие с внешними сервисами
- **lib** — вспомогательные утилиты
- **config** — конфигурация

### 4. Правила импортов

Критически важное правило FSD: слои могут импортировать код только из нижележащих слоев:

- ✅ **pages** → **widgets** → **features** → **entities** → **shared**
- ❌ **entities** → **features** (запрещено)
- ❌ **widgets** → **pages** (запрещено)

Внутри одного слоя (горизонтальные зависимости):
- ❌ **user** → **product** (запрещено без явной необходимости)

#### Правила относительных и абсолютных импортов

В FSD существуют четкие правила для использования относительных и абсолютных импортов:

1. **Внутри слайса**: используйте относительные импорты
   ```ts
   // 6_entities/user/ui/user-card.tsx
   import { type User } from '../model/types'          // Правильно ✅
   import { getUserAvatar } from '../lib/avatar'       // Правильно ✅
   ```

2. **Внутри сегмента**: также используйте относительные импорты
   ```ts
   // 6_entities/user/ui/user-profile.tsx
   import { UserAvatar } from './user-avatar'          // Правильно ✅
   ```

3. **Между слайсами и слоями**: всегда используйте абсолютные импорты через публичный API
   ```ts
   // 5_features/auth/ui/login-form.tsx
   import { Button } from '@/7_shared/ui'              // Правильно ✅
   import { UserCard } from '@/6_entities/user'        // Правильно ✅
   
   // Неправильно: импорт из другого слоя через относительный путь ❌
   import { Button } from '../../../7_shared/ui/button/ui/button'
   ```

4. **Никогда не используйте глубокие относительные пути** с множеством `../..`:
   ```ts
   // Плохая практика ❌
   import { something } from '../../other-slice/model/types'
   ```

Такой подход обеспечивает:
- Четкую видимость внутренних и внешних зависимостей
- Простоту рефакторинга внутри слайса
- Изоляцию слайсов и слоев друг от друга
- Предотвращение случайного нарушения правил FSD

### 5. Публичный API (Public API)

Public API — основа инкапсуляции в FSD. Каждый модуль предоставляет четкий интерфейс через систему `index.ts` файлов:

#### Уровни Public API

1. **Публичный API компонента** (нижний уровень):
   ```ts
   // 7_shared/ui/button/index.ts
   export { Button } from './ui/button'
   export type { ButtonProps } from './ui/button'
   ```

2. **Публичный API слайса** (группы связанных компонентов):
   ```ts
   // 6_entities/user/index.ts
   export { UserCard } from './ui/user-card'
   export { getUserById } from './api/user-api'
   export type { User, UserRole } from './model/types'
   
   // НЕ экспортируем внутренние детали реализации
   // НЕ экспортируем userStore из ./model/user-store.ts
   ```

3. **Публичный API слоя** (верхний уровень):
   ```ts
   // 5_features/index.ts
   export * from './auth'
   export * from './cart'
   // Можно экспортировать только часть API слайсов
   ```

#### Правила публичного API

1. **Минимальный экспорт**: Экспортируйте только то, что должно быть использовано другими слоями
2. **Использование через публичный API**: Импортируйте только через публичный API:
   ```ts
   // Правильно:
   import { UserCard } from '@/6_entities/user'
   
   // Неправильно:
   import { UserCard } from '@/6_entities/user/ui/user-card'
   ```
3. **Именование файлов**:
   - `index.ts` — для публичного API
   - Внутренние файлы именуются по их функциональному назначению

4. **Структура публичного API**:
   ```ts
   // Экспорт типов
   export type { ButtonProps } from './ui/button'
   
   // Экспорт компонентов
   export { Button } from './ui/button'
   
   // Экспорт констант
   export { BUTTON_VARIANTS } from './constants'
   
   // Экспорт хуков
   export { useButton } from './hooks/use-button'
   ```

## Примеры организации кода по FSD

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

// 3_pages/users/index.ts
export { UsersPage } from './ui/users-page'
```

### Пример сущности

```tsx
// 6_entities/user/model/types.ts
export interface User {
  id: string
  name: string
  email: string
}

// 6_entities/user/ui/user-card.tsx
import type { User } from '../model/types'

interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// 6_entities/user/api/user-api.ts
import type { User } from '../model/types'

export async function getUserById(id: string): Promise<User> {
  // Логика получения пользователя
  return { id, name: 'Имя', email: 'email@example.com' }
}

// 6_entities/user/index.ts
export { UserCard } from './ui/user-card'
export { getUserById } from './api/user-api'
export type { User } from './model/types'
```

### Пример фичи

```tsx
// 5_features/auth/ui/login-form.tsx
import { Button } from '@/7_shared/ui/button'
import { Input } from '@/7_shared/ui/input'
import { useAuth } from '../model/use-auth'

export const LoginForm = () => {
  const { login, isLoading } = useAuth()
  
  return (
    <form onSubmit={login}>
      <Input name="email" />
      <Input name="password" type="password" />
      <Button type="submit" disabled={isLoading}>
        Войти
      </Button>
    </form>
  )
}

// 5_features/auth/index.ts
export { LoginForm } from './ui/login-form'
export { useAuth } from './model/use-auth'
```

## Преимущества FSD

1. **Масштабируемость**: Структура легко расширяется с ростом проекта
2. **Переиспользуемость**: Компоненты из нижних слоев можно использовать во многих местах
3. **Понятность**: Новые разработчики быстро понимают структуру проекта
4. **Изоляция**: Каждый слой и слайс имеет четкую зону ответственности
5. **Независимость от фреймворков**: Методология работает с любым фреймворком
6. **Инкапсуляция**: Публичный API защищает от использования внутренних деталей реализации

## Рекомендации по внедрению

1. **Постепенное внедрение**: Не обязательно сразу использовать все слои
2. **Адаптивность**: Приспосабливайте FSD под нужды проекта
3. **Атомарные коммиты**: Изменения в разных слоях лучше фиксировать в отдельных коммитах
4. **Префиксы в именовании**: Цифровые префиксы (1_, 2_, ...) помогают с сортировкой
5. **Осторожность с горизонтальными зависимостями**: Избегайте зависимостей между слайсами одного уровня

## Публичный API и инкапсуляция

Публичный API обеспечивает ключевые преимущества:

1. **Инкапсуляция**: Скрывает внутренние детали реализации
2. **Стабильность**: Позволяет менять реализацию без изменения интерфейса
3. **Контроль зависимостей**: Предотвращает случайное использование внутренних компонентов
4. **Документация**: Служит как документация доступного функционала
5. **Упрощение рефакторинга**: Локализует изменения при рефакторинге

### Пример эволюции модуля с публичным API

```ts
// Изначально
// 6_entities/user/index.ts
export { UserCard } from './ui/user-card'
export { getUserById } from './api/user-api'

// После рефакторинга (внутренняя реализация изменилась)
// 6_entities/user/index.ts - остался тем же!
export { UserCard } from './ui/user-card-v2' // Изменилась реализация
export { getUserById } from './api/user-graphql-api' // Сменился источник данных

// Клиентский код продолжает работать без изменений!
import { UserCard, getUserById } from '@/6_entities/user'
```

## Потенциальные сложности и их решения

### Сложность 1: Слишком много мелких компонентов

**Проблема**: Чрезмерная гранулярность компонентов затрудняет навигацию.

**Решение**: 
- Группируйте небольшие компоненты в более крупные
- Используйте вложенные структуры внутри слайса

### Сложность 2: Циклические зависимости

**Проблема**: Возникают циклические зависимости между слоями.

**Решение**:
- Реорганизуйте код, выделив общую часть в нижний слой
- Используйте паттерн "Адаптер"

### Сложность 3: Переусложнение структуры

**Проблема**: Для небольших проектов полная структура FSD избыточна.

**Решение**: 
- Начните с базовых слоев: shared, entities, features, pages
- Добавляйте остальные слои по мере необходимости

## Заключение

Feature-Sliced Design предоставляет гибкий подход к организации кода, который можно адаптировать под проекты любого размера и сложности. Ключевыми принципами остаются:

1. Разделение ответственности по слоям
2. Инкапсуляция через публичный API
3. Строгие правила импортов
4. Группировка кода по бизнес-функциональности

FSD помогает организовать код таким образом, чтобы он был понятным, масштабируемым и поддерживаемым на протяжении всего жизненного цикла проекта. 
# ESLint конфигурация для Feature-Sliced Design

## Обзор

Данная конфигурация ESLint обеспечивает контроль следования принципам FSD путем проверки правил импортов между слоями и слайсами. Это помогает избежать нарушения архитектуры и делает код более поддерживаемым.

## Установка зависимостей

```bash
npm install -D eslint eslint-plugin-import eslint-plugin-boundaries eslint-plugin-import-alias
```

## Базовая конфигурация

Создайте файл `.eslintrc.js` в корне проекта:

```js
module.exports = {
  root: true,
  extends: [
    // ... ваши другие конфигурации
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript', // если используете TypeScript
    'plugin:boundaries/recommended',
  ],
  plugins: [
    'import',
    'boundaries',
    'import-alias',
  ],
  settings: {
    // Настройка путей для импортов
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
    // Определение границ слоев для FSD
    'boundaries/elements': [
      {
        type: 'app',
        pattern: 'src/1_app/**',
      },
      {
        type: 'processes',
        pattern: 'src/2_processes/**',
      },
      {
        type: 'pages',
        pattern: 'src/3_pages/**',
      },
      {
        type: 'widgets',
        pattern: 'src/4_widgets/**',
      },
      {
        type: 'features',
        pattern: 'src/5_features/**',
      },
      {
        type: 'entities',
        pattern: 'src/6_entities/**',
      },
      {
        type: 'shared',
        pattern: 'src/7_shared/**',
      },
    ],
    // Определяем типы файлов
    'boundaries/ignore': ['**/*.test.*', '**/*.stories.*', '**/testing/**'],
  },
  rules: {
    // Правила для контроля импортов между слоями FSD
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message: 'Импорт из этого слоя запрещен по правилам FSD',
        rules: [
          // app может импортировать из всех слоев
          {
            from: 'app',
            allow: ['processes', 'pages', 'widgets', 'features', 'entities', 'shared'],
          },
          // processes могут импортировать из нижележащих слоев
          {
            from: 'processes',
            allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
          },
          // pages могут импортировать из нижележащих слоев
          {
            from: 'pages',
            allow: ['widgets', 'features', 'entities', 'shared'],
          },
          // widgets могут импортировать из нижележащих слоев
          {
            from: 'widgets',
            allow: ['features', 'entities', 'shared'],
          },
          // features могут импортировать из нижележащих слоев
          {
            from: 'features',
            allow: ['entities', 'shared'],
          },
          // entities могут импортировать только из shared
          {
            from: 'entities',
            allow: ['shared'],
          },
          // shared не может импортировать из других слоев
          {
            from: 'shared',
            allow: [],
          },
        ],
      },
    ],
    
    // Запрет прямых импортов из других слайсов в том же слое
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Запрет импортов из других слайсов в том же слое (кроме через публичный API)
          {
            group: ['@/6_entities/*/!(index)'],
            message: 'Импортируйте только через публичный API (index.ts)'
          },
          {
            group: ['@/5_features/*/!(index)'],
            message: 'Импортируйте только через публичный API (index.ts)'
          },
          {
            group: ['@/4_widgets/*/!(index)'],
            message: 'Импортируйте только через публичный API (index.ts)'
          },
          {
            group: ['@/3_pages/*/!(index)'],
            message: 'Импортируйте только через публичный API (index.ts)'
          },
        ]
      }
    ],
    
    // Порядок импортов по слоям
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',    // Встроенные модули Node.js (fs, path и т.д.)
          'external',   // Сторонние библиотеки
          'internal',   // Внутренние импорты (через алиасы)
          'parent',     // Импорты из родительских каталогов (../)
          'sibling',    // Импорты из того же каталога (./)
          'index',      // Импорты из файла index
          'object',     // Импорты объектов
          'type'        // Импорты типов
        ],
        'pathGroups': [
          // Определяем порядок импортов по слоям FSD
          { 'pattern': '@/1_app/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/2_processes/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/3_pages/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/4_widgets/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/5_features/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/6_entities/**', 'group': 'internal', 'position': 'before' },
          { 'pattern': '@/7_shared/**', 'group': 'internal', 'position': 'before' },
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }
    ],
    
    // Правило для запрета импортов через '../..' (максимум один уровень вверх)
    'import/no-parent-imports': [
      'error',
      { 
        allow: ['..'] // Разрешаем только '../' импорты, но не '../../'
      }
    ],
    
    // Запрет относительных импортов из других слоев
    'import-alias/import-alias': [
      'error',
      {
        relativeDepth: 1, // Максимальная глубина относительных импортов
        aliases: [
          { alias: '@', matcher: '^src' },
        ]
      }
    ],

    // Запрет импорта внутренних модулей напрямую, минуя публичный API
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          // Разрешаем относительные импорты внутри слайса
          '**/*/ui/*',
          '**/*/model/*',
          '**/*/api/*',
          '**/*/lib/*',
          '**/*/config/*',
          // и другие необходимые исключения
        ]
      }
    ],
  }
};
```

## Дополнительная конфигурация для больших проектов

Для более детальной настройки проверки импортов между слайсами, добавьте правило `boundaries/entry-point`:

```js
'boundaries/entry-point': [
  'error',
  {
    default: 'disallow',
    rules: [
      // Определим каждый слайс и правила импорта для него
      {
        target: 'src/6_entities/user/**',
        from: [
          'src/6_entities/user/index.ts', // Разрешаем импорт только через index.ts
        ],
      },
      {
        target: 'src/6_entities/product/**',
        from: [
          'src/6_entities/product/index.ts',
        ],
      },
      // и так далее для каждого слайса
    ],
  },
],
```

## Интеграция с TypeScript

Для проектов с TypeScript рекомендуется добавить:

```js
// typescript-eslint конфигурация
extends: [
  'plugin:@typescript-eslint/recommended',
],
plugins: [
  '@typescript-eslint',
],
parser: '@typescript-eslint/parser',
parserOptions: {
  project: './tsconfig.json',
  ecmaVersion: 2020,
  sourceType: 'module',
},
```

## Автоматическое создание eslint-ignore комментариев

```js
// .eslintrc.js
overrides: [
  {
    files: ['**/ui/**/*.tsx', '**/ui/**/*.ts'],
    rules: {
      // Правила для UI-компонентов
    }
  },
  {
    files: ['**/model/**/*.ts'],
    rules: {
      // Правила для моделей
    }
  },
  // и т.д.
]
```

## Настройка пакетов для VSCode

Для удобства работы с ESLint в VS Code, установите расширение ESLint и добавьте в настройки:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.options": {
    "extensions": [".js", ".jsx", ".ts", ".tsx"]
  }
}
```

## Команды npm для проверки

Добавьте в package.json:

```json
"scripts": {
  "lint": "eslint \"**/*.{ts,tsx}\"",
  "lint:fix": "eslint \"**/*.{ts,tsx}\" --fix"
}
```

## Дополнительные плагины для продвинутой проверки FSD

- [eslint-plugin-fsd](https://github.com/feature-sliced/eslint-plugin) - официальный плагин для проверки FSD
- [eslint-plugin-path-checker](https://github.com/tinovyatkin/eslint-plugin-path-checker) - для проверки абсолютных и относительных путей

## Пример пользовательского плагина

Для сложных кастомных проверок можно создать свой плагин. Пример:

```js
// eslint-local-plugins.js
module.exports = {
  rules: {
    'public-api-imports': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce using public API imports',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            // Логика проверки импортов
            // ...
          }
        };
      }
    }
  }
};
```

## Заключение

Данная конфигурация ESLint помогает поддерживать архитектуру FSD и предотвращает нарушение ее принципов. Настройте правила под свой проект и используйте линтер как часть процесса разработки и CI/CD, чтобы обеспечить соблюдение архитектурных принципов всей командой. 
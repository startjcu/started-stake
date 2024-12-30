import typescriptEslintParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';


export default [
  // 解析 TypeScript 代码
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': typescriptEslintPlugin
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  // React Hooks 推荐配置
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules
    }
  },
  // TypeScript ESLint 推荐配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules
    }
  }
];
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'react/jsx-no-comment-textnodes': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '_site/**',
    'node_modules/**',
    'docs/archive/**',
  ]),
]);

import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTypescript from 'typescript-eslint';
import eslintJsdocPlugin from 'eslint-plugin-jsdoc';
import eslintMochaPlugin from 'eslint-plugin-mocha';
import eslintPrettierConfig from 'eslint-config-prettier';
import eslintChaiExpectPlugin from 'eslint-plugin-chai-expect';

export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.mocha,
      },
    },
    plugins: {
      'jsdoc': eslintJsdocPlugin,
      'mocha': eslintMochaPlugin,
      'chai-expect': eslintChaiExpectPlugin,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...eslintPrettierConfig.rules,
      ...eslintMochaPlugin.configs.flat.recommended.rules,
      ...eslintChaiExpectPlugin.configs['recommended-flat'].rules,
      ...eslintJsdocPlugin.configs['flat/recommended-error'].rules,
      'no-unused-vars': ['error', {'caughtErrors': 'none'}],
      'jsdoc/require-param-description': 0,
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-property-description': 0,
      'jsdoc/tag-lines': ['error', 'any', {startLines: 1}],
    },
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.d.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.mocha,
      },
      parser: eslintTypescript.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': eslintTypescript.plugin,
      'mocha': eslintMochaPlugin,
      'chai-expect': eslintChaiExpectPlugin,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...eslintPrettierConfig.rules,
      ...eslintTypescript.configs.recommended.rules,
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-unnecessary-type-constraint': 0,
    },
  },
];

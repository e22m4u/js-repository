module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 13,
  },
  overrides: [
    {
      files: ['**/*.js'],
      plugins: [
        'mocha',
        'jsdoc',
        'chai-expect',
      ],
      extends: [
        'prettier',
        'plugin:jsdoc/recommended',
        'plugin:mocha/recommended',
        'plugin:chai-expect/recommended',
        'plugin:jsdoc/recommended-error',
      ],
      rules: {
        'jsdoc/require-param-description': 0,
        'jsdoc/require-returns-description': 0,
        'jsdoc/require-property-description': 0,
        'jsdoc/tag-lines': ['error', 'any', {startLines: 1}],
      },
    },
    {
      files: ['**/*.ts'],
      plugins: [
        'mocha',
        'chai-expect',
        '@typescript-eslint',
      ],
      extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-namespace': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unnecessary-type-constraint': 0,
      },
    }
  ]
}

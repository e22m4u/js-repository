module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 13,
  },
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
    'jsdoc/tag-lines': ['error', 'any', {startLines: 1}],
  },
}

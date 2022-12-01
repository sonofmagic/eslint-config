/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    'jest/globals': true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  rules: {
    'prettier/prettier': 'error'
  }
}

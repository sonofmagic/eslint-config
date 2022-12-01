/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@icebreakers/eslint-config-basic'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint']
}

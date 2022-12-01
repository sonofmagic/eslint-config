/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    'jest/globals': true
  },
  // https://www.npmjs.com/package/eslint-plugin-prettier
  extends: ['standard', 'plugin:prettier/recommended'],
  plugins: ['jest']
}

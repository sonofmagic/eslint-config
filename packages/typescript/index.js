/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@icebreakers/eslint-config-basic'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  // https://stackoverflow.com/questions/67437478/why-eslint-dont-see-global-typescript-types-in-vue-files-no-undef
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}

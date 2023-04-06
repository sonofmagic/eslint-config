/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@icebreakers/eslint-config-basic'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  // https://typescript-eslint.io/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
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

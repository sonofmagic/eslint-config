import type { JestConfigWithTsJest } from 'ts-jest'
export default <JestConfigWithTsJest>{
  // preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  projects: [
    {
      displayName: '@icebreakers/eslint-config-basic',
      rootDir: '<rootDir>/packages/basic'
    },
    {
      displayName: '@icebreakers/eslint-config-ts',
      rootDir: '<rootDir>/packages/typescript'
    }
  ]
}

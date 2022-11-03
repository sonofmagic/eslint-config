import type { JestConfigWithTsJest } from 'ts-jest'
export default <JestConfigWithTsJest>{
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/dist/', '<rootDir>/node_modules/'],
  coverageDirectory: '<rootDir>/coverage/',
  verbose: true
}

import type { JestConfigWithTsJest } from 'ts-jest'
import base from './jest.config.base'
export default <JestConfigWithTsJest>{
  ...base,
  projects: ['<rootDir>/packages/basic', '<rootDir>/packages/typescript']
}

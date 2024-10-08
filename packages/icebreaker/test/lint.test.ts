import path from 'node:path'
import { icebreaker, icebreakerLegacy } from '@/index'
import { ESLint } from 'eslint'
import fs from 'fs-extra'

const mockSrcDir = path.resolve(__dirname, '../../../apps/mock/src')
const files = await fs.readdir(mockSrcDir)
describe('lint', () => {
  let eslint: ESLint
  let legacyEslint: ESLint
  // 初始化 ESLint 实例，加载你的配置
  beforeEach(async () => {
    eslint = new ESLint({
      overrideConfig: await icebreaker(),
    })

    legacyEslint = new ESLint({
      overrideConfig: await icebreakerLegacy(),
    })
  })

  it('common', async () => {
    for (const file of files) {
      const [x] = await eslint.lintFiles(path.resolve(mockSrcDir, file))
      if (file.endsWith('.css')) {
        expect(x.errorCount).toBe(0)
      }
      else if (file.endsWith('.scss')) {
        expect(x.errorCount).toBe(0)
      }
      else if (file.endsWith('.js')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.ts')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.jsx')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.tsx')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.vue')) {
        expect(x.errorCount).toBe(4)
        expect(x.warningCount).toBe(0)
      }
      expect(x).toMatchSnapshot(file)
    }
  })

  it('legacy', async () => {
    for (const file of files) {
      const [x] = await legacyEslint.lintFiles(path.resolve(mockSrcDir, file))
      if (file.endsWith('.css')) {
        expect(x.errorCount).toBe(0)
      }
      else if (file.endsWith('.scss')) {
        expect(x.errorCount).toBe(0)
      }
      else if (file.endsWith('.js')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.ts')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.jsx')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.tsx')) {
        expect(x.errorCount).toBe(3)
      }
      else if (file.endsWith('.vue')) {
        expect(x.errorCount).toBe(4)
        expect(x.warningCount).toBe(0)
      }
      expect(x).toMatchSnapshot(file)
    }
  })
})

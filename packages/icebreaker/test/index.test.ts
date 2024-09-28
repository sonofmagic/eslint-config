import { icebreaker } from '@/index'
import ci from 'ci-info'
import { ESLint } from 'eslint'
import path from 'pathe'

describe.skipIf(ci.isCI)('index', () => {
  it('mdx', async () => {
    const plugins = await icebreaker({
      mdx: true,
    })
    expect(plugins).toMatchFileSnapshot('./__snapshots__/mdx.test.ts.snap')
  })

  it('tailwindcss', async () => {
    const plugins = await icebreaker({
      tailwindcss: true,
    })
    expect(plugins).toMatchFileSnapshot('./__snapshots__/tailwindcss.test.ts.snap')
  })

  // it('loadESLint', async () => {
  //   const cwd = path.resolve(__dirname, '../../..')
  //   process.chdir(cwd)
  //   const lint = await loadESLint({
  //     useFlatConfig: true,
  //   })
  //   console.log(lint)
  //   lint.outputFixes()
  // })

  it('eslint', async () => {
    const lint = new ESLint({
      baseConfig: await icebreaker(),
      ignore: false,
    })
    const result = await lint.lintFiles(path.resolve(__dirname, '../fixtures/input'))

    expect(result).toBeDefined()

    // console.log(await ESLint.outputFixes(result))
  })
})

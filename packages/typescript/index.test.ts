import { ESLint } from 'eslint'
import { resolve } from 'path'
import { eslintFormatParser } from '@icebreakers/test-utils'
describe('typescript', () => {
  const eslint = new ESLint({
    overrideConfigFile: resolve(__dirname, 'index.js'),
    useEslintrc: false
  })
  it('snapshot', async () => {
    const res = await eslint.calculateConfigForFile(resolve(__dirname, 'index.js'))
    res.parser = eslintFormatParser(res.parser)
    expect(res).toMatchSnapshot()
  })
})

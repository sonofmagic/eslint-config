import { ESLint } from 'eslint'
import { resolve } from 'path'
describe('basic', () => {
  const eslint = new ESLint()
  it('snapshot', async () => {
    const res = await eslint.calculateConfigForFile(resolve(__dirname, 'index.js'))
    expect(res).toMatchSnapshot()
  })
})

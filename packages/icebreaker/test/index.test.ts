import ci from 'ci-info'
import { icebreaker } from '../src/index'

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
})

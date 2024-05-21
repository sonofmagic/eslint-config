import { icebreaker } from '../src/index'

describe('index', () => {
  it('mdx', async () => {
    const plugins = await icebreaker({
      mdx: true,
    })
    console.log(plugins)
  })
})

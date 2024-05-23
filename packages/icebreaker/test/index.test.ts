import { icebreaker } from '../src/index'

describe('index', () => {
  it('mdx', async () => {
    const plugins = icebreaker({
      mdx: true,
    })
    console.log(plugins)
  })
})

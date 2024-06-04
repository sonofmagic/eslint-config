import { icebreaker } from '../src/index'

describe('index', () => {
  it('mdx', async () => {
    const plugins = await icebreaker({
      mdx: true,
    })
    console.log(plugins)
  })

  it('tailwindcss', async () => {
    const plugins = await icebreaker({
      tailwindcss: true,
    })
    console.log(plugins)
  })
})

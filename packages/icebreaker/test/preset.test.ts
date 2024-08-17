import { getRestConfigAndPresets } from '@/factory'

describe('presets', () => {
  it('c', () => {
    expect(getRestConfigAndPresets()).toMatchSnapshot()
  })
  it('c0', () => {
    expect(getRestConfigAndPresets({ a11y: true })).toMatchSnapshot()
  })
  it('c1', () => {
    expect(getRestConfigAndPresets({ vue: true })).toMatchSnapshot()
  })
  it('c2', () => {
    expect(getRestConfigAndPresets({ vue: {
      vueVersion: 3,
    } })).toMatchSnapshot()
  })
  it('c3', () => {
    expect(getRestConfigAndPresets({
      vue: {
        vueVersion: 2,
      },
    })).toMatchSnapshot()
  })
})

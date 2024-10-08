import { getPresets } from '@/preset'

describe('presets', () => {
  it('c', () => {
    expect(getPresets()).toMatchSnapshot()
  })
  it('c0', () => {
    expect(getPresets({ a11y: true })).toMatchSnapshot()
  })
  it('c1', () => {
    expect(getPresets({ vue: true })).toMatchSnapshot()
  })
  it('c2', () => {
    expect(getPresets({ vue: {
      vueVersion: 3,
    } })).toMatchSnapshot()
  })
  it('c3', () => {
    expect(getPresets({
      vue: {
        vueVersion: 2,
      },
    })).toMatchSnapshot()
  })
})

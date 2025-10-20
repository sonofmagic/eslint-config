import type { UserDefinedOptions } from '@/types'
import { getPresets } from '@/preset'

function isPromise<T = unknown>(value: unknown): value is PromiseLike<T> {
  return typeof value === 'object' && value !== null && typeof (value as PromiseLike<T>).then === 'function'
}

async function materializePresets(options?: UserDefinedOptions) {
  const [resolvedOptions, ...rest] = getPresets(options)
  const resolvedConfigs = []

  for (const item of rest) {
    if (isPromise(item)) {
      resolvedConfigs.push(await item)
    }
    else {
      resolvedConfigs.push(item)
    }
  }

  return [resolvedOptions, ...resolvedConfigs] as const
}

describe('presets', () => {
  it('c', async () => {
    expect(await materializePresets()).toMatchSnapshot()
  })
  it('c0', async () => {
    expect(await materializePresets({ a11y: true })).toMatchSnapshot()
  })
  it('c1', async () => {
    expect(await materializePresets({ vue: true })).toMatchSnapshot()
  })
  it('c2', async () => {
    expect(await materializePresets({ vue: {
      vueVersion: 3,
    } })).toMatchSnapshot()
  })
  it('c3', async () => {
    expect(await materializePresets({
      vue: {
        vueVersion: 2,
      },
    })).toMatchSnapshot()
  })
  it('nestjs', async () => {
    expect(await materializePresets({ nestjs: true, typescript: true })).toMatchSnapshot()
  })
})

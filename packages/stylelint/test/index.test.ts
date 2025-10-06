import { createRequire } from 'node:module'
import { createStylelintConfig, icebreaker } from '@/index'
import { setVscodeSettingsJson } from '@/shared'

const testRequire = createRequire(import.meta.url)

const PRESET_PATH_STANDARD_SCSS = testRequire.resolve('stylelint-config-standard-scss')
const PRESET_PATH_VUE_SCSS = testRequire.resolve('stylelint-config-recommended-vue/scss')
const PRESET_PATH_RECESS_ORDER = testRequire.resolve('stylelint-config-recess-order')

describe('index', () => {
  it('setVscodeSettingsJson case 0', () => {
    expect(setVscodeSettingsJson()).toMatchSnapshot()
  })

  it('setVscodeSettingsJson case 1', () => {
    expect(setVscodeSettingsJson({
      'stylelint.validate': [
        'vue',
        'scss',
        'css',
      ],
    })).toMatchSnapshot()
  })

  it('common', () => {
    const config = icebreaker()

    expect(config.extends).toEqual([
      PRESET_PATH_STANDARD_SCSS,
      PRESET_PATH_VUE_SCSS,
      PRESET_PATH_RECESS_ORDER,
    ])

    expect({
      ...config,
      extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue/scss',
        'stylelint-config-recess-order',
      ],
    }).toMatchSnapshot()
  })

  it('createStylelintConfig toggles presets', () => {
    const config = createStylelintConfig({
      presets: {
        vue: false,
        order: false,
      },
      extends: 'my-custom-config',
    })

    expect(config.extends).toEqual([
      PRESET_PATH_STANDARD_SCSS,
      'my-custom-config',
    ])
  })

  it('createStylelintConfig custom ignores', () => {
    const config = createStylelintConfig({
      ignores: {
        units: [],
        addUnits: ['upx'],
        atRules: ['tailwind'],
        addAtRules: ['uno-layer'],
      },
    })

    expect(config.rules?.['unit-no-unknown']).toEqual([
      true,
      {
        ignoreUnits: ['upx'],
      },
    ])

    expect(config.rules?.['scss/at-rule-no-unknown']).toEqual([
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'uno-layer',
        ],
      },
    ])
  })
})

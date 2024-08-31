import { setVscodeSettingsJson } from '@/shared'
import { icebreaker } from '@/index'

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
    expect(icebreaker()).toMatchSnapshot()
  })
})

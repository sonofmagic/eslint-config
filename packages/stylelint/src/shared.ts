import set from 'set-value'
import get from 'get-value'

export function setVscodeSettingsJson(json: any = {}) {
  set(json, 'css\\.validate', false)
  set(json, 'less\\.validate', false)
  set(json, 'scss\\.validate', false)
  const stylelintValidates = new Set(get(json, 'stylelint\\.validate', { default: [] }) as string[])
  stylelintValidates.add('vue')
  set(json, 'stylelint\\.validate', Array.from(stylelintValidates))
  return json
}
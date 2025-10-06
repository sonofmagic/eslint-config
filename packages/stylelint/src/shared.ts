export type VscodeSettings = Record<string, unknown>

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is string => typeof entry === 'string')
}

export function setVscodeSettingsJson(json: VscodeSettings = {}): VscodeSettings {
  json['css.validate'] = false
  json['less.validate'] = false
  json['scss.validate'] = false

  const existing = new Set(asStringArray(json['stylelint.validate']))
  existing.add('vue')
  existing.add('css')
  existing.add('scss')

  json['stylelint.validate'] = Array.from(existing)
  return json
}

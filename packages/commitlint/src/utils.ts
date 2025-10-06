import type { CommitTypeDefinition } from './types'

export function toArray<T>(value?: T | T[]): T[] {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

export function unique<T>(values: Iterable<T>): T[] {
  const seen = new Set<T>()
  const result: T[] = []
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }
  return result
}

export function toTitleCase(value: string): string {
  return value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export function createDefaultCommitTypeDefinition(value: string): CommitTypeDefinition {
  return {
    value,
    title: toTitleCase(value),
    description: 'Custom change type',
  }
}

export function mergeTypeDefinitions(
  defaults: CommitTypeDefinition[],
  overrides: CommitTypeDefinition[] = [],
): Map<string, CommitTypeDefinition> {
  const map = new Map<string, CommitTypeDefinition>()
  for (const definition of defaults) {
    map.set(definition.value, definition)
  }
  for (const definition of overrides) {
    map.set(definition.value, definition)
  }
  return map
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.prototype.toString.call(value) === '[object Object]',
  )
}

export function mergeDeep<T extends Record<string, any>>(base: T, override?: Partial<T>): T {
  if (!override) {
    return base
  }

  const output: Record<string, any> = { ...base }

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) {
      continue
    }

    const baseValue = output[key]

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      output[key] = mergeDeep(baseValue, value)
      continue
    }

    if (Array.isArray(value)) {
      output[key] = [...value]
      continue
    }

    output[key] = value
  }

  return output as T
}

export function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined)
  return Object.fromEntries(entries) as T
}

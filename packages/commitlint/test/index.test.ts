import { describe, expect, it } from 'vitest'
import {
  createIcebreakerCommitlintConfig,
  DEFAULT_COMMIT_TYPES,
  DEFAULT_TYPES,
  RuleConfigSeverity,
} from '../src'

describe('createIcebreakerCommitlintConfig', () => {
  it('returns the default configuration', () => {
    const config = createIcebreakerCommitlintConfig()

    expect(config.extends).toEqual(['@commitlint/config-conventional'])
    expect(config.parserPreset).toBe('conventional-changelog-conventionalcommits')

    const typeRule = config.rules?.['type-enum'] as [number, string, string[]]
    expect(typeRule[0]).toBe(RuleConfigSeverity.Error)
    expect(typeRule[1]).toBe('always')
    expect(typeRule[2]).toEqual(DEFAULT_TYPES)

    const promptTypes = config.prompt?.questions?.type?.enum
    for (const definition of DEFAULT_COMMIT_TYPES) {
      expect(promptTypes?.[definition.value]?.title).toBe(definition.title)
    }
  })

  it('allows extending commit types with prompt metadata', () => {
    const config = createIcebreakerCommitlintConfig({
      types: {
        add: ['deps'],
        definitions: [
          {
            value: 'deps',
            title: 'Dependencies',
            description: 'Dependency updates',
            emoji: '📦',
          },
        ],
      },
    })

    const typeRule = config.rules?.['type-enum'] as [number, string, string[]]
    expect(typeRule[2]).toContain('deps')

    const promptTypes = config.prompt?.questions?.type?.enum
    expect(promptTypes?.deps?.title).toBe('Dependencies')
    expect(promptTypes?.deps?.description).toBe('Dependency updates')
  })

  it('configures scope rules with enum, case and presence constraints', () => {
    const config = createIcebreakerCommitlintConfig({
      scopes: {
        values: ['core', 'docs'],
        required: true,
        case: 'lower-case',
      },
    })

    const scopeEnum = config.rules?.['scope-enum'] as [number, string, string[]]
    expect(scopeEnum).toEqual([RuleConfigSeverity.Error, 'always', ['core', 'docs']])

    const scopeEmpty = config.rules?.['scope-empty'] as [number, string]
    expect(scopeEmpty).toEqual([RuleConfigSeverity.Error, 'never'])

    const scopeCase = config.rules?.['scope-case'] as [number, string, string[]]
    expect(scopeCase).toEqual([RuleConfigSeverity.Error, 'always', ['lower-case']])
  })

  it('supports subject rule overrides', () => {
    const config = createIcebreakerCommitlintConfig({
      subject: {
        forbidden: ['camel-case'],
        caseSeverity: RuleConfigSeverity.Warning,
        allowEmpty: true,
        fullStop: false,
      },
    })

    const subjectCase = config.rules?.['subject-case'] as [number, string, string[]]
    expect(subjectCase).toEqual([
      RuleConfigSeverity.Warning,
      'never',
      ['camel-case'],
    ])

    const subjectEmpty = config.rules?.['subject-empty'] as [number]
    expect(subjectEmpty).toEqual([RuleConfigSeverity.Disabled])

    const subjectFullStop = config.rules?.['subject-full-stop'] as [number]
    expect(subjectFullStop).toEqual([RuleConfigSeverity.Disabled])
  })

  it('merges custom rule overrides', () => {
    const config = createIcebreakerCommitlintConfig({
      rules: {
        'body-max-line-length': [RuleConfigSeverity.Disabled],
      },
    })

    expect(config.rules?.['body-max-line-length']).toEqual([
      RuleConfigSeverity.Disabled,
    ])
  })

  it('deduplicates extend entries while preserving order', () => {
    const config = createIcebreakerCommitlintConfig({
      extends: [
        '@commitlint/config-conventional',
        '@commitlint/config-conventional',
        '@icebreakers/custom',
      ],
    })

    expect(config.extends).toEqual([
      '@commitlint/config-conventional',
      '@icebreakers/custom',
    ])
  })

  it('allows tweaking header limits', () => {
    const config = createIcebreakerCommitlintConfig({
      header: {
        maxLength: 120,
        severity: RuleConfigSeverity.Warning,
      },
    })

    const headerRule = config.rules?.['header-max-length'] as [number, string, number]
    expect(headerRule).toEqual([RuleConfigSeverity.Warning, 'always', 120])
  })
})

import type { TargetCaseType } from '@commitlint/types'
import type { CommitTypeDefinition } from './types'

export const DEFAULT_PARSER_PRESET = 'conventional-changelog-conventionalcommits'

export const DEFAULT_HEADER_MAX_LENGTH = 100
export const DEFAULT_BODY_MAX_LINE_LENGTH = 100
export const DEFAULT_FOOTER_MAX_LINE_LENGTH = 100
export const DEFAULT_FULL_STOP = '.'

export const DEFAULT_SUBJECT_FORBIDDEN_CASES: TargetCaseType[] = [
  'sentence-case',
  'start-case',
  'pascal-case',
  'upper-case',
]

export const DEFAULT_COMMIT_TYPES: CommitTypeDefinition[] = [
  {
    value: 'build',
    title: 'Builds',
    description:
      'Changes that affect the build system or external dependencies (example scopes: pnpm, webpack, docker)',
    emoji: '🛠',
  },
  {
    value: 'chore',
    title: 'Chores',
    description: 'Other changes that don\'t modify src or test files',
    emoji: '♻️',
  },
  {
    value: 'ci',
    title: 'Continuous Integrations',
    description:
      'Changes to our CI configuration files and scripts (example scopes: GitHub Actions, Travis, Circle)',
    emoji: '⚙️',
  },
  {
    value: 'docs',
    title: 'Documentation',
    description: 'Documentation only changes',
    emoji: '📚',
  },
  {
    value: 'feat',
    title: 'Features',
    description: 'A new feature',
    emoji: '✨',
  },
  {
    value: 'fix',
    title: 'Bug Fixes',
    description: 'A bug fix',
    emoji: '🐛',
  },
  {
    value: 'perf',
    title: 'Performance Improvements',
    description: 'A code change that improves performance',
    emoji: '🚀',
  },
  {
    value: 'refactor',
    title: 'Code Refactoring',
    description: 'A code change that neither fixes a bug nor adds a feature',
    emoji: '📦',
  },
  {
    value: 'revert',
    title: 'Reverts',
    description: 'Reverts a previous commit',
    emoji: '🗑',
  },
  {
    value: 'style',
    title: 'Styles',
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    emoji: '💎',
  },
  {
    value: 'test',
    title: 'Tests',
    description: 'Adding missing tests or correcting existing tests',
    emoji: '🚨',
  },
]

export const DEFAULT_TYPES = DEFAULT_COMMIT_TYPES.map(type => type.value)

export const DEFAULT_PROMPT_SCOPE_DESCRIPTION
  = 'What is the scope of this change (e.g. component or file name)'
export const DEFAULT_PROMPT_TYPE_DESCRIPTION
  = 'Select the type of change that you\'re committing'
export const DEFAULT_PROMPT_SUBJECT_DESCRIPTION
  = 'Write a short, imperative tense description of the change'
export const DEFAULT_PROMPT_BODY_DESCRIPTION
  = 'Provide a longer description of the change'
export const DEFAULT_PROMPT_IS_BREAKING_DESCRIPTION
  = 'Are there any breaking changes?'
export const DEFAULT_PROMPT_BREAKING_BODY_DESCRIPTION
  = 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
export const DEFAULT_PROMPT_BREAKING_DESCRIPTION
  = 'Describe the breaking changes'
export const DEFAULT_PROMPT_IS_ISSUE_AFFECTED_DESCRIPTION
  = 'Does this change affect any open issues?'
export const DEFAULT_PROMPT_ISSUES_BODY_DESCRIPTION
  = 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
export const DEFAULT_PROMPT_ISSUES_DESCRIPTION
  = 'Add issue references (e.g. "fix #123", "re #123".)'

export const DEFAULT_EXTENDS = ['@commitlint/config-conventional']

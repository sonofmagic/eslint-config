import {
  getInfo,
  getInfoFromPullRequest,
} from '@changesets/get-github-info'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getDependencyReleaseLine,
  getReleaseLine,
} from '@/index'

vi.mock('@changesets/get-github-info', () => ({
  getInfo: vi.fn(),
  getInfoFromPullRequest: vi.fn(),
}))

const getInfoMock = vi.mocked(getInfo)
const getInfoFromPullRequestMock = vi.mocked(getInfoFromPullRequest)

const repo = 'icebreaker/eslint-config'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getReleaseLine', () => {
  const baseChangeset = {
    id: 'abc',
    summary:
      'Add new lint rule\n- ensure coverage for edge cases\nPR: #123\nCommit: abcdef1234567890\nAuthor: lint-bot',
    releases: [],
  }

  it('throws when repo option is missing', async () => {
    await expect(
      getReleaseLine(
        { ...baseChangeset },
        'minor',
        undefined as unknown as Record<string, any>,
      ),
    ).rejects.toThrow(/Please provide a repo/)
  })

  it('formats summary with metadata inline', async () => {
    getInfoFromPullRequestMock.mockResolvedValueOnce({
      links: {
        pull: '[#123](https://github.com/icebreaker/eslint-config/pull/123)',
        commit: '[`a1b2c3d`](https://github.com/icebreaker/eslint-config/commit/a1b2c3d)',
        user: '[@core-dev](https://github.com/core-dev)',
      },
    })

    const result = await getReleaseLine(
      { ...baseChangeset },
      'minor',
      { repo },
    )

    expect(result).toContain('- Add new lint rule')
    expect(result).toContain('[#123](https://github.com/icebreaker/eslint-config/pull/123)')
    expect(result).toContain('[`abcdef1`](https://github.com/icebreaker/eslint-config/commit/abcdef1234567890)')
    expect(result).toContain('Thanks [@lint-bot](https://github.com/lint-bot)!')
    expect(result).toContain('  - ensure coverage for edge cases')
    expect(result).toContain('> MINOR release')
    expect(getInfoFromPullRequestMock).toHaveBeenCalledWith({
      repo,
      pull: 123,
    })
    expect(getInfoMock).not.toHaveBeenCalled()
  })
})

describe('getDependencyReleaseLine', () => {
  const dependenciesUpdated = [
    {
      name: '@icebreakers/eslint-config',
      newVersion: '1.2.3',
    },
    {
      name: 'vitest',
      newVersion: '1.0.0',
    },
  ]

  it('returns empty string when no dependencies updated', async () => {
    const result = await getDependencyReleaseLine([], [], { repo })
    expect(result).toBe('')
  })

  it('lists updated dependencies with commit references', async () => {
    getInfoMock.mockResolvedValue({
      links: {
        commit:
          '[`abcdef1`](https://github.com/icebreaker/eslint-config/commit/abcdef1234567890)',
        pull: null,
        user: null,
      },
    })

    const line = await getDependencyReleaseLine(
      [
        {
          id: 'test',
          summary: 'Update deps',
          releases: [],
          commit: 'abcdef1234567890',
        },
      ],
      dependenciesUpdated as any,
      { repo },
    )

    expect(line).toContain('- Updated dependencies ([`abcdef1`](https://github.com/icebreaker/eslint-config/commit/abcdef1234567890))')
    expect(line).toContain('  - `@icebreakers/eslint-config` @ 1.2.3')
    expect(line).toContain('  - `vitest` @ 1.0.0')
    expect(getInfoMock).toHaveBeenCalledWith({
      repo,
      commit: 'abcdef1234567890',
    })
  })
})

import type { ChangelogFunctions } from '@changesets/types'
import { getInfo, getInfoFromPullRequest } from '@changesets/get-github-info'
import { config as loadEnv } from 'dotenv'

loadEnv()

type ReleaseLineFn = NonNullable<ChangelogFunctions['getReleaseLine']>
type GeneratorOptions = Parameters<ReleaseLineFn>[2]

interface GitHubLinks {
  commit: string | null
  pull: string | null
  user: string | null
}

const releaseTypeMap = {
  major: { icon: '🚀', label: 'Major' },
  minor: { icon: '✨', label: 'Minor' },
  patch: { icon: '🐛', label: 'Patch' },
  none: { icon: '📝', label: 'Update' },
} as const

type ReleaseTypeKey = keyof typeof releaseTypeMap

function resolveReleaseType(type: string | undefined): ReleaseTypeKey {
  if (type && type in releaseTypeMap) {
    return type as ReleaseTypeKey
  }
  return 'none'
}

function assertRepo(
  options: GeneratorOptions | undefined,
): asserts options is GeneratorOptions & { repo: string } {
  if (!options || !options.repo) {
    throw new Error(
      'Please provide a repo to this changelog generator like this:\n"changelog": ["@icebreakers/changelog-github", { "repo": "org/repo" }]',
    )
  }
}

async function collectDependencyReferences(
  changesets: Parameters<ChangelogFunctions['getDependencyReleaseLine']>[0],
  repo: string,
): Promise<string[]> {
  const references = await Promise.all(
    changesets.map(async (cs) => {
      if (!cs.commit) {
        return null
      }

      const { links } = await getInfo({
        repo,
        commit: cs.commit,
      })

      return links.commit
    }),
  )

  return references.filter((link): link is string => Boolean(link))
}

function formatDependencyLine(
  references: string[],
  dependenciesUpdated: Parameters<
    ChangelogFunctions['getDependencyReleaseLine']
  >[1],
): string {
  const dependencySummaries = dependenciesUpdated.map(
    dependency => `\`${dependency.name}\` @ ${dependency.newVersion}`,
  )

  const segments: string[] = []

  if (dependencySummaries.length > 0) {
    segments.push(dependencySummaries.join(', '))
  }

  if (references.length > 0) {
    segments.push(references.join(' · '))
  }

  const details = segments.join(' · ')

  return details.length > 0
    ? `- 📦 Updated dependencies: ${details}`
    : '- 📦 Updated dependencies'
}

interface ParsedSummary {
  headline: string
  detailLines: string[]
  prNumber?: number
  commitRef?: string
  users: string[]
}

function parseSummary(summary: string): ParsedSummary {
  let prNumber: number | undefined
  let commitRef: string | undefined
  const users: string[] = []

  const cleanedSummary = summary
    .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
      const num = Number(pr)
      if (!Number.isNaN(num)) {
        prNumber = num
      }
      return ''
    })
    .replace(/^\s*commit:\s*(\S+)/im, (_, commit) => {
      commitRef = commit
      return ''
    })
    .replace(/^\s*(?:author|user):\s*@?(\S+)/gim, (_, user) => {
      users.push(user)
      return ''
    })
    .trim()

  const [headline = '', ...restLines] = cleanedSummary
    .split('\n')
    .map(line => line.trimRight())

  const detailLines = restLines
    .map(line => line.trim())
    .map(line => line.replace(/^\s*[-*]\s*/, ''))
    .filter(line => line.length > 0)

  return {
    headline,
    detailLines,
    prNumber,
    commitRef,
    users,
  }
}

async function resolveLinks(
  repo: string,
  parsed: ParsedSummary,
  changesetCommit: string | undefined,
): Promise<GitHubLinks> {
  if (parsed.prNumber !== undefined) {
    const { links } = await getInfoFromPullRequest({
      repo,
      pull: parsed.prNumber,
    })

    if (parsed.commitRef) {
      const shortCommitId = parsed.commitRef.slice(0, 7)
      links.commit = `[\`${shortCommitId}\`](https://github.com/${repo}/commit/${parsed.commitRef})`
    }

    return links
  }

  const commitToUse = parsed.commitRef ?? changesetCommit
  if (commitToUse) {
    const { links } = await getInfo({
      repo,
      commit: commitToUse,
    })

    return links
  }

  return {
    commit: null,
    pull: null,
    user: null,
  }
}

function buildUserMentions(
  users: string[],
  fallbackUser: string | null,
): string {
  if (users.length > 0) {
    return users
      .map(username => `[@${username}](https://github.com/${username})`)
      .join(', ')
  }

  return fallbackUser ?? ''
}

const changelogFunctions: ChangelogFunctions = {
  async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
    assertRepo(options)
    const { repo } = options

    if (dependenciesUpdated.length === 0) {
      return ''
    }

    const references = await collectDependencyReferences(
      changesets,
      repo,
    )

    return formatDependencyLine(references, dependenciesUpdated)
  },

  async getReleaseLine(changeset, type, options) {
    assertRepo(options)
    const { repo } = options

    const parsedSummary = parseSummary(changeset.summary)
    const resolvedType = resolveReleaseType(type)

    const links = await resolveLinks(
      repo,
      parsedSummary,
      changeset.commit,
    )

    const userMentions = buildUserMentions(
      parsedSummary.users,
      links.user,
    )

    const headlineText = parsedSummary.headline || 'Miscellaneous improvements'
    const detailText = parsedSummary.detailLines.join(' · ')

    const metaSegments: string[] = []

    if (links.pull) {
      metaSegments.push(links.pull)
    }

    if (links.commit) {
      metaSegments.push(links.commit)
    }

    if (userMentions) {
      metaSegments.push(`Thanks ${userMentions}`)
    }

    if (resolvedType !== 'none') {
      metaSegments.push(`${releaseTypeMap[resolvedType].label} release`)
    }

    const trailingSegments = [
      detailText,
      metaSegments.join(' · '),
    ].filter(segment => segment.length > 0)

    const suffix = trailingSegments.length
      ? ` — ${trailingSegments.join(' · ')}`
      : ''

    return `\n\n- ${releaseTypeMap[resolvedType].icon} **${headlineText}**${suffix}`
  },
}

export default changelogFunctions
export const { getDependencyReleaseLine, getReleaseLine } = changelogFunctions

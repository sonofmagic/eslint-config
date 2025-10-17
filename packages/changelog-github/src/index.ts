import type { ChangelogFunctions } from '@changesets/types'
import { getInfo, getInfoFromPullRequest } from '@changesets/get-github-info'
import { config as loadEnv } from 'dotenv'

loadEnv()

type ReleaseLineFn = NonNullable<ChangelogFunctions['getReleaseLine']>
type GeneratorOptions = Parameters<ReleaseLineFn>[2]

function assertRepo(
  options: GeneratorOptions | undefined,
): asserts options is GeneratorOptions & { repo: string } {
  if (!options || !options.repo) {
    throw new Error(
      'Please provide a repo to this changelog generator like this:\n"changelog": ["@icebreakers/changelog-github", { "repo": "org/repo" }]',
    )
  }
}

const changelogFunctions: ChangelogFunctions = {
  async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
    assertRepo(options)
    const { repo } = options

    if (dependenciesUpdated.length === 0) {
      return ''
    }

    const references = (
      await Promise.all(
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
    ).filter(Boolean) as string[]

    const headerLine = references.length
      ? `- Updated dependencies (${references.join(', ')})`
      : '- Updated dependencies'

    const dependencyLines = dependenciesUpdated.map(
      dependency => `  - \`${dependency.name}\` @ ${dependency.newVersion}`,
    )

    return [headerLine, ...dependencyLines].join('\n')
  },

  async getReleaseLine(changeset, type, options) {
    assertRepo(options)
    const { repo } = options

    let prFromSummary: number | undefined
    let commitFromSummary: string | undefined
    const usersFromSummary: string[] = []

    const cleanedSummary = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr)
        if (!Number.isNaN(num)) {
          prFromSummary = num
        }
        return ''
      })
      .replace(/^\s*commit:\s*(\S+)/im, (_, commit) => {
        commitFromSummary = commit
        return ''
      })
      .replace(/^\s*(?:author|user):\s*@?(\S+)/gim, (_, user) => {
        usersFromSummary.push(user)
        return ''
      })
      .trim()

    const [firstLine = '', ...restLines] = cleanedSummary
      .split('\n')
      .map(line => line.trimRight())

    const links = await (async () => {
      if (prFromSummary !== undefined) {
        const { links } = await getInfoFromPullRequest({
          repo,
          pull: prFromSummary,
        })
        if (commitFromSummary) {
          const shortCommitId = commitFromSummary.slice(0, 7)
          links.commit = `[\`${shortCommitId}\`](https://github.com/${repo}/commit/${commitFromSummary})`
        }
        return links
      }

      const commitToUse = commitFromSummary || changeset.commit
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
    })()

    const userMentions = usersFromSummary.length
      ? usersFromSummary
          .map(
            username =>
              `[@${username}](https://github.com/${username})`,
          )
          .join(', ')
      : links.user

    const metaParts = [
      links.pull ?? undefined,
      links.commit ?? undefined,
      userMentions ? `Thanks ${userMentions}!` : undefined,
    ].filter(Boolean) as string[]

    const meta
      = metaParts.length > 0 ? ` (${metaParts.join(' · ')})` : ''

    const headline = `- ${firstLine}${meta}`

    const body = restLines
      .filter(line => line.length > 0)
      .map(line => `  ${line}`)
      .join('\n')

    const typeLabel = type && type !== 'none' ? `\n\n> ${type.toUpperCase()} release` : ''

    return body ? `\n\n${headline}\n${body}${typeLabel}` : `\n\n${headline}${typeLabel}`
  },
}

export default changelogFunctions
export const { getDependencyReleaseLine, getReleaseLine } = changelogFunctions

import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import fm from 'front-matter'

const ISSUES_DIR = '.issues'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')

const findExistingIssueByTitle = async (title) => {
  try {
    const { data } = await octokit.rest.issues.listForRepo(
      ({
        owner
        , repo
        , state: 'all'
        , per_page: 100
      }
      )
    )
    const matches = data.filter(issue => issue.title === title)

    if (matches.length > 1) {
      console.warn(`[SYNC] WARNING: Multiple issues found with title "${title}": #${matches.map(m => m.number).join(', #')}`)
      // Return the one that is NOT closed if possible, else the first/lowest number
      const openMatch = matches.find(m => m.state === 'open')
      return openMatch || matches[0]
    }

    return matches[0] || null
  } catch (error) {
    console.error(`[SYNC] Error searching for existing issue titled "${title}":`, error)
    return null
  }
}

const verifyTargetStatus = (file, target, attr) => {
  if (target === 'IN_PROGRESS' && !attr.test_ref) {
    console.warn(`[SYNC] WARN: "${file}" missing test_ref for IN_PROGRESS. Degrading to OPEN.`)
    return 'OPEN'
  }
  if (target === 'CLOSED' && !attr.test_ref) {
    console.warn(`[SYNC] WARN: "${file}" missing test_ref for CLOSED. Degrading to IN_PROGRESS.`)
    return verifyTargetStatus(file, 'IN_PROGRESS', attr)
  }
  return target
}

const sync = async () => {
  const files = fs.readdirSync(ISSUES_DIR).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const filePath = path.join(ISSUES_DIR, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { attributes, body } = fm(content)

    let gh_number = attributes.gh_number

    if (!gh_number) {
      console.log(`[SYNC] Searching GitHub for issue: "${attributes.title}"`)
      const existing = await findExistingIssueByTitle(attributes.title)
      if (existing) {
        gh_number = existing.number
        console.log(`[SYNC] Matched existing issue #${gh_number}`)
      }
    }
    if (!gh_number) {
      console.log(`[SYNC] Creating new GitHub issue for "${file}"`)
      const { data } = await octokit.rest.issues.create(
        ({
          owner
          , repo
          , title: attributes.title
          , body: body
          , ...((Array.isArray(attributes.labels) && attributes.labels.length > 0) ? { labels: attributes.labels } : {})
        }
        )
      )
      gh_number = data.number
      console.log(`[SYNC] Success! Created #${gh_number}`)
    } else {
      console.log(`[SYNC] Updating GitHub issue #${gh_number} from local state`)
      await octokit.rest.issues.update(
        ({
          owner
          , repo
          , issue_number: parseInt(gh_number, 10)
          , title: attributes.title
          , body: body
          , state: ((attributes.status === 'CLOSED' || attributes.status === 'DONE') ? 'closed' : 'open')
          , ...((Array.isArray(attributes.labels) && attributes.labels.length > 0) ? { labels: attributes.labels } : {})
        }
        )
      )
    }

    const newContent =
      (`---\n`
        + `title: ${attributes.title}\n`
        + `status: ${attributes.status || 'OPEN'}\n`
        + `gh_number: ${gh_number}\n`
        + `---\n`
        + `${body}`
      )

    if (newContent.trim() !== content.trim()) {
      console.log(`[SYNC] Updating local file: ${file}`)
      fs.writeFileSync(filePath, newContent)
    }
  }
}

sync().catch(err => {
  console.error('[FATAL] Sync failed:', err)
  process.exit(1)
})

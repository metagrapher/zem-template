import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import fm from 'front-matter'
import { execSync } from 'child_process'

const ISSUES_DIR = '.issues'

export const execSafe = (cmd) => {
  try {
    return (
      {
        ok: true
        , value: execSync(cmd, { encoding: 'utf8' }).trim()
      }
    )
  } catch (error) {
    console.warn(`[ZEM] Subsystem failure (exec): "${cmd}" failed.`)
    return (
      {
        ok: false
        , error
      }
    )
  }
}

export const discoverRepo = () => {
  const [envOwner, envRepo] = (process.env.GITHUB_REPOSITORY || '').split('/')
  if (envOwner && envRepo) return { owner: envOwner, repo: envRepo }

  const gitUrl = execSafe('git remote get-url origin')
  if (gitUrl.ok) {
    // Matches git@github.com:owner/repo.git OR https://github.com/owner/repo.git
    const match = gitUrl.value.match(/[:/]([^/]+)\/([^/.]+)(?:\.git)?$/)
    if (match) return (
      {
        owner: match[1]
        , repo: match[2]
      }
    )
  }

  console.warn('[ZEM] Repo discovery failed. Falling back to default: metagrapher/zem-template')
  return (
    {
      owner: 'metagrapher'
      , repo: 'zem-template'
    }
  )
}

const { owner, repo } = discoverRepo()
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

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

const getAllIssueFiles = () => {
  const folders = ['OPEN', 'IN_PROGRESS', 'CLOSED']
  return folders.map(f => {
    const dir = path.join(ISSUES_DIR, f)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(file => ({ file, folder: f }))
  }).flat()
}

const sync = async () => {
  const issueFiles = getAllIssueFiles()

  for (const { file, folder } of issueFiles) {
    const filePath = path.join(ISSUES_DIR, folder, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { attributes, body } = fm(content)

    let gh_number = attributes.gh_number
    let status = folder
    let targetStatus = attributes.status || folder

    const verifiedStatus = verifyTargetStatus(file, targetStatus, attributes)

    if (verifiedStatus !== status) {
      const newDirPath = path.join(ISSUES_DIR, verifiedStatus)
      if (!fs.existsSync(newDirPath)) fs.mkdirSync(newDirPath)
      const newFilePath = path.join(newDirPath, file)
      console.log(`[SYNC] Moving "${file}" from ${status} to ${verifiedStatus}`)
      fs.renameSync(filePath, newFilePath)
      status = verifiedStatus
    }

    if (!gh_number) {
      console.log(`[SYNC] Searching GitHub for issue: "${attributes.title}"`)
      const existing = await findExistingIssueByTitle(attributes.title)
      if (existing) {
        gh_number = existing.number
        console.log(`[SYNC] Matched existing issue #${gh_number}`)
      }
    }
    const state = (status === 'CLOSED' ? 'closed' : 'open')
    const labels = [...(status === 'IN_PROGRESS' ? ['in-progress'] : []), ...(attributes.labels || [])]

    if (!gh_number) {
      console.log(`[SYNC] Creating new GitHub issue for "${file}"`)
      const { data } = await octokit.rest.issues.create({ owner, repo, title: attributes.title, body, labels })
      gh_number = data.number
      console.log(`[SYNC] Success! Created #${gh_number}`)
    } else {
      console.log(`[SYNC] Updating GitHub issue #${gh_number} (${status})`)
      await octokit.rest.issues.update({ owner, repo, issue_number: parseInt(gh_number, 10), title: attributes.title, body, state, labels })
    }

    const newContent =
      (`---\n`
        + `title: ${attributes.title}\n`
        + `status: ${status}\n`
        + `gh_number: ${gh_number}\n`
        + (attributes.test_ref ? `test_ref: ${attributes.test_ref}\n` : '')
        + `---\n`
        + `${body}`
      )

    const currentFilePath = path.join(ISSUES_DIR, status, file)
    if (newContent.trim() !== content.trim()) {
      console.log(`[SYNC] Updating local file: ${file}`)
      fs.writeFileSync(currentFilePath, newContent)
    }
  }
}

sync().catch(err => {
  console.error('[FATAL] Sync failed:', err)
  process.exit(1)
})

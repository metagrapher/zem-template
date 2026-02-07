# GIT PROTOCOL: Antigravity AI & Metagrapher

## 0. Global Multi-Project Applicability
This protocol is the standard for ALL sites and projects managed by Metagrapher. 
- These rules must be synced to the global context (`MEMORY[user_global]` or System Prompt).
- Every project root must eventually contain a `docs/GIT_PROTOCOL.md` and a signed AI identity config.

This document defines the mandatory, zero-exception protocol for all AI-driven development. This protocol is designed to ensure transparency, accountability, and the total protection of the `primary` branch.

## 1. Identity & Signing

### 1.1 Git Identity
All AI commits must be clearly labeled to distinguish them from human work.
- **user.name**: `Antigravity AI`
- **user.email**: [User's Primary Email]

### 1.2 Commit Signing (PGP/SSH)
To ensure the integrity of AI-generated code, all commits must be signed with a dedicated key stored on the development machine.
- The AI uses a dedicated SSH/GPG key for signing.
- The public key must be added to the GitHub account as a "Signing Key".
- **Mechanical Gate**: Git configuration `commit.gpgsign` must be `true`.

## 2. Branching Strategy (Gitflow Sandbox)

### 2.1 Primary Protection
The `primary` branch is a **Read-Only Zone** for the AI.
- The AI is strictly forbidden from committing directly to `primary`.
- The AI is strictly forbidden from merging into `primary`.

### 2.2 Feature / Topic Branching
All work must occur in a "Sandbox" branch.
- Branch prefix: `ai/` followed by the issue number and a brief descriptor (e.g., `ai/1-git-protocol`).
- Branches must be branched off the latest `primary`.

## 3. Mission-Focused Workflow (Issue Tracking)

### 3.1 Pre-Development Issues (Truth-on-Disk)
No code may be written without a corresponding **Issue**.
- Every issue is a markdown file in the `.issues/` directory.
- Format: `.issues/NNN_description.md` with frontmatter (title, status, gh_number).
- **GitHub Sync**: A GitHub Action (`issue-sync.yml`) automatically mirrors these files to GitHub Issues upon pushing to `primary`.

### 3.2 Atomic, Issue-Linked Commits
Every commit must be atomic (representing a single logical change) and must reference the Issue.
- **Commit Message Format**: `[type]([scope]): [description] #[issue_number]`
- **Example**: `feat(git): implement identity separation #1`


## 4. TDD (Test Driven Development) Mandate

### 4.1 Red/Green/Refactor (RGR)
No logic may be added without a corresponding test.
- **Red**: Every new function must first be defined with a failing test.
- **Green**: Code is written solely to satisfy the test.
- **Refactor**: Clean up and optimize for ZEM compliance after passing.

### 4.2 Granularity
- **Function Isolation**: Every exported function is a testable unit. 
- **Atomic Commits & Tests**: While every commit doesn't need its own full test run, any commit that adds logic MUST include the corresponding test changes.

### 4.3 Changing Legacy Tests
Existing tests are the "Contracts of the Past."
- If a development process reveals that a legacy test is incorrect or blocking a necessary refactor, the AI must **STOP** and inform the USER.
- Do not unilaterally change or delete existing tests to force a "Green" state. This transition must be documented in an Issue.

## 5. Mechanical Guardrails (The Pre-commit Hook)

The protocol is enforced by a local `.git/hooks/pre-commit` script that fails the commit if:
1. The current branch is `primary`.
2. The `user.name` is not `Antigravity AI`.
3. The commit message does not contain an Issue reference.
4. The commit is not signed.

## 6. Review & Integration

### 6.1 The "Audit Turn"
After completing a task, the AI will provide a `git diff` command for the USER to audit the change line-by-line.

### 6.2 User-Controlled Merging
Only the USER has the authority to merge an `ai/*` branch into `primary`.

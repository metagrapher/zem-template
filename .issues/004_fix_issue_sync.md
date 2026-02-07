---
title: Fix Issue Synchronization
status: CLOSED
gh_number: 4
---
# Fix Issue Synchronization

The current issue synchronization process has several flaws:
1. It creates duplicate issues if `gh_number` is missing even if the issue exists.
2. It only triggers on `primary`, but we work on `ai/` branches.
3. The permissions and authentication for pushing back to `primary` are unreliable.

## Tasks
- [x] Implement robust check for existing issues by title to prevent duplicates.
- [x] Correctly update local `.issues/` files with `gh_number`.
- [x] Ensure `issue-sync.yml` triggers on any branch push to `.issues/**`.
- [x] Use authenticated push with `GITHUB_TOKEN` to `primary` in the workflow.

## Success Criteria
- [x] Synchronization works for all branches.
- [x] No duplicate issues are created when local state is reset.
- [x] `gh_number` is accurately tracked in local files.

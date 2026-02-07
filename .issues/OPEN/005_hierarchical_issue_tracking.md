---
title: Implement Hierarchical Issue Tracking with State Machine Verification
status: OPEN
gh_number: 11
---
## Description
Refactor the issue tracking system to use a hierarchical directory structure (`OPEN`, `IN_PROGRESS`, `CLOSED`) and implement a verification state machine that links issue status to test references (`test_ref`).

## Success Criteria
- [x] Migrate existing issues to `OPEN`/`CLOSED` subdirectories.
- [x] Update `sync-issues.mjs` to support recursive file scanning.
- [x] Implement `verifyTargetStatus` to handle degradation (e.g., `IN_PROGRESS` -> `OPEN` if `test_ref` is missing).
- [/] Synchronize `in-progress` labels and `gh_number` correctly.
- [/] Ensure atomic commits (limit ~50 lines) for all changes.

## Verification Plan
1. Move an issue to `IN_PROGRESS` without a `test_ref` and run sync. It should move back to `OPEN`.
2. Move an issue to `CLOSED` without a `test_ref`. It should move to `IN_PROGRESS` (and then `OPEN` if still missing).

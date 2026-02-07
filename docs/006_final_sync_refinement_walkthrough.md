# Walkthrough: Hierarchical Issue Tracking with State Machine

I have successfully refactored the issue tracking system into a more robust, test-locked structure.

## Changes Made

### 1. Hierarchical Directory Structure
Issues are now organized into three subdirectories within `.issues/`:
- `OPEN/`: For new or pending issues.
- `IN_PROGRESS/`: For issues being worked on (requires `test_ref`).
- `CLOSED/`: For completed issues (requires `test_ref`).

### 2. Verification State Machine
The `sync-issues.mjs` script now enforces integrity:
- **Degradation**: If an issue is marked `IN_PROGRESS` or `CLOSED` but lacks a `test_ref`, it is automatically moved back to `OPEN` (or `IN_PROGRESS`) and a `WARN` is logged.
- **Auto-Migration**: Moving a file into a folder automatically updates its `status` metadata. Updating the `status` metadata in the file automatically moves the file to the corresponding folder on the next sync.

### 3. Script Robustness & Portability
### 4. Robustness Refinements
- **DONE Status Support**: Added `DONE` as a valid status. It is mapped to the `closed` state on GitHub and requires a `test_ref` for verification, just like `CLOSED`.
- **422 Error Mitigation**: Implemented a safety catch for 422 errors specifically targeting cases where the script attempts to update merged Pull Requests (like #1).
- **ZEM-style Exec**: Integrated your `execSafe` wrapper for more predictable command execution.
- **PR Created**: Successfully created [PR #13](https://github.com/metagrapher/zem-template/pull/13) using the `github-mcp-server`.
- **Feature Tracking**: This entire refactor is tracked under issues #5 and #6.

## Proof of Work

### Hierarchical Filesystem
```bash
.issues/

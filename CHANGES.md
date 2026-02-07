# Changes

## [2026-02-07]
### Fixed
- **GPG Identity Alignment**: Fixed 'Unverified' status by rotating the GPG key to match the GitHub `noreply` email address. #1
- **Issue Synchronization**: Improved `sync-issues.mjs` with duplicate prevention via title-based lookup and restored all-branch triggering in `.github/workflows/issue-sync.yml`. #4

### Added
- **Identity Test**: Symbolic persona test in `test/Identity.test.ts`.
- **Documentation**: GPG Alignment Walkthrough in `docs/walkthroughs/001-gpg-alignment.md`.
## [2026-02-07] - Hierarchical Issue Tracking\n- Refactored .issues/ into OPEN, IN_PROGRESS, CLOSED subdirectories.\n- Implemented status verification state machine in sync-issues.mjs.\n- Added test-locked progression (test_ref required for advancement).\n- Fixed local repository discovery for sync script.\n

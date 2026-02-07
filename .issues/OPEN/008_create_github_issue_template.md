---
title: Create GitHub Issue Template for ZEM Compatibility
status: OPEN
---

## Description
Create a GitHub-native Issue Template that follows the ZEM protocol format, ensuring that issues created via the GitHub UI are compatible with the `sync-issues.mjs` script and local file-based management.

## Success Criteria
- [ ] Create `.github/ISSUE_TEMPLATE/task.yml` with sections for Description, Success Criteria, and Verification Plan.
- [ ] Ensure the template body structure matches the local `.issues/NNN.md` requirements.
- [ ] Verify that new issues created with the template are successfully pulled/synced by the sync script.

## Verification Plan
1. Create a dummy issue on GitHub using the new template.
2. Run `npm run sync` (or equivalent sync command).
3. Verify that the issue is correctly serialized to the `.issues/OPEN/` directory.

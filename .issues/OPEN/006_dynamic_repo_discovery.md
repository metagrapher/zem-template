---
title: Dynamic Repository Discovery for Golden Standard Portability
status: OPEN
---

## Description
The issue synchronization script currently hardcodes `metagrapher/zem-template` as a fallback. This violates the "Golden Standard" principle for a template repository. The script should dynamically discover the repository owner and name from the local git configuration when environment variables are missing.

## Success Criteria
- [ ] Remove hardcoded `owner` and `repo` strings from `scripts/sync-issues.mjs`.
- [ ] Implement runtime discovery using `git remote get-url origin`.
- [ ] Ensure handles both SSH and HTTPS git URLs.
- [ ] Add a utility script or update the sync script to help populate `.env` if necessary (optional improvement).

## Verification Plan
1. Clone the repo to a different name/owner and run the script (dry run).
2. It should correctly identify the new owner/repo without manual modification.

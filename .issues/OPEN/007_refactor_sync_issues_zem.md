---
title: Refactor sync-issues.mjs to ZEM
status: OPEN
gh_number: 
---

# Goal Description
Refactor the `scripts/sync-issues.mjs` script to align with the Zero Exception Monad (ZEM) protocol and project aesthetics.

## Requirements
- No `try-catch` blocks in logic.
- Capture subsystem failures (exec, fs, network) and report them as information (non-silent).
- Use functional patterns (no `for` loops).
- Comma-forward notation.
- No trailing semicolons.
- signed commits to `ai/` branch.

## Verification Plan
- Create unit tests for helpers (`execSafe`, `readSafe`, etc.).
- Run syntax check.
- Perform a dry-run sync.

# Walkthrough: Hierarchical Issue Tracking

I have implemented a hierarchical directory structure for `.issues/` and a state machine for status verification.

## Changes
- **Subdirectories**: Issues are now in `OPEN/`, `IN_PROGRESS/`, and `CLOSED/`.
- **Verification**: `IN_PROGRESS` and `CLOSED` now require a `test_ref`.
- **Auto-Migration**: Files move between folders based on their verified status.
- **Local Support**: Improved script for local execution.

See issue #5 for details.

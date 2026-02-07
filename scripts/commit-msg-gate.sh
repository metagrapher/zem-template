#!/bin/bash

# Antigravity AI: ZEM Mechanical Gate (Commit-msg)
# Enforces the mandatory issue reference #xxx in every commit message.

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

echo "--- [Antigravity AI] Running Commit-msg Gate ---"

# Check for # followed by numbers using grep
if ! echo "$COMMIT_MSG" | grep -qE "#[0-9]+"; then
  echo -e "\x1b[31m[ERROR] Format Violation: Every commit message must contain an issue reference (e.g., #123).\x1b[0m"
  echo "Current message: $COMMIT_MSG"
  exit 1
fi

echo -e "\x1b[32m[PASS] Commit message meets protocol standards.\x1b[0m"
exit 0

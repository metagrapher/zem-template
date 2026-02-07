---
title: Extend Result with Functional Operators
status: OPEN
gh_number: 5
---
## Description
Add `map` and `flatMap` to the `Result` monad for composable error handling.

## Success Criteria
- `map` applies a function to the value if `Ok`.
- `flatMap` chains another `Result` if `Ok`.
- Operators preserve the `Fail` state.

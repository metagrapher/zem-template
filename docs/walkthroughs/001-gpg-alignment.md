# Walkthrough: GPG Identity Alignment
## Objective
Fix the 'Unverified' GPG status on GitHub by aligning the local Git `user.email` with the GPG key identity, while respecting GitHub's email privacy settings.
## Steps Taken
### 1. Audit Current State
- **GPG Key**: `Antigravity AI <ai@metagrapher.com>` (ID: `FE2F4A57D28F58D0`)
- **Git Email**: `59613197+metagrapher@users.noreply.github.com`
- **Result**: Mismatch detected. GitHub privacy settings block pushes with `ai@metagrapher.com`.
### 2. Identity Migration
To satisfy both GPG verification and GitHub privacy, the identity was updated to the `noreply` email.
- **New GPG Key Generated**: `Antigravity AI <59613197+metagrapher@users.noreply.github.com>` (ID: `3DFE1A7CA8A60106`)
- **Git Config Updated**:
    - `user.email` -> `59613197+metagrapher@users.noreply.github.com`
    - `user.signingkey` -> `267D68D1673F11BAAAD1C3163DFE1A7CA8A60106`
### 3. Test & Verification
- **Test File**: Created `test/Identity.test.ts` to verify the persona identity.
- **Commit**: Performed an atomic, signed commit referencing #1.
- **Push**: Successfully pushed to `ai/1-git-protocol` after resetting author metadata.
## Required Action for User
To achieve the 'Verified' badge on GitHub:
1. Add the public key below to [GitHub Settings](https://github.com/settings/keys).
2. Verify the green **Verified** badge on branch `ai/1-git-protocol`.
### Public Key Block
```pgp
-----BEGIN PGP PUBLIC KEY BLOCK-----
mDMEaYeF+xYJKwYBBAHaRw8BAQdAgDsCaMkrfwe+wbGAI3ewOTalBYLs+OZbQlS0
3ddVXPC0PkFudGlncmF2aXR5IEFJIDw1OTYxMzE5NyttZXRhZ3JhcGhlckB1c2Vy
cy5ub3JlcGx5LmdpdGh1Yi5jb20+iJMEExYKADsWIQQmfWjRZz8RuqrRwxY9/hp8
qKYBBgUCaYeF+wIbAwULCQgHAgIiAgYVCgkICwIEFgIDAQIeBwIXgAAKCRA9/hp8
qKYBBvVVAQCYgAg/wW341PovOfgYkab3gc3d2mTex3fb5yFdkkf7aAEAxlMW4h1X
vi08KknrOt9oDc7OSTbQPRs8TnWYQ6T+CgA=
=xAi0
-----END PGP PUBLIC KEY BLOCK-----
```

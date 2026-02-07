# ZEM: The Golden Standard Template 

The **Zero Exception Method (ZEM)** "Golden Standard" template for high-rigidity, AI-assisted development.

## 🏗 The Architecture (The "Golden Stack")
To prevent architecture erasure and legacy drift, this template enforces:
- **Astro**: Primary SSR shell and Cloudflare Worker routing.
- **Hono**: Middleware, RPC, and API security (Authentication/Validation).
- **Lit**: Client-side hydrated islands ONLY (NO Lit SSR).
- **UnoCSS**: Atomic, semantic CSS reset and composition.

## 🛡 High-Rigidity Protocol
This repository is protected by a strict mechanical protocol for AI agents. 
- **Identity**: All AI changes are signed and credited to `Antigravity AI`.
- **Atomic Commits**: Forced size limits (<50 lines) and issue referencing.
- **Strict TDD**: Red/Green/Refactor cycles only.
- **Read-Only Primary**: The `primary` branch is locked to AI agents; changes must move through `ai/` sandbox branches.

**[Read the Full GIT_PROTOCOL.md](./docs/GIT_PROTOCOL.md)**

## 🚀 Getting Started
1. **Configure AI Identity**: Run `git config --local user.name "Antigravity AI"` and ensure GPG signing is enabled.
2. **Install Hooks**: Copy `scripts/*-gate.sh` to `.git/hooks/`.
3. **Draft an Issue**: Create a new `.issues/NNN_desc.md` to begin work.

---
*Built for Metagrapher. Zero Exceptions. Zero Errors. Total Visibility.*

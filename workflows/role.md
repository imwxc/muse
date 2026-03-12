---
description: Create a new MUSE role. For extending the role system with new responsibilities.
---

## Usage

```
/role [role-name]
```

## Steps

### 1. Validate

- Role name must be lowercase, single word (e.g., `research`, `fundraise`, `ops`)
- Check if `.muse/[role-name].md` already exists → if yes, abort with message

### 2. Create role file

Create `.muse/[role-name].md` from template:

```markdown
# [Emoji] [Role Name] — [Role Title]

> Last updated: YYYY-MM-DD (initialized)
> `/resume [role-name]` to read this file

## 📐 Scope

| This role handles | This role does NOT handle |
|-------------------|--------------------------|
| [responsibilities] | [out of scope] |

## ⬇️ Information Flow

\```
STRATEGY → [role]: [what comes in]
[role] → STRATEGY: [what goes out]
[role] → [other roles]: [lateral data]
\```

## 📋 Current Status

### In Progress
- [current work items]

### Backlog
- [future items]

## 📡 Incoming Directives

<!-- Populated by /sync -->
```

### 3. Update references

Add to `resume.md` project command table:
```
| Continue [role] | `/resume [role-name]` |
```

Add file path mapping:
```
- `/resume [role-name]` → `.muse/[role-name].md`
```

### 4. Confirm

```
✅ New role created: .muse/[role-name].md
📖 Resume with: /resume [role-name]
🔄 Sync with: /sync [project] [role-name] up/down
```

## Available Tier 1 Roles (pre-defined)

| Role | File | Purpose |
|------|------|---------|
| strategy | `.muse/strategy.md` | Business strategy, PMF, fundraising, growth planning |
| build | `.muse/build.md` | Code development, bug fixes, architecture |
| qa | `.muse/qa.md` | Quality verification, acceptance criteria |
| growth | `.muse/growth.md` | Marketing, brand, social media, content |

## Available Tier 2 Roles (optional)

| Role | File | Purpose |
|------|------|---------|
| ops | `.muse/ops.md` | Releases, CI/CD, deployment, App Store |
| research | `.muse/research.md` | Competitive analysis, market data, user research |
| fundraise | `.muse/fundraise.md` | Deck content, applications, pitch scripts |

## GM Role (Tier 0.5)

| Role | File | Purpose |
|------|------|---------|
| gm | `.muse/gm.md` | Project-level CEO, cross-role coordination, L1/L2 decisions |

> GM is optional — only needed for multi-role projects with 3+ active roles.

---
description: Condense memory/ daily logs into long-term MEMORIES.md lessons
---

## When to Run

### Automatic Trigger (from /bye)
- `/bye` detects memory/ accumulation and suggests `/distill` in the next session
- Thresholds: ≥7 days of logs, ≥5 new files since last distill, or ≥15 total files

### Manual Trigger
- User explicitly runs `/distill` or `/distill [project]`
- After completing a major milestone
- After a series of debugging sessions with repeated patterns

## Scope Control

| Command | Scope | Description |
|---------|:-----:|-------------|
| `/distill` | 🌍 Global | Read **all** projects' memory/ → write to global MEMORIES.md |
| `/distill [project]` | 📁 Project | Read only specified project's memory/ → write to global MEMORIES.md |

> Lessons are cross-project universal — **always write to the global MEMORIES.md** (not split by project).

## Execution Steps

1. **Scan** all `memory/YYYY-MM-DD.md` files (or project-specific if scoped)
2. **Extract** recurring patterns, lessons, and key decisions:
   - Mistakes made more than once
   - Debugging patterns worth remembering
   - Architecture decisions and their rationale
   - Tool/platform gotchas (e.g., API quirks, deployment issues)
   - Process improvements
3. **Categorize** into themed sections (e.g., "QA Integrity", "DevOps", "Context Management")
4. **Write** to `MEMORIES.md` with source attribution:
   ```markdown
   ## [Topic]
   - **Lesson**: [description] (source: memory/YYYY-MM-DD.md)
   ```
5. **Update** the "Last distilled" timestamp in MEMORIES.md header
6. **Suggest** upgrade path:
   - Lesson appears ≥3 times → consider adding to CLAUDE.md as an iron rule
   - Methodology is generic → consider creating a new Skill

## Output Format

```markdown
# 🧠 Long-term Memories

> Distilled from memory/ logs via /distill.
> Last distilled: YYYY-MM-DD
> Scope: [global / project-specific]

## [Category 1]
- **Lesson**: [description] (source: memory/YYYY-MM-DD.md)

## [Category 2]
- **Lesson**: [description] (source: memory/YYYY-MM-DD.md)

---

> 📌 Upgrade suggestions:
> - ✅ [Topic] → already in CLAUDE.md
> - ⏳ [Topic] → consider creating a Skill
```

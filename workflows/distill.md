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

### Step 1: Scan & Classify

Scan all `memory/YYYY-MM-DD.md` files (or project-specific if scoped).

**🆕 Structured Extraction**: Classify each memory entry into one of 4 types:

| Type | Tag | Description | Example |
|------|-----|-------------|---------|
| **FACT** | `[FACT]` | Objective truth, data point, measurement | "小红书 v2 = 18 浏览" |
| **DECISION** | `[DECISION]` | Choice made, with rationale | "Show HN 暂缓 — T3 不能发" |
| **LESSON** | `[LESSON]` | Pattern learned, mistake to avoid | "自推广型内容被限流" |
| **TODO** | `[TODO]` | Unfinished work carried forward | "🔲 Reddit 解封后发帖" |

### Step 2: Dedup Detection

**🆕 Compare against existing MEMORIES.md** before writing:

| Action | When | What to Do |
|--------|------|-----------|
| **ADD** | New lesson not in MEMORIES.md | Append to appropriate section |
| **UPDATE** | Existing lesson but new context/data | Merge new info into existing entry |
| **NOOP** | Already captured accurately | Skip (cite existing entry) |

> Inspired by mem0's ADD/UPDATE/DELETE/NOOP memory consolidation pipeline.

### Step 3: Decay Detection

**🆕 Flag stale entries** in MEMORIES.md:

1. Check each existing MEMORIES.md entry's source date
2. If source date > 30 days old AND not referenced in recent memory/ files → mark `[DECAY]`
3. `[DECAY]` entries go to a "🗑️ Candidates for Removal" section
4. User decides whether to keep or remove

> Inspired by Supermemory's TTL-based smart forgetting.

### Step 4: Token Budget Check

**🆕 Post-distill size check**:

1. After writing, run `wc -w MEMORIES.md`
2. Target: **≤ 2250 words** (~3000 tokens)
3. If over budget → prioritize LESSON > DECISION > FACT
4. Move lower-priority entries to `memory/archive/distilled_overflow.md`

### Step 5: Write to MEMORIES.md

Categorize into themed sections:
- Mistakes made more than once
- Debugging patterns worth remembering
- Architecture decisions and their rationale
- Tool/platform gotchas (e.g., API quirks, deployment issues)
- Process improvements

Format:
```markdown
## [Topic]
- **Lesson**: [description] (source: memory/YYYY-MM-DD.md) `[LESSON]`
- **Decision**: [choice + rationale] (source: memory/YYYY-MM-DD.md) `[DECISION]`
```

### Step 6: Update Timestamp

Update the "Last distilled" timestamp in MEMORIES.md header.

### Step 7: Suggest Upgrades

- Lesson appears ≥3 times → consider adding to CLAUDE.md as an iron rule
- Methodology is generic → consider creating a new Skill

## Output Format

```markdown
# 🧠 Long-term Memories

> Distilled from memory/ logs via /distill.
> Last distilled: YYYY-MM-DD
> Scope: [global / project-specific]
> Token budget: XXXX / 3000

## [Category 1]
- **Lesson**: [description] (source: memory/YYYY-MM-DD.md) `[LESSON]`

## [Category 2]
- **Decision**: [choice] (source: memory/YYYY-MM-DD.md) `[DECISION]`

## 🗑️ Candidates for Removal
- ~~[Stale entry]~~ (source: memory/YYYY-MM-DD.md, last referenced: YYYY-MM-DD) `[DECAY]`

---

> 📌 Upgrade suggestions:
> - ✅ [Topic] → already in CLAUDE.md
> - ⏳ [Topic] → consider creating a Skill
```

## Distill Report (output at end)

```
✅ /distill 完成
- 扫描: N 天日志
- 新增: X 条 (ADD)
- 更新: Y 条 (UPDATE)
- 跳过: Z 条 (NOOP)
- 衰减: W 条 (DECAY) → 见 MEMORIES.md 🗑️ section
- Token: XXXX / 3000
```

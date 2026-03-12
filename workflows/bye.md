---
description: One-click conversation wrap-up. Auto-summarize, sync role files, save memory. Zero input.
---

## Steps

### 1. Summarize this session's work

```markdown
## Session Summary (YYYY-MM-DD HH:MM)

### ✅ Completed
- [what was done]

### 📋 Decisions
- [key decisions]

### ➡️ Next Steps
- [what to do next]
```

### 2. Sync .muse/ role files

Update the relevant `.muse/[role].md` file with this session's progress.

**Mandatory sync rules based on conversation type:**
- Dev conversation → **must** sync build up
- Growth conversation → **must** sync growth up
- Sub-project dev → **must** sync [project] build up
- Sub-project growth → **must** sync [project] growth up

**Critical event checklist** — if any of these happened this session, they **must** be synced to strategy:
- [ ] App store review status changed (approved/rejected/resubmit)
- [ ] Pricing or business model changed
- [ ] Key metric milestone (D7, MAU, revenue)
- [ ] User-facing launch or deploy
- [ ] Fundraising progress (deck sent, interview scheduled, term sheet)
- [ ] Legal or compliance issue

### 3. Write memory

Append to `memory/YYYY-MM-DD.md` with the session summary.

If this is the first session today, create the file using the memory template format.

### 4. Suggest conversation export

```
💾 Export this conversation?
→ Save to: convo/YYMMDD/YYMMDD-NN-description.md
```

The user can:
- ✅ Confirm → agent creates the file
- ⏭️ Skip → no export
- If context was critically low (🔴), auto-append `_CRASH` suffix

### 4.5. Auto-Distill Detection

Check `memory/` accumulation:

```python
days = count unique YYYY-MM-DD.md files
new_since_distill = files modified after MEMORIES.md last modified
total_files = total .md files in memory/
```

Warn if any of:
- `days >= 7` → "7+ days of un-distilled logs, consider `/distill` next session"
- `new_since_distill >= 5` → "5 new log files since last distill"
- `total_files >= 15 and never_distilled` → "Memory is accumulating, first `/distill` recommended"

### 5. Final output

```
✅ Session wrapped up
📝 memory/YYYY-MM-DD.md updated
🔄 .muse/[role].md synced
💾 convo/ export: [status]
```

### Naming Convention for convo/

```
convo/
└── YYMMDD/
    ├── YYMMDD-01-feature_auth.md
    ├── YYMMDD-02-growth_strategy.md
    └── YYMMDD-03-debug_crash_CRASH.md
```

| Part | Meaning |
|------|---------|
| `YYMMDD` | Date (year-month-day) |
| `NN` | Sequence number within the day |
| `desc` | Brief topic description (snake_case) |
| `_CRASH` | (Optional) Context blowout marker |

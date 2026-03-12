---
description: Check current conversation's context window health and assess if a new conversation is needed
---

## Trigger

- User runs `/ctx`
- Or asks "is context enough?", "do I need a new conversation?", "context check"

## Execution

1. **Estimate** current context usage based on conversation length and complexity
2. **Evaluate** using traffic light system:

| Status | Usage | Action |
|:------:|:-----:|--------|
| 🟢 Green | < 50% | Safe to continue |
| 🟡 Yellow | 50-80% | Wrap up current task, avoid starting new large tasks |
| 🔴 Red | > 80% | **Stop immediately**, run `/bye`, start new conversation |

3. **Output** health report:

```
🟢/🟡/🔴 Context: ~XX%
Estimated remaining: ~N rounds
Recommendation: [continue / wrap up soon / stop now]
```

## Defensive Auto-Save (L0 Defense)

Every **10 interaction rounds**, silently update `memory/CRASH_CONTEXT.md` — no user interruption needed.

| Layer | Trigger | Reliability |
|:-----:|---------|:-----------:|
| L0 | Every 10 rounds (silent) | ⭐⭐⭐ |
| L1 | 🔴 context detection | ⭐⭐ |
| L2 | `/resume crash` scans convo/ | ⭐ |

If a sudden blowout occurs, at most 10 rounds of progress are lost.

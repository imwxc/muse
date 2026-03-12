---
description: Cross-role file sync — directive delivery and data feedback between MUSE role files
---

## Unified Syntax

```
/sync [project] [role] [direction]
```

**Direction**: `up` (report to strategy) / `down` (dispatch from strategy) / `to [target]` (lateral) / `broadcast` (one-to-many)

### Quick Reference

| Command | Meaning |
|---------|---------|
| `/sync myapp gm up` | myapp GM reports summary → strategy |
| `/sync myapp gm down` | strategy dispatches directives → myapp GM |
| `/sync myapp build up` | myapp build progress → GM (or strategy) |
| `/sync myapp growth up` | myapp growth data → GM (or strategy) |
| `/sync myapp build down` | GM/strategy directives → myapp build |
| `/sync myapp growth down` | GM/strategy directives → myapp growth |
| `/sync myapp build to growth` | myapp build → myapp growth (lateral) |
| `/sync myapp qa broadcast` | myapp QA → myapp build + GM (broadcast) |

### Batch Sync

| Command | Meaning |
|---------|---------|
| `/sync myapp down` | GM/strategy directives → myapp **all roles** |
| `/sync all down` | strategy directives → **all GMs → all roles** |
| `/sync all up` | **all GMs** report summaries → strategy |
| `/sync all` | Full bidirectional sync |

### Abbreviation Rules

In the current workspace's default project, the project name can be omitted:
- `/sync build up` = `/sync [default-project] build up`
- `/sync growth down` = `/sync [default-project] growth down`

`strategy` is always global and doesn't need a project prefix.

---

## Execution Details

### 1. Strategy → GM (down) — v2.0 preferred path

```
/sync myapp gm down
```

Steps:
1. Read `.muse/strategy.md` "Directive Queue"
2. Find all undelivered directives tagged `→[PROJECT]/GM`
3. Write to `[project]/.muse/gm.md` "Incoming Directives Queue"
4. GM decomposes and distributes to project-level roles
5. Mark as "✅ Delivered" in strategy.md

ℹ️ **v2.0 change**: Strategy no longer writes directly to build/growth. Directives flow through GM, which handles internal distribution.

### 1b. Strategy → Role (down) — backward compatible

```
/sync myapp build down
```

When GM role is not enabled, or in urgent situations, you can sync directly to roles:
1. Read `.muse/strategy.md` "Directive Queue"
2. Find all undelivered directives tagged `→[PROJECT]/BUILD`
3. Write to `[project]/.muse/build.md` "Incoming Strategy Directives"
4. Mark as "✅ Delivered" in strategy.md

### 2. GM → Strategy (up) — v2.0 preferred path

```
/sync myapp gm up
```

Steps:
1. Read `[project]/.muse/gm.md` GM-perspective project status summary
2. Write to `.muse/strategy.md` using format: `📡 Data Report @STRATEGY ([PROJECT]/GM)`
3. Mark as reported in gm.md

### 2b. Role → Strategy (up) — backward compatible

```
/sync myapp build up
```

When GM role is not enabled, roles can report directly to strategy:
1. Read `[project]/.muse/build.md` for progress/data/requests to report
2. Write to `.muse/strategy.md` using format: `📡 Data Report @STRATEGY ([PROJECT]/BUILD)`
3. Mark as reported in build.md

### 3. Lateral Sync (to)

```
/sync myapp build to growth
```

When BUILD and GROWTH need to share information:
1. Read source file for information to pass to the target
2. Write to target growth.md using format: `📡 BUILD→GROWTH Notice`
3. Also sync key information to strategy.md (maintain global visibility)

### 4. QA Broadcast

```
/sync myapp qa broadcast
```

After QA verification, broadcast QA Report to multiple role files:
1. Read `.muse/qa.md` latest QA Report
2. Write to build.md using format: `📡 QA→BUILD` (❌ FAILs require build to fix first)
3. Write to strategy.md using format: `📡 QA→STRATEGY`
4. If growth is affected → also write to growth.md

### 5. Receive

```
/sync receive
```

Auto-detects based on current conversation type:
- **In STRATEGY conversation**: Check all projects for reported data
- **In BUILD conversation**: Check for new strategy directives + QA FAIL reports
- **In GROWTH conversation**: Check for new strategy directives + build lateral notices

---

### Directive Format

Strategy directives should tag the target project and role:
```
📡 S025→MYAPP/GM: Add health certificate feature for V1.2.0
📡 S025→APPB/GM: Add voice synthesis to SDK v0.3.0
📡 S025→ALL: All projects pause new features, focus on bug fixes
```

Backward compatible (direct role targeting when no GM):
```
📡 S025→MYAPP/BUILD: Add health certificate feature for V1.2.0
📡 S025→MYAPP/GROWTH: Start new campaign after V1.2.0 launches
```

GM report format:
```
📡 Data Report @STRATEGY (MYAPP/GM 3/12 13:07):
> V1.1.1 Build 30 resubmitted for review. D7 window closes tomorrow.
> EP.03 storyboard 16/20 complete.
> Deck finalized, sending to investors.
```

Role report format (backward compatible):
```
📡 Data Report @STRATEGY (MYAPP/BUILD 3/12 11:44):
  ✅ V1.1.1 Build 31 submitted for review
```

---

## Multi-Project Complete Example

Assume you have 3 projects (AppA, AppB, AppC):

**Strategy makes a cross-project decision**:
```
You: /resume strategy
(Make decision S030→APPA/BUILD + S030→APPB/GROWTH + S030→APPC/BUILD)
You: /sync all down
→ Agent auto-distributes to all 3 projects' corresponding role files
```

**AppA build completes development, notify strategy + growth**:
```
You: /resume appa build
(Complete development)
You: /sync appa build up          ← Report progress to strategy
You: /sync appa build to growth   ← Notify growth to start promotion
```

**AppB QA finds a bug**:
```
You: /resume appb qa
(Verification finds bug)
You: /sync appb qa broadcast  ← Broadcast to appb build + strategy
```

**New conversation to see global status**:
```
You: /resume strategy
You: /sync all up    ← Pull latest progress from all projects
```

---

## Important Notes

- **Rule Zero still applies**: sync is the only legal exception for cross-file operations, but only for directive delivery/data reporting, not content discussion
- After sync completes, the current conversation continues to focus on the original file's content
- If there are no new directives/reports, will inform "no new content to sync"
- Lateral syncs must also notify STRATEGY (or GM) to maintain global visibility
- **All cross-project syncs should be executed in strategy conversations** (strategy is the global hub)
- **Abbreviation rule**: Default project in current workspace can omit project name
- **GM priority**: When GM exists, prefer routing through GM; without GM, fall back to direct sync

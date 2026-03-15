---
name: agent-protocol
description: Specification for making MUSE role files machine-readable as an Agent Protocol — enabling multi-agent coordination and tool interoperability
---

# Agent Protocol Specification

> Inspired by MemOS (multi-agent isolation + sharing) and multi-agent-memory (cross-agent persistence).
> Adapted for MUSE's pure Markdown zero-dependency architecture.
> Added in v2.12.0 (Batch 2 — competitive tech absorption).

## Why

MUSE role files (`.muse/*.md`) currently work because AI Agents read Markdown and follow instructions. But as the ecosystem evolves toward multi-agent workflows (MCP servers, Claude Projects, multi-tool chains), role files need a **machine-readable protocol** — not just human-readable documents.

**Problems this solves**:
1. **Agent handoff**: When switching between Agents (e.g., Claude → Gemini), context should be portable
2. **Multi-agent coordination**: Multiple Agents working on the same project should respect role boundaries
3. **Tool interoperability**: MCP servers, IDE plugins, and CLI tools should be able to read/write role files

## Protocol: MUSE Role File Spec v1.0

### File Discovery

```
.muse/
├── strategy.md    # Strategy role
├── build.md       # Build/Dev role
├── growth.md      # Growth/Marketing role
├── qa.md          # QA/Verification role
├── gm.md          # General Manager role
├── ops.md         # Operations role
├── research.md    # Research role
├── fundraise.md   # Fundraise role
└── archive/       # Archived content (not loaded)
```

**Discovery rule**: Any `.md` file in `.muse/` (excluding `archive/`) = a role file.

### L0 Header (Machine-Readable Status Line)

Every role file MUST have an L0 comment as its **first line**:

```
<!-- L0: {version} | {top_priority} | {status_flags} -->
```

**Parsed fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `version` | semver | Current project version | `v2.11.0` |
| `top_priority` | string | Most important current task | `P0=竞品技术吸收Batch2` |
| `status_flags` | csv | Comma-separated status indicators | `QA PASS, 3 pending directives` |

**L0 is the Agent's "at a glance" API** — any tool can grep all L0 lines to get project status in ~400 tokens.

### Section Protocol

Role files use Markdown headers as **semantic sections**. Tools should parse these:

| Section Header Pattern | Semantic Meaning | Agent Action |
|----------------------|-----------------|--------------|
| `## 📐 职责边界` | Role boundaries table | Respect: only act within listed responsibilities |
| `## ⏳ 待办` / `## 🎯 TODO` | Pending tasks | Read for context; update checkboxes when completing |
| `## 📡 已接收战略指令` | Received directives | Check for pending work from other roles |
| `## 📡 QA→BUILD 通知` | Cross-role notifications | Process before starting new work |
| `## 🛠️ 技术栈` | Technology constraints | Respect in all code generation |
| `## 📋 CHANGELOG 维护规则` | Process rules | Follow during releases |

### Directive Protocol (📡)

Directives are the **message-passing API** between roles:

```
📡 **S{NNN}→{TARGET}**: {STATUS} **{TITLE}**
> {BODY}
```

| Field | Format | Example |
|-------|--------|---------|
| `S{NNN}` | Sequential ID | `S041` |
| `{TARGET}` | `ROLE` or `PROJECT/ROLE` | `MUSE/BUILD`, `GROWTH` |
| `{STATUS}` | 🟡 (pending) / ✅ (received) | `🟡` = needs pickup |
| `{TITLE}` | One-line summary | `竞品深度调研回传` |
| `{BODY}` | Blockquote detail | Full directive content |

**Pickup protocol**:
1. Target role's `/resume` scans for 🟡 directives
2. On pickup: write to role file's `📡 已接收战略指令` section
3. Change source 🟡 → ✅ with timestamp

### Memory Protocol

```
memory/
├── YYYY-MM-DD.md   # Daily log (short-term, raw)
├── archive/        # Old logs
MEMORIES.md          # Long-term knowledge (distilled + auto-captured)
```

| Memory Type | File | Write Method | Read Method |
|------------|------|-------------|------------|
| **Short-term** | `memory/YYYY-MM-DD.md` | `/bye` Step 4 | `/resume` Step ② |
| **Long-term** | `MEMORIES.md` | `/distill` (batch) + `/bye` Step 4.7 (auto-capture) | `/resume` Step ① |
| **Constitutional** | `CLAUDE.md` | Manual | Always loaded |
| **User prefs** | `USER.md` | `/settings` | `/resume` Step ④ |

### Isolation Rules

```
┌─────────────────────────────────────────────┐
│ Agent Session (e.g., /resume build)         │
│                                             │
│  ✅ CAN READ:                               │
│  - Own role file (.muse/build.md)           │
│  - L0 lines of ALL role files               │
│  - memory/*.md                              │
│  - MEMORIES.md, CLAUDE.md, USER.md          │
│  - Source code & docs (on demand)           │
│                                             │
│  ✅ CAN WRITE:                               │
│  - Own role file                            │
│  - memory/YYYY-MM-DD.md                     │
│  - MEMORIES.md (auto-capture only)          │
│  - Source code (if build/dev role)           │
│                                             │
│  ❌ MUST NOT:                                │
│  - Write to other role files directly       │
│  - Create files outside .muse/ convention   │
│  - Discuss other roles' topics in depth     │
│                                             │
│  📡 CROSS-ROLE COMMS:                        │
│  - Only via directive protocol (📡 S{NNN})  │
│  - Sender writes directive to OWN file      │
│  - Receiver picks up during /resume         │
└─────────────────────────────────────────────┘
```

### Multi-Project Protocol

For users managing multiple projects:

```
~/ProjectA/.muse/build.md     ← ProjectA's build role
~/ProjectB/.muse/build.md     ← ProjectB's build role
~/ProjectA/.muse/strategy.md  ← May hold cross-project directives
```

**Cross-project directives** use `PROJECT/ROLE` targeting:
```
📡 S041→MUSE/BUILD: 🟡 ...    ← Targets MUSE project's BUILD role
📡 S040→DYA/GROWTH: ✅ ...     ← Targets DYA project's GROWTH role
```

**Path resolution**: `CLAUDE.md` MAY specify absolute paths for cross-project strategy files:
```markdown
> strategy.md 绝对路径: `/Users/jj/Desktop/DYA/.muse/strategy.md`
```

## Integration Points

### For MCP Servers

An MCP server implementing MUSE protocol is **included** — see `scripts/mcp-server.sh` (added in v2.15.0).

| Tool | Description | Status |
|------|-------------|:------:|
| `muse_get_status` | Read all L0 lines → return project status | ✅ |
| `muse_list_roles` | List role files with summaries | ✅ |
| `muse_get_role` | Read a specific role file (L1) | ✅ |
| `muse_send_directive` | Create a 📡 directive in a role file | ✅ |
| `muse_write_memory` | Append to today's memory file | ✅ |
| `muse_search_memory` | Search across memory files + MEMORIES.md | ✅ |

**Configuration**: Add to your MCP client config:
```json
{
  "mcpServers": {
    "muse": {
      "command": "/path/to/muse/scripts/mcp-server.sh",
      "args": ["--project-root", "/path/to/project"]
    }
  }
}
```

### For CLI Tools

```bash
# Get project status (all L0 lines)
grep "<!-- L0:" .muse/*.md

# Check for pending directives
grep "🟡" /path/to/strategy.md

# Count role file lines (bloat check)
wc -l .muse/*.md
```

### For IDE Plugins

- **Status bar**: Show L0 summary of current role
- **Sidebar**: List pending directives (🟡)
- **On save**: Auto-update L0 line if role file changed

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.1 | 2026-03-15 | MCP server implemented (`scripts/mcp-server.sh`) |
| v1.0 | 2026-03-15 | Initial spec (Batch 2) |


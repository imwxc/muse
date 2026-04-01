## [2.38.0] - 2026-04-01

### Added
- **`iterative-retrieval` Skill** — Pattern for progressively refining context retrieval. Solves the subagent context problem with self-contained context principle.
- **Skills count**: 64 → 65 (Core 7 + Toolkit 45 + Ecosystem 13)

### Changed
- **`verification-before-completion` Upgrade** — AC-first workflow, pre-flight fast-fail, structured Judge verdicts, "What Real Verification Looks Like" section.
- **`creating-skills` Upgrade** — Advanced Frontmatter v3.0 (when_to_use / allowed-tools / paths separation).
- **`subagent-driven-development` Upgrade** — 4-stage workflow mapping with spec compliance + code quality two-stage review.

## [2.37.0] - 2026-04-01

### Added
- **`coordinator-mode` Skill** — Multi-agent coordination SOP derived from Anthropic's internal coordinator architecture. Synthesis iron law (understand → spec → dispatch), Continue/Spawn decision matrix, concurrency management rules.
- **Skills count**: 62 → 64 (Core 7 + Toolkit 44 + Ecosystem 13)

### Changed
- **`dispatching-parallel-agents` Rewrite** — Enhanced with synthesis iron law, self-contained prompt requirement, continue/spawn matrix, and read-only vs write concurrency rules. Source: Anthropic coordinator patterns.

## [2.36.0] - 2026-03-30

### Added
- **`context7` Skill** — Real-time documentation retrieval when coding. Fetches latest library/framework API docs instead of relying on training data. Source: [upstash/context7](https://github.com/upstash/context7).
- **`deep-dive` Skill** — 2-stage pipeline: trace (causal investigation) → deep-interview (requirements crystallization) with 3-point injection. Source: [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode).
- **`trace` Skill** — Evidence-driven tracing lane that orchestrates competing hypotheses for root-cause analysis. Source: oh-my-claudecode.
- **`sciomc` Skill** — Parallel scientist agents for comprehensive research with AUTO mode. Source: oh-my-claudecode.
- **Skills count**: 58 → 62 (Core 7 + Toolkit 42 + Ecosystem 13)

### Fixed
- **Security**: Removed hardcoded API key from benchmark test file (`scripts/s061v2_bench/test_sdk.js`)

## [2.35.0] - 2026-03-28

### Added
- **Digital Twin Profiling** — The `/bye` workflow now actively extracts the user's communication style, decision-making logic, and vocabulary, and continuously writes it into a "Digital Twin Profile". This enables the system to increasingly mimic the user's native "Founder's Voice" over time, mirroring the OpenClaw passive adaptation loop.

# Changelog

## [2.34.0] - 2026-03-25

### Added
- **BUILD→QA AC Dual-Write Protocol** (`workflows/bye.md` Step 3.6) — S064: Prevents cross-conversation AC sync failures between BUILD and QA roles:
  - **Root cause**: BUILD writes AC to `build.md`, but QA conversation may have already cached the old version → doesn't see new AC → wastes time in back-and-forth confirmation. Happened 3/25 with Prometheus, wasting ~15 minutes.
  - **Dual-write**: BUILD now writes AC simultaneously to both `build.md` (`## 🎯 BUILD→QA`) AND `qa.md` (`## 📡 BUILD→QA 待验证`), with a `⚡` sticky notification at the top of `qa.md`.
  - **Unified AC numbering**: `AC-SXXX-NN` format (S=strategy decision, NN=sequence). Eliminates numbering divergence between files.
  - **QA force re-read**: `/resume [project] qa` Step 4.5b now force-reads `build.md`'s latest AC section (not relying on conversation cache) and cross-validates against `qa.md` entries.
  - **QA cleanup flow**: After verification, QA removes sticky `⚡` notification and marks each AC as `✅ PASS` or `❌ FAIL` in both files.

### Changed
- **`/resume [project] qa`** (`workflows/resume.md`) — New Step 4.5b: mandatory `build.md` AC re-read + cross-validation before starting verification
- **AC Standard** (`workflows/sync.md`) — New "AC 编号规范" section documenting the `AC-SXXX-NN` naming convention, dual-write rules, and QA cleanup flow

## [2.33.0] - 2026-03-25

### Added
- **Static/Dynamic User Profile Split** (`USER.md`, `workflows/bye.md`, `workflows/resume.md`) — S060 P2: User context now separated into two layers:
  - **Static Profile**: Permanent facts and preferences (language, model, code style). Always loaded in full by `/resume` Step ④.a. Only modifiable via `/settings` or manual edit.
  - **Dynamic Profile**: Recent active work focus areas (auto-updated). `/bye` Step 4.9 infers 1-3 focus topics from the session and writes dated entries. `/resume` Step ④.b only loads entries within a 7-day window — older entries are silently skipped, preventing stale project context from polluting new sessions.
  - Dedup on update: same topic → update content + date (no duplicates). Capacity cap: max 10 entries.
  - Template updated: `templates/USER.md` restructured with `## Static Profile` and `## Dynamic Profile` sections.

### Changed
- **`/bye` Step 6 checklist** — New compliance line: `Step 4.9: Dynamic Profile=[N updates/no change]`
- **`/resume` Boot Step ④** — Now shows `④.a Static Profile` (full inject) + `④.b Dynamic Profile` (7-day window filter)

## [2.32.0] - 2026-03-24

### Added
- **Graph Memory Relations** (`workflows/distill.md`, `workflows/bye.md`) — MUSE memory entries now track relationships to existing knowledge:
  - **UPDATES**: New facts that supersede old ones → old entry gets `~~strikethrough~~` + `(historical)` tag, preserving full history chain
  - **EXTENDS**: Supplementary details → appended as `↳ EXTENDS:` sub-bullet under existing entry
  - **DERIVES**: Insights deduced from existing data → tagged `(derived from: [EXISTING_TAG])`
  - **NEW**: Unrelated entries → normal append (backward compatible)
  - Both `/distill` (Step 3a) and `/bye` auto-capture (Step 4.7) apply graph relation detection before writing to MEMORIES.md
  - Strikethrough rules: `[FACT]` and `[DECISION]` can be superseded; `[LESSON]` preserved (evolves, not replaced)
  - Cleanup threshold: 20+ historical entries triggers archive prompt
- **Auto-Expiry Temporal Tagging** (`workflows/bye.md`, `workflows/resume.md`, `workflows/distill.md`) — Memory entries classified by temporal type at write time:
  - `[PERMANENT]` — Never expires (architecture decisions, user preferences, lessons)
  - `[TEMPORAL:YYYY-MM-DD]` — Expires on specific date (deadlines, version-specific bugs, events)
  - `[EPISODIC]` — Session context that naturally fades (debug sessions, progress notes)
  - `/resume` temporal filtering: expired `[TEMPORAL]` entries skipped, `[EPISODIC]` entries >3 days reduced to section headers only
  - `/distill` temporal awareness: expired entries skipped, episodic entries reviewed for pattern upgrade to `[PERMANENT]`
  - Inspired by [Supermemory](https://github.com/supermemory) graph relations and smart forgetting concepts
  - **Red line maintained**: Zero dependencies — pure Markdown + LLM reasoning, no vector DB or cloud services

### Changed
- **MEMORIES.md template** (`templates/MEMORIES.md`) — Updated format documentation with graph relation examples and temporal tag reference
- **`/resume` boot sequence** — New sub-steps: ①.1 temporal filter for MEMORIES.md, ②.1 episodic deprioritization, ②.2 temporal expiry skip

## [2.31.0] - 2026-03-24

### Added
- **Unexecuted Directive Scan** (`workflows/resume.md`) — New Boot Step 2.8: after reading the role file, `/resume` now `grep_search`es for all `🟡` markers to surface received-but-unexecuted directives. Reports them as `📡 N received directives pending execution` in the recovery report.
  - **Root cause fixed**: When Strategy marks a directive `✅ delivered` in `strategy.md`, new `/resume` sessions skip it (Step ③ filter). But the directive may still be `🟡 received` in the role file, buried in a 500+ line document. Without this step, new conversations completely miss pending work.
  - Output format: lists each `🟡` directive with ID and summary, flagged as `🚨 priority for this session`.

## [2.30.0] - 2026-03-23

### Added
- **Conversation Summaries Cross-Validation** (`workflows/resume.md`) — New Boot Step ②.3 detects memory gaps caused by `/bye` not being executed. Cross-references system conversation summaries against `memory/` files to identify unrecorded sessions. Reports them as `⚠️ No memory record (possible /bye skip)` with inferred key completions.
- **Confidence Tagging for Pending Items** (`workflows/resume.md`) — Step ②.5 now tags each "next step" item with confidence level: 🟢 confirmed pending (role file), 🟡 possibly completed (memory-only, no role file match), 🔴 likely completed (conversation summary shows follow-up). Prevents falsely reporting completed work as pending.
- **Previous Session Carryover Tracking** (`workflows/bye.md`) — New `✅ 上轮遗留:` field in memory template. When completing a task listed as "下一步" in a previous session, agents must explicitly mark it, creating a completion chain across conversations.
- **Sync Up Strategy Enforcement** (`workflows/bye.md`, `workflows/sync.md`) — All `sync [project] [role] up` operations now explicitly require propagation to `strategy.md`. Routing table updated to show strategy.md as implicit target for all up operations. Prevents cross-project build progress from being silently lost.

### Fixed
- **MUSE build sync missing strategy** — `bye.md` routing table for MUSE build only listed `build.md` as target, omitting `strategy.md`. Strategy conversations would miss MUSE progress entirely. Now explicitly listed + enforcement rule added.
- **`/resume` Step 5 unsync detection incomplete** — Only checked `memory/` files for strategy-relevant events. Now also checks conversation summaries for unrecorded sessions that may contain strategy-relevant completions (deployments, submissions, releases).

## [2.29.0] - 2026-03-22

### Added
- **Builder Ethos** (`ETHOS.md`) — 5 core principles for AI-governed multi-project development:
  - *Boil the Lake* — AI makes completeness near-zero cost, always do the full implementation
  - *Search Before Building* — Three layers of knowledge (tried-and-true → new-and-popular → first-principles)
  - *Ship the Narrowest Wedge* — Scope tight, ship fast, learn from real usage
  - *Memory Over Momentum* — Lessons compound; build on what you learned, not just what excites you
  - *Governance Is Speed* — Structure makes solo builders faster, not slower
  - Inspired by [gstack](https://github.com/garrytan/gstack) by Garry Tan (YC CEO), adapted with 3 MUSE-original principles
- **`/sprint` workflow** (`workflows/sprint.md`) — Feature development pipeline connecting existing MUSE skills into an ordered sprint:
  - Think (`brainstorming`) → Plan (`writing-plans` + `architect-agent`) → Build (`executing-plans`) → Review (`code-reviewer-agent` + `security-reviewer-agent`) → Test (`webapp-testing` + `e2e-runner`) → Ship (`github-pr-creation` + `github-pr-merge`) → Reflect (`/retro` + `/bye`)
  - Use case: `You: /sprint` → agent walks through all 7 phases with the right skill at each step
- **`/retro` workflow** (`workflows/retro.md`) — Development retrospective from memory logs and git history:
  - Gathers: git commit stats, memory/ daily logs, STATUS.md diffs
  - Outputs: shipping velocity, decisions made, blockers hit, lessons learned, next-week priorities
  - Use case: `You: /retro` → weekly summary with commit counts, lines changed, shipped features

### Changed
- **`brainstorming` skill upgraded** (`skills/toolkit/brainstorming/SKILL.md`) — Now includes gstack-inspired reframing:
  - Phase 1: Reframe the problem (challenge 3 hidden premises before exploring solutions)
  - Phase 2: Generate 3 approaches with effort estimates (narrowest wedge / balanced / full vision)
  - Phase 4: Standardized design doc output (`docs/plans/YYYY-MM-DD-<topic>-design.md`) that downstream skills read

## [2.28.0] - 2026-03-21

### Fixed
- **`/bye` sync gap — memory written but role files not updated** (`workflows/bye.md`) — Root cause: "Major Event Checklist" only covered 7 event types (App Store releases, bug fixes, Deck deployments, etc.), missing security audits, GitHub/npm releases, new skills, product insights, cross-project infra changes, and external communications. Agent would conclude "no sync needed" when events didn't match the narrow checklist. Expanded to **12 event types**. Added mandatory **Proactive Diff** step: after writing memory, agent must compare each memory entry against the role file item-by-item (✅ already synced / 📝 needs sync / ⏭️ skip with reason). Blanket "no sync needed" judgments are now explicitly prohibited.
- **`/resume` sync-check keyword coverage** (`workflows/resume.md`) — Strategy resume's memory→role-file gap detection was grepping for only 12 keywords. Added 11 more: `安全/security/泄露/轮换/filter-branch/Skill/instinct/预装/发布/release/宪法/CLAUDE.md/推荐人/已发送`.

## [2.27.0] - 2026-03-21

### Added
- **Onboarding Security** (`workflows/start.md`) — `/start` now generates a comprehensive `.gitignore` template with MUSE-specific entries (`.muse/`, `.agent/`, `.gemini/`, `CLAUDE.md`, `.env*`, private keys). All new MUSE users get secret leak protection from day one.

### Fixed
- **git-commit skill hardened** (`skills/toolkit/git-commit/SKILL.md`) — Expanded "NEVER commit" list with MUSE-specific sensitive patterns (`.muse/`, `.agent/`, `.env.local`, API key patterns). Added cross-reference to `git-security-guard` skill for comprehensive pre-commit security checks.

## [2.26.0] - 2026-03-21

### Added
- **Git Security Guard** (`skills/toolkit/git-security-guard/SKILL.md`) — Pre-commit/push secret leak prevention. Detects API keys (OpenAI, Google, Groq, Stripe, AWS, GitHub PAT), JWT tokens, private keys, wallet private keys, and sensitive files (.env, .muse/, .agent/) before they enter git history. Includes emergency response procedures for leaked secrets (filter-branch + force push + key rotation). Born from a real security incident on 2026-03-21.
- **Particle Background** (`skills/toolkit/particle-background/SKILL.md`) — 3D particle background integration templates for web projects.

### Fixed
- **Topology rendering** — Replaced Mermaid with pure HTML/Canvas rendering for Agent Topology view. Fixed node text visibility with SVG style injection.
- **3D particle background** — Fixed topology layout issues with particle backgrounds.

## [2.25.0] - 2026-03-18

### Added
- **Systematic Debugging v2 — Passive Behavior Detection + Pressure Escalation** (`skills/toolkit/systematic-debugging/SKILL.md`):
  - **Passive Behavior Auto-Detection**: Automatically triggers when detecting giving-up language ("I cannot"), blame-shifting without verification ("probably a permissions issue"), busywork spinning (same parameter tweaks), or passive waiting (stops after fixing, waits for instructions). Supports multi-language frustration signals (EN/CN).
  - **L1→L4 Pressure Escalation**: Progressive mandatory actions based on consecutive failure count. L1 (2nd fail): switch approach. L2 (3rd): search + read source + 3 hypotheses. L3 (4th): complete 7-Point Rescue Checklist. L4 (5th+): desperation mode with isolated PoC.
  - **7-Point Rescue Checklist**: Mandatory for L3+ — read errors word-by-word, proactive search, read 50+ lines of context, verify assumptions, invert assumptions, minimal isolation, change direction.
  - **Anti-Rationalization Table**: 11 blocked excuses with auto-escalation triggers (e.g., "I suggest the user handle this manually" → L3).
  - Inspired by [PUA](https://github.com/tanweai/pua) (8.5K⭐), adapted to MUSE's engineering-first methodology (no corporate rhetoric — mandatory actions instead).

### Fixed
- **Dashboard constellation and topology parsing** — Fixed parsing for real project data (non-demo) in Memory Constellation and Agent Topology views.

## [2.24.0] - 2026-03-18

### Added
- **Dashboard v3 — Paperclip Iterations** (`docs/dashboard.html`):
  - **Memory Constellation (P0)**: Semantic knowledge mapping that parses `MEMORIES.md` for `[FACT]`, `[DECISION]`, and `[LESSON]` tags to generate a meaningful word cloud of project intelligence.
  - **Interactive Node Drill-Down (P1)**: Clickable Mermaid.js topology nodes. Opens a glassmorphic modal showing the Agent's internal Constitutional State (L0), active directives, and performance metrics.
  - **Local File Polling (P2)**: Live auto-refresh capability using the File System Access API. Synchronizes the dashboard every 15 seconds when a local project directory is loaded.
  - **Silent Refresh Logic**: Optimized rendering to prevent layout jumps or scroll resets during background auto-updates.
- **Improved Demo Data**: Updated "Try with Demo Data" flow with rich mock constellation and topology metrics for a better first-time experience.

## [2.23.0] - 2026-03-18

### Added
- **Dashboard v2 Visual Enhancements** (`docs/dashboard.html`):
  - **Visual Kanban Board (P0)**: Trello-style 3-column layout (🟡 Pending / 🔄 Active / ✅ Done) parsing cross-role `📡` directives dynamically.
  - **Context Pressure Gauge (P1)**: Token burn risk indicator. Calculates active loaded lines from role files, categorizing risk levels (Low < 400, Medium < 800, High > 800) into a visual ring chart.
  - **Agent Topology Graph (P2)**: Interactive DAG topology generated via Mermaid.js, mapping agent communication pipelines (source → target) based on directive data.
  - Continued zero-dependency philosophy: 100% client-side rendering.
## [2.22.0] - 2026-03-17

### Added
- **Memory Loss Prevention** — 5-layer SOP fix to prevent cross-conversation context loss:
  - `/bye` Step 1: **Context Recovery 三問** — Self-check forcing agents to verify next-session context completeness
  - `/bye` Step 4: **Enriched memory template** — Now records rejected proposals, user corrections, URLs, and cross-conversation context (not just what was done)
  - `/resume` Boot Step ⑦: **Project Deployment Fact Table** check — All resume reports must include active project URLs
  - `/resume` Step 5.3: **Deployment fact table validation** — Cross-verify versions, URLs, and deployment status
- **Warning annotations** in memory template — `⚠️「如有」≠「可省略」` and `🔴 最常见遗漏` blocks to prevent memory gaps

### Fixed
- **`/bye` memory template too sparse** — Old template only captured 3 fields (完成/决策/下一步). New template captures 7 fields including rejected proposals (`❌ 否决`), user quotes (`💬 关键用户原话`), URLs (`🔗`), and cross-session context (`📡 跨对话上下文`)
- **`/resume` missing URL awareness** — Agents had no way to quickly find project deployment URLs. New Boot Step ⑦ reads deployment fact table from strategy.md

## [2.21.0] - 2026-03-17

### Added
- **TF-IDF Search** (`scripts/search.sh`) — Zero-dependency ranked search across MUSE project context:
  - Indexes `memory/` + `.muse/` + `skills/` + `MEMORIES.md`
  - TF-IDF scoring with normalized term frequency × inverse document frequency
  - Context snippets: best-matching line shown for each result
  - Scope filtering: `--scope memory|roles|skills|all`
  - Visual score bars and color output
  - New core skill: `skills/core/semantic-search/SKILL.md`
- **Dashboard v2 Enhancement** (`docs/dashboard.html`):
  - Expandable skill items: click to show description (parsed from SKILL.md YAML frontmatter)
  - Health tab: 🔥 active streak counter, 5 detailed stats (total lines, avg/day, total size), explanatory header
  - Bar chart hover: now shows `date: N lines`
  - GitHub button: purple → gold accent (matching landing page)
- **Benchmark Script** (`scripts/benchmark.sh`) — MUSE vs `.cursorrules` context coverage analysis:
  - Measures token efficiency, coverage breadth, and context quality
  - Generates comparison data for README and landing page
- **Benchmark Data in README** — Added quantitative MUSE vs `.cursorrules` comparison to README and landing page

### Changed
- **Strategic Repositioning** — "Memory-Unified Skills & Execution" → "The AI Coding Governance System"
  - README.md: new subtitle, L0-L3 layer diagram, AGENTS.md compatibility framing
  - Landing page: hero subtitle, meta tags, comparison section, skill count 56→57
  - Tagline: "AGENTS.md defines the format. MUSE builds the system."
- Version bump: v2.20.0 → v2.21.0 across README, landing page, dashboard

## [2.20.0] - 2026-03-16

### Added
- **Online Dashboard** (`docs/dashboard.html`) — Personalized MUSE project visualization at [muse.mythslabs.ai/dashboard](https://muse.mythslabs.ai/dashboard):
  - 3 data loading methods: folder picker (File System Access API), file input, JSON paste
  - "Try with Demo Data" for instant preview
  - 100% client-side — data never leaves the browser
  - Stats grid, role cards, memory timeline (same as local dashboard)
  - Added Dashboard link to landing page navigation
- **Landing Page Updates** — Synced `docs/index.html` version to v2.20.0, added new features (Skill Marketplace, Web Dashboard, VS Code Extension, Online Dashboard)

## [2.19.0] - 2026-03-16

### Added
- **VS Code Extension** (`vscode-extension/`) — Browse MUSE roles, skills, and memory directly in VS Code:
  - Activity bar with **Roles**, **Skills**, and **Memory** tree views
  - In-editor **Dashboard** webview (Catppuccin dark theme)
  - **Skill Search** via QuickPick with keyword matching
  - **Context Health Check** command with memory file status
  - **Dashboard Generator** integration (runs `scripts/dashboard.sh`)
  - Status bar indicator showing MUSE project detection
  - Auto-activation on `CLAUDE.md`, `.muse/`, or `.agent/skills/` detection
  - 8 registered commands accessible via Command Palette

## [2.18.0] - 2026-03-16

### Added
- **Web Dashboard** (`scripts/dashboard.sh`) — Zero-dependency HTML dashboard generated from MUSE project data:
  - Stats grid: active roles, memory files, skills count, long-term memory words
  - Role cards with L0 summary lines, line counts, last modified dates
  - Memory timeline with chronological session entries (date, title, size)
  - Git metadata: branch name, commit count
  - Dark theme with glassmorphism, animated transitions, tabbed navigation
  - Serve mode: `--serve [port]` for instant local preview
  - Self-contained single HTML file (no external dependencies)

## [2.17.0] - 2026-03-16

### Added
- **Skill Marketplace Discovery Enhancement** (`scripts/skill-discovery.sh`) — 6 new commands transforming local skill browser into a full marketplace:
  - `categories` — Browse skills across 12 auto-detected categories (Git & VCS, Testing & QA, Frontend & Design, Backend & Data, Mobile, Documentation, Security, Planning & Architecture, Meta & Context, DevOps & Deploy, Agent Orchestration, General)
  - `stats` — Full system statistics (skill counts by tier, size analysis, composition metrics, storage usage)
  - `export <name>` — Export any skill as a shareable `.tar.gz` bundle
  - `recommend <context>` — Smart skill recommendations with word-overlap relevance scoring (⭐ indicators)
  - `remote-install <github-url>` — Install skills directly from GitHub URLs
  - `registry` — Fetch community skill index from GitHub for discovery

## [2.16.0] - 2026-03-16

### Added
- **Skill Format Converter** (`scripts/convert-skills.sh`) — Export all 56 MUSE skills to 6 AI coding tool formats:
  - **Cursor**: `.cursor/rules/*.mdc` (per-skill rule files with frontmatter)
  - **Windsurf**: `.windsurfrules` (single combined file)
  - **Copilot**: `.github/copilot-instructions.md` (single file)
  - **OpenClaw**: `.openclaw/agents/*/SOUL.md + AGENTS.md`
  - **Aider**: `CONVENTIONS.md` (single combined file)
  - **Antigravity**: `.gemini/antigravity/skills/*/SKILL.md`
  - `--tool all` exports to all 6 formats at once
  - `--import agency-agents /path` imports 142 agent prompts from agency-agents (35K+ ⭐) into MUSE format
  - `--list` browses all 56 skills with tier badges
- **Agent Personality Framework** (`creating-skills` skill) — Absorbed from agency-agents prompt engineering best practices:
  - Five Pillars of Effective Agent Design (Identity, Deliverables, Metrics, Workflow, Memory)
  - Personality Design Template for role-based skills
  - Priority Markers standard (🔴 Blocker / 🟡 Suggestion / 💭 Nit)
  - Quality Elevation Checklist

## [2.15.0] - 2026-03-15

### Added
- **MCP Server** (`scripts/mcp-server.sh`) — Zero-dependency Bash MCP server implementing the Agent Protocol spec:
  - JSON-RPC 2.0 over stdio (no Node.js/Python required, only `jq`)
  - 6 tools: `muse_get_status`, `muse_list_roles`, `muse_get_role`, `muse_send_directive`, `muse_write_memory`, `muse_search_memory`
  - Works with Claude Code, Cursor, Gemini CLI, or any MCP-compatible client
  - Auto-detects project root from script location
  - Security: path traversal protection, sandboxed to `.muse/` + `memory/` directories
- **MCP Config Template** (`scripts/mcp-config.json`) — Drop-in configuration for MCP clients

## [2.14.0] - 2026-03-15

### Added
- **Semantic Compression** (`/bye` Step 1) — mem0-inspired hierarchical compression for memory writes:
  - Classify work into 1-3 storylines instead of flat listing
  - Compression ratios: ≤5 turns = 1:1, 6-15 turns = 3:1, ≥16 turns = 5:1
  - Must-keep items: version changes, user decisions, file creation/deletion, external operations
- **Session Checkpoint** (`context-health-check`) — OpenViking-inspired mid-conversation auto-checkpoints:
  - Silent checkpoint every 15 turns (no user interruption)
  - Triggers: turn count, milestone events (commit/deploy), 🟡 detection, topic switch
  - Compressed format: `📍 Checkpoint` with 3-4 line snapshot appended to `memory/`
  - Complements Defensive Auto-Save: Auto-Save = crash recovery, Checkpoint = quality preservation
- **Auto Profile** (`/bye` Step 4.8) — Supermemory-inspired automatic user preference detection:
  - Detects: language, code style, work hours, tech preferences, verbosity
  - Auto-enriches `USER.md` with `(auto-detected)` tag
  - Dedup + conflict detection (never overwrites manual `/settings`)
  - Max 3 preferences per session, guardrails against over-fitting
  - `/bye` Step 6 output now includes `👤 Auto-profile` feedback line

## [2.13.0] - 2026-03-15

### Added
- **Skill Marketplace Discovery** (`scripts/skill-discovery.sh`) — CLI tool for browsing, searching, and installing MUSE skills:
  - `list` — Browse all 56 skills with tier badges (🔵 Core / 🟢 Toolkit / 🟠 Ecosystem)
  - `search <query>` — Case-insensitive keyword search across skill names and descriptions
  - `info <name>` — Detailed skill view (tier, path, lines, dependencies, description)
  - `install <name> [dir]` — Copy a skill to any project's `.agent/skills/`
  - `index` — Auto-generate `SKILL_INDEX.md` catalog with full skill listing
- **SKILL_INDEX.md** — Auto-generated skill catalog (56 skills across 3 tiers, 7 ecosystem packs)

## [2.12.0] - 2026-03-15

### Added
- **Auto Memory Capture** (`/bye` Step 4.7) — Supermemory + claude-mem-inspired real-time knowledge extraction:
  - Automatically extracts `[LESSON]` / `[DECISION]` / `[FACT]` entries from session work summaries at `/bye` time
  - Dedup check against existing MEMORIES.md (ADD / UPDATE / NOOP)
  - Token budget guard: skips capture if MEMORIES.md exceeds 2250 words
  - Guardrails: max 5 entries per session, no TODO capture (handled by role files)
  - `/bye` Step 6 output now includes `📸 Auto-capture` feedback line
- **Agent Protocol Specification** (`skills/core/agent-protocol/SKILL.md`) — MemOS-inspired machine-readable role file protocol:
  - Formalizes L0 header, section semantics, directive protocol (📡), memory protocol, and isolation rules
  - MCP server integration points: `muse_get_status`, `muse_send_directive`, `muse_auto_capture`, etc.
  - CLI and IDE plugin integration patterns
  - Multi-project cross-role communication spec
  - Core skill count: 4 → 5 (layered-context + **agent-protocol**)

## [2.11.0] - 2026-03-15

### Added
- **L0 Layered Context Loading** — OpenViking-inspired three-layer protocol (`skills/core/layered-context/SKILL.md`):
  - Every `.muse/*.md` file now has a `<!-- L0: ... -->` one-line summary (first line)
  - `/resume` boot sequence: new Step ④.5 scans all L0 lines (~400 tokens) before deep-reading current role
  - Decision tree: L0 (quick answer) → L1 (full role file) → L2 (memory/grep on demand)
- **Enhanced `/distill` workflow** — mem0 + Supermemory-inspired improvements:
  - Structured extraction: `[FACT]` / `[DECISION]` / `[LESSON]` / `[TODO]` tags for every memory entry
  - Deduplication detection: ADD / UPDATE / NOOP against existing MEMORIES.md (from mem0's consolidation pipeline)
  - Decay detection: 30-day TTL → `[DECAY]` flag for stale entries (from Supermemory's smart forgetting)
  - Token budget: MEMORIES.md target ≤3000 tokens (~2250 words)

### Fixed
- **Skill count** — CHANGELOG v2.5.0 entry corrected from "54 skills" to "48 skills" (actual: 4 Core + 7 Ecosystem + 37 Toolkit)

## [2.10.2] - 2026-03-14

### Fixed
- **`/bye` Step 1 context-degradation memory loss** — Root cause: Agent only remembers last ~20% of long sessions, causing `/bye` to write incomplete memory (e.g. 4-line summary for a 1469-line session). New mandatory safeguards:
  - Tool call inventory before writing memory (code edits / commands / file reads / user rounds)
  - High-risk detection: ≥10 rounds or ≥20 tool calls triggers full-conversation review
  - User statements override Agent inference ("user deleted X" ≠ "auto-fix will handle X")
  - Long sessions (≥10 rounds) must write memory grouped by time segment, not just 3-5 lines

## [2.10.1] - 2026-03-14

### Fixed
- **`/resume` Step 2.5 cross-role mixing** — Pending items from other roles/projects no longer contaminate current role's recommendation list. Items now grouped: ① current role's items in main list ② other roles in separate `⚠️ Other Roles` section with `[ROLE]` tags
- **`/bye` Step 3.5 stale todo checkboxes** — New mandatory step: sync must update `[ ]` → `[x]` for completed items in `.muse/` files. Previously, sync only wrote summaries but never flipped checkboxes, causing next `/resume` to show completed work as pending

## [2.10.0] - 2026-03-14

### Added
- **Cross-project strategy directive path** — `/resume` now pre-checks `CLAUDE.md` for strategy.md absolute path before searching. Supports multi-project setups where strategy.md lives in a different repo
- **🟡/✅ directive filter rules** — Clear protocol: 🟡 = pending (must pull), ✅ = already received (skip). Only the target role's `/resume` can mark ✅. Prevents Strategy accidentally marking directives as delivered before they're pulled
- **`/bye` mandatory `ls` three-step method** — Convo filename generation now enforces: Step 5a (determine date) → Step 5b (run `ls` command, never guess) → Step 5c (assemble filename). Eliminates sequence number collisions

### Fixed
- **`/resume` cross-project directive mismatch** — Was searching local `.muse/strategy.md` (doesn't exist in satellite projects). Now reads absolute path from `CLAUDE.md` Project-Specific Rules (S035)
- **`/bye` convo sequence number guessing** — Agent would default to `-01-` without checking existing files. Now MUST run `ls convo/YYMMDD/` — skipping = execution failure (S035)
- **Strategy directive loss** — Directives marked ✅ at creation time were invisible to target roles. New rule: Strategy MUST use 🟡 when creating directives (S035)

### Changed
- **Demo animation remade** — 85 frames, 17 seconds. Shows full MUSE workflow: `/resume` → boot sequence → work → `/ctx` → `/bye`
- **.gitignore** — Added `node_modules/` and `package-lock.json`

## [2.9.0] - 2026-03-14

### Added
- **`/bye` Iron Rule** — Mandatory 6-step execution enforcement. Agent can no longer skip SOP steps or give short summaries instead of full sync+memory+archive
- **Memory System Declaration** — Explicit declaration that MUSE uses `.muse/*.md` role files, NOT trio-status-sop (`STATUS.md`). Prevents erroneous file creation
- **Complete Project-Role Routing Table** — 13-combination routing table (3 projects × 4+ roles) mapping each conversation type to its correct `.muse/` sync target
- **`/bye` Step 5 CAUTION block** — Convo export step explicitly marked as non-skippable

### Fixed
- **`/bye` not auto-executing SOP** — Agent would give brief summary and stop. Now enforced with `NEVER skip` iron rule language
- **`/bye` creating wrong status files** — Agent confused trio-status-sop SKILL with MUSE role system, creating `STATUS.md` / `MARKETING_STATUS.md` in project roots. Now explicitly banned
- **`/bye` missing project routing** — Only had 5 identity types. Now has 13 with fallback rules

## [2.8.1] - 2026-03-13

### Added
- **[nah](https://github.com/manuelscgipper/nah) recommended companion** — Context-aware permission guard for Claude Code. Added to README, README_CN, install.sh post-install tip, and Credits section
- **P1 features** — Cursor rules generator (`scripts/generate-cursorrules.sh`), skill dependency declarations, memory archive lifecycle
- **GEO/SEO skill** in CLAUDE.md template speed reference table

### Fixed
- **MUSE project routing** — Added missing MUSE project routes to `resume.md` (only DYA/Prometheus had routes)
- **Cursor rules generator** — Target dir validation fix

## [2.8.0] - 2026-03-13

### Added
- **Multi-tool installer** (`scripts/install.sh`) — One command to install MUSE on any supported AI coding tool:
  - **Claude Code / OpenClaw**: `.agent/skills/` + `CLAUDE.md` (native format)
  - **Cursor**: `.cursor/rules/*.mdc` (YAML frontmatter with `alwaysApply`)
  - **Windsurf**: `.windsurf/rules/*.md` (activation comments)
  - **Gemini CLI**: `.gemini/skills/` + `GEMINI.md` (native skill format)
  - **Codex CLI**: `AGENTS.md` (single concatenated file)
- Auto-detection of installed tools (`--list`)
- Interactive + CLI modes (`--tool`, `--target`, `--core-only`)
- README.md + README_CN.md: Added tool support table and multi-tool quick start (Option B)

## [2.7.2] - 2026-03-13

### Fixed
- **QA↔BUILD sync gap** — `/sync receive` in BUILD now checks `build.md` itself for QA→BUILD notifications (previously only checked `strategy.md` + `qa.md`, missing QA broadcasts entirely)
- **`/resume build` dual QA check** — Now checks both `qa.md` for FAIL reports AND `build.md` for QA→BUILD notifications
- **QA broadcast format standardized** — Fixed section header (`📡 QA→BUILD 通知`) + searchable marker (`🟡 待 BUILD 处理`) so agents can grep-find notifications
- **QA iron rule #7: READ-ONLY** — QA must never modify source code directly; only report bugs and route to BUILD via standard notification format
- **Search keyword reference table** — Added to `sync.md` so agents know exactly what to grep for each notification type

## [2.7.1] - 2026-03-13

### Added
- **Auto QA Re-Verify** — `/resume qa` auto-detects FAIL items from `qa.md` "Pending Re-Verify" section and re-verifies them. User just types `/resume qa` — zero manual input
- **qa.md template** — Added "Pending Re-Verify" section for structured FAIL item tracking

### Fixed
- **`/settings language` enforcement** — Language changes now MUST update `CLAUDE.md` Iron Rule #1 (not just `USER.md`). Added `[!CAUTION]` block + verify step + immediate language switch. Prevents silent language change failures
- **MUSE repo self-configuration** — Added `.agent/` symlinks, `memory/`, `CLAUDE.md`, `MEMORIES.md` so the MUSE repo itself works as a MUSE workspace

## [2.7.0] - 2026-03-13

### Added
- **`/settings` command** — Unified preference management: language, AI model, docs convention, code style. Replaces `/model` (backward-compatible alias kept)
- **Pre-Flight Check in `/resume`** — Detects missing `CLAUDE.md` / `USER.md` / `memory/` / `.muse/` and redirects to `/start` instead of crashing
- **Mid-Conversation Sync** — `/sync receive` pulls updates from other roles without ending the conversation (e.g., build pulls QA results live)
- **`/start` in README Commands** — First-time setup now prominently listed

### Changed
- **`resume.md` fully genericized** — Removed all DYA/Prometheus hardcoded tables and paths. Now works for any project out of the box
- **`resume.md` rewritten in English** — All instructions localized to English for open-source users
- **`start.md` updated** — Added `/settings` to command tutorial and post-setup notes
- **`setup.sh` updated** — Next steps now mention `/start` and `/settings`
- **README.md + README_CN.md** — Commands table updated with `/start`, `/settings`, `/sync receive`

### Removed
- **`model.md`** — Replaced by `/settings` (which handles model + language + docs + code style)
## [2.6.0] - 2026-03-13

### Added
- **QA System v2.0** — Complete rewrite of `qa.md` with:
  - 🚀 Quick Start guide (3 launch methods: Strategy-assigned / Build-completed / Pre-release regression)
  - 📋 7-step SOP (AC source → environment → verify → error paths → report → judge → routing)
  - 📝 3 complete use cases with step-by-step examples
  - 📡 Result routing table (PASS/FAIL → where to write, who to notify)
- **`/resume [project] qa`** — New QA-specific resume route in `resume.md`
- **Quick Start sections** — Added to all role files (`build.md`, `growth.md`, `ops.md`, `research.md`, `fundraise.md`)
- **QA routes in MUSE.md** — `/resume qa` and `/resume prometheus qa` in routing table

### Fixed
- **`bye.md` convo naming bug** — Replaced hardcoded example date with dynamic rules (use current date, check folder for max sequence number). Added ❌/✅ error/correct examples
- **`resume.md` memory scanning** — Now detects `🔲` + `- [ ]` + `➡️ 下一步` items (was only `🔲`)
- **`bye.md` distill detection** — Improved MEMORIES.md timestamp check (stat + grep dual method)

## [2.5.0] - 2026-03-12

### Added
- **Ecosystem Packs** — 7 optional technology-specific skill packs (13 skills):
  - `react-nextjs` (3): react-best-practices, frontend-patterns, vercel-react-best-practices
  - `backend-database` (3): backend-patterns, postgres-patterns, database-reviewer
  - `expo-mobile` (3): expo-app-design, expo-deployment, upgrading-expo
  - `javascript-typescript` (1): javascript-typescript
  - `vercel` (1): vercel-deploy-claimable
  - `remotion` (1): remotion-best-practices
  - `web-artifacts` (1): web-artifacts-builder
- **New Toolkit skill**: `coding-standards` (universal coding standards for JS/TS/React/Node.js)
- Skill totals: 4 Core + 37 Toolkit + 7 Ecosystem = **48 skills**

### Fixed
- Cleaned DYA-specific references from `database-reviewer`
- Fixed merge conflict markers in `coding-standards`

## [2.4.1] - 2026-03-12

### Added
- **10 more toolkit skills** (total: 4 Core + 35 Toolkit = 39 skills)
  - `api-design-principles`, `dispatching-parallel-agents`, `doc-coauthoring`
  - `markitdown`, `using-git-worktrees`, `theme-factory`
  - `github-pr-merge`, `doc-updater`, `e2e-runner`, `subagent-driven-development`, `ralph-wiggum`

### Fixed
- Cleaned DYA-specific references from `doc-updater` and `e2e-runner`
## [2.4.0] - 2026-03-12

### Added
- **21 new skills** (total: 4 Core + 25 Toolkit = 29 skills)
  - **Core**: `using-superpowers` — meta-skill for effective skill usage
  - **Toolkit — Dev Flow**: `code-refactoring`, `code-documentation`, `security-review`, `tdd-workflow`, `changelog-generator`, `skill-creator`, `skills-updater`, `webapp-testing`
  - **Toolkit — Collaboration**: `github-pr-creation`, `github-pr-review`, `receiving-code-review`, `requesting-code-review`, `finishing-a-development-branch`
  - **Toolkit — Planning & Design**: `brainstorming`, `writing-plans`, `executing-plans`, `planner-agent`, `architect-agent`, `frontend-design`, `ui-ux-pro-max`

### Improved
- **README_CN.md**: Expanded from 142 → 310 lines (Architecture, LCM mapping, Defensive Auto-Save, Directory Convention, Customization, FAQ)
- **resume.md**: Added ②.5 unchecked items scan, 2.7 bloat check, 4.1 conflict resolution, 4.2 consistency check
- **bye.md**: Added 4.5 bloat check, triple cross-check (cross-file + intra-file + memory retroactive)
- **Assets**: banner.png compressed -36%
- **.gitignore**: Added `.muse/` `memory/` `convo/`


All notable changes to MUSE are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [2.3] — 2026-03-12

### Added
- **`/start` onboarding workflow** — 8-step interactive guide for first-time users (project naming, language, model, roles, skills, command tutorial)
- **`setup.sh`** — shell-based interactive setup wizard (language, model, skills install)
- **Role file lifecycle management** — auto-detect bloated .muse/ files, archive historical content
  - `/resume` step 2.7: >800 lines → auto-archive before work
  - `/bye` step 4.5: check all role files, warn if >800 lines
  - Archive pattern: `.muse/archive/` for historical decisions, directives, logs
- **Memory scan on resume** — `/resume` step 2.5: scan memory for 🔲 unfinished items, proactively remind user
- **MUSE.md lifecycle spec** — documented data flow: active (≤500 lines) → archive → MEMORIES.md

### Changed
- All Core SKILL.md files translated from Chinese to English (`context-health-check`, `strategic-compact`, `verification-before-completion`)
- README Quick Start now offers Option A (interactive `./setup.sh`) and Option B (manual copy)
- Footer links updated: Myths Labs → github.com/myths-labs, added creator JC profile and social links

### Fixed
- Broken `mythslabs.ai` link in README footer → corrected to `github.com/myths-labs`

---

## [2.2] — 2026-03-12

### Added
- **Directory Convention** — standardized naming for memory logs, conversations, role files
- **Distill scope control** — `/distill` global vs `/distill [project]` project-specific
- **Auto-distill detection** — `/bye` checks memory/ accumulation, suggests `/distill` when needed
- **L0 Defensive Auto-Save** — silent `CRASH_CONTEXT.md` update every 10 turns
- **Cheat Sheet** — quick reference card for all commands and role hierarchy

---

## [2.1] — 2026-03-12

### Added
- **GM (General Manager) role** — project-level CEO with L1/L2 autonomous decision authority
- **Multi-project architecture** — workspace-first design with shared skills/workflows, project-specific roles
- **Constitution inheritance** — global CLAUDE.md → project CLAUDE.md override chain
- **`/sync` workflow** — cross-role synchronization (strategy↔GM↔roles)
- **`/resume crash`** — context blowout recovery via CRASH_CONTEXT.md
- **`/model`** — AI model preference switching
- **`/role`** — interactive new role creation
- **QA role** — independent verification with veto power (anti-fraud)

---

## [2.0] — 2026-03-11

### Added
- **Role system** — `.muse/` directory with specialized role files (strategy, build, qa, growth, ops, research, fundraise)
- **Trio-status architecture** — STRATEGY_STATUS.md, STATUS.md, MARKETING_STATUS.md
- **`/distill` workflow** — condense memory/ daily logs into MEMORIES.md long-term lessons
- **`/ctx` skill** — context window health check with 🟢🟡🔴 levels
- **Strategic compact** — focus-aware context compaction

---

## [1.0] — 2026-03-03

### Added
- Initial MUSE implementation
- **Constitution** — CLAUDE.md iron rules
- **Memory layer** — memory/YYYY-MM-DD.md short-term + MEMORIES.md long-term
- **`/resume`** — context assembly boot sequence
- **`/bye`** — zero-input session wrap-up
- **Skill-driven execution** — `.agent/skills/` with trigger-based loading
- Inspired by LCM paper and lossless-claw

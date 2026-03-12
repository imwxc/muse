---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always. Upgraded with AC-first workflow, pre-flight fast-fail, and structured Judge verdicts (inspired by opslane/verify).
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

---

## Phase 0: AC-First Workflow (Before Writing Code)

> 💡 Inspired by opslane/verify: "You can't trust what an agent produces unless you told it what 'done' looks like before it started."

**Before writing any code, define Acceptance Criteria:**

```markdown
## Acceptance Criteria

### AC-1: [Feature/behavior name]
- [Observable outcome 1]
- [Observable outcome 2]

### AC-2: [Edge case / error handling]
- [What user sees]
- [What system does]

### AC-3: [Integration / compatibility]
- [Works with X]
- [Doesn't break Y]
```

**AC Writing Rules:**
- Each AC must be **independently verifiable** (pass or fail, no "partially")
- Use **observable behavior** not implementation details ("User sees X" not "Code calls Y")
- Include **negative cases** (what happens when things go wrong)
- For frontend: specify exact text, navigation, visual state
- For backend: specify status codes, response shape, error messages
- For mobile: specify platform behavior, i18n, haptics

**When to write ACs:**
- ✅ Before ANY new feature (even "simple" ones)
- ✅ Before bug fixes (AC = "original symptom no longer occurs" + "no regression")
- ✅ Before refactors (AC = "all existing behavior preserved")
- ❌ NOT needed for: config changes, docs-only, status file updates

---

## Phase 1: Pre-Flight Check (Zero-Cost Fast Fail)

> 💡 Pure checks, no LLM tokens. Fail fast before spending effort.

**Before starting work, verify preconditions:**

```
PRE-FLIGHT CHECKLIST (30 seconds, zero tokens):
□ Dev server running? (or can it start?)
□ Target files exist and are accessible?
□ Dependencies installed? (node_modules, Pods, etc.)
□ Auth/session valid? (Supabase, App Store Connect, etc.)
□ Branch correct? (not accidentally on main when should be feature)
□ Previous build clean? (no leftover errors)
```

**If any pre-flight fails → FIX IT FIRST, don't start the feature.**

This prevents the classic failure: spending 30 minutes coding, then discovering the dev server was down the whole time.

---

## Phase 2: The Gate Function (After Execution)

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

---

## Phase 2.5: Deep QA Loop (Anti-Fraud · Infinite Loop)

> ⚠️ **Lesson learned**: Agent claimed "QA 100% passed" multiple times, but actually only checked whether pages loaded (HTTP 200) and API status codes.
> Frontend worked but core functionality (TTS/payments/WebSocket) was never truly verified. This is not QA — this is **fraud**.

### What Does NOT Count as QA (NEVER claim QA passed using these)

| Shallow Check | Why It Doesn't Count |
|--------------|---------------------|
| Page returns HTTP 200 | Only proves page loads, not that features work |
| API returns correct status code | Only proves route exists, not that business logic is correct |
| `next build` / `expo prebuild` exit 0 | Only proves compilation passes, not runtime behavior |
| Dev server console has no errors | Not triggered ≠ no bugs |
| "Looks like no errors" | Not looking ≠ no errors |
| "Visual check passed" | Didn't look at screenshots, only read code ≠ visual pass |

### What Counts as Deep QA (ALL must be done)

- ✅ **Every user interaction flow** actually walked through (click buttons, submit forms, trigger animations, complete chat round-trips)
- ✅ **Every API call** verified for request body + response content (not just status code — check if returned data is correct)
- ✅ **Every state change** verified for correct UI updates (loading→success→idle, error messages appearing/disappearing)
- ✅ **Every integration point** verified end-to-end (frontend→API→database→response→UI update, full chain)
- ✅ **Error paths** must be tested (no network, no permissions, empty data, invalid input, timeouts)
- ✅ **Auth-required features** tested with real authentication state (cannot skip saying "needs manual testing")
- ✅ **Media features** (TTS/voice/video) must be actually triggered and output confirmed (cannot just check if API responds)

### QA Loop Rules

```
Deep QA → find issues → fix → Deep QA → find issues → fix → Deep QA → ...
→ ALL 100% zero issues → only then can you say "done"
```

- ❌ 1 FAIL → not allowed to say "done"
- ❌ "Needs manual testing" → if automatable then automate, if not then use browser tools/curl to actually test
- ❌ "Not a blocker" → any user-perceivable issue IS a blocker
- **Violating this rule = same severity as "fake functionality" = most critical bug**

---

## Phase 3: Judge Verdict (Structured Judgment)

> 💡 Inspired by opslane/verify's Judge pattern: separate execution from judgment.

**After verification, produce a structured verdict for each AC:**

```markdown
## Verification Report

| AC | Verdict | Evidence |
|----|---------|----------|
| AC-1: Login redirect | ✅ PASS | `curl -s -o /dev/null -w "%{http_code}" → 302` |
| AC-2: Error message | ✅ PASS | Screenshot shows "Invalid email or password" |
| AC-3: Rate limiting | ❌ FAIL | 6th attempt still allowed (expected: blocked) |
| AC-4: i18n | 🟡 NEEDS-REVIEW | Translation exists but quality unverified |

**Overall: 2/4 PASS, 1 FAIL, 1 NEEDS-REVIEW**
**Verdict: NOT READY — AC-3 must be fixed before completion**
```

**Three verdict types:**
- **✅ PASS** — Evidence confirms AC is met
- **❌ FAIL** — Evidence shows AC is NOT met (must fix)
- **🟡 NEEDS-REVIEW** — Cannot be automatically verified (needs human check)

**Rules:**
- NEVER mark PASS without evidence
- FAIL requires specific description of what went wrong
- NEEDS-REVIEW is for visual/UX/copy that can't be command-verified
- **Overall verdict = FAIL if ANY AC is FAIL**

---

## Common Verification Methods

| What to verify | Method | Not sufficient |
|---------------|--------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line AC checklist | Tests passing |
| API endpoint | `curl` with expected status/body | "Code looks right" |
| UI behavior | Browser screenshot/recording | "Component renders" |
| i18n complete | Grep all locale files for key | "Added to en.json" |
| Mobile build | `npx expo prebuild` exit 0 | "No errors in editor" |

## Red Flags — STOP Immediately

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verdict report
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- **ANY wording implying success without having run verification**
- **Skipping AC writing because task "seems simple"**
- **Mentally marking AC as PASS without running the check**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "Too simple for ACs" | Simple tasks have simple ACs — write them anyway |
| "ACs slow me down" | Rework from false completion is slower |
| "Partial check is enough" | Partial proves nothing |

## Quick Reference: Full Workflow

```
┌─────────────────────────────────────────┐
│ 1. DEFINE ACs (before coding)           │
│    What does "done" look like?          │
├─────────────────────────────────────────┤
│ 2. PRE-FLIGHT (before coding)           │
│    Dev server? Files? Deps? Branch?     │
├─────────────────────────────────────────┤
│ 3. EXECUTE (write code)                 │
│    Build the feature / fix the bug      │
├─────────────────────────────────────────┤
│ 4. GATE (after coding)                  │
│    Run verification commands            │
├─────────────────────────────────────────┤
│ 5. JUDGE (before claiming done)         │
│    Produce verdict per AC               │
│    ALL PASS → claim completion          │
│    ANY FAIL → fix and re-verify         │
│    ANY NEEDS-REVIEW → flag for human    │
└─────────────────────────────────────────┘
```

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**The Bottom Line:**

No shortcuts for verification. Define ACs. Run pre-flight. Execute. Verify. Judge. THEN claim the result.

This is non-negotiable.

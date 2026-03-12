---
description: Switch AI model preference. Updates USER.md model settings, affects /ctx context window calculations.
---

## Usage

```
/model [model-name]
```

## Steps

1. **Read** current `USER.md` model preference
2. **Update** `USER.md` with the new model:
   ```markdown
   ## AI Model
   - **Preferred Model**: [new model name]
   - **Context Window**: [model's context limit]
   ```
3. **Confirm** the change:
   ```
   ✅ Model updated: [old] → [new]
   Context window: [old size] → [new size]
   This affects /ctx calculations.
   ```

## Supported Models (examples)

| Model | Context Window |
|-------|:--------------:|
| Claude Opus 4 | 200K tokens |
| Claude Sonnet 4 | 200K tokens |
| GPT-4o | 128K tokens |
| Gemini 2.5 Pro | 1M tokens |

> The model list is not exhaustive. Users can specify any model name and context window size.

## Notes

- Model preference is stored in `USER.md` (private, not committed)
- `/ctx` uses this setting to calculate context usage percentage
- Changing models mid-conversation doesn't change the current session's model — it sets the preference for future sessions

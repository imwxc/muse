---
description: 从 memory/ 日志和 STATUS 文件中蒸馏关键教训到 MEMORIES.md（MUSE condensation 操作）
---

> **MUSE 架构定位**: `/distill` = condensation 操作（≈ LCM DAG 的向上压缩）
> - `memory/` 日文件 = 叶节点（原始每日记录）
> - `MEMORIES.md` = condensed 节点（跨天蒸馏的模式和教训）
> - 蒸馏时**保留**: 决策依据 + 教训 + 模式识别 + 反复出现的问题
> - 蒸馏时**丢弃**: 具体操作步骤 + 临时 debug 细节 + 一次性事件

## 触发时机

### 自动提醒（`/bye` 内置检测）
每次 `/bye` 时自动扫描 `memory/`，满足以下任一条件时提醒：
- memory/ 有 **≥ 7 天**的未蒸馏日志
- 距上次 distill 已 **≥ 5 个日志文件**
- memory/ 总文件数 **≥ 15** 且从未 distill 过

### 手动触发
- 用户说 "蒸馏记忆" / "整理教训" / "distill" / `/distill`
- 每个 milestone 完成后（版本发布、重大功能上线）
- Strategy 对话中复盘时

### 范围控制

| 指令 | 范围 | 说明 |
|------|:----:|------|
| `/distill` | 🌍 全局 | 读**所有**项目 memory/ → 写全局 MEMORIES.md |
| `/distill dya` | 📁 DYA | 只读 DYA memory/ → 写全局 MEMORIES.md |
| `/distill prometheus` | 📁 Prometheus | 只读 Prometheus memory/ → 写全局 MEMORIES.md |

> 教训跨项目通用，**始终写入全局 MEMORIES.md**（不按项目拆分）。

## 执行步骤

1. **读取 memory/ 目录**
   - 扫描 `memory/*.md`，按日期排序
   - 重点看最近 7 天的文件

2. **提取值得长期保留的内容**
   - ✅ 犯过的错误和根因（防止重蹈覆辙）
   - ✅ 有效的工作模式（值得复用的方法）
   - ✅ 关键决策及其理由（为什么选 A 不选 B）
   - ✅ 用户偏好的新发现（更新 USER.md）
   - ❌ 不保留：具体代码细节、临时调试过程、已解决的 bug 细节

   > 🆕 **v2.32.0 — Temporal Classification**: 提取时按时效分类。

   **时效标签处理规则**:
   | memory/ 条目标签 | Distill 行为 |
   |-----------------|-------------|
   | `[PERMANENT]` | ✅ 始终提取，写入 MEMORIES.md 时默认 `[PERMANENT]` |
   | `[TEMPORAL:past-date]` | ❌ 已过期，跳过不提取 |
   | `[TEMPORAL:future-date]` | 🟡 提取但保留 `[TEMPORAL:date]` 标签 |
   | `[EPISODIC]` | ⚠️ \>30 天标记衰减审查；\<30 天且有模式价值 → 提取升级为 `[PERMANENT]` |
   | 无标签（旧格式） | 按内容判断，等同 `[EPISODIC]` 处理 |

   **MEMORIES.md 条目默认时效**:
   - `[FACT]` → `[PERMANENT]`
   - `[LESSON]` → `[PERMANENT]`
   - `[DECISION]` → `[PERMANENT]`（版本特定决策可标 `[TEMPORAL:下个大版本日期]`）

3. **更新 MEMORIES.md（图关系感知）**

   > 🆕 **v2.32.0 — Graph Memory Relations**: 写入前必须对比现有条目，检测关系。

   **Step 3a. 关系检测（每条候选条目必须执行）**

   对每条待写入的候选条目，逐一对比 MEMORIES.md 中**所有现有条目**，判断关系类型：

   | 关系 | 含义 | 判断规则 | 操作 |
   |------|------|---------|------|
   | `UPDATES` | 新事实推翻/替代旧事实 | 同一主题的 `[FACT]`，结论不同 | 旧条目 `~~删除线~~` + `(historical: superseded by [TAG] YYYY-MM-DD)` |
   | `EXTENDS` | 新信息补充现有条目 | 同一主题，增加细节/数据 | 在现有条目下追加 `↳ EXTENDS:` 子弹点 |
   | `DERIVES` | 从已有数据推导出新洞察 | 结论基于已有条目 | 新条目添加 `(derived from: [EXISTING_TAG])` |
   | `NEW` | 与现有条目无关 | 以上皆不适用 | 按主题分类正常追加 |

   **关系检测提示（Agent 逐条自问）**：
   ```
   对候选条目 X:
   1. MEMORIES.md 中有没有同一主题的 [FACT]？结论是否不同？→ UPDATES
   2. 是否为现有条目增加了具体细节/数据/案例？→ EXTENDS
   3. 是否从现有已知事实推导出的新结论？→ DERIVES
   4. 以上皆否？→ NEW
   ```

   **Step 3b. 执行写入**

   - 按主题分类追加（不是按日期）
   - 去重：如果已有类似教训，合并而非重复（优先用 EXTENDS）
   - **UPDATES 操作**: 旧条目加 `~~删除线~~`，**不删除**（保留历史链）
   - **清理阈值**: 当 `~~删除线~~` 条目累积超过 **20 条**时，提醒用户执行归档清理

   **Step 3c. 删除过时项**
   - 如果某个教训不再适用，标记 `~~删除线~~` + `(historical: obsolete YYYY-MM-DD)`

   **🚨 Strikethrough 规则**:
   - ✅ `[FACT]` 可被 UPDATES（事实会过时）
   - ✅ `[DECISION]` 可被 UPDATES（决策会被推翻）
   - ⚠️ `[LESSON]` 一般不 UPDATES（教训是永恒的），如确实过时则标 `(superseded)` 但保留原文
   - 格式: `~~**[FACT] 旧内容**~~ (historical: superseded by [FACT] 新主题 YYYY-MM-DD)`

4. **考虑是否升级 Skill 或宪法**
   - 如果某个教训反复出现 → 应该写入 CLAUDE.md 宪法
   - 如果某个方法论足够通用 → 应该写成 Skill
   - "记住 X" 级别的 → MEMORIES.md 就够了

5. **清理旧 memory/**
   - 超过 30 天的 memory/ 文件可以归档到 `memory/archive/`
   - 不要删除，可能偶尔需要回查

## 输出格式

```markdown
## 蒸馏报告 YYYY-MM-DD

### 新增到 MEMORIES.md
- [教训描述] （来源: memory/2026-03-XX.md）

### 升级建议
- 建议将 [X] 写入 CLAUDE.md 宪法（原因: 已出现 3 次）
- 建议将 [Y] 写成新 Skill（原因: 足够通用）

### 已归档
- memory/2026-02-XX.md → memory/archive/
```

---
description: MUSE 角色文件之间的指令传递和数据回传
---

## 统一语法

```
/sync [项目] [角色] [方向]
```

**方向**：`up`（回传给 strategy）/ `down`（从 strategy 下发）/ `to [目标]`（横向）

### 速查表

| 指令 | 含义 |
|------|------|
| `/sync myapp gm up` | myapp GM 汇总回传 → strategy |
| `/sync myapp gm down` | strategy 指令 → myapp GM |
| `/sync myapp build up` | myapp build 进度 → GM (或 strategy) |
| `/sync myapp growth up` | myapp growth 数据 → GM (或 strategy) |
| `/sync myapp build down` | GM/strategy 指令 → myapp build |
| `/sync myapp growth down` | GM/strategy 指令 → myapp growth |
| `/sync myapp build to growth` | myapp build → myapp growth（横向） |
| `/sync myapp qa broadcast` | myapp QA → myapp build + GM（广播） |

### 批量同步

| 指令 | 含义 |
|------|------|
| `/sync myapp down` | GM/strategy 指令 → myapp **所有角色** |
| `/sync all down` | strategy 指令 → **所有 GM → 所有角色** |
| `/sync all up` | **所有 GM** 汇总回传 → strategy |
| `/sync all` | 全量双向同步 |

### 省略规则

在当前 workspace 的默认项目下，项目名可省略：
- `/sync build up` = `/sync [默认项目] build up`
- `/sync growth down` = `/sync [默认项目] growth down`

`strategy` 永远是全局的，不需要项目前缀。

---

## 执行细节

### 1. Strategy → GM（down）— v2.0 首选路径

```
/sync myapp gm down
```

我会：
1. 读取 `.muse/strategy.md` 的「📡 战略指令队列」
2. 找出所有标有 `→[PROJECT]/GM` 的未传递指令
3. 写入 `[project]/.muse/gm.md` 的「📡 指令接收队列」
4. GM 接收后自行拆解分发到项目内角色
5. 回到 strategy.md 标记「✅ 已传递」

ℹ️ **v2.0 变化**: Strategy 不再直接写入 build/growth。指令发到 GM，GM 内部拆解。

### 1b. Strategy → 角色（down）— 向后兼容

```
/sync myapp build down
```

当 GM 角色未启用时，或紧急情况下，仍可直接同步到角色：
1. 读取 `.muse/strategy.md` 的「📡 战略指令队列」
2. 找出所有标有 `→[PROJECT]/BUILD` 的未传递指令
3. 写入 `[project]/.muse/build.md` 的「📡 接收战略指令」
4. 回到 strategy.md 标记「✅ 已传递」

### 2. GM → Strategy（up）— v2.0 首选路径

```
/sync myapp gm up
```

我会：
1. 读取 `[project]/.muse/gm.md` 的 GM 视角项目状态汇总
2. 用「📡 数据回传 @STRATEGY ([PROJECT]/GM)」格式写入 `.muse/strategy.md`
3. 在 gm.md 标记已回传

### 2b. 角色 → Strategy（up）— 向后兼容

```
/sync myapp build up
```

当 GM 角色未启用时，角色可直接回传 strategy：
1. 读取 `[project]/.muse/build.md` 中需要回传的进度/数据/请求
2. 用「📡 数据回传 @STRATEGY ([PROJECT]/BUILD)」格式写入 `.muse/strategy.md`
3. 在 build.md 标记已回传

### 3. 横向同步（to）

```
/sync myapp build to growth
```

当 BUILD 和 GROWTH 之间需要互相同步信息时：
1. 读取源文件中需要传递给对方的信息
2. 用「📡 BUILD→GROWTH 通知」格式写入目标 growth.md
3. 同时将关键信息同步到 strategy.md（保持全局视角）

### 4. QA 广播（broadcast）

```
/sync myapp qa broadcast
```

QA 验证完成后，将 QA Report 同时写入多个角色文件：
1. 读取 `.muse/qa.md` 最新的 QA Report
2. 用「📡 QA→BUILD」格式写入 build.md（❌ FAIL 时 build 必须先修复）
3. 用「📡 QA→STRATEGY」格式写入 strategy.md
4. 如果影响 growth → 也写入 growth.md

### 5. 接收（receive）

```
/sync receive
```

根据当前对话类型自动判断：
- **在 STRATEGY 对话中**：检查所有项目回传的数据
- **在 BUILD 对话中**：检查 strategy 下发的新指令 + QA 的 FAIL 报告
- **在 GROWTH 对话中**：检查 strategy 下发的新指令 + build 的横向通知

---

### 5. 指令格式

Strategy 指令中标注目标项目和 GM：
```
📡 S025→MYAPP/GM: V1.2.0 加入健康证明功能
📡 S025→APPB/GM: SDK v0.3.0 加入语音合成
📡 S025→ALL: 所有项目暂停新功能，集中修 Bug
```

向后兼容（无 GM 时仍可直接指定角色）：
```
📡 S025→MYAPP/BUILD: V1.2.0 加入健康证明功能
📡 S025→MYAPP/GROWTH: 等 V1.2.0 上线后开始新一轮推广
```

GM 回传格式：
```
📡 数据回传 @STRATEGY (MYAPP/GM 3/12 13:07):
> V1.1.1 Build 30 重新提审中。D7 窗口明天截止。
> EP.03 分镜 16/20 完成。
> Deck 已定稿，陆续发投资人。
```

角色回传格式（向后兼容）：
```
📡 数据回传 @STRATEGY (MYAPP/BUILD 3/12 11:44):
  ✅ V1.1.1 Build 31 已提交审核
```

---

## 多项目场景完整用例

假设你有 3 个项目（AppA、AppB、AppC）：

**Strategy 做了跨项目决策**：
```
你: /resume strategy
（做出决策 S030→APPA/BUILD + S030→APPB/GROWTH + S030→APPC/BUILD）
你: /sync all down
→ Agent 自动分发到 3 个项目的对应角色文件
```

**AppA build 完成开发，要通知 strategy + growth**：
```
你: /resume appa build
（完成开发）
你: /sync appa build up          ← 进度回传 strategy
你: /sync appa build to growth   ← 通知 growth 可以开始推广
```

**AppB QA 发现 bug**：
```
你: /resume appb qa
（验证发现 bug）
你: /sync appb qa broadcast  ← 广播到 appb build + strategy
```

**新对话想看全局状态**：
```
你: /resume strategy
你: /sync all up    ← 拉取所有项目最新进度
```

---

## 注意事项

- **第零铁律仍然有效**：sync 是跨文件操作的唯一合法例外，但只做指令传递/数据回传，不做内容讨论
- 传递完成后，当前对话继续聚焦原文件的内容
- 如果没有新指令/回传，会告知「无新内容需要同步」
- 横向同步必须同时通知 STRATEGY（或 GM），保持全局视角
- **所有跨项目同步都在 strategy 对话中执行**（strategy 是全局中枢）
- **省略规则**：当前 workspace 默认项目可省略项目名
- **GM 优先**: 有 GM 时，优先通过 GM 中转；无 GM 时回退到直接同步

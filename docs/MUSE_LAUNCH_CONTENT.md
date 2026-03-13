# MUSE Launch Content (v6)

> S027 · 2026-03-13 · 配图: banner.png + demo.gif + before-after.png
> 锚点: 36天 App + 4天 SDK + 1天 MUSE
> ⚠️ 不提 Avatar / 不提定价 / 不提融资
> ⚠️ Prometheus 只说"开源 SDK / AI Agent 生态"
> 📊 v6 更新: +竞品对标 / +install.sh 卖点 / 4→6 工具 / +配图指令

## 📅 时间线

| 时间 | 平台 | 账号 |
|:----:|------|------|
| 11:30-12:30 | 朋友圈 + 微信群 | 个人 |
| 20:00 | 小红书 | 个人 |
| 21:00 | Threads + Facebook | 个人 |
| 22:00 | X Thread | @MythsLabs |
| 22:05 | X Quote RT | @SunshiningDay |
| 22:15 | LinkedIn x2 | 公司 + 个人 |

---

## 1️⃣ @MythsLabs X Thread (EN)

> 配图: Tweet 1 带 banner.png · Tweet 4 带 demo.gif · Tweet 9 带 before-after.png

**Tweet 1**

🎭 Introducing MUSE: a pure-Markdown "operating system" for AI pair programming.
No databases. No dependencies. Just .md files that give your AI perfect memory across conversations.

Open source, MIT licensed.
🔗 github.com/myths-labs/muse 🧵

**Tweet 2**

Every AI coder hits the same wall.

Long conversations? AI forgets early context.
New conversation? Start from scratch.
End of day? Progress vanishes.

The tools are powerful. But the memory is disposable.

**Tweet 3**

MUSE wraps your AI with a document protocol:
📜 Constitution: iron rules that survive every turn
🧠 Memory layers: daily logs + distilled long-term lessons
⚡ 54 skills: reusable SOPs loaded on demand
🔧 6 tools: one-command install for Claude Code, Cursor, Windsurf & more
🔄 Workflows: `/resume` to restore, `/bye` to save

**Tweet 4**

A typical day:

```
/resume build
→ reads constitution → memory → role state → starts
...hours of coding...
/bye
→ auto-saves → syncs files → writes memory
```

Next day, new conversation. Picks up exactly where it left off.

**Tweet 5 (NEW — Competitive)**

"But there are other AI coding tools..."

Prompt libraries (35K+ ⭐) give you great starting prompts.
Orchestration servers (20K+ ⭐) give you powerful pipelines.

MUSE gives you something different: memory that persists across conversations.
Your AI gets smarter over time. Not just better prompts — actual learning.

**Tweet 6 (was 5)**

Our founder @SunshiningDay built:
→ An iOS app in 36 days
→ An open-source SDK in 4 days
→ MUSE itself in 1 day

All running in parallel. Zero context loss.
MUSE was born from this workflow, then open-sourced.

**Tweet 7 (was 6)**

MUSE didn't come from nowhere.
It stands on the shoulders of the LCM paper, lossless-claw, and lessons from dozens of open source projects.

We've benefited enormously from open source. Now we're giving back.

**Tweet 8 (was 7)**

No runtime. No plugins. Just Markdown.
One command to install on your tool of choice:

```
./scripts/install.sh --tool cursor
./scripts/install.sh --tool windsurf
```

Works with Claude Code, OpenClaw, Cursor, Windsurf, Gemini CLI, Codex CLI — or any AI tool with system prompts.

`git clone` and you're set in 5 minutes.

**Tweet 9 (was 8)**

MUSE is half the picture.
We have another open source project launching in the next few days, in the AI Agent and OpenClaw ecosystem.

If you're into AI agents or OpenClaw, follow @MythsLabs. More to share soon.

**Tweet 10 (was 9)**

⭐ github.com/myths-labs/muse
📖 Full docs in the README
🤝 MIT licensed, contributions welcome

Built by @SunshiningDay

---

## 2️⃣ @SunshiningDay Quote RT

> 引用转推 Tweet 1 · 无需额外配图

36 days to build an iOS app.
4 days to build an open-source SDK.
1 day to package MUSE itself.
Three products, one person, zero context lost.

Fun fact: MUSE stands for Memory-Unified Skills & Execution. In Greek mythology, the nine Muses were daughters of Mnemosyne, the Titaness of Memory. A system born from memory, named after the children of memory. Felt right.

I didn't plan to open-source this. It started as my internal workflow for managing everything with AI without going insane. Then I realized every AI coder fights the same memory problem. So I cleaned it up and shipped it.

MUSE is built on a lot of things I learned from the open source community. LCM paper, lossless-claw, countless other projects. This is my way of giving back.

If you use Claude Code, Cursor, Windsurf, Gemini CLI, or any AI coding tool — take a look. Might save you some headaches.

---

## 3️⃣ Myths Labs LinkedIn

> 配图: banner.png + before-after.png · 不用 "I"

We just open-sourced MUSE 🎭
MUSE (Memory-Unified Skills & Execution) is a pure-Markdown operating system for AI pair programming.

**The problem**
AI coding assistants are powerful, but they forget. Long conversations lose early context. New conversations start from zero. Progress disappears between sessions. Every developer using AI has felt this.

**The solution**
MUSE wraps your AI with a structured document protocol. Constitutions for behavior rules. Memory layers for persistence. 54 reusable skills. Workflow commands for seamless context handoff.
No databases. No dependencies. Just .md files.
Works with Claude Code, OpenClaw, Cursor, Windsurf, Gemini CLI, Codex CLI — or any AI tool with system prompt support.
One command: `./scripts/install.sh --tool cursor`

**Why open source**
MUSE was built on ideas from the LCM paper, lossless-claw, and many other open source projects. We've learned a lot from this community. Now we're giving back.

→ github.com/myths-labs/muse
MIT licensed. Contributions welcome.

#OpenSource #AIProgramming #DeveloperTools #AI

---

## 4️⃣ Personal LinkedIn

> 配图: banner.png + demo.gif

I'm a solo founder running 3 products at the same time.
36 days to build an iOS app from zero to App Store.
4 days to build another open-source SDK from scratch.
1 day to package MUSE, the system that made the other two possible.

The biggest bottleneck was never coding. It was context.
Every time I opened a new AI conversation, I had to re-explain what I was building, what decisions I'd made, what bugs I'd fixed. Multiply that by 10+ conversations a day across 3 projects.

So I built an internal system. Constitutions for AI behavior, memory files for persistence, skill libraries for reusable workflows, commands to save and restore everything. That system became MUSE.

Today I'm open-sourcing it. Not because it's a business. Because the open source community gave me so much. The LCM paper taught me context management, lossless-claw showed me what's possible. Dozens of other projects shaped how I think about AI tooling. This is me giving back.

If you use Claude Code, Cursor, Windsurf, or any AI coding assistant:
→ github.com/myths-labs/muse

We also have another open source project coming in the next few days. If AI agents and OpenClaw interest you, follow Myths Labs.

#SoloFounder #OpenSource #BuildInPublic #AICoding

---

## 5️⃣ 小红书 (CN) — v2 改版

> ⚠️ v1 被限流（0 浏览）· 根因：自推广模式被算法压制
> v2 策略：故事续集（延续「砸电脑」IP）+ 零外链 + 评论区放链接
> 配图: ① banner.png ② before-after.png ③ 终端 demo 截图（裁掉平台 UI） ④ 架构流程图

**标题**: 上次被AI气到想砸电脑，后来我治好了它

**正文**:

上次发了篇「被AI气到想砸电脑」，好多人私信问后来怎么样了。

说实话，问题没那么好解。

核心症结就一个：AI 没有记忆。
每次开新对话，它就把你之前说的全忘了。
你说「继续昨天的bug」，它说「什么bug？我们好像是第一次见面」。
一天开十几个对话，3个项目来回切，每次都重新自我介绍一遍，谁不崩溃？

试了很多方案：
❌ 把所有东西塞进一个超长对话 — 越长它越忘前面的
❌ 手动复制粘贴上下文 — 每次5分钟，一天浪费1小时
❌ 用数据库记录 — 太重了，还要维护

后来想明白了：AI 的上下文本来就是文本，那记忆也应该用最简单的文本格式来管。

所以做了套 Markdown 文件协议：
📜 宪法文件 — AI 每次都先读的铁规矩
🧠 记忆层 — 每天自动存档，下次自动读取
⚡ 技能包 — 54个可复用的操作流程
🔄 一个命令恢复上下文，一个命令保存进度

现在的工作流：
早上打开新对话，打一个命令，5秒钟 AI 就知道昨天干了什么、哪些bug没修完、接下来该做什么。

用这套东西同时管了3个产品，36天出了个App、4天出了个SDK，没炸过一次。

整理成开源项目了，MIT协议，纯 Markdown 零依赖。
支持龙虾、Claude Code、Cursor、Windsurf 这些主流工具。

评论区放链接，感兴趣的自取～

对了过几天还有个 AI Agent 生态的开源项目要上线，到时再分享。

#AI编程 #vibecoding #开源 #独立开发者 #个人开发者 #效率

**评论区置顶**: GitHub 搜 myths-labs/muse ⭐️ MIT 开源

---

## 6️⃣ Threads (EN)

> 配图: banner.png

36 days to build an iOS app.
4 days to build an open-source SDK.
1 day to package the system that made both possible.
I open-sourced it today.

MUSE is a pure-Markdown "OS" for AI pair programming. It gives your AI structured memory so you never lose context between conversations.

54 skills. Zero dependencies. Works with Claude Code, Cursor, Windsurf, OpenClaw, Gemini CLI, Codex CLI.
Built on ideas from the open source community. Giving it back.

github.com/myths-labs/muse

---

## 7️⃣ 微信朋友圈

> 配图: ① banner ② before-after.png ③ demo-preview.png ④ 微信群二维码

一个人做3个产品，36天App + 4天SDK + 1天MUSE。
最大瓶颈不是写代码，是AI换个对话就全忘了。

做了套让AI自己管记忆的系统，开源了🎭
支持龙虾/Claude Code/Cursor/Windsurf/Gemini CLI/Codex CLI
github.com/myths-labs/muse ⭐️

也在用AI写代码的朋友，扫最后一张加群交流～

---

## 8️⃣ Facebook

> 配图: banner.png

分享个开源项目🎭 一个人做3个产品，最痛苦的不是写代码，是每次开新AI对话都重新解释一遍在干嘛。

做了套系统让AI自己管记忆，从开源社区学了很多，回馈一下。
MUSE，纯Markdown，零依赖。支持龙虾/Claude Code/Cursor/Windsurf/Gemini CLI/Codex CLI。
github.com/myths-labs/muse

过几天还有个AI Agent方向的开源项目👀

---

## 9️⃣ 微信群（按群类型分）

### A. 开发者/AI 群（通用极简版）

做了个开源项目分享一下～MUSE，AI编程记忆系统，解决换对话AI就失忆的问题。支持龙虾/Claude Code/Cursor/Windsurf/Gemini CLI。github.com/myths-labs/muse ⭐️

### B. 个人大群（460人，投资人+创始人混合）

小更新～最近一个人做3个产品（36天App/4天SDK/1天开源框架），第三个今天开源了。github.com/myths-labs/muse 过几天还有个AI Agent方向的也要开源，到时再汇报😄

### C. CDDJAP 加速器群

分享个side project～做了个AI编程记忆工具MUSE，今天开源了。github.com/myths-labs/muse ⭐️

### D. 万物岛/ThreeDAO 校友群

校友们好～做了个AI编程记忆系统开源了 github.com/myths-labs/muse 另外过几天有个OpenClaw/AI Agent生态的开源项目也要上线，感兴趣先关注Myths Labs👀

### E. 高质量AI群（⚠️ 先私聊群主）

**私聊群主：**
X哥/X姐 打扰一下～我最近做了个AI编程相关的开源项目，想在群里分享一下方便吗？不是广告，纯开源MIT的，就是帮AI编程管上下文记忆的工具。不方便完全理解🙏

**获许可后发：**
分享个开源项目～MUSE，AI编程记忆系统，让AI跨对话不丢上下文。支持龙虾/Claude Code/Cursor/Windsurf/Gemini CLI。github.com/myths-labs/muse ⭐️

---

## 🔟 微信群运营（🦞 龙虾写代码）

> 群名推荐：**🦞 龙虾写代码**
> 备选：缪斯🦞龙虾编程局 / 🦞 AI 编程龙虾堂 / 🦞 AI 码农龙虾塘

### 📌 群公告（置顶）

```
🦞 龙虾写代码 · AI 编程交流群

🎯 这里聊什么：
• AI 编程工具使用（龙虾/Claude Code/Cursor/Windsurf…）
• Prompt 技巧 & 上下文管理
• 独立开发 / Side Project 交流
• 开源项目分享

📦 群主开源项目：
• MUSE — AI 编程记忆系统 github.com/myths-labs/muse
• Prometheus — AI Agent 开源 SDK（即将上线）

⛔ 不欢迎：
• 广告/拉群/二维码（秒踢）
• 伸手党（先搜再问）

💬 鼓励：提问、分享、吐槽、截图你和 AI 的沙雕对话
```

### 👋 欢迎词（按阶段）

#### 阶段 1：冷启动（0→50人）

> 感觉像私人局，逐个 @，让新人开口 = 留存

```
欢迎 @新人！👋 你平时用什么 AI 编程工具？
（群里龙虾/Claude Code/Cursor 用户都有，随便聊~）
```

#### 阶段 2：增长期（50→200人）

> 人多了给结构感，引导行为

```
欢迎新朋友！🦞

三件事快速融入：
1️⃣ 看群公告了解玩法
2️⃣ 说说你用什么工具写代码
3️⃣ 有好东西随时分享，群里都是实战派

群主开源项目 → github.com/myths-labs/muse ⭐️
```

#### 阶段 3：规模期（200+人）

> 效率优先，减少噪音

```
欢迎！🦞 请先看群公告。
有问题直接问，不用"有人在吗"。
分享 > 提问 > 潜水，都欢迎。
```

### 📊 社群运营策略

| 策略 | 说明 |
|------|------|
| **前 50 人手动 @欢迎** | 逐个回复，创造"被重视"感，这些人会成核心活跃用户 |
| **50+ 后切模板** | 人多了手动不现实，用阶段 2 模板 |
| **每周丢话题** | "你们这周用 AI 写了啥？" 保活跃度 |
| **收集群精华截图** | AI 沙雕对话截图 = 小红书/X 内容素材（反哺增长飞轮） |
| **200 人后考虑分群** | 按工具（龙虾群/Cursor群）或按水平（新手/进阶） |
| **群内自然引流 Prometheus** | "过几天还有个 AI Agent 的开源项目上线" — 不硬推 |

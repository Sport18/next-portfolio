# next-portfolio 技术大纲

> 个人作品集网站的技术选型与开发规划。配合 OpenSpec + Superspec + Superpowers 使用。

## 1. 项目定位

- **类型**：个人网站（作品集 → 工具集 → 记录本 → 实验场）
- **目标**：展示个人信息与项目；后续扩展私人工具、记录与各类原型实验
- **阶段**：MVP 以静态展示为主；持久化与 `/edit` 等能力作为后期独立变更（change）

---

## 2. 开发方法论

| 工具 | 职责 | 常用命令 |
|------|------|----------|
| **OpenSpec** | 管理需求与规格（做什么） | `/opsx:new`、`/opsx:continue`、`/opsx:archive` |
| **Superspec** | 串联 OpenSpec 与 Superpowers 的工作流 schema | 默认 schema，见 `openspec/config.yaml` |
| **Superpowers** | 设计、计划、TDD、子 agent 执行（怎么做） | Cursor 插件：`/add-plugin superpowers` |

### 推荐工作流

**逐步审查（非简单功能）：**

```text
/opsx:new <变更名称>
/opsx:continue    # 头脑风暴 → 提案 → 规格 → 任务 → 计划
/opsx:apply       # TDD 实现
/opsx:verify      # 对照规格验收
/opsx:continue    # 收尾（finalize）
/opsx:archive     # 合并增量规格到主规格库
```

**快速通道（小改动）：**

```text
/opsx:ff <变更名称>
/opsx:apply
/opsx:verify
/opsx:archive
```

**探索阶段（还不确定做什么）：**

```text
/opsx:explore
/opsx:propose "你的想法"
```

---

## 3. 应用技术栈

### 3.1 核心框架（已集成）

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.x | App Router、SSR/SSG、Metadata SEO |
| React | 19.x | UI 组件 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式、响应式、暗色模式基础 |
| @tanstack/react-query | 5.x | 客户端数据请求、缓存与状态管理 |

> **注意**：Next.js 16 的 API 与常见文档有差异，写代码前请查阅 `node_modules/next/dist/docs/`。

#### 数据请求约定

- 根布局挂载 `QueryProvider`，内部使用 `QueryClient` + `QueryClientProvider`（见 `src/components/providers/query-provider.tsx`）。
- Client Component 中通过 `useQuery` / `useMutation` 请求与管理异步数据；避免 `useEffect` + `fetch` + `useState` 的 ad-hoc 模式。
- Server Component 仍可直接读取本地内容或调用服务端 API；需要客户端缓存、重试、失效刷新时再下沉到 React Query。

### 3.2 后端平台（已定选型）

| 技术 | 用途 |
|------|------|
| **Supabase** | BaaS 平台：PostgreSQL、Auth、Storage、RLS |
| **PostgreSQL** | 关系型主库（Supabase 托管） |

> 接入时机：首个需要登录、跨设备同步或频繁写入的功能（如 `/edit`、笔记、工具配置）再初始化 Supabase 项目；此前继续 JSON 文件即可。

#### 后端约定

- **数据访问**：Next.js Route Handler / Server Action 读写数据库；Client Component 通过 React Query 调用 API，不在浏览器持有 service role key。
- **鉴权**：Supabase Auth（邮箱或 OAuth）；私人路由与 mutation 须校验 session。
- **权限**：公开内容可读；用户私有数据（笔记、草稿、工具配置等）在 PostgreSQL 层启用 RLS，按 `auth.uid()` 限制读写。
- **Schema 组织**：按业务域分表（如 `profiles`、`projects`、`notes`、`tools`）；实验性数据可用 JSONB 字段，验证后再规范化。
- **环境变量**：
  - `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` — 客户端与服务端均可使用
  - `SUPABASE_SERVICE_ROLE_KEY` — 仅服务端、绕过 RLS 的运维场景；**不得提交仓库**

#### 目标目录（接入 Supabase 后）

```text
src/lib/supabase/     # 浏览器 / 服务端 Supabase 客户端
src/lib/db/           # Drizzle schema、迁移与查询（计划引入）
supabase/             # 本地迁移与 RLS 策略（可选）
```

### 3.3 计划引入（按优先级）

| 技术 | 阶段 | 用途 |
|------|------|------|
| **Zod** | P1 | 内容 JSON 结构校验 |
| **next-themes** | P1 | 暗色/亮色主题切换 |
| **lucide-react** | P1 | 图标 |
| **clsx + tailwind-merge** | P1 | 条件 className 合并 |
| **Vitest** | P1 | 单元/组件测试（配合 Superpowers TDD） |
| **@testing-library/react** | P1 | React 组件测试 |
| **Supabase JS + SSR 客户端** | P2 | Auth、DB、Storage 接入 |
| **Drizzle ORM** | P2 | PostgreSQL schema 与类型安全查询 |
| **framer-motion** | P2 | 页面动效（可选） |
| **Playwright** | P2 | 端到端测试（可选） |

### 3.4 内容管理策略

| 阶段 | 方案 | 说明 |
|------|------|------|
| **第一阶段** | `src/content/*.json` | 个人信息、项目、技能 |
| **第二阶段** | MDX（可选） | 博客或长文 |
| **第三阶段** | Supabase + `/edit` | 浏览器内编辑与私人记录，Supabase Auth + PostgreSQL |

---

## 4. 目录结构（目标）

```
next-portfolio/
├── docs/
│   └── TECH-OUTLINE.md          # 本文件
├── openspec/
│   ├── config.yaml              # schema: superspec
│   ├── specs/                   # 主规格库（归档后沉淀）
│   └── changes/                 # 进行中的变更
├── .cursor/
│   ├── commands/                # /opsx:* 斜杠命令
│   └── skills/                  # OpenSpec 技能
├── src/
│   ├── app/
│   │   ├── page.tsx             # 首页
│   │   ├── layout.tsx
│   │   ├── about/               # 关于我
│   │   ├── projects/[slug]/   # 项目详情
│   │   ├── tools/               # 工具集（后期）
│   │   ├── lab/                 # 实验原型（后期）
│   │   └── edit/                # 编辑页（已有占位）
│   ├── components/
│   │   ├── layout/              # 页头、页脚、导航
│   │   ├── providers/           # QueryProvider 等全局 Provider
│   │   ├── sections/            # Hero、项目、关于等区块
│   │   └── ui/                  # 按钮、卡片、徽章等
│   ├── content/                 # JSON 内容文件（MVP）
│   └── lib/
│       ├── supabase/            # Supabase 客户端（P2 接入）
│       └── db/                  # Drizzle schema / 查询（P2 接入）
├── supabase/                    # 迁移与 RLS（P2 接入，可选）
└── public/
```

---

## 5. 主规格能力域（Foundation 阶段定义）

| 规格域 | 覆盖内容 |
|--------|----------|
| `site` | 路由、布局、SEO、主题 |
| `content` | 个人信息 / 项目 / 技能 数据模型 |
| `presentation` | 组件规范、响应式断点、动效策略 |
| `editing` | `/edit` 行为（第三阶段，先占位） |
| `backend` | Supabase Auth、PostgreSQL 数据模型、RLS（P2 起） |

---

## 6. 功能路线图（OpenSpec 变更）

| 优先级 | 变更名称 | 范围 |
|--------|----------|------|
| P0 | `portfolio-foundation` | 全局规格 + 设计系统决策 |
| P0 | `home-hero` | 首页 Hero + 导航，替换默认模板 |
| P1 | `projects-showcase` | 项目卡片、详情页、标签 |
| P1 | `about-section` | 关于我、技能展示 |
| P1 | `contact-links` | 社交链接 / 联系方式 |
| P2 | `content-data-layer` | JSON 数据层 + Zod 校验 |
| P2 | `supabase-foundation` | Supabase 客户端、首表 schema、Auth 与 RLS 基线 |
| P2 | `edit-page` | 实现 `/edit` 真实逻辑（依赖 supabase-foundation） |
| P3 | `seo-analytics` | sitemap、metadata 完善 |
| P3 | `i18n` | 多语言（若需要） |

---

## 7. 部署与工具链

| 工具 | 用途 |
|------|------|
| **Git** | 版本控制 |
| **pnpm** | 包管理（`pnpm install` / `pnpm dev`） |
| **ESLint** | 代码规范（已配置） |
| **Vercel** | 前端生产部署（推荐） |
| **Supabase** | PostgreSQL、Auth、Storage 托管 |
| **OpenSpec CLI** | `openspec validate`、`openspec schemas` |
| **Commitlint + Husky** | 校验 Git 提交信息格式 |

---

## 8. Git 提交规范

每次提交使用 Conventional Commits 格式：

```text
<type>(<scope>): <subject>
```

**示例：**

```text
feat(base0703): 添加首页 Hero 区块
fix(base0703): 修复导航链接样式
docs(base0703): 初始化 OpenSpec 与项目文档
```

| 字段 | 说明 |
|------|------|
| `type` | `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert` |
| `scope` | 迭代或模块标识（小写必填），当前迭代示例：`base0703` |
| `subject` | 简短中文说明，句末不加句号 |

提交时会由 Husky + Commitlint 自动校验；格式不对会拒绝提交。

### AI 提交审核流程（强制）

Agent 代为用户执行 `git commit` 时，必须遵守：

1. **当次展示**：在准备提交的那一轮回复中，列出完整 commit message 与变更摘要，并明确请用户审核。
2. **等待确认**：用户明确回复「确认」或给出修改后的 message 后，**下一轮**才可执行提交。
3. **禁止推断**：用户只说「提交」「commit」「push」等，**不能**视为已确认 message；不得引用上一轮已展示的 message 跳过当次审核。
4. **禁止擅自提交**：未获用户确认前，不得运行 `git commit`。

**正确流程示例：**

```text
Agent：拟用 commit message 如下，请确认：
       chore(base0703): 切换包管理器为 pnpm
       （变更摘要：…）
User：确认
Agent：（下一轮）执行 git commit
```

本地启用提交模板（可选，一次性配置）：

```bash
git config commit.template .gitmessage
```

---

## 9. 下一步

1. 安装 Superpowers：在 Cursor Agent 聊天中输入 `/add-plugin superpowers`
2. 重启 Cursor，使 `/opsx:*` 命令生效
3. 启动 Foundation 变更：

   ```text
   /opsx:new portfolio-foundation
   /opsx:continue
   ```

4. Foundation 归档后，开始第一个可见功能：`/opsx:new home-hero`

<!-- BEGIN:nextjs-agent-rules -->
# 这不是你熟悉的 Next.js

此版本包含破坏性变更 — API、约定与文件结构可能与训练数据不同。编写任何代码前请阅读 `node_modules/next/dist/docs/` 中的相关指南，并注意弃用说明。
<!-- END:nextjs-agent-rules -->

# next-portfolio

基于 Next.js 16、React 19、TypeScript 与 Tailwind CSS 4 的个人作品集网站。

## 开发流程

- 所有非 trivial 功能均使用 **OpenSpec + Superspec**（`/opsx:new`、`/opsx:continue`、`/opsx:apply`、`/opsx:verify`、`/opsx:archive`）。
- 在 Cursor 中安装 **Superpowers**，用于 TDD 与结构化实现。
- 技术决策与路线图：`docs/TECH-OUTLINE.md`
- OpenSpec 配置：`openspec/config.yaml`（schema: superspec）

## 项目约定

- 内容存放在 `src/content/` 的 JSON 文件中（MVP 阶段）；`/edit` 为后期功能。
- 保持变更小而规格驱动；每个 OpenSpec change 只做一个能力。
- 项目文档使用中文；代码标识符使用英文。
- 不要提交密钥（`.env*`、凭证文件等）。
- 包管理使用 **pnpm**（`pnpm install` / `pnpm add` / `pnpm dev`），勿用 npm 或 yarn。
- **客户端数据请求与缓存**统一使用 `@tanstack/react-query`：
  - 根布局通过 `QueryProvider`（`src/components/providers/query-provider.tsx`）注入 `QueryClientProvider`。
  - 组件内使用 `useQuery` / `useMutation` 发起请求与管理状态，勿在 Client Component 中用 `useEffect` + `useState` 手写请求逻辑。
  - 服务端首屏数据仍可在 Server Component 中直接读取（如 `src/content/*.json`）；需客户端刷新、轮询、乐观更新或跨组件共享缓存时，改用 React Query。
- **后端与持久化**统一使用 **Supabase + PostgreSQL**：
  - MVP 展示内容仍读 `src/content/*.json`；需登录、跨设备同步、在线编辑、工具配置或记录写入时再接入 Supabase。
  - 数据库为 Supabase 托管的 PostgreSQL；鉴权用 Supabase Auth；私人数据通过 Row Level Security（RLS）限制为仅本人可读写。
  - 服务端读写经 Next.js Route Handler / Server Action；客户端经 React Query 调用上述 API，勿在前端直连数据库凭证。
  - 环境变量：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`（可公开）；`SUPABASE_SERVICE_ROLE_KEY` 仅服务端、勿提交仓库。
- Git 提交信息格式：`<type>(<scope>): <subject>`，例如 `feat(base0703): 添加首页 Hero`。scope 必填，当前迭代可用 `base0703`。
- **AI Git 提交审核流程（强制）：**
  1. 执行 `git commit` 前，**必须在当次回复中**列出完整 commit message（含变更摘要），明确请用户审核。
  2. **必须等待用户明确确认**（如「确认」、或给出修改后的 message）后，**下一轮**才可执行 `git add` / `git commit`。
  3. 用户仅说「提交」「commit」等，**不视为**对 message 的确认；不得因上一轮已展示过 message 而跳过当次审核。
  4. 未经用户确认，**不得**擅自 commit。

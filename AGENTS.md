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
- Git 提交信息格式：`<type>(<scope>): <subject>`，例如 `feat(base0703): 添加首页 Hero`。scope 必填，当前迭代可用 `base0703`。
- **AI Git 提交审核流程（强制）：**
  1. 执行 `git commit` 前，**必须在当次回复中**列出完整 commit message（含变更摘要），明确请用户审核。
  2. **必须等待用户明确确认**（如「确认」、或给出修改后的 message）后，**下一轮**才可执行 `git add` / `git commit`。
  3. 用户仅说「提交」「commit」等，**不视为**对 message 的确认；不得因上一轮已展示过 message 而跳过当次审核。
  4. 未经用户确认，**不得**擅自 commit。

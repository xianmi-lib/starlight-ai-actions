# AGENTS.md — starlight-ai-actions

开源 Starlight 插件（页标题下的 AI 按钮组：Markdown 工具菜单 + ChatGPT/Claude 预填讨论 + 粘贴 prompt 对话框），面向社区。源于显密文库项目（`../AGENTS.md` 有项目群全貌），但本仓库是**独立通用项目**，代码与文档不引用本站私货。

## 仓库结构

- `src/`：插件本体。`index.ts`（Starlight 插件，`config:setup` 覆盖 `PageTitle` + 配置经虚拟模块过桥）、`config.ts`（模板渲染/门槛判定）、`schema.ts`（`aiActionsSchema()` frontmatter 扩展）、`labels.ts`（en/zh-CN/zh-TW 三语缺省）、`events.ts`（`ai-actions` CustomEvent detail）、`components/`（PageTitle/AiActionsBar/AiDialog/AiIcon）、`libs/vite.ts`（虚拟模块桥，机制照抄 starlight-sidebar-topics 0.9.0）。
- `test/`：vitest 单测（配置合并、prompt 模板、门槛判定、frontmatter、事件）。
- `demo/`：**demo 兼文档站**（教程页宿主、截图与共存回归场）。
- `scripts/check-overflow.mjs` 五档宽溢出门禁、`demo/scripts/smoke.mjs` Playwright 行为冒烟。

## demo = 文档站 + 部署（2026-10-09 定型，照 starlight-theme-large-print demo 同模式）

- **教程页唯一真值源 = `demo/src/content/docs/index.md`**（含 frontmatter）：`https://www.xianmi.co/starlight-ai-actions/` 就由本仓 demo 的 worker 服务，改教程只改这一处。README 只留门面 + Quick Start，全文配置参考指该 URL，勿在 README 复写（双处漂移）。
- **base**：`demo/astro.config.mjs` `site: 'https://www.xianmi.co'` + `base: '/starlight-ai-actions'`（dev 下 URL 前缀同带）；站内脚本/冒烟路径都要带前缀。
- **postbuild 包裹**：产物移入 `dist/starlight-ai-actions/` 并拷 `404.html` 到 dist 根（`not_found_handling` 只找根 404）。
- **路由**（`demo/wrangler.jsonc`）：`www.xianmi.co/starlight-ai-actions*` + `xianmi.co/starlight-ai-actions*` 星号形态，覆盖裸路径与子路径；「更具体者优先」压过 theme worker 的 `www.xianmi.co/starlight*`（长前缀赢）。
- **部署唯一通道 = CF Workers Builds 自动部署**（2026-10-09 用户配置，push 到 main 触发；照 starlight-theme-large-print 模式）。**本地 `npm run deploy` 已退役，禁止本地/CF 双轨部署**（产物 hash 随环境不同，双轨会让资产频繁翻滚）。云端 deploy 只更新资产不动路由（路由在 `demo/wrangler.jsonc`）。手动重触发用 deploy hook（配置见 CF 控制台 Builds）。
- 门槛矩阵（`class="page-actions-bar"` 口径）：`…/starlight-ai-actions/a/`=1、`…/starlight-ai-actions/`=0（index=教程页，index 页恒不渲染按钮条）、`…/starlight-ai-actions/hidden/`=0（frontmatter `aiActions: false`）、`…/starlight-ai-actions/custom-prompt/`=CUSTOM（frontmatter prompt 覆盖生效）。

## 发布流程（未执行）

- **npm 发布**：0.1.0 发布就绪（35 单测绿、tsc 干净），`npm publish --access public` **待用户放行**。token 在用户侧 `~/.npmrc`，值不落任何文件；publish 成功后 `npm view` 约 1–2 分钟才转绿，勿立刻误判失败。
- **官方收录（待提）**：按 [withastro/starlight CONTRIBUTING](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md) 插件列表 PR（前提=包已上 npm）；listing href 指 `https://www.xianmi.co/starlight-ai-actions/`（本仓 worker 服务）。

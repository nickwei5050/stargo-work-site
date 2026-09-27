# 自有配图替换 — 实施记录（2026-09-27）

**状态：本地构建完成，待 PR。**

| | |
|---|---|
| 仓库 | `nickwei5050/stargo-work-site`（分支 `assets/owner-images-2026-09-27`，待推送） |
| 依据 | 业主 Google Drive 交接：`配图2.rar`（2026-09-27，56 张 PNG，本轮精选 9 张） |
| 授权范围 | 品牌/产品/功能展示图可替换为业主自有配图；布局、字号层级、整体配色、响应式、开场动画、首页旋转图片展示动效、导航、Tab、滚动、悬停、CTA、表单、价格与业务文案不变 |

## 槽位映射（9 个槽位，36 个图片文件）

| 槽位 id | 位置 | 新图内容 | 处理 |
|---|---|---|---|
| `os-loading` | Hero 剧场静帧[1] | AI 隔着分层玻璃筛选画像（逐层就位） | 1600 上限不放大，WebP q82；400/800/1200 档 q80 |
| `os-login` | Hero 剧场静帧[2]、能力页 Approvals 行 | 放大镜核验人物画像（准入核验） | 同上；alt 文案更新为「准入核验：受控通道只为确认过的身份开放」 |
| `os-cockpit` | Hero 剧场静帧[4]、能力页 Growth OS 行 | 暗金仪表盘指挥中枢 | 同上 |
| `os-agent-center` | Hero 剧场静帧[5]、能力页 AI team 行 | 六节点金色协作枢纽 | 同上 |
| `os-inquiries` | Hero 剧场静帧[6]、Sales Desk 行 | 邮件/电话/聊天汇入同一收件箱 | 同上 |
| `brand-family-02` | 首页核心系统 ERP 卡 | 仓库传送带与 STARGO 纸箱（履约） | 同上 |
| `gos10-growth-control-tower` | 首页核心系统 Growth OS 卡 | STARGO WORK 笔记本电脑仪表盘 | 产品位：源宽 1672 不放大；480/768/1024 档 |
| `sw028-sales-desk-inquiry-reply` | 首页 Sales Desk 卡、002 业务阶段、能力页 story-2、SALES_ROWS、hero 旋转图库、博客封面 | 深色手机聊天 + CRM 面板 + 审批 | 产品位：源宽 1448 不放大；480/768/1024 档；博客封面 6 张已重出 |
| donor `_map` | 首页数字员工段 | 288 数字员工画像墙 | 1382/1080/800/500 四档，q80（donor 资产复写，`mirror-donor-assets` 跳过已存在文件） |

## 未替换（有意保留）

- `os-boot`（AI 创作卡、Hero 剧场静帧[0]、渠道段）：本轮 56 张中没有"AI 图片/视频创作台"对应素材；现图是真实 AI 创作工作台界面截图，语义准确，保留。
- `brand-glow-square`（品牌装饰、定价企业版卡）：品牌体系装饰位，无对应方形抽象素材，不硬塞。
- `og-cover.png`：按 replaceables 规则保持 1200×630 不动。

## 资产与登记

- 原图（PNG）按惯例留在仓库之外：`originals/`（本机工作区），未提交。
- `tools/imagegen/assets-manifest.json`：6 条 editorial 记录更新（尺寸/字节/SHA-256/ variants），总数保持 43，SHA 唯一。
- `tools/imagegen/product-assets.json`：2 条产品记录更新（来源文件、SHA-256、像素），`width <= sourcePixels[0]` 断言通过。
- `tools/editorial-images.mjs`：`os-login` 中英 alt 更新；其余描述仍贴合新图语义。
- `assets/blog/`：`from-inquiry-to-quote`、`approval-gates-for-ai-in-trade` 两篇封面（各 3 档）已按新源重出。

## 构建与验证

- `npm run build`：40 页（中英）一次通过。
- 文件级断言（复刻 `verify-editorial` 非浏览器部分）：43 editorial / 11 product 计数、SHA 唯一、文件存在、`width/height/alt` 注入、已注册 id —— 全部通过。
- 浏览器实测（`verify-site` / `verify-integrity` / `verify-visual`）：本机无 Chromium，CI 在 PR 上跑。
- 注意：ZIP 解包时 4 个 donor 文件名被改写（`→` 变成 `#U2192`），已恢复原名，否则构建报缺资产。

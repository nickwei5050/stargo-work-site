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

---

## 第二轮（2026-09-27 晚）：全站剩余图片 + 展示尺寸可读性

用户要求"把整个网站换完"，并指出核心问题是图片展示窗口太小、内容看不清。因此第二轮同时做：全站换图 + 小尺寸槽位的清晰度优化（不改变任何交互/动效/DOM）。

### Editorial（21 个槽位，配图2）

| 槽位 | 用户源图 | 说明 |
|---|---|---|
| `os-sales-desk` | img_21 | 询盘卡片流（销售工作台） |
| `os-quote-studio` | img_16 | 报价枢纽：单据汇聚（alt 已更新） |
| `os-trade-execution` | img_22 | 港口履约 |
| `brand-glow-wide` | img_31 | 地球仪与案头（alt 已更新） |
| `brand-glow-square` | img_45 | 暗夜全球网络（alt 已更新；上一轮保留，本轮补上） |
| `brand-glow-tall` | img_41 | 落笔审批（alt 已更新） |
| `brand-ontology` | img_53 | 企业知识库（alt 已更新） |
| `brand-loop` | img_18 | 环绕节点的协作轨道（alt 已更新） |
| `brand-family-01` | img_33 | 履约一线 STARGO 货箱（alt 已更新；缩略图槽位做了居中收紧裁切） |
| `brand-family-03` | img_44 | 团队协作 |
| `brand-family-04` | img_29 | 围坐研讨（alt 已更新） |
| `mobile-approvals` | img_28 | 审批平板（竖构图预裁切：Approve 按钮区；经 300px 清晰度验证返工） |
| `mobile-agents` | img_48 | 聊天气泡（竖构图预裁切） |
| `mobile-inquiry` | img_54 | 客户对话线程（竖构图预裁切） |
| `mobile-core` | img_08 | 全息地球（竖构图预裁切，经 300px 验证返工到地球仪+卡片区） |
| `phone-approvals` | img_34 | 采购订单审批 |
| `phone-agents` | img_56 | 协作枢纽人物 |
| `silo-email` | img_15 | 邮件孤岛 |
| `silo-whatsapp` | img_02 | 对话孤岛（与 sw028 同源，槽位语义一致） |
| `silo-excel` | img_03 | 表格孤岛 |
| `silo-erp` | img_26 | 仓库孤岛 |

- mobile-* 四个槽位同时出现在竖屏手机框（`lx-integrations-image`，object-fit: cover）与横屏大卡中；源图预裁为 3:4 竖构图，与原文件（887×1774 竖版）行为一致。
- `os-boot` 仍保留：56 张中无"AI 图片/视频创作台"对应素材，现图语义准确。

### Product（9 个槽位，Drive"网站配图/全部"真实产品截图）

| 槽位 | Drive 源图 | 说明 |
|---|---|---|
| `gos01-market-thesis` | 增长分析.png | 缩略图专用槽位（186/250px）：裁切到左侧"STARGO 增长分析"标题区，186px 下标题可读；alt 已更新 |
| `gos05-buying-committee` | 主动获客7.png | 缩略图专用槽位：裁切到 Buying Committee 标题+60% donut 区；186px 下标题可读 |
| `gos09-reorder-radar` | 控制中心 (1).png | 缩略图专用槽位：裁切到顶部导航+应用卡片区 |
| `gos11-dormant-reactivation` | 首页 (2).png | 全能工作台（深色） |
| `sw003-ai-workspace-home` | 首页 (1).png | AI 工作台首页（深色） |
| `sw004-experts-library` | 数字员工1.png | 数字员工 AI Staff 列表 |
| `sw006-expert-teams` | 数字员工2.png | 数字员工团队 |
| `sw008-workflow-library` | 工作流引擎.png | 工作流引擎（语义精确匹配） |
| `sw033-sales-desk-document-pack` | 销售工作台1.png | 销售工作台 |
| `os-desktop`（editorial） | 系统地图.png | 系统地图（深色，语义精确匹配） |

- 缩略图三件套（gos01/05/09）因只在 186–250px 展示，采用"标题区 focus-crop"策略；`product-assets.json` 的 note 已如实更新（不再是 never cropped），`crop` 字段记为 `focus-legibility`。
- 其余产品槽位保留全幅界面（288–1040px 展示下可辨认为真实界面）。

### 展示尺寸（CSS 容器）审查结论

- 盘点了全站图片 class 与 sizes：最小的展示声明是 `cn-service-thumbnail`（186/250px）、`ro-home-header-img`（288/320px）、一批 360px 卡片图。
- 决定：不改任何 CSS 布局/尺寸（用户禁令：不改变交互与动效；容器尺寸属于布局体系），改用"源图构图适配"解决可读性——缩略图槽位给标题区特写，手机框槽位给竖构图，360px+ 槽位给主体明确的大色块图。
- 每张新图在目标最小展示宽度下做了缩小预览验证（`before-after/legibility_*.jpg`），两张手机框图返工后通过。

### 构建与验证

- `npm run build`：40 页一次通过。
- `verify-editorial` 静态部分：43 editorial SHA 唯一、11 product 各自独立源、placed 图片全部带 alt/width/height、无 legacy 引用 —— PASS。
- `verify-site` / `verify-integrity` / `verify-interactions`：本机无 Playwright Chromium（下载超时），浏览器实测留待 PR 的 CI / Cloudflare 预览。
- 推送方式：API token 无写权限（403），改走浏览器网页上传，分 6 批；`blog-covers.json` 远端已有第一轮新 hash，本地为旧版，已排除在推送之外，避免回退。
- 补传了第一轮漏掉的 `699b…4f51_map-p-800.webp`（从远端新版 map.webp 生成 800px 档）。

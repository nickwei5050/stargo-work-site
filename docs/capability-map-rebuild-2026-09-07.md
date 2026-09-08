# Capability map — module rebuild (2026-09-07)

范围：只重建 `/en/capabilities` 的 Capability map 模块。中文页、其他模块、价格、表单、路由、后台均未改动。**未部署。**

## 1. 选了哪个模板，为什么

**捐赠模板：qubix `services_development.html` → `.service-details-rice` 区块。**

先在浏览器里实测了两个模板，而不是看名字或截图猜：

| 候选 | 实测结果 | 结论 |
|---|---|---|
| renok `service.html` | 10 个「tab」类名全是 `rt-tab-display-off` 这类响应式显示开关，**不是 tab 组件**；服务区是浅底 + 人像图 | 不用：浅底与能力页冲突，且需要新增人像素材 |
| qubix `services.html` | 卡片列表：左标题 + 中图片 + 右子项清单 | 不用作主模块：每卡需要一张新图片 |
| **qubix `services_development.html` 的 `.service-details-rice`** | 标签 + 富文本网格，列表项以粗体术语开头；**无图片**、深底（body `#000`）、原生可重复（该页自身重复 4 次） | **选用** |

选它的理由：能力目录有 157 条，需要一个能承载长内容又不退回表格的结构。这个区块本身就是「标签 + 解释 + 术语清单」，正是能力说明需要的形状；不需要新增图片，也就不需要伪造产品截图。

## 2. 移植了什么

| 层面 | 做法 |
|---|---|
| 标记 | 在 `tools/build-site.mjs` 新增 `capabilityShowcase()`，按捐赠结构生成，类名加 `qx-` 前缀避免与 Mono / Scalora / Lifelogx 冲突 |
| 样式 | `css/stargo-fusion.css`，全部作用域在 `.qx-capmap` 下。数值取自捐赠区块的**实测计算样式**：标签 20/26.8、字距 -0.8px、`#fe6512`；正文 20/26.8、字距 -0.4px；列表项 20/30.8、`#a1a1a1`、20px 项目符号缩进；标签间距 52px；行间距 24px；文本列 698px、区块 872px；以及捐赠模板自己的 `@media (min-width:1280px)` 标签换位断点 |
| 资源 | `assets/qubix/`：四个 InterDisplay 字重 + 项目符号 `dot.svg`，从模板 CDN 镜像到本地（本站不允许跨域请求） |
| 出处 | `tools/templates/qubix/` 保留捐赠页面、同级卡片页与样式表，附 `SOURCE.md` |

移植后实测与捐赠模板逐项一致：标签 `20px / 26.8px / 500 / -0.8px / rgb(254,101,18) / Interdisplay`，列表项 `20px / 30.8px / rgb(161,161,161)`，行布局 1440 时 `row nowrap`、1024 时 `row wrap` —— 与捐赠模板相同。

**两处因内容而非口味的偏离**（已在 SOURCE.md 记录）：捐赠模板的标签是 "Overview" 这类单词，从不需要换行，我们的标签是成句的业务结果，故在 1280px 以下让标签占满整行换行；捐赠模板的富文本从不含链接，目录锚点因此按其自有配色加了下划线。

## 3. 模块内容

结构：开场 → 6 个业务故事 → 4 个共同基础 → 完整目录（14 组）。共 27 个捐赠行单元。

开场：`CONNECTED CAPABILITIES` / **Find buyers. Win orders. Keep the work moving.** / 说明句 + 范围声明（登记范围不等于已部署）。

六个业务故事，每个含：结果导向标题、业务说明、若干真实能力条目（粗体名 + 说明）、`Useful output`、`Connects to`、以及指向目录分组的链接。

| 故事 | 覆盖分组 |
|---|---|
| Find the buyers worth pursuing | 02 · 03 |
| Turn conversations into customer understanding | 04 · 05 |
| Prepare quotations with commercial control | 07 · 06 |
| Coordinate orders through fulfilment and follow-up | 08 |
| Create content for products and markets | 09 · 03 |
| Run the work with an AI team | 01 · 10 |

四个共同基础：Business context（06 · 12）、Tools and connections（11）、Authority and evidence（13）、Improvement you can check（14）。

**14 个能力域全部可追溯，157 条能力全部有可达位置。** 覆盖表：`docs/capability-map-coverage.md`。

### 防止叙事与目录脱节
`CAPABILITY_SHOWCASE.picks` 里的每个能力名都会在构建时到 `CAPABILITY_GROUPS` 里查表，**打印的是登记表自己的说明**。因此故事区不可能对同一能力给出与目录不同的描述；能力一旦改名，构建直接失败而不是悄悄从页面消失。本次 62 处引用全部解析成功。

### 顺带修好的说明质量
上一轮把 78 条「说明只是复述功能名」改掉后，本轮又用词集与长度两个口径复查，发现 20 条只是词序变体（`CRM Automatic Lead Creation → Automatic CRM lead creation`）、42 条过短（`Approval Center → Approval centre`）。全部重写。现在 **157 条中复述 0、过短 0**。

## 4. 保留了什么

- `#atlas` 锚点保留（模块自身即 `id="atlas"`），页面上方「See every capability」按钮仍然到达。
- `#g01`–`#g14` 十四个分组锚点全部保留，实测：点击 `#g07` 滚动到位（元素顶边 124px）；直接深链 `#g12` 落点顶边 0px。
- 模块上方的九阶段 trade loop 表、页头、hero、页脚、其他区块、其他路由与中文页面未改动。
- 未新增路由、未改任何 href、未引入第三方脚本、未新增图片。

## 5. 实际跑过的检查

| 检查 | 结果 |
|---|---|
| 320 / 390 / 768 / 1024 / 1280 / 1440 / 1920 七个宽度 | 文本越界 0、横向滚动 0 |
| 与捐赠模板计算样式对照 | 标签、列表项、行布局逐项一致 |
| 锚点导航 | 点击与深链均正确定位 |
| 控制台 / 失败请求 | 0 |
| 跨域请求 | 0（字体与项目符号已本地化） |
| 中英隔离 | 英文页有新模块，中文页仍是原表格 |
| 回归套件 | 见 `.wrangler/suite-logs/capmap.log` |

**未做**：真实设备、Safari/Firefox、无障碍审计、线上验证（未部署）。

## 6. 需要业主决定

1. **逐条上线状态**：模块顶部写明「登记范围不等于已部署」，但未逐条标注 Available / Pilot / Planned / Research Preview。需要每条的实施证据才能标。
2. **中文能力页**：仍是原表格，且中文说明同样只是功能名直译。是否授权同步重建。
3. **InterDisplay 字体授权**：已随 qubix 模板镜像到本地。若模板授权不含在自有站点分发字体，需要替换为等价字体。

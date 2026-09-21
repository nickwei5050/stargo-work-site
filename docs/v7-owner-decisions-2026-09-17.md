# V7 业主决定落实、博客重写与遗留问题修复 — 实施记录（2026-09-17）

**状态：仅本地候选版本。未推送、未合并、未部署。**

| | |
|---|---|
| 分支 | `content/v6-placement`（git worktree `F:\stargo 网站\stargo-site-v6`） |
| 本轮起点 | `6113ec5`（V6 内容整合记录） |
| 本轮终点 | 本记录所在的提交（前一提交 `fbe47b5`） |
| 依据 | 业主 2026-09-17 的逐条答复；`STARGO_WORK_Visual_and_Detailed_Guide_CN_EN_V4.pdf`（与 V5 母稿内容一致，另含图表）；`STARGO_WORK_Website_Content_CN_EN_V5.md`；GitHub 私有仓库 `nickwei5050/stargo-work`（只读核查） |
| 构建 | `npm run build`，40 个页面（中英各 20 页，含 7 篇文章）；连续两次构建工作区无变化 |
| 规模 | 本轮 70 次提交；非生成文件 45 个（新增 `js/stargo-anchor-glide.js`、`js/stargo-ix-arrival.js`、`js/stargo-side-menu.js`、`tools/blocks/rk-price-tiers.js`、博客封面三档） |

## 一、业主决定与落实

| # | 业主答复 | 落实情况 |
|---|---|---|
| 1 | 定价页价格卡和 FAQ 里“288 是岗位目录、不是同时运行”的说法改回 | 价格卡改回线上原文「288 个 AI 员工 / 在企业设定的权限范围内工作。」（新增 `PRICING.cardStat`，价格卡不再读企业页的数字）；FAQ「288 个 AI 员工是无限使用吗？」改回原答案「不是。288 说的是能力目录的规模。……以签约配置为准。」英文同步改回。**另外**：“不是同时运行 / not concurrent”这一说法在全站其余位置也一并撤下（与已上线的员工协作、并行处理相矛盾），改为“实际启用的员工、协作规模与操作范围受配置、预算和权限约束”，“不等于替代 288 名真人”保留。 |
| 1b | 员工之间可以共同协作、通讯、一起完成任务 | 首页 FAQ、能力页 #story-6 与 #g10、数字员工页、智能层页、企业页数字、第三方声明页卡片、博客统一写成：多位数字员工围绕同一目标组队，互相发消息、提问、交接，并行处理，由统筹角色复核汇总后交负责人确认；边界同时写明：协作轮次、预算与可执行动作有上限，可随时叫停，对外动作仍需有权人员批准，共享任务信息不等于共享其他员工的权限。“基础派工已有记录 / 深度协作持续完善”等限定语全部删除。 |
| 2 | FDE 保留 | 定价 FAQ「培训和实施怎么做？」英文改回 “a dedicated FDE”；企业版权益行保持 “dedicated FDE”；首页企业卡片英文改回 “A dedicated FDE.”；企业页部署按钮改回「联系 STARGO 前置部署团队 / Talk to a STARGO FDE」。 |
| 3 | AI 视频已经完工 | 能力页创意手风琴、#g09 目录与详情、首页产品位 4、交付范围 M16-03、能力页 FAQ、博客：「AI 一键生成视频」「爆款结构再创作」去掉“建设中”，写成已开放；保留边界：成片经人工审核后发布、按企业开通的服务与额度计量、素材须有权使用、爆款再创作不复制原片/人脸/声音/音乐/标志/水印、不承诺必成爆款。 |
| 4 | Logo 墙继续保留 | 未改动。 |
| 5 | 联系表单与定价开场全部应用 | 联系表单兴趣选项改为 V5 P07 的 9 项（表单字段、提交逻辑、同意文字未动；提交内容为选项文字）；定价页开场应用 V5 P08：大字标题「合适 / 配置」（英文 WORK / DONE）、说明段落、方案区标题「从需要解决的业务，确定合适的配置与服务。」；价格、档位、权益、数量未变。英文「标准版包含什么？」答案对齐中文与标准版卡片（原英文列了另一组内容）。 |
| 6 | 博客统一改写，附件发一篇，做好 SEO 与 GEO | 见第三节。 |
| 8 | 原有小问题全部修好 | 见第四节。 |
| — | 导航与拼写 | 导航「企业与治理」→「企业管理」；英文 fulfilment 统一为 fulfillment。 |

## 二、GitHub 核查与口径差异（发布前请确认）

业主指示“GitHub 账户 stargo-work 里有所有功能”。核查 `nickwei5050/stargo-work`（主干最新提交 2026-09-16）结果：

- **员工协作**：团队组建、员工之间传话（真实模型往返 A→B→A、三员工接力）、资料不全时停下来请人补充、轮次与次数上限、成员只能发消息等已合并，但只在测试环境跑通；并行处理与结果汇总只有设计；暂停后恢复与接管、浏览器验收未通过；工单状态为“部分完成”。
- **AI 视频**：参考视频拆解、两个视频应用共享项目库已上线；付费生成链路已合并但标记“部分完成”；**尚无一条 AI 生成成片通过验收**；爆款再创作三个版本未跑通；长视频拆条只有机械部分。

按业主“按你说的写成已完成”的答复，官网已写成已开放（保留上述边界）。**官网口径与仓库记录不一致**；若最新进度尚未推到仓库，建议发布前补齐验收记录。

## 三、博客（7 篇，中英双语）

- **6 篇重写**（网址、日期、封面不变，`modified: 2026-09-17`）：统一口径与结构——首段直接回答标题、「要点速览 / Key takeaways」、问题式小标题、2–4 个站内链接、结尾一句行动引导、「常见问题」。标题与描述重写，去掉全部实现术语（本体/Ontology、Evolution Engine、Quote Studio、Customer 360、Trade Execution、Capability Center、Audit Ledger、Canary、提示词、Orchestrator、Agent 等）。
  1. 从一条流程开始：AI 落地的五个步骤
  2. Sales Desk：从询盘到批准的报价与 PI
  3. 谁来做决定：审批、记录、预算与接管
  4. 什么是网页桌面级 AI 企业操作系统
  5. 288 个数字员工：怎样组队、沟通、交付
  6. 企业知识与业务关系图：让 AI 读懂公司（网址仍为 enterprise-ontology-explained）
- **新文章** `blog/stargo-work-visual-guide`「STARGO WORK 图文详解：从获客到经营」：按 V4 的 16 个主题组织，每节写做什么、对老板的价值、开放条件与链接；8 组常见问题。
- **网页图表**（业主选择重做，不用 PDF 截图；中文页只有中文、英文页只有英文，文字为 HTML 可被检索）：业务主线、Growth OS → Sales Desk、288 岗位分布条形图（十类合计 288，构建时校验）、多员工协作、一键视频流程与三种画幅、主动工作循环、老板“看得见/管得住/查得清”、五步落地、开放状态总览；部分图表复用到其他文章。
- **SEO / GEO**：每篇 FAQPage 结构化数据（与页面可见 FAQ 逐字一致）；BlogPosting 增加 dateModified、articleSection、wordCount、about、mentions；关键词分语言；新增 `llms.txt`（由 `tools/make-dist.mjs` 生成：中英定义、关键事实与开放条件、十类岗位、主要页面与全部文章链接）；标题/描述长度与禁用词在构建时校验；中文标题按词组断行。
- 封面：`brand-loop.webp` 裁切为 1200/800/500 三档（Pillow 生成，与脚本输出规格一致）。

## 四、遗留问题修复

共三轮，全部在各自隔离的工作树里完成，再合并回本分支。每一轮都做了修改前后的截图对比，并确认页面其他部分没有移动。逐条记录见附录 A–D（英文，来自各轮代理报告）。

**第一轮：上一轮交接时列出的原有问题（54 项）**
- **能力页：**
  - 窄屏九步标签被截断；
  - 创意手风琴没有键盘操作和读屏标注；
  - 页内链接（#story-1…6、#gNN、#creative-*）落点偏移；
  - 箭头链接缺少无障碍名称；
  - 目录脚本在“干净网址”（/capabilities）下判断失误；
  - #atlas 目录带没有对齐页面网格；
  - 中文目录标题和结尾句断词；
  - “基础”四节点在平板上，展开面板会挡住相邻节点；
  - 英文标题末行孤词。
- **数字员工 / 智能层 / 企业 / 关于：**
  - 智能层首屏“持续改进”按钮在手机上落到页脚；
  - 智能层可展开卡片文字被裁切；
  - 气泡跑马灯相互重叠；
  - 智能层卡片小标签与内容不符；
  - 智能层中文手机截图带英文界面；
  - 数字员工页首屏文字压在照片上；
  - 数字员工页团队场景卡片之间露出碎片；
  - 数字员工页 768 宽度下布局过窄；
  - 企业页驾驶舱带大片空白；
  - 企业页卡片 2 用了竖图；
  - 企业页表头与单元格没对齐；
  - 企业页胶囊导航遮住正文；
  - 关于页引言卡在手机上过长；
  - 评价带和多处中文断词、孤字。
- **首页 / 联系 / 定价 / 声明 / 404 / 全站：**
  - 页面有多个 h1，且标签不配对；
  - #loop 卡片标签被切；
  - 英文轮换词被拆成两行；
  - 288 卡片说明与正文碰撞；
  - 中文说明、按钮、标题断词；
  - 中文页用了英文句号；
  - 中文页无障碍名称是英文；
  - 联系表单卡片在手机上变窄；
  - 留言框太矮；
  - 定价开关没有键盘操作和读屏标注；
  - 声明页断词；
  - 页脚标语断词。
- **检查脚本：**
  - verify-fixes 中过时的定价与联系表单检查改为针对现有组件，结果 28/28；
  - verify-editorial 只在有标签组件的页面要求 `stargo-tabs.js`；
  - 关于页补回被误删的表单与标签脚本。

**独立复查（合并后）：**
- 分工：4 位浏览器复查员（中英文，390/768/1440 宽度）和 1 位文案与口径审查员；
- 结果：报告 64 项，每项由另一位代理复现，确认 61 项，另 3 项未复现。

**第二轮：复查确认的 61 项（60 项修复，1 项需业主决定）**
- **首页“五个业务阶段”：** 从下方回来或直接跳转时，两个阶段会同时高亮。现在任何进入方式都只高亮一个。
- **桌面侧边菜单：**
  - 关闭时其中的链接不再能被 Tab 选中；
  - 打开后焦点移入菜单，Esc 可关闭并回到触发按钮；
  - 触发按钮有名称和可见焦点。
- **页脚、侧边菜单、关于页引言卡：** 社交图标原来与去向不符（Instagram、X 等图标）。现在按实际去向显示“网站 / WhatsApp / 邮件”三个图标，三处用同一套图形。
- **能力目录：** 条目中的第三方品牌与内部模块名改为业务说法。例如 Google Maps 改为地图商家发现；Quote Studio、报价工作室改为报价工作台；贸易执行引擎、能力中心、审计台账、凭据管理等也同样处理。英文说明里的 agent 统一为 AI employee；阿里国际站作为渠道名保留。
- **创意手风琴：** 点击答案内部不再收起，文字可以选中；原有的键盘操作保留。
- **智能层手机截图：** 中英文页都换成站内无文字概念图，包括手持手机那张；原图含第三方设计工具名称和无关界面。
- **404 页：**
  - 英文导航文字被截断，已修复；
  - 手机上页脚标语一直不显示，已修复；
  - 点击无效的菜单图标已去掉，手机端保留与其他页面相同的菜单按钮。
- **条款页：** 知识产权条款里的产品名去掉 Quote Studio，其余法律文字未动。
- **定价页：**
  - “续费”视图中“联系我们”不再带“/ 年”；
  - 中文 FAQ 问题与对比表不再断词；
  - 英文对比表在 768–991 宽度下，价格行与表头列对齐。
- **博客与首页文章卡片：**
  - 图表文字、目录、箭头行、署名行断词；
  - 英文新文章标题断行；
  - 首页文章卡片图片高度不一致；
  - 贸易单证英文说法；
  - “营销套件一键编排”限定为营销套件，避免被误读成视频仍在建设；
  - 协作图角色名保持一行。
- **其他：**
  - 中文轮换词字间距；
  - 智能层结尾卡片文字被人像遮挡；
  - 企业页第四个故事面板停留时间过短；
  - 英文孤词和中文断词若干。

**第二轮中断与补完：**
- 第二轮中途因额度上限中断。补完的代理逐项复现核对，发现并修复了中断前的 3 处回归：
  - 五阶段按钮挤掉了圆点；
  - “STARGO WORK”断行修复没有生效；
  - 页脚与关于页图标的图形不一致。
- 另外在最终全量检查中发现 1 处检查脚本过时，详见第五节。

## 五、验证

全部针对本地服务（`PORT=4310 node tools/serve.mjs`，`BASE_URL=http://127.0.0.1:4310`）在最终候选上运行。

| 命令 | 结果 |
|---|---|
| `npm run build` | 通过，40 个页面；构建时的断言全部成立（新增：9 个联系选项、价格卡数字、定价开场大字须出自标题、协作卡片说明、十类岗位合计 288、博客标题与描述长度、禁用词、FAQ 与结构化数据一致、每页只有一个 h1、404 页不残留模板菜单图标等）；连续两次构建工作区无变化 |
| `verify-site` | 通过：40 页，0 错误、0 失败请求、0 外部请求、0 死链 |
| `verify-integrity` | 通过：42 项（重复 id、页内与跨页锚点、定价页无障碍） |
| `verify-interactions` | 通过：16 项（含智能层锚点落点） |
| `verify-conversion` | 通过：5/5（表单校验、防重复提交、模拟 503 时如实提示、法律链接、定价切换、缩放）；未发送真实邮件 |
| `verify-editorial` | 通过：60/60（上一轮失败的 about.html 脚本检查已修正） |
| `verify-fixes` | 通过：28/28（上一轮为 20/28） |
| `verify-restore` | 首次全量运行 311/312：智能层英文页 1024 宽度，第 1 张可展开卡片收拢到 22% 时，检查脚本判定“正文压到标题”。浏览器实测：第二轮的新做法是放不下时正文整段移到卡片外（被裁剪、不可见），画面只剩标题，没有重叠或被切开的文字（截图已核对）。检查脚本原先只比纵向位置，已改为同时要求正文在卡片横向范围内才算可见。改后重跑：

## 六、需要业主决定 / 未改动

1. **功能状态口径与 GitHub 记录不一致**：员工协作、AI 一键视频、爆款结构再创作已按业主答复写成“已开放”（边界保留），但仓库记录显示仍为“部分完成 / 未通过成片验收”（第二节）。发布前请确认或补齐验收记录。
2. **定价“续费”视图**：上线版、增长版、全球获客版卡片在“续费”下仍重复列出首年交付内容（官网页数、SKU 图片、实拍短视频、AI 视频等）。续费是否包含这些属于商业条款，未改动。
3. **隐私政策中的服务处理方名称**：privacy 页写有 Cloudflare Pages、Cloudflare、Resend。这是数据处理方披露，是否保留属于法律判断，未改动。
4. **第三方声明页**列出开源项目名称，属法律文本，按规则豁免，未改动。
5. **博客网址**：`enterprise-ontology-explained` 网址仍含 ontology（为保留已有链接未改）；如需去掉，需要另做 301 跳转。
6. **英文智能层页图片**：原模板手机截图含第三方设计工具名称与无关界面，已换成站内无文字概念图；这与 2026-09-06“保留模板图片”的决定有出入，请确认。
7. **能力目录改名**：品牌与内部模块名已改为业务说法（阿里国际站保留为渠道名）；#g01 中业主 V5 原句“能力中心”改为“能力与应用管理”（与企业页一致）；英文目录仍保留业主能力清单中的 “Boss Cockpit”“Mission Control”。
8. **企业页英文组件标题**改为 “Linked accounts & protection”（原标题在窄列中断成孤词）。
9. **定价 FAQ 英文问题**仍为 “Are the 288 AI employees unlimited?”（随答案一起按原文保留）。
10. **首页 Logo 墙**：按业主决定保留（模板占位标志）。
11. **智能层可展开卡片**：收拢时正文整段移出而不是逐行被切，在英文 1024 宽度下卡片会有一段只显示标题的时间，属于第二轮的设计取舍。
12. **`llms.txt`** 由 `npm run dist` 写入 `dist/`，部署时才会生效（本次未部署）。


---

# 附录（英文，来自各轮代理报告，逐条）

## Appendix A — round 1: listed pre-existing problems (per area)

### LX — workforce, intelligence, enterprise, about (zh + en)

Branch v7/LX; commits 22621e5, 984f585, 278dbad, 4212c2e, 434988d, a298028, f1528f6, 526767e, 9b9ba6e, 83a7ba5, 4199072, 0a5d688, f66d994, 64ceca7, 3d6a199, 21c3ccb, 5f99e16, e5e070d.

| # | Status | Change |
|---|---|---|
| 1 | fixed | New script js/stargo-anchor-glide.js, loaded only on intelligence.html. The two hero buttons get a data-stargo-anchor attribute in tools/build-site.mjs. The script uses Webflow's own glide (same duration formula, same easing, same hash and focus handling) but … |
| 2 | fixed | Phones (≤767): each expandable card's content now fills the card and uses space-between with a minimum gap of 1.5rem instead of a fixed 7rem gap. The collapse now removes the gap first, and the IX2 heights and opacity are unchanged. Card 2 becomes the same bot… |
| 3 | fixed | New build helper zhTail() wraps the last clause of a Chinese paragraph in span.lx-v7-tail, which is inline-block (zh only). It is used for the team card paragraph (feat2Card) and the closing-card description (ctaDesc). It keeps whatever final clause the lead's… |
| 4 | fixed | In the build, both copies of each left-moving row now carry the same six bubbles (0-4 and 6). Bubble 5, the quote waiting for approval, still ends every copy of the right-moving row, so all 12 bubble texts still appear on the page. The .lx-cta-author-list row … |
| 5 | fixed | New cardTags and teamTags in LX_INTELLIGENCE (new lines only, after the cards array). The build replaces the template label on the 9 card slots and the team card: - 身份·来源·沟通 / Identity·Source·History - 需求·待补信息 / Needs·Missing info - 价格·版本·批准 / Price·Version·Ap… |
| 6 | fixed | New build helper enSentences() wraps each sentence of the English heroDesc and feat2Sub in span.lx-v7-sentence (inline-block, balanced). From 1280 the hero description box starts 6rem further left, using a percentage width and a negative margin so the grid doe… |
| 7 | fixed | The Chinese workforce hero lede breaks only at punctuation and spaces (keep-all plus overflow-wrap:anywhere). The build binds a figure to the Chinese word after it with a no-break space (288 个, 288 指), so this survives a rewording of the 288 sentence. |
| 8 | fixed | Workforce hero: - The title is 3.125rem from 1280 and 2.5rem at 768-1279 (was 4rem). - The lede is 36rem wide at 992-1279. - The text holder and button sit 1.75rem lower from 992 and .75rem lower at 768-991. - A soft black veil (::before) sits behind the text … |
| 9 | fixed | - Roster intro (zh): breaks only at punctuation (keep-all). - Workspace list at 768: the pink panel now stacks at 768-991 (issue 13), so each list item is one line. - Card 有岗位的 AI: its final clause 「也有清楚的范围。」 is kept whole with zhTail. |
| 10 | fixed | The team display line (.lx-v6-team-display) now fades in only while the last card uncovers it. This is a CSS scroll-driven animation on #lx-team's own view timeline (contain 68% to 84%), inside @supports. The IX2 card motion is untouched; browsers without scro… |
| 11 | fixed | - Scene label: the build puts no-break spaces between the last word, the dot and the number ('scenario · 01'). - English card headings: each clause is its own span.lx-v7-clause (inline-block, balanced). - The English text box is 90% of the card. Headings are 1… |
| 12 | fixed | The English .lx-v6-panel-title now uses text-wrap: balance. |
| 13 | fixed | At 768-991 the pink panel's .lx-capabilities-grid is a single column, the stacking the template itself uses below 768. The heading sits on top, the small cards are 308px or wider, and the desktop card keeps its own text-and-collage layout. Below 768 the deskto… |
| 14 | fixed | - Confirmation note on phones: a fixed 7rem with 1rem type, so the Chinese reads five characters a line. Up to 767 it is drawn above the people circle. - Collage strip: 17rem on phones. The people circle moves to the bottom and the role card to the upper right… |
| 15 | fixed | intelligence.html (zh only): the four phone-screen pictures in all three phone mockups now use the text-free editorial phone art. Mapping: chat → mobile-inquiry, message list → mobile-approvals, card wall → mobile-agents, first screen → mobile-core. They stay … |
| 16 | fixed | - 992 and up: the lead's frame-stretch rule already closes the blank run; no change here. - 768-991: that rule turned the three landscape pictures into 359px-wide frames up to 1024px tall beside a very narrow text column. The band now stacks as the template do… |
| 17 | fixed | Card 2 now uses brand-family-04 (landscape; registered description 共享上下文、权限边界与可控进化 / Shared context, permission boundaries and governed evolution) instead of the portrait phone-agents. It stays decorative like the other card pictures. |
| 18 | fixed | From 480 the #table header labels start where their columns start, and every cell fills its column; the third cells used to hug the right edge. Chinese cells break at phrases on phones and from 992. |
| 19 | fixed | New build helper zhKeep() wraps short Chinese clauses (and “quoted terms”) in span.stargo-keep with white-space: nowrap, zh only. It works inside the text the reveal splits per character. It is applied to the cockpit paragraph (up to 4 characters), the deliver… |
| 20 | fixed | From 992, .studio-sticky ends its text 100px above the bottom of the screen (was 60px). This clears the fixed pill nav (50px tall, 15px from the bottom) with 35px to spare. |
| 21 | fixed | Below 480 on About: - the intro card takes the full band width; - padding is 20px and gaps 16px; - the paragraph is 18px at 1.45 line height. The copy is unchanged. The Chinese headline and closing clauses are kept whole (a span in cn-about.mjs, clauses of up … |
| 22 | fixed | Both review blocks now write the Chinese quote with <wbr> between two words of 2 or more characters (ICU word segmentation at build time, in tools/blocks/cn-about-reviews.mjs and cn-reviews.mjs). CSS on those quotes only: keep-all, overflow-wrap:anywhere, pret… |
| 23 | fixed | Scanned all four pages, zh and en, at 320, 390, 768, 1024 and 1440 (scan.cjs: lone characters or words at the end of headings, cards and labels, split words in Chinese headings, horizontal overflow). Fixed: - intelligence zh 768: the sticky object-card sentenc… |

Other fixes found by the area scan:

- intelligence zh 768: the sticky-column object sentences break at their commas (「是谁，来自哪里，」/「之前谈过什么。」 instead of ending on 「什么。」, 「批准。」, 「核对。」)
- intelligence en 320 and 768-991: the collapsed card title 'Real workflows' no longer wraps inside the 5rem pill (smaller title, icon and gap there)
- intelligence en: the bubbles are no longer squeezed to two lines by the fixed 625rem row
- workforce zh: role names keep 「AI 员工」 whole (「市场研究」/「AI 员工」 instead of 「…AI 员」/「工」 at 768 and 390)
- workforce en: the small card titles, the desktop card title and the article strip titles are balanced; zh article strip titles break at phrases (「…AI，权/力…」 fixed)
- workforce 768-991: the small cards are 308px or wider instead of 138px (「交接有/记录」 fixed); below 768 the desktop card text gets right padding
- enterprise zh: connection table cells break at phrases on phones and from 992 (平/台, 生/产, 付/款, 有/权 fixed)
- enterprise en: the five management component titles are balanced (no lone 'management', 'permissions', 'actions', 'records')
- enterprise: a text shadow on the story panel text for contrast on the bright Connect and Oversight pictures (review minor item)
- about zh: headline 「从真实业务出发，」/「把分散的工作连接起来。」 (no lone 「起来。」 at 390)
- Notes for the lead: - Copy edits in tools/copy.mjs: <wbr>s were added on the same lines in LX_INTELLIGENCE.features[0] and features[1]. New lines were added: LX_INTELLIGENCE.cardTags and teamTags. The LX_INTELLIGENCE bub…

### CAP — capabilities page (capabilities.html, en/capabilities.html)

Branch v7/CAP; commits 6559474, 153e58f, 30f856d.

| # | Status | Change |
|---|---|---|
| 1 | fixed | tools/blocks/qx-orbit.css, new section G. Below 480px the ring box (340px wide) now has side margins of calc(50% - 170px) instead of auto. Where the ring fits this is the same as auto. A percentage margin counts as zero while the grid sizes its columns, so the… |
| 2 | fixed | tools/blocks/cn-faq.js follows the pattern js/stargo-catalogue.js uses for the catalogue rows. Each #story-5 row's plus control now has role=button, tabindex=0, aria-labelledby pointing at the row question (id <row>-title) and aria-controls pointing at the ans… |
| 3 | fixed | js/stargo-catalogue.js now handles every same-page link to #loop, #story-1…6, #foundations, #atlas, #g01…14 and #start. The click is taken in the capture phase and the page glides with Webflow's own timing: duration 472.143·ln(/d/+125)−2000 ms, data-scroll-tim… |
| 4 | fixed | tools/blocks/qx-projects.mjs: the #story-6 arrow link gets aria-label set to the site-navigation name of the page it opens, looked up in C.NAV (数字员工 on zh, AI Workforce on en). No new copy was added. The build fails if the arrow ever points to a page that is n… |
| 5 | fixed | js/stargo-catalogue.js compares pages with pagePath(). It decodes the path, strips a trailing /index(.html), .html and trailing slashes, and lowercases. It also compares protocol and host. So /capabilities, /capabilities/, /capabilities.html, /capabilities/ind… |
| 6 | fixed | css/stargo-fusion.css, V7-CAP rule 1. #atlas now uses the same container as the qubix sections above it: 16px sides below 480; 24px and a 492px column to 767; 32px and 703px to 991; 40px and 1280px from 992. The first band's 76px (52px on phones) top margin is… |
| 7 | fixed | Group names are unchanged. tools/lib-html.mjs has new zhPieces/zhWbr helpers. They use ICU Intl.Segmenter words and repair them: single characters the dictionary splits (询/盘, 获/客, 商/机, 营/销) are joined; punctuation and 的/地/得 attach to their word. tools/build-si… |
| 8 | fixed | tools/build-site.mjs: on the zh page, the #start closing line (CAPABILITIES.more) is written through zhKeep(). Each word of two or more characters sits in <span class="zh-keep">, and css/stargo-fusion.css V7-CAP rule 3 sets html[lang^=zh] #start .zh-keep to wh… |
| 9 | already-fine | No change. The lead already fixed this in 0b0fb0d. #story-1 row 4 (关键决策角色 / Key Decision Roles) uses mobile-approvals.webp, whose alt is 关键决策在审批点等待（AI 概念图） / 'A key decision held at an approval gate'; the row text ends 确认后交给 Sales Desk / 'handed to Sales Desk … |
| 10 | fixed | tools/blocks/qx-whatwedo.js now places each foundation list when it opens, and again on resize, late fonts, or when a scroll leaves it no longer clear. If the stylesheet's position does not overlap another node (with a gap) and stays inside the pinned frame (.… |
| 11 | fixed | css/stargo-fusion.css V7-CAP rule 4 applies text-wrap: balance to html[lang^=en] .qx-whatwedo .qx-wrapper-content-service .qx-h2 and .qx-text-heading-servie (the two halves of the split heading). |
| 12 | fixed | scan12.cjs checks the whole page at 320/360/390/768/1024/1440 in zh and en for lone last-line characters or words in headings, card titles and buttons, and for horizontal or vertical clipping. Fixed with CSS in V7-CAP rules 4 and 5, plus the rule-10 overlap fi… |

Other fixes found by the area scan:

- Foundations, 480–767px, English: node 01's promise ran under node 02's title (node 01 at 98–229 against node 02 from 209, at 600px) and blocked clicks on node 02 while node 01 was open. Node 02 now starts 4rem lower in E…
- Foundation lists that used to open off the right edge of the screen at 480–767 (list 01 and list 04) or out of the pinned frame at 1280×720, 1366×768 and 1280×800 now stay inside the frame.
- #creative-* arrivals: the scroll now goes through Lenis and the row is held in place through late layout, the same as the catalogue rows.
- zhPieces keeps structural particles (的/地/得…) and locative+的 (建设中的) with the word before them, so a Chinese line does not start with 的.

### HOME: homepage, contact, notices, 404, site-wide chrome, pricing page layout, verifiers

Branch v7/HOME; commits 5aa4581, 3ce64ae, edb8b00, b9ffa25, cd41eb0, 87202e7, c69af26, 96f264a.

| # | Status | Change |
|---|---|---|
| 1 | fixed | tools/build-site.mjs: the Scalora hero replace now matches every tag (<h1(?=[\s>]) → <h2, </h1> → </h2>) and throws if an h1 survives; the opening-overlay headline (aria-hidden, self-removing) becomes a div in homeIntro(). Homepage keeps one h1 (Mono's STARGO … |
| 2 | fixed | css/stargo-fusion.css V7-HOME H2: from 768px the three small card labels use Scalora's 20px/26px phone size plus text-wrap: balance (a label up to ~6 CJK characters or ~14 Latin holds one line). The labels were also hidden: the next section (.section.with-minu… |
| 3 | fixed | V7-HOME H3 (en only): .hero-title-inner-block wraps, so the 80px word window takes its own line under 'Carry it through to' (heading stays three lines, nothing below moves); words centred in the window and never wrap; heading lines balanced (fixes 'Carry it th… |
| 4 | fixed | V7-HOME H4: below 992 the label and avatar row share one 40px row (label right-aligned, balanced); 768-991 it stays pinned in the fixed-height card; up to 767 it joins the flow under the text (16px gap, 20px bottom padding) so no label length can reach the tex… |
| 5 | fixed | Current copy already differs from the review. Five-stages caption 「(五个业务阶段)」 (broke 「(五个业务/阶段)」 at 320/390): below 480 it spills into column 2 (negative margin, min-width 0, dot moved to the column end) → one line zh, two lines en (was three). Scenario caption… |
| 6 | fixed | V7-HOME H6 (en): balance on the channel heading, the products heading and the 288 heading; channel title box widened 20px each side from 768 so 'one business context.' (463px) fits its 458px box. |
| 7 | fixed | Overlay menu card 「预约企业 AI 演示」 wrapped at 992-1439 (「预约企业 AI/演示」 now): copy.mjs CHROME line reworded to the site's own CTA 「预约企业演示」 (same line, commented); 企业管理 checked, one line everywhere. Sticky problem heading: copy.mjs line gets <wbr/> word boundaries (工具… |
| 8 | fixed | tools/chrome.mjs zhFullStops(): on zh pages an ASCII '.' that follows a Han character (or a link whose text ends in one) at the end of a text run becomes 「。」 (demo band heading on home, legal line on home/capabilities/enterprise; no other matches site-wide). W… |
| 9 | fixed | tools/chrome.mjs: social link aria-label/title localized per language (发邮件给 STARGO WORK / 通过 WhatsApp 联系 STARGO WORK / STARGO 企业官网); honeypot input label 网站 on zh; new zhRuntimeNames() gives zh pages their own names for what the Webflow runtime would otherwise… |
| 10 | already-fine | No change needed for Chinese: 「同一个工作空间，/连接日常经营。」 at 320/390/1024 and one line at 768/1440/1920 (lead's copy). Not fixable by layout and left: English at 320 reads 'One workspace / for everyday / business.' (a two-line version needs a narrower font or a reword)… |
| 11 | fixed | V7-HOME H11: the photo card head row wraps with a 16px column gap and the label never wraps (moves under the STARGO mark when both do not fit: zh 768, en 768); zh quote gets text-wrap: pretty (en quote too). English form labels balanced. |
| 12 | fixed | V7-HOME H12: below 768 the message textarea is min-height 200px (placeholder text unchanged). Select checked with the nine options. |
| 13 | fixed | The page was at fault: .stargo-contact-page .form-amin kept its 16px padding-inline (written for the old white Mono form) around cinery's padded card, so on phones the form card was 32px narrower than the photo card and fields were 225px at 320. V7-HOME: paddi… |
| 14 | fixed | The current renok switch had no keyboard or ARIA support. New tools/blocks/rk-price-tiers.js (bundled into js/capability-blocks.js): the switch row is a named tablist, 首年价格/续费 are tabs (roving tabindex, aria-selected, aria-controls), the two grids are tabpanel… |
| 15 | fixed | tools/verify-editorial.mjs: the cache-version assertion now checks every local css/js reference carries ?v=<12 hex>; js/stargo-tabs.js is required only on pages with a component it drives (.w-tabs, .pricing-tabs-info-block, .product-sticky-block, .toggle-wrapp… |
| 16 | fixed | Chinese side sentence is split per letter: copy.mjs NOTICES.relatedIntro gets a <br/> after 'STARGO WORK' (same line, commented) → 「三个入口，看 STARGO WORK/做什么、谁来做、怎样管。」 at 320-1920. Card sentences (plain text): zh keep-all (+ overflow-wrap anywhere, sizes unchange… |
| 17 | fixed | Already fine: zh 「面向制造业与外贸企业的/网页桌面级 AI 企业操作系统。」 at 320-1024; en 'trade.' not alone at 390/1024. Remaining: en 320 'Delegate the work. Keep the / authority.' → V7-HOME H17 makes the second sentence its own balanced block: 'Delegate the work. / Keep the authorit… |
| 18 | fixed | Header (合适/配置, Work/Done + longer paragraph): nothing clips or overlaps at 320-1920, no change made. Tiers head (the new title): renok put the heading beside a 35% column (163px at 768, 170px at 390) → 5-line English title and wrapping switch labels ('First-/y… |
| 19 | fixed | Scanned index, contact, notices, pricing, 404 (zh+en, 320/390/768/1024/1440/1920) with a line-break scanner and an overflow check (no horizontal overflow anywhere). Fixed: homepage en captions/labels/chat bubbles/product tab names/FAQ questions/article titles/… |

Other fixes found by the area scan:

- about.html and en/about.html were missing js/stargo-forms.js and js/stargo-tabs.js. The About builder replaced '</body>' with its two scripts and dropped the tag, so tools/chrome.mjs had nowhere to attach the scripts. Th…
- Chinese pages: English names that the Webflow runtime adds (menu button, form and notice names) are now given in Chinese in the markup (details under issue 9).
- Pricing tiers: the price unit stays on one line and moves under the price, and the tick icons keep their size (details under issue 19).
- Chinese legal line in the demo band (home, capabilities, enterprise): the link texts 使用条款 and 隐私政策 no longer break inside.

## Appendix B — independent review of the merged candidate

Five reviewers (four in the browser at 390/768/1440 zh+en, one wording and claims auditor) reported 64 defects; each was reproduced by a separate verifier: 61 confirmed, 3 not reproduced.

| Key | Severity | Page | Problem |
|---|---|---|---|
| rev-words:1 (not reproduced) | major | capabilities.html (catalogue groups 01, 02, 03, 04, 05, 07, … | Visible register entry titles are internal module names that the wording rules ban outside the notices page: 'Quote Studio', 'Trade Execution', 'Capability Center', 'Audit Ledger · Agent Evidence · Ac… |
| rev-words:2 | major | capabilities.html (catalogue 'Register entries' / 目录条目) | The zh register shows direct translations of the banned internal names: 报价工作室 (Quote Studio), 贸易执行引擎 (Trade Execution engine), 能力中心 (Capability Center, twice), 审计台账 (Audit Ledger). The owner's rules f… |
| rev-words:3 | major | capabilities.html, catalogue groups 02 and 03 'Register entr… | Entry titles name technology brands (Google, which is also a model vendor, plus Reddit, LinkedIn, Facebook and YouTube) as internal module names, e.g. 'Facebook GEO — Reads social demand signals'. The… |
| rev-words:4 | major | terms.html and en/terms.html | The text names product names '（含 STARGO WORK、STARGO OS、Growth OS、Quote Studio 等）' / '(including STARGO WORK, STARGO OS, Growth OS and Quote Studio)'. Quote Studio is an explicitly banned internal name… |
| rev-words:5 | minor | privacy.html and en/privacy.html | Visible text names technology brands 'Cloudflare Pages', 'Cloudflare' and 'Resend'. Only the notices page is exempt, although processor disclosure may be a legal reason, so this needs an owner decisio… |
| rev-words:6 | minor | capabilities.html (#creative-images, #creative-assets, #crea… | In the same creative/video area that now says 一键视频已开放, the phrase '一键编排…持续整合' / 'one-click workflows are being integrated' reads as if the one-click (video) capability were still being built. The en b… |
| rev-words:7 | minor | en/about.html, en/pricing.html, en/capabilities.html | en uses 'agent(s)' where zh says AI 员工 (市场信号 AI 员工, 专属 AI 员工, 人与 AI 员工共用). The site term is 'AI employee', and the blog build bans \bAgents?\b as an implementation word. This is a zh/en wording mismat… |
| rev-words:8 | minor | pricing.html and en/pricing.html | The price reads '联系我们 / 年' / 'Ask us / year', a contact phrase shown as a per-year price. Under 'Renewal' the cards repeat the full first-year deliverables (website pages, SKU image sets, short and AI… |
| rev-words:9 (not reproduced) | minor | index.html vs en/index.html | zh reads '从企业需要的 AI 层级开始。' but en reads 'One system. The right level of support.' Besides the parity mismatch, the en line is the pricing heading that this round retired on pricing.html (now 'Match co… |
| rev-words:10 (not reproduced) | minor | all 20 zh pages (JSON-LD Organization) | JSON-LD strings on zh pages are Latin: addressLocality 'Liuzhou', addressRegion 'Guangxi' (plus 'CN', and 'BusinessApplication'/'Web'/'CNY' schema values on index and blog articles). The visible foote… |
| rev-blog:1 | major | blog.html and all 7 articles (shared header chrome) | From page load, the first 16 Tab presses land on links inside the closed off-canvas menu. Those links are invisible (opacity 0 in .menu-item and .social-menu-wrapper): 首页…EN, 预约企业演示, the three social … |
| rev-blog:2 | major | all blog pages (shared footer chrome) | The footer icons do not match where they lead. The Instagram logo links to the corporate website (aria-label 'STARGO 企业官网'). The X/Twitter logo links to WhatsApp (wa.me, aria-label '通过 WhatsApp 联系 STA… |
| rev-blog:3 | minor | blog/stargo-work-visual-guide (本文目录) | TOC entries break in the middle of a word: '怎样主动把商机找/出来？', '一步步走/向订单？', '怎样管/起来？', '复制别人的视/频吗？', '自己决定一/切吗？'. At 768, entry 05 breaks as '后台接得/住吗？'. The <wbr> hints do not stop the browser from breaki… |
| rev-blog:4 | minor | blog/stargo-work-visual-guide (Figures 2, 6, 9 and closing C… | Chinese words in chart text break across lines. Guide Figure 2 step cards: '交/期' and '翻/译' at 1440 and 768; '起/草' and '保留人工接/管' at 390; '批发/商' and '供/应商' at 320. Figure 9 '现已可用' list: '并行处理、汇/总交付' at … |
| rev-blog:5 | minor | en/blog/stargo-work-visual-guide, en/blog/ai-operating-syste… | Chart card titles leave a single word alone on the last line. Figure 9 status titles: 'Connected and validated one by / one' and 'Foundations in place, enabled by / configuration' (390, 768). Figure 2… |
| rev-blog:6 | minor | en/blog/stargo-work-visual-guide (IN THIS GUIDE) | 7 of the 16 TOC entries end with one word alone on the second line at 1440: 'proactively?', 'controlled?', 'videos?', 'cover?', 'company?', 'everything?', 'workspace?'. Similar orphans appear at 390 a… |
| rev-blog:7 | minor | index.html and en/index.html — 最新文章 / Latest articles | Card content is bottom-aligned, so when titles wrap to different line counts the images in one row start at different heights (about 25px apart). zh 1440: card 2 (one-line title) sits lower than cards… |
| rev-blog:8 | minor | blog/stargo-work-visual-guide, en/blog/stargo-work-visual-gu… | Chart rows wrap untidily. Arrow chains break so an arrow starts the next line: Figure 2 '之后的业务链' ends with '→ 复购' alone at 390; Figure 3 steps show '→ 04 画面' and '→ 07 导出' (390) and '→ 06 Captions' (7… |
| rev-blog:9 | minor | blog.html and all zh articles (shared footer) | The heading breaks as '产品进展第一 / 时间通知你。', splitting the set phrase 第一时间. |
| rev-blog:10 | minor | en/blog/stargo-work-visual-guide | The H1 breaks as 'STARGO WORK, explained: one / system from acquisition to operations'. 'one system' is split, leaving 'one' dangling at the end of line 1. At 390 it breaks cleanly ('explained: one sy… |
| rev-blog:11 | minor | all 7 zh articles; en/blog/stargo-work-visual-guide | The byline wraps inside the author name: zh shows '… · STARGO WORK / 团队 · 查看全部文章', and en at 320 shows '… · The / STARGO WORK team · View All Articles'. |
| rev-blog:12 | minor | en/blog/stargo-work-visual-guide ('How are quotes, PIs and t… | The English is clumsy. The guide says 'invoices, packing lists, origin and Form E materials and bills of lading': 'origin' on its own does not mean a certificate of origin, and the list has two 'and's… |
| rev-cap:1 | major | capabilities.html#story-5 (creative accordion #creative-imag… | A tap or click inside an open answer, including a drag to select text, collapses the row. The answer (454–758px tall) disappears under the reader, and its text cannot be selected. The catalogue rows #… |
| rev-cap:2 | major | en/capabilities.html #g02, #g03, #g04 (catalogue register en… | The English entries show third-party technology brand names: 'Google Maps Dealer Discovery' (g02); 'Reddit GEO', 'Google Search GEO', 'LinkedIn Outreach', 'Facebook GEO', 'Alibaba Inquiry', 'YouTube G… |
| rev-cap:3 | minor | capabilities.html closing block (#start FAQ) | Button 01 wraps as '它和单独使用一个 AI 聊天窗口有什么区 / 别？': the word 区别 is split and one character is left alone on the last line. Button 02 wraps as '现有 CRM、ERP、邮箱和网盘都要换掉 / 吗？': one character alone on the last l… |
| rev-cap:4 | minor | capabilities.html closing block (#start FAQ) | The label wraps as '(常见问 / 题)' at 320, splitting 问题 and leaving one character on the last line, and as '(常见问题 / )' at 360, leaving the bracket alone on the second line. |
| rev-cap:5 | minor | capabilities.html, bottom of #story-5 → top of #story-6 | A white stripe 64–128px tall shows between two dark sections. The 128px (64px at 390) bottom margin of .cn-call-to-action leaks out of its black .cn-produce wrapper, so the white page background shows… |
| rev-cap:6 | minor | capabilities.html #loop section | The line boxes overlap: at 1440, 一条业务 spans 250–466px and 主线 spans 439–655px (27px overlap). The lower strokes of 条/业 collide with the tops of 主/线, and the top of the italic '/' touches the bottom of … |
| rev-cap:7 | minor | en/capabilities.html #story-2 | The card title wraps as 'Buyer Requirement / Extraction', leaving a single word on the last line. |
| rev-cap:8 | minor | en/capabilities.html #story-4 | The card title wraps as 'Orders & / payment / milestones', leaving a single word on the last line. |
| rev-cap:9 | minor | en/capabilities.html four-board cards (under the hero) | Two card titles leave a single word on the last line: 'Customers & / knowledge' and 'Workforce & / management'. |
| rev-cap:10 | minor | en/capabilities.html #atlas and #story-5 | Several headings leave a single word on the last line: '02 Customer / Acquisition & / Opportunity / Research', '04 Inquiries / & Customer / Conversations', '06 Products / & Enterprise / Knowledge', '0… |
| rev-cap:11 | minor | en/capabilities.html #foundations | The left half 'What every' stacks as 'What / every', so each line holds one word and the last line is a single word ('every'). |
| rev-home:1 | major | index.html (five business stages section: 五个业务阶段 / Five busi… | Stage 001 keeps its initial highlighted state until the page scrolls down through it. If the visitor reaches the section from below (End key, reload or back navigation to a lower position) and scrolls… |
| rev-home:2 | major | index.html, en/pricing.html (same site header on every page) | Keyboard access is broken on desktop in three ways. (1) The first 16 Tab stops land on the links of the closed, invisible side menu (首页…博客, EN, 预约企业演示, the 3 social links, 隐私政策, 使用条款), so no focus ind… |
| rev-home:3 | major | en/404.html | Every nav label is clipped on the left and reads 'ntelligence', 'apabilities', 'l Workforce', 'nterprise', 'ontact', 'ricing', 'bout', 'log' and a cut-off '中文'. The link boxes (overflow:hidden) are na… |
| rev-home:4 | major | 404.html, en/404.html | The footer tagline (面向制造业与外贸企业的网页桌面级 AI 企业操作系统。把工作交给 AI，把决定权留在企业。 / 'A browser-based desktop AI operating system…') never becomes visible. It is in view on load (top 415px), but its split lines stay a… |
| rev-home:5 | major | All pages (footer), also the desktop side menu | The icons do not match their links or labels. An Instagram glyph links to www.stargomoto.com (aria 'STARGO 企业官网'). An X/Twitter glyph links to WhatsApp (aria '通过 WhatsApp 联系 STARGO WORK'). A third-par… |
| rev-home:6 | major | index.html | A Chinese word is split across lines in this heading. At 1440 and 768 line 2 ends with '订' and line 3 starts with '单交付' (订单 is split). At 390 line 2 ends with '订单交' and line 3 starts with '付' (交付 is s… |
| rev-home:7 | minor | index.html | The rotating two-character words render with a visible gap between the characters ('报 价。', '履 约。', '复 购。'), so each word looks split. The preceding '再推进到' is set tight. The gap comes from the runtime … |
| rev-home:8 | minor | pricing.html | Words are split in titles and labels. '多公司、多品 / 牌怎么办？' splits 品牌. '模型费用包 / 含在内吗？' splits 包含. The label 按工具计价 is squeezed into three lines, '按工 / 具计 / 价', which splits 工具 and leaves 价 alone on the last… |
| rev-home:9 | minor | pricing.html | The cell wraps as '中英文 + 3 个语 / 种', leaving 种 alone and splitting 语种. Row labels also split words, for example '12 个月云端工作 / 台，最多 5 个标 / 准用户账号' (工作台, 标准) and '首次导入企业知 / 识…' (知识). |
| rev-home:10 | minor | en/index.html | The button text wraps to two lines, leaving the single word 'workflow' on the last line. |
| rev-home:11 | minor | en/index.html | The label wraps as '(how work / moves)', leaving 'moves)' alone on the second line. The same label in the 'By hand' card stays on one line. |
| rev-home:12 | minor | en/index.html, en/pricing.html | A single word ends up alone on the last line. On en/index: contact H2 'Request a / Demo.' and journey heading 'Understand / needs.' (from line measurement). On en/pricing FAQ titles: 'Are the 288 / AI… |
| rev-home:13 | minor | index.html | After the link glides to the section, the section top sits 100px above the viewport. The eyebrow label (为制造业与外贸企业而建) / '(For manufacturing & global trade)' is cut off at the top (badge top −23px in en… |
| rev-home:14 | minor | en/notices.html | The brand name is split across lines: 'Three places to see what STARGO / WORK does, who does the / work and how it is managed.' |
| rev-home:15 | minor | index.html (hero), pricing.html (footer note) | A short word is left alone on the last line of body text. The hero lead ends '…关键决定由企业 / 掌握。' (4 full lines, then 掌握。 alone). The footer note ends '…处理你的 / 申请。'. This is body text, not a heading, but … |
| rev-home:16 | minor | en/index.html (and the English side menu on all English page… | Capitalization is inconsistent. The CTA reads 'Request A Demo' while every other instance is 'Request a Demo', and the side menu shows 'Terms Of Use' while the footer says 'Terms'. |
| rev-lx:1 | major | intelligence.html | The phone screen on the Chinese page shows readable English template UI: 'Your wall collection', 'An online account that means business', 'Easy day-to-day bank', 'Dancing for you / Views 125.5M'. It a… |
| rev-lx:2 | major | intelligence.html | The English phone screens are template mock-ups with content that is not allowed or makes no sense here, and it is readable at 1440 and in the 390 landing view. The chat reads 'I commented on Figma…' … |
| rev-lx:3 | major | intelligence.html | At tablet widths the paragraph runs under the dark photo of the woman on the right, which is on top of it, so the ends of lines cannot be read. Characters under the photo per render: zh 768 8 (到目 好的 再… |
| rev-lx:4 | minor | about.html | The first sentence stays whole, but the rest of the card text still breaks words across lines: 结/束 at 1024-1920 (including 1440); 需/要 at 390; 经/营 at 430 and 768; 回/复, 资/料, 订/单, 工/作 at 360; 一/次, 组/织, 生… |
| rev-lx:5 | minor | workforce.html, intelligence.html, enterprise.html, about.ht… | The heading breaks as 产品进展第一 / 时间通知你。, which splits the word 第一时间. |
| rev-lx:6 | minor | intelligence.html | As each card shrinks, its text slides up past the card's top edge and lines are cut through the middle. Examples: the top half of 客户、产品、报价、订单 at 1440 (scroll 1708), 互不相干的记录。 at 390 (scroll 1429), 用真实样… |
| rev-lx:7 | minor | enterprise.html | Panels 1-3 stay readable for about 500px of scroll each. The fourth panel's heading and text fade to opacity 0 almost as soon as they arrive: at 1440 zh, opacity is 1 at scroll 2460 and 0.38 at 2597, … |
| rev-lx:8 | minor | intelligence.html | Single English words are left alone on the last line. 'Observe the / workflow' (320, 390). 'Leads and / deadlines, / not left to / memory.' (320). 'Keep useful / methods.' and 'Withdraw / ineffective … |
| rev-lx:9 | minor | intelligence.html | The side card is too narrow, so its title reads 'Resume the / task / without / rebuilding / the context.', mostly one word per line. The button wraps to 'Meet the AI / Workforce', leaving one word on … |
| rev-lx:10 | minor | workforce.html | The heading breaks unevenly: 'A shared goal, / connected / work and a / coherent result.' puts one word on the second line and ends a line on 'a'. The pink card stretches to the height of the text col… |
| rev-lx:11 | minor | about.html | Card titles leave one word on the last line or split a word. 320-390: 'Market / Signal / Agent', 'Quote / Agent', 'Coordinator / Agent'. 320-360: 'Follow- / up Agent', a hyphen break. 992-1100: 'Marke… |
| rev-lx:12 | minor | about.html | The titles break as '报价 AI / 员工', '跟进 AI / 员工' and '统筹 AI / 员工', which separates the term AI 员工. The first card keeps it whole ('市场信号 / AI 员工'), and the LX commit says role names keep AI 员工 together. … |
| rev-lx:13 | minor | about.html | When a keyboard user tabs to the arrows, nothing shows which one has focus: outline is none/0px, there is no box-shadow, and the background does not change. The arrows do work with Enter. |
| rev-lx:14 | minor | enterprise.html | Card titles leave single words on lines: 'Capability & app / management' at 320, and 'Account / connection / & protection' at 320 and 768. |
| rev-lx:15 | minor | about.html | The card shows five social-network brand logos (Instagram, X, LinkedIn, YouTube, Facebook). All five link to contact.html, and each has the accessible name 'Contact' / '联系'. The brand logos are visibl… |

## Appendix C — round 2: the confirmed defects (per area)

### V7-BLOG (blog articles, blog charts, homepage Latest articles cards)

Branch v7/BLOG, head b74362f.

| Key | Status | Change |
|---|---|---|
| rev-blog:3 | fixed | Previous agent: the contents-list items (.sgp-toc li) are keep-all with overflow-wrap:anywhere on zh and balanced in both languages (css/stargo-fusion.css, V7-BLOG block). |
| rev-blog:4 | fixed | Previous agent: zh keep-all on .sgc-step-title/.sgc-step-text/.sgc-example span/.sgc-status li/.sgc-handoff-text/.sgc-lane-title/.sgp-cta, with 「/」 break marks in blog.mjs where a phrase is wider than its narrowest card (a new build-time CARD_PHRASES check) an… |
| rev-blog:5 | fixed | Previous agent: text-wrap:balance on .sgc-step-title/.sgc-status-title/.sgc-lane-title/.sgc-bar-name/.sgc-frame-beat and balance on English card lines; the en five-card loop runs 3+2 from a 600px container; the en storyboard beats are 2x2 from 560px; 'Spot evi… |
| rev-blog:6 | fixed | Previous agent: the .sgp-toc li balance rule (same rule as rev-blog:3). |
| rev-blog:7 | fixed | Previous agent: .blog-grid .blog-wrapper { justify-content: flex-start; } in the V7-BLOG block. It applies only on index.html and en/index.html; checked that no other page uses .blog-grid. |
| rev-blog:8 | fixed | Previous agent: the video steps are a grid of 2/3/4/7 columns by container width and language, the last step fills its row, and no arrow starts a row. When a chain does not fit, its last two boxes move to a second row (3/2 for the business chain; 2/2 for the r… |
| rev-blog:10 | fixed | The previous agent put a no-break space in the English title ('one system'), but the H1 still broke 'one / system' at 1280–1920: GSAP SplitText's line split ignores the no-break space. I changed titleHtml in tools/blog.mjs so that English words joined by a no-… |
| rev-blog:11 | fixed | Previous agent: build-site.mjs wraps the byline in <span class="lx-post-by">, and CSS gives time and .lx-post-by white-space:nowrap. |
| rev-blog:12 | fixed | Previous agent, in tools/blog.mjs. Guide: 'Contract clause checks run on the same chain, together with the preparation and filing of commercial invoices, packing lists, certificates of origin and Form E materials, and bills of lading.' Sales Desk article: 'Com… |
| rev-words:6 | fixed | Blog part (previous agent): zh Figure 9 reads 「商品营销套件的一键编排与局部检查」 and en 'One-click marketing-kit production and local checks'. The zh/en availability line of the guide's AI images section and the zh/en OS article list use the same wording. This matches the v7/… |

### CAP (capabilities page and catalogue copy)

Branch v7/CAP, head b15508c.

| Key | Status | Change |
|---|---|---|
| rev-cap:1 | fixed | Previous agent: tools/blocks/cn-faq.js stops a click inside the answer from reaching the row (wrap click stopPropagation, the same guard the catalogue uses), and js/capability-blocks.js was regenerated. I checked it and did not change it. The plus control and … |
| rev-cap:2 | fixed | Previous agent replaced the brand names with hyphenated stand-ins ('Community-forum GEO', 'Search-engine GEO', 'Map-listing Dealer Discovery', 'Marketplace Inquiry Intake'...). I changed the English names to say what the Chinese names say: Map-Based Dealer Dis… |
| rev-cap:3 | fixed | Previous agent: the zh #start questions are built with zhKeepWords (.zh-keep nowrap spans). I added one step in tools/build-site.mjs: a question ending in a one- or two-character word keeps the word before it, so 「…都能直接 / 用吗？」 at 320-360 now reads 「…都能 / 直接用吗？… |
| rev-cap:4 | fixed | Previous agent: css/stargo-fusion.css V7-CAP item 6, `html[lang^=zh] #start .bottom-grid._1.grd > .top-text.big { white-space: nowrap }`. The #start id exists only on the capabilities pages. |
| rev-cap:5 | fixed | Previous agent: `#story-5 + .cn-produce { display: flow-root }`. That fixed 768 and up but not phones: under 480px the white band was still 60px, because the donor gives #story-6 > .qx-home-project-section margin-top: 60px, which used to collapse into the marq… |
| rev-cap:6 | fixed | Previous agent, zh only: .rk-award .rk-rt-extra-big-text gets line-height max(1.06em, 1em + 4px), and the second and third lines get margin-top 0. .rk-award exists only on the capabilities pages. |
| rev-cap:7 | fixed | Previous agent: in the CAP_V6A sales rows, the English titles 'Unified Inquiry Intake' became 'Inquiry Intake' and 'Buyer Requirement Extraction' became 'Buyer Needs'. The row keys stay. I kept 'Buyer Needs' because 'Buyer Requirements' (220px) would break as … |
| rev-cap:8 | fixed | Previous agent: the en #story-4 title 'Orders & payment milestones' became 'Orders, deposits & balances'. The card text already lists deposits and balances. zh 订单与付款节点 is unchanged. |
| rev-cap:9 | fixed | Previous agent: CAPABILITIES.macro English names 'Customers & knowledge' and 'Workforce & management'. These names are used only on en/capabilities. |
| rev-cap:10 | fixed | Previous agent: css/stargo-fusion.css item 9, English only, under 375px: .cn-capmap and #story-5 accordion headings use font-size clamp(1rem, 8.2vw - 10.5px, 1.25rem), so 16px at 320 rising to 20px at 372. |
| rev-cap:11 | fixed | Previous agent: css/stargo-fusion.css item 10, English only, 479px and below: the two halves of the split heading use font-size min(32px, 7vw - 3.1px) with white-space: nowrap. |
| rev-words:2 | fixed | Previous agent renamed these in CAPABILITY_GROUPS, SHOWCASE picks, CAP_V6A and qx-news PICKS. zh: 报价中心, 外贸履约跟进, 登录凭据保管, 关键动作审批, 能力与应用管理, 操作记录 · AI 员工证据 · 动作历史 (the enterprise page's M15-06 wording). en: Quotation Center, PI Center, Trade Fulfillment Follow-up,… |
| rev-words:3 | fixed | Same fix as rev-cap:2. The English names now say what the neutral Chinese ones say, and the Alibaba entries use the channel name Alibaba.com / 阿里国际站 in both languages. |
| rev-words:6 | fixed | Capabilities and copy part only. The previous agent tied 'one-click' to marketing kits, but it also raised the creative workspace status from 已有基础 / 'is present' to 已开放 / 'is available'. The blog's Figure 9 lists the creative workspace under 已有基础，按企业配置启用, and … |
| rev-words:7 | fixed | Capabilities part only. Previous agent changed the register glosses and the #g01 lede 'busy AI agents' to 'AI employee(s)'. The About tiles and pricing's 'dedicated agents' are outside this area and were left alone; the pricing entitlement line was not touched… |

### V7-HOME (homepage, site chrome and side menu, 404, notices, pricing, terms) round 2, conti…

Branch v7/HOME, head 04ec70e.

| Key | Status | Change |
|---|---|---|
| rev-home:1 | fixed | Previous agent: js/stargo-ix-arrival.js got a guard. Once the middle of the screen is below stage 001, it writes the same instant out-of-view values that Webflow writes (title opacity 0.12, media 0). It runs on scroll, resize, pageshow, load, and again at 400m… |
| rev-home:2 | fixed | Previous agent: tools/chrome.mjs sideMenu() ships the menu and the close button as inert. The trigger becomes role=button, tabindex=0, aria-label 菜单/Menu, aria-expanded and aria-controls; the close button is named 关闭菜单/Close menu. New js/stargo-side-menu.js ha… |
| rev-home:3 | fixed | Previous agent: in css/stargo-fusion.css (V7-HOME), the .navigation-top header rules (flex-shrink 0, 1fr auto 1fr grid, smaller English label sizes from 992 to 1439) are repeated for the 404 page's .absolute-element header. |
| rev-home:4 | fixed | Previous agent: below 992px, .utility-page-wrap gets min-height 100vh/100svh, so the 404 footer starts below the fold and its tagline reveal fires on scroll. |
| rev-home:5 | fixed | Previous agent: tools/chrome.mjs socialIcons() replaces the Instagram, X and contra images in every .social-wrapper (footer and side menu) with inline SVG line glyphs picked from the link: globe for the corporate site, speech bubble for wa.me, envelope for mai… |
| rev-home:6 | fixed | Previous agent: tools/build-site.mjs wraps each word of the (从哪里开始？) heading in .zh-keep on the zh homepage, and CSS H20 sets html[lang^=zh] :is(#compare,.footer) .zh-keep to nowrap. |
| rev-home:7 | fixed | Previous agent: CSS H24 sets the zh hero rotating word (.hero-title-changeing-word) to display:flex, so the whitespace node the split inserts is not drawn. |
| rev-home:8 | fixed | Previous agent: the zh pricing FAQ questions get <wbr> word marks (zhWbr, with ¥ kept on its figure) and CSS H22 sets keep-all on them. The struck 按工具计价 row may wrap as a whole above the price, with nowrap on the label and on '/ 年'. |
| rev-home:9 | fixed | Previous agent: tools/blocks/rk-price-compare.mjs writes zh labels and values with zhWbr <wbr> marks, and its own contract checks now strip <wbr>. CSS H23 sets keep-all plus overflow-wrap:anywhere as a fallback. English output is unchanged. |
| rev-home:10 | fixed | Previous agent: CSS H25 puts the button in columns 3/5 from 480 to 991 and on its own row below 480 (en). REGRESSION FOUND in that change. It kept the template's grid row, so from 480 to 767 the second dot (.hide-crc) dropped to a second line under the caption… |
| rev-home:11 | fixed | Previous agent: the English label '(how work moves)' became '(workflow)' (tools/copy.mjs HOME_MONO, the verifier's recommended wording). zh (工作方式) is unchanged; both cards use the label. |
| rev-home:12 | fixed | Previous agent: English demo heading and journey title now step down in size with the screen (H25). Below 340px the pricing FAQ list inset goes to 0, making the question column 194px (H22). Comparison-table plan names are centred in their tag (H23). |
| rev-home:13 | fixed | Previous agent: tools/build-site.mjs gives the five #loop links (看业务主线 / See the business flow and the four work cards) data-stargo-anchor and loads js/stargo-anchor-glide.js, the per-frame live-measured glide already used on intelligence. The build asserts ex… |
| rev-home:14 | fixed | NOT FIXED by the previous agent: its STARGO&nbsp;WORK in tools/copy.mjs did not survive, because the line reveal (GSAP SplitText) re-splits on every space, no-break space included, so it still read 'what STARGO / WORK does'. This round: the en relatedIntro wra… |
| rev-home:15 | fixed | Previous agent: CSS H22 sets text-wrap: pretty on the zh footer consent note (.stargo-form-consent), which the pricing page had been left out of. The hero-lead half was left unchanged. The verifier judged it not a defect: it is body text, the last line holds t… |
| rev-home:16 | fixed | Previous agent: CSS H25 sets html[lang^=en] .button-text.w-variant-83ed8c83… to text-transform:none. tools/copy.mjs CHROME changes the en side-menu legal link to 'Terms' and the menu card to 'Book a Demo', matching the footer. |
| rev-blog:1 | fixed | Same fix as rev-home:2 (shared chrome: inert closed menu, keyboard-operable named trigger, Escape and close return focus). |
| rev-blog:2 | fixed | Same fix as rev-home:5 (destination glyphs on all 40 pages, round tiles, localized names), now drawn with the About card's paths. |
| rev-blog:9 | fixed | Previous agent: in tools/copy.mjs CHROME, the zh newsletter heading is three .zh-keep phrases (产品进展 / 第一时间 / 通知你。), and CSS H20 makes .footer .zh-keep nowrap. The heading stays on one line where it fits and otherwise breaks between phrases. |
| rev-lx:5 | fixed | Same shared-footer fix as rev-blog:9. |
| rev-words:4 | fixed | Previous agent: removed only 'Quote Studio' from the product-name list in the terms legal text (tools/copy.mjs LEGAL). zh reads （含 STARGO WORK、STARGO OS、Growth OS 等）; en reads (including STARGO WORK, STARGO OS and Growth OS). Nothing else in the legal text cha… |
| rev-words:8 | needs-owner | Display part fixed by the previous agent: when a renewal is quoted ('ask'), tools/blocks/rk-price-tiers.mjs (and the matching path in tools/build-site.mjs) writes no '/ 年' or '/ year' unit, so 联系我们 / Ask us no longer reads as a yearly price. Prices, plans and … |

Regressions of the interrupted first attempt, fixed in this round:

- Previous agent, css/stargo-fusion.css H25 (rev-home:10): moving the 'Discuss your workflow' button to grid-column 3/5 kept the template's row, so from 480 to 767 the second dot of the five-stages row dropped to a stray s…
- Previous agent, tools/copy.mjs (rev-home:14): the STARGO&nbsp;WORK change had no effect, because the line reveal re-splits on no-break spaces, so the brand name still split. Fixed in 04ec70e with a .sgp-nobr span and CSS…
- Previous agent, tools/chrome.mjs (rev-home:5): the new footer and side-menu glyphs did not match the V7-LX About card's glyphs (bubble with three dots; different globe and envelope geometry). Aligned to the LX paths in 0…

### V7-LX (workforce, intelligence, enterprise, about)

Branch v7/LX, head 4c01549.

| Key | Status | Change |
|---|---|---|
| rev-lx:1 | fixed | Previous agent (fcc3738): on both intelligence pages build-site.mjs lxPage places a copy of the existing text-free MOBILE.core art over the hand-held phone's screen. It is a sibling layer with the photo's class and inline transform, so IX2 moves it with the ph… |
| rev-lx:2 | fixed | Previous agent (fcc3738): the four-screen swap (MOBILE.inquiry/approvals/agents/core, alt="") in lxPage now also runs on the English page, not only Chinese. The comment was updated. Note: this departs from the owner's 2026-09-06 keep-template-imagery decision,… |
| rev-lx:3 | fixed | Previous agent (35d7bd2): from 768 to 1439 the closing card's logo and paragraph row is max-width 85%, and 88% from 1440. The STARGO WORK label stays on one line and is 2.25rem at 768-879. The Chinese paragraph breaks only between words (<wbr> + keep-all). I m… |
| rev-lx:4 | fixed | Previous agent (83330dd): cn-about.mjs wraps each word of the Chinese intro body in .stargo-keep (lib-html zhKeep), with STARGO WORK and 报价单后 kept as single units. I also keep the product term 数字员工 whole; it split as 「数字」/「员工。」 at 320. |
| rev-lx:6 | fixed | V7-LX CSS: the flexible-gap rule now applies at every width, not just below 768, scoped to #lx-ontology. Each card's content is a column-reverse wrapping flex container that fills the card, with the icon row first (order -1), space-between and a 1.5rem gap. Wh… |
| rev-lx:7 | fixed | V7-LX CSS: `.sutdio-animation .studio-sticky .h2.for-abt.d04, .top-text.for-abt.t04 { opacity: 1 !important }` cancels only the template's exit fade (IX3 t-255c7997 at position 1.0, inline opacity on the h2/p). The entrance on the split lines, the slide and th… |
| rev-lx:8 | fixed | build-site.mjs: new enGlue(text, lang) puts a no-break space before the last word of the four gradient headings, bigText, ctaTitle and ctaSub on the English page only. V7-LX CSS for English only: the closing-card lines follow their column where "ineffective ch… |
| rev-lx:9 | fixed | V7-LX CSS for English only: the team side-card h4 is min(2rem, 3.97vw-8.8px) at 768-1023, and the secondary button in the team section has 1rem side padding at 768-991. |
| rev-lx:10 | fixed | V7-LX CSS, scoped with .lx-feature-grid:has(.lx-v6-team-title) (workforce only): at 768-991 the grid stacks into one column, as the template does below 768. At 992-1279 the card is height:auto and vertically centred beside the text column. |
| rev-lx:11 | fixed | Previous agent (24fe5bc): the pill grid is minmax(0,1fr) auto and the empty donor slots are hidden. The English label keeps its last two words in a nowrap span. The review attribution is text-wrap: balance on the English page. |
| rev-lx:12 | fixed | Previous agent (24fe5bc): the Chinese tile label wraps its ending in <span class="stargo-keep">AI 员工</span>, and the pill uses its full width. |
| rev-lx:13 | fixed | Previous agent (24fe5bc): the .cn-about-reviews and .cn-reviews slider arrows get a :focus-visible outline of 2px solid #e8823a, offset -3px, radius 16px. |
| rev-lx:14 | fixed | copy.mjs: the English name 'Account connection & protection' is now 'Linked accounts & protection'; the Chinese 账号连接与保护 is unchanged. No verifier or other copy references the old string. V7-LX CSS for English: the five titles are min(1.2rem, 6.08vw-0.9px) belo… |
| rev-lx:15 | fixed | Previous agent (83330dd): cn-about.mjs keeps three of the five donor links and points them at the footer's real channels from C.CONTACT_INFO: the website (globe), WhatsApp (speech bubble) and email (envelope). Each gets aria-label/title in the page language; t… |
| rev-words:7 | fixed | About part only. Previous agent (24fe5bc): the English tile names changed from 'Market Signal Agent / Quote Agent / Follow-up Agent / Coordinator Agent' to 'Market Signal AI / Quotation AI / Follow-up AI / Coordination AI'. This follows the workforce page's co… |

## Appendix D — last small fixes (commit fbe47b5)

| # | Status | Change |
|---|---|---|
| 1 | fixed | Went with the lighter option: removed the dead icon and gave phones back the mobile menu. The cause was in tools/chrome.mjs overlayMenu(): on a page with no side menu (only 404.html and en/404.html), it deleted the header's Webflow menu button and left the icon that opens nothing. It now does the opposite. It removes t… |
| 2 | fixed | Cause: at 768-991, `1fr` grows to fit content. ¥40,000 at 30px is 111px of text in a 99px column at 768, so the price row alone widened its plan columns. V7-HOME H28 (768-991 only): every row now uses the same columns, minmax(0,1.2fr) repeat(5, minmax(0,1fr)), which content cannot push. Each price cell is a size contai… |
| 3 | fixed | Cause: role cards were laid out at a 9rem minimum, which fits Chinese but not English. Fix in V7-BLOG, English only, below 640px of chart width: cards are never narrower than 11rem, capped at two columns (one column at 320-430, two at 480, 600 and 1024), and the lead card (Review and coordination) spans the row as it a… |

Independent verification: allGood = true; problems: none.

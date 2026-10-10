# V6 content integration — implementation record (2026-09-16/17)

**State: local candidate only. Not pushed, not merged, not deployed.**

| | |
|---|---|
| Branch | `content/v6-placement` (git worktree `F:\stargo 网站\stargo-site-v6`) |
| Base | `snapshot/live-1b37439f` (`f2b6496`) — the working tree that is live as `1b37439f.stargo.pages.dev`, committed without touching the main checkout |
| Area branches (merged) | `v6/A` … `v6/G` |
| Sources | `STARGO_WORK_Website_Content_CN_EN_V5.md` (content), `STARGO_WORK_Live_Site_Placement_Plan_V6.md` (placement; wins on homepage placement and explicit replacement copy) |
| Build | `npm run build` (mirror-donor-assets → capability-donors → fuse-ix → build-site), 38 pages |

## How the work was done

1. The lead mapped the homepage, capabilities, workforce, intelligence and enterprise pages to their sources and extracted a 427-item checklist from V5/V6 (every M01–M16 sub-item, H/P/F sections, V6 tables).
2. The lead implemented the homepage, the V5 page titles/descriptions, the V5 P02 names of the fourteen capability groups, and the business-language renaming of register entries that named upstream projects or engineering internals (commits `5fd0f0a`, `44f346e`, `ed03870`).
3. Seven areas were implemented in parallel, each in its own worktree with its own build and browser checks (area A–G below). A usage limit interrupted the first run; the partial work was committed as WIP and continued in place.
4. The seven branches were merged (source files merged cleanly; generated pages were rebuilt).
5. A read-only review (four coverage auditors over M01–M16, four browser reviewers, one link auditor) checked the merged candidate; its findings were verified and fixed by the lead (commit `0b0fb0d` and the commits before it).

## Page-by-page summary

| Page | What changed |
|---|---|
| Home | Product definition in the readable hero intro; five phrases; #loop starts from proactive acquisition (Growth OS → Sales Desk); 288 as a cross-functional role directory; approval example keeps approved / sent / received apart; five business stages; the four product slots are Growth OS / Sales Desk / ERP / AI creative with matching pictures and scope lines; channel band; workspace film line; fragmented-vs-connected comparison; FAQ = F01/F11/F02/F05; four illustrative scenarios; footer statement; title/description. |
| Capabilities | V5 P02 hero and areas; nine steps in business language linked to their groups; #story-1 Growth OS (evidence rule + Sales Desk handoff); #story-2 Sales Desk; #story-3 quotations with steps 01/02/03 (not metrics); #story-4 six ERP & fulfilment themes (document coverage and filing/payment boundary kept; phones now show all six); #story-5 seven creative topics in V6 order with input → work → output → conditions, video and viral adaptation separate (both 建设中), step rows, per-topic ids that open on arrival; #story-6 three teamwork cards; foundations; closing section; #atlas moved onto the complete catalogue; each of #g01–#g14 carries its V5 detail above the register list and opens on arrival; V5 P02 group names. |
| Workforce | 288 specialized roles hero; five example role cards (cross-functional, labelled examples); new ten-role-group block (sums to 288, asserted at build time) at `#lx-role-groups`; team scenario (goal → specialists → exchange → parallel work → checked deliverables → human decision) at `#lx-team`; browser desktop (M14) with its limits. |
| Intelligence | Business framing of knowledge vs relationship map, consistent context, proactive tracking, durable tasks and handoffs, long-term memory and outcome-based improvement (new `#lx-context` section in the page's own styles); P03 cards, steps and availability; no architecture jargon. |
| Enterprise | Owner's management and delivery page: four opening items, owner cockpit, five management components, business connection table, delivery steps, deployment options confirmed per enterprise, availability and boundaries. |
| About / Contact / Blog | V5 P06 intro; V5 P07 headline, body, notes and messages (form fields, option values and submission unchanged); V5 P09 blog heading. |
| Pricing | Prices, levels, inclusions, quantities, renewals, billing footnote, title and hero subtitle unchanged. Changed text: the integration FAQ answer (no implementation names), the training answer (FDE spelled out), the 288 FAQ answer and the 288 line on the price card (role directory, not concurrent), the review band's four scenario lines (shared with the homepage). |
| Notices | The three "keep reading" cards only; legal text unchanged. |
| Site-wide | Footer statement; English nav "Home"; form success/failure messages (no promised response time); page titles/descriptions (pricing excepted). |


## Homepage (index.html, en/index.html) — lead

| Section | Final copy (zh / en) | Source |
|---|---|---|
| Hero introduction `.hero .max-w-left.add-tp` | V6 §4.1 product definition: 「面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动找客户，Sales Desk 推进销售；连接 ERP、AI 创作与 288 个跨部门数字岗位，关键决定由企业掌握。」 / V6 English. Phone variant (`data-mobile-text`): V5 H01 compact form carrying the same definition. | `HOME_MONO` 'No cookie cutter…', `HOME_MOBILE.heroSupport` |
| Five short phrases `.flex-top` | V6: 主动找到目标客户 / 把客户推进到订单 / 让经营接住增长 / 持续生产营销内容 / 让 AI 员工协作 (English per V6 / V5 H02) | `HOME_HERO_LIST` |
| CTAs (hero, #loop, #compare, "where to start") | 预约企业演示 / Request a Demo (V5 H01, H12); destinations unchanged (contact.html) | `HOME_MONO`, `HOME_SC_HERO` |
| Problem band `section.section.gr` | Heading 「工具很多，靠人连接」 / "Many tools, manual handoffs." (V6 §4.2's sentence cut to the old heading's length: the column holds three characters a line at 768–1024); card titles 询盘来了，还要重新整理 / 窗口很多，客户信息分散 / 客户在表格，跟进靠人记 / 订单在后台，销售还在追问 (English from V5 H03, shortened); button 看业务主线 / See the business flow (→ #loop, unchanged) | `HOME_MONO` |
| `#loop` | Caption 为制造业与外贸企业而建 (V5 H01 eyebrow); heading 先找客户，/ 再推进到 [报价。/ 履约。/ 复购。] (V6 §4.3 title on the rotating-word component, V5 H04 stages); V6 paragraph + overall availability note 「核心流程持续完善，按企业配置与交付范围分阶段开放。」 (phone variant too); floating cards Growth OS · 主动发现并判断客户, Sales Desk · 确认后的客户继续推进, 报价与 PI · Sales Desk 的商务环节, ERP 与履约, AI 创作, 数字员工 | `HOME_SC_HERO`, `HOME_MOBILE.scHero` |
| 288 section | Caption (288 个数字岗位 · 非同时运行); heading 288 个数字岗位，不只服务外贸。 / 288 specialized AI roles. Across the enterprise.; counter 288 个专业数字岗位 覆盖 十类企业职能, label (按任务组队); approval card (V5 H08, cut to the template's line lengths): AI 准备工作，/ 由你批准决定。 (决定权始终在人) 批准≠已发送；/ 提交≠已完成。 — en AI prepares. / You decide. Approved ≠ sent. / Submitted ≠ done.; chat: 报价草稿已整理 → 条款超出规则，依据已附上 → 请有权人确认 → 批准此版本 → 已保留批准版本 → 是否对外发送，另行确认。 labelled 审批流程示意 · 非真实客户事件; button 认识数字员工 / AI Workforce (→ workforce.html, unchanged) | `HOME_MONO` |
| Big-text transition `.animation-section` | 找到客户。理解需求。推进订单。制作内容。协同经营。 (V6 §4.5); caption 一条业务主线 | `HOME_MONO` |
| Five stages `.service-list` | V5 H05: 主动获客 / 外贸销售 / 企业履约 / 回款与服务 / 复购与改进 with V5 descriptions, each with its condition (按授权接入 / 逐项接通与验证 / 按企业系统接入情况逐步连接与验收 ×2 / 主动提醒与长期记忆按阶段完善); caption 五个业务阶段. Pictures for stages 3–5 replaced (visuals below) | `LOOP_LABELS`, `LOOP_DESC`, build-site `scenes` |
| Product slots `section.sc-scope.products` (desktop tabs + phone cards) | V6 §4.7: Growth OS · 主动获客 / Sales Desk · 外贸闭环 / ERP · 企业经营 / AI 创作 · 图片与视频, V6 short copy + each slot's scope line; heading 两大业务引擎，连接经营与创作 (phone 两大引擎，经营与创作); caption 两大引擎 · 两个业务板块. The build asserts 8 panels showing 4 pictures | `HOME_SC_PRODUCTS`, `HOME_MOBILE.products`, build-site `bySystem` |
| Channel band `.sc-scope.integration` | V5 H09 / V6 §4.8: caption 发现客户 · 承接沟通 · 内容传播; heading 渠道可以不同，业务不必断开。 / Different channels, one business context.; paragraph incl. "a listed platform is not default access or full read-and-write permission" | `HOME_SC_INTEGRATION` |
| Workspace film `.video-section` | Centre line 同一个工作空间，连接日常经营。 / One workspace for everyday business. (V6 §4.9; the film stays a brand animation) | `HOME_THEATRE` |
| `#compare` | V5 H10 / V6 §4.10: 分散的做法 vs STARGO WORK, five rows each (获客 / 销售 / 经营 / 内容 / 管理, V6 wording); big words 靠人传 / 连起来; rotating headings 少一些复制粘贴。/ 多一些连续推进。/ 差别在连接。; lede = V5 conclusion (not "hire vs AI"); "where to start" = V5 H12 | `HOME_MONO` |
| FAQ (4) | V6 §4.10: F01 what it is, F11 existing systems, F02 what 288 means (+ configuration, budget and access limits), F05 who decides | `HOME_MONO` |
| Scenario cards `.testimonials-section` | V5 H11 four scenarios (business context, implementation, proactive reminders, improving from outcomes); speaker lines keep 示例场景; caption 四个示例场景 · 非客户评价. Quote marks stay: the pricing and About review bands read these four cards and assert that shape | `HOME_MONO` |
| Footer statement (all pages) | 面向制造业与外贸企业的 / 网页桌面级 AI 企业操作系统。 把工作交给 AI，把决定权留在企业。 (V6 §4.11, V5 G03) | `CHROME` |
| Title / description | V5 part F | `META['index.html']` |
| Unchanged by instruction | Pricing ladder flip cards, enterprise quote card (only "FDE" spelled out in English), blog cards, brand wall | — |

Visuals (homepage):
- Five stages: 003 os-cockpit → os-trade-execution (inspection to dispatch = fulfilment); 004 os-quote-studio → brand-family-01 (trade route to a customer's destination = logistics, collection, service); 005 os-agent-center → brand-loop (observed, reversible feedback path = retain & improve). 001/002 unchanged (os-sales-desk, os-inquiries).
- Product slots: Growth OS os-sales-desk and Sales Desk os-inquiries unchanged; ERP os-quote-studio → brand-family-02 (components, packaging, fulfilment handoff); AI creative os-trade-execution → os-boot (a camera-like precision aperture). All are the site's own AI concept images; their alt text says so.

Layout adjustments (homepage), css/stargo-fusion.css:
- zh `word-break: keep-all; overflow-wrap: anywhere` on the 288 heading and the four problem-card titles (break at the comma).
- zh `text-wrap: pretty` on the hero introduction.
- The film centre line spans the section with a 16px gutter, centred and balanced (Mono positioned it absolutely with no offsets, so the longer line started at the screen edge).
- Headings that GSAP splits per character are written in two equal halves so `text-wrap: balance` breaks at the comma; the footer statement has a forced break after 「企业的」.

## M01–M16 coverage

Status from the post-merge coverage audit (four auditors, built pages, zh and en), with the lead's follow-up fixes noted per topic. "Done" means every sub-item, its outputs and its availability note are readable in both languages at a V6 location; remaining gaps are listed.

| Topic | Status | Where it is placed (zh and en) | Remaining gaps and notes |
|---|---|---|---|
| M01 核心业务全景 | done (after follow-up) | index.html + en/index.html — Hero intro p.top-text.big (desktop), plus a shorter phone version in data-mobile-text<br>index.html + en/index.html — section#loop: heading with rotating word, body text (and its data-mobile-text), cards Growth OS / Sales Desk / 报价与 PI / ERP 与履约 / AI 创作 / 数字员工团队 (M01 summary, H04)<br>index.html + en/index.html — .service-list five stages 001-005 (M01 narrative, M01-01, M01-02, M01-03)<br>index.html + en/index.html — section.sc-scope.products: desktop #core-panel-0..3 and 4 mobile cards (M01-01..04, each with its own scope line)<br>index.html + en/index.html — section.section.with-minus (the 288 block) and #compare FAQ 03 (M01-05)<br>index.html + en/index.html — Stage 005, testimonials-section (four example scenarios) and the #compare 'management' row (M01-06)<br>index.html + en/index.html — #compare two-column block (M01 value and outputs) and FAQ 01 (M01 summary including knowledge)<br>capabilities.html + en/capabilities.html — #start closing block and #atlas #g13 (the only places with the general M01 availability wording); rk-rt-insight nine-step flow<br>enterprise.html + en/enterprise.html — section.section.gr scope paragraph | • The M01 availability note ('核心流程持续完善，产品能力按企业配置与交付范围开放' / 'Core workflows are evolving; availability follows enterprise configuration and agreed delivery scope') is missing from the home mainline (the hero, #loop and FAQ 01), which is where the checklist and V6 §11 place it. The general wording appears only on capabilities #start / #g13 and on enterprise.html.<br>• The M01-06 qualifier ('主动提醒、长期记忆与持续改进逐步扩展') is missing on the homepage. Stage 005 and the '主动提醒' / '从结果改进' scenarios present these capabilities without it; the scenarios carry only the 示例场景 label. The qualifier does appear on intelligence.html #lx-context and capabilities #g14.<br>• M01-05 on the homepage is thinned: the teamwork mechanics (分工、信息交流、并行处理、结果汇总) are missing there, although capabilities #story-6 and workforce.html carry them. The V6 §4.4 short description (the ten-function list plus '按任务选择员工、组成团队，查看成果并批准关键动作') is not in the 288 block; only '覆盖十类企业职能' and FAQ 03 appear.<br>• M01-06 is thinned on the homepage: the manager view shows responsibility, blockers, approvals and results, but not goals or budgets (these are on enterprise.html).<br>• M01-01's enumeration of dealers, importers and wholesalers is missing on the homepage; it is only in #g02. The English stage 001 also drops 'customer types' (zh: 客户类型).<br>• M01-03 is thinned on the homepage: suppliers, warehousing and finance are not named. The English stage 003 drops 'orders' (zh: 订单).<br>• The V5 headline '先找客户，再把生意做完整。' was adapted to the existing rotating-word component; this is acceptable, and the English follows the same pattern.<br>• After the audit: the overall availability note was added to #loop (desktop and phone), every one of the five stages now carries its condition, and stage 005 says proactive reminders and memory are extended in stages. Still thin on the homepage by design: the ten functions are named on the workforce page, not in the 288 block. |
| M02 Growth OS 主动获客 | done | index.html + en/index.html — section.sc-scope.products slot 0 (#core-panel-0 and mobile card 0, identical text); stage 001; #loop card<br>capabilities.html + en/capabilities.html — #story-1 anchor, then section.cn-section-home-service: p.cn-service-lede (summary plus both V6 §5.2 sentences), p.cn-service-lede-note (outputs and availability)<br>capabilities.html + en/capabilities.html — cn-section-home-service: four themes (企业研究 / 贸易情报 / 补货判断 / 关键决策角色), each with a short text<br>capabilities.html + en/capabilities.html — #atlas #g02 accordion: summary, M02-01..06, value line, outputs, availability (the answer expands to readable text at 390 and 1440)<br>capabilities.html + en/capabilities.html — #atlas #g03: research sources vs conversation channels vs publishing platforms, with availability<br>capabilities.html + en/capabilities.html — rk-rt-insight nine-step flow, steps 01-03 | • The V5 headline '把“找客户”，变成有方向的开发。 / Give prospecting a clear direction.' is not used. The #story-1 heading is '主动 获客' / 'Find Leads', which suits the two-word design slot.<br>• The M02 flow graphic (V4_05: product × market × buyer → … → Sales Desk) is not placed. #story-1 and home slot 0 use abstract AI concept images, and the flow exists only as text (the lede and the nine steps).<br>• #story-1 outputs use the V6 override (客户清单、联系人信息、商机简报、开发计划). The full V5 outputs line appears in #g02. |
| M03 Sales Desk 外贸闭环 | done | index.html + en/index.html — section.sc-scope.products slot 1 (desktop panel and mobile card; the 390px card opens without clipping); stage 002; #loop card<br>capabilities.html + en/capabilities.html — #story-2 (qx-news): title, p.qx-body (summary, how the three items serve replies / matching / follow-up / quotes / PI, outputs, availability), three items<br>capabilities.html + en/capabilities.html — #atlas #g04: summary, M03-01, M03-02, M03-04, M03-05, outputs, availability<br>capabilities.html + en/capabilities.html — #atlas #g05: CRM lede, M03-03, M03-06, business-flow line, outputs, availability<br>capabilities.html + en/capabilities.html — #g03 'carry conversations' item (channel names); nine-step flow 04-05<br>index.html + en/index.html — #compare 'sales' row and FAQ 04 (human decision on replies and outreach) | • Headings differ between the languages: zh #story-2 uses the V6 main title 'Sales Desk：把客户聊明白，把订单跟到底', while en uses the compact 'Sales Desk: from customer to order'. The V5 English headline 'Understand the customer. Follow the work through.' is not used anywhere.<br>• The M03 flow graphic (V4_07: channels → CRM → … → order handoff) is not placed. The #story-2 images are abstract AI concept images; the channel-to-handoff chain is carried as text.<br>• The outputs line is split: #g04 lists requirements, product fit, replies and history, and #g05 lists records and history. The full line appears only in #story-2 (in both languages).<br>• The checklist's suggested cross-links (#g04 to #g06, #g05 to #story-3/#g07) are missing; #g04 and #g05 contain no links.<br>• After the audit: the register entry "Automatic Follow-up" is now "Planned Follow-up" (zh 计划内跟进). |
| M04 报价、PI 与商业文件 | done | index.html + en/index.html — #loop card, stage 002, products slot 1 (M04 as a commercial step of Sales Desk, per V6 §4.7 / §11)<br>index.html + en/index.html — section.section.with-minus approval example, and #compare FAQ 04<br>capabilities.html + en/capabilities.html — #story-3 (rk-stats): title, counters that render as 01 / 02 / 03 with labels 按规则起草 / 有权人批准 / 保留正式版本, p.rk-rt-gap-off paragraph (readable at 390 and 1440, no clamp)<br>capabilities.html + en/capabilities.html — #atlas #g07: summary, M04-01..06, value line, outputs, availability<br>capabilities.html + en/capabilities.html — #g06 'product facts behind quotes and replies' item and value line; #story-4 trade-documents theme; nine-step 06 | • The M04 flow graphic (V4_09: draft → approval → approved version) is not placed. The #story-3 image is an abstract concept image ('精密零件的匹配与校验'); the relationship is carried by the 01/02/03 step labels and the paragraph instead.<br>• The #story-3 paragraph does not mention M04-06 (counterparty risk) or e-signature and legal review; both are covered in #g07.<br>• The zh page drops the name 'Quote Studio' (M04-02 is titled 报价中心), as the zh-only rule requires; en keeps 'Quote Studio'. |
| M05 ERP 与商城经营 | done | index.html / en/index.html — section.sc-scope.products slot 2 (#core-panel-2 and the 3rd .products-cards-mobile card; both copies carry the text)<br>index.html / en/index.html — .service-list stage (003); also #loop tag and #compare 'connected' row<br>capabilities.html / en/capabilities.html — #story-4 marquee title (.rk-rt-extra-big-text)<br>capabilities.html / en/capabilities.html — #story-4 cards 1, 2, 6 (desktop .rk-rt-testimonial-card and .rk-rt-mobile-slider copies), links to #g08<br>capabilities.html / en/capabilities.html — #g08 accordion, subhead h3.cn-cat-sub 'ERP 经营' / 'ERP & commerce': lede (M05 summary), six li items M05-01…06, value, outputs, availability<br>capabilities.html / en/capabilities.html — #g08 .cn-cat-value and .cn-out (value line and outputs line)<br>capabilities.html / en/capabilities.html — nine-step band, step 07<br>enterprise.html / en/enterprise.html — #table business-connection row 'ERP 与商城' (under '默认关闭 · 按授权接入') | • V5 in-depth heading 'ERP + 商城：不止是外贸 CRM' / 'ERP and Commerce \| Beyond a Trade CRM' is not used anywhere; #g08 uses the V6 subhead 'ERP 经营' / 'ERP & commerce' instead (allowed by V6 §5.5).<br>• Only #g08 has the full availability wording. The #story-4 card 1 version drops 'AI 操作' (zh), and the en version drops both 'AI actions' and 'configuration'.<br>• There is no V4_11 ERP graphic. The #story-4 cards use abstract metal icons, so M05.narrative (six operating areas) appears only as text: the six #g08 items and the #story-4 cards.<br>• '多币种 / multi-currency', 'BOM 配置关系 / configuration relationships' and 'dealer portals' appear only in #g08 and not in the #story-4 cards. This is acceptable because the cards are the short version.<br>• After the audit: #story-4 card 1 keeps the "AI actions need configuration and validation" condition. |
| M06 履约、回款与复购 | done | index.html / en/index.html — .service-list stages (004) and (005)<br>index.html / en/index.html — .service-list stage (005)<br>index.html / en/index.html — FAQ item 04 (payments and official filings) and the #compare 'connected' row<br>capabilities.html / en/capabilities.html — #story-4 cards 3–6 (desktop and mobile slider)<br>capabilities.html / en/capabilities.html — #story-4 card 4 (trade documents)<br>capabilities.html / en/capabilities.html — #g08 subheads '履约回款' / 'Delivery & collection' (lede + M06-01…04) and '服务复购' / 'Service & repeat business' (M06-05, 06), value, outputs, availability<br>capabilities.html / en/capabilities.html — #g08 .cn-cat-value and .cn-out<br>capabilities.html / en/capabilities.html — #g08 register entries (all 12 original live entries kept) and nine-step band step 08<br>enterprise.html / en/enterprise.html — #table row '财务、物流及其他业务服务' | • M06.narrative is not placed as such in either language. The chain is '订单确认 → 生产与质检 → 发货与单证 → 回款与复购', and the line '销售、财务、物流与客服按各自责任接力' / 'accountable handoffs across sales, finance, logistics and service' does not appear. It is only implied by home stages 003–005, capabilities steps 07/08 and the home #compare row. There is also no staged V4_13 graphic or text.<br>• The V5 visual headline '成交不是终点，交付与回款继续跟' / 'Follow the sale through delivery and collection' is not placed anywhere. Neither is the in-depth heading '从成交继续管到交付与回款' / 'From Signed Business to Delivery, Cash Collection and Retention'. #g08 uses the V6 subheads '履约回款' / '服务复购' instead.<br>• Home stage 004 mentions payment milestones and rebate materials but carries no payment or official-filing qualifier in the same card. The qualifier is in home FAQ 04 on the same page.<br>• After the audit: #story-4 card 4 says official filings are submitted by authorized people and issuance/approval stay with the authorities. |
| M07 AI 作图与品牌内容 | done | index.html / en/index.html — hero short line 4; section.sc-scope.products slot 3 (#core-panel-3 and the 4th .products-cards-mobile card); #compare row '内容'<br>capabilities.html / en/capabilities.html — #story-5 header (.cn-subtitle) + accordion #creative-images (item 1: M07-01, M07-04, outputs)<br>capabilities.html / en/capabilities.html — #creative-images second paragraph (M07-04 brand and product consistency)<br>capabilities.html / en/capabilities.html — #creative-kits (item 4: M07-02, M07-03, value line)<br>capabilities.html / en/capabilities.html — #creative-multilingual (item 5) and #creative-search (item 6): M07-06<br>capabilities.html / en/capabilities.html — #creative-assets (item 7: M07-05)<br>capabilities.html / en/capabilities.html — #g09 subhead 'AI 作图与品牌内容' / 'AI images & brand content': lede (M07 summary), six li items M07-01…06, value, outputs, availability | • The V5 visual headline '一套产品资料，做成一组营销资产' / 'Turn product facts into a coordinated marketing kit' is not placed anywhere. Neither is the in-depth heading '产品资料，变成可用的营销素材' / 'AI Images, Product Marketing Kits and Creative Assets'.<br>• M07.narrative (V4_15: 产品照片与参数 + 品牌资料 + 市场与语言 → 主图 / 场景图 / 卖点海报 / 详情页 / 图册 / 社媒素材) is not placed as a graphic or as a sentence. The #story-5 .cn-faq-image is now assets/stargo-editorial/os-boot.webp, alt '精密金属光圈开启（AI 概念图）' / 'A precision metal aperture opening'. It is a metaphor and does not show the range of creative outputs.<br>• The M07 summary appears only as the #g09 lede. #story-5 has no summary paragraph; its header is the label 'AI 作图、视频与营销内容' plus the words '图片 / 视频'.<br>• SEO / GEO is rendered as '搜索引擎与 AI 搜索' / 'search and AI-search' in #g09 and accordion item 6. The meaning is kept.<br>• After the audit: "SEO · GEO · GEO Trust Content" is now "Search & AI-search Content". |
| M08 AI 一键生成视频 | done | index.html / en/index.html — section.sc-scope.products slot 3 body and scope line (desktop panel and mobile card)<br>capabilities.html / en/capabilities.html — #creative-video (accordion item 2): li.cn-answer-step flow chips (M08 narrative)<br>capabilities.html / en/capabilities.html — #creative-video paragraph 1 (M08-01, M08-05 retention)<br>capabilities.html / en/capabilities.html — #creative-video paragraph 2 (M08-02, 03, 04, 06 budget/approvals)<br>capabilities.html / en/capabilities.html — #creative-video paragraph 3 (outputs, formats, local redo) and .cn-answer-note<br>capabilities.html / en/capabilities.html — #g09 subhead 'AI 一键生成视频 · 建设中': lede (summary), six li items M08-01…06, boundary line, outputs, availability<br>capabilities.html / en/capabilities.html — #g09 .cn-out (outputs line); #creative-assets item 7 (versioned local redo) | • The V5 visual headline '一句需求，走向一条营销视频' / 'From a brief toward a complete marketing video' is not placed anywhere. Neither is the in-depth heading '从一句需求，组织到一条成片' / 'AI Video Studio \| From a Brief to a Finished-Video Workflow'.<br>• There is no V4_17 flow graphic; the narrative is shown as text step chips. This is an acceptable conservative option under V6 §5.6.<br>• In the accordion, 'camera language / 运镜' (M08-02) and 'connect image and video generation / 衔接图片与视频生成能力' (M08-03) appear only in #g09, not in item 2. This is minor.<br>• The #creative-video anchor exists, but the home creative slot does not link to it. The home products section has no links at all, which was already the case on the live site. |
| M09 爆款结构再创作 | done | capabilities.html / en/capabilities.html — #story-5 accordion item 3 (#creative-viral): 5-step flow chips, 4 .cn-accordion-answer-text paragraphs, .cn-answer-note. Checked in the browser at 390 and 1440 in both languages: after the click, the answer wrap height equals its scrollHeight and the note is fully visible. Text dump: D:/Temp/User/claude/F--stargo---/bf9e89c6-c699-4a61-af68-651f718a3e56/scratchpad/qa/m912/capabilities-{zh,en}.txt<br>capabilities.html / en/capabilities.html — #atlas #g09, sub-block 爆款结构再创作 · 建设中 / Viral creative adaptation · In development (.cn-cat-lede, six li, .cn-cat-value, .cn-out, .cn-note): M09 summary, M09-01…06 word for word from V5, value, outputs and availability<br>capabilities.html / en/capabilities.html — #story-5 item 7 (#creative-assets): note carrying the M09-05 qualifier; #g09 register entries marked (建设中)/(in development)<br>index.html / en/index.html — section.products slot 3: desktop #core-panel-3 (visible after clicking #core-tab-3 at 1440) and the 4th .products-cards-inner-block-mobile (readable after a tap at 390)<br>capabilities.html / en/capabilities.html — #g13 delivery/availability list item | • The flow-chip step '拆解开场、节奏与镜头 / Analyze hook, pacing and shots' drops the call-to-action from the V5 narrative ('…镜头与行动指令'). The call-to-action is still named in paragraph 1 of the same answer.<br>• M09-06 production cost ('制作成本') is only in #g09, not in the #story-5 answer. Acceptable, since #g09 carries it.<br>• The optional V4_19 flow graphic before item 3 (V6 5.6 enhanced option) was not added; a text flow of chips is used instead. V6 lists the graphic as optional. |
| M10 288 个跨部门数字员工 | done | workforce.html / en/workforce.html — hero #lx-roles (h1 plus .lx-text-size-regular); five role cards labelled 岗位示例 / Example<br>workforce.html / en/workforce.html — feature grid '有岗位，有团队，有工作台 / Roles, teams and a desktop': 有岗位的 AI (M10-01), 按任务组队 (M10-02), 交办与确认 (M10-03), 交接有记录 (M10-04)<br>workforce.html / en/workforce.html — #lx-role-groups.lx-v6-roster: ten-group roster (15/50/16/5/20/4/14/19/129/16, Total 288), flow line and note. Checked at 390 and 1440: one row per group plus the Total row, fully readable<br>capabilities.html / en/capabilities.html — #atlas #g10, first sub-block: lede, table captioned 十类岗位与数量（岗位目录） (rows add up to 288 in the DOM; no overflow at 390), four li for M10-01…04 word for word, value, outputs and availability<br>capabilities.html / en/capabilities.html — #story-6 small card 1 and card 2<br>index.html / en/index.html — section.section.with-minus (288 block; text identical to 44f346e); hero intro; #compare FAQ 03 answer<br>enterprise.html / en/enterprise.html; pricing.html / en/pricing.html; intelligence.html — enterprise stat line; pricing plan row and FAQ; intelligence team heading | • Homepage 288 block: the V6 4.4 short explanation (the ten functions by name plus '按任务选择员工、组成团队，查看成果并批准关键动作 / Form a task-focused team and review its work') is not there. Its quantity note is only '(岗位目录 · 非同时运行)', with no '受配置、预算和权限约束' clause. The block is unchanged from 44f346e, and the FAQ 03 answer does not add the clause either.<br>• capabilities #story-6 card 1 says not-concurrent and not-a-replacement but leaves out the configuration/budget/access clause.<br>• Workforce page has no explicit outputs line; the verbatim M10 outputs appear only in #g10.<br>• Homepage h2 reads '288 个数字岗位，不只服务外贸。' rather than V6's '288 个专业数字岗位，不只服务外贸。'; the next line does say '专业数字岗位'.<br>• After the audit: homepage FAQ 03 names the configuration, budget and access limits; the 288 caption says 非同时运行 / not concurrent runs. |
| M11 多 AI 员工交流协作 | done | workforce.html / en/workforce.html — team section: .lx-v6-scene-label cards 01–03, chat lines, .lx-v6-team-display paragraph, .lx-v6-team-title. The paragraph was checked readable at 390 and 1440<br>workforce.html / en/workforce.html — feature grid items 按任务组队 (M11-01) and 交接有记录 (M11-04/05)<br>capabilities.html / en/capabilities.html — #atlas #g10, second sub-block '多个 AI 员工交流协作 / AI employees working together': summary, six li for M11-01…06 word for word, scenario, outputs and availability<br>capabilities.html / en/capabilities.html — #story-6: heading plus outputs subtitle; large card '团队分工、交流、并行与接力' with its caption<br>intelligence.html / en/intelligence.html — team block ('288 个岗位，分工协作，把事做完' / 按任务组队) and #lx-context card 任务不断线 (M11-05 detail)<br>index.html / en/index.html; capabilities #g13 — #loop label 数字员工团队 / AI teams; hero line 让 AI 员工协作; #g13 availability item | • On the workforce page, V6's main M11 location, M11-02 is only a scene title plus three chat lines. The concrete mechanisms (协作会话、定向消息、问题转交、进度通知) appear only in #g10.<br>• Workforce M11-06 leaves out '防止循环讨论、重复执行与越权操作' and '结果核对'. Workforce M11-05 leaves out 认领状态 / 证据 / 失败原因. Both sets are covered in #g10 and on the intelligence page.<br>• Workforce scene cards 01 and 03 have titles only, with no body text.<br>• The capabilities '看团队协作 / See teamwork' link goes to the top of workforce.html, not to the team section.<br>• After the audit: "See teamwork" lands on workforce.html#lx-team; "Agent Teams · Multi-Agent Collaboration" and "Agent-to-Agent Communication" are now "AI Teams & Collaboration" and "AI Employee Communication". |
| M12 企业知识与业务理解 | done | intelligence.html / en/intelligence.html — #lx-context: h2, lede, cards 企业知识库 (M12-01/02), 业务关系图 (summary, M12-03, M12-05) and 同一个客户 (M12-04 plus the M12-06 staging rule), then the 开放说明 paragraph. All checked visible at 390 and 1440<br>intelligence.html / en/intelligence.html — #lx-ontology sticky section: 业务关系 plus object cards 客户/询盘/报价/订单/出货/任务 (V5 narrative)<br>capabilities.html / en/capabilities.html — #atlas #g06 (M12-01, M12-02 word for word from V5; outputs; availability)<br>capabilities.html / en/capabilities.html — #atlas #g12 (summary lede; M12-03…06 word for word; value line; outputs; availability)<br>capabilities.html / en/capabilities.html — #foundations item 01 plus tab panel #qx-whatwedo-panel-01 (hidden until its role=button is activated; the click was checked at 390 and 1440)<br>index.html / en/index.html — .testimonials-section scenario 1 (labelled 示例场景 · 非客户评价 / illustrative scenario) | • The intelligence page, V6's main M12 page, does not describe the M12-06 structured onboarding templates (产品、客户、规则模板). It has only the staging rule and templates in the availability note; the full M12-06 text is only in #g12.<br>• The intelligence 企业知识库 card drops '销售话术' and the '经授权的知识源' intake wording from M12-01/02. Both are in #g06.<br>• The verbatim M12 outputs line appears only in #g12; the intelligence page paraphrases it in the #lx-context lede.<br>• After the audit: the foundations panel and the #g06 entry no longer say "no source, no answer"; they say gaps are flagged. The #g12 "… Objects" entries are now "… Records". |
| M13 主动工作、长期记忆与持续改进 | done | intelligence.html + en/intelligence.html — #lx-context card 主动推进·盯住机会与期限 / Opportunities and deadlines (M13-01, M13-02)<br>intelligence.html + en/ — #lx-context p.lx-context-flow (narrative / value loop)<br>intelligence.html + en/ — #lx-context card 任务不断线 / Tasks that carry on (M13-03)<br>intelligence.html + en/ — #lx-context card 长期记忆 / Long-term memory (M13-04)<br>intelligence.html + en/ — #lx-context 开放说明 / Availability paragraph (availability + summary boundary)<br>intelligence.html + en/ — #lx-evolution CTA card (M13-05, M13-06)<br>intelligence.html + en/ — hero ticker h1.lx-big-text + p.lx-testimonial-text rows; #lx-ontology expandable 主动工作 / Proactive<br>capabilities.html + en/capabilities.html — section#atlas #g14 accordion (summary, M13-01…06, value, outputs, availability; verified to expand fully at 390/1440)<br>capabilities.html + en/ — #g14 .cn-out (outputs line)<br>capabilities.html + en/ — #foundations card 04 经过验证的改进 / Improvement you can check; .rk-rt-insight step 09<br>index.html + en/index.html — .service-list stage (005) 复购与改进 / Retain & improve (text shows only while stage 005 is active on desktop)<br>index.html + about.html (+ en/) — .testimonials-section / .cn-section-home-testimonial scenarios 03 主动提醒 and 04 从结果改进 | • On intelligence.html, the improvement paragraph (#lx-evolution) only says 「更好的做法」 / 'better methods'. It does not name 岗位技能与业务流程 / role skills and business processes; those appear only in capabilities #g14 and #foundations.<br>• The verbatim outputs line (机会、期限与异常提醒…) appears only inside the #g14 accordion, which is collapsed by default. intelligence.html has no outputs sentence, though its cards cover the same ground.<br>• The home-page entry (stage 005 description) cannot be read on phones: at 390 only the title 复购与改进 / Retain & improve is shown. This is the inherited five-stage design (same on the live site). On desktop the text appears only while stage 005 is the active stage. |
| M14 网页桌面与 AI 办公 | done | index.html + en/index.html — hero intro .hero p.top-text.big (and its data-mobile-text phone version)<br>index.html + en/ — .video-section h2.cta-sm-title._06<br>workforce.html + en/workforce.html — card 网页桌面与 AI 办公 / Browser desktop and AI office (#w-node-_64b78267…) with 4 check-list items and 浏览器里的企业桌面 · 网页优先 badge (summary, narrative, value)<br>capabilities.html + en/ — section#atlas #g01 subsection 工作空间 / The workspace (summary, M14-01, availability + value)<br>capabilities.html + en/ — section#atlas #g11 自动化与日常办公 / Automation & Everyday Work (M14-02…06, outputs, availability; verified to expand fully)<br>capabilities.html + en/ — #g11 .cn-out (outputs line)<br>capabilities.html + en/ — #foundations card 02 按授权连接业务系统 / Connections, by authorization (M14-05)<br>enterprise.html + en/enterprise.html — section#table 业务连接(6) / Connections(6) table; opening block (连接)/(Connect) (M14-05, M14-06) | • M14-02…M14-06 are explained in full only in the #g11 accordion, which is collapsed by default. The workforce card lists them as four short items. This matches V6 §11 (workforce desk plus capability directory).<br>• The outputs line appears only in #g11. The workforce card has no outputs sentence.<br>• V5 names 'native Windows / Mac clients'. zh #g01 says 原生电脑客户端 and workforce zh says 桌面客户端, while EN keeps 'Native Windows and Mac clients' / 'desktop clients'. The wording differs slightly between languages but the meaning holds.<br>• After the audit: "Computer Use" is now "Screen Operation" (zh 界面操作); "Scripts & Data Jobs" is "Scheduled Data Jobs"; the enterprise table no longer says "B2B" and no longer claims "off by default". |
| M15 老板驾驶舱与管理控制 | done | enterprise.html + en/enterprise.html — hero h1.inner-title (detail headline)<br>enterprise.html + en/ — section.sutdio-animation opening blocks (决定)(核对)(连接)(经营) / (Decisions)(Results)(Connect)(Oversight)<br>enterprise.html + en/ — section.section (老板驾驶舱) / (The owner's cockpit) h2 (summary, M15-01, narrative, outputs)<br>enterprise.html + en/ — (数字口径) / (What the numbers count): 13 management controls (13 items listed in both languages)<br>enterprise.html + en/ — (原则) / (The principle) quote card (value line)<br>enterprise.html + en/ — section.section.gr 五个管理组件 (5) / Five management components (M15-05, M15-06)<br>capabilities.html + en/ — section#atlas #g01 subsection 经营总览 / The owner's overview (summary, M15-01…04, outputs, availability)<br>capabilities.html + en/ — section#atlas #g13 subsection 权限、审批与记录 / Permissions, approvals and records (value, M15-05, M15-06, availability)<br>index.html + en/index.html — .section.with-minus approval scenario (审批流程示意 · 非真实客户事件); #compare 管理 row; FAQ 04<br>workforce.html + en/ — cards 交办与确认 / Delegate and approve, 交接有记录 / Handoffs on record (M15-03 echo)<br>capabilities.html + en/ — #foundations card 03 权限、审批与记录 / Permissions, approvals and records | • M15-02 (the four states: in progress, submitted, awaiting check, verified), M15-03 (workforce and orchestration views) and M15-04 (control center) are explained only in the #g01 accordion. enterprise.html carries only the shorter 「已提交不等于已完成」 line.<br>• V6 §8.2 asked for a cockpit diagram based on V4 p.31. The enterprise cockpit is text only, beside abstract concept images that are unchanged since before the change (os-cockpit.webp shows no figures). This is the optional asset-swap item and is not done; no invented metrics are shown.<br>• The V5 narrative arrow chain (看商机与交付节点 → … → 核对实际结果) does not appear as a sequence. Its elements are listed in the cockpit paragraph.<br>• After the audit: the enterprise availability line names automated actions again (V5 wording). |
| M16 企业落地与交付范围 | done | enterprise.html + en/enterprise.html — section.section (落地顺序) / (Delivery steps) span.ent-step-t 01–06 (narrative / value line in the V6 §8.4 wording)<br>enterprise.html + en/ — section.section.gr (开放范围与边界) / (Scope and boundaries) p.top-text.big (availability; M16-01, M16-05 boundary)<br>enterprise.html + en/ — (数字口径): 3 deployment options<br>capabilities.html + en/ — section#atlas #g13 subsection 开通范围与验收 / What is enabled, and how it is accepted (summary, M16-01…06, value, outputs, availability; verified to expand fully)<br>capabilities.html + en/ — #g13 .cn-cat-value and .cn-out<br>capabilities.html + en/ — section#start closing (选一条流程。验证成果。再扩大范围。) + FAQ 03/04 + demo line<br>index.html + en/index.html — #compare (从哪里开始？) / (Where to start?) CTA h2; scenario 02 按业务落地 / Implementation<br>about.html + en/about.html — section.cn-section-home-intro p.cn-text-size-large; testimonial 按业务落地 / Implementation<br>contact.html + en/contact.html — h1.stargo-contact-title + quote card (先从一条业务开始) / (One workflow first)<br>intelligence.html + en/ — #lx-ontology expandable 按流程落地 / Real workflows + four stage headings (观察真实流程…用实际结果改进)<br>index.html + en/ — section.sc-scope.products slot scope lines (M16-02/M16-03 echoes, desktop tabs and mobile cards) | • The enterprise.html scope paragraph compresses M16. It omits M16-02 (Growth OS / Sales Desk connected and validated per use case), M16-03 (video generation, playback and export still awaiting validation), M16-04 (deeper teamwork, enterprise-wide proactive work, unified memory and onboarding are staged) and M16-06 (industry data templates, workflow configuration, onboarding, training). These appear only in the collapsed capabilities #g13 accordion, and M16-02/03 are also echoed in the home product slots.<br>• contact.html does not mention industry templates, onboarding or training (M16-06), although the checklist destination was ent + contact. It covers only the one-workflow framing.<br>• The V5 wording 「本次内容说明不代表所有能力已上线或已经再次完成验收」 appears in full only in #g13 and capabilities FAQ 03. enterprise.html carries the shorter 「能打开某个应用，不等于整条流程已经验收」. |

## Link changes (old → new → reason)

Every fragment below resolves to exactly one id on its page (link audit on the merged build, plus the lead's re-check after the fixes). `#atlas` rows and `#gNN` rows open on arrival (js/stargo-catalogue.js); `#creative-*` items open on arrival (tools/blocks/cn-faq.js).

| Page | Where | Old | New | Reason |
|---|---|---|---|---|
| all pages | Footer statement link | workforce.html | contact.html | The link is resolved from its words; the old line said 「AI 员工」, the new V6 line names no page, so it returns to the template's destination. |
| capabilities (zh/en) | Hero button 查看功能全景 / Explore Capabilities | #atlas on the Growth OS block | #atlas on the complete catalogue | `id="atlas"` moved onto `section.cn-capmap`, so "all capabilities" lands on the directory (V6 §12). |
| capabilities | #story-2 完整目录 pill | #atlas (Growth OS block) | #atlas (catalogue) | same |
| capabilities | Nine steps 01–09 | #atlas ×9 | #g02, #g02, #g03, #g04, #g04, #g07, #g08, #g05, #g14 | Each step goes to its own group, not the whole catalogue. |
| capabilities | #story-1 button (聊聊你的流程 → 获客能力详情) | contact.html | #g02 | The button now names the detail it opens. |
| capabilities | #story-2 rows 1–3 (image + title) | #atlas | #g04, #g04, #g05 | Intake and requirements are group 04, the customer view is group 05. |
| capabilities | #story-3 button (→ 报价能力详情) | contact.html | #g07 | Quotation detail. |
| capabilities | #story-3 paragraph (new inline link) | — | #g06 | Product facts behind a quotation. |
| capabilities | #story-4 twelve cards (new role-line link) | — | #g08 | ERP & fulfilment detail. |
| capabilities | #story-5 question line (new link) | — | #g09 | Creative catalogue group. |
| capabilities | #story-6 header arrow | #atlas | workforce.html | Teamwork is told in full on the workforce page. |
| capabilities | #story-6 card 1 (288 roles) | #atlas | workforce.html#lx-role-groups | Lands on the ten role groups. |
| capabilities | #story-6 card 2 (tasks and results) | #atlas | #g10 | AI workforce group. |
| capabilities | #story-6 card 3 (teamwork) | #atlas | workforce.html#lx-team | Lands on the team scenario. |
| enterprise (zh/en) | Connection table button | capabilities.html | capabilities.html#g11 | Automation and everyday-work group. |
| enterprise | Deployment button 联系 STARGO 前置部署团队 → 预约企业演示 | contact.html | contact.html (unchanged) | label only |
| capabilities | New ids with no inbound link yet | — | #creative-images … #creative-assets | Ready for a future "details" link (e.g. from the homepage AI creative slot, which has no link element today). |
| workforce / intelligence | New ids | — | #lx-role-groups, #lx-team (linked from capabilities); #lx-context (not linked yet) | — |

## Visual changes

All pictures are the site's own AI concept images (tools/imagegen manifest; alt text says 「AI 概念图」 / "AI concept illustration") or the templates' own licensed artwork. No product screenshot, live metric or customer mark was added. The V4 reference figures named in V6 §10 are not in the repository, so none was used; flows are shown as page text instead.

| Page | Position | Before | After |
|---|---|---|---|
| Home | Stage 003 / 004 / 005 | os-cockpit / os-quote-studio / os-agent-center | os-trade-execution / brand-family-01 / brand-loop |
| Home | Product slot ERP / AI creative (desktop + phone) | os-quote-studio / os-trade-execution | brand-family-02 / os-boot |
| Capabilities | #story-1 four thumbnails + four crossfade backgrounds | cinery film-set stock | brand-family-01, os-sales-desk, os-loading, mobile-approvals |
| Capabilities | #story-2 three row pictures | qubix packaging/landscape stock (one showed another brand's name) | os-desktop, brand-ontology, os-inquiries |
| Capabilities | #story-3 picture | renok branding portrait | os-quote-studio |
| Capabilities | #story-4 six card portraits | renok people portraits | avatar-07 … avatar-12 (abstract role emblems) |
| Capabilities | #story-5 section picture | cinery black-and-white portrait | os-boot |
| Capabilities | #story-5 items 2 and 3 | — | text step rows (制作需求 → … → 审核与导出; 参考视频 → … → 制作与审核) |
| Capabilities | #story-6 three cards | qubix product photos | phone-agents, mobile-agents, brand-family-03 |
| Capabilities | #g10 | — | ten-role-group table (text) |
| Workforce | Team card 02 | chat picture with English painted into it | the template's text-free blob with three page-text messages |
| Workforce | New block | — | ten role groups (text list in the template's careers-list style) |
| Intelligence | New #lx-context section | — | text only, page styles |
| Enterprise | Four hero panels | os-cockpit, os-agent-center, os-login, os-trade-execution | brand-family-04, os-loading, brand-family-03, os-trade-execution |
| Enterprise | Band pictures | os-agent-center, os-login, os-trade-execution | os-cockpit (abstract, beside the cockpit text), brand-glow-tall, … (see area F) |
| Enterprise | Five cards | os-agent-center, os-login, phone-approvals, os-trade-execution, brand-ontology | os-agent-center, phone-agents, phone-approvals, … (see area F) |

## Layout adjustments (scoped)

- css/stargo-fusion.css, "V6 homepage headings": keep-all on the 288 heading and problem-card titles; pretty on the hero intro.
- css/stargo-fusion.css, "V6 review fixes": film centre line centred with a gutter; enterprise picture frames grow with the text column from 768px; zh `text-wrap: pretty` on paragraphs (not on pricing); English footer statement balanced.
- tools/blocks/rk-testimonials.css: #story-4 badge keeps its size at 768–991 and the link stays on one line; below 480px the six cards are shown as renok's single-column rows instead of the undriven slider.
- Area-specific rules in the V6-A … V6-G blocks of css/stargo-fusion.css and in the capability block stylesheets (listed per area in the appendix).

## Verification

All commands were run from the worktree against the merged candidate served locally (`PORT=4310 node tools/serve.mjs`, `BASE_URL=http://127.0.0.1:4310`). Final round on commit `0b0fb0d`.

| Command | Result |
|---|---|
| `npm run build` | pass — "wrote 38 pages"; every build-time assertion holds (new ones include: 8 product panels showing 4 pictures; the ten role groups sum to 288; each catalogue group carries its V5 detail; story-4/story-5/foundation counts) |
| `node tools/verify-site.mjs` | pass — 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links |
| `node tools/verify-integrity.mjs` | pass — 40/40 (no duplicate ids, every in-page and cross-page anchor resolves) |
| `node tools/verify-interactions.mjs` | pass |
| `node tools/verify-conversion.mjs` | pass — 5/5 client scenarios (validation, duplicate guard, mocked 503 fallback, legal, pricing toggle, resize); no real e-mail sent |
| `node tools/verify-restore.mjs` | pass — 298/298 (every page × 320–1920 × both languages, scroll states, clipped/covered text). One checker change: text inside a collapsed accordion row is no longer counted as "covered" (the closed catalogue rows now hold long detail whose glyph boxes reach the footer at the end of the page; verified in the browser that nothing shows) |
| `node tools/verify-fixes.mjs` | 20/28 — the same 8 checks fail on the live site (pricing mobile tabs and keyboard ARIA × 2 languages; contact field widths at 320/390 × 2 languages): pre-existing |
| `node tools/verify-editorial.mjs` | fails on its first page check: about.html does not load `js/stargo-tabs.js` — same on the live site: pre-existing. Its image checks before that assertion pass (38 editorial images placed, 5 unused) |
| `tools/verify-release.mjs` | not run (it checks the deployed production site). Its capability-card selector was scoped to the four area cards so it will not trip over the new group links |
| Wording scan (scratch `scan-text.mjs`, all 38 pages: visible text, alt, aria, placeholders, `data-mobile-text`, meta) | Chinese pages: no English sentences outside product/platform names; English pages: no Chinese outside the language switch. Implementation terms remain only in the unchanged blog articles (and their titles/summaries where they are listed), on the legal notices page, and in the restored pricing billing footnote ("API") |
| Pricing text diff against the live page | prices, levels, inclusions, quantities, renewals, billing footnote, title and hero subtitle identical; changed lines listed in the page summary |
| Browser review (four reviewers, zh/en, 320–1920) + lead re-checks of every fix | findings and their fixes in commit `0b0fb0d`; screenshots under the session scratchpad (`shots/before`, `shots/after`, `qa/`) |

Not performed: real form submission (no test inbox), production deployment checks, real devices (browser emulation only), WebKit engine.

## Decisions for the owner

1. **Pricing — 288 wording.** The price card line and the FAQ answer now say 288 is a role-directory count, not the number running at once (V5 G02 / V6 §4.4). Nothing commercial changed, but the pricing page was otherwise frozen. Keep or revert.
2. **Pricing — "FDE".** The English Enterprise entitlement lines keep the live wording "dedicated FDE" (entitlement text is not reworded here); the training FAQ answer spells it out. Decide the wording.
3. **Pricing vs product status.** The Growth and Global Acquisition packages list 10 / 20 AI videos, while the product copy (V5 M08) says one-click video is still in development. This is a commercial/content conflict V6 asks to flag, not to resolve silently.
4. **Pricing — English Standard answer.** 「标准版包含什么？」 lists different items in English ("basic Customer 360, basic content assets …") than in Chinese and on the Standard card. Pre-existing; aligning it changes what the English page says Standard includes.
5. **Homepage logo wall.** The template's placeholder brand marks still form a partner-style wall (caption removed earlier at the owner's request). It reads as customer logos; remove the wall or supply real, approved marks.
6. **Contact form interest options (V5 P07).** Not applied: the form submits the option text, so new labels change what reaches the inbox. Ready as `V6_G_PENDING.contactOptions` in tools/copy.mjs.
7. **Pricing intro (V5 P08).** Not applied (needs commercial approval). Ready as `V6_G_PENDING.pricingIntro`.
8. **Blog article bodies.** Unchanged, as instructed; they still use older architecture terms (本体 / Ontology, Evolution Engine, Quote Studio, Canary, 提示词, Capability Center …), and their titles/summaries appear on the blog index and on the workforce and home pages. A separate editorial pass is recommended.
9. **Wording to confirm.** Creative item 6 adds "rankings and AI-search citations are not guaranteed"; enterprise says service levels are agreed per project; the approval card reads 批准≠已发送；提交≠已完成 (V5 H08 shortened to fit); workforce hero 「按工作需要，组成 AI 团队。」 and team heading 「不是各聊各的，而是一起做完。」 are shortened from V6/P04 for line breaks.
10. **Navigation label.** The nav still says 企业与治理 / Enterprise while the page title is now 企业管理与交付 (the navigation was out of scope).

## Content not placed (with the smallest proposal)

| Item | Why | Proposal |
|---|---|---|
| V6 §12 homepage "图片视频详情 → #story-5" | The homepage product panels have no link element (same on live). | Add a text link to slot 4 pointing at capabilities.html#creative-video (ids exist and open on arrival). |
| V4 reference figures (V4_05 … V4_33) as page graphics | Not in the repository; V6 §10 calls them reference material. | Produce approved web graphics, register them in tools/imagegen/assets-manifest.json and tools/editorial-images.mjs, swap the image key in the block (one line each). |
| V5 P06 three principles (About) | The cinery About blocks have no list slot; About is text-only by an earlier owner decision. | One three-item list under the About card paragraph (copy ready in ABOUT.values). |
| M16-06 industry delivery on enterprise.html | The enterprise note slot is already long. | One sentence in ENTERPRISE.note, or on contact.html. |
| M14 outputs line and M14-01…06 in full on workforce.html | Placed in capabilities #g01/#g11 per V6 §5.8; the workforce page carries the summary and limits. | — |
| M11-02 / M11-05 full item lists on workforce.html | Full lists are in #g10 and on intelligence.html. | Optional sentence in LX_FEATURE_WORKFORCE.answersBody. |
| #g08 register entries for ERP / commerce | The detail covers ERP and commerce; new register entries change the catalogue count. | Add 2–3 entries in a later round and re-check the band count. |
| V5 visual-headline / in-depth heading lines (M02–M09) | The story sections have fixed two-word or single-heading slots; V6's section titles were used. | — |

## Pre-existing problems (not introduced by this change; not fixed)

- `tools/verify-fixes.mjs`: 8 of 28 checks fail on the live site and on the candidate alike (pricing mobile tabs / keyboard ARIA — the checks target the pricing component that the earlier pricing rebuild replaced; contact field widths at 320/390).
- `tools/verify-editorial.mjs`: asserts `js/stargo-tabs.js` on every page; about.html has not loaded it since the earlier About rebuild (same on live).
- Intelligence hero button 持续改进 / Improving (`#lx-evolution`) lands ~888px past its card on phones (the page shortens during the smooth scroll; same on live).
- Capabilities nine-step tag column is cut at the right edge at 320–360px (same geometry before the change).
- The cinery accordion rows (#story-5 and the catalogue's heading rows are opened by script with ARIA for the catalogue only) have no keyboard support in #story-5.
- Webflow's smooth scroll measures in-page targets at click time, so #story-N links can land short when sections above change height (corrected for #atlas and #gNN only).
- English spelling mixes "fulfilment" and "fulfillment" on en/capabilities (already mixed before the change; left as is).
- Minor presentation notes from the review, left for a later pass: workforce display line peeking between stacked cards; the workspace card at 768 is a narrow 16-line column; enterprise management card 2 uses a portrait picture (row rhythm); enterprise table third header alignment; About intro card is long on phones; some Chinese body lines still break inside a word (normal in Chinese body text; headings were fixed).

# Appendix — area reports

Written by the area agents when they finished. Where the lead changed something afterwards (sections above, commit 0b0fb0d and before), the sections above are the current state.

## Area A: Capabilities page — hero, areas, nine steps, #story-1/2/3/4/6, foundations, closing

Branch `v6/A` (d704f453), merged into content/v6-placement.

Area A is done and committed. The build passes ("wrote 38 pages"), and verify-site passes on all 38 pages with 0 errors, 0 failed requests, 0 external requests and 0 broken links. The previous agent had committed nothing, so I started from base 44f346e and left 7 commits, ending with d704f45.

What changed:
- **Hero:** V5 P02 headline and body. The zh italic accent is the product name "/Growth OS", so no English word sits in the Chinese headline. Button reads 查看功能全景 / Explore Capabilities and goes to #atlas.
- **Four areas:** new heading and names, plus each area's one-line description printed inside its card.
- **Nine steps:** retitled 一条业务主线 / One business flow. Each point is rewritten in business language, and each row links to its own catalogue group. One sentence in the orbit block says these nine steps are the same journey as the homepage's five stages.
- **#story-1 (Growth OS):** now named Growth OS. The section says in visible text that thin evidence is marked for checking, not guessed, and that approved prospects go to Sales Desk with their research. Button goes to #g02.
- **#story-2 (Sales Desk):** V6 heading, a lead explaining how the three rows serve replies, product fit, follow-up, quotations and PI. Rows link to #g04, #g04 and #g05.
- **#story-3 (quotations):** V6 heading and the M04 paragraph, including approved ≠ sent ≠ received. The three counters now show steps 01/02/03 instead of catalogue counts, and the picture is now os-quote-studio. Button goes to #g07, with a pointer to #g06.
- **#story-4 (ERP & fulfilment):** V6 marquee and the six themes, with the full trade-document list and the filing/payment boundary kept. Each card's role line links to #g08.
- **#story-6 (teamwork):** three V6 cards, including the illustrated example and the "phased" note. Links go to workforce.html or #g10.
- **Foundations:** business-language labels, promises and panels. Both conditions (a listed connection is not live; improvements are approved first and can be withdrawn) are in the always-visible text.
- **Closing section:** ontology and "AI-native" wording removed; 288 is described as a role directory; the FAQ is now F12, F11, F13 and F10.
- **Floating pill:** 获客/销售/报价/经营 · Prospects/Sales/Quotes/Operations.

**One problem to fix before release:** the capability-card image check in `tools/verify-release.mjs` (L94–105) will now fail. Its selector `a[href="#g04"] img` (and the same for #g07/#g10) also matches images inside the new links the brief asked for (nine-step rows, Sales Desk rows, a teamwork card). I reproduced this locally. That file is outside my area, so I left it; the fix is one line, described under concerns.

Other items not fixed in my files:
- "Trade OS" still appears on the English page (it comes from the shared navigation).
- #atlas still lands on the Growth OS section until area C moves it to the catalogue.
- At 320–360px the nine-step tag column is cut off at the right edge; this was already the case before my change.

| Section | Chinese | English | Note |
|---|---|---|---|
| Hero (rk-hero) | 从找客户 /Growth OS 到把企业工作连接起来（三行：从找客户 /Growth OS / 到把企业工作 / 连接起来）；正文 = V5 P02 说明；按钮「查看功能全景」 | From finding customers to /connected enterprise work; body = V5 P02; button "Explore Capabilities" | The italic accent must stay Latin; on zh it is the product name. A zero-width space marks where 到把企业工作连接起来 may wrap (rk-hero whole() honours it). The English tail uses a no-break space so "work" never sits alone on a line. |
| Four business areas (CAPABILITIES.macro*) | (四个业务板块) / 四个板块，十四类能力；指挥与增长、客户与知识、商务、履约与创作、员工与管理，各配 P02 一句说明（卡片玻璃面板内） | (Four business areas) / Four areas. Fourteen capability groups; Workspace & growth, Customers & knowledge, Commercial, delivery & creative, Workforce & management, each with its P02 description | P02 heading 「四个业务板块，十四类能力」 broke inside 板块 at 320px, so 业务 moved into the caption. Card targets #g01/#g04/#g07/#g10 and card pictures unchanged. |
| Nine steps (HOME_LOOP_TABLE, rk-award, qx-orbit, rk-insight) | 标题「一条业务 / 主线 / /09」；九个要点改为业务语言（无进化引擎、客户全景 360、报价工作室、沉睡客户再激活等名称）；左侧说明「与首页五个阶段是同一条业务主线，这里分九步细看，不是两套系统。」；芯片 获客 / 经营 | One / business / /flow; nine points rewritten; caption "The homepage’s five stages, read here in nine detailed steps — one business journey, not two systems."; step 8 title "Follow-up"; chips Prospects / Operations | "/journey" ran under renok's 3-D cursor at 1440, so the English accent is "/flow"; zh uses the step count "/09" (no English word). The long rows[i][1] texts (not rendered) were also rewritten; lede = V5 P02 note. |
| #story-1 Growth OS (cn-service) | 药丸「Growth OS」、标题「主动 / 获客」；导语：Growth OS 围绕产品、市场与客户画像找客户、判断机会，证据不足时标注待核实，不强猜；确认后的客户连同来源、背调、产品兴趣和下一步任务转入 Sales Desk；工作成果：客户清单、联系人信息、商机简报、开发计划；核心流程建设中，真实数据与客户触达按授权接入。四行：企业研究 / 贸易情报 / 补货判断 / 关键决策角色（新短说明）；按钮「获客能力详情」 | Pill Growth OS, heading FIND / LEADS; same lead, outputs and availability; rows Company Research / Trade Intelligence / Reorder Signals / Key Decision Roles; button "Prospecting details" | Row words live in CAP_V6A.growth keyed by the story's first four picks (register names untouched). The zh Latin assertion now whitelists exactly "Growth OS" and "Sales Desk". The lead paragraphs sit in the donor's button cell. |
| #story-2 Sales Desk (qx-news) | 标题「Sales Desk：/ 把客户聊明白，/ 把订单跟到底」；导语说明承接 Growth OS 客户与各渠道询盘，三项共同服务于回复、产品匹配、跟进、报价与 PI 直到订单交接 + 工作成果 + 开放条件；三行：统一询盘入口 / 买方需求提取 / 客户全景 | "Sales Desk: from customer to order" (V6 compact form: the long form stood five lines); same lead, outputs and availability; rows Unified Inquiry Intake / Buyer Requirement Extraction / Customer Context | zh heading breaks only after the colon and the comma (zero-width spaces + keep-all); heading balanced in both languages. The 完整目录 pill still goes to #atlas. |
| #story-3 quotations (rk-stats) | 标题三行「报价有依据，/ 利润有边界，/ 文件有版本」；段落 = M04（配置数量、企业确认的价格来源、折扣与利润边界、版本、PI、合同、单证准备与人工复核）+「批准报价不等于已经发送，发送也不等于客户已经收到」+ 开放条件 + 范围说明 + 链接「产品与企业知识」；计数器 01/02/03 = 按规则起草 / 有权人批准 / 保留正式版本；按钮「报价能力详情」 | Ground the price. / Review the margin. / Keep the version.; same paragraph; steps Drafted by rules / Human approval / Version kept; button "Quotation details" | The reels land on two-digit step numbers using the donor's two columns, so the animation is unchanged. They are no longer counts. |
| #story-4 ERP & fulfilment (rk-testimonials) | 跑马灯「ERP 与履约：前端拿订单，后台接得住」；六卡：产品、物料与采购 / 库存、生产与质检 / 订单与付款节点 / 外贸单证与出口资料 / 物流与交付 / 售后、渠道与复购；卡 3 写明资金支付由有权人员批准、AI 不擅自付款；卡 4 列商业发票、装箱单、原产地证 / Form E 资料、提单、认证与出口退税资料，正式签发、申报与获批由主管机构完成；卡 1/5/6 带开放条件；角色行「ERP 与履约详情」 | "ERP & fulfilment: from winning orders to delivering them"; six matching themes and texts; role line "ERP & fulfilment details" | Theme data lives in CAP_V6A.operations. Desktop rows and the phone slider are filled from the same records. zh names wrap only at marked phrase breaks (keep-all). The build asserts that theme 4 keeps every document name and the authorities clause. |
| #story-6 teamwork (qx-projects) | 小卡「288 个跨部门专业岗位」（岗位目录，按任务选用；不是同时运行的 288 个员工，也不替代真人）、「员工任务、进度与成果」；大卡「团队分工、交流、并行与接力」+ 协作示意（研究→产品核对规格→销售规划→创意素材→统筹复核交负责人确认；基础派工已有记录，深度团队互通按阶段开放；图为示意）；右上「按责任汇总的结果、成员之间的交接记录，以及清楚的下一步。」 | 288 cross-functional specialist roles / Tasks, progress and results / Roles, exchange, parallel work and handoffs + the illustrative example and phasing note; "Consolidated results, clear handoffs and assigned next steps." | Heading unchanged. Hover pills now name each destination. The card text may wrap under the title (qx-projects.css). |
| Foundations (qx-whatwedo) | 分句标题「每项业务的 \| 四个基础」；企业知识与业务关系 / 按授权连接业务系统 / 权限、审批与记录 / 经过验证的改进；各自承诺与点击展开面板（业务语言），面板末尾带条件 | "What every \| area rests on"; Knowledge and business relationships / Connections, by authorization / Permissions, approvals and records / Improvement you can check | 12-character zh and "foundations" were clipped at the screen edges on phones during the scroll action, so the label was shortened. The model-weights caveat was replaced by a business-language one. The build asserts both conditions are in the visible promises. |
| Closing Mono section (CAPABILITIES ladder/cards/faq/more) | 选一条流程。/ 验证成果。/ 再扩大范围。；F10 描述；卡 1 五步（选定流程、准备资料与规则、连接授权账号、安排数字员工与审批、真实样本验证）；卡 2「逐步扩展到全公司」288（个专业数字岗位），第 4 条「288 是岗位目录，不是同时运行数」；FAQ = F12、F11、F13、F10；「演示按你的业务流程进行……逐项说明开放条件」；按钮「预约企业演示」 | One workflow. / Prove results. / Then expand.; matching cards, FAQ and closing text; "Request a Demo" | Counts kept: 3 ladder lines, 5+5 bullets, 4 FAQ items. Removed 企业本体, 渠道插件 SDK and AI 原生公司. |
| Floating pill (CAP_JUMPS) | 获客 / 销售 / 报价 / 经营 | Prospects / Sales / Quotes / Operations | Same four anchors. At 992px the English pill is 834px wide, so it fits. Every built page changed because of this. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| rk-insight row 01 发现 / Discover | `#atlas` | `#g02` | step belongs to 主动获客与商机判断 |
| rk-insight row 02 筛选 / Qualify | `#atlas` | `#g02` | same group |
| rk-insight row 03 触达 / Engage | `#atlas` | `#g03` | channels and outreach |
| rk-insight row 04 理解 / Understand | `#atlas` | `#g04` | inquiries and conversations |
| rk-insight row 05 回复 / Respond | `#atlas` | `#g04` | inquiries and conversations |
| rk-insight row 06 报价 / Quote | `#atlas` | `#g07` | quotations, PI |
| rk-insight row 07 执行 / Execute | `#atlas` | `#g08` | ERP, orders, fulfilment |
| rk-insight row 08 跟进 / Follow-up | `#atlas` | `#g05` | CRM follow-up plans |
| rk-insight row 09 学习 / Learn | `#atlas` | `#g14` | retained experience and improvement |
| #story-1 cn-service button | `contact.html` | `#g02` | brief: link to the six-part Growth OS detail (the page keeps contact doors in cn-faq, cn-produce and #start) |
| #story-2 qx-news rows 1 and 2 (image + title links) | `#atlas` | `#g04` | group the entry sits in |
| #story-2 qx-news row 3 (image + title links) | `#atlas` | `#g05` | CRM & customer context |
| #story-2 qx-news 完整目录 pill | `#atlas` | `#atlas` | unchanged: "all capabilities" door |
| #story-3 rk-stats button | `contact.html` | `#g07` | quotation detail (V6 §5.4) |
| #story-3 rk-stats paragraph (new inline link 产品与企业知识) | `(none)` | `#g06` | product facts behind a price (V6 §5.4) |
| #story-4 rk-testimonials role line on all 12 card elements (new link) | `(no link)` | `#g08` | ERP/fulfilment detail (V6 §5.5) |
| #story-6 qx-projects arrow button | `#atlas` | `workforce.html` | M10/M11 told in full on the workforce page |
| #story-6 card 1 (288 roles), both links | `#atlas` | `workforce.html` | ten role groups live there |
| #story-6 card 2 (tasks, progress, results), both links | `#atlas` | `#g10` | AI workforce group with its conditions |
| #story-6 card 3 (teamwork), both links | `#atlas` | `workforce.html` | team collaboration section |
| hero button | `#atlas` | `#atlas` | unchanged: "Explore Capabilities" = all capabilities |
| #start card1 / closing button | `contact.html (预约演示/Book a Demo)` | `contact.html (预约企业演示/Request a Demo)` | label only; href unchanged |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| #story-3 rk-stats photograph | assets/renok/…home-one-branding-identity.webp (visor portrait) | assets/stargo-editorial/os-quote-studio.webp (precision parts aligned and checked; editorial pass writes its srcset and alt) | brief: picture must match the quotation topic; reveal animation unchanged |
| #story-4 rk-testimonials six card portraits (desktop + phone slider) | renok people portraits | assets/stargo-editorial/avatar-07…12.png (abstract objects, decorative) | a person's face beside an operating theme reads as a customer testimonial; V6 §5.5 asks for mismatched theme images to be replaced |
| #story-6 qx-projects three card photographs | qubix Pro-5 (tote bag), Pro-4 (runner in phone), Pro-2 | phone-agents, mobile-agents, brand-family-03 (editorial art for specialised roles and parallel work) | V6 §5.7 (teamwork card should show team structure); the old photos said nothing about AI roles |
| Four area cards | title + group count | title + group count + one-line description in the same glass panel | P02 descriptions; card pictures unchanged |
| qx-orbit left cell | empty (social links and 'Based in LA' removed earlier) | the donor's own caption slot carries the nine-step note; globe icon dropped | placement for the P02 note |

Layout adjustments:

- cn-service.css §5: the donor button cell (.cn-content-item) becomes a flex column (right on ≥992, left below) holding two lead paragraphs above the button. The paragraphs are 25rem max, in the description type, left-aligned, text-wrap: pretty.
- qx-orbit.css F: the note is min-width 10.5rem from 992px up (the English note stacked 7 lines at 1024 otherwise) and uses text-wrap: pretty.
- qx-news.css §3: Chinese heading uses keep-all (breaks only at the marked colon/comma); heading uses text-wrap: balance in both languages.
- rk-stats.css: styles for the inline #g06 link (underline, pointer cursor); Chinese heading uses keep-all; the heading is three lines joined with <br/>.
- rk-testimonials.css: Chinese card names use keep-all + balance with zero-width-space phrase breaks; role-line link styled (inherits renok grey, underline, pointer cursor).
- qx-projects.css §4–6: the card title/explanation row may wrap, is top-aligned, and the explanation is left-aligned with text-wrap: pretty. Chinese card titles use keep-all. The English section heading is balanced ("team" was left alone on a line at 390–768; this was already the case before).
- qx-whatwedo.css §9: hairline above the condition that closes a panel.
- stargo-fusion.css V6-A: .macro-desc style inside the capability card panel; .macro-intro .h2 uses text-wrap: balance (the English "groups" was left alone on a line at 1440).

Not placed:

- **V6 §5.2/§5.3 photographs for #story-1 (cinery clapperboard/lenses, hover-only thumbnails and crossfade backgrounds) and #story-2 (qubix wooden balls, mountains, paper box)** — C-type swap not requested in the brief. V6 marks C changes as 'list separately, replace after confirmation', and the V4_05/V4_07 reference figures are not site assets. Proposal: Swap the 4 cn-service thumbnails/backgrounds and the 3 qx-news row photos for existing editorial art (e.g. brand-family-01, os-sales-desk, os-inquiries, mobile-inquiry) using the same <img>-replacement pattern as rk-stats/qx-projects.
- **stories[3].promise/output/connection (M05 summary, M06 outputs and end-to-end objective) and stories[1].connection** — rk-testimonials has no paragraph slot (marquee + cards only). Their conditions were moved onto cards 1/5/6; the rest stays in copy.mjs for #g08 (area C). Proposal: If wanted, add one caption paragraph under the marquee (a new element in rk-testimonials), or have area C print them in #g08's lede.
- **F03 and F04 as FAQ entries** — The closing FAQ has four slots and the brief assigned F12/F11/F13/F10. F03's substance is in the #story-1/#story-2 leads; F04's is in the hero body and card 2. Proposal: Place F03/F04 as questions on the workforce or enterprise page FAQ, or in #g02/#g04 detail.

Checks run by the area agent:

- npm run build — Passes: "wrote 38 pages" after the final change (build logs A-build1…A-build7 in the scratchpad). tools/fragments unchanged.
- BASE_URL=http://127.0.0.1:4321 node tools/verify-site.mjs — PASS: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. It ran on the build before the last one-word copy tweak (FAQ→常见问题); capabilities/index in both languages were re-checked after that tweak and also passed. Latin-residue report (informational, not a failure) on the zh capabilities page: "Sales Desk" (Sales/Desk are not in the verifier's ALLOWED list), "Form E" in the trade-document card, plus these, which were not caused by this change: the catalogue's 原产地证 · Form E, and the site email/URL.
- Heading line breaks, lines.js at 320/390/768/1024/1440/1920, zh and en (hero h1, macro h2, rk-award lines, cn-service heading, qx-news h2, rk-stats h2 and step labels, qx-projects h2, foundations halves, ladder) — All breaks at phrase boundaries. The only overflow flag: en "foundations" at 320 (1px). Heading screenshots then showed both languages' split label clipped at the screen edges on phones during the scroll animation, so the label was shortened (每项业务的 \| 四个基础 / What every \| area rests on). Re-shot at 390/320: nothing clipped. English step labels were shortened after they wrapped at 768.
- Screenshots zh+en at 1440, 768, 390 (all changed sections) and at 320/1920 (hero, cards, loop, orbit, stories, foundations, start); read by eye — Changed text renders and pictures now match topics. Fixed during review: orphan characters (text-wrap pretty), a long right-aligned lead, the English loop accent colliding with the 3-D cursor (/journey → /flow), and a 5-line English Sales Desk heading (→ compact form). Screenshots: scratchpad/shots/A/r1…r5.
- Foundations click panels (A-panels.js) at 1440x900, 1366x768, 1024x768, 1920x1080, zh+en — Panels open with aria-expanded=true. After shortening the panel lines, en panel 02 fits at 1440x900 (bottom 827) with its condition visible. At 1366x768 it extends 29px below the viewport depending on scroll position; the previous register-based panel was about the same length.
- Interactions (A-interact.js) zh/en at 1440 and 390 — All 16 in-page hrefs resolve to an element. The four #start FAQ items open on click (72px → 179–263px). Clicking the nine-step row link to #g07 lands the group heading at the viewport top. Pill labels are correct. No page errors.
- Floating pill width — Hidden below 992px (as before). At 992px the English pill is 834px wide, zh 589px; each label stays on one line.
- qx-orbit grid at 320–479 with and without the new note (A-exp5.js) — Identical geometry. The tag column cut off at 320/360 is not caused by this change.
- tools/verify-release.mjs capability-card assertion (L94–105), replicated locally (A-release-sel.js) — WOULD FAIL. Its selector 'a[href="#g01"] img,a[href="#g04"] img,a[href="#g07"] img,a[href="#g10"] img' now also matches images inside the new #g04/#g07/#g10 links. Scoping the selector with '.wrok-wrapper ' returns exactly the expected four images in both languages. The full verify-release run was not done (it targets the deployed site).
- Banned-wording scan of the rendered capability pages minus catalogue, cn-faq and cn-produce (A-jargon.mjs) — zh clean. en: only 'Trade OS', which comes from the shared navigation and was already there. No Chinese on the en page except the 中文 language switch.

Concerns raised:

- tools/verify-release.mjs L98 will fail after this change, because the new #g04/#g07/#g10 links required by the brief contain images. One-line fix (not in my area): prefix each part of the selector with '.wrok-wrapper ' (verified locally to return exactly ['brand-family-01','os-inquiries','brand-family-02','brand-family-04'] on both languages).
- #atlas currently still sits on the cn-service chapter (CHAPTERS in capabilityShowcase, area C). Until area C moves it to the catalogue, the hero's "Explore Capabilities" and the qx-news 完整目录 pill land on the Growth OS section rather than the full catalogue.
- The English nav label for the homepage is still 'Trade OS' (NAV in copy.mjs, and HOME_MONO '(Home)' → '(Trade OS)'); these exports are not in my area.
- The catalogue (CAPABILITY_GROUPS, area C) still carries prompt/提示词 and Quote Studio / Dormant Lead Reactivation wording in some glosses. The rows linked from the nine steps and the showcases point into it.
- Group links (#g02…#g14) land on closed catalogue accordion rows; the heading is visible and opens on click, but nothing opens a row from the URL hash. Area C may want to open the target row on arrival.
- The nine-step tag column (qx-orbit) is cut off at the right edge at 320–360px. The same geometry was measured with the new note removed, so the note did not cause it; left as is.
- CAPABILITY_SHOWCASE.catalogueLabel/catalogueNote and stories[4] were left untouched for areas B/C. The cardButton label 「聊聊你的流程」 (shared by cn-faq and cn-produce) was also left unchanged.
- Area-A additions are in CAPABILITY_SHOWCASE (stories 0–3 and 5: new availability fields; foundations: panel arrays replace picks) and in CAP_V6A in the V6-A block. stories[3] and stories[5] edits sit two unchanged lines from stories[4] (area B), so a merge should not conflict, but check if B also edited nearby lines.
- All 38 built pages changed because the site-wide pill labels changed; other areas' branches will conflict on generated files and need a rebuild after merging.

## Area B: Capabilities page — #story-5 creative section

Branch `v6/B` (507a04f2), merged into content/v6-placement.

I finished area B on top of the previous agent's partial commit (7fd3a18). Its structure was sound, so I kept it and fixed four problems:
- **Topic links on the same page did nothing.** Webflow's own scroll code takes over every same-page # link and changes the address without firing a hashchange event, so the topic stayed closed and ended up above the top edge. cn-faq.js now handles links to #creative-* itself (except Ctrl/Shift/Alt/Cmd clicks), updates the address so Back still works, then scrolls to the topic and opens it.
- **The step lists looked wrong.** The site's own list-item style made them 70% transparent, with tighter letter spacing and bolder text, which ran words together in English ("Authorizedreference").
- **The step lists did not move on hover.** The donor's hover effect slid the paragraphs but not the list above them; they now move together.
- **The picture card shrank on phones and tablets.** The new landscape picture made the card 342×214 at 390px. It now keeps the donor's near-square shape (342×360).

I also made small copy fixes:
- The video topic's extra paragraph now says quality checks are kept, and no longer says a plan "is ready".
- "colours" became "colors".
- The English steps for the adaptation topic use M09's own wording.
- "Short-form" can no longer split at its hyphen.

Result:
- The section keeps exactly seven accordion topics, in V6 order, and the Webflow open/close animation is unchanged.
- Each answer covers what you provide, what work is organized, what you review or receive, and closes with a bold availability line.
- Topics 2 and 3 use V6's three paragraphs word for word, plus M08/M09 detail, and each has a text step list in the donor's style.
- Topic ids and address links work: `capabilities.html#creative-video` and the others scroll to and open the topic on page load, when the address changes, and from links on the same page. The heading lands about 12% of the screen height from the top; no fixed bar covers it. Without JavaScript every answer stays readable.
- The small label above the heading is now 「AI 作图、视频与营销内容」 / "AI images, video & marketing" and is not cut off from 320 to 1920px.
- The line next to the button now links to #g09.
- The single picture is now the site's own aperture image (os-boot), with its registered alt text.
- `npm run build` ends with "wrote 38 pages" and verify-site passes. All work is committed as 507a04f; nothing was pushed, merged or deployed.

| Section | Chinese | English | Note |
|---|---|---|---|
| #story-5 section label (pill) | 为产品和市场做内容 → AI 作图、视频与营销内容 | Create content for products and markets → AI images, video & marketing | From CREATIVE_TOPICS.label. Measured at 320–1920px: 137px wide in Chinese and 172px in English, and neither is cut off. |
| #story-5 two-word heading | 图片 / 视频 (unchanged since 44f346e) | Images / Video (unchanged since 44f346e) | Checked against group 09's name 「AI 图片、视频与营销」 / "AI Images, Video & Marketing". It was already in place before this area started. |
| Accordion questions 1–7 | 1. AI 作图与图片编辑 / 2. AI 一键生成视频 · 建设中 / 3. 爆款结构再创作 · 建设中 / 4. 商品营销套件、详情页与图册 / 5. 多语言文案与社媒内容 / 6. 官网、搜索与 AI 搜索内容 / 7. 素材、版本与短视频剪辑 | 1. AI Images & Editing / 2. One-click Video · In Development / 3. Viral Creative Adaptation · In Development / 4. Product Marketing Kits & Catalogs / 5. Multilingual & Social Content / 6. Website & Search Content / 7. Assets, Versions & Short-form Editing | These replace the old catalogue-name rows (AI Creative Studio, Product · Sales · Social, SEO · GEO, Multi-language, AI Image & Video Workflow, Viral Replica, Clips). Each topic's `covers` list shows where the old rows went, and the build fails if any old row is left uncovered. The status label is kept whole and can only move to a new line after the dot. Named phrases are kept on one line: AI 一键生成视频, 再创作, Short-form. |
| Answer 1 (creative-images) | M07-01 input and output types, then M07-04 brand and product-fact consistency with local correction; you review versions you can compare and refine. Availability: 创意工作室已有基础；营销套件、局部检查与一键编排持续整合。 | Same scope. Availability: The creative workspace is present; packaged marketing, local checks and one-click workflows are being integrated. |  |
| Answer 2 (creative-video) | Step list 制作需求 → 脚本 → 分镜 → 画面 → 配音 → 字幕 → 审核与导出. Then V6 paragraph 1 word for word; a paragraph from M08-02/03/04/06 (a reviewable production plan before generation, quality checks, post-production using available tools and authorized assets, budgets/approvals/task status recorded); V6 paragraph 2 word for word; 开放说明：V6 paragraph 3 word for word (still being built; delivery = a playable, exportable file). | Step list Brief → Script → Storyboard → Visuals → Voiceover → Captions → Review and export. Then V6 English paragraphs 1 and 2 word for word, the same M08 paragraph in English, and Availability: V6 English paragraph 3 word for word. |  |
| Answer 3 (creative-viral) | Step list 有权使用的参考视频 → 拆解开场、节奏与镜头 → 结合自身产品和品牌 → 三个原创方向 → 制作与审核. Then V6 paragraph 1 word for word; M09-01/03 (source, usage rights and goal recorded; claims only from verified product facts); V6 paragraph 2 word for word; M09 outputs plus channel-data comparison; 边界与开放说明：V6 paragraph 3 word for word (structure only — no copying of footage, faces, voices, music, logos or watermarks; no guaranteed viral result; still being built). | Step list Authorized reference → Analyze hook, pacing and shots → Apply your product and brand → Three original directions → Production and review (M09 wording, same five steps as the Chinese). Then V6 English paragraphs word for word plus the same M09 detail. The label reads "Boundaries and availability:". |  |
| Answer 4 (creative-kits) | M07-02 marketing-kit planning, then M07-03 detail pages, catalogs and sales collateral in checkable layouts, reusable across sales, website, store and social (M07 value statement). M07 availability line. | Same scope, with the M07 availability line in English. |  |
| Answer 5 (creative-multilingual) | M07-06: social, product and sales copy with localization, one product story across channels, and campaign materials you can review. M07 availability line + 发布到外部渠道需要单独授权。 | Same scope + "Publishing to external channels requires separate authorization." |  |
| Answer 6 (creative-search) | M07-06 website and search content in business wording (no SEO/GEO terms): pages planned for how search engines and AI search read them; rankings and citations are not guaranteed; you approve the content plan and page copy before anything goes live. M07 availability line + the separate-authorization sentence. | Same scope. |  |
| Answer 7 (creative-assets) | M07-05 creative workspace and asset library, M08-05 versioned local rework, clip editing (old row 7), and M09-05 repurposing. M07 availability line + 长视频拆条、竖屏改版与字幕适配按已开放能力执行。 | Same scope + "Repurposing, reframing and caption adaptation depend on enabled capabilities." |  |
| Line next to the button | ◉ 对应能力组 → ◉ 对应能力组 09 (a link to #g09) | ◉ In the catalogue → ◉ Catalogue group 09 (a link to #g09) | At 992px (432px row): the line is 154px in English beside a 259px button, and 118px in Chinese beside a 160px button. The button label is not cut off at any width from 320 to 1920px. The button text and its contact.html link are unchanged. |
| Section picture (.cn-faq-image) | Alt 为产品和市场做内容 → 精密金属光圈开启（AI 概念图） | Alt "Create content for products and markets" → "A precision metal aperture opening (AI concept illustration)" | The file changed from assets/cinery/…black-white-minimal-portrait.jpg to the editorial os-boot picture. Its alt text, size and srcset come from tools/editorial-images.mjs. |
| Links to one topic (tools/blocks/cn-faq.js) |  |  | #creative-images, #creative-video, #creative-viral, #creative-kits, #creative-multilingual, #creative-search, #creative-assets. Each scrolls to its topic and opens it through the existing IX2 click, and only when the topic is closed. This works on page load, on hashchange, from same-page links (taken before Webflow's scroll code) and with Back. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| capabilities.html / en/capabilities.html #story-5, the line next to the button (.cn-text-size-regular) | `(no link; plain text 「◉ 对应能力组」 / "◉ In the catalogue")` | `#g09 (「◉ 对应能力组 09」 / "◉ Catalogue group 09")` | V6 §5.8/§12: link to the section's own detailed catalogue group (group 09, AI images, video & marketing) rather than the general catalogue. #g09 exists on both pages (build-site catRow). |
| capabilities.html / en/capabilities.html #story-5, the seven accordion topics (link targets, no href) | `(no ids)` | `ids creative-images, creative-video, creative-viral, creative-kits, creative-multilingual, creative-search, creative-assets` | V6 §12 sub-anchors for video and adaptation (plus the other five). cn-faq.js opens the named topic on arrival. No page links to them yet. |
| #story-5 button (.cn-main-button) | `contact.html` | `contact.html (unchanged)` | Demo/contact destination kept |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| #story-5 .cn-faq-image (zh and en) | assets/cinery/69610fd9688451fc190d2f0e_black-white-minimal-portrait.jpg (a man with a film camera) | assets/stargo-editorial/os-boot.webp with its srcset (precision metal aperture; alt from the editorial registry: 精密金属光圈开启（AI 概念图） / A precision metal aperture opening (AI concept illustration)) | V6 §5.6 conservative option (one picture for the whole creative scope) and §10 (picture and text must say the same thing). A studio portrait reads as a film-crew service. The aperture is the site's own image for images and video, already used on the homepage and in a blog cover. The frame, crop (object-fit: cover) and placement are the donor's. |
| #story-5 answers of items 2 and 3 |  | A wrapping row of text step chips (an ordered list) in the donor's style: translucent fill with a hairline border like the + button, 8px corners, 14px white text, grey arrows. The list moves with the paragraphs on hover. | The brief (item 4) and V6 §5.6/§10 ask for a short flow before the paragraphs, as text rather than an image. |
| #story-5 picture card at ≤991px (stacked layout) | Card followed the donor portrait's proportions (about 342×360 at 390px) | Same proportions, now set by aspect-ratio 1280/1349 (342×360 at 390px, 680×717 at 768px); without it the landscape picture gave 342×214 | Keeps the donor's layout after the picture change |

Layout adjustments:

- tools/blocks/cn-faq.css: `.cn-faq .cn-accordion-answer-text + .cn-accordion-answer-text { padding-top: 1rem }` — later paragraphs of an answer sit 1rem apart instead of repeating the donor's 2rem gap under the question.
- tools/blocks/cn-faq.css: `.cn-faq .cn-accordion-heading { text-wrap: balance }` (the Chinese page already balances these headings via stargo-fusion.css) and `.cn-keep { white-space: nowrap }` for status labels and named phrases; the font size is unchanged.
- tools/blocks/cn-faq.css: step list (.cn-answer-flow / .cn-answer-step / .cn-answer-step-text / .cn-answer-arrow). The list also carries .cn-accordion-answer-text so it inherits the donor's 2rem top and 10px left inset (0 below 480px) and the donor's hover slide. The list items are reset against the site's own li style (opacity .7, -0.5px letter spacing, weight 500).
- tools/blocks/cn-faq.css: .cn-answer-label shown in white at medium weight; the #g09 link is underlined (cinery draws links without decoration).
- tools/blocks/cn-faq.css: `.cn-accordion-content-item[id] { scroll-margin-top: 12vh }`; cn-faq.js reads this value when scrolling to a topic.
- tools/blocks/cn-faq.css: `@media (max-width: 991px) { .cn-faq .cn-faq-image { aspect-ratio: 1280 / 1349 } }` — keeps the donor's stacked card shape with the landscape picture.

Not placed:

- **V6.link.5 — homepage 图片视频详情 → capabilities.html#story-5** — The homepage and CAP_JUMPS belong to other areas. The homepage's four plain capabilities.html links were not changed, and CAP_JUMPS has no story-5 entry. Proposal: Point the homepage AI creative slot's details link to capabilities.html#story-5, or to #creative-video / #creative-viral for the video and adaptation mentions. These ids now open their topic on arrival.
- **M07.narrative / V6.img.07 (V4_15_ai-images.webp as the creative picture) and the V4_17 / V4_19 flow graphics** — The V4 reference images are not in the repository, and V6 §10 says they are reference material, not finished web assets. I used an existing editorial picture instead, and put the flows in as HTML text. Proposal: If an approved creative graphic is produced from V4_15, register it in tools/imagegen/assets-manifest.json and tools/editorial-images.mjs, then change PICTURE in tools/blocks/cn-faq.mjs (one line).
- **M07.summary (「AI 创意能力不只是写文案…」)** — The donor block has no intro paragraph slot (only the pill, the two-word heading, the (05) counter, the accordion, the question line and the picture). Its content is spread across items 1, 4 and 5. Proposal: None needed. To show it word for word, add a short lede above the accordion (a new element — a design decision).

Checks run by the area agent:

- npm run build (after every source change; last run after the final edit) — exit 0, "wrote 38 pages" (log: scratchpad/B-build8.log)
- BASE_URL=http://127.0.0.1:4322 node tools/verify-site.mjs — PASS: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. It reports stray Latin text on the Chinese capabilities page ("/one system", "/loop", "原产地证 · Form E", emails), all outside #story-5 and not introduced by this area.
- Language and wording check of the built #story-5 (text, alt, aria-label) — The zh page's only Latin is "AI"; the en page has no CJK. No banned technical terms (WeKnora, MCP, RAG, SEO/GEO, OpenMontage, prompt, ontology, Cinery…). The only links are #g09 and contact.html.
- Line breaks of all seven questions, the pill, the question line and the two-word heading (lines.js at 320/390/768/1024/1440/1920, zh and en) — No overflow. zh 320: 「2. AI 一键生成视频 ·」/「建设中」, 「3. 爆款结构」/「再创作 · 建设中」, 「4. 商品营销套件、」/「详情页与图册」, 「5. 多语言文案」/「与社媒内容」, 「6. 官网、搜索」/「与 AI 搜索内容」, 「7. 素材、版本」/「与短视频剪辑」; one line from 390 up except these two-line breaks at 1024. en: status and "Short-form" never split; at 320 item 7 takes 4 lines ("Short-form Editing" measures 196.5px against 189px available, so it cannot be kept together). The pill and the question line stay on one line at every width.
- Pill and question-row clipping (B-probe.js, 320–1920, zh and en) — Pill text scroll = client width (137/137 zh, 172/172 en). Button label scroll = client width (96/96 zh, 195/195 en). No horizontal page overflow at any width.
- Accordion open/close (real clicks and scripted clicks; 320, 390, 768, 992, 1024, 1440, 1920) — Answers open to their measured height, then the inline height is cleared (item 3: 924px zh at 320, 1278px en at 320). They close again to 0px. Nothing is clipped: answer, block and scroll heights are equal.
- Hover (1440 zh) — On hover the step list and the paragraphs both move to x=89 (translate 1.5rem); unhovered both sit at x=65. No hover transform on touch widths.
- Address arrival (B-arrive.js at 320/390/768/1024/1440, zh and en) — In every case the topic is opened and its heading sits at 109–150px from the top and is not covered (elementFromPoint returns the heading). Tested: loading #creative-video; changing the hash to #creative-viral (the video topic stays open); a same-page link to the already-open topic (stays open); a topic closed by hand and then linked (reopens). Back returns to #creative-viral. A Ctrl-click is ignored by cn-faq.js, but Webflow's scroll code still takes it (existing behaviour). Before the fix a same-page link left the topic closed, 75px above the top edge at 1440. No console errors.
- Without JavaScript (390, zh, #creative-video) — All seven answers are shown (heights 352, 758, 741, 352, 304, 352, 424px) and the browser scrolls to the anchor.
- Screenshots, before vs after (shots.js capabilities: zh/en at 390/768/1440, each topic opened in turn; montages at 768; arrival and hover shots) — Saved under scratchpad/shots/B/ and reviewed by eye. Section order, pill, heading, (05), seven rows, question row and picture card are all preserved. The chips and paragraphs read cleanly. The picture keeps the donor's card shape on phone and tablet.
- Language pages — The zh page shows Chinese only (plus AI); the en page shows English only.

Concerns raised:

- When several long answers are open at ≥992px, the picture card stretches with the accordion column (donor design) and the picture is scaled up and looks soft (worst with all seven open). With one topic open it looks fine. Possible fix, which is a design decision: cap the card height or keep its proportions on desktop.
- CAPABILITY_SHOWCASE (area A) now has copy that nothing renders: stories[4].label, .promise (it contains 「答案引擎」 / "answer engines"), .output, .connection and .image, and CAPABILITY_SHOWCASE.inCatalogue. Area A or the lead may want to update or remove them. I left them untouched.
- CREATIVE_TOPICS.items[].covers uses group-09 catalogue names as keys (AI Creative Studio, AI Image & Video Workflow, Viral Structure Adaptation, Product · Sales · Social Content, Multi-language Content, SEO · GEO · GEO Trust Content, Short-form Clip Editing). If area C renames any of them, the build stops with a clear message, and both stories[4].picks and these covers need the same rename. HEADING_WORDS still requires group 09's name to contain 图片/视频 and Images/Video.
- Webflow's scroll code takes over every same-page # link on the site: it updates the address without firing hashchange, ignores scroll-margin, and also takes Ctrl-clicks. cn-faq.js only takes #creative-* links. The new #g09 link, and area C's catalogue rows if they are meant to open on arrival, still go through Webflow and land on a closed catalogue row (its heading is visible).
- The donor accordion rows are plain divs with no ARIA or keyboard support. This was already the case and is not changed here.
- No page links to #creative-video / #creative-viral yet (see notPlaced V6.link.5).
- The new copy adds two cautious qualifications not worded in V5: rankings and AI-search citations are not guaranteed (item 6), and "you approve before anything goes live". Both follow V5/V6's no-promise rule, but please confirm them.

## Area C: Capabilities page — complete catalogue #g01–#g14 and #atlas

Branch `v6/C` (f4f3dc89), merged into content/v6-placement.

I kept the previous agent's partial work, which was usable: the detail data, renderer, CSS and arrival script were already in place. I fixed what was wrong and finished the rest. The branch builds ("wrote 38 pages"), and verify-site passes on port 4323 (38 pages, 0 errors, 0 failed requests, 0 broken links).

#atlas now sits on the complete catalogue section, and #story-1 is still the empty span in front of the first chapter. All 14 groups now open with their V5 detail, following the V6 §5.8 mapping: summary, sub-headings where a group covers several topics, lede, the V5 items (bold title + text), value line, business outputs and that topic's own availability note. The existing register list follows as the index.

Build-time checks now require:
- every group has detail;
- every listed V5 item appears exactly once;
- every topic M02–M16 has a group;
- the ten role counts add up to the 288 in the heading;
- every answer block carries the donor class that the hover animation moves.

Fixes to the previous agent's work:
- **Wording back to V5:** WhatsApp, Form E and HS 编码 restored in zh and en.
- **Missing items:** M16-03 and M16-04 were missing as items; g13 now carries all six M16 items.
- **M12-06 moved** from g06 to g12, as the checklist maps it.
- **Visual defect:** cinery's hover animation slid only part of each answer 1.5rem sideways, so the new sub-headings and the role table stayed behind. The whole column now moves together.
- **Real bug:** a genuine click on an in-page link (for example the `#g07` macro card) neither opened nor aligned the row. Webflow's scroll module cancels the click, pushes the hash without a hashchange event, and glides to a position measured at click time. Its glide is kept; the script now opens the row at once and re-aligns it once the page stops moving.
- **Register glosses that overclaimed** were reworded (item names/keys unchanged): Long-Horizon Control (the hours/days promise), WhatsApp Sales ("most buyers"), AI Creative Studio (the whole kit) and Short-form Clip Editing (now carries its enabled-scope condition).
- **Band note:** it now states a register count with its meaning, computed from the register and split into two pieces so narrow widths no longer break inside 「登记」.
- **Spacing:** the register rows are tighter (a recorded layout adjustment) and the English sub-headings no longer split badly.

| Section | Chinese | English | Note |
|---|---|---|---|
| #atlas anchor (capabilityShowcase CHAPTERS / wrapper) | #atlas 从获客开场块 div.cn-service 移到 section.cn-capmap（完整目录）；#story-1 仍是其前的空 span | Same on en/capabilities.html | Every in-page 'complete catalogue' link (24 × href="#atlas") now lands on the catalogue band; band label measured at 156px (390) / 240px (768, 1440) from the top, section top 24px. |
| Catalogue band note | 登记在册的全部能力，按组排列。上面的成果引用的就是这些条目。 14 个能力组 · 157 条目录条目（登记范围，不代表均已上线）。 | Every capability in the register, by group. The outcomes above draw from these same entries. 14 groups · 157 register entries (the documented scope, not a claim that every entry is live). | Figures computed from CAPABILITY_GROUPS (assert that the text states the total). catalogueNote itself (CAPABILITY_SHOWCASE) is unchanged, since my area does not own it. |
| #g01 工作空间与经营总览 | 摘要(P02)；「工作空间」: M14 一句说明 + M14-01 + 开放说明(M14 开放说明 + 原生电脑客户端/移动端/小程序分阶段)；「经营总览」: M15 一句说明 + M15-01..04 + 工作成果 + 开放说明 | Summary; 'The workspace' (M14 summary, M14-01, availability incl. native Windows/Mac clients, mobile, mini-programs phased); 'The owner's overview' (M15 summary, M15-01..04, outputs, availability) | Implementation terms from V5 are rendered in plain words: 协作矩阵→协作分工表, orchestration→team assignment views, 系统地图→系统关系图. |
| #g02 主动获客与商机判断 | M02 一句说明 + M02-01..06 + 给老板的价值 + 工作成果 + 开放说明（核心流程建设中，真实数据与客户触达按授权接入） | M02 summary, six items, business value, outputs, availability | Verbatim V5. |
| #g03 市场渠道与客户发现 | V6 §4.8 渠道说明为导语；发现客户 / 承接沟通（企业邮件、WhatsApp、阿里国际站与网站询盘）/ 内容传播（对外发布单独授权）；开放说明：显示平台名称不表示默认开通或具备全部收发权限 | Discover accounts / Carry conversations / Publish content; note that a listed platform is not default access or full read-and-write permission | Composed from V5 H09 plus the channel parts of M02-01, M03-01 and M07-06. The full items live in g02, g04 and g09. |
| #g04 询盘与多渠道沟通 and #g05 CRM 与客户全景 | g04: M03 一句说明 + M03-01/02/04/05 + 工作成果 + 开放说明；g05: CRM 导语 + M03-03/06 + 业务主线 + 工作成果 + 开放说明 | Same split in English | M03-01 restored to V5 wording with WhatsApp; MOQ rendered as 起订量 / minimum order quantities. |
| #g06 产品与企业知识 | 知识库导语 + M12-01/02 + 报价与回复的产品依据（M04 产品事实）+ 关键原则 + 工作成果 + 开放说明(M12) | Knowledge lede, M12-01/02, product facts behind quotes and replies, key principle, outputs, availability | M12-06 moved out to g12. |
| #g07 报价、PI 与商业文件 | M04 一句说明 + M04-01..06 + 关键原则 + 工作成果 + 开放说明（含：报价获批不等于已经发出，发出也不等于客户已经收到） | Same; availability adds that an approved quote is not yet a sent one, and a sent quote is not proof of receipt | M04-05 restored to 原产地证及 Form E 资料; M04-06 restored to HS 编码 / HS-code references. |
| #g08 ERP、订单与履约 | 摘要明确包括 ERP 与商城经营；小标题「ERP 经营」(M05 全六项+价值+成果+开放说明)、「履约回款」(M06 一句说明+M06-01..04)、「服务复购」(M06-05/06+完整目标+成果+开放说明：正式申报、证书签发与资金支付仍由有权人员和机构处理，不会由 AI 自动完成或获批) | 'ERP & commerce' / 'Delivery & collection' / 'Service & repeat business' with the same content and boundary | The register still has no ERP/commerce entries (see concerns); the detail carries ERP. |
| #g09 AI 图片、视频与营销 | 「AI 作图与品牌内容」(M07 全部)、「AI 一键生成视频 · 建设中」(M08 全部，开放说明：能打开页面不等于成片可以交付)、「爆款结构再创作 · 建设中」(M09 全部，「复刻」边界：不复制原片、人脸、声音、音乐、标志或水印，不承诺成为爆款) | 'AI images & brand content' / 'One-click video · In development' / 'Viral creative adaptation · In development' (V6 label) | The two video workflows are explained separately, each with inputs, process, outputs and conditions. |
| #g10 数字员工与团队协作 | 「288 个专业数字岗位」：M10 一句说明 + 十类岗位表（15/50/16/5/20/4/14/19/129/16，合计 288）+ M10-01..04 + 价值 + 成果 + 开放说明（288 是岗位目录数量，不是同时执行数量，也不等于替代 288 名真人）；「多个 AI 员工交流协作」：M11 全部 + 场景示例 + 成果 + 开放说明（深入协作分阶段开放） | '288 specialized AI roles' with the ten-group table and count clarification; 'AI employees working together' | The build asserts 10 groups summing to 288, and that the heading states 288 in both languages. |
| #g11 自动化与日常办公 | M14 图解信息为导语 + M14-02..06 + 工作成果 + 开放说明 | Same | M14-04 keeps 不绕过登录、安全验证或平台规则. |
| #g12 企业业务关系与上下文 | M12 一句说明 + M12-03..06 + 老板可以这样理解 + 工作成果 + 开放说明（高级关联、企业资料模板与新企业资料接入分阶段完善和验收） | Same; 'business relationship map', never 'ontology' |  |
| #g13 权限、审批与经营控制 | 「权限、审批与记录」(M15 价值句为导语 + M15-05/06 + 开放说明)；「开通范围与验收」(M16 一句说明 + M16-01..06 + 交付顺序 + 成果 + 开放说明) | 'Permissions, approvals and records' / 'What is enabled, and how it is accepted' | M16-03's editorial wording 「原资料仍记录……」 is rewritten as a plain statement of the same gap. |
| #g14 长期经验与持续改进 | 主动意识定义（不是人的主观意识，也不是无限制自行决定）+ M13-01..06 + 主动循环 + 成果 + 开放说明（企业级主动工作与统一长期记忆需分阶段验收；关键判断仍由人负责） | Same | M13-03 title uses 定时检查 / scheduled checks rather than 后台唤醒 / wakeups. |
| Register glosses (CAPABILITY_GROUPS) | 长任务控制: 长时间任务保留目标与进度，可暂停、恢复和接力；即时沟通销售: 许多海外买家常用的即时沟通渠道，经授权接入；AI 创意工作室: 围绕真实产品，组织产品页所需的图片与销售素材；剪辑与短视频: …按已开放的能力使用 | Keeps long-running work on its goal, with pause, resume and handoff / The messaging channel many overseas buyers use, connected with authorization / Organizes the images and sales material a product page needs, from real product facts / …where the capability is enabled | The previous agent's gloss and zh-name rewording from the WIP commit (e.g. Growth OS 主动获客, 计划内跟进, CRM 记录维护, 资料导入, 数据整理与定期作业, 经营记录, conditions on Mobile Companion, Voice Console, Export Tax Rebate, Browser Automation, Computer Use, 288, video items) is kept. Item names (keys) are unchanged. |
| Catalogue behaviour (js/stargo-catalogue.js) |  |  | Arrival on capabilities.html#gNN (load and hashchange) scrolls the row 24px below the top and opens it via the row's own IX2 click, only if the row is closed. In-page links that Webflow's scroll module handles (pushState, no hashchange) keep Webflow's glide; the row opens at once and is re-aligned after the page settles. Nothing moves if the reader scrolls or clicks meanwhile. #atlas is aligned without opening anything. Clicks inside an open answer no longer collapse the row; the heading and plus still toggle. The plus gets role=button, a name, aria-expanded, aria-controls and Enter/Space. Without JS, all answers are open. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| capabilities.html and en/capabilities.html: the #atlas anchor itself (no href edited) | `id="atlas" on div.cn-service (Growth OS opener, first chapter)` | `id="atlas" on section.cn-capmap (complete catalogue)` | V6 §5.1/§12: 'all capabilities / complete catalogue' links must land on the directory. The 24 existing in-page href="#atlas" links (rk-hero button 完整目录, 9 rk-insight rows, 7 qx-news, 7 qx-projects; owned by other areas) now reach the catalogue band. |
| All #g01–#g14 targets (in-page macro cards #g01/#g04/#g07/#g10, blog ../capabilities.html#g04/#g07, and links other areas are retargeting) | `Scrolled to a collapsed row (and the in-page Webflow glide landed short when layout shifted)` | `Row scrolled 24px below the top and opened, on load, on hashchange and on Webflow-handled in-page clicks` | V6 §12: links into collapsed content must reveal it. No href values were changed. |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| Catalogue rows #g01–#g14 (open state) | Register entries only (name + gloss per line, 44px apart) | Detail column first: summary at 18px/17px #e4e4e4; sub-headings 18px/17px white with hairline rule and text-wrap: balance; ledes; items with a left hairline and bold titles; value, outputs and availability lines (the note at 15px #c4c4c4). Then a '目录条目 / Register entries' heading and the register at a 4px + 12px rhythm. | V6 §5.8 / §10: detail inside the existing accordion. No new images; donor type sizes are kept, nothing is shrunk. |
| #g10 role table |  | Two-column table (role group, count) with a total row, 15px, fits 320px | V6 §6.2 ten-category counts; readable on phones as rows |
| Catalogue band | one flowing note | Note + count pieces that wrap between 'figure' and 'meaning' | Avoid breaks inside a word at 390/768 |

Layout adjustments:

- css/stargo-fusion.css V6-C: inside .cn-cat-detail the donor's 2rem top padding and 10px inset on answer text are removed; the inset is applied once on the detail container (0 below 480px).
- Register entries after the index heading: padding-top 4px instead of the donor's 2rem (first entry 14px). Entries were 44px apart; they now follow the detail list's rhythm.
- Register heading: its 10px donor inset becomes a margin, so its rule line starts on the same edge as the detail's rules.
- Sub-headings and the role table carry .cn-accordion-answer-text, so cinery's hover slide (1.5rem) moves the whole answer column together; their rules are one class stronger than the donor's.
- Availability note directly after a list: 16px top margin; availability note colour #c4c4c4 inside the detail (the donor's #6f6f6f was too faint).
- .cn-band-count > span { display:inline-block } so the band wraps between the count and its meaning.
- scroll-margin-top: 24px on #atlas and on the rows (there is no fixed top bar on this page; the pill is at the bottom).
- English in-development headings use U+00A0 so '· In development' stays with its words.

Not placed:

- **ERP / commerce register entries in #g08** — The brief limits me to glosses and zh names of CAPABILITY_GROUPS. New items would change the 157 count and the rk-stats arithmetic, and add lookup keys other areas don't expect. ERP and commerce are fully explained in the #g08 detail. Proposal: In a later round, add 2–3 register items to group 08 (e.g. 'ERP Operations' 企业经营（ERP）, 'Commerce & Dealer Portal' 商城与经销商门户), then re-check the band count and rk-stats.
- **V5 'visual narrative' flow lines (e.g. 产品 × 市场 × 客户类型 → …)** — They describe diagrams; the catalogue has no diagrams. Only M14's narrative is used, as the g11 lede. Proposal: Place them beside the matching illustrations in the story sections (areas A/B) or as captions when V4 reference graphics are adopted.
- **P02 九步细看 note** — It belongs to HOME_LOOP_TABLE (the nine-stage section), outside area C. Proposal: Area owning HOME_LOOP_TABLE.lede.

Checks run by the area agent:

- npm run build (final, after the last commit) — exit 0, 'wrote 38 pages', no diff left after build
- BASE_URL=http://127.0.0.1:4323 node tools/verify-site.mjs — PASS: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links (run twice, after each full build). Report-only Latin list for zh capabilities: 'Sales Desk' (approved product name, new in my text) and 'Form E' (V5 trade document; 原产地证 · Form E was already there). '/one system', '/loop' and the two email/site addresses are not from area C.
- Build-time assertions added — Pass: detail for all 14 groups; every listed V5 item (M02–M09, M11–M16 ×6, M10-01..04) placed exactly once; M02–M16 each in a group; role table 10 groups = 288 and the heading states 288 (zh/en); band count states the total; no nested or missing .cn-accordion-answer-text in answers
- Arrival on #gNN (C-matrix/C-open: all 14 rows × zh/en × 320/390/768/1440) — Every row landed with its heading at top=24px and opened; no element overflowed the row or viewport; document width = viewport width
- Arrival/toggle script test (C-arrive) zh 1440, en 390, zh 768, zh 390 — Load #g08 → open, top 24; click inside answer → stays open; heading click closes, then reopens; location.hash=#g04 → opened, top 24; keyboard Enter/Space on the plus toggles with aria-expanded; #atlas → section top 24, no rows opened; no console errors
- Real in-page link clicks (C-click) zh 1440 and en 390, #g07 and #atlas — Before the fix: row not opened, landing off (116px / 1794px). After: Webflow glide kept, row opened within 600ms, heading at 24px after settling (4.5s), keyboard Enter on the same link reopens it after the reader closed it; #atlas lands at 24px; no errors
- Cross-page #atlas arrival (C-atlas), zh/en × 390/768/1440 — Exactly one #atlas; #story-1 is still an empty span; section top 24, band label at 156px (390) / 240px (768, 1440), all rows closed. Screenshots viewed.
- Hover column test (C-hover) zh 1440 g10 — Before the fix, sub-heading/table stayed at 165px while text slid to 189px. After, all blocks move 165→189 together; no overflow
- Sticky/scroll sections below open rows (C-flow) zh 1440, rows closed vs g08+g10 open (+5,354px) — Identical results. The only hidden-on-screen items below the catalogue in both runs are closed Mono FAQ answers and scroll-scrubbed ladder letters, which reveal as expected in the screenshots. No errors.
- No-JavaScript (C-nojs) zh 390 — All 14 answers open (1,351–4,218px) and visible; #g10 lands at 24px
- Line breaks (lines.js) for new sub-headings and band note: zh and en at 320, 390, 768, 1024, 1440, 1920 — zh sub-headings stay on one line at every width. English breaks are balanced (e.g. 'One-click video ·' / 'In development'). The band breaks between count and meaning; no overflow flags.
- Story-5 accordion answers that reuse the two changed g09 glosses, zh 320/390/1440 and en 320 — Wrap normally, no overflow
- Screenshots viewed (shots/C): arrive-g08, atlas-*, flow-open-*, open-g08/g10/g03 zh 390, open-g09/g13 en 390, open-g01/g09 en 1440, open-g13/g02 zh 768, hover-g10, index-g02 zh 390, index-g03 en 1440, and before/capabilities-zh-1440/g08 and before/capabilities-zh-390/atlas for comparison — Text renders in one language per page; nothing clipped; pictures unchanged (the catalogue has none)
- Not run — No real-device test. No 1024/1920 screenshots of opened rows (only line-break measurements at those widths). The other verifiers (verify-release, verify-editorial, etc.) were not run.

Concerns raised:

- #g08's register still has no ERP or commerce entries (checklist V6.g08). The detail covers ERP and commerce; adding register items needs a decision (count 157, rk-stats arithmetic, new keys).
- Some English register item NAMES (keys I was told not to rename) still read technical or brand-like on en/capabilities.html: 'Computer Use', 'Browser Automation', 'AI Employee Runtime', 'Scripts & Data Jobs', 'Skill Optimizer', 'Agent-to-Agent Communication', 'SEO · GEO · GEO Trust Content', 'Reddit/Google Search/Facebook/YouTube GEO'. A rename needs coordination with the blocks that look them up (tools/blocks/* picks).
- Webflow's scroll module (app.schunk) glides to a target measured at click time, so in-page anchors can land short when sections above change height on the way (seen: 2,113px short at 2s). I only correct this for #atlas and #g01–#g14. #story-1..6 links (other areas) may show the same drift.
- The template stylesheet sets li/p { opacity: .7 } globally, so catalogue body text (register entries before, now detail too) renders at 70%. Sub-headings and the role table are at full strength. This was not changed.
- CAPABILITY_SHOWCASE.catalogueNote (「上面的成果引用的就是这些条目」) is not in my area and was left unchanged; the band count after it is mine.
- In this worktree the #story-5 accordion still shows g09 glosses as answers, so my rewording of 'AI Creative Studio' and 'Short-form Clip Editing' appears there too. Area B may replace those answers.
- verify-site's report-only ALLOWED list lacks 'Sales', 'Desk' and 'Form', so approved names (Sales Desk, Form E) show as Latin residue on zh pages. The tool was not changed.
- The unused `rows` code in PAGES['capabilities.html'] (area A) still builds `<span id="gNN">` strings that are never inserted; harmless dead code.
- I squashed this session's WIP commits into f4f3dc8 on top of the orchestrator's 12c0436, which is untouched. Nothing was pushed, merged or deployed.

## Area D: Workforce page

Branch `v6/D` (e49a797b), merged into content/v6-placement.

I kept and finished the earlier agent's WIP. It was coherent and already built. The workforce page now covers the V6 §6 plan and V5 M10, M11, M14, P04, F02 and F08 in both languages, with the same scope in each:
- **Hero:** "288 specialized AI roles", followed by the P04 description and the note on what 288 counts.
- **Role cards:** five cards labelled as examples, covering research, sales, product, finance and coordination.
- **New block:** the ten role groups with their counts and a 288 total (the build fails if the counts don't add up to 288), plus the note that 288 is a role-directory count.
- **Pink panel:** covers roles, teams formed by task, handing work over and approving it, and the browser desktop with the M14 limits.
- **Team scenario:** three cards in the M11 order, each labelled 协作场景示意 / Illustrative scenario. The P04 messages are now page text. The paragraph below has the M11 summary, the V6 §6.3 example, the limits and the note on what is still being built.

In this session I fixed defects I measured in the WIP state:
- **Chinese hero line:** V6's 「组成你的 AI 团队」 broke inside 组成 at 320, 390 and 768. It now reads 「按工作需要，组成 AI 团队。」.
- **Hero description:** 「束。」 sat alone on a fifth line at 390. The last sentence is shorter now.
- **English "Example role" label:** it wrapped on the cards, so each card's hidden name panel showed through the card's bottom edge (8.6px at 768). It now reads "Example", and the operations cards say "Ops" so the round arrow keeps its size.
- **Small collage card:** its name showed along the card's bottom at 390. It now sits lower below 480px.
- **English note text:** "browser" and "first" were hidden under the round photo badge at 390. The note copy is shorter now.
- **English panel heading:** "workspace" ran out of its box at 768. It now reads "Roles, teams and a desktop".
- **Line breaks:** the Chinese step line broke inside 分配; the English role-group heading broke at "task-"; and the English headings left one word alone ("needs." / "result.") on the last line. All fixed.
- **Parity and content:** I added the M11 summary, the M11-05 pause/takeover sentence, the M10 value line and the M14 note that desktop clients, mobile and mini-programs come in phases. The Chinese desktop item has no Latin text ("Windows / Mac" became 桌面客户端).

Checks:
- The build passes and writes 38 pages.
- verify-site: 38/38 pages pass.
- verify-interactions: all checks pass.
- verify-fixes: all workforce checks pass. 8 pricing/contact checks fail, and the same 8 fail on the base commit 44f346e.
- verify-restore: 297/298. All workforce checks pass. The one failure was a local socket error loading en/terms; that page loads cleanly on its own.

| Section | Chinese | English | Note |
|---|---|---|---|
| Hero title (split per character) | 288 个专业数字岗位。 / 按工作需要，组成 AI 团队。 | 288 specialized AI roles. / Build the team your task needs. | V6 §6.1. The Chinese drops 你的: with it, the per-character balance broke inside 组成 at 320, 390 and 768 (measured). Now the break falls at the comma at 320, 390 and 768, and the line is one line from 1024 up. |
| Hero description | 不是只有外贸销售，也不是 288 个相同的聊天窗口。企业支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务，都有对应的专业角色。288 指岗位目录数量，按配置、预算和权限启用。 | This is more than a trade-sales team or 288 identical chat windows. Specialized roles span … professional services. 288 is the role-directory count; activation depends on configuration, budget and access. | P04 body plus the short M10 note on what 288 counts. The Chinese last sentence was shortened so the text ends on a full fourth line at 390. |
| Five marquee role cards (plus the loop copy) | 市场研究 / 销售跟进 / 产品规格 / 财务对账 / 统筹协调 AI 员工; grey label 岗位示例; group labels 市场 / 销售 / 产品 / 财务 / 运营 | Market Research AI / Sales Follow-up AI / Product Spec AI / Reconciliation AI / Coordination AI; label Example; groups Marketing / Sales / Product / Finance / Ops | Five cards, marked as examples, from different departments. No headcounts or output figures. The build checks that there are exactly five cards and that every card has the same label. |
| Collage card inside the desktop item | 报告 AI 员工 · 岗位示例 · 运营 | Reporting AI · Example · Ops |  |
| Pink panel heading | 有岗位，有团队，有工作台 | Roles, teams and a desktop | The two languages now say the same thing. The English was "…a workspace", which ran out of its box at 768. |
| Pink panel: three items and four bullets | 按任务组队 (M10-02); 交办与确认 (M10-03); 网页桌面与 AI 办公 (M14 summary; 网页端是当前重点；语音、自动化与外部动作按开通范围开放，桌面客户端、移动端与小程序分阶段完善。); bullets 业务应用、文件与素材 / 表格、文档与报告 / 语音交办，转成任务 / 授权网页任务与账号连接 | Teams formed by task; Delegate and approve; Browser desktop and AI office (…The browser comes first: voice, automation and external actions depend on the scope enabled, and desktop clients, mobile and mini-programs are phased in.); matching bullets | M14 wording, with its limits and roadmap line. |
| Black note in the desktop collage | 浏览器里的企业桌面 / 网页优先 | A business desktop on the web / Web first | Short words, so nothing is hidden under the photo badge at 390 or 430. |
| Cards A and B | 有岗位的 AI (M10-01); 交接有记录 (M10-04 + 暂停或人工接管后仍能接着推进 + M11-04: 共享任务依据，不等于共享全部数据，也不会转移其他员工的权限) | AI with a job; Handoffs on record (…so work can continue after a pause or a human takeover… Sharing task context does not open all company data or pass on another role's permissions.) |  |
| New block: ten role groups (after the pink panel, before the team cards) | 十类岗位，一个可按任务组织的数字团队。 + P04 role-card introduction + 交办业务目标 → 选择员工或团队 → 分配任务 → 查看工作成果 → 批准关键动作 + ten rows (Chinese group name and 「N 个岗位」) + 合计 288 + note (288 是岗位目录数量：可按任务选择、配置与派工的专业数字岗位，不是同时执行的数量，也不代表替代 288 名真人员工。实际启用、同时执行与操作范围，受企业配置、预算和权限约束。) | Ten role groups. One task-focused AI workforce. + the English introduction and steps + ten rows (English name and "N roles") + Total 288 + the equivalent note | Built from the template's own careers-list classes, with rows as divs rather than links, inside the standard lx-section shell. The build checks: ten groups, whole positive counts, a sum equal to the total, a total of 288, P04's heading, and a note that mentions 288. |
| Team scenario: three stacked cards | 协作场景示意 · 01 交办目标，分派岗位 / · 02 交流信息，并行处理 (with the messages 请核对产品规格。/ 已补充可引用的卖点资料。/ 这项承诺需要有权人确认。) / · 03 复核成果，交人确认 | Illustrative scenario · 01 Set the goal, assign the roles / · 02 Share information, work in parallel (with the P04 English messages) / · 03 Check the results, then a person decides | M11 order: goal and roles, then shared information and parallel work, then checked results and a person's decision. |
| Display line, static labels, paragraph, heading and button | 一个目标，一个团队。; labels 岗位 · 协作 · 确认; paragraph: M11 summary + 协作场景示意：开拓一个新的目标市场。 + the V6 §6.3 example + limits on rounds, budget and actions + 基础员工选择与派工已有记录，更深入的团队交流协作仍在完善。; heading 不是各聊各的，而是一起做完。; button 聊聊你的方案 | One goal, one team.; Roles · Teamwork · Review; the matching paragraph (Complex work can be assigned… Illustrative scenario: entering a new target market… still evolving.); A shared goal, connected work and a coherent result.; Discuss your plan | The Chinese heading is shortened from P04's 「而是一起把事做完」: at every width from 320 to 1920 the full wording broke as 「…，而」/「是…」. |
| LX_WORKFORCE (not shown as a page; parts are read by about.html and the capabilities orbit graphic) | store1.name 认识数字员工 (About page button); heroDesc 按任务选择岗位，组成 AI 团队，关键决定由人确认。; features, cards, gradient and feat2 rewritten to follow V6 §6 (no 秒级组队, 永远在线 or 调度中枢) | Meet the AI Workforce; Select roles by task, form an AI team and keep key decisions with people.; the English follows the same changes | Contracts kept: heroDesc contains AI and 团队/Team, and ctaLogo is still two words. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| workforce.html / en/workforce.html | `no change` | `no change` | No href was changed in this area. The hero button, the answers button and the role cards still go to contact.html as before (the builder's existing rewrites were left alone). |
| about.html button fed by LX_WORKFORCE.store1 | `label 288 位 AI 员工 / 288 AI Employees` | `label 认识数字员工 / Meet the AI Workforce (href unchanged; set by cn-about-projects)` | Label only, per the brief (H07.cta wording) |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| workforce team card 02 (.lx-answers-card, 2nd) | picture 6942c7318ab7f0a234efab41_Group 34.png — two chat bubbles with English words painted into the image, shown on both language pages | the template's own text-free blob (Vector (7).png, already used in the card icon rows) plus three message bubbles as page text (P04), styled in V6-D | The Chinese page showed English painted into an image, and the P04 messages need to be real text. Measured with transforms off: the messages fit inside the card at 320–1440 and the card never scrolls. At 768+ the messages are 384x214 (en) and 384x149 (zh), close to the picture's 384x222. Below 480 the card grows with its text (en 416px at 320). |
| workforce, between the pink panel and the team cards |  | new text-only block using the template's careers-list styling (dark rows, count column, total row with a pink outline) | V6 §6.2 ten role groups (the one block the owner approved) |
| hero role cards / collage card | template name panels hidden below each card edge | unchanged images; English label shortened and the collage card's panel sits lower below 480px so no text shows through the card edge | Measured leak fixed: 0px on all cards at 320/390/768/1024/1440. At 430 the collage card shows 1.9px, the same as the template. |

Layout adjustments:

- V6-D: .lx-v6-roster .lx-careers_sticky-grid uses 1fr 1.25fr (template 1fr 1.5fr) at 992–1279px only, so the English role-group heading column is 427px at 1024 instead of 384px. All rows still show group and count on one line (checked at 1024).
- V6-D (below 480px): .lx-v6-collage-card .lx-name-views-content gets margin-top 16px, the same fix the file already applies to the hero cards. It keeps the two-line name 「报告 AI 员工」 hidden below the card edge.
- V6-D: word-break keep-all on the zh pink-panel heading, role-group heading and step line. The builder joins the steps with a no-break space before each arrow, so lines break only after an arrow.
- V6-D: the English role-group heading is two inline-block sentences with balanced wrapping.
- V6-D: text-wrap balance on .lx-feature-title-holder .lx-heading-style-h1 and .lx-v6-team-title (visible effect on English only; the Chinese already had it).
- Kept from the earlier WIP (V6-D): zh balance on the team display line; role-group list styling (count column, outlined total row, heading not sticky at 991px and below, tighter row padding at 479px and below); message-bubble styling.

Not placed:

- **M14.outputs (客户清单、产品表、报价表、报告、纪要、待办与授权的重复工作)** — No free slot on the workforce page without another block, and V5/V6 assign it to capabilities #g11 (another area). Proposal: Put it in the #g11 detail. Or, if the owner wants it on this page, add one clause to the end of pink-panel item 3 in LX_FEATURE_WORKFORCE.abilities[2] (that text is ordinary flow text).
- **M14-01..M14-06 full detail** — Belongs to capabilities #g01/#g11 per V6 §5.8. The workforce page carries only the summary, the bullets and the limits. Proposal: The capabilities area puts the six items in the #g01/#g11 detail.
- **M11-02 / M11-05 full item lists (directed messages, question handoff, progress notifications; claim status, evidence, failure reasons)** — Shown only as an example (message bubbles) and in summary (card B). Card B and the team paragraph are already the longest texts in their slots. Proposal: Add them to capabilities #g10 (V6 maps M11 there), or add one sentence to LX_FEATURE_WORKFORCE.answersBody.

Checks run by the area agent:

- npm run build (final) — PASS — exit 0, "wrote 38 pages"
- Build checks added in the workforce builder (5 example cards with one label; 10 groups; counts sum to total; total is 288; P04 heading; note mentions 288; English heading has 2 chunks; step line has 5 steps; role-group block sits between the pink panel and the team cards; one chat picture replaced; collage card class) — PASS (the build runs them)
- BASE_URL=http://127.0.0.1:4324 node tools/verify-site.mjs (all 38 pages) — PASS — 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. Reported Latin text on workforce.html is only the footer email/site. Rerun after the final build on workforce, about and capabilities (zh+en): PASS.
- BASE_URL=… node tools/verify-restore.mjs (full, chromium, 7 widths) — 297/298 PASS. All workforce checks pass, including section 2b (zh and en at 390/768/1280/1440) and the per-width workforce pages at 320–1920. The 1 failure is page en-terms-1440, a page.goto net::ERR_NO_BUFFER_SPACE (local socket exhaustion, not a site defect). en/terms.html loaded cleanly on its own afterwards (verify-site ONLY=en/terms.html: PASS).
- BASE_URL=… QA_OUT=… node tools/verify-fixes.mjs — workforce 320/390/768 title and roles: PASS in zh and en. 8 FAILs in pricing (2 checks × 2 languages: timeouts, .pricing-tabs-menu no longer exists) and contact 320/390 field widths (× 2 languages). PRE-EXISTING: the same 8 fail on the base commit 44f346e (git archive of 44f346e served on 4324).
- BASE_URL=… node tools/verify-interactions.mjs — PASS (exit 0), including 'workforce hero cta' and 'en/workforce hero cta' (the hero button reaches the contact form)
- Heading line breaks (lines script, transforms off) at 320/390/768/1024/1440/1920, zh and en: hero h1 ×2, hero description, role-group heading, step line, panel heading, team heading, three card headings, display line — Final: zh hero 「288 个专业」/「数字岗位。」 and 「按工作需要，」/「组成 AI 团队。」 at 320/390, one line each from 1024. Role-group heading breaks only between phrases. Step line breaks only after an arrow. Card headings break at the comma. En: 'Build the team' / 'your task needs.' at 390/768; 'Ten role groups.' / 'One task-focused' / 'AI workforce.' at every width including 1024. No overflow flagged anywhere.
- Hidden name panels showing through card edges (hero cards + collage card), zh/en at 320/390/430/768/1024/1440 — 0px everywhere except 1.9px on the collage card at 430 (template baseline: 1.9px). Before the fixes: 8.6px at en 768 and 6.3px at 390, both visible.
- Clipped-text scan of the whole page at 320/390/768/1024/1440, zh/en, compared with the live site — No visible cut text. The remaining flags are hidden name panels on rotated or moving cards, which the transforms-off measurement shows at 0px. The live site gets the same flags.
- Message card fit (transforms off) zh/en at 320/390/768/1024/1440 — All three messages inside the card, card never scrolls
- Screenshots, looked at by me: full-page walks zh/en at 390/768/1440 (shots/D/after1 = WIP state, shots/D/after2 = final) compared with shots/before; targeted shots of the role-group block, total row, messages, team paragraph and desktop item at 390/768/1440; hero, role-group block and team at 320 and 1920; stepped walks through the stacked cards at 320 and 390; zoomed shots of the note, collage card and 5th hero card; live comparison at 320/390 — Every changed text renders. The role-group block is readable on phones (group + count per row) and its heading stays pinned on desktop. The stacked-card scroll animation, marquee loop and hero reveal still play. Each language page shows one language only (Latin on zh is only AI and the footer email). See concerns for the 320 overlaps the template already had.
- Hover/accordion/tabs — The page has no accordions or tabs (岗位/协作/确认 are static labels). Hover reveal on the role cards: the panels' hidden positions were measured and the arrow width checked (≥27px at 768, 32px at 1024), but hover was not triggered on screen.

Concerns raised:

- Outside my area: tools/copy.mjs NOTICES.related[1] (the related links on notices.html) still says 「(288 位 AI 员工)」「每一个都有岗位，秒级组队。」 / "(288 AI employees)" "Every one has a job; teams in seconds.". That is a speed claim and the old 288 wording, and it links to workforce.html.
- Outside my area: the header comment in tools/blocks/cn-about-projects.mjs (~L205) still quotes the old LX_WORKFORCE.heroDesc 「AI 团队已经上线。」 / "Your AI team is already online.". The build check reads the live value and passes, so only the comment is out of date.
- Outside my area: the blog cards at the bottom of workforce.html (POSTS summaries) still mention "Quote Studio" and 「审批闸门」. They belong to the blog area.
- Wording that departs from V6/P04 for line-break reasons (owner may want to confirm): zh hero 「按工作需要，组成 AI 团队。」 (V6 has 组成你的 AI 团队) and zh team heading 「不是各聊各的，而是一起做完。」 (P04 has 一起把事做完). The English example label is "Example" rather than "Example role", and two English group labels read "Ops" rather than "Operations" (the role-group table below still says Operations).
- Existing template behaviour, not fixed: at 320px the hero's floating photos overlap the hero text in both languages, and the longer English P04 description runs under the lower-right photo (the text stays on top). At 320 the collage's round badge also covers part of the black note in both languages; an existing stargo-fusion.css comment says 320 is deliberately left alone there. On phones, card 02's heading is partly under card 01 during part of the stacked-card scroll, as it was with the template's own copy.
- Merge: every built page differs only by the stargo-fusion.css ?v= hash, so generated pages will conflict with other areas. Rebuild after merging rather than hand-merging HTML.
- verify-fixes has 8 failures (pricing ×4, contact ×4) that also fail on the base commit 44f346e. The checks look stale for the current pricing and contact markup.
- Visual change needing sign-off: the chat-bubble picture in team card 02 (with English painted into the image) was replaced by page-text bubbles over the template's text-free blob image (V6 type C/B change).

## Area E: Intelligence page

Branch `v6/E` (6ea529b8), merged into content/v6-placement.

I kept most of the previous agent's WIP commit. It was coherent and already built. I then finished and corrected it.

Sections and wording:
- The page keeps its address, nav label, section order, template imagery and all scroll, sticky and reveal behaviour.
- Every slot now describes the layer in business terms: hero, the 3 feature cards, the 6 object cards, the 4 gradient steps, the proactive statement and bubbles, the 4 "no …" words, the 288 section and the closing card.
- One static section, #lx-context (an approved V6 type-B addition), sits between the "no writing" band and the 288 section. It carries:
  - P03's headline and lede;
  - enterprise knowledge (企业知识库) and the business relationship map (业务关系图), explained separately;
  - M12-04/05/06;
  - proactive work with the M13 loop;
  - durable tasks and handoffs (M13-03, M11-05);
  - long-term memory (M13-04);
  - the availability note (P03, M12, M13, F09).
- Improvement (M13-05/06, plus 「高级改进仍在完善」) is in the closing card's body text.

What I changed on top of the WIP:
- Proactive statement: now 「新机会、期限，不靠人记」, closer to P03. The WIP 「主动跟进，不靠人记」 and my first attempt 「机会、期限，不靠人记。」 both touched the screen edge at 320 or 390.
- Memory item: added 后续任务. Relationship map: added M12-05 (rules and approvals).
- Availability note: added 受控改进已有基础 (controlled improvement has foundations).
- Knowledge item: retitled 企业知识库 and opens with 「公司的资料室」. Item 3 retitled 同一个客户.
- English wording that sounded like AI jargon was replaced: "prompting" became "nudging" and the architecture labels are gone.
- English slots shortened where they broke or failed the check (the V6-E CSS block also balances the English headline slots):
  - hero links are now Context / Improving;
  - the 288 title is "288 AI roles.";
  - the team card title is "Task teams";
  - card 2 and card 3 texts were shortened, and card 3's title is now "Proactive". These now pass the verify-restore "card fully readable" rule at 1024 and my probe at 320.
- The WIP's zh line-breaking rule for the 288 headings also reached workforce.html's article headings (same class). The build now adds a class, `.lx-team-section`, to the 288 section only, and the rule is limited to it.
- The build now fails if architecture wording comes back on the page (企业本体, 调度中枢, 提示词, Ontology, Orchestrator, prompts and similar).

Checks:
- Build: 38 pages.
- verify-site: all 38 pages clean.
- Intelligence part of verify-restore: 26/26. I ran it as a trimmed scratch copy, not the full script.
- Intelligence checks in verify-fixes and verify-interactions: all pass.

| Section | Chinese | English | Note |
|---|---|---|---|
| Hero (.lx-hero-desc, two link buttons) | 说明：「AI 理解公司，并主动推进工作」（原「不是聊天机器人，是运营层。」）；按钮：业务理解 / 读懂业务关系（原 企业本体 / 给 AI 一份企业模型）；持续改进 / 用结果改进（原 进化 / 可治理的自我进化） | "Know the company. Keep work moving."; buttons: Context / How work connects (was Ontology / Give AI a model of your business); Improving / Judged by results (was Evolution / Governed self-evolution) | V6 headline 「让 AI 理解你的公司，并主动推进工作」 cut: with 让 the hero broke into 3 lines (「让 AI」/「理解公司，」/…) from 1024 up. Anchors #lx-ontology / #lx-evolution unchanged. |
| Three feature cards (.lx-expandable-item) | 业务关系：客户、产品、报价、订单和负责人，不再是互不相干的记录。｜按流程落地：先了解业务，再安排资料、岗位与审批，用真实样本验收。｜主动工作：关注机会、期限和异常，先提出有依据的建议，再按授权推进。 | Relationships: Customers, products, quotes, orders and owners, connected. \| Real workflows: Workflow first, then data, roles, approvals and real-case tests. \| Proactive: Flags leads, deadlines and risks; acts only as authorized. | Replaces 企业本体 / 前置部署 / 主动执行. P03 titles 企业业务关系 / 按真实流程落地 break at 320 and 768 (5-char slot), so 5-char forms are used. Card 2 carries V6 §7's M16 steps. The English texts are shorter than P03's: the full P03 English is 5 lines, and the open card at 1024 holds only 4. |
| Six object cards (lxOntologyList, desktop + phone mirror) | 客户：是谁，来自哪里，之前谈过什么。询盘：想采购什么，还缺哪些信息。报价：采用什么价格，哪一版已经批准。订单：约定了什么，当前走到哪一步。出货：什么时间交付，还缺哪些资料。任务：谁负责，何时完成，结果如何核对。 | P03 English: Identity, source and previous conversations / Requirements and information still missing / The price used and the version approved / The agreed commitment and current progress / Delivery timing and missing records / Owner, deadline and how the result will be checked. | Unused 7th entry (AI 员工 with 技能/记忆 jargon) removed from the source. |
| Gradient steps (.lx-gradient-section) | 观察真实流程 → 整理业务关系 → 安排 AI 参与的步骤 → 用实际结果改进 | Observe the workflow → Map the business context → Assign useful AI work → Improve from real outcomes | Was 给运营建模 / 把 AI 放进流程 / 用结果改进平台. |
| Proactive band (.lx-cta_wrapper big text + 12 bubble slots) | 大字「新机会、期限，不靠人记」（原「主动，不是被动」）；气泡：重点客户三天没有回复 / 老客户可能到了补货周期 / 新进口商出现采购信号 / 报价发出后，还没有下文 / 交期临近，出货资料还没备齐 / 一份报价在等负责人批准 / 某个产品在一个市场的搜索需求上升 / 发现变化 → 理解上下文 / 提出建议 → 获得确认 / 推进任务 → 核对结果 / 沉淀经验，留给下一次 / 证据不足时，先停下来请人判断。 | "Leads and deadlines, not left to memory." plus the same bubbles in English | No agent job titles (跟进 AI 员工 / 市场信号 AI 员工 / 调度中枢 removed). The bubble-count build assertions (48 avatars) are unchanged. |
| "No …" words (.lx-no-writing) | 不再 / 等提醒 / 等回复 / 丢上下文 | No / nudging / waiting / forgetting | Each word stays on one line and at most 4 CJK characters (verify-restore passes). |
| NEW #lx-context plain-explanations section (static, between the no-writing band and the 288 section) | 标题「不只是读文件，/更要读懂你的公司。」+ P03 说明；六项：企业知识库（公司的资料室，回答注明依据，冲突或过期提示核实）、业务关系图（资料库 vs 关系图；报价权限、订单条件和审批规则）、同一个客户（跨邮箱/CRM/ERP 对应；导入资料先进待审核区）、盯住机会与期限（M13-01/02 + 七步循环）、任务不断线（目标、负责人、认领、截止、证据、暂停/接管/恢复；取决于已配置条件）、长期记忆（客户偏好、沟通摘要、项目决定、已做事项与后续任务、结果、做事方法；来源、修正、权限，不把猜测当事实）；开放说明（已有基础 / 持续完善 / 不是主观意识，关键判断由人负责） | "More than reading files. / Know the company behind the work." plus the P03 lede; Enterprise knowledge, A relationship map, One customer, every system, Opportunities and deadlines (with the loop), Tasks that carry on, Long-term memory; Availability note | Type-B addition. 3/2/1 columns (≥992 / 768–991 / <768). No IX classes, so it reads without JavaScript. |
| 288 section (.lx-team-section) | 「288 个岗位，」「分工协作，把事做完。」；卡片 按任务组队：一项复杂任务，可由研究、销售、产品和创意等岗位分工完成……基础选人与派工已有记录，更深入的团队交流仍在完善。；按钮 认识数字员工 → workforce.html；长任务标题「工作暂停，/背景不必/从头解释。」 | "288 AI roles." / "Divide the work. Finish it together."; Task teams card with the M11 text and qualification; Meet the AI Workforce → workforce.html; "Resume the task / without rebuilding / the context." | Was 288 个 AI 员工。同一份企业现实。 / AI 员工团队 / 长任务执行·数小时、数天、数周. |
| Closing card (#lx-evolution) | 「把有用的方法留下，」「把无效的改动撤回。」；正文：每次执行都留下记录：做了什么，是否达到目标，人在哪里修正过。从成败中复盘出更好的做法，先测试、与现行做法比较，批准后再逐步采用；效果不足可以撤回，失败的证据留给修复或人工处理。高级改进仍在完善。 | "Keep useful methods." / "Withdraw ineffective changes." plus the matching English body text | Removed 公司本身就是模型 / 可治理的自我进化 / 提示词、技能 / 模型权重. The text is about as long as the text it replaces. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| 288 section button (feat2Button) | `workforce.html, label 认识 AI 员工 / Meet the workforce` | `workforce.html, label 认识数字员工 / Meet the AI Workforce` | Label only; href unchanged |
| hero button 1 (store1) | `#lx-ontology, label 企业本体 / Ontology` | `#lx-ontology, label 业务理解 / Context` | Label only; anchor kept (verify-interactions clicks it); it lands on the business object cards |
| hero button 2 (store2) | `#lx-evolution, label 进化 / Evolution` | `#lx-evolution, label 持续改进 / Improving` | Label only; anchor kept; it lands on the improvement card |
| new section | `(none)` | `id="lx-context" (target only, not linked from anywhere)` | New content section; scroll-margin set |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| intelligence.html #lx-context (new) |  | Static section in Lifelogx styles: centred h2 (pink / white), grey lede, 6 outlined cards (1px #262627, 23px radius, 1rem gap) with eyebrow, h4 and body, pink flow line, grey availability note | V6 §7 requires readable body-text locations; the template's slots are headlines, fixed-height cards and bubbles |
| all template imagery | template phone screens, overlays, bubble avatars, CTA photo | unchanged | Owner decision (2026-09-06, build comment); V4_25/V4_27 replacement is a separate type-C task |

Layout adjustments:

- Added the #lx-context section: grid of 3 columns ≥992px, 2 columns 768–991px, 1 column <768px; card padding 2rem (1.5rem <480px); grid top margin 4rem (3rem <480px). CSS is in the V6-E block.
- Build adds class lx-team-section to the 288 section, so the zh keep-all rule for its headings no longer reaches workforce.html's .lx-flex-text-center article headings (the WIP rule did).
- zh: word-break keep-all + overflow-wrap anywhere on the 288 headings (scoped), the gradient headings and the closing card lines. Breaks: 「分工协作，」/「把事做完。」 at 320–390; 「把有用的方法」/「留下，」 below 1024 via <wbr>.
- text-wrap: balance on the #lx-context title spans and item titles; text-wrap: pretty on #lx-context paragraphs; zh keep-all on the flow line. The build inserts a no-break space before each arrow.
- en: text-wrap: balance on the proactive big text, gradient headings, 288 headings and closing card headings, to avoid one-word last lines (e.g. 「…not left to」/「memory.」 at 1920). All four selectors exist only on intelligence.html.
- No font-size, height, animation or image changes.

Not placed:

- **V6 §7 headline verbatim 「让 AI 理解你的公司，并主动推进工作」** — The hero description must stay two lines. 「让 AI 理解公司，」 alone is wider than the ~7em box at ≥1024, so the text is placed as 「AI 理解公司，并主动推进工作」. Proposal: Use the full sentence in META['intelligence.html'] title or description (META owner), or as a small eyebrow above the #lx-context h2.
- **P03 proactive heading in full 「机会、截止时间和待办事项，不必都靠人记着。」** — The big-text slot has no side padding and breaks only at punctuation. Runs longer than 4 glyphs touch the screen edge at 320/390. Proposal: Kept as 「新机会、期限，不靠人记」; the full meaning (opportunities, deadlines, pending approvals) is in #lx-context 盯住机会与期限. If the full sentence is required, add side padding to .lx-center-text-holder on phones (a small scoped CSS change).
- **P03 entry titles 企业业务关系 / 按真实流程落地 and full P03 English entry texts** — The title slot beside the icon holds 5 CJK characters at 320 and 768 (measured 「企业业务关」/「系」). The full English texts need 5–6 lines; the open card at 1024 holds 4 (verify-restore failed). Proposal: Accept the 5-character titles (业务关系 / 按流程落地) and the shortened English. Otherwise redesign the fixed-height cards (out of scope).
- **V6.img.12 / V6.img.13 (V4_25 business-context and V4_27 proactive-work visuals)** — Type-C asset replacement. The owner kept the template imagery on this page, and the reference images are not web-ready. Proposal: Separate asset task: replace the gradient-section overlay or a sticky phone screen with a cleaned V4_25/V4_27 derivative labelled as a diagram.

Checks run by the area agent:

- npm run build — PASS — ends with 'wrote 38 pages' (final run after the last source edit; generated output identical to the committed files)
- BASE_URL=http://127.0.0.1:4325 node tools/verify-site.mjs (full) — PASS on the final run: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. The earlier first run had one FAIL (en/contact.html net::ERR_NO_BUFFER_SPACE, machine socket exhaustion); it passed on re-run. zh intelligence Latin residue is only the footer email/domain.
- verify-restore, intelligence part (scratch copy of sections 2 and 1 restricted to intelligence.html; full verify-restore not run) — 26/26 PASS: lifelogx states zh/en at 390/768/1024/1280/1440/1920 (hero word, sticky cards fully readable, gradient headings, no-writing words one line and not behind the phone, closing card text audit, reverse scroll, resize) and page audits zh/en at 320–1920. An intermediate run failed en-1024 card 2 (copy one line too long); fixed by shortening it.
- node tools/verify-fixes.mjs — 20/28. All 6 intelligence checks pass (320/390/768 title and anchor, zh and en). 8 FAILs are outside area E and pre-date this work: pricing .pricing-tabs-menu / .w-tab-link selectors (absent from pricing.html at base 44f346e too) and contact 320/390 field widths.
- node tools/verify-interactions.mjs — 16/16 PASS, including 'intelligence anchor lands' in zh and en
- Line-break probe (scratch E-fit.js) of every changed heading at 320/390/768/1024/1440/1920, zh and en — No overflow. zh: hero 「AI 理解公司，」/「并主动推进工作」 everywhere; big text 3/3/2/2/1/1 lines with margins; gradient headings one line; 288 and closing-card breaks at punctuation or <wbr>; context titles one line. en: balanced breaks, no orphan words.
- Card readability probe (verify-restore rule) at 320/390/768/1024/1280/1440 — All three zh and en feature cards readable (en card 3 was not readable at 320 with a two-line title; fixed).
- Screenshots (real wheel scrolling), zh and en at 320/390/768/1440/1920, compared with the before shots at 390/768/1440 — Viewed. Section order, imagery, sticky cross-fade, gradient fade, bubble marquee and CTA preserved; new section readable on phones; no clipping except template mid-animation frames. Saved in shots/E/after/<lang>-<width>/ and contact sheets shots/E/after-390.png and after-1440.png.
- Language purity — en .lx-scope contains no CJK. zh .lx-scope Latin tokens are only AI, CRM, ERP, STARGO WORK.
- Jargon — The build asserts that 企业本体/前置部署/调度中枢/自我进化/提示词/模型权重/Ontology/Embedded FDE/Orchestrator/Evolution/model weights/prompt(s) are absent from the page body. A copy scan found only the kept anchor ids.
- Anchor #lx-evolution click — 1440: lands at top 0. 390: lands 888px past the card, identical on the live site (https://stargo.pages.dev), so not introduced here.
- verify-editorial.mjs — NOT RUN

Concerns raised:

- Pre-existing: at 390px the #lx-evolution link lands 888px past the card, on the live site as well. The document shrinks by ~888px during the smooth scroll (template mobile layout). Out of scope for a content change.
- META['intelligence.html'] (not area E) English description still says 'proactive prompts'; zh says 主动提醒. Suggest 'proactive reminders'.
- Every generated page's stargo-fusion.css ?v= hash changed, so these generated lines will conflict with other areas. Rebuild after merging rather than resolving by hand.
- Older comments outside the V6-E block (stargo-fusion.css ~L1216 and ~L1600–1630) still describe the old copy (主动，不是被动 / 不是聊天机器人 / 长任务执行). The rules still apply to the new copy, as documented in the V6-E block; the old comments were not edited, to stay inside the area.
- LX_TAGS is also referenced by LX_WORKFORCE, which no build code uses (dead export). Neither was changed beyond the WIP.
- English big text at 320 has thin (~8px) side margins ('deadlines,' at 64px). It stays inside the viewport; 320 is not part of the lifelogx state checks.
- The English closing-card subtitle (P03 'Withdraw ineffective changes.') takes 3 lines on phones because of the word 'ineffective'.
- Blog pages (e.g. enterprise-ontology-explained, approval-gates) still show architecture terms in body text. They belong to area G, not area E.
- verify-fixes pricing and contact failures pre-date this work and fall outside area E.
- I added id lx-context, which nothing links to yet. A future 'details' link could use it.

## Area F: Enterprise page

Branch `v6/F` (42a02d04), merged into content/v6-placement.

The previous agent's WIP (a4c8631) was usable, so I kept it and finished the area. Its copy was mostly right; I fixed these:
(1) The 13-control list contained 「各公司、各品牌数据分开」. That item holds a 、 so a reader would count 14, not 13. I renamed it and added a build check that no listed item contains a list separator.
(2) The WIP hero panel pictures were pale. The white panel text was unreadable on them at 1440, so I switched to dark pictures. The page also showed os-cockpit twice and os-login three times; now no picture is used twice.
(3) The six delivery steps wrapped so that a step's second line started under its number. They are now a numbered list with a hanging indent. The Webflow/GSAP letter reveal still starts from the same state as on the live site.
(4) Fitting fixes: the English h1 broke inside its second sentence (fixed with scoped balance). The zh table button and the zh/en note buttons wrapped at 768. The zh table caption split a word at 768. "conversations" ran 8px into the next table column at 768.
(5) The WIP's committed zz-f-before.html copies are removed.
The page now covers: P05 headline; the four V6 §8.1 panels; the owner cockpit (M15/P05); the six V6 §8.4 steps with a 「预约企业演示」 button; honest stats (288 role directory, 13 controls in business language, 3 deployment options confirmed per enterprise, service levels as an Enterprise-plan item); the five P05 management components; an availability and boundary note (P05, M16-01, F13, F14); and a six-row business connection table ("off by default · connected per authorization"). The built pages contain none of the forbidden technology terms. Build: wrote 38 pages. verify-site: PASS. Not deployed, not pushed.

| Section | Chinese | English | Note |
|---|---|---|---|
| Eyebrow + h1 (hero title) | (企业管理与交付) / 把工作交给 AI，决定权留在企业。 (P05 headline with the second 「把」 dropped so the balanced split falls at the comma; 「把工作交给 AI，」/「决定权留在企业。」 at 320, 390, 768, 1024, 1440 and 1920) | (Enterprise control & delivery) / Delegate the work. Keep the authority. (now 「Delegate the work.」/「Keep the authority.」 at every width via scoped text-wrap: balance) | Headline was 能干活，也管得住。 / Built to act. Built to be controlled. |
| Four sticky hero panels (story[0..3]) | (决定) 关键决定由企业掌握…付款、正式申报和专业审阅，始终由有权人员确认。 \| (核对) 结果可以核对…已提交不等于已完成，核对过才算数。 \| (连接) 连接企业已有的业务。邮箱、客户记录、产品知识、ERP 和网盘，经企业授权逐项接入同一个工作流程。不必先假定要换掉现有软件，保留、接入还是调整，按企业情况确认。 \| (经营) 看经营，不只看 AI 对话… | (Decisions) / (Results) / (Connect) / (Oversight), same scope and conditions | Replaces 权力/证据/接入/模型, which listed API, MCP, Activepieces, Windmill, workspace bridge, channel plugins, model runtime and ontology. Panel 3 gained the F11 nuance (replacement is not assumed; what to keep, connect or adjust is confirmed with each company). |
| Owner cockpit band (introLabel/intro, beside os-cockpit) | (老板驾驶舱) 管理者要看的不是 AI 忙了多久…驾驶舱把商机推进、交付状态、用量与预算边界、待审批事项、任务负责人、阻塞和实际结果放在一起。数据只来自已接入的系统，缺的就标明缺失。看得见，管得住，查得清。 | (The owner’s cockpit) Managers need more than busy AI … Figures come only from connected systems; anything missing is shown as missing. Visible, controllable, traceable. | No figures shown. The picture is a concept illustration; its alt text says so. |
| Delivery steps (approach) + button | (落地顺序) 01 选择一条业务：定目标与验收标准。 02 准备企业资料：产品、客户、知识与规则。 03 连接授权账号：可读、可改、需审批，逐项说清。 04 配置员工与审批：谁来做，谁来批。 05 验证实际成果：用真实样本核对结果。 06 再扩大范围：跑通一条，再定下一条。 Button 预约企业演示 | (Delivery steps) 01 Choose one workflow… 06 Expand the scope… Button Request a Demo | Replaces the deployment list (cloud / dedicated / private / 企业 SLA) and the button 联系 STARGO 前置部署团队 / Talk to a STARGO FDE. Deployment options moved to stat 3 as options confirmed per enterprise. |
| Stats (statsLabel + 3 rows) | (数字口径) 288 个专业数字岗位，按企业设定的权限与预算启用（岗位目录数量，不是同时运行的数量）。 \| 13 项管理控制：应用开通管理、账号与岗位权限、关键动作审批、操作与审批记录、登录凭据集中保管、数字员工的工作边界、不同企业的数据相互隔离、出错即停并报告、新做法先小范围试用、效果不足可撤回、结果核对、进度可见、人工接管。 \| 3 种部署方式：网页云端、专属企业环境、私有化部署，按企业需求逐项确认；服务等级属于企业版事项，按项目另行约定。 | (What the numbers count) 288 specialized AI roles, enabled within the permissions and budgets the company sets (a role directory, not concurrent runs). \| 13 management controls: … \| 3 deployment options: browser-based cloud, a dedicated enterprise environment or private deployment, confirmed with each enterprise. Service levels are an Enterprise-plan item agreed per project. | The 13 items map one for one to the old engineering list (灰度发布, 可观测性, 租户隔离, …). The build asserts the figure equals the item count, every item appears in both languages, and no item contains a list separator. stats[0] still has a bare numeric value and its first comma splits noun from qualifier, as cn-price-card needs. |
| Quote card | (原则) 「对企业真正重要的是：可管理、可停止、可追踪、可验证，而不是 AI 在对话中声称“已经完成”。」 STARGO WORK · 决定权始终在人 | (The principle) “What matters is work you can manage, stop, trace and verify — not an AI message claiming it is done.” STARGO WORK · People stay in command | M15 value line. No invented person or history. |
| Five cards (cardsTitle + cards) | 五个管理组件：能力与应用管理（企业开通了什么、哪些工作可做、哪些仍需配置，用量与预算上限多少）/ 账号与岗位权限（明确谁可以查看资料，谁可以修改记录）/ 关键动作审批（报价、对外触达和重要承诺，由有权人确认）/ 工作与结果记录（做过什么、谁批准、实际结果是否符合要求；出错即停，可转人工）/ 账号连接与保护（通过企业授权连接业务账号，不向不必要的岗位开放访问） | Five management components: Capability & app management / Account & role permissions / Approval of key actions / Work & result records / Account connection & protection, with matching role lines | Replaces 能力中心/身份与权限/审批服务/审计台账/凭据管理 (the last one said 「凭据不进提示词」). V6 §8.3's usage/budget and pause/takeover are carried in cards 1 and 4. Account authorization and data protection are kept in cards 2 and 5. |
| Note beside the cards (was the origin story) | (开放范围与边界) 管理与控制已有基础；看板指标、跨系统动作和高级分析，依赖真实数据接入与验收。其他功能按企业配置与确认范围分阶段开放，能打开某个应用，不等于整条流程已经验收。部署方式、服务范围和数据要求由双方另行确认，不作默认承诺。付款、正式申报、合同与合规审阅，始终由企业有权人员或相应机构决定。 Button 规划一条流程 | (Scope and boundaries) … Button Plan a workflow | The origin story (「不是从一张 SaaS 产品需求表起步」) is removed from this page. It remains on the About page (ABOUT.story). The button was 预约演示 / Book a Demo; the new label fits the 124px available at 768. |
| Connections table (#table) | (默认关闭 · 按授权接入) 业务连接 (6)；列：(业务)(可以连接什么)(接入前要确认)；行：客户与沟通 / 产品与知识 / ERP 与商城 / 办公与文件 / 财务、物流及其他业务服务 / 跨系统自动化（先人工跑通、确认规则，再逐步扩大自动执行范围）；按钮 查看连接详情 | (Off by default · connected per authorization) Connections (6); (Area)(What can connect)(Confirm first); Customers & messages / Products & knowledge / ERP & commerce / Office & files / Finance, logistics & other services / Cross-system automation; button See connection details | Replaces the 7-row 接入方式 table (API, MCP, connectors, Activepieces, Scripts & Data Jobs, Workspace Bridge, Channel Plugins). Six rows: V6's five plus automation (M14-06 / P05: agree the rules before expanding automation). The count in the title is automatic, and awardsTable's row assertion still holds. |

Links:

| Where | Old | New | Reason |
|---|---|---|---|
| enterprise.html and en/enterprise.html, connections table button | `capabilities.html (label 看能力全景 / See all capabilities)` | `capabilities.html#g11 (label 查看连接详情 / See connection details)` | V6 §12: details buttons go to the relevant group, not the page top. #g11 (自动化与日常办公) is where V6 §5.8 places M14 account connection and automation. It is an accordion heading that stays visible and opens on click. verify-site found no broken links. |
| Delivery-steps button | `contact.html, label 联系 STARGO 前置部署团队 / Talk to a STARGO FDE` | `contact.html, label 预约企业演示 / Request a Demo` | V6 §8 / owner brief: plain-language demo request. Only the label changed. |
| Note button beside the five cards | `contact.html, label 预约演示 / Book a Demo` | `contact.html, label 规划一条流程 / Plan a workflow` | V5 F10 (start with one workflow). Only the label changed; it fits the 124px available at 768. |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| Hero panel 1 (.image-about._01, CSS) | os-cockpit | brand-family-04 (layered permission boundaries) | Matches 决定. os-cockpit now belongs to the cockpit band two screens lower. Dark enough for the white panel text. |
| Hero panel 2 (.image-about._02) | os-agent-center | os-loading (records set out one after another) | Matches 核对 (results on record); dark. |
| Hero panel 3 (.image-about._03) | os-login | brand-family-03 (separate lanes joining one block) | Matches 连接 (existing business joining one workflow). The pale os-login / os-desktop / brand-loop were tried first and left the panel text unreadable at 1440. |
| Hero panel 4 | os-trade-execution | os-trade-execution (unchanged) | Still fits 经营. |
| Band pictures images.work[0..2] | os-agent-center, os-login, os-trade-execution | os-cockpit (beside the cockpit text), brand-glow-tall (beside the six steps), os-desktop (beside the numbers) | V6 §8.2 and §10: each picture sits beside the text it illustrates. None is the legacy UI mock with invented figures. |
| Five cards images.cards[0..4] | os-agent-center, os-login, phone-approvals, os-trade-execution, brand-ontology | os-agent-center, phone-agents, phone-approvals, brand-ontology, os-login | Capabilities/apps, role permissions, approvals, linked records, gated account connection. No picture is used twice on the page. |
| pricing.html / en/pricing.html price card (side effect of ENTERPRISE.stats[0]) | 288 个 AI 员工 / 在企业设定的权限范围内工作。 (one line) | 288 个专业数字岗位 / 按企业设定的权限与预算启用（岗位目录数量，不是同时运行的数量）。 (2–3 lines) | The stat now says it counts a role directory. Checked at 320/390/768/1440 zh and en: no overflow. At 320 in English the noun line wraps to 2 lines beside the stars. |

Layout adjustments:

- V6-F CSS 1 (kept from WIP, comment updated with current measurements): .about-grid > .about-max-w { padding-bottom: 100px } at ≥768px, so the now-taller text column does not end directly on the quote card.
- V6-F CSS 2 (WIP): zh quote card text-wrap: pretty.
- V6-F CSS 3: #table column split .8/1.35/1.35, plus new column-gap: 12px on the header and rows. At 768 'conversations' had run 8px into the middle column. The English first-column label also became 'Customers & messages'.
- V6-F CSS 3b: below 479px, #table cells are centred and text-wrap: balance (no short 「户记录」-type last lines).
- V6-F CSS 4: enterprise-only hero background overrides for .image-about._01–_03 (same specificity, later in the file). .image-about is used only on enterprise.html.
- V6-F CSS 5 + fromStudio(): each delivery step is written as <span class="ent-step"><span class="ent-step-n">NN</span><span class="ent-step-t">…</span></span>, laid out as a grid (1.55em number column, .3em gap, .3em between steps, text-wrap: pretty). The GSAP word/letter split keeps the nested spans, and the letters start at translate(0%,100%)/opacity 0 exactly as on the live site. The build asserts each step starts with a two-digit number.
- V6-F CSS 6: html[lang^=en] body:has(.about-grid) h1.inner-title { text-wrap: balance } — scoped to enterprise, so the English h1 breaks between its two sentences.
- Wording shortened to fit, no font changes: zh table caption (默认关闭 · 按授权接入) fits one line at 768. Table button 查看连接详情 and note button 规划一条流程 / Plan a workflow no longer wrap at 768. English approach label is (Delivery steps).

Not placed:

- **M16-06 industry delivery (data templates, workflow configuration, onboarding, training; browser first, native/mobile phased; scope per agreed delivery)** — The note slot already carries P05 availability, M16-01, F13 and F14 and runs 8+ lines in a narrow column. Adding more would push it far past the cards. The page has no other text slot for it. Proposal: Put it on contact.html (area G, 'what a demo covers'), or add one sentence to ENTERPRISE.note if the owner accepts a longer note: 「按行业提供资料模板、流程配置、企业接入与培训；网页端为当前重点，其他终端分阶段完善。」
- **M16-02 / M16-03 / M16-04 topic-level availability lines on the enterprise page** — Only the general phased-availability rule is on this page. The topic lines belong to the Growth OS/Sales Desk, creative, workforce and intelligence placements (areas A, B, D, E). Proposal: No enterprise change if those areas carry them. Otherwise a fourth sentence in ENTERPRISE.note.
- **M15-03 / M15-04 (workforce management matrix, control center) as named items** — The five card slots follow the P05 component names. Proposal: Covered in #g01/#g10 by area C.

Checks run by the area agent:

- npm run build — Passes: 'wrote 38 pages'. The new assertions (story 4 / stats 3 / cards 5 entries, stat figure equals item count, items present in both languages, no separator inside an item, two-digit step numbers) all pass. A rebuild after the final commit leaves the tree clean.
- BASE_URL=http://127.0.0.1:4326 node tools/verify-site.mjs (run after the final build) — PASS: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. enterprise.html latinResidue shows only the footer email and website; en/enterprise.html has none. Other latinResidue lines are on other pages and existed before this change (e.g. the pricing FAQ still names API/MCP/Activepieces/Windmill).
- Forbidden-term scan of built enterprise.html and en/enterprise.html (visible text, meta, alt) — 0 hits for API, MCP, SDK, RAG, ETL, SLA, FDE, Activepieces, Windmill, Playwright, WeKnora, ontology/本体, prompt/提示词, canary/灰度, runtime, tenant/租户, orchestrator/调度中枢, 前置部署, 可观测, guardrail/护栏.
- Screenshots, zh and en at 390/768/1440 (shots.js walk, real wheel steps), compared with shots/before — All changed text renders and pictures sit beside matching text. The hero sticky/slide and the letter reveals still play; the cards and table render. Final set: scratchpad/shots/F/final/enterprise-{zh,en}-{390,768,1440}/. Section shots: shots/F/e1 (390, 1440), shots/F/e2 (390, 768, 1920, including hero steps), shots/F/s2 (1440).
- lines.js headings and labels at 320/390/768/1024/1440/1920 — zh h1 is 「把工作交给 AI，」/「决定权留在企业。」 at all six widths. en h1 is 「Delegate the work.」/「Keep the authority.」 at all six. Table title 业务连接 breaks 「业务」/「连接」 at 768/1024, as 「接入」/「方式」 did before. Buttons are one line at every width. The hero labels' ⚠OVERFLOW flag also appears on the live site before the change (animation masks).
- Table column collision probe (text right edge vs next cell's text left edge) at 480/600/768/900/1024/1440/1920, zh and en — All ok after the fix. Before the fix, 'conversations' overlapped by 8px at 768 in English.
- Pricing card that reads ENTERPRISE.stats[0], zh and en at 320/390/768/1440 — No overflow. The qualifier now takes 1–3 lines; at 320 the English noun wraps to 2 lines.
- Hero panel text legibility on the new pictures (1440 and 390 crops) — Readable on brand-family-04, os-loading and brand-family-03. The first attempt with pale pictures was unreadable and was replaced.
- GSAP reveal on the new step markup — Runtime DOM: 6 .ent-step, 94 split words. Letters start at translate(0%,100%) with opacity 0, same as on the live site, and end at translate3d(0,0,0) after scrolling.
- 320 and 1920 visual screenshots — 1920 section screenshots were taken and viewed (shots/F/e2). 320 was checked by line measurement only, with no 320 screenshots.
- 1024 visual screenshots — Not taken. 1024 was checked by lines.js and the column-collision probe only.

Concerns raised:

- Layout: the English text column in the cockpit/steps/numbers band is now much taller than the three pictures (row 2680px vs 1624px of pictures at 768; 2189 at 1440). At 768 in English there is about 1050px of empty space beside the stats (about 240px before). Fixing it would need a layout change (sticky pictures or a one-column band at tablet width), which is out of scope.
- Other areas still carry old enterprise/technical wording I did not touch: PRICING FAQ in tools/copy.mjs (~L899–901: 「API、MCP、连接器、Activepieces、Windmill、工作区桥接和渠道插件」 and 「企业版配专属前置部署工程师」); the nav label 企业与治理 (copy.mjs L25) versus the page title 企业管理与交付; a nav card (~L1172) still saying 企业与治理 / 能执行，也能被控制。 / Built to act, built to be controlled.; the blog body approval-gates-for-ai-in-trade listing Capability Center / Identity & Permission / Approval Service / Audit Ledger.
- The table button targets capabilities.html#g11 (an accordion heading, visible and clickable). If area C renames or moves #g11, this link needs rechecking.
- ENTERPRISE.stats[0] is shared with the pricing card (cn-price-card), so the pricing page's rating line now shows the new, longer role-directory text. The contract (numeric value, split at the first comma) holds. The pricing owner should know the line changed.
- ENT_CONTROLS / ENT_DEPLOYMENT / enList sit directly above ENTERPRISE in the enterprise section, not in the V6-F marker block: ENTERPRISE reads them at module load, so they must be defined first. They are not exports.
- The fixed quick-nav pill at the bottom of the viewport can cover the last line of a hero panel's text at some scroll positions. This is existing site behaviour; panel texts are about the same length as before.
- The origin-story note (「不是从一张 SaaS 产品需求表起步」) was removed from the enterprise page in favour of the availability/boundary note. It remains on the About page.

## Area G: About, Contact, Blog index, Pricing FAQ, Notices cards, English navigation

Branch `v6/G` (f0aab613), merged into content/v6-placement.

I finished area G on top of the earlier WIP commit, which was sound. I kept its copy and fixed or finished the rest.
- **About:** the cinery intro card now reads the P06 headline, a line break, the P06 body and the closing line. Tile 4 now reads 统筹 AI 员工 / Coordinator Agent.
- **Contact:** added the P07 question heading, quote-card text, label, textarea placeholder, a note that a demo request is not a confirmed meeting time, the 提交演示需求 / Send Demo Request label and the P07 markup notices. Fields, option values, validation, endpoint and consent are unchanged.
- **Contact fix:** I also fixed an older bug. The status line (where error messages appear) and the privacy/consent line in the dark form card were black on #232324 (1.34:1). They are now readable (15.7:1 and 8.2:1).
- **Blog index:** new P09 headline. The Chinese heading breaks after its comma; before the fix, balance split 业务 across lines at every width. The English heading is balanced. The P09 intro sentence now sits under the heading, using the template's own description element. The articles' date-line link reads 查看全部文章 / View All Articles. Articles are unchanged.
- **Pricing:** the FAQ answer that listed API/MCP/Activepieces/Windmill is now business language. The model-cost, training (FDE) and 288 answers were reworded too. No price, level, inclusion, quantity or plan changed. The P08 intro was not applied.
- **Notices:** the three keep-reading cards use the V6 names. The disclosures are unchanged.
- **English nav:** the home link reads Home instead of Trade OS; nothing depended on the old word. No href changed anywhere.

Build: 38 pages. verify-site, verify-integrity and verify-interactions all pass. I did not run verify-conversion, because it submits the contact form.

| Section | Chinese | English | Note |
|---|---|---|---|
| About intro card (cn-about, ABOUT.title/desc/closing) | 从真实业务出发，把分散的工作连接起来。<br>制造业与外贸业务不会在一次回复或一张报价单后结束。客户资料、产品知识、沟通、价格、订单和交付，需要持续协作。STARGO WORK 围绕这些具体工作组织产品：从主动获客与销售切入，再连接经营、内容生产和数字员工。先跑通一件事，再扩大到整个企业。 | Start with real work. Connect what comes next.<br>Manufacturing and global trade do not stop at a reply or a quotation. … starting with acquisition and sales, then connecting operations, creative work and AI teams. Start with one workflow. Expand with verified results. | Replaces the old 'STARGO WORK 起于一个很实际的问题…' paragraph. The button (预约演示 / Book a demo → contact.html) and the five social icons (→ contact.html) are unchanged. The render asserts exactly one <br/>. |
| About role tiles (cn-about-projects via ABOUT.circles[3]) | 调度中枢 → 统筹 AI 员工 | Orchestrator → Coordinator Agent | Measured: it wraps exactly where its row-mate FOLLOW-UP AGENT does (2 lines at 320/390/992/1024, 1 line at 768/1440/1920). The block comments are updated. |
| About undrawn copy (ABOUT.story, values, starts) | Story drops the 前置部署工程师 wording. values = the three P06 principles. starts sub-lines name Sales Desk / Growth OS / ERP / AI 创作 instead of 阶段 0x and old module names. | Same in English (no FDE; P06 principles; V6 area names) | Not rendered on the current page; kept in the source. |
| Contact heading (CONTACT.h1) | 你最想先改善哪一条业务？ | Which workflow should work better first? | The h1 gets the class stargo-contact-title and text-wrap: balance, because the English left 'first?' alone at 320/390/1024. |
| Contact quote card (CONTACT.quote / quoteLabel) | 「告诉我们你的行业、产品、目标市场，以及目前最费时间或最容易断开的环节。我们围绕一个具体场景讨论需要的资料、账号、岗位、审批和可验收的结果。」 label (先从一条业务开始) | “Tell us about your industry, products, target markets and the work that takes too much time or loses continuity. We will discuss the context, accounts, roles, approvals and checkable outcomes for one specific scenario.” label (One workflow first) | The label replaces (我们的承诺)/(Our promise). |
| Contact form card (cn-contact) | Textarea placeholder: 例如：希望把找客户、跟进和报价接起来；目前使用哪些软件，最常遇到什么问题？ · Submit: 提交演示需求 · Note under the button: 演示申请用于了解需求，不代表会议时间已经确认。 | Textarea placeholder: For example: connect prospecting, follow-up and quotations. Which tools do you use, and where does the work break down? · Submit: Send Demo Request · Note: A demo request helps us understand your needs; it is not a confirmed meeting time. | The privacy half of P07's before-submission note is already the consent line that chrome.mjs appends. js/stargo-forms.js finds the button by [type=submit], so the label is only a label. Option values stay 1–12 with the same twelve labels. |
| Webflow form notices (CHROME rows, markup) | Success: 已收到你的演示需求，我们会根据提交的联系方式与你沟通。 · Failure: 本次提交未成功，请稍后重试，或使用页面已有的商务联系方式联系。 | Success: Your demo request has been received. We will follow up using the contact details provided. · Failure: Your request could not be submitted. Please try again later or use the business contact options on this page. | The success row is used only by demo-request forms. The failure row is shared with the newsletter and its wording fits both. At run time, js/stargo-forms.js shows its own sentences instead (see concerns). |
| Blog index hero (BLOG_UI.heading/intro, build-site blog builder) | 把 AI 放进真实业务，<br>看懂每一步。 + 从客户开发、销售报价，到企业知识、数字员工和管理控制，逐步理解一条业务流程如何被连接、执行与核对。 | Understand AI through real business work. + Explore how customer acquisition, sales, quotations, enterprise knowledge, AI roles and management controls connect work and make its outcomes checkable. | Replaces 'AI 如何改变全球贸易 / How AI changes global trade'. The intro is a new .lx-feature-description-holder paragraph under the h1. |
| Article pages meta line (BLOG_UI.all) | 全部文章 → 查看全部文章 | All articles → View All Articles | This is the blog's only 'view all' control; the blog index has no button to relabel. The link target is still blog.html. |
| Pricing FAQ (PRICING.faq answers only) | CRM/ERP: 可以。邮箱、网盘、CRM、ERP 和业务平台，按企业授权接入；哪些信息可以读取、哪些记录可以修改、哪些动作需要审批，按企业逐项确认。系统迁移在企业版里提供。 · Model costs: 平台能力与 AI 模型、接口调用、第三方服务用量分开计… · Training: …企业版配专属前置部署工程师，进入企业的真实流程，把业务规则和使用中的问题直接反馈到平台。 · 288: 不是。288 是岗位目录数量，不是同时运行的数量。… | CRM/ERP: Yes. Email, drives, CRM, ERP and business platforms connect through enterprise authorization; what can be read, what can be changed and what needs approval is confirmed for each company. Migration is part of Enterprise. · Model costs: Platform capability is billed separately from AI model, API and third-party service usage… · Training: …a dedicated forward-deployed engineer who works inside your real workflows… · 288: No. 288 is the role-directory count, not the number of roles working at once. … | Questions are unchanged (cn-price-card and rk-price-tiers look answers up by question). The model-cost answer is also the price card's footnote; it still fits in 2 lines at 1440 and 4 at 390. The Standard answer is not changed (see concerns). |
| Notices keep-reading cards (NOTICES.relatedIntro/related) | 三个入口，看 STARGO WORK 做什么、谁来做、怎样管。 · (14 个能力域) 能力：从 Growth OS、Sales Desk 到 ERP 与 AI 创作，从工作空间到持续改进。 · (288 个专业数字岗位) 数字员工：十类企业职能，按任务组成团队。288 是岗位目录数量，不是同时运行的数量。 · (管理与交付) 企业与治理：看得见进度，管得住审批与预算，查得清结果；从一条业务开始落地。 | Three places to see what STARGO WORK does, who does the work and how it is managed. · (14 capability groups) Capabilities: From Growth OS and Sales Desk to ERP and AI creative work — from the workspace to controlled improvement. · (288 specialized AI roles) AI Workforce: Ten enterprise functions, teams formed around the task. 288 is the role-directory count, not work running at once. · (Control & delivery) Enterprise: See progress, control approvals and budgets, check the results — and start with one workflow. | NOTICES.body (the legal disclosures) is untouched. The hrefs are unchanged. |
| Navigation (NAV[0].label.en, HOME_MONO '(Home)') | 首页 (unchanged) | Trade OS → Home; (Trade OS) → (Home) | chrome.mjs remapLinks already matches /首页\|Home\|Trade OS/. No verify script uses the word. The article breadcrumb JSON-LD now says Home. |

Visuals:

| Where | Old | New | Reason |
|---|---|---|---|
| about.html intro card | 4-line paragraph (zh 1440) | Headline on its own line plus body plus closing. Lines zh/en: 320 17/26, 390 12/17, 768 7/9, 1024–1920 6/9. The card grows with its content; nothing is clipped; type size unchanged | P06 copy is longer and this card is the page's only text slot |
| contact.html form card small print | status line, consent line: rgb(0,0,0) on #232324 (1.34:1, unreadable) | status line white (15.7:1); consent line and new demo note #bbb (8.18:1) | Pre-existing readability defect; the new note would have inherited it |
| blog.html hero | one-line zh / two-line en heading, no paragraph | zh: 2 lines at ≥768, 3 lines at ≤479. en: 3 balanced lines (4 at 320). A 2-line intro paragraph (3–5 on phones) sits under it; the cards start lower | P09 headline and body |
| about.html role tile 4 label | ORCHESTRATOR / 调度中枢 (1 line) | COORDINATOR AGENT / 统筹 AI 员工 (2 lines at 320/390/992/1024, same as FOLLOW-UP AGENT on the same row) | Retire the engineering word |

Layout adjustments:

- blog index: one added element `<div class="lx-feature-description-holder stargo-blog-intro"><div class="lx-text-size-regular">…</div></div>` inside `.lx-blog-title-big` (the template's own description pair from its about hero). V6-G CSS: `.lx-scope .lx-blog-title-big .stargo-blog-intro { margin-top: 1.5rem }`
- blog index: Chinese h1 gets `<br/>` after its full-width comma (build-site asserts exactly one)
- blog index: `.lx-scope .lx-blog-hero-title { text-wrap: balance }` (V6-G), for the English heading; the Chinese one was already balanced
- contact: h1 gets class `stargo-contact-title` plus V6-G `h1.inner-title.stargo-contact-title { text-wrap: balance }`
- contact card: new `<p class="stargo-form-before">` after `.stargo-form-note`, inside the form. V6-G: margin 16px 0 0; 13px/1.6 (the consent line's size)
- contact card: textarea `placeholder` filled (the donor shipped it empty). V6-G sets the placeholder colour to #bbb (6.0:1); cinery's default #222 was 1.38:1
- contact card: V6-G `.cn-contact p.stargo-form-note { color: white }` and `.cn-contact p.stargo-form-before, .cn-contact p.stargo-form-consent { color: #bbb }` (fixes the 1.34:1 text)
- about card: one `<br/>` after the headline inside cinery's `.text-size-large` paragraph (cn-about.mjs asserts exactly one); no type or box change

Not placed:

- **P06 three principles** — About is built from three cinery blocks (intro card, project tiles, reviews) and none has a list slot. The Lifelogx values row that used to carry ABOUT.values is no longer drawn, and the owner limited About to text-only changes. Proposal: Add one three-item list (principle title plus sentence) under the paragraph in the cn-about card: a `<ul>` in cn-about.mjs plus a small V6-G rule. Or approve putting them back via the Lifelogx values row. The copy is ready in ABOUT.values.
- **P07 interest options (9 labels)** — js/stargo-forms.js submits the selected option's text, so replacing the 12 current labels changes what reaches the inbox. That is a form change, and V6 §9 excludes it from the text task. cn-contact.mjs asserts twelve options. Proposal: After separate form approval: replace CONTACT.options with V6_G_PENDING.contactOptions. Update the twelve-count assertion in cn-contact.mjs and the Mono option list in build-site.mjs, and tell whoever reads the inbox.
- **P08 pricing intro** — V5 and V6 both require separate commercial approval. Proposal: Once approved, set PRICING.caption/title (read by cn-price-hero) from V6_G_PENDING.pricingIntro and check the hero heading with lines.js.
- **P07 success sentence at run time** — After a real successful submit, visitors see js/stargo-forms.js T.sent, not the markup notice. That file is outside area G. Proposal: In js/stargo-forms.js set T.sent to zh '已收到你的演示需求，我们会根据提交的联系方式与你沟通。' / en 'Your demo request has been received. We will follow up using the contact details provided.' (V6_G_PENDING.contactSent).
- **P09 CTA on the homepage blog band** — The button's label lives in HOME_MONO '>See all<' (homepage copy, outside area G). Proposal: Change that row to B('>查看全部文章<', '>View All Articles<').
- **F10 on the contact page** — contact.html has no FAQ or extra-paragraph slot. Proposal: Leave it to the enterprise page (area F) or the home FAQ, or add it as a second quote-card line if the owner wants it on contact.

Checks run by the area agent:

- npm run build (4 runs, the last after the final source edit) — Pass: 'wrote 38 pages' every time. The last rebuild produced no output change after comment-only edits.
- lines.js blog h1 at 320/390/768/1024/1440/1920 — zh: 「把 AI 放进」/「真实业务，」/「看懂每一步。」 at 320 and 390; 「把 AI 放进真实业务，」/「看懂每一步。」 at 768–1920. Before the fix: 「…真实业」/「务，…」 at 390–1920. en: 'Understand AI / through real / business work.' at 390–1920; 4 lines at 320 ('work.' last, no better break fits). No overflow.
- lines.js contact h1 at 320/390/768/1024/1440/1920 — zh: 「你最想先改善」/「哪一条业务？」 up to 1024, one line at 1440/1920. en: 'Which workflow / should work / better first?' at 320/390/1024; 'Which workflow should / work better first?' at 768/1440/1920. No overflow.
- About paragraph lines and overflow at 320–1920, zh and en — zh/en lines: 17/26, 12/17, 7/9, 6/9, 6/9, 6/9. The headline ends its own line at every width. No horizontal scroll, nothing clipped.
- About tile labels at 320/390/768/992/1024/1440/1920 — COORDINATOR AGENT wraps exactly like FOLLOW-UP AGENT; 统筹 AI 员工 like 报价/跟进 AI 员工. MARKET SIGNAL AGENT wraps to 2–3 lines at narrow widths (pre-existing).
- Stepped mouse-wheel walks with screenshots: about/contact/blog/pricing/notices × zh/en × 390/768/1440; about/contact/blog also at 320 and 1920 (shots under scratchpad/shots/G/after and after-edge; before under shots/G/before) — All loaded. No page errors, no /api requests (routed and counted), no horizontal scroll. About clips loaded on scroll. Notices cards stack as before. Pricing toggle and FAQs render. I compared the screenshots by eye against the before set.
- Contrast of contact card small print (computed) — Before: status, consent and new note were 1.34:1. After: status 15.70:1, note and consent 8.18:1 (zh and en).
- Empty-form validation on contact (zh/en × 390/1440), /api aborted and counted — 0 requests. The note is visible and white ('请填写姓名和有效的邮箱地址。' / 'Please enter your name…'). Submit reads 提交演示需求 / Send Demo Request. The contact form was never submitted with data.
- Pricing card footnote (model-cost answer) fit — 2 lines at 1440/768/1024 and 3–4 lines at 390; not clipped (scrollHeight equals clientHeight).
- One language per page — en about/contact/blog/pricing/notices have no Chinese in text or attributes except the 中文 switch. zh pages' Latin residue (verify-site) is only product names and email/site on area G pages.
- BASE_URL=http://127.0.0.1:4327 node tools/verify-site.mjs — PASS: 38 pages loaded, 0 errors, 0 failed requests, 0 external requests, 0 broken links. Its informational Latin-residue list includes older items on non-G pages (enterprise 'API、MCP', zh articles '企业本体'/'Capability Center'); none come from area G.
- BASE_URL=… node tools/verify-integrity.mjs — All lines PASS (0 non-PASS), including zh and en pricing accessibility [].
- BASE_URL=… node tools/verify-interactions.mjs — All PASS. Note: its 'short contact and newsletter relay' check submits the enterprise band form and the newsletter to an in-process fixture with fetch stubbed. Nothing left the machine, and the contact page form was not involved.
- tools/verify-conversion.mjs — Not run: it fills and submits the contact form (mocked), and the brief says not to submit it.

Concerns raised:

- js/stargo-forms.js T.sent tells visitors '已收到，我们会在一个工作日内联系你。' / '…within one working day.' after every demo submission (contact page and the home/capabilities/enterprise bands). No source approves that response time. The file is outside area G; the replacement sentence is in V6_G_PENDING.contactSent.
- The English answer to 「标准版包含什么？」 lists different items from the Chinese answer and from the Standard card (e.g. 'basic Customer 360, basic content assets'). I left it, because aligning it changes what the English page says Standard includes; that needs a commercial decision.
- 'FDE' still appears in English outside area G: PRICING plan items ('dedicated FDE', ~copy.mjs L667/L897), HOME_MONO enterprise quote ('A dedicated FDE'), ENTERPRISE.approachButton ('Talk to a STARGO FDE'), LX_INTELLIGENCE feature 'Embedded FDE'. The pricing plan text is commercial; the others belong to other areas.
- About depends on area D's fields. cn-about-projects asserts that the heading lines 「AI」/「团队」 and 'AI'/'Team' are substrings of LX_WORKFORCE.heroDesc, so a D rewrite without them fails the build. Its button shows LX_WORKFORCE.store1.name (「288 位 AI 员工」 / '288 AI Employees') without the role-directory qualifier. If D renames it, re-check the fit of the uppercase English pill.
- The demo band submit on home/capabilities/enterprise (CHROME 'value="Contact us"') still reads 发送/Send. P07's label could apply there, but the brief did not note that row, so I left it.
- Generated files: every built page changed only by the stargo-fusion.css ?v= hash. Parallel areas will conflict on generated HTML, so rebuild after merging the sources.
- V6_G_PENDING in copy.mjs (V6-G block) is read by nothing. It holds P08 intro, P07 options and the runtime success sentence so they are not lost.
- The About card is long on phones (26 lines at 320 in English). Nothing is clipped. The headline uses the paragraph's type, because the About text-only rule forbids a heading element; a distinct headline style needs one inline element or an owner decision.
- Pre-existing, not from G: the zh article bodies still contain jargon ('企业本体', 'Capability Center', 'Identity & Permission'). V5 P09 and V6 §9 keep articles unchanged.

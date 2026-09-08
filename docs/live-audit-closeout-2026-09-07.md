# STARGO WORK — 线上核查补充包收尾记录（2026-09-07）

来源：`STARGO_WORK_Live_Audit_20260907`（01_LIVE_AUDIT_ZH.md + 02_CLAUDE_TARGETED_FIX_PROMPT.md + evidence/×6）。
边界：只改文字。模板、图片、样式、字体、动效、交互处理器、组件顺序与数量、路由、表单与依赖未改动。**未部署。**
事实来源：业主 2026-08-27 V2.0 对外服务包（由 2026-09-06 文案包引述）。本轮不构成价格、交付量、合同主体或功能上线状态的批准。

改动集中在 `tools/copy.mjs`（+82 / −82 行，69 处文案对）与 `tools/blog.mjs`（1 处）。构建产物 38 页随之更新。

---

## 第一优先级 — 定价叙事统一

### 1.1 英文比较表（`PRICING.compareGroups`）

审计确认线上表仍按「软件模块逐档解锁」组织，与已改好的套餐卡冲突。**列数 3、行数 12、勾选模式 `[1,1,1]×4 / [0,1,1]×4 / [0,0,1]×4` 全部保持不变**，只换行文字。

| 分组 | 原分组名 | 现分组名 | 行 1→4 的变化 |
|---|---|---|---|
| 1 | Platform / 平台底座 | **Software subscription / 软件订阅** | 云端 Workspace 与 AI 数字员工 → 年度 STARGO WORK 软件订阅；企业知识库与产品数据中心 → 企业知识与产品资料；Inquiry Workflow 与 Customer CRM → 询盘、CRM、报价与审批流程；Quote Workflow 与人工审批 → **自助买家研究、评分与写入 CRM** |
| 2 | Growth / 增长 | **Website and content services / 建站与内容服务** | SEO·GEO 与 Growth Content → 官网与 SKU 页面制作服务；Customer Intelligence 与 Growth Analytics → 产品图片与短视频制作服务；自动跟进与 CRM Growth Loop → 多语言官网交付服务；品牌可信内容体系 → SEO / GEO 实施服务 |
| 3 | Acquisition / 主动获客 | **Configured services / 配置后运行服务** | STARGO Growth OS 与 Trade Signal Revenue Engine → 三个月配置后获客运行；Importer Reorder Radar·Competitor Customer Graph → 三份获客月报；Buying Committee Intelligence·Opportunity Scoring → 支付功能技术对接；Dormant Lead Reactivation·Growth Attribution → 18 种语言的官网与 SKU 系统翻译 |

其他：
- 第三列副标题 `Growth plus AI acquisition` → `Growth plus three months of configured operation`（原文承诺的是软件解锁）。
- 表标题 `Compare the plans` → **`Compare selected plans` / 所选方案对比**（Launch 不在此表内，按审计要求说明比较范围）。Launch 的完整卡片保持不变。
- 勾选图标含义未改动，仍表示商务包含关系。

### 1.2 中文定价面（业主授权范围内）

| 槽位 | 原文 | 现文 |
|---|---|---|
| 方案名 | `Foundation` | `Standard`（中英同名，避免同一产品两个名字） |
| Standard 定位 | 适合希望首先建立企业 AI 数字底座的团队。 | 适合想自己把 AI 用进外贸流程的团队。 |
| Standard 第 4 条 | Quote Workflow 与人工审批 | **自助线索发现、公司画像、评分与写入 CRM** |
| Standard 其余 4 条 | 模块名 | 12 个月工作台/最多 5 用户、首次导入最多 20 SKU、产品与 CRM 流程、年度标准 AI 额度与一次配置一次培训 |
| Launch/Growth/GA 首行 | 包含 Foundation / Launch / Growth 全部内容 | **含年度 Standard 软件订阅，另加：**（服务量按档替换，不叠加） |
| Launch/Growth/GA 其余条目 | 能力名 | 具体交付量（页面数、SKU 数、语种、图片与视频条数、SEO/GEO 服务） |
| GA 定位 | 让企业拥有主动获客能力。 | 适合在数字化基础上再加三个月配置后 AI 获客运行的团队。 |
| GA CTA | 打开 AI 获客 | 了解 Global Acquisition |
| 中文 meta description | 从企业需要的 AI 层级开始：Foundation、… | 年度软件订阅，加上可选的建站、内容与获客服务包：Standard、… |
| 中文 FAQ「可以只要主动获客吗？」 | Global Acquisition 建立在 Growth 之上… | **不是。Standard 已经包含自助获客…GA 增加的是三个月配置后运行与 3 份月报。**（原中英答案互相矛盾） |
| 中文 FAQ「首年之后怎么算？」 | Foundation 按年续费… | 软件订阅按年续费；域名、托管与持续制作另计；首年服务包不等于每年重复交付 |
| 中文 FAQ「Foundation 包含什么？」 | 模块清单 | Standard 的实际权益清单（含用户数与 SKU 上限） |
| 中文 FAQ「培训和实施」 | Foundation 包含 AI 工作培训 | Standard 含一次配置与一次基础培训 |

### 1.3 首页价格预览（`HOME_MONO` 阶梯）

| 槽位 | 原文 | 现文 |
|---|---|---|
| 阶梯引言 | 不是功能越多越贵，而是 AI 运营能力一级一级往上加… | 一份年度软件订阅，加上可选服务包。**服务包价格是首年总价，已含软件订阅；服务交付量按档替换，不叠加。** |
| 眉标 | (Foundation) | (Standard) |
| Standard 说明 | 企业 AI 数字底座：云端 Workspace、AI 员工… | 12 个月云端工作台、核心外贸流程与**自助线索发现** |
| Launch 说明 | 底座之上，启动第一阶段数字化增长… | 官网 3 个核心页面与 20 个 SKU 页、中英文内容、20 个 SKU 图片与 10 条短视频 |
| Growth 说明 | SEO·GEO 增长、客户智能与增长分析… | 官网 4 个核心页面与 40 个 SKU 页、5 个语种、SEO 与 GEO 实施服务 |
| GA 说明 | Growth OS 与 Trade Signal Revenue Engine：补货雷达… | 官网 5 个核心页面与 80 个 SKU 页、18 种语言，另加三个月配置后获客运行与 3 份月报 |
| 三条价格副行 | 首年 ¥N · 续费另议 | **首年总价 ¥N（含 ¥10,000 软件订阅）· 续费另议** |
| 三条「包含上一档全部内容」 | Everything in Launch / Growth… | 含年度 Standard 软件订阅，另加： |
| GA 引语 | 「别再等询盘。」 | 「自助获客在 Standard 里，这一档是我们替你跑三个月。」 |
| 四个 CTA | 从 STARGO WORK 开始 / 启动你的 AI 运营 / 建立增长引擎 / 打开 AI 获客 | Standard·年度软件订阅 / Launch·建站与内容服务 / Growth·更大范围的建站与内容 / GA·配置后获客运行 |

### 1.4 一致性核对结果

全站 38 页搜索 `Foundation`、`Turn on AI acquisition`、`Everything in Growth`、`Everything in Launch`、`打开 AI 获客`、`包含 Growth 全部内容`、`让企业拥有主动获客能力`、`Growth plus AI acquisition`：**0 命中**。
文章 `start-with-one-workflow` 正文里的方案名同步为 Standard（1 处）。

**软件 / 自助获客 / 配置后运行服务 / 第三方用量四者的区分现在写在：** 比较表三个分组名、Standard 卡第 4 条、GA 卡末条、首页阶梯引言与三条价格副行、中英 FAQ「主动获客只在 ¥40,000 的方案里吗？」与「模型费用包含在内吗？」。

---

## 第二优先级 — 内容补齐（使用既有槽位，未新增组件）

| 页面 | 槽位（copy.mjs 键） | 原状 | 现状 |
|---|---|---|---|
| Home | `HOME_MONO` hero support | 开场说明仍是「AI 操作系统…288 个 AI 员工…闭环」 | 换成 H01 正文：云端 AI 工作系统、买家研究到出口单证、288 位 AI 员工、决策权在团队 |
| Home | `HOME_HERO_LIST` ×5 | One trade loop / 288 AI employees / Enterprise ontology / Human approval gates / Governed evolution | H02 五个业务动作：Find the right buyers / Reply with product knowledge / Turn inquiries into quotes / Keep orders moving / Follow up for repeat business |
| Home | `HOME_MOBILE.heroSupport` | 概念句 | G04 紧凑版同一承诺 |
| Home | `HOME_SC_HERO` 轮换词 | 固定前缀 `Find buyers. Follow through to` + 轮换 `orders.` / **`Qualify.`** / **`Quote.`** | 三个组合全部成句：`…to orders.` / `…to quotes.` / `…to repeat business.`（中文三组合原本即成立，未改） |
| Capabilities | `CAPABILITY_GROUPS` 157 条的 `What it is` | **78 条只是复述功能名**（Importer Reorder Radar → Importer reorder radar 等） | 78 条逐条改为「输入→动作→产出」，复述率 0/157。未新增可用性声明 |
| Intelligence | `LX_INTELLIGENCE.ctaDesc` | `Observer → Evaluation → Improvement → Canary → Approval → Promote / Rollback` | 说明执行记录 → 结果 → 人工纠正 → 候选改动 → 小范围比对 → 评测与批准后发布 / 否则回滚，并写明「模型权重不会自己训练」 |
| Workforce | `LX_FEATURE_WORKFORCE.cardB` | 「客户、报价、订单是对象，不是聊天记录，换个人接手也不丢。」 | 研究→产品→销售→协调四步交接写在同一客户对象上；标题改为「交接不用重讲一遍」 |
| Workforce | `answersCards.1` | One goal, a team in seconds | One goal → roles assigned → context handed over → a reviewable brief |
| Workforce | hero 描述 | 「不是 288 个聊天机器人。」 | 增加容量口径：288 是岗位目录，不是并发数，也不是无限模型与第三方用量 |
| Enterprise | `ENTERPRISE.intro` | 「AI 只回答问题时安全很简单…」的对比 | **已删除**。改为实施与验收叙事：先定范围（一条流程、要接的系统、谁批准什么、验收看什么）→ 试点交付可复核物 → 达到验收标准再谈下一条 |
| Enterprise | `ENTERPRISE.approach` ×4 | Cloud. / Dedicated environment. / Private deployment. / Enterprise SLA. | 每条补一句它解决什么（租户隔离 / 独立环境 / 自有边界 / 服务等级按项目约定） |
| About / Blog / Contact | — | 上一轮已改好的内容 | **未改动**。文章 URL、标题、日期、作者、表单字段与提交机制全部保留 |

---

## 第三优先级 — 真实性标签与按钮语义

| 位置 | 原文 | 现文 | 说明 |
|---|---|---|---|
| Home 审批案例标题 | `(A real approval)` / (一次真实的审批) | `(Illustrative approval workflow)` / (审批流程示例) | 无业主授权的真实事件依据 |
| Home 审批案例时间 | `Today 17:01` / `Today 17:02` | `Step 1` / `Step 2` | 时间戳读起来像真实日志 |
| Home 按钮 | `See all capabilities` → `contact.html` | `Discuss your workflow` | **只改文字**，href 未动 |
| Workforce 按钮 | `See pricing` → `contact.html` | `Discuss your plan` | **只改文字**，href 未动 |

示例披露 `(Partner wall · sample)` / `Sample logos · not actual clients` 原本就在，未改动。

### 需单独授权的导航修复（本轮未实施）
若希望按钮回到原本承诺的目的地，属导航范围，需另行授权：
- `en/index.html` 与 `index.html`：该按钮 href 由 `contact.html` 改为 `capabilities.html`（`tools/copy.mjs` `HOME_MONO` 中 `>Get started<` 对应项，另有 `CAPABILITIES.button` 已指向 `capabilities.html` 可复用）。
- `workforce.html` 与 `en/workforce.html`：`answersButton` 所在链接 href 由 `contact.html` 改为 `pricing.html`（`build-site.mjs` 第 528 行 `>Get the app<` 槽位）。

---

## 状态分类

- **已实施（applied）**：上表全部条目，69 处文案对。
- **等价既有（equivalent-existing）**：Intelligence 的本体论对象卡、主动事件例子、长任务说明；Capabilities 的九阶段流程说明；About 的四条产品原则；Contact 的表单字段与提交状态文案 —— 审计确认已足够，未改动。
- **业主决策（owner-decision-required）**：见下节。
- **确有阻塞（blocked）**：无。

## 需要业主决定的事项

1. **价格与交付量的商务批准**：¥10,000 / ¥20,000 / ¥30,000 / ¥40,000、5 用户、20/40/80 SKU、10/20/50 短视频、10/20 AI 视频、3/4/5 核心页、2/5/18 语种、三个月配置后运行与 3 份月报。本轮按 V2.0 服务包写入，**未获批准**。
2. **中文文案的授权范围**：本轮只改了中文定价面。Capabilities 的 78 条中文说明同样只是功能名直译，Intelligence/Workforce/Enterprise 的中文段落也未按本轮英文同步更新。需要授权才能继续。
3. **软件合同主体**：页脚、隐私政策、条款与表单仍未写主体名。
4. **能力上线状态标签**：Capabilities 页未逐项标注 Available / Pilot / Planned / Research Preview。需要业主提供每条的证据后才能标。
5. **示例 Logo 墙的资产决策**：披露文字已在，图片授权问题非文字可解。
6. **导航修复授权**：见上节两条 href。

## 本轮实际运行的检查

- 构建：`node tools/build-site.mjs` 输出 38 页；`node tools/make-dist.mjs`。
- 文本一致性：全站 38 页对 8 个旧口径关键词扫描，0 命中；157 条能力说明复述率 0。
- 回归套件：见提交时附的 `.wrangler/suite-logs/audit-round.log`。
- **未做**：浏览器逐页视觉与动画状态复核（本轮改的是文字长度可能影响卡片高度，需另跑）；移动端版式；表单真实投递；线上验证（未部署）。

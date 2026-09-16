/**
 * The blog: every article, in both languages, as data. Adding an article means
 * adding one entry here (and a cover in tools/blog-covers.mjs), then rebuilding;
 * the build produces blog/<slug>.html and en/blog/<slug>.html, the blog index,
 * the homepage cards, the sitemap and the structured data from this list.
 *
 * Rules for content: real product explanation only — no invented customer
 * stories, no named clients, no author credentials, no ranking promises.
 * Bodies are HTML fragments (h3 / p / ul / a); links are root-relative page
 * names (the build relocates them for nested pages).
 */
import { B } from './copy.mjs';

export const BLOG_UI = {
  heading: B('AI 如何改变全球贸易', 'How AI changes global trade'),
  related: B('相关文章', 'Related articles'),
  more: B('更多文章', 'More from the blog'),
  all: B('全部文章', 'All articles'),
  byline: B('STARGO WORK 团队', 'The STARGO WORK team'),
  section: B('博客', 'Blog'),
};

/** Newest first. `cover` names a file pair written by tools/blog-covers.mjs into assets/blog/. */
export const POSTS = [
  {
    slug: 'start-with-one-workflow',
    date: '2026-08-27',
    cover: 'start-with-one-workflow',
    keywords: ['AI 落地', '外贸流程', 'STARGO WORK', 'one workflow', 'AI adoption'],
    title: B('从一条流程开始：企业引入 AI 的正确顺序', 'Start with one workflow: the right order for bringing AI into a company'),
    description: B('不需要一次改变整个企业。选一条最耗时间或最影响增长的业务流程，让 AI 先在这一条里真正工作起来，再决定需要哪一级。', 'You don’t need to change the whole company at once. Pick the workflow that costs the most time or growth, let AI actually work there first, then decide which level you need.'),
    body: B(`
<h3>不需要一次改变整个企业</h3>
<p>企业引入 AI 最常见的失败方式，是想一次改变所有部门：同时上获客、客服、报价、订单和内容，每个部门都在适应新工具，没有一条流程真正跑通。更好的顺序是反过来：选一条最重要、最耗时间或最影响增长的业务流程，让 AI 先在这一条里承担真实的工作。</p>
<h3>怎么选第一条流程</h3>
<ul>
<li><strong>询盘处理：</strong>询盘量大、回复慢，答案散落在产品文件和老同事的脑子里。</li>
<li><strong>报价与 PI：</strong>报价靠 Excel 和口头确认，版本、利润和审批都不透明。</li>
<li><strong>主动获客：</strong>完全依赖平台询盘，没有自己的市场信号和客户研究。</li>
<li><strong>客户跟进：</strong>报价后没决定、展会名片没跟进、老客户到了补货周期没人知道。</li>
<li><strong>出口单证：</strong>商业发票、装箱单、原产地证、Form E 和提单靠人工逐项核对。</li>
</ul>
<h3>第一条流程怎么跑</h3>
<p>先梳理现有流程和涉及的系统，把客户、产品、询盘、报价、订单这些对象映射进企业本体；再让对应岗位的 AI 员工进入真实流程，从第一天起就记录响应时间、处理效率和订单结果；跑通之后，把有效的做法沉淀为 Skill 与 Workflow。这时再看需要标准版、增长版还是全球获客版哪一级，答案通常已经很清楚。</p>
<h3>人始终在里面</h3>
<p>第一条流程也要有审批闸门。价格、利润、正式报价和重要客户回复在授权范围之外时，AI 会停下来请求审批。工作交给 AI，权力留在企业——这从第一条流程开始就是原则，而不是规模化之后再补的东西。</p>
<p>告诉我们你最想改善的那一条流程：<a href="contact.html">预约演示</a>，我们从那里开始。</p>`,
      `
<h3>You don’t need to change the whole company at once</h3>
<p>The most common way AI adoption fails is trying to change every department at the same time: acquisition, customer service, quoting, orders and content all at once, every team adapting to a new tool, and not one process actually running end to end. The better order is the reverse. Pick the single workflow that matters most, costs the most time or most limits growth, and let AI do real work there first.</p>
<h3>How to choose the first workflow</h3>
<ul>
<li><strong>Inquiry handling:</strong> high volume, slow replies, answers scattered across product files and colleagues’ heads.</li>
<li><strong>Quotes and PI:</strong> quoting lives in spreadsheets and verbal approvals; versions, margins and sign-offs are opaque.</li>
<li><strong>Proactive acquisition:</strong> the company depends entirely on marketplace inquiries and has no market signals or account research of its own.</li>
<li><strong>Follow-up:</strong> quotes go unanswered, trade-show cards are never worked, nobody notices when an old customer reaches a reorder cycle.</li>
<li><strong>Export documents:</strong> commercial invoice, packing list, certificate of origin, Form E and bill of lading are checked line by line by hand.</li>
</ul>
<h3>How the first workflow runs</h3>
<p>Map the current process and the systems it touches, and model its objects — customers, products, inquiries, quotes, orders — in the enterprise ontology. Then let the AI employees for those roles enter the real workflow, recording response time, throughput and order outcomes from day one. Once it runs, turn what worked into skills and workflows. By then the question of which level you need — Standard, Growth or Global Acquisition — usually answers itself.</p>
<h3>People stay in the loop</h3>
<p>The first workflow gets approval gates too. When a price, a margin, a formal quote or a key customer reply falls outside its authority, AI stops and asks. Delegate the work, keep the authority — a principle from the first workflow on, not something added after scale.</p>
<p>Tell us the one workflow you most want to improve: <a href="contact.html">book a demo</a> and we start there.</p>`),
  },
  {
    slug: 'from-inquiry-to-quote',
    date: '2026-08-13',
    cover: 'from-inquiry-to-quote',
    keywords: ['询盘', '报价', 'Quote Studio', 'inquiry to quote', 'B2B quoting'],
    title: B('从询盘到报价，不再从 Excel 开始', 'From inquiry to quote, without starting in Excel'),
    description: B('一封询盘进来后要经过判断客户、找参数、翻历史报价、找老板确认四个窗口。Quote Studio 把这条链放进同一个客户对象里，价格敏感项进入审批。', 'An inquiry passes through four windows: judging the customer, finding specs, digging up past quotes, chasing the boss. Quote Studio puts that chain on one customer object, with price-sensitive items behind approval.'),
    body: B(`
<h3>报价为什么慢</h3>
<p>一封询盘进来，业务员要先判断客户是谁、来自哪个市场、想买什么；再翻产品文件找参数，打开上一次的报价表对照价格，找老板确认利润，最后手工做成报价单。每一步在不同的窗口里，每一步都可能出错，而这些判断和确认没有任何一处被记录下来。</p>
<h3>Quote Studio 怎么做</h3>
<ul>
<li><strong>先读懂询盘：</strong>识别客户、市场、采购意图、需求数量和风险信号，并自动关联到已有客户与历史沟通。</li>
<li><strong>调用企业知识：</strong>产品数据库、企业知识库、历史报价和业务规则参与产品匹配与配置计算，不知道的不编。</li>
<li><strong>生成草稿：</strong>按客户、配置、数量、价格规则、历史成交、利润护栏和贸易条件生成报价草稿。</li>
<li><strong>进入审批：</strong>价格敏感项进入审批闸门；通过后进入正式报价与 PI，报价版本全部保留。</li>
</ul>
<h3>人在哪里</h3>
<p>业务员不再从空白表格开始，而是审阅一份已经带着客户上下文和依据的草稿；老板在审批时看到的不是一个孤立的数字，而是利润、护栏、历史价格和这条报价的来龙去脉。报价、审批记录和后续订单都留在同一个客户对象上，下一次询盘进来时，系统已经记得上一次。</p>
<p>相关能力见能力页的<a href="capabilities.html#g07">报价与商务</a>和<a href="capabilities.html#g04">询盘与客户对话</a>。</p>`,
      `
<h3>Why quoting is slow</h3>
<p>An inquiry arrives. The salesperson first has to work out who the customer is, which market they are in and what they want; then dig through product files for specifications, open last time’s quote sheet to compare prices, chase the boss to confirm the margin, and finally build the quotation by hand. Every step lives in a different window, every step can go wrong, and none of those judgements or confirmations is recorded anywhere.</p>
<h3>What Quote Studio does</h3>
<ul>
<li><strong>Read the inquiry first:</strong> identify the customer, market, buying intent, quantity and risk signals, and link it to the existing account and its history.</li>
<li><strong>Bring in company knowledge:</strong> the product database, knowledge base, past quotes and business rules drive product matching and configuration; unknowns are never invented.</li>
<li><strong>Draft the quote:</strong> from customer, configuration, quantity, pricing rules, past deals, margin guardrails and trade terms.</li>
<li><strong>Go through approval:</strong> price-sensitive items stop at an approval gate; once approved, the quote becomes the formal quotation and PI, with every version kept.</li>
</ul>
<h3>Where the people are</h3>
<p>The salesperson no longer starts from a blank sheet but reviews a draft that already carries the customer’s context and the reasoning behind each number. The approver sees not an isolated figure but the margin, the guardrail, the price history and how this quote came about. Quote, approval record and the order that follows all stay on the same customer object, so when the next inquiry arrives the system already remembers the last one.</p>
<p>See <a href="capabilities.html#g07">Quote &amp; Commercial</a> and <a href="capabilities.html#g04">Inquiry &amp; Customer Conversation</a> on the capabilities page.</p>`),
  },
  {
    slug: 'approval-gates-for-ai-in-trade',
    date: '2026-07-30',
    cover: 'approval-gates-for-ai-in-trade',
    keywords: ['审批', '治理', 'Human-in-the-Loop', 'approval gates', 'AI governance'],
    title: B('审批闸门：把工作交给 AI，权力留在企业', 'Approval gates: delegate the work, keep the authority'),
    description: B('当 AI 可以真正执行工作，权限、审批、证据和审计就是产品本身。哪些动作应该设闸门，审批时应该看到什么，五个治理组件各管什么。', 'Once AI can actually do the work, permissions, approval, evidence and audit are the product. Which actions need a gate, what an approver should see, and what the five governance components do.'),
    body: B(`
<h3>为什么治理是产品的一部分</h3>
<p>当 AI 只能回答问题时，安全问题很简单：最坏的结果是一个错误的答案。当 AI 可以真正执行工作——发出报价、生成 PI、回复重要客户、写入 CRM——权限、审批、证据和审计就不再是附加功能，而是产品本身。STARGO WORK 从第一天起就按照「AI 会进入真实业务流程」来设计。</p>
<h3>什么动作应该设闸门</h3>
<ul>
<li><strong>价格与利润：</strong>越过利润护栏的报价必须有人批。</li>
<li><strong>正式文件：</strong>正式报价、PI、合同条款。</li>
<li><strong>关键对外动作：</strong>重要客户的回复、对外付款。</li>
<li><strong>企业自定义：</strong>任何被企业定义为关键的业务动作，都可以放到审批服务之后。</li>
</ul>
<h3>审批时看到什么</h3>
<p>不是一个孤立的「同意 / 拒绝」按钮。审批人看到这次任务的输入、上下文、调用了哪些工具、做了什么动作、产出是什么、依据是什么。批准之后，结果和审批记录一起进入审计台账，可以回读，也可以回滚。管理者不仅看到答案，还知道它为什么这么做。</p>
<h3>五个治理组件</h3>
<p>Capability Center 决定 AI 可以调用什么；Identity &amp; Permission 决定谁以什么身份行动；Approval Service 决定什么必须审批；Audit Ledger 为每个动作留下证据；Credential Management 保证凭据不进入提示词。它们和租户隔离、失败处理、Canary 与回滚一起，构成企业治理能力。详见<a href="enterprise.html">企业与治理</a>。</p>`,
      `
<h3>Why governance is part of the product</h3>
<p>While AI only answers questions, safety is simple: the worst outcome is a wrong answer. Once AI can actually do the work — send a quote, generate a PI, reply to a key customer, write into the CRM — permissions, approval, evidence and audit stop being add-ons and become the product itself. STARGO WORK was designed from day one for AI that enters real business processes.</p>
<h3>Which actions deserve a gate</h3>
<ul>
<li><strong>Price and margin:</strong> a quote that crosses the margin guardrail needs a human signature.</li>
<li><strong>Formal documents:</strong> formal quotations, PI, contract terms.</li>
<li><strong>Critical outbound actions:</strong> replies to key customers, outbound payments.</li>
<li><strong>Company-defined:</strong> any business action the company declares critical can sit behind the approval service.</li>
</ul>
<h3>What an approver sees</h3>
<p>Not an isolated approve / reject button. The approver sees the task’s input, its context, which tools were called, what actions were taken, what was produced and on what grounds. After approval, the outcome and the approval record enter the audit ledger together, where they can be read back and rolled back. A manager sees not just the answer but why it was given.</p>
<h3>Five governance components</h3>
<p>Capability Center decides what AI may call; Identity &amp; Permission decides who acts, as whom; Approval Service decides what must be approved; Audit Ledger leaves evidence for every action; Credential Management keeps credentials out of prompts. Together with tenant isolation, failure handling, canary releases and rollback, they make up the enterprise governance capabilities. See <a href="enterprise.html">Enterprise &amp; governance</a>.</p>`),
  },
  {
    slug: 'ai-operating-system-for-global-trade',
    date: '2026-07-16',
    cover: 'ai-operating-system-for-global-trade',
    keywords: ['AI 操作系统', '全球贸易', '外贸 AI', 'AI operating system', 'global trade'],
    title: B('什么是全球贸易 AI 操作系统', 'What is an AI operating system for global trade?'),
    description: B('制造业和外贸企业不缺软件，缺的是把工作连起来的一层。AI 操作系统和聊天机器人的三个区别，以及从获客到学习的一条完整链。', 'Manufacturers and exporters don’t lack software; they lack the layer that connects the work. Three differences between an AI operating system and a chatbot, and one complete chain from acquisition to learning.'),
    body: B(`
<h3>不是再加一个软件</h3>
<p>制造业和外贸企业不缺软件：邮箱负责询盘，WhatsApp 负责聊天，Excel 负责客户，ERP 负责订单。缺的是把这些工作连起来的那一层——知道客户、询盘、报价、订单和任务之间是什么关系，并且能够在这些关系之上执行工作。</p>
<p>STARGO WORK 把这一层叫作 AI 操作系统。它不是一个聊天窗口，也不是 288 个互不相关的机器人，而是一套拥有企业上下文、业务本体、长期状态、任务执行、协作、审批和持续进化能力的工作系统。</p>
<h3>和聊天机器人的三个区别</h3>
<ul>
<li><strong>它有企业模型。</strong>客户、询盘、报价、订单、出货、任务和 AI 员工是有状态、有关系的业务对象，不是散落在对话里的文字。</li>
<li><strong>它主动运行。</strong>基于事件、时间、状态和目标持续工作：一个老客户进入补货周期、一份报价发出后没有回音，系统先发现，再生成任务、调动合适的 AI 员工。</li>
<li><strong>它能被控制。</strong>价格、利润、正式报价、PI 和关键客户回复都可以设置审批闸门。AI 承担工作，人保留权力。</li>
</ul>
<h3>一条完整的链</h3>
<p>从发现市场机会、判断谁值得跟进、触达与对话，到理解询盘、基于企业知识回复、生成报价、审批、PI、订单、生产与出货、出口单证、持续跟进，再到把结果交回 Evolution Engine——销售和履约第一次使用同一条业务链，每一次结果都让下一次执行更好。</p>
<p>更深一层的原理在<a href="intelligence.html">智能层</a>；全部能力域在<a href="capabilities.html">能力</a>页。</p>`,
      `
<h3>Not one more tool</h3>
<p>Manufacturers and exporters do not lack software. Email owns the inquiry, WhatsApp owns the chat, a spreadsheet owns the customer, the ERP owns the order. What is missing is the layer that connects the work — one that knows how customers, inquiries, quotes, orders and tasks relate, and can execute work on top of those relationships.</p>
<p>STARGO WORK calls that layer an AI operating system. It is not a chat window and not 288 unrelated bots, but a work system with enterprise context, a business ontology, long-lived state, task execution, collaboration, approval and continuous evolution.</p>
<h3>Three differences from a chatbot</h3>
<ul>
<li><strong>It has a model of the business.</strong> Customers, inquiries, quotes, orders, shipments, tasks and AI employees are business objects with state and relationships, not text scattered through conversations.</li>
<li><strong>It runs proactively.</strong> It works on events, time, state and goals: an old customer entering a reorder cycle, a quote that went unanswered — the system notices first, then creates the task and mobilises the right AI employees.</li>
<li><strong>It can be controlled.</strong> Price, margin, formal quotes, PI and key customer replies can all sit behind approval gates. AI does the work; people keep the authority.</li>
</ul>
<h3>One complete chain</h3>
<p>From finding market opportunities, deciding who is worth following and reaching out, to understanding the inquiry, replying from company knowledge, drafting the quote, approval, PI, order, production and shipment, export documents and follow-up, and back into the Evolution Engine — sales and fulfilment run on one chain for the first time, and every outcome makes the next run better.</p>
<p>The underlying principles are on the <a href="intelligence.html">Intelligence</a> page; every capability group is on <a href="capabilities.html">Capabilities</a>.</p>`),
  },
  {
    slug: '288-ai-employees-not-288-chatbots',
    date: '2026-07-02',
    cover: '288-ai-employees-not-288-chatbots',
    keywords: ['AI 员工', 'Agent Teams', 'Orchestrator', 'AI employees', 'multi-agent'],
    title: B('288 个 AI 员工，不是 288 个聊天机器人', '288 AI employees, not 288 chatbots'),
    description: B('一个 AI 员工有岗位、目标、技能、工具、记忆、权限和执行证据。288 代表什么，秒级组队怎么发生，以及为什么合上笔记本公司不会停。', 'An AI employee has a role, goal, skills, tools, memory, permissions and execution evidence. What 288 stands for, how teams form in seconds, and why the company doesn’t stop when you close your laptop.'),
    body: B(`
<h3>员工和机器人的区别</h3>
<p>一个聊天机器人从空白提示开始，回答一次就结束。一个 AI 员工有岗位、目标、技能、工具、记忆、企业知识、权限、任务和执行证据。它知道自己负责什么，知道企业里有什么，也知道什么动作必须先问人。</p>
<h3>288 代表什么</h3>
<p>288 代表 STARGO WORK 的 AI Workforce 能力体系：市场研究、进口商情报、经销商发现、决策链识别、产品匹配、报价、跟进、单证、内容等岗位。实际的模型调用、并发和自动任务按方案配置，不是无限的模型用量——我们在<a href="pricing.html">定价</a>页也这样说明。</p>
<h3>秒级组队</h3>
<p>一个复杂目标，例如进入一个新市场寻找经销商，会同时调用研究、进口商、经销商、公司、决策链、产品、邮件、CRM 和跟进 Agent。它们共享同一个企业 Ontology，交换上下文、任务和结果，由 Orchestrator 汇总，只把需要人决策的内容交回来。这是一支数字团队，不是一个聊天框。</p>
<h3>合上笔记本，公司不会停</h3>
<p>定时例程和事件触发让 Agent 在你离开电脑之后继续执行授权任务；当客户、订单或市场状态变化时自动启动。云端运行意味着办公室、工厂、展会和机场进入的是同一个企业 AI 工作空间。<a href="workforce.html">认识 AI 员工</a>。</p>`,
      `
<h3>The difference between an employee and a bot</h3>
<p>A chatbot starts from a blank prompt and is finished after one answer. An AI employee has a role, a goal, skills, tools, memory, enterprise knowledge, permissions, tasks and execution evidence. It knows what it is responsible for, what the company has, and which actions must be cleared with a person first.</p>
<h3>What 288 stands for</h3>
<p>288 is the STARGO WORK workforce capability system: roles in market research, importer intelligence, dealer discovery, buying-committee mapping, product matching, quoting, follow-up, documentation, content and more. Model calls, concurrency and automated tasks are configured per plan; it is not unlimited model usage — the <a href="pricing.html">pricing</a> page says the same.</p>
<h3>Teams in seconds</h3>
<p>One complex goal — entering a new market to find dealers, say — calls research, importer, dealer, company, buying-committee, product, email, CRM and follow-up agents at once. They share the enterprise ontology, exchange context, tasks and results, and an orchestrator consolidates the work and hands back only what needs a human decision. A digital team, not a chat window.</p>
<h3>The company doesn’t stop when you close your laptop</h3>
<p>Scheduled routines and event triggers keep agents running authorised tasks after you leave the desk, and start them automatically when a customer, order or market state changes. Running in the cloud means the office, the factory, the trade show and the airport all open the same enterprise AI workspace. <a href="workforce.html">Meet the AI workforce</a>.</p>`),
  },
  {
    slug: 'enterprise-ontology-explained',
    date: '2026-06-18',
    cover: 'enterprise-ontology-explained',
    keywords: ['企业本体', 'Ontology', '企业上下文', 'enterprise ontology', 'business objects'],
    title: B('企业本体：给 AI 一个企业模型', 'The enterprise ontology: a model of your business, for AI'),
    description: B('CRM 里有客户，ERP 里有订单，邮箱里有询盘，它们互不知道彼此。运营本体把企业映射为 AI 可以理解和操作的业务对象，让 288 个 AI 员工在同一个现实里协作。', 'The CRM has customers, the ERP has orders, the mailbox has inquiries, and none of them knows the others. The operational ontology maps the company into objects AI can understand and act on.'),
    body: B(`
<h3>数据表不等于理解</h3>
<p>CRM 里有客户，ERP 里有订单，邮箱里有询盘，网盘里有产品文件。它们各自正确，却互不知道彼此的关系。AI 读到的是几张孤立的表，而不是一家正在运转的公司——所以它回答问题时经常「差一点」，因为它不知道这份报价属于哪个客户、这个订单来自哪次报价。</p>
<h3>本体是什么</h3>
<p>运营本体（Operational Ontology）把企业的真实世界映射为 AI 可以理解和操作的业务对象：客户、产品、询盘、机会、报价、订单、文件、任务、Agent 和市场信号，以及它们之间的关系、状态、动作类型和业务逻辑。</p>
<ul>
<li>一份<strong>报价</strong>知道它来自哪一次询盘、哪个配置、哪条价格规则，是否越过利润护栏，谁批准的。</li>
<li>一个<strong>订单</strong>知道它来自哪一次报价、处于什么阶段、有没有付款、哪些文件已经准备、什么操作需要审批。</li>
<li>一个<strong>任务</strong>知道目标、待办、状态、负责人、证据和审批——即使执行被打断，系统依然知道做到哪里。</li>
</ul>
<h3>为什么先建本体</h3>
<p>有了共享的企业模型，288 个 AI 员工才能在同一个现实里协作：任何一个能力的输出都是另一个能力的输入。Customer 360、Quote Studio、Trade Execution 和 Evolution Engine 都建立在这一层之上；跨系统身份（Identity Spine）让同一个客户在 CRM、邮箱和订单里是同一个对象。</p>
<p>本体、前置部署、主动执行与可治理的进化，一起构成<a href="intelligence.html">智能层</a>。</p>`,
      `
<h3>Tables are not understanding</h3>
<p>The CRM has customers, the ERP has orders, the mailbox has inquiries, the shared drive has product files. Each is correct on its own, and none of them knows how it relates to the others. What AI reads is a handful of isolated tables, not a company in motion — which is why its answers are so often “almost right”: it doesn’t know which customer this quote belongs to or which quote this order came from.</p>
<h3>What the ontology is</h3>
<p>The operational ontology maps the real business into objects AI can understand and act on: customers, products, inquiries, opportunities, quotes, orders, documents, tasks, agents and market signals, together with their relationships, states, action types and business logic.</p>
<ul>
<li>A <strong>quote</strong> knows which inquiry it came from, which configuration and pricing rule it used, whether it crossed the margin guardrail, and who approved it.</li>
<li>An <strong>order</strong> knows which quote it came from, what stage it is at, whether it is paid, which documents exist and which operations need approval.</li>
<li>A <strong>task</strong> knows its goal, to-dos, state, owner, evidence and approvals — even when execution is interrupted, the system knows where it stands.</li>
</ul>
<h3>Why the ontology comes first</h3>
<p>With a shared model of the business, 288 AI employees can work inside the same reality: any capability’s output is another capability’s input. Customer 360, Quote Studio, Trade Execution and the Evolution Engine are all built on this layer, and the Identity Spine makes one customer the same object across the CRM, the mailbox and the order book.</p>
<p>Ontology, forward deployment, proactive execution and governed evolution together make up the <a href="intelligence.html">Intelligence</a> layer.</p>`),
  },
];

export const postPath = (post) => `blog/${post.slug}.html`;
export const featured = (n = 4) => POSTS.slice(0, n);
export const others = (post, n = 3) => POSTS.filter((p) => p.slug !== post.slug).slice(0, n);
export const coverSrc = (post) => `assets/blog/${post.cover}.webp`;
export const coverSrcset = (post) => [500, 800].map((w) => `assets/blog/${post.cover}-${w}.webp ${w}w`).concat(`assets/blog/${post.cover}.webp 1200w`).join(', ');

/** Dates as the reader expects them. */
export const formatDate = (iso, lang) => {
  const [y, m, d] = iso.split('-').map(Number);
  return lang === 'zh' ? `${y} 年 ${m} 月 ${d} 日` : new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

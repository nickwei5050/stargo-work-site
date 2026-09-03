/**
 * Every word the site shows, in both languages, keyed by the template string
 * it replaces. Owner-approved narrative (2026-09-03): STARGO WORK as the AI
 * Operating System for Global Trade; 288 AI employees; published pricing;
 * public contact details. Nothing here is a template's own copy.
 *
 * Shape: B(zh, en) is a bilingual pair. Page maps are ordered lists of
 * [templateString, pair, options] applied in sequence (long strings first,
 * so a short word never matches inside a sentence that is about to change).
 */
export const B = (zh, en) => ({ zh, en });

export const LANGS = ['zh', 'en'];

/* ============================================================== chrome === */

export const NAV = [
  { href: 'index.html', label: B('首页', 'Trade OS') },
  { href: 'intelligence.html', label: B('智能层', 'Intelligence') },
  { href: 'capabilities.html', label: B('能力', 'Capabilities') },
  { href: 'workforce.html', label: B('数字员工', 'AI Workforce') },
  { href: 'pricing.html', label: B('定价', 'Pricing') },
  { href: 'enterprise.html', label: B('企业与治理', 'Enterprise') },
  { href: 'contact.html', label: B('联系', 'Contact') },
];
export const SECONDARY = [
  { href: 'notices.html', label: B('第三方声明', 'Notices') },
];
export const LANG_SWITCH = B('EN', '中文');

export const CONTACT_INFO = {
  email: 'sales@stargomoto.com',
  whatsapp: '+86 187 7512 7878',
  whatsappHref: 'https://wa.me/8618775127878',
  site: 'www.stargomoto.com',
  siteHref: 'https://www.stargomoto.com',
  address: B('柳州 · 广西 · 中国', 'Liuzhou, Guangxi, China'),
};

/** Strings shared by every Mono page (footer, contact band, tooltips). */
export const CHROME = [
  ['Crafting visuals. Shaping stories.', B('面向全球贸易的 AI 操作系统。', 'The AI Operating System for Global Trade.')],
  ['Let’s create great work together!', B('288 位 AI 员工。一个操作系统。', '288 AI Employees. One Operating System.')],
  ['Let’s Collaborate', B('预约演示', 'Book a Demo')],
  ['(Newsletter)', B('(订阅更新)', '(Newsletter)')],
  ['Be the first to know what’s new.', B('产品进展第一时间通知你。', 'Be the first to know what’s new.')],
  ['No noise. Just curated updates.', B('不发广告，只发产品更新。', 'No noise. Just product updates.')],
  ['Thank you for subscribing!', B('订阅成功。', 'You are subscribed.')],
  ['Oops! Something went wrong while submitting the form.', B('提交失败，请稍后重试。', 'Something went wrong. Please try again.')],
  ['Thank you! Your submission has been received!', B('已收到，我们会尽快联系你。', 'Received. We will be in touch shortly.')],
  ['© 2026 Mōno™ Studio -', B('© 2026 STARGO WORK -', '© 2026 STARGO WORK -')],
  ['© 2026 Mōno™ Studio', B('© 2026 STARGO WORK', '© 2026 STARGO WORK')],
  ['(Pages)', B('(页面)', '(Pages)')],
  ['(New Projects / Business)', B('(商务合作)', '(Business)')],
  ['(General Inquiries)', B('(一般咨询)', '(General)')],
  ['(Location)', B('(地址)', '(Location)')],
  ['(Social)', B('(社交)', '(Social)')],
  ['Roc Boronat 112, Floor 3 - Door 2 (08018) Barcelona, Spain', CONTACT_INFO.address],
  ['placeholder="E-mail"', B('placeholder="邮箱"', 'placeholder="E-mail"')],
  ['value="Subscribe"', B('value="订阅"', 'value="Subscribe"')],
  ['data-wait="Please wait..."', B('data-wait="请稍候…"', 'data-wait="Please wait…"')],
  ['(Contact us)', B('(联系我们)', '(Contact us)')],
  ['Let&#x27;s talk.', B('聊聊。', 'Let’s talk.')],
  ['placeholder="Name"', B('placeholder="姓名"', 'placeholder="Name"')],
  ['placeholder="Last Name"', B('placeholder="公司"', 'placeholder="Company"')],
  ['placeholder="Email"', B('placeholder="邮箱"', 'placeholder="Email"')],
  ['value="Contact us"', B('value="发送"', 'value="Send"')],
  ['value="Contact Us"', B('value="发送"', 'value="Send"')],
  ['By contacting us, you accept our', B('提交即表示你接受我们的', 'By contacting us, you accept our')],
  ['>Terms</a> and <', B('>使用条款</a> 与 <', '>Terms</a> and <')],
  ['>Terms<', B('>使用条款<', '>Terms<')],
  ['>Privacy Policy<', B('>隐私政策<', '>Privacy Policy<')],
  ['>View Work<', B('>查看<', '>View<')],
  ['>Read more<', B('>阅读<', '>Read more<')],
  ['Talk to Denis', B('预约企业 AI 演示', 'Book a demo')],
  ['>Schedule a call<', B('>预约演示<', '>Book a demo<')],
  ['>Get in touch<', B('>联系我们<', '>Get in touch<')],
  ['>Terms of use<', B('>使用条款<', '>Terms of use<')],
  ['>Privacy policy<', B('>隐私政策<', '>Privacy policy<')],
  ['>Licensing<', B('>第三方声明<', '>Notices<')],
  ['>contact@monostudio.io<', B(`>${CONTACT_INFO.email}<`, `>${CONTACT_INFO.email}<`)],
  ['>info@monostudio.io<', B(`>${CONTACT_INFO.site}<`, `>${CONTACT_INFO.site}<`)],
  ['>(+1) 930 046 720<', B(`>WhatsApp ${CONTACT_INFO.whatsapp}<`, `>WhatsApp ${CONTACT_INFO.whatsapp}<`)],
  ['href="mailto:contact@monostudio.io"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="mailto:info@monostudio.io"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="tel:(+1)930046720"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.linkedin.com/"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="https://www.twitter.com/"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.dribbble.com/"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="https://cal.com/"', B('href="contact.html"', 'href="contact.html"')],
];

export const META = {
  'index.html': { title: B('STARGO WORK — 面向全球贸易的 AI 操作系统', 'STARGO WORK — The AI Operating System for Global Trade'), description: B('STARGO WORK 是为制造业与外贸企业打造的云端 AI 工作系统：288 个 AI 员工在同一个企业上下文中协同，把获客、询盘、客户、报价、订单、出口单证和跟进连接成一个持续运行的业务闭环。', 'STARGO WORK is the cloud AI work system for manufacturers and global-trade companies: 288 AI employees in one shared context, connecting acquisition, inquiries, customers, quotes, orders, export documents and follow-up into one continuously running loop.') },
  'intelligence.html': { title: B('智能层', 'Intelligence'), description: B('为什么 STARGO WORK 不是聊天机器人：运营本体、前置部署智能、主动执行、288 个共享上下文的 AI 员工、长任务执行与可治理的自我进化。', 'Why STARGO WORK is not a chatbot: operational ontology, forward-deployed intelligence, proactive execution, 288 AI employees sharing one context, long-horizon execution and governed self-evolution.') },
  'capabilities.html': { title: B('能力', 'Capabilities'), description: B('一个 AI 操作系统，覆盖全球贸易每个环节：14 个能力域，从指挥工作台、获客、渠道、询盘、CRM、知识、报价、订单履约、内容到 AI 员工、自动化、本体、治理与进化引擎。', 'One AI operating system for every stage of global trade: 14 capability groups from command workspace, growth, channels, inquiries, CRM, knowledge, quoting, trade execution and content to AI workforce, automation, ontology, governance and the evolution engine.') },
  'workforce.html': { title: B('数字员工', 'AI Workforce'), description: B('288 个 AI 员工，一家云端公司。每个 AI 员工都有岗位、目标、知识、工具、权限与执行记录，可以秒级组队、并行工作、定时运行，并在需要决策时找到你。', '288 AI employees. One cloud company. Each has a role, goal, knowledge, tools, permissions and an execution record; they form teams in seconds, work in parallel, run on schedule and find you when a decision is needed.') },
  'pricing.html': { title: B('定价', 'Pricing'), description: B('从企业需要的 AI 层级开始：Foundation、Launch、Growth、Global Acquisition 与 Enterprise。', 'Start with the level of AI your company needs: Foundation, Launch, Growth, Global Acquisition and Enterprise.') },
  'enterprise.html': { title: B('企业与治理', 'Enterprise'), description: B('能执行，也能被控制：权限、审批闸门、证据、审计台账、凭据管理、租户隔离、Canary 与回滚；通过 API、MCP 与连接器接入已有系统；云端、专属环境或私有化部署。', 'Built to act, built to be controlled: permissions, approval gates, evidence, audit ledger, credential management, tenant isolation, canary and rollback; connects to existing systems through API, MCP and connectors; cloud, dedicated or private deployment.') },
  'contact.html': { title: B('联系', 'Contact'), description: B('从一条流程开始。告诉我们最影响效率或增长的一条业务流程，我们从那里开始。', 'Start with one workflow. Tell us the process that most affects efficiency or growth, and we start there.') },
  'notices.html': { title: B('第三方声明', 'Third-party notices'), description: B('模板、运行时库、字体、图片素材与上游软件的许可与署名。', 'Licences and attribution for templates, runtime libraries, fonts, imagery and upstream software.') },
  '404.html': { title: B('404', '404'), description: B('页面不存在。', 'Page not found.') },
};

/* ============================================================ homepage === */

const LOOP_LABELS = [
  B('发现与判断', 'Discover & Qualify'), B('触达与对话', 'Engage & Understand'), B('理解与回复', 'Respond'),
  B('报价与订单', 'Quote & Execute'), B('跟进与学习', 'Follow & Learn'),
];
const LOOP_DESC = [
  B('AI 持续从公开市场、搜索、社交平台、贸易数据和经销商网络中寻找正在发生的需求，再用六因子评分判断谁真正值得跟进。', 'AI keeps scanning public markets, search, social platforms, trade data and dealer networks for demand that is happening now, then scores who is actually worth the follow-up.'),
  B('按客户公司、市场、职位与采购场景生成个性化触达；Email、WhatsApp、Alibaba 与官网的对话进入同一条客户时间线。', 'Personalised outreach by company, market, role and buying scenario; conversations from Email, WhatsApp, Alibaba and the website land on one customer timeline.'),
  B('询盘进来即识别客户、市场、意图与风险；回复调用企业知识库、产品数据与历史报价——简单问题自动处理，复杂问题进入人工审批。', 'An inquiry is read for who, which market, what intent and what risk; the reply draws on the knowledge base, product data and past quotes — simple questions handled, complex ones routed to approval.'),
  B('Quote Studio 按客户、配置、数量、价格规则与利润护栏生成报价草稿；审批通过后进入 PI、订单、生产、出货与出口单证。', 'Quote Studio drafts the quote from customer, configuration, quantity, pricing rules and margin guardrails; after approval it flows into PI, order, production, shipment and export documents.'),
  B('沉睡客户再激活、展会线索持续转化；每一次成交结果回到 Evolution Engine，让下一次执行更好。', 'Dormant leads are reactivated and trade-show contacts kept warm; every outcome feeds the Evolution Engine so the next run is better.'),
];

/** Mono homepage: [templateString, pair, opts]. Order matters. */
export const HOME_MONO = [
  /* testimonials → one customer, every channel, one memory */
  ['&quot;Working with Mōno™ felt like having an internal team rather than an external agency. They were proactive, detail-oriented, and genuinely invested in the outcome.&quot;',
    B('客户不会按照你的 CRM 工作。有人发 Email，有人发 WhatsApp，有人从 Alibaba 来，有人在官网咨询。', 'Customers don’t work the way your CRM does. Some email, some WhatsApp, some come from Alibaba, some ask on the website.')],
  ['John Doe', B('Customer Timeline', 'Customer Timeline')],
  ['Head design at Circle®', B('所有沟通进入同一条时间线', 'Every conversation on one timeline')],
  ['“We didn’t just get a website — we got a solid digital foundation. Mōno™ is the kind of partner you want when building something meant to last.”',
    B('AI 可以读取客户背景、历史对话、产品偏好、报价历史、未完成任务、知识库和订单状态。', 'AI reads the customer background, past conversations, product preferences, quote history, open tasks, the knowledge base and order status.')],
  ['Amantha Doe', B('Customer 360', 'Customer 360')],
  ['Founder of Radius®', B('每一次交流都会更新它', 'Updated by every exchange')],
  ['“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”',
    B('所以客户换一个渠道，企业不需要重新认识他一次。', 'So when a customer switches channel, the company doesn’t have to meet them again.')],
  ['Max Trump', B('Unified Inbox', 'Unified Inbox')],
  ['Founder of Light Studio®', B('Email · WhatsApp · Alibaba · 官网', 'Email · WhatsApp · Alibaba · Website')],
  ['“What stood out with Mōno™ was the balance between design quality and technical execution. Everything was thoughtful, scalable, and built with term use in mind.”',
    B('不知道的事情，不让 AI 编。简单问题自动处理，复杂问题进入人工审批。', 'What it doesn’t know, it doesn’t make up. Simple questions are handled; complex ones go to a human.')],
  ['Camila Verga', B('Knowledge-Grounded Reply', 'Knowledge-Grounded Reply')],
  ['Head design at LogoIspum®', B('企业知识库 · 产品数据库 · 历史报价', 'Knowledge base · product data · past quotes')],
  ['&quot;Mōno™ helped us simplify complexity. They streamlined our product narrative, improved performance, and delivered a digital experience that truly reflects our brand. The results were immediate — higher engagement.&quot;',
    B('「传统 CRM 只管理已经出现的客户。STARGO Growth OS 的目标，是帮助企业发现还没有进入 CRM 的未来客户。」', '“A traditional CRM manages the customers who already showed up. STARGO Growth OS exists to find the future customers who are not in your CRM yet.”')],
  ['Elena Rossi', B('STARGO Growth OS', 'STARGO Growth OS')],
  ['Marketing Director at Auralis®', B('别再等询盘。', 'Stop waiting for leads.')],

  /* stats → from conversation to revenue */
  ['Mōno™ stands behind the data.', B('从市场信号到订单，一条链。', 'From market signal to order. One chain.')],
  ['Our success is reflected in the numbers we achieve for our clients. Every project is designed with measurable growth at its core.',
    B('市场信号 → 合格客户 → 对话 → Customer 360 → 产品匹配 → 报价 → 人工审批 → PI / 订单 → 贸易执行 → 跟进 → 结果 → 进化。这不是一个 AI 聊天框，这是 STARGO WORK 的全球贸易运行闭环。', 'Market signal → qualified account → conversation → Customer 360 → product match → quote → human approval → PI / order → trade execution → follow-up → outcome → evolution. Not an AI chatbox: the global trade loop STARGO WORK runs.')],
  ['(Value created)', B('(AI 员工)', '(AI employees)')],
  ['$174M', B('288', '288')],
  ['Empowering growth through strategic solutions.', B('在同一个企业上下文中协同工作。', 'Working in one shared business context.')],
  ['CRI: 5.1% → 6.7%', B('岗位 · 目标 · 技能 · 工具', 'Role · Goal · Skills · Tools')],
  ['“We didn’t expect smoother onboarding and a noticeable lift in qualified leads.”', B('「一支数字团队，不是一个聊天框。」', '“A digital team, not a chatbox.”')],
  ['Daniel Kim', B('AI Workforce', 'AI Workforce')],
  ['(Return client rate)', B('(闭环阶段)', '(Loop stages)')],
  ['92%', B('9', '9')],
  ['Building lasting partnerships built on trust.', B('从发现到学习，每一步都在系统里。', 'Discover to Learn — every step inside the system.')],
  ['CRI: 2.9% → 4.4%', B('记忆 · 知识 · 权限', 'Memory · Knowledge · Permissions')],
  ['“Everything feels faster, clearer, and more premium. We shipped the redesign and conversions followed immediately.”', B('「结果重新进入数据飞轮。」', '“Outcomes flow back into the flywheel.”')],
  ['Olivia Carter', B('Trade Loop', 'Trade Loop')],
  ['(Projects delivered)', B('(能力域)', '(Capability groups)')],
  ['+320', B('14', '14')],
  ['Driving successful outcomes across industries.', B('从指挥工作台到进化引擎。', 'From command workspace to evolution engine.')],
  ['CRI: 1.7% → 2.6%', B('指挥 · 获客 · 报价 · 履约', 'Command · Growth · Quote · Trade')],
  ['“The new site finally matches our product. Cleaner UX, better messaging, and results we can actually measure.”', B('「一个操作系统，很多完整的业务能力。」', '“One operating system, many complete business capabilities.”')],
  ['Marcus Reed', B('Capabilities', 'Capabilities')],
  ['(Client retention)', B('(操作系统)', '(Operating system)')],
  ['88%', B('1', '1')],
  ['Optimized journeys that turn traffic into growth.', B('云端运行，合上笔记本也不停。', 'Runs in the cloud. Doesn’t stop when you close the laptop.')],
  ['CRI: 3.8% → 5.6%', B('云端 · 桌面 · 移动端', 'Cloud · Desktop · Mobile')],
  ['“The redesign removed friction everywhere. It’s simple, sharp, and performs better across every device.”', B('「你的 AI 团队已经上线。」', '“Your AI team is already online.”')],
  ['Sofia Martinez', B('STARGO WORK', 'STARGO WORK')],

  /* FAQ */
  ['What services does your agency offer?', B('STARGO WORK 到底是什么？', 'What is STARGO WORK?')],
  ['We specialize in branding, website design and development, social media marketing, paid ads, SEO, and content strategy',
    B('为制造业与外贸企业打造的 AI 操作系统。不是聊天机器人，也不是 288 个互不相关的 Agent，而是一套拥有企业上下文、业务本体、长期状态、任务执行、协作、审批和持续进化能力的 AI Workforce 操作系统', 'An AI operating system built for manufacturers and global-trade companies. Not a chatbot and not 288 unrelated agents: one AI workforce operating system with enterprise context, a business ontology, long-lived state, task execution, collaboration, approval and continuous evolution')],
  ['How do you determine the right strategy?', B('它和 ChatGPT 有什么不同？', 'How is it different from ChatGPT?')],
  ['Every project starts with a discovery phase where we analyze your goals, audience, and competitors. Based on this, we craft a custom strategy that aligns with your objectives and maximizes your digital',
    B('ChatGPT 在你提问之后回答一次。STARGO WORK 理解企业里有什么、正在发生什么、想达到什么结果，并在授权范围内主动行动：发现变化、生成任务、调动 AI 员工、请求审批、继续推进', 'ChatGPT answers once, after you ask. STARGO WORK understands what the company has, what is happening and what it wants, and acts within its authority: it spots the change, creates the task, mobilises the right AI employees, asks for approval and keeps going')],
  ['How long does a typical project take?', B('288 个 AI 员工是什么？', 'What are the 288 AI employees?')],
  ['Project timelines vary depending on scope. A branding or website project typically takes 4–8 weeks, while marketing campaigns are ongoing with monthly optimization and reporting',
    B('每个 AI 员工都有岗位、目标、技能、工具、记忆、企业知识、权限、任务和执行证据。它们共享企业 Ontology，可以按任务组成不同的 Agent Team 并行工作，由 Orchestrator 汇总结果，把需要人决策的内容交回来', 'Each has a role, goal, skills, tools, memory, enterprise knowledge, permissions, tasks and execution evidence. They share the enterprise ontology, form agent teams per task and work in parallel; the orchestrator hands back only what needs a human decision')],
  ['Do you work with businesses in any industry?', B('关键动作谁来批？', 'Who approves the important actions?')],
  ['Yes! We’ve worked with startups, tech companies, e-commerce brands, real estate firms, and service providers. Our process is adaptable to fit the needs of different industries and audiences',
    B('企业。价格、利润、正式报价、PI、重要客户回复和关键业务动作都可以设置审批闸门。AI 承担工作，人保留权力', 'You do. Price, margin, formal quotes, PI, key customer replies and critical business actions can all sit behind an approval gate. AI does the work; people keep the authority')],

  /* hero support */
  ['No cookie cutter sites. No empty claims. Only practical tools and smart strategies that drive growth and build brands.',
    B('为制造业与外贸企业打造的云端 AI 工作系统。从寻找潜在客户、判断采购机会、回复询盘，到客户管理、报价、订单、出口单证和后续跟进，288 个专业 AI 员工在同一个企业上下文中协同工作，把分散在人、软件、表格和聊天窗口里的外贸流程，连接成一个持续运行的业务闭环。', 'The cloud AI work system built for manufacturers and global-trade companies. From finding prospects, judging buying opportunities and answering inquiries to customer management, quoting, orders, export documents and follow-up, 288 specialised AI employees work in one shared business context — turning a trade process scattered across people, software, spreadsheets and chat windows into one continuously running loop.')],

  /* who we are → 288 */
  ['We shape brands with focus, intention, and impact.', B('288 个专业 AI 员工，在同一个企业上下文中协同工作。', '288 specialised AI employees, working in one shared business context.')],
  ['Pricing with', B('把工作交给 AI。', 'Delegate the work.')],
  ['complete transparency', B('权力留在企业。', 'Keep the authority.')],
  ['(Performance Boost)', B('(人始终掌握决定权)', '(Humans stay in command)')],
  ['Page speed +78%,', B('价格、利润、正式报价、PI、', 'Price, margin, formal quotes, PI —')],
  ['Bounce rate -13%', B('都可以设置审批闸门。', 'each can sit behind an approval gate.')],
  ['View pricing', B('认识 AI 员工', 'Meet the AI workforce')],
  ['(Live collaboration)', B('(一次真实的审批)', '(A real approval)')],
  ['Today 17:01', B('今天 17:01', 'Today 17:01')],
  ['Today 17:02', B('今天 17:02', 'Today 17:02')],
  ['Hey hey!', B('报价草稿已生成', 'Quote draft ready')],
  ['Love the design', B('毛利 23%，低于护栏 25%', 'Margin 23%, below the 25% guardrail')],
  ['Can we tweak the hero?', B('需要你审批', 'Needs your approval')],
  ['>Sure<', B('>按 24% 批准<', '>Approved at 24%<')],
  ['We’ll update it shortly', B('PI 已生成', 'PI generated')],
  ['Perfect! Thank you.', B('客户已收到报价。', 'Quote sent to the customer.')],

  /* marquee */
  ['Built Different', B('不是聊天框。', 'Not a chatbox.')],
  ['Design with purpose', B('发现买家。', 'Find buyers.')],
  ['Code with passion', B('理解询盘。', 'Understand inquiries.')],
  ['Create with vision', B('保护利润。', 'Protect margins.')],
  ['Innovate always', B('从结果学习。', 'Learn from outcomes.')],
  ['(Our Vision)', B('(一个外贸闭环)', '(One trade loop)')],
  ['(Scroll for more)', B('(继续滚动)', '(Keep scrolling)')],

  /* services → the five macro stages (descriptions; titles come from the domain labels below) */
  ['We create scroll-stopping social content designed to build brand presence and drive engagement.', LOOP_DESC[1]],
  ['We craft cohesive brand identities that communicate purpose, personality, and credibility.', LOOP_DESC[3]],
  ['We develop strategic marketing assets that amplify brand reach and support growth.', LOOP_DESC[4]],

  /* pricing block → traditional vs AI-native */
  ['Choose the plan that fits you best.', B('每一次业务增长，都意味着继续增加人——还是增加 AI Capacity。', 'Every step of growth means hiring more people — or adding AI capacity.')],
  ['>Starter<', B('>传统外贸<', '>Traditional trade<')],
  ['Built for early-stage teams establishing their online presence.', B('人工搜索、逐个查背景、手写开发信、来回切换窗口、Excel 建档、手工报价、找老板确认、准备资料、人工提醒。', 'Manual search, one-by-one background checks, hand-written outreach, window-hopping, Excel records, manual quotes, waiting for the boss, paperwork, manual reminders.')],
  ['$2,000', B('加人', 'Hire')],
  ['Tailored website layouts', B('人工搜索客户，逐个判断是不是目标买家', 'Search for buyers by hand, judge each one')],
  ['Core SEO configuration', B('在 WhatsApp / Email / Alibaba 之间来回切换', 'Switch between WhatsApp, Email and Alibaba')],
  ['Mobile-first responsive design', B('翻产品文件找参数，手工制作报价', 'Dig through product files, build the quote by hand')],
  ['Brand-ready UI framework', B('找老板确认价格，再制作 PI', 'Chase the boss for a price, then make the PI')],
  ['Ideal for new launches and rebrands', B('人工提醒再次跟进', 'Remember to follow up')],
  ['>Growth<', B('>STARGO WORK<', '>STARGO WORK<')],
  ['Designed for businesses ready to elevate their digital experience.', B('市场信号持续发现，AI 判断采购可能性，客户研究与决策链识别自动完成，对话统一进入客户时间线。', 'Market signals discovered continuously, AI judges buying likelihood, account research and buying-committee mapping happen automatically, every conversation lands on one timeline.')],
  ['$4,000', B('加 AI', 'Add AI')],
  ['High-end design with smooth interactions', B('自动建立 Account 360，企业知识参与每一次回复', 'Account 360 builds itself; enterprise knowledge joins every reply')],
  ['Complete on-site SEO setup', B('产品智能匹配，Quote Studio 生成报价草稿', 'Product matching; Quote Studio drafts the quote')],
  ['Adaptive layouts for every screen', B('利润与价格规则检查，人工审批', 'Margin and pricing rules checked, human approval')],
  ['CMS setup for content or case studies', B('PI / 订单 / 出口文件进入工作流', 'PI, order and export documents enter the workflow')],
  ['Performance tuning &amp; optimization', B('AI 持续跟进，成交结果回到数据飞轮', 'AI keeps following up; outcomes feed the flywheel')],
  ['1-2 weeks', B('继续增加人', 'more people')],
  ['2-3 weeks', B('增加 AI Capacity', 'more AI capacity')],
  ['(Looking for more?)', B('(从哪里开始？)', '(Where to start?)')],
  ['Expand your scope with marketing, SEO, or content creation.', B('不需要一次改变整个企业。选择一条最重要的业务流程，让 STARGO WORK 从那里开始工作。', 'You don’t need to change the whole company at once. Pick the one workflow that matters most and let STARGO WORK start there.')],

  /* work cards → the problem */
  ['(Portfolio 26©)', B('(问题从来不是缺一个软件)', '(The problem was never a missing tool)')],
  ['<h2 class="h2">Work<span class="small-ftd">(4)</span></h2>', B('<h2 class="h2">工具很多，彼此不知道<span class="small-ftd">(4)</span></h2>', '<h2 class="h2">Many tools. None of them talk.<span class="small-ftd">(4)</span></h2>')],
  ['Forma Digital', B('邮箱负责询盘', 'Email owns the inquiry')],
  ['One Step', B('WhatsApp 负责聊天', 'WhatsApp owns the chat')],
  ['Nero Vision', B('Excel 负责客户', 'Excel owns the customer')],
  ['Bold Moves', B('ERP 负责订单', 'ERP owns the order')],
  ['View all work', B('看闭环怎么连起来', 'See how the loop connects')],

  /* blog → Growth OS */
  ['Smart insights.', B('别再等询盘。', 'Stop waiting for leads.')],
  ['>See all<', B('>看全部能力<', '>All capabilities<')],
  ['November 11, 2025', B('Importer Reorder Radar', 'Importer Reorder Radar')],
  ['The power of simplicity in modern real brand design', B('进口商补货雷达：谁正在进入补货周期', 'Which importers are entering a reorder cycle')],
  ['October 1, 2025', B('Competitor Customer Graph', 'Competitor Customer Graph')],
  ['From idea to execution: building products that last', B('竞争对手客户图谱：对手在卖给谁', 'Who your competitors are selling to')],
  ['October 3, 2026', B('Buying Committee Intelligence', 'Buying Committee Intelligence')],
  ['Why great brands are built on clarity, not complexity', B('决策链识别：谁真正拍板', 'Who actually decides')],
  ['October 4, 2025', B('Trade Signal Revenue Engine', 'Trade Signal Revenue Engine')],
  ['Designing digital systems that scale your business', B('贸易信号收入引擎：把信号变成收入', 'Turn trade signals into revenue')],

  /* short / global */
  ['>Get started<', B('>看能力全景<', '>See all capabilities<')],
  ['>Book a call<', B('>预约演示<', '>Book a Demo<')],
  ['>Contact us<', B('>预约演示<', '>Book a Demo<')],
  ['Let&#x27;s talk', B('预约演示', 'Book a Demo')],
  ['Scroll Down', B('向下滚动', 'Scroll down')],
  ['(Who we are)', B('(288 位 AI 员工)', '(288 AI employees)')],
  ['(Team of experts)', B('(可组成团队)', '(Form teams)')],
  ['(Services)', B('(外贸闭环 · 五个阶段)', '(The trade loop · five stages)')],
  ['(Pricing)', B('(两种外贸)', '(Two ways to run trade)')],
  ['(FAQ)', B('(常见问题)', '(FAQ)')],
  ['(Testimonials)', B('(一个客户，所有渠道，一份记忆)', '(One customer. Every channel. One memory.)')],
  ['(Success stories)', B('(STARGO Growth OS)', '(STARGO Growth OS)')],
  ['(Stats)', B('(从对话到收入)', '(From conversation to revenue)')],
  ['(Blog)', B('(Growth OS 核心能力)', '(Growth OS capabilities)')],
  ['(Project)', B('(每次增长)', '(each growth step)')],
  ['What&#x27;s included:', B('流程：', 'The flow:')],
  ['Timeline:', B('增长方式：', 'Growth means:')],
  ['Pick Smart.', B('传统外贸。', 'Traditional trade.')],
  ['Pay Less.', B('AI 原生外贸。', 'AI-native trade.')],
  ['Build Better.', B('差别在闭环。', 'The difference is the loop.')],
  ['Web Design', LOOP_LABELS[0]],
  ['Social Media', LOOP_LABELS[1]],
  ['Development', LOOP_LABELS[2]],
  ['Brand Identity', LOOP_LABELS[3]],
  ['>Marketing<', B(`>${LOOP_LABELS[4].zh}<`, `>${LOOP_LABELS[4].en}<`)],
  ['Showreel 26©', B('产品剧场 2026©', 'Product theatre 2026©')],
  ['+13', B('288', '288')],
  ['team members', B('AI 员工', 'AI employees')],
  ['across the', B('覆盖', 'across')],
  ['>World<', B('>全球贸易闭环<', '>the global trade loop<')],
  ['>+9<', B('>288<', '>288<')],
  ['(Home)', B('(首页)', '(Trade OS)')],
  ['Page Layouts', B('页面', 'Pages')],
  ['2011-26©', B('2026©', '2026©')],
];
/** The same sentence ships twice (stages 001 and 003); replaced by position. */
export const HOME_DUP_DESC = {
  original: 'Modern, responsive, and user-friendly websites designed to engage visitors and drive conversions.',
  first: LOOP_DESC[0],
  second: LOOP_DESC[2],
};
export const HOME_BRAND_WALL = {
  caption: B('(我们服务过的品牌)', '(Brands we have served)'),
  captionNoLogos: B('(面向全球贸易的 AI 操作系统)', '(AI Operating System for Global Trade)'),
  year: B('2026©', '2026©'),
};
export const HOME_LOOP_TABLE = {
  caption: B('(九个阶段)', '(Nine stages)'),
  title: B('一个外贸闭环', 'One closed loop'),
  headers: [B('(阶段)', '(Stage)'), B('(发生什么)', '(What happens)'), B('(要点)', '(The point)')],
  button: B('看每一步背后的能力', 'See the capabilities behind each step'),
  rows: [
    ['01 · DISCOVER', B('发现市场机会。AI 持续从公开市场、搜索、社交平台、贸易数据、经销商网络和企业信号中寻找潜在机会。', 'Find market opportunities. AI keeps looking through public markets, search, social platforms, trade data, dealer networks and company signals.'), B('不是等询盘，而是主动寻找正在发生的需求。', 'Not waiting for inquiries — looking for demand as it happens.')],
    ['02 · QUALIFY', B('判断谁真正值得跟进。Growth OS 综合企业背景、采购信号、目标市场、产品匹配度、决策链和历史行为评分。', 'Decide who is worth following. Growth OS scores company background, buying signals, target market, product fit, decision chain and past behaviour.'), B('让业务员把时间留给真正可能成交的人。', 'Sales time goes to the people who can actually close.')],
    ['03 · ENGAGE', B('主动触达。按客户公司、市场、职位、采购场景和产品需求生成个性化内容；Email、WhatsApp、Alibaba 与官网进入同一个业务上下文。', 'Reach out. Personalised content by company, market, role, buying scenario and product need; Email, WhatsApp, Alibaba and the website share one context.'), B('多渠道，一个上下文。', 'Many channels, one context.')],
    ['04 · UNDERSTAND', B('每次对话都变成客户智能。系统识别客户是谁、来自哪个市场、想买什么、采购意图、预计需求、关键问题、历史沟通、风险信号与下一步。', 'Every conversation becomes customer intelligence: who, which market, what they want, intent, expected demand, key questions, history, risk signals and next step.'), B('每一次交流都会更新 Customer 360。', 'Every exchange updates Customer 360.')],
    ['05 · RESPOND', B('让 AI 真正理解你的产品再回复。调用企业知识库、产品数据库、历史报价、业务规则和客户上下文。', 'Reply only after AI understands your product — from the knowledge base, product database, past quotes, business rules and customer context.'), B('简单问题自动处理，复杂问题人工审批，不知道的不编。', 'Simple questions handled, complex ones approved by a human, unknowns never invented.')],
    ['06 · QUOTE', B('从询盘到报价，不再从 Excel 开始。Quote Studio 按客户、产品、配置、数量、价格规则、历史成交、利润护栏和贸易条件生成草稿。', 'From inquiry to quote without opening Excel. Quote Studio drafts from customer, product, configuration, quantity, pricing rules, past deals, margin guardrails and trade terms.'), B('价格敏感项进入审批，通过后进入正式报价与 PI。', 'Price-sensitive items go to approval, then formal quote and PI.')],
    ['07 · EXECUTE', B('从报价走到真正的订单。PI、订单、付款节点、生产进度、QC、包装、出货、Commercial Invoice、Packing List、原产地证、Form E、提单、认证资料、出口与退税流程。', 'From quote to a real order: PI, order, payment milestones, production, QC, packing, shipment, commercial invoice, packing list, certificate of origin, Form E, bill of lading, certifications, export and tax-rebate flow.'), B('销售和履约第一次使用同一条业务链。', 'Sales and fulfilment on one chain for the first time.')],
    ['08 · FOLLOW', B('AI 不会忘记客户。没有回复、报价后没决定、半年前谈过没成交、展会回来一堆名片——Dormant Lead Reactivation、Trade Show Afterburner 和 Follow-up Agents 持续寻找重新开启的时机。', 'AI doesn’t forget a customer. No reply, no decision after the quote, a conversation from six months ago, a stack of trade-show cards — Dormant Lead Reactivation, Trade Show Afterburner and Follow-up Agents keep looking for the moment to reopen.'), B('每一个线索都有下一次。', 'Every lead gets a next time.')],
    ['09 · LEARN', B('每一次结果，让下一次执行更好。哪些客户成交、哪个市场转化更好、哪些开发方式有效、哪些报价被接受——结果回到 Evolution Engine。', 'Every outcome makes the next run better. Which customers closed, which market converts, which outreach works, which quotes were accepted — outcomes return to the Evolution Engine.'), B('系统不只储存数据，它学习企业如何做成生意。', 'The system doesn’t just store data; it learns how the company wins business.')],
  ],
};

/** Scalora fragments on the homepage. */
export const HOME_SC_HERO = [
  ['All in one ecosystem for your business', B('(一个闭环)', '(One closed loop)')],
  ['The platform that ', B('从询盘到订单，', 'One trade loop ')],
  ['helps you', B('AI 帮你', 'that helps you')],
  ['Build.', B('发现。', 'Discover.'), { count: 2 }],
  ['Scale.', B('判断。', 'Qualify.')],
  ['Operate.', B('报价。', 'Quote.')],
  ['Scalora is a business platform designed to help teams manage marketing, operations, and growth from one workspace.',
    B('STARGO WORK 把客户、产品、询盘、沟通、报价、订单、文件、任务和 AI 员工连接到同一个企业 AI 系统中。不是增加一个软件，而是让整个外贸业务第一次真正连接起来。', 'STARGO WORK connects customers, products, inquiries, conversations, quotes, orders, documents, tasks and AI employees in one enterprise AI system. Not one more tool — the whole trade business connected for the first time.')],
  ['Get started free', B('预约演示', 'Book a Demo'), { count: 2 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Growth OS<', '>Growth OS<'), { nth: 0 }],
  ['>CRM platform<', B('>发现还没进 CRM 的客户<', '>Find customers not in your CRM yet<'), { nth: 0 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Customer 360<', '>Customer 360<'), { nth: 0 }],
  ['>CRM platform<', B('>每一次对话都更新它<', '>Updated by every conversation<'), { nth: 0 }],
  ['Scalora Ops', B('Quote Studio', 'Quote Studio')],
  ['Product 01', B('利润护栏 · 人工审批', 'Margin guardrails · human approval')],
  ['AI Writing Tool', B('Trade Execution', 'Trade Execution')],
  ['Mentoor', B('Evolution Engine', 'Evolution Engine')],
  ['AI Sales Agent', B('Unified Inbox', 'Unified Inbox')],
  ['Hero Card Icon', B('卡片图标', 'Card icon')],
];
export const HOME_SC_PRODUCTS = [
  ['Our products', B('(核心系统)', '(Core systems)')],
  ['Meet the Scalora product ecosystem', B('同一个操作系统里的四个核心系统', 'Four core systems in one operating system')],
  ['Scalora CRM', B('Growth OS · 获客', 'Growth OS · Acquisition')],
  ['Scalora Marketing', B('Customer 360 · 客户', 'Customer 360 · Customers')],
  ['Scalora Docs', B('Quote Studio · 报价', 'Quote Studio · Quoting')],
  ['Scalora Ops', B('Trade Execution · 履约', 'Trade Execution · Fulfilment')],
  ['Manage leads, automate follow-ups, track deals, and close faster with a smart, visual CRM built for modern sales teams.',
    B('市场信号持续发现、六因子机会评分、Buying Committee 识别、经销商机会简报、沉睡客户再激活——让业务员把时间留给真正可能成交的人。', 'Continuous signal discovery, six-factor opportunity scoring, buying-committee mapping, dealer opportunity briefs, dormant-lead reactivation — so sales time goes to the accounts that can close.')],
  ['Plan, launch, and optimize campaigns across email, ads, and landing pages — all tracked in one dashboard.',
    B('Email、WhatsApp、Alibaba 与官网的对话进入同一条客户时间线；客户背景、产品偏好、报价历史、未完成任务和订单状态都在一个视图里。', 'Email, WhatsApp, Alibaba and website conversations on one customer timeline; background, product preferences, quote history, open tasks and order status in one view.')],
  ['Create, manage, and collaborate on documentation, SOPs, and internal knowledge in one flexible workspace.',
    B('按客户、产品、配置、数量、价格规则、历史成交、利润护栏和贸易条件生成报价草稿；价格敏感项进入审批，通过后进入正式报价与 PI。', 'Drafts the quote from customer, product, configuration, quantity, pricing rules, past deals, margin guardrails and trade terms; price-sensitive items go to approval, then formal quote and PI.')],
  ['Build workflows that connect your teams, data, and tools — without complex integrations.',
    B('PI、订单、付款节点、生产进度、QC、包装、出货、Commercial Invoice、Packing List、原产地证、Form E、提单、认证资料与出口退税——销售和履约第一次用同一条业务链。', 'PI, order, payment milestones, production, QC, packing, shipment, commercial invoice, packing list, certificate of origin, Form E, bill of lading, certifications and export tax rebate — sales and fulfilment on one chain for the first time.')],
  ['Dashbord Image', B('界面示意图', 'Interface illustration')],
];
export const HOME_SC_INTEGRATION = [
  ['Integration Icon', B('渠道图标', 'Channel icon')],
  ['>Integration<', B('>(全渠道获客网络)<', '>(Omnichannel growth network)<')],
  ['One AI Engine. Fully Connected.', B('新渠道接进来，用的还是同一套系统。', 'New channels plug into the same system.')],
  ['Scalora connects your CRM, website, ads, and commerce tools into one intelligent automation system.',
    B('Reddit、Google、LinkedIn、Facebook、Google Maps、Alibaba、YouTube、WhatsApp、Email——STARGO Channel Plugin 让每一个新的获客渠道接入同一套 Customer / CRM / Knowledge / Agent / Evolution 基础设施。', 'Reddit, Google, LinkedIn, Facebook, Google Maps, Alibaba, YouTube, WhatsApp, Email — STARGO Channel Plugins bring every new channel into the same customer, CRM, knowledge, agent and evolution infrastructure.')],
];

/* ====================================================== lifelogx pages === */

/** Shared slot originals of the lifelogx homepage, with two different fills. */
const LX_TAGS = { CARDS: B('客户', 'Customer'), transfers: B('报价', 'Quote'), financing: B('订单', 'Order') };

export const LX_INTELLIGENCE = {
  heroWord: B('智能层', 'Intelligence'),
  store1: { name: B('Ontology', 'Ontology'), sub: B('给 AI 一个企业模型', 'Give AI a model of your business'), href: '#lx-ontology' },
  store2: { name: B('Evolution', 'Evolution'), sub: B('可治理的自我进化', 'Governed self-evolution'), href: '#lx-evolution' },
  heroDesc: B('你的公司不需要另一个聊天机器人。它需要一个运营智能层。', 'Your company doesn’t need another chatbot. It needs an operating intelligence layer.'),
  tags: LX_TAGS,
  features: [
    { title: B('Ontology', 'Ontology'), text: B('把企业真实世界映射为 AI 可以理解和操作的业务对象——不是孤立的数据表，而是拥有关系、状态、逻辑和 Action 的对象。', 'Maps the real business into objects AI can understand and act on — not isolated tables, but objects with relationships, state, logic and actions.') },
    { title: B('前置部署', 'Forward Deployed'), text: B('软件适应企业，而不是企业适应软件。真实流程直接反馈到系统能力建设中。', 'Software adapts to the business, not the other way round. Real workflows feed straight back into the platform.') },
    { title: B('主动执行', 'Proactive'), text: B('不等提问。基于事件、时间、状态和目标持续运行，在授权范围内主动行动。', 'Doesn’t wait for prompts. Runs on events, time, state and goals, and acts within its authority.') },
  ],
  cards: [
    { title: B('Customer · 客户', 'Customer'), text: B('是谁、来自哪个市场、买过什么、正在谈什么、谁负责、下一步是什么。', 'Who they are, which market, what they bought, what is being discussed, who owns it, what comes next.') },
    { title: B('Inquiry · 询盘', 'Inquiry'), text: B('来源、意图、需求、风险信号、关联的客户与产品，以及它应该变成的下一个对象。', 'Source, intent, requirement, risk signals, the customer and product it links to, and the next object it should become.') },
    { title: B('Quote · 报价', 'Quote'), text: B('来自哪一次询盘、哪个配置、哪条价格规则，是否越过利润护栏，谁批准的。', 'Which inquiry it came from, which configuration, which pricing rule, whether it crossed a margin guardrail, who approved it.') },
    { title: B('Order · 订单', 'Order'), text: B('来自哪一次报价、处于什么阶段、有没有付款、哪些文件已经准备、什么操作需要审批。', 'Which quote it came from, what stage it is at, whether it is paid, which documents exist, which operations need approval.') },
    { title: B('Shipment · 出货', 'Shipment'), text: B('生产、QC、包装、提单、原产地证、Form E、认证资料——一个对象，一条链。', 'Production, QC, packing, bill of lading, certificate of origin, Form E, certifications — one object, one chain.') },
    { title: B('Task · 任务', 'Task'), text: B('目标、待办、状态、负责人、证据、审批、失败与恢复——即使执行被打断，系统依然知道做到哪里。', 'Goal, to-dos, state, owner, evidence, approval, failure and recovery — even when interrupted, the system knows where it is.') },
    { title: B('Agent · AI 员工', 'Agent'), text: B('岗位、目标、技能、工具、记忆、企业知识、权限、任务与执行证据。', 'Role, goal, skills, tools, memory, enterprise knowledge, permissions, tasks and execution evidence.') },
  ],
  gradient: [B('观察真实流程', 'Observe the real workflow'), B('把运营建成模型', 'Model the operation'), B('把 AI 放进流程', 'Deploy AI into the workflow'), B('用结果改进平台', 'Improve the platform')],
  bigText: B('主动，不是被动', 'Proactive by design'),
  bubbles: [
    B('一个重点客户三天没有回复。', 'A key account has gone quiet for three days.'),
    B('一个老客户可能进入补货周期。', 'An old customer may be entering a reorder cycle.'),
    B('一个新进口商开始出现采购信号。', 'A new importer starts showing buying signals.'),
    B('报价已经发送，但没有结果。', 'A quote went out and nothing came back.'),
    B('订单即将进入下一个节点。', 'An order is about to hit its next milestone.'),
    B('Follow-up Agent', 'Follow-up Agent'),
    B('某个产品在某个市场突然获得更多搜索需求。', 'A product suddenly gets more search demand in one market.'),
    B('一个客户提出了知识库无法回答的问题。', 'A customer asks something the knowledge base can’t answer.'),
    B('Market Signal Agent', 'Market Signal Agent'),
    B('发现变化 → 判断重要性 → 生成任务', 'Spot the change → judge it → create the task'),
    B('调动合适的 Agent → 执行 → 请求必要审批', 'Mobilise the right agents → execute → ask for approval'),
    B('Orchestrator', 'Orchestrator'),
  ],
  words: [B('不再', 'No'), B('等提示', 'prompting'), B('等回复', 'waiting'), B('丢上下文', 'forgetting')],
  feat2Title: B('288 个 AI 员工。', '288 AI Employees.'),
  feat2Sub: B('一个共享的企业现实。', 'One shared business reality.'),
  feat2Card: { title: B('Agent Teams', 'Agent Teams'), text: B('一个复杂任务可以同时调用市场研究、客户调查、产品、销售、报价、合规、内容和订单 Agent；它们交换上下文、任务和结果。这是一支数字团队，不是一个聊天框。', 'One complex task can call research, account, product, sales, quote, compliance, content and order agents at once; they exchange context, tasks and results. A digital team, not a chatbox.') },
  feat2Button: { label: B('认识 AI 员工', 'Meet the workforce'), href: 'workforce.html' },
  feat2Lines: [B('长任务执行', 'Long-horizon execution'), B('数小时、数天、数周', 'Hours, days, weeks'), B('中断后仍知道下一步', 'Knows the next step after a break')],
  ctaTitle: B('公司本身成为模型。', 'The company becomes the model.'),
  ctaSub: B('可治理的自我进化', 'Governed self-evolution'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('Observer → Evaluation → Improvement → Canary → Approval → Promote / Rollback', 'Observer → Evaluation → Improvement → Canary → Approval → Promote / Rollback'),
};

export const LX_WORKFORCE = {
  heroWord: B('数字员工', 'AI Workforce'),
  store1: { name: B('288 AI Employees', '288 AI Employees'), sub: B('每一个都有岗位', 'Every one of them has a job'), href: '#lx-teams' },
  store2: { name: B('Pricing', 'Pricing'), sub: B('从企业需要的层级开始', 'Start at the level you need'), href: 'pricing.html' },
  heroDesc: B('你的 AI 团队已经上线。', 'Your AI team is already online.'),
  tags: LX_TAGS,
  features: [
    { title: B('有岗位', 'Has a job'), text: B('岗位、目标、企业知识、工具、技能、客户上下文、业务规则、长期记忆、任务列表、权限、执行记录。不是从空白 Prompt 开始。', 'Role, goal, enterprise knowledge, tools, skills, customer context, business rules, long-term memory, task list, permissions, execution record. Never a blank prompt.') },
    { title: B('秒级组队', 'Teams in seconds'), text: B('「帮我进入巴西市场寻找新的经销商。」系统组成研究、进口商、经销商、公司、决策链、产品、邮件、CRM、跟进 Agent，并行工作。', '“Find us new dealers in Brazil.” The system forms research, importer, dealer, company, buying-committee, product, email, CRM and follow-up agents and runs them in parallel.') },
    { title: B('随处工作', 'Works anywhere'), text: B('云端运行。办公室、工厂、展会、机场、国外，进入同一个企业 AI 工作空间。', 'Runs in the cloud. Office, factory, trade show, airport, abroad — the same enterprise AI workspace.') },
  ],
  cards: [
    { title: B('Market Research Agent', 'Market Research Agent'), text: B('目标市场、需求变化、竞争格局。', 'Target markets, demand shifts, competitive landscape.') },
    { title: B('Importer Intelligence Agent', 'Importer Intelligence Agent'), text: B('谁在进口、多久一次、什么时候补货。', 'Who imports, how often, when they reorder.') },
    { title: B('Dealer Discovery Agent', 'Dealer Discovery Agent'), text: B('经销商网络、Google Maps、区域机会。', 'Dealer networks, Google Maps, regional opportunities.') },
    { title: B('Buying Committee Agent', 'Buying Committee Agent'), text: B('谁研究、谁推荐、谁拍板。', 'Who researches, who recommends, who decides.') },
    { title: B('Product Matching Agent', 'Product Matching Agent'), text: B('需求到产品配置的匹配与参数。', 'From requirement to product configuration and specs.') },
    { title: B('Quote Agent', 'Quote Agent'), text: B('报价草稿、价格规则、利润护栏。', 'Quote drafts, pricing rules, margin guardrails.') },
    { title: B('Follow-up Agent', 'Follow-up Agent'), text: B('不忘记任何一个客户。', 'Never forgets a customer.') },
  ],
  gradient: [B('云端工作空间', 'Cloud workspace'), B('桌面完整工作台', 'Desktop workspace'), B('移动端查看与审批', 'Mobile review and approval'), B('永远在线的 Agent', 'Always-on agents')],
  bigText: B('把工作交给 AI，权力留在企业', 'Delegate the work. Keep the authority.'),
  bubbles: [
    B('价格', 'Price'), B('利润', 'Margin'), B('正式报价', 'Formal quote'), B('PI', 'PI'), B('重要客户回复', 'Key customer reply'),
    B('Approval Gate', 'Approval Gate'),
    B('关键业务动作', 'Critical business action'), B('对外付款', 'Outbound payment'), B('合同条款', 'Contract terms'),
    B('人保留权力', 'Humans keep authority'), B('AI 承担工作', 'AI does the work'), B('Human-in-the-Loop', 'Human-in-the-Loop'),
  ],
  words: [B('不再', 'No'), B('空白提示', 'blank prompts'), B('丢上下文', 'lost context'), B('夜里停工', 'idle nights')],
  feat2Title: B('合上笔记本，公司不会停。', 'Your company doesn’t stop when you close your laptop.'),
  feat2Sub: B('定时运行，事件触发。', 'Scheduled routines. Event-driven agents.'),
  feat2Card: { title: B('Orchestrator', 'Orchestrator'), text: B('并行工作，汇总结果，把需要人决策的内容交回来。Agent 可以在你离开电脑之后继续执行授权任务，当客户、订单或市场状态变化时自动启动。', 'Parallel work, consolidated results, only the human decisions handed back. Agents keep running authorised tasks after you leave the desk and start automatically when a customer, order or market state changes.') },
  feat2Button: { label: B('查看定价', 'See pricing'), href: 'pricing.html' },
  feat2Lines: [B('Scheduled Routines', 'Scheduled Routines'), B('Event-Driven Agents', 'Event-Driven Agents'), B('Always-On', 'Always-On')],
  ctaTitle: B('别买 AI 工具。', 'Don’t hire AI tools.'),
  ctaSub: B('建立 AI Capacity。', 'Build AI capacity.'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('288 个 AI 员工。一家云端公司。', '288 AI Employees. One Cloud Company.'),
};

/* ============================================================= pricing === */

export const PRICING = {
  caption: B('(定价)', '(Pricing)'),
  title: B('从企业需要的 <span class="sub-title-text">AI 层级</span> 开始。', 'Start with the <span class="sub-title-text">level of AI</span> your company needs.'),
  toggleA: B('首年价格', 'First year'),
  toggleB: B('续费', 'Renewal'),
  tabs: [B('平台方案', 'Platform plans'), B('获客与企业', 'Acquisition & Enterprise')],
  unitYear: B('/ 年', '/ year'),
  unitFirst: B('/ 首年', '/ first year'),
  renewalPrice: B('联系我们', 'Ask us'),
  panes: [
    [
      { name: B('Foundation', 'Foundation'), price: '¥10,000', unit: 'year', renewal: '¥10,000',
        desc: B('适合希望首先建立企业 AI 数字底座的团队。', 'For teams that want to build the enterprise AI foundation first.'),
        cta: B('从 STARGO WORK 开始', 'Start with STARGO WORK'),
        items: [B('云端 STARGO WORK Workspace 与 AI 数字员工', 'Cloud STARGO WORK workspace and AI employees'), B('企业知识库与产品数据中心', 'Enterprise knowledge base and product data centre'), B('Inquiry Workflow 与 Customer CRM · 基础 Customer 360', 'Inquiry workflow and customer CRM · basic Customer 360'), B('Quote Workflow 与人工审批', 'Quote workflow and human approval'), B('基础内容资产与 AI 工作培训', 'Basic content assets and AI work training')] },
      { name: B('Launch', 'Launch'), price: '¥20,000', unit: 'first', renewal: 'ask',
        desc: B('建立 AI 底座，并完成第一阶段数字化增长基础。', 'The AI foundation plus the first stage of digital growth.'),
        cta: B('启动你的 AI 运营', 'Launch your AI operation'),
        items: [B('包含 Foundation 全部内容', 'Everything in Foundation'), B('企业内容启动', 'Enterprise content launch'), B('官网与数字资产启动能力', 'Website and digital-asset launch'), B('产品内容体系', 'Product content system'), B('基础 SEO · GEO 与核心业务流程配置', 'Basic SEO · GEO and core workflow configuration')] },
      { name: B('Growth', 'Growth'), price: '¥30,000', unit: 'first', renewal: 'ask',
        desc: B('让 STARGO WORK 不只处理工作，也开始帮助企业持续增长。', 'STARGO WORK stops being only a workhorse and starts driving growth.'),
        cta: B('建立增长引擎', 'Build your growth engine'),
        items: [B('包含 Launch 全部内容', 'Everything in Launch'), B('SEO · GEO Growth 与 Growth Content', 'SEO · GEO growth and growth content'), B('Customer Intelligence 与 Growth Analytics', 'Customer intelligence and growth analytics'), B('自动跟进与 CRM Growth Loop', 'Automatic follow-up and the CRM growth loop'), B('品牌可信内容体系', 'Brand trust content system')] },
    ],
    [
      { name: B('Global Acquisition', 'Global Acquisition'), price: '¥40,000', unit: 'first', renewal: 'ask',
        desc: B('让企业拥有主动获客能力。', 'Give the company its own AI acquisition engine.'),
        cta: B('打开 AI 获客', 'Turn on AI acquisition'),
        items: [B('包含 Growth 全部内容', 'Everything in Growth'), B('STARGO Growth OS 与 Trade Signal Revenue Engine', 'STARGO Growth OS and the Trade Signal Revenue Engine'), B('Importer Reorder Radar · Competitor Customer Graph · Dealer Discovery', 'Importer Reorder Radar · Competitor Customer Graph · Dealer Discovery'), B('Buying Committee Intelligence · Opportunity Scoring · Dealer Opportunity Brief', 'Buying Committee Intelligence · Opportunity Scoring · Dealer Opportunity Brief'), B('AI Prospecting · CRM 自动写入 · Dormant Lead Reactivation · Growth Attribution', 'AI prospecting · automatic CRM writes · Dormant Lead Reactivation · growth attribution')] },
      { name: B('Enterprise', 'Enterprise'), price: B('定制', 'Custom'), unit: 'none', renewal: 'custom',
        desc: B('多部门、多公司、多品牌、多账号，以及更复杂的审批与系统接入。', 'Multiple departments, companies, brands and accounts, with complex approvals and system integration.'),
        cta: B('联系 STARGO Enterprise', 'Talk to STARGO Enterprise'),
        items: [B('大量 AI Workforce 与复杂审批', 'Large AI workforce and complex approval'), B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'), B('自定义 Workflow · 专属 Agent · 专属 FDE', 'Custom workflows · dedicated agents · dedicated FDE'), B('私有化部署', 'Private deployment'), B('SLA', 'SLA')] },
      { name: B('从一条流程开始', 'Start with one workflow'), price: B('演示', 'Demo'), unit: 'demo', renewal: 'demo',
        desc: B('不确定从哪里开始？告诉我们现在最影响效率或增长的一条流程。', 'Not sure where to begin? Tell us the one workflow that most affects efficiency or growth.'),
        cta: B('预约演示', 'Book a Demo'),
        items: [B('选择最耗时间或最影响增长的一项工作', 'Pick the work that costs the most time or growth'), B('我们从那里开始', 'We start there'), B('看 AI 在你的真实流程里怎么工作', 'See AI working in your real process'), B('再决定需要哪一级', 'Then decide which level you need'), B('不需要一次改变整个企业', 'No need to change the whole company at once')] },
    ],
  ],
  compareTitle: B('方案对比', 'Compare the plans'),
  compareFeatures: B('能力', 'Capability'),
  comparePlans: [
    { name: B('Foundation', 'Foundation'), desc: B('企业 AI 数字底座', 'The enterprise AI foundation') },
    { name: B('Growth', 'Growth'), desc: B('底座 + 持续增长', 'Foundation plus continuous growth') },
    { name: B('Global Acquisition', 'Global Acquisition'), desc: B('增长 + 主动获客', 'Growth plus AI acquisition') },
  ],
  compareGroups: [
    { title: B('平台底座', 'Platform'), rows: [
      [B('云端 Workspace 与 AI 数字员工', 'Cloud workspace and AI employees'), [1, 1, 1]],
      [B('企业知识库与产品数据中心', 'Knowledge base and product data centre'), [1, 1, 1]],
      [B('Inquiry Workflow 与 Customer CRM', 'Inquiry workflow and customer CRM'), [1, 1, 1]],
      [B('Quote Workflow 与人工审批', 'Quote workflow and human approval'), [1, 1, 1]],
    ] },
    { title: B('增长', 'Growth'), rows: [
      [B('SEO · GEO 与 Growth Content', 'SEO · GEO and growth content'), [0, 1, 1]],
      [B('Customer Intelligence 与 Growth Analytics', 'Customer intelligence and growth analytics'), [0, 1, 1]],
      [B('自动跟进与 CRM Growth Loop', 'Automatic follow-up and the CRM growth loop'), [0, 1, 1]],
      [B('品牌可信内容体系', 'Brand trust content system'), [0, 1, 1]],
    ] },
    { title: B('主动获客', 'Acquisition'), rows: [
      [B('STARGO Growth OS 与 Trade Signal Revenue Engine', 'STARGO Growth OS and the Trade Signal Revenue Engine'), [0, 0, 1]],
      [B('Importer Reorder Radar · Competitor Customer Graph', 'Importer Reorder Radar · Competitor Customer Graph'), [0, 0, 1]],
      [B('Buying Committee Intelligence · Opportunity Scoring', 'Buying Committee Intelligence · Opportunity Scoring'), [0, 0, 1]],
      [B('Dormant Lead Reactivation · Growth Attribution', 'Dormant Lead Reactivation · Growth Attribution'), [0, 0, 1]],
    ] },
  ],
  ctaTitle: B('别买 AI 工具。<span class="sub-title-text">建立 AI Capacity。</span>', 'Don’t hire AI tools. <span class="sub-title-text">Build AI capacity.</span>'),
  ctaDesc: B('288 个 AI 员工代表 STARGO WORK 的 AI Workforce 能力体系。实际模型调用、并发、自动任务和第三方服务使用量按不同方案配置。', '288 AI employees are the STARGO WORK workforce capability system. Model calls, concurrency, automated tasks and third-party usage are configured per plan.'),
  ctaButton: { label: B('认识你的 AI 团队', 'Meet your AI workforce'), href: 'workforce.html' },
  faqCaption: B('(常见问题)', '(Questions and answers)'),
  faqTitle: B('关于定价', 'About pricing'),
  faq: [
    [B('288 个 AI 员工是无限使用吗？', 'Are the 288 AI employees unlimited?'), B('288 代表 STARGO WORK 的 AI Workforce 能力体系。实际的模型调用、并发、自动任务和第三方服务使用量按方案配置，不承诺无限的模型用量。', '288 is the STARGO WORK workforce capability system. Model calls, concurrency, automated tasks and third-party usage are configured per plan; unlimited model usage is not promised.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('Foundation 按年续费。Launch、Growth 与 Global Acquisition 的首年包含启动与配置工作，续费价格按方案另行确认。', 'Foundation renews yearly. Launch, Growth and Global Acquisition include first-year set-up; renewal is confirmed per plan.')],
    [B('Foundation 包含什么？', 'What is in Foundation?'), B('云端 Workspace、企业知识库、产品数据中心、AI 数字员工、Inquiry Workflow、Customer CRM、基础 Customer 360、Quote Workflow、基础内容资产、人工审批与 AI 工作培训。', 'Cloud workspace, knowledge base, product data centre, AI employees, inquiry workflow, customer CRM, basic Customer 360, quote workflow, basic content assets, human approval and AI work training.')],
    [B('可以只要主动获客吗？', 'Can we buy acquisition on its own?'), B('Global Acquisition 建立在 Growth 之上，因为获客信号需要落到同一套 CRM、知识和 Agent 基础设施里才有价值。', 'Global Acquisition builds on Growth, because acquisition signals are only worth something once they land in the same CRM, knowledge and agent infrastructure.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('Enterprise 提供专属企业环境与私有化部署，面向数据、系统和合规要求更高的企业。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。通过 API、MCP、Connectors、Activepieces、Windmill、Workspace Bridge 和 Channel Plugins 接入已有系统；系统迁移在 Enterprise 中提供。', 'Yes — through API, MCP, connectors, Activepieces, Windmill, Workspace Bridge and channel plugins; migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台能力与模型 / API / 第三方服务使用量分开计算，各方案配置不同的额度，超出部分按实际使用。', 'Platform capability and model / API / third-party usage are separate; each plan carries its own allowance, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How are training and implementation done?'), B('Foundation 包含 AI 工作培训；Enterprise 配备专属 FDE，把真实流程直接反馈到系统能力建设中。', 'Foundation includes AI work training; Enterprise comes with a dedicated FDE who feeds real workflows straight back into the platform.')],
    [B('我们该从哪一级开始？', 'Which level should we start at?'), B('从一条流程开始。选择现在最耗时间或最影响增长的一项工作，先把这一条跑通，再决定需要哪一级。', 'Start with one workflow. Pick the work that costs the most time or growth, get it running, then decide which level you need.')],
    [B('多公司、多品牌怎么办？', 'What about multiple companies or brands?'), B('多部门、多公司、多品牌、多账号属于 Enterprise：独立的权限、审批与数据边界，共享同一套 AI Workforce。', 'Multiple departments, companies, brands and accounts belong to Enterprise: separate permissions, approvals and data boundaries on one shared AI workforce.')],
  ],
};

/* ========================================================== enterprise === */

export const ENTERPRISE = {
  eyebrow: B('(企业与治理)', '(Enterprise)'),
  h1: B('能执行。能被控制。', 'Built to act. Built to be controlled.'),
  story: [
    { label: B('(权力)', '(Authority)'), text: B('企业决定 AI 可以看到什么、调用什么、执行什么，什么动作必须审批，谁拥有审批权。AI 承担工作，人保留权力。', 'The company decides what AI can see, call and execute, which actions need approval and who approves. AI does the work; people keep the authority.') },
    { label: B('(证据)', '(Evidence)'), text: B('重要的 Agent 执行留下 Task、Input、Context、Tools、Actions、Output、Evidence、Approval 和 Outcome。管理者不仅看到答案，还知道它为什么这么做、调用了什么、结果是什么。', 'Every important agent run leaves task, input, context, tools, actions, output, evidence, approval and outcome — so a manager sees not just the answer but why, what was called and what happened.') },
    { label: B('(接入)', '(Connect)'), text: B('通过 API、MCP、Connectors、Activepieces、Windmill、Workspace Bridge 和 Channel Plugins 接入已有的企业系统和业务工具。不是让企业扔掉所有软件重新开始。', 'Existing systems and tools connect through API, MCP, connectors, Activepieces, Windmill, Workspace Bridge and channel plugins. Nobody throws their software away to start over.') },
    { label: B('(模型)', '(Models)'), text: B('Agent Runtime 按任务连接不同的 AI 模型与工具。模型是引擎；企业长期拥有的是自己的数据、Ontology、知识、Workflow、Skills、Agent Workforce 和 Business Memory。', 'The agent runtime connects the model and tools each task needs. The model is the engine; what the company owns for the long run is its data, ontology, knowledge, workflows, skills, agent workforce and business memory.') },
  ],
  introLabel: B('(为什么从一开始就这样设计)', '(Why it is built this way)'),
  intro: B('AI 如果只能回答问题，安全问题很简单。当 AI 可以真正执行工作以后，权限、审批、证据、审计和治理就成为产品本身的一部分。STARGO WORK 从一开始就按照「AI 会进入真实业务流程」来设计。', 'Security is simple while AI only answers questions. Once AI can actually do the work, permissions, approval, evidence, audit and governance become part of the product. STARGO WORK was designed from day one for AI that enters real business processes.'),
  approachLabel: B('(部署方式)', '(Deployment)'),
  approach: [B('云端。', 'Cloud.'), B('专属企业环境。', 'Dedicated environment.'), B('私有化部署。', 'Private deployment.'), B('企业 SLA。', 'Enterprise SLA.')],
  approachButton: { label: B('联系 STARGO FDE', 'Talk to a STARGO FDE'), href: 'contact.html' },
  statsLabel: B('(数字)', '(Numbers)'),
  stats: [
    { value: '288', text: B('个 AI 员工，在企业设定的权限范围内工作。', 'AI employees, working inside the permissions the company sets.') },
    { value: '13', text: B('项企业治理能力：Capability Center、Identity & Permission、Approval Service、Audit Ledger、Credential Management、Agent Guardrails、Tenant Isolation、Failure Handling、Canary、Rollback、Evaluation、Observability、Human-in-the-Loop。', 'enterprise governance capabilities: Capability Center, Identity & Permission, Approval Service, Audit Ledger, Credential Management, Agent Guardrails, Tenant Isolation, Failure Handling, Canary, Rollback, Evaluation, Observability, Human-in-the-Loop.') },
    { value: '3', text: B('种部署方式：云端、专属企业环境、私有化部署。', 'deployment options: cloud, dedicated enterprise environment, private deployment.') },
  ],
  quoteLabel: B('(原则)', '(The principle)'),
  quote: { text: B('「把工作交给 AI。权力留在企业。」', '“Delegate the work. Keep the authority.”'), who: B('STARGO WORK', 'STARGO WORK'), where: B('Human-in-the-Loop', 'Human-in-the-Loop') },
  cardsTitle: B('五个治理组件', 'Five governance components'),
  cards: [
    { name: B('Capability Center', 'Capability Center'), role: B('(AI 可以调用什么)', '(What AI may call)') },
    { name: B('Identity & Permission', 'Identity & Permission'), role: B('(谁，以什么身份)', '(Who, as whom)') },
    { name: B('Approval Service', 'Approval Service'), role: B('(什么必须审批)', '(What must be approved)') },
    { name: B('Audit Ledger', 'Audit Ledger'), role: B('(每个动作留证据)', '(Every action leaves evidence)') },
    { name: B('Credential Management', 'Credential Management'), role: B('(凭据不进 Prompt)', '(Credentials never enter a prompt)') },
  ],
  noteLabel: B('(来自真实的全球贸易)', '(Born inside real global trade)'),
  note: B('STARGO WORK 不是从一张 SaaS 产品需求表开始的。它来自真实制造业与全球贸易业务中的问题：怎么找到客户、判断客户、快速回复、管理产品知识、报价、审批、做 PI、管理订单、准备出口文件、持续跟进，以及怎么让企业增长不再完全依赖增加人。', 'STARGO WORK did not start from a SaaS product spec. It came out of real manufacturing and global-trade operations: how to find customers, judge them, reply fast, manage product knowledge, quote, approve, make the PI, manage orders, prepare export documents, keep following up — and how to grow without only hiring.'),
  noteButton: { label: B('预约演示', 'Book a Demo'), href: 'contact.html' },
  table: {
    caption: B('(接入已有系统)', '(Connect what you already use)'), title: B('接入方式', 'Integration'),
    headers: [B('(方式)', '(Method)'), B('(做什么)', '(What it does)'), B('(连接什么)', '(What it connects)')],
    button: { label: B('看能力全景', 'See all capabilities'), href: 'capabilities.html' },
    rows: [
      ['API', B('直接调用与被调用', 'Call and be called directly'), B('已有系统', 'Existing systems')],
      ['MCP', B('Agent 使用工具的标准接口', 'The standard interface agents use tools through'), B('工具与数据源', 'Tools and data sources')],
      ['Connectors', B('预置连接器', 'Pre-built connectors'), B('CRM · 邮箱 · 网盘 · 知识', 'CRM · mail · drives · knowledge')],
      ['Activepieces', B('工作流自动化', 'Workflow automation'), B('跨系统流程', 'Cross-system processes')],
      ['Windmill', B('脚本与 ETL 执行', 'Scripts and ETL'), B('数据与脚本', 'Data and scripts')],
      ['Workspace Bridge', B('工作台与产出交付', 'Workspace and deliverables'), B('桌面与文件', 'Desktop and files')],
      ['Channel Plugins', B('获客渠道插件', 'Acquisition channel plugins'), B('Reddit · Google · LinkedIn · Alibaba · WhatsApp · Email', 'Reddit · Google · LinkedIn · Alibaba · WhatsApp · Email')],
    ],
  },
};

/* ======================================================== capabilities === */

const G = (n, en, zh, items) => ({ n, name: B(zh, en), items });
const I = (name, zh, en) => [name, B(zh ?? '', en ?? zh ?? '')];
export const CAPABILITY_GROUPS = [
  G('01', 'Command & Workspace', '指挥与工作台', [I('Boss Cockpit', '企业经营总览', 'Business overview'), I('Command Center', '企业 AI 指挥中心', 'Enterprise AI command centre'), I('Orbital Workspace', '云端企业工作桌面', 'Cloud workspace desktop'), I('Mission Control', 'Agent 与长任务运行中心', 'Agent and long-task control'), I('Execution View', '任务执行过程', 'Task execution trace'), I('System Map', '系统关系图', 'System relationship map'), I('App Library', '企业 AI 应用库', 'Enterprise AI app library'), I('Desktop Shell', '多窗口 AI 工作空间', 'Multi-window AI workspace'), I('Mobile Companion', '移动办公与任务管理', 'Mobile work and task management'), I('Notification Center', '企业通知', 'Enterprise notifications'), I('Approval Center', '审批中心', 'Approval centre'), I('Voice Console', '语音指挥 AI', 'Voice command for AI')]),
  G('02', 'AI Growth & Customer Acquisition', 'AI 增长与获客', [I('STARGO Growth OS', 'AI 获客系统', 'The AI acquisition system'), I('Trade Signal Revenue Engine', '贸易信号收入引擎', 'Trade signals into revenue'), I('Importer Reorder Radar', '进口商补货雷达', 'Importer reorder radar'), I('Competitor Customer Graph', '竞争对手客户图谱', 'Competitor customer graph'), I('Buying Committee Intelligence', '决策链识别', 'Decision-chain intelligence'), I('Dealer Opportunity Discovery', '经销商机会发现', 'Dealer opportunity discovery'), I('Google Maps Dealer Discovery', '地图经销商发现', 'Dealer discovery from Maps'), I('Opportunity Decision Engine', '机会决策', 'Opportunity decisions'), I('Dealer Opportunity Brief', '经销商机会简报', 'Dealer opportunity brief'), I('Playbook Engine', '销售打法生成', 'Sales playbook generation'), I('Six-Factor Opportunity Scoring', '六因子机会评分', 'Six-factor opportunity scoring'), I('Account Research', '客户研究', 'Account research'), I('Trade Intelligence', '贸易情报', 'Trade intelligence'), I('Website AI Sales Engineer', '官网 AI 销售工程师', 'Website AI sales engineer'), I('Dormant Lead Reactivation', '沉睡客户再激活', 'Dormant lead reactivation'), I('Trade Show Afterburner', '展会线索持续转化', 'Trade-show lead afterburner'), I('CRM Automatic Lead Creation', 'CRM 自动写入', 'Automatic CRM lead creation'), I('Attribution & Growth Analytics', '结果归因与增长分析', 'Attribution and growth analytics')]),
  G('03', 'Channel Intelligence', '渠道智能', [I('Reddit GEO', '社区需求侦察', 'Community demand intelligence'), I('Google Search GEO', 'AI 搜索时代的可见性', 'Visibility in the AI search era'), I('LinkedIn B2B', 'B2B 决策人触达', 'B2B decision-maker reach'), I('Facebook GEO', '社交需求信号', 'Social demand signals'), I('Alibaba Inquiry', '平台询盘接入', 'Marketplace inquiry intake'), I('YouTube GEO', '视频渠道信号', 'Video channel signals'), I('WhatsApp Sales', '即时沟通销售', 'Instant-messaging sales'), I('Email B2B', '邮件开发与跟进', 'Email outreach and follow-up'), I('Marketplace Adapter Pack', '平台适配包', 'Marketplace adapter pack'), I('Channel Plugin SDK', '新渠道接入同一套基础设施', 'New channels on the same infrastructure')]),
  G('04', 'Inquiry & Customer Conversation', '询盘与客户对话', [I('Unified Inbox', '统一收件箱', 'Unified inbox'), I('Email Inquiry Processing', '邮件询盘处理', 'Email inquiry processing'), I('Alibaba Inquiry Handling', '平台询盘处理', 'Marketplace inquiry handling'), I('Website Conversation', '官网会话', 'Website conversation'), I('Chatwoot Conversation Center', '会话中心', 'Conversation centre'), I('Inquiry Intent Detection', '询盘意图识别', 'Inquiry intent detection'), I('Spam / Scam Detection', '垃圾与诈骗识别', 'Spam and scam detection'), I('Buyer Requirement Extraction', '买方需求提取', 'Buyer requirement extraction'), I('Company Background Research', '公司背景研究', 'Company background research'), I('Customer Risk Signals', '客户风险信号', 'Customer risk signals'), I('Product Matching', '产品匹配', 'Product matching'), I('Knowledge-Grounded Reply', '基于企业知识的回复', 'Knowledge-grounded reply'), I('Multilingual Reply', '多语言回复', 'Multilingual reply'), I('Human Approval & Escalation', '人工审批与升级', 'Human approval and escalation'), I('Automatic Follow-up', '自动跟进', 'Automatic follow-up'), I('Customer Timeline', '客户时间线', 'Customer timeline')]),
  G('05', 'CRM & Customer Intelligence', 'CRM 与客户智能', [I('Customer CRM', '客户与商机记录', 'Customer and opportunity records'), I('Account 360', '客户全景', 'Account 360'), I('Customer Room', '客户工作间', 'Customer room'), I('Contact & Opportunity Management', '联系人与商机管理', 'Contact and opportunity management'), I('Lead Scoring', '线索评分', 'Lead scoring'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', 'Product interests · quote history · order history'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', 'Customer tasks and follow-up plan'), I('Decision-Maker Mapping', '决策人映射', 'Decision-maker mapping'), I('Customer Evidence', '客户证据', 'Customer evidence'), I('CRM Automation', 'CRM 自动化', 'CRM automation')]),
  G('06', 'Product & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', 'Enterprise brain'), I('Knowledge Center', '知识中心', 'Knowledge centre'), I('Knowledge Intake', '知识摄入', 'Knowledge intake'), I('WeKnora Knowledge Engine', '知识检索引擎', 'Knowledge retrieval engine'), I('Enterprise RAG', '企业检索增强', 'Enterprise RAG'), I('Drive / Notion Knowledge Gateway', '网盘与文档网关', 'Drive / Notion knowledge gateway'), I('Product Intelligence', '产品智能', 'Product intelligence'), I('Product Center & Library', '产品中心与产品库', 'Product centre and library'), I('Specifications & Images', '产品参数与图片', 'Specifications and images'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', 'Historical knowledge and business rules'), I('Evidence Retrieval', '证据检索', 'Evidence retrieval'), I('Source-Grounded Answers', '有据可查的回答', 'Source-grounded answers')]),
  G('07', 'Quote & Commercial', '报价与商务', [I('Quote Studio', '报价工作室', 'Quote studio'), I('Inquiry → Quote', '询盘到报价', 'Inquiry to quote'), I('Product Configuration & Quantity', '产品配置与数量计算', 'Configuration and quantity'), I('Commercial Terms', '贸易条件', 'Commercial terms'), I('Pricing Rules', '价格规则', 'Pricing rules'), I('Margin Guardrails', '利润护栏', 'Margin guardrails'), I('Historical Price Context', '历史价格参考', 'Historical price context'), I('Approval Workflow', '审批流程', 'Approval workflow'), I('Quote Versioning', '报价版本', 'Quote versioning'), I('PI Studio / PI Center', '形式发票中心', 'PI studio and PI centre')]),
  G('08', 'Order & Global Trade Execution', '订单与全球贸易执行', [I('Order Management', '订单管理', 'Order management'), I('Trade Execution Engine', '贸易执行引擎', 'Trade execution engine'), I('Payment Milestones', '付款节点', 'Payment milestones'), I('Production Status & QC', '生产进度与质检', 'Production status and QC'), I('Packaging & Shipment', '包装与出货', 'Packaging and shipment'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', 'Commercial invoice · packing list'), I('Certificate of Origin · Form E', '原产地证 · Form E', 'Certificate of origin · Form E'), I('Bill of Lading Workflow', '提单流程', 'Bill of lading workflow'), I('Certification & Battery Documentation', '认证与电池资料', 'Certification and battery documentation'), I('Export Documentation & Workflow', '出口单证与流程', 'Export documentation and workflow'), I('Export Tax Rebate', '六阶段出口退税流程', 'Six-stage export tax rebate'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', 'CBU / SKD / CKD workflows')]),
  G('09', 'Content, GEO & Creative', '内容、GEO 与创意', [I('AI Creative Studio', 'AI 创意工作室', 'AI creative studio'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', 'Content creation and global website content'), I('SEO · GEO · GEO Trust Content', '搜索优化 · AI 搜索可信内容', 'SEO · GEO · GEO trust content'), I('Multi-language Content', '多语言内容', 'Multi-language content'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', 'Product, sales and social content'), I('AI Image & Video Workflow', 'AI 图片与视频流程', 'AI image and video workflow'), I('STARGO Viral Replica Engine', '爆款复刻引擎', 'Viral replica engine'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', 'Viral structure, scene, speech and product analysis'), I('OpenMontage · Viral Clips', '剪辑与短视频', 'OpenMontage · viral clips')]),
  G('10', 'AI Workforce', 'AI 员工', [I('288 Specialized AI Employees', '288 个专业 AI 员工', '288 specialised AI employees'), I('Agent Rail · Agent Roster', 'Agent 轨道与名册', 'Agent rail and roster'), I('StaffDeck', '员工面板', 'Staff deck'), I('Agent Teams · Multi-Agent Collaboration', '动态组队与多 Agent 协作', 'Agent teams and multi-agent collaboration'), I('Agent-to-Agent Communication', 'Agent 间通信', 'Agent-to-agent communication'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', 'Role, skills, tools, memory'), I('Shared Enterprise Context', '共享企业上下文', 'Shared enterprise context'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', 'Delegation, handoff, parallel execution'), I('Scheduled Work', '定时工作', 'Scheduled work'), I('Evidence & Human Approval', '执行证据与人工审批', 'Evidence and human approval')]),
  G('11', 'Automation & Computer Use', '自动化与计算机操作', [I('DSH Agent Runtime', 'Agent 运行时', 'Agent runtime'), I('Activepieces Workflow Automation', '工作流自动化', 'Workflow automation'), I('Windmill', '脚本与 ETL', 'Scripts and ETL'), I('LoopX Long-Horizon Control', '长任务控制', 'Long-horizon control'), I('Browser Automation · Playwright', '浏览器自动化', 'Browser automation'), I('Computer Use', '计算机操作', 'Computer use'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', 'Scheduled routines and event-triggered workflows'), I('API Actions · MCP Client · MCP Tools', 'API 动作 · MCP 客户端与工具', 'API actions, MCP client and tools'), I('External Connectors · Workspace Bridge', '外部连接器 · 工作台桥接', 'External connectors and workspace bridge'), I('Credential Management', '凭据管理', 'Credential management')]),
  G('12', 'Ontology & Enterprise Context', '本体与企业上下文', [I('Operational Ontology', '运营本体', 'Operational ontology'), I('Identity Spine', '跨系统身份', 'Cross-system identity'), I('Customer · Product · Inquiry · Opportunity Objects', '客户 · 产品 · 询盘 · 机会对象', 'Customer, product, inquiry and opportunity objects'), I('Quote · Order · Document · Task Objects', '报价 · 订单 · 文件 · 任务对象', 'Quote, order, document and task objects'), I('Agent · Market Signal Objects', 'Agent · 市场信号对象', 'Agent and market-signal objects'), I('Relationships · Action Types · Business Logic', '关系 · 动作类型 · 业务逻辑', 'Relationships, action types, business logic'), I('Enterprise Context', '企业上下文', 'Enterprise context'), I('PostgreSQL Operational Data', '运营数据存储', 'Operational data store')]),
  G('13', 'Governance & Control', '治理与控制', [I('Human-in-the-Loop', '人在回路', 'Human-in-the-loop'), I('Approval Service', '审批服务', 'Approval service'), I('Capability Center', '能力中心', 'Capability centre'), I('Permission Control · Identity', '权限控制 · 身份', 'Permission control and identity'), I('Perimeter Authentication', '边界认证', 'Perimeter authentication'), I('Audit Ledger · Agent Evidence · Action History', '审计台账 · Agent 证据 · 动作历史', 'Audit ledger, agent evidence, action history'), I('Guardrails', '护栏', 'Guardrails'), I('Tenant Isolation', '租户隔离', 'Tenant isolation'), I('Failure Handling · Rollback', '失败处理 · 回滚', 'Failure handling and rollback'), I('Observability', '可观测性', 'Observability')]),
  G('14', 'Evolution Engine', '进化引擎', [I('Evolution Console', '进化控制台', 'Evolution console'), I('Observer Agent', '观察者', 'Observer agent'), I('Reflection Scientist', '反思科学家', 'Reflection scientist'), I('Skill Optimizer · Microsoft SkillOpt Integration', '技能优化器', 'Skill optimiser'), I('Eval & Red Team', '评估与对抗测试', 'Evaluation and red team'), I('Evolution Governor', '进化治理器', 'Evolution governor'), I('Trajectory · Outcome · Evaluation', '轨迹 · 结果 · 评估', 'Trajectory, outcome, evaluation'), I('Skill Registry · Experiment System', '技能注册表 · 实验系统', 'Skill registry and experiment system'), I('Champion / Challenger · Canary · Rollback', '冠军 / 挑战者 · 灰度 · 回滚', 'Champion / challenger, canary, rollback'), I('Continuous Improvement · Enterprise Data Flywheel', '持续改进 · 企业数据飞轮', 'Continuous improvement and the enterprise data flywheel')]),
];

export const CAPABILITIES = {
  h1: B('能力', 'Capabilities'),
  caption: B('(一个 AI 操作系统，全球贸易的每个环节)', '(One AI operating system. Every stage of global trade.)'),
  intro: B('从企业知识到获客，从客户到订单，从内容到履约，从 Agent 到企业治理。STARGO WORK 把过去需要大量独立软件完成的工作连接在同一个系统中。', 'From enterprise knowledge to acquisition, customer to order, content to fulfilment, agents to governance — STARGO WORK connects work that used to need a pile of separate software.'),
  macro: [
    { name: B('指挥与增长', 'Command & Growth'), groups: ['01', '02', '03'] },
    { name: B('客户与知识', 'Customer & Knowledge'), groups: ['04', '05', '06'] },
    { name: B('商务与履约', 'Commercial & Trade'), groups: ['07', '08', '09'] },
    { name: B('员工与治理', 'Workforce & Governance'), groups: ['10', '11', '12', '13', '14'] },
  ],
  unit: B('组', 'groups'),
  cardButton: B('看全部能力', 'See every capability'),
  table: { caption: B('(按能力域)', '(By capability group)'), title: B('能力图谱', 'Capability map'), headers: [B('(能力域)', '(Group)'), B('(能力)', '(Capability)'), B('(说明)', '(What it is)')], button: { label: B('认识 AI 员工', 'Meet the AI workforce'), href: 'workforce.html' } },
  ladderCaption: B('(从一条流程开始)', '(Start with one workflow)'),
  ladder: [B('选一条流程。', 'Pick one workflow.'), B('让它先跑起来。', 'Let it run.'), B('再扩到整家公司。', 'Then scale the company.')],
  ladderDesc: B('不需要一次改变整个企业。选择一条最重要的业务流程，让 STARGO WORK 从那里开始工作。', 'You don’t need to change the whole company at once. Pick the one workflow that matters most and let STARGO WORK start there.'),
  card1: { name: B('第一条流程', 'The first workflow'), desc: B('最影响效率或增长的那一条：询盘处理、报价、主动获客或客户回复。', 'The one that most affects efficiency or growth: inquiries, quoting, prospecting or customer replies.'), big: '1', unit: B('(条流程)', '(workflow)'),
    items: [B('梳理现有流程与系统', 'Map the current process and systems'), B('映射进 Ontology', 'Model it in the ontology'), B('AI 员工进入真实流程', 'AI employees enter the real workflow'), B('记录响应、效率与订单', 'Measure response, efficiency and orders'), B('沉淀为 Skill 与 Workflow', 'Turn it into skills and workflows')],
    tlLabel: B('从哪开始：', 'Start with:'), tl: B('一条流程', 'one workflow'), button: { label: B('预约演示', 'Book a Demo'), href: 'contact.html' } },
  card2: { name: B('AI 原生公司', 'An AI-native company'), desc: B('客户、产品、询盘、报价、订单、文件、任务和 288 个 AI 员工在同一个企业 AI 系统里。', 'Customers, products, inquiries, quotes, orders, documents, tasks and 288 AI employees in one enterprise AI system.'), big: '288', unit: B('(个 AI 员工)', '(AI employees)'),
    items: [B('14 个能力域', '14 capability groups'), B('全渠道获客网络', 'Omnichannel growth network'), B('Quote → PI → Order → Export 一条链', 'Quote → PI → order → export on one chain'), B('可治理的自我进化', 'Governed self-evolution'), B('人保留审批权', 'Humans keep approval authority')],
    tlLabel: B('下一步：', 'Next:'), tl: B('看定价', 'see pricing'), button: { label: B('看定价', 'See pricing'), href: 'pricing.html' } },
  faqCaption: B('(常见问题)', '(FAQ)'),
  faq: [
    [B('这些能力怎么组合？', 'How do the capabilities combine?'), B('按业务流程组合，不按软件模块。一条询盘会依次经过对话、知识、CRM、报价、审批和履约，每个环节由对应的 AI 员工承担，结果回到同一个客户对象。', 'By business process, not by software module. One inquiry moves through conversation, knowledge, CRM, quoting, approval and fulfilment; each step is handled by the matching AI employee and the result lands on the same customer object.')],
    [B('能力之间共享什么？', 'What do they share?'), B('同一个 Ontology、同一个 Customer 360、同一套企业知识、同一条审计台账。任何一个能力的输出都是另一个能力的输入。', 'One ontology, one Customer 360, one body of enterprise knowledge, one audit ledger. Any capability’s output is another capability’s input.')],
    [B('新渠道怎么接？', 'How is a new channel added?'), B('通过 Channel Plugin SDK。新渠道接入后，使用的仍然是同一套 Customer / CRM / Knowledge / Agent / Evolution 基础设施。', 'Through the Channel Plugin SDK. A new channel plugs into the same customer, CRM, knowledge, agent and evolution infrastructure.')],
    [B('从哪里开始？', 'Where do we start?'), B('从一条流程开始。选最耗时间或最影响增长的那一条，先把它跑通。', 'With one workflow. Pick the one that costs the most time or growth and get it running first.')],
  ],
  moreLabel: B('(想看它跑起来？)', '(Want to see it running?)'),
  more: B('每一个能力在真实外贸流程里都有对应的界面和 Agent。预约演示，我们按你的流程逐个打开给你看。', 'Every capability has a screen and an agent behind it in a real trade workflow. Book a demo and we walk through them in your process.'),
  moreButton: B('预约演示', 'Book a Demo'),
};

/* ============================================================= contact === */

export const CONTACT = {
  eyebrow: B('(联系)', '(Contact)'),
  h1: B('从一条流程开始', 'Start with one workflow'),
  quote: B('「你不需要在第一天改变一切。告诉我们现在最影响企业效率或增长的一条流程，我们从那里开始。」', '“You don’t need to transform everything on day one. Tell us the one workflow that most affects efficiency or growth. We start there.”'),
  quoteWho: B('STARGO WORK', 'STARGO WORK'),
  quoteWhere: CONTACT_INFO.address,
  formLabel: B('(告诉我们你的公司)', '(Tell us about your company)'),
  fields: {
    name: B('姓名*', 'Name*'), email: B('邮箱*', 'Email*'), company: B('公司', 'Company'),
    category: B('希望 AI 先改善什么？', 'What would you like AI to improve first?'),
    message: B('你想让 AI 改善哪条流程？', 'What workflow do you want AI to improve?'),
    whatsapp: B('WhatsApp', 'WhatsApp'), industry: B('行业', 'Industry'), markets: B('目标市场', 'Target markets'), team: B('团队规模', 'Team size'), systems: B('现有系统', 'Current systems'),
  },
  selectPlaceholder: B('请选择…', 'Select one…'),
  options: [B('AI 主动获客', 'AI customer acquisition'), B('询盘自动处理', 'Inquiry automation'), B('多渠道客户回复', 'Omnichannel customer replies'), B('CRM 与客户管理', 'CRM and customer management'), B('企业知识库', 'Enterprise knowledge base'), B('报价与 PI', 'Quote and PI'), B('订单与出口流程', 'Orders and export workflows'), B('SEO · GEO', 'SEO · GEO'), B('AI 内容生产', 'AI content production'), B('AI Workforce', 'AI Workforce'), B('完整 STARGO WORK', 'Full STARGO WORK'), B('企业定制', 'Enterprise customisation')],
  submit: B('发送', 'Send'),
  notice: B(`已为你打开邮件客户端。也可以直接发到 ${CONTACT_INFO.email}，或 WhatsApp ${CONTACT_INFO.whatsapp}。`, `Your mail client should open now. You can also write to ${CONTACT_INFO.email} or WhatsApp ${CONTACT_INFO.whatsapp}.`),
};

/* ============================================================= notices === */

export const NOTICES = {
  date: B('2026-09-03 更新', 'Updated 2026-09-03'),
  h1: B('第三方声明', 'Third-party notices'),
  body: B(`
<h4>网站模板</h4>
<p>本站版式来自三套 Webflow 模板：Mōno™（页面骨架、导航、页脚与内页）、Scalora Startup（首页的闭环卡片堆、核心系统切换器、渠道网络带，以及定价页）、Lifelogx（智能层与数字员工页）。三套模板均按 Webflow 模板许可使用，原有文案已全部替换；模板附带的示例图片与界面图仅作版式示意，不代表任何真实客户、人物、产品或界面截图。</p>
<h4>运行时库</h4>
<ul>
<li>Webflow 运行时与交互引擎（随模板导出），jQuery 3.5.1（MIT）</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock 标准「免费」许可。该许可允许网站实现（含商业用途），但许可方保留全部知识产权并可修改条款</li>
<li>Lenis（MIT）— 平滑滚动；Lottie（随 Webflow 运行时加载，MIT）— 导航图标动画</li>
</ul>
<h4>字体</h4>
<p>Inter、Inter Display、Instrument Serif 与 42dot Sans，均按 SIL Open Font License 1.1 自托管，不向任何第三方字体服务发起请求。</p>
<h4>图片素材</h4>
<p>模板附带的示意图片来自各模板作者及其声明的来源（含 Unsplash 与 Logo To Use），按其各自许可用于商业展示。STARGO 标识与字标为 STARGO 自有作品。</p>
<h4>上游软件</h4>
<p>站内提到的 Activepieces、Chatwoot、Twenty CRM、WeKnora、Windmill、Playwright、Yente / OpenSanctions、Univer、Puter、Medusa、ERPNext、PostHog、Microsoft SkillOpt、Notion、Google、Reddit、LinkedIn、Facebook、YouTube、Alibaba、WhatsApp 等名称，均为各自所有者的商标或项目名。它们在本站出现是为了让上游身份可查，不表示相关项目对 STARGO 的背书。</p>
<h4>联系</h4>
<p>STARGO WORK · 柳州 · 广西 · 中国 · ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp} · ${CONTACT_INFO.site}</p>`,
  `
<h4>Website templates</h4>
<p>The layout of this site comes from three Webflow templates: Mōno™ (page skeleton, navigation, footer and inner pages), Scalora Startup (the homepage loop card stack, core-system switcher and channel band, plus the pricing page) and Lifelogx (the Intelligence and AI Workforce pages). All three are used under the Webflow template licence with their original copy replaced; the sample imagery and interface pictures that ship with them are layout illustration only and do not depict any real customer, person, product or screen.</p>
<h4>Runtime libraries</h4>
<ul>
<li>Webflow runtime and interaction engine (exported with the templates), jQuery 3.5.1 (MIT)</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock standard “no charge” licence, which permits website implementation including commercial use while the licensor retains all intellectual property and may amend the terms</li>
<li>Lenis (MIT) — smooth scrolling; Lottie (loaded by the Webflow runtime, MIT) — navigation icon animation</li>
</ul>
<h4>Fonts</h4>
<p>Inter, Inter Display, Instrument Serif and 42dot Sans, all self-hosted under the SIL Open Font License 1.1. No request goes to a third-party font service.</p>
<h4>Imagery</h4>
<p>Illustrative images shipped with the templates come from their authors and the sources they credit (including Unsplash and Logo To Use), used for commercial display under their respective licences. The STARGO mark and wordmark are STARGO’s own work.</p>
<h4>Upstream software</h4>
<p>Activepieces, Chatwoot, Twenty CRM, WeKnora, Windmill, Playwright, Yente / OpenSanctions, Univer, Puter, Medusa, ERPNext, PostHog, Microsoft SkillOpt, Notion, Google, Reddit, LinkedIn, Facebook, YouTube, Alibaba, WhatsApp and other names mentioned on this site are trademarks or project names of their respective owners. They appear so that upstream identity stays discoverable; none implies endorsement of STARGO.</p>
<h4>Contact</h4>
<p>STARGO WORK · Liuzhou, Guangxi, China · ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp} · ${CONTACT_INFO.site}</p>`),
  back: B('返回首页', 'Back to home'),
  relatedTitle: B('继续看', 'Keep reading'),
  relatedIntro: B('三个入口，看 STARGO WORK 怎么运行。', 'Three places to see how STARGO WORK runs.'),
  related: [
    { tag: B('(14 个能力域)', '(14 capability groups)'), title: B('能力', 'Capabilities'), desc: B('从指挥工作台到进化引擎。', 'From command workspace to evolution engine.'), href: 'capabilities.html' },
    { tag: B('(288 位 AI 员工)', '(288 AI employees)'), title: B('数字员工', 'AI Workforce'), desc: B('每一个都有岗位，秒级组队。', 'Every one has a job; teams in seconds.'), href: 'workforce.html' },
    { tag: B('(治理)', '(Governance)'), title: B('企业与治理', 'Enterprise'), desc: B('能执行，也能被控制。', 'Built to act, built to be controlled.'), href: 'enterprise.html' },
  ],
  view: B('查看', 'View'),
};

export const NOT_FOUND = {
  title: B('404', '404'),
  text: B('这个页面不存在，或者已经移动。', 'This page doesn’t exist, or has moved.'),
  back: B('回到首页', 'Back to home'),
};

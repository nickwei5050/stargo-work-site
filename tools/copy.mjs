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

/* Order matters: a visitor should meet the product before the price. Pricing
   sits after every page that explains what the product does, immediately before
   About in the menu. */
export const NAV = [
  { href: 'index.html', label: B('首页', 'Trade OS') },
  { href: 'intelligence.html', label: B('智能层', 'Intelligence') },
  { href: 'capabilities.html', label: B('能力', 'Capabilities') },
  { href: 'workforce.html', label: B('数字员工', 'AI Workforce') },
  { href: 'enterprise.html', label: B('企业与治理', 'Enterprise') },
  { href: 'contact.html', label: B('联系', 'Contact') },
  { href: 'pricing.html', label: B('定价', 'Pricing') },
];
/** Utility pages: footer and legal rows only, never the product navigation. */
export const SECONDARY = [
  { href: 'privacy.html', label: B('隐私政策', 'Privacy') },
  { href: 'terms.html', label: B('使用条款', 'Terms') },
  { href: 'notices.html', label: B('第三方声明', 'Notices') },
];
/** Content pages: overlay menu and footer, not the product navigation. Articles live under blog/. */
export const MORE = [
  { href: 'about.html', label: B('关于', 'About') },
  { href: 'blog.html', label: B('博客', 'Blog') },
];
/* The pill's middle slot. Four stages, short enough to sit in a row, each
   pointing at its block on the capability page. */
export const CAP_JUMPS = [
  { anchor: 'story-1', label: B('获客', 'Buyers') },
  { anchor: 'story-2', label: B('沟通', 'Replies') },
  { anchor: 'story-3', label: B('报价', 'Quotes') },
  { anchor: 'story-4', label: B('订单', 'Orders') },
];

export const LANG_SWITCH = B('EN', '中文');
/** Production origin — canonical URLs, hreflang, Open Graph and the sitemap. Bind a custom domain and change it here. */
export const SITE_URL = 'https://stargo.pages.dev';

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
  ['Crafting visuals. Shaping stories.', B('面向全球贸易的 AI 操作系统。', 'Cloud AI software for manufacturers and export teams.')],
  ['Let’s create great work together!', B('288 位 AI 员工。一个操作系统。', '288 specialized AI employees. One connected business workflow.')],
  ['Let’s Collaborate', B('预约演示', 'Book a Demo')],
  ['(Newsletter)', B('(订阅更新)', '(Newsletter)')],
  ['Be the first to know what’s new.', B('产品进展第一时间通知你。', 'Stay close to practical AI work.')],
  ['No noise. Just curated updates.', B('不发广告，只发产品更新。', 'Receive STARGO WORK product notes and practical workflow guides.')],
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
  ['>(+1) 930 046 720<', B(`><span class="stargo-wa">WhatsApp </span>${CONTACT_INFO.whatsapp}<`, `><span class="stargo-wa">WhatsApp </span>${CONTACT_INFO.whatsapp}<`)],
  ['href="mailto:contact@monostudio.io"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="mailto:info@monostudio.io"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="tel:(+1)930046720"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.linkedin.com/"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="https://www.twitter.com/"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.dribbble.com/"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="https://cal.com/"', B('href="contact.html"', 'href="contact.html"')],
];

export const META = {
  'index.html': { title: B('STARGO WORK — 面向全球贸易的 AI 操作系统', 'STARGO WORK — AI for Manufacturing & Export Teams'), description: B('STARGO WORK 是为制造业与外贸企业打造的云端 AI 工作系统：288 个 AI 员工在同一个企业上下文中协同，把获客、询盘、客户、报价、订单、出口单证和跟进连接成一个持续运行的业务闭环。', 'Connect buyer research, customer replies, CRM, quotations, orders and export paperwork with STARGO WORK, a cloud AI system for export teams.') },
  'intelligence.html': { title: B('智能层', 'Intelligence — Context, Action & Improvement'), description: B('为什么 STARGO WORK 不是聊天机器人：运营本体、前置部署智能、主动执行、288 个共享上下文的 AI 员工、长任务执行与可治理的自我进化。', 'Explore how business ontology, proactive workflows and governed improvement connect AI employees to the way your company works.') },
  'capabilities.html': { title: B('能力', 'Capabilities — The Connected Trade Workflow'), description: B('一个 AI 操作系统，覆盖全球贸易每个环节：14 个能力域，从指挥工作台、获客、渠道、询盘、CRM、知识、报价、订单履约、内容到 AI 员工、自动化、本体、治理与进化引擎。', 'Explore the STARGO WORK capability map across acquisition, sales, quotes, orders, content, knowledge, AI teams and enterprise control.') },
  'workforce.html': { title: B('数字员工', 'AI Workforce — 288 Specialized AI Employees'), description: B('288 个 AI 员工，一家云端公司。每个 AI 员工都有岗位、目标、知识、工具、权限与执行记录，可以秒级组队、并行工作、定时运行，并在需要决策时找到你。', 'Explore specialized AI roles, shared business context, team collaboration and supported cloud workflows in STARGO WORK.') },
  'pricing.html': { title: B('定价', 'Pricing — Software & Growth Services'), description: B('年度软件订阅，加上可选的建站、内容与获客服务包：Standard、Launch、Growth、Global Acquisition 与 Enterprise。', 'Compare the annual STARGO WORK subscription with optional website, content and customer-acquisition service packages.') },
  'enterprise.html': { title: B('企业与治理', 'Enterprise — Integration & Delivery'), description: B('能执行，也能被控制：权限、审批闸门、证据、审计台账、凭据管理、租户隔离、Canary 与回滚；通过 API、MCP 与连接器接入已有系统；云端、专属环境或私有化部署。', 'Discuss enterprise workflows, system integration, approvals, deployment requirements and scoped FDE delivery for STARGO WORK.') },
  'contact.html': { title: B('联系', 'Contact — Discuss Your AI Workflow'), description: B('从一条流程开始。告诉我们最影响效率或增长的一条业务流程，我们从那里开始。', 'Tell the STARGO WORK team which export workflow you want to improve and discuss a relevant demonstration or scoped proposal.') },
  'notices.html': { title: B('第三方声明', 'Third-party notices'), description: B('运行时库、字体、图片素材与上游软件的许可与署名。', 'Licences and attribution for runtime libraries, fonts, imagery and upstream software.') },
  'about.html': { title: B('关于', 'About — Built from Export Operations'), description: B('STARGO WORK 是什么、来自哪里、如何构建：面向制造业与全球贸易企业的 AI 操作系统，前置部署，权力留在企业。', 'Learn why STARGO WORK is building a connected AI workspace around the practical needs of manufacturing and export teams.') },
  'blog.html': { title: B('博客', 'Blog — Practical AI for Global Trade'), description: B('关于 AI 操作系统、AI 员工、从询盘到报价、审批治理与全球贸易执行的文章。', 'Read practical guides to customer acquisition, product knowledge, quotations, approvals and AI-supported export workflows.') },
  'privacy.html': { title: B('隐私政策', 'Privacy policy'), description: B('本站收集什么、为什么收集、保存多久，以及你的权利。', 'What this site collects, why, for how long, and your rights.') },
  'terms.html': { title: B('使用条款', 'Terms of use'), description: B('使用本网站的条款：内容、知识产权、价格说明与责任。', 'Terms for using this website: content, intellectual property, pricing notes and liability.') },
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

/**
 * Homepage narrative (2026-09-05). One idea has one home:
 *   hero → the problem (silos) → the answer (one loop) → who runs it (288 + approval)
 *   → the five stages → the four core systems → the channels → the interface
 *   → why an OS beats hiring → start with one workflow → what is underneath
 *   (ontology → evolution) → the pricing ladder → four doors → book a demo.
 */
export const HOME_HERO_LIST = [
  B('找到对的买家', 'Find the right buyers'), B('用产品知识回复', 'Reply with product knowledge'), B('把询盘变成报价', 'Turn inquiries into quotes'),
  B('让订单继续推进', 'Keep orders moving'), B('跟进带来复购', 'Follow up for repeat business'),
];
/** Shorter phrasings swapped in on phones before the text animations split the lines. */
export const HOME_MOBILE = {
  heroSupport: B('面向制造业与外贸团队的云端 AI 工作系统。买家研究、客户回复、报价、订单与出口单证连成一条工作流。', 'Cloud AI for manufacturers and export teams: buyer research, replies, quotes, orders and export paperwork in one connected workflow.'),
  scHero: B('客户、产品、询盘、报价、订单、文件、任务和 AI 员工，第一次在同一个系统里。', 'Customers, products, inquiries, quotes, orders, documents, tasks and AI employees — in one system for the first time.'),
  ladder: B('AI 运营能力一级一级往上加：先建底座，再启动运营，再建增长引擎，再打开主动获客。', 'AI operating capacity, level by level: foundation, operation, growth engine, then AI acquisition.'),
};
export const HOME_THEATRE = B('STARGO OS ©2026', 'STARGO OS ©2026');

/** Mono homepage: [templateString, pair, opts]. Order matters. */
export const HOME_MONO = [
  /* sticky cards → the intelligence layer as four illustrative scenarios. The
     template's testimonial design (portrait, gradient, quote, speaker) is kept;
     the speakers are roles in an example trade company, labelled as such, never
     named customers. */
  ['&quot;Working with Mōno™ felt like having an internal team rather than an external agency. They were proactive, detail-oriented, and genuinely invested in the outcome.&quot;',
    B('「报价发出去之前，AI 已经知道这个客户上次买的配置、这次的数量和我们的利润护栏。」', '“Before the quote goes out, AI already knows what this customer bought last time, this order’s quantity and our margin guardrail.”')],
  ['John Doe', B('外贸业务员 · 示例场景', 'Export sales · illustrative scenario')],
  ['Head design at Circle®', B('Ontology · 企业本体', 'Ontology · a model of the business')],
  ['“We didn’t just get a website — we got a solid digital foundation. Mōno™ is the kind of partner you want when building something meant to last.”',
    B('「不是我们去适应软件，而是 FDE 把我们真实的流程搬进系统。」', '“We didn’t adapt to the software. The FDE moved our real workflow into the system.”')],
  ['Amantha Doe', B('外贸经理 · 示例场景', 'Trade manager · illustrative scenario')],
  ['Founder of Radius®', B('Forward Deployed · 前置部署', 'Forward deployed')],
  ['“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”',
    B('「我没有问，它先提醒我：一个老客户进入了补货周期。」', '“I didn’t ask. It told me first: an old customer had entered a reorder cycle.”')],
  ['Max Trump', B('销售总监 · 示例场景', 'Sales director · illustrative scenario')],
  ['Founder of Light\u00a0Studio®', B('Proactive · 主动执行', 'Proactive execution')],
  ['“What stood out with Mōno™ was the balance between design quality and technical execution. Everything was thoughtful, scalable, and built with term use in mind.”',
    B('「每一次成交或丢单都回到系统里，下一次报价更准。」', '“Every win or loss goes back into the system, and the next quote is sharper.”')],
  ['Camila Verga', B('总经理 · 示例场景', 'General manager · illustrative scenario')],
  ['Head design at LogoIspum®', B('Evolution Engine · 可治理的进化', 'Evolution Engine · governed evolution')],
  /* the image + quote card that closes the pricing ladder → Enterprise */
  ['&quot;Mōno™ helped us simplify complexity. They streamlined our product narrative, improved performance, and delivered a digital experience that truly reflects our brand. The results were immediate — higher engagement.&quot;',
    B('「多部门、多公司、多品牌、多账号；复杂审批与系统接入；专属 FDE；私有化部署。」', '“Multiple departments, companies, brands and accounts. Complex approvals and system integration. A dedicated FDE. Private deployment.”')],
  ['Elena Rossi', B('Enterprise · 定制', 'Enterprise · Custom')],
  ['Marketing Director at Auralis®', B('联系 STARGO Enterprise', 'Talk to STARGO Enterprise')],

  /* flip cards → the pricing ladder */
  ['Mōno™ stands behind the data.', B('从企业需要的 AI 层级开始。', 'One system. The right level of support.')],
  ['Our success is reflected in the numbers we achieve for our clients. Every project is designed with measurable growth at its core.',
    B('一份年度软件订阅，加上可选的建站、内容与获客服务包。服务包价格是首年总价，已经包含软件订阅；服务交付量按档替换，不叠加。', 'An annual software subscription, with optional website, content and acquisition services. Service prices are first-year totals that already include the subscription; service quantities replace the lower tier rather than stacking.')],
  ['(Value created)', B('(Standard)', '(Standard)')],
  ['$174M', B('¥10,000', '¥10,000')],
  ['Empowering growth through strategic solutions.', B('12 个月云端工作台、核心外贸流程与自助线索发现。', 'A 12-month workspace, core trade workflows and self-service lead discovery.')],
  ['CRI: 5.1% → 6.7%', B('首年 ¥10,000 · 按年续费', '¥10,000 first year · renews yearly')],
  ['“We didn’t expect smoother onboarding and a noticeable lift in qualified leads.”', B('「先把企业的知识、客户和报价放进同一个系统。」', '“Put the company’s knowledge, customers and quotes into one system first.”')],
  ['Daniel Kim', B('Standard · 年度软件订阅', 'Standard · the annual subscription')],
  ['(Return client rate)', B('(Launch)', '(Launch)')],
  ['92%', B('¥20,000', '¥20,000')],
  ['Building lasting partnerships built on trust.', B('官网 3 个核心页面与 20 个 SKU 页、中英文内容、20 个 SKU 图片与 10 条短视频。', 'A 3-page website with 20 SKU pages, Chinese and English content, 20 SKU image sets and 10 short videos.')],
  ['CRI: 2.9% → 4.4%', B('首年总价 ¥20,000（含 ¥10,000 软件订阅）· 续费另议', '¥20,000 first-year total, subscription included · renewal per proposal')],
  ['“Everything feels faster, clearer, and more premium. We shipped the redesign and conversions followed immediately.”', B('「让 AI 开始对外工作。」', '“Let AI start working outward.”')],
  ['Olivia Carter', B('Launch · 建站与内容服务', 'Launch · website and content service')],
  ['(Projects delivered)', B('(Growth)', '(Growth)')],
  ['+320', B('¥30,000', '¥30,000')],
  ['Driving successful outcomes across industries.', B('官网 4 个核心页面与 40 个 SKU 页、5 个语种、SEO 与 GEO 实施服务。', 'A 4-page website with 40 SKU pages, five languages, and SEO / GEO implementation.')],
  ['CRI: 1.7% → 2.6%', B('首年总价 ¥30,000（含 ¥10,000 软件订阅）· 续费另议', '¥30,000 first-year total, subscription included · renewal per proposal')],
  ['“The new site finally matches our product. Cleaner UX, better messaging, and results we can actually measure.”', B('「不只处理工作，也开始帮助企业增长。」', '“Not only doing the work — starting to drive growth.”')],
  ['Marcus Reed', B('Growth · 更大范围的建站与内容', 'Growth · a wider website and content build')],
  ['(Client retention)', B('(Global Acquisition)', '(Global Acquisition)')],
  ['88%', B('¥40,000', '¥40,000')],
  ['Optimized journeys that turn traffic into growth.', B('官网 5 个核心页面与 80 个 SKU 页、18 种语言，另加三个月配置后获客运行与 3 份月报。', 'A 5-page website with 80 SKU pages, 18 languages, plus three months of configured acquisition operation and 3 monthly reports.')],
  ['CRI: 3.8% → 5.6%', B('首年总价 ¥40,000（含 ¥10,000 软件订阅）· 续费另议', '¥40,000 first-year total, subscription included · renewal per proposal')],
  ['“The redesign removed friction everywhere. It’s simple, sharp, and performs better across every device.”', B('「自助获客在 Standard 里，这一档是我们替你跑三个月。」', '“Self-service acquisition is in Standard; this plan runs it for you for three months.”')],
  ['Sofia Martinez', B('Global Acquisition · 配置后获客运行', 'Global Acquisition · configured acquisition operation')],
  ['>★★★★★<', B('>云端 · 知识 · CRM · 审批<', '>Cloud · knowledge · CRM · approval<'), { nth: 0 }],
  ['>★★★★★<', B('>含年度 Standard 软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],
  ['>★★★★★<', B('>含年度 Standard 软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],
  ['>★★★★★<', B('>含年度 Standard 软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],

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
    B('STARGO WORK 是面向制造业与外贸团队的云端 AI 工作系统：把买家研究、客户沟通、CRM、报价、订单与出口单证放进同一条工作流——288 位专业 AI 员工负责推进，决策权仍在你的团队。', 'STARGO WORK is a cloud AI work system for manufacturers and export teams. Bring buyer research, customer conversations, CRM, quotations, orders and export paperwork into one connected workflow — with 288 specialized AI employees and your team in control.')],

  /* who we are → 288 */
  ['We shape brands with focus, intention, and impact.', B('288 个专业 AI 员工，在同一个企业上下文中协同工作。', '288 specialised AI employees, working in one shared business context.')],
  ['Pricing with', B('把工作交给 AI。', 'Delegate the work.')],
  ['complete transparency', B('权力留在企业。', 'Keep the authority.')],
  ['(Performance Boost)', B('(人始终掌握决定权)', '(Humans stay in command)')],
  ['Page speed +78%,', B('价格、利润、正式报价、PI、', 'Price, margin, formal quotes, PI —')],
  ['Bounce rate -13%', B('都可以设置审批闸门。', 'each can sit behind an approval gate.')],
  ['View pricing', B('认识 AI 员工', 'Meet the AI workforce')],
  ['(Live collaboration)', B('(审批流程示例)', '(Illustrative approval workflow)')],
  ['Today 17:01', B('步骤 1', 'Step 1')],
  ['Today 17:02', B('步骤 2', 'Step 2')],
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

  /* blog cards: the template's four-card grid, filled from BLOG (build-site.mjs) */
  ['Smart insights.', B('最新文章。', 'Latest articles.')],
  ['>See all<', B('>全部文章<', '>All articles<')],

  /* short / global */
  ['>Get started<', B('>聊聊你的流程<', '>Discuss your workflow<')],
  ['>Book a call<', B('>预约演示<', '>Book a Demo<')],
  ['>Contact us<', B('>预约演示<', '>Book a Demo<')],
  ['Let&#x27;s talk', B('预约演示', 'Book a Demo')],
  ['Scroll Down', B('向下滚动', 'Scroll down')],
  ['(Who we are)', B('(288 位 AI 员工)', '(288 AI employees)')],
  ['(Team of experts)', B('(可组成团队)', '(Form teams)')],
  ['(Services)', B('(外贸闭环 · 五个阶段)', '(The trade loop · five stages)')],
  ['(Pricing)', B('(两种外贸)', '(Two ways to run trade)')],
  ['(FAQ)', B('(常见问题)', '(FAQ)')],
  ['(Testimonials)', B('(智能层 · 四个示例场景)', '(Intelligence · four illustrative scenarios)')],
  ['(Success stories)', B('(Enterprise)', '(Enterprise)')],
  ['(Stats)', B('(定价 · AI 层级)', '(Pricing · the AI ladder)')],
  ['(Blog)', B('(博客)', '(Blog)')],
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
  ['Showreel 26©', HOME_THEATRE],
  ['+13', B('288', '288')],
  ['team members', B('AI 员工', 'AI employees')],
  ['across the', B('覆盖', 'across')],
  ['>World<', B('>全球贸易闭环<', '>the global trade loop<')],
  ['>+9<', B('>288<', '>288<')],
  ['(Home)', B('(首页)', '(Trade OS)')],
  ['Page Layouts', B('页面', 'Pages')],
  ['2011-26©', B('示意 Logo · 非真实客户', 'Sample logos · not actual clients')],
];
/** The same sentence ships twice (stages 001 and 003); replaced by position. */
export const HOME_DUP_DESC = {
  original: 'Modern, responsive, and user-friendly websites designed to engage visitors and drive conversions.',
  first: LOOP_DESC[0],
  second: LOOP_DESC[2],
};
/** The template's flip-card logo wall. Real logos in assets/brands/ replace the
    sample marks; until then the wall keeps its eight sample logos and says so. */
export const HOME_BRAND_WALL = {
  caption: B('(我们服务过的品牌)', '(Brands we have served)'),
  captionSample: B('(合作伙伴墙 · 示例)', '(Partner wall · sample)'),
  year: B('2026©', '2026©'),
};
export const HOME_LOOP_TABLE = {
  caption: B('(九个阶段)', '(Nine stages)'),
  title: B('一个外贸闭环', 'One closed loop'),
  headers: [B('(阶段)', '(Stage)'), B('(发生什么)', '(What happens)'), B('(要点)', '(The point)')],
  button: B('看每一步背后的能力', 'See the capabilities behind each step'),
  /* The stage word each row leads with, in Chinese, for the blocks whose largest
     type is that word: the Chinese page shows Chinese only. */
  stageNames: { DISCOVER: '发现', QUALIFY: '筛选', ENGAGE: '触达', UNDERSTAND: '理解', RESPOND: '回复', QUOTE: '报价', EXECUTE: '执行', FOLLOW: '跟进', LEARN: '学习' },
  /* The capability page opens this section with a statement rather than a table
     caption; the nine rows follow underneath. */
  lede: B(
    '从发现机会到成交复盘，外贸的九个阶段本来分散在不同的人、系统和表格里。STARGO WORK 把它们放在同一条工作流上，让每一步的结果成为下一步的输入。',
    'Nine stages, from spotting an opportunity to reviewing what closed — normally scattered across different people, systems and spreadsheets. STARGO WORK puts them on one workflow, so each step\'s result becomes the next step\'s input.'),
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
  ['All in one ecosystem for your business', B('(一个闭环)', '(AI for manufacturers & export teams)')],
  ['The platform that ', B('从询盘到订单，', 'Find buyers. ')],
  ['helps you', B('AI 帮你', 'Follow through to')],
  ['Build.', B('发现。', 'orders.'), { count: 2 }],
  ['Scale.', B('判断。', 'quotes.')],
  ['Operate.', B('报价。', 'repeat business.')],
  ['Scalora is a business platform designed to help teams manage marketing, operations, and growth from one workspace.',
    B('客户、产品、询盘、沟通、报价、订单、文件、任务和 AI 员工，第一次在同一个系统里。不是再加一个软件，而是让整个外贸业务真正连接起来。', 'Customers, products, inquiries, conversations, quotes, orders, documents, tasks and AI employees — in one system for the first time. Not one more tool: the whole trade business, connected.')],
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
  heroDesc: B('不是聊天机器人。是运营智能层。', 'Not a chatbot. An operating layer.'),
  tags: LX_TAGS,
  features: [
    /* The three animated cards are fixed-height boxes (24rem / 21.5rem / 21.5rem) that
       hold about four, three and three lines at the template's 2rem type. */
    { title: B('Ontology', 'Ontology'), text: B('把客户、询盘、报价、订单变成 AI 能理解、能操作的业务对象。', 'Customers, quotes and orders become objects AI can act on.') },
    { title: B('前置部署', 'Embedded FDE'), text: B('让软件适应企业：真实流程直接进入系统能力。', 'Software adapts to your business, not the reverse.') },
    { title: B('主动执行', 'Proactive'), text: B('不等提问：按事件、时间和目标运行，主动行动。', 'Runs on events and goals; acts within its authority.') },
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
  ctaDesc: B('每一次执行都留下记录：做了什么、结果如何、人在哪里改了它。系统据此提出候选的提示词、技能或流程改动，先在小范围比对新旧版本，通过评测并获批准后才发布，不合格就回滚。模型权重不会自己训练。', 'Every run leaves a record: what was done, how it turned out, where a person corrected it. From that the system proposes a candidate prompt, skill or workflow change, compares it against the current one on a small slice, and releases it only after evaluation and approval — otherwise it rolls back. Model weights are not retrained on their own.'),
};

export const LX_WORKFORCE = {
  heroWord: B('数字员工', 'AI Workforce'),
  store1: { name: B('288 AI Employees', '288 AI Employees'), sub: B('每一个都有岗位', 'Every one of them has a job'), href: '#lx-teams' },
  store2: { name: B('Pricing', 'Pricing'), sub: B('从企业需要的层级开始', 'Start at the level you need'), href: 'pricing.html' },
  heroDesc: B('你的 AI 团队已经上线。', 'Your AI team is already online.'),
  tags: LX_TAGS,
  features: [
    { title: B('有岗位', 'Has a job'), text: B('有岗位、目标、知识、工具、权限和执行记录，不从空白提示开始。', 'Role, goal, tools, permissions, record. Never a blank prompt.') },
    { title: B('秒级组队', 'Instant teams'), text: B('一个目标，秒级组成 Agent 团队并行工作。', 'One goal forms an agent team that runs in parallel.') },
    { title: B('随处工作', 'Works anywhere'), text: B('云端运行：办公室、工厂、展会或机场都能用。', 'Cloud-based: office, factory, trade show or airport.') },
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
  title: B('从企业需要的 <span class="sub-title-text">AI 层级</span> 开始。', 'One system. The right <span class="sub-title-text">level of support</span>.'),
  toggleA: B('首年价格', 'First-year total'),
  toggleB: B('续费', 'Renewal'),
  tabs: [B('平台方案', 'Software & launch'), B('获客与企业', 'Growth & enterprise')],
  unitYear: B('/ 年', '/ year'),
  unitFirst: B('/ 首年', '/ first year total'),
  renewalPrice: B('联系我们', 'Ask us'),
  panes: [
    [
      { name: B('Standard', 'Standard'), price: '¥10,000', unit: 'year', renewal: '¥10,000',
        desc: B('适合想自己把 AI 用进外贸流程的团队。', 'For teams that want to run their own AI-assisted export workflow.'),
        cta: B('了解 Standard', 'Discuss Standard'),
        items: [B('12 个月云端工作台，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'), B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for company knowledge, FAQ and up to 20 SKUs'), B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quotation and CRM workflows'), B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'), B('年度标准 AI 额度，一次配置与一次培训', 'Standard annual AI credits, one setup session and one training session')] },
      { name: B('Launch', 'Launch'), price: '¥20,000', unit: 'first', renewal: 'ask',
        desc: B('适合需要官网和第一套外贸销售素材的制造企业。', 'For manufacturers that need a website and a first set of export sales assets.'),
        cta: B('了解 Launch', 'Discuss Launch'),
        items: [B('含年度 Standard 软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 3 个核心页面与 20 个 SKU 模板页', 'A website with 3 core pages and 20 SKU template pages'), B('中英文官网内容', 'Chinese and English website content'), B('20 个 SKU 的图片内容与 10 条实拍短视频', 'An image-content set for 20 SKUs and 10 short videos'), B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds')] },
      { name: B('Growth', 'Growth'), price: '¥30,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合要扩展产品展示、语种与搜索可见度的团队。', 'For teams expanding product presentation, languages and search visibility.'),
        cta: B('了解 Growth', 'Discuss Growth'),
        items: [B('含年度 Standard 软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 4 个核心页面与 40 个 SKU 模板页', 'A website with 4 core pages and 40 SKU template pages'), B('中英文，另加 3 个语种', 'Chinese and English plus 3 further languages'), B('40 个 SKU 的图片内容、20 条实拍短视频与 10 条 AI 视频', 'An image-content set for 40 SKUs, 20 short videos and 10 AI videos'), B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure within the agreed scope')] },
    ],
    [
      { name: B('Global Acquisition', 'Global Acquisition'), price: '¥40,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合在数字化基础上再加三个月配置后 AI 获客运行的团队。', 'For teams adding three months of configured AI acquisition operation.'),
        cta: B('了解 Global Acquisition', 'Discuss Global Acquisition'),
        items: [B('含年度 Standard 软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 5 个核心页面与 80 个 SKU 模板页', 'A website with 5 core pages and 80 SKU template pages'), B('官网与 SKU 文字的 18 种语言系统翻译', 'Website and SKU text in 18 system-translated languages'), B('80 个 SKU 的图片内容、50 条实拍短视频与 20 条 AI 视频', 'An image-content set for 80 SKUs, 50 short videos and 20 AI videos'), B('三个月配置后 AI 获客运行与 3 份月报', 'Three months of configured AI acquisition operation and 3 monthly reports')] },
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
  featuredBadge: B('我们主推', 'Our recommendation'),
  compareTitle: B('所选方案对比', 'Compare selected plans'),
  compareFeatures: B('能力', 'Capability'),
  comparePlans: [
    { name: B('Standard', 'Standard'), desc: B('企业 AI 数字底座', 'Your own AI-assisted export workflow') },
    { name: B('Growth', 'Growth'), desc: B('底座 + 持续增长', 'Standard plus website, content and search') },
    { name: B('Global Acquisition', 'Global Acquisition'), desc: B('增长 + 三个月配置后运行', 'Growth plus three months of configured operation') },
  ],
  compareGroups: [
    { title: B('软件订阅', 'Software subscription'), rows: [
      [B('年度 STARGO WORK 软件订阅', 'Annual STARGO WORK software subscription'), [1, 1, 1]],
      [B('企业知识与产品资料', 'Company knowledge and product information'), [1, 1, 1]],
      [B('询盘、CRM、报价与审批流程', 'Inquiry, CRM, quotation and approval workflows'), [1, 1, 1]],
      [B('自助买家研究、评分与写入 CRM', 'Self-service buyer research, scoring and CRM entry'), [1, 1, 1]],
    ] },
    { title: B('建站与内容服务', 'Website and content services'), rows: [
      [B('官网与 SKU 页面制作服务', 'Website and SKU-page production service'), [0, 1, 1]],
      [B('产品图片与短视频制作服务', 'Product-image and short-video production service'), [0, 1, 1]],
      [B('多语言官网交付服务', 'Multilingual website delivery service'), [0, 1, 1]],
      [B('SEO / GEO 实施服务', 'SEO / GEO implementation service'), [0, 1, 1]],
    ] },
    { title: B('配置后运行服务', 'Configured services'), rows: [
      [B('三个月配置后获客运行', 'Three months of configured acquisition operation'), [0, 0, 1]],
      [B('三份获客月报', 'Three monthly acquisition reports'), [0, 0, 1]],
      [B('支付功能技术对接', 'Payment-function technical integration'), [0, 0, 1]],
      [B('18 种语言的官网与 SKU 系统翻译', '18-language website/SKU system translation'), [0, 0, 1]],
    ] },
  ],
  ctaTitle: B('别买 AI 工具。<span class="sub-title-text">建立 AI Capacity。</span>', 'Don’t hire AI tools. <span class="sub-title-text">Build AI capacity.</span>'),
  ctaDesc: B('288 个 AI 员工代表 STARGO WORK 的 AI Workforce 能力体系。实际模型调用、并发、自动任务和第三方服务使用量按不同方案配置。', '288 AI employees are the STARGO WORK workforce capability system. Model calls, concurrency, automated tasks and third-party usage are configured per plan.'),
  ctaButton: { label: B('认识你的 AI 团队', 'Meet your AI workforce'), href: 'workforce.html' },
  faqCaption: B('(常见问题)', '(Questions and answers)'),
  faqTitle: B('关于定价', 'About pricing'),
  faq: [
    [B('288 个 AI 员工是无限使用吗？', 'Are the 288 AI employees unlimited?'), B('288 代表 STARGO WORK 的 AI Workforce 能力体系。实际的模型调用、并发、自动任务和第三方服务使用量按方案配置，不承诺无限的模型用量。', 'No. The workforce count describes the capability catalogue. Actual access, active workloads, concurrency, credits and third-party usage depend on the contracted configuration.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('软件订阅按年续费。域名、托管与持续制作按续费方案或第三方费用另行确认；首年的建站与内容服务包不等于每年重复交付同样的内容量。', 'The software subscription follows its annual renewal terms. Domain, hosting and ongoing production follow the renewal proposal or the relevant third-party charges. A first-year launch package is not a promise of repeated annual content production.')],
    [B('Standard 包含什么？', 'What is in Standard?'), B('12 个月云端工作台（最多 5 个标准用户）、企业知识与产品资料首次导入（最多 20 个 SKU）、询盘与 CRM、报价与人工审批、自助线索发现与写入 CRM、年度标准 AI 额度，以及一次配置与一次培训。', 'Cloud workspace, knowledge base, product data centre, AI employees, inquiry workflow, customer CRM, basic Customer 360, quote workflow, basic content assets, human approval and AI work training.')],
    [B('主动获客只在 ¥40,000 的方案里吗？', 'Is AI acquisition only in the ¥40,000 package?'), B('不是。Standard 已经包含自助获客：线索发现、公司画像、评分、触达准备与写入 CRM。Global Acquisition 增加的是三个月配置后运行与 3 份月报，以及它自己的建站与内容交付。', 'No. Standard already includes self-service acquisition: lead discovery, company profiling, scoring, outreach preparation and CRM entry. Global Acquisition adds three months of configured acquisition operation and three monthly reports, alongside its website and content deliverables.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('Enterprise 提供专属企业环境与私有化部署，面向数据、系统和合规要求更高的企业。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。通过 API、MCP、Connectors、Activepieces、Windmill、Workspace Bridge 和 Channel Plugins 接入已有系统；系统迁移在 Enterprise 中提供。', 'Yes — through API, MCP, connectors, Activepieces, Windmill, Workspace Bridge and channel plugins; migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台能力与模型 / API / 第三方服务使用量分开计算，各方案配置不同的额度，超出部分按实际使用。', 'Platform capability and model / API / third-party usage are separate; each plan carries its own allowance, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How are training and implementation done?'), B('Standard 含一次配置与一次基础培训；Enterprise 配备专属 FDE，把真实流程直接反馈到系统能力建设中。', 'Standard includes one setup session and one basic training session. Enterprise comes with a dedicated FDE who feeds real workflows straight back into the platform.')],
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
  intro: B('落地从范围开始：先确定一条业务流程、要接的系统、谁批准什么，以及验收时要看到的产出。试点阶段交付的是可复核的东西——流程模型、权限与审批规则、连接边界、执行记录，以及这条流程跑完的真实结果。达到约定的验收标准，再谈下一条流程。', 'Delivery starts with scope: one business workflow, the systems it must reach, who approves what, and what you expect to see at acceptance. A pilot hands back things you can check — the modelled workflow, the permission and approval rules, the integration boundary, the execution record and the real result of running that workflow end to end. Meet the agreed acceptance criteria, then scope the next one.'),
  approachLabel: B('(部署方式)', '(Deployment)'),
  approach: [B('云端：最快开始，数据边界按租户隔离。', 'Cloud: fastest start, tenant-isolated data boundary.'), B('专属企业环境：独立环境，满足更严的数据要求。', 'Dedicated environment: separate infrastructure for stricter data requirements.'), B('私有化部署：运行在你自己的边界内。', 'Private deployment: runs inside your own boundary.'), B('企业 SLA：服务等级按项目约定。', 'Enterprise SLA: service levels agreed per project.')],
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
/* A capability: its product name, its Chinese name, and what it does in both
   languages. The Chinese page shows the Chinese name with the product name as a
   small subtitle; the English page shows the product name alone. Nobody should
   have to read the other language to use the page. */
const I = (name, zhName, zh, en) => [name, B(zh ?? '', en ?? zh ?? ''), zhName ?? name];
export const CAPABILITY_GROUPS = [
  G('01', 'Command & Workspace', '指挥与工作台', [I('Boss Cockpit', '企业经营总览', '公司现在在做什么，一屏看完', 'What the business is doing right now, on one screen'), I('Command Center', '企业 AI 指挥中心', '把目标交下去，看着它被执行', 'Hand a goal down and watch it carried out'), I('Orbital Workspace', '云端企业工作桌面', '人和 AI 员工共用的那张云端办公桌', 'The cloud desk your team and its agents share'), I('Mission Control', 'Agent 与长任务运行中心', '盯住长时间运行的工作，需要时插手', 'Watch long-running work and step in when needed'), I('Execution View', '任务执行过程', '一步一步回放 AI 员工做过什么', 'Replay what an agent did, step by step'), I('System Map', '系统关系图', '对象和系统之间是怎么连起来的', 'How the objects and systems connect to each other'), I('App Library', '企业 AI 应用库', '企业为各团队开通的内部应用', 'The internal apps a company turns on for its teams'), I('Desktop Shell', '多窗口 AI 工作空间', '同时开着几件事，互不打断', 'Several tasks open at once, without losing place'), I('Mobile Companion', '移动办公与任务管理', '离开电脑后，进度和审批跟着走', 'Progress and approvals follow you off the desk'), I('Notification Center', '企业通知', '什么变了，什么在等你', 'What changed, and what is waiting on you'), I('Approval Center', '审批中心', '所有待决事项排在同一个队列里', 'Every pending decision in one queue'), I('Voice Console', '语音指挥 AI', '不用打字也能下指令', 'Give an instruction without typing it')]),
  G('02', 'AI Growth & Customer Acquisition', 'AI 增长与获客', [I('STARGO Growth OS', 'AI 获客系统', '从市场信号到写入 CRM 的获客流程', 'The acquisition workflow, from signal to CRM'), I('Trade Signal Revenue Engine', '贸易信号收入引擎', '把观察到的贸易活动变成可跟进的客户', 'Turns observed trade activity into workable accounts'), I('Importer Reorder Radar', '进口商补货雷达', '推断哪些进口商可能到了补货窗口', 'Estimates which importers may be due to reorder'), I('Competitor Customer Graph', '竞争对手客户图谱', '谁已经在从同类供应商采购', 'Maps who already buys from comparable suppliers'), I('Buying Committee Intelligence', '决策链识别', '谁拍板、谁影响、谁签字', 'Who decides, who influences and who signs'), I('Dealer Opportunity Discovery', '经销商机会发现', '找产品线正好缺你这一块的经销商', 'Finds distributors whose range has a gap you fill'), I('Google Maps Dealer Discovery', '地图经销商发现', '按区域找经销商与分销商', 'Finds distributors and resellers by territory'), I('Opportunity Decision Engine', '机会决策', '建议跟进、搁置还是放弃，并给出理由', 'Recommends pursue, park or drop, with the reason'), I('Dealer Opportunity Brief', '经销商机会简报', '接触一个经销商的一页说明', 'A one-page case for approaching a distributor'), I('Playbook Engine', '销售打法生成', '针对这个客户和市场定打法', 'Builds the approach for this account and market'), I('Six-Factor Opportunity Scoring', '六因子机会评分', '用六个加权买入信号排优先级', 'Ranks accounts on six weighted buying signals'), I('Account Research', '客户研究', '收集公司证据，并注明出处', 'Collects company evidence and cites where it came from'), I('Trade Intelligence', '贸易情报', '从可得的贸易记录里读需求和走向', 'Reads available trade records for demand and direction'), I('Website AI Sales Engineer', '官网 AI 销售工程师', '在官网回答产品问题并留住线索', 'Answers product questions on your site and captures the lead'), I('Dormant Lead Reactivation', '沉睡客户再激活', '给沉睡客户一个重新开口的理由', 'Brings quiet accounts back with a reason to talk'), I('Trade Show Afterburner', '展会线索持续转化', '把一叠名片变成排好期的跟进', 'Turns a stack of badges into scheduled follow-up'), I('CRM Automatic Lead Creation', 'CRM 自动写入', '把合格客户连同负责人写进 CRM', 'Writes the qualified account into CRM with an owner'), I('Attribution & Growth Analytics', '结果归因与增长分析', '哪条动作真的带来了询盘和订单', 'Attribution and growth analytics')]),
  G('03', 'Channel Intelligence', '渠道智能', [I('Reddit GEO', '社区需求侦察', '在买家提问的社区里被找到', 'Community demand intelligence'), I('Google Search GEO', 'AI 搜索时代的可见性', '让搜索和答案引擎能引用你的内容', 'Visibility in the AI search era'), I('LinkedIn B2B', 'B2B 决策人触达', '在决策人发声的地方触达他们', 'Reaches decision-makers where they publish'), I('Facebook GEO', '社交需求信号', '读你所在品类的社交需求信号', 'Reads social demand signals in your categories'), I('Alibaba Inquiry', '平台询盘接入', '平台询盘落到同一条客户时间线', 'Marketplace inquiries land on the customer record'), I('YouTube GEO', '视频渠道信号', '买家在搜什么、看什么', 'Tracks what buyers search and watch in your category'), I('WhatsApp Sales', '即时沟通销售', '买家真正会回复的那个渠道', 'The channel most buyers actually reply on'), I('Email B2B', '邮件开发与跟进', '按公司和职位组织的邮件触达', 'Email outreach and follow-up'), I('Marketplace Adapter Pack', '平台适配包', '把平台的商品与消息接进同一个客户记录', 'Connects marketplace listings and messages to one customer record'), I('Channel Plugin SDK', '新渠道接入同一套基础设施', '按同一套接口接入新渠道', 'New channels on the same infrastructure')]),
  G('04', 'Inquiry & Customer Conversation', '询盘与客户对话', [I('Unified Inbox', '统一收件箱', '所有渠道进同一个队列，客户已经挂好', 'Every channel lands in one queue with the customer attached'), I('Email Inquiry Processing', '邮件询盘处理', '读一封来信，打开对应的客户记录', 'Reads an inbound email and opens the right customer record'), I('Alibaba Inquiry Handling', '平台询盘处理', '平台询盘按同一套流程处理', 'Marketplace inquiry handling'), I('Website Conversation', '官网会话', '把官网对话变成一条合格询盘', 'Turns a site chat into a qualified inquiry'), I('Chatwoot Conversation Center', '会话中心', '跨渠道的对话集中在一处', 'One place for the conversations across channels'), I('Inquiry Intent Detection', '询盘意图识别', '把真实采购需求和噪音分开', 'Separates a real buying request from noise'), I('Spam / Scam Detection', '垃圾与诈骗识别', '把假询盘挡在销售队列之外', 'Keeps fake inquiries out of the sales queue'), I('Buyer Requirement Extraction', '买方需求提取', '从自由文字里提出产品、参数、数量和条款', 'Pulls product, spec, quantity and terms out of free text'), I('Company Background Research', '公司背景研究', '回复之前先弄清对方是谁', 'Checks who is asking before you answer'), I('Customer Risk Signals', '客户风险信号', '尽早标出付款、合规与可信度上的问题', 'Flags payment, compliance and credibility concerns early'), I('Product Matching', '产品匹配', '把说出来的需求对上已审核的产品', 'Matches the stated requirement to approved products'), I('Knowledge-Grounded Reply', '基于企业知识的回复', '答案取自企业已审核的资料', 'Drafts the answer from approved company sources'), I('Multilingual Reply', '多语言回复', '用买家的语言回复，依据同一份资料', 'Replies in the buyer’s language from the same source material'), I('Human Approval & Escalation', '人工审批与升级', '敏感承诺交给有权限的人', 'Human approval and escalation'), I('Automatic Follow-up', '自动跟进', '没有回音时按计划发出下一次触达', 'Sends the next planned touch when nothing comes back'), I('Customer Timeline', '客户时间线', '说过什么、发过什么，按时间排成一条', 'One chronological record of everything said and sent')]),
  G('05', 'CRM & Customer Intelligence', 'CRM 与客户智能', [I('Customer CRM', '客户与商机记录', '客户、机会与负责人的那本账', 'Customer and opportunity records'), I('Account 360', '客户全景', '关于这个客户已知的一切，在一屏里', 'Everything known about the account on one screen'), I('Customer Room', '客户工作间', '每个客户一个人与 AI 共用的工作区', 'A shared workspace per customer for people and agents'), I('Contact & Opportunity Management', '联系人与商机管理', '联系人、机会与它们各自的进展', 'Contact and opportunity management'), I('Lead Scoring', '线索评分', '把值得打电话的客户排到最前面', 'Puts the accounts worth calling at the top of the list'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', '他们问过什么、被报过什么价、真正买了什么', 'What they asked for, were quoted and actually bought'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', '下一次触达、日期，以及归谁', 'The next touch, its date and who owes it'), I('Decision-Maker Mapping', '决策人映射', '记下谁决策、谁影响、谁签字', 'Records who decides, who influences and who signs'), I('Customer Evidence', '客户证据', '每一条判断都留着出处', 'Keeps the source behind every claim on the record'), I('CRM Automation', 'CRM 自动化', '负责人、阶段和下一步不用手工录', 'Writes owners, stages and next actions without manual entry')]),
  G('06', 'Product & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', '企业已审核的答案，集中在一处', 'The approved company answer, in one place'), I('Knowledge Center', '知识中心', '让已审核的企业答案保持最新', 'Where approved company answers are kept current'), I('Knowledge Intake', '知识摄入', '把文档和文件变成可被回答引用的知识', 'Turns documents and files into answerable knowledge'), I('WeKnora Knowledge Engine', '知识检索引擎', '找出能回答这个问题的那一段', 'Finds the passage that answers the question'), I('Enterprise RAG', '企业检索增强', '把答案所依据的原文取回来', 'Retrieves the passage an answer is based on'), I('Drive / Notion Knowledge Gateway', '网盘与文档网关', '直接读团队现有文档，不用先迁移', 'Reads existing team documents without a migration'), I('Product Intelligence', '产品智能', 'AI 能推理的规格、选配与限制', 'Specifications, options and constraints AI can reason over'), I('Product Center & Library', '产品中心与产品库', '整条流程共用的同一份产品记录', 'One product record the whole workflow reads'), I('Specifications & Images', '产品参数与图片', '买家会追问的那些技术细节', 'The technical detail a buyer asks for'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', '公司以前定过、现在仍然算数的规矩', 'What the company has decided before, and still applies'), I('Evidence Retrieval', '证据检索', '答案连同支撑文档一起给出', 'Returns the supporting document with the answer'), I('Source-Grounded Answers', '有据可查的回答', '没有你审核过的来源就不给答案', 'No answer without a source your team approved')]),
  G('07', 'Quote & Commercial', '报价与商务', [I('Quote Studio', '报价工作室', '报价从询盘开始，不从空表格开始', 'Builds the quotation from the inquiry, not a blank sheet'), I('Inquiry → Quote', '询盘到报价', '把请求直接带进一份带价格的草稿', 'Carries the request straight into a priced draft'), I('Product Configuration & Quantity', '产品配置与数量计算', '到底在给什么报价，报多少', 'What exactly is being priced, and how many'), I('Commercial Terms', '贸易条件', '套用约定的付款、交期与质保条款', 'Applies the agreed payment, delivery and warranty terms'), I('Pricing Rules', '价格规则', '按你配置的规则定价，不靠估', 'Prices from your configured rules, not from guesswork'), I('Margin Guardrails', '利润护栏', '越过利润线的报价过不了，除非有人批', 'Stops a quote crossing the margin line without approval'), I('Historical Price Context', '历史价格参考', '这个买家和这个市场以前是什么价', 'Shows what this buyer and market paid before'), I('Approval Workflow', '审批流程', '例外交给有权决定的那个人', 'Routes the exception to the person allowed to decide'), I('Quote Versioning', '报价版本', '每一版都留着，改了什么也留着', 'Keeps every version and what changed between them'), I('PI Studio / PI Center', '形式发票中心', '把批准的报价变成形式发票', 'Turns the approved quote into a pro forma invoice')]),
  G('08', 'Order & Global Trade Execution', '订单与全球贸易执行', [I('Order Management', '订单管理', '从批准的报价一路跟到交付', 'Tracks the order from approved quote to delivery'), I('Trade Execution Engine', '贸易执行引擎', '把批准的商务细节带进履约', 'Carries approved commercial detail into fulfilment'), I('Payment Milestones', '付款节点', '定金、尾款，以及还差什么没到', 'Tracks deposits, balances and what is still outstanding'), I('Production Status & QC', '生产进度与质检', '货在哪一步，检验过没过', 'Where the goods are, and whether they passed'), I('Packaging & Shipment', '包装与出货', '怎么装运，随货走哪些东西', 'How it ships, and what travels with it'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', '用批准的订单数据生成，等人复核', 'Prepared from approved order data, ready for review'), I('Certificate of Origin · Form E', '原产地证 · Form E', '整理申请材料；签发仍归主管机构', 'Organizes the application material; issuance stays with the authority'), I('Bill of Lading Workflow', '提单流程', '让运输单据跟着这批货走', 'Keeps shipping documents moving with the shipment'), I('Certification & Battery Documentation', '认证与电池资料', '认证与电池相关材料按目的国备齐', 'Certification and battery documentation'), I('Export Documentation & Workflow', '出口单证与流程', '出口单据从准备到复核的整条链', 'Export documentation and workflow'), I('Export Tax Rebate', '六阶段出口退税流程', '按六个阶段跟踪退税申报', 'Tracks the rebate claim through its six stages'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', '整车、半散件与全散件的不同装运形态', 'Handles built-up, semi- and fully-knocked-down shipping forms')]),
  G('09', 'Content, GEO & Creative', '内容、GEO 与创意', [I('AI Creative Studio', 'AI 创意工作室', '做出产品页需要的那套销售素材', 'Produces the sales material a product page needs'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', '面向你要卖的市场的产品与市场文案', 'Product and market copy for the sites you sell on'), I('SEO · GEO · GEO Trust Content', '搜索优化 · AI 搜索可信内容', '内容结构既能被搜到，也能被引用', 'Content structured to be found and to be quoted'), I('Multi-language Content', '多语言内容', '同一个产品故事，覆盖目标市场', 'The same product story across your target markets'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', '一个产品故事，走通页面、方案与社媒', 'One product story across page, deck and feed'), I('AI Image & Video Workflow', 'AI 图片与视频流程', '按可复用的配方产出产品视觉', 'Product visuals produced to a repeatable recipe'), I('STARGO Viral Replica Engine', '爆款复刻引擎', '把跑通的视频结构套到你的产品上', 'Rebuilds a proven video format around your product'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', '把有效的视频拆开，好再做一遍', 'Breaks a working video down so it can be repeated'), I('OpenMontage · Viral Clips', '剪辑与短视频', '把产品素材剪成社媒短片', 'Cuts product footage into short social clips')]),
  G('10', 'AI Workforce', 'AI 员工', [I('288 Specialized AI Employees', '288 个专业 AI 员工', '按岗位分工的 AI 员工目录', '288 specialised AI employees'), I('Agent Rail · Agent Roster', 'Agent 轨道与名册', '谁在岗，各自负责什么', 'Who is available, and what each one is for'), I('StaffDeck', '员工面板', '派活、看进度、复核交回来的结果', 'Assign work, watch progress, review what came back'), I('Agent Teams · Multi-Agent Collaboration', '动态组队与多 Agent 协作', '一个目标由几个专业岗位一起做', 'Several specialists on one goal, not one prompt'), I('Agent-to-Agent Communication', 'Agent 间通信', '上下文在岗位之间传，不用你转述', 'Specialists hand context to each other, not to you'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', '一个员工做什么、懂什么、能用什么、记得什么', 'What an employee does, knows, may use and remembers'), I('Shared Enterprise Context', '共享企业上下文', '所有 AI 员工背后是同一份业务事实', 'One business truth behind every agent'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', '任务拆开、在岗位间流转、并行推进', 'Work splits, moves between roles and runs at once'), I('Scheduled Work', '定时工作', '按时跑的例行研究与跟进', 'Recurring research and follow-up that runs on time'), I('Evidence & Human Approval', '执行证据与人工审批', '审批人在决定前能看到的那份记录', 'The record an approver reads before deciding')]),
  G('11', 'Automation & Computer Use', '自动化与计算机操作', [I('DSH Agent Runtime', 'Agent 运行时', '给 AI 员工工具和边界的运行时', 'The runtime that gives an agent its tools and limits'), I('Activepieces Workflow Automation', '工作流自动化', '跨应用把步骤连起来，不用写代码', 'Connects steps across apps without custom code'), I('Windmill', '脚本与 ETL', '跑流程依赖的脚本与数据作业', 'Runs scripts and data jobs the workflow depends on'), I('LoopX Long-Horizon Control', '长任务控制', '让一个任务跨小时、跨天不跑偏', 'Keeps a task on course across hours and days'), I('Browser Automation · Playwright', '浏览器自动化', '操作那些没有接口的网页工具', 'Works the web tools that have no API'), I('Computer Use', '计算机操作', '没有接口时，直接操作界面', 'Operates an interface when integration is not available'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', '按时间跑，或在业务状态变化时跑', 'Runs on a clock, or when the business state changes'), I('API Actions · MCP Client · MCP Tools', 'API 动作 · MCP 客户端与工具', 'AI 员工被允许调用的那些正式接口', 'Documented interfaces an agent is allowed to call'), I('External Connectors · Workspace Bridge', '外部连接器 · 工作台桥接', '接到你团队已经在用的系统', 'Reaches the systems your team already runs'), I('Credential Management', '凭据管理', '账号密码由它保管，不进提示词', 'Holds the logins so they never enter a prompt')]),
  G('12', 'Ontology & Enterprise Context', '本体与企业上下文', [I('Operational Ontology', '运营本体', '客户、报价、订单成为 AI 能操作的对象', 'Customers, quotes and orders as objects AI can act on'), I('Identity Spine', '跨系统身份', '同一个客户，在每个系统里都是同一个', 'The same customer across every connected system'), I('Customer · Product · Inquiry · Opportunity Objects', '客户 · 产品 · 询盘 · 机会对象', '业务的商务一侧，变成数据', 'The commercial side of the business, as data'), I('Quote · Order · Document · Task Objects', '报价 · 订单 · 文件 · 任务对象', '执行一侧，仍然挂在同一个客户上', 'The execution side, linked back to the customer'), I('Agent · Market Signal Objects', 'Agent · 市场信号对象', '谁做的这件事，以及是什么触发的', 'Who did the work, and what prompted it'), I('Relationships · Action Types · Business Logic', '关系 · 动作类型 · 业务逻辑', '对象之间怎么关联，能对它们做什么', 'How your objects connect and what may be done to them'), I('Enterprise Context', '企业上下文', 'AI 员工动手之前先读的那份企业状态', 'The company state an agent reads before acting'), I('PostgreSQL Operational Data', '运营数据存储', '运营记录实际存放的地方', 'Where the operational record actually lives')]),
  G('13', 'Governance & Control', '治理与控制', [I('Human-in-the-Loop', '人在回路', '明确哪些决定仍然必须由人来做', 'Names the decisions a person must still make'), I('Approval Service', '审批服务', '待决事项等在它该等的人那里', 'One place where pending decisions wait for their owner'), I('Capability Center', '能力中心', 'AI 员工能调用什么，以谁的名义', 'What agents are allowed to call, and on whose behalf'), I('Permission Control · Identity', '权限控制 · 身份', '谁能看什么、能做什么', 'Permission control and identity'), I('Perimeter Authentication', '边界认证', '任何动作开始前先验明身份', 'Checks identity before any agent action begins'), I('Audit Ledger · Agent Evidence · Action History', '审计台账 · Agent 证据 · 动作历史', '做了什么、哪个 AI 员工做的、凭谁的授权', 'What was done, by which agent, on whose authority'), I('Guardrails', '护栏', 'AI 员工自己越不过去的边界', 'Boundaries an agent cannot cross on its own'), I('Tenant Isolation', '租户隔离', '按公司和品牌分开的数据边界', 'Separate data boundaries per company and brand'), I('Failure Handling · Rollback', '失败处理 · 回滚', '出错时停下来、退回去', 'Failure handling and rollback'), I('Observability', '可观测性', 'AI 员工正在做什么，看得见', 'See what agents are doing while they do it')]),
  G('14', 'Evolution Engine', '进化引擎', [I('Evolution Console', '进化控制台', '候选改动在这里被复核和发布', 'Where proposed improvements are reviewed and released'), I('Observer Agent', '观察者', '观察真实执行，记录发生了什么', 'Watches real execution and records what happened'), I('Reflection Scientist', '反思科学家', '把记录下来的结果变成候选改动', 'Turns recorded outcomes into candidate improvements'), I('Skill Optimizer · Microsoft SkillOpt Integration', '技能优化器', '按实测结果改进一项技能', 'Improves a skill against measured results'), I('Eval & Red Team', '评估与对抗测试', '发布前先评测，再试着把它弄坏', 'Tests a change, and tries to break it, before release'), I('Evolution Governor', '进化治理器', '不经评测和批准，任何改动都发不出去', 'No change ships without evaluation and approval'), I('Trajectory · Outcome · Evaluation', '轨迹 · 结果 · 评估', '试了什么、结果如何、评分多少', 'What was attempted, what resulted, how it scored'), I('Skill Registry · Experiment System', '技能注册表 · 实验系统', '候选技能存放和试验的地方', 'Where a proposed skill is kept and tried out'), I('Champion / Challenger · Canary · Rollback', '冠军 / 挑战者 · 灰度 · 回滚', '先在一小部分上比对，留下或退回', 'Test a change on a slice, keep it or take it back'), I('Continuous Improvement · Enterprise Data Flywheel', '持续改进 · 企业数据飞轮', '每一次执行的结果都回到下一次执行', 'Continuous improvement and the enterprise data flywheel')]),
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
  // Scalora stacks these three on one absolutely-positioned line and swaps them.
  // The slot is one line tall (120px), so each language has to fit on one line:
  // at 1440 that is 800px at 96px type, roughly sixteen characters.
  ladder: [B('选一条流程。', 'One workflow.'), B('让它先跑起来。', 'Let it run.'), B('再扩到整家公司。', 'Then scale.')],
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
  quoteLabel: B('(我们的承诺)', '(Our promise)'),
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
  notice: B(`暂时无法确认提交结果。请重试，或主动点击邮件链接联系 ${CONTACT_INFO.email}；WhatsApp ${CONTACT_INFO.whatsapp}。`, `Submission confirmation is unavailable. Retry, or choose the email link to contact ${CONTACT_INFO.email}; WhatsApp ${CONTACT_INFO.whatsapp}.`),
};

/* ============================================================= notices === */

export const NOTICES = {
  date: B('2026-09-05 更新', 'Updated 2026-09-05'),
  h1: B('第三方声明', 'Third-party notices'),
  body: B(`
<h4>运行时库</h4>
<ul>
<li>Webflow 运行时与交互引擎（随模板导出），jQuery 3.5.1（MIT）</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock 标准「免费」许可。该许可允许网站实现（含商业用途），但许可方保留全部知识产权并可修改条款</li>
<li>Lenis（MIT）— 平滑滚动；Lottie（随 Webflow 运行时加载，MIT）— 导航图标动画</li>
</ul>
<h4>字体</h4>
<p>Inter、Inter Display、Inter Tight、Instrument Serif 与 42dot Sans，均按 SIL Open Font License 1.1 自托管，不向任何第三方字体服务发起请求。</p>
<h4>图片素材</h4>
<p>首页中心视频采用网站所有者提供的第四套模板 Fearless Vision Hero 中的银色轨道动画，已压缩并自托管。它用于品牌概念展示，不是 STARGO 产品操作录像或客户案例。</p>
<p>本站的业务场景、品牌雕塑与数字角色图像为 AI 生成的概念视觉，用于解释业务关系、协作和治理；不是真实产品截图、员工肖像、客户案例或交付现场照片。中英文页面共用同一套无文字图像。页面中的人物照片、产品与场景照片、示例 Logo 墙、界面示意与装饰图标，来自网站所有者购买的 Webflow 模板随附的已授权设计素材，已镜像到本站自托管，仅作版式示意，不代表真实客户、员工、合作伙伴或客户评价。STARGO 标识与字标为 STARGO 自有作品。</p>
<h4>上游软件</h4>
<p>站内提到的 Activepieces、Chatwoot、Twenty CRM、WeKnora、Windmill、Playwright、Yente / OpenSanctions、Univer、Puter、Medusa、ERPNext、PostHog、Microsoft SkillOpt、Notion、Google、Reddit、LinkedIn、Facebook、YouTube、Alibaba、WhatsApp 等名称，均为各自所有者的商标或项目名。它们在本站出现是为了让上游身份可查，不表示相关项目对 STARGO 的背书。</p>
<h4>联系</h4>
<p>STARGO WORK · 柳州 · 广西 · 中国 · ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp} · ${CONTACT_INFO.site}</p>`,
  `
<h4>Runtime libraries</h4>
<ul>
<li>Webflow runtime and interaction engine (exported with the templates), jQuery 3.5.1 (MIT)</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock standard “no charge” licence, which permits website implementation including commercial use while the licensor retains all intellectual property and may amend the terms</li>
<li>Lenis (MIT) — smooth scrolling; Lottie (loaded by the Webflow runtime, MIT) — navigation icon animation</li>
</ul>
<h4>Fonts</h4>
<p>Inter, Inter Display, Inter Tight, Instrument Serif and 42dot Sans, all self-hosted under the SIL Open Font License 1.1. No request goes to a third-party font service.</p>
<h4>Imagery</h4>
<p>The homepage centre film uses the silver orbital animation from the owner-supplied fourth template, Fearless Vision Hero. It is compressed and self-hosted as conceptual brand imagery, not footage of the STARGO product or a customer engagement.</p>
<p>The business scenes, brand sculptures and digital-role imagery on this site are AI-generated conceptual visuals illustrating business relationships, collaboration and governance. They are not actual product screenshots, employee portraits, customer cases or photographs of a delivery site. Both languages share the same text-free imagery. The people, product and scene photographs, sample logo wall, interface illustrations and decorative icons are licensed design assets shipped with the Webflow templates the site owner purchased, mirrored and self-hosted here for layout illustration only; they do not depict real customers, employees, partners or customer reviews. The STARGO mark and wordmark are STARGO’s own work.</p>
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

/* =============================================================== legal === */

/** Privacy policy and terms of use: real pages, not placeholder anchors. */
export const LEGAL = {
  privacy: {
    date: B('2026-09-05 生效', 'Effective 2026-09-05'),
    h1: B('隐私政策', 'Privacy policy'),
    body: B(`
<p>本政策说明 STARGO WORK 官方网站（以下简称「本站」）收集哪些信息、为什么收集、保存多久，以及你拥有的权利。本站由 STARGO（柳州 · 广西 · 中国）运营。</p>
<h4>我们收集什么</h4>
<ul>
<li><strong>你主动提交的信息。</strong>通过联系表单或订阅表单提交的姓名、邮箱、公司、WhatsApp、行业、目标市场、团队规模、现有系统与留言内容。这些信息仅用于回复你的咨询、安排演示和发送你订阅的产品更新。</li>
<li><strong>技术日志。</strong>本站托管在 Cloudflare Pages。访问时的 IP 地址、浏览器类型和请求时间会出现在托管方的标准访问日志中，用于安全防护与故障排查；本站不据此建立访客画像。</li>
<li><strong>Cookie 与本地存储。</strong>本站不使用分析或广告 Cookie，不加载任何第三方追踪脚本；所有字体、图片与脚本均从本站自身域名加载。</li>
</ul>
<h4>如何使用与共享</h4>
<p>提交时，表单内容先发送至托管于 Cloudflare 的本站接口进行验证；邮件服务配置完成后，通过 Resend 投递到 sales@stargomoto.com，用于处理你的请求。我们不出售你的信息；除完成托管、投递所需的服务商和法律要求外，不向第三方共享。本接口不会将表单内容写入数据库。</p>
<p>若邮件服务未配置或无法确认投递，页面会保留你填写的内容并提示重试，同时提供邮件链接。只有你主动点击该链接，才会打开自己的邮件客户端；这不代表在线提交已经成功。</p>
<h4>保存期限</h4>
<p>咨询信息在处理完毕后最多保存 24 个月；订阅邮箱在你退订前保留。你可以随时要求删除。</p>
<h4>你的权利</h4>
<p>你可以随时查询、更正或删除我们持有的关于你的信息，或撤回订阅：发送邮件到 sales@stargomoto.com，或通过 WhatsApp +86 187 7512 7878 联系我们。我们会在 15 个工作日内回复。</p>
<h4>未成年人</h4>
<p>本站面向企业用户，不面向未满 18 周岁的个人收集信息。</p>
<h4>政策更新</h4>
<p>政策更新时，本页顶部的生效日期会随之变化。重大变更会在本站显著位置提示。</p>`,
    `
<p>This policy explains what the STARGO WORK website (“this site”) collects, why, for how long, and the rights you have. The site is operated by STARGO, Liuzhou, Guangxi, China.</p>
<h4>What we collect</h4>
<ul>
<li><strong>What you submit.</strong> Name, e-mail, company, WhatsApp, industry, target markets, team size, current systems and your message, sent through the contact or newsletter forms. They are used only to answer your inquiry, arrange a demo and send the product updates you subscribed to.</li>
<li><strong>Technical logs.</strong> The site is hosted on Cloudflare Pages. Your IP address, browser type and request time appear in the host’s standard access logs for security and troubleshooting; we do not build visitor profiles from them.</li>
<li><strong>Cookies and local storage.</strong> The site sets no analytics or advertising cookies and loads no third-party tracking script; fonts, images and scripts are served from this site’s own domain.</li>
</ul>
<h4>How it is used and shared</h4>
<p>When you submit a form, its contents first reach this site’s Cloudflare-hosted endpoint for validation. Once the mail service is configured, Resend delivers them to sales@stargomoto.com to handle your request. We do not sell your information; sharing is limited to service providers needed for hosting and delivery, or as required by law. This endpoint does not write form contents to a database.</p>
<p>If the mail service is not configured or delivery cannot be confirmed, the page retains your entries, offers a retry and provides an email link. Your own mail client opens only when you choose that link; this does not mean the online submission succeeded.</p>
<h4>Retention</h4>
<p>Inquiries are kept for at most 24 months after they are handled; a newsletter address is kept until you unsubscribe. You can ask for deletion at any time.</p>
<h4>Your rights</h4>
<p>You can access, correct or delete the information we hold about you, or withdraw a subscription, at any time: write to sales@stargomoto.com or reach us on WhatsApp +86 187 7512 7878. We answer within 15 working days.</p>
<h4>Minors</h4>
<p>The site addresses business users and does not knowingly collect information from anyone under 18.</p>
<h4>Changes</h4>
<p>When this policy changes, the effective date at the top of this page changes with it. Material changes are announced prominently on the site.</p>`),
  },
  terms: {
    date: B('2026-09-05 生效', 'Effective 2026-09-05'),
    h1: B('使用条款', 'Terms of use'),
    body: B(`
<p>访问或使用 STARGO WORK 官方网站（以下简称「本站」），即表示你接受以下条款。本站由 STARGO（柳州 · 广西 · 中国）运营。</p>
<h4>内容用途</h4>
<p>本站内容用于介绍 STARGO WORK 产品与服务。页面中的界面图、公司名、人名与数字均为演示数据，用于说明产品工作方式，不构成对任何真实客户或结果的陈述。</p>
<h4>价格与方案</h4>
<p>本站列出的方案与价格为公开参考价，以人民币计。实际服务范围、续费价格、模型与第三方服务用量，以双方签署的合同或订单为准。我们可能在不另行通知的情况下调整本站的方案与价格。</p>
<h4>知识产权</h4>
<p>STARGO 标识、字标、产品名称（含 STARGO WORK、STARGO OS、Growth OS、Quote Studio 等）以及本站的文字、界面图与品牌视觉，均归 STARGO 所有。未经书面许可，不得复制、改编或用于商业用途。本站使用的第三方模板、库与字体，其许可见「第三方声明」。</p>
<h4>第三方名称</h4>
<p>站内提到的其他公司、产品与项目名称属于各自所有者，出现在本站是为了说明兼容性或来源，不表示相关方对 STARGO 的背书。</p>
<h4>责任限制</h4>
<p>本站按「现状」提供。在法律允许的范围内，STARGO 不对因使用本站或依赖本站内容而产生的任何间接损失承担责任。本站可能不定期变更或中断，恕不另行通知。</p>
<h4>适用法律</h4>
<p>本条款适用中华人民共和国法律。因本条款产生的争议，由 STARGO 所在地有管辖权的人民法院管辖。</p>
<h4>联系</h4>
<p>关于本条款的问题：sales@stargomoto.com · WhatsApp +86 187 7512 7878。</p>`,
    `
<p>By accessing or using the STARGO WORK website (“this site”) you accept the terms below. The site is operated by STARGO, Liuzhou, Guangxi, China.</p>
<h4>Purpose of the content</h4>
<p>The site presents the STARGO WORK product and services. Interface images, company names, people and figures on these pages are demonstration data that illustrate how the product works; they make no statement about any real customer or result.</p>
<h4>Plans and prices</h4>
<p>Plans and prices listed here are public reference prices in Chinese yuan. The actual scope of service, renewal price and allowance for model and third-party usage are set by the contract or order signed by both parties. Plans and prices on this site may change without notice.</p>
<h4>Intellectual property</h4>
<p>The STARGO mark, wordmark and product names (including STARGO WORK, STARGO OS, Growth OS and Quote Studio), together with the text, interface images and brand visuals on this site, belong to STARGO. They may not be copied, adapted or used commercially without written permission. Third-party templates, libraries and fonts used by the site are licensed as described in the Notices page.</p>
<h4>Third-party names</h4>
<p>Other company, product and project names mentioned on this site belong to their respective owners. They appear to explain compatibility or origin and imply no endorsement of STARGO.</p>
<h4>Limitation of liability</h4>
<p>The site is provided as is. To the extent the law allows, STARGO is not liable for indirect loss arising from use of the site or reliance on its content. The site may change or be interrupted at any time without notice.</p>
<h4>Governing law</h4>
<p>These terms are governed by the laws of the People’s Republic of China. Disputes fall under the jurisdiction of the competent people’s court at STARGO’s seat.</p>
<h4>Contact</h4>
<p>Questions about these terms: sales@stargomoto.com · WhatsApp +86 187 7512 7878.</p>`),
  },
  back: B('返回首页', 'Back to home'),
};

/* =============================================================== about === */

/** The lifelogx about page: STARGO's own story in the template's layout. The
    four hero circles show AI-employee roles with STARGO's own role emblems —
    not people, not a team; the careers list becomes five workflow
    entry points that all lead to the contact page. */
/**
 * Workforce page, built on the Lifelogx feature template.
 *
 * The Intelligence page explains how delegation works. This one answers a
 * different question: who is actually on the team. Roles, the department each
 * belongs to, what the department owns, and what a company gets done with them.
 * No head-count claims, no productivity figures — the template's "Views / 99.6M"
 * slot carries a department and the object that department owns.
 */
export const LX_FEATURE_WORKFORCE = {
  heroPink: B('288 位 AI 员工。', 'Give the work to a team.'),
  heroWhite: B('一张组织架构图。', 'Not another chat window.'),
  heroDesc: B('每一位都有岗位、目标、工具、权限和执行记录。不是 288 个聊天机器人。', 'STARGO WORK brings 288 specialized AI employees into one cloud workspace. Assign a goal, bring the right roles together and follow their progress.'),
  heroButton: B('预约演示', 'Book a demo'),
  roles: [
    { name: B('Market Signal Agent', 'Market Signal Agent'), dept: B('部门', 'Team'), owns: B('增长', 'Growth') },
    { name: B('Quote Agent', 'Quote Agent'), dept: B('部门', 'Team'), owns: B('销售', 'Sales') },
    { name: B('Follow-up Agent', 'Follow-up Agent'), dept: B('部门', 'Team'), owns: B('客户', 'Accounts') },
    { name: B('Document Agent', 'Document Agent'), dept: B('部门', 'Team'), owns: B('单证', 'Documents') },
    { name: B('Orchestrator', 'Orchestrator'), dept: B('部门', 'Team'), owns: B('调度', 'Operations') },
  ],
  doTitle: B('一个团队，能替你完成这些', 'Every AI employee needs more than a name.'),
  abilities: [
    { title: B('主动获客', 'Prospecting'), text: B('市场信号、进口记录、经销商网络与采购决策链，变成可跟进的机会。', 'Market signals, import records, dealer networks and buying committees become opportunities you can work.') },
    { title: B('询盘到报价', 'Inquiry to quote'), text: B('识别客户、匹配产品、套用价格规则、生成报价，越过利润护栏的进入审批。', 'Identify the customer, match the product, apply the pricing rules, draft the quote; anything past the margin guardrail goes to approval.') },
    { title: B('订单与单证', 'Orders and documents'), text: B('PI、付款节点、生产进度、出口文件与认证资料，同一个订单对象里。', 'PI, payment milestones, production progress, export documents and certificates, all on one order object.') },
  ],
  bullets: [
    B('看得见优先级', 'Priorities at a glance'),
    B('跟得住客户与订单', 'Customers and orders tracked'),
    B('关键动作留有证据', 'Critical actions leave evidence'),
    B('越权的事进审批', 'Anything past authority needs approval'),
  ],
  phoneTitle: B('一个能真正干活的工作台', 'A workspace that does the work'),
  phoneSub: B('日常运营在同一处', 'Day-to-day operations in one place'),
  cardA: { title: B('有岗位的 AI', 'AI with a job'), text: B('不从空白提示开始：岗位、目标、知识、工具、权限和执行记录都是配好的。', 'It never starts from a blank prompt: role, goal, knowledge, tools, permissions and record are all configured.') },
  cardB: { title: B('记得住上下文', 'Context that holds'), text: B('研究员记下公司证据，产品岗核对能不能做，销售岗写出第一封信，协调岗把结果合并成一份简报——每一步都写在同一个客户对象上，下一个人接手时不用你再转述。', 'The research role records the company evidence, the product role checks what is actually offerable, the sales role drafts the first message and a coordinator merges it into one brief. Each step is written onto the same customer object, so the next role picks it up without you relaying it.') },
  stackedCard: B('企业要的能力，已经在里面。', 'The capabilities a company needs, already inside.'),
  answersCards: [
    B('在手机上批掉一条报价', 'Approve a quote from your phone'),
    B('一个目标 → 分派角色 → 交接上下文 → 一份可复核的简报', 'One goal → roles assigned → context handed over → a reviewable brief'),
  ],
  extraRole: { name: B('Audit Ledger', 'Audit Ledger'), owns: B('留痕', 'Evidence') },
  answersBody: B('岗位、目标、工具、权限、审批与执行记录，全部包含在你选择的层级里。', 'Roles, goals, tools, permissions, approvals and records — all included in the level you choose.'),
  // The template's square tile has a follower count painted into the artwork.
  tile: { src: 'assets/stargo-motion/orbit-poster.webp', alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
  answersTitle: B('常见问题都在这里', 'All your answers here'),
  answerTabs: [B('岗位', 'Roles'), B('权限', 'Authority'), B('部署', 'Deployment')],
  answersCard: B('把工作交给 AI，权力留在企业', 'Delegate the work. Keep the authority.'),
  answersButton: B('聊聊你的方案', 'Discuss your plan'),
  storiesTitle: B('文章', 'Stories'),
  storiesSub: B('我们写下来的', 'we write and share'),
};

export const ABOUT = {
  eyebrow: B('关于 STARGO WORK', 'About STARGO WORK'),
  title: B('把工作交给 AI，权力留在企业。', 'Built from the work of running an export business.'),
  desc: B('STARGO WORK 是为制造业与全球贸易企业打造的 AI 操作系统：288 个专业 AI 员工在同一个企业上下文中协同，把从找客户到订单的整条链连起来。', 'STARGO WORK grew from a practical question: how can a manufacturing and export team use AI across the work, not just in a chat window? Customer research, product questions, quotations, order handoffs and follow-up all depend on information that is often scattered.'),
  button: { label: B('预约演示', 'Book a demo'), href: 'contact.html' },
  /* The template shows four named people here. STARGO's role emblems (its own
     conceptual visuals, not portraits) stand for four AI-employee roles instead. */
  circles: [
    { label: 'Market Signal Agent', image: 'assets/stargo/avatar-01.png' },
    { label: 'Quote Agent', image: 'assets/stargo/avatar-03.png' },
    { label: 'Follow-up Agent', image: 'assets/stargo/avatar-05.png' },
    { label: 'Orchestrator', image: 'assets/stargo/avatar-06.png' },
  ],
  bigImage: { src: 'assets/stargo-motion/orbit-poster.webp', alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
  storyTitle: B('我们的来历', 'Our story'),
  story: B(`<p>STARGO WORK 不是从一张 SaaS 产品需求表开始的。它来自真实的制造业与全球贸易业务：怎么找到客户、判断客户、快速回复、管理产品知识、报价、审批、做 PI、管理订单、准备出口文件、持续跟进，以及怎么让企业增长不再完全依赖增加人。</p>
<p>我们的做法是前置部署：软件适应企业，而不是企业适应软件。FDE 进入真实流程，把业务规则、产品知识和审批边界直接反馈到系统能力建设中。</p>
<p>我们相信 AI 应该真正承担工作，也相信权力应该留在企业。所以从第一天起，权限、审批、证据、审计和可回滚就是产品本身的一部分，而不是事后添加的功能。</p>`,
    `<p>STARGO WORK did not start from a SaaS product spec. It came out of real manufacturing and global-trade operations: how to find customers, judge them, reply fast, manage product knowledge, quote, approve, make the PI, manage orders, prepare export documents, keep following up — and how to grow without only hiring.</p>
<p>Our method is forward deployment: software adapts to the company, not the other way round. An FDE enters the real workflow and feeds business rules, product knowledge and approval boundaries straight back into the platform.</p>
<p>We believe AI should genuinely do the work, and that authority should stay with the company. So from day one, permissions, approval, evidence, audit and rollback have been part of the product itself, not features added afterwards.</p>`),
  values: [
    B('人始终掌握决定权。', 'Keep people responsible.'),
    B('软件适应企业，而不是反过来。', 'Keep the business connected.'),
    B('从每一次结果中学习。', 'Improve with evidence.'),
  ],
  startTitle: B('从一条流程开始', 'Start with one workflow'),
  starts: [
    { name: B('询盘处理', 'Inquiry handling'), sub: B('阶段 04–05 · 理解与回复', 'Stages 04–05 · Understand & respond') },
    { name: B('报价与 PI', 'Quotes & PI'), sub: B('阶段 06 · Quote Studio', 'Stage 06 · Quote Studio') },
    { name: B('主动获客', 'Proactive acquisition'), sub: B('阶段 01–03 · Growth OS', 'Stages 01–03 · Growth OS') },
    { name: B('客户跟进', 'Customer follow-up'), sub: B('阶段 08 · Follow-up Agents', 'Stage 08 · Follow-up Agents') },
    { name: B('出口单证', 'Export documents'), sub: B('阶段 07 · Trade Execution', 'Stage 07 · Trade Execution') },
  ],
};


/* ================================================ capability showcase === */

/**
 * The Capability map module on /en/capabilities. Donor: the qubix template's
 * service-detail block (`service-details-rice`), a label + rich-text grid whose
 * bullets lead with a bold term. It repeats natively, needs no imagery and is
 * dark by default, so it carries a long catalogue without a giant table.
 *
 * `picks` are capability names from CAPABILITY_GROUPS. The build looks each one
 * up and prints the register's own gloss, so this file cannot describe a
 * capability differently from the catalogue below it.
 */
export const CAPABILITY_SHOWCASE = {
  // The donor sets these two lines at 192px and never wraps them, so each has to
  // fit the 1180px column: "Connected" measures 1216px and does not.
  /* The page opens on renok's hero. Its accent word is set in an italic serif,
     which has no CJK glyphs, so the accent stays a Latin fragment in both
     languages rather than a synthesised slant. */
  heroLead: B('把外贸做成', 'Everything a trade team'),
  heroAccent: B('/one system', '/does'),
  heroTail: B('的一套系统', 'in one place'),
  heroBody: B('客户研究、沟通、报价、订单与内容，落在同一条工作流上。288 位专业 AI 员工推进，决策权在你的团队。', 'Customer research, conversations, quotations, orders and content on one workflow — carried by 288 specialized AI employees, with the decisions still yours.'),
  heroButton: B('看能力图谱', 'See the capability map'),
  eyebrow: B('能力图谱', 'CAPABILITY MAP'),
  headlineTop: B('每一项', 'Every'),
  headlineBottom: B('工作', 'Job'),
  headline: B('找到买家。拿下订单。让工作继续。', 'Find buyers. Win orders. Keep the work moving.'),
  storiesLabel: B('你的业务能完成什么', 'What your business gets done'),
  storiesNote: B('六件相互衔接的事。点开看背后的工作。', 'Six connected outcomes. Open one to see the work behind it.'),
  foundationsNote: B('上面每一件事都依赖的四样东西。', 'Four things every outcome above depends on.'),
  body: B('看 STARGO 如何把客户研究、沟通、报价、贸易执行与内容创作连成一条工作流——共享同一份业务上下文，由 288 位专业 AI 员工推进。', 'Explore how STARGO brings customer research, conversations, quotations, trade operations and creative work together — with shared business context and 288 specialized AI employees.'),
  cardButton: B('聊聊你的流程', 'Discuss your workflow'),
  inCatalogue: B('对应能力组', 'In the catalogue'),
  outputLabel: B('产出', 'Useful output'),
  connectionLabel: B('接到哪里', 'Connects to'),
  scopeNote: B('这里展示的是能力登记范围。你公司实际可用的部分在方案沟通时确认——登记在册不等于已经部署。', 'Scope shown here is the capability register. Availability for your company is confirmed during scoping — a documented capability is not by itself a deployed one.'),

  stories: [
    {
      image: 'os-cockpit',
      label: B('找出值得跟进的买家', 'Find the buyers worth pursuing'),
      groups: ['02', '03'],
      promise: B('从你的产品和目标市场出发。公司研究、可得的贸易记录和采购信号汇到一起，得到的是一个你能判断的客户，而不是一份联系人名单。', 'Start with your products and target markets. Company research, available trade records and buying signals come together into an account you can judge, not a contact list.'),
      picks: ['Account Research', 'Trade Intelligence', 'Importer Reorder Radar', 'Buying Committee Intelligence', 'Opportunity Decision Engine', 'Dealer Opportunity Brief', 'CRM Automatic Lead Creation'],
      output: B('一份有依据的客户简报、一封触达草稿，以及一条有负责人的跟进任务。', 'An evidence-backed account brief, an outreach draft and a follow-up task with an owner.'),
      connection: B('同一份客户上下文，直接进入下一次沟通和报价。', 'The same account context carries into the next conversation and quotation.'),
    },
    {
      image: 'os-sales-desk',
      label: B('把对话变成对客户的理解', 'Turn conversations into customer understanding'),
      groups: ['04', '05'],
      promise: B('询盘从已接入的渠道进来，落到同一条客户时间线上。需求从来信里读出来，答案取自企业已审核的知识，敏感的部分等人决定。', 'Inquiries arrive from connected channels and land on one customer timeline. Requirements are read out of the message, answered from approved company knowledge, and anything sensitive waits for a person.'),
      picks: ['Unified Inbox', 'Inquiry Intent Detection', 'Buyer Requirement Extraction', 'Customer Risk Signals', 'Knowledge-Grounded Reply', 'Account 360', 'Automatic Follow-up'],
      output: B('一条客户记录、结构化的需求，以及一份待复核的回复。', 'A customer record, structured requirements and a reply ready for review.'),
      connection: B('谈定的需求就是报价的起点。', 'The agreed requirement becomes the starting point of the quotation.'),
    },
    {
      image: 'os-quote-studio',
      label: B('在商务可控的前提下出报价', 'Prepare quotations with commercial control'),
      groups: ['07', '06'],
      promise: B('报价从询盘、已审核的产品资料和你配置的价格规则开始，而不是从一张空表格开始。AI 负责准备，承诺由有权限的人做出。', 'A quotation starts from the inquiry, the approved product information and your configured pricing rules — not a blank spreadsheet. AI prepares; authorized people commit.'),
      picks: ['Quote Studio', 'Product Configuration & Quantity', 'Pricing Rules', 'Margin Guardrails', 'Historical Price Context', 'Approval Workflow', 'PI Studio / PI Center'],
      output: B('一份已批准的报价、它的版本记录，以及随之生成的形式发票。', 'An approved quotation, its version history and the pro forma invoice behind it.'),
      connection: B('批准的商务细节直接进入订单，不用重新录入。', 'Approved commercial detail passes into the order without re-entry.'),
    },
    {
      image: 'os-trade-execution',
      label: B('把订单一路协调到交付与复购', 'Coordinate orders through fulfilment and follow-up'),
      groups: ['08'],
      promise: B('付款节点、生产进度、包装与出运在同一个订单对象里，商务单据用批准过的订单数据生成。', 'The order carries payment milestones, production status, packing and shipment in one place, and the commercial paperwork is prepared from approved order data.'),
      picks: ['Order Management', 'Payment Milestones', 'Production Status & QC', 'Commercial Invoice · Packing List', 'Certificate of Origin · Form E', 'Bill of Lading Workflow', 'Export Documentation & Workflow'],
      output: B('看得见的订单状态、一份单据清单，以及下一步的负责人。', 'A visible order status, a document checklist and the next accountable owner.'),
      connection: B('交付结果留在客户身上，供售后和下一次采购使用。', 'Delivery outcomes stay on the account for after-sales and the next purchase.'),
      caveat: B('单据准备与流程支持不替代正式签发、清关决定或专业合规审查。', 'Document preparation and workflow support do not replace official issuance, customs decisions or professional compliance review.'),
    },
    {
      image: 'brand-family-01',
      label: B('为产品和市场做内容', 'Create content for products and markets'),
      groups: ['09', '03'],
      promise: B('产品与销售素材取自销售流程用的同一份已审核产品资料，再按买家和答案引擎能找到的方式组织。', 'Product and sales material is produced from the same approved product information the sales workflow uses, then structured so buyers and answer engines can find it.'),
      picks: ['AI Creative Studio', 'Product · Sales · Social Content', 'SEO · GEO · GEO Trust Content', 'Multi-language Content', 'AI Image & Video Workflow', 'STARGO Viral Replica Engine', 'OpenMontage · Viral Clips'],
      output: B('产品页、本地化文案与短视频，可直接用在你销售的渠道上。', 'Product pages, localized copy and short video ready for the channels you sell on.'),
      connection: B('发布出去的内容又回到上面的买家研究与询盘处理。', 'Published material feeds the buyer research and inquiry handling above.'),
    },
    {
      image: 'os-agent-center',
      label: B('用一支 AI 团队把活干完', 'Run the work with an AI team'),
      groups: ['01', '10'],
      promise: B('交出去的是目标，不是提示词。相关岗位接手，彼此之间传递上下文，交回一份可复核的结果，决定权仍在你手里。', 'Assign a goal, not a prompt. The relevant specialists take it up, exchange context between themselves and return something reviewable, with the decisions still yours.'),
      picks: ['288 Specialized AI Employees', 'StaffDeck', 'Agent Teams · Multi-Agent Collaboration', 'Task Delegation · Handoff · Parallel Execution', 'Role · Skills · Tools · Memory', 'Approval Center', 'Mobile Companion'],
      output: B('一次组队分工、看得见的进度，以及一份待复核的简报。', 'A team assignment, visible progress and one brief for review.'),
      connection: B('288 是岗位目录，不是 288 个并发运行，也不是无限用量。', '288 is the role catalogue — not 288 simultaneous runs or unlimited usage.'),
    },
  ],

  foundationsLabel: B('每件事共同依赖的底座', 'What every story runs on'),
  foundations: [
    {
      image: 'brand-ontology',
      label: B('业务上下文', 'Business context'),
      groups: ['06', '12'],
      promise: B('客户、报价、订单是带关系和规则的对象；答案取自企业资料，而不是临场编出来的。', 'Customers, quotes and orders are objects with relationships and rules, and answers are retrieved from company sources rather than improvised.'),
      picks: ['Operational Ontology', 'Customer · Product · Inquiry · Opportunity Objects', 'Enterprise Brain', 'Enterprise RAG', 'Source-Grounded Answers'],
    },
    {
      image: 'os-desktop',
      label: B('工具与连接', 'Tools and connections'),
      groups: ['11'],
      promise: B('AI 员工通过正式接口接到现有系统，也能操作那些根本没有接口的工具。', 'Agents reach existing systems through documented interfaces, and work the tools that have no interface at all.'),
      picks: ['API Actions · MCP Client · MCP Tools', 'External Connectors · Workspace Bridge', 'Activepieces Workflow Automation', 'Browser Automation · Playwright', 'Credential Management'],
      caveat: B('登记在册的连接器，在完成配置与授权之前，不等于你公司已经接通。', 'A connector in the register is not a live integration for your company until it is configured and authorized.'),
    },
    {
      image: 'os-login',
      label: B('权限与证据', 'Authority and evidence'),
      groups: ['13'],
      promise: B('企业决定哪些可以自己跑、哪些要复核、哪些要审批；每个重要动作都留下人能回看的记录。', 'The company sets what may run alone, what needs review and what needs approval; every important action leaves a record a person can read back.'),
      picks: ['Human-in-the-Loop', 'Approval Service', 'Permission Control · Identity', 'Audit Ledger · Agent Evidence · Action History', 'Failure Handling · Rollback'],
    },
    {
      image: 'brand-loop',
      label: B('可核查的改进', 'Improvement you can check'),
      groups: ['14'],
      promise: B('记录下来的结果变成对知识、提示词、技能和流程的候选改动——先评测、再批准才发布，不成立就回滚。', 'Recorded outcomes become candidate changes to knowledge, prompts, skills and workflows — evaluated and approved before release, rolled back when they do not hold.'),
      picks: ['Observer Agent', 'Trajectory · Outcome · Evaluation', 'Reflection Scientist', 'Eval & Red Team', 'Champion / Challenger · Canary · Rollback'],
      caveat: B('改的是知识、提示词、技能和流程，不会自行重训基础模型权重。', 'This improves knowledge, prompts, skills and workflows. It does not retrain foundation-model weights on its own.'),
    },
  ],

  catalogueLabel: B('完整目录', 'The complete catalogue'),
  catalogueNote: B('登记在册的全部能力，按组排列。上面的成果引用的就是这些条目。', 'Every capability in the register, by group. The outcomes above draw from these same entries.'),
};

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
   pointing at its block on the capability page. The labels name what those
   blocks now are (V6 §5): Growth OS prospecting, Sales Desk, quotations, and
   ERP with fulfilment — so 沟通 became 销售 and 订单 became 经营. The loop's
   title card (tools/blocks/rk-award.mjs) draws [0] and [3] as its two chips. */
export const CAP_JUMPS = [
  { anchor: 'story-1', label: B('获客', 'Prospects') },
  { anchor: 'story-2', label: B('销售', 'Sales') },
  { anchor: 'story-3', label: B('报价', 'Quotes') },
  { anchor: 'story-4', label: B('经营', 'Operations') },
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
  /* The footer statement on every page (V6 §4.11: say the same thing as the
     hero). Its link is resolved by its words in tools/chrome.mjs remapLinks;
     these words name no page, so it goes where the template sent it — the
     contact page. It used to reach the workforce page only because the old
     second line said 「AI 员工」. */
  ['Crafting visuals. Shaping stories.', B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。', 'A browser-based desktop AI operating system for manufacturing and global trade.')],
  ['Let’s create great work together!', B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.')],
  ['Let’s Collaborate', B('预约演示', 'Book a Demo')],
  ['(Newsletter)', B('(订阅更新)', '(Newsletter)')],
  ['Be the first to know what’s new.', B('产品进展第一时间通知你。', 'Stay close to practical AI work.')],
  ['No noise. Just curated updates.', B('不发广告，只发产品更新。', 'Receive STARGO WORK product notes and practical workflow guides.')],
  ['Thank you for subscribing!', B('订阅成功。', 'You are subscribed.')],
  ['Oops! Something went wrong while submitting the form.', B('提交失败，请稍后重试。', 'Something went wrong. Please try again.')],
  ['Thank you! Your submission has been received!', B('已收到，我们会尽快联系你。', 'Received. We will be in touch shortly.')],
  /* The footer copyright, and the dangling hyphen after it.
     Mono ships this line as `<p class="top-text big gray sm">© 2026 Mōno™
     Studio - </p>` — a trailing " - " with nothing after it, in the donor
     itself (tools/templates/studio.html). It is the designer's separator
     waiting for a second clause that the template never adds. Nothing of ours
     is missing: there is no second clause in copy.mjs, none in chrome.mjs and
     none in the donor, so the line was never going to read as anything but
     「© 2026 STARGO WORK -」. Reported from a phone, where it is the last thing
     on the page and the hyphen sits alone at the end of the line.
     Both spellings of the donor string are mapped, the hyphenated one first,
     and both now resolve to the same finished sentence.

     The third entry is not a donor string and is not a mistake. The homepage
     never reaches the first two: tools/build-site.mjs already rewrites
     「© 2026 Mōno™ Studio」 to 「© 2026 STARGO WORK」 while it assembles the page,
     and applyChrome runs after that, so by the time this table is applied the
     homepage's line reads 「© 2026 STARGO WORK - 」 and neither donor key
     matches it any more. That entry catches it, and every other page passes
     through it unchanged. */
  ['© 2026 Mōno™ Studio -', B('© 2026 STARGO WORK', '© 2026 STARGO WORK')],
  ['© 2026 Mōno™ Studio', B('© 2026 STARGO WORK', '© 2026 STARGO WORK')],
  ['© 2026 STARGO WORK -', B('© 2026 STARGO WORK', '© 2026 STARGO WORK')],
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
  /* Titles and descriptions: V5 part F. The build appends 「 — STARGO WORK」 to
     every title but the homepage's (tools/chrome.mjs head()), so the page
     titles below carry no brand of their own. */
  'index.html': { title: B('STARGO WORK — 网页桌面级 AI 企业操作系统', 'STARGO WORK — Enterprise AI Desktop'), description: B('以 Growth OS 主动获客与 Sales Desk 外贸闭环为核心，连接 ERP、营销内容、企业知识与 288 个跨部门数字岗位。功能按企业配置与交付范围开放。', 'Growth OS and Sales Desk connect acquisition and trade sales with operations, creative work and 288 AI roles. Availability is configuration-dependent.') },
  'intelligence.html': { title: B('企业智能', 'Enterprise Intelligence'), description: B('让 AI 带着企业知识、客户历史、业务关系和工作目标做事，了解主动提醒、长期任务、记忆与持续改进的分阶段能力。', 'Connect company knowledge, customer history and business context with goals, proactive prompts, ongoing tasks, memory and controlled improvement.') },
  'capabilities.html': { title: B('功能全景', 'Capabilities'), description: B('从获客、销售、报价与 PI，到 ERP、履约、AI 图片视频、数字员工、企业知识和管理控制，了解完整功能与开放条件。', 'Explore growth, sales, quotations, ERP, fulfillment, AI images and video, knowledge, teamwork and management—with clear availability conditions.') },
  'workforce.html': { title: B('288 个专业数字岗位', '288 Specialized AI Roles'), description: B('覆盖十类企业职能，按任务选择员工、组织团队、交流信息并接力交付；实际启用和协作范围依企业配置开放。', 'Explore ten role groups and task-based teams. Activation, communication and permitted work depend on enterprise configuration and delivery scope.') },
  'pricing.html': { title: B('配置与服务方案', 'Configuration & Services'), description: B('了解软件使用、实施配置和配套服务的区别。实际费用、权益与交付内容以当前确认方案为准。', 'Understand software access, implementation and supporting services. Fees, entitlements and delivery follow the current agreed offer.') },
  'enterprise.html': { title: B('企业管理与交付', 'Enterprise Control & Delivery'), description: B('看经营重点、任务责任、预算、审批与结果。了解企业账号连接、实施步骤与管理边界。', 'Review priorities, task owners, budgets, approvals and outcomes. Understand connected accounts, implementation steps and human control.') },
  'contact.html': { title: B('预约企业演示', 'Request an Enterprise Demo'), description: B('围绕企业的一条具体业务流程，讨论资料、账号、岗位、审批和可验收成果，确定合适的配置与交付范围。', 'Discuss one business workflow, the context it requires and checkable results. Define the right configuration and delivery scope for your company.') },
  'notices.html': { title: B('第三方声明', 'Third-party notices'), description: B('运行时库、字体、图片素材与上游软件的许可与署名。', 'Licences and attribution for runtime libraries, fonts, imagery and upstream software.') },
  'about.html': { title: B('关于 · 从真实业务出发', 'About — Built Around Real Work'), description: B('从主动获客和外贸销售切入，连接企业经营、内容生产与数字员工，把工作交给 AI，把决定权留在企业。', 'Connect acquisition, trade sales, business operations, creative work and AI roles. Delegate the work while people retain decision authority.') },
  'blog.html': { title: B('业务实践与产品解读', 'Business Practice & Product Guides'), description: B('了解客户开发、销售报价、企业知识、数字员工协作与管理控制，逐步读懂 AI 如何参与企业工作。', 'Explore customer acquisition, sales, quotations, enterprise knowledge, AI teamwork and management through practical workflow explanations.') },
  'privacy.html': { title: B('隐私政策', 'Privacy policy'), description: B('本站收集什么、为什么收集、保存多久，以及你的权利。', 'What this site collects, why, for how long, and your rights.') },
  'terms.html': { title: B('使用条款', 'Terms of use'), description: B('使用本网站的条款：内容、知识产权、价格说明与责任。', 'Terms for using this website: content, intellectual property, pricing notes and liability.') },
  '404.html': { title: B('404', '404'), description: B('页面不存在。', 'Page not found.') },
};

/* ============================================================ homepage === */

/* The five business stages (V5 H05, placed by V6 §4.6). The five stages say how
   the business moves; the four product slots further down say which workspace
   a person opens — the two do not repeat each other's introduction. */
const LOOP_LABELS = [
  B('主动获客', 'Discover'), B('外贸销售', 'Sell'), B('企业履约', 'Deliver'),
  B('回款与服务', 'Collect & support'), B('复购与改进', 'Retain & improve'),
];
const LOOP_DESC = [
  B('围绕产品、目标市场和客户类型，整理目标企业、背调、联系人与采购信号，形成开发优先级。', 'Research accounts, contacts and buying signals around products and target markets, then prioritize outreach.'),
  B('将主动开发客户与渠道询盘放进 Sales Desk，统一客户记录、回复、产品匹配、报价、审批与 PI。', 'Bring prospects and inquiries into Sales Desk for customer records, replies, product fit, quotes, approvals and PI.'),
  B('连接产品、采购、库存、生产、质检、订单和发货资料，让销售承诺与交付进度对应。按企业系统接入情况逐步连接与验收。', 'Connect products, purchasing, stock, production, quality and shipping records with the sales commitment. Connected and validated according to the enterprise systems in use.'),
  B('围绕付款节点、对账、物流、单证、出口退税资料和售后问题，组织跨部门跟进。按企业系统接入情况逐步连接与验收。', 'Coordinate payment milestones, reconciliation, logistics, trade documents, rebate materials and customer support. Connected and validated according to the enterprise systems in use.'),
  B('保留客户偏好、历史结果和后续任务，关注补货与复购机会，复盘工作方法。', 'Retain preferences, outcomes and next steps, identify reorder opportunities and review working methods.'),
];

/**
 * Homepage narrative (V6 placement plan, 2026-09-16). One idea has one home:
 *   hero (what the product is) → the problem (silos) → the business journey
 *   (Growth OS → Sales Desk, #loop) → 288 cross-functional roles + approval
 *   → the five stages → two core engines + ERP + AI creative → the channels
 *   → the workspace → connected vs fragmented work → start with one workflow
 *   → four illustrative scenarios → the pricing ladder → articles → demo.
 */
export const HOME_HERO_LIST = [
  B('主动找到目标客户', 'Find the right prospects'), B('把客户推进到订单', 'Move conversations toward orders'), B('让经营接住增长', 'Connect sales with operations'),
  B('持续生产营销内容', 'Create reusable marketing assets'), B('让 AI 员工协作', 'Put AI specialists to work together'),
];
/** Shorter phrasings swapped in on phones before the text animations split the lines. */
export const HOME_MOBILE = {
  heroSupport: B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动获客，Sales Desk 外贸闭环，连接企业经营、内容生产与 288 个专业数字岗位。', 'A browser-based desktop AI operating system for manufacturers and export teams. Growth OS and Sales Desk connect acquisition and trade sales with operations, creative work and 288 AI roles.'),
  scHero: B('Growth OS 找到并判断客户，确认后交给 Sales Desk 推进沟通、报价与订单；经营、内容与数字员工围绕同一条主线协作。', 'Growth OS finds and qualifies accounts; approved prospects move to Sales Desk for conversations, quotes and orders, supported by operations, content and AI teams.'),
  // The core-engines heading sits in a 421px box at 48px type — about eight
  // characters a line on desktop, so the desktop string is built to break on
  // its comma. Below 768px the box holds ten, so phones get a form whose two
  // halves each fit a line.
  products: B('两大引擎，经营与创作', 'Two engines, plus operations and creative'),
  ladder: B('AI 产能逐级加：先打底座，再跑运营，再建增长引擎，最后开启主动获客。', 'AI operating capacity, level by level: foundation, operation, growth engine, then AI acquisition.'),
};
/* The line at the centre of the workspace film (V6 §4.9). The film is a brand
   animation, not a product recording, so the line says what the workspace is
   for and claims no demonstration. */
export const HOME_THEATRE = B('同一个工作空间，连接日常经营。', 'One workspace for everyday business.');

/** Mono homepage: [templateString, pair, opts]. Order matters. */
export const HOME_MONO = [
  /* sticky cards → four illustrative application scenarios (V5 H11, V6 §4.10:
     business context, implementation, proactive prompts, improving from
     outcomes). The template's testimonial design (portrait, gradient, card) is
     kept; each card is a scenario line in an example trade company's voice,
     and every speaker line says 示例场景 / illustrative scenario. They are not
     customer reviews and claim no verified business result. The quote marks
     stay: the pricing and About review bands read these four cards out of this
     list and check that shape (tools/blocks/cn-reviews.mjs, cn-about-reviews.mjs). */
  ['&quot;Working with Mōno™ felt like having an internal team rather than an external agency. They were proactive, detail-oriented, and genuinely invested in the outcome.&quot;',
    B('「报价前，把客户历史、产品配置与企业价格政策放在一起核对。」', '“Check customer history, product configuration and approved pricing together before quoting.”')],
  ['John Doe', B('外贸业务员 · 示例场景', 'Export sales · illustrative scenario')],
  ['Head design at Circle®', B('理解企业 · 业务背景', 'Business context')],
  ['“We didn’t just get a website — we got a solid digital foundation. Mōno™ is the kind of partner you want when building something meant to last.”',
    B('「从企业真实的一条流程开始，明确资料、负责人、审批与验收结果。」', '“Start with one real workflow and define context, owners, approvals and acceptance.”')],
  ['Amantha Doe', B('外贸经理 · 示例场景', 'Trade manager · illustrative scenario')],
  ['Founder of Radius®', B('按业务落地', 'Implementation')],
  ['“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”',
    B('「发现客户可能进入补货窗口，先核实采购信号，再提出跟进建议。」', '“Review evidence for a possible reorder window before suggesting follow-up.”')],
  ['Max Trump', B('销售总监 · 示例场景', 'Sales director · illustrative scenario')],
  ['Founder of Light\u00a0Studio®', B('主动提醒', 'Proactive prompts')],
  ['“What stood out with Mōno™ was the balance between design quality and technical execution. Everything was thoughtful, scalable, and built with term use in mind.”',
    B('「记录成功与失败，比较新旧工作方法，验证后再采用改进。」', '“Record outcomes, compare approaches and validate improvements before adoption.”')],
  ['Camila Verga', B('总经理 · 示例场景', 'General manager · illustrative scenario')],
  ['Head design at LogoIspum®', B('从结果改进', 'Improving from outcomes')],
  /* the image + quote card that closes the pricing ladder → Enterprise */
  ['&quot;Mōno™ helped us simplify complexity. They streamlined our product narrative, improved performance, and delivered a digital experience that truly reflects our brand. The results were immediate — higher engagement.&quot;',
    B('「多部门、多公司、多品牌、多账号；复杂审批与系统对接；专属前置部署团队；私有化部署。」', '“Multiple departments, companies, brands and accounts. Complex approvals and system integration. A dedicated FDE. Private deployment.”')],
  ['Elena Rossi', B('企业版 · 定制', 'Enterprise · Custom')],
  ['Marketing Director at Auralis®', B('联系企业版团队', 'Talk to STARGO Enterprise')],

  /* flip cards → the pricing ladder */
  ['Mōno™ stands behind the data.', B('从企业需要的 AI 层级开始。', 'One system. The right level of support.')],
  ['Our success is reflected in the numbers we achieve for our clients. Every project is designed with measurable growth at its core.',
    B('一份年度软件订阅，加上可选的建站、内容与获客服务包。服务包价格是首年总价，已经包含软件订阅；服务交付量按档替换，不叠加。', 'An annual software subscription, with optional website, content and acquisition services. Service prices are first-year totals that already include the subscription; service quantities replace the lower tier rather than stacking.')],
  ['(Value created)', B('(标准版)', '(Standard)')],
  ['$174M', B('¥10,000', '¥10,000')],
  ['Empowering growth through strategic solutions.', B('12 个月云端工作台、核心外贸流程与自助线索发现。', 'A 12-month workspace, core trade workflows and self-service lead discovery.')],
  ['CRI: 5.1% → 6.7%', B('首年 ¥10,000 · 按年续费', '¥10,000 first year · renews yearly')],
  ['“We didn’t expect smoother onboarding and a noticeable lift in qualified leads.”', B('「先把企业的知识、客户和报价放进同一个系统。」', '“Put the company’s knowledge, customers and quotes into one system first.”')],
  ['Daniel Kim', B('标准版 · 年度软件订阅', 'Standard · the annual subscription')],
  ['(Return client rate)', B('(上线版)', '(Launch)')],
  ['92%', B('¥20,000', '¥20,000')],
  ['Building lasting partnerships built on trust.', B('官网 3 个核心页面与 20 个 SKU 页、中英文内容、20 个 SKU 图片与 10 条短视频。', 'A 3-page website with 20 SKU pages, Chinese and English content, 20 SKU image sets and 10 short videos.')],
  ['CRI: 2.9% → 4.4%', B('首年总价 ¥20,000（含 ¥10,000 软件订阅）· 续费另议', '¥20,000 first-year total, subscription included · renewal per proposal')],
  ['“Everything feels faster, clearer, and more premium. We shipped the redesign and conversions followed immediately.”', B('「让 AI 开始对外工作。」', '“Let AI start working outward.”')],
  ['Olivia Carter', B('上线版 · 建站与内容服务', 'Launch · website and content service')],
  ['(Projects delivered)', B('(增长版)', '(Growth)')],
  ['+320', B('¥30,000', '¥30,000')],
  ['Driving successful outcomes across industries.', B('官网 4 个核心页面与 40 个 SKU 页、5 个语种、SEO 与 GEO 实施服务。', 'A 4-page website with 40 SKU pages, five languages, and SEO / GEO implementation.')],
  ['CRI: 1.7% → 2.6%', B('首年总价 ¥30,000（含 ¥10,000 软件订阅）· 续费另议', '¥30,000 first-year total, subscription included · renewal per proposal')],
  ['“The new site finally matches our product. Cleaner UX, better messaging, and results we can actually measure.”', B('「不只把活干完，还开始带动增长。」', '“Not only doing the work — starting to drive growth.”')],
  ['Marcus Reed', B('增长版 · 更大范围的建站与内容', 'Growth · a wider website and content build')],
  ['(Client retention)', B('(全球获客版)', '(Global Acquisition)')],
  ['88%', B('¥40,000', '¥40,000')],
  ['Optimized journeys that turn traffic into growth.', B('官网 5 个核心页面与 80 个 SKU 页、18 种语言，另加三个月配置后获客运行与 3 份月报。', 'A 5-page website with 80 SKU pages, 18 languages, plus three months of configured acquisition operation and 3 monthly reports.')],
  ['CRI: 3.8% → 5.6%', B('首年总价 ¥40,000（含 ¥10,000 软件订阅）· 续费另议', '¥40,000 first-year total, subscription included · renewal per proposal')],
  ['“The redesign removed friction everywhere. It’s simple, sharp, and performs better across every device.”', B('「标准版自己获客；选这一档，我们替你跑三个月。」', '“Self-service acquisition is in Standard; this plan runs it for you for three months.”')],
  ['Sofia Martinez', B('全球获客版 · 配置后获客运行', 'Global Acquisition · configured acquisition operation')],
  ['>★★★★★<', B('>云端 · 知识 · CRM · 审批<', '>Cloud · knowledge · CRM · approval<'), { nth: 0 }],
  ['>★★★★★<', B('>含标准版年度软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],
  ['>★★★★★<', B('>含标准版年度软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],
  ['>★★★★★<', B('>含标准版年度软件订阅，另加：<', '>The annual Standard subscription, plus:<'), { nth: 0 }],

  /* FAQ — four slots, four topics (V6 §4.10): what it is (V5 F01), how it
     works with the systems a company already has (F11), what 288 means (F02),
     who decides (F05). The rest of V5's questions live on the pages they are
     about. The template's answers carry no closing stop, so these add one. */
  ['What services does your agency offer?', B('STARGO WORK 到底是什么？', 'What is STARGO WORK?')],
  ['We specialize in branding, website design and development, social media marketing, paid ads, SEO, and content strategy',
    B('它是一套面向制造业与外贸企业的网页桌面级 AI 企业操作系统。以 Growth OS 主动获客和 Sales Desk 外贸销售为业务主线，连接企业经营、内容生产、知识和数字员工，并保留人的审批与决定权。', 'It is a browser-based desktop AI operating system for manufacturing and global trade enterprises. Growth OS and Sales Desk lead the business journey, supported by operations, creative work, enterprise knowledge and AI roles, with people retaining approval and decision authority.')],
  ['How do you determine the right strategy?', B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Must we replace our current CRM, ERP, email and drives?')],
  ['Every project starts with a discovery phase where we analyze your goals, audience, and competitors. Based on this, we craft a custom strategy that aligns with your objectives and maximizes your digital',
    B('不必先假定全部替换。STARGO WORK 的方向是把现有业务账号和资料连接到同一工作空间。具体保留、接入或调整哪些系统，需要结合企业当前软件和权限逐项确认。', 'A complete replacement should not be assumed. STARGO WORK aims to connect existing accounts and information in one workspace. Which systems are retained, integrated or adjusted depends on the enterprise’s software and access permissions.')],
  ['How long does a typical project take?', B('288 个数字员工是什么意思？', 'What does “288 digital employees” mean?')],
  ['Project timelines vary depending on scope. A branding or website project typically takes 4–8 weeks, while marketing campaigns are ongoing with monthly optimization and reporting',
    B('它表示 288 个可按任务选择的专业数字岗位，覆盖十类企业职能，不只外贸销售。每个岗位可配置职责、知识、技能和权限；不是同时运行 288 个员工，也不等于替代 288 名真人。', 'It denotes 288 specialized, task-selectable roles across ten enterprise role groups — not trade sales alone. Roles can be configured with responsibilities, knowledge, skills and access. The number does not represent concurrent workers or replacement of 288 people.')],
  ['Do you work with businesses in any industry?', B('报价、发消息和付款等关键动作谁决定？', 'Who controls consequential actions?')],
  ['Yes! We’ve worked with startups, tech companies, e-commerce brands, real estate firms, and service providers. Our process is adaptable to fit the needs of different industries and audiences',
    B('由企业有权人员决定。AI 可以准备资料、形成草稿和提出建议；报价、对外触达、重要承诺、正式申报和资金支付等事项按企业规则审批。批准、发送和实际结果核对分别处理。', 'Authorized people do. AI can organize information, prepare drafts and recommend next steps. Quotations, outreach, important commitments, official submissions and payments remain subject to enterprise approval rules. Approval, delivery and outcome checks are distinct steps.')],

  /* hero support — the product definition, in the readable introduction rather
     than in the giant brand lettering (V6 §4.1). */
  ['No cookie cutter sites. No empty claims. Only practical tools and smart strategies that drive growth and build brands.',
    B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动找客户，Sales Desk 推进销售；连接 ERP、AI 创作与 288 个跨部门数字岗位，关键决定由企业掌握。', 'A browser-based desktop AI operating system for manufacturers and export teams. Growth OS finds prospects; Sales Desk advances sales. ERP, creative work and 288 cross-functional AI roles support the business, with your team in control.')],

  /* who we are → 288 cross-functional roles (V6 §4.4). The counter card says
     what the number is — a role directory across ten functions, not 288
     things running at once; the ten groups and their counts are on the
     workforce page. */
  ['We shape brands with focus, intention, and impact.', B('288 个数字岗位，不只服务外贸。', '288 specialized AI roles. Across the enterprise.')],
  /* The approval card (V5 H08): AI prepares, an authorized person decides, and
     the three states — approved, sent, received — are never run together. */
  ['Pricing with', B('AI 准备工作，', 'AI prepares the work.')],
  ['complete transparency', B('你批准关键决定。', 'You approve the decision.')],
  ['(Performance Boost)', B('(决定权始终在人)', '(Humans stay in command)')],
  ['Page speed +78%,', B('批准报价，不等于客户已经收到；', 'An approved quote is not a delivered message.')],
  ['Bounce rate -13%', B('提交任务，也不等于结果已经完成。', 'A submitted task is not a verified outcome.')],
  ['View pricing', B('认识数字员工', 'Meet the AI Workforce')],
  ['(Live collaboration)', B('(审批流程示意 · 非真实客户事件)', '(Illustrative approval workflow)')],
  ['Today 17:01', B('步骤 1', 'Step 1')],
  ['Today 17:02', B('步骤 2', 'Step 2')],
  ['Hey hey!', B('报价草稿已整理', 'Quote draft prepared')],
  ['Love the design', B('条款超出规则，依据已附上', 'Terms exceed the rule; evidence attached')],
  ['Can we tweak the hero?', B('请有权人确认', 'Needs an authorized reviewer')],
  ['>Sure<', B('>批准此版本<', '>Approve this version<')],
  ['We’ll update it shortly', B('已保留批准版本', 'Approved version kept')],
  ['Perfect! Thank you.', B('是否对外发送，另行确认。', 'Sending is confirmed separately.')],

  /* marquee — five verbs along the business journey (V6 §4.5); no product
     names and no feature lists inside the letter-by-letter animation. */
  ['Built Different', B('找到客户。', 'Find prospects.')],
  ['Design with purpose', B('理解需求。', 'Understand needs.')],
  ['Code with passion', B('推进订单。', 'Advance orders.')],
  ['Create with vision', B('制作内容。', 'Create content.')],
  ['Innovate always', B('协同经营。', 'Coordinate work.')],
  ['(Our Vision)', B('(一条业务主线)', '(One business journey)')],
  ['(Scroll for more)', B('(继续滚动)', '(Keep scrolling)')],

  /* services → the five macro stages (descriptions; titles come from the domain labels below) */
  ['We create scroll-stopping social content designed to build brand presence and drive engagement.', LOOP_DESC[1]],
  ['We craft cohesive brand identities that communicate purpose, personality, and credibility.', LOOP_DESC[3]],
  ['We develop strategic marketing assets that amplify brand reach and support growth.', LOOP_DESC[4]],

  /* pricing block → fragmented vs connected work (V5 H10, V6 §4.10). It
     compares how work is organized — five kinds of work, the scattered way and
     the connected way — not "hire people" against "buy AI". */
  ['Choose the plan that fits you best.', B('目的不是简单地“加人”或“换掉人”，而是减少重复工作和业务断点。', 'The goal is not simply to add or replace people, but to reduce repetitive work and disconnected handoffs.')],
  ['>Starter<', B('>分散的做法<', '>Fragmented work<')],
  ['Built for early-stage teams establishing their online presence.', B('同一个客户的信息，可能散在邮箱、聊天窗口、表格和订单系统里。', 'One customer’s information can be scattered across email, messages, spreadsheets and order systems.')],
  ['$2,000', B('靠人传', 'By hand')],
  ['Tailored website layouts', B('获客：人工分散检索、反复筛选', 'Prospecting: separate manual searches, screened again and again')],
  ['Core SEO configuration', B('销售：消息与文件分开', 'Sales: messages and files kept apart')],
  ['Mobile-first responsive design', B('经营：销售逐个追问后台', 'Operations: sales chases the back office one by one')],
  ['Brand-ready UI framework', B('内容：多个工具来回交接', 'Content: handoffs between disconnected tools')],
  ['Ideal for new launches and rebrands', B('管理：逐个询问谁做到哪里', 'Management: asking each person where the work stands')],
  ['>Growth<', B('>STARGO WORK<', '>STARGO WORK<')],
  ['Designed for businesses ready to elevate their digital experience.', B('让同一个客户、同一笔订单和下一步任务，始终接得上。', 'Keep the customer, the order and the next action connected.')],
  ['$4,000', B('连起来', 'Connected')],
  ['High-end design with smooth interactions', B('获客：客户证据、开发优先级与下一步', 'Prospecting: evidence, priorities and next steps kept together')],
  ['Complete on-site SEO setup', B('销售：客户背景、回复和报价连续承接', 'Sales: customer context, replies and quotes carried forward')],
  ['Adaptive layouts for every screen', B('经营：订单、交期、付款与服务接力', 'Operations: orders, lead times, payments and service handed on')],
  ['CMS setup for content or case studies', B('内容：产品资料、品牌、素材与版本统一组织', 'Content: product facts, brand, assets and versions organized together')],
  ['Performance tuning &amp; optimization', B('管理：看责任、看阻塞、看审批、核对结果', 'Management: owners, blockers, approvals and checked results')],
  ['1-2 weeks', B('反复复制粘贴', 'repeated copying')],
  ['2-3 weeks', B('连续推进', 'continuous progress')],
  ['(Looking for more?)', B('(从哪里开始？)', '(Where to start?)')],
  ['Expand your scope with marketing, SEO, or content creation.', B('先跑通一件事，再扩大到整个企业。你最想先改善的，是找客户、询盘跟进、报价、订单交付，还是营销内容？', 'Start with one workflow. Expand with verified results. Is your priority prospecting, inquiry follow-up, quotation, order delivery or marketing content?')],

  /* work cards → the problem (V5 H03, V6 §4.2): the same four pictures — email,
     chat, spreadsheet, ERP — each with the short title of what goes wrong
     there. The full explanation is in the business journey that follows. The
     heading is V6's 「工具很多，业务却还在靠人连接」 cut to the old heading's
     nine characters: the column holds three a line between 768 and 1024px,
     and the full sentence stood six lines tall there. */
  ['(Portfolio 26©)', B('(缺的从来不是一个软件)', '(The problem was never a missing tool)')],
  ['<h2 class="h2">Work<span class="small-ftd">(4)</span></h2>', B('<h2 class="h2">工具很多，靠人连接<span class="small-ftd">(4)</span></h2>', '<h2 class="h2">Many tools. Too many manual handoffs.<span class="small-ftd">(4)</span></h2>')],
  ['Forma Digital', B('询盘来了，还要重新整理', 'Email inquiries still need organizing')],
  ['One Step', B('窗口很多，客户信息分散', 'Chats span windows; context is scattered')],
  ['Nero Vision', B('客户在表格，跟进靠人记', 'Customers in sheets, follow-up by memory')],
  ['Bold Moves', B('订单在后台，销售还在追问', 'Orders in the back office; sales still chasing')],
  ['View all work', B('看业务怎么接起来', 'See how the work connects')],

  /* blog cards: the template's four-card grid, filled from BLOG (build-site.mjs) */
  ['Smart insights.', B('最新文章。', 'Latest articles.')],
  ['>See all<', B('>全部文章<', '>All articles<')],

  /* short / global */
  ['>Get started<', B('>聊聊你的流程<', '>Discuss your workflow<')],
  ['>Book a call<', B('>预约企业演示<', '>Request a Demo<')],
  ['>Contact us<', B('>预约企业演示<', '>Request a Demo<')],
  ['Let&#x27;s talk', B('预约企业演示', 'Request a Demo')],
  ['Scroll Down', B('向下滚动', 'Scroll down')],
  ['(Who we are)', B('(288 个数字岗位)', '(288 AI roles)')],
  ['(Team of experts)', B('(岗位目录 · 非同时运行)', '(A role directory, not concurrent runs)')],
  ['(Services)', B('(一条业务主线 · 五个阶段)', '(One business journey · five stages)')],
  ['(Pricing)', B('(两种工作方式)', '(Two ways of working)')],
  ['(FAQ)', B('(常见问题)', '(FAQ)')],
  ['(Testimonials)', B('(四个示例场景 · 非客户评价)', '(Four illustrative scenarios · not customer reviews)')],
  ['(Success stories)', B('(企业版)', '(Enterprise)')],
  ['(Stats)', B('(定价 · AI 层级)', '(Pricing · the AI ladder)')],
  ['(Blog)', B('(博客)', '(Blog)')],
  ['(Project)', B('(工作方式)', '(how work moves)')],
  ['What&#x27;s included:', B('工作：', 'The work:')],
  ['Timeline:', B('结果：', 'The result:')],
  ['Pick Smart.', B('少一些复制粘贴。', 'Less copying.')],
  ['Pay Less.', B('多一些连续推进。', 'More continuity.')],
  ['Build Better.', B('差别在连接。', 'Connected work.')],
  ['Web Design', LOOP_LABELS[0]],
  ['Social Media', LOOP_LABELS[1]],
  ['Development', LOOP_LABELS[2]],
  ['Brand Identity', LOOP_LABELS[3]],
  ['>Marketing<', B(`>${LOOP_LABELS[4].zh}<`, `>${LOOP_LABELS[4].en}<`)],
  ['Showreel 26©', HOME_THEATRE],
  ['+13', B('288', '288')],
  ['team members', B('个专业数字岗位', 'specialized AI roles')],
  ['across the', B('覆盖', 'across')],
  ['>World<', B('>十类企业职能<', '>ten enterprise functions<')],
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
/** The template's flip-card logo wall. Real logos in assets/brands/ replace the
    sample marks.

    The owner asked for the wall's two sample labels to go (2026-09-10):
    「不要写下面logo示例(合作伙伴墙 · 示例) 示意 Logo · 非真实客户这些全部删掉」.
    So `captionSample` is empty — the wall carries no caption at all until real
    logos are dropped in, at which point `caption` takes over. Empty rather than
    a neutral word on purpose: with the template's own eight marks still in the
    grid, any caption at all would be a claim about them, and the claim would
    not be true. The disclosure on the notices page (tools/copy.mjs, the
    imagery paragraph) still names the sample logo wall and is left alone —
    that page is where it belongs. */
export const HOME_BRAND_WALL = {
  caption: B('(我们服务过的品牌)', '(Brands we have served)'),
  captionSample: B('', ''),
  year: B('2026©', '2026©'),
};
/* The nine steps (V5 P02 「九步细看」, V6 §5). They are the detailed reading of
   the same business journey the homepage shows as five stages — acquisition,
   sales, delivery, collection and service, repeat business — not a second
   system, and the capability page says so beside them (`note`, drawn in the
   orbit block's left column; `lede` is the full sentence). Every row is
   [code, what happens, the point, group]: the code is the stage word the
   blocks key on, the point is what renok's two-line insight slot prints, and
   the group is the catalogue group (#gNN) the row links to. Business language
   only — no engine or module names. */
export const HOME_LOOP_TABLE = {
  caption: B('(九步细看)', '(The detailed business sequence)'),
  /* rk-award draws this as three display lines — 一条业务 / 主线 on the Chinese
     page — and asserts the Chinese title, so a change here means re-splitting
     it there. The English title's last word is the italic line; renok's 3-D
     cursor sits just past where a four-letter word ends ("/loop" before), and
     "/journey" ran under it at 1440, so the word is "flow". */
  title: B('一条业务主线', 'One business flow'),
  headers: [B('(步骤)', '(Step)'), B('(发生什么)', '(What happens)'), B('(要点)', '(The point)')],
  button: B('看每一步对应的能力组', 'See the capability group behind each step'),
  /* The stage word each row leads with, in Chinese, for the blocks whose largest
     type is that word: the Chinese page shows Chinese only. */
  stageNames: { DISCOVER: '发现', QUALIFY: '筛选', ENGAGE: '触达', UNDERSTAND: '理解', RESPOND: '回复', QUOTE: '报价', EXECUTE: '执行', 'FOLLOW-UP': '跟进', LEARN: '学习' },
  lede: B(
    '九步用于解释具体销售动作；首页五个阶段用于浏览经营全景。两者是同一条业务链的不同阅读深度，不是两套系统。',
    'The nine steps explain detailed sales actions. The five homepage stages give the operating overview. They are different levels of the same business journey, not separate systems.'),
  note: B(
    '与首页五个阶段是同一条业务主线，这里分九步细看，不是两套系统。',
    'The homepage’s five stages, read here in nine detailed steps — one business journey, not two systems.'),
  rows: [
    ['01 · DISCOVER', B('发现目标客户。围绕产品、目标市场和客户类型，从搜索、企业官网、地图、社交平台、展会及依法授权的贸易数据中寻找经销商、进口商与目标企业。', 'Discover target accounts. Around your products, markets and buyer types, find dealers, importers and target companies through search, websites, maps, social channels, trade shows and lawfully authorized trade data.'),
      B('围绕产品与目标市场，主动找到值得开发的企业。', 'Find companies worth developing around your products and markets.'), '02'],
    ['02 · QUALIFY', B('判断谁值得开发。综合产品匹配、市场适配、采购信号、联系人覆盖、风险和商业价值，形成客户画像、商机简报与开发优先级；证据不足时标注待核实。', 'Decide who is worth developing. Combine product fit, market fit, buying signals, contact coverage, risk and commercial value into account profiles, opportunity briefs and priorities; weak evidence is flagged for checking.'),
      B('结合采购信号与背调判断机会；证据不足先核实，不猜。', 'Qualify with buying signals and research; weak evidence is checked, not guessed.'), '02'],
    ['03 · ENGAGE', B('开始联系。准备多语言开发邮件、沟通话术与跟进计划，经确认后按授权渠道触达；确认的客户连同背调与下一步任务转入 Sales Desk。', 'Start the conversation. Prepare multilingual emails, messaging and follow-up plans, reach out through authorized channels once approved, and hand approved prospects to Sales Desk with their research and next actions.'),
      B('开发计划确认后，再按授权渠道联系客户。', 'Once the plan is approved, reach out through authorized channels.'), '03'],
    ['04 · UNDERSTAND', B('理解客户要什么。邮件、网站、WhatsApp 与阿里国际站等渠道的询盘进入同一入口，识别产品、规格、数量、交期和缺失信息，并更新客户全景。', 'Understand what the customer needs. Inquiries from email, the website, WhatsApp, Alibaba.com and other channels arrive in one intake; products, specifications, quantities, deadlines and missing details are identified and the customer record is updated.'),
      B('询盘与主动开发的客户进入 Sales Desk，需求汇在一处。', 'Prospects and inquiries meet in Sales Desk, with requirements in one place.'), '04'],
    ['05 · RESPOND', B('有依据地回复。查询产品参数、价格政策、MOQ、包装、认证与交期，辅助产品匹配和多语言回复；缺少真实资料时明确提示，重要回复由人审核或接管。', 'Reply with evidence. Check specifications, pricing policy, MOQ, packaging, certifications and lead times to support product matching and multilingual replies; missing facts are flagged, and important replies are reviewed or taken over by a person.'),
      B('依据企业确认的资料起草回复；缺资料就标出，由人复核。', 'Draft replies from verified company facts; gaps are flagged and a person reviews.'), '04'],
    ['06 · QUOTE', B('按规则报价。按产品配置、数量、包装、币种和贸易条款准备报价草稿，关联价格表、历史报价、折扣权限与利润边界；批准后形成 PI，批准不等于已经发送。', 'Quote within the rules. Draft from product configuration, quantity, packaging, currency and trade terms, using approved pricebooks, quote history, discount permissions and margin limits; the PI follows approval, and approval is not sending.'),
      B('按价格规则与利润边界起草报价，批准后再转 PI。', 'Quote within pricing rules and margin limits; the PI follows approval.'), '07'],
    ['07 · EXECUTE', B('让后台接住订单。衔接产品物料、采购、库存、生产质检、包装发货，以及商业发票、装箱单、原产地证资料、提单与认证资料；正式签发与申报由相应机构办理。', 'Carry the order into operations. Connect materials, purchasing, stock, production and quality, packing and shipment, plus commercial invoices, packing lists, origin materials, bills of lading and certifications; official issuance and filing stay with the relevant authorities.'),
      B('订单交给 ERP 与履约：物料、生产、质检、单证与发货。', 'Hand the order to ERP and fulfilment: materials, production, QC, documents, shipment.'), '08'],
    ['08 · FOLLOW-UP', B('持续跟进。跟踪订金、尾款与对账提醒，协同物流、售后、保修与备件，整理经销商历史订单与补货机会，唤醒沉睡客户；资金支付由有权人员决定。', 'Keep following up. Track deposits, balances and reconciliation reminders, coordinate logistics, service, warranty and spare parts, and surface dealer reorder and reactivation opportunities; payments remain with authorized people.'),
      B('付款节点、售后与补货机会，每个下一步都有负责人。', 'Payments, service and reorders, each next step with an owner.'), '05'],
    ['09 · LEARN', B('从结果中改进。记录成交与未成交的原因、有效的开发方式和被接受的报价，形成候选改进，经测试与批准后再采用，效果不足可以撤回。', 'Improve from outcomes. Record why deals were won or lost, which outreach worked and which quotes were accepted, then test and approve candidate improvements before adoption — and withdraw them if they fall short.'),
      B('复盘成交与未成交的原因，改进先验证再采用。', 'Review wins and losses; improvements are tested before adoption.'), '14'],
  ],
};

/** Scalora fragments on the homepage. */
export const HOME_SC_HERO = [
  /* #loop — the business journey starts with finding the customer, not with an
     inquiry arriving (V5 H04, V6 §4.3). The heading's last word rotates
     through three later stages; the template's fourth word repeats the first
     so the loop closes. The floating cards name the two engines first, mark
     quotation as part of Sales Desk, and let the rest say what supports the
     journey — not six separate systems. */
  ['All in one ecosystem for your business', B('(为制造业与外贸企业而建)', '(For manufacturing &amp; global trade)')],
  ['The platform that ', B('先找客户，', 'Find the customer. ')],
  ['helps you', B('再推进到', 'Carry it through to')],
  ['Build.', B('报价。', 'quotes.'), { count: 2 }],
  ['Scale.', B('履约。', 'delivery.')],
  ['Operate.', B('复购。', 'repeat orders.')],
  ['Scalora is a business platform designed to help teams manage marketing, operations, and growth from one workspace.',
    B('Growth OS 负责发现目标客户、查清背景和判断商机；确认后转入 Sales Desk，继续沟通、匹配产品、报价和跟进订单。ERP、内容生产与数字员工团队，围绕同一条业务主线协作。', 'Growth OS finds accounts, researches the buyer and qualifies the opportunity. Approved prospects move into Sales Desk for conversations, product matching, quotations and order follow-through, supported by operations, creative work and AI teams.')],
  ['Get started free', B('预约企业演示', 'Request a Demo'), { count: 2 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Growth OS<', '>Growth OS<'), { nth: 0 }],
  ['>CRM platform<', B('>主动发现并判断客户<', '>Find and qualify accounts<'), { nth: 0 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Sales Desk<', '>Sales Desk<'), { nth: 0 }],
  ['>CRM platform<', B('>确认后的客户继续推进<', '>Approved prospects, carried forward<'), { nth: 0 }],
  ['Scalora Ops', B('报价与 PI', 'Quotes &amp; PI')],
  ['Product 01', B('Sales Desk 的商务环节', 'Part of Sales Desk')],
  ['AI Writing Tool', B('ERP 与履约', 'ERP &amp; delivery')],
  ['Mentoor', B('AI 创作', 'AI creative')],
  ['AI Sales Agent', B('数字员工团队', 'AI teams')],
  ['Hero Card Icon', B('卡片图标', 'Card icon')],
];
/* The four product slots (V6 §4.7): two core engines — Growth OS and Sales
   Desk — and two business areas they are connected to — ERP and AI creative.
   Quotations and PI stay inside Sales Desk here and have their own section on
   the capability page; fulfilment is in the five stages and the ERP detail.
   Each paragraph ends with that slot's own availability line.

   tools/build-site.mjs picks each slot's picture by the start of its name, so
   a name must keep starting with Growth OS / Sales Desk / ERP / AI 创作 /
   AI Creative. Desktop tabs and the phone cards are both filled from here. */
export const HOME_SC_PRODUCTS = [
  ['Our products', B('(两大引擎 · 两个业务板块)', '(Two engines · two business areas)')],
  ['Meet the Scalora product ecosystem', B('两大业务引擎，连接经营与创作', 'Two core engines, connected to operations and creative work')],
  ['Scalora CRM', B('Growth OS · 主动获客', 'Growth OS · Prospecting')],
  ['Scalora Marketing', B('Sales Desk · 外贸闭环', 'Sales Desk · Trade sales')],
  ['Scalora Docs', B('ERP · 企业经营', 'ERP · Operations')],
  ['Scalora Ops', B('AI 创作 · 图片与视频', 'AI Creative · Images &amp; video')],
  ['Manage leads, automate follow-ups, track deals, and close faster with a smart, visual CRM built for modern sales teams.',
    B('发现目标企业，查清公司与联系人，分析采购信号与开发优先级。确认后，将背调、产品兴趣和下一步任务交给 Sales Desk。真实数据与客户触达按授权接入。', 'Discover target accounts, research companies and contacts, and assess buying signals. Pass approved prospects, product interests and next actions to Sales Desk. Live data and outreach require authorization.')],
  ['Plan, launch, and optimize campaigns across email, ads, and landing pages — all tracked in one dashboard.',
    B('承接主动开发客户与渠道询盘，统一 CRM、沟通历史、产品匹配、回复与跟进，衔接报价、审批、PI 和订单交接。渠道收发、价格和业务交接逐项接通与验证。', 'Bring prospects and inquiries into one sales workspace for CRM, customer history, product matching, replies and follow-up, connected to quotations, approvals, PI and order handoffs. Messaging, price sources and business handoffs require individual integration and validation.')],
  ['Create, manage, and collaborate on documentation, SOPs, and internal knowledge in one flexible workspace.',
    B('将客户需求衔接到产品物料、采购、库存、生产质检、订单发票和商城业务，让销售知道能不能交、何时交、哪些环节还在等待。按企业使用的经营系统配置协同范围。', 'Connect demand with products, materials, purchasing, inventory, production, quality, orders, invoices and commerce so sales can understand availability, lead times and outstanding work. Coordination depends on the operating systems configured for the enterprise.')],
  ['Build workflows that connect your teams, data, and tools — without complex integrations.',
    B('围绕真实产品与品牌资料组织主图、场景图、详情页、图册和多语言内容；进一步衔接视频制作与爆款结构原创改编。创意工作室已有基础；一键成片与爆款再创作持续建设。', 'Build product images, scenes, detail pages, catalogs and multilingual content from verified product and brand information, with evolving video-production and creative-adaptation workflows. The creative workspace has foundations; one-click video and viral adaptation are still developing.')],
  ['Dashbord Image', B('界面示意图', 'Interface illustration')],
];
/* The channel band (V5 H09, V6 §4.8): three different uses — finding
   customers, carrying conversations, publishing content — and no promise
   that a platform on the diagram is switched on. */
export const HOME_SC_INTEGRATION = [
  ['Integration Icon', B('渠道图标', 'Channel icon')],
  ['>Integration<', B('>(发现客户 · 承接沟通 · 内容传播)<', '>(Discover · Converse · Publish)<')],
  ['One AI Engine. Fully Connected.', B('渠道可以不同，业务不必断开。', 'Different channels. A connected business context.')],
  ['Scalora connects your CRM, website, ads, and commerce tools into one intelligent automation system.',
    B('找客户的信息来源、与客户沟通的渠道、发布内容的平台，各司其职。STARGO WORK 在企业授权与已接入范围内，把相关信息交给同一套客户、销售与跟进流程。显示平台名称不表示所有渠道默认开通，也不表示具备全部收发权限。', 'Research sources, conversation channels and publishing platforms serve different purposes. Within authorized integrations, STARGO WORK connects their activity to shared customer, sales and follow-up workflows. A listed platform is not a promise of default access or full read-and-write permissions.')],
];

/* ====================================================== lifelogx pages === */

/** Shared slot originals of the lifelogx homepage, with two different fills. */
const LX_TAGS = { CARDS: B('客户', 'Customer'), transfers: B('报价', 'Quote'), financing: B('订单', 'Order') };

export const LX_INTELLIGENCE = {
  heroWord: B('智能层', 'Intelligence'),
  store1: { name: B('企业本体', 'Ontology'), sub: B('给 AI 一份企业模型', 'Give AI a model of your business'), href: '#lx-ontology' },
  store2: { name: B('进化', 'Evolution'), sub: B('可治理的自我进化', 'Governed self-evolution'), href: '#lx-evolution' },
  heroDesc: B('不是聊天机器人，是运营层。', 'Not a chatbot. An operating layer.'),
  tags: LX_TAGS,
  features: [
    /* The three animated cards are fixed-height boxes (24rem / 21.5rem / 21.5rem) that
       hold about four, three and three lines at the template's 2rem type. */
    { title: B('企业本体', 'Ontology'), text: B('客户、询盘、报价、订单，都成为 AI 能读懂、能操作的对象。', 'Customers, quotes and orders become objects AI can act on.') },
    { title: B('前置部署', 'Embedded FDE'), text: B('软件适应企业，而不是反过来。', 'Software adapts to your business, not the reverse.') },
    { title: B('主动执行', 'Proactive'), text: B('不等提问。按事件和目标运行，在权限内行事。', 'Runs on events and goals; acts within its authority.') },
  ],
  cards: [
    { title: B('客户', 'Customer'), text: B('是谁、来自哪个市场、买过什么、正在谈什么、谁负责、下一步是什么。', 'Who they are, which market, what they bought, what is being discussed, who owns it, what comes next.') },
    { title: B('询盘', 'Inquiry'), text: B('来源、意图、需求、风险信号、关联的客户与产品，以及下一步该转成什么对象。', 'Source, intent, requirement, risk signals, the customer and product it links to, and the next object it should become.') },
    { title: B('报价', 'Quote'), text: B('出自哪次询盘、哪个配置、哪条价格规则，有没有越过利润护栏，谁批的。', 'Which inquiry it came from, which configuration, which pricing rule, whether it crossed a margin guardrail, who approved it.') },
    { title: B('订单', 'Order'), text: B('出自哪次报价、走到哪个阶段、款到没到、单证备齐了哪些、哪些操作要过审批。', 'Which quote it came from, what stage it is at, whether it is paid, which documents exist, which operations need approval.') },
    { title: B('出货', 'Shipment'), text: B('生产、QC、包装、提单、原产地证、Form E、认证资料——一个对象，一条链。', 'Production, QC, packing, bill of lading, certificate of origin, Form E, certifications — one object, one chain.') },
    { title: B('任务', 'Task'), text: B('目标、待办、状态、负责人、证据、审批、失败与恢复。执行中断，系统也知道做到了哪一步。', 'Goal, to-dos, state, owner, evidence, approval, failure and recovery — even when interrupted, the system knows where it is.') },
    { title: B('AI 员工', 'Agent'), text: B('岗位、目标、技能、工具、记忆、企业知识、权限、任务与执行证据。', 'Role, goal, skills, tools, memory, enterprise knowledge, permissions, tasks and execution evidence.') },
  ],
  gradient: [B('观察真实流程', 'Observe the real workflow'), B('给运营建模', 'Model the operation'), B('把 AI 放进流程', 'Deploy AI into the workflow'), B('用结果改进平台', 'Improve the platform')],
  bigText: B('主动，不是被动', 'Proactive by design'),
  bubbles: [
    B('重点客户三天没回音。', 'A key account has gone quiet for three days.'),
    B('老客户可能进入补货周期。', 'An old customer may be entering a reorder cycle.'),
    B('新进口商开始出现采购信号。', 'A new importer starts showing buying signals.'),
    B('报价发出去了，没有下文。', 'A quote went out and nothing came back.'),
    B('订单即将走到下一个节点。', 'An order is about to hit its next milestone.'),
    B('跟进 AI 员工', 'Follow-up Agent'),
    B('某个产品在某个市场的搜索需求突然上升。', 'A product suddenly gets more search demand in one market.'),
    B('客户问了知识库答不上来的问题。', 'A customer asks something the knowledge base can’t answer.'),
    B('市场信号 AI 员工', 'Market Signal Agent'),
    B('发现变化 → 判断重要性 → 生成任务', 'Spot the change → judge it → create the task'),
    B('调动合适的 AI 员工 → 执行 → 该审批的提审批', 'Mobilise the right agents → execute → ask for approval'),
    B('调度中枢', 'Orchestrator'),
  ],
  words: [B('不再', 'No'), B('等提示', 'prompting'), B('等回复', 'waiting'), B('丢上下文', 'forgetting')],
  feat2Title: B('288 个 AI 员工。', '288 AI Employees.'),
  feat2Sub: B('同一份企业现实。', 'One shared business reality.'),
  feat2Card: { title: B('AI 员工团队', 'Agent Teams'), text: B('一项复杂任务，可同时调用市场研究、客户调查、产品、销售、报价、合规、内容和订单 AI 员工，彼此交换上下文、任务和结果。这是数字团队，不是聊天框。', 'One complex task can call research, account, product, sales, quote, compliance, content and order agents at once; they exchange context, tasks and results. A digital team, not a chatbox.') },
  feat2Button: { label: B('认识 AI 员工', 'Meet the workforce'), href: 'workforce.html' },
  feat2Lines: [B('长任务执行', 'Long-horizon execution'), B('数小时、数天、数周', 'Hours, days, weeks'), B('中断后仍知道下一步', 'Knows the next step after a break')],
  ctaTitle: B('公司本身就是模型。', 'The company becomes the model.'),
  ctaSub: B('可治理的自我进化', 'Governed self-evolution'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('每次执行都留下记录：做了什么、结果如何、人在哪里改过。系统据此提出候选的提示词、技能或流程改动，先在小范围与现行版本比对，通过评估和审批才发布，否则回滚。模型权重不会自行重训。', 'Every run leaves a record: what was done, how it turned out, where a person corrected it. From that the system proposes a candidate prompt, skill or workflow change, compares it against the current one on a small slice, and releases it only after evaluation and approval — otherwise it rolls back. Model weights are not retrained on their own.'),
};

export const LX_WORKFORCE = {
  heroWord: B('数字员工', 'AI Workforce'),
  store1: { name: B('288 位 AI 员工', '288 AI Employees'), sub: B('每一个都有岗位', 'Every one of them has a job'), href: '#lx-teams' },
  store2: { name: B('定价', 'Pricing'), sub: B('从企业需要的层级开始', 'Start at the level you need'), href: 'pricing.html' },
  heroDesc: B('AI 团队已经上线。', 'Your AI team is already online.'),
  tags: LX_TAGS,
  features: [
    { title: B('有岗位', 'Has a job'), text: B('岗位、目标、知识、工具、权限、执行记录，不从空白提示开始。', 'Role, goal, tools, permissions, record. Never a blank prompt.') },
    { title: B('秒级组队', 'Instant teams'), text: B('一个目标，秒级组队，AI 员工并行开工。', 'One goal forms an agent team that runs in parallel.') },
    { title: B('随处工作', 'Works anywhere'), text: B('云端运行，办公室、工厂、展会、机场都能用。', 'Cloud-based: office, factory, trade show or airport.') },
  ],
  cards: [
    { title: B('市场研究 AI 员工', 'Market Research Agent'), text: B('目标市场、需求变化、竞争格局。', 'Target markets, demand shifts, competitive landscape.') },
    { title: B('进口商情报 AI 员工', 'Importer Intelligence Agent'), text: B('谁在进口、多久一次、什么时候补货。', 'Who imports, how often, when they reorder.') },
    { title: B('经销商发现 AI 员工', 'Dealer Discovery Agent'), text: B('经销商网络、Google Maps、区域机会。', 'Dealer networks, Google Maps, regional opportunities.') },
    { title: B('决策链 AI 员工', 'Buying Committee Agent'), text: B('谁研究、谁推荐、谁拍板。', 'Who researches, who recommends, who decides.') },
    { title: B('产品匹配 AI 员工', 'Product Matching Agent'), text: B('从需求匹配到产品配置和参数。', 'From requirement to product configuration and specs.') },
    { title: B('报价 AI 员工', 'Quote Agent'), text: B('报价草稿、价格规则、利润护栏。', 'Quote drafts, pricing rules, margin guardrails.') },
    { title: B('跟进 AI 员工', 'Follow-up Agent'), text: B('一个客户都不会忘。', 'Never forgets a customer.') },
  ],
  gradient: [B('云端工作空间', 'Cloud workspace'), B('桌面完整工作台', 'Desktop workspace'), B('移动端查看与审批', 'Mobile review and approval'), B('永远在线的 AI 员工', 'Always-on agents')],
  bigText: B('把工作交给 AI，权力留在企业', 'Delegate the work. Keep the authority.'),
  bubbles: [
    B('价格', 'Price'), B('利润', 'Margin'), B('正式报价', 'Formal quote'), B('PI', 'PI'), B('重要客户回复', 'Key customer reply'),
    B('审批闸门', 'Approval Gate'),
    B('关键业务动作', 'Critical business action'), B('对外付款', 'Outbound payment'), B('合同条款', 'Contract terms'),
    B('人掌权', 'Humans keep authority'), B('AI 干活', 'AI does the work'), B('人在环中', 'Human-in-the-Loop'),
  ],
  words: [B('不再', 'No'), B('空白提示', 'blank prompts'), B('丢上下文', 'lost context'), B('夜里停工', 'idle nights')],
  feat2Title: B('合上笔记本，公司不会停。', 'Your company doesn’t stop when you close your laptop.'),
  feat2Sub: B('定时运行，事件触发。', 'Scheduled routines. Event-driven agents.'),
  feat2Card: { title: B('调度中枢', 'Orchestrator'), text: B('并行干活，汇总结果，只把需要人拍板的交回来。你离开电脑，AI 员工照样执行已授权的任务；客户、订单或市场一有变化，自动启动。', 'Parallel work, consolidated results, only the human decisions handed back. Agents keep running authorised tasks after you leave the desk and start automatically when a customer, order or market state changes.') },
  feat2Button: { label: B('查看定价', 'See pricing'), href: 'pricing.html' },
  feat2Lines: [B('定时例行任务', 'Scheduled Routines'), B('事件驱动 AI 员工', 'Event-Driven Agents'), B('永远在线', 'Always-On')],
  ctaTitle: B('别买 AI 工具。', 'Don’t hire AI tools.'),
  ctaSub: B('建立 AI 产能。', 'Build AI capacity.'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('288 位 AI 员工。一家云端公司。', '288 AI Employees. One Cloud Company.'),
};

/* ============================================================= pricing === */

export const PRICING = {
  caption: B('(定价)', '(Pricing)'),
  title: B('同一套系统，选合适的<span class="sub-title-text">支持层级</span>。', 'One system. The right <span class="sub-title-text">level of support</span>.'),
  toggleA: B('首年价格', 'First-year total'),
  toggleB: B('续费', 'Renewal'),
  tabs: [B('平台方案', 'Software & launch'), B('获客与企业', 'Growth & enterprise')],
  unitYear: B('/ 年', '/ year'),
  unitFirst: B('/ 首年', '/ first year total'),
  renewalPrice: B('联系我们', 'Ask us'),
  panes: [
    [
      { name: B('标准版', 'Standard'), price: '¥10,000', unit: 'year', renewal: '¥10,000',
        desc: B('适合想自己把 AI 用进外贸流程的团队。', 'For teams that want to run their own AI-assisted export workflow.'),
        cta: B('了解标准版', 'Discuss Standard'),
        items: [B('12 个月云端工作台，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'), B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for company knowledge, FAQ and up to 20 SKUs'), B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quotation and CRM workflows'), B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'), B('年度标准 AI 额度，配置一次、培训一次', 'Standard annual AI credits, one setup session and one training session')] },
      { name: B('上线版', 'Launch'), price: '¥20,000', unit: 'first', renewal: 'ask',
        desc: B('适合需要官网和第一套外贸销售素材的制造企业。', 'For manufacturers that need a website and a first set of export sales assets.'),
        cta: B('了解上线版', 'Discuss Launch'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 3 个核心页面与 20 个 SKU 模板页', 'A website with 3 core pages and 20 SKU template pages'), B('中英文官网内容', 'Chinese and English website content'), B('20 个 SKU 的图片内容与 10 条实拍短视频', 'An image-content set for 20 SKUs and 10 short videos'), B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds')] },
      { name: B('增长版', 'Growth'), price: '¥30,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合要扩产品展示、加语种、提升搜索可见度的团队。', 'For teams expanding product presentation, languages and search visibility.'),
        cta: B('了解增长版', 'Discuss Growth'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 4 个核心页面与 40 个 SKU 模板页', 'A website with 4 core pages and 40 SKU template pages'), B('中英文，另加 3 个语种', 'Chinese and English plus 3 further languages'), B('40 个 SKU 的图片内容、20 条实拍短视频与 10 条 AI 视频', 'An image-content set for 40 SKUs, 20 short videos and 10 AI videos'), B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure within the agreed scope')] },
    ],
    [
      { name: B('全球获客版', 'Global Acquisition'), price: '¥40,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合再加三个月配置后 AI 获客运行的团队。', 'For teams adding three months of configured AI acquisition operation.'),
        cta: B('了解全球获客版', 'Discuss Global Acquisition'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 5 个核心页面与 80 个 SKU 模板页', 'A website with 5 core pages and 80 SKU template pages'), B('官网与 SKU 文字系统翻译成 18 种语言', 'Website and SKU text in 18 system-translated languages'), B('80 个 SKU 的图片内容、50 条实拍短视频与 20 条 AI 视频', 'An image-content set for 80 SKUs, 50 short videos and 20 AI videos'), B('三个月配置后 AI 获客运行与 3 份月报', 'Three months of configured AI acquisition operation and 3 monthly reports')] },
      { name: B('企业版', 'Enterprise'), price: B('定制', 'Custom'), unit: 'none', renewal: 'custom',
        desc: B('多部门、多公司、多品牌、多账号，以及更复杂的审批与系统接入。', 'Multiple departments, companies, brands and accounts, with complex approvals and system integration.'),
        cta: B('联系企业版团队', 'Talk to STARGO Enterprise'),
        items: [B('大量 AI 员工与复杂审批', 'Large AI workforce and complex approval'), B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'), B('自定义工作流 · 专属 AI 员工 · 专属前置部署工程师', 'Custom workflows · dedicated agents · dedicated FDE'), B('私有化部署', 'Private deployment'), B('SLA', 'SLA')] },
      { name: B('从一条流程开始', 'Start with one workflow'), price: B('演示', 'Demo'), unit: 'demo', renewal: 'demo',
        desc: B('不确定从哪里开始？告诉我们，眼下最拖效率或增长的是哪条流程。', 'Not sure where to begin? Tell us the one workflow that most affects efficiency or growth.'),
        cta: B('预约演示', 'Book a Demo'),
        items: [B('挑最耗时间、最拖增长的那项工作', 'Pick the work that costs the most time or growth'), B('我们从那里开始', 'We start there'), B('看 AI 在真实流程里怎么干活', 'See AI working in your real process'), B('再决定需要哪一级', 'Then decide which level you need'), B('不必一次改动整个企业', 'No need to change the whole company at once')] },
    ],
  ],
  /* ------------------------------------------- 层级之间的包含关系 ---
     OWNER'S DECISION, 2026-09-15: 「包含 —— 高档位全部继承」.

     THE DEFECT THIS ANSWERS. The levels above are prose. A higher level says
     what it ADDS — 「含标准版年度软件订阅，另加：」 and then its own deliverables —
     and never restates what it already carries, because a price list that
     repeated every lower line would be unreadable. A comparison chart that
     derives a tick by matching a row's sentence against a level's own `items`
     therefore printed a dash wherever a level was merely SILENT, and silence
     read as absence: 上线版's 「基础站内 SEO、一年域名与托管、最多 3 轮修改」 ticked
     one column and dashed four, so the ¥30,000 and ¥40,000 levels stood as
     having no domain, no hosting and no SEO that the ¥20,000 level has — while
     增长版 ticked the SEO row immediately under it. One tier, two opposite
     verdicts, on the same page.

     WHY IT IS WRITTEN HERE, AS DATA. The fix is NOT a looser match in the
     renderer: "nearly the same sentence" is a guess, and a guess cannot be read
     back by the next person. What a level contains is a fact about the product,
     the owner decides it, and it belongs in this file beside the levels it is
     about. So it is one step per pair, and the renderer only follows the steps.

       { level, from }   `level` carries everything `from` carries, and
                         everything `from` in turn carries: the steps compose,
                         so 全球获客版 → 增长版 → 上线版 → 标准版 is the whole
                         ladder in three lines. Both names must be levels of
                         `panes`, in both languages, and `from` must stand
                         BELOW `level` there — inheritance goes up the price
                         list, never down.

     WHAT IT DOES NOT SAY. 企业版 is not in this list. PRICING states no
     inclusion for it — its `items` name a workforce, an integration, a
     deployment and an SLA, and nothing of the four levels below — so it
     inherits nothing and still ticks only the five lines it states itself. An
     inclusion for 企业版 would be a new claim about the product, which is the
     owner's to make in this file, not the chart's to guess.

     THE CROSS-CHECK. The first step restates, as data, what three levels
     already state in words: 上线版, 增长版 and 全球获客版 each open their `items`
     with 「含标准版年度软件订阅，另加：」. tools/blocks/rk-price-compare.mjs asserts
     the two agree — exactly the levels this ladder carries up to 标准版 are the
     levels whose own first sentence says so — so the declaration cannot drift
     from the prose in either direction. */
  inherits: [
    { level: B('上线版', 'Launch'), from: B('标准版', 'Standard') },
    { level: B('增长版', 'Growth'), from: B('上线版', 'Launch') },
    { level: B('全球获客版', 'Global Acquisition'), from: B('增长版', 'Growth') },
  ],
  featuredBadge: B('推荐方案', 'Our recommendation'),
  compareTitle: B('所选方案对比', 'Compare selected plans'),
  compareFeatures: B('能力', 'Capability'),
  comparePlans: [
    { name: B('标准版', 'Standard'), desc: B('自己的 AI 外贸流程', 'Your own AI-assisted export workflow') },
    { name: B('增长版', 'Growth'), desc: B('标准版 + 官网、内容与搜索', 'Standard plus website, content and search') },
    { name: B('全球获客版', 'Global Acquisition'), desc: B('增长版 + 三个月配置后运行', 'Growth plus three months of configured operation') },
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
  /* --------------------------------------------- the comparison matrix ---
     DERIVED, not authored. Every cell below is read out of the five levels'
     own `items` above. Nothing here is a new claim about the product, and
     nothing here may be changed on its own: change a level's `items` and the
     cell that quotes it has to move with it, or the build stops.

     WHY IT EXISTS (owner's decision, 2026-09-15). The levels' items are prose
     carrying different NUMBERS — 「官网 3 个核心页面」 against 「官网 4 个核心页面」
     — so a chart that can only tick or dash a row turns "a bigger number" into
     "does not have it": 增长版 reads as lacking what 上线版 has, and 企业版,
     whose items name none of the website deliverables, stands as a column of
     dashes. So a row that differs by quantity carries the quantity, and only a
     row that is genuinely yes-or-no stays a tick.

     valueRows  one row per quantity. `cells` holds one entry per level, in
                PRICING.panes order:
                  { v, from }  the words the cell shows, and the exact fragment
                               of that level's own items sentence they are read
                               out of. `from` must occur verbatim inside one of
                               that level's items, and every word and number of
                               `v` must occur inside `from`, in order.
                  'custom'     that level is scoped individually, by the
                               declared `customScope` rule below — never by a
                               judgement made in the renderer.
                  null         the capability is not part of that level at all,
                               drawn as the template's own dash. `key` is the
                               word that level's items would have to carry if it
                               did have the capability, and a dash may only be
                               written where `key` is absent from them AND from
                               every level this one inherits.
     tickRows   one row per genuinely yes-or-no line, each one the exact
                sentence a level's items state it in. WHICH levels tick is not
                written here and is never hand-written into this file: it is
                DERIVED, and from exactly two things — the level's own `items`,
                and PRICING.inherits above. A level ticks a line when it states
                that line itself, or when it declares that it contains a level
                which does. Nothing else can put a tick in a cell.
     customScope  THE ONE DECLARED EXCEPTION on a value row (owner's decision,
                2026-09-15: 「写「定制」—— 它本来就是全定制」). A level whose `unit`
                is this rule's `unit` and whose `price` is this rule's `price`
                is not sold by quantity at all: there is no 3 or 4 or 5 to
                state, because its scope is written per company. Such a level
                therefore reads its own price — 定制 / Custom — in every value
                cell, and that is not a number invented out of silence, it is
                the level's own word for what it sells. It is allowed ONLY
                where all four of these hold, and rk-price-compare.mjs checks
                each of them against the level itself:
                  · the level's `unit` is exactly this rule's `unit`;
                  · the level's `price` is exactly this rule's `price`, in both
                    languages, and that price is what the cell prints;
                  · the level's own `items` are SILENT about that row's `key` —
                    the same silence a dash requires. A level that states a
                    quantity has stated it, and 定制 may not be written over it;
                  · it holds on EVERY value row of that level, never on some.
                It does not reach tick rows. A tick is a yes; 定制 is not one,
                so 企业版 still ticks only the five lines its own items state.

     THE RULE THAT GOVERNS ALL OF IT: where a level's items are SILENT about a
     capability, no value and no tick is invented for it — with the two
     exceptions DECLARED above, each of them data in this file that the renderer
     follows rather than a judgement it makes:
       · PRICING.inherits — a level that declares it contains a lower level
         ticks that level's lines. The tick is not invented out of silence; it
         is the declared inheritance being read.
       · compareMatrix.customScope — a level priced 定制 reads 定制 rather than a
         quantity, because that is what its own price says its scope is.
     Outside those two, silence stays a dash. 企业版 declares no inheritance, so
     it dashes the five subscription rows it says nothing about; and no tick
     anywhere is written for a line a level neither states nor inherits.

     tools/blocks/rk-price-compare.mjs draws this chart and asserts every line
     above against PRICING itself — a value that cannot be traced back to a
     level's own sentence, or a tick that traces to neither the level's own
     items nor a declared step of PRICING.inherits, throws the build instead of
     reaching the page. */
  compareMatrix: {
    /* The five priced levels of `panes`, in `panes` order. Asserted against it. */
    tiers: [B('标准版', 'Standard'), B('上线版', 'Launch'), B('增长版', 'Growth'), B('全球获客版', 'Global Acquisition'), B('企业版', 'Enterprise')],
    /* The declared exception, as data: which levels are scoped individually.
       Not a name — a test, so it cannot be a back door for one column. A level
       matching BOTH fields prints its own `price` on every value row; a level
       matching neither may not print it on any. 企业版 is the only level of
       `panes` that matches, and the only way to add another is to price it
       this way here. Written out in full in the comment above. */
    customScope: { unit: 'none', price: B('定制', 'Custom') },
    valueRows: [
      { label: B('官网核心页面', 'Website core pages'), key: B('核心页面', 'core pages'), cells: [
        null,
        { v: B('3', '3'), from: B('3 个核心页面', '3 core pages') },
        { v: B('4', '4'), from: B('4 个核心页面', '4 core pages') },
        { v: B('5', '5'), from: B('5 个核心页面', '5 core pages') },
        'custom'] },
      { label: B('SKU 模板页', 'SKU template pages'), key: B('SKU 模板页', 'SKU template pages'), cells: [
        null,
        { v: B('20', '20'), from: B('20 个 SKU 模板页', '20 SKU template pages') },
        { v: B('40', '40'), from: B('40 个 SKU 模板页', '40 SKU template pages') },
        { v: B('80', '80'), from: B('80 个 SKU 模板页', '80 SKU template pages') },
        'custom'] },
      { label: B('官网语种', 'Website languages'), key: B('官网', 'website'), cells: [
        null,
        { v: B('中英文', 'Chinese and English'), from: B('中英文官网内容', 'Chinese and English website content') },
        { v: B('中英文 + 3 个语种', 'Chinese and English + 3 languages'), from: B('中英文，另加 3 个语种', 'Chinese and English plus 3 further languages') },
        { v: B('18 种语言', '18 languages'), from: B('18 种语言', '18 system-translated languages') },
        'custom'] },
      { label: B('SKU 图片内容', 'SKU image sets'), key: B('图片内容', 'image-content'), cells: [
        null,
        { v: B('20 个', '20'), from: B('20 个 SKU 的图片内容', '20 SKUs') },
        { v: B('40 个', '40'), from: B('40 个 SKU 的图片内容', '40 SKUs') },
        { v: B('80 个', '80'), from: B('80 个 SKU 的图片内容', '80 SKUs') },
        'custom'] },
      { label: B('实拍短视频', 'Filmed short videos'), key: B('实拍短视频', 'short videos'), cells: [
        null,
        { v: B('10 条', '10'), from: B('10 条实拍短视频', '10 short videos') },
        { v: B('20 条', '20'), from: B('20 条实拍短视频', '20 short videos') },
        { v: B('50 条', '50'), from: B('50 条实拍短视频', '50 short videos') },
        'custom'] },
      { label: B('AI 视频', 'AI videos'), key: B('AI 视频', 'AI videos'), cells: [
        null,
        null,
        { v: B('10 条', '10'), from: B('10 条 AI 视频', '10 AI videos') },
        { v: B('20 条', '20'), from: B('20 条 AI 视频', '20 AI videos') },
        'custom'] },
    ],
    tickRows: [
      /* Whose line each row is. Which OTHER columns tick it is not written
         here — it is PRICING.inherits, read forward by the chart.

         标准版's own five lines. 上线版 inherits 标准版, 增长版 inherits 上线版 and
         全球获客版 inherits 增长版, so all four tick these; 企业版 declares no
         inheritance and does not. */
      B('12 个月云端工作台，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'),
      B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for company knowledge, FAQ and up to 20 SKUs'),
      B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quotation and CRM workflows'),
      B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'),
      B('年度标准 AI 额度，配置一次、培训一次', 'Standard annual AI credits, one setup session and one training session'),
      /* 上线版's own line — and so 增长版's and 全球获客版's, up the ladder. This
         is the row the 2026-09-15 decision was made about: it used to tick one
         column and dash four. */
      B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds'),
      /* 增长版's own line, and it continues up to 全球获客版. */
      B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure within the agreed scope'),
      /* 全球获客版's own line. Nothing inherits it: it is the top of the ladder. */
      B('三个月配置后 AI 获客运行与 3 份月报', 'Three months of configured AI acquisition operation and 3 monthly reports'),
      /* 企业版's own five lines, and its only ticks — it inherits nothing, and
         `customScope` buys it no tick anywhere: it reads 定制 on the six value
         rows above and dashes the four levels' lines it does not state. */
      B('大量 AI 员工与复杂审批', 'Large AI workforce and complex approval'),
      B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'),
      B('自定义工作流 · 专属 AI 员工 · 专属前置部署工程师', 'Custom workflows · dedicated agents · dedicated FDE'),
      B('私有化部署', 'Private deployment'),
      B('SLA', 'SLA'),
    ],
  },
  ctaTitle: B('别买 AI 工具。<span class="sub-title-text">建 AI 产能。</span>', 'Don’t hire AI tools. <span class="sub-title-text">Build AI capacity.</span>'),
  ctaDesc: B('288 个 AI 员工，是 STARGO WORK 的 AI 员工能力体系。模型调用、并发、自动任务和第三方服务用量，按方案配置。', '288 AI employees are the STARGO WORK workforce capability system. Model calls, concurrency, automated tasks and third-party usage are configured per plan.'),
  ctaButton: { label: B('认识你的 AI 团队', 'Meet your AI workforce'), href: 'workforce.html' },
  faqCaption: B('(常见问题)', '(Questions and answers)'),
  faqTitle: B('关于定价', 'About pricing'),
  faq: [
    [B('288 个 AI 员工是无限使用吗？', 'Are the 288 AI employees unlimited?'), B('不是。288 说的是能力目录的规模。实际可用范围、在跑的任务、并发、额度和第三方服务用量，以签约配置为准。', 'No. The workforce count describes the capability catalogue. Actual access, active workloads, concurrency, credits and third-party usage depend on the contracted configuration.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('软件订阅按年续费。域名、托管与持续制作，按续费方案或第三方实际费用另算。首年建站与内容服务包，不等于每年都重复交付同样的内容量。', 'The software subscription follows its annual renewal terms. Domain, hosting and ongoing production follow the renewal proposal or the relevant third-party charges. A first-year launch package is not a promise of repeated annual content production.')],
    [B('标准版包含什么？', 'What is in Standard?'), B('12 个月云端工作台（最多 5 个标准用户）、企业知识与产品资料首次导入（最多 20 个 SKU）、询盘与 CRM、报价与人工审批、自助线索发现与写入 CRM、年度标准 AI 额度，外加配置一次、培训一次。', 'Cloud workspace, knowledge base, product data centre, AI employees, inquiry workflow, customer CRM, basic Customer 360, quote workflow, basic content assets, human approval and AI work training.')],
    [B('主动获客只在 ¥40,000 的方案里吗？', 'Is AI acquisition only in the ¥40,000 package?'), B('不是。标准版已经包含自助获客：线索发现、公司画像、评分、触达准备与写入 CRM。全球获客版加的是三个月配置后获客运行与 3 份月报，外加它自己的建站与内容交付。', 'No. Standard already includes self-service acquisition: lead discovery, company profiling, scoring, outreach preparation and CRM entry. Global Acquisition adds three months of configured acquisition operation and three monthly reports, alongside its website and content deliverables.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('企业版提供专属环境与私有化部署，面向数据、系统、合规要求更高的企业。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。API、MCP、连接器、Activepieces、Windmill、工作区桥接和渠道插件都能接已有系统。系统迁移在企业版里提供。', 'Yes — through API, MCP, connectors, Activepieces, Windmill, Workspace Bridge and channel plugins; migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台能力与模型 / API / 第三方服务用量分开计。各方案额度不同，超出部分按实际用量计费。', 'Platform capability and model / API / third-party usage are separate; each plan carries its own allowance, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How are training and implementation done?'), B('标准版含一次配置与一次基础培训。企业版配专属前置部署工程师，把真实流程直接反馈进平台。', 'Standard includes one setup session and one basic training session. Enterprise comes with a dedicated FDE who feeds real workflows straight back into the platform.')],
    [B('我们该从哪一级开始？', 'Which level should we start at?'), B('从一条流程开始。挑现在最耗时间、最拖增长的那项工作，先跑通，再决定需要哪一级。', 'Start with one workflow. Pick the work that costs the most time or growth, get it running, then decide which level you need.')],
    [B('多公司、多品牌怎么办？', 'What about multiple companies or brands?'), B('多部门、多公司、多品牌、多账号，属于企业版：权限、审批、数据边界各自独立，共用同一支 AI 员工队伍。', 'Multiple departments, companies, brands and accounts belong to Enterprise: separate permissions, approvals and data boundaries on one shared AI workforce.')],
  ],
};

/* ========================================================== enterprise === */

export const ENTERPRISE = {
  eyebrow: B('(企业与治理)', '(Enterprise)'),
  h1: B('能干活，也管得住。', 'Built to act. Built to be controlled.'),
  story: [
    { label: B('(权力)', '(Authority)'), text: B('AI 能看什么、调什么、执行什么，哪些动作必须审批，谁来批，由企业自己定。AI 干活，人掌权。', 'The company decides what AI can see, call and execute, which actions need approval and who approves. AI does the work; people keep the authority.') },
    { label: B('(证据)', '(Evidence)'), text: B('AI 员工每次重要执行，都留下任务、输入、上下文、工具、动作、输出、证据、审批和结果。管理者看到的不只是答案，还有为什么这么做、调了什么、结果如何。', 'Every important agent run leaves task, input, context, tools, actions, output, evidence, approval and outcome — so a manager sees not just the answer but why, what was called and what happened.') },
    { label: B('(接入)', '(Connect)'), text: B('已有的企业系统和业务工具，通过 API、MCP、连接器、Activepieces、Windmill、工作区桥接和渠道插件接进来。不必扔掉现有软件从头再来。', 'Existing systems and tools connect through API, MCP, connectors, Activepieces, Windmill, Workspace Bridge and channel plugins. Nobody throws their software away to start over.') },
    { label: B('(模型)', '(Models)'), text: B('AI 员工运行时，按任务接入所需的模型与工具。模型是引擎；企业长期拥有的，是自己的数据、企业本体、知识、工作流、技能、AI 员工队伍和业务记忆。', 'The agent runtime connects the model and tools each task needs. The model is the engine; what the company owns for the long run is its data, ontology, knowledge, workflows, skills, agent workforce and business memory.') },
  ],
  introLabel: B('(为什么从一开始就这样设计)', '(Why it is built this way)'),
  intro: B('落地从范围开始：先定一条业务流程、要接的系统、谁批什么，以及验收时要看到的产出。试点交付的都是可复核的东西——流程模型、权限与审批规则、连接边界、执行记录，以及这条流程跑完的真实结果。达到约定的验收标准，再定下一条。', 'Delivery starts with scope: one business workflow, the systems it must reach, who approves what, and what you expect to see at acceptance. A pilot hands back things you can check — the modelled workflow, the permission and approval rules, the integration boundary, the execution record and the real result of running that workflow end to end. Meet the agreed acceptance criteria, then scope the next one.'),
  approachLabel: B('(部署方式)', '(Deployment)'),
  approach: [B('云端：最快开始，数据边界按租户隔离。', 'Cloud: fastest start, tenant-isolated data boundary.'), B('专属企业环境：独立环境，满足更严的数据要求。', 'Dedicated environment: separate infrastructure for stricter data requirements.'), B('私有化部署：跑在企业自己的边界内。', 'Private deployment: runs inside your own boundary.'), B('企业 SLA：服务等级按项目约定。', 'Enterprise SLA: service levels agreed per project.')],
  approachButton: { label: B('联系 STARGO 前置部署团队', 'Talk to a STARGO FDE'), href: 'contact.html' },
  statsLabel: B('(数字)', '(Numbers)'),
  stats: [
    { value: '288', text: B('个 AI 员工，在企业设定的权限范围内工作。', 'AI employees, working inside the permissions the company sets.') },
    { value: '13', text: B('项企业治理能力：能力中心、身份与权限、审批服务、审计台账、凭据管理、AI 员工护栏、租户隔离、故障处理、灰度发布、回滚、评估、可观测性、人在环中。', 'enterprise governance capabilities: Capability Center, Identity & Permission, Approval Service, Audit Ledger, Credential Management, Agent Guardrails, Tenant Isolation, Failure Handling, Canary, Rollback, Evaluation, Observability, Human-in-the-Loop.') },
    { value: '3', text: B('种部署方式：云端、专属企业环境、私有化部署。', 'deployment options: cloud, dedicated enterprise environment, private deployment.') },
  ],
  quoteLabel: B('(原则)', '(The principle)'),
  quote: { text: B('「把工作交给 AI。权力留在企业。」', '“Delegate the work. Keep the authority.”'), who: B('STARGO WORK', 'STARGO WORK'), where: B('人在环中', 'Human-in-the-Loop') },
  cardsTitle: B('五个治理组件', 'Five governance components'),
  cards: [
    { name: B('能力中心', 'Capability Center'), role: B('(AI 能调什么)', '(What AI may call)') },
    { name: B('身份与权限', 'Identity & Permission'), role: B('(谁，以什么身份)', '(Who, as whom)') },
    { name: B('审批服务', 'Approval Service'), role: B('(哪些必须审批)', '(What must be approved)') },
    { name: B('审计台账', 'Audit Ledger'), role: B('(每个动作留证据)', '(Every action leaves evidence)') },
    { name: B('凭据管理', 'Credential Management'), role: B('(凭据不进提示词)', '(Credentials never enter a prompt)') },
  ],
  noteLabel: B('(来自真实的全球贸易)', '(Born inside real global trade)'),
  note: B('STARGO WORK 不是从一张 SaaS 产品需求表起步的。它来自真实的制造业与全球贸易业务：怎么找客户、判断客户、快速回复、管理产品知识、报价、审批、做 PI、管理订单、备出口单证、持续跟进，以及怎么让增长不再只靠加人。', 'STARGO WORK did not start from a SaaS product spec. It came out of real manufacturing and global-trade operations: how to find customers, judge them, reply fast, manage product knowledge, quote, approve, make the PI, manage orders, prepare export documents, keep following up — and how to grow without only hiring.'),
  noteButton: { label: B('预约演示', 'Book a Demo'), href: 'contact.html' },
  table: {
    caption: B('(接入已有系统)', '(Connect what you already use)'), title: B('接入方式', 'Integration'),
    headers: [B('(方式)', '(Method)'), B('(做什么)', '(What it does)'), B('(连接什么)', '(What it connects)')],
    button: { label: B('看能力全景', 'See all capabilities'), href: 'capabilities.html' },
    rows: [
      ['API', B('直接调用与被调用', 'Call and be called directly'), B('已有系统', 'Existing systems')],
      ['MCP', B('AI 员工调用工具的标准接口', 'The standard interface agents use tools through'), B('工具与数据源', 'Tools and data sources')],
      [B('连接器', 'Connectors'), B('预置连接器', 'Pre-built connectors'), B('CRM · 邮箱 · 网盘 · 知识', 'CRM · mail · drives · knowledge')],
      ['Activepieces', B('工作流自动化', 'Workflow automation'), B('跨系统流程', 'Cross-system processes')],
      ['Scripts & Data Jobs', B('脚本与 ETL 执行', 'Scripts and ETL'), B('数据与脚本', 'Data and scripts')],
      [B('工作区桥接', 'Workspace Bridge'), B('工作台与产出交付', 'Workspace and deliverables'), B('桌面与文件', 'Desktop and files')],
      [B('渠道插件', 'Channel Plugins'), B('获客渠道插件', 'Acquisition channel plugins'), B('Reddit · Google · LinkedIn · Alibaba · WhatsApp · 邮件', 'Reddit · Google · LinkedIn · Alibaba · WhatsApp · Email')],
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
  G('01', 'Workspace & Business Overview', '工作空间与经营总览', [I('Boss Cockpit', '企业经营总览', '公司现在在做什么，一屏看完', 'What the business is doing right now, on one screen'), I('Command Center', '企业 AI 指挥中心', '目标交下去，盯着它走完', 'Hand a goal down and watch it carried out'), I('Cloud Workspace', '云端企业工作桌面', '人和 AI 员工共用的云端办公桌', 'The cloud desk your team and its agents share'), I('Mission Control', 'AI 员工与长任务运行中心', '盯住长时间运行的工作，需要时插手', 'Watch long-running work and step in when needed'), I('Execution View', '任务执行过程', 'AI 员工做过什么，逐步回放', 'Replay what an agent did, step by step'), I('System Map', '系统关系图', '对象与系统之间如何关联', 'How the objects and systems connect to each other'), I('App Library', '企业 AI 应用库', '企业为各团队开通的内部应用', 'The internal apps a company turns on for its teams'), I('Multi-window Desktop', '多窗口 AI 工作空间', '几件事同时开着，各自不丢进度', 'Several tasks open at once, without losing place'), I('Mobile Companion', '移动办公与任务管理', '离开工位，进度和审批跟着走', 'Progress and approvals follow you off the desk'), I('Notification Center', '企业通知', '什么变了，什么在等你', 'What changed, and what is waiting on you'), I('Approval Center', '审批中心', '所有待决事项排在同一个队列里', 'Every pending decision in one queue'), I('Voice Console', '语音指挥 AI', '不用打字也能下指令', 'Give an instruction without typing it')]),
  G('02', 'Customer Acquisition & Opportunity Research', '主动获客与商机判断', [I('STARGO Growth OS', 'AI 获客系统', '获客流程：从市场信号到写入 CRM', 'The acquisition workflow, from signal to CRM'), I('Trade Signal Revenue Engine', '贸易信号收入引擎', '观察到的贸易活动，沉淀成可跟进的客户', 'Turns observed trade activity into workable accounts'), I('Importer Reorder Radar', '进口商补货雷达', '判断哪些进口商快到补货窗口', 'Estimates which importers may be due to reorder'), I('Competitor Customer Graph', '竞争对手客户图谱', '摸清谁已在向同类供应商采购', 'Maps who already buys from comparable suppliers'), I('Buying Committee Intelligence', '决策链识别', '谁拍板、谁影响、谁签字', 'Who decides, who influences and who signs'), I('Dealer Opportunity Discovery', '经销商机会发现', '找出产品线正缺你这一块的经销商', 'Finds distributors whose range has a gap you fill'), I('Google Maps Dealer Discovery', '地图经销商发现', '按区域找经销商与分销商', 'Finds distributors and resellers by territory'), I('Opportunity Decision Engine', '机会决策', '建议跟进、搁置还是放弃，并给出理由', 'Recommends pursue, park or drop, with the reason'), I('Dealer Opportunity Brief', '经销商机会简报', '为何接触这家经销商，一页说清', 'A one-page case for approaching a distributor'), I('Playbook Engine', '销售打法生成', '针对这个客户和市场定打法', 'Builds the approach for this account and market'), I('Six-Factor Opportunity Scoring', '六因子机会评分', '按六项加权采购信号给客户排序', 'Ranks accounts on six weighted buying signals'), I('Account Research', '客户研究', '收集企业证据，注明出处', 'Collects company evidence and cites where it came from'), I('Trade Intelligence', '贸易情报', '从现有贸易记录读出需求与走向', 'Reads available trade records for demand and direction'), I('Website AI Sales Engineer', '官网 AI 销售工程师', '官网上回答产品问题，同时留住线索', 'Answers product questions on your site and captures the lead'), I('Dormant Lead Reactivation', '沉睡客户再激活', '给沉睡客户一个重新开口的理由', 'Brings quiet accounts back with a reason to talk'), I('Trade Show Afterburner', '展会线索持续转化', '一叠名片，排成有日期的跟进计划', 'Turns a stack of badges into scheduled follow-up'), I('CRM Automatic Lead Creation', 'CRM 自动写入', '合格客户写进 CRM，并指定负责人', 'Writes the qualified account into CRM with an owner'), I('Attribution & Growth Analytics', '结果归因与增长分析', '哪条动作真的带来了询盘和订单', 'Attribution and growth analytics')]),
  G('03', 'Market Channels & Account Discovery', '市场渠道与客户发现', [I('Reddit GEO', '社区需求侦察', '在买家提问的社区里被找到', 'Community demand intelligence'), I('Google Search GEO', 'AI 搜索时代的可见性', 'AI 搜索时代，内容能被搜到、被引用', 'Visibility in the AI search era'), I('LinkedIn B2B', 'B2B 决策人触达', '在决策人发声的地方触达他们', 'Reaches decision-makers where they publish'), I('Facebook GEO', '社交需求信号', '读你所在品类的社交需求信号', 'Reads social demand signals in your categories'), I('Alibaba Inquiry', '平台询盘接入', '平台询盘落到同一条客户时间线', 'Marketplace inquiries land on the customer record'), I('YouTube GEO', '视频渠道信号', '买家在搜什么、看什么', 'Tracks what buyers search and watch in your category'), I('WhatsApp Sales', '即时沟通销售', '买家真正会回复的那个渠道', 'The channel most buyers actually reply on'), I('Email B2B', '邮件开发与跟进', '邮件触达与后续跟进', 'Email outreach and follow-up'), I('Marketplace Adapter Pack', '平台适配包', '平台商品与消息，汇入同一条客户记录', 'Connects marketplace listings and messages to one customer record'), I('Channel Plugins', '新渠道接入', '新渠道接入同一套客户与销售流程', 'New channels join the same customer and sales workflow')]),
  G('04', 'Inquiries & Customer Conversations', '询盘与多渠道沟通', [I('Unified Inbox', '统一收件箱', '各渠道汇入同一队列，客户已对应好', 'Every channel lands in one queue with the customer attached'), I('Email Inquiry Processing', '邮件询盘处理', '读来信，直接打开对应客户记录', 'Reads an inbound email and opens the right customer record'), I('Alibaba Inquiry Handling', '平台询盘处理', '平台询盘按同一套流程处理', 'Marketplace inquiry handling'), I('Website Conversation', '官网会话', '官网对话，沉淀为合格询盘', 'Turns a site chat into a qualified inquiry'), I('Conversation Center', '会话中心', '跨渠道的对话集中在一处', 'One place for the conversations across channels'), I('Inquiry Intent Detection', '询盘意图识别', '分清真实采购需求与噪音', 'Separates a real buying request from noise'), I('Spam / Scam Detection', '垃圾与诈骗识别', '假询盘挡在销售队列之外', 'Keeps fake inquiries out of the sales queue'), I('Buyer Requirement Extraction', '买方需求提取', '从自由文本里提取产品、参数、数量与条款', 'Pulls product, spec, quantity and terms out of free text'), I('Company Background Research', '公司背景研究', '回复之前，先核实对方是谁', 'Checks who is asking before you answer'), I('Customer Risk Signals', '客户风险信号', '付款、合规、可信度的疑点，尽早标出', 'Flags payment, compliance and credibility concerns early'), I('Product Matching', '产品匹配', '把提出的需求匹配到已审核产品', 'Matches the stated requirement to approved products'), I('Knowledge-Grounded Reply', '基于企业知识的回复', '依据企业已审核资料起草答复', 'Drafts the answer from approved company sources'), I('Multilingual Reply', '多语言回复', '用买家的语言回复，依据同一份资料', 'Replies in the buyer’s language from the same source material'), I('Human Approval & Escalation', '人工审批与升级', '敏感承诺交给有权限的人', 'Human approval and escalation'), I('Automatic Follow-up', '自动跟进', '没有回音，按计划发下一次触达', 'Sends the next planned touch when nothing comes back'), I('Customer Timeline', '客户时间线', '说过什么、发过什么，按时间排成一条', 'One chronological record of everything said and sent')]),
  G('05', 'CRM & Customer Context', 'CRM 与客户全景', [I('Customer CRM', '客户与商机记录', '客户、机会与负责人的那本账', 'Customer and opportunity records'), I('Account 360', '客户全景', '这个客户的已知信息，一屏看全', 'Everything known about the account on one screen'), I('Customer Room', '客户工作间', '每个客户一个工作区，人与 AI 员工共用', 'A shared workspace per customer for people and agents'), I('Contact & Opportunity Management', '联系人与商机管理', '联系人、机会及各自进展', 'Contact and opportunity management'), I('Lead Scoring', '线索评分', '把值得打电话的客户排到最前面', 'Puts the accounts worth calling at the top of the list'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', '问过什么、报过什么价、实际买了什么', 'What they asked for, were quoted and actually bought'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', '下次触达、日期、责任人', 'The next touch, its date and who owes it'), I('Decision-Maker Mapping', '决策人映射', '记下谁决策、谁影响、谁签字', 'Records who decides, who influences and who signs'), I('Customer Evidence', '客户证据', '每条判断都留出处', 'Keeps the source behind every claim on the record'), I('CRM Automation', 'CRM 自动化', '负责人、阶段、下一步自动写入，不用手录', 'Writes owners, stages and next actions without manual entry')]),
  G('06', 'Products & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', '企业已审核的答案，集中在一处', 'The approved company answer, in one place'), I('Knowledge Center', '知识中心', '已审核的企业答案，在这里保持最新', 'Where approved company answers are kept current'), I('Knowledge Intake', '知识摄入', '文档和文件，沉淀成可引用的知识', 'Turns documents and files into answerable knowledge'), I('Knowledge Retrieval', '知识检索', '找出能回答这个问题的那一段', 'Finds the passage that answers the question'), I('Source Retrieval', '原文检索', '取回答案所依据的原文', 'Retrieves the passage an answer is based on'), I('Document Gateway', '网盘与文档接入', '直接读团队现有文档，不用先迁移', 'Reads existing team documents without a migration'), I('Product Intelligence', '产品智能', '规格、选配与限制，AI 能据此推理', 'Specifications, options and constraints AI can reason over'), I('Product Center & Library', '产品中心与产品库', '整条流程共用的同一份产品记录', 'One product record the whole workflow reads'), I('Specifications & Images', '产品参数与图片', '买家会追问的那些技术细节', 'The technical detail a buyer asks for'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', '公司以前定过、现在仍然算数的规矩', 'What the company has decided before, and still applies'), I('Evidence Retrieval', '证据检索', '给出答案，附上支撑文档', 'Returns the supporting document with the answer'), I('Source-Grounded Answers', '有据可查的回答', '没有你审核过的来源，就不作答', 'No answer without a source your team approved')]),
  G('07', 'Quotations, PI & Commercial Records', '报价、PI 与商业文件', [I('Quote Studio', '报价工作室', '报价从询盘开始，不从空表格开始', 'Builds the quotation from the inquiry, not a blank sheet'), I('Inquiry → Quote', '询盘到报价', '需求直接落成带价格的草稿', 'Carries the request straight into a priced draft'), I('Product Configuration & Quantity', '产品配置与数量计算', '报的到底是什么，数量多少', 'What exactly is being priced, and how many'), I('Commercial Terms', '贸易条件', '套用约定的付款、交期与质保条款', 'Applies the agreed payment, delivery and warranty terms'), I('Pricing Rules', '价格规则', '按你配置的规则定价，不靠猜', 'Prices from your configured rules, not from guesswork'), I('Margin Guardrails', '利润护栏', '报价越过利润线，没人批就过不了', 'Stops a quote crossing the margin line without approval'), I('Historical Price Context', '历史价格参考', '这个买家、这个市场，以前成交价多少', 'Shows what this buyer and market paid before'), I('Approval Workflow', '审批流程', '例外转给有权拍板的人', 'Routes the exception to the person allowed to decide'), I('Quote Versioning', '报价版本', '每一版都留存，改动也留痕', 'Keeps every version and what changed between them'), I('PI Studio / PI Center', '形式发票中心', '批准的报价直接转成形式发票', 'Turns the approved quote into a pro forma invoice')]),
  G('08', 'ERP, Orders & Fulfillment', 'ERP、订单与履约', [I('Order Management', '订单管理', '从批准的报价一路跟到交付', 'Tracks the order from approved quote to delivery'), I('Trade Execution Engine', '贸易执行引擎', '批准的商务条件，带进履约环节', 'Carries approved commercial detail into fulfilment'), I('Payment Milestones', '付款节点', '定金、尾款，以及还差什么没到', 'Tracks deposits, balances and what is still outstanding'), I('Production Status & QC', '生产进度与质检', '货在哪一步，检验过没过', 'Where the goods are, and whether they passed'), I('Packaging & Shipment', '包装与出货', '怎么装运，随货走哪些东西', 'How it ships, and what travels with it'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', '按批准的订单数据生成，待人复核', 'Prepared from approved order data, ready for review'), I('Certificate of Origin · Form E', '原产地证 · Form E', '整理申请材料；签发仍归主管机构', 'Organizes the application material; issuance stays with the authority'), I('Bill of Lading Workflow', '提单流程', '运输单据跟着货走', 'Keeps shipping documents moving with the shipment'), I('Certification & Battery Documentation', '认证与电池资料', '认证与电池相关材料按目的国备齐', 'Certification and battery documentation'), I('Export Documentation & Workflow', '出口单证与流程', '出口单据从准备到复核的整条链', 'Export documentation and workflow'), I('Export Tax Rebate', '六阶段出口退税流程', '按六个阶段跟踪退税申报', 'Tracks the rebate claim through its six stages'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', '整车、半散件、全散件，各种装运形态都能处理', 'Handles built-up, semi- and fully-knocked-down shipping forms')]),
  G('09', 'AI Images, Video & Marketing', 'AI 图片、视频与营销', [I('AI Creative Studio', 'AI 创意工作室', '产出产品页所需的整套销售素材', 'Produces the sales material a product page needs'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', '为你的目标销售站点写产品与市场文案', 'Product and market copy for the sites you sell on'), I('SEO · GEO · GEO Trust Content', '搜索优化 · AI 搜索可信内容', '内容结构化，既能被搜到，也能被引用', 'Content structured to be found and to be quoted'), I('Multi-language Content', '多语言内容', '同一个产品故事，覆盖目标市场', 'The same product story across your target markets'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', '同一个产品故事，贯通页面、方案与社媒', 'One product story across page, deck and feed'), I('AI Image & Video Workflow', 'AI 图片与视频流程', '按可复用的配方产出产品视觉', 'Product visuals produced to a repeatable recipe'), I('Viral Structure Adaptation', '爆款结构再创作', '借鉴有效视频的结构，为你的产品做原创改编', 'Adapts a proven video structure into original work for your product'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', '拆解有效视频的开场、节奏与表达', 'Breaks down a working video’s hook, pacing and messaging'), I('Short-form Clip Editing', '剪辑与短视频', '把产品素材剪成社媒短片', 'Cuts product footage into short social clips')]),
  G('10', 'AI Workforce & Teamwork', '数字员工与团队协作', [I('288 Specialized AI Employees', '288 个专业 AI 员工', '按岗位分工的 AI 员工目录', '288 specialised AI employees'), I('AI Employee Roster', 'AI 员工名册', '谁在岗，各自负责什么', 'Who is available, and what each one is for'), I('Workforce Panel', '员工面板', '派活、看进度、复核交回来的结果', 'Assign work, watch progress, review what came back'), I('Agent Teams · Multi-Agent Collaboration', '动态组队与多 AI 员工协作', '一个目标，几个专业岗位协同完成，不是一条提示词', 'Several specialists on one goal, not one prompt'), I('Agent-to-Agent Communication', 'AI 员工间通信', '上下文在岗位之间传，不用你转述', 'Specialists hand context to each other, not to you'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', '每个员工做什么、懂什么、能用什么、记得什么', 'What an employee does, knows, may use and remembers'), I('Shared Enterprise Context', '共享企业上下文', '所有 AI 员工背后是同一份业务事实', 'One business truth behind every agent'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', '任务拆开、在岗位间流转、并行推进', 'Work splits, moves between roles and runs at once'), I('Scheduled Work', '定时工作', '按时跑的例行研究与跟进', 'Recurring research and follow-up that runs on time'), I('Evidence & Human Approval', '执行证据与人工审批', '审批人拍板前看的那份记录', 'The record an approver reads before deciding')]),
  G('11', 'Automation & Everyday Work', '自动化与日常办公', [I('AI Employee Runtime', 'AI 员工运行环境', '为 AI 员工配工具、定边界的运行环境', 'Where an AI employee gets its tools and limits'), I('Workflow Automation', '工作流自动化', '跨应用把步骤连起来，不用写代码', 'Connects steps across apps without custom code'), I('Scripts & Data Jobs', '脚本与数据作业', '跑流程依赖的脚本与数据作业', 'Runs scripts and data jobs the workflow depends on'), I('Long-Horizon Control', '长任务控制', '任务跨小时、跨天，不跑偏', 'Keeps a task on course across hours and days'), I('Browser Automation', '浏览器自动化', '操作没有正式接口的网页工具', 'Works the web tools that have no formal interface'), I('Computer Use', '计算机操作', '无法对接时，直接操作界面', 'Operates an interface when integration is not available'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', '按时间跑，或在业务状态变化时跑', 'Runs on a clock, or when the business state changes'), I('Approved Actions & Tool Connections', '授权动作与工具连接', 'AI 员工获准调用的正式接口', 'Documented interfaces an agent is allowed to call'), I('External Connectors', '外部系统连接', '对接团队已在用的系统', 'Reaches the systems your team already runs'), I('Credential Management', '凭据管理', '账号密码统一保管，不进提示词', 'Holds the logins so they never enter a prompt')]),
  G('12', 'Business Relationships & Context', '企业业务关系与上下文', [I('Business Relationship Map', '企业业务关系图', '客户、报价、订单，成为 AI 可操作的对象', 'Customers, quotes and orders as objects AI can act on'), I('Cross-system Identity', '跨系统身份', '同一个客户，在各个系统里都对得上', 'The same customer across every connected system'), I('Customer · Product · Inquiry · Opportunity Objects', '客户 · 产品 · 询盘 · 机会对象', '商务这一侧，落成数据', 'The commercial side of the business, as data'), I('Quote · Order · Document · Task Objects', '报价 · 订单 · 文件 · 任务对象', '执行这一侧，仍挂回同一个客户', 'The execution side, linked back to the customer'), I('Agent · Market Signal Objects', 'AI 员工 · 市场信号对象', '谁做的，由什么触发', 'Who did the work, and what prompted it'), I('Relationships · Action Types · Business Logic', '关系 · 动作类型 · 业务逻辑', '对象之间如何关联，允许做什么操作', 'How your objects connect and what may be done to them'), I('Enterprise Context', '企业上下文', 'AI 员工动手前先读的企业状态', 'The company state an agent reads before acting'), I('Operational Records', '运营记录', '运营记录实际存放的地方', 'Where the operational record actually lives')]),
  G('13', 'Permissions, Approvals & Control', '权限、审批与经营控制', [I('Human-in-the-Loop', '人在回路', '明确哪些决定仍须由人来做', 'Names the decisions a person must still make'), I('Approval Service', '审批服务', '待决事项集中一处，等各自的负责人', 'One place where pending decisions wait for their owner'), I('Capability Center', '能力中心', 'AI 员工能调用什么，以谁的名义', 'What agents are allowed to call, and on whose behalf'), I('Permission Control · Identity', '权限控制 · 身份', '谁能看什么、能做什么', 'Permission control and identity'), I('Identity Check', '身份校验', 'AI 员工动作之前，先验身份', 'Checks identity before any agent action begins'), I('Audit Ledger · Agent Evidence · Action History', '审计台账 · AI 员工证据 · 动作历史', '做了什么、哪个 AI 员工做的、凭谁的授权', 'What was done, by which agent, on whose authority'), I('Guardrails', '护栏', 'AI 员工自己越不过的边界', 'Boundaries an agent cannot cross on its own'), I('Company Data Separation', '企业数据隔离', '按公司和品牌分开的数据边界', 'Separate data boundaries per company and brand'), I('Failure Handling · Rollback', '失败处理 · 回滚', '出错时停下来、退回去', 'Failure handling and rollback'), I('Work Visibility', '执行可见', 'AI 员工正在做什么，看得见', 'See what agents are doing while they do it')]),
  G('14', 'Retained Experience & Improvement', '长期经验与持续改进', [I('Improvement Review', '改进复核台', '候选改进在这里复核、发布', 'Where proposed improvements are reviewed and released'), I('Work Observation', '执行观察', '观察真实执行，记录发生了什么', 'Watches real execution and records what happened'), I('Outcome Review', '结果复盘', '记录下的结果，沉淀成候选改进', 'Turns recorded outcomes into candidate improvements'), I('Skill Optimizer', '技能优化', '按实测结果改进一项技能', 'Improves a skill against measured results'), I('Pre-release Testing', '发布前测试', '发布前先评测，再试着弄坏它', 'Tests a change, and tries to break it, before release'), I('Change Approval', '改进审批', '未经评测和批准，改动发不出去', 'No change ships without evaluation and approval'), I('Attempts · Outcomes · Scores', '过程 · 结果 · 评分', '试了什么、结果如何、评分多少', 'What was attempted, what resulted, how it scored'), I('Skill Library · Trials', '技能库 · 试验', '候选技能存放和试验的地方', 'Where a proposed skill is kept and tried out'), I('Side-by-side Trials · Staged Release · Rollback', '新旧对比 · 小范围试用 · 回退', '先在小范围试，留下或回滚', 'Test a change on a slice, keep it or take it back'), I('Continuous Improvement', '持续改进', '每次执行的结果，回来改进下一次', 'Each run’s result feeds back into the next one')]),
];

export const CAPABILITIES = {
  /* h1 / caption / intro are substituted into Mono's inner hero, which the page
     builder then replaces with renok's hero (CAPABILITY_SHOWCASE.hero*); they
     stay in step with it (V5 P02) so nothing stale lingers in the source. */
  h1: B('能力', 'Capabilities'),
  caption: B('(从找客户，到把企业工作连接起来)', '(From finding customers to connected enterprise work)'),
  intro: B('先看 Growth OS 主动获客与 Sales Desk 外贸闭环，再看 ERP、商城、财务履约、图片视频、数字员工与企业智能。每个模块都说明做什么、输出什么，以及需要哪些配置与确认。', 'Start with Growth OS and Sales Desk, then explore ERP, commerce, finance and fulfillment, creative work, AI teams and enterprise intelligence. Each module explains the work, the outputs and the configuration or approvals required.'),
  /* The four cards below carry no heading of their own in the donor, so the
     band read as four unexplained photographs. These three lines say what the
     cards are and what clicking one does. The title spells its two numbers as
     Chinese numerals, which reads better than an injected digit — so the build
     asserts they still match `macro.length` and CAPABILITY_GROUPS.length and
     fails rather than shipping a stale count.
     V5 P02 writes the map heading 「四个业务板块，十四类能力。」. On a 320px
     phone this h2 holds under six characters a line and every character is a
     break point, so 「四个业务板块，」 (seven) cannot stay whole and the line
     broke inside 板块. 业务 therefore lives in the caption above it, and the
     heading keeps two five-character halves that break on the comma. */
  macroCaption: B('(四个业务板块)', '(Four business areas)'),
  macroTitle: B('四个板块，十四类能力', 'Four areas. Fourteen capability groups'),
  macroLede: B('点开任意一个板块，直接跳到它包含的能力组。', 'Open an area to jump straight to the capability groups inside it.'),
  /* The four entries and their one-line descriptions (V5 P02). `groups[0]` is
     where the card links; tools/verify-release.mjs checks each card's picture
     by that link, so the grouping stays as it was. `desc` is printed inside the
     card's glass panel under the group count (tools/build-site.mjs). */
  macro: [
    { name: B('指挥与增长', 'Workspace & growth'), groups: ['01', '02', '03'],
      desc: B('从统一工作空间出发，发现客户、识别机会，组织开发任务。', 'Discover accounts, qualify opportunities and organize prospecting from one workspace.') },
    { name: B('客户与知识', 'Customers & knowledge'), groups: ['04', '05', '06'],
      desc: B('把询盘、客户记录和企业资料连接起来，让回复带着完整背景。', 'Connect inquiries, customer records and company knowledge for context-aware replies.') },
    { name: B('商务、履约与创作', 'Commercial, delivery & creative'), groups: ['07', '08', '09'],
      desc: B('从报价与 PI，延伸到 ERP、交付、回款、AI 图片与营销视频项目。', 'Extend quotes and PI into operations, delivery, collection, AI images and marketing-video projects.') },
    { name: B('员工与管理', 'Workforce & management'), groups: ['10', '11', '12', '13', '14'],
      desc: B('选择数字员工、组织协作，管理业务背景、权限、任务与持续改进。', 'Select AI specialists, coordinate work and manage context, permissions, tasks and improvement.') },
  ],
  unit: B('组', 'groups'),
  cardButton: B('查看功能全景', 'Explore Capabilities'),
  table: { caption: B('(按能力组)', '(By capability group)'), title: B('能力图谱', 'Capability map'), headers: [B('(能力组)', '(Group)'), B('(能力)', '(Capability)'), B('(说明)', '(What it is)')], button: { label: B('认识数字员工', 'Meet the AI workforce'), href: 'workforce.html' } },
  /* The closing Mono section: start with one workflow (V5 F10), then widen. */
  ladderCaption: B('(从一条流程开始)', '(Start with one workflow)'),
  // Scalora stacks these three on one absolutely-positioned line and swaps them.
  // The slot is one line tall (120px), so each language has to fit on one line:
  // at 1440 that is 800px at 96px type, roughly sixteen characters.
  ladder: [B('选一条流程。', 'One workflow.'), B('验证成果。', 'Prove results.'), B('再扩大范围。', 'Then expand.')],
  ladderDesc: B('不必第一天就改造全部部门。先选一条最重要的业务流程，准备资料与规则、连接授权账号、安排数字员工与审批，用真实样本验证成果，跑通后再扩大范围。', 'You don’t need to change every department on day one. Choose one priority workflow, prepare its context and rules, connect authorized accounts, assign AI roles and approvals, validate real cases — then expand.'),
  card1: { name: B('第一条流程', 'The first workflow'), desc: B('对效率或增长影响最大的那一条：主动获客、询盘跟进、报价、订单交付或营销内容。', 'The one that most affects efficiency or growth: prospecting, inquiry follow-up, quotation, order delivery or marketing content.'), big: '1', unit: B('(条流程)', '(workflow)'),
    items: [B('选定一条业务流程', 'Choose one business workflow'), B('准备产品、客户、知识与规则', 'Prepare product, customer, knowledge and rules'), B('连接授权账号', 'Connect authorized accounts'), B('安排数字员工与审批', 'Assign AI roles and approvals'), B('用真实样本验证成果', 'Validate with real cases')],
    tlLabel: B('从哪开始：', 'Start with:'), tl: B('一条流程', 'one workflow'), button: { label: B('预约企业演示', 'Request a Demo'), href: 'contact.html' } },
  /* The second card is where the first workflow leads, not a claim about the
     company today. 288 is the size of the role directory — the unit and the
     fourth bullet say so — never a number of employees running at once. */
  card2: { name: B('逐步扩展到全公司', 'Across the company, in phases'), desc: B('第一条流程验证有效后，按配置与交付范围逐步开放更多业务板块与数字岗位。', 'Once the first workflow proves useful, more business areas and AI roles open in phases, by configuration and agreed scope.'), big: '288', unit: B('(个专业数字岗位)', '(specialized AI roles)'),
    items: [B('Growth OS 与 Sales Desk 两大引擎', 'Growth OS and Sales Desk, the two engines'), B('ERP、履约与 AI 创作', 'ERP, fulfilment and AI creative work'), B('企业知识与业务关系共享', 'Shared company knowledge and context'), B('288 是岗位目录，不是同时运行数', '288 is a role directory, not concurrent runs'), B('关键决定由有权人批准', 'Authorized people approve key decisions')],
    tlLabel: B('下一步：', 'Next:'), tl: B('看定价', 'see pricing'), button: { label: B('看定价', 'See pricing'), href: 'pricing.html' } },
  faqCaption: B('(常见问题)', '(FAQ)'),
  /* Four slots, four V5 questions that belong on the capability page: how it
     differs from a chat window (F12), the systems a company already has (F11),
     what is available now (F13) and where to start (F10). */
  faq: [
    [B('它和单独使用一个 AI 聊天窗口有什么区别？', 'How is this different from using a standalone AI chat?'), B('重点不在对话形式，而在任务是否连接了企业资料、客户历史、业务应用、责任、审批和结果。STARGO WORK 围绕完整业务流程组织这些信息与工作，而不把一次文字回答当作业务已经完成。', 'The focus is not the chat format. It is whether the work connects enterprise information, customer history, business applications, ownership, approvals and results. STARGO WORK organizes those elements around a business workflow rather than equating a text answer with completed work.')],
    [B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Must we replace our current CRM, ERP, email and drives?'), B('不必先假定全部替换。STARGO WORK 的方向是把现有业务账号和资料连接到同一工作空间。具体保留、接入或调整哪些系统，需要结合企业当前软件和权限逐项确认。', 'A complete replacement should not be assumed. STARGO WORK aims to connect existing accounts and information in one workspace. Which systems are retained, integrated or adjusted depends on the enterprise’s software and access permissions.')],
    [B('所有渠道和全部功能现在都能直接用吗？', 'Is every channel and feature immediately available?'), B('不能仅凭功能介绍这样判断。部分已有应用基础，部分需要企业账号和真实数据接入，一键视频、深度协作和高级主动工作等仍在完善。演示与交付应逐项确认，不把能打开页面当作完整流程已经验收。', 'A capability description is not proof of availability. Some applications have foundations, some require enterprise accounts and live data, and video, deeper teamwork and advanced proactive work continue to evolve. Confirm each delivery scope and validate the workflow, not just page access.')],
    [B('企业应该从哪里开始？', 'Where should an enterprise start?'), B('先选一条最重要的业务流程，准备产品、客户、知识和规则，连接授权账号，安排数字员工与审批，再用真实样本验证成果。跑通后再扩大范围，而不是第一天就改造全部部门。', 'Choose one priority workflow. Prepare product, customer, knowledge and policy context, connect authorized accounts, assign roles and approvals, then validate real cases. Expand after that first workflow is proven useful.')],
  ],
  moreLabel: B('(想看它跑起来？)', '(Want to see it running?)'),
  more: B('演示按你的业务流程进行：已有基础的部分直接打开看；需要企业账号、真实数据或仍在建设的部分，逐项说明开放条件。', 'The demo follows your workflow: what already has foundations, we open and show; what needs enterprise accounts, live data or is still in development, we explain condition by condition.'),
  moreButton: B('预约企业演示', 'Request a Demo'),
};

/* ============================================================= contact === */

export const CONTACT = {
  eyebrow: B('(联系)', '(Contact)'),
  h1: B('从一条流程开始', 'Start with one workflow'),
  quote: B('「不必第一天就改变一切。告诉我们最影响效率或增长的那一条流程，我们从那里开始。」', '“You don’t need to transform everything on day one. Tell us the one workflow that most affects efficiency or growth. We start there.”'),
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
  options: [B('AI 主动获客', 'AI customer acquisition'), B('询盘自动处理', 'Inquiry automation'), B('多渠道客户回复', 'Omnichannel customer replies'), B('CRM 与客户管理', 'CRM and customer management'), B('企业知识库', 'Enterprise knowledge base'), B('报价与 PI', 'Quote and PI'), B('订单与出口流程', 'Orders and export workflows'), B('SEO · GEO', 'SEO · GEO'), B('AI 内容生产', 'AI content production'), B('AI 员工', 'AI Workforce'), B('完整 STARGO WORK', 'Full STARGO WORK'), B('企业定制', 'Enterprise customisation')],
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
  text: B('页面不存在，或已移走。', 'This page doesn’t exist, or has moved.'),
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
    { name: B('市场信号 AI 员工', 'Market Signal Agent'), dept: B('部门', 'Team'), owns: B('增长', 'Growth') },
    { name: B('报价 AI 员工', 'Quote Agent'), dept: B('部门', 'Team'), owns: B('销售', 'Sales') },
    { name: B('跟进 AI 员工', 'Follow-up Agent'), dept: B('部门', 'Team'), owns: B('客户', 'Accounts') },
    { name: B('单证 AI 员工', 'Document Agent'), dept: B('部门', 'Team'), owns: B('单证', 'Documents') },
    { name: B('调度中枢', 'Orchestrator'), dept: B('部门', 'Team'), owns: B('调度', 'Operations') },
  ],
  doTitle: B('一个团队，能替你完成这些', 'Every AI employee needs more than a name.'),
  abilities: [
    { title: B('主动获客', 'Prospecting'), text: B('市场信号、进口记录、经销商网络、采购决策链，串成可跟进的机会。', 'Market signals, import records, dealer networks and buying committees become opportunities you can work.') },
    { title: B('询盘到报价', 'Inquiry to quote'), text: B('识别客户、匹配产品、套用价格规则、出报价，越过利润护栏的进审批。', 'Identify the customer, match the product, apply the pricing rules, draft the quote; anything past the margin guardrail goes to approval.') },
    { title: B('订单与单证', 'Orders and documents'), text: B('PI、付款节点、生产进度、出口文件与认证资料，都在一个订单上。', 'PI, payment milestones, production progress, export documents and certificates, all on one order object.') },
  ],
  bullets: [
    B('看得见优先级', 'Priorities at a glance'),
    B('跟得住客户与订单', 'Customers and orders tracked'),
    B('关键动作留有证据', 'Critical actions leave evidence'),
    B('越权的事进审批', 'Anything past authority needs approval'),
  ],
  phoneTitle: B('真正能干活的工作台', 'A workspace that does the work'),
  phoneSub: B('日常运营在同一处', 'Day-to-day operations in one place'),
  cardA: { title: B('有岗位的 AI', 'AI with a job'), text: B('岗位、目标、知识、工具、权限、执行记录都配好了，不从空白提示开始。', 'It never starts from a blank prompt: role, goal, knowledge, tools, permissions and record are all configured.') },
  cardB: { title: B('记得住上下文', 'Context that holds'), text: B('研究岗记下公司证据，产品岗核对能不能做，销售岗写出第一封信，协调岗合成一份简报。每一步都写在同一个客户对象上，下一个岗位接手，不用你再转述。', 'The research role records the company evidence, the product role checks what is actually offerable, the sales role drafts the first message and a coordinator merges it into one brief. Each step is written onto the same customer object, so the next role picks it up without you relaying it.') },
  stackedCard: B('企业要的能力，已经在里面。', 'The capabilities a company needs, already inside.'),
  answersCards: [
    B('在手机上批掉一条报价', 'Approve a quote from your phone'),
    B('一个目标 → 分派角色 → 交接上下文 → 一份可复核的简报', 'One goal → roles assigned → context handed over → a reviewable brief'),
  ],
  extraRole: { name: B('审计台账', 'Audit Ledger'), owns: B('留痕', 'Evidence') },
  answersBody: B('岗位、目标、工具、权限、审批、执行记录，都包含在你选的层级里。', 'Roles, goals, tools, permissions, approvals and records — all included in the level you choose.'),
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
  title: B('从做外贸的真实工作里长出来的。', 'Built from the work of running an export business.'),
  desc: B('STARGO WORK 起于一个很实际的问题：制造与外贸团队怎样把 AI 用进整条工作，而不只是一个聊天窗口？找客户、答产品问题、报价、订单交接、后续跟进，靠的都是信息，而信息往往散在各处。', 'STARGO WORK grew from a practical question: how can a manufacturing and export team use AI across the work, not just in a chat window? Customer research, product questions, quotations, order handoffs and follow-up all depend on information that is often scattered.'),
  button: { label: B('预约演示', 'Book a demo'), href: 'contact.html' },
  /* The template shows four named people here. STARGO's role emblems (its own
     conceptual visuals, not portraits) stand for four AI-employee roles instead. */
  circles: [
    { label: B('市场信号 AI 员工', 'Market Signal Agent'), image: 'assets/stargo/avatar-01.png' },
    { label: B('报价 AI 员工', 'Quote Agent'), image: 'assets/stargo/avatar-03.png' },
    { label: B('跟进 AI 员工', 'Follow-up Agent'), image: 'assets/stargo/avatar-05.png' },
    { label: B('调度中枢', 'Orchestrator'), image: 'assets/stargo/avatar-06.png' },
  ],
  bigImage: { src: 'assets/stargo-motion/orbit-poster.webp', alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
  storyTitle: B('我们的来历', 'Our story'),
  story: B(`<p>STARGO WORK 不是从一份 SaaS 产品需求表开始的。它出自真实的制造与外贸业务：怎么找客户、怎么判断客户、怎么快速回复、怎么管产品知识、报价、审批、做 PI、管订单、备出口单证、持续跟进，以及怎么让增长不再只靠加人。</p>
<p>我们的做法是前置部署：软件适应企业，而不是反过来。前置部署工程师走进真实流程，把业务规则、产品知识和审批边界直接回灌到平台里。</p>
<p>我们相信 AI 应该真正把活干了，也相信权力应该留在企业。所以从第一天起，权限、审批、证据、审计、回滚就是产品本身的一部分，不是事后补的功能。</p>`,
    `<p>STARGO WORK did not start from a SaaS product spec. It came out of real manufacturing and global-trade operations: how to find customers, judge them, reply fast, manage product knowledge, quote, approve, make the PI, manage orders, prepare export documents, keep following up — and how to grow without only hiring.</p>
<p>Our method is forward deployment: software adapts to the company, not the other way round. An FDE enters the real workflow and feeds business rules, product knowledge and approval boundaries straight back into the platform.</p>
<p>We believe AI should genuinely do the work, and that authority should stay with the company. So from day one, permissions, approval, evidence, audit and rollback have been part of the product itself, not features added afterwards.</p>`),
  values: [
    B('人对结果负责。', 'Keep people responsible.'),
    B('业务始终连在一起。', 'Keep the business connected.'),
    B('凭证据改进。', 'Improve with evidence.'),
  ],
  startTitle: B('从一条流程开始', 'Start with one workflow'),
  starts: [
    { name: B('询盘处理', 'Inquiry handling'), sub: B('阶段 04–05 · 理解与回复', 'Stages 04–05 · Understand & respond') },
    { name: B('报价与 PI', 'Quotes & PI'), sub: B('阶段 06 · 报价工作台', 'Stage 06 · Quote Studio') },
    { name: B('主动获客', 'Proactive acquisition'), sub: B('阶段 01–03 · 增长系统', 'Stages 01–03 · Growth OS') },
    { name: B('客户跟进', 'Customer follow-up'), sub: B('阶段 08 · 跟进 AI 员工', 'Stage 08 · Follow-up Agents') },
    { name: B('出口单证', 'Export documents'), sub: B('阶段 07 · 贸易执行', 'Stage 07 · Trade Execution') },
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
  /* The page opens on renok's hero (V5 P02: 「从找客户，到把企业工作连接起
     来。」). Its accent word is set in an italic serif, which has no CJK
     glyphs, so the accent stays a Latin fragment in both languages rather than
     a synthesised slant. On the Chinese page that fragment is the product name
     the sentence starts from — Growth OS finds the customers — so no English
     word stands in the Chinese headline. The display headline drops the full
     stop, as every display heading on the site does.
     tools/blocks/rk-hero.mjs holds each Chinese phrase together with word
     joiners; a zero-width space (U+200B) marks the one place a long phrase may
     still break, so 到把企业工作 / 连接起来 wraps between its two halves and
     never inside a word. The English tail's no-break space keeps "work" from
     falling onto a line alone. */
  heroLead: B('从找客户', 'From finding customers to'),
  heroAccent: B('/Growth OS', '/connected'),
  heroTail: B('到把企业工作\u200b连接起来', 'enterprise\u00a0work'),
  heroBody: B('先看 Growth OS 主动获客与 Sales Desk 外贸闭环，再看 ERP、商城、财务履约、图片视频、数字员工与企业智能。每个模块都说明做什么、输出什么，以及需要哪些配置与确认。', 'Start with Growth OS and Sales Desk, then explore ERP, commerce, finance and fulfillment, creative work, AI teams and enterprise intelligence. Each module explains the work, the outputs and the configuration or approvals required.'),
  heroButton: B('查看功能全景', 'Explore Capabilities'),
  eyebrow: B('能力图谱', 'CAPABILITY MAP'),
  /* Two lines of one 10rem heading. 每项 rather than 每一项: at the donor's size
     three characters need 484.8px and the column is 440–470px wide between 992
     and ~1089px, so the third was pushed onto a line of its own. 每项工作 is also
     the more ordinary Chinese for it. Keep this line to two characters. */
  headlineTop: B('每项', 'Every'),
  headlineBottom: B('工作', 'Job'),
  headline: B('先找客户，再把生意做完整。', 'Find the customer. Carry the business forward.'),
  storiesLabel: B('你的业务能完成什么', 'What your business gets done'),
  storiesNote: B('六段业务，环环相扣。点开看背后怎么做。', 'Six connected areas of work. Open one to see the work behind it.'),
  foundationsNote: B('上面每段业务都靠这四个基础。', 'Four foundations every area above depends on.'),
  body: B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统：Growth OS 主动获客，Sales Desk 外贸闭环，连接 ERP、AI 创作、企业知识与 288 个专业数字岗位。', 'A browser-based desktop AI operating system for manufacturing and global trade enterprises: Growth OS and Sales Desk, connected with ERP, creative work, enterprise knowledge and 288 specialized AI roles.'),
  cardButton: B('聊聊你的流程', 'Discuss your workflow'),
  inCatalogue: B('对应能力组', 'In the catalogue'),
  outputLabel: B('产出', 'Useful output'),
  connectionLabel: B('接到哪里', 'Connects to'),
  /* Closes the quotation paragraph (tools/blocks/rk-stats.mjs): what this
     describes is scope, and what a company can use is confirmed per item. */
  scopeNote: B('你公司实际开通哪些，方案沟通时逐项确认。', 'What your company can use is confirmed item by item during scoping.'),

  stories: [
    {
      image: 'os-cockpit',
      /* Growth OS, proactive acquisition (V5 M02, V6 §5.2). tools/blocks/
         cn-service.mjs prints `promise` + `connection` as the section's lead
         and `output` + `availability` under it; the four rows are the first
         four picks, worded by CAP_V6A.growth below. */
      label: B('Growth OS · 主动获客', 'Growth OS · Proactive prospecting'),
      groups: ['02', '03'],
      promise: B('Growth OS 不只整理已有询盘，而是围绕产品、目标市场和客户画像，寻找值得开发的企业，判断机会；证据不足时标注待核实，不强猜。', 'Growth OS goes beyond incoming inquiries: it looks for companies worth developing around your products, target markets and buyer profiles, and qualifies the opportunity — weak evidence is marked for checking, never guessed.'),
      picks: ['Account Research', 'Trade Intelligence', 'Importer Reorder Radar', 'Buying Committee Intelligence', 'Opportunity Decision Engine', 'Dealer Opportunity Brief', 'CRM Automatic Lead Creation'],
      output: B('工作成果：客户清单、联系人信息、商机简报、开发计划。', 'Outputs: prospect lists, contact details, opportunity briefs and outreach plans.'),
      connection: B('确认后的客户连同来源、背调、产品兴趣和下一步任务转入 Sales Desk，不必等询盘，也不重复建档。', 'Approved prospects move into Sales Desk with their sources, research, product interests and next actions — no waiting for an inquiry, no duplicate records.'),
      availability: B('核心流程建设中，真实数据与客户触达按授权接入。', 'Core workflows are developing; live sources and outreach require authorization.'),
    },
    {
      image: 'os-sales-desk',
      /* Sales Desk (V5 M03, V6 §5.3). The heading is V6's; tools/blocks/qx-news.mjs
         prints `promise` then `availability` in the left column, and its three
         rows keep the intake / requirements / customer-context split. */
      /* English takes V6's compact form: the sticky column holds about fifteen
         Latin characters a line at 58px, and the long form stood five lines. */
      label: B('Sales Desk：把客户聊明白，把订单跟到底', 'Sales Desk: from customer to order'),
      groups: ['04', '05'],
      promise: B('Sales Desk 承接 Growth OS 确认的客户与各渠道询盘：统一入口把它们收进来，需求从来信和附件里读出来，客户全景记下背景与历史。三者一起服务于回复、产品匹配、跟进、报价与 PI，直到订单交接。', 'Sales Desk takes the prospects Growth OS has approved and the inquiries from every connected channel. One intake receives them, requirements are read from messages and attachments, and the customer view keeps context and history. Together they serve replies, product matching, follow-up, quotations and PI, through to the order handoff.'),
      picks: ['Unified Inbox', 'Inquiry Intent Detection', 'Buyer Requirement Extraction', 'Customer Risk Signals', 'Knowledge-Grounded Reply', 'Account 360', 'Automatic Follow-up'],
      output: B('客户档案、结构化需求、产品方案、待审核回复与连续的销售跟进记录。', 'Customer records, structured requirements, product fit, review-ready replies and continuous sales history.'),
      connection: B('确认的需求与产品方案，就是下一段报价的起点。', 'The agreed requirement and product fit become the starting point of the quotation below.'),
      availability: B('已有业务工作台；渠道收发、价格和业务交接逐项接通与验证。', 'The workspace exists; messaging, price sources and business handoffs are integrated and validated one by one.'),
    },
    {
      image: 'os-quote-studio',
      /* Quotations, PI and commercial records (V5 M04, V6 §5.4). The heading's
         three clauses are drawn as three lines by tools/blocks/rk-stats.mjs,
         which splits it at 「，」 / ". "; the paragraph is `promise`, then
         `connection`, then `availability`, then the scope note. */
      label: B('报价有依据，利润有边界，文件有版本', 'Ground the price. Review the margin. Keep the version.'),
      groups: ['07', '06'],
      promise: B('按产品配置、数量、包装、币种和贸易条款准备报价草稿；价格来自企业确认的价格表与历史报价，折扣和利润越过边界须由有权人批准，AI 不自行编价。每一版都留存、可比较，批准的版本再转为 PI 与合同，并衔接商业发票、装箱单等单证的准备与人工复核。', 'Quote drafts are built from product configuration, quantity, packaging, currency and trade terms. Prices come from the company’s approved pricebooks and quote history; discounts or margins beyond the limits need an authorized approver, and AI never invents a price. Every version is kept and comparable, and the approved one becomes the PI and the contract, with commercial invoices, packing lists and other documents prepared for human review.'),
      picks: ['Quote Studio', 'Product Configuration & Quantity', 'Pricing Rules', 'Margin Guardrails', 'Historical Price Context', 'Approval Workflow', 'PI Studio / PI Center'],
      output: B('报价草稿、批准版本、PI、商务条款与可追溯的商业资料。', 'Quote drafts, approved versions, proforma invoices, commercial terms and traceable documents.'),
      connection: B('批准报价不等于已经发送，发送也不等于客户已经收到，三者分别确认。', 'An approved quote is not a sent one, and a sent quote is not a received one; each is confirmed on its own.'),
      availability: B('报价与 PI 持续完善；真实价格、合同、签章与单证按企业系统接通。', 'Quotes and PI are evolving; live prices, contracts, signatures and documents depend on connected enterprise systems.'),
    },
    {
      image: 'os-trade-execution',
      /* ERP and fulfilment (V5 M05 + M06, V6 §5.5). The marquee is `label`; the
         six cards are CAP_V6A.operations (six operating themes, not register
         items). The boundary is said on the two cards it belongs to. */
      label: B('ERP 与履约：前端拿订单，后台接得住', 'ERP & fulfilment: from winning orders to delivering them'),
      groups: ['08'],
      promise: B('把销售前端与企业经营后台放到同一个桌面：不仅知道客户要什么，也知道产品、物料、库存、生产、订单与收款在哪里。', 'Bring sales and operating systems into one desktop, connecting demand with products, materials, inventory, production, orders and commercial records.'),
      picks: ['Order Management', 'Payment Milestones', 'Production Status & QC', 'Commercial Invoice · Packing List', 'Certificate of Origin · Form E', 'Bill of Lading Workflow', 'Export Documentation & Workflow'],
      output: B('订单里程碑、付款提醒、资料清单、异常事项、售后记录与复购跟进。', 'Order milestones, payment reminders, document checklists, exceptions, service records and reorder follow-up.'),
      connection: B('获客 → 销售 → ERP / 履约 → 财务协同 → 售后复购 → 新一轮增长。', 'Acquisition → sales → ERP / fulfilment → finance coordination → support and repeat sales → renewed growth.'),
      availability: B('已有 ERP 与商城应用基础；跨系统协同按企业配置验收，履约、物流、财务与服务按接入情况分阶段交付。', 'ERP and commerce foundations exist; cross-system work is validated per enterprise, and fulfilment, logistics, finance and service are delivered in stages as systems connect.'),
      caveat: B('正式申报、签发与资金支付仍由相应有权人员和机构处理；单据准备与流程协同不替代专业合规审查。', 'Official filings, issuance and payments stay with the authorized people and institutions; document preparation and workflow support do not replace professional compliance review.'),
    },
    {
      image: 'brand-family-01',
      label: B('为产品和市场做内容', 'Create content for products and markets'),
      groups: ['09', '03'],
      promise: B('产品和销售素材，用的就是销售流程那一份审核过的产品资料，再按买家和答案引擎找得到的方式组织。', 'Product and sales material is produced from the same approved product information the sales workflow uses, then structured so buyers and answer engines can find it.'),
      picks: ['AI Creative Studio', 'Product · Sales · Social Content', 'SEO · GEO · GEO Trust Content', 'Multi-language Content', 'AI Image & Video Workflow', 'Viral Structure Adaptation', 'Short-form Clip Editing'],
      output: B('产品页、本地化文案、短视频，直接用在你的销售渠道上。', 'Product pages, localized copy and short video ready for the channels you sell on.'),
      connection: B('发出去的内容，又回流到上面的买家研究和询盘处理。', 'Published material feeds the buyer research and inquiry handling above.'),
    },
    {
      image: 'os-agent-center',
      /* AI roles working as a team (V5 M10 + M11, V6 §5.7). The three cards
         are CAP_V6A.team; `output` fills the two-line slot beside the heading. */
      label: B('让 AI 团队把活干完', 'Run the work with an AI team'),
      groups: ['01', '10'],
      promise: B('一个复杂任务可以交给多个数字员工分工完成。重点不在聊天人数，而在信息能否传递、责任是否明确、结果能否交接。', 'Assign complex work to a bounded team of digital employees. What matters is information exchange, clear ownership and reliable handoff — not the number of chat windows.'),
      picks: ['288 Specialized AI Employees', 'Workforce Panel', 'Agent Teams · Multi-Agent Collaboration', 'Task Delegation · Handoff · Parallel Execution', 'Role · Skills · Tools · Memory', 'Approval Center', 'Mobile Companion'],
      output: B('按责任汇总的结果、成员之间的交接记录，以及清楚的下一步。', 'Consolidated results, clear handoffs and assigned next steps.'),
      connection: B('288 是岗位目录数量，不是同时运行的员工数，也不等于替代 288 名真人。', '288 is the role-directory count — not concurrent workers, and not a claim to replace 288 people.'),
    },
  ],

  /* The four foundations (V5 M12, M14, M15, M13 in business language). Each
     node shows `label` and `promise`; clicking it opens `panel` — short
     [title, what it means] lines written for a manager, not a list of register
     entries — and a node with a `caveat` closes its panel with it. The promise
     already carries each caveat's substance, so a condition is never only
     behind a click. The label is cut in half around the orb
     (tools/blocks/qx-whatwedo.mjs). On a phone the scroll action pushes the
     two halves outward, and the old label's six-and-five characters were the
     most that stayed on screen at 320 and 390 — twelve (所有业务工作 /
     共用四个基础) lost a character at each edge, and "foundations" lost its first
     letters — so the Chinese is nine characters (每项业务的 / 四个基础) and the
     English keeps to short words, as "What every / story runs on" did. */
  foundationsLabel: B('每项业务的四个基础', 'What every area rests on'),
  foundations: [
    {
      image: 'brand-ontology',
      label: B('企业知识与业务关系', 'Knowledge and business relationships'),
      groups: ['06', '12'],
      promise: B('知识库是企业资料室；业务关系把客户、产品、报价、订单与负责人对应起来。回答依据企业确认的资料，资料冲突或过期时提示核实。', 'The knowledge base is the company’s reference room; business relationships connect customers, products, quotes, orders and owners. Answers rest on approved company sources, and conflicting or outdated material is flagged.'),
      panel: [
        [B('企业知识中心', 'Knowledge center'), B('产品、价格政策、认证、常见问题、模板与制度集中管理', 'Products, pricing policy, certificates, FAQs and templates in one place')],
        [B('有据可查的回答', 'Answers with sources'), B('注明依据的资料；没有资料，不作答', 'Each answer names its source; no source, no answer')],
        [B('业务关系图', 'Business relationship map'), B('客户、商机、报价、订单与负责人彼此关联', 'Customers, opportunities, quotes, orders and owners linked')],
        [B('同一个客户对得上', 'One customer, every record'), B('不同系统里的同一客户或订单能对应', 'The same customer or order matched across systems')],
        [B('规则进入执行', 'Rules inside the work'), B('报价权限、订单条件和审批人事先清楚', 'Pricing authority, conditions and approvers known up front')],
      ],
      caveat: B('知识与业务关联已有基础，更深的关联按接入情况逐步完善。', 'Foundations exist; richer relationships arrive in stages.'),
    },
    {
      image: 'os-desktop',
      label: B('按授权连接业务系统', 'Connections, by authorization'),
      groups: ['11'],
      promise: B('邮箱、网盘、CRM、ERP 与业务平台按企业授权接入，明确哪些能看、哪些能改、哪些要审批。列出的连接完成配置与授权前，不算已经接通。', 'Email, drives, CRM, ERP and business platforms connect through enterprise authorization, defining what can be read, changed or needs approval. A listed connection is not live until it is configured and authorized.'),
      panel: [
        [B('企业账号与应用', 'Accounts and apps'), B('邮箱、网盘、CRM、ERP，按授权开放', 'Email, drives, CRM and ERP, as far as authorized')],
        [B('跨应用工作流', 'Cross-app workflows'), B('按时间或业务变化，把重复步骤连起来', 'Repeated steps run on a schedule or on a change')],
        [B('授权网页任务', 'Authorized web tasks'), B('查资料、填表、上传下载，不绕过登录与验证', 'Research and forms, never bypassing sign-in')],
        [B('账号统一保管', 'Sign-ins kept safe'), B('登录凭据集中保管，不在对话里流转', 'Credentials held centrally, not passed around')],
        [B('同步与出错处理', 'Sync and errors'), B('同步、重试与异常都有记录', 'Retries and exceptions are recorded')],
      ],
      caveat: B('目录里列出的连接，完成配置与授权后才算接通。', 'A listed connection is live only once configured and authorized.'),
    },
    {
      image: 'os-login',
      label: B('权限、审批与记录', 'Permissions, approvals and records'),
      groups: ['13'],
      promise: B('哪些工作可以自动推进、哪些要复核、哪些必须审批，由企业决定。重要动作都留下记录：谁做的、依据什么、结果如何。', 'The company decides what may proceed on its own, what needs review and what needs approval. Important actions leave a record: who acted, on what basis and with what result.'),
      panel: [
        [B('人工审批', 'Human approval'), B('报价、对外触达、重要承诺与付款由有权人决定', 'Quotes, outreach, commitments and payments decided by people')],
        [B('权限与身份', 'Access and identity'), B('谁能看、谁能做，按岗位与账号设定', 'Who may see and do what, by role and account')],
        [B('工作记录', 'Work records'), B('做了什么、谁完成、凭谁的授权', 'What was done, by whom, on whose authority')],
        [B('暂停与接管', 'Pause and takeover'), B('出现异常时停下，由人接手或退回', 'On an exception, work stops for a person')],
        [B('企业数据隔离', 'Separated company data'), B('不同公司与品牌的数据各自分开', 'Each company and brand keeps its own data')],
      ],
    },
    {
      image: 'brand-loop',
      label: B('经过验证的改进', 'Improvement you can check'),
      groups: ['14'],
      promise: B('从成功和失败中整理可改进的工作方法、岗位技能与流程，先测试、比较、批准，再逐步采用；效果不足时可以撤回。', 'Better working methods, role skills and processes are drawn from successes and failures, then tested, compared and approved before gradual adoption — and withdrawn if they fall short.'),
      panel: [
        [B('观察实际工作', 'Watch the real work'), B('记录真实执行中发生了什么', 'Record what actually happened')],
        [B('结果复盘', 'Outcome review'), B('成功与失败整理成候选改进', 'Wins and losses become candidate improvements')],
        [B('采用前测试', 'Tested before adoption'), B('先测试、比较，再交人批准', 'Tested and compared, then approved by a person')],
        [B('小范围试用', 'Trial on a slice'), B('先在部分工作中试，保留或撤回', 'Tried on part of the work, then kept or withdrawn')],
        [B('核对业务结果', 'Check the result'), B('不只看“执行过”，还核对是否达标', 'Not only that it ran, but whether it met the goal')],
      ],
      caveat: B('改进经测试和批准后采用，可以撤回。', 'Improvements are tested and approved before use, and can be withdrawn.'),
    },
  ],

  catalogueLabel: B('完整目录', 'The complete catalogue'),
  catalogueNote: B('登记在册的全部能力，按组排列。上面的成果引用的就是这些条目。', 'Every capability in the register, by group. The outcomes above draw from these same entries.'),
};

/* ===== V6 A: capability showcases (#story-1…#story-4, #story-6, foundations) =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-A-START
/* The words V6 §5 gives the capability showcases that are not a register
   entry's own name and gloss. A showcase row is a short reading of its topic in
   that section's story — 企业研究 in the Growth OS section says what the
   research is for there — while the catalogue below keeps the register's
   wording, so these are written here rather than by renaming register items
   (their names are the keys the picks look up).

   A zero-width space (U+200B) inside a Chinese title marks where it may break:
   the blocks set those titles `word-break: keep-all`, so the narrow name slots
   wrap between phrases (产品、物料 / 与采购) instead of inside a word. */
const ZW = '\u200b';
export const CAP_V6A = {
  /* #story-1 — Growth OS (tools/blocks/cn-service.mjs). The pill names the
     engine; the two heading lines are the donor's two-character / short-word
     display slot (see headlineTop above for why two characters). The rows are
     keyed by the story's first four picks and keep V6's four topics. */
  growth: {
    eyebrow: B('Growth OS', 'Growth OS'),
    headTop: B('主动', 'Find'),
    headBottom: B('获客', 'Leads'),
    button: { label: B('获客能力详情', 'Prospecting details'), href: '#g02' },
    rows: {
      'Account Research': { title: B('企业研究', 'Company Research'),
        text: B('查清企业规模、市场、主营产品与渠道，信息注明来源与更新时间。', 'Company size, markets, products and channels, with the source and date of every fact.') },
      'Trade Intelligence': { title: B('贸易情报', 'Trade Intelligence'),
        text: B('从依法授权的贸易数据与公开信息里，读出采购记录与供应商变化。', 'Purchase records and supplier changes, read from lawfully authorized trade data and public sources.') },
      'Importer Reorder Radar': { title: B('补货判断', 'Reorder Signals'),
        text: B('根据采购周期判断补货窗口；证据不足时标注待核实，不编造需求。', 'Reorder windows judged from purchase cycles; weak evidence is marked for checking, never invented.') },
      'Buying Committee Intelligence': { title: B('关键决策角色', 'Key Decision Roles'),
        text: B('找出采购决策人与影响者，保留身份匹配依据，确认后交给 Sales Desk。', 'Buyers and influencers identified with identity evidence, then handed to Sales Desk once approved.') },
    },
  },
  /* #story-2 — Sales Desk (tools/blocks/qx-news.mjs): intake, requirements,
     customer context — V6 §5.3's three names — keyed by the register pick each
     row links to (its group decides #g04 / #g05). */
  sales: {
    rows: {
      'Unified Inbox': { title: B('统一询盘入口', 'Unified Inquiry Intake'),
        text: B('各渠道询盘汇入同一入口，分清新询盘、历史消息与垃圾信息。', 'Inquiries from each connected channel arrive in one intake, sorted from history and spam.') },
      'Buyer Requirement Extraction': { title: B('买方需求提取', 'Buyer Requirement Extraction'),
        text: B('从来信与附件读出产品、规格、数量与交期，并提示缺失信息。', 'Products, specifications, quantities and deadlines read from messages and attachments, with gaps flagged.') },
      'Account 360': { title: B('客户全景', 'Customer Context'),
        text: B('联系人、商机阶段、沟通记录、报价与订单，接手时一屏看全。', 'Contacts, stage, conversations, quotes and orders — the whole context for whoever takes over.') },
    },
  },
  /* #story-3 — quotations (tools/blocks/rk-stats.mjs). The three reels show
     the steps 01 / 02 / 03 of V5 M04's sequence — draft, review and approval,
     the kept version — not counts, so nothing on the band reads as a result.
     Each label is one line of the donor's 24px slot, which is 163px wide at
     768: six Chinese characters or about fifteen Latin ones. The picture is
     this site's own editorial art for quoting (precision parts aligned and
     checked), in place of renok's branding portrait. */
  quote: {
    steps: [B('按规则起草', 'Drafted by rules'), B('有权人批准', 'Human approval'), B('保留正式版本', 'Version kept')],
    image: 'os-quote-studio',
    button: { label: B('报价能力详情', 'Quotation details'), href: '#g07' },
    /* The paragraph's closing pointer to where product facts live. */
    facts: { lead: B('价格与产品事实的依据，见', 'For the product facts behind a price, see'), label: B('产品与企业知识', 'Products & enterprise knowledge'), href: '#g06' },
  },
  /* #story-4 — ERP and fulfilment (tools/blocks/rk-testimonials.mjs): V6
     §5.5's six operating themes, in its order, one card each; desktop rows and
     the phone slider are filled from this one list. Theme 4 keeps every trade
     document the old cards named, and themes 3 and 4 say where the decision
     stays. The section has no paragraph of its own, so its conditions ride on
     the cards they belong to: ERP foundations and per-enterprise validation
     (1), the connected logistics systems (5), staged delivery (6). `link` is
     each card's role line, pointing at the catalogue group. */
  operations: {
    themes: [
      { title: B(`产品、物料${ZW}与采购`, 'Products, materials & purchasing'),
        text: B('产品档案、规格、物料清单与供应商资料保持一致，订单需求衔接采购与到货跟进。已有 ERP 与商城基础，跨系统协同按企业配置验收。', 'Product records, specifications, bills of materials and suppliers stay consistent, and order demand links to purchasing and deliveries. ERP and commerce foundations exist; cross-system work is validated per enterprise.') },
      { title: B(`库存、生产${ZW}与质检`, 'Stock, production & quality'),
        text: B('看清可交付数量与缺货，跟踪生产任务、物料需求、质检、包装与交期。', 'See available stock and shortages; track production tasks, material needs, quality checks, packing and lead times.') },
      { title: B(`订单与${ZW}付款节点`, 'Orders & payment milestones'),
        text: B('订单、订金、尾款、发票与对账提醒对应起来；资金支付由有权人员批准，AI 不擅自付款。', 'Orders, deposits, balances, invoices and reconciliation reminders line up; payments are authorized by people, never by AI alone.') },
      { title: B(`外贸单证${ZW}与出口资料`, 'Trade documents & export records'),
        text: B('准备并核对商业发票、装箱单、原产地证 / Form E 资料、提单、认证与出口退税资料；正式签发、申报与获批由主管机构完成。', 'Prepare and check commercial invoices, packing lists, certificate of origin / Form E materials, bills of lading, certifications and export tax-rebate records; official issuance, filing and approval stay with the authorities.') },
      { title: B('物流与交付', 'Logistics & delivery'),
        text: B('运费询价、订舱、物流轨迹、预计到达与异常处理，运输单据跟着交付走；范围取决于企业接入的货代与物流系统。', 'Freight quotes, bookings, tracking, arrival estimates and exceptions, with shipping documents following delivery; the scope depends on the forwarding and logistics systems connected.') },
      { title: B(`售后、渠道${ZW}与复购`, 'Service, channels & reorders'),
        text: B('保修、退换货、备件与经销商支持，商城业务与补货建议，把成交后的生意接下去；按系统接入情况分阶段交付。', 'Warranty, returns, spare parts, dealer support, commerce and reorder suggestions — the business after the sale, delivered in stages as systems connect.') },
    ],
    link: { label: B('ERP 与履约详情', 'ERP & fulfilment details'), href: '#g08' },
    /* The six portraits were the donor's testimonial sitters: beside an
       operating theme a face reads as a customer quote this company does not
       have. This site's own abstract avatars stand in (decorative). */
    icons: ['avatar-07', 'avatar-08', 'avatar-09', 'avatar-10', 'avatar-11', 'avatar-12'],
  },
  /* #story-6 — AI roles as a team (tools/blocks/qx-projects.mjs): V6 §5.7's
     three cards. The large card is the teamwork example and says it is an
     illustration and that deeper teamwork opens in phases. Links go to the
     workforce page, where M10/M11 are told in full, and to the catalogue
     group for the role and task entries. Pictures are this site's editorial
     art for specialised roles and parallel work. */
  team: {
    arrowHref: 'workforce.html',
    cards: [
      { title: B(`288 个${ZW}跨部门${ZW}专业岗位`, '288 cross-functional specialist roles'),
        text: B('岗位目录，按任务选用；不是同时运行的 288 个员工，也不替代真人。', 'A role directory chosen per task — not 288 employees running at once, and not a replacement for people.'),
        href: 'workforce.html', pill: B('认识数字员工', 'Meet the AI Workforce'), image: 'phone-agents' },
      { title: B(`员工任务、${ZW}进度与成果`, 'Tasks, progress and results'),
        text: B('谁在做什么、哪里在等待、交付了什么，关键动作由人批准。', 'Who is doing what, what is waiting and what was delivered, with key actions approved by people.'),
        href: '#g10', pill: B('员工能力组', 'AI workforce group'), image: 'mobile-agents' },
      { title: B(`团队分工、${ZW}交流、${ZW}并行与接力`, 'Roles, exchange, parallel work and handoffs'),
        text: B('协作示意：市场研究员工找到目标企业，产品员工核对规格，销售员工规划开发，创意员工准备素材，统筹角色复核汇总后交负责人确认。基础派工已有记录，深度团队互通按阶段开放；图为示意，不是实时运行画面。', 'Illustrative: research finds target accounts, a product specialist checks specifications, sales plans outreach, creative prepares assets, and a coordinator reviews and consolidates the package for the responsible person to confirm. Basic delegation is recorded; deeper teamwork opens in phases. The picture is an illustration, not a live view.'),
        href: 'workforce.html', pill: B('看团队协作', 'See teamwork'), image: 'brand-family-03' },
    ],
  },
};
// V6-A-END




/* ===== V6 B: creative topics (#story-5) =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-B-START

// V6-B-END




/* ===== V6 C: capability catalogue detail (#g01–#g14, #atlas) =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-C-START

// V6-C-END




/* ===== V6 D: workforce page =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-D-START

// V6-D-END




/* ===== V6 E: intelligence page =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-E-START

// V6-E-END




/* ===== V6 F: enterprise page =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-F-START

// V6-F-END




/* ===== V6 G: about, contact, blog and pricing notes =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-G-START

// V6-G-END




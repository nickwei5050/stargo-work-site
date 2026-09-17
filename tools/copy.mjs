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
   About in the menu.
   The English home link said "Trade OS" while the product was pitched as an
   operating system for global trade. V6 positions it as an enterprise AI
   operating system for manufacturing and trade, where "Trade OS" names only a
   part of it, so the link now says what it is — the home page — as the
   Chinese 「首页」 always did. Nothing keys on the old word: tools/chrome.mjs
   remapLinks() already resolves "Home" to index.html, and the breadcrumb in
   the article pages' structured data reads this label. */
export const NAV = [
  { href: 'index.html', label: B('首页', 'Home') },
  { href: 'intelligence.html', label: B('智能层', 'Intelligence') },
  { href: 'capabilities.html', label: B('能力', 'Capabilities') },
  { href: 'workforce.html', label: B('数字员工', 'AI Workforce') },
  { href: 'enterprise.html', label: B('企业管理', 'Enterprise') },
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
   ERP with fulfillment — so 沟通 became 销售 and 订单 became 经营. The loop's
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
     second line said 「AI 员工」. The Chinese line breaks after 「企业的」 on
     purpose: the footer heading is split per character, so without a forced
     break it split 「网页」 at every width up to 1024px. */
  ['Crafting visuals. Shaping stories.', B('面向制造业与外贸企业的<br/>网页桌面级 AI 企业操作系统。', 'A browser-based desktop AI operating system for manufacturing and global trade.')],
  ['Let’s create great work together!', B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.')],
  ['Let’s Collaborate', B('预约演示', 'Book a Demo')],
  ['(Newsletter)', B('(订阅更新)', '(Newsletter)')],
  ['Be the first to know what’s new.', B('产品进展第一时间通知你。', 'Stay close to practical AI work.')],
  ['No noise. Just curated updates.', B('不发广告，只发产品更新。', 'Receive STARGO WORK product notes and practical workflow guides.')],
  ['Thank you for subscribing!', B('订阅成功。', 'You are subscribed.')],
  /* Webflow's two form-state notices (V5 P07). The success row is used only by
     demo-request forms — the contact page card and the 「预约企业演示」 band on
     the home, capability and enterprise pages; the newsletter has its own row
     above — so it names the demo request and promises nothing but a reply to the
     details given. The failure row is shared with the newsletter, and its
     wording fits both. js/stargo-forms.js writes its own sentence over the
     success notice at run time; these are what stands in the markup. */
  ['Oops! Something went wrong while submitting the form.', B('本次提交未成功，请稍后重试，或使用页面已有的商务联系方式联系。', 'Your request could not be submitted. Please try again later or use the business contact options on this page.')],
  ['Thank you! Your submission has been received!', B('已收到你的演示需求，我们会根据提交的联系方式与你沟通。', 'Your demo request has been received. We will follow up using the contact details provided.')],
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
  'intelligence.html': { title: B('企业智能', 'Enterprise Intelligence'), description: B('让 AI 带着企业知识、客户历史、业务关系和工作目标做事，了解主动提醒、长期任务、记忆与持续改进的分阶段能力。', 'Connect company knowledge, customer history and business context with goals, proactive reminders, ongoing tasks, memory and controlled improvement.') },
  'capabilities.html': { title: B('功能全景', 'Capabilities'), description: B('从获客、销售、报价与 PI，到 ERP、履约、AI 图片视频、数字员工、企业知识和管理控制，了解完整功能与开放条件。', 'Explore growth, sales, quotations, ERP, fulfillment, AI images and video, knowledge, teamwork and management—with clear availability conditions.') },
  'workforce.html': { title: B('288 个专业数字岗位', '288 Specialized AI Roles'), description: B('覆盖十类企业职能，按任务选择员工、组织团队、交流信息并接力交付；实际启用和协作范围依企业配置开放。', 'Explore ten role groups and task-based teams. Activation, communication and permitted work depend on enterprise configuration and delivery scope.') },
  /* Pricing keeps its live title and description: they are also the page's
     visible hero subtitle, and V5 P08's candidate intro needs its own
     commercial approval. */
  'pricing.html': { title: B('定价', 'Pricing — Software & Growth Services'), description: B('对比 STARGO WORK 年度软件订阅，以及可选的建站、内容与获客服务包。', 'Compare the annual STARGO WORK subscription with optional website, content and customer-acquisition service packages.') },
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
  B('围绕产品、目标市场和客户类型，整理目标企业、背调、联系人与采购信号，形成开发优先级。真实数据与客户触达按授权接入。', 'Research accounts, contacts and buying signals around products, target markets and customer types, then prioritize outreach. Live data and outreach require authorization.'),
  B('将主动开发客户与渠道询盘放进 Sales Desk，统一客户记录、回复、产品匹配、报价、审批与 PI。渠道收发与业务交接逐项接通与验证。', 'Bring prospects and inquiries into Sales Desk for customer records, replies, product fit, quotes, approvals and PI. Channel messaging and handoffs are integrated and validated one by one.'),
  B('连接产品、采购、库存、生产、质检、订单和发货资料，让销售承诺与交付进度对应。按企业系统接入情况逐步连接与验收。', 'Connect products, purchasing, stock, production, quality, orders and shipping records with the sales commitment. Connected and validated according to the enterprise systems in use.'),
  B('围绕付款节点、对账、物流、单证、出口退税资料和售后问题，组织跨部门跟进。按企业系统接入情况逐步连接与验收。', 'Coordinate payment milestones, reconciliation, logistics, trade documents, export tax-rebate materials and customer support. Connected and validated according to the enterprise systems in use.'),
  B('保留客户偏好、历史结果和后续任务，关注补货与复购机会，复盘工作方法。主动提醒与长期记忆按阶段完善。', 'Retain preferences, outcomes and next steps, identify reorder opportunities and review working methods. Proactive reminders and long-term memory are extended in stages.'),
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
  scHero: B('Growth OS 找到并判断客户，确认后交给 Sales Desk 推进沟通、报价与订单；经营、内容与数字员工围绕同一条主线协作；按企业配置分阶段开放。', 'Growth OS finds and qualifies accounts; approved prospects move to Sales Desk for conversations, quotes and orders, supported by operations, content and AI teams. Availability is phased by configuration.'),
  // The core-engines heading sits in a 421px box at 48px type — about eight
  // characters a line on desktop, so the desktop string is built to break on
  // its comma. Below 768px the box holds ten, so phones get a form whose two
  // halves each fit a line.
  products: B('两大引擎，经营与创作', 'Two engines, plus operations and creative work'),
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
  ['Founder of Light\u00a0Studio®', B('主动提醒', 'Proactive reminders')],
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
    B('它表示 288 个可按任务选择的专业数字岗位，覆盖十类企业职能，不只外贸销售。每个岗位可配置职责、知识、技能和权限；多位员工可以组成团队，互相沟通、分工完成同一项任务。288 不等于替代 288 名真人，实际启用的员工、协作规模及操作范围受配置、预算和权限约束。', 'It denotes 288 specialized, task-selectable roles across ten enterprise role groups — not trade sales alone. Each role can be configured with responsibilities, knowledge, skills and access, and several can form a team, message each other and complete one task together. The number is not a claim to replace 288 people; the employees enabled, the size of a collaboration and permitted actions depend on configuration, budget and access.')],
  ['Do you work with businesses in any industry?', B('报价、发消息和付款等关键动作谁决定？', 'Who controls consequential actions?')],
  ['Yes! We’ve worked with startups, tech companies, e-commerce brands, real estate firms, and service providers. Our process is adaptable to fit the needs of different industries and audiences',
    B('由企业有权人员决定。AI 可以准备资料、形成草稿和提出建议；报价、对外触达、重要承诺、正式申报和资金支付等事项按企业规则审批。批准、发送和实际结果核对分别处理。', 'Authorized people do. AI can organize information, prepare drafts and recommend next steps. Quotations, outreach, important commitments, official submissions and payments remain subject to enterprise approval rules. Approval, delivery and outcome checks are distinct steps.')],

  /* hero support — the product definition, in the readable introduction rather
     than in the giant brand lettering (V6 §4.1). */
  ['No cookie cutter sites. No empty claims. Only practical tools and smart strategies that drive growth and build brands.',
    B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动找客户，Sales Desk 推进销售；连接 ERP、AI 创作与 288 个跨部门数字岗位，关键决定由企业掌握。', 'A browser-based desktop AI operating system for manufacturers and export teams. Growth OS finds prospects; Sales Desk advances sales. ERP, creative work and 288 cross-functional AI roles support the business, with your team in control.')],

  /* who we are → 288 cross-functional roles (V6 §4.4). The counter card says
     what the number is — a role directory across ten functions whose roles
     team up by task; the ten groups and their counts are on the workforce
     page. (The owner retired the "not running at once" wording on
     2026-09-17.) */
  ['We shape brands with focus, intention, and impact.', B('288 个数字岗位，不只服务外贸。', '288 specialized AI roles. Across the enterprise.')],
  /* The approval card (V5 H08): AI prepares, an authorized person decides, and
     the three states — approved, sent, received — are never run together.
     V5's lines are cut to the template's own lengths: the label and the two
     statements sit beside the heading, and at 768–1024 the longer V5
     sentences ran over it. */
  ['Pricing with', B('AI 准备工作，', 'AI prepares.')],
  ['complete transparency', B('由你批准决定。', 'You decide.')],
  ['(Performance Boost)', B('(决定权始终在人)', '(Humans stay in command)')],
  ['Page speed +78%,', B('批准≠已发送；', 'Approved ≠ sent.')],
  ['Bounce rate -13%', B('提交≠已完成。', 'Submitted ≠ done.')],
  ['View pricing', B('认识数字员工', 'AI Workforce')],   // short: at 768 a longer English label covered the two statements beside it
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
  ['<h2 class="h2">Work<span class="small-ftd">(4)</span></h2>', B('<h2 class="h2">工具很多，靠人连接<span class="small-ftd">(4)</span></h2>', '<h2 class="h2">Many tools, manual handoffs.<span class="small-ftd">(4)</span></h2>')],
  ['Forma Digital', B('询盘来了，还要重新整理', 'Email inquiries still need organizing')],
  ['One Step', B('窗口很多，客户信息分散', 'Chats span windows; context is scattered')],
  ['Nero Vision', B('客户在表格，跟进靠人记', 'Customers in sheets, follow-up by memory')],
  ['Bold Moves', B('订单在后台，销售还在追问', 'Orders in the back office; sales still chasing')],
  ['View all work', B('看业务主线', 'See the business flow')],

  /* blog cards: the template's four-card grid, filled from BLOG (build-site.mjs) */
  ['Smart insights.', B('最新文章。', 'Latest articles.')],
  ['>See all<', B('>全部文章<', '>All articles<')],

  /* short / global */
  ['>Get started<', B('>聊聊你的流程<', '>Discuss your workflow<')],
  ['>Book a call<', B('>预约企业演示<', '>Request a Demo<')],
  ['>Contact us<', B('>预约企业演示<', '>Request a Demo<')],
  ['Let&#x27;s talk', B('预约企业演示', 'Request a Demo')],
  ['Scroll Down', B('向下滚动', 'Scroll down')],
  ['(Who we are)', B('(288 个数字岗位 · 组队协作)', '(288 AI roles · working as teams)')],
  ['(Team of experts)', B('(按任务组队)', '(Teams by task)')],
  ['(Services)', B('(五个业务阶段)', '(Five business stages)')],
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
  ['(Home)', B('(首页)', '(Home)')],   // same word as NAV[0] (V6: no "Trade OS" label)
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
      B('订单交给 ERP 与履约：物料、生产、质检、单证与发货。', 'Hand the order to ERP and fulfillment: materials, production, QC, documents, shipment.'), '08'],
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
    B('Growth OS 负责发现目标客户、查清背景和判断商机；确认后转入 Sales Desk，继续沟通、匹配产品、报价和跟进订单。ERP、内容生产与数字员工团队，围绕同一条业务主线协作。核心流程持续完善，按企业配置与交付范围分阶段开放。', 'Growth OS finds accounts, researches the buyer and qualifies the opportunity. Approved prospects move into Sales Desk for conversations, product matching, quotations and order follow-through, supported by operations, creative work and AI teams. Core workflows are evolving; availability follows enterprise configuration and agreed delivery scope.')],
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
  ['AI Sales Agent', B('数字员工', 'AI teams')],
  ['Hero Card Icon', B('卡片图标', 'Card icon')],
];
/* The four product slots (V6 §4.7): two core engines — Growth OS and Sales
   Desk — and two business areas they are connected to — ERP and AI creative.
   Quotations and PI stay inside Sales Desk here and have their own section on
   the capability page; fulfillment is in the five stages and the ERP detail.
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
    B('围绕真实产品与品牌资料组织主图、场景图、详情页、图册和多语言内容；从一句制作需求生成营销视频，也能借鉴有效视频的结构做原创改编。生成内容经人工审核后使用，按企业开通的服务与额度开放。', 'Build product images, scenes, detail pages, catalogs and multilingual content from verified product and brand information; turn a brief into a marketing video, or adapt a proven video structure into original work. Generated content is reviewed before use, within the services and credits the company enables.')],
  ['Dashbord Image', B('界面示意图', 'Interface illustration')],
];
/* The channel band (V5 H09, V6 §4.8): three different uses — finding
   customers, carrying conversations, publishing content — and no promise
   that a platform on the diagram is switched on. */
export const HOME_SC_INTEGRATION = [
  ['Integration Icon', B('渠道图标', 'Channel icon')],
  ['>Integration<', B('>(发现客户 · 承接沟通 · 内容传播)<', '>(Discover · Converse · Publish)<')],
  ['One AI Engine. Fully Connected.', B('渠道可以不同，业务不必断开。', 'Different channels, one business context.')],
  ['Scalora connects your CRM, website, ads, and commerce tools into one intelligent automation system.',
    B('找客户的信息来源、与客户沟通的渠道、发布内容的平台，各司其职。STARGO WORK 在企业授权与已接入范围内，把相关信息交给同一套客户、销售与跟进流程。显示平台名称不表示所有渠道默认开通，也不表示具备全部收发权限。', 'Research sources, conversation channels and publishing platforms serve different purposes. Within authorized integrations, STARGO WORK connects their activity to shared customer, sales and follow-up workflows. A listed platform is not a promise of default access or full read-and-write permissions.')],
];

/* ====================================================== lifelogx pages === */

/** Shared slot originals of the lifelogx homepage, with two different fills. */
const LX_TAGS = { CARDS: B('客户', 'Customer'), transfers: B('报价', 'Quote'), financing: B('订单', 'Order') };

/* intelligence.html (V6 §7, V5 P03 with M11, M12, M13 and M16).
   The page keeps its address and the nav label 智能层, and says what the layer
   does for a business rather than how it is built: it understands the company
   (knowledge, relationships, one customer across systems) and keeps work
   moving (opportunities and deadlines, tasks that survive a pause, memory,
   improvement judged by results). The architecture words the page used to lead
   with — 企业本体 / 前置部署 / 调度中枢 / 进化, prompts, skills and model
   weights — are gone from every slot; the business meaning they carried is in
   the copy below and in LX_INTELLIGENCE_CONTEXT (the V6-E block at the end of
   this file), which the page adds as one section of plain explanations.

   Slot budgets, measured on the built page (Chromium, 2026-09-16):
   - heroWord is the giant brand word: three or four characters.
   - heroDesc sits in a box about 7 em wide at 1024 and up (269-277px at
     38.4px) and must stay two lines; the Chinese page breaks it only at spaces
     and punctuation (stargo-fusion.css), so each half has to fit on its own.
     It carries V6's visible headline, 「让 AI 理解你的公司，并主动推进工作」,
     cut to fit: 「让 AI 理解公司，」 alone already measured wider than the box
     and the Chinese hero broke into three lines (「让 AI」/「理解公司，」/…)
     from 1024 up. The English keeps the template's three lines at 1440.
   - store1.sub / store2.sub: at 320 the two captions have about seven
     characters of room before they wrap; six or fewer keeps them one line.
   - features: three fixed-height cards (24rem / 21.5rem or 25rem / 21.5rem).
     verify-restore wants each card, at some scroll state, to hold its whole
     copy and title; at 1024 (a 267px column of 2rem type) the 21.5rem cards
     manage four lines and no more: "Learn the workflow, set up roles and
     approvals, test on real cases." took five and its first line sat above
     the open card, so the English second text is the shorter form. At 320 the
     third card fits a one-line title and four lines of copy: with "Proactive
     work" on two lines it never fitted, whatever the copy, so its English
     title is the template's one word. At 320 and 768 the Chinese column is
     seven characters wide. The titles sit beside an
     icon and have five characters of room at 320 and 768: P03's 「企业业务关系」
     and 「按真实流程落地」 measured 「企业业务关」/「系」 and 「按真实流程」/「落地」
     there, so the titles are their five-character forms.
   - words: one line each and four characters at most (verify-restore).
   - bigText fills the viewport width with no side padding: 5 em at 320,
     6.1 at 390, 8 at 768 and 1024, 11.5 at 1440. The Chinese page breaks it
     only at punctuation (keep-all on .lx-big-text), so a run must stay at four
     glyphs, punctuation included, to keep a margin at 320, and two runs that
     together make six glyphs join into one edge-to-edge line at 390
     (「机会、期限，不靠人记。」 touched the left edge at both widths).
   - ctaTitle / ctaSub are 9 em wide from 1024 up and about 6.5 em on a phone;
     the <wbr> is where the Chinese line breaks when it has to (the page sets
     keep-all on these two lines, V6-E in stargo-fusion.css). */
export const LX_INTELLIGENCE = {
  heroWord: B('智能层', 'Intelligence'),
  /* The two hero buttons keep their anchors (#lx-ontology is clicked by
     tools/verify-interactions.mjs): the first opens the business-context cards,
     the second the closing card on improvement. The English names stay one
     line at 768, where "Business context" wrapped beside its icon, and keep
     their arrow inside a 320 viewport, which "Improvement" pushed to the edge. */
  store1: { name: B('业务理解', 'Context'), sub: B('读懂业务关系', 'How work connects'), href: '#lx-ontology' },
  store2: { name: B('持续改进', 'Improving'), sub: B('用结果改进', 'Judged by results'), href: '#lx-evolution' },
  heroDesc: B('AI 理解公司，并主动推进工作', 'Know the company. Keep work moving.'),
  tags: LX_TAGS,
  features: [
    /* P03's three entries. The second carries V6's four implementation steps
       for this page (observe the real workflow, prepare context, arrange
       roles and approvals, validate with real cases); the gradient headings
       below repeat them as P03's 落地四步. */
    { title: B('业务关系', 'Connections'), text: B('客户、产品、报价、订单<wbr>和负责人，不再是<wbr>互不相干的记录。', 'Customers, products, quotes, orders and owners, connected.') },
    { title: B('按流程落地', 'Real workflows'), text: B('先了解业务，再安排<wbr>资料、岗位与审批，用真实样本验收。', 'Workflow first, then data, roles, approvals and real-case tests.') },
    { title: B('主动工作', 'Proactive'), text: B('关注机会、期限和异常，有依据地提建议，按授权推进。', 'Flags leads, deadlines and risks; acts only as authorized.') },
  ],
  /* P03's six business cards. They are rendered in two columns and mirrored
     for phones by lxOntologyList() in tools/build-site.mjs; only the first six
     entries are used. */
  cards: [
    { title: B('客户', 'Customer'), text: B('是谁，来自哪里，之前谈过什么。', 'Identity, source and previous conversations.') },
    { title: B('询盘', 'Inquiry'), text: B('想采购什么，还缺哪些信息。', 'Requirements and information still missing.') },
    { title: B('报价', 'Quote'), text: B('采用什么价格，哪一版已经批准。', 'The price used and the version approved.') },
    { title: B('订单', 'Order'), text: B('约定了什么，当前走到哪一步。', 'The agreed commitment and current progress.') },
    { title: B('出货', 'Shipment'), text: B('什么时间交付，还缺哪些资料。', 'Delivery timing and missing records.') },
    { title: B('任务', 'Task'), text: B('谁负责，何时完成，结果如何核对。', 'Owner, deadline and how the result will be checked.') },
  ],
  /* V7-LX: the small caps label above each of those six cards, in their
     order, and above the team card (feat2Card). The template printed one
     label, 「客户 · 报价 · 订单」, on all of them; each now names what its own
     card is about, in the card's own words. Two or three short items. */
  cardTags: [
    B(['身份', '来源', '沟通'], ['Identity', 'Source', 'History']),
    B(['需求', '待补信息'], ['Needs', 'Missing info']),
    B(['价格', '版本', '批准'], ['Price', 'Version', 'Approval']),
    B(['约定', '进度'], ['Commitment', 'Progress']),
    B(['交期', '资料'], ['Timing', 'Records']),
    B(['负责人', '期限', '核对'], ['Owner', 'Deadline', 'Check']),
  ],
  teamTags: B(['分工', '交接', '确认'], ['Roles', 'Handoffs', 'Sign-off']),
  gradient: [B('观察真实流程', 'Observe the workflow'), B('整理业务关系', 'Map the business context'), B('安排 AI 参与的步骤', 'Assign useful AI work'), B('用实际结果改进', 'Improve from real outcomes')],
  /* P03's proactive-work heading, 「机会、截止时间和待办事项，不必都靠人记着。」,
     cut to the slot (see bigText above): runs of four, three and four glyphs,
     so it reads 「新机会、」/「期限，」/「不靠人记」 at 320 and 390, two lines at
     768 and 1024 and one from 1440. No closing 。, like the heading it
     replaces (「主动，不是被动」). The bubbles around it name the opportunities,
     deadlines and pending approvals it refers to. "Opportunities" is wider
     than a phone at this size (409px at 64px), hence "Leads". */
  bigText: B('新机会、期限，不靠人记', 'Leads and deadlines, not left to memory.'),
  /* Two marquee rows. Row one shows entries 0-4 and 6 in both of its loop
     copies (tools/build-site.mjs, V7-LX): business situations the layer
     watches for. Row two shows 7-11
     and then 5: M13's loop — notice a change, understand the context, propose,
     get approval, act, check the result, retain the lesson — and the point
     where it stops to ask. No job titles. */
  bubbles: [
    B('重点客户三天没有回复。', 'A key account hasn’t replied in three days.'),
    B('老客户可能到了补货周期。', 'A regular customer may be due to reorder.'),
    B('新进口商出现采购信号。', 'A new importer shows buying signals.'),
    B('报价发出后，还没有下文。', 'A quote went out; no answer yet.'),
    B('交期临近，出货资料还没备齐。', 'Delivery is close; shipping records are incomplete.'),
    B('一份报价在等负责人批准。', 'A quote is waiting for its approver.'),
    B('某个产品在一个市场的搜索需求上升。', 'Search demand for a product rises in one market.'),
    B('发现变化 → 理解上下文', 'Notice a change → understand the context'),
    B('提出建议 → 获得确认', 'Propose an action → get approval'),
    B('推进任务 → 核对结果', 'Act → check the result'),
    B('沉淀经验，留给下一次', 'Retain the lesson for next time'),
    B('证据不足时，先停下来请人判断。', 'Not enough evidence? It stops and asks.'),
  ],
  /* 等提醒 rather than 等提示: M13's 「不再每件事，都等你开口提醒。」, and no
     echo of 提示词. Same width, so the band's sizes still hold. The English
     says the same — nobody has to nudge — rather than "prompting", and is
     shorter than "forgetting", the widest word the English sizes are set for. */
  words: [B('不再', 'No'), B('等提醒', 'nudging'), B('等回复', 'waiting'), B('丢上下文', 'forgetting')],
  /* M11 in plain words: the 288 roles work as a team on one task. The two
     headings break at their commas on a phone (keep-all, V6-E). The English
     title is one line at 320; "288 specialized roles." left "288" alone
     there. */
  feat2Title: B('288 个岗位，', '288 AI roles.'),
  feat2Sub: B('分工协作，把事做完。', 'Divide the work. Finish it together.'),
  feat2Card: { title: B('按任务组队', 'Task teams'), text: B('一项复杂任务，可由研究、销售、产品和创意等岗位分工完成：彼此发消息、提问、补充资料，并行处理，按责任交接，再由统筹角色汇总，交负责人确认。协作轮次与预算有上限，随时可以叫停。', 'A complex task can be divided among research, sales, product and creative roles. They message each other, ask questions, fill gaps, work in parallel and hand off by responsibility; a coordinating role consolidates the work for the responsible person to confirm. Collaboration rounds and budgets are capped, and the work can be stopped at any time.') },
  feat2Button: { label: B('认识数字员工', 'Meet the AI Workforce'), href: 'workforce.html' },
  /* P03's ongoing-work heading, one phrase per line: at 768 the box is five
     characters wide, and a forced break is the only break a phrase gets. */
  feat2Lines: [B('工作暂停，', 'Resume the task'), B('背景不必', 'without rebuilding'), B('从头解释。', 'the context.')],
  /* P03's improvement heading on the closing card; M13-05/06 underneath, with
     V6's 复盘成败 / 比较新旧方法 and P03's 「高级改进持续完善」 — this card
     is the page's one body-text place for improvement (the foundation half of
     that availability line is in LX_INTELLIGENCE_CONTEXT.note). About as long
     as the text it replaces: the card grows with its copy, and on a phone the
     copy column is eleven characters wide. */
  ctaTitle: B('把有用的方法<wbr>留下，', 'Keep useful methods.'),
  ctaSub: B('把无效的改动<wbr>撤回。', 'Withdraw ineffective changes.'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('每次执行都留下记录：做了什么，是否达到目标，人在哪里修正过。从成败中复盘出更好的做法，先测试、与现行做法比较，批准后再逐步采用；效果不足可以撤回，失败的证据留给修复或人工处理。高级改进仍在完善。', 'Every run leaves a record: what was done, whether it met the goal and where a person corrected it. Better methods drawn from successes and failures are tested, compared with the current way and adopted gradually after approval. Changes that do not help are withdrawn; failures keep their evidence for repair or human handling. Advanced improvement is still evolving.'),
};

/* The workforce copy from when workforce.html was built on the Lifelogx
   homepage template. No page renders this object whole any more (workforce
   moved to LX_FEATURE_WORKFORCE on the feature template), but three things
   still read parts of it, so it is kept current rather than left to rot:
     - about.html's button label is `store1.name`, and its split heading
       「AI」/「团队」, "AI"/"Team" must stay inside `heroDesc`
       (tools/blocks/cn-about-projects.mjs asserts both languages);
     - the capabilities orbit draws `ctaLogo` as two words
       (tools/blocks/qx-orbit.mjs).
   The rest follows V6 §6 like the live page: 288 is a role directory, teams
   are formed by task (no speed claim), the browser desktop comes first, and
   nothing here says always-on work or mobile approval is available. */
export const LX_WORKFORCE = {
  heroWord: B('数字员工', 'AI Workforce'),
  store1: { name: B('认识数字员工', 'Meet the AI Workforce'), sub: B('288 个专业数字岗位', '288 specialized AI roles'), href: '#lx-teams' },
  store2: { name: B('定价', 'Pricing'), sub: B('从企业需要的层级开始', 'Start at the level you need'), href: 'pricing.html' },
  heroDesc: B('按任务选择岗位，组成 AI 团队，关键决定由人确认。', 'Select roles by task, form an AI team and keep key decisions with people.'),
  tags: LX_TAGS,
  features: [
    { title: B('有岗位', 'Has a job'), text: B('职责、技能、企业知识、可用工具、权限和运行记录，都可以按岗位配置。', 'Responsibilities, skills, enterprise knowledge, permitted tools, access and run history are configured per role.') },
    { title: B('按任务组队', 'Teams by task'), text: B('按岗位、技能、权限与任务复杂度选择员工，明确每个成员的职责。', 'Choose employees by role, skills, access and task complexity, with a clear job for each member.') },
    { title: B('网页桌面', 'Browser desktop'), text: B('网页端是当前重点；语音、自动化与其他终端按开通范围开放。', 'Browser-first; voice, automation and other clients depend on the scope enabled.') },
  ],
  cards: [
    { title: B('市场研究 AI 员工', 'Market Research AI'), text: B('目标市场、需求变化、竞争格局。', 'Target markets, demand shifts, competitive landscape.') },
    { title: B('销售跟进 AI 员工', 'Sales Follow-up AI'), text: B('客户记录、回复与下一步跟进。', 'Customer records, replies and next steps.') },
    { title: B('产品规格 AI 员工', 'Product Spec AI'), text: B('核对需求、配置与参数。', 'Requirements, configurations and specifications checked.') },
    { title: B('报价 AI 员工', 'Quotation AI'), text: B('报价草稿、价格规则与审批依据。', 'Quote drafts, pricing rules and the basis for approval.') },
    { title: B('财务对账 AI 员工', 'Reconciliation AI'), text: B('付款节点、对账与应收提醒。', 'Payment milestones, reconciliation and receivable reminders.') },
    { title: B('内容 AI 员工', 'Content AI'), text: B('按产品与品牌资料准备营销素材。', 'Marketing assets prepared from product and brand information.') },
    { title: B('统筹协调 AI 员工', 'Coordination AI'), text: B('汇总成果与未决问题，交负责人确认。', 'Results and open questions consolidated for the responsible person.') },
  ],
  gradient: [B('网页桌面', 'Browser desktop'), B('多应用与文件', 'Apps and files'), B('表格与报告', 'Sheets and reports'), B('授权网页任务', 'Authorized web tasks')],
  bigText: B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.'),
  bubbles: [
    B('价格', 'Price'), B('利润', 'Margin'), B('正式报价', 'Formal quote'), B('PI', 'PI'), B('重要客户回复', 'Key customer reply'),
    B('关键审批', 'Key approval'),
    B('关键业务动作', 'Critical business action'), B('对外付款', 'Outbound payment'), B('合同条款', 'Contract terms'),
    B('人掌权', 'People decide'), B('AI 干活', 'AI does the work'), B('人工确认', 'Human review'),
  ],
  words: [B('不再', 'No'), B('从零交代', 'starting from zero'), B('丢上下文', 'lost context'), B('反复转述', 'repeated relaying')],
  feat2Title: B('交办之后，进度看得见。', 'After you delegate, progress stays visible.'),
  feat2Sub: B('定时与事件任务，按授权开放。', 'Scheduled and event-based tasks, as authorized.'),
  feat2Card: { title: B('统筹角色', 'Coordinating role'), text: B('研究、销售、产品与内容员工并行处理子任务，互相传递信息、交接结果；统筹角色复核并汇总成果，只把需要人决定的事项交回。', 'Research, sales, product and content roles work on subtasks in parallel, passing information and results to each other; a coordinating role checks and consolidates the output and hands back only what a person must decide.') },
  feat2Button: { label: B('查看定价', 'See pricing'), href: 'pricing.html' },
  feat2Lines: [B('定时任务', 'Scheduled tasks'), B('事件触发', 'Event triggers'), B('按授权范围运行', 'Within authorized scope')],
  ctaTitle: B('别买 AI 工具。', 'Don’t hire AI tools.'),
  ctaSub: B('建立 AI 产能。', 'Build AI capacity.'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('288 个专业数字岗位，按任务选择与派工。', '288 specialized AI roles, selected and assigned by task.'),
};

/* ============================================================= pricing === */

export const PRICING = {
  caption: B('(定价)', '(Pricing)'),
  /* V5 P08, applied on the owner's instruction of 2026-09-17. `title` is the
     Scalora hero's h1 (the span keeps Scalora's lighter second half);
     `introBody` is the paragraph of the cinery header above it
     (tools/blocks/cn-price-hero.mjs), whose two-word wordmark is taken from
     this title. No price, level, inclusion or quantity changes with it. */
  title: B('从需要解决的业务，<span class="sub-title-text">确定合适的配置与服务</span>。', 'Match configuration and support <span class="sub-title-text">to the work you need done</span>.'),
  introBody: B('软件使用、实施配置、内容制作和获客服务不是同一个交付项目。先明确你需要使用哪些功能、连接哪些系统、由谁承担执行，再确定方案范围。', 'Software access, implementation, content production and acquisition services are different deliverables. Define the capabilities, connected systems and responsibilities first, then agree on the scope.'),
  /* The workforce line on the price card (tools/blocks/cn-price-card.mjs): the
     figure, then the sentence split at its first comma. Restored to the live
     wording on the owner's instruction of 2026-09-17; the enterprise page keeps
     its own line (ENTERPRISE.stats[0]). */
  cardStat: { value: '288', text: B('个 AI 员工，在企业设定的权限范围内工作。', 'AI employees, working inside the permissions the company sets.') },
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
  /* Ten questions. The integration answer names what connects in business
     words instead of the tools behind it (V6, 2026-09-16). On the owner's
     instruction of 2026-09-17 the 288 answer and the training answer are the
     live wording again (the training answer keeps "FDE"), and the English
     answer to 「标准版包含什么？」 now lists what the Chinese answer and the
     Standard card list — it used to name a different set of items.
     Questions are unchanged — tools/blocks/cn-price-card.mjs prints the billing
     answer as its card's footnote and rk-price-tiers.mjs prints 「我们该从哪一级
     开始？」 as its lead paragraph, and both find their answer by the question's
     words. */
  faq: [
    [B('288 个 AI 员工是无限使用吗？', 'Are the 288 AI employees unlimited?'), B('不是。288 说的是能力目录的规模。实际可用范围、在跑的任务、并发、额度和第三方服务用量，以签约配置为准。', 'No. The workforce count describes the capability catalogue. Actual access, active workloads, concurrency, credits and third-party usage depend on the contracted configuration.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('软件订阅按年续费。域名、托管与持续制作，按续费方案或第三方实际费用另算。首年建站与内容服务包，不等于每年都重复交付同样的内容量。', 'The software subscription follows its annual renewal terms. Domain, hosting and ongoing production follow the renewal proposal or the relevant third-party charges. A first-year launch package is not a promise of repeated annual content production.')],
    [B('标准版包含什么？', 'What is in Standard?'), B('12 个月云端工作台（最多 5 个标准用户）、企业知识与产品资料首次导入（最多 20 个 SKU）、询盘与 CRM、报价与人工审批、自助线索发现与写入 CRM、年度标准 AI 额度，外加配置一次、培训一次。', 'A 12-month cloud workspace (up to 5 standard users), an initial import of company knowledge and product information (up to 20 SKUs), inquiries and CRM, quotations with human approval, self-service lead discovery with CRM entry, standard annual AI credits, plus one setup session and one training session.')],
    [B('主动获客只在 ¥40,000 的方案里吗？', 'Is AI acquisition only in the ¥40,000 package?'), B('不是。标准版已经包含自助获客：线索发现、公司画像、评分、触达准备与写入 CRM。全球获客版加的是三个月配置后获客运行与 3 份月报，外加它自己的建站与内容交付。', 'No. Standard already includes self-service acquisition: lead discovery, company profiling, scoring, outreach preparation and CRM entry. Global Acquisition adds three months of configured acquisition operation and three monthly reports, alongside its website and content deliverables.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('企业版提供专属环境与私有化部署，面向数据、系统、合规要求更高的企业。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。邮箱、网盘、CRM、ERP 和业务平台，按企业授权接入；哪些信息可以读取、哪些记录可以修改、哪些动作需要审批，按企业逐项确认。系统迁移在企业版里提供。', 'Yes. Email, drives, CRM, ERP and business platforms connect through enterprise authorization; what can be read, what can be changed and what needs approval is confirmed for each company. Migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台能力与模型 / API / 第三方服务用量分开计。各方案额度不同，超出部分按实际用量计费。', 'Platform capability and model / API / third-party usage are separate; each plan carries its own allowance, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How are training and implementation done?'), B('标准版含一次配置与一次基础培训。企业版配专属前置部署工程师，把真实流程直接反馈进平台。', 'Standard includes one setup session and one basic training session. Enterprise comes with a dedicated FDE who feeds real workflows straight back into the platform.')],
    [B('我们该从哪一级开始？', 'Which level should we start at?'), B('从一条流程开始。挑现在最耗时间、最拖增长的那项工作，先跑通，再决定需要哪一级。', 'Start with one workflow. Pick the work that costs the most time or growth, get it running, then decide which level you need.')],
    [B('多公司、多品牌怎么办？', 'What about multiple companies or brands?'), B('多部门、多公司、多品牌、多账号，属于企业版：权限、审批、数据边界各自独立，共用同一支 AI 员工队伍。', 'Multiple departments, companies, brands and accounts belong to Enterprise: separate permissions, approvals and data boundaries on one shared AI workforce.')],
  ],
};

/* ========================================================== enterprise === */

/* The enterprise page as the owner's management and delivery page (V5 P05,
   M15, M16; placed by V6 §8, 2026-09-16). It used to introduce the platform's
   technical components — integration protocols, automation engines, the
   model runtime — and the owner asked for none of that in marketing copy.
   What those components are FOR stays: account authorization, connected
   information, approvals, records, limits and human takeover, each said in
   terms of customers, orders, owners and deadlines.

   The two stat lists below are written once and counted, so the figure in
   front of each sentence is always the number of things the sentence names
   (tools/build-site.mjs fromStudio() checks it again). They sit above
   ENTERPRISE because the object reads them while it is being built.

   The thirteen controls are the same thirteen the stat used to list under
   their engineering names, one for one and in the same order: capability
   centre, identity and permission, approval service, audit ledger, credential
   management, agent guardrails, tenant isolation, failure handling, staged
   release, rollback, evaluation, observability, human in the loop. The list
   is printed joined with 「、」 and with commas, so no item may contain either
   (fromStudio() checks) — otherwise a reader would count more items than the
   figure says. */
const ENT_CONTROLS = [
  B('应用开通管理', 'application access'),
  B('账号与岗位权限', 'account and role permissions'),
  B('关键动作审批', 'approval of key actions'),
  B('操作与审批记录', 'activity and approval records'),
  B('登录凭据集中保管', 'secure keeping of sign-in credentials'),
  B('数字员工的工作边界', 'work limits for AI roles'),
  B('不同企业的数据相互隔离', 'data kept apart between companies'),
  B('出错即停并报告', 'stop and report on failure'),
  B('新做法先小范围试用', 'small trials before wider use'),
  B('效果不足可撤回', 'reversal when results fall short'),
  B('结果核对', 'result checks'),
  B('进度可见', 'visible progress'),
  B('人工接管', 'human takeover'),
];
/* V6 §8.4: web and cloud, a dedicated environment or private deployment,
   confirmed per enterprise. Nothing here is a default service commitment. */
const ENT_DEPLOYMENT = [
  B('网页云端', 'browser-based cloud'),
  B('专属企业环境', 'a dedicated enterprise environment'),
  B('私有化部署', 'private deployment'),
];
const enList = (xs, last = 'and') => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${last} ${xs[xs.length - 1]}`);

export const ENTERPRISE = {
  eyebrow: B('(企业管理与交付)', '(Enterprise control & delivery)'),
  /* V5 P05's headline, 「把工作交给 AI，把决定权留在企业。」, with its second
     「把」 dropped. The h1 is split one character per inline-block and set with
     `text-wrap: balance`, so every character is a break point and the browser
     evens the two lines by width: with the second 「把」 the halves measure
     7.3em | 9em and the best balance moved 「把」 up to the first line
     (「…AI，把」/「决定权…」). Without it they are 7.3em | 8em and the comma is
     the balanced break at every width from 320 to 1920. Same meaning; the
     full sentence is also the footer line on every page. */
  h1: B('把工作交给 AI，决定权留在企业。', 'Delegate the work. Keep the authority.'),
  /* V6 §8.1: the four panels keep their places; each now answers the owner's
     question for that place. The labels are set at up to 144px inside a
     400px panel, so they stay two characters (or one English word). */
  story: [
    { label: B('(决定)', '(Decisions)'), text: B('关键决定由企业掌握。哪些报价、客户触达和内容发布需要审批、由谁批准，企业自己定；付款、正式申报和专业审阅，始终由有权人员确认。', 'Key decisions stay with the company. It decides which quotations, customer outreach and published content need approval, and who approves them. Payments, official filings and professional reviews always stay with authorized people.') },
    { label: B('(核对)', '(Results)'), text: B('结果可以核对。谁做了什么、谁批准、结果是否达到要求、失败卡在哪一步，都有记录。已提交不等于已完成，核对过才算数。', 'Results can be checked. Who did what, who approved it, whether the result met the requirement and where a failure stopped are all on record. Submitted is not finished until the result is checked.') },
    { label: B('(连接)', '(Connect)'), text: B('连接企业已有的业务。邮箱、客户记录、产品知识、ERP 和网盘，经企业授权逐项接入同一个工作流程。不必先假定要换掉现有软件，保留、接入还是调整，按企业情况确认。', 'Connect the business you already run. With company authorization, email, customer records, product knowledge, ERP and shared drives join one workflow, one connection at a time. Replacing current software is not assumed; what to keep, connect or adjust is agreed with each company.') },
    { label: B('(经营)', '(Oversight)'), text: B('看经营，不只看 AI 对话。商机、订单、任务、异常、费用和待审批事项，按负责人和期限呈现给管理者，先处理真正需要决定的事。', 'Watch the business, not just AI conversations. Opportunities, orders, tasks, exceptions, costs and pending approvals reach managers by owner and deadline, so the decisions that matter come first.') },
  ],
  /* V6 §8.2 and M15: the owner cockpit, beside the page's first large picture
     (tools/build-site.mjs puts os-cockpit there — work lanes converging on one
     command centre, an AI concept illustration, not a screen). No figures are
     shown because there is no connected data to show; the text says so. */
  introLabel: B('(老板驾驶舱)', '(The owner’s cockpit)'),
  intro: B('管理者要看的不是 AI 忙了多久，而是谁在做什么、钱花在哪里、客户和订单推进到哪一步。驾驶舱把商机推进、交付状态、用量与预算边界、待审批事项、任务负责人、阻塞和实际结果放在一起。数据只来自已接入的系统，缺的就标明缺失。看得见，管得住，查得清。', 'Managers need more than busy AI: who is doing what, what it costs, and where each customer and order stands. The cockpit brings opportunity progress, delivery status, usage and budget limits, pending approvals, task owners, blockers and actual results together. Figures come only from connected systems; anything missing is shown as missing. Visible, controllable, traceable.'),
  /* V6 §8.4, M16 and V5 F10: the delivery order, one line per step, in the
     slot that used to list deployment options (those are the third stat now). */
  approachLabel: B('(落地顺序)', '(Delivery steps)'),
  approach: [
    B('01 选择一条业务：定目标与验收标准。', '01 Choose one workflow: set the goal and acceptance criteria.'),
    B('02 准备企业资料：产品、客户、知识与规则。', '02 Prepare company context: products, customers, knowledge and rules.'),
    B('03 连接授权账号：可读、可改、需审批，逐项说清。', '03 Connect authorized accounts: what may be read, changed or needs approval.'),
    B('04 配置员工与审批：谁来做，谁来批。', '04 Configure roles and approvals: who does the work, who signs off.'),
    B('05 验证实际成果：用真实样本核对结果。', '05 Validate actual results against real cases.'),
    B('06 再扩大范围：跑通一条，再定下一条。', '06 Expand the scope: prove one workflow, then choose the next.'),
  ],
  approachButton: { label: B('联系 STARGO 前置部署团队', 'Talk to a STARGO FDE'), href: 'contact.html' },
  statsLabel: B('(数字口径)', '(What the numbers count)'),
  stats: [
    /* stats[0] is also read by tools/blocks/cn-price-card.mjs: the value must
       stay a bare figure, and the text is split at its FIRST comma — the noun
       goes beside the figure, the rest becomes a line of its own there. */
    { value: '288', text: B('个专业数字岗位，可按任务组队协作，在企业设定的权限与预算内工作。', 'specialized AI roles that team up by task, working within the permissions and budgets the company sets.') },
    { value: String(ENT_CONTROLS.length), items: ENT_CONTROLS, text: B(`项管理控制：${ENT_CONTROLS.map((x) => x.zh).join('、')}。`, `management controls: ${enList(ENT_CONTROLS.map((x) => x.en))}.`) },
    { value: String(ENT_DEPLOYMENT.length), items: ENT_DEPLOYMENT, text: B(`种部署方式：${ENT_DEPLOYMENT.map((x) => x.zh).join('、')}，按企业需求逐项确认；服务等级属于企业版事项，按项目另行约定。`, `deployment options: ${enList(ENT_DEPLOYMENT.map((x) => x.en), 'or')}, confirmed with each enterprise. Service levels are an Enterprise-plan item agreed per project.`) },
  ],
  /* The pull-quote is M15's value line. P05's headline is the h1 now, so the
     card no longer repeats it. */
  quoteLabel: B('(原则)', '(The principle)'),
  quote: { text: B('「对企业真正重要的是：可管理、可停止、可追踪、可验证，而不是 AI 在对话中声称“已经完成”。」', '“What matters is work you can manage, stop, trace and verify — not an AI message claiming it is done.”'), who: B('STARGO WORK', 'STARGO WORK'), where: B('决定权始终在人', 'People stay in command') },
  /* V5 P05's five management components. V6 §8.3 names usage and budgets and
     pausing with human takeover for these places too; they are carried in the
     first and fourth role lines rather than by dropping account connection. */
  cardsTitle: B('五个管理组件', 'Five management components'),
  cards: [
    { name: B('能力与应用管理', 'Capability & app management'), role: B('(企业开通了什么、哪些工作可做、哪些仍需配置，用量与预算上限多少)', '(Enabled applications, available work, missing setup, usage and budget limits)') },
    { name: B('账号与岗位权限', 'Account & role permissions'), role: B('(明确谁可以查看资料，谁可以修改记录)', '(Who may read information, and who may change records)') },
    { name: B('关键动作审批', 'Approval of key actions'), role: B('(报价、对外触达和重要承诺，由有权人确认)', '(Quotations, outreach and important commitments go to authorized reviewers)') },
    { name: B('工作与结果记录', 'Work & result records'), role: B('(做过什么、谁批准、实际结果是否符合要求；出错即停，可转人工)', '(Actions, approvals and whether actual outcomes meet the requirement; failures stop and pass to a person)') },
    { name: B('账号连接与保护', 'Account connection & protection'), role: B('(通过企业授权连接业务账号，不向不必要的岗位开放访问)', '(Business accounts connected through authorization, with no access for roles that do not need it)') },
  ],
  /* Beside the components: what is available and where the line stays
     (V5 P05 availability, M16-01, F13, F14). The origin story this slot used
     to carry is the About page's (ABOUT.story), unchanged there. */
  noteLabel: B('(开放范围与边界)', '(Scope and boundaries)'),
  note: B('管理与控制已有基础；看板指标、自动动作、跨系统动作和高级分析，依赖真实数据接入与验收。其他功能按企业配置与确认范围分阶段开放，能打开某个应用，不等于整条流程已经验收。部署方式、服务范围和数据要求由双方另行确认，不作默认承诺。付款、正式申报、合同与合规审阅，始终由企业有权人员或相应机构决定。', 'Management and control foundations exist; dashboard figures, automated and cross-system actions and advanced analytics depend on verified data connections. Other capabilities open in phases, by configuration and agreed scope, and opening an application does not mean the whole workflow has been accepted. Deployment, service scope and data requirements are agreed separately, not assumed by default. Payments, official filings, contract and compliance reviews stay with authorized people or the relevant institutions.'),
  /* V5 F10: start with one workflow. At 768 this button's column leaves
     124px for its label (measured): six Chinese characters, or 「Plan a
     workflow」 (120px); 「聊聊你的业务流程」 and 「Discuss your workflow」 wrapped. */
  noteButton: { label: B('规划一条流程', 'Plan a workflow'), href: 'contact.html' },
  /* V6 §8.3 and M14-05: the old integration-method table as a table of the
     business a company already runs. The rows name kinds of work, never a
     platform shown as switched on; the last column is what has to be agreed
     before anything connects, and the caption says nothing is on by default.
     The last row keeps what the automation rows meant, in business terms.
     First-column labels hold no word longer than 「knowledge」: at 768 that
     column is about 75px, and 「conversations」 ran 8px into the next one. The
     count in the title is the row count (awardsTable). The caption is kept
     short enough for one line in the table's sticky column at 768 (about ten
     characters wide there). */
  table: {
    caption: B('(按授权接入 · 逐项确认)', '(Connected per authorization · confirmed item by item)'), title: B('业务连接', 'Connections'),
    headers: [B('(业务)', '(Area)'), B('(可以连接什么)', '(What can connect)'), B('(接入前要确认)', '(Confirm first)')],
    /* Not the whole map: the catalogue group that holds account connection,
       automation and approved actions (V6 §5.8 puts M14 in #g11, 「自动化与日常
       办公」). The label stays within six characters: the button sits in the
       table's sticky left column, which holds seven at 768, and 「查看连接与自动
       化」 left 「化」 on a line of its own there. */
    button: { label: B('查看连接详情', 'See connection details'), href: 'capabilities.html#g11' },
    rows: [
      [B('客户与沟通', 'Customers & messages'), B('邮箱、即时沟通、贸易平台询盘与 CRM 客户记录', 'Email, messaging, marketplace inquiries and CRM records'), B('可以读取哪些对话，谁能代表企业回复', 'Which conversations may be read, and who may reply for the company')],
      [B('产品与知识', 'Products & knowledge'), B('产品资料、规格图片、价格依据与企业文档', 'Product data, specifications, images, price sources and company documents'), B('哪些资料已经审核，可用于回答与报价', 'Which sources are approved for answers and quotations')],
      [B('ERP 与商城', 'ERP & commerce'), B('产品物料、采购库存、生产质检、订单与商城业务', 'Products, materials, purchasing, stock, production, quality, orders and online store'), B('可读取的记录、可修改的字段、需要审批的变更', 'Readable records, permitted changes and changes that need approval')],
      [B('办公与文件', 'Office & files'), B('网盘、表格、文档与共享文件夹', 'Drives, spreadsheets, documents and shared folders'), B('可以访问哪些文件夹，成果存放在哪里', 'Which folders may be opened, and where outputs are saved')],
      [B('财务、物流及其他业务服务', 'Finance, logistics & other services'), B('收付款、物流、签章与第三方数据', 'Payments, logistics, signatures and third-party data'), B('按企业授权与系统情况开放；付款与正式申报由有权人员把关', 'Opened per authorization and system; payments and official filings stay with authorized people')],
      [B('跨系统自动化', 'Cross-system automation'), B('定时任务、事件触发与数据同步', 'Scheduled work, event triggers and data synchronization'), B('先人工跑通、确认规则，再逐步扩大自动执行范围', 'Run it by hand and agree the rules before automating more of it')],
    ],
  },
};

/* ======================================================== capabilities === */

const G = (n, en, zh, items) => ({ n, name: B(zh, en), items });
/* A capability: its product name, its Chinese name, and what it does in both
   languages. The Chinese page shows the Chinese name alone; the English page
   shows the product name alone (block-lib.mjs capTitle). Nobody should have to
   read the other language to use the page. The product name is also the key
   the capability page's blocks look an entry up by, so it is never reworded
   here; the Chinese name and the two glosses are plain copy. */
const I = (name, zhName, zh, en) => [name, B(zh ?? '', en ?? zh ?? ''), zhName ?? name];
export const CAPABILITY_GROUPS = [
  G('01', 'Workspace & Business Overview', '工作空间与经营总览', [I('Boss Cockpit', '企业经营总览', '公司现在在做什么，一屏看完', 'What the business is doing right now, on one screen'), I('Command Center', '企业 AI 指挥中心', '目标交下去，盯着它走完', 'Hand a goal down and watch it carried out'), I('Cloud Workspace', '云端企业工作桌面', '人和 AI 员工共用的云端办公桌', 'The cloud desk your team and its agents share'), I('Mission Control', 'AI 员工与长任务运行中心', '盯住长时间运行的工作，需要时插手', 'Watch long-running work and step in when needed'), I('Execution View', '任务执行过程', 'AI 员工做过什么，逐步回放', 'Replay what an agent did, step by step'), I('System Map', '系统关系图', '业务记录与各系统之间如何关联', 'How business records and systems connect to each other'), I('App Library', '企业 AI 应用库', '企业为各团队开通的内部应用', 'The internal apps a company turns on for its teams'), I('Multi-window Desktop', '多窗口 AI 工作空间', '几件事同时开着，各自不丢进度', 'Several tasks open at once, without losing place'), I('Mobile Companion', '移动办公与任务管理', '离开工位也能跟进度、处理审批；移动端分阶段开放', 'Progress and approvals away from the desk; mobile access is phased'), I('Notification Center', '企业通知', '什么变了，什么在等你', 'What changed, and what is waiting on you'), I('Approval Center', '审批中心', '所有待决事项排在同一个队列里', 'Every pending decision in one queue'), I('Voice Console', '语音指挥 AI', '用语音提需求、建任务，按已开通的服务使用', 'Speak a request or create a task, where voice services are enabled')]),
  G('02', 'Customer Acquisition & Opportunity Research', '主动获客与商机判断', [I('STARGO Growth OS', 'Growth OS 主动获客', '从市场信号到确认后的客户，再交给 Sales Desk', 'From market signals to approved prospects handed to Sales Desk'), I('Trade Signal Accounts', '贸易信号与商机线索', '观察到的贸易活动，沉淀成可跟进的客户', 'Turns observed trade activity into workable accounts'), I('Importer Reorder Radar', '进口商补货雷达', '判断哪些进口商快到补货窗口', 'Estimates which importers may be due to reorder'), I('Competitor Customer Graph', '竞争对手客户图谱', '依据可用的贸易记录，看谁在向同类供应商采购', 'Uses available trade records to see who buys from comparable suppliers'), I('Buying Committee Intelligence', '决策链识别', '谁拍板、谁影响、谁签字', 'Who decides, who influences and who signs'), I('Dealer Opportunity Discovery', '经销商机会发现', '找出产品线正缺你这一块的经销商', 'Finds distributors whose range has a gap you fill'), I('Google Maps Dealer Discovery', '地图经销商发现', '按区域找经销商与分销商', 'Finds distributors and resellers by territory'), I('Opportunity Decisions', '机会决策', '建议跟进、搁置还是放弃，并给出理由', 'Recommends pursue, park or drop, with the reason'), I('Dealer Opportunity Brief', '经销商机会简报', '为何接触这家经销商，一页说清', 'A one-page case for approaching a distributor'), I('Outreach Playbooks', '销售打法生成', '针对这个客户和市场定打法', 'Builds the approach for this account and market'), I('Six-Factor Opportunity Scoring', '六因子机会评分', '按产品、市场、采购信号、联系人、风险与价值六项排序', 'Ranks accounts on product fit, market fit, buying signals, contacts, risk and value'), I('Account Research', '客户研究', '收集企业证据，注明出处', 'Collects company evidence and cites where it came from'), I('Trade Intelligence', '贸易情报', '从现有贸易记录读出需求与走向', 'Reads available trade records for demand and direction'), I('Website AI Sales Engineer', '官网 AI 销售工程师', '官网上回答产品问题，同时留住线索', 'Answers product questions on your site and captures the lead'), I('Dormant Lead Reactivation', '沉睡客户再激活', '给沉睡客户一个重新开口的理由', 'Brings quiet accounts back with a reason to talk'), I('Trade Show Afterburner', '展会线索持续转化', '一叠名片，排成有日期的跟进计划', 'Turns a stack of badges into scheduled follow-up'), I('CRM Automatic Lead Creation', '确认客户写入 CRM', '确认后的客户写入 CRM 并指定负责人，避免重复建档', 'Records the approved account in CRM with an owner, without duplicates'), I('Attribution & Growth Analytics', '结果归因与增长分析', '哪些动作带来了询盘和订单；高级分析按资源配置开放', 'Which actions led to inquiries and orders; advanced analytics depend on resources')]),
  G('03', 'Market Channels & Account Discovery', '市场渠道与客户发现', [I('Reddit GEO', '社区需求侦察', '在买家提问的社区里被找到', 'Be found in the communities where buyers ask questions'), I('Google Search GEO', 'AI 搜索时代的可见性', 'AI 搜索时代，内容能被搜到、被引用', 'Content that search engines and AI answers can find and cite'), I('LinkedIn Outreach', '企业决策人触达', '在决策人活跃的职业平台，经授权后触达', 'Reaches decision-makers on professional networks, with authorization'), I('Facebook GEO', '社交需求信号', '读你所在品类的社交需求信号', 'Reads social demand signals in your categories'), I('Alibaba Inquiry', '平台询盘接入', '平台询盘落到同一条客户时间线', 'Marketplace inquiries land on the customer record'), I('YouTube GEO', '视频渠道信号', '买家在搜什么、看什么', 'Tracks what buyers search and watch in your category'), I('WhatsApp Sales', '即时沟通销售', '许多海外买家常用的即时沟通渠道，经授权接入', 'The messaging channel many overseas buyers use, connected with authorization'), I('Email B2B', '邮件开发与跟进', '邮件触达与后续跟进', 'Email outreach and follow-up'), I('Marketplace Adapter Pack', '电商平台接入', '平台商品与消息，汇入同一条客户记录', 'Connects marketplace listings and messages to one customer record'), I('Channel Plugins', '新渠道接入', '新渠道接入同一套客户与销售流程', 'New channels join the same customer and sales workflow')]),
  G('04', 'Inquiries & Customer Conversations', '询盘与多渠道沟通', [I('Unified Inbox', '统一收件箱', '各渠道汇入同一队列，客户已对应好', 'Every channel lands in one queue with the customer attached'), I('Email Inquiry Processing', '邮件询盘处理', '读来信，直接打开对应客户记录', 'Reads an inbound email and opens the right customer record'), I('Alibaba Inquiry Handling', '平台询盘处理', '平台询盘按同一套流程处理', 'Marketplace inquiry handling'), I('Website Conversation', '官网会话', '官网对话，沉淀为合格询盘', 'Turns a site chat into a qualified inquiry'), I('Conversation Center', '会话中心', '跨渠道的对话集中在一处', 'One place for the conversations across channels'), I('Inquiry Intent Detection', '询盘意图识别', '分清真实采购需求与噪音', 'Separates a real buying request from noise'), I('Spam / Scam Detection', '垃圾与诈骗识别', '假询盘挡在销售队列之外', 'Keeps fake inquiries out of the sales queue'), I('Buyer Requirement Extraction', '买方需求提取', '从自由文本里提取产品、参数、数量与条款', 'Pulls product, spec, quantity and terms out of free text'), I('Company Background Research', '公司背景研究', '回复之前，先核实对方是谁', 'Checks who is asking before you answer'), I('Customer Risk Signals', '客户风险信号', '付款、合规、可信度的疑点，尽早标出', 'Flags payment, compliance and credibility concerns early'), I('Product Matching', '产品匹配', '把提出的需求匹配到已审核产品', 'Matches the stated requirement to approved products'), I('Knowledge-Grounded Reply', '基于企业知识的回复', '依据企业已审核资料起草答复', 'Drafts the answer from approved company sources'), I('Multilingual Reply', '多语言回复', '用买家的语言回复，依据同一份资料', 'Replies in the buyer’s language from the same source material'), I('Human Approval & Escalation', '人工审批与升级', '敏感承诺交给有权限的人', 'Sensitive commitments go to the person allowed to decide'), I('Planned Follow-up', '计划内跟进', '没有回音时，按批准的计划准备下一次触达', 'Prepares the next planned touch, within approved rules, when nothing comes back'), I('Customer Timeline', '客户时间线', '说过什么、发过什么，按时间排成一条', 'One chronological record of everything said and sent')]),
  G('05', 'CRM & Customer Context', 'CRM 与客户全景', [I('Customer CRM', '客户与商机记录', '客户、机会与负责人的那本账', 'The record of customers, opportunities and owners'), I('Account 360', '客户全景', '这个客户的已知信息，一屏看全', 'Everything known about the account on one screen'), I('Customer Workspace', '客户工作间', '每个客户一个工作区，人与 AI 员工共用', 'A shared workspace per customer for people and agents'), I('Contact & Opportunity Management', '联系人与商机管理', '联系人、机会及各自进展', 'Contacts, opportunities and where each one stands'), I('Lead Scoring', '线索评分', '把值得打电话的客户排到最前面', 'Puts the accounts worth calling at the top of the list'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', '问过什么、报过什么价、实际买了什么', 'What they asked for, were quoted and actually bought'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', '下次触达、日期、责任人', 'The next touch, its date and who owes it'), I('Decision-Maker Mapping', '决策人映射', '记下谁决策、谁影响、谁签字', 'Records who decides, who influences and who signs'), I('Customer Evidence', '客户证据', '每条判断都留出处', 'Keeps the source behind every claim on the record'), I('CRM Automation', 'CRM 记录维护', '负责人、阶段与下一步按规则更新，少一些手工录入', 'Updates owners, stages and next actions by rule, with less manual entry')]),
  G('06', 'Products & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', '企业已审核的答案，集中在一处', 'The approved company answer, in one place'), I('Knowledge Center', '知识中心', '已审核的企业答案，在这里保持最新', 'Where approved company answers are kept current'), I('Knowledge Intake', '资料导入', '文档和文件，沉淀成可引用的知识', 'Turns documents and files into answerable knowledge'), I('Knowledge Retrieval', '知识检索', '找出能回答这个问题的那一段', 'Finds the passage that answers the question'), I('Source Retrieval', '原文检索', '取回答案所依据的原文', 'Retrieves the passage an answer is based on'), I('Drive & Document Access', '网盘与文档接入', '直接读团队现有文档，不用先迁移', 'Reads existing team documents without a migration'), I('Product Intelligence', '产品智能', '规格、选配与限制，AI 能据此推理', 'Specifications, options and constraints AI can reason over'), I('Product Center & Library', '产品中心与产品库', '整条流程共用的同一份产品记录', 'One product record the whole workflow reads'), I('Specifications & Images', '产品参数与图片', '买家会追问的那些技术细节', 'The technical detail a buyer asks for'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', '公司以前定过、现在仍然算数的规矩', 'What the company has decided before, and still applies'), I('Evidence Retrieval', '证据检索', '给出答案，附上支撑文档', 'Returns the supporting document with the answer'), I('Source-Grounded Answers', '有据可查的回答', '缺少审核过的来源时明确提示，不编造答案', 'Flags the gap instead of answering without an approved source')]),
  G('07', 'Quotations, PI & Commercial Records', '报价、PI 与商业文件', [I('Quote Studio', '报价工作室', '报价从询盘开始，不从空表格开始', 'Builds the quotation from the inquiry, not a blank sheet'), I('Inquiry → Quote', '询盘到报价', '需求直接落成带价格的草稿', 'Carries the request straight into a priced draft'), I('Product Configuration & Quantity', '产品配置与数量计算', '报的到底是什么，数量多少', 'What exactly is being priced, and how many'), I('Commercial Terms', '贸易条件', '套用约定的付款、交期与质保条款', 'Applies the agreed payment, delivery and warranty terms'), I('Pricing Rules', '价格规则', '按你配置的规则定价，不靠猜', 'Prices from your configured rules, not from guesswork'), I('Margin Guardrails', '利润护栏', '报价越过利润线，没人批就过不了', 'Stops a quote crossing the margin line without approval'), I('Historical Price Context', '历史价格参考', '这个买家、这个市场，以前成交价多少', 'Shows what this buyer and market paid before'), I('Approval Workflow', '审批流程', '例外转给有权拍板的人', 'Routes the exception to the person allowed to decide'), I('Quote Versioning', '报价版本', '每一版都留存，改动也留痕', 'Keeps every version and what changed between them'), I('PI Studio / PI Center', '形式发票中心', '批准的报价转成形式发票，发送另行确认', 'Turns the approved quote into a pro forma invoice; sending is a separate step')]),
  G('08', 'ERP, Orders & Fulfillment', 'ERP、订单与履约', [I('Order Management', '订单管理', '从批准的报价一路跟到交付', 'Tracks the order from approved quote to delivery'), I('Trade Execution', '贸易执行引擎', '批准的商务条件，带进履约环节', 'Carries approved commercial detail into fulfillment'), I('Payment Milestones', '付款节点', '定金、尾款，以及还差什么没到', 'Tracks deposits, balances and what is still outstanding'), I('Production Status & QC', '生产进度与质检', '货在哪一步，检验过没过', 'Where the goods are, and whether they passed'), I('Packaging & Shipment', '包装与出货', '怎么装运，随货走哪些东西', 'How it ships, and what travels with it'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', '按批准的订单数据生成，待人复核', 'Prepared from approved order data, ready for review'), I('Certificate of Origin · Form E', '原产地证 · Form E', '整理申请材料；签发仍归主管机构', 'Organizes the application material; issuance stays with the authority'), I('Bill of Lading Workflow', '提单流程', '运输单据跟着货走', 'Keeps shipping documents moving with the shipment'), I('Certification & Battery Documentation', '认证与电池资料', '认证与电池相关材料按目的国备齐', 'Certification and battery files prepared for the destination market'), I('Export Documentation & Workflow', '出口单证与流程', '出口单据从准备到复核的整条链', 'Export documents, from preparation to review'), I('Export Tax Rebate', '六阶段出口退税流程', '按六个阶段整理退税资料、跟踪进度；申报与受理归主管部门', 'Tracks rebate preparation through six stages; filing and acceptance stay with the authorities'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', '整车、半散件、全散件的装运资料分别整理', 'Keeps built-up, semi- and fully-knocked-down shipments documented separately')]),
  G('09', 'AI Images, Video & Marketing', 'AI 图片、视频与营销', [I('AI Creative Studio', 'AI 创意工作室', '围绕真实产品，组织产品页所需的图片与销售素材', 'Organizes the images and sales material a product page needs, from real product facts'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', '为你的目标销售站点写产品与市场文案', 'Product and market copy for the sites you sell on'), I('Search & AI-search Content', '搜索优化 · AI 搜索可信内容', '内容结构化，既能被搜到，也能被引用', 'Content structured to be found and to be quoted'), I('Multi-language Content', '多语言内容', '同一个产品故事，覆盖目标市场', 'The same product story across your target markets'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', '同一个产品故事，贯通页面、方案与社媒', 'One product story across page, deck and feed'), I('AI Image & Video Workflow', 'AI 图片与视频流程', '按可复用的流程产出产品图片与营销视频', 'Product visuals and marketing videos produced to a repeatable workflow'), I('Viral Structure Adaptation', '爆款结构再创作', '借鉴有效视频的结构，为你的产品做原创改编', 'Adapts a proven video structure into original work for your product'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', '拆解有效视频的开场、节奏与表达', 'Breaks down a working video’s hook, pacing and messaging'), I('Short-form Clip Editing', '剪辑与短视频', '把产品素材剪成社媒短片，按已开放的能力使用', 'Cuts product footage into short social clips, where the capability is enabled')]),
  G('10', 'AI Workforce & Teamwork', '数字员工与团队协作', [I('288 Specialized AI Employees', '288 个专业 AI 员工', '按岗位分工的专业数字岗位目录，按任务选用', 'A role directory organized by job, chosen per task'), I('AI Employee Roster', 'AI 员工名册', '谁在岗，各自负责什么', 'Who is available, and what each one is for'), I('Workforce Panel', '员工面板', '派活、看进度、复核交回来的结果', 'Assign work, watch progress, review what came back'), I('AI Teams & Collaboration', '动态组队与多 AI 员工协作', '一个目标，几个专业岗位分工协作，而不是一次问答', 'Several specialists on one goal, not a single chat reply'), I('AI Employee Communication', 'AI 员工间交流', '员工之间直接发消息、提问与交接，少一些人工转述', 'Employees message each other, ask questions and hand over work, with less relaying by people'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', '每个员工做什么、懂什么、能用什么、记得什么', 'What an employee does, knows, may use and remembers'), I('Shared Enterprise Context', '共享企业上下文', '同一份业务事实，按各自权限使用', 'One set of business facts, used within each role’s permissions'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', '任务拆开、在岗位间流转、并行推进', 'Work splits, moves between roles and runs at once'), I('Scheduled Work', '定时工作', '按时跑的例行研究与跟进', 'Recurring research and follow-up that runs on time'), I('Evidence & Human Approval', '执行证据与人工审批', '审批人拍板前看的那份记录', 'The record an approver reads before deciding')]),
  G('11', 'Automation & Everyday Work', '自动化与日常办公', [I('AI Employee Setup', 'AI 员工工作环境', '为每个 AI 员工配好工具、划定边界', 'Where an AI employee gets its tools and limits'), I('Workflow Automation', '工作流自动化', '跨应用把步骤连起来，不用写代码', 'Connects steps across apps without custom code'), I('Scheduled Data Jobs', '数据整理与定期作业', '流程需要的数据整理与定期处理', 'Runs the data preparation and routine jobs a workflow needs'), I('Long-Horizon Control', '长任务控制', '长时间任务保留目标与进度，可暂停、恢复和接力', 'Keeps long-running work on its goal, with pause, resume and handoff'), I('Browser Automation', '浏览器自动化', '在授权范围内操作网页工具，不绕过登录与安全验证', 'Works web tools within authorization, without bypassing sign-in or security checks'), I('Screen Operation', '界面操作', '无法对接时，在授权环境中操作界面', 'Operates an interface in an authorized environment when integration is not available'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', '按时间跑，或在业务状态变化时跑', 'Runs on a clock, or when the business state changes'), I('Approved Actions & Tool Connections', '授权动作与工具连接', 'AI 员工获准使用的业务动作与工具', 'The business actions and tools an agent is allowed to use'), I('External Connectors', '外部系统连接', '对接团队已在用的系统', 'Reaches the systems your team already runs'), I('Credential Management', '凭据管理', '账号密码统一保管，不交给 AI 员工直接查看', 'Holds the logins so AI employees never see them directly')]),
  G('12', 'Business Relationships & Context', '企业业务关系与上下文', [I('Business Relationship Map', '企业业务关系图', '客户、报价、订单与责任对应起来，AI 据此推进工作', 'Links customers, quotes, orders and owners so AI works from the same picture'), I('Cross-system Identity', '跨系统身份', '同一个客户，在各个系统里都对得上', 'The same customer across every connected system'), I('Customer, Product, Inquiry & Opportunity Records', '客户 · 产品 · 询盘 · 商机记录', '商务一侧的业务记录', 'The commercial side of the business, as records'), I('Quote, Order, Document & Task Records', '报价 · 订单 · 文件 · 任务记录', '执行这一侧，仍挂回同一个客户', 'The execution side, linked back to the customer'), I('AI Employee & Market Signal Records', 'AI 员工 · 市场信号记录', '谁做的，由什么触发', 'Who did the work, and what prompted it'), I('Relationships, Permitted Actions & Business Rules', '业务关系 · 可做的动作 · 业务规则', '记录之间如何关联，允许做哪些动作', 'How your records connect and what may be done to them'), I('Enterprise Context', '企业上下文', 'AI 员工动手前先读的企业状态', 'The company state an agent reads before acting'), I('Operational Records', '经营记录', '经营记录保存在哪里，以哪一份为准', 'Where operating records are kept, and which copy is authoritative')]),
  G('13', 'Permissions, Approvals & Control', '权限、审批与经营控制', [I('Human-in-the-Loop', '人在回路', '明确哪些决定仍须由人来做', 'Names the decisions a person must still make'), I('Approval Service', '审批服务', '待决事项集中一处，等各自的负责人', 'One place where pending decisions wait for their owner'), I('Capability Center', '能力中心', 'AI 员工能调用什么，以谁的名义', 'What agents are allowed to call, and on whose behalf'), I('Permission Control · Identity', '权限控制 · 身份', '谁能看什么、能做什么', 'Who can see what, and who can do what'), I('Identity Check', '身份校验', 'AI 员工动作之前，先验身份', 'Checks identity before any agent action begins'), I('Audit Ledger · Agent Evidence · Action History', '审计台账 · AI 员工证据 · 动作历史', '做了什么、哪个 AI 员工做的、凭谁的授权', 'What was done, by which agent, on whose authority'), I('Guardrails', '护栏', 'AI 员工自己越不过的边界', 'Boundaries an agent cannot cross on its own'), I('Company Data Separation', '企业数据隔离', '按公司和品牌分开的数据边界', 'Separate data boundaries per company and brand'), I('Failure Handling · Rollback', '失败处理 · 回滚', '出错时停下来、退回去', 'Stops on an error and puts things back'), I('Work Visibility', '执行可见', 'AI 员工正在做什么，看得见', 'See what agents are doing while they do it')]),
  G('14', 'Retained Experience & Improvement', '长期经验与持续改进', [I('Improvement Review', '改进复核台', '候选改进在这里复核、发布', 'Where proposed improvements are reviewed and released'), I('Work Observation', '执行观察', '观察真实执行，记录发生了什么', 'Watches real execution and records what happened'), I('Outcome Review', '结果复盘', '记录下的结果，沉淀成候选改进', 'Turns recorded outcomes into candidate improvements'), I('Skill Optimizer', '技能优化', '按实测结果改进一项技能', 'Improves a skill against measured results'), I('Pre-release Testing', '发布前测试', '发布前先测试，再专门找它的漏洞', 'Tests a change, and looks for its weak points, before release'), I('Change Approval', '改进审批', '未经评测和批准，改动发不出去', 'No change ships without evaluation and approval'), I('Attempts · Outcomes · Scores', '过程 · 结果 · 评分', '试了什么、结果如何、评分多少', 'What was attempted, what resulted, how it scored'), I('Skill Library · Trials', '技能库 · 试验', '候选技能存放和试验的地方', 'Where a proposed skill is kept and tried out'), I('Side-by-side Trials · Staged Release · Rollback', '新旧对比 · 小范围试用 · 回退', '先在小范围试，留下或回滚', 'Test a change on a slice, keep it or take it back'), I('Continuous Improvement', '持续改进', '执行结果经过复核，再用来改进下一次', 'Reviewed results feed into the next run')]),
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
     fourth bullet say so — whose roles team up by task. */
  card2: { name: B('逐步扩展到全公司', 'Across the company, in phases'), desc: B('第一条流程验证有效后，按配置与交付范围逐步开放更多业务板块与数字岗位。', 'Once the first workflow proves useful, more business areas and AI roles open in phases, by configuration and agreed scope.'), big: '288', unit: B('(个专业数字岗位)', '(specialized AI roles)'),
    items: [B('Growth OS 与 Sales Desk 两大引擎', 'Growth OS and Sales Desk, the two engines'), B('ERP、履约与 AI 创作', 'ERP, fulfillment and AI creative work'), B('企业知识与业务关系共享', 'Shared company knowledge and context'), B('288 个岗位，按任务组队协作', '288 roles that team up by task'), B('关键决定由有权人批准', 'Authorized people approve key decisions')],
    tlLabel: B('下一步：', 'Next:'), tl: B('看定价', 'see pricing'), button: { label: B('看定价', 'See pricing'), href: 'pricing.html' } },
  faqCaption: B('(常见问题)', '(FAQ)'),
  /* Four slots, four V5 questions that belong on the capability page: how it
     differs from a chat window (F12), the systems a company already has (F11),
     what is available now (F13) and where to start (F10). */
  faq: [
    [B('它和单独使用一个 AI 聊天窗口有什么区别？', 'How is this different from using a standalone AI chat?'), B('重点不在对话形式，而在任务是否连接了企业资料、客户历史、业务应用、责任、审批和结果。STARGO WORK 围绕完整业务流程组织这些信息与工作，而不把一次文字回答当作业务已经完成。', 'The focus is not the chat format. It is whether the work connects enterprise information, customer history, business applications, ownership, approvals and results. STARGO WORK organizes those elements around a business workflow rather than equating a text answer with completed work.')],
    [B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Must we replace our current CRM, ERP, email and drives?'), B('不必先假定全部替换。STARGO WORK 的方向是把现有业务账号和资料连接到同一工作空间。具体保留、接入或调整哪些系统，需要结合企业当前软件和权限逐项确认。', 'A complete replacement should not be assumed. STARGO WORK aims to connect existing accounts and information in one workspace. Which systems are retained, integrated or adjusted depends on the enterprise’s software and access permissions.')],
    [B('所有渠道和全部功能现在都能直接用吗？', 'Is every channel and feature immediately available?'), B('不能仅凭功能介绍这样判断。部分已有应用基础，部分需要企业账号和真实数据接入，企业级主动工作和统一长期记忆等仍在完善。演示与交付应逐项确认，不把能打开页面当作完整流程已经验收。', 'A capability description is not proof of availability. Some applications have foundations, some require enterprise accounts and live data, and enterprise-wide proactive work and unified long-term memory continue to evolve. Confirm each delivery scope and validate the workflow, not just page access.')],
    [B('企业应该从哪里开始？', 'Where should an enterprise start?'), B('先选一条最重要的业务流程，准备产品、客户、知识和规则，连接授权账号，安排数字员工与审批，再用真实样本验证成果。跑通后再扩大范围，而不是第一天就改造全部部门。', 'Choose one priority workflow. Prepare product, customer, knowledge and policy context, connect authorized accounts, assign roles and approvals, then validate real cases. Expand after that first workflow is proven useful.')],
  ],
  moreLabel: B('(想看它跑起来？)', '(Want to see it running?)'),
  more: B('演示按你的业务流程进行：已有基础的部分直接打开看；需要企业账号、真实数据或仍在建设的部分，逐项说明开放条件。', 'The demo follows your workflow: what already has foundations, we open and show; what needs enterprise accounts, live data or is still in development, we explain condition by condition.'),
  moreButton: B('预约企业演示', 'Request a Demo'),
};

/* ============================================================= contact === */

/* The contact page (V5 P07; V6 §9: start from one important piece of work).
   The page asks one question — which workflow first — and the card beside the
   form says what the conversation will cover. The card's label used to read
   「(我们的承诺)」; what it introduces is a way of starting, not a promise, so it
   says that.
   The fields, the endpoint and the consent line are unchanged. The interest
   list is V5 P07's nine labels (applied on the owner's instruction of
   2026-09-17); js/stargo-forms.js submits the selected option's TEXT, so these
   labels are what reaches the inbox. What is new is words around it: a placeholder in
   the message box and one sentence under the button saying that a demo request
   is not a booked meeting (tools/blocks/cn-contact.mjs draws both). */
export const CONTACT = {
  eyebrow: B('(联系)', '(Contact)'),
  h1: B('你最想先改善哪一条业务？', 'Which workflow should work better first?'),
  quote: B('「告诉我们你的行业、产品、目标市场，以及目前最费时间或最容易断开的环节。我们围绕一个具体场景讨论需要的资料、账号、岗位、审批和可验收的结果。」', '“Tell us about your industry, products, target markets and the work that takes too much time or loses continuity. We will discuss the context, accounts, roles, approvals and checkable outcomes for one specific scenario.”'),
  quoteLabel: B('(从一条业务开始)', '(Start with one)'),
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
  options: [
    B('主动获客', 'Customer acquisition'), B('外贸销售与 CRM', 'Trade sales & CRM'), B('报价与 PI', 'Quotes & PI'),
    B('ERP、订单与履约', 'ERP, orders & fulfillment'), B('AI 作图与营销素材', 'AI images & marketing assets'),
    B('AI 视频与爆款再创作', 'AI video & creative adaptation'), B('数字员工与团队协作', 'AI workforce & teamwork'),
    B('企业知识与主动工作', 'Knowledge & proactive work'), B('老板驾驶舱与管理', 'Management & visibility'),
  ],
  /* The message box's placeholder. Only a hint: js/stargo-forms.js names the
     field by its <label>, so the placeholder never reaches the submission. */
  messageHint: B('例如：希望把找客户、跟进和报价接起来；目前使用哪些软件，最常遇到什么问题？', 'For example: connect prospecting, follow-up and quotations. Which tools do you use, and where does the work break down?'),
  submit: B('提交演示需求', 'Send Demo Request'),
  /* Under the button, before the consent line tools/chrome.mjs appends to every
     form. That line already asks the reader to read the privacy policy, so only
     the second half of V5's before-submission note is added here. */
  beforeSubmit: B('演示申请用于了解需求，不代表会议时间已经确认。', 'A demo request helps us understand your needs; it is not a confirmed meeting time.'),
  /* Not drawn by the build: js/stargo-forms.js carries its own copy of this
     sentence (T.fallback) and shows it when a submission cannot be confirmed.
     "Cannot confirm" is kept rather than V5's "was not submitted", because a
     request that timed out may still have been delivered. */
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
  /* The three "keep reading" cards under the notices (V6 names). Only these
     move; the disclosures above — runtime libraries, fonts, imagery and the
     upstream software names — are this page's reason to exist and stay as
     written. The titles are the navigation's own names for the three pages.
     The workforce card says what 288 counts, as every 288 on the site must,
     and no longer claims teams "in seconds". */
  relatedTitle: B('继续看', 'Keep reading'),
  relatedIntro: B('三个入口，看 STARGO WORK 做什么、谁来做、怎样管。', 'Three places to see what STARGO WORK does, who does the work and how it is managed.'),
  related: [
    { tag: B('(14 个能力域)', '(14 capability groups)'), title: B('能力', 'Capabilities'), desc: B('从 Growth OS、Sales Desk 到 ERP 与 AI 创作，从工作空间到持续改进。', 'From Growth OS and Sales Desk to ERP and AI creative work — from the workspace to controlled improvement.'), href: 'capabilities.html' },
    { tag: B('(288 个专业数字岗位)', '(288 specialized AI roles)'), title: B('数字员工', 'AI Workforce'), desc: B('十类企业职能，按任务组成团队，互相沟通、分工协作，一起把事做完。', 'Ten enterprise functions; teams form around the task, talk to each other and finish the work together.'), href: 'workforce.html' },
    { tag: B('(管理与交付)', '(Control & delivery)'), title: B('企业管理', 'Enterprise'), desc: B('看得见进度，管得住审批与预算，查得清结果；从一条业务开始落地。', 'See progress, control approvals and budgets, check the results — and start with one workflow.'), href: 'enterprise.html' },
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
 * Workforce page, built on the Lifelogx feature template (V6 §6; V5 M10, M11,
 * M14, P04, F02, F08).
 *
 * The Intelligence page explains how the company's context and proactive work
 * behave. This one answers a different question, in the order a visitor asks
 * it: which roles there are (288, across ten role groups — the block after the
 * pink panel, `WORKFORCE_ROLE_GROUPS` below), what a role is and how work is
 * handed to a team, where that work happens (the browser desktop), and how a
 * team of roles gets one task done — goal and roles, exchanged information and
 * parallel work, checked results and a person's decision.
 *
 * What it must not say, and why the slots read the way they do:
 *   - 288 is the size of the role directory. Wherever the page states it, the
 *     same sentence or the block beside it says that enabled roles, the size
 *     of a collaboration and permitted actions follow configuration, budget
 *     and access, and that it is not 288 people replaced (V5 G02, M10). The
 *     "not running at once" wording was retired by the owner on 2026-09-17.
 *   - The five hero cards are examples, not the directory: the template's grey
 *     "Views" label says so (「岗位示例」), and the "99.6M" figure slot carries
 *     the role group. No names beyond these, no head counts, no output figures.
 *   - The team scenario is labelled an illustration on every card and in the
 *     paragraph under it. Teamwork itself is available (owner, 2026-09-17):
 *     the page says what bounds it — capped rounds and budgets, stop at any
 *     time, human approval, pause and takeover.
 *   - The browser desktop comes first; voice, automation, external actions and
 *     other clients follow the enabled scope (M14). Nothing on this page says
 *     mobile approval or always-on work is available.
 *   - `answerTabs[0]` is also about.html's heading line (tools/blocks/
 *     cn-about-reviews.mjs, 「四个」/「岗位」) and stays 「岗位」/"Roles".
 */
export const LX_FEATURE_WORKFORCE = {
  /* The two hero lines are split per character on the Chinese page and
     balanced, so each is written as two halves of about equal width that meet
     at a natural break: 「288 个专业」/「数字岗位。」 and 「按工作需要，」/
     「组成 AI 团队。」 wherever a line has to wrap (phones, and 768 for the
     second). V6 §6.1 writes the second line 「组成你的 AI 团队」; with 「你的」
     the halves are 6em and 8.7em, and balance then breaks inside 组成 —
     measured 「按工作需要，组」/「成你的 AI 团队。」 at 390 and 768, and a
     three-line 「按工作需」/「要，组成你」/「的 AI 团队。」 at 320. Without it the
     comma is the break at 320, 390 and 768, and one line from 1024 up.

     The description's last sentence is the short form of M10's availability
     line (the long form is the note under the role-group total). It is cut to
     fit the fourth line at 390 exactly: the longer 「288 是岗位目录数量，启用范围
     受配置、预算和权限约束。」 left 「束。」 alone on a fifth. */
  heroPink: B('288 个专业数字岗位。', '288 specialized AI roles.'),
  heroWhite: B('按工作需要，组成 AI 团队。', 'Build the team your task needs.'),
  heroDesc: B('不是只有外贸销售，也不是 288 个相同的聊天窗口。企业支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务，都有对应的专业角色。288 指岗位目录数量，按配置、预算和权限启用。', 'This is more than a trade-sales team or 288 identical chat windows. Specialized roles span enterprise support, marketing, sales, service, compliance, supply chains, finance, operations, product and engineering, and professional services. 288 is the role-directory count; activation depends on configuration, budget and access.'),
  heroButton: B('预约演示', 'Book a demo'),
  /* Five examples from different role groups — research, sales, product,
     finance and coordination — so the marquee no longer reads as a trade-only
     team. Names stay at the length of 「市场信号 AI 员工」: below 480px the
     card's name panel has room for two lines, not three (stargo-fusion.css,
     "the scattered photo cards under the CTA"). `dept` is the grey label and
     is the same on every card; the build asserts that.

     The English label is the one word "Example", not "Example role": the label
     and the group sit side by side in a row as wide as the name, and "Example
     role" wrapped to two lines on every card (measured at 390 and 768). That
     extra line made the parked name panel 14px taller, and at 768 its first
     line then showed 8.6px above the bottom edge of each card (the template's
     "Team" never wrapped). The card's name already says what the role is.
     The same row sets how wide the name column is, and the round arrow beside
     it gives up the difference: "Example Operations" is 106px, which squeezed
     the arrow to 22px wide at 768 (the template's widest row left 28px), so
     the operations cards say "Ops" in English. */
  roles: [
    { name: B('市场研究 AI 员工', 'Market Research AI'), dept: B('岗位示例', 'Example'), owns: B('市场', 'Marketing') },
    { name: B('销售跟进 AI 员工', 'Sales Follow-up AI'), dept: B('岗位示例', 'Example'), owns: B('销售', 'Sales') },
    { name: B('产品规格 AI 员工', 'Product Spec AI'), dept: B('岗位示例', 'Example'), owns: B('产品', 'Product') },
    { name: B('财务对账 AI 员工', 'Reconciliation AI'), dept: B('岗位示例', 'Example'), owns: B('财务', 'Finance') },
    { name: B('统筹协调 AI 员工', 'Coordination AI'), dept: B('岗位示例', 'Example'), owns: B('运营', 'Ops') },
  ],
  /* The pink panel: what a role is, how work is handed to a team, and the
     desktop it happens in. The heading's three phrases are four characters
     each because the heading box is 192px wide at 768 (4.8 characters of
     40px type); the build's zh-only `keep-all` then lets it break only at
     the commas. The same 192px holds one English word a line, so the longest
     word must fit it: "workspace" did not (it ran 8px out of the box at 768);
     "desktop" does, and is what the panel's third item is about. */
  doTitle: B('有岗位，有团队，有工作台', 'Roles, teams and a desktop'),
  abilities: [
    { title: B('按任务组队', 'Teams formed by task'), text: B('按岗位、技能、企业知识、权限与任务复杂度选择合适员工，明确每个成员负责研究、销售、产品、内容还是数据工作。', 'Choose employees by role, skills, enterprise knowledge, access and task complexity, and give each member a clear job in research, sales, product, content or data.') },
    { title: B('交办与确认', 'Delegate and approve'), text: B('提出业务目标，选择员工或团队，查看任务和成果，并批准关键动作；需要判断或遇到异常时，由人接管。', 'Set a business goal, choose employees or a team, inspect tasks and results, and approve key actions. People take over when judgment or an exception calls for it.') },
    /* M14's summary, its availability line and its roadmap boundary: the
       browser comes first, and native clients, mobile and mini-programs are
       phased — so nothing on this page reads as a shipped phone app. */
    { title: B('网页桌面与 AI 办公', 'Browser desktop and AI office'), text: B('在一个网页桌面里打开业务应用、处理文件、调用数字员工，并连接企业授权的账号。网页端是当前重点；语音、自动化与外部动作按开通范围开放，桌面客户端、移动端与小程序分阶段完善。', 'Open business apps, work with files, call on AI employees and connect authorized business accounts in one browser desktop. The browser comes first: voice, automation and external actions depend on the scope enabled, and desktop clients, mobile and mini-programs are phased in.') },
  ],
  // M14's one desktop, item by item, under the third ability.
  bullets: [
    B('业务应用、文件与素材', 'Business apps, files and assets'),
    B('表格、文档与报告', 'Spreadsheets, documents and reports'),
    B('语音交办，转成任务', 'Voice requests turned into tasks'),
    B('授权网页任务与账号连接', 'Authorized web tasks and connected accounts'),
  ],
  /* The black sticky note beside the desktop item. Nine characters, like the
     string stargo-fusion.css measured for this card (「真正能干活的工作台」),
     so its `text-wrap: pretty` rule still lands on a 3 / 3 / 3 or 3 / 4 / 2
     break on phones.
     On a phone the note is about 70px wide and the round avatar badge of the
     collage overlaps its lower right corner, so the English is written in
     short words: "A business desktop in your browser" lost "browser" and
     "Browser-first today" lost "first" under the badge at 390 (the template's
     own "A workspace that does the work" lost "does the" the same way). The
     grey line under it sits lowest, where the badge reaches furthest in, so
     it is the shortest form of M14's availability line (the desktop item
     beside the note carries the full one): four characters, two words. */
  phoneTitle: B('浏览器里的企业桌面', 'A business desktop on the web'),
  phoneSub: B('网页优先', 'Web first'),
  cardA: { title: B('有岗位的 AI', 'AI with a job'), text: B('每个岗位可以配置职责、技能、企业知识、可用工具、权限、任务和运行记录：分工明确，执行时带着企业背景，也有清楚的范围。', 'Each role can be configured with responsibilities, skills, enterprise knowledge, permitted tools, access, tasks and run history: a defined job, carried out with company context and within a clear scope.') },
  // M10-04, M11-05 and M11-04: what is recorded, why it survives a pause, and what sharing does not open.
  cardB: { title: B('交接有记录', 'Handoffs on record'), text: B('记录负责人、截止时间、任务状态、结果与下一步，暂停或人工接管后仍能接着推进，各成员的工作汇总成可交接的成果。共享任务依据，不等于共享全部数据，也不会转移其他员工的权限。', "Owners, deadlines, task status, results and next steps are recorded, so work can continue after a pause or a human takeover, and each member's work is consolidated into a handoff-ready result. Sharing task context does not open all company data or pass on another role's permissions.") },
  /* The three stacked cards are the team scenario in M11's order, two steps a
     card: goal and roles → information and parallel work → checked results and
     a person's decision. Each heading is two equal halves joined by a comma, so
     the balanced break lands on the comma at every width. `sceneLabel` sits
     above each heading with the card's step number. */
  sceneLabel: B('协作场景示意', 'Illustrative scenario'),
  stackedCard: B('交办目标，分派岗位', 'Set the goal, assign the roles'),
  answersCards: [
    B('交流信息，并行处理', 'Share information, work in parallel'),
    B('复核成果，交人确认', 'Check the results, then a person decides'),
  ],
  /* What the roles say to each other in the second card (P04). They replace
     the template's picture of two chat bubbles, whose English words were
     painted into the image: the bubbles are now page text over the template's
     own text-free blob, so each language page shows its own words. */
  chat: [
    B('请核对产品规格。', 'Check the product specifications.'),
    B('已补充可引用的卖点资料。', 'Supporting product-benefit information has been added.'),
    B('这项承诺需要有权人确认。', 'This commitment needs an authorized reviewer.'),
  ],
  // The small role card inside the desktop collage: one more example role.
  extraRole: { name: B('报告 AI 员工', 'Reporting AI'), owns: B('运营', 'Ops') },
  /* The paragraph under the cards: M11's summary, V6 §6.3's example, M11's
     limits and the phase line. It is the only place the scenario is told as
     sentences. The column is ordinary text flow, so the paragraph grows with
     its copy (nothing clips it). */
  answersBody: B('一个复杂任务可以交给多个数字员工分工完成：重点不在聊天人数，而在信息能否传递、责任是否明确、结果能否交接。协作场景示意：开拓一个新的目标市场。研究员工找到目标企业后，可以把待确认的规格交给产品员工；销售员工据此调整开发策略，创意员工准备匹配的营销素材。统筹角色把结果与未决问题汇总，交给负责人确认。协作次数、预算和可执行动作都有限制，人工审批、暂停与接管始终保留。', 'Complex work can be assigned to a bounded team of AI employees. What matters is information exchange, clear ownership and reliable handoff, not the number of chat windows. Illustrative scenario: entering a new target market. Research can hand specification questions to a product specialist. Sales uses the findings to refine outreach, while creative specialists prepare relevant assets. A coordinator consolidates outputs and unresolved questions for the responsible person to review. Collaboration rounds, budgets and permitted actions are limited, and human approval, pause and takeover remain available.'),
  /* The statement under that paragraph (M11's headline). The Chinese is cut to
     「而是一起做完」 so each half is seven characters: at 768 the column holds
     8.6 characters of 40px type, and 「而是一起把事做完。」 is nine. The
     heading is balanced per character, so the half before the comma must not
     be the shorter one: measured with P04's full wording, every width from 320
     to 1920 broke 「不是各聊各的，而」/「是一起把事做完。」. */
  teamTitle: B('不是各聊各的，而是一起做完。', 'A shared goal, connected work and a coherent result.'),
  // The template's square tile has a follower count painted into the artwork.
  tile: { src: 'assets/stargo-motion/orbit-poster.webp', alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
  /* The display line behind the stacked cards; split per character on the
     Chinese page. Two five-character halves: one line of this size holds 5.8
     to 6.4 characters from 320 to 1440. */
  answersTitle: B('一个目标，一个团队。', 'One goal, one team.'),
  // Three static labels over the team paragraph. [0] is also about.html's heading.
  answerTabs: [B('岗位', 'Roles'), B('协作', 'Teamwork'), B('确认', 'Review')],
  answersCard: B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.'),
  answersButton: B('聊聊你的方案', 'Discuss your plan'),
  storiesTitle: B('文章', 'Stories'),
  storiesSub: B('我们写下来的', 'we write and share'),
};

/* The About page (V5 P06, V6 §9). Its opening card — tools/blocks/cn-about.mjs
   — has one paragraph and no heading, so it reads `title`, a line break, `desc`
   and `closing` as one statement: the headline, what the product is built
   around, and the way to start, right above the demo button. The three
   principles have no slot on the page (the Lifelogx values row is no longer
   drawn); they are kept here, in V5's words, for the day one is.
   Nothing here is company history, an award, a customer count or a backer, and
   nothing names a contracting entity. */
export const ABOUT = {
  eyebrow: B('关于 STARGO WORK', 'About STARGO WORK'),
  title: B('从真实业务出发，把分散的工作连接起来。', 'Start with real work. Connect what comes next.'),
  desc: B('制造业与外贸业务不会在一次回复或一张报价单后结束。客户资料、产品知识、沟通、价格、订单和交付，需要持续协作。STARGO WORK 围绕这些具体工作组织产品：从主动获客与销售切入，再连接经营、内容生产和数字员工。', 'Manufacturing and global trade do not stop at a reply or a quotation. Customer records, product knowledge, conversations, pricing, orders and delivery need ongoing coordination. STARGO WORK organizes its product around these practical needs, starting with acquisition and sales, then connecting operations, creative work and AI teams.'),
  closing: B('先跑通一件事，再扩大到整个企业。', 'Start with one workflow. Expand with verified results.'),
  button: { label: B('预约演示', 'Book a demo'), href: 'contact.html' },
  /* The template shows four named people here. STARGO's role emblems (its own
     conceptual visuals, not portraits) stand for four AI-employee roles instead.
     The fourth was 「调度中枢」/"Orchestrator", an engineering word; V6 calls the
     role that checks and consolidates a team's work a coordinator. */
  circles: [
    { label: B('市场信号 AI 员工', 'Market Signal Agent'), image: 'assets/stargo/avatar-01.png' },
    { label: B('报价 AI 员工', 'Quote Agent'), image: 'assets/stargo/avatar-03.png' },
    { label: B('跟进 AI 员工', 'Follow-up Agent'), image: 'assets/stargo/avatar-05.png' },
    { label: B('统筹 AI 员工', 'Coordinator Agent'), image: 'assets/stargo/avatar-06.png' },
  ],
  bigImage: { src: 'assets/stargo-motion/orbit-poster.webp', alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
  storyTitle: B('我们的来历', 'Our story'),
  story: B(`<p>STARGO WORK 不是从一份 SaaS 产品需求表开始的。它出自真实的制造与外贸业务：怎么找客户、怎么判断客户、怎么快速回复、怎么管产品知识、报价、审批、做 PI、管订单、备出口单证、持续跟进，以及怎么让增长不再只靠加人。</p>
<p>我们的做法是先走进企业的真实流程：软件适应企业，而不是反过来。业务规则、产品知识和审批边界，从实际工作里整理出来，再放进系统。</p>
<p>我们相信 AI 应该真正把活干了，也相信决定权应该留在企业。所以从第一天起，权限、审批、工作记录、结果核对和撤回，就是产品本身的一部分，不是事后补的功能。</p>`,
    `<p>STARGO WORK did not start from a SaaS product spec. It came out of real manufacturing and global-trade operations: how to find customers, judge them, reply fast, manage product knowledge, quote, approve, make the PI, manage orders, prepare export documents, keep following up — and how to grow without only hiring.</p>
<p>Our method starts inside the company’s real workflow: software adapts to the company, not the other way round. Business rules, product knowledge and approval boundaries are drawn from the actual work and then put into the system.</p>
<p>We believe AI should genuinely do the work, and that decisions should stay with the company. So from day one, permissions, approval, work records, result checks and the ability to withdraw a change have been part of the product itself, not features added afterwards.</p>`),
  /* V5 P06's three principles, in its order. Not drawn — see the note above. */
  values: [
    B('人掌握决定权：把重复工作交给 AI，把关键承诺和判断留给有权人员。', 'People keep the decisions: delegate repetitive work while authorized people retain consequential decisions.'),
    B('软件服务真实业务：从企业的一条流程开始，而不是要求企业先迁就一套复杂说法。', 'Software serves real work: start with an actual workflow rather than making the business adapt to abstract terminology.'),
    B('用结果推动改进：看清交付了什么、是否有用，再决定扩大哪些能力。', 'Results drive improvement: review what was delivered and whether it helped before expanding the scope.'),
  ],
  /* Not drawn either (the Lifelogx careers rows). The sub-lines used to point at
     the nine-stage loop and the old module names; they now name the V6 areas. */
  startTitle: B('从一条流程开始', 'Start with one workflow'),
  starts: [
    { name: B('询盘与客户跟进', 'Inquiries & follow-up'), sub: B('Sales Desk · 沟通、CRM 与跟进', 'Sales Desk · conversations, CRM and follow-up') },
    { name: B('报价与 PI', 'Quotes & PI'), sub: B('Sales Desk · 报价、审批与正式版本', 'Sales Desk · quotes, approvals and final versions') },
    { name: B('主动获客', 'Customer acquisition'), sub: B('Growth OS · 发现与判断目标客户', 'Growth OS · find and qualify accounts') },
    { name: B('订单与出口单证', 'Orders & export documents'), sub: B('ERP · 订单、单证与出货', 'ERP · orders, documents and shipping') },
    { name: B('营销内容', 'Marketing content'), sub: B('AI 创作 · 图片、详情页与多语言内容', 'AI creative · images, detail pages and multilingual content') },
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
      picks: ['Account Research', 'Trade Intelligence', 'Importer Reorder Radar', 'Buying Committee Intelligence', 'Opportunity Decisions', 'Dealer Opportunity Brief', 'CRM Automatic Lead Creation'],
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
      picks: ['Unified Inbox', 'Inquiry Intent Detection', 'Buyer Requirement Extraction', 'Customer Risk Signals', 'Knowledge-Grounded Reply', 'Account 360', 'Planned Follow-up'],
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
      /* ERP and fulfillment (V5 M05 + M06, V6 §5.5). The marquee is `label`; the
         six cards are CAP_V6A.operations (six operating themes, not register
         items). The boundary is said on the two cards it belongs to. */
      label: B('ERP 与履约：前端拿订单，后台接得住', 'ERP & fulfillment: from winning orders to delivering them'),
      groups: ['08'],
      promise: B('把销售前端与企业经营后台放到同一个桌面：不仅知道客户要什么，也知道产品、物料、库存、生产、订单与收款在哪里。', 'Bring sales and operating systems into one desktop, connecting demand with products, materials, inventory, production, orders and commercial records.'),
      picks: ['Order Management', 'Payment Milestones', 'Production Status & QC', 'Commercial Invoice · Packing List', 'Certificate of Origin · Form E', 'Bill of Lading Workflow', 'Export Documentation & Workflow'],
      output: B('订单里程碑、付款提醒、资料清单、异常事项、售后记录与复购跟进。', 'Order milestones, payment reminders, document checklists, exceptions, service records and reorder follow-up.'),
      connection: B('获客 → 销售 → ERP / 履约 → 财务协同 → 售后复购 → 新一轮增长。', 'Acquisition → sales → ERP / fulfillment → finance coordination → support and repeat sales → renewed growth.'),
      availability: B('已有 ERP 与商城应用基础；跨系统协同按企业配置验收，履约、物流、财务与服务按接入情况分阶段交付。', 'ERP and commerce foundations exist; cross-system work is validated per enterprise, and fulfillment, logistics, finance and service are delivered in stages as systems connect.'),
      caveat: B('正式申报、签发与资金支付仍由相应有权人员和机构处理；单据准备与流程协同不替代专业合规审查。', 'Official filings, issuance and payments stay with the authorized people and institutions; document preparation and workflow support do not replace professional compliance review.'),
    },
    {
      image: 'brand-family-01',
      label: B('为产品和市场做内容', 'Create content for products and markets'),
      groups: ['09', '03'],
      promise: B('产品和销售素材，用的就是销售流程那一份审核过的产品资料，再按买家和答案引擎找得到的方式组织。', 'Product and sales material is produced from the same approved product information the sales workflow uses, then structured so buyers and answer engines can find it.'),
      picks: ['AI Creative Studio', 'Product · Sales · Social Content', 'Search & AI-search Content', 'Multi-language Content', 'AI Image & Video Workflow', 'Viral Structure Adaptation', 'Short-form Clip Editing'],
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
      picks: ['288 Specialized AI Employees', 'Workforce Panel', 'AI Teams & Collaboration', 'Task Delegation · Handoff · Parallel Execution', 'Role · Skills · Tools · Memory', 'Approval Center', 'Mobile Companion'],
      output: B('按责任汇总的结果、成员之间的交接记录，以及清楚的下一步。', 'Consolidated results, clear handoffs and assigned next steps.'),
      connection: B('288 个专业岗位，按任务选用、组队协作，不等于替代 288 名真人。', '288 specialized roles, chosen per task and teaming up for the work — not a claim to replace 288 people.'),
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
        [B('有据可查的回答', 'Answers with sources'), B('注明依据的资料；缺少资料时明确提示', 'Each answer names its source; gaps are flagged')],
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
      label: B('权限、审批与记录', 'Approvals and records'),   // one line in English: a two-line label rose into node 04's open panel
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
        [B('结果复盘', 'Outcome review'), B('成功与失败整理成候选改进', 'Wins and losses become candidates')],
        [B('采用前测试', 'Tested before adoption'), B('先测试、比较，再交人批准', 'Tested, compared, then approved')],
        [B('小范围试用', 'Trial on a slice'), B('先在部分工作中试，保留或撤回', 'Tried on part of the work first')],
        [B('核对业务结果', 'Check the result'), B('不只看“执行过”，还核对是否达标', 'Checked against the goal')],
      ],
      caveat: B('改进经测试和批准后采用，可以撤回。', 'Tested and approved first; can be withdrawn.'),
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
  /* #story-4 — ERP and fulfillment (tools/blocks/rk-testimonials.mjs): V6
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
        text: B('产品档案、规格、物料清单与供应商资料保持一致，订单需求衔接采购与到货跟进。已有 ERP 与商城基础，跨系统协同和 AI 操作按企业配置验收。', 'Product records, specifications, bills of materials and suppliers stay consistent, and order demand links to purchasing and deliveries. ERP and commerce foundations exist; cross-system work and AI actions need enterprise-specific configuration and validation.') },
      { title: B(`库存、生产${ZW}与质检`, 'Stock, production & quality'),
        text: B('看清可交付数量与缺货，跟踪生产任务、物料需求、质检、包装与交期。', 'See available stock and shortages; track production tasks, material needs, quality checks, packing and lead times.') },
      { title: B(`订单与${ZW}付款节点`, 'Orders & payment milestones'),
        text: B('订单、订金、尾款、发票与对账提醒对应起来；资金支付由有权人员批准，AI 不擅自付款。', 'Orders, deposits, balances, invoices and reconciliation reminders line up; payments are authorized by people, never by AI alone.') },
      { title: B(`外贸单证${ZW}与出口资料`, 'Trade documents & export records'),
        text: B('准备并核对商业发票、装箱单、原产地证 / Form E 资料、提单、认证与出口退税资料；正式申报由企业有权人员提交，签发与审批由主管机构完成。', 'Prepare and check commercial invoices, packing lists, certificate of origin / Form E materials, bills of lading, certifications and export tax-rebate records; official filings are submitted by authorized people, and issuance and approval stay with the authorities.') },
      { title: B('物流与交付', 'Logistics & delivery'),
        text: B('运费询价、订舱、物流轨迹、预计到达与异常处理，运输单据跟着交付走；范围取决于企业接入的货代与物流系统。', 'Freight quotes, bookings, tracking, arrival estimates and exceptions, with shipping documents following delivery; the scope depends on the forwarding and logistics systems connected.') },
      { title: B(`售后、渠道${ZW}与复购`, 'Service, channels & reorders'),
        text: B('保修、退换货、备件与经销商支持，商城业务与补货建议，把成交后的生意接下去；按系统接入情况分阶段交付。', 'Warranty, returns, spare parts, dealer support, commerce and reorder suggestions — the business after the sale, delivered in stages as systems connect.') },
    ],
    link: { label: B('ERP 与履约详情', 'ERP & fulfillment details'), href: '#g08' },
    /* The six portraits were the donor's testimonial sitters: beside an
       operating theme a face reads as a customer quote this company does not
       have. This site's own abstract avatars stand in (decorative). */
    icons: ['avatar-07', 'avatar-08', 'avatar-09', 'avatar-10', 'avatar-11', 'avatar-12'],
  },
  /* #story-6 — AI roles as a team (tools/blocks/qx-projects.mjs): V6 §5.7's
     three cards. The large card is the teamwork example and says it is an
     illustration and that the employees message each other and work in
     parallel (available, owner 2026-09-17). Links go to the
     workforce page, where M10/M11 are told in full, and to the catalogue
     group for the role and task entries. Pictures are this site's editorial
     art for specialised roles and parallel work. */
  team: {
    arrowHref: 'workforce.html',
    cards: [
      { title: B(`288 个${ZW}跨部门${ZW}专业岗位`, '288 cross-functional specialist roles'),
        text: B('岗位目录，按任务选用、组队协作；不替代真人。', 'A role directory, chosen per task and working as teams — not a replacement for people.'),
        href: 'workforce.html#lx-role-groups', pill: B('认识数字员工', 'Meet the AI Workforce'), image: 'phone-agents' },
      { title: B(`员工任务、${ZW}进度与成果`, 'Tasks, progress and results'),
        text: B('谁在做什么、哪里在等待、交付了什么，关键动作由人批准。', 'Who is doing what, what is waiting and what was delivered, with key actions approved by people.'),
        href: '#g10', pill: B('员工能力组', 'AI workforce group'), image: 'mobile-agents' },
      { title: B(`团队分工、${ZW}交流、${ZW}并行与接力`, 'Roles, exchange, parallel work and handoffs'),
        text: B('协作示意：市场研究员工找到目标企业，产品员工核对规格，销售员工规划开发，创意员工准备素材；员工之间直接交流、并行推进，统筹角色复核汇总后交负责人确认。图为示意，不是实时运行画面。', 'Illustrative: research finds target accounts, a product specialist checks specifications, sales plans outreach and creative prepares assets; the employees message each other and work in parallel, and a coordinator reviews and consolidates the package for the responsible person to confirm. The picture is an illustration, not a live view.'),
        href: 'workforce.html#lx-team', pill: B('看团队协作', 'See teamwork'), image: 'brand-family-03' },
    ],
  },
};
// V6-A-END




/* ===== V6 B: creative topics (#story-5) =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-B-START
/**
 * The creative section of the capability page (`#story-5`, tools/blocks/cn-faq.mjs):
 * V6 §5.6's seven topics, in V6's order, with the answers V5 M07–M09 supply.
 *
 * Why a list of its own rather than `CAPABILITY_SHOWCASE.stories[4].picks`: the
 * seven rows used to print seven catalogue entries' one-line glosses, and V6
 * found exactly that too thin — image and video were one row, and nothing said
 * what goes in, what comes out or what is still being built. The topics are
 * named for the result a buyer cares about, so they are no longer catalogue
 * names. `covers` keeps the tie to the register: it lists the catalogue entries
 * each topic now explains, and the block refuses to build if any entry the
 * story used to show is covered by no topic ("没有删掉旧内容", V6 §5.6).
 *
 * Every answer reads in the same order — what you provide, what work is
 * organized, what you review or receive — and ends on its conditions (`note`,
 * printed after `noteLabel`). Topics 2 and 3 carry V6's own three paragraphs
 * word for word (body[0], body[2] and note for video; body[0], body[2] and
 * note for adaptation); the paragraphs between them are the V5 M08/M09 detail
 * V6's text does not carry — the reviewable plan, authorized assets, budgets
 * and approvals; provenance and usage rights, the no-borrowed-claims rule and
 * what is handed back — so no condition is lost by using the shorter text.
 * The other five are built from M07 and keep M07's availability sentence
 * verbatim; 5 and 6 add M07-06's separate authorization for publishing, and 7
 * adds M09-05's "per enabled capability" for repurposing and reframing.
 *
 * `flow` is the short step row V6 §10 asks to read before the paragraphs,
 * kept as text: the two languages must list the same number of steps.
 *
 * `keep` names the runs of a title that must not be split across two lines
 * (the block sets them `nowrap`): measured at 320px, 「爆款结构再创作」 broke as
 * 「爆款结构再」/「创作」, 「一键生成视频」 as 「一键生成」/「视频」 and "Short-form"
 * after its hyphen. A status after 「 · 」 (none today: video and viral
 * adaptation are available since 2026-09-17) is always kept whole. Each run is
 * at most 150px at the heading's 20px, inside the 189px the heading has at
 * 320px.
 */
const CREATIVE_NOTE = B('创意工作室已有基础；营销套件、局部检查与一键编排持续整合。', 'The creative workspace is present; packaged marketing, local checks and one-click workflows are being integrated.');
const CREATIVE_PUBLISH = B('发布到外部渠道需要单独授权。', 'Publishing to external channels requires separate authorization.');
const creativeNotes = (...parts) => B(parts.map((p) => p.zh).join(''), parts.map((p) => p.en).join(' '));
export const CREATIVE_TOPICS = {
  /* The pill over the two-word heading. It names the whole section, which the
     old story label (「为产品和市场做内容」) did not: images and video were the
     part a reader could not find. One line, `overflow: hidden` — keep short. */
  label: B('AI 作图、视频与营销内容', 'AI images, video & marketing'),
  /* The line beside the button: a link to this section's catalogue group, with
     the group number appended by the block. About 150px is free there in
     English at 992px (see cn-faq.mjs), so the words stay this short. */
  catalogueLink: B('对应能力组', 'Catalogue group'),
  noteLabel: B('开放说明：', 'Availability: '),
  items: [
    {
      id: 'creative-images',
      title: B('AI 作图与图片编辑', 'AI Images & Editing'),
      covers: ['AI Creative Studio', 'AI Image & Video Workflow'],
      body: [
        B('提供文字说明、产品参考图或已有素材，在同一个工作流里生成和编辑图片：白底主图、场景图、海报、卖点图和广告创意。',
          'Provide a written brief, product reference images or existing assets, and generate and edit images in one workflow: product heroes on white, scenes, posters, benefit graphics and advertising concepts.'),
        B('制作时套用企业统一的品牌资产、标志、配色、语气和已确认的产品事实；外观、参数或文字不准确的地方，先检查再局部修正，降低素材“好看但不真实”的风险。你查看的是可以比较、可以继续修改的图片版本。',
          'A shared brand kit — logo, colors and tone — and verified product facts guide the work. Inaccurate appearance, specifications or text are checked and corrected locally, reducing attractive but misleading content. You review image versions you can compare and keep refining.'),
      ],
      note: CREATIVE_NOTE,
    },
    {
      id: 'creative-video',
      title: B('AI 一键生成视频', 'One-click Video'),
      keep: B(['AI 一键生成视频'], []),
      covers: ['AI Image & Video Workflow'],
      flow: {
        label: B('一键视频流程', 'One-click video flow'),
        steps: B(['制作需求', '脚本', '分镜', '画面', '配音', '字幕', '审核与导出'], ['Brief', 'Script', 'Storyboard', 'Visuals', 'Voiceover', 'Captions', 'Review and export']),
      },
      body: [
        B('输入产品资料、参考图片、目标市场、语言、时长和画幅，把制作需求组织成一个视频项目。流程涵盖脚本、分镜、画面、配音、字幕、审核和导出，保留素材、任务状态与版本，减少工具切换与反复交接。',
          'Start with product facts, reference images, audience, language, duration and aspect ratio. Organize the brief into a video project covering scripts, storyboards, visuals, voiceover, captions, review and export, while retaining assets, task status and versions.'),
        B('生成之前，先形成一份可审阅的制作方案：开场吸引点、卖点表达、镜头顺序、节奏与结尾行动引导。画面以已确认的产品事实和品牌规范为准，并保留质量检查；多语言旁白、音乐、品牌标志、片尾和参数标注在后期加入，均按可用工具和已授权素材制作。生成预算、审批与任务状态随项目记录。',
          'Before generation, the workflow prepares a production plan for review: the hook, benefits, shot order, pacing and call to action. Visuals are grounded in verified product and brand information, with quality checks. Multilingual narration, music, branding, end cards and specification overlays are added in post-production, using available tools and authorized assets. Generation budgets, approvals and task status are recorded with the project.'),
        B('产品介绍、广告、品牌宣传与社媒短片，都围绕同一套产品和品牌资料展开，可输出横版、竖版、方版；失败镜头单独重做，不必推倒整条视频。',
          'Product explainers, advertisements, brand films and social clips use the same verified product and brand context, in portrait, landscape and square formats; a failed shot is redone on its own rather than regenerating everything.'),
      ],
      note: B('交付的是可播放、可导出的视频文件，而不只是“任务完成”的提示；生成前可审阅制作方案，成片经人工审核后再发布，生成按企业开通的服务与额度计量。',
        'What you receive is a playable, exportable video file, not merely a completion message. The production plan can be reviewed before generation, finished videos are reviewed before they are published, and generation runs within the services and credits the company enables.'),
    },
    {
      id: 'creative-viral',
      title: B('爆款结构再创作', 'Viral Creative Adaptation'),
      keep: B(['再创作'], []),
      covers: ['Viral Structure Adaptation'],
      /* The Chinese steps are the short row the brief gives; the English uses
         M09's own words for the same five steps. M09's full row also names the
         call to action and the new hook, scene or market of each direction —
         the Chinese row leaves those to the paragraphs, so the English does
         too, and both languages carry the same steps. */
      flow: {
        label: B('再创作流程', 'Adaptation flow'),
        steps: B(['有权使用的参考视频', '拆解开场、节奏与镜头', '结合自身产品和品牌', '三个原创方向', '制作与审核'], ['Authorized reference', 'Analyze hook, pacing and shots', 'Apply your product and brand', 'Three original directions', 'Production and review']),
      },
      body: [
        B('输入有权使用的参考视频与自己的产品素材，先分析开场吸引点、镜头功能、节奏、产品出场和行动引导，再结合自身产品、品牌与市场组织原创脚本和分镜。',
          'Use an authorized reference video and your own product assets to examine the opening hook, shot purpose, pacing, product reveal and call to action. Rebuild the concept as original scripts and storyboards grounded in your product, brand and market.'),
        B('开始前记录参考素材的来源、使用权与制作目标；卖点只取自企业已确认的产品事实，不把参考片里的说法当作自己的事实。',
          'Before work starts, the reference’s source, usage rights and production goal are recorded. Claims come only from your verified product facts, never from the reference video.'),
        B('以不同开场、场景或表达方向规划三个原创版本，说明各版变化点，衔接视频制作、审核与多尺寸输出，并保留反馈以供后续比较。',
          'Plan three original adaptations with declared changes to the hook, scene or messaging. Connect the selected work to production, review and output formats, keeping feedback for future comparisons.'),
        B('你收到的是结构说明、原创脚本与分镜、各版变化点和后续制作任务；接入渠道数据后，可再比较各版表现。',
          'You receive a structural analysis, original scripts and storyboards, the declared differences between versions and the follow-on production tasks; where channel data is connected, the versions can then be compared on performance.'),
      ],
      noteLabel: B('边界与开放说明：', 'Boundaries and availability: '),
      note: B('这里的“复刻”指借鉴结构，不直接复制原片、人脸、声音、音乐、标志或水印；参考视频须有权使用，也不承诺必成爆款。',
        'Adapt the structure rather than copying footage, faces, voices, music, logos or watermarks. Reference videos must be ones you are entitled to use, and viral performance is not guaranteed.'),
    },
    {
      id: 'creative-kits',
      title: B('商品营销套件、详情页与图册', 'Product Marketing Kits & Catalogs'),
      covers: ['AI Creative Studio'],
      body: [
        B('选定产品、目标市场、销售平台和语言，一次规划主图、卖点图、细节图、参数图、品牌展示图与配套文案，减少逐张反复下指令。',
          'Choose the product, target market, sales platform and language, then plan hero images, benefit graphics, detail shots, specification graphics, brand visuals and supporting copy in one coordinated workflow, with fewer repeated instructions.'),
        B('同一套产品资料继续延伸为商品详情页、宣传图册、产品介绍和销售支持资料；品牌标志、关键参数、价格和文字放在可核对的排版里，便于逐项确认。成果可以继续用于销售、官网、商城和社交平台。',
          'The same product facts extend into detail pages, catalogs, product introductions and sales collateral. Logos, specifications, prices and text stay in checkable, controlled layouts, ready to confirm item by item and to reuse across sales, websites, commerce and social channels.'),
      ],
      note: CREATIVE_NOTE,
    },
    {
      id: 'creative-multilingual',
      title: B('多语言文案与社媒内容', 'Multilingual & Social Content'),
      covers: ['Product · Sales · Social Content', 'Multi-language Content'],
      body: [
        B('从已确认的产品资料、目标市场和语言出发，撰写社媒、产品和销售文案并做多语言本地化，让同一个产品故事贯通产品页面、销售方案与社媒。',
          'Start from confirmed product information, target markets and languages. Write social, product and sales copy and localize it, so one product story runs through product pages, sales decks and social feeds.'),
        B('营销活动的文案与发布素材围绕同一个故事准备，按市场和渠道整理成可以审阅的文字与配图组合。',
          'Campaign copy and publishing materials are prepared around the same story and organized by market and channel into text and visuals you can review.'),
      ],
      note: creativeNotes(CREATIVE_NOTE, CREATIVE_PUBLISH),
    },
    {
      id: 'creative-search',
      title: B('官网、搜索与 AI 搜索内容', 'Website & Search Content'),
      covers: ['Search & AI-search Content'],
      body: [
        B('提供产品资料、目标市场和你正在经营的销售网站，为官网产品页与市场页撰写文案，并按目标语言本地化。',
          'Provide product information, target markets and the websites you sell through. Copy for product and market pages is prepared and localized into your target languages.'),
        B('内容按搜索引擎和 AI 搜索的阅读方式规划：结构清楚、事实可核对、说法有出处，目标是让买家更容易找到你，也让 AI 搜索准确引用；搜索排名和引用结果不作保证。你收到的是内容规划和页面文案，确认后再上线。',
          'Content is planned for how search engines and AI search read it: clear structure, checkable facts and cited sources. The aim is to help buyers find you and AI search quote you accurately; rankings and citations are not guaranteed. You receive a content plan and page copy to approve before anything goes live.'),
      ],
      note: creativeNotes(CREATIVE_NOTE, CREATIVE_PUBLISH),
    },
    {
      id: 'creative-assets',
      title: B('素材、版本与短视频剪辑', 'Assets, Versions & Short-form Editing'),
      keep: B([], ['Short-form']),
      covers: ['Short-form Clip Editing', 'AI Creative Studio'],
      body: [
        B('把制作需求、步骤、参考素材，以及图片、视频和音频放进同一个创意工作空间；每个项目保留版本与素材库，成熟的制作流程可以直接复用。',
          'Keep briefs, production steps, references, images, video and audio in one creative workspace. Each project retains its versions and asset library, and proven production workflows can be reused.'),
        B('已有的产品视频可以剪成社媒短片，长视频拆条、竖屏改版和字幕适配也在这里衔接。每次改动都有版本记录，目标是只重做需要修改的镜头或局部，不必每次从头再来。你得到的是带版本记录的素材库，以及按已开放能力剪出的短片。',
          'Existing product footage can be cut into short social clips, with long-video repurposing, vertical reframing and caption adaptation connected here. Every change is versioned; the goal is to redo only the shot or section that needs it rather than starting over. You get a versioned asset library and clips cut with the capabilities enabled for you.'),
      ],
      note: creativeNotes(CREATIVE_NOTE, B('长视频拆条、竖屏改版与字幕适配按已开放能力执行。', 'Repurposing, reframing and caption adaptation depend on enabled capabilities.')),
    },
  ],
};
// V6-B-END




/* ===== V6 C: capability catalogue detail (#g01–#g14, #atlas) =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-C-START
/* What each catalogue group actually does (V5 M02–M16, placed by V6 §5.8).

   The fourteen rows at the foot of the capability page used to open onto
   their register entries alone — a name and a few words each — so a reader
   who followed a "details" link landed on an index with no explanation.
   Each group now opens with its detail first and keeps the register below it
   as the index:

     summary      the group's public one-line explanation (V5 P02)
     parts[]      one per V5 topic, or per plain sub-heading where a group
                  carries several topics (g08: ERP / delivery / service):
                    heading       optional sub-heading
                    lede          the V5 topic summary
                    points[]      the V5 detail items, bold title + text;
                                  `id` is the V5 item number
                    roles         g10 only: the ten role groups and counts
                    value         V5's value / boundary line
                    outputs       V5's business outputs
                    availability  V5's availability note for that topic —
                                  kept beside the topic, never only in a footer

   tools/build-site.mjs (capabilityShowcase) renders this and asserts that
   every group has a detail, that every V5 detail item listed in
   CATALOGUE_V5_ITEMS appears exactly once, and that the role counts add up to
   the 288 the heading states. The Chinese text is V5's Chinese: besides the
   product names Growth OS, Sales Desk, ERP, CRM, PI and AI it keeps only the
   proper names V5's Chinese itself uses and that have no Chinese form —
   WhatsApp as a customer channel, Form E and HS 编码 as trade documents —
   and puts V5's MOQ, BOM, FAQ, Logo and SEO / GEO into Chinese words. */
const CP = (id, zhTitle, enTitle, zh, en) => ({ id, title: B(zhTitle, enTitle), text: B(zh, en) });

export const CATALOGUE_LABELS = {
  outputs: B('工作成果', 'Business outputs'),
  availability: B('开放说明', 'Availability'),
  register: B('目录条目', 'Register entries'),
  /* The band note's count. 14 groups and 157 entries are register figures —
     what is documented, grouped — not a feature total and not a statement that
     each entry is live (V6 §5.8). V5's 94 explanatory items are a third,
     different count and are not added in. The figure and what it means are
     two pieces so the band can wrap between them rather than inside a word. */
  count: (groups, entries) => ({
    size: B(`${groups} 个能力组 · ${entries} 条目录条目`, `${groups} groups · ${entries} register entries`),
    meaning: B('（登记范围，不代表均已上线）。', '(the documented scope, not a claim that every entry is live).'),
  }),
};

/* V5 detail items the catalogue must carry, each exactly once. M01 is the
   homepage overview; M10 has four items and the role table. All six M16
   items stand together in g13's "what is enabled" part, so the scope reads
   whole in one place; M16-03 (video) and M16-04 (teamwork, context, memory)
   are also said again, in their own words, in the availability notes of g09,
   g10, g12 and g14, because V5 G03 wants each of those conditions beside its
   own topic and not only in a general note. */
export const CATALOGUE_V5_ITEMS = [
  ...['M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16']
    .flatMap((m) => [1, 2, 3, 4, 5, 6].map((i) => `${m}-0${i}`)),
  'M10-01', 'M10-02', 'M10-03', 'M10-04',
];

export const CATALOGUE_DETAIL = {
  '01': {
    sources: ['M14', 'M15'],
    summary: B('应用、文件、目标、任务与经营重点，在同一个工作空间组织。', 'Organize applications, files, goals, tasks and business priorities together.'),
    parts: [
      {
        heading: B('工作空间', 'The workspace'),
        lede: B('像使用一台企业专属电脑一样，在一个网页桌面里打开业务应用、处理文件、调用数字员工、连接外部账号并执行授权任务。', 'Work in a company-specific desktop where business applications, files, digital employees, connected accounts and authorized tasks share one workspace.'),
        points: [
          CP('M14-01', '多应用桌面与文件空间', 'Multi-app desktop and file workspace',
            '通过桌面、任务栏和多个应用窗口组织日常工作，统一文件、资料和业务入口，减少在不同网页与工具之间反复切换。',
            'Organize work through a desktop, taskbar and multiple application windows, bringing files and business entry points together with less switching between disconnected tools.'),
        ],
        availability: B('网页桌面为当前重点；语音、自动化、外部动作及其他终端按范围开放。原生电脑客户端、移动端与小程序按路线分阶段完善。', 'Browser-first delivery; voice, automation, external actions and additional clients depend on enabled scope. Native Windows and Mac clients, mobile experiences and mini-programs are phased roadmap items.'),
      },
      {
        heading: B('经营总览', 'The owner’s overview'),
        lede: B('老板需要看到的不只是「AI 很忙」，而是谁在做什么、钱花在哪里、客户推进到哪一步、哪里需要自己决定。', 'Business owners need more than busy AI agents: they need visibility into work, cost, customer progress, blockers and decisions requiring their authority.'),
        points: [
          CP('M15-01', '老板驾驶舱', 'Business-owner cockpit',
            '汇总客户、商机、报价、订单、跟进、关键审批和异常，形成经营概览；指标只能来自已接入数据，缺失时明确显示。',
            'Summarize customers, opportunities, quotations, orders, follow-ups, approvals and exceptions using connected data, explicitly showing unavailable metrics.'),
          CP('M15-02', '任务总控', 'Mission control and execution visibility',
            '查看目标、任务、执行步骤、负责人、等待审批、失败原因与结果，明确区分进行中、已提交、结果待核对和已验证完成。',
            'Inspect goals, tasks, steps, owners, approvals, failures and results. Distinguish work in progress, submissions, results awaiting checks and verified completion.'),
          CP('M15-03', '数字员工与协作管理', 'Workforce and teamwork management',
            '通过员工总览和协作分工表查看岗位、技能、任务分配、负载、历史与团队交接，让数字团队有可理解的分工和记录。',
            'Use workforce overviews and team assignment views to inspect roles, skills, assignments, workload, history and handoffs, making team responsibilities understandable.'),
          CP('M15-04', '控制中心', 'One control center',
            '统一数据同步、应用库、系统关系图、能力中心和系统运行状态等管理入口；控制中心管理系统，不替代日常的 AI 对话与任务入口。',
            'Bring data synchronization, the app library, the system map, the capability center and operating status under one management entry point. System administration remains distinct from the everyday AI work interface.'),
        ],
        outputs: B('看得见进度、管得住关键动作、查得清责任与结果。', 'Visible progress, controlled decisions, and traceable ownership and outcomes.'),
        availability: B('管理与控制已有基础；看板数据、自动动作和高级分析按真实接入验收。', 'Management foundations exist; dashboards, automated actions and advanced analytics require verified data connections.'),
      },
    ],
  },

  '02': {
    sources: ['M02'],
    summary: B('从产品与市场出发，找到目标企业，形成背调和开发优先级。', 'Research accounts and prioritize opportunities around products and markets.'),
    parts: [{
      lede: B('不是只整理已有询盘，而是围绕产品、目标市场和客户画像，寻找值得开发的企业，判断机会，再交给销售继续推进。', 'Go beyond incoming inquiries: discover relevant companies, qualify evidence-backed opportunities and pass approved prospects into the sales process.'),
      points: [
        CP('M02-01', '全球客户发现', 'Global prospect discovery',
          '围绕经销商、进口商、批发商与目标企业，从搜索引擎、企业官网、地图、社交平台、展会及依法授权的贸易数据中寻找线索。',
          'Find dealers, importers, wholesalers and target accounts through search, websites, maps, social channels, trade shows and lawfully authorized trade data.'),
        CP('M02-02', '市场信号与补货雷达', 'Market signals and reorder radar',
          '关注采购记录、补货周期、供应商变化、招聘、扩张和企业动态。识别采购窗口与产品组合缺口；证据不足时提示待核实，不编造需求。',
          'Assess purchase history, reorder patterns, supplier changes, hiring and expansion. Flag buying windows and portfolio gaps, while explicitly withholding unsupported conclusions.'),
        CP('M02-03', '客户背调与关键联系人', 'Account research and buying committees',
          '整理企业规模、地区、主营产品与渠道；查找联系人、邮箱、社交账号及采购决策角色，保留来源、更新时间和身份匹配依据。',
          'Research company scale, markets, products and channels. Identify contacts, emails, social profiles and buying roles, with source, freshness and identity evidence.'),
        CP('M02-04', '商机评分与开发优先级', 'Opportunity scoring and prioritization',
          '综合产品匹配、市场适配、采购信号、联系人覆盖、风险和商业价值，形成客户画像、商机简报与开发优先级。',
          'Combine product fit, market fit, buying signals, contact coverage, risk and commercial value into account profiles, opportunity briefs and prioritized prospect lists.'),
        CP('M02-05', '开发策略与持续跟进', 'Outreach playbooks and reactivation',
          '生成多语言开发邮件、沟通话术和跟进计划；覆盖展会线索二次开发、沉睡客户唤醒、老客户补货机会和触达结果分析。',
          'Prepare multilingual emails, messaging and follow-up plans. Support trade-show follow-up, dormant-lead reactivation, reorder opportunities and outreach-result analysis.'),
        CP('M02-06', '确认后转入 Sales Desk', 'Approved handoff into Sales Desk',
          '将确认过的客户连同来源、背调、产品兴趣与下一步任务交给销售工作台，不必先等客户发来询盘，也避免重复建档。',
          'Hand approved prospects to Sales Desk with source evidence, research, product interests and next actions, without waiting for an inbound inquiry or creating duplicate records.'),
      ],
      value: B('给老板的价值：把「业务员到处找客户」变成有目标、有证据、有优先级的客户开发。', 'Business value: replace scattered prospecting with targeted, evidence-backed and prioritized customer development.'),
      outputs: B('目标客户清单、联系人信息、商机简报、开发优先级与下一步任务。', 'Prospect lists, contact details, opportunity briefs, priorities and next actions.'),
      availability: B('核心流程建设中，真实数据与客户触达按授权接入。', 'Core workflows are developing; live sources and outreach require authorization.'),
    }],
  },

  /* Channels (V5 H09 with the channel parts of M02, M03 and M07): three uses,
     and no promise that a listed platform is switched on. The full items those
     parts come from are placed in g02, g04 and g09. */
  '03': {
    sources: ['H09', 'M02', 'M03', 'M07'],
    summary: B('区分研究来源、沟通渠道与内容平台，按授权使用。', 'Distinguish authorized research sources, conversation channels and content platforms.'),
    parts: [{
      lede: B('找客户的信息来源、与客户沟通的渠道、发布内容的平台，各司其职。STARGO WORK 在企业授权与已接入范围内，把相关信息交给同一套客户、销售与跟进流程。', 'Research sources, conversation channels and publishing platforms serve different purposes. Within authorized integrations, STARGO WORK connects their activity to shared customer, sales and follow-up workflows.'),
      points: [
        CP('H09-1', '发现客户', 'Discover accounts',
          '公开搜索、企业官网、地图、社交平台、展会与依法授权的贸易数据，帮助找到经销商、进口商、批发商与目标企业，并保留每条线索的来源。',
          'Search, company websites, maps, social sources, trade shows and lawfully authorized trade data help find dealers, importers, wholesalers and target accounts, with the source of each lead retained.'),
        CP('H09-2', '承接沟通', 'Carry conversations',
          '企业邮件、WhatsApp、阿里国际站与网站询盘承接和客户的沟通；各渠道的往来汇入同一个客户背景，接手的人看得到完整经过。',
          'Business email, WhatsApp, Alibaba.com and website inquiries carry the conversations with customers; what arrives on each channel joins one customer context, so whoever takes over sees the whole history.'),
        CP('H09-3', '内容传播', 'Publish content',
          '官网、社交平台与产品内容支持品牌传播；多语言文案与搜索内容可以提前准备，向外部渠道发布需要单独授权。',
          'Website, social and product content support brand communication. Multilingual copy and search content can be prepared in advance; publishing to external channels requires separate authorization.'),
      ],
      availability: B('接入以企业账号授权和实际服务范围为准。显示平台名称不表示所有渠道默认开通，也不表示具备全部收发权限。', 'Connections depend on authorized accounts and the enabled service scope. A listed platform is not a promise of default access or full read-and-write permissions.'),
    }],
  },

  /* Sales Desk (M03) is split across two rows: the conversation work here,
     the customer record and its continuity in g05. */
  '04': {
    sources: ['M03'],
    summary: B('理解需求、整理附件、辅助回复、跟进并保留人工接管。', 'Extract requirements, organize attachments, prepare replies and retain human handoff.'),
    parts: [{
      lede: B('承接 Growth OS 的主动开发客户与各渠道询盘，让客户资料、沟通、产品需求、报价和跟进状态围绕同一条销售链协同。', 'Unify outbound prospects and inbound inquiries around one customer context, from qualification and conversation to quotation, order handoff and retention.'),
      points: [
        CP('M03-01', '统一询盘与消息入口', 'Unified inquiry and message intake',
          '集中组织企业邮件、网站询盘、WhatsApp 与阿里国际站等渠道消息，区分新询盘、历史消息、状态回执、垃圾信息与异常线索。',
          'Organize enterprise email, website inquiries, WhatsApp and Alibaba.com messages; distinguish new inquiries, historical traffic, delivery events, spam and unusual leads.'),
        CP('M03-02', '需求理解与附件处理', 'Requirement and attachment intelligence',
          '识别采购产品、规格、数量、市场、预算、交期等需求，整理客户上传的目录、表格、图片与图纸资料，并提示缺失信息。',
          'Extract products, specifications, quantities, markets, budgets and deadlines; organize catalogs, spreadsheets, images and drawings, and flag missing information.'),
        CP('M03-04', '企业知识驱动的销售回复', 'Knowledge-grounded sales assistance',
          '查询产品参数、价格政策、起订量、包装、认证、交期和贸易条款，辅助产品匹配、翻译和多语言回复；缺少真实资料时明确提示。',
          'Use verified product knowledge and policies for specifications, minimum order quantities, packaging, certifications, lead times, terms, product matching and multilingual replies. Flag unavailable facts.'),
        CP('M03-05', '跟进任务与人工协作', 'Follow-up tasks and human collaboration',
          '生成回复草稿、跟进策略、下一步任务和提醒；保留人工审批、人工接管及销售阶段管理，避免多人或多个 AI 重复触达。',
          'Prepare drafts, follow-up strategies, tasks and reminders, with human review, takeover and pipeline management to reduce duplicate outreach by people or AI employees.'),
      ],
      outputs: B('结构化需求、产品方案、待审核回复与连续的销售跟进记录。', 'Structured requirements, product fit, review-ready replies and continuous sales history.'),
      availability: B('已有业务工作台；各渠道真实收发与业务交接仍需逐项连接、验证。', 'The workspace exists; live channel messaging and business handoffs require individual integration and validation.'),
    }],
  },

  '05': {
    sources: ['M03'],
    summary: B('统一客户、联系人、商机、历史沟通、报价和后续任务。', 'Keep customers, contacts, opportunities, history, quotations and next steps connected.'),
    parts: [{
      lede: B('CRM 是 Sales Desk 的客户底账：主动开发的客户与各渠道询盘落在同一份客户档案里，接手的人有完整上下文。', 'CRM is the customer record behind Sales Desk: outbound prospects and inbound inquiries share one customer file, so whoever takes over has the full context.'),
      points: [
        CP('M03-03', 'CRM 与客户全景', 'CRM and a complete customer view',
          '统一公司、联系人、来源、标签、负责人、商机阶段、沟通时间线、产品兴趣、报价和订单记录，让接手客户时有完整上下文。',
          'Maintain companies, contacts, sources, tags, owners, opportunity stages, communication timelines, product interests, quotes and orders in a shared customer context.'),
        CP('M03-06', '贯穿成交与后续维护', 'Continuity beyond the sale',
          '将客户沟通连接到报价、PI、订单交接、交付和售后，持续沉淀成交原因、未成交原因与复购机会，而不是发完消息就结束。',
          'Connect conversations to quotes, proforma invoices, order handoff, delivery and support, preserving win/loss context and repeat-purchase opportunities.'),
      ],
      value: B('业务主线：客户确认 → CRM → 沟通与产品匹配 → 报价 / PI → 订单交接 → 售后与复购。', 'Business flow: approved prospect → CRM → conversation and product fit → quote / PI → order handoff → support and repeat sales.'),
      outputs: B('客户档案与连续的销售跟进记录。', 'Customer records and continuous sales history.'),
      availability: B('已有业务工作台；各渠道真实收发与业务交接仍需逐项连接、验证。', 'The workspace exists; live channel messaging and business handoffs require individual integration and validation.'),
    }],
  },

  /* The knowledge half of M12 (the relationship half is g12), and the product
     facts a quotation stands on (M04; the quotation work itself is g07). */
  '06': {
    sources: ['M12', 'M04'],
    summary: B('产品参数、价格政策、认证、模板和企业经验，有据可查。', 'Ground work in specifications, pricing policies, certificates, templates and company experience.'),
    parts: [{
      lede: B('知识库回答「公司知道什么」：产品、价格政策、合同模板、制度与经验集中在企业资料室里，回答和执行都能找到依据。', 'The knowledge base captures what the company knows — products, pricing policies, contract templates, policies and experience — so answers and actions can point to a source.'),
      points: [
        CP('M12-01', '企业知识中心', 'Enterprise knowledge center',
          '集中公司资料、产品目录、技术参数、价格政策、认证、常见问题、销售话术、合同模板、制度、标准流程与历史项目，形成可检索的企业资料库。',
          'Collect company information, catalogs, specifications, pricing policies, certifications, FAQs, sales guidance, templates, policies, standard procedures and project history in a searchable knowledge base.'),
        CP('M12-02', '知识接入与有据可查的回答', 'Knowledge intake and cited answers',
          '接入文件和经授权的知识源，记录来源、版本、权限与更新时间；回答和执行时引用依据，遇到冲突或资料过期时提示核实。',
          'Ingest files and authorized sources with provenance, versions, permissions and freshness. Ground answers and actions in evidence and flag conflicts or outdated material.'),
        CP('M04-facts', '报价与回复的产品依据', 'Product facts behind quotes and replies',
          '产品配置、规格、包装与价格政策来自企业确认的资料；报价、PI 与销售回复引用同一份产品事实，缺少资料时明确提示，不让 AI 自行编价。',
          'Product configurations, specifications, packaging and pricing policies come from enterprise-approved information. Quotations, PI and sales replies draw on the same product facts and flag gaps rather than letting AI invent prices.'),
      ],
      value: B('关键原则：价格来自企业确认的数据，回答有据可查，资料冲突或过期时先核实。', 'Key principle: enterprise-approved data determines prices, answers cite their source, and conflicting or outdated material is checked first.'),
      outputs: B('知道应采用哪一版资料，每个回答都附带依据。', 'Know which information is current, with the source behind each answer.'),
      availability: B('企业知识与业务关联已有基础；高级关联和企业资料模板按接入情况逐步完善。', 'Knowledge and business-context foundations exist; richer relationships and enterprise templates are delivered in stages.'),
    }],
  },

  '07': {
    sources: ['M04'],
    summary: B('按规则准备报价，保留批准版本和文件交接。', 'Prepare quotations under business rules and preserve approved versions and documents.'),
    parts: [{
      lede: B('把「找价格、改表格、反复确认条款」的分散操作，组织成有版本、有审批、有真实数据依据的商业流程。', 'Turn disconnected price lookups, spreadsheets and term negotiations into traceable, versioned and approval-controlled commercial workflows.'),
      points: [
        CP('M04-01', '产品配置与报价规则', 'Configuration and quotation rules',
          '按产品配置、数量、包装、币种和贸易条款形成报价草稿；关联价格表、历史报价、折扣权限及利润边界，避免 AI 自行编价。',
          'Build quote drafts from product configuration, quantity, packaging, currency and trade terms, using authoritative pricebooks, history, discount permissions and margin guardrails.'),
        CP('M04-02', '报价中心', 'Quote Studio',
          '统一报价模板、草稿、版本比较、审批与已批准报价；客户修改数量或配置时保留变更记录，降低错发旧版本的风险。',
          'Manage templates, drafts, comparisons, approvals and approved quotations. Preserve changes to quantity or configuration to reduce the risk of sending obsolete versions.'),
        CP('M04-03', 'PI 与商业确认', 'Proforma invoices and commercial confirmation',
          '将确认后的报价转为 PI，维护条款、金额、付款节点与批准版本快照；报价批准与实际发送分别受控。',
          'Turn confirmed quotations into proforma invoices, preserving terms, amounts, payment milestones and approved snapshots. Approval and external delivery remain separate controls.'),
        CP('M04-04', '合同与电子签协同', 'Contracts and e-signature coordination',
          '组织合同模板、商务条款、版本和审批，辅助查找前后矛盾与待确认事项；电子签及法律审阅按企业系统和专业人员流程衔接。',
          'Coordinate contract templates, terms, versions and approvals; flag inconsistencies and unresolved points. Connect e-signatures and professional review through approved enterprise processes.'),
        CP('M04-05', '外贸单证与资料归档', 'Trade-document preparation and filing',
          '覆盖商业发票、装箱单、原产地证及 Form E 资料、提单、认证与运输资料的准备、核对和归档；正式签发由相应机构完成。',
          'Prepare, check and archive commercial invoices, packing lists, certificate of origin and Form E supporting materials, bills of lading, certifications and shipping records. Official issuance remains with authorized bodies.'),
        CP('M04-06', '客户与交易风险辅助', 'Counterparty and transaction-risk assistance',
          '整理客户身份、制裁或风险名单线索、HS 编码与认证要求资料，保留筛查依据并升级人工复核，不代替专业合规判断。',
          'Collect identity evidence, screening signals, HS-code references and certification materials, retain supporting sources and escalate review rather than replacing professional compliance judgment.'),
      ],
      value: B('关键原则：价格来自企业确认的数据，商业文件可追溯，重要承诺由人批准。', 'Key principle: enterprise-approved data determines prices; commercial documents remain traceable; people approve consequential commitments.'),
      outputs: B('报价草稿、批准版本、PI、商务条款与可追溯的商业资料。', 'Quote drafts, approved versions, proforma invoices, commercial terms and traceable documents.'),
      availability: B('报价与 PI 持续完善；真实价格、合同、签章与单证按企业系统接通。报价获批不等于已经发出，发出也不等于客户已经收到。', 'Quotes and PI are evolving; live prices, contracts, signatures and documents depend on connected enterprise systems. An approved quote is not yet a sent one, and a sent quote is not proof the customer received it.'),
    }],
  },

  /* ERP and commerce (M05) and delivery, collection and service (M06), under
     the three plain sub-headings V6 §5.5 names. */
  '08': {
    sources: ['M05', 'M06'],
    summary: B('覆盖 ERP 与商城经营，以及采购、库存、生产、质检、物流、回款、出口资料和售后协同。', 'Covers ERP and commerce operations, plus purchasing, stock, production, quality, logistics, collection, trade records and support.'),
    parts: [
      {
        heading: B('ERP 经营', 'ERP & commerce'),
        lede: B('把销售前端与企业经营后台放到同一个桌面：不仅知道客户要什么，也要知道产品、物料、库存、生产、订单与收款在哪里。', 'Bring sales and operating systems into one desktop, connecting demand with products, materials, inventory, production, orders and commercial records.'),
        points: [
          CP('M05-01', '产品、物料与物料清单', 'Products, materials and bills of materials',
            '组织产品档案、规格、物料编码、物料清单和配置关系，为报价、采购、生产与库存协同提供一致基础。',
            'Organize product records, specifications, material codes, bills of materials and configuration relationships to support consistent quoting, procurement, production and stock coordination.'),
          CP('M05-02', '采购与供应商协同', 'Procurement and supplier coordination',
            '将订单需求衔接到采购计划、供应商资料、询价、采购单和到货跟进；跨系统写入与批准流程按企业规则配置。',
            'Link order demand to purchasing plans, supplier information, sourcing, purchase orders and incoming deliveries. Configure system writes and approvals around enterprise rules.'),
          CP('M05-03', '库存与仓储管理', 'Inventory and warehouse operations',
            '组织库存查询、仓库、出入库、物料流转与缺货信息，让业务人员了解可交付数量，并为后续预警与补货协同提供数据。',
            'Provide inventory, warehouse, stock-movement and shortage information so teams can assess availability and support replenishment and exception workflows.'),
          CP('M05-04', '生产、质量与交期', 'Production, quality and lead times',
            '跟踪生产任务、物料需求、进度、质检、包装及交期，逐步将生产异常与销售承诺、客户沟通关联起来。',
            'Coordinate production tasks, material needs, progress, quality checks, packaging and lead times, progressively linking exceptions to sales commitments and customer communication.'),
          CP('M05-05', '订单、开票与经营记录', 'Orders, invoicing and operating records',
            '管理订单、报价、发票、多币种商业记录与相关单据；将客户需求、交易记录和履约状态对应起来，减少重复录入。',
            'Manage orders, quotations, invoices, multi-currency commercial records and supporting documents; align demand, transactions and fulfillment status to reduce duplicate entry.'),
          CP('M05-06', '商城与经销商业务', 'Commerce and dealer operations',
            '覆盖商品目录、销售地区、购物车、订单和商城管理后台；可按企业需求衔接品牌商城、经销商门户与客户资源协同。',
            'Support catalogs, selling regions, carts, orders and commerce administration, with brand storefronts, dealer portals and partner coordination connected as required.'),
        ],
        value: B('给老板的价值：前端拿订单，后台管交付；ERP、商城与 AI 协同，但不混淆各系统的数据权威。', 'Business value: connect winning orders with delivering them, while ERP, commerce and AI retain clear ownership of business records.'),
        outputs: B('能不能交、什么时候交、交付后记录是否一致，都有相应资料可以核对。', 'Check product availability, delivery timing and the consistency of operating records.'),
        availability: B('已有 ERP 与商城应用基础；跨系统协同和 AI 操作按企业配置验收。', 'ERP and commerce foundations exist; cross-system work and AI actions require enterprise-specific configuration and validation.'),
      },
      {
        heading: B('履约回款', 'Delivery & collection'),
        lede: B('成交只是中间节点。围绕订单、供应链、单证、资金节点和客户体验，扩展跨部门协作与经营闭环。', 'A sale is a milestone, not the endpoint. Extend coordination across orders, supply chains, documents, payment milestones and customer experience.'),
        points: [
          CP('M06-01', '订单与履约里程碑', 'Order and fulfillment milestones',
            '围绕订金、生产、质检、包装、发货与客户确认组织任务、负责人和截止时间，识别延期、资料缺失及跨部门等待。',
            'Organize deposits, production, quality checks, packaging, shipment and customer confirmation around tasks, owners and deadlines, highlighting delays, missing records and handoff blockers.'),
          CP('M06-02', '物流与运输协同', 'Logistics and shipment coordination',
            '衔接运费询价、订舱、物流轨迹、预计到达时间及异常处理；服务范围取决于企业使用的货代、物流和订单系统。',
            'Coordinate freight quotes, bookings, tracking, estimated arrivals and exceptions according to the freight-forwarding, logistics and order systems the enterprise connects.'),
          CP('M06-03', '财务与回款辅助', 'Finance and receivables assistance',
            '整理订金、尾款、应收应付、发票、对账及订单利润信息，辅助到期提醒、现金流观察与异常检查；资金支付不由 AI 擅自执行。',
            'Organize deposits, balances, receivables, payables, invoices, reconciliation and order-margin information for reminders and exception checks. AI does not independently authorize payments.'),
          CP('M06-04', '出口与退税流程', 'Export and tax-rebate workflows',
            '管理出口资料清单、业务阶段、文件一致性、审批与进度提醒，辅助退税资料整理与申报协同，不等同于自动完成官方申报或获批。',
            'Track export checklists, stages, document consistency, approvals and reminders; assist rebate preparation and filing coordination without implying automatic official submission or approval.'),
        ],
      },
      {
        heading: B('服务复购', 'Service & repeat business'),
        points: [
          CP('M06-05', '售后、保修与备件', 'After-sales, warranty and spare parts',
            '围绕客户问题、工单、保修、退换货、备件和处理进度进行协同；将高频问题回流产品资料、常见问题与销售知识。',
            'Coordinate support cases, warranty, returns, spare parts and resolution progress. Feed recurring issues back into product information, FAQs and sales knowledge.'),
          CP('M06-06', '经销商维护与复购', 'Dealer success and repeat purchases',
            '沉淀经销商历史订单、产品偏好、问题与跟进计划，组织销售支持资料、补货建议、客户唤醒及复购机会。',
            'Preserve dealer orders, preferences, issues and follow-up plans to support sales enablement, replenishment suggestions, reactivation and repeat-purchase opportunities.'),
        ],
        value: B('完整目标：获客 → 销售 → ERP / 履约 → 财务协同 → 售后复购 → 新一轮增长。', 'End-to-end objective: acquisition → sales → ERP / fulfillment → finance coordination → support and repeat sales → renewed growth.'),
        outputs: B('订单里程碑、付款提醒、资料清单、异常事项、售后记录与复购跟进。', 'Order milestones, payment reminders, document checklists, exceptions, service records and reorder follow-up.'),
        availability: B('按订单、物流、财务与服务系统的接入情况，分阶段交付。正式申报、证书签发与资金支付仍由相应有权人员和机构处理，不会由 AI 自动完成或获批。', 'Delivered in stages according to the connected order, logistics, finance and service systems. Official filings, certificate issuance and payments stay with the authorized people and bodies; AI does not complete or approve them on its own.'),
      },
    ],
  },

  /* Images (M07), one-click video (M08) and viral structure adaptation (M09)
     as three separate parts: the last two are different workflows, both in
     development, and each carries its own condition beside it. */
  '09': {
    sources: ['M07', 'M08', 'M09', 'M16'],
    summary: B('图片编辑、商品套件、详情页、图册、视频项目与爆款结构再创作。', 'Images, marketing kits, product pages, catalogs, video projects and structural adaptation.'),
    parts: [
      {
        heading: B('AI 作图与品牌内容', 'AI images & brand content'),
        lede: B('AI 创意能力不只是写文案：围绕真实产品与品牌规范，组织图片、详情页、图册、广告素材和多语言内容生产。', 'Go beyond copywriting: use verified products and brand rules to organize images, detail pages, catalogs, advertising assets and multilingual content.'),
        points: [
          CP('M07-01', 'AI 作图与图片编辑', 'AI image generation and editing',
            '支持以文字、产品参考图和已有素材开展生成与编辑工作流，服务白底主图、场景图、海报、卖点图及广告创意。',
            'Use text, product references and existing assets in image-generation and editing workflows for product heroes, scenes, posters, benefit graphics and advertising concepts.'),
          CP('M07-02', '一键商品营销套件', 'One-click product marketing kits',
            '以产品、目标市场、平台和语言为输入，规划主图、卖点图、细节图、参数图、品牌展示图与配套文案，减少反复下指令。',
            'Use product, market, platform and language inputs to plan hero images, benefits, details, specifications, brand visuals and supporting copy in one coordinated workflow.'),
          CP('M07-03', '详情页、图册与销售资料', 'Product pages, catalogs and sales materials',
            '组织商品详情页、宣传图册、产品介绍和销售支持资料；品牌标志、关键参数、价格与文字采用可核对的排版内容。',
            'Prepare detail pages, catalogs, product introductions and sales collateral, keeping logos, specifications, prices and text in checkable, controlled layouts.'),
          CP('M07-04', '品牌与产品一致性', 'Brand and product consistency',
            '统一品牌资产、标志、配色、语气和产品事实；对不准确的外观、参数或文字做检查与局部修正，降低素材「好看但不真实」的风险。',
            'Apply a shared brand kit and product facts, checking and locally correcting inaccurate visuals, specifications and copy to reduce attractive but misleading content.'),
          CP('M07-05', '创意画布与素材管理', 'Creative canvas and asset management',
            '在同一创意工作空间组织制作需求、步骤、参考素材、图片、视频与音频，沉淀版本与素材库，复用成熟的制作流程。',
            'Organize briefs, production steps, reference materials, images, video and audio in one creative workspace. Retain versions, an asset library and reusable production workflows.'),
          CP('M07-06', '全球营销与搜索内容', 'Global marketing and search content',
            '生成官网、社媒、产品和销售文案，支持多语言本地化、搜索引擎与 AI 搜索内容规划、营销活动和发布素材准备；渠道发布单独授权。',
            'Prepare website, social, product and sales copy, multilingual localization, search and AI-search content plans and campaigns. Publishing to external channels requires separate authorization.'),
        ],
        value: B('给老板的价值：同一套产品事实，持续产出能用于销售、官网、商城和社交平台的品牌素材。', 'Business value: turn one verified product knowledge base into reusable assets for sales, websites, commerce and social channels.'),
        outputs: B('围绕同一产品与品牌规范组织图片、文案和销售素材，保留版本与局部修改。', 'Organize images, copy and sales materials around consistent product and brand information, with versions and local revisions.'),
        availability: B('创意工作室已有基础；营销套件、局部检查与一键编排持续整合。', 'The creative workspace is present; packaged marketing, local checks and one-click workflows are being integrated.'),
      },
      {
        /* The status is part of the heading (V6 §5.6); on a narrow English
           line it stays in one piece and the dot stays with the words before it
           (U+00A0). */
        heading: B('AI 一键生成视频', 'One-click video'),
        lede: B('将文案、分镜、素材、画面、配音、字幕和导出组织成一个视频项目，减少营销视频制作中的工具切换与手工交接。', 'Organize scripts, storyboards, assets, visuals, voiceover, captions and export in one project, reducing fragmented tools and manual production handoffs.'),
        points: [
          CP('M08-01', '输入产品与视频目标', 'Start from products and a video brief',
            '根据产品资料、参考图片、目标受众、语言、时长和画幅，组织产品介绍、广告、品牌宣传与社媒短视频项目。',
            'Structure product explainers, advertisements, brand videos and social clips from product facts, references, audience, language, duration and aspect ratio.'),
          CP('M08-02', 'AI 导演与分镜规划', 'AI direction and storyboarding',
            '围绕开场吸引点、卖点表达、镜头顺序、运镜、节奏及结尾行动指令生成制作方案，让内容生产有可审阅的前置计划。',
            'Plan hooks, benefits, shot order, camera language, pacing and calls to action, giving teams a reviewable production plan before generation.'),
          CP('M08-03', '画面、镜头与素材生成', 'Visuals, shots and asset generation',
            '衔接图片与视频生成能力，按项目组织镜头和产品素材；用产品事实与品牌规范约束生成内容，保留质量检查环节。',
            'Connect image and video generation to project-level shots and assets, grounding production in verified product and brand information with quality checks.'),
          CP('M08-04', '配音、字幕与后期组织', 'Voiceover, captions and post-production',
            '把多语言旁白、字幕、音乐、品牌标志、片尾和参数叠加纳入后期流程，按可用工具和授权素材完成制作。',
            'Coordinate multilingual narration, captions, music, branding, end cards and specification overlays through available tools and authorized assets.'),
          CP('M08-05', '项目版本与局部重做', 'Project versions and local revisions',
            '保存产品资料、参考素材、分镜、任务状态和成果版本；失败镜头可以单独重做，不必每次推倒整条视频。',
            'Retain product facts, references, storyboards, task status and artifact versions, and redo an individual failed shot instead of regenerating everything.'),
          CP('M08-06', '预览、导出与成本控制', 'Preview, export and cost control',
            '组织横版、竖版、方版等输出，记录生成预算、审批、任务状态和最终文件；只有可播放、可导出的成果才能算交付。',
            'Organize landscape, portrait and square outputs with budgets, approvals, task tracking and final files. Delivery requires an actual playable, exportable artifact.'),
        ],
        value: B('从一句制作需求到一条可播放、可导出的成片：脚本、分镜、画面、配音、字幕和导出在同一个项目里完成，版本与成本都有记录。', 'From a brief to a playable, exportable video: script, storyboard, visuals, voiceover, captions and export in one project, with versions and costs on record.'),
        outputs: B('产品视频、广告、品牌宣传与社媒短片的成片文件，以及制作方案、版本记录和生成成本。', 'Finished product explainers, advertisements, brand videos and social clips, with the production plan, version history and generation cost.'),
        availability: B('一键视频已开放。成片经人工审核后再发布；生成按企业开通的服务与额度计量，素材须有权使用。', 'Available. Finished videos are reviewed before they are published; generation runs within the services and credits the company enables, using assets you are entitled to use.'),
      },
      {
        heading: B('爆款结构再创作', 'Viral creative adaptation'),
        lede: B('把「这个视频为什么吸引人」拆解为可用的营销结构，再结合自己的产品、品牌与目标市场，生成新的创意版本。', 'Extract the marketing structure behind an engaging reference video, then adapt it to the enterprise’s own products, brand and target market.'),
        points: [
          CP('M09-01', '参考视频接入', 'Reference-video intake',
            '输入有权使用的参考视频和自身产品素材，确认素材来源、使用权与制作目标，为结构分析建立明确边界。',
            'Start with a reference video and product assets the enterprise is entitled to use, recording provenance, usage rights and production objectives.'),
          CP('M09-02', '拆解创意结构', 'Creative-structure analysis',
            '分析开场吸引点、镜头功能、时长、节奏、运镜、产品出场时机、字幕表达、情绪变化与行动指令，而不是直接复制原片。',
            'Analyze hooks, shot functions, duration, pacing, camera language, reveal timing, captions, emotional progression and calls to action rather than copying the original footage.'),
          CP('M09-03', '替换为自己的产品与品牌', 'Ground the concept in your own brand',
            '用企业已确认的产品事实、卖点和品牌资产重新组织创意，调整场景、市场、语言与表达，避免把参考片的信息误当作自身事实。',
            'Rebuild the concept around verified product facts, benefits and brand assets, adapting scenes, markets, language and messaging without importing false claims from the reference.'),
          CP('M09-04', '一次组织三个原创版本', 'Plan three original adaptations',
            '围绕不同开场、场景或表达角度组织三个版本，明确每版变化点，便于比较创意策略，而非得到三个无法解释的随机结果。',
            'Create three distinct adaptations with declared changes to hooks, scenes or messaging angles, making creative comparisons deliberate rather than random.'),
          CP('M09-05', '生成、审核与多尺寸输出', 'Generate, review and prepare formats',
            '把新脚本、分镜和素材交给视频制作流程，组织品牌、字幕及多尺寸导出。长视频拆条、竖屏改版与字幕适配按已开放能力执行。',
            'Pass original scripts, storyboards and assets into the video workflow for branding, captions and format exports. Repurposing and reframing depend on enabled capabilities.'),
          CP('M09-06', '创意测试与内容资产沉淀', 'Creative testing and reusable learning',
            '保留参考结构、版本差异、制作成本与发布反馈；后续结合渠道数据比较内容表现，积累可复用的企业创意方法。',
            'Retain reference structures, variant differences, production cost and feedback. Where channel data is connected, compare performance and build reusable creative knowledge.'),
        ],
        value: B('「复刻」指结构借鉴与原创改编：不直接复制原片、人脸、声音、音乐、标志或水印，也不承诺必然成为爆款。', 'Adaptation means borrowing a structure to make original work — not copying footage, faces, voices, music, logos or watermarks. Viral performance is not guaranteed.'),
        outputs: B('参考结构说明、原创脚本与分镜、版本变化点和后续制作任务；不承诺必然成为爆款。', 'Structural analysis, original scripts and storyboards, declared variant differences and production tasks — not a guarantee of viral results.'),
        availability: B('爆款结构再创作已开放，从结构分析一直衔接到成片制作。参考视频须有权使用；不直接复制原片，不承诺必成爆款。', 'Available, from structural analysis through to finished production. Reference videos must be ones you are entitled to use; original footage is never copied, and viral performance is not guaranteed.'),
      },
    ],
  },

  /* 288 (M10) with its ten role groups, and teamwork (M11). 288 is the size
     of the role directory; the build checks the ten counts add up to it. */
  '10': {
    sources: ['M10', 'M11', 'M16'],
    summary: B('288 个专业岗位，围绕任务选人、组队、交流与接力。', 'Select, team up and coordinate 288 specialized roles around shared tasks.'),
    parts: [
      {
        heading: B('288 个专业数字岗位', '288 specialized AI roles'),
        lede: B('数字员工不仅服务外贸，也覆盖企业支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务。', 'Digital employees cover enterprise support, marketing, sales, service, compliance, supply chain, finance, operations, product and engineering, and professional services.'),
        roles: {
          total: 288,
          caption: B('十类岗位与数量（岗位目录）', 'Ten role groups and their size (role directory)'),
          head: [B('岗位类别', 'Role group'), B('数量', 'Roles')],
          sum: B('合计', 'Total'),
          rows: [
            [B('企业通用支持', 'Enterprise essentials'), 15],
            [B('客户开发与市场', 'Customer development & marketing'), 50],
            [B('销售', 'Sales'), 16],
            [B('客户服务', 'Customer service'), 5],
            [B('风控与合规', 'Compliance'), 20],
            [B('供应链', 'Supply chain'), 4],
            [B('财务', 'Finance'), 14],
            [B('运营', 'Operations'), 19],
            [B('产品与工程', 'Product & engineering'), 129],
            [B('专业服务', 'Professional services'), 16],
          ],
        },
        points: [
          CP('M10-01', '每个岗位有什么', 'What a role can contain',
            '可以配置职责、技能、企业知识、可用工具、权限、任务和运行记录，让岗位有明确分工，执行时有企业背景与范围。',
            'Configure responsibilities, skills, enterprise knowledge, permitted tools, access, tasks and run history so each role has a defined job, context and operating scope.'),
          CP('M10-02', '复杂任务怎样组队', 'How a team is formed',
            '按岗位、技能、知识、权限与任务复杂度选择合适员工，明确每个成员的职责，分别处理研究、销售、产品、内容或数据工作。',
            'Select suitable employees by role, skills, knowledge, access and task complexity. Give members clear responsibilities across research, sales, products, content or data.'),
          CP('M10-03', '老板怎样交办工作', 'How an owner delegates',
            '提出业务目标，选择合适员工或团队，查看任务和成果，并批准关键动作。需要判断或遇到异常时保留人工接管。',
            'Set a business goal, choose employees or a team, inspect tasks and results, and approve key actions. Retain human takeover when judgment or exception handling is needed.'),
          CP('M10-04', '成果怎样接力和管理', 'How results are handed over',
            '记录责任、截止时间、任务状态、结果与下一步；员工之间直接交接，不同成员的工作汇总为可交接的成果。',
            'Track responsibility, deadlines, task status, outcomes and next steps. Members hand work to each other directly, and their outputs are consolidated into a handoff-ready result.'),
        ],
        value: B('不是「雇用 288 个真人」，而是拥有可按任务选择、配置、派工并组队协作的专业数字岗位目录。', 'This is a directory of professional AI roles for task-based selection, configuration, delegation and teamwork, not a claim to replace 288 people.'),
        outputs: B('可按任务选用的专业数字岗位目录，以及职责、任务、工作记录与交接成果。', 'A task-selectable role directory with responsibilities, tasks, work history and handoff-ready outputs.'),
        availability: B('288 是岗位目录数量，不等于替代 288 名真人员工；实际启用的员工、协作规模及操作范围受配置、预算和权限约束。', '288 is the role-directory count, not a claim to replace 288 people. The employees enabled, the size of a collaboration and permitted actions depend on configuration, budget and access.'),
      },
      {
        heading: B('多个 AI 员工交流协作', 'AI employees working together'),
        lede: B('一个复杂任务可以交给多个数字员工分工完成。重点不在聊天人数，而在信息能否传递、责任是否明确、结果能否交接。', 'Assign complex work to a bounded team of digital employees. What matters is information exchange, clear ownership and reliable handoff — not the number of chat windows.'),
        points: [
          CP('M11-01', '按任务选人和组队', 'Task-based team formation',
            '根据岗位、技能、企业知识、工具权限与任务复杂度查找合适员工，形成小型团队，并说明各成员职责。',
            'Match roles, skills, enterprise knowledge, permitted tools and task complexity to form a focused team with explicit responsibilities.'),
          CP('M11-02', 'AI 员工之间交流信息', 'Communication between AI employees',
            '围绕任务支持协作会话、定向消息、问题转交、补充信息与进度通知，减少所有信息都必须由人手工复制的情况。',
            'Support task-focused conversations, directed messages, questions, context exchange and progress notifications to reduce manual copying between AI employees.'),
          CP('M11-03', '并行执行与结果汇总', 'Parallel work and result synthesis',
            '让研究、销售、产品、内容或数据员工并行处理不同子任务，由统筹角色检查结果并合成为一个交付包。',
            'Run research, sales, product, content or data subtasks in parallel, then have a coordinating role check and combine outputs into one delivery package.'),
          CP('M11-04', '共享事实，不越权共享', 'Shared facts within permission boundaries',
            '同一客户、产品、任务与审批状态使用共同依据；共享任务上下文不意味着共享所有企业数据，更不会自动获得其他员工的权限。',
            'Use consistent customer, product, task and approval facts. Sharing context does not grant access to all enterprise data or transfer another employee’s permissions.'),
          CP('M11-05', '责任认领与持续接力', 'Ownership and durable handoffs',
            '记录任务目标、负责人、认领状态、截止时间、证据、失败原因和下一步，让暂停、人工接管与恢复后仍能继续推进。',
            'Track goals, owners, claims, deadlines, evidence, failures and next actions so work can continue through pauses, human takeover and recovery.'),
          CP('M11-06', '协作有边界，工作可停止', 'Bounded work and stop controls',
            '对协作次数、预算和可执行动作设置限制，防止循环讨论、重复执行与越权操作。人工审批、暂停、接管和结果核对始终保留。',
            'Set limits on collaboration rounds, budgets and permitted actions to control looping discussions, duplicate work and unauthorized operations. Retain human approval, pause, takeover and result checks.'),
        ],
        value: B('场景示例：研究员工找客户，销售员工定策略，产品员工匹配规格，创意员工做素材，统筹员工汇总后交人确认。', 'Illustrative scenario: research finds accounts, sales plans outreach, product specialists check fit, creatives prepare assets, and a coordinator submits the package for review.'),
        outputs: B('按责任汇总的结果、成员之间的交接记录，以及清楚的下一步任务。', 'Consolidated results, accountable member handoffs and clearly assigned next actions.'),
        availability: B('团队协作已开放：员工可以组队、互相发消息、并行处理并汇总交付。协作轮次、预算与可执行动作有上限，随时可以叫停；对外动作仍需有权人员批准。', 'Available: employees form teams, message each other, work in parallel and deliver one consolidated result. Collaboration rounds, budgets and permitted actions are capped, work can be stopped at any time, and external actions still need an authorized approval.'),
      },
    ],
  },

  /* The everyday-work half of M14; the desktop itself opens g01. */
  '11': {
    sources: ['M14'],
    summary: B('表格、报告、语音、授权网页任务与定时工作。', 'Spreadsheets, reports, voice, authorized web tasks and scheduled work.'),
    parts: [{
      lede: B('在同一个网页桌面里整理表格与报告、用语音交办、执行授权网页任务、连接企业账号，并把重复工作排进定时或事件触发的流程。', 'In the same browser desktop: spreadsheets and reports, voice requests, authorized web tasks, connected business accounts, and repeat work organized into scheduled or event-triggered workflows.'),
      points: [
        CP('M14-02', 'AI 表格、文档与报告', 'AI-assisted spreadsheets, documents and reports',
          '围绕客户清单、产品表、报价表与经营统计整理数据，辅助文件生成、翻译、总结及报告制作；复杂格式按工具能力与模板配置。',
          'Organize customer lists, product tables, quotation sheets and business data; assist document creation, translation, summarization and reporting according to enabled tools and templates.'),
        CP('M14-03', '语音助手与语音转任务', 'Voice assistance and voice-to-task workflows',
          '通过语音提出需求，衔接转录、对话、知识检索、任务创建与业务跟进；实时语音和具体业务动作按企业开通的服务与配置开放。',
          'Use speech for transcription, conversation, knowledge retrieval, task creation and follow-up. Realtime voice and specific business actions depend on enabled services and enterprise configuration.'),
        CP('M14-04', '云端操作与网页任务', 'Authorized computer and web tasks',
          '在授权环境中搜索网页、操作后台、填写表单、上传下载和整理资料，减少重复手工操作；不绕过登录、安全验证或平台规则。',
          'Carry out authorized web research, portal work, forms, uploads, downloads and file organization to reduce repetitive manual tasks, without bypassing sign-in, security checks or platform rules.'),
        CP('M14-05', '连接企业账号与应用', 'Connect business accounts and apps',
          '按需连接邮箱、网盘、CRM、ERP 和业务平台，通过企业授权开放相应功能，明确哪些信息可查看、哪些记录可修改、哪些动作需要审批。',
          'Connect email, drives, CRM, ERP and business platforms through enterprise authorization. Define what can be read, what can be changed and which actions require approval.'),
        CP('M14-06', '自动化、同步与应用扩展', 'Automation, synchronization and extensibility',
          '用定时、事件、触发条件与工作流组织重复任务；管理数据同步、错误、重试和应用扩展，让新增工具围绕既有业务协同。',
          'Organize repetitive work with schedules, events, triggers and workflows, managing synchronization, errors, retries and application extensions around existing business processes.'),
      ],
      outputs: B('客户清单、产品表、报价表、报告、纪要、待办与授权的重复工作。', 'Customer lists, product and quotation sheets, reports, notes, tasks and authorized routine work.'),
      availability: B('网页桌面为当前重点；语音、自动化、外部动作及其他终端按范围开放。', 'Browser-first delivery; voice, automation, external actions and additional clients depend on enabled scope.'),
    }],
  },

  /* The relationship half of M12 — said as 企业业务关系与上下文, never as a
     data-model term. */
  '12': {
    sources: ['M12', 'M16'],
    summary: B('把客户、产品、报价、订单、规则与责任对应起来。', 'Connect customers, products, quotes, orders, business rules and responsibilities.'),
    parts: [{
      lede: B('知识库回答「公司知道什么」；企业业务关系图进一步说明客户、产品、订单、规则和任务之间怎样关联。', 'The knowledge base captures what the company knows. A shared business relationship map explains how customers, products, orders, rules and tasks connect.'),
      points: [
        CP('M12-03', '企业业务关系图', 'The business relationship map',
          '把客户、联系人、产品、询盘、商机、报价、订单、文件、任务和员工联系起来，说明当前状态、发生了什么、下一步由谁推进。',
          'Connect customers, contacts, products, inquiries, opportunities, quotes, orders, documents, tasks and employees so teams can understand relationships, current status and responsibility for next steps.'),
        CP('M12-04', '同一个客户，不同记录能对应', 'Identity and cross-system relationships',
          '识别不同系统里是否是同一个客户、产品或订单，保留信息来源与对应依据，减少重复建档、串客户和相互矛盾的信息。',
          'Identify whether records in different systems refer to the same customer, product or order. Retain sources and matching evidence to reduce duplicate records, mixed customer context and conflicting information.'),
        CP('M12-05', '把业务规则放进执行过程', 'Business rules inside execution',
          '关联报价权限、订单条件、负责人、审批、结果和历史决策，使 AI 不只知道「应该做什么」，还知道「是否允许做、由谁负责」。',
          'Connect pricing authority, order conditions, owners, approvals, outcomes and decision history so AI can determine both the next action and whether it is permitted.'),
        /* How a new company's products, customers and rules enter this map:
           staged and reviewed first, never taken as approved on upload. */
        CP('M12-06', '企业资料模板与行业适配', 'Enterprise data templates and industry adaptation',
          '通过产品、客户、规则等结构化模板帮助新企业接入；先进入待审核区域，再逐步连接正式业务来源，不把导入文件直接变成已批准事实。',
          'Use structured product, customer and rule templates for onboarding. Stage and review data before connecting authoritative sources, rather than treating uploads as automatically approved facts.'),
      ],
      value: B('老板可以这样理解：知识库是企业资料室，业务关系图把客户、产品、订单与责任联系起来。', 'The knowledge base is the company’s reference room; the relationship map connects customers, products, orders and responsibilities.'),
      outputs: B('知道是不是同一个客户、应采用哪一版资料、下一步由谁负责。', 'Understand whether it is the same customer, which information is current and who owns the next step.'),
      availability: B('企业知识与业务关联已有基础；高级关联、企业资料模板与新企业资料接入，按接入情况分阶段完善和验收。', 'Knowledge and business-context foundations exist; richer relationships, enterprise templates and new-enterprise onboarding are delivered and validated in stages.'),
    }],
  },

  /* The control half of M15 (the overview half opens g01) and the parts of
     M16 that say what is switched on and how it is accepted. */
  '13': {
    sources: ['M15', 'M16'],
    summary: B('管理谁能做、谁批准、花了多少、结果是否完成。', 'Control access, approval, spending and verified outcomes.'),
    parts: [
      {
        heading: B('权限、审批与记录', 'Permissions, approvals and records'),
        lede: B('对企业真正重要的是：可管理、可停止、可追踪、可验证，而不是 AI 在对话中声称「已经完成」。', 'What matters is controllable, stoppable, traceable and verifiable work — not an AI message claiming that a task is done.'),
        points: [
          CP('M15-05', '权限、审批与数据保护', 'Permissions, approvals and data protection',
            '按企业和岗位隔离数据与工具权限，控制账号授权及敏感动作；报价、对外触达、付款等关键业务按规则交给有权人员批准。',
            'Separate company and role access to data and tools, control account authorization and sensitive actions, and require authorized approvals for consequential business operations.'),
          CP('M15-06', '操作记录、预算与结果核对', 'Activity records, budgets and result checks',
            '保留动作、审批、依据、成本和工作记录，设置用量与预算边界，核对实际执行结果；失败时报告并停止，或交由人工处理。',
            'Keep actions, approvals, evidence, costs and work records. Set usage and budget limits, check actual outcomes, and report, stop or escalate failed work.'),
        ],
        availability: B('管理与控制已有基础；看板数据、自动动作和高级分析按真实接入验收。', 'Management foundations exist; dashboards, automated actions and advanced analytics require verified data connections.'),
      },
      {
        heading: B('开通范围与验收', 'What is enabled, and how it is accepted'),
        lede: B('先选择一条关键流程，准备产品、客户、知识与业务规则，连接已有账号，配置员工和审批，再用真实样本验证。', 'Start with one key workflow. Prepare products, customers, knowledge and business rules, connect accounts, configure roles and approvals, and validate real cases.'),
        points: [
          CP('M16-01', '平台与业务应用', 'Platform and business applications',
            '桌面、知识、CRM、创意、ERP 和商城等已有应用基础，按企业配置启用。能打开某个应用，不等于所有跨模块自动工作都已验收。',
            'Desktop, knowledge, CRM, creative, ERP and commerce applications have established foundations and are enabled by configuration. Application access does not prove every cross-system workflow is production-ready.'),
          CP('M16-02', '核心获客与销售主线', 'Growth OS and Sales Desk',
            'Growth OS 与 Sales Desk 两大核心业务流程持续完善。真实数据、客户交接、商业价格和对外触达，需要按企业使用场景逐条接通、授权和验证。',
            'The two core workflows continue to evolve. Live data, customer handoffs, commercial prices and external outreach must be connected, authorized and validated for each enterprise use case.'),
          /* V5 writes 「原资料仍记录……验收缺口」 — an editor's reference to its
             source records. On the page it says what those records say. */
          CP('M16-03', '视频与爆款再创作', 'Video and creative adaptation',
            '一键视频与爆款结构再创作已开放，交付的是可播放、可导出的成片文件；成片经人工审核后再发布，生成按企业开通的服务与额度计量。',
            'One-click video and viral creative adaptation are available, and what they deliver is a playable, exportable video file. Finished videos are reviewed before publishing, and generation runs within the services and credits the company enables.'),
          CP('M16-04', '协作、业务理解与记忆', 'Teamwork, context and memory',
            '员工组队、互相交流与协作交付已开放；企业知识及业务关联已有建设。企业级主动工作、统一长期记忆与新企业资料接入，需分阶段完善和验收。',
            'AI employees can already form teams, communicate and deliver together, and enterprise knowledge and business relationships have foundations. Enterprise-wide proactive work, unified memory and new-enterprise onboarding require staged delivery and validation.'),
          CP('M16-05', '高级分析与外部业务系统', 'Analytics and connected business systems',
            '高级增长分析需要合适的资源配置；财务、物流、签章、客户渠道与第三方数据依企业授权及系统情况开放。正式申报、付款和专业审阅由有权人员把关。',
            'Advanced growth analytics needs suitable resources. Finance, logistics, signatures, customer channels and third-party data depend on enterprise access and systems. Authorized people retain control of filings, payments and professional reviews.'),
          CP('M16-06', '行业落地与后续扩展', 'Industry delivery and phased expansion',
            '按行业提供资料模板、流程配置、企业接入和培训。网页端为当前重点，移动端与原生客户端等按路线分阶段完善；具体范围以企业确认的交付内容为准。',
            'Industry delivery includes data templates, workflow configuration, onboarding and training. The browser experience is the current focus; mobile and native clients are phased. Actual delivery follows the enterprise’s agreed scope.'),
        ],
        value: B('交付顺序：确认目标 → 准备资料 → 连接账号 → 配置员工与审批 → 验证成果 → 逐步扩大范围。', 'Delivery: define goals → prepare context → connect accounts → assign roles and approvals → validate results → expand scope.'),
        outputs: B('一条明确的业务流程、所需资料、责任与审批安排，以及可核对的验收结果。', 'A defined workflow, required context, clear responsibilities and approvals, and checkable acceptance results.'),
        availability: B('功能按企业配置与确认范围分阶段开放；这里的说明不代表所有能力已上线或已经再次完成验收。', 'Capabilities are enabled in phases according to enterprise configuration and agreed scope. This overview does not certify all features as live or newly validated.'),
      },
    ],
  },

  '14': {
    sources: ['M13', 'M16'],
    summary: B('从工作结果中积累经验，先验证，再采用改进。', 'Retain useful lessons and validate improvements before adoption.'),
    parts: [{
      lede: B('这里的「主动意识」指感知企业状态、关注目标与期限、发现异常并提出下一步，不是人的主观意识，也不是让 AI 无限制自行决定。', 'Proactive awareness means tracking business state, goals and deadlines, detecting changes and proposing next actions — not human consciousness or unrestricted autonomy.'),
      points: [
        CP('M13-01', '感知机会、风险与承诺', 'Sense opportunities, risks and commitments',
          '围绕已接入的客户、订单、任务和市场信号，持续关注新机会、未回复客户、即将到期事项、异常与待履行承诺。',
          'Track connected customers, orders, tasks and market signals for opportunities, unanswered leads, approaching deadlines, exceptions and outstanding commitments.'),
        CP('M13-02', '目标驱动与下一步建议', 'Goal-driven next-best actions',
          '将「开发某市场」「推进某客户」等目标拆成步骤，结合当前事实提出下一步；证据不足、权限缺失或存在冲突时停下来请求判断。',
          'Break goals such as entering a market or progressing an account into steps. Propose actions from current facts and pause when evidence, permissions or consistency are insufficient.'),
        CP('M13-03', '长期任务与定时检查', 'Durable missions and scheduled checks',
          '按事件或时间触发检查，保留任务目标、计划、待办和状态，支持暂停、恢复与接力；持续执行取决于企业已配置的任务与运行条件。',
          'Trigger checks by events or schedules and preserve goals, plans, tasks and state for pause, resume and handoff. Continued execution depends on configured schedules and operating conditions.'),
        CP('M13-04', '企业与客户长期记忆', 'Enterprise and customer memory',
          '分层沉淀客户偏好、沟通摘要、项目决策、任务结果和操作经验；保留来源、修正和权限，避免把一次猜测长期当成事实。',
          'Develop layered memory for preferences, conversation summaries, decisions, outcomes and procedures, with provenance, correction and access controls rather than permanently retaining unverified guesses.'),
        CP('M13-05', '复盘与技能持续优化', 'Reflection and skill improvement',
          '从成功和失败中提取可改进的工作方法、岗位技能与业务流程，形成候选方案，经过测试、比较和批准后再逐步采用。',
          'Extract candidates for better working methods, role skills and business processes from successes and failures. Test, compare and approve them before gradual adoption.'),
        CP('M13-06', '核对结果，保留改进与回退', 'Check results and retain effective improvements',
          '不仅记录「执行过」，还检查业务结果是否符合目标；失败时保留证据并进入修复或人工处理，改进效果不足时可撤回变更。',
          'Verify that outcomes meet the goal, not merely that execution occurred. Retain failure evidence for recovery or human handling, and withdraw ineffective changes.'),
      ],
      value: B('主动循环：感知变化 → 理解上下文 → 提出行动 → 获得授权 → 执行 → 核对结果 → 沉淀经验。', 'Proactive loop: sense → understand → propose → authorize → act → verify → retain lessons.'),
      outputs: B('机会、期限与异常提醒，保留客户与任务背景，并逐步积累经过验证的工作方法。', 'Surface opportunities, deadlines and exceptions, retain customer and task context, and develop validated working methods.'),
      availability: B('目标推进与受控改进有基础；企业级主动工作与统一长期记忆持续完善，需分阶段验收。关键判断仍由人负责。', 'Foundations exist for goals and controlled improvement; enterprise-wide proactive work and unified memory remain evolving and are validated in stages. People remain responsible for consequential judgment.'),
    }],
  },
};
// V6-C-END




/* ===== V6 D: workforce page =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-D-START

/**
 * workforce.html — the ten role groups (V6 §6.2, V5 M10 and P04).
 *
 * One compact block after the pink panel and before the team scenario. The
 * counts are V4's (pages 21–22) as carried by V5 M10 and V6 §6.2; they are the
 * size of each group in the role directory, not staff, and the note under the
 * total says so. tools/build-site.mjs asserts that
 * there are ten groups and that they add up to `total.count`, which must be
 * 288 — change a number here and the build tells you whether the table still
 * sums.
 *
 * `titleChunks`: the Chinese heading is drawn with `word-break: keep-all`
 * (css/stargo-fusion.css, V6-D) and a <wbr> between these chunks, so it can
 * only break between phrases — 「十类岗位，」/「一个可按任务」/「组织的数字团队。」
 * — never inside one. The longest chunk is eight characters, which fits the
 * narrowest column this heading gets (288px of 32px type at 320). Joined, the
 * chunks are P04's heading word for word; the build checks that too. English
 * is P04's two sentences, each drawn as its own inline block, so a line break
 * falls between them before it falls inside one: as one string the heading
 * read "Ten role groups. One task-" / "focused AI workforce." at 768.
 *
 * `flow` is M10's five steps. The build glues each arrow to the step before
 * it, so a line may end on an arrow but never start with one.
 */
export const WORKFORCE_ROLE_GROUPS = {
  titleChunks: B(['十类岗位，', '一个可按任务', '组织的数字团队。'], ['Ten role groups.', 'One task-focused AI workforce.']),
  intro: B('每个岗位都应有职责、技能、企业知识、可用权限和工作记录。选择谁，不只看名称，还要看本次任务需要什么、允许做什么。', 'A role needs responsibilities, skills, enterprise knowledge, permitted actions and work history. Choose specialists by what the task requires and what they are authorized to do—not by title alone.'),
  flow: B('交办业务目标 → 选择员工或团队 → 分配任务 → 查看工作成果 → 批准关键动作', 'Set the business goal → Select employees or a team → Assign work → Inspect outputs → Approve key actions'),
  unit: B('个岗位', 'roles'),
  groups: [
    { name: B('企业通用支持', 'Enterprise essentials'), count: 15 },
    { name: B('客户开发与市场', 'Customer development & marketing'), count: 50 },
    { name: B('销售', 'Sales'), count: 16 },
    { name: B('客户服务', 'Customer service'), count: 5 },
    { name: B('风控与合规', 'Compliance'), count: 20 },
    { name: B('供应链', 'Supply chain'), count: 4 },
    { name: B('财务', 'Finance'), count: 14 },
    { name: B('运营', 'Operations'), count: 19 },
    { name: B('产品与工程', 'Product & engineering'), count: 129 },
    { name: B('专业服务', 'Professional services'), count: 16 },
  ],
  total: { name: B('合计', 'Total'), count: 288 },
  // M10's value line and availability line, P04's scope line.
  note: B('288 是岗位目录数量：可按任务选择、配置、派工并组队协作的专业数字岗位，不代表替代 288 名真人员工。实际启用的员工、协作规模与操作范围，受企业配置、预算和权限约束。', '288 is the size of the role directory: specialized roles you select, configure, assign and team up by task. It is not a claim to replace 288 people. The employees enabled, the size of a collaboration and permitted actions depend on configuration, budget and access.'),
};

// V6-D-END




/* ===== V6 E: intelligence page =====
   Insertion point for this area's new exports. Keep additions between this
   marker and the next one so parallel edits merge cleanly. */
// V6-E-START
/* intelligence.html: one section of plain explanations (V6 §7, V5 P03, M12,
   M13, M11-05, F09), placed by lxContextSection() in tools/build-site.mjs
   between the 「不再 等提醒 / 等回复 / 丢上下文」 band and the 288-roles
   section.

   WHY A SECTION: V6 asks that enterprise knowledge, the business relationship
   map, one customer across systems, proactive work, long-running tasks,
   long-term memory and improvement each have a readable place on the page, and
   that the knowledge base and the relationship map be explained separately.
   The template's own slots are headlines, fixed-height cards and marquee
   bubbles; none of them holds a sentence such as "answers cite their sources
   and conflicting material is flagged". Improvement is the one topic that
   already has room — the closing card (LX_INTELLIGENCE.ctaDesc) — so it is not
   repeated here; the other six are.

   The heading is P03's headline. The knowledge base (「企业知识库」, the
   company's reference room) and the relationship map are two items, as V6
   asks; the map carries M12-05's rules and approvals, 「同一个客户」 M12-04 and
   M12-06's review area, the memory item V6's 已做事项 / 后续任务. The note is
   P03's availability line with M12's staged templates, M13's controlled
   improvement and F09's boundary, so the page never reads as if proactive
   work, memory or improvement were finished, or as if "proactive" meant a
   mind of its own. The flow line is M13's loop; the build keeps each arrow on
   the line of the step before it. */
export const LX_INTELLIGENCE_CONTEXT = {
  title: B('不只是读文件，', 'More than reading files.'),
  titleSub: B('更要读懂你的公司。', 'Know the company behind the work.'),
  lede: B(
    '产品是什么、客户谈到哪一步、价格该用哪一版、任务该由谁负责——把这些业务背景联系起来，AI 才能提出更有依据的下一步。企业知识、业务关系、长期任务与工作经验，共同服务实际经营。',
    'Which product is involved? Where does the customer stand? Which price is approved? Who owns the next step? Connecting that business context gives AI a better basis for action. Knowledge, relationships, ongoing tasks and retained experience support real work together.'),
  /* Eyebrows: the two halves of the hero line. Three items each. */
  items: [
    { group: B('理解公司', 'Knowing the company'),
      title: B('企业知识库', 'Enterprise knowledge'),
      text: B('公司的资料室：产品目录、技术参数、价格政策、认证、常见问答、合同模板、制度流程和历史项目，集中成可检索的资料库。回答注明依据，记录来源、版本、权限与更新时间；资料冲突或过期时，提示人去核实。',
        'The company’s reference room: catalogs, specifications, pricing policies, certifications, common questions, contract templates, procedures and project history in one searchable library. Answers cite their sources, with version, access and update date recorded; conflicting or outdated material is flagged for a person to check.') },
    { group: B('理解公司', 'Knowing the company'),
      title: B('业务关系图', 'A relationship map'),
      text: B('资料库回答“公司知道什么”；业务关系图说明客户、联系人、产品、询盘、商机、报价、订单、文件、任务和负责人怎样关联：现在到了哪一步，下一步由谁推进。报价权限、订单条件和审批规则也连在其中，AI 因此不只知道下一步做什么，还知道能不能做、由谁批准。',
        'The library holds what the company knows. The relationship map shows how customers, contacts, products, inquiries, opportunities, quotes, orders, documents, tasks and owners connect: where things stand and who moves next. Pricing authority, order conditions and approval rules are part of the map, so AI knows not only the next action but whether it is allowed and who approves it.') },
    { group: B('理解公司', 'Knowing the company'),
      title: B('同一个客户', 'One customer, every system'),
      text: B('邮箱、CRM、ERP 等不同系统里的记录，能判断是不是同一个客户、产品或订单，并保留对应依据，减少重复建档、串客户和互相矛盾的信息。新导入的资料先进入待审核区，不直接当成已确认的事实。',
        'Records in email, CRM, ERP and other systems are checked for whether they describe the same customer, product or order, and the matching evidence is kept: fewer duplicates, mixed-up customers and conflicting facts. Newly imported files wait for review instead of becoming approved facts.') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('盯住机会与期限', 'Opportunities and deadlines'),
      text: B('在已接入的客户、订单、任务和市场信号里，关注新机会、未回复的客户、临近的交期、异常和待批准事项；把“开发一个市场”“推进一个客户”这样的目标拆成步骤，提出有依据的下一步，按授权推进。证据不足、权限缺失或信息冲突时，先停下来请人判断。',
        'Across connected customers, orders, tasks and market signals, it watches for new opportunities, unanswered leads, approaching deadlines, exceptions and pending approvals. Goals such as entering a market or advancing an account become steps with evidence-backed next actions, carried out within authorization. When evidence, permission or consistency is missing, it stops and asks a person.'),
      flow: B('发现变化 → 理解上下文 → 提出建议 → 获得确认 → 推进任务 → 核对结果 → 沉淀经验',
        'Notice a change → Understand the context → Propose an action → Get approval → Act → Check the result → Retain the lesson') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('任务不断线', 'Tasks that carry on'),
      text: B('每项任务保留目标、计划、负责人、认领状态、截止时间、证据、失败原因和下一步，按事件或时间检查进展。暂停、人工接管或恢复之后，接手的人不必从头了解背景。能否持续运行，取决于企业已配置的任务与运行条件。',
        'Each task keeps its goal, plan, owner, claim status, deadline, evidence, failure reasons and next step, with progress checked on events or on a schedule. After a pause, a human takeover or a recovery, whoever picks it up does not start from scratch. Whether it keeps running depends on the tasks and operating conditions the company has configured.') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('长期记忆', 'Long-term memory'),
      text: B('分层留下客户偏好、沟通摘要、项目决定、已做事项与后续任务、任务结果和做事方法。每条记忆标明来源，可以修正，按权限查看，避免把一次猜测长期当成事实。',
        'Customer preferences, conversation summaries, project decisions, completed work and follow-up tasks, task outcomes and working procedures are kept in layers. Each memory shows its source, can be corrected and is visible by permission, rather than keeping an unverified guess as fact.') },
  ],
  noteLabel: B('开放说明', 'Availability'),
  note: B('企业知识、业务关联、目标推进和受控改进已有基础；高级关联与企业资料模板按接入情况逐步完善，企业级主动工作、统一长期记忆与高级改进仍在持续完善。主动工作不是人的主观意识，也不意味着 AI 可以无限制地自行决定，关键判断仍由人负责。',
    'Knowledge, business context, goal progression and controlled improvement have established foundations. Richer relationships and enterprise templates arrive in stages as sources are connected; enterprise-wide proactive work, unified long-term memory and advanced improvement continue to evolve. Proactive work does not imply human consciousness or unrestricted autonomy, and people remain responsible for consequential judgment.'),
};
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
/* V5 P07's interest labels and P08's pricing introduction, which waited here
   for approval, are applied (owner, 2026-09-17): CONTACT.options and
   PRICING.title / PRICING.introBody. The success sentence is js/stargo-forms.js's
   T.sent. */
// V6-G-END




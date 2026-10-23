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
import { STORY_ART, PLACED, CAP_PHOTOS } from './replaceables.mjs';

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
  { href: 'intelligence.html', label: B('企业智能', 'Intelligence') },
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
/** Production origin — canonical URLs, hreflang, Open Graph and the sitemap. */
export const SITE_URL = 'https://stargowork.com';

/* The company's contact details, in ONE place. Everything the site prints or
   links — the footer, the side menu's and the about card's channel buttons,
   the contact page's 「直接联系」 list, the privacy and terms pages, the form's
   fallback notice (handed to js/stargo-forms.js as data attributes by
   tools/chrome.mjs formMarkup) and the Organization JSON-LD — reads them from
   here. The owner set them on 2026-10-21 (his own e-mail for the form and the
   site, his WeChat and phone, and himself as the contact person).
   The one copy that cannot import this file is functions/api/contact.js (a
   Cloudflare Pages Function); its default recipient repeats `email`.
   Phone, WeChat and WhatsApp are the same number. WeChat has no web link, so
   it is printed as text with a copy button (js/stargo-forms.js).
   `labels` names each detail where it is listed. */
export const CONTACT_INFO = {
  person: 'Nick Wei',
  email: 'wei505099021@live.cn',
  phone: '+86 187 7512 7878',
  phoneHref: 'tel:+8618775127878',
  wechat: '18775127878',
  whatsapp: '+86 187 7512 7878',
  whatsappHref: 'https://wa.me/8618775127878',
  site: 'www.stargomoto.com',
  siteHref: 'https://www.stargomoto.com',
  address: B('中国 · 广西 · 柳州', 'Liuzhou, Guangxi, China'),
  labels: {
    person: B('联系人', 'Contact'),
    phone: B('电话', 'Phone'),
    /* The footer's 电话 row: its column leaves 157px for the label at 992px,
       and "Phone +86 187 7512 7878" needs 170px; "Tel …" needs 152. */
    phoneShort: B('电话', 'Tel'),
    wechat: B('微信', 'WeChat'),
    whatsapp: B('WhatsApp', 'WhatsApp'),
    email: B('邮箱', 'Email'),
  },
};
/* The words around those details: the contact page's list heading, and the
   WeChat copy control (js/stargo-forms.js shows `copied` / `wechatCopied` for
   two seconds after the ID reaches the clipboard, and announces it). */
export const CONTACT_UI = {
  heading: B('(直接联系)', '(Reach us directly)'),
  copy: B('复制', 'Copy'),
  copied: B('已复制', 'Copied'),
  /* The footer's WeChat row prints 「微信 <ID>」; its name adds what it does,
     and after a copy the ID gives way to `copiedInline` beside the 「微信」. */
  copyHint: B('（复制）', ' (copy)'),
  copiedInline: B('已复制', 'copied'),
  copyWechat: B('复制微信号', 'Copy WeChat ID'),
  wechatCopied: B('微信号已复制', 'WeChat ID copied'),
  call: B('致电', 'Call'),
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
  ['Be the first to know what’s new.', B('<span class="zh-keep">产品进展</span><span class="zh-keep">第一时间</span><span class="zh-keep">通知你。</span>', 'Stay close to practical AI work.')],   // zh: per-character split; each phrase is kept whole (css/stargo-fusion.css V7-HOME H20)
  ['No noise. Just curated updates.', B('不发广告，只发产品更新。', 'Receive STARGO WORK product notes and practical workflow guides.')],
  ['Thank you for subscribing!', B('订阅成功。', 'You are subscribed.')],
  /* Webflow's two form-state notices (V5 P07). The success row is used only by
     demo-request forms — the contact page card and the 「预约企业演示」 band on
     the home, capability and enterprise pages; the newsletter has its own row
     above — so it names the demo request and promises nothing but a reply to the
     details given. The failure row is shared with the newsletter, and its
     wording fits both. js/stargo-forms.js writes its own sentence over the
     success notice at run time; these are what stands in the markup. */
  ['Oops! Something went wrong while submitting the form.', B('提交没有成功，请稍后再试，或直接用本页的联系方式找我们。', 'We couldn’t submit your request. Please try again later, or reach us using the contact details on this page.')],
  ['Thank you! Your submission has been received!', B('演示申请已收到，我们会通过你留下的联系方式联系你。', 'We’ve received your demo request and will follow up using the contact details you provided.')],
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
  ['placeholder="E-mail"', B('placeholder="邮箱"', 'placeholder="Email"')],
  ['value="Subscribe"', B('value="订阅"', 'value="Subscribe"')],
  ['data-wait="Please wait..."', B('data-wait="请稍候……"', 'data-wait="Please wait…"')],
  ['(Contact us)', B('(联系我们)', '(Contact us)')],
  ['Let&#x27;s talk.', B('聊聊。', 'Let’s talk.')],
  ['placeholder="Name"', B('placeholder="姓名"', 'placeholder="Name"')],
  ['placeholder="Last Name"', B('placeholder="公司"', 'placeholder="Company"')],
  ['placeholder="Email"', B('placeholder="邮箱"', 'placeholder="Email"')],
  ['value="Contact us"', B('value="发送"', 'value="Send"')],
  ['value="Contact Us"', B('value="发送"', 'value="Send"')],
  ['By contacting us, you accept our', B('提交即表示你同意我们的', 'By contacting us, you agree to our')],
  ['>Terms</a> and <', B('>使用条款</a>与<', '>Terms</a> and <')],
  ['>Terms<', B('>使用条款<', '>Terms<')],
  ['>Privacy Policy<', B('>隐私政策<', '>Privacy Policy<')],
  ['>View Work<', B('>查看<', '>View<')],
  ['>Read more<', B('>阅读<', '>Read more<')],
  ['Talk to Denis', B('预约企业演示', 'Book a Demo')],   // the menu card holds one line at 992-1439: the site's own CTA wording
  ['>Schedule a call<', B('>预约演示<', '>Book a Demo<')],
  ['>Get in touch<', B('>联系我们<', '>Get in touch<')],
  ['>Terms of use<', B('>使用条款<', '>Terms<')],
  ['>Privacy policy<', B('>隐私政策<', '>Privacy policy<')],
  ['>Licensing<', B('>第三方声明<', '>Notices<')],
  ['>contact@monostudio.io<', B(`>${CONTACT_INFO.email}<`, `>${CONTACT_INFO.email}<`)],
  ['>info@monostudio.io<', B(`>${CONTACT_INFO.site}<`, `>${CONTACT_INFO.site}<`)],
  /* The number is its own span since the footer also lists 电话 with the same
     number: where the footer column is too narrow for both words (768-1279px,
     css/stargo-fusion.css) this row shows the word 「WhatsApp」 and the number
     stays on the 电话 row, instead of the same digits twice, once unlabelled. */
  ['>(+1) 930 046 720<', B(`><span class="stargo-wa">WhatsApp </span><span class="stargo-wa-num">${CONTACT_INFO.whatsapp}</span><`, `><span class="stargo-wa">WhatsApp </span><span class="stargo-wa-num">${CONTACT_INFO.whatsapp}</span><`)],
  ['href="mailto:contact@monostudio.io"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="mailto:info@monostudio.io"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="tel:(+1)930046720"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.linkedin.com/"', B(`href="${CONTACT_INFO.siteHref}"`, `href="${CONTACT_INFO.siteHref}"`)],
  ['href="https://www.twitter.com/"', B(`href="${CONTACT_INFO.whatsappHref}"`, `href="${CONTACT_INFO.whatsappHref}"`)],
  ['href="https://www.dribbble.com/"', B(`href="mailto:${CONTACT_INFO.email}"`, `href="mailto:${CONTACT_INFO.email}"`)],
  ['href="https://cal.com/"', B('href="contact.html"', 'href="contact.html"')],
];

export const META = {
  /* Titles and descriptions: V5 part F. The build appends the brand (chrome.mjs
     BRAND: 「｜Stargo Work星贸智能AI外贸操作系统」, 「 — Stargo Work」 in English)
     to every title but the homepage's (tools/chrome.mjs head()), so the page
     titles below carry no brand of their own. */
  'index.html': { title: B('Stargo Work星贸智能AI外贸操作系统｜网页桌面级 AI 企业操作系统', 'Stargo Work — Browser-based desktop AI operating system'), description: B('Growth OS 主动找客户，Sales Desk 把询盘一路跟到报价和订单，再连上 ERP、营销内容、企业知识和 288 个跨部门 AI 员工。', 'Growth OS finds prospects and Sales Desk carries them through quotes and orders, connected to ERP, marketing content, enterprise knowledge and 288 AI employees.') },
  'intelligence.html': { title: B('企业智能', 'Enterprise Intelligence'), description: B('AI 带着企业知识、客户历史、业务关系和工作目标做事：会主动提醒，能跟进长期任务，记得住关键信息，还会按结果改进。', 'AI that works from enterprise knowledge, customer history and your goals, sends proactive reminders, keeps long-running tasks moving and improves from results.') },
  'capabilities.html': { title: B('能力全景', 'Capabilities'), description: B('从获客、销售、报价与 PI，到 ERP、履约、AI 图片视频、数字员工、企业知识和管理控制，一页看全 STARGO WORK 的功能。', 'All STARGO WORK capabilities on one page: prospecting, sales, quotes and PI, ERP and fulfillment, AI images and video, AI employees, knowledge and management.') },
  'workforce.html': { title: B('288 个 AI 员工', '288 AI employees'), description: B('288 个 AI 员工，覆盖十类职能。按任务挑人、组队，员工之间互相沟通、分工接力，一起把活干完。', '288 AI employees across ten enterprise functions. Pick them by task, form a team and let them message each other, divide the work and deliver together.') },
  /* Pricing keeps its live title and description: they are also the page's
     visible hero subtitle, and V5 P08's candidate intro needs its own
     commercial approval. */
  'pricing.html': { title: B('定价', 'Pricing: software and growth services'), description: B('对比 STARGO WORK 年度软件订阅，以及可选的建站、内容与获客服务包。', 'Compare the annual STARGO WORK subscription with optional website, content and customer-acquisition service packages.') },
  'enterprise.html': { title: B('企业管理与交付', 'Enterprise control and delivery'), description: B('看清经营重点、谁负责什么、预算、审批和结果；了解账号怎么接入、实施分几步、哪些关键环节由人把关。', 'Review priorities, task owners, budgets, approvals and outcomes. See how company accounts connect, how implementation works and where people stay in control.') },
  'contact.html': { title: B('预约企业演示', 'Book an enterprise demo'), description: B('拿一条具体业务流程来谈：需要哪些资料、账号、岗位和审批，做到什么样算验收合格，再定合适的配置和交付范围。', 'Walk us through one business workflow, the information it needs and what a good result looks like. Together we define the right setup and delivery scope.') },
  'notices.html': { title: B('第三方声明', 'Third-party notices'), description: B('运行时库、字体、图片素材与上游软件的许可与署名。', 'Licenses and attribution for runtime libraries, fonts, imagery and upstream software.') },
  'about.html': { title: B('关于 · 从实际业务出发', 'About: built around real work'), description: B('STARGO WORK 从主动获客和外贸销售做起，连上企业经营、内容生产与数字员工。把工作交给 AI，把决定权留在企业。', 'Connect acquisition, trade sales, business operations, creative work and AI roles. Delegate the work while people retain decision authority.') },
  'blog.html': { title: B('业务实践与产品解读', 'Business practice and product guides'), description: B('讲清客户开发、销售报价、企业知识、数字员工协作和管理，用实际业务流程说明 AI 怎样参与日常工作。', 'Explore customer acquisition, sales, quotes, enterprise knowledge, AI teamwork and management through practical workflow explanations.') },
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
  B('按产品、目标市场和客户类型找目标客户，做背调，查联系人和采购信号，排出先开发谁。数据和客户联系渠道，经你授权后接入。', 'Research target accounts, contacts and buying signals by product, market and customer type, then prioritize who to approach. Data and outreach channels connect with your authorization.'),
  B('主动开发的客户和各渠道询盘都进 Sales Desk。客户记录、回复、产品匹配、报价、审批和 PI，在这里一并处理。', 'Bring prospects and inquiries into Sales Desk for customer records, replies, product fit, quotes, approvals and PI.'),
  B('把产品、采购、库存、生产、质检、订单和发货资料连起来，销售对客户的承诺和实际交付进度对得上。', 'Connect product, purchasing, stock, production, quality, order and shipping records so that what sales promises matches actual delivery.'),
  B('付款节点、对账、物流、单证、出口退税资料和售后问题，拉上各部门一起跟进。', 'Coordinate payment milestones, reconciliation, logistics, trade documents, export tax-rebate materials and customer support across departments.'),
  B('记住客户偏好、历史结果和待办任务，留意补货和复购机会，复盘哪些做法有效。', 'Remember customer preferences, past outcomes and next steps, spot reorder opportunities and review what works.'),
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
  B('主动找到目标客户', 'Find the right prospects'), B('把客户推进到订单', 'Move conversations toward orders'), B('订单多了也接得住', 'Connect sales with operations'),
  B('持续生产营销内容', 'Create reusable marketing assets'), B('AI 员工分工协作', 'Put AI employees to work together'),
];
/** Shorter phrasings swapped in on phones before the text animations split the lines. */
export const HOME_MOBILE = {
  heroSupport: B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动找客户，Sales Desk 推进销售，再连上经营、内容生产和 288 个 AI 员工。', 'A browser-based desktop AI operating system for manufacturers and export teams. Growth OS and Sales Desk connect acquisition and trade sales with operations, creative work and 288 AI employees.'),
  scHero: B('Growth OS 找到并判断客户，确认后交给 Sales Desk 推进沟通、报价与订单；经营、内容和数字员工在同一条主线上配合。', 'Growth OS finds and qualifies accounts; approved prospects move to Sales Desk for conversations, quotes and orders, supported by operations, content and AI teams.'),
  // The core-engines heading sits in a 421px box at 48px type — about eight
  // characters a line on desktop, so the desktop string is built to break on
  // its comma. Below 768px the box holds ten, so phones get a form whose two
  // halves each fit a line.
  products: B('两大引擎，经营与创作', 'Two engines, plus operations and creative work'),
  ladder: B('AI 能力一级级往上加：先打基础，再跑运营，再建增长引擎，最后主动获客。', 'Add AI capacity level by level: foundation, operations, growth engine, then customer acquisition.'),
};
/**
 * Lane parity (2026-10-23): words the phone-only interactions add
 * (css/stargo-phone.css, js/stargo-phone-fx.js). Shown only where those
 * rules show them, so the desktop page carries them hidden.
 *
 * stageLines: one line under each of the five stage titles, below 480px only.
 * There the template hides the picture box that holds each stage's sentence
 * (LOOP_DESC), so a phone reader got five titles and no explanation. Each
 * line is a shortened LOOP_DESC — it says nothing the full sentence does not —
 * and is cut to fit one line at 360px.
 *
 * flipHint: above the pricing ladder on touch screens. A tap turns a card over
 * to its first-year terms and scope (the template's flip), and nothing said so.
 */
export const PHONE_FX = {
  stageLines: [
    B('找客户、做背调，排出先开发谁', 'Find, research and rank accounts'),
    B('询盘、报价、审批和 PI 一处办', 'Inquiries to quotes and PI, in one place'),
    B('采购到发货，对得上销售承诺', 'Delivery that matches what was sold'),
    B('付款、单证和售后，一起跟进', 'Payments, documents and support'),
    B('留意复购，复盘哪些做法有效', 'Reorders, and a review of what worked'),
  ],
  flipHint: B('轻点卡片翻面，看首年价格和服务范围', 'Tap a card for first-year terms and scope'),
};
/* The line at the centre of the workspace film (V6 §4.9). The film is a brand
   animation, not a product recording, so the line says what the workspace is
   for and claims no demonstration. */
export const HOME_THEATRE = B('一个工作台，管好每天的生意。', 'One workspace for everyday business.');

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
  ['John Doe', B('外贸业务员 · 示例场景', 'Export sales rep · illustrative scenario')],
  ['Head design at Circle®', B('读懂业务背景', 'Business context')],
  ['“We didn’t just get a website — we got a solid digital foundation. Mōno™ is the kind of partner you want when building something meant to last.”',
    B('「先挑一条实际业务流程做起，把资料、负责人、审批和验收标准定清楚。」', '“Start with one real workflow and define context, owners, approvals and acceptance.”')],
  ['Amantha Doe', B('外贸经理 · 示例场景', 'Trade manager · illustrative scenario')],
  ['Founder of Radius®', B('落地实施', 'Implementation')],
  ['“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”',
    B('「客户可能到了补货周期，先核实采购信号，再给出跟进建议。」', '“Review evidence for a possible reorder window before suggesting follow-up.”')],
  ['Max Trump', B('销售总监 · 示例场景', 'Sales director · illustrative scenario')],
  ['Founder of Light\u00a0Studio®', B('主动提醒', 'Proactive reminders')],
  ['“What stood out with Mōno™ was the balance between design quality and technical execution. Everything was thoughtful, scalable, and built with term use in mind.”',
    B('「记下成败原因，对比新旧做法，改进先验证、再采用。」', '“Record outcomes, compare approaches and validate improvements before adoption.”')],
  ['Camila Verga', B('总经理 · 示例场景', 'General manager · illustrative scenario')],
  ['Head design at LogoIspum®', B('从结果改进', 'Improving from outcomes')],
  /* the image + quote card that closes the pricing ladder → Enterprise */
  ['&quot;Mōno™ helped us simplify complexity. They streamlined our product narrative, improved performance, and delivered a digital experience that truly reflects our brand. The results were immediate — higher engagement.&quot;',
    B('「多部门、多公司、多品牌、多账号；复杂审批与系统对接；专属前置部署工程师；私有化部署。」', '“Multiple departments, companies, brands and accounts. Complex approvals and system integration. A dedicated FDE. Private deployment.”')],
  ['Elena Rossi', B('企业版 · 定制', 'Enterprise · Custom')],
  ['Marketing Director at Auralis®', B('联系企业版团队', 'Talk to STARGO Enterprise')],

  /* flip cards → the pricing ladder */
  ['Mōno™ stands behind the data.', B('从你需要的那一档开始。', 'One system. The right level of support.')],
  ['Our success is reflected in the numbers we achieve for our clients. Every project is designed with measurable growth at its core.',
    B('一份年度软件订阅，加上可选的建站、内容与获客服务包。服务包标价是首年总价，已含软件订阅；各档服务量不叠加，选哪档就按哪档交付。', 'An annual software subscription, with optional website, content and acquisition services. Service prices are first-year totals that already include the subscription; each tier’s service quantities replace those of the tier below rather than adding to them.')],
  ['(Value created)', B('(标准版)', '(Standard)')],
  ['$174M', B('¥10,000', '¥10,000')],
  ['Empowering growth through strategic solutions.', B('12 个月网页桌面、核心外贸流程与自助线索发现。', 'A 12-month workspace, core trade workflows and self-service lead discovery.')],
  ['CRI: 5.1% → 6.7%', B('首年 ¥10,000 · 按年续费', '¥10,000 first year · renews yearly')],
  ['“We didn’t expect smoother onboarding and a noticeable lift in qualified leads.”', B('「先把企业的知识、客户和报价放进同一个系统。」', '“Put the company’s knowledge, customers and quotes into one system first.”')],
  ['Daniel Kim', B('标准版 · 年度软件订阅', 'Standard · the annual subscription')],
  ['(Return client rate)', B('(上线版)', '(Launch)')],
  ['92%', B('¥20,000', '¥20,000')],
  ['Building lasting partnerships built on trust.', B('官网 3 个核心页面与 20 个 SKU 页、中英文内容、20 个 SKU 的图片与 10 条短视频。', 'A 3-page website with 20 SKU pages, Chinese and English content, 20 SKU image sets and 10 short videos.')],
  ['CRI: 2.9% → 4.4%', B('首年总价 ¥20,000（含 ¥10,000 软件订阅）· 续费另议', '¥20,000 first-year total, subscription included · renewal quoted separately')],
  ['“Everything feels faster, clearer, and more premium. We shipped the redesign and conversions followed immediately.”', B('「把 AI 用到客户看得见的地方。」', '“Put AI to work where customers can see it.”')],
  ['Olivia Carter', B('上线版 · 建站与内容服务', 'Launch · website and content service')],
  ['(Projects delivered)', B('(增长版)', '(Growth)')],
  ['+320', B('¥30,000', '¥30,000')],
  ['Driving successful outcomes across industries.', B('官网 4 个核心页面与 40 个 SKU 页、5 种语言、SEO 与 GEO 实施服务。', 'A 4-page website with 40 SKU pages, five languages and SEO / GEO implementation.')],
  ['CRI: 1.7% → 2.6%', B('首年总价 ¥30,000（含 ¥10,000 软件订阅）· 续费另议', '¥30,000 first-year total, subscription included · renewal quoted separately')],
  ['“The new site finally matches our product. Cleaner UX, better messaging, and results we can actually measure.”', B('「不只把活干完，还开始带动增长。」', '“Beyond doing the work, it starts driving growth.”')],
  ['Marcus Reed', B('增长版 · 更大范围的建站与内容', 'Growth · a wider website and content build')],
  ['(Client retention)', B('(全球获客版)', '(Global Acquisition)')],
  ['88%', B('¥40,000', '¥40,000')],
  ['Optimized journeys that turn traffic into growth.', B('官网 5 个核心页面与 80 个 SKU 页、18 种语言，另加配置完成后 3 个月的获客代运营和 3 份月报。', 'A 5-page website with 80 SKU pages, 18 languages, plus three months of managed acquisition after setup and three monthly reports.')],
  ['CRI: 3.8% → 5.6%', B('首年总价 ¥40,000（含 ¥10,000 软件订阅）· 续费另议', '¥40,000 first-year total, subscription included · renewal quoted separately')],
  ['“The redesign removed friction everywhere. It’s simple, sharp, and performs better across every device.”', B('「标准版自己获客；选这一档，我们替你跑三个月。」', '“Self-service acquisition is in Standard; this plan runs it for you for three months.”')],
  ['Sofia Martinez', B('全球获客版 · 获客代运营', 'Global Acquisition · managed acquisition')],
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
    B('它是一套面向制造业与外贸企业的网页桌面级 AI 企业操作系统。业务主线是 Growth OS 主动获客和 Sales Desk 外贸销售，同时连着企业经营、内容生产、企业知识和数字员工；审批和最终决定，始终由人来做。', 'It is a browser-based desktop AI operating system for manufacturing and global trade enterprises. Growth OS (prospecting) and Sales Desk (trade sales) form the core, connected to operations, creative work, enterprise knowledge and AI employees, while people keep approval and the final say.')],
  ['How do you determine the right strategy?', B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Do we have to replace our current CRM, ERP, email and cloud drives?')],
  ['Every project starts with a discovery phase where we analyze your goals, audience, and competitors. Based on this, we craft a custom strategy that aligns with your objectives and maximizes your digital',
    B('不用一上来全部换掉。STARGO WORK 把你们现有的业务账号和资料接到同一个工作台。哪些系统保留、接入或调整，按你们现在用的软件和权限逐项确认。', 'Not necessarily. STARGO WORK connects your existing accounts and information in one workspace. Which systems you keep, connect or adjust depends on your current software and access permissions.')],
  ['How long does a typical project take?', B('288 个 AI 员工是什么意思？', 'What does “288 AI employees” mean?')],
  ['Project timelines vary depending on scope. A branding or website project typically takes 4–8 weeks, while marketing campaigns are ongoing with monthly optimization and reporting',
    B('指的是 288 个专业岗位，按任务挑选，覆盖十类职能，不只做外贸销售。每个岗位可配置职责、知识、技能和权限；多位员工可以组成团队，互相沟通、分工完成同一项任务。288 不等于替代 288 名真人，实际启用多少员工、协作规模多大、能做哪些操作，由配置、预算和权限决定。', 'It means 288 specialized roles, picked by task, across ten enterprise functions, not just trade sales. Each role can be configured with responsibilities, knowledge, skills and access, and several can form a team, message each other and complete one task together. The number is not a claim to replace 288 people; the employees enabled, the size of a collaboration and permitted actions depend on configuration, budget and access.')],
  ['Do you work with businesses in any industry?', B('报价、发消息、付款这些关键操作，谁说了算？', 'Who decides on quotes, messages and payments?')],
  ['Yes! We’ve worked with startups, tech companies, e-commerce brands, real estate firms, and service providers. Our process is adaptable to fit the needs of different industries and audiences',
    B('有审批权的人说了算。AI 负责准备资料、起草和提建议；报价、对外联系、重要承诺、正式申报和付款，都按公司规则审批。批准、发送、核对结果，是分开的三步。', 'People with approval rights do. AI can organize information, prepare drafts and recommend next steps. Quotes, outreach, important commitments, official submissions and payments follow your approval rules. Approving, sending and checking the outcome are separate steps.')],

  /* hero support — the product definition, in the readable introduction rather
     than in the giant brand lettering (V6 §4.1). */
  ['No cookie cutter sites. No empty claims. Only practical tools and smart strategies that drive growth and build brands.',
    B('面向制造业与外贸企业的网页桌面级 AI 企业操作系统。Growth OS 主动找客户，Sales Desk 推进销售；再连上 ERP、AI 创作和 288 个跨部门 AI 员工，关键决定由你们拍板。', 'A browser-based desktop AI operating system for manufacturers and export teams. Growth OS finds prospects; Sales Desk advances sales. ERP, creative work and 288 cross-functional AI employees support the business, with your team in control.')],

  /* who we are → 288 cross-functional roles (V6 §4.4). The counter card says
     what the number is — a role directory across ten functions whose roles
     team up by task; the ten groups and their counts are on the workforce
     page. (The owner retired the "not running at once" wording on
     2026-09-17.) */
  ['We shape brands with focus, intention, and impact.', B('288 个 AI 员工，不只服务外贸。', '288 AI employees across your enterprise.')],
  /* The approval card (V5 H08): AI prepares, an authorized person decides, and
     the three states — approved, sent, received — are never run together.
     V5's lines are cut to the template's own lengths: the label and the two
     statements sit beside the heading, and at 768–1024 the longer V5
     sentences ran over it. */
  ['Pricing with', B('AI 做准备，', 'AI prepares.')],
  ['complete transparency', B('由你拍板。', 'You decide.')],
  ['(Performance Boost)', B('(决定权始终在人)', '(Humans stay in command)')],
  ['Page speed +78%,', B('批准≠已发送；', 'Approved ≠ sent.')],
  ['Bounce rate -13%', B('提交≠已完成。', 'Submitted ≠ done.')],
  ['View pricing', B('认识数字员工', 'AI Workforce')],   // short: at 768 a longer English label covered the two statements beside it
  ['(Live collaboration)', B('(审批流程示意 · 非真实客户事件)', '(Illustrative approval workflow)')],
  ['Today 17:01', B('步骤 1', 'Step 1')],
  ['Today 17:02', B('步骤 2', 'Step 2')],
  ['Hey hey!', B('报价草稿已整理', 'Quote draft prepared')],
  ['Love the design', B('条款超出规则，依据已附上', 'Terms exceed policy; evidence attached')],
  ['Can we tweak the hero?', B('请审批人确认', 'Needs an authorized reviewer')],
  ['>Sure<', B('>批准此版本<', '>Approve this version<')],
  ['We’ll update it shortly', B('已保留批准版本', 'Approved version kept')],
  ['Perfect! Thank you.', B('是否对外发送，另行确认。', 'Sending is confirmed separately.')],

  /* marquee — five verbs along the business journey (V6 §4.5); no product
     names and no feature lists inside the letter-by-letter animation. */
  ['Built Different', B('找到客户。', 'Find prospects.')],
  ['Design with purpose', B('理解需求。', 'Understand needs.')],
  ['Code with passion', B('推进订单。', 'Advance orders.')],
  ['Create with vision', B('制作内容。', 'Create content.')],
  ['Innovate always', B('管好经营。', 'Coordinate work.')],
  ['(Our Vision)', B('(一条业务主线)', '(One business flow)')],
  ['(Scroll for more)', B('(继续滚动)', '(Keep scrolling)')],

  /* services → the five macro stages (descriptions; titles come from the domain labels below) */
  ['We create scroll-stopping social content designed to build brand presence and drive engagement.', LOOP_DESC[1]],
  ['We craft cohesive brand identities that communicate purpose, personality, and credibility.', LOOP_DESC[3]],
  ['We develop strategic marketing assets that amplify brand reach and support growth.', LOOP_DESC[4]],

  /* pricing block → fragmented vs connected work (V5 H10, V6 §4.10). It
     compares how work is organized — five kinds of work, the scattered way and
     the connected way — not "hire people" against "buy AI". */
  ['Choose the plan that fits you best.', B('目的不是简单地“加人”或“换掉人”，而是少做重复工作，交接不再脱节。', 'The goal is not simply to add or replace people, but to reduce repetitive work and disconnected handoffs.')],
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
  ['High-end design with smooth interactions', B('获客：背调依据、开发优先级与下一步', 'Prospecting: evidence, priorities and next steps kept together')],
  ['Complete on-site SEO setup', B('销售：客户背景、回复和报价一路接上', 'Sales: customer context, replies and quotes carried forward')],
  ['Adaptive layouts for every screen', B('经营：订单、交期、付款与服务接力', 'Operations: orders, lead times, payments and service handed on')],
  ['CMS setup for content or case studies', B('内容：产品资料、品牌、素材与版本统一组织', 'Content: product facts, brand, assets and versions organized together')],
  ['Performance tuning &amp; optimization', B('管理：看负责人、卡点和审批，核对结果', 'Management: owners, blockers, approvals and checked results')],
  ['1-2 weeks', B('反复复制粘贴', 'repeated copying')],
  ['2-3 weeks', B('连续推进', 'continuous progress')],
  ['(Looking for more?)', B('(从哪里开始？)', '(Where to start?)')],
  ['Expand your scope with marketing, SEO, or content creation.', B('先跑通一件事，再推广到全公司。你最想先改善的，是找客户、询盘跟进、报价、订单交付，还是营销内容？', 'Start with one workflow. Then expand across your company. Is your priority prospecting, inquiry follow-up, quoting, order delivery or marketing content?')],

  /* work cards → the problem (V5 H03, V6 §4.2): the same four pictures — email,
     chat, spreadsheet, ERP — each with the short title of what goes wrong
     there. The full explanation is in the business journey that follows. The
     heading is V6's 「工具很多，业务却还在靠人连接」 cut to the old heading's
     nine characters: the column holds three a line between 768 and 1024px,
     and the full sentence stood six lines tall there. */
  ['(Portfolio 26©)', B('(缺的从来不是一个软件)', '(The problem was never a missing tool)')],
  ['<h2 class="h2">Work<span class="small-ftd">(4)</span></h2>', B('<h2 class="h2">工具<wbr/>很多，靠人<wbr/>连接<span class="small-ftd">(4)</span></h2>', '<h2 class="h2">Many tools, manual handoffs.<span class="small-ftd">(4)</span></h2>')],
  ['Forma Digital', B('询盘来了，还要重新整理', 'Email inquiries still need organizing')],
  ['One Step', B('窗口很多，客户信息分散', 'Too many chat windows, customer details scattered')],
  ['Nero Vision', B('客户在表格，跟进靠人记', 'Customers in sheets, follow-up by memory')],
  ['Bold Moves', B('订单在后台，销售还在追问', 'Orders in the back office; sales still chasing')],
  ['View all work', B('看业务主线', 'See the business flow')],

  /* blog cards: the template's four-card grid, filled from BLOG (build-site.mjs) */
  ['Smart insights.', B('最新文章。', 'Latest articles.')],
  ['>See all<', B('>全部文章<', '>All articles<')],

  /* short / global */
  ['>Get started<', B('>聊聊你的流程<', '>Discuss your workflow<')],
  ['>Book a call<', B('>预约企业演示<', '>Book a Demo<')],
  ['>Contact us<', B('>预约企业演示<', '>Request a Demo<')],
  ['Let&#x27;s talk', B('预约企业演示', 'Book a Demo')],
  ['Scroll Down', B('向下滚动', 'Scroll down')],
  ['(Who we are)', B('(288 个 AI 员工 · 组队协作)', '(288 AI employees · working as teams)')],
  ['(Team of experts)', B('(按任务组队)', '(Teams by task)')],
  ['(Services)', B('(五个业务阶段)', '(Five business stages)')],
  ['(Pricing)', B('(两种工作方式)', '(Two ways of working)')],
  ['(FAQ)', B('(常见问题)', '(FAQ)')],
  ['(Testimonials)', B('(四个示例场景 · 非客户评价)', '(Four illustrative scenarios · not customer reviews)')],
  ['(Success stories)', B('(企业版)', '(Enterprise)')],
  ['(Stats)', B('(定价 · AI 层级)', '(Pricing · the AI ladder)')],
  ['(Blog)', B('(博客)', '(Blog)')],
  ['(Project)', B('(工作方式)', '(Workflow)')],
  ['What&#x27;s included:', B('工作：', 'The work:')],
  ['Timeline:', B('结果：', 'The result:')],
  ['Pick Smart.', B('少一些复制粘贴。', 'Less copying.')],
  ['Pay Less.', B('多一些连续推进。', 'More continuity.')],
  ['Build Better.', B('关键是连起来。', 'Connected work.')],
  ['Web Design', LOOP_LABELS[0]],
  ['Social Media', LOOP_LABELS[1]],
  ['Development', LOOP_LABELS[2]],
  ['Brand Identity', LOOP_LABELS[3]],
  ['>Marketing<', B(`>${LOOP_LABELS[4].zh}<`, `>${LOOP_LABELS[4].en}<`)],
  ['Showreel 26©', HOME_THEATRE],
  ['+13', B('288', '288')],
  ['team members', B('个 AI 员工', 'AI employees')],
  ['across the', B('覆盖', 'across')],
  ['>World<', B('>十类职能<', '>ten enterprise functions<')],
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
  caption: B('(九步细看)', '(Nine steps in detail)'),
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
    'The homepage’s five stages, broken into nine steps here: one business flow, not two systems.'),
  rows: [
    ['01 · DISCOVER', B('发现目标客户。围绕产品、目标市场和客户类型，从搜索、企业官网、地图、社交平台、展会及依法授权的贸易数据中寻找经销商、进口商与目标企业。', 'Discover target accounts. Around your products, markets and buyer types, find dealers, importers and target companies through search, websites, maps, social channels, trade shows and lawfully authorized trade data.'),
      B('按产品和目标市场，主动找出值得开发的客户。', 'Find companies worth pursuing for your products and markets.'), '02'],
    ['02 · QUALIFY', B('判断谁值得开发。综合产品匹配、市场适配、采购信号、联系人覆盖、风险和商业价值，形成客户画像、商机简报与开发优先级；证据不足时标注待核实。', 'Decide who is worth developing. Combine product fit, market fit, buying signals, contact coverage, risk and commercial value into account profiles, opportunity briefs and priorities; weak evidence is flagged for checking.'),
      B('结合采购信号与背调判断机会；证据不足先核实，不猜。', 'Qualify with buying signals and research; weak evidence is checked, not guessed.'), '02'],
    ['03 · ENGAGE', B('开始联系。准备多语言开发邮件、沟通话术与跟进计划，经确认后按授权渠道触达；确认的客户连同背调与下一步任务转入 Sales Desk。', 'Start the conversation. Prepare multilingual emails, messaging and follow-up plans, reach out through authorized channels once approved, and hand approved prospects to Sales Desk with their research and next actions.'),
      B('开发计划确认后，再按授权渠道联系客户。', 'Once the plan is approved, reach out through authorized channels.'), '03'],
    ['04 · UNDERSTAND', B('理解客户要什么。邮件、网站、WhatsApp 与阿里国际站等渠道的询盘进入同一入口，识别产品、规格、数量、交期和缺失信息，并更新客户全景。', 'Understand what the customer needs. Inquiries from email, the website, WhatsApp, Alibaba.com and other channels arrive in one intake; products, specifications, quantities, deadlines and missing details are identified and the customer record is updated.'),
      B('询盘与主动开发的客户进入 Sales Desk，需求汇在一处。', 'Prospects and inquiries meet in Sales Desk, with requirements in one place.'), '04'],
    ['05 · RESPOND', B('有依据地回复。查询产品参数、价格政策、MOQ、包装、认证与交期，辅助产品匹配和多语言回复；缺少真实资料时明确提示，重要回复由人审核或接管。', 'Reply with evidence. Check specifications, pricing policy, MOQ, packaging, certifications and lead times to support product matching and multilingual replies; missing facts are flagged, and important replies are reviewed or taken over by a person.'),
      B('依据企业确认的资料起草回复；缺资料就标出，由人复核。', 'Draft replies from verified company facts; gaps are flagged and a person reviews.'), '04'],
    ['06 · QUOTE', B('按规则报价。按产品配置、数量、包装、币种和贸易条款准备报价草稿，关联价格表、历史报价、折扣权限与利润边界；批准后形成 PI，批准不等于已经发送。', 'Quote within the rules. Draft from product configuration, quantity, packaging, currency and trade terms, using approved pricebooks, quote history, discount permissions and margin limits; the PI follows approval, and approval is not sending.'),
      B('按价格规则和利润底线起草报价，批准后再转 PI。', 'Quote within pricing rules and margin limits; the PI follows approval.'), '07'],
    ['07 · EXECUTE', B('让后台接住订单。衔接产品物料、采购、库存、生产质检、包装发货，以及商业发票、装箱单、原产地证资料、提单与认证资料；正式签发与申报由相应机构办理。', 'Carry the order into operations. Connect materials, purchasing, stock, production and quality, packing and shipment, plus commercial invoices, packing lists, origin materials, bills of lading and certifications; official issuance and filing stay with the relevant authorities.'),
      B('订单转入 ERP，跟进物料、生产、质检、单证和发货。', 'Hand the order to ERP and fulfillment: materials, production, QC, documents, shipment.'), '08'],
    ['08 · FOLLOW-UP', B('持续跟进。跟踪订金、尾款与对账提醒，协同物流、售后、保修与备件，整理经销商历史订单与补货机会，唤醒沉睡客户；资金支付由有权人员决定。', 'Keep following up. Track deposits, balances and reconciliation reminders, coordinate logistics, service, warranty and spare parts, and surface dealer reorder and reactivation opportunities; payments remain with authorized people.'),
      B('付款节点、售后和补货机会，每一步都有人负责。', 'Payments, service and reorders: every next step has an owner.'), '05'],
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
  ['All in one ecosystem for your business', B('(面向制造业与外贸企业)', '(For manufacturing &amp; global trade)')],
  ['The platform that ', B('先找客户，', 'Find the customer. ')],
  ['helps you', B('再推进到', 'Carry it through to')],
  ['Build.', B('报价。', 'quotes.'), { count: 2 }],
  ['Scale.', B('履约。', 'delivery.')],
  ['Operate.', B('复购。', 'repeat orders.')],
  ['Scalora is a business platform designed to help teams manage marketing, operations, and growth from one workspace.',
    B('Growth OS 负责发现目标客户、查清背景和判断商机；确认后转入 Sales Desk，继续沟通、匹配产品、报价和跟进订单。ERP、内容生产和 AI 团队，都在同一条业务主线上配合。', 'Growth OS finds accounts, researches the buyer and qualifies the opportunity. Approved prospects move into Sales Desk for conversations, product matching, quotes and order follow-through, supported by operations, creative work and AI teams.')],
  ['Get started free', B('预约企业演示', 'Request a Demo'), { count: 2 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Growth OS<', '>Growth OS<'), { nth: 0 }],
  ['>CRM platform<', B('>主动发现并判断客户<', '>Find and qualify accounts<'), { nth: 0 }],
  ['>Scalora<', B('>STARGO<', '>STARGO<'), { nth: 0 }],
  ['>CRM<', B('>Sales Desk<', '>Sales Desk<'), { nth: 0 }],
  ['>CRM platform<', B('>确认后的客户接着跟进<', '>Approved prospects, carried forward<'), { nth: 0 }],
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
  ['Scalora Marketing', B('Sales Desk · 外贸销售', 'Sales Desk · Trade sales')],
  ['Scalora Docs', B('ERP · 企业经营', 'ERP · Operations')],
  ['Scalora Ops', B('AI 创作 · 图片与视频', 'AI Creative · Images &amp; video')],
  ['Manage leads, automate follow-ups, track deals, and close faster with a smart, visual CRM built for modern sales teams.',
    B('找出目标客户，查清公司和联系人，分析采购信号，排出开发先后。确认后，把背调、产品兴趣和下一步任务交给 Sales Desk。数据和客户联系渠道，经你授权后接入。', 'Discover target accounts, research companies and contacts, and assess buying signals. Pass approved prospects, product interests and next actions to Sales Desk. Data and outreach channels connect with your authorization.')],
  ['Plan, launch, and optimize campaigns across email, ads, and landing pages — all tracked in one dashboard.',
    B('主动开发的客户和各渠道询盘都在这里跟进：CRM、沟通记录、产品匹配和回复放在一处，再一路接到报价、审批、PI 和订单交接。', 'Bring prospects and inquiries into one sales workspace for CRM, customer history, product matching, replies and follow-up, connected to quotes, approvals, PI and order handoffs.')],
  ['Create, manage, and collaborate on documentation, SOPs, and internal knowledge in one flexible workspace.',
    B('客户需求直接对上产品物料、采购、库存、生产质检、订单发票和商城业务，销售能看清能不能交、什么时候交、还在等哪个环节。', 'Connect demand with products, materials, purchasing, inventory, production, quality, orders, invoices and commerce so sales knows what can ship, when, and what is still pending.')],
  ['Build workflows that connect your teams, data, and tools — without complex integrations.',
    B('用你们自己的产品和品牌资料，做主图、场景图、详情页、图册和多语言内容；一句话需求就能生成营销视频，也能借鉴爆款视频的结构做原创改编。生成内容经人工审核后再用，按开通的服务和额度计量。', 'Build product images, scenes, detail pages, catalogs and multilingual content from verified product and brand information; turn a brief into a marketing video, or adapt a proven video structure into original work. Generated content is reviewed before use and metered against the services and credits your company enables.')],
  ['Dashbord Image', B('界面示意图', 'Interface illustration')],
];
/* The channel band (V5 H09, V6 §4.8): three different uses — finding
   customers, carrying conversations, publishing content — and no promise
   that a platform on the diagram is switched on. */
export const HOME_SC_INTEGRATION = [
  ['Integration Icon', B('渠道图标', 'Channel icon')],
  ['>Integration<', B('>(发现客户 · 沟通跟进 · 内容发布)<', '>(Discover · Converse · Publish)<')],
  ['One AI Engine. Fully Connected.', B('渠道可以不同，业务不必断开。', 'Different channels, one business context.')],
  ['Scalora connects your CRM, website, ads, and commerce tools into one intelligent automation system.',
    B('找客户的信息来源、跟客户沟通的渠道、发内容的平台，用处各不相同。经你授权，STARGO WORK 把它们的信息汇进同一套客户、销售和跟进流程。页面上列出的平台，不代表都已默认开通，也不代表都能收发消息。', 'Research sources, conversation channels and publishing platforms serve different purposes. With your authorization, STARGO WORK brings their activity into shared customer, sales and follow-up workflows. A listed platform is not a promise of default access or full read-and-write permissions.')],
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
  heroDesc: B('AI 理解公司，主动推进工作', 'Know the company. Keep work moving.'),
  tags: LX_TAGS,
  features: [
    /* P03's three entries. The second carries V6's four implementation steps
       for this page (observe the real workflow, prepare context, arrange
       roles and approvals, validate with real cases); the gradient headings
       below repeat them as P03's 落地四步. */
    { title: B('业务关系', 'Connections'), text: B('客户、产品、报价、订单<wbr>和负责人，不再是<wbr>互不相干的记录。', 'Customers, products, quotes, orders and owners, connected.') },
    { title: B('按流程落地', 'Real workflows'), text: B('先了解业务，再安排<wbr>资料、岗位与审批，拿实际业务验收。', 'Workflow first, then data, roles, approvals and real-case tests.') },
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
    B('交期临近，出货单证还没备齐。', 'Delivery is close; shipping documents aren’t ready.'),
    B('一份报价在等负责人批准。', 'A quote is waiting for its approver.'),
    B('某款产品在某个市场搜索量上升。', 'Search demand for a product rises in one market.'),
    B('发现变化 → 弄清业务背景', 'Notice a change → understand the context'),
    B('提出建议 → 请人批准', 'Propose an action → get approval'),
    B('推进任务 → 核对结果', 'Act → check the result'),
    B('总结经验，下次用上', 'Retain the lesson for next time'),
    B('证据不足时，先停下来请人判断。', 'Not enough evidence? It stops and asks.'),
  ],
  /* 等提醒 rather than 等提示: M13's 「不再每件事，都等你开口提醒。」, and no
     echo of 提示词. Same width, so the band's sizes still hold. The English
     says the same — nobody has to nudge — rather than "prompting", and is
     shorter than "forgetting", the widest word the English sizes are set for. */
  words: [B('不再', 'No'), B('等提醒', 'nudging'), B('等回复', 'waiting'), B('丢背景', 'forgetting')],
  /* M11 in plain words: the 288 roles work as a team on one task. The two
     headings break at their commas on a phone (keep-all, V6-E). The English
     title is one line at 320; "288 specialized roles." left "288" alone
     there. */
  feat2Title: B('288 个岗位，', '288 AI roles.'),
  feat2Sub: B('分工协作，把事做完。', 'Divide the work. Finish it together.'),
  feat2Card: { title: B('按任务组队', 'Task teams'), text: B('复杂任务可以拆给研究、销售、产品、创意等岗位分工去做：互相发消息、提问、补资料，分头并行，按职责交接，最后由统筹角色汇总，交负责人确认。协作轮数与预算有上限，随时可以叫停。', 'A complex task can be divided among research, sales, product and creative roles. They message each other, ask questions, fill gaps, work in parallel and hand off to whoever owns the next step; a coordinating role pulls it together for the responsible person to confirm. Collaboration rounds and budgets are capped, and the work can be stopped at any time.') },
  feat2Button: { label: B('认识数字员工', 'Meet the AI workforce'), href: 'workforce.html' },
  /* P03's ongoing-work heading, one phrase per line: at 768 the box is five
     characters wide, and a forced break is the only break a phrase gets. */
  feat2Lines: [B('工作暂停，', 'Resume the task'), B('背景不必', 'without rebuilding'), B('从头解释。', 'the context.')],
  /* P03's improvement heading on the closing card; M13-05/06 underneath, with
     V6's 复盘成败 / 比较新旧方法 and P03's 「高级改进持续完善」 — this card
     is the page's one body-text place for improvement (the foundation half of
     that availability line is in LX_INTELLIGENCE_CONTEXT.note). About as long
     as the text it replaces: the card grows with its copy, and on a phone the
     copy column is eleven characters wide. */
  ctaTitle: B('把有用的方法<wbr>留下，', 'Keep what works.'),
  ctaSub: B('把无效的改动<wbr>撤回。', 'Roll back what doesn’t.'),
  ctaLogo: B('STARGO WORK', 'STARGO WORK'),
  ctaDesc: B('每次执行都留下记录：做了什么，是否达到目标，人在哪里修正过。从成败中复盘出更好的做法，先测试、与现行做法比较，批准后再逐步采用；效果不好就撤回，失败的记录留作修复依据，或转人工处理。', 'Every run leaves a record: what was done, whether it met the goal and where a person corrected it. Better methods drawn from successes and failures are tested, compared with the current way and adopted gradually after approval. Changes that do not help are withdrawn; failures keep their evidence for repair or hand-off to a person.'),
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
  store1: { name: B('认识数字员工', 'Meet the AI Workforce'), sub: B('288 个 AI 员工', '288 AI employees'), href: '#lx-teams' },
  store2: { name: B('定价', 'Pricing'), sub: B('从企业需要的层级开始', 'Start at the level you need'), href: 'pricing.html' },
  heroDesc: B('按任务选择岗位，组成 AI 团队，关键决定由人确认。', 'Select roles by task, form an AI team and keep key decisions with people.'),
  tags: LX_TAGS,
  features: [
    { title: B('有岗位', 'Has a job'), text: B('职责、技能、企业知识、可用工具、权限和运行记录，都可以按岗位配置。', 'Responsibilities, skills, enterprise knowledge, permitted tools, access and run history are configured per role.') },
    { title: B('按任务组队', 'Teams by task'), text: B('按岗位、技能、权限与任务复杂度选择员工，明确每个成员的职责。', 'Choose employees by role, skills, access and task complexity, with a clear job for each member.') },
    { title: B('网页桌面', 'Browser desktop'), text: B('以网页桌面为主，打开浏览器就能用；语音、自动化和其他终端也都已上线。', 'Browser-first, and voice, automation and other clients are live too.') },
  ],
  cards: [
    { title: B('市场研究 AI 员工', 'Market Research AI'), text: B('目标市场、需求变化、竞争格局。', 'Target markets, demand shifts, competitive landscape.') },
    { title: B('销售跟进 AI 员工', 'Sales Follow-up AI'), text: B('客户记录、回复与下一步跟进。', 'Customer records, replies and next steps.') },
    { title: B('产品规格 AI 员工', 'Product Spec AI'), text: B('核对需求、配置与参数。', 'Requirements, configurations and specifications checked.') },
    { title: B('报价 AI 员工', 'Quotation AI'), text: B('报价草稿、价格规则与审批依据。', 'Quote drafts, pricing rules and the basis for approval.') },
    { title: B('财务对账 AI 员工', 'Reconciliation AI'), text: B('付款节点、对账与应收提醒。', 'Payment milestones, reconciliation and receivable reminders.') },
    { title: B('内容 AI 员工', 'Content AI'), text: B('按产品与品牌资料准备营销素材。', 'Marketing assets prepared from product and brand information.') },
    { title: B('统筹 AI 员工', 'Coordination AI'), text: B('汇总成果与未决问题，交负责人确认。', 'Results and open questions consolidated for the responsible person.') },
  ],
  gradient: [B('网页桌面', 'Browser desktop'), B('多应用与文件', 'Apps and files'), B('表格与报告', 'Sheets and reports'), B('授权网页任务', 'Authorized web tasks')],
  bigText: B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.'),
  bubbles: [
    B('价格', 'Price'), B('利润', 'Margin'), B('正式报价', 'Formal quote'), B('PI', 'PI'), B('重要客户回复', 'Key customer reply'),
    B('关键审批', 'Key approval'),
    B('关键业务动作', 'Critical business action'), B('对外付款', 'Outbound payment'), B('合同条款', 'Contract terms'),
    B('人掌权', 'People decide'), B('AI 干活', 'AI does the work'), B('人工确认', 'Human review'),
  ],
  words: [B('不再', 'No'), B('从零交代', 'starting from zero'), B('丢背景', 'lost context'), B('反复转述', 'repeated relaying')],
  feat2Title: B('交办之后，进度看得见。', 'After you delegate, progress stays visible.'),
  feat2Sub: B('定时与事件任务，按授权开放。', 'Scheduled and event-based tasks, as authorized.'),
  feat2Card: { title: B('统筹角色', 'Coordinating role'), text: B('研究、销售、产品与内容员工并行处理子任务，互相传递信息、交接结果；统筹角色复核并汇总成果，只把需要人决定的事项交回。', 'Research, sales, product and content roles work on subtasks in parallel, passing information and results to each other; a coordinating role checks and consolidates the output and hands back only what a person must decide.') },
  feat2Button: { label: B('查看定价', 'See pricing'), href: 'pricing.html' },
  feat2Lines: [B('定时任务', 'Scheduled tasks'), B('事件触发', 'Event triggers'), B('按授权范围运行', 'Within authorized scope')],
  ctaTitle: B('别买 AI 工具。', 'Don’t buy AI tools.'),
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
  introBody: B('软件使用、实施配置、内容制作和获客服务，交付内容各不相同。先想清楚要用哪些功能、接哪些系统、由谁来执行，再定方案范围。', 'Software access, implementation, content production and acquisition services are different deliverables. Define the capabilities, connected systems and responsibilities first, then agree on the scope.'),
  /* The workforce line on the price card (tools/blocks/cn-price-card.mjs): the
     figure, then the sentence split at its first comma. Restored to the live
     wording on the owner's instruction of 2026-09-17; the enterprise page keeps
     its own line (ENTERPRISE.stats[0]). */
  cardStat: { value: '288', text: B('个 AI 员工，在企业设定的权限范围内工作。', 'AI employees, working inside the permissions the company sets.') },
  toggleA: B('首年总价', 'First-year total'),
  toggleB: B('续费', 'Renewal'),
  tabs: [B('平台方案', 'Software & launch'), B('获客与企业', 'Growth & enterprise')],
  unitYear: B('/ 年', '/ year'),
  unitFirst: B('/ 首年', '/ first year'),
  renewalPrice: B('联系我们', 'Ask us'),
  panes: [
    [
      { name: B('标准版', 'Standard'), price: '¥10,000', unit: 'year', renewal: '¥10,000',
        desc: B('适合想自己把 AI 用进外贸流程的团队。', 'For teams that want to run their own AI-assisted export workflow.'),
        cta: B('了解标准版', 'Discuss Standard'),
        items: [B('12 个月网页桌面，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'), B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for enterprise knowledge, FAQ and up to 20 SKUs'), B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quote and CRM workflows'), B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'), B('年度标准 AI 额度，配置一次、培训一次', 'Standard annual AI credits, one setup session and one training session')] },
      { name: B('上线版', 'Launch'), price: '¥20,000', unit: 'first', renewal: 'ask',
        desc: B('适合需要官网和第一套外贸销售素材的制造企业。', 'For manufacturers that need a website and a first set of export sales assets.'),
        cta: B('了解上线版', 'Discuss Launch'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 3 个核心页面与 20 个 SKU 模板页', 'A website with 3 core pages and 20 SKU template pages'), B('中英文官网内容', 'Chinese and English website content'), B('20 个 SKU 的图片内容与 10 条实拍短视频', 'Product images for 20 SKUs and 10 short videos'), B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds')] },
      { name: B('增长版', 'Growth'), price: '¥30,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合想多展示产品、多加语种、让买家更容易搜到的团队。', 'For teams expanding product presentation, languages and search visibility.'),
        cta: B('了解增长版', 'Discuss Growth'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 4 个核心页面与 40 个 SKU 模板页', 'A website with 4 core pages and 40 SKU template pages'), B('中英文，另加 3 个语种', 'Chinese and English plus 3 further languages'), B('40 个 SKU 的图片内容、20 条实拍短视频与 10 条 AI 视频', 'Product images for 40 SKUs, 20 short videos and 10 AI videos'), B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure optimization within the agreed scope')] },
    ],
    [
      { name: B('全球获客版', 'Global Acquisition'), price: '¥40,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合想再加 3 个月 AI 获客配置与运营的团队。', 'For teams that also want customer acquisition set up and run for three months.'),
        cta: B('了解全球获客版', 'Discuss Global Acquisition'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 5 个核心页面与 80 个 SKU 模板页', 'A website with 5 core pages and 80 SKU template pages'), B('官网与 SKU 文字由系统翻译成 18 种语言', 'Website and SKU text, system-translated into 18 languages'), B('80 个 SKU 的图片内容、50 条实拍短视频与 20 条 AI 视频', 'Product images for 80 SKUs, 50 short videos and 20 AI videos'), B('3 个月 AI 获客配置与运营，附 3 份月报', 'Customer acquisition set up and run for three months, with three monthly reports')] },
      { name: B('企业版', 'Enterprise'), price: B('定制', 'Custom'), unit: 'none', renewal: 'custom',
        desc: B('适合多部门、多公司、多品牌、多账号，审批和系统接入更复杂的企业。', 'For businesses with multiple departments, companies, brands and accounts, plus more complex approvals and system integration.'),
        cta: B('联系企业版团队', 'Talk to STARGO Enterprise'),
        items: [B('大量 AI 员工与复杂审批', 'Large AI workforce and complex approvals'), B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'), B('自定义工作流 · 专属 AI 员工 · 专属前置部署工程师', 'Custom workflows · dedicated AI employees · dedicated FDE'), B('私有化部署', 'Private deployment'), B('SLA', 'SLA')] },
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
  /* ----------------------------------------------- 续费视图里写什么 ---
     DECIDED 2026-09-17 (the owner delegated the call: "make the best choice").

     THE DEFECT. The period switch on the pricing page (tools/blocks/rk-price-
     tiers.*) has a 续费 / Renewal grid, and on it 上线版, 增长版 and 全球获客版
     listed their first-year deliverables — pages, SKU image sets, short and AI
     videos, translations, three months of acquisition operation — under the
     renewal price, as if they were delivered again every year. This file's own
     answer to 「首年之后怎么算？」 (PRICING.faq) says they are not.

     THE RULE. On the renewal grid, a level sold as a first-year package
     (`unit: 'first'`) lists that answer instead of its first-year items, under
     that question, and nothing more: the same three lines on 上线版, 增长版 and
     全球获客版 —
       1. 标准版软件订阅按年续费 / the Standard software subscription follows
          its annual renewal terms;
       2. 域名、托管与持续制作，按续费方案或第三方实际费用另算 / domain, hosting
          and ongoing production follow the renewal proposal or the relevant
          third-party charges;
       3. 首年建站与内容服务包，不等于每年都重复交付同样的内容量 / a first-year
          launch package is not a promise of repeated annual content production.
     (Decided 2026-09-18: nothing beyond the answer's three statements; a
     fourth line about configured AI acquisition operation was removed.) These
     lines are terms, not inclusions, so they carry a neutral marker instead of
     renok's tick. A package's renewal price stays 联系我们. 标准版 (a plain
     annual subscription), 企业版 (定制) and the whole first-year grid keep
     their own items and ticks. The comparison chart below the band is not
     switched by the toggle; it states first-year inclusions and prices
     (「/ 首年」) and stays so.

     `lines`   in order, each listed on every first-year package. Each is
               written out of `from`: fragments that must occur verbatim (a
               raised first letter allowed) in the answer to 「首年之后怎么算？」
               or in the level's own items, and the line is those fragments in
               that order with nothing between them but spaces and punctuation.
               Two neighbouring fragments may not be cut from one source
               sentence around words the line leaves out, so a line cannot quote
               「不等于」 without its 「不」. No word reaches a renewal card that its
               sources do not carry. A line holds `text` and `from` and nothing
               else. rk-price-tiers.mjs asserts all of it. */
  renewalTerms: {
    lines: [
      { text: B('标准版软件订阅按年续费', 'The Standard software subscription renews annually'),
        from: B(['标准版', '软件订阅按年续费'], ['The', 'Standard', 'software subscription renews annually']) },
      { text: B('域名、托管与持续制作，按续费方案或第三方实际费用另算', 'Domain, hosting and ongoing production are billed separately, under the renewal proposal or at actual third-party cost'),
        from: B(['域名、托管与持续制作，按续费方案或第三方实际费用另算'], ['Domain, hosting and ongoing production are billed separately, under the renewal proposal or at actual third-party cost']) },
      { text: B('首年建站与内容服务包，不等于每年都重复交付同样的内容量', 'A first-year launch package is not a promise of repeated annual content production'),
        from: B(['首年建站与内容服务包，不等于每年都重复交付同样的内容量'], ['A first-year launch package is not a promise of repeated annual content production']) },
    ],
  },
  featuredBadge: B('推荐方案', 'Recommended'),
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
      [B('3 个月获客配置与运营', 'Customer acquisition set up and run for three months'), [0, 0, 1]],
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
        { v: B('18 种语言', '18 languages'), from: B('18 种语言', '18 languages') },
        'custom'] },
      { label: B('SKU 图片内容', 'SKU image sets'), key: B('图片内容', 'Product images'), cells: [
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
      B('12 个月网页桌面，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'),
      B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for enterprise knowledge, FAQ and up to 20 SKUs'),
      B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quote and CRM workflows'),
      B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'),
      B('年度标准 AI 额度，配置一次、培训一次', 'Standard annual AI credits, one setup session and one training session'),
      /* 上线版's own line — and so 增长版's and 全球获客版's, up the ladder. This
         is the row the 2026-09-15 decision was made about: it used to tick one
         column and dash four. */
      B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds'),
      /* 增长版's own line, and it continues up to 全球获客版. */
      B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure optimization within the agreed scope'),
      /* 全球获客版's own line. Nothing inherits it: it is the top of the ladder. */
      B('3 个月 AI 获客配置与运营，附 3 份月报', 'Customer acquisition set up and run for three months, with three monthly reports'),
      /* 企业版's own five lines, and its only ticks — it inherits nothing, and
         `customScope` buys it no tick anywhere: it reads 定制 on the six value
         rows above and dashes the four levels' lines it does not state. */
      B('大量 AI 员工与复杂审批', 'Large AI workforce and complex approvals'),
      B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'),
      B('自定义工作流 · 专属 AI 员工 · 专属前置部署工程师', 'Custom workflows · dedicated AI employees · dedicated FDE'),
      B('私有化部署', 'Private deployment'),
      B('SLA', 'SLA'),
    ],
  },
  ctaTitle: B('与其买 AI 工具，<span class="sub-title-text">不如建 AI 产能。</span>', 'Don’t buy AI tools. <span class="sub-title-text">Build AI capacity.</span>'),
  ctaDesc: B('STARGO WORK 的能力目录里，共有 288 个 AI 员工。模型调用、并发、自动任务和第三方服务用量，按方案配置。', 'STARGO WORK’s capability catalog lists 288 AI employees. Model calls, concurrency, automated tasks and third-party usage are configured per plan.'),
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
    [B('288 个 AI 员工是无限使用吗？', 'Are the 288 AI employees unlimited?'), B('不是。288 说的是能力目录的规模。实际可用范围、在跑的任务、并发、额度和第三方服务用量，按签约的配置来定。', 'No. The workforce count describes the capability catalog. Actual access, active workloads, concurrency, credits and third-party usage are set by your contract.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('软件订阅按年续费。域名、托管与持续制作，按续费方案或第三方实际费用另算。首年建站与内容服务包，不等于每年都重复交付同样的内容量。', 'The software subscription renews annually. Domain, hosting and ongoing production are billed separately, under the renewal proposal or at actual third-party cost. A first-year launch package is not a promise of repeated annual content production.')],
    [B('标准版包含什么？', 'What does Standard include?'), B('12 个月网页桌面（最多 5 个标准用户）、企业知识与产品资料首次导入（最多 20 个 SKU）、询盘与 CRM、报价与人工审批、自助线索发现与写入 CRM、年度标准 AI 额度，外加配置一次、培训一次。', 'A 12-month cloud workspace (up to 5 standard users), an initial import of enterprise knowledge and product information (up to 20 SKUs), inquiries and CRM, quotes with human approval, self-service lead discovery with CRM entry, standard annual AI credits, plus one setup session and one training session.')],
    [B('主动获客只在 ¥40,000 的方案里吗？', 'Is customer acquisition only in the ¥40,000 package?'), B('不是。标准版已经包含自助获客：线索发现、公司画像、评分、准备开发信与写入 CRM。全球获客版加的是 3 个月获客配置与运营、3 份月报，外加这一档自带的建站与内容交付。', 'No. Standard already includes self-service acquisition: lead discovery, company profiling, scoring, outreach preparation and CRM entry. Global Acquisition adds customer acquisition set up and run for three months, plus three monthly reports and its own website and content deliverables.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('企业版提供专属环境与私有化部署，适合对数据、系统和合规要求更高的公司。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。邮箱、网盘、CRM、ERP 和业务平台，经你们授权后接入；哪些信息能读、哪些记录能改、哪些操作要审批，逐项跟你们确认。系统迁移在企业版里提供。', 'Yes. Email, drives, CRM, ERP and business platforms connect with your authorization; what can be read, what can be changed and what needs approval is agreed with you item by item. Migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台费用与模型 / API / 第三方服务用量分开计费。各方案额度不同，超出部分按实际用量计费。', 'Platform fees and model / API / third-party usage are billed separately; each plan includes its own credits, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How do training and implementation work?'), B('标准版含一次配置与一次基础培训。企业版配专属前置部署工程师，把你们的实际流程直接反馈到平台。', 'Standard includes one setup session and one basic training session. Enterprise comes with a dedicated FDE who feeds real workflows straight back into the platform.')],
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
  B('关键操作审批', 'approval of key actions'),
  B('操作与审批记录', 'activity and approval records'),
  B('登录凭据集中保管', 'secure central storage of sign-in credentials'),
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
  B('云端网页版', 'browser-based cloud'),
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
    { label: B('(决定)', '(Decisions)'), text: B('关键决定由你们拍板。报价、联系客户、发布内容，哪些要审批、由谁来批，你们自己定；付款、正式申报和专业审阅，始终由有审批权的人把关。', 'Key decisions stay with you. You decide which quotes, customer outreach and published content need approval, and who approves them. Payments, official filings and professional reviews always stay with authorized people.') },
    { label: B('(核对)', '(Results)'), text: B('结果可以核对。谁做了什么、谁批准、结果是否达到要求、失败卡在哪一步，都有记录。已提交不等于已完成，核对过才算数。', 'Results can be checked. Who did what, who approved it, whether the result met the requirement and where a failure stopped are all on record. Submitted is not finished until the result is checked.') },
    { label: B('(连接)', '(Connect)'), text: B('把你们现有的业务接进来。邮箱、客户记录、产品知识、ERP 和网盘，经你们授权，逐项接入同一套业务流程。现有软件不用先换掉，保留、接入还是调整，按你们的情况定。', 'Connect the business you already run. With company authorization, email, customer records, product knowledge, ERP and shared drives join one workflow, one connection at a time. You don’t need to replace your current software first; what to keep, connect or adjust is agreed with you.') },
    { label: B('(经营)', '(Oversight)'), text: B('看经营，不只看 AI 对话。商机、订单、任务、异常、费用和待审批事项，按负责人和期限排好，交到老板手上，要紧的决定先处理。', 'Watch the business, not just AI conversations. Opportunities, orders, tasks, exceptions, costs and pending approvals reach managers by owner and deadline, so the decisions that matter come first.') },
  ],
  /* V6 §8.2 and M15: the owner cockpit, beside the page's first large picture
     (tools/build-site.mjs puts os-cockpit there — work lanes converging on one
     command centre, an AI concept illustration, not a screen). No figures are
     shown because there is no connected data to show; the text says so. */
  introLabel: B('(老板驾驶舱)', '(The owner’s cockpit)'),
  intro: B('管理者要看的不是 AI 忙了多久，而是谁在做什么、钱花在哪里、客户和订单推进到哪一步。驾驶舱把商机进展、交付状态、用量与预算上限、待审批事项、任务负责人、卡点和实际结果放在一起。数据只取自已接入的系统，缺什么就标出来。看得见，管得住，查得清。', 'Managers need more than busy AI: who is doing what, what it costs, and where each customer and order stands. The cockpit brings opportunity progress, delivery status, usage and budget limits, pending approvals, task owners, blockers and actual results together. Figures come only from connected systems; anything missing is shown as missing. Visible, controllable, traceable.'),
  /* V6 §8.4, M16 and V5 F10: the delivery order, one line per step, in the
     slot that used to list deployment options (those are the third stat now). */
  approachLabel: B('(落地顺序)', '(Delivery steps)'),
  approach: [
    B('01 选一条流程：定目标与验收标准。', '01 Choose one workflow: set the goal and acceptance criteria.'),
    B('02 准备企业资料：产品、客户、知识与规则。', '02 Prepare company context: products, customers, knowledge and rules.'),
    B('03 连接授权账号：可读、可改、需审批，逐项说清。', '03 Connect authorized accounts: what may be read, changed or needs approval.'),
    B('04 配置员工与审批：谁来做，谁来批。', '04 Configure roles and approvals: who does the work, who signs off.'),
    B('05 验证实际成果：拿实际业务核对结果。', '05 Validate actual results against real cases.'),
    B('06 再扩大范围：跑通一条，再定下一条。', '06 Expand the scope: prove one workflow, then choose the next.'),
  ],
  approachButton: { label: B('联系 STARGO 前置部署团队', 'Talk to a STARGO FDE'), href: 'contact.html' },
  statsLabel: B('(数字口径)', '(What the numbers count)'),
  stats: [
    /* stats[0] is also read by tools/blocks/cn-price-card.mjs: the value must
       stay a bare figure, and the text is split at its FIRST comma — the noun
       goes beside the figure, the rest becomes a line of its own there. */
    { value: '288', text: B('个 AI 员工，可按任务组队协作，在企业设定的权限与预算内工作。', 'AI employees that team up by task, working within the permissions and budgets the company sets.') },
    { value: String(ENT_CONTROLS.length), items: ENT_CONTROLS, text: B(`项管理控制：${ENT_CONTROLS.map((x) => x.zh).join('、')}。`, `management controls: ${enList(ENT_CONTROLS.map((x) => x.en))}.`) },
    { value: String(ENT_DEPLOYMENT.length), items: ENT_DEPLOYMENT, text: B(`种部署方式：${ENT_DEPLOYMENT.map((x) => x.zh).join('、')}，按你们的需求逐项确认；服务等级在企业版里按项目单独约定。`, `deployment options: ${enList(ENT_DEPLOYMENT.map((x) => x.en), 'or')}, confirmed with each company. Service levels are agreed per project on the Enterprise plan.`) },
  ],
  /* The pull-quote is M15's value line. P05's headline is the h1 now, so the
     card no longer repeats it. */
  quoteLabel: B('(原则)', '(The principle)'),
  quote: { text: B('「真正要紧的，是可管理、可停止、可追踪、可验证的工作，而不是 AI 在对话里说一句“已经完成”。」', '“What matters is work you can manage, stop, trace and verify — not an AI message claiming it is done.”'), who: B('STARGO WORK', 'STARGO WORK'), where: B('决定权始终在人', 'People stay in command') },
  /* V5 P05's five management components. V6 §8.3 names usage and budgets and
     pausing with human takeover for these places too; they are carried in the
     first and fourth role lines rather than by dropping account connection. */
  cardsTitle: B('五个管理模块', 'Five management components'),
  cards: [
    { name: B('能力与应用管理', 'Capability & app management'), role: B('(企业开通了什么、哪些工作可做、哪些仍需配置，用量与预算上限多少)', '(Enabled applications, available work, missing setup, usage and budget limits)') },
    { name: B('账号与岗位权限', 'Account & role permissions'), role: B('(明确谁可以查看资料，谁可以修改记录)', '(Who may read information, and who may change records)') },
    { name: B('关键操作审批', 'Approval of key actions'), role: B('(报价、对外联系和重要承诺，由审批人批准)', '(Quotes, outreach and important commitments go to approvers)') },
    { name: B('工作与结果记录', 'Work & result records'), role: B('(做过什么、谁批准、实际结果是否符合要求；出错即停，可转人工)', '(Actions, approvals and whether actual outcomes meet the requirement; failures stop and pass to a person)') },
    { name: B('账号连接与保护', 'Linked accounts & protection'), role: B('(经你们授权连接业务账号，用不到的岗位不给访问权限)', '(Business accounts connected through authorization, with no access for roles that do not need it)') },
  ],
  /* Beside the components: what is available and where the line stays
     (V5 P05 availability, M16-01, F13, F14). The origin story this slot used
     to carry is the About page's (ABOUT.story), unchanged there. */
  noteLabel: B('(范围与边界)', '(Scope and boundaries)'),
  note: B('平台自带管理与控制功能；看板指标、自动操作、跨系统操作和高级分析，都用你们已接入的数据。能打开应用只是第一步，整条流程按验收标准跑通才算数。部署方式、服务范围和数据要求，由双方商定。付款、正式申报、合同与合规审阅，始终由你们有审批权的人或相关机构决定。', 'Management and control come with the platform; dashboard figures, automated and cross-system actions and advanced analytics run on your connected data. Opening an application is only the first step; a workflow counts once it passes its acceptance criteria. Deployment, service scope and data requirements are agreed by both sides. Payments, official filings, contract and compliance reviews stay with authorized people or the relevant institutions.'),
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
      [B('客户与沟通', 'Customers & messages'), B('邮箱、即时通讯、贸易平台询盘与 CRM 客户记录', 'Email, messaging, marketplace inquiries and CRM records'), B('可以读取哪些对话，谁能代表企业回复', 'Which conversations may be read, and who may reply for the company')],
      [B('产品与知识', 'Products & knowledge'), B('产品资料、规格、图片、价格依据与企业文档', 'Product data, specifications, images, price sources and company documents'), B('哪些资料已经审核，可用于回答与报价', 'Which sources are approved for answers and quotes')],
      [B('ERP 与商城', 'ERP & commerce'), B('产品物料、采购库存、生产质检、订单与商城业务', 'Products, materials, purchasing, stock, production, quality, orders and online store'), B('可读取的记录、可修改的字段、需要审批的变更', 'Readable records, permitted changes and changes that need approval')],
      [B('办公与文件', 'Office & files'), B('网盘、表格、文档与共享文件夹', 'Drives, spreadsheets, documents and shared folders'), B('可以访问哪些文件夹，成果存放在哪里', 'Which folders may be opened, and where outputs are saved')],
      [B('财务、物流及其他业务服务', 'Finance, logistics & other services'), B('收付款、物流、签章与第三方数据', 'Payments, logistics, signatures and third-party data'), B('授权范围、系统对接方式；付款和正式申报由有审批权的人把关', 'Authorization scope and how systems connect; payments and official filings stay with approvers')],
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
   the capability page's blocks look an entry up by (CAPABILITY_SHOWCASE picks,
   CAP_V6A rows, tools/blocks/qx-news.mjs PICKS): rename one only together with
   those. Since V7 the names are business language in both languages — no
   platform brands and no internal module names (Quote Studio, Audit Ledger …);
   a trade channel the site names elsewhere (WhatsApp, Alibaba.com / 阿里国际站)
   may stay, and the English name says what the Chinese one says. */
const I = (name, zhName, zh, en) => [name, B(zh ?? '', en ?? zh ?? ''), zhName ?? name];
export const CAPABILITY_GROUPS = [
  G('01', 'Workspace & Business Overview', '工作台与经营总览', [I('Boss Cockpit', '企业经营总览', '公司现在在做什么，一屏看完', 'What the business is doing right now, on one screen'), I('Command Center', '企业 AI 指挥中心', '目标交下去，盯着它走完', 'Hand a goal down and watch it carried out'), I('Cloud Workspace', '云端企业工作桌面', '人和 AI 员工共用的网页桌面', 'The browser desktop your team and its AI employees share'), I('Mission Control', 'AI 员工与长任务运行中心', '盯住长时间运行的工作，需要时插手', 'Watch long-running work and step in when needed'), I('Execution View', '任务执行过程', 'AI 员工做过什么，逐步回放', 'Replay what an AI employee did, step by step'), I('System Map', '系统关系图', '业务记录与各系统之间如何关联', 'How business records and systems connect to each other'), I('App Library', '企业 AI 应用库', '企业为各团队开通的内部应用', 'The internal apps a company turns on for its teams'), I('Multi-window Desktop', '多窗口 AI 工作空间', '几件事同时开着，各自不丢进度', 'Several tasks open at once, without losing your place'), I('Mobile Companion', '移动办公与任务管理', '离开工位，用手机也能跟进度、处理审批', 'Follow progress and handle approvals on your phone, away from the desk'), I('Notification Center', '企业通知', '什么变了，什么在等你', 'What changed, and what is waiting on you'), I('Approval Center', '审批中心', '所有待决事项排在同一个队列里', 'Every pending decision in one queue'), I('Voice Console', '语音指挥 AI', '开口说一句，就能提需求、建任务', 'Make a request or create a task just by speaking')]),
  G('02', 'Customer Acquisition & Opportunity Research', '主动获客与商机判断', [I('STARGO Growth OS', 'Growth OS 主动获客', '从市场信号里找客户，确认后交给 Sales Desk', 'From market signals to approved prospects handed to Sales Desk'), I('Trade Signal Accounts', '贸易信号与商机线索', '把看到的贸易动向，变成能跟进的客户', 'Turns observed trade activity into workable accounts'), I('Importer Reorder Radar', '进口商补货雷达', '判断哪些进口商快到补货周期', 'Estimates which importers may be due to reorder'), I('Competitor Customer Graph', '竞争对手客户图谱', '从现有贸易记录里，看谁在向同类供应商采购', 'Uses available trade records to see who buys from comparable suppliers'), I('Buying Committee Intelligence', '决策链识别', '谁拍板、谁影响、谁签字', 'Who decides, who influences and who signs'), I('Dealer Opportunity Discovery', '经销商机会发现', '找出产品线正缺你这一块的经销商', 'Finds distributors whose range has a gap you fill'), I('Map-Based Dealer Discovery', '地图经销商发现', '按区域找经销商与分销商', 'Finds distributors and resellers by territory'), I('Opportunity Decisions', '机会决策', '建议跟进、搁置还是放弃，并给出理由', 'Recommends whether to pursue, park or drop, and why'), I('Dealer Opportunity Brief', '经销商机会简报', '为何接触这家经销商，一页说清', 'A one-page case for approaching a distributor'), I('Outreach Playbooks', '销售打法生成', '针对这个客户和市场定打法', 'Builds the approach for this account and market'), I('Six-Factor Opportunity Scoring', '六因子机会评分', '按产品、市场、采购信号、联系人、风险与价值六项排序', 'Ranks accounts on product fit, market fit, buying signals, contacts, risk and value'), I('Account Research', '客户研究', '做客户背调，资料注明出处', 'Collects company evidence and cites where it came from'), I('Trade Intelligence', '贸易情报', '从现有贸易记录读出需求与走向', 'Reads available trade records for demand and direction'), I('Website AI Sales Engineer', '官网 AI 销售工程师', '官网上回答产品问题，同时留住线索', 'Answers product questions on your site and captures the lead'), I('Dormant Lead Reactivation', '沉睡客户再激活', '给沉睡客户一个重新开口的理由', 'Brings quiet accounts back with a reason to talk'), I('Trade Show Afterburner', '展会线索持续转化', '一叠名片，排成有日期的跟进计划', 'Turns a stack of business cards into scheduled follow-up'), I('CRM Automatic Lead Creation', '确认客户写入 CRM', '确认后的客户写入 CRM 并指定负责人，避免重复建档', 'Records the approved account in CRM with an owner, without duplicates'), I('Attribution & Growth Analytics', '结果归因与增长分析', '看清哪些做法带来了询盘和订单，还能做高级分析', 'Which actions led to inquiries and orders, with advanced analytics')]),
  G('03', 'Market Channels & Account Discovery', '市场渠道与客户发现', [I('Community Demand Scouting', '社区需求侦察', '买家在社区提问时，能找到你', 'Be found in the communities where buyers ask questions'), I('AI Search Visibility', 'AI 搜索时代的可见性', 'AI 搜索时代，内容能被搜到、被引用', 'Content that search engines and AI answers can find and cite'), I('Decision-Maker Outreach', '企业决策人触达', '经你授权，在职业社交平台上联系决策人', 'Reaches decision-makers on professional networks, with authorization'), I('Social Demand Signals', '社交需求信号', '看社交平台上你所在品类的需求动向', 'Reads social demand signals in your categories'), I('Alibaba.com Inquiry Intake', '阿里国际站询盘接入', '询盘落到同一条客户时间线', 'Inquiries land on the customer record'), I('Video Channel Signals', '视频渠道信号', '买家在搜什么、看什么', 'Tracks what buyers search and watch in your category'), I('WhatsApp Sales', '即时沟通销售', '很多海外买家都在用的聊天工具，经你授权接入', 'The messaging channel many overseas buyers use, connected with authorization'), I('Email B2B', '邮件开发与跟进', '发开发信，持续跟进', 'Email outreach and follow-up'), I('Marketplace Connections', '电商平台接入', '平台商品与消息，汇入同一条客户记录', 'Connects marketplace listings and messages to one customer record'), I('New Channel Connections', '新渠道接入', '新渠道接入同一套客户与销售流程', 'New channels join the same customer and sales workflow')]),
  G('04', 'Inquiries & Customer Conversations', '询盘与多渠道沟通', [I('Unified Inbox', '统一收件箱', '各渠道消息进同一个队列，每条都标明客户', 'Every channel lands in one queue with the customer attached'), I('Email Inquiry Processing', '邮件询盘处理', '读来信，直接打开对应客户记录', 'Reads an inbound email and opens the right customer record'), I('Alibaba.com Inquiry Handling', '阿里国际站询盘处理', '和其他渠道的询盘按同一套流程处理', 'Handled in the same steps as inquiries from other channels'), I('Website Conversation', '官网会话', '官网上的对话，转成有效询盘', 'Turns a site chat into a qualified inquiry'), I('Conversation Center', '会话中心', '跨渠道的对话集中在一处', 'Conversations from every channel, in one place'), I('Inquiry Intent Detection', '询盘意图识别', '分清真实采购需求和无效咨询', 'Separates a real buying request from noise'), I('Spam / Scam Detection', '垃圾与诈骗识别', '假询盘挡在销售队列之外', 'Keeps fake inquiries out of the sales queue'), I('Buyer Requirement Extraction', '买方需求提取', '从买家的原话里提取产品、参数、数量与条款', 'Pulls product, spec, quantity and terms out of free text'), I('Company Background Research', '公司背景研究', '回复之前，先核实对方是谁', 'Checks who is asking before you answer'), I('Customer Risk Signals', '客户风险信号', '付款、合规、可信度的疑点，尽早标出', 'Flags payment, compliance and credibility concerns early'), I('Product Matching', '产品匹配', '按买家需求，匹配已审核的产品', 'Matches the stated requirement to approved products'), I('Knowledge-Grounded Reply', '基于企业知识的回复', '依据企业已审核资料起草答复', 'Drafts the answer from approved company sources'), I('Multilingual Reply', '多语言回复', '用买家的语言回复，依据同一份资料', 'Replies in the buyer’s language from the same source material'), I('Human Approval & Escalation', '人工审批与升级', '敏感承诺交给有权限的人', 'Sensitive commitments go to the person allowed to decide'), I('Planned Follow-up', '计划内跟进', '客户没回音时，按批准的计划准备下一次跟进', 'When a buyer goes quiet, prepares the next follow-up within the approved plan'), I('Customer Timeline', '客户时间线', '说过什么、发过什么，按时间排成一条', 'One chronological record of everything said and sent')]),
  G('05', 'CRM & Customer Context', 'CRM 与客户全景', [I('Customer CRM', '客户与商机记录', '客户、商机与负责人的那本账', 'The record of customers, opportunities and owners'), I('Account Overview', '客户全景', '这个客户的已知信息，一屏看全', 'Everything known about the account on one screen'), I('Customer Workspace', '客户工作间', '每个客户一个工作区，人与 AI 员工共用', 'A shared workspace per customer for people and AI employees'), I('Contact & Opportunity Management', '联系人与商机管理', '联系人、商机和各自进展', 'Contacts, opportunities and where each one stands'), I('Lead Scoring', '线索评分', '把值得打电话的客户排到最前面', 'Puts the accounts worth calling at the top of the list'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', '问过什么、报过什么价、实际买了什么', 'What they asked for, were quoted and actually bought'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', '下一步做什么、哪天做、谁来做', 'The next touch, its date and who owes it'), I('Decision-Maker Mapping', '决策人映射', '记下谁决策、谁影响、谁签字', 'Records who decides, who influences and who signs'), I('Customer Evidence', '客户证据', '每条判断都留出处', 'Keeps the source behind every claim on the record'), I('CRM Automation', 'CRM 记录维护', '负责人、阶段与下一步按规则更新，少一些手工录入', 'Updates owners, stages and next actions by rule, with less manual entry')]),
  G('06', 'Products & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', '企业已审核的答案，集中在一处', 'Approved company answers, in one place'), I('Knowledge Center', '知识中心', '已审核的企业答案，在这里保持最新', 'Where approved company answers are kept current'), I('Knowledge Intake', '资料导入', '把文档和文件整理成可引用的知识', 'Turns documents and files into knowledge AI can cite'), I('Knowledge Retrieval', '知识检索', '找出能回答这个问题的那一段', 'Finds the passage that answers the question'), I('Source Retrieval', '原文检索', '调出答案所依据的原文', 'Retrieves the passage an answer is based on'), I('Drive & Document Access', '网盘与文档接入', '直接读团队现有文档，不用先迁移', 'Reads existing team documents without a migration'), I('Product Intelligence', '产品智能', '规格、选配和限制条件，AI 能据此判断', 'Specifications, options and constraints AI can reason over'), I('Product Center & Library', '产品中心与产品库', '整条流程共用的同一份产品记录', 'One product record the whole workflow reads'), I('Specifications & Images', '产品参数与图片', '买家会追问的那些技术细节', 'The technical detail a buyer asks for'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', '公司以前定过、现在仍然算数的规矩', 'Rules the company set in the past that still apply'), I('Evidence Retrieval', '证据检索', '给出答案，附上依据的文档', 'Returns the supporting document with the answer'), I('Source-Grounded Answers', '有据可查的回答', '缺少审核过的来源时明确提示，不编造答案', 'Flags the gap instead of answering without an approved source')]),
  G('07', 'Quotations, PI & Commercial Records', '报价、PI 与商业文件', [I('Quotation Center', '报价中心', '报价从询盘开始，不从空表格开始', 'Builds the quote from the inquiry, not a blank sheet'), I('Inquiry → Quote', '询盘到报价', '需求直接变成带价格的报价草稿', 'Carries the request straight into a priced draft'), I('Product Configuration & Quantity', '产品配置与数量计算', '报的到底是什么，数量多少', 'What exactly is being priced, and how many'), I('Commercial Terms', '贸易条件', '套用约定的付款、交期与质保条款', 'Applies the agreed payment, delivery and warranty terms'), I('Pricing Rules', '价格规则', '按你配置的规则定价，不靠猜', 'Prices from your configured rules, not from guesswork'), I('Margin Guardrails', '利润护栏', '报价低于利润底线，没人批就过不了', 'Stops a quote below the margin floor unless someone approves it'), I('Historical Price Context', '历史价格参考', '这个买家、这个市场，以前成交价多少', 'Shows what this buyer and market paid before'), I('Approval Workflow', '审批流程', '例外转给有权拍板的人', 'Routes the exception to the person allowed to decide'), I('Quote Versioning', '报价版本', '每一版都留存，改动也留痕', 'Keeps every version and what changed between them'), I('PI Center', '形式发票中心', '批准的报价转成 PI，发给客户前再确认', 'Turns the approved quote into a proforma invoice; sending is a separate step')]),
  G('08', 'ERP, Orders & Fulfillment', 'ERP、订单与履约', [I('Order Management', '订单管理', '从批准的报价一路跟到交付', 'Tracks the order from approved quote to delivery'), I('Trade Fulfillment Follow-up', '外贸履约跟进', '批准的商务条件，带进履约环节', 'Carries approved commercial detail into fulfillment'), I('Payment Milestones', '付款节点', '订金、尾款，还有哪笔没到账', 'Tracks deposits, balances and what is still outstanding'), I('Production Status & QC', '生产进度与质检', '生产到哪一步，质检过没过', 'Where production stands, and whether QC passed'), I('Packaging & Shipment', '包装与出货', '怎么装运，随货走哪些东西', 'How it ships, and what travels with it'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', '按批准的订单数据生成，待人复核', 'Prepared from approved order data, ready for review'), I('Certificate of Origin · Form E', '原产地证 · Form E', '备好申请材料，证书由主管机构签发', 'Prepares the application; the certificate is issued by the authority'), I('Bill of Lading Workflow', '提单流程', '运输单据跟着货走', 'Keeps shipping documents moving with the shipment'), I('Certification & Battery Documentation', '认证与电池资料', '认证与电池相关材料按目的国备齐', 'Certification and battery files prepared for the destination market'), I('Export Documentation & Workflow', '出口单证与流程', '出口单证从准备到复核，全程跟进', 'Export documents, from preparation to review'), I('Export Tax Rebate', '六阶段出口退税流程', '按六个阶段整理退税资料、跟踪进度；正式申报和受理，仍走主管部门流程', 'Tracks rebate preparation through six stages; filing and acceptance stay with the authorities'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', '整车、半散件、全散件的装运资料分别整理', 'Keeps built-up, semi-knocked-down and completely knocked-down shipments documented separately')]),
  G('09', 'AI Images, Video & Marketing', 'AI 图片、视频与营销', [I('AI Creative Studio', 'AI 创意工作室', '按你们自己的产品资料，准备产品页要用的图片和销售素材', 'Organizes the images and sales material a product page needs, from real product facts'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', '为你的目标销售站点写产品与市场文案', 'Product and market copy for the sites you sell on'), I('Search & AI-search Content', '搜索优化 · AI 搜索可信内容', '内容结构化，既能被搜到，也能被引用', 'Content structured to be found and to be quoted'), I('Multi-language Content', '多语言内容', '同一个产品故事，覆盖目标市场', 'The same product story across your target markets'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', '同一个产品故事，贯穿页面、方案与社媒', 'One product story across page, deck and feed'), I('AI Image & Video Workflow', 'AI 图片与视频流程', '按可复用的流程产出产品图片与营销视频', 'Product visuals and marketing videos produced to a repeatable workflow'), I('Viral Structure Adaptation', '爆款结构再创作', '借鉴爆款视频的结构，为你的产品做原创改编', 'Adapts a proven video structure into original work for your product'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', '拆解爆款视频的开场、节奏与话术', 'Breaks down a proven video’s hook, pacing and messaging'), I('Short-form Clip Editing', '剪辑与短视频', '把产品素材剪成适合社媒发布的短视频', 'Cuts product footage into short clips ready for social media')]),
  G('10', 'AI Workforce & Teamwork', '数字员工与团队协作', [I('288 Specialized AI Employees', '288 个专业 AI 员工', '按职能分好的岗位目录，按任务挑人', 'A role directory by function, with roles chosen per task'), I('AI Employee Roster', 'AI 员工名册', '谁在岗，各自负责什么', 'Who is available, and what each one is for'), I('Workforce Panel', '员工面板', '派活、看进度、复核交回来的结果', 'Assign work, watch progress, review what came back'), I('AI Teams & Collaboration', '动态组队与多 AI 员工协作', '一个目标，几个专业岗位分工协作，而不是一次问答', 'Several specialists on one goal, not a single chat reply'), I('AI Employee Communication', 'AI 员工间交流', 'AI 员工之间直接发消息、提问、交接，少让人来回传话', 'AI employees message each other, ask questions and hand over work, with less relaying by people'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', '每个员工做什么、懂什么、能用什么、记得什么', 'What an employee does, knows, may use and remembers'), I('Shared Enterprise Context', '共享企业上下文', '同一份业务资料，按各自权限使用', 'One set of business facts, used within each role’s permissions'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', '任务拆开、在岗位间流转、并行推进', 'Work splits, moves between roles and runs in parallel'), I('Scheduled Work', '定时工作', '按时跑的例行研究与跟进', 'Recurring research and follow-up that runs on time'), I('Evidence & Human Approval', '执行证据与人工审批', '审批人拍板前看的那份记录', 'The record an approver reads before deciding')]),
  G('11', 'Automation & Everyday Work', '自动化与日常办公', [I('AI Employee Setup', 'AI 员工工作环境', '为每个 AI 员工配好工具、划定边界', 'Where an AI employee gets its tools and limits'), I('Workflow Automation', '工作流自动化', '跨应用把步骤连起来，不用写代码', 'Connects steps across apps without custom code'), I('Scheduled Data Jobs', '数据整理与定期作业', '整理流程要用的数据，按时跑例行任务', 'Runs the data preparation and routine jobs a workflow needs'), I('Long-Horizon Control', '长任务控制', '长时间任务保留目标与进度，可暂停、恢复和接力', 'Keeps long-running work on its goal, with pause, resume and handoff'), I('Browser Automation', '浏览器自动化', '在授权范围内操作网页工具，不绕过登录与安全验证', 'Works web tools within authorization, without bypassing sign-in or security checks'), I('Screen Operation', '界面操作', '无法对接时，在授权环境中操作界面', 'Operates an interface in an authorized environment when integration is not available'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', '按时间跑，或在业务状态变化时跑', 'Runs on a clock, or when the business state changes'), I('Approved Actions & Tool Connections', '授权动作与工具连接', 'AI 员工获准使用的业务操作与工具', 'The business actions and tools an AI employee is allowed to use'), I('External Connectors', '外部系统连接', '对接团队已在用的系统', 'Reaches the systems your team already runs'), I('Sign-in Safekeeping', '登录凭据保管', '账号密码统一保管，不交给 AI 员工直接查看', 'Holds the logins so AI employees never see them directly')]),
  G('12', 'Business Relationships & Context', '企业业务关系与上下文', [I('Business Relationship Map', '企业业务关系图', '客户、报价、订单和负责人一一对上，AI 照此推进工作', 'Links customers, quotes, orders and owners so AI works from the same picture'), I('Cross-system Identity', '跨系统身份', '同一个客户，在各个系统里都对得上', 'The same customer across every connected system'), I('Customer, Product, Inquiry & Opportunity Records', '客户 · 产品 · 询盘 · 商机记录', '商务端的业务记录', 'The commercial side of the business, as records'), I('Quote, Order, Document & Task Records', '报价 · 订单 · 文件 · 任务记录', '执行端的记录，同样挂在这个客户名下', 'The execution side, linked back to the customer'), I('AI Employee & Market Signal Records', 'AI 员工 · 市场信号记录', '谁做的，由什么触发', 'Who did the work, and what prompted it'), I('Relationships, Permitted Actions & Business Rules', '业务关系 · 可做的动作 · 业务规则', '记录之间如何关联，允许做哪些操作', 'How your records connect and what may be done to them'), I('Enterprise Context', '企业上下文', 'AI 员工动手前先了解的公司现状', 'The company state an AI employee reads before acting'), I('Operational Records', '经营记录', '经营记录保存在哪里，以哪一份为准', 'Where operating records are kept, and which copy is authoritative')]),
  G('13', 'Permissions, Approvals & Control', '权限、审批与经营控制', [I('Human-in-the-Loop', '人在回路', '明确哪些决定仍须由人来做', 'Names the decisions a person must still make'), I('Key Action Approval', '关键操作审批', '待决事项集中一处，等负责人拍板', 'One place where pending decisions wait for their owner'), I('Capability & App Management', '能力与应用管理', 'AI 员工能调用什么，以谁的名义', 'What AI employees are allowed to use, and on whose behalf'), I('Permission Control · Identity', '权限控制 · 身份', '谁能看什么、能做什么', 'Who can see what, and who can do what'), I('Identity Check', '身份校验', 'AI 员工动手之前，先验身份', 'Checks identity before any AI employee acts'), I('Activity Records · AI Employee Evidence · Action History', '操作记录 · AI 员工证据 · 动作历史', '做了什么、哪个 AI 员工做的、凭谁的授权', 'What was done, by which AI employee, on whose authority'), I('Guardrails', '护栏', 'AI 员工自己越不过的边界', 'Boundaries an AI employee cannot cross on its own'), I('Company Data Separation', '企业数据隔离', '按公司和品牌分开的数据边界', 'Separate data boundaries per company and brand'), I('Failure Handling · Rollback', '失败处理 · 回滚', '出错时停下来、退回去', 'Stops on an error and puts things back'), I('Work Visibility', '执行可见', 'AI 员工正在做什么，看得见', 'See what AI employees are doing while they do it')]),
  G('14', 'Retained Experience & Improvement', '长期经验与持续改进', [I('Improvement Review', '改进复核台', '改进建议在这里复核、发布', 'Where proposed improvements are reviewed and released'), I('Work Observation', '执行观察', '观察真实执行，记录发生了什么', 'Watches real execution and records what happened'), I('Outcome Review', '结果复盘', '把记下的结果整理成改进建议', 'Turns recorded outcomes into proposed improvements'), I('Skill Refinement', '技能优化', '按实测结果改进一项技能', 'Improves a skill against measured results'), I('Pre-release Testing', '发布前测试', '发布前先测试，再专门找它的漏洞', 'Tests a change, and looks for its weak points, before release'), I('Change Approval', '改进审批', '未经评测和批准，改动发不出去', 'No change ships without evaluation and approval'), I('Attempts · Outcomes · Scores', '过程 · 结果 · 评分', '试了什么、结果如何、评分多少', 'What was attempted, what resulted, how it scored'), I('Skill Library · Trials', '技能库 · 试验', '待上线的技能在这里存放、试用', 'Where a proposed skill is kept and tried out'), I('Side-by-side Trials · Staged Release · Rollback', '新旧对比 · 小范围试用 · 回退', '先在小范围试，留下或回滚', 'Try a change on a small scale, then keep it or roll it back'), I('Continuous Improvement', '持续改进', '执行结果经过复核，再用来改进下一次', 'Reviewed results feed into the next run')]),
];

export const CAPABILITIES = {
  /* h1 / caption / intro are substituted into Mono's inner hero, which the page
     builder then replaces with renok's hero (CAPABILITY_SHOWCASE.hero*); they
     stay in step with it (V5 P02) so nothing stale lingers in the source. */
  h1: B('能力', 'Capabilities'),
  caption: B('(从找客户，到把企业工作串起来)', '(From finding customers to connected enterprise work)'),
  intro: B('先看 Growth OS 主动获客和 Sales Desk 外贸销售，再看 ERP、商城、财务履约、图片视频、数字员工和企业智能。每个模块都写清做什么、产出什么，需要哪些配置、哪些环节要人批准。', 'Start with Growth OS and Sales Desk, then explore ERP, commerce, finance and fulfillment, creative work, AI teams and enterprise intelligence. Each module explains the work, the outputs and the configuration or approvals required.'),
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
  macroTitle: B('四个板块，十四类能力', 'Four areas, fourteen capability groups'),
  macroLede: B('点开一个板块，直接跳到对应的能力组。', 'Open an area to jump straight to the capability groups inside it.'),
  /* The four entries and their one-line descriptions (V5 P02). `groups[0]` is
     where the card links; tools/verify-release.mjs checks each card's picture
     by that link, so the grouping stays as it was. `desc` is printed inside the
     card's glass panel under the group count (tools/build-site.mjs). */
  macro: [
    { name: B('指挥与增长', 'Workspace & growth'), groups: ['01', '02', '03'],
      desc: B('在一个工作台上找客户、判断商机、安排开发任务。', 'Discover accounts, qualify opportunities and organize prospecting from one workspace.') },
    { name: B('客户与知识', 'Customers &\u00a0knowledge'), groups: ['04', '05', '06'],
      desc: B('询盘、客户记录和企业资料打通，回复时前因后果都清楚。', 'Connect inquiries, customer records and enterprise knowledge for context-aware replies.') },
    { name: B('商务、履约与创作', 'Commercial, delivery & creative'), groups: ['07', '08', '09'],
      desc: B('从报价、PI 一路接到 ERP、交付和回款，再加上 AI 图片与营销视频。', 'Extend quotes and PIs into operations, delivery, collections, AI images and marketing videos.') },
    { name: B('员工与管理', 'Workforce &\u00a0management'), groups: ['10', '11', '12', '13', '14'],
      desc: B('挑选 AI 员工、安排分工，管好业务背景、权限和任务，并持续改进。', 'Choose AI employees, coordinate their work and manage business context, permissions, tasks and continuous improvement.') },
  ],
  unit: B('组', 'groups'),
  cardButton: B('查看能力全景', 'Explore capabilities'),
  table: { caption: B('(按能力组)', '(By capability group)'), title: B('能力图谱', 'Capability map'), headers: [B('(能力组)', '(Group)'), B('(能力)', '(Capability)'), B('(说明)', '(What it is)')], button: { label: B('认识数字员工', 'Meet the AI workforce'), href: 'workforce.html' } },
  /* The closing Mono section: start with one workflow (V5 F10), then widen. */
  ladderCaption: B('(从一条流程开始)', '(Start with one workflow)'),
  // Scalora stacks these three on one absolutely-positioned line and swaps them.
  // The slot is one line tall (120px), so each language has to fit on one line:
  // at 1440 that is 800px at 96px type, roughly sixteen characters.
  ladder: [B('选一条流程。', 'One workflow.'), B('验证成果。', 'Prove results.'), B('再扩大范围。', 'Then expand.')],
  ladderDesc: B('不必第一天就改造全部部门。先选一条最重要的业务流程，准备资料与规则、连接授权账号、安排数字员工与审批，拿实际业务验证效果，跑通后再扩大范围。', 'You don’t need to change every department on day one. Choose one priority workflow, prepare its context and rules, connect authorized accounts, assign AI roles and approvals, validate with real cases, then expand.'),
  card1: { name: B('第一条流程', 'The first workflow'), desc: B('对效率或增长影响最大的那一条：主动获客、询盘跟进、报价、订单交付或营销内容。', 'The one that most affects efficiency or growth: prospecting, inquiry follow-up, quoting, order delivery or marketing content.'), big: '1', unit: B('(条流程)', '(workflow)'),
    items: [B('选定一条业务流程', 'Choose one business workflow'), B('准备产品、客户、知识与规则', 'Prepare product, customer, knowledge and rules'), B('连接授权账号', 'Connect authorized accounts'), B('安排数字员工与审批', 'Assign AI roles and approvals'), B('拿实际业务验证效果', 'Validate with real cases')],
    tlLabel: B('从哪开始：', 'Start with:'), tl: B('一条流程', 'one workflow'), button: { label: B('预约企业演示', 'Request a Demo'), href: 'contact.html' } },
  /* The second card is where the first workflow leads, not a claim about the
     company today. 288 is the size of the role directory — the unit and the
     fourth bullet say so — whose roles team up by task. */
  card2: { name: B('逐步扩展到全公司', 'Across the company, in phases'), desc: B('第一条流程跑通后，再把更多业务板块和 AI 员工用起来。', 'Once the first workflow proves useful, roll the same approach out to more business areas and AI employees.'), big: '288', unit: B('(个 AI 员工)', '(AI employees)'),
    items: [B('Growth OS 与 Sales Desk 两大引擎', 'Growth OS and Sales Desk, the two engines'), B('ERP、履约与 AI 创作', 'ERP, fulfillment and AI creative work'), B('企业知识与业务关系共享', 'Shared company knowledge and context'), B('288 个岗位，按任务组队协作', '288 roles that team up by task'), B('关键决定由审批人拍板', 'Key decisions need an approver’s sign-off')],
    tlLabel: B('下一步：', 'Next:'), tl: B('看定价', 'see pricing'), button: { label: B('看定价', 'See pricing'), href: 'pricing.html' } },
  faqCaption: B('(常见问题)', '(FAQ)'),
  /* Four slots, four V5 questions that belong on the capability page: how it
     differs from a chat window (F12), the systems a company already has (F11),
     what is available now (F13) and where to start (F10). */
  faq: [
    [B('它和单独使用一个 AI 聊天窗口有什么区别？', 'How is this different from using a standalone AI chat?'), B('关键看任务有没有接上企业资料、客户历史和业务应用，有没有负责人、审批和结果，聊天只是形式。STARGO WORK 按完整业务流程把这些串起来，答完一段话不等于事情办完。', 'What matters is whether the work connects to enterprise information, customer history and business applications, with an owner, approvals and a result. STARGO WORK organizes all of this around the full business workflow; a text answer alone does not count as finished work.')],
    [B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Must we replace our current CRM, ERP, email and drives?'), B('不必先假定全部替换。STARGO WORK 的方向是把现有业务账号和资料连接到同一工作空间。具体保留、接入或调整哪些系统，需要结合企业当前软件和权限逐项确认。', 'A complete replacement should not be assumed. STARGO WORK aims to connect existing accounts and information in one workspace. Which systems are retained, integrated or adjusted depends on the enterprise’s software and access permissions.')],
    [B('所有渠道和功能现在都能直接用吗？', 'Is every channel and feature immediately available?'), B('都已上线。接入你们自己的账号和业务数据后，就能直接用。演示和交付时，我们按你的流程逐项验收，不拿“页面能打开”当作整条流程跑通。', 'Yes. Every channel and feature is live, and works as soon as your own accounts and business data are connected. In demos and at delivery we check each step against your workflow; a page that opens does not count as a working process.')],
    [B('企业应该从哪里开始？', 'Where should an enterprise start?'), B('先选一条最重要的业务流程，准备产品、客户、知识和规则，连接授权账号，安排数字员工与审批，再拿实际业务验证效果。跑通后再扩大范围，不必第一天就改造全部部门。', 'Choose one priority workflow. Prepare product, customer, knowledge and policy context, connect authorized accounts, assign roles and approvals, then validate it with real cases. Expand after that first workflow is proven useful.')],
  ],
  moreLabel: B('(想看它跑起来？)', '(Want to see it running?)'),
  more: B('演示按你的业务流程走，每个环节当场打开给你看；需要接入你们的账号和业务数据的地方，逐项讲清怎么接。', 'The demo follows your workflow and opens each step live; where your own accounts or business data need connecting, we walk you through each one.'),
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
  h1: B('你最想先改善哪一条流程？', 'Which workflow do you want to improve first?'),
  quote: B('「说说你的行业、产品和目标市场，还有现在最费时间、最容易掉链子的环节。我们拿一个具体场景，一起理清要准备的资料、账号、岗位和审批，再定好怎么验收结果。」', '“Tell us about your industry, products, target markets and the work that takes too long or keeps falling through the cracks. For one specific scenario, we will work through the context, accounts, roles, approvals and the outcomes you can check.”'),
  quoteLabel: B('(从一条流程开始)', '(Start with one)'),
  quoteWho: B('STARGO WORK', 'STARGO WORK'),
  quoteWhere: CONTACT_INFO.address,
  formLabel: B('(介绍一下你的公司)', '(Tell us about your company)'),
  fields: {
    name: B('姓名*', 'Name*'), email: B('邮箱*', 'Email*'), company: B('公司', 'Company'),
    category: B('希望 AI 先改善什么？', 'What would you like AI to improve first?'),
    message: B('你想让 AI 改善哪条流程？', 'What workflow do you want AI to improve?'),
    whatsapp: B('WhatsApp', 'WhatsApp'), industry: B('行业', 'Industry'), markets: B('目标市场', 'Target markets'), team: B('团队规模', 'Team size'), systems: B('现有系统', 'Current systems'),
  },
  selectPlaceholder: B('请选择', 'Select one…'),
  options: [
    B('主动获客', 'Customer acquisition'), B('外贸销售与 CRM', 'Trade sales & CRM'), B('报价与 PI', 'Quotes & PI'),
    B('ERP、订单与履约', 'ERP, orders & fulfillment'), B('AI 作图与营销素材', 'AI images & marketing assets'),
    B('AI 视频与爆款再创作', 'AI video & creative adaptation'), B('数字员工与团队协作', 'AI workforce & teamwork'),
    B('企业知识与主动工作', 'Knowledge & proactive work'), B('老板驾驶舱与管理', 'Management & visibility'),
  ],
  /* The message box's placeholder. Only a hint: js/stargo-forms.js names the
     field by its <label>, so the placeholder never reaches the submission. */
  messageHint: B('例如：希望把找客户、跟进和报价接起来；目前使用哪些软件，最常遇到什么问题？', 'For example: connect prospecting, follow-up and quotes. Which tools do you use, and where does the work break down?'),
  submit: B('提交演示申请', 'Send demo request'),
  /* Under the button, before the consent line tools/chrome.mjs appends to every
     form. That line already asks the reader to read the privacy policy, so only
     the second half of V5's before-submission note is added here. */
  beforeSubmit: B('提交后我们先了解你的需求，会议时间另行确认。', 'We use your request to understand your needs first; the meeting time is confirmed separately.'),
  /* Not drawn by the build: js/stargo-forms.js carries its own copy of this
     sentence (T.fallback) and shows it when a submission cannot be confirmed.
     "Cannot confirm" is kept rather than V5's "was not submitted", because a
     request that timed out may still have been delivered. */
  notice: B(`暂时无法确认提交结果。请重试，或点击下方链接发邮件到 ${CONTACT_INFO.email}，也可以用 WhatsApp ${CONTACT_INFO.whatsapp} 联系我们。`, `We couldn’t confirm your submission. Please try again, or use the email link below to write to ${CONTACT_INFO.email}. You can also reach us on WhatsApp at ${CONTACT_INFO.whatsapp}.`),
};

/* ============================================================= notices === */

export const NOTICES = {
  date: B('2026 年 9 月 5 日更新', 'Updated 2026-09-05'),
  h1: B('第三方声明', 'Third-party notices'),
  body: B(`
<h4>运行时库</h4>
<ul>
<li>Webflow 运行时与交互引擎（随模板导出），jQuery 3.5.1（MIT）</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock 标准“免费”许可。该许可允许用于网站（含商业用途），但许可方保留全部知识产权并可修改条款</li>
<li>Lenis（MIT）— 平滑滚动；Lottie（随 Webflow 运行时加载，MIT）— 导航图标动画</li>
</ul>
<h4>字体</h4>
<p>Inter、Inter Display、Inter Tight、Instrument Serif 与 42dot Sans，均按 SIL Open Font License 1.1 自托管，不向任何第三方字体服务发起请求。</p>
<h4>图片素材</h4>
<p>首页中心视频采用网站所有者提供的第四套模板 Fearless Vision Hero 中的银色轨道动画，已压缩并自托管。它用于品牌概念展示，不是 STARGO 产品操作录像或客户案例。</p>
<p>本站图片分三类。一、产品界面示意：网站所有者提供的 STARGO WORK 界面图，画面中的工作区、任务、客户与金额均为演示数据，不是真实客户账户的截图，也不代表已完成的业务结果。二、概念视觉：业务场景、品牌雕塑与数字角色图像为 AI 生成，用于解释业务关系、协作和治理，不是产品截图或员工肖像，中英文页面共用同一套无文字图像。三、模板素材：人物照片、产品与场景照片、示例 Logo 墙与装饰图标，来自网站所有者购买的 Webflow 模板随附的已授权设计素材，已镜像到本站自托管，仅作版式示意，不代表真实客户、员工、合作伙伴或客户评价。STARGO 标识与字标为 STARGO 自有作品。</p>
<h4>上游软件</h4>
<p>站内提到的 Activepieces、Chatwoot、Twenty CRM、WeKnora、Windmill、Playwright、Yente / OpenSanctions、Univer、Puter、Medusa、ERPNext、PostHog、Microsoft SkillOpt、Notion、Google、Reddit、LinkedIn、Facebook、YouTube、Alibaba、WhatsApp 等名称，均为各自所有者的商标或项目名。列出这些名称是为了注明上游来源，不代表相关项目为 STARGO 背书。</p>
<h4>联系</h4>
<p>STARGO WORK · 中国 · 广西 · 柳州 · ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp} · ${CONTACT_INFO.site}</p>`,
  `
<h4>Runtime libraries</h4>
<ul>
<li>Webflow runtime and interaction engine (exported with the templates), jQuery 3.5.1 (MIT)</li>
<li>GSAP 3.15 · SplitText · ScrollTrigger — GreenSock standard “no charge” license, which permits website implementation including commercial use while the licensor retains all intellectual property and may amend the terms</li>
<li>Lenis (MIT) — smooth scrolling; Lottie (loaded by the Webflow runtime, MIT) — navigation icon animation</li>
</ul>
<h4>Fonts</h4>
<p>Inter, Inter Display, Inter Tight, Instrument Serif and 42dot Sans, all self-hosted under the SIL Open Font License 1.1. No request goes to a third-party font service.</p>
<h4>Imagery</h4>
<p>The film at the center of the homepage uses the silver orbital animation from the owner-supplied fourth template, Fearless Vision Hero. It is compressed and self-hosted as conceptual brand imagery, not footage of the STARGO product or a customer engagement.</p>
<p>The pictures on this site fall into three kinds. First, illustrative product interfaces: screens of STARGO WORK supplied by the site owner, whose workspaces, tasks, customers and amounts are demonstration data — they are not screenshots of a real customer’s account and do not show completed business results. Second, conceptual visuals: the business scenes, brand sculptures and digital-role imagery are AI-generated, illustrating business relationships, collaboration and governance rather than product screens or employee portraits, and both languages share the same text-free set. Third, template assets: the people, product and scene photographs, the sample logo wall and the decorative icons are licensed design assets shipped with the Webflow templates the site owner purchased, mirrored and self-hosted here for layout illustration only; they do not depict real customers, employees, partners or customer reviews. The STARGO mark and wordmark are STARGO’s own work.</p>
<h4>Upstream software</h4>
<p>Activepieces, Chatwoot, Twenty CRM, WeKnora, Windmill, Playwright, Yente / OpenSanctions, Univer, Puter, Medusa, ERPNext, PostHog, Microsoft SkillOpt, Notion, Google, Reddit, LinkedIn, Facebook, YouTube, Alibaba, WhatsApp and other names mentioned on this site are trademarks or project names of their respective owners. They are named so that each upstream source can be identified; naming them does not imply that any of them endorses STARGO.</p>
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
  relatedIntro: B('三个入口，看 STARGO WORK<br/>做什么、谁来做、怎样管。', 'Three places to see what <span class="sgp-nobr">STARGO WORK</span> does, who does the work and how it is managed.'),   // zh: split per letter, so the break keeps 做什么 and 谁来做 whole. en: the line reveal re-splits on every space (a no-break space too), so the name is an ignored `.sgp-nobr` span kept on one line (css/stargo-fusion.css V7-HOME H26)
  related: [
    { tag: B('(14 个能力组)', '(14 capability groups)'), title: B('能力', 'Capabilities'), desc: B('从 Growth OS、Sales Desk 到 ERP 与 AI 创作，从工作台到持续改进。', 'From Growth OS and Sales Desk to ERP and AI creative work — from the workspace to continuous improvement.'), href: 'capabilities.html' },
    { tag: B('(288 个 AI 员工)', '(288 AI employees)'), title: B('数字员工', 'AI Workforce'), desc: B('十类职能，按任务组成团队，互相沟通、分工协作，一起把事做完。', 'Ten enterprise functions; teams form around the task, talk to each other and finish the work together.'), href: 'workforce.html' },
    { tag: B('(管理与交付)', '(Control & delivery)'), title: B('企业管理', 'Enterprise'), desc: B('看得见进度，管得住审批与预算，查得清结果；先从一条流程做起。', 'See progress, control approvals and budgets, check the results — and start with one workflow.'), href: 'enterprise.html' },
  ],
  view: B('查看', 'View'),
};

export const NOT_FOUND = {
  title: B('404', '404'),
  text: B('页面不存在，或已移走。', 'This page doesn’t exist, or has moved.'),
  back: B('返回首页', 'Back to home'),
};

/* =============================================================== legal === */

/** Privacy policy and terms of use: real pages, not placeholder anchors. */
export const LEGAL = {
  privacy: {
    date: B('2026 年 10 月 21 日生效', 'Effective 2026-10-21'),
    h1: B('隐私政策', 'Privacy policy'),
    body: B(`
<p>本政策说明 STARGO WORK 官方网站（以下简称“本站”）收集哪些信息、为什么收集、保存多久，以及你拥有的权利。本站由 STARGO（中国广西柳州）运营。</p>
<h4>我们收集什么</h4>
<ul>
<li><strong>你主动提交的信息。</strong>通过联系表单或订阅表单提交的姓名、邮箱、公司、WhatsApp、行业、目标市场、团队规模、现有系统与留言内容。这些信息仅用于回复你的咨询、安排演示和发送你订阅的产品更新。</li>
<li><strong>技术日志。</strong>本站托管在 Cloudflare Pages。访问时的 IP 地址、浏览器类型和请求时间会出现在托管方的标准访问日志中，用于安全防护与故障排查；本站不据此建立访客画像。</li>
<li><strong>Cookie 与本地存储。</strong>本站不使用分析或广告 Cookie，不加载任何第三方追踪脚本；所有字体、图片与脚本均从本站自身域名加载。</li>
</ul>
<h4>如何使用与共享</h4>
<p>提交时，表单内容先发到本站托管在 Cloudflare 上的接口校验。邮件服务配置完成后，通过 Resend 投递到 ${CONTACT_INFO.email}，用于处理你的请求。我们不出售你的信息；除完成托管、投递所需的服务商和法律要求外，不向第三方共享。本接口不会把表单内容写入数据库。</p>
<p>若邮件服务未配置或无法确认投递，页面会保留你填写的内容并提示重试，同时提供邮件链接。只有你主动点击该链接，才会打开自己的邮件客户端；这不代表在线提交已经成功。</p>
<h4>保存期限</h4>
<p>咨询信息在处理完毕后最多保存 24 个月；订阅邮箱在你退订前保留。你可以随时要求删除。</p>
<h4>你的权利</h4>
<p>你可以随时查询、更正或删除我们保存的你的个人信息，或退订：发送邮件到 ${CONTACT_INFO.email}，或通过 WhatsApp ${CONTACT_INFO.whatsapp} 联系我们。我们会在 15 个工作日内回复。</p>
<h4>未成年人</h4>
<p>本站面向企业用户，不面向未满 18 周岁的个人收集信息。</p>
<h4>政策更新</h4>
<p>政策更新时，本页顶部的生效日期会随之变化。重大变更会在本站显著位置提示。</p>`,
    `
<p>This policy explains what the STARGO WORK website (“this site”) collects, why, for how long, and the rights you have. The site is operated by STARGO, Liuzhou, Guangxi, China.</p>
<h4>What we collect</h4>
<ul>
<li><strong>What you submit.</strong> Name, email, company, WhatsApp, industry, target markets, team size, current systems and your message, sent through the contact or newsletter forms. They are used only to answer your inquiry, arrange a demo and send the product updates you subscribed to.</li>
<li><strong>Technical logs.</strong> The site is hosted on Cloudflare Pages. Your IP address, browser type and request time appear in the host’s standard access logs for security and troubleshooting; we do not build visitor profiles from them.</li>
<li><strong>Cookies and local storage.</strong> The site sets no analytics or advertising cookies and loads no third-party tracking script; fonts, images and scripts are served from this site’s own domain.</li>
</ul>
<h4>How it is used and shared</h4>
<p>When you submit a form, its contents first reach this site’s Cloudflare-hosted endpoint for validation. Once the mail service is configured, Resend delivers them to ${CONTACT_INFO.email} so we can handle your request. We do not sell your information. We share it only with the service providers needed for hosting and delivery, or when the law requires it. This endpoint does not write form contents to a database.</p>
<p>If the mail service is not configured or delivery cannot be confirmed, the page retains your entries, offers a retry and provides an email link. Your own mail client opens only when you choose that link; this does not mean the online submission succeeded.</p>
<h4>Retention</h4>
<p>Inquiries are kept for at most 24 months after they are handled; a newsletter address is kept until you unsubscribe. You can ask for deletion at any time.</p>
<h4>Your rights</h4>
<p>You can access, correct or delete the information we hold about you, or unsubscribe, at any time: write to ${CONTACT_INFO.email} or reach us on WhatsApp ${CONTACT_INFO.whatsapp}. We reply within 15 business days.</p>
<h4>Minors</h4>
<p>The site is intended for business users and does not knowingly collect information from anyone under 18.</p>
<h4>Changes</h4>
<p>When this policy changes, the effective date at the top of this page changes with it. Material changes are announced prominently on the site.</p>`),
  },
  terms: {
    date: B('2026 年 10 月 21 日生效', 'Effective 2026-10-21'),
    h1: B('使用条款', 'Terms of use'),
    body: B(`
<p>访问或使用 STARGO WORK 官方网站（以下简称“本站”），即表示你接受以下条款。本站由 STARGO（中国广西柳州）运营。</p>
<h4>内容用途</h4>
<p>本站内容用于介绍 STARGO WORK 产品与服务。页面中的界面图、公司名、人名与数字均为演示数据，用于说明产品工作方式，不构成对任何真实客户或结果的陈述。</p>
<h4>价格与方案</h4>
<p>本站列出的方案与价格为公开参考价，以人民币计。实际服务范围、续费价格、模型与第三方服务用量，以双方签署的合同或订单为准。我们可能在不另行通知的情况下调整本站的方案与价格。</p>
<h4>知识产权</h4>
<p>STARGO 标识、字标、产品名称（含 STARGO WORK、STARGO OS、Growth OS 等）以及本站的文字、界面图与品牌视觉，均归 STARGO 所有。未经书面许可，不得复制、改编或用于商业用途。本站使用的第三方模板、库与字体，其许可见“第三方声明”。</p>
<h4>第三方名称</h4>
<p>站内提到的其他公司、产品与项目名称属于各自所有者，出现在本站是为了说明兼容性或来源，不表示相关方对 STARGO 的背书。</p>
<h4>责任限制</h4>
<p>本站按“现状”提供。在法律允许的范围内，STARGO 不对因使用本站或依赖本站内容而产生的任何间接损失承担责任。本站可能不定期变更或中断，恕不另行通知。</p>
<h4>适用法律</h4>
<p>本条款适用中华人民共和国法律。因本条款产生的争议，由 STARGO 所在地有管辖权的人民法院管辖。</p>
<h4>联系</h4>
<p>关于本条款的问题：${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp}。</p>`,
    `
<p>By accessing or using the STARGO WORK website (“this site”), you accept the terms below. The site is operated by STARGO, Liuzhou, Guangxi, China.</p>
<h4>Purpose of the content</h4>
<p>The site presents the STARGO WORK product and services. Interface images, company names, personal names and figures on these pages are demonstration data that illustrate how the product works; they make no statement about any real customer or result.</p>
<h4>Plans and prices</h4>
<p>Plans and prices listed here are public reference prices in Chinese yuan. The actual scope of service, renewal price and allowance for model and third-party usage are set by the contract or order signed by both parties. Plans and prices on this site may change without notice.</p>
<h4>Intellectual property</h4>
<p>The STARGO mark, wordmark and product names (including STARGO WORK, STARGO OS and Growth OS), together with the text, interface images and brand visuals on this site, belong to STARGO. They may not be copied, adapted or used commercially without written permission. Third-party templates, libraries and fonts used by the site are licensed as described on the Notices page.</p>
<h4>Third-party names</h4>
<p>Other company, product and project names mentioned on this site belong to their respective owners. They appear to explain compatibility or origin and imply no endorsement of STARGO.</p>
<h4>Limitation of liability</h4>
<p>The site is provided “as is.” To the extent the law allows, STARGO is not liable for indirect loss arising from use of the site or reliance on its content. The site may change or be interrupted at any time without notice.</p>
<h4>Governing law</h4>
<p>These terms are governed by the laws of the People’s Republic of China. Disputes fall under the jurisdiction of the competent people’s court at STARGO’s seat.</p>
<h4>Contact</h4>
<p>Questions about these terms: ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp}.</p>`),
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
  heroPink: B('288 个 AI 员工。', '288 AI employees.'),
  heroWhite: B('按工作需要，组成 AI 团队。', 'Build the team your task needs.'),
  heroDesc: B('不是只有外贸销售，也不是 288 个相同的聊天窗口。企业支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务，都有对应的专业角色。288 指岗位目录规模，按任务、预算和权限选用。', 'This is more than a trade-sales team or 288 identical chat windows. Specialized roles span enterprise support, marketing, sales, service, compliance, supply chain, finance, operations, product and engineering, and professional services. 288 is the size of the role directory; roles are picked per task, within budget and access.'),
  heroButton: B('预约演示', 'Book a Demo'),
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
    { title: B('交办与确认', 'Delegate and approve'), text: B('提出业务目标，选择员工或团队，查看任务和成果，批准关键操作。需要判断或遇到异常时，由人接管。', 'Set a business goal, choose employees or a team, inspect tasks and results, and approve key actions. People take over when judgment or an exception calls for it.') },
    /* M14's summary, its availability line and its roadmap boundary: the
       browser comes first, and native clients, mobile and mini-programs are
       phased — so nothing on this page reads as a shipped phone app. */
    { title: B('网页桌面与 AI 办公', 'Browser desktop and AI office'), text: B('在一个网页桌面里打开业务应用、处理文件、调用 AI 员工，连接经你授权的账号。打开浏览器就能用，电脑客户端、移动端和小程序也已上线。语音交办、自动化和对外操作都已开通。', 'Open business apps, work with files, call on AI employees and connect authorized business accounts in one browser desktop. Native desktop clients, mobile apps and mini-programs are live too. Voice requests, automation and external actions are all enabled.') },
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
  cardA: { title: B('有岗位的 AI', 'AI with a job'), text: B('每个岗位都可以设定职责、技能、企业知识、可用工具、权限和任务，运行全程有记录。分工明确，懂公司情况，做事有边界。', 'Each role is set up with responsibilities, skills, enterprise knowledge, permitted tools, access and tasks, and keeps a run history: a defined job, done with company context and within a clear scope.') },
  // M10-04, M11-05 and M11-04: what is recorded, why it survives a pause, and what sharing does not open.
  cardB: { title: B('交接有记录', 'Handoffs on record'), text: B('记录负责人、截止时间、任务状态、结果与下一步，暂停或人工接管后仍能接着推进，各成员的工作汇总成可交接的成果。成员之间只共享任务需要的信息，不共享全部数据，权限也不会互相转移。', "Owners, deadlines, task status, results and next steps are recorded, so work can continue after a pause or a human takeover, and each member’s work is consolidated into a handoff-ready result. Sharing task context does not open all company data or pass on another role’s permissions.") },
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
    B('请核对产品规格。', 'Please check the product specs.'),
    B('已补充可引用的卖点资料。', 'I’ve added selling points we can cite.'),
    B('这项承诺需要审批人批准。', 'This commitment needs an approver’s sign-off.'),
  ],
  // The small role card inside the desktop collage: one more example role.
  extraRole: { name: B('报告 AI 员工', 'Reporting AI'), owns: B('运营', 'Ops') },
  /* The paragraph under the cards: M11's summary, V6 §6.3's example, M11's
     limits and the phase line. It is the only place the scenario is told as
     sentences. The column is ordinary text flow, so the paragraph grows with
     its copy (nothing clips it). */
  answersBody: B('复杂的活，可以交给几位 AI 员工分工完成。关键看三点：信息传没传到，责任清不清楚，结果能不能交接。示例场景：开拓一个新市场。研究员工找到目标客户后，把待确认的规格交给产品员工；销售员工据此调整开发策略，创意员工准备配套的营销素材。统筹角色汇总结果和待定问题，交负责人确认。协作轮数、预算和能做的操作都有上限；关键操作要人批准，人也随时可以叫停、接手。', 'Complex work can be split across a team of AI employees. What matters is information exchange, clear ownership and reliable handoff, not the number of chat windows. Illustrative scenario: entering a new target market. Research can hand specification questions to a product specialist. Sales uses the findings to refine outreach, while creative specialists prepare relevant assets. A coordinator consolidates outputs and unresolved questions for the responsible person to review. Collaboration rounds, budgets and permitted actions are limited, and human approval, pause and takeover remain available.'),
  /* The statement under that paragraph (M11's headline). The Chinese is cut to
     「而是一起做完」 so each half is seven characters: at 768 the column holds
     8.6 characters of 40px type, and 「而是一起把事做完。」 is nine. The
     heading is balanced per character, so the half before the comma must not
     be the shorter one: measured with P04's full wording, every width from 320
     to 1920 broke 「不是各聊各的，而」/「是一起把事做完。」. */
  teamTitle: B('不再各聊各的，一起把事做完。', 'No more separate chats. One team finishes the job.'),
  /* The template's square tile has a follower count painted into the artwork.
     It carried STARGO's brand still (assets/stargo-motion/orbit-poster.webp),
     then from 2026-09-18 the Expert Teams composite; since 2026-10-23 (owner:
     no more AI composites) it is the code-drawn 'team' scene of
     tools/motion-scenes.mjs. The paragraph beside it is `answersBody` above —
     a complex task divided between several AI employees, where what matters
     is that information passes, ownership is clear and results hand off, and
     a coordinator hands the result to the responsible person — and the scene
     plays exactly that with demo data, ending at a human approval. The host
     takes the picture's 1672 × 941 box inside the magenta frame
     (css/stargo-motion-team.css); its screen-reader sentence is the scene's
     MOTION_LABEL. */
  tile: { motion: 'team' },
  /* The display line behind the stacked cards; split per character on the
     Chinese page. Two five-character halves: one line of this size holds 5.8
     to 6.4 characters from 320 to 1440. */
  answersTitle: B('一个目标，一个团队。', 'One goal, one team.'),
  // Three static labels over the team paragraph. [0] is also about.html's heading.
  answerTabs: [B('岗位', 'Roles'), B('协作', 'Teamwork'), B('确认', 'Review')],
  answersCard: B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.'),
  answersButton: B('聊聊你的方案', 'Discuss your plan'),
  storiesTitle: B('文章', 'Stories'),
  storiesSub: B('我们的分享', 'we write and share'),
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
  title: B('从实际业务出发，把分散的工作串起来。', 'Start with real work. Connect what comes next.'),
  desc: B('做制造和外贸，回一次消息、报一次价，生意远没有结束。客户资料、产品知识、沟通、价格、订单和交付，都要一路跟进、多人配合。STARGO WORK 就按这些具体工作来设计产品：先从主动获客和销售切入，再延伸到经营、内容生产和数字员工。', 'Manufacturing and global trade do not stop at a reply or a quote. Customer records, product knowledge, conversations, pricing, orders and delivery need ongoing coordination. STARGO WORK organizes its product around these practical needs, starting with acquisition and sales, then connecting operations, creative work and AI teams.'),
  closing: B('先跑通一件事，再推广到全公司。', 'Start with one workflow. Then expand across your company.'),
  button: { label: B('预约演示', 'Book a demo'), href: 'contact.html' },
  /* The template shows four named people here. STARGO's role emblems (its own
     conceptual visuals, not portraits) stand for four AI-employee roles instead.
     The fourth was 「调度中枢」/"Orchestrator", an engineering word; V6 calls the
     role that checks and consolidates a team's work a coordinator. */
  circles: [
    { label: B('市场信号 AI 员工', 'Market Signal AI'), image: 'assets/stargo/avatar-01.png' },
    { label: B('报价 AI 员工', 'Quotation AI'), image: 'assets/stargo/avatar-03.png' },
    { label: B('跟进 AI 员工', 'Follow-up AI'), image: 'assets/stargo/avatar-05.png' },
    { label: B('统筹 AI 员工', 'Coordination AI'), image: 'assets/stargo/avatar-06.png' },
  ],
  bigImage: { src: PLACED.aboutBigImage, alt: B('银色轨道协同运转的品牌概念画面', 'Brand concept: silver orbital forms moving together') },
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
  heroTail: B('到把企业工作\u200b串起来', 'enterprise\u00a0work'),
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
  body: B('面向制造业和外贸企业的网页桌面级 AI 企业操作系统：Growth OS 主动获客，Sales Desk 推进外贸销售，再接上 ERP、AI 创作、企业知识和 288 个 AI 员工。', 'A browser-based desktop AI operating system for manufacturers and global trade companies: Growth OS and Sales Desk, connected with ERP, creative work, enterprise knowledge and 288 AI employees.'),
  cardButton: B('聊聊你的流程', 'Discuss your workflow'),
  inCatalogue: B('对应能力组', 'In the catalog'),
  outputLabel: B('产出', 'Useful output'),
  connectionLabel: B('接到哪里', 'Connects to'),
  /* Closes the quotation paragraph (tools/blocks/rk-stats.mjs): what this
     describes is scope, and what a company can use is confirmed per item. */
  scopeNote: B('你们需要哪些功能，沟通方案时逐项确认。', 'We confirm what you need, item by item, when we scope your plan.'),

  stories: [
    {
      image: STORY_ART.growthOs,
      /* Growth OS, proactive acquisition (V5 M02, V6 §5.2). tools/blocks/
         cn-service.mjs prints `promise` + `connection` as the section's lead
         and `output` + `availability` under it; the four rows are the first
         four picks, worded by CAP_V6A.growth below. */
      label: B('Growth OS · 主动获客', 'Growth OS · Customer acquisition'),
      groups: ['02', '03'],
      promise: B('Growth OS 除了整理找上门的询盘，还会按你的产品、目标市场和客户画像，主动找值得开发的客户，判断有没有机会；证据不够就标为待核实，不硬猜。', 'Growth OS goes beyond incoming inquiries: it uses your products, target markets and buyer profiles to find companies worth pursuing and qualify each opportunity; weak evidence is marked for checking, never guessed.'),
      picks: ['Account Research', 'Trade Intelligence', 'Importer Reorder Radar', 'Buying Committee Intelligence', 'Opportunity Decisions', 'Dealer Opportunity Brief', 'CRM Automatic Lead Creation'],
      output: B('工作成果：客户清单、联系人信息、商机简报、开发计划。', 'Outputs: prospect lists, contact details, opportunity briefs and outreach plans.'),
      connection: B('确认后的客户，连同来源、背调、感兴趣的产品和下一步任务，一起转进 Sales Desk：不用等询盘，也不用重复建档。', 'Approved prospects move into Sales Desk with their sources, research, product interests and next actions — no waiting for an inquiry, no duplicate records.'),
      availability: B('数据和客户联系渠道，经你授权后接入。', 'Data and outreach channels connect with your authorization.'),
    },
    {
      image: STORY_ART.salesDesk,
      /* Sales Desk (V5 M03, V6 §5.3). The heading is V6's; tools/blocks/qx-news.mjs
         prints `promise` then `availability` in the left column, and its three
         rows keep the intake / requirements / customer-context split. */
      /* English takes V6's compact form: the sticky column holds about fifteen
         Latin characters a line at 58px, and the long form stood five lines. */
      label: B('Sales Desk：把客户聊明白，把订单跟到底', 'Sales Desk: from customer to order'),
      groups: ['04', '05'],
      promise: B('Growth OS 确认的客户和各渠道的询盘，都进 Sales Desk：统一入口收进来，从来信和附件里读出需求，客户全景记下背景和历史。有了这三样，回复、产品匹配、跟进、报价和 PI 都有据可依，一路推进到订单交接。', 'Sales Desk takes the prospects Growth OS has approved and the inquiries from every connected channel. One intake receives them, requirements are read from messages and attachments, and the customer view keeps context and history. Together they support replies, product matching, follow-up, quotes and the PI, right through to the order handoff.'),
      picks: ['Unified Inbox', 'Inquiry Intent Detection', 'Buyer Requirement Extraction', 'Customer Risk Signals', 'Knowledge-Grounded Reply', 'Account Overview', 'Planned Follow-up'],
      output: B('客户档案、结构化需求、产品方案、待审核回复与连续的销售跟进记录。', 'Customer records, structured requirements, product fit, review-ready replies and continuous sales history.'),
      connection: B('确认的需求与产品方案，就是下一段报价的起点。', 'The agreed requirement and product fit become the starting point of the quotation below.'),
      availability: B('业务工作台已上线；渠道收发、价格和业务交接，经你授权即可接通。', 'The workspace is live; messaging, price sources and business handoffs connect once you authorize them.'),
    },
    {
      image: STORY_ART.quote,
      /* Quotations, PI and commercial records (V5 M04, V6 §5.4). The heading's
         three clauses are drawn as three lines by tools/blocks/rk-stats.mjs,
         which splits it at 「，」 / ". "; the paragraph is `promise`, then
         `connection`, then `availability`, then the scope note. */
      label: B('报价有依据，利润有边界，文件有版本', 'Ground the price. Guard the margin. Keep the version.'),
      groups: ['07', '06'],
      promise: B('按产品配置、数量、包装、币种和贸易条款准备报价草稿；价格取自公司确认过的价格表和历史报价。折扣超出权限、利润低于底线，要由有审批权的人批准，AI 不会自己编价格。每一版都留底、可对比，批准的版本再转成 PI 和合同，接着准备商业发票、装箱单等单证，交人工复核。', 'Quote drafts are built from product configuration, quantity, packaging, currency and trade terms. Prices come from the company’s approved price lists and quote history; discounts or margins beyond the limits need an authorized approver, and AI never invents a price. Every version is kept and comparable, and the approved one becomes the PI and the contract, with commercial invoices, packing lists and other documents prepared for human review.'),
      picks: ['Quotation Center', 'Product Configuration & Quantity', 'Pricing Rules', 'Margin Guardrails', 'Historical Price Context', 'Approval Workflow', 'PI Center'],
      output: B('报价草稿、批准版本、PI、商务条款与可追溯的商业资料。', 'Quote drafts, approved versions, proforma invoices, commercial terms and traceable documents.'),
      connection: B('批准报价不等于已经发送，发送也不等于客户已经收到，三者分别确认。', 'An approved quote is not a sent one, and a sent quote is not a received one; each is confirmed on its own.'),
      availability: B('报价和 PI 已上线；实际价格、合同、签章和单证，接上你们的系统就能用。', 'Quotes and PIs are live; actual prices, contracts, signatures and documents work once your systems are connected.'),
    },
    {
      image: STORY_ART.erp,
      /* ERP and fulfillment (V5 M05 + M06, V6 §5.5). The marquee is `label`; the
         six cards are CAP_V6A.operations (six operating themes, not register
         items). The boundary is said on the two cards it belongs to. */
      label: B('ERP 与履约：前端拿订单，后台接得住', 'ERP & fulfillment: from winning orders to delivering them'),
      groups: ['08'],
      promise: B('前台销售和后台经营放在同一个桌面上：既知道客户要什么，也清楚产品、物料、库存的情况和生产、订单、回款的进度。', 'Put sales and back-office operations on one desktop: see what the customer wants, and where products, materials, inventory, production, orders and payments stand.'),
      picks: ['Order Management', 'Payment Milestones', 'Production Status & QC', 'Commercial Invoice · Packing List', 'Certificate of Origin · Form E', 'Bill of Lading Workflow', 'Export Documentation & Workflow'],
      output: B('订单节点、付款提醒、资料清单、异常事项、售后记录与复购跟进。', 'Order milestones, payment reminders, document checklists, exceptions, service records and reorder follow-up.'),
      connection: B('获客 → 销售 → ERP / 履约 → 财务 → 售后复购 → 新一轮增长。', 'Acquisition → sales → ERP / fulfillment → finance → support and reorders → the next round of growth.'),
      availability: B('ERP 和商城应用已上线，跨系统联动和 AI 操作也都能用；物流、财务和服务走你们已接入的系统。', 'ERP and commerce applications are live, and so are cross-system work and AI actions; logistics, finance and service run through your connected systems.'),
      caveat: B('正式申报、签发与资金支付仍由相应有权人员和机构处理；单据准备与流程协同不替代专业合规审查。', 'Official filings, issuance and payments stay with the authorized people and institutions; document preparation and workflow support do not replace professional compliance review.'),
    },
    {
      image: STORY_ART.creative,
      label: B('为产品和市场做内容', 'Create content for products and markets'),
      groups: ['09', '03'],
      promise: B('产品和销售素材，用的就是销售流程那一份审核过的产品资料，再按买家和答案引擎找得到的方式组织。', 'Product and sales material is produced from the same approved product information the sales workflow uses, then structured so buyers and answer engines can find it.'),
      picks: ['AI Creative Studio', 'Product · Sales · Social Content', 'Search & AI-search Content', 'Multi-language Content', 'AI Image & Video Workflow', 'Viral Structure Adaptation', 'Short-form Clip Editing'],
      output: B('产品页、本地化文案、短视频，直接用在你的销售渠道上。', 'Product pages, localized copy and short video ready for the channels you sell on.'),
      connection: B('发出去的内容，又回流到上面的买家研究和询盘处理。', 'Published material feeds the buyer research and inquiry handling above.'),
    },
    {
      image: STORY_ART.team,
      /* AI roles working as a team (V5 M10 + M11, V6 §5.7). The three cards
         are CAP_V6A.team; `output` fills the two-line slot beside the heading. */
      label: B('让 AI 团队把活干完', 'Get the work done with an AI team'),
      groups: ['01', '10'],
      promise: B('复杂的活，可以交给几位 AI 员工分工完成。关键看三点：信息传没传到，责任清不清楚，结果能不能交接。', 'Split complex work across a team of AI employees. What matters is information exchange, clear ownership and reliable handoff — not the number of chat windows.'),
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
      image: STORY_ART.knowledge,
      label: B('企业知识与业务关系', 'Knowledge and business relationships'),
      groups: ['06', '12'],
      promise: B('知识库是企业资料室；业务关系把客户、产品、报价、订单与负责人对应起来。回答依据企业确认的资料，资料冲突或过期时提示核实。', 'The knowledge base is the company’s reference room; business relationships connect customers, products, quotes, orders and owners. Answers rest on approved company sources, and conflicting or outdated material is flagged.'),
      panel: [
        [B('企业知识中心', 'Knowledge center'), B('产品、价格政策、认证、常见问题、模板与制度集中管理', 'Products, pricing policy, certificates, FAQs and templates in one place')],
        [B('有据可查的回答', 'Answers with sources'), B('每条回答注明出处；缺资料时明确提示', 'Each answer names its source; gaps are flagged')],
        [B('业务关系图', 'Business relationship map'), B('客户、商机、报价、订单与负责人彼此关联', 'Customers, opportunities, quotes, orders and owners linked')],
        [B('同一个客户对得上', 'One customer, every record'), B('不同系统里的同一客户、订单都对得上', 'The same customer or order matched across systems')],
        [B('规则写进流程', 'Rules inside the work'), B('报价权限、订单条件和审批人事先清楚', 'Pricing authority, conditions and approvers known up front')],
      ],
      caveat: B('知识库和业务关系图已经可用，接入的系统越多，关联越完整。', 'Ready to use; the more systems you connect, the richer the links.'),
    },
    {
      image: STORY_ART.desktop,
      label: B('按授权连接业务系统', 'Connections, by authorization'),
      groups: ['11'],
      promise: B('邮箱、网盘、CRM、ERP 与业务平台按企业授权接入，明确哪些能看、哪些能改、哪些要审批。列出的连接完成配置与授权前，不算已经接通。', 'Email, drives, CRM, ERP and business platforms connect through enterprise authorization, defining what can be read, changed or needs approval. A listed connection is not live until it is configured and authorized.'),
      panel: [
        [B('企业账号与应用', 'Accounts and apps'), B('邮箱、网盘、CRM、ERP，按授权开放', 'Email, drives, CRM and ERP, as far as authorized')],
        [B('跨应用流程', 'Cross-app workflows'), B('定时或在业务变化时，自动串起重复步骤', 'Repeated steps run on a schedule or when business data changes')],
        [B('授权网页任务', 'Authorized web tasks'), B('查资料、填表、上传下载，不绕过登录与验证', 'Research and forms, never bypassing sign-in')],
        [B('账号统一保管', 'Sign-ins kept safe'), B('登录凭据集中保管，不在对话里流转', 'Credentials held centrally, not passed around')],
        [B('同步与出错处理', 'Sync and errors'), B('同步、重试与异常都有记录', 'Retries and exceptions are recorded')],
      ],
      caveat: B('目录里的每个连接，配置并授权后即可使用。', 'Every listed connection is ready once configured and authorized.'),
    },
    {
      image: STORY_ART.login,
      label: B('权限、审批与记录', 'Approvals and records'),   // one line in English: a two-line label rose into node 04's open panel
      groups: ['13'],
      promise: B('哪些工作可以自动推进、哪些要复核、哪些必须审批，由你们决定。重要操作都留有记录：谁做的、依据什么、结果如何。', 'You decide what may proceed on its own, what needs review and what needs approval. Important actions leave a record: who acted, on what basis and with what result.'),
      panel: [
        [B('人工审批', 'Human approval'), B('报价、对外联系、重要承诺和付款，由审批人决定', 'Quotes, outreach, commitments and payments decided by people')],
        [B('权限与身份', 'Access and identity'), B('谁能看、谁能做，按岗位与账号设定', 'Who may see and do what, by role and account')],
        [B('工作记录', 'Work records'), B('做了什么、谁完成、凭谁的授权', 'What was done, by whom, on whose authority')],
        [B('暂停与接管', 'Pause and takeover'), B('出现异常时停下，由人接手或退回', 'On an exception, work stops for a person')],
        [B('企业数据隔离', 'Separated company data'), B('不同公司与品牌的数据各自分开', 'Each company and brand keeps its own data')],
      ],
    },
    {
      image: STORY_ART.improvement,
      label: B('经过验证的改进', 'Improvement you can check'),
      groups: ['14'],
      promise: B('从成功和失败中整理可改进的工作方法、岗位技能与流程，先测试、比较、批准，再逐步采用；效果不足时可以撤回。', 'Better working methods, role skills and processes are drawn from successes and failures, then tested, compared and approved before gradual adoption — and withdrawn if they fall short.'),
      panel: [
        [B('观察实际工作', 'Watch the real work'), B('记录真实执行中发生了什么', 'Record what actually happened')],
        [B('结果复盘', 'Outcome review'), B('成功与失败整理成候选改进', 'Wins and losses become candidate improvements')],
        [B('采用前测试', 'Tested before adoption'), B('先测试、比较，再交人批准', 'Tested, compared, then approved')],
        [B('小范围试用', 'Small-scale trial'), B('先在部分工作中试，保留或撤回', 'Tried on part of the work first')],
        [B('核对业务结果', 'Check the result'), B('不只看“执行过”，还核对是否达标', 'Checked against the goal')],
      ],
      caveat: B('改进经测试和批准后采用，可以撤回。', 'Tested and approved first; can be withdrawn.'),
    },
  ],

  catalogueLabel: B('完整目录', 'The complete catalog'),
  catalogueNote: B('登记在册的全部能力，按组排列。前面六章讲的成果，引用的就是这些条目。', 'Every capability in the register, by group. The outcomes in the six chapters earlier on this page draw from these same entries.'),
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
        text: B('找出采购决策人和其他关键人，留好身份核对的依据，确认后交给 Sales Desk。', 'Buyers and influencers identified with identity evidence, then handed to Sales Desk once approved.') },
    },
  },
  /* #story-2 — Sales Desk (tools/blocks/qx-news.mjs): intake, requirements,
     customer context — V6 §5.3's three names — keyed by the register pick each
     row links to (its group decides #g04 / #g05). */
  sales: {
    rows: {
      'Unified Inbox': { title: B('统一询盘入口', 'Inquiry Intake'),
        text: B('各渠道询盘汇入同一入口，分清新询盘、历史消息与垃圾信息。', 'Inquiries from each connected channel arrive in one intake, with new inquiries separated from history and spam.') },
      'Buyer Requirement Extraction': { title: B('买方需求提取', 'Buyer Needs'),
        text: B('从来信与附件读出产品、规格、数量与交期，并提示缺失信息。', 'Products, specifications, quantities and delivery dates read from messages and attachments, with gaps flagged.') },
      'Account Overview': { title: B('客户全景', 'Customer Context'),
        text: B('联系人、商机阶段、沟通记录、报价与订单，接手时一屏看全。', 'Contacts, stage, conversations, quotes and orders — the whole context for whoever takes over.') },
    },
  },
  /* #story-3 — quotations (tools/blocks/rk-stats.mjs). The three reels show
     the steps 01 / 02 / 03 of V5 M04's sequence — draft, review and approval,
     the kept version — not counts, so nothing on the band reads as a result.
     Each label is one line of the donor's 24px slot, which is 163px wide at
     768: six Chinese characters or about fifteen Latin ones.

     The picture is this site's own editorial art for quoting (precision parts
     aligned and checked), in place of renok's branding portrait. The owner's
     own document screen was placed here on 2026-09-18 and taken out again the
     same day: renok's picture box is portrait at 768 (260×424), so a 16:9
     interface sat in two thirds of blank white, and where the box is
     height:auto the shorter file moved the band below it. The slot is held for
     a picture that suits it. Since 2026-10-21 that is the owner's photograph
     of a quote being approved (C07, tools/replaceables.mjs CAP_PHOTOS.quote),
     3:2 like the art it replaces, so the height:auto box keeps its size. A
     value starting with `assets/` is a path as written; anything else is an
     editorial id (tools/blocks/rk-stats.mjs). */
  quote: {
    steps: [B('按规则起草', 'Drafted by rules'), B('审批人批准', 'Human approval'), B('保留正式版本', 'Version kept')],
    image: CAP_PHOTOS.quote,
    button: { label: B('报价能力详情', 'Quote details'), href: '#g07' },
    /* The paragraph's closing pointer to where product facts live. */
    facts: { lead: B('报价背后的产品资料，见', 'For the product facts behind a price, see'), label: B('产品与企业知识', 'Products & enterprise knowledge'), href: '#g06' },
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
        text: B('产品档案、规格、物料清单和供应商资料保持一致，按订单需求安排采购、跟进到货。ERP 和商城应用已上线，跨系统联动和 AI 操作也都能用。', 'Product records, specifications, bills of materials and suppliers stay consistent, and order demand links to purchasing and deliveries. ERP and commerce applications are live, and so are cross-system work and AI actions.') },
      { title: B(`库存、生产${ZW}与质检`, 'Stock, production & quality'),
        text: B('看清可交付数量与缺货，跟踪生产任务、物料需求、质检、包装与交期。', 'See available stock and shortages; track production tasks, material needs, quality checks, packing and lead times.') },
      { title: B(`订单与${ZW}付款节点`, 'Orders, deposits & balances'),
        text: B('订单、订金、尾款、发票和对账提醒一一对上；付款由有审批权的人批准，AI 不擅自付款。', 'Orders, deposits, balances, invoices and reconciliation reminders line up; payments are authorized by people, never by AI alone.') },
      { title: B(`外贸单证${ZW}与出口资料`, 'Trade documents & export records'),
        text: B('准备并核对商业发票、装箱单、原产地证 / Form E 资料、提单、认证与出口退税资料；正式申报由你们授权的人提交，签发和审批由主管机构办理。', 'Prepare and check commercial invoices, packing lists, certificate of origin / Form E materials, bills of lading, certifications and export tax-rebate records; official filings are submitted by authorized people, and issuance and approval stay with the authorities.') },
      { title: B('物流与交付', 'Logistics & delivery'),
        text: B('运费询价、订舱、物流轨迹、预计到货和异常处理，运输单据跟着货走；数据来自你们接入的货代和物流系统。', 'Freight quotes, bookings, tracking, arrival estimates and exceptions, with shipping documents kept with each shipment. Data comes from the forwarders and logistics systems you connect.') },
      { title: B(`售后、渠道${ZW}与复购`, 'Service, channels & reorders'),
        text: B('保修、退换货、备件和经销商支持，加上商城业务与补货建议，成交之后的生意也接得住。', 'Warranty, returns, spare parts, dealer support, commerce and reorder suggestions keep the business going after the sale.') },
    ],
    link: { label: B('ERP 与履约详情', 'ERP & fulfillment details'), href: '#g08' },
    /* The six portraits were the donor's testimonial sitters: beside an
       operating theme a face reads as a customer quote this company does not
       have. This site's own abstract avatars stand in (decorative). */
    /* 2026-10-23: the owner asked for the metallic avatars to become the
       company's own S + star mark everywhere. */
    icons: Array(6).fill('assets/brand/stargo-s-mark-256.webp'),
  },
  /* #story-6 — AI roles as a team (tools/blocks/qx-projects.mjs): V6 §5.7's
     three cards. The large card is the teamwork example and says it is an
     illustration and that the employees message each other and work in
     parallel (available, owner 2026-09-17). Links go to the
     workforce page, where M10/M11 are told in full, and to the catalogue
     group for the role and task entries. The first two pictures were the
     owner's photographs from 2026-10-21 (C09, C10), where this site's
     editorial art for specialised roles and parallel work was; since
     2026-10-23 all three are scenes drawn in code (`motion`). */
  team: {
    arrowHref: 'workforce.html',
    cards: [
      { title: B(`288 个${ZW}跨部门${ZW}专业岗位`, '288 cross-functional specialist roles'),
        text: B('按任务从岗位目录里挑人、组队协作，不替代真人。', 'A role directory to staff each task and form teams, not a replacement for people.'),
        /* capareas, 2026-10-23: the code-drawn 'crewRoles' scene (js/stargo-motion-crew.js) where the
           owner's photograph C09 was — the 288 roles by function, narrowed to the five one task needs. */
        href: 'workforce.html#lx-role-groups', pill: B('认识数字员工', 'Meet the AI Workforce'), motion: 'crewRoles' },
      { title: B(`员工任务、${ZW}进度与成果`, 'Tasks, progress and results'),
        text: B('谁在做什么、卡在哪一步、交付了什么，一眼看清；关键操作由人批准。', 'See who is doing what, what is waiting and what has been delivered; people approve the key actions.'),
        /* capareas: the 'crewBoard' scene where C10 was — tasks moving to 待你确认 and 已完成 with results attached. */
        href: '#g10', pill: B('员工能力组', 'AI workforce group'), motion: 'crewBoard' },
      { title: B(`团队分工、${ZW}交流、${ZW}并行与接力`, 'Roles, messaging, parallel work and handoffs'),
        text: B('协作示意：市场研究员工找到目标客户，产品员工核对规格，销售员工制定开发计划，创意员工准备素材；员工之间直接交流、并行推进，统筹角色复核汇总后交负责人确认。图为示意，不是实时运行画面。', 'Illustrative: research finds target accounts, a product specialist checks specifications, sales plans outreach and creative prepares assets; the employees message each other and work in parallel, and a coordinator reviews and consolidates the package for the responsible person to confirm. The picture is an illustration, not a live view.'),
        /* The picture is the code-drawn 'team' scene (owner, 2026-10-23: no
           more AI composites; it replaces the Expert Teams composite,
           sw006-expert-teams.webp). It plays this card's own sentence with
           demo data: one goal split between the market researcher, the
           product engineer, sales and creative, who work in parallel and hand
           off to each other; one question waits for a person, and the
           coordinator gathers the results and stops at a human approval.
           「图为示意」 stays true of it, and the scene says so on itself.
           `motion` names a scene in tools/motion-scenes.mjs; `image` would be
           an editorial id or an `assets/` path (tools/blocks/qx-projects.mjs). */
        href: 'workforce.html#lx-team', pill: B('看团队协作', 'See teamwork'), motion: 'team' },
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
 * The other five are built from M07 and keep M07's availability sentence,
 * with its "one-click" tied to the marketing kits (M07-02) so it cannot be
 * read as one-click video, which is available; 5 and 6 add M07-06's separate authorization for publishing, and 7
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
const CREATIVE_NOTE = B('创意工作室已开通，商品营销套件支持一键编排和局部检查。', 'The creative workspace is live, with one-click marketing-kit production and targeted checks.');
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
  catalogueLink: B('对应能力组', 'Catalog group'),
  noteLabel: B('使用说明：', 'In practice: '),
  items: [
    {
      id: 'creative-images',
      title: B('AI 作图与图片编辑', 'AI Images & Editing'),
      covers: ['AI Creative Studio', 'AI Image & Video Workflow'],
      body: [
        B('提供文字说明、产品参考图或现有素材，就能在一处出图、改图，白底主图、场景图、海报、卖点图和广告图都能做。',
          'Provide a written brief, product reference images or existing assets, and generate and edit images in one workflow: product heroes on white, scenes, posters, benefit graphics and advertising concepts.'),
        B('出图时统一用你们的标志、配色和品牌语气，产品细节以已确认的资料为准；外观、参数或文字不对的地方，先检查再局部修改，少出“好看但不真实”的图。每一版图片都能对比，也能接着改。',
          'Your brand kit (logo, colors and tone) and verified product facts guide every image. Where the look, specifications or text are wrong, the image is checked and fixed in place, so you get fewer images that look good but misrepresent the product. You can compare every version and keep refining.'),
      ],
      note: CREATIVE_NOTE,
    },
    {
      id: 'creative-video',
      title: B('AI 一键生成视频', 'One-Click Video'),
      keep: B(['AI 一键生成视频'], []),
      covers: ['AI Image & Video Workflow'],
      flow: {
        label: B('一键视频流程', 'One-click video flow'),
        steps: B(['制作需求', '脚本', '分镜', '画面', '配音', '字幕', '审核与导出'], ['Brief', 'Script', 'Storyboard', 'Visuals', 'Voiceover', 'Captions', 'Review and export']),
      },
      body: [
        B('输入产品资料、参考图、目标市场、语言、时长和画幅，需求就整理成一个视频项目。从脚本、分镜、画面、配音、字幕到审核导出，都在这个项目里完成；素材、任务状态和各个版本都保留，少在几个工具之间来回切换、反复交接。',
          'Start with product facts, reference images, target market, language, duration and aspect ratio, and the brief becomes one video project covering script, storyboard, visuals, voiceover, captions, review and export. Assets, task status and versions stay with the project, so there is less switching between tools and fewer handoffs.'),
        B('正式生成前，先出一份制作方案给你审：开场怎么抓人、卖点怎么讲、镜头顺序、节奏和结尾引导。画面以已确认的产品事实和品牌规范为准，并经过质量检查；多语言旁白、音乐、品牌标志、片尾和参数标注在后期加入，只用已授权的素材。生成预算、审批和任务进度都记在项目里。',
          'Before generation, the workflow prepares a production plan for review: the hook, benefits, shot order, pacing and call to action. Visuals are grounded in verified product and brand information, with quality checks. Multilingual narration, music, branding, end cards and specification overlays are added in post-production, using authorized assets. Generation budgets, approvals and task status are recorded with the project.'),
        B('产品介绍、广告、品牌宣传片和社媒短片，都用同一套产品和品牌资料来做，横版、竖版、方版都能出；哪个镜头不行就单独重做，不用整条推倒重来。',
          'Product explainers, advertisements, brand films and social clips use the same verified product and brand context, in portrait, landscape and square formats; a failed shot can be redone on its own without regenerating the whole video.'),
      ],
      note: B('交到你手上的是能播放、能导出的视频文件，不只是一句“任务完成”；生成前可以先审制作方案，成片经人工审核后再发布，用量按你们开通的服务和额度计算。',
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
        B('上传有权使用的参考视频和自己的产品素材，先拆解开场吸引点、镜头作用、节奏、产品出场和结尾引导，再结合自己的产品、品牌和目标市场，写出原创脚本和分镜。',
          'Use an authorized reference video and your own product assets to examine the opening hook, shot purpose, pacing, product reveal and call to action. Rebuild the concept as original scripts and storyboards grounded in your product, brand and market.'),
        B('开始前记录参考素材的来源、使用权与制作目标；卖点只用你们已确认的产品事实，参考片里的说法不搬过来。',
          'Before work starts, the reference’s source, usage rights and production goal are recorded. Claims come only from your verified product facts, never from the reference video.'),
        B('从开场、场景或表达角度入手，规划三个不同的原创版本，写明每版改了什么；选定后接着做视频制作、审核和多尺寸输出，反馈也留存下来，方便以后对比。',
          'Plan three original versions, each changing the hook, scene or messaging, with the changes spelled out. The chosen version moves on to production, review and multi-format output, and feedback is kept for later comparison.'),
        B('交付内容包括结构分析、原创脚本与分镜、各版改动说明和后续制作任务；接入渠道数据后，可再比较各版表现。',
          'You receive a structural analysis, original scripts and storyboards, the declared differences between versions and the follow-on production tasks; where channel data is connected, the versions can then be compared on performance.'),
      ],
      noteLabel: B('使用边界：', 'Boundaries: '),
      note: B('这里说的“复刻”只借鉴结构，不直接复制原片画面、人脸、声音、音乐、标志或水印；参考视频必须有权使用，也不承诺一定成爆款。',
        'Adaptation borrows the structure only; it does not copy footage, faces, voices, music, logos or watermarks. Reference videos must be ones you are entitled to use, and viral performance is not guaranteed.'),
    },
    {
      id: 'creative-kits',
      title: B('商品营销套件、详情页与图册', 'Product Marketing Kits & Catalogs'),
      covers: ['AI Creative Studio'],
      body: [
        B('选好产品、目标市场、销售平台和语言，主图、卖点图、细节图、参数图、品牌展示图和配套文案一次规划好，不用一张张反复下指令。',
          'Choose the product, target market, sales platform and language, then plan hero images, benefit graphics, detail shots, specification graphics, brand visuals and supporting copy in one coordinated workflow, with fewer repeated instructions.'),
        B('同一套产品资料，还能接着做成商品详情页、宣传图册、产品介绍和销售资料；品牌标志、关键参数、价格和文字都排在便于核对的版式里，可以逐项确认。做好的内容可直接用于销售、官网、商城和社交平台。',
          'The same product facts extend into detail pages, catalogs, product introductions and sales collateral. Logos, specifications, prices and text stay in checkable, controlled layouts, ready to confirm item by item and to reuse across sales, websites, commerce and social channels.'),
      ],
      note: CREATIVE_NOTE,
    },
    {
      id: 'creative-multilingual',
      title: B('多语言文案与社媒内容', 'Multilingual & Social Content'),
      covers: ['Product · Sales · Social Content', 'Multi-language Content'],
      body: [
        B('根据已确认的产品资料、目标市场和语言，撰写社媒、产品和销售文案，并做多语言本地化；产品页、销售方案和社媒口径一致。',
          'Start from confirmed product information, target markets and languages. Write social, product and sales copy and localize it, so one product story runs through product pages, sales decks and social feeds.'),
        B('营销活动的文案和发布素材讲同一个故事，再按市场、按渠道整理成图文组合，供你审阅。',
          'Campaign copy and publishing materials are prepared around the same story and organized by market and channel into text and visuals you can review.'),
      ],
      note: creativeNotes(CREATIVE_NOTE, CREATIVE_PUBLISH),
    },
    {
      id: 'creative-search',
      title: B('官网、搜索与 AI 搜索内容', 'Website & Search Content'),
      covers: ['Search & AI-search Content'],
      body: [
        B('提供产品资料、目标市场和你在用的销售网站，就能写出官网产品页和市场页的文案，再按目标语言做本地化。',
          'Provide product information, target markets and the websites you sell through. Copy for product and market pages is prepared and localized into your target languages.'),
        B('内容按搜索引擎和 AI 搜索的阅读方式规划：结构清楚、事实可核对、说法有出处，目标是让买家更容易找到你，也让 AI 搜索准确引用；搜索排名和引用结果不作保证。交付的是内容规划和页面文案，你确认后再上线。',
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
        B('把制作需求、步骤、参考素材，以及图片、视频和音频放进同一个创意工作室；每个项目保留版本与素材库，成熟的制作流程可以直接复用。',
          'Keep briefs, production steps, references, images, video and audio in one creative workspace. Each project retains its versions and asset library, and proven production workflows can be reused.'),
        B('已有的产品视频可以剪成社媒短片，长视频拆条、竖屏改版和字幕适配也在这里完成。每次改动都留版本记录，只重做需要改的镜头或片段，不用每次从头再来。最后拿到的是带版本记录的素材库和剪好的短片。',
          'Existing product footage can be cut into short social clips, and long-video repurposing, vertical reframing and caption adaptation happen here too. Every change is versioned, so you redo only the shot or section that needs it instead of starting over. You get a versioned asset library and finished clips.'),
      ],
      note: creativeNotes(CREATIVE_NOTE, B('长视频拆条、竖屏改版和字幕适配也都支持。', 'Long-video repurposing, vertical reframing and caption adaptation are supported too.')),
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
  availability: B('使用说明', 'In practice'),
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
    summary: B('应用、文件、目标、任务和经营重点，都放在同一个工作台里。', 'Organize applications, files, goals, tasks and business priorities together.'),
    parts: [
      {
        heading: B('工作台', 'The workspace'),
        lede: B('像使用一台企业专属电脑一样，在一个网页桌面里打开业务应用、处理文件、给 AI 员工派活、连接外部账号并执行授权任务。', 'Work in a company-specific desktop where business applications, files, AI employees, connected accounts and authorized tasks share one workspace.'),
        points: [
          CP('M14-01', '多应用桌面与文件空间', 'Multi-app desktop and file workspace',
            '在桌面、任务栏和多个应用窗口里处理日常工作，文件、资料和业务入口集中在一起，少在不同网页和工具之间来回切换。',
            'Organize work through a desktop, taskbar and multiple application windows, bringing files and business entry points together with less switching between disconnected tools.'),
        ],
        availability: B('网页桌面打开即用；语音、自动化和对外操作都已开通，原生电脑客户端、移动端和小程序也已上线。', 'Runs in the browser, with voice, automation and external actions enabled. Native Windows and Mac clients, mobile apps and mini-programs are available too.'),
      },
      {
        heading: B('经营总览', 'The owner’s overview'),
        lede: B('AI 忙不忙不是重点。老板要看的是：谁在做什么、钱花在哪里、客户推进到哪一步、哪些事要自己拍板。', 'Business owners need more than busy AI employees: they need visibility into work, cost, customer progress, blockers and decisions requiring their authority.'),
        points: [
          CP('M15-01', '老板驾驶舱', 'Owner’s cockpit',
            '客户、商机、报价、订单、跟进、关键审批和异常汇总成一张经营总览；指标只取自已接入的数据，缺数据的地方明确标出。',
            'Summarize customers, opportunities, quotes, orders, follow-ups, approvals and exceptions using connected data, explicitly showing unavailable metrics.'),
          CP('M15-02', '任务总控', 'Mission Control',
            '查看目标、任务、执行步骤、负责人、等待审批、失败原因与结果，明确区分进行中、已提交、结果待核对和已验证完成。',
            'Inspect goals, tasks, steps, owners, approvals, failures and results. Distinguish work in progress, submissions, results awaiting checks and verified completion.'),
          CP('M15-03', '数字员工与协作管理', 'Workforce and teamwork management',
            '在员工总览和分工表里查看岗位、技能、任务分配、工作量、历史记录和团队交接，谁负责什么一清二楚。',
            'Use workforce overviews and team assignment views to inspect roles, skills, assignments, workload, history and handoffs, so everyone can see who is responsible for what.'),
          CP('M15-04', '控制中心', 'Control center',
            '数据同步、应用库、系统关系图、能力与应用管理、系统运行状态，统一从这里管理；控制中心只管系统，不替代日常的 AI 对话与任务入口。',
            'Bring data synchronization, the app library, the system map, capability and app management, and operating status under one management entry point. System administration remains distinct from the everyday AI work interface.'),
        ],
        outputs: B('看得见进度、管得住关键操作、查得清责任与结果。', 'Visible progress, controlled key actions, traceable ownership and outcomes.'),
        availability: B('管理与控制功能已上线；看板、自动操作和高级分析，接入你们的实际数据就能用。', 'Management and control features are live; dashboards, automated actions and advanced analytics run on your connected data.'),
      },
    ],
  },

  '02': {
    sources: ['M02'],
    summary: B('从产品和市场出发找目标客户，做好背调，排出开发优先级。', 'Research accounts and prioritize opportunities around products and markets.'),
    parts: [{
      lede: B('除了处理找上门的询盘，还会按产品、目标市场和客户画像，主动找值得开发的客户，判断有没有机会，再交给销售跟进。', 'Go beyond incoming inquiries: discover relevant companies, qualify evidence-backed opportunities and pass approved prospects into the sales process.'),
      points: [
        CP('M02-01', '全球寻找客户', 'Global prospect discovery',
          '从搜索引擎、企业官网、地图、社交平台、展会和依法授权的贸易数据里，找经销商、进口商、批发商和目标客户的线索。',
          'Find dealers, importers, wholesalers and target accounts through search, websites, maps, social channels, trade shows and lawfully authorized trade data.'),
        CP('M02-02', '市场信号与补货雷达', 'Market signals and reorder radar',
          '关注采购记录、补货周期、供应商变化、招聘、扩张和企业动态。识别采购窗口与产品组合缺口；证据不足时提示待核实，不编造需求。',
          'Assess purchase history, reorder patterns, supplier changes, hiring and expansion. Flag buying windows and portfolio gaps; where evidence is thin, mark them for checking instead of inventing demand.'),
        CP('M02-03', '客户背调与关键联系人', 'Account research and key contacts',
          '整理企业规模、地区、主营产品与渠道；查找联系人、邮箱、社交账号及采购决策人，保留来源、更新时间和身份匹配依据。',
          'Research company scale, markets, products and channels. Identify contacts, emails, social profiles and buying roles, with source, freshness and identity evidence.'),
        CP('M02-04', '商机评分与开发优先级', 'Opportunity scoring and prioritization',
          '综合产品匹配、市场适配、采购信号、联系人覆盖、风险和商业价值，给出客户画像、商机简报和开发优先级。',
          'Combine product fit, market fit, buying signals, contact coverage, risk and commercial value into account profiles, opportunity briefs and prioritized prospect lists.'),
        CP('M02-05', '开发策略与持续跟进', 'Outreach playbooks and reactivation',
          '起草多语言开发信、话术和跟进计划，用来二次开发展会线索、唤醒沉睡客户、抓老客户的补货机会，并分析开发效果。',
          'Prepare multilingual emails, messaging and follow-up plans. Support trade-show follow-up, dormant-lead reactivation, reorder opportunities and outreach-result analysis.'),
        CP('M02-06', '确认后转入 Sales Desk', 'Approved handoff into Sales Desk',
          '确认过的客户，连同来源、背调、产品兴趣和下一步任务，一起转入 Sales Desk；不用先等客户发询盘，也避免重复建档。',
          'Hand approved prospects to Sales Desk with source evidence, research, product interests and next actions, without waiting for an inbound inquiry or creating duplicate records.'),
      ],
      value: B('给老板的价值：把“业务员到处找客户”变成有目标、有证据、有优先级的客户开发。', 'Business value: replace scattered prospecting with targeted, evidence-backed and prioritized customer development.'),
      outputs: B('目标客户清单、联系人信息、商机简报、开发优先级与下一步任务。', 'Prospect lists, contact details, opportunity briefs, priorities and next actions.'),
      availability: B('数据和客户联系渠道，经你授权后接入。', 'Data and outreach channels connect with your authorization.'),
    }],
  },

  /* Channels (V5 H09 with the channel parts of M02, M03 and M07): three uses,
     and no promise that a listed platform is switched on. The full items those
     parts come from are placed in g02, g04 and g09. */
  '03': {
    sources: ['H09', 'M02', 'M03', 'M07'],
    summary: B('找客户的信息来源、沟通渠道和内容平台分开管，授权后使用。', 'Distinguish authorized research sources, conversation channels and content platforms.'),
    parts: [{
      lede: B('找客户的信息来源、与客户沟通的渠道、发布内容的平台，各司其职。STARGO WORK 把经你授权接入的信息，汇进同一套客户、销售和跟进流程。', 'Research sources, conversation channels and publishing platforms serve different purposes. Within authorized integrations, STARGO WORK connects their activity to shared customer, sales and follow-up workflows.'),
      points: [
        CP('H09-1', '发现客户', 'Discover accounts',
          '用公开搜索、企业官网、地图、社交平台、展会和依法授权的贸易数据，找经销商、进口商、批发商和目标客户，每条线索都留有来源。',
          'Search, company websites, maps, social sources, trade shows and lawfully authorized trade data help find dealers, importers, wholesalers and target accounts, with the source of each lead retained.'),
        CP('H09-2', '沟通跟进', 'Handle conversations',
          '客户沟通走企业邮件、WhatsApp、阿里国际站和网站询盘；各渠道的往来记在同一个客户名下，换人接手也能看到来龙去脉。',
          'Customer conversations run through business email, WhatsApp, Alibaba.com and website inquiries; every channel feeds one customer record, so whoever takes over sees the whole history.'),
        CP('H09-3', '内容发布', 'Publish content',
          '官网、社交平台和产品内容，都用来做品牌宣传；多语言文案和搜索内容可以提前备好，发布到外部渠道要单独授权。',
          'Website, social and product content support brand communication. Multilingual copy and search content can be prepared in advance; publishing to external channels requires separate authorization.'),
      ],
      availability: B('各渠道用你们自己的账号授权接入，收发权限由你们来定；页面列出平台名，不代表默认已开通。', 'Each channel connects through your own authorized account, with read and send permissions set by what you grant. A listed platform is not enabled by default.'),
    }],
  },

  /* Sales Desk (M03) is split across two rows: the conversation work here,
     the customer record and its continuity in g05. */
  '04': {
    sources: ['M03'],
    summary: B('读懂需求、整理附件、起草回复、持续跟进，人随时可接手。', 'Extract requirements, organize attachments, prepare replies and follow up, with people able to take over at any time.'),
    parts: [{
      lede: B('Growth OS 主动开发的客户和各渠道询盘都接到这里，客户资料、沟通、产品需求、报价和跟进状态在同一个销售流程里推进。', 'Unify outbound prospects and inbound inquiries around one customer context, from qualification and conversation to quoting, order handoff and retention.'),
      points: [
        CP('M03-01', '统一询盘与消息入口', 'Unified inquiry and message intake',
          '企业邮件、网站询盘、WhatsApp、阿里国际站等渠道的消息集中到一处，分清新询盘、历史消息、状态回执、垃圾信息和异常线索。',
          'Bring business email, website inquiries, WhatsApp and Alibaba.com messages together; separate new inquiries, earlier messages, delivery receipts, spam and unusual leads.'),
        CP('M03-02', '需求识别与附件整理', 'Reading requirements and attachments',
          '识别采购产品、规格、数量、市场、预算、交期等需求，整理客户上传的目录、表格、图片与图纸资料，并提示缺失信息。',
          'Extract products, specifications, quantities, markets, budgets and deadlines; organize catalogs, spreadsheets, images and drawings, and flag missing information.'),
        CP('M03-04', '按企业知识回复客户', 'Sales replies grounded in enterprise knowledge',
          '查询产品参数、价格政策、起订量、包装、认证、交期和贸易条款，辅助产品匹配、翻译和多语言回复；缺少已确认的资料时明确提示。',
          'Use verified product knowledge and policies for specifications, minimum order quantities, packaging, certifications, lead times, terms, product matching and multilingual replies. Flag unavailable facts.'),
        CP('M03-05', '跟进任务与人工协作', 'Follow-up tasks and human collaboration',
          '生成回复草稿、跟进策略、下一步任务和提醒；人工审批、人工接管和销售阶段管理都保留，避免几个人或几个 AI 重复联系同一个客户。',
          'Prepare drafts, follow-up strategies, tasks and reminders, with human review, takeover and pipeline management to reduce duplicate outreach by people or AI employees.'),
      ],
      outputs: B('结构化需求、产品方案、待审核回复与完整的销售跟进记录。', 'Structured requirements, product fit, review-ready replies and continuous sales history.'),
      availability: B('业务工作台已上线；各渠道接通后，就能直接收发消息、交接业务。', 'The workspace is live; once each channel is connected, you can send and receive messages and hand off work from it.'),
    }],
  },

  '05': {
    sources: ['M03'],
    summary: B('客户、联系人、商机、沟通记录、报价和后续任务集中在一处。', 'Keep customers, contacts, opportunities, history, quotes and next steps connected.'),
    parts: [{
      lede: B('CRM 是 Sales Desk 的客户底账，主动开发的客户和各渠道询盘都记在同一份客户档案里，谁接手都能看到来龙去脉。', 'CRM is the customer record behind Sales Desk: outbound prospects and inbound inquiries share one customer file, so whoever takes over has the full context.'),
      points: [
        CP('M03-03', 'CRM 与客户全景', 'CRM and a complete customer view',
          '公司、联系人、来源、标签、负责人、商机阶段、沟通记录、产品兴趣、报价和订单都在一份档案里，谁接手这个客户都能看到前因后果。',
          'Maintain companies, contacts, sources, tags, owners, opportunity stages, communication timelines, product interests, quotes and orders in a shared customer context.'),
        CP('M03-06', '从成交到售后维护', 'Continuity beyond the sale',
          '客户沟通一路连到报价、PI、订单交接、交付和售后；成交和丢单的原因、复购机会都记下来，不是消息发完就结束。',
          'Connect conversations to quotes, proforma invoices, order handoff, delivery and support, preserving win/loss context and repeat-purchase opportunities.'),
      ],
      value: B('业务主线：确认客户 → 录入 CRM → 沟通、匹配产品 → 报价 / PI → 订单交接 → 售后与复购。', 'Business flow: approved prospect → CRM → conversation and product fit → quote / PI → order handoff → support and repeat sales.'),
      outputs: B('客户档案和完整的销售跟进记录。', 'Customer records and a complete sales follow-up history.'),
      availability: B('业务工作台已上线；各渠道接通后，就能直接收发消息、交接业务。', 'The workspace is live; once each channel is connected, you can send and receive messages and hand off work from it.'),
    }],
  },

  /* The knowledge half of M12 (the relationship half is g12), and the product
     facts a quotation stands on (M04; the quotation work itself is g07). */
  '06': {
    sources: ['M12', 'M04'],
    summary: B('产品参数、价格政策、认证、模板和公司经验集中存放，回答有据可查。', 'Ground work in specifications, pricing policies, certificates, templates and company experience.'),
    parts: [{
      lede: B('知识库管的是“公司知道什么”：产品、价格政策、合同模板、制度和经验都收在这里，回答问题、执行任务都有据可查。', 'The knowledge base holds what the company knows: products, pricing policies, contract templates, internal rules and experience. Every answer and action can point to a source.'),
      points: [
        CP('M12-01', '企业知识中心', 'Enterprise knowledge center',
          '公司和产品资料（目录、参数、价格政策、认证）、销售资料（常见问题、话术、合同模板），再加上内部制度、标准流程和历史项目，都收进一个能搜的知识库。',
          'Collect company information, catalogs, specifications, pricing policies, certifications, FAQs, sales guidance, templates, policies, standard procedures and project history in a searchable knowledge base.'),
        CP('M12-02', '知识接入与有据可查的回答', 'Knowledge intake and cited answers',
          '接入文件和经授权的知识源，记录来源、版本、权限与更新时间；回答和执行时引用依据，遇到冲突或资料过期时提示核实。',
          'Ingest files and authorized sources with provenance, versions, permissions and freshness. Ground answers and actions in evidence and flag conflicts or outdated material.'),
        CP('M04-facts', '报价与回复的产品依据', 'Product facts behind quotes and replies',
          '配置、规格、包装和价格政策，都以公司确认过的资料为准；报价、PI 和销售回复用同一份产品资料，缺资料会直接提示，AI 不会自己编价格。',
          'Product configurations, specifications, packaging and pricing policies come from enterprise-approved information. Quotes, PIs and sales replies draw on the same product facts and flag gaps, so AI does not invent prices.'),
      ],
      value: B('关键原则：价格来自企业确认的数据，回答有据可查，资料冲突或过期时先核实。', 'Key principles: prices come from company-approved data, answers cite their source and conflicting or outdated material is verified before use.'),
      outputs: B('清楚该用哪一版资料，每个回答都注明出处。', 'A clear view of which version is current, with the source behind every answer.'),
      availability: B('企业知识和业务关系图已上线；高级关联和资料模板，接入资料后就能用。', 'Enterprise knowledge and the business relationship map are live; richer relationships and data templates work once your data is connected.'),
    }],
  },

  '07': {
    sources: ['M04'],
    summary: B('按规则出报价，批准过的版本和交接文件都留档。', 'Prepare quotes under business rules and keep approved versions and handoff documents on file.'),
    parts: [{
      lede: B('找价格、改表格、反复确认条款，不再东一处西一处，全部放进一条报价流程：有版本、有审批、有实际数据作依据。', 'Replace scattered price lookups, spreadsheet edits and back-and-forth on terms with one quoting workflow that has versions, approvals and real data behind it.'),
      points: [
        CP('M04-01', '产品配置与报价规则', 'Configuration and quoting rules',
          '按产品配置、数量、包装、币种和贸易条款起草报价；对照价格表、历史报价、折扣权限和利润底线，避免 AI 自行编价。',
          'Build quote drafts from product configuration, quantity, packaging, currency and trade terms, using authoritative pricebooks, history, discount permissions and margin guardrails.'),
        CP('M04-02', '报价中心', 'Quotation center',
          '报价模板、草稿、版本对比、审批和已批准的报价都在一处管理；客户改数量或配置时留下变更记录，不容易错发旧版本。',
          'Manage templates, drafts, comparisons, approvals and approved quotes. Preserve changes to quantity or configuration to reduce the risk of sending obsolete versions.'),
        CP('M04-03', 'PI 与商业确认', 'Proforma invoices and commercial confirmation',
          '报价确认后直接转成 PI，条款、金额、付款节点和批准时的版本都留档；报价批了不等于已发出，两步分开把关。',
          'Turn confirmed quotes into proforma invoices, preserving terms, amounts, payment milestones and a snapshot of the approved version. Approving a quote and sending it are controlled separately.'),
        CP('M04-04', '合同与电子签协同', 'Contracts and e-signature coordination',
          '统一管理合同模板、商务条款、版本和审批，标出前后矛盾和待确认事项；电子签走公司现有系统，法律审阅交给专业人员。',
          'Coordinate contract templates, terms, versions and approvals; flag inconsistencies and unresolved points. E-signatures go through your existing system, and legal review stays with qualified professionals.'),
        CP('M04-05', '外贸单证与资料归档', 'Trade-document preparation and filing',
          '商业发票、装箱单、原产地证及 Form E 资料、提单、认证和运输资料，统一准备、核对和归档；需要官方签发的单证，仍由相关机构办理。',
          'Prepare, check and archive commercial invoices, packing lists, certificates of origin and Form E supporting documents, bills of lading, certifications and shipping records. Official issuance remains with authorized bodies.'),
        CP('M04-06', '客户与交易风险提示', 'Counterparty and transaction-risk alerts',
          '整理客户身份、制裁或风险名单线索、HS 编码与认证要求，留存筛查依据并转人工复核；合规判断仍交给专业人员。',
          'Collect identity evidence, screening signals, HS-code references and certification materials, keep the supporting sources and escalate to human review. Compliance judgments stay with qualified professionals.'),
      ],
      value: B('关键原则：价格来自企业确认的数据，商业文件可追溯，重要承诺由人批准。', 'Key principles: prices come from company-approved data, commercial documents stay traceable and people approve major commitments.'),
      outputs: B('报价草稿、批准版本、PI、商务条款与可追溯的商业资料。', 'Quote drafts, approved versions, proforma invoices, commercial terms and traceable documents.'),
      availability: B('报价和 PI 已上线；价格、合同、签章和单证，对接你们现有的系统。报价批准了不等于已发出，发出了也不等于客户已收到。', 'Quotes and PIs are live; prices, contracts, signatures and documents connect to your existing systems. An approved quote is not yet a sent one, and a sent quote is not proof the customer received it.'),
    }],
  },

  /* ERP and commerce (M05) and delivery, collection and service (M06), under
     the three plain sub-headings V6 §5.5 names. */
  '08': {
    sources: ['M05', 'M06'],
    summary: B('ERP 和商城，加上采购、库存、生产、质检、物流、回款、出口资料和售后，都在这里一起管。', 'Covers ERP and commerce operations, plus purchasing, stock, production, quality, logistics, payment collection, export documents and support.'),
    parts: [
      {
        heading: B('ERP 经营', 'ERP & commerce'),
        lede: B('前台销售和后台经营放在同一个桌面上：既知道客户要什么，也清楚产品、物料、库存的情况和生产、订单、回款的进度。', 'Put sales and back-office operations on one desktop: see what the customer wants, and where products, materials, inventory, production, orders and payments stand.'),
        points: [
          CP('M05-01', '产品、物料与物料清单', 'Products, materials and bills of materials',
            '统一管理产品档案、规格、物料编码、物料清单和配置关系，报价、采购、生产、库存都用同一套数据。',
            'Organize product records, specifications, material codes, bills of materials and configuration relationships to support consistent quoting, procurement, production and stock coordination.'),
          CP('M05-02', '采购与供应商协同', 'Procurement and supplier coordination',
            '订单需求一路连到采购计划、供应商资料、询价、采购单和到货跟进；写入其他系统和审批流程，按公司自己的规则设置。',
            'Link order demand to purchasing plans, supplier information, sourcing, purchase orders and incoming deliveries. Writes to other systems and approval steps follow your own rules.'),
          CP('M05-03', '库存与仓储管理', 'Inventory and warehouse operations',
            '库存、仓库、出入库、物料流转和缺货信息一处查清，业务员随时知道能交多少货，缺货预警和补货也有数可依。',
            'Provide inventory, warehouse, stock-movement and shortage information so sales teams know what they can ship, with the data behind shortage alerts and replenishment.'),
          CP('M05-04', '生产、质量与交期', 'Production, quality and lead times',
            '跟踪生产任务、物料需求、进度、质检、包装和交期；生产出了异常，直接关联到对应的销售承诺和客户沟通。',
            'Coordinate production tasks, material needs, progress, quality checks, packaging and lead times, linking production exceptions to sales commitments and customer communication.'),
          CP('M05-05', '订单、开票与经营记录', 'Orders, invoicing and operating records',
            '管理订单、报价、发票、多币种商业记录与相关单据；客户需求、交易记录和履约状态一一对应，减少重复录入。',
            'Manage orders, quotes, invoices, multi-currency commercial records and supporting documents; align demand, transactions and fulfillment status to reduce duplicate entry.'),
          CP('M05-06', '商城与经销商业务', 'Commerce and dealer operations',
            '管理商品目录、销售地区、购物车、订单和商城后台；需要时可接入品牌商城和经销商门户，共享客户资源。',
            'Support catalogs, selling regions, carts, orders and commerce administration. As needed, connect brand storefronts and dealer portals and share customer resources with partners.'),
        ],
        value: B('给老板的价值：前端拿订单，后台管交付；ERP、商城和 AI 一起干活，哪类数据以哪个系统为准，一清二楚。', 'Business value: the front office wins orders and the back office delivers them. ERP, commerce and AI work together, and every type of record keeps one clear source of truth.'),
        outputs: B('能不能交、什么时候交、交付后记录是否一致，都有相应资料可以核对。', 'Records that show whether and when you can deliver, and whether everything matches after delivery.'),
        availability: B('ERP 和商城应用已上线，跨系统联动和 AI 操作也都能用。', 'ERP and commerce applications are live, and so are cross-system work and AI actions.'),
      },
      {
        heading: B('履约回款', 'Fulfillment & collections'),
        lede: B('成交只走到一半。订单、供应链、单证、收付款和客户体验，还要各部门接力跟到底。', 'Closing the sale is only the halfway point. Keep every department working together on orders, supply chain, documents, payments and customer experience.'),
        points: [
          CP('M06-01', '订单与履约节点', 'Order and fulfillment milestones',
            '从订金、生产、质检、包装、发货到客户确认，每一步都有任务、负责人和截止时间；延期、缺资料、卡在部门之间，都能及时发现。',
            'Organize deposits, production, quality checks, packaging, shipment and customer confirmation around tasks, owners and deadlines, highlighting delays, missing records and handoff blockers.'),
          CP('M06-02', '物流与运输协同', 'Logistics and shipment coordination',
            '运费询价、订舱、物流轨迹、预计到达时间和异常处理都能跟进，对接公司在用的货代、物流和订单系统。',
            'Coordinate freight quotes, bookings, tracking, estimated arrivals and exceptions through the freight-forwarding, logistics and order systems you already use.'),
          CP('M06-03', '财务与回款跟进', 'Finance and collections follow-up',
            '整理订金、尾款、应收应付、发票、对账和订单利润，按时提醒到期款项，盯住现金流和异常；付款由有审批权的人批准，AI 不会擅自付款。',
            'Organize deposits, balances, receivables, payables, invoices, reconciliation and order-margin information for reminders and exception checks. AI does not independently authorize payments.'),
          CP('M06-04', '出口与退税流程', 'Export and tax-rebate workflows',
            '管好出口资料清单、业务进度、单据一致性、审批和提醒，协助整理退税资料、配合申报；正式申报和审批仍走官方流程。',
            'Track export checklists, stages, document consistency, approvals and reminders; help prepare rebate documents and coordinate filing. Official filing and approval still go through the authorities.'),
        ],
      },
      {
        heading: B('售后复购', 'Service & repeat business'),
        points: [
          CP('M06-05', '售后、保修与备件', 'After-sales, warranty and spare parts',
            '客户问题、工单、保修、退换货、备件和处理进度统一跟进；反复出现的问题，及时补进产品资料、常见问题和销售知识库。',
            'Coordinate support cases, warranty, returns, spare parts and resolution progress. Feed recurring issues back into product information, FAQs and sales knowledge.'),
          CP('M06-06', '经销商维护与复购', 'Dealer success and repeat purchases',
            '记下每个经销商的历史订单、产品偏好、问题和跟进计划，备好销售支持资料和补货建议，唤醒沉睡客户，抓住复购机会。',
            'Keep a record of each dealer’s orders, preferences, issues and follow-up plans to support sales, replenishment suggestions, reactivation and reorders.'),
        ],
        value: B('全流程：获客 → 销售 → ERP / 履约 → 财务 → 售后复购 → 新一轮增长。', 'End to end: acquisition → sales → ERP / fulfillment → finance → support and reorders → the next round of growth.'),
        outputs: B('订单里程碑、付款提醒、资料清单、异常事项、售后记录与复购跟进。', 'Order milestones, payment reminders, document checklists, exceptions, service records and reorder follow-up.'),
        availability: B('现已可用，可接入订单、物流、财务和售后系统。正式申报、证书签发和付款，仍由有审批权的人和相关机构办理，AI 不会自己办，也不会自己批。', 'Available now, and connects to your order, logistics, finance and service systems. Official filings, certificate issuance and payments stay with approvers and the relevant authorities; AI never completes or approves them on its own.'),
      },
    ],
  },

  /* Images (M07), one-click video (M08) and viral structure adaptation (M09)
     as three separate parts: the last two are different workflows, both in
     development, and each carries its own condition beside it. */
  '09': {
    sources: ['M07', 'M08', 'M09', 'M16'],
    summary: B('AI 作图修图，出商品营销套件、详情页和图册，还能做视频和爆款结构再创作。', 'Images, marketing kits, product pages, catalogs, video projects and viral creative adaptation.'),
    parts: [
      {
        heading: B('AI 作图与品牌内容', 'AI images & brand content'),
        lede: B('AI 不只会写文案，还能按确认过的产品资料和品牌规范，做图片、详情页、图册、广告素材和多语言内容。', 'More than copywriting: produce images, product pages, catalogs, ad creative and multilingual content from verified product facts and brand rules.'),
        points: [
          CP('M07-01', 'AI 作图与图片编辑', 'AI image generation and editing',
            '用文字、产品参考图或现有素材出图、改图，白底主图、场景图、海报、卖点图和广告创意都能做。',
            'Use text, product references and existing assets in image-generation and editing workflows for white-background product shots, scene images, posters, benefit graphics and ad concepts.'),
          CP('M07-02', '一键商品营销套件', 'One-click product marketing kits',
            '给出产品、目标市场、平台和语言，一次规划好主图、卖点图、细节图、参数图、品牌展示图和配套文案，不用一张张反复下指令。',
            'Use product, market, platform and language inputs to plan hero images, benefit, detail and specification graphics, brand visuals and supporting copy in one coordinated workflow.'),
          CP('M07-03', '详情页、图册与销售资料', 'Product pages, catalogs and sales materials',
            '制作商品详情页、宣传图册、产品介绍和销售资料；品牌标志、关键参数、价格和文字都走排版，方便逐项核对。',
            'Prepare detail pages, catalogs, product introductions and sales collateral, keeping logos, specifications, prices and text in checkable, controlled layouts.'),
          CP('M07-04', '品牌与产品一致性', 'Brand and product consistency',
            '统一品牌资产、标志、配色、语气和产品事实；外观、参数或文字跟实际不符的，逐项检查、局部修正，避免素材“好看但不真实”。',
            'Apply a shared brand kit and product facts, checking and locally correcting inaccurate visuals, specifications and copy so assets do not end up attractive but misleading.'),
          CP('M07-05', '创意画布与素材管理', 'Creative canvas and asset management',
            '制作需求、步骤、参考素材、图片、视频和音频放在同一个创意工作室；保留各个版本和素材库，成熟的制作流程直接复用。',
            'Organize briefs, production steps, reference materials, images, video and audio in one creative workspace. Retain versions, an asset library and reusable production workflows.'),
          CP('M07-06', '全球营销与搜索内容', 'Global marketing and search content',
            '写官网、社媒、产品和销售文案，做多语言本地化，规划搜索引擎和 AI 搜索内容，准备营销活动和发布素材；对外发布需单独授权。',
            'Write website, social, product and sales copy and localize it into multiple languages. Plan search and AI-search content and prepare campaigns. Publishing to external channels requires separate authorization.'),
        ],
        value: B('给老板的价值：同一套产品资料，源源不断地出品牌素材，销售、官网、商城、社媒都能用。', 'Business value: turn one verified product knowledge base into reusable assets for sales, websites, commerce and social channels.'),
        outputs: B('按同一套产品和品牌规范做出的图片、文案和销售素材，版本和局部修改都有记录。', 'Images, copy and sales materials built on consistent product and brand information, with versions and local edits on record.'),
        availability: B('创意工作室已开通，商品营销套件支持一键编排和局部检查。', 'The creative workspace is live, with one-click marketing-kit production and targeted checks.'),
      },
      {
        /* The status is part of the heading (V6 §5.6); on a narrow English
           line it stays in one piece and the dot stays with the words before it
           (U+00A0). */
        heading: B('AI 一键生成视频', 'One-click video'),
        lede: B('从文案、分镜、素材、画面、配音、字幕到导出，都在一个视频项目里完成，少在几个工具之间来回切换、手工倒文件。', 'Handle script, storyboard, assets, visuals, voiceover, captions and export in one video project, with less tool-switching and fewer manual handoffs.'),
        points: [
          CP('M08-01', '输入产品与视频目标', 'Start from products and a video brief',
            '根据产品资料、参考图片、目标受众、语言、时长和画幅，策划产品介绍、广告、品牌宣传和社媒短视频。',
            'Structure product explainers, advertisements, brand videos and social clips from product facts, references, audience, language, duration and aspect ratio.'),
          CP('M08-02', 'AI 导演与分镜规划', 'AI direction and storyboarding',
            '开场怎么抓人、卖点怎么讲、镜头顺序、运镜和节奏、结尾怎么引导行动，先写成制作方案，审过再生成。',
            'Plan hooks, benefits, shot order, camera language, pacing and calls to action, giving teams a reviewable production plan before generation.'),
          CP('M08-03', '画面、镜头与素材生成', 'Visuals, shots and asset generation',
            '把图片和视频生成连起来，按项目管理镜头和产品素材；生成的内容以产品事实和品牌规范为准，出片前要过质量检查。',
            'Connect image and video generation to project-level shots and assets, grounding production in verified product and brand information with quality checks.'),
          CP('M08-04', '配音、字幕与后期制作', 'Voiceover, captions and post-production',
            '多语言旁白、字幕、音乐、品牌标志、片尾和参数标注，都在后期统一完成，只用有授权的素材。',
            'Coordinate multilingual narration, captions, music, branding, end cards and specification overlays in post-production, using only authorized assets.'),
          CP('M08-05', '项目版本与局部重做', 'Project versions and partial redos',
            '保存产品资料、参考素材、分镜、任务状态和成果版本；失败镜头可以单独重做，不必整条视频推倒重来。',
            'Retain product facts, references, storyboards, task status and output versions, and redo an individual failed shot instead of regenerating everything.'),
          CP('M08-06', '预览、导出与成本控制', 'Preview, export and cost control',
            '支持横版、竖版、方版等多种尺寸输出，记录生成预算、审批、任务状态和最终文件；只有可播放、可导出的成果才能算交付。',
            'Organize landscape, portrait and square outputs with budgets, approvals, task tracking and final files. Only a playable, exportable video counts as delivered.'),
        ],
        value: B('从一句制作需求到一条可播放、可导出的成片：脚本、分镜、画面、配音、字幕和导出在同一个项目里完成，版本与成本都有记录。', 'From a brief to a playable, exportable video: script, storyboard, visuals, voiceover, captions and export in one project, with versions and costs on record.'),
        outputs: B('产品视频、广告片、品牌宣传片和社媒短视频的成片，附制作方案、版本记录和生成成本。', 'Finished product explainers, advertisements, brand videos and social clips, with the production plan, version history and generation cost.'),
        availability: B('一键视频已上线。成片经人工审核后再发布；生成按企业开通的服务与额度计量，素材须有权使用。', 'Available. Finished videos are reviewed before they are published; generation runs within the services and credits the company enables, using assets you are entitled to use.'),
      },
      {
        heading: B('爆款结构再创作', 'Viral creative adaptation'),
        lede: B('把“这个视频为什么吸引人”拆解为可用的营销结构，再结合自己的产品、品牌与目标市场，生成新的创意版本。', 'Extract the marketing structure behind an engaging reference video, then adapt it to your own products, brand and target market.'),
        points: [
          CP('M09-01', '导入参考视频', 'Reference-video intake',
            '导入有权使用的参考视频和自家产品素材，先确认素材来源、使用权和制作目标，再做结构分析。',
            'Start with a reference video and product assets the enterprise is entitled to use, recording provenance, usage rights and production objectives.'),
          CP('M09-02', '拆解创意结构', 'Creative-structure analysis',
            '拆解开场怎么抓人、镜头作用、时长、节奏、运镜、产品何时出场、字幕怎么写、情绪怎么推进、结尾怎么引导行动；学结构，不照搬原片。',
            'Analyze hooks, shot functions, duration, pacing, camera language, reveal timing, captions, emotional progression and calls to action rather than copying the original footage.'),
          CP('M09-03', '换成自己的产品与品牌', 'Ground the concept in your own product and brand',
            '用公司确认过的产品事实、卖点和品牌素材重做创意，调整场景、市场、语言和表达；参考片里的说法，不会当成自家产品的事实。',
            'Rebuild the concept around verified product facts, benefits and brand assets, adapting scenes, markets, language and messaging without importing false claims from the reference.'),
          CP('M09-04', '一次规划三个原创版本', 'Plan three original adaptations',
            '按不同开场、场景或表达角度做三个版本，每版改了哪里都写清楚，方便比较哪种思路更好，不会得到三个说不清差别的随机结果。',
            'Create three distinct adaptations with declared changes to hooks, scenes or messaging angles, making creative comparisons deliberate rather than random.'),
          CP('M09-05', '生成、审核与多尺寸输出', 'Generate, review and prepare formats',
            '新脚本、分镜和素材直接进入视频制作流程，加上品牌和字幕，按多种尺寸导出；长视频拆条、竖屏改版和字幕适配也都能做。',
            'Pass original scripts, storyboards and assets into the video workflow for branding, captions and format exports. You can also cut long videos into clips, reframe them for vertical screens and adapt captions.'),
          CP('M09-06', '创意测试与经验积累', 'Creative testing and reusable learning',
            '保留参考结构、版本差异、制作成本和发布反馈；再结合渠道数据比较各版表现，积累公司自己能反复用的创意方法。',
            'Retain reference structures, variant differences, production cost and feedback. Compare performance using channel data and build reusable creative knowledge.'),
        ],
        value: B('这里说的“复刻”，是借鉴结构、原创改编：不照搬原片、人脸、声音、音乐、标志或水印，也不保证一定成爆款。', 'Adaptation means borrowing a structure to make original work — not copying footage, faces, voices, music, logos or watermarks. Viral performance is not guaranteed.'),
        outputs: B('参考片结构拆解、原创脚本与分镜、各版本改动点和后续制作任务。', 'A breakdown of the reference structure, original scripts and storyboards, the changes in each version and follow-up production tasks.'),
        availability: B('爆款结构再创作已上线，从拆解结构一路做到成片。参考视频须有使用权；不照搬原片，也不保证一定成爆款。', 'Available, from structural analysis through to finished production. Reference videos must be ones you are entitled to use; the reference footage is never copied, and viral performance is not guaranteed.'),
      },
    ],
  },

  /* 288 (M10) with its ten role groups, and teamwork (M11). 288 is the size
     of the role directory; the build checks the ten counts add up to it. */
  '10': {
    sources: ['M10', 'M11', 'M16'],
    summary: B('288 个 AI 员工，按任务挑人、组队、沟通和接力。', 'Pick from 288 AI employees, form teams and hand off work task by task.'),
    parts: [
      {
        heading: B('288 个专业数字岗位', '288 specialized AI roles'),
        lede: B('数字员工不只做外贸，还覆盖企业通用支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务。', 'AI employees go beyond export trade, covering enterprise support, marketing, sales, service, compliance, supply chain, finance, operations, product and engineering, and professional services.'),
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
            [B('风控与合规', 'Risk & compliance'), 20],
            [B('供应链', 'Supply chain'), 4],
            [B('财务', 'Finance'), 14],
            [B('运营', 'Operations'), 19],
            [B('产品与工程', 'Product & engineering'), 129],
            [B('专业服务', 'Professional services'), 16],
          ],
        },
        points: [
          CP('M10-01', '岗位能配置什么', 'What a role can contain',
            '可以配置职责、技能、企业知识、可用工具、权限、任务和运行记录，每个岗位分工明确，干活时清楚业务背景，也不越出权限范围。',
            'Configure responsibilities, skills, enterprise knowledge, permitted tools, access, tasks and run history so each role has a defined job, context and operating scope.'),
          CP('M10-02', '复杂任务怎样组队', 'How a team is formed',
            '按岗位、技能、知识、权限和任务难度挑选合适的员工，每人职责明确，研究、销售、产品、内容、数据各管一块。',
            'Select suitable employees by role, skills, knowledge, access and task complexity. Give members clear responsibilities across research, sales, products, content or data.'),
          CP('M10-03', '老板怎样交办工作', 'How an owner delegates',
            '提出业务目标，选择合适员工或团队，查看任务和成果，批准关键操作。需要拍板或出现异常时，随时可以由人接手。',
            'Set a business goal, choose employees or a team, inspect tasks and results, and approve key actions. People can step in whenever a judgment call is needed or something goes wrong.'),
          CP('M10-04', '工作怎样交接和管理', 'How results are handed over',
            '记下谁负责、何时截止、任务状态、结果和下一步；员工之间直接交接，各人的工作最后汇总成一份完整成果。',
            'Track responsibility, deadlines, task status, outcomes and next steps. Members hand work to each other directly, and their outputs are consolidated into a handoff-ready result.'),
        ],
        value: B('288 不是雇 288 个真人，而是一份专业岗位目录：按任务挑人、配置、派活，还能组队协作。', 'A role directory: pick, configure and assign specialized AI employees by task, and group them into teams. It is not a claim to replace 288 people.'),
        outputs: B('按任务选用的专业岗位目录，附各岗位的职责、任务、工作记录和交接成果。', 'A role directory to choose from by task, with responsibilities, tasks, work history and handoff-ready outputs.'),
        availability: B('288 是岗位目录里的岗位数，不等于替代 288 名真人；实际启用多少员工、协作规模多大、能做哪些操作，由你们的配置、预算和权限决定。', '288 is the role-directory count, not a claim to replace 288 people. How many employees are enabled, how large a team can be and what they may do depend on configuration, budget and access.'),
      },
      {
        heading: B('多个 AI 员工交流协作', 'AI employees working together'),
        lede: B('一个复杂任务可以交给多个数字员工分工完成。重点不在聊天人数，而在信息能否传递、责任是否明确、结果能否交接。', 'Assign complex work to a bounded team of digital employees. What matters is information exchange, clear ownership and reliable handoff — not the number of chat windows.'),
        points: [
          CP('M11-01', '按任务选人和组队', 'Task-based team formation',
            '根据岗位、技能、企业知识、工具权限与任务复杂度找到合适的员工，组成小团队，写明各人分工。',
            'Match roles, skills, enterprise knowledge, permitted tools and task complexity to form a focused team with explicit responsibilities.'),
          CP('M11-02', 'AI 员工之间交流信息', 'Communication between AI employees',
            '同一个任务里，员工之间可以开会话、点对点发消息、转交问题、补充信息、通报进度，不用人来回复制粘贴。',
            'Support task-focused conversations, directed messages, questions, context exchange and progress notifications to reduce manual copying between AI employees.'),
          CP('M11-03', '并行执行与结果汇总', 'Parallel work and result synthesis',
            '研究、销售、产品、内容、数据员工同时处理各自的子任务，再由统筹角色检查结果，汇总成一份交付成果。',
            'Run research, sales, product, content or data subtasks in parallel, then have a coordinating role check and combine outputs into one delivery package.'),
          CP('M11-04', '信息共享，权限不越界', 'Shared facts within permission boundaries',
            '同一个客户、产品、任务和审批状态，大家依据的是同一套信息；共享任务背景，不等于共享公司全部数据，更不会顺带拿到其他员工的权限。',
            'Use consistent customer, product, task and approval facts. Sharing context does not grant access to all enterprise data or transfer another employee’s permissions.'),
          CP('M11-05', '责任认领与持续接力', 'Ownership and durable handoffs',
            '记录任务目标、负责人、认领状态、截止时间、证据、失败原因和下一步，中途暂停、人工接管或恢复后，工作都能接着往下做。',
            'Track goals, owners, claims, deadlines, evidence, failures and next actions so work can continue through pauses, human takeover and recovery.'),
          CP('M11-06', '协作有边界，随时可叫停', 'Bounded work and stop controls',
            '协作轮数、预算和能做的操作都有上限，防止来回空转、重复执行和越权；人随时可以审批、暂停、接手和核对结果。',
            'Set limits on collaboration rounds, budgets and permitted actions to control looping discussions, duplicate work and unauthorized operations. People can always approve, pause, take over and check results.'),
        ],
        value: B('场景示例：研究员工找客户，销售员工定策略，产品员工匹配规格，创意员工做素材，统筹角色汇总后交人确认。', 'Illustrative scenario: the research AI finds accounts, the sales AI plans outreach, the product AI checks fit, the creative AI prepares assets and the coordinator pulls it all together for a person to review.'),
        outputs: B('按分工汇总的成果、成员间的交接记录和分派清楚的下一步。', 'Results consolidated by owner, a record of handoffs between members and clearly assigned next steps.'),
        availability: B('团队协作已经可以用：AI 员工能组队、互发消息、分头并行，最后汇总交付。协作轮数、预算和能做的操作都有上限，随时能叫停。对外操作，仍要审批人批准。', 'Available: employees form teams, message each other, work in parallel and deliver one consolidated result. Collaboration rounds, budgets and permitted actions are capped, and work can be stopped at any time. External actions still need an approver’s sign-off.'),
      },
    ],
  },

  /* The everyday-work half of M14; the desktop itself opens g01. */
  '11': {
    sources: ['M14'],
    summary: B('表格、报告、语音交办、授权网页操作和定时任务。', 'Spreadsheets, reports, voice requests, authorized web tasks and scheduled work.'),
    parts: [{
      lede: B('同一个网页桌面里，做表格、写报告、用语音派活、经授权操作网页、连接企业账号；重复的活儿按时间或事件自动跑。', 'One browser desktop for spreadsheets and reports, voice requests, authorized web tasks and connected business accounts, with repeat work running on schedules or event triggers.'),
      points: [
        CP('M14-02', 'AI 表格、文档与报告', 'AI-assisted spreadsheets, documents and reports',
          '整理客户清单、产品表、报价表和经营数据，协助生成文件、翻译、写总结、做报告；复杂格式直接套用模板。',
          'Organize customer lists, product tables, quote sheets and business data; assist document creation, translation, summarization and reporting, using templates for complex formats.'),
        CP('M14-03', '语音助手与语音转任务', 'Voice assistance and voice-to-task workflows',
          '用语音提需求，自动转成文字，可以对话、查知识库、建任务、跟进业务；也支持实时语音，还能用语音发起业务操作。',
          'Use speech for transcription, conversation, knowledge retrieval, task creation and follow-up. You can also talk in real time and start business actions by voice.'),
        CP('M14-04', '云端操作与网页任务', 'Authorized computer and web tasks',
          '在授权环境中搜索网页、操作后台、填写表单、上传下载和整理资料，减少重复手工操作；不绕过登录、安全验证或平台规则。',
          'Carry out authorized web research, portal work, forms, uploads, downloads and file organization to reduce repetitive manual tasks, without bypassing sign-in, security checks or platform rules.'),
        CP('M14-05', '连接企业账号与应用', 'Connect business accounts and apps',
          '按需连接邮箱、网盘、CRM、ERP 和业务平台，经你授权后开通；哪些信息能看、哪些记录能改、哪些操作要审批，都事先定好。',
          'Connect email, drives, CRM, ERP and business platforms through enterprise authorization. Define what can be read, what can be changed and which actions require approval.'),
        CP('M14-06', '自动化、同步与应用扩展', 'Automation, synchronization and extensibility',
          '重复性工作交给定时、事件触发和流程自动跑；数据同步、出错重试和应用扩展统一管理，新加的工具也能顺着现有业务流程走。',
          'Organize repetitive work with schedules, events, triggers and workflows, managing synchronization, errors, retries and application extensions around existing business processes.'),
      ],
      outputs: B('客户清单、产品表、报价表、报告、纪要、待办，还有经授权代办的例行工作。', 'Customer lists, product and quote sheets, reports, notes, tasks and authorized routine work.'),
      availability: B('网页桌面打开即用；语音、自动化、对外操作和其他终端也都已上线。', 'Runs in the browser, with voice, automation, external actions and other clients all live.'),
    }],
  },

  /* The relationship half of M12 — said as 企业业务关系与上下文, never as a
     data-model term. */
  '12': {
    sources: ['M12', 'M16'],
    summary: B('客户、产品、报价、订单、规则和负责人，一一对上。', 'Connect customers, products, quotes, orders, business rules and owners.'),
    parts: [{
      lede: B('知识库管的是“公司知道什么”；业务关系图讲清楚客户、产品、订单、规则和任务之间怎么连在一起。', 'The knowledge base captures what the company knows. A shared business relationship map explains how customers, products, orders, rules and tasks connect.'),
      points: [
        CP('M12-03', '企业业务关系图', 'Business relationship map',
          '把客户、联系人、产品、询盘、商机、报价、订单、文件、任务和员工串起来，看得清现在到哪一步、发生过什么、下一步谁来跟。',
          'Connect customers, contacts, products, inquiries, opportunities, quotes, orders, documents, tasks and employees so teams can understand relationships, current status and responsibility for next steps.'),
        CP('M12-04', '同一客户，多处记录对得上', 'Identity and cross-system relationships',
          '认出不同系统里哪些记录是同一个客户、产品或订单，保留来源和比对依据，减少重复建档、串客户和信息打架。',
          'Identify whether records in different systems refer to the same customer, product or order. Retain sources and matching evidence to reduce duplicate records, mixed customer context and conflicting information.'),
        CP('M12-05', '把业务规则放进执行过程', 'Business rules inside execution',
          '把报价权限、订单条件、负责人、审批、结果和历史决策关联起来，AI 不只知道“该做什么”，还知道“能不能做、谁来负责”。',
          'Connect pricing authority, order conditions, owners, approvals, outcomes and decision history so AI knows the next action, whether it is permitted and who owns it.'),
        /* How a new company's products, customers and rules enter this map:
           staged and reviewed first, never taken as approved on upload. */
        CP('M12-06', '企业资料模板与行业适配', 'Enterprise data templates and industry adaptation',
          '用产品、客户、规则等标准模板帮新企业接入；导入的资料先放进待审核区，审过再接入正式业务数据，不会一上传就当成已批准的事实。',
          'Use structured product, customer and rule templates for onboarding. Stage and review data before connecting authoritative sources, rather than treating uploads as automatically approved facts.'),
      ],
      value: B('老板可以这样理解：知识库是企业资料室，业务关系图把客户、产品、订单与责任联系起来。', 'The knowledge base is the company’s reference room; the relationship map connects customers, products, orders and responsibilities.'),
      outputs: B('知道是不是同一个客户、应采用哪一版资料、下一步由谁负责。', 'Clarity on whether two records are the same customer, which version is current and who owns the next step.'),
      availability: B('企业知识和业务关系图已上线，高级关联、资料模板和新企业资料接入也都能用。', 'Enterprise knowledge and the business relationship map are live, and so are richer relationships, data templates and onboarding for new companies.'),
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
        lede: B('老板真正要的，是管得住、停得下、查得清、对得上，而不是 AI 在对话里说一句“已经完成”。', 'What matters is work you can control, stop, trace and verify, not an AI message saying a task is done.'),
        points: [
          CP('M15-05', '权限、审批与数据保护', 'Permissions, approvals and data protection',
            '按企业和岗位隔离数据与工具权限，管住账号授权和敏感操作；报价、对外联系、付款等关键操作，按规则由有审批权的人批准。',
            'Separate company and role access to data and tools, control account authorization and sensitive actions, and route quotes, outreach, payments and other key actions to approvers.'),
          CP('M15-06', '操作记录、预算与结果核对', 'Activity records, budgets and result checks',
            '保留操作、审批、依据、成本和工作记录，设定用量和预算上限，核对实际执行结果；失败了就报告并停下，或转人工处理。',
            'Keep actions, approvals, evidence, costs and work records. Set usage and budget limits, check actual outcomes, and report, stop or escalate failed work.'),
        ],
        availability: B('管理与控制功能已上线；看板、自动操作和高级分析，接入你们的实际数据就能用。', 'Management and control features are live; dashboards, automated actions and advanced analytics run on your connected data.'),
      },
      {
        heading: B('交付与验收', 'Rollout and acceptance'),
        lede: B('先选择一条关键流程，准备产品、客户、知识与业务规则，连接已有账号，配置员工和审批，再拿实际案例验证。', 'Start with one key workflow. Prepare products, customers, knowledge and business rules, connect accounts, configure roles and approvals, and validate with real cases.'),
        points: [
          CP('M16-01', '平台与业务应用', 'Platform and business applications',
            '桌面、知识库、CRM、创意、ERP 和商城等应用都已上线，按你们的需要开通；跨模块的自动流程也能用。',
            'Desktop, knowledge base, CRM, creative, ERP and commerce applications are live and enabled as you need them, and cross-system workflows run too.'),
          CP('M16-02', '核心获客与销售主线', 'Growth OS and Sales Desk',
            'Growth OS 和 Sales Desk 两条核心业务流程都已上线。实际数据、客户交接、商业价格和对外联系，按你们的使用场景接通、授权后就能用。',
            'Both core workflows are live. Live data, customer handoffs, commercial prices and external outreach work once they are connected and authorized for your use cases.'),
          /* V5 writes 「原资料仍记录……验收缺口」 — an editor's reference to its
             source records. On the page it says what those records say. */
          CP('M16-03', '视频与爆款再创作', 'Video and creative adaptation',
            '一键视频与爆款结构再创作已开放，交付的是可播放、可导出的成片文件；成片经人工审核后再发布，生成按企业开通的服务与额度计量。',
            'One-click video and viral creative adaptation are available, delivering playable, exportable video files. Finished videos are reviewed before publishing, and generation runs within the services and credits the company enables.'),
          CP('M16-04', '协作、业务理解与记忆', 'Teamwork, context and memory',
            'AI 员工已经能组队、互相交流、协作交付；企业知识和业务关系图已上线，企业级主动工作、统一长期记忆和新企业资料接入也都能用。',
            'AI employees can already form teams, communicate and deliver together, and enterprise knowledge and the business relationship map are live. Enterprise-wide proactive work, unified long-term memory and new-company onboarding are available too.'),
          CP('M16-05', '高级分析与外部业务系统', 'Analytics and connected business systems',
            '高级增长分析已开通；财务、物流、签章、客户渠道和第三方数据，经你授权就能接入。正式申报、付款和专业审阅，仍由有审批权的人把关。',
            'Advanced growth analytics is available. Finance, logistics, signatures, customer channels and third-party data connect once you grant access. Authorized people retain control of filings, payments and professional reviews.'),
          CP('M16-06', '行业落地与扩展', 'Industry delivery and expansion',
            '按行业提供资料模板、流程配置、企业接入和培训，交付内容和你们一起确认。网页端打开即用，移动端和原生客户端也已上线。',
            'Industry delivery includes data templates, workflow configuration, onboarding and training, with the scope agreed with you. STARGO WORK runs in the browser, and mobile and native clients are available too.'),
        ],
        value: B('交付顺序：确认目标 → 准备资料 → 连接账号 → 配置员工与审批 → 验证成果 → 逐步扩大范围。', 'Delivery: define goals → prepare context → connect accounts → assign roles and approvals → validate results → expand scope.'),
        outputs: B('一条明确的业务流程、所需资料、责任与审批安排，以及可核对的验收结果。', 'A defined workflow, required context, clear responsibilities and approvals, and acceptance results you can check.'),
        availability: B('所有功能都已上线，按你们确认的范围配置开通，拿实际业务验收后再正式使用。', 'All features are live. Each is configured to the scope you agree on and accepted against real business cases before everyday use.'),
      },
    ],
  },

  '14': {
    sources: ['M13', 'M16'],
    summary: B('从做过的事里总结经验，改进先验证、再采用。', 'Retain useful lessons and validate improvements before adoption.'),
    parts: [{
      lede: B('这里说的“主动工作”，是指留意公司状况、盯住目标和期限、发现异常并提出下一步；它不是人的主观意识，也不是放手让 AI 自己拍板。', 'Proactive work means tracking business state, goals and deadlines, spotting exceptions and proposing next actions. It is not human consciousness or unrestricted autonomy.'),
      points: [
        CP('M13-01', '盯紧机会、风险与承诺', 'Track opportunities, risks and commitments',
          '盯住已接入的客户、订单、任务和市场信号，及时发现新机会、没回复的客户、快到期的事项、异常和还没兑现的承诺。',
          'Track connected customers, orders, tasks and market signals for opportunities, unanswered leads, approaching deadlines, exceptions and outstanding commitments.'),
        CP('M13-02', '拆解目标，建议下一步', 'Goal-driven next-best actions',
          '把“开发某市场”“推进某客户”这类目标拆成步骤，根据当前事实提出下一步；证据不够、权限不够或信息有冲突时，停下来请人拍板。',
          'Break goals such as entering a market or progressing an account into steps. Propose actions from current facts and pause for a decision when evidence or permissions are missing or facts conflict.'),
        CP('M13-03', '长期任务与定时检查', 'Durable missions and scheduled checks',
          '按事件或时间自动触发检查；任务目标、计划、待办和状态都会保存，可以暂停、恢复、接力，长期任务按计划持续运行。',
          'Trigger checks by events or schedules and preserve goals, plans, tasks and state for pause, resume and handoff. Long-running tasks keep running on schedule.'),
        CP('M13-04', '企业与客户长期记忆', 'Enterprise and customer memory',
          '分层记住客户偏好、沟通摘要、项目决策、任务结果和操作经验；每条记忆都标明来源，可以修正，也有权限控制，不会把一次猜测一直当成事实。',
          'Keep layered memory for preferences, conversation summaries, decisions, outcomes and procedures, with provenance, correction and access controls rather than permanently retaining unverified guesses.'),
        CP('M13-05', '复盘与技能持续优化', 'Reflection and skill improvement',
          '从做成和没做成的事里总结可改进的工作方法、岗位技能和业务流程，先作为候选方案，经过测试、比较和批准后再逐步采用。',
          'Extract candidates for better working methods, role skills and business processes from successes and failures. Test, compare and approve them before gradual adoption.'),
        CP('M13-06', '核对结果，保留改进与回退', 'Check results, keep improvements or roll back',
          '不只记下“做过了”，还核对结果有没有达到目标。失败了保留证据，转修复或人工处理；改进没效果，可以撤回。',
          'Verify that outcomes meet the goal, not merely that execution occurred. Retain failure evidence for recovery or human handling, and roll back ineffective changes.'),
      ],
      value: B('主动循环：发现变化 → 弄清背景 → 提出建议 → 获得批准 → 执行 → 核对结果 → 总结经验。', 'Proactive loop: sense → understand → propose → approve → act → verify → retain lessons.'),
      outputs: B('机会、期限和异常提醒，客户和任务背景记录，还有一步步攒下、验证过的做事方法。', 'Alerts on opportunities, deadlines and exceptions; retained customer and task context; validated working methods built up over time.'),
      availability: B('目标推进、受控改进、企业级主动工作和统一长期记忆都已上线；关键的事仍由人拍板。', 'Goal tracking, controlled improvement, enterprise-wide proactive work and unified long-term memory are live; people still make the key decisions.'),
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
  intro: B('每个岗位都配有职责、技能、企业知识、可用权限和工作记录。挑谁来做，不只看岗位名称，更要看这次任务需要什么、允许做什么。', 'A role needs responsibilities, skills, enterprise knowledge, permitted actions and work history. Choose specialists by what the task requires and what they are authorized to do, not by title alone.'),
  flow: B('交办业务目标 → 选择员工或团队 → 分配任务 → 查看工作成果 → 批准关键操作', 'Set the business goal → Select employees or a team → Assign work → Inspect outputs → Approve key actions'),
  unit: B('个岗位', 'roles'),
  groups: [
    { name: B('企业通用支持', 'Enterprise essentials'), count: 15 },
    { name: B('客户开发与市场', 'Customer development & marketing'), count: 50 },
    { name: B('销售', 'Sales'), count: 16 },
    { name: B('客户服务', 'Customer service'), count: 5 },
    { name: B('风控与合规', 'Risk & compliance'), count: 20 },
    { name: B('供应链', 'Supply chain'), count: 4 },
    { name: B('财务', 'Finance'), count: 14 },
    { name: B('运营', 'Operations'), count: 19 },
    { name: B('产品与工程', 'Product & engineering'), count: 129 },
    { name: B('专业服务', 'Professional services'), count: 16 },
  ],
  total: { name: B('合计', 'Total'), count: 288 },
  // M10's value line and availability line, P04's scope line.
  note: B('288 是岗位目录里的岗位数：这些专业岗位可按任务挑选、配置、派活和组队，不等于替代 288 名真人。实际启用多少员工、协作规模多大、能做哪些操作，由你们的配置、预算和权限决定。', '288 is the size of the role directory: specialized roles you select, configure, assign and team up by task. It is not a claim to replace 288 people. How many employees are enabled, how large a team can be and what they may do depend on configuration, budget and access.'),
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
    '产品是什么、客户谈到哪一步、价格用哪一版、任务归谁，把这些业务背景串起来，AI 给出的下一步才有依据。企业知识、业务关系、长期任务和工作经验，都用在日常经营上。',
    'Which product is involved? Where does the customer stand? Which price is approved? Who owns the next step? Connecting that business context gives AI a better basis for action. Knowledge, relationships, ongoing tasks and experience all feed into day-to-day operations.'),
  /* Eyebrows: the two halves of the hero line. Three items each. */
  items: [
    { group: B('理解公司', 'Knowing the company'),
      title: B('企业知识库', 'Enterprise knowledge'),
      text: B('公司的资料室：产品目录、技术参数、价格政策、认证、常见问答、合同模板、制度流程和历史项目，集中在一处，随时可查。回答注明依据，记录来源、版本、权限与更新时间；资料冲突或过期时，提示人去核实。',
        'The company’s reference room: catalogs, specifications, pricing policies, certifications, common questions, contract templates, procedures and project history in one searchable library. Answers cite their sources, with version, access and update date recorded; conflicting or outdated material is flagged for a person to check.') },
    { group: B('理解公司', 'Knowing the company'),
      title: B('业务关系图', 'Business relationship map'),
      text: B('知识库管的是“公司知道什么”；业务关系图说明客户、联系人、产品、询盘、商机、报价、订单、文件、任务和负责人怎样关联：现在到了哪一步，下一步由谁推进。报价权限、订单条件和审批规则也连在其中，AI 因此不只知道下一步做什么，还知道能不能做、由谁批准。',
        'The library holds what the company knows. The relationship map shows how customers, contacts, products, inquiries, opportunities, quotes, orders, documents, tasks and owners connect: where things stand and who moves next. Pricing authority, order conditions and approval rules are part of the map, so AI knows not only the next action but whether it is allowed and who approves it.') },
    { group: B('理解公司', 'Knowing the company'),
      title: B('同一个客户', 'One customer, every system'),
      text: B('AI 会比对邮箱、CRM、ERP 等系统里的记录，判断是不是同一个客户、产品或订单，并保留比对依据，减少重复建档、串客户和互相矛盾的信息。新导入的资料先进入待审核区，不直接当成已确认的事实。',
        'Records in email, CRM, ERP and other systems are checked for whether they describe the same customer, product or order, and the matching evidence is kept: fewer duplicates, mixed-up customers and conflicting facts. Newly imported files wait for review instead of becoming approved facts.') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('盯住机会与期限', 'Opportunities and deadlines'),
      text: B('从已接入的客户、订单、任务和市场信号里，留意新机会、没回复的客户、临近的交期、异常和待批准事项；把“开发某个市场”“推进某个客户”这样的目标拆成步骤，提出有依据的下一步，按授权推进。证据不足、权限缺失或信息冲突时，先停下来请人判断。',
        'Across connected customers, orders, tasks and market signals, it watches for new opportunities, unanswered leads, approaching deadlines, exceptions and pending approvals. Goals such as entering a market or advancing an account become steps with evidence-backed next actions, carried out within authorization. When evidence or permission is missing, or the facts conflict, it stops and asks a person.'),
      flow: B('发现变化 → 弄清背景 → 提出建议 → 获得批准 → 推进任务 → 核对结果 → 总结经验',
        'Notice a change → Understand the context → Propose an action → Get approval → Act → Check the result → Retain the lesson') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('任务不断线', 'Tasks that carry on'),
      text: B('每项任务保留目标、计划、负责人、认领状态、截止时间、证据、失败原因和下一步，按事件或时间检查进展。暂停、人工接管或恢复之后，接手的人不必从头了解背景。任务按你们配置好的规则持续运行。',
        'Each task keeps its goal, plan, owner, claim status, deadline, evidence, failure reasons and next step, with progress checked on events or on a schedule. After a pause, a human takeover or a recovery, whoever picks it up does not start from scratch. Tasks keep running under the rules you have configured.') },
    { group: B('主动推进', 'Moving work forward'),
      title: B('长期记忆', 'Long-term memory'),
      text: B('客户偏好、沟通摘要、项目决定、已办和待办事项、任务结果、做事方法，分层记下来。每条记忆都标明来源，可以修正，按权限查看，不会把一次猜测长期当成事实。',
        'Customer preferences, conversation summaries, project decisions, completed work and follow-up tasks, task outcomes and working procedures are kept in layers. Each memory shows its source, can be corrected and is visible by permission, so an unverified guess is never stored as lasting fact.') },
  ],
  noteLabel: B('开放说明', 'Availability'),
  note: B('企业知识、业务关系图、目标推进和受控改进都已上线，高级关联、资料模板、企业级主动工作、统一长期记忆和高级改进也都能用。主动工作不是人的主观意识，也不是放手让 AI 自己拍板，关键的事仍由人决定。',
    'Enterprise knowledge, the business relationship map, goal tracking and controlled improvement are live, and so are richer relationships, data templates, enterprise-wide proactive work, unified long-term memory and advanced improvement. Proactive work does not imply human consciousness or unrestricted autonomy, and people remain responsible for consequential judgment.'),
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





/* ===== a11y lane (Z15): names a sighted reader never sees =====
   The skip link is visible only while it has keyboard focus; the landmark
   labels are read by screen readers alone. */
// A11Y-START
export const A11Y = {
  skip: B('跳到正文', 'Skip to content'),
  mainNav: B('主导航', 'Main navigation'),
  pillNav: B('快捷导航', 'Quick links'),
};
// A11Y-END

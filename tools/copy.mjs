/**
 * Every word the site shows, in both languages. The system is STARGO WORK, its
 * core app is OPEN WORK (owner decision, 2026-10-09): an AI workspace for
 * export manufacturers, 288 digital employees, published pricing, public
 * contact details. Names follow buyer-plan §5: the app names are the OPEN WORK
 * sidebar's own (老板看板, 自动化中心, 客户CRM, 企业知识库, 主动获客, 销售工作台,
 * 企业ERP …), never the retired "Growth OS / Sales Desk / web desktop / AI
 * enterprise operating system" wording; tools/build-site.mjs and
 * tools/blog.mjs fail the build if that wording returns.
 *
 * Shape: B(zh, en) is a bilingual pair. Page content is read by the builders
 * in tools/ow-blocks/ (HOME_OW, PAGE_OW, SITE_OW and the fact tables they
 * point at) and by tools/chrome.mjs (NAV, CHROME, META).
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
/* 2026-10-09 (C2 pass 2, buyer-plan S0): the top bar carries what a buyer
   compares — 产品 · 安全与接入 · 定价 · 关于 — and one 【预约演示】 button
   (NAV_CTA). The wordmark is the home link; NAV[0] stays the home entry for the
   overlay menu, the footer and the articles' breadcrumb. 数字员工, 提醒与记忆
   (intelligence.html, 「主动提醒与记忆」), 博客 and 联系 are MORE: the overlay
   menu, the footer and the phone menu, at the same URLs.
   tools/fuse-ix.mjs staggers NAV.length + MORE.length + 1 overlay items (ten,
   as before). */
export const NAV = [
  { href: 'index.html', label: B('首页', 'Home') },
  { href: 'capabilities.html', label: B('产品', 'Product') },
  { href: 'enterprise.html', label: B('安全与接入', 'Security') },
  { href: 'pricing.html', label: B('定价', 'Pricing') },
  { href: 'about.html', label: B('关于', 'About') },
];
/** The one button in the top bar. */
export const NAV_CTA = { href: 'contact.html', label: B('预约演示', 'Book a demo') };
/** Utility pages: footer and legal rows only, never the product navigation. */
export const SECONDARY = [
  { href: 'privacy.html', label: B('隐私政策', 'Privacy') },
  { href: 'terms.html', label: B('使用条款', 'Terms') },
  { href: 'notices.html', label: B('第三方声明', 'Notices') },
];
/** Overlay menu, footer and phone menu, not the desktop top bar. Articles live under blog/. */
export const MORE = [
  { href: 'workforce.html', label: B('数字员工', 'AI Staff') },
  { href: 'intelligence.html', label: B('提醒与记忆', 'Reminders') },
  { href: 'blog.html', label: B('博客', 'Blog') },
  { href: 'contact.html', label: B('联系', 'Contact') },
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
     break it split 「网页」 at every width up to 1024px.
     2026-10-09: the owner retired the 「网页桌面级 AI 企业操作系统」 positioning;
     the line now says what the new homepage hero says (buyer-plan §5 standard
     sentence: STARGO WORK is the AI workspace for export manufacturers). */
  ['Crafting visuals. Shaping stories.', B('面向制造业与外贸企业的 <br/>AI 工作台。', 'The AI workspace for export manufacturers.')],
  ['Let’s create great work together!', B('把工作交给 AI，把决定权留在企业。', 'Delegate the work. Keep the authority.')],
  ['Let’s Collaborate', B('预约演示', 'Book a demo')],
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
  ['Talk to Denis', B('预约企业演示', 'Book a demo')],   // the menu card holds one line at 992-1439: the site's own CTA wording
  ['>Schedule a call<', B('>预约演示<', '>Book a demo<')],
  ['>Get in touch<', B('>联系我们<', '>Get in touch<')],
  ['>Terms of use<', B('>使用条款<', '>Terms<')],
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
  /* The homepage sells OPEN WORK since 2026-10-09 (HOME_OW); its title and
     description say what the page says. */
  'index.html': { title: B('STARGO WORK — 外贸工厂的 AI 工作台', 'STARGO WORK — The AI workspace for export manufacturers'), description: B('STARGO WORK 是外贸工厂的 AI 工作台。核心应用 OPEN WORK 像聊天一样用：分析询盘、写英文回复、出 PI、找新客户、出周报。AI 起草，你来拍板。', 'The AI workspace for export manufacturers. Its core app OPEN WORK works like a chat: analyze inquiries, draft replies and PIs, find buyers. AI drafts, you decide.') },
  /* the four product pages (C2, 2026-10-09): titles name what the page shows */
  'intelligence.html': { title: B('主动提醒与记忆', 'Proactive Reminders & Memory'), description: B('该跟进的客户，AI 先替你想起来：OPEN WORK 的记忆与进化、自动化中心盯住报价、样品和补货周期，起草跟进消息，发送前等你确认。', 'OPEN WORK remembers who to follow up. Memory & Evolution and the Automation Center watch quotes, samples and reorders, and draft follow-ups for your approval.') },
  'capabilities.html': { title: B('产品：OPEN WORK 与 15 个应用', 'Product — OPEN WORK and its 15 apps'), description: B('OPEN WORK 是 STARGO WORK 的核心应用：在对话里交代任务，AI 调用客户CRM、企业知识库等 15 个应用起草回复、报价和开发信，发出前由你批准。', 'Ask in a chat and AI works across OPEN WORK’s 15 apps, such as the Customer CRM and Knowledge Base, to draft replies, quotes and outreach that you approve.') },
  'workforce.html': { title: B('288 名数字员工', '288 AI Staff'), description: B('STARGO 数字员工在 OPEN WORK 里干活：询盘接待员、报价员、客户背调员、客户档案管家……由企业调度长按任务派工，关键动作由人批准。', 'STARGO AI staff work inside OPEN WORK: an inquiry desk, a quoter, a background checker and more, assigned by task, with key actions approved by people.') },
  /* Pricing keeps its live title and description: they are also the page's
     visible hero subtitle, and V5 P08's candidate intro needs its own
     commercial approval. */
  'pricing.html': { title: B('定价：¥10,000 / 年起', 'Pricing — from ¥10,000 a year'), description: B('标准版 ¥10,000 / 年（最多 5 个标准用户）；上线版、增长版、全球获客版含建站与内容服务，首年 ¥20,000 / ¥30,000 / ¥40,000；企业版定制。', 'Standard is ¥10,000 a year (5 accounts). Launch, Growth and Global Acquisition add website and content services at ¥20,000, ¥30,000 and ¥40,000 in year one.') },
  'enterprise.html': { title: B('安全与接入', 'Security & Setup'), description: B('写给老板和 IT：哪些动作必须由人批准、谁能看什么、每一步怎么留痕，以及 STARGO WORK 怎样逐项接入你现有的邮箱、客户记录、ERP 和文件。', 'For owners and IT: which actions need approval, who can see what, how each step is recorded, and how STARGO WORK connects to your email, CRM and ERP.') },
  'contact.html': { title: B('预约 30 分钟演示', 'Book a 30-minute demo'), description: B('用 30 分钟看 OPEN WORK 怎样分析询盘、起草英文回复和 PI，发出前由你批准；再围绕你的一条业务流程，聊资料、账号和审批。', 'See in 30 minutes how OPEN WORK analyzes an inquiry and drafts the reply and PI for your approval, then talk through one of your workflows.') },
  'notices.html': { title: B('第三方声明', 'Third-party notices'), description: B('运行时库、字体、图片素材与上游软件的许可与署名。', 'Licences and attribution for runtime libraries, fonts, imagery and upstream software.') },
  'about.html': { title: B('关于 · 从真实业务出发', 'About — Built Around Real Work'), description: B('STARGO WORK 出自真实的制造与外贸业务。核心应用 OPEN WORK 把 15 个业务应用放进一个对话，AI 起草，你来拍板。', 'STARGO WORK grew out of real manufacturing and export work. Its core app, OPEN WORK, puts 15 business apps in one chat: AI drafts, you decide.') },
  'blog.html': { title: B('业务实践与产品解读', 'Business Practice & Product Guides'), description: B('了解客户开发、销售报价、企业知识、数字员工协作与管理控制，逐步读懂 AI 如何参与企业工作。', 'Explore customer acquisition, sales, quotations, enterprise knowledge, AI teamwork and management through practical workflow explanations.') },
  'privacy.html': { title: B('隐私政策', 'Privacy policy'), description: B('本站收集什么、为什么收集、保存多久，以及你的权利。', 'What this site collects, why, for how long, and your rights.') },
  'terms.html': { title: B('使用条款', 'Terms of use'), description: B('使用本网站的条款：内容、知识产权、价格说明与责任。', 'Terms for using this website: content, intellectual property, pricing notes and liability.') },
  '404.html': { title: B('页面未找到', 'Page not found'), description: B('这个页面不存在，或已经移走。可以回到首页，或直接看产品与定价。', 'This page does not exist or has moved. Go back to the homepage, or head straight to the product and pricing.') },
};

/* ============================================================ homepage === */

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
/* ================================================== homepage (OPEN WORK) ===
   The homepage since 2026-10-09 (owner: 「图片好小…把我们系统卖出去」). The
   system is STARGO WORK, its core app OPEN WORK; the page sells the chat
   workspace with its own product renders (tools/openwork/, demo data) and
   replaces the Mono homepage's narrative sections. Read by tools/ow-blocks/.

   What may be said here, and nothing more:
   - what this file already says elsewhere and the owner approved (prices, 5
     standard accounts, one setup + one training session, approvals before
     outward actions, traceable records, who approves is the company's call,
     contact details);
   - what the OPEN WORK interface shows (app names exactly as its sidebar, the
     five quick actions, 「工具操作遵循当前授权；外部客户发送未启用。」 and the
     approval bars), and the demo data inside the renders, always as demo data.
   Everything buyer-plan.md marks 【需确认】 (reply times, pilot terms, data
   residency, channel status, account prices, what the composer footnote means
   in operation) stays off the page. No measured-sounding numbers.

   Trade terms (PI, MOQ, FOB, CRM, ERP) and the product names are the only
   Latin on the Chinese page; tools/verify-site.mjs knows them.

   [[…]] in a title marks its key phrase, which the page sets in the blue
   gradient (owner's poster style, 2026-10-09). The product's own wording,
   from the owner's latest OPEN WORK home screen: it calls itself
   「AI 外贸业务执行系统」, its tagline starts 「连接全球市场，加速业务增长。」
   (English: "From China to the World"), its quick tasks are grouped as
   主动获客 / 询盘处理 / 客户跟进 / 报价与 PI / 内容增长 / 企业知识库 /
   制造与合规, and its digital office shows 288 名数字员工. The small floating
   cards on the product windows carry interface wording or demo-safe facts
   only — never a statistic. */
const OW_WA_TEXT = B('你好，我想看 OPEN WORK 演示，我们做____', 'Hi, I’d like to see an OPEN WORK demo. We make ____');
export const HOME_OW = {
  demoLabel: B('预约 30 分钟演示', 'Book a 30-minute demo'),
  whatsappLabel: B('WhatsApp 直接问', 'Ask on WhatsApp'),
  whatsappHref: B(`${CONTACT_INFO.whatsappHref}?text=${encodeURIComponent(OW_WA_TEXT.zh)}`, `${CONTACT_INFO.whatsappHref}?text=${encodeURIComponent(OW_WA_TEXT.en)}`),
  badge: B('演示数据', 'Demo data'),
  zoom: B('放大查看', 'Enlarge'),
  /* the visible hint beside a product shot (never on top of it) */
  zoomHint: B('点图放大', 'Enlarge'),
  /* the dialog's name when it shows a shot: 「放大查看：起草报价单 · PI（演示数据）」 */
  zoomOf: B('放大查看：{label}（演示数据）', 'Enlarged screen: {label} (demo data)'),
  close: B('关闭', 'Close'),
  /* Under every OPEN WORK shot on the English page the reader is told the UI is
     Chinese; the Chinese page says what is real (the layout) and what is not. */
  shotNote: B('OPEN WORK 实际界面布局，对话内容均为演示数据。', 'OPEN WORK as it looks today, shown in Chinese. Every conversation is demo data.'),
  /* Under the screens whose right-hand app panel (客户CRM, 自动化中心, 企业ERP,
     the 数字员工 roster) was drawn for this site rather than rebuilt from an
     owner screenshot (ow08–ow11 and their cards, tools/ow-blocks/shared.mjs
     ILLUSTRATIVE), and under the blog covers: a sketch of the interface, not
     its exact look. */
  shotNoteIllustrative: B('OPEN WORK 界面示意，内容均为演示数据。', 'Illustrative OPEN WORK interface, shown in Chinese · demo data.'),
  /* the bar that takes over from the template's floating pill once the hero's
     buttons have scrolled away, and leaves when the demo band comes in */
  sticky: B('预约演示', 'Book a demo'),

  /* S1. Two names only before the picture: STARGO WORK (the system) in the
     eyebrow and OPEN WORK (the app) in the subhead; the product's own
     「AI 外贸业务执行系统」 is the window's title. */
  hero: {
    eyebrow: B('STARGO WORK · 外贸工厂的 AI 工作台', 'STARGO WORK · The AI workspace for export manufacturers'),
    window: B('OPEN WORK · AI 外贸业务执行系统', 'OPEN WORK'),
    slogan: B('连接全球市场，加速业务增长。', 'From China to the World'),
    title: [B('询盘进来，AI 先读懂、先回复、先报价。', 'Inquiries in. Replies and quotes drafted.'), B('发不发，你来批。', 'Nothing goes out until you approve.')],
    lead: B('像聊天一样用 OPEN WORK：分析询盘、写英文回复、出 PI、找新客户、给老板出周报。',
      'Use OPEN WORK like a chat: analyze inquiries, draft replies and proforma invoices (PIs), find new buyers and give the owner a weekly brief.'),
    /* The three callouts on ow02-inquiry; `hot` is the box in tools/openwork/hotspots.json they point at. */
    callouts: [
      { hot: 'crm', text: B('查了客户CRM和企业知识库', 'Checked your CRM and knowledge base') },
      { hot: 'price', text: B('按价格表算出 FOB\u00a0宁波 US$3.85', 'Priced from your price list: US$3.85 FOB\u00a0Ningbo') },
      { hot: 'approve', text: B('点「批准」才发出', 'Sent only after you approve') },
    ],
    calloutsLabel: B('这张图里 AI 做了三件事', 'What AI did in this screen'),
  },

  /* S2 — the four sentences the homepage has carried since V6 (zh unchanged). */
  pain: {
    eyebrow: B('今天的外贸部', 'Your export team today'),
    title: B('工具很多，[[靠人连接]]。', 'Plenty of tools. [[People still hold it together.]]'),
    cards: [
      { icon: 'mail', where: B('邮箱', 'Email'), text: B('询盘来了，还要重新整理', 'Every inquiry gets retyped by hand') },
      { icon: 'chat', where: B('聊天窗口', 'Chat apps'), text: B('窗口很多，客户信息分散', 'Customer chats are spread across apps') },
      { icon: 'sheet', where: B('表格', 'Spreadsheets'), text: B('客户在表格，跟进靠人记', 'Customers live in sheets; follow-up lives in memory') },
      { icon: 'box', where: B('订单后台', 'Back office'), text: B('订单在后台，销售还在追问', 'Order status sits in the back office; sales keeps asking') },
    ],
    close: B('OPEN WORK 把这四件事放进一个对话框。', 'OPEN WORK puts all four into one chat.'),
    more: B('看它怎么做', 'See how'),
  },

  /* S3 — the showcase. Each tab's lines come from the steps printed in its
     image; the numbers 1 / 2 / 3 of the three lines are pinned on the picture
     at `pins` (boxes in tools/openwork/hotspots.json). Desktop shows the chat
     column alone (`shot`, ~1.4×), phones the card (`card`). */
  showcase: {
    eyebrow: B('OPEN WORK', 'OPEN WORK'),
    title: B('[[一个对话框]]，干外贸部每天的活。', '[[One chat box]] for your export team’s daily work.'),
    lead: B('外贸部最常做的四件事。每一件，AI 都写明读了什么、做了什么；要发出去的东西，先交给你批。',
      'Four everyday jobs. For each one, AI shows what it read and what it did, and anything going out waits for you.'),
    tablist: B('四个工作场景', 'Four everyday jobs'),
    kicker: B('演示场景', 'Demo scenario'),
    labels: { read: B('读了什么', 'What it read'), did: B('AI 做了什么', 'What AI did'), approve: B('你批什么', 'What you approve') },
    pinsLabel: B('图中的 1、2、3 对应上面三行', 'The numbers on the screen match the three lines above'),
    defaultTab: 'quote',
    tabs: [
      { key: 'inquiry', icon: 'search', shot: 'ow32-inquiry-focus', card: 'ow12-inquiry-card', title: B('OPEN WORK · 分析询盘', 'OPEN WORK · Inquiry'), pins: { read: 'steps', did: 'facts', approve: 'bar' },
        label: B('分析询盘并回复', 'Analyze an inquiry and reply'),
        float: B('对外发送需要你确认', 'Sending needs your confirmation'),
        summary: B('瑞典客户要 500 只定制丝印的保温杯：AI 查客户CRM、查规格、MOQ 和交期，按价格表算出 FOB 价，写好英文回复，等你批准。',
          'A Swedish buyer wants 500 vacuum flasks with their logo: AI checks the CRM, MOQ and lead time, prices it from your price list and drafts the reply for your approval.'),
        read: B('客户原文、客户CRM，企业知识库里的规格、MOQ 和标准交期，以及价格表。', 'The buyer’s email, your customer CRM, the specs, MOQ and lead time in your knowledge base, and your price list.'),
        did: B('识别询盘要素，判断询盘质量为 A；按价格表算出 US$3.85/只 FOB 宁波；写好英文回复草稿。', 'Pulls out the key facts, rates the inquiry A, prices it at US$3.85/pc FOB Ningbo and writes the reply in English.'),
        approve: B('回复草稿。对外发送需要你确认，点「批准」后才会发出。', 'The reply. Nothing is sent to the customer until you click Approve.') },
      { key: 'quote', icon: 'file', shot: 'ow33-quote-focus', card: 'ow13-quote-card', title: B('OPEN WORK · 报价单 / PI', 'OPEN WORK · Quote / PI'), pins: { read: 'steps', did: 'pi', approve: 'bar' },
        label: B('起草报价单 · PI', 'Draft a quote or PI'),
        float: B('低于标准价 → 自动交经理审批', 'Below standard price → goes to the manager'),
        summary: B('PI 自动套公司抬头和银行信息。单价低于标准价 4.2%，自动交销售经理审批，批准前不会发给客户。',
          'The PI uses your letterhead and bank details. Its unit price is 4.2% below your standard price, so it goes to the sales manager first.'),
        read: B('客户CRM 和销售工作台里这位客户的询盘上下文，以及中英双语 PI 模板。', 'The customer and inquiry context in your CRM and Sales Workbench, and your bilingual PI template.'),
        did: B('出 PI：明细、FOB 宁波总价、付款与交期条款；价格校验发现单价低于标准价 4.2%。', 'Builds the PI (line items, FOB Ningbo total, payment and lead-time terms) and flags a unit price 4.2% below standard.'),
        approve: B('低于标准价，PI 已提交给销售经理审批；批准前不会发给客户。', 'Because it is below standard price, the PI waits for the sales manager. It is not sent before approval.') },
      { key: 'outreach', icon: 'spark', shot: 'ow34-outreach-focus', card: 'ow14-outreach-card', title: B('OPEN WORK · 主动获客', 'OPEN WORK · Prospecting'), pins: { read: 'steps', did: 'prospects', approve: 'bar' },
        label: B('主动获客 · 开发信', 'Prospect and write outreach'),
        float: B('每封开发信都要你确认才发', 'Every email waits for your OK'),
        summary: B('找 5 家北欧零售商，和客户CRM 去重、排除已有客户；开发信每封都要你确认才发。',
          'Five Nordic retailers, de-duplicated against your CRM; every email waits for your OK.'),
        read: B('主动获客按行业、地区和门店规模筛选，补全公司信号与采购联系人。', 'Prospecting filters by industry, region and store count, then adds company signals and buying contacts.'),
        did: B('按匹配度排出 5 家目标客户，与客户CRM 去重排除 2 家已有客户，起草英文开发信。', 'Ranks five target accounts by fit, drops two already in your customer CRM and drafts the English email.'),
        approve: B('每封开发信发送前，都需要你确认。', 'Every outreach email waits for your confirmation before it is sent.') },
      { key: 'brief', icon: 'chart', shot: 'ow35-brief-focus', card: 'ow15-brief-card', title: B('OPEN WORK · 本周简报', 'OPEN WORK · Weekly brief'), pins: { read: 'steps', did: 'metrics', approve: 'decisions' },
        label: B('老板看板 · 周报', 'Brief the owner weekly'),
        float: B('等你拍板的事，一屏看完', 'Your decisions, on one screen'),
        summary: B('老板问一句「这周有什么要我拍板的」，询盘、报价、赢单、待批一屏说清。',
          'Ask “what needs my decision this week?” and get inquiries, quotes, wins and approvals on one screen.'),
        read: B('老板看板里的询盘、报价、订单和回款，并按同一口径对比上周。', 'Inquiries, quotes, orders and payments from the Owner Dashboard, compared with last week on the same basis.'),
        did: B('一句话说清本周：38 封询盘从哪来、报了多少、赢了几单，并整理出 4 件等你拍板的事。', 'Sums up the week in one line (where 38 inquiries came from, how many were quoted and won) and lists four decisions for you.'),
        approve: B('需要你决定的 4 件事，其中 2 件今天到期，点一下就能去审批。', 'The four items waiting for you, two due today, each one click from review.') },
    ],
    quick: {
      line: B('点一下快捷操作，或者直接打字。选择后只填入输入框，不会自动发送。', 'Pick a shortcut or just type. Shortcuts only fill the box; nothing is sent automatically.'),
      label: B('五个快捷操作', 'The five quick actions'),
      /* the five quick actions, with the icon the interface gives each */
      actions: [[B('起草开发信', 'Draft outreach'), 'pen'], [B('分析询盘并回复', 'Analyze an inquiry and reply'), 'search'], [B('跟进客户', 'Follow up customers'), 'users'], [B('起草报价单 / PI', 'Draft a quote / PI'), 'file'], [B('整理企业资料', 'Organize company material'), 'book']],
    },
  },

  /* S4 — only what the site already claims: approval before anything goes
     out, prices from the company's price list with approval below standard,
     a record of every step. Each rule stands under a close-up of the screen
     that shows it (tools/openwork: 380 CSS px in phone type, @3x). The
     composer footnote is never explained. */
  governance: {
    eyebrow: B('审批与留痕', 'Approvals and records'),
    title: B('AI 起草，[[你来拍板]]。', 'AI drafts. [[You decide.]]'),
    lead: B('AI 可以替你查资料、算价格、写草稿；报价、对外触达这些关键动作，按企业规则由人批准。',
      'AI can look things up, price and draft. Quotes, outreach and other key steps follow your rules and need a person’s approval.'),
    rules: [
      { icon: 'shield', shot: 'ow22-approval-bar', window: B('对外发送审批', 'Send approval'), title: B('对外发送，先过你这关', 'Nothing leaves without approval'),
        text: B('每封回复、开发信和 PI 都先写成草稿，要有权人点「批准」才会发出。', 'Every reply, outreach email and PI starts as a draft. It goes out only after someone with authority clicks Approve.') },
      { icon: 'tag', shot: 'ow21-pi-check', window: B('价格校验', 'Price check'), title: B('价格按价格表，越线要审批', 'Prices come from your price list'),
        text: B('报价从企业价格表和企业知识库里取。单价低于标准价，PI 自动交销售经理审批，批准前不会发给客户。', 'Quotes use your price list and knowledge base. Anything below your standard price goes to the sales manager and is not sent before approval.') },
      { icon: 'list', shot: 'ow24-step-log', window: B('执行记录', 'Step record'), title: B('每一步都有记录', 'Every step is on record'),
        text: B('AI 写明每一步读了哪个应用、用了什么数据；谁做了什么、谁批准，都有记录。', 'AI shows which app it read and what data it used at each step. Who did what, and who approved it, is on record.') },
    ],
    cta: B('看安全与接入', 'See security & setup'),
  },

  /* S5 — three outcomes, no numbers. */
  outcomes: {
    eyebrow: B('老板最关心的三件事', 'What owners care about'),
    title: B('回得快、报得准、[[人走客户留]]。', 'Faster replies. Consistent quotes. [[Customer history stays when people leave.]]'),
    cards: [
      { icon: 'bolt', title: B('回得快', 'Faster replies'), apps: [B('客户CRM', 'Customer CRM'), B('企业知识库', 'Knowledge Base')],
        text: B('询盘进来，AI 先查齐客户和产品资料，写好带价格的英文回复草稿，等你确认。', 'When an inquiry lands, AI gathers the customer and product facts and drafts a priced reply in English, ready for you to approve.') },
      { icon: 'tag', title: B('报得准', 'Consistent quotes'), apps: [B('企业知识库', 'Knowledge Base'), B('销售工作台', 'Sales Workbench')],
        text: B('价格、MOQ、交期从企业知识库和价格表来，不靠业务员记；低于标准价，自动交经理审批。', 'Prices, MOQ and lead times come from your knowledge base and price list, not from someone’s memory. Anything below your standard price goes to a manager.') },
      { icon: 'users', title: B('人走客户留', 'Customer history stays'), apps: [B('客户CRM', 'Customer CRM'), B('销售工作台', 'Sales Workbench')],
        text: B('客户、聊天、报价都留在公司的客户CRM里。谁接手，都能从上一次往来接着跟。', 'Customers, conversations and quotes stay in the company’s customer CRM, so whoever takes over picks up from the last exchange recorded there.') },
    ],
  },

  /* S7 — the sidebar, grouped as buyer-plan S7. Names exactly as the UI. */
  apps: {
    eyebrow: B('15 个应用', '15 apps'),
    title: B('一个工作台，[[15 个应用]]。', 'One workspace, [[15 apps.]]'),
    lead: B('OPEN WORK 侧栏里的 15 个应用，AI 在对话里按需调用：查客户、查资料、出报价、看经营。',
      'The 15 apps in the OPEN WORK sidebar. AI calls on them inside the chat to look up customers, check product facts, quote and report.'),
    groups: [
      { icon: 'spark', title: B('获客与销售', 'Sales & prospecting'), line: B('找客户、接询盘，一直跟到成交。', 'Find buyers, take inquiries, follow through to the order.'),
        apps: [B('主动获客', 'Prospecting'), B('销售工作台', 'Sales Workbench'), B('客户CRM', 'Customer CRM'), B('渠道接入', 'Channel Connections')] },
      { icon: 'chart', title: B('经营', 'Operations'), line: B('订单、库存、商城和经营数据。', 'Orders, stock, your online store and the numbers.'),
        apps: [B('企业ERP', 'ERP'), B('商城后端管理', 'Store Admin'), B('增长分析', 'Growth Analytics'), B('老板看板', 'Owner Dashboard')] },
      { icon: 'flow', title: B('自动化与知识', 'Automation & knowledge'), line: B('把流程跑起来，把经验留下来。', 'Keep processes running and keep what the team learns.'),
        apps: [B('自动化中心', 'Automation Center'), B('工作流引擎', 'Workflow Engine'), B('企业知识库', 'Knowledge Base'), B('记忆与进化', 'Memory & Evolution')] },
      /* 288 is the size of the roster (workforce and pricing pages say so), not a head count of staff */
      { icon: 'gear', title: B('管理与平台', 'Admin & platform'), line: B('后台管理、有 288 名数字员工的数字办公室，以及 AI 网关。', 'Administration, the digital office with its 288 digital employees, and the AI gateway.'),
        apps: [B('控制中心', 'Control Center'), B('STARGO AI 数字办公室', 'STARGO AI Digital Office'), B('New API（AI 网关）', 'New API (AI Gateway)')] },
    ],
    /* the quick-task groups on the OPEN WORK home screen, as the product names them */
    tasksLabel: B('欢迎页的七类快速任务', 'Seven quick-task groups on the welcome page'),
    /* the product hero (phones): the welcome page's task groups above are not the
       five quick actions under the message box; this line names the second set */
    tasksActions: B('输入框下另有五个快捷操作：{list}。选择后只填入输入框，不会自动发送。', 'Under the message box sit five quick actions: {list}. Picking one only fills the box; nothing is sent automatically.'),
    tasks: [B('主动获客', 'Prospecting'), B('询盘处理', 'Inquiries'), B('客户跟进', 'Follow-up'), B('报价与 PI', 'Quotes & PI'), B('内容增长', 'Content growth'), B('企业知识库', 'Knowledge base'), B('制造与合规', 'Manufacturing & compliance')],
    cta: B('看全部功能', 'See all features'),
  },

  /* S9 — the published prices and, per level, what PRICING says it adds
     (pricing.html), nothing else. */
  pricing: {
    eyebrow: B('定价', 'Pricing'),
    title: B('[[¥10,000 / 年起]]，先跑通一条流程。', '[[From ¥10,000 a year.]] Start with one workflow.'),
    lead: B('标准版是年度软件订阅。需要官网、内容和获客服务时，再选服务包。', 'Standard is the annual software subscription. Add a website, content or acquisition package when you need one.'),
    currency: B('', 'Prices in Chinese yuan (CNY).'),
    plans: [
      { name: B('标准版', 'Standard'), price: B('¥10,000', '¥10,000'), unit: B('首年 · 按年续费', 'first year · renews yearly'),
        text: B('年度软件订阅：最多 5 个标准用户账号，配置一次、培训一次。', 'Annual software subscription: up to 5 standard user accounts, one setup and one training session.'), main: true },
      { name: B('上线版', 'Launch'), price: B('¥20,000', '¥20,000'), unit: B('首年总价', 'first-year total'), text: B('标准版 + 官网 3 个核心页面、20 个 SKU 模板页、中英文内容', 'Standard + a 3-page website, 20 SKU pages, Chinese and English content') },
      { name: B('增长版', 'Growth'), price: B('¥30,000', '¥30,000'), unit: B('首年总价', 'first-year total'), text: B('标准版 + 官网 4 个核心页面、40 个 SKU 模板页、另加 3 个语种', 'Standard + a 4-page website, 40 SKU pages, 3 more languages') },
      { name: B('全球获客版', 'Global Acquisition'), price: B('¥40,000', '¥40,000'), unit: B('首年总价', 'first-year total'), text: B('标准版 + 官网 5 个核心页面、80 个 SKU 模板页、18 种语言、三个月 AI 获客运行', 'Standard + a 5-page website, 80 SKU pages, 18 languages, 3 months of configured AI acquisition') },
      { name: B('企业版', 'Enterprise'), price: B('按需定制', 'Custom'), unit: B('', ''), text: B('多公司、多品牌、复杂审批与私有化部署', 'Multiple entities and brands, complex approvals, private deployment') },
    ],
    cta: B('看完整定价', 'See full pricing'),
  },

  /* S10 — four buyer questions, answered with established facts only; where a
     detail is not established, the answer stops at what is and offers the demo. */
  faq: {
    eyebrow: B('常见问题', 'FAQ'),
    title: B('买之前，[[你一定会问的]]。', 'What you’ll ask [[before you buy.]]'),
    more: B('还有别的问题？', 'Another question?'),
    moreLine: B('直接问我们，或者带到演示里一起看。', 'Ask us directly, or bring it to the demo.'),
    items: [
      [B('AI 会不会自己给客户发东西？', 'Will AI send anything to customers on its own?'),
        /* The approvals model only (owner-approved). How and when a message
           actually leaves (which app sends it, what the composer footnote
           「外部客户发送未启用」 means) is on the owner list, not stated here. */
        B('不会。回复、开发信和 PI 都先写成草稿，界面上写明「对外发送需要你确认」，要有权人点「批准」才会发出。报价、对外触达这些动作，也按企业设定的规则审批。演示时可以现场走一遍。',
          'No. Replies, outreach emails and PIs start as drafts. The screen says sending to a customer needs your confirmation, and nothing goes out until someone with authority clicks Approve. Quotes and outreach also follow the approval rules your company sets. We can walk through it live in the demo.')],
      [B('AI 会不会乱报价？', 'Will AI quote the wrong price?'),
        B('价格从企业价格表和企业知识库里取，每一步写明依据。单价低于标准价时，PI 会自动交给销售经理审批，批准前不会发给客户。哪些报价需要审批、由谁批准，企业自己定。',
          'Prices come from your price list and knowledge base, and each step shows its source. If a unit price is below standard, the PI goes to the sales manager and is not sent before approval. Your company decides which quotes need approval and who approves them.')],
      [B('业务员离职，客户会不会被带走？', 'If a salesperson leaves, do the customers leave too?'),
        B('客户、聊天和报价都留在公司的客户CRM和销售工作台里，谁接手都能看到之前的往来。账号和权限怎么分，演示时可以按你们的分工一起看。',
          'Customers, conversations and quotes stay in the company’s customer CRM and Sales Workbench, so whoever takes over can see the earlier exchanges recorded there. In the demo we can go through how accounts and permissions would map to your team.')],
      [B('多久能用起来？', 'How soon can we start?'),
        /* pricing.html, Standard: 「首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料」「配置一次、培训一次」 */
        B('标准版包含首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料，配置一次、培训一次。建议先跑通「询盘 → 报价」这一条：产品资料和价格表进了企业知识库，就可以开始起草。具体要多久，取决于你的资料情况，演示时可以一起评估。',
          'Standard includes an initial import of your company knowledge, FAQ and text for up to 20 SKUs, one setup session and one training session. We suggest starting with inquiry-to-quote: once your product information and price list are in the knowledge base, drafting can begin. How long that takes depends on your material; we can assess it together in the demo.')],
    ],
  },

  /* S11 — the demo band. The form is the site's own (tools/chrome.mjs formMarkup).
     Whether a demo can run on the visitor's own real inquiry is 【需确认】 in
     buyer-plan S1, so the heading promises a sample inquiry only. */
  contact: {
    eyebrow: B('预约演示', 'Book a demo'),
    title: B('用一封示例询盘，[[30 分钟看它跑一遍]]。', 'See it run on a sample inquiry [[in 30 minutes.]]'),
    lead: B('留下姓名、公司和邮箱，我们会联系你约时间。想先问问，也可以直接发 WhatsApp 或邮件。', 'Leave your name, company and email and we will get in touch to schedule it. Prefer to ask first? Message us on WhatsApp or by email.'),
    email: B('邮件', 'Email'),
    about: B('关于 STARGO', 'About STARGO'),
    /* visible labels of the demo form's fields (the same words chrome.mjs gives them as aria-label) */
    fields: { Name: B('姓名', 'Name'), 'Last-Name': B('公司', 'Company'), email: B('邮箱', 'Email') },
  },
};

/* ============================================================= pricing === */

export const PRICING = {
  panes: [
    [
      { name: B('标准版', 'Standard'), price: '¥10,000', unit: 'year', renewal: '¥10,000',
        desc: B('适合想自己把 AI 用进外贸流程的团队。', 'For teams that want to run their own AI-assisted export workflow.'),
        cta: B('咨询标准版', 'Discuss Standard'),
        items: [B('12 个月云端工作台，最多 5 个标准用户账号', 'A 12-month workspace with up to 5 standard user accounts'), B('首次导入企业知识、FAQ 与最多 20 个 SKU 的文字资料', 'Initial text import for company knowledge, FAQ and up to 20 SKUs'), B('产品、客户、询盘、匹配、报价与 CRM 流程', 'Product, customer, inquiry, matching, quotation and CRM workflows'), B('自助线索发现、公司画像、评分与写入 CRM', 'Self-service lead discovery, profiling, scoring and CRM entry'), B('年度标准 AI 额度，配置一次、培训一次', 'Standard annual AI credits, one setup session and one training session')] },
      { name: B('上线版', 'Launch'), price: '¥20,000', unit: 'first', renewal: 'ask',
        desc: B('适合需要官网和第一套外贸销售素材的制造企业。', 'For manufacturers that need a website and a first set of export sales assets.'),
        cta: B('咨询上线版', 'Discuss Launch'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 3 个核心页面与 20 个 SKU 模板页', 'A website with 3 core pages and 20 SKU template pages'), B('中英文官网内容', 'Chinese and English website content'), B('20 个 SKU 的图片内容与 10 条实拍短视频', 'An image-content set for 20 SKUs and 10 short videos'), B('基础站内 SEO、一年域名与托管、最多 3 轮修改', 'Basic on-site SEO, 1 year of domain and hosting, up to 3 revision rounds')] },
      { name: B('增长版', 'Growth'), price: '¥30,000', unit: 'first', renewal: 'ask', featured: true,
        desc: B('适合要扩产品展示、加语种、提升搜索可见度的团队。', 'For teams expanding product presentation, languages and search visibility.'),
        cta: B('咨询增长版', 'Discuss Growth'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 4 个核心页面与 40 个 SKU 模板页', 'A website with 4 core pages and 40 SKU template pages'), B('中英文，另加 3 个语种', 'Chinese and English plus 3 further languages'), B('40 个 SKU 的图片内容、20 条实拍短视频与 10 条 AI 视频', 'An image-content set for 40 SKUs, 20 short videos and 10 AI videos'), B('约定范围内的 SEO 与 GEO 内容和结构优化', 'SEO and GEO content and structure within the agreed scope')] },
    ],
    [
      { name: B('全球获客版', 'Global Acquisition'), price: '¥40,000', unit: 'first', renewal: 'ask',
        desc: B('适合再加三个月配置后 AI 获客运行的团队。', 'For teams adding three months of configured AI acquisition operation.'),
        cta: B('咨询全球获客版', 'Discuss Global'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('官网 5 个核心页面与 80 个 SKU 模板页', 'A website with 5 core pages and 80 SKU template pages'), B('官网与 SKU 文字系统翻译成 18 种语言', 'Website and SKU text in 18 system-translated languages'), B('80 个 SKU 的图片内容、50 条实拍短视频与 20 条 AI 视频', 'An image-content set for 80 SKUs, 50 short videos and 20 AI videos'), B('三个月配置后 AI 获客运行与 3 份月报', 'Three months of configured AI acquisition operation and 3 monthly reports')] },
      { name: B('企业版', 'Enterprise'), price: B('定制', 'Custom'), unit: 'none', renewal: 'custom',
        desc: B('多部门、多公司、多品牌、多账号，以及更复杂的审批与系统接入。', 'Multiple departments, companies, brands and accounts, with complex approvals and system integration.'),
        cta: B('联系企业版团队', 'Talk to us'),
        items: [B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'), B('大量数字员工与复杂审批', 'A large team of digital employees and complex approvals'), B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'), B('自定义工作流 · 专属数字员工 · 专属实施顾问', 'Custom workflows · dedicated digital employees · dedicated implementation consultant'), B('私有化部署', 'Private deployment'), B('SLA', 'SLA')] },
      { name: B('从一条流程开始', 'Start with one workflow'), price: B('演示', 'Demo'), unit: 'demo', renewal: 'demo',
        desc: B('不确定从哪里开始？告诉我们，眼下最拖效率或增长的是哪条流程。', 'Not sure where to begin? Tell us the one workflow that most affects efficiency or growth.'),
        cta: B('预约演示', 'Book a demo'),
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
    /* C2 pass 2 (2026-10-09, impl-spec C2 §4 / pricing audit P0): the chart
       showed 企业版 with a dash on every subscription line, so the dearest
       level read as having no workspace and no CRM. 企业版 now opens its items
       with the same 「含标准版年度软件订阅，另加：」 as the three packages and
       inherits 标准版 here. Listed for the owner to confirm. */
    { level: B('企业版', 'Enterprise'), from: B('标准版', 'Standard') },
  ],
  /* One recommended plan (C2 pass 2): 增长版, the first pane's pick. 全球获客版
     carried the badge too, so the page recommended two. */
  featuredBadge: B('推荐方案', 'Our recommendation'),
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
      B('大量数字员工与复杂审批', 'A large team of digital employees and complex approvals'),
      B('现有 CRM · ERP 接入与系统迁移', 'Existing CRM · ERP integration and migration'),
      B('自定义工作流 · 专属数字员工 · 专属实施顾问', 'Custom workflows · dedicated digital employees · dedicated implementation consultant'),
      B('私有化部署', 'Private deployment'),
      B('SLA', 'SLA'),
    ],
  },
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
    [B('288 名数字员工是无限使用吗？', 'Are the 288 digital employees unlimited?'), B('不是。288 说的是数字员工名册的规模。实际可用范围、在跑的任务、并发、额度和第三方服务用量，以签约配置为准。', 'No. 288 is the size of the staff directory, not a usage entitlement. Actual access, active workloads, concurrency, credits and third-party usage depend on the contracted configuration.')],
    [B('首年之后怎么算？', 'What happens after the first year?'), B('软件订阅按年续费。域名、托管与持续制作，按续费方案或第三方实际费用另算。首年建站与内容服务包，不等于每年都重复交付同样的内容量。', 'The software subscription follows its annual renewal terms. Domain, hosting and ongoing production follow the renewal proposal or the relevant third-party charges. A first-year launch package is not a promise of repeated annual content production.')],
    [B('标准版包含什么？', 'What is in Standard?'), B('12 个月云端工作台（最多 5 个标准用户）、企业知识与产品资料首次导入（最多 20 个 SKU）、询盘与 CRM、报价与人工审批、自助线索发现与写入 CRM、年度标准 AI 额度，外加配置一次、培训一次。', 'A 12-month cloud workspace (up to 5 standard users), an initial import of company knowledge and product information (up to 20 SKUs), inquiries and CRM, quotations with human approval, self-service lead discovery with CRM entry, standard annual AI credits, plus one setup session and one training session.')],
    [B('主动获客只在 ¥40,000 的方案里吗？', 'Is AI acquisition only in the ¥40,000 package?'), B('不是。标准版已经包含自助获客：线索发现、公司画像、评分、触达准备与写入 CRM。全球获客版加的是三个月配置后获客运行与 3 份月报，外加它自己的建站与内容交付。', 'No. Standard already includes self-service acquisition: lead discovery, company profiling, scoring, outreach preparation and CRM entry. Global Acquisition adds three months of configured acquisition operation and three monthly reports, alongside its website and content deliverables.')],
    [B('支持私有化部署吗？', 'Is private deployment available?'), B('企业版提供专属环境与私有化部署，面向数据、系统、合规要求更高的企业。', 'Enterprise offers a dedicated environment and private deployment for companies with stricter data, system and compliance requirements.')],
    [B('能接现有的 CRM 或 ERP 吗？', 'Can it connect to our CRM or ERP?'), B('可以。邮箱、网盘、CRM、ERP 和业务平台，按企业授权接入；哪些信息可以读取、哪些记录可以修改、哪些动作需要审批，按企业逐项确认。系统迁移在企业版里提供。', 'Yes. Email, drives, CRM, ERP and business platforms connect through enterprise authorization; what can be read, what can be changed and what needs approval is confirmed for each company. Migration is part of Enterprise.')],
    [B('模型费用包含在内吗？', 'Are model costs included?'), B('平台能力与模型 / API / 第三方服务用量分开计。各方案额度不同，超出部分按实际用量计费。', 'Platform capability and model / API / third-party usage are separate; each plan carries its own allowance, with overage billed on use.')],
    [B('培训和实施怎么做？', 'How are training and implementation done?'), B('标准版含一次配置与一次基础培训。企业版配专属实施顾问，把真实流程直接反馈进平台。', 'Standard includes one setup session and one basic training session. Enterprise comes with a dedicated implementation consultant who feeds real workflows straight back into the product.')],
    [B('我们该从哪一级开始？', 'Which level should we start at?'), B('从一条流程开始。挑现在最耗时间、最拖增长的那项工作，先跑通，再决定需要哪一级。', 'Start with one workflow. Pick the work that costs the most time or growth, get it running, then decide which level you need.')],
    [B('多公司、多品牌怎么办？', 'What about multiple companies or brands?'), B('多部门、多公司、多品牌、多账号，属于企业版：权限、审批、数据边界各自独立，共用同一支数字员工队伍。', 'Multiple departments, companies, brands and accounts belong to Enterprise: separate permissions, approvals and data boundaries on one shared team of digital employees.')],
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
  approach: [
    B('01 选择一条业务：定目标与验收标准。', '01 Choose one workflow: set the goal and acceptance criteria.'),
    B('02 准备企业资料：产品、客户、知识与规则。', '02 Prepare company context: products, customers, knowledge and rules.'),
    B('03 连接授权账号：可读、可改、需审批，逐项说清。', '03 Connect authorized accounts: what may be read, changed or needs approval.'),
    B('04 配置员工与审批：谁来做，谁来批。', '04 Configure roles and approvals: who does the work, who signs off.'),
    B('05 验证实际成果：用真实样本核对结果。', '05 Validate actual results against real cases.'),
    B('06 再扩大范围：跑通一条，再定下一条。', '06 Expand the scope: prove one workflow, then choose the next.'),
  ],
  cards: [
    { name: B('能力与应用管理', 'Capability & app management'), role: B('(企业开通了什么、哪些工作可做、哪些仍需配置，用量与预算上限多少)', '(Enabled applications, available work, missing setup, usage and budget limits)') },
    { name: B('账号与岗位权限', 'Account & role permissions'), role: B('(明确谁可以查看资料，谁可以修改记录)', '(Who may read information, and who may change records)') },
    { name: B('关键动作审批', 'Approval of key actions'), role: B('(报价、对外触达和重要承诺，由有权人确认)', '(Quotations, outreach and important commitments go to authorized reviewers)') },
    { name: B('工作与结果记录', 'Work & result records'), role: B('(做过什么、谁批准、实际结果是否符合要求；出错即停，可转人工)', '(Actions, approvals and whether actual outcomes meet the requirement; failures stop and pass to a person)') },
    { name: B('账号连接与保护', 'Linked accounts & protection'), role: B('(通过企业授权连接业务账号，不向不必要的岗位开放访问)', '(Business accounts connected through authorization, with no access for roles that do not need it)') },
  ],
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
    caption: B('(经你授权接入 · 逐项确认)', '(Connected with your authorization · confirmed item by item)'), title: B('业务连接', 'Connections'),
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
   the capability page's blocks look an entry up by (CAPABILITY_SHOWCASE picks,
   CAP_V6A rows, tools/blocks/qx-news.mjs PICKS): rename one only together with
   those. Since V7 the names are business language in both languages — no
   platform brands and no internal module names (Quote Studio, Audit Ledger …);
   a trade channel the site names elsewhere (WhatsApp, Alibaba.com / 阿里国际站)
   may stay, and the English name says what the Chinese one says. */
const I = (name, zhName, zh, en) => [name, B(zh ?? '', en ?? zh ?? ''), zhName ?? name];
export const CAPABILITY_GROUPS = [
  G('01', 'Workspace & Business Overview', '工作空间与经营总览', [I('Business overview', '企业经营总览', '公司现在在做什么，一屏看完', 'What the business is doing right now, on one screen'), I('Command Center', '企业 AI 指挥中心', '目标交下去，盯着它走完', 'Hand a goal down and watch it carried out'), I('Cloud Workspace', '云端企业工作台', '人和数字员工共用的云端工作台', 'The cloud workspace your team and its digital employees share'), I('Task Control', '数字员工与长任务运行中心', '盯住长时间运行的工作，需要时插手', 'Watch long-running work and step in when needed'), I('Execution View', '任务执行过程', '数字员工做过什么，逐步回放', 'Replay what a digital employee did, step by step'), I('System Map', '系统关系图', '业务记录与各系统之间如何关联', 'How business records and systems connect to each other'), I('App Library', '企业 AI 应用库', '企业为各团队开通的内部应用', 'The internal apps a company turns on for its teams'), I('Multi-task Workspace', '多任务工作空间', '几件事同时开着，各自不丢进度', 'Several tasks open at once, without losing place'), I('Mobile Companion', '移动办公与任务管理', '离开工位也能跟进度、处理审批；移动端范围演示时确认', 'Progress and approvals away from the desk; mobile scope is confirmed in the demo'), I('Notification Center', '企业通知', '什么变了，什么在等你', 'What changed, and what is waiting on you'), I('Approval Center', '审批中心', '所有待决事项排在同一个队列里', 'Every pending decision in one queue'), I('Voice Console', '语音指挥 AI', '用语音提需求、建任务，按已开通的服务使用', 'Speak a request or create a task, where voice services are enabled')]),
  G('02', 'Customer Acquisition & Opportunity Research', '主动获客与商机判断', [I('Prospecting', '主动获客', '从市场信号到确认后的客户，再交给销售工作台', 'From market signals to approved prospects handed to the Sales Workbench'), I('Trade Signal Accounts', '贸易信号与商机线索', '观察到的贸易活动，沉淀成可跟进的客户', 'Turns observed trade activity into workable accounts'), I('Importer Reorder Radar', '进口商补货雷达', '判断哪些进口商快到补货窗口', 'Estimates which importers may be due to reorder'), I('Competitor Customer Graph', '竞争对手客户图谱', '依据可用的贸易记录，看谁在向同类供应商采购', 'Uses available trade records to see who buys from comparable suppliers'), I('Buying Committee Intelligence', '决策链识别', '谁拍板、谁影响、谁签字', 'Who decides, who influences and who signs'), I('Dealer Opportunity Discovery', '经销商机会发现', '找出产品线正缺你这一块的经销商', 'Finds distributors whose range has a gap you fill'), I('Map-Based Dealer Discovery', '地图经销商发现', '按区域找经销商与分销商', 'Finds distributors and resellers by territory'), I('Opportunity Decisions', '机会决策', '建议跟进、搁置还是放弃，并给出理由', 'Recommends pursue, park or drop, with the reason'), I('Dealer Opportunity Brief', '经销商机会简报', '为何接触这家经销商，一页说清', 'A one-page case for approaching a distributor'), I('Outreach Playbooks', '销售打法生成', '针对这个客户和市场定打法', 'Builds the approach for this account and market'), I('Six-Factor Opportunity Scoring', '六因子机会评分', '按产品、市场、采购信号、联系人、风险与价值六项排序', 'Ranks accounts on product fit, market fit, buying signals, contacts, risk and value'), I('Account Research', '客户研究', '收集企业证据，注明出处', 'Collects company evidence and cites where it came from'), I('Trade Intelligence', '贸易情报', '从现有贸易记录读出需求与走向', 'Reads available trade records for demand and direction'), I('Website AI Sales Engineer', '官网 AI 销售工程师', '官网上回答产品问题，同时留住线索', 'Answers product questions on your site and captures the lead'), I('Dormant Lead Reactivation', '沉睡客户再激活', '给沉睡客户一个重新开口的理由', 'Brings quiet accounts back with a reason to talk'), I('Trade Show Afterburner', '展会线索持续转化', '一叠名片，排成有日期的跟进计划', 'Turns a stack of badges into scheduled follow-up'), I('CRM Automatic Lead Creation', '确认客户写入 CRM', '确认后的客户写入 CRM 并指定负责人，避免重复建档', 'Records the approved account in CRM with an owner, without duplicates'), I('Attribution & Growth Analytics', '结果归因与增长分析', '哪些动作带来了询盘和订单；高级分析按资源配置开放', 'Which actions led to inquiries and orders; advanced analytics depend on resources')]),
  G('03', 'Market Channels & Account Discovery', '市场渠道与客户发现', [I('Community Demand Scouting', '社区需求侦察', '在买家提问的社区里被找到', 'Be found in the communities where buyers ask questions'), I('AI Search Visibility', 'AI 搜索时代的可见性', 'AI 搜索时代，内容能被搜到、被引用', 'Content that search engines and AI answers can find and cite'), I('Decision-Maker Outreach', '企业决策人触达', '在决策人活跃的职业平台，经授权后触达', 'Reaches decision-makers on professional networks, with authorization'), I('Social Demand Signals', '社交需求信号', '读你所在品类的社交需求信号', 'Reads social demand signals in your categories'), I('Alibaba.com Inquiry Intake', '阿里国际站询盘接入', '询盘落到同一条客户时间线', 'Inquiries land on the customer record'), I('Video Channel Signals', '视频渠道信号', '买家在搜什么、看什么', 'Tracks what buyers search and watch in your category'), I('WhatsApp Sales', '即时沟通销售', '许多海外买家常用的即时沟通渠道，经授权接入', 'The messaging channel many overseas buyers use, connected with authorization'), I('Email B2B', '邮件开发与跟进', '邮件触达与后续跟进', 'Email outreach and follow-up'), I('Marketplace Connections', '电商平台接入', '平台商品与消息，汇入同一条客户记录', 'Connects marketplace listings and messages to one customer record'), I('New Channel Connections', '新渠道接入', '新渠道接入同一套客户与销售流程', 'New channels join the same customer and sales workflow')]),
  G('04', 'Inquiries & Customer Conversations', '询盘与多渠道沟通', [I('Unified Inbox', '统一收件箱', '各渠道汇入同一队列，客户已对应好', 'Every channel lands in one queue with the customer attached'), I('Email Inquiry Processing', '邮件询盘处理', '读来信，直接打开对应客户记录', 'Reads an inbound email and opens the right customer record'), I('Alibaba.com Inquiry Handling', '阿里国际站询盘处理', '和其他渠道的询盘按同一套流程处理', 'Handled in the same steps as inquiries from other channels'), I('Website Conversation', '官网会话', '官网对话，沉淀为合格询盘', 'Turns a site chat into a qualified inquiry'), I('Conversation Center', '会话中心', '跨渠道的对话集中在一处', 'One place for the conversations across channels'), I('Inquiry Intent Detection', '询盘意图识别', '分清真实采购需求与噪音', 'Separates a real buying request from noise'), I('Spam / Scam Detection', '垃圾与诈骗识别', '假询盘挡在销售队列之外', 'Keeps fake inquiries out of the sales queue'), I('Buyer Requirement Extraction', '买方需求提取', '从自由文本里提取产品、参数、数量与条款', 'Pulls product, spec, quantity and terms out of free text'), I('Company Background Research', '公司背景研究', '回复之前，先核实对方是谁', 'Checks who is asking before you answer'), I('Customer Risk Signals', '客户风险信号', '付款、合规、可信度的疑点，尽早标出', 'Flags payment, compliance and credibility concerns early'), I('Product Matching', '产品匹配', '把提出的需求匹配到已审核产品', 'Matches the stated requirement to approved products'), I('Knowledge-Grounded Reply', '基于企业知识的回复', '依据企业已审核资料起草答复', 'Drafts the answer from approved company sources'), I('Multilingual Reply', '多语言回复', '用买家的语言回复，依据同一份资料', 'Replies in the buyer’s language from the same source material'), I('Human Approval & Escalation', '人工审批与升级', '敏感承诺交给有权限的人', 'Sensitive commitments go to the person allowed to decide'), I('Planned Follow-up', '计划内跟进', '没有回音时，按批准的计划准备下一次触达', 'Prepares the next planned touch, within approved rules, when nothing comes back'), I('Customer Timeline', '客户时间线', '说过什么、发过什么，按时间排成一条', 'One chronological record of everything said and sent')]),
  G('05', 'CRM & Customer Context', '客户CRM 与客户档案', [I('Customer CRM', '客户与商机记录', '客户、机会与负责人的那本账', 'The record of customers, opportunities and owners'), I('Account Overview', '客户档案', '这个客户的已知信息，一屏看全', 'Everything known about the account on one screen'), I('Customer Workspace', '客户工作间', '每个客户一个工作区，人与数字员工共用', 'A shared workspace per customer for people and digital employees'), I('Contact & Opportunity Management', '联系人与商机管理', '联系人、机会及各自进展', 'Contacts, opportunities and where each one stands'), I('Lead Scoring', '线索评分', '把值得打电话的客户排到最前面', 'Puts the accounts worth calling at the top of the list'), I('Product Interests · Quote History · Order History', '产品兴趣 · 报价历史 · 订单历史', '问过什么、报过什么价、实际买了什么', 'What they asked for, were quoted and actually bought'), I('Customer Tasks & Follow-up Plan', '客户任务与跟进计划', '下次触达、日期、责任人', 'The next touch, its date and who owes it'), I('Decision-Maker Mapping', '决策人映射', '记下谁决策、谁影响、谁签字', 'Records who decides, who influences and who signs'), I('Customer Evidence', '客户证据', '每条判断都留出处', 'Keeps the source behind every claim on the record'), I('CRM Automation', 'CRM 记录维护', '负责人、阶段与下一步按规则更新，少一些手工录入', 'Updates owners, stages and next actions by rule, with less manual entry')]),
  G('06', 'Products & Enterprise Knowledge', '产品与企业知识', [I('Enterprise Brain', '企业大脑', '企业已审核的答案，集中在一处', 'The approved company answer, in one place'), I('Knowledge Center', '知识中心', '已审核的企业答案，在这里保持最新', 'Where approved company answers are kept current'), I('Knowledge Intake', '资料导入', '文档和文件，沉淀成可引用的知识', 'Turns documents and files into answerable knowledge'), I('Knowledge Retrieval', '知识检索', '找出能回答这个问题的那一段', 'Finds the passage that answers the question'), I('Source Retrieval', '原文检索', '取回答案所依据的原文', 'Retrieves the passage an answer is based on'), I('Drive & Document Access', '网盘与文档接入', '直接读团队现有文档，不用先迁移', 'Reads existing team documents without a migration'), I('Product Intelligence', '产品智能', '规格、选配与限制，AI 能据此推理', 'Specifications, options and constraints AI can reason over'), I('Product Center & Library', '产品中心与产品库', '整条流程共用的同一份产品记录', 'One product record the whole workflow reads'), I('Specifications & Images', '产品参数与图片', '买家会追问的那些技术细节', 'The technical detail a buyer asks for'), I('Historical Knowledge & Business Rules', '历史知识与业务规则', '公司以前定过、现在仍然算数的规矩', 'What the company has decided before, and still applies'), I('Evidence Retrieval', '证据检索', '给出答案，附上支撑文档', 'Returns the supporting document with the answer'), I('Source-Grounded Answers', '有据可查的回答', '缺少审核过的来源时明确提示，不编造答案', 'Flags the gap instead of answering without an approved source')]),
  G('07', 'Quotations, PI & Commercial Records', '报价、PI 与商业文件', [I('Quotation Center', '报价中心', '报价从询盘开始，不从空表格开始', 'Builds the quotation from the inquiry, not a blank sheet'), I('Inquiry → Quote', '询盘到报价', '需求直接落成带价格的草稿', 'Carries the request straight into a priced draft'), I('Product Configuration & Quantity', '产品配置与数量计算', '报的到底是什么，数量多少', 'What exactly is being priced, and how many'), I('Commercial Terms', '贸易条件', '套用约定的付款、交期与质保条款', 'Applies the agreed payment, delivery and warranty terms'), I('Pricing Rules', '价格规则', '按你配置的规则定价，不靠猜', 'Prices from your configured rules, not from guesswork'), I('Margin Guardrails', '利润护栏', '报价越过利润线，没人批就过不了', 'Stops a quote crossing the margin line without approval'), I('Historical Price Context', '历史价格参考', '这个买家、这个市场，以前成交价多少', 'Shows what this buyer and market paid before'), I('Approval Workflow', '审批流程', '例外转给有权拍板的人', 'Routes the exception to the person allowed to decide'), I('Quote Versioning', '报价版本', '每一版都留存，改动也留痕', 'Keeps every version and what changed between them'), I('PI Center', '形式发票中心', '批准的报价转成形式发票，发送另行确认', 'Turns the approved quote into a pro forma invoice; sending is a separate step')]),
  G('08', 'ERP, Orders & Fulfillment', 'ERP、订单与履约', [I('Order Management', '订单管理', '从批准的报价一路跟到交付', 'Tracks the order from approved quote to delivery'), I('Trade Fulfillment Follow-up', '外贸履约跟进', '批准的商务条件，带进履约环节', 'Carries approved commercial detail into fulfillment'), I('Payment Milestones', '付款节点', '定金、尾款，以及还差什么没到', 'Tracks deposits, balances and what is still outstanding'), I('Production Status & QC', '生产进度与质检', '货在哪一步，检验过没过', 'Where the goods are, and whether they passed'), I('Packaging & Shipment', '包装与出货', '怎么装运，随货走哪些东西', 'How it ships, and what travels with it'), I('Commercial Invoice · Packing List', '商业发票 · 装箱单', '按批准的订单数据生成，待人复核', 'Prepared from approved order data, ready for review'), I('Certificate of Origin · Form E', '原产地证 · Form E', '整理申请材料；签发仍归主管机构', 'Organizes the application material; issuance stays with the authority'), I('Bill of Lading Workflow', '提单流程', '运输单据跟着货走', 'Keeps shipping documents moving with the shipment'), I('Certification & Battery Documentation', '认证与电池资料', '认证与电池相关材料按目的国备齐', 'Certification and battery files prepared for the destination market'), I('Export Documentation & Workflow', '出口单证与流程', '出口单据从准备到复核的整条链', 'Export documents, from preparation to review'), I('Export Tax Rebate', '六阶段出口退税流程', '按六个阶段整理退税资料、跟踪进度；申报与受理归主管部门', 'Tracks rebate preparation through six stages; filing and acceptance stay with the authorities'), I('CBU / SKD / CKD Workflow Support', '整车 / 半散件 / 全散件流程', '整车、半散件、全散件的装运资料分别整理', 'Keeps built-up, semi- and fully-knocked-down shipments documented separately')]),
  G('09', 'AI Images, Video & Marketing', 'AI 图片、视频与营销', [I('AI Creative Studio', 'AI 创意工作室', '围绕真实产品，组织产品页所需的图片与销售素材', 'Organizes the images and sales material a product page needs, from real product facts'), I('Content Creation & Global Website Content', '内容生产与全球官网内容', '为你的目标销售站点写产品与市场文案', 'Product and market copy for the sites you sell on'), I('Search & AI-search Content', '搜索优化 · AI 搜索可信内容', '内容结构化，既能被搜到，也能被引用', 'Content structured to be found and to be quoted'), I('Multi-language Content', '多语言内容', '同一个产品故事，覆盖目标市场', 'The same product story across your target markets'), I('Product · Sales · Social Content', '产品 · 销售 · 社交内容', '同一个产品故事，贯通页面、方案与社媒', 'One product story across page, deck and feed'), I('AI Image & Video Workflow', 'AI 图片与视频流程', '按可复用的流程产出产品图片与营销视频', 'Product visuals and marketing videos produced to a repeatable workflow'), I('Viral Structure Adaptation', '爆款结构再创作', '借鉴有效视频的结构，为你的产品做原创改编', 'Adapts a proven video structure into original work for your product'), I('Viral Video Structure · Scene · Speech · Product Analysis', '爆款结构 · 场景 · 语音 · 产品分析', '拆解有效视频的开场、节奏与表达', 'Breaks down a working video’s hook, pacing and messaging'), I('Short-form Clip Editing', '剪辑与短视频', '把产品素材剪成社媒短片，按已开放的能力使用', 'Cuts product footage into short social clips, where the capability is enabled')]),
  G('10', 'AI Workforce & Teamwork', '数字员工与团队协作', [I('288 Digital Employees', '288 名数字员工', '按岗位分工的数字员工名册，按任务选用', 'A roster organized by job, chosen per task'), I('AI Employee Roster', '数字员工名册', '谁在岗，各自负责什么', 'Who is available, and what each one is for'), I('Workforce Panel', '员工面板', '派活、看进度、复核交回来的结果', 'Assign work, watch progress, review what came back'), I('AI Teams & Collaboration', '动态组队与多数字员工协作', '一个目标，几个专业岗位分工协作，而不是一次问答', 'Several specialists on one goal, not a single chat reply'), I('AI Employee Communication', '数字员工间交流', '员工之间直接发消息、提问与交接，少一些人工转述', 'Employees message each other, ask questions and hand over work, with less relaying by people'), I('Role · Skills · Tools · Memory', '岗位 · 技能 · 工具 · 记忆', '每个员工做什么、懂什么、能用什么、记得什么', 'What an employee does, knows, may use and remembers'), I('Shared Enterprise Context', '共享企业上下文', '同一份业务事实，按各自权限使用', 'One set of business facts, used within each role’s permissions'), I('Task Delegation · Handoff · Parallel Execution', '任务委派 · 交接 · 并行执行', '任务拆开、在岗位间流转、并行推进', 'Work splits, moves between roles and runs at once'), I('Scheduled Work', '定时工作', '按时跑的例行研究与跟进', 'Recurring research and follow-up that runs on time'), I('Evidence & Human Approval', '执行证据与人工审批', '审批人拍板前看的那份记录', 'The record an approver reads before deciding')]),
  G('11', 'Automation & Everyday Work', '自动化与日常办公', [I('AI Employee Setup', '数字员工工作环境', '为每个数字员工配好工具、划定边界', 'Where a digital employee gets its tools and limits'), I('Workflow Automation', '工作流自动化', '跨应用把步骤连起来，不用写代码', 'Connects steps across apps without custom code'), I('Scheduled Data Jobs', '数据整理与定期作业', '流程需要的数据整理与定期处理', 'Runs the data preparation and routine jobs a workflow needs'), I('Long-Horizon Control', '长任务控制', '长时间任务保留目标与进度，可暂停、恢复和接力', 'Keeps long-running work on its goal, with pause, resume and handoff'), I('Browser Automation', '浏览器自动化', '在授权范围内操作网页工具，不绕过登录与安全验证', 'Works web tools within authorization, without bypassing sign-in or security checks'), I('Screen Operation', '界面操作', '无法对接时，在授权环境中操作界面', 'Operates an interface in an authorized environment when integration is not available'), I('Scheduled Routines · Event-Triggered Workflows', '定时例程 · 事件触发', '按时间跑，或在业务状态变化时跑', 'Runs on a clock, or when the business state changes'), I('Approved Actions & Tool Connections', '授权动作与工具连接', '数字员工获准使用的业务动作与工具', 'The business actions and tools a digital employee is allowed to use'), I('External Connectors', '外部系统连接', '对接团队已在用的系统', 'Reaches the systems your team already runs'), I('Sign-in Safekeeping', '登录凭据保管', '账号密码统一保管，不交给数字员工直接查看', 'Holds the logins so digital employees never see them directly')]),
  G('12', 'Business Relationships & Context', '企业业务关系与上下文', [I('Business Relationship Map', '企业业务关系图', '客户、报价、订单与责任对应起来，AI 据此推进工作', 'Links customers, quotes, orders and owners so AI works from the same picture'), I('Cross-system Identity', '跨系统身份', '同一个客户，在各个系统里都对得上', 'The same customer across every connected system'), I('Customer, Product, Inquiry & Opportunity Records', '客户 · 产品 · 询盘 · 商机记录', '商务一侧的业务记录', 'The commercial side of the business, as records'), I('Quote, Order, Document & Task Records', '报价 · 订单 · 文件 · 任务记录', '执行这一侧，仍挂回同一个客户', 'The execution side, linked back to the customer'), I('AI Employee & Market Signal Records', '数字员工 · 市场信号记录', '谁做的，由什么触发', 'Who did the work, and what prompted it'), I('Relationships, Permitted Actions & Business Rules', '业务关系 · 可做的动作 · 业务规则', '记录之间如何关联，允许做哪些动作', 'How your records connect and what may be done to them'), I('Enterprise Context', '企业上下文', '数字员工动手前先读的企业状态', 'The company state a digital employee reads before acting'), I('Operational Records', '经营记录', '经营记录保存在哪里，以哪一份为准', 'Where operating records are kept, and which copy is authoritative')]),
  G('13', 'Permissions, Approvals & Control', '权限、审批与经营控制', [I('Human-in-the-Loop', '人在回路', '明确哪些决定仍须由人来做', 'Names the decisions a person must still make'), I('Key Action Approval', '关键动作审批', '待决事项集中一处，等各自的负责人', 'One place where pending decisions wait for their owner'), I('Capability & App Management', '能力与应用管理', '数字员工能调用什么，以谁的名义', 'What digital employees are allowed to use, and on whose behalf'), I('Permission Control · Identity', '权限控制 · 身份', '谁能看什么、能做什么', 'Who can see what, and who can do what'), I('Identity Check', '身份校验', '数字员工动作之前，先验身份', 'Checks identity before any digital employee acts'), I('Activity Records · AI Employee Evidence · Action History', '操作记录 · 数字员工证据 · 动作历史', '做了什么、哪个数字员工做的、凭谁的授权', 'What was done, by which digital employee, on whose authority'), I('Guardrails', '护栏', '数字员工自己越不过的边界', 'Boundaries a digital employee cannot cross on its own'), I('Company Data Separation', '企业数据隔离', '按公司和品牌分开的数据边界', 'Separate data boundaries per company and brand'), I('Failure Handling · Rollback', '失败处理 · 回滚', '出错时停下来、退回去', 'Stops on an error and puts things back'), I('Work Visibility', '执行可见', '数字员工正在做什么，看得见', 'See what digital employees are doing while they do it')]),
  G('14', 'Retained Experience & Improvement', '长期经验与持续改进', [I('Improvement Review', '改进复核台', '候选改进在这里复核、发布', 'Where proposed improvements are reviewed and released'), I('Work Observation', '执行观察', '观察真实执行，记录发生了什么', 'Watches real execution and records what happened'), I('Outcome Review', '结果复盘', '记录下的结果，沉淀成候选改进', 'Turns recorded outcomes into candidate improvements'), I('Skill Refinement', '技能优化', '按实测结果改进一项技能', 'Improves a skill against measured results'), I('Pre-release Testing', '发布前测试', '发布前先测试，再专门找它的漏洞', 'Tests a change, and looks for its weak points, before release'), I('Change Approval', '改进审批', '未经评测和批准，改动发不出去', 'No change ships without evaluation and approval'), I('Attempts · Outcomes · Scores', '过程 · 结果 · 评分', '试了什么、结果如何、评分多少', 'What was attempted, what resulted, how it scored'), I('Skill Library · Trials', '技能库 · 试验', '候选技能存放和试验的地方', 'Where a proposed skill is kept and tried out'), I('Side-by-side Trials · Staged Release · Rollback', '新旧对比 · 小范围试用 · 回退', '先在小范围试，留下或回滚', 'Test a change on a slice, keep it or take it back'), I('Continuous Improvement', '持续改进', '执行结果经过复核，再用来改进下一次', 'Reviewed results feed into the next run')]),
];

export const CAPABILITIES = {
  /* Four slots, four V5 questions that belong on the capability page: how it
     differs from a chat window (F12), the systems a company already has (F11),
     what is available now (F13) and where to start (F10). */
  faq: [
    [B('它和单独使用一个 AI 聊天窗口有什么区别？', 'How is this different from using a standalone AI chat?'), B('重点不在对话形式，而在任务是否连接了企业资料、客户历史、业务应用、责任、审批和结果。STARGO WORK 围绕完整业务流程组织这些信息与工作，而不把一次文字回答当作业务已经完成。', 'The focus is not the chat format. It is whether the work connects enterprise information, customer history, business applications, ownership, approvals and results. STARGO WORK organizes those elements around a business workflow rather than equating a text answer with completed work.')],
    [B('现有 CRM、ERP、邮箱和网盘都要换掉吗？', 'Must we replace our current CRM, ERP, email and drives?'), B('不必先假定全部替换。STARGO WORK 的方向是把现有业务账号和资料连接到同一工作空间。具体保留、接入或调整哪些系统，需要结合企业当前软件和权限逐项确认。', 'A complete replacement should not be assumed. STARGO WORK aims to connect existing accounts and information in one workspace. Which systems are retained, integrated or adjusted depends on the enterprise’s software and access permissions.')],
    [B('所有渠道和全部功能现在都能直接用吗？', 'Is every channel and feature immediately available?'), B('不能仅凭功能介绍这样判断。部分已有应用基础，部分需要企业账号和真实数据接入，企业级主动工作和统一长期记忆等仍在完善。演示与交付应逐项确认，不把能打开页面当作完整流程已经验收。', 'A capability description is not proof of availability. Some applications have foundations, some require enterprise accounts and live data, and enterprise-wide proactive work and unified long-term memory continue to evolve. Confirm each delivery scope and validate the workflow, not just page access.')],
    [B('企业应该从哪里开始？', 'Where should an enterprise start?'), B('先选一条最重要的业务流程，准备产品、客户、知识和规则，连接授权账号，安排数字员工与审批，再用真实样本验证成果。跑通后再扩大范围，而不是第一天就改造全部部门。', 'Choose one priority workflow. Prepare product, customer, knowledge and policy context, connect authorized accounts, assign roles and approvals, then validate real cases. Expand after that first workflow is proven useful.')],
  ],
};

/* ============================================================= contact === */

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
<p>本站图片分三类。一，产品界面示意：OPEN WORK 界面的演示渲染图（对话主栏按实际界面布局重建，右侧客户CRM、自动化中心、企业ERP 与数字员工面板为示意），画面中的对话、任务、客户、公司名与金额均为演示数据，不是真实客户账户的截图，也不代表已完成的业务结果；博客封面由同一批渲染图制作。二，概念视觉：菜单里的业务场景图像为 AI 生成，只用于烘托气氛，不是产品截图或员工肖像。三，模板素材：图标与装饰图形来自网站所有者购买的 Webflow 模板随附的已授权设计素材，已镜像到本站自托管。STARGO 标识与字标为 STARGO 自有作品。</p>
<h4>上游软件</h4>
<p>Activepieces、Chatwoot、Twenty CRM、WeKnora、Windmill、Playwright、Yente / OpenSanctions、Univer、Puter、Medusa、ERPNext、PostHog、Microsoft SkillOpt、Notion、Google、Reddit、LinkedIn、Facebook、YouTube、Alibaba、WhatsApp 等名称，均为各自所有者的商标或项目名。在这里列出，是为了让上游身份和相应许可可查，不表示相关项目对 STARGO 的背书。</p>
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
<p>The pictures on this site fall into three kinds. First, illustrative product interfaces: renders of OPEN WORK (the chat column rebuilds the real layout; the Customer CRM, Automation Center, ERP and AI staff panels beside it are illustrations), whose conversations, tasks, customers, company names and amounts are demonstration data — they are not screenshots of a real customer’s account and do not show completed business results; the blog covers are made from the same renders. Second, conceptual visuals: the business scenes in the menu are AI-generated and set a mood only; they are not product screens or employee portraits. Third, template assets: the icons and decorative graphics are licensed design assets shipped with the Webflow templates the site owner purchased, mirrored and self-hosted here. The STARGO mark and wordmark are STARGO’s own work.</p>
<h4>Upstream software</h4>
<p>Activepieces, Chatwoot, Twenty CRM, WeKnora, Windmill, Playwright, Yente / OpenSanctions, Univer, Puter, Medusa, ERPNext, PostHog, Microsoft SkillOpt, Notion, Google, Reddit, LinkedIn, Facebook, YouTube, Alibaba, WhatsApp and other names listed here are trademarks or project names of their respective owners. They are listed so that upstream identity and the applicable licences stay discoverable; none implies endorsement of STARGO.</p>
<h4>Contact</h4>
<p>STARGO WORK · Liuzhou, Guangxi, China · ${CONTACT_INFO.email} · WhatsApp ${CONTACT_INFO.whatsapp} · ${CONTACT_INFO.site}</p>`),
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
<p>STARGO 标识、字标、产品名称（含 STARGO WORK 与 OPEN WORK）以及本站的文字、界面图与品牌视觉，均归 STARGO 所有。未经书面许可，不得复制、改编或用于商业用途。本站使用的第三方模板、库与字体，其许可见「第三方声明」。</p>
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
<p>The STARGO mark, wordmark and product names (including STARGO WORK and OPEN WORK), together with the text, interface images and brand visuals on this site, belong to STARGO. They may not be copied, adapted or used commercially without written permission. Third-party templates, libraries and fonts used by the site are licensed as described in the Notices page.</p>
<h4>Third-party names</h4>
<p>Other company, product and project names mentioned on this site belong to their respective owners. They appear to explain compatibility or origin and imply no endorsement of STARGO.</p>
<h4>Limitation of liability</h4>
<p>The site is provided as is. To the extent the law allows, STARGO is not liable for indirect loss arising from use of the site or reliance on its content. The site may change or be interrupted at any time without notice.</p>
<h4>Governing law</h4>
<p>These terms are governed by the laws of the People’s Republic of China. Disputes fall under the jurisdiction of the competent people’s court at STARGO’s seat.</p>
<h4>Contact</h4>
<p>Questions about these terms: sales@stargomoto.com · WhatsApp +86 187 7512 7878.</p>`),
  },
};

/* =============================================================== about === */

/* The About page (V5 P06, V6 §9). Its opening card — tools/blocks/cn-about.mjs
   — has one paragraph and no heading, so it reads `title`, a line break, `desc`
   and `closing` as one statement: the headline, what the product is built
   around, and the way to start, right above the demo button. The three
   principles have no slot on the page (the Lifelogx values row is no longer
   drawn); they are kept here, in V5's words, for the day one is.
   Nothing here is company history, an award, a customer count or a backer, and
   nothing names a contracting entity. */
export const ABOUT = {
  button: { label: B('预约演示', 'Book a demo'), href: 'contact.html' },
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
};


/* ===== capability catalogue detail (#g01–#g14, #atlas) ===== */
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
  register: B('目录条目', 'Register entries'),
};

export const CATALOGUE_DETAIL = {
  '01': {
    sources: ['M14', 'M15'],
    summary: B('应用、文件、目标、任务与经营重点，在同一个工作空间组织。', 'Organize applications, files, goals, tasks and business priorities together.'),
    parts: [
      {
        heading: B('工作空间', 'The workspace'),
        lede: B('在 OPEN WORK 的对话里交办任务，AI 按需打开业务应用、处理文件、调用数字员工、连接外部账号并执行授权任务。', 'Hand work over in the OPEN WORK chat: AI opens the business apps it needs, handles files, calls on digital employees, connects accounts and carries out authorized tasks.'),
        points: [
          CP('M14-01', '多应用工作空间与文件', 'Multi-app workspace and files',
            '在一个对话里调用多个业务应用和文件，统一资料和业务入口，减少在不同网页与工具之间反复切换。',
            'Work across several business apps and files from one chat, bringing information and entry points together with less switching between disconnected tools.'),
        ],
      },
      {
        heading: B('经营总览', 'The owner’s overview'),
        lede: B('老板需要看到的不只是「AI 很忙」，而是谁在做什么、钱花在哪里、客户推进到哪一步、哪里需要自己决定。', 'Business owners need more than busy digital employees: they need visibility into work, cost, customer progress, blockers and decisions requiring their authority.'),
        points: [
          CP('M15-01', '老板看板', 'Business-owner cockpit',
            '汇总客户、商机、报价、订单、跟进、关键审批和异常，形成经营概览；指标只能来自已接入数据，缺失时明确显示。',
            'Summarize customers, opportunities, quotations, orders, follow-ups, approvals and exceptions using connected data, explicitly showing unavailable metrics.'),
          CP('M15-02', '任务总控', 'Task control and execution visibility',
            '查看目标、任务、执行步骤、负责人、等待审批、失败原因与结果，明确区分进行中、已提交、结果待核对和已验证完成。',
            'Inspect goals, tasks, steps, owners, approvals, failures and results. Distinguish work in progress, submissions, results awaiting checks and verified completion.'),
          CP('M15-03', '数字员工与协作管理', 'Workforce and teamwork management',
            '通过员工总览和协作分工表查看岗位、技能、任务分配、负载、历史与团队交接，让数字团队有可理解的分工和记录。',
            'Use workforce overviews and team assignment views to inspect roles, skills, assignments, workload, history and handoffs, making team responsibilities understandable.'),
          CP('M15-04', '控制中心', 'One control center',
            '统一数据同步、应用库、系统关系图、能力与应用管理、系统运行状态等管理入口；控制中心管理系统，不替代日常的 AI 对话与任务入口。',
            'Bring data synchronization, the app library, the system map, capability and app management, and operating status under one management entry point. System administration remains distinct from the everyday AI work interface.'),
        ],
        outputs: B('看得见进度、管得住关键动作、查得清责任与结果。', 'Visible progress, controlled decisions, and traceable ownership and outcomes.'),
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
        CP('M02-06', '确认后转入销售工作台', 'Approved handoff into the Sales Workbench',
          '将确认过的客户连同来源、背调、产品兴趣与下一步任务交给销售工作台，不必先等客户发来询盘，也避免重复建档。',
          'Hand approved prospects to the Sales Workbench with source evidence, research, product interests and next actions, without waiting for an inbound inquiry or creating duplicate records.'),
      ],
      value: B('给老板的价值：把「业务员到处找客户」变成有目标、有证据、有优先级的客户开发。', 'Business value: replace scattered prospecting with targeted, evidence-backed and prioritized customer development.'),
      outputs: B('目标客户清单、联系人信息、商机简报、开发优先级与下一步任务。', 'Prospect lists, contact details, opportunity briefs, priorities and next actions.'),
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
    }],
  },

  /* Sales Desk (M03) is split across two rows: the conversation work here,
     the customer record and its continuity in g05. */
  '04': {
    sources: ['M03'],
    summary: B('理解需求、整理附件、辅助回复、跟进并保留人工接管。', 'Extract requirements, organize attachments, prepare replies and retain human handoff.'),
    parts: [{
      lede: B('承接主动获客找到的客户与各渠道询盘，让客户资料、沟通、产品需求、报价和跟进状态围绕同一条销售链协同。', 'Unify outbound prospects and inbound inquiries around one customer context, from qualification and conversation to quotation, order handoff and retention.'),
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
          'Prepare drafts, follow-up strategies, tasks and reminders, with human review, takeover and pipeline management to reduce duplicate outreach by people or digital employees.'),
      ],
      outputs: B('结构化需求、产品方案、待审核回复与连续的销售跟进记录。', 'Structured requirements, product fit, review-ready replies and continuous sales history.'),
    }],
  },

  '05': {
    sources: ['M03'],
    summary: B('统一客户、联系人、商机、历史沟通、报价和后续任务。', 'Keep customers, contacts, opportunities, history, quotations and next steps connected.'),
    parts: [{
      lede: B('客户CRM 是销售工作台的客户底账：主动开发的客户与各渠道询盘落在同一份客户档案里，接手的人有完整上下文。', 'The Customer CRM is the record behind the Sales Workbench: outbound prospects and inbound inquiries share one customer file, so whoever takes over has the full context.'),
      points: [
        CP('M03-03', '客户CRM 与客户档案', 'CRM and a complete customer view',
          '统一公司、联系人、来源、标签、负责人、商机阶段、沟通时间线、产品兴趣、报价和订单记录，让接手客户时有完整上下文。',
          'Maintain companies, contacts, sources, tags, owners, opportunity stages, communication timelines, product interests, quotes and orders in a shared customer context.'),
        CP('M03-06', '贯穿成交与后续维护', 'Continuity beyond the sale',
          '将客户沟通连接到报价、PI、订单交接、交付和售后，持续沉淀成交原因、未成交原因与复购机会，而不是发完消息就结束。',
          'Connect conversations to quotes, proforma invoices, order handoff, delivery and support, preserving win/loss context and repeat-purchase opportunities.'),
      ],
      value: B('业务主线：客户确认 → CRM → 沟通与产品匹配 → 报价 / PI → 订单交接 → 售后与复购。', 'Business flow: approved prospect → CRM → conversation and product fit → quote / PI → order handoff → support and repeat sales.'),
      outputs: B('客户档案与连续的销售跟进记录。', 'Customer records and continuous sales history.'),
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
        CP('M04-02', '报价中心', 'Quotation center',
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
        lede: B('把销售前端与企业经营后台放到同一个工作台：不仅知道客户要什么，也要知道产品、物料、库存、生产、订单与收款在哪里。', 'Bring sales and the back office into one workspace, connecting demand with products, materials, inventory, production, orders and commercial records.'),
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
      },
      {
        heading: B('履约回款', 'Delivery & collection'),
        lede: B('成交只是中间节点。围绕订单、供应链、单证、资金节点和客户体验，扩展跨部门协作，让回款、售后和复购都有记录可查。', 'A sale is a milestone, not the endpoint. Extend coordination across orders, supply chains, documents, payment milestones and customer experience.'),
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
      },
    ],
  },

  /* 288 (M10) with its ten role groups, and teamwork (M11). 288 is the size
     of the roster; the build checks the ten counts add up to it. */
  '10': {
    sources: ['M10', 'M11', 'M16'],
    summary: B('288 名数字员工，围绕任务选人、组队、交流与接力。', 'Select, team up and coordinate 288 digital employees around shared tasks.'),
    parts: [
      {
        heading: B('288 名数字员工', '288 digital employees'),
        lede: B('数字员工不仅服务外贸，也覆盖企业支持、市场、销售、客服、合规、供应链、财务、运营、产品工程与专业服务。', 'Digital employees cover enterprise support, marketing, sales, service, compliance, supply chain, finance, operations, product and engineering, and professional services.'),
        roles: {
          total: 288,
          caption: B('十类职能与数量（数字员工名册）', 'Ten function groups and their size (staff roster)'),
          head: [B('职能类别', 'Function group'), B('数量', 'Digital employees')],
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
        value: B('不是「雇用 288 个真人」，而是拥有可按任务选择、配置、派工并组队协作的数字员工名册。', 'This is a directory of professional AI roles for task-based selection, configuration, delegation and teamwork, not a claim to replace 288 people.'),
        outputs: B('可按任务选用的数字员工目录，以及职责、任务、工作记录与交接成果。', 'A task-selectable roster of digital employees with responsibilities, tasks, work history and handoff-ready outputs.'),
      },
      {
        heading: B('多个数字员工交流协作', 'Digital employees working together'),
        lede: B('一个复杂任务可以交给多个数字员工分工完成。重点不在聊天人数，而在信息能否传递、责任是否明确、结果能否交接。', 'Assign complex work to a bounded team of digital employees. What matters is information exchange, clear ownership and reliable handoff — not the number of chat windows.'),
        points: [
          CP('M11-01', '按任务选人和组队', 'Task-based team formation',
            '根据岗位、技能、企业知识、工具权限与任务复杂度查找合适员工，形成小型团队，并说明各成员职责。',
            'Match roles, skills, enterprise knowledge, permitted tools and task complexity to form a focused team with explicit responsibilities.'),
          CP('M11-02', '数字员工之间交流信息', 'Communication between digital employees',
            '围绕任务支持协作会话、定向消息、问题转交、补充信息与进度通知，减少所有信息都必须由人手工复制的情况。',
            'Support task-focused conversations, directed messages, questions, context exchange and progress notifications to reduce manual copying between digital employees.'),
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
      },
    ],
  },

  /* The everyday-work half of M14; the desktop itself opens g01. */
  '11': {
    sources: ['M14'],
    summary: B('表格、报告、语音、授权网页任务与定时工作。', 'Spreadsheets, reports, voice, authorized web tasks and scheduled work.'),
    parts: [{
      lede: B('在同一个对话里整理表格与报告、用语音交办、执行授权的网页任务、连接企业账号，并把重复工作排进定时或事件触发的流程。', 'In the same chat: spreadsheets and reports, voice requests, authorized web tasks, connected business accounts, and repeat work organized into scheduled or event-triggered workflows.'),
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
      },
      {
        heading: B('开通范围与验收', 'What is enabled, and how it is accepted'),
        lede: B('先选择一条关键流程，准备产品、客户、知识与业务规则，连接已有账号，配置员工和审批，再用真实样本验证。', 'Start with one key workflow. Prepare products, customers, knowledge and business rules, connect accounts, configure roles and approvals, and validate real cases.'),
        points: [
          CP('M16-01', '平台与业务应用', 'Platform and business applications',
            '客户CRM、企业知识库、企业ERP、创意与商城等应用已有基础，按企业配置启用。能打开某个应用，不等于所有跨应用的自动工作都已验收。',
            'Customer CRM, Knowledge Base, ERP, creative and commerce apps have established foundations and are enabled by configuration. Opening an app does not prove every cross-app workflow is production-ready.'),
          CP('M16-02', '核心获客与销售主线', 'Prospecting and Sales Workbench',
            '主动获客与销售工作台的流程可以在演示里完整走一遍。真实数据、客户交接、商业价格和对外触达，要接入你公司的账号和系统，经你授权后才会使用，演示时逐项确认。',
            'Prospecting and the Sales Workbench can be walked through end to end in a demo. Live data, customer handoffs, commercial prices and external outreach need your company’s accounts and systems and are used only with your authorization; each is confirmed in the demo.'),
          /* V5 writes 「原资料仍记录……验收缺口」 — an editor's reference to its
             source records. On the page it says what those records say. */
          CP('M16-03', '视频与爆款再创作', 'Video and creative adaptation',
            '一键视频与爆款结构再创作已开放，交付的是可播放、可导出的成片文件；成片经人工审核后再发布，生成按企业开通的服务与额度计量。',
            'One-click video and viral creative adaptation are available, and what they deliver is a playable, exportable video file. Finished videos are reviewed before publishing, and generation runs within the services and credits the company enables.'),
          CP('M16-04', '协作、业务理解与记忆', 'Teamwork, context and memory',
            '员工组队、互相交流与协作交付已开放；企业知识及业务关联已有建设。企业级主动工作、统一长期记忆与新企业资料接入，按你公司确认的交付范围验收。',
            'Digital employees can already form teams, communicate and deliver together, and enterprise knowledge and business relationships have foundations. Enterprise-wide proactive work, unified memory and new-enterprise onboarding are accepted against the scope your company agrees.'),
          CP('M16-05', '高级分析与外部业务系统', 'Analytics and connected business systems',
            '高级增长分析需要合适的资源配置；财务、物流、签章、客户渠道与第三方数据依企业授权及系统情况开放。正式申报、付款和专业审阅由有权人员把关。',
            'Advanced growth analytics needs suitable resources. Finance, logistics, signatures, customer channels and third-party data depend on enterprise access and systems. Authorized people retain control of filings, payments and professional reviews.'),
          CP('M16-06', '行业落地与后续扩展', 'Industry delivery and phased expansion',
            '按行业提供资料模板、流程配置、企业接入和培训。网页端为当前重点；移动端与原生客户端的范围演示时确认，以企业确认的交付内容为准。',
            'Industry delivery includes data templates, workflow configuration, onboarding and training. The browser experience is the current focus; mobile and native client scope is confirmed in the demo. Actual delivery follows the enterprise’s agreed scope.'),
        ],
        value: B('交付顺序：确认目标 → 准备资料 → 连接账号 → 配置员工与审批 → 验证成果 → 逐步扩大范围。', 'Delivery: define goals → prepare context → connect accounts → assign roles and approvals → validate results → expand scope.'),
        outputs: B('一条明确的业务流程、所需资料、责任与审批安排，以及可核对的验收结果。', 'A defined workflow, required context, clear responsibilities and approvals, and checkable acceptance results.'),
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
    }],
  },
};

/* ===== workforce page ===== */
/**
 * workforce.html — the ten role groups. The counts are the size of each group
 * in the roster, not staff, and the note under the total says so.
 * pages.mjs asserts that there are ten groups and that they add up to
 * `total.count`, which must be 288 — change a number here and the build tells
 * you whether the table still sums. The order the page shows them in is
 * PAGE_OW.workforce.groups.order.
 */
export const WORKFORCE_ROLE_GROUPS = {
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
  note: B('288 是数字员工名册的规模：可按任务选择、配置、派工并组队协作，不代表替代 288 名真人员工。实际启用的员工、协作规模与操作范围，受企业配置、预算和权限约束。', '288 is the size of the roster: digital employees you select, configure, assign and team up by task. It is not a claim to replace 288 people. The employees enabled, the size of a collaboration and permitted actions depend on configuration, budget and access.'),
};

/* ===== 2026-10-09 C2: the four product pages on the OPEN WORK design =====
   capabilities.html (「产品」), workforce.html (「数字员工」),
   intelligence.html (「主动提醒与记忆」) and enterprise.html (「安全与接入」)
   are built like the homepage since this round: the Mono chrome around
   tools/ow-blocks sections (tools/ow-blocks/pages.mjs), with the OPEN WORK
   renders as the pictures. The words below use only what the site already
   states (HOME_OW, and the older page copy kept above: CAPABILITIES,
   CAPABILITY_GROUPS, CATALOGUE_DETAIL, CREATIVE_TOPICS, LX_INTELLIGENCE,
   LX_INTELLIGENCE_CONTEXT, LX_FEATURE_WORKFORCE, WORKFORCE_ROLE_GROUPS,
   ENTERPRISE) and what the renders show, which is demo data and is said so.
   Each page carries one status note instead of a disclaimer per section.
   [[ ]] marks the key phrase of a heading (the blue gradient). */
const PO_STEPS = (k) => {
  const x = HOME_OW.showcase.tabs.find((tab) => tab.key === k);
  if (!x) throw new Error(`PAGE_OW: no showcase tab ${k}`);
  return { read: x.read, did: x.did, approve: x.approve };
};
const ROLE = (letter, color, name, job, text, group) => ({ letter, color, name, job, text, group });
export const PAGE_OW = {
  statusLabel: B('状态说明', 'Status'),
  stepLabels: HOME_OW.showcase.labels,
  appsLabel: B('用到的应用', 'Apps used'),
  demoKicker: HOME_OW.showcase.kicker,

  /* ---- capabilities.html — 「产品」 ------------------------------------ */
  product: {
    hero: {
      eyebrow: B('OPEN WORK · STARGO WORK 的核心应用', 'OPEN WORK · The core app of STARGO WORK'),
      title: [B('在对话里交代任务，', 'Ask in a chat.'), B('AI 调用 15 个应用去办。', 'AI works across 15 apps.')],
      lead: B('打开 OPEN WORK，欢迎页上是一个对话框和七类快速任务。你说要做什么，AI 去客户CRM、企业知识库、主动获客、企业ERP 这些应用里查资料、算价格、写草稿；要发给客户的，先交给你批。',
        'Open OPEN WORK and the welcome page gives you a chat box and seven groups of quick tasks. Say what needs doing, and AI looks things up, prices and drafts across apps such as the customer CRM, Knowledge Base, Prospecting and ERP. Anything going to a customer waits for your approval.'),
      window: B('OPEN WORK · 首页', 'OPEN WORK · Home'),
      label: B('OPEN WORK 首页', 'The OPEN WORK home screen'),
      float: B('15 个应用 · 一个对话框', '15 apps · one chat box'),
      more: { href: '#atlas', label: B('看完整功能目录', 'See the full catalog') },
    },
    /* the four jobs, one chapter each; `anchor` is the floating pill's jump (CAP_JUMPS) */
    chaptersLabel: B('四件每天都在做的事', 'Four everyday jobs'),
    chapters: [
      { anchor: 'story-1', key: 'outreach', icon: 'spark', shot: 'ow04-outreach', card: 'ow14-outreach-card',
        eyebrow: B('01 · 主动获客', '01 · Prospecting'), window: B('OPEN WORK · 主动获客', 'OPEN WORK · Prospecting'),
        title: B('不等询盘，[[主动找买家]]。', 'Don’t wait for inquiries. [[Go find buyers.]]'),
        lead: B('说清楚卖什么、卖给谁：主动获客按行业、地区和门店规模筛选目标客户，补全公司信号与采购联系人，和客户CRM 去重，再起草开发信。',
          'Say what you sell and to whom. Prospecting filters target companies by industry, region and store count, adds company signals and buying contacts, removes accounts already in your CRM and drafts the outreach.'),
        apps: [B('主动获客', 'Prospecting'), B('客户CRM', 'Customer CRM')],
        float: B('每封开发信都要你确认才发', 'Every email waits for your OK'), ...PO_STEPS('outreach') },
      { anchor: 'story-2', key: 'inquiry', icon: 'search', shot: 'ow02-inquiry', card: 'ow12-inquiry-card',
        eyebrow: B('02 · 销售工作台', '02 · Sales Workbench'), window: B('OPEN WORK · 分析询盘', 'OPEN WORK · Inquiry'),
        title: B('询盘进来，[[先读懂再回复]]。', 'Inquiry in. [[Understood, then answered.]]'),
        lead: B('AI 先识别询盘要素，查客户CRM和企业知识库里的规格、MOQ 和交期，按价格表算出价格，写好英文回复草稿。客户、往来和报价都留在销售工作台里。',
          'AI pulls out what the buyer needs, checks the CRM and the specs, MOQ and lead time in your knowledge base, prices it from your price list and drafts the reply in English. The customer, the conversation and the quote stay in the Sales Workbench.'),
        apps: [B('销售工作台', 'Sales Workbench'), B('客户CRM', 'Customer CRM'), B('企业知识库', 'Knowledge Base')],
        float: B('对外发送需要你确认', 'Sending needs your confirmation'), ...PO_STEPS('inquiry') },
      { anchor: 'story-3', key: 'quote', icon: 'file', shot: 'ow03-quote', card: 'ow13-quote-card',
        eyebrow: B('03 · 报价与 PI', '03 · Quotes & PI'), window: B('OPEN WORK · 报价单 / PI', 'OPEN WORK · Quote / PI'),
        title: B('报价单和 PI，[[按价格表起草]]。', 'Quotes and PIs, [[drafted from your price list.]]'),
        lead: B('PI 自动套公司抬头和银行信息，明细、FOB 总价、付款与交期条款一次写好。单价低于标准价，自动交销售经理审批，批准前不会发给客户。',
          'The PI uses your letterhead and bank details, with line items, the FOB total and payment and lead-time terms filled in. A unit price below standard goes to the sales manager first and is not sent before approval.'),
        apps: [B('销售工作台', 'Sales Workbench'), B('企业知识库', 'Knowledge Base')],
        float: B('低于标准价 → 自动交经理审批', 'Below standard price → goes to the manager'), ...PO_STEPS('quote'),
        detail: { shot: 'ow21-pi-check', window: B('价格校验', 'Price check'), title: B('每张 PI 都过一遍价格校验', 'Every PI gets a price check'),
          text: B('演示里这张 PI 的单价低于标准价 4.2%：价格校验把它标出来，PI 进入审批，销售经理批准前不会发给客户。哪些报价需要审批、由谁批准，企业自己定。',
            'In the demo the unit price is 4.2% below standard: the price check flags it, the PI goes into approval and nothing reaches the customer before the sales manager approves. Your company decides which quotes need approval and who gives it.') } },
      { anchor: 'story-4', key: 'brief', icon: 'chart', shot: 'ow05-brief', card: 'ow15-brief-card',
        eyebrow: B('04 · 老板看板', '04 · Owner Dashboard'), window: B('OPEN WORK · 本周简报', 'OPEN WORK · Weekly brief'),
        title: B('这周要你拍板的事，[[一屏看完]]。', 'This week’s decisions, [[on one screen.]]'),
        lead: B('老板问一句「这周有什么要我拍板的」，AI 从老板看板里读询盘、报价、订单和回款，按同一口径对比上周，列出等你决定的事。',
          'Ask “what needs my decision this week?” AI reads inquiries, quotes, orders and payments from the Owner Dashboard, compares them with last week on the same basis and lists what is waiting for you.'),
        apps: [B('老板看板', 'Owner Dashboard')],
        float: B('等你拍板的事，一屏看完', 'Your decisions, on one screen'), ...PO_STEPS('brief') },
    ],
    /* the right-hand panel: four apps opened beside the chat (split renders) */
    panel: {
      eyebrow: B('对话旁边打开应用', 'Apps beside the chat'),
      title: B('对话在左边，[[应用在右边打开]]。', 'Chat on the left. [[The app opens on the right.]]'),
      lead: B('AI 干活时，用到的应用就在对话旁边打开：客户建了档、流程排上了、工单生成了，都能当场看到，再决定批不批。',
        'While AI works, the app it uses opens beside the chat. You see the new customer record, the scheduled flow or the production order on the spot, then decide whether to approve.'),
      tablist: B('四个应用', 'Four apps'),
      defaultTab: 'crm',
      tabs: [
        { key: 'crm', icon: 'users', shot: 'ow08-crm', card: 'ow17-crm-card', label: B('客户CRM · 名片建档', 'CRM · trade-fair cards'), window: B('OPEN WORK · 客户CRM', 'OPEN WORK · Customer CRM'),
          float: B('邮件发送前等你确认', 'Emails wait for your approval'),
          summary: B('广交会带回 6 张名片：AI 识别名片、和客户CRM 查重，新建 5 家公司，1 家合并到原档案，再按展位上聊到的产品起草 5 封跟进邮件，等你确认。',
            'Six business cards from a trade fair: AI reads them, checks the CRM for duplicates, creates five companies, merges one into its existing record and drafts five follow-up emails for your approval.') },
        { key: 'automation', icon: 'flow', shot: 'ow09-automation', card: 'ow18-automation-card', label: B('自动化中心 · 定时跟进', 'Automation · scheduled follow-up'), window: B('OPEN WORK · 自动化中心', 'OPEN WORK · Automation Center'),
          float: B('发送前逐封等你确认', 'Each email waits for your OK'),
          summary: B('一句话建一个流程：每天 09:00 读取销售工作台的报价记录，找出 3 天未回复的客户，起草跟进邮件，放进待审批。',
            'One sentence sets up a flow: every day at 09:00 it reads the quote records in the Sales Workbench, finds customers who have not replied for 3 days and drafts follow-ups into the approval queue.') },
        { key: 'erp', icon: 'box', shot: 'ow10-erp', card: 'ow19-erp-card', label: B('企业ERP · 生产工单', 'ERP · production order'), window: B('OPEN WORK · 企业ERP', 'OPEN WORK · ERP'),
          float: B('下达前需要你确认', 'Released only after you confirm'),
          summary: B('定金到账后，AI 读取 PI、核对库存与产能，生成生产工单草稿；礼盒库存不够，同时起草采购单。下达前等你确认。',
            'Once the deposit is in, AI reads the PI, checks stock and capacity and drafts the production order; the gift boxes are out of stock, so it drafts a purchase order too. Nothing is released before you confirm.') },
        { key: 'staff', icon: 'users', shot: 'ow11-staff', card: 'ow25-staff-card', label: B('数字员工 · 派工', 'AI staff · dispatch'), window: B('OPEN WORK · 数字员工', 'OPEN WORK · AI staff'),
          float: B('发给客户前等你确认', 'Waits for your approval'),
          summary: B('新询盘进来，企业调度长派给询盘接待员、客户档案管家、客户背调员和报价员；报价草稿放进销售工作台，发给客户前等你确认。',
            'A new inquiry arrives and the dispatcher hands it to the inquiry desk, the customer-file keeper, the background checker and the quoter. The quote draft waits in the Sales Workbench for your approval.'),
          more: { href: 'workforce.html', label: B('认识 288 名数字员工', 'Meet the 288 AI staff') } },
      ],
    },
    apps: { cta: { href: '#atlas', label: B('看完整功能目录', 'See the full catalog') } },
    /* AI creative work: words only (the old picture was a generated mock-up, not the product) */
    creative: {
      eyebrow: B('内容增长', 'Content growth'),
      title: B('图片、视频和多语言内容，[[从真实产品资料出发]]。', 'Images, video and copy, [[built on real product facts.]]'),
      lead: B('AI 创意工作室围绕已核实的产品资料和品牌规范，准备产品图、短视频和多语言文案。成品先给人审，对外发布要单独授权。',
        'The AI creative studio prepares product images, short videos and multilingual copy from verified product and brand information. People review the results, and publishing to outside channels needs separate authorization.'),
      items: [
        { id: 'creative-images', icon: 'spark', title: B('AI 作图与图片编辑', 'AI images & editing'),
          text: B('写清要求或给参考图，生成和修改白底产品图、场景图、海报和卖点图；外观、规格和文字不准的地方，局部检查修正。',
            'Describe what you need or share reference images to create and edit product shots, scenes, posters and benefit graphics; wrong details, specifications or text are checked and fixed locally.') },
        { id: 'creative-video', icon: 'bolt', title: B('AI 一键生成视频', 'One-click video'),
          text: B('从产品资料、受众、语言和时长出发，先出拍摄计划给你看，再生成可播放、可导出的视频文件；成片经人审核后才发布。',
            'Start from product facts, audience, language and length. You review the production plan first and get a playable, exportable video; finished videos are reviewed before they are published.') },
        { id: 'creative-viral', icon: 'flow', title: B('爆款结构再创作', 'Viral creative adaptation'),
          text: B('用你有权使用的参考视频，拆解开头、节奏和产品展示方式，改写成基于你自己产品的原创脚本和分镜；不复制原片、人脸、声音、音乐或标志。',
            'Take a reference video you are entitled to use, break down its hook, pacing and product reveal, and rebuild it as original scripts and storyboards for your own product, without copying footage, faces, voices, music or logos.') },
      ],
    },
    catalogue: {
      eyebrow: B('完整目录', 'Full catalog'),
      title: (groups, entries) => B(`${groups} 个能力组，[[${entries} 个条目]]。`, `${groups} groups. [[${entries} entries.]]`),
      lead: B('产品覆盖的全部能力，按组排列，默认收起。点开一组，看它做什么、产出什么，以及包含哪些条目。', 'Everything the product covers, by group and folded by default. Open a group to see what it does, what it produces and the entries it holds.'),
      status: B('目录列出产品覆盖的功能。有的现在就能用，有的要接入你公司的账号和真实数据，有的还在建设。你公司实际开通哪些，演示和方案沟通时逐项确认。',
        'The catalog lists what the product covers. Some of it works today, some needs your accounts and real data connected, and some is still being built. What your company gets is confirmed item by item during the demo and scoping.'),
      expand: B('全部展开', 'Expand all'),
      collapse: B('全部收起', 'Collapse all'),
      entries: B('个条目', 'entries'),
    },
    /* four buyer questions: HOME_OW's first, then CAPABILITIES' first, second and fourth */
    faq: {
      eyebrow: B('常见问题', 'FAQ'),
      title: B('关于产品，[[你可能想问]]。', 'Questions about [[the product.]]'),
      pick: [['home', 0], ['caps', 0], ['caps', 1], ['caps', 3]],
    },
  },

  /* ---- workforce.html — 「数字员工」 ----------------------------------- */
  workforce: {
    hero: {
      eyebrow: B('STARGO AI 数字办公室', 'STARGO AI Digital Office'),
      title: [B('288 名数字员工，', '288 AI staff,'), B('按任务派工。', 'assigned by task.')],
      lead: B('它们在 OPEN WORK 里干活。新询盘进来，企业调度长把活派给询盘接待员、客户档案管家、客户背调员和报价员；报价草稿放进销售工作台，发给客户前等你确认。',
        'They work inside OPEN WORK. When an inquiry arrives, the dispatcher hands it to the inquiry desk, the customer-file keeper, the background checker and the quoter. The quote draft lands in the Sales Workbench and waits for your approval before it reaches the customer.'),
      window: B('OPEN WORK · 数字员工', 'OPEN WORK · AI staff'),
      label: B('数字员工派工', 'Dispatching AI staff'),
      float: B('发给客户前等你确认', 'Waits for your approval'),
      more: { href: '#lx-role-groups', label: B('看十类职能', 'See the ten groups') },
    },
    /* the trade-facing roles of the roster the render shows (tools/openwork/scenes.mjs, staff);
       the tile letter is the render's on the Chinese page and an initial on the English one */
    roles: {
      eyebrow: B('外贸部最常用的', 'Closest to export sales'),
      title: B('先认识[[这 6 位]]。', 'Start with [[these six.]]'),
      lead: B('288 名里，和外贸业务关系最近的几位。每位都有自己的职责、资料和技能，由企业调度长统一派工。',
        'Of the 288, these are the closest to export sales. Each has its own job, material and skills, and the dispatcher assigns their work.'),
      list: [
        ROLE(B('询', 'I'), '#1756d6', B('询盘接待员', 'Inquiry desk'), B('外贸询盘接待', 'Trade inquiries'), B('买家通过邮件、WhatsApp 或网站来询盘时，读取并整理要素。', 'Reads an inquiry from email, WhatsApp or the website and sorts out what the buyer needs.'), B('销售', 'Sales')),
        ROLE(B('报', 'Q'), '#dc2626', B('报价员', 'Quoter'), B('报价与成本核对', 'Quotes and cost checks'), B('需要价格、报价单、PI 或成本拆分时，按价格表起草。', 'Drafts prices, quotes, PIs and cost breakdowns from your price list.'), B('销售', 'Sales')),
        ROLE(B('背', 'B'), '#0d9488', B('客户背调员', 'Background checker'), B('客户背景调查', 'Customer background checks'), B('大额报价或给新客户账期前，核查背景与合作风险。', 'Checks background and risk before a large quote or payment terms for a new customer.'), B('客户开发与市场', 'Customer development & marketing')),
        ROLE(B('档', 'C'), '#7c3aed', B('客户档案管家', 'Customer-file keeper'), B('客户档案管理', 'Customer records'), B('跨渠道保持客户记录准确：建档、更新、合并重复。', 'Keeps customer records right across channels: creates, updates and merges duplicates.'), B('客户服务', 'Customer service')),
        ROLE(B('增', 'G'), '#ea7a12', B('增长调度员', 'Growth coordinator'), B('增长任务分发与执行', 'Growth tasks'), B('市场进入、开发计划与内容增长的入口。', 'The starting point for entering a market, prospecting plans and content growth.'), B('客户开发与市场', 'Customer development & marketing')),
        ROLE(B('调', 'D'), '#1e293b', B('企业调度长', 'Dispatcher'), B('企业任务分发与调度', 'Assigning the work'), B('接到具体业务请求时先由它判断，派给合适的数字员工。', 'Looks at each request first and assigns it to the right AI staff.'), B('企业通用支持', 'Enterprise essentials')),
      ],
    },
    team: {
      eyebrow: B('怎么派工', 'How work is assigned'),
      title: B('一个目标，[[一个团队]]。', 'One goal. [[One team.]]'),
      lead: B('复杂的活可以交给几位数字员工分工完成。重点不在聊天的人数，而在信息能不能传递、责任是否明确、结果能不能交接。',
        'A complex job can be split between several AI staff. What matters is not how many are chatting, but whether information passes on, who is responsible and whether the result can be handed over.'),
      steps: [
        { icon: 'chat', title: B('你交办目标', 'You set the goal'), text: B('比如：处理一封新询盘，报价出来先给我看。', 'For example: handle this inquiry and show me the quote first.') },
        { icon: 'users', title: B('调度长派工', 'The dispatcher assigns'), text: B('判断要哪些岗位，派给合适的数字员工。', 'Decides which roles are needed and assigns them.') },
        { icon: 'flow', title: B('分工处理', 'Work in parallel'), text: B('各自查资料、写草稿，互相补充信息。', 'Each looks things up and drafts, passing information along.') },
        { icon: 'list', title: B('汇总交回', 'Results come back'), text: B('成果和没解决的问题，汇总给负责人。', 'Results and open questions go to the person in charge.') },
        { icon: 'shield', title: B('你来批准', 'You approve'), text: B('报价、对外发送这些关键动作，由有权的人批准。', 'Quotes, outgoing messages and other key steps need an authorized person.') },
      ],
      limits: B('协作轮次、预算和能做的动作都有上限，随时可以叫停；需要判断或遇到异常时，由人接管。', 'Rounds, budgets and permitted actions are capped and work can be stopped at any time; when judgment is needed or something unusual happens, a person takes over.'),
    },
    groups: {
      eyebrow: B('数字员工名册', 'Staff roster'),
      title: B('288 名，[[分十类]]。', '288 AI staff in [[ten groups.]]'),
      lead: B('按和外贸业务的远近排列，数字是每一类的人数。', 'Ordered by how close they are to export sales; each number is how many digital employees the group holds.'),
      /* WORKFORCE_ROLE_GROUPS, in this order (the build checks the names and the sum) */
      order: ['销售', '客户开发与市场', '客户服务', '供应链', '风控与合规', '财务', '运营', '企业通用支持', '专业服务', '产品与工程'],
    },
    traits: {
      eyebrow: B('每一位都一样', 'Every one of them'),
      title: B('有岗位，有记录，[[关键动作由人批]]。', 'A job, a record, [[and people approve key steps.]]'),
      cards: [
        { icon: 'users', title: B('有岗位的 AI', 'AI with a job'), text: B('职责、技能、企业知识、可用工具、权限和运行记录，都按岗位配置：执行时带着企业背景，也有清楚的范围。', 'Responsibilities, skills, company knowledge, permitted tools, access and run history are set per role, so each works with your context and within a clear scope.') },
        { icon: 'list', title: B('交接有记录', 'Handoffs on record'), text: B('负责人、截止时间、状态、结果和下一步都有记录；暂停或人工接管之后，能接着往下做。', 'Owner, deadline, status, result and next step are recorded, so work carries on after a pause or a human takeover.') },
        { icon: 'shield', title: B('关键动作由人批准', 'People approve key steps'), text: B('报价、对外发送和重要承诺，由有权的人批准。共享任务信息，不等于共享权限。', 'Quotes, outgoing messages and important commitments are approved by authorized people. Sharing a task does not share anyone’s permissions.') },
      ],
    },
  },

  /* ---- intelligence.html — 「主动提醒与记忆」 -------------------------- */
  reminders: {
    hero: {
      eyebrow: B('记忆与进化 · 自动化中心', 'Memory & Evolution · Automation Center'),
      title: [B('该跟进的客户，', 'Who to follow up,'), B('AI 先替你想起来。', 'remembered for you.')],
      /* buyer-plan §3 marks what the follow-up reads as 【需确认】: the lead says what the demo shows, not which records it reads. */
      lead: B('演示里，问一句「哪些客户该跟进了？」，AI 会列出今天该跟进的客户和原因，并起草好跟进消息。每条发送前，都等你确认。',
        'In the demo, ask “which customers should I follow up?” and AI lists who is due today and why, and drafts the follow-up. Every message waits for your approval.'),
      window: B('OPEN WORK · 跟进客户', 'OPEN WORK · Follow-up'),
      label: B('跟进客户', 'Follow up customers'),
      float: B('每条发送前等你确认', 'Each message waits for your OK'),
      /* the one link to #lx-ontology on the page (tools/verify-interactions.mjs clicks it) */
      more: { href: '#lx-ontology', label: B('看它记住什么', 'See what it remembers') },
    },
    watch: {
      eyebrow: B('主动提醒', 'Proactive reminders'),
      title: B('新机会、期限，[[不靠人记]]。', 'Leads and deadlines, [[not left to memory.]]'),
      lead: B('在已接入的客户、报价、订单和任务里，盯住这些事；到时候提醒你，并给出有依据的下一步。', 'Across the customers, quotes, orders and tasks you have connected, it watches for these and tells you when something is due, with a next step and the reason for it.'),
      items: [
        { icon: 'chat', text: B('重点客户三天没有回复。', 'A key account hasn’t replied in three days.') },
        { icon: 'box', text: B('老客户可能到了补货周期。', 'A regular customer may be due to reorder.') },
        { icon: 'file', text: B('报价发出后，还没有下文。', 'A quote went out; no answer yet.') },
        { icon: 'list', text: B('交期临近，出货资料还没备齐。', 'Delivery is close; shipping records are incomplete.') },
        { icon: 'shield', text: B('一份报价在等负责人批准。', 'A quote is waiting for its approver.') },
        { icon: 'search', text: B('新进口商出现采购信号。', 'A new importer shows buying signals.') },
      ],
      stop: B('证据不足时，先停下来请人判断。', 'Not enough evidence? It stops and asks.'),
    },
    automation: {
      eyebrow: B('自动化中心', 'Automation Center'),
      title: B('重复的提醒，[[排成流程]]。', 'Repeat reminders, [[turned into a flow.]]'),
      lead: B('在对话里说一句，自动化中心就把流程建好、先试运行一次。流程的最后一步是「等你批准」：跟进草稿放进待审批，发送前逐封等你确认。',
        'Say it in the chat and the Automation Center sets up the flow and runs it once as a test. The last step is your approval: follow-up drafts go into the approval queue and each one waits for you before it is sent.'),
      flowLabel: B('演示流程', 'Demo flow'),
      flow: [B('每天 09:00', 'Every day 09:00'), B('读取报价记录', 'Read quote records'), B('3 天未回复', 'No reply in 3 days'), B('起草跟进邮件', 'Draft follow-ups'), B('等你批准', 'Wait for your approval')],
      shot: 'ow09-automation', card: 'ow18-automation-card', window: B('OPEN WORK · 自动化中心', 'OPEN WORK · Automation Center'), label: B('自动化中心', 'Automation Center'),
      float: B('发送前逐封等你确认', 'Each email waits for your OK'),
      rule: B('新流程先人工跑通、确认规则，再逐步扩大自动执行的范围。', 'A new flow is run by hand and its rules agreed before more of it is automated.'),
    },
    memory: {
      eyebrow: B('记忆与进化', 'Memory & Evolution'),
      title: B('不只是读文件，[[更要读懂你的公司]]。', 'More than reading files. [[Knowing the company.]]'),
      lead: B('产品是什么、客户谈到哪一步、价格用哪一版、下一步谁负责——这些联系起来，AI 才能给出有依据的下一步。', 'Which product, how far the customer has got, which price is approved, who owns the next step: connect those, and AI can suggest a next step with reasons.'),
      items: [
        { icon: 'book', title: B('企业知识库', 'Knowledge Base'), text: B('产品目录、参数、价格政策、认证、常见问答和合同模板集中在一处。回答注明依据；资料冲突或过期时，提示人去核实。', 'Catalogs, specifications, pricing policy, certificates, FAQs and contract templates in one place. Answers cite their source; conflicting or outdated material is flagged for a person to check.') },
        { icon: 'flow', title: B('业务关系图', 'Relationship map'), text: B('客户、联系人、产品、询盘、报价、订单和负责人怎样关联：现在到了哪一步，下一步谁来推进，能不能做、由谁批准。', 'How customers, contacts, products, inquiries, quotes, orders and owners connect: where things stand, who moves next, whether it is allowed and who approves.') },
        { icon: 'users', title: B('同一个客户', 'One customer, every system'), text: B('邮箱、客户CRM 和企业ERP 里的记录，能判断是不是同一个客户或订单，少建重复档案、少串客户。新导入的资料先进待审核区。', 'Records in email, the CRM and ERP are matched to the same customer or order, so fewer duplicates and mix-ups. Newly imported files wait for review.') },
        { icon: 'list', title: B('任务不断线', 'Tasks that carry on'), text: B('每项任务留下目标、负责人、截止时间、依据和下一步；暂停或换人接手之后，不必从头交代背景。', 'Each task keeps its goal, owner, deadline, evidence and next step, so after a pause or a handover nobody starts from scratch.') },
        { icon: 'chat', title: B('长期记忆', 'Long-term memory'), text: B('客户偏好、沟通摘要、项目决定和后续任务分层留下。每条记忆标明来源，可以修正，按权限查看。', 'Customer preferences, conversation summaries, decisions and follow-ups are kept in layers. Each memory shows its source, can be corrected and is visible by permission.') },
        { icon: 'sheet', title: B('六类业务记录', 'Six kinds of records'), records: [B('客户', 'Customer'), B('询盘', 'Inquiry'), B('报价', 'Quote'), B('订单', 'Order'), B('出货', 'Shipment'), B('任务', 'Task')],
          text: B('客户是谁、询盘缺什么、报价用哪一版、订单走到哪一步、出货还差什么、任务谁负责。', 'Who the customer is, what an inquiry lacks, which quote is approved, where an order stands, what a shipment still needs and who owns a task.') },
      ],
    },
    improve: {
      eyebrow: B('持续改进', 'Getting better'),
      title: B('有用的方法留下，[[无效的改动撤回]]。', 'Keep what works. [[Withdraw what doesn’t.]]'),
      lead: B('每次执行都留下记录：做了什么、有没有达到目标、人在哪里改过。更好的做法先测试、和现在的做法比较，批准后再用；效果不够可以撤回。',
        'Every run leaves a record: what was done, whether it met the goal and where a person corrected it. A better method is tested and compared with the current one, used only once approved, and withdrawn if it falls short.'),
      flow: B('发现变化 → 理解上下文 → 提出建议 → 获得确认 → 推进任务 → 核对结果 → 沉淀经验', 'Notice a change → Understand the context → Propose an action → Get approval → Act → Check the result → Retain the lesson'),
    },
    status: B('企业知识、业务关联、目标推进和受控改进已有基础；企业级主动工作、统一长期记忆和高级改进仍在完善。主动不等于 AI 自己做主，关键判断始终由人负责。',
      'Knowledge, business context, goal tracking and controlled improvement have working foundations; company-wide proactive work, unified long-term memory and advanced improvement are still being built. Proactive does not mean AI decides on its own: people stay responsible for the judgment calls.'),
  },

  /* ---- enterprise.html — 「安全与接入」 -------------------------------- */
  security: {
    hero: {
      eyebrow: B('安全与接入 · 写给老板和 IT', 'Security & setup · for owners and IT'),
      title: [B('把工作交给 AI，', 'Delegate the work.'), B('决定权留在企业。', 'Keep the authority.')],
      lead: B('哪些动作必须由人批准、谁能看什么、每一步怎么留痕、怎样接入你现有的系统，这一页说清楚。老板在老板看板里看结果，先处理真正需要决定的事。',
        'Which actions need a person’s approval, who can see what, how every step is recorded and how it connects to the systems you already use. The owner sees the results in the Owner Dashboard and deals with the real decisions first.'),
      window: B('OPEN WORK · 老板看板', 'OPEN WORK · Owner Dashboard'),
      label: B('老板看板 · 本周简报', 'Owner Dashboard · weekly brief'),
      float: B('等你拍板的事，一屏看完', 'Your decisions, on one screen'),
      more: { href: '#connect', label: B('看接入范围', 'See what connects') },
    },
    approvals: {
      eyebrow: B('审批', 'Approvals'),
      title: B('关键动作，[[有权人批准]]。', 'Key actions, [[approved by people.]]'),
      lead: B('哪些报价、客户触达和内容发布需要审批、由谁批准，企业自己定；付款、正式申报和专业审阅，始终由有权人员确认。',
        'Your company decides which quotes, customer outreach and published content need approval, and who approves them. Payments, official filings and professional reviews always stay with authorized people.'),
      gatesLabel: B('这些动作要人点头', 'These need a person’s yes'),
      gates: [B('回复与开发信', 'Replies and outreach'), B('报价与 PI', 'Quotes and PIs'), B('低于标准价', 'Below standard price'), B('重要承诺', 'Important commitments'), B('付款', 'Payments'), B('正式申报', 'Official filings'), B('合同与合规审阅', 'Contract and compliance review')],
      shots: [
        { shot: 'ow22-approval-bar', window: B('对外发送审批', 'Send approval'), title: HOME_OW.governance.rules[0].title, text: HOME_OW.governance.rules[0].text, icon: 'shield' },
        { shot: 'ow21-pi-check', window: B('价格校验', 'Price check'), title: HOME_OW.governance.rules[1].title, text: HOME_OW.governance.rules[1].text, icon: 'tag' },
      ],
    },
    automation: {
      eyebrow: B('自动化护栏', 'Automation guardrails'),
      title: B('自动执行，[[也有边界]]。', 'Automation, [[with limits.]]'),
      lead: B('定时任务、事件触发和数据同步，先人工跑通、确认规则，再逐步扩大自动执行的范围。流程里对外的一步，照样停下来等你批准。',
        'Scheduled work, event triggers and data sync are run by hand first and their rules agreed before more of it is automated. A step that goes outside the company still stops for your approval.'),
      shot: 'ow09-automation', card: 'ow18-automation-card', window: B('OPEN WORK · 自动化中心', 'OPEN WORK · Automation Center'), label: B('自动化中心', 'Automation Center'),
      float: B('最后一步：等你批准', 'Last step: your approval'),
      points: [
        { icon: 'shield', title: B('出错即停并报告', 'Stops and reports on failure'), text: B('出现异常时停下，由人接手或退回。', 'On an exception, work stops for a person to take over or send back.') },
        { icon: 'users', title: B('数字员工的工作边界', 'Work limits for AI staff'), text: B('能调用什么、以谁的名义，事先设定。', 'What they may use, and on whose behalf, is set in advance.') },
        { icon: 'flow', title: B('新做法先小范围试用', 'Small trials first'), text: B('先在部分工作中试，效果不够可以撤回。', 'Tried on part of the work first, and withdrawn if it falls short.') },
      ],
    },
    controls: {
      eyebrow: B('管理控制', 'Management controls'),
      title: B('谁能看、谁能做，[[事先说清]]。', 'Who can see and do what, [[set in advance.]]'),
      lead: B(`五个管理组件，管住 AI 怎么干活；下面 ${ENT_CONTROLS.length} 项控制，是这五个组件里具体管的事。`, `Five management components govern how AI works; the ${ENT_CONTROLS.length} controls below are what they cover in detail.`),
      cards: [
        { icon: 'apps', title: ENTERPRISE.cards[0].name, text: B('企业开通了什么、哪些工作可做、哪些仍需配置，用量与预算上限多少。', 'What is enabled, what work is possible, what still needs setup, and the usage and budget limits.') },
        { icon: 'users', title: ENTERPRISE.cards[1].name, text: B('明确谁可以查看资料，谁可以修改记录。', 'Who may read information, and who may change records.') },
        { icon: 'shield', title: ENTERPRISE.cards[2].name, text: B('报价、对外触达和重要承诺，由有权人确认。', 'Quotes, outreach and important commitments go to authorized reviewers.') },
        { icon: 'list', title: ENTERPRISE.cards[3].name, text: B('做过什么、谁批准、结果是否符合要求；出错即停，可转人工。', 'What was done, who approved it and whether the result met the requirement; failures stop and pass to a person.') },
        { icon: 'gear', title: ENTERPRISE.cards[4].name, text: B('通过企业授权连接业务账号，不向不必要的岗位开放访问。', 'Business accounts connect through company authorization, with no access for roles that do not need it.') },
      ],
      controlsLabel: B(`${ENT_CONTROLS.length} 项控制`, `${ENT_CONTROLS.length} controls`),
      controls: ENT_CONTROLS,
      deployLabel: B('部署方式', 'Deployment'),
      deploy: B(`${ENT_DEPLOYMENT.map((x) => x.zh).join('、')}，按企业需求逐项确认。`, `${enList(ENT_DEPLOYMENT.map((x) => x.en), 'or').replace(/^./, (c) => c.toUpperCase())}, confirmed with each company.`),
    },
    connect: {
      eyebrow: B('接入', 'Connections'),
      title: B('接入你已有的系统，[[逐项授权]]。', 'Connect what you already use, [[one authorization at a time.]]'),
      lead: B('邮箱、客户记录、产品知识、ERP 和网盘，经企业授权逐项接入同一个工作流程。不必先假定要换掉现有软件：保留、接入还是调整，按企业情况确认。',
        'Email, customer records, product knowledge, ERP and shared drives join one workflow, one authorization at a time. Replacing your current software is not assumed: what to keep, connect or adjust is agreed with each company.'),
    },
    rollout: {
      eyebrow: B('落地顺序', 'Rollout'),
      title: B('先跑通一条，[[再扩大范围]]。', 'Prove one workflow, [[then expand.]]'),
      /* ENTERPRISE.approach, as title + line */
      steps: [
        [B('选择一条业务', 'Choose one workflow'), B('定目标与验收标准。', 'Set the goal and the acceptance criteria.')],
        [B('准备企业资料', 'Prepare company context'), B('产品、客户、知识与规则。', 'Products, customers, knowledge and rules.')],
        [B('连接授权账号', 'Connect authorized accounts'), B('可读、可改、需审批，逐项说清。', 'What may be read, what may be changed and what needs approval.')],
        [B('配置员工与审批', 'Set up roles and approvals'), B('谁来做，谁来批。', 'Who does the work, who signs off.')],
        [B('验证实际成果', 'Check the actual results'), B('用真实样本核对结果。', 'Against real cases.')],
        [B('再扩大范围', 'Expand the scope'), B('跑通一条，再定下一条。', 'Prove one workflow, then choose the next.')],
      ],
      button: { label: B('联系实施顾问', 'Talk to an implementation consultant'), href: 'contact.html' },
    },
    status: B('管理与控制已有基础；看板指标、自动动作、跨系统动作和高级分析，要接入真实数据并验收后才算数。能打开某个应用，不等于整条流程已经验收。',
      'Management and control have working foundations; dashboard figures, automated and cross-system actions and advanced analytics count only once real data is connected and accepted. Opening an app is not the same as an accepted workflow.'),
  },
};

/* ===================================== C2 pass 2: the remaining pages ===
   pricing, about, contact, the legal pages and 404 on the OPEN WORK design
   (tools/ow-blocks/site-pages.mjs, 2026-10-09). Facts only from what the site
   already states: PRICING (prices, inclusions, the comparison data, the ten
   questions), ABOUT (the story and principles), CONTACT_INFO, the demo
   wording of HOME_OW, LEGAL and NOTICES. */
const PLAN_KEYS = { 标准版: 'standard', 上线版: 'launch', 增长版: 'growth', 全球获客版: 'global', 企业版: 'enterprise', 从一条流程开始: 'start' };
export const SITE_OW = {
  planKeys: PLAN_KEYS,

  /* ---- pricing.html ----------------------------------------------------- */
  pricing: {
    hero: {
      eyebrow: B('定价', 'Pricing'),
      title: [B('¥10,000 / 年起，', 'From ¥10,000 a year.'), B('先跑通一条流程。', 'Start with one workflow.')],
      lead: B('标准版是 STARGO WORK 的年度软件订阅，最多 5 个标准用户账号。还需要官网、内容和获客服务时，选上线版、增长版或全球获客版：首年总价已含标准版订阅。',
        'Standard is the annual STARGO WORK software subscription, with up to 5 standard user accounts. If you also need a website, content or acquisition, choose Launch, Growth or Global Acquisition: the first-year total already includes the Standard subscription.'),
    },
    plansLabel: B('五个方案', 'Five plans'),
    groupSoftware: B('软件订阅', 'Software subscription'),
    groupPackages: B('软件订阅 + 建站与内容服务', 'Subscription + website and content services'),
    includes: B('含标准版年度软件订阅，另加：', 'The annual Standard subscription, plus:'),
    unit: { year: B('/ 年', '/ year'), first: B('首年总价', 'first-year total') },
    renewalLabel: B('续费', 'Renewal'),
    renewal: {
      year: B('¥10,000 / 年', '¥10,000 / year'),
      first: B('标准版订阅 ¥10,000 / 年；域名、托管与持续制作按续费方案', 'Standard subscription ¥10,000 / year; domain, hosting and ongoing production per renewal proposal'),
      custom: B('以合同约定为准', 'As agreed in the contract'),
    },
    note: B('价格以人民币计，为公开参考价。实际服务范围、续费价格、模型与第三方服务用量，以双方签署的合同或订单为准。',
      'Prices are public reference prices in Chinese yuan (CNY). The actual scope, renewal price and model and third-party usage are set by the contract or order both parties sign.'),
    start: {
      title: B('不确定从哪一档开始？', 'Not sure where to start?'),
      text: B('告诉我们眼下最拖效率或增长的那条流程。先跑通它，再决定需要哪一级，不必一次改动整个企业。',
        'Tell us the one workflow that most affects efficiency or growth. Get it running first, then decide which level you need; there is no need to change the whole company at once.'),
    },
    compare: {
      eyebrow: B('方案对比', 'Compare plans'),
      title: B('五个方案，[[一张表看清]]。', 'Five plans, [[one table.]]'),
      lead: B('上线版、增长版、全球获客版和企业版都含标准版软件订阅；数量不同的地方，直接写数量。', 'Launch, Growth, Global Acquisition and Enterprise all include the Standard software subscription; where plans differ by quantity, the table gives the number.'),
      feature: B('包含内容', 'What is included'),
      groups: { standard: B('软件订阅', 'Software subscription'), site: B('官网与内容（首年交付）', 'Website and content (first-year delivery)'), global: B('获客运行', 'Acquisition operation'), enterprise: B('企业版', 'Enterprise') },
      yes: B('包含', 'Included'),
      no: B('不含', 'Not included'),
      hint: B('左右滑动，查看全部 5 个方案', 'Swipe sideways to see all 5 plans'),
      caption: B('五个方案包含的内容对比（首年）', 'What each of the five plans includes (first year)'),
    },
    faq: { eyebrow: B('常见问题', 'FAQ'), title: B('关于定价，[[常被问到的]]。', 'About pricing: [[what people ask.]]') },
  },

  /* ---- about.html --------------------------------------------------------- */
  about: {
    hero: {
      eyebrow: B('关于 STARGO WORK', 'About STARGO WORK'),
      title: [B('从真实业务出发，', 'Start with real work.'), B('把分散的工作连接起来。', 'Connect what comes next.')],
      lead: B('STARGO WORK 是外贸工厂的 AI 工作台，核心应用是 OPEN WORK。在 OPEN WORK 里用对话交代任务，AI 去客户CRM、企业知识库、主动获客、企业ERP 等 15 个应用里查资料、写草稿，要发给客户的先交给你批。',
        'STARGO WORK is the AI workspace for export manufacturers; OPEN WORK is its core app. You ask in a chat, AI looks things up and drafts across 15 apps such as the customer CRM, Knowledge Base, Prospecting and ERP, and anything going to a customer waits for your approval.'),
      window: B('OPEN WORK · 新聊天', 'OPEN WORK · New chat'),
      label: B('OPEN WORK 新聊天', 'The OPEN WORK new-chat screen'),
      float: B('15 个应用 · 一个对话框', '15 apps · one chat box'),
      more: { href: 'capabilities.html', label: B('看产品', 'See the product') },
      appsLabel: B('OPEN WORK 里的 15 个应用', 'The 15 apps in OPEN WORK'),
    },
    story: { eyebrow: B('我们的来历', 'Our story'), title: B('从[[真实业务]]里长出来。', 'Grown out of [[real export work.]]'), where: B('STARGO WORK · 柳州 · 广西 · 中国', 'STARGO WORK · Liuzhou, Guangxi, China') },
    values: { eyebrow: B('三条原则', 'Three principles'), title: B('把工作交给 AI，[[把决定权留在企业]]。', 'Delegate the work. [[Keep the authority.]]'), icons: ['shield', 'flow', 'chart'] },
    starts: {
      eyebrow: B('从一条流程开始', 'Start with one workflow'),
      title: B('先跑通一件事，[[再扩大到整个企业]]。', 'Prove one workflow, [[then expand.]]'),
      list: [
        { icon: 'search', name: B('询盘与客户跟进', 'Inquiries & follow-up'), sub: B('销售工作台 · 客户CRM', 'Sales Workbench · Customer CRM'), href: 'capabilities.html#story-2' },
        { icon: 'file', name: B('报价与 PI', 'Quotes & PI'), sub: B('价格校验与审批', 'Price check and approval'), href: 'capabilities.html#story-3' },
        { icon: 'spark', name: B('主动获客', 'Prospecting'), sub: B('找买家 · 开发信', 'Find buyers · outreach'), href: 'capabilities.html#story-1' },
        { icon: 'box', name: B('订单与出口单证', 'Orders & export documents'), sub: B('企业ERP', 'ERP'), href: 'capabilities.html#apps-panel' },
        { icon: 'pen', name: B('营销内容', 'Marketing content'), sub: B('图片、视频与多语言内容', 'Images, video and multilingual content'), href: 'capabilities.html#creative' },
      ],
    },
  },

  /* ---- contact.html ------------------------------------------------------- */
  contact: {
    hero: {
      eyebrow: B('预约演示', 'Book a demo'),
      title: [B('预约 30 分钟演示，', 'Book a 30-minute demo.'), B('看 OPEN WORK 干活。', 'Watch OPEN WORK at work.')],
      lead: B('留下姓名和邮箱，我们会联系你约时间。演示用一封示例询盘走一遍，再围绕你的一条业务流程，看需要哪些资料、账号和审批。想先问问，直接发 WhatsApp。',
        'Leave your name and email and we will get in touch to schedule it. We run a sample inquiry through OPEN WORK, then look at one of your workflows and the information, accounts and approvals it would need. Prefer to ask first? Message us on WhatsApp.'),
    },
    formTitle: B('告诉我们你的公司', 'Tell us about your company'),
    required: B('带 * 的为必填，其余选填。', 'Fields marked * are required; the rest are optional.'),
    fields: {
      Name: B('姓名 *', 'Name *'), email: B('邮箱 *', 'Email *'), 'Last-Name': B('公司', 'Company'),
      phone: B('WhatsApp / 微信 / 电话', 'WhatsApp / WeChat / phone'), plan: B('感兴趣的方案', 'Plan you are looking at'),
      focus: B('最想先改善哪件事', 'What to improve first'), message: B('补充说明', 'Anything else'),
    },
    planNone: B('还没决定', 'Not decided yet'),
    focusNone: B('请选择', 'Choose one'),
    focusOptions: [B('分析询盘并回复', 'Analyze inquiries and reply'), B('起草报价单 · PI', 'Draft quotes and PIs'), B('主动获客 · 开发信', 'Prospecting and outreach'), B('跟进客户', 'Follow up customers'), B('老板看板 · 周报', 'Owner Dashboard and weekly brief'), B('客户CRM 与资料整理', 'Customer CRM and company information'), B('企业ERP · 订单与单证', 'ERP, orders and documents'), B('其他', 'Something else')],
    messageHint: B('例如：现在用哪些软件？哪一步最费时间？', 'For example: which tools do you use today, and where does the work stall?'),
    ways: { title: B('直接联系', 'Reach us directly'), email: B('邮件', 'Email'), address: B('地址', 'Location') },
    steps: {
      title: B('演示怎么进行', 'How the demo works'),
      list: [
        [B('我们联系你', 'We get in touch'), B('通过你留下的联系方式，约一个时间。', 'Using the contact details you leave, to agree a time.')],
        [B('30 分钟看一遍', '30 minutes, end to end'), B('用一封示例询盘，看 OPEN WORK 读询盘、算价格、起草回复和 PI，发出前等你批准。', 'On a sample inquiry: OPEN WORK reads it, prices it and drafts the reply and the PI, which wait for your approval.')],
        [B('聊你的流程', 'Your workflow'), B('围绕你的一条业务，讨论需要的资料、账号、岗位、审批和可验收的结果。', 'Around one of your workflows: the information, accounts, roles, approvals and the results you can check.')],
      ],
    },
    /* three OPEN WORK close-ups under one heading; the eyebrow names the section (it used to repeat the badge, 「演示数据」) */
    shot: {
      eyebrow: B('演示内容', 'In the demo'), title: B('演示里你会看到', 'What you will see in the demo'),
      text: B('回复草稿、PI、跟进消息：每个对外动作都停下来等你。', 'Reply drafts, PIs, follow-ups: every step that leaves the company stops and waits for you.'),
      cards: [
        { shot: 'ow12-inquiry-card', title: B('回复草稿', 'The reply draft'), text: B('AI 起草的英文回复，点「批准」才发出。', 'A reply drafted by AI, sent only after you click Approve.') },
        { shot: 'ow21-pi-check', title: B('PI 先过价格校验', 'The PI price check'), text: B('单价低于标准价，PI 先交销售经理审批。', 'Below the standard price, the PI goes to the sales manager first.') },
        { shot: 'ow16-follow-card', title: B('该跟进的客户', 'Who to follow up'), text: B('列出该跟进的客户和原因，每条跟进消息都等你确认。', 'Who is due and why; every follow-up message waits for your approval.') },
      ],
    },
  },

  /* ---- privacy / terms / notices ------------------------------------------ */
  legal: {
    eyebrow: B('法律信息', 'Legal'),
    pagesLabel: B('法律信息', 'Legal pages'),
    related: B('继续看', 'Keep reading'),
    notices: [
      { href: 'capabilities.html', shot: 'ow12-inquiry-card', title: B('产品', 'Product'), text: B('OPEN WORK 和 15 个应用：分析询盘、报价、主动获客、老板看板。', 'OPEN WORK and its 15 apps: inquiries, quotes, prospecting and the Owner Dashboard.') },
      { href: 'enterprise.html', shot: 'ow22-approval-bar', title: B('安全与接入', 'Security & setup'), text: B('哪些动作必须由人批准，谁能看什么，每一步怎么留痕。', 'Which actions need a person’s approval, who can see what, and how each step is recorded.') },
      { href: 'workforce.html', shot: 'ow25-staff-card', title: B('数字员工', 'AI Staff'), text: B('288 名数字员工，按任务派工，关键动作由人批准。', '288 AI staff, assigned by task, with key actions approved by people.') },
    ],
  },

  /* ---- 404.html ------------------------------------------------------------ */
  notFound: {
    eyebrow: B('404', '404'),
    title: [B('这个页面不存在，', 'This page doesn’t exist'), B('或已经移走。', 'or has moved.')],
    lead: B('地址可能输错了，或者页面换了位置。从这里继续：', 'The address may be mistyped, or the page has moved. Carry on from here:'),
    links: [
      { href: 'capabilities.html', icon: 'apps', title: B('产品', 'Product'), text: B('OPEN WORK 和 15 个应用', 'OPEN WORK and its 15 apps') },
      { href: 'pricing.html', icon: 'tag', title: B('定价', 'Pricing'), text: B('¥10,000 / 年起', 'From ¥10,000 a year') },
      { href: 'contact.html', icon: 'chat', title: B('预约演示', 'Book a demo'), text: B('30 分钟看 OPEN WORK 跑一遍', 'See OPEN WORK run in 30 minutes') },
    ],
    home: B('回到首页', 'Back to home'),
  },
};

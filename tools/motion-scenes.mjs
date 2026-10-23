/**
 * 代码动画 — motion scenes drawn in code where the homepage showed generated
 * stills (owner, 2026-10-23: “不要全部放那种假假的AI图片”).
 *
 * Each host is an empty box the browser fills (js/stargo-motion.js); it keeps
 * the slot's own size, so no section moves:
 *
 *   loop   — 「一条业务主线」: the box the sticky band zooms out of (it was
 *            os-cockpit.webp as a CSS background on .absolute-photo).
 *   radar  — the Growth OS panel of the core-systems switcher (gos10).
 *   studio — the AI 创作 panel of the same switcher (os-boot).
 *   team   — 「团队分工、交流、并行与接力」 (capabilities #story-6, third card)
 *            and the 「不再各聊各的」 tile of the workforce page, both of which
 *            showed the Expert Teams composite (sw006-expert-teams.webp).
 *            js/stargo-motion-team.js + css/stargo-motion-team.css.
 *
 * And on intelligence.html, phone screens drawn in the light chrome of the
 * phone app (js/stargo-motion-phone.js):
 *
 *   feed   — the hand-held phone of 「不再 等提醒 / 等回复 / 丢背景」 (it was
 *            mobile-core.webp laid over the template's phone).
 *   squad  — the phone of the 「按任务组队」 card, beside 「工作暂停，背景不必
 *            从头解释」 (it was mobile-core.webp over mobile-agents.webp).
 *   pain-inquiry, pain-chats, pain-sheet, pain-order — the four problem cards
 *            of 「工具很多，靠人连接」 (S01–S04, the owner's photographs until
 *            2026-10-23, when he chose 「换这两处,其余照片保留」);
 *            js/stargo-motion-pain.js.
 *   cockpit-overview, cockpit-blocker, cockpit-budget — the three pictures
 *            beside 「(老板驾驶舱)」 on the enterprise page (E05–E07, owner's
 *            choice 2026-10-23). js/stargo-motion-cockpit.js +
 *            css/stargo-motion-cockpit.css.
 *
 * The hosts are role="img" with a sentence for screen readers; the scenes
 * themselves are aria-hidden drawing. Every scene says on itself that it is
 * illustrative motion with demo data.
 */
import { escapeHtml } from './lib-html.mjs';

export const MOTION_LABEL = {
  loop: {
    zh: '动态示意：邮件、WhatsApp、阿里国际站和官网表单的询盘汇入 STARGO WORK，报价先经人工审批，再流向找客户、理解需求、推进订单、制作内容和管好经营五个环节。',
    en: 'Illustrative motion: inquiries from email, WhatsApp, Alibaba.com and the website flow into STARGO WORK, quotes pass a human approval, and work flows on to five stages.',
  },
  radar: {
    zh: '动态示意：Growth OS 从柳州工厂出发在全球找到目标客户，按匹配度实时排序，并写出推荐理由。',
    en: 'Illustrative motion: Growth OS finds buyers worldwide from the Liuzhou factory, ranks them by fit and writes down why.',
  },
  studio: {
    zh: '动态示意：AI 创作根据一句要求生成产品主图、场景图和短视频，并生成多语言卖点文案，全部人工审核后发布。',
    en: 'Illustrative motion: AI Creative turns one instruction into product images, scenes and short video plus copy in several languages, all reviewed before publishing.',
  },
  team: {
    zh: '动态示意：目标「开发德国储能经销商」分给市场研究员、产品工程师、销售和创意四位 AI 员工并行推进、互相接力；目标国家先等你确认，统筹汇总成果后停在人工审批，等你拍板，不会自动发送。',
    en: 'Illustrative motion: one goal, finding storage distributors in Germany, is split between four AI employees (market researcher, product engineer, sales and creative) who work in parallel and hand off to each other; a question about the target country waits for you, and a coordinator gathers the results and stops at a human approval, so nothing is sent automatically.',
  },
  feed: {
    zh: '动态示意（演示数据）：手机上的待办自己列出来——Müller Energie 三天没回复，跟进信已起草、等你确认；报价 Q-1042 低于底价，等你审批；PT Surya 到了补货周期，建议联系。你点了批准，发送前仍由你确认。',
    en: 'Illustrative motion (demo data): the phone’s to-do list fills itself — Müller Energie has not replied in three days and a follow-up is drafted for your OK; quote Q-1042 is below the floor price and needs your approval; PT Surya is due to restock. Once you approve, you still confirm before anything is sent.',
  },
  squad: {
    zh: '动态示意（演示数据）：一项任务在手机上组队，统筹、研究、销售、产品、创意分头推进、互相提问；你暂停后，任务卡留着已完成什么、在等什么、由谁拍板，继续后从中断的那一步接着做，最后汇总交你确认。',
    en: 'Illustrative motion (demo data): a task forms its team on the phone — lead, research, sales, product and creative split the work and ask each other; when you pause it, the task keeps what is done, what is waiting and who decides, then picks up at the step where it stopped and hands you the summary to confirm.',
  },
  'pain-inquiry': {
    zh: '动态示意：一封带 PDF 规格书的询盘到了，型号、数量和交货条件被一项项手工重新录入询盘表；最后同样三项从 PDF 中识别出来，等你确认。',
    en: 'Illustrative motion: an inquiry arrives with a PDF spec and the model, quantity and delivery terms are typed into the inquiry log again by hand; at the end the same three details are read from the PDF and wait for your confirmation.',
  },
  'pain-chats': {
    zh: '动态示意：同一位客户的报价、规格、样品申请和公司信息分散在邮件、WhatsApp、阿里国际站和官网表单四个窗口里，窗口来回遮挡；最后合并成一张客户卡，等你确认。',
    en: 'Illustrative motion: one buyer’s price, spec, sample request and company details sit in four windows (email, WhatsApp, Alibaba.com and the website form) that keep covering each other; at the end they merge into one customer card for you to confirm.',
  },
  'pain-sheet': {
    zh: '动态示意：客户跟进表里的日子一天天过去，便签提醒一张张掉落，一位客户变成 14 天未跟进；最后系统起草一封跟进邮件，等你确认后再发。',
    en: 'Illustrative motion: days pass in a follow-up spreadsheet, the sticky-note reminders fall away and one buyer goes 14 days without a reply; at the end a follow-up draft waits for you to approve it before anything is sent.',
  },
  'pain-order': {
    zh: '动态示意：销售在内部群里三次追问「这单到哪了？」都没人回复，销售视图里看不到生产进度；最后已排产、质检、已装柜直接显示在销售视图里。',
    en: 'Illustrative motion: sales asks the team chat three times where an order is and nobody answers, because production status is not in the sales view; at the end scheduled, QC and loaded appear in the sales view itself.',
  },
  'cockpit-overview': {
    zh: '动态示意（演示数据）：老板驾驶舱总览。商机进展的询盘和报价数随新数据增加，交付状态显示准时与延迟的订单，待审批事项升到 3 项，你批准一项后回到 2 项；数据来源里邮箱、阿里国际站、CRM 和网盘已接入，ERP 未接入，缺的数据已标出。',
    en: 'Illustrative motion with demo data: the owner’s cockpit overview. Inquiry and quote counts rise as new data arrives, delivery shows on-time against late orders, and pending approvals rise to three and fall back to two when you approve one. Email, Alibaba.com, CRM and the shared drive are connected; the ERP is not, and its missing data is flagged.',
  },
  'cockpit-blocker': {
    zh: '动态示意（演示数据）：任务与卡点。报价 Q-1042 的负责人是销售 AI，卡在缺底价，等你处理；你接手、填上底价后交回销售 AI，报价更新后仍要等你审批才发出，不会自动发送。',
    en: 'Illustrative motion with demo data: tasks and blockers. Quote Q-1042, owned by the sales AI, is blocked on a missing floor price and waits for you; you take it, enter the price and hand it back, and the updated quote still waits for your approval before it is sent. Nothing is sent automatically.',
  },
  'cockpit-budget': {
    zh: '动态示意（演示数据）：用量与预算。本月 AI 用量逐日上升，到 80% 时提醒你；下一批任务会超出上限时，新任务先暂停，等你批准。',
    en: 'Illustrative motion with demo data: usage and budget. This month’s AI usage rises day by day and alerts you at 80%; when the next batch would cross the limit, new work pauses until you approve it.',
  },
};

export function motionHost(scene, lang, extraClass = '', { fit } = {}) {
  const label = MOTION_LABEL[scene][lang];
  return `<div class="sg-mo${extraClass ? ` ${extraClass}` : ''}" data-sg-scene="${scene}"${fit ? ` data-sg-fit="${fit}"` : ''} role="img" aria-label="${escapeHtml(label)}"></div>`;
}

export const MOTION_CSS = 'css/stargo-motion.css';
export const MOTION_SCRIPTS = '<script src="js/stargo-motion-map.js" defer></script><script src="js/stargo-motion.js" defer></script>';

/* Script and style tags for a page that hosts the given scenes. A scene outside the engine lives in
   js/stargo-motion-<name>.js (plus css/stargo-motion-<name>.css when it has its own styles) and must load
   before js/stargo-motion.js, which picks it up from window.STARGO_SCENES. The world map is only loaded
   for the radar. */
const BUILT_IN = new Set(['loop', 'radar', 'studio']);
export function motionAssets(scenes) {
  const extra = [...new Set(scenes.map((n) => SCENE_FILE[n] || n))].filter((n) => !BUILT_IN.has(n));
  const css = [MOTION_CSS, ...extra.filter((n) => SCENE_CSS.has(n)).map((n) => `css/stargo-motion-${n}.css`)];
  const js = [
    ...(scenes.includes('radar') ? ['js/stargo-motion-map.js'] : []),
    ...extra.map((n) => `js/stargo-motion-${n}.js`),
    'js/stargo-motion.js',
  ];
  return {
    css: css.map((href) => `<link href="${href}" rel="stylesheet" type="text/css"/>`).join('\n'),
    js: js.map((src) => `<script src="${src}" defer></script>`).join(''),
  };
}
/* scene name → the file that defines it (several scenes may share one file) */
export const SCENE_FILE = {
  team: 'team',
  feed: 'phone',
  squad: 'phone',
  'cockpit-overview': 'cockpit',
  'cockpit-blocker': 'cockpit',
  'cockpit-budget': 'cockpit',
};
/* scene files that ship their own stylesheet */
export const SCENE_CSS = new Set([
  'team',
  'phone',
  'cockpit',
]);

/* pain — the homepage's four problem cards, in page order (S01–S04): one file and one stylesheet */
export const PAIN_SCENES = ['pain-inquiry', 'pain-chats', 'pain-sheet', 'pain-order'];
for (const n of PAIN_SCENES) SCENE_FILE[n] = 'pain';
SCENE_CSS.add('pain');

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
 *
 * The hosts are role="img" with a sentence for screen readers; the scenes
 * themselves are aria-hidden drawing. Every scene says on itself that it is
 * illustrative motion with demo data.
 */
import { escapeHtml } from './lib-html.mjs';

export const MOTION_LABEL = {
  /* enterprise.html (tools/code-art-enterprise.mjs, js/stargo-motion-enterprise.js): the four story
     panels behind 决定 / 核对 / 连接 / 经营 and the 「(原则)」 picture. */
  'ent-decide': {
    zh: '动态示意（演示数据）：需要审批的事项排队到关口——报价、开发信、产品页发布，审批人按你们定的规则；你批准或驳回，原因都记进审批记录。付款、正式申报和专业审阅始终由人把关。',
    en: 'Illustrative motion with demo data: items that need approval queue at the gate — a quote, an outreach email, a product page — each going to the approver your rules name; you approve or reject, and the reason goes into the approval record. Payments, official filings and professional reviews always stay with people.',
  },
  'ent-verify': {
    zh: '动态示意（演示数据）：AI 起草的报价逐项对照来源文件核对——型号、数量和贸易术语与询盘一致，交期与生产排期不符，被标出并退回修正，复核通过后才算完成。',
    en: 'Illustrative motion with demo data: an AI-drafted quote is checked line by line against its sources — model, quantity and trade term match the inquiry, the lead time does not match the production schedule, so it is flagged and sent back, and it counts as done only once the re-check passes.',
  },
  'ent-connect': {
    zh: '动态示意（演示数据）：邮箱、客户记录、产品知识、ERP 和网盘的产品资料，先说清可读、可改、需审批，经你授权后逐项接入同一套业务流程；网盘的财务目录没有授权，就不接入。',
    en: 'Illustrative motion with demo data: email, customer records, product knowledge, the ERP and the shared drive’s product folder are each set to read, change or needs-approval and join one workflow one at a time once you authorize them; the drive’s finance folder is not authorized, so it stays out.',
  },
  'ent-operate': {
    zh: '动态示意（演示数据）：本周的商机、订单、任务、异常、费用和待审批事项一天天汇总起来，按负责人和期限排好，要紧的决定排在最前面交给老板。',
    en: 'Illustrative motion with demo data: the week’s opportunities, orders, tasks, exceptions, costs and pending approvals add up day by day, sorted by owner and deadline, with the decisions that matter at the top for the owner.',
  },
  'ent-stop': {
    zh: '动态示意（演示数据）：一项 AI 任务按步骤运行，你按下暂停，它停在第 3 步，每一步都有记录；继续后从第 3 步接着做，不重跑已完成的步骤，最后停在等你审批，不会自动发送。',
    en: 'Illustrative motion with demo data: an AI task runs step by step; you press pause and it stops at step 3, with every step on record; when you resume it carries on from step 3 without redoing finished steps, and it ends waiting for your approval, never sending by itself.',
  },
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
  'ent-decide': 'enterprise',
  'ent-verify': 'enterprise',
  'ent-connect': 'enterprise',
  'ent-operate': 'enterprise',
  'ent-stop': 'enterprise',
  team: 'team',
  feed: 'phone',
  squad: 'phone',
};
/* scene files that ship their own stylesheet */
export const SCENE_CSS = new Set([
  'enterprise',
  'team',
  'phone',
]);

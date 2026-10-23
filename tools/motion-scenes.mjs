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
export const SCENE_FILE = { 'cockpit-overview': 'cockpit', 'cockpit-blocker': 'cockpit', 'cockpit-budget': 'cockpit' };
/* scene files that ship their own stylesheet */
export const SCENE_CSS = new Set(['cockpit']);

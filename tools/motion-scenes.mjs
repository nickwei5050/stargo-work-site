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
  team: 'team',
  feed: 'phone',
  squad: 'phone',
  'stage-find': 'stages',   // homemore: the five homepage stage cards
  'stage-sell': 'stages',
  'stage-make': 'stages',
  'stage-pay': 'stages',
  'stage-again': 'stages',
  org: 'org',               // homemore: the pricing band's enterprise card
};
/* scene files that ship their own stylesheet */
export const SCENE_CSS = new Set([
  'team',
  'phone',
  'stages',
  'org',
]);

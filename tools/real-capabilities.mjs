/**
 * 真实截图 on capabilities.html — the slots that drew the product in code show the system's own screens.
 *
 * The owner, 2026-10-24 17:27 UTC: 「你现在也全是代码了，我系统的画面都没有了！我需要真实系统截图
 * 放在特定的地方」. On this page that is every place where a code-drawn scene played the product's own
 * screens: the four area cards of 四个板块，十四类能力, the Sales Desk rows 01 统一询盘入口 and 03 客户全景,
 * the quote band 报价有依据，利润有边界，文件有版本, the 图片 / 视频 portrait and the first card of
 * 让 AI 团队把活干完 (288 个跨部门专业岗位). Which crop goes where is tools/replaceables.mjs CAP_REAL;
 * the crops are cut in tools/real-screens/capabilities.json; the slot markup is tools/real-screens.mjs
 * realShot(), with its 真实界面 · 演示数据 tag. This module adds what the page needs on top:
 *
 *   CAP_REAL_SIZES  each slot's sizes attribute, measured from the boxes at 1920, 1440, 1280, 1024,
 *                   768, 390 and 360 (the slots keep the boxes the scenes had, which were the photographs');
 *   realSlot()      one CAP_REAL entry → realShot();
 *   realFromImg()   the same, in place of a template <img>, keeping that <img>'s class list and inline
 *                   style the way hostFromImg() (tools/motion-capsales.mjs) did for the scenes, so each box,
 *                   its crop rules and the template's reveal (renok's blur on the quote picture) are the
 *                   element they were;
 *   sceneLeft()     a scene name stays in motionAssets() only while its slot has no real screen, so a page
 *                   that shows the screen no longer downloads the scene's script and sheet;
 *   withCapRealCss() the page's sheet for these slots (css/stargo-real-capabilities.css), after
 *                   css/stargo-real.css.
 *
 * Kept as code, as the owner's lane brief says: the Growth OS row backgrounds, the 每项工作 ring vignettes
 * and the atmosphere scenes (they are not product screens), the second crew card 员工任务、进度与成果 (no
 * capture of the digital employees' task board exists — site-screens/mobile/NOTES.md: StaffDeck was held
 * by its onboarding when the screens were taken, and raw/40 shows a failed cockpit task) and the third,
 * the teamwork example its own caption calls 示意.
 */
import { realShot, withRealCss, REAL_CSS } from './real-screens.mjs';
import { CAP_REAL } from './replaceables.mjs';

/* The boxes, as measured on 2026-10-24 (css px):
     area      1400×864 @1920, 1382×720 @1440, 1229×576 @1280, 983×614 @1024, 737×614 @768, 374×242 @390, 346×242 @360
     rows      349×244 from 1280 up and at 768, 223×244 @1024, 358×201 / 358×358 @390, 328×185 / 328×328 @360
     quote     630×420 @1920, 439×292 @1440, 389×259 @1280, 351×424 @1024, 260×424 @768, 360×240 @390, 330×220 @360
     creative  760×857 @1920, 640×857 @1440, 568×857 @1280, 440×955 @1024, 680×717 @768, 342×360 @390, 312×329 @360
     crew      632×724 from 1440 up, 592×724 @1280, 464×724 @1024, 703×500 @768, 358×350 @390, 328×350 @360 */
export const CAP_REAL_SIZES = {
  area: '(min-width: 1460px) 1400px, 96vw',
  row: '(max-width: 479px) 92vw, (min-width: 992px) and (max-width: 1279px) 223px, 350px',
  quote: '(max-width: 479px) 92vw, 34vw',
  creative: '(max-width: 991px) 89vw, 44vw',
  crew: '(max-width: 991px) 92vw, (min-width: 1440px) 632px, 46vw',
};

/** One CAP_REAL entry ({ id, upright?, pos?, uprightPos? }) as a slot. */
export function realSlot(shot, lang, cls, sizes) {
  if (!shot?.id) throw new Error('real-capabilities: a slot needs a crop id');
  return realShot(shot.id, lang, { upright: shot.upright, pos: shot.pos, uprightPos: shot.uprightPos, sizes, cls });
}

/** A template <img …> → a real-screen slot that carries the same classes (plus `extra`) and inline style. */
export function realFromImg(tag, shot, lang, extra, sizes) {
  if (!/^<img\b/.test(tag)) throw new Error(`real-capabilities: ${shot?.id} expects an <img> tag, got ${tag.slice(0, 40)}`);
  const cls = /\sclass="([^"]*)"/.exec(tag)?.[1] ?? '';
  const style = /\sstyle="([^"]*)"/.exec(tag)?.[1];
  const slot = realSlot(shot, lang, [cls, extra].filter(Boolean).join(' '), sizes);
  if (!style) return slot;
  /* the template's inline transform/filter first, the slot's own object-position variables after it */
  return /^<div class="[^"]*" style="/.test(slot)
    ? slot.replace(/^(<div class="[^"]*") style="/, `$1 style="${style.replace(/;?$/, ';')}`)
    : slot.replace(/^(<div class="[^"]*")/, `$1 style="${style}"`);
}

/* The scene each slot used to play, for the slots whose block reads CAP_REAL itself (tools/blocks/qx-news.mjs,
   tools/blocks/cn-faq.mjs, tools/code-art-capareas.mjs). The quote band and the AI-team card read theirs through
   CAP_V6A in tools/copy.mjs (`real`), and tools/build-site.mjs drops those scenes from the same entries. */
const SCENE_SLOT = {
  inbox: CAP_REAL.inbox, account: CAP_REAL.account, creative: CAP_REAL.creative,
  areaGrowth: CAP_REAL.areas?.[0], areaContext: CAP_REAL.areas?.[1], areaDeal: CAP_REAL.areas?.[2], areaTeam: CAP_REAL.areas?.[3],
};
/** Scene names whose slot still plays the scene (no real screen set for it). */
export const sceneLeft = (names) => names.filter((n) => !SCENE_SLOT[n]);

export const CAP_REAL_CSS = '<link href="css/stargo-real-capabilities.css" rel="stylesheet" type="text/css"/>';
/** css/stargo-real.css, then this page's own rules for its slots. */
export function withCapRealCss(h) {
  h = withRealCss(h);
  if (h.includes('css/stargo-real-capabilities.css')) return h;
  return h.replace(REAL_CSS, `${REAL_CSS}\n${CAP_REAL_CSS}`);
}

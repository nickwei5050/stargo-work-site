/**
 * The capability page's Sales Desk, quote and creative pictures as code-drawn scenes (owner,
 * 2026-10-23: 「你看看整个网站还有什么是可以图片改成代码的地方全部做好」). Four of the owner's AI
 * photographs became scenes in js/stargo-motion-sales.js (inbox, account), js/stargo-motion-quote.js
 * and js/stargo-motion-creative.js:
 *
 *   inbox     Sales Desk row 01 「统一询盘入口」 (tools/blocks/qx-news.mjs; was C05 c05-unified-inbox)
 *   account   Sales Desk row 03 「客户全景」 (tools/blocks/qx-news.mjs; was C06 c06-customer-360).
 *             Row 02 keeps the owner's real product screen.
 *   quote     03 「报价有依据，利润有边界，文件有版本」 (tools/blocks/rk-stats.mjs; was C07
 *             c07-quote-approval)
 *   creative  the 图片 / 视频 portrait (tools/blocks/cn-faq.mjs; was C08 c08-product-references)
 *
 * Each block turns its own <img> into the scene's host with hostFromImg(), which keeps the picture's
 * class list and inline style, so the box, its crop rules and the template's reveal (renok's blur and
 * scale on the quote picture) are the element they were. qubix's 1.1× photo zoom on hover is switched
 * off for the two rows' hosts (css/stargo-motion-sales.css): it would crop a drawn screen's app bar and tag.
 * The same photographs keep their other places (the orbit thumbnails, the 每项工作 ring).
 */
import { motionHost } from './motion-scenes.mjs';

/** The scenes this module places on capabilities.html, for motionAssets(). */
export const CAPSALES_SCENES = ['inbox', 'account', 'quote', 'creative'];

/**
 * An <img …> tag → a motion host carrying the same classes (plus `extra`) and inline style. Its alt is
 * dropped: the host is role="img" with the scene's own sentence (MOTION_LABEL).
 */
export function hostFromImg(tag, scene, lang, extra = '') {
  if (!/^<img\b/.test(tag)) throw new Error(`motion-capsales: ${scene} expects an <img> tag, got ${tag.slice(0, 40)}`);
  const cls = /\sclass="([^"]*)"/.exec(tag)?.[1] ?? '';
  const style = /\sstyle="([^"]*)"/.exec(tag)?.[1];
  const host = motionHost(scene, lang, [cls, extra].filter(Boolean).join(' '));
  return style ? host.replace('<div ', `<div style="${style}" `) : host;
}

/**
 * S10 — the FAQ. The accordion is the Mono template's own `.faq-wrapper`:
 * its open/close is the retained IX2 interaction on `.toggle-wrapper`,
 * tools/chrome.mjs turns each `.toggle-header` link into a <button> and
 * js/stargo-tabs.js keeps aria-expanded / aria-controls in step with it
 * (tools/verify-interactions.mjs drives all four by keyboard). Only the four
 * questions and answers change, here; the styling is css/stargo-ow.css.
 */
import { esc, heading, para, button } from './shared.mjs';

export function render({ lang, t, C, faqWrapper }) {
  const O = C.HOME_OW;
  const F = O.faq;
  let html = faqWrapper;
  if (!html.startsWith('<div class="faq-wrapper">')) throw new Error('ow faq: template accordion not found');
  const n = (html.match(/class="toggle-wrapper"/g) ?? []).length;
  if (n !== F.items.length) throw new Error(`ow faq: template has ${n} items, copy has ${F.items.length}`);
  let q = 0;
  html = html.replace(/(<div class="text-block-sec">\d\d<\/div><div>)[^<]*(<\/div>)/g, (m, a, b) => `${a}${esc(t(F.items[q++][0]))}${b}`);
  let a = 0;
  html = html.replace(/(<p class="paragraph">)[^<]*(<\/p>)/g, (m, x, y) => `${x}${para(lang, t(F.items[a++][1]))}${y}`);
  if (q !== n || a !== n) throw new Error(`ow faq: replaced ${q} questions and ${a} answers of ${n}`);
  return `<section class="ow-sec ow-sec--white ow-faq" aria-labelledby="ow-faq-title"><div class="ow-wrap ow-faq-grid">`
    + `<header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(F.eyebrow))}</p><h2 id="ow-faq-title" class="ow-h2">${heading(lang, t(F.title))}</h2>`
    + `<div class="ow-faq-more"><p class="ow-faq-more-t">${esc(t(F.more))}</p><p class="ow-faq-more-l">${para(lang, t(F.moreLine))}</p>`
    + `<p class="ow-faq-more-b">${button(t(O.whatsappHref), t(O.whatsappLabel), { kind: 'secondary', icon: 'whatsapp', external: true })}${button('#demo', t(O.demoLabel), { kind: 'link' })}</p></div></header>`
    + `<div class="ow-faq-list">${html}</div>`
    + `</div></section>`;
}

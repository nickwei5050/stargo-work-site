/**
 * S2 — the problem, in one screen: four short cards (the tool where it
 * happens, the sentence the homepage has always used) and the line that
 * hands over to the product. Text and an icon only: the old silo pictures
 * showed the solution as often as the problem (audit-home-zh).
 */
import { esc, heading, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const P = C.HOME_OW.pain;
  const cards = P.cards.map((c, i) => `<li class="ow-pain-card"><span class="ow-pain-top"><span class="ow-pain-ico">${ICON[c.icon]}</span><span class="ow-pain-where">${esc(t(c.where))}</span><span class="ow-pain-n" aria-hidden="true">0${i + 1}</span></span><p class="ow-pain-text">${heading(lang, t(c.text))}</p></li>`).join('');
  return `<section class="ow-sec ow-sec--white ow-pain" aria-labelledby="ow-pain-title"><div class="ow-wrap">`
    + `<header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(P.eyebrow))}</p><h2 id="ow-pain-title" class="ow-h2">${heading(lang, t(P.title))}</h2></header>`
    + `<ul class="ow-pain-grid">${cards}</ul>`
    + `<p class="ow-pain-close"><span>${heading(lang, t(P.close))}</span><a class="ow-textlink" href="#product">${esc(t(P.more))}${ICON.down}</a></p>`
    + `</div></section>`;
}

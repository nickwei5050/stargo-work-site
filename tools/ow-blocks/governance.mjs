/**
 * S4 — 「AI 起草，你来拍板。」 Three rules the site already states (approval
 * before anything goes out, prices from the company's price list with
 * approval below standard, a record of every step), each under a close-up of
 * the screen that shows it: the approval bar under a reply (ow22), the price
 * check with the PI in approval (ow21), and the steps AI wrote down (ow24).
 * The close-ups are 380 CSS px in phone type, rendered at 3x, so they read
 * at 15px or more side by side on a desktop and one under the other on a
 * phone. They are new scenes, not the PI and the reply the showcase and the
 * hero already show at full size.
 */
import { esc, heading, button, shot, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const G = O.governance;
  const rules = G.rules.map((r) => `<li class="ow-gate">`
    + shot({ id: r.shot, lang, t, O, title: t(r.window), label: t(r.title), sizes: '(max-width: 767px) calc(100vw - 40px), (max-width: 991px) 420px, 400px' })
    + `<div class="ow-gate-text"><span class="ow-tile ow-rule-ico">${ICON[r.icon]}</span><h3 class="ow-h3">${heading(lang, t(r.title))}</h3><p>${heading(lang, t(r.text))}</p></div></li>`).join('');
  return `<section class="ow-sec ow-sec--white ow-gov" aria-labelledby="ow-gov-title"><div class="ow-wrap">`
    + `<header class="ow-sec-head ow-gov-head"><div><p class="ow-eyebrow">${esc(t(G.eyebrow))}</p><h2 id="ow-gov-title" class="ow-h2">${heading(lang, t(G.title))}</h2></div>`
    + `<div><p class="ow-sec-lead">${heading(lang, t(G.lead))}</p><p class="ow-head-link">${button('enterprise.html', t(G.cta), { kind: 'link' })}</p></div></header>`
    + `<ol class="ow-gates">${rules}</ol>`
    + `</div></section>`;
}

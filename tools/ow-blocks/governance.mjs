/**
 * S4 — 「AI 起草，你来拍板。」 Three rules the site already states (approval
 * before anything goes out, prices from the company's list with approval
 * under it, a record of every step and approval) beside the two renders that
 * show them: ow21 (price check + PI in approval) and ow22 (the approval bar
 * under a reply). Those two crops are desktop-width interfaces, so phones get
 * the rule cards with the interface's own line quoted under each instead of
 * a 970px crop shrunk to 358px.
 */
import { esc, heading, button, shot, floatCard, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const G = O.governance;
  const rules = G.rules.map((r, i) => `<li class="ow-rule"><span class="ow-tile ow-rule-ico">${ICON[r.icon]}</span><h3 class="ow-h3">${heading(lang, t(r.title))}</h3><p>${esc(t(r.text))}</p>`
    + `<p class="ow-ui-line"><span class="ow-ui-tag">${esc(t(G.uiNote))}</span>${esc(t(r.ui))}</p></li>`).join('');
  const pi = shot({ id: 'ow21-pi-check', lang, t, O, label: t(G.captions.pi), sizes: '(max-width: 1199px) calc(100vw - 80px), 860px', floats: floatCard(t(G.float), { icon: 'shield', cls: 'ow-float--br' }) });
  const bar = shot({ id: 'ow22-approval-bar', lang, t, O, label: t(G.captions.bar), sizes: '(max-width: 1199px) calc(100vw - 80px), 820px' });
  return `<section class="ow-sec ow-sec--white ow-gov" aria-labelledby="ow-gov-title"><div class="ow-wrap">`
    + `<div class="ow-gov-top"><header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(G.eyebrow))}</p><h2 id="ow-gov-title" class="ow-h2">${heading(lang, t(G.title))}</h2><p class="ow-sec-lead">${heading(lang, t(G.lead))}</p>`
    + `<p class="ow-head-link">${button('enterprise.html', t(G.cta), { kind: 'link', icon: null })}</p></header>`
    + `<ol class="ow-rules">${rules}</ol></div>`
    + `<div class="ow-gov-shots">`
    + `<div class="ow-gov-shot ow-gov-shot--pi">${pi}<p class="ow-cap"><span class="ow-cap-n">2</span>${esc(t(G.captions.pi))}</p></div>`
    + `<div class="ow-gov-shot ow-gov-shot--bar">${bar}<p class="ow-cap"><span class="ow-cap-n">1</span>${esc(t(G.captions.bar))}</p></div>`
    + `</div></div></section>`;
}

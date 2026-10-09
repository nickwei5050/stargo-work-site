/**
 * S5 — three outcomes an owner cares about, as words only. No percentages,
 * no response times: nothing on this page was measured.
 */
import { esc, heading, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const R = C.HOME_OW.outcomes;
  const cards = R.cards.map((c, i) => `<li class="ow-out-card"><span class="ow-tile">${ICON[c.icon]}</span><h3 class="ow-h3 ow-out-title">${heading(lang, t(c.title))}</h3><p>${esc(t(c.text))}</p>`
    + `<ul class="ow-chips">${c.apps.map((a) => `<li>${esc(t(a))}</li>`).join('')}</ul></li>`).join('');
  return `<section class="ow-sec ow-sec--glow ow-out" aria-labelledby="ow-out-title"><div class="ow-wrap">`
    + `<header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(R.eyebrow))}</p><h2 id="ow-out-title" class="ow-h2">${heading(lang, t(R.title))}</h2></header>`
    + `<ol class="ow-out-grid">${cards}</ol></div></section>`;
}

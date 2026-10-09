/**
 * S9 — pricing teaser: the published prices and inclusions, nothing added.
 * The full ladder, the renewal switch and the comparison live on pricing.html.
 */
import { esc, heading, button } from './shared.mjs';

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const P = O.pricing;
  const rows = P.plans.map((p) => `<li class="ow-plan${p.main ? ' ow-plan--main' : ''}"><span class="ow-plan-name">${esc(t(p.name))}</span>`
    + `<span class="ow-plan-price"><strong>${esc(t(p.price))}</strong>${t(p.unit) ? `<small>${esc(t(p.unit))}</small>` : ''}</span>`
    + `<span class="ow-plan-text">${esc(t(p.text))}</span></li>`).join('');
  const note = t(P.currency) ? `<p class="ow-plan-note">${esc(t(P.currency))}</p>` : '';
  return `<section class="ow-sec ow-sec--glow ow-price" aria-labelledby="ow-price-title"><div class="ow-wrap ow-price-grid">`
    + `<header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(P.eyebrow))}</p><h2 id="ow-price-title" class="ow-h2">${heading(lang, t(P.title))}</h2><p class="ow-sec-lead">${heading(lang, t(P.lead))}</p>`
    + `<p class="ow-head-link">${button('pricing.html', t(P.cta), { kind: 'secondary' })}</p></header>`
    + `<div class="ow-plans"><ul>${rows}</ul>${note}</div>`
    + `</div></section>`;
}

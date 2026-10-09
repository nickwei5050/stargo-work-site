/**
 * The brand wall, for real customers only. It renders when assets/brands/
 * holds logo files (svg/png/webp/jpg) and is absent otherwise: no template
 * marks, no empty caption (audit-home-zh P0: a sample wall reads as fake
 * endorsement). The caption is HOME_BRAND_WALL.caption.
 */
import { esc } from './shared.mjs';

export function render({ t, C, brands }) {
  if (!brands.length) return '';
  const items = brands.map((f) => `<li><img src="assets/brands/${encodeURI(f)}" alt="" loading="lazy" decoding="async"/></li>`).join('');
  return `<section class="ow-logos" aria-label="${esc(t(C.HOME_BRAND_WALL.caption).replace(/^\(|\)$/g, ''))}"><div class="ow-wrap">`
    + `<p class="ow-eyebrow">${esc(t(C.HOME_BRAND_WALL.caption))}</p><ul class="ow-logos-grid">${items}</ul></div></section>`;
}

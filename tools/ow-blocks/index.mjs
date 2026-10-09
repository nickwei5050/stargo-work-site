/**
 * The OPEN WORK homepage, section by section (2026-10-09).
 *
 *   S1 hero → (real logo wall, only with files in assets/brands/) → S2 pain →
 *   S3 product showcase → S4 governance → S5 outcomes → S7 15 apps →
 *   S9 pricing teaser → S10 FAQ → S11 demo band
 *
 * (S6 channels and S8 proof are not on the page: both need facts the owner has
 * not confirmed — buyer-plan.md §6.) Words: tools/copy.mjs HOME_OW. Styles:
 * css/stargo-ow.css. Behaviour (tabs, lightbox): js/stargo-ow.js. Assembled by
 * tools/build-site.mjs PAGES['index.html'] inside the Mono page chrome.
 *
 * These are not tools/blocks modules: those are cut out of donor templates by
 * tools/capability-donors.mjs; these are this site's own markup.
 */
import { esc, ICON } from './shared.mjs';
import * as hero from './hero.mjs';
import * as logos from './logos.mjs';
import * as pain from './pain.mjs';
import * as showcase from './showcase.mjs';
import * as governance from './governance.mjs';
import * as outcomes from './outcomes.mjs';
import * as apps from './apps.mjs';
import * as pricing from './pricing.mjs';
import * as faq from './faq.mjs';
import * as contact from './contact.mjs';

export const SECTIONS = [hero, logos, pain, showcase, governance, outcomes, apps, pricing, faq, contact];

/** The page body: every section, in order, inside one <main>. */
export function renderHome(ctx) {
  return `<main class="ow" id="main">${SECTIONS.map((s) => s.render(ctx)).join('\n')}</main>`;
}

/** The lightbox every product shot opens; lives at the end of <body>, outside the page's transformed wrapper. */
export function lightbox({ t, C }) {
  const O = C.HOME_OW;
  return `<dialog class="ow-lightbox" id="ow-lightbox" aria-label="${esc(t(O.zoom))}"><div class="ow-lightbox-bar"><span class="ow-badge">${esc(t(O.badge))}</span>`
    + `<button type="button" class="ow-lightbox-close" data-ow-close aria-label="${esc(t(O.close))}">${ICON.close}</button></div>`
    + `<div class="ow-lightbox-body" data-lenis-prevent><img class="ow-lightbox-img" alt="" decoding="async"/></div></dialog>`;
}

/**
 * The OPEN WORK homepage, section by section (2026-10-09).
 *
 *   S1 hero → S1b demo video (round 2, 2026-10-10) → (real logo wall, only
 *   with files in assets/brands/) → S2 pain →
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
import * as demoVideo from './demo-video.mjs';
import * as logos from './logos.mjs';
import * as pain from './pain.mjs';
import * as showcase from './showcase.mjs';
import * as governance from './governance.mjs';
import * as outcomes from './outcomes.mjs';
import * as apps from './apps.mjs';
import * as pricing from './pricing.mjs';
import * as faq from './faq.mjs';
import * as contact from './contact.mjs';

export const SECTIONS = [hero, demoVideo, logos, pain, showcase, governance, outcomes, apps, pricing, faq, contact];

/** The page body: every section, in order, inside one <main>. */
export function renderHome(ctx) {
  return `<main class="ow" id="main">${SECTIONS.map((s) => s.render(ctx)).join('\n')}</main>`;
}

/** The lightbox every product shot opens; lives at the end of <body>, outside the page's transformed wrapper.
    js/stargo-ow.js names it after the shot it shows and sizes the picture. */
export function lightbox({ t, C }) {
  const O = C.HOME_OW;
  return `<dialog class="ow-lightbox" id="ow-lightbox" aria-label="${esc(t(O.zoom))}"><div class="ow-lightbox-bar"><span class="ow-badge">${esc(t(O.badge))}</span>`
    + `<button type="button" class="ow-lightbox-close" data-ow-close aria-label="${esc(t(O.close))}">${ICON.close}</button></div>`
    + `<div class="ow-lightbox-body" data-lenis-prevent tabindex="0" aria-label="${esc(t(O.zoom))}"><img class="ow-lightbox-img" alt="" decoding="async"/></div></dialog>`;
}

/**
 * The demo bar. It stands in for the template's floating pill on this page
 * (css/stargo-ow.css hides the pill here): once the hero's buttons have
 * scrolled out of view it slides up with the one demo button and WhatsApp,
 * and it leaves again while the demo band is on screen (js/stargo-ow.js).
 * Without the script it never shows; it is `inert` until it does.
 */
export function stickyBar({ t, C }) {
  const O = C.HOME_OW;
  return `<div class="ow-sticky" data-ow-sticky role="region" aria-label="${esc(t(O.sticky))}" inert>`
    + `<a class="ow-btn ow-btn--primary" href="contact.html"><span>${esc(t(O.demoLabel))}</span></a>`
    + `<a class="ow-sticky-wa" href="${esc(t(O.whatsappHref))}" target="_blank" rel="noopener noreferrer">${ICON.whatsapp}<span>WhatsApp</span></a></div>`;
}

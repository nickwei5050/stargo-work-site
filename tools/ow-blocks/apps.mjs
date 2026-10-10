/**
 * S7 — one workspace, 15 apps: the real sidebar (ow20-apps, 2x render) beside
 * the four groups of buyer-plan S7, one plain line each. App names exactly as
 * the sidebar writes them; AI 网关 is named, not explained.
 */
import { esc, heading, para, plain, button, shot, ICON } from './shared.mjs';

export function render({ lang, t, C, appsCta }) {
  const O = C.HOME_OW;
  const A = O.apps;
  /* the product page points the button at its own catalogue */
  const cta = appsCta ?? { href: 'capabilities.html', label: A.cta };
  const count = A.groups.reduce((n, g) => n + g.apps.length, 0);
  if (count !== 15) throw new Error(`ow apps: the groups name ${count} apps, the sidebar has 15`);
  const groups = A.groups.map((g) => `<li class="ow-group"><span class="ow-tile">${ICON[g.icon]}</span><div class="ow-group-body"><h3 class="ow-h3">${heading(lang, t(g.title))}</h3><p>${para(lang, t(g.line))}</p><ul class="ow-chips">${g.apps.map((a) => `<li>${esc(t(a))}</li>`).join('')}</ul></div></li>`).join('');
  const side = shot({ id: 'ow20-apps', lang, t, O, title: '', label: plain(t(A.title)), sizes: '260px' });
  const tasks = `<div class="ow-tasks"><p class="ow-tasks-label">${esc(t(A.tasksLabel))}</p><ul class="ow-chips ow-chips--blue">${A.tasks.map((x) => `<li>${esc(t(x))}</li>`).join('')}</ul></div>`;
  return `<section class="ow-sec ow-sec--white ow-apps" aria-labelledby="ow-apps-title"><div class="ow-wrap ow-apps-grid">`
    + `<div class="ow-apps-side">${side}</div>`
    + `<div class="ow-apps-main"><header class="ow-sec-head"><p class="ow-eyebrow">${esc(t(A.eyebrow))}</p><h2 id="ow-apps-title" class="ow-h2">${heading(lang, t(A.title))}</h2><p class="ow-sec-lead">${heading(lang, t(A.lead))}</p></header>`
    + `<ul class="ow-groups">${groups}</ul>${tasks}`
    + `<p class="ow-head-link">${button(cta.href, t(cta.label), { kind: 'secondary' })}</p></div>`
    + `</div></section>`;
}

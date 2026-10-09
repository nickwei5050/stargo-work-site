/**
 * The four product pages on the OPEN WORK design (2026-10-09, phase C2):
 *
 *   capabilities.html  「产品」          renderProduct
 *   workforce.html     「数字员工」      renderWorkforce
 *   intelligence.html  「主动提醒与记忆」 renderReminders
 *   enterprise.html    「安全与接入」    renderSecurity
 *
 * They are assembled like the homepage (tools/build-site.mjs owShell: the
 * Mono chrome, the template's FAQ accordion and demo form) and reuse its
 * pieces — the framed product shot with its 「演示数据」 badge, buttons,
 * headings, icon tiles, the 15-apps block, the FAQ and the demo band — so the
 * site reads as one product. The pictures are OPEN WORK renders only
 * (tools/openwork); desktop shows the full app at up to 1200px, phones the
 * card render of the same scene. Words: tools/copy.mjs PAGE_OW (plus the older
 * page copy it points at). Styles: css/stargo-ow.css ("inner pages").
 *
 * Anchors other pages link to are kept: capabilities #atlas, #g01–#g14,
 * #creative-images/-video/-viral and the floating pill's #story-1…4;
 * workforce #lx-role-groups and #lx-team; intelligence #lx-context,
 * #lx-ontology (tools/verify-interactions.mjs) and #lx-evolution.
 */
import { esc, heading, para, plain, button, shot, floatCard, ICON, shotNoteFor, ILLUSTRATIVE } from './shared.mjs';
import * as apps from './apps.mjs';
import * as faq from './faq.mjs';
import * as contact from './contact.mjs';

/* The glass card over a shot's bottom-right corner. On the split screens
   (chat + an app panel, ow08–ow11) the panel's status line ends in the
   render's own 「演示数据」 at that corner, so the card sits further left. */
const floatAt = (id) => (ILLUSTRATIVE.has(id) ? 'ow-float--br ow-float--panel' : 'ow-float--br');

/* a full-app render: 1200px wide from 1280 up, the column below that */
export const SIZES_APP = '(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 80px), 1200px';

export const eyebrow = (t, x) => `<p class="ow-eyebrow">${esc(t(x))}</p>`;
export const chips = (t, list, cls = '') => `<ul class="ow-chips${cls ? ` ${cls}` : ''}">${list.map((a) => `<li>${esc(t(a))}</li>`).join('')}</ul>`;

/** A section header: eyebrow, two-tone heading, lead. */
export function head({ lang, t }, x, id, { center = false, cls = '' } = {}) {
  return `<header class="ow-sec-head${center ? ' ow-sec-head--center' : ''}${cls ? ` ${cls}` : ''}">${eyebrow(t, x.eyebrow)}`
    + `<h2 id="${id}" class="ow-h2">${heading(lang, t(x.title))}</h2>`
    + (x.lead ? `<p class="ow-sec-lead">${heading(lang, t(x.lead))}</p>` : '') + `</header>`;
}

/** The page's one status note (buyer-plan §5: one note, not a line per section). */
export function statusNote({ lang, t, C }, text) {
  return `<aside class="ow-status" aria-label="${esc(t(C.PAGE_OW.statusLabel))}"><span class="ow-status-ico">${ICON.info}</span>`
    + `<p><strong>${esc(t(C.PAGE_OW.statusLabel))}</strong>${para(lang, t(text))}</p></aside>`;
}

/**
 * The first screen of a product page: what the page is about, the demo
 * button, a second link into the page, and the OPEN WORK screen that shows it
 * (eager, fetchpriority=high). `phone` is what stands in for a desk-only
 * render below 992px.
 */
export function pageHero(ctx, H, { id, card = null, phone = '', moreIcon = 'down', moreKind = 'secondary' }) {
  const { lang, t, C } = ctx;
  const O = C.HOME_OW;
  const figure = shot({
    id, card, deskOnly: !card, lang, t, O, eager: true, title: t(H.window), label: t(H.label),
    sizes: SIZES_APP, zoomW: 1800, floats: floatCard(t(H.float), { icon: 'check', cls: floatAt(id) }),
  });
  return `<section class="ow-hero ow-hero--page" aria-labelledby="ow-hero-title"><div class="ow-wrap">`
    + `<div class="ow-hero-head">`
    + `<p class="ow-eyebrow ow-eyebrow--pill"><span class="ow-spark" aria-hidden="true">${ICON.spark}</span>${esc(t(H.eyebrow))}</p>`
    + `<h1 id="ow-hero-title" class="ow-h1"><span>${heading(lang, t(H.title[0]))}</span> <span class="ow-h1-2">${heading(lang, t(H.title[1]))}</span></h1>`
    + `<p class="ow-lead">${heading(lang, t(H.lead))}</p>`
    + `<div class="ow-cta-row">${button('contact.html', t(O.demoLabel), { kind: 'primary', cls: 'ow-hero-cta' })}${H.more ? button(H.more.href, t(H.more.label), { kind: moreKind, icon: moreIcon }) : ''}</div>`
    + `</div>`
    + `<div class="ow-hero-stage ow-hero-stage--page">${figure}${phone}</div>`
    + `<p class="ow-shot-note${card ? '' : ' ow-shot-note--desk'}">${heading(lang, t(shotNoteFor(O, id, card)))}</p>`
    + `</div></section>`;
}

/** 「读了什么 / AI 做了什么 / 你批什么」, one under the other. */
function steps({ lang, t, C }, x) {
  const L = C.PAGE_OW.stepLabels;
  return `<dl class="ow-steps ow-steps--col">${['read', 'did', 'approve'].map((k, i) => `<div class="ow-step ow-step--${k}"><dt><span class="ow-step-n" aria-hidden="true">${i + 1}</span>${esc(t(L[k]))}</dt><dd>${heading(lang, t(x[k]))}</dd></div>`).join('')}</dl>`;
}

/** A framed full-app screen with its phone card, 1200px on desktop. */
const appShot = ({ lang, t, C }, x, extra = {}) => shot({
  id: x.shot, card: x.card, lang, t, O: C.HOME_OW, title: t(x.window), label: plain(t(x.label ?? x.title)),
  sizes: SIZES_APP, zoomW: 1800, floats: x.float ? floatCard(t(x.float), { icon: 'shield', cls: floatAt(x.shot) }) : '', ...extra,
});

/** A tight close-up (380 CSS px phone type at 3x) beside its words. */
const closeUp = ({ lang, t, C }, x) => shot({ id: x.shot, lang, t, O: C.HOME_OW, title: t(x.window), label: t(x.title), sizes: '(max-width: 767px) calc(100vw - 40px), (max-width: 991px) 480px, 460px' });

/** Cards with a gradient icon tile, a title and a line or two. */
export function cards({ lang, t }, list, { cls = '' } = {}) {
  return `<ul class="ow-cards${cls ? ` ${cls}` : ''}">${list.map((c) => `<li class="ow-card"${c.id ? ` id="${c.id}"` : ''}><span class="ow-tile">${ICON[c.icon]}</span>`
    + `<h3 class="ow-h3">${heading(lang, t(c.title))}</h3><p>${para(lang, t(c.text))}</p>`
    + (c.records ? chips(t, c.records, 'ow-chips--blue') : '') + `</li>`).join('')}</ul>`;
}

/** Numbered steps in a row (a column on phones). */
function flowSteps({ lang, t }, list) {
  return `<ol class="ow-flow">${list.map((x, i) => `<li class="ow-flow-step"><span class="ow-flow-top"><span class="ow-tile">${ICON[x.icon]}</span><span class="ow-flow-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></span>`
    + `<h3 class="ow-h3">${heading(lang, t(x.title))}</h3>${x.text ? `<p>${para(lang, t(x.text))}</p>` : ''}</li>`).join('')}</ol>`;
}

/** A chain of short labels with arrows (a demo flow, the improvement loop). */
function chain({ t }, list, { label = '', cls = '' } = {}) {
  return `<div class="ow-chain${cls ? ` ${cls}` : ''}">${label ? `<span class="ow-chain-label">${esc(label)}</span>` : ''}<ol>${list.map((x, i) => `<li><span>${esc(t(x))}</span>${i < list.length - 1 ? ICON.arrow : ''}</li>`).join('')}</ol></div>`;
}

/** 「a → b → c」 in both languages, as a list of { zh, en } steps. */
function splitFlow(b) {
  const zh = b.zh.split(' → ');
  const en = b.en.split(' → ');
  if (zh.length !== en.length) throw new Error('pages: the flow has a different number of steps in zh and en');
  return zh.map((x, i) => ({ zh: x, en: en[i] }));
}

export const section = (cls, id, labelledby, inner) => `<section class="ow-sec ${cls}"${id ? ` id="${id}"` : ''} aria-labelledby="${labelledby}"><div class="ow-wrap">${inner}</div></section>`;

/* ===================================================== capabilities.html */

/** One job: what it is and its three steps above the full screen; the quote chapter adds the price check close-up. */
function chapter(ctx, ch, i) {
  const { lang, t } = ctx;
  const hid = `ow-ch-${ch.key}`;
  const text = `<div class="ow-ch-text"><p class="ow-eyebrow">${esc(t(ch.eyebrow))}</p><h2 id="${hid}" class="ow-h2">${heading(lang, t(ch.title))}</h2>`
    + `<p class="ow-sec-lead">${heading(lang, t(ch.lead))}</p>`
    + `<div class="ow-ch-apps"><span>${esc(t(ctx.C.PAGE_OW.appsLabel))}</span>${chips(t, ch.apps)}</div></div>`;
  const detail = ch.detail ? `<div class="ow-ch-detail"><div class="ow-ch-detail-shot">${closeUp(ctx, ch.detail)}</div>`
    + `<div class="ow-ch-detail-text"><span class="ow-tile">${ICON.tag}</span><h3 class="ow-h3">${heading(lang, t(ch.detail.title))}</h3><p>${para(lang, t(ch.detail.text))}</p></div></div>` : '';
  return section(`ow-chapter ${i % 2 ? 'ow-sec--white' : 'ow-sec--glow'}`, ch.anchor, hid,
    `<div class="ow-ch-head">${text}${steps(ctx, ch)}</div>`
    + `<div class="ow-ch-shot">${appShot(ctx, { ...ch, label: ch.eyebrow })}</div>` + detail);
}

/** The four chapters, as a row of jump links under the hero. */
function chapterIndex({ lang, t, C }, P) {
  return `<nav class="ow-jumps" aria-label="${esc(t(P.chaptersLabel))}"><div class="ow-wrap"><ol>${P.chapters.map((ch) => `<li><a href="#${ch.anchor}"><span class="ow-tile">${ICON[ch.icon]}</span>`
    + `<span class="ow-jump-t"><small>${esc(t(ch.eyebrow))}</small>${heading(lang, plain(t(ch.title)))}</span></a></li>`).join('')}</ol></div></nav>`;
}

/** Four apps opened beside the chat: a tab set like the homepage showcase. */
function appTabs(ctx, P) {
  const { lang, t, C } = ctx;
  const X = P.panel;
  if (!X.tabs.some((x) => x.key === X.defaultTab)) throw new Error('pages: panel default tab missing');
  const tabs = X.tabs.map((x) => {
    const on = x.key === X.defaultTab;
    return `<button type="button" role="tab" class="ow-tab" id="ow-ptab-${x.key}" aria-controls="ow-ppanel-${x.key}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${ICON[x.icon]}<span>${esc(t(x.label))}</span></button>`;
  }).join('');
  const panels = X.tabs.map((x) => {
    const on = x.key === X.defaultTab;
    return `<div class="ow-panel" role="tabpanel" id="ow-ppanel-${x.key}" aria-labelledby="ow-ptab-${x.key}" tabindex="0"${on ? '' : ' hidden'}>`
      + `<div class="ow-panel-text"><p class="ow-panel-sum"><span class="ow-kicker">${esc(t(C.PAGE_OW.demoKicker))}</span>${heading(lang, t(x.summary))}</p>`
      + (x.more ? `<p class="ow-panel-more">${button(x.more.href, t(x.more.label), { kind: 'link' })}</p>` : '') + `</div>`
      + appShot(ctx, x) + `</div>`;
  }).join('');
  return section('ow-sec--glow ow-show ow-panelshow', 'apps-panel', 'ow-panel-title',
    head(ctx, X, 'ow-panel-title', { center: true })
    + `<div class="ow-tabs" data-ow-tabs><div class="ow-tablist-wrap"><div class="ow-tablist" role="tablist" aria-label="${esc(t(X.tablist))}">${tabs}</div></div>${panels}</div>`
    + `<p class="ow-shot-note">${heading(lang, t(shotNoteFor(C.HOME_OW, X.tabs.flatMap((x) => [x.shot, x.card]))))}</p>`);
}

/** The register, folded: one <details> per group (js/stargo-ow.js opens the one an address names). */
function catalogue(ctx) {
  const { lang, t, C, capTitle } = ctx;
  const K = C.PAGE_OW.product.catalogue;
  const L = C.CATALOGUE_LABELS;
  const D = C.CATALOGUE_DETAIL;
  const G = C.CAPABILITY_GROUPS;
  const missing = G.filter((g) => !D[g.n]).map((g) => g.n);
  if (missing.length || Object.keys(D).length !== G.length) throw new Error(`pages: catalogue detail must match the groups (missing ${missing.join(',') || '-'})`);
  const total = G.reduce((n, g) => n + g.items.length, 0);
  const txt = (v) => para(lang, t(v));
  const roleTable = (r) => {
    const sum = r.rows.reduce((n, [, k]) => n + k, 0);
    if (sum !== r.total) throw new Error(`pages: role table sums to ${sum}, not ${r.total}`);
    return `<table class="ow-cat-table"><caption>${esc(t(r.caption))}</caption><thead><tr><th scope="col">${esc(t(r.head[0]))}</th><th scope="col">${esc(t(r.head[1]))}</th></tr></thead><tbody>`
      + r.rows.map(([name, k]) => `<tr><th scope="row">${esc(t(name))}</th><td>${k}</td></tr>`).join('')
      + `</tbody><tfoot><tr><th scope="row">${esc(t(r.sum))}</th><td>${r.total}</td></tr></tfoot></table>`;
  };
  /* Each topic: its sub-heading, lede, points, value line and outputs. The
     per-topic availability lines are not printed: the page's one status
     note above the list says what they said. */
  const part = (p) => (p.heading ? `<h4>${esc(t(p.heading))}</h4>` : '')
    + (p.lede ? `<p class="ow-cat-lede">${txt(p.lede)}</p>` : '')
    + (p.roles ? roleTable(p.roles) : '')
    + `<ul class="ow-cat-points">${p.points.map((x) => `<li><strong>${esc(t(x.title))}</strong>${txt(x.text)}</li>`).join('')}</ul>`
    + (p.value ? `<p class="ow-cat-value">${txt(p.value)}</p>` : '')
    + (p.outputs ? `<p class="ow-cat-out"><strong>${esc(t(L.outputs))}</strong>${txt(p.outputs)}</p>` : '');
  const groups = G.map((g) => {
    const d = D[g.n];
    return `<details class="ow-cat-g" id="g${g.n}"><summary><span class="ow-cat-n">${g.n}</span>`
      + `<span class="ow-cat-head"><span class="ow-cat-name">${heading(lang, t(g.name))}</span><span class="ow-cat-sum">${txt(d.summary)}</span></span>`
      + `<span class="ow-cat-count">${g.items.length} ${esc(t(K.entries))}</span><span class="ow-cat-ico" aria-hidden="true">${ICON.plus}</span></summary>`
      + `<div class="ow-cat-body"><div class="ow-cat-detail">${d.parts.map(part).join('')}</div>`
      + `<div class="ow-cat-reg"><h4>${esc(t(L.register))}</h4><ul>${g.items.map(([name, gloss, zhName]) => `<li><strong>${capTitle(lang)(name, zhName)}</strong>${esc(t(gloss))}</li>`).join('')}</ul></div>`
      + `</div></details>`;
  }).join('');
  return section('ow-sec--white ow-cat', 'atlas', 'ow-cat-title',
    `<div class="ow-cat-top">${head(ctx, { eyebrow: K.eyebrow, title: K.title(G.length, total), lead: K.lead }, 'ow-cat-title')}`
    + `<button type="button" class="ow-btn ow-btn--secondary ow-cat-all" data-ow-expand="#atlas" data-label-open="${esc(t(K.expand))}" data-label-close="${esc(t(K.collapse))}" aria-pressed="false">${ICON.plus}<span>${esc(t(K.expand))}</span></button></div>`
    + statusNote(ctx, K.status)
    + `<div class="ow-cat-list">${groups}</div>`);
}

export function renderProduct(ctx) {
  const { lang, t, C } = ctx;
  const P = C.PAGE_OW.product;
  const A = C.HOME_OW.apps;
  const tasks = `<div class="ow-hero-tasks"><p class="ow-tasks-label">${esc(t(A.tasksLabel))}</p>${chips(t, A.tasks, 'ow-chips--blue')}`
    + `<p class="ow-hero-tasks-l">${heading(lang, t(A.tasksActions).replace('{list}', C.HOME_OW.showcase.quick.actions.map(([x]) => t(x)).join(lang === 'zh' ? '、' : ', ')))}</p></div>`;
  const creative = section('ow-sec--glow ow-creative', 'creative', 'ow-creative-title',
    head(ctx, P.creative, 'ow-creative-title') + cards(ctx, P.creative.items));
  const F = C.HOME_OW.faq;
  const pick = { home: F.items, caps: C.CAPABILITIES.faq };
  const faqCopy = { ...F, eyebrow: P.faq.eyebrow, title: P.faq.title, items: P.faq.pick.map(([from, i]) => pick[from][i]) };
  return `<main class="ow ow-inner" id="main">`
    + pageHero(ctx, P.hero, { id: 'ow07-welcome', phone: tasks })
    + chapterIndex(ctx, P)
    + P.chapters.map((ch, i) => chapter(ctx, ch, i)).join('')
    + appTabs(ctx, P)
    + apps.render({ ...ctx, appsCta: P.apps.cta })
    + creative
    + catalogue(ctx)
    + faq.render({ ...ctx, faq: faqCopy })
    + contact.render(ctx)
    + `</main>`;
}

/* ======================================================== workforce.html */

export function renderWorkforce(ctx) {
  const { lang, t, C } = ctx;
  const W = C.PAGE_OW.workforce;
  const R = C.WORKFORCE_ROLE_GROUPS;
  const roles = W.roles.list.map((r) => `<li class="ow-role"><span class="ow-role-av" style="--c:${r.color}" aria-hidden="true">${esc(t(r.letter))}</span>`
    + `<div class="ow-role-body"><h3 class="ow-h3">${esc(t(r.name))}</h3><p class="ow-role-job">${esc(t(r.job))}</p><p>${para(lang, t(r.text))}</p>`
    + `<span class="ow-role-group">${esc(t(r.group))}</span></div></li>`).join('');
  /* the ten groups, in the page's order; names and counts are WORKFORCE_ROLE_GROUPS' own */
  const byName = new Map(R.groups.map((g) => [g.name.zh, g]));
  const ordered = W.groups.order.map((n) => {
    const g = byName.get(n);
    if (!g) throw new Error(`pages: workforce group ${n} is not in WORKFORCE_ROLE_GROUPS`);
    return g;
  });
  const sum = ordered.reduce((n, g) => n + g.count, 0);
  if (ordered.length !== R.groups.length || sum !== R.total.count || sum !== 288) throw new Error(`pages: the ten groups add up to ${sum}, the page says 288`);
  const max = Math.max(...ordered.map((g) => g.count));
  const bars = `<ol class="ow-bars">${ordered.map((g) => `<li><span class="ow-bar-name">${esc(t(g.name))}</span><span class="ow-bar"><i style="--w:${(g.count / max * 100).toFixed(1)}%"></i></span><span class="ow-bar-n">${g.count}</span></li>`).join('')}`
    + `<li class="ow-bars-total"><span class="ow-bar-name">${esc(t(R.total.name))}</span><span class="ow-bar ow-bar--none"></span><span class="ow-bar-n">${R.total.count}</span></li></ol>`;
  return `<main class="ow ow-inner" id="main">`
    + pageHero(ctx, W.hero, { id: 'ow11-staff', card: 'ow25-staff-card' })
    + section('ow-sec--white ow-roles-sec', 'roles', 'ow-roles-title', head(ctx, W.roles, 'ow-roles-title') + `<ul class="ow-roles">${roles}</ul>`)
    + section('ow-sec--glow ow-team', 'lx-team', 'ow-team-title', head(ctx, W.team, 'ow-team-title') + flowSteps(ctx, W.team.steps)
      + `<p class="ow-team-limits">${ICON.shield}<span>${para(lang, t(W.team.limits))}</span></p>`)
    + section('ow-sec--white ow-groups-sec', 'lx-role-groups', 'ow-groups-title',
      `<div class="ow-split ow-split--groups">${head(ctx, W.groups, 'ow-groups-title')}<div>${bars}${statusNote(ctx, R.note)}</div></div>`)
    + section('ow-sec--glow ow-traits', 'traits', 'ow-traits-title', head(ctx, W.traits, 'ow-traits-title') + cards(ctx, W.traits.cards))
    + contact.render(ctx)
    + `</main>`;
}

/* ===================================================== intelligence.html */

export function renderReminders(ctx) {
  const { lang, t, C } = ctx;
  const M = C.PAGE_OW.reminders;
  const alerts = `<ul class="ow-alerts">${M.watch.items.map((x) => `<li class="ow-alert"><span class="ow-alert-ico">${ICON[x.icon]}</span><p>${para(lang, t(x.text))}</p></li>`).join('')}</ul>`
    + `<p class="ow-stop">${ICON.shield}<span>${para(lang, t(M.watch.stop))}</span></p>`;
  const A = M.automation;
  const auto = `<div class="ow-ch-head ow-ch-head--auto"><div class="ow-ch-text">${eyebrow(t, A.eyebrow)}<h2 id="ow-auto-title" class="ow-h2">${heading(lang, t(A.title))}</h2><p class="ow-sec-lead">${heading(lang, t(A.lead))}</p></div>`
    + `<div class="ow-ch-side">${chain(ctx, A.flow, { label: t(A.flowLabel) })}<p class="ow-ch-rule">${para(lang, t(A.rule))}</p></div></div>`
    + `<div class="ow-ch-shot">${appShot(ctx, A)}</div>`;
  const I = M.improve;
  return `<main class="ow ow-inner" id="main">`
    + pageHero(ctx, M.hero, { id: 'ow06-follow', card: 'ow16-follow-card' })
    + section('ow-sec--white ow-watch', 'lx-reminders', 'ow-watch-title', head(ctx, M.watch, 'ow-watch-title') + alerts)
    + section('ow-sec--glow ow-chapter', 'lx-automation', 'ow-auto-title', auto)
    + `<section class="ow-sec ow-sec--white ow-memory" id="lx-context" aria-labelledby="ow-mem-title"><div class="ow-wrap">`
    + `<div id="lx-ontology">${head(ctx, M.memory, 'ow-mem-title')}</div>${cards(ctx, M.memory.items, { cls: 'ow-cards--3' })}</div></section>`
    + section('ow-sec--glow ow-improve', 'lx-evolution', 'ow-imp-title', head(ctx, I, 'ow-imp-title', { center: true }) + chain(ctx, splitFlow(I.flow), { cls: 'ow-chain--loop' })
      + statusNote(ctx, M.status))
    + contact.render(ctx)
    + `</main>`;
}

/* ======================================================= enterprise.html */

export function renderSecurity(ctx) {
  const { lang, t, C } = ctx;
  const S = C.PAGE_OW.security;
  const E = C.ENTERPRISE;
  const A = S.approvals;
  const gates = A.shots.map((r) => `<li class="ow-gate">${closeUp(ctx, r)}`
    + `<div class="ow-gate-text"><span class="ow-tile ow-rule-ico">${ICON[r.icon]}</span><h3 class="ow-h3">${heading(lang, t(r.title))}</h3><p>${heading(lang, t(r.text))}</p></div></li>`).join('');
  const approvals = section('ow-sec--white ow-gov ow-approvals', 'approvals', 'ow-appr-title',
    `<div class="ow-split">${head(ctx, A, 'ow-appr-title')}<div class="ow-gatelist"><p class="ow-tasks-label">${esc(t(A.gatesLabel))}</p>${chips(t, A.gates, 'ow-chips--blue')}</div></div>`
    + `<ol class="ow-gates ow-gates--2">${gates}</ol>`);
  const U = S.automation;
  const automation = section('ow-sec--glow ow-chapter', 'guardrails', 'ow-guard-title',
    `<div class="ow-ch-head"><div class="ow-ch-text">${eyebrow(t, U.eyebrow)}<h2 id="ow-guard-title" class="ow-h2">${heading(lang, t(U.title))}</h2><p class="ow-sec-lead">${heading(lang, t(U.lead))}</p></div>`
    + `<ul class="ow-points">${U.points.map((p) => `<li><span class="ow-tile">${ICON[p.icon]}</span><div><h3 class="ow-h3">${heading(lang, t(p.title))}</h3><p>${para(lang, t(p.text))}</p></div></li>`).join('')}</ul></div>`
    + `<div class="ow-ch-shot">${appShot(ctx, U)}</div>`);
  const K = S.controls;
  const controls = section('ow-sec--white ow-controls', 'controls', 'ow-ctl-title',
    head(ctx, K, 'ow-ctl-title') + cards(ctx, K.cards, { cls: 'ow-cards--5' })
    + `<div class="ow-ctl-list"><p class="ow-tasks-label">${esc(t(K.controlsLabel))}</p>${chips(t, K.controls)}`
    + `<p class="ow-ctl-deploy"><strong>${esc(t(K.deployLabel))}</strong>${para(lang, t(K.deploy))}</p></div>`);
  const T = E.table;
  const strip = (x) => t(x).replace(/^\(|\)$/g, '');
  const table = `<div class="ow-table-wrap"><table class="ow-table"><thead><tr>${T.headers.map((h) => `<th scope="col">${esc(strip(h))}</th>`).join('')}</tr></thead><tbody>`
    + T.rows.map((r) => `<tr><th scope="row">${esc(t(r[0]))}</th><td data-label="${esc(strip(T.headers[1]))}">${para(lang, t(r[1]))}</td><td data-label="${esc(strip(T.headers[2]))}">${para(lang, t(r[2]))}</td></tr>`).join('')
    + `</tbody></table></div>`;
  const connect = section('ow-sec--glow ow-connect', 'connect', 'ow-conn-title', head(ctx, S.connect, 'ow-conn-title') + table);
  const R = S.rollout;
  if (R.steps.length !== E.approach.length) throw new Error('pages: the rollout steps must match ENTERPRISE.approach');
  const rollout = section('ow-sec--white ow-rollout', 'rollout', 'ow-roll-title',
    `<div class="ow-split">${head(ctx, R, 'ow-roll-title')}<p class="ow-head-link">${button(R.button.href, t(R.button.label), { kind: 'secondary' })}</p></div>`
    + `<ol class="ow-rollsteps">${R.steps.map(([title, text], i) => `<li><span class="ow-roll-n">${String(i + 1).padStart(2, '0')}</span><h3 class="ow-h3">${heading(lang, t(title))}</h3><p>${para(lang, t(text))}</p></li>`).join('')}</ol>`
    + statusNote(ctx, S.status));
  return `<main class="ow ow-inner" id="main">`
    + pageHero(ctx, S.hero, { id: 'ow05-brief', card: 'ow15-brief-card' })
    + approvals + automation + controls + connect + rollout
    + contact.render(ctx)
    + `</main>`;
}

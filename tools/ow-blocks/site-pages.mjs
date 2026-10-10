/**
 * The rest of the site on the OPEN WORK design (2026-10-09, phase C2 pass 2):
 *
 *   pricing.html   renderPricing    five plans with prices above the fold,
 *                                   one recommended plan, the comparison chart
 *                                   and the ten questions
 *   about.html     renderAbout      what STARGO WORK / OPEN WORK is, the story,
 *                                   the three principles, where to start
 *   contact.html   renderContact    the demo form (plan preselected from
 *                                   ?plan=…), WeChat, phone, WhatsApp, e-mail,
 *                                   the company line, how the demo works
 *   privacy.html,  renderLegal      the legal text in one readable column
 *   terms.html                      (the third-party notices page was removed
 *                                   on 2026-10-10; its imagery note is in terms)
 *   404.html       renderNotFound   three ways on, at any depth (paths are
 *                                   made absolute in tools/build-site.mjs)
 *
 * They replace a Scalora/renok/cinery pricing page (stock faces, ★★★★★ review
 * carousel, two "recommended" plans), a cinery about page (fashion films
 * labelled as AI employees, a review carousel), the Mono contact page (a stock
 * portrait film presented as the company's voice) and Mono's post layout for
 * the legal pages (a 810px globe banner with baked-in English, the retired
 * desktop and sw033 on notices). Same shell, pieces and styles as the product
 * pages (tools/ow-blocks/pages.mjs, css/stargo-ow.css). Words: tools/copy.mjs
 * SITE_OW, plus the facts it points at (PRICING, ABOUT, LEGAL, CONTACT_INFO).
 */
import { esc, heading, para, button, ICON, asset } from './shared.mjs';
import { eyebrow, chips, head, pageHero, cards, section } from './pages.mjs';
import * as contact from './contact.mjs';

const tx = (t, v) => (typeof v === 'string' ? v : t(v));

/** The hero head every one of these pages opens with: eyebrow pill, two-tone h1, lead. */
function heroHead({ lang, t }, H, extra = '') {
  return `<div class="ow-hero-head">`
    + `<p class="ow-eyebrow ow-eyebrow--pill"><span class="ow-spark" aria-hidden="true">${ICON.spark}</span>${esc(t(H.eyebrow))}</p>`
    + `<h1 id="ow-hero-title" class="ow-h1">${Array.isArray(H.title) ? `<span>${heading(lang, t(H.title[0]))}</span> <span class="ow-h1-2">${heading(lang, t(H.title[1]))}</span>` : heading(lang, t(H.title))}</h1>`
    + (H.lead ? `<p class="ow-lead">${heading(lang, t(H.lead))}</p>` : '') + extra + `</div>`;
}

/* ============================================================ pricing.html */

/**
 * The plans, read from PRICING: the five priced levels of `panes` (the
 * sixth, 「从一条流程开始」, is the strip under them), in price order. Each
 * card states its price, what the price is (per year / first-year total),
 * what renewal costs (the known ¥10,000 a year of the Standard subscription;
 * packages renew their services per proposal; Enterprise per contract) and
 * links to the demo form with the plan named (contact.html?plan=…).
 */
function plansOf(C) {
  const P = C.PRICING;
  const all = P.panes.flat();
  const priced = all.filter((p) => p.unit !== 'demo');
  const start = all.find((p) => p.unit === 'demo');
  const tiers = P.compareMatrix.tiers.map((x) => x.zh);
  if (priced.map((p) => p.name.zh).join('|') !== tiers.join('|')) throw new Error('pricing: the plans are not the comparison chart\'s five levels, in order');
  if (priced.filter((p) => p.featured).length !== 1) throw new Error(`pricing: ${priced.filter((p) => p.featured).length} plans are recommended, the page recommends one`);
  for (const p of [...priced, start]) if (!C.SITE_OW.planKeys[p.name.zh]) throw new Error(`pricing: no ?plan= key for ${p.name.zh}`);
  return { P, priced, start };
}

export function renderPricing(ctx) {
  const { lang, t, C } = ctx;
  const S = C.SITE_OW.pricing;
  const { P, priced, start } = plansOf(C);
  const key = (p) => C.SITE_OW.planKeys[p.name.zh];
  const includes = S.includes;
  const tierCard = (p) => {
    const inherits = p.items[0].zh === includes.zh;
    if (inherits !== (p.items[0].en === includes.en)) throw new Error(`pricing: ${p.name.zh} opens with the inclusion line in one language only`);
    const items = inherits ? p.items.slice(1) : p.items;
    const unit = p.unit === 'year' ? t(S.unit.year) : p.unit === 'first' ? t(S.unit.first) : '';
    /* renewal: a yearly plan renews at its own renewal price; a first-year
       package renews the Standard subscription (whose renewal is that same
       ¥10,000) and its services per proposal; a custom plan per contract */
    let renewal;
    if (p.unit === 'year') {
      if (!t(S.renewal.year).includes(p.renewal)) throw new Error(`pricing: ${p.name.zh} renews at ${p.renewal}, the card says ${t(S.renewal.year)}`);
      renewal = S.renewal.year;
    } else if (p.unit === 'first') {
      if (!inherits) throw new Error(`pricing: ${p.name.zh} is a first-year package without the Standard subscription`);
      const base = priced.find((x) => x.unit === 'year');
      if (!t(S.renewal.first).includes(base.renewal)) throw new Error('pricing: package renewal does not quote the Standard renewal price');
      renewal = S.renewal.first;
    } else renewal = S.renewal.custom;
    const pick = !!p.featured;
    return `<li class="ow-tier${pick ? ' ow-tier--pick' : ''}" id="plan-${key(p)}">`
      + `<div class="ow-tier-name"><h2 class="ow-h3">${esc(t(p.name))}</h2>${pick ? `<span class="ow-tier-badge">${esc(t(P.featuredBadge))}</span>` : ''}</div>`
      + `<p class="ow-tier-desc">${para(lang, t(p.desc))}</p>`
      + `<p class="ow-tier-price"><strong>${esc(tx(t, p.price))}</strong>${unit ? `<span>${esc(unit)}</span>` : ''}</p>`
      + `<p class="ow-tier-renew"><span class="ow-tier-renew-l">${esc(t(S.renewalLabel))}</span><span>${para(lang, t(renewal))}</span></p>`
      + `<p class="ow-tier-cta">${button(`contact.html?plan=${key(p)}`, t(p.cta), { kind: pick ? 'primary' : 'secondary' })}</p>`
      + `<div class="ow-tier-items">${inherits ? `<p class="ow-tier-inc">${esc(t(includes))}</p>` : ''}<ul>${items.map((i) => `<li>${ICON.check}<span>${para(lang, t(i))}</span></li>`).join('')}</ul></div>`
      + `</li>`;
  };
  const strip = `<div class="ow-start"><span class="ow-tile">${ICON.flow}</span><div class="ow-start-t"><h2 class="ow-h3">${heading(lang, t(S.start.title))}</h2><p>${para(lang, t(S.start.text))}</p></div>`
    + `<p class="ow-start-b">${button(`contact.html?plan=${key(start)}`, t(start.cta), { kind: 'secondary' })}</p></div>`;
  /* 网站运营管理: a service package, not an app and not a plan — no price was
     given, so it is quoted on request (owner, 2026-10-10). It asks through the
     contact page with ?plan=site-ops, which the form's plan select names. */
  const V = S.service;
  const service = `<div class="ow-start ow-service" id="service-website"><span class="ow-tile">${ICON.gear}</span><div class="ow-start-t"><p class="ow-service-l">${esc(t(V.label))}</p><h2 class="ow-h3">${heading(lang, t(V.title))}</h2><p>${para(lang, t(V.text))}</p></div>`
    + `<p class="ow-start-b"><span class="ow-service-price">${esc(t(V.price))}</span>${button(`contact.html?plan=${V.key}`, t(V.cta), { kind: 'secondary' })}</p></div>`;
  const hero = `<section class="ow-hero ow-hero--page ow-hero--price" aria-labelledby="ow-hero-title"><div class="ow-wrap">`
    + heroHead(ctx, S.hero)
    + `<ol class="ow-tiers" aria-label="${esc(t(S.plansLabel))}">${priced.map(tierCard).join('')}</ol>`
    + strip + service + `<p class="ow-price-fine">${para(lang, t(S.note))}</p>`
    + `</div></section>`;
  const faqItems = P.faq;
  if (faqItems.length !== 10) throw new Error(`pricing: ${faqItems.length} questions, the page carries ten`);
  /* The ten questions: <details> (it opens and closes with no script);
     js/stargo-ow.js keeps each summary's aria-expanded in step and closes an
     open answer on Escape (tools/verify-interactions.mjs drives all ten by
     keyboard through .faq-question-block). */
  const faq = section('ow-sec--white ow-pfaq', 'faq', 'ow-pfaq-title',
    `<div class="ow-faq-grid">${head(ctx, S.faq, 'ow-pfaq-title')}<div class="ow-pfaq-list" data-ow-faq>`
    + faqItems.map(([q, a], i) => `<details class="ow-pfaq-item"><summary class="faq-question-block" aria-expanded="false"><span class="ow-pfaq-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="ow-pfaq-q">${heading(lang, t(q))}</span><span class="ow-cat-ico" aria-hidden="true">${ICON.plus}</span></summary>`
      + `<div class="ow-pfaq-a"><p>${para(lang, t(a))}</p></div></details>`).join('')
    + `</div></div>`);
  return `<main class="ow ow-inner ow-pricing" id="main">${hero}${compareChart(ctx, priced)}${faq}${contact.render(ctx)}</main>`;
}

/**
 * The comparison chart. Every cell is read out of PRICING, nothing is written
 * here: a tick where a level's own items state the line or a level it declares
 * it contains (PRICING.inherits) does; a quantity where compareMatrix quotes it
 * from that level's own sentence; 「定制」 where the level is scoped per
 * company (compareMatrix.customScope); a dash otherwise. Rows are grouped by
 * the level whose line they are. Below 992px the chart scrolls sideways with
 * its first column held in place and a hint above it.
 */
function compareChart(ctx, priced) {
  const { lang, t, C } = ctx;
  const P = C.PRICING;
  const M = P.compareMatrix;
  const K = C.SITE_OW.pricing.compare;
  const names = priced.map((p) => p.name.zh);
  const idx = (n) => { const i = names.indexOf(n); if (i < 0) throw new Error(`pricing chart: ${n} is not a level`); return i; };
  const parent = new Map();
  for (const step of P.inherits) {
    if (idx(step.from.zh) >= idx(step.level.zh)) throw new Error(`pricing chart: ${step.level.zh} inherits ${step.from.zh}, which is not below it`);
    if (priced[idx(step.from.zh)].name.en !== step.from.en || priced[idx(step.level.zh)].name.en !== step.level.en) throw new Error('pricing chart: inheritance names differ between languages');
    parent.set(step.level.zh, step.from.zh);
  }
  /* the cross-check: a level opens with 「含标准版年度软件订阅，另加：」 exactly when it carries 标准版 */
  const base = priced.find((p) => p.unit === 'year').name.zh;
  const carried = (n) => { const out = []; for (let x = n; x; x = parent.get(x)) out.push(x); return out; };
  for (const p of priced) {
    const says = p.items[0].zh === C.SITE_OW.pricing.includes.zh;
    if (p.name.zh !== base && says !== carried(p.name.zh).includes(base)) throw new Error(`pricing chart: ${p.name.zh} ${says ? 'says it includes' : 'carries'} 标准版 but ${says ? 'does not inherit it' : 'does not say so'}`);
  }
  const own = (n, l) => priced[idx(n)].items.map((i) => i[l]);
  const ticks = (n, row) => carried(n).some((x) => own(x, 'zh').includes(row.zh));
  const yes = `<span class="ow-yes">${ICON.check}<span class="ow-sr">${esc(t(K.yes))}</span></span>`;
  const no = `<span class="ow-no" aria-hidden="true">—</span><span class="ow-sr">${esc(t(K.no))}</span>`;
  /* tick rows, by the level whose own line they are */
  const owner = (row) => {
    const i = priced.findIndex((p) => p.items.some((x) => x.zh === row.zh && x.en === row.en));
    if (i < 0) throw new Error(`pricing chart: no level states 「${row.zh}」`);
    return i;
  };
  const groupOf = (i) => (i === 0 ? 'standard' : i === priced.length - 1 ? 'enterprise' : priced[i].name.zh === '全球获客版' ? 'global' : 'site');
  const groups = { standard: [], site: [], global: [], enterprise: [] };
  for (const v of M.valueRows) {
    const cells = v.cells.map((c, i) => {
      const lv = priced[i];
      if (c === null) {
        if (carried(lv.name.zh).some((x) => own(x, 'zh').join(' ').includes(v.key.zh))) throw new Error(`pricing chart: a dash for ${lv.name.zh} on 「${v.label.zh}」, which it states`);
        return no;
      }
      if (c === 'custom') {
        if (lv.unit !== M.customScope.unit || tx((x) => x.zh, lv.price) !== M.customScope.price.zh) throw new Error(`pricing chart: 定制 on ${lv.name.zh}, which is not scoped per company`);
        return `<span class="ow-cmp-v">${esc(tx(t, lv.price))}</span>`;
      }
      for (const l of ['zh', 'en']) if (!own(lv.name.zh, l).join(' ').includes(c.from[l])) throw new Error(`pricing chart: 「${c.from[l]}」 is not in ${lv.name.zh}'s own items`);
      return `<span class="ow-cmp-v">${esc(t(c.v))}</span>`;
    });
    groups.site.push({ label: v.label, cells });
  }
  for (const row of M.tickRows) groups[groupOf(owner(row))].push({ label: row, cells: priced.map((p) => (ticks(p.name.zh, row) ? yes : no)) });
  const pick = priced.findIndex((p) => p.featured);
  const unitOf = (p) => (p.unit === 'year' ? t(C.SITE_OW.pricing.unit.year) : p.unit === 'first' ? t(C.SITE_OW.pricing.unit.first) : '');
  const thead = `<thead><tr><th scope="col" class="ow-cmp-feat">${esc(t(K.feature))}</th>${priced.map((p, i) => `<th scope="col"${i === pick ? ' class="ow-cmp-pick"' : ''}><span class="ow-cmp-name">${esc(t(p.name))}</span><span class="ow-cmp-price">${esc(tx(t, p.price))}${unitOf(p) ? ` <small>${esc(unitOf(p))}</small>` : ''}</span></th>`).join('')}</tr></thead>`;
  const body = Object.entries(groups).filter(([, rows]) => rows.length).map(([g, rows]) => `<tbody><tr class="ow-cmp-group"><th scope="colgroup" colspan="${priced.length + 1}"><span class="ow-cmp-group-l">${esc(t(K.groups[g]))}</span></th></tr>`
    + rows.map((r) => `<tr><th scope="row">${para(lang, t(r.label))}</th>${r.cells.map((c, i) => `<td${i === pick ? ' class="ow-cmp-pick"' : ''}>${c}</td>`).join('')}</tr>`).join('') + `</tbody>`).join('');
  const total = Object.values(groups).reduce((n, r) => n + r.length, 0);
  if (total !== M.valueRows.length + M.tickRows.length) throw new Error('pricing chart: a row was dropped');
  return section('ow-sec--glow ow-cmp-sec', 'compare', 'ow-cmp-title',
    head(ctx, K, 'ow-cmp-title')
    + `<p class="ow-cmp-hint" aria-hidden="true">${ICON.arrow}<span>${esc(t(K.hint))}</span></p>`
    + `<div class="ow-cmp-wrap" role="region" aria-labelledby="ow-cmp-title" tabindex="0"><table class="ow-cmp"><caption class="ow-sr">${esc(t(K.caption))}</caption>${thead}${body}</table></div>`);
}

/* ============================================================== about.html */

export function renderAbout(ctx) {
  const { lang, t, C } = ctx;
  const A = C.SITE_OW.about;
  const AB = C.ABOUT;
  const apps = C.HOME_OW.apps.groups.flatMap((g) => g.apps);
  if (apps.length !== 15) throw new Error(`about: ${apps.length} apps, the page says 15`);
  /* below 992px the full-app screen is not shown (no phone render of it);
     its fifteen apps are listed instead */
  const phone = `<div class="ow-hero-tasks"><p class="ow-tasks-label">${esc(t(A.hero.appsLabel))}</p>${chips(t, apps, 'ow-chips--blue')}</div>`;
  const story = t(AB.story).match(/<p>([\s\S]*?)<\/p>/g).map((p) => p.replace(/<\/?p>/g, ''));
  if (story.length !== 3 || story.some((p) => /</.test(p))) throw new Error('about: the story is three plain paragraphs');
  const storySec = section('ow-sec--white ow-story', 'story', 'ow-story-title',
    `<div class="ow-split ow-split--story"><div>${head(ctx, A.story, 'ow-story-title')}<p class="ow-story-where">${ICON.pin}<span>${esc(t(A.story.where))}</span></p>`
    + `<p class="ow-story-where">${ICON.building}<span>${lang === 'zh' ? esc(t(A.story.company)) : esc(t(A.story.company)).replace('{company}', `<span lang="zh-CN">${esc(C.CONTACT_INFO.company)}</span>`)}</span></p></div>`
    + `<div class="ow-story-body">${story.map((p) => `<p>${para(lang, p)}</p>`).join('')}</div></div>`);
  const values = AB.values.map((v, i) => {
    const sep = (s, l) => { const at = l === 'zh' ? s.indexOf('：') : s.indexOf(': '); if (at < 0) throw new Error(`about: principle without a title: ${s}`); return [s.slice(0, at), s.slice(at + (l === 'zh' ? 1 : 2))]; };
    const [zt, zx] = sep(v.zh, 'zh');
    const [et, ex] = sep(v.en, 'en');
    return { icon: A.values.icons[i], title: { zh: zt, en: et }, text: { zh: zx, en: ex.charAt(0).toUpperCase() + ex.slice(1) } };
  });
  const valuesSec = section('ow-sec--glow ow-values', 'principles', 'ow-values-title', head(ctx, A.values, 'ow-values-title') + cards(ctx, values));
  const S = A.starts;
  const startsSec = section('ow-sec--white ow-starts-sec', 'start', 'ow-starts-title',
    `<div class="ow-split">${head(ctx, S, 'ow-starts-title')}<p class="ow-head-link">${button('contact.html', t(AB.button.label), { kind: 'secondary' })}</p></div>`
    + `<ul class="ow-starts">${S.list.map((x) => `<li><a href="${esc(x.href)}"><span class="ow-tile">${ICON[x.icon]}</span><span class="ow-starts-t"><strong>${esc(t(x.name))}</strong><small>${esc(t(x.sub))}</small></span>${ICON.arrow}</a></li>`).join('')}</ul>`);
  return `<main class="ow ow-inner ow-about" id="main">`
    + pageHero(ctx, A.hero, { id: 'ow01-home', phone, moreIcon: 'arrow' })
    + storySec + valuesSec + startsSec
    + contact.render({ ...ctx, aboutLink: false })
    + `</main>`;
}

/* ============================================================ contact.html */

/**
 * The demo form is the template's own `.w-form` (the one the homepage band
 * uses), so tools/chrome.mjs formMarkup() and js/stargo-forms.js treat it like
 * every other demo form: POST /api/contact, honeypot, consent line, the
 * success/failure notices functions/api/contact.js answers. Its first four
 * fields are the band's (contact.formFields): name, company and mobile / WeChat
 * are required, e-mail is optional (owner, 2026-10-10; the endpoint requires
 * exactly those three). The plan, the focus and the message below are optional.
 * js/stargo-ow.js preselects the plan a pricing card named
 * (contact.html?plan=growth …).
 */
function demoForm({ lang, t, C, formHtml }) {
  const K = C.SITE_OW.contact;
  const { priced, start } = plansOf(C);
  /* 「增长版 · ¥30,000」: the plan and its price, short enough for the select */
  const service = C.SITE_OW.pricing.service;
  const plans = [...priced, start].map((p) => `<option value="${C.SITE_OW.planKeys[p.name.zh]}">${esc(t(p.name))}${p.unit === 'demo' ? '' : ` · ${esc(tx(t, p.price))}`}</option>`).join('')
    /* the website-operations service package (pricing.html's 「咨询网站运营管理」 links here with ?plan=site-ops) */
    + `<option value="${service.key}">${esc(t(service.option))}</option>`;
  /* the plan and the focus each take the form's full width, so a plan and its price are never cut off */
  const extra = `<div class="grid-form ow-ct-extras">`
    + `<div class="ow-field"><label class="ow-field-l" for="contact-plan">${esc(t(K.fields.plan))}</label><select class="text-field ow-select w-select" name="plan" data-name="Plan" id="contact-plan" data-ow-plan><option value="">${esc(t(K.planNone))}</option>${plans}</select></div>`
    + `<div class="ow-field"><label class="ow-field-l" for="contact-focus">${esc(t(K.fields.focus))}</label><select class="text-field ow-select w-select" name="focus" data-name="Focus" id="contact-focus"><option value="">${esc(t(K.focusNone))}</option>${K.focusOptions.map((o, i) => `<option value="${i + 1}">${esc(t(o))}</option>`).join('')}</select></div>`
    + `</div>`
    + `<div class="ow-field"><label class="ow-field-l" for="contact-message">${esc(t(K.fields.message))}</label><textarea class="text-field ow-textarea w-input" maxlength="5000" name="message" data-name="Message" id="contact-message" placeholder="${esc(t(K.messageHint))}"></textarea></div>`;
  return contact.withFields(formHtml, { lang, t, C }, { where: 'contact', extra });
}

export function renderContact(ctx) {
  const { lang, t, C } = ctx;
  const K = C.SITE_OW.contact;
  const O = C.HOME_OW;
  const ways = `<div class="ow-ct-ways"><p class="ow-tasks-label">${esc(t(K.ways.title))}</p>`
    + contact.ways(ctx, { address: true, labels: K.ways })
    + contact.trust(ctx)
    + `</div>`;
  const steps = `<div class="ow-ct-steps"><p class="ow-tasks-label">${esc(t(K.steps.title))}</p><ol>${K.steps.list.map(([title, text], i) => `<li><span class="ow-step-n" aria-hidden="true">${i + 1}</span><div><h3 class="ow-h3">${heading(lang, t(title))}</h3><p>${para(lang, t(text))}</p></div></li>`).join('')}</ol></div>`;
  const hero = `<section class="ow-hero ow-hero--page ow-hero--contact" aria-labelledby="ow-hero-title"><div class="ow-wrap ow-ct-grid">`
    /* four grid items: on a desktop the words, the ways and the steps on the
       left and the form beside them; on a phone the form comes second */
    + heroHead(ctx, K.hero)
    + `<div class="ow-ct-form" id="demo"><h2 class="ow-h3">${esc(t(K.formTitle))}</h2><p class="ow-ct-req">${esc(t(K.required))}</p><div class="ow-contact-form">${demoForm(ctx)}</div></div>`
    + ways + steps
    + `</div></section>`;
  const X = K.shot;
  const seen = section('ow-sec--glow ow-ct-shot', 'demo-screen', 'ow-ctshot-title',
    `<header class="ow-sec-head ow-sec-head--center"><p class="ow-eyebrow">${esc(t(X.eyebrow))}</p><h2 id="ow-ctshot-title" class="ow-h2">${heading(lang, t(X.title))}</h2><p class="ow-sec-lead">${heading(lang, t(X.text))}</p></header>`
    + shotCards(ctx, X.cards, { link: false })
    + `<p class="ow-shot-note">${heading(lang, t(O.shotNote))}</p>`);
  return `<main class="ow ow-inner ow-contact-page" id="main">${hero}${seen}</main>`;
}

/* ========================================================= privacy / terms */

/**
 * Small cards with an OPEN WORK close-up (contact's 「演示里你会看到」). The 「演示数据」 badge sits in a title bar above the
 * picture, as on every framed shot, never over the interface.
 */
function shotCards({ lang, t, C }, list, { link = true } = {}) {
  return `<ul class="ow-relcards">${list.map((x) => {
    const inner = `<span class="ow-relshot"><span class="ow-frame-bar ow-postbar" aria-hidden="true"><span class="ow-lights"><i></i><i></i><i></i></span><span class="ow-badge">${esc(t(C.HOME_OW.badge))}</span></span>`
      + `<img src="${asset(x.shot).src}" alt="OPEN WORK" data-sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 30vw, 380px" loading="lazy" class="ow-relimg"/></span>`
      + `<span class="ow-rel-t"><strong>${esc(t(x.title))}</strong><span>${para(lang, t(x.text))}</span></span>`;
    return `<li>${link ? `<a href="${esc(x.href)}">${inner}</a>` : `<div class="ow-relcard">${inner}</div>`}</li>`;
  }).join('')}</ul>`;
}

const LEGAL_PAGES = ['privacy.html', 'terms.html'];

export function renderLegal(ctx, spec, page) {
  const { lang, t, C } = ctx;
  const L = C.SITE_OW.legal;
  if (!LEGAL_PAGES.includes(page)) throw new Error(`legal: ${page} is not a legal page`);
  /* the post template printed 「(©2026-09-05 生效)」: the date alone, in brackets */
  const date = lang === 'zh' ? `（${t(spec.date)}）` : `(${t(spec.date)})`;
  const names = { 'privacy.html': C.LEGAL.privacy.h1, 'terms.html': C.LEGAL.terms.h1 };
  const nav = `<nav class="ow-legal-nav" aria-label="${esc(t(L.pagesLabel))}"><ul>${LEGAL_PAGES.map((p) => `<li><a href="${p}"${p === page ? ' aria-current="page"' : ''}>${esc(t(names[p]))}</a></li>`).join('')}</ul></nav>`;
  /* the text's own sub-headings are <h4>; under the page's h1 they are h2 */
  const body = t(spec.body).trim().replace(/<h4>/g, '<h2 class="ow-doc-h">').replace(/<\/h4>/g, '</h2>');
  if (/<h[1345]/.test(body)) throw new Error(`legal: ${page} carries a heading level the page does not use`);
  return `<main class="ow ow-inner ow-legal" id="main">`
    + `<section class="ow-legal-hero" aria-labelledby="ow-hero-title"><div class="ow-wrap ow-legal-wrap">${eyebrow(t, L.eyebrow)}<h1 id="ow-hero-title" class="ow-h1">${esc(t(spec.h1))}</h1><p class="ow-legal-date">${esc(date)}</p>${nav}</div></section>`
    + `<section class="ow-sec ow-sec--white ow-legal-body"><div class="ow-wrap ow-legal-wrap"><article class="ow-doc">${body}</article></div></section>`
    + `</main>`;
}

/* ================================================================ 404.html */

export function renderNotFound(ctx) {
  const { lang, t, C } = ctx;
  const N = C.SITE_OW.notFound;
  const links = `<ul class="ow-404-links">${N.links.map((x) => `<li><a href="${esc(x.href)}"><span class="ow-tile">${ICON[x.icon]}</span><span class="ow-404-t"><strong>${esc(t(x.title))}</strong><span>${esc(t(x.text))}</span></span>${ICON.arrow}</a></li>`).join('')}</ul>`;
  return `<main class="ow ow-inner ow-404" id="main"><section class="ow-hero ow-hero--404" aria-labelledby="ow-hero-title"><div class="ow-wrap">`
    + heroHead(ctx, { eyebrow: N.eyebrow, title: N.title, lead: N.lead })
    + links + `<p class="ow-404-home">${button('index.html', t(N.home), { kind: 'link' })}</p>`
    + `</div></section></main>`;
}


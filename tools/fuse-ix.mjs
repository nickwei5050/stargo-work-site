/**
 * Build js/app.fused.js — the one Webflow bundle every page of this site loads.
 *
 * Why one bundle. Only ONE Webflow runtime can exist on a page: window.Webflow
 * is a hard singleton, and a second core captures the first as a ready-queue
 * and calls .define() on its function-valued properties with no factory —
 * a guaranteed TypeError on DOM ready. So Scalora's runtime is dropped and
 * only its animation DATA is carried over.
 *
 * Why the union. Mono exports six per-page bundles. tools/ix-union-check.mjs
 * proved their IX2 payloads are byte-identical (409 events / 140 action
 * lists, zero conflicts) and only the IX3 (GSAP) interaction lists differ per
 * page. Without the union, a Mono module moved from studio.html to a page
 * built on the blog bundle silently loses its hover interaction. With it,
 * any module works on any page.
 *
 * Base: app.6e875794 (the homepage bundle) — the only one whose registered
 * modules include dropdown and lightbox, on top of the lottie the nav needs.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readBundle, evalLiteral } from './ix-lib.mjs';
import { NAV, MORE } from './copy.mjs';

import { SITE } from './paths.mjs';
const JS = `${SITE}/js`;
const BUNDLES = `${SITE}/tools/bundles`;          // the six Mono page bundles, kept as sources only
const MONO_BASE = `${BUNDLES}/app.6e875794.53d57b6d7b6754cb.js`;
const SCALORA_BUNDLE = process.argv[2] ?? `${BUNDLES}/scalora.app.e1bb07ef.d077b7f57348968e.js`;
/* Further donors, already renamed and rescoped by their own prepare script
   (tools/lifelogx-prepare.mjs writes tools/fragments/lx-ix.json). */
/* Every donor fragment in tools/fragments. Each block's prepare script writes
   one `<ns>-ix.json` there; picking them up by directory means adding a block
   never means remembering to edit this list. Sorted so the merge order, and so
   the bundle, is the same on every machine. */
const DONORS = readdirSync(`${SITE}/tools/fragments`)
  .filter((f) => f.endsWith('-ix.json')).sort().map((f) => `${SITE}/tools/fragments/${f}`);
const OUT_BUNDLE = `${JS}/app.fused.js`;

const MONO_PAGE = '699b6466d5f19893993a4bf1';     // homepage id; imported Scalora ix3 is rescoped to it
const SCALORA_PAGE = '69a01661589c516ba5f0f92f';
const NS = 'sc-';

/** How many overlay-menu items the clone step below had to reach. */
let menuItemsExtended = 0;

/** Runtime built-ins present in both payloads; renaming them breaks both. */
const BUILTIN = new Set(['fadeIn', 'fadeOut', 'slideInBottom', 'slideInTop', 'slideInLeft', 'slideInRight']);

/* --------------------------------------------------------- renaming ---- */

function buildRenameMap(payload) {
  const map = new Map();
  for (const key of [...Object.keys(payload.events ?? {}), ...Object.keys(payload.actionLists ?? {})]) {
    if (!BUILTIN.has(key)) map.set(key, NS + key);
  }
  return map;
}

function renameString(value, map) {
  if (map.has(value)) return map.get(value);
  for (const [from, to] of map) {
    if (value.startsWith(from + '-')) return to + value.slice(from.length);   // "a-48-p", "a-48-n-2"
  }
  if (value.startsWith(SCALORA_PAGE + '|')) return MONO_PAGE + value.slice(SCALORA_PAGE.length);
  if (value === SCALORA_PAGE) return MONO_PAGE;
  return value;
}

function deepRename(node, map, stats) {
  if (typeof node === 'string') {
    const next = renameString(node, map);
    if (next !== node) stats.strings++;
    return next;
  }
  if (Array.isArray(node)) return node.map((n) => deepRename(n, map, stats));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[renameString(k, map)] = deepRename(v, map, stats);
    return out;
  }
  return node;
}

const dropBuiltins = (obj) => Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => !BUILTIN.has(k)));

/* --------------------------------------------------------------- main -- */

const monoSrc = readFileSync(MONO_BASE, 'utf8');
const mono = readBundle(monoSrc);
const scalora = readBundle(readFileSync(SCALORA_BUNDLE, 'utf8'));

/* IX2: Mono payload + renamed Scalora events/lists. */
const map = buildRenameMap(scalora.ix2Payload);
const stats = { strings: 0 };
const renamed = deepRename(scalora.ix2Payload, map, stats);
const scaEvents = dropBuiltins(renamed.events);
const scaLists = dropBuiltins(renamed.actionLists);

const collide = [
  ...Object.keys(scaEvents).filter((k) => k in mono.ix2Payload.events),
  ...Object.keys(scaLists).filter((k) => k in mono.ix2Payload.actionLists),
];
if (collide.length) { console.error('FAIL: ids still collide after renaming', collide); process.exit(1); }

/* One page id for the whole site. IX2 addresses elements as "<pageId>|<nodeId>"
   and ix3 timelines are scoped per page, so a module moved from studio.html
   to another page silently lost its hover. Every page now declares the
   homepage id (chrome.mjs rewrites data-wf-page) and every payload reference
   is folded onto it. Node ids are site-unique, so nothing collides. */
const MONO_PAGE_RE = /^699b6466d5f19893993a4[0-9a-f]{3}$/;
const foldPages = (node) => {
  if (typeof node === 'string') {
    const bar = node.indexOf('|');
    if (bar === 24 && MONO_PAGE_RE.test(node.slice(0, 24))) return MONO_PAGE + node.slice(24);
    if (MONO_PAGE_RE.test(node)) return MONO_PAGE;
    return node;
  }
  if (Array.isArray(node)) return node.map(foldPages);
  if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [foldPages(k), foldPages(v)]));
  return node;
};
const donorEvents = {};
const donorEventSource = {};
const donorLists = {};
const donorIx3 = [];
const donorTl = [];
for (const f of DONORS) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  /* Two payload files can carry the same donor interaction when two blocks
     were cut from one donor page; that is fine as long as they agree. */
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  /* The older per-donor prepare scripts rewrote an event's target to a hand
     id ("cn-capmap-row"); tools/donor-lib.mjs keeps the donor's own node id.
     Where the two disagree the donor-lib payload (`*-cap-ix.json`) wins and the
     older markup is built with the donor id -- see the catalogue in
     build-site.mjs -- so one event drives both. */
  const authoritative = /-cap-ix\.json$/.test(f);
  for (const [k, v] of Object.entries(d.events ?? {})) {
    if (k in mono.ix2Payload.events || k in scaEvents) throw new Error(`donor event id collides with the host: ${k}`);
    if (k in donorEvents && !same(donorEvents[k], v)) {
      if (!authoritative && donorEventSource[k]?.endsWith('-cap-ix.json')) continue;
      if (!authoritative) throw new Error(`donor event ${k} differs between two payload files`);
    }
    donorEvents[k] = v; donorEventSource[k] = f;
  }
  for (const [k, v] of Object.entries(d.actionLists ?? {})) {
    if (k in mono.ix2Payload.actionLists || k in scaLists) throw new Error(`donor action list id collides with the host: ${k}`);
    if (k in donorLists && !same(donorLists[k], v)) throw new Error(`donor action list ${k} differs between two payload files`);
    donorLists[k] = v;
  }
  donorIx3.push(...(d.interactions ?? []));
  donorTl.push(...(d.timelines ?? []));
}

const mergedPayload = foldPages({
  ...mono.ix2Payload,
  events: { ...mono.ix2Payload.events, ...scaEvents, ...donorEvents },
  actionLists: { ...mono.ix2Payload.actionLists, ...scaLists, ...donorLists },
});

// The core-system switcher now has one deterministic ScrollTrigger controller
// (stargo-tabs.js). Do not let IX2 and that controller write to the same panels.
// All other template interactions, including the mobile accordions, stay intact.
if (mergedPayload.events['sc-e-133']?.action?.config?.actionListId !== 'sc-a-48') {
  throw new Error('core-system switcher animation contract changed');
}
delete mergedPayload.events['sc-e-133'];

/* Page-level mouse-move interactions (speed lane). IX2 runs one
   requestAnimationFrame loop for as long as a page is open, and every frame
   its store walks every instance it has started; a continuous (pointer-driven)
   instance is started for every target of every bound event, whatever the
   breakpoint (an event's mediaQueries only gate its handler and its writes).
   Every page carries the homepage's id (see foldPages above), so every page
   started all the homepage-id copies: 15 identical events running a-226
   "Circle Main Movement" (the cursor's "view work" bubble and cross-hair, 10
   instances each) and 5 identical events running lx-a-37 (the Lifelogx footer
   gradient that follows the pointer): 160 of the 228 instances on a phone, the
   bulk of an idle loop measured at 1.1-2.0s of main thread per 5s at 4x CPU.
   1. The copies go. Each wrote the same values to the same elements on the
      same input, so one of each draws exactly what fifteen (or five) did, at
      every width; only the duplicate work goes.
   2. Below 768px (IX2's small and tiny) the one a-226 event stops listening:
      everything it moves sits in .text-tool-tip and .plus-line-wrapper, which
      Mono's stylesheet sets to display:none up to 991px (measured at 390, 600
      and 767px: no box). lx-a-37 keeps every breakpoint: the footer gradient
      shows on a phone and moves there today. */
{
  const seen = new Set();
  let dropped = 0;
  for (const [id, ev] of Object.entries(mergedPayload.events)) {
    if (ev.eventTypeId !== 'MOUSE_MOVE' || ev.target?.appliesTo !== 'PAGE') continue;
    const key = JSON.stringify([ev.target, ev.targets, ev.action, ev.config, ev.mediaQueries]);
    if (!seen.has(key)) { seen.add(key); continue; }
    delete mergedPayload.events[id];
    dropped++;
  }
  if (dropped !== 18) throw new Error(`page mouse-move copies: expected 14 of a-226 and 4 of lx-a-37, dropped ${dropped}`);
  const cursor = Object.values(mergedPayload.events).filter((ev) => ev.eventTypeId === 'MOUSE_MOVE' && ev.target?.appliesTo === 'PAGE' && ev.action?.config?.actionListId === 'a-226');
  if (cursor.length !== 1) throw new Error(`page mouse-move: expected one a-226 event, found ${cursor.length}`);
  cursor[0].mediaQueries = cursor[0].mediaQueries.filter((q) => q !== 'small' && q !== 'tiny');
}

/* Mono's overlay menu was built for a four-item nav and its open interaction
   a-190 names them one at a time: `.menu-item._01`, `._02`, `._03`, `._05`
   (`._04` was skipped in the template itself). Group 0 of that list is not
   decoration -- it is the CLOSED state, the one Webflow applies on load. Our
   nav carries ten items, so `._04` and everything from `._06` up were never
   given it and sat at full opacity behind the page: invisible while every page
   was light, and plainly visible the moment the capability page opened on a
   black hero. They were missing from the reveal too, so they would have popped
   in without the stagger the others animate with.

   Every uncovered item is cloned from `._05`, the last one the template
   animates, keeping its transforms and durations; the reveal delays are then
   dealt out evenly down the whole list so ten items stagger the way four did. */
{
  const items = NAV.length + MORE.length + 1;          // chrome.mjs: [...nav, ...more, swap]
  const list = mergedPayload.actionLists['a-190'];
  if (!list?.actionItemGroups) throw new Error('overlay menu: a-190 is not the open interaction any more');

  const indexOf = (a) => Number((/\.menu-item\._(\d+)\b/.exec(a.config?.target?.selector ?? '') ?? [])[1]);
  const MODEL = 5;
  let cloned = 0;
  for (const group of list.actionItemGroups) {
    const model = group.actionItems.filter((a) => indexOf(a) === MODEL);
    if (!model.length) continue;
    const covered = new Set(group.actionItems.map(indexOf).filter(Boolean));
    for (let n = 1; n <= items; n++) {
      if (covered.has(n)) continue;
      for (const a of model) {
        const copy = JSON.parse(JSON.stringify(a));
        copy.id = `${a.id}-${n}`;
        copy.config = { ...copy.config, target: { ...a.config.target, selector: `.menu-item._${String(n).padStart(2, '0')}` } };
        group.actionItems.push(copy);
        cloned++;
      }
    }
    /* One even stagger down the list. The template's own four sat 100ms apart
       starting at 800; keeping that step and re-dealing it by position leaves
       the first items where they were and gives the rest their own beat. */
    const menu = group.actionItems.filter((a) => indexOf(a));
    const base = Math.min(...menu.map((a) => a.config.delay));
    const step = base > 0 ? 100 : 0;                   // group 0 is the closed state: everything at once
    for (const a of menu) a.config.delay = base + step * (indexOf(a) - 1);
  }
  if (!cloned) throw new Error('overlay menu: nothing cloned -- a-190 no longer targets .menu-item._05');
  menuItemsExtended = cloned;
}

/* IX3: union of every Mono page bundle, plus Scalora's rescoped to this site. */
const interactions = new Map();
const timelines = new Map();
const addIx3 = (b, rescope) => {
  for (const i of b.ix3Interactions) {
    const x = rescope ? { ...i, scope: { type: 'pages', value: [MONO_PAGE] } } : i;
    const j = JSON.stringify(x);
    if (interactions.has(x.id) && interactions.get(x.id) !== j) throw new Error(`ix3 conflict ${x.id}`);
    interactions.set(x.id, j);
  }
  for (const t of b.ix3Timelines) {
    const j = JSON.stringify(t);
    if (timelines.has(t.id) && timelines.get(t.id) !== j) throw new Error(`ix3 timeline conflict ${t.id}`);
    timelines.set(t.id, j);
  }
};
/* Sorted: readdir order is the filesystem's, and the union is written out in
   insertion order, so an unsorted read makes the bundle differ between an NTFS
   and an ext4 checkout. */
const monoBundles = readdirSync(BUNDLES).filter((f) => /^app\.[0-9a-f]{8}\.[0-9a-f]+\.js$/.test(f)).sort();
for (const f of monoBundles) addIx3(readBundle(readFileSync(`${BUNDLES}/${f}`, 'utf8')), true);
const beforeScalora = interactions.size;
addIx3(scalora, true);
addIx3({ ix3Interactions: donorIx3, ix3Timelines: donorTl }, false);

/* Scalora's ix3 interactions target page-scoped elements; the ones we import
   are the title reveals inside the three modules. They remain scoped to the
   homepage id, which is the page that carries those modules. */

/* Mono's page-load curtain. Mono's homepage load timeline t-7c6ce201 (the
   wf:load interaction i-04759f04) opens by dropping `.preloader` — a black
   sheet with the wordmark — over the page, rising the wordmark's letters on
   it, and lifting it again while the whole `.main-content` slides up from 10%
   of its own height below. On this homepage that is 10% of 30,000–37,000px
   (phone to desktop): 3,000–3,700px, so without the sheet over it the reader
   would watch the page go blank, flash past and climb back (measured with
   only the sheet hidden). Webflow's runtime starts at the window `load`,
   which on anything but a fast connection comes long after the homepage has
   been readable — measured here at 19–26s on Fast 4G and 43–46s on Slow 4G,
   phone CPU — and the opening that used to hide it now plays once a session.
   So these three actions go; build-site.mjs takes `.preloader` out of the homepage markup.
   Each of the three targets exists on the homepage only (the page id is
   shared, so this timeline runs on every page). The hero's load-in is taken
   off the homepage just below; the menu's two actions stay as Mono wrote them. */
{
  const ID = 't-7c6ce201';
  const CURTAIN = {
    'ta-0f0cfd05': '["wf:inst",["699b6466d5f19893993a4bf1","668513fa-96bc-a471-9254-1244961a6485"]',   // the wordmark on the sheet
    'ta-e8c40fcc': '["wf:class",["preloader"]',                                                       // the sheet itself
    'ta-62256e8b': '["wf:inst",["699b6466d5f19893993a4bf1","ce714b43-ca02-f75e-a30b-e50c0386be7f"]',   // .main-content, sliding up behind it
  };
  if (!timelines.has(ID)) throw new Error(`ix3: Mono's homepage load timeline ${ID} is missing`);
  const tl = JSON.parse(timelines.get(ID));
  for (const [id, target] of Object.entries(CURTAIN)) {
    const a = tl.actions.find((x) => x.id === id);
    if (!a || !JSON.stringify(a.targets).includes(target)) throw new Error(`ix3: ${ID} no longer carries ${id} on ${target}`);
  }
  const kept = tl.actions.filter((a) => !(a.id in CURTAIN));
  if (kept.length !== tl.actions.length - 3) throw new Error(`ix3: ${ID} curtain actions not removed`);

  /* The hero's load-in, on the homepage only. The same timeline then hides
     the hero — the big STARGO and WORK letters (split into characters and
     dropped below their masks), the five lines of copy, the 预约企业演示 button
     and the four dots — and brings it back over 1.35–3.3s. That is meant for a
     hero nobody has seen yet. On this homepage it has been on screen since
     Webflow's runtime arrived (the head's anti-flicker rule, html.w-mod-js
     :not(.w-mod-ix3), hides it until then), and the timeline only starts at the
     window `load`, after the images: on a first visit straight after the
     opening's lift has uncovered it (measured: the whole hero blank for 2.0s
     from 5.8–7.4s on a desktop, 2.3s at 20–49s on phones), and on any later
     view after the reader has started reading. Until the opening played once a
     session it ran under the opening's black screen and was never seen, so
     what the owner approved — bracket, wipe, homepage — ends on a hero that
     stays put, and here it does.
     The two letter actions target instances that exist on the homepage only,
     so they go. The other three target classes every page has, and every
     other page keeps them exactly as Mono wrote them: they become the same
     selector with the homepage left out (build-site.mjs marks its <html>
     `data-stargo-home`). The menu's two actions are untouched. */
  const HOME = '[data-stargo-home]';
  const HERO_INST = {
    'ta-e932201c': '["wf:inst",["699b6466d5f19893993a4bf1","11f4fc70-8a2d-088c-43e4-29580902aa2d"]',   // STARGO
    'ta-acf7757b': '["wf:inst",["699b6466d5f19893993a4bf1","57b5af3e-8de7-1a3d-0bcc-71e02f1dacc5"]',   // WORK
  };
  const HERO_CLASS = {
    'ta-209529dd': 'circle-divider',           // the dots
    'ta-57eb7e75': 'contact-info.for-button',  // the button
    'ta-e0e811e7': 'top-text.big',             // the copy
  };
  for (const [id, target] of Object.entries(HERO_INST)) {
    const a = kept.find((x) => x.id === id);
    if (!a || !JSON.stringify(a.targets).includes(target)) throw new Error(`ix3: ${ID} no longer carries ${id} on ${target}`);
  }
  const hero = kept.filter((a) => !(a.id in HERO_INST)).map((a) => {
    if (!(a.id in HERO_CLASS)) return a;
    const cls = HERO_CLASS[a.id];
    if (a.targets.length !== 1 || a.targets[0][0] !== 'wf:class' || JSON.stringify(a.targets[0][1]) !== JSON.stringify([cls])) {
      throw new Error(`ix3: ${ID} no longer carries ${a.id} on .${cls}`);
    }
    /* The runtime resolves `wf:class` as querySelectorAll('.' + name) and
       `wf:selector` as querySelectorAll(selector), in the same document. */
    return { ...a, targets: [['wf:selector', `.${cls}:not(${HOME} *)`, a.targets[0][2]]] };
  });
  if (hero.length !== kept.length - 2 || hero.filter((a) => JSON.stringify(a.targets).includes(`:not(${HOME} *)`)).length !== 3) {
    throw new Error(`ix3: ${ID} hero load-in not taken off the homepage`);
  }
  timelines.set(ID, JSON.stringify({ ...tl, actions: hero }));
}

let out = monoSrc.slice(0, mono.ix2.argStart) + JSON.stringify(mergedPayload) + monoSrc.slice(mono.ix2.argEnd);
const ix3 = readBundle(out).ix3;
/* SplitText "words" splits on whitespace. Chinese has none, so a whole
   paragraph became one unbreakable inline-block "word" and wrapped only at
   the few Latin tokens. Line splits are computed from layout and wrap
   correctly in both languages; the reveal becomes line-by-line. */
const asLines = (t) => t.replace(/"type":"words"/g, '"type":"lines"').replace(/"mask":"words"/g, '"mask":"lines"');
const mergedIx3 = `([${[...interactions.values()].join(',')}],[${[...timelines.values()].map(asLines).join(',')}])`;
const at = out.indexOf(ix3.args.text);
out = out.slice(0, at) + mergedIx3 + out.slice(at + ix3.args.text.length);

/* Sanity: the result must still parse into the same shapes. */
const check = readBundle(out);
if (Object.keys(check.ix2Payload.events).length !== Object.keys(mergedPayload.events).length) throw new Error('ix2 round-trip mismatch');
if (check.ix3Interactions.length !== interactions.size) throw new Error('ix3 round-trip mismatch');
for (const ev of Object.values(check.ix2Payload.events)) {
  const id = ev.action?.config?.actionListId;
  if (id && !(id in check.ix2Payload.actionLists) && !BUILTIN.has(id)) throw new Error(`event references missing action list ${id}`);
}

writeFileSync(OUT_BUNDLE, out, 'utf8');

console.log(JSON.stringify({
  monoEvents: Object.keys(mono.ix2Payload.events).length,
  scaloraEventsAdded: Object.keys(scaEvents).length,
  donorEventsAdded: Object.keys(donorEvents).length,
  mergedEvents: Object.keys(mergedPayload.events).length,
  mergedActionLists: Object.keys(mergedPayload.actionLists).length,
  menuItemsExtended,
  idsRenamed: map.size,
  stringsRewritten: stats.strings,
  ix3FromMono: beforeScalora,
  ix3Total: interactions.size,
  ix3Timelines: timelines.size,
  bytes: out.length,
  wrote: OUT_BUNDLE,
}, null, 2));

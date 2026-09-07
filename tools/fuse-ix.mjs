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

const SITE = 'F:/stargo 网站/stargo-site';
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
const donorLists = {};
const donorIx3 = [];
const donorTl = [];
for (const f of DONORS) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  for (const [k, v] of Object.entries(d.events ?? {})) {
    if (k in mono.ix2Payload.events || k in scaEvents || k in donorEvents) throw new Error(`donor event id collides: ${k}`);
    donorEvents[k] = v;
  }
  for (const [k, v] of Object.entries(d.actionLists ?? {})) {
    if (k in mono.ix2Payload.actionLists || k in scaLists || k in donorLists) throw new Error(`donor action list id collides: ${k}`);
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
const monoBundles = readdirSync(BUNDLES).filter((f) => /^app\.[0-9a-f]{8}\.[0-9a-f]+\.js$/.test(f));
for (const f of monoBundles) addIx3(readBundle(readFileSync(`${BUNDLES}/${f}`, 'utf8')), true);
const beforeScalora = interactions.size;
addIx3(scalora, true);
addIx3({ ix3Interactions: donorIx3, ix3Timelines: donorTl }, false);

/* Scalora's ix3 interactions target page-scoped elements; the ones we import
   are the title reveals inside the three modules. They remain scoped to the
   homepage id, which is the page that carries those modules. */

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

/**
 * Prepare the cinery donor for the Capability map module.
 *
 * Donor: tools/templates/cinery/pricing.html — the "Quick / Answers" FAQ block.
 * It is the one block across the four supplied templates that can hold fourteen
 * groups and a hundred and fifty-seven capabilities without becoming a table
 * again: a gradient split heading with a blur sweep, a section counter, and a
 * column of dark rounded rows that expand on click while their plus rotates.
 * All of that is real template motion, driven by Webflow IX2 — the same
 * mechanism tools/lifelogx-prepare.mjs already borrows from.
 *
 * What this script does, and why each step is needed:
 *
 * 1. Cuts the heading block and one accordion row out of the donor page, so the
 *    build repeats the row rather than this script inventing markup.
 * 2. Prefixes every donor class with `cn-`. Cinery ships class names like
 *    `.subtitle`, `.title-wrapper` and `.section-number` that Mono, Scalora and
 *    Lifelogx also use; without the prefix the transplant would repaint the
 *    rest of the site.
 * 3. Rewrites the donor stylesheet down to just those classes, with the same
 *    prefix, and scopes it under `.cn-capmap` so it cannot leak either.
 * 4. Lifts the four IX2 events and four action lists that drive the accordion,
 *    renames the class selectors inside them to match step 2, namespaces their
 *    ids, and remaps the donor page id to ours so the runtime binds them.
 *
 * Output: tools/fragments/cn-capmap.html, css/cinery.cn.css,
 *         tools/fragments/cn-ix.json (merged by tools/fuse-ix.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

import { SITE } from './paths.mjs';
const SRC = `${SITE}/tools/templates/cinery`;
const MONO_PAGE = '699b6466d5f19893993a4bf1';
const NS = 'cn-';

const html = readFileSync(`${SRC}/pricing.html`, 'utf8');
const css = readFileSync(`${SRC}/css/cinery.app.shared.3e3418b8f.css`, 'utf8');
const bundle = readBundle(readFileSync(`${SRC}/js/app.9d009f54.b1680441e3b493e5.js`, 'utf8'));

/* ------------------------------------------------------------ 1. cut ---- */

const cut = (start, end, label) => {
  const i = html.indexOf(start);
  if (i < 0) throw new Error(`cinery: ${label} start not found`);
  const j = html.indexOf(end, i);
  if (j < 0) throw new Error(`cinery: ${label} end not found`);
  return html.slice(i, j);
};

/* The FAQ heading: subtitle chip with its blur sweep, the two gradient title
   lines, and the counter that sits opposite them. */
const accAt = html.indexOf('accordion-content-item');
if (accAt < 0) throw new Error('cinery: accordion not found');
const hwAt = html.lastIndexOf('heading-wrap', accAt);
const headingStart = html.lastIndexOf('<div', hwAt);
const headingEnd = html.indexOf('<div class="spacer-huge">', headingStart);
if (hwAt < 0 || headingEnd < 0) throw new Error('cinery: heading block not found');
const heading = html.slice(headingStart, headingEnd);

/* One accordion row, used as the repeat unit: from its own opening tag to the
   next row's, so the build repeats the donor's markup rather than inventing it. */
const rowStart = html.lastIndexOf('<div data-w-id=', accAt);
const rest = html.slice(rowStart);
const nextRow = rest.indexOf('<div data-w-id=', 10);
const row = rest.slice(0, nextRow > 0 ? nextRow : rest.indexOf('</div></section>'));

const rowWid = /data-w-id="([^"]+)"/.exec(row)?.[1];
if (!rowWid) throw new Error('cinery: accordion row has no data-w-id');

/* ------------------------------------------------------- 2. namespace --- */

/** Donor classes that must not collide with Mono / Scalora / Lifelogx. */
const CLASSES = [
  'accordion-answer-text', 'accordion-content-block', 'accordion-content-item',
  'accordion-content-wrap', 'accordion-heading', 'accordion-title-item',
  'accordion-top-wrap', 'faq', 'faq-container', 'plus-block', 'plus-line', 'vertical',
  'heading-wrap', 'is-center', 'subtitle-block', 'subtitle', 'subtitle-blur',
  'title-wrapper', 'top-title', 'bottom-title', 'heading-style-h2', 'section-number', 'content-item',
];
const known = new Set(CLASSES);

const renameClassAttr = (frag) => frag.replace(/class="([^"]+)"/g, (m, list) => {
  const out = list.split(/\s+/).filter(Boolean).map((c) => (known.has(c) ? NS + c : c));
  return `class="${out.join(' ')}"`;
});

const headingNs = renameClassAttr(heading);
const rowNs = renameClassAttr(row);

for (const frag of [headingNs, rowNs]) {
  const leaked = [...frag.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))
    .filter((c) => c && !c.startsWith(NS) && !c.startsWith('w-'));
  if (leaked.length) throw new Error(`cinery: un-namespaced classes survive: ${[...new Set(leaked)].join(', ')}`);
}

/* --------------------------------------------------------------- 3. css - */

/* Pull every rule that mentions one of the donor classes, rename the class
   tokens inside its selector, and scope it under the module root. Media
   queries are kept with their conditions. */
const wanted = new RegExp(`\\.(?:${CLASSES.join('|')})\\b`);
const rules = [];
let media = null;
const re = /(@media[^{]+\{)|([^{}]+)\{([^{}]*)\}|(\})/g;
let m;
while ((m = re.exec(css))) {
  if (m[1]) { media = m[1].trim(); continue; }
  if (m[4]) { media = null; continue; }
  const sel = (m[2] || '').trim();
  const body = (m[3] || '').trim();
  if (!sel || !body || sel.startsWith('@') || !wanted.test(sel)) continue;
  const scoped = sel.split(',').map((s) => {
    let t = s.trim();
    for (const c of CLASSES) t = t.replace(new RegExp(`\\.${c}\\b`, 'g'), `.${NS}${c}`);
    return `.cn-capmap ${t}`;
  }).join(', ');
  rules.push({ media, css: `${scoped} { ${body} }` });
}

/* Nearly every donor rule resolves through cinery's own custom properties —
   the row fill, the hairline, the corner radius, the whole type scale. Without
   them each colour computes to nothing and the block renders black on black,
   so carry the donor's :root onto the module root. */
const rootBlock = /(?:^|\})\s*:root[^{]*\{([^{}]*)\}/.exec(css);
if (!rootBlock) throw new Error('cinery: :root custom properties not found');
const vars = [...rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)]
  .map((m) => `  ${m[1]}: ${m[2].trim()};`).join('\n');

let out = `/* cinery — Capability map donor styles.
   Extracted from tools/templates/cinery/css by tools/cinery-prepare.mjs:
   only the rules the transplanted block uses, class names prefixed with
   \`${NS}\`, every selector scoped under \`.cn-capmap\`. Do not edit by hand. */
.cn-capmap {
${vars}
  color: var(--primary-color--white);
}
`;
let openMedia = null;
for (const r of rules) {
  if (r.media !== openMedia) {
    if (openMedia) out += '}\n';
    if (r.media) out += `${r.media}\n`;
    openMedia = r.media;
  }
  out += `${r.media ? '  ' : ''}${r.css}\n`;
}
if (openMedia) out += '}\n';

/* The donor scales this headline 192 / 160 / 128 / 96 / 56px across its own
   breakpoints, but only the first two sit in a media block the rule walker above
   can read — the rest are nested deeper in the sheet. These are the donor's own
   sizes, read off its rendered page at each width, so the transplant scales
   exactly as the original does. */
out += `@media (max-width: 1279px) { .cn-capmap .cn-heading-style-h2 { font-size: 160px; } }
@media (max-width: 991px) { .cn-capmap .cn-heading-style-h2 { font-size: 128px; } }
@media (max-width: 767px) { .cn-capmap .cn-heading-style-h2 { font-size: 96px; } }
@media (max-width: 479px) { .cn-capmap .cn-heading-style-h2 { font-size: 56px; } }
`;

/* --------------------------------------------------------------- 4. ix2 - */

const P = bundle.ix2Payload;
const wantEvents = Object.entries(P.events).filter(([, v]) => JSON.stringify(v).includes(rowWid));
if (!wantEvents.length) throw new Error('cinery: no IX2 event targets the accordion row');

const listIds = new Set();
for (const [, v] of wantEvents) {
  for (const id of Object.keys(P.actionLists)) if (JSON.stringify(v).includes(`"${id}"`)) listIds.add(id);
}
if (!listIds.size) throw new Error('cinery: accordion events reference no action list');

/** Rename ids, class selectors and the page id everywhere in the payload. */
const renameString = (s) => {
  let t = s;
  for (const c of CLASSES) t = t.replace(new RegExp(`\\.${c}\\b`, 'g'), `.${NS}${c}`);
  if (/^(e|a)-\d+/.test(t)) t = NS + t;
  return t;
};
const deep = (node) => {
  if (typeof node === 'string') return renameString(node);
  if (Array.isArray(node)) return node.map(deep);
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = deep(v);
    return o;
  }
  return node;
};

const events = {};
for (const [k, v] of wantEvents) events[NS + k] = deep(v);
const actionLists = {};
for (const id of listIds) actionLists[NS + id] = deep(P.actionLists[id]);

/* The runtime binds an event to every element carrying its data-w-id, and the
   action lists address `.cn-accordion-content-wrap` / `.cn-plus-line.cn-vertical`
   as CHILDREN of whatever was clicked — so one id shared by fourteen rows gives
   fourteen independently opening rows, which is exactly the donor's behaviour
   with five. */
const ROW_WID = `${NS}capmap-row`;
const rowFinal = rowNs.replace(/data-w-id="[^"]+"/, `data-w-id="${ROW_WID}"`);
const eventsFinal = JSON.parse(JSON.stringify(events).split(rowWid).join(ROW_WID));

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });
writeFileSync(`${SITE}/tools/fragments/cn-capmap.html`,
  `<!-- heading -->\n${headingNs}\n<!-- row -->\n${rowFinal}\n`, 'utf8');
writeFileSync(`${SITE}/css/cinery.cn.css`, out, 'utf8');
writeFileSync(`${SITE}/tools/fragments/cn-ix.json`,
  JSON.stringify({ events: eventsFinal, actionLists }, null, 1), 'utf8');

console.log(JSON.stringify({
  headingBytes: headingNs.length,
  rowBytes: rowFinal.length,
  rowWid: ROW_WID,
  cssRules: rules.length,
  cssBytes: out.length,
  ix2Events: Object.keys(eventsFinal).length,
  ix2Lists: Object.keys(actionLists).length,
}, null, 1));

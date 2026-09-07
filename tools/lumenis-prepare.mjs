/**
 * Prepare the lumenis donor for the Capability map's outcome blocks.
 *
 * Donor: tools/templates/lumenis/services.html — one `.services-perspective`
 * card. It is the block the capability map actually needed: a numbered heading,
 * a paragraph, a column of sub-items that expand on click while their plus
 * rotates, a footer line with a button, and a full-height image beside it. The
 * cinery accordion before it could only ever be text.
 *
 * The expansion is Webflow IX2 — event `e-574` binds by CLASS to
 * `.services-list`, and its action list addresses `.answer-holder` and
 * `.question-icon` as CHILDREN of whatever was clicked. Repeating the block
 * therefore just works, the same way it does on the donor's own page.
 *
 * This script mirrors tools/cinery-prepare.mjs:
 *   1. cut one card out of the donor page,
 *   2. prefix every donor class with `lm-` (asserted; lumenis ships names like
 *      `.number`, `.question`, `.answer-text` that would otherwise repaint the
 *      rest of the site),
 *   3. reduce the donor stylesheet to those classes, carrying its :root custom
 *      properties, all scoped under `.lm-capmap`,
 *   4. lift the click events and action lists, renaming the selectors inside
 *      them to match step 2.
 *
 * Output: tools/fragments/lm-card.html, css/lumenis.lm.css,
 *         tools/fragments/lm-ix.json (merged by tools/fuse-ix.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readBundle } from './ix-lib.mjs';

const SITE = 'F:/stargo 网站/stargo-site';
const SRC = `${SITE}/tools/templates/lumenis`;
const NS = 'lm-';

const html = readFileSync(`${SRC}/services.html`, 'utf8');
const css = readFileSync(`${SRC}/css/ovo-lumenis.app.shared.33e9dfedf.css`, 'utf8');
const bundle = readBundle(readFileSync(`${SRC}/js/app.65b6542f.87e162ac6561e6c9.js`, 'utf8'));

/* ------------------------------------------------------------ 1. cut ---- */

const first = html.indexOf('<div class="services-perspective">');
const second = html.indexOf('<div class="services-perspective">', first + 10);
if (first < 0 || second < 0) throw new Error('lumenis: could not isolate one service card');
const card = html.slice(first, second);

/* ------------------------------------------------------- 2. namespace --- */

const CLASSES = [
  'services-perspective', 'services-wrapper', 'services-container', 'services-heading',
  'number', 'h2-style', 'white-text', 'services-list-holder', 'services-list',
  'question', 'question-text', 'white', 'question-icon', 'invert',
  'answer-holder', 'answer-text', 'services-footer', 'services-paragraph-holder',
  'button-holder', 'services-buttons', 'button', 'secondary', 'button-text-holder',
  'button-text', 'red-circle', 'black', 'services-image-holder', 'services-image-full',
  'overlay-services',
];
const known = new Set(CLASSES);

const renameClassAttr = (frag) => frag.replace(/class="([^"]+)"/g, (m, list) =>
  `class="${list.split(/\s+/).filter(Boolean).map((c) => (known.has(c) ? NS + c : c)).join(' ')}"`);

let cardNs = renameClassAttr(card);
const leaked = [...cardNs.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))
  .filter((c) => c && !c.startsWith(NS) && !c.startsWith('w-'));
if (leaked.length) throw new Error(`lumenis: un-namespaced classes survive: ${[...new Set(leaked)].join(', ')}`);

/* The plus icon is a remote SVG on the donor's CDN; this site makes no
   off-origin requests, so point it at the copy mirrored beside the template. */
cardNs = cardNs.replace(/src="https:\/\/cdn\.prod\.website-files\.com\/[^"]*Plus%20Icon\.svg"/g,
  'src="assets/lumenis/plus-icon.svg"');
if (/cdn\.prod\.website-files\.com/.test(cardNs)) {
  cardNs = cardNs.replace(/<img[^>]*cdn\.prod\.website-files\.com[^>]*>/g, (tag) =>
    tag.replace(/src="[^"]*"/, 'src="assets/stargo-editorial/os-desktop.webp"'));
}

/* --------------------------------------------------------------- 3. css - */

const rootBlock = /(?:^|\})\s*:root[^{]*\{([^{}]*)\}/.exec(css);
const vars = rootBlock
  ? [...rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map((m) => `  ${m[1]}: ${m[2].trim()};`).join('\n')
  : '';

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
    return `.lm-capmap ${t}`;
  }).join(', ');
  rules.push({ media, css: `${scoped} { ${body} }` });
}

let out = `/* lumenis — Capability map outcome-card styles.
   Extracted from tools/templates/lumenis/css by tools/lumenis-prepare.mjs:
   only the rules the transplanted card uses, class names prefixed with \`${NS}\`,
   every selector scoped under \`.lm-capmap\`. Do not edit by hand. */
.lm-capmap {
${vars}
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

/* --------------------------------------------------------------- 4. ix2 - */

const P = bundle.ix2Payload;
const wantEvents = Object.entries(P.events)
  .filter(([, v]) => /"selector":"\.services-list"/.test(JSON.stringify(v)));
if (!wantEvents.length) throw new Error('lumenis: no IX2 event binds to .services-list');

const listIds = new Set();
for (const [, v] of wantEvents) {
  for (const id of Object.keys(P.actionLists)) if (JSON.stringify(v).includes(`"${id}"`)) listIds.add(id);
}
if (!listIds.size) throw new Error('lumenis: the service-list events reference no action list');

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

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });
writeFileSync(`${SITE}/tools/fragments/lm-card.html`, cardNs, 'utf8');
writeFileSync(`${SITE}/css/lumenis.lm.css`, out, 'utf8');
writeFileSync(`${SITE}/tools/fragments/lm-ix.json`, JSON.stringify({ events, actionLists }, null, 1), 'utf8');

console.log(JSON.stringify({
  cardBytes: cardNs.length,
  subItems: (cardNs.match(/lm-services-list/g) ?? []).length,
  cssRules: rules.length,
  cssBytes: out.length,
  ix2Events: Object.keys(events).length,
  ix2Lists: Object.keys(actionLists).length,
}, null, 1));

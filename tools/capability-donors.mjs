/**
 * Extract every donor block the capability page is built from.
 *
 * The page is assembled out of blocks lifted from four Webflow templates, each
 * keeping its own design and its own motion, with only the words replaced. This
 * script is the whole extraction step: one entry per block, all of them going
 * through tools/donor-lib.mjs, which carries the traps that cost us a day
 * (page-scoped interaction ids, bare-element typography, w-layout-* classes,
 * :root custom properties, runtime preset names, the background parent).
 *
 * It writes, per block, `tools/fragments/<id>.html`; per donor, the reduced
 * stylesheet `css/<donor>.<ns>.css` and the interaction payload
 * `tools/fragments/<ns>-ix.json` that tools/fuse-ix.mjs merges into the single
 * Webflow bundle every page loads.
 *
 * Adding a block is one entry here. Nothing else in the chain needs to change:
 * fuse-ix picks up fragments by directory, and build-site reads them by id.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { extractBlock } from './donor-lib.mjs';
import { DONORS, loadBlocks } from './block-lib.mjs';

const SITE = 'F:/stargo 网站/stargo-site';

/* Every block is a module in tools/blocks; nothing is configured inline any
   more. See tools/blocks/README.md. */
const BLOCKS = [];

/* ------------------------------------------------------------------ run -- */

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });

const sheets = new Map();     // donor -> [rule text]
const payloads = new Map();   // donor -> {events, actionLists}
const report = [];
const assets = {};        // donor url -> local path, across every block
const scripts = [];       // hand-written block scripts, in page order

/* Blocks written as their own module in tools/blocks come along too; see the
   README there. Keeping both lets a block be built and reviewed on its own
   without every block having to move at once. */
const ALL = [...BLOCKS, ...[...(await loadBlocks()).values()].map((m) => m.donor)];
const seen = new Set();
for (const b of ALL) {
  if (seen.has(b.id)) throw new Error(`two blocks claim id ${b.id}`);
  seen.add(b.id);
  const d = DONORS[b.donor];
  if (!d) throw new Error(`${b.id}: unknown donor ${b.donor}`);

  const out = extractBlock({
    srcDir: d.dir, page: b.page, css: b.css, ns: d.ns, scope: b.scope,
    start: b.start, end: b.end, wrap: b.wrap,
    images: b.images, imageStems: b.imageStems, cssImages: b.cssImages,
    mirror: b.mirror ?? `assets/${b.donor}`,
  });
  Object.assign(assets, out.assets);

  writeFileSync(`${SITE}/tools/fragments/${b.id}.html`, out.html, 'utf8');

  if (!sheets.has(b.donor)) sheets.set(b.donor, []);
  sheets.get(b.donor).push(out.css);

  /* Some donors keep a block legible only through their own `body` rule: the
     block paints nothing, and every word in it is white. Dropped onto a light
     page that is white on white, so a block may declare the ground it was
     drawn on and it is written onto its own scope root. */
  if (b.ground) {
    sheets.get(b.donor).push(
      `/* ${b.id}: the donor painted this ground on <body>; the block needs it itself. */\n`
      + `${b.scope} { background-color: ${b.ground}; }\n`);
  }

  /* A block may ship its own hand-written rules beside its module, for the
     things an extraction cannot know: what the donor kept on `body`, what
     Webflow wrote against a generated node id, and type drawn for one English
     word that now holds a capability's full name. They are appended after the
     extracted rules so they win at equal specificity, and they live with the
     block so two blocks are never edited in the same file. */
  /* A block may also ship a small script beside its module, for behaviour the
     donor did not author (the review asked for click-to-expand nodes on the
     foundations block). Concatenated into js/capability-blocks.js, loaded on
     the capability page after the Webflow bundle. */
  const ownJs = `${SITE}/tools/blocks/${b.id}.js`;
  if (existsSync(ownJs)) scripts.push(`/* ---- ${b.id}: tools/blocks/${b.id}.js ---- */
${readFileSync(ownJs, 'utf8')}
`);

  const own = `${SITE}/tools/blocks/${b.id}.css`;
  if (existsSync(own)) {
    sheets.get(b.donor).push(`/* ---- ${b.id}: hand-written, from tools/blocks/${b.id}.css ---- */\n${readFileSync(own, 'utf8')}\n`);
  }

  if (!payloads.has(b.donor)) payloads.set(b.donor, { events: {}, actionLists: {} });
  const p = payloads.get(b.donor);
  for (const [k, v] of Object.entries(out.ix.events)) {
    const seen = p.events[k];
    if (seen && JSON.stringify(seen) !== JSON.stringify(v)) throw new Error(`${b.id}: event ${k} conflicts with an earlier block`);
    p.events[k] = v;
  }
  for (const [k, v] of Object.entries(out.ix.actionLists)) {
    const seen = p.actionLists[k];
    if (seen && JSON.stringify(seen) !== JSON.stringify(v)) throw new Error(`${b.id}: action list ${k} conflicts with an earlier block`);
    p.actionLists[k] = v;
  }

  report.push({ id: b.id, ...out.stats });
}

for (const [donor, parts] of sheets) {
  const d = DONORS[donor];
  const head = `/* ${donor} — capability-page blocks.\n`
    + `   Written by tools/capability-donors.mjs out of ${d.dir.split('/').pop()}: only the\n`
    + `   rules the transplanted blocks use, class names prefixed with \`${d.ns}\`, every\n`
    + `   selector scoped under the block's own root class. Do not edit by hand. */\n`;
  writeFileSync(`${SITE}/css/${d.sheet}`, head + parts.join(''), 'utf8');
}

for (const [donor, p] of payloads) {
  const d = DONORS[donor];
  /* `<ns>cap-ix.json`, not `<ns>ix.json`: the older per-donor prepare scripts
     still own that name for the blocks they transplanted (cinery's catalogue
     accordion, lumenis's cards), and this driver must not overwrite them.
     tools/fuse-ix.mjs picks up every *-ix.json in the directory either way, and
     refuses two payloads that claim the same interaction id. */
  writeFileSync(`${SITE}/tools/fragments/${d.ns}cap-ix.json`, JSON.stringify(p, null, 1), 'utf8');
}

/* Every donor asset the page now points at. tools/mirror-donor-assets.mjs
   fetches the ones not yet on disk; the build refuses to ship a reference to a
   file that is not there. */
writeFileSync(`${SITE}/js/capability-blocks.js`,
  `/* Capability-page block scripts. Written by tools/capability-donors.mjs from tools/blocks/<id>.js. Do not edit by hand. */
(function(){
${scripts.join('\n')}
})();
`, 'utf8');
writeFileSync(`${SITE}/tools/fragments/donor-assets.json`, JSON.stringify(assets, null, 1), 'utf8');
const missing = Object.values(assets).filter((p) => !existsSync(`${SITE}/${p}`));
console.log(JSON.stringify(report, null, 1));
if (missing.length) {
  console.error(`
${missing.length} donor asset(s) not mirrored yet — run: node tools/mirror-donor-assets.mjs`);
  if (!process.argv.includes('--allow-missing')) process.exit(2);
}

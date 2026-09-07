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

/* qubix's own layout chain. Its blocks are inner boxes; cut on their own they
   lose the section padding and the centred container they were drawn inside,
   so each one is put back into the same three wrappers the donor uses. */
const QX_FRAME = ['values-section', 'w-layout-blockcontainer container w-container', 'values-wrap'];

/** One entry per block on the page, in the order the page uses them. */
const BLOCKS = [
  {
    id: 'rk-hero',
    donor: 'renok',
    scope: '.rk-hero',
    page: 'index.html',
    /* The centred headline with one italic accent word, a paragraph and a pill
       button, each fading up through the donor's own scroll interactions. */
    start: '<section class="rt-home-v1-hero',
    end: '</section>',
    /* Its ground: the hero sets white type, and this is the parent that makes
       that legible. */
    wrap: 'rt-position-relative rt-background-black',
    /* renok draws the hero on a flowing silk photograph served from Webflow's
       CDN. Webflow exports never bundle their images, so keeping it would mean
       every visitor fetching an asset from someone else's origin on every load
       -- which this site does not do. The hero keeps the black ground the
       artwork sat on; the artwork itself needs a local replacement before it
       can come back. */
    cssImages: {
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6984740bccbd8094497d2ea9_home-one-hero-banner-background.webp': 'none',
    },
  },

  /* ---- 一个外贸闭环: a qubix statement over renok's numbered rows ---- */
  {
    id: 'qx-statement',
    donor: 'qubix',
    scope: '.qx-statement',
    page: 'about.html',
    /* The chapter opening from qubix's "Our Values" section: an oversized
       statement heading with a right-set paragraph beside it, each sliding up
       on its own scroll trigger. Cut without the card row below it so the same
       opening can introduce two different sections. */
    start: '<div class="values-title-des-box">',
    end: 'that connect brands with people.</div></div></div>',
    wrap: QX_FRAME,
  },
  {
    id: 'rk-insight',
    donor: 'renok',
    scope: '.rk-insight',
    page: 'index.html',
    /* renok's "Insights" list: numbered rows, each a number, a one-line
       description and a large title, revealing bottom-up as the row arrives.
       The nine export stages go here. */
    start: '<section class="rt-insight rt-overflow-hidden"><div class="rt-insights-main">',
    end: 'rt-insights-item-line rt-line-three rt-tab-display-off"></div></a></div></section>',
    /* The donor's row art lives on Webflow's CDN and this site makes no
       off-origin requests, so each row gets one of the site's own product
       images and the row arrow is redrawn locally. Responsive variants point at
       the same file: these render at a few hundred pixels either way. */
    images: {
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6984882f1c5830dd993f1338_home-one-insights-arrow-icon.svg': 'assets/renok/insights-arrow.svg',
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6989bf533245fae29d2aeda5_home-one-insights-p-500.webp': 'assets/stargo-editorial/os-cockpit.webp',
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6989bf533245fae29d2aeda5_home-one-insights.webp': 'assets/stargo-editorial/os-cockpit.webp',
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6989a3d6fa214020a33d3676_home-one-optimization-p-500.webp': 'assets/stargo-editorial/os-quote-studio.webp',
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6989a3d6fa214020a33d3676_home-one-optimization.webp': 'assets/stargo-editorial/os-quote-studio.webp',
      'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6989bf53180d1f3293b6aee3_home-one-analytics.avif': 'assets/stargo-editorial/os-trade-execution.webp',
    },
  },

];

/* ------------------------------------------------------------------ run -- */

mkdirSync(`${SITE}/tools/fragments`, { recursive: true });

const sheets = new Map();     // donor -> [rule text]
const payloads = new Map();   // donor -> {events, actionLists}
const report = [];

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
  });

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

console.log(JSON.stringify(report, null, 1));

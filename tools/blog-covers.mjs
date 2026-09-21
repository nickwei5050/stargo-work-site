/**
 * Blog covers, written as 1200/800/500px WebP with plain file names in
 * assets/blog/. One entry per article slug; the article data in tools/blog.mjs
 * refers to the slug, and the build reads the files from there into the article
 * hero, the blog index, the homepage cards, the workforce story strip, the
 * related lists, og:image/twitter:image and the BlogPosting structured data.
 *
 * Sources. Five covers are the owner's own product screenshots (the handoff of
 * 2026-09-18, registered in tools/imagegen/product-assets.json): the article
 * shows the STARGO surface it actually describes. Two keep this site's own
 * editorial artwork, because no approved screenshot shows what they are about —
 * approval gates and the enterprise knowledge model. The covers used to be the
 * Mono template's product photography — earbuds, a grey tool on red — which
 * said nothing about any of it. Our own images either way, so no third-party
 * licence or attribution is involved.
 *
 * Fit. The frame is 3:2, the ratio the homepage cards (3 / 2.3) and the blog
 * grid (1:1) both crop from. The homepage card draws a badge over its own
 * copy of the cover; the band that keeps it off the interface is on that card
 * (css/stargo-fusion.css, V7-BLOG r3), not in these files, because the badge is
 * the same size on every card and the cards are not. The editorial artwork is square-ish and is centre
 * cropped to it, as it always was. A product screenshot is 16:9 and is an
 * interface: a centre crop to 3:2 would cut the left navigation off every one
 * of them, so the whole screenshot is fitted inside the frame with a small
 * margin, on one flat colour sampled from the screenshot's own border. The
 * boxes that then crop the 3:2 cover further — the square blog-index card and
 * the homepage card — hold the same colour and stop cropping, in the V7-BLOG r3
 * block of css/stargo-fusion.css. Nothing is cut anywhere.
 *
 * sharp is gone. It is not installed by this repository and could not be, so
 * the pixels are Pillow's: this file builds a JSON job and tools/blog-covers.py
 * renders it. The recipe below is still the documentation of how every cover
 * was made.
 *
 *   node tools/blog-covers.mjs        # needs python + Pillow, not sharp
 *
 * Idempotent. tools/imagegen/blog-covers.json records each file's recipe and
 * the sha256 of the bytes that recipe produced, so a rerun writes nothing and
 * changes no file — while a changed recipe, a missing file or a file whose
 * bytes drifted is rebuilt, and only that file. A cover that exists but has no
 * record yet is adopted as it stands rather than re-encoded, so switching
 * encoders never rewrites a cover that nobody asked to change.
 *
 * STARGO_PYTHON names the interpreter if `python3`/`python`/`py` is not it.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { SITE } from './paths.mjs';
import { POSTS, PRODUCT_COVERS } from './blog.mjs';

const OUT = 'assets/blog';
const RECORD = 'tools/imagegen/blog-covers.json';
/** 1200x800 and the two smaller widths the srcset offers (tools/blog.mjs coverSrcset). */
const SIZES = [[1200, 800], [800, 533], [500, 333]];

/* `plate` is the flat colour behind a fitted screenshot: the most common colour
   of that screenshot's own outer border, so the picture does not sit in a band
   of some other colour. The same value is repeated in css/stargo-fusion.css
   (V7-BLOG r3) for the card boxes that letterbox the cover further. */
const COVERS = {
  'stargo-work-visual-guide': {                     // the whole product, from the front door inwards
    source: 'assets/stargo-product/sw004-experts-library.webp', fit: 'contain', plate: '#021d4d',
    why: 'the guide counts 288 roles across ten functions; the experts library is that catalogue, filtered by function',
  },
  'start-with-one-workflow': {                      // one business process, defined and picked up
    source: 'assets/stargo-product/sw008-workflow-library.webp', fit: 'contain', plate: '#001135',
    why: 'the workflow library: each process with its steps, its approval points and its integration status',
  },
  'from-inquiry-to-quote': {                        // the surface the article walks through
    source: 'assets/stargo-product/sw028-sales-desk-inquiry-reply.webp', fit: 'contain', plate: '#e8f1fe',
    why: 'an inquiry with the facts pulled out of it and a grounded draft reply beside it',
  },
  'approval-gates-for-ai-in-trade': {               // the view an approver works from
    source: 'assets/stargo-editorial/os-cockpit.webp', fit: 'cover',
    why: 'kept: no approved product screenshot shows an approval gate',
  },
  'ai-operating-system-for-global-trade': {         // the operating system itself
    source: 'assets/stargo-product/sw003-ai-workspace-home.webp', fit: 'contain', plate: '#0e2b5a',
    why: 'the workspace home: one request goes in, with experts, tasks and company knowledge beside it',
  },
  '288-ai-employees-not-288-chatbots': {            // the roster the article explains
    source: 'assets/stargo-product/sw006-expert-teams.webp', fit: 'contain', plate: '#00173c',
    why: 'five roles divide one inquiry between them and leave a record of what each finished',
  },
  'enterprise-ontology-explained': {                // the model of the business
    source: 'assets/stargo-editorial/brand-ontology.webp', fit: 'cover',
    why: 'kept: no approved product screenshot shows the enterprise knowledge model',
  },
};
const PAD = 0.02;          // contain: the margin round a fitted screenshot, as a fraction of the frame width
const QUALITY = 82;        // as the covers have always been encoded

/* Every article has a cover and every cover has an article. */
const slugs = POSTS.map((p) => p.cover);
for (const slug of slugs) if (!COVERS[slug]) throw new Error(`blog covers: no source for ${slug}`);
for (const slug of Object.keys(COVERS)) if (!slugs.includes(slug)) throw new Error(`blog covers: ${slug} is not an article`);
/* One source per cover: two articles must never carry the same picture. */
const sources = Object.values(COVERS).map((c) => c.source);
if (new Set(sources).size !== sources.length) throw new Error('blog covers: two covers share a source image');
/* The article pages say which covers are product screenshots (tools/blog.mjs
   PRODUCT_COVERS drives the hero's disclosure and the plate rules in
   css/stargo-fusion.css). That list and this one are the same list. */
const fitted = Object.entries(COVERS).filter(([, c]) => c.fit === 'contain').map(([slug]) => slug);
if (fitted.length !== PRODUCT_COVERS.size || fitted.some((slug) => !PRODUCT_COVERS.has(slug))) {
  throw new Error(`blog covers: the fitted covers (${fitted.sort().join(', ')}) and tools/blog.mjs PRODUCT_COVERS (${[...PRODUCT_COVERS].sort().join(', ')}) disagree`);
}
for (const [slug, c] of Object.entries(COVERS)) {
  if ((c.fit === 'contain') !== c.source.startsWith('assets/stargo-product/')) throw new Error(`blog covers: ${slug} is fitted only if it is a product screenshot`);
  if (c.fit === 'contain' && !/^#[0-9a-f]{6}$/.test(c.plate ?? '')) throw new Error(`blog covers: ${slug} needs a plate colour`);
}

const file = (slug, w) => `${OUT}/${slug}${w === 1200 ? '' : `-${w}`}.webp`;
const sha256 = (rel) => createHash('sha256').update(readFileSync(`${SITE}/${rel}`)).digest('hex');
const recipeOf = (slug, [w, h]) => {
  const c = COVERS[slug];
  return c.fit === 'contain'
    ? { source: c.source, mode: 'contain', canvas: [w, h], pad: PAD, plate: c.plate, quality: QUALITY }
    : { source: c.source, mode: 'cover', canvas: [w, h], quality: QUALITY };
};

mkdirSync(`${SITE}/${OUT}`, { recursive: true });
const record = existsSync(`${SITE}/${RECORD}`) ? JSON.parse(readFileSync(`${SITE}/${RECORD}`, 'utf8')) : { files: {} };
const jobs = [];
const adopted = [];
const wanted = [];
for (const slug of slugs) {
  for (const size of SIZES) {
    const target = file(slug, size[0]);
    const recipe = recipeOf(slug, size);
    if (!existsSync(`${SITE}/${recipe.source}`)) throw new Error(`blog covers: source missing: ${recipe.source}`);
    const had = record.files?.[target];
    const current = { target, recipe };
    wanted.push(current);
    if (!existsSync(`${SITE}/${target}`)) { jobs.push(current); continue; }
    if (!had) { adopted.push(target); continue; }                                   // built before this record existed: leave it alone
    if (JSON.stringify(had.recipe) !== JSON.stringify(recipe)) { jobs.push(current); continue; }
    if (had.sha256 !== sha256(target)) jobs.push(current);                          // bytes drifted from the recipe: rebuild
  }
}

if (jobs.length) {
  const jobFile = `${tmpdir()}/stargo-blog-covers-${process.pid}.json`;
  writeFileSync(jobFile, JSON.stringify({
    jobs: jobs.map(({ target, recipe }) => ({ ...recipe, source: `${SITE}/${recipe.source}`, target: `${SITE}/${target}` })),
  }, null, 1));
  const tried = [];
  let ran = null;
  for (const exe of [process.env.STARGO_PYTHON, 'python3', 'python', 'py'].filter(Boolean)) {
    const r = spawnSync(exe, [`${SITE}/tools/blog-covers.py`, jobFile], { encoding: 'utf8' });
    if (r.error) { tried.push(`${exe}: ${r.error.code}`); continue; }
    ran = { exe, ...r };
    break;
  }
  try { unlinkSync(jobFile); } catch { /* the interpreter may have gone before the job file was read */ }
  if (!ran) throw new Error(`blog covers: no python interpreter (${tried.join(', ')}). Set STARGO_PYTHON, and install Pillow.`);
  if (ran.status !== 0) throw new Error(`blog covers: ${ran.exe} failed\n${ran.stderr || ran.stdout}`);
  process.stdout.write(ran.stdout);
}

/* The record, rebuilt from what is now on disk. Written only when it changes,
   so a second run leaves the working tree exactly as the first one left it. */
const files = {};
for (const { target, recipe } of wanted) files[target] = { recipe, sha256: sha256(target) };
const next = JSON.stringify({
  note: 'Written by tools/blog-covers.mjs. Each cover file, the recipe it was made with and the sha256 of the bytes that recipe produced. A rerun rebuilds only the files whose recipe or bytes no longer match.',
  generator: 'tools/blog-covers.mjs + tools/blog-covers.py (Pillow)',
  files,
}, null, 2) + '\n';
const changed = !existsSync(`${SITE}/${RECORD}`) || readFileSync(`${SITE}/${RECORD}`, 'utf8') !== next;
if (changed) writeFileSync(`${SITE}/${RECORD}`, next);
console.log(`blog covers: ${slugs.length} articles, ${wanted.length} files — ${jobs.length} written, ${adopted.length} adopted as found, ${wanted.length - jobs.length - adopted.length} already current; record ${changed ? 'updated' : 'unchanged'}`);

/**
 * Blog covers, written as 1200/800/500px WebP with plain file names in
 * assets/blog/. One entry per article slug; the article data in tools/blog.mjs
 * refers to the slug, and the build reads the files from there into the article
 * hero, the blog index, the workforce story strip, the related lists,
 * og:image/twitter:image and the BlogPosting structured data.
 *
 * One set, one recipe (2026-10-09, revised the same day after review). All
 * seven covers are crops of OPEN WORK renders made by tools/openwork/render.mjs
 * (the 2400px variant of each 1280x880 scene): the region the article is about
 * — the reply draft with its approval bar, the PI waiting for the manager, the
 * automation list, the roster — at the cover's own 2:1, scaled down, never up.
 * The first set fitted each whole window into a 3:2 plate; at 395px on the
 * index the seven grey windows looked alike and none could be read. The window
 * frame and the 「演示数据」/"Demo data" badge are HTML round the picture
 * (tools/ow-blocks/blog.mjs), the same frame as every other product picture.
 * The covers used to be the owner's earlier screenshots (an internal registry
 * page, an open-source workflow tool's login, the retired desktop) and two
 * generated artworks; none of that is left, and no third-party product, garbled
 * label or "open source" claim can come back through this file: a source must
 * be one of the ow*-ids rendered by tools/openwork/render.mjs and registered in
 * tools/imagegen/product-assets.json.
 *
 * Which render is which article: tools/blog.mjs COVER_RENDER (the article page
 * reads it too, for the note under the cover); the region is BOX below.
 *
 * Reproducible. The recipe of every file carries the sha256 of its source
 * render, so a re-rendered OPEN WORK scene rebuilds exactly the covers made
 * from it, and a cover can never silently keep a picture that no longer
 * matches its source (the old covers were made from sw003/sw004 files whose
 * content was later replaced, and would have turned into the wrong pictures on
 * the next recipe change).
 *
 * sharp is gone. It is not installed by this repository and could not be, so
 * the pixels are Pillow's: this file builds a JSON job and tools/blog-covers.py
 * renders it.
 *
 *   node tools/blog-covers.mjs        # needs python + Pillow, not sharp
 *
 * Idempotent. tools/imagegen/blog-covers.json records each file's recipe and
 * the sha256 of the bytes that recipe produced, so a rerun writes nothing and
 * changes no file — while a changed recipe, a changed source render, a missing
 * file or a file whose bytes drifted is rebuilt, and only that file. A cover
 * that exists but has no record yet is adopted as it stands.
 *
 * STARGO_PYTHON names the interpreter if `python3`/`python`/`py` is not it.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { SITE } from './paths.mjs';
import { POSTS, PRODUCT_COVERS, COVER_RENDER } from './blog.mjs';

const OUT = 'assets/blog';
const RECORD = 'tools/imagegen/blog-covers.json';
/** 1200x600 (2:1, also the share image) and the two smaller widths the srcset offers (tools/blog.mjs coverSrcset). */
const SIZES = [[1200, 600], [800, 400], [500, 250]];

/* The region of each render the cover shows: x, y, width as fractions of the
   render (the height follows from the 2:1 canvas, about the box's centre).
   Chosen by eye against tools/openwork/hotspots.json; the width is at least
   half the render, so the 2400px source is never enlarged for the 1200 file. */
const BOX = {
  'stargo-work-visual-guide':             { box: [0.195, 0.055, 0.79, 0.5745], why: 'the welcome page: the greeting, the quick-task tabs and the first task cards' },
  'start-with-one-workflow':              { box: [0.34, 0.03, 0.65, 0.4727], why: 'the automation list: each flow, its trigger and its switch' },
  'from-inquiry-to-quote':                { box: [0.295, 0.44, 0.6, 0.4364], why: 'the facts pulled out of the inquiry and the reply draft waiting for approval' },
  'approval-gates-for-ai-in-trade':       { box: [0.295, 0.275, 0.6, 0.4364], why: 'the PI, below the price list, sitting with the manager instead of going out' },
  'ai-operating-system-for-global-trade': { box: [0.0, 0.075, 0.94, 0.6836], why: 'the workspace: the 15 apps on the left, the message box and five quick actions' },
  '288-ai-employees-not-288-chatbots':    { box: [0.355, 0.11, 0.64, 0.4655], why: 'the roster of 288 digital employees, its groups and the first role cards' },
  'enterprise-ontology-explained':        { box: [0.33, 0.035, 0.665, 0.4836], why: 'the customer record table the other apps read from' },
};
const source = (slug) => `assets/stargo-product/${COVER_RENDER[slug]}-2400.webp`;
const QUALITY = 82;        // as the covers have always been encoded

/* Every article has a cover and every cover has an article. */
const slugs = POSTS.map((p) => p.cover);
for (const slug of slugs) if (!COVER_RENDER[slug] || !BOX[slug]) throw new Error(`blog covers: no source or region for ${slug}`);
for (const slug of [...Object.keys(COVER_RENDER), ...Object.keys(BOX)]) if (!slugs.includes(slug)) throw new Error(`blog covers: ${slug} is not an article`);
/* One source per cover: two articles must never carry the same picture. */
const sources = slugs.map(source);
if (new Set(sources).size !== sources.length) throw new Error('blog covers: two covers share a source image');
/* Every cover is an OPEN WORK render (an `ow<nn>-…` id registered by tools/openwork/render.mjs):
   no screenshot of any other product, and no sw0xx file whose content can change under it. */
const productAssets = JSON.parse(readFileSync(`${SITE}/tools/imagegen/product-assets.json`, 'utf8')).assets;
for (const slug of slugs) {
  const id = source(slug).match(/^assets\/stargo-product\/(ow\d\d-[a-z-]+)-2400\.webp$/)?.[1];
  if (!id) throw new Error(`blog covers: ${slug} must be made from an OPEN WORK render (assets/stargo-product/ow<nn>-…-2400.webp), not ${source(slug)}`);
  if (!productAssets.some((a) => a.id === id && a.renderer === 'tools/openwork/render.mjs')) throw new Error(`blog covers: ${id} is not registered as an OPEN WORK render in tools/imagegen/product-assets.json`);
}
/* The article pages say which covers are product renders (tools/blog.mjs PRODUCT_COVERS drives the
   hero's disclosure). Now that is every article, and the two lists must stay the same list. */
if (slugs.length !== PRODUCT_COVERS.size || slugs.some((slug) => !PRODUCT_COVERS.has(slug))) {
  throw new Error(`blog covers: the covers (${[...slugs].sort().join(', ')}) and tools/blog.mjs PRODUCT_COVERS (${[...PRODUCT_COVERS].sort().join(', ')}) disagree`);
}

const file = (slug, w) => `${OUT}/${slug}${w === 1200 ? '' : `-${w}`}.webp`;
const sha256 = (rel) => createHash('sha256').update(readFileSync(`${SITE}/${rel}`)).digest('hex');
const recipeOf = (slug, [w, h]) => ({ source: source(slug), sourceSha256: sha256(source(slug)), mode: 'focus', box: BOX[slug].box, canvas: [w, h], quality: QUALITY });

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

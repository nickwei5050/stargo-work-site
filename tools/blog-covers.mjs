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
 * On the site that badge is enough, but a share preview (WeChat, LinkedIn, X:
 * og:image / twitter:image) shows the bare file, so each article also has a
 * share file, <slug>-share.webp, that carries a 「演示数据 · Demo data」 chip of
 * its own in the top right corner (review, round 2): one chip for both
 * languages, because one file serves both, in the demo film's own badge style
 * (tools/openwork/video-page.mjs .vbadge — white pill, hairline edge, amber
 * dot). Chromium draws it with the renders' fonts; Pillow pastes it. CHIP below.
 * The files the pages show (<slug>.webp, -800, -500) have no chip (review,
 * round 3): under the window bar's own badge the chip said 「演示数据」 a second
 * time, twice the badge's size on the article hero, over the interface's
 * 「可报价」 tag.
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
 * Drawing the chip needs Chromium (this repository's @playwright/test,
 * PLAYWRIGHT_BROWSERS_PATH) and the renders' fonts (@fontsource-variable/inter,
 * @fontsource/noto-sans-sc through STARGO_TOOL_PACKAGE, as for
 * tools/openwork/render.mjs) — only when a cover is rebuilt.
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
import { mkdtempSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { SITE, req } from './paths.mjs';
import { POSTS, PRODUCT_COVERS, COVER_RENDER } from './blog.mjs';
import { css as owCss } from './openwork/scenes.mjs';
import { videoCss } from './openwork/video-page.mjs';

const OUT = 'assets/blog';
const RECORD = 'tools/imagegen/blog-covers.json';
/** The pages' files: 1200x600 (2:1) and the two smaller widths the srcset offers (tools/blog.mjs coverSrcset). */
const SIZES = [[1200, 600], [800, 400], [500, 250]];
/** The share file (og:image, twitter:image, BlogPosting image; tools/blog.mjs coverShareSrc): 1200x600 with the chip. */
const SHARE = [1200, 600];

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
  '288-ai-staff-not-288-chatbots':    { box: [0.355, 0.11, 0.64, 0.4655], why: 'the roster of 288 AI Staff, its groups and the first role cards' },
  'enterprise-ontology-explained':        { box: [0.33, 0.035, 0.665, 0.4836], why: 'the customer record table the other apps read from' },
};
const source = (slug) => `assets/stargo-product/${COVER_RENDER[slug]}-2400.webp`;
const QUALITY = 82;        // as the covers have always been encoded
/* The demo-data chip: its words, its corner, its distance from the two edges
   (a fraction of the cover's width), its size (CSS px of the film's badge per
   1200px of cover: 30px tall there, 54px here) and the padding round it in the
   PNG Chromium writes (room for its soft shadow). Part of every share file's
   recipe, so a change here rebuilds every share file. */
const CHIP = { text: '演示数据 · Demo data', corner: 'top-right', inset: 0.02, scale: 1.8, pad: 8, style: 'video-page.mjs .vbadge + shadow 0 2px 6px rgba(15,23,42,.10)' };

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
const shareFile = (slug) => `${OUT}/${slug}-share.webp`;
const sha256 = (rel) => createHash('sha256').update(readFileSync(`${SITE}/${rel}`)).digest('hex');
const recipeOf = (slug, [w, h], chip = null) => ({ source: source(slug), sourceSha256: sha256(source(slug)), mode: 'focus', box: BOX[slug].box, canvas: [w, h], quality: QUALITY, ...(chip ? { chip } : {}) });

/** The chip as a transparent PNG for each cover width; Chromium, the renders' CSS and fonts. */
async function drawChips(widths) {
  const { chromium } = req('@playwright/test');
  const font = (p) => req.resolve(p);
  const dir = mkdtempSync(`${tmpdir()}/stargo-chip-`);
  writeFileSync(`${dir}/chip.css`, owCss({ interCss: font('@fontsource-variable/inter/index.css'), notoDir: font('@fontsource/noto-sans-sc/index.css').replace(/index\.css$/, '') }) + videoCss()
    + `html,body{background:transparent!important}.chip-pad{display:inline-block;padding:${CHIP.pad}px}.chip-pad .vbadge{margin:0;box-shadow:0 2px 6px rgba(15,23,42,.10)}`);
  writeFileSync(`${dir}/chip.html`, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><link rel="stylesheet" href="chip.css"></head><body><span class="chip-pad"><span class="vbadge"><i></i>${CHIP.text}</span></span></body></html>`);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--disable-gpu', '--num-raster-threads=1'] });
  const files = {};
  try {
    for (const w of widths) {
      const dsf = CHIP.scale * w / 1200;
      const page = await browser.newPage({ viewport: { width: 640, height: 160 }, deviceScaleFactor: dsf });
      await page.goto(pathToFileURL(`${dir}/chip.html`).href);
      await page.evaluate(async () => { document.body.getBoundingClientRect(); await document.fonts.ready; });
      if (await page.evaluate(() => document.fonts.status) !== 'loaded') throw new Error('blog covers: the chip\'s fonts did not load');
      files[w] = { file: `${dir}/chip-${w}.png`, pad: Math.round(CHIP.pad * dsf) };
      await page.locator('.chip-pad').screenshot({ path: files[w].file, omitBackground: true });
      await page.close();
    }
  } finally { await browser.close(); }
  return { dir, files };
}

mkdirSync(`${SITE}/${OUT}`, { recursive: true });
const record = existsSync(`${SITE}/${RECORD}`) ? JSON.parse(readFileSync(`${SITE}/${RECORD}`, 'utf8')) : { files: {} };
const jobs = [];
const adopted = [];
const wanted = [];
for (const slug of slugs) {
  for (const [target, recipe] of [...SIZES.map((size) => [file(slug, size[0]), recipeOf(slug, size)]), [shareFile(slug), recipeOf(slug, SHARE, CHIP)]]) {
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
  const chipped = jobs.filter(({ recipe }) => recipe.chip);
  const chips = chipped.length ? await drawChips([...new Set(chipped.map(({ recipe }) => recipe.canvas[0]))]) : null;
  const jobFile = `${tmpdir()}/stargo-blog-covers-${process.pid}.json`;
  writeFileSync(jobFile, JSON.stringify({
    jobs: jobs.map(({ target, recipe }) => {
      const job = { ...recipe, source: `${SITE}/${recipe.source}`, target: `${SITE}/${target}` };
      if (!recipe.chip) return job;
      const chip = chips.files[recipe.canvas[0]];
      return { ...job, overlay: { file: chip.file, pad: chip.pad, corner: CHIP.corner, inset: Math.round(CHIP.inset * recipe.canvas[0]) } };
    }),
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
  if (chips) rmSync(chips.dir, { recursive: true, force: true });
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

/** Static asset coverage + real-browser responsive/image/navigation regression. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from './paths.mjs';
const { chromium } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const manifest = JSON.parse(readFileSync('tools/imagegen/assets-manifest.json', 'utf8'));
/* The owner's own product screenshots (handoff of 2026-09-18) are registered
   beside the generated imagery and checked the same way: unique sources, every
   size on disk, alt/width/height on the page. They are derivatives of the
   supplied originals, so the source hash is the PNG's, not a generator's. */
const products = JSON.parse(readFileSync('tools/imagegen/product-assets.json', 'utf8')).assets;
/* The owner's photographs (tools/imagegen/photo-assets.json; batch 3 of
   2026-10-21 and every batch after it): the same checks. They are
   AI-generated images, not documentary photographs and not product screens,
   so their alt must end with the caption the site's other generated imagery
   carries — （AI 概念图） on a Chinese page, " (AI concept illustration)" on
   an English one — and must not carry the demo-data caption. The one silent
   exception is a decorative backdrop: alt="" together with aria-hidden. */
const photos = JSON.parse(readFileSync('tools/imagegen/photo-assets.json', 'utf8')).assets;
/* The share card (batch-8 O01, 2026-10-21; tools/imagegen/prepare-share-card.mjs):
   a 1200x630 JPEG, because link previews do not all read WebP. The bytes on
   disk are the ones its record names, and the JPEG's own frame header says
   1200x630. */
const share = JSON.parse(readFileSync('tools/imagegen/share-card.json', 'utf8'));
{
  assert(/^assets\/stargo-photo\/[\w-]+-1200x630\.jpg$/.test(share.src) && existsSync(share.src), `share card: missing or misnamed file ${share.src}`);
  const jpeg = readFileSync(share.src);
  assert.equal(createHash('sha256').update(jpeg).digest('hex'), share.sha256, 'share card: the file is the one its record names');
  assert(!share.upscaled && share.width <= share.sourcePixels[0] && share.height <= share.sourcePixels[1], 'share card: never larger than the supplied original');
  let size = null;
  for (let i = 2; i < jpeg.length - 8 && jpeg[i] === 0xff;) {
    const marker = jpeg[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) { size = [jpeg.readUInt16BE(i + 7), jpeg.readUInt16BE(i + 5)]; break; }
    i += 2 + jpeg.readUInt16BE(i + 2);
  }
  assert(jpeg[0] === 0xff && jpeg[1] === 0xd8 && size?.[0] === 1200 && size?.[1] === 630, `share card: a 1200x630 JPEG, not ${size}`);
}
const files = [...readdirSync('.').filter(f => f.endsWith('.html')), ...readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f), ...readdirSync('blog').map(f => 'blog/' + f), ...readdirSync('en/blog').map(f => 'en/blog/' + f)];
const all = [...files, 'css/stargo-fusion.css'].map(f => readFileSync(f, 'utf8')).join('\n');
/* A stylesheet whose braces do not balance swallows every rule after the
   stray "{" (a merge once left one @media open and silently dropped about 46
   phone and tablet crop rules); no page-level check sees that, so count them. */
for (const f of readdirSync('css').filter(n => n.endsWith('.css')).map(n => `css/${n}`)) {
  const bare = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/g, '""');
  let depth = 0;
  for (const ch of bare) { if (ch === '{') depth++; else if (ch === '}') depth--; assert(depth >= 0, `${f}: a "}" closes a block that was never opened`); }
  assert(depth === 0, `${f}: ${depth} block(s) left open at the end of the file`);
}
assert.equal(manifest.assets.length, 43);
assert.equal(new Set(manifest.assets.map(a => a.originalSha256)).size, 43);
assert(products.length > 0, 'product imagery manifest is empty');
assert.equal(new Set(products.map(a => a.sourceSha256)).size, products.length, 'each product image comes from its own supplied original');
for (const a of products) {
  assert(/^assets\/stargo-product\//.test(a.src), `${a.id}: product images live in assets/stargo-product/`);
  assert(!a.upscaled && a.width <= a.sourcePixels[0], `${a.id}: never wider than the supplied original`);
  for (const f of [a, ...a.variants]) assert(existsSync(f.src), `missing file: ${f.src}`);
}
assert.equal(new Set(photos.map(a => a.sourceSha256)).size, photos.length, 'each photograph comes from its own supplied original');
for (const a of photos) {
  assert(!a.upscaled && a.width <= a.sourcePixels[0], `${a.id}: never wider than the supplied original`);
  /* /assets is cached immutable for a year: every file names its own width. */
  for (const f of [a, ...a.variants]) assert(new RegExp(`^assets/stargo-photo/${a.id}-${f.width}\\.webp$`).test(f.src) && existsSync(f.src), `${a.id}: missing or misnamed file ${f.src}`);
}
assert(!all.includes('assets/stargo/'), 'legacy imagery must not be referenced');
// Since the 2026-09-06 template restore the lifelogx pages and the homepage
// scenario/blog/contact areas use the templates' own imagery again, so not
// every generated image is placed. Placed ones must exist in every size.
const unused = [];
for (const a of manifest.assets) {
  if (!all.includes(a.src)) { unused.push(a.id); continue; }
  for (const f of [a, ...a.variants]) assert(existsSync(f.src), `missing file: ${f.src}`);
}
const productsUnused = products.filter(a => !all.includes(a.src)).map(a => a.id);
const photosUnused = photos.filter(a => !all.includes(a.src)).map(a => a.id);
assert.deepEqual(photosUnused, [], 'every registered photograph is placed');
console.log(`generated imagery: ${manifest.assets.length - unused.length} placed, ${unused.length} retained but unused (${unused.join(', ')})`);
console.log(`product imagery: ${products.length - productsUnused.length} of ${products.length} placed${productsUnused.length ? ` (unused: ${productsUnused.join(', ')})` : ''}`);
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const tag of html.matchAll(/<img\b[^>]*stargo-(?:editorial|product)[^>]*>/g)) {
    assert(/\balt="/.test(tag[0]) && /\bwidth="/.test(tag[0]) && /\bheight="/.test(tag[0]), `${f}: image metadata`);
  }
  /* A product screenshot is a demonstration interface: its alt says so in the
     page's language, so nothing reads as a real customer's screen. */
  for (const tag of html.matchAll(/<img\b[^>]*stargo-product[^>]*>/g)) {
    const alt = tag[0].match(/\balt="([^"]*)"/)?.[1] ?? '';
    /* Only the rotating gallery's tiles may be silent: they are 24 pictures in
       a decorative wheel, and the page says in words what they are. Every other
       product image must say it is a demonstration interface. */
    assert(alt ? /演示数据|demo data/.test(alt) : /ro-home-header-img/.test(tag[0]),
      `${f}: product image alt must say it is an illustrative interface with demo data — "${alt}"`);
  }
  /* The side menu's 预约企业演示 card sits inside its link, so its photograph
     must stay silent: an alt there would become part of the link's name. */
  for (const tag of html.matchAll(/<img\b[^>]*stargo-menu-photo[^>]*>/g)) {
    assert(/\balt=""/.test(tag[0]) && /\baria-hidden="true"/.test(tag[0]), `${f}: the side-menu card photo must be alt="" aria-hidden="true" — ${tag[0].slice(0, 120)}`);
  }
  const conceptCaption = f.startsWith('en/') ? ' (AI concept illustration)' : '（AI 概念图）';
  for (const tag of html.matchAll(/<img\b[^>]*stargo-photo[^>]*>/g)) {
    const alt = tag[0].match(/\balt="([^"]*)"/)?.[1];
    assert(alt !== undefined && /\bwidth="/.test(tag[0]) && /\bheight="/.test(tag[0]) && /\bsrcset="/.test(tag[0]) && /\bsizes="/.test(tag[0]), `${f}: photograph metadata`);
    if (alt === '') {
      assert(/\baria-hidden="true"/.test(tag[0]), `${f}: a photograph with an empty alt must be a decorative backdrop (aria-hidden="true") — ${tag[0].slice(0, 120)}`);
      continue;
    }
    assert(alt.endsWith(conceptCaption) && alt.indexOf(conceptCaption) === alt.length - conceptCaption.length && alt.length > conceptCaption.length + 8, `${f}: an owner photograph is AI-generated; its alt must describe the picture and end with "${conceptCaption}" once — "${alt}"`);
    assert(!/演示数据|demo data/i.test(alt), `${f}: a photograph is not a product interface; no demo-data caption — "${alt}"`);
  }
  /* Share cover: an article shares its own cover, every other page the share
     card, with the owner's sentence for it and the AI caption as
     og:image:alt. The file is on disk. */
  {
    const og = html.match(/<meta property="og:image" content="([^"]*)"\/>/)?.[1] ?? '';
    const article = /^(?:en\/)?blog\//.test(f);
    assert(article ? /^https:\/\/[^/]+\/assets\/blog\/[\w-]+\.webp$/.test(og) : og.endsWith(`/${share.src}`), `${f}: share cover ${og}`);
    assert(existsSync(og.replace(/^https:\/\/[^/]+\//, '')), `${f}: share cover not on disk: ${og}`);
    assert.equal(html.match(/<meta name="twitter:image" content="([^"]*)"\/>/)?.[1], og, `${f}: twitter:image is the share cover`);
    if (!article) {
      const alt = html.match(/<meta property="og:image:alt" content="([^"]*)"\/>/)?.[1] ?? '';
      /* The share card is one of the owner's AI-generated pictures, so its
         alt ends with the same caption as theirs, once, and is not demo data. */
      assert(alt && html.includes(`<meta name="twitter:image:alt" content="${alt}"/>`) && alt.endsWith(conceptCaption) && alt.indexOf(conceptCaption) === alt.length - conceptCaption.length && alt.length > conceptCaption.length + 8 && !/演示数据|demo data/i.test(alt), `${f}: the share card's alt must describe it and end with "${conceptCaption}" once — "${alt}"`);
    }
  }
  /* Runtime cache version: every local script and stylesheet the page loads
     carries its content hash (tools/chrome.mjs), so a deployment never serves a
     stale runtime. This used to be asserted through js/stargo-tabs.js alone, as
     if every page loaded it; since its rebuild about.html has no tab component
     and did not load it, and the check failed for the wrong reason. */
  for (const m of html.matchAll(/\s(?:src|href)="(?:\.\.\/)*((?:css|js)\/[^"]+)"/g)) {
    assert(/\?v=[0-9a-f]{12}$/.test(m[1]), `${f}: runtime cache version on ${m[1]}`);
  }
  /* js/stargo-tabs.js drives the tab components: Webflow tabs (.w-tabs), the
     pricing period toggle (.pricing-tabs-info-block), the homepage's core-systems
     switcher (.product-sticky-block) and the FAQ accordions' ARIA
     (.toggle-wrapper). A page that carries one of them must load it. */
  if (/class="[^"]*\b(?:w-tabs|pricing-tabs-info-block|product-sticky-block|toggle-wrapper)\b/.test(html)) {
    assert(/js\/stargo-tabs\.js\?v=[0-9a-f]{12}/.test(html), `${f}: has tab components but does not load js/stargo-tabs.js`);
  }
}
console.log(`owner photographs: ${photos.length} of ${photos.length} placed`);
console.log(`PASS static: 43 unique generated originals, ${products.length} product images and ${photos.length} photographs from their own originals; placed images carry alt/width/height; ${files.length} pages without legacy references`);
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const OUT = '.wrangler/editorial-qa';
mkdirSync(OUT, { recursive: true });
const names = ['index', 'intelligence', 'capabilities', 'workforce', 'pricing', 'enterprise', 'contact', 'about', 'blog', 'blog/start-with-one-workflow'];
const jobs = [];
for (const lang of ['', 'en/']) for (const width of (process.env.WIDTHS || '390,768,1440').split(',').map(Number)) for (const name of names) jobs.push({ lang, width, name });
const browser = await chromium.launch();
const reports = [];
async function worker() {
  while (jobs.length) {
    const { lang, width, name } = jobs.shift();
    const id = `${lang ? 'en' : 'zh'}-${name.replace('/', '-')}-${width}`;
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
    const errors = [], assets = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    /* The site's own pictures: the generated art and, since 2026-10-21, the
       owner's photographs, which are all the enterprise page's <img>s. */
    page.on('request', r => { if (/stargo-(?:editorial|photo)\//.test(r.url())) assets.push(r.url()); if (/assets\/stargo\//.test(r.url())) errors.push(`Old image requested: ${r.url()}`); });
    try {
      assert.equal((await page.goto(`${BASE}/${lang}${name}.html`, { waitUntil: 'load' })).status(), 200);
      // Each page here is a new browser session, so the homepage plays its
      // 5.1s opening (tools/blocks/og-intro.js) first. Capture the finished
      // hero, not a frame of the opening.
      await page.waitForTimeout(name === 'index' ? 5500 : 1100);
      const switcher = page.locator('.nav-menu a[hreflang]').first();
      const up = name.includes('/') ? '../' : '';
      assert.equal(await switcher.getAttribute('href'), lang ? `${up}../${name}.html` : `${up}en/${name}.html`);
      assert.equal(await switcher.getAttribute('aria-current'), null, 'language is not current page');
      const logo = page.locator('a.logo-first').first();
      assert.equal(await logo.getAttribute('href'), `${up}index.html`);
      await page.screenshot({ path: `${OUT}/${id}-hero.png` });
      if (width < 992) {
        const menu = page.locator('.menu-button');
        await menu.click();
        await page.waitForTimeout(650);
        assert.equal(await menu.getAttribute('aria-expanded'), 'true');
        assert(await switcher.isVisible(), 'mobile menu language link visible');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      }
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 650) {
        await page.evaluate(y => { if (typeof lenis !== 'undefined') lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); }, y);
        await page.waitForTimeout(45);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'horizontal overflow');
      }
      await page.waitForTimeout(400);
      /* The owner's photographs (assets/stargo-photo) have taken most of the
         generated art's places on some pages (the capability page and every
         picture of the enterprise page from 2026-10-21), so they are decoded
         and counted here too. */
      const OWN = 'img[src*="stargo-editorial"], img[src*="stargo-photo"]';
      const imageState = await page.evaluate((OWN) => [...document.querySelectorAll(OWN)].filter(i => i.getBoundingClientRect().width > 0 && i.complete).map(i => ({ src: i.currentSrc, natural: i.naturalWidth })), OWN);
      assert(imageState.every(i => i.natural > 0), 'decoded images');
      /* No owner photograph is drawn mirrored. Templates flip whole layers
         (cinery's inner ring is scaleX(-1)); a clip there does not mind, a
         picture of a place reads back to front. The sign of the 2D
         determinant of every transform (and scale) from the picture up to the
         root says whether it ends up mirrored. */
      const mirrored = await page.evaluate(() => [...document.querySelectorAll('img[src*="stargo-photo"]')].filter((img) => {
        let det = 1;
        for (let el = img; el; el = el.parentElement) {
          const cs = getComputedStyle(el);
          if (cs.transform && cs.transform !== 'none') { const m = new DOMMatrix(cs.transform); det *= m.a * m.d - m.b * m.c; }
          if (cs.scale && cs.scale !== 'none') { const [x, y = x] = cs.scale.split(' ').map(Number); det *= x * y; }
        }
        return det < 0;
      }).map((img) => img.getAttribute('src')));
      assert.deepEqual(mirrored, [], 'an owner photograph is drawn mirrored');
      const hasImageArea = await page.locator(OWN).evaluateAll(imgs => imgs.some(i => i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().height > 0));
      // Contact/pricing deliberately hide decorative media on small screens.
      // Keep that composition and verify those images are not downloaded.
      // Pages that use the templates' own imagery (lifelogx pages, blog) request none of the generated set.
      // About joined them when it was rebuilt from cinery's blocks (its pictures are cinery's clips and
      // photographs, like the pricing page's); only the shared menu carries generated art there.
      if (hasImageArea) assert(assets.length > 0, 'visible new images requested');
      else assert((width < 992 && ['contact', 'pricing'].includes(name)) || /intelligence|workforce|blog|pricing|about/.test(name), 'only approved template-imagery pages omit generated art');
      const card = await page.evaluate((OWN) => [...document.querySelectorAll(OWN)].find(i => {
        const r = i.getBoundingClientRect();
        return r.width > 180 && r.height > 150 && !i.closest('.menu-wrapper,nav,.navbar,.menu-bottom');
      })?.getBoundingClientRect().top + scrollY, OWN);
      if (Number.isFinite(card)) {
        await page.evaluate(y => { if (typeof lenis !== 'undefined') lenis.scrollTo(Math.max(0, y - 170), { immediate: true }); else scrollTo(0, Math.max(0, y - 170)); }, card);
        await page.waitForTimeout(1200);
      }
      await page.screenshot({ path: `${OUT}/${id}-art.png` });
      assert.deepEqual(errors, []);
      reports.push({ id, pass: true, decoded: imageState.length, imageRequests: new Set(assets).size });
      console.log(`PASS ${id}: images, overflow, navigation/language${width < 992 ? ', menu open/Escape' : ''}`);
    } catch (e) {
      reports.push({ id, pass: false, error: e.message });
      console.log(`FAIL ${id}: ${e.message}`);
      await page.screenshot({ path: `${OUT}/${id}-failure.png` });
    } finally { await page.close(); }
  }
}
await Promise.all([worker(), worker()]);
await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(reports, null, 2));
const failures = reports.filter(r => !r.pass);
console.log(`${reports.length - failures.length}/${reports.length} responsive page scenarios passed`);
process.exitCode = failures.length ? 1 : 0;

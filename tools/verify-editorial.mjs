/** Static asset coverage + real-browser responsive/image/navigation regression. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
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
const files = [...readdirSync('.').filter(f => f.endsWith('.html')), ...readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f), ...readdirSync('blog').map(f => 'blog/' + f), ...readdirSync('en/blog').map(f => 'en/blog/' + f)];
const all = [...files, 'css/stargo-fusion.css'].map(f => readFileSync(f, 'utf8')).join('\n');
assert.equal(manifest.assets.length, 43);
assert.equal(new Set(manifest.assets.map(a => a.originalSha256)).size, 43);
assert(products.length > 0, 'product imagery manifest is empty');
assert.equal(new Set(products.map(a => a.sourceSha256)).size, products.length, 'each product image comes from its own supplied original');
for (const a of products) {
  assert(/^assets\/stargo-product\//.test(a.src), `${a.id}: product images live in assets/stargo-product/`);
  assert(!a.upscaled && a.width <= a.sourcePixels[0], `${a.id}: never wider than the supplied original`);
  for (const f of [a, ...a.variants]) assert(existsSync(f.src), `missing file: ${f.src}`);
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
  assert(/og:image[^>]*(stargo-editorial\/og-cover\.png|assets\/blog\/[\w-]+\.webp)/.test(html), `${f}: share cover`);   // articles share their cover
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
console.log(`PASS static: 43 unique generated originals, ${products.length} product images from their own originals; placed images carry alt/width/height; ${files.length} pages without legacy references`);
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
    page.on('request', r => { if (/stargo-editorial/.test(r.url())) assets.push(r.url()); if (/assets\/stargo\//.test(r.url())) errors.push(`Old image requested: ${r.url()}`); });
    try {
      assert.equal((await page.goto(`${BASE}/${lang}${name}.html`, { waitUntil: 'load' })).status(), 200);
      // Mono's retained introductory curtain lasts several seconds. Capture
      // the finished hero, not a transient blank animation frame.
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
      const imageState = await page.evaluate(() => [...document.querySelectorAll('img[src*="stargo-editorial"]')].filter(i => i.getBoundingClientRect().width > 0 && i.complete).map(i => ({ src: i.currentSrc, natural: i.naturalWidth })));
      assert(imageState.every(i => i.natural > 0), 'decoded images');
      const hasImageArea = await page.locator('img[src*="stargo-editorial"]').evaluateAll(imgs => imgs.some(i => i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().height > 0));
      // Contact/pricing deliberately hide decorative media on small screens.
      // Keep that composition and verify those images are not downloaded.
      // Pages that use the templates' own imagery (lifelogx pages, blog) request none of the generated set.
      // About joined them when it was rebuilt from cinery's blocks (its pictures are cinery's clips and
      // photographs, like the pricing page's); only the shared menu carries generated art there.
      if (hasImageArea) assert(assets.length > 0, 'visible new images requested');
      else assert((width < 992 && ['contact', 'pricing'].includes(name)) || /intelligence|workforce|blog|pricing|about/.test(name), 'only approved template-imagery pages omit generated art');
      const card = await page.evaluate(() => [...document.querySelectorAll('img[src*="stargo-editorial"]')].find(i => {
        const r = i.getBoundingClientRect();
        return r.width > 180 && r.height > 150 && !i.closest('.menu-wrapper,nav,.navbar,.menu-bottom');
      })?.getBoundingClientRect().top + scrollY);
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

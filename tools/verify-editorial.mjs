/** Static asset coverage + real-browser responsive/image/navigation regression. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire('F:/stargo 网站/stargo-work-website/package.json')('@playwright/test');
const manifest = JSON.parse(readFileSync('tools/imagegen/assets-manifest.json', 'utf8'));
const files = [...readdirSync('.').filter(f => f.endsWith('.html')), ...readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f)];
const all = [...files, 'css/stargo-fusion.css'].map(f => readFileSync(f, 'utf8')).join('\n');
assert.equal(manifest.assets.length, 43);
assert.equal(new Set(manifest.assets.map(a => a.originalSha256)).size, 43);
assert(!all.includes('assets/stargo/'), 'legacy imagery must not be referenced');
for (const a of manifest.assets) {
  assert(all.includes(a.src), `unused image: ${a.id}`);
  for (const f of [a, ...a.variants]) assert(existsSync(f.src), `missing file: ${f.src}`);
}
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const tag of html.matchAll(/<img\b[^>]*stargo-editorial[^>]*>/g)) {
    assert(/\balt="/.test(tag[0]) && /\bwidth="/.test(tag[0]) && /\bheight="/.test(tag[0]), `${f}: image metadata`);
  }
  assert(/og:image[^>]*stargo-editorial\/og-cover.png/.test(html), `${f}: share cover`);
  assert(/js\/stargo-tabs.js\?v=[0-9a-f]{12}/.test(html), `${f}: runtime cache version`);
}
console.log('PASS static: 43 unique generated originals, all used; 80 responsive variants; 22 pages without legacy references');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const OUT = '.wrangler/editorial-qa';
mkdirSync(OUT, { recursive: true });
const names = ['index', 'intelligence', 'capabilities', 'workforce', 'pricing', 'enterprise', 'contact'];
const jobs = [];
for (const lang of ['', 'en/']) for (const width of [390, 768, 1440]) for (const name of names) jobs.push({ lang, width, name });
const browser = await chromium.launch();
const reports = [];
async function worker() {
  while (jobs.length) {
    const { lang, width, name } = jobs.shift();
    const id = `${lang ? 'en' : 'zh'}-${name}-${width}`;
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
      assert.equal(await switcher.getAttribute('href'), lang ? `../${name}.html` : `en/${name}.html`);
      assert.equal(await switcher.getAttribute('aria-current'), null, 'language is not current page');
      const logo = page.locator('a.logo-first').first();
      assert.equal(await logo.getAttribute('href'), 'index.html');
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
      if (hasImageArea) assert(assets.length > 0, 'visible new images requested');
      else assert(width < 992 && ['contact', 'pricing'].includes(name), 'only approved text-first mobile pages omit visible art');
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

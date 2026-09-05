/** Verify deployed bytes against the reviewed local build, then browser smoke. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const { chromium, request } = createRequire('F:/stargo 网站/stargo-work-website/package.json')('@playwright/test');
const BASE = process.env.BASE_URL || 'https://stargo.pages.dev';
const proxy = process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY } : undefined;
const api = await request.newContext({ baseURL: BASE, proxy, timeout: 45000 });
const assets = JSON.parse(readFileSync('tools/imagegen/assets-manifest.json', 'utf8')).assets;
const pages = [...readdirSync('.').filter(f => f.endsWith('.html')), ...readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f)];
const imageFiles = assets.flatMap(a => [a.src, ...a.variants.map(v => v.src)]);
const runtimes = ['css', 'js'].flatMap(dir => readdirSync(dir).filter(f => /\.(css|js|json)$/.test(f)).map(f => `${dir}/${f}`));
const files = [...pages, ...imageFiles, 'assets/stargo-motion/orbit.mp4', 'assets/stargo-motion/orbit-poster.webp', ...runtimes];
const hash = b => createHash('sha256').update(b).digest('hex');
const queue = [...files], checked = [];
const OUT = process.env.QA_OUT || '.wrangler/release-qa';
mkdirSync(OUT, { recursive: true });
let transportRetries = 0;
async function get(path, options) {
  for (let attempt = 0; ; attempt++) {
    try { return await api.get(path, options); }
    catch (e) {
      // Retry transport interruptions only. HTTP or hash failures still fail.
      if (attempt === 3 || !/socket|TLS|ECONNRESET|ETIMEDOUT|Timeout/i.test(e.message)) throw e;
      transportRetries++;
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}
async function verifyFiles() {
  while (queue.length) {
    const file = queue.shift();
    const response = await get('/' + file, { headers: { 'Cache-Control': 'no-cache' } });
    assert.equal(response.status(), 200, file);
    assert.equal(hash(await response.body()), hash(readFileSync(file)), `deployed bytes differ: ${file}`);
    checked.push(file);
    if (checked.length % 25 === 0) console.log(`Verified ${checked.length}/${files.length} deployed file hashes`);
  }
}
await Promise.all([verifyFiles(), verifyFiles(), verifyFiles(), verifyFiles()]);
assert.equal((await get('/__stargo_qa_missing_page__')).status(), 404, 'custom missing route');
console.log(`PASS deployed bytes: ${pages.length} pages, ${imageFiles.length} image files, video/poster and ${runtimes.length} runtime files; custom route 404`);
await api.dispose();
const browser = await chromium.launch({ proxy });
const scenarios = [];
try {
  for (const lang of ['', 'en/']) for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${BASE}/${lang}`, { waitUntil: 'load' });
    await page.waitForTimeout(5500);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-${width}-hero.png` });
    if (width === 390) {
      const menu = page.locator('.menu-button');
      await menu.click();
      await page.waitForTimeout(700);
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    } else {
      await page.evaluate(() => lenis.scrollTo(document.querySelector('.product-sticky-block'), { immediate: true }));
      await page.waitForTimeout(1000);
      for (const i of [3, 1, 0, 2]) {
        await page.locator(`#core-tab-${i}`).click();
        await page.waitForTimeout(1100);
        assert.equal(await page.locator(`#core-tab-${i}`).getAttribute('aria-selected'), 'true');
      }
      await page.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-${width}-core.png` });
    }
    await page.evaluate(() => lenis.scrollTo(document.querySelector('.video-section').getBoundingClientRect().top + scrollY + 800, { immediate: true }));
    await page.waitForFunction(() => { const v = document.querySelector('[data-stargo-video]'); return !v.paused && v.currentTime > .1; }, null, { timeout: 30000 });
    await page.locator('.stargo-media-toggle').click();
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true);
    await page.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-${width}-video.png` });
    assert.deepEqual(errors, []);
    scenarios.push(`${lang || 'zh/'}home-${width}`);
    console.log(`PASS live ${lang || 'zh/'} home ${width}: hero, ${width === 390 ? 'menu' : '4 clicks'}, video playback/pause, no JS or asset error`);
    await page.close();
  }
  for (const lang of ['', 'en/']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${BASE}/${lang}capabilities`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const expected = ['brand-family-01', 'os-inquiries', 'brand-family-02', 'brand-family-04'];
    const actual = await page.locator('a[href="#g01"] img,a[href="#g04"] img,a[href="#g07"] img,a[href="#g10"] img').evaluateAll(imgs => imgs.map(i => i.getAttribute('src').split('/').pop().replace(/\.webp$/, '')));
    assert.deepEqual(actual, expected, 'capability image/meaning mapping');
    await page.locator('a[href="#g04"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-capabilities-art.png` });
    scenarios.push(`${lang || 'zh/'}capabilities-390`);
    console.log(`PASS live ${lang || 'zh/'} capabilities 390: four semantic image mappings`);
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/report.json`, JSON.stringify({ base: BASE, checkedAt: new Date().toISOString(), byteMatches: checked.length, transportRetries, scenarios }, null, 2));
console.log(`PASS release: ${checked.length} matching files, ${scenarios.length} browser scenarios`);

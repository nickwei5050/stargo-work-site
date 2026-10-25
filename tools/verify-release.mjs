/** Verify deployed bytes against the reviewed local build, then browser smoke. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from './paths.mjs';
const { chromium, request } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = process.env.BASE_URL || 'https://stargo.pages.dev';
const proxy = process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY } : undefined;
const NAV = +(process.env.NAV_TIMEOUT || 30000);   // browser navigation budget; raise it for a run through a slow proxy
const api = await request.newContext({ baseURL: BASE, proxy, timeout: Math.max(45000, NAV) });
const assets = JSON.parse(readFileSync('tools/imagegen/assets-manifest.json', 'utf8')).assets;
const pages = [...readdirSync('.').filter(f => f.endsWith('.html')), ...readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f), ...readdirSync('blog').map(f => 'blog/' + f), ...readdirSync('en/blog').map(f => 'en/blog/' + f)];
const html = pages.map(f => readFileSync(f, 'utf8')).join('\n');
// Every image a page references: the generated set that is still placed, the blog covers and the restored template assets.
const referenced = new Set([...html.matchAll(/(?:src|srcset|data-poster-url|data-video-urls)="([^"]*)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+/)[0]).filter(s => /^(\.\.\/)*assets\//.test(s)).map(s => decodeURIComponent(s.split('?')[0].replace(/^(\.\.\/)+/, '')))));
const imageFiles = [...referenced].filter(f => /\.(webp|png|jpg|jpeg|avif|svg|gif)$/i.test(f) && existsSync(f));
for (const a of assets) if (html.includes(a.src)) for (const v of a.variants) if (!referenced.has(v.src)) imageFiles.push(v.src);
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
    // Request the path the way a browser does: percent-encode the local file name (a Webflow
    // responsive variant is stored with a literal "%20" and referenced double-encoded).
    const response = await get('/' + encodeURI(file), { headers: { 'Cache-Control': 'no-cache' } });
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
    await page.goto(`${BASE}/${lang}`, { waitUntil: 'load', timeout: NAV });
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
    await page.goto(`${BASE}/${lang}capabilities`, { waitUntil: 'load', timeout: NAV });
    await page.waitForTimeout(1500);
    // Since 2026-10-23 each of the four area cards showed its own area drawn in
    // code (tools/code-art-capareas.mjs, js/stargo-motion-areas.js), where the
    // owner's photographs C01-C04 were (2026-10-21) and the generated art
    // before them. The owner, 2026-10-24 17:27 UTC: 「你现在也全是代码了，我系统的画面都没有了！
    // 我需要真实系统截图放在特定的地方」: since then each card shows a screen of its own area
    // (tools/replaceables.mjs CAP_REAL.areas: Growth OS home, the Sales Desk customer list, the ERP
    // items, the experts library), the upright crop on this portrait phone. Compared by screen, in
    // card order: every card's picture has decoded the upright crop and carries the 真实界面 tag,
    // and no card hosts a drawn scene any more.
    const expected = ['live05-growth-home-2x1', 'live11-capabilities-customers', 'live23-capabilities-items', 'sw004-capabilities-library'];
    const upright = ['live05-growth-home-start-5x4', 'm05-capabilities-customers-up', 'live23-capabilities-items-up', 'sw004-capabilities-library-up'];
    // The four area cards only: the V6 showcases link to groups too.
    const cards = '.wrok-wrapper a[href="#g01"],.wrok-wrapper a[href="#g04"],.wrok-wrapper a[href="#g07"],.wrok-wrapper a[href="#g10"]';
    const actual = await page.locator(cards.split(',').map(a => `${a} [data-real]`).join(','))
      .evaluateAll(slots => slots.map(s => s.getAttribute('data-real')));
    assert.deepEqual(actual, expected, 'capability screen/meaning mapping');
    assert.equal(await page.locator(cards.split(',').map(a => `${a} [data-sg-scene]`).join(',')).count(), 0, 'the area cards host no drawn scene');
    for (const [i, id] of expected.entries()) {
      const slot = page.locator(`.wrok-wrapper [data-real="${id}"]`);
      await slot.scrollIntoViewIfNeeded();
      await slot.locator('img').evaluate(img => img.decode().catch(() => {}));
      const shot = await slot.evaluate(s => { const img = s.querySelector('img'); return { w: img.naturalWidth, src: img.currentSrc, tag: s.querySelector('.sg-real-tag')?.textContent.trim() }; });
      assert(shot.w > 0, `${id}: the screen decodes`);
      assert(shot.src.includes(`/${upright[i]}`), `${id}: the portrait phone loads the upright crop (${shot.src})`);
      assert(/真实界面|Real screen/.test(shot.tag || ''), `${id}: the real-screen tag is shown`);
    }
    await page.locator('.wrok-wrapper a[href="#g04"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-capabilities-art.png` });
    scenarios.push(`${lang || 'zh/'}capabilities-390`);
    console.log(`PASS live ${lang || 'zh/'} capabilities 390: four area screens in card order, upright crops decoded and tagged`);
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/report.json`, JSON.stringify({ base: BASE, checkedAt: new Date().toISOString(), byteMatches: checked.length, transportRetries, scenarios }, null, 2));
console.log(`PASS release: ${checked.length} matching files, ${scenarios.length} browser scenarios`);

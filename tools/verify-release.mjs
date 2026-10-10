/**
 * Release check: the site at BASE_URL against the reviewed local build in dist/.
 *
 *   npm run build && npm run dist
 *   BASE_URL=https://stargo.pages.dev node tools/verify-release.mjs          # the deployed site
 *   node tools/serve.mjs --root dist --port 4390 &                           # or a local dry run
 *   BASE_URL=http://127.0.0.1:4390 node tools/verify-release.mjs
 *
 * 1. dist/ is the current build: it holds exactly the pages the build makes
 *    (tools/chrome.mjs ALL_PAGES, both languages; the retired notices page is
 *    not among them), each byte-identical to the built page in the repository
 *    once the few files make-dist ships under neutral names are renamed in it
 *    (tools/dist-names.mjs; no shipped file name carries a template's name),
 *    every assets/, css/ and js/ file a page names, the twelve demo-video files
 *    (per language: desktop and phone cut, MP4 + WebM + still); every asset
 *    URL in a page or stylesheet carries the ?v= cache key of the file it
 *    names (tools/asset-version.mjs: /assets/* is immutable for a year); and
 *    a dist/_redirects that sends each retired address (tools/dist-names.mjs
 *    RETIRED_PAGES: the notices page, the old address of the AI Staff
 *    article), with and without .html, to its replacement's clean URL — a
 *    URL the sitemap lists — and nothing else.
 * 2. Bytes: every file dist/ ships (pages, assets, styles, scripts, robots.txt,
 *    sitemap.xml, llms.txt — not _headers and _redirects, which configure
 *    Cloudflare Pages and are not served) is fetched from BASE_URL and must
 *    match by SHA-256. dist/ rather than the repository is the reference
 *    because tools/make-dist.mjs edits some shipped styles and scripts.
 * 3. Routes: clean URLs answer with the page; a missing page answers 404;
 *    every _redirects line answers 301 with exactly its target (tools/serve.mjs
 *    reads dist/_redirects as Pages does, so this holds locally too); the demo film
 *    answers a byte range with 206 and is served as video. On a deployed site
 *    the _headers rules must be in force (immutable /assets/*, nosniff).
 * 4. Browser, zh and en at 390 and 1440: the homepage (no sideways scroll, no
 *    script error, no failed request; the showcase tabs at 1440, the menu at
 *    390; no link to the notices page) and the product page; on both every
 *    product picture on the page loads and its alt text says it is demo data,
 *    and the demo video fetches nothing until it is on screen, then plays (the
 *    phone cut at 390, the desktop film at 1440), and its button pauses it.
 *
 * NAV_TIMEOUT raises the navigation budget, BROWSER_PROXY routes the browser
 * and the requests through a proxy, QA_OUT moves the screenshots and report.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from './paths.mjs';
import { ALL_PAGES } from './chrome.mjs';
import { distText, DIST_NAMES, TEMPLATE_NAMES, RETIRED_PAGES } from './dist-names.mjs';
import { unversionedAssets } from './asset-version.mjs';
const { chromium, request } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = (process.env.BASE_URL || 'https://stargo.pages.dev').replace(/\/+$/, '');
const LOCAL = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(BASE);
const proxy = process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY } : undefined;
const NAV = +(process.env.NAV_TIMEOUT || 30000);   // browser navigation budget; raise it for a run through a slow proxy
const OUT = process.env.QA_OUT || '.wrangler/release-qa';
mkdirSync(OUT, { recursive: true });
const hash = (b) => createHash('sha256').update(b).digest('hex');
const walk = (dir, rel = '') => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`, `${rel}${e.name}/`) : [`${rel}${e.name}`]));

/* ---- 1. dist/ is the build -------------------------------------------- */
if (!existsSync('dist/index.html')) throw new Error('no dist/ — run npm run build && npm run dist first');
const shipped = walk('dist').sort();
const pages = [...ALL_PAGES].flatMap((p) => [p, `en/${p}`]).sort();
assert.deepEqual(shipped.filter((f) => f.endsWith('.html')), pages, 'dist/ holds exactly the built pages');
/* tools/make-dist.mjs ships a few files under neutral names (tools/dist-names.mjs) and rewrites the pages' references to match */
for (const p of pages) assert.equal(hash(readFileSync(`dist/${p}`)), hash(distText(readFileSync(p, 'utf8'))), `dist/${p} is not the current build (run npm run dist)`);
assert(!shipped.some((f) => /notices/i.test(f)), 'the notices page does not ship');
assert.deepEqual(shipped.filter((f) => TEMPLATE_NAMES.test(f)), [], 'no file ships under a template\'s or vendor\'s name');
for (const [, to] of DIST_NAMES) assert(shipped.some((f) => f.includes(to)), `dist/ lacks ${to}`);
const DEMO = ['zh', 'en'].flatMap((l) => ['', '-phone'].flatMap((c) => [`assets/stargo-product/ow-demo-${l}${c}.mp4`, `assets/stargo-product/ow-demo-${l}${c}.webm`, `assets/stargo-product/ow-demo-${l}${c}-poster.webp`]));
for (const f of DEMO) assert(shipped.includes(f), `dist/ lacks the demo-video file ${f}`);
{
  const files = new Set(shipped);
  const missing = new Set();
  for (const p of pages) {
    const html = readFileSync(`dist/${p}`, 'utf8');
    if (/href="[^"]*notices(?:\.html)?["#?]/.test(html)) throw new Error(`${p} still links to the notices page`);
    for (const m of html.matchAll(/\s(?:src|href|poster|srcset|data-src)="([^"]+)"/g)) {
      for (const part of m[1].split(',')) {
        const url = part.trim().split(/\s+/)[0];
        const ref = /^(?:\.\.\/)*((?:assets|css|js)\/[^?#]+)/.exec(url) ?? /^\/((?:assets|css|js)\/[^?#]+)/.exec(url);
        if (!ref) continue;
        let f = ref[1];
        try { f = decodeURIComponent(f); } catch { /* keep it as written */ }
        if (!files.has(f)) missing.add(`${p} → ${f}`);
      }
    }
  }
  assert.deepEqual([...missing], [], 'every file a page names ships');
  /* every asset URL in a page or a stylesheet carries the key of the file that ships */
  const unversioned = [];
  for (const f of shipped.filter((x) => /\.(?:html|css)$/.test(x))) for (const ref of unversionedAssets(readFileSync(`dist/${f}`, 'utf8'), `${SITE}/dist`)) unversioned.push(`${f} → ${ref}`);
  assert.deepEqual(unversioned.slice(0, 20), [], `${unversioned.length} asset URLs without the current ?v= key of their file (/assets/* is immutable for a year)`);
}
/* _redirects: each retired address, both languages, with and without .html, to its replacement's clean URL — one the sitemap lists */
const sitemap = new Set([...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const redirects = readFileSync('dist/_redirects', 'utf8').split('\n').filter((l) => l.trim()).map((l) => l.trim().split(/\s+/));
{
  const want = RETIRED_PAGES.flatMap(([from, to]) => ['', 'en/'].flatMap((L) => {
    const target = `/${L}${to.replace(/\.html$/, '')}`;
    return [[`/${L}${from}`, target, '301'], [`/${L}${from.replace(/\.html$/, '')}`, target, '301']];
  }));
  assert.deepEqual(redirects.map((r) => r.join(' ')).sort(), want.map((r) => r.join(' ')).sort(), 'dist/_redirects holds exactly the retired addresses (tools/dist-names.mjs RETIRED_PAGES)');
  for (const [from, to] of redirects) {
    assert(sitemap.has(to), `_redirects: ${from} → ${to}, which the sitemap does not list (a second hop: Pages answers /x.html with a 308 to /x)`);
    assert(!shipped.includes(from.replace(/^\//, '')) && !shipped.includes(`${from.replace(/^\//, '')}.html`), `_redirects: ${from} is still a page in dist/`);
  }
}
console.log(`PASS dist: ${pages.length} pages identical to the build, ${shipped.length} files, the twelve demo-video files, every asset URL versioned, no notices page, ${redirects.length} redirects to sitemap URLs`);

/* ---- 2. bytes ---------------------------------------------------------- */
const api = await request.newContext({ baseURL: BASE, proxy, timeout: Math.max(45000, NAV) });
let transportRetries = 0;
async function get(path, options) {
  for (let attempt = 0; ; attempt++) {
    try { return await api.get(path, options); }
    catch (e) {
      // Retry transport interruptions only. HTTP or hash failures still fail.
      if (attempt === 3 || !/socket|TLS|ECONNRESET|ETIMEDOUT|Timeout/i.test(e.message)) throw e;
      transportRetries++;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}
const served = shipped.filter((f) => !/^_(?:headers|redirects)$/.test(f));
const queue = [...served];
const checked = [];
async function verifyFiles() {
  while (queue.length) {
    const file = queue.shift();
    // Request the path the way a browser does: percent-encode the local file name (a Webflow
    // responsive variant is stored with a literal "%20" and referenced double-encoded).
    const response = await get('/' + encodeURI(file), { headers: { 'Cache-Control': 'no-cache' } });
    /* Cloudflare Pages may answer its own 404 page with a 404 */
    assert(response.status() === 200 || (file.endsWith('404.html') && response.status() === 404), `${file}: HTTP ${response.status()}`);
    assert.equal(hash(await response.body()), hash(readFileSync(`dist/${file}`)), `deployed bytes differ: ${file}`);
    checked.push(file);
    if (checked.length % 50 === 0) console.log(`Verified ${checked.length}/${served.length} deployed file hashes`);
  }
}
await Promise.all([verifyFiles(), verifyFiles(), verifyFiles(), verifyFiles()]);
console.log(`PASS deployed bytes: all ${checked.length} served files of dist/ match (${pages.length} pages, ${served.filter((f) => f.startsWith('assets/')).length} assets incl. the demo videos)`);

/* ---- 3. routes and headers --------------------------------------------- */
for (const [path, file] of [['/pricing', 'pricing.html'], ['/en/pricing', 'en/pricing.html'], ['/capabilities', 'capabilities.html'], ['/en/', 'en/index.html'], ['/', 'index.html']]) {
  const r = await get(path);
  assert.equal(r.status(), 200, path);
  assert.equal(hash(await r.body()), hash(readFileSync(`dist/${file}`)), `${path} is not ${file}`);
}
assert.equal((await get('/__stargo_qa_missing_page__')).status(), 404, 'a missing page answers 404');
for (const [from, to] of redirects) {
  const r = await get(from, { maxRedirects: 0 });
  assert.equal(r.status(), 301, `${from}: HTTP ${r.status()}, not the 301 of dist/_redirects`);
  assert.equal(new URL(r.headers().location, BASE).pathname, to, `${from} → ${r.headers().location}, not ${to}`);
  const end = await get(to, { maxRedirects: 0 });
  assert.equal(end.status(), 200, `${to}: HTTP ${end.status()} (one hop, no second redirect)`);
}
for (const f of DEMO) {
  const full = await get('/' + f, { maxRedirects: 0 });
  assert.equal(full.headers()['content-type']?.split(';')[0], { mp4: 'video/mp4', webm: 'video/webm', webp: 'image/webp' }[f.split('.').pop()], `${f}: content type`);
  if (!LOCAL) {
    assert.match(full.headers()['cache-control'] ?? '', /max-age=31536000/, `${f}: long cache (_headers /assets/*)`);
    assert.match(full.headers()['x-content-type-options'] ?? '', /nosniff/, `${f}: nosniff`);
  }
  if (f.endsWith('.webp')) continue;
  const part = await get('/' + f, { headers: { Range: 'bytes=0-1023' }, maxRedirects: 0 });
  assert.equal(part.status(), 206, `${f}: a byte range (Safari and iOS play video only with ranges)`);
  assert.equal((await part.body()).length, 1024, `${f}: range length`);
}
console.log(`PASS routes: clean URLs, 404, ${redirects.length} retired addresses 301 → their page in one hop, demo films served as video with byte ranges${LOCAL ? '' : ', _headers in force'}`);
await api.dispose();

/* ---- 4. browser -------------------------------------------------------- */
const browser = await chromium.launch({ proxy });
const scenarios = [];
const toY = (page, y) => page.evaluate((y) => { if (typeof lenis !== 'undefined') lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); }, y);
/** Scroll the whole page so every lazy picture is asked for, then require each one that is shown to have loaded. */
async function productPictures(page, lang) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.round(innerHeight * 0.8));
  for (let y = 0; y < height; y += step) { await toY(page, y); await page.waitForTimeout(120); }
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].filter((i) => i.getBoundingClientRect().width > 0).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
  const shots = await page.$$eval('main img', (imgs) => imgs.filter((i) => /stargo-product\//.test(i.currentSrc || i.src)).map((i) => ({ src: (i.currentSrc || i.src).split('/').pop(), alt: i.alt })));
  assert(shots.length >= 1, 'the page shows product pictures');
  const bad = shots.filter((s) => !(lang ? /demo data/i : /演示数据/).test(s.alt));
  assert.deepEqual(bad, [], 'every product picture says demo data in its alt text');
  return shots.length;
}
/** The demo video: nothing fetched before it is on screen; then it plays (the phone cut on a phone); its button pauses it. */
async function demoVideo(page, film, shot, phone) {
  assert.equal(await page.locator('video[data-ow-demo]').count(), 1, 'one demo video');
  assert.deepEqual(film, [], 'the film is not fetched before it is on screen');
  const y = await page.evaluate(() => { const r = document.querySelector('video[data-ow-demo]').getBoundingClientRect(); return Math.max(0, r.top + scrollY + r.height / 2 - innerHeight / 2); });
  await toY(page, y);
  await page.waitForFunction(() => { const v = document.querySelector('video[data-ow-demo]'); return !v.paused && v.currentTime > 0.3; }, null, { timeout: 30000 });
  const src = await page.locator('video[data-ow-demo]').evaluate((v) => v.currentSrc.split('/').pop());
  assert.equal(/-phone\.(?:mp4|webm)\?/.test(src), phone, `the ${phone ? 'phone' : 'desktop'} cut plays (${src})`);
  await page.locator('[data-ow-demo-toggle]').click();
  assert.equal(await page.locator('video[data-ow-demo]').evaluate((v) => v.paused), true, 'its button pauses it');
  await page.screenshot({ path: shot });
  return src;
}
function watch(page) {
  const errors = [];
  const film = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  /* a media element drops the requests it no longer needs (a paused film): not a failure */
  page.on('requestfailed', (r) => { if (!/\.(?:mp4|webm)(?:\?|$)/.test(r.url())) errors.push(`failed ${r.url()}`); });
  page.on('request', (r) => { if (/ow-demo-[a-z]+(?:-phone)?\.(?:mp4|webm)/.test(r.url())) film.push(r.url()); });
  return { errors, film };
}
try {
  for (const lang of ['', 'en/']) for (const width of [390, 1440]) {
    const L = lang ? 'en' : 'zh';
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const { errors, film } = watch(page);
    await page.goto(`${BASE}/${lang}`, { waitUntil: 'load', timeout: NAV });
    await page.waitForTimeout(3000);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no sideways scroll');
    assert.equal(await page.locator('a[href*="notices"]').count(), 0, 'no link to the notices page');
    await page.screenshot({ path: `${OUT}/${L}-${width}-hero.png` });
    const src = await demoVideo(page, film, `${OUT}/${L}-${width}-video.png`, width <= 640);
    await toY(page, 0);
    await page.waitForTimeout(400);
    if (width === 390) {
      const menu = page.locator('.menu-button');
      await menu.click();
      await page.waitForTimeout(700);
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    } else {
      const tabs = page.locator('[data-ow-tabs] [role="tab"]');
      assert.equal(await tabs.count(), 4, 'four showcase tabs');
      await tabs.first().scrollIntoViewIfNeeded();
      for (const i of [3, 0, 2, 1]) {
        await tabs.nth(i).click();
        assert.equal(await tabs.nth(i).getAttribute('aria-selected'), 'true');
        assert(await page.locator(`#${await tabs.nth(i).getAttribute('aria-controls')}`).isVisible(), 'its panel shows');
      }
    }
    await toY(page, 0);
    const n = await productPictures(page, lang);
    assert.deepEqual(errors, []);
    scenarios.push(`${L}/home-${width}`);
    console.log(`PASS ${L} home ${width}: hero, ${width === 390 ? 'menu' : '4 showcase tabs'}, demo video (${src}) plays on screen and pauses, ${n} product pictures loaded with demo-data alt, no error`);
    await page.close();
  }
  for (const lang of ['', 'en/']) for (const width of [390, 1440]) {
    const L = lang ? 'en' : 'zh';
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const { errors, film } = watch(page);
    await page.goto(`${BASE}/${lang}capabilities`, { waitUntil: 'load', timeout: NAV });
    await page.waitForTimeout(1500);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no sideways scroll');
    const src = await demoVideo(page, film, `${OUT}/${L}-capabilities-${width}-video.png`, width <= 640);
    await toY(page, 0);
    const n = await productPictures(page, lang);
    assert.deepEqual(errors, []);
    scenarios.push(`${L}/capabilities-${width}`);
    console.log(`PASS ${L} capabilities ${width}: demo video (${src}), ${n} product pictures loaded with demo-data alt, no error`);
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/report.json`, JSON.stringify({ base: BASE, local: LOCAL, checkedAt: new Date().toISOString(), byteMatches: checked.length, transportRetries, scenarios }, null, 2));
console.log(`PASS release: ${checked.length} matching files, ${scenarios.length} browser scenarios`);

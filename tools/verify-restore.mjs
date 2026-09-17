/**
 * Template-restore verification (2026-09-06). Real browser, every page, every
 * representative width, both languages; the scroll-driven sections in their
 * entering, middle, leaving and reverse states; text that is clipped, covered
 * or invisible; console errors, failed and off-origin requests; navigation,
 * language switch, menu; the new About/Blog/article pages and their SEO head;
 * and side-by-side captures against the two original templates.
 *
 *   node tools/verify-restore.mjs                      # site at BASE_URL (default http://127.0.0.1:4200)
 *   ORIG_LX=http://127.0.0.1:4210 ORIG_MONO=http://127.0.0.1:4211 …   # add original-vs-ours contact sheets
 *   ENGINE=webkit … / ENGINE=chromium …                # browser engine (default chromium)
 *   WIDTHS=320,390,768,1024,1280,1440,1920 …
 *
 * Exits non-zero on any failure. Screenshots and report: .wrangler/restore-qa/<engine>/.
 */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { SITE_PAGES } from './chrome.mjs';
import { POSTS, postPath } from './blog.mjs';
import { ABOUT } from './copy.mjs';

import { SITE, req } from './paths.mjs';
const pw = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const ENGINE = process.env.ENGINE || 'chromium';
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const ORIG_LX = process.env.ORIG_LX || '';
const ORIG_MONO = process.env.ORIG_MONO || '';
const WIDTHS = (process.env.WIDTHS || '320,390,768,1024,1280,1440,1920').split(',').map(Number);
const OUT = `${process.env.QA_OUT || '.wrangler/restore-qa'}/${ENGINE}`;
mkdirSync(OUT, { recursive: true });
const proxy = process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
const browser = await pw[ENGINE].launch({ proxy });
const results = [];
// Navigation budget. 30s is generous on the local server; a production run through a
// slow proxy sets NAV_TIMEOUT (ms) so a stalled fetch is reported as such, not as a defect.
const NAV = +(process.env.NAV_TIMEOUT || 30000);
const heightFor = (w) => (w <= 480 ? 844 : w <= 1024 ? 1024 : w <= 1440 ? 900 : 1080);
const origin = new URL(BASE).origin;

async function check(name, fn) {
  try { await fn(); results.push({ name, pass: true }); console.log('PASS', name); }
  catch (e) { results.push({ name, pass: false, error: String(e.message || e).slice(0, 400) }); console.log('FAIL', name, String(e.message || e).slice(0, 400)); }
}
const NOISE = /ERR_NO_BUFFER_SPACE|ERR_INSUFFICIENT_RESOURCES|ERR_NETWORK_CHANGED/;   // socket exhaustion on the test machine, not the site
function watch(page) {
  const log = { errors: [], failed: [], external: new Set() };
  page.on('pageerror', (e) => log.errors.push(String(e).split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error' && !NOISE.test(m.text())) log.errors.push('console: ' + m.text().slice(0, 160)); });
  page.on('response', (r) => { if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url().slice(0, 140)}`); });
  page.on('requestfailed', (r) => { if (!/\.(mp4|webm)$/.test(r.url()) && !NOISE.test(r.failure()?.errorText || '')) log.failed.push('failed ' + r.url().slice(0, 140)); });
  page.on('request', (r) => { const u = new URL(r.url()); if (u.origin !== origin && !u.protocol.startsWith('data') && !u.protocol.startsWith('blob')) log.external.add(u.host); });
  return log;
}
const scrollTo = (page, y) => page.evaluate((y) => { if (typeof lenis !== 'undefined') lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); }, y);
const secTop = (page, sel) => page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, height: r.height }; }, sel);

/** Text nodes whose glyph boxes leave their nearest clipping ancestor, or are covered by an element that is not their own. */
const TEXT_AUDIT = `(() => {
  const clipsOf = (el) => { const out = []; for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (/(hidden|clip)/.test(cs.overflow + cs.overflowX + cs.overflowY)) out.push(a); } return out; };
  const vw = innerWidth, vh = innerHeight;
  const issues = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'OPTION'].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    let op = 1; for (let a = el; a && a !== document.body; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity);
    if (op < 0.05) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (!rects.length) continue;
    const box = rects.reduce((b, r) => ({ left: Math.min(b.left, r.left), top: Math.min(b.top, r.top), right: Math.max(b.right, r.right), bottom: Math.max(b.bottom, r.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
    if (box.bottom < 0 || box.top > vh) continue;              // not on screen right now
    // Text inside a collapsed clipping container (a closed accordion row) is not
    // painted at all, wherever its glyph boxes fall. The capability catalogue's
    // closed rows now hold several screens of detail, so those boxes reach the
    // footer when the page is scrolled to its end; they are not "covered" text.
    const clips = clipsOf(el);
    if (clips.some((c) => { const cr = c.getBoundingClientRect(); return cr.width < 4 || cr.height < 4; })) continue;
    // 1. clipped by an overflow-hidden ancestor (tolerance 2px)
    for (const c of clips) {
      const cr = c.getBoundingClientRect();
      if (cr.width < 4 || cr.height < 4) continue;                                 // collapsed containers are animation states, not clipping
      const cut = box.top < cr.top - 4 || box.bottom > cr.bottom + 4 || box.left < cr.left - 4 || box.right > cr.right + 4;
      if (cut && el.closest('.w-dyn-list, .lx-cta-author-list, .lx-community-loop, .marquee, .cta-sm-title, .partner-grid, .menu-wrapper, .w-nav-overlay, .products-cards-mobile') === null) issues.push({ kind: 'clipped', text: t.slice(0, 40), by: c.className.toString().slice(0, 60), box: [Math.round(box.left), Math.round(box.top), Math.round(box.right), Math.round(box.bottom)], clip: [Math.round(cr.left), Math.round(cr.top), Math.round(cr.right), Math.round(cr.bottom)] });
      break;
    }
    // 2. horizontal overflow of the viewport
    if (box.right > vw + 2 && el.closest('.w-dyn-list, .lx-cta-author-list, .lx-community-loop, .marquee, .cta-sm-title, .lx-gradient-section-text, .products-cards-wrapper') === null) issues.push({ kind: 'offscreen-x', text: t.slice(0, 40), right: Math.round(box.right), vw });
    // 3. covered: the centre of the first line hits another element that is not inside the text's own block
    const r0 = rects[0];
    const cx = Math.min(Math.max(r0.left + r0.width / 2, 1), vw - 1), cy = Math.min(Math.max(r0.top + r0.height / 2, 1), vh - 1);
    if (r0.top >= 0 && r0.bottom <= vh && el.closest('.lx-gradient-section, .lx-no-writing, .lx-cta-author-list, .lx-community-loop, .cta-sm-title, .marquee, .products-cards-mobile') === null) {
      const hit = document.elementFromPoint(cx, cy);
      if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) {
        const hcs = getComputedStyle(hit);
        const opaque = hcs.pointerEvents !== 'none' && (parseFloat(hcs.opacity) > 0.15) && !(hit.tagName === 'DIV' && hcs.backgroundColor === 'rgba(0, 0, 0, 0)' && !hcs.backgroundImage.includes('url') && !hit.querySelector(':scope > img, :scope > video'));
        if (opaque && !/stargo-media-toggle|circle-wrap|menu-bottom|crosshair|cursor/.test(hit.className)) issues.push({ kind: 'covered', text: t.slice(0, 40), by: (hit.tagName + '.' + hit.className).slice(0, 70) });
      }
    }
  }
  return issues;
})()`;

const auditText = async (page, label, tolerate = []) => {
  const run = async () => (await page.evaluate(TEXT_AUDIT)).filter((i) => !tolerate.some((re) => re.test(JSON.stringify(i))));
  let issues = await run();
  // A line still sliding into its SplitText mask is an animation frame, not a
  // clipped line: give reveals one more moment and judge the settled page.
  if (issues.length) { await page.waitForTimeout(2500); issues = await run(); }
  assert.deepEqual(issues, [], `${label}: ${JSON.stringify(issues).slice(0, 600)}`);
};
const noOverflow = async (page, label) => {
  const w = await page.evaluate(() => { const x = scrollX; window.scrollTo(400, scrollY); const can = scrollX; window.scrollTo(x, scrollY); return [document.documentElement.scrollWidth, innerWidth, can]; });
  assert(w[2] === 0, `${label}: page scrolls sideways by ${w[2]}px (scrollWidth ${w[0]} > ${w[1]})`);
};

/* ------------------------------------------------------------ 2. lifelogx scroll states (Intelligence)
   Workforce moved to the Lifelogx *feature* template so the two pages no longer share a
   layout; its own states are checked in section 2b. */
for (const width of WIDTHS.filter((w) => [390, 768, 1024, 1280, 1440, 1920].includes(w))) {
  for (const lang of ['', 'en/']) for (const name of ['intelligence.html']) {
    const id = `${lang ? 'en' : 'zh'}-${name.replace('.html', '')}-${width}`;
    const page = await browser.newPage({ viewport: { width, height: heightFor(width) } });
    const log = watch(page);
    await check(`lifelogx states ${id}`, async () => {
      await page.goto(`${BASE}/${lang}${name}`, { waitUntil: 'load', timeout: NAV });
      await page.waitForTimeout(2200);
      // hero word: fully inside the viewport width, above the phone's top edge at rest
      const hero = await page.locator('.lx-hero-text').evaluate((e) => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, fs: parseFloat(getComputedStyle(e).fontSize) }; });
      assert(hero.left >= -1 && hero.right <= width + 1, `hero word exceeds viewport: ${JSON.stringify(hero)}`);
      const phone = await page.locator('.lx-integrations_06-app').first().boundingBox();
      // The template lets the phone rise into the descender space of "Lifelogx". The ink of the word
      // (CJK em box bottom ≈ 0.9em, Latin baseline ≈ 0.78em below the line top) must stay above the phone.
      const lineTop = hero.top + ((hero.bottom - hero.top) - hero.fs) / 2;
      const inkBottom = lineTop + hero.fs * (lang ? 0.78 : 0.9);
      assert(phone.y >= inkBottom - 8, `phone covers the hero word: phone.y=${Math.round(phone.y)} inkBottom=${Math.round(inkBottom)}`);
      // WebKit needs several seconds for the page's videos and fonts before the load timeline runs; the assertion is the same, the wait is longer.
      await page.waitForFunction(() => +getComputedStyle(document.querySelector('.lx-hero-text')).opacity >= 0.99, null, { timeout: 20000 }).catch(() => {});
      assert.equal(await page.locator('.lx-hero-text').evaluate((e) => getComputedStyle(e).opacity), '1', 'hero word visible after load animation');
      // sticky feature section: enter, middle, leave, and back
      const sticky = await secTop(page, '.lx-sitcky-section');
      const readableCards = new Set();
      let cardCount = 0;
      for (const f of [-0.15, -0.05, 0.02, 0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.92, 0.98, 0.5, 0.1]) {
        await scrollTo(page, sticky.top + sticky.height * f); await page.waitForTimeout(500);
        await noOverflow(page, `${id} sticky@${f}`);
        // The accordion cards open and close as the section scrolls, moving their copy through an
        // overflow-hidden box. What must hold: every card reaches a state in which its copy and title
        // are both fully inside the open card, and the copy never runs into the title.
        const boxes = await page.evaluate(() => [...document.querySelectorAll('.lx-expandable-item')].map((card, i) => { const c = card.getBoundingClientRect(); const t = card.querySelector('.lx-expandable-text'); const tr = t.getBoundingClientRect(); const title = card.querySelector('.lx-expandable-icon-text'); const ti = title.getBoundingClientRect(); return { i, card: [c.top, c.bottom], text: [tr.top, tr.bottom], title: [ti.top, ti.bottom], height: c.height, textHeight: tr.height }; }));
        cardCount = boxes.length;
        for (const b of boxes) {
          const inside = b.text[0] >= b.card[0] - 1 && b.text[1] <= b.card[1] + 1 && b.title[0] >= b.card[0] - 1 && b.title[1] <= b.card[1] + 1;
          if (inside && b.height > 200) { readableCards.add(b.i); assert(b.text[1] <= b.title[0] + 1, `card ${b.i} copy runs into its title @${f}: ${JSON.stringify(b)}`); assert(b.textHeight <= b.height * 0.6, `card ${b.i} copy takes ${Math.round(b.textHeight)}px of a ${Math.round(b.height)}px card @${f}`); }
        }
        if (f === 0.42 || f === 0.82) await page.screenshot({ path: `${OUT}/${id}-sticky-${f}.png` });
      }
      assert.equal(readableCards.size, cardCount, `every card fully readable at some scroll state (${[...readableCards].join(',')} of ${cardCount})`);
      // gradient section: the four headings appear in turn and are never hidden behind the overlay image
      const grad = await secTop(page, '.lx-gradient-section');
      let seen = 0;
      for (const f of [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.3]) {
        await scrollTo(page, grad.top + grad.height * f); await page.waitForTimeout(650);
        const states = await page.evaluate(() => [...document.querySelectorAll('.lx-gradient-section-text h3')].map((h) => { const r = h.getBoundingClientRect(); const cs = getComputedStyle(h); let op = parseFloat(cs.opacity); for (let a = h.parentElement; a && !a.classList.contains('lx-gradient-section'); a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity); return { op, top: r.top, bottom: r.bottom, left: r.left, right: r.right, z: cs.zIndex }; }));
        const visible = states.filter((s) => s.op > 0.6 && s.bottom > 0 && s.top < heightFor(width));
        seen += visible.length ? 1 : 0;
        for (const s of visible) assert(s.left >= -1 && s.right <= width + 1, `gradient heading leaves the viewport @${f}`);
        if (f === 0.45) await page.screenshot({ path: `${OUT}/${id}-gradient.png` });
      }
      assert(seen >= 3, `gradient headings never became readable (${seen} states)`);
      // "no writing" section: the words are the template's size and stay clear of the phone image on desktop
      const nw = await secTop(page, '.lx-no-writing');
      let readable = 0;
      for (const f of [0.08, 0.3, 0.55, 0.8, 0.2]) {
        await scrollTo(page, nw.top + nw.height * f); await page.waitForTimeout(400);
        const st = await page.evaluate(() => { const img = document.querySelector('.lx-no-writing-image').getBoundingClientRect(); return [...document.querySelectorAll('.lx-big-gradient-text')].filter((h) => h.getBoundingClientRect().width > 0).map((h) => { const r = h.getBoundingClientRect(); const cx = (r.left + r.right) / 2; return { text: h.textContent, fs: parseFloat(getComputedStyle(h).fontSize), op: parseFloat(getComputedStyle(h).opacity), lines: Math.round(r.height / (parseFloat(getComputedStyle(h).fontSize) * 1.2)), rect: [r.left, r.top, r.right, r.bottom], centreBehindPhone: cx > img.left && cx < img.right && r.bottom > img.top && r.top < img.bottom }; }); });
        const vis = st.filter((s) => s.op > 0.6);
        if (vis.length) readable++;
        for (const s of vis) { assert(s.fs >= Math.min(60, width * 0.085), `gradient word too small (${s.fs}px at ${width})`); assert(s.lines === 1, `"${s.text}" wraps into ${s.lines} lines`); if (width >= 992) assert(!s.centreBehindPhone, `"${s.text}" sits behind the phone @${f}`); }
        if (f === 0.3) await page.screenshot({ path: `${OUT}/${id}-nowriting.png` });
      }
      assert(readable >= 3, `"no writing" words never readable (${readable} states)`);
      // closing card and CTA
      await scrollTo(page, (await secTop(page, '.lx-cta-wrapper')).top - 100); await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${id}-cta.png` });
      await auditText(page, `${id} cta`, []);
      // reverse scroll back to the hero: nothing stuck hidden
      await scrollTo(page, 0); await page.waitForTimeout(800);
      assert.equal(await page.locator('.lx-hero-text').evaluate((e) => +getComputedStyle(e).opacity >= 0.95), true, 'hero word visible after reverse scroll');
      // resize on the page keeps it inside the viewport
      await page.setViewportSize({ width: width === 390 ? 768 : 390, height: 844 }); await page.waitForTimeout(700);
      await noOverflow(page, `${id} after resize`);
      assert.deepEqual(log.errors, [], 'JS errors during states');
    });
    await page.close();
  }
}

/* ------------------------------------------------------------ 2b. workforce on the lifelogx feature template */
for (const width of WIDTHS.filter((w) => [390, 768, 1280, 1440].includes(w))) {
  for (const lang of ['', 'en/']) {
    const id = `${lang ? 'en' : 'zh'}-workforce-feature-${width}`;
    const page = await browser.newPage({ viewport: { width, height: heightFor(width) } });
    const log = watch(page);
    await check(`feature page ${id}`, async () => {
      await page.goto(`${BASE}/${lang}workforce.html`, { waitUntil: 'load', timeout: NAV });
      await page.waitForTimeout(2200);

      // It must not be the homepage template any more: those pages carry the hero word,
      // the sticky accordion and the avatar bubbles, and this one carries none of them.
      for (const sel of ['.lx-hero-text', '.lx-sitcky-section', '.lx-big-gradient-text']) {
        assert.equal(await page.locator(sel).count(), 0, `${id}: still the homepage template (${sel})`);
      }
      // …and it does carry the feature template's own blocks.
      for (const sel of ['.lx-hero-features', '.lx-feature-hero-card', '.lx-answers-card', '.lx-blog-list']) {
        assert(await page.locator(sel).count() > 0, `${id}: feature block missing (${sel})`);
      }

      // Role cards: five roles, each shown twice for the marquee loop, none of them
      // carrying a template name or an invented metric.
      const roles = await page.locator('.lx-name-text').evaluateAll((els) => els.map((e) => e.textContent.trim()));
      assert(roles.length >= 10, `${id}: ${roles.length} role cards`);
      for (const r of roles) assert(!/Philip|Arlene|Marjorie|Collen|Greg|Dancing/.test(r), `${id}: template name "${r}"`);
      const figures = await page.locator('.lx-views-holder').evaluateAll((els) => els.map((e) => e.textContent.trim()));
      for (const f of figures) assert(!/\d+(\.\d+)?M\b|Views/.test(f), `${id}: invented metric "${f}"`);

      // Every card links inside the site.
      const hrefs = await page.locator('.lx-feature-hero-card').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
      for (const h of hrefs) assert(h && !/^https?:/.test(h), `${id}: card links off-site (${h})`);

      // Scroll the whole page: nothing may leave its box or scroll sideways.
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const step = Math.max(400, Math.round(heightFor(width) * 0.6));
      for (let y = 0; y < H; y += step) { await scrollTo(page, y); await page.waitForTimeout(120); await noOverflow(page, `${id}@${y}`); }
      await page.waitForTimeout(1500);
      await auditText(page, `${id}@end`, []);

      // The rescued wordmark closes the page.
      const mark = await page.locator('.lx-text-extra-big').first().evaluate((e) => ({ text: e.textContent.trim(), fs: parseFloat(getComputedStyle(e).fontSize) }));
      assert.equal(mark.text, 'STARGO', `${id}: closing wordmark reads "${mark.text}"`);
      assert(mark.fs > width * 0.15, `${id}: closing wordmark only ${Math.round(mark.fs)}px at ${width}`);

      await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: false });
      assert.deepEqual(log.errors, [], 'JS/console errors');
      assert.deepEqual(log.failed, [], 'failed requests');
    });
    await page.close();
  }
}

/* ------------------------------------------------------------ 3. homepage areas */
for (const width of WIDTHS.filter((w) => [390, 768, 1280, 1440].includes(w))) for (const lang of ['', 'en/']) {
  const id = `${lang ? 'en' : 'zh'}-home-${width}`;
  const page = await browser.newPage({ viewport: { width, height: heightFor(width) } });
  const log = watch(page);
  await check(`home areas ${id}`, async () => {
    await page.goto(`${BASE}/${lang}index.html`, { waitUntil: 'load', timeout: NAV }); await page.waitForTimeout(5800);
    // pricing ladder title: the orb never overlaps the glyphs of the heading
    const ladder = await secTop(page, '.section.drk');
    await scrollTo(page, ladder.top - 40); await page.waitForTimeout(700);
    const orb = await page.evaluate(() => { const h = document.querySelector('.h2.for-stats'); const o = h.querySelector('.stargo-inline-orb'); const or = o.getBoundingClientRect(); const rects = []; const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const r = document.createRange(); r.selectNodeContents(n); rects.push(...[...r.getClientRects()].map((x) => [x.left, x.top, x.right, x.bottom])); } return { orb: [or.left, or.top, or.right, or.bottom], rects, lines: new Set(rects.map((r) => Math.round(r[1]))).size }; });
    for (const r of orb.rects) { const overlap = Math.max(0, Math.min(r[2], orb.orb[2]) - Math.max(r[0], orb.orb[0])) * Math.max(0, Math.min(r[3], orb.orb[3]) - Math.max(r[1], orb.orb[1])); assert(overlap < 40, `ladder orb overlaps the title glyphs: ${JSON.stringify({ r, orb: orb.orb })}`); }
    assert(orb.lines <= (width < 768 ? 4 : 3), `ladder title wraps into ${orb.lines} lines`);
    await page.screenshot({ path: `${OUT}/${id}-ladder.png` });
    // partner wall: eight sample cards, flip animation intact, and NO caption
    assert.equal(await page.locator('.partner-grid .partner-card').count(), 8, 'eight partner cards');
    assert.equal(await page.locator('.partner-grid .card-side.is-back img').count(), 8, 'flip backs');
    /* The owner removed the wall's sample labels on 2026-09-10. The assertion
       is inverted rather than deleted: with the template's own marks still in
       the grid, the wall must make no claim about them at all, so the caption
       has to stay empty — and it must never silently fall back to the
       template's "(Partners)" or to 「我们服务过的品牌」, which would be a
       statement about customers this site does not have. */
    const caption = (await page.locator('.bottom-grid._1.grd .top-text').first().innerText()).trim();
    assert.equal(caption, '', `partner wall must carry no caption while its logos are the template's: "${caption}"`);
    await scrollTo(page, (await secTop(page, '.partner-grid')).top - 200); await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/${id}-partners.png` });
    // scenario cards (sticky testimonials): portrait film present, four cards, illustrative labels, mark, through the scroll
    assert.equal(await page.locator('.testimonials-card').count(), 4);
    const film = await page.evaluate(() => { const v = document.querySelector('.testimonials-card._03 video'); return v ? (v.currentSrc || '') + ' ' + [...v.querySelectorAll('source')].map((s) => s.getAttribute('src')).join(' ') : ''; });
    assert(/Contemplative/.test(film), `portrait film on card 3: ${film.slice(0, 120)}`);
    assert.equal(await page.locator('.testimonials-card .stargo-card-mark').count(), 4, 'STARGO mark on the four cards');
    const labels = await page.locator('.testimonials-card .card-author .top-text:not(.sml)').allInnerTexts();
    assert(labels.every((l) => /示例|illustrative/i.test(l)), `scenario cards labelled: ${labels.join(' | ')}`);
    const testi = await secTop(page, '.testimonials-section');
    for (const f of [0.15, 0.4, 0.65, 0.9, 0.5]) {
      await scrollTo(page, testi.top + testi.height * f); await page.waitForTimeout(500);
      await noOverflow(page, `${id} testimonials@${f}`);
      if (f === 0.4 || f === 0.65) await page.screenshot({ path: `${OUT}/${id}-scenarios-${f}.png` });
    }
    const cardText = await page.evaluate(() => [...document.querySelectorAll('.testimonials-card .card-testi .for-tst')].map((t) => { const c = t.closest('.testimonials-card').getBoundingClientRect(); const r = t.getBoundingClientRect(); return r.top >= c.top - 1 && r.bottom <= c.bottom + 1; }));
    assert(cardText.every(Boolean), 'scenario quote fits its card');
    // blog cards: four newest articles with template covers, dates and titles, linking into blog/
    const cards = await page.locator('.blog-grid .w-dyn-item a').evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href'), img: a.querySelector('img').getAttribute('src'), ratio: a.querySelector('img').getBoundingClientRect().width / a.querySelector('img').getBoundingClientRect().height, title: a.querySelector('.blog-txt').textContent, date: a.querySelector('time')?.getAttribute('datetime') })));
    assert.equal(cards.length, 4);
    for (const c of cards) { assert(/^blog\//.test(c.href), c.href); assert(/assets\/blog\//.test(c.img), c.img); assert(c.title.length > 8); assert(/^\d{4}-\d{2}-\d{2}$/.test(c.date || ''), 'dated'); assert(c.ratio > 1.15 && c.ratio < 1.5, `card image ratio ${c.ratio}`); }
    await scrollTo(page, (await secTop(page, '.blog-grid')).top - 160); await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${id}-blog-cards.png` });
    // contact band: the template photograph behind a glass card
    const ctc = await page.evaluate(() => { const ps = getComputedStyle(document.querySelector('.photo-section')); const card = getComputedStyle(document.querySelector('.section.ctc .contact-card')); return { bg: ps.backgroundImage, blur: card.backdropFilter || card.webkitBackdropFilter, cardBg: card.backgroundColor }; });
    assert(/Joyful-Group/.test(ctc.bg), `contact photograph: ${ctc.bg.slice(0, 80)}`);
    assert(/blur/.test(ctc.blur), `glass card: ${ctc.blur}`);
    assert(/0\.1[0-9]|0\.2/.test(ctc.cardBg) || ctc.cardBg.includes('0.15'), `translucent card: ${ctc.cardBg}`);
    await scrollTo(page, (await secTop(page, '.section.ctc')).top + 80); await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${id}-contact-band.png` });
    await auditText(page, `${id} contact band`, [/Scroll for more|继续滚动/]);
    assert.deepEqual(log.errors, [], 'JS errors');
  });
  await page.close();
}

/* ------------------------------------------------------------ 4. About, Blog, article: structure and SEO head */
for (const lang of ['', 'en/']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const log = watch(page);
  const L = lang ? 'en' : 'zh';
  await check(`about/blog/article ${L}`, async () => {
    const head = async (url) => {
      await page.goto(url, { waitUntil: 'load', timeout: NAV }); await page.waitForTimeout(1200);
      return page.evaluate(() => ({
        title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href,
        hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.getAttribute('hreflang') + '=' + l.href),
        og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]')].map((m) => [m.getAttribute('property'), m.content])),
        description: document.querySelector('meta[name=description]')?.content,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()).filter(Boolean),
        h2h3: [...document.querySelectorAll('h2, h3')].map((h) => h.tagName + ':' + h.textContent.trim().slice(0, 40)),
      }));
    };
    // About
    let h = await head(`${BASE}/${lang}about.html`);
    assert.match(h.canonical, /\/(en\/)?about$/); assert.equal(h.hreflang.length, 3); assert(h.ld[0]['@graph'].some((n) => n['@type'] === 'AboutPage'));
    /* The About page was rebuilt on cinery (2026-09-15): the owner asked for
       「about页面也拿cinery模版替换」 and chose 「介绍带 + 项目网格 + 评价」. The
       Lifelogx circles, careers rows and rich-text story are no longer on it,
       so the assertions that named them are replaced rather than deleted —
       what they were really protecting is that this page still introduces the
       company, still names the four AI-employee roles, and still reaches the
       contact page. Each of those is asserted below against what now draws it.

       This is the second time a hard-coded list here went stale behind a
       rebuild (the first was the four role names, held in English against a
       Chinese page). Both now read from ABOUT, so a rename cannot break the
       gate for a page that is correct. */
    assert.equal(await page.locator('.cn-about, .cn-about-projects, .cn-about-reviews').count(), 3, 'the three cinery bands');
    /* textContent, not innerText: innerText returns only what is RENDERED, and
       these labels are hidden until their scroll reveal fires, so innerText
       reads '' on a page that is perfectly correct. */
    const roles = (await page.locator('.cn-about-projects').evaluate((e) => e.textContent)).replace(/\s+/g, ' ');
    for (const c of ABOUT.circles) {
      const label = c.label[lang === 'en/' ? 'en' : 'zh'];
      assert(roles.includes(label), `About names the role ${label}`);
    }
    /* The tiles play cinery's own four clips. They were briefly replaced by four
       still images on 2026-09-15 and the owner reverted that the same day —
       「11.3 MB 无引用的 cinery 案例片，帮我恢复原模版」 — so these three assertions
       are the inverted form of the ones that swap put here, kept rather than
       deleted so the band stays guarded either way. Each tile is one `<video>`
       with an mp4 and a webm; the band's only `<img>`s are the two copies of the
       STARGO wordmark each tile stacks for its hover roll (8 in all). What must
       NOT come back with the clips is a client name, a year or a logoipsum
       mark — the role names asserted above are what the tile line says. */
    assert.equal(await page.locator('.cn-about-projects video').count(), 4, 'four donor clips');
    assert.equal(await page.locator('.cn-about-projects source').count(), 8, 'an mp4 and a webm per clip');
    assert.equal(await page.locator('.cn-about-projects img.stargo-still').count(), 0,
      'the still-image version of this band was reverted; the tiles play the template clips');
    /* And every one of them is served from this origin. `data-src` as well as
       `src`, so wiring js/stargo-video-defer.js into the About page later does
       not turn this into a false failure. */
    const clipSrcs = await page.locator('.cn-about-projects source')
      .evaluateAll((ss) => ss.map((s) => s.getAttribute('src') || s.getAttribute('data-src')));
    for (const src of clipSrcs) assert.match(src ?? '', /(?:^|\/)assets\/cinery\//, `clip served locally: ${src}`);
    assert(await page.locator('.cn-about a[href$="contact.html"]').count() >= 1, 'About reaches the contact page');
    const intro = await page.locator('.cn-about').innerText();
    assert(intro.replace(/\s+/g, '').length > 40, 'the introduction band carries its paragraph');
    for (const f of [0.35, 0.6, 0.85]) { const H = await page.evaluate(() => document.documentElement.scrollHeight); await scrollTo(page, H * f); await page.waitForTimeout(700); }
    await page.screenshot({ path: `${OUT}/${L}-about-story.png` });
    await scrollTo(page, 0); await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${L}-about-hero.png` });
    // Blog index
    h = await head(`${BASE}/${lang}blog.html`);
    assert.match(h.canonical, /\/(en\/)?blog$/);
    const blogNode = h.ld[0]['@graph'].find((n) => n['@type'] === 'Blog');
    assert.equal(blogNode.blogPost.length, POSTS.length, 'Blog JSON-LD lists every article');
    assert.equal(await page.locator('.lx-blog-item a').count(), POSTS.length);
    const hrefs = await page.locator('.lx-blog-item a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert.deepEqual(hrefs, POSTS.map(postPath));
    assert.equal(await page.locator('.lx-blog-item time').count(), POSTS.length, 'dated cards');
    await page.screenshot({ path: `${OUT}/${L}-blog.png` });
    // Every article
    for (const post of POSTS) {
      h = await head(`${BASE}/${lang}${postPath(post)}`);
      assert.equal(h.h1.length, 1, `one h1 on ${post.slug}`); assert.equal(h.h1[0].replace(/\s+/g, ' '), post.title[L].replace(/\s+/g, ' '));
      assert.match(h.canonical, new RegExp(`/(en/)?blog/${post.slug}$`));
      assert.equal(h.hreflang.length, 3);
      assert.equal(h.og['og:type'], 'article'); assert.equal(h.og['article:published_time'], post.date); assert.match(h.og['og:image'], /assets\/blog\//);
      assert.equal(h.description, post.description[L]);
      const g = h.ld[0]['@graph'];
      const bp = g.find((n) => n['@type'] === 'BlogPosting');
      assert(bp && bp.headline === post.title[L] && bp.datePublished === post.date && bp.author.name === 'STARGO WORK' && bp.image.includes('assets/blog/'), 'BlogPosting');
      assert.equal(g.find((n) => n['@type'] === 'BreadcrumbList').itemListElement.length, 3, 'breadcrumbs');
      assert(h.h2h3.filter((x) => x.startsWith('H3')).length >= 3, 'article sections use h3');
      // postPage() lists up to five other articles (others(post, 5) in tools/build-site.mjs).
      assert.equal(await page.locator('a.lx-related-item').count(), Math.min(5, POSTS.length - 1), 'related links');
      assert.equal(await page.locator('.lx-blog-item a').count(), 3, 'more from the blog');
      const rel = await page.locator('a.lx-related-item, .lx-blog-item a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      assert(rel.every((r) => /^\.\.\/blog\//.test(r)) && !rel.includes(`../blog/${post.slug}.html`), `related links leave the article: ${rel.join(' ')}`);
      // body becomes visible when scrolled into view (IX2 fade), stays inside the grid
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      await scrollTo(page, 500); await page.waitForTimeout(900);
      const body = await page.locator('.lx-text-rich-text').evaluate((e) => ({ op: +getComputedStyle(e).opacity, w: e.getBoundingClientRect().width, p: e.querySelectorAll('p').length }));
      assert(body.op > 0.9 && body.p >= 3, `article body visible: ${JSON.stringify(body)}`);
      const pStyle = await page.locator('.lx-text-rich-text p').first().evaluate((p) => { const cs = getComputedStyle(p); return { op: cs.opacity, ls: cs.letterSpacing, fs: parseFloat(cs.fontSize) }; });
      assert(pStyle.op === '1' && pStyle.ls === 'normal' && pStyle.fs >= 16, `article paragraph style: ${JSON.stringify(pStyle)}`);
      await scrollTo(page, H); await page.waitForTimeout(1800);
      await auditText(page, `${L} ${post.slug} end`, []);
      if (post === POSTS[0]) { await scrollTo(page, 400); await page.waitForTimeout(800); await page.screenshot({ path: `${OUT}/${L}-article.png`, fullPage: false }); }
    }
    assert.deepEqual(log.errors, [], 'JS errors'); assert.deepEqual(log.failed, [], 'failed requests');
  });
  await page.close();
}

/* ------------------------------------------------------------ 5. menu, language switch, nav on the new pages, mobile */
for (const lang of ['', 'en/']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const log = watch(page);
  const L = lang ? 'en' : 'zh';
  await check(`navigation ${L}`, async () => {
    await page.goto(`${BASE}/${lang}blog/${POSTS[1].slug}.html`, { waitUntil: 'load', timeout: NAV }); await page.waitForTimeout(1200);
    const menu = page.locator('.menu-button'); await menu.click(); await page.waitForTimeout(700);
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    const overlayLinks = await page.locator('.w-nav-overlay .nav-menu a, .nav-menu a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert(overlayLinks.length >= 7, 'overlay links present');
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    // real language switch from a nested article
    await page.locator('.nav-menu a[hreflang]').first().evaluate((a) => a.click());
    // Cloudflare Pages serves clean URLs, so the committed link /en/blog/<slug>.html lands on /en/blog/<slug>.
    await page.waitForURL((u) => u.pathname.replace(/\.html$/, '').endsWith(`/blog/${POSTS[1].slug}`) && u.pathname.startsWith('/en/') === !lang, { timeout: Math.max(15000, NAV) });
    assert.equal(await page.locator('html').getAttribute('lang'), lang ? 'zh-CN' : 'en');
    assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim(), POSTS[1].title[lang ? 'zh' : 'en'].replace(/\s+/g, ' '));
    // footer pages grid contains About and Blog; the overlay marks Blog current on an article
    const footer = await page.locator('.footer-small-grid a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert(footer.some((h) => /about\.html$/.test(h)) && footer.some((h) => /blog\.html$/.test(h)), 'About/Blog in the footer');
    assert.equal(await page.locator('.nav-top-flex a[aria-current="page"]').getAttribute('href').then((h) => h.replace(/^(\.\.\/)+/, '')), 'blog.html', 'Blog marked current on an article');
    assert.deepEqual(log.errors, []);
  });
  await page.close();
}

/* ------------------------------------------------------------ 6. side-by-side with the originals */
if (ORIG_LX || ORIG_MONO) {
  const sharp = req('sharp');
  const pair = async (label, a, b, width, height, setup) => {
    const shots = [];
    for (const [url, tag] of [[a, 'original'], [b, 'stargo']]) {
      const page = await browser.newPage({ viewport: { width, height } });
      try {
        await page.goto(url, { waitUntil: 'load', timeout: Math.max(60000, NAV) }); await page.waitForTimeout(url.includes('4200') && /index/.test(url) ? 5800 : 2500);
        await setup(page, tag);
        shots.push(await page.screenshot());
      } finally { await page.close(); }
    }
    const [x, y] = await Promise.all(shots.map((s) => sharp(s).resize({ width: 640 }).toBuffer()));
    const h = Math.max((await sharp(x).metadata()).height, (await sharp(y).metadata()).height);
    await sharp({ create: { width: 1300, height: h, channels: 3, background: '#333' } }).composite([{ input: x, left: 0, top: 0 }, { input: y, left: 660, top: 0 }]).png().toFile(`${OUT}/compare-${label}-${width}.png`);
    console.log('compare', label, width, '->', `${OUT}/compare-${label}-${width}.png`);
  };
  const toSection = (sel, frac = 0) => async (page, tag) => { const s = tag === 'original' ? sel.replace(/\.lx-/g, '.') : sel; const t = await secTop(page, s); if (!t) throw new Error(`no ${s}`); await scrollTo(page, t.top + t.height * frac); await page.waitForTimeout(900); };
  for (const width of [1280, 390]) {
    if (ORIG_LX) {
      await check(`compare lifelogx ${width}`, async () => {
        await pair('lx-hero', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), async () => {});
        await pair('lx-cards', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), toSection('.lx-sitcky-section', 0.45));
        await pair('lx-gradient', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), toSection('.lx-gradient-section', 0.4));
        await pair('lx-bubbles', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), toSection('.lx-cta_wrapper', 0.15));
        await pair('lx-nowriting', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), toSection('.lx-no-writing', 0.3));
        await pair('lx-cta', `${ORIG_LX}/index.html`, `${BASE}/intelligence.html`, width, heightFor(width), toSection('.lx-cta-wrapper', 0));
        await pair('lx-about', `${ORIG_LX}/about.html`, `${BASE}/about.html`, width, heightFor(width), async () => {});
        await pair('lx-blog', `${ORIG_LX}/blog.html`, `${BASE}/blog.html`, width, heightFor(width), async () => {});
        await pair('lx-article', `${ORIG_LX}/blogs_how-ai-companions-can-transform-your-life.html`, `${BASE}/${postPath(POSTS[1])}`, width, heightFor(width), async () => {});
      });
    }
    if (ORIG_MONO) {
      await check(`compare mono ${width}`, async () => {
        await pair('mono-ladder', `${ORIG_MONO}/index.html`, `${BASE}/index.html`, width, heightFor(width), toSection('.section.drk', 0));
        await pair('mono-partners', `${ORIG_MONO}/index.html`, `${BASE}/index.html`, width, heightFor(width), async (page) => { const t = await secTop(page, '.partner-grid'); await scrollTo(page, t.top - 200); await page.waitForTimeout(1800); });
        await pair('mono-blog', `${ORIG_MONO}/index.html`, `${BASE}/index.html`, width, heightFor(width), async (page) => { const t = await secTop(page, '.blog-grid'); await scrollTo(page, t.top - 160); await page.waitForTimeout(1000); });
        await pair('mono-contact', `${ORIG_MONO}/index.html`, `${BASE}/index.html`, width, heightFor(width), async (page) => { const t = await secTop(page, '.section.ctc'); await scrollTo(page, t.top + 80); await page.waitForTimeout(1200); });
        await pair('mono-scenarios', `${ORIG_MONO}/index.html`, `${BASE}/index.html`, width, heightFor(width), toSection('.testimonials-section', 0.45));
        await pair('mono-quote-card', `${ORIG_MONO}/contact_contact-1.html`, `${BASE}/contact.html`, width, heightFor(width), toSection('.testimonials-card', 0));
      });
    }
  }
}

/* ------------------------------------------------------------ 1. every page × width */
const pages = [...SITE_PAGES, '404.html'];
for (const width of WIDTHS) {
  for (const lang of ['', 'en/']) {
    for (const name of pages) {
      const url = `${BASE}/${lang}${name}`;
      const id = `${lang ? 'en' : 'zh'}-${name.replace(/\.html$/, '').replace(/\//g, '-')}-${width}`;
      const page = await browser.newPage({ viewport: { width, height: heightFor(width) } });
      const log = watch(page);
      await check(`page ${id}`, async () => {
        const resp = await page.goto(url, { waitUntil: 'load', timeout: Math.max(60000, NAV) });
        assert.equal(resp.status(), name === '404.html' ? 200 : 200);
        await page.waitForTimeout(name === 'index.html' ? 5800 : 1500);
        await noOverflow(page, id);
        await page.screenshot({ path: `${OUT}/${id}.png` });
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        const step = Math.max(400, Math.round(heightFor(width) * 0.6));
        for (let y = 0; y < H; y += step) { await scrollTo(page, y); await page.waitForTimeout(120); await noOverflow(page, `${id}@${y}`); }
        await page.waitForTimeout(1500);                      // text reveals (SplitText line masks) finish
        await auditText(page, `${id}@end`, [/Scroll for more|继续滚动/]);
        await scrollTo(page, 0); await page.waitForTimeout(300);
        // language switch, wordmark, current page, no template brand
        const up = name.includes('/') ? '../' : '';
        const swap = await page.locator('.nav-menu a[hreflang]').first().getAttribute('href');
        assert.equal(swap, lang ? `${up}../${name}` : `${up}en/${name}`, 'language switch');
        assert.equal(await page.locator('a.logo-first').first().getAttribute('href'), `${up}index.html`, 'wordmark home link');
        const text = await page.evaluate(() => document.body.innerText);
        assert(!/Mōno|Lifelogx|Scalora|Tomato Store|Lorem/i.test(text), 'template brand in page text');
        assert.deepEqual(log.errors, [], 'JS/console errors');
        assert.deepEqual(log.failed, [], 'failed requests');
        assert.deepEqual([...log.external], [], 'off-origin requests');
      });
      await page.close();
    }
  }
}


await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify({ engine: ENGINE, base: BASE, widths: WIDTHS, at: new Date().toISOString(), results }, null, 2));
const failed = results.filter((r) => !r.pass);
console.log(`${results.length - failed.length}/${results.length} checks passed (${ENGINE})`);
if (failed.length) { console.log('FAILED:'); for (const f of failed) console.log(' -', f.name, '→', f.error); }
process.exitCode = failed.length ? 1 : 0;

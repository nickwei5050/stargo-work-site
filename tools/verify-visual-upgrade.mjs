import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { SITE, req } from './paths.mjs';
const { chromium } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const OUT = '.wrangler/visual-upgrade-qa';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let failed = 0;

async function jump(page, selector, offset = 0) {
  await page.evaluate(({ selector, offset }) => {
    const el = document.querySelector(selector);
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    if (typeof lenis !== 'undefined') lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, { selector, offset });
  await page.waitForTimeout(500);
}

for (const lang of ['', 'en/']) for (const width of [390, 768, 1440, 1920]) {
  const name = `${lang ? 'en' : 'zh'}-${width}`;
  const page = await browser.newPage({ viewport: { width, height: width < 992 ? 844 : 900 } });
  const errors = [], badResponses = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`); });
  try {
    const response = await page.goto(`${BASE}/${lang}index.html`, { waitUntil: 'load' });
    assert.equal(response.status(), 200);
    await page.waitForTimeout(700);
    assert.equal(await page.locator('[data-stargo-video]').count(), 1);
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true, 'offscreen video stays paused');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'no horizontal overflow');
    if (width >= 992) {
      await jump(page, '.product-sticky-block');
      const tabs = page.locator('.stargo-switcher [role="tab"]');
      for (const i of [3, 1, 0, 2]) {
        await tabs.nth(i).click();
        await page.waitForTimeout(1100);
        assert.equal(await tabs.nth(i).getAttribute('aria-selected'), 'true', `click ${i} active`);
        assert.equal(await page.locator('.stargo-switcher [role="tabpanel"].is-active').count(), 1);
        assert.equal(await page.locator(`#core-panel-${i}`).evaluate(x => +getComputedStyle(x).opacity), 1);
        const box = await page.locator('.products-cards-wrapper').boundingBox();
        assert(box.y >= -2 && box.y + box.height <= 902, `sticky card fits viewport: ${JSON.stringify(box)}`);
      }
      await tabs.nth(2).focus();
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(1000);
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true', 'keyboard selection');
      for (const i of [0, 1, 2, 3]) {
        await page.evaluate(i => {
          const t = ScrollTrigger.getById('stargo-core-systems');
          lenis.scrollTo(t.start + (t.end - t.start) * (i + .5) / 4, { immediate: true });
        }, i);
        await page.waitForTimeout(500);
        assert.equal(await tabs.nth(i).getAttribute('aria-selected'), 'true', `scroll stage ${i}`);
      }
      await page.screenshot({ path: `${OUT}/${name}-switcher.png` });
    } else {
      const items = page.locator('.products-cards-mobile > .products-cards-inner-block-mobile');
      await jump(page, '.products-cards-mobile');
      for (let i = 1; i < 4; i++) {
        await items.nth(i).locator('.products-card-name-block').first().click();
        await page.waitForTimeout(650);
        assert((await items.nth(i).locator('.products-cards-dashboard-size').first().boundingBox()).height > 50, `mobile accordion ${i}`);
      }
    }
    await jump(page, '.video-section', 800);
    await page.waitForFunction(() => { const v = document.querySelector('[data-stargo-video]'); return !v.paused && v.currentTime > .05; }, null, { timeout: 12000 });
    const control = page.locator('.stargo-media-toggle');
    await control.click();
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true, 'pause works');
    await jump(page, '.product-sticky-block');
    await jump(page, '.video-section', 800);
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true, 'user pause survives leaving/re-entering');
    await control.click();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), false, 'play works');
    await page.screenshot({ path: `${OUT}/${name}-video.png` });
    await jump(page, '.product-sticky-block');
    assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true, 'offscreen pause');
    assert.deepEqual(errors, [], 'JS errors');
    assert.deepEqual(badResponses, [], 'asset errors');
    console.log(`PASS ${name}: layout, ${width >= 992 ? '4 clicks + keyboard + 4 scroll states' : '3 mobile accordions'}, video playback + pause + resume + offscreen`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${name}: ${error.message}`);
    await page.screenshot({ path: `${OUT}/${name}-failure.png` });
  } finally { await page.close(); }
}
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
try {
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await jump(page, '.video-section', 800);
  assert.equal(await page.locator('[data-stargo-video]').evaluate(v => v.paused), true, 'reduced-motion default static');
  await page.locator('.stargo-media-toggle').click();
  await page.waitForFunction(() => !document.querySelector('[data-stargo-video]').paused);
  console.log('PASS reduced-motion: poster by default, explicit play available');
} catch (e) { failed++; console.log(`FAIL reduced-motion: ${e.message}`); }
await page.close();
const failurePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
try {
  await failurePage.route('**/assets/stargo-motion/orbit.mp4', route => route.fulfill({ status: 404, body: 'unavailable' }));
  await failurePage.goto(`${BASE}/`, { waitUntil: 'load' });
  await jump(failurePage, '.video-section', 800);
  await failurePage.waitForFunction(() => document.querySelector('.stargo-media-toggle').disabled);
  assert.equal(await failurePage.locator('[data-stargo-video]').evaluate(v => v.paused), true);
  assert.equal(await failurePage.locator('.stargo-media-toggle').textContent(), '视频暂时无法播放');
  console.log('PASS unavailable video: paused, truthful error, poster retained');
} catch (e) { failed++; console.log(`FAIL unavailable video: ${e.message}`); }
await browser.close();
console.log(`${10 - failed}/10 scenarios passed. Screenshots: ${OUT}`);
process.exitCode = failed ? 1 : 0;

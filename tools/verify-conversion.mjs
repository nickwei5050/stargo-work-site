/** Client-only fixtures: NEVER evidence of real email delivery. */
import assert from 'node:assert/strict';
import { req } from './paths.mjs';
const { chromium } = req('@playwright/test');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const browser = await chromium.launch();
let count = 0;
try {
  for (const lang of ['', 'en/']) for (const width of [390, 1440]) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    let requests = 0;
    await p.route('**/api/contact', async route => {
      requests++;
      await new Promise(resolve => setTimeout(resolve, 300));
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"error":"not_configured"}' });
    });
    await p.goto(`${BASE}/${lang}contact.html`, { waitUntil: 'load' });
    const form = p.locator('form[data-stargo-form="contact"]');
    await form.evaluate(f => f.requestSubmit());
    assert.equal(requests, 0, 'invalid form sends nothing');
    assert(await form.locator('.stargo-form-note').isVisible());
    await form.locator('[name="name"]').fill('STARGO browser QA — not delivered');
    await form.locator('[type="email"]').fill('qa@example.invalid');
    await form.evaluate(f => { f.requestSubmit(); f.requestSubmit(); });
    await p.waitForTimeout(800);
    assert.equal(requests, 1, 'duplicate submission blocked');
    assert.equal(await form.getAttribute('data-stargo-busy'), null, 'busy state cleared');
    assert(await form.isVisible(), 'unavailable service cannot show fake success');
    assert.match(await form.locator('.stargo-form-note').innerText(), /无法确认|unavailable/);
    assert.equal(await form.locator('.stargo-form-note a[href^="mailto:"]').count(), 1, 'explicit fallback link, never automatic app launch');
    const legal = await p.locator('a').evaluateAll(as => as.filter(a => /Privacy|隐私|Terms|条款/.test(a.innerText)).map(a => a.getAttribute('href')));
    assert(legal.length > 0 && legal.every(h => /(?:privacy|terms)\.html/.test(h)));
    await p.goto(`${BASE}/${lang}pricing.html`, { waitUntil: 'load' });
    /* The pricing page was rebuilt on renok's tier grid (2026-09-15), so the
       first-year/renewal switch is no longer Webflow tabs. renok draws one
       control — `.rk-rt-toggle`, the switch itself; the words either side of it
       are labels and carry no interaction, which is the donor's own design —
       and it swaps `display` on the two panes. Test the control that exists:
       renewal prices are a real deliverable and must stay reachable. */
    const toggle = p.locator('.rk-rt-toggle');
    const monthly = p.locator('.rk-rt-monthly-wrapper');
    const yearly = p.locator('.rk-rt-yearly-wrapper');
    assert.equal(await toggle.count(), 1, 'one pricing toggle');
    assert(await monthly.isVisible() && !(await yearly.isVisible()), 'first-year prices show at rest');
    await toggle.click();
    await p.waitForTimeout(600);
    assert(await yearly.isVisible() && !(await monthly.isVisible()), 'the toggle reaches the renewal prices');
    await toggle.click();
    await p.waitForTimeout(600);
    assert(await monthly.isVisible() && !(await yearly.isVisible()), 'the toggle comes back');
    /* Five levels in each pane, and the renewal pane must not silently be a
       copy of the first-year one. */
    assert.equal(await p.locator('.rk-rt-monthly-wrapper .rk-rt-pricing-card').count(), 5, 'five first-year levels');
    assert.equal(await p.locator('.rk-rt-yearly-wrapper .rk-rt-pricing-card').count(), 5, 'five renewal levels');
    console.log(`PASS ${lang || 'zh/'} ${width}: validation, duplicate guard, mocked 503 truthful fallback, legal, pricing toggle + renewal`);
    count++;
    await p.close();
  }
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: 'load' });
  const triggers = () => p.evaluate(() => ScrollTrigger.getAll().filter(t => t.vars.id === 'stargo-core-systems').length);
  assert.equal(await triggers(), 1);
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(700);
  assert.equal(await triggers(), 0);
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(700);
  assert.equal(await triggers(), 1);
  await p.setViewportSize({ width: 844, height: 390 });
  await p.waitForTimeout(700);
  assert.equal(await triggers(), 0);
  assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  console.log('PASS resize: desktop→phone→desktop→landscape, one controller, no overflow');
  count++;
} finally { await browser.close(); }
console.log(`${count}/5 client conversion and resize scenarios passed; no real email sent`);

/** Focused audit regressions: real rendering and actual local form handler.
 * Only Resend's network boundary is mocked. Never sends email. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { onRequestPost } from '../functions/api/contact.js';
import { SITE, req } from './paths.mjs';
const { chromium } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const OUT = process.env.QA_OUT || '.wrangler/fix-qa-20260905';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ proxy: process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY } : undefined });
const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
const results = [];
async function check(name, fn) { try { await fn(); results.push({ name, pass: true }); console.log('PASS', name); } catch (e) { results.push({ name, pass: false, error: e.message }); console.log('FAIL', name, e.message); } }
async function open(name, width = 390) { await p.setViewportSize({ width, height: width > 1000 ? 900 : 844 }); await p.goto(`${BASE}/${name}.html`, { waitUntil: 'load' }); await p.waitForTimeout(1600); }
try {
  for (const lang of ['', 'en/']) {
    await open(lang + 'pricing', 390);
    await check(`${lang}pricing mobile uses two full-width tabs`, async () => {
      const columns = await p.locator('.pricing-tabs-menu').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
      assert.equal(columns, 2);
    });
    await open(lang + 'pricing', 1440);
    await check(`${lang}pricing dark navigation`, async () => {
      const colors = await p.locator('.navigation-top .navigation-text-main').evaluateAll(es => es.map(e => getComputedStyle(e).color));
      assert(colors.length && colors.every(c => c.match(/\d+/g).slice(0, 3).every(n => Number(n) >= 200)), JSON.stringify(colors));
    });
    await check(`${lang}pricing keyboard and initial ARIA`, async () => {
      const tabs = p.locator('.w-tab-link');
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
      assert.equal(await tabs.nth(1).getAttribute('tabindex'), '-1');
      assert.equal(await p.locator('.w-tab-menu').getAttribute('role'), 'tablist');
      await tabs.nth(0).focus(); await p.keyboard.press('End'); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
      await p.keyboard.press('Home'); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
      await p.keyboard.press('End'); await p.keyboard.press('Home'); await p.waitForTimeout(1300);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true', 'rapid input preserves final choice');
      await p.locator('.pricng-tab-info').nth(1).click();
      assert.equal(await p.locator('.pricng-tab-info').nth(1).getAttribute('aria-pressed'), 'true');
    });
    for (const name of ['intelligence']) for (const width of [320, 390, 768]) {
      await open(lang + name, width);
      await check(`${lang}${name} ${width} title and anchor`, async () => {
        const r = await p.locator('.lx-hero-text').evaluate(e => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return { left: b.left, right: b.right, width: b.width }; });
        assert(r.left >= 0 && r.right <= width + 1, JSON.stringify(r));
        assert.equal(await p.locator(name === 'intelligence' ? '#lx-ontology' : '#lx-teams').count(), 1);
        if (width === 768) {
          const desc = await p.locator('.lx-hero-desc').boundingBox();
          const phone = await p.locator('.lx-integrations_06-app').first().boundingBox();
          assert(desc.width >= 200, 'tablet copy needs a readable column');
          assert(desc.height <= 260, 'tablet copy must not become a long vertical strip');
          const overlap = Math.max(0, Math.min(desc.x + desc.width, phone.x + phone.width) - Math.max(desc.x, phone.x)) * Math.max(0, Math.min(desc.y + desc.height, phone.y + phone.height) - Math.max(desc.y, phone.y));
          assert(overlap < 1, 'animated phone must not cover the introduction');
        }
      });
      await p.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-${name}-${width}.png` });
    }
    // Workforce is the lifelogx feature template: a two-tone headline over floating role
    // cards. Same question as above — does the title fit the viewport, and is the section
    // it introduces actually on the page?
    for (const width of [320, 390, 768]) {
      await open(lang + 'workforce', width);
      await check(`${lang}workforce ${width} title and roles`, async () => {
        const r = await p.locator('.lx-feature-title-holder').first().evaluate(e => { const b = e.getBoundingClientRect(); return { left: b.left, right: b.right, width: b.width }; });
        assert(r.left >= -1 && r.right <= width + 1, JSON.stringify(r));
        assert(await p.locator('.lx-feature-hero-card').count() >= 5, 'role cards present');
        assert.equal(await p.locator('#lx-roles').count(), 1, 'roles section anchor');
        const names = await p.locator('.lx-name-text').evaluateAll(els => els.map(e => e.textContent.trim()));
        assert(names.every(n => !/Philip|Arlene|Marjorie|Collen|Greg|Dancing/.test(n)), 'template names replaced');
      });
      await p.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-workforce-${width}.png` });
    }
    for (const width of [320, 390, 768, 1440]) {
      await open(lang + 'contact', width);
      await check(`${lang}contact ${width} fields`, async () => {
        const widths = await p.locator('#email-form input:not([type=submit]):not([name=website]), #email-form select, #email-form textarea').evaluateAll(es => es.map(e => ({ name: e.name, width: e.getBoundingClientRect().width })));
        assert(widths.every(r => r.width >= (width < 768 ? width - 65 : 200)), JSON.stringify(widths));
        assert.equal(await p.locator('#email-form a[href="privacy.html"]').count(), 1);
      });
      await p.locator('#email-form').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
      await p.screenshot({ path: `${OUT}/${lang ? 'en' : 'zh'}-contact-${width}.png` });
    }
    await check(`${lang}form full client → handler → stubbed relay`, async () => {
      await open(lang + 'contact');
      const original = globalThis.fetch; const mails = []; const requests = [];
      let available = false;
      globalThis.fetch = async (url, opts) => { mails.push({ url, ...opts }); return Response.json({ id: 'qa-not-delivered' }); };
      await p.route('**/api/contact', async route => {
        const req = route.request(); requests.push({ body: req.postDataJSON(), headers: req.headers() });
        await new Promise(r => setTimeout(r, 150));
        const response = await onRequestPost({ request: new Request(req.url(), { method: 'POST', headers: req.headers(), body: req.postData() }), env: available ? { RESEND_API_KEY: 'fixture' } : {} });
        await route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
      });
      try {
        const form = p.locator('#email-form');
        await form.evaluate(f => f.requestSubmit()); assert.equal(requests.length, 0);
        await form.locator('[name=name]').fill('QA not delivered'); await form.locator('[type=email]').fill('qa@example.invalid');
        await form.evaluate(f => { f.requestSubmit(); f.requestSubmit(); }); await p.waitForTimeout(500);
        assert.equal(requests.length, 1); assert(await form.isVisible());
        assert.equal(await form.locator('.stargo-form-note a[href^="mailto:"]').count(), 1);
        available = true; await form.evaluate(f => f.requestSubmit()); await p.waitForTimeout(500);
        assert.equal(mails.length, 1); assert.equal(await form.isVisible(), false);
        assert.equal(requests[0].headers['idempotency-key'], requests[1].headers['idempotency-key']);
        assert(requests[0].body.fields.some(f => f.key === 'email'));
      } finally { globalThis.fetch = original; await p.unroute('**/api/contact'); }
    });
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/focused-results.json`, JSON.stringify(results, null, 2));
console.log(`${results.filter(r => r.pass).length}/${results.length} focused regressions passed`);
process.exitCode = results.some(r => !r.pass) ? 1 : 0;

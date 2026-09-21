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
  /* Pricing: the price-period switch. These checks used to target Scalora's
     plan tabs (.w-tab-link / .pricing-tabs-menu / .pricng-tab-info), which the
     pricing rebuild (tools/blocks/rk-price-tiers.*) replaced with renok's
     first-year / renewal switch. They now ask the same questions of that
     switch: on a phone the two period tabs are on screen, big enough to tap and
     actually swap the price grid; on a desktop the tabs carry the tab roles and
     states, are reached with Tab, answer Home / End / arrows / Space, keep the
     last of several quick key presses, and follow a pointer click on the
     switch itself. The behaviour is tools/blocks/rk-price-tiers.js. */
  const PERIOD_TABS = '.rk-price-tiers [role="tablist"] [role="tab"]';
  const grids = () => p.evaluate(() => ['.rk-rt-monthly-wrapper', '.rk-rt-yearly-wrapper'].map((s) => getComputedStyle(document.querySelector(`.rk-price-tiers ${s}`)).display !== 'none'));
  for (const lang of ['', 'en/']) {
    await open(lang + 'pricing', 390);
    await check(`${lang}pricing mobile period tabs`, async () => {
      const tabs = p.locator(PERIOD_TABS);
      assert.equal(await tabs.count(), 2);
      await tabs.nth(0).scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
      // on screen, and a 24px-tall target: a tap 11.5px above or below the label's middle still lands on it
      const targets = await tabs.evaluateAll((es) => es.map((e) => {
        const b = e.getBoundingClientRect(); const x = b.left + b.width / 2; const y = b.top + b.height / 2;
        const hits = [-11.5, 0, 11.5].map((dy) => e.contains(document.elementFromPoint(x, y + dy)));
        return { left: b.left, right: b.right, width: b.width, hits };
      }));
      for (const t of targets) assert(t.left >= 0 && t.right <= 390 && t.width >= 24 && t.hits.every(Boolean), `tab on screen and tappable: ${JSON.stringify(t)}`);
      assert.deepEqual(await grids(), [true, false], 'first-year prices shown first');
      await tabs.nth(1).click(); await p.waitForTimeout(700);
      assert.deepEqual(await grids(), [false, true], 'renewal tab shows the renewal prices');
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
      await tabs.nth(0).click(); await p.waitForTimeout(700);
      assert.deepEqual(await grids(), [true, false], 'first-year tab brings them back');
    });
    await open(lang + 'pricing', 1440);
    await check(`${lang}pricing dark navigation`, async () => {
      const colors = await p.locator('.navigation-top .navigation-text-main').evaluateAll(es => es.map(e => getComputedStyle(e).color));
      assert(colors.length && colors.every(c => c.match(/\d+/g).slice(0, 3).every(n => Number(n) >= 200)), JSON.stringify(colors));
    });
    await check(`${lang}pricing keyboard and initial ARIA`, async () => {
      const tabs = p.locator(PERIOD_TABS);
      assert.equal(await tabs.count(), 2);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
      assert.equal(await tabs.nth(0).getAttribute('tabindex'), '0');
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'false');
      assert.equal(await tabs.nth(1).getAttribute('tabindex'), '-1');
      const wiring = await tabs.evaluateAll((es) => es.map((t) => { const panel = document.getElementById(t.getAttribute('aria-controls')); return panel && panel.getAttribute('role') === 'tabpanel' && panel.getAttribute('aria-labelledby') === t.id; }));
      assert.deepEqual(wiring, [true, true], 'each tab controls a tabpanel labelled by it');
      assert(await p.locator('.rk-price-tiers [role="tablist"]').getAttribute('aria-label'), 'the tablist is named');
      // reachable with Tab: from the focusable element just before it
      await p.evaluate(() => {
        const all = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')].filter((e) => e.tabIndex >= 0 && !e.closest('[inert], [aria-hidden="true"]') && e.getClientRects().length);
        const first = document.querySelector('.rk-price-tiers [role="tab"]');
        const before = all.filter((e) => e.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING).pop();
        before.focus();
      });
      await p.keyboard.press('Tab');
      assert.equal(await p.evaluate(() => document.activeElement?.id), await tabs.nth(0).getAttribute('id'), 'Tab reaches the selected period tab');
      await p.keyboard.press('End'); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
      assert.equal(await p.evaluate(() => document.activeElement?.id), await tabs.nth(1).getAttribute('id'), 'focus follows the selection');
      assert.deepEqual(await grids(), [false, true]);
      await p.keyboard.press('Home'); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
      assert.deepEqual(await grids(), [true, false]);
      await p.keyboard.press('End'); await p.keyboard.press('Home'); await p.waitForTimeout(1300);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true', 'rapid input preserves final choice');
      assert.deepEqual(await grids(), [true, false], 'and the grid agrees');
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(650);
      assert.deepEqual(await grids(), [false, true], 'arrow keys move between the two periods');
      await tabs.nth(0).focus(); await p.keyboard.press('Space'); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true', 'Space selects the focused tab');
      await p.locator('.rk-price-tiers .rk-rt-toggle').click(); await p.waitForTimeout(650);
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true', 'a pointer click on the switch updates the tabs');
      assert.deepEqual(await grids(), [false, true]);
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
      /* The form is cinery's dark card (tools/blocks/cn-contact.*), which has
         its own 24px padding and 1px border inside the column; `width - 65`
         was written for Mono's bare white form and no longer describes a
         correct page (at 390 a card flush with the column leaves 324px). What
         is asserted now: every field spans the form; on phones the card spans
         the same column as the photo card above it (it used to sit 16px inside
         it), so the fields keep all but the page gutter and the card's own
         padding — at least `width - 70`; from 768 each field is at least 200px. */
      await check(`${lang}contact ${width} fields`, async () => {
        const m = await p.evaluate(() => {
          const form = document.querySelector('form[data-stargo-form="contact"]');
          const box = (e) => e.getBoundingClientRect();
          return {
            form: box(form).width,
            card: box(form.closest('.cn-contact-form-wrapper')),
            photo: box(document.querySelector('.testimonials-card')),
            fields: [...form.querySelectorAll('input:not([type=submit]):not([name=website]), select, textarea')].map((e) => ({ name: e.name, width: box(e).width })),
          };
        });
        assert.equal(m.fields.length, 10, 'ten fields');
        assert(m.fields.every((r) => r.width >= m.form - 1), `fields span the form: ${JSON.stringify(m)}`);
        if (width < 768) {
          assert(Math.abs(m.card.left - m.photo.left) <= 1 && Math.abs(m.card.right - m.photo.right) <= 1, `form card aligned with the photo card: ${JSON.stringify(m)}`);
          assert(m.fields.every((r) => r.width >= width - 70), JSON.stringify(m.fields));
        } else {
          assert(m.fields.every((r) => r.width >= 200), JSON.stringify(m.fields));
        }
        assert.equal(await p.locator('form[data-stargo-form="contact"] a[href="privacy.html"]').count(), 1);
      });
      await p.locator('form[data-stargo-form="contact"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
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
        const form = p.locator('form[data-stargo-form="contact"]');
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

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
    /* name + company + mobile / WeChat are the required three; the e-mail is optional (owner, 2026-10-10) */
    assert.deepEqual(await form.locator('[required]').evaluateAll(es => es.map(e => e.name)), ['name', 'company', 'phone'], 'exactly name, company and phone are required');
    await form.locator('[name="name"]').fill('STARGO browser QA — not delivered');
    await form.locator('[name="company"]').fill('QA Ltd');
    await form.evaluate(f => f.requestSubmit());
    assert.equal(requests, 0, 'name and company alone are not enough');
    assert.equal(await p.evaluate(() => document.activeElement.name), 'phone', 'focus goes to the field still missing');
    await form.locator('[name="phone"]').fill('wxid_qa_test');
    await form.evaluate(f => { f.requestSubmit(); f.requestSubmit(); });
    await p.waitForTimeout(800);
    assert.equal(requests, 1, 'duplicate submission blocked, and no e-mail was needed');
    assert.equal(await form.getAttribute('data-stargo-busy'), null, 'busy state cleared');
    assert(await form.isVisible(), 'unavailable service cannot show fake success');
    assert.match(await form.locator('.stargo-form-note').innerText(), /无法确认|couldn.t confirm/);
    assert.match(await form.locator('.stargo-form-note').innerText(), /505099021/, 'the fallback offers WeChat');
    assert.equal(await form.locator('.stargo-form-note a[href^="mailto:"]').count(), 1, 'explicit fallback link, never automatic app launch');
    assert.equal(await form.locator('.stargo-form-note a[href^="tel:"]').count(), 1, 'and a phone link');
    const legal = await p.locator('a').evaluateAll(as => as.filter(a => /Privacy|隐私|Terms|条款/.test(a.innerText)).map(a => a.getAttribute('href')));
    assert(legal.length > 0 && legal.every(h => /(?:privacy|terms)\.html/.test(h)));
    await p.goto(`${BASE}/${lang}pricing.html`, { waitUntil: 'load' });
    /* The pricing page since the OPEN WORK rebuild (2026-10-09; tools/ow-blocks/site-pages.mjs renderPricing): five
       plans at the owner's prices, one recommended, each with its renewal line and a button that names the plan for
       the contact form; the comparison chart of the same five levels; and the website-operations service package
       (owner, 2026-10-10), quoted on request, whose button names it too. The first-year/renewal toggle of the
       earlier template page is gone: renewal is stated on every card. */
    const PLANS = lang
      ? [['Standard', '¥10,000'], ['Launch', '¥20,000'], ['Growth', '¥30,000'], ['Global Acquisition', '¥40,000'], ['Enterprise', 'Custom']]
      : [['标准版', '¥10,000'], ['上线版', '¥20,000'], ['增长版', '¥30,000'], ['全球获客版', '¥40,000'], ['企业版', '定制']];
    const KEYS = ['standard', 'launch', 'growth', 'global', 'enterprise'];
    const tiers = await p.locator('.ow-tiers > li.ow-tier').evaluateAll((ls) => ls.map((l) => ({
      name: l.querySelector('.ow-tier-name h2').innerText.trim(), price: l.querySelector('.ow-tier-price strong').innerText.trim(),
      renew: (l.querySelector('.ow-tier-renew')?.innerText ?? '').trim(), cta: l.querySelector('.ow-tier-cta a')?.getAttribute('href'),
      pick: l.classList.contains('ow-tier--pick'), shown: l.getBoundingClientRect().height > 0,
    })));
    assert.deepEqual(tiers.map((x) => [x.name, x.price]), PLANS, 'five plans at the owner\'s prices');
    assert(tiers.every((x) => x.shown), 'every plan is on the page');
    assert(tiers.every((x) => x.renew.length > 6), 'every plan states its renewal');
    assert.deepEqual(tiers.map((x) => x.cta), KEYS.map((k) => `contact.html?plan=${k}`), 'each plan\'s button names it for the contact form');
    assert.deepEqual(tiers.map((x) => x.pick), [false, false, true, false, false], 'one recommended plan: Growth');
    const chart = await p.locator('table.ow-cmp').evaluate((t) => {
      const rows = [...t.querySelectorAll('tbody tr:not(.ow-cmp-group)')];
      return { heads: [...t.querySelectorAll('thead .ow-cmp-name')].map((e) => e.innerText.trim()), rows: rows.length, cells: rows.every((r) => r.querySelectorAll('td').length === 5) };
    });
    assert.deepEqual(chart.heads, PLANS.map((x) => x[0]), 'the comparison chart compares the five plans');
    assert(chart.rows >= 8 && chart.cells, `the chart has its rows, five cells each (${chart.rows})`);
    const service = await p.locator('#service-website').evaluate((e) => ({ text: e.innerText, cta: e.querySelector('a')?.getAttribute('href') }));
    assert.match(service.text, lang ? /Website operations/ : /网站运营管理/, 'the service package');
    assert.match(service.text, lang ? /Quoted on request/ : /按需报价/, 'quoted on request, no invented price');
    assert.equal(service.cta, 'contact.html?plan=site-ops', 'its button names it for the contact form');
    /* the round trip: the contact form's plan select shows what the button named, whole, on this screen */
    for (const [key, word] of [['global', '¥40,000'], ['site-ops', lang ? 'on request' : '按需报价']]) {
      await p.goto(`${BASE}/${lang}contact.html?plan=${key}`, { waitUntil: 'load' });
      const sel = await p.locator('#contact-plan').evaluate((s) => {
        const cs = getComputedStyle(s);
        const c = document.createElement('canvas').getContext('2d');
        c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const room = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + 1;
        return { value: s.value, text: s.options[s.selectedIndex].text, cut: [...s.options].map((o) => o.text).filter((x) => c.measureText(x).width > room) };
      });
      assert.equal(sel.value, key, `?plan=${key} preselects the plan`);
      assert(sel.text.includes(word), `the plan select names it: ${sel.text}`);
      assert.deepEqual(sel.cut, [], `no plan is cut off in the select at ${width}px`);
    }
    console.log(`PASS ${lang || 'zh/'} ${width}: validation, duplicate guard, mocked 503 truthful fallback, legal, five plans + renewal + chart + service package, ?plan= round trip`);
    count++;
    await p.close();
  }
  /* Resizing the homepage across the phone width: the demo video's box follows its cut (16:10 desktop film, 3:5 phone
     cut on a phone held upright, 16:10 again on a small phone turned sideways), nothing overflows sideways, no script
     error. */
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(`${BASE}/`, { waitUntil: 'load' });
  for (const [w, h, ratio] of [[1440, 900, 1.6], [390, 844, 0.6], [1440, 900, 1.6], [844, 390, 1.6], [390, 844, 0.6], [568, 320, 1.6]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(700);
    const b = await p.evaluate(() => { const r = document.querySelector('video[data-ow-demo]').getBoundingClientRect(); return { ratio: r.width / r.height, overflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
    assert(Math.abs(b.ratio - ratio) < 0.02, `${w}×${h}: the demo video box is ${b.ratio.toFixed(3)}, not ${ratio}`);
    assert(!b.overflow, `${w}×${h}: sideways overflow`);
  }
  assert.deepEqual(errors, []);
  console.log('PASS resize: desktop→phone→desktop→landscape→phone→small landscape phone, the demo video box follows its cut, no overflow, no script error');
  count++;
} finally { await browser.close(); }
console.log(`${count}/5 client conversion and resize scenarios passed; no real email sent`);

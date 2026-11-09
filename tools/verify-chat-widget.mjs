/**
 * js/stargo-chat.js in a real browser. Chatwoot is stubbed: every request to
 * its host is answered here and never leaves the machine.
 *   npm run verify:chat   (serves the repository itself; BASE_URL to reuse a server)
 * The scenarios serve the committed file with its token swapped: empty for the
 * inert case, a fixture for the configured case. One scenario loads it unchanged.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { SITE } from './paths.mjs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const CHAT_ORIGIN = 'https://chat.stargogrowth.com';
const TOKEN = 'fixture-website-token';
const source = readFileSync(`${SITE}/js/stargo-chat.js`, 'utf8');
const SETTING = /var WEBSITE_TOKEN = '[^']*';/;
assert.match(source, SETTING, 'the script keeps its one setting on one line');
const inert = source.replace(SETTING, "var WEBSITE_TOKEN = '';");
const configured = source.replace(SETTING, `var WEBSITE_TOKEN = '${TOKEN}';`);

const SDK_OK = `window.chatwootSDK = { run: function (o) { window.__run = o; window.__runs = (window.__runs || 0) + 1;
  window.$chatwoot = { toggle: function (s) { window.__toggled = s; } }; window.dispatchEvent(new Event('chatwoot:ready')); } };`;

const browser = await chromium.launch();
async function scenario(path, { script, sdk, width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const chatRequests = [];
  await page.route(`${CHAT_ORIGIN}/**`, (route) => {
    chatRequests.push(route.request().url());
    return sdk ? sdk(route) : route.fulfill({ status: 200, contentType: 'text/javascript', body: SDK_OK });
  });
  if (script) await page.route('**/js/stargo-chat.js*', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: script }));
  await page.goto(`${BASE}/${path}`, { waitUntil: 'load' });
  return { ctx, page, chatRequests };
}
const LAUNCHER = '.stargo-chat-launcher';
let checks = 0;
const ok = (fn, label) => { fn(); checks += 1; console.log(`  ok  ${label}`); };

try {
  for (const path of ['index.html', 'en/index.html', 'contact.html', 'en/contact.html', 'en/404.html']) {
    const { ctx, page, chatRequests } = await scenario(path, { script: inert });
    await page.waitForTimeout(300);
    const loaded = await page.evaluate(() => [...document.scripts].some((s) => /js\/stargo-chat\.js\?v=[0-9a-f]{16}$/.test(s.src)));
    const state = await page.evaluate(() => ({ launcher: !!document.querySelector('.stargo-chat-launcher'), settings: window.chatwootSettings, guard: window.__stargoChat }));
    const cookies = await ctx.cookies();
    ok(() => {
      assert.equal(loaded, true, 'the page loads the versioned script');
      assert.deepEqual(state, { launcher: false, settings: undefined, guard: undefined });
      assert.deepEqual(chatRequests, []); assert.deepEqual(cookies, []);
    }, `${path}: inert with the empty token`);
    await ctx.close();
  }

  {
    // The file as committed: with its real token, still nothing reaches Chatwoot until the visitor presses the button.
    const { ctx, page, chatRequests } = await scenario('contact.html');
    await page.waitForSelector(LAUNCHER);
    await page.waitForTimeout(300);
    const cookies = await ctx.cookies();
    ok(() => { assert.deepEqual(chatRequests, []); assert.deepEqual(cookies, []); }, 'contact.html: the committed file requests nothing and sets no cookie on load');
    await ctx.close();
  }

  for (const [path, label, locale] of [['contact.html', '在线咨询', 'zh_CN'], ['en/contact.html', 'Chat with us', 'en']]) {
    const { ctx, page, chatRequests } = await scenario(path, { script: configured });
    await page.waitForSelector(LAUNCHER);
    await page.waitForTimeout(300);
    ok(() => assert.deepEqual(chatRequests, []), `${path}: nothing requested from Chatwoot before the visitor opens it`);
    assert.deepEqual(await ctx.cookies(), []);
    assert.equal(await page.evaluate(() => window.chatwootSettings), undefined);
    assert.equal((await page.textContent(LAUNCHER)).trim(), label);
    await page.click(LAUNCHER);
    await page.waitForFunction(() => window.__toggled === 'open');
    const run = await page.evaluate(() => ({ run: window.__run, runs: window.__runs, settings: window.chatwootSettings }));
    ok(() => {
      assert.deepEqual(run.run, { websiteToken: TOKEN, baseUrl: CHAT_ORIGIN }); assert.equal(run.runs, 1);
      assert.equal(run.settings.locale, locale);
      assert.deepEqual(chatRequests, [`${CHAT_ORIGIN}/packs/js/sdk.js`]);
    }, `${path}: first press loads the SDK once and opens the window`);
    assert.equal(await page.locator(LAUNCHER).count(), 0, 'our button gives way to the real widget');
    await ctx.close();
  }

  {
    let fail = true;
    const { ctx, page, chatRequests } = await scenario('en/contact.html', {
      script: configured,
      sdk: (route) => (fail ? route.abort() : route.fulfill({ status: 200, contentType: 'text/javascript', body: SDK_OK })),
    });
    await page.waitForSelector(LAUNCHER);
    await page.click(LAUNCHER);
    await page.waitForFunction(() => document.querySelector('.stargo-chat-launcher span').textContent.includes('Try again'));
    ok(() => assert.equal(chatRequests.length, 1), 'a blocked SDK leaves a retry button');
    fail = false;
    await page.click(LAUNCHER);
    await page.waitForFunction(() => window.__toggled === 'open');
    ok(() => assert.equal(chatRequests.length, 2), 'the retry fetches the SDK again and opens the window');
    await ctx.close();
  }

  for (const [path, width, height] of [['contact.html', 390, 844], ['en/index.html', 1440, 900]]) {
    const { ctx, page } = await scenario(path, { script: configured, width, height });
    await page.waitForSelector(LAUNCHER);
    const box = await page.locator(LAUNCHER).boundingBox();
    const hit = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.stargo-chat-launcher'), [box.x + box.width / 2, box.y + box.height / 2]);
    ok(() => {
      assert.ok(box.height >= 44, 'a 44px target');
      assert.ok(box.x >= 0 && box.x + box.width <= width && box.y + box.height <= height, 'inside the viewport');
      assert.equal(hit, true, 'nothing covers it');
    }, `${path} at ${width}px: launcher is on screen and reachable`);
    if (process.env.CHAT_SHOTS) await page.screenshot({ path: `${process.env.CHAT_SHOTS}/chat-${width}.png` });
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`PASS: ${checks} chat widget checks`);

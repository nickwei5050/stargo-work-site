/** functions/_middleware.js: only stargo.pages.dev is sent to stargowork.com (Z17).
 * Run: node --test tools/verify-host-redirect.mjs */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequest, canonicalLocation } from '../functions/_middleware.js';

const run = async (url, method = 'GET') => {
  let passed = false;
  const r = await onRequest({ request: new Request(url, { method, ...(method === 'POST' ? { body: '{}' } : {}) }), next: async () => { passed = true; return new Response('page'); } });
  return { r, passed };
};

test('the retired host redirects, one hop, to the clean URL', async () => {
  for (const [from, to] of [
    ['https://stargo.pages.dev/', 'https://stargowork.com/'],
    ['https://stargo.pages.dev/pricing', 'https://stargowork.com/pricing'],
    ['https://stargo.pages.dev/pricing.html', 'https://stargowork.com/pricing'],
    ['https://stargo.pages.dev/index.html', 'https://stargowork.com/'],
    ['https://stargo.pages.dev/en/index.html', 'https://stargowork.com/en/'],
    ['https://stargo.pages.dev/en/blog/from-inquiry-to-quote.html?x=1#a', 'https://stargowork.com/en/blog/from-inquiry-to-quote?x=1'],
    ['https://STARGO.pages.dev/contact?plan=growth', 'https://stargowork.com/contact?plan=growth'],
  ]) {
    const { r, passed } = await run(from);
    assert.equal(r.status, 301, from);
    assert.equal(r.headers.get('location'), to, from);
    assert.equal(passed, false);
  }
  assert.equal((await run('https://stargo.pages.dev/about', 'HEAD')).r.status, 301);
});

test('every other host, the API and non-GET requests are served as before', async () => {
  for (const url of [
    'https://stargowork.com/pricing',
    'https://www.stargowork.com/',
    'https://preview.stargowork.pages.dev/pricing',
    'https://preview.stargo.pages.dev/pricing',
    'https://3f2a9c1b.stargo.pages.dev/',
    'https://stargo.pages.dev.example.com/',
    'http://127.0.0.1:8788/',
    'https://stargo.pages.dev/api/contact',
  ]) {
    const { r, passed } = await run(url);
    assert.equal(passed, true, url);
    assert.equal(r.status, 200, url);
  }
  assert.equal((await run('https://stargo.pages.dev/api/contact', 'POST')).passed, true);
  assert.equal((await run('https://stargo.pages.dev/pricing', 'POST')).passed, true);
  assert.equal(canonicalLocation('https://stargowork.com/'), null);
});

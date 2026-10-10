/** Real handler, only the external mail transport is stubbed. No email is sent. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequestPost, onRequestGet } from '../functions/api/contact.js';
const valid = () => ({ form: 'contact', lang: 'en', page: 'https://stargo.pages.dev/contact', fields: [
  { key: 'name', label: 'Name', value: 'QA' }, { key: 'email', label: 'Email', value: 'qa@example.invalid' },
] });
const calls = [];
const key = '590814d0-c71d-4d48-bcb8-11480c5c8158';
async function send(data, { env = { RESEND_API_KEY: 'fixture-not-a-key' }, origin, id = key, body } = {}) {
  return onRequestPost({ env, request: new Request('https://stargo.pages.dev/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', 'Idempotency-Key': id, ...(origin ? { origin } : {}) }, body: body ?? JSON.stringify(data),
  }) });
}
const transport = async (url, opts) => { calls.push({ url, ...opts }); return Response.json({ id: 'fixture-mail' }); };
test('contact handler regression', async t => {
  const original = globalThis.fetch;
  globalThis.fetch = transport;
  try {
    for (const [label, run] of [
      ['valid contact relays only to configured server recipient', async () => { const r = await send(valid()); assert.equal(r.status, 200); assert.deepEqual(JSON.parse(calls.at(-1).body).to, ['sales@stargomoto.com']); }],
      ['null JSON is a controlled bad request', async () => assert.equal((await send(null)).status, 400)],
      ['scalar JSON is rejected', async () => assert.equal((await send('hello')).status, 400)],
      ['malformed JSON is rejected', async () => assert.equal((await send(null, { body: '{' })).status, 400)],
      ['name cannot impersonate missing email', async () => { const d = valid(); d.fields = [{ label: 'Name', value: 'qa@example.invalid' }]; assert.equal((await send(d)).status, 422); }],
      ['message cannot impersonate invalid email', async () => { const d = valid(); d.fields[1].value = 'bad'; d.fields.push({ label: 'Message', value: 'qa@example.invalid' }); assert.equal((await send(d)).status, 422); }],
      ['unknown form type is rejected', async () => { const d = valid(); d.form = 'anything'; assert.equal((await send(d)).status, 400); }],
      ['cross-origin submission is rejected', async () => assert.equal((await send(valid(), { origin: 'https://untrusted.invalid' })).status, 403)],
      ['same-origin submission remains usable', async () => assert.equal((await send(valid(), { origin: 'https://stargo.pages.dev' })).status, 200)],
      ['missing mail configuration is never success', async () => { const n = calls.length; assert.equal((await send(valid(), { env: {} })).status, 503); assert.equal(calls.length, n); }],
      ['honeypot never contacts mail service', async () => { const d = valid(); d.website = 'spam'; const n = calls.length; assert.equal((await send(d)).status, 200); assert.equal(calls.length, n); }],
      ['5000-character textarea is delivered intact', async () => { const d = valid(); d.fields.push({ label: 'Message', value: 'x'.repeat(5000) }); assert.equal((await send(d)).status, 200); assert(JSON.parse(calls.at(-1).body).text.includes('x'.repeat(5000))); }],
      ['oversized field is rejected, never silently truncated', async () => { const d = valid(); d.fields.push({ label: 'Message', value: 'x'.repeat(5001) }); assert.equal((await send(d)).status, 422); }],
      ['oversized body is rejected', async () => assert.equal((await send(null, { body: JSON.stringify({ padding: 'x'.repeat(70000) }) })).status, 413)],
      ['raw field count is bounded including empty fields', async () => { const d = valid(); d.fields.push(...Array.from({ length: 40 }, () => ({ label: 'x', value: '' }))); assert.equal((await send(d)).status, 422); }],
      ['object field values are rejected', async () => { const d = valid(); d.fields.push({ label: 'Message', value: { arbitrary: 'object' } }); assert.equal((await send(d)).status, 422); }],
      ['legacy Chinese labels still work', async () => { const d = valid(); d.fields = [{ label: '姓名*', value: '测试' }, { label: '邮箱*', value: 'qa@example.invalid' }]; assert.equal((await send(d)).status, 200); }],
      ['newsletter needs email but not name', async () => { const d = valid(); d.form = 'newsletter'; d.fields.shift(); assert.equal((await send(d)).status, 200); }],
      ['transport failure is controlled', async () => { globalThis.fetch = async () => { throw new TypeError('network failure'); }; try { assert.equal((await send(valid())).status, 502); } finally { globalThis.fetch = transport; } }],
      ['provider rejection is not success', async () => { globalThis.fetch = async () => Response.json({ message: 'unavailable' }, { status: 500 }); try { assert.equal((await send(valid())).status, 502); } finally { globalThis.fetch = transport; } }],
      ['retries forward the same provider key and identical mail payload', async () => { await send(valid()); const first = calls.at(-1); await new Promise(r => setTimeout(r, 5)); await send(valid()); const last = calls.at(-1); assert.equal(first.headers['Idempotency-Key'], key); assert.equal(last.headers['Idempotency-Key'], key); assert.equal(last.body, first.body); }],
      ['GET cannot submit', async () => assert.equal(onRequestGet().status, 405)],
    ]) await t.test(label, run);
  } finally { globalThis.fetch = original; }
});

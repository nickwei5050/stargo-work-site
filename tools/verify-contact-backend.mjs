/** Real handler, only the external mail transport is stubbed. No email is sent.
 *
 * Contract under test (owner, 2026-10-10): the demo-request form needs a name, a
 * company and a phone number or WeChat ID; the e-mail is optional but must be
 * valid when given; the newsletter still needs only an e-mail. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { onRequestPost, onRequestGet } from '../functions/api/contact.js';
import { CONTACT_INFO } from './copy.mjs';
import { SITE } from './paths.mjs';
const field = (key, label, value) => ({ key, label, value });
const valid = () => ({ form: 'contact', lang: 'en', page: 'https://stargo.pages.dev/contact', fields: [
  field('name', 'Name', 'QA'), field('company', 'Company', 'QA Ltd'), field('phone', 'Mobile / WeChat', '+86 187 7512 7878'), field('email', 'Email', 'qa@example.invalid'),
] });
/** valid() with one kind of field taken out, replaced, or both */
const without = (...keys) => { const d = valid(); d.fields = d.fields.filter(f => !keys.includes(f.key)); return d; };
const withValue = (key, value) => { const d = valid(); d.fields.find(f => f.key === key).value = value; return d; };
const calls = [];
const key = '590814d0-c71d-4d48-bcb8-11480c5c8158';
async function send(data, { env = { RESEND_API_KEY: 'fixture-not-a-key' }, origin, id = key, body, headers = {} } = {}) {
  return onRequestPost({ env, request: new Request('https://stargo.pages.dev/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', 'Idempotency-Key': id, ...(origin ? { origin } : {}), ...headers }, body: body ?? JSON.stringify(data),
  }) });
}
const sent = () => JSON.parse(calls.at(-1).body);
/* What a built page's form posts without the script: every named control in
   page order, hidden inputs with their own values (the form kind), the
   honeypot empty, the visible fields filled in as a visitor would. */
const FILL = { name: 'QA', company: 'QA Ltd', phone: '18775127878', email: '', plan: 'growth', focus: '', message: 'hello', website: '', Subscribe: 'qa@example.invalid' };
function builtPost(page, kind) {
  const html = readFileSync(`${SITE}/${page}`, 'utf8');
  const form = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map(m => m[0]).find(f => new RegExp(`<form\\b[^>]*\\sdata-stargo-form="${kind}"`).test(f));
  assert(form, `${page}: no ${kind} form`);
  const body = new URLSearchParams();
  for (const [, tag, attrs] of form.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const name = /\sname="([^"]*)"/.exec(attrs)?.[1];
    const type = /\stype="([^"]*)"/.exec(attrs)?.[1] ?? tag;
    if (!name || type === 'submit') continue;
    if (type === 'hidden') { body.append(name, /\svalue="([^"]*)"/.exec(attrs)?.[1] ?? ''); continue; }
    assert(name in FILL, `${page}: the ${kind} form has a field this test does not know: ${name}`);
    body.append(name, FILL[name]);
  }
  return body;
}
const transport = async (url, opts) => { calls.push({ url, ...opts }); return Response.json({ id: 'fixture-mail' }); };
/** 422 and which kinds the endpoint names */
const refused = async (data, kinds, opts) => { const r = await send(data, opts); assert.equal(r.status, 422); if (kinds) assert.deepEqual((await r.json()).fields, kinds); };
test('contact handler regression', async t => {
  const original = globalThis.fetch;
  globalThis.fetch = transport;
  try {
    for (const [label, run] of [
      ['valid contact relays only to configured server recipient', async () => { const r = await send(valid()); assert.equal(r.status, 200); assert.deepEqual(sent().to, ['sales@stargomoto.com']); }],
      ['subject names the inquiry: name and company', async () => { await send(valid()); assert.equal(sent().subject, '[STARGO WORK] Inquiry · QA · QA Ltd'); }],
      ['reply_to is the visitor e-mail when one is given', async () => { await send(valid()); assert.equal(sent().reply_to, 'qa@example.invalid'); }],
      ['every field reaches the mail text, labelled as the form labelled it', async () => { await send(valid()); const text = sent().text; for (const line of ['Name: QA', 'Company: QA Ltd', 'Mobile / WeChat: +86 187 7512 7878', 'Email: qa@example.invalid']) assert(text.includes(line), line); }],
      ['null JSON is a controlled bad request', async () => assert.equal((await send(null)).status, 400)],
      ['scalar JSON is rejected', async () => assert.equal((await send('hello')).status, 400)],
      ['malformed JSON is rejected', async () => assert.equal((await send(null, { body: '{' })).status, 400)],
      ['unknown form type is rejected', async () => { const d = valid(); d.form = 'anything'; assert.equal((await send(d)).status, 400); }],
      ['cross-origin submission is rejected', async () => assert.equal((await send(valid(), { origin: 'https://untrusted.invalid' })).status, 403)],
      ['same-origin submission remains usable', async () => assert.equal((await send(valid(), { origin: 'https://stargo.pages.dev' })).status, 200)],
      ['missing mail configuration is never success', async () => { const n = calls.length; assert.equal((await send(valid(), { env: {} })).status, 503); assert.equal(calls.length, n); }],
      ['an invalid form is refused before the mail configuration is looked at', async () => { const n = calls.length; assert.equal((await send(without('phone'), { env: {} })).status, 422); assert.equal(calls.length, n); }],
      ['honeypot never contacts mail service', async () => { const d = valid(); d.website = 'spam'; const n = calls.length; assert.equal((await send(d)).status, 200); assert.equal(calls.length, n); }],

      // --- the three required fields
      ['missing phone is refused', async () => refused(without('phone'), ['phone'])],
      ['blank phone is refused', async () => refused(withValue('phone', '   '), ['phone'])],
      ['missing company is refused', async () => refused(without('company'), ['company'])],
      ['blank company is refused', async () => refused(withValue('company', ' '), ['company'])],
      ['missing name is refused', async () => refused(without('name'), ['name'])],
      ['nothing but an e-mail is refused: the e-mail no longer carries the form', async () => { const d = valid(); d.fields = [field('email', 'Email', 'qa@example.invalid')]; await refused(d, ['name', 'company', 'phone']); }],
      ['every failing kind is named at once', async () => { const d = withValue('email', 'bad'); d.fields = d.fields.filter(f => f.key !== 'phone'); await refused(d, ['email', 'phone']); }],
      ['two names are ambiguous and refused', async () => { const d = valid(); d.fields.push(field('name', 'Name', 'Someone else')); await refused(d, ['name']); }],
      ['two companies are ambiguous and refused', async () => { const d = valid(); d.fields.push(field('company', 'Company', 'Another Ltd')); await refused(d, ['company']); }],
      ['an over-long name or company is refused', async () => { await refused(withValue('name', 'x'.repeat(257)), ['name']); await refused(withValue('company', 'x'.repeat(257)), ['company']); }],

      // --- the phone / WeChat value: 5-64 characters with a letter or five digits
      ['a phone number is accepted in the usual shapes', async () => { for (const v of ['+86 187 7512 7878', '18775127878', '(021) 5555-0100', '+1 415 555 0100']) assert.equal((await send(withValue('phone', v))).status, 200, v); }],
      ['a WeChat ID is accepted', async () => { for (const v of ['505099021', 'wxid_a1b2c3', 'stargo-work', '微信同手机号']) assert.equal((await send(withValue('phone', v))).status, 200, v); }],
      ['obvious junk is refused as a phone / WeChat value', async () => { for (const v of ['1234', 'ab', '-----', '!!!!!!', '12 34', '1-2-3-4']) await refused(withValue('phone', v), ['phone']); }],
      ['phone length is bounded at 64', async () => { assert.equal((await send(withValue('phone', 'a'.repeat(64)))).status, 200); await refused(withValue('phone', 'a'.repeat(65)), ['phone']); }],
      ['a second phone-like field must be plausible too', async () => { const d = valid(); d.fields.push(field('whatsapp', 'WhatsApp', '12')); await refused(d, ['phone']); }],

      // --- the e-mail: optional, valid when given
      ['no e-mail field at all: accepted, and the mail has no reply_to', async () => { const r = await send(without('email')); assert.equal(r.status, 200); assert.equal('reply_to' in sent(), false); assert.equal(sent().subject, '[STARGO WORK] Inquiry · QA · QA Ltd'); }],
      ['an empty e-mail field is the same as none', async () => { const r = await send(withValue('email', '')); assert.equal(r.status, 200); assert.equal('reply_to' in sent(), false); }],
      ['a whitespace-only e-mail is the same as none', async () => { const r = await send(withValue('email', '   ')); assert.equal(r.status, 200); assert.equal('reply_to' in sent(), false); }],
      ['a bad optional e-mail is refused, not dropped', async () => { await refused(withValue('email', 'bad'), ['email']); await refused(withValue('email', 'a@b'), ['email']); await refused(withValue('email', 'two words@example.invalid'), ['email']); }],
      ['an over-long e-mail is refused', async () => refused(withValue('email', 'a'.repeat(250) + '@b.cd'), ['email'])],
      ['two e-mail values are ambiguous and refused', async () => { const d = valid(); d.fields.push(field('email', 'Email', 'other@example.invalid')); await refused(d, ['email']); }],
      ['name cannot impersonate a missing e-mail', async () => { const d = without('email'); d.fields.find(f => f.key === 'name').value = 'qa@example.invalid'; const r = await send(d); assert.equal(r.status, 200); assert.equal('reply_to' in sent(), false); }],
      ['message cannot impersonate an invalid e-mail', async () => { const d = withValue('email', 'bad'); d.fields.push({ label: 'Message', value: 'qa@example.invalid' }); await refused(d, ['email']); }],
      ['phone cannot impersonate an e-mail', async () => { const d = without('email'); d.fields.find(f => f.key === 'phone').value = 'qa@example.invalid'; const r = await send(d); assert.equal(r.status, 200); assert.equal('reply_to' in sent(), false); }],

      // --- injection and bounds that existed before and still hold
      ['line breaks in the name cannot split the subject', async () => { const d = withValue('name', 'QA\r\nBcc: someone@example.invalid'); d.fields.find(f => f.key === 'company').value = 'Co\nLtd'; assert.equal((await send(d)).status, 200); assert(!/[\r\n]/.test(sent().subject), sent().subject); }],
      ['5000-character textarea is delivered intact', async () => { const d = valid(); d.fields.push({ label: 'Message', value: 'x'.repeat(5000) }); assert.equal((await send(d)).status, 200); assert(sent().text.includes('x'.repeat(5000))); }],
      ['oversized field is rejected, never silently truncated', async () => { const d = valid(); d.fields.push({ label: 'Message', value: 'x'.repeat(5001) }); assert.equal((await send(d)).status, 422); }],
      ['oversized body is rejected', async () => assert.equal((await send(null, { body: JSON.stringify({ padding: 'x'.repeat(70000) }) })).status, 413)],
      ['raw field count is bounded including empty fields', async () => { const d = valid(); d.fields.push(...Array.from({ length: 40 }, () => ({ label: 'x', value: '' }))); assert.equal((await send(d)).status, 422); }],
      ['object field values are rejected', async () => { const d = valid(); d.fields.push({ label: 'Message', value: { arbitrary: 'object' } }); assert.equal((await send(d)).status, 422); }],

      // --- cached pages and no-script posts still land
      ['legacy Chinese labels still work', async () => { const d = valid(); d.fields = [{ label: '姓名*', value: '测试' }, { label: '公司', value: '测试公司' }, { label: '微信', value: 'wxid_test1' }, { label: '邮箱*', value: 'qa@example.invalid' }]; assert.equal((await send(d)).status, 200); assert.equal(sent().reply_to, 'qa@example.invalid'); assert.equal(sent().subject, '[STARGO WORK] Inquiry · 测试 · 测试公司'); }],
      ['the labels of the form as built map without keys', async () => { const d = valid(); d.fields = [{ label: '姓名 *', value: '测试' }, { label: '公司 *', value: '测试公司' }, { label: '手机 / 微信 *', value: '18775127878' }, { label: '邮箱（选填）', value: '' }]; assert.equal((await send(d)).status, 200); assert.equal('reply_to' in sent(), false); }],
      ['English labels without keys map too', async () => { const d = valid(); d.fields = [{ label: 'Name *', value: 'QA' }, { label: 'Company', value: 'QA Ltd' }, { label: 'Mobile / WeChat', value: 'wxid_test1' }, { label: 'Email (optional)', value: '' }]; assert.equal((await send(d)).status, 200); }],
      ['the previous page\'s joined phone label maps to phone', async () => { const d = valid(); d.fields = [field('name', 'Name *', 'QA'), field('Last-Name', '公司', 'QA Ltd'), field('phone', 'WhatsApp / 微信 / 电话', '18775127878'), field('email', '邮箱 *', 'qa@example.invalid')]; assert.equal((await send(d)).status, 200); }],
      ['the previous page without a phone field is refused, and says phone', async () => { const d = valid(); d.fields = [field('name', 'Name *', 'QA'), field('Last-Name', '公司', 'QA Ltd'), field('email', '邮箱 *', 'qa@example.invalid')]; await refused(d, ['phone']); }],
      ['a no-script post of the built demo forms works (contact page and homepage band, zh and en)', async () => {
        for (const page of ['contact.html', 'en/contact.html', 'index.html', 'en/index.html']) {
          const r = await send(null, { body: builtPost(page, 'contact'), headers: { 'content-type': 'application/x-www-form-urlencoded' } });
          assert.equal(r.status, 200, `${page}: HTTP ${r.status} ${JSON.stringify(await r.json())}`);
          assert.equal(sent().subject, '[STARGO WORK] Inquiry · QA · QA Ltd', page);
          if (page.endsWith('contact.html')) assert(sent().text.includes('plan: growth'), `${page}: the plan reaches the mail`);
          assert.equal('reply_to' in sent(), false, `${page}: no e-mail, no reply_to`);
        }
      }],
      ['a no-script post of the built newsletter form works', async () => { const r = await send(null, { body: builtPost('index.html', 'newsletter'), headers: { 'content-type': 'application/x-www-form-urlencoded' } }); assert.equal(r.status, 200); assert.equal(sent().subject, '[STARGO WORK] Newsletter request · qa@example.invalid'); }],
      ['a flat JSON object (no fields array) works too', async () => assert.equal((await send({ form: 'contact', name: 'QA', company: 'QA Ltd', phone: 'wxid_test1' })).status, 200)],

      // --- the newsletter still needs only an e-mail
      ['newsletter needs an e-mail but not a name, company or phone', async () => { const d = { form: 'newsletter', fields: [field('email', 'Email', 'qa@example.invalid')] }; assert.equal((await send(d)).status, 200); assert.equal(sent().subject, '[STARGO WORK] Newsletter request · qa@example.invalid'); assert.equal(sent().reply_to, 'qa@example.invalid'); }],
      ['newsletter without an e-mail is refused', async () => { await refused({ form: 'newsletter', fields: [field('name', 'Name', 'QA'), field('company', 'Company', 'QA Ltd'), field('phone', 'Phone', '18775127878')] }, ['email']); await refused({ form: 'newsletter', fields: [] }, ['email']); }],
      ['newsletter with an invalid or empty e-mail is refused', async () => { await refused({ form: 'newsletter', fields: [field('email', 'Email', 'bad')] }, ['email']); await refused({ form: 'newsletter', fields: [field('email', 'Email', '')] }, ['email']); }],
      ['newsletter with the template input name still works', async () => { const d = { form: 'newsletter', fields: [{ key: 'Subscribe', label: '邮箱', value: 'qa@example.invalid' }] }; assert.equal((await send(d)).status, 200); }],

      // --- delivery
      ['transport failure is controlled', async () => { globalThis.fetch = async () => { throw new TypeError('network failure'); }; try { assert.equal((await send(valid())).status, 502); } finally { globalThis.fetch = transport; } }],
      ['provider rejection is not success', async () => { globalThis.fetch = async () => Response.json({ message: 'unavailable' }, { status: 500 }); try { assert.equal((await send(valid())).status, 502); } finally { globalThis.fetch = transport; } }],
      ['retries forward the same provider key and identical mail payload', async () => { await send(valid()); const first = calls.at(-1); await new Promise(r => setTimeout(r, 5)); await send(valid()); const last = calls.at(-1); assert.equal(first.headers['Idempotency-Key'], key); assert.equal(last.headers['Idempotency-Key'], key); assert.equal(last.body, first.body); }],
      ['GET cannot submit', async () => assert.equal(onRequestGet().status, 405)],
    ]) await t.test(label, run);
  } finally { globalThis.fetch = original; }
});

/* js/stargo-forms.js is a static file, so the contact details in its fallback
   cannot be generated; this keeps them equal to the ones the pages print. */
test('the form script offers the same ways to reach us as the pages', () => {
  const js = readFileSync(`${SITE}/js/stargo-forms.js`, 'utf8');
  for (const v of [CONTACT_INFO.email, CONTACT_INFO.wechat, CONTACT_INFO.phone, CONTACT_INFO.phoneHref]) assert(js.includes(v), `js/stargo-forms.js does not carry ${v}`);
});

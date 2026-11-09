/** The Chatwoot half of POST /api/contact: real handler, every outside call stubbed. Nothing leaves this process. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequestPost } from '../functions/api/contact.js';

const TOKEN = 'fixture-website-token';
const AUTH = 'fixture-widget-auth';
const WIDGET_URL = `https://chat.stargogrowth.com/widget?website_token=${TOKEN}`;
const CONV_URL = `https://chat.stargogrowth.com/api/v1/widget/conversations?website_token=${TOKEN}`;
const KEY = '590814d0-c71d-4d48-bcb8-11480c5c8158';
const MAIL_OK = () => Response.json({ id: 'fixture-mail' });
const WIDGET_OK = () => new Response(`<script>window.chatwootPubsubToken = 'x'; window.authToken = '${AUTH}';</script>`, { status: 200, headers: { 'content-type': 'text/html' } });
const CONV_OK = () => Response.json({ id: 1 });

const zhForm = (message = '想把询盘和报价接起来\n第二行') => ({
  form: 'contact', lang: 'zh-CN', page: 'https://stargowork.com/contact?plan=growth', website: '',
  fields: [
    { key: 'plan', label: 'Plan', value: '增长版' },
    { key: 'name', label: '姓名*', value: '王小明' },
    { key: 'email', label: '邮箱*', value: 'wang@example.invalid' },
    { key: 'Subject', label: '公司', value: '柳州测试机械' },
    { key: 'whatsapp', label: 'WhatsApp', value: '+86 138-0013-8000' },
    { key: 'industry', label: '行业', value: '摩托车\n配件\t出口' },
    { key: 'markets', label: '目标市场', value: '东南亚' },
    { key: 'team', label: '团队规模', value: '11-50' },
    { key: 'systems', label: '现有系统', value: '金蝶' },
    { key: 'field', label: '希望 AI 先改善什么？', value: '报价与 PI' },
    ...(message ? [{ key: 'field-2', label: '你想让 AI 改善哪条流程？', value: message }] : []),
  ],
});
const enHome = () => ({
  form: 'contact', lang: 'en', page: 'https://stargowork.com/en/', website: '',
  fields: [
    { key: 'name', label: 'Name', value: 'Ann Lee' },
    { key: 'Last-Name', label: 'Company', value: 'Acme Ltd' },
    { key: 'email', label: 'Email', value: 'ann@example.invalid' },
  ],
});

/** Runs one submission to the end of its background work; returns everything that happened. */
async function run(data, { env: extra = {}, chat = {}, resend = MAIL_OK, waitUntil } = {}) {
  const calls = [], tasks = [], logged = [];
  const original = globalThis.fetch, err = console.error;
  console.error = (...a) => logged.push(a.map(String).join(' '));
  globalThis.fetch = async (url, opts = {}) => {
    calls.push({ url: String(url), ...opts });
    if (String(url).startsWith('https://api.resend.com')) return resend();
    if (String(url) === WIDGET_URL) return (chat.widget ?? WIDGET_OK)(opts);
    if (String(url) === CONV_URL) return (chat.conv ?? CONV_OK)(opts);
    throw new Error('unexpected request to ' + url);
  };
  try {
    const request = new Request('https://stargowork.com/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', 'Idempotency-Key': KEY }, body: JSON.stringify(data) });
    const res = await onRequestPost({ request, env: { RESEND_API_KEY: 'fixture-not-a-key', CHATWOOT_WEBSITE_TOKEN: TOKEN, ...extra }, waitUntil: waitUntil ?? (p => tasks.push(p)) });
    await Promise.all(tasks);
    return { res, status: res.status, body: await res.json(), calls, tasks, logged };
  } finally { globalThis.fetch = original; console.error = err; }
}
const chatwootCalls = r => r.calls.filter(c => c.url.startsWith('https://chat.stargogrowth.com'));
const conv = r => { const c = r.calls.find(x => x.url === CONV_URL); assert.ok(c, 'a conversation was opened'); return { call: c, body: JSON.parse(c.body) }; };
const assertClean = r => {
  const text = r.logged.join('\n');
  for (const secret of [TOKEN, AUTH, 'wang@example.invalid', '王小明', '柳州测试机械', 'ann@example.invalid', 'Ann Lee', 'Acme']) assert(!text.includes(secret), 'log leaked ' + secret);
};

test('inert when the token is unset', async t => {
  for (const [label, value] of [['missing', undefined], ['empty', ''], ['spaces', '   ']]) {
    await t.test(label, async () => {
      const r = await run(zhForm(), { env: { CHATWOOT_WEBSITE_TOKEN: value } });
      assert.equal(r.status, 200); assert.deepEqual(r.body, { ok: true });
      assert.equal(r.calls.length, 1); assert.equal(r.calls[0].url, 'https://api.resend.com/emails');
      assert.equal(r.tasks.length, 0, 'nothing was queued');
    });
  }
});

test('payload', async t => {
  await t.test('Chinese contact page, every field filed', async () => {
    const r = await run(zhForm());
    assert.equal(r.status, 200);
    const urls = r.calls.map(c => c.url);
    assert.deepEqual(urls, ['https://api.resend.com/emails', WIDGET_URL, CONV_URL], 'mail first, then widget, then conversation');
    const { call, body } = conv(r);
    assert.equal(call.method, 'POST'); assert.equal(call.headers['X-Auth-Token'], AUTH);
    const expected = { lead_type: 'contact_form', plan: '增长版', company: '柳州测试机械', whatsapp: '+86 138-0013-8000', industry: '摩托车 配件 出口', markets: '东南亚', team_size: '11-50', systems: '金蝶', improve_first: '报价与 PI' };
    assert.deepEqual(body.custom_attributes, expected);
    assert.deepEqual(body.contact, { name: '王小明', email: 'wang@example.invalid', phone_number: '+8613800138000', custom_attributes: expected });
    assert.equal(body.message.referer_url, 'https://stargowork.com/contact?plan=growth');
    assert.ok(!Number.isNaN(Date.parse(body.message.timestamp)));
    assert.equal(body.message.content, ['想把询盘和报价接起来', '第二行', '', '— 来自官网联系表单', 'Plan: 增长版', '姓名: 王小明', '邮箱: wang@example.invalid', '公司: 柳州测试机械', 'WhatsApp: +86 138-0013-8000', '行业: 摩托车 配件 出口', '目标市场: 东南亚', '团队规模: 11-50', '现有系统: 金蝶', '希望 AI 先改善什么？: 报价与 PI'].join('\n'));
  });
  await t.test('browser-style User-Agent on both Chatwoot requests', async () => {
    const r = await run(zhForm());
    assert.equal(chatwootCalls(r).length, 2);
    for (const c of chatwootCalls(r)) assert.match(c.headers['user-agent'], /^Mozilla\/5\.0 /);
  });
  await t.test('English homepage form: company is its own attribute, name stays the person', async () => {
    const { body } = conv(await run(enHome()));
    assert.equal(body.contact.name, 'Ann Lee'); assert.equal(body.custom_attributes.company, 'Acme Ltd');
    assert.equal(body.contact.phone_number, undefined);
    assert.equal(body.message.content, ['(no message)', '', '— From the website contact form', 'Name: Ann Lee', 'Company: Acme Ltd', 'Email: ann@example.invalid'].join('\n'));
  });
  await t.test('empty message in Chinese', async () => {
    const { body } = conv(await run(zhForm('')));
    assert.ok(body.message.content.startsWith('（没有填写留言）\n\n— 来自官网联系表单\n'));
  });
  await t.test('a [TEST Growth OS] prefix stays at the very start', async () => {
    const { body } = conv(await run(zhForm('[TEST Growth OS] 测试询盘')));
    assert.ok(body.message.content.startsWith('[TEST Growth OS] 测试询盘\n\n— 来自官网联系表单\n'));
  });
  await t.test('a posted field cannot overwrite lead_type', async () => {
    const d = enHome(); d.fields.push({ key: 'lead_type', label: 'x', value: 'spoofed' });
    assert.equal(conv(await run(d)).body.custom_attributes.lead_type, 'contact_form');
  });
  await t.test('single-line fields lose newlines, tabs and line separators', async () => {
    const d = enHome(); d.fields[1].value = 'Acme\r\nLtd\tGroup' + String.fromCodePoint(0x2028) + 'Two';
    const { body } = conv(await run(d));
    assert.equal(body.custom_attributes.company, 'Acme Ltd Group Two');
    assert.ok(body.message.content.includes('Company: Acme Ltd Group Two\n'));
  });
  await t.test('an unusable page address falls back to the site', async () => {
    const d = enHome(); d.page = 'javascript:alert(1)';
    assert.equal(conv(await run(d)).body.message.referer_url, 'https://stargowork.com/contact');
  });
  for (const [input, lang, want] of [
    ['+86 138 0013 8000', 'zh-CN', '+8613800138000'], ['0086 13800138000', 'en', '+8613800138000'], ['(+1) 415-555-2671', 'en', '+14155552671'],
    ['13800138000', 'zh-CN', '+8613800138000'], ['13105551234', 'en', undefined], ['wechat_id', 'zh-CN', undefined], ['12345', 'en', undefined], ['+0123456789', 'en', undefined], ['+1234567890123456', 'en', undefined],
  ]) await t.test(`phone_number for ${input} (${lang})`, async () => {
    const d = lang === 'en' ? enHome() : zhForm(); d.lang = lang;
    const wa = d.fields.find(f => f.key === 'whatsapp'); if (wa) wa.value = input; else d.fields.push({ key: 'whatsapp', label: 'WhatsApp', value: input });
    assert.equal(conv(await run(d)).body.contact.phone_number, want);
  });
});

test('a Chatwoot failure never touches the form answer', async t => {
  const cases = [
    ['/widget answers 500', { widget: () => new Response('nope', { status: 500 }) }, 'widget 500'],
    ['/widget answers an empty 204', { widget: () => new Response(null, { status: 204 }) }, 'no auth token'],
    ['/widget has no auth token', { widget: () => new Response('<html></html>') }, 'no auth token'],
    ['/widget is unreachable', { widget: () => { throw new TypeError('wang@example.invalid'); } }, 'widget TypeError'],
    ['conversation answers 422', { conv: () => Response.json({ error: 'wang@example.invalid' }, { status: 422 }) }, 'conversation 422'],
    ['conversation is unreachable', { conv: () => { throw new TypeError('network'); } }, 'conversation TypeError'],
  ];
  for (const [label, chat, expected] of cases) await t.test(label, async () => {
    const r = await run(zhForm(), { chat });
    assert.equal(r.status, 200); assert.deepEqual(r.body, { ok: true });
    assert.equal(r.logged.length, 1); assert.ok(r.logged[0].includes(expected), r.logged[0]);
    assertClean(r);
  });
  await t.test('a hung Chatwoot is cut off at the timeout', async () => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    try {
      const tasks = []; const seen = [];
      const original = globalThis.fetch, err = console.error;
      const logged = []; console.error = (...a) => logged.push(a.map(String).join(' '));
      globalThis.fetch = async (url, opts = {}) => {
        if (String(url).startsWith('https://api.resend.com')) return MAIL_OK();
        seen.push(String(url));
        return new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
      };
      try {
        const request = new Request('https://stargowork.com/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', 'Idempotency-Key': KEY }, body: JSON.stringify(zhForm()) });
        const res = await onRequestPost({ request, env: { RESEND_API_KEY: 'k', CHATWOOT_WEBSITE_TOKEN: TOKEN }, waitUntil: p => tasks.push(p) });
        assert.equal(res.status, 200, 'answered without waiting for Chatwoot');
        assert.equal(tasks.length, 1);
        t.mock.timers.tick(10000);
        await tasks[0];
        assert.deepEqual(seen, [WIDGET_URL]); assert.ok(logged[0].includes('widget timeout'), logged[0]);
      } finally { globalThis.fetch = original; console.error = err; }
    } finally { t.mock.timers.reset(); }
  });
  await t.test('waitUntil itself throwing changes nothing', async () => {
    const r = await run(zhForm(), { waitUntil: () => { throw new Error('boom'); } });
    assert.equal(r.status, 200); assert.deepEqual(r.body, { ok: true });
  });
});

test('no push when it must not push', async t => {
  await t.test('newsletter', async () => {
    const d = { form: 'newsletter', lang: 'en', page: 'https://stargowork.com/', website: '', fields: [{ key: 'email', label: 'Email', value: 'ann@example.invalid' }] };
    const r = await run(d);
    assert.equal(r.status, 200); assert.equal(chatwootCalls(r).length, 0); assert.equal(r.tasks.length, 0); assert.equal(r.calls.length, 1, 'the mail still goes');
  });
  await t.test('honeypot', async () => {
    const d = zhForm(); d.website = 'spam';
    const r = await run(d);
    assert.equal(r.status, 200); assert.equal(r.calls.length, 0); assert.equal(r.tasks.length, 0);
  });
  await t.test('invalid submission', async () => {
    const d = enHome(); d.fields[2].value = 'not-an-email';
    const r = await run(d);
    assert.equal(r.status, 422); assert.equal(r.calls.length, 0); assert.equal(r.tasks.length, 0);
  });
  await t.test('mail refused: the visitor is told so, and no conversation opens', async () => {
    const r = await run(zhForm(), { resend: () => Response.json({ name: 'x', message: 'y' }, { status: 500 }) });
    assert.equal(r.status, 502); assert.equal(chatwootCalls(r).length, 0); assert.equal(r.tasks.length, 0);
  });
  await t.test('mail not configured', async () => {
    const r = await run(zhForm(), { env: { RESEND_API_KEY: '' } });
    assert.equal(r.status, 503); assert.equal(chatwootCalls(r).length, 0); assert.equal(r.tasks.length, 0);
  });
});

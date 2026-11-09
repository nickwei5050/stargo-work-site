/** POST /api/contact — mail relay, not a CRM or newsletter audience manager.
 *
 * WHAT MUST BE CONFIGURED: one secret, RESEND_API_KEY, on the Cloudflare Pages
 * project (Settings → Variables and Secrets, type Secret), holding an API key
 * of the owner's Resend account.
 * Nothing else. Until it exists the endpoint answers 503 `not-configured` and
 * the page offers its e-mail link instead (js/stargo-forms.js).
 *
 * Defaults, each overridable by a variable of the same name:
 *   CONTACT_TO    sales@stargogrowth.com — the address customer replies use, the same one
 *                 tools/copy.mjs CONTACT_INFO.email prints on the site (a
 *                 Function cannot import tools/, so it is repeated here).
 *   CONTACT_FROM  Stargo Work <onboarding@resend.dev> — Resend's shared test
 *                 sender, which needs no domain but delivers ONLY to the
 *                 address that owns the Resend account; hence the account must
 *                 be opened with CONTACT_TO's address. Once a domain is
 *                 verified in Resend, set CONTACT_FROM to a sender on it (and
 *                 CONTACT_TO may then be any address).
 * The buyer's own address goes in reply_to, so answering the mail answers them.
 * Optional, off until set: CHATWOOT_WEBSITE_TOKEN, the website token of the
 * site's Chatwoot inbox (the same value as js/stargo-chat.js). With it, an
 * accepted contact-form submission also opens a conversation there.
 * No credentials go to the browser, and none are logged: a Resend refusal is
 * logged with its HTTP status and Resend's message only.
 * Provider idempotency handles retry deduplication across Worker instances.
 */
const DEFAULT_TO = 'sales@stargogrowth.com';
const DEFAULT_FROM = 'Stargo Work <onboarding@resend.dev>';
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const clean = v => v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim();
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_BODY = 65536;
const fieldKey = f => {
  // New clients send stable keys. Cached clients still use translated labels.
  const raw = (f.key ?? f.label).toLowerCase().replace(/[\s*：:._-]/g, '');
  if (/^(email|emailaddress|youremail|youremailaddress|subscribe|邮箱|电子邮箱|邮箱地址)$/.test(raw)) return 'email';
  if (/^(name|fullname|yourname|姓名|您的姓名)$/.test(raw)) return 'name';
  return raw;
};
async function boundedBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new RangeError('body-size');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new RangeError('body-size'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}
/* Chatwoot: an accepted contact-form submission also opens a conversation.
 * Off until CHATWOOT_WEBSITE_TOKEN is set. It runs after the mail was accepted,
 * in waitUntil, so it can neither change nor delay the visitor's answer. Logs
 * name the step and the HTTP status only, never the visitor or the token. */
const CHATWOOT_BASE = 'https://chat.stargogrowth.com';
// Chatwoot answers /widget with an empty 204 for crawler agents.
const CHATWOOT_UA = 'Mozilla/5.0 (compatible; StargoWorkSite/1.0)';
const CHATWOOT_TIMEOUT_MS = 10000;
// fieldKey() of each form control -> the attribute it is filed under. A fixed list, so a posted field cannot set lead_type.
const CHATWOOT_ATTRS = { company: 'company', subject: 'company', lastname: 'company', whatsapp: 'whatsapp', phone: 'phone', industry: 'industry', markets: 'markets', team: 'team_size', systems: 'systems', field: 'improve_first', plan: 'plan' };
const oneLine = v => v.replace(/[\s\p{Cc}]+/gu, ' ').trim();
function e164(raw, zh) {
  const digits = raw.replace(/[\s().-]/g, '');
  if (/^(?:\+|00)[1-9]\d{7,14}$/.test(digits)) return '+' + digits.replace(/^(?:\+|00)/, '');
  // A mainland mobile typed without its country code; only assumed on the Chinese pages.
  return zh && /^1[3-9]\d{9}$/.test(digits) ? '+86' + digits : '';
}
function chatwootLead(fields, lang, page, siteOrigin) {
  const zh = /^zh/i.test(lang || '');
  const attrs = { lead_type: 'contact_form' };
  const details = [];
  let message = '', name = '', email = '', phone = '';
  for (const f of fields) {
    const key = fieldKey(f);
    if ((key === 'field2' || key === 'message') && !message) { message = f.value.replace(/\r\n?/g, '\n'); continue; }
    const value = oneLine(f.value);
    if (!value) continue;
    details.push(oneLine(f.label).replace(/[*＊:：\s]+$/u, '') + ': ' + value);
    if (key === 'name') name ||= value;
    else if (key === 'email') email ||= value;
    else if (CHATWOOT_ATTRS[key] && !attrs[CHATWOOT_ATTRS[key]]) attrs[CHATWOOT_ATTRS[key]] = value;
    if ((key === 'whatsapp' || key === 'phone') && !phone) phone = e164(value, zh);
  }
  let referer = siteOrigin + '/contact';
  try { const u = new URL(page); if (u.protocol === 'https:' || u.protocol === 'http:') referer = u.href; } catch { /* keep the site's own address */ }
  return {
    contact: { name: name.slice(0, 255), email, ...(phone ? { phone_number: phone } : {}), custom_attributes: attrs },
    message: {
      content: [message || (zh ? '（没有填写留言）' : '(no message)'), '', zh ? '— 来自官网联系表单' : '— From the website contact form', ...details].join('\n'),
      timestamp: new Date().toUTCString(),
      referer_url: referer,
    },
    custom_attributes: attrs,
  };
}
async function pushChatwoot(token, lead) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CHATWOOT_TIMEOUT_MS);
  const query = '?website_token=' + encodeURIComponent(token);
  let step = 'widget';
  try {
    const page = await fetch(CHATWOOT_BASE + '/widget' + query, { signal: ctrl.signal, headers: { 'user-agent': CHATWOOT_UA, accept: 'text/html' } });
    if (!page.ok) { await page.body?.cancel(); console.error('contact: Chatwoot push failed', step, page.status); return; }
    const auth = (await page.text()).match(/window\.authToken\s*=\s*'([^']+)'/);
    if (!auth) { console.error('contact: Chatwoot push failed', step, 'no auth token in page'); return; }
    step = 'conversation';
    const res = await fetch(CHATWOOT_BASE + '/api/v1/widget/conversations' + query, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'user-agent': CHATWOOT_UA, 'content-type': 'application/json', accept: 'application/json', 'X-Auth-Token': auth[1] },
      body: JSON.stringify(lead),
    });
    await res.body?.cancel();
    if (!res.ok) console.error('contact: Chatwoot push failed', step, res.status);
  } catch (e) {
    console.error('contact: Chatwoot push failed', step, ctrl.signal.aborted ? 'timeout' : (e?.name || 'error'));
  } finally { clearTimeout(timer); }
}
/* Never throws: it runs inside the handler's try block, after the mail was accepted. */
function queueChatwoot(context, token, fields, lang, page, siteOrigin) {
  try {
    const task = pushChatwoot(token, chatwootLead(fields, lang, page, siteOrigin));
    if (typeof context.waitUntil === 'function') context.waitUntil(task);
  } catch (e) { console.error('contact: Chatwoot push failed', 'queue', e?.name || 'error'); }
}
export async function onRequestPost(context) {
  const { request, env = {} } = context;
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') return json({ ok: false, error: 'origin' }, 403);
  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    const body = await boundedBody(request);
    if (ct.includes('application/json')) data = JSON.parse(new TextDecoder().decode(body));
    else if (/application\/x-www-form-urlencoded|multipart\/form-data/.test(ct)) data = Object.fromEntries(await new Response(body, { headers: { 'content-type': ct } }).formData());
    else return json({ ok: false, error: 'content-type' }, 415);
  } catch (e) { return json({ ok: false, error: e instanceof RangeError ? 'body-size' : 'bad-request' }, e instanceof RangeError ? 413 : 400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ ok: false, error: 'bad-request' }, 400);
  if (!['contact', 'newsletter'].includes(data.form)) return json({ ok: false, error: 'form' }, 400);
  if (typeof data.website === 'string' && clean(data.website)) return json({ ok: true });
  const raw = data.fields === undefined
    ? Object.entries(data).filter(([k]) => !['website', 'form', 'lang', 'page'].includes(k)).map(([label, value]) => ({ label, value }))
    : data.fields;
  if (!Array.isArray(raw) || raw.length > 40 || raw.some(f => !f || typeof f.label !== 'string' || f.label.length > 80 || typeof f.value !== 'string' || f.value.length > 5000 || (f.key !== undefined && (typeof f.key !== 'string' || f.key.length > 80)))) return json({ ok: false, error: 'validation' }, 422);
  if (['lang', 'page'].some(k => data[k] !== undefined && (typeof data[k] !== 'string' || data[k].length > (k === 'lang' ? 10 : 2000)))) return json({ ok: false, error: 'validation' }, 422);
  const fields = raw.map(f => ({ ...f, label: clean(f.label), value: clean(f.value) }));
  const emails = fields.filter(f => fieldKey(f) === 'email');
  const names = fields.filter(f => fieldKey(f) === 'name');
  const email = emails[0]?.value;
  const name = names[0]?.value || '';
  const isNews = data.form === 'newsletter';
  if (emails.length !== 1 || !EMAIL.test(email || '') || email.length > 254 || (!isNews && (names.length !== 1 || !name || name.length > 256))) return json({ ok: false, error: 'validation' }, 422);
  const id = request.headers.get('Idempotency-Key') || crypto.randomUUID();
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(id)) return json({ ok: false, error: 'idempotency-key' }, 400);
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not-configured' }, 503);
  // Do not add server timestamps/country here: retries must serialize identically.
  const lines = fields.filter(f => f.value).map(f => f.label + ': ' + f.value);
  lines.push('', 'Language: ' + (clean(data.lang || '') || '-'), 'Page: ' + (clean(data.page || '') || '-'));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: ctrl.signal,
      headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json', 'Idempotency-Key': id },
      body: JSON.stringify({ from: env.CONTACT_FROM || DEFAULT_FROM, to: [env.CONTACT_TO || DEFAULT_TO], reply_to: email,
        subject: isNews ? '[STARGO WORK] Newsletter request · ' + email : '[STARGO WORK] Inquiry · ' + name.replace(/[\r\n]/g, ' '), text: lines.join('\n') }),
    });
    if (!res.ok) {
      // Resend answers errors as JSON { statusCode, name, message }. Log what it said, never the request.
      let detail = '';
      try { const raw = await res.text(); try { const j = JSON.parse(raw); detail = [j.name, j.message].filter(Boolean).join(': ') || raw; } catch { detail = raw; } } catch { detail = '(no body)'; }
      console.error('contact: Resend refused the message', res.status, String(detail).replace(/\s+/g, ' ').slice(0, 500));
      return json({ ok: false, error: 'upstream' }, 502);
    }
    const chatwootToken = String(env.CHATWOOT_WEBSITE_TOKEN || '').trim();
    if (!isNews && chatwootToken) queueChatwoot(context, chatwootToken, fields, data.lang, data.page, new URL(request.url).origin);
    return json({ ok: true });
  } catch (e) {
    console.error('contact: Resend unreachable', ctrl.signal.aborted ? 'timeout after 8s' : String(e?.message || e).slice(0, 200));
    return json({ ok: false, error: ctrl.signal.aborted ? 'timeout' : 'upstream' }, ctrl.signal.aborted ? 504 : 502);
  } finally { clearTimeout(timer); }
}
export const onRequestGet = () => json({ ok: false, error: 'method' }, 405);

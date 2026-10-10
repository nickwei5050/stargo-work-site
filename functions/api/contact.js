/** POST /api/contact — mail relay, not a CRM or newsletter audience manager.
 * Requires RESEND_API_KEY and a verified CONTACT_FROM sender in Cloudflare.
 * CONTACT_TO defaults to sales@stargomoto.com. No credentials go to the browser.
 * Provider idempotency handles retry deduplication across Worker instances.
 *
 * Contract (owner, 2026-10-10). Fields arrive as {key, label, value}; the key
 * (js/stargo-forms.js) is stable, and a label alone still maps, so a cached page
 * keeps working. Four kinds are understood, the rest are relayed as written:
 *   contact form     name    exactly one non-empty value, at most 256 characters
 *                    company exactly one non-empty value, at most 256 characters
 *                    phone   one or more values; the phone number or WeChat ID.
 *                            Each non-empty value must be 5-64 characters and
 *                            hold a letter or five digits (the rule is only
 *                            "this is a plausible way to reach someone": a
 *                            WeChat ID has letters, a phone number has digits).
 *                    email   optional; when given it must be valid, at most 254
 *                            characters, and only one. Without one the mail
 *                            carries no reply_to; the visitor is answered on
 *                            the phone / WeChat they left.
 *   newsletter       exactly one valid e-mail, nothing else is needed.
 * 422 answers carry `fields`: the kinds that failed, so the page can focus one.
 */
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const clean = v => v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim();
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_BODY = 65536;
const ALIASES = {
  email: ['email', 'emailaddress', 'youremail', 'youremailaddress', 'subscribe', '邮箱', '电子邮箱', '邮箱地址'],
  name: ['name', 'fullname', 'yourname', '姓名', '您的姓名', '你的姓名', '联系人'],
  // `lastname` is the old template's input name for the company
  company: ['company', 'companyname', 'organization', 'organisation', 'lastname', '公司', '公司名称', '企业', '企业名称'],
  phone: ['phone', 'phonenumber', 'tel', 'telephone', 'mobile', 'mobilephone', 'cell', 'wechat', 'weixin', 'whatsapp', 'mobileorwechat', 'phoneorwechat', 'mobilewechat', 'phonewechat',
    '手机', '手机号', '手机号码', '电话', '联系电话', '微信', '微信号', '手机微信', '手机或微信'],
};
const kindOf = raw => Object.keys(ALIASES).find(k => ALIASES[k].includes(raw));
const fieldKey = f => {
  // New clients send stable keys. Cached clients still use translated labels, possibly marked
  // 「姓名 *」, 「邮箱（选填）」 or joined 「WhatsApp / 微信 / 电话」.
  const raw = (f.key ?? f.label).toLowerCase().replace(/[（(][^）)]*[）)]/g, '').replace(/[\s*：:._-]/g, '');
  const kind = kindOf(raw);
  if (kind) return kind;
  const parts = raw.split(/[/／|、,，]+/).filter(Boolean);
  if (parts.length > 1 && parts.every(p => kindOf(p) === 'phone')) return 'phone';
  return raw;
};
// A plausible phone number or WeChat ID: 5-64 characters with a letter or five digits in them.
const PLAUSIBLE_PHONE = v => v.length >= 5 && v.length <= 64 && (/\p{L}/u.test(v) || (v.match(/\d/g) || []).length >= 5);
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
export async function onRequestPost({ request, env = {} }) {
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
  const isNews = data.form === 'newsletter';
  const of = kind => fields.filter(f => fieldKey(f) === kind);
  const filled = kind => of(kind).filter(f => f.value);
  const emails = isNews ? of('email') : filled('email');   // a newsletter counts every e-mail field, empty or not
  const email = emails[0]?.value || '';
  const names = of('name').filter(f => f.value);
  const companies = of('company').filter(f => f.value);
  const phones = filled('phone');
  const name = names[0]?.value || '';
  const company = companies[0]?.value || '';
  const bad = [];
  if (isNews ? emails.length !== 1 : emails.length > 1) bad.push('email');
  else if (emails.length && (!EMAIL.test(email) || email.length > 254)) bad.push('email');
  if (!isNews) {
    if (names.length !== 1 || name.length > 256) bad.push('name');
    if (companies.length !== 1 || company.length > 256) bad.push('company');
    if (!phones.length || !phones.every(f => PLAUSIBLE_PHONE(f.value))) bad.push('phone');
  }
  if (bad.length) return json({ ok: false, error: 'validation', fields: bad }, 422);
  const id = request.headers.get('Idempotency-Key') || crypto.randomUUID();
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(id)) return json({ ok: false, error: 'idempotency-key' }, 400);
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not-configured' }, 503);
  // Do not add server timestamps/country here: retries must serialize identically.
  const lines = fields.filter(f => f.value).map(f => f.label + ': ' + f.value);
  lines.push('', 'Language: ' + (clean(data.lang || '') || '-'), 'Page: ' + (clean(data.page || '') || '-'));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  const oneLine = v => v.replace(/[\r\n\u2028\u2029]+/g, ' ');
  const subject = isNews ? '[STARGO WORK] Newsletter request · ' + email : ('[STARGO WORK] Inquiry · ' + oneLine(name) + ' · ' + oneLine(company)).slice(0, 250);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: ctrl.signal,
      headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json', 'Idempotency-Key': id },
      // reply_to only when the visitor left a valid e-mail; otherwise they are answered on the phone / WeChat in the text
      body: JSON.stringify({ from: env.CONTACT_FROM || 'STARGO WORK <noreply@stargomoto.com>', to: [env.CONTACT_TO || 'sales@stargomoto.com'], ...(email ? { reply_to: email } : {}),
        subject, text: lines.join('\n') }),
    });
    if (!res.ok) return json({ ok: false, error: 'upstream' }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false, error: ctrl.signal.aborted ? 'timeout' : 'upstream' }, ctrl.signal.aborted ? 504 : 502); }
  finally { clearTimeout(timer); }
}
export const onRequestGet = () => json({ ok: false, error: 'method' }, 405);

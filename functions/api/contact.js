/** POST /api/contact — mail relay, not a CRM or newsletter audience manager.
 * Requires RESEND_API_KEY and a verified CONTACT_FROM sender in Cloudflare.
 * CONTACT_TO defaults to sales@stargomoto.com. No credentials go to the browser.
 * Provider idempotency handles retry deduplication across Worker instances.
 */
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
      body: JSON.stringify({ from: env.CONTACT_FROM || 'STARGO WORK <noreply@stargomoto.com>', to: [env.CONTACT_TO || 'sales@stargomoto.com'], reply_to: email,
        subject: isNews ? '[STARGO WORK] Newsletter request · ' + email : '[STARGO WORK] Inquiry · ' + name.replace(/[\r\n]/g, ' '), text: lines.join('\n') }),
    });
    if (!res.ok) return json({ ok: false, error: 'upstream' }, 502);
    return json({ ok: true });
  } catch { return json({ ok: false, error: ctrl.signal.aborted ? 'timeout' : 'upstream' }, ctrl.signal.aborted ? 504 : 502); }
  finally { clearTimeout(timer); }
}
export const onRequestGet = () => json({ ok: false, error: 'method' }, 405);

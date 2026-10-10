/**
 * S11 — the demo band. The form is the template's own `.w-form` block, so it
 * keeps everything tools/chrome.mjs formMarkup() and js/stargo-forms.js give
 * every demo form (POST /api/contact, honeypot, labels, consent line, the
 * success/failure notices that functions/api/contact.js answers). The
 * template's photograph behind it is gone; WhatsApp and e-mail sit beside it.
 */
import { esc, heading, button, ICON } from './shared.mjs';

export function render({ lang, t, C, formHtml, aboutLink = true }) {
  const O = C.HOME_OW;
  const K = O.contact;
  const form = withFields(formHtml, { t, C }, { where: 'ow contact' });
  return `<section class="ow-sec ow-sec--glow ow-contact" id="demo" aria-labelledby="ow-contact-title"><div class="ow-wrap"><div class="ow-contact-card">`
    + `<div class="ow-contact-text"><p class="ow-eyebrow">${esc(t(K.eyebrow))}</p><h2 id="ow-contact-title" class="ow-h2">${heading(lang, t(K.title))}</h2><p class="ow-sec-lead">${heading(lang, t(K.lead))}</p>`
    + ways({ lang, t, C })
    + trust({ lang, t, C })
    /* the about page carries the band too: no link to itself there */
    + (aboutLink ? `<p class="ow-contact-about">${button('about.html', t(K.about), { kind: 'link' })}</p>` : '')
    + `</div>`
    + `<div class="ow-contact-form">${form}</div>`
    + `</div></div></section>`;
}

/* The four fields of the demo form (name, company, mobile / WeChat, e-mail),
   one definition for this band and for contact.html. Owner, 2026-10-10: the
   first three are required, the e-mail is optional. Each has a visible label
   (a placeholder vanishes as soon as something is typed); the required three
   end in an aria-hidden * and carry `required`, the e-mail says 「（选填）」 /
   "(optional)". js/stargo-forms.js reads the label text without those two
   marks as the field's name in the relayed e-mail, and sends the stable keys
   name / company / phone / email (functions/api/contact.js). The ids are
   unique per page: a page carries one demo form. tools/chrome.mjs formMarkup()
   leaves an input alone that already has its autocomplete and its label. */
export function formFields({ t, C }) {
  const F = C.FORM_FIELDS;
  const label = (id, f) => `<label class="ow-field-l" for="${id}">${esc(t(f.label))}`
    + (f.required ? '<span class="ow-req" aria-hidden="true"> *</span>' : `<span class="ow-opt">${esc(t(F.optional))}</span>`)
    + '</label>';
  const field = (f, { id, type = 'text', autocomplete, maxlength, extra = '' }) => `<div class="ow-field">${label(id, f)}`
    + `<input class="text-field w-input" maxlength="${maxlength}" name="${f.key}" data-name="${f.key}" type="${type}" id="${id}" autocomplete="${autocomplete}"`
    + `${f.hint ? ` placeholder="${esc(t(f.hint))}"` : ''}${extra}${f.required ? ' required=""' : ''}/></div>`;
  return `<div class="grid-form">`
    + field(F.name, { id: 'contact-name', autocomplete: 'name', maxlength: 256 })
    + field(F.company, { id: 'contact-company', autocomplete: 'organization', maxlength: 256 })
    + `</div>`
    // type="text", not "tel": a WeChat ID has letters, and a dial pad would not let anyone type one
    + field(F.phone, { id: 'contact-phone', autocomplete: 'tel', maxlength: 64, extra: ' autocapitalize="off" spellcheck="false"' })
    + field(F.email, { id: 'contact-email', type: 'email', autocomplete: 'email', maxlength: 254 });
}

/* The template's `.w-form` with its three inputs swapped for formFields() (and
   `extra`, markup for more fields, placed just before the submit button). The
   template's own form, its notices and tools/chrome.mjs formMarkup() /
   js/stargo-forms.js stay. Both users (this band and contact.html) call it,
   so the template cut is asserted once. */
export function withFields(formHtml, ctx, { where, extra = '' }) {
  const { t, C } = ctx;
  if (!/^<div class="w-form"><form\b/.test(formHtml)) throw new Error(`${where}: template form not found`);
  if (!formHtml.includes('value="Contact us"')) throw new Error(`${where}: template submit button not found`);
  const region = /<div class="grid-form">[\s\S]*?(?=<input type="submit")/g;
  const found = formHtml.match(region) || [];
  if (found.length !== 1 || (found[0].match(/<input\b/g) || []).length !== 3) throw new Error(`${where}: expected the template's three inputs in one block, found ${found.length} block(s)`);
  return formHtml.replace('value="Contact us"', `value="${esc(t(C.HOME_OW.demoLabel))}"`).replace(region, () => formFields(ctx) + extra);
}

/* The ways to reach us (round 2, 2026-10-10: owner-confirmed WeChat ID and
   phone, the phone being the WhatsApp number). WeChat has no web link, so its
   ID is plain, selectable text; the phone is a tel: link. The contact page
   adds the address (`address: true`). */
export function ways({ lang, t, C }, { address = false, labels = C.HOME_OW.contact } = {}) {
  const O = C.HOME_OW;
  const info = C.CONTACT_INFO;
  const item = (icon, label, value, href, ext = false) => `<li>${href ? `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>` : '<span class="ow-way">'}`
    + `${ICON[icon]}<span><strong>${esc(label)}</strong>${esc(value)}</span>${href ? '</a>' : '</span>'}</li>`;
  return `<ul class="ow-contact-ways">`
    + item('wechat', t(labels.wechat), info.wechat)
    + item('phone', t(labels.phone), info.phone, info.phoneHref)
    + item('whatsapp', 'WhatsApp', info.whatsapp, t(O.whatsappHref), true)
    + item('mail', t(labels.email), info.email, `mailto:${info.email}`)
    + (address ? `<li><span class="ow-ct-addr">${ICON.pin}<span><strong>${esc(t(labels.address))}</strong>${esc(t(info.address))}</span></span></li>` : '')
    + `</ul>`;
}

/* One line of real company facts under the ways: the operating company (its
   Chinese legal name on both languages, marked as Chinese on the English
   page, after "Operated by" so the line says what it is), the 12-hour reply
   and the demo formats. No customers, logos or ratings. */
export function trust({ lang, t, C }) {
  const parts = C.HOME_OW.contact.trust.map((x) => (x.company
    ? (lang === 'zh' ? esc(x.company) : `${esc(t(x.lead))}<span lang="zh-CN">${esc(x.company)}</span>`)
    : esc(t(x))));
  return `<ul class="ow-trust">${parts.map((p, i) => `<li>${i ? ICON.check : ICON.building}<span>${p}</span></li>`).join('')}</ul>`;
}

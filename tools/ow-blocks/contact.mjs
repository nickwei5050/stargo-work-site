/**
 * S11 — the demo band. The form is the template's own `.w-form` block, so it
 * keeps everything tools/chrome.mjs formMarkup() and js/stargo-forms.js give
 * every demo form (POST /api/contact, honeypot, labels, consent line, the
 * success/failure notices that functions/api/contact.js answers). The
 * template's photograph behind it is gone; WhatsApp and e-mail sit beside it.
 */
import { esc, heading, button, ICON } from './shared.mjs';

export function render({ lang, t, C, formHtml }) {
  const O = C.HOME_OW;
  const K = O.contact;
  if (!/^<div class="w-form"><form\b/.test(formHtml)) throw new Error('ow contact: template form not found');
  if (!formHtml.includes('value="Contact us"')) throw new Error('ow contact: template submit button not found');
  /* Each field gets a visible label (its placeholder disappears as soon as
     something is typed); js/stargo-forms.js reads label[for] as the field's
     name in the e-mail, which is the same word as before. */
  let labelled = 0;
  const form = formHtml.replace('value="Contact us"', `value="${esc(t(O.demoLabel))}"`)
    .replace(/<input\b[^>]*\bclass="text-field\b[^>]*>/g, (tag) => {
      const id = tag.match(/\sid="([^"]+)"/)?.[1];
      const field = /type="email"/.test(tag) ? K.fields.email : K.fields[id];
      if (!id || !field) throw new Error(`ow contact: field without id or label: ${tag}`);
      const name = esc(t(field));
      labelled++;
      return `<div class="ow-field"><label class="ow-field-l" for="${id}">${name}</label>${tag}</div>`;
    });
  if (labelled !== 3) throw new Error(`ow contact: expected 3 fields, labelled ${labelled}`);
  const info = C.CONTACT_INFO;
  return `<section class="ow-sec ow-sec--glow ow-contact" id="demo" aria-labelledby="ow-contact-title"><div class="ow-wrap"><div class="ow-contact-card">`
    + `<div class="ow-contact-text"><p class="ow-eyebrow">${esc(t(K.eyebrow))}</p><h2 id="ow-contact-title" class="ow-h2">${heading(lang, t(K.title))}</h2><p class="ow-sec-lead">${heading(lang, t(K.lead))}</p>`
    + `<ul class="ow-contact-ways">`
    + `<li><a href="${esc(t(O.whatsappHref))}" target="_blank" rel="noopener noreferrer">${ICON.whatsapp}<span><strong>WhatsApp</strong>${esc(info.whatsapp)}</span></a></li>`
    + `<li><a href="mailto:${esc(info.email)}">${ICON.mail}<span><strong>${esc(t(K.email))}</strong>${esc(info.email)}</span></a></li>`
    + `</ul><p class="ow-contact-about">${button('about.html', t(K.about), { kind: 'link' })}</p></div>`
    + `<div class="ow-contact-form">${form}</div>`
    + `</div></div></section>`;
}

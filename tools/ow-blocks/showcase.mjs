/**
 * S3 — the product showcase, the most important section of the page.
 *
 * Four tabs in business order, the second selected (the hero already shows
 * the inquiry). Each panel: the scene in one sentence, the three lines
 * 「读了什么 / AI 做了什么 / 你批什么」 taken from the steps printed in its
 * image, and the image at 1200px (the phone card below 768px). Markup is a
 * WAI-ARIA tab set: js/stargo-ow.js adds arrows/Home/End and roving focus.
 * Without JS (no `w-mod-js` on <html>) css/stargo-ow.css shows all four
 * panels one after another, so nothing is ever hidden behind a script.
 *
 * Under the tabs: the composer and the five quick actions (ow23 on desktop,
 * the same five as text chips on smaller screens) with the interface's own
 * sentence 「选择后只填入输入框，不会自动发送」.
 */
import { esc, heading, plain, button, shot, asset, floatCard, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const S = O.showcase;
  if (!S.tabs.some((x) => x.key === S.defaultTab)) throw new Error('ow showcase: default tab missing');
  const tabs = S.tabs.map((x) => {
    const on = x.key === S.defaultTab;
    return `<button type="button" role="tab" class="ow-tab" id="ow-tab-${x.key}" aria-controls="ow-panel-${x.key}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${ICON[x.icon]}<span>${esc(t(x.label))}</span></button>`;
  }).join('');
  const panels = S.tabs.map((x) => {
    const on = x.key === S.defaultTab;
    const step = (k) => `<div class="ow-step ow-step--${k}"><dt>${esc(t(S.labels[k]))}</dt><dd>${esc(t(x[k]))}</dd></div>`;
    return `<div class="ow-panel" role="tabpanel" id="ow-panel-${x.key}" aria-labelledby="ow-tab-${x.key}" tabindex="0"${on ? '' : ' hidden'}>`
      + `<div class="ow-panel-text"><p class="ow-panel-sum"><span class="ow-kicker">${esc(t(S.kicker))}</span>${esc(t(x.summary))}</p>`
      + `<dl class="ow-steps">${step('read')}${step('did')}${step('approve')}</dl></div>`
      + shot({ id: x.shot, card: x.card, lang, t, O, label: t(x.label), sizes: '(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(100vw - 80px), 1200px', floats: floatCard(t(x.float), { icon: 'shield', cls: 'ow-float--br' }) })
      + `</div>`;
  }).join('');
  const strip = asset('ow23-quick-actions');
  const chips = S.quick.actions.map((a) => `<li>${esc(t(a))}</li>`).join('');
  const quick = `<div class="ow-quick">`
    + `<div class="ow-quick-shot">${shot({ id: strip.id, lang, t, O, label: t(S.quick.label), sizes: '(max-width: 991px) calc(100vw - 80px), 1000px' })}</div>`
    + `<ul class="ow-quick-chips" aria-label="${esc(t(S.quick.label))}">${chips}</ul>`
    + `<p class="ow-quick-line">${esc(t(S.quick.line))}</p></div>`;
  return `<section class="ow-sec ow-sec--glow ow-show" id="product" aria-labelledby="ow-show-title"><div class="ow-wrap">`
    + `<header class="ow-sec-head ow-sec-head--center"><p class="ow-eyebrow">${esc(t(S.eyebrow))}</p><h2 id="ow-show-title" class="ow-h2">${heading(lang, t(S.title))}</h2><p class="ow-sec-lead">${heading(lang, t(S.lead))}</p></header>`
    + `<div class="ow-tabs" data-ow-tabs><div class="ow-tablist-wrap"><div class="ow-tablist" role="tablist" aria-label="${esc(t(S.tablist))}">${tabs}</div></div>${panels}</div>`
    + `<p class="ow-shot-note">${esc(t(O.shotNote))}</p>`
    + quick
    + `<div class="ow-sec-cta">${button('contact.html', t(S.cta), { kind: 'primary', icon: null })}</div>`
    + `</div></section>`;
}

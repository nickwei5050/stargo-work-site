/**
 * S1 — the first screen. The promise, two buttons under it, and ow02-inquiry,
 * the full app with its sidebar (the only full-app picture on the page), at
 * 1280px (eager, fetchpriority=high) with three numbered callouts. The
 * numbers sit on the picture beside what they point at (tools/openwork/
 * hotspots.json); from 1440px the three sentences sit on glass cards on the
 * empty ground right of the chat column, level with their numbers; narrower,
 * they are a numbered list under the picture, and phones get the ow12 reply
 * card instead of the full screen.
 * No text animation: the heading and buttons are plain markup.
 */
import { esc, heading, button, shot, hotspot, ICON } from './shared.mjs';

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const h = O.hero;
  const SHOT = 'ow02-inquiry';
  /* Each number sits on the right edge of the box it points at, mid-height. */
  const marks = h.callouts.map((c, i) => {
    const b = hotspot(SHOT, c.hot);
    /* just outside the right edge of the card the box belongs to (the cards
       end at 86.2% of the image), so the number never covers the interface */
    const x = Math.min(b.x + b.w + 1.3, 99).toFixed(2);
    const y = (b.y + b.h / 2).toFixed(2);
    return { n: i + 1, x, y, text: t(c.text) };
  });
  const pins = marks.map((m) => `<span class="ow-pin" style="--x:${m.x}%;--y:${m.y}%" aria-hidden="true">${m.n}</span>`).join('');
  const notes = marks.map((m) => `<li class="ow-note" style="--y:${m.y}%"><span class="ow-note-n" aria-hidden="true">${m.n}</span><span class="ow-note-t">${heading(lang, m.text)}</span></li>`).join('');
  /* The chat column of the 1280-wide render runs from 28.75% to 89.7% of its
     width; the lightbox opens at 1800px and centres on it. */
  const figure = shot({
    id: SHOT, card: 'ow12-inquiry-card', lang, t, O, eager: true, title: t(h.window),
    sizes: '(max-width: 767px) calc(100vw - 40px), (max-width: 1359px) calc(100vw - 80px), 1280px',
    label: t(O.showcase.tabs[0].label), zoomW: 1800, zoomX: 0.592,
    extra: `<div class="ow-pins">${pins}</div>`,
  });
  return `<section class="ow-hero" aria-labelledby="ow-hero-title"><div class="ow-wrap">`
    + `<div class="ow-hero-head">`
    + `<p class="ow-eyebrow ow-eyebrow--pill"><span class="ow-spark" aria-hidden="true">${ICON.spark}</span>${esc(t(h.eyebrow))}</p>`
    + `<h1 id="ow-hero-title" class="ow-h1"><span>${heading(lang, t(h.title[0]))}</span> <span class="ow-h1-2">${heading(lang, t(h.title[1]))}</span></h1>`
    + `<p class="ow-lead">${heading(lang, t(h.lead))}</p>`
    + `<div class="ow-cta-row">${button('contact.html', t(O.demoLabel), { kind: 'primary', cls: 'ow-hero-cta' })}${button(t(O.whatsappHref), t(O.whatsappLabel), { kind: 'secondary', icon: 'whatsapp', external: true })}</div>`
    + `<p class="ow-slogan">${esc(t(h.slogan))}</p>`
    + `</div>`
    + `<div class="ow-hero-stage">${figure}<ol class="ow-notes" aria-label="${esc(t(h.calloutsLabel))}">${notes}</ol></div>`
    + `<p class="ow-shot-note">${heading(lang, t(O.shotNote))}</p>`
    + `</div></section>`;
}

/**
 * The page opens on renok's hero — and on the row of 3D-tilted project cards
 * that renok draws directly beneath it (review: image2.png).
 *
 * Donor: renok index.html, the whole black wrapper
 * `.rt-position-relative.rt-background-black`. It holds three things, and the
 * review screenshot shows all three at once, so all three travel together:
 *
 *   - `section.rt-home-v1-hero`: a centred h1 with one italic-serif accent, a
 *     paragraph and a pill button, each shipped at `opacity:0` and faded up on
 *     load by IX2 through the data-w-ids they carry. The silk backdrop is this
 *     section's own CSS `background-image`; the extractor mirrors it into
 *     assets/renok with everything else.
 *   - `.rt-project-three`: six photographs (helmet, bicycle, headphones …) on a
 *     `rotateX` perspective stage, driven by the wrapper's data-w-id. There is no
 *     text in the row — the cards are pure images — so nothing in it changes
 *     except the alt text, which was the donor's own file names.
 *   - `.rt-bg-line-animation`: the three vertical hairlines behind both.
 *
 * Only the words change: lead / accent / tail in the h1, the paragraph, the two
 * synchronised copies of the button label, and the button's href. The accent
 * stays a Latin fragment in both languages because the italic face has no CJK
 * glyphs (tools/copy.mjs says why beside heroAccent).
 */
import { setText, setTextAll } from '../block-lib.mjs';

export const donor = {
  id: 'rk-hero',
  donor: 'renok',
  scope: '.rk-hero',
  page: 'index.html',
  /* The wrapper itself, so the ground and the hairlines come along; no `wrap`
     is needed because the cut already starts at the black ancestor. */
  start: '<div class="rt-position-relative rt-background-black"><section class="rt-home-v1-hero rt-overflow-hidden rt-change">',
  /* The wrapper closes right after the hairline block, just before renok's
     awards section begins. */
  end: '<div class="rt-bg-line-animation-line rt-two"></div><div class="rt-bg-line-animation-line rt-two rt-second"></div></div></div></div>',
  /* No images/imageStems: every photograph and the backdrop are the template's
     own and stay, mirrored into assets/renok by try-block. */
};

export function render(frag, ctx) {
  const { C, t, escapeHtml } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  for (const k of ['heroLead', 'heroAccent', 'heroTail', 'heroBody', 'heroButton']) {
    if (!S[k]) throw new Error(`rk-hero: CAPABILITY_SHOWCASE.${k} is missing`);
  }

  /* ---- the cut must still end where the donor's wrapper closes ---- */
  if (!frag.endsWith('</div></div></div>') || !frag.includes('rk-rt-bg-line-animation')) {
    throw new Error('rk-hero: the fragment no longer ends with the hairline block closing the black wrapper');
  }
  if ((frag.match(/<img /g) ?? []).length !== 6) {
    throw new Error(`rk-hero: renok ships six project cards, found ${(frag.match(/<img /g) ?? []).length} images`);
  }

  let html = frag;

  /* ---- headline: lead, italic accent, tail — the span keeps its classes ---- */
  const H1 = /(<h1[^>]*>)([\s\S]*?)(<span class="rk-rt-italic-text rk-rt-change">)([\s\S]*?)(<\/span>)([\s\S]*?)(<\/h1>)/;
  if (!H1.test(html)) throw new Error('rk-hero: the h1 with its italic span is not in the fragment');
  /* Three phrases, each kept whole. At the donor's h1 size the Chinese line
     wraps wherever it likes: between "/one" and "system", or one character
     into "的一套系统", leaving "统" alone on a line. Nothing here is a rule:
     a non-breaking space holds the accent together, and a word joiner
     (U+2060) between the characters of a Chinese phrase — the CJK equivalent,
     since Chinese breaks between any two characters — holds the lead and the
     tail together. A phrase with spaces (the English lead and tail) is left to
     wrap at its spaces as the donor's does. */
  const whole = (s) => (/\s/.test(s) ? s : [...s].join('⁠'));
  const accent = escapeHtml(t(S.heroAccent)).replace(/ /g, '&nbsp;');
  html = html.replace(H1, (m, o, lead, so, _accent, sc, tail, c) =>
    `${o}${escapeHtml(whole(t(S.heroLead)))} ${so}${accent}${sc} ${escapeHtml(whole(t(S.heroTail)))}${c}`);

  /* ---- paragraph: the one <p> in the block ---- */
  if ((html.match(/<p[\s>]/g) ?? []).length !== 1) throw new Error('rk-hero: expected exactly one paragraph');
  html = html.replace(/(<p[^>]*>)([\s\S]*?)(<\/p>)/, (m, o, inner, c) => `${o}${escapeHtml(t(S.heroBody))}${c}`);

  /* ---- button: two copies of the label roll over each other ---- */
  html = setTextAll(html, 'rk-rt-button-text', escapeHtml(t(S.heroButton)));
  if (!html.includes('href="contact-one.html"')) throw new Error('rk-hero: the button no longer links to contact-one.html');
  html = html.split('href="contact-one.html"').join('href="#atlas"');

  /* ---- the cards: photographs only; their alts were the donor's file names.
     They are decoration under a headline that already says what the page is,
     and naming a capability over a picture of a helmet would be a false
     description, so they are marked decorative. ---- */
  const alts = html.match(/alt="hero-banner-3d-rotation-image-[a-z]+"/g) ?? [];
  if (alts.length !== 6) throw new Error(`rk-hero: expected six card alts, found ${alts.length}`);
  html = html.replace(/alt="hero-banner-3d-rotation-image-[a-z]+"/g, 'alt=""');

  /* ---- nothing of renok's own copy may survive ---- */
  const donorWords = ['Start building', 'websites', 'people remember', 'Osmo', 'Let&#x27;s talk', 'contact-one', 'hero-banner-3d-rotation-image'];
  const left = donorWords.filter((w) => html.replace(/src="[^"]*"|srcset="[^"]*"/g, '').includes(w));
  if (left.length) throw new Error(`rk-hero: donor copy survived: ${left.join(', ')}`);

  return html;
}

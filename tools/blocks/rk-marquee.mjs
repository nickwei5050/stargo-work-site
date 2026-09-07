/**
 * The chapter divider — renok's oversized scrolling marquee.
 *
 * Donor: the strip under renok's service hero. Three `.rt-marque-train`
 * children of one marquee root, each holding a single `.rt-extra-big-text`
 * line set at `clamp(35px, 10vw, 240px)`, the whole row sliding left on a
 * scroll trigger. Almost no copy, no imagery: it is the beat between two
 * chapters of the capability page.
 *
 * Two things the donor's markup will not forgive:
 *
 *   All three trains must carry the SAME string. The interaction (renok's
 *   "Nav Merquee", a-29) moves every `.rt-marque-train` under the event target
 *   by -100% of ITS OWN width over 30s. Trains of different widths drift apart
 *   and the loop visibly tears.
 *
 *   The single `data-w-id` on the root is the whole animation. The action list
 *   addresses its trains with `useEventTarget: CHILDREN`, which is also why one
 *   page can carry two of these strips: both roots keep the same id and each
 *   one animates its own three trains.
 */
import { setTextAll } from '../block-lib.mjs';

/* The donor's own line. Built from character codes rather than typed, because
   what sits between "Portfolio" and "agency" is two NO-BREAK SPACEs (U+00A0),
   not two ordinary ones — an anchor typed with plain spaces matches nothing,
   and an invisible character in a source file is not reviewable. */
const NBSP = String.fromCharCode(0xa0);
const COPYRIGHT = String.fromCharCode(0xa9);
const DONOR_LINE = `Creative agency ${COPYRIGHT} - Portfolio${NBSP}${NBSP}agency${COPYRIGHT}`;

export const donor = {
  id: 'rk-marquee',
  donor: 'renok',
  scope: '.rk-marquee',
  page: 'service.html',
  start: '<div data-w-id="d13aca87-a5f5-6703-2447-4d788b52f023" class="rt-menu-background-text-marque rt-v2">',
  end: `<div class="rt-extra-big-text">${DONOR_LINE}</div></div></div></div></div>`,
  /* No wrap. `.rt-menu-background-text-marque.rt-v2` is already `position:
     relative; inset: auto 0% 0%`, so the strip stands in the flow on its own;
     the donor's hero ancestors would only drag a sticky viewport-tall stage in
     with it. */

  /* The strip paints nothing itself and every rule that reaches it is layout:
     its type was white because renok's `body` rule made every word on that page
     white, and a `body` rule does not travel with a block. So it needs the
     ground it was drawn on — and the light type with it, see `notes`. */
  ground: '#000',
};

/**
 * The words each strip carries, in the order the page uses them. One line is
 * repeated identically across the three trains, so it has to be short and
 * already true of the product: the site's own theatre line, plus a label that
 * exists in the copy. Nothing here is newly written.
 *
 * `render` draws WORDS[0]; the page's second strip is WORDS[1] — see `notes`.
 */
export const WORDS = [
  /* Opening the capability chapters: the product, then the page's own eyebrow. */
  (C, t) => `${t(C.HOME_THEATRE)} · ${t(C.CAPABILITY_SHOWCASE.eyebrow)}`,
  /* Between the outcomes and the foundations: the page's own headline, whose
     two halves join without a space in Chinese and with one in English. */
  (C, t, lang) => `${t(C.HOME_THEATRE)} · ${t(C.CAPABILITY_SHOWCASE.headlineTop)}`
    + `${lang === 'zh' ? '' : ' '}${t(C.CAPABILITY_SHOWCASE.headlineBottom)}`,
];

/** One strip, carrying WORDS[i]. */
export function renderWords(frag, ctx, i) {
  const { C, t, lang, escapeHtml } = ctx;
  const line = WORDS[i];
  if (!line) throw new Error(`rk-marquee: no words at index ${i}; the module carries ${WORDS.length}`);

  /* Namespaced by the extractor: the donor's classes already start "rt-" and
     the renok prefix is "rk-". */
  const TRAIN = 'rk-rt-marque-train';
  const TEXT = 'rk-rt-extra-big-text';
  /* Lookarounds, not \b: a hyphen is a word boundary, so "rk-rt-marque" would
     otherwise count the trains too. */
  const count = (cls) => (frag.match(new RegExp(`class="[^"]*(?<![-\\w])${cls}(?![-\\w])`, 'g')) ?? []).length;
  if (count(TRAIN) !== 3) throw new Error(`rk-marquee: the donor ships three ${TRAIN}, found ${count(TRAIN)}`);
  if (count(TEXT) !== 3) throw new Error(`rk-marquee: expected three ${TEXT}, found ${count(TEXT)}`);
  if (!frag.includes('data-w-id="d13aca87-a5f5-6703-2447-4d788b52f023"')) {
    throw new Error('rk-marquee: the marquee data-w-id is gone; without it nothing scrolls');
  }

  /* setTextAll writes all three at once, which is the point: one string across
     three trains is what keeps the loop from tearing. */
  return setTextAll(frag, TEXT, escapeHtml(line(C, t, lang)));
}

export function render(frag, ctx) {
  return renderWords(frag, ctx, ctx.variant ?? 0);
}

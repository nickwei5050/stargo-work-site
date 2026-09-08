/**
 * 把订单一路协调到交付与复购 — story 04 of the capability showcase.
 *
 * Donor: renok's home testimonials (index.html). A 300vh section whose first
 * child is a sticky, viewport-high backdrop — a black ground under a silk
 * photograph, and a giant "Reviews  Testimonial©" marquee that IX2 slides
 * left for ever (a-29). The cards come after it in flow, so they ride up over
 * the backdrop as the reader scrolls, while a-125 grows the backdrop's circular
 * mask with scroll progress. Six cards on desktop in two staggered rows of
 * three; the same six repeated inside a Webflow slider that only exists under
 * 480px (`.rt-mobile-slider` is `display:none` above it, and the rows are
 * `.rt-mobile-display-none` below it). Twelve card elements, six identities.
 *
 * Each card is: a paragraph, a hairline, then an avatar photograph, a name
 * with a check badge, a role line, and a client logo on the right.
 *
 *   paragraph  → the capability's gloss, from the register
 *   name       → capTitle(name, zhName): Chinese name on the Chinese page,
 *                product name on the English page
 *   role line  → the capability's group name, straight out of the register:
 *                the shortest label copy.mjs has for the slot. A card whose
 *                gloss is one line is narrower than the donor's (the card is a
 *                flex item under a max-width, and the donor's paragraphs fill
 *                it), so in those cards the role still wraps to two lines
 *   marquee    → the story's label
 *   avatar     → stays: the donor's own portrait (mirrored into assets/renok)
 *   logo       → REPLACED. "Cairo" is a client logo, and a client logo asserts
 *                a customer this company does not have. It is mapped to the
 *                site's own wordmark rather than dropped, so the card keeps the
 *                donor's three-part bottom row.
 *
 * The story names seven capabilities and renok draws six cards. The cards are
 * filled in DOM order with the first six picks, so the desktop rows and the
 * phone slider carry the same six in the same order; the seventh is reported.
 *
 * Every card in the donor DOM is filled — the slider copies too. A slot left
 * with donor copy because it is invisible at this width is still donor copy.
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[3]. */
const STORY = 3;

/** How many distinct cards renok draws (each appears twice: rows + slider). */
const CARDS = 6;

/** The donor's client logo, replaced with this site's wordmark (see above). */
const CLIENT_LOGO = 'https://cdn.prod.website-files.com/698421329bbd4ad2d6ec9fa7/6985a79c549f57503ebfc176_home-one-testimonial-logo.svg';
const WORDMARK = 'assets/brand/stargo-wordmark.png';

export const donor = {
  id: 'rk-testimonials',
  donor: 'renok',
  scope: '.rk-testimonials',
  page: 'index.html',
  start: '<section data-w-id="25cde431-37c3-2b7c-4747-9e90313ec1ac" class="rt-home-v1-testimonial-main-wrapper">',
  end: '<div class="rt-display-none w-slider-nav w-round w-num"></div></div></div></div></section>',
  /* Only the client logo is substituted. Every portrait, the silk backdrop
     (a CSS background on `.rt-home-v1-testimonial`) and the check badge are
     the donor's own and are mirrored into assets/renok by try-block. */
  images: { [CLIENT_LOGO]: WORDMARK },
  /* renok's `body` is white (`body { background-color: #fff }`, its stylesheet's
     own normalize; renok never overrides it), and on desktop that white IS the
     block: the sticky backdrop paints nothing itself, the black-and-silk ground
     lives inside a circular mask that a-125 grows from 10vw to 250vw, and until
     it does the viewport around the circle is the body. The review screenshot
     (image17) is exactly that — a small black circle on white, with the 1px
     black border of `.rt-home-v1-testimonial-background` showing against it.
     Painting the root black instead hid the whole reveal: black circle, black
     ground. Under 992px the donor paints the section itself black, so this
     ground only shows where renok's does. */
  ground: '#fff',
};

/** End index (exclusive) of the `<div>` element beginning at `start`. */
function divEnd(html, start, what) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { if (--depth === 0) return m.index + m[0].length; }
    else depth++;
  }
  throw new Error(`rk-testimonials: ${what} is never closed`);
}

export function render(frag, ctx) {
  const { C, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`rk-testimonials: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  if (story.picks.length < CARDS) throw new Error(`rk-testimonials: story ${STORY} names ${story.picks.length} capabilities, renok draws ${CARDS}`);
  const caps = story.picks.slice(0, CARDS).map((name) => capability(C, name));

  let html = frag;

  /* ---- the marquee: three trains, each saying the phrase twice ---- */
  /* renok writes "Reviews  Testimonial© - Reviews  Testimonial©" in each train,
     so the same shape carries the label: twice, joined by the donor's dash. */
  const label = escapeHtml(t(story.label));
  html = setTextAll(html, 'rk-rt-extra-big-text', `${label} - ${label}`);

  /* ---- the cards ---- */
  const open = /<div (?:data-w-id="[^"]*" )?class="rk-rt-testimonial-card(?: [^"]*)?">/g;
  const cards = [];
  let m;
  while ((m = open.exec(html))) cards.push([m.index, divEnd(html, m.index, 'a testimonial card')]);
  if (cards.length !== CARDS * 2) {
    throw new Error(`rk-testimonials: renok draws ${CARDS} cards twice (rows + slider), found ${cards.length}`);
  }

  for (let i = cards.length - 1; i >= 0; i--) {
    const [a, b] = cards[i];
    html = html.slice(0, a) + fillCard(html.slice(a, b), caps[i % CARDS], i) + html.slice(b);
  }

  /* ---- attributes that still say the donor's words ---- */
  const LOGO_ALT = 'alt="Home-one-testimonial-logo"';
  if (!html.includes(LOGO_ALT)) throw new Error('rk-testimonials: the client logo lost its alt attribute');
  html = html.split(LOGO_ALT).join('alt="STARGO"');

  /* Fail loudly rather than ship a slot that quietly missed. The mirrored
     portraits keep the donor's file names (…-Alfonso-Rosser.webp) in `src`;
     those are paths, not copy, so the check reads everything but `src`. */
  const donorWords = ['Reviews', 'Testimonial©', 'Studio Analog', 'Analog Studio', 'Alfonso', 'Zain George',
    'Kianna', 'Ethan Blake', 'Noah Reed', 'Liam Cole', 'Home-one', 'Cairo'];
  const spoken = html.replace(/ src="[^"]*"/g, '');
  const left = donorWords.filter((w) => spoken.includes(w));
  if (left.length) throw new Error(`rk-testimonials: donor copy survived: ${left.join(', ')}`);

  return html;

  /** One card: paragraph, name, role line, and the avatar's alt. */
  function fillCard(card, cap, i) {
    /* The paragraph is the only <p> in the card, inside an unclassed div. */
    const ps = card.match(/<p>[\s\S]*?<\/p>/g) ?? [];
    if (ps.length !== 1) throw new Error(`rk-testimonials: card ${i + 1} holds ${ps.length} paragraphs, expected one`);
    let out = card.replace(ps[0], `<p>${escapeHtml(t(cap.gloss))}</p>`);

    /* The name, beside the check badge. */
    out = setText(out, 'rk-rt-responsive-text-change', escapeHtml(capTitle(cap.name, cap.zhName ?? '')));

    /* The role line: the register's own group name — the string the
       catalogue prints as that group's heading, and the shortest label the
       register has for the slot. */
    out = setText(out, 'rk-rt-text-color-light-gray', escapeHtml(t(cap.group.name)));

    /* The portrait is decorative beside a name that already says what the
       card is about; the donor's alt was the sitter's file name. */
    const AVATAR = /(<img src="assets\/renok\/[^"]+" loading="lazy" alt=")[^"]*(" class="rk-rt-radius-10"\/>)/;
    if (!AVATAR.test(out)) throw new Error(`rk-testimonials: card ${i + 1} has no mirrored portrait`);
    out = out.replace(AVATAR, (s, x, y) => `${x}${y}`);
    return out;
  }
}

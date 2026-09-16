/**
 * ERP 与履约：前端拿订单，后台接得住 — story 04 of the capability showcase
 * (V5 M05 + M06, V6 §5.5).
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
 *   paragraph  → the theme's short description (CAP_V6A.operations)
 *   name       → the theme's name, one language per page
 *   role line  → a link to the catalogue group with the full detail (#g08),
 *                in the donor's grey
 *   marquee    → the story's label, 「ERP 与履约：前端拿订单，后台接得住」
 *   avatar     → REPLACED. A portrait of a person beside an operating theme
 *                reads as a customer testimonial; this site's own abstract
 *                avatar takes the same <img>, decorative.
 *   logo       → REPLACED. "Cairo" is a client logo, and a client logo asserts
 *                a customer this company does not have. It is mapped to the
 *                site's own wordmark rather than dropped, so the card keeps the
 *                donor's three-part bottom row.
 *
 * V6 §5.5 names six operating themes — products, materials and purchasing;
 * stock, production and quality; orders and payment milestones; trade
 * documents and export records; logistics and delivery; service, channels and
 * reorders — and renok draws six cards, so each card is one theme, filled in
 * DOM order, and the desktop rows and the phone slider carry the same six in
 * the same order.
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
  const { C, t, escapeHtml } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`rk-testimonials: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  /* V6 §5.5: six operating themes (CAP_V6A.operations), in V6's order. They
     are not register entries, so they carry their own words; the story's picks
     still resolve against the register, and the group they sit in is where
     every card's link goes. */
  const O = C.CAP_V6A?.operations;
  if (!O?.themes || O.themes.length !== CARDS) throw new Error(`rk-testimonials: CAP_V6A.operations needs ${CARDS} themes, one per card, has ${O?.themes?.length}`);
  if (!O.link?.href || !O.icons || O.icons.length !== CARDS) throw new Error('rk-testimonials: CAP_V6A.operations needs a link and one icon per theme');
  const groups = new Set(story.picks.map((name) => capability(C, name).group.n));
  if (groups.size !== 1 || O.link.href !== `#g${[...groups][0]}`) {
    throw new Error(`rk-testimonials: the cards should link to the group story ${STORY}'s picks sit in (${[...groups].join(', ')}), not ${O.link.href}`);
  }
  /* The one theme that must keep the trade documents the old cards named, and
     say where issuance stays — a reword that drops either fails here. */
  const docs = t(O.themes[3].text);
  for (const word of ctx.lang === 'zh'
    ? ['商业发票', '装箱单', '原产地证', 'Form E', '提单', '认证', '退税', '主管机构']
    : ['commercial invoices', 'packing lists', 'certificate of origin', 'Form E', 'bills of lading', 'certifications', 'tax-rebate', 'authorities']) {
    if (!docs.includes(word)) throw new Error(`rk-testimonials: the trade-document theme no longer says "${word}"`);
  }

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

  /* Card i shows theme i % 6: the desktop rows and the phone slider carry the
     same six in the same order, from the same records. */
  for (let i = cards.length - 1; i >= 0; i--) {
    const [a, b] = cards[i];
    html = html.slice(0, a) + fillCard(html.slice(a, b), i % CARDS, i) + html.slice(b);
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

  /** One card: paragraph, name, role line, and the icon beside them. */
  function fillCard(card, k, i) {
    const theme = O.themes[k];
    /* The paragraph is the only <p> in the card, inside an unclassed div. */
    const ps = card.match(/<p>[\s\S]*?<\/p>/g) ?? [];
    if (ps.length !== 1) throw new Error(`rk-testimonials: card ${i + 1} holds ${ps.length} paragraphs, expected one`);
    let out = card.replace(ps[0], `<p>${escapeHtml(t(theme.text))}</p>`);

    /* The name, beside the check badge. Its Chinese form carries zero-width
       spaces where a phrase ends; rk-testimonials.css keeps the name from
       breaking anywhere else in its ~130px slot. */
    out = setText(out, 'rk-rt-responsive-text-change', escapeHtml(t(theme.title)));

    /* The role line: a link to the catalogue group that holds the full ERP,
       fulfilment, finance and service detail (#g08). The line keeps its donor
       class, so it keeps renok's grey. */
    out = setText(out, 'rk-rt-text-color-light-gray', `<a class="rk-testimonials-link" href="${O.link.href}">${escapeHtml(t(O.link.label))}</a>`);

    /* The icon. The donor's portrait of a person would read as a customer
       testimonial beside an operating theme; this site's own abstract avatar
       takes its place, decorative (empty alt), in the same <img>, so the
       portrait's box and radius are unchanged. */
    const AVATAR = /(<img src=")assets\/renok\/[^"]+(" loading="lazy" alt=")[^"]*(" class="rk-rt-radius-10"\/>)/;
    if (!AVATAR.test(out)) throw new Error(`rk-testimonials: card ${i + 1} has no mirrored portrait`);
    /* ctx.art() names the webp artwork; the avatars are this site's png set. */
    out = out.replace(AVATAR, (s, a, b, c) => `${a}assets/stargo-editorial/${O.icons[k]}.png${b}${c}`);
    return out;
  }
}

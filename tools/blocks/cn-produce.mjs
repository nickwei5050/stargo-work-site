/**
 * 视觉停顿 — the "LET'S PRODUCE" break, lifted whole from cinery.
 *
 * Donor: cinery's `section.call-to-action` (index.html; the same section is
 * repeated verbatim on about, services and case-studies). A small pill, a
 * two-line gradient heading — one `<h2>` per `.title-wrapper`, the white-to-
 * black fade painted with `background-clip:text` — and, under it, a fan of
 * thirteen tilted video cards on a 212rem wheel, mirrored once more upside
 * down below (`.cta-reverse-circle`), with a 55rem pill at the foot whose
 * "Book a call" marquee rolls two rows of three copies each.
 *
 * Nothing is cloned and nothing is re-cut: the words change in four places and
 * every card keeps the clip cinery shipped in it — poster, mp4 and webm — which
 * try-block mirrors into assets/cinery/. The three interactions this block
 * binds (a scroll loop on the pill's blur, hover in/out on the button) hang on
 * the two data-w-ids, which are untouched.
 *
 * The block paints no ground of its own — every word in it is white and only
 * cinery's `body { background-color: #000 }` stood behind it — so the ground is
 * declared below and written onto `.cn-produce`.
 */
import { readFileSync } from 'node:fs';
import { setText, DONORS } from '../block-lib.mjs';

/* ------------------------------------------------ the clips' three shapes -- */

/* Webflow writes each background video three ways: `data-poster-url="…jpg"`
   and `<source src="…mp4">` are clean urls the mirror rewrites and fetches;
   but `data-video-urls="…mp4,…webm"` joins two urls with a comma, and the
   `<video style="background-image:url(&quot;…jpg&quot;)">` wraps the poster in
   an entity — and the extractor's url scanner takes both of those as one url,
   asks the CDN for it and gets a 403. `images` maps are applied before that
   scan, so the two malformed shapes are pre-mapped here to exactly the local
   names the mirror gives the clean copies (`<mirror>/<decoded file name with
   non-word runs collapsed to _>`), and the clean copies are left for try-block
   to mirror and fetch. The map is read off the donor page itself so a re-cut
   clip cannot leave one url behind. */
const MIRROR = 'assets/cinery';
const localName = (url) => `${MIRROR}/${decodeURIComponent(url.split('?')[0].split('/').pop()).replace(/[^\w.\-]+/g, '_')}`;
const CLIPS = 13;

function clipMaps() {
  const page = readFileSync(`${DONORS.cinery.dir}/index.html`, 'utf8');
  const a = page.indexOf('<section class="call-to-action">');
  if (a < 0) throw new Error('cn-produce: cinery index.html has no section.call-to-action');
  const cut = page.slice(a, page.indexOf('</section>', a));
  const images = {};
  const posters = new Set();
  for (const m of cut.matchAll(/data-poster-url="([^"]+)" data-video-urls="([^"]+)"/g)) {
    const [, poster, pair] = m;
    const urls = pair.split(',');
    if (urls.length !== 2) throw new Error(`cn-produce: expected mp4,webm in data-video-urls, got ${pair}`);
    images[pair] = urls.map(localName).join(',');
    images[`${poster}&quot;`] = `${localName(poster)}&quot;`;
    posters.add(poster);
  }
  if (posters.size !== CLIPS) throw new Error(`cn-produce: cinery fans ${CLIPS} distinct clips, found ${posters.size}`);
  return images;
}

export const donor = {
  id: 'cn-produce',
  donor: 'cinery',
  scope: '.cn-produce',
  page: 'index.html',
  start: '<section class="call-to-action">',
  end: '<div class="cta-text">Book a call</div><div class="cta-text">•</div></div></div></div></a></div></section>',

  /* Only <body> painted this black; the two `.circle-opacity` side fades and
     the `.cta-button-background` radial both resolve to the same value. */
  ground: '#000',

  /* Not a substitution: the same donor file the mirror fetches, written in the
     two shapes the extractor cannot scan. See clipMaps(). */
  images: clipMaps(),
};

/** The donor's marquee copy: two rolling rows of three copies each. */
const DONOR_CTA = '<div class="cn-cta-text">Book a call</div>';
const DONOR_CTA_COUNT = 6;

export function render(frag, ctx) {
  const { C, t, escapeHtml } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  if (!S?.headlineTop || !S?.headlineBottom || !S?.cardButton) {
    throw new Error('cn-produce: CAPABILITY_SHOWCASE needs headlineTop, headlineBottom and cardButton');
  }

  /* ---------------------------------------------------------- the heading -- */

  /* Two h2s carrying the same class, one per line box. The gradient is painted
     on each line separately, so the two lines are filled where they stand.
     The donor sets them at 192px, uppercase, and never wraps: measured in the
     donor at 1440, the column is 1360px and "Every" / "Job" / "每一项" / "工作"
     take 573 / 321 / 581 / 387px — comfortably the donor's own "Produce" (837). */
  const BOTTOM = 'cn-bottom-title';
  const splitAt = frag.indexOf(BOTTOM);
  if (splitAt < 0) throw new Error('cn-produce: .bottom-title is not in the cut — the split heading needs both lines');
  if (!frag.slice(0, splitAt).includes('cn-top-title')) throw new Error('cn-produce: .top-title is not in the cut before .bottom-title');

  let html = setText(frag.slice(0, splitAt), 'cn-heading-style-h2', escapeHtml(t(S.headlineTop)))
    + setText(frag.slice(splitAt), 'cn-heading-style-h2', escapeHtml(t(S.headlineBottom)));

  /* ------------------------------------------------------------- the pill -- */

  /* "Start Project" sat over the heading as the action's eyebrow. The button at
     the foot of this block goes to contact.html, so the pill says what the
     navigation already calls that page — resolved by href, not by position. */
  const contact = C.NAV.find((n) => n.href === 'contact.html');
  if (!contact) throw new Error('cn-produce: NAV has no contact.html entry to name the pill');
  html = setText(html, 'cn-subtitle', escapeHtml(t(contact.label)));

  /* ---------------------------------------------------------- the marquee -- */

  /* Six copies of "Book a call", each followed by a "•" glyph. The glyphs
     are the donor's drawing, not its copy, so only the words change — to the
     same label this site's other capability CTA already carries to contact. */
  const parts = html.split(DONOR_CTA);
  if (parts.length - 1 !== DONOR_CTA_COUNT) {
    throw new Error(`cn-produce: cinery ships ${DONOR_CTA_COUNT} marquee copies, found ${parts.length - 1}`);
  }
  html = parts.join(`<div class="cn-cta-text">${escapeHtml(t(S.cardButton))}</div>`);

  /* The button already points at contact.html, which this site has. */
  if (!html.includes('href="contact.html"')) throw new Error('cn-produce: the cta button no longer links to contact.html');

  if (/Cinery|Book a call|Start Project|Produce/.test(html)) throw new Error('cn-produce: donor copy survives in the rendered block');
  return html;
}

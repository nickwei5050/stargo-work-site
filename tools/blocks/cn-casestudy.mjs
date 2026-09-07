/**
 * 为产品和市场做内容 — story 05, on cinery's case-study media grid.
 *
 * Donor: cinery's case-studies page. Four 25rem media tiles inside a frosted
 * glass shell, two per row, laid out as two `case-study-block` rows so the
 * second row can carry its own scroll-driven depth offset (a-34, a translate on
 * Y and Z as the row crosses the viewport). Each tile is one hover unit: the
 * logo lockup slides up to its duplicate and the arrow swaps for a second copy
 * of itself (a-35 / a-36, both addressing `.case-logo`, `.case-arrow._01` and
 * `.case-arrow._02` with `useEventTarget: CHILDREN`, so every tile animates on
 * its own).
 *
 * Four tiles is what the donor draws and four capabilities is what this story
 * needs, so nothing repeats here — the units are filled in place and every
 * data-w-id, inline style and class stays where the donor put it.
 */
import { setText, capability, art } from '../block-lib.mjs';

const CDN = 'https://cdn.prod.website-files.com/';

/* The tile's brand mark. cinery centres a client logo over the media and keeps
   a second copy of it below the fold of a 2.5rem window for the hover slide;
   this site's own wordmark is a real local file, so no icon had to be drawn. */
const WORDMARK = 'assets/brand/stargo-wordmark-600.png';

/* One still per tile. The story names brand-family-01 as its own artwork and
   the family runs to four — the right count and the right subject for a block
   about the material a product story is made of. */
const TILE_ART = ['brand-family-01', 'brand-family-02', 'brand-family-03', 'brand-family-04'].map(art);

/* Every tile is a Webflow background-video atom: a poster .jpg plus an .mp4 and
   a .webm transcode, and those same three urls appear again inside
   data-poster-url, data-video-urls and the <video>'s inline background-image.
   All three are mapped to the tile's own local still, so the poster paints the
   tile and the two <source> elements — which are left exactly where they are —
   point at a file the browser cannot decode as video and therefore stops on,
   with no off-origin request and nothing removed.
   Mapped as exact strings (donor.images) rather than stems: donor.imageStems
   matches `https?://[^\s"]+`, which inside `url(&quot;…&quot;)` swallows the
   closing entity and paren and would leave an unclosed url(). */
const MEDIA = [
  '683f6a1d3749cee9a45775ce%2F6840ae36c2dab521d144e25c_case-study-1',
  '6773dce23469ef07fffcf87e%2F6776fa0ce62367e64242f0fd_case-video-2',
  '6773dce23469ef07fffcf87e%2F6776f8447c59f1e277e1ee94_case-video-03',
  '6773dce23469ef07fffcf87e%2F6776f90cc1fa6522b3738b2d_case-video-01',
];
const LOGOS = [
  '695ec9b0dc241793710ebe5d_logoipsum-317',
  '695ec9b168f333a50648d94d_logoipsum-311',
  '695ec9c93918a42aabdbcd31_logoipsum-280',
  '695ec9d6fbb3c62d106a8b53_logoipsum-323',
];

const images = {};
MEDIA.forEach((base, i) => {
  for (const ext of ['-poster-00001.jpg', '-transcode.mp4', '-transcode.webm']) images[`${CDN}${base}${ext}`] = TILE_ART[i];
});
for (const l of LOGOS) images[`${CDN}695c47e4e7da0bba805165d5/${l}.svg`] = WORDMARK;

export const donor = {
  id: 'cn-casestudy',
  donor: 'cinery',
  scope: '.cn-casestudy',
  page: 'case-studies.html',
  start: '<div class="case-study-component"><div class="case-study-block _01"><div class="w-layout-grid case-study-component-grid">',
  /* Six closing divs, not seven: the seventh belongs to the donor's own
     padding wrapper and taking it leaves the fragment one </div> unbalanced. */
  end: '</a></div></div></div></div></div></div>',
  /* Cut on its own the grid loses the gutter and the 100rem measure it was
     drawn inside. The donor's top spacing came from a `spacer-huge` sibling,
     which is not an ancestor, so only the 8rem bottom padding travels. */
  wrap: ['padding-global', 'container-large', 'padding-bottom padding-xhuge'],
  images,
  /* The donor's stylesheet paints a stock photograph behind this grid as well,
     which is an off-origin request just like an <img> is. It is decoration
     under a frosted-glass shell, and the block already carries this site's own
     artwork in the tiles, so the declaration goes rather than pulling in a
     fifth photograph nobody sees. */
  cssImages: {
    'https://cdn.prod.website-files.com/695c47e4e7da0bba805165af/695fea0be6ff3256aa407acf_pexels-23515909-6664782.jpg': 'none',
  },
  /* Only cinery's own black body carried this block: the pill is #70707026 on
     white type and the glass shell blurs whatever is behind it. */
  ground: '#000',
};

/* Inline SVG in an HTML document is parsed into the SVG namespace whatever the
   markup says, so the arrows' xmlns attribute is inert — and it is the one
   off-origin-looking string left in the fragment. */
const XMLNS = ' xmlns="http://www.w3.org/2000/svg"';

export function render(frag, ctx) {
  const { C, t, escapeHtml, capTitle } = ctx;
  const story = C.CAPABILITY_SHOWCASE.stories[4];
  if (!/内容|content/i.test(t(story.label))) {
    throw new Error(`cn-casestudy: stories[4] is no longer the content story ("${t(story.label)}")`);
  }

  const arrows = frag.split(XMLNS).length - 1;
  if (arrows !== 8) throw new Error(`cn-casestudy: expected two arrow svgs per tile, found ${arrows}`);
  frag = frag.split(XMLNS).join('');

  /* One tile is one <a …>…</a>. Walking them by hand rather than slicing on a
     repeating unit keeps the markup between the two rows — the second row's
     own data-w-id and its grid — untouched. */
  const OPEN = '<a data-w-id="';
  let out = '';
  let at = 0;
  let n = 0;
  for (let s = frag.indexOf(OPEN); s >= 0; s = frag.indexOf(OPEN, at)) {
    const e = frag.indexOf('</a>', s);
    if (e < 0) throw new Error('cn-casestudy: a tile link never closes');
    out += frag.slice(at, s) + tile(frag.slice(s, e + 4), n++);
    at = e + 4;
  }
  out += frag.slice(at);
  if (n !== 4) throw new Error(`cn-casestudy: cinery draws four tiles, found ${n}`);
  return out;

  /** One tile: a capability from the story's picks, on this site's own still. */
  function tile(unit, i) {
    const cap = capability(C, story.picks[i]);

    /* The tile links into the catalogue below, at the group that registers this
       capability — the same anchor the accordion rows carry. */
    if (!/href="[^"]*"/.test(unit)) throw new Error(`cn-casestudy: tile ${i + 1} has no href`);
    unit = unit.replace(/href="[^"]*"/, `href="#g${cap.group.n}"`);

    /* Two marks per tile, the second one the hover slide. Both get the src and
       the alt; only those two attribute values change, so loading, class and
       everything the interaction addresses survive. */
    const alt = escapeHtml(ctx.lang === 'zh' && cap.zhName ? cap.zhName : cap.name);
    let marks = 0;
    unit = unit.replace(/<img\b[^>]*\bclass="[^"]*(?<![-\w])cn-case-logo(?![-\w])[^"]*"[^>]*\/?>/g, (tag) => {
      marks++;
      return tag.replace(/\balt="[^"]*"/, `alt="${alt}"`).replace(/\bsrc="[^"]*"/, `src="${WORDMARK}"`);
    });
    if (marks !== 2) throw new Error(`cn-casestudy: tile ${i + 1} carries ${marks} logo images, expected 2`);

    /* The pill reads: the capability, the donor's own separator, the register's
       gloss. Chinese leads with the Chinese name and keeps the product name as
       a subtitle beneath it, so neither page needs the other language. */
    unit = setText(unit, 'cn-text-style-allcaps', capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? '')));
    return setText(unit, 'cn-text-color-secondary', escapeHtml(t(cap.gloss)));
  }
}

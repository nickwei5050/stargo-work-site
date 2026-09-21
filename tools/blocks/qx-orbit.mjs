/**
 * 一条业务主线 — the nine steps' intro: the orbit hero out of qubix's index.html.
 *
 * Donor: a dotted ring with a two-line word in the middle ("Qubix" / "Studio"),
 * eight photographs parked around it in `.images-rotated-box`, and on the right
 * a 245px window (`.hero-right-top-box`) through which a list of tags rolls
 * upward for ever. Below the window sits a mouse-shaped link whose arrow bobs.
 *
 * What the words become:
 *   - the ring's two lines are the brand, `LX_WORKFORCE.ctaLogo` ("STARGO WORK")
 *     split on its space: STARGO over WORK. The brand is written in Latin
 *     letters on the Chinese page throughout copy.mjs, so it is not an English
 *     leak. HOME_THEATRE ("STARGO OS ©2026") was the other candidate and is too
 *     long for a 342px circle at 64px type.
 *   - the rolling tags are the nine stage codes of HOME_LOOP_TABLE.rows, exactly
 *     as copy.mjs writes them ("01 · DISCOVER" …). They are the same codes the
 *     loop table prints in its first column on both languages, so they read as
 *     codes, not as English. The donor ships six tags in each of two identical
 *     `.home-marquee-box` copies (the second copy is what makes the roll
 *     seamless); each copy is rebuilt to nine by cloning the `.ui-link` unit.
 *   - the eight orbit photographs stay exactly as the donor shipped them,
 *     mirrored into assets/qubix by try-block. So does the ring's own
 *     background PNG, which lives in the stylesheet.
 *
 * What is cut away, and why the shell stays:
 *   The left column of the donor's grid holds three social links (Facebook,
 *   Instagram, X) and "Based In Los Angeles". The brief excludes the social
 *   icons from this block, and every one of those four things would also be a
 *   false claim about this company. But `.hero-wrap` is a three-column grid
 *   (1fr 4fr 1fr) that auto-places its children, so removing the column itself
 *   would slide the ring into the 1fr column and the tags into the 4fr one. The
 *   `.hero-left-box` div is therefore kept — with its w-node id, data-w-id and
 *   inline style — and the social links and the place name go. Its grid cell is
 *   what keeps the ring in the middle; its caption slot now carries the line
 *   that ties the nine steps to the homepage's five stages (see render).
 *
 * Motion — read this before wondering why the block ships a .css:
 *   - The arrow bob (e-77 → a-11, SCROLL_INTO_VIEW on the mouse link) is IX2 and
 *     travels through the extractor as usual.
 *   - The tag roll is IX3 (GSAP): timeline t-9db874f5 on `.ui-link-main-box`,
 *     y 0% → -100%, 15s, linear, repeat -1, fired on `wf:load`. No tool in this
 *     repo carries a donor's IX3 (fuse-ix merges Mono's and Scalora's only), so
 *     the same motion is written as a CSS animation in qx-orbit.css.
 *   - The entrance (a-54 "Hero Load Anim") is IX2 but its event e-264 is
 *     PAGE_START on the donor's own page id, and its action items address the
 *     hero nodes by "<pageId>|<nodeId>". The extractor keeps an event only when
 *     it names one of the block's data-w-ids or classes, so e-264 is left
 *     behind — and every element the fragment ships at `opacity:0;
 *     filter:blur(20px)` would stay that way. qx-orbit.css replays a-54 as CSS
 *     keyframes with the donor's own values, delays and durations, on the same
 *     data-w-id nodes. Should e-264/a-54 ever be carried by the tooling, delete
 *     that part of the css.
 *   - The orbit itself (a-10 "Images Rotated") is IX2 and is dropped the same
 *     way: e-75 is PAGE_START and its target `appliesTo: "PAGE"`, naming the
 *     donor's page and none of this block's nodes. Without it the ring of
 *     photographs — the whole point of the composition — stood still, which is
 *     the defect the owner reported. qx-orbit.css replays it too: the ring turns
 *     360deg in 30s, linear, for ever, and each photograph turns 360 → 0 over
 *     the same 30s so the pictures stay upright as they travel. Same note: if
 *     e-75/a-10 are ever carried by the tooling, delete that part of the css.
 */
import { setText } from '../block-lib.mjs';

export const donor = {
  id: 'qx-orbit',
  donor: 'qubix',
  scope: '.qx-orbit',
  page: 'index.html',
  /* The grid, not the section: the section and container are put back as
     wrappers so their padding rules are extracted with everything else. */
  start: '<div class="hero-wrap">',
  end: 'alt="Image" class="mouse-image"/></div></div></a></div></div>',
  wrap: ['hero-section', 'w-layout-blockcontainer container w-container'],
  /* No picture is substituted: every photograph, the ring PNG and the arrow SVG
     are the donor's own, mirrored into assets/qubix by try-block. The three
     entries below are not images at all — they are the social links' hrefs,
     which the extractor's off-origin check refuses as unmapped assets. They are
     neutralised here (`images` is an exact-string substitution) so the
     `.hero-left-box` shell can stay in the fragment; render() then removes the
     links themselves, so no "#" anchor ever reaches the page. */
  images: {
    'https://www.facebook.com/': '#',
    'https://www.instagram.com/': '#',
    'https://x.com/': '#',
  },
  /* The hero paints nothing itself; qubix's black `body` was its ground. */
  ground: '#000',
};

/** The nine stage codes from the loop table's first column -- "01 · DISCOVER" on
    the English page, "01 · 发现" on the Chinese one, which shows Chinese only. */
function stageCodes(C, lang) {
  const rows = C.HOME_LOOP_TABLE?.rows;
  if (!Array.isArray(rows) || rows.length !== 9) {
    throw new Error(`qx-orbit: HOME_LOOP_TABLE.rows should hold nine stages, has ${rows?.length}`);
  }
  return rows.map((r, i) => {
    if (typeof r[0] !== 'string' || !r[0]) throw new Error(`qx-orbit: stage ${i + 1} has no code`);
    if (lang !== 'zh') return r[0];
    const [num, word] = r[0].split(' · ');
    const zh = C.HOME_LOOP_TABLE.stageNames?.[word];
    if (!zh) throw new Error(`qx-orbit: stage ${word} has no Chinese name in HOME_LOOP_TABLE.stageNames`);
    return `${num} · ${zh}`;
  });
}

export function render(frag, ctx) {
  const { C, t, escapeHtml } = ctx;
  let html = frag;

  /* ------------------------------------------------ the left column ---- */
  /* Keep the cell, drop the social links, and give the donor's own caption
     slot — `.hero-left-bottom-box > .body`, where qubix wrote "Based In Los
     Angeles" — the one sentence this section owes the reader (V5 P02): these
     nine steps are the same business journey as the homepage's five stages,
     read in detail, not a second system (HOME_LOOP_TABLE.note). The globe icon
     that sat beside the place name goes with it: it was a location marker.
     The box's contents run up to the ring's own grid item, which is the next
     sibling. */
  const note = C.HOME_LOOP_TABLE?.note;
  if (!note) throw new Error('qx-orbit: HOME_LOOP_TABLE.note is missing — the section must say how the nine steps relate to the five stages');
  const LEFT = /(<div id="w-node-_95c2694c[^"]*" data-w-id="95c2694c-a097-148d-d560-40e2eb648777"[^>]*class="qx-hero-left-box">)([\s\S]*?)(<\/div><div id="w-node-c6f775c5)/;
  if (!LEFT.test(html)) throw new Error('qx-orbit: the hero-left-box shell is not where the donor put it');
  html = html.replace(LEFT, (m, open, inner, close) => {
    if (!/class="qx-hero-socail-link/.test(inner)) {
      throw new Error('qx-orbit: the left column no longer holds the social links; re-check the cut');
    }
    const BOTTOM = /<div class="qx-hero-left-bottom-box"><img [^>]*alt="Image"\/><div class="qx-body">Based In Los Angeles<\/div><\/div>/;
    const bottom = BOTTOM.exec(inner);
    if (!bottom) throw new Error('qx-orbit: the left column lost its caption slot (hero-left-bottom-box > body)');
    return `${open}<div class="qx-hero-left-bottom-box"><div class="qx-body qx-orbit-note">${escapeHtml(t(note))}</div></div>${close}`;
  });

  /* ---------------------------------------------------- the ring ---- */
  const brand = t(C.LX_WORKFORCE.ctaLogo);
  const words = brand.trim().split(/\s+/);
  if (words.length !== 2) throw new Error(`qx-orbit: expected a two-word brand in LX_WORKFORCE.ctaLogo, got "${brand}"`);
  html = setText(html, 'qx-hero-rotated-info-text', escapeHtml(words[0]));
  html = setText(html, 'qx-hero-rotated-info-text-two', escapeHtml(words[1]));

  /* ---------------------------------------------------- the tags ---- */
  const codes = stageCodes(C, ctx.lang);
  const UNIT = /<div class="qx-ui-link"><div class="qx-hero-tag-text">[^<]*<\/div><\/div>/g;
  const LIST = /(<div class="qx-ui-link-main-box">)((?:<div class="qx-ui-link"><div class="qx-hero-tag-text">[^<]*<\/div><\/div>)+)(<\/div>)/g;
  let lists = 0;
  html = html.replace(LIST, (m, open, units, close) => {
    lists++;
    const found = units.match(UNIT) ?? [];
    if (found.length !== 6) throw new Error(`qx-orbit: qubix ships six tags per marquee box, found ${found.length}`);
    const unit = found[0];
    const rebuilt = codes.map((code) => setText(unit, 'qx-hero-tag-text', escapeHtml(code))).join('');
    return `${open}${rebuilt}${close}`;
  });
  if (lists !== 2) throw new Error(`qx-orbit: expected two marquee boxes (the roll needs its duplicate), found ${lists}`);

  /* ------------------------------------------------- the mouse link ---- */
  /* The donor's arrow jumps to the section under the hero. This block is the
     loop's intro, so it jumps to the loop. */
  if (!html.includes('href="#Jump-Section"')) throw new Error('qx-orbit: the mouse link lost its donor href');
  html = html.replace('href="#Jump-Section"', 'href="#loop"');

  /* The link has no text of its own; the arrow's alt names where it goes,
     with the loop table's own title. Every other image is decoration beside a
     ring that already says the brand, and stops announcing itself as "Image". */
  const MOUSE_ALT = 'alt="Image" class="qx-mouse-image"';
  if (!html.includes(MOUSE_ALT)) throw new Error('qx-orbit: the mouse arrow lost its alt attribute');
  html = html.replace(MOUSE_ALT, `alt="${escapeHtml(t(C.HOME_LOOP_TABLE.title))}" class="qx-mouse-image"`);
  const photos = (html.match(/alt="Image"/g) ?? []).length;
  if (photos !== 8) throw new Error(`qx-orbit: expected the eight orbit photographs, found ${photos} images left`);
  html = html.replace(/alt="Image"/g, 'alt=""');

  return html;
}

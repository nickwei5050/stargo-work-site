/**
 * 一条业务主线 / One business journey — the title card that opens the nine-step
 * section (HOME_LOOP_TABLE.title).
 *
 * Donor: renok's "Award winning /Studio" card at the top of index.html's
 * `.rt-wave-vector-main-wrapper.rt-v2` section. Three centred lines of
 * extra-big display type — two in the grotesque, the third an italic serif
 * with a leading slash — with a chrome 3-D cursor and two floating label chips
 * anchored around them, on the section's own black-to-white gradient.
 *
 * ---- the cut ----
 *
 * The heading lines are driven by the SECTION, not by themselves: e-1905 is a
 * SCROLLING_IN_VIEW event on the section's data-w-id whose action list (a-126)
 * slides `.rt-awards-first-text` 60% right, `.rt-awards-second-text` 60% left
 * and blurs them as the block scrolls past — the parallax scatter the donor is
 * known for. So the cut starts at the `<section data-w-id=…>` open tag. It ends
 * where the review screenshot ends: the close of `.rt-awards`, before the
 * `.rt-insight` list that the same donor section goes on to hold (that list is
 * its own block, tools/fragments/rk-insight.html). `render` closes the section
 * it opened; nothing inside the cut is removed.
 *
 * ---- what moves ----
 *
 *   e-1905  section    scroll-progress parallax + blur on the three lines (a-126)
 *   e-1906/8/10 lines  slideInLeft / slideInRight / slideInLeft on entering view
 *   e-1912  cursor     a-127 "Small button move", looping drift
 *   e-1914/16 chips    a-128 "Small button move V2", looping drift
 *
 * Every data-w-id stays on the node it shipped on, and the chips keep the
 * `.rt-small-move-wrap` class a-127/a-128 address under useEventTarget:CHILDREN.
 *
 * ---- the chips ----
 *
 * The donor's two chips are IMAGES with the words baked in: "Development" is an
 * SVG of outlined glyphs, "UI/UX" a PNG wrapped in an SVG. Shipped as they are
 * they would say, in English on the Chinese page, that this company sells UI/UX
 * and development — donor copy and a false claim, not decoration. The brief is
 * to change the words and nothing else, and here the words live inside the
 * picture, so the picture is redrawn with the donor's own geometry and the new
 * word: the same 28px white capsule with a 14px radius and one squared tail
 * corner, the donor's nub path verbatim, the same 16px bold black label with
 * the donor's 16px side padding, the same 47px canvas. Only the capsule's
 * length follows the label, exactly as the donor's two chips differ from each
 * other. They are inline `data:` SVGs because the label differs per language,
 * so a single mirrored file could not carry both; the donor's originals are
 * still mirrored into assets/renok by try-block and left untouched.
 *
 * The labels are the journey's two ends — CAP_JUMPS[0] 获客/Prospects on the
 * chip beside the first line, CAP_JUMPS[3] 经营/Operations beside the last —
 * the front and the back office the one business journey joins. The donor has
 * two chips, so two labels.
 */
import { setText } from '../block-lib.mjs';

export const donor = {
  id: 'rk-award',
  donor: 'renok',
  scope: '.rk-award',
  page: 'index.html',
  start: '<section data-w-id="20caf5ff-0547-bd17-ff39-eab7eb89a944" class="rt-wave-vector-main-wrapper rt-v2">',
  end: 'home-one-ui-ux-icon.svg" loading="lazy" alt=""/></div></div></div></div></div>',
  /* No image maps: the cursor and both chip files are renok's own and are
     mirrored into assets/renok by try-block. The chips' words are replaced at
     render time (see above); the files themselves are not swapped. */
};

/* ------------------------------------------------------------- the chips -- */

/** The donor's chip files, as the extractor rewrites them into the mirror. */
const CHIP_TOP = 'assets/renok/69847e86e691d633d040ba84_home-one-development-icon.svg';
const CHIP_BOTTOM = 'assets/renok/69847e862025273c55818678_home-one-ui-ux-icon.svg';

/**
 * Approximate advance width of a label in the donor's 16px bold face. Only the
 * capsule's length depends on it, and by a few pixels of padding at most.
 */
function labelWidth(label) {
  let w = 0;
  for (const ch of label) {
    if (/[\u3000-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(ch)) w += 16;      // CJK: one em
    else if (/[A-Z]/.test(ch)) w += 11;
    else if (/[a-z0-9]/.test(ch)) w += 9;
    else if (ch === ' ') w += 4.5;
    else w += 6;                                                             // slash, dots
  }
  return Math.round(w);
}

/**
 * One chip in the donor's drawing. `tail` says where the nub sits:
 *   'bottom-left' is the donor's "Development" chip (capsule top, nub below-left);
 *   'top-right'   is its "UI/UX" chip (capsule bottom, nub above-right) — the
 *                 same drawing turned half a turn, which is what the donor did.
 *
 * Geometry lifted from home-one-development-icon.svg: canvas height 47, capsule
 * y 0–28 with x from 19, radius 14, the corner nearest the nub left square;
 * glyphs from x 35 (16px in) with caps between y 8.4 and 20; nub path as shipped.
 */
function chip(label, tail) {
  const W = labelWidth(label) + 32;                  // 16px padding each side, as the donor
  const x0 = 19, x1 = x0 + W;
  const total = x1;                                  // canvas width
  const capsule = `M${x1} 14C${x1} 21.732 ${x1 - 6.268} 28 ${x1 - 14} 28L${x0} 28L${x0} 10C${x0} 4.47717 ${x0 + 4.4772} 0 ${x0 + 10} 0L${x1 - 14} 0C${x1 - 6.268} 0 ${x1} 6.26801 ${x1} 14Z`;
  const nub = 'M3.68483 45.8079L13.9634 42.4824C15.3677 42.0281 15.8129 40.2613 14.7917 39.1957L7.83858 31.9403C6.78647 30.8424 4.94254 31.2738 4.48662 32.7244L1.1612 43.3053C0.674233 44.8547 2.13954 46.3078 3.68483 45.8079Z';
  const turn = tail === 'top-right' ? ` transform="rotate(180 ${total / 2} 23.5)"` : '';
  /* The label is not turned with the drawing; it sits in the capsule wherever
     the capsule ends up. Baseline 20 in the donor's frame, 47-... when turned. */
  const cy = tail === 'top-right' ? 47 - 14 : 14;
  const text = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="47" viewBox="0 0 ${total} 47" fill="none">` +
    `<g${turn}><path d="${capsule}" fill="white"/><path d="${nub}" fill="white"/></g>` +
    `<text x="${tail === 'top-right' ? total - x0 - W / 2 : x0 + W / 2}" y="${cy}" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="'Inter Tight',Inter,'Segoe UI',Arial,sans-serif" font-weight="700" font-size="16" fill="black">${text}</text>` +
    `</svg>`;
  /* Colons and slashes stay percent-encoded on purpose: the svg namespace is
     an `http://` string, and this site's checks count every `http://` in the
     markup as an off-origin request. Browsers decode it identically. */
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, ' ').replace(/%3D/g, '=')}`;
}

/* ---------------------------------------------------------------- render -- */

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  const T = C.HOME_LOOP_TABLE;
  if (!T?.title) throw new Error('rk-award: HOME_LOOP_TABLE.title is missing from copy.mjs');
  const title = t(T.title);

  /* Three slots, three lines. The donor breaks "Award / winning / Studio" and
     sets the last line in the italic serif, which has no CJK glyphs: the accent
     therefore stays out of Chinese on both pages, as the hero's already does
     (CAPABILITY_SHOWCASE.heroAccent). English: the title's own last word behind
     the donor's slash ("One / business / /journey"). Chinese: the title split
     at its phrase break — 一条业务 / 主线, the same four-and-two shape the old
     一个外贸 / 闭环 had — and, since an English word has no place on the
     Chinese page, the accent is the step count the rows below number up to
     ("/09"): digits are the one thing the serif draws that reads the same in
     both languages. */
  const steps = C.HOME_LOOP_TABLE.rows?.length;
  if (steps !== 9) throw new Error(`rk-award: the accent counts the loop's nine steps, found ${steps}`);
  const lines = lang === 'zh'
    ? ['一条业务', '主线', `/${String(steps).padStart(2, '0')}`]
    : (() => {
        const words = title.split(' ');
        if (words.length !== 3) throw new Error(`rk-award: "${title}" does not split into the donor's three lines`);
        return [words[0], words[1], `/${words[2]}`];
      })();
  if (lang === 'zh' && title !== '一条业务主线') throw new Error(`rk-award: the Chinese title changed to "${title}"; re-split it`);

  let html = frag;
  /* The donor's lines end in a `<br/>` inside the div (lines 1 and 2); it is
     structure and stays. setText replaces the whole inner, so it is re-added. */
  for (const [i, [id, text, br]] of [
    ['b8b75ad9-89c8-5a50-4d16-33d7f8da561f', lines[0], '<br/>'],
    ['ef7a76e0-f5ac-f3c7-8909-e195dde7fd71', lines[1], '<br/>'],
    ['008a0cd7-7a77-f972-0f0a-d95d6154d580', lines[2], ''],
  ].entries()) {
    const re = new RegExp(`(<div data-w-id="${id}" class="[^"]*rk-rt-extra-big-text[^"]*">)([\\s\\S]*?)(</div>)`);
    const m = re.exec(html);
    if (!m) throw new Error(`rk-award: heading line ${i + 1} (${id}) is not in the fragment`);
    if ((m[2].includes('<br/>') ? '<br/>' : '') !== br) throw new Error(`rk-award: heading line ${i + 1} changed shape`);
    html = html.replace(re, (all, open, inner, close) => `${open}${escapeHtml(text)}${br}${close}`);
  }

  /* ---- the chips: the loop's first and last stage ---- */
  const J = C.CAP_JUMPS;
  if (!J?.[0]?.label || !J?.[3]?.label) throw new Error('rk-award: CAP_JUMPS no longer has a first and a fourth stage');
  for (const [file, label, tail] of [
    [CHIP_TOP, t(J[0].label), 'bottom-left'],
    [CHIP_BOTTOM, t(J[3].label), 'top-right'],
  ]) {
    const tag = `<img src="${file}" loading="lazy" alt=""/>`;
    if (!html.includes(tag)) throw new Error(`rk-award: chip ${file} is not in the fragment as shipped`);
    html = html.replace(tag, `<img src="${chip(label, tail)}" loading="lazy" alt="${escapeHtml(label)}"/>`);
  }

  /* The cut opened the donor's section and stopped before its next child. */
  if (!html.startsWith('<section ')) throw new Error('rk-award: the fragment no longer starts at the donor section');
  if (html.includes('</section>')) throw new Error('rk-award: the fragment already closes the section; the cut moved');
  html += '</section>';

  /* Fail loudly rather than ship a slot that quietly missed. */
  /* The chip WRAPPERS keep their donor classes (`rk-rt-development-icon`,
     `rk-rt-ui-ux-icon`) — a-128 and the position rules bind to them — so the
     check is for the image files, not the class names. */
  const left = ['Award', 'winning', 'Studio', 'UI/UX', 'Development', 'development-icon.svg', 'ui-ux-icon.svg']
    .filter((w) => html.includes(w));
  if (left.length) throw new Error(`rk-award: donor copy survived: ${left.join(', ')}`);

  return html;
}

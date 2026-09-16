/**
 * 为产品和市场做内容 — story 05 of the capability showcase.
 *
 * Donor: cinery's "Quick Answers" FAQ (index.html, `section.section-home-faq`).
 * A gradient split heading — pill, two `.title-wrapper` lines, a big "(05)"
 * counter placed by a `#w-node-…` grid rule — over a two-column grid: an
 * accordion of numbered questions with a `+` button, a "Need more details?"
 * line beside a roll-over button, and a tall portrait photo card on the right.
 *
 * The donor draws five rows; this story picks seven capabilities, so one row is
 * cloned. Every clone keeps its own row's data-w-id: the accordion's open/close
 * is bound to those ids with useEventTarget: CHILDREN, so the copies animate
 * independently (proven on the site's existing cinery accordion).
 *
 * The heading slots hold one English word per line at 192px ("QUICK" /
 * "ANSWERS"), which the story label — "为产品和市场做内容" / "Create content for
 * products and markets" — cannot split into. The two lines therefore carry the
 * two words of the story's own primary catalogue group, 09 "内容、GEO 与创意" /
 * "Content, GEO & Creative": 内容 / 创意, Content / Creative. The full label
 * moves into the pill, where the donor put "FAQ".
 *
 * The portrait stays; only its alt changes. The block paints no ground of its
 * own (cinery's `body` is black), so the ground is declared below — and the
 * rest of that `body` rule (cinery's typeface, text colour, base size and
 * regular weight, which everything but the split heading inherits) is restated
 * in tools/blocks/cn-faq.css, where a cut section's lost <body> belongs.
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[4]. */
const STORY = 4;
/** The group whose name supplies the two heading words. */
const HEADING_GROUP = '09';

export const donor = {
  id: 'cn-faq',
  donor: 'cinery',
  scope: '.cn-faq',
  page: 'index.html',
  start: '<section class="section-home-faq">',
  end: '<div class="dividing-line"></div></div></div></section>',
  /* Only cinery's <body> painted this black; every word in the block is white
     or grey and the row fill is a near-black. */
  ground: '#000',
};

/** Every image in the cut carries this one alt string. */
const DONOR_ALT = 'alt="Image - Cinery Template"';
/** The donor's button goes to its contact page; this site has one of its own. */
const DONOR_HREF = 'href="contact.html"';

/**
 * The two heading words. Group 09's name is "内容、GEO 与创意" / "Content, GEO &
 * Creative" — its first and last words, read straight out of the register so a
 * renamed group fails here instead of drifting.
 */
const HEADING_WORDS = { zh: ['图片', '视频'], en: ['Images', 'Video'] };

function headingWords(C, lang) {
  const g = C.CAPABILITY_GROUPS.find((x) => x.n === HEADING_GROUP);
  if (!g) throw new Error(`cn-faq: CAPABILITY_GROUPS has no group ${HEADING_GROUP}`);
  const words = HEADING_WORDS[lang];
  if (!words) throw new Error(`cn-faq: no heading words for language ${lang}`);
  for (const w of words) {
    if (!g.name[lang]?.includes(w)) throw new Error(`cn-faq: heading word "${w}" is no longer part of group ${HEADING_GROUP}'s name "${g.name[lang]}"`);
  }
  return words;
}

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`cn-faq: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  if (!story.picks?.length) throw new Error('cn-faq: story 05 has no picks');

  /* ------------------------------------------------------------ the cut -- */
  const rows = [...frag.matchAll(/<div data-w-id="[^"]*" class="cn-accordion-content-item">/g)];
  if (rows.length !== 5) throw new Error(`cn-faq: cinery draws five accordion rows, found ${rows.length}`);
  if (!frag.slice(0, rows[0].index).includes('cn-subtitle-block')) throw new Error('cn-faq: the heading pill is not before the first row');

  /* The rows close, then `.faq-container` and the inner `section.faq`; the
     "Need more details?" block and the photograph are what follows. */
  const TAIL = '</div></section></div><div id="w-node-';
  const tailAt = frag.indexOf(TAIL, rows[rows.length - 1].index);
  if (tailAt < 0) throw new Error('cn-faq: the accordion no longer closes into the question block');

  const head = frag.slice(0, rows[0].index);
  const units = rows.map((m, i) => frag.slice(m.index, rows[i + 1]?.index ?? tailAt));
  const tail = frag.slice(tailAt);

  /* -------------------------------------------------------- the opening -- */
  const BOTTOM = 'cn-bottom-title';
  const splitAt = head.indexOf(BOTTOM);
  if (splitAt < 0) throw new Error('cn-faq: .bottom-title is not in the cut — the split heading needs both lines');

  const [top, bottom] = headingWords(C, lang);
  let open = setText(head.slice(0, splitAt), 'cn-heading-style-h2', escapeHtml(top))
    + setText(head.slice(splitAt), 'cn-heading-style-h2', escapeHtml(bottom));

  /* The pill: the story's own label, where the donor said "FAQ". */
  open = setText(open, 'cn-subtitle', escapeHtml(t(story.label)));

  /* The counter: cinery's `.section-number` numbers the section, not its
     contents — the donor's home page runs (01)…(06) and this block is its
     (05). Ours is the showcase's story 05, and the build ships it as
     `#story-5`, so the same numeral is our own index rather than the donor's
     string. The donor numeral is asserted first, so a re-cut fails loudly
     instead of silently printing a number over nothing. */
  const donorNumber = /<h2[^>]*class="[^"]*cn-section-number[^"]*"[^>]*>\(\d\d\)<\/h2>/;
  if (!donorNumber.test(open)) throw new Error('cn-faq: the section counter is no longer the donor numeral');
  open = setText(open, 'cn-section-number', `(${String(STORY + 1).padStart(2, '0')})`);

  /* ----------------------------------------------------------- the rows -- */
  /* Seven picks over five donor rows: fill the five, then clone. Each clone is
     the row at the same position modulo five, so it carries that row's own
     data-w-id and the accordion interaction binds to it. */
  const filled = story.picks.map((pick, i) => {
    const cap = capability(C, pick);
    const unit = units[i % units.length];
    const title = `${i + 1}. ${capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? ''))}`;
    let u = setText(unit, 'cn-accordion-heading', title);
    return setText(u, 'cn-accordion-answer-text', escapeHtml(t(cap.gloss)));
  });

  /* ------------------------------------------------------------ the tail -- */
  /* "◉ Need more details?" — the marker is copy, not markup; keep it and change
     the words after it. The line shares one `space-between` flex row with the
     roll-over button, and the button is `overflow: hidden` around a `nowrap`
     label, so whatever stands here has to leave the button its width. At 992 —
     the narrowest the two-column grid ever gets — the pair share a 424px
     column and "Discuss your workflow" measures 273px, leaving ~150px; the
     donor's own line measures 149px. Naming the story's catalogue groups came
     to 373px in English and cut 71px off the button's label between 992 and
     1440, so the line carries the showcase's own catalogue label instead —
     which is what the rows above it are. */
  const QLINE = /(<div class="cn-text-size-regular">)([^<]*)(<\/div>)/;
  const q = QLINE.exec(tail);
  if (!q) throw new Error('cn-faq: the question block has no .text-size-regular line');
  const marker = q[2].replace(/[A-Za-z][\s\S]*$/, '');
  if (!marker.trim()) throw new Error('cn-faq: the question line lost its ◉ marker');
  if (!S.inCatalogue) throw new Error('cn-faq: CAPABILITY_SHOWCASE has no inCatalogue label');
  /* The story still has to declare the group the heading words come from. */
  if (!story.groups?.includes(HEADING_GROUP)) throw new Error(`cn-faq: story 05 no longer declares group ${HEADING_GROUP}, which supplies the heading`);
  let end = tail.replace(QLINE, (m, a, b, c) => `${a}${marker}${escapeHtml(t(S.inCatalogue))}${c}`);

  /* A roll-over button: two copies of the word, kept in step. */
  end = setTextAll(end, 'cn-button-text', escapeHtml(t(S.cardButton)));
  if (!end.includes(DONOR_HREF)) throw new Error(`cn-faq: the button no longer carries ${DONOR_HREF}`);

  /* The portrait: the donor's own photograph, named for what the block is about. */
  const alts = end.split(DONOR_ALT).length - 1;
  if (alts !== 1) throw new Error(`cn-faq: expected one ${DONOR_ALT} on the portrait, found ${alts}`);
  end = end.replace(DONOR_ALT, `alt="${escapeHtml(t(story.label))}"`);

  const html = open + filled.join('') + end;
  /* "(05)" is not on this list: the counter is the story's own index, and it
     happens to be the number cinery printed in the same slot. */
  if (/Cinery|Need more details|Ask a Question|video projects|Quick|Answers/.test(html)) throw new Error('cn-faq: donor copy survives in the rendered block');
  return html;
}

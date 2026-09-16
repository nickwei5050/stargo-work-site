/**
 * AI 作图、视频与营销内容 — story 05 of the capability showcase.
 *
 * Donor: cinery's "Quick Answers" FAQ (index.html, `section.section-home-faq`).
 * A gradient split heading — pill, two `.title-wrapper` lines, a big "(05)"
 * counter placed by a `#w-node-…` grid rule — over a two-column grid: an
 * accordion of numbered questions with a `+` button, a "Need more details?"
 * line beside a roll-over button, and a tall portrait photo card on the right.
 *
 * The donor draws five rows; this section has seven topics (V6 §5.6), so two
 * rows are cloned. Every clone keeps its own row's data-w-id: the accordion's
 * open/close is bound to those ids with useEventTarget: CHILDREN, so the copies
 * animate independently (proven on the site's existing cinery accordion).
 *
 * The seven topics and their answers are `CREATIVE_TOPICS` (tools/copy.mjs,
 * V6 B). Each answer is several paragraphs, a short step row for the video and
 * adaptation topics, and a closing line of conditions — block content, so it
 * fills the row's `.cn-accordion-content-block` rather than the single donor
 * `<p>` (a `<p>` cannot hold paragraphs or a list). The opening is still
 * cinery's Webflow IX2 auto-height tween: it measures the wrap's natural
 * height at click time and clears the inline height when it lands, so a
 * longer answer is never cut off (cap-map §8; checked in the browser).
 *
 * Each row carries a stable id (`creative-images` … `creative-assets`) so other
 * pages can link to one topic; tools/blocks/cn-faq.js scrolls to it and opens
 * it through the same interaction. Without JavaScript nothing is collapsed and
 * every answer is simply there to read.
 *
 * The heading slots hold one English word per line at 192px ("QUICK" /
 * "ANSWERS"), which no sentence can split into. The two lines therefore carry
 * two words of this section's own catalogue group, 09 「AI 图片、视频与营销」 /
 * "AI Images, Video & Marketing": 图片 / 视频, Images / Video. The section's
 * name moves into the pill, where the donor put "FAQ".
 *
 * The photograph card holds this site's own editorial picture for images and
 * video — the precision aperture the homepage already uses for its AI creative
 * slot — in place of cinery's portrait of a man with a film camera. V6 §5.6's
 * conservative option is one picture for the whole creative scope, and §10
 * asks that a picture and its words say the same thing: a studio portrait
 * reads as a film crew, which this section does not offer. The card, its
 * frame, its crop (`object-fit: cover`) and its placement are the donor's.
 *
 * The block paints no ground of its own (cinery's `body` is black), so the
 * ground is declared below — and the rest of that `body` rule (cinery's
 * typeface, text colour, base size and regular weight, which everything but
 * the split heading inherits) is restated in tools/blocks/cn-faq.css, where a
 * cut section's lost <body> belongs.
 */
import { setText, setTextAll, capability } from '../block-lib.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[4]. */
const STORY = 4;
/** The group whose name supplies the two heading words, and the catalogue row the question line links to. */
const HEADING_GROUP = '09';
/** V6 §5.6: seven topics, the donor accordion's count plus two clones. */
const TOPICS = 7;
/** The one editorial picture (tools/editorial-images.mjs gives it its alt, size and srcset). */
const PICTURE = 'os-boot';

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
 * The two heading words, each checked against group 09's name
 * (「AI 图片、视频与营销」 / "AI Images, Video & Marketing") so a renamed group
 * fails here instead of drifting.
 */
const HEADING_WORDS = { zh: ['图片', '视频'], en: ['Images', 'Video'] };

function headingGroup(C) {
  const g = C.CAPABILITY_GROUPS.find((x) => x.n === HEADING_GROUP);
  if (!g) throw new Error(`cn-faq: CAPABILITY_GROUPS has no group ${HEADING_GROUP}`);
  return g;
}

function headingWords(C, lang) {
  const g = headingGroup(C);
  const words = HEADING_WORDS[lang];
  if (!words) throw new Error(`cn-faq: no heading words for language ${lang}`);
  for (const w of words) {
    if (!g.name[lang]?.includes(w)) throw new Error(`cn-faq: heading word "${w}" is no longer part of group ${HEADING_GROUP}'s name "${g.name[lang]}"`);
  }
  return words;
}

/**
 * The topics, checked against what the story used to show. V6 regrouped the
 * seven catalogue rows into seven topics and said none of the old content goes
 * away; `covers` records where each old row went, and every one of them has to
 * land somewhere, in a group the story declares.
 */
function topics(C, story) {
  const T = C.CREATIVE_TOPICS;
  if (!T?.items) throw new Error('cn-faq: copy.mjs has no CREATIVE_TOPICS');
  if (T.items.length !== TOPICS) throw new Error(`cn-faq: V6 names ${TOPICS} creative topics, CREATIVE_TOPICS has ${T.items.length}`);
  for (const key of ['label', 'catalogueLink', 'noteLabel']) if (!T[key]?.zh || !T[key]?.en) throw new Error(`cn-faq: CREATIVE_TOPICS.${key} needs both languages`);
  const ids = new Set();
  const covered = new Set();
  for (const x of T.items) {
    if (!/^creative-[a-z]+$/.test(x.id ?? '')) throw new Error(`cn-faq: topic id "${x.id}" is not a creative-… anchor`);
    if (ids.has(x.id)) throw new Error(`cn-faq: two topics share the id ${x.id}`);
    ids.add(x.id);
    if (!x.title?.zh || !x.title?.en || !x.note?.zh || !x.note?.en) throw new Error(`cn-faq: topic ${x.id} needs a title and a note in both languages`);
    if (!x.body?.length || x.body.some((p) => !p.zh || !p.en)) throw new Error(`cn-faq: topic ${x.id} needs its paragraphs in both languages`);
    if (x.flow && (x.flow.steps.zh.length !== x.flow.steps.en.length || x.flow.steps.zh.length < 2)) throw new Error(`cn-faq: topic ${x.id}'s step row must list the same steps in both languages`);
    if (x.keep && !(Array.isArray(x.keep.zh) && Array.isArray(x.keep.en))) throw new Error(`cn-faq: topic ${x.id}'s keep must be a list per language`);
    if (!x.covers?.length) throw new Error(`cn-faq: topic ${x.id} covers no catalogue entry`);
    for (const name of x.covers) {
      const cap = capability(C, name);
      if (!story.groups.includes(cap.group.n)) throw new Error(`cn-faq: topic ${x.id} covers "${name}" from group ${cap.group.n}, which story 05 does not declare`);
      covered.add(name);
    }
  }
  for (const pick of story.picks) if (!covered.has(pick)) throw new Error(`cn-faq: "${pick}" was a row of this section and no creative topic covers it`);
  return T;
}

/**
 * A row's question: the number the donor's questions carry, the topic's name
 * with its `keep` runs set `nowrap`, and a status after 「 · 」 kept whole and
 * tied to the dot by a no-break space — so a wrapped title never starts a
 * line with the dot or splits 「建设中」 / "In Development". Each run must be
 * found in the title, or the build stops: a reworded title would otherwise
 * lose its protection without anyone noticing.
 */
function question(x, i, t, escapeHtml) {
  const KEEP = (s) => `<span class="cn-keep">${s}</span>`;
  const full = t(x.title);
  const dot = full.lastIndexOf(' · ');
  const name = dot < 0 ? full : full.slice(0, dot);
  const status = dot < 0 ? '' : full.slice(dot + 3);
  let html = escapeHtml(name);
  for (const run of (x.keep ? t(x.keep) : [])) {
    const at = html.indexOf(escapeHtml(run));
    if (at < 0) throw new Error(`cn-faq: topic ${x.id} keeps "${run}", which is not in its title "${name}"`);
    html = html.slice(0, at) + KEEP(escapeHtml(run)) + html.slice(at + escapeHtml(run).length);
  }
  /* U+00A0 before the dot, an ordinary space after it: a wrapped title may
     break only after 「·」. */
  return `${i + 1}. ${html}${status ? `\u00a0· ${KEEP(escapeHtml(status))}` : ''}`;
}

/** One answer: the step row (if any), the paragraphs, then the conditions. */
function answer(x, T, t, escapeHtml) {
  const P = (inner, cls = '') => `<p class="cn-accordion-answer-text${cls}">${inner}</p>`;
  let html = '';
  if (x.flow) {
    const steps = t(x.flow.steps);
    /* An ordered list, so a screen reader hears the steps as a sequence; the
       arrows between the chips are drawn for the eye only. */
    html += `<ol class="cn-answer-flow" aria-label="${escapeHtml(t(x.flow.label))}">`
      + steps.map((s, k) => `<li class="cn-answer-step"><span class="cn-answer-step-text">${escapeHtml(s)}</span>`
        + (k < steps.length - 1 ? '<span class="cn-answer-arrow" aria-hidden="true">→</span>' : '') + '</li>').join('')
      + '</ol>';
  }
  html += x.body.map((p) => P(escapeHtml(t(p)))).join('');
  html += P(`<strong class="cn-answer-label">${escapeHtml(t(x.noteLabel ?? T.noteLabel))}</strong>${escapeHtml(t(x.note))}`, ' cn-answer-note');
  return html;
}

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, art } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`cn-faq: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  if (!story.picks?.length) throw new Error('cn-faq: story 05 has no picks');
  /* The story still has to declare the group the heading words come from. */
  if (!story.groups?.includes(HEADING_GROUP)) throw new Error(`cn-faq: story 05 no longer declares group ${HEADING_GROUP}, which supplies the heading`);
  const T = topics(C, story);
  const group = headingGroup(C);

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

  /* The pill: the section's name, where the donor said "FAQ". */
  open = setText(open, 'cn-subtitle', escapeHtml(t(T.label)));

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
  /* Seven topics over five donor rows: fill the five, then clone. Each clone is
     the row at the same position modulo five, so it carries that row's own
     data-w-id and the accordion interaction binds to it. */
  const ROW_OPEN = '<div data-w-id="';
  /* The answer block holds exactly the donor's one paragraph; it is replaced
     whole. The paragraph has no <div> inside it, so the first </div> after the
     block's opening tag is the block's own. */
  const BLOCK = /(<div class="cn-accordion-content-block">)(<p class="cn-accordion-answer-text">[^<]*<\/p>)(<\/div>)/;
  const filled = T.items.map((x, i) => {
    const unit = units[i % units.length];
    if (!unit.startsWith(ROW_OPEN)) throw new Error('cn-faq: a row no longer opens with its data-w-id');
    if (!BLOCK.test(unit)) throw new Error('cn-faq: a row\'s answer block is no longer the donor\'s single paragraph');
    let u = `<div id="${x.id}" ${unit.slice('<div '.length)}`;
    u = setText(u, 'cn-accordion-heading', question(x, i, t, escapeHtml));
    return u.replace(BLOCK, (m, a, p, c) => `${a}${answer(x, T, t, escapeHtml)}${c}`);
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
     1440, so the line stays a short label — now a link to the section's own
     catalogue row, `#g09`, which the build gives every group row
     (tools/build-site.mjs, capabilityShowcase). Measured after, at 992: see
     the V6 B record. */
  const QLINE = /(<div class="cn-text-size-regular">)([^<]*)(<\/div>)/;
  const q = QLINE.exec(tail);
  if (!q) throw new Error('cn-faq: the question block has no .text-size-regular line');
  const marker = q[2].replace(/[A-Za-z][\s\S]*$/, '');
  if (!marker.trim()) throw new Error('cn-faq: the question line lost its ◉ marker');
  let end = tail.replace(QLINE, (m, a, b, c) => `${a}${marker}<a href="#g${group.n}" class="cn-question-link">${escapeHtml(t(T.catalogueLink))} ${group.n}</a>${c}`);

  /* A roll-over button: two copies of the word, kept in step. */
  end = setTextAll(end, 'cn-button-text', escapeHtml(t(S.cardButton)));
  if (!end.includes(DONOR_HREF)) throw new Error(`cn-faq: the button no longer carries ${DONOR_HREF}`);

  /* The picture: cinery's one <img>, pointed at the editorial file. Its srcset,
     sizes, width, height and alt are written by tools/editorial-images.mjs
     from the file's registered variants and description (the alt below is only
     what stands until then, and marks the image as not decorative). */
  const alts = end.split(DONOR_ALT).length - 1;
  if (alts !== 1) throw new Error(`cn-faq: expected one ${DONOR_ALT} on the portrait, found ${alts}`);
  const IMG = /<img src="assets\/cinery\/[^"]*portrait[^"]*"[^>]*class="cn-faq-image"\/>/;
  if (!IMG.test(end)) throw new Error('cn-faq: the portrait is no longer the one cinery <img> of class cn-faq-image');
  end = end.replace(IMG, `<img src="${art(PICTURE)}" loading="lazy" alt="${escapeHtml(t(T.label))}" class="cn-faq-image"/>`);

  const html = open + filled.join('') + end;
  /* "(05)" is not on this list: the counter is the story's own index, and it
     happens to be the number cinery printed in the same slot. */
  if (/Cinery|Need more details|Ask a Question|video projects|Quick|Answers|black-white-minimal-portrait/.test(html)) throw new Error('cn-faq: donor copy survives in the rendered block');
  return html;
}

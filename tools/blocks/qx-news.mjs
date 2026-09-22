/**
 * Sales Desk：把客户聊明白，把订单跟到底 — story 02 of the capability showcase
 * (V6 §5.3).
 *
 * Donor: qubix's "Latest news" list (index.html). A sticky left column — h2,
 * lead paragraph, one pill button — beside three rows that are each
 * `position: sticky` (`.collection-item { bottom: 14vh }`), so they card-stack
 * over one another as the column scrolls past. The donor ships exactly three
 * rows and this story needs three capabilities, so nothing is cloned: the
 * units are filled in place and each keeps the photograph its own `<img>`
 * carries — the wooden balls, the paper box, the third blog photo — mirrored
 * into assets/qubix by try-block. The pill's arrow is the donor's own
 * Vector.svg, mirrored the same way. Nothing is substituted: the brief is
 * "要求完美复刻移植，仅仅针对文字进行改动".
 *
 * The date slot is not a date. Inventing one would be a claim; instead each row
 * prints the capability's own group number and name straight out of the
 * register, which is the same label the catalogue below prints for that group.
 *
 * Two things in this donor need care:
 *   - the row markup hides a `div.display-none` holding "This is some text
 *     inside of a div block."  Hidden is not gone: it is still donor copy in
 *     the DOM, so it is blanked.
 *   - the one-line body under each title is an **unclassed** `<div>`. In the
 *     donor it is coloured by qubix's own `body` rule (medium gray), which never
 *     travels with a cut section. That rule is restored in qx-news.css on the
 *     scope root, so the markup here carries no inline style of its own.
 */
import { setText, capability } from '../block-lib.mjs';
import { SALES_ROWS } from '../replaceables.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[1]. */
const STORY = 1;

/**
 * Three of the story's seven picks, in the order its promise names them: the
 * inquiry arrives in one queue, the requirement is read out of it, and what is
 * known about the customer ends up on one screen. Two sit in group 04 and one
 * in group 05 — the two groups the story itself declares.
 */
const PICKS = ['Unified Inbox', 'Buyer Requirement Extraction', 'Account Overview'];

/**
 * Each row's picture, in row order (V6 §5.3: a topic-matched picture in each
 * existing image position). qubix's are product-packaging and landscape stock —
 * one of them shows another company's brand name — so the rows take this site's
 * own editorial art: one intake → a shared track joining separate workspaces;
 * requirements → accounts, products, quotes and orders linked together; the
 * customer view → conversation, interest and history forming one context.
 *
 * Row 02 is the exception (owner instruction, 2026-09-18): 「买方需求提取」 says
 * the product, specification, quantity and deadline are read out of the message
 * and its attachments, and the owner's own SW028 screenshot is that screen —
 * one inquiry open in Sales Desk with its attachments, the extracted facts
 * (意向产品 / 需求数量 / 目的地 / 贸易术语) beside it and the grounded draft
 * reply under it. An entry may therefore be an editorial id or a path written
 * out; `pic` below resolves both, and tools/editorial-images.mjs gives either
 * kind its alt, its size and its variants.
 */
const ROW_ART = SALES_ROWS;
/** An editorial id (assets/stargo-editorial) or a path exactly as written. */
const pic = (v, art) => (v.startsWith('assets/') ? v : art(v));

export const donor = {
  id: 'qx-news',
  donor: 'qubix',
  scope: '.qx-news',
  page: 'index.html',
  start: '<section class="home-blog-section"><div class="w-layout-blockcontainer container w-container"><div class="home-blog-wrap">',
  end: '<div>Explore how clear interfaces, predictable flows, and accessibility can build user drive conversions.</div></div></div></div></div></div></div></div></section>',
  /* No image maps: `mirror` (its default, assets/qubix) keeps every donor
     photograph, its srcset variants and the button arrow. */
  /* Only the three rows paint themselves (`.blog-item` is black); the section
     around them was kept legible by qubix's own `body`, and the left column is
     snow-white type. Without a ground it is white on white. */
  ground: '#000',
};

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, art } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`qx-news: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  if (!story.availability) throw new Error('qx-news: story 1 has no availability line — Sales Desk must say what still needs connecting');
  /* V6 §5.3: the rows' names and lines are this section's (CAP_V6A.sales),
     one per pick, and a pick with no words fails here. */
  const R = C.CAP_V6A?.sales?.rows;
  if (!R || Object.keys(R).length !== PICKS.length || PICKS.some((p) => !R[p]?.title || !R[p]?.text)) {
    throw new Error(`qx-news: CAP_V6A.sales.rows must word exactly ${PICKS.join(' / ')}`);
  }

  /* ------------------------------------------------------------ split ---- */
  const OPEN = '<div role="listitem" class="qx-collection-item w-dyn-item">';
  const starts = [];
  for (let i = frag.indexOf(OPEN); i >= 0; i = frag.indexOf(OPEN, i + 1)) starts.push(i);
  if (starts.length !== PICKS.length) {
    throw new Error(`qx-news: qubix ships ${PICKS.length} rows, found ${starts.length}`);
  }
  /* The last row closes itself, and then four wrappers close before the
     section does: the list, the collection wrapper, the blog wrap, the
     container. Those four belong to the tail. */
  const TAIL = '</div></div></div></div></section>';
  const end = frag.lastIndexOf(TAIL);
  if (end < 0 || end < starts[starts.length - 1]) {
    throw new Error('qx-news: the list no longer closes with four divs before </section>');
  }
  const head = frag.slice(0, starts[0]);
  const tail = frag.slice(end);

  /* ------------------------------------------------------- left column --- */
  /* One heading, one lead. `.h2` capitalises, which is the donor's own look.
     The heading is V6's 「Sales Desk：把客户聊明白，把订单跟到底」. On the
     Chinese page every character is a break point and the sticky column holds
     seven or eight a line, so it broke inside 客户 and 订单; a zero-width
     space after each punctuation mark gives qx-news.css (`word-break:
     keep-all`) the only places it may wrap — after the colon and after the
     comma — so it reads Sales Desk： / 把客户聊明白， / 把订单跟到底. */
  const ZWSP = '\u200b';
  /* The product name is one unit on both pages: a no-break space holds it. */
  const label = (lang === 'zh' ? t(story.label).replace(/([：，])/g, `$1${ZWSP}`) : t(story.label)).replace('Sales Desk', 'Sales\u00a0Desk');
  let left = setText(head, 'qx-h2', escapeHtml(label));
  /* The lead: what Sales Desk takes in, how the three rows below serve the
     reply, the product fit, the follow-up, the quote and the PI, what it
     produces, and — as its own sentence — what is still connected and
     validated one by one. */
  if (!story.output) throw new Error('qx-news: story 1 has no output line');
  const gap = lang === 'zh' ? '' : ' ';
  const outputs = lang === 'zh' ? `工作成果：${t(story.output)}` : `Outputs: ${t(story.output).replace(/^./, (c) => c.toLowerCase())}`;
  left = setText(left, 'qx-body', escapeHtml([t(story.promise), outputs, t(story.availability)].join(gap)));

  /* The button says what it goes to. `#atlas` is the complete catalogue
     section, and `catalogueLabel` is the heading that section prints for
     itself, so the pill borrows a line the page already says rather than a new
     one. `.main-button` is `white-space: nowrap`, so it has to stay short.
     This is the "all capabilities" door; the rows below each go to their own
     group. */
  const BUTTON = /(<div class="qx-button-content-wrap"><div>)([\s\S]*?)(<\/div>)/;
  if (!BUTTON.test(left)) throw new Error('qx-news: the button label div is gone from the left column');
  left = left.replace(BUTTON, (m, open, inner, close) => `${open}${escapeHtml(t(S.catalogueLabel))}${close}`);

  const BTN_HREF = /(<a href=")[^"]*("[^>]*class="qx-main-button)/;
  if (!BTN_HREF.test(left)) throw new Error('qx-news: the main button anchor is gone from the left column');
  left = left.replace(BTN_HREF, (m, a, b) => `${a}#atlas${b}`);

  /* The pill's arrow is decoration beside a label that already says where the
     link goes, and the donor left it announcing itself as "Image". */
  if (!left.includes('alt="Image"')) throw new Error('qx-news: the button arrow lost its alt attribute');
  left = left.replace('alt="Image"', 'alt=""');

  /* --------------------------------------------------------------- rows --- */
  const rows = PICKS.map((pick, i) => {
    const cap = capability(C, pick);
    const unit = frag.slice(starts[i], starts[i + 1] ?? end);

    /* The date slot: the register's own group label, the same string the
       catalogue prints as that group's heading. Nothing here is a date. */
    let row = setText(unit, 'qx-body', escapeHtml(`${cap.group.n} · ${t(cap.group.name)}`));

    /* The title: one language per page — V6's name for the row
       (统一询盘入口 / 买方需求提取 / 客户全景). */
    const words = C.CAP_V6A.sales.rows[pick];
    row = setText(row, 'qx-text-block-3', escapeHtml(t(words.title)));

    /* Hidden, but still the donor talking. */
    row = setText(row, 'qx-display-none', '');

    /* The row's line goes in the one unclassed div in the row — the only
       element here with no class attribute at all, which is what makes it
       findable. The tag is kept as it is: no class, no style. */
    const GLOSS = /<div>([\s\S]*?)<\/div>/;
    if (!GLOSS.test(row)) throw new Error(`qx-news: row ${i + 1} has no unclassed div for the gloss`);
    row = row.replace(GLOSS, () => `<div>${escapeHtml(t(words.text))}</div>`);

    /* Both row links point at the donor's blog posts. Each row goes to the
       catalogue group its entry sits in — intake and requirements to #g04,
       the customer view to #g05 — whose heading is the same label the row's
       date slot prints. */
    const hrefs = row.match(/href="blog[^"]*"/g) ?? [];
    if (hrefs.length !== 2) throw new Error(`qx-news: row ${i + 1} no longer carries two donor links`);
    row = row.replace(/href="blog[^"]*"/g, `href="#g${cap.group.n}"`);

    /* The photograph: the row's editorial art in the donor's own <img> (its
       inline transform, class and lazy loading unchanged), with the words the
       row already says as its alt; tools/editorial-images.mjs then writes the
       variants and the picture's description. */
    if (!row.includes('alt=""')) throw new Error(`qx-news: row ${i + 1} lost its image alt attribute`);
    const PHOTO = /<img src="assets\/qubix\/[^"]+"/;
    if (!PHOTO.test(row)) throw new Error(`qx-news: row ${i + 1} lost its qubix photograph`);
    row = row.replace(PHOTO, `<img src="${pic(ROW_ART[i], art)}"`);
    return row.replace('alt=""', `alt="${escapeHtml(t(words.text))}"`);
  });

  return left + rows.join('') + tail;
}

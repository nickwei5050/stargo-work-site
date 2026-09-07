/**
 * 把对话变成对客户的理解 — story 02 of the capability showcase.
 *
 * Donor: qubix's "Latest news" list (index.html). A sticky left column — h2,
 * lead paragraph, one pill button — beside three rows that are each
 * `position: sticky`, so they card-stack over one another as the column
 * scrolls past. The donor ships exactly three rows and this story needs three
 * capabilities, so nothing is cloned: the units are filled in place and each
 * keeps the photograph its own `<img>` carries.
 *
 * The date slot is not a date. Inventing one would be a claim; instead each row
 * prints the capability's own group number and name straight out of the
 * register, which is the same label the catalogue below prints for that group.
 *
 * Three things in this donor need care:
 *   - the row markup hides a `div.display-none` holding "This is some text
 *     inside of a div block."  Hidden is not gone: it is still donor copy in
 *     the DOM, so it is blanked.
 *   - the one-line body under each title is an **unclassed** `<div>`. Nothing
 *     in the extracted sheet colours it, so it inherits the host page's own
 *     `color: #000` and would be black on this block's black ground. It is
 *     given the donor's medium-gray token inline.
 *   - the button's arrow is a CDN `Vector.svg`; it is mapped to this site's
 *     own diagonal arrow.
 */
import { setText, capability, art } from '../block-lib.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[1]. */
const STORY = 1;

/**
 * Three of the story's seven picks, in the order its promise names them: the
 * inquiry arrives in one queue, the requirement is read out of it, and what is
 * known about the customer ends up on one screen. Two sit in group 04 and one
 * in group 05 — the two groups the story itself declares.
 */
const PICKS = ['Unified Inbox', 'Buyer Requirement Extraction', 'Account 360'];

export const donor = {
  id: 'qx-news',
  donor: 'qubix',
  scope: '.qx-news',
  page: 'index.html',
  start: '<section class="home-blog-section"><div class="w-layout-blockcontainer container w-container"><div class="home-blog-wrap">',
  end: '<div>Explore how clear interfaces, predictable flows, and accessibility can build user drive conversions.</div></div></div></div></div></div></div></div></section>',
  /* Row art, in row order. Webflow ships each photograph across src and srcset,
     so a stem replaces the whole family at once.
       Blog-7 → Unified Inbox: channels layered into one core.
       Blog-6 → Buyer Requirement Extraction: loose things linked into objects.
       Blog-5 → Account 360: every route read from one hub. */
  imageStems: {
    'Blog-7': art('os-inquiries'),
    'Blog-6': art('brand-ontology'),
    'Blog-5': art('os-cockpit'),
    /* The pill's arrow. This site already ships a plain diagonal arrow for
       renok's insight rows, so no new artwork was authored. */
    'Vector.svg': 'assets/renok/insights-arrow.svg',
  },
  /* Only the three rows paint themselves (`.blog-item` is black); the section
     around them was kept legible by qubix's own `body`, and the left column is
     snow-white type. Without a ground it is white on white. */
  ground: '#000',
};

/** The donor's medium gray, for the one slot no extracted rule reaches. */
const GRAY = 'var(--_color---normal-color--medium-gray)';

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`qx-news: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);

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
  /* One heading, one lead. `.h2` capitalises, which is the donor's own look. */
  let left = setText(head, 'qx-h2', escapeHtml(t(story.label)));
  left = setText(left, 'qx-body', escapeHtml(t(story.promise)));

  /* The button says what it goes to. `#atlas` is the complete catalogue
     section, and `catalogueLabel` is the heading that section prints for
     itself, so the pill borrows a line the page already says rather than a new
     one. `.main-button` is `white-space: nowrap`, so it has to stay short. */
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

    /* The title. On the Chinese page the Chinese name leads and the product
       name follows as a subtitle, styled by the shared `.cap-en` rule in
       css/stargo-fusion.css — it sizes itself in `em`, so it follows whatever
       type the slot around it is set in. */
    let title = capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? ''));
    row = setText(row, 'qx-text-block-3', title);

    /* Hidden, but still the donor talking. */
    row = setText(row, 'qx-display-none', '');

    /* The gloss goes in the one unclassed div in the row — the only element
       here with no class attribute at all, which is what makes it findable. */
    const GLOSS = /<div>([\s\S]*?)<\/div>/;
    if (!GLOSS.test(row)) throw new Error(`qx-news: row ${i + 1} has no unclassed div for the gloss`);
    row = row.replace(GLOSS, () => `<div style="color:${GRAY}">${escapeHtml(t(cap.gloss))}</div>`);

    /* Both row links point at the donor's blog posts. The rows name entries in
       the catalogue, so they go where the catalogue is. */
    const hrefs = row.match(/href="blog[^"]*"/g) ?? [];
    if (hrefs.length !== 2) throw new Error(`qx-news: row ${i + 1} no longer carries two donor links`);
    row = row.replace(/href="blog[^"]*"/g, 'href="#atlas"');

    /* The photograph is decorative beside a title that already names the
       capability, but the alt should not be a leftover empty string on an
       image this large. */
    if (!row.includes('alt=""')) throw new Error(`qx-news: row ${i + 1} lost its image alt attribute`);
    return row.replace('alt=""', `alt="${escapeHtml(t(cap.gloss))}"`);
  });

  return left + rows.join('') + tail;
}

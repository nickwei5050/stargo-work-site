/**
 * 用一支 AI 团队把活干完 — story 06 of the capability showcase.
 *
 * Donor: qubix's "A few of our recent projects" (index.html,
 * `section.home-project-section`). A top row — h2 on the left, a 70px
 * diagonal-arrow button and a right-aligned one-liner on the right — then
 * three project cards: two side by side in a 1fr 1fr grid (724px tall), one
 * full-width beneath them (615px tall). Each card is a photograph with a
 * "view" pill that scales in on hover, a title, and a category line.
 *
 * The donor draws exactly three cards, so this block shows the story's first
 * three picks and nothing is cloned: the units are filled in place and every
 * card keeps the photograph its own `<img>` carries (Pro-5, Pro-4, Pro-2),
 * mirrored into assets/qubix by try-block.
 *
 * The category slot is not a category. It prints the capability's own group
 * name straight out of the register — the label the catalogue below uses for
 * that group — so nothing is invented.
 *
 * Things in this donor that need care:
 *   - every card title hides a `div.display-none` with "This is some text
 *     inside of a div block." Hidden is still donor copy; it is blanked.
 *   - the hover pill says "View This Work". The card links go to the catalogue
 *     section, so the pill borrows the heading that section prints for itself.
 *   - the two arrow images announce themselves as "Image"; the anchor already
 *     leads somewhere the one-liner beside it explains, so the alt goes empty.
 *   - the category line has no colour of its own in the donor: it inherited
 *     qubix's `body` (medium gray, the donor typeface). Both travel in
 *     qx-projects.css, which is what that file is for.
 */
import { setText, capability } from '../block-lib.mjs';

/** The story this block carries: CAPABILITY_SHOWCASE.stories[5]. */
const STORY = 5;

/** The donor ships three cards; the story's first three picks fill them. */
const CARDS = 3;

export const donor = {
  id: 'qx-projects',
  donor: 'qubix',
  scope: '.qx-projects',
  page: 'index.html',
  start: '<section class="home-project-section"><div class="w-layout-blockcontainer container w-container"><div class="project-wrapper">',
  end: '<div class="project-card-ctg">UI UX, App Design</div></div></div></div></div></div></div></div></div></section>',
  /* No images/imageStems: every photograph and both arrow icons are the
     donor's own and are mirrored into assets/qubix by default. The section
     paints its own deep-charcoal ground, so no `ground` is needed. */
};

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`qx-projects: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  const picks = story.picks.slice(0, CARDS);
  if (picks.length !== CARDS) throw new Error(`qx-projects: story ${STORY} has fewer than ${CARDS} picks`);

  /* ------------------------------------------------------------ split ---- */
  const OPEN = '<div role="listitem" class="qx-project-cl-item w-dyn-item">';
  const starts = [];
  for (let i = frag.indexOf(OPEN); i >= 0; i = frag.indexOf(OPEN, i + 1)) starts.push(i);
  if (starts.length !== CARDS) {
    throw new Error(`qx-projects: qubix ships ${CARDS} cards, found ${starts.length}`);
  }
  /* The third card closes itself and then its list, its collection wrapper,
     the project wrap, the project wrapper and the container close before the
     section does. */
  const TAIL = '</div></div></div></div></div></section>';
  const end = frag.lastIndexOf(TAIL);
  if (end < 0 || end < starts[CARDS - 1]) {
    throw new Error('qx-projects: the last card no longer closes with five divs before </section>');
  }
  const head = frag.slice(0, starts[0]);
  const tail = frag.slice(end);

  /* -------------------------------------------------------------- top ---- */
  let top = setText(head, 'qx-project-title-mw', escapeHtml(t(story.label)));
  /* The right-aligned line is a 250px column the donor fills with exactly two
     lines ("Projects where strategy, design, and technology came together.",
     46.09px tall), and the h2 beside it is bottom-aligned to that column: a
     longer line does not wrap into the design, it pushes the heading down.
     The story's `promise` runs to four lines in Chinese and six in English
     (92.19px / 138.28px, +46px / +92px of block height, the h2 dropping with
     it). `output` is the same story in the register's own shorter words and
     measures the donor's two lines in both languages, so it takes the slot. */
  top = setText(top, 'qx-text-end', escapeHtml(t(story.output)));

  /* The arrow button pointed at the donor's projects page; the cards below
     name entries in the catalogue, so it goes where the catalogue is. */
  const BTN_HREF = /(<a data-w-id="[^"]*" href=")[^"]*("[^>]*class="qx-position-icon-button-wrap)/;
  if (!BTN_HREF.test(top)) throw new Error('qx-projects: the arrow button anchor is gone from the top row');
  top = top.replace(BTN_HREF, (m, a, b) => `${a}#atlas${b}`);

  const alts = (top.match(/alt="Image"/g) ?? []).length;
  if (alts !== 2) throw new Error(`qx-projects: expected two arrow images with alt="Image", found ${alts}`);
  top = top.replace(/alt="Image"/g, 'alt=""');

  /* ------------------------------------------------------------ cards ---- */
  const cards = picks.map((pick, i) => {
    const cap = capability(C, pick);
    const unit = i < CARDS - 1 ? frag.slice(starts[i], starts[i + 1]) : frag.slice(starts[i], end);

    /* Hidden, but still the donor talking. */
    let card = setText(unit, 'qx-display-none', '');

    /* The title: the one unclassed div, which sits first inside the title
       anchor. Chinese name on the Chinese page, product name on the English. */
    const TITLE = /(<a href="[^"]*" class="qx-project-card-title w-inline-block"><div>)([\s\S]*?)(<\/div>)/;
    if (!TITLE.test(card)) throw new Error(`qx-projects: card ${i + 1} has no title div`);
    card = card.replace(TITLE, (m, open, inner, close) => `${open}${capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? ''))}${close}`);

    /* The category slot: the register's own group name. */
    card = setText(card, 'qx-project-card-ctg', escapeHtml(t(cap.group.name)));

    /* The hover pill on the photograph. */
    card = setText(card, 'qx-project-view-text', escapeHtml(t(S.catalogueLabel)));

    /* Both card links point at the donor's project pages. */
    const hrefs = card.match(/href="projects_[^"]*"/g) ?? [];
    if (hrefs.length !== 2) throw new Error(`qx-projects: card ${i + 1} no longer carries two donor links`);
    card = card.replace(/href="projects_[^"]*"/g, 'href="#atlas"');

    /* The photograph is decorative beside a title that names the capability,
       but an image this large should not carry an empty alt. */
    if (!card.includes('alt=""')) throw new Error(`qx-projects: card ${i + 1} lost its image alt attribute`);
    return card.replace('alt=""', `alt="${escapeHtml(t(cap.gloss))}"`);
  });

  return top + cards.join('') + tail;
}

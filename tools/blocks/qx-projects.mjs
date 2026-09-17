/**
 * 让 AI 团队把活干完 — story 06 of the capability showcase (V5 M10 + M11,
 * V6 §5.7).
 *
 * Donor: qubix's "A few of our recent projects" (index.html,
 * `section.home-project-section`). A top row — h2 on the left, a 70px
 * diagonal-arrow button and a right-aligned one-liner on the right — then
 * three project cards: two side by side in a 1fr 1fr grid (724px tall), one
 * full-width beneath them (615px tall). Each card is a photograph with a
 * "view" pill that scales in on hover, a title, and a category line.
 *
 * The donor draws exactly three cards and V6 gives the section three topics —
 * the 288-role directory, the roles' tasks and results, and the team at work —
 * so nothing is cloned: the units are filled in place (CAP_V6A.team), each
 * still tied to one of the story's first three register picks.
 *
 * The category slot is not a category. It carries the card's explanation:
 * what 288 is and is not, what a manager sees, and — on the large card — the
 * illustrated teamwork example with its phasing note.
 *
 * Things in this donor that need care:
 *   - every card title hides a `div.display-none` with "This is some text
 *     inside of a div block." Hidden is still donor copy; it is blanked.
 *   - the hover pill says "View This Work". Each card's pill names where that
 *     card goes: the workforce page, or the workforce group in the catalogue.
 *   - the three photographs were qubix's own (Pro-5, Pro-4, Pro-2) and said
 *     nothing about AI roles; this site's editorial art replaces them.
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
  /* No images/imageStems: both arrow icons are the donor's own and are
     mirrored into assets/qubix by default; the three card photographs are
     swapped for editorial art at render time. The section paints its own
     deep-charcoal ground, so no `ground` is needed. */
};

export function render(frag, ctx) {
  const { C, t, escapeHtml, art } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const story = S.stories[STORY];
  if (!story) throw new Error(`qx-projects: CAPABILITY_SHOWCASE.stories has no entry ${STORY}`);
  const picks = story.picks.slice(0, CARDS);
  if (picks.length !== CARDS) throw new Error(`qx-projects: story ${STORY} has fewer than ${CARDS} picks`);
  /* V6 §5.7: the three cards are the 288-role directory, tasks and results,
     and the team at work (CAP_V6A.team). Their links go to the workforce page
     or the workforce group of the catalogue — never to the top of it. */
  const T = C.CAP_V6A?.team;
  if (!T?.cards || T.cards.length !== CARDS || !T.arrowHref) throw new Error(`qx-projects: CAP_V6A.team needs ${CARDS} cards and an arrow link`);
  const groupHref = `#g${capability(C, picks[0]).group.n}`;
  for (const href of [T.arrowHref, ...T.cards.map((c) => c.href)]) {
    /* The workforce page itself, or one of its two sections these cards are
       about: the ten role groups (#lx-role-groups) and the team scenario
       (#lx-team). tools/chrome.mjs checks that the page exists; the ids are
       written by the workforce builder in tools/build-site.mjs. */
    if (!/^workforce\.html(#lx-(role-groups|team))?$/.test(href) && href !== groupHref) throw new Error(`qx-projects: ${href} is neither the workforce page (or one of its two sections) nor ${groupHref}`);
  }
  /* The directory card has to say what 288 is not, and the teamwork card that
     it is an illustration and that deeper teamwork is phased. */
  const [dir, , team] = T.cards.map((c) => t(c.text));
  if (ctx.lang === 'zh' ? !/不是同时运行/.test(dir) : !/not 288 employees running at once/.test(dir)) throw new Error('qx-projects: the 288 card no longer says the roles are not running at once');
  if (ctx.lang === 'zh' ? !/示意/.test(team) || !/按阶段开放/.test(team) : !/Illustrative/.test(team) || !/in phases/.test(team)) throw new Error('qx-projects: the teamwork card lost its illustration or phasing note');

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

  /* The arrow button pointed at the donor's projects page; this section is the
     AI workforce in brief, so it goes to the page that tells it in full. */
  const BTN_HREF = /(<a data-w-id="[^"]*" href=")[^"]*("[^>]*class="qx-position-icon-button-wrap)/;
  if (!BTN_HREF.test(top)) throw new Error('qx-projects: the arrow button anchor is gone from the top row');
  /* The button is two arrow images and nothing else, both decorative (alt=""
     below), so without a label a screen reader announces a nameless link.
     Its name is the name of the page it opens, as the site navigation writes
     it (「数字员工」 / "AI Workforce"), in the page's language. */
  const arrowPage = C.NAV.find((n) => n.href === T.arrowHref.split('#')[0]);
  if (!arrowPage) throw new Error(`qx-projects: the arrow button goes to ${T.arrowHref}, which is not a page in the site navigation, so it has no name to carry`);
  top = top.replace(BTN_HREF, (m, a, b) => `${a}${T.arrowHref}" aria-label="${escapeHtml(t(arrowPage.label))}${b}`);

  const alts = (top.match(/alt="Image"/g) ?? []).length;
  if (alts !== 2) throw new Error(`qx-projects: expected two arrow images with alt="Image", found ${alts}`);
  top = top.replace(/alt="Image"/g, 'alt=""');

  /* ------------------------------------------------------------ cards ---- */
  const cards = picks.map((pick, i) => {
    capability(C, pick);   // still a register entry: a renamed pick fails the build
    const words = T.cards[i];
    const unit = i < CARDS - 1 ? frag.slice(starts[i], starts[i + 1]) : frag.slice(starts[i], end);

    /* Hidden, but still the donor talking. */
    let card = setText(unit, 'qx-display-none', '');

    /* The title: the one unclassed div, which sits first inside the title
       anchor. One language per page; the Chinese title carries zero-width
       spaces where a phrase ends (qx-projects.css keeps it whole between). */
    const TITLE = /(<a href="[^"]*" class="qx-project-card-title w-inline-block"><div>)([\s\S]*?)(<\/div>)/;
    if (!TITLE.test(card)) throw new Error(`qx-projects: card ${i + 1} has no title div`);
    card = card.replace(TITLE, (m, open, inner, close) => `${open}${escapeHtml(t(words.title))}${close}`);

    /* The category slot carries the card's explanation — for the large card,
       the teamwork example itself. qx-projects.css lets it wrap under the
       title rather than squeeze it (the donor's line was three words). */
    card = setText(card, 'qx-project-card-ctg', escapeHtml(t(words.text)));

    /* The hover pill on the photograph names where the card goes. */
    card = setText(card, 'qx-project-view-text', escapeHtml(t(words.pill)));

    /* Both card links point at the donor's project pages. */
    const hrefs = card.match(/href="projects_[^"]*"/g) ?? [];
    if (hrefs.length !== 2) throw new Error(`qx-projects: card ${i + 1} no longer carries two donor links`);
    card = card.replace(/href="projects_[^"]*"/g, `href="${words.href}"`);

    /* The photograph. qubix's (a tote bag, a runner in a phone, a desk) said
       nothing about AI roles; this site's own editorial art for specialised
       roles and parallel work takes the same <img> — its class, lazy loading
       and the hover pill beside it unchanged — and tools/editorial-images.mjs
       writes its variants and its description (an alt that is not empty tells
       it the picture is content). */
    const IMG = /<img src="assets\/qubix\/[^"]+"([^>]*)alt=""([^>]*)>/;
    if (!IMG.test(card)) throw new Error(`qx-projects: card ${i + 1} lost its photograph or its alt attribute`);
    return card.replace(IMG, (m, a, b) => `<img src="${art(words.image)}"${a.replace(/\s(?:srcset|sizes)="[^"]*"/g, '')}alt="${escapeHtml(t(words.title).replace(/\u200b/g, ''))}"${b.replace(/\s(?:srcset|sizes)="[^"]*"/g, '')}>`);
  });

  return top + cards.join('') + tail;
}

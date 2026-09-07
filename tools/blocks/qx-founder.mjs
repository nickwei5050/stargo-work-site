/**
 * 用一支 AI 团队把活干完 — story 06 as a roster of six AI employees.
 *
 * Donor: qubix's "The Founder" portrait grid (about.html). A heading over a
 * `1fr 1fr` CSS grid of tall portrait cards, each a photograph with a name and
 * a role beneath it. The grid also sets `grid-auto-columns: 1fr`, so it takes
 * more than the two cards the donor draws and wraps them into rows — which is
 * the whole reason this block can carry six.
 *
 * The donor cut starts at `section-founder-top-box`, not at the `<section>`:
 * the section wrapper also holds a spiral-image showcase we do not want, and
 * cutting the section open tag without its close leaves the fragment two
 * elements deep. The top box is a balanced subtree, and qubix's own layout
 * chain goes back around it — the same three wrappers every other qubix block
 * on this page uses, which is where its padding and its charcoal ground come
 * from. That is why this block declares no `ground` of its own.
 *
 * Two interactions travel with it, both scroll-triggered fade-ups on elements
 * the export ships at `opacity:0`: one on the heading, one on the grid. Neither
 * is per-card, so the cards repeat freely.
 */
import { setText, capability } from '../block-lib.mjs';

/**
 * The donor ships each photograph as a family of CDN URLs (`src` plus two
 * `srcset` entries). Mapping the two stems gives every card in the extracted
 * fragment a local path; `render` then swaps the first card's path for the one
 * this card should carry.
 *
 * The artwork is this site's own — abstract machined objects rather than faces,
 * which is what a page about AI employees should be showing. It is drawn from
 * the large set, not the avatars: the card frame is 632x534 and every avatar
 * original is 228x228, so an avatar was being blown up about 2.4x and read
 * visibly soft. These are 1586x992 with three responsive variants each, so the
 * frame is filled at or above its own resolution at every width. All six are
 * the same 1586x992, so the two-column grid stays even — a portrait-shaped one
 * among them made its own card three times the height of its neighbour.
 */
const SEED = 'assets/stargo-editorial/os-agent-center.webp';

const AVATARS = [
  'os-agent-center',    // 288 employees — the floor they all work on
  'os-desktop',         // StaffDeck — the deck a manager actually opens
  'brand-family-03',    // Agent Teams — separate pieces holding one shape
  'brand-family-01',    // Delegation · Handoff · Parallel — parts moving as one
  'brand-ontology',     // Role · Skills · Tools · Memory — the structure behind a role
  'os-login',           // Approval Center — the gate a decision waits at
];

export const donor = {
  id: 'qx-founder',
  donor: 'qubix',
  scope: '.qx-founder',
  page: 'about.html',
  start: '<div class="section-founder-top-box">',
  /* Five closes, not the six that follow in the donor: body, info, item, grid,
     top box. The sixth closes the container, which `wrap` puts back itself. */
  end: '<div class="body">Co-Founder &amp; Chief Strategy Officer</div></div></div></div></div>',
  wrap: ['values-section', 'w-layout-blockcontainer container w-container', 'values-wrap'],
  imageStems: {
    'Team-2': SEED,
    'Team-1': 'assets/stargo-editorial/os-desktop.webp',
  },
};

export function render(frag, ctx) {
  const { C, t, escapeHtml, capTitle, lang } = ctx;
  const story = C.CAPABILITY_SHOWCASE.stories[5];
  if (!story) throw new Error('qx-founder: CAPABILITY_SHOWCASE.stories has no story 06');

  /* Six cards for a two-column grid: three full rows, no orphan. The story
     registers seven picks, so the last one waits its turn. */
  const picks = story.picks.slice(0, 6);
  if (picks.length !== 6) throw new Error(`qx-founder: story 06 offers ${story.picks.length} picks, the grid needs 6`);
  if (AVATARS.length !== picks.length) throw new Error('qx-founder: one avatar per card');

  const OPEN = '<div class="qx-section-founder-profile-item">';
  const starts = [];
  for (let i = frag.indexOf(OPEN); i >= 0; i = frag.indexOf(OPEN, i + 1)) starts.push(i);
  if (starts.length !== 2) throw new Error(`qx-founder: qubix draws two portrait cards, found ${starts.length}`);

  /* A card closes its role line, its info box and itself; what follows those
     three belongs to the grid and the boxes around it. */
  const CLOSE = '</div></div></div>';
  const at = frag.indexOf(CLOSE, starts[1]);
  if (at < 0) throw new Error('qx-founder: the second card does not close where a card closes');
  const gridEnd = at + CLOSE.length;

  const head = frag.slice(0, starts[0]);
  const unit = frag.slice(starts[0], starts[1]);
  const tail = frag.slice(gridEnd);
  if (!unit.includes(SEED)) throw new Error(`qx-founder: the card carries no ${SEED} to swap`);
  if (unit.split('alt="Image"').length !== 2) throw new Error('qx-founder: the card image has no single alt to name');

  const cards = picks.map((pick, i) => {
    const cap = capability(C, pick);
    /* The name line, Chinese-first on the Chinese page: the product name rides
       under it in the `.cap-en` subtitle the fusion sheet already styles. The
       role beneath is the register's own group — this employee's department.
       The catalogue gloss does not go here: the role sits opposite the name on
       one 632px row, and every gloss but two overruns it. */
    const name = capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? ''));
    const plain = escapeHtml(lang === 'zh' && cap.zhName ? cap.zhName : cap.name);
    const card = setText(setText(unit, 'qx-h6', name), 'qx-body', escapeHtml(t(cap.group.name)));
    return card
      .split(SEED).join(`assets/stargo-editorial/${AVATARS[i]}.webp`)
      .split('alt="Image"').join(`alt="${plain}"`);
  });

  return setText(head, 'qx-h2', escapeHtml(t(story.label))) + cards.join('') + tail;
}

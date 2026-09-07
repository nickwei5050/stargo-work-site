/**
 * 四个基础板块 — the four foundations every outcome on this page rests on.
 *
 * Donor: qubix's "Our Values" card row (about.html). An eyebrow pill over a
 * flex row of exactly four numbered cards, hairline dividers between them, the
 * whole row rising into place on one scroll trigger. Four cards is what the
 * donor draws and four foundations is what we have, so nothing repeats here —
 * the units are filled in place.
 */
import { setText, capability, capTitle } from '../block-lib.mjs';

export const donor = {
  id: 'qx-cards',
  donor: 'qubix',
  scope: '.qx-cards',
  page: 'about.html',
  start: '<div data-w-id="3c3263bf-57e2-41a5-60ae-a083ccbba0a0" style="opacity:0" class="values-card-main-box">',
  end: 'valuing transparency</div></div></div></div></div>',
  /* Cut on its own the row loses the section padding and centred container it
     was drawn inside, so the donor's own three wrappers go back around it. */
  wrap: ['values-section', 'w-layout-blockcontainer container w-container', 'values-wrap'],
};

export function render(frag, ctx) {
  const { C, t, escapeHtml } = ctx;
  const S = C.CAPABILITY_SHOWCASE;

  /* The fourth card carries a different divider class from the first three, so
     match on the shared one. */
  const open = '<div class="qx-values-item-box qx-';
  const starts = [];
  for (let i = frag.indexOf(open); i >= 0; i = frag.indexOf(open, i + 1)) starts.push(i);
  if (starts.length !== 4) throw new Error(`qx-cards: qubix ships four cards, found ${starts.length}`);
  if (S.foundations.length !== 4) throw new Error(`qx-cards: the row holds four, copy has ${S.foundations.length}`);

  /* The last card closes its body, its info box and itself; the row's own
     closing tags follow, and those belong to the tail. */
  const CLOSE = '</div></div></div>';
  const rowEnd = frag.indexOf(CLOSE, starts[3]) + CLOSE.length;
  const head = frag.slice(0, starts[0]);
  const tail = frag.slice(rowEnd);

  const cards = S.foundations.map((x, i) => {
    const unit = frag.slice(starts[i], starts[i + 1] ?? rowEnd);
    /* The card names the foundation, then leads with the capability the
       catalogue registers first under it, so the row stays anchored to the
       register rather than drifting into its own vocabulary. */
    const lead = capability(C, x.picks[0]);
    /* capTitle returns markup, so the copy around it is escaped, not the whole. */
    const body = `${escapeHtml(t(x.promise))} <strong>${capTitle(ctx.lang)(escapeHtml(lead.name), escapeHtml(lead.zhName ?? ''))}</strong> ${escapeHtml(t(lead.gloss))}`;
    return setText(setText(setText(unit,
      'qx-h4', escapeHtml(String(i + 1).padStart(2, '0'))),
      'qx-h6', escapeHtml(t(x.label))),
      'qx-body', body);
  });

  return setText(head, 'qx-snow-white', escapeHtml(t(S.foundationsLabel))) + cards.join('') + tail;
}

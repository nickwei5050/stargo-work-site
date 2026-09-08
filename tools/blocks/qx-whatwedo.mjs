/**
 * 每件事共同依赖的底座 — the four foundations of the capability showcase.
 *
 * Donor: qubix's "What We Do" (index.html, `.home-service-two`). A 600vh
 * scroll-pinned stage: a dark orb (`Ellipse 2.png`) behind a ticked ring
 * (`Group 2085663954.png`) that rotates 180° as the page scrolls, the phrase
 * split either side of it, and three text nodes (h5 + body) absolutely placed
 * around it — top-left, right, bottom-centre. Everything in the block moves
 * from one continuous scroll action (`a-17`, "Services Animation") bound to
 * the `data-w-id` on `.wrapper-service`, which addresses the nodes as
 * CHILDREN by class, so a cloned node animates with the others.
 *
 * The owner asked for the four foundations here, each one opening on click
 * to list its capabilities ("点击可以分别展开介绍01、02、03、04的功能"). The
 * donor ships three slots and no click interaction, so:
 *   - the third node is cloned once with every class it carries and given one
 *     extra class (`qx-whatwedo-four`) that tools/blocks/qx-whatwedo.css uses
 *     only to move it to the bottom-left corner — the donor has no fourth
 *     position to borrow;
 *   - a panel listing the foundation's picks is appended INSIDE each node's
 *     own description wrapper, hidden until tools/blocks/qx-whatwedo.js
 *     toggles it. No donor element moves or loses an attribute.
 *
 * Both donor images stay (mirrored into assets/qubix by try-block). The
 * hidden number slot (`.wrapper-text-number-service` is display:none in the
 * donor) carries "01"–"04" so the numbering the owner speaks of is in the
 * markup even though the donor never shows it.
 */
import { setText, capability } from '../block-lib.mjs';

export const donor = {
  id: 'qx-whatwedo',
  donor: 'qubix',
  scope: '.qx-whatwedo',
  page: 'index.html',
  start: '<section class="home-service-two"><div class="w-layout-blockcontainer container w-container"><div data-w-id="38cc4297-9be3-f859-8638-c5b4f9ed170c" class="wrapper-service">',
  end: 'The process of refining details in order to achieve clarity, balance, and consistency.</div></div></div></div></div><div class="trigger-spacer"></div></div></div></section>',
  /* qubix's `body` is black; the section paints nothing of its own, so on
     another page the snow-white heading and the dark orb would sit on white. */
  ground: '#000',
};

/** The donor ships three nodes: top-left, right, bottom. */
const NODE_COUNT = 3;

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml, capTitle } = ctx;
  const S = C.CAPABILITY_SHOWCASE;
  const F = S.foundations;
  if (!F || F.length !== 4) throw new Error(`qx-whatwedo: expected 4 foundations, have ${F?.length}`);

  /* ------------------------------------------------------------ split ---- */
  const OPEN = '<div class="qx-wrapper-main-services qx-wrapper-main-services-';
  const starts = [];
  for (let i = frag.indexOf(OPEN); i >= 0; i = frag.indexOf(OPEN, i + 1)) starts.push(i);
  if (starts.length !== NODE_COUNT) throw new Error(`qx-whatwedo: qubix ships ${NODE_COUNT} nodes, found ${starts.length}`);
  /* After the last node: `.outer-main-service` and `.sticky-service-wrapp`
     close, then the spacer that gives the scroll animation its runway. */
  const TAIL = '</div></div><div class="qx-trigger-spacer"></div>';
  const end = frag.indexOf(TAIL, starts[NODE_COUNT - 1]);
  if (end < 0) throw new Error('qx-whatwedo: the node list no longer closes onto the trigger spacer');
  let head = frag.slice(0, starts[0]);
  const tail = frag.slice(end);

  /* ------------------------------------------------ the split phrase ---- */
  /* "What" / " We Do" → foundationsLabel in two halves. Chinese has no
     spaces, so the halves are cut by hand; the donor's leading space on the
     second half is kept only where the language uses one.
     Where the cut falls is a layout decision the donor already made: the two
     halves and the sphere between them are one centred flex row, so the
     sphere sits at (half1 − half2)/2 from the row's centre. qubix cuts "What"
     (129px) from " We Do" (185px) and lands the sphere 3px from the ticked
     ring behind it. Chinese sets every glyph one em wide, so the balanced cut
     is the middle of the string; the grammatical break after 每件事 leaves
     167px against 406px and drags the sphere 88px off the ring. */
  const label = t(S.foundationsLabel);
  const words = label.split(' ');
  const halves = lang === 'zh'
    ? [label.slice(0, Math.round(label.length / 2)), label.slice(Math.round(label.length / 2))] // 每件事共同 | 依赖的底座
    : [words.slice(0, 2).join(' '), ' ' + words.slice(2).join(' ')];        // What every | story runs on
  if (!halves[0] || !halves[1].trim()) throw new Error(`qx-whatwedo: cannot split foundationsLabel "${label}"`);
  head = setText(head, 'qx-h2', escapeHtml(halves[0]));
  head = setText(head, 'qx-text-heading-servie', escapeHtml(halves[1]));

  /* Two decorative images, both announcing themselves as "Image". */
  const alts = head.match(/alt="Image"/g) ?? [];
  if (alts.length !== 2) throw new Error(`qx-whatwedo: expected the ring and the orb, found ${alts.length} donor images`);
  head = head.replace(/alt="Image"/g, 'alt=""');

  /* --------------------------------------------------------- the nodes --- */
  const units = starts.map((at, i) => frag.slice(at, starts[i + 1] ?? end));
  /* The fourth slot is the third node again, tagged so the block's own css can
     place it. Every donor class stays on it. */
  const THREE = 'class="qx-wrapper-main-services qx-wrapper-main-services-three"';
  if (!units[2].startsWith(`<div ${THREE}`)) throw new Error('qx-whatwedo: the third node lost its position class');
  units.push(units[2].replace(THREE, 'class="qx-wrapper-main-services qx-wrapper-main-services-three qx-whatwedo-four"'));

  const nodes = units.map((unit, i) => {
    const f = F[i];
    const num = String(i + 1).padStart(2, '0');
    let node = setText(unit, 'qx-text-tittle-service', num);
    node = setText(node, 'qx-h5', escapeHtml(t(f.label)));
    node = setText(node, 'qx-body', escapeHtml(t(f.promise)));

    /* The panel: this foundation's picks, name then gloss, each in the donor's
       own body type. It sits inside the description wrapper, after the promise,
       so the node's donor structure above it is untouched. */
    const items = f.picks.map((pick) => {
      const cap = capability(C, pick);
      const title = capTitle(escapeHtml(cap.name), escapeHtml(cap.zhName ?? ''));
      return `<div class="qx-body qx-whatwedo-pick"><span class="qx-text-tittle-service">${title}</span> · ${escapeHtml(t(cap.gloss))}</div>`;
    }).join('');
    const panel = `<div class="qx-whatwedo-panel" id="qx-whatwedo-panel-${num}" hidden>${items}</div>`;

    const DESC_CLOSE = '</div></div></div>';
    if (!node.endsWith(DESC_CLOSE)) throw new Error(`qx-whatwedo: node ${num} does not close with body, description wrapper and node`);
    node = node.slice(0, -DESC_CLOSE.length) + '</div>' + panel + '</div></div>';

    /* The node is the click target. Attributes only; nothing donor is removed. */
    const ROOT = '<div class="qx-wrapper-main-services ';
    if (!node.startsWith(ROOT)) throw new Error(`qx-whatwedo: node ${num} root changed`);
    return node.replace(ROOT, `<div role="button" tabindex="0" aria-expanded="false" aria-controls="qx-whatwedo-panel-${num}" class="qx-wrapper-main-services `);
  });

  return head + nodes.join('') + tail;
}

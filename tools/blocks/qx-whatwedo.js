/* qx-whatwedo — open one foundation's capability list on click.
   Vanilla, scoped to .qx-whatwedo. The donor ships no click interaction on
   this block; this is the smallest toggle that does what the owner asked:
   "点击可以分别展开介绍01、02、03、04的功能". One node open at a time, so a
   list never stacks onto a neighbour on the crowded stage.

   Where an open list goes. qx-whatwedo.css hangs each list off its node
   toward the middle of the stage (01 to its right, 02 below, 03 above, 04
   above and to the right), which is right on a desktop screen. The nodes do
   not shrink with the screen, though, and on a tablet the lists landed on a
   neighbour: at 768 and 820 list 01 lay over node 02's title and took its
   clicks, at 1024 × 768 list 02 ran over node 03 and off the bottom of the
   pinned frame, and at 991 list 02 covered node 03. So when a list opens
   (and when the window or the frame changes), its place is checked against
   the other nodes and the pinned frame (`.qx-sticky-service-wrapp`, which
   clips): if the stylesheet's place is clear it is kept; otherwise the list
   goes to the nearest clear place beside, below or above its own node, in the
   order that keeps it pointing into the stage, and may be drawn wider (up to
   twice its node) so it is shorter. Where no clear place holds the whole list
   (a short frame, or the stacked nodes of a 480–767 screen with a long
   English list), it takes the largest clear stretch next to its node and
   scrolls inside it. The orb and the split heading may still be covered, as
   the stylesheet intends; another node's words never are, so every node
   stays readable and clickable while a list is open. Below 480 the lists
   flow under their nodes and none of this runs. */
(function () {
  var root = document.querySelector('.qx-whatwedo');
  if (!root) return;
  var nodes = root.querySelectorAll('.qx-wrapper-main-services[aria-controls]');
  var current = null;
  var settled = false; // the last placement is a compromise: do not redo it on scroll

  function panelOf(node) { return root.querySelector('#' + node.getAttribute('aria-controls')); }
  function setOpen(node, open) {
    var panel = panelOf(node);
    if (!panel) return;
    panel.hidden = !open;
    node.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { current = node; place(node, panel); }
    else if (current === node) current = null;
  }
  function toggle(node) {
    var open = node.getAttribute('aria-expanded') !== 'true';
    for (var i = 0; i < nodes.length; i++) if (nodes[i] !== node) setOpen(nodes[i], false);
    setOpen(node, open);
  }
  for (var i = 0; i < nodes.length; i++) {
    (function (node) {
      node.addEventListener('click', function () { toggle(node); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(node); }
      });
    })(nodes[i]);
  }

  /* ---- where an open list goes ------------------------------------------ */

  /* Per node, the sides to try after the stylesheet's own place, nearest to
     the donor's composition first. right/left: 'start' aligns the list's top
     with the node's, 'end' its bottom. above/below: 'start' aligns the left
     edges, 'end' the right edges, 'beside' starts the list past the node's
     right edge. The list then slides along that side to the nearest clear
     spot. */
  var SIDES = [
    [['right', 'start'], ['below', 'start'], ['left', 'start'], ['above', 'start']],  // 01, top left
    [['below', 'start'], ['left', 'start'], ['above', 'end'], ['right', 'start']],    // 02, right
    [['above', 'start'], ['left', 'end'], ['right', 'end'], ['below', 'start']],      // 03, bottom
    [['above', 'beside'], ['right', 'end'], ['above', 'start'], ['below', 'start']]   // 04, bottom left
  ];

  function frameOf(stage) {
    for (var e = stage; e && e !== document.body; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') return e;
    }
    return null;
  }
  function hits(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
  function rect(x, y, w, h) { return { left: x, top: y, right: x + w, bottom: y + h }; }

  /* The start coordinate nearest `pref` inside [lo, hi] that is not inside any
     blocked interval. */
  function slide(lo, hi, pref, blocked) {
    if (hi < lo) return null;
    var tries = [Math.max(lo, Math.min(hi, pref))];
    for (var i = 0; i < blocked.length; i++) tries.push(blocked[i][0], blocked[i][1]);
    var best = null;
    for (var j = 0; j < tries.length; j++) {
      var c = tries[j], ok = c >= lo - 0.01 && c <= hi + 0.01;
      for (var k = 0; ok && k < blocked.length; k++) if (c > blocked[k][0] + 0.01 && c < blocked[k][1] - 0.01) ok = false;
      if (ok && (best === null || Math.abs(c - pref) < Math.abs(best - pref))) best = c;
    }
    return best;
  }

  function geometry(node, panel) {
    var stage = node.offsetParent;
    if (!stage) return null;
    var sb = stage.getBoundingClientRect();
    var frame = frameOf(stage);
    var fb = frame ? frame.getBoundingClientRect() : { top: -Infinity, bottom: Infinity };
    var gap = parseFloat(getComputedStyle(panel).rowGap) || 12;
    var others = [], rects = [];
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      rects.push(r);
      /* keep a list a gap clear of every node, its own included */
      others.push({ left: r.left - gap + 1, right: r.right + gap - 1, top: r.top - gap + 1, bottom: r.bottom + gap - 1 });
    }
    return {
      box: { left: sb.left, right: sb.right, top: Math.max(sb.top, fb.top), bottom: Math.min(sb.bottom, fb.bottom) },
      gap: gap,
      node: node.getBoundingClientRect(),
      index: Array.prototype.indexOf.call(nodes, node),
      others: others,
      rects: rects
    };
  }
  function distance(a, b) {
    var dx = Math.max(0, a.left - b.right, b.left - a.right);
    var dy = Math.max(0, a.top - b.bottom, b.top - a.bottom);
    return Math.sqrt(dx * dx + dy * dy);
  }
  /* A list away from its node should still sit about as near to it as to any
     other node (within two gaps), or it reads as the other node's list. */
  function nearestIsOwn(g, r) {
    var own = distance(r, g.rects[g.index]);
    for (var i = 0; i < g.rects.length; i++) if (i !== g.index && distance(r, g.rects[i]) + 2 * g.gap < own) return false;
    return true;
  }
  function clear(g, r) {
    if (r.left < g.box.left - 1 || r.right > g.box.right + 1 || r.top < g.box.top - 1 || r.bottom > g.box.bottom + 1) return false;
    for (var i = 0; i < g.others.length; i++) if (hits(r, g.others[i])) return false;
    return true;
  }

  /* The free vertical runs of the frame for a list spanning [x, x + w]. */
  function runs(g, x, w) {
    var busy = [];
    for (var i = 0; i < g.others.length; i++) {
      var r = g.others[i];
      if (r.left < x + w && r.right > x) busy.push([r.top, r.bottom]);
    }
    busy.sort(function (a, b) { return a[0] - b[0]; });
    var out = [], at = g.box.top;
    for (var k = 0; k < busy.length; k++) {
      if (busy[k][0] > at) out.push([at, Math.min(busy[k][0], g.box.bottom)]);
      at = Math.max(at, busy[k][1]);
    }
    if (at < g.box.bottom) out.push([at, g.box.bottom]);
    return out;
  }

  function place(node, panel) {
    var s = panel.style;
    s.left = s.top = s.right = s.bottom = s.width = s.maxHeight = s.overflowY = '';
    panel.removeAttribute('data-lenis-prevent');
    settled = false;
    if (panel.hidden || getComputedStyle(panel).position !== 'absolute') return;
    var g = geometry(node, panel);
    if (!g) return;
    if (clear(g, panel.getBoundingClientRect())) return; // the stylesheet's place is fine

    /* where (left: 0; top: 0) puts the list: the origin of its node's box */
    s.left = '0px'; s.top = '0px'; s.right = 'auto'; s.bottom = 'auto';
    var o = panel.getBoundingClientRect();
    var n = g.node, gap = g.gap, box = g.box;
    var sides = SIDES[g.index] || SIDES[0];
    var full = box.right - box.left;

    /* the widths a list may take — its node's, up to twice that — and the
       height it then needs */
    var sizes = [];
    [1, 1.25, 1.5, 1.75, 2].forEach(function (k) {
      var w = Math.round(Math.min(full, n.width * k));
      if (sizes.length && w <= sizes[sizes.length - 1].w) return;
      s.width = w + 'px';
      sizes.push({ w: w, h: panel.offsetHeight });
    });

    function apply(c) {
      s.width = Math.round(c.w) + 'px';
      s.left = Math.round(c.x - o.left) + 'px';
      s.top = Math.round(c.y - o.top) + 'px';
      if (c.max) {
        /* a list taller than the room it has scrolls inside itself; Lenis is
           told to leave the wheel to it */
        s.maxHeight = Math.floor(c.max) + 'px';
        s.overflowY = 'auto';
        panel.setAttribute('data-lenis-prevent', '');
      }
      settled = !!c.max || !!c.far;
    }
    function blockedY(x, w, h) {
      var b = [];
      for (var j = 0; j < g.others.length; j++) {
        var r = g.others[j];
        if (r.left < x + w && r.right > x) b.push([r.top - h, r.bottom]);
      }
      return b;
    }
    function blockedX(y, w, h) {
      var b = [];
      for (var j = 0; j < g.others.length; j++) {
        var r = g.others[j];
        if (r.top < y + h && r.bottom > y) b.push([r.left - w, r.right]);
      }
      return b;
    }
    function clampX(x, w) { return Math.max(box.left, Math.min(box.right - w, x)); }
    /* a list reads as its node's when it starts beside the node's own lines,
       or right under or over them */
    function besideIt(y, h) { return y <= n.bottom - 24 && y + h >= n.top + 24; }
    function underIt(x, w) { return x <= n.right + gap + 1 && x + w >= n.left - 1; }

    /* 1. Next to its node — beside it, or right under or over it — sliding
          along that side, at the narrowest width that fits. On the way, note
          the first clear place further along that side or down the same
          column, preferring one that still sits nearest its own node. */
    var mine = null, any = null;
    function aside(x, y, w, h) {
      var c = { x: x, y: y, w: w, far: true };
      if (!mine && nearestIsOwn(g, rect(x, y, w, h))) mine = c;
      if (!any) any = c;
    }
    for (var si = 0; si < sides.length; si++) {
      var side = sides[si][0], align = sides[si][1];
      for (var zi = 0; zi < sizes.length; zi++) {
        var w = sizes[zi].w, h = sizes[zi].h, x, y;
        if (side === 'right' || side === 'left') {
          x = side === 'right' ? n.right + gap : n.left - gap - w;
          if (x < box.left - 1 || x + w > box.right + 1) continue;
          y = slide(box.top, box.bottom - h, align === 'end' ? n.bottom - h : n.top, blockedY(x, w, h));
          if (y === null || !clear(g, rect(x, y, w, h))) continue;
          if (besideIt(y, h)) { apply({ x: x, y: y, w: w }); return; }
          aside(x, y, w, h);
          continue;
        }
        var want = side === 'below' ? n.bottom + gap : n.top - gap - h;
        var px = clampX(align === 'end' ? n.right - w : align === 'beside' ? n.right + gap : n.left, w);
        if (want >= box.top - 1 && want + h <= box.bottom + 1) {
          x = slide(box.left, box.right - w, px, blockedX(want, w, h));
          if (x !== null && clear(g, rect(x, want, w, h))) {
            if (underIt(x, w)) { apply({ x: x, y: want, w: w }); return; }
            aside(x, want, w, h);
          }
        }
        y = slide(box.top, box.bottom - h, want, blockedY(px, w, h));
        if (y !== null && clear(g, rect(px, y, w, h))) aside(px, y, w, h);
      }
    }
    if (mine) { apply(mine); return; }

    /* 2. No clear place near its node holds the whole list (a short or
          crowded frame): the largest clear stretch of a column next to the
          node, scrolling — or, failing that, the whole list further away. */
    var best = null, bestAny = null;
    for (var zj = 0; zj < sizes.length; zj++) {
      var ww = sizes[zj].w, need = sizes[zj].h;
      var xs = [n.left, n.right - ww, n.right + gap, n.left - gap - ww, box.left, box.right - ww];
      for (var xi = 0; xi < xs.length; xi++) {
        var cx = xs[xi];
        if (cx < box.left - 1 || cx + ww > box.right + 1) continue;
        var free = runs(g, cx, ww);
        for (var fi = 0; fi < free.length; fi++) {
          var top = free[fi][0], end = free[fi][1], tall = end - top;
          if (tall < 120) continue;
          var over = Math.abs(end - (n.top - gap)) < 2;
          var ty = over && need < tall ? end - need : top;
          var shown = Math.min(tall, need);
          var near = underIt(cx, ww) && (over || Math.abs(top - (n.bottom + gap)) < 2);
          /* more of the list first, then a list touching its node, then a narrower one */
          var score = shown + (near ? 40 : 0) - zj;
          var c = { x: cx, y: ty, w: ww, max: need > tall ? tall : 0, score: score };
          if (nearestIsOwn(g, rect(cx, ty, ww, shown))) { if (!best || score > best.score) best = c; }
          else if (!bestAny || score > bestAny.score) bestAny = c;
        }
      }
    }
    if (best) { apply(best); return; }
    if (any) { apply(any); return; }
    if (bestAny) { apply(bestAny); return; }

    /* 3. A frame with no room at all (a landscape phone): the list goes
          under its node — or over it, where there is more room — inside the
          frame, and scrolls there, rather than off the edge of the screen. */
    var below = box.bottom - (n.bottom + gap), above = (n.top - gap) - box.top;
    var room = Math.max(below, above, 80);
    var need0 = sizes[0].h;
    var cy = below >= above ? n.bottom + gap : n.top - gap - Math.min(need0, room);
    cy = Math.max(box.top, Math.min(box.bottom - Math.min(need0, room), cy));
    apply({ x: clampX(n.left, sizes[0].w), y: cy, w: sizes[0].w, max: need0 > room ? room : 0, far: true });
  }

  /* The frame moves with the page until it pins, and the nodes drift a little
     as they fade in; a list that no longer fits is placed again. A resize or a
     late font always places it again. */
  var queued = false;
  function recheck(force) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      if (!current) return;
      var panel = panelOf(current);
      if (!panel || panel.hidden) return;
      if (!force) {
        if (settled) return;
        var g = geometry(current, panel);
        if (!g || clear(g, panel.getBoundingClientRect())) return;
      }
      place(current, panel);
    });
  }
  window.addEventListener('resize', function () { recheck(true); });
  window.addEventListener('scroll', function () { recheck(false); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { recheck(true); });
})();

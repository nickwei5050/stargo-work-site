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
   twice its node) so it is shorter. The orb and the split heading may still
   be covered, as the stylesheet intends; another node's words never are, so
   every node stays readable and clickable while a list is open. Below 480 the
   lists flow under their nodes and none of this runs. */
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
  function area(a, b) {
    return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }
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
    var others = [];
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      /* keep a list a gap clear of every node, its own included */
      others.push({ left: r.left - gap + 1, right: r.right + gap - 1, top: r.top - gap + 1, bottom: r.bottom + gap - 1 });
    }
    return {
      box: { left: sb.left, right: sb.right, top: Math.max(sb.top, fb.top), bottom: Math.min(sb.bottom, fb.bottom) },
      gap: gap,
      node: node.getBoundingClientRect(),
      others: others
    };
  }
  function clear(g, r) {
    if (r.left < g.box.left - 1 || r.right > g.box.right + 1 || r.top < g.box.top - 1 || r.bottom > g.box.bottom + 1) return false;
    for (var i = 0; i < g.others.length; i++) if (hits(r, g.others[i])) return false;
    return true;
  }
  function cost(g, r) {
    var c = 0;
    for (var i = 0; i < g.others.length; i++) c += area(r, g.others[i]);
    c += Math.max(0, g.box.top - r.top) * (r.right - r.left) + Math.max(0, r.bottom - g.box.bottom) * (r.right - r.left);
    return c;
  }

  function place(node, panel) {
    var s = panel.style;
    s.left = s.top = s.right = s.bottom = s.width = '';
    settled = false;
    if (panel.hidden || getComputedStyle(panel).position !== 'absolute') return;
    var g = geometry(node, panel);
    if (!g) return;
    if (clear(g, panel.getBoundingClientRect())) return; // the stylesheet's place is fine

    /* where (left: 0; top: 0) puts the list: the origin of its node's box */
    s.left = '0px'; s.top = '0px'; s.right = 'auto'; s.bottom = 'auto';
    var o = panel.getBoundingClientRect();
    var n = g.node, gap = g.gap, box = g.box;
    var index = Array.prototype.indexOf.call(nodes, node);
    var sides = SIDES[index] || SIDES[0];
    var widths = [n.width, Math.min(box.right - box.left, n.width * 1.5), Math.min(box.right - box.left, n.width * 2)];
    var fallback = null;

    for (var wi = 0; wi < widths.length; wi++) {
      var w = Math.round(widths[wi]);
      if (wi && w <= Math.round(widths[wi - 1])) continue;
      s.width = w + 'px';
      var h = panel.offsetHeight;
      for (var si = 0; si < sides.length; si++) {
        var side = sides[si][0], align = sides[si][1];
        var x = null, y = null, blocked = [], j, r;
        if (side === 'right' || side === 'left') {
          x = side === 'right' ? n.right + gap : n.left - gap - w;
          if (x < box.left - 1 || x + w > box.right + 1) continue;
          var py = align === 'end' ? n.bottom - h : n.top;
          for (j = 0; j < g.others.length; j++) {
            r = g.others[j];
            if (r.left < x + w && r.right > x) blocked.push([r.top - h, r.bottom]);
          }
          y = slide(box.top, box.bottom - h, py, blocked);
          if (y === null) y = Math.max(box.top, Math.min(box.bottom - h, py));
        } else {
          y = side === 'below' ? n.bottom + gap : n.top - gap - h;
          if (y < box.top - 1 || y + h > box.bottom + 1) {
            var cy = Math.max(box.top, Math.min(box.bottom - h, y));
            var cx = Math.max(box.left, Math.min(box.right - w, n.left));
            var c = cost(g, rect(cx, cy, w, h)) + 1e6;
            if (!fallback || c < fallback.c) fallback = { c: c, x: cx, y: cy, w: w };
            continue;
          }
          var px = align === 'end' ? n.right - w : align === 'beside' ? n.right + gap : n.left;
          for (j = 0; j < g.others.length; j++) {
            r = g.others[j];
            if (r.top < y + h && r.bottom > y) blocked.push([r.left - w, r.right]);
          }
          x = slide(box.left, box.right - w, px, blocked);
          if (x === null) x = Math.max(box.left, Math.min(box.right - w, px));
        }
        var at = rect(x, y, w, h);
        if (clear(g, at)) {
          s.left = Math.round(x - o.left) + 'px';
          s.top = Math.round(y - o.top) + 'px';
          return;
        }
        var cc = cost(g, at);
        if (!fallback || cc < fallback.c) fallback = { c: cc, x: x, y: y, w: w };
      }
    }
    /* Nothing is clear (a very short frame): take the place that covers least. */
    if (fallback) {
      s.width = Math.round(fallback.w) + 'px';
      s.left = Math.round(fallback.x - o.left) + 'px';
      s.top = Math.round(fallback.y - o.top) + 'px';
      settled = true;
    } else {
      s.left = s.top = s.right = s.bottom = s.width = '';
    }
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

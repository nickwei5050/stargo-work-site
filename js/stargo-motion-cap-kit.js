/* CAP KIT — what the code-drawn scenes of capabilities.html share: the glyphs of their
   apps and rows (24-unit strokes; anything not here falls back to the engine's K.ICON,
   which has mail, check and shield) and one absolutely placed box. Read by
   js/stargo-motion-areas*.js and js/stargo-motion-crew.js, which load after it. */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var GL = K.capGL = {
    search: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l4.5 4.5',
    send: 'M4.5 11.5 19.5 4.5 15 19.5l-3.5-6zM11.5 13.5l8-9',
    gauge: 'M4.5 16.5a7.5 7.5 0 1 1 15 0M12 16.5l3.8-4.6',
    layers: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
    inbox: 'M4.5 13.5 7 5.5h10l2.5 8v5h-15zM4.5 13.5h4.5l1 2h4l1-2h4.5',
    card: 'M4.5 6h15v12h-15zM9 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6.5 16c.6-1.4 1.4-2 2.5-2s1.9.6 2.5 2M14 10h3M14 13.5h3',
    book: 'M12 7.5c-1.6-1.4-3.9-2-7-2v12c3.1 0 5.4.6 7 2 1.6-1.4 3.9-2 7-2v-12c-3.1 0-5.4.6-7 2zM12 7.5v12',
    pen: 'M5 19l1-4 9.5-9.5 3 3L9 18zM13.5 7.5l3 3',
    doc: 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
    box: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
    play: 'M4.5 6h15v12h-15zM10.5 9.5v5l4-2.5z',
    coin: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM14.4 9.6c-.4-.8-1.2-1.3-2.4-1.3-1.4 0-2.4.8-2.4 1.8 0 2.5 4.9 1.3 4.9 3.8 0 1-1 1.8-2.5 1.8-1.2 0-2.1-.5-2.5-1.3M12 7v1.3M12 15.7V17',
    users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 10.5a2.5 2.5 0 1 0 0-5M17 14.5c2 .3 3.2 1.8 3.6 4.5',
    nodes: 'M8.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM14.5 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 7h7M7 9.2l3.6 6.2M17 9.2l-3.6 6.2',
    loop: 'M18.5 9A7 7 0 0 0 6 7.5M5.5 15A7 7 0 0 0 18 16.5M6 4v3.5h3.5M18 20v-3.5h-3.5',
    lock: 'M7 11h10v8.5H7zM9 11V8.5a3 3 0 0 1 6 0V11',
    arrow: 'M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5',
    sales: 'M4.5 8.5h15v10h-15zM9 8.5V6.2c0-.7.5-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2v2.3M4.5 13h15',
    image: 'M4.5 5.5h15v13h-15zM4.5 15.5l4.5-4.5 4 4 2.5-2.5 4 4M15 9.5h.01'
  };
  K.capGlyph = function (name, parent, size, cls) {
    var s = K.sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sg-ico' }, parent);
    K.sv('path', { d: GL[name] || K.ICON[name], stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  };
  K.capBox = function (cls, parent, x, y, w, h, text) {
    var e = K.el('div', cls, parent, text), s = e.style;
    s.left = x + 'px'; s.top = y + 'px';
    if (w != null) s.width = w + 'px';
    if (h != null) s.height = h + 'px';
    return e;
  };
  /* Texts that have shorter forms (areas, crew): each is written in its first form and, once
     the scene is built, takes the next form while it still overflows its box. Layout is read
     once per pass, at build only; `done` hears the form that was kept. */
  K.capAlts = function () {
    var o = [];
    for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; if (v != null && o.indexOf(v) < 0) o.push(v); }
    return o;
  };
  // a text overflows when what its box has to draw — from the box's left edge (its padding, a ::before
  // in front of the text, as .sga-grp's '/') to the text's own end, plus its right padding — is wider than
  // the box. Read from the text's range, not scrollWidth (which rounds a fraction of a pixel away while
  // the ellipsis still shows). A box that sizes to its words (a flex item) is exactly as wide as that
  // when they fit, and narrower when they do not, so there is no spare to ask of it: 0.05px of noise.
  var rng = document.createRange();
  var over = K.capOver = function (e) {
    rng.selectNodeContents(e);
    var t = rng.getBoundingClientRect(), b = e.getBoundingClientRect();
    if (!t.width || !b.width) return false;
    if (e.sgPR == null) { var cs = getComputedStyle(e); e.sgPR = (parseFloat(cs.paddingRight) || 0) + (parseFloat(cs.borderRightWidth) || 0); }
    return t.right - b.left + e.sgPR * (e.offsetWidth ? b.width / e.offsetWidth : 1) > b.width + 0.05;
  };
  K.capFit = function () {
    var L = [];
    return {
      add: function (e, list, done) { K.put(e, 'text', list[0]); if (list.length > 1 || done) L.push({ e: e, l: list, k: 0, done: done }); return e; },
      run: function () {
        for (var pass = 0; pass < 4; pass++) {
          var ov = L.map(function (f) { return f.k < f.l.length - 1 && over(f.e); }), any = false;
          L.forEach(function (f, i) { if (ov[i]) { f.k++; K.put(f.e, 'text', f.l[f.k]); any = true; } });
          if (!any) break;
        }
        var D = L; L = [];
        D.forEach(function (f) { if (f.done) f.done(f.l[f.k]); });
      }
    };
  };
  return {};
});

/* GSAP SplitText splits "words" on spaces. Chinese has none, so on the Chinese
   pages a whole paragraph became one unbreakable inline-block and its "lines"
   were detected wrongly (text re-wrapped inside each line block). The Webflow
   engine instantiates SplitText itself with a fixed option set, so the class
   is wrapped here — on zh pages only — to supply a word delimiter that:
     · splits between ideographs / kana (each character becomes a word),
     · keeps CJK punctuation attached to the character before it,
     · keeps opening quotes/brackets attached to the character after,
     · leaves Latin runs (a word, "STARGO WORK", "288") intact,
     · keeps a real space where the copy had one (the space rides at the start
       of the next word, which SplitText re-inserts as a space node).
   Loaded after SplitText.min.js and before the Webflow bundle. */
(function () {
  var Orig = window.SplitText;
  if (!Orig) return;
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var re;
  try {
    var IDEO = '\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff';
    var PUNCT = '\\u3000-\\u303f\\uff00-\\uffef';
    var OPEN = '\\u300c\\u300e\\uff08\\u3010\\u300a\\u3008\\u201c\\u2018';
    re = new RegExp(
      '(?<![\\s' + OPEN + '])(?=\\s?[' + IDEO + '])' +
      '|(?<=[' + IDEO + PUNCT + '])(?<![' + OPEN + '])(?=\\s?[^\\s' + PUNCT + '])',
    );
  } catch (e) {
    return; // no lookbehind support: keep the template behaviour
  }
  function Patched(targets, vars) {
    var v = Object.assign({}, vars || {});
    // The donor splits generic containers and paragraphs as well as headings.
    // Auto aria-label is invalid on those containers and hides nested headings
    // and links. Keep their original semantic text tree exposed in both languages.
    v.aria = 'none';
    if (zh && v.wordDelimiter == null) v.wordDelimiter = { delimiter: re, replaceWith: '' };
    // With a custom delimiter SplitText pops a trailing empty chunk and then
    // reads the first one; an empty text node would leave it nothing to read.
    if (zh && v.prepareText == null) v.prepareText = function (text) { return text === '' ? ' ' : text; };
    // A phrase marked .sgp-nobr (the Chinese article headings, tools/blog.mjs
    // titleHtml) is kept whole: with the per-character delimiter above, lines
    // could otherwise be cut inside a word such as 「获客」.
    if (v.ignore == null) v.ignore = '.sgp-nobr';
    return new Orig(targets, v);
  }
  Patched.prototype = Orig.prototype;
  try { Object.setPrototypeOf(Patched, Orig); } catch (e) { /* statics unavailable */ }
  Patched.create = function (targets, vars) { return new Patched(targets, vars); };
  window.SplitText = Patched;
})();

/* Accessible names for split text (review item Z15, a11y lane).
   The wrapper above passes aria: 'none', so SplitText leaves the original
   tree exposed: a screen reader then meets every line, word and character
   box as its own node, and links, buttons and headings were named letter by
   letter ("R e q u e s t a D e m o", heading "S T A R G O"). After every
   split — SplitText's own re-splits included, and whichever code path made
   the instance, hence the prototype — each split element gets one visually
   hidden copy of its text, and its split boxes are hidden from assistive
   technology. An element that holds a link, a button, a form control or a
   heading of its own is left exactly as before: hiding its boxes would hide
   those too. revert() restores the original markup, copy included. */
(function () {
  var ST = window.SplitText;
  var proto = ST && ST.prototype;
  if (!proto || typeof proto.split !== 'function' || proto.split.stargoA11y) return;
  var KEEP = 'a,button,input,select,textarea,[tabindex],h1,h2,h3,h4,h5,h6,[role="heading"],[role="button"],[role="link"]';
  var SR = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap';
  function label(self) {
    var els = (self && self.elements) || [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el || el.nodeType !== 1 || el.closest('[aria-hidden="true"]') || el.querySelector(KEEP)) continue;
      if (el.querySelector(':scope > [data-stargo-sr]')) continue;
      var text = (el.textContent || '').replace(/[\u200b\u2060\u00ad]/g, '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) c.setAttribute('aria-hidden', 'true');
      var sr = document.createElement('span');
      sr.setAttribute('data-stargo-sr', '');
      sr.style.cssText = SR;
      sr.textContent = text;
      el.insertBefore(sr, el.firstChild);
    }
  }
  var split = proto.split;
  proto.split = function () {
    var out = split.apply(this, arguments);
    try { label(this); } catch (e) { /* names are an enhancement; never break the reveal */ }
    return out;
  };
  proto.split.stargoA11y = true;
  /* Webflow's interactions engine also splits text whose instances do not
     pass through the method above (its boxes carry gsap_split_* classes); a
     mutation observer labels those roots once their split has been
     inserted. Observer callbacks run after the split's synchronous work. */
  if (!window.MutationObserver) return;
  var SPLIT = /(?:^|\s)gsap_split_/;
  new MutationObserver(function (records) {
    var roots = [];
    for (var r = 0; r < records.length; r++) {
      var added = records[r].addedNodes;
      for (var a = 0; a < added.length; a++) {
        var n = added[a];
        if (n.nodeType !== 1 || !SPLIT.test(n.className || '')) continue;
        var root = n.parentElement;
        while (root && SPLIT.test(root.className || '')) root = root.parentElement;
        if (root && roots.indexOf(root) === -1) roots.push(root);
      }
    }
    if (roots.length) { try { label({ elements: roots }); } catch (e) { /* as above */ } }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

/* Lazy splitting (speed lane, review item Z01). Webflow IX3 builds every
   timeline at window load and splits every SplitText target on the page in
   that one task: 70-150 targets on the homepage, about 80% of them far below
   the fold, which froze the page for 3-4s on a desktop and far longer on a
   phone. Here the engine's AnimationCoordinator.doSplitText is wrapped so that
   a target more than about one screen away from the viewport is split only
   when it comes within one screen (IntersectionObserver). Its timeline is first
   built on the whole element, and the engine's own re-split path
   (scheduleRebuildForElement, the one it uses after a font or width change)
   rebuilds it on the pieces when the split happens, so the animation the
   reader sees is the same. Anything unexpected (another bundle, no observer)
   leaves the engine exactly as it was. */
(function () {
  var q = self.webpackChunk;
  if (!q || typeof q.push !== 'function' || !window.IntersectionObserver) return;
  /* The engine's classes by export name. The module ids are those of the
     vendored bundle (js/app.schunk.25099a4fefa544e6.js); should it change, the
     modules are searched by the name instead. */
  function find(req, id, name, needle) {
    try {
      var m = req(id);
      if (m && m[name]) return m[name];
    } catch (e) { /* fall through */ }
    var defs = req.m || {};
    for (var k in defs) {
      try {
        if (String(defs[k]).indexOf(needle) < 0) continue;
        var x = req(k);
        if (x && x[name]) return x[name];
      } catch (e) { /* keep looking */ }
    }
    return null;
  }
  function patch(req) {
    lateLoads(req);
    var AC = find(req, 4054, 'AnimationCoordinator', 'globalSplitRegistry');
    if (!AC || !AC.prototype || typeof AC.prototype.doSplitText !== 'function' || AC.prototype.doSplitText.__sgLazy) return;
    var orig = AC.prototype.doSplitText;
    var pending = new Map();
    var refreshTimer = 0;
    function refresh() {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        try { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); } catch (e) { /* ignore */ }
      }, 120);
    }
    function flush(el) {
      var calls = pending.get(el);
      if (!calls) return;
      pending.delete(el);
      io.unobserve(el);
      var h = el.offsetHeight;
      for (var i = 0; i < calls.length; i++) orig.call(calls[i][0], calls[i][1], [el], calls[i][2], calls[i][3]);
      if (el.offsetHeight !== h) refresh();
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) if (entries[i].isIntersecting) flush(entries[i].target);
    }, { rootMargin: '100% 0px 100% 0px' });
    function far(el) {
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return false; // hidden (menu, closed tab): split now, as before
      var h = window.innerHeight || 800;
      return r.top > 2 * h || r.bottom < -h;
    }
    var lazy = function (cfg, targets, ctx, Cls) {
      var now = [];
      for (var i = 0; i < targets.length; i++) {
        var el = targets[i];
        var calls = pending.get(el);
        if (calls) { calls.push([this, cfg, ctx, Cls]); continue; }
        if (!el || !el.getBoundingClientRect || !far(el)) { now.push(el); continue; }
        pending.set(el, [[this, cfg, ctx, Cls]]);
        // The load trigger waits for web fonts when a timeline splits lines; keep that.
        try { if (String(cfg && cfg.type).indexOf('lines') > -1) ctx.timeline.data.splitLines = true; } catch (e) { /* ignore */ }
        io.observe(el);
      }
      if (now.length) return orig.call(this, cfg, now, ctx, Cls);
    };
    lazy.__sgLazy = true;
    AC.prototype.doSplitText = lazy;
    // A jump past the margin (an anchor link, a restored scroll position) is
    // caught by the observer on the next frame; pagehide needs nothing.
  }
  /* Late page-load timelines (speed lane, Z13). The head script
     (tools/speed.mjs) sets `sg-ix-late` on <html> one second after the first
     paint. A page-load timeline that only starts after that would hide a hero
     the reader is already reading and play it in again, so it is put at its
     end state instead (the engine's own "skip-to-end"). On time, it plays. */
  function lateLoads(req) {
    var LT = find(req, 3636, 'LoadTriggerStrategy', 'LoadTriggerStrategy');
    if (!LT || !LT.prototype || typeof LT.prototype.bind !== 'function' || LT.prototype.bind.__sgLate) return;
    var bind = LT.prototype.bind;
    var late = function (e, t, n) {
      var self = this;
      if (window.__wf_ix3 || !n || n.conditionalContext !== null || !t || !self.loadInteractions || typeof self.skipToEndState !== 'function') return bind.apply(this, arguments);
      var queued = self.loadInteractions.length;
      bind.apply(this, arguments);
      var run = self.loadInteractions[queued];
      if (typeof run !== 'function') return;
      self.loadInteractions[queued] = function () {
        if (/\bsg-ix-late\b/.test(document.documentElement.className)) {
          try { self.skipToEndState(t, null); return; } catch (err) { /* play it instead */ }
        }
        return run.apply(this, arguments);
      };
    };
    late.__sgLate = true;
    LT.prototype.bind = late;
  }
  try { q.push([['stargo-lazy-split'], {}, patch]); } catch (e) { /* engine untouched */ }
})();

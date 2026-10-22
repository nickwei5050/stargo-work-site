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
  try { q.push([['stargo-lazy-split'], {}, patch]); } catch (e) { /* engine untouched */ }
})();

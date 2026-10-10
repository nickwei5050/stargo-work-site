/* OPEN WORK page behaviour (tools/ow-blocks): the showcase tabs, the
   product-shot lightbox, the demo bar, the product page's folded catalogue,
   the pricing questions, the contact form's plan and the demo video. Hand-written, no
   dependencies, loaded with defer on every page tools/build-site.mjs builds
   with owShell (all but the blog). Without it every
   showcase panel is shown in turn (css/stargo-ow.css), the pictures stay as
   they are, the catalogue groups open by hand and the demo bar never
   appears. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- tabs: WAI-ARIA tab pattern, automatic activation ---------------- */
  function initTabs(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = panelOf(t);
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
      // keep the selected tab in view when the tab bar scrolls sideways
      var bar = tab.closest('.ow-tablist-wrap');
      if (bar && bar.scrollWidth > bar.clientWidth) {
        var l = tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, l), behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') to = tabs[0];
        else if (e.key === 'End') to = tabs[tabs.length - 1];
        if (!to) return;
        e.preventDefault();
        select(to, true);
      });
    });
  }
  var sets = document.querySelectorAll('[data-ow-tabs]');
  for (var s = 0; s < sets.length; s++) initTabs(sets[s]);

  /* ---- demo bar: in once the hero's buttons are gone, out at the demo band,
     and out while it would sit on a product shot (it used to cover the
     showcase's own words, 「批准前不会发给客户」). Its box is read without the
     slide-in transform (offset*), so the test does not depend on whether it
     is showing. */
  (function () {
    var bar = document.querySelector('[data-ow-sticky]');
    var cta = document.querySelector('.ow-hero .ow-cta-row');
    var demo = document.getElementById('demo');
    if (!bar || !cta || !demo) return;
    var shots = document.querySelectorAll('.ow-shot .ow-frame, .ow-shot-meta, [data-ow-avoid]');
    var on = false;
    function overShot() {
      var top = bar.offsetTop - 8, bottom = bar.offsetTop + bar.offsetHeight + 8;
      var left = bar.offsetLeft - 8, right = bar.offsetLeft + bar.offsetWidth + 8;
      for (var i = 0; i < shots.length; i++) {
        var r = shots[i].getBoundingClientRect();
        if (r.width && r.top < bottom && r.bottom > top && r.left < right && r.right > left) return true;
      }
      return false;
    }
    function update() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      var show = cta.getBoundingClientRect().bottom < 0 && demo.getBoundingClientRect().top > h * 0.85 && !overShot();
      if (show === on) return;
      on = show;
      bar.classList.toggle('is-on', show);
      if (show) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    }
    var queued = false;
    function queue() { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; update(); }); } }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  })();

  /* ---- folded catalogue (product page): open the group an address names
     (capabilities.html#g08, from an article or a link on the page), and the
     「全部展开 / 全部收起」 button. Without this script every group is a plain
     <details> the reader opens by hand. */
  (function () {
    function openTarget() {
      var id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
      var el = id && document.getElementById(id);
      var d = el && (el.tagName === 'DETAILS' ? el : el.closest && el.closest('details'));
      if (d && !d.open) d.open = true;
    }
    openTarget();
    window.addEventListener('hashchange', openTarget);
    var all = document.querySelectorAll('[data-ow-expand]');
    for (var i = 0; i < all.length; i++) {
      (function (btn) {
        var root = document.querySelector(btn.getAttribute('data-ow-expand'));
        if (!root) return;
        var label = btn.querySelector('span');
        btn.addEventListener('click', function () {
          var on = btn.getAttribute('aria-pressed') !== 'true';
          var groups = root.querySelectorAll('details');
          for (var j = 0; j < groups.length; j++) groups[j].open = on;
          btn.setAttribute('aria-pressed', String(on));
          if (label) label.textContent = btn.getAttribute(on ? 'data-label-close' : 'data-label-open');
        });
      })(all[i]);
    }
  })();

  /* ---- pricing questions (<details>): aria-expanded follows the answer, and
     Escape closes an open one. Without this script they still open and close. */
  (function () {
    var items = document.querySelectorAll('[data-ow-faq] details');
    for (var i = 0; i < items.length; i++) {
      (function (d) {
        var q = d.querySelector('summary');
        if (!q) return;
        function sync() { q.setAttribute('aria-expanded', String(d.open)); }
        d.addEventListener('toggle', sync);
        q.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && d.open) { e.preventDefault(); d.open = false; sync(); }
        });
        sync();
      })(items[i]);
    }
  })();

  /* ---- the demo form names the plan a pricing card linked from
     (contact.html?plan=growth …); without the script the select says
     「还没决定」 and the reader picks one. */
  (function () {
    var sel = document.querySelector('[data-ow-plan]');
    if (!sel) return;
    var m = /[?&]plan=([a-z-]+)/.exec(location.search);
    if (!m) return;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === m[1]) { sel.selectedIndex = i; break; }
    }
  })();

  /* ---- the demo video (tools/ow-blocks/demo-video.mjs; homepage under the
     hero, product page under its jump links) ------------------------------
     Muted and looping, it plays while at least half of it is on screen (or
     it fills at least half the screen) and pauses when it leaves; under
     prefers-reduced-motion, or with the
     browser's data saver on, it never starts by itself. The first time it
     plays it starts at data-start (the inquiry already in, AI reading it),
     not at the near-empty first second. The button under it (and a click on
     the film) plays and pauses it; a pause by hand holds until the reader
     plays it again. The markup has preload="none" and no autoplay, so until
     it is on screen the page fetches its still only.
     The film follows its still: the still's <picture> picks the phone cut by
     its <source media>, which every browser honours on a picture. On a
     <video>, Chrome and Firefox honour `media` only since version 120 (older
     engines play the first source), so the script keeps both pairs of
     sources — the desktop pair, then the phone pair, which carries `media` —
     and puts only the pair of the still's cut in the video. If the screen
     crosses the line later, the pairs swap and the film loads again. Without
     this script the browser's own controls stay, the desktop film is the
     first source, and nothing plays by itself. */
  (function () {
    var figs = document.querySelectorAll('[data-ow-demo-wrap]');
    for (var i = 0; i < figs.length; i++) {
      (function (fig) {
        var v = fig.querySelector('video[data-ow-demo]');
        var btn = fig.querySelector('[data-ow-demo-toggle]');
        if (!v || !btn || typeof v.play !== 'function') return;
        var text = btn.querySelector('[data-ow-demo-label]');
        var onScreen = false;
        var saveData = !!(navigator.connection && navigator.connection.saveData);
        var wanted = !reduce && !saveData;   // play whenever it is on screen
        var start = parseFloat(v.getAttribute('data-start')) || 0;
        var started = false;
        v.muted = true;
        v.removeAttribute('controls');
        btn.hidden = false;
        fig.classList.add('is-js');
        function paint() {
          var playing = !v.paused;
          fig.classList.toggle('is-playing', playing);
          btn.setAttribute('aria-label', btn.getAttribute(playing ? 'data-label-pause' : 'data-label-play'));
          if (text) text.textContent = btn.getAttribute(playing ? 'data-text-pause' : 'data-text-play');
        }
        function play() {
          /* the pair in the video changed since the browser chose its source: choose again now that
             the film is wanted (load() fetches even under preload="none", so never before) */
          if (stale) { stale = false; started = false; v.load(); }
          /* the first play opens at data-start; before any data that sets where loading starts */
          if (!started) {
            started = true;
            if (start && v.currentTime < start) { try { v.currentTime = start; } catch (e) { /* not seekable yet: from the start */ } }
          }
          var p = v.play();
          /* refused (a power saver, a browser that blocks it): wait for the button */
          if (p && p.catch) p.catch(function (e) { if (e && e.name === 'NotAllowedError') { wanted = false; paint(); } });
        }
        function sync() {
          if (wanted && onScreen) { if (v.paused) play(); }
          else if (!v.paused) v.pause();
        }
        function toggle() {
          wanted = v.paused;
          if (wanted) { onScreen = true; play(); } else v.pause();
        }
        v.addEventListener('play', paint);
        v.addEventListener('pause', paint);
        /* the cut: the query of the still's phone <source>, the pairs of film sources */
        var line = fig.querySelector('.ow-demo-poster source[media]');
        var mq = line && window.matchMedia ? window.matchMedia(line.getAttribute('media')) : null;
        var all = v.querySelectorAll('source'), pairs = { phone: [], desktop: [] };
        for (var k = 0; k < all.length; k++) pairs[all[k].hasAttribute('media') ? 'phone' : 'desktop'].push(all[k]);
        /* the browser has chosen among all four already: the first source, the desktop MP4 or WebM
           (the phone pair, after it, carries media) */
        var cut = 'desktop', stale = false;
        /* puts this screen's pair in the video; true when the pair changed (then `stale` until it plays) */
        function useCut() {
          var want = mq && mq.matches && pairs.phone.length ? 'phone' : 'desktop';
          var changed = want !== cut;
          cut = want;
          for (var k = 0; k < all.length; k++) if (all[k].parentNode === v) v.removeChild(all[k]);
          for (var k2 = 0; k2 < pairs[want].length; k2++) v.appendChild(pairs[want][k2]);
          if (changed) stale = true;
          return changed;
        }
        useCut();
        if (mq) {
          var onCut = function () {
            if (!useCut()) return;
            if (!v.paused) v.pause();   // sync() plays the new pair if it is on screen
            started = false;
            paint();
            sync();
          };
          if (mq.addEventListener) mq.addEventListener('change', onCut); else if (mq.addListener) mq.addListener(onCut);
        }
        btn.addEventListener('click', toggle);
        v.addEventListener('click', toggle);
        /* on screen: half of the film is visible, or the visible part fills half the
           screen (a film taller than the screen is never half visible) */
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            for (var j = 0; j < entries.length; j++) {
              var en = entries[j];
              var screenH = en.rootBounds ? en.rootBounds.height : window.innerHeight;
              onScreen = en.isIntersecting && (en.intersectionRatio >= 0.49 || en.intersectionRect.height >= screenH * 0.5);
            }
            sync();
          }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] }).observe(v);
        }
        paint();
      })(figs[i]);
    }
  })();

  /* ---- lightbox ---------------------------------------------------------
     It opens the widest file of the srcset that is showing: on a phone the
     card's own <source> (fitted to the screen, pinch to zoom), on a desktop
     the 2400w render, never smaller than the picture was on the page. A
     full-app render opens at its data-ow-zoom-w (1800px) and is scrolled so
     its chat column is in the middle. */
  var box = document.getElementById('ow-lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  var big = box.querySelector('.ow-lightbox-img');
  var body = box.querySelector('.ow-lightbox-body');
  var opener = null;
  var smooth = typeof lenis !== 'undefined' ? lenis : null;   // the page's Lenis instance (template script), if any

  function widest(srcset, fallback) {
    var best = { url: fallback, w: 0 };
    (srcset || '').split(',').forEach(function (part) {
      var bits = part.trim().split(/\s+/);
      var w = parseInt(bits[1], 10);
      if (bits[0] && w > best.w) best = { url: bits[0], w: w };
    });
    return best;
  }
  function fileOf(img) {
    var pic = img.parentNode && img.parentNode.tagName === 'PICTURE' ? img.parentNode : null;
    var sources = pic ? pic.querySelectorAll('source') : [];
    for (var i = 0; i < sources.length; i++) {
      var m = sources[i].getAttribute('media');
      if (!m || matchMedia(m).matches) return widest(sources[i].getAttribute('srcset'), img.currentSrc || img.src);
    }
    return widest(img.getAttribute('srcset'), img.getAttribute('src'));
  }
  function layout(button, file, shown) {
    var shownWidth = shown.width;
    var room = body.clientWidth;
    /* at least as large as on the page, at most 1.4 CSS px per image pixel… */
    var cap = file.w ? file.w / 1.4 : room;
    var min = parseInt(button.getAttribute('data-ow-zoom-w'), 10) || 0;
    var w = Math.min(cap, Math.max(room, min, shownWidth));
    /* …and on a phone the screen's width: the card is already a phone layout */
    if (window.innerWidth < 992) w = room;
    big.style.width = Math.round(w) + 'px';
    /* the picture's proportions before the file arrives, so the dialog can
       scroll to the right place at once */
    if (shown.width && shown.height) big.style.aspectRatio = shown.width + ' / ' + shown.height;
    var x = parseFloat(button.getAttribute('data-ow-zoom-x'));
    var left = isFinite(x) && w > room ? Math.max(0, w * x - room / 2) : 0;
    /* after the dialog's first layout, or the browser keeps it at 0 */
    function place() { body.scrollTo({ top: 0, left: left, behavior: 'auto' }); }
    place();
    requestAnimationFrame(place);
    big.onload = place;
  }
  function open(button) {
    var img = button.querySelector('img');
    if (!img) return;
    opener = button;
    var file = fileOf(img);
    var shown = img.getBoundingClientRect();
    big.alt = img.alt;
    big.src = file.url;
    box.setAttribute('aria-label', button.getAttribute('aria-label') || '');
    box.showModal();
    if (smooth && smooth.stop) smooth.stop();
    layout(button, file, shown);
    body.focus({ preventScroll: true });
  }
  box.addEventListener('close', function () {
    if (smooth && smooth.start) smooth.start();
    big.removeAttribute('src');
    big.style.width = '';
    big.style.aspectRatio = '';
    big.onload = null;
    if (opener) { opener.focus({ preventScroll: true }); opener = null; }
  });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('[data-ow-close]')) box.close();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var b = e.target.closest('[data-ow-zoom]');
    /* the 「点图放大」 hint beside a shot opens the same picture */
    if (!b) {
      var hint = e.target.closest('[data-ow-hint]');
      var fig = hint && hint.closest('.ow-shot');
      b = fig && fig.querySelector('[data-ow-zoom]');
    }
    if (b) { e.preventDefault(); open(b); }
  });
})();

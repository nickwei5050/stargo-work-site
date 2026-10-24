/**
 * 品牌片 — the about page's first screen (tools/about-film.mjs, css/stargo-film.css).
 *
 * Picks the file for the screen (1080p from 1024 CSS px wide, 720p below that
 * or under Save-Data; the .webm only where H.264 does not play) and starts it
 * muted, which is the only way a browser lets a page start a film by itself.
 * It starts once a quarter of the picture is on screen, pauses when less is,
 * and carries on when the reader comes back, unless they paused it themselves.
 *
 * Sound: the song plays once from its first line when the reader turns sound
 * on (by the button, or by clicking the silent picture), then the film goes
 * on silently from the top. Three controls: sound, pause/play, full screen.
 *
 * Nothing is fetched or played for a reader who asks for reduced motion or
 * saves data, or when the browser refuses to start it (iOS Low Power Mode,
 * WeChat before its bridge is ready): the first frame stands with one play
 * button, and a tap plays it with sound, since a reader who asks for the
 * film wants to hear it.
 */
(function () {
  var root = document.querySelector('[data-sg-film]');
  if (!root) return;
  var v = root.querySelector('video');
  var frame = root.querySelector('.sg-film__frame');
  var sound = root.querySelector('.sg-film__sound');
  var soundText = root.querySelector('.sg-film__btn-text');
  var toggle = root.querySelector('.sg-film__toggle');
  var full = root.querySelector('.sg-film__full');
  var start = root.querySelector('.sg-film__start');
  var bar = root.querySelector('.sg-film__progress i');
  if (!v || !v.play) return;

  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var still = function () { return saveData || mq('(prefers-reduced-motion: reduce)'); };
  var t = function (k) { return root.getAttribute('data-t-' + k) || ''; };
  var hasIO = 'IntersectionObserver' in window;
  var loaded = false;
  var webmAfterError = false;
  var userPaused = false;
  var autoPaused = false;
  var visible = !hasIO;
  var heard = false;
  var last = 0;

  function load() {
    if (loaded) return;
    loaded = true;
    var hd = mq('(min-width: 1024px)') && !saveData;
    var webm = webmAfterError || (!v.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"') && v.canPlayType('video/webm; codecs="vp9, opus"'));
    v.preload = 'auto';
    v.src = v.getAttribute('data-src-' + (hd ? 'hd' : 'sd') + (webm ? '-webm' : ''));
    // Without a file, a browser names the video 'Unable to play media' whatever its label
    // says; it joins the accessibility tree once it has one.
    v.removeAttribute('aria-hidden');
  }

  function set(btn, text) {
    btn.setAttribute('aria-label', text);
    btn.setAttribute('title', text);
  }

  function syncPlay() {
    var paused = v.paused;
    root.classList.toggle('is-paused', paused);
    root.classList.toggle('is-playing', !paused);
    set(toggle, paused ? t('play') : t('pause'));
  }

  function syncSound() {
    root.classList.toggle('is-sound', !v.muted);
    soundText.textContent = v.muted ? t('sound-on') : t('mute');
  }

  function idle() {
    var lost = root.contains(document.activeElement) && document.activeElement !== start;
    root.classList.add('is-idle');
    if (lost) start.focus({ preventScroll: true });
  }

  function refused() {
    v.preload = 'none';
    idle();
    syncPlay();
  }

  function soundOn() {
    v.muted = false;
    v.volume = 0.8;
    // The first time sound comes on, the song starts from its first line.
    if (!heard && v.currentTime > 8) v.currentTime = 0;
    heard = true;
  }

  function play(withSound) {
    load();
    root.classList.remove('is-idle');
    if (withSound) soundOn();
    syncSound();
    var p = v.play();
    if (p && p.catch) {
      p.catch(function (err) {
        // A pause() or a new source interrupted it: nothing failed.
        if (err && err.name === 'AbortError') return;
        if (err && err.name === 'NotAllowedError' && !v.muted) {
          // A browser that will not start it with sound may still start it silent.
          v.muted = true;
          var q = v.play();
          if (q && q.catch) q.catch(function (e) { if (!e || e.name !== 'AbortError') refused(); });
          return;
        }
        refused();
      });
    }
  }

  v.addEventListener('playing', function () { root.classList.add('is-live'); root.classList.remove('is-idle'); syncPlay(); });
  v.addEventListener('pause', syncPlay);
  v.addEventListener('play', syncPlay);
  v.addEventListener('volumechange', syncSound);
  v.addEventListener('error', function () {
    // The next play() sets the source again. A browser that says it plays H.264 but
    // fails on the file gets one silent retry with the .webm.
    loaded = false;
    var code = v.error && v.error.code;
    if (!webmAfterError && (code === 3 || code === 4) && /\.mp4/.test(v.currentSrc || '') && v.canPlayType('video/webm; codecs="vp9, opus"')) {
      webmAfterError = true;
      if (visible && !userPaused && !still()) { play(false); return; }
    }
    root.classList.remove('is-live');
    idle();
    syncPlay();
  });
  // The song plays once; then the film goes on silently from the top.
  v.addEventListener('ended', function () {
    v.muted = true;
    v.currentTime = 0;
    play(false);
  });
  v.addEventListener('timeupdate', function () {
    if (!v.duration) return;
    var r = Math.min(1, v.currentTime / v.duration);
    bar.style.transition = r < last ? 'none' : '';
    bar.style.transform = 'scaleX(' + r.toFixed(4) + ')';
    last = r;
    caption();
  });

  // Upright screens: the words drawn into the picture come out below 12px there, so the pair
  // being sung is also written under the picture, page language first (tools/about-film.mjs).
  var cap = root.querySelector('.sg-film__cap');
  var capA = cap && cap.querySelector('.sg-film__cap-a');
  var capB = cap && cap.querySelector('.sg-film__cap-b');
  var cues = [].map.call(root.querySelectorAll('.sg-film__words li[data-cue]'), function (li) {
    var span = li.getAttribute('data-cue').split(' ');
    return { from: +span[0], to: +span[1], a: li.getAttribute('data-a'), b: li.getAttribute('data-b') };
  });
  var shown = -1;
  function caption() {
    if (!cap || !mq('(max-aspect-ratio: 6/5)')) return;
    var t = v.currentTime;
    var i = -1;
    for (var k = 0; k < cues.length; k++) if (t >= cues[k].from && t < cues[k].to) { i = k; break; }
    if (i === shown) return;
    shown = i;
    if (i < 0) { cap.classList.remove('is-on'); return; }
    capA.textContent = cues[i].a;
    capB.textContent = cues[i].b;
    // restart the entrance: off for a frame, then on
    cap.classList.remove('is-on');
    void cap.offsetWidth;
    cap.classList.add('is-on');
  }

  function startFilm() {
    userPaused = false;
    autoPaused = false;
    play(true);
  }

  function togglePlay() {
    if (v.paused) { userPaused = false; autoPaused = false; play(false); }
    else { userPaused = true; v.pause(); }
  }

  sound.addEventListener('click', function () {
    if (!v.muted) { v.muted = true; return; }
    if (v.paused) startFilm();
    else soundOn();
  });
  toggle.addEventListener('click', togglePlay);
  start.addEventListener('click', function () {
    var keyboard = document.activeElement === start;
    startFilm();
    if (keyboard) toggle.focus({ preventScroll: true });
  });
  // The picture: while it waits, a click plays it with sound, as the button does; a click
  // on the film playing silently asks to hear it; otherwise a click pauses and plays.
  v.addEventListener('click', function () {
    if (root.classList.contains('is-idle')) startFilm();
    else if (v.muted && !v.paused) soundOn();
    else togglePlay();
  });

  var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement || null; };
  full.addEventListener('click', function () {
    if (fsEl()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    var req = root.requestFullscreen || root.webkitRequestFullscreen;
    // A phone or tablet held upright turns the film on its side, where the platform allows it.
    var turn = function () {
      if (mq('(pointer: coarse)') && screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
    };
    if (req) {
      var r = req.call(root);
      if (r && r.then) r.then(turn, function () { if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); });
      else turn();
    } else if (v.webkitEnterFullscreen) {
      // iPhone: only the video element can go full screen, in the system player.
      v.webkitEnterFullscreen();
    }
  });
  function onFs() {
    var on = fsEl() === root;
    root.classList.toggle('is-full', on);
    // The site's smooth scroll (Lenis) still turns the wheel into page scroll behind a
    // full-screen element; the reader would come back several screens down.
    if (on) root.setAttribute('data-lenis-prevent', '');
    else root.removeAttribute('data-lenis-prevent');
    if (!on && screen.orientation && screen.orientation.unlock) { try { screen.orientation.unlock(); } catch (e) { /* not locked */ } }
    set(full, on ? t('exit-full') : t('full'));
  }
  document.addEventListener('fullscreenchange', onFs);
  document.addEventListener('webkitfullscreenchange', onFs);

  // The site draws a crosshair that follows the mouse (Mono's .plus-line-wrapper); over
  // the film it would cut through the lyrics, so the film shows the ordinary pointer, also
  // over the site bar that sits on it and before the mouse has moved at all.
  var html = document.documentElement;
  var onFilm = function (y) { return !root.classList.contains('is-away') && y < root.getBoundingClientRect().bottom; };
  html.classList.toggle('sg-film-pointer', root.getBoundingClientRect().top < 1);
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') html.classList.toggle('sg-film-pointer', onFilm(e.clientY));
  }, { passive: true });

  if (hasIO) {
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      visible = e.isIntersecting && e.intersectionRatio >= 0.25;
      root.classList.toggle('is-away', !visible);
      if (!visible) html.classList.remove('sg-film-pointer');
      if (fsEl()) return;
      if (!visible && !v.paused) { autoPaused = true; v.pause(); }
      else if (visible && autoPaused && !userPaused && !still()) { autoPaused = false; play(false); }
    }, { threshold: [0, 0.25, 0.5] }).observe(frame);
  }

  if (window.matchMedia) {
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onRm = function (e) { if (e.matches && !v.paused) { userPaused = true; v.pause(); } };
    if (rm.addEventListener) rm.addEventListener('change', onRm);
    else if (rm.addListener) rm.addListener(onRm);
  }
  // WeChat may refuse to start a film until its bridge is ready; ask once more then.
  document.addEventListener('WeixinJSBridgeReady', function () {
    if (root.classList.contains('is-idle') && !userPaused && !still() && visible) play(false);
  }, false);

  syncSound();
  root.classList.add('is-ready');
  if (still()) {
    idle();
    syncPlay();
  } else if (hasIO) {
    // The observer starts it once a quarter of the picture is on screen.
    autoPaused = true;
  } else {
    play(false);
  }
})();

/**
 * 品牌片 — the about page's first screen (tools/about-film.mjs, css/stargo-film.css).
 *
 * Picks the file for the screen (1080p from 1024 CSS px wide, 720p below that
 * or under Save-Data; the .webm only where H.264 does not play) and starts it
 * muted, which is the only way a browser lets a page start a film by itself.
 * Three controls: sound, pause/play, full screen. The film pauses while less than a quarter of it is on screen and
 * carries on when the reader comes back, unless they paused it themselves.
 *
 * Nothing is fetched or played for a reader who asks for reduced motion or
 * saves data, or when the browser refuses to start it (iOS Low Power Mode):
 * the first frame stands with one play button, and a tap plays it with sound,
 * since a reader who asks for the film wants to hear it.
 */
(function () {
  var root = document.querySelector('[data-sg-film]');
  if (!root) return;
  var v = root.querySelector('video');
  var sound = root.querySelector('.sg-film__sound');
  var soundText = root.querySelector('.sg-film__btn-text');
  var toggle = root.querySelector('.sg-film__toggle');
  var full = root.querySelector('.sg-film__full');
  var start = root.querySelector('.sg-film__start');
  var bar = root.querySelector('.sg-film__progress i');
  if (!v || !v.play) return;

  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var t = function (k) { return root.getAttribute('data-t-' + k) || ''; };
  var loaded = false;
  var userPaused = false;
  var autoPaused = false;
  var visible = true;

  function load() {
    if (loaded) return;
    loaded = true;
    var hd = mq('(min-width: 1024px)') && !saveData;
    var webm = !v.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"') && v.canPlayType('video/webm; codecs="vp9, opus"');
    v.preload = 'auto';
    v.src = v.getAttribute('data-src-' + (hd ? 'hd' : 'sd') + (webm ? '-webm' : ''));
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
    var on = !v.muted;
    root.classList.toggle('is-sound', on);
    sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundText.textContent = on ? t('mute') : t('sound-on');
  }

  function idle() {
    root.classList.add('is-idle');
  }

  function play(withSound) {
    load();
    root.classList.remove('is-idle');
    if (withSound) { v.muted = false; v.volume = 0.8; }
    syncSound();
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {
        if (!v.muted) {
          // A browser that will not start it with sound may still start it silent.
          v.muted = true;
          syncSound();
          var q = v.play();
          if (q && q.catch) q.catch(idle);
        } else {
          idle();
        }
      });
    }
  }

  v.addEventListener('playing', function () { root.classList.add('is-live'); syncPlay(); });
  v.addEventListener('pause', syncPlay);
  v.addEventListener('play', syncPlay);
  v.addEventListener('volumechange', syncSound);
  // A file that cannot be played leaves the first frame and the play button, never a dead player.
  v.addEventListener('error', function () { root.classList.remove('is-live'); idle(); syncPlay(); });
  v.addEventListener('timeupdate', function () {
    if (v.duration) bar.style.transform = 'scaleX(' + Math.min(1, v.currentTime / v.duration).toFixed(4) + ')';
  });

  sound.addEventListener('click', function () {
    if (v.muted) {
      v.muted = false;
      v.volume = 0.8;
      if (v.paused) { userPaused = false; play(true); }
    } else {
      v.muted = true;
    }
  });

  function togglePlay() {
    if (v.paused) { userPaused = false; autoPaused = false; play(false); }
    else { userPaused = true; v.pause(); }
  }
  toggle.addEventListener('click', togglePlay);
  v.addEventListener('click', togglePlay);

  start.addEventListener('click', function () { userPaused = false; play(true); });

  var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement || null; };
  full.addEventListener('click', function () {
    if (fsEl()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    var req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (req) {
      var r = req.call(root);
      if (r && r.catch) r.catch(function () { if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); });
    } else if (v.webkitEnterFullscreen) {
      // iPhone: only the video element can go full screen, in the system player.
      v.webkitEnterFullscreen();
    }
  });
  function onFs() {
    var on = fsEl() === root;
    root.classList.toggle('is-full', on);
    set(full, on ? t('exit-full') : t('full'));
  }
  document.addEventListener('fullscreenchange', onFs);
  document.addEventListener('webkitfullscreenchange', onFs);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      visible = e.isIntersecting && e.intersectionRatio >= 0.25;
      if (!visible && !v.paused && !fsEl()) { autoPaused = true; v.pause(); }
      else if (visible && autoPaused && !userPaused) { autoPaused = false; play(false); }
    }, { threshold: [0, 0.25, 0.5] }).observe(root);
  }

  syncSound();
  root.classList.add('is-ready');
  if (mq('(prefers-reduced-motion: reduce)') || saveData) {
    idle();
    syncPlay();
  } else {
    play(false);
  }
})();

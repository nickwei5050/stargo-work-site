/* Brand film lifecycle. Keep the template's grid transforms; manage only media.
   No autoplay download offscreen, no sound, visible playback controls, and a
   poster fallback when autoplay is blocked or reduced motion is requested. */
(function () {
  var video = document.querySelector('[data-stargo-video]');
  if (!video) return;
  var button = document.querySelector('[aria-controls="' + video.id + '"]');
  var section = video.closest('.video-section');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var visible = false;
  var userChoice = null;
  var failed = false;
  video.muted = true;

  function label() {
    if (!button) return;
    if (failed) {
      button.textContent = document.documentElement.lang.startsWith('zh') ? '视频暂时无法播放' : 'Video unavailable';
      button.setAttribute('aria-pressed', 'false');
      button.disabled = true;
      return;
    }
    var playing = !video.paused && !video.ended;
    button.textContent = button.getAttribute(playing ? 'data-pause-label' : 'data-play-label');
    button.setAttribute('aria-pressed', String(playing));
  }
  function sync() {
    var wanted = userChoice === null ? !reduced.matches : userChoice;
    if (!failed && visible && !document.hidden && wanted) {
      var pending = video.play();
      if (pending) pending.catch(label); // Autoplay restrictions are not a fake success.
    } else video.pause();
    label();
  }
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  function unavailable() {
    failed = true;
    userChoice = false;
    video.pause();
    label();
  }
  video.addEventListener('error', unavailable);
  // A failed <source> emits a non-bubbling error in some browsers.
  video.querySelectorAll('source').forEach(function (source) { source.addEventListener('error', unavailable); });
  if (button) button.addEventListener('click', function () {
    userChoice = video.paused;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', function () { userChoice = null; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '0px', threshold: 0 }).observe(section);
  } else {
    visible = true;
    sync();
  }
  label();
})();

/* 下载 — picks the visitor's system and puts its download first
   (tools/downloads.mjs). Without this script the page still offers every
   platform; the recommendation is then the Windows installer. */
(function () {
  var band = document.querySelector('.sg-dl');
  if (!band) return;
  var zh = (document.documentElement.lang || '').indexOf('zh') === 0;

  function detect() {
    var ua = navigator.userAgent || '';
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    if (/MicroMessenger/i.test(ua)) return /Android/i.test(ua) ? 'android' : 'wechat';
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(plat) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Mac/i.test(plat) || /Mac OS X/i.test(ua)) return 'mac';
    if (/Win/i.test(plat) || /Windows/i.test(ua)) return 'windows';
    return '';
  }

  var os = detect();
  if (location.hash === '#android') os = 'android';   // the QR code lands phones here
  var card = os && band.querySelector('.sg-dl-card[data-os="' + os + '"]');
  if (!card) return;
  card.classList.add('is-current');
  card.setAttribute('data-current', zh ? '你的系统' : 'Your system');
  if (os === 'windows') return;   // the page already recommends it

  var feature = band.querySelector('[data-sg-dl-feature]');
  var icon = feature.querySelector('[data-sg-dl-icon]');
  var srcIcon = card.querySelector('.sg-dl-icon');
  icon.className = srcIcon.className + ' is-big';
  icon.innerHTML = srcIcon.innerHTML;
  feature.querySelector('[data-sg-dl-name]').textContent = card.getAttribute('data-name');
  feature.querySelector('[data-sg-dl-meta]').textContent = card.getAttribute('data-meta');

  var actions = feature.querySelector('[data-sg-dl-actions]');
  var all = actions.querySelector('.is-ghost');
  [].slice.call(actions.children).forEach(function (n) { if (n !== all) n.remove(); });
  var links = card.querySelectorAll('.sg-dl-card-foot a');
  if (links.length) {
    [].slice.call(links).forEach(function (a, i) {
      var b = a.cloneNode(true);
      b.className = 'sg-dl-btn is-big ' + (i === 0 ? 'is-primary' : '');
      var label = b.querySelector('span');
      if (os === 'mac') label.textContent = (zh ? '下载 · ' : 'Download · ') + label.textContent;
      actions.insertBefore(b, all);
    });
  } else {
    var soon = card.querySelector('.sg-dl-soon').cloneNode(true);
    soon.classList.add('is-big');
    actions.insertBefore(soon, all);
  }
  /* Apple silicon is most Macs sold since 2020; WebGL names the GPU on Intel
     Macs ("Intel" in the renderer), so put Intel first there. */
  if (os === 'mac') {
    try {
      var gl = document.createElement('canvas').getContext('webgl');
      var ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
      if (/Intel/i.test(r)) {
        var btns = actions.querySelectorAll('.sg-dl-btn:not(.is-ghost)');
        if (btns.length === 2) {
          btns[0].classList.remove('is-primary');
          btns[1].classList.add('is-primary');
          actions.insertBefore(btns[1], btns[0]);
        }
      }
    } catch (e) { /* keep Apple silicon first */ }
  }
})();

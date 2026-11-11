/* Cookie consent for the Google tag (GTM-NJL2ZDR8), 2026-11-11.
 * The inline script before the Google tag keeps the ad_* signals "denied" everywhere (these sites run no ads) and
 * sets analytics_storage "denied" for visitors in the EEA, the UK and Switzerland (Google applies that region list by
 * the visitor's IP); it then replays a saved choice. This file shows a small notice to visitors whose browser time
 * zone is in one of those countries and who have not chosen yet. Accept / Reject is saved in localStorage under
 * "gos-consent" and sent to Google as a Consent Mode update of analytics_storage only; Reject also removes existing
 * _ga cookies. Any link to "#cookie-settings" (the privacy page has one) clears the choice and shows the notice again,
 * wherever the visitor is. Nothing else on the site depends on this file. */
(function () {
  var KEY = 'gos-consent';
  // Time zones of the EEA, the UK and Switzerland. Europe/* minus zones outside that list (Turkey, Ukraine, Russia,
  // Belarus, Moldova, the western Balkans outside the EU, the microstates and the crown dependencies), plus the
  // Atlantic islands of Portugal, Spain, Iceland and the Faroes and Cyprus (Asia/*).
  var EEA_TZ = /^(Europe\/(?!(Istanbul|Kyiv|Kiev|Uzhgorod|Zaporozhye|Simferopol|Moscow|Kirov|Volgograd|Astrakhan|Saratov|Ulyanovsk|Samara|Kaliningrad|Minsk|Chisinau|Tiraspol|Belgrade|Sarajevo|Skopje|Podgorica|Tirane|Andorra|Monaco|San_Marino|Vatican|Gibraltar|Isle_of_Man|Jersey|Guernsey)$)[A-Za-z_]+|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe|Faeroe)|Asia\/(Nicosia|Famagusta))$/;
  var zh = /^zh/i.test(document.documentElement.lang || '');
  var t = zh
    ? { text: '我们使用 Google Analytics 的 Cookie 统计网站访问。您同意后才会设置。', more: '隐私政策', accept: '同意', reject: '拒绝' }
    : { text: 'We use Google Analytics cookies to measure visits. They are set only if you accept.', more: 'Privacy policy', accept: 'Accept', reject: 'Reject' };
  var box = null;

  function clearGaCookies() {
    var host = location.hostname, domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      domains.forEach(function (d) { document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : ''); });
    });
  }

  function choose(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: v });
    if (v === 'denied') clearGaCookies();
    if (box) { box.remove(); box = null; }
  }

  function show() {
    if (box) return;
    // This site's privacy page: not a language switcher (hreflang) and not another site's privacy link (Google's).
    var privacy = Array.prototype.filter.call(document.querySelectorAll('a[href*="privacy"]:not([hreflang])'), function (l) { return l.host === location.host; })[0];
    box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', zh ? 'Cookie 通知' : 'Cookie notice');
    box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;padding:14px 16px;border-radius:12px;background:#111;color:#f5f5f5;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35);display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center';
    var p = document.createElement('p');
    p.style.cssText = 'margin:0;flex:1 1 260px;color:#f5f5f5;font:inherit;letter-spacing:normal;text-align:left';
    p.textContent = t.text + ' ';
    if (privacy) { var a = document.createElement('a'); a.href = privacy.getAttribute('href'); a.textContent = t.more; a.style.cssText = 'color:inherit;text-decoration:underline'; p.appendChild(a); }
    box.appendChild(p);
    [[t.reject, 'denied', 'transparent', '#f5f5f5'], [t.accept, 'granted', '#f5f5f5', '#111']].forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = b[0];
      btn.style.cssText = 'min-height:40px;padding:8px 16px;border-radius:999px;border:1px solid #f5f5f5;background:' + b[2] + ';color:' + b[3] + ';font:inherit;cursor:pointer';
      btn.addEventListener('click', function () { choose(b[1]); });
      box.appendChild(btn);
    });
    document.body.appendChild(box);
  }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href$="#cookie-settings"]');
    if (!link) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    show();
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { return; }
  if (saved === 'granted' || saved === 'denied') return;
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (EEA_TZ.test(tz)) show();
})();

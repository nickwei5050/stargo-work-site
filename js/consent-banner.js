/* Cookie consent for the Google tag (GTM-MCGTFDLR), 2026-11-11.
 * The inline script before the Google tag sets Google Consent Mode to "denied" for visitors in the EEA, the UK and
 * Switzerland (Google applies the region list by the visitor's IP) and replays a saved choice. This file shows a
 * small notice to visitors whose browser time zone is in Europe and who have not chosen yet; Accept / Reject is saved
 * in localStorage under "gos-consent" and sent to Google as a Consent Mode update. Nothing else on the site depends
 * on it. A visitor can change their mind by clearing this site's data. */
(function () {
  var KEY = 'gos-consent';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { return; }
  if (saved === 'granted' || saved === 'denied') return;
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (!/^(Europe|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe))\//.test(tz)) return;
  var zh = /^zh/i.test(document.documentElement.lang || '');
  var t = zh
    ? { text: '我们使用 Google Analytics 的 Cookie 统计网站访问。您同意后才会设置。', more: '隐私政策', accept: '同意', reject: '拒绝' }
    : { text: 'We use Google Analytics cookies to measure visits. They are set only if you accept.', more: 'Privacy policy', accept: 'Accept', reject: 'Reject' };
  var privacy = document.querySelector('a[href*="privacy"]');
  var box = document.createElement('div');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', zh ? 'Cookie 通知' : 'Cookie notice');
  box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;padding:14px 16px;border-radius:12px;background:#111;color:#f5f5f5;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35);display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center';
  var p = document.createElement('p');
  p.style.cssText = 'margin:0;flex:1 1 260px;color:#f5f5f5;font:inherit;letter-spacing:normal;text-align:left';
  p.textContent = t.text + ' ';
  if (privacy) { var a = document.createElement('a'); a.href = privacy.getAttribute('href'); a.textContent = t.more; a.style.cssText = 'color:inherit;text-decoration:underline'; p.appendChild(a); }
  box.appendChild(p);
  function choose(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    box.remove();
  }
  [[t.reject, 'denied', 'transparent', '#f5f5f5'], [t.accept, 'granted', '#f5f5f5', '#111']].forEach(function (b) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = b[0];
    btn.style.cssText = 'min-height:40px;padding:8px 16px;border-radius:999px;border:1px solid #f5f5f5;background:' + b[2] + ';color:' + b[3] + ';font:inherit;cursor:pointer';
    btn.addEventListener('click', function () { choose(b[1]); });
    box.appendChild(btn);
  });
  document.body.appendChild(box);
})();

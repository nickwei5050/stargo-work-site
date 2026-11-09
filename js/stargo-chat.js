/* Website chat (Chatwoot). WEBSITE_TOKEN below is the one setting.
   Left empty, this script stops at once: no button, no request, no cookie.
   With a token the page shows only our own small button. The Chatwoot
   SDK, which sets cookies and talks to chat.stargogrowth.com, is fetched when
   the visitor presses that button and not before, so a visitor who never opens
   the chat never contacts that host. The privacy pages say the same
   (tools/copy.mjs LEGAL.privacy).
   To change it or turn it off: edit the token below, run `npm run build`
   (the pages carry this file's content hash as ?v=) and commit the result.
   The website token is public by design: it only lets a visitor open a chat. */
(function () {
  'use strict';

  var WEBSITE_TOKEN = 'rrhJo1Fr2h7XXBYuMkzs2raY';

  var BASE_URL = 'https://chat.stargogrowth.com';
  if (!WEBSITE_TOKEN || window.__stargoChat) return;
  window.__stargoChat = true;

  var zh = (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('zh') === 0;
  var T = zh
    ? { open: '在线咨询', aria: '打开在线咨询', busy: '正在连接…', retry: '暂时连不上，点击重试', locale: 'zh_CN' }
    : { open: 'Chat with us', aria: 'Open chat', busy: 'Connecting…', retry: 'Could not connect. Try again', locale: 'en' };
  var TIMEOUT_MS = 15000;
  var btn = null, text = null, script = null, ran = false, timer = 0;

  function setLabel(s, busy) {
    if (!btn) return;
    text.textContent = s;
    btn.setAttribute('aria-label', s === T.open ? T.aria : s);
    if (busy) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
  }
  function fail() {
    clearTimeout(timer);
    /* A script that never ran is dropped so the next press fetches it again. A
       widget that did start is left alone: starting it twice would draw it twice. */
    if (script && !ran) { script.remove(); script = null; }
    setLabel(T.retry, false);
  }
  function arm() {
    clearTimeout(timer);
    timer = setTimeout(fail, TIMEOUT_MS);
  }
  function load() {
    if (script) return;
    window.chatwootSettings = { position: 'right', type: 'standard', launcherTitle: T.open, locale: T.locale };
    script = document.createElement('script');
    script.src = BASE_URL + '/packs/js/sdk.js';
    script.async = true;
    script.onload = function () {
      if (ran) return;
      try {
        window.chatwootSDK.run({ websiteToken: WEBSITE_TOKEN, baseUrl: BASE_URL });
        ran = true;
      } catch (e) { fail(); }
    };
    script.onerror = fail;
    document.body.appendChild(script);
  }
  function open() {
    setLabel(T.busy, true);
    arm();
    load();
  }
  window.addEventListener('chatwoot:ready', function () {
    clearTimeout(timer);
    if (btn) { btn.remove(); btn = null; }
    if (window.$chatwoot) window.$chatwoot.toggle('open');
  });

  function init() {
    var style = document.createElement('style');
    style.textContent =
      '.stargo-chat-launcher{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:900;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:#0d0906;color:#fff;font:500 15px/1.2 inherit;font-family:inherit;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.28)}' +
      '.stargo-chat-launcher:hover{background:#2a2420}' +
      '.stargo-chat-launcher:focus-visible{outline:2px solid #fff;outline-offset:2px;box-shadow:0 0 0 4px #0d0906}' +
      '.stargo-chat-launcher svg{width:18px;height:18px;flex:none}' +
      '@media print{.stargo-chat-launcher{display:none}}';
    document.head.appendChild(style);
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stargo-chat-launcher';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5.1A8 8 0 1 1 21 12Z"/></svg><span></span>';
    text = btn.querySelector('span');
    setLabel(T.open, false);
    btn.addEventListener('click', open);
    document.body.appendChild(btn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Phone scenes for intelligence.html — code-drawn phone screens in place of
   the generated phone renders (tools/motion-scenes.mjs places the hosts,
   css/stargo-motion-phone.css styles them, js/stargo-motion.js runs them).

   They are drawn in the light chrome of the STARGO WORK phone app as the real
   captures show it (assets/stargo-product/m01, m04, live51, live52): the warm
   off-white page, the 工作台 › … bar with its amber dot and blue +, the red and
   amber status pills, the 待办 / 对话 / AI · 客户 tab bar. Every screen says
   on itself that it shows demo data, and nothing on them is ever sent on its
   own: the person approves, and still confirms before anything goes out.

   feed  — the hand-held phone of the 「不再 等提醒 / 等回复 / 丢背景」 band. What
           needs the owner arrives by itself, one item at a time: a buyer who
           has not answered (a follow-up is drafted), a quote under the floor
           price, a customer due to restock. A tap on 批准 folds the first one
           into 「已批准，发送前由你确认」.
   squad — the phone of the 「按任务组队」 card, beside 「工作暂停，背景不必从头
           解释」. A task forms its team (统筹 / 研究 / 销售 / 产品 / 创意), the
           steps run in parallel and the roles ask each other; the owner pauses
           it, and the saved context shows what is done, what waits and who
           decides; it resumes at the step where it stopped and hands the
           summary to the owner.

   Where the page hides part of a screen — the card crops the squad's phone
   to its top three quarters, and on phones the next section cuts the
   hand-held phone at about four fifths — the story plays above that line
   (each layout's `fold`, in stage px; the feed's mini list holds two items
   at a time). From 768 to about 900 px the band shows only the left part of
   the hand-held phone: css/stargo-motion-phone.css narrows the host to that
   part, and the feed is laid out for it (its `crop` layouts). */
(window.STARGO_SCENES = window.STARGO_SCENES || []).push(function (K) {
  'use strict';
  var T = K.T, el = K.el, sv = K.sv, put = K.put, css = K.css, cl = K.cl, c01 = K.c01, seg = K.seg, ease = K.ease, mod = K.mod, textSwap = K.textSwap;

  /* ---------- the app's own small parts ---------- */
  var PI = {
    menu: 'M4 7h16M4 12h16M4 17h16',
    chev: 'M9.5 6.5 15 12l-5.5 5.5',
    plus: 'M12 5.5v13M5.5 12h13',
    gear: 'M10.4 3h3.2l.6 2.4 1.5.9 2.4-.7 1.6 2.8-1.8 1.7v1.8l1.8 1.7-1.6 2.8-2.4-.7-1.5.9-.6 2.4h-3.2l-.6-2.4-1.5-.9-2.4.7-1.6-2.8 1.8-1.7v-1.8L4.3 8.4l1.6-2.8 2.4.7 1.5-.9zM12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4z',
    search: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM19.5 19.5l-4.6-4.6',
    inbox: 'M3.5 13.5 6 5.5h12l2.5 8V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18zM3.5 13.5h5l1.2 2.2h4.6l1.2-2.2h5',
    chat: 'M5 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3.5V15H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19.5 9.5h.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-1v2.5l-3-2.5h-3',
    spark: 'M10 3.5c.5 3.8 2 5.3 5.8 5.8-3.8.5-5.3 2-5.8 5.8-.5-3.8-2-5.3-5.8-5.8 3.8-.5 5.3-2 5.8-5.8zM17.5 13.5c.3 2 1.1 2.8 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.2 2.7-1 3-3z',
    check: 'M5.5 12.5l4 4 9-9',
    doc: 'M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5zM14 3.5V8h4M9 12.5h6M9 16h6',
    pause: 'M9 6.5v11M15 6.5v11',
    play: 'M8.5 5.8v12.4L18.5 12z',
    flag: 'M6 20.5V4M6 4.5h11l-2.4 3.9L17 12.3H6',
    box: 'M12 3.5l7.5 4v9L12 20.5l-7.5-4v-9zM4.5 7.5l7.5 4 7.5-4M12 11.5v9',
    bell: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2H5zM10 20.5h4',
    loop: 'M18.5 12a6.5 6.5 0 1 1-1.9-4.6M18.6 4.2v3.6H15'
  };
  function ico(name, parent, size, cls, w) {
    var s = sv('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', 'aria-hidden': 'true', class: cls || 'sgp-ico' }, parent);
    var filled = name === 'gear' || name === 'play';
    sv('path', filled ? { d: PI[name], fill: 'currentColor', 'fill-rule': 'evenodd' } : { d: PI[name], stroke: 'currentColor', 'stroke-width': w || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return s;
  }
  // 9:41, the bars and the battery, either side of the hand-held phone's camera or the mockup's island
  function statusBar(stage) {
    var s = el('div', 'sgp-status', stage);
    el('b', '', s, '9:41');
    var r = el('span', 'sgp-status-r', s);
    var sig = sv('svg', { viewBox: '0 0 17 11', width: 17, height: 11, 'aria-hidden': 'true', class: 'sgp-sig' }, r);
    for (var i = 0; i < 4; i++) sv('rect', { x: i * 4.5, y: 8 - i * 2.6, width: 3, height: 3 + i * 2.6, rx: 0.8, fill: 'currentColor' }, sig);
    var bat = sv('svg', { viewBox: '0 0 25 12', width: 25, height: 12, 'aria-hidden': 'true', class: 'sgp-bat' }, r);
    sv('rect', { x: 0.5, y: 0.5, width: 21, height: 11, rx: 3.2, fill: 'none', stroke: 'currentColor', opacity: '.4' }, bat);
    sv('rect', { x: 2, y: 2, width: 15, height: 8, rx: 1.8, fill: 'currentColor' }, bat);
    sv('path', { d: 'M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4z', fill: 'currentColor', opacity: '.45' }, bat);
    return s;
  }
  // ☰ 工作台 › 页 ……… the bar of every page of the app
  function appBar(stage, crumb, page, menu) {
    var bar = el('div', 'sgp-bar', stage);
    if (crumb || menu) ico('menu', bar, 20, 'sgp-ico sgp-bar-menu');
    var tt = el('div', 'sgp-bar-t', bar);
    if (crumb) { el('span', 'sgp-crumb', tt, crumb); ico('chev', tt, 13, 'sgp-ico sgp-chev', 2.2); }
    el('b', '', tt, page);
    return bar;
  }
  function barTools(bar) {
    el('i', 'sgp-dot', bar);
    ico('gear', bar, 20, 'sgp-ico sgp-gear');
    var plus = el('span', 'sgp-plus', bar);
    ico('plus', plus, 16, 'sgp-ico', 2.4);
  }
  function tag(parent, mini) { return el('span', 'sg-tag', parent, mini ? T('演示数据', 'Demo data') : T('动态示意 · 演示数据', 'Illustrative motion · demo data')); }
  function btn(parent, text, cls, icoName, icoSize) {
    var b = el('span', 'sgp-btn' + (cls ? ' ' + cls : ''), parent);
    if (icoName) ico(icoName, b, icoSize || 14, 'sgp-ico', 2.4);
    el('span', '', b, text);
    var tap = el('i', 'sgp-tap', b);
    return { b: b, dot: el('i', 'sgp-tap-dot', tap), ring: el('i', 'sgp-tap-ring', tap) };
  }
  // a finger's tap on a button: the touch dot comes down, presses, lifts, and a ring spreads from it
  function tapAt(o, t, at) {
    var show = seg(t, at - 0.45, at - 0.2) * (1 - seg(t, at + 0.22, at + 0.5));
    var ring = seg(t, at, at + 0.6);
    cl(o.b, 'is-press', t >= at && t < at + 0.2);
    css(o.dot, 'opacity', (show * 0.85).toFixed(3));
    css(o.dot, 'transform', 'scale(' + (t < at ? 1.25 - 0.25 * ease.out(seg(t, at - 0.45, at - 0.05)) : 0.84 + 0.16 * ease.out(seg(t, at + 0.12, at + 0.32))).toFixed(3) + ')');
    css(o.ring, 'opacity', (ring > 0 && ring < 1 ? 0.6 * (1 - ease.out(ring)) : 0).toFixed(3));
    css(o.ring, 'transform', 'scale(' + (0.7 + 1.5 * ease.out(ring)).toFixed(3) + ')');
  }
  function avatar(parent, cls, text, icoName, size) {
    var a = el('span', 'sgp-av ' + cls, parent, icoName ? null : text);
    if (icoName) ico(icoName, a, size || 14, 'sgp-ico', 2.2);
    return a;
  }

  /* =====================================================================
     FEED — 不再等提醒: what needs the owner arrives by itself.
     ===================================================================== */
  function FeedScene() {
    var P = 12;
    var ARR = [0.6, 2.1, 3.6];           // each item slides in
    // the phone's mini list holds two at a time: the approved follow-up leaves (LEAVE) before the third
    // arrives. Where the page shows too little of the phone for two (the next section covers more of it in
    // zh at 320–340 px: shownH), it holds one at a time and the restock item is left out.
    var ARR_MINI = [0.6, 2.1, 8.9], ARR_ONE = [0.6, 8.9, 99], LEAVE = [8.5, 9.0];
    var TAP = 5.75, C0 = 6.0, C1 = 6.55; // the tap on 批准, then the item folds
    var O0 = 11.1, O1 = 11.75;           // the list clears for the next round
    var ITEMS = [
      { av: 'ME', avc: 'is-cyan', name: 'Müller Energie', when: T('刚刚', 'now'),
        pill: T('3 天未回复', 'No reply in 3 days'), pc: 'is-red', body: T('已起草跟进 · 待你确认', 'Follow-up drafted · needs your OK'),
        bodyM: T('已起草跟进 · 待你确认', 'Follow-up drafted'),
        pillS: T('3 天未回复', '3 days, no reply'), bodyS: T('已起草', 'Drafted'), bodyX: T('已起草', 'Draft'), act: true },
      { avIco: 'doc', avc: 'is-amber', name: T('报价 Q-1042', 'Quote Q-1042'), when: '09:12',
        pill: T('低于底价', 'Below floor price'), pc: 'is-red', body: T('等你审批 · 批了才能发给客户', 'Needs your approval to go out'),
        bodyM: T('等你审批 · 批了才能发', 'Needs your approval'),
        pillS: T('低于底价', 'Below floor price'), pillX: T('低于底价', 'Below floor'), bodyS: T('等你审批', 'Needs approval'), pc2: 'is-amber' },
      { av: 'PS', avc: 'is-green', name: 'PT Surya', when: '08:30',
        pill: T('补货周期到了', 'Restock cycle due'), pc: 'is-gray', body: T('建议联系 · 上次下单已 60 天', 'Suggest a check-in call'),
        bodyM: T('建议联系 · 上次下单 60 天', 'Suggest a check-in call'),
        pillS: T('补货周期到了', 'Restock due'), bodyS: T('建议联系', 'Worth a call'), pc2: 'is-gray' }
    ];
    /* tall: 1440 and up (host 280 × 606 or more); mid: laptops (any host it fits at 1 or more, so the type
       is never scaled under its size; mid-WxH, the same at the host's own size from 200 to 223 px wide);
       mini: the hand-held phone on a phone screen (140–155 px wide; mini-WxH at the host's own size under
       140, 320–354 px screens), whole or cut by the next section; crop-WxH: where only the left part of the phone shows (768 to about 900 px until QA
       round 5, 2026-10-24; the band now shows the whole phone there, so a fallback; made on
       demand: the size of that part, at a scale of 1 to ~1.35) */
    var layouts = { tall: { w: 280, h: 606 }, mid: { w: 224, h: 485 }, mini: { w: 140, h: 303 } };
    var NUM = ['', '1', '2', '3'];
    var R, arr, hostEl = null, need2 = 0, need3 = 0, ro = null, LM = layouts.mini;
    /* mini: where the page shows the whole phone (375–430px screens: the next section starts below it), the
       screen is the app's whole 待办 page: all three items stay, over the tab bar (QA round 5, 2026-10-24: at
       390 the list filled the top 60% and the rest stayed blank cream for the whole loop). Where the next
       section cuts the phone (320–360px, and zh at 390 where the heading wraps to more lines), no tab bar,
       and as many of the three as the part it shows holds (in stage px, at the Runner's scale): all three,
       else two slots, the approved one leaving to make room for the third, else one. Measured when built and again whenever the page's layout
       settles differently (late fonts or images above change where the next section starts): a
       ResizeObserver, never per frame.
       2026-10-24 (QA round 5, later the same day): snug, when the three rows miss the shown part by a few
       px (zh at 390: 242 px shown, 254 needed, so two rows and ~55 px of blank cream over the next
       section's edge), the rows trim their own top and bottom padding and the gaps between their lines
       (.is-snug, 6 px a row, words and sizes unchanged) and all three stay. Both sets of row heights are
       measured when built, so a switch only swaps numbers. */
    function miniFit() {
      if (!R || !R.mini || !hostEl.clientHeight) return;
      var s = Math.min(hostEl.clientWidth / LM.w, hostEl.clientHeight / LM.h), sh = shownH(hostEl) / s;
      var whole = sh >= LM.h - 6 && need3 <= LM.h - R.tabH, three = whole || sh >= need3 + 2;
      var snug = !three && sh >= R.need3S + 2;
      three = three || snug;
      R.leave = !three;
      arr = three ? ARR : sh >= need2 + 2 ? ARR_MINI : ARR_ONE;
      cl(R.stage, 'is-whole', whole);
      cl(R.stage, 'is-snug', snug);
      var H = snug ? R.hS : R.hN;
      for (var k = 0; k < R.items.length; k++) { R.items[k].h = H[k][0]; R.items[k].hd = H[k][1]; }
    }

    function build(stage, L, name) {
      R = { items: [], stage: stage };
      if (L.mini) name = 'mini';
      if (L.mid) name = 'mid';
      var tall = name === 'tall', mid = name === 'mid', crop = !!L.crop, mini = name === 'mini';
      // xs: a host-sized mini under 140px (125 at 320, 133 at 340), with tighter insets and a few shorter words
      var xs = mini && L.w < 140;
      var full = R.full = tall || mid;   // the app's own card with its header, avatars and times
      hostEl = stage.parentNode; LM = mini ? L : layouts.mini;
      arr = full || crop ? ARR : ARR_MINI;
      stage.className = 'sg-mo-stage sgp sgp-feed is-' + (crop ? 'mini is-crop' : name) + (xs ? ' is-xs' : '');
      statusBar(stage);
      var bar = appBar(stage, tall ? T('工作台', 'Workspace') : '', T('待办', 'To-do'), mid);
      // the full tag wherever it fits on its own line; the phone's mini says 演示数据 in its bar
      var tagline = full || (crop && L.w >= (K.ZH ? 150 : 205)) ? el('div', 'sgp-tagline', stage) : null;
      if (full) barTools(bar);
      tag(tagline || bar, !tagline);
      var card = R.card = el('div', 'sgp-card', stage), h = null;
      if (full) {
        h = el('div', 'sgp-card-h', card);
        ico('bell', h, mid ? 16 : 18, 'sgp-ico', 2.2);
        el('b', '', h, T('等你处理', 'Waiting on you'));
        R.count = el('span', 'sgp-count', h, '');
        R.empty = el('div', 'sgp-empty', card, tall ? T('正在留意客户、报价和交期…', 'Watching buyers, quotes and dates…') : T('正在留意客户、报价和交期…', 'Watching buyers and quotes…'));
      }
      var list = el('div', 'sgp-list', card);
      for (var i = 0; i < ITEMS.length; i++) {
        var d = ITEMS[i];
        var it = el('div', 'sgp-item', list);
        var fu = el('div', 'sgp-full', it);
        var r1 = el('div', 'sgp-r1', fu);
        if (full) avatar(r1, d.avc, d.av, d.avIco, mid ? 13 : 15);
        el('b', '', r1, d.name);
        if (full) el('em', '', r1, d.when);
        var o = { it: it, full: fu };
        el('div', 'sgp-r2', fu).appendChild(el('span', 'sgp-pill ' + d.pc, null, full ? d.pill : xs && d.pillX || d.pillS));
        if (full) {
          el('div', 'sgp-body', fu, mid ? d.bodyM : d.body);
          if (d.act) {
            var acts = el('div', 'sgp-acts', fu);
            o.ok = btn(acts, T('批准', 'Approve'), 'is-primary');
            btn(acts, T('看草稿', 'View draft'), '');
          }
        } else if (d.act || crop) {
          // on a phone only the follow-up has a second line, so the list stays above the section's edge
          var r3 = el('div', 'sgp-r3', fu);
          if (d.act) { el('span', 'sgp-body', r3, xs ? d.bodyX : d.bodyS); o.ok = btn(r3, T('批准', 'Approve'), 'is-primary'); }
          else r3.appendChild(el('span', 'sgp-pill ' + d.pc2, null, d.bodyS));
        }
        if (d.act) {
          // what the item folds into once approved: approved, and still waiting for the person to send it
          var done = o.done = el('div', 'sgp-done', it);
          var top = el('div', 'sgp-done-h', done);
          var ck = el('span', 'sgp-ck', top); ico('check', ck, tall ? 13 : mid ? 12 : 10, 'sgp-ico', 3.2);
          el('b', '', top, T('已批准', 'Approved'));
          if (tall) el('span', '', top, d.name);
          var lines = tall ? [T('发送前由你确认', 'You confirm before it is sent')] : ZH_OR([T('发送前由你确认', '')], ['You confirm', 'before it is sent']);
          for (var l = 0; l < lines.length; l++) el('div', 'sgp-done-s', done, lines[l]);
        }
        R.items.push(o);
      }
      if (full || crop || mini) {
        // the tab bar; where the phone is cut, the two tabs that show; on the mini, three, the third named AI
        // alone (css/stargo-motion-phone.css shows it only on a whole phone, .is-whole)
        var tb = el('div', 'sgp-tabs', stage);
        var TABS = [['inbox', T('待办', 'To-do')], ['chat', T('对话', 'Chats')], ['spark', mini ? 'AI' : T('AI · 客户', 'AI · Buyers')]];
        for (var j = 0; j < (crop ? 2 : 3); j++) {
          var tab = el('span', 'sgp-tab' + (j === 0 ? ' is-on' : ''), tb);
          var ic = el('span', 'sgp-tab-i', tab); ico(TABS[j][0], ic, tall ? 22 : 20, 'sgp-ico', 2);
          if (j === 0) R.badge = el('i', 'sgp-badge', ic, '');
          el('span', '', tab, TABS[j][1]);
        }
        if (full) el('i', 'sgp-home', stage);
      }
      if (crop) css(card, 'top', ((tagline || bar).offsetTop + (tagline || bar).offsetHeight + 4) + 'px');
      // heights are read once: every line is its own nowrap line, so a late font does not move them
      R.gap = full ? 0 : crop ? 8 : 6;
      R.head = h ? h.offsetHeight : 0;
      for (var k = 0; k < R.items.length; k++) {
        var ob = R.items[k];
        ob.h = ob.it.offsetHeight;
        ob.hd = ob.done ? ob.done.offsetHeight : ob.h;
      }
      if (mini) {
        // the deepest the two-slot list reaches: the follow-up (whole or approved) over the quote, or the
        // quote over the restock item once the approved one has left; and all three, over the tab bar
        var g = R.gap, ct = card.offsetTop;
        // each row's [whole, approved] height, as drawn now: the plain set, then the snug one
        var rowsH = function () { return R.items.map(function (o) { return [o.it.offsetHeight, o.done ? o.done.offsetHeight : o.it.offsetHeight]; }); };
        var H = R.hN = rowsH();
        cl(stage, 'is-snug', true); var S = R.hS = rowsH(); cl(stage, 'is-snug', false);
        need2 = ct + Math.max(H[0][0] + g + H[1][0], H[0][1] + g + H[1][0], H[1][0] + g + H[2][0]);
        need3 = ct + H[0][0] + g + H[1][0] + g + H[2][0] + 4;
        R.need3S = ct + S[0][0] + g + S[1][0] + g + S[2][0] + 4;
        // the tab bar's height as it shows on a whole phone (it is hidden otherwise, so it is measured shown)
        cl(stage, 'is-whole', true); R.tabH = tb.offsetHeight;
        R.mini = R.leave = true;
        miniFit();
        if (!ro && window.ResizeObserver) {
          ro = new ResizeObserver(miniFit);
          ro.observe(document.body);
          var sec = hostEl.closest('.lx-section');
          if (sec) ro.observe(sec);
        }
      }
    }

    function tick(t) {
      var tt = mod(t, P);
      var out = ease.io(seg(tt, O0, O1));
      var y = 0, arrived = 0;
      for (var i = 0; i < R.items.length; i++) {
        var o = R.items[i];
        var a = ease.out(seg(tt, arr[i], arr[i] + 0.6));
        var h = o.h;
        if (o.done) {
          var c = ease.io(seg(tt, C0, C1));
          h = o.h + (o.hd - o.h) * c;
          css(o.it, 'height', h.toFixed(1) + 'px');
          css(o.full, 'opacity', (1 - c01(c * 2.2)).toFixed(3));
          css(o.done, 'opacity', c01(c * 1.6 - 0.6).toFixed(3));
          cl(o.it, 'is-done', c > 0.5);
          tapAt(o.ok, tt, TAP);
        }
        if (tt >= arr[i] + 0.15) arrived++;
        // mini: the approved follow-up rises out of the list and the others move up into its place
        var lv = R.leave && o.done ? ease.io(seg(tt, LEAVE[0], LEAVE[1])) : 0;
        css(o.it, 'transform', 'translateY(' + (y + (1 - a) * 16 - out * 8 - lv * 12).toFixed(1) + 'px)');
        css(o.it, 'opacity', (a * (1 - out) * (1 - lv)).toFixed(3));
        cl(o.it, 'is-new', tt >= arr[i] && tt < arr[i] + 1.6);
        y += a * (1 - lv) * (h + R.gap);
      }
      var waiting = out > 0.5 ? 0 : arrived - (tt >= C0 + 0.2 ? 1 : 0);
      if (R.count) textSwap(R.count, NUM[waiting]);
      if (R.badge) { textSwap(R.badge, NUM[waiting]); cl(R.badge, 'is-on', waiting > 0); }
      if (R.full) {
        // the card grows with its list; before the first item it says what it is watching
        css(R.card, 'height', (R.head + Math.max(y, 40 * (1 - c01(y / 40))) + 8).toFixed(1) + 'px');
        css(R.empty, 'opacity', (1 - c01(y / 30)).toFixed(3));
      }
    }

    return {
      layouts: layouts,
      pick: function (w, h) {
        // narrower than the phone's 546:1182 screen: the band cuts the phone on its right (the fallback)
        if (w / h < 0.452 && w >= 100) {
          var s = Math.max(1, h / 560);
          if (w / s < 132) s = w / 132;
          var W = Math.floor(w / s), H = Math.ceil(h / s), k = 'crop-' + W + 'x' + H;
          if (!layouts[k]) layouts[k] = { w: W, h: H, crop: true };
          return k;
        }
        // tall only where it fits at 1 or more: 1366 × 768 gives a 282 × 603 host, which would scale it to 0.995
        if (w >= 280 && h >= 606) return 'tall';
        if (w >= 224) return 'mid';
        /* 200–223 px wide (the whole phone at 768–991 px, zh: css/stargo-motion-phone.css), mid drawn at the
           host's own size, so its words stay at their size (QA round 5, 2026-10-24: 224 × 485 at 0.98) */
        if (w >= 200) {
          var Wd = Math.floor(w), Hd = Math.floor(h), kd = 'mid-' + Wd + 'x' + Hd;
          if (!layouts[kd]) layouts[kd] = { w: Wd, h: Hd, mid: true };
          return kd;
        }
        // the phone's mini under 140px wide (125 × 270 at 320, 133 × 288 at 340) is drawn at the host's own
        // size, so its words stay at 12px (QA round 5: 140 × 303 drawn at 0.89, words at 10.7px)
        if (w >= 140 || w < 100) return 'mini';
        var Wm = Math.floor(w), Hm = Math.floor(h), km = 'mini-' + Wm + 'x' + Hm;
        if (!layouts[km]) layouts[km] = { w: Wm, h: Hm, mini: true };
        return km;
      },
      // the composed frame: all three in, the follow-up approved and waiting to be sent
      build: build, tick: tick, still: 8.4, start: 0.2,
      cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }
  function ZH_OR(zh, en) { return K.ZH ? zh : en; }
  /* How much of a host the page shows, in its own px: its box, cut by ancestors that clip and by later
     in-flow blocks that start above its foot and paint over it (on phones the next section covers the
     foot of the hand-held phone, by an amount that depends on how the copy above it wraps). Read when the
     Runner fits the host (load, resize, coming into view), never per frame. */
  function shownH(host) {
    // layout boxes (offset*), not screen rectangles: a reveal that is still sliding the band in does not count
    var hb = box(host), b = hb[1] + hb[3];
    for (var a = host.parentElement; a && a !== document.body; a = a.parentElement) {
      var cs = getComputedStyle(a);
      if (cs.overflowY !== 'visible' || cs.overflowX !== 'visible') { var ab = box(a); b = Math.min(b, ab[1] + ab[3]); }
      for (var s = a.nextElementSibling; s; s = s.nextElementSibling) {
        if (!s.offsetParent || !s.offsetHeight) continue;
        var q = box(s);
        if (q[1] >= b || q[1] <= hb[1] || q[0] + q[2] <= hb[0] || q[0] >= hb[0] + hb[2]) continue;
        if (getComputedStyle(s).position === 'absolute') continue;
        b = q[1];
      }
    }
    return b - hb[1];
  }
  function box(e) { var w = e.offsetWidth, h = e.offsetHeight, x = 0, y = 0; for (; e; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return [x, y, w, h]; }

  /* =====================================================================
     SQUAD — 按任务组队, then 工作暂停，背景不必从头解释.
     ===================================================================== */
  function SquadScene() {
    var P = 18;
    var ROLES = [
      { name: T('统筹', 'Lead'), ico: 'flag', c: 'is-ink' },
      { name: T('研究', 'Research'), ico: 'search', c: 'is-cyan' },
      { name: T('销售', 'Sales'), ico: 'chat', c: 'is-amber' },
      { name: T('产品', 'Product'), ico: 'box', c: 'is-green' },
      { name: T('创意', 'Creative'), ico: 'spark', c: 'is-pink' }
    ];
    // role, what (wide / narrow / narrowest), runs from rs to rf, then done or waiting for the owner
    var STEPS = [
      { r: 1, t: [T('找出 12 家经销商', 'Find 12 dealers'), T('找出 12 家经销商', 'Find 12 dealers'), T('找经销商', 'Dealers')], rs: 2.3, rf: 4.0 },
      { r: 3, t: [T('核对 60V/72V 参数', 'Check 60V/72V specs'), T('核对电池参数', 'Check specs'), T('核对参数', 'Specs')], rs: 2.7, rf: 4.9 },
      { r: 2, t: [T('起草葡语开发信', 'Portuguese emails'), T('起草开发信', 'Draft emails'), T('写开发信', 'Emails')], rs: 3.5, rf: 7.0, wait: true },
      { r: 4, t: [T('做 3 张场景图', 'Make 3 scene images'), T('做 3 张场景图', '3 scene images'), T('场景图', 'Images')], rs: 13.1, rf: 14.6 },
      { r: 0, t: [T('汇总，交你确认', 'Sum up for your OK'), T('汇总交你确认', 'Sum up for you'), T('汇总', 'Sum up')], rs: 14.6, rf: 15.5, wait: true }
    ];
    var CHIP = 0.35, CHIP_D = 0.24, ROW = 1.6, ROW_D = 0.14;
    var B1 = [5.0, 7.7], B2 = [5.9, 7.7];       // 销售 asks 产品, 产品 answers
    var PAUSE = 8.3, SH0 = 8.55, SH1 = 9.05;     // the owner pauses; the saved context slides up
    var RESUME = 12.55, SO0 = 12.8, SO1 = 13.2;   // …and resumes; the task picks up at step 4
    var TOAST = [13.05, 15.0];
    var O0 = 17.15, O1 = 17.8;
    var ROUNDS = [2.3, 4.0, 5.0, 5.9, 13.1, 14.6], BUDGET = [0, 9, 17, 24, 31, 40, 48];
    // tall: the card's phone from 1280 up; mid: on phones (256–279 px wide); mini: at tablet width.
    // The card shows the top 73–77% of the screen: `fold` is where the story must end.
    var layouts = { tall: { w: 300, h: 649, fold: 492 }, mid: { w: 250, h: 541, fold: 408 }, mini: { w: 160, h: 346, fold: 250 } };
    // the card's phone is 236–249 px wide at 1024 px: there mid is drawn that wide rather than scaled under 1.
    // Phones under 336 px (320–335) show it 225–235 px wide: there `xs` packs the rows tighter (step 4, which
    // picks the task up again, stays above the fold) and takes a few shorter strings, so nothing drops under 12px.
    // The height is floored, and never over the host's own (QA round 5, 2026-10-24: at 320 the 225-wide phone
    // was laid out 487 tall in a 486 host, so it was drawn at 0.998 and its words at 11.97px).
    function midAt(w, h) {
      var W = Math.max(220, Math.min(250, Math.floor(w)));
      if (W === 250) return 'mid';
      var H = Math.floor(Math.min(W * 541 / 250, h || 1e4)), k = 'mid-' + W + 'x' + H;
      if (!layouts[k]) layouts[k] = { w: W, h: H, fold: Math.round(W * 408 / 250), kind: 'mid', xs: W < 236 };
      return k;
    }
    var LV = { tall: 0, mid: 1, mini: 2 };
    // every string a frame may show, made once
    var TEAM_N = [''], DONE_N = [], ROUND_N = [], BUDGET_N = [];
    for (var q = 1; q <= ROLES.length; q++) TEAM_N.push(T(q + ' 个岗位', q + (q === 1 ? ' role' : ' roles')));
    for (q = 0; q <= STEPS.length; q++) DONE_N.push(q + ' / ' + STEPS.length + T(' 完成', ' done'));
    // the task's sub line says rounds and budget are capped, so the meters carry only their values
    for (q = 0; q <= ROUNDS.length; q++) { ROUND_N.push(q + T('/12 轮', '/12')); BUDGET_N.push('¥' + BUDGET[q] + '/200'); }
    // the 236–249 px phone (1024 px) keeps the whole task title beside its state: 待确认 there, not 等你确认
    var STATE_T = [T('进行中', 'Running'), T('已暂停', 'Paused'), T('等你确认', 'Your OK')], STATE_TN = [STATE_T[0], STATE_T[1], T('待确认', 'Your OK')], STATE_C = ['sgp-pill sgp-state is-run', 'sgp-pill sgp-state is-amber', 'sgp-pill sgp-state is-amber'];
    var R, mode, lv, stateT = STATE_T, ro = null;

    function build(stage, L, name) {
      stateT = L.kind ? STATE_TN : STATE_T;
      name = L.kind || name;
      mode = name; lv = LV[name]; R = { chips: [], rows: [] };
      var mini = name === 'mini', xs = !!L.xs;
      stage.className = 'sg-mo-stage sgp sgp-squad is-' + name + (L.kind ? ' is-narrow' : '') + (xs ? ' is-xs' : '');
      statusBar(stage);
      var bar = appBar(stage, mini ? '' : T('工作台', 'Workspace'), T('任务', 'Tasks'));
      if (mini) tag(bar, true); else { barTools(bar); tag(el('div', 'sgp-tagline', stage), false); }
      var main = R.main = el('div', 'sgp-main', stage);
      // the task: what, its state, its limits, and the owner's pause
      var tk = el('div', 'sgp-task', main);
      var th = el('div', 'sgp-task-h', tk);
      el('b', '', th, xs ? T('开拓巴西两轮市场', 'Brazil e-scooters') : [T('开拓巴西电动两轮市场', 'Brazil e-scooter market'), T('开拓巴西电动两轮市场', 'Brazil e-scooters'), T('巴西两轮市场', 'Brazil e-scooters')][lv]);
      if (!mini) R.state = el('span', STATE_C[0], th, STATE_T[0]);
      if (lv === 0) el('div', 'sgp-task-s', tk, T('负责人：你 · 截止 11/14 · 轮数和预算有上限', 'Owner: you · capped rounds & budget'));
      var ctl = el('div', 'sgp-ctl', tk);
      if (mini) R.state = el('span', STATE_C[0], ctl, STATE_T[0]);
      else {
        var lim = el('div', 'sgp-limits', ctl);
        R.rounds = meter(lim, 'loop');
        R.budget = meter(lim, '');
      }
      R.pause = btn(ctl, T('暂停', 'Pause'), '', 'pause', mini ? 11 : 14);
      // the team forms
      var team = el('div', 'sgp-team', main);
      if (!mini) { var lab = el('div', 'sgp-label', team); el('span', '', lab, T('按任务组队', 'A team for this task')); R.teamN = el('em', '', lab, ''); }
      var chips = el('div', 'sgp-chips', team);
      R.link = el('i', 'sgp-link', chips);
      for (var i = 0; i < ROLES.length; i++) {
        var c = el('span', 'sgp-chip', chips);
        avatar(c, ROLES[i].c, '', ROLES[i].ico, [15, 13, 12][lv]);
        if (!mini) el('span', 'sgp-chip-t', c, ROLES[i].name);
        R.chips.push(c);
      }
      // the steps, run in parallel
      var steps = el('div', 'sgp-steps', main);
      if (!mini) { var sl = el('div', 'sgp-label', steps); el('span', '', sl, xs ? T('拆成 5 步，分头做', 'Split into 5 steps') : T('统筹拆成 5 步，分头做', 'Lead split it into 5 steps')); R.done = el('em', '', sl, ''); }
      for (var j = 0; j < STEPS.length; j++) {
        var st = STEPS[j];
        var row = el('div', 'sgp-step', steps);
        avatar(row, ROLES[st.r].c, '', ROLES[st.r].ico, [12, 11, 9][lv]);
        el('span', 'sgp-step-t', row, st.t[lv]);
        var stt = el('span', 'sgp-st', row);
        var spin = sv('svg', { viewBox: '0 0 20 20', width: 16, height: 16, class: 'sgp-spin', 'aria-hidden': 'true' }, stt);
        sv('circle', { cx: 10, cy: 10, r: 7.5, class: 'sgp-spin-bg' }, spin);
        var arc = sv('circle', { cx: 10, cy: 10, r: 7.5, class: 'sgp-spin-fg', pathLength: 100 }, spin);
        var ok = el('span', 'sgp-ok', stt); ico('check', ok, mini ? 9 : 11, 'sgp-ico', 3.2);
        if (st.wait) el('span', 'sgp-pill is-amber sgp-wait', stt, mini ? T('待你', 'You') : T('待你确认', 'Your OK'));
        R.rows.push({ row: row, spin: spin, arc: arc, st: stt });
      }
      // the roles asking each other: a short thread takes the place of the two steps still queued
      if (!mini) {
        var talk = R.talk = el('div', 'sgp-talk', steps);
        R.b1 = bubble(talk, 2, 3, xs ? T('起订量？能贴牌？', 'MOQ? Own label?') : T('起订量？能贴牌吗？', 'MOQ? Own label?'), '');
        R.b2 = bubble(talk, 3, 2, T('200 组起，可以贴牌。', 'MOQ 200, label OK.'), 'is-r');
        css(talk, 'justify-content', 'flex-start');
      }
      // the dim and the saved context, anchored above the fold
      R.dim = el('div', 'sgp-dim', stage);
      var sh = R.sheet = el('div', 'sgp-sheet', stage);
      el('i', 'sgp-grab', sh);
      var shh = el('div', 'sgp-sheet-h', sh);
      var pi = el('span', 'sgp-sheet-i', shh); ico('pause', pi, mini ? 11 : 14, 'sgp-ico', 2.6);
      var sht = el('div', '', shh);
      el('b', '', sht, T('已暂停', 'Paused'));
      el('span', '', sht, T('背景已保存', 'Context saved'));
      var CTX = [
        [T('已完成', 'Done'), [T('12 家经销商 · 参数已核对', '12 dealers · specs checked'), T('12 家经销商 · 参数已核', '12 dealers · specs OK'), T('12 家 · 参数已核', '12 dealers, specs')]],
        [T('在等', 'Waiting'), [T('2 封开发信待你确认', '2 emails need your OK'), T('2 封开发信待你确认', '2 emails need your OK'), T('2 封信待你确认', '2 emails, your OK')]],
        [T('谁拍板', 'Decides'), [T('你（负责人）', 'You, the owner'), T('你（负责人）', 'You, the owner'), T('你（负责人）', 'You, the owner')]],
        [T('下一步', 'Next'), [T('创意做 3 张场景图', 'Creative: 3 scene images'), T('创意做 3 张场景图', 'Creative: 3 images')]]
      ];
      R.ctx = [];
      for (var k = 0; k < CTX.length; k++) {
        if (!CTX[k][1][lv]) break;
        var cr = el('div', 'sgp-ctx', sh);
        el('span', '', cr, CTX[k][0]);
        el('b', '', cr, CTX[k][1][lv]);
        R.ctx.push(cr);
      }
      var sb = el('div', 'sgp-sheet-b', sh);
      R.resume = btn(sb, T('继续', 'Resume'), 'is-primary', 'play', mini ? 11 : 14);
      if (!mini) btn(sb, T('转给同事', 'Hand over'), '');
      R.L = L; R.stage = stage; R.steps = steps; R.xs = xs;
      fitRows();
      if (!ro && mode === 'mid' && window.ResizeObserver) {
        ro = new ResizeObserver(fitRows);
        ro.observe(document.body);
        var sec = stage.parentNode.closest('.lx-section');
        if (sec) ro.observe(sec);
      }
      // where it picks up
      R.toast = el('div', 'sgp-toast', stage);
      ico('play', R.toast, mini ? 10 : 12, 'sgp-ico');
      el('span', '', R.toast, mini ? T('从第 4 步接着做', 'Picks up at step 4') : xs ? T('从第 4 步接着做，不用从头交代', 'Back at step 4, no re-briefing') : T('从第 4 步接着做，不用从头交代', 'Picks up at step 4, no re-briefing'));
      // like the phone's own banners: over the app bar (what it covers steps aside), clear of the step
      // that starts again; mini keeps its demo tag in the bar, so there it takes the row of roles
      R.under = mini ? team : bar;
      css(R.toast, 'top', (R.under.offsetTop + (R.under.offsetHeight - R.toast.offsetHeight) / 2).toFixed(1) + 'px');
    }
    // Where the card crops the phone (about three quarters down, a little higher or lower with the copy beside
    // it: shownH, in stage px), no row of steps straddles the line. On phones (mid) all five rows fit above it
    // when they can, packed closer if need be (is-tight, then rows down to 23px: 320 px); else the rows that fit
    // stay above it and the next starts at it, whole and out of sight. The thread covers the steps
    // still queued (4 and 5) and its bubbles end above the fold and the line: where they end higher, it rises over
    // step 3 rather than run past them, its top always on a row's top line, so it covers whole rows and never
    // slices one. The saved context ends there too. Measured when built and when the page's layout settles
    // differently (a ResizeObserver), never per frame.
    function fitRows() {
      if (!R || !R.steps) return;
      var L = R.L, stage = R.stage, host = stage.parentNode, steps = R.steps, rows = R.rows, n = rows.length, j;
      var sTop = function () { return steps.offsetParent === stage ? steps.offsetTop : steps.offsetTop + R.main.offsetTop; };
      var line = L.fold;
      if (mode === 'mid' && host && host.clientWidth) {
        var s = Math.min(host.clientWidth / L.w, host.clientHeight / L.h);
        line = Math.round(Math.min(L.h, (shownH(host) - (host.clientHeight - L.h * s) / 2) / s));
        if (line === R.line) return;   // the page settled the same way (the observer reports every resize while it loads)
        R.line = line;
        stage.classList.toggle('is-tight', R.xs);
        for (j = 0; j < n; j++) css(rows[j].row, 'height', '');
        var r0 = sTop() + rows[0].row.offsetTop, h = rows[0].row.offsetHeight;
        if (!R.xs && r0 + n * h > line) { stage.classList.add('is-tight'); r0 = sTop() + rows[0].row.offsetTop; h = rows[0].row.offsetHeight; }
        if (r0 + n * h > line) {
          var k = n;
          while (k > 1 && r0 + k * 23 > line) k--;
          h = Math.floor((line - r0) / k * 2) / 2;
          for (j = 0; j < n; j++) css(rows[j].row, 'height', h + 'px');
        }
      }
      var end = Math.min(L.fold, line);
      if (R.talk) {
        var top0 = sTop(), stop = Math.min(steps.offsetHeight, end - top0 - 4), need = R.b1.offsetHeight + R.b2.offsetHeight + 6;
        var top = rows[3].row.offsetTop, room = stop - need - 12;
        for (var rk = 3; rk > 0 && top > room; rk--) top = rows[rk - 1].row.offsetTop;
        css(R.talk, 'top', top + 'px');
        css(R.talk, 'padding-top', Math.max(0, Math.round((stop - top - need) / 2)) + 'px');
      }
      css(R.sheet, 'top', '');
      css(R.sheet, 'top', (end - R.sheet.offsetHeight) + 'px');
    }
    // one message: who says it (avatar), to whom (@mention), what
    function bubble(parent, role, to, text, cls) {
      var b = el('div', 'sgp-bub ' + cls, parent);
      avatar(b, ROLES[role].c, '', ROLES[role].ico, lv ? 10 : 11);
      var m = el('div', 'sgp-bub-m', b);
      el('b', 'sgp-at', m, '@' + ROLES[to].name);
      el('span', '', m, text);
      return b;
    }
    // a limit: its value (rounds get the loop mark, the budget its ¥) over a thin bar
    function meter(parent, icoName) {
      var m = el('div', 'sgp-meter', parent);
      var r = el('div', 'sgp-meter-r', m);
      if (icoName) ico(icoName, r, lv ? 12 : 13, 'sgp-ico', 2.4);
      var v = el('b', 'sgp-meter-t', r, '');
      var bar = el('i', 'sgp-meter-b', m);
      return { v: v, f: el('i', '', bar) };
    }

    function tick(t) {
      var tt = mod(t, P);
      var out = ease.io(seg(tt, O0, O1)), keep = 1 - out;
      // the team forms: each role joins, and the line between them draws on
      var n = 0;
      for (var i = 0; i < R.chips.length; i++) {
        var a = seg(tt, CHIP + i * CHIP_D, CHIP + i * CHIP_D + 0.42);
        if (tt >= CHIP + i * CHIP_D + 0.1) n++;
        css(R.chips[i], 'opacity', (ease.out(a) * keep).toFixed(3));
        css(R.chips[i], 'transform', 'scale(' + (0.55 + 0.45 * ease.out(c01(a * 1.15))).toFixed(3) + ')');
      }
      css(R.link, 'transform', 'scaleX(' + (ease.io(seg(tt, CHIP + 0.2, CHIP + 4 * CHIP_D + 0.3)) * keep).toFixed(3) + ')');
      if (R.teamN) textSwap(R.teamN, out > 0.5 ? '' : TEAM_N[n]);
      // the steps
      var paused = tt >= PAUSE + 0.1 && tt < RESUME + 0.15;
      var done = 0;
      for (var j = 0; j < STEPS.length; j++) {
        var st = STEPS[j], o = R.rows[j];
        var ra = ease.out(seg(tt, ROW + j * ROW_D, ROW + j * ROW_D + 0.45));
        css(o.row, 'opacity', (ra * keep).toFixed(3));
        css(o.row, 'transform', 'translateY(' + ((1 - ra) * 10).toFixed(1) + 'px)');
        var run = tt >= st.rs && tt < st.rf, fin = tt >= st.rf;
        if (fin && !st.wait) done++;
        cl(o.row, 'is-run', run);
        cl(o.row, 'is-fin', fin);
        css(o.arc, 'stroke-dashoffset', (100 - 100 * (0.12 + 0.88 * seg(tt, st.rs, st.rf))).toFixed(1));
        css(o.spin, 'transform', run && !paused ? 'rotate(' + ((tt * 300) % 360).toFixed(1) + 'deg)' : 'none');
        cl(o.st, 'is-wait', fin && !!st.wait);
      }
      if (R.done) textSwap(R.done, out > 0.5 ? '' : DONE_N[done]);
      // the roles ask each other
      if (R.talk) {
        css(R.talk, 'opacity', (ease.out(seg(tt, B1[0] - 0.15, B1[0] + 0.2)) * (1 - seg(tt, B1[1] - 0.1, B1[1] + 0.25))).toFixed(3));
        bubbleAt(R.b1, tt, B1, keep); bubbleAt(R.b2, tt, B2, keep);
      }
      // the limits
      var k = 0; while (k < ROUNDS.length && tt >= ROUNDS[k]) k++;
      if (out > 0.5) k = 0;
      if (R.rounds) {
        textSwap(R.rounds.v, ROUND_N[k]);
        css(R.rounds.f, 'transform', 'scaleX(' + (k / 12).toFixed(3) + ')');
        textSwap(R.budget.v, BUDGET_N[k]);
        css(R.budget.f, 'transform', 'scaleX(' + (BUDGET[k] / 200).toFixed(3) + ')');
      }
      // the pause, the saved context, the resume
      tapAt(R.pause, tt, PAUSE);
      tapAt(R.resume, tt, RESUME);
      cl(R.pause.b, 'is-held', paused);
      var shown = ease.out(seg(tt, SH0, SH1)) * (1 - ease.io(seg(tt, SO0, SO1)));
      css(R.sheet, 'transform', 'translateY(' + ((1 - shown) * 104).toFixed(2) + '%)');
      css(R.sheet, 'visibility', shown > 0.001 ? 'visible' : 'hidden');
      css(R.dim, 'opacity', (shown * 0.9).toFixed(3));
      for (var c = 0; c < R.ctx.length; c++) {
        var ca = ease.out(seg(tt, SH1 - 0.15 + c * 0.16, SH1 + 0.3 + c * 0.16));
        css(R.ctx[c], 'opacity', ca.toFixed(3));
        css(R.ctx[c], 'transform', 'translateY(' + ((1 - ca) * 8).toFixed(1) + 'px)');
      }
      var ta = ease.out(seg(tt, TOAST[0], TOAST[0] + 0.35)) * (1 - seg(tt, TOAST[1] - 0.35, TOAST[1]));
      css(R.toast, 'opacity', ta.toFixed(3));
      css(R.under, 'opacity', (1 - c01(ta * 1.4)).toFixed(3));
      css(R.toast, 'transform', 'translate(-50%,' + ((ta - 1) * 10).toFixed(1) + 'px)');
      // the task's state
      var s = out > 0.5 ? 0 : tt >= STEPS[4].rf ? 2 : paused ? 1 : 0;
      textSwap(R.state, stateT[s]);
      put(R.state, 'cls', STATE_C[s]);
    }
    function bubbleAt(b, tt, w, keep) {
      var a = ease.out(seg(tt, w[0], w[0] + 0.4)) * (1 - seg(tt, w[1] - 0.3, w[1]));
      css(b, 'opacity', (a * keep).toFixed(3));
      css(b, 'transform', 'translateY(' + ((1 - a) * 8).toFixed(1) + 'px) scale(' + (0.96 + 0.04 * a).toFixed(3) + ')');
    }

    return {
      layouts: layouts,
      pick: function (w, h) { return w >= 300 ? 'tall' : w >= 200 ? midAt(w, h) : 'mini'; },
      // the composed frame: the team at work, paused, its context on screen
      build: build, tick: tick, still: 11.0, start: 0.1,
      cue: function (t) { return Math.ceil(t / P) * P; }
    };
  }

  return { feed: FeedScene, squad: SquadScene };
});

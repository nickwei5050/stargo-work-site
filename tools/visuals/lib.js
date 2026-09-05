/* Small component helpers for the STARGO OS mocks. Loaded by every page. */
(function () {
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M8 14h.01M16 14h.01M9 17h6"/>',
    planet: '<circle cx="12" cy="12" r="5"/><path d="M3.5 9.5c3-1 6-1 9 0s6 3 8 5"/><path d="M20.5 14.5c-3 1-6 1-9 0s-6-3-8-5"/>',
    wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/>',
    volume: '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
    pin: '<path d="M12 21s7-6.5 7-11.5a7 7 0 0 0-14 0C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
    nav: '<path d="m3 11 18-8-8 18-2-8z"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    chevl: '<path d="m15 6-6 6 6 6"/>',
    chevr: '<path d="m9 6 6 6-6 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
    star: '<path d="m12 3 2.7 6 6.3.6-4.8 4.2 1.5 6.2L12 16.8 6.3 20l1.5-6.2L3 9.6 9.3 9z"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    send: '<path d="m3 11 18-8-8 18-2-8z"/>',
    clip: '<path d="m16 6-7.5 7.5a2.5 2.5 0 0 0 3.5 3.5L19 10a5 5 0 0 0-7-7L5 10"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    box: '<path d="m3 8 9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    ship: '<path d="M3 17c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M5 15V8h14v7M9 8V5h6v3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 20a5 5 0 0 1 6-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    tag: '<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    flag: '<path d="M5 21V4h11l-1.5 3L16 10H5"/>',
    hand: '<path d="M8 12V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-12 0v-3a1.5 1.5 0 0 1 3 0"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h3.5a1.75 1.75 0 0 1 0 3.5h-2a1.75 1.75 0 0 0 0 3.5H15"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    signal: '<path d="M4 18v-3M9 18v-7M14 18V7M19 18V4"/>',
    battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/><rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor" stroke="none"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  };
  const icon = (n, s = 18, sw = 1.6, cls = '') =>
    `<svg class="i ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

  const spark = (pts, color = '#5fd08b', w = 70, h = 22) => {
    const max = Math.max(...pts), min = Math.min(...pts);
    const d = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * (h - 3) - 1.5}`).join(' ');
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  };
  const ring = (pct, color = '#5fd08b', size = 34, sw = 3) => {
    const r = (size - sw) / 2, c = 2 * Math.PI * r;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="rgba(255,255,255,.1)" stroke-width="${sw}" fill="none"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-dasharray="${(c * pct) / 100} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
  };
  /** the ∞-star glyph */
  const glyph = (w = 60, color = '#fff') => `<svg width="${w}" height="${w * 0.42}" viewBox="0 0 100 42" fill="none"><path d="M50 21c-9-14-22-18-31-11S8 33 19 34c12 1 24-13 31-13s19 14 31 13c11-1 11-17 0-24S59 7 50 21z" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/><path d="M88 9l2.4 6 6.3.6-4.8 4.1 1.5 6.2-5.4-3.3-5.4 3.3 1.5-6.2-4.8-4.1 6.3-.6z" fill="${color}"/></svg>`;
  const wordmark = (size = 14, color = 'currentColor') => `<span class="wordmark" style="font-size:${size}px;color:${color}">${glyph(size * 2.6, color)}STARGO OS</span>`;

  const NAV = ['BOSS COCKPIT', 'SPACE', 'INSIGHTS', 'AI WORKFORCE', 'AUTOMATIONS'];
  const appbar = (active = 0, badge = 3) => `<div class="appbar">
    <div class="brand"><span class="orb xs"></span>STARGO OS</div>
    <nav>${NAV.map((n, i) => `<a class="${i === active ? 'on' : ''}">${n}</a>`).join('')}</nav>
    <div class="search">${icon('search', 14)}Ask STARGO CORE…</div>
    <div class="cluster">
      <div class="status"><b><span class="dot"></span>System Status</b><span>Optimal</span></div>
      <span class="ic">${icon('bell')}<span class="badge">${badge}</span></span>
      <span class="ic">${icon('chat')}</span><span class="ic">${icon('gear')}</span><span class="ic">${icon('briefcase')}</span>
      <div class="user"><span class="av"></span><div><b style="font-weight:600;font-size:12px">Jason Lin</b><small>Founder &amp; CEO</small></div>${icon('chev', 14)}</div>
    </div></div>`;

  const APPS = [
    ['CORE', null, 'orb'], ['MAIL', 'mail', 'linear-gradient(135deg,#ffd36a,#f2a52b)'], ['CALENDAR', null, 'cal'],
    ['SPACE', 'planet', 'linear-gradient(135deg,#3b2f6b,#12101f)'], ['DRIVE', 'folder', 'linear-gradient(135deg,#ffc14d,#e08a19)'],
    ['AI AGENTS', 'robot', 'linear-gradient(135deg,#3a3a44,#17171c)'], ['INSIGHTS', 'chart', 'linear-gradient(135deg,#4aa8ff,#1e5fd6)'],
    ['AUTOMATIONS', 'bolt', 'linear-gradient(135deg,#2c2f5c,#141633)'], ['CHAT', 'chat', 'linear-gradient(135deg,#5fd08b,#2f9d5c)'],
    ['APP STORE', 'grid', 'linear-gradient(135deg,#6aa9ff,#2f6ee0)'], ['SETTINGS', 'gear', 'linear-gradient(135deg,#8c8c94,#4b4b52)'],
  ];
  const dock = (running = [0, 1, 3, 7]) => `<div class="dock">${APPS.map(([n, ic, bg], i) => {
    let inner;
    if (bg === 'orb') inner = '<span class="orb sm"></span>';
    else if (bg === 'cal') inner = '<div class="tile cal" style="background:linear-gradient(180deg,#f5f0ea,#e6dfd6);color:#1c130c"><small>MAY</small><b>27</b></div>';
    else inner = `<div class="tile" style="background:${bg}">${icon(ic, 24, 1.8)}</div>`;
    return `<div class="app ${running.includes(i) ? 'run' : ''}">${inner}<span>${n}</span></div>`;
  }).join('')}</div>`;

  const wall = (blurred = false) => `<div class="wall ${blurred ? 'blurred' : ''}"><div class="silk a"></div><div class="silk b"></div><div class="silk c"></div>
    <svg class="arc" viewBox="0 0 1600 1000" preserveAspectRatio="none"><path d="M-100 420 C 300 250, 700 650, 1150 380 S 1700 260, 1750 380" stroke="rgba(255,190,120,.22)" stroke-width="3" fill="none" style="filter:blur(6px)"/><path d="M-100 470 C 350 320, 750 700, 1200 430 S 1700 320, 1750 430" stroke="rgba(255,150,80,.14)" stroke-width="30" fill="none" style="filter:blur(28px)"/></svg></div><div class="vignette"></div>`;

  const lights = () => '<div class="lights"><i></i><i></i><i></i></div>';
  const sbar = () => `<div class="sbar"><span>9:41</span><span class="r">${icon('signal', 26, 2.2)}${icon('wifi', 26, 2.2)}${icon('battery', 30, 2)}</span></div>`;
  const tabbar = (on = 0) => `<div class="tabbar">${['home', 'chat', 'bolt', 'folder'].map((n, i) => `<span class="t ${i === on ? 'on' : ''}">${icon(n, 40, 1.7)}</span>`).join('')}</div><div class="home"></div>`;

  window.S = { icon, spark, ring, glyph, wordmark, appbar, dock, wall, lights, sbar, tabbar };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tpl]').forEach((el) => { el.outerHTML = S[el.dataset.tpl](...(el.dataset.args ? JSON.parse(el.dataset.args) : [])); });
    document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, +(el.dataset.size || 18), +(el.dataset.sw || 1.6)); });
  });
})();

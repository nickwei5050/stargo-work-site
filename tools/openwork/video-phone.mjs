/**
 * OPEN WORK demo video — the phone cut.
 *
 * The desktop film (video-page.mjs) is a 1440×900 scene: shown 362px wide on
 * a phone its 13–15px interface text comes out at about 3.5 CSS px, so on a
 * phone held upright the page plays this cut instead (tools/ow-blocks/demo-video.mjs
 * DEMO_PHONE_MEDIA; js/stargo-ow.js picks it). Same story, same copy, same demo
 * data, same OPEN WORK interface (it loads the same CSS), laid out the way
 * the app reads on a phone: one column, 360×600 CSS px, rendered at
 * deviceScaleFactor 2 (720×1200).
 *
 *   0–4.75     the inquiry arrives; AI reads it (key phrases, chips, steps)
 *   4.75–6.85  the English reply streams in; the chat follows it up
 *   7.05–8.8   the Sales Workbench opens as a sheet and the PI fills in
 *   8.5–11     price check: below standard → the sales manager's approval bar
 *   11–12.85   the manager taps 批准: 已批准 · 已发送
 *   12.85–16   end card, then back to frame 0 (the loop has no seam)
 *
 * Every text is at least 13 CSS px in the 360px frame, so it is at least
 * 12 CSS px wherever the film is shown 332px wide or more (a 360px phone);
 * __check(t) fails the render when one is smaller. The 「演示数据」 /
 * "Demo data" badge is in the title bar in every frame.
 */
import { STR, INQUIRY, REPLY, ITEMS, esc } from './video-page.mjs';

export const MW = 360;
export const MH = 600;
export const MDSF = 2;
/** The poster: the PI and its approval bar, the manager's cursor on Approve. */
export const POSTER_TM = 10.9;
/** Smallest text in the frame, CSS px (checked). */
export const MIN_FONT = 13;

/** Timeline, in seconds: the desktop film's, with the PI after the reply (one column). */
export const TM = {
  inqIn: 0.2,
  aiIn: 1.8,
  hl0: 2.05, hlStep: 0.26,
  st0: 2.95, stStep: 0.42,
  aiDone: 4.3,
  replyIn: 4.75, streamA: 4.95, streamB: 6.85,
  sheetIn: 7.05,
  piHead: 7.35, piParties: 7.5, piRow1: 7.7, piRow2: 7.9, piTot: 8.1,
  flag: 8.5, barIn: 8.8,
  curIn: 10.0, curGlide: 0.9, tap: 11.0, approve: 11.15, curOut: 11.55,
  endIn: 12.85, veilOpaque: 15.05, endOut: 15.05, reset: 15.35,
};

export function phoneCss() {
  return `
/* ---- OPEN WORK demo video, phone cut (tools/openwork/video-phone.mjs) ---- */
html.m,html.m body{width:${MW}px;height:${MH}px;overflow:hidden}
body.vid.m{font-size:14.5px}
.m .mwin{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--main);overflow:hidden}
.m .mbar{position:relative;z-index:30;height:46px;flex:none;display:flex;align-items:center;gap:8px;padding:0 12px 0 14px;border-bottom:1px solid var(--line);background:var(--main);font-size:14px;white-space:nowrap}
.m .bmark{display:flex;align-items:center;gap:6px;font-weight:700;letter-spacing:.02em;color:#141a33}
.m .bmark .spark{width:15px;height:15px}
.m .mbar .sep{color:var(--ink3)}
.m .mbar .crumb{font-weight:600;color:var(--ink2)}
.m .vbadge{height:28px;font-size:13px;padding:0 11px 0 10px}
.m .mview{position:relative;flex:1;min-height:0;overflow:hidden}
.m .mthread{position:absolute;left:0;right:0;top:0;padding:12px 12px 0;display:flex;flex-direction:column;gap:10px}
.m .mthread>*{flex:none}
body.vid.m .card .ch{font-size:14.5px;padding:10px 14px}
body.vid.m .tag{height:24px;font-size:13px}
.m .inq .ch em{font-size:13px}
.m .inq .who{padding:10px 14px 0}
.m .inq .who b{font-size:14px}
.m .inq .who small{font-size:13px}
.m .inq p{font-size:14.5px;line-height:1.58;padding:6px 14px 12px}
body.vid.m .steps{padding:11px 14px 9px}
.m .chips2{gap:7px;margin:9px 0 7px}
.m .chip2{height:30px;padding:0 11px;font-size:13.5px;gap:6px}
body.vid.m .step{font-size:14px;align-items:flex-start;line-height:1.45}
body.vid.m .step .stx{margin-top:2px}
body.vid.m .step small{font-size:13px}
body.vid.m .reply .mail{font-size:14px;line-height:1.55;padding:10px 14px 12px}
.m .caret{height:17px}
/* the Sales Workbench opens over the chat as a sheet */
.m .mdim{position:absolute;inset:0;z-index:4;background:rgba(15,23,42,0)}
.m .msheet{position:absolute;left:0;right:0;top:6px;bottom:0;z-index:5;display:flex;flex-direction:column;gap:9px;padding:7px 12px 12px;border-radius:18px 18px 0 0;border-top:1px solid var(--line);background:#fbfaf8;box-shadow:0 -18px 40px -18px rgba(15,23,42,.30);transform:translateY(102%)}
.m .mgrab{width:40px;height:4px;border-radius:2px;background:#d9d4cc;margin:0 auto;flex:none}
.m .mtab{display:flex;align-items:center;gap:7px;padding:0 2px;font-size:14px;font-weight:600;color:#26252a;white-space:nowrap;flex:none}
.m .mtab .i{width:15px;height:15px;color:var(--ink2)}
.m .mtab span{color:var(--ink3);font-weight:500}
.m .mscroll{position:relative;flex:1;min-height:0;overflow:hidden}
body.vid.m .mscroll>.pi{position:absolute;left:0;right:0;top:0;margin:0;background:#fff}
body.vid.m .pi-head{display:block;padding:12px 14px 6px}
body.vid.m .pi-head>div{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:0 10px}
body.vid.m .pi-head>div>*{white-space:nowrap}
body.vid.m .pi-head>div>:last-child{margin-left:auto}
body.vid.m .pi-head b{font-size:15px}
body.vid.m .pi-head .no{font-size:14px}
body.vid.m .pi-head small{font-size:13px;margin-top:2px}
body.vid.m .pi-parties{gap:10px;padding:6px 14px 10px;font-size:13px;line-height:1.45}
body.vid.m .pi-parties>div>span{font-size:13px}
body.vid.m .pi-parties .f{display:block;width:fit-content;color:#3a3935;font-size:13px}
.m .mi{padding:9px 14px;border-top:1px solid #ece9e4}
.m .mi1{font-size:14px;line-height:1.45;color:#2d2c29}
.m .mi2{display:flex;justify-content:space-between;align-items:baseline;margin-top:3px;font-size:14px;color:#3a3935;font-variant-numeric:tabular-nums}
body.vid.m .pi .tot{gap:14px;padding:10px 14px;font-size:14px}
body.vid.m .pi .tot b{font-size:16px;font-variant-numeric:tabular-nums}
/* the approval bar, stacked: the rule over its two buttons */
body.vid.m .vbar{display:grid;grid-template-columns:20px minmax(0,1fr);align-items:start;gap:0 10px;padding:12px 14px}
body.vid.m .vbar .bico{margin-top:1px}
body.vid.m .vbar .btxt b{font-size:14.5px;white-space:normal}
body.vid.m .vbar .btxt small{font-size:13px;white-space:pre-line}
body.vid.m .vbar .bact{grid-column:1/-1;justify-self:end;margin-top:10px}
body.vid.m .vbar .btn{height:36px;font-size:14px}
body.vid.m .vbar .sent{font-size:13.5px}
/* step rail: the current step is spelled out, the others are numbers */
.m .mrail{flex:none;position:relative;z-index:3;height:52px;display:flex;align-items:center;justify-content:center;gap:4px;border-top:1px solid var(--line);background:#f1f4fb}
.m .ri{height:34px;padding:0 5px;gap:0;border-radius:999px;font-size:14px;color:#5b6b84}
.m .ri .n>*{font-size:13px}
.m .ri .lb{display:block;overflow:hidden;white-space:nowrap;max-width:0}
.m .ri .lb>span{display:block;width:max-content;padding:0 9px 0 7px}
/* cursor: the name tag on the pointer's left, inside the frame */
.m .vcur .who{left:auto;right:18px;border-radius:999px 8px 999px 999px}
/* end card */
.m .veil,.m .endw{top:47px}
.m .endc{width:324px;padding:26px 20px 22px;border-radius:22px}
.m .endc .eb{max-width:100%;gap:7px;padding:5px 10px 5px 5px;border-radius:16px;font-size:13px;line-height:1.4;text-align:left;text-wrap:balance}
.m .endc .eb .sp{width:22px;height:22px;flex:none}
.m .endc h2,body.vid.m[lang=en] .endc h2{margin-top:18px;font-size:25px;line-height:1.3;letter-spacing:-.01em}
.m .endc h2>span{white-space:normal;text-wrap:balance}
.m .endc h2 .ph{display:inline-block;white-space:nowrap}
.m .endc .lock{margin-top:22px;padding-top:18px;gap:10px}
.m .endc .lock img.ic{width:34px;height:34px;border-radius:9px}
.m .endc .lock .wm{gap:8px}
.m .endc .lock .wm img{height:21px}
.m .endc .lock .wm b{font-size:21px}
`;
}

/** The phone page for one language (same helpers as videoPage). */
export function videoPagePhone(lang, { icon, asset, cssHref }) {
  const s = STR[lang];
  if (!s) throw new Error(`video (phone): unknown language ${lang}`);
  const spark = icon('sparkle', 'spark').replace('stroke="currentColor"', 'stroke="#1756d6" fill="#1756d6"');
  const inquiry = INQUIRY.map(([txt, i]) => i === undefined ? esc(txt) : `<span class="hl" data-i="${i}">${esc(txt)}</span>`).join('');
  /* a narrow column must not break 「SVF-500」 or 「1-colour」 at the hyphen: a non-breaking hyphen (U+2011) */
  const nbh = (x) => x.replace(/(\w)-(\w)/g, '$1\u2011$2');
  const tokens = REPLY.split(/(?<=\s)/).map((w) => `<span class="tok">${esc(nbh(w))}</span>`).join('');
  const fld = (v, at) => `<span class="f" data-t="${at}"><span class="fx">${v}</span></span>`;
  const usd = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const spinner = `<svg class="i spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-opacity=".18"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>`;
  const items = ITEMS.map(([c, d, q, u, a], r) => {
    const at = r ? TM.piRow2 : TM.piRow1;
    return `<div class="mi"><div class="mi1">${fld(`<b>${c}</b> · ${esc(nbh(d))}`, at)}</div>`
      + `<div class="mi2">${fld(`${q} × US$ <span class="unit"${r ? '' : ' id="unit1"'}>${u}</span>`, at + 0.08)}${fld(`<span class="amt" data-v="${a}">${usd(a)}</span>`, at + 0.16)}</div></div>`;
  }).join('');
  const crumb = s.crumb.split(' · ').pop();
  /* Chinese headline lines break only between phrases (after ，、。), never inside 读懂 */
  const phrases = (txt) => (lang === 'zh' ? txt.match(/[^，、。]+[，、。]?/g).map((x) => `<span class="ph">${esc(x)}</span>`).join('') : esc(txt));
  const body = `<div class="mwin" id="win">
  <div class="mbar"><span class="bmark">${spark}OPEN WORK</span><span class="sep">/</span><span class="crumb">${esc(crumb)}</span><span class="vbadge" id="badge"><i></i>${esc(s.badge)}</span></div>
  <div class="mview" id="view">
    <div class="mthread" id="thread">
      <div class="card inq" id="inq"><div class="ch"><span class="dotnew">${icon('inbox')}</span>${esc(s.inqHead)}<em>${esc(s.inqWhen)}</em></div>
        <div class="who"><span class="av">E</span><b>${esc(s.inqFrom)}</b><small>${esc(s.inqMeta)}</small></div>
        <p>${inquiry}</p></div>
      <div class="steps ai" id="ai"><div class="h"><span class="ahd"><span class="rd">${spinner}<em>${esc(s.aiReading)}</em></span><span class="ok">${icon('circle-check')}${esc(s.aiDone)}</span></span></div>
        <div class="chips2">${s.chips.map(([k, v], i) => `<span class="chip2" data-i="${i}"><span>${esc(k)}</span>${esc(v)}</span>`).join('')}</div>
        ${s.steps.map(([a, b], i) => `<div class="step" data-i="${i}"><span class="stx">${spinner}${icon('check', 'ck')}</span><div>${esc(a)} <small><span class="dot">· </span>${esc(b)}</small></div></div>`).join('\n')}</div>
      <div class="card reply" id="reply"><div class="ch">${icon('mail')}${esc(s.replyHead)}<span class="tagx"><span class="tag g">${esc(s.tags[0])}</span><span class="tag w">${esc(s.tags[1])}</span><span class="tag a">${esc(s.tags[2])}</span></span></div>
        <div class="mailw"><div class="mail" id="mail">${tokens}</div></div></div>
    </div>
    <div class="mdim" id="dim"></div>
    <div class="msheet" id="sheet"><span class="mgrab"></span>
      <div class="mtab">${icon('briefcase')}${esc(s.tabs[0])}<span>· PI</span></div>
      <div class="mscroll" id="mscroll"><div class="card pi" id="pi">
        <div class="pi-head"><div><b>${fld('PROFORMA INVOICE', TM.piHead)}</b><b class="no">${fld('PI-2026-1108', TM.piHead + 0.1)}</b></div><div><small>${fld(esc(s.piSmall), TM.piHead + 0.05)}</small><small>${fld(esc(s.piDate), TM.piHead + 0.15)}</small></div></div>
        <div class="pi-parties"><div><span>Seller</span>${fld('STARGO Demo Manufacturing Co., Ltd.', TM.piParties)}</div><div><span>Buyer</span>${fld('Nordhem Living AB', TM.piParties + 0.08)}${fld('Gothenburg, Sweden', TM.piParties + 0.12)}</div></div>
        ${items}
        <div class="tot"><span>${fld('FOB Ningbo', TM.piTot)}</span>${fld('Total <b>US$ <span id="total">2,100.00</span></b>', TM.piTot + 0.05)}</div>
        <div class="vbarw" id="barw"><div class="vbar" id="bar">
          <span class="bico">${icon('triangle-alert', 'w')}${icon('circle-check', 'a')}</span>
          <span class="btxt"><div class="pend"><b>${esc(s.barPending)}</b><small>${esc(s.barPendingSub)}</small></div><div class="done"><b>${esc(s.barDone)}</b><small>${esc(s.barDoneSub)}</small></div></span>
          <span class="bact"><span class="btns"><span class="btn">${icon('undo-2')}${esc(s.btnBack)}</span><span class="btn pri" id="approve">${icon('check')}${esc(s.btnApprove)}</span></span><span class="sent">${icon('send')}${esc(s.tags[2])} · 14:32</span></span>
          <span class="ripple" id="ripple"></span>
        </div></div>
      </div></div>
    </div>
  </div>
  <div class="mrail" id="rail">${s.rail.map((r, i) => `<span class="ri" data-i="${i}"><span class="n"><span class="num">${i + 1}</span><span class="act">${i + 1}</span><span class="dn">${icon('check')}</span></span><span class="lb"><span>${esc(r)}</span></span></span>`).join('')}</div>
  <div class="veil" id="veil"></div>
  <div class="endw"><div class="endc" id="end">
    <span class="eb"><span class="sp">${icon('sparkle')}</span>${esc(s.eyebrow)}</span>
    <h2><span class="l1">${phrases(s.end1)}</span><span class="l2 g">${phrases(s.end2)}</span></h2>
    <div class="lock"><img class="ic" src="${asset('assets/brand/stargo-icon-180.png')}" alt=""><span class="wm"><img src="${asset('assets/brand/stargo-wordmark.png')}" alt="STARGO"><b>WORK</b></span></div>
  </div></div>
</div>
<div class="vcur" id="cur"><svg viewBox="0 0 26 26"><path d="M3 2.2 21.6 11c.9.4.8 1.7-.1 2l-7.2 2.2-3.3 6.9c-.4.9-1.7.8-2-.1L2.2 3.4c-.3-.8.4-1.5 1.1-1.2Z" fill="#fff" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="who">${esc(s.cursor)}</span></div>`;

  return `<!doctype html><html class="m" lang="${s.lang}"><head><meta charset="utf-8"><title>${esc(s.title)}</title><link rel="stylesheet" href="${cssHref}"></head>
<body class="vid m" lang="${s.lang}">
${body}
<script>window.__init = () => (${clientPhone.toString()})(${JSON.stringify(TM)}, 16, ${MIN_FONT});</script>
</body></html>`;
}

/* ---- runs in the page --------------------------------------------------- */
function clientPhone(T, D, MINF) {
  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const eo = (p) => 1 - Math.pow(1 - p, 3);
  const eo4 = (p) => 1 - Math.pow(1 - p, 4);
  const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = (p) => { const c1 = 1.5, c3 = c1 + 1; return p <= 0 ? 0 : 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const mix = (c1, c2, p) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], p))).join(',')})`;
  const r3 = (n) => Math.round(n * 1000) / 1000;
  const usd = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const swap = (a, b, t, at, dy = 0, pop = false) => {
    const po = eo(seg(t, at, at + 0.14)), pi = eo(seg(t, at + 0.12, at + 0.38));
    a.style.opacity = r3(1 - po); b.style.opacity = r3(pi);
    a.style.transform = `translateY(${r3(-dy * po)}px)${pop ? ` scale(${r3(lerp(1, 0.9, po))})` : ''}`;
    b.style.transform = `translateY(${r3(dy * (1 - pi))}px)${pop ? ` scale(${r3(lerp(0.9, 1, pi))})` : ''}`;
  };
  const fadeUp = (el, p, dy = 14, s0 = 1) => {
    el.style.opacity = r3(p);
    el.style.transform = `translateY(${r3((1 - p) * dy)}px)${s0 !== 1 ? ` scale(${r3(lerp(s0, 1, p))})` : ''}`;
  };

  const view = $('#view'), thread = $('#thread'), dim = $('#dim'), sheet = $('#sheet'), mscroll = $('#mscroll'), piCard = $('#pi');
  const inq = $('#inq'), ai = $('#ai'), reply = $('#reply'), mail = $('#mail'), mailw = $('.mailw');
  const hls = $$('.hl'), chips = $$('.chip2'), steps = $$('.step'), toks = $$('.tok');
  const rd = $('.ahd .rd'), rdTxt = $('.ahd .rd em'), ok = $('.ahd .ok');
  const tags = $$('.reply .tagx .tag');
  const fields = $$('.f'), total = $('#total'), amts = $$('.amt'), unit1 = $('#unit1');
  const barw = $('#barw'), bar = $('#bar'), pend = $('.vbar .pend'), done = $('.vbar .done');
  const icoW = $('.vbar .bico .w'), icoA = $('.vbar .bico .a'), btns = $('.vbar .btns'), sent = $('.vbar .sent');
  const approve = $('#approve'), ripple = $('#ripple');
  const rail = $('#rail'), ris = $$('.ri');
  const cur = $('#cur'), veil = $('#veil'), end = $('#end'), l1 = $('.endc .l1'), l2 = $('.endc .l2'), eb = $('.endc .eb'), lock = $('.endc .lock');
  const caret = document.createElement('span'); caret.className = 'caret'; reply.style.position = 'relative'; reply.appendChild(caret);

  /* ---- measured once, at the final layout -------------------------------- */
  const lh = parseFloat(getComputedStyle(mail).lineHeight);
  const padT = parseFloat(getComputedStyle(mail).paddingTop), padB = parseFloat(getComputedStyle(mail).paddingBottom);
  const mtop = mail.getBoundingClientRect().top;
  const tokLine = toks.map((el) => Math.round((el.getBoundingClientRect().top - mtop - padT) / lh));
  const nLines = Math.max(...tokLine) + 1;
  const lens = toks.map((el) => el.textContent.length);
  const totalLen = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  const tokAt = lens.map((n) => { const at = T.streamA + (acc / totalLen) * (T.streamB - T.streamA); acc += n; return at; });
  const lineAt = Array.from({ length: nLines }, (_, k) => tokAt[tokLine.indexOf(k)]);
  const barH = bar.offsetHeight;
  const fieldAt = fields.map((el) => parseFloat(el.dataset.t));
  const aiFull = ai.offsetHeight, chipsEl = $('.chips2'), chipsCs = getComputedStyle(chipsEl);
  const chipsFull = chipsEl.offsetHeight + parseFloat(chipsCs.marginTop) + parseFloat(chipsCs.marginBottom);
  /* the chip rows, and when each starts (its first chip) */
  const rowTops = [...new Set(chips.map((c) => c.offsetTop))].sort((a, b) => a - b);
  const chipRowH = chips[0].offsetHeight;
  const rowGap = rowTops.length > 1 ? rowTops[1] - rowTops[0] - chipRowH : 0;
  const rowAt = rowTops.map((top) => { const c = chips.find((x) => x.offsetTop === top); return T.hl0 + (+c.dataset.i) * T.hlStep + 0.1; });
  const stepH = steps.map((el) => el.offsetHeight);
  const lbW = ris.map((el) => el.querySelector('.lb>span').offsetWidth);
  const viewH = view.clientHeight;
  const gap = parseFloat(getComputedStyle(thread).rowGap) || 10;
  barw.style.height = '0px';

  const BLUE = [20, 70, 173], INK2 = [79, 77, 73], INK = [45, 44, 41], AMBER = [154, 90, 0];
  const BOUNDS = [0, T.aiIn, T.replyIn, T.flag, T.approve];
  let approveBox = null;

  function seek(t) {
    const tt = t >= T.reset ? 0 : t;

    /* inquiry */
    const pInq = eo(seg(tt, T.inqIn, T.inqIn + 0.6));
    fadeUp(inq, pInq, 18, 0.985);
    hls.forEach((el) => {
      const i = +el.dataset.i, p = eo(seg(tt, T.hl0 + i * T.hlStep, T.hl0 + i * T.hlStep + 0.32));
      el.style.backgroundSize = `${r3(p * 100)}% 100%`;
      el.style.color = mix(INK, BLUE, p);
    });

    /* AI reads it */
    const pAi = eo(seg(tt, T.aiIn, T.aiIn + 0.45));
    fadeUp(ai, pAi, 14);
    swap(rd, ok, tt, T.aiDone);
    rd.querySelector('.spin').style.transform = `rotate(${Math.round(tt * 400) % 360}deg)`;
    rdTxt.style.backgroundPosition = `${r3(100 - ((tt * 0.9) % 1) * 140)}% 0`;
    chips.forEach((el) => {
      const i = +el.dataset.i, a = T.hl0 + i * T.hlStep + 0.14;
      const p = seg(tt, a, a + 0.42);
      el.style.opacity = r3(eo(seg(tt, a, a + 0.22)));
      el.style.transform = `scale(${r3(lerp(0.86, 1, back(p)))})`;
    });
    steps.forEach((el, i) => {
      const a = T.st0 + i * T.stStep;
      fadeUp(el, eo(seg(tt, a, a + 0.3)), 6);
      const pc = seg(tt, a + 0.32, a + 0.62);
      const sp = el.querySelector('.spin'), ck = el.querySelector('.ck');
      sp.style.opacity = r3(1 - eo(seg(tt, a + 0.3, a + 0.42)));
      sp.style.transform = `rotate(${Math.round(tt * 420 + i * 70) % 360}deg)`;
      ck.style.opacity = r3(eo(seg(tt, a + 0.32, a + 0.44)));
      ck.style.transform = `scale(${r3(lerp(0.4, 1, back(pc)))})`;
    });
    const rowsH = rowTops.reduce((h, _, r) => h + (chipRowH + (r ? rowGap : 0)) * eo(seg(tt, rowAt[r] - 0.04, rowAt[r] + 0.26)), 0);
    const chipsH = (chipsFull - rowTops.length * chipRowH - (rowTops.length - 1) * rowGap) * eo(seg(tt, T.hl0 - 0.05, T.hl0 + 0.25)) + rowsH;
    const stepsH = steps.reduce((h, el, i) => h + stepH[i] * eo(seg(tt, T.st0 + i * T.stStep - 0.04, T.st0 + i * T.stStep + 0.26)), 0);
    ai.style.height = r3(aiFull - chipsFull - stepH.reduce((a, b) => a + b, 0) + chipsH + stepsH) + 'px';

    /* reply streams in */
    const pRe = eo(seg(tt, T.replyIn, T.replyIn + 0.45));
    fadeUp(reply, pRe, 14);
    let last = -1;
    toks.forEach((el, i) => {
      const p = seg(tt, tokAt[i], tokAt[i] + 0.16);
      el.style.opacity = r3(eo(p));
      if (p > 0) last = i;
    });
    let h = padT + padB;
    for (let k = 0; k < nLines; k++) h += lh * eo4(seg(tt, lineAt[k] - 0.02, lineAt[k] + 0.2));
    mailw.style.height = r3(Math.max(h, padT + padB + lh * eo(seg(tt, T.replyIn, T.replyIn + 0.3)))) + 'px';
    const streaming = tt >= T.streamA && tt < T.streamB + 0.5;
    if (last >= 0 && streaming) {
      const tr = toks[last].getClientRects(), lastR = tr[tr.length - 1], base = reply.getBoundingClientRect();
      caret.style.left = r3(lastR.right - base.left + 1) + 'px';
      caret.style.top = r3(lastR.top - base.top + (lastR.height - 17) / 2) + 'px';
      caret.style.opacity = r3(1 - eo(seg(tt, T.streamB + 0.15, T.streamB + 0.45)));
    } else caret.style.opacity = 0;
    swap(tags[0], tags[1], tt, T.barIn, 0, true);
    if (tt >= T.approve) swap(tags[1], tags[2], tt, T.approve + 0.1, 0, true);
    else tags[2].style.opacity = 0;

    /* the chat follows its newest card up, as a phone chat scrolls */
    const pad = 14;
    const inqB = inq.offsetTop + inq.offsetHeight, aiB = ai.offsetTop + ai.offsetHeight, reB = reply.offsetTop + reply.offsetHeight;
    let bottom = lerp(0, inqB, pInq);
    bottom = lerp(bottom, aiB, pAi);
    bottom = lerp(bottom, reB, pRe);
    const over = Math.max(0, bottom + pad - viewH);
    thread.style.transform = `translateY(${r3(-over)}px)`;
    void gap;

    /* the Sales Workbench opens as a sheet and the PI fills in */
    const ps = eo4(seg(tt, T.sheetIn, T.sheetIn + 0.55));
    sheet.style.transform = `translateY(${r3((1 - ps) * 102)}%)`;
    dim.style.background = `rgba(15,23,42,${r3(0.16 * ps)})`;
    document.body.style.setProperty('--sh', `${r3(lerp(-60, 160, (tt * 0.85) % 1))}%`);
    fields.forEach((el, i) => el.style.setProperty('--p', r3(eo(seg(tt, fieldAt[i], fieldAt[i] + 0.35)))));
    total.textContent = usd(2100 * eo(seg(tt, T.piTot, T.piTot + 0.6)));
    amts.forEach((el, i) => { const at = (i ? T.piRow2 : T.piRow1) + 0.16; el.textContent = usd(+el.dataset.v * eo(seg(tt, at, at + 0.45))); });

    /* price check → approval bar */
    const pf = eo(seg(tt, T.flag, T.flag + 0.35));
    const pulse = seg(tt, T.flag, T.flag + 0.7);
    unit1.style.background = `rgba(251,234,204,${r3(pf)})`;
    unit1.style.color = mix([28, 28, 30], AMBER, pf);
    unit1.style.fontWeight = pf > 0.5 ? 650 : 400;
    unit1.style.boxShadow = pulse > 0 && pulse < 1 ? `0 0 0 ${r3(eo(pulse) * 8)}px rgba(224,154,26,${r3(0.35 * (1 - pulse))})` : 'none';
    const pb = eo4(seg(tt, T.barIn, T.barIn + 0.5));
    barw.style.height = r3(barH * pb) + 'px';
    /* the sheet scrolls as the bar opens, so the bar and its buttons are in view */
    piCard.style.transform = `translateY(${r3(-Math.max(0, piCard.offsetHeight + 4 - mscroll.clientHeight))}px)`;
    const pa = eo(seg(tt, T.approve, T.approve + 0.35));
    bar.style.background = pa > 0 ? mix([253, 246, 233], [236, 247, 240], pa) : 'rgb(253,246,233)';
    bar.style.borderTopColor = mix([241, 226, 198], [207, 233, 216], pa);
    swap(pend, done, tt, T.approve, 6);
    swap(icoW, icoA, tt, T.approve, 0, true);
    icoA.style.transform = `scale(${r3(lerp(0.5, 1, back(seg(tt, T.approve + 0.12, T.approve + 0.5))))})`;
    swap(btns, sent, tt, T.approve + 0.02, 0, true);
    const press = seg(tt, T.tap - 0.04, T.tap + 0.2);
    const sq = press > 0 && press < 1 ? Math.sin(press * Math.PI) : 0;
    approve.style.transform = `scale(${r3(1 - 0.06 * sq)})`;
    approve.style.filter = sq ? `brightness(${r3(1 - 0.12 * sq)})` : 'none';
    const pr = seg(tt, T.tap, T.tap + 0.6);

    /* where the button is once the sheet is up and the bar is open (measured the first time it is) */
    if (!approveBox && ps >= 1 && pb >= 1) {
      const a = approve.getBoundingClientRect(), b = bar.getBoundingClientRect();
      approveBox = { left: a.left, x: a.left + a.width / 2, y: a.top + a.height / 2, rx: a.left + a.width / 2 - b.left, ry: a.top + a.height / 2 - b.top };
      ripple.style.left = approveBox.rx + 'px';
      ripple.style.top = approveBox.ry + 'px';
    }
    ripple.style.opacity = approveBox && pr > 0 && pr < 1 ? r3(1 - eo(pr)) : 0;
    ripple.style.transform = `scale(${r3(lerp(0.35, 1.5, eo(pr)))})`;

    /* the manager's cursor, from below left onto the button's icon */
    if (approveBox) {
      const pc = eio(seg(tt, T.curIn, T.curIn + T.curGlide));
      const P1 = { x: approveBox.left + 12, y: approveBox.y + 7 }, P0 = { x: P1.x - 150, y: P1.y + 120 }, C = { x: P1.x - 24, y: P1.y + 110 };
      const bx = (1 - pc) * (1 - pc) * P0.x + 2 * (1 - pc) * pc * C.x + pc * pc * P1.x;
      const by = (1 - pc) * (1 - pc) * P0.y + 2 * (1 - pc) * pc * C.y + pc * pc * P1.y;
      const drift = eio(seg(tt, T.tap + 0.18, T.curOut + 0.4));
      const pt = seg(tt, T.tap - 0.04, T.tap + 0.22);
      const cs = pt > 0 && pt < 1 ? 1 - 0.14 * Math.sin(pt * Math.PI) : 1;
      cur.style.transform = `translate(${r3(bx - drift * 48 - 3)}px, ${r3(by + drift * 10 - 2)}px) scale(${r3(cs)})`;
      cur.style.opacity = r3(eo(seg(tt, T.curIn, T.curIn + 0.3)) * (1 - eo(seg(tt, T.curOut, T.curOut + 0.4))));
    } else cur.style.opacity = 0;

    /* step rail: the current step's name opens, the others are numbers */
    const k = BOUNDS.filter((b) => tt >= b).length - 1;
    const pk = eio(seg(tt, BOUNDS[k], BOUNDS[k] + 0.4));
    ris.forEach((el, i) => {
      const act = i === k ? (k ? pk : 1) : i === k - 1 ? 1 - pk : 0;
      const dn = i < k ? (i === k - 1 ? pk : 1) : 0;
      el.style.color = dn > 0 ? mix(BLUE, INK2, dn) : mix([91, 107, 132], BLUE, act);
      el.style.background = `rgba(255,255,255,${r3(act)})`;
      el.style.boxShadow = act > 0.01 ? `0 6px 16px -6px rgba(29,78,216,${r3(0.45 * act)}), inset 0 0 0 1px rgba(37,99,235,${r3(0.2 * act)})` : 'none';
      el.querySelector('.lb').style.maxWidth = r3(lbW[i] * act) + 'px';
      el.querySelector('.lb').style.opacity = r3(act);
      el.querySelector('.act').style.opacity = r3(act * (1 - dn));
      el.querySelector('.dn').style.opacity = r3(dn);
      el.querySelector('.num').style.opacity = r3(1 - Math.max(act, dn));
    });
    rail.style.opacity = 1;

    /* end card, then back to frame 0 */
    let va, blur;
    if (t < T.reset) {
      va = 0.62 * eo(seg(t, T.endIn, T.endIn + 0.5)) + 0.38 * eio(seg(t, T.veilOpaque, T.reset));
      blur = 12 * eo(seg(t, T.endIn, T.endIn + 0.5));
    } else { va = 1 - eio(seg(t, T.reset + 0.05, D)); blur = 0; }
    veil.style.background = `rgba(244,247,253,${r3(va)})`;
    veil.style.backdropFilter = veil.style.webkitBackdropFilter = blur > 0.01 ? `blur(${r3(blur)}px)` : 'none';
    const pe = eo(seg(t, T.endIn + 0.12, T.endIn + 0.62)) * (1 - eo(seg(t, T.endOut, T.endOut + 0.28)));
    end.style.opacity = r3(pe);
    end.style.transform = `translateY(${r3((1 - eo(seg(t, T.endIn + 0.12, T.endIn + 0.7))) * 14)}px) scale(${r3(lerp(0.97, 1, eo(seg(t, T.endIn + 0.12, T.endIn + 0.7))))})`;
    [eb, l1, l2, lock].forEach((el, i) => {
      const a = T.endIn + 0.2 + i * 0.12;
      fadeUp(el, eo(seg(t, a, a + 0.5)), 10);
    });
  }

  /** Layout problems at time t: clipped, overflowing, overlapping or too small text. */
  function check(t) {
    seek(t);
    const out = [];
    const win = $('#win').getBoundingClientRect();
    const shown = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) if (+getComputedStyle(e).opacity < 0.05) return false; return el.getClientRects().length > 0; };
    /* text size: every text that is on screen */
    const tw = document.createTreeWalker($('#win'), NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement, fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < MINF - 0.01 && shown(el)) out.push(`text below ${MINF}px (${fs}px): ${n.textContent.trim().slice(0, 30)}`);
    }
    if (+getComputedStyle(cur).opacity > 0.01) for (const el of [cur.querySelector('svg'), cur.querySelector('.who')]) {
      const r = el.getBoundingClientRect();
      if (r.left < win.left || r.right > win.right || r.bottom > win.bottom) out.push('cursor or its name tag outside the frame');
    }
    for (const el of $$('.card, .steps, .vbar, .endc, .chips2, .ch, .pi-head, .pi-parties, .mi, .tot, .vbar .btxt, .inq p, .mail, .step, .mbar, .mtab')) {
      if (el.scrollWidth > el.clientWidth + 1) out.push(`overflows sideways: ${el.className} (${el.scrollWidth} > ${el.clientWidth})`);
    }
    const chipTops = new Set(chips.map((c) => c.offsetTop));
    if (chipTops.size > 3) out.push(`chips wrap to ${chipTops.size} rows`);
    for (const el of $$('.btn, .tag, .chip2, .vbadge, .sent, .mtab, .ri .lb>span, .mi2 .f, .tot .f')) {
      const cs = getComputedStyle(el);
      const lhh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
      if (el.getClientRects().length > 1 || el.getBoundingClientRect().height > Math.max(lhh * 1.5, parseFloat(cs.height) + 1 || 0)) out.push(`wraps: ${el.textContent.trim().slice(0, 40)}`);
    }
    /* the PI and its bar inside the sheet, once both are there */
    if (t >= T.barIn + 0.5 && t < T.endIn) {
      const sb = mscroll.getBoundingClientRect(), bb = barw.getBoundingClientRect(), hb = $('.pi .tot').getBoundingClientRect();
      if (bb.bottom > sb.bottom + 0.5) out.push(`sheet: the approval bar is cut off by ${Math.ceil(bb.bottom - sb.bottom)}px`);
      if (hb.top < sb.top) out.push('sheet: the total is scrolled out of view');
    }
    /* the newest chat card is on screen before the sheet covers the chat */
    if (t < T.sheetIn) {
      const vb = view.getBoundingClientRect();
      const lastShown = [reply, ai, inq].find((el) => +getComputedStyle(el).opacity > 0.5);
      if (lastShown && lastShown.getBoundingClientRect().bottom > vb.bottom + 1) out.push('chat: the newest card runs below the frame');
    }
    const rr = rail.getBoundingClientRect();
    for (const el of ris) { const r = el.getBoundingClientRect(); if (r.left < rr.left + 4 || r.right > rr.right - 4) out.push('rail wider than the frame'); }
    const ec = end.getBoundingClientRect(), ew = $('.endw').getBoundingClientRect();
    if (ec.width > ew.width - 24 || ec.height > ew.height - 24) out.push('end card too big');
    return out;
  }

  window.__seek = seek;
  window.__check = check;
  /* settle the measurements that need the sheet and the bar open */
  seek(T.barIn + 1);
  seek(0);
  return true;
}

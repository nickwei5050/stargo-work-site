/**
 * OPEN WORK scenes — an HTML rebuild of the owner's OPEN WORK chat workspace
 * (sidebar + chat, from the owner's screenshot of 2026-10-09).
 *
 * Layout, labels, the app list, the quick actions and the composer footnote
 * match the real interface. Everything inside a conversation is
 * DEMONSTRATION DATA: fictional buyers and companies, prices and counts made
 * up for the picture. The pages that show these renders say so (「演示数据」
 * badge + alt text), and the PI itself is labelled 「形式发票 · 演示数据」.
 *
 * This module only builds HTML strings. tools/openwork/render.mjs writes them
 * into .wrangler/openwork/, screenshots them and encodes the WebP files.
 *
 * Modes (classes on <body>):
 *   (none)   the full app at 1280×880 CSS px — sidebar, title bar, thread, composer
 *   focus    no sidebar, no title bar, no composer: one or more cards on the
 *            workspace ground, for desktop crops (PI check, approval bar …)
 *   narrow   focus + phone typography (15px body) and phone layouts of the
 *            tables, for the 390 CSS px @3x phone cards
 */

/* Sidebar, verbatim from the real interface. */
export const APPS = [
  ['chart-column', '老板看板'], ['zap', '自动化中心'], ['users', '客户CRM'], ['book-open', '企业知识库'],
  ['sparkles', '主动获客'], ['briefcase', '销售工作台'], ['building-2', '企业ERP'], ['chart-line', '增长分析'],
  ['refresh-cw', '工作流引擎'], ['inbox', '渠道接入'], ['shopping-bag', '商城后端管理'], ['settings', '控制中心'],
  ['lightbulb', '记忆与进化'], ['sliders-horizontal', 'STARGO AI 数字办公室'], ['ticket', 'New API（AI 网关）'],
];
/* The real composer footnote. Keep it exactly. */
export const FOOTNOTE = '工具操作遵循当前授权；外部客户发送未启用。';

/* Chat history: business titles instead of the test account's 「你好」 / 「[TEST] E2E…」. */
const HISTORY = ['Nordhem Living · 询盘', 'Kotikulma 样品寄送', '本周业务简报', 'Brattberg 账期申请', '广交会名片整理'];
const WHEN = ['刚刚', '2 小时', '昨天', '2 天', '3 天'];
/** Five rows: the active chat on top (刚刚), then the history without it. */
function chats(active) {
  const titles = active ? [active, ...HISTORY.filter(t => t !== active)].slice(0, 5) : HISTORY;
  return titles.map((t, i) => [t, WHEN[i]]);
}

export function css({ interCss, notoDir }) {
  return `
@import url('file://${interCss}');
@import url('file://${notoDir}400.css');
@import url('file://${notoDir}500.css');
@import url('file://${notoDir}600.css');
@import url('file://${notoDir}700.css');
:root{--side:#efedea;--main:#f6f4f0;--line:#e3dfd9;--ink:#1c1c1e;--ink2:#4f4d49;--ink3:#8a8782;--sel:#e2dfda;--blue:#1756d6;--card:#fcfbf9;--ok:#1f8a4c;--warn:#b26a00}
*{box-sizing:border-box}
html,body{margin:0}
body{font-family:'Inter Variable','Noto Sans SC',sans-serif;font-feature-settings:'cv11','ss01';-webkit-font-smoothing:antialiased;color:var(--ink);font-size:13px;line-height:1.5;background:var(--main)}
.app{display:flex;width:100vw;height:100vh;background:var(--main);overflow:hidden}
.i{width:16px;height:16px;flex:none;stroke-width:1.9}
.side{width:236px;flex:none;background:var(--side);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:10px 8px 0}
.brand{display:flex;align-items:center;justify-content:space-between;height:38px;padding:0 6px 0 8px;margin-bottom:6px}
.brand b{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:700;letter-spacing:.02em;color:#141a33}
.brand .spark{width:15px;height:15px}
.iconbtn{width:28px;height:28px;border-radius:7px;display:grid;place-items:center;color:var(--ink2);border:1px solid var(--line);background:#f6f4f1}
.iconbtn .i{width:15px;height:15px}
.nav{display:flex;align-items:center;gap:9px;height:29px;padding:0 9px;border-radius:7px;color:#26252a;white-space:nowrap}
.nav .i{color:#2b2a2f;width:15px;height:15px}
.nav kbd{margin-left:auto;font:inherit;font-size:11.5px;color:var(--ink3)}
.label{display:flex;align-items:center;gap:4px;height:26px;padding:0 9px;margin-top:8px;font-size:12px;color:var(--ink3)}
.label .i{width:12px;height:12px}
.label .r{margin-left:auto;color:var(--ink2)}
.hint{padding:2px 9px 6px;font-size:11.5px;color:var(--ink3);line-height:1.55}
.chat{display:flex;align-items:center;height:28px;padding:0 9px 0 24px;border-radius:7px;color:#2b2a2f;white-space:nowrap}
.chat span{overflow:hidden;text-overflow:ellipsis;max-width:150px}
.chat em{margin-left:auto;font-style:normal;font-size:11.5px;color:var(--ink3)}
.chat.sel{background:var(--sel)}
.more{padding:0 9px 0 32px;height:26px;display:flex;align-items:center;font-size:12px;color:var(--ink2)}
.me{margin-top:auto;border-top:1px solid var(--line);display:flex;align-items:center;gap:10px;padding:12px 8px 14px;margin-left:-8px;margin-right:-8px;padding-left:16px}
.me i{width:30px;height:30px;border-radius:50%;background:#16161a;color:#fff;display:grid;place-items:center;font-style:normal;font-weight:600;font-size:13px}
.me b{display:block;font-size:13px}
.me small{display:block;font-size:11.5px;color:var(--ink3);line-height:1.2}
.main{flex:1;display:flex;flex-direction:column;min-width:0;position:relative}
.top{height:46px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 14px 0 18px}
.top b{font-weight:600;font-size:13px}
.stage{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;align-items:center}
.col{width:780px;max-width:calc(100% - 64px)}
.hello{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-bottom:40px}
.hello h1{font-size:25px;font-weight:700;margin:0 0 150px;letter-spacing:.01em}
.composer{width:100%;border:1px solid #dcd8d1;background:#faf9f6;border-radius:14px;padding:12px 12px 12px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 2px rgba(30,25,20,.04)}
.composer .ph{flex:1;color:#8f8c86;font-size:14px}
.send{width:34px;height:34px;border-radius:9px;background:var(--blue);display:grid;place-items:center;color:#fff}
.send .i{width:17px;height:17px;stroke-width:2.4}
.foot{margin:8px 0 0;text-align:center;font-size:11.5px;color:var(--ink3)}
.addrow{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:26px;font-size:12px;color:var(--ink3)}
.addrow b{display:flex;align-items:center;gap:5px;color:var(--ink);font-weight:600;font-size:12.5px}
.addrow b .i{width:14px;height:14px}
.chips{display:flex;flex-wrap:nowrap;justify-content:center;gap:8px;margin:16px -80px 0}
.chip{display:flex;align-items:center;gap:6px;height:32px;padding:0 13px;border:1px solid #dcd8d1;border-radius:999px;background:#faf9f6;font-size:12.5px;color:#26252a;white-space:nowrap}
.chip .i{width:14px;height:14px}
/* conversation */
.thread{flex:1;min-height:0;overflow:hidden;padding:14px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.msg-u{align-self:flex-end;max-width:560px;width:fit-content;background:#e9e6e1;border-radius:18px;padding:10px 16px;margin:0 0 16px auto;font-size:13.5px;line-height:1.6}
.quote{margin-top:8px;padding:8px 12px;border-left:3px solid #c9c4bc;background:#f3f1ed;border-radius:6px;font-size:12.5px;color:#3c3a36;line-height:1.6}
.msg-a{font-size:13.5px;line-height:1.7}
.msg-a p{margin:0 0 10px;text-wrap:pretty}
.nb{white-space:nowrap}
.msg-a p.note{color:var(--ink3);font-size:12.5px}
.steps{border:1px solid var(--line);border-radius:11px;background:var(--card);padding:8px 14px;margin-bottom:12px}
.steps .h{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink2);font-weight:500;padding-bottom:4px}
.steps .h .i{width:14px;height:14px}
.step{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;color:#3a3935;padding:2.5px 0}
.step .i{width:14px;height:14px;margin-top:3px;color:var(--ok)}
.step.warn .i{color:var(--warn)}
.step small{color:var(--ink3);font-size:12px}
.card{border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden;margin-bottom:12px}
.card .ch{display:flex;align-items:center;gap:8px;padding:9px 14px;border-bottom:1px solid var(--line);font-weight:600;font-size:12.5px}
.card .ch .i{width:15px;height:15px;color:var(--ink2)}
.card .ch .tag{margin-left:auto}
.kv{display:grid;grid-template-columns:64px 1fr 64px 1fr;gap:6px 14px;padding:11px 14px;font-size:12.5px;margin:0}
.kv dt{color:var(--ink3)}
.kv dd{margin:0}
.mail{padding:11px 16px;font-size:12.5px;line-height:1.65;color:#2d2c29;white-space:pre-line}
.bar{display:flex;align-items:center;gap:8px;padding:9px 12px 9px 14px;border-top:1px solid var(--line);background:#f4f2ee;font-size:12px;color:var(--ink2)}
.bar>.i{width:15px;height:15px;color:var(--blue)}
.bar .sp{flex:1}
.bar .btns{display:flex;gap:8px;margin-left:auto}
.btn{white-space:nowrap;flex:none;height:28px;padding:0 12px;border-radius:8px;border:1px solid #d8d4cd;background:#fff;display:flex;align-items:center;gap:6px;font-size:12px;color:#26252a;font-weight:500}
.btn .i{width:13px;height:13px;color:inherit}
.btn.pri{background:var(--blue);border-color:var(--blue);color:#fff}
.tag{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap;flex:none}
.tag.a{background:#e3f1e8;color:#16723e}
.tag.w{background:#fbefd9;color:#9a5a00}
.tag.b{background:#e5edfb;color:#1446ad}
.tag.g{background:#eeece8;color:#5d5a55}
table{width:100%;border-collapse:collapse;font-size:12.3px}
th{font-weight:500;color:var(--ink3);text-align:left;padding:7px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:7px 14px;border-bottom:1px solid #ece9e4;white-space:nowrap;vertical-align:top}
tr:last-child td{border-bottom:0}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
td small{display:block;color:var(--ink3);font-size:.92em;white-space:normal}
.pi-head{display:flex;justify-content:space-between;gap:12px;padding:13px 16px 6px}
.pi-head b{font-size:15px;letter-spacing:.06em}
.pi-head .no{font-size:13px;letter-spacing:0}
.pi-head small{display:block;color:var(--ink3);font-size:11.5px}
.pi-parties{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:6px 16px 10px;font-size:12px;color:#3a3935}
.pi-parties span{display:block;color:var(--ink3);font-size:11px}
.tot{display:flex;justify-content:flex-end;align-items:baseline;gap:24px;padding:9px 16px;border-top:1px solid var(--line);font-size:12.5px}
.tot b{font-size:14px}
.terms{padding:0 16px 11px;font-size:11.8px;color:var(--ink2)}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
.metric{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:10px 14px}
.metric span{display:block;font-size:11.8px;color:var(--ink3)}
.metric b{display:block;font-size:22px;font-weight:650;letter-spacing:-.01em;margin-top:1px;line-height:1.3;font-variant-numeric:tabular-nums}
.metric em{font-style:normal;font-size:11.5px;color:var(--ok)}
.metric em.w{color:var(--warn)}
.mix{padding:10px 14px 11px}
.mix .t{display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);margin-bottom:7px}
.mix .t b{font-weight:600;color:var(--ink)}
.stack{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px}
.stack i{display:block;height:100%}
.legend{display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:8px;font-size:12px;color:#3a3935}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:9px;height:9px;border-radius:3px;display:block}
.legend b{font-weight:600;font-variant-numeric:tabular-nums}
.todo{padding:4px 14px 6px}
.todo>div{display:flex;align-items:center;gap:9px;padding:6px 0;font-size:12.5px;border-bottom:1px solid #ece9e4}
.todo>div:last-child{border-bottom:0}
.todo .i{width:14px;height:14px;color:var(--warn)}
.todo .tx{flex:1;min-width:0}
.todo .tx small{color:var(--ink3);font-size:12px}
.todo .btn{min-width:64px;justify-content:center}
.fups{padding:2px 14px}
.fup{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid #ece9e4}
.fup:last-child{border-bottom:0}
.fup>.i{width:15px;height:15px;margin-top:2px;color:var(--warn)}
.fup .bd{flex:1;min-width:0}
.fup .hd{display:flex;align-items:center;gap:8px;font-size:12.5px}
.fup .hd b{font-weight:600}
.fup .hd small{color:var(--ink3);font-size:12px}
.fup .hd .tag{margin-left:auto}
.fup .why{font-size:12px;color:#9a5a00;margin-top:1px}
.fup .draft{margin-top:4px;padding:5px 10px;border-left:2px solid #d5d0c8;background:#f3f1ed;border-radius:4px;font-size:12px;color:#3c3a36;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dock{width:100%;flex:none;display:flex;flex-direction:column;align-items:center;padding:6px 0 14px;background:linear-gradient(to bottom,rgba(246,244,240,0),var(--main) 30%)}
.only-n{display:none}
/* focus: cards on the workspace ground, no chrome */
.shot{padding:20px;background:var(--main)}
.shot>:last-child,.shot .msg-a>:last-child{margin-bottom:0}
body.focus .shot .msg-a{font-size:13.5px}
/* narrow: phone typography and phone layouts */
body.narrow{font-size:15px}
body.narrow .only-w{display:none}
body.narrow .only-n{display:revert}
body.narrow .shot{padding:14px 12px}
body.narrow .card{border-radius:14px}
body.narrow .card .ch{font-size:15px;padding:12px 14px;gap:9px}
body.narrow .card .ch .i{width:17px;height:17px}
body.narrow .tag{height:24px;font-size:12.5px;padding:0 10px}
body.narrow .mail{font-size:15px;line-height:1.6;padding:13px 15px}
body.narrow .bar{flex-wrap:wrap;font-size:14px;padding:12px 14px;row-gap:10px;line-height:1.45}
body.narrow .bar>.i{width:17px;height:17px}
body.narrow .bar .sp{display:none}
body.narrow .bar{align-items:flex-start}
body.narrow .bar>.i{margin-top:2px}
body.narrow .bar .msg{flex:1;min-width:0;text-wrap:balance}
body.narrow .bar .btns{width:100%;justify-content:flex-end}
body.narrow .btn{height:38px;font-size:14.5px;padding:0 15px;border-radius:10px}
body.narrow .btn .i{width:15px;height:15px}
body.narrow table{font-size:14.5px}
body.narrow th{padding:9px 12px;font-size:13px}
body.narrow td{padding:10px 12px}
body.narrow td:first-child,body.narrow th:first-child{padding-left:14px}
body.narrow td:last-child,body.narrow th:last-child{padding-right:14px}
body.narrow td small{font-size:13px;margin-top:2px}
body.narrow td.w{white-space:normal;text-wrap:balance}
body.narrow td small{white-space:normal;text-wrap:pretty}
body.narrow td small .sig{color:var(--ink2)}
body.narrow .pi-head{padding:14px 14px 6px;flex-direction:column;gap:6px}
body.narrow .pi-head>div:last-child{text-align:left!important;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
body.narrow .pi-head b{font-size:16px}
body.narrow .pi-head .no{font-size:14px}
body.narrow .pi-head small{font-size:12.5px}
body.narrow .pi-parties{font-size:13.5px;padding:8px 14px 12px;gap:12px}
body.narrow .pi-parties span{font-size:12px}
body.narrow .tot{font-size:14px;padding:11px 14px;gap:16px}
body.narrow .tot b{font-size:16px}
body.narrow .terms{font-size:13.5px;padding:0 14px 12px;line-height:1.5}
body.narrow .metrics{grid-template-columns:1fr 1fr;gap:10px}
body.narrow .metric{padding:12px 14px;border-radius:14px}
body.narrow .metric span{font-size:13.5px}
body.narrow .metric b{font-size:26px}
body.narrow .metric em{font-size:13px}
body.narrow .todo{padding:2px 14px 4px}
body.narrow .todo>div{font-size:15px;padding:11px 0;align-items:flex-start;gap:10px}
body.narrow .todo .i{width:17px;height:17px;margin-top:3px}
body.narrow .todo .tx small{display:block;font-size:13.5px;margin-top:1px}
body.narrow .todo .btn{margin-top:1px}
body.narrow .fups{padding:2px 14px}
body.narrow .fup{padding:12px 0;gap:10px}
body.narrow .fup>.i{width:17px;height:17px;margin-top:3px}
body.narrow .fup .hd{font-size:15px;flex-wrap:wrap}
body.narrow .fup .hd small{font-size:13.5px}
body.narrow .fup .why{font-size:13.5px;margin-top:2px}
body.narrow .steps{padding:11px 14px 9px;border-radius:14px}
body.narrow .steps .h{font-size:14px;gap:8px;padding-bottom:6px}
body.narrow .steps .h .i{width:16px;height:16px}
body.narrow .step{font-size:15px;line-height:1.5;padding:5px 0;gap:9px}
body.narrow .step .i{width:16px;height:16px;margin-top:3px}
body.narrow .step small{display:block;font-size:13.5px;line-height:1.45;margin-top:1px}
body.narrow .step small .dot{display:none}
body.narrow .msg-a>p{font-size:15px;line-height:1.6}
body.narrow .msg-u{font-size:15px;max-width:none;padding:11px 16px;border-radius:18px}
body.narrow .pi-head + .tot{border-top:1px solid var(--line)}
/* an excerpt of a long draft: the first lines, fading out */
.mail.excerpt{max-height:7.4em;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 55%,transparent);mask-image:linear-gradient(180deg,#000 55%,transparent)}
body.narrow .mail.excerpt{max-height:9.6em}
/* focus conversation: the chat column alone, no sidebar, no title bar, no composer */
body.convo .shot{padding:22px 20px 20px}
body.convo .msg-u{margin-left:auto}
body.narrow .fup .draft{font-size:13.5px;white-space:normal;text-wrap:pretty;overflow:visible;line-height:1.5;padding:7px 11px;margin-top:7px}
`;
}

export function scenes(icon) {
  const sidebar = (active) => `<aside class="side">
  <div class="brand" data-hot="brand"><b>${icon('sparkle', 'spark').replace('stroke="currentColor"', 'stroke="#1756d6" fill="#1756d6"')}OPEN WORK</b><span class="iconbtn">${icon('panel-left')}</span></div>
  <div class="nav">${icon('square-pen')}新聊天</div>
  <div class="nav">${icon('search')}搜索<kbd>Ctrl K</kbd></div>
  <div class="nav">${icon('puzzle')}插件</div>
  <div class="label">${icon('chevron-down')}应用</div>
  ${APPS.map(([ic, name], i) => `<div class="nav"${i === APPS.length - 1 ? ' data-hot="last-app"' : ''}>${icon(ic)}${name}</div>`).join('\n  ')}
  <div class="label">项目<span class="r">${icon('folder-plus')}</span></div>
  <div class="hint">项目把相关聊天放在一起。点上面的 + 新建。</div>
  <div class="label">聊天</div>
  ${chats(active).map(([t, when], i) => `<div class="chat${active && i === 0 ? ' sel' : ''}"><span>${t}</span><em>${when}</em></div>`).join('\n  ')}
  <div class="more">展开显示（还有 7）</div>
  <div class="me"><i>演</i><div><b>演示账号</b><small>外贸部 · 演示</small></div></div>
</aside>`;

  const composer = (ph = '输入消息，或输入 / 选择操作') => `<div class="composer"><span class="ph">${ph}</span><span class="send">${icon('arrow-up')}</span></div>
<p class="foot">${FOOTNOTE}</p>`;

  const doc = (title, mode, body) => `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>OPEN WORK — ${title}</title><link rel="stylesheet" href="openwork.css"></head><body${mode ? ` class="${mode}"` : ''}>
${body}
</body></html>`;

  /** The full app: sidebar + title bar + thread + composer. */
  const app = (title, body, { home = false } = {}) => doc(title, '', `<div class="app">${sidebar(home ? null : title)}
<main class="main">
  <div class="top"><b>${home ? '新聊天' : title}</b><span class="iconbtn">${icon('panel-right')}</span></div>
  ${home ? body : `<div class="stage"><div class="thread"><div class="col">${body}</div></div><div class="dock"><div class="col">${composer('继续追问，或输入 / 选择操作')}</div></div></div>`}
</main></div>`);
  /** Cards only, on the workspace ground, `width` CSS px wide (focus or narrow mode). */
  const shot = (title, mode, width, body) => doc(title, mode, `<div class="shot" style="width:${width}px"><div class="msg-a">${body}</div></div>`);

  const steps = (head, list) => `<div class="steps" data-hot="steps"><div class="h">${icon('circle-check')}${head}</div>
${list.map(([t, sub, warn, hot]) => `<div class="step${warn ? ' warn' : ''}"${hot ? ` data-hot="${hot}"` : ''}>${icon(warn ? 'triangle-alert' : 'check')}<div>${t}${sub ? ` <small><span class="dot">· </span>${sub}</small>` : ''}</div></div>`).join('\n')}</div>`;
  const bar = (msg, buttons) => `<div class="bar" data-hot="bar">${icon('shield-check')}<span class="msg">${msg}</span><span class="sp"></span><span class="btns">${buttons}</span></div>`;
  const btn = (label, ic, pri = false, hot = '') => `<span class="btn${pri ? ' pri' : ''}"${hot ? ` data-hot="${hot}"` : ''}>${ic ? icon(ic) : ''}${label}</span>`;

  /* ---- inquiry ---------------------------------------------------------- */
  const inquiryAsk = `<div class="msg-u">帮我分析这封询盘，并起草一封英文回复。
<div class="quote">Hi, we're a home-goods retailer in Sweden. Please quote 500 pcs of 500 ml vacuum flasks with our logo, delivered to Gothenburg before 20 Dec — price, MOQ and lead time. — Erik, Nordhem Living</div></div>`;
  const inquirySteps = steps('已完成 4 个步骤', [
    ['识别询盘要素', '产品、数量、定制、交期'],
    ['查询客户CRM', '新客户 · 瑞典 · 家居零售', false, 'crm'],
    ['检索企业知识库', 'SVF-500 规格、MOQ 300、标准交期 25 天', false, 'kb'],
    ['按价格表测算报价', 'FOB 宁波 · 含单色丝印', false, 'pricing'],
  ]);
  const inquiryFacts = `<div class="card" data-hot="facts"><div class="ch">${icon('clipboard-list')}关键信息<span class="tag a">可报价</span></div>
<dl class="kv"><dt>产品</dt><dd>SVF-500 保温杯 500 ml · 304</dd><dt>数量</dt><dd>500 只（MOQ 300）</dd><dt>定制</dt><dd>单色丝印 logo · 打样 5 天</dd><dt>报价</dt><dd data-hot="price">US$ 3.85 / 只 · FOB 宁波</dd><dt>交期</dt><dd>大货 25 天 + 海运约 32 天</dd><dt>客户</dt><dd>新客户 · 已建档到客户CRM</dd></dl></div>`;
  const inquiryReply = `<div class="card" data-hot="reply"><div class="ch">${icon('mail')}回复草稿 · English</div>
<div class="mail">Hi Erik,
Thanks for your inquiry. 500 pcs of our <span class="nb">SVF-500</span> vacuum flask (500 ml, 304 stainless) with your logo in one colour: <span class="nb">US$ 3.85/pc</span> FOB Ningbo. MOQ 300; samples 5 days, production 25 days. To reach Gothenburg before 20 Dec we'd need your <span class="nb">go-ahead</span> by 8 Nov…</div>
${bar('<span class="nb">对外发送需要你确认</span>', btn('修改', 'pencil') + btn('复制', 'copy') + btn('批准', 'check', true, 'approve'))}</div>`;

  /* ---- quote / PI ------------------------------------------------------- */
  const quoteSteps = steps('已完成 3 个步骤', [
    ['读取客户与询盘上下文', '客户CRM · 销售工作台'],
    ['套用 PI 模板', '中英双语 · 公司抬头与银行信息'],
    ['价格校验', '单价低于标准价 4.2%，需要销售经理审批', true, 'pricecheck'],
  ]);
  const ITEMS = [
    ['SVF-500', 'Vacuum flask 500 ml, 304 SS, 1-colour logo', '500', '3.85', '1,925.00'],
    ['GB-01', 'Kraft gift box with insert', '500', '0.35', '175.00'],
  ];
  const piCard = `<div class="card" data-hot="pi">
<div class="pi-head"><div><b>PROFORMA INVOICE</b><small>形式发票 · 演示数据</small></div><div style="text-align:right"><b class="no">PI-2026-1108</b><small>2026-11-04 · 有效期 15 天</small></div></div>
<div class="pi-parties"><div><span>Seller</span>STARGO Demo Manufacturing Co., Ltd.<br>Ningbo, China</div><div><span>Buyer</span>Nordhem Living AB<br>Gothenburg, Sweden</div></div>
<table class="only-w"><thead><tr><th>Item</th><th>Description</th><th class="n">Qty</th><th class="n">Unit (USD)</th><th class="n">Amount (USD)</th></tr></thead><tbody>
${ITEMS.map(([c, d, q, u, a]) => `<tr><td>${c}</td><td>${d}</td><td class="n">${q}</td><td class="n">${u}</td><td class="n">${a}</td></tr>`).join('\n')}
</tbody></table>
<table class="only-n"><thead><tr><th>Item</th><th class="n">Qty × Unit</th><th class="n">USD</th></tr></thead><tbody>
${ITEMS.map(([c, d, q, u, a]) => `<tr><td class="w">${c}<small>${d}</small></td><td class="n">${q} × ${u}</td><td class="n">${a}</td></tr>`).join('\n')}
</tbody></table>
<div class="tot"><span>FOB Ningbo</span><span>Total <b>US$ 2,100.00</b></span></div>
<div class="terms">Payment: 30% T/T deposit, 70% before shipment · Lead time: 25 days after deposit · Samples: 5 days</div>
${bar('<span class="tag w">审批中</span> <span class="nb">已提交给 销售经理 ·</span> <span class="nb">批准前不会发给客户</span>', btn('导出 PDF', 'file-down') + btn('在销售工作台查看', 'briefcase'))}
</div>`;

  /* ---- outreach --------------------------------------------------------- */
  const PROSPECTS = [
    ['Fjällvik Outdoor AB', '瑞典', '户外连锁', '新开 3 家门店', '92', 'a'],
    ['Kotikulma Oy', '芬兰', '家居零售', '官网新增保温杯品类', '88', 'a'],
    ['Brattberg Sport AS', '挪威', '运动户外', '正在招聘采购经理', '84', 'a'],
    ['Havbris Home ApS', '丹麦', '家居电商', '年销售额增长 30%+', '79', 'b'],
    ['Solvarm Retail AB', '瑞典', '礼品与家居', '参加北欧家居展', '76', 'b'],
  ];
  const prospects = `<div class="card" data-hot="prospects"><div class="ch">${icon('sparkles')}目标客户 · 5 家<span class="tag b">已写入主动获客</span></div>
<table class="only-w"><thead><tr><th>公司</th><th>国家</th><th>类型</th><th>信号</th><th class="n">匹配度</th></tr></thead><tbody>
${PROSPECTS.map(([n, c, t, s, m, k]) => `<tr><td>${n}</td><td>${c}</td><td>${t}</td><td>${s}</td><td class="n"><span class="tag ${k}">${m}</span></td></tr>`).join('\n')}
</tbody></table>
<table class="only-n"><thead><tr><th>公司 · 信号</th><th class="n">匹配度</th></tr></thead><tbody>
${PROSPECTS.map(([n, c, t, s, m, k]) => `<tr><td class="w">${n}<small>${c} · ${t} · <span class="sig">${s}</span></small></td><td class="n"><span class="tag ${k}">${m}</span></td></tr>`).join('\n')}
</tbody></table></div>`;
  const outreachMail = `<div class="card"><div class="ch">${icon('mail')}开发信草稿 · English</div>
<div class="mail"><b>Subject: Insulated drinkware for your autumn range</b>
Hi Anna, I noticed Fjällvik is opening three new stores this season. We make 304 stainless vacuum flasks and tumblers for Nordic retailers, with private-label printing from 300 pcs…</div>
${bar('每封信发送前都需要你确认', btn('逐个个性化', 'wand-sparkles') + btn('加入跟进序列', 'list-plus', true, 'approve'))}</div>`;

  /* ---- brief ------------------------------------------------------------ */
  const SOURCES = [['官网', 14, '#1756d6'], ['邮件', 11, '#4f80e3'], ['WhatsApp', 8, '#8eaeee'], ['展会', 5, '#c3d3f5']];
  const total = SOURCES.reduce((s, [, n]) => s + n, 0);
  if (total !== 38) throw new Error(`brief: inquiry sources must sum to 38, got ${total}`);
  const metrics = `<div class="metrics" data-hot="metrics">
<div class="metric"><span>新询盘</span><b>${total}</b><em>较上周 +12%</em></div>
<div class="metric"><span>已报价</span><b>21</b><em>平均 6 小时回复</em></div>
<div class="metric"><span>赢单</span><b>6</b><em>US$ 84,200</em></div>
<div class="metric"><span>待你审批</span><b>4</b><em class="w">2 项今天到期</em></div>
</div>`;
  const sources = `<div class="card"><div class="mix"><div class="t"><span>${icon('chart-column').replace('class="i ', 'style="width:13px;height:13px;vertical-align:-2px;margin-right:6px" class="i ')}询盘来源</span><span>共 <b>${total}</b> 封</span></div>
<div class="stack">${SOURCES.map(([, n, c]) => `<i style="flex:${n};background:${c}"></i>`).join('')}</div>
<div class="legend">${SOURCES.map(([l, n, c]) => `<span><i style="background:${c}"></i>${l} <b>${n}</b></span>`).join('')}</div></div></div>`;
  const DECISIONS = [
    ['Nordhem Living PI', '单价低于标准价 4.2%', true, ['去审批', true]],
    ['Fjällvik 等 5 封开发信', '待你确认发送', true, ['查看']],
    ['Kotikulma Oy 样品免费寄送', '成本 US$ 46', false, ['查看']],
    ['Brattberg Sport 账期 60 天申请', '首单 US$ 12,600', false, ['查看']],
  ];
  const decisions = `<div class="card" data-hot="decisions"><div class="ch">${icon('shield-check')}需要你决定 · 4 项</div>
<div class="todo">
${DECISIONS.map(([t, d, due, [b, pri]]) => `<div>${icon('clock')}<span class="tx">${t}<span class="only-w"> · ${d}</span><small class="only-n">${d}${due ? ' · 今天到期' : ''}</small></span>${due ? '<span class="tag w only-w">今天到期</span>' : ''}${btn(b, '', pri)}</div>`).join('\n')}
</div></div>`;

  /* ---- follow ----------------------------------------------------------- */
  const FOLLOWS = [
    ['Vintergran Living AB', '瑞典', '样品寄出 7 天未回复', 'Hi Sofia, did the SVF-500 samples arrive safely? Happy to adjust the logo before the bulk run.'],
    ['Merituuli Oy', '芬兰', '报价 3 天未回复', 'Hi Jari, following up on our quote for 800 tumblers. Any questions on lead time or packaging?'],
    ['Kalvø Outdoor AS', '挪威', '老客户 · 已到补货周期（距上次下单 92 天）', 'Hi Lars, your last 750 ml bottle order shipped in early August. Shall we plan the next batch?'],
    ['Tallvik Hem AB', '瑞典', '样品已确认 · 4 天未下单', 'Hi Maja, glad the sample worked for you. Shall I reserve a production slot for 1,000 pcs?'],
  ];
  const followCard = (n) => `<div class="card" data-hot="follows"><div class="ch">${icon('user')}建议跟进 · ${n} 位客户<span class="tag w">待你确认</span></div>
<div class="fups">
${FOLLOWS.slice(0, n).map(([c, k, why, draft]) => `<div class="fup">${icon('clock')}<div class="bd"><div class="hd"><b>${c}</b><small>${k}</small></div><div class="why">${why}</div><div class="draft">${draft}</div></div></div>`).join('\n')}
</div>
${bar('每条跟进消息发送前都需要你确认', btn('逐条修改', 'pencil') + btn('逐条批准', 'check', true, 'approve'))}</div>`;

  const followSteps = steps('已完成 3 个步骤', [
    ['读取客户CRM时间线', '近 30 天的往来与报价记录'],
    ['检查报价与样品状态', '销售工作台 · 报价与寄样记录'],
    ['对比补货周期', '老客户的历史下单间隔'],
  ]);
  /* The PI card reduced to its number and its approval bar — the part the
     price rule is about. */
  const piGate = `<div class="card" data-hot="pi">
<div class="ch">${icon('file-text')}PI-2026-1108 · 形式发票 · 演示数据</div>
${bar('<span class="tag w">审批中</span> <span class="nb">已提交给 销售经理 ·</span> <span class="nb">批准前不会发给客户</span>', btn('导出 PDF', 'file-down') + btn('在销售工作台查看', 'briefcase'))}
</div>`;
  /* The reply draft's first lines and its approval bar. */
  const replyGate = `<div class="card" data-hot="reply"><div class="ch">${icon('mail')}回复草稿 · English</div>
<div class="mail excerpt">Hi Erik,
Thanks for your inquiry. 500 pcs of our <span class="nb">SVF-500</span> vacuum flask (500 ml, 304 stainless) with your logo in one colour: <span class="nb">US$ 3.85/pc</span> FOB Ningbo. MOQ 300; samples 5 days, production 25 days…</div>
${bar('<span class="nb">对外发送需要你确认</span>', btn('修改', 'pencil') + btn('复制', 'copy') + btn('批准', 'check', true, 'approve'))}</div>`;

  /* Each conversation once: the question, and the answer under it. The full
     app, the focus render (the chat column alone, for the desktop showcase)
     and the crops all take them from here, so they never disagree. */
  const CONVO = {
    inquiry: { title: 'Nordhem Living · 询盘', ask: inquiryAsk, body: `${inquirySteps}
<p><b>询盘质量：A。</b>需求完整，交期可以满足：12 月 20 日前到港，需在 11 月 8 日前确认订单。</p>
${inquiryFacts}
${inquiryReply}` },
    quote: { title: 'Nordhem Living · PI', ask: `<div class="msg-u">按 Nordhem Living 询盘里的条件出一份 PI，定金 30%，余款发货前付清。</div>`, body: `${quoteSteps}
${piCard}
<p>PI 已保存到销售工作台。销售经理批准后，我把 PDF 和英文邮件草稿准备好，等你确认；客户付定金后，提醒你下生产单<span class="nb">（企业ERP）</span>。</p>
<p class="note">如果想守住标准价，可以改成 US$ 4.02 / 只并保留免费印 logo，我可以同时出两个版本供客户选择。</p>` },
    outreach: { title: '北欧户外家居 · 开发信', ask: `<div class="msg-u">找 5 家北欧做户外和家居的零售商，排除已有客户，再起草一封开发信。</div>`, body: `${steps('已完成 3 个步骤', [
  ['主动获客：按行业、地区、规模筛选', '北欧 · 户外 / 家居零售 · 门店 5–80 家'],
  ['补全公司信号与联系人', '采购 / 品类负责人'],
  ['与客户CRM去重', '排除 2 家已有客户', false, 'dedupe'],
])}
${prospects}
${outreachMail}` },
    brief: { title: '本周业务简报', ask: `<div class="msg-u">这周业务怎么样？有什么需要我拍板的？</div>`, body: `${steps('已完成 3 个步骤', [
  ['汇总老板看板', '询盘、报价、订单、回款'],
  ['对比上周', '同口径'],
  ['整理待你审批事项', '4 项'],
])}
<p><b>一句话：</b>询盘比上周多 12%，增量主要来自官网的北欧家居客户；回复速度稳定在 6 小时内。有 4 件事等你拍板，其中 2 件今天到期。</p>
${metrics}
${sources}
${decisions}` },
    follow: { title: '本周该跟进的客户', ask: `<div class="msg-u">哪些客户该跟进了？</div>`, body: `${followSteps}
<p><b>今天建议跟进 4 位客户。</b>每位的跟进消息都按各自的往来记录起草好了，发送前逐条等你确认。</p>
${followCard(4)}` },
  };
  const appOf = (k) => app(CONVO[k].title, `${CONVO[k].ask}\n<div class="msg-a">\n${CONVO[k].body}\n</div>`);
  /** The chat column alone at `width` CSS px (desktop showcase, 3x). */
  const convo = (k, width = 800) => doc(CONVO[k].title, 'focus convo', `<div class="shot" style="width:${width}px">${CONVO[k].ask}<div class="msg-a">${CONVO[k].body}</div></div>`);

  const pages = {
    /* full app, 1280×880 */
    home: app('新聊天', `<div class="stage"><div class="hello"><h1>有什么可以帮你?</h1>
  <div class="col" data-hot="composer">${composer()}
  <div class="addrow"><b>${icon('plus')}添加</b>选择后只填入输入框，不会自动发送</div>
  <div class="chips" data-hot="chips">
    <span class="chip">${icon('square-pen')}起草开发信</span>
    <span class="chip">${icon('search')}分析询盘并回复</span>
    <span class="chip">${icon('user')}跟进客户</span>
    <span class="chip">${icon('receipt-text')}起草报价单 / PI</span>
    <span class="chip">${icon('book-open')}整理企业资料</span>
    <span class="chip">更多模板…</span>
  </div></div></div></div>`, { home: true }),
    inquiry: appOf('inquiry'),
    quote: appOf('quote'),
    outreach: appOf('outreach'),
    brief: appOf('brief'),
    follow: appOf('follow'),

    /* desktop showcase: the conversation column alone, 800 CSS px @3x */
    'inquiry-focus': convo('inquiry'),
    'quote-focus': convo('quote'),
    'outreach-focus': convo('outreach'),
    'brief-focus': convo('brief'),

    /* phone cards, 390 CSS px wide @3x */
    'inquiry-card': shot('回复草稿', 'focus narrow', 390, inquiryReply),
    'quote-card': shot('PI', 'focus narrow', 390, piCard),
    'outreach-card': shot('目标客户', 'focus narrow', 390, prospects),
    'brief-card': shot('本周业务简报', 'focus narrow', 390, `${metrics}\n${decisions}`),
    'follow-card': shot('跟进客户', 'focus narrow', 390, followCard(4)),

    /* the three rules of the approvals section, as tight close-ups in phone
       typography (380 CSS px @3x): the price check with the PI in approval,
       the approval bar under a reply, and the record of what AI read */
    'pi-check': shot('PI 价格校验', 'focus narrow', 380, `${quoteSteps}\n${piGate}`),
    'approval-bar': shot('对外发送审批', 'focus narrow', 380, `<p><b>询盘质量：A。</b>需求完整，交期可以满足。英文回复已按价格表报价：</p>\n${replyGate}`),
    'step-log': shot('执行记录', 'focus narrow', 380, `${CONVO.follow.ask}\n${followSteps}\n<p><b>今天建议跟进 4 位客户。</b>每条跟进消息都按往来记录起草好，发送前逐条等你确认。</p>`),

    /* desktop crops @2x */
    'quick-actions': shot('快捷操作', 'focus', 1000, `<div style="padding:4px 90px 0">${composer()}
  <div class="addrow"><b>${icon('plus')}添加</b>选择后只填入输入框，不会自动发送</div>
  <div class="chips">
    <span class="chip">${icon('square-pen')}起草开发信</span>
    <span class="chip">${icon('search')}分析询盘并回复</span>
    <span class="chip">${icon('user')}跟进客户</span>
    <span class="chip">${icon('receipt-text')}起草报价单 / PI</span>
    <span class="chip">${icon('book-open')}整理企业资料</span>
    <span class="chip">更多模板…</span>
  </div></div>`),
  };
  return pages;
}

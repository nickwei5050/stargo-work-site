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
  ['lightbulb', '记忆与进化'], ['sliders-horizontal', 'STARGO AI 数字办公室'], ['ticket', 'AI 网关'],
];
/* The composer footnote. Round 2 (owner, 2026-10-10: everything is live): the
   old 「外部客户发送未启用」 said sending to customers was switched off, which no
   longer holds and clashes with the demo video (已批准 · 已发送). It now states
   the rule the whole site states: outward sending needs an authorized person. */
export const FOOTNOTE = '工具操作遵循当前授权；对外发送需有权人批准。';

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

/* ---- welcome (the real OPEN WORK home view) ---------------------------- */
.wtop{height:56px;flex:none;display:flex;align-items:center;gap:18px;padding:0 22px}
.crumb{display:flex;align-items:center;gap:8px;font-size:14.5px;color:var(--ink)}
.crumb b{font-weight:700;letter-spacing:.02em}
.crumb span{color:var(--ink3)}
.crumb .i{width:14px;height:14px;color:var(--ink2)}
.wsearch{flex:1;max-width:430px;margin-left:auto;margin-right:auto;height:36px;border:1px solid var(--line);background:#fbfaf8;border-radius:10px;display:flex;align-items:center;gap:9px;padding:0 13px;color:#9a968f;font-size:12.5px}
.wsearch .i{width:15px;height:15px;color:var(--ink2)}
.wbody{flex:1;min-height:0;overflow:hidden;padding:0 26px;display:flex;flex-direction:column}
.whero{position:relative;overflow:hidden;border-radius:16px;padding:30px 30px 28px;background:linear-gradient(115deg,#e9f1fd 0%,#f1f5fc 46%,#e6eefb 100%);border:1px solid #dfe7f5}
.whero .globe{position:absolute;right:-60px;top:-70px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(255,255,255,.9),rgba(214,228,250,.4) 55%,rgba(196,214,245,.0) 70%);}
.whero .dots{position:absolute;right:20px;top:-20px;width:380px;height:300px;opacity:.55;background-image:radial-gradient(#9fb7e3 1.1px,transparent 1.2px);background-size:9px 9px;-webkit-mask-image:radial-gradient(ellipse 60% 55% at 60% 45%,#000 40%,transparent 72%);mask-image:radial-gradient(ellipse 60% 55% at 60% 45%,#000 40%,transparent 72%)}
.whero small{position:relative;display:block;font-size:11px;letter-spacing:.14em;color:#5d6b85;font-weight:600}
.whero h1{position:relative;margin:6px 0 2px;font-size:31px;font-weight:800;letter-spacing:.01em;color:#101828}
.whero h2{position:relative;margin:0 0 10px;font-size:20px;font-weight:500;color:#344054}
.whero p{position:relative;margin:0;font-size:13.5px;line-height:1.75;color:#475467;max-width:470px}
.whero .script{position:absolute;right:46px;bottom:34px;font-family:'Brush Script MT','Segoe Script',cursive;font-style:italic;font-size:25px;color:#2c3e66;transform:rotate(-8deg);letter-spacing:.01em}
.wsec{display:flex;align-items:baseline;gap:10px;margin:24px 2px 3px}
.wsec b{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:700}
.wsec b .i{width:18px;height:18px;color:#101828;fill:#101828}
.wsec a{margin-left:auto;font-size:12.5px;color:var(--ink2);display:flex;align-items:center;gap:4px;text-decoration:none}
.wsec a .i{width:14px;height:14px}
.wsub{font-size:13px;color:var(--ink3);margin:0 2px 14px}
.wtabs{display:flex;gap:8px;margin-bottom:14px;flex-wrap:nowrap}
.wtab{height:33px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:#fbfaf8;font-size:13px;display:flex;align-items:center;color:#26252a;white-space:nowrap}
.wtab.on{background:#e3ecfb;border-color:#c9d9f6;color:#1446ad;font-weight:600}
.wcards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.wcard{position:relative;border:1px solid var(--line);border-radius:13px;padding:16px 16px 15px;background:#fff}
.wcard .ic{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;margin-bottom:8px}
.wcard .ic .i{width:18px;height:18px}
.wcard b{display:block;font-size:14.5px;font-weight:700;margin-bottom:4px}
.wcard p{margin:0;font-size:12.5px;line-height:1.6;color:#5c5a56}
.wcard .go{position:absolute;right:13px;top:14px;width:16px;height:16px;color:var(--ink2)}
.wcomp{margin:16px 0 24px;margin-top:auto;border:1px solid #dcd8d1;background:#fff;border-radius:16px;padding:12px 12px 10px 16px;box-shadow:0 1px 2px rgba(30,25,20,.04)}
.wcomp .ph{font-size:13.5px;color:#9a968f;margin-bottom:12px}
.wcomp .row{display:flex;align-items:center;gap:8px}
.wcomp .pill{height:30px;padding:0 11px;border:1px solid var(--line);border-radius:999px;display:flex;align-items:center;gap:6px;font-size:12.5px;color:#26252a;background:#fbfaf8;white-space:nowrap}
.wcomp .pill .i{width:14px;height:14px}
.wcomp .plus{width:30px;padding:0;justify-content:center}
.wcomp .mode{margin-left:auto}
.wcomp .go2{width:36px;height:36px;border-radius:50%;background:#16161a;color:#fff;display:grid;place-items:center}
.wcomp .go2 .i{width:17px;height:17px;stroke-width:2.4}
/* ---- split: chat + an app open in the right panel ----------------------- */
.split{flex:1;min-height:0;display:flex;border-top:1px solid var(--line)}
.top .tl{display:flex;align-items:center;gap:10px}
.top .bmark{display:flex;align-items:center;gap:6px;font-weight:700;letter-spacing:.02em;color:#141a33}
.top .bmark .spark{width:14px;height:14px}
.top .sep{color:var(--ink3)}
.split .chatcol{width:440px;flex:none;display:flex;flex-direction:column;border-right:1px solid var(--line)}
.split .chatcol .thread{padding:12px 18px 0}
.split .chatcol .col{width:100%;max-width:none}
.split .chatcol .msg-u{max-width:100%}
.split .chatcol .dock{padding:6px 18px 12px}
.panel{flex:1;min-width:0;display:flex;flex-direction:column;background:#fbfaf8}
.ptabs{height:42px;flex:none;display:flex;align-items:center;gap:2px;padding:0 10px;border-bottom:1px solid var(--line);background:#f3f1ed}
.ptab{height:30px;padding:0 11px;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink2);border-radius:7px;white-space:nowrap}
.ptab .i{width:13px;height:13px}
.ptab.on{background:#fff;color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.ptab.on .x{width:12px;height:12px;color:var(--ink3);margin-left:2px}
.ptabs .tools{margin-left:auto;display:flex;gap:10px;color:var(--ink3);padding-right:4px}
.ptabs .tools .i{width:14px;height:14px}
.app2{flex:1;min-height:0;display:flex}
.app2 .nav2{width:160px;flex:none;border-right:1px solid var(--line);padding:12px 8px;background:#f8f7f4}
.app2 .nav2 .ws{display:flex;align-items:center;gap:7px;font-weight:700;font-size:13.5px;padding:0 6px 10px}
.app2 .nav2 .ws i{width:20px;height:20px;border-radius:5px;background:#16161a;color:#fff;font-style:normal;font-size:10px;font-weight:700;display:grid;place-items:center}
.app2 .nav2 .lb{font-size:12px;color:var(--ink3);padding:6px 6px 4px}
.app2 .nav2 .it{display:flex;align-items:center;gap:8px;height:30px;padding:0 6px;border-radius:6px;font-size:13px;color:#33312d}
.app2 .nav2 .it .i{width:14px;height:14px;color:var(--ink2)}
.app2 .nav2 .it.on{background:#e8e5df;font-weight:600}
.app2 .body2{flex:1;min-width:0;display:flex;flex-direction:column;background:#fff}
.app2 .hd2{height:48px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;border-bottom:1px solid #eeebe6;font-size:14.5px;font-weight:600}
.app2 .hd2 .i{width:15px;height:15px;color:var(--ink2)}
.app2 .hd2 .cnt{font-weight:400;color:var(--ink3);font-size:13px}
.app2 .hd2 .btn .i{color:inherit}
.app2 .hd2 .btn{margin-left:auto}
.app2 .tb{height:40px;flex:none;display:flex;align-items:center;gap:14px;padding:0 14px;border-bottom:1px solid #eeebe6;font-size:13px;color:var(--ink2)}
.app2 .tb .i{width:13px;height:13px;vertical-align:-2px;margin-right:4px}
.app2 .tb .r{margin-left:auto;display:flex;gap:14px}
.app2 table{font-size:13px}
.app2 th{font-size:12.5px;padding:8px 8px 8px 10px;background:#fafaf8}
.app2 td{padding:9px 8px 9px 10px;border-bottom:1px solid #f0eee9}
.app2 td:last-child,.app2 th:last-child{padding-right:14px}
.app2 tr.new td{background:#f3f8ff}
.app2 tr.merge td{background:#fffaf0}
.app2 .co{display:flex;align-items:center;gap:7px;font-weight:500}
.app2 .co i{width:20px;height:20px;border-radius:4px;font-style:normal;font-size:10px;font-weight:700;display:grid;place-items:center;color:#fff}
.app2 .who{display:flex;align-items:center;gap:6px}
.app2 .who i{width:18px;height:18px;border-radius:50%;background:#e8e5df;font-style:normal;font-size:9.5px;display:grid;place-items:center;color:#4f4d49}
.foot2,.app2 .foot2{height:40px;flex:none;display:flex;align-items:center;gap:12px;padding:0 14px;border-top:1px solid #eeebe6;font-size:12.5px;color:var(--ink3);margin-top:auto}
.tog{display:inline-block;width:28px;height:16px;border-radius:999px;background:#d8d4cd;position:relative;vertical-align:middle}
.tog::after{content:'';position:absolute;left:2px;top:2px;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.tog.on{background:#1756d6}
.tog.on::after{left:14px}
.flowname{font-weight:500}
.flowname small{display:block;color:var(--ink3);font-size:12px;font-weight:400}
.mods{display:flex;flex-wrap:wrap;gap:6px;padding:10px 14px;border-bottom:1px solid #eeebe6}
.mod{display:flex;align-items:center;gap:6px;height:30px;padding:0 10px 0 6px;border:1px solid #e6e3dd;border-radius:8px;font-size:13px;background:#fff}
.mod b{width:18px;height:18px;border-radius:5px;display:grid;place-items:center;color:#fff}
.mod b .i{width:11px;height:11px;stroke-width:2.2}
.mod.on{border-color:#c9d9f6;background:#f3f7ff;font-weight:600;color:#1446ad}
.formcard{margin:12px 14px;border:1px solid #e6e3dd;border-radius:10px;overflow:hidden}
.formcard .fh{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#fafaf8;border-bottom:1px solid #eeebe6;font-size:13.5px;font-weight:600}
.formcard .fh .tag{margin-left:auto}
.fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px 14px;padding:11px 12px;font-size:13px}
.fgrid span{display:block;color:var(--ink3);font-size:12px}

.flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px 6px;padding:11px 14px;font-size:12.5px}
.flow .fsw{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.flow .fs{display:flex;align-items:center;gap:5px;height:26px;padding:0 9px;border:1px solid var(--line);border-radius:7px;background:#fff;white-space:nowrap}
.flow .fs .i{width:13px;height:13px;color:var(--ink2)}
.flow .fs.gate{border-color:#c9d9f6;background:#f3f7ff;color:#1446ad;font-weight:600}
.flow .fs.gate .i{color:#1446ad}
.flow .arr{width:13px;height:13px;color:var(--ink3)}
.runs{margin:4px 14px 0;border:1px solid #eeebe6;border-radius:10px;overflow:hidden}
.runs .rh{display:flex;align-items:center;gap:7px;padding:9px 12px;background:#fafaf8;border-bottom:1px solid #eeebe6;font-size:13px;font-weight:600;color:var(--ink2)}
.runs .rh .i{width:14px;height:14px}
.run{display:flex;align-items:center;gap:9px;padding:9px 12px;border-bottom:1px solid #f0eee9;font-size:13px}
.run:last-child{border-bottom:0}
.run .dot{width:8px;height:8px;border-radius:50%;flex:none}
.run .dot.a{background:#1f8a4c}.run .dot.w{background:#d38a12}.run .dot.b{background:#1756d6}
.run b{font-weight:600;white-space:nowrap}
.run .rt{color:var(--ink2);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.run em{font-style:normal;color:var(--ink3);white-space:nowrap}

.staffhd{padding:14px 16px 6px;background:#fff}
.staffhd h3{margin:0;display:flex;align-items:baseline;gap:8px;font-size:19px;font-weight:800}
.staffhd h3 small{font-size:13px;font-weight:400;color:var(--ink3)}
.staffhd p{margin:5px 0 10px;font-size:13px;color:var(--ink2);line-height:1.6}
.staffhd .sbox{height:32px;border:1px solid var(--line);border-radius:8px;display:flex;align-items:center;gap:8px;padding:0 11px;font-size:13px;color:#9a968f;max-width:320px}
.staffhd .sbox .i{width:14px;height:14px}
.chipsx{display:flex;gap:6px;padding:8px 16px 10px;background:#fff;border-bottom:1px solid #eeebe6;flex-wrap:nowrap;overflow:hidden}
.chipx{height:28px;padding:0 10px;border:1px solid #e6e3dd;border-radius:999px;font-size:12px;display:flex;align-items:center;gap:4px;white-space:nowrap;color:#3a3935}
.chipx b{font-weight:600;color:var(--ink3)}
.chipx.on{background:#16161a;color:#fff;border-color:#16161a}
.chipx.on b{color:#cfcfd4}
.sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:10px 16px;background:#fbfaf8;flex:1;min-height:0;overflow:hidden;align-content:start}
.scard{border:1px solid #e6e3dd;border-radius:11px;background:#fff;padding:10px 13px 9px}
.scard .top2{display:flex;gap:9px;align-items:center}
.scard .av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:700;color:#fff;flex:none}
.scard b{display:block;font-size:14px;font-weight:700}
.scard small{display:block;font-size:12px;color:var(--ink3)}
.scard .ok{display:flex;align-items:center;gap:4px;font-size:11.5px;color:#1f8a4c}
.scard .ok::before{content:'';width:6px;height:6px;border-radius:50%;background:#1f8a4c}
.scard p{margin:8px 0 7px;font-size:12.5px;line-height:1.55;color:#4f4d49}
.scard .dep{display:inline-block;font-size:11.5px;padding:2px 7px;border-radius:5px;background:#f1efeb;color:#5d5a55}
.scard .st{display:flex;gap:12px;margin-top:8px;font-size:12px;color:var(--ink3)}
.scard .st b{display:inline;font-size:12px;color:var(--ink);font-weight:600}
.scard.hl{border-color:#c9d9f6;box-shadow:0 0 0 2px #e5edfb}

/* ---- phone cards of the split scenes (crm / automation / erp / staff) ----- */
.clist{padding:2px 14px}
.crow{display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid #ece9e4}
.crow:last-child{border-bottom:0}
.crow .lg{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-size:14px;font-weight:700;color:#fff;flex:none;font-style:normal}
.crow .lg.round{border-radius:50%}
.crow .bd{flex:1;min-width:0}
.crow .bd b{display:block;font-weight:600;font-size:12.5px}
.crow .bd small{display:block;color:var(--ink3);font-size:12px}
.crow .tag{margin-left:auto}
.crow.hl{margin:0 -14px;padding-left:14px;padding-right:14px;background:#fffaf0}
body.narrow .clist{padding:2px 14px}
body.narrow .crow{padding:11px 0;gap:12px}
body.narrow .crow.hl{padding-left:14px;padding-right:14px}
body.narrow .crow .lg{width:38px;height:38px;font-size:16px}
body.narrow .crow .bd b{font-size:15px;line-height:1.35}
body.narrow .crow .bd small{font-size:13.5px;line-height:1.45;margin-top:1px}
body.narrow .flow{flex-direction:column;align-items:stretch;gap:0;padding:12px 14px 6px}
body.narrow .flow .fs{height:40px;font-size:14.5px;padding:0 13px;gap:10px;border-radius:10px}
body.narrow .flow .fs .i{width:16px;height:16px}
body.narrow .flow .arr{align-self:center;width:16px;height:16px;margin:2px 0}
body.narrow .fgrid{grid-template-columns:1fr 1fr;gap:10px 14px;padding:12px 14px;font-size:14.5px}
body.narrow .fgrid span{font-size:12.5px}
body.narrow .kv{grid-template-columns:auto 1fr;gap:8px 18px;font-size:14.5px;padding:12px 14px}
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

  /** Chat on the left, an app open in the right panel (the real OPEN WORK app panel with tabs). */
  const split = (title, tabs, activeTab, chatBody, panelBody) => doc(title, '', `<div class="app">
<main class="main">
  <div class="top"><span class="tl"><span class="iconbtn">${icon('panel-left')}</span><b class="bmark">${icon('sparkle', 'spark').replace('stroke="currentColor"', 'stroke="#1756d6" fill="#1756d6"')}OPEN WORK</b><span class="sep">/</span><b>${title}</b></span><span class="iconbtn">${icon('panel-right')}</span></div>
  <div class="split"><div class="chatcol"><div class="thread"><div class="col">${chatBody}</div></div><div class="dock"><div class="col">${composer('继续追问，或输入 / 选择操作')}</div></div></div>
  <div class="panel"><div class="ptabs">${tabs.map((t, i) => `<span class="ptab${i === activeTab ? ' on' : ''}">${t}${i === activeTab ? icon('x', 'x') : ''}</span>`).join('')}<span class="tools">${icon('circle-help')}${icon('rotate-cw')}${icon('external-link')}</span></div>${panelBody}</div></div>
</main></div>`);

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


    /* ---- welcome: the real OPEN WORK home view (owner screenshot 2026-10-09) ---- */
    welcome: doc('欢迎', '', `<div class="app">${sidebar(null)}
<main class="main">
  <div class="wtop"><div class="crumb"><b>STARGO</b><span>/</span>Agent Workspace ${icon('chevron-down')}</div>
  <div class="wsearch">${icon('search')}搜索对话、任务、客户、产品等…（⌘ K）</div></div>
  <div class="wbody">
    <div class="whero" data-hot="hero"><div class="globe"></div><div class="dots"></div>
      <small>GOOD AFTERNOON</small>
      <h1>你好，欢迎使用 OPEN WORK</h1>
      <h2>你的 AI 外贸业务执行系统</h2>
      <p>连接全球市场，加速业务增长。用 AI 重塑外贸工作方式，从市场洞察到客户成交，让复杂的全球业务变得简单高效。</p>
      <span class="script">From China to the World</span>
    </div>
    <div class="wsec"><b>${icon('sparkle')}快速任务</b><a>查看全部 ${icon('arrow-right')}</a></div>
    <div class="wsub">从一个任务开始，让 AI 帮你完成专业的外贸业务工作。</div>
    <div class="wtabs" data-hot="tabs">${['主动获客', '询盘处理', '客户跟进', '报价与 PI', '内容增长', '企业知识库', '制造与合规'].map((t, i) => `<span class="wtab${i === 0 ? ' on' : ''}">${t}</span>`).join('')}</div>
    <div class="wcards" data-hot="cards">${[
      ['search', '#2f6fed', '#e8f0fe', '潜在客户搜索方案', '帮我制定目标市场潜在客户搜索方案，包含搜索策略、关键词和高质量客户来源。'],
      ['users', '#16a34a', '#e7f6ec', '客户筛选条件', '根据我提供的客户资料，整理潜在客户筛选条件，并生成客户分层列表。'],
      ['file-text', '#7c3aed', '#f1eafe', '外贸开发信', '为这款产品起草一封专业的外贸开发信，先给我审核，再生成不同版本。'],
      ['chart-column', '#ea7a12', '#fdf0e2', '梳理市场场景需求', '分析目标市场的应用场景、客户需求和信息来源，输出市场机会洞察。'],
      ['receipt-text', '#dc2626', '#fde8e8', '报价与 PI 生成', '根据客户需求生成专业的报价单和形式发票（PI），支持多语言版本。'],
      ['shield-check', '#0d9488', '#e2f5f2', '客户背调', '整合公开信息，分析客户背景、信用状况和合作风险，生成尽调报告。'],
    ].map(([ic, c, bg, t, d]) => `<div class="wcard"><span class="ic" style="background:${bg};color:${c}">${icon(ic)}</span>${icon('arrow-right', 'go')}<b>${t}</b><p>${d}</p></div>`).join('')}</div>
    <div class="wcomp" data-hot="composer"><div class="ph">描述你的需求，或直接下达任务…</div>
      <div class="row"><span class="pill plus">${icon('plus')}</span><span class="pill">${icon('globe')}联网搜索</span><span class="pill">${icon('book-open')}企业知识库</span><span class="pill">${icon('wrench')}工具 ${icon('chevron-down')}</span><span class="pill mode">${icon('sparkle')}Agent ${icon('chevron-down')}</span><span class="go2">${icon('arrow-up')}</span></div>
    </div>
  </div>
</main></div>`),

    /* ---- split scenes: the chat drives an app open in the right panel ---------- */
    crm: split('广交会名片整理', ['老板看板', '客户CRM', '自动化中心', '插件'], 1, `<div class="msg-u">把今天广交会收的 6 张名片录进客户CRM，查重后建档，再给每家起草一封跟进邮件。</div>
<div class="msg-a">
${steps('已完成 4 个步骤', [
  ['识别名片', '6 张 · 公司、联系人、职位、邮箱'],
  ['与客户CRM查重', '1 家已是客户，已合并到原档案', false, 'merge'],
  ['新建 5 家公司与联系人', '来源：广交会 2026 秋'],
  ['起草 5 封跟进邮件', '按展位上聊到的产品', false, 'drafts'],
])}
<p>5 家新客户已建档，来源和展会上聊到的产品都记在档案里。跟进邮件发送前逐封等你确认。</p>
<div class="card"><div class="ch">${icon('mail')}跟进邮件草稿 · 1 / 5<span class="tag g">Brightwell Home</span></div>
<div class="mail"><b>Subject: Great meeting you at the Canton Fair</b>
Hi Lena, thanks for stopping by our booth. As promised, here are the specs and FOB prices for the 500 ml vacuum flask, with logo options from 300 pcs…</div>
${bar('5 封待你确认', btn('逐封查看', 'mail') + btn('批准', 'check', true, 'approve'))}</div>
</div>`, `<div class="app2"><div class="nav2"><div class="ws"><i>SG</i>客户CRM</div>
<div class="lb">工作台</div>
${[['building-2', '公司', true], ['user', '人员'], ['target', '商机'], ['list-checks', '任务'], ['sticky-note', '备注'], ['workflow', '工作流程']].map(([ic, t, on]) => `<div class="it${on ? ' on' : ''}">${icon(ic)}${t}</div>`).join('')}
</div><div class="body2">
<div class="hd2">${icon('building-2')}公司 <span class="cnt">· 全部公司 128</span>${btn('新公司', 'plus', true)}</div>
<div class="tb"><span>${icon('list-filter')}来源：广交会 2026 秋</span><span>${icon('arrow-down-up')}最近创建</span><span class="r"><span>筛选</span><span>排序</span></span></div>
<table data-hot="table"><thead><tr><th>名称</th><th>国家</th><th>联系人</th><th>感兴趣的产品</th><th>负责人</th><th>状态</th></tr></thead><tbody>
${[
  ['B', '#2f6fed', 'Brightwell Home GmbH', '德国', 'Lena Vogt · 采购经理', '保温杯 500 ml', '王强', 'new'],
  ['C', '#16a34a', 'Casa Lume S.r.l.', '意大利', 'Marco Rinaldi · 品类经理', '咖啡随行杯', '李娜', 'new'],
  ['N', '#ea7a12', 'Norte Cozinha Lda', '葡萄牙', 'Inês Duarte · 采购', '焖烧罐', '王强', 'new'],
  ['K', '#7c3aed', 'Kestrel Outdoor Ltd', '英国', 'Tom Hughes · 买手', '户外水壶 750 ml', '李娜', 'new'],
  ['V', '#0d9488', 'Valmora Trading SA', '西班牙', 'Lucía Prieto · 总经理', '礼盒套装', '王强', 'new'],
  ['K', '#dc2626', 'Kotikulma Oy', '芬兰', 'Aino Laine · 采购', '保温杯 500 ml', '李娜', 'merge'],
  ['N', '#475569', 'Nordhem Living AB', '瑞典', 'Erik Lund · 采购', '保温杯 500 ml', '李娜', '已报价'],
  ['F', '#475569', 'Fjällvik Outdoor AB', '瑞典', 'Anna Berg · 品类经理', '户外水壶 750 ml', '王强', '跟进中'],
  ['T', '#475569', 'Tallvik Hem AB', '瑞典', 'Maja Ek · 采购', '保温杯 500 ml', '李娜', '样品中'],
  ['M', '#475569', 'Merituuli Oy', '芬兰', 'Jari Koski · 买手', '随行杯 400 ml', '王强', '已报价'],
  ['B', '#475569', 'Brattberg Sport AS', '挪威', 'Ola Dahl · 总经理', '运动水壶', '王强', '账期审批'],
  ['K', '#475569', 'Kalvø Outdoor AS', '挪威', 'Lars Moe · 采购', '户外水壶 750 ml', '李娜', '老客户'],
].map(([l, c, n, k, p, prod, o, st]) => `<tr class="${st === 'new' || st === 'merge' ? st : ''}"><td><span class="co"><i style="background:${c}">${l}</i>${n}</span></td><td>${k}</td><td>${p}</td><td>${prod}</td><td><span class="who"><i>${o[0]}</i>${o}</span></td><td>${st === 'new' ? '<span class="tag b">新建</span>' : st === 'merge' ? '<span class="tag w">已合并</span>' : `<span class="tag g">${st}</span>`}</td></tr>`).join('\n')}
</tbody></table>
<div class="foot2">共 128 家 · 本次新建 5 · 合并 1<span style="margin-left:auto">演示数据</span></div>
</div></div>`),

    automation: split('报价未回复 · 自动跟进', ['老板看板', '客户CRM', '自动化中心', '插件'], 2, `<div class="msg-u">每天早上 9 点，帮我找出报价超过 3 天没回复的客户，起草跟进邮件，等我批准再发。</div>
<div class="msg-a">
${steps('已完成 3 个步骤', [
  ['在自动化中心创建流程', '每天 09:00 · 读取销售工作台的报价记录'],
  ['试运行一次', '找到 2 位客户：Merituuli Oy、Havbris Home', false, 'test'],
  ['跟进草稿放进待审批', '发送前逐封等你确认', false, 'gate'],
])}
<p>流程已开启。以后每天 9 点自动检查，只起草、不自动发送；你批准后才发出。</p>
<div class="card"><div class="ch">${icon('workflow')}报价 3 天未回复 → 起草跟进<span class="tag a">已开启</span></div>
<div class="flow">${[['calendar-clock', '每天 09:00'], ['briefcase', '读取报价记录'], ['list-filter', '3 天未回复'], ['mail', '起草跟进邮件'], ['shield-check', '等你批准']].map(([ic, t], i, a) => `<span class="fsw"><span class="fs${i === a.length - 1 ? ' gate' : ''}">${icon(ic)}${t}</span>${i < a.length - 1 ? icon('chevron-right', 'arr') : ''}</span>`).join('')}</div>
${bar('2 封草稿待你确认', btn('查看草稿', 'mail') + btn('批准', 'check', true, 'approve'))}</div>
</div>`, `<div class="app2"><div class="nav2"><div class="ws"><i>${icon('zap').replace('class="i ', 'style="width:11px;height:11px;color:#fff" class="i ')}</i>自动化中心</div>
<div class="lb">工作台</div>
${[['workflow', '自动化流程', true], ['history', '运行记录'], ['plug', '连接器'], ['variable', '数据变量']].map(([ic, t, on]) => `<div class="it${on ? ' on' : ''}">${icon(ic)}${t}</div>`).join('')}
</div><div class="body2">
<div class="hd2">${icon('workflow')}自动化流程 <span class="cnt">· 6 个</span>${btn('新建流程', 'plus', true)}</div>
<div class="tb"><span>${icon('search')}搜索流程</span><span class="r"><span>状态</span><span>触发方式</span></span></div>
<table data-hot="table"><thead><tr><th>流程</th><th>触发</th><th>最近运行</th><th>状态</th></tr></thead><tbody>
${[
  ['报价 3 天未回复 → 起草跟进', '只起草 · 发送前需批准', '每天 09:00', '刚刚 · 找到 2 位', true, 'new'],
  ['新询盘 → 分析并起草回复', '回复需批准后发出', '收到新询盘', '12 分钟前', true, ''],
  ['样品寄出 7 天 → 提醒业务员', '提醒到负责人', '每天 10:00', '今天 10:00', true, ''],
  ['老客户到补货周期 → 起草补货提醒', '只起草', '每周一 08:30', '周一 08:30', true, ''],
  ['每周一 → 生成老板周报', '推送到老板看板', '每周一 08:00', '周一 08:00', true, ''],
  ['展会名片 → 建档到客户CRM', '查重后建档', '手动运行', '昨天 18:20', false, ''],
].map(([n, sub, trig, last, on, cls]) => `<tr class="${cls}"><td><span class="flowname">${n}<small>${sub}</small></span></td><td>${trig}</td><td>${last}</td><td><span class="tog${on ? ' on' : ''}"></span></td></tr>`).join('\n')}
</tbody></table>
<div class="runs"><div class="rh">${icon('history')}最近运行</div>
${[['报价 3 天未回复 → 起草跟进', '刚刚', '找到 2 位客户 · 起草 2 封 · 等待批准', 'w'], ['新询盘 → 分析并起草回复', '12 分钟前', 'Nordhem Living · 回复草稿已生成 · 等待批准', 'w'], ['样品寄出 7 天 → 提醒业务员', '今天 10:00', '提醒李娜跟进 Tallvik Hem AB', 'a'], ['每周一 → 生成老板周报', '周一 08:00', '已推送到老板看板', 'a']].map(([n, t, r, k]) => `<div class="run"><span class="dot ${k}"></span><b>${n}</b><span class="rt">${r}</span><em>${t}</em></div>`).join('')}
</div>
<div class="foot2">发送类动作默认需要批准<span style="margin-left:auto">演示数据</span></div>
</div></div>`),

    erp: split('Nordhem Living · 下生产单', ['老板看板', '客户CRM', '企业ERP', '插件'], 2, `<div class="msg-u">Nordhem Living 的定金到了，帮我下生产单，顺便看看 SVF-500 的库存和交期。</div>
<div class="msg-a">
${steps('已完成 4 个步骤', [
  ['读取 PI-2026-1108', '500 只 SVF-500 + 500 个礼盒'],
  ['确认定金到账', '30% · US$ 630.00'],
  ['检查库存与产能', '杯体可用 1,200 只 · 礼盒需采购 500 个', true, 'stock'],
  ['生成生产工单草稿', 'WO-2026-0457 · 交期 12 月 2 日', false, 'wo'],
])}
<p>工单和礼盒采购单都已起草好，交期能赶上 12 月 20 日到港。确认后会下达到生产，并通知仓库备料。</p>
<div class="card"><div class="ch">${icon('shopping-cart')}采购单草稿 PO-0921<span class="tag w">待确认</span></div>
<dl class="kv"><dt>物料</dt><dd>礼盒 GB-01</dd><dt>数量</dt><dd>500 个</dd><dt>供应商</dt><dd>常用供应商 · 宁波</dd><dt>到货</dt><dd>11 月 18 日前</dd></dl>
${bar('下达前需要你确认', btn('查看工单', 'clipboard-list') + btn('确认下达', 'check', true, 'approve'))}</div>
</div>`, `<div class="app2" style="flex-direction:column"><div class="body2">
<div class="hd2">${icon('building-2')}企业ERP <span class="cnt">· 生产</span>${btn('新建工单', 'plus', true)}</div>
<div class="mods" data-hot="mods">${[['building', '组织', '#64748b'], ['wallet', '会计', '#2f6fed'], ['boxes', '资产', '#0d9488'], ['shopping-cart', '采购', '#ea7a12'], ['factory', '生产', '#1756d6', true], ['folder-kanban', '项目', '#7c3aed'], ['badge-check', '质量', '#16a34a'], ['receipt-text', '销售', '#dc2626'], ['package', '库存', '#0891b2'], ['truck', '委外', '#a16207']].map(([ic, t, c, on]) => `<span class="mod${on ? ' on' : ''}"><b style="background:${c}">${icon(ic)}</b>${t}</span>`).join('')}</div>
<div class="formcard" data-hot="wo"><div class="fh">${icon('clipboard-list')}生产工单 WO-2026-0457<span class="tag w">草稿 · 待确认</span></div>
<div class="fgrid"><div><span>产品</span>SVF-500 保温杯 500 ml</div><div><span>数量</span>500 只</div><div><span>关联订单</span>PI-2026-1108</div><div><span>计划开工</span>2026-11-10</div><div><span>计划完工</span>2026-12-02</div><div><span>车间</span>二车间 · 丝印线</div></div></div>
<table><thead><tr><th>物料</th><th class="n">需求</th><th class="n">可用库存</th><th>状态</th></tr></thead><tbody>
<tr><td>304 不锈钢杯体 500 ml</td><td class="n">500</td><td class="n">1,200</td><td><span class="tag a">充足</span></td></tr>
<tr><td>杯盖组件（黑色）</td><td class="n">500</td><td class="n">860</td><td><span class="tag a">充足</span></td></tr>
<tr><td>丝印油墨 · 单色</td><td class="n">2 kg</td><td class="n">6 kg</td><td><span class="tag a">充足</span></td></tr>
<tr class="merge"><td>牛皮纸礼盒 GB-01</td><td class="n">500</td><td class="n">0</td><td><span class="tag w">采购单草稿 PO-0921</span></td></tr>
</tbody></table>
<div class="runs"><div class="rh">${icon('factory')}近期工单</div>
${[['WO-2026-0456', 'Kotikulma Oy · 随行杯 400 ml × 800', '生产中 · 完成 62%', 'b'], ['WO-2026-0455', 'Kalvø Outdoor AS · 户外水壶 750 ml × 1,200', '质检中', 'w'], ['WO-2026-0452', 'Fjällvik Outdoor AB · 样品 20 只', '已完工 · 已寄样', 'a']].map(([n, t, r, k]) => `<div class="run"><span class="dot ${k}"></span><b>${n}</b><span class="rt">${t}</span><em>${r}</em></div>`).join('')}
</div>
<div class="foot2">下达后通知仓库备料<span style="margin-left:auto">演示数据</span></div>
</div></div>`),


    staff: split('Kalvø Outdoor · 新询盘派工', ['老板看板', '自动化中心', '客户CRM', '专家'], 3, `<div class="msg-u">Kalvø Outdoor 发来新询盘，要 1,200 只 750 ml 户外水壶。安排合适的数字员工处理，报价出来先给我看。</div>
<div class="msg-a">
${steps('企业调度长已派工 · 4 步', [
  ['询盘接待员', '读取询盘 · 提取产品、数量、交期'],
  ['客户档案管家', '老客户 · 上次下单 92 天前 · 历史价 US$ 4.10', false, 'history'],
  ['客户背调员', '近期新开 2 家门店 · 付款记录良好'],
  ['报价员', '按价格表出报价草稿 · 老客户价', false, 'quote'],
])}
<p>报价草稿已放进销售工作台：1,200 只 × US$ 4.05，FOB 宁波，交期 28 天。发给客户前等你确认。</p>
<div class="card"><div class="ch">${icon('receipt-text')}报价草稿 · Kalvø Outdoor AS<span class="tag w">待你确认</span></div>
<dl class="kv"><dt>产品</dt><dd>户外水壶 750 ml</dd><dt>数量</dt><dd>1,200 只</dd><dt>单价</dt><dd>US$ 4.05 FOB</dd><dt>交期</dt><dd>28 天</dd></dl>
${bar('发送前需要你确认', btn('查看报价', 'file-text') + btn('批准', 'check', true, 'approve'))}</div>
</div>`, `<div class="body2" style="flex:1;display:flex;flex-direction:column;min-height:0">
<div class="staffhd"><h3>STARGO 数字员工 <small>288 名 · 只读展示</small></h3>
<p>按职能分组的数字员工花名册。每位都有自己的技能、资料和 SOP，由企业调度长统一派工。</p>
<div class="sbox">${icon('search')}搜索姓名、岗位、职责或员工 ID</div></div>
<div class="chipsx">${[['全部', 288, true], ['企业通用支持', 15], ['客户开发与市场', 50], ['销售', 16], ['客户服务', 5], ['风控与合规', 20], ['供应链', 4]].map(([t, n, on]) => `<span class="chipx${on ? ' on' : ''}">${t} <b>${n}</b></span>`).join('')}</div>
<div class="sgrid" data-hot="staff">${[
  ['调', '#1e293b', '企业调度长', '企业任务分发与调度', '接到具体业务请求时先由它判断，派给合适的数字员工。', '企业通用支持', 1, 12, 0],
  ['询', '#1756d6', '询盘接待员', '外贸询盘接待', '买家通过邮件、WhatsApp 或网站来询盘时，读取并整理要素。', '销售', 1, 2, 0, true],
  ['背', '#0d9488', '客户背调员', '客户背景调查', '大额报价或给新客户账期前，核查背景与合作风险。', '客户开发与市场', 1, 2, 1],
  ['报', '#dc2626', '报价员', '报价与成本核对', '需要价格、报价单、PI 或成本拆分时，按价格表起草。', '销售', 2, 3, 1, true],
  ['档', '#7c3aed', '客户档案管家', '客户档案管理', '跨渠道保持客户记录准确：建档、更新、合并重复。', '客户服务', 1, 2, 0],
  ['增', '#ea7a12', '增长调度员', '增长任务分发与执行', '市场进入、开发计划与内容增长的入口。', '客户开发与市场', 1, 3, 1],
  ['营', '#be185d', 'AI 首席营销官', '市场营销与品牌', '制定市场计划、上新策略与渠道组合。', '客户开发与市场', 1, 4, 1],
  ['析', '#0891b2', '市场分析师', '市场分析与需求研判', '评估市场规模、进入方式与需求变化。', '客户开发与市场', 1, 3, 0],
  ['研', '#4d7c0f', '客户研究员', '客户画像与需求研究', '刻画理想客户、采购角色与待办任务。', '客户开发与市场', 1, 2, 0],
].map(([l, c, n, sub, d, dep, a, b, sop, hl]) => `<div class="scard${hl ? ' hl' : ''}"><div class="top2"><span class="av" style="background:${c}">${l}</span><div><b>${n}</b><small>${sub}</small><span class="ok">在岗 · 由调度长派工</span></div></div><p>${d}</p><span class="dep">${dep}</span><div class="st"><span>资料 <b>${a}</b></span><span>技能 <b>${b}</b></span><span>SOP <b>${sop}</b></span></div></div>`).join('')}</div>
<div class="foot2">288 名数字员工 · 只读展示<span style="margin-left:auto">演示数据</span></div>
</div>`),

    /* phone cards, 390 CSS px wide @3x */
    'inquiry-card': shot('回复草稿', 'focus narrow', 390, inquiryReply),
    'quote-card': shot('PI', 'focus narrow', 390, piCard),
    'outreach-card': shot('目标客户', 'focus narrow', 390, prospects),
    'brief-card': shot('本周业务简报', 'focus narrow', 390, `${metrics}\n${decisions}`),
    'follow-card': shot('跟进客户', 'focus narrow', 390, followCard(4)),

    /* phone cards of the split scenes, 390 CSS px wide @3x: what the chat did and
       what the right-hand app now shows, as one column */
    'crm-card': shot('客户CRM', 'focus narrow', 390, `${steps('已完成 4 个步骤', [
  ['识别名片', '6 张 · 公司、联系人、职位、邮箱'],
  ['与客户CRM查重', '1 家已是客户，已合并到原档案'],
  ['新建 5 家公司与联系人', '来源：广交会 2026 秋'],
  ['起草 5 封跟进邮件', '按展位上聊到的产品'],
])}
<div class="card" data-hot="table"><div class="ch">${icon('building-2')}客户CRM · 公司<span class="tag b">新建 5</span></div>
<div class="clist">${[
  ['B', '#2f6fed', 'Brightwell Home GmbH', '德国 · 保温杯 500 ml', 'new'],
  ['C', '#16a34a', 'Casa Lume S.r.l.', '意大利 · 咖啡随行杯', 'new'],
  ['N', '#ea7a12', 'Norte Cozinha Lda', '葡萄牙 · 焖烧罐', 'new'],
  ['K', '#7c3aed', 'Kestrel Outdoor Ltd', '英国 · 户外水壶 750 ml', 'new'],
  ['V', '#0d9488', 'Valmora Trading SA', '西班牙 · 礼盒套装', 'new'],
  ['K', '#dc2626', 'Kotikulma Oy', '芬兰 · 已是客户', 'merge'],
].map(([l, c, n, sub, st]) => `<div class="crow${st === 'merge' ? ' hl' : ''}"><i class="lg" style="background:${c}">${l}</i><div class="bd"><b>${n}</b><small>${sub}</small></div>${st === 'new' ? '<span class="tag b">新建</span>' : '<span class="tag w">已合并</span>'}</div>`).join('')}</div>
${bar('5 封跟进邮件待你确认', btn('逐封查看', 'mail') + btn('批准', 'check', true, 'approve'))}</div>`),
    'automation-card': shot('自动化中心', 'focus narrow', 390, `${steps('已完成 3 个步骤', [
  ['在自动化中心创建流程', '每天 09:00 · 读取销售工作台的报价记录'],
  ['试运行一次', '找到 2 位客户：Merituuli Oy、Havbris Home'],
  ['跟进草稿放进待审批', '发送前逐封等你确认'],
])}
<div class="card" data-hot="flow"><div class="ch">${icon('workflow')}报价 3 天未回复 → 起草跟进<span class="tag a">已开启</span></div>
<div class="flow">${[['calendar-clock', '每天 09:00'], ['briefcase', '读取报价记录'], ['list-filter', '3 天未回复'], ['mail', '起草跟进邮件'], ['shield-check', '等你批准']].map(([ic, t], i, a) => `<span class="fs${i === a.length - 1 ? ' gate' : ''}">${icon(ic)}${t}</span>${i < a.length - 1 ? icon('chevron-down', 'arr') : ''}`).join('')}</div>
${bar('2 封草稿待你确认', btn('查看草稿', 'mail') + btn('批准', 'check', true, 'approve'))}</div>`),
    'erp-card': shot('企业ERP', 'focus narrow', 390, `${steps('已完成 4 个步骤', [
  ['读取 PI-2026-1108', '500 只 SVF-500 + 500 个礼盒'],
  ['确认定金到账', '30% · US$ 630.00'],
  ['检查库存与产能', '杯体可用 1,200 只 · 礼盒需采购 500 个', true],
  ['生成生产工单草稿', 'WO-2026-0457 · 交期 12 月 2 日'],
])}
<div class="card" data-hot="wo"><div class="ch">${icon('clipboard-list')}生产工单 WO-2026-0457<span class="tag w">待确认</span></div>
<div class="fgrid"><div><span>产品</span>SVF-500 保温杯</div><div><span>数量</span>500 只</div><div><span>关联订单</span>PI-2026-1108</div><div><span>车间</span>二车间 · 丝印线</div><div><span>计划开工</span>2026-11-10</div><div><span>计划完工</span>2026-12-02</div></div>
<div class="clist" style="border-top:1px solid var(--line)">${[
  ['杯体 304 · 500 ml', '需求 500 · 库存 1,200', '充足', 'a'],
  ['杯盖组件（黑色）', '需求 500 · 库存 860', '充足', 'a'],
  ['丝印油墨 · 单色', '需求 2 kg · 库存 6 kg', '充足', 'a'],
  ['牛皮纸礼盒 GB-01', '需求 500 · 库存 0', '采购单草稿', 'w'],
].map(([n, sub, st, k]) => `<div class="crow${k === 'w' ? ' hl' : ''}"><div class="bd"><b>${n}</b><small>${sub}</small></div><span class="tag ${k}">${st}</span></div>`).join('')}</div>
${bar('下达前需要你确认', btn('查看工单', 'clipboard-list') + btn('确认下达', 'check', true, 'approve'))}</div>`),
    'staff-card': shot('数字员工派工', 'focus narrow', 390, `<div class="card" data-hot="staff"><div class="ch">${icon('users')}企业调度长已派工 · 4 步<span class="tag b">数字员工</span></div>
<div class="clist">${[
  ['询', '#1756d6', '询盘接待员', '读取询盘 · 提取产品、数量、交期'],
  ['档', '#7c3aed', '客户档案管家', '老客户 · 上次下单 92 天前 · 历史价 US$ 4.10'],
  ['背', '#0d9488', '客户背调员', '近期新开 2 家门店 · 付款记录良好'],
  ['报', '#dc2626', '报价员', '按价格表出报价草稿 · 老客户价'],
].map(([l, c, n, sub]) => `<div class="crow"><i class="lg round" style="background:${c}">${l}</i><div class="bd"><b>${n}</b><small>${sub}</small></div></div>`).join('')}</div></div>
<div class="card"><div class="ch">${icon('receipt-text')}报价草稿 · Kalvø Outdoor AS<span class="tag w">待你确认</span></div>
<dl class="kv"><dt>产品</dt><dd>户外水壶 750 ml</dd><dt>数量</dt><dd>1,200 只</dd><dt>单价</dt><dd>US$ 4.05 FOB</dd><dt>交期</dt><dd>28 天</dd></dl>
${bar('发送前需要你确认', btn('查看报价', 'file-text') + btn('批准', 'check', true, 'approve'))}</div>`),

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

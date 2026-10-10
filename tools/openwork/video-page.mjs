/**
 * OPEN WORK demo video — the animation page.
 *
 * One HTML page per language: the OPEN WORK window (the same warm-grey
 * interface as the stills in scenes.mjs, whose CSS this page loads first) on
 * the site's light blue-white ground, with a step rail under it. Nothing
 * moves by itself: every frame is a pure function of the time `t`, set by
 * `window.__seek(t)`. tools/openwork/video.mjs seeks frame by frame,
 * screenshots each frame and encodes the video, so the same command always
 * renders the same frames.
 *
 * Story (seconds; see T below):
 *   0–1.8     a demo buyer's inquiry arrives in the chat
 *   1.8–4.75  AI reads it: key phrases highlighted, facts as chips, 3 steps
 *   4.75–7.6  an English reply streams in; the PI fills in on the right
 *   7.6–11    price check: below standard → sales-manager approval bar
 *   11–12.85  the manager taps Approve: approved · sent (only after approval)
 *   12.85–15.35 end card; then the window dissolves back to frame 0 (loop)
 * A 「演示数据」 / "Demo data" badge sits in the window's title bar the whole
 * time. Every name, price and date is demonstration data.
 */

export const W = 1440;
export const H = 900;
export const FPS = 30;
export const DURATION = 16;
/** The poster: everything filled in, the manager's cursor on Approve. */
export const POSTER_T = 10.9;
/** Where the page starts the film the first time it plays (js/stargo-ow.js
    reads it from data-start): the inquiry is already in and AI is reading it,
    not the near-empty window of the first second, which the loop shows
    anyway when it comes round. */
export const START_T = 2;

/** Timeline, in seconds. */
export const T = {
  inqIn: 0.2,
  aiIn: 1.8,
  hl0: 2.05, hlStep: 0.26,
  st0: 2.95, stStep: 0.42,
  aiDone: 4.3,
  skelIn: 1.95,
  replyIn: 4.75, streamA: 4.95, streamB: 7.0,
  piHead: 5.25, piParties: 5.45, piRow1: 5.75, piRow2: 6.05, piTot: 6.3, piTerms: 6.7,
  flag: 7.6, barIn: 7.95,
  curIn: 9.8, curGlide: 1.05, tap: 11.0, approve: 11.15, curOut: 11.55,
  endIn: 12.85, veilOpaque: 15.05, endOut: 15.05, reset: 15.35,
};

export const STR = {
  zh: {
    lang: 'zh-CN',
    title: 'OPEN WORK 演示视频',
    badge: '演示数据',
    crumb: 'Nordhem Living · 询盘',
    inqHead: '新询盘 · 官网',
    inqWhen: '刚刚',
    inqFrom: 'Erik · Nordhem Living',
    inqMeta: '瑞典',
    aiReading: '正在读询盘…',
    aiDone: '已读懂询盘 · 3 个步骤',
    chips: [['产品', '500 ml 保温杯'], ['数量', '500 只'], ['报价', 'FOB'], ['市场', '瑞典'], ['交期', '12 月 20 日前']],
    steps: [['查询客户CRM', '新客户 · 家居零售'], ['检索企业知识库', 'SVF-500 · MOQ 300 · 交期 25 天'], ['按价格表测算报价', 'FOB 宁波 · US$ 3.85 / 只']],
    replyHead: '回复草稿 · English',
    tags: ['草稿', '待审批', '已发送'],
    composer: '继续追问，或输入 / 选择操作',
    tabs: ['销售工作台', '客户CRM', '企业知识库'],
    empty: 'PI 草稿会在这里生成',
    piSmall: '形式发票 · 演示数据',
    piDate: '2026-11-04 · 有效期 15 天',
    barPending: '单价低于标准价 4.2% → 需销售经理审批',
    barPendingSub: '审批人和底价由企业设定 · 批准前不会发给客户',
    btnBack: '退回修改',
    btnApprove: '批准',
    barDone: '已批准 · 已发送',
    barDoneSub: '销售经理已批准 · 回复和 PI 已发给 Erik',
    cursor: '销售经理',
    logHead: '审批记录',
    log: [['14:30', 'AI', '起草英文回复和 PI', 'b'], ['14:31', '价格校验', '低于标准价 4.2%，提交销售经理', 'w'], ['14:32', '销售经理', '批准 · 回复和 PI 已发出', 'a']],
    rail: ['询盘进来', 'AI 读懂', '回复与报价', '经理审批', '批准后发出'],
    eyebrow: 'STARGO WORK · 外贸工厂的 AI 工作台',
    end1: '询盘进来，AI 先读懂、先回复、先报价。',
    end2: '发不发，你来批。',
  },
  en: {
    lang: 'en',
    title: 'OPEN WORK demo video',
    badge: 'Demo data',
    crumb: 'Nordhem Living · Inquiry',
    inqHead: 'New inquiry · Website',
    inqWhen: 'just now',
    inqFrom: 'Erik · Nordhem Living',
    inqMeta: 'Sweden',
    aiReading: 'Reading the inquiry…',
    aiDone: 'Inquiry read · 3 steps',
    chips: [['Product', '500 ml flask'], ['Qty', '500 pcs'], ['Price', 'FOB'], ['Market', 'Sweden'], ['Delivery', 'before 20 Dec']],
    steps: [['Checked Customer CRM', 'new customer · home retail'], ['Searched the Knowledge Base', 'SVF-500 · MOQ 300 · 25-day lead time'], ['Priced from the price list', 'FOB Ningbo · US$ 3.85/pc']],
    replyHead: 'Reply draft · English',
    tags: ['Draft', 'Awaiting approval', 'Sent'],
    composer: 'Ask a follow-up, or type / for actions',
    tabs: ['Sales Workbench', 'Customer CRM', 'Knowledge Base'],
    empty: 'The PI draft will appear here',
    piSmall: 'Demo data',
    piDate: '2026-11-04 · valid 15 days',
    barPending: '4.2% below standard price → manager approval',
    barPendingSub: 'Your company sets the approver and the price floor.\nNothing goes out before approval.',
    btnBack: 'Revise',
    btnApprove: 'Approve',
    barDone: 'Approved · Sent',
    barDoneSub: 'Approved by the sales manager · reply and PI sent to Erik',
    cursor: 'Sales manager',
    logHead: 'Approval log',
    log: [['14:30', 'AI', 'Drafted the English reply and the PI', 'b'], ['14:31', 'Price check', '4.2% below standard → sales manager', 'w'], ['14:32', 'Sales manager', 'Approved · reply and PI sent', 'a']],
    rail: ['Inquiry in', 'AI reads it', 'Reply + quote', 'Manager approves', 'Sent after approval'],
    eyebrow: 'STARGO WORK · The AI workspace for export manufacturers',
    end1: 'Inquiry in. AI reads, replies and quotes first.',
    end2: 'You approve what goes out.',
  },
};
export const LANGS = Object.keys(STR);

/* The buyer's inquiry (English in both versions). [text, chip index] — the
   marked phrases light up in the order of the chips. */
export const INQUIRY = [
  ['Hi, could you quote '], ['500 ml vacuum flasks', 0], [' with our logo — '], ['500 pcs', 1], [', '], ['FOB price', 2],
  [', MOQ and lead time? We’re a home-goods retailer in '], ['Sweden', 3], [' and need them in Gothenburg '], ['before 20 Dec', 4], ['.'],
];
export const REPLY = `Hi Erik,
Thanks for your inquiry. 500 pcs of our SVF-500 vacuum flask (500 ml, 304 stainless) with your 1-colour logo: US$ 3.85/pc FOB Ningbo. MOQ 300; samples 5 days, production 25 days. Gothenburg before 20 Dec works if you confirm by 8 Nov. PI attached.`;
export const ITEMS = [
  ['SVF-500', 'Vacuum flask 500 ml, 304 SS, 1-colour logo', '500', '3.85', 1925],
  ['GB-01', 'Kraft gift box with insert', '500', '0.35', 175],
];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function videoCss() {
  return `
/* ---- OPEN WORK demo video (tools/openwork/video-page.mjs) ---------------- */
html,body{width:${W}px;height:${H}px;overflow:hidden}
body.vid{position:relative;margin:0;font-size:15px;line-height:1.55;color:var(--ink);background:#f3f7ff;text-rendering:geometricPrecision}
body.vid[lang=en]{font-feature-settings:'cv11','ss01','tnum' 0}
.vbg{position:absolute;inset:0;background:
  radial-gradient(760px 520px at 6% -4%,rgba(96,150,245,.22),rgba(96,150,245,0) 70%),
  radial-gradient(820px 560px at 104% 104%,rgba(59,120,240,.20),rgba(59,120,240,0) 70%),
  radial-gradient(600px 420px at 100% 0%,rgba(165,200,255,.30),rgba(165,200,255,0) 72%),
  linear-gradient(180deg,#f8faff 0%,#eef3ff 100%)}
.vbg::before,.vbg::after{content:'';position:absolute;width:520px;height:360px;opacity:.5;background-image:radial-gradient(#a9bfe8 1.1px,transparent 1.25px);background-size:10px 10px;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 30%,transparent 72%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 30%,transparent 72%)}
.vbg::before{left:-170px;top:-120px}
.vbg::after{right:-150px;bottom:-140px}
.vwin{position:absolute;left:56px;top:24px;width:1328px;height:784px;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:18px;background:var(--main);overflow:hidden;box-shadow:0 60px 120px -40px rgba(29,78,216,.30),0 24px 48px -24px rgba(15,23,42,.16),0 1px 3px rgba(15,23,42,.06)}
.wbar{position:relative;height:50px;flex:none;display:flex;align-items:center;gap:12px;padding:0 14px 0 18px;border-bottom:1px solid var(--line);background:var(--main);font-size:14.5px}
.lights{display:flex;gap:8px;margin-right:8px}
.lights i{width:12px;height:12px;border-radius:50%;background:#ff5f57;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.12)}
.lights i:nth-child(2){background:#febc2e}
.lights i:nth-child(3){background:#28c840}
.wbar .iconbtn{width:30px;height:30px}
.crumb2{display:flex;align-items:center;gap:9px;white-space:nowrap}
.crumb2 .bmark{display:flex;align-items:center;gap:7px;font-weight:700;letter-spacing:.02em;color:#141a33}
.crumb2 .bmark .spark{width:15px;height:15px}
.crumb2 .sep{color:var(--ink3)}
.crumb2 b{font-weight:600}
.vbadge{margin-left:auto;display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 13px 0 11px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:13.5px;font-weight:600;color:#2b2a2f;white-space:nowrap}
.vbadge i{width:7px;height:7px;border-radius:50%;background:#e09a1a;box-shadow:0 0 0 3px rgba(224,154,26,.16)}
.vsplit{flex:1;min-height:0;display:flex}
.vchat{width:604px;flex:none;display:flex;flex-direction:column;border-right:1px solid var(--line);background:var(--main)}
.vthread{flex:1;min-height:0;overflow:hidden;padding:20px 24px 0;display:flex;flex-direction:column;gap:14px}
.vthread>*{flex:none}
.vdock{flex:none;padding:10px 24px 18px}
.vdock .composer{padding:10px 10px 10px 18px;border-radius:14px}
.vdock .composer .ph{font-size:14.5px}
.vdock .send{width:36px;height:36px}
/* cards */
body.vid .card{margin:0;border-radius:14px}
body.vid .card .ch{font-size:14.5px;padding:11px 16px;gap:9px}
body.vid .card .ch .i{width:16px;height:16px}
body.vid .tag{height:24px;padding:0 10px;font-size:12.5px}
.inq .ch .i{color:var(--blue)}
.inq .ch em{margin-left:auto;font-style:normal;font-weight:400;font-size:13px;color:var(--ink3)}
.inq .dotnew{position:relative;display:grid;place-items:center}
.inq .dotnew::after{content:'';position:absolute;right:-2px;top:-2px;width:7px;height:7px;border-radius:50%;background:#2563eb;box-shadow:0 0 0 2px var(--card)}
.inq .who{display:flex;align-items:center;gap:10px;padding:12px 16px 0}
.inq .av{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#e5edfb;color:#1446ad;font-weight:700;font-size:13.5px;flex:none}
.inq .who b{font-size:14.5px;font-weight:600}
.inq .who small{font-size:13px;color:var(--ink3)}
.inq p{margin:0;padding:8px 16px 14px;font-size:15px;line-height:1.62;color:#2d2c29}
.hl{white-space:nowrap;border-radius:4px;padding:1px 2px;margin:0 -2px;background-image:linear-gradient(rgba(37,99,235,.15),rgba(37,99,235,.15));background-repeat:no-repeat;background-size:0% 100%;-webkit-box-decoration-break:clone;box-decoration-break:clone}
/* AI: steps + chips */
body.vid .steps{margin:0;padding:12px 16px 10px;border-radius:14px;overflow:hidden;flex:none}
body.vid .steps .h{font-size:14px;gap:8px;padding-bottom:2px;display:grid;grid-template-columns:auto 1fr;align-items:center}
.ahd{display:grid}
.ahd>span{grid-area:1/1;display:flex;align-items:center;gap:8px;white-space:nowrap}
.ahd .i{width:16px;height:16px}
.ahd .ok .i{color:var(--ok)}
.ahd .rd .i{color:var(--blue)}
.ahd .rd em{font-style:normal;background:linear-gradient(90deg,#4f4d49 0%,#4f4d49 35%,#9bb6ee 50%,#4f4d49 65%,#4f4d49 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.chips2{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 8px}
.chip2{display:inline-flex;align-items:center;gap:7px;height:31px;padding:0 12px;border-radius:999px;border:1px solid #d3e0f8;background:#eef4ff;font-size:14px;white-space:nowrap;color:#1446ad;font-weight:600}
.chip2 span{font-weight:500;color:#5b6b84}
body.vid .step{font-size:14.5px;padding:3px 0;gap:9px;align-items:center}
body.vid .step small{font-size:13.5px}
.stx{position:relative;width:16px;height:16px;flex:none}
.stx>*{position:absolute;inset:0;width:16px;height:16px;margin:0!important}
.stx .spin{color:var(--blue)}
/* reply */
.reply .ch .tagx{margin-left:auto;display:grid;justify-items:end}
.reply .ch .tagx>span{grid-area:1/1}
.reply .mailw{overflow:hidden}
body.vid .reply .mail{font-size:14.5px;line-height:1.62;padding:11px 16px 14px;white-space:pre-line}
.tok{opacity:0}
.caret{position:absolute;width:2px;height:18px;border-radius:1px;background:var(--blue);opacity:0}
/* panel */
.vpanel{flex:1;min-width:0;display:flex;flex-direction:column;background:#fbfaf8}
body.vid .ptabs{height:48px;padding:0 12px}
body.vid .ptab{height:32px;font-size:13.5px;padding:0 12px;gap:7px}
body.vid .ptab .i{width:14px;height:14px}
.pbody{position:relative;flex:1;min-height:0;padding:20px 20px;overflow:hidden;display:flex;flex-direction:column;gap:14px}
.pempty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--ink3);font-size:14.5px}
.pempty .tile{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:#f0ede8;color:#8a8782}
.pempty .tile .i{width:24px;height:24px}
body.vid .pi{background:#fff;flex:none}
body.vid .pi-head{padding:16px 18px 8px}
body.vid .pi-head b{font-size:17px}
body.vid .pi-head .no{font-size:15px}
body.vid .pi-head small{font-size:13px;margin-top:2px}
body.vid .pi-parties{font-size:14px;padding:8px 18px 14px;line-height:1.5}
body.vid .pi-parties>div>span{font-size:12.5px}
body.vid .pi-parties .f{display:block;width:fit-content;color:#3a3935;font-size:14px}
body.vid .pi-parties .fx{display:inline;color:inherit;font-size:inherit}
body.vid .pi table{font-size:14px}
body.vid .pi th{font-size:12.5px;padding:9px 10px}
body.vid .pi td{padding:11px 10px}
body.vid .pi th:first-child,body.vid .pi td:first-child{padding-left:16px}
body.vid .pi th:last-child,body.vid .pi td:last-child{padding-right:16px}
body.vid .pi .tot{font-size:14.5px;padding:12px 18px}
body.vid .pi .tot b{font-size:17px;font-variant-numeric:tabular-nums}
body.vid .pi .terms{font-size:13.5px;padding:0 18px 14px;line-height:1.5}
.f{position:relative;display:inline-block}
.f>.fx{opacity:var(--p,0)}
.f::before{content:'';position:absolute;left:0;right:0;top:50%;height:.8em;transform:translateY(-50%);border-radius:6px;opacity:calc(1 - var(--p,0));background:#ece8e2 linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0)) no-repeat;background-size:45% 100%;background-position:var(--sh,0%) 0}
td.n .f{min-width:3.2em}
.unit{border-radius:6px;padding:2px 6px;margin:-2px -6px}
/* approval log */
.vlog{flex:none;overflow:hidden}
.vlog .lrows{padding:6px 16px 9px}
.vlog .lr{display:flex;align-items:center;gap:11px;padding:5px 0;font-size:14px;white-space:nowrap}
.vlog .lr .ld{width:8px;height:8px;border-radius:50%;flex:none;background:#1756d6}
.vlog .lr .ld.w{background:#d38a12}
.vlog .lr .ld.a{background:#1f8a4c}
.vlog .lr em{font-style:normal;font-variant-numeric:tabular-nums;color:var(--ink3);font-size:13px;flex:none}
.vlog .lr b{font-weight:600;flex:none}
.vlog .lr span{color:var(--ink2);overflow:hidden;text-overflow:ellipsis}
/* approval bar */
.vbarw{overflow:hidden;height:0}
.vbar{position:relative;display:flex;align-items:center;gap:11px;padding:13px 14px 13px 16px;border-top:1px solid var(--line)}
.vbar .bico{position:relative;width:20px;height:20px;flex:none}
.vbar .bico .i{position:absolute;inset:0;width:20px;height:20px}
.vbar .bico .w{color:#b26a00}
.vbar .bico .a{color:var(--ok)}
.vbar .btxt{flex:1;min-width:0;display:grid;grid-template-columns:minmax(0,1fr)}
.vbar .btxt>div{grid-area:1/1;min-width:0}
.vbar .btxt b{display:block;font-size:15px;font-weight:650;line-height:1.35;white-space:nowrap}
.vbar .btxt small{display:block;font-size:13px;color:var(--ink2);line-height:1.4;margin-top:2px;white-space:nowrap}
/* the English rule is longer than the bar: two short sentences on two lines (the bar is measured with them) */
body.vid[lang=en] .vbar .pend small{white-space:pre-line}
.vbar .bact{position:relative;display:grid;justify-items:end;align-items:center}
.vbar .bact>*{grid-area:1/1}
.vbar .btns{display:flex;gap:8px}
body.vid .vbar .btn{height:36px;font-size:14px;padding:0 15px;border-radius:9px}
body.vid .vbar .btn .i{width:15px;height:15px}
.vbar .sent{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;background:#dff1e6;color:#16723e;font-size:13.5px;font-weight:600;white-space:nowrap}
.vbar .sent .i{width:15px;height:15px}
.ripple{position:absolute;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.30) 0%,rgba(37,99,235,.16) 55%,rgba(37,99,235,0) 72%);opacity:0;pointer-events:none}
/* step rail */
.rail{position:absolute;left:50%;top:828px;transform:translateX(-50%);display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(255,255,255,.66);border:1px solid rgba(255,255,255,.95);box-shadow:0 18px 40px -16px rgba(29,78,216,.32),0 2px 6px rgba(15,23,42,.06);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);white-space:nowrap}
.rind{position:absolute;top:5px;height:38px;border-radius:999px;background:#fff;box-shadow:0 6px 16px -6px rgba(29,78,216,.45),inset 0 0 0 1px rgba(37,99,235,.20)}
.ri{position:relative;display:flex;align-items:center;gap:9px;height:38px;padding:0 16px 0 8px;border-radius:999px;font-size:15px;font-weight:600}
.ri .n{position:relative;width:24px;height:24px;flex:none}
.ri .n>*{position:absolute;inset:0;display:grid;place-items:center;border-radius:50%;font-size:12.5px;font-weight:700;font-variant-numeric:tabular-nums}
.ri .n .num{background:#e7ecf5;color:#5b6b84}
.ri .n .act{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff}
.ri .n .dn{background:#dbe7ff;color:#1d4ed8}
.ri .n .dn .i{width:14px;height:14px;stroke-width:2.6}
/* cursor */
.vcur{position:absolute;left:0;top:0;z-index:40;opacity:0;transform-origin:3px 2px;pointer-events:none}
.vcur svg{display:block;width:26px;height:26px;filter:drop-shadow(0 3px 5px rgba(15,23,42,.28))}
.vcur .who{position:absolute;left:20px;top:22px;padding:4px 10px;border-radius:8px 999px 999px 999px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;font-size:13px;font-weight:600;white-space:nowrap;box-shadow:0 6px 14px -6px rgba(29,78,216,.7)}
/* end card */
.veil{position:absolute;left:0;right:0;top:51px;bottom:0;z-index:20;background:rgba(244,247,253,0)}
.endw{position:absolute;left:0;right:0;top:51px;bottom:0;z-index:21;display:grid;place-items:center;pointer-events:none}
.endc{width:960px;padding:44px 56px 40px;border-radius:28px;background:rgba(255,255,255,.80);border:1px solid rgba(255,255,255,.95);box-shadow:0 50px 100px -40px rgba(29,78,216,.40),0 12px 30px -16px rgba(15,23,42,.14);text-align:center;opacity:0}
.endc .eb{display:inline-flex;align-items:center;gap:9px;padding:6px 16px 6px 8px;border:1px solid rgba(37,99,235,.18);border-radius:999px;background:rgba(255,255,255,.8);color:#475569;font-size:15px;font-weight:500;box-shadow:0 6px 16px -10px rgba(37,99,235,.45)}
.endc .eb .sp{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff}
.endc .eb .sp .i{width:14px;height:14px;stroke-width:2}
.endc h2{margin:22px 0 0;font-size:42px;line-height:1.24;font-weight:700;letter-spacing:-.015em;color:#0f172a}
.endc h2>span{display:block;white-space:nowrap}
.endc h2 .g{background:linear-gradient(90deg,#1d4ed8 0%,#3b82f6 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
body.vid[lang=en] .endc h2{font-size:43px;font-weight:650;letter-spacing:-.03em;line-height:1.18}
.endc .lock{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:30px;padding-top:24px;border-top:1px solid #e6ebf4}
.endc .lock img.ic{width:40px;height:40px;border-radius:10px;box-shadow:0 6px 14px -6px rgba(15,23,42,.45)}
.endc .lock .wm{display:flex;align-items:center;gap:10px}
.endc .lock .wm img{height:25px;width:auto;display:block}
.endc .lock .wm b{font-size:25px;line-height:1;font-weight:800;letter-spacing:.06em;color:#2a2f3a;background:linear-gradient(180deg,#5b606b 0%,#22262e 55%,#4a4f5a 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
`;
}

/** The page for one language. `icon(name, cls)` returns a lucide SVG; `asset(path)` a file: URL into the repository. */
export function videoPage(lang, { icon, asset, cssHref }) {
  const s = STR[lang];
  if (!s) throw new Error(`video: unknown language ${lang}`);
  const spark = icon('sparkle', 'spark').replace('stroke="currentColor"', 'stroke="#1756d6" fill="#1756d6"');
  const inquiry = INQUIRY.map(([txt, i]) => i === undefined ? esc(txt) : `<span class="hl" data-i="${i}">${esc(txt)}</span>`).join('');
  /* The reply as tokens: a word and the space after it. Newlines stay text. */
  const tokens = REPLY.split(/(?<=\s)/).map((w) => `<span class="tok">${esc(w)}</span>`).join('');
  const fld = (v, at, cls = '') => `<span class="f${cls ? ` ${cls}` : ''}" data-t="${at}"><span class="fx">${v}</span></span>`;
  const usd = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const spinner = `<svg class="i spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9" stroke-opacity=".18"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>`;
  const rows = ITEMS.map(([c, d, q, u, a], r) => {
    const at = r ? T.piRow2 : T.piRow1;
    return `<tr><td>${fld(c, at)}</td><td>${fld(esc(d), at + 0.05)}</td><td class="n">${fld(q, at + 0.1)}</td><td class="n">${fld(`<span class="unit"${r ? '' : ' id="unit1"'}>${u}</span>`, at + 0.15)}</td><td class="n">${fld(`<span class="amt" data-v="${a}">${usd(a)}</span>`, at + 0.2)}</td></tr>`;
  }).join('');
  const body = `<div class="vbg"></div>
<div class="vwin" id="win">
  <div class="wbar"><span class="lights"><i></i><i></i><i></i></span>
    <span class="crumb2"><span class="iconbtn">${icon('panel-left')}</span><span class="bmark">${spark}OPEN WORK</span><span class="sep">/</span><b>${esc(s.crumb)}</b></span>
    <span class="vbadge" id="badge"><i></i>${esc(s.badge)}</span><span class="iconbtn">${icon('panel-right')}</span></div>
  <div class="vsplit">
    <div class="vchat"><div class="vthread" id="thread">
      <div class="card inq" id="inq"><div class="ch"><span class="dotnew">${icon('inbox')}</span>${esc(s.inqHead)}<em>${esc(s.inqWhen)}</em></div>
        <div class="who"><span class="av">E</span><b>${esc(s.inqFrom)}</b><small>${esc(s.inqMeta)}</small></div>
        <p>${inquiry}</p></div>
      <div class="steps ai" id="ai"><div class="h"><span class="ahd"><span class="rd">${spinner}<em>${esc(s.aiReading)}</em></span><span class="ok">${icon('circle-check')}${esc(s.aiDone)}</span></span></div>
        <div class="chips2">${s.chips.map(([k, v], i) => `<span class="chip2" data-i="${i}"><span>${esc(k)}</span>${esc(v)}</span>`).join('')}</div>
        ${s.steps.map(([a, b], i) => `<div class="step" data-i="${i}"><span class="stx">${spinner}${icon('check', 'ck')}</span><div>${esc(a)} <small><span class="dot">· </span>${esc(b)}</small></div></div>`).join('\n')}</div>
      <div class="card reply" id="reply"><div class="ch">${icon('mail')}${esc(s.replyHead)}<span class="tagx"><span class="tag g">${esc(s.tags[0])}</span><span class="tag w">${esc(s.tags[1])}</span><span class="tag a">${esc(s.tags[2])}</span></span></div>
        <div class="mailw"><div class="mail" id="mail">${tokens}</div></div></div>
    </div>
    <div class="vdock"><div class="composer"><span class="ph">${esc(s.composer)}</span><span class="send">${icon('arrow-up')}</span></div></div></div>
    <div class="vpanel"><div class="ptabs">${s.tabs.map((t, i) => `<span class="ptab${i === 0 ? ' on' : ''}">${icon(['briefcase', 'users', 'book-open'][i])}${esc(t)}${i === 0 ? icon('x', 'x') : ''}</span>`).join('')}<span class="tools">${icon('circle-help')}${icon('rotate-cw')}${icon('external-link')}</span></div>
      <div class="pbody">
        <div class="pempty" id="empty"><span class="tile">${icon('receipt-text')}</span>${esc(s.empty)}</div>
        <div class="card pi" id="pi">
          <div class="pi-head"><div><b>${fld('PROFORMA INVOICE', T.piHead)}</b><small>${fld(esc(s.piSmall), T.piHead + 0.05)}</small></div><div style="text-align:right"><b class="no">${fld('PI-2026-1108', T.piHead + 0.1)}</b><small>${fld(esc(s.piDate), T.piHead + 0.15)}</small></div></div>
          <div class="pi-parties"><div><span>Seller</span>${fld('STARGO Demo Manufacturing Co., Ltd.', T.piParties)}${fld('Ningbo, China', T.piParties + 0.05)}</div><div><span>Buyer</span>${fld('Nordhem Living AB', T.piParties + 0.1)}${fld('Gothenburg, Sweden', T.piParties + 0.15)}</div></div>
          <table><thead><tr><th>Item</th><th>Description</th><th class="n">Qty</th><th class="n">Unit (USD)</th><th class="n">Amount (USD)</th></tr></thead><tbody>${rows}</tbody></table>
          <div class="tot"><span>${fld('FOB Ningbo', T.piTot)}</span>${fld('Total <b>US$ <span id="total">2,100.00</span></b>', T.piTot + 0.05)}</div>
          <div class="terms">${fld('Payment: 30% T/T deposit, 70% before shipment · Lead time: 25 days after deposit', T.piTerms)}</div>
          <div class="vbarw" id="barw"><div class="vbar" id="bar">
            <span class="bico">${icon('triangle-alert', 'w')}${icon('circle-check', 'a')}</span>
            <span class="btxt"><div class="pend"><b>${esc(s.barPending)}</b><small>${esc(s.barPendingSub)}</small></div><div class="done"><b>${esc(s.barDone)}</b><small>${esc(s.barDoneSub)}</small></div></span>
            <span class="bact"><span class="btns">${`<span class="btn">${icon('undo-2')}${esc(s.btnBack)}</span><span class="btn pri" id="approve">${icon('check')}${esc(s.btnApprove)}</span>`}</span><span class="sent">${icon('send')}${esc(s.tags[2])} · 14:32</span></span>
            <span class="ripple" id="ripple"></span>
          </div></div>
        </div>
        <div class="card vlog" id="log"><div class="ch">${icon('clock')}${esc(s.logHead)}</div>
          <div class="lrows">${s.log.map(([tm, who, what, k], i) => `<div class="lr" data-i="${i}"><i class="ld ${k}"></i><em>${tm}</em><b>${esc(who)}</b><span>${esc(what)}</span></div>`).join('')}</div></div>
      </div>
    </div>
  </div>
  <div class="veil" id="veil"></div>
  <div class="endw"><div class="endc" id="end">
    <span class="eb"><span class="sp">${icon('sparkle')}</span>${esc(s.eyebrow)}</span>
    <h2><span class="l1">${esc(s.end1)}</span><span class="l2 g">${esc(s.end2)}</span></h2>
    <div class="lock"><img class="ic" src="${asset('assets/brand/stargo-icon-180.png')}" alt=""><span class="wm"><img src="${asset('assets/brand/stargo-wordmark.png')}" alt="STARGO"><b>WORK</b></span></div>
  </div></div>
</div>
<div class="rail" id="rail"><span class="rind" id="rind"></span>${s.rail.map((r, i) => `<span class="ri" data-i="${i}"><span class="n"><span class="num">${i + 1}</span><span class="act">${i + 1}</span><span class="dn">${icon('check')}</span></span>${esc(r)}</span>`).join('')}</div>
<div class="vcur" id="cur"><svg viewBox="0 0 26 26"><path d="M3 2.2 21.6 11c.9.4.8 1.7-.1 2l-7.2 2.2-3.3 6.9c-.4.9-1.7.8-2-.1L2.2 3.4c-.3-.8.4-1.5 1.1-1.2Z" fill="#fff" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="who">${esc(s.cursor)}</span></div>`;

  return `<!doctype html><html lang="${s.lang}"><head><meta charset="utf-8"><title>${esc(s.title)}</title><link rel="stylesheet" href="${cssHref}"></head>
<body class="vid" lang="${s.lang}">
${body}
<script>window.__init = () => (${client.toString()})(${JSON.stringify(T)}, ${DURATION});</script>
</body></html>`;
}

/* ---- runs in the page --------------------------------------------------- */
function client(T, D) {
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
  /** Hand over from one stacked state to the next at time `at`: the old one
      leaves first, then the new one arrives, so two texts never overlap. */
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

  const inq = $('#inq'), ai = $('#ai'), reply = $('#reply'), mail = $('#mail'), mailw = $('.mailw');
  const hls = $$('.hl'), chips = $$('.chip2'), steps = $$('.step'), toks = $$('.tok');
  const rd = $('.ahd .rd'), rdTxt = $('.ahd .rd em'), ok = $('.ahd .ok');
  const tags = $$('.reply .tagx .tag');
  const empty = $('#empty'), pi = $('#pi'), fields = $$('.f'), total = $('#total'), amts = $$('.amt'), unit1 = $('#unit1');
  const barw = $('#barw'), bar = $('#bar'), pend = $('.vbar .pend'), done = $('.vbar .done');
  const icoW = $('.vbar .bico .w'), icoA = $('.vbar .bico .a'), btns = $('.vbar .btns'), sent = $('.vbar .sent');
  const approve = $('#approve'), ripple = $('#ripple');
  const rail = $('#rail'), rind = $('#rind'), ris = $$('.ri');
  const log = $('#log'), lrs = $$('.vlog .lr');
  const cur = $('#cur'), veil = $('#veil'), end = $('#end'), l1 = $('.endc .l1'), l2 = $('.endc .l2'), eb = $('.endc .eb'), lock = $('.endc .lock');
  const caret = document.createElement('span'); caret.className = 'caret'; $('.reply').style.position = 'relative'; $('.reply').appendChild(caret);

  /* ---- measured once, at the final layout -------------------------------- */
  const lh = parseFloat(getComputedStyle(mail).lineHeight);
  const padT = parseFloat(getComputedStyle(mail).paddingTop), padB = parseFloat(getComputedStyle(mail).paddingBottom);
  const mtop = mail.getBoundingClientRect().top;
  const tokLine = toks.map((el) => Math.round((el.getBoundingClientRect().top - mtop - padT) / lh));
  const nLines = Math.max(...tokLine) + 1;
  /* reveal time per token: proportional to the characters before it */
  const lens = toks.map((el) => el.textContent.length);
  const totalLen = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  const tokAt = lens.map((n) => { const at = T.streamA + (acc / totalLen) * (T.streamB - T.streamA); acc += n; return at; });
  const lineAt = Array.from({ length: nLines }, (_, k) => tokAt[tokLine.indexOf(k)]);
  const barH = bar.offsetHeight;
  barw.style.height = barH + 'px';
  const railBox = rail.getBoundingClientRect();
  const riBox = ris.map((el) => ({ x: el.offsetLeft, w: el.offsetWidth }));
  const approveRect = approve.getBoundingClientRect();
  const approveBox = { x: approveRect.left + approveRect.width / 2, y: approveRect.top + approveRect.height / 2 };
  const barBox = bar.getBoundingClientRect();
  ripple.style.left = (approveBox.x - barBox.left) + 'px';
  ripple.style.top = (approveBox.y - barBox.top) + 'px';
  const fieldAt = fields.map((el) => parseFloat(el.dataset.t));
  /* cards that grow as their rows arrive: natural heights */
  const aiFull = ai.offsetHeight, chipsEl = $('.chips2'), chipsCs = getComputedStyle(chipsEl);
  const chipRow0 = chips[0].offsetTop, chip2nd = chips.find((c) => c.offsetTop > chipRow0 + 2);
  const chipRowH = chips[0].offsetHeight, chipGap = chip2nd ? chip2nd.offsetTop - chipRow0 - chipRowH : 0;
  const chipsFull = chipsEl.offsetHeight + parseFloat(chipsCs.marginTop) + parseFloat(chipsCs.marginBottom);
  const chipsRow2At = chip2nd ? T.hl0 + (+chip2nd.dataset.i) * T.hlStep + 0.14 : Infinity;
  const stepH = steps.map((el) => el.offsetHeight);
  const logFull = log.offsetHeight, lrH = lrs.map((el) => el.offsetHeight);
  const LOG = [T.piTerms + 0.35, T.barIn + 0.25, T.approve + 0.35];
  barw.style.height = '0px';

  const INK3 = [138, 135, 130], BLUE = [20, 70, 173], INK2 = [79, 77, 73], INK = [45, 44, 41], AMBER = [154, 90, 0];
  const BOUNDS = [0, T.aiIn, T.replyIn, T.flag, T.approve];

  function seek(t) {
    const tt = t >= T.reset ? 0 : t;              // after the end card the window is back at frame 0

    /* inquiry */
    fadeUp(inq, eo(seg(tt, T.inqIn, T.inqIn + 0.6)), 18, 0.985);
    hls.forEach((el) => {
      const i = +el.dataset.i, p = eo(seg(tt, T.hl0 + i * T.hlStep, T.hl0 + i * T.hlStep + 0.32));
      el.style.backgroundSize = `${r3(p * 100)}% 100%`;
      el.style.color = mix(INK, BLUE, p);
    });

    /* AI reads it */
    fadeUp(ai, eo(seg(tt, T.aiIn, T.aiIn + 0.45)), 14);
    swap(rd, ok, tt, T.aiDone);
    rd.querySelector('.spin').style.transform = `rotate(${Math.round(tt * 400) % 360}deg)`;
    rdTxt.style.backgroundPosition = `${r3(100 - ((tt * 0.9) % 1) * 140)}% 0`;
    chips.forEach((el) => {
      const i = +el.dataset.i, a = T.hl0 + i * T.hlStep + 0.14;
      const p = seg(tt, a, a + 0.42);
      el.style.opacity = r3(eo(seg(tt, a, a + 0.22)));
      el.style.transform = `scale(${r3(lerp(0.86, 1, back(p)))})`;
    });
    steps.forEach((el) => {
      const i = +el.dataset.i, a = T.st0 + i * T.stStep;
      fadeUp(el, eo(seg(tt, a, a + 0.3)), 6);
      const pc = seg(tt, a + 0.32, a + 0.62);
      const sp = el.querySelector('.spin'), ck = el.querySelector('.ck');
      sp.style.opacity = r3(1 - eo(seg(tt, a + 0.3, a + 0.42)));
      sp.style.transform = `rotate(${Math.round(tt * 420 + i * 70) % 360}deg)`;
      ck.style.opacity = r3(eo(seg(tt, a + 0.32, a + 0.44)));
      ck.style.transform = `scale(${r3(lerp(0.4, 1, back(pc)))})`;
    });

    const chipsH = (chipsFull - (chip2nd ? chipGap + chipRowH : 0)) * eo(seg(tt, T.hl0 + 0.1, T.hl0 + 0.4)) + (chip2nd ? (chipGap + chipRowH) * eo(seg(tt, chipsRow2At - 0.04, chipsRow2At + 0.26)) : 0);
    const stepsH = steps.reduce((h, el, i) => h + stepH[i] * eo(seg(tt, T.st0 + i * T.stStep - 0.04, T.st0 + i * T.stStep + 0.26)), 0);
    ai.style.height = r3(aiFull - chipsFull - stepH.reduce((a, b) => a + b, 0) + chipsH + stepsH) + 'px';

    /* reply streams in */
    fadeUp(reply, eo(seg(tt, T.replyIn, T.replyIn + 0.45)), 14);
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
      const tr = toks[last].getClientRects(), lastR = tr[tr.length - 1], base = $('.reply').getBoundingClientRect();
      caret.style.left = r3(lastR.right - base.left + 1) + 'px';
      caret.style.top = r3(lastR.top - base.top + (lastR.height - 18) / 2) + 'px';
      caret.style.opacity = r3(1 - eo(seg(tt, T.streamB + 0.15, T.streamB + 0.45)));
    } else caret.style.opacity = 0;
    swap(tags[0], tags[1], tt, T.barIn, 0, true);
    if (tt >= T.approve) swap(tags[1], tags[2], tt, T.approve + 0.1, 0, true);
    else tags[2].style.opacity = 0;

    /* the PI fills in */
    const pIn = eo(seg(tt, T.skelIn, T.skelIn + 0.5));
    empty.style.opacity = r3(1 - eo(seg(tt, T.skelIn - 0.1, T.skelIn + 0.25)));
    fadeUp(pi, pIn, 16, 0.99);
    document.body.style.setProperty('--sh', `${r3(lerp(-60, 160, (tt * 0.85) % 1))}%`);
    fields.forEach((el, i) => el.style.setProperty('--p', r3(eo(seg(tt, fieldAt[i], fieldAt[i] + 0.35)))));
    total.textContent = usd(2100 * eo(seg(tt, T.piTot, T.piTot + 0.65)));
    amts.forEach((el, i) => { const at = (i ? T.piRow2 : T.piRow1) + 0.2; el.textContent = usd(+el.dataset.v * eo(seg(tt, at, at + 0.45))); });

    /* price check → approval bar */
    const pf = eo(seg(tt, T.flag, T.flag + 0.35));
    const pulse = seg(tt, T.flag, T.flag + 0.7);
    unit1.style.background = `rgba(251,234,204,${r3(pf)})`;
    unit1.style.color = mix([28, 28, 30], AMBER, pf);
    unit1.style.fontWeight = pf > 0.5 ? 650 : 400;
    unit1.style.boxShadow = pulse > 0 && pulse < 1 ? `0 0 0 ${r3(eo(pulse) * 9)}px rgba(224,154,26,${r3(0.35 * (1 - pulse))})` : 'none';
    const pb = eo4(seg(tt, T.barIn, T.barIn + 0.5));
    barw.style.height = r3(barH * pb) + 'px';
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
    ripple.style.opacity = pr > 0 && pr < 1 ? r3(1 - eo(pr)) : 0;
    ripple.style.transform = `scale(${r3(lerp(0.35, 1.5, eo(pr)))})`;

    /* approval log */
    fadeUp(log, eo(seg(tt, LOG[0] - 0.15, LOG[0] + 0.3)), 12);
    let lh2 = logFull;
    lrs.forEach((el, i) => {
      const g = eo(seg(tt, LOG[i] - 0.05, LOG[i] + 0.3));
      lh2 -= lrH[i] * (1 - g);
      el.style.opacity = r3(eo(seg(tt, LOG[i], LOG[i] + 0.35)));
      el.style.transform = `translateX(${r3((1 - eo(seg(tt, LOG[i], LOG[i] + 0.4))) * -8)}px)`;
    });
    log.style.height = r3(lh2) + 'px';

    /* the manager's cursor */
    const pc = eio(seg(tt, T.curIn, T.curIn + T.curGlide));
    /* from below left, onto the button's icon, so its label stays readable and the name tag stays inside the window */
    const P1 = { x: approveRect.left + 13, y: approveBox.y + 7 }, P0 = { x: P1.x - 210, y: P1.y + 175 }, C = { x: P1.x - 30, y: P1.y + 150 };
    const bx = (1 - pc) * (1 - pc) * P0.x + 2 * (1 - pc) * pc * C.x + pc * pc * P1.x;
    const by = (1 - pc) * (1 - pc) * P0.y + 2 * (1 - pc) * pc * C.y + pc * pc * P1.y;
    const drift = eio(seg(tt, T.tap + 0.18, T.curOut + 0.4));
    const pt = seg(tt, T.tap - 0.04, T.tap + 0.22);
    const cs = pt > 0 && pt < 1 ? 1 - 0.14 * Math.sin(pt * Math.PI) : 1;
    cur.style.transform = `translate(${r3(bx - drift * 64 - 3)}px, ${r3(by + drift * 46 - 2)}px) scale(${r3(cs)})`;
    cur.style.opacity = r3(eo(seg(tt, T.curIn, T.curIn + 0.3)) * (1 - eo(seg(tt, T.curOut, T.curOut + 0.4))));

    /* step rail */
    const k = BOUNDS.filter((b) => tt >= b).length - 1;
    const pk = eio(seg(tt, BOUNDS[k], BOUNDS[k] + 0.4));
    const from = riBox[Math.max(0, k - 1)], to = riBox[k];
    rind.style.left = r3(lerp(from.x, to.x, k ? pk : 1)) + 'px';
    rind.style.width = r3(lerp(from.w, to.w, k ? pk : 1)) + 'px';
    ris.forEach((el, i) => {
      const act = i === k ? (k ? pk : 1) : i === k - 1 ? 1 - pk : 0;
      const dn = i < k ? (i === k - 1 ? pk : 1) : 0;
      el.style.color = dn > 0 ? mix(BLUE, INK2, dn) : mix([91, 107, 132], BLUE, act);
      el.querySelector('.act').style.opacity = r3(act * (1 - dn));
      el.querySelector('.dn').style.opacity = r3(dn);
      el.querySelector('.num').style.opacity = r3(1 - Math.max(act, dn));
    });
    const railIn = t >= T.reset ? eo(seg(t, T.reset + 0.15, D - 0.05)) : 1 - eo(seg(t, T.endIn, T.endIn + 0.4));
    rail.style.opacity = r3(railIn);
    rail.style.transform = `translateX(-50%) translateY(${r3((1 - railIn) * 10)}px)`;

    /* end card, then back to frame 0 */
    let va, blur;
    if (t < T.reset) {
      va = 0.62 * eo(seg(t, T.endIn, T.endIn + 0.5)) + 0.38 * eio(seg(t, T.veilOpaque, T.reset));
      blur = 14 * eo(seg(t, T.endIn, T.endIn + 0.5));
    } else { va = 1 - eio(seg(t, T.reset + 0.05, D)); blur = 0; }
    veil.style.background = `rgba(244,247,253,${r3(va)})`;
    veil.style.backdropFilter = veil.style.webkitBackdropFilter = blur > 0.01 ? `blur(${r3(blur)}px)` : 'none';
    const pe = eo(seg(t, T.endIn + 0.12, T.endIn + 0.62)) * (1 - eo(seg(t, T.endOut, T.endOut + 0.28)));
    end.style.opacity = r3(pe);
    end.style.transform = `translateY(${r3((1 - eo(seg(t, T.endIn + 0.12, T.endIn + 0.7))) * 16)}px) scale(${r3(lerp(0.97, 1, eo(seg(t, T.endIn + 0.12, T.endIn + 0.7))))})`;
    [eb, l1, l2, lock].forEach((el, i) => {
      const a = T.endIn + 0.2 + i * 0.12;
      fadeUp(el, eo(seg(t, a, a + 0.5)), 10);
    });
  }

  /** Layout problems at time t: clipped, overflowing or overlapping text. */
  function check(t) {
    seek(t);
    const out = [];
    const thread = $('#thread'), comp = $('.vdock .composer').getBoundingClientRect();
    const lastCard = reply.getBoundingClientRect();
    if (lastCard.bottom > comp.top - 10) out.push(`chat column: reply card comes within ${Math.floor(comp.top - lastCard.bottom)}px of the composer`);
    const win = $('#win').getBoundingClientRect();
    if (+getComputedStyle(cur).opacity > 0.01) for (const el of [cur.querySelector('svg'), cur.querySelector('.who')]) {
      const r = el.getBoundingClientRect();
      if (r.left < win.left || r.right > win.right || r.bottom > win.bottom) out.push('cursor or its name tag outside the window');
    }
    if (thread.scrollWidth > thread.clientWidth + 1) out.push('chat column overflows sideways');
    const pb = $('.pbody').getBoundingClientRect(), pr = log.getBoundingClientRect();
    if (pr.bottom > pb.bottom - 8) out.push(`panel: approval log cut off by ${Math.ceil(pr.bottom - pb.bottom + 8)}px`);
    for (const el of $$('.vlog .lr span')) if (el.scrollWidth > el.clientWidth + 1) out.push(`truncated: ${el.textContent}`);
    for (const el of $$('.card, .steps, .vbar, .pi table, .endc, .rail, .chips2, .ch, .pi-head, .tot, .terms, .vbar .btxt, .vbar .btxt b, .vbar .btxt small, .inq p, .mail, .step')) {
      if (el.scrollWidth > el.clientWidth + 1) out.push(`overflows sideways: ${el.className} (${el.scrollWidth} > ${el.clientWidth})`);
    }
    const chipTops = new Set(chips.map((c) => c.offsetTop));
    if (chipTops.size > 2) out.push(`chips wrap to ${chipTops.size} rows`);
    const pendSub = $('.vbar .pend small');
    if (pendSub.getBoundingClientRect().height > parseFloat(getComputedStyle(pendSub).lineHeight) * 2.5) out.push('approval bar: the rule takes more than two lines');
    for (const el of $$('.btn, .tag, .chip2, .ri, .vbadge, .ptab, .sent, .vbar .btxt b, .vbar .btxt small, .endc h2>span, .eb')) {
      if (el === pendSub && document.body.lang === 'en') continue;
      const cs = getComputedStyle(el);
      const lhh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
      if (el.getClientRects().length > 1 || el.getBoundingClientRect().height > Math.max(lhh * 1.5, parseFloat(cs.height) + 1 || 0)) out.push(`wraps: ${el.textContent.trim().slice(0, 40)}`);
    }
    const vb = $('.vbar'), bt = $('.vbar .btxt').getBoundingClientRect(), ba = $('.vbar .bact').getBoundingClientRect();
    if (bt.right > ba.left - 4) out.push('approval bar: text runs into the buttons');
    const cr = rail.getBoundingClientRect();
    if (cr.left < 16 || cr.right > document.documentElement.clientWidth - 16) out.push('rail wider than the frame');
    const ec = end.getBoundingClientRect(), ew = $('.endw').getBoundingClientRect();
    if (ec.width > ew.width - 40 || ec.height > ew.height - 40) out.push('end card too big');
    void vb;
    return out;
  }

  window.__seek = seek;
  window.__check = check;
  seek(0);
  return true;
}

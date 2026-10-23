/**
 * 真实界面 — the homepage's product tour, right under the hero.
 *
 * The owner asked (2026-10-23) why a buyer should believe the system exists
 * when most of the page is illustration. Every picture in this block is a
 * clean capture of the running system with demo data (assets/stargo-product/
 * live*, the same files the stage cards and phone mockups were cut from); no
 * generated image may go in here. It follows one inquiry through five screens,
 * and each screen carries numbered markers that point at the part of the
 * capture the matching sentence talks about.
 *
 * Markers are placed in percent of the picture (x, y), so they stay on their
 * target at every width. The phone tab shows two screens side by side and its
 * markers say which one (`shot`).
 *
 * Self-contained: css/stargo-tour.css and js/stargo-tour.js, class prefix
 * `sg-tour`, nothing shared with the template's stylesheets.
 */
import { escapeHtml } from './lib-html.mjs';

const P = 'assets/stargo-product/';
const srcset = (base) => [480, 768, 1024].map((w) => `${P}${base}-${w}.webp ${w}w`).concat(`${P}${base}.webp 1600w`).join(', ');

export const TOUR = {
  eyebrow: { zh: '(真实界面 · 不是效果图)', en: '(The real product · not a render)' },
  title: { zh: '先看真系统，再决定。', en: 'See the real system first.' },
  lead: {
    zh: '下面每一张都是 STARGO WORK 的真实截图。跟着一单生意走一遍：找客户、接询盘、报价审批、产品资料，再到手机上处理。',
    en: 'Every picture below is a screenshot of STARGO WORK itself. Follow one deal through it: finding buyers, answering the inquiry, approving the quote, the product catalogue, and handling it on the phone.',
  },
  note: { zh: '截图中的客户名称和数字为演示数据。点截图可放大看。', en: 'The screens show the Chinese interface; customer names and figures are demo data. Click a screenshot to enlarge it.' },
  cta: { zh: '预约真机演示', en: 'Book a live demo' },
  more: { zh: '看全部能力', en: 'See all capabilities' },
  tabsLabel: { zh: '真实界面导览', en: 'Product tour' },
  steps: [
    {
      tab: { zh: '找客户', en: 'Find buyers' },
      product: 'Growth OS',
      title: { zh: '告诉它卖什么、卖给谁，它去找客户。', en: 'Tell it what you sell and to whom. It finds the buyers.' },
      shots: [{ base: 'live05-growth-home-2x1', w: 1600, h: 788, alt: { zh: 'Growth OS 首页真实截图：上手指引、开始找客户、发送开发信', en: 'Growth OS home, real screenshot: setup guide, find customers, send outreach' } }],
      points: [
        { x: 12, y: 21, zh: '上手六步，做到哪一步、下一步做什么，一眼看清。', en: 'Six setup steps: where you are and what comes next.' },
        { x: 9, y: 74, zh: '按你的产品和目标市场找潜在客户，并写出为什么合适。花钱前先请你确认数量和花费。', en: 'Finds prospects for your products and markets and says why each one fits. Asks you to confirm quantity and cost first.' },
        { x: 60, y: 59, zh: '发开发信之前缺什么条件，它直接告诉你，不会乱发。', en: 'Before any outreach it tells you what is still missing. Nothing goes out half-ready.' },
        { x: 29, y: 90, zh: '也可以直接对 AI 说：「帮我找 10 位客户」。', en: 'Or just tell the AI: “find me 10 buyers”.' },
      ],
    },
    {
      tab: { zh: '接询盘', en: 'Answer inquiries' },
      product: 'Sales Desk',
      title: { zh: '询盘来了，谁先回、怎么回，一屏看完。', en: 'Who to answer first, and how, on one screen.' },
      shots: [{ base: 'live09-sales-desk-case-16x9', w: 1600, h: 900, alt: { zh: 'Sales Desk 真实截图：询盘列表、成交七步、AI 起草回复与提交审批', en: 'Sales Desk, real screenshot: inquiry list, seven deal stages, AI draft reply and submit for approval' } }],
      points: [
        { x: 24, y: 4, zh: '待回复、超时没回、等你审批，每天一打开就知道。', en: 'Waiting for reply, overdue, waiting for your approval: visible the moment you open it.' },
        { x: 44, y: 16, zh: '这单走到哪一步（新询盘到已成交共七步）；型号、数量、目的港、贸易术语自动整理好。', en: 'Which of the seven stages the deal is in; model, quantity, destination and Incoterm already pulled out.' },
        { x: 62, y: 71, zh: '系统给出下一步，点「让 AI 做这一步」，回复就起草好。', en: 'It proposes the next step. Click “let AI do it” and the reply is drafted.' },
        { x: 93, y: 39, zh: 'AI 助手读完这个客户的全部往来，帮你分析、整理报价需求。', en: 'The AI assistant has read every message with this customer and helps you analyse and prepare the quote.' },
        { x: 68, y: 94, zh: '「提交审批」：AI 不会直接发给客户，人批了才发。', en: '“Submit for approval”: the AI never sends to a customer on its own.' },
      ],
    },
    {
      tab: { zh: '报价审批', en: 'Approve quotes' },
      product: 'Sales Desk',
      title: { zh: '价格、交期、认证，必须人来拍板。', en: 'Price, lead time and certification are signed off by a person.' },
      shots: [{ base: 'live18-quote-approval-16x9', w: 1600, h: 900, bare: true, alt: { zh: '报价审批真实截图：从邮件接入到 PI 的七步流程与待审批报价', en: 'Quote approval, real screenshot: the seven steps from email to PI and a quote waiting for approval' } }],
      points: [
        { x: 56, y: 34, zh: '从邮件接入到出 PI，每一步做到哪里都标得清清楚楚。', en: 'From email intake to the PI, every step shows its state.' },
        { x: 24, y: 40, zh: '重要承诺只能转人工处理，AI 不替你答应。', en: 'Important commitments go to a person. The AI does not promise on your behalf.' },
        { x: 88, y: 93, zh: '每个报价版本单独审批，过期或旧版本不能被批。', en: 'Each quote version is approved on its own; old or expired versions cannot be.' },
        { x: 7, y: 52, zh: '左边红点：现在有几单在等你批。', en: 'The red badge: how many are waiting for you.' },
      ],
    },
    {
      tab: { zh: '产品资料', en: 'Product catalogue' },
      product: 'ERP',
      title: { zh: '产品资料在系统里，AI 回复和报价才有依据。', en: 'Your catalogue lives in the system, so replies and quotes have a source.' },
      shots: [{ base: 'live23-erp-items-16x9', w: 1600, h: 899, alt: { zh: 'ERP 物料列表真实截图：STARGO 锂电池各系列产品', en: 'ERP item list, real screenshot: STARGO lithium battery series' } }],
      points: [
        { x: 16, y: 44, zh: '这是我们自己工厂的真实产品库：STARGO 锂电池各系列。', en: 'This is our own factory’s real catalogue: STARGO lithium battery series.' },
        { x: 91, y: 22, zh: '177 个物料，按物料组、变体管理，随时筛选。', en: '177 items, organised by group and variant, filterable.' },
        { x: 95, y: 3, zh: '新产品随手加，AI 回复客户时自动引用。', en: 'Add a product once; the AI cites it when it answers customers.' },
      ],
    },
    {
      tab: { zh: '手机处理', en: 'On the phone' },
      product: 'Sales Desk',
      title: { zh: '出门在外，手机上也能回、也能批。', en: 'Away from the desk, answer and approve from the phone.' },
      phone: true,
      shots: [
        { base: 'live51-mobile-board-screen', w: 1170, h: 2672, alt: { zh: '手机看板真实截图：待我回复、等你审批、最可能成交', en: 'Phone board, real screenshot: to reply, waiting for approval, most likely to close' } },
        { base: 'live52-mobile-case-screen', w: 1170, h: 2672, alt: { zh: '手机询盘真实截图：AI 起草回复、中文对照、提交审批', en: 'Phone inquiry, real screenshot: AI draft, Chinese side-by-side, submit for approval' } },
      ],
      points: [
        { shot: 0, x: 26, y: 31, zh: '看板：待回复、等你审批、有成交信号，一眼看完。', en: 'The board: to reply, to approve, buying signals, at a glance.' },
        { shot: 0, x: 21, y: 71, zh: '等你审批的单子排在最前面。', en: 'Anything waiting for your approval sits on top.' },
        { shot: 1, x: 59, y: 54, zh: '打开一单，点一下让 AI 起草回复。', en: 'Open a deal and let the AI draft the reply.' },
        { shot: 1, x: 20, y: 82, zh: '英文回复配中文对照，只给你看，不发给客户。', en: 'A Chinese version of the English reply, for your eyes only.' },
        { shot: 1, x: 82, y: 90, zh: '确认无误，一键提交审批。', en: 'When it reads right, submit it for approval.' },
      ],
    },
  ],
};

const t = (p, lang) => (typeof p === 'string' ? p : p[lang]);

function shotHtml(step, shot, si, lang) {
  const sizes = step.phone ? '(max-width: 767px) 45vw, 260px' : '(max-width: 991px) 100vw, 62vw';
  const pins = step.points
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => (p.shot ?? 0) === si)
    // a ring around the spot (the UI under it stays readable) with its number in a badge on the ring's edge
    .map(({ p, i }) => `<span class="sg-tour-pin" data-pin="${i}" style="left:${p.x}%;top:${p.y}%" aria-hidden="true"><b>${i + 1}</b></span>`)
    .join('');
  const img = `<img src="${P}${shot.base}.webp" srcset="${srcset(shot.base)}" sizes="${sizes}" width="${shot.w}" height="${shot.h}" loading="lazy" decoding="async" alt="${escapeHtml(t(shot.alt, lang))}" class="sg-tour-img"/>`;
  if (step.phone) return `<div class="sg-tour-phone"><div class="sg-tour-pic">${img}${pins}</div></div>`;
  // a capture that already has its own window title bar gets no second one
  if (shot.bare) return `<div class="sg-tour-window"><div class="sg-tour-pic">${img}${pins}</div></div>`;
  return `<div class="sg-tour-window"><div class="sg-tour-bar" aria-hidden="true"><i></i><i></i><i></i><span>STARGO WORK · ${escapeHtml(step.product)}</span></div><div class="sg-tour-pic">${img}${pins}</div></div>`;
}

export function productTour(lang) {
  const T = TOUR;
  const tabs = T.steps.map((s, i) => `<button type="button" role="tab" id="sg-tour-tab-${i}" class="sg-tour-tab" aria-controls="sg-tour-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="sg-tour-num">0${i + 1}</span>${escapeHtml(t(s.tab, lang))}</button>`).join('');
  const panels = T.steps.map((s, i) => {
    const shots = s.shots.map((sh, si) => shotHtml(s, sh, si, lang)).join('');
    const list = s.points.map((p, j) => `<li data-pin="${j}"><span class="sg-tour-pin" aria-hidden="true">${j + 1}</span><span>${escapeHtml(t(p, lang))}</span></li>`).join('');
    return `<div role="tabpanel" id="sg-tour-panel-${i}" class="sg-tour-panel${s.phone ? ' is-phone' : ''}" aria-labelledby="sg-tour-tab-${i}"${i === 0 ? '' : ' hidden'}>`
      + `<div class="sg-tour-stage">${shots}</div>`
      + `<div class="sg-tour-copy"><p class="sg-tour-product">${escapeHtml(s.product)}</p><h3 class="sg-tour-h3">${escapeHtml(t(s.title, lang))}</h3><ol class="sg-tour-points">${list}</ol></div>`
      + '</div>';
  }).join('');
  return `<section id="product" class="sg-tour" aria-labelledby="sg-tour-title"><div class="sg-tour-inner">`
    + `<div class="sg-tour-head"><p class="sg-tour-eyebrow">${escapeHtml(t(T.eyebrow, lang))}</p><h2 id="sg-tour-title" class="sg-tour-title">${escapeHtml(t(T.title, lang))}</h2><p class="sg-tour-lead">${escapeHtml(t(T.lead, lang))}</p></div>`
    + `<div class="sg-tour-tabs" role="tablist" aria-label="${escapeHtml(t(T.tabsLabel, lang))}">${tabs}</div>`
    + panels
    + `<div class="sg-tour-foot"><p class="sg-tour-note">${escapeHtml(t(T.note, lang))}</p><div class="sg-tour-actions"><a href="contact.html" class="sg-tour-btn is-primary">${escapeHtml(t(T.cta, lang))}</a><a href="capabilities.html" class="sg-tour-btn">${escapeHtml(t(T.more, lang))}</a></div></div>`
    + `</div></section>`;
}

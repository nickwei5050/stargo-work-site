/**
 * What every OPEN WORK homepage section shares: the product renders and their
 * hotspots, the framed product shot, buttons, headings and the line icons.
 *
 * The renders are tools/openwork/ output registered in
 * tools/imagegen/product-assets.json; tools/editorial-images.mjs gives every
 * `<img>` here its alt text (ending 「产品界面示意（演示数据）」 / "… demo
 * data"), its width/height and its srcset, and uses `data-sizes` as the
 * `sizes` it writes. A `<source>` for phones is written here from the same
 * register, because that pass only rewrites `<img>` tags.
 */
import { readFileSync } from 'node:fs';
import { escapeHtml, zhWbr } from '../lib-html.mjs';

const PRODUCTS = new Map(JSON.parse(readFileSync(new URL('../imagegen/product-assets.json', import.meta.url), 'utf8')).assets.map((a) => [a.id, a]));
const HOT = JSON.parse(readFileSync(new URL('../openwork/hotspots.json', import.meta.url), 'utf8')).images;

export const esc = escapeHtml;

/** A registered OPEN WORK render, or a build failure. */
export function asset(id) {
  const a = PRODUCTS.get(id);
  if (!a || !/^ow\d{2}-/.test(id)) throw new Error(`ow-blocks: ${id} is not a registered OPEN WORK render`);
  return a;
}

/** A hotspot box of a render, in percent of the image (tools/openwork/hotspots.json). */
export function hotspot(id, key) {
  const box = HOT[id]?.[key];
  if (!box) throw new Error(`ow-blocks: no hotspot ${key} on ${id} (re-run tools/openwork/render.mjs?)`);
  return box;
}

/* Renders whose right-hand app panel (客户CRM, 自动化中心, 企业ERP, the 数字员工
   roster) was drawn for this site, not rebuilt from an owner screenshot of
   that app, and their phone cards: the note under them says 「界面示意」
   (copy.mjs HOME_OW.shotNoteIllustrative), not 「实际界面布局」. */
export const ILLUSTRATIVE = new Set(['ow08-crm', 'ow09-automation', 'ow10-erp', 'ow11-staff', 'ow17-crm-card', 'ow18-automation-card', 'ow19-erp-card', 'ow25-staff-card']);
/** The note for the shots `ids` (any of them illustrative → the illustrative note). */
export const shotNoteFor = (O, ...ids) => (ids.flat().some((id) => ILLUSTRATIVE.has(id)) ? O.shotNoteIllustrative : O.shotNote);

/** srcset of a render: its variants and its main file, narrowest first. */
export const srcset = (a) => [...a.variants, a].sort((x, y) => x.width - y.width).map((v) => `${v.src} ${v.width}w`).join(', ');

/** Text with its [[key phrase]] markers removed — for attributes and labels. */
export const plain = (text) => String(text).replace(/\[\[|\]\]/g, '');

/* Words the segmenter splits but a line must not: 标准|价, 人走|客户留, 上下|文 …
   A number and its measure word stay together too (30 分钟, 4 件事, 20 个). */
const ZH_GLUE = ['人走客户留', '给老板', '销售工作台', '企业知识库', '客户CRM', '企业ERP', '标准价', '价格表', '上下文', '公司信号', '资料', '草稿', '工作台', '知识库', '开发信', '销售经理', '办公室', '往来', '自己定', '多久', '批准', '有权人', '交给', '分工'];
const glueRe = ZH_GLUE.map((w) => [new RegExp([...w].join('(?:<wbr>)?'), 'g'), w]);
function zhGlue(html) {
  let out = html;
  for (const [re, w] of glueRe) out = out.replace(re, w);
  return out.replace(/(\d) (?=(?:<wbr>)?[分个天件封家位只种年项])/g, '$1&nbsp;').replace(/([\u4e00-\u9fff]) (?=[\d.,]+%)/g, '$1&nbsp;');
}

/* English: a number and the word hyphenated to it ("30-minute", "15-second")
   stay on one line, and so do the product names. Browsers break after a
   hyphen, and the contact page's heading came out "Book a 30-" / "minute
   demo." on phones, then "Watch OPEN" / "WORK at work." (review, round 3).
   A nowrap span rather than U+2011 or a no-break space, which not every
   fallback font draws and which search and copy-paste read as different
   characters. */
const enGlue = (html) => html.replace(/\b(\d+(?:[.,]\d+)?-[A-Za-z]+|(?:OPEN|STARGO) WORK)\b/g, '<span class="ow-nb">$1</span>');

/**
 * Text of a heading or a paragraph: on the Chinese page it breaks only
 * between words (css: keep-all on every .ow text block), and a [[key phrase]]
 * becomes `.ow-hl`, the blue gradient (kept on one line on the Chinese page).
 */
export function heading(lang, text) {
  /* no break inside a Latin or numeric run such as "US$3.85" or "OPEN WORK" */
  const run = (x) => (lang === 'zh' ? zhGlue(zhWbr(x).replace(/([A-Za-z0-9$.,%/])<wbr>(?=[A-Za-z0-9$.,%/])/g, '$1')) : enGlue(escapeHtml(x)));
  const parts = String(text).split(/\[\[|\]\]/);
  if (parts.length % 2 === 0) throw new Error(`ow-blocks: unbalanced [[ ]] in "${text}"`);
  /* a key phrase is one unit on the Chinese page (white-space: nowrap; a <wbr>
     inside it would still break it in Chromium) */
  const whole = (x) => (lang === 'zh' ? zhGlue(escapeHtml(x)) : enGlue(escapeHtml(x)));
  return parts.map((x, i) => (!x ? '' : i % 2 ? `<span class="ow-hl">${whole(x)}</span>` : run(x))).join('');
}
/** Body copy: the same rules as a heading. */
export const para = heading;

/** A small white glass card laid over the edge of a product window (interface wording or demo-safe facts only). */
export const floatCard = (text, { icon = 'check', cls = '' } = {}) => `<span class="ow-float${cls ? ` ${cls}` : ''}" aria-hidden="true"><span class="ow-float-ico">${ICON[icon]}</span>${escapeHtml(text)}</span>`;

export function button(href, label, { kind = 'primary', icon = null, external = false, cls = '' } = {}) {
  const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="ow-btn ow-btn--${kind}${cls ? ` ${cls}` : ''}" href="${esc(href)}"${ext}>${icon ? ICON[icon] : ''}<span>${esc(label)}</span></a>`;
}

/**
 * A framed product shot. Desktop shows `id` (a full-app render, the chat
 * column alone, or a close-up); below 992px a `<picture>` source swaps in
 * `card`, the phone render of the same scene, so no 1280-wide interface is
 * squeezed onto a phone or a tablet.
 *
 * The picture is a button that opens the lightbox (js/stargo-ow.js) on the
 * widest file of the srcset that is showing. `zoomW` is the width in CSS px
 * the lightbox shows it at as a minimum (it scrolls if the screen is
 * narrower), `zoomX` the point, as a fraction of the width, it centres on.
 *
 * Nothing is drawn over the interface: the 「演示数据」 badge and the
 * 「点图放大」 hint sit in the window's title bar, and on phone cards (no title
 * bar) in a row above the card. Both are HTML.
 */
export function shot({ id, card = null, deskOnly = false, lang, t, O, sizes, eager = false, title = 'OPEN WORK', label, cls = '', extra = '', floats = '', zoomW = 0, zoomX = 0.5 }) {
  const a = asset(id);
  /* `deskOnly`: a full-app render with no phone card (ow07-welcome). Below
     992px the page hides it (.ow-shot--desk) and says the same in words, and
     this 1x1 source keeps a phone from downloading the 1600px file. */
  if (deskOnly && card) throw new Error(`ow-blocks: ${id} has a phone card and is desk-only`);
  const source = card ? (() => {
    const c = asset(card);
    return `<source media="(max-width: 991px)" srcset="${srcset(c)}" sizes="(max-width: 599px) calc(100vw - 40px), 560px" width="${c.width}" height="${c.height}"/>`;
  })() : deskOnly ? '<source media="(max-width: 991px)" srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1" height="1"/>' : '';
  if (deskOnly) cls = `ow-shot--desk${cls ? ` ${cls}` : ''}`;
  const load = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  /* alt is a marker: any non-empty value makes the image pass write the
     registered sentence for `id` in the page's language. */
  const img = `<img src="${a.src}" alt="OPEN WORK" data-sizes="${esc(sizes)}" class="ow-shot-img"${load}/>`;
  const badge = `<span class="ow-badge" aria-hidden="true">${escapeHtml(t(O.badge))}</span>`;
  const hint = `<span class="ow-hint" data-ow-hint aria-hidden="true">${ICON.zoom}<span>${escapeHtml(t(O.zoomHint))}</span></span>`;
  /* a macOS-style window: traffic lights, a title, the hint and the badge on the right */
  const bar = `<div class="ow-frame-bar"><span class="ow-lights" aria-hidden="true"><i></i><i></i><i></i></span>${title ? `<span class="ow-frame-title" aria-hidden="true">${escapeHtml(title)}</span>` : ''}${hint}${badge}</div>`;
  const meta = card ? `<div class="ow-shot-meta" aria-hidden="true">${hint}${badge}</div>` : '';
  const zoomLabel = t(O.zoomOf).replace('{label}', plain(label));
  const zoomAttrs = `${zoomW ? ` data-ow-zoom-w="${zoomW}"` : ''}${zoomX !== 0.5 ? ` data-ow-zoom-x="${zoomX}"` : ''}`;
  return `<figure class="ow-shot ow-shot--window${card ? ' ow-shot--card' : ''}${cls ? ` ${cls}` : ''}" data-ow-shot="${id}">${meta}`
    + `<div class="ow-frame">${bar}<div class="ow-frame-body">`
    + `<button type="button" class="ow-zoom" data-ow-zoom${zoomAttrs} aria-label="${esc(zoomLabel)}" aria-haspopup="dialog" aria-controls="ow-lightbox">`
    + (source ? `<picture>${source}${img}</picture>` : img)
    + `</button>${extra}</div></div>${floats}</figure>`;
}

/** Numbered pins on a shot, at boxes of tools/openwork/hotspots.json: `[{ n, box: [id, key], at }]`. */
export function pins(list) {
  return `<div class="ow-pins">${list.map(({ n, box: [id, key], at = 'left' }) => {
    const b = hotspot(id, key);
    const x = at === 'left' ? b.x : Math.min(b.x + b.w + 1.3, 99);
    const y = at === 'left' ? b.y + Math.min(b.h / 2, 6) : b.y + b.h / 2;
    return `<span class="ow-pin" style="--x:${x.toFixed(2)}%;--y:${y.toFixed(2)}%" aria-hidden="true">${n}</span>`;
  }).join('')}</div>`;
}

/* Line icons, 24px grid, drawn for this page in the outline style of the
   OPEN WORK sidebar. Decorative: aria-hidden, the text beside them names them. */
const svg = (d, cls = 'ow-ico') => `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
export const ICON = {
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
  chat: svg('<path d="M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.5A7.5 7.5 0 1 1 20 12z"/><path d="M9 11h6M9 14h4"/>'),
  sheet: svg('<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9h17M3.5 14h17M9.5 4v16"/>'),
  box: svg('<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
  spark: svg('<path d="M12 3.5 13.8 9a2 2 0 0 0 1.2 1.2l5.5 1.8-5.5 1.8a2 2 0 0 0-1.2 1.2L12 20.5 10.2 15A2 2 0 0 0 9 13.8L3.5 12 9 10.2A2 2 0 0 0 10.2 9z"/>'),
  chart: svg('<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>'),
  shield: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'),
  tag: svg('<path d="M3 12V4h8l9.3 9.3a1.5 1.5 0 0 1 0 2.1l-5.9 5.9a1.5 1.5 0 0 1-2.1 0z"/><circle cx="7.5" cy="8.5" r="1.3"/>'),
  list: svg('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'ow-ico ow-ico--arrow'),
  down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>', 'ow-ico ow-ico--arrow'),
  whatsapp: svg('<path d="M20.5 11.6a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M9 9.5c0 2.8 2.2 5 5 5"/>'),
  zoom: svg('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
  pen: svg('<path d="M12 20h8"/><path d="M16.4 3.6a2 2 0 0 1 2.9 2.9L7.5 18.3 3.5 19.5l1.2-4z"/>'),
  book: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  bolt: svg('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>'),
  users: svg('<circle cx="9" cy="8.5" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.3c1.8.8 3 2.6 3 4.7"/>'),
  flow: svg('<rect x="3" y="3.5" width="7" height="6" rx="1.5"/><rect x="14" y="14.5" width="7" height="6" rx="1.5"/><path d="M6.5 9.5v3a2 2 0 0 0 2 2H14"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2 1.2M17.8 15.3l2 1.2M4.2 16.5l2-1.2M17.8 8.7l2-1.2"/><path d="M12 5.2a6.8 6.8 0 1 1 0 13.6 6.8 6.8 0 0 1 0-13.6z"/>'),
  apps: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
  /* the contact ways added in round 2 (2026-10-10): a handset and a two-bubble chat */
  phone: svg('<path d="M6.6 3.5h2.6l1.4 4.1-2 1.4a12 12 0 0 0 6.4 6.4l1.4-2 4.1 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>'),
  wechat: svg('<path d="M15.5 9.2A6.6 5.4 0 1 0 4.4 13.6L3.6 16l2.8-1.3a7.6 7.6 0 0 0 2.6.5"/><path d="M21 14.6c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.8 0 1.5-.1 2.2-.3l2.3 1.1-.6-2a4.6 4.6 0 0 0 2.1-3.8z"/>'),
  building: svg('<path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21"/><path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M3 21h18M8 8h3M8 12h3M8 16h3"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>', 'ow-ico ow-ico--plus'),
};

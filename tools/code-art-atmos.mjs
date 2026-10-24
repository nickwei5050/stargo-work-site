/**
 * 代码氛围图 — the factory-floor and office atmosphere photographs drawn in code
 * (owner, 2026-10-24 01:35 UTC: 「现场氛围也全部换成代码」). Lane "atmos".
 *
 *   night   — the homepage's two-door picture before the four scenario cards
 *             (`.photo-half._01 / ._02`, R1v2 r1v2-sales-rep-wide until now).
 *   board   — the homepage's third scenario card (HOME_ROLE_CARD, R2
 *             r2-trade-manager on this card until now; the about and pricing
 *             review sliders keep their R2 portrait).
 *   plant   — about.html's introduction band (A01 a01-empty-workshop).
 *   request — the contact page's quote card beside the form (CONTACT_CARD, K01
 *             k01-meeting-table).
 *   the side menu's 预约企业演示 card (MENU_CARD, G02 g02-menu-harbour-night)
 *             — a static inline drawing, identical on every page; nothing runs
 *             while the menu is closed.
 *
 * The four scenes run on the motion engine (js/stargo-motion.js): night and
 * plant in js/stargo-motion-atmos.js, board and request in
 * js/stargo-motion-atmos-cards.js. Each host keeps the box the photograph
 * filled; the card text, washes and fades the template draws over it are
 * untouched.
 */
import { MOTION_LABEL, motionHost } from './motion-scenes.mjs';

Object.assign(MOTION_LABEL, {
  night: {
    zh: '动态示意（演示数据）：夜里的外贸生意是一张网——柳州工厂、去钦州港的路、码头和一艘集装箱船，用细线连着海那边的买家。Müller Energie 的询盘沿着线到港口、再到工厂，工厂的窗一扇扇亮起，一只集装箱运到码头、吊上船，货沿着同一条线发往汉堡。',
    en: 'Illustrative motion with demo data: the trade business at night as one network — the Liuzhou plant, the road to Qinzhou port, the quay and a container ship, joined by thin lines to buyers across the sea. Müller Energie’s inquiry comes down its line to the port and on to the plant, the plant’s windows light up, a container is driven to the quay and craned aboard, and the shipment goes back up the line to Hamburg.',
  },
  board: {
    zh: '动态示意（演示数据）：今日优先事项由 AI 随时更新——PT Surya Energi 到了补货周期，先核实采购信号，核实后排到第一，跟进建议等你确认，不会自动发送。',
    en: 'Illustrative motion with demo data: today’s priorities, kept current by the AI — PT Surya Energi reaches its restock cycle, its buying signal is checked first, it moves to the top, and the follow-up suggestion waits for your OK; nothing is sent automatically.',
  },
  plant: {
    zh: '动态示意（演示数据）：清晨的柳州工厂车间平面图，电池包沿 U 形产线依次经过电芯分选、模组装配、BMS 测试、老化测试、质检、包装和装柜，第一个电池包经过的工位一个个亮起来。',
    en: 'Illustrative motion with demo data: a floor plan of the Liuzhou plant at dawn; battery packs move along a U-shaped line through cell sorting, module assembly, BMS test, ageing test, quality check, packing and loading, and each station lights up as the first pack reaches it.',
  },
  request: {
    zh: '动态示意（演示数据）：提交表单之后——演示申请送达，我们先了解你的需求，再通过你留下的联系方式联系你，会议时间另行确认。',
    en: 'Illustrative motion with demo data: after the form — your demo request arrives, we first learn what you need, then contact you using the details you left, and the meeting time is set separately.',
  },
});

/** The homepage's scenes from this lane (for motionAssets). */
export const ATMOS_HOME = ['night', 'board'];

/** The two halves of the homepage's door picture, each holding a whole-screen night host. */
export function nightHalves(lang) {
  const host = motionHost('night', lang, 'sga-host');
  // the right half repeats the picture for the eye only: one description is enough for a screen reader
  const twin = host.replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"');
  return `<div class="photo-half _01">${host}</div><div class="photo-half _02">${twin}</div>`;
}

/** A `w-background-video` block whose clip a photograph replaced: the block stays, a scene host fills it. */
export function codeStill(html, videoId, host) {
  const i = html.indexOf(`id="${videoId}-video"`);
  if (i === -1) throw new Error(`atmos: video ${videoId} not found`);
  const vStart = html.lastIndexOf('<video', i);
  const vEnd = html.indexOf('</video>', i) + '</video>'.length;
  const wrapStart = html.lastIndexOf('<div', vStart);
  const wrap = html.slice(wrapStart, vStart).replace(/\s*data-(video-urls|poster-url|autoplay|loop)="[^"]*"/g, '');
  return html.slice(0, wrapStart) + wrap + host + html.slice(vEnd);
}

export const boardHost = (lang) => motionHost('board', lang, 'sgk-host stargo-role-art');
export const requestHost = (lang) => motionHost('request', lang, 'sgk-host stargo-contact-art');
export const plantHost = (lang) => motionHost('plant', lang, 'sga-host');

/* The side menu card: a harbour at night in line art — the quay, two cranes, container stacks and one ship
   whose bridge is lit, its lights drawn long on the water. Decorative inside the card's link, so it is
   aria-hidden and says nothing; the card's own text names the link. One id, and the menu is on a page once. */
export const MENU_ART = '<svg class="stargo-menu-art" viewBox="0 0 220 92" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">'
  + '<defs><linearGradient id="sg-menu-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0908"/><stop offset=".64" stop-color="#21170f"/><stop offset=".645" stop-color="#0a0807"/><stop offset="1" stop-color="#0e0b09"/></linearGradient></defs>'
  + '<rect width="220" height="92" fill="url(#sg-menu-sky)"/>'
  + '<path d="M18 12h0M44 22h0M71 9h0M98 17h0M131 8h0M163 15h0M199 10h0M210 26h0" stroke="#ffe9d2" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round"/>'
  + '<g fill="none" stroke="#ffe4c8" stroke-opacity=".45" stroke-width=".9" stroke-linejoin="round">'
  + '<path d="M150 59V31M157 59V31M141 31H200M150 31L153.5 23L157 31M153.5 23L200 31M150 47H157"/>'
  + '<path d="M178 59V35M185 59V35M170 35H214M178 35L181.5 28L185 35M181.5 28L214 35M178 49H185"/>'
  + '<path d="M80 59.5H174L167 68H86Z" stroke-opacity=".55"/>'
  + '<path d="M88 59.5V47H101V59.5M91 47V42H98V47" stroke-opacity=".55"/>'
  + '</g>'
  + '<path d="M0 59.5H80M174 59.5H220" stroke="#ffe4c8" stroke-opacity=".45" stroke-width="1"/>'
  + '<g fill="#ffe4c8" fill-opacity=".05" stroke="#ffe4c8" stroke-opacity=".2" stroke-width=".6">'
  + '<rect x="106" y="53.5" width="10" height="5.5"/><rect x="117" y="53.5" width="10" height="5.5"/><rect x="139" y="53.5" width="10" height="5.5"/><rect x="150" y="53.5" width="10" height="5.5"/>'
  + '<rect x="111" y="47.5" width="10" height="5.5"/><rect x="133" y="47.5" width="10" height="5.5"/><rect x="144" y="47.5" width="10" height="5.5"/>'
  + '<rect x="190" y="53.5" width="10" height="5.5"/><rect x="201" y="53.5" width="10" height="5.5"/><rect x="195" y="47.5" width="10" height="5.5"/>'
  + '</g>'
  + '<rect x="128" y="53.5" width="10" height="5.5" fill="#ec6f10" fill-opacity=".8" stroke="#ffb37a" stroke-opacity=".8" stroke-width=".6"/>'
  + '<g fill="#ffc690"><rect x="90.5" y="50" width="2.4" height="2"/><rect x="94.2" y="50" width="2.4" height="2"/><rect x="97.9" y="50" width="2.4" height="2"/><circle cx="153.5" cy="23" r="1" fill="#ff5a3c"/><circle cx="181.5" cy="28" r="1" fill="#ff5a3c"/></g>'
  + '<path d="M90 72h4M95 72h4M89 76h5M96 77h3M91 81h4M97 82h3M90 86h3" stroke="#ffb37a" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/>'
  + '<path d="M14 70h22M48 75h30M120 73h26M160 79h34M28 84h20M128 86h22" stroke="#ffe4c8" stroke-opacity=".08" stroke-width="1" stroke-linecap="round"/>'
  + '</svg>';

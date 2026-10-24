/**
 * Lane "people" (owner, 2026-10-23: 「你看看整个网站还有什么是可以图片改成代码的地方
 * 全部做好」): the AI-employee pictures of about.html and workforce.html, drawn in
 * code instead of the owner's D01–D07 still lifes.
 *
 *   about.html, the four AI-employee tiles (tools/blocks/cn-about-projects.mjs):
 *     one motion scene per tile, in the clip's own box (caseScene below;
 *     js/stargo-motion-staff.js, css/stargo-motion-staff.css).
 *   workforce.html, the hero's five marquee role cards (each drawn twice for the
 *     loop): STATIC code cards (roleCard below; css/stargo-motion-rolecard.css).
 *     They ride a moving marquee, so nothing in them ticks: one opacity pulse
 *     on a status dot is all the motion they own.
 *   workforce.html, the collage card under 「网页桌面与 AI 办公」: the 'deskReport'
 *     scene (js/stargo-motion-rolecard.js), a mini web desktop where the 报告 AI 员工
 *     drafts the weekly report and stops at 待你确认.
 *
 * Every picture says what it is: the scenes carry the engine's tags
 * (动态示意 · 演示数据 / 演示数据), the static cards a 示意 / Illustration tag.
 * Names and numbers are the site's one demo cast.
 */
import { escapeHtml } from './lib-html.mjs';
import { motionHost, motionAssets } from './motion-scenes.mjs';

/* ------------------------------------------------------------ about -- */

/** The cinery clip in each tile, by its video id, and the scene that takes its box. */
export const ABOUT_CASE_SCENES = {
  'fb6f08c0-bccf-aeab-a33d-45198963fe74': 'crewSignal', // 市场信号 AI 员工 (was D01)
  'fb6f08c0-bccf-aeab-a33d-45198963fe90': 'crewQuote',  // 报价 AI 员工 (was D07)
  'fb6f08c0-bccf-aeab-a33d-45198963feae': 'crewFollow', // 跟进 AI 员工 (was D02)
  'fb6f08c0-bccf-aeab-a33d-45198963feca': 'crewCoord',  // 统筹 AI 员工 (was D05)
};

/**
 * The clip's `<video>` becomes a motion host in the same `.cn-case-video` box
 * (the box keeps its classes, size and radius; the four Webflow video
 * attributes come off the wrapper, as tools/chrome.mjs stillImage() does), and
 * the tile's `.cn-case-study-container` is marked `sg-case-code`, which lays
 * the wordmark over the scene's app bar instead of its centre.
 */
export function caseScene(html, videoId, scene, lang) {
  const i = html.indexOf(`id="${videoId}-video"`);
  if (i === -1) throw new Error(`people: video ${videoId} not found`);
  const vStart = html.lastIndexOf('<video', i);
  const vEnd = html.indexOf('</video>', i) + '</video>'.length;
  const wrapStart = html.lastIndexOf('<div', vStart);
  const wrap = html.slice(wrapStart, vStart).replace(/\s*data-(video-urls|poster-url|autoplay|loop)="[^"]*"/g, '');
  if (!/class="cn-case-video\b/.test(wrap)) throw new Error(`people: video ${videoId} is not in a .cn-case-video box`);
  const C = 'class="cn-case-study-container"';
  const at = html.lastIndexOf(C, wrapStart);
  if (at === -1) throw new Error(`people: no .cn-case-study-container around video ${videoId}`);
  const out = html.slice(0, wrapStart) + wrap + motionHost(scene, lang, 'sg-mo-case') + html.slice(vEnd);
  return out.slice(0, at) + 'class="cn-case-study-container sg-case-code"' + out.slice(at + C.length);
}

/* -------------------------------------------------------- workforce -- */

const I = {
  research: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l4.5 4.5',
  follow: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 8v4.2l2.8 1.8',
  spec: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7 12 12l7.5-4.3M12 12v8.5',
  finance: 'M4.5 7h15v10h-15zM4.5 10.5h15M8 14h3',
  coord: 'M12 4l8 4.5-8 4.5-8-4.5zM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5',
};
const svg = (d, size) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const B = (zh, en) => ({ zh, en });
const CHECK = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* The five marquee roles, in WORKFORCE copy order (tools/copy.mjs
   LX_FEATURE_WORKFORCE.roles): what each is doing right now, as one still
   frame, and the site app it works in. `task` is the line on a desktop card,
   `ts` its short form on the smaller cards (it fits 110 px). `st` is the status
   chip: run (orange dot that pulses), wait (needs you), done; `stl` is its
   desktop words, `s` a tablet's and `xs` (else `s`) a phone's. `chip` is the
   app named on the chip that slides in on hover. */
const ROLES = [
  {
    ico: I.research, name: B('市场研究', 'Research'), task: B('按匹配度排序候选客户', 'Ranking buyers by fit'), ts: B('排序候选客户', 'Ranking buyers'), app: B('Growth OS', 'Growth OS'), chip: B('Growth OS', 'Growth OS'),
    st: 'run', stl: B('进行中 · 2 条新信号', 'Running · 2 new signals'), s: B('进行中', 'Running'),
    viz: (t) => `<div class="sg-rc-rank">${[['Nordwerk', 94], ['Nordic Mobility', 93, 'Nordic'], ['Gulf Coast', 91]].map(([n, v, sn]) => `<div class="sg-rc-rk"><span>${sn ? `<span class="sg-rc-vl">${n}</span><span class="sg-rc-xs">${sn}</span>` : n}</span><b>${v}</b><i style="--v:${((v - 70) / 30).toFixed(3)}"></i></div>`).join('')}</div>`,
  },
  {
    ico: I.follow, name: B('销售跟进', 'Follow-up'), task: B('Müller Energie 3 天未回复', 'Müller Energie, no reply in 3 days'), ts: B('Müller 3 天未回复', 'Müller: no reply'), app: B('客户会话', 'Customer Chat'), chip: B('客户会话', 'Customer Chat'),
    st: 'wait', stl: B('跟进信待你确认', 'Draft needs your OK'), s: B('待你确认', 'Needs your OK'), xs: B('待你确认', 'Your OK'),
    viz: (t) => `<div class="sg-rc-tl"><i class="is-sent"></i><i></i><i></i><i class="is-now"></i><span>${t(B('10/20 已发报价', 'Oct 20 quote sent'))}</span></div>`,
  },
  {
    ico: I.spec, name: B('产品规格', 'Specs'), task: B('核对 48V 100Ah 规格', 'Checking 48V 100Ah specs'), ts: B('核对 48V 100Ah', '48V 100Ah specs'), app: B('ERP · 产品资料', 'ERP · Products'), chip: B('ERP', 'ERP'),
    st: 'done', stl: B('规格已核对', 'Specs checked'), s: B('已核对', 'Checked'),
    viz: (t) => `<div class="sg-rc-checks">${[B('电压 48V', 'Voltage 48V'), B('容量 100Ah', 'Capacity 100Ah'), B('UN38.3 文件', 'UN38.3 file')].map((x) => `<div>${CHECK}<span>${t(x)}</span></div>`).join('')}</div>`,
  },
  {
    ico: I.finance, name: B('财务对账', 'Finance'), task: B('核对 10 月到账', 'Matching October payments'), ts: B('核对 10 月到账', 'October payments'), app: B('ERP · 收款', 'ERP · Receipts'), chip: B('ERP', 'ERP'),
    st: 'run', stl: B('进行中 · 17/18', 'Running · 17 of 18'), s: B('进行中', 'Running'),
    viz: (t) => `<div class="sg-rc-recon"><div><b>17</b><span>/18 ${t(B('笔已匹配', 'matched'))}</span></div><i><i style="--v:${(17 / 18).toFixed(3)}"></i></i><em>${t(B('1 笔差异待查', '1 to check'))}</em></div>`,
  },
  {
    ico: I.coord, name: B('统筹协调', 'Coordinator'), task: B('开拓巴西电动两轮市场', 'Brazil e-scooter market'), ts: B('巴西电动两轮市场', 'Brazil e-scooters'), app: B('数字员工', 'AI Staff'), chip: B('数字员工', 'AI Staff'),
    st: 'run', stl: B('4 位协作中 · 3/5', '4 at work · 3 of 5'), s: B('协作中', 'At work'),
    viz: (t) => `<div class="sg-rc-steps">${[B('研', 'R'), B('产', 'P'), B('销', 'S'), B('创', 'C'), B('统', 'L')].map((x, i) => `<i class="${i < 3 ? 'is-done' : i === 3 ? 'is-run' : ''}">${t(x)}</i>`).join('')}</div>`,
  },
];
const TAG = B('示意', 'Illustration');
const LABEL = B('示意（演示数据）：', 'Illustration (demo data): ');

/**
 * One marquee role card as code, in place of the card's `<img
 * class="lx-feature-hero-image">`. It keeps that class, so it fills the card's
 * 1 : 1.28 box exactly as the picture did, under the card's own name panel
 * and tag (which still slide in on hover). `i` is the role's index in
 * LX_FEATURE_WORKFORCE.roles; `roleName` is that role's full name.
 */
export function roleCard(i, lang, roleName) {
  const r = ROLES[i];
  if (!r) throw new Error(`people: no role card ${i}`);
  const t = (p) => p[lang];
  const label = `${t(LABEL)}${roleName}${lang === 'zh' ? '，' : ', '}${t(r.task)}${lang === 'zh' ? '，' : ' — '}${t(r.stl)}`;
  return `<div class="lx-feature-hero-image sg-rc sg-rc-${i + 1}" role="img" aria-label="${escapeHtml(label)}">`
    + `<div class="sg-rc-head"><span class="sg-rc-ico">${svg(r.ico, 16)}</span><span class="sg-rc-tag">${t(TAG)}</span></div>`
    + `<div class="sg-rc-name">${escapeHtml(t(r.name))}</div>`
    + `<div class="sg-rc-task"><span class="sg-rc-l">${escapeHtml(t(r.task))}</span><span class="sg-rc-s">${escapeHtml(t(r.ts))}</span></div>`
    + `<div class="sg-rc-app">${escapeHtml(t(r.app))}</div>`
    + `<div class="sg-rc-viz">${r.viz(t)}</div>`
    + `<div class="sg-rc-st is-${r.st}"><i></i><span class="sg-rc-l">${escapeHtml(t(r.stl))}</span><span class="sg-rc-s">${escapeHtml(t(r.s))}</span><span class="sg-rc-xs">${escapeHtml(t(r.xs ?? r.s))}</span></div>`
    + '</div>';
}
export const ROLE_CARDS = ROLES.length;

/**
 * The chip that slides in on a card's hover, in place of the template's
 * social-network logo pictures (Instagram, TikTok, LinkedIn, YouTube, X: third
 * parties' marks, on cards that link to the contact page): the site app the
 * role works in, drawn in code. `i` is the role's index; 'desk' is the
 * collage card's web desktop. It lands under the card's head row, so the
 * card's 示意 tag stays in sight.
 */
export function roleChip(i, lang) {
  const name = i === 'desk' ? B('网页桌面', 'Web desktop') : ROLES[i]?.chip;
  if (!name) throw new Error(`people: no role chip ${i}`);
  return `<span class="sg-rc-chip${i === 'desk' ? ' is-desk' : ''}"><i></i>${escapeHtml(name[lang])}</span>`;
}

/* ---------------------------------------------------------- assets -- */

/**
 * Loads, once, the files of every scene a page hosts: its stylesheets after
 * css/stargo-fusion.css and its scripts before js/stargo-motion.js (or before
 * </body> with the engine after them, when the page carries no engine yet).
 * Tags the page already has are not added twice, so another builder's own
 * motionAssets() on the same page composes with this one.
 */
export function withSceneAssets(page) {
  const scenes = [...new Set([...page.matchAll(/data-sg-scene="([^"]+)"/g)].map((m) => m[1]))];
  if (!scenes.length) return page;
  const { css, js } = motionAssets(scenes);
  const fusion = '<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>';
  if (page.split(fusion).length !== 2 || page.split('</body>').length !== 2) throw new Error('people: cannot place the motion scenes\' files');
  /* The scenes sit far below the first screen and are built only when they
     come near it, so their stylesheets load without blocking the first paint
     (media="print" until loaded); without JS nothing is drawn, so the noscript
     copy only gives the empty boxes their colour. */
  const links = css.split('\n').filter((l) => !page.includes(l.match(/href="([^"]+)"/)[1]));
  const lazy = links.map((l) => l.replace('/>', ` media="print" onload="this.media='all'"/>`));
  let out = links.length ? page.replace(fusion, `${fusion}\n${lazy.join('\n')}<noscript>${links.join('')}</noscript>`) : page;
  const tags = js.match(/<script [^>]*><\/script>/g) ?? [];
  const engine = tags.find((s) => s.includes('js/stargo-motion.js'));
  const missing = tags.filter((s) => !out.includes(s.match(/src="([^"]+)"/)[1]));
  if (!missing.length) return out;
  if (out.includes('src="js/stargo-motion.js"')) {
    const before = missing.filter((s) => s !== engine).join('');
    return out.replace(/<script src="js\/stargo-motion\.js"/, `${before}<script src="js/stargo-motion.js"`);
  }
  return out.replace('</body>', `${missing.join('')}</body>`);
}

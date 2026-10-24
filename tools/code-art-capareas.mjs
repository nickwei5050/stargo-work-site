/**
 * capabilities.html — code-drawn pictures for three slots that showed the
 * owner's generated photographs (owner, 2026-10-23: 「你看看整个网站还有什么是
 * 可以图片改成代码的地方全部做好」).
 *
 *   四个板块，十四类能力 — the four area cards (were CAP_PHOTOS.areas, C01–C04).
 *     Each card's picture is a motion scene of that area's apps working on one
 *     piece of business together (js/stargo-motion-areas.js). The host fills the
 *     card's picture box (css/stargo-motion-areas.css); it is not the template's
 *     `.paralax-image`, so IX2's 10% scroll drift does not slide a product screen
 *     under the fixed glass caption. The phone settle-in zoom of lane parity
 *     (css/stargo-phone.css) names the host as well as the photo.
 *
 *   一条业务主线 /09 — the eight thumbnails orbiting STARGO WORK (were
 *     CAP_PHOTOS.orbit). The ring already turns, so each is a still: inline SVG
 *     drawn in the product's palette with the step's number and name in HTML,
 *     marked 示意 / Illustration in its top corner from 768 px up (sizes per
 *     breakpoint in tools/blocks/qx-orbit.css, section H). Nothing
 *     ticks; nothing is downloaded.
 *
 * The 「让 AI 团队把活干完」 cards 1–2 are scenes too ('crewRoles', 'crewBoard',
 * js/stargo-motion-crew.js); they are placed through CAP_V6A.team.cards[].motion
 * in tools/copy.mjs like the third card.
 */
import { escapeHtml } from './lib-html.mjs';
import { motionHost } from './motion-scenes.mjs';

/* The four area cards, in card order (#g01, #g04, #g07, #g10), by the template
   picture each card's <img> still names when the page is cut. */
export const AREA_SCENES = ['areaGrowth', 'areaContext', 'areaDeal', 'areaTeam'];
const AREA_KEYS = ['699b6466d5f19893993a4d79_work-1.webp', '699b6466d5f19893993a4d1a_work-4.webp', '699b6466d5f19893993a4d34_work-5.webp', '699b6466d5f19893993a4d8f_work-8.webp'];

export function placeAreaScenes(html, lang) {
  AREA_KEYS.forEach((key, i) => {
    let hit = 0;
    html = html.replace(/<img\b[^>]*>/g, (tag) => {
      if (!tag.includes(key)) return tag;
      if (!/class="paralax-image"/.test(tag)) throw new Error(`capabilities: the area picture ${key} is no longer the card's .paralax-image`);
      hit++;
      return motionHost(AREA_SCENES[i], lang, 'sg-mo-area');
    });
    if (hit !== 1) throw new Error(`capabilities: expected one area picture ${key}, found ${hit}`);
  });
  return html;
}

/* ---------------------------------------------------------------- orbit ---- */
/* The eight thumbnails by the qubix file each one replaces (steps 01 and 03–09;
   step 02 has none), each a glyph-like picture of what the product does at that
   step. Drawn on a 148 × 168 box, the thumbnail's largest size. */
const ORBIT = [
  ['69ad4171521df4f0bc234d0f_Rectangle_9', '01', ['按产品和目标市场找出值得开发的客户', 'finding the buyers worth developing'],
    '<circle cx="74" cy="66" r="46" class="o-ln"/><circle cx="74" cy="66" r="31" class="o-ln"/><circle cx="74" cy="66" r="16" class="o-ln"/>'
    + '<path d="M74 66V20a46 46 0 0 1 40.8 24.8z" class="o-sweep"/><path d="M74 66 114.8 44.8" class="o-hi"/>'
    + '<circle cx="52" cy="86" r="2.6" class="o-dim"/><circle cx="91" cy="96" r="2.6" class="o-dim"/><circle cx="56" cy="46" r="2.2" class="o-dim"/>'
    + '<circle cx="99" cy="51" r="10" class="o-ring"/><circle cx="99" cy="51" r="4.2" class="o-acc"/><circle cx="74" cy="66" r="3" class="o-core"/>'],
  ['69ad0fbadd6325cf79cf0dea_Rectangle_5', '03', ['开发计划确认后，经授权的渠道联系客户', 'reaching buyers through authorised channels'],
    '<rect x="22" y="86" width="40" height="28" rx="7" class="o-box"/><circle cx="34" cy="100" r="5" class="o-dim"/><path d="M44 96h12M44 104h8" class="o-ln"/>'
    + '<path d="M58 84C70 62 86 66 98 52" class="o-trail"/>'
    + '<path d="M90 44 128 28 114 70 104 56z" class="o-acc"/><path d="M104 56 128 28" class="o-cut"/>'
    + '<circle cx="118" cy="98" r="11" class="o-ring"/><path d="M113 98.5l3.5 3.5 6.5-7" class="o-ok"/>'],
  ['69ad4172e2f6cf6c085066c0_Rectangle_7', '04', ['询盘进来，需求被读清楚', 'reading what an inquiry asks for'],
    '<path d="M28 24h92a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H54l-14 12V74H28a10 10 0 0 1-10-10V34a10 10 0 0 1 10-10z" class="o-box"/>'
    + '<path d="M34 40h64M34 50h76M34 60h44" class="o-ln"/>'
    + '<path d="M74 80v12" class="o-trail"/>'
    + '<rect x="16" y="96" width="34" height="18" rx="9" class="o-chip"/><rect x="56" y="96" width="38" height="18" rx="9" class="o-chip"/><rect x="100" y="96" width="32" height="18" rx="9" class="o-chip is-acc"/>'],
  ['69ad417163eb1d1417d4efe7_Rectangle_11', '05', ['依据企业资料起草回复，由人复核', 'drafting a reply from company material for a person to check'],
    '<path d="M20 26h70a9 9 0 0 1 9 9v22a9 9 0 0 1-9 9H38l-12 10V66h-6a9 9 0 0 1-9-9V35a9 9 0 0 1 9-9z" class="o-box"/><path d="M26 41h50M26 51h36" class="o-ln"/>'
    + '<path d="M58 72h70a9 9 0 0 1 9 9v22a9 9 0 0 1-9 9h-6v10l-12-10H58a9 9 0 0 1-9-9V81a9 9 0 0 1 9-9z" class="o-box is-acc"/><path d="M60 87h48M60 97h36" class="o-hi"/>'
    + '<circle cx="124" cy="92" r="7" class="o-acc"/><path d="M120.5 92.5l2.5 2.5 4.5-5" class="o-cut"/>'],
  ['69ad41712a2f75c0ed1f8027_Rectangle_10', '06', ['按规则起草报价，低于底价的等人审批', 'pricing by rule; below the floor waits for approval'],
    '<path d="M36 18h56l18 18v84H36z" class="o-box"/><path d="M92 18v18h18" class="o-ln"/>'
    + '<path d="M46 50h40M46 62h52M46 74h30" class="o-ln"/>'
    + '<rect x="46" y="86" width="52" height="5" rx="2.5" class="o-track"/><rect x="46" y="86" width="22" height="5" rx="2.5" class="o-acc"/><path d="M76 81v15" class="o-floor"/>'
    + '<g transform="translate(110 108)"><circle r="15" class="o-gate"/><rect x="-5.5" y="-5.5" width="11" height="11" rx="2" transform="rotate(45)" class="o-acc"/></g>'],
  ['69ad4171baff849bf5f57a38_Rectangle_8', '07', ['订单进入生产、质检、出货', 'an order through production, QC and shipment'],
    '<path d="M74 22l26 14v28L74 78 48 64V36zM48 36l26 14 26-14M74 50v28" class="o-box-ln"/>'
    + '<path d="M22 104h104" class="o-ln"/><path d="M22 104h76" class="o-hi"/>'
    + '<circle cx="22" cy="104" r="6" class="o-acc"/><circle cx="56" cy="104" r="6" class="o-acc"/><circle cx="90" cy="104" r="6" class="o-acc"/><circle cx="126" cy="104" r="6" class="o-node"/>'],
  ['69ad41721ce44afffca4eaf8_Rectangle_12', '08', ['到时提醒，跟进信起草后等人确认', 'a reminder when it is due, a follow-up drafted for a person to confirm'],
    '<circle cx="74" cy="64" r="42" class="o-track-ln"/><path d="M74 22a42 42 0 1 1-42 42" class="o-arc"/>'
    + '<path d="M58 50h32v26H58zM58 50l16 13 16-13" class="o-box-ln"/>'
    + '<circle cx="32" cy="64" r="5.5" class="o-acc"/><path d="M60 118h28" class="o-ln"/><path d="M66 126h16" class="o-dim-ln"/>'],
  ['69ad417169d8a230caca089c_Rectangle_6', '09', ['从结果里改进做法，批准后才生效', 'improving from results; a change ships only once approved'],
    '<path d="M116 52A44 44 0 0 0 36 46M32 84a44 44 0 0 0 80 6" class="o-loop"/><path d="M28 34v14h14M120 102V88h-14" class="o-loop"/>'
    + '<rect x="50" y="76" width="12" height="20" rx="2" class="o-bar"/><rect x="68" y="64" width="12" height="32" rx="2" class="o-bar"/><rect x="86" y="50" width="12" height="46" rx="2" class="o-acc"/>'],
];

/* `names` maps a step number to the name the section's own step list gives it
   ('03' → 触达 / Engage, from HOME_LOOP_TABLE.rows via tools/blocks/qx-orbit.mjs),
   so a thumbnail can never name its step differently from the rows beside it. */
export function orbitArt(file, lang, names) {
  const o = ORBIT.find((x) => x[0] === file);
  if (!o) throw new Error(`orbit art: no picture for ${file}`);
  const [, n, what, svg] = o;
  const name = names?.[n];
  if (!name) throw new Error(`orbit art: step ${n} has no name in the step list`);
  const zh = lang === 'zh';
  const label = zh ? `示意：第 ${n} 步「${name}」，${what[0]}。` : `Illustration: step ${n}, ${name}: ${what[1]}.`;
  return `<div class="sg-ob" role="img" aria-label="${escapeHtml(label)}"><svg class="sg-ob-art" viewBox="0 0 148 168" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g transform="translate(0 7)">${svg}</g></svg>`
    + `<span class="sg-ob-tag" aria-hidden="true">${zh ? '示意' : 'Illustration'}</span>`
    + `<span class="sg-ob-cap" aria-hidden="true"><b>${n}</b><em>${escapeHtml(name)}</em></span></div>`;
}
export const ORBIT_FILES = ORBIT.map((o) => o[0]);

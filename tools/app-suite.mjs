/**
 * 应用套件 — the capability page's app band (#apps), between the four
 * foundations (#foundations) and the complete catalogue (#atlas).
 *
 * The 22 app icons of the STARGO WORK desktop, in the four categories the
 * owner's app catalogue files them under (stargo-work-app
 * wechat-miniprogram/utils/app-catalog.js at d46c4fc: 核心与智脑 6, 业务与客户 7,
 * 视觉与创作 5, 自动化与底座 4). Each tile is a real link to the catalogue group
 * the app belongs to; js/stargo-catalogue.js glides there and opens the row.
 *
 * What is taken from that catalogue: the categories, the order and the icons
 * (assets/stargo-apps/, written by tools/imagegen/prepare-app-icons.py).
 * Nothing else. Its metrics, prompts, sample output, ports and per-app accent
 * colours are demo filler and are not used; its names are not used either
 * where the real product desktop calls the same icon something else
 * (assets/stargo-product/live01-desktop-home-16x9, the screenshot the hero
 * of this page already shows): one icon has one name on this site. The
 * gauge is 经营驾驶舱 there, the monitor with a gear AI 浏览器, the building
 * 企业管理, the wand 视频制作, the film strip 参考视频, the clapper 视频编辑,
 * the plug 应用连接, the terminal 脚本执行, the shield 合规尽调, the speech
 * bubble 客户会话, the globe 浏览器, the waveform 语音助手 and the network
 * 模型网关. The six icons the desktop does not show keep the catalogue's name
 * without its STARGO prefix; the two-squares flow icon takes the desktop's
 * name for the same app (流程编排). The robot is the experimental provider of
 * subordinate AI employees (tools/data/integrations.json, staffdeck), not an
 * HR app, and says so.
 *
 * Claims. The icons are entry points, not a list of what is live: which apps
 * a company gets, and how far each is connected, depends on its deployment
 * and authorization, and the band's note says that in the page's own words.
 * The role lines say what an app is for, never that it is running, and the
 * build refuses 已上线 / 已接通 / "live" anywhere in this copy. No third-party
 * product name may appear in the copy or in a file name either (the build
 * checks both); upstream credits belong on notices.html.
 *
 * Self-contained: css/stargo-apps.css and js/stargo-apps.js, class prefix
 * `sg-apps`. Not a motion-engine scene: the tiles are links, and a scene's
 * stage is aria-hidden and scaled.
 */
import { existsSync } from 'node:fs';
import { escapeHtml } from './lib-html.mjs';
import { SITE } from './paths.mjs';

const ICON_DIR = 'assets/stargo-apps/';
const ICON = (slug) => `${ICON_DIR}${slug}-128.webp`;

/* The icons' own category colours: the short bar under each glyph. */
export const APP_CATEGORIES = [
  { id: 'core', count: 6, color: '#8ddaf5', rgb: '141,218,245', name: { zh: '核心与智脑', en: 'Core & Intelligence' }, desc: { zh: 'AI 员工对话、企业知识、语音与浏览器', en: 'AI conversations, company knowledge, voice and the browser' } },
  { id: 'business', count: 7, color: '#72ddca', rgb: '114,221,202', name: { zh: '业务与客户', en: 'Business & Customers' }, desc: { zh: '企业管理、客户会话、找客户与合规尽调', en: 'Company records, customer conversations, prospecting and due diligence' } },
  { id: 'creative', count: 5, color: '#b8baf6', rgb: '184,186,246', name: { zh: '视觉与创作', en: 'Visual & Creative' }, desc: { zh: '创意画布、视频与 3D 图纸', en: 'A creative canvas, video and 3D drawings' } },
  { id: 'automation', count: 4, color: '#b1c2df', rgb: '177,194,223', name: { zh: '自动化与底座', en: 'Automation & Platform' }, desc: { zh: '流程、脚本、应用连接与模型接入', en: 'Workflows, scripts, app connections and model access' } },
];

/* `short`: the label under a 48 px icon on a phone, where a column is ~65 px;
   only names that would not fit there in two lines carry one. */
export const APPS = [
  // 核心与智脑
  { slug: 'brain', cat: 'core', group: '10', name: { zh: '智脑', en: 'AI Brain' }, role: { zh: '多个 AI 员工在一个对话里分工协作，结合企业资料作答', en: 'Several AI employees in one conversation, answering from your company’s own material' } },
  { slug: 'knowledge', cat: 'core', group: '06', name: { zh: '知识库', en: 'Knowledge Base' }, role: { zh: '从企业文档里找出能回答问题的那一段，并注明出处', en: 'Finds the passage in your documents that answers the question, and cites it' } },
  { slug: 'voice', cat: 'core', group: '01', name: { zh: '语音助手', en: 'Voice Assistant' }, role: { zh: '开口说一句，就能提需求、建任务', en: 'Make a request or create a task just by speaking' } },
  { slug: 'notes', cat: 'core', group: '06', name: { zh: '笔记', en: 'Notes' }, role: { zh: '文档、团队资料页和项目看板，AI 协助起草', en: 'Documents, team pages and project boards, with AI help drafting' } },
  { slug: 'browser', cat: 'core', group: '01', name: { zh: '浏览器', en: 'Browser' }, role: { zh: '在云端打开网页和内部系统，只访问授权范围内的地址', en: 'Websites and internal systems in the cloud, only where access is authorized' } },
  { slug: 'ai-browser', cat: 'core', group: '11', name: { zh: 'AI 浏览器', en: 'AI Browser' }, role: { zh: 'AI 员工在授权范围内操作网页工具，不绕过登录与安全验证', en: 'AI employees use web tools as authorized, never bypassing sign-in or security checks' } },
  // 业务与客户
  { slug: 'enterprise', cat: 'business', group: '08', name: { zh: '企业管理', en: 'Enterprise Management' }, short: { en: 'Enterprise' }, role: { zh: '产品、物料、采购、库存、生产与财务记录', en: 'Products, purchasing, inventory, production and finance records' } },
  { slug: 'conversations', cat: 'business', group: '04', name: { zh: '客户会话', en: 'Customer Chat' }, role: { zh: '邮件、官网和社媒的对话集中在一处；AI 起草，人确认后再发', en: 'Email, website and social chats in one place; AI drafts, a person approves before sending' } },
  { slug: 'ai-staff', cat: 'business', group: '10', name: { zh: '数字员工', en: 'AI Staff' }, role: { zh: '给下属数字员工派活、看进度、复核结果（实验性）', en: 'Assign work to subordinate AI employees and review what they return (experimental)' } },
  { slug: 'search', cat: 'business', group: '02', name: { zh: '智搜', en: 'Smart Search' }, role: { zh: '一次搜索多个来源，查公司、行业与贸易资讯', en: 'Searches many sources at once for companies, industries and trade news' } },
  { slug: 'outreach', cat: 'business', group: '03', name: { zh: '拓客', en: 'Outreach' }, role: { zh: '找海外潜在客户与决策人，经你授权再联系', en: 'Finds overseas buyers and decision-makers; reaches out only with your authorization' } },
  { slug: 'due-diligence', cat: 'business', group: '04', name: { zh: '合规尽调', en: 'Due Diligence' }, role: { zh: '协助对照合规名单筛查贸易伙伴、核实背景，结果由人复核', en: 'Helps screen partners against compliance lists; a person reviews every result' } },
  { slug: 'cockpit', cat: 'business', group: '01', name: { zh: '经营驾驶舱', en: 'Business Cockpit' }, role: { zh: '公司现在在做什么，一屏看完', en: 'What the business is doing right now, on one screen' } },
  // 视觉与创作
  { slug: 'canvas', cat: 'creative', group: '09', name: { zh: '无限画布', en: 'Infinite Canvas' }, role: { zh: 'AI 创意白板：草图、思维导图与局部重绘', en: 'An AI whiteboard for sketches, mind maps and partial redraws' } },
  { slug: 'video-editor', cat: 'creative', group: '09', name: { zh: '视频编辑', en: 'Video Editor' }, role: { zh: '把产品素材剪成适合社媒发布的短视频', en: 'Cuts product footage into short clips ready for social media' } },
  { slug: 'reference-video', cat: 'creative', group: '09', name: { zh: '参考视频', en: 'Reference Videos' }, role: { zh: '拆解参考视频的结构，为你的产品做原创改编', en: 'Borrows a reference video’s structure for an original video of your product' } },
  { slug: 'video-studio', cat: 'creative', group: '09', name: { zh: '视频制作', en: 'Video Studio' }, role: { zh: '按脚本和产品资料生成营销视频', en: 'Makes marketing videos from a script and your product material' } },
  { slug: 'cad', cat: 'creative', group: '06', name: { zh: '3D CAD', en: '3D CAD' }, role: { zh: '在浏览器里查看、标注和测量 2D 与 3D 图纸', en: 'View, mark up and measure 2D and 3D drawings in the browser' } },
  // 自动化与底座
  { slug: 'workflows', cat: 'automation', group: '11', name: { zh: '流程编排', en: 'Workflows' }, role: { zh: '跨应用把步骤连起来，不用写代码；对外动作设有审批', en: 'Links steps across apps without code, with approval gates on outbound actions' } },
  { slug: 'scripts', cat: 'automation', group: '11', name: { zh: '脚本执行', en: 'Scripts' }, role: { zh: '整理流程要用的数据，按时运行例行脚本', en: 'Prepares the data a workflow needs and runs routine scripts on schedule' } },
  { slug: 'connections', cat: 'automation', group: '11', name: { zh: '应用连接', en: 'App Connections' }, short: { en: 'Connections' }, role: { zh: '按授权对接团队已在用的系统；配置并授权之前不算接通', en: 'Reaches your team’s existing systems; connected only once configured and authorized' } },
  { slug: 'model-gateway', cat: 'automation', group: '13', name: { zh: '模型网关', en: 'Model Gateway' }, role: { zh: '统一接入多个 AI 模型，按部门记录用量', en: 'One entry point to several AI models, with usage recorded by department' } },
];

export const APP_SUITE = {
  eyebrow: { zh: '(应用套件)', en: '(The app suite)' },
  title: { zh: '22 个应用，一个桌面。', en: '22 apps, one desktop.' },
  note: {
    zh: '这些是 STARGO WORK 桌面上的应用入口，按四类排列，点图标可跳到下方目录里对应的能力组。企业开通哪些应用、接通到什么程度，以部署和授权为准。',
    en: 'These are the app entry points on the STARGO WORK desktop, in four groups; select an icon to jump to its capability group in the catalog below. Which apps a company gets, and how far each is connected, depends on its deployment and authorization.',
  },
  count: { zh: ' 个应用', en: ' apps' },
  group: { zh: '能力组', en: 'Group' },
};

/* Upstream project names that must never reach the page or a file name. */
const TRADEMARKS = /notion|erpnext|chatwoot|windmill|chromium|office\s*365|activepieces|searxng|openoutreach|yente|openmuse|opencut|openmontage|hypit|new-api|weknora|qwen|staffdeck|\bdsh\b|openconnector/i;
/* Status words the band may not use about any app. */
const STATUS = /已上线|已接通|已开通|都能用|\blive\b|\bavailable\b/i;

function assertSuite(C) {
  const t = (v, l) => (typeof v === 'string' ? v : v[l]);
  if (APPS.length !== 22) throw new Error(`app suite: ${APPS.length} apps, expected 22`);
  const sum = APP_CATEGORIES.reduce((n, c) => n + c.count, 0);
  if (sum !== 22) throw new Error(`app suite: the category counts add up to ${sum}, expected 22 = 6 + 7 + 5 + 4`);
  for (const c of APP_CATEGORIES) {
    const k = APPS.filter((a) => a.cat === c.id).length;
    if (k !== c.count) throw new Error(`app suite: ${c.id} has ${k} apps, the category says ${c.count}`);
  }
  const groups = new Set(C.CAPABILITY_GROUPS.map((g) => g.n));
  const slugs = new Set();
  for (const a of APPS) {
    if (slugs.has(a.slug)) throw new Error(`app suite: duplicate app ${a.slug}`);
    slugs.add(a.slug);
    if (!groups.has(a.group)) throw new Error(`app suite: ${a.slug} points at catalogue group ${a.group}, which does not exist`);
    if (!existsSync(`${SITE}/${ICON(a.slug)}`)) throw new Error(`app suite: icon ${ICON(a.slug)} missing (python3 tools/imagegen/prepare-app-icons.py)`);
    if (TRADEMARKS.test(a.slug)) throw new Error(`app suite: file name ${a.slug} carries an upstream product name`);
  }
  for (const l of ['zh', 'en']) {
    const words = [
      APP_SUITE.eyebrow, APP_SUITE.title, APP_SUITE.note,
      ...APP_CATEGORIES.flatMap((c) => [c.name, c.desc]),
      ...APPS.flatMap((a) => [a.name, a.role, a.short?.[l] ?? '']),
    ].map((v) => t(v, l)).join('\n');
    const tm = words.match(TRADEMARKS);
    if (tm) throw new Error(`app suite (${l}): copy names an upstream product: ${tm[0]}`);
    const st = words.match(STATUS);
    if (st) throw new Error(`app suite (${l}): copy makes a status claim: ${st[0]}`);
    if (!t(APP_SUITE.title, l).includes(String(APPS.length))) throw new Error(`app suite (${l}): the title must state the app count`);
  }
}

export function appSuite(C, lang) {
  assertSuite(C);
  const t = (v) => (typeof v === 'string' ? v : v[lang]);
  const e = (v) => escapeHtml(t(v));
  const groupName = Object.fromEntries(C.CAPABILITY_GROUPS.map((g) => [g.n, t(g.name)]));
  const goLabel = (n) => `${t(APP_SUITE.group)} ${n} · ${groupName[n]}`;
  const goShort = (n) => `${t(APP_SUITE.group)} ${n}`;

  const tile = (a) => {
    const name = t(a.name);
    const short = a.short?.[lang];
    /* The visible name is the link's name; the role and where the link goes
       are its description, from a hidden span the band's script also reads
       to fill the row's left column on hover and focus. */
    const label = short
      ? `<span class="sg-apps-name"><span class="sg-apps-full">${escapeHtml(name)}</span><span class="sg-apps-short">${escapeHtml(short)}</span></span>`
      : `<span class="sg-apps-name">${escapeHtml(name)}</span>`;
    return `<li class="sg-apps-cell"><a class="sg-apps-tile" href="#g${a.group}" data-name="${escapeHtml(name)}" data-go="${escapeHtml(goShort(a.group))}" aria-describedby="sg-apps-r-${a.slug}">` +
      `<span class="sg-apps-ico"><img src="${ICON(a.slug)}" width="64" height="64" alt="" loading="lazy" decoding="async"/></span>` +
      label +
      `<span class="sg-apps-why" id="sg-apps-r-${a.slug}" hidden><span class="sg-apps-why-role">${e(a.role)}</span>${lang === 'zh' ? '。' : '. '}${escapeHtml(goLabel(a.group))}</span>` +
      `</a></li>`;
  };

  const rows = APP_CATEGORIES.map((c, i) => {
    const apps = APPS.filter((a) => a.cat === c.id);
    return `<div class="sg-apps-row" data-cat="${c.id}" style="--c:${c.color};--c-rgb:${c.rgb}">` +
      `<div class="sg-apps-side">` +
      `<p class="sg-apps-idx" aria-hidden="true">0${i + 1}</p>` +
      `<h3 class="sg-apps-cat" id="sg-apps-c-${c.id}">${e(c.name)}</h3>` +
      `<p class="sg-apps-count"><span class="sg-apps-n" aria-hidden="true">${c.count}</span><span class="sg-apps-vh">${c.count}</span>${e(APP_SUITE.count)}<span class="sg-apps-bar" aria-hidden="true"></span></p>` +
      `<div class="sg-apps-say"><p class="sg-apps-desc">${e(c.desc)}</p>` +
      `<p class="sg-apps-role" aria-hidden="true"><b class="sg-apps-role-name"></b> <span class="sg-apps-role-text"></span> <span class="sg-apps-role-go"></span></p></div>` +
      `</div>` +
      `<ul class="sg-apps-grid" aria-labelledby="sg-apps-c-${c.id}">${apps.map(tile).join('')}</ul>` +
      `</div>`;
  }).join('');

  return `<section id="apps" class="sg-apps" aria-labelledby="sg-apps-title"><div class="sg-apps-inner">` +
    `<div class="sg-apps-head"><div class="sg-apps-head-l"><p class="sg-apps-eyebrow">${e(APP_SUITE.eyebrow)}</p>` +
    `<h2 id="sg-apps-title" class="sg-apps-title">${e(APP_SUITE.title)}</h2></div>` +
    `<p class="sg-apps-note">${e(APP_SUITE.note)}</p></div>` +
    `<div class="sg-apps-rows">${rows}</div>` +
    `</div></section><script src="js/stargo-apps.js" defer></script>`;
}

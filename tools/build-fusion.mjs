/**
 * Insert the three Scalora modules into the Mono homepage, with STARGO copy.
 *
 * Idempotent: it always rebuilds from index.base.html, so it can be re-run
 * after editing the copy without stacking duplicate sections.
 *
 * Every replacement is asserted. A string that stops matching after a template
 * change fails the build rather than silently leaving English agency copy on a
 * Chinese enterprise page.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';

const SITE = 'F:/stargo 网站/stargo-site';
const FRAG = `${SITE}/tools/fragments`;
const BASE = `${SITE}/tools/templates/index.base.html`;
const OUT = `${SITE}/tools/fragments/index.fused.html`;

// First run snapshots the Mono-only page; later runs rebuild from it.
if (!existsSync(BASE)) throw new Error('missing tools/templates/index.base.html');
let page = readFileSync(BASE, 'utf8');

/* ------------------------------------------------------------ helpers -- */

function makeSub(label) {
  const state = { edits: 0 };
  const fn = (html, old, next, opts = {}) => {
    const n = html.split(old).length - 1;
    if (n === 0) throw new Error(`[${label}] no match: ${JSON.stringify(old).slice(0, 90)}`);
    if (opts.count != null && n !== opts.count) {
      throw new Error(`[${label}] ${JSON.stringify(old).slice(0, 60)}: expected ${opts.count}, found ${n}`);
    }
    if (opts.nth != null) {
      const parts = html.split(old);
      if (parts.length - 1 <= opts.nth) throw new Error(`[${label}] occurrence ${opts.nth} missing`);
      state.edits += 1;
      return parts.slice(0, opts.nth + 1).join(old) + next + parts.slice(opts.nth + 1).join(old);
    }
    state.edits += n;
    return html.split(old).join(next);
  };
  return { fn, state };
}

/** Add a class token to the fragment's root element. */
function addRootClass(fragment, token) {
  return fragment.replace(/^(<section\b[^>]*class=")/, `$1${token} `);
}

/* ------------------------------------------------- 1. four-layer stack -- */
// Scalora's hero, used mid-page as the architecture section. Placed at the top
// it would be a second hero; placed here it reads as a feature band, and no
// markup has to change for that.

let hero = readFileSync(`${FRAG}/hero.html`, 'utf8');
{
  const { fn: s, state } = makeSub('hero');

  // Two <h1> in a fragment on a page that already has one. Multiple h1s are a
  // real accessibility defect, so they become h2 and css/stargo-fusion.css
  // gives them the h1 type scale back — same pixels, correct semantics.
  hero = hero.replace(/<h1 /g, '<h2 ').replace(/<\/h1>/g, '</h2>');

  hero = s(hero, 'All in one ecosystem for your business', '(四层结构)');
  hero = s(hero, 'The platform that ', '能力先注册，');
  hero = s(hero, 'helps you', '再谈');
  // Slots _01 and _04 hold the same word: the marquee loops back to the first.
  hero = s(hero, 'Build.', '调用。');
  hero = s(hero, 'Scale.', '审批。');
  hero = s(hero, 'Operate.', '留痕。');
  hero = s(hero,
    'Scalora is a business platform designed to help teams manage marketing, operations, and growth from one workspace.',
    'STARGO WORK 7.0 分四层：能力注册表、受治理编排器、审批闸门、审计台账。'
    + '每一层都能单独检查，一个动作要穿过全部四层才会真的发生。');
  // Both strings live inside one <a>; the label is duplicated so the hover
  // animation can slide one copy out and the other in. One CTA, not two.
  hero = s(hero, 'Get started free', '查看治理与安全', { count: 2 });

  // Cards 01 and 02 ship byte-identical text, so these must go by position.
  hero = s(hero, '>Scalora<', '>STARGO<', { nth: 0 });
  hero = s(hero, '>CRM<', '>能力注册表<', { nth: 0 });
  hero = s(hero, '>CRM platform<', '>先注册，才可调用<', { nth: 0 });
  hero = s(hero, '>Scalora<', '>STARGO<', { nth: 0 });
  hero = s(hero, '>CRM<', '>受治理编排器<', { nth: 0 });
  hero = s(hero, '>CRM platform<', '>动作只能经此发出<', { nth: 0 });

  hero = s(hero, 'Scalora Ops', '审批闸门');
  hero = s(hero, 'Product 01', 'R2 / R3 必须人工审批');

  hero = s(hero, 'AI Writing Tool', '制裁筛查');
  hero = s(hero, 'Mentoor', '审计台账');
  hero = s(hero, 'AI Sales Agent', '知识检索');
  hero = s(hero, 'Hero Card Icon', '卡片图标');

  hero = addRootClass(hero, 'sc-scope');
  console.log(`hero fragment: ${state.edits} substitutions`);
}

/* ---------------------------------------------- 2. sticky switcher ------ */

let products = readFileSync(`${FRAG}/products.html`, 'utf8');
{
  const { fn: s, state } = makeSub('products');

  // The four dashboard images are Scalora's own invented UI. Until the real
  // STARGO OS captures arrive, the caption says so rather than implying these
  // are screenshots of the product.
  products = s(products, 'Our products', '(界面示意 · 非真实截图)');
  products = s(products, 'Meet the Scalora product ecosystem', 'E01–E52 能力图谱中的四个域');

  products = s(products, 'Scalora CRM', '销售与报价');
  products = s(products, 'Scalora Marketing', '增长与获客');
  products = s(products, 'Scalora Docs', '指挥与执行');
  products = s(products, 'Scalora Ops', '治理与台账');

  products = s(products,
    'Manage leads, automate follow-ups, track deals, and close faster with a smart, visual CRM built for modern sales teams.',
    '询盘进来即被结构化：买方是谁、要什么、匹配哪款；成本与毛利在一张表里成型，报价与 CRM 写入停在人工审批。');
  products = s(products,
    'Plan, launch, and optimize campaigns across email, ads, and landing pages — all tracked in one dashboard.',
    '从公开渠道收集买家与竞品信号，并研究其采购决策链；内容与外联经受治理的编排器发出，先审批后回读。');
  products = s(products,
    'Create, manage, and collaborate on documentation, SOPs, and internal knowledge in one flexible workspace.',
    '数字员工引用公司自己的产品与价格事实，而不是凭空生成；每一次执行都留下结果与证据，可以逐条回读。');
  products = s(products,
    'Build workflows that connect your teams, data, and tools — without complex integrations.',
    '能力先注册再调用，审批不可绕过，台账只能追加；R4 在结构上禁止自动执行，每次尝试留痕。');

  products = s(products, 'Dashbord Image', '界面示意图（非真实截图）');

  products = addRootClass(products, 'sc-scope');
  console.log(`products fragment: ${state.edits} substitutions`);
}

/* ------------------------------------------------- 3. providers band ---- */

let integration = readFileSync(`${FRAG}/integration.html`, 'utf8');
{
  const { fn: s, state } = makeSub('integration');
  // Longest first: "Integration" is a prefix of the alt text "Integration Icon".
  integration = s(integration, 'Integration Icon', '能力提供方图标');
  integration = s(integration, 'Integration', '(能力接入)');
  integration = s(integration, 'One AI Engine. Fully Connected.', '25 个提供方。其中 6 个全部关闭。');
  integration = s(integration,
    'Scalora connects your CRM, website, ads, and commerce tools into one intelligent automation system.',
    '25 个提供方登记 202 项能力：26 项当前关闭，30 个动作需人工审批。这些是注册表数字，不等于现在都能跑。');
  integration = addRootClass(integration, 'sc-scope');
  console.log(`integration fragment: ${state.edits} substitutions`);
}

/* ------------------------------------------------------- insertion ------ */
// Anchored on content, not byte offsets: the offsets moved once already when
// the copy was rewritten, and they will move again.

function insertBefore(html, anchor, fragment, label) {
  const i = html.indexOf(anchor);
  if (i === -1) throw new Error(`insertion anchor not found for ${label}`);
  return html.slice(0, i) + fragment + '\n' + html.slice(i);
}

const ANCHOR_WORKFORCE = '<section class="section with-minus"';
const ANCHOR_VIDEO = '<section class="video-section"';
const ANCHOR_FACTS = '<section class="section drk"';

page = insertBefore(page, ANCHOR_WORKFORCE, hero, 'four-layer stack');
page = insertBefore(page, ANCHOR_VIDEO, products, 'sticky switcher');
page = insertBefore(page, ANCHOR_FACTS, integration, 'providers band');

// The fusion overrides, after both template stylesheets.
const FUSION_CSS = '<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>';
const SCALORA_CSS = '<link href="css/scalora-modules.sc.css" rel="stylesheet" type="text/css"/>';
if (!page.includes(SCALORA_CSS)) {
  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  if (!monoLink.test(page)) throw new Error('Mono stylesheet link not found');
  page = page.replace(monoLink, (m) => `${m}\n${SCALORA_CSS}\n${FUSION_CSS}`);
}

writeFileSync(OUT, page, 'utf8');
console.log(`wrote ${OUT} (${page.length} bytes)`);

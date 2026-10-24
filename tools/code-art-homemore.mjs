/**
 * 代码动画, the homepage's "homemore" lane (2026-10-23; the owner: 「你看看整个
 * 网站还有什么是可以图片改成代码的地方全部做好」).
 *
 *   - The five business-stage cards (001 主动获客 … 005 复购与改进): five
 *     code-drawn scenes in place of the owner's photographs P01–P05
 *     (tools/replaceables.mjs HOME_STAGES), one host per stage so Mono's own
 *     per-stage switching keeps working (js/stargo-motion-stages.js,
 *     css/stargo-motion-stages.css).
 *   - The pricing band's card beside 企业版: the code-drawn 'org' scene in place
 *     of T01 (HOME_PRICING_CARD) — what the Enterprise copy beside it lists,
 *     and nothing more (js/stargo-motion-org.js, css/stargo-motion-org.css).
 *
 * The hosts are tools/motion-scenes.mjs motionHost(): role="img" with the
 * sentence below, the drawing itself aria-hidden. The labels are registered
 * on MOTION_LABEL from here so the shared file only gains its two one-line
 * file entries.
 */
import { MOTION_LABEL, motionHost, motionAssets } from './motion-scenes.mjs';

const LABELS = {
  'stage-find': {
    zh: '动态示意（演示数据）：Growth OS 排出候选客户——Nordwerk Energie GmbH 匹配度 94、Gulf Coast Lift Supply 91，并写下理由：近 90 天发布 3 条储能招标，产品线与 48V 100Ah 匹配，建议先开发。',
    en: 'Illustrative motion (demo data): Growth OS ranks prospects — Nordwerk Energie GmbH at 94 and Gulf Coast Lift Supply at 91 — and writes down why: three storage tenders in 90 days and a fit with 48V 100Ah, so contact it first.',
  },
  'stage-sell': {
    zh: '动态示意（演示数据）：Müller Energie GmbH 询价 200 组 48V 100Ah、DAP 汉堡；Sales Desk 读出型号、数量和贸易术语，AI 起草报价 Q-1042，提交后等你审批，批准前不会发送。',
    en: 'Illustrative motion (demo data): Müller Energie GmbH asks for 200 pcs of 48V 100Ah, DAP Hamburg; Sales Desk reads out the model, quantity and trade term, AI drafts quote Q-1042, and it waits for your approval — nothing is sent before you approve.',
  },
  'stage-make': {
    zh: '动态示意（演示数据）：订单 PI-1042 在 ERP 里依次走过排产（11/02）、质检（11/09，抽检 20 组全部合格）和装柜（11/12，1 × 20GP），与销售承诺的装柜日期一致。',
    en: 'Illustrative motion (demo data): order PI-1042 moves through production (Nov 2), QC (Nov 9, 20 sampled packs all passed) and loading (Nov 12, 1 × 20GP) in the ERP, on the loading date sales promised.',
  },
  'stage-pay': {
    zh: '动态示意（演示数据）：订单 PI-1042 的商业发票、装箱单和提单逐一备齐，回款从 30% 定金到尾款到账、对账完成，共 100%。',
    en: 'Illustrative motion (demo data): the commercial invoice, packing list and bill of lading for order PI-1042 are ticked off one by one, and payment goes from the 30% deposit to 100% once the balance arrives and is reconciled.',
  },
  'stage-again': {
    zh: '动态示意（演示数据）：PT Surya Energi 大约每 60 天下一次单，距上次下单已 60 天；Growth OS 建议补货 64V 104Ah × 120 组并备好跟进草稿，等你确认后才联系客户。',
    en: 'Illustrative motion (demo data): PT Surya Energi orders about every 60 days and its last order was 60 days ago; Growth OS suggests a reorder of 120 packs of 64V 104Ah with a follow-up draft, and contacts the customer only after you confirm.',
  },
  org: {
    zh: '动态示意（演示数据）：企业版——多家公司、品牌、部门和账号各有自己的权限、审批和数据边界，共用同一支 AI 员工队伍；低于底价的报价 Q-1042 按审批路线逐级由人批准；现有 CRM、ERP 经授权接入；全部运行在私有化部署的环境里，由专属前置部署工程师对接。',
    en: 'Illustrative motion (demo data): Enterprise — several companies, brands, departments and accounts, each with its own permissions, approvals and data boundary, sharing one AI workforce; quote Q-1042, below the floor price, goes up its approval route with a person signing at each step; existing CRM and ERP connect with authorization; all of it in a private deployment, with a dedicated forward-deployed engineer.',
  },
};
Object.assign(MOTION_LABEL, LABELS);

/* The five stage cards, in page order, by the Mono picture each card had in
   the template (tools/build-site.mjs swapped those for P01–P05 until now). */
const STAGE_SLOTS = [
  ['Scene%20%239.webp', 'stage-find'],
  ['Scene%20%235.webp', 'stage-sell'],
  ['Scene%20%2310%20(Light)', 'stage-make'],
  ['Scene%20%238.webp', 'stage-pay'],
  ['Scene%2018.webp', 'stage-again'],
];
export const STAGE_SCENES = STAGE_SLOTS.map(([, scene]) => scene);

/** The homepage's five stage pictures → five motion hosts, plus the scene's stylesheet and script. */
export function homeStageScenes(html, lang) {
  let h = html;
  for (const [key, scene] of STAGE_SLOTS) {
    let n = 0;
    h = h.replace(/<img\b[^>]*>/g, (tag) => {
      if (!tag.includes(key)) return tag;
      if (!/class="paralax-image"/.test(tag)) throw new Error(`homemore: the stage picture ${key} is not Mono's .paralax-image`);
      n++;
      return motionHost(scene, lang, 'sg-mo-stagecard');
    });
    if (n !== 1) throw new Error(`homemore: expected one stage picture ${key}, found ${n}`);
  }
  return h;
}

/** The pricing band's enterprise card (Mono's `.image-wrap.rnd`) → the 'org' host. */
export function homePricingScene(html, lang) {
  /* Mono's picture also appears in template cards the build replaces later, so only the one
     directly inside the band's `.image-wrap.rnd` is taken. */
  let n = 0;
  const h = html.replace(/(<div [^>]*class="image-wrap rnd">)<img\b[^>]*699b6466d5f19893993a4f1a_Sunset-Serenity[^>]*>/g, (m, open) => {
    n++;
    return open + motionHost('org', lang, 'sg-mo-orgcard');
  });
  if (n !== 1) throw new Error(`homemore: expected one pricing-band picture, found ${n}`);
  return h;
}

/** Stylesheets after css/stargo-motion.css, scripts before js/stargo-motion.js (which collects them). */
export function homeMoreAssets(html) {
  const css = '<link href="css/stargo-motion.css" rel="stylesheet" type="text/css"/>';
  const js = '<script src="js/stargo-motion.js" defer></script>';
  if (!html.includes(css) || !html.includes(js)) throw new Error('homemore: the motion engine tags are not on the page');
  return html
    .replace(css, `${css}\n<link href="css/stargo-motion-stages.css" rel="stylesheet" type="text/css"/>\n<link href="css/stargo-motion-org.css" rel="stylesheet" type="text/css"/>`)
    .replace(js, `<script src="js/stargo-motion-stages.js" defer></script><script src="js/stargo-motion-org.js" defer></script>${js}`);
}

/** One template picture → an existing motion scene's host, with that scene's sheet and scripts
    (notices.html 「继续看」: the 数字员工 card shows the 'team' scene, NOTICES_CARDS). */
export function swapToMotion(html, key, scene, lang, extraClass) {
  let n = 0;
  let h = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (!tag.includes(key)) return tag;
    n++;
    return motionHost(scene, lang, extraClass);
  });
  if (n !== 1) throw new Error(`homemore: expected one picture ${key} for the '${scene}' scene, found ${n}`);
  const { css, js } = motionAssets([scene]);
  const mono = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  if (!mono.test(h) || h.split('</body>').length !== 2) throw new Error(`homemore: cannot place the '${scene}' scene's files`);
  return h.replace(mono, (m) => `${m}\n${css}`).replace('</body>', `${js}</body>`);
}

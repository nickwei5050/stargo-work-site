/**
 * Render the OPEN WORK product images and the share cover.
 *
 *   STARGO_TOOL_PACKAGE=/path/to/toolpkg/package.json node tools/openwork/render.mjs [--only ow02-inquiry,ow12-inquiry-card] [--no-og]
 *
 * 1. Writes every scene of tools/openwork/scenes.mjs as HTML into
 *    .wrangler/openwork/ (git-ignored) and screenshots it in Chromium:
 *    full app 1280×880 CSS px @2x, phone cards 390 CSS px @3x, crops @2x.
 *    The PNG renders stay in .wrangler/openwork/ as the sources.
 * 2. Encodes WebP with sharp into assets/stargo-product/ — never wider than
 *    the render — and registers every image in tools/imagegen/product-assets.json
 *    (source render, its SHA-256 and pixels, sizes, variants).
 * 3. Composes the share cover (assets/stargo-editorial/og-cover.png, 1200×630)
 *    from the inquiry render and updates its entry in
 *    tools/imagegen/assets-manifest.json.
 * 4. Writes tools/openwork/hotspots.json: where the marked elements
 *    (data-hot) sit in each image, in percent, for callouts on the page.
 *
 * Modules: sharp, lucide-static, @fontsource/noto-sans-sc and
 * @fontsource-variable/inter come through tools/paths.mjs `req`
 * (STARGO_TOOL_PACKAGE); Chromium is this repository's @playwright/test.
 * OPENWORK_CHROMIUM=/path/to/chrome overrides the browser binary.
 *
 * Every conversation in these images is demonstration data. See README.md.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { SITE, req } from '../paths.mjs';
import { css, scenes } from './scenes.mjs';

const own = createRequire(import.meta.url);
const { chromium } = (() => { try { return own('@playwright/test'); } catch { return req('@playwright/test'); } })();
const sharp = req('sharp');
const pkg = (p) => req.resolve(p);

const args = process.argv.slice(2);
const onlyAt = args.indexOf('--only');
const only = (args.find(a => a.startsWith('--only='))?.slice(7) ?? (onlyAt >= 0 ? args[onlyAt + 1] : '') ?? '').split(',').filter(Boolean);
const withOg = !args.includes('--no-og') && (!only.length || only.includes('og-cover'));

const WORK = `${SITE}/.wrangler/openwork`;
const PRODUCT_DIR = 'assets/stargo-product';
const OG_FILE = 'assets/stargo-editorial/og-cover.png';
mkdirSync(WORK, { recursive: true });

/* ---- scene HTML ---------------------------------------------------------- */
const icon = (name, cls = '') => readFileSync(pkg(`lucide-static/icons/${name}.svg`), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace('<svg', `<svg class="i ${cls}"`)
  .replace(/width="24"/, '').replace(/height="24"/, '')
  .replace(/stroke-width="2"/, 'stroke-width="1.9"');
const fonts = {
  interCss: pkg('@fontsource-variable/inter/index.css'),
  notoDir: pkg('@fontsource/noto-sans-sc/index.css').replace(/index\.css$/, ''),
};
writeFileSync(`${WORK}/openwork.css`, css(fonts));
const pages = scenes(icon);
for (const [name, html] of Object.entries(pages)) writeFileSync(`${WORK}/${name}.html`, html);

/* ---- what to render ------------------------------------------------------ */
/* app:   full app 1280×880 @2x → main 1600 wide, variants 800/1200/2400.
   focus: the chat column alone, 800 CSS px @3x (2400 px) → main 1600,
          variants 1200/1800/2400; shown about 1140px wide on desktop, so its
          13.5px interface text reads at about 19px, and the 2400 file keeps
          a retina screen at 2 device pixels per image pixel or better.
   card:  phone card, 390 CSS px @3x (1170 px) → main 1170, variant 780.
   gate:  a close-up in phone typography, 380 CSS px @3x → main 1140, 760.
   crop:  desktop crop @2x of the page's .shot → main = render width.
   apps:  the sidebar from the brand row through the last app @3x.         */
const APP = { viewport: [1280, 880], dsf: 2, main: 1600, variants: [800, 1200, 2400] };
const FOCUS = { viewport: [800, 1400], dsf: 3, main: 1600, variants: [1200, 1800, 2400] };
const CARD = { viewport: [390, 844], dsf: 3, variants: [780] };
const GATE = { viewport: [380, 1000], dsf: 3, variants: [760] };
const SHOTS = [
  { id: 'ow01-home', page: 'home', kind: 'app', scene: 'home · 新聊天 + 快捷操作' },
  { id: 'ow02-inquiry', page: 'inquiry', kind: 'app', scene: 'inquiry · 分析询盘并回复' },
  { id: 'ow03-quote', page: 'quote', kind: 'app', scene: 'quote · 起草报价单 / PI' },
  { id: 'ow04-outreach', page: 'outreach', kind: 'app', scene: 'outreach · 起草开发信' },
  { id: 'ow05-brief', page: 'brief', kind: 'app', scene: 'brief · 老板看板周报' },
  { id: 'ow06-follow', page: 'follow', kind: 'app', scene: 'follow · 跟进客户' },
  { id: 'ow32-inquiry-focus', page: 'inquiry-focus', kind: 'focus', scene: 'inquiry · 对话栏（桌面展示）' },
  { id: 'ow33-quote-focus', page: 'quote-focus', kind: 'focus', scene: 'quote · 对话栏（桌面展示）' },
  { id: 'ow34-outreach-focus', page: 'outreach-focus', kind: 'focus', scene: 'outreach · 对话栏（桌面展示）' },
  { id: 'ow35-brief-focus', page: 'brief-focus', kind: 'focus', scene: 'brief · 对话栏（桌面展示）' },
  { id: 'ow12-inquiry-card', page: 'inquiry-card', kind: 'card', scene: 'inquiry · 回复草稿 + 审批栏（手机）' },
  { id: 'ow13-quote-card', page: 'quote-card', kind: 'card', scene: 'quote · PI 卡（手机）' },
  { id: 'ow14-outreach-card', page: 'outreach-card', kind: 'card', scene: 'outreach · 目标客户表（手机）' },
  { id: 'ow15-brief-card', page: 'brief-card', kind: 'card', scene: 'brief · 指标 + 需要你决定（手机）' },
  { id: 'ow16-follow-card', page: 'follow-card', kind: 'card', scene: 'follow · 建议跟进（手机）' },
  { id: 'ow20-apps', page: 'home', kind: 'apps', scene: 'home · 侧栏 15 个应用', variants: [520] },
  { id: 'ow21-pi-check', page: 'pi-check', kind: 'gate', scene: 'quote · 价格校验 + PI 审批中（特写）' },
  { id: 'ow22-approval-bar', page: 'approval-bar', kind: 'gate', scene: 'inquiry · 回复草稿 + 对外发送需要你确认（特写）' },
  { id: 'ow24-step-log', page: 'step-log', kind: 'gate', scene: 'follow · 每一步读了什么（特写）' },
  { id: 'ow23-quick-actions', page: 'quick-actions', kind: 'crop', width: 1000, scene: 'home · 输入框 + 快捷操作', variants: [720, 1200] },
];
const chosen = only.length ? SHOTS.filter(s => only.includes(s.id)) : SHOTS;
if (only.length && !chosen.length && !withOg) throw new Error(`--only matched nothing: ${only.join(', ')}`);

const browser = await chromium.launch({
  ...(process.env.OPENWORK_CHROMIUM ? { executablePath: process.env.OPENWORK_CHROMIUM } : {}),
  args: ['--allow-file-access-from-files', '--font-render-hinting=none'],
});
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const pct = (n, of) => Math.round(n / of * 10000) / 100;

async function open(page, viewport, dsf) {
  const p = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] }, deviceScaleFactor: dsf });
  await p.goto(`file://${WORK}/${page}.html`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  return p;
}
/** Bounding boxes of [data-hot] elements relative to `box`, in percent. */
async function hotspots(p, box) {
  return p.evaluate(({ x, y, width, height }) => Object.fromEntries([...document.querySelectorAll('[data-hot]')].map(el => {
    const r = el.getBoundingClientRect();
    const f = (n) => Math.round(n * 100) / 100;
    return [el.dataset.hot, { x: f((r.left - x) / width * 100), y: f((r.top - y) / height * 100), w: f(r.width / width * 100), h: f(r.height / height * 100) }];
  }).filter(([, b]) => b.x >= 0 && b.y >= 0 && b.x + b.w <= 100.5 && b.y + b.h <= 100.5)), box);
}
/** Fail when something in the frame is cut off or wraps where it must not. */
async function checkLayout(p, id) {
  const problems = await p.evaluate(() => {
    const out = [];
    const t = document.querySelector('.thread');
    if (t && t.scrollHeight > t.clientHeight + 1) out.push(`thread overflows by ${t.scrollHeight - t.clientHeight}px (the question at the top would be cut off)`);
    for (const b of document.querySelectorAll('.btn, .tag, .chip, .nav, .chat')) {
      const r = b.getBoundingClientRect();
      if (r.width && r.height > parseFloat(getComputedStyle(b).height) + 1) out.push(`wrapped: ${b.textContent.trim()}`);
    }
    for (const el of document.querySelectorAll('.card, .metric, .steps')) if (el.scrollWidth > el.clientWidth + 1) out.push(`horizontal overflow in ${el.className}: ${el.textContent.trim().slice(0, 40)}`);
    /* Truncated text: an ellipsis or a clipped line hides demo content the page talks about. */
    for (const el of document.querySelectorAll('.chat span, .draft, .btn, .tag, .chip, .mail:not(.excerpt), td, .tx')) {
      if (el.getClientRects().length && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && getComputedStyle(el).overflow !== 'visible') out.push(`truncated: ${el.textContent.trim().slice(0, 50)}`);
    }
    return out;
  });
  if (problems.length) throw new Error(`${id}: ${problems.join('; ')}`);
}

const records = [];
const hot = {};
for (const s of chosen) {
  const spec = s.kind === 'app' ? APP : s.kind === 'apps' ? { ...APP, dsf: 3 } : s.kind === 'focus' ? FOCUS : s.kind === 'card' ? CARD : s.kind === 'gate' ? GATE : { viewport: [s.width, 900], dsf: 2 };
  const p = await open(s.page, spec.viewport, spec.dsf);
  await checkLayout(p, s.id);
  const file = `${WORK}/${s.id}.png`;
  let box;
  if (s.kind === 'app') {
    box = { x: 0, y: 0, width: spec.viewport[0], height: spec.viewport[1] };
    await p.screenshot({ path: file });
  } else if (s.kind === 'apps') {
    const last = await p.locator('[data-hot="last-app"]').boundingBox();
    const side = await p.locator('.side').boundingBox();
    box = { x: 0, y: 0, width: side.width - 1, height: Math.ceil(last.y + last.height + 12) };
    await p.screenshot({ path: file, clip: box });
  } else {
    const el = p.locator('.shot');
    box = await el.boundingBox();
    await el.screenshot({ path: file });
  }
  hot[s.id] = await hotspots(p, box);
  await p.close();

  const png = readFileSync(file);
  const meta = await sharp(png).metadata();
  const mainWidth = Math.min(spec.main && s.kind !== 'apps' ? spec.main : meta.width, meta.width);
  const encode = (w) => sharp(png).resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' })
    .webp({ quality: 85, effort: 6, smartSubsample: true }).toBuffer();
  const mainBuf = await encode(mainWidth);
  const src = `${PRODUCT_DIR}/${s.id}.webp`;
  writeFileSync(`${SITE}/${src}`, mainBuf);
  const mainMeta = await sharp(mainBuf).metadata();
  const variants = [];
  for (const w of (s.variants ?? spec.variants ?? []).filter(w => w <= meta.width && w !== mainWidth)) {
    const buf = await encode(w);
    const vsrc = `${PRODUCT_DIR}/${s.id}-${w}.webp`;
    writeFileSync(`${SITE}/${vsrc}`, buf);
    variants.push({ src: vsrc, width: w, bytes: buf.length });
  }
  records.push({
    id: s.id,
    sw: s.id.slice(0, 4).toUpperCase(),
    src,
    width: mainMeta.width,
    height: mainMeta.height,
    bytes: mainBuf.length,
    sourceFile: `.wrangler/openwork/${s.id}.png`,
    sourceSha256: sha(png),
    sourcePixels: [meta.width, meta.height],
    crop: s.kind === 'app' ? 'none' : s.kind === 'card' ? 'focus-card' : s.kind === 'focus' ? 'focus-chat' : 'focus-crop',
    upscaled: false,
    renderer: 'tools/openwork/render.mjs',
    scene: s.scene,
    render: { cssWidth: Math.round(meta.width / spec.dsf), scale: spec.dsf },
    variants,
  });
  console.log(`${s.id}: ${meta.width}×${meta.height} → ${mainMeta.width}×${mainMeta.height} (${(mainBuf.length / 1024).toFixed(0)} KB)${variants.length ? ` + ${variants.map(v => `${v.width}w ${(v.bytes / 1024).toFixed(0)} KB`).join(', ')}` : ''}`);
}

/* ---- register ------------------------------------------------------------ */
if (records.length) {
  const path = `${SITE}/tools/imagegen/product-assets.json`;
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  const fresh = new Map(records.map(r => [r.id, r]));
  doc.assets = [...doc.assets.filter(a => !fresh.has(a.id)), ...records].sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(path, JSON.stringify(doc, null, 1) + '\n');
  const hotPath = `${SITE}/tools/openwork/hotspots.json`;
  let prev = {};
  try { prev = JSON.parse(readFileSync(hotPath, 'utf8')).images ?? {}; } catch {}
  const images = Object.fromEntries(Object.entries({ ...prev, ...hot }).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(hotPath, JSON.stringify({ note: 'Written by tools/openwork/render.mjs. Boxes of the [data-hot] elements of each image, in percent of the image (x, y from the top-left corner). For callouts placed over a product image.', images }, null, 1) + '\n');
}

/* ---- share cover ---------------------------------------------------------- */
if (withOg) {
  const shotFile = `${WORK}/ow02-inquiry.png`;
  readFileSync(shotFile);   // the cover is composed from the inquiry render; render it first
  writeFileSync(`${WORK}/og-cover.html`, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>STARGO WORK</title><link rel="stylesheet" href="openwork.css"><style>
body{width:1200px;height:630px;overflow:hidden;background:#efece6;position:relative}
.copy{position:absolute;left:76px;top:0;bottom:0;width:420px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:600;letter-spacing:.06em;color:#1756d6;margin-bottom:20px}
.eyebrow svg{width:17px;height:17px}
.word{font-size:58px;line-height:1.02;font-weight:750;letter-spacing:-.025em;color:#1c1c1e;margin:0;white-space:nowrap}
.line{font-size:30px;line-height:1.35;font-weight:600;color:#1c1c1e;margin:22px 0 0;letter-spacing:.01em}
.sub{font-size:19px;line-height:1.6;color:#55534f;margin:14px 0 0}
.win{position:absolute;left:530px;top:62px;width:630px;height:620px;border-radius:16px;border:1px solid #dcd7cf;background:#f6f4f0;overflow:hidden;box-shadow:0 40px 80px -30px rgba(40,30,15,.30),0 2px 6px rgba(0,0,0,.05)}
.wbar{position:relative;z-index:1;height:34px;display:flex;align-items:center;gap:7px;padding:0 14px;border-bottom:1px solid #e3dfd9;background:#fbfaf8}
.wbar i{width:10px;height:10px;border-radius:50%;background:#d9d4cc;display:block}
.wbar b{margin-left:10px;font-size:12.5px;font-weight:600;color:#55534f;letter-spacing:.02em}
.wbar em{margin-left:auto;font-style:normal;font-size:12px;font-weight:600;color:#1c1c1e;background:rgba(255,255,255,.85);border:1px solid #e3dfd9;border-radius:999px;padding:2px 10px}
.view{position:absolute;top:35px;left:0;right:0;bottom:0;background:url('ow02-inquiry.png') no-repeat;background-size:960px 660px;background-position:-254px -34px}
</style></head><body>
<div class="copy">
  <div class="eyebrow">${icon('sparkle').replace('stroke="currentColor"', 'stroke="#1756d6" fill="#1756d6"')}OPEN WORK</div>
  <h1 class="word">STARGO WORK</h1>
  <p class="line">外贸工厂的 AI 工作台</p>
  <p class="sub">询盘、回复、报价单在一个对话框里完成。<br>AI 起草，你来拍板。</p>
</div>
<div class="win"><div class="wbar"><i></i><i></i><i></i><b>OPEN WORK</b><em>演示数据</em></div><div class="view"></div></div>
</body></html>`);
  const p = await open('og-cover', [1200, 630], 2);
  const src2x = `${WORK}/og-cover@2x.png`;
  await p.screenshot({ path: src2x });
  await p.close();
  const big = readFileSync(src2x);
  const out = await sharp(big).resize(1200, 630, { kernel: 'lanczos3' }).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(`${SITE}/${OG_FILE}`, out);
  const path = `${SITE}/tools/imagegen/assets-manifest.json`;
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  const entry = doc.assets.find(a => a.id === 'og-cover');
  const m = await sharp(out).metadata();
  Object.assign(entry, { width: m.width, height: m.height, bytes: out.length, originalSha256: sha(big) });
  if (doc.assets.length !== 43 || new Set(doc.assets.map(a => a.originalSha256)).size !== 43) throw new Error('assets-manifest: 43 unique originals expected');
  writeFileSync(path, JSON.stringify(doc, null, 1) + '\n');
  console.log(`og-cover: ${m.width}×${m.height} (${(out.length / 1024).toFixed(0)} KB) from ${src2x}`);
}
await browser.close();

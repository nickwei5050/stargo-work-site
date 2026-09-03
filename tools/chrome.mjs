/**
 * Site chrome shared by every page: navigation, overlay menu, floating pill,
 * footer, head metadata, script tags, and the template's shared English
 * strings.
 *
 * Links are REGENERATED from one list, not edited in place. The Mono export
 * carries three copies of its navigation on every page (top bar, overlay
 * menu, bottom pill) plus a footer "Pages" grid, and each page was exported
 * with a different subset. Rewriting text in place would leave whichever copy
 * did not match pointing at a template page that no longer exists.
 */
import { makeSub, findByClass, extractElement } from './lib-html.mjs';

export const NAV = [
  { href: 'index.html', label: '首页' },
  { href: 'capabilities.html', label: '能力全景' },
  { href: 'workforce.html', label: '数字员工' },
  { href: 'governance.html', label: '治理与安全' },
  { href: 'tour.html', label: '产品演示' },
  { href: 'contact.html', label: '联系' },
];
export const SECONDARY = [
  { href: 'integrations.html', label: '集成' },
  { href: 'notices.html', label: '第三方声明' },
];
export const ALL_PAGES = new Set([...NAV, ...SECONDARY].map((n) => n.href).concat(['404.html']));

const MOON = 'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4ef3_new-moon.webp';

/** Pages that existed in the template and where each now lives. */
const LEGACY = {
  'studio.html': 'governance.html',
  'work_work-1.html': 'capabilities.html',
  'work_work-2.html': 'integrations.html',
  'work_work-3.html': 'workforce.html',
  'blog_blog-1.html': 'notices.html', 'blog_blog-2.html': 'notices.html', 'blog_blog-3.html': 'notices.html',
  'contact.html': 'contact.html',
  'contact_contact-1.html': 'contact.html', 'contact_contact-2.html': 'contact.html', 'contact_contact-3.html': 'contact.html',
  'project_forma-digital.html': 'tour.html', 'project_nero-vision.html': 'workforce.html',
  'project_one-step.html': 'governance.html', 'project_bold-moves.html': 'governance.html',
  '401.html': 'index.html',
  'post_the-power-of-simplicity-in-modern-brand-design.html': 'notices.html',
  'post_from-idea-to-execution-building-products-that-last.html': 'notices.html',
  'post_why-great-brands-are-built-on-clarity-not-complexity.html': 'notices.html',
  'post_designing-digital-systems-that-scale-with-your-business.html': 'notices.html',
};

/* ------------------------------------------------------------ helpers -- */

function firstLink(block) {
  const m = block.match(/<a\b[^>]*>[\s\S]*?<\/a>/);
  if (!m) throw new Error('chrome: no <a> template in block');
  return extractElement(block, m.index, 'a').text;
}

function renderLink(tpl, { href, label }, current) {
  let out = tpl
    .replace(/\s*aria-current="page"/, '')
    .replace(/ w--current\b/, '')
    .replace(/href="[^"]*"/, `href="${href}"`)
    .replace(/(<div class="navigation-text-main[^"]*">)[^<]*(<\/div>)/, `$1${label}$2`)
    .replace(/(<div class="button-text[^"]*">)[^<]*(<\/div>)/g, `$1${label}$2`);
  if (current) {
    out = out.replace(/<a\b/, '<a aria-current="page"').replace(/class="([^"]*)"/, 'class="$1 w--current"');
  }
  return out;
}

function replaceInner(html, el, inner) {
  const openEnd = el.text.indexOf('>') + 1;
  const closeLen = el.text.length - el.text.lastIndexOf('</');
  return html.slice(0, el.start + openEnd) + inner + html.slice(el.end - closeLen);
}

/* -------------------------------------------------------------- parts -- */

function topNav(html, current) {
  const m = html.match(/<nav role="navigation" class="nav-menu first w-nav-menu">[\s\S]*?<\/nav>/);
  if (!m) throw new Error('chrome: top nav not found');
  const tpl = firstLink(m[0]);
  const links = NAV.map((n) => renderLink(tpl, n, n.href === current)).join('');
  return html.replace(m[0], `<nav role="navigation" class="nav-menu first w-nav-menu">${links}</nav>`);
}

function overlayMenu(html, current) {
  const flex = findByClass(html, 'div', 'nav-top-flex');
  if (!flex) {
    // 401/404 ship no overlay menu, yet keep the hamburger that opens it.
    if (!html.includes('menu-wrapper')) return html.replace(/<div class="menu-button w-nav-button">[\s\S]*?<\/div><\/div>/, '');
    throw new Error('chrome: overlay menu not found');
  }
  const item = findByClass(flex.text, 'div', 'menu-item');
  const linkTpl = firstLink(item.text);
  const items = [...NAV, ...SECONDARY].map((n, i) =>
    `<div class="menu-item _0${i + 1}">${renderLink(linkTpl, n, n.href === current)}</div>`).join('');
  return replaceInner(html, flex, items);
}

function bottomPill(html, current) {
  const pill = findByClass(html, 'div', 'menu-bottom');
  if (!pill) return html;   // 401/404 do not ship the pill
  let text = pill.text;
  const left = findByClass(text, 'div', 'menu-first-bottom', 0);
  const tpl = firstLink(left.text);
  const render = (list) => list.map((n) => renderLink(tpl, n, n.href === current)).join('');
  text = text.slice(0, left.start) + `<div class="menu-first-bottom">${render([NAV[1], NAV[2]])}</div>` + text.slice(left.end);
  const right = findByClass(text, 'div', 'menu-first-bottom', 1);
  text = text.slice(0, right.start) + `<div class="menu-first-bottom right">${render([NAV[3], NAV[5]])}</div>` + text.slice(right.end);
  return html.slice(0, pill.start) + text + html.slice(pill.end);
}

function footerPages(html, current) {
  const grid = findByClass(html, 'div', 'footer-small-grid');
  if (!grid) throw new Error('chrome: footer pages grid not found');
  const tpl = firstLink(grid.text);
  const cols = [
    [NAV[0], NAV[1], NAV[2]],
    [NAV[3], SECONDARY[0], NAV[4]],
    [NAV[5], SECONDARY[1]],
  ];
  const inner = cols.map((c) => `<div class="flex-item">${c.map((n) => renderLink(tpl, n, n.href === current)).join('')}</div>`).join('');
  return replaceInner(html, grid, inner);
}

/** Template strings shared by every Mono page. Optional: index is already localised. */
const SHARED = [
  ['<p class="top-text logo">Mōno™</p>', '<p class="top-text logo">STARGO</p>'],
  ['<p class="top-text logo z-inxed">Studio</p>', '<p class="top-text logo z-inxed">WORK</p>'],
  ['<p class="top-text logo inv">Mōno™</p>', '<p class="top-text logo inv">STARGO</p>'],
  ['<p class="top-text logo z-inxed nrm">Studio</p>', '<p class="top-text logo z-inxed nrm">WORK</p>'],
  ['<p class="top-text logo no-bg">Mōno™</p>', '<p class="top-text logo no-bg">STARGO</p>'],
  ['Crafting visuals. Shaping stories.', '把 AI 装进真实业务流程。'],
  ['Let’s create great work together!', '从一次企业 AI 诊断开始。'],
  ['Let’s Collaborate', '预约诊断'],
  ['(Newsletter)', '(订阅更新)'],
  ['Be the first to know what’s new.', '产品进展第一时间通知你。'],
  ['No noise. Just curated updates.', '不发广告，只发产品与治理更新。'],
  ['Thank you for subscribing!', '订阅成功。'],
  ['Oops! Something went wrong while submitting the form.', '提交失败，请稍后重试。'],
  ['Thank you! Your submission has been received!', '已收到。'],
  ['© 2026 Mōno™ Studio -', '© 2026 STARGO WORK -'],
  ['(Pages)', '(页面)'],
  ['(New Projects / Business)', '(商务合作)'],
  ['(General Inquiries)', '(一般咨询)'],
  ['(Location)', '(地址)'],
  ['(Social)', '(社交)'],
  ['Roc Boronat 112, Floor 3 - Door 2 (08018) Barcelona, Spain', '(法律主体与办公地址待确认)'],
  ['placeholder="E-mail"', 'placeholder="邮箱"'],
  ['value="Subscribe"', 'value="订阅"'],
  ['data-wait="Please wait..."', 'data-wait="请稍候…"'],
  // contact band shared by studio / work / project pages
  ['(Contact us)', '(联系我们)'],
  ['Let&#x27;s talk.', '聊聊。'],
  ['placeholder="Name"', 'placeholder="姓名"'],
  ['placeholder="Last Name"', 'placeholder="公司"'],
  ['placeholder="Email"', 'placeholder="邮箱"'],
  ['value="Contact us"', 'value="发送"'],
  ['value="Contact Us"', 'value="发送"'],
  ['By contacting us, you accept our', '提交即表示你接受我们的'],
  ['>Terms<', '>使用条款<'],
  ['</a> and <a', '</a> 与 <a'],
  // overlay-menu contact card
  ['>Talk to Denis<', '>预约企业 AI 诊断<'],
  ['>Get in touch<', '>联系我们<'],
  ['>Schedule a call<', '>预约诊断<'],
  ['>Terms of use<', '>使用条款<'],
  ['>Privacy policy<', '>隐私政策<'],
  ['>Privacy Policy<', '>隐私政策<'],
  ['>View Work<', '>查看<'],
  ['>Read more<', '>阅读<'],
  // template contact details — none of these are STARGO's
  ['>contact@monostudio.io<', '>(正式邮箱待定)<'],
  ['>info@monostudio.io<', '>(正式邮箱待定)<'],
  ['>(+1) 930 046 720<', '>(联系电话待定)<'],
  ['href="mailto:contact@monostudio.io"', 'href="#"'],
  ['href="mailto:info@monostudio.io"', 'href="#"'],
  ['href="tel:(+1)930046720"', 'href="#"'],
  ['href="https://www.linkedin.com/"', 'href="#"'],
  ['href="https://www.twitter.com/"', 'href="#"'],
  ['href="https://www.dribbble.com/"', 'href="#"'],
  ['href="https://cal.com/"', 'href="contact.html"'],
];

function head(html, { title, description }) {
  const full = `${title} — STARGO WORK 7.0`;
  let out = html
    .replace(/<html([^>]*)lang="en"/, '<html$1lang="zh-CN"')
    .replace(/<title>[^<]*<\/title>/, `<title>${full}</title>`)
    // Attribute order and name/property vary between the exported pages.
    .replace(/<meta content="[^"]*" (name|property)="(description|og:description|twitter:description)"\/>/g, `<meta content="${description}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" (name|property)="(og:title|twitter:title)"\/>/g, `<meta content="${full}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" property="og:image"\/>/, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  if (/Mōno|monostudio/i.test(out.slice(0, out.indexOf('<body')))) throw new Error(`chrome: template metadata survives in <head> of ${title}`);
  return out;
}

function scripts(html) {
  let out = html
    .replace(/js\/app\.[0-9a-f]{8}\.[0-9a-f]{16}\.js/g, 'js/app.fused.js')
    .replace(/js\/(gsap|SplitText|ScrollTrigger)\.min_1\.js/g, 'js/$1.min.js');
  if ((out.match(/js\/app\.fused\.js/g) ?? []).length !== 1) throw new Error('chrome: expected exactly one page bundle');
  // One page id site-wide; see fuse-ix.mjs. data-wf-page, ix3 hook targets and form ids all carry it.
  // Only where a PAGE id appears: the same 24-hex shape also prefixes every asset path.
  out = out
    .replace(/data-wf-page="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page="699b6466d5f19893993a4bf1"')
    .replace(/data-wf-page-id="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page-id="699b6466d5f19893993a4bf1"')
    .replace(/\[\[\[&quot;699b6466d5f19893993a4[0-9a-f]{3}&quot;,/g, '[[[&quot;699b6466d5f19893993a4bf1&quot;,');
  if (!out.includes('js/stargo-forms.js')) out = out.replace('</body>', '<script src="js/stargo-forms.js"></script></body>');
  // The bottom pill is absent on 401/404, but the scroll script that hides it is not.
  out = out.replace(
    'const nav = document.querySelector(".menu-bottom");',
    'const nav = document.querySelector(".menu-bottom");\n  if (!nav) return; // no pill on this page',
  );
  // The template deleted its modal markup but kept the script that styles it.
  out = out.replace(
    'const overlay = document.querySelector(".blur-overlay");\n',
    'const overlay = document.querySelector(".blur-overlay");\n  if (!modal) return; // the template ships this markup removed\n',
  );
  return out;
}

/** Legacy hrefs, resolved by what the link says rather than where it pointed. */
export function remapLinks(html) {
  return html.replace(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (whole, pre, href, post, body) => {
    if (!(href in LEGACY)) return whole;
    const text = body.replace(/<[^>]+>/g, '');
    const byText =
      /治理|安全|审批|测试/.test(text) ? 'governance.html'
        : /能力|全景/.test(text) ? 'capabilities.html'
          : /数字员工|岗位/.test(text) ? 'workforce.html'
            : /集成|提供方|接入/.test(text) ? 'integrations.html'
              : /演示|闭环|十步/.test(text) ? 'tour.html'
                : /联系|诊断|预约/.test(text) ? 'contact.html'
                  : /声明|许可/.test(text) ? 'notices.html'
                    : /首页/.test(text) ? 'index.html'
                      : null;
    return `<a${pre}href="${byText ?? LEGACY[href]}"${post}>${body}</a>`;
  });
}

/* --------------------------------------------------------------- main -- */

export function applyChrome(html, { current, title, description }) {
  const { opt } = makeSub('chrome');
  let out = html;
  out = head(out, { title, description });
  out = topNav(out, current);
  out = overlayMenu(out, current);
  out = bottomPill(out, current);
  out = footerPages(out, current);
  for (const [a, b] of SHARED) out = opt(out, a, b);
  out = scripts(out);
  return out;
}

/** Every internal href must resolve to a page this build produces. */
export function assertInternalLinks(html, name) {
  const bad = new Set();
  for (const m of html.matchAll(/href="([^"#?]+\.html)(?:[#?][^"]*)?"/g)) {
    if (!ALL_PAGES.has(m[1])) bad.add(m[1]);
  }
  if (bad.size) throw new Error(`[${name}] links to pages that do not exist: ${[...bad].join(', ')}`);
}

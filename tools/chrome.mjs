/**
 * Site chrome shared by every page: navigation, overlay menu, floating pill,
 * footer, head metadata, script tags, the brand wordmark, the language
 * switch and the template's shared English strings — in both languages.
 *
 * Links are REGENERATED from one list, not edited in place. The Mono export
 * carries three copies of its navigation on every page (top bar, overlay
 * menu, bottom pill) plus a footer "Pages" grid, and each page was exported
 * with a different subset. Rewriting text in place would leave whichever copy
 * did not match pointing at a template page that no longer exists.
 */
import { makeSub, findByClass, extractElement } from './lib-html.mjs';
import { NAV, SECONDARY, LANG_SWITCH, CHROME, META, CONTACT_INFO } from './copy.mjs';

export const ALL_PAGES = new Set([...NAV, ...SECONDARY].map((n) => n.href).concat(['404.html']));
const WORDMARK = 'assets/brand/stargo-wordmark-600.png';

/** Pages that existed in the templates and where each now lives. */
const LEGACY = {
  'studio.html': 'enterprise.html',
  'work_work-1.html': 'capabilities.html', 'work_work-2.html': 'capabilities.html', 'work_work-3.html': 'workforce.html',
  'blog_blog-1.html': 'capabilities.html', 'blog_blog-2.html': 'capabilities.html', 'blog_blog-3.html': 'capabilities.html',
  'contact.html': 'contact.html',
  'contact_contact-1.html': 'contact.html', 'contact_contact-2.html': 'contact.html', 'contact_contact-3.html': 'contact.html',
  'project_forma-digital.html': 'index.html', 'project_nero-vision.html': 'index.html',
  'project_one-step.html': 'index.html', 'project_bold-moves.html': 'index.html',
  '401.html': 'index.html',
  'post_the-power-of-simplicity-in-modern-brand-design.html': 'capabilities.html',
  'post_from-idea-to-execution-building-products-that-last.html': 'capabilities.html',
  'post_why-great-brands-are-built-on-clarity-not-complexity.html': 'capabilities.html',
  'post_designing-digital-systems-that-scale-with-your-business.html': 'capabilities.html',
  'pricing.html': 'pricing.html', 'company.html': 'enterprise.html', 'about.html': 'enterprise.html', 'feature.html': 'capabilities.html',
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
  if (current) out = out.replace(/<a\b/, '<a aria-current="page"').replace(/class="([^"]*)"/, 'class="$1 w--current"');
  return out;
}

function replaceInner(html, el, inner) {
  const openEnd = el.text.indexOf('>') + 1;
  const closeLen = el.text.length - el.text.lastIndexOf('</');
  return html.slice(0, el.start + openEnd) + inner + html.slice(el.end - closeLen);
}

/* -------------------------------------------------------------- parts -- */

function links(lang, current) {
  const t = (p) => p[lang];
  const other = lang === 'zh' ? `en/${current}` : `../${current}`;
  const nav = NAV.map((n) => ({ href: n.href, label: t(n.label) }));
  const secondary = SECONDARY.map((n) => ({ href: n.href, label: t(n.label) }));
  const swap = { href: other, label: t(LANG_SWITCH), swap: true };
  return { nav, secondary, swap };
}

function topNav(html, L, current) {
  const m = html.match(/<nav role="navigation" class="nav-menu first w-nav-menu">[\s\S]*?<\/nav>/);
  if (!m) throw new Error('chrome: top nav not found');
  const tpl = firstLink(m[0]);
  const items = [...L.nav.slice(1), L.swap];          // the wordmark is the home link
  const out = items.map((n) => renderLink(tpl, n, n.href === current)).join('');
  return html.replace(m[0], `<nav role="navigation" class="nav-menu first w-nav-menu">${out}</nav>`);
}

function overlayMenu(html, L, current) {
  const flex = findByClass(html, 'div', 'nav-top-flex');
  if (!flex) {
    if (!html.includes('menu-wrapper')) return html.replace(/<div class="menu-button w-nav-button">[\s\S]*?<\/div><\/div>/, '');
    throw new Error('chrome: overlay menu not found');
  }
  const item = findByClass(flex.text, 'div', 'menu-item');
  const linkTpl = firstLink(item.text);
  const items = [...L.nav, ...L.secondary, L.swap].map((n, i) =>
    `<div class="menu-item _0${i + 1}">${renderLink(linkTpl, n, n.href === current)}</div>`).join('');
  return replaceInner(html, flex, items);
}

function bottomPill(html, L, current) {
  const pill = findByClass(html, 'div', 'menu-bottom');
  if (!pill) return html;
  let text = pill.text;
  const left = findByClass(text, 'div', 'menu-first-bottom', 0);
  const tpl = firstLink(left.text);
  const render = (list) => list.map((n) => renderLink(tpl, n, n.href === current)).join('');
  const byHref = (h) => L.nav.find((n) => n.href === h);
  text = text.slice(0, left.start) + `<div class="menu-first-bottom">${render([byHref('capabilities.html'), byHref('workforce.html')])}</div>` + text.slice(left.end);
  const right = findByClass(text, 'div', 'menu-first-bottom', 1);
  text = text.slice(0, right.start) + `<div class="menu-first-bottom right">${render([byHref('pricing.html'), byHref('contact.html')])}</div>` + text.slice(right.end);
  return html.slice(0, pill.start) + text + html.slice(pill.end);
}

function footerPages(html, L, current) {
  const grid = findByClass(html, 'div', 'footer-small-grid');
  if (!grid) throw new Error('chrome: footer pages grid not found');
  const tpl = firstLink(grid.text);
  const n = L.nav;
  const cols = [[n[0], n[1], n[2]], [n[3], n[4], n[5]], [n[6], ...L.secondary, L.swap]];
  const inner = cols.map((c) => `<div class="flex-item">${c.map((x) => renderLink(tpl, x, x.href === current)).join('')}</div>`).join('');
  return replaceInner(html, grid, inner);
}

/** The metallic STARGO wordmark replaces the template's two-word text logo. */
function wordmark(html) {
  const img = (cls) => `<img src="${WORDMARK}" alt="STARGO WORK" class="stargo-wordmark ${cls}"/>`;
  return html
    .replace(/<p class="top-text logo">(?:Mōno™|STARGO)<\/p><p class="top-text logo z-inxed">(?:Studio|WORK)<\/p>/g, img('in-nav'))
    .replace(/<p class="top-text logo inv">(?:Mōno™|STARGO)<\/p><p class="top-text logo z-inxed nrm">(?:Studio|WORK)<\/p>/g, img('in-footer'))
    .replace(/<p class="top-text logo no-bg">(?:Mōno™|STARGO)<\/p>/g, img('in-pill'))
    .replace(/<p class="top-text logo nbg">(?:Mōno™|STARGO)<\/p>/g, img('in-card'));
}

function head(html, lang, current) {
  const meta = META[current];
  const title = current === 'index.html' ? meta.title[lang] : `${meta.title[lang]} — STARGO WORK`;
  const description = meta.description[lang];
  const zhHref = current, enHref = `en/${current}`;
  const alt = lang === 'zh'
    ? `<link rel="alternate" hreflang="zh-CN" href="${zhHref}"/><link rel="alternate" hreflang="en" href="${enHref}"/>`
    : `<link rel="alternate" hreflang="zh-CN" href="../${zhHref}"/><link rel="alternate" hreflang="en" href="${current}"/>`;
  let out = html
    .replace(/<html([^>]*)lang="en"/, `<html$1lang="${lang === 'zh' ? 'zh-CN' : 'en'}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>${alt}`)
    .replace(/<meta content="[^"]*" (name|property)="(description|og:description|twitter:description)"\/>/g, `<meta content="${description}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" (name|property)="(og:title|twitter:title)"\/>/g, `<meta content="${title}" $1="$2"/>`)
    .replace(/<meta content="[^"]*" property="og:image"\/>/, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<link href="[^"]*" rel="shortcut icon" type="image\/x-icon"\/>/, '<link href="assets/brand/stargo-wordmark-600.png" rel="shortcut icon" type="image/png"/>')
    .replace(/<link href="[^"]*" rel="apple-touch-icon"\/>/, '<link href="assets/brand/stargo-wordmark-600.png" rel="apple-touch-icon"/>');
  const headText = out.slice(0, out.indexOf('<body')).replace(/<link[^>]*>/g, '');   // stylesheet file names carry template names
  if (/Mōno|monostudio|Scalora|Lifelogx/i.test(headText)) throw new Error(`chrome: template metadata survives in <head> of ${current}`);
  return out;
}

function scripts(html) {
  let out = html
    .replace(/js\/app\.[0-9a-f]{8}\.[0-9a-f]{16}\.js/g, 'js/app.fused.js')
    .replace(/js\/(gsap|SplitText|ScrollTrigger)\.min_1\.js/g, 'js/$1.min.js');
  if ((out.match(/js\/app\.fused\.js/g) ?? []).length !== 1) throw new Error('chrome: expected exactly one page bundle');
  out = out
    .replace(/data-wf-page="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page="699b6466d5f19893993a4bf1"')
    .replace(/data-wf-page-id="699b6466d5f19893993a4[0-9a-f]{3}"/g, 'data-wf-page-id="699b6466d5f19893993a4bf1"')
    .replace(/\[\[\[&quot;699b6466d5f19893993a4[0-9a-f]{3}&quot;,/g, '[[[&quot;699b6466d5f19893993a4bf1&quot;,');
  // Site overrides load on every page, after the template stylesheets.
  if (!out.includes('css/stargo-fusion.css')) {
    out = out.replace(/(<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>)/, '$1\n<link href="css/stargo-fusion.css" rel="stylesheet" type="text/css"/>');
    if (!out.includes('css/stargo-fusion.css')) throw new Error('chrome: could not attach stargo-fusion.css');
  }
  if (!out.includes('js/stargo-forms.js')) out = out.replace('</body>', '<script src="js/stargo-forms.js"></script></body>');
  if (!out.includes('js/stargo-tabs.js')) out = out.replace('</body>', '<script src="js/stargo-tabs.js"></script></body>');
  out = out.replace(
    'const nav = document.querySelector(".menu-bottom");',
    'const nav = document.querySelector(".menu-bottom");\n  if (!nav) return; // no pill on this page',
  );
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
      /治理|安全|审批|Enterprise|governance|FDE/i.test(text) ? 'enterprise.html'
        : /定价|Pricing/i.test(text) ? 'pricing.html'
          : /智能|Intelligence/i.test(text) ? 'intelligence.html'
            : /数字员工|Workforce|AI 员工|AI employees/i.test(text) ? 'workforce.html'
              : /能力|Capabilit|全景/i.test(text) ? 'capabilities.html'
                : /演示|Demo|联系|Contact|诊断|talk/i.test(text) ? 'contact.html'
                  : /声明|Notices|Licens/i.test(text) ? 'notices.html'
                    : /首页|Home|Trade OS/i.test(text) ? 'index.html'
                      : null;
    return `<a${pre}href="${byText ?? LEGACY[href]}"${post}>${body}</a>`;
  });
}

/** /en/ pages live one level down; every root-relative asset path moves up. */
export function relocateAssets(html) {
  return html
    .replace(/((?:src|href|data-src|data-poster-url|poster)=")(assets|css|js)\//g, '$1../$2/')
    .replace(/(srcset=")([^"]*)"/g, (_, a, v) => `${a}${v.replace(/(^|,\s*)(assets\/)/g, '$1../$2')}"`)
    .replace(/(data-video-urls=")([^"]*)"/g, (_, a, v) => `${a}${v.replace(/(^|,)(assets\/)/g, '$1../$2')}"`)
    .replace(/url\((&quot;|"|')?assets\//g, 'url($1../assets/')
    .replace(/url\(assets\//g, 'url(../assets/');
}

/* --------------------------------------------------------------- main -- */

export function applyChrome(html, { lang, current }) {
  const { opt } = makeSub('chrome');
  const L = links(lang, current);
  let out = html;
  out = head(out, lang, current);
  out = topNav(out, L, current);
  out = overlayMenu(out, L, current);
  out = bottomPill(out, L, current);
  out = footerPages(out, L, current);
  for (const [a, b] of CHROME) out = opt(out, a, b[lang]);
  out = wordmark(out);
  out = scripts(out);
  if (/monostudio|Mōno™ Studio/i.test(out)) throw new Error(`chrome: template brand survives in ${current}`);
  return out;
}

/** Every internal href must resolve to a page this build produces. */
export function assertInternalLinks(html, name) {
  const bad = new Set();
  for (const m of html.matchAll(/href="([^"#?]+\.html)(?:[#?][^"]*)?"/g)) {
    const h = m[1].replace(/^(\.\.\/|en\/)/, '');
    if (!ALL_PAGES.has(h)) bad.add(m[1]);
  }
  if (bad.size) throw new Error(`[${name}] links to pages that do not exist: ${[...bad].join(', ')}`);
}

export { CONTACT_INFO };

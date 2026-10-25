/**
 * Accessibility pass (review item Z15), run on every built page right after
 * tools/chrome.mjs applyChrome() and before links and assets are relocated.
 *
 * Everything here is markup a sighted reader never sees: landmarks, a skip
 * link that only appears while it has keyboard focus, heading semantics given
 * with ARIA, accessible names, and a few head tags. No visible word changes
 * and no element changes its box — with two exceptions that are retags of a
 * neutral element to a semantically right one whose CSS is class-only:
 * `div.footer` → `footer.footer`, and the FAQ answers' Webflow
 * `nav.w-dropdown-list` → `div.w-dropdown-list` (they are answers, not
 * navigation, and ten unnamed navigation landmarks were the result).
 *
 * Why ARIA rather than retagging the headings: the hero sentence, the STARGO /
 * WORK display words and the article headings are styled by tag-qualified
 * selectors (`p.top-text.big.nm`, `h1.h1`, `.lx-scope h3` …) across five
 * template sheets and css/stargo-fusion.css. `role="heading"`, `aria-level`,
 * `aria-hidden` and `role="none"` give screen readers and the accessibility
 * tree the right outline without moving a pixel.
 *
 * Every rule that targets something specific asserts that it matched, as the
 * rest of the build does: a template change that moves a target fails the
 * build instead of silently dropping the fix.
 */
import { extractElement } from './lib-html.mjs';
import { A11Y } from './copy.mjs';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'use', 'stop']);

/** Replace exactly `count` matches of `re` (global) with `fn`, or throw. */
function exact(html, re, fn, count, label) {
  const n = (html.match(re) ?? []).length;
  const out = html.replace(re, fn);
  if (n !== count) throw new Error(`a11y: ${label}: expected ${count} match(es), found ${n}`);
  return out;
}
/** Add attributes to an opening tag string (`<h1 class="x">` → `<h1 aria-hidden="true" class="x">`). */
const addAttrs = (open, attrs) => open.replace(/^<([a-zA-Z0-9]+)/, `<$1 ${attrs}`);
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/[​⁠­]/g, '').replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------ head ---- */
function headHygiene(html, { lang, name }) {
  /* The Mono template's own twitter:card survived next to the one
     tools/chrome.mjs writes; one is enough. */
  html = html.replace(/<meta content="summary_large_image" name="twitter:card"\/>/g, '');
  if ((html.match(/name="twitter:card"/g) ?? []).length !== 1) throw new Error(`a11y head: ${lang}/${name} must carry exactly one twitter:card`);
  /* Baidu: the same page serves phones and desktops, and it must not be
     transcoded into a Baidu "siteapp". */
  const viewport = /<meta[^>]*name="viewport"[^>]*\/>/;
  if (!viewport.test(html)) throw new Error(`a11y head: ${lang}/${name} has no viewport meta`);
  html = html.replace(viewport, (m) => `${m}<meta name="applicable-device" content="pc,mobile"/><meta http-equiv="Cache-Control" content="no-transform"/><meta http-equiv="Cache-Control" content="no-siteapp"/>`);
  if (name === '404.html') {
    /* The 404 template is what any unknown URL returns: it must not be
       indexed, nor claim a canonical address or language alternates. */
    html = exact(html, /<link rel="canonical" href="[^"]*"\/>/g, '', 1, '404 canonical');
    html = exact(html, /<link rel="alternate" hreflang="[^"]*" href="[^"]*"\/>/g, '', 3, '404 hreflang');
    html = html.replace(/<meta property="og:url" content="[^"]*"\/>/, '');
    html = html.replace(/<title>/, '<meta name="robots" content="noindex"/><title>');
  }
  return html;
}

/* ------------------------------------------------------- landmarks ---- */
/** The top-level elements between `from` and `to`, which must be siblings. */
function siblingsBetween(html, from, to, label) {
  let i = from;
  while (i < to) {
    const j = html.indexOf('<', i);
    if (j === -1 || j >= to) break;
    if (html.slice(i, j).trim()) throw new Error(`a11y main: ${label}: stray text before ${j}`);
    if (html.startsWith('</', j)) throw new Error(`a11y main: ${label}: the content before the footer is not a run of siblings`);
    if (html.startsWith('<!--', j)) { i = html.indexOf('-->', j) + 3; continue; }
    const tag = html.slice(j + 1).match(/^[a-zA-Z0-9]+/)[0].toLowerCase();
    if (tag === 'script' || tag === 'style') { i = html.indexOf(`</${tag}>`, j) + tag.length + 3; continue; }
    if (VOID.has(tag)) { i = html.indexOf('>', j) + 1; continue; }
    i = extractElement(html, j, tag).end;
  }
  if (i > to || html.slice(i, to).trim()) throw new Error(`a11y main: ${label}: the content before the footer does not end at the footer`);
}

function landmarks(html, { lang, name }) {
  const label = `${lang}/${name}`;
  /* The footer. Mono builds it as `div.footer`; every rule for it is a class
     rule, so the element can be the landmark it is. */
  const fOpen = /<div((?:\s+[a-zA-Z0-9-]+(?:="[^"]*")?)*?\s+class="footer(?: [^"]*)?"[^>]*)>/;
  const fm = html.match(fOpen);
  if (!fm) throw new Error(`a11y: ${label}: no footer`);
  {
    const el = extractElement(html, fm.index, 'div');
    const inner = el.text.slice(fm[0].length, -'</div>'.length);
    html = html.slice(0, el.start) + `<footer${fm[1]}>${inner}</footer>` + html.slice(el.end);
  }
  /* On the homepage and /capabilities the footer is the last child of
     `.page-content` (Mono's home layout); everywhere else it follows the page
     content. It moves out to follow `.page-content`, so that <main> can end
     where the footer begins. `.page-content` is `position: relative;
     z-index: 20` and nothing else; the footer is `position: relative;
     z-index: 13` and draws in the same place. */
  let f = html.indexOf('<footer');
  const pc = html.indexOf('<div class="page-content"');
  if (pc !== -1 && pc < f) {
    const pcEl = extractElement(html, pc, 'div');
    if (pcEl.end > f) {
      const fEl = extractElement(html, f, 'footer');
      if (html.slice(fEl.end, pcEl.end - '</div>'.length).trim()) throw new Error(`a11y: ${label}: the footer is not the last child of .page-content`);
      html = html.slice(0, fEl.start) + html.slice(fEl.end, pcEl.end) + fEl.text + html.slice(pcEl.end);
      f = html.indexOf('<footer');
    }
  }
  /* <main>: everything between the top navigation and the footer.
     `display: contents` (css/stargo-fusion.css, a11y lane) so the wrapper
     adds no box: every section keeps its parent for layout, stacking and
     sticky positioning. A box-less element cannot take focus, so the skip
     link's target is an empty span at the start of <main>: positioned out of
     flow, it takes no room, and focus lands at the top of the content. */
  const navStart = html.search(/<div class="(?:navigation-top[^"]*|absolute-element)">/);
  if (navStart === -1 || navStart > f) throw new Error(`a11y: ${label}: no top navigation before the footer`);
  const navTag = html.slice(navStart, navStart + 200).match(/^<div class="([^"]*)"/)[1];
  const navEl = extractElement(html, navStart, 'div');
  siblingsBetween(html, navEl.end, f, label);
  html = html.slice(0, navEl.end) + '<main class="stargo-main"><span id="main" class="stargo-main-start" tabindex="-1"></span>' + html.slice(navEl.end, f) + '</main>' + html.slice(f);
  if (!/navigation-top|absolute-element/.test(navTag)) throw new Error(`a11y: ${label}: unexpected navigation container ${navTag}`);

  /* Navigation landmarks with names: the top bar's menu, and the desktop
     bottom pill (a row of page links). */
  html = exact(html, /<nav role="navigation" class="nav-menu first w-nav-menu"/g, `<nav role="navigation" aria-label="${A11Y.mainNav[lang]}" class="nav-menu first w-nav-menu"`, 1, `${label} main nav`);
  html = html.replace(/<div class="menu-bottom">/g, `<div class="menu-bottom" role="navigation" aria-label="${A11Y.pillNav[lang]}">`);
  /* Webflow dropdown lists are <nav> by default; on /pricing they hold the
     FAQ answers. */
  for (let i; (i = html.search(/<nav class="faq-answer-block w-dropdown-list"/)) !== -1;) {
    const el = extractElement(html, i, 'nav');
    html = html.slice(0, el.start) + '<div' + el.text.slice(4, -'</nav>'.length) + '</div>' + html.slice(el.end);
  }

  /* Skip link: the first thing Tab reaches; off-screen until focused. */
  /* Webflow's same-page link handler takes the click and does not move focus
     to the target, so the link moves it itself (and stops the click there). */
  const skipJs = "document.currentScript.previousElementSibling.addEventListener('click',function(e){var t=document.getElementById('main');if(!t)return;e.preventDefault();e.stopPropagation();t.focus({preventScroll:true});window.scrollTo(0,Math.max(0,t.getBoundingClientRect().top+window.pageYOffset-80));});";
  html = exact(html, /<body([^>]*)>/g, (m) => `${m}<a class="stargo-skip" href="#main">${A11Y.skip[lang]}</a><script>${skipJs}</script>`, 1, `${label} body`);
  return html;
}

/* -------------------------------------------------------- headings ---- */
/** Per-page fixes: one level-one heading, decorative display words out of the outline. */
function pageHeadings(html, { lang, name }) {
  const label = `${lang}/${name}`;
  if (name === 'index.html') {
    /* The definition sentence is the page's level-one heading; STARGO / WORK
       are display type (the wordmark already names the site). */
    html = exact(html, /<h1(\b[^>]*class="h1"[^>]*)>STARGO<\/h1>/g, '<h1 aria-hidden="true"$1>STARGO</h1>', 1, `${label} STARGO`);
    html = exact(html, /<h2(\b[^>]*class="h1"[^>]*)>WORK<\/h2>/g, '<h2 aria-hidden="true"$1>WORK</h2>', 1, `${label} WORK`);
    html = exact(html, /<p class="top-text big nm" data-mobile-text=/g, '<p role="heading" aria-level="1" class="top-text big nm" data-mobile-text=', 1, `${label} hero sentence`);
    /* The four problem cards: an empty h3 (a hover placeholder) and a
       number h3 each. */
    html = exact(html, /<h3 class="work-title"><\/h3>/g, '<h3 class="work-title" aria-hidden="true"></h3>', 4, `${label} empty work-title`);
    html = exact(html, /<h3 class="work-title">(\d\d)<\/h3>/g, '<h3 role="none" class="work-title">$1</h3>', 4, `${label} numbered work-title`);
    /* The big split statements (“288 / 个 AI 员工 / 覆盖 / 十类职能”,
       “AI 做准备，/ 由你拍板。”): each fragment is an h2. They stay text. */
    let n = 0;
    html = html.replace(/<h2 class="(h2 _01(?: sm)?(?: _600)?(?: lw)?)">([^<]{1,26})<\/h2>/g, (m, cls, text) => { n++; return `<h2 role="none" class="${cls}">${text}</h2>`; });
    if (n !== 8) throw new Error(`${label}: expected the eight split display fragments, found ${n}`);
  }
  if (name === 'about.html') {
    /* The intro's first line is the page's title. It shares a paragraph with
       the text after it, so it is marked as a heading where it stands. */
    const at = html.indexOf('<section class="cn-section-home-intro">');
    const m = at === -1 ? null : html.slice(at).match(/^[\s\S]*?(<p class="cn-text-size-large">)((?:(?!<\/p>)[\s\S])*?)<br\/>/);
    if (!m || m[2].length > 400 || /<(?:p|div|a)\b/.test(m[2])) throw new Error(`${label}: intro line not found`);
    const start = at + m[0].length - m[2].length - '<br/>'.length;
    html = html.slice(0, start) + `<span role="heading" aria-level="1">${m[2]}</span>` + html.slice(start + m[2].length);
  }
  if (name === 'about.html' || name === 'pricing.html') {
    /* cinery's two-word display titles (“AI / 团队”, “四个 / 岗位”, “合适 /
       配置”): one heading named by both words on /about; on /pricing they
       precede the page's own h1 and are decoration. */
    const words = [...html.matchAll(/<h2 class="cn-heading-style-h2">([^<]+)<\/h2>/g)];
    if (words.length % 2 || !words.length) throw new Error(`${label}: expected cinery title pairs, found ${words.length}`);
    let k = 0;
    html = html.replace(/<h2 class="cn-heading-style-h2">([^<]+)<\/h2>/g, (m, text) => {
      const idx = k++;
      if (name === 'pricing.html') return `<h2 role="none" class="cn-heading-style-h2">${text}</h2>`;
      if (idx % 2 === 0) return `<h2 aria-label="${words[idx][1]} ${words[idx + 1][1]}" class="cn-heading-style-h2">${text}</h2>`;
      return `<h2 aria-hidden="true" class="cn-heading-style-h2">${text}</h2>`;
    });
  }
  if (name === 'workforce.html') {
    /* Two lines of one headline, each an h1: the second is its subtitle. */
    html = exact(html, /<h1 class="lx-heading-style-h1 lx-white">/g, '<h1 aria-level="2" class="lx-heading-style-h1 lx-white">', 1, `${label} second h1`);
  }
  if (name === 'capabilities.html') {
    /* The title carries U+2060 word joiners and a U+200B break opportunity
       that keep its Chinese phrases whole on screen; its name is the text
       without them. */
    html = exact(html, /<h1(\b[^>]*)>([\s\S]*?)<\/h1>/g, (m, attrs, inner) => `<h1 aria-label="${plain(inner)}"${attrs}>${inner}</h1>`, 1, `${label} h1`);
  }
  if (name === 'enterprise.html') {
    /* “(决定) (核对) (连接) (经营)” and the counters 288 / 13 / 3. */
    html = exact(html, /<h2 class="(h2 for-abt d0\d)">/g, '<h2 role="none" class="$1">', 4, `${label} for-abt words`);
    html = exact(html, /<h2 class="h2 _01">(\d+)<\/h2>/g, '<h2 role="none" class="h2 _01">$1</h2>', 3, `${label} counters`);
  }
  return html;
}

/** Ranges of the page that are not in the accessibility tree. */
function hiddenRanges(html) {
  const ranges = [];
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)) {
    const [, rawTag, attrs] = m;
    if (!/\saria-hidden="true"|\sinert(?:=""|(?=[\s/]|$))/.test(attrs)) continue;
    const tag = rawTag.toLowerCase();
    if (VOID.has(tag) || attrs.endsWith('/')) continue;
    try { const el = extractElement(html, m.index, tag); ranges.push([el.start, el.end]); } catch { /* unbalanced tag: leave it */ }
  }
  return ranges;
}

/**
 * Heading order: a heading may go at most one level deeper than the heading
 * it follows. The template levels are kept in the markup (they carry the
 * type); where one skips (h1 → h3 in the articles, h2 → h4 on the listing
 * cards), `aria-level` gives the level it has in the page's outline. Levels
 * are mapped, not counted: siblings of one skipped level all get the same.
 */
function headingOrder(html) {
  const hidden = hiddenRanges(html);
  const isHidden = (i) => hidden.some(([a, b]) => i > a && i < b);
  const bodyAt = html.indexOf('<body');
  const re = /<(h[1-6]|[a-z]+)\b([^>]*)>/g;
  const stack = [];   // [{ orig, eff }]
  const edits = [];
  for (let m; (m = re.exec(html));) {
    if (m.index < bodyAt) continue;
    const [open, tag, attrs] = m;
    if (tag === 'script' || tag === 'style') { re.lastIndex = html.indexOf(`</${tag}>`, m.index); continue; }
    let level;
    const ariaLevel = attrs.match(/\saria-level="(\d)"/);
    if (/^h[1-6]$/.test(tag)) {
      if (/\srole="(?:none|presentation)"/.test(attrs) || /\saria-hidden="true"/.test(attrs)) continue;
      level = ariaLevel ? +ariaLevel[1] : +tag[1];
    } else if (/\srole="heading"/.test(attrs)) {
      level = ariaLevel ? +ariaLevel[1] : 2;
    } else continue;
    if (isHidden(m.index)) continue;
    while (stack.length && stack[stack.length - 1].orig >= level) stack.pop();
    const eff = stack.length ? Math.min(level, stack[stack.length - 1].eff + 1) : level;
    stack.push({ orig: level, eff });
    if (eff !== level) edits.push({ at: m.index, open, eff });
  }
  for (const e of edits.reverse()) {
    const fixed = /\saria-level="\d"/.test(e.open) ? e.open.replace(/\saria-level="\d"/, ` aria-level="${e.eff}"`) : addAttrs(e.open, `aria-level="${e.eff}"`);
    html = html.slice(0, e.at) + fixed + html.slice(e.at + e.open.length);
  }
  return html;
}

/* --------------------------------------------------------- names ---- */
function names(html) {
  /* Buttons that roll a second copy of their label in on hover: the copy is
     decoration, and without this the link is named twice ("预约演示 预约演示"). */
  html = html.replace(/(<(div|p)((?: button-text="")?) class="([^"]*button-text\b[^"]*)">([^<]*)<\/\2>)<\2\3 class="\4">\5<\/\2>/g,
    '$1<$2$3 class="$4" aria-hidden="true">$5</$2>');
  html = html.replace(/<div class="(rk-rt-button-text rk-rt-text-two[^"]*)">/g, '<div class="$1" aria-hidden="true">');
  /* The marquee CTA (“Discuss your workflow • Discuss your workflow • …”):
     the link is named once, the running text is decoration. */
  html = html.replace(/(<a\b[^>]*class="cn-cta-button[^"]*")([^>]*>[\s\S]*?)<div class="cn-cta-text-wrap"><div class="cn-cta-text-item"><div class="cn-cta-text">([^<]+)<\/div>/g,
    (m, open, mid, text) => `${open} aria-label="${text}"${mid}<div class="cn-cta-text-wrap" aria-hidden="true"><div class="cn-cta-text-item"><div class="cn-cta-text">${text}</div>`);
  /* The channel band's platform icons name no platform; they are decoration
     next to the band's own text. */
  html = html.replace(/(<img\b[^>]*?)alt="(?:渠道图标|Channel icon)"([^>]*class="integration-icon")/g, '$1alt=""$2');
  if (/alt="(?:渠道图标|Channel icon)"/.test(html)) throw new Error('a11y: a channel icon kept its placeholder alt');
  /* The articles' related list: Webflow's collection markup puts
     role="listitem" on the <a> itself, which takes the link role away. The
     list is a plain run of links. */
  html = html.replace(/ role="list"( class="lx-related-list )/g, '$1').replace(/<a role="listitem" /g, '<a ');
  /* The mouse-follow cursor label (“查看”) and the crosshair are pointer
     decoration, outside every landmark. */
  html = html.replace(/<div class="text-tool-tip">/g, '<div class="text-tool-tip" aria-hidden="true">')
    .replace(/<div class="plus-line-wrapper">/g, '<div class="plus-line-wrapper" aria-hidden="true">');
  return html;
}

export function a11yPage(html, { lang, name }) {
  html = headHygiene(html, { lang, name });
  html = landmarks(html, { lang, name });
  html = names(html);
  html = pageHeadings(html, { lang, name });
  html = headingOrder(html);
  if ((html.match(/<main\b/g) ?? []).length !== 1) throw new Error(`a11y: ${lang}/${name} must have exactly one <main>`);
  return html;
}

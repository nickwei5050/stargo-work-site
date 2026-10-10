/**
 * Comment stripping for what the site ships (review, round 2: comments in
 * served files named the purchased templates, their vendors and the retired
 * notices page). Licence banners stay: a block comment that opens with `/*!`
 * (jQuery, GSAP, Lenis, lottie-web …) is kept as written.
 *
 *   stripCss(text)        CSS: every block comment but `/*! … *\/`
 *   stripJs(text)         a classic script: line and block comments but `/*! … *\/`
 *   stripHtml(html)       a page: <!-- … --> (not conditional comments and not
 *                         the template's empty <!--$--> / <!--/$--> markers),
 *                         and the comments inside inline <script> (JavaScript
 *                         only, not JSON) and <style>
 *
 * The scanners know strings, template literals (with ${…}), regular-expression
 * literals and CSS strings, so a `//` or `/*` inside one is left alone. A
 * block comment that spans lines becomes a line break and any other comment a
 * space, so automatic semicolon insertion and token boundaries do not change.
 * Callers check the result parses (tools/make-dist.mjs, tools/build-site.mjs
 * compile every stripped script with node:vm before it ships).
 */

const KEYWORD_BEFORE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

/** CSS: drop block comments (keep `/*!`), respecting quoted strings. */
export function stripCss(css) {
  let out = '';
  let i = 0;
  const n = css.length;
  while (i < n) {
    const c = css[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && css[j] !== c && css[j] !== '\n') j += css[j] === '\\' ? 2 : 1;
      out += css.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end < 0 ? n : end + 2;
      if (css[i + 2] === '!') out += css.slice(i, stop);
      else {
        const prev = out[out.length - 1] ?? '', next = css[stop] ?? '';
        out += /[\w-]/.test(prev) && /[\w-]/.test(next) ? ' ' : '';
      }
      i = stop;
      continue;
    }
    out += c;
    i++;
  }
  /* the blank lines a removed comment block leaves */
  return out.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n');
}

/** JavaScript (a classic script): drop comments (keep `/*!`), respecting strings, templates and regex literals. */
export function stripJs(src) {
  const n = src.length;
  let out = '';
  let i = 0;
  /* the last significant token, to tell a regex literal from a division */
  let last = '';
  let lastWord = '';
  const regexAllowed = () => last === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(last) || KEYWORD_BEFORE_REGEX.has(lastWord);
  function scanString(q) {
    let j = i + 1;
    while (j < n && src[j] !== q) {
      if (src[j] === '\\') j += 2;
      else if (src[j] === '\n' && q !== '`') break;
      else j++;
    }
    out += src.slice(i, j + 1);
    i = j + 1;
  }
  function scanTemplate() {
    out += '`';
    i++;
    while (i < n && src[i] !== '`') {
      if (src[i] === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
      if (src[i] === '$' && src[i + 1] === '{') {
        out += '${';
        i += 2;
        scan('}');
        out += '}';
        i++;
        continue;
      }
      out += src[i];
      i++;
    }
    out += '`';
    i++;
  }
  function scanRegex() {
    let j = i + 1, cls = false;
    while (j < n) {
      const ch = src[j];
      if (ch === '\\') { j += 2; continue; }
      if (ch === '\n') break;
      if (cls) { if (ch === ']') cls = false; }
      else if (ch === '[') cls = true;
      else if (ch === '/') break;
      j++;
    }
    j++;
    while (j < n && /[a-z]/i.test(src[j])) j++;
    out += src.slice(i, j);
    i = j;
  }
  /** Scan code until `close` (a `}` that ends a template expression) at depth 0, or the end. */
  function scan(close) {
    let depth = 0;
    while (i < n) {
      const c = src[i];
      if (close && c === close && depth === 0) return;
      if (c === '"' || c === "'") { scanString(c); last = '"'; lastWord = ''; continue; }
      if (c === '`') { scanTemplate(); last = '`'; lastWord = ''; continue; }
      if (c === '/' && src[i + 1] === '/') {
        let j = src.indexOf('\n', i);
        if (j < 0) j = n;
        i = j;   // the line break itself stays
        continue;
      }
      if (c === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2);
        const stop = end < 0 ? n : end + 2;
        if (src[i + 2] === '!') out += src.slice(i, stop);
        else out += src.slice(i, stop).includes('\n') ? '\n' : ' ';
        i = stop;
        continue;
      }
      if (c === '/' && regexAllowed()) { scanRegex(); last = '/'; lastWord = ''; continue; }
      if (/[A-Za-z_$0-9]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z_$0-9]/.test(src[j])) j++;
        lastWord = src.slice(i, j);
        last = 'a';
        out += lastWord;
        i = j;
        continue;
      }
      if (c === '{') depth++;
      if (c === '}') depth--;
      if (!/\s/.test(c)) { last = c; lastWord = ''; }
      out += c;
      i++;
    }
  }
  scan(null);
  return out.replace(/[ \t]+$/gm, '').replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n');
}

const JS_TYPE = /^(?:|text\/javascript|application\/javascript|module)$/i;
/** A page: HTML comments, and the comments inside its inline scripts and styles. */
export function stripHtml(html, check = () => {}) {
  return html
    .replace(/<!--(?!\[if|\$-->|\/\$-->)[\s\S]*?-->/g, '')
    .replace(/(<script\b([^>]*)>)([\s\S]*?)(<\/script>)/g, (m, open, attrs, body, close) => {
      if (/\ssrc=/.test(attrs) || !body.trim()) return m;
      const type = (/\stype="([^"]*)"/.exec(attrs)?.[1] ?? '').trim();
      if (!JS_TYPE.test(type)) return m;
      const stripped = stripJs(body);
      check(stripped, type === 'module');
      return open + stripped + close;
    })
    .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/g, (m, open, body, close) => open + stripCss(body) + close);
}

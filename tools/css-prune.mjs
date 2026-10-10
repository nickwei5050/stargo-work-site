/**
 * Dead picture rules out of a shipped stylesheet (review, round 2).
 *
 * The purchased templates' stylesheets carry rules for blocks no page renders
 * any more — `.team-small-card`, `.author-circle`, `.image-about`,
 * `.photo-half`, `.rk-hero` … — and those rules name the templates' stock
 * photographs in `url()`. tools/make-dist.mjs ships every file a shipped file
 * names, so the photographs shipped too, although no visitor's browser ever
 * fetched one.
 *
 * pruneDeadImageRules(css, alive) drops a style rule only when both hold:
 *   - its declarations name a file in `url()` (a data: URI ships nothing; other
 *     rules are left exactly as they are);
 *   - every selector in its list names a class or an id that `alive(kind, name)`
 *     says appears nowhere. Whatever sits inside parentheses (`:not(.x)`,
 *     `:is(…)`, `:has(…)`) or brackets (`[class*="…"]`) is not counted, and a
 *     selector with an escape (`\:`) or no class or id at all counts as alive:
 *     when in doubt, a rule stays.
 * Rules inside @media, @supports, @container and @layer blocks are handled the
 * same way; @font-face, @keyframes, @page and the like are never touched.
 * The input is expected without comments (tools/strip-comments.mjs stripCss).
 */

/** Split `text` at top-level occurrences of `sep` (outside strings, parentheses and brackets). */
function splitTop(text, sep) {
  const out = [];
  let depth = 0, quote = '', start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === sep && depth === 0) { out.push(text.slice(start, i)); start = i + 1; }
  }
  out.push(text.slice(start));
  return out;
}

/** True when this one complex selector names a class or id that is on no page. */
function deadSelector(sel, alive) {
  if (sel.includes('\\')) return false;
  let flat = '', depth = 0, quote = '';
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (quote) { if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '(' || c === '[') { depth++; continue; }
    if (c === ')' || c === ']') { depth--; continue; }
    if (!depth) flat += c;
  }
  for (const m of flat.matchAll(/([.#])(-?[_a-zA-Z][\w-]*)/g)) {
    if (!alive(m[1] === '.' ? 'class' : 'id', m[2])) return true;
  }
  return false;
}

/* a url() that names a file; a data: URI ships nothing, so its rule is left alone */
const FILE_URL = /url\(\s*(?!['"]?data:)/i;
const KEEP_AT = /^@(?:font-face|(?:-[a-z]+-)?keyframes|page|property|counter-style|font-feature-values|import|charset|namespace)\b/i;
const NEST_AT = /^@(?:media|supports|container|layer|document|-moz-document)\b/i;

/**
 * @param {string} css stylesheet without comments
 * @param {(kind: 'class'|'id', name: string) => boolean} alive
 * @returns {{ css: string, dropped: string[] }} the stylesheet without the dead picture rules, and their selectors
 */
export function pruneDeadImageRules(css, alive) {
  const dropped = [];
  const walk = (text) => {
    let out = '', i = 0;
    while (i < text.length) {
      /* the prelude: up to the next top-level `{` or `;` */
      let j = i, quote = '', paren = 0;
      for (; j < text.length; j++) {
        const c = text[j];
        if (quote) { if (c === '\\') j++; else if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'") quote = c;
        else if (c === '(') paren++;
        else if (c === ')') paren--;
        else if (!paren && (c === '{' || c === ';' || c === '}')) break;
      }
      if (j >= text.length || text[j] !== '{') { out += text.slice(i, j + 1); i = j + 1; continue; }
      /* the block: up to its matching `}` */
      let k = j + 1, level = 1;
      quote = '';
      for (; k < text.length && level; k++) {
        const c = text[k];
        if (quote) { if (c === '\\') k++; else if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'") quote = c;
        else if (c === '{') level++;
        else if (c === '}') level--;
      }
      const prelude = text.slice(i, j), body = text.slice(j + 1, k - 1), head = prelude.trim();
      if (NEST_AT.test(head)) out += `${prelude}{${walk(body)}}`;
      else if (head.startsWith('@') || KEEP_AT.test(head) || !FILE_URL.test(body)) out += text.slice(i, k);
      else if (splitTop(head, ',').every((sel) => deadSelector(sel.trim(), alive))) dropped.push(head.replace(/\s+/g, ' '));
      else out += text.slice(i, k);
      i = k;
    }
    return out;
  };
  return { css: walk(css), dropped };
}

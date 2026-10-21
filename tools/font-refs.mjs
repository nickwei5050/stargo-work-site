/**
 * Point a stylesheet's TrueType/OpenType fonts at their WOFF2 copies.
 *
 * The donor templates ship several faces as raw .ttf: InterDisplay at about
 * 400 KB a weight (and twice over, once under assets/qubix/ and once under
 * assets/69a01660…/, byte-identical), 42dot Sans at 2.5 MB a weight, Playfair
 * and Instrument Serif. tools/optimize-fonts.mjs writes one subset WOFF2 per
 * distinct file and records the mapping in tools/data/font-woff2.json; every
 * script that writes a stylesheet passes it through woff2Refs() so the page
 * asks for the small file, and two references to the same bytes ask for the
 * same URL (one download, one cache entry).
 *
 * Only the src URL and its format() hint change. Family names, weights,
 * styles, font-display and the glyph outlines a page uses stay what the donor
 * shipped, so text renders as before.
 */
import { readFileSync, existsSync } from 'node:fs';
import { SITE } from './paths.mjs';

const MANIFEST = `${SITE}/tools/data/font-woff2.json`;
let map = null;
const load = () => (map ??= existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')).fonts : {});

/** `url("../assets/x.ttf") format("truetype")` → `url("../assets/x.woff2") format("woff2")`, for every font in the manifest. */
export function woff2Refs(css) {
  const fonts = load();
  return css.replace(/url\((["']?)((?:\.\.\/)?)(assets\/[^"')]+?\.(?:ttf|otf))\1\)(\s*)format\((["'])(?:truetype|opentype)\5\)/gi, (m, q, up, path, sp, fq) => {
    const to = fonts[decodeURI(path)];
    if (!to) return m;
    return `url(${q}${up}${encodeURI(to)}${q})${sp}format(${fq}woff2${fq})`;
  });
}

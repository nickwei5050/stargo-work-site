#!/usr/bin/env python3
"""
Subset the self-hosted 42dot Sans faces (SIL OFL 1.1) to WOFF2 without Hangul.

The five TTF originals under assets/6929b6c693cb856e01ef7c05/ are 2.5 MB each,
because 42dot Sans carries 11,172 Hangul syllables plus jamo. This site is
Chinese and English only (no Hangul anywhere in pages, CSS or JS), so the
subset keeps every other glyph the font has - Latin, punctuation, symbols and
its CJK / full-width punctuation - and drops only the Hangul blocks. Layout
features (kerning, ligatures, the lot) are kept, so text that is not Hangul
renders exactly as before; each face shrinks from ~2.5 MB to ~tens of KB.

Needs fonttools + brotli (pip install fonttools brotli). Run from the repo root:
    python3 tools/subset-42dot.py
Outputs assets/fonts/42dotsans-<weight>-latin.woff2, which css/lifelogx.lx.css
(see tools/lifelogx-prepare.mjs, FONT_SUBSET) points at. The build does not run
this script; the outputs are committed, like the other self-hosted fonts.
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

SRC = "assets/6929b6c693cb856e01ef7c05"
OUT = "assets/fonts"
FACES = {
    300: "692d67d5352a9e573a217538_42dotsans-light.ttf",
    400: "692d67d4a6bcca04680071de_42dotsans-regular.ttf",
    500: "692d67d446c2417b55fe26ca_42dotsans-medium.ttf",
    700: "692d67d4b0a2b150c3655266_42dotsans-bold.ttf",
}
# Hangul Jamo, Compatibility Jamo, Jamo Ext-A, Hangul Syllables, Jamo Ext-B,
# half-width Hangul. Everything else in the font's cmap is kept.
HANGUL = [(0x1100, 0x11FF), (0x3130, 0x318F), (0xA960, 0xA97F), (0xAC00, 0xD7A3), (0xD7B0, 0xD7FF), (0xFFA0, 0xFFDC)]


def is_hangul(cp):
    return any(a <= cp <= z for a, z in HANGUL)


def main():
    os.makedirs(OUT, exist_ok=True)
    for weight, name in FACES.items():
        src = os.path.join(SRC, name)
        font = TTFont(src)
        keep = sorted(cp for cp in font.getBestCmap() if not is_hangul(cp))
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]          # keep the licence / copyright strings
        opts.notdef_outline = True
        opts.glyph_names = False
        opts.hinting = False
        opts.drop_tables += ["DSIG"]
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=keep)
        sub.subset(font)
        dst = os.path.join(OUT, f"42dotsans-{weight}-latin.woff2")
        subset.save_font(font, dst, opts)
        print(f"{dst}: {os.path.getsize(src)//1024} KB ttf -> {os.path.getsize(dst)//1024} KB woff2, {len(keep)} codepoints")


if __name__ == "__main__":
    sys.exit(main())

"""
真实截图 — the pixels behind the real-screen crops (tools/real-screens/*.json).

The owner, 2026-10-24: 「你现在也全是代码了，我系统的画面都没有了！我需要真实系统截图
放在特定的地方」. The places that drew the system in code show the system's own
screens again, cut from the owner's captures of 2026-10-21 (site-screens/raw,
3200x2000, and site-screens/mobile, 1170x2672; the same files as
/mnt/project-files/real-screens). Customer names, e-mails and amounts in them
were already replaced or blurred by the owner's masking pass (raw/manifest.csv,
mobile/NOTES.md); nothing here edits what a screen shows. A crop only chooses
which part of a screen a slot shows.

Each spec file is one group of slots (one page lane) and holds, per crop:

    {"id": "live10-sales-board-17x10",      # live<NN>- / m<NN>-: the capture's own number
     "src": "raw/10-sales-desk-board.png",  # under REAL_SRC; or "asset:<id>" for a published
                                            # product webp (the clean live05 cut, whose
                                            # original is not in site-screens)
     "crop": [x, y, w, h],                  # in the source's own pixels
     "max": 1600,                           # widest file written (never wider than the crop)
     "what": "...",                         # which part of the screen, for the record
     "alt": ["中文", "English"]}             # what it shows; the build adds the demo-data note

and this script writes assets/stargo-product/<id>.webp at min(max, crop width)
plus <id>-480/-768/-1024.webp below that, then records what it wrote back
into the same entry under "out" (sizes, bytes, the sha256 of the cut pixels).
tools/real-screens.mjs reads those entries as product-image registry rows.

    python3 tools/real-screens.py                      # every spec file
    python3 tools/real-screens.py tools/real-screens/home-theatre.json
    REAL_SRC=/path/to/site-screens python3 tools/real-screens.py

Pillow, Lanczos, WebP q82 method 6, the same encode as tools/blog-covers.py.
"""
import glob
import hashlib
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("REAL_SRC", "/mnt/project-files/real-screens")
OUT = os.path.join(ROOT, "assets", "stargo-product")
WIDTHS = [480, 768, 1024]
QUALITY = 82


def source(src):
    if src.startswith("asset:"):
        return Image.open(os.path.join(OUT, src[6:] + ".webp"))
    return Image.open(os.path.join(SRC, src))


def cut(shot):
    x, y, w, h = shot["crop"]
    im = source(shot["src"]).convert("RGB")
    if x < 0 or y < 0 or x + w > im.width or y + h > im.height:
        raise SystemExit(f"{shot['id']}: crop {shot['crop']} is outside {shot['src']} ({im.width}x{im.height})")
    part = im.crop((x, y, x + w, y + h))
    top = min(shot.get("max", 1600), w)
    files = []
    for width in [v for v in WIDTHS if v < top] + [top]:
        height = round(h * width / w)
        img = part if width == w else part.resize((width, height), Image.LANCZOS)
        name = f"{shot['id']}.webp" if width == top else f"{shot['id']}-{width}.webp"
        path = os.path.join(OUT, name)
        img.save(path, "WEBP", quality=QUALITY, method=6)
        files.append({"src": f"assets/stargo-product/{name}", "width": width, "height": height, "bytes": os.path.getsize(path)})
    main = files[-1]
    shot["out"] = {
        "width": main["width"],
        "height": main["height"],
        "bytes": main["bytes"],
        "sourcePixels": [w, h],
        "sha256": hashlib.sha256(part.tobytes()).hexdigest(),
        "variants": files[:-1],
    }
    return main


def run(path):
    spec = json.load(open(path, encoding="utf-8"))
    ids = [s["id"] for s in spec["shots"]]
    if len(set(ids)) != len(ids):
        raise SystemExit(f"{path}: an id is listed twice")
    for shot in spec["shots"]:
        main = cut(shot)
        print(f"{shot['id']}: {main['width']}x{main['height']} {main['bytes'] // 1024} KB")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=1)
        f.write("\n")


if __name__ == "__main__":
    for p in sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "tools", "real-screens", "*.json"))):
        run(p)

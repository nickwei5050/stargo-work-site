"""
The pixels behind tools/blog-covers.mjs.

sharp is not installed by this repository (native, ~30 MB, and only the
re-encode steps ever needed it), so the cover files are written with Pillow
instead. tools/blog-covers.mjs stays the description of what a cover is — one
entry per article, the source it is made from and how it is fitted — and hands
this script a JSON job with one entry per output file. Nothing here decides
anything: it resizes, pastes and encodes exactly what the job says.

    node tools/blog-covers.mjs            # the normal way in
    python tools/blog-covers.py job.json  # the same work, job written by hand

Job file:

    {"jobs": [{"target": "<absolute path>.webp",
               "source": "<absolute path>.webp",
               "mode": "focus" | "frame" | "contain" | "cover",
               "box": [0.295, 0.425, 0.6, 0.436],  # focus only: x, y, w, h as fractions of the source
               "canvas": [1200, 800],
               "pad": 0.03,            # frame / contain: margin, as a fraction of the canvas width
               "plate": "#e9eefb",     # frame / contain: the flat colour behind the fitted picture
               "radius": 0.012,        # frame only: corner radius, as a fraction of the canvas width
               "border": "#cfd8ec",    # frame only: 1px edge of the window
               "shadow": "#1d2b53",    # frame only: colour of the soft shadow under the window
               "quality": 82,
               "overlay": {"file": "<absolute path>.png",  # optional: a transparent PNG pasted on top
                           "pad": 14,              #   its transparent margin, in pixels
                           "corner": "top-right",  #   where it goes
                           "inset": 24}}]}        #   its visible edge from the two canvas edges, in pixels

The overlay is the 「演示数据 · Demo data」 chip tools/blog-covers.mjs draws
(review, round 2) on the share file only (<slug>-share.webp): a share preview
shows the bare file, without the site's HTML badge. The files the pages show
carry none (review, round 3), because the window bar's badge already says it.

"focus" is what every blog cover uses since the 2026-10-09 review: one region
of an OPEN WORK render (the reply draft with its approval bar, the PI, the
automation list …) cropped at the cover's own 2:1 and scaled down to it, so
the part of the interface the article is about fills the card instead of a
whole window shrunk to a thumbnail. The box's height is set from its width
and the canvas ratio, about the box's centre; a box narrower than the canvas
would have to be enlarged and is refused. The window frame and the 「演示数据」
badge are HTML around the picture (tools/ow-blocks/blog.mjs).

"frame" (before that): the whole OPEN WORK
render (tools/openwork/render.mjs, 1600x1100) is fitted inside the 3:2 cover
as a window with rounded corners, a 1px edge and a soft shadow, on one flat
plate colour that is the same for all seven covers. The render is never
cropped: the sidebar, the chat and the right-hand panel stay whole.

"contain" (the plain fit that preceded it) is for product screenshots. They are 16:9 pictures of an
interface, and the cover frame is 3:2, so a centre crop would cut the left
navigation off every one of them. The whole screenshot is fitted inside the
frame instead and the rest of the frame is one flat colour, sampled from the
screenshot's own border so the picture and the frame read as one plate.

"cover" is the crop the covers have always used (centre crop to 3:2, Lanczos,
WebP): the two covers that keep their generated editorial artwork are recorded
with it so that a deleted file can be rebuilt the way it was made.
"""
import json
import sys

from PIL import Image, ImageDraw, ImageFilter


def geometry(mode, canvas, source_size, pad, focus=None):
    """Where the source lands on the canvas. The one place the arithmetic lives."""
    cw, ch = canvas
    sw, sh = source_size
    if mode == "focus":
        fx, fy, fw, fh = focus
        w = fw * sw
        h = w * ch / cw
        cy = (fy + fh / 2) * sh
        left, top = fx * sw, cy - h / 2
        if w < cw:
            raise SystemExit(f"focus box {w:.0f}px wide is narrower than the {cw}px canvas: it would be enlarged")
        if left < 0 or top < 0 or left + w > sw + 0.5 or top + h > sh + 0.5:
            raise SystemExit(f"focus box {focus} leaves the {sw}x{sh} source")
        return ("crop", (round(left), round(top), round(left + w), round(top + h)))
    if mode in ("contain", "frame"):
        margin = round(cw * pad)
        iw, ih = cw - 2 * margin, ch - 2 * margin
        scale = min(iw / sw, ih / sh)
        dw, dh = max(1, round(sw * scale)), max(1, round(sh * scale))
        return ("paste", (round((cw - dw) / 2), round((ch - dh) / 2), dw, dh))
    if mode == "cover":
        scale = max(cw / sw, ch / sh)
        rw, rh = cw / scale, ch / scale
        left, top = (sw - rw) / 2, (sh - rh) / 2
        return ("crop", (round(left), round(top), round(left + rw), round(top + rh)))
    raise SystemExit(f"unknown fit mode: {mode}")


SS = 4   # supersampling of the rounded-corner masks


def rounded_mask(size, box, radius, inset=0):
    """Anti-aliased rounded rectangle `box` = (x, y, w, h) on a canvas of `size`, as an L mask."""
    x, y, w, h = box
    big = Image.new("L", (size[0] * SS, size[1] * SS), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        [(x + inset) * SS, (y + inset) * SS, (x + w - inset) * SS - 1, (y + h - inset) * SS - 1],
        radius=max(0, (radius - inset)) * SS, fill=255)
    return big.resize(size, Image.LANCZOS)


def hex_rgb(value):
    return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5))


def frame(job, im, canvas, box):
    """The picture as a window on the plate: soft shadow, 1px edge, rounded corners."""
    x, y, dw, dh = box
    cw, _ = canvas
    radius = max(2, round(cw * job.get("radius", 0.012)))
    out = Image.new("RGB", canvas, job["plate"])
    # shadow: the window's silhouette, pushed down, blurred, laid over the plate at low opacity
    blur = max(2, round(cw * 0.016))
    drop = max(2, round(cw * 0.011))
    sil = rounded_mask(canvas, (x, y + drop, dw, dh), radius)
    sil = sil.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: round(v * 0.30))
    out.paste(Image.new("RGB", canvas, hex_rgb(job["shadow"])), (0, 0), sil)
    # the 1px edge, then the picture one pixel inside it
    outer = rounded_mask(canvas, (x, y, dw, dh), radius)
    out.paste(Image.new("RGB", canvas, hex_rgb(job["border"])), (0, 0), outer)
    inner_box = (x, y, dw, dh)
    inner = rounded_mask(canvas, inner_box, radius, inset=1)
    layer = Image.new("RGB", canvas, job["plate"])
    layer.paste(im.resize((dw, dh), Image.LANCZOS), (x, y))
    out.paste(layer, (0, 0), inner)
    return out


def overlay(out, spec):
    """Paste the transparent PNG `spec["file"]` so that its visible part sits `inset` pixels from the corner's two edges."""
    with Image.open(spec["file"]) as chip:
        chip = chip.convert("RGBA")
        pad, inset = spec["pad"], spec["inset"]
        if spec["corner"] != "top-right":
            raise SystemExit(f"unknown overlay corner: {spec['corner']}")
        x = out.width - inset - (chip.width - pad)
        y = inset - pad
        out.paste(chip, (x, y), chip)


def render(job):
    canvas = tuple(job["canvas"])
    with Image.open(job["source"]) as im:
        im = im.convert("RGB")
        kind, box = geometry(job["mode"], canvas, im.size, job.get("pad", 0), job.get("box"))
        if kind == "crop":
            out = im.crop(box).resize(canvas, Image.LANCZOS)
        elif job["mode"] == "frame":
            out = frame(job, im, canvas, box)
        else:
            x, y, dw, dh = box
            out = Image.new("RGB", canvas, job["plate"])
            out.paste(im.resize((dw, dh), Image.LANCZOS), (x, y))
    if job.get("overlay"):
        overlay(out, job["overlay"])
    out.save(job["target"], "WEBP", quality=job.get("quality", 82), method=6)
    return f"{job['target']} {canvas[0]}x{canvas[1]} {job['mode']} {box}"


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: python tools/blog-covers.py <job.json>")
    with open(sys.argv[1], encoding="utf-8") as fh:
        job_file = json.load(fh)
    for job in job_file["jobs"]:
        print(render(job))


if __name__ == "__main__":
    main()

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
               "mode": "contain" | "cover",
               "canvas": [1200, 800],
               "pad": 0.02,            # contain only: margin, as a fraction of the canvas width
               "plate": "#001135",     # contain only: the flat colour behind the fitted picture
               "quality": 82}]}

"contain" is for the owner's product screenshots. They are 16:9 pictures of an
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

from PIL import Image


def geometry(mode, canvas, source_size, pad):
    """Where the source lands on the canvas. The one place the arithmetic lives."""
    cw, ch = canvas
    sw, sh = source_size
    if mode == "contain":
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


def render(job):
    canvas = tuple(job["canvas"])
    with Image.open(job["source"]) as im:
        im = im.convert("RGB")
        kind, box = geometry(job["mode"], canvas, im.size, job.get("pad", 0))
        if kind == "crop":
            out = im.crop(box).resize(canvas, Image.LANCZOS)
        else:
            x, y, dw, dh = box
            out = Image.new("RGB", canvas, job["plate"])
            out.paste(im.resize((dw, dh), Image.LANCZOS), (x, y))
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

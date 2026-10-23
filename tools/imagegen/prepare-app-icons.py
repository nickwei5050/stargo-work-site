"""
The app icons of the capability page's app band (tools/app-suite.mjs, #apps).

The source is the owner's mobile-app repository, stargo-work-app, at commit
d46c4fc: wechat-miniprogram/assets/icons/*.png, 22 RGBA PNGs of 512 x 512.
They are the app tiles of the STARGO WORK desktop: 21 navy tiles with a white
outline glyph and a short bar in the colour of the app's category, and the
voice assistant's own bright-blue waveform tile, which is the icon the real
desktop shows for 语音助手.app (assets/stargo-product/live01-desktop-home-16x9)
and is kept exactly as it is.

This only crops each tile to its own edge (the PNGs carry 9-13 px of
transparent margin, the blue tile a little more than the navy ones, so after
the crop all 22 tiles fill the same square), resizes it to 128 x 128 with
Lanczos and writes WebP at quality 85. No retouching, no recolouring.

The upstream file names name the open-source projects the apps were built on.
Those names are not shown on the site (they are credited on notices.html where
the project uses them), so each file is written under the STARGO slug of the
app as the product desktop names it. The map below is the only place the two
meet; it lives in tools/, which is not published.

/assets is served immutable for a year, so a changed icon needs a new name.
A file already there is left alone when the new encode has the same bytes;
when the bytes differ the script stops before writing anything.

    python3 tools/imagegen/prepare-app-icons.py [<icons folder>]

The folder defaults to the sibling checkout
../stargo-work-app/wechat-miniprogram/assets/icons.
"""
import io
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(SITE, 'assets', 'stargo-apps')
SIZE = 128
QUALITY = 85

# upstream file stem -> STARGO slug (tools/app-suite.mjs APPS[].slug)
SLUGS = {
    'dsh': 'brain',
    'weknora': 'knowledge',
    'qwen-audio': 'voice',
    'notion': 'notes',
    'chromium': 'browser',
    'computer': 'ai-browser',
    'erpnext': 'enterprise',
    'chatwoot': 'conversations',
    'staffdeck': 'ai-staff',
    'searxng': 'search',
    'openoutreach': 'outreach',
    'yente': 'due-diligence',
    'openmuse': 'cockpit',
    'infinite-canvas': 'canvas',
    'opencut': 'video-editor',
    'openmontage': 'reference-video',
    'hypit': 'video-studio',
    'cad': 'cad',
    'activepieces': 'workflows',
    'windmill': 'scripts',
    'openconnector': 'connections',
    'new-api': 'model-gateway',
}


def encode(path):
    im = Image.open(path).convert('RGBA')
    box = im.getchannel('A').getbbox()
    im = im.crop(box).resize((SIZE, SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=QUALITY, method=6)
    return buf.getvalue()


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SITE, '..', 'stargo-work-app', 'wechat-miniprogram', 'assets', 'icons')
    found = sorted(f[:-4] for f in os.listdir(src) if f.endswith('.png'))
    if sorted(SLUGS) != found:
        sys.exit('app icons: the source folder does not hold the 22 expected icons (%s)' % ', '.join(sorted(set(found) ^ set(SLUGS))))
    jobs = []
    for stem, slug in SLUGS.items():
        data = encode(os.path.join(src, stem + '.png'))
        target = os.path.join(OUT, '%s-%d.webp' % (slug, SIZE))
        if os.path.exists(target):
            with open(target, 'rb') as fh:
                if fh.read() != data:
                    sys.exit('app icons: %s exists with other bytes; a changed icon needs a new file name' % target)
            continue
        jobs.append((target, data))
    os.makedirs(OUT, exist_ok=True)
    for target, data in jobs:
        with open(target, 'wb') as fh:
            fh.write(data)
    total = sum(os.path.getsize(os.path.join(OUT, '%s-%d.webp' % (s, SIZE))) for s in SLUGS.values())
    print('app icons: %d written, %d unchanged, %.1f KB in all' % (len(jobs), len(SLUGS) - len(jobs), total / 1024))


if __name__ == '__main__':
    main()

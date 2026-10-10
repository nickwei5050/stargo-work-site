/**
 * Render the OPEN WORK demo video (zh + en).
 *
 *   STARGO_TOOL_PACKAGE=/path/to/toolpkg/package.json node tools/openwork/video.mjs [--lang zh,en] [--still 3,9.5] [--check] [--keep-frames]
 *
 * 1. Writes the animation page of tools/openwork/video-page.mjs (one per
 *    language) and its CSS — the stills' OPEN WORK CSS from scenes.mjs plus
 *    the video's own — into .wrangler/openwork/video/ (git-ignored).
 * 2. Opens it in Chromium at 1440×900 CSS px, deviceScaleFactor 1, waits for
 *    the fonts, checks the layout at every beat (fails instead of rendering
 *    clipped, wrapped or overlapping text), then seeks the page's clock frame
 *    by frame (`__seek(t)`, 30 fps) and screenshots every frame as PNG.
 *    Nothing in the page moves on its own, so the frames are the same on
 *    every run (the script prints a SHA-256 over all frames to compare).
 * 3. Encodes with ffmpeg and copies the streams, without the encoder's
 *    banner and tags (CLEAN below), into assets/stargo-product/:
 *      ow-demo-<lang>.mp4         H.264 High, yuv420p BT.709, +faststart, no audio
 *      ow-demo-<lang>.webm        VP9 (two-pass, constant quality), no audio
 *      ow-demo-<lang>-poster.webp the frame at POSTER_T (sharp)
 *    and records them in tools/openwork/video.json.
 *
 * --still 3,9.5   only write PNG stills of those seconds (no video), to look at;
 *                 layout problems are printed instead of stopping the script
 * --check         only run the layout checks
 * --keep-frames   keep the PNG frames in .wrangler/openwork/video/<lang>/
 *
 * Modules: sharp, @fontsource/noto-sans-sc, @fontsource-variable/inter and
 * lucide-static through tools/paths.mjs `req` (STARGO_TOOL_PACKAGE), as for
 * render.mjs; Chromium is this repository's @playwright/test
 * (PLAYWRIGHT_BROWSERS_PATH, or OPENWORK_CHROMIUM=/path/to/chrome); ffmpeg
 * from PATH (FFMPEG=/path/to/ffmpeg overrides).
 *
 * Everything in the video is demonstration data. See README.md.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { SITE, req } from '../paths.mjs';
import { css } from './scenes.mjs';
import { videoCss, videoPage, LANGS, W, H, FPS, DURATION, POSTER_T, START_T, T } from './video-page.mjs';
import { phoneCss, videoPagePhone, MW, MH, MDSF, POSTER_TM, TM } from './video-phone.mjs';

const own = createRequire(import.meta.url);
const { chromium } = (() => { try { return own('@playwright/test'); } catch { return req('@playwright/test'); } })();
const sharp = req('sharp');
const pkg = (p) => req.resolve(p);
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FFPROBE = process.env.FFPROBE || FFMPEG.replace(/ffmpeg(\.exe)?$/, 'ffprobe$1');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); const eq = args.find((a) => a.startsWith(`${name}=`)); return eq ? eq.slice(name.length + 1) : i >= 0 ? args[i + 1] : undefined; };
const langs = (opt('--lang') ?? LANGS.join(',')).split(',').filter(Boolean);
for (const l of langs) if (!LANGS.includes(l)) throw new Error(`--lang: unknown language ${l} (have ${LANGS.join(', ')})`);
const stills = opt('--still')?.split(',').map(Number);
/* desktop: the 1440×900 film; phone: the 360×600 one-column cut (video-phone.mjs), 720×1200 */
const CUTS = { desktop: { suffix: '', w: W, h: H, dsf: 1, poster: POSTER_T, timeline: T }, phone: { suffix: '-phone', w: MW, h: MH, dsf: MDSF, poster: POSTER_TM, timeline: TM } };
const cuts = (opt('--cut') ?? Object.keys(CUTS).join(',')).split(',').filter(Boolean);
for (const c of cuts) if (!CUTS[c]) throw new Error(`--cut: unknown cut ${c} (have ${Object.keys(CUTS).join(', ')})`);
const checkOnly = args.includes('--check');
const keepFrames = args.includes('--keep-frames');

/* Encoder settings. The UI is mostly still, flat colour and text: x264's
   animation tuning and VP9 constant quality keep the text edges clean at a
   small size. Fixed thread counts keep the encodes repeatable. */
const MP4_CRF = Number(process.env.OW_VIDEO_CRF_MP4 ?? 24);
const WEBM_CRF = Number(process.env.OW_VIDEO_CRF_WEBM ?? 33);

const WORK = `${SITE}/.wrangler/openwork/video`;
const OUT = 'assets/stargo-product';
mkdirSync(WORK, { recursive: true });

/* ---- the page --------------------------------------------------------------- */
const icon = (name, cls = '') => readFileSync(pkg(`lucide-static/icons/${name}.svg`), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace('<svg', `<svg class="i ${cls}"`)
  .replace(/width="24"/, '').replace(/height="24"/, '')
  .replace(/stroke-width="2"/, 'stroke-width="1.9"');
const fonts = {
  interCss: pkg('@fontsource-variable/inter/index.css'),
  notoDir: pkg('@fontsource/noto-sans-sc/index.css').replace(/index\.css$/, ''),
};
const asset = (p) => pathToFileURL(`${SITE}/${p}`).href;
writeFileSync(`${WORK}/video.css`, css(fonts) + videoCss());
writeFileSync(`${WORK}/video-phone.css`, css(fonts) + videoCss() + phoneCss());
for (const lang of LANGS) {
  writeFileSync(`${WORK}/video-${lang}.html`, videoPage(lang, { icon, asset, cssHref: 'video.css' }));
  writeFileSync(`${WORK}/video-${lang}-phone.html`, videoPagePhone(lang, { icon, asset, cssHref: 'video-phone.css' }));
}

/* ---- helpers ---------------------------------------------------------------- */
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
function run(cmd, argv) {
  const r = spawnSync(cmd, argv, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(' ')}\n${r.stderr.toString().slice(-3000)}`);
  return r.stdout.toString();
}
/* RGB PNG → BT.709 limited-range 4:2:0, the colour every browser assumes for HD video. */
const VF = 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p';
const TAGS = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];
const EXACT = ['-map_metadata', '-1', '-fflags', '+bitexact', '-flags:v', '+bitexact', '-an'];
/* The served files name no encoder (owner, 2026-10-10: nothing about open-source
   software on the site; review, round 2): each film is encoded into WORK and
   then copied, stream untouched, into assets/ without the encoder's banner —
   x264 writes its name, version, licence and web address into an SEI NAL unit
   (type 6, dropped by filter_units; the stream needs no other SEI), and ffmpeg
   tags each encoded stream "Lavc <encoder>" (a stream copy carries no such
   tag). What is left is the container's mandatory muxer field, a bare "Lavf"
   in the WebM. make-dist checks the shipped films for these names. */
const CLEAN = ['-map', '0:v:0', '-c', 'copy', '-map_metadata', '-1', '-map_chapters', '-1', '-fflags', '+bitexact', '-an'];
const STRIP_SEI = ['-bsf:v', 'filter_units=remove_types=6'];
/** Times at which every beat is fully on screen: checked before rendering. */
const CHECK_AT = {
  desktop: [0, 1.6, 3.6, 4.6, 7.4, 8.6, 10.6, 10.95, 11.4, 12.4, 14.4, DURATION - 0.01],
  phone: [0, 1.6, 3.6, 4.6, 6.6, 7.0, 8.6, 9.6, 10.95, 11.6, 12.4, 14.4, DURATION - 0.01],
};

/* Software raster on one thread, no partial raster: without these flags a few
   anti-aliased edge pixels (rounded corners, shadows) differ from run to run. */
const browser = await chromium.launch({
  ...(process.env.OPENWORK_CHROMIUM ? { executablePath: process.env.OPENWORK_CHROMIUM } : {}),
  args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb',
    '--disable-gpu', '--num-raster-threads=1', '--disable-skia-runtime-opts', '--disable-partial-raster', '--run-all-compositor-stages-before-draw'],
});

async function openPage(lang, cut) {
  const C = CUTS[cut];
  const page = await browser.newPage({ viewport: { width: C.w, height: C.h }, deviceScaleFactor: C.dsf });
  await page.goto(`file://${WORK}/video-${lang}${C.suffix}.html`);
  /* Lay everything out (fonts are requested per unicode range as text needs them), then wait for them. */
  await page.evaluate(async () => {
    document.body.getBoundingClientRect();
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
  });
  await page.waitForTimeout(200);
  const status = await page.evaluate(() => document.fonts.status);
  if (status !== 'loaded') throw new Error(`${lang}: fonts still ${status}`);
  await page.evaluate(() => window.__init());
  /* Visit every beat once so nothing is requested for the first time mid-capture. */
  for (let t = 0; t < DURATION; t += 0.5) await page.evaluate((x) => window.__seek(x), t);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function checkLayout(page, lang, cut) {
  const problems = [];
  for (const t of CHECK_AT[cut]) {
    const p = await page.evaluate((x) => window.__check(x), t);
    problems.push(...p.map((m) => `${lang} ${cut} @${t}s: ${m}`));
  }
  if (!problems.length) return;
  const msg = `layout problems:\n  ${problems.join('\n  ')}`;
  if (stills) console.warn(msg); else throw new Error(msg);
}

const shot = async (page, t) => { await page.evaluate((x) => window.__seek(x), t); return page.screenshot({ type: 'png' }); };

/* ---- render ----------------------------------------------------------------- */
const manifestFile = `${SITE}/tools/openwork/video.json`;
const manifest = (() => { try { return JSON.parse(readFileSync(manifestFile, 'utf8')); } catch { return {}; } })();
const nFrames = Math.round(DURATION * FPS);

for (const lang of langs) for (const cut of cuts) {
  const C = CUTS[cut];
  const key = `${lang}${C.suffix}`;
  const page = await openPage(lang, cut);
  await checkLayout(page, lang, cut);
  if (checkOnly) { console.log(`${key}: layout ok at ${CHECK_AT[cut].join(', ')} s`); await page.close(); continue; }
  if (stills) {
    for (const t of stills) {
      const f = `${WORK}/still-${key}-${String(t).replace('.', '_')}.png`;
      writeFileSync(f, await shot(page, t));
      console.log(f);
    }
    await page.close();
    continue;
  }

  const dir = `${WORK}/${key}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const all = createHash('sha256');
  const started = Date.now();
  for (let i = 0; i < nFrames; i++) {
    const png = await shot(page, i / FPS);
    all.update(png);
    writeFileSync(`${dir}/f${String(i).padStart(5, '0')}.png`, png);
    if (i % 60 === 0) process.stdout.write(`${key}: frame ${i}/${nFrames}\r`);
  }
  await page.close();
  const framesSha = all.digest('hex');
  console.log(`${key}: ${nFrames} frames in ${((Date.now() - started) / 1000).toFixed(0)} s, frames sha256 ${framesSha}`);

  const input = ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/f%05d.png`, '-vf', VF];
  const mp4 = `${OUT}/ow-demo-${key}.mp4`;
  const encMp4 = `${WORK}/enc-${key}.mp4`, encWebm = `${WORK}/enc-${key}.webm`;
  run(FFMPEG, [...input, '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-crf', String(MP4_CRF),
    '-profile:v', 'high', '-level:v', '4.0', '-g', String(FPS * 4), '-threads', '4', ...TAGS, ...EXACT, encMp4]);
  run(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', encMp4, ...CLEAN, ...STRIP_SEI, '-movflags', '+faststart', `${SITE}/${mp4}`]);
  const webm = `${OUT}/ow-demo-${key}.webm`;
  const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(WEBM_CRF), '-g', String(FPS * 4), '-row-mt', '1', '-tile-columns', '1', '-threads', '4', '-deadline', 'good'];
  const log = `${WORK}/vp9-${key}`;
  run(FFMPEG, [...input, ...vp9, '-cpu-used', '4', '-pass', '1', '-passlogfile', log, '-an', '-f', 'null', '/dev/null']);
  run(FFMPEG, [...input, ...vp9, '-cpu-used', '1', '-auto-alt-ref', '1', '-lag-in-frames', '25', '-pass', '2', '-passlogfile', log, ...TAGS, ...EXACT, encWebm]);
  run(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-i', encWebm, ...CLEAN, `${SITE}/${webm}`]);
  rmSync(encMp4, { force: true }); rmSync(encWebm, { force: true });
  const posterFrame = Math.round(C.poster * FPS);
  const poster = `${OUT}/ow-demo-${key}-poster.webp`;
  const posterBuf = await sharp(readFileSync(`${dir}/f${String(posterFrame).padStart(5, '0')}.png`)).webp({ quality: 84, effort: 6, smartSubsample: true }).toBuffer();
  writeFileSync(`${SITE}/${poster}`, posterBuf);
  if (!keepFrames) rmSync(dir, { recursive: true, force: true });

  const probe = (f) => JSON.parse(run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration,size,bit_rate:stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,nb_frames,color_space', '-of', 'json', `${SITE}/${f}`]));
  const entry = (f) => {
    const p = probe(f), s = p.streams[0];
    return { src: f, bytes: statSync(`${SITE}/${f}`).size, sha256: sha(readFileSync(`${SITE}/${f}`)), codec: s.codec_name, profile: s.profile, width: s.width, height: s.height, pix_fmt: s.pix_fmt, fps: s.r_frame_rate, duration: Math.round(Number(p.format.duration) * 1000) / 1000 };
  };
  const pw = C.w * C.dsf, ph = C.h * C.dsf;
  manifest[key] = {
    cut, frames: nFrames, fps: FPS, width: pw, height: ph, cssWidth: C.w, cssHeight: C.h, deviceScaleFactor: C.dsf, duration: DURATION, start: START_T, framesSha256: framesSha,
    poster: { src: poster, time: C.poster, width: pw, height: ph, bytes: posterBuf.length },
    mp4: entry(mp4), webm: entry(webm),
    encode: { mp4: `libx264 veryslow tune=animation crf=${MP4_CRF}`, webm: `libvpx-vp9 2-pass crf=${WEBM_CRF}` },
  };
  for (const k of ['mp4', 'webm']) console.log(`${key}: ${manifest[key][k].src} ${(manifest[key][k].bytes / 1024).toFixed(0)} KB ${manifest[key][k].codec} ${manifest[key][k].width}×${manifest[key][k].height} ${manifest[key][k].duration}s`);
  console.log(`${key}: ${poster} ${(posterBuf.length / 1024).toFixed(0)} KB (t=${C.poster}s)`);
}
await browser.close();

if (!checkOnly && !stills) {
  const out = { note: 'Generated by tools/openwork/video.mjs. Demonstration data only. Timelines: tools/openwork/video-page.mjs (T, desktop) and video-phone.mjs (TM, phone).', timeline: T, timelinePhone: TM, start: START_T };
  for (const l of LANGS) for (const c of Object.values(CUTS)) if (manifest[`${l}${c.suffix}`]) out[`${l}${c.suffix}`] = manifest[`${l}${c.suffix}`];
  writeFileSync(manifestFile, JSON.stringify(out, null, 2) + '\n');
}

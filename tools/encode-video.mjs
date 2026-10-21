/**
 * Write a smaller H.264 copy of every template clip the pages play.
 *
 *   node tools/encode-video.mjs        # needs ffmpeg/ffprobe with libx264 and libvpx-vp9
 *
 * Run it after adding or replacing a clip, then rebuild: tools/chrome.mjs
 * swaps each `<source>` for its copy through tools/data/video-h264.json.
 *
 * The donor exports ship every clip twice: a VP8 webm at 2–8 Mbps and an
 * H.264 mp4 made from it. Chrome, Edge, Safari and Firefox all take the mp4
 * (it is listed first), so the mp4 is what a visitor downloads. Each copy is
 * encoded from the webm, the better of the two, at the highest CRF on the
 * ladder whose mean SSIM against the webm is at least the current mp4's — so a
 * copy is never visibly worse than what the page plays today — and kept only
 * when it saves at least 15%. Same pixel size, same length, no audio (every
 * clip plays muted). New file names, because /assets/* is cached as immutable
 * for a year.
 *
 * The logo orb is the exception. The same 720×720 clip fills the header and
 * footer logos, the chat and pricing cards and a heading on every page, where
 * it is drawn 30–60 CSS px wide (264 device px at most). Those places get a
 * 360 px copy; the side-menu card, which shows the orb 378 px wide, keeps the
 * full clip.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { SITE } from './paths.mjs';

const LADDER = [26, 24, 22, 20];
export const ORB = 'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4f47_magical_orb_remix_mp4.mp4';
const ORB_SMALL = { mp4: 'assets/stargo-motion/orb-360.mp4', webm: 'assets/stargo-motion/orb-360.webm' };

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const pages = [...readdirSync(SITE).filter((f) => f.endsWith('.html')).map((f) => `${SITE}/${f}`), ...['en', 'blog'].flatMap((d) => walk(`${SITE}/${d}`)).filter((f) => f.endsWith('.html'))];
const clips = new Set();
for (const f of pages) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\s(?:data-)?src="((?:\.\.\/)*)(assets\/[^"]+?\.mp4)"/g)) clips.add(decodeURIComponent(m[2]));
}

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
/** Mean SSIM of `cand` against `ref`, both resampled to 29.97 fps from t=0 at the reference's size. */
function ssim(ref, cand) {
  const size = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', ref]).toString().trim();
  const lavfi = `[0:v]setpts=PTS-STARTPTS,fps=30000/1001,format=yuv420p[r];[1:v]setpts=PTS-STARTPTS,fps=30000/1001,scale=${size}:flags=bicubic,format=yuv420p[c];[c][r]ssim`;
  const log = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', ref, '-i', cand, '-lavfi', lavfi, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr;
  const m = log.match(/SSIM .*All:([0-9.]+)/);
  if (!m) throw new Error(`no SSIM for ${cand}`);
  return Number(m[1]);
}
const h264 = (src, out, crf, scale) => ff(['-i', src, '-an', ...(scale ? ['-vf', `scale=${scale}:flags=lanczos`] : []), '-c:v', 'libx264', '-preset', 'slower', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', String(crf), '-movflags', '+faststart', out]);

const result = {};
let before = 0, after = 0;
for (const rel of [...clips].sort()) {
  const mp4 = `${SITE}/${rel}`;
  const webm = [mp4.replace(/_mp4\.mp4$/, '_webm.webm'), mp4.replace(/\.mp4$/, '.webm')].find((w) => w !== mp4 && existsSync(w));
  if (!webm || !existsSync(mp4)) { console.log(`skip ${rel} (no webm master)`); continue; }
  const size = statSync(mp4).size;
  const today = ssim(webm, mp4);
  let pick = null;
  for (const crf of LADDER) {
    const out = rel.replace(/\.mp4$/, `.c${crf}.mp4`);
    if (!existsSync(`${SITE}/${out}`)) h264(webm, `${SITE}/${out}`, crf);
    const bytes = statSync(`${SITE}/${out}`).size, score = ssim(webm, `${SITE}/${out}`);
    const ok = score >= today && bytes <= size * 0.85;
    console.log(`  ${rel.split('/').pop()}  crf ${crf}: ${Math.round(bytes / 1024)} KB, SSIM ${score.toFixed(5)} (today ${Math.round(size / 1024)} KB, ${today.toFixed(5)})${ok ? '  <- kept' : ''}`);
    if (ok) { pick = { out, bytes }; break; }
    if (bytes > size * 0.85) break; // lower CRFs only get bigger
  }
  for (const crf of LADDER) {
    const out = rel.replace(/\.mp4$/, `.c${crf}.mp4`);
    if (out !== pick?.out && existsSync(`${SITE}/${out}`)) execFileSync('rm', ['-f', `${SITE}/${out}`]);
  }
  if (!pick) continue;
  result[rel] = pick.out;
  before += size; after += pick.bytes;
}

/* The orb at logo size: 360 px H.264, plus a VP9 webm for browsers without H.264. */
{
  const webm = `${SITE}/${ORB.replace(/_mp4\.mp4$/, '_webm.webm')}`;
  if (!existsSync(`${SITE}/${ORB_SMALL.mp4}`)) h264(webm, `${SITE}/${ORB_SMALL.mp4}`, 20, '360:360');
  if (!existsSync(`${SITE}/${ORB_SMALL.webm}`)) ff(['-i', webm, '-an', '-vf', 'scale=360:360:flags=lanczos', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `${SITE}/${ORB_SMALL.webm}`]);
  console.log(`orb 360: mp4 ${Math.round(statSync(`${SITE}/${ORB_SMALL.mp4}`).size / 1024)} KB, webm ${Math.round(statSync(`${SITE}/${ORB_SMALL.webm}`).size / 1024)} KB`);
}

writeFileSync(`${SITE}/tools/data/video-h264.json`, JSON.stringify({
  note: 'Written by tools/encode-video.mjs: each template clip the pages play, and the smaller H.264 copy it is served as; orbSmall is the 360 px logo orb.',
  clips: result,
  orb: ORB,
  orbSmall: ORB_SMALL,
}, null, 2) + '\n');
console.log(`${Object.keys(result).length} of ${clips.size} clips: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);

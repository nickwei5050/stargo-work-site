/**
 * The OPEN WORK demo video (round 2, 2026-10-10): one inquiry, from arrival
 * to 「已批准 · 已发送」, 16 s, silent, looping, with the 「演示数据」 badge in
 * every frame. Rendered from our own OPEN WORK page by tools/openwork/video.mjs
 * (README there); per language a desktop film (1440×900) and a phone cut
 * (720×1200, one column: video-phone.mjs) in assets/stargo-product/. On the
 * homepage right under the hero, and on the product page under its jump links
 * (tools/ow-blocks/index.mjs, pages.mjs renderProduct).
 *
 *   <picture class="ow-demo-poster">  the still: the phone cut on a phone held
 *                                     upright (DEMO_PHONE_MEDIA), else desktop
 *   <video data-ow-demo muted playsinline loop preload="none" controls data-start>
 *     desktop MP4 + WebM, then the phone cut's MP4 + WebM (media=DEMO_PHONE_MEDIA);
 *     MP4 (H.264, hardware-decoded everywhere) before WebM (VP9)
 *
 * Why a phone cut: the desktop film shown 362px wide puts its 13–15px
 * interface text at about 3.5 CSS px; the phone cut keeps every text at 12
 * CSS px or more on a 360px phone (review, round 2).
 *
 * Who picks the cut: the script, not the browser (review, round 2). `media` on
 * a <video>'s <source> is honoured by Chrome and Firefox only since version
 * 120 (late 2023); an older engine — Chrome 109 on Windows 7/8, browsers on
 * an older Chromium core, some in-app browsers — skips it and plays the first
 * source. js/stargo-ow.js therefore keeps both pairs of sources, puts only the
 * pair of the still's cut in the video (the <picture>'s own `media` works in
 * every browser), and swaps them when the screen crosses the line. The
 * desktop pair comes first, so a browser that ignores `media` and runs no
 * script plays the desktop film — with its own controls, never by itself.
 *
 * The line is DEMO_PHONE_MEDIA: at most 640px wide and no wider than 4:3. A
 * phone turned sideways (568×320, 640×360) gets the 16:10 desktop film, which
 * fits its screen; the 3:5 cut would be 763px tall there and never half on
 * screen. An aspect ratio rather than `orientation`: an older Android browser
 * that shrinks the page while the keyboard is open (360×640 → 360×330) reads
 * as landscape, and would swap the film and its box above the form someone is
 * typing in.
 *
 * The still is a <picture> under the video rather than its poster attribute,
 * so each screen fetches only its own still (a poster attribute cannot change
 * with the screen width): until the film has a frame the video draws nothing
 * and the still shows through. No `autoplay` attribute and preload="none": the
 * first load fetches the still only; the film is requested when it is on
 * screen. js/stargo-ow.js takes the browser's controls away, plays it while at
 * least half of it is visible, or it fills at least half the screen (from
 * data-start the first time, so it opens on
 * the inquiry being read rather than a near-empty window), pauses it when it
 * leaves, and never starts it by itself under prefers-reduced-motion or with
 * the browser's data saver on; the button under the film plays and pauses it.
 * Without the script the browser's own controls stay and nothing plays by
 * itself. width/height and the CSS aspect-ratio (16:10, or 3:5 for the phone
 * cut) hold its box before anything arrives, so nothing below it moves.
 *
 * The film is a whole scene — the OPEN WORK window with its step rail — so it
 * is not put in a second window: it sits in a frosted glass bezel with the
 * site's soft blue shadow (css/stargo-ow.css .ow-demo), and nothing is drawn
 * over it. The caption and the button are under it.
 *
 * File URLs carry ?v=<sha256 of the file>: /assets/* is served immutable for a
 * year (tools/make-dist.mjs _headers), so a re-rendered film must get a new
 * URL. Since review round 3 every asset URL is versioned the same way
 * (tools/asset-version.mjs). tools/build-site.mjs allows exactly this markup and no other video.
 */
import { assetHash } from '../asset-version.mjs';
import { esc, heading } from './shared.mjs';
import { START_T } from '../openwork/video-page.mjs';

/** The six files per language (tools/openwork/video.json lists their codecs). */
export const DEMO_FILES = (lang) => ({
  mp4: `assets/stargo-product/ow-demo-${lang}.mp4`,
  webm: `assets/stargo-product/ow-demo-${lang}.webm`,
  poster: `assets/stargo-product/ow-demo-${lang}-poster.webp`,
  mp4Phone: `assets/stargo-product/ow-demo-${lang}-phone.mp4`,
  webmPhone: `assets/stargo-product/ow-demo-${lang}-phone.webm`,
  posterPhone: `assets/stargo-product/ow-demo-${lang}-phone-poster.webp`,
});
/* video.json: H.264 High@L4.0 and VP9 profile 0 (both cuts) */
export const DEMO_TYPES = { mp4: 'video/mp4; codecs=avc1.640028', webm: 'video/webm; codecs=vp9' };
export const DEMO_SIZE = { width: 1440, height: 900 };
export const DEMO_SIZE_PHONE = { width: 720, height: 1200 };
/** Where the phone cut is played (and its still shown); css/stargo-ow.css uses the same query. */
export const DEMO_PHONE_MEDIA = '(max-width: 640px) and (max-aspect-ratio: 4/3)';
export const DEMO_START = START_T;

/** `path?v=<first 12 hex of its SHA-256>` (tools/asset-version.mjs, which versions every other asset URL the same way) */
function versioned(path) {
  const v = assetHash(path);
  if (!v) throw new Error(`demo video: ${path} is missing (node tools/openwork/video.mjs)`);
  return `${path}?v=${v}`;
}

/* play / pause glyphs, drawn filled (they sit on the blue disc of the button) */
const glyph = (d, cls) => `<svg class="ow-ico ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">${d}</svg>`;
const PLAY = glyph('<path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6z"/>', 'ow-demo-play');
const PAUSE = glyph('<rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/>', 'ow-demo-pause');

export function render({ lang, t, C }) {
  const O = C.HOME_OW;
  const V = O.demoVideo;
  const f = DEMO_FILES(lang);
  const M = DEMO_PHONE_MEDIA;
  const still = `<picture class="ow-demo-poster" aria-hidden="true">`
    + `<source media="${M}" srcset="${versioned(f.posterPhone)}" width="${DEMO_SIZE_PHONE.width}" height="${DEMO_SIZE_PHONE.height}" type="image/webp"/>`
    + `<img src="${versioned(f.poster)}" width="${DEMO_SIZE.width}" height="${DEMO_SIZE.height}" alt="${esc(t(V.posterAlt))}" decoding="async"/></picture>`;
  const video = `<video data-ow-demo class="ow-demo-video" muted playsinline loop preload="none" controls width="${DEMO_SIZE.width}" height="${DEMO_SIZE.height}"`
    + ` data-start="${DEMO_START}" aria-label="${esc(t(V.label))}">`
    + `<source src="${versioned(f.mp4)}" type="${DEMO_TYPES.mp4}"/>`
    + `<source src="${versioned(f.webm)}" type="${DEMO_TYPES.webm}"/>`
    + `<source media="${M}" src="${versioned(f.mp4Phone)}" type="${DEMO_TYPES.mp4}"/>`
    + `<source media="${M}" src="${versioned(f.webmPhone)}" type="${DEMO_TYPES.webm}"/>`
    + `${esc(t(V.fallback))}</video>`;
  /* hidden until js/stargo-ow.js runs (then the browser's controls go) */
  const toggle = `<button type="button" class="ow-demo-toggle" data-ow-demo-toggle hidden aria-label="${esc(t(V.playLabel))}"`
    + ` data-label-play="${esc(t(V.playLabel))}" data-label-pause="${esc(t(V.pauseLabel))}" data-text-play="${esc(t(V.play))}" data-text-pause="${esc(t(V.pause))}">`
    + `<span class="ow-demo-toggle-ico">${PLAY}${PAUSE}</span><span data-ow-demo-label>${esc(t(V.play))}</span></button>`;
  return `<section class="ow-sec ow-demo" aria-labelledby="ow-demo-title"><div class="ow-wrap">`
    + `<header class="ow-sec-head ow-sec-head--center"><p class="ow-eyebrow">${esc(t(V.eyebrow))}</p><h2 id="ow-demo-title" class="ow-h2">${V.title.map((x) => `<span>${heading(lang, t(x))}</span>`).join(lang === 'zh' ? '' : ' ')}</h2></header>`
    /* data-ow-avoid: the demo bar steps aside while it would cover the film, its caption or its button */
    + `<figure class="ow-demo-fig" data-ow-demo-wrap data-ow-avoid>`
    + `<div class="ow-demo-stage"><div class="ow-demo-screen">${still}${video}</div></div>`
    + toggle
    + `<figcaption class="ow-demo-cap"><span class="ow-badge">${esc(t(O.badge))}</span><span>${esc(t(V.caption))}</span></figcaption>`
    + `</figure></div></section>`;
}

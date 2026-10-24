/**
 * 品牌片 — the about page's first screen.
 *
 * The owner, 2026-10-24 13:55 UTC: 「Tailscale 传了个视频过来，你帮我放到关于页面的
 * 第一个板块全屏播放」. The film is STARGO_WORK_song_v2_1080p.mp4 (2:00, 1920 × 1080,
 * a song with Chinese and English lyrics drawn into the picture). It plays over the
 * whole first screen; the introduction card that opened the page follows it.
 *
 * The source (37 MB, 96 kHz audio) is cut into two sizes for the web, each
 * as H.264 + AAC with the index at the front, so playback starts before the
 * file has arrived (Cloudflare Pages takes files up to 25 MiB):
 *   assets/stargo-film/stargo-film-1080.mp4  1920 × 1080, from 1024 CSS px wide
 *   assets/stargo-film/stargo-film-720.mp4   1280 × 720, below that or under Save-Data
 * and as VP9 + Opus (.webm, same names) for the browsers built without H.264
 * (Chromium and Firefox builds on some Linux systems); every browser that
 * plays H.264 gets the .mp4, which phones and laptops decode in hardware.
 * The poster is the film's first frame (03:00 on the clock), so the picture does
 * not jump when the film starts.
 *
 * js/stargo-film.js picks the file, starts it muted (the only way a browser lets
 * a page start a clip by itself) and runs the controls; css/stargo-film.css lays
 * it out. The `<video>` carries no `<source>` and no `src`, so the about page's
 * deferral of template clips (tools/build-site.mjs) and Webflow's runtime leave
 * it alone, and nothing is fetched before the script has chosen.
 */
import { escapeHtml } from './lib-html.mjs';

export const FILM_CSS = 'stargo-film.css';
export const FILM_JS = 'js/stargo-film.js';

const DIR = 'assets/stargo-film';

const COPY = {
  zh: {
    region: 'STARGO WORK 品牌片',
    video: 'STARGO WORK 品牌片：2 分钟，配一首歌，画面上有中英文歌词',
    label: '品牌片',
    length: '2:00',
    soundOn: '开启声音',
    mute: '静音',
    play: '播放',
    pause: '暂停',
    full: '全屏观看',
    exitFull: '退出全屏',
    start: '播放品牌片',
    next: '了解我们',
  },
  en: {
    region: 'STARGO WORK brand film',
    video: 'STARGO WORK brand film: 2 minutes, set to a song, with the lyrics on screen in Chinese and English',
    label: 'Brand film',
    length: '2:00',
    soundOn: 'Sound on',
    mute: 'Mute',
    play: 'Play',
    pause: 'Pause',
    full: 'Full screen',
    exitFull: 'Exit full screen',
    start: 'Play the film',
    next: 'About us',
  },
};

const ICON = {
  muted: '<svg class="sg-film__i sg-film__i--muted" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 5 6.5 9H3.5v6h3l4.5 4z"/><path d="m16 9.5 5 5m0-5-5 5"/></svg>',
  sound: '<svg class="sg-film__i sg-film__i--sound" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 5 6.5 9H3.5v6h3l4.5 4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.4 6.2a8.2 8.2 0 0 1 0 11.6"/></svg>',
  pause: '<svg class="sg-film__i sg-film__i--pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.5 6v12M15.5 6v12"/></svg>',
  play: '<svg class="sg-film__i sg-film__i--play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  full: '<svg class="sg-film__i sg-film__i--full" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>',
  exit: '<svg class="sg-film__i sg-film__i--exit" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>',
  down: '<svg class="sg-film__i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14m-5.5-5.5L12 19l5.5-5.5"/></svg>',
};

/** The section, first in the about page's <main>; `next` is the id of the block it hands over to. */
export function filmSection(lang, next = 'intro') {
  const t = COPY[lang];
  const e = (s) => escapeHtml(s);
  return `<section class="sg-film" id="film" aria-label="${e(t.region)}" data-sg-film data-t-sound-on="${e(t.soundOn)}" data-t-mute="${e(t.mute)}" data-t-play="${e(t.play)}" data-t-pause="${e(t.pause)}" data-t-full="${e(t.full)}" data-t-exit-full="${e(t.exitFull)}">`
    + '<div class="sg-film__frame">'
    + `<img class="sg-film__poster" src="${DIR}/poster-1920.webp" srcset="${DIR}/poster-960.webp 960w, ${DIR}/poster-1920.webp 1920w" sizes="100vw" width="1920" height="1080" alt="" fetchpriority="high" decoding="async"/>`
    + `<video class="sg-film__video" muted playsinline loop preload="none" disablepictureinpicture data-src-hd="${DIR}/stargo-film-1080.mp4" data-src-sd="${DIR}/stargo-film-720.mp4" data-src-hd-webm="${DIR}/stargo-film-1080.webm" data-src-sd-webm="${DIR}/stargo-film-720.webm" aria-label="${e(t.video)}"></video>`
    + '<div class="sg-film__progress" aria-hidden="true"><i></i></div>'
    + `<button type="button" class="sg-film__start">${ICON.play}<span>${e(t.start)}<small>${e(t.length)}</small></span></button>`
    + '</div>'
    + '<div class="sg-film__shade" aria-hidden="true"></div>'
    + '<div class="sg-film__bar">'
    + '<div class="sg-film__ui">'
    + `<p class="sg-film__label"><span class="sg-film__dot" aria-hidden="true"></span>${e(t.label)}<span class="sg-film__len">${e(t.length)}</span></p>`
    + '<div class="sg-film__controls">'
    + `<button type="button" class="sg-film__btn sg-film__sound" aria-pressed="false">${ICON.muted}${ICON.sound}<span class="sg-film__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sg-film__btn-text">${e(t.soundOn)}</span></button>`
    + `<button type="button" class="sg-film__btn sg-film__icon sg-film__toggle" aria-label="${e(t.pause)}" title="${e(t.pause)}">${ICON.pause}${ICON.play}</button>`
    + `<button type="button" class="sg-film__btn sg-film__icon sg-film__full" aria-label="${e(t.full)}" title="${e(t.full)}">${ICON.full}${ICON.exit}</button>`
    + '</div>'
    + '</div>'
    + `<a class="sg-film__next" href="#${next}"><span>${e(t.next)}</span>${ICON.down}</a>`
    + '</div>'
    + '</section>';
}

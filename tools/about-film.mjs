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
 *
 * The lyrics are drawn into the picture, which serves as open captions. For a
 * reader who cannot see them, the video is described by the words below
 * (LYRICS: read off the film, every line in both languages, in the order sung;
 * the chorus comes round twice), kept in the page but off screen.
 */
import { escapeHtml } from './lib-html.mjs';

export const FILM_CSS = 'stargo-film.css';
export const FILM_JS = 'js/stargo-film.js';

const DIR = 'assets/stargo-film';

const COPY = {
  zh: {
    region: 'STARGO WORK 品牌片',
    video: 'STARGO WORK 品牌片：2 分钟，配一首歌，画面上有中英文歌词',
    words: '品牌片的画面：凌晨三点的收件箱、找买家的雷达、成交工作台、ERP 和经营驾驶舱、语音助手、扫描全球的客户地图、订单与库存，最后是 STARGO WORK 星贸智能的标志和 www.stargowork.com。歌词：',
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
    words: 'What the film shows: an inbox at three in the morning, a radar finding buyers, the sales desk, ERP and the management cockpit, a voice assistant, a globe of customers, orders and stock, and at the end the STARGO WORK 星贸智能 mark and www.stargowork.com. The lyrics:',
    label: 'Brand film',
    length: '2:00',
    soundOn: 'Sound on',
    mute: 'Mute',
    play: 'Play',
    pause: 'Pause',
    full: 'Full screen',
    exitFull: 'Exit full screen',
    start: 'Play the film',
    next: 'Who we are',
  },
};

/* [zh, en] as drawn in the film. */
const LYRICS = [
  ['凌晨三点，收件箱灯光闪烁', 'Three a.m. and inbox lights are flashing'],
  ['每种语言，每个市场都在呼唤', 'Every language, every market calling'],
  ['STARGO WORK 早已在回复', 'STARGO WORK is already answering'],
  ['天亮之前，AI 已写好邮件', 'AI writes the mail before the morning'],
  ['一句话，看它即刻出发', 'Say the word and watch it go'],
  ['找到买家，让生意流动', 'Find the buyers, make the flow'],
  ['从中国到世界，我们崛起', 'From China to the World we rise'],
  ['STARGO WORK 点亮天际', 'STARGO WORK lights up the skies'],
  ['成交工作台、ERP、经营驾驶舱', 'Sales desk, ERP, the cockpit view'],
  ['语音懂你，订单推进', 'Voice that listens, deals that move'],
  ['星贸智能，AI 外贸焕然一新', '星贸智能 AI trade, brand new'],
  ['一套系统，全程打通', 'One system, all the way through'],
  ['扫描全球，锁定对的客户', 'Scan the globe and pin the right connections'],
  ['开发信飞向每个国家', 'Outreach letters fly in every nation'],
  ['订单、库存、成交，一屏掌握', 'Orders, stock and closes on one screen'],
  ['企业本体，映射业务全貌', 'Ontology that maps the whole machine'],
  ['开口就行，语音已就绪', 'Just say it, the voice is on'],
  ['驾驶舱一目了然，工作已完成', 'Cockpit clear, the work is done'],
  ['从中国到世界，我们崛起', 'From China to the World we rise'],
  ['STARGO WORK 点亮天际', 'STARGO WORK lights up the skies'],
  ['成交工作台、ERP、经营驾驶舱', 'Sales desk, ERP, the cockpit view'],
  ['语音懂你，订单推进', 'Voice that listens, deals that move'],
  ['星贸智能，AI 外贸焕然一新', '星贸智能 AI trade, brand new'],
  ['一套系统，全程打通', 'One system, all the way through'],
  ['STARGO WORK 星贸智能', 'STARGO WORK'],
  ['从中国，到世界', 'From China to the World'],
];

/* When each pair is on screen, in seconds: [start, end], one per LYRICS line, read off the
   film (the lyric band of the 720p file sampled ten times a second; a line starts when its
   Chinese words appear and ends when they go). The film's last card, the company name, is
   not a lyric. js/stargo-film.js shows the current pair as text under the picture on upright
   screens, where the words drawn into the picture come out below 12px. */
const TIMES = [
  [1.2, 5.1], [5.5, 9.1], [9.4, 13.2], [13.6, 16.6], [17.0, 21.0], [21.4, 25.7],
  [27.7, 31.7], [32.2, 34.9], [35.3, 39.2], [39.6, 42.7], [43.1, 47.7], [48.1, 52.0],
  [53.6, 57.8], [58.2, 61.8], [62.2, 66.0], [66.7, 69.3], [69.7, 73.9], [74.3, 78.9],
  [82.4, 86.2], [86.8, 89.2], [89.5, 93.7], [94.0, 97.1], [97.5, 101.7], [102.1, 106.0],
  [107.1, 109.3], [110.5, 114.3],
];
if (TIMES.length !== LYRICS.length || TIMES.some(([a, b], i) => !(a < b) || (i && a <= TIMES[i - 1][1]))) throw new Error('about-film: one time span per lyric line, in order');

const ICON = {
  muted: '<svg class="sg-film__i sg-film__i--muted" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 5 6.5 9H3.5v6h3l4.5 4z"/><path d="m16 9.5 5 5m0-5-5 5"/></svg>',
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
  // The page's own language first in each pair.
  const words = LYRICS.map(([zh, en], i) => {
    const [a, b] = lang === 'zh' ? [zh, en] : [en, zh];
    return `<li data-cue="${TIMES[i].join(' ')}" data-a="${e(a)}" data-b="${e(b)}">${e(`${a} / ${b}`)}</li>`;
  }).join('');
  return `<section class="sg-film" id="film" aria-label="${e(t.region)}" data-sg-film data-t-sound-on="${e(t.soundOn)}" data-t-mute="${e(t.mute)}" data-t-play="${e(t.play)}" data-t-pause="${e(t.pause)}" data-t-full="${e(t.full)}" data-t-exit-full="${e(t.exitFull)}">`
    + '<div class="sg-film__frame">'
    + `<img class="sg-film__poster" src="${DIR}/poster-1920.webp" srcset="${DIR}/poster-960.webp 960w, ${DIR}/poster-1920.webp 1920w" sizes="100vw" width="1920" height="1080" alt="" fetchpriority="high" decoding="async"/>`
    // webkit-playsinline / x5-playsinline: inline play in WeChat's older iOS and X5 browsers. No x5-video-player-type:
    // that hands the film to X5's own player, which ignores the bar under the picture and can cover the lyrics.
    + `<video class="sg-film__video" muted playsinline webkit-playsinline x5-playsinline preload="none" disablepictureinpicture aria-hidden="true" data-src-hd="${DIR}/stargo-film-1080.mp4" data-src-sd="${DIR}/stargo-film-720.mp4" data-src-hd-webm="${DIR}/stargo-film-1080.webm" data-src-sd-webm="${DIR}/stargo-film-720.webm" aria-label="${e(t.video)}" aria-describedby="film-words"></video>`
    + '<div class="sg-film__edges" aria-hidden="true"></div>'
    + '<div class="sg-film__progress" aria-hidden="true"><i></i></div>'
    + '</div>'
    // upright screens: the pair being sung, as text under the picture (js/stargo-film.js)
    + '<p class="sg-film__cap" aria-hidden="true"><span class="sg-film__cap-a"></span><span class="sg-film__cap-b"></span></p>'
    + '<div class="sg-film__shade" aria-hidden="true"></div>'
    + '<div class="sg-film__bar">'
    + '<div class="sg-film__ui">'
    + `<p class="sg-film__label"><span class="sg-film__dot" aria-hidden="true"></span>${e(t.label)}<span class="sg-film__len">${e(t.length)}</span></p>`
    + '<div class="sg-film__controls">'
    // An action button: its words say what a press does (开启声音 / 静音), so it carries no aria-pressed.
    // the label sits in one cell with its longer state, so the button keeps its width when it changes
    + `<button type="button" class="sg-film__btn sg-film__sound">${ICON.muted}<span class="sg-film__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sg-film__btn-label"><span class="sg-film__btn-text">${e(t.soundOn)}</span><span class="sg-film__btn-ghost" aria-hidden="true">${e(t.soundOn.length >= t.mute.length ? t.soundOn : t.mute)}</span></span></button>`
    + `<button type="button" class="sg-film__btn sg-film__icon sg-film__toggle" aria-label="${e(t.pause)}" title="${e(t.pause)}">${ICON.pause}${ICON.play}</button>`
    + `<button type="button" class="sg-film__btn sg-film__icon sg-film__full" aria-label="${e(t.full)}" title="${e(t.full)}">${ICON.full}${ICON.exit}</button>`
    + '</div>'
    // while the film waits for a tap, its play button takes the controls' place
    + `<button type="button" class="sg-film__start">${ICON.play}<span>${e(t.start)}</span></button>`
    + '</div>'
    + `<a class="sg-film__next" href="#${next}"><span>${e(t.next)}</span>${ICON.down}</a>`
    + '</div>'
    + `<div class="sg-film__words" id="film-words">${e(t.words)}<ol>${words}</ol></div>`
    + '</section>';
}

/**
 * Speed lane (review items Z13 and Z14): what the first screen does before,
 * and without, the page's scripts. Applied to every built page by
 * tools/build-site.mjs, after the chrome and before the asset paths move.
 *
 * 1. First-screen text is not hidden in the HTML (Z13).
 *    A few Webflow IX2 elements shipped with their animation's start state
 *    written inline (style="opacity:0", a 25px drop): the capability page's
 *    h1, its lead paragraph and its buttons; the pricing page's plan toggle;
 *    the blog index's card text; an article's whole body and its cover. With
 *    scripts slow they stayed blank until the bundle ran (up to 10s on a slow
 *    phone), and with scripts off, or for a crawler reading the HTML, never
 *    appeared. Those inline states are dropped and the element is marked
 *    `data-sg-first`. css/stargo-fusion.css (speed lane block) holds a marked
 *    element at opacity 0 for at most 1.2s (a CSS animation) and only while
 *    `html.w-mod-js` is set, the runtime has not written a style on it and
 *    `sg-ix-late` is not set, so the donor's fade still starts from nothing
 *    when the runtime is on time.
 *    FIRST_SCREEN_HEAD (inlined in <head>) sets `sg-ix-late` one second after
 *    the first contentful paint (three seconds after the start in a browser
 *    without paint timing). From then a marked element on screen that the runtime has not
 *    started is pinned visible (`data-sg-settled`), and
 *    js/stargo-splittext-cjk.js has the IX3 engine jump its page-load
 *    timelines to their end instead of hiding a hero the reader is already
 *    reading and playing it again (the "wipe and replay" on /workforce,
 *    /intelligence, /blog and the articles).
 *
 * 2. The first homepage picture is fetched first (Z14). The homepage's
 *    largest first-screen paint is the first `photo-hero` tile, which was
 *    loading="lazy", so it waited for layout. It and the tile under it load
 *    eagerly; the first also with fetchpriority="high".
 *
 * 3. The brand film's poster waits (Z14). A <video preload="none"> still
 *    fetches its poster at once: 145 KB at the top of the homepage's queue
 *    for a film twenty screens down. The poster moves to `data-poster`;
 *    js/stargo-video-defer.js puts it back two screens before the film.
 *
 * 4-6, a phone pass (speed lane, 2026-10-23), each explained where its
 * constant is defined below: Lenis's frame loop rests on a touch screen; the
 * intelligence hero's phone frame is fetched first; the homepage's
 * approval-demo clip has a phone-sized copy. The same pass
 * changed three things outside this file: js/stargo-splittext-cjk.js (no
 * SplitText work a phone never shows), tools/fuse-ix.mjs (duplicate
 * page-wide mouse-move interactions) and the testimonial avatars' phone
 * pictures (css/monof-template.app.shared.ed8969994.css).
 */

/* data-w-id → the IX2 elements whose inline start state hides first-screen text. */
const FIRST_SCREEN = new Set([
  'a1f9c987-932d-8e7c-9058-274d3fc5dd13', // capabilities: h1
  'a1f9c987-932d-8e7c-9058-274d3fc5dd1a', // capabilities: lead paragraph
  'a1f9c987-932d-8e7c-9058-274d3fc5dd1d', // capabilities: the two buttons
  'a02bae27-4af9-3edd-fc70-6d1e3065dd7b', // pricing: plan toggle (first screen on phones)
  '0208180c-6469-ec85-9cdf-b67cfde4c413', // blog index: card text
  '0a8e1b9f-5fdc-16a9-dcc3-f5c2df27d8b2', // article: body
  '5b6409ca-bee6-b4c6-a177-367c5ff38e91', // article: cover picture
]);

/* Only a style made of nothing but an IX start state is dropped. */
const START_STATE = /^(?:\s*(?:opacity|-webkit-transform|-moz-transform|-ms-transform|transform|filter|-webkit-filter)\s*:[^;]*;?)+\s*$/;

export const FIRST_SCREEN_HEAD = '<script>!function(w,d){var h=d.documentElement,t=0;'
  + 'function s(){if(/\\bsg-ix-late\\b/.test(h.className))return;h.className+=" sg-ix-late";'
  + 'var n=d.querySelectorAll("[data-sg-first]"),v=w.innerHeight||800;'
  + 'for(var i=0;i<n.length;i++){var e=n[i],o=e.style.opacity,r=e.getBoundingClientRect();'
  + 'if(r.bottom>0&&r.top<v&&(o===""||+o===0))e.setAttribute("data-sg-settled","")}}'
  + 'function a(f){if(!t)t=setTimeout(s,Math.max(0,f+1e3-performance.now()))}'
  + 'var P=w.PerformanceObserver;if(P&&(P.supportedEntryTypes||[]).indexOf("paint")>-1)'
  + 'try{new P(function(l){var f=l.getEntriesByName("first-contentful-paint")[0];if(f)a(f.startTime)}).observe({type:"paint",buffered:!0});return}catch(e){}'
  + 'setTimeout(s,3e3)}(window,document);</script>';

/* 4. Lenis rests on a touch screen (speed lane). Every page's template starts
 *    Lenis (smooth wheel scrolling) and then calls lenis.raf() from its own
 *    requestAnimationFrame loop, sixty times a second for the life of the page.
 *    On a touch screen Lenis is built without syncTouch, so a finger scrolls
 *    natively and lenis.raf() has nothing to advance; the loop was one of five
 *    that kept an idle phone busy. Where the primary pointer is coarse the loop
 *    now runs only while Lenis is animating a scroll, which only happens after
 *    one of its own scrollTo() calls (a wheel or trackpad on a tablet, or a
 *    page script's non-immediate jump): scrollTo is wrapped to start the loop,
 *    and the loop stops itself when the glide ends. The first frame of a
 *    restarted loop advances zero time, since Lenis measures each frame from
 *    the previous one. lenis.stop()/start() and immediate jumps never needed
 *    the loop. With a fine pointer (a desktop or a laptop), or if this Lenis
 *    build is not the one expected, the template's loop runs exactly as before. */
const LENIS_LOOP = 'function raf(time) {\n lenis.raf(time);\n requestAnimationFrame(raf);\n}\n\nrequestAnimationFrame(raf);\n</script>';
const LENIS_DRIVE = 'function raf(time) {\n lenis.raf(time);\n requestAnimationFrame(raf);\n}\n\n'
  + '// Touch screens: drive Lenis only while it glides (tools/speed.mjs, item 4).\n'
  + '!function(){var w=window,a=lenis.animate,go=lenis.scrollTo,id=0;'
  + 'if(!w.matchMedia||!w.matchMedia("(pointer: coarse)").matches||!a||typeof go!=="function"){requestAnimationFrame(raf);return}'
  + 'function step(t){id=0;lenis.raf(t);if(lenis.animate.isRunning)id=requestAnimationFrame(step)}'
  + 'lenis.scrollTo=function(){var r=go.apply(lenis,arguments);if(!id&&lenis.animate.isRunning){lenis.time=0;id=requestAnimationFrame(step)}return r}}();\n'
  + '</script>';

/* 5. The intelligence hero's phone is fetched first (speed lane). Its frame,
 *    img.lx-integrations_06-mockup in .lx-home-hero-mobile-wrapper, is the
 *    page's largest first-screen paint at every width (measured 360-1920px),
 *    yet shipped loading="lazy", so the fetch waited for layout: LCP about
 *    2.9s on a phone profile, the slowest of the five main pages. It loads
 *    eagerly with fetchpriority="high". Its sizes (100vw below 1180px) are
 *    left alone on purpose. They overstate a phone's frame (drawn 80vw - 26px
 *    to 479px, 64vw - 20px to 767px), but the 1180w file of this srcset is
 *    also its smallest (28.8 KB WebP, against 33.7 KB at 1080w and 24.6 KB at
 *    800w), and the page draws the same picture twice further down with the
 *    same srcset and sizes. With truthful sizes a phone fetched a second,
 *    larger file for the hero and the 1180w one again for the others: +40 KB
 *    measured, no sharper on screen. */
const HERO_PHONE_SIZES = 'sizes="(max-width: 1180px) 100vw, 1180px"';

/* 6. The approval demo's clip has a phone copy (speed lane). The homepage's
 *    .bg-collab card plays a 30s, 720px loop of a blurred gradient behind its
 *    chat bubbles: 1.6 MB as the H.264 every browser takes (7.9 MB as the
 *    VP8 webm). A phone draws it about 374 css px wide, under a frosted
 *    panel. A 360px copy of the same webm master, encoded like the site's
 *    other copies (tools/encode-video.mjs: libx264 -preset slower -profile
 *    high, CRF 23, Lanczos; VP9 CRF 34 for the webm), is 511 KB and 270 KB.
 *    Frames compared at a 390px phone's drawn size (1122x1692 device px)
 *    show no visible difference; SSIM against the master is 0.9909 where
 *    today's copy scores 0.9925. Each <source> gains data-mobile-src, which
 *    js/stargo-video-defer.js takes instead of data-src below 768px and
 *    which tools/asset-version.mjs versions and tools/chrome.mjs
 *    relocateAssets moves for /en/. The same script leaves this clip on its
 *    poster under Save-Data. From 768px up nothing changes. */
const COLLAB_PHONE = {
  'video/mp4': 'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4f83_collab-360.mp4',
  'video/webm': 'assets/699b6466d5f19893993a4bf2/699b6466d5f19893993a4f83_collab-360.webm',
};

export function speedPage(html, name) {
  let out = html;
  let n = 0;
  out = out.replace(/<([a-z0-9]+)(\s[^>]*?)?\sdata-w-id="([0-9a-f-]+)"([^>]*)>/g, (tag, el, pre = '', id, post) => {
    if (!FIRST_SCREEN.has(id)) return tag;
    const all = `${pre} data-w-id="${id}"${post}`;
    const m = all.match(/\sstyle="([^"]*)"/);
    if (!m || !START_STATE.test(m[1].replace(/\s+/g, ' '))) return tag;
    n++;
    return `<${el}${all.replace(m[0], '').replace(` data-w-id="${id}"`, ` data-w-id="${id}" data-sg-first=""`)}>`;
  });
  if (n && !out.includes('data-sg-first')) throw new Error(`speed: ${name}: first-screen marks lost`);

  // The cap on how long a first-screen element waits for the runtime.
  const stamp = '<script>document.documentElement.className+=" w-mod-ix w-mod-ix3";</script>';
  if (!out.includes(stamp)) throw new Error(`speed: ${name}: Webflow's ix stamp not found`);
  out = out.replace(stamp, stamp + FIRST_SCREEN_HEAD);

  if (/<html[^>]*data-stargo-home/.test(out)) {
    let k = 0;
    out = out.replace(/<img\b[^>]*\bclass="photo-hero"[^>]*\/>/g, (tag) => {
      k++;
      if (k > 2) return tag;
      return tag.replace(' loading="lazy"', k === 1 ? ' loading="eager" fetchpriority="high"' : ' loading="eager"');
    });
    /* Since 2026-10-24 the mosaic is drawn in code (tools/code-art-vignettes.mjs):
       its tiles are `div.photo-hero.sgv` hosts with nothing to fetch, so there is
       no picture to hurry. */
    if (!k && !/class="sgv sgv-\w+ photo-hero"/.test(out)) throw new Error(`speed: ${name}: the hero mosaic has neither a picture nor a code-drawn tile`);
    if (k && !/fetchpriority="high" class="photo-hero"/.test(out)) throw new Error(`speed: ${name}: first hero picture not found`);
  }

  out = out.replace(/(<video id="stargo-brand-film"[^>]*?)\sposter="/, '$1 data-poster="');

  const hand = out.indexOf('class="lx-home-hero-mobile-wrapper"');
  if (hand > -1) {
    const at = out.indexOf('class="lx-integrations_06-mockup"', hand);
    const open = out.lastIndexOf('<img', at);
    const close = out.indexOf('/>', at) + 2;
    const tag = out.slice(open, close);
    if (at < 0 || open < hand || !tag.includes(' loading="lazy"') || !tag.includes(HERO_PHONE_SIZES)) throw new Error(`speed: ${name}: the hero phone frame is not the lazy, 100vw picture expected`);
    out = out.slice(0, open) + tag.replace(' loading="lazy"', ' loading="eager" fetchpriority="high"') + out.slice(close);
  }

  const card = out.indexOf('class="bg-collab ');
  if (card > -1) {
    const end = out.indexOf('</video>', card);
    let k = 0;
    const clip = out.slice(card, end).replace(/<source data-src="[^"]+" type="(video\/(?:mp4|webm))"/g, (tag, type) => {
      k++;
      return `${tag} data-mobile-src="${COLLAB_PHONE[type]}"`;
    });
    if (end < 0 || k !== 2 || !/video\/mp4[\s\S]*video\/webm/.test(clip)) throw new Error(`speed: ${name}: the approval demo's clip is not the mp4 + webm pair expected`);
    out = out.slice(0, card) + clip + out.slice(end);
  } else if (/<html[^>]*data-stargo-home/.test(out)) throw new Error(`speed: ${name}: the approval demo's clip not found`);

  if (out.split(LENIS_LOOP).length !== 2) throw new Error(`speed: ${name}: the template's Lenis loop not found exactly once`);
  out = out.replace(LENIS_LOOP, LENIS_DRIVE);
  return out;
}

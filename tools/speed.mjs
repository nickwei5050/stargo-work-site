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
    if (!/fetchpriority="high" class="photo-hero"/.test(out)) throw new Error(`speed: ${name}: first hero picture not found`);
  }

  out = out.replace(/(<video id="stargo-brand-film"[^>]*?)\sposter="/, '$1 data-poster="');
  return out;
}

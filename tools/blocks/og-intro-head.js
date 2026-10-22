/* og-intro, the <head> half — whether the opening plays on this homepage view.

   tools/build-site.mjs writes this, comments stripped, as an inline <script>
   straight after Webflow's own `w-mod-js` snippet in the <head> of index.html
   and en/index.html, the only two pages that carry the overlay. It runs before
   anything in <body> is parsed, so the decision is made before the first frame
   and the overlay is either there on that frame or never there at all: no page
   flashes before it, and no later view of the homepage is covered for even a
   frame. Inline, because a request here would hold the first paint.

   It plays when all three hold, and then this adds `og-intro-play` to <html>,
   the class tools/blocks/og-intro.css displays the overlay under:

     - The opening has not started yet in this browser session.
       tools/blocks/og-intro.js writes `stargo-intro` to sessionStorage the
       moment it starts, so leaving half-way does not replay it, and every later
       homepage view of the session — logo, 首页, back, reload — finds the mark
       here and is never covered: the owner's 「每次访问只播一次」. A view that
       did not play it (too slow, reduced motion) leaves no mark, so a later one
       still can. Storage access is wrapped, because a private window may refuse
       it; then it plays, as it always did.
     - The reader has not asked for reduced motion (og-intro.css also never
       displays it then).
     - We are still within 1.5s of navigation. Like any inline script, this
       one does not run until the stylesheets ahead of it have arrived — all of
       the page's but the small lenis.css — so a late start here means a slow
       connection, and on one the reader gets the homepage at once rather than
       a black screen first. tools/blocks/og-intro.js starts the opening
       on the very next frame, and checks the clock again. */
!function (d) {
  try { if (window.sessionStorage.getItem('stargo-intro')) return; } catch (e) { /* no storage: play it */ }
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { /* no matchMedia */ }
  if (!window.performance || performance.now() > 1500) return;
  d.documentElement.className += ' og-intro-play';
}(document);

/**
 * Keep the owner's photograph on the homepage's scenario cards the right way up.
 *
 * Mono tosses each of the four scenario cards (`.testimonials-card`) away as
 * the section scrolls on, and its interaction ends the toss turned over: the
 * runtime writes the card an inline transform such as
 * `translate3d(-100%, -140%, 0) rotate(17deg) rotateX(180deg)`, and the card's
 * back face is visible, so whatever is on it is drawn upside down while the
 * card lies, turned over, in a corner of the window. The template's portrait
 * film did not mind; R2 (the trade manager at the whiteboard,
 * `img.stargo-role-photo` in card _03, tools/replaceables.mjs HOME_ROLE_CARD)
 * is a picture of a person and reads upside down.
 *
 * So whenever the card's own transform has turned it over (the 2D
 * determinant of its computed transform is negative), this sets
 * `.sgp-upright` on the photograph, which turns it back over inside its own
 * box (css/stargo-fusion.css). The card flies and turns exactly as before,
 * its text still reads back to front like the other three cards', and only
 * the photograph, which fills the card, is drawn the right way round.
 *
 * The same shape as js/stargo-stage-hold.js: a small correction on top of the
 * Webflow runtime that reads the inline state it manages and writes none.
 */
(function () {
  var UPRIGHT = 'sgp-upright';
  // since 2026-10-24 card _03 holds a code-drawn scene (.sgk-host, tools/code-art-atmos.mjs) in place of R2
  var photos = [].slice.call(document.querySelectorAll('.testimonials-card img[src*="stargo-photo"], .testimonials-card .sgk-host'));
  if (!photos.length || typeof DOMMatrixReadOnly === 'undefined' || typeof MutationObserver === 'undefined') return;
  photos.forEach(function (img) {
    var card = img.closest('.testimonials-card');
    function check() {
      var t = getComputedStyle(card).transform;
      var m = t && t !== 'none' ? new DOMMatrixReadOnly(t) : null;
      var over = !!m && m.a * m.d - m.b * m.c < 0;
      if (img.classList.contains(UPRIGHT) !== over) img.classList.toggle(UPRIGHT, over);
    }
    new MutationObserver(check).observe(card, { attributes: true, attributeFilter: ['style', 'class'] });
    check();
  });
})();

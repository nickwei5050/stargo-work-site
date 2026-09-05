/* On phones, long animated paragraphs would split into a dozen reveal lines.
   Elements that carry a data-mobile-text attribute swap to that shorter
   phrasing before the page bundle runs (this script is loaded right before
   it), so the text animations split the short version. Desktop is untouched. */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 767px)').matches) return;
  var els = document.querySelectorAll('[data-mobile-text]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var keep = [];
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 && c.tagName !== 'BR') keep.push(c);
    el.textContent = el.getAttribute('data-mobile-text');
    for (var k = 0; k < keep.length; k++) el.appendChild(keep[k]);
  }
})();

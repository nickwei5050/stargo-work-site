/* GSAP SplitText splits "words" on spaces. Chinese has none, so on the Chinese
   pages a whole paragraph became one unbreakable inline-block and its "lines"
   were detected wrongly (text re-wrapped inside each line block). The Webflow
   engine instantiates SplitText itself with a fixed option set, so the class
   is wrapped here — on zh pages only — to supply a word delimiter that:
     · splits between ideographs / kana (each character becomes a word),
     · keeps CJK punctuation attached to the character before it,
     · keeps opening quotes/brackets attached to the character after,
     · leaves Latin runs (a word, "STARGO WORK", "288") intact,
     · keeps a real space where the copy had one (the space rides at the start
       of the next word, which SplitText re-inserts as a space node).
   Loaded after SplitText.min.js and before the Webflow bundle. */
(function () {
  var Orig = window.SplitText;
  if (!Orig) return;
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;
  var re;
  try {
    var IDEO = '\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff';
    var PUNCT = '\\u3000-\\u303f\\uff00-\\uffef';
    var OPEN = '\\u300c\\u300e\\uff08\\u3010\\u300a\\u3008\\u201c\\u2018';
    re = new RegExp(
      '(?<![\\s' + OPEN + '])(?=\\s?[' + IDEO + '])' +
      '|(?<=[' + IDEO + PUNCT + '])(?<![' + OPEN + '])(?=\\s?[^\\s' + PUNCT + '])',
    );
  } catch (e) {
    return; // no lookbehind support: keep the template behaviour
  }
  function Patched(targets, vars) {
    var v = Object.assign({}, vars || {});
    // The donor splits generic containers and paragraphs as well as headings.
    // Auto aria-label is invalid on those containers and hides nested headings
    // and links. Keep their original semantic text tree exposed in both languages.
    v.aria = 'none';
    if (zh && v.wordDelimiter == null) v.wordDelimiter = { delimiter: re, replaceWith: '' };
    // With a custom delimiter SplitText pops a trailing empty chunk and then
    // reads the first one; an empty text node would leave it nothing to read.
    if (zh && v.prepareText == null) v.prepareText = function (text) { return text === '' ? ' ' : text; };
    // A phrase marked .sgp-nobr (the Chinese article headings, tools/blog.mjs
    // titleHtml) is kept whole: with the per-character delimiter above, lines
    // could otherwise be cut inside a word such as 「获客」.
    if (v.ignore == null) v.ignore = '.sgp-nobr';
    return new Orig(targets, v);
  }
  Patched.prototype = Orig.prototype;
  try { Object.setPrototypeOf(Patched, Orig); } catch (e) { /* statics unavailable */ }
  Patched.create = function (targets, vars) { return new Patched(targets, vars); };
  window.SplitText = Patched;
})();

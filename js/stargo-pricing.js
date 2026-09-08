/**
 * Pricing page motion.
 *
 * Additive only: the Webflow timelines and the Lenis scroller that every page
 * already runs are untouched. This adds four things to the plan ladder —
 *
 *   1. the two headline blocks and the plan cards arrive as you reach them,
 *      the promoted card last so the eye lands on it;
 *   2. each price counts up to its real figure the first time it is seen;
 *   3. the promoted card carries one slow pink breath so it reads as the
 *      recommendation without a badge having to shout;
 *   4. comparison-table groups fade in row by row.
 *
 * Everything is guarded: no GSAP, no ScrollTrigger, or a visitor who asked for
 * reduced motion, and the page simply renders in its final state.
 */
(function () {
  'use strict';

  var g = window.gsap;
  var ST = window.ScrollTrigger;
  if (!g || !ST) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  g.registerPlugin(ST);

  var q = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ 1. */
  /* Headline and intro of each section: a short rise, once. */
  q('.pricing-hero h1, .pricing-hero .heading-style-h2, .plans h2').forEach(function (el) {
    g.from(el, {
      opacity: 0, y: 28, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* ------------------------------------------------------------------ 2. */
  /* Plan cards, in ladder order, the promoted one arriving last. */
  q('.pricing-cards-wrapper').forEach(function (wrap) {
    var cards = q(':scope > *', wrap);
    if (!cards.length) return;
    var promoted = cards.filter(function (c) { return c.querySelector('.pricing-card.growth, .growth-card'); });
    var rest = cards.filter(function (c) { return promoted.indexOf(c) === -1; });
    var order = rest.concat(promoted);
    g.from(order, {
      opacity: 0, y: 34, duration: 0.7, ease: 'power2.out', stagger: 0.09,
      scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
    });
  });

  /* ------------------------------------------------------------------ 3. */
  /* Prices count up. Only figures: "定制", "Custom", "演示" and the like stay put. */
  var NUM = /^([^\d]*)([\d][\d,]*)(.*)$/;
  q('.pricing-card-price').forEach(function (el) {
    var m = NUM.exec(el.textContent.trim());
    if (!m) return;
    var prefix = m[1], target = parseInt(m[2].replace(/,/g, ''), 10), suffix = m[3];
    if (!isFinite(target) || target <= 0) return;
    var group = m[2].indexOf(',') !== -1;
    var state = { v: 0 };
    var render = function () {
      var n = Math.round(state.v);
      el.textContent = prefix + (group ? n.toLocaleString('en-US') : String(n)) + suffix;
    };
    ST.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: function () {
        g.to(state, { v: target, duration: 1.1, ease: 'power2.out', onUpdate: render, onComplete: render });
      },
    });
  });

  /* ------------------------------------------------------------------ 4. */
  /* One slow breath on the promoted card, then it rests. */
  q('.growth-card').forEach(function (card) {
    var inner = card.querySelector('.pricing-card.growth') || card;
    g.fromTo(
      inner,
      { boxShadow: '0 0 0 1px rgba(249,56,161,.20), 0 24px 70px -30px rgba(249,56,161,.35)' },
      {
        boxShadow: '0 0 0 1px rgba(249,56,161,.55), 0 30px 90px -28px rgba(249,56,161,.80)',
        duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: 1,
        scrollTrigger: { trigger: card, start: 'top 80%', once: true },
      }
    );
  });

  /* ------------------------------------------------------------------ 5. */
  /* Comparison table: each group of rows fades in as it is reached. */
  q('.company-plans-list-wrapper').forEach(function (row, i) {
    g.from(row, {
      opacity: 0, y: 14, duration: 0.5, ease: 'power1.out', delay: (i % 5) * 0.04,
      scrollTrigger: { trigger: row, start: 'top 94%', once: true },
    });
  });

  /* ------------------------------------------------------------------ 6. */
  /* The tabs swap whole panes in and out, which changes every position below
     them; let ScrollTrigger remeasure once the pane has settled. */
  q('.pricing-tab-link, .w-tab-link').forEach(function (tab) {
    tab.addEventListener('click', function () { setTimeout(function () { ST.refresh(); }, 260); });
  });

  window.addEventListener('load', function () { ST.refresh(); });
})();

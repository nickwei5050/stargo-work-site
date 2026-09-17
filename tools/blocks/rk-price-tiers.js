/* rk-price-tiers — the price-period switch, reachable and operable from the
   keyboard.

   renok's switch is a pointer control only: IX2 event e-1700/e-1701
   (MOUSE_CLICK on `.rt-toggle`) alternates a-35 / a-36, which swap the two card
   grids (`.rt-monthly-wrapper` / `.rt-yearly-wrapper`, here 首年价格 / 续费)
   and animate the ball, the two labels and their underlines. The labels
   themselves do nothing and nothing in the switch can take focus, so a
   keyboard or screen-reader visitor could never see the renewal prices.

   This adds the tabs pattern on top, and nothing else:
     - the row is a tablist; the two labels are its tabs; the two grids are
       their tabpanels (the grid IX2 hides is `display: none`, so it is out of
       the accessibility tree already);
     - clicking a label, or Enter / Space / ← / → / Home / End on a focused
       label, selects that period — by clicking the switch, so the donor's own
       animation runs exactly as it does for a pointer;
     - a pointer click on the switch updates the tabs' state too.

   IX2 flips on every click (three quick clicks end on the renewal grid) and
   applies the change on its next frame, so the period is tracked here by
   counting clicks rather than read back straight away; 300ms after the last
   click it is read back from the grids, which also covers a page where IX2
   never started (then the switch does nothing, and the tabs say so).

   No price, plan, label or style is changed. The labels get a pointer cursor,
   which is what they now do. */
(function () {
  var root = document.querySelector('.rk-price-tiers');
  if (!root) return;
  var list = root.querySelector('.rk-rt-pricing-toggle-wrap');
  var toggle = root.querySelector('.rk-rt-toggle');
  var tabs = [root.querySelector('.rk-rt-monthly-wrap'), root.querySelector('.rk-rt-yearly-wrap')];
  var panes = [root.querySelector('.rk-rt-monthly-wrapper'), root.querySelector('.rk-rt-yearly-wrapper')];
  if (!list || !toggle || !tabs[0] || !tabs[1] || !panes[0] || !panes[1]) return;
  var zh = (document.documentElement.getAttribute('lang') || '').indexOf('zh') === 0;

  /* Read from the first-year grid: before IX2 starts, both grids are drawn and
     the first-year one is what IX2's initial state keeps. */
  function shown() { return window.getComputedStyle(panes[0]).display === 'none' ? 1 : 0; }
  var period = shown();
  var settle = null;

  function sync() {
    for (var i = 0; i < 2; i++) {
      tabs[i].setAttribute('aria-selected', String(i === period));
      tabs[i].setAttribute('tabindex', i === period ? '0' : '-1');
    }
  }

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', zh ? '价格周期' : 'Price period');
  /* The switch stays a pointer control; the two tabs are its accessible form. */
  toggle.setAttribute('aria-hidden', 'true');
  for (var i = 0; i < 2; i++) {
    tabs[i].id = 'rk-price-period-' + i;
    panes[i].id = 'rk-price-panel-' + i;
    tabs[i].setAttribute('role', 'tab');
    tabs[i].setAttribute('aria-controls', panes[i].id);
    panes[i].setAttribute('role', 'tabpanel');
    panes[i].setAttribute('aria-labelledby', tabs[i].id);
    tabs[i].style.cursor = 'pointer';
  }

  toggle.addEventListener('click', function () {
    period = 1 - period;
    sync();
    window.clearTimeout(settle);
    settle = window.setTimeout(function () { period = shown(); sync(); }, 300);
  });

  function select(index) {
    if (index !== period) toggle.click();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(index); });
    tab.addEventListener('keydown', function (e) {
      var to;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') to = 1 - index;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = 1;
      else if (e.key === 'Enter' || e.key === ' ') to = index;
      else return;
      e.preventDefault();
      select(to);
      tabs[to].focus({ preventScroll: true });
    });
  });

  sync();
})();

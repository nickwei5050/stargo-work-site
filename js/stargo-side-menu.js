/**
 * The desktop side menu, from the keyboard.
 *
 * From 992px the header's two-line icon (`.last-part .circle-wrap`) slides the
 * page aside and fades in the side menu (`.menu-wrapper`); the round close
 * button (`.fixed-close-button`) slides it back. Both are Webflow click
 * interactions on plain <div>s. The menu sits behind the page while it is
 * closed, with its links at opacity 0, and nothing took those links out of the
 * Tab order: the first sixteen Tab stops of every desktop page were invisible
 * links, and the icon itself could not be reached or pressed.
 *
 * tools/chrome.mjs writes the markup this works with: the icon is a named
 * button (`aria-controls`, `aria-expanded`), the close button is a named
 * button, and the menu and the close button ship `inert`, so from the first
 * paint the closed menu takes no focus and no clicks. This script
 *   - opens the menu from the icon with Enter or Space (the same click the
 *     mouse gives), and closes it from the icon when it is already open;
 *   - lifts `inert` while the menu is open and moves focus to its first link;
 *   - closes it on Escape and from the close button with Enter or Space, and
 *     returns focus to the icon, bringing the icon back on screen when the
 *     page has been scrolled past it, so the focus ring can be seen;
 *   - follows the menu's real state from the inline opacity the animation
 *     writes on the first menu item. A close speaks for itself, whatever
 *     closed it; so does an open, with one deliberate exception: for 1500ms
 *     after an open that has since been closed, a rising opacity is read as
 *     the tail of that ended open and ignored (OPEN_TAIL below, which says why
 *     it cannot be narrower). An open through `openMenu()` is never ignored —
 *     it restarts the window itself — and on these pages that is every open
 *     there is, the header icon being the only opener tools/chrome.mjs writes.
 * The animations are the template's own; nothing here moves anything but the
 * page's own scroll, and that only far enough to show the icon taking focus.
 * Below 992px the icon, the menu and the close button are not displayed and
 * the header's own menu button (Webflow's) is used instead; it is not touched.
 */
(function () {
  var menu = document.getElementById('stargo-side-menu');
  var trigger = document.querySelector('[aria-controls="stargo-side-menu"]');
  var close = document.querySelector('.fixed-close-button');
  if (!menu || !trigger || !close) return;
  var probe = menu.querySelector('.menu-item');
  var isOpen = false;
  var lastOpacity = 0;
  /* When the menu last started opening and when it was last closed. The
     template's open animation holds the items at opacity 0 for 0.8s and then
     fades them in over 0.25s, and a close does not rewind that tween: a close
     during the first second is followed by the tail of the open it
     interrupted. (Measured on the built pages: the fade runs from ~0.8s to
     ~1.1s after the open in both Chromium and WebKit, and the item is left at
     opacity 1 with the menu shut.) 1500ms covers the whole animation with room
     to spare. */
  var OPEN_TAIL = 1500;
  var openedAt = 0;
  var closedAt = 0;

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;
    if (open) {
      openedAt = Date.now();
      /* css/stargo-ow.css holds the page still while it loads; this lets the
         open animation move it aside, or the menu would stay behind it. */
      document.body.classList.add('ow-menu-used');
      menu.removeAttribute('inert');
      close.removeAttribute('inert');
    } else {
      closedAt = Date.now();
      menu.setAttribute('inert', '');
      close.setAttribute('inert', '');
    }
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function focusIn() {
    var first = menu.querySelector('.menu-item a[href]');
    if (first) first.focus({ preventScroll: true });
  }

  /* Where the icon's own box sits in the page, ignoring the transforms the
     open and close animations put on the header: while either is playing the
     icon's client rect is not where it is going to rest, so the rect cannot be
     asked whether the icon will be on screen. */
  function docTop(el) {
    var y = 0;
    for (var n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  }

  /* Give the icon focus and let it be seen taking it. The header scrolls away
     with the hero, so from further down the page `preventScroll` leaves the
     focus ring above the top edge and the reader sees no focus at all — the
     menu is closed and the keyboard is somewhere invisible. The page is moved
     only when the icon would not be on screen without it, and no further than
     it takes to show it. (The open path keeps `preventScroll`: the first menu
     link is drawn over the page wherever the page happens to be.) */
  function focusTrigger() {
    var h = window.innerHeight || document.documentElement.clientHeight || 0;
    var box = trigger.offsetHeight;
    if (box) {
      var top = docTop(trigger);
      var y = window.pageYOffset;
      if (top < y || top + box > y + h) {
        var to = Math.max(0, top - 24);   // a little air above the ring
        // `lenis` is the page's smooth-scroll instance; an immediate jump
        // through it keeps its own idea of the scroll in step with the page's.
        if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(to, { immediate: true, force: true });
        else window.scrollTo(0, to);
      }
    }
    try { trigger.focus({ preventScroll: true }); } catch (e) { trigger.focus(); }
  }

  function focusBack() {
    var active = document.activeElement;
    if (!active || active === document.body || menu.contains(active) || close.contains(active)) {
      focusTrigger();
    }
  }

  function openMenu() {
    setOpen(true);
    focusIn();
  }

  function closeMenu() {
    if (!isOpen) return;
    close.click();          // the template's close animation; the listener below does the rest
    setOpen(false);
    focusTrigger();
  }

  function isActivation(e) {
    return e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar';
  }

  // Mouse, touch and keyboard all arrive here as a click.
  trigger.addEventListener('click', function () { openMenu(); });
  trigger.addEventListener('keydown', function (e) {
    if (!isActivation(e)) return;
    e.preventDefault();
    if (isOpen) closeMenu();
    else trigger.click();
  });

  close.addEventListener('click', function () {
    if (!isOpen) return;
    focusBack();
    setOpen(false);
  });
  close.addEventListener('keydown', function (e) {
    if (!isActivation(e)) return;
    e.preventDefault();
    closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
      e.preventDefault();
      closeMenu();
    }
  });

  // Follow the first item's opacity: rising past half means open, falling back
  // to nothing means closed — whatever did it, bar the one case below.
  if (probe && window.MutationObserver) {
    new MutationObserver(function () {
      var o = parseFloat(probe.style.opacity);
      if (isNaN(o)) return;
      /* An explicit close beats the opening animation it interrupted. Escape
         or the close button within the first second used to be swallowed: the
         open tween kept writing its rising opacity afterwards and was read
         here as a new open, so the menu was put back into the Tab order
         (`inert` off, aria-expanded="true") over a page that had closed it.

         The guard is a clock, and precisely this: a rise is ignored while the
         last thing this script recorded was a close and the open before it
         began less than OPEN_TAIL ago. It is no narrower because it cannot be.
         The tail of an ended open and the opening of a fresh one are the same
         writes on the same element — held at 0, then rising to 1 — and the
         menu wrapper reads identically open and closed (it sits behind the
         page, always display:flex, opacity 1), so nothing in the DOM tells the
         two apart. An open through openMenu() is unaffected: it sets
         `openedAt`, which both restarts the window and makes
         `closedAt > openedAt` false. On these pages that is every open there
         is — tools/chrome.mjs writes exactly one opener, the header icon, and
         mouse, touch and keyboard all reach openMenu() through its click. What
         the window would swallow is an open by some other hand inside 1500ms
         of an open that was closed; a close is never swallowed. */
      var tail = closedAt > openedAt && (Date.now() - openedAt) < OPEN_TAIL;
      if (o > 0.5 && !isOpen) { if (!tail) setOpen(true); }
      else if (o < 0.02 && lastOpacity >= 0.02 && isOpen) { focusBack(); setOpen(false); }
      lastOpacity = o;
    }).observe(probe, { attributes: true, attributeFilter: ['style'] });
  }
})();

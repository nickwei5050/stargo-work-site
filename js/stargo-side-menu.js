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
 *   - follows the menu's real state, whatever opened or closed it, from the
 *     inline opacity the animation writes on the first menu item — bar the
 *     tail of an opening animation an explicit close has already ended.
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
     interrupted. 1500ms covers the whole animation with room to spare. */
  var OPEN_TAIL = 1500;
  var openedAt = 0;
  var closedAt = 0;

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;
    if (open) {
      openedAt = Date.now();
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

  // Whatever else opens or closes it, follow the first item's opacity: rising
  // past half means open, falling back to nothing means closed.
  if (probe && window.MutationObserver) {
    new MutationObserver(function () {
      var o = parseFloat(probe.style.opacity);
      if (isNaN(o)) return;
      /* An explicit close beats the opening animation it interrupted. Escape
         or the close button within the first second used to be swallowed: the
         open tween kept writing its rising opacity afterwards and was read
         here as a new open, so the menu was put back into the Tab order
         (`inert` off, aria-expanded="true") over a page that had closed it.
         Only the tail of the open this close ended is ignored — a later open,
         by the template or by anything else, still speaks for itself. */
      var tail = closedAt > openedAt && (Date.now() - openedAt) < OPEN_TAIL;
      if (o > 0.5 && !isOpen) { if (!tail) setOpen(true); }
      else if (o < 0.02 && lastOpacity >= 0.02 && isOpen) { focusBack(); setOpen(false); }
      lastOpacity = o;
    }).observe(probe, { attributes: true, attributeFilter: ['style'] });
  }
})();

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
 *     returns focus to the icon;
 *   - follows the menu's real state, whatever opened or closed it, from the
 *     inline opacity the animation writes on the first menu item.
 * The animations are the template's own; nothing here moves anything.
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

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;
    if (open) {
      menu.removeAttribute('inert');
      close.removeAttribute('inert');
    } else {
      menu.setAttribute('inert', '');
      close.setAttribute('inert', '');
    }
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function focusIn() {
    var first = menu.querySelector('.menu-item a[href]');
    if (first) first.focus({ preventScroll: true });
  }

  function focusBack() {
    var active = document.activeElement;
    if (!active || active === document.body || menu.contains(active) || close.contains(active)) {
      trigger.focus({ preventScroll: true });
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
    trigger.focus({ preventScroll: true });
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
      if (o > 0.5 && !isOpen) setOpen(true);
      else if (o < 0.02 && lastOpacity >= 0.02 && isOpen) { focusBack(); setOpen(false); }
      lastOpacity = o;
    }).observe(probe, { attributes: true, attributeFilter: ['style'] });
  }
})();

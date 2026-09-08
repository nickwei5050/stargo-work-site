/* qx-whatwedo — open one foundation's capability list on click.
   Vanilla, scoped to .qx-whatwedo. The donor ships no click interaction on
   this block; this is the smallest toggle that does what the owner asked:
   "点击可以分别展开介绍01、02、03、04的功能". One node open at a time, so a
   list never stacks onto a neighbour on the crowded stage. */
(function () {
  var root = document.querySelector('.qx-whatwedo');
  if (!root) return;
  var nodes = root.querySelectorAll('.qx-wrapper-main-services[aria-controls]');
  function setOpen(node, open) {
    var panel = root.querySelector('#' + node.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = !open;
    node.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function toggle(node) {
    var open = node.getAttribute('aria-expanded') !== 'true';
    for (var i = 0; i < nodes.length; i++) if (nodes[i] !== node) setOpen(nodes[i], false);
    setOpen(node, open);
  }
  for (var i = 0; i < nodes.length; i++) {
    (function (node) {
      node.addEventListener('click', function () { toggle(node); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(node); }
      });
    })(nodes[i]);
  }
})();

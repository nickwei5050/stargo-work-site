# OFFGRID (Webflow template export)

Supplied by the site owner on 2026-09-09 as `开场动画.zip`, alongside rototo, to
provide the site's opening animation. Vendored here the way every other donor
is: the export's own `index.html`, `css/` and `js/`, unmodified, read by the
build and never served as-is.

What this site takes from it:

- The intro on `index.html`: `[<span class="text-spam">OFF</span>]` opens from a
  hairline (`width: 0.5%` growing) so the brackets are pushed apart letter by
  letter, and `GRID` slides in from the left (`translate3d(-2em, 0, 0)`, width
  0 → 100%). The owner chose `[STARGO OS]` — the whole name inside the brackets
  — so only the bracketed span is used and the sliding second word is not.
- The works mosaic below it (`[data-works-grid] .grid__img`): 37 tiles that
  begin as 84×150 slivers rotated 45° in 3D (`matrix3d(0.5657, 0, -0.5657, …)`)
  and settle to 149×188 unrotated. The owner's first screenshot is a frame of
  that reveal part-way through.

Only the words change. The animations, their timings and their easing are the
donor's own; see tools/blocks/ for the cut and what it could not carry.

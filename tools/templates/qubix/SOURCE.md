# qubix — donor for the Capability map module

Source: the Qubix Studio Webflow template, supplied by the owner
(`qubixstudiowebsitetemplate.zip`, 2026-09-07).

Only one block is used: `.service-details-rice` from the service-detail page — a
label plus rich-text grid whose bullets lead with a bold term. It repeats
natively, carries no imagery and is dark by default, which is why it can hold a
157-entry catalogue without becoming a table again.

Files kept here for provenance:

| File | Why |
| --- | --- |
| `services_development.html` | the donor page; the block sits in `.service-details-bottom-content` |
| `services.html` | the sibling card list, inspected and not used |
| `css/qubix-flowdevz.app.shared.0505778fd.css` | the stylesheet the measurements come from |

What was transplanted, and where it lives now:

- Markup: rebuilt in `tools/build-site.mjs` → `capabilityShowcase()`, with `qx-`
  prefixed class names so nothing collides with Mono, Scalora or Lifelogx.
- Styles: `css/stargo-fusion.css`, scoped under `.qx-capmap`. Values are the
  donor's measured computed styles, not approximations — label 20/26.8 at
  -0.8px in `#fe6512`, body 20/26.8 at -0.4px, list items 20/30.8 in `#a1a1a1`
  with a 20px bullet indent, 52px label gutter, 24px between rows, a 698px text
  column inside an 872px block, and the donor's own `@media (min-width:1280px)`
  switch from a stacked label to a side label.
- Assets: `assets/qubix/` holds the four InterDisplay weights and the bullet
  `dot.svg`, mirrored from the template's CDN because this site makes no
  off-origin requests.

Two deliberate departures from the donor, both forced by our content rather than
taste: the donor's labels are single words so they never needed to wrap, and its
rich text never contained links. Long labels wrap below 1280px, and catalogue
anchors get an underline in the donor's own palette.

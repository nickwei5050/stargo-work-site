/**
 * 联系表单卡片 — cinery's contact form card, wearing this site's own ten fields.
 *
 * WHAT THIS BLOCK EMITS
 *   ONE element and nothing else:
 *
 *     <div class="cn-contact-form-wrapper w-form">
 *       <form …>  the ten fields, the honeypot, the submit, the note  </form>
 *       <div class="cn-form-message-success w-form-done">…</div>
 *       <div class="cn-form-message-error   w-form-fail">…</div>
 *     </div>
 *
 *   It is a drop-in replacement for the `div.w-form` that stands at
 *   `div.form-amin > div.margin-40 > div.w-form` on this site's built
 *   contact.html — same `.w-form` class on the root, same three children in the
 *   same order, and the two notices still siblings after `</form>` inside it,
 *   which is where both Webflow's runtime and js/stargo-forms.js look for them.
 *   tools/build-site.mjs's `renderBlock` wraps a block in
 *   `<div class="cn-contact">…</div>` (the scope root its stylesheet is written
 *   under), so the wiring gets `div.cn-contact > div.cn-contact-form-wrapper.w-form`
 *   where `div.w-form` stood. `form.parentElement` is still the card.
 *
 * WHY, AND WHAT THAT CHANGED (the owner's plan B2, 2026-09-15)
 *   Plan A cut the donor's `<form>` out and left a slot. Plan B kept the whole
 *   of cinery's `section.section-contact-form` and refilled the form. Plan B2,
 *   which is what this file is: keep this site's existing two-column contact
 *   layout and its quote card, and swap ONLY the right column's form for
 *   cinery's form card. So the cut is narrower than it was — the card, not the
 *   section — and the Mono column supplies everything around it.
 *
 *   Dropped, and each one asserted below so a re-cut that changes shape fails
 *   loudly rather than shipping a second frame into a column that already has
 *   one:
 *
 *     by the anchors   `section.section-contact-form`, `.padding-global`,
 *                      `.container-large`, `.contact-form-block`, the
 *                      `.spacer-large` that closes the section and the
 *                      `.dividing-line` under it. The cut now starts at
 *                      `<div class="contact-form-wrapper w-form">` and ends on
 *                      the `</div>` that closes it; both anchors occur exactly
 *                      once in the donor page.
 *     in render()      `.form-heading` — 「◉ Ready to start your project?」.
 *                      Anchors cannot skip it (it is the card's first child, so
 *                      no cut that keeps the card's own tag can leave it out),
 *                      so it is removed as one exact element string, asserted
 *                      present exactly once before and gone after. It has to
 *                      go for a second reason as well: the Mono column's own
 *                      `p.top-text` already prints C.CONTACT.formLabel
 *                      (「(告诉我们你的公司)」) directly above this card, and
 *                      that is the string the heading would have carried. Left
 *                      in, the column would say it twice.
 *
 *   KEPT, against a literal reading of the instruction to drop "both
 *   .spacer-large": there are two in the donor section and only one of them is
 *   around the card. The other is INSIDE the form, between the message field
 *   and the submit (`.cn-spacer-large { padding-top: 3rem }`), and it is the
 *   only thing separating the two; dropping it glues the send button to the
 *   textarea. The one that closed the section is outside the new cut and is
 *   gone. Flagged in the hand-over rather than decided silently.
 *
 *   ALSO GONE: `donor.ground`. It painted `#000` on the block root because
 *   cinery's `<body>` was the only thing behind the section. The block is now a
 *   card that paints itself (`--primary-color--dark`, #232324), and the column
 *   it drops into is white — Mono's `.section { background-color:
 *   var(--color--first-color) }` resolves to `white`, with no override on this
 *   site. A black block root would have shown as four black notches outside the
 *   card's 2rem corner radius. The card's own `1px solid #ffffff1a` hairline
 *   effectively disappears against that white; that is cinery's border value
 *   meeting a lighter page than cinery's, it is cosmetic rather than a defect,
 *   and it is reported rather than restyled.
 *
 * ================= THE PART THAT IS WIRED TO A LIVE BACKEND =================
 *
 * This form posts to /api/contact (functions/api/contact.js, a Cloudflare Pages
 * Function that relays by e-mail) and is driven by js/stargo-forms.js. Every
 * selector either of those two files uses was read off the source and checked
 * against the markup this module emits:
 *
 *   js/stargo-forms.js                       where it lands here
 *   ------------------------------------     --------------------------------
 *   document.querySelectorAll('form')        the donor's own <form>, kept
 *   getAttribute('data-stargo-form')         NOT written here — tools/chrome.mjs
 *                                            stamps it onto every form on every
 *                                            page (chrome.mjs:381). See below.
 *   form.querySelector('textarea')           field-2, the message box
 *   form.querySelectorAll('input[type=       the Email field, exactly one
 *     "email"]')
 *   form.querySelector('input[name="name"]   the name field, exactly one
 *     :not([type=email]), input[name="Name"]
 *     :not([type=email])')
 *   form.querySelector('input[name=          the honeypot, added (see below)
 *     "website"]')
 *   form.querySelector('[type=submit]')      the donor's own submit input
 *   form.parentElement.querySelector(        the donor's two Webflow notices,
 *     '.w-form-done' / '.w-form-fail')       siblings of the form inside the
 *                                            card, which IS form.parentElement
 *   form.querySelector('.stargo-form-note')  added as the form's last child
 *   form.querySelectorAll('input, select,    the ten fields; `collect()` reads
 *     textarea') in collect()                a <select> by `options[i].text`,
 *                                            so the placeholder MUST be
 *                                            option 0 — it is, with value=""
 *   label[for="<el.id>"] in label()          every field carries id === name
 *                                            and its <label for> matches
 *
 *   functions/api/contact.js                 where it lands here
 *   ------------------------------------     --------------------------------
 *   data.form ∈ {contact, newsletter}        the client sends 'contact': a
 *                                            <textarea> is present, so the
 *                                            script's isNews test is false
 *                                            whatever data-stargo-form says
 *   data.website                             the honeypot's value
 *   fieldKey(f) === 'email', exactly one     only the Email field is
 *                                            type="email", so only it is sent
 *                                            with key 'email'
 *   fieldKey(f) === 'name', exactly one      only `name="name"` matches the
 *                                            script's /^name$/i. No other
 *                                            field's name normalises to 'name'
 *                                            or 'email' (fieldKey lowercases
 *                                            and strips spaces * ： : . _ -):
 *                                            subject, whatsapp, industry,
 *                                            markets, team, systems, field,
 *                                            field2 — checked, all distinct
 *   raw.length ≤ 40                          ten fields at most
 *   f.value.length ≤ 5000                    maxlength 256 on the eight inputs,
 *                                            5000 on the textarea
 *
 * WHY `data-stargo-form` IS NOT WRITTEN HERE
 *   It is load-bearing, and it is supplied. tools/chrome.mjs's `formMarkup`
 *   prepends `data-stargo-form="contact"` to every `<form>` on every page it
 *   builds, unconditionally, and this form does not match its newsletter test
 *   (`/id="Subscribe"/`). Writing it here as well produced the attribute twice
 *   on the built page — invalid markup whose second copy the parser discards
 *   anyway. chrome.mjs is in this repo and runs on this page, so the hook is
 *   not left to chance; it is simply not this file's to write. render() asserts
 *   the block does NOT carry it, so a future edit cannot reintroduce the
 *   duplicate quietly. `method="post" action="/api/contact"` IS written here,
 *   and does not duplicate: chrome.mjs only rewrites `method="get"`, which is
 *   gone by the time it looks.
 *
 * WHAT WAS ADDED TO THE DONOR (three things, all inside the form)
 *
 *   1. The honeypot, as the form's first child. js/stargo-forms.js reads
 *      `input[name="website"]` and, when it has a value, shows a bot the
 *      success notice and sends nothing; functions/api/contact.js does the same
 *      server-side with `data.website`. cinery ships no honeypot. The markup
 *      added is chrome.mjs's own honeypot string, byte for byte — which also
 *      means chrome.mjs will not add a second one (it adds its own only
 *      `if (!form.includes('name="website"'))`). Its variant rather than
 *      build-site.mjs's was chosen for two reasons: it carries no `id`, so it
 *      cannot collide with anything on the page it lands on, and it names the
 *      field in an `aria-label` rather than in a visible `<label>Website</label>`
 *      — which keeps the English word out of the Chinese page's text.
 *
 *   2. `<p class="stargo-form-note" role="status" aria-live="polite"></p>` as
 *      the form's last child. js/stargo-forms.js creates exactly this element
 *      when it cannot find one (`note()`), so the behaviour is unchanged; what
 *      changes is that the live region is in the document BEFORE it is written
 *      to, which is what a screen reader needs in order to announce the message
 *      at all — a region inserted with its text already in it is frequently not
 *      announced. It is empty, so it prints nothing in either language. Cost,
 *      stated plainly: css/stargo-fusion.css gives `.stargo-form-note`
 *      `margin-top: 12px`, so the card is 12px taller at rest than cinery's is.
 *      That is the only measurement in this block that is not the donor's.
 *
 *   3. (V6, 2026-09-16) `<p class="stargo-form-before">`, right after the
 *      status line: V5 P07's sentence that a demo request is not a confirmed
 *      meeting time. Static text, not a live region, and not a field — nothing
 *      in js/stargo-forms.js or functions/api/contact.js reads a <p>. Its small
 *      print size and spacing are the V6 G rule in css/stargo-fusion.css, set
 *      to match the consent line tools/chrome.mjs appends right after it. The
 *      privacy half of P07's note is that consent line already.
 *
 *   And one attribute is filled rather than added: the message box's
 *   `placeholder` (the donor ships it empty) carries V5 P07's example of what
 *   to write. cinery paints placeholders #222, which on this card's field is
 *   1.38:1 — the same mismatch the select's colour is repaired for in
 *   cn-contact.css — so the V6 G rule gives it cinery's own secondary neutral.
 *
 * WHAT WAS TAKEN OFF THE DONOR'S FORM (two attributes, and only these)
 *   `data-wf-page-id` and `data-wf-element-id`. They identify a page and an
 *   element in cinery's OWN Webflow project. They are inert while
 *   js/stargo-forms.js is running — it listens in the capture phase and calls
 *   `stopImmediatePropagation()`, so Webflow's own forms module never sees the
 *   submit — but if that script ever failed to load, Webflow's runtime would
 *   take the submit and post this site's visitors' names, e-mail addresses and
 *   company details to cinery's form endpoint. Leaving them in is a data leak
 *   waiting for one bad deploy. The donor's `id`, `name` and `data-name` on the
 *   form are kept exactly as cinery wrote them: they are inert here, they
 *   collide with nothing on this site, and removing them would be changing
 *   structure for no reason.
 *
 * ============================== THE TEN FIELDS ==============================
 *
 * cinery ships four label+input units; this site needs ten. Not one of them is
 * hand-written: `splitRepeat()` cuts the donor's own unit out of the fragment
 * and each field is that unit re-emitted with its `for`, `id`, `name`,
 * `data-name` and label text rewritten. Three donor units are used as bases,
 * because the donor drew three shapes:
 *
 *   units[0]  Name             <input type="text">            → the seven plain
 *                                                               text fields and
 *                                                               the select
 *   units[1]  Email Address    <input type="email" required>  → Email
 *   units[3]  Message          <input class="…is-text-area">  → field-2
 *
 * and the `.spacer-small` that separates them is the donor's own, re-emitted
 * nine times where cinery emits it three, so the rhythm of the card is exactly
 * cinery's rhythm with more of it.
 *
 *   #   name       label (copy.mjs)          control
 *   --  ---------  ------------------------  --------------------------------
 *   1   name       CONTACT.fields.name       input type=text
 *   2   Email      CONTACT.fields.email      input type=email required
 *   3   Subject    CONTACT.fields.company    input type=text
 *   4   whatsapp   CONTACT.fields.whatsapp   input type=text
 *   5   industry   CONTACT.fields.industry   input type=text
 *   6   markets    CONTACT.fields.markets    input type=text
 *   7   team       CONTACT.fields.team       input type=text
 *   8   systems    CONTACT.fields.systems    input type=text
 *   9   field      CONTACT.fields.category   select, CONTACT.selectPlaceholder
 *                                            + the twelve CONTACT.options
 *   10  field-2    CONTACT.fields.message    textarea
 *
 * Every `name`, every `id` and every label is the one this site's own contact
 * form already uses (tools/build-site.mjs, PAGES['contact.html']), so the two
 * forms are the same form in different clothes and the Function reads exactly
 * the keys it reads today. No label is invented: all ten come out of
 * `C.CONTACT.fields`, and a missing key throws rather than printing nothing.
 *
 * THE THREE PLACES THE DONOR'S OWN SHAPE COULD NOT BE KEPT VERBATIM
 *   Each is a consequence of the field set, which is the one thing the brief
 *   says may change; each is derived from a donor unit rather than typed.
 *
 *   the select   cinery has no `<select>` anywhere in its export — so the
 *                `<input>` of units[0] is re-tagged `<select>`, its
 *                `maxlength`, `placeholder` and `type` (none of which a select
 *                may carry) are dropped, and the thirteen `<option>`s are
 *                written from C.CONTACT.selectPlaceholder and C.CONTACT.options
 *                exactly as tools/build-site.mjs writes them (`value=""` then
 *                `value="1"`…`"12"`). The options are the only elements in this
 *                block that are not a donor element, and there is no donor
 *                element they could have been cloned from.
 *                Its class becomes `cn-form-input is-select-input w-select`:
 *                  · `cn-form-input`   the donor's, unchanged;
 *                  · `is-select-input` cinery's own, and it exists for exactly
 *                    this — `.form-input.is-select-input { color: #222 }` at
 *                    tools/templates/cinery/css/cinery.app.shared.3e3418b8f.css:3489,
 *                    which reaches the generated sheet as
 *                    `.cn-contact .cn-form-input.is-select-input` at
 *                    css/cinery.cn2.css:2664. No cinery markup anywhere wears
 *                    it, because cinery has no select. It is spelled WITHOUT
 *                    the `cn-` prefix on purpose: tools/donor-lib.mjs
 *                    namespaces only the classes it finds in the cut,
 *                    `is-select-input` was never in any cut, so the rule
 *                    reached the sheet with its second half untouched. The
 *                    colour that rule sets is repaired in
 *                    tools/blocks/cn-contact.css — measured, reasoned and
 *                    recorded there, not here.
 *                  · `w-select` instead of `w-input`: Webflow's own class for a
 *                    select, and the sheet styles the two identically
 *                    (`.cn-contact .w-input, .cn-contact .w-select {…}`, and the
 *                    same pairing for `::placeholder`, `:focus`, `[disabled]`),
 *                    so this changes nothing that is drawn. Same class this
 *                    site's own select wears today.
 *   the textarea the brief asks for a real `<textarea>`; cinery draws its
 *                message field as an `<input>` wearing `.is-text-area` (2rem /
 *                4rem of padding and `min-height: auto`). units[3] is re-tagged
 *                `<textarea>…</textarea>` and keeps that class, so it is drawn
 *                with the donor's own padding; Webflow's `textarea.w-input
 *                { height: auto }` is already in the sheet, and two default rows
 *                plus 6rem of donor padding land within a couple of pixels of
 *                the height the donor's input has. `type` and `required` are
 *                dropped (a textarea has neither; the donor's `required` would
 *                have made this site's optional message box mandatory).
 *   maxlength    256 on the eight inputs, the donor's own number. On the
 *                textarea it becomes 5000 — the number this site's own message
 *                field uses and the exact ceiling functions/api/contact.js
 *                enforces (`f.value.length > 5000` → 422). Shipping a 256
 *                character limit on the one field a buyer writes a paragraph
 *                into would be a working form that quietly truncates.
 *
 * WHAT WAS NOT ADDED
 *   `is-form-submit`. The sheet carries `.cn-contact .cn-button.is-form-submit
 *   { width: 100% }` — but `.cn-contact .cn-button` ALREADY sets `width: 100%`,
 *   so the class adds nothing that is drawn, and cinery's own submit is
 *   `class="button w-button"` with no trace of it.
 *   `autocomplete` / `aria-label` on the name, Email and Subject inputs.
 *   chrome.mjs's `formMarkup` adds those three, keyed on `type="email"`,
 *   `name="[Nn]ame"` and `name="(Subject|Last-Name)"` — all of which this form
 *   matches. Writing them here would duplicate them.
 *   `.stargo-form-consent`. chrome.mjs appends that paragraph before `</form>`
 *   on every form on the site. Same reason.
 *
 * THE WORDS
 *   Every string is resolved against tools/copy.mjs; none is written here.
 *
 *     the ten labels         C.CONTACT.fields.*
 *     the select             C.CONTACT.selectPlaceholder + C.CONTACT.options
 *     the submit             C.CONTACT.submit (「提交演示需求」 / "Send Demo
 *                            Request" since V6; nothing keys on the value —
 *                            js/stargo-forms.js finds it by [type=submit])
 *     the message hint       C.CONTACT.messageHint, in the textarea's placeholder
 *     the note under it      C.CONTACT.beforeSubmit
 *     .form-message-success  "Thank you! Your submission has been received!"
 *     .form-message-error    "Oops! Something went wrong while submitting the
 *                             form."
 *
 *   C.CONTACT.formLabel is NOT printed by this block any more — the Mono
 *   column's own `p.top-text` prints it immediately above the card, and the
 *   donor heading that used to carry it is dropped.
 *
 *   The two notices are Webflow's factory defaults, word for word — the Mōno
 *   template this site is otherwise built from ships the same two sentences,
 *   and copy.mjs's CHROME table already carries this site's translation of
 *   each, keyed by that exact English. They are looked up by that key, so this
 *   block cannot say something different from the rest of the site and a rename
 *   in copy.mjs fails the build here instead of quietly shipping Webflow's own
 *   words. (js/stargo-forms.js overwrites the success notice at run time with
 *   its own sentence; these are what stands in the markup.)
 *
 *   `data-wait="Please wait..."` is left on the submit exactly as cinery wrote
 *   it: CHROME carries a row keyed on that whole attribute and tools/chrome.mjs
 *   translates it site-wide, the same way it does for every other donor form.
 *
 * ONE LANGUAGE PER PAGE
 *   「不是所有的观众都能看得懂英文」. render() ends on the same guard cn-about
 *   ends on rather than cn-service's blanket one, because this block's Chinese
 *   copy legitimately carries product names — WhatsApp, AI, CRM, PI, SEO, GEO,
 *   STARGO WORK — inside C.CONTACT.fields and C.CONTACT.options. The guard
 *   names any Latin word that is not one of those instead of only saying that
 *   something was found.
 *
 * MOTION
 *   None, and it is checked rather than assumed: the cut holds no `data-w-id`,
 *   so no IX2 event and no action list binds to it, and cinery's contact.html
 *   has no inline GSAP (its three inline scripts are Webflow's `w-mod-js` stamp,
 *   a JSON-LD ContactPage block and the `w-mod-ix` stamp). This block ships no
 *   .js and tools/blocks/cn-contact.css replays no keyframes.
 *
 * IMAGES
 *   None. The cut has no `<img>`, no `<video>` and no background image; the
 *   only off-origin urls in it are cinery's own Overused Grotesk woff2 faces,
 *   which come from the donor's stylesheet and are already mirrored for
 *   cn-service, cn-faq and cn-produce. `mirror` stays at its default.
 */
import { setText, splitRepeat, DONORS } from '../block-lib.mjs';

export const donor = {
  id: 'cn-contact',
  donor: 'cinery',
  scope: '.cn-contact',
  /* cinery's contact page, copied verbatim from the owner's template at
     F:/stargo 网站/tpl4/cinery/contact.html. It is the only cinery page that has
     a contact form on it, and the only cinery page no other block cuts from. */
  page: 'contact.html',

  /* THE CARD, and nothing around it. Plan B2 drops this into a column of this
     site's existing contact layout, which already has a frame, a heading and
     its own spacing, so cinery's `section.section-contact-form`, its
     `.padding-global` / `.container-large` gutters, the `.contact-form-block`
     that centred and lifted the card, the `.spacer-large` that closed the
     section and the `.dividing-line` under it are all outside these anchors.
     Both strings occur exactly once in contact.html (checked), and the end
     anchor's three closing divs are the notice's inner div, the notice, and
     `.contact-form-wrapper` itself — the fourth `</div>` in the donor, which
     closes `.contact-form-block`, is deliberately left behind. */
  start: '<div class="contact-form-wrapper w-form">',
  end: '<div class="form-message-error w-form-fail"><div>Oops! Something went wrong while submitting the form.</div></div></div>',

  /* No `ground`. The card paints itself `--primary-color--dark` (#232324) and
     the Mono column it lands in is white (`.section { background-color:
     var(--color--first-color) }`), so painting the block root black would show
     as four notches outside the card's 2rem corner radius. See the header. */
};

/* The donor's own copy, verbatim, so a re-cut that changes any of it fails here
   instead of shipping Webflow's factory words to production. The two notices
   are also the keys their translations are filed under in copy.mjs's CHROME
   table — the Mōno template this site is built from ships the identical
   sentences, which is why one table already covers both donors. */
const DONOR_HEADING = '◉ Ready to start your project?';
const DONOR_SUCCESS = 'Thank you! Your submission has been received!';
const DONOR_FAIL = 'Oops! Something went wrong while submitting the form.';
const DONOR_SUBMIT = 'Send Message';
/** The donor's four field labels, in the order it draws them. */
const DONOR_LABELS = ['Name', 'Email Address', 'Subject', 'Message'];

/** The card's first child, dropped whole — see the header for the two reasons. */
const HEADING_EL = `<div class="cn-form-heading">${DONOR_HEADING}</div>`;
/** What the cut must open on once the heading is out of it. */
const CARD_OPEN = '<div class="cn-contact-form-wrapper w-form">';

/** The donor's own separators. Re-emitted, never re-measured. */
const SPACER_SMALL = '<div class="cn-spacer-small"></div>';
const SPACER_LARGE = '<div class="cn-spacer-large"></div>';

/**
 * The honeypot, spelled exactly as tools/chrome.mjs:381 spells it — which is
 * also why chrome.mjs will not add a second one. No `id` (nothing to collide
 * with), and the word "Website" lives in an `aria-label`, not in a visible
 * label, so it never reaches the Chinese page's text.
 */
const HONEYPOT = '<div class="stargo-hp" aria-hidden="true"><input aria-label="Website" name="website" type="text" tabindex="-1" autocomplete="off"/></div>';

/**
 * The live region js/stargo-forms.js writes its non-success messages into,
 * exactly as that script would create it (`note()`: className, role, aria-live,
 * appended to the form). Present up front so a screen reader is already
 * observing it when the text arrives.
 */
const NOTE = '<p class="stargo-form-note" role="status" aria-live="polite"></p>';

/**
 * V5 P07's note that a demo request is not a booked meeting (V6, 2026-09-16).
 * Static small print, styled beside the consent line by the V6 G rule in
 * css/stargo-fusion.css. Not a live region: it never changes.
 */
const BEFORE_OPEN = '<p class="stargo-form-before">';

/**
 * The ten fields, in the order the card draws them.
 *
 *   name      the `name` attribute — what functions/api/contact.js reads, and
 *             also the `id`, so `label[for]` resolves for js/stargo-forms.js's
 *             `label()`. Identical to this site's own contact form.
 *   copy      the key in C.CONTACT.fields the label comes from. Nothing here
 *             is a string: a missing key throws.
 *   dataName  Webflow's own `data-name`, matched to what this site's contact
 *             page already sends, so the two forms look alike in the export.
 *   unit      which donor unit the field is cloned from.
 */
const FIELDS = [
  { name: 'name', copy: 'name', dataName: 'Name', unit: 'text' },
  { name: 'Email', copy: 'email', dataName: 'Email', unit: 'email' },
  { name: 'Subject', copy: 'company', dataName: 'Subject', unit: 'text' },
  { name: 'whatsapp', copy: 'whatsapp', dataName: 'whatsapp', unit: 'text' },
  { name: 'industry', copy: 'industry', dataName: 'industry', unit: 'text' },
  { name: 'markets', copy: 'markets', dataName: 'markets', unit: 'text' },
  { name: 'team', copy: 'team', dataName: 'team', unit: 'text' },
  { name: 'systems', copy: 'systems', dataName: 'systems', unit: 'text' },
  { name: 'field', copy: 'category', dataName: 'Field', unit: 'select' },
  { name: 'field-2', copy: 'message', dataName: 'Field 2', unit: 'area' },
];

/** Everything the narrower cut must no longer contain. */
const DROPPED = [
  ['<section', 'cinery\'s section frame'],
  ['cn-section-contact-form', 'cinery\'s section frame'],
  ['cn-padding-global', 'cinery\'s page gutters'],
  ['cn-container-large', 'cinery\'s 100rem measure'],
  ['cn-contact-form-block', 'cinery\'s centring and its lift over the header wheel'],
  ['cn-dividing-line', 'the rule that closed cinery\'s section'],
  ['cn-form-heading', 'the card heading; the Mono column\'s own p.top-text says it'],
];

/**
 * Latin that is allowed to stand on the Chinese page: product names, which the
 * brief exempts. C.CONTACT.fields and C.CONTACT.options carry seven of them in
 * their Chinese forms, so the blanket "no Latin word on the zh page" assertion
 * cn-service ends on cannot be used verbatim here; the check below names what
 * survived instead of only saying that something did.
 */
const PRODUCT_WORDS = new Set(['STARGO', 'WORK', 'WHATSAPP', 'AI', 'CRM', 'PI', 'SEO', 'GEO', 'SKU', 'OS', 'QC']);

/* ------------------------------------------------------ tiny tag surgery -- */

/* Attribute edits are matched on ` name="…"` with the leading space, not on
   `name="…"`: `data-name="…"` ends in the same six characters, and a looser
   pattern would rewrite the wrong half of the donor's own input. Every one of
   these throws when it does not fire, because a silent miss here is a field
   that carries cinery's `name` to our Function. */
const attrRe = (k) => new RegExp(`\\s${k}="[^"]*"`);

function put(tag, k, v, what) {
  const re = attrRe(k);
  if (!re.test(tag)) throw new Error(`cn-contact: ${what} has no ${k}= to rewrite — expected one, found none in ${tag.slice(0, 90)}`);
  return tag.replace(re, ` ${k}="${v}"`);
}

function drop(tag, k, what) {
  const re = attrRe(k);
  if (!re.test(tag)) throw new Error(`cn-contact: ${what} has no ${k}= to drop — expected one, found none in ${tag.slice(0, 90)}`);
  return tag.replace(re, '');
}

/** `<label …>…</label><input …/>` → its two halves, or a throw. */
function splitUnit(unit, which) {
  const at = unit.indexOf('<input');
  if (at < 0) throw new Error(`cn-contact: the donor's ${which} unit has no <input in it: ${unit.slice(0, 90)}`);
  const label = unit.slice(0, at);
  const control = unit.slice(at);
  if (!label.startsWith('<label for="') || !label.includes('class="cn-form-label"')) {
    throw new Error(`cn-contact: expected the ${which} unit to open on <label for="…" class="cn-form-label">, found ${label.slice(0, 90)}`);
  }
  if (!/^<input\b[^>]*\/>$/.test(control)) {
    throw new Error(`cn-contact: expected the ${which} unit's control to be one self-closing <input…/>, found ${control.slice(0, 90)}`);
  }
  return { label, control };
}

/**
 * One of copy.mjs's CHROME rows, by the donor English it is filed under.
 *
 * CHROME is this site's donor-string table: `[donor text, {zh, en}]`. Reading
 * the two Webflow notices out of it rather than writing them here is what keeps
 * this card saying the same thing as every other form on the site — the footer
 * newsletter and this site's own contact form both take their notices from the
 * same two rows — and makes a rename in copy.mjs a build failure here rather
 * than a silent divergence.
 */
function chrome(C, key) {
  const row = C.CHROME.find((r) => r[0] === key);
  if (!row) {
    throw new Error(
      `cn-contact: copy.mjs CHROME has no row keyed "${key}". `
      + 'That string is one of Webflow\'s two form-state notices and both donors ship it '
      + 'verbatim; if it was renamed, point this block at the new key rather than typing '
      + 'the sentence in here.');
  }
  return row[1];
}

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-contact: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-contact: donor ${donor.donor} is not registered`);

  const K = C.CONTACT;
  if (!K?.fields || !K?.options || !K?.selectPlaceholder || !K?.submit || !K?.messageHint || !K?.beforeSubmit) {
    throw new Error('cn-contact: copy.mjs CONTACT needs fields, options, selectPlaceholder, submit, messageHint and beforeSubmit');
  }
  for (const f of FIELDS) {
    if (!K.fields[f.copy]) throw new Error(`cn-contact: copy.mjs CONTACT.fields has no "${f.copy}" for the ${f.name} field`);
  }

  /* ------------------------------------------------- is this the shape? -- */

  /* Everything below assumes ONE card holding one form, four label+input units
     and two notices — and nothing around it. Say so out loud: a silent miss
     ships cinery's own four fields, and a field that keeps cinery's `name`
     reaches our Function as a key it does not know. */
  if (!frag.startsWith(CARD_OPEN)) {
    throw new Error(`cn-contact: expected the cut to open on ${CARD_OPEN}, found ${frag.slice(0, 90)} — the anchors no longer cut the card alone`);
  }
  if (!frag.endsWith('</div>')) throw new Error('cn-contact: expected the cut to end on the card\'s own </div>');
  const cards = (frag.match(/class="cn-contact-form-wrapper w-form"/g) ?? []).length;
  if (cards !== 1) throw new Error(`cn-contact: expected one .contact-form-wrapper.w-form card, found ${cards}`);
  /* The section frame is outside the anchors now. Prove it rather than trust
     it: any of these back in the cut means a second frame inside a Mono column
     that already has one. `cn-form-heading` is checked again after it is
     removed below; here it must still be present exactly once. */
  for (const [needle, what] of DROPPED) {
    if (needle === 'cn-form-heading') continue;
    if (frag.includes(needle)) throw new Error(`cn-contact: ${needle} is back in the cut (${what}); plan B2 drops into a column that supplies its own frame`);
  }
  const opens = (frag.match(/<form\b/g) ?? []).length;
  const closes = (frag.match(/<\/form>/g) ?? []).length;
  if (opens !== 1 || closes !== 1) {
    throw new Error(`cn-contact: expected exactly one <form>…</form>, found ${opens} open / ${closes} close`);
  }
  if (!frag.includes('class="cn-contact-form"')) {
    throw new Error('cn-contact: the form in the cut is not the donor\'s .contact-form — the cut has changed shape');
  }
  for (const label of DONOR_LABELS) {
    if (!frag.includes(`class="cn-form-label">${label}</label>`)) {
      throw new Error(`cn-contact: the donor's "${label}" field is not where it was; the form may now reach outside <form>`);
    }
  }
  for (const [what, s] of [['heading', DONOR_HEADING], ['success notice', DONOR_SUCCESS], ['error notice', DONOR_FAIL], ['submit value', DONOR_SUBMIT]]) {
    const n = frag.split(s).length - 1;
    if (n !== 1) throw new Error(`cn-contact: expected the donor's ${what} once, found ${n}: ${s}`);
  }
  /* Exactly one now, and it is the one INSIDE the form, between the message
     field and the submit. The section's own closing spacer is outside the
     anchors; this one is the only thing holding the send button off the
     textarea and it stays. */
  const larges = frag.split(SPACER_LARGE).length - 1;
  if (larges !== 1) throw new Error(`cn-contact: expected exactly one ${SPACER_LARGE} — the one inside the form, above the submit — found ${larges}`);
  if (frag.indexOf(SPACER_LARGE) > frag.indexOf('</form>')) {
    throw new Error('cn-contact: the .spacer-large is outside the form; the one this block keeps is the gap above the submit');
  }
  /* No interaction binds to this block, and the .css is written on that basis
     (it replays no motion). If cinery ever grows one here, this fails rather
     than shipping a block whose animation silently does not run. */
  const wids = (frag.match(/data-w-id="/g) ?? []).length;
  if (wids) throw new Error(`cn-contact: the cut has grown ${wids} data-w-id — its interactions are not replayed anywhere`);
  /* The block is type on a ground; nothing here is a picture. */
  if (/<img\b|<video\b|background-image/i.test(frag)) {
    throw new Error('cn-contact: the cut has grown an image; the block ships none and mirrors none');
  }

  /* --------------------------------------------------- drop the heading -- */

  /* The card's first child, and the one thing inside the cut that plan B2 does
     not want: the Mono column's own p.top-text already prints
     C.CONTACT.formLabel directly above this card. Removed as one exact element
     string — asserted present exactly once above, asserted gone below — rather
     than by a regex that could eat the form with it. */
  if (!frag.startsWith(CARD_OPEN + HEADING_EL)) {
    throw new Error(`cn-contact: expected .form-heading to be the card's first child, found ${frag.slice(CARD_OPEN.length, CARD_OPEN.length + 90)}`);
  }
  let html = frag.split(HEADING_EL).join('');

  /* ------------------------------------- the donor's own repeating unit -- */

  /* Four units, all opening on `<label for="` — which appears nowhere else in
     the cut. The run is closed at the `.spacer-large` above the submit, because
     splitRepeat's default guess (the first unit's length) would land inside the
     Message unit, which is longer than the other three. */
  const closeAt = html.indexOf(SPACER_LARGE);
  if (closeAt < 0) throw new Error('cn-contact: the form has no .spacer-large above its submit to close the field run at');
  const { head, units, tail } = splitRepeat(html, '<label for="', closeAt);
  if (units.length !== 4) throw new Error(`cn-contact: expected the donor's four label+input units, found ${units.length}`);
  for (let i = 0; i < 3; i++) {
    if (!units[i].endsWith(SPACER_SMALL)) {
      throw new Error(`cn-contact: expected donor unit ${i + 1} to end on ${SPACER_SMALL}, found …${units[i].slice(-60)}`);
    }
  }
  if (units[3].includes(SPACER_SMALL)) throw new Error('cn-contact: the last donor unit was expected to carry no spacer of its own');
  /* The three shapes cinery drew, with their spacers taken off so the run can
     be re-joined with exactly as many spacers as there are gaps. */
  const BASE = {
    text: units[0].slice(0, -SPACER_SMALL.length),
    email: units[1].slice(0, -SPACER_SMALL.length),
    select: units[0].slice(0, -SPACER_SMALL.length),
    area: units[3],
  };

  /* ------------------------------------------------------- the options -- */

  /* The one part of this block with no donor element behind it: cinery has no
     <select> anywhere in its export, so there is nothing to clone. Written the
     way tools/build-site.mjs writes the same list — an empty value on the
     placeholder (js/stargo-forms.js's collect() reads a select by
     `options[selectedIndex].text` and skips index 0, so the placeholder must be
     first and must be selected), then 1…12. */
  if (K.options.length !== 12) {
    throw new Error(`cn-contact: expected copy.mjs CONTACT.options to hold the twelve workflow entry points, found ${K.options.length}`);
  }
  const options = `<option value="">${escapeHtml(t(K.selectPlaceholder))}</option>`
    + K.options.map((o, i) => `<option value="${i + 1}">${escapeHtml(t(o))}</option>`).join('');

  /* --------------------------------------------------------- the fields -- */

  const built = FIELDS.map((f) => {
    let { label, control } = splitUnit(BASE[f.unit], f.name);
    const where = `the ${f.name} field`;

    label = put(label, 'for', f.name, where);
    label = setText(label, 'cn-form-label', escapeHtml(t(K.fields[f.copy])));

    control = put(control, 'name', f.name, where);
    control = put(control, 'id', f.name, where);
    control = put(control, 'data-name', f.dataName, where);

    if (f.unit === 'text') {
      /* The donor's plain text input, and nothing about it changes but its
         identity. `required` is not added: only Email is required on this site,
         and js/stargo-forms.js calls form.checkValidity() — a `required` on an
         optional field would block the submit with no message of its own. */
      if (!/\stype="text"/.test(control)) throw new Error(`cn-contact: ${where} was cloned from a unit that is not type="text": ${control.slice(0, 90)}`);
      if (/\srequired=/.test(control)) throw new Error(`cn-contact: ${where} was cloned from a required unit; only Email is required here`);
    } else if (f.unit === 'email') {
      /* Kept exactly as cinery drew it. `type="email"` is what
         js/stargo-forms.js finds the address by and what makes the client send
         this field under the key the Function matches on. */
      if (!/\stype="email"/.test(control)) throw new Error(`cn-contact: ${where} was cloned from a unit that is not type="email": ${control.slice(0, 90)}`);
      if (!/\srequired="/.test(control)) throw new Error(`cn-contact: ${where} lost the donor's required=`);
    } else if (f.unit === 'select') {
      const cls = (control.match(/\sclass="([^"]*)"/) ?? [])[1];
      if (cls !== 'cn-form-input w-input') {
        throw new Error(`cn-contact: expected the donor's text unit to wear class="cn-form-input w-input", found "${cls}" — the select is derived from it`);
      }
      control = drop(control, 'maxlength', where);
      control = drop(control, 'placeholder', where);
      control = drop(control, 'type', where);
      control = put(control, 'class', 'cn-form-input is-select-input w-select', where);
      control = `${control.replace(/^<input\b/, '<select').replace(/\s*\/>$/, '>')}${options}</select>`;
    } else if (f.unit === 'area') {
      const cls = (control.match(/\sclass="([^"]*)"/) ?? [])[1];
      if (cls !== 'cn-form-input cn-is-text-area w-input') {
        throw new Error(`cn-contact: expected the donor's message unit to wear class="cn-form-input cn-is-text-area w-input", found "${cls}"`);
      }
      control = drop(control, 'required', where);
      control = drop(control, 'type', where);
      /* 5000 is functions/api/contact.js's own ceiling and this site's own
         number for this field; the donor's 256 would truncate a paragraph. */
      control = put(control, 'maxlength', '5000', where);
      /* V5 P07's example of what to write. The donor ships `placeholder=""`,
         so this fills an attribute that is already there. It is a hint only:
         js/stargo-forms.js names a field by its <label> and reads `.value`,
         so the placeholder never reaches the submission. cinery colours
         placeholders #222, which is unreadable on this field — see the V6 G
         rule in css/stargo-fusion.css. */
      control = put(control, 'placeholder', escapeHtml(t(K.messageHint)), where);
      control = `${control.replace(/^<input\b/, '<textarea').replace(/\s*\/>$/, '>')}</textarea>`;
    } else {
      throw new Error(`cn-contact: ${where} asks for unit shape "${f.unit}", which this block does not draw`);
    }
    return label + control;
  });

  /* ----------------------------------------------------- the form's tag -- */

  /* The donor's own <form>, rewritten where it has to be and nowhere else:
     where it posts, and the two Webflow ids that name cinery's project (see
     the header — leaving them in is a data leak waiting for a bad deploy).
     `data-stargo-form` is NOT written here; tools/chrome.mjs stamps it onto
     every form on every page, and writing it twice is invalid markup. */
  const openAt = head.indexOf('<form ');
  const openEnd = head.indexOf('>', openAt) + 1;
  if (openAt < 0 || openEnd <= openAt) throw new Error('cn-contact: the cut has no <form …> tag to wire up');
  let tag = head.slice(openAt, openEnd);
  if (!/\smethod="get"/.test(tag)) {
    throw new Error(`cn-contact: expected the donor form's method="get" to point at /api/contact, found ${tag}`);
  }
  tag = tag.replace(/\smethod="get"/, ' method="post" action="/api/contact"');
  tag = drop(tag, 'data-wf-page-id', 'the donor form');
  tag = drop(tag, 'data-wf-element-id', 'the donor form');

  html = head.slice(0, openAt) + tag + HONEYPOT + built.join(SPACER_SMALL) + tail;

  /* ------------------------------------------- the submit, and the note -- */

  html = html.replace(`value="${DONOR_SUBMIT}"`, `value="${escapeHtml(t(K.submit))}"`);
  /* The status line first, so js/stargo-forms.js's messages land right under
     the button; then V5 P07's before-submission sentence. tools/chrome.mjs
     appends the consent line after both, so the two sentences of small print
     read together. */
  html = html.replace('</form>', `${NOTE}${BEFORE_OPEN}${escapeHtml(t(K.beforeSubmit))}</p></form>`);

  /* --------------------------------------------------- the two notices -- */

  /* Not setText: each notice is a `<div class="form-message-…"><div>…</div></div>`
     and setText's regex closes on the first `</div>` it meets, which is the
     inner one — it would eat the inner element and leave its close tag behind.
     The sentences are unique in the cut (asserted above), so replacing the text
     itself changes the words and touches no tag, no class and no attribute. */
  html = html.split(DONOR_SUCCESS).join(escapeHtml(t(chrome(C, DONOR_SUCCESS))));
  html = html.split(DONOR_FAIL).join(escapeHtml(t(chrome(C, DONOR_FAIL))));

  /* ================= did every load-bearing hook actually land? ========== */

  /* Counted against the markup that is about to be returned, not against
     intentions. Each message says what was expected and what was found, because
     a form that looks right and silently stops submitting is the failure this
     whole block is written around. */

  const once = (needle, why) => {
    const n = html.split(needle).length - 1;
    if (n !== 1) throw new Error(`cn-contact: expected ${needle} exactly once, found ${n} — ${why}`);
  };
  /* An attribute, counted with its leading space, so `name="Subject"` is not
     also found inside `data-name="Subject"` — six of the ten fields carry the
     same word in both, and a plain substring count says two every time. */
  const onceAttr = (k, v, why) => {
    const n = (html.match(new RegExp(`\\s${k}="${v.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&')}"`, 'g')) ?? []).length;
    if (n !== 1) throw new Error(`cn-contact: expected ${k}="${v}" exactly once, found ${n} — ${why}`);
  };

  /* ONE root element, and it is the card — this is what makes the block a
     drop-in for `div.form-amin > div.margin-40 > div.w-form`. Walked rather
     than pattern-matched: the first <div must close on the last character. */
  if (!html.startsWith(CARD_OPEN)) throw new Error(`cn-contact: the block must open on ${CARD_OPEN}, found ${html.slice(0, 90)}`);
  {
    let depth = 0;
    let closedAt = -1;
    for (const m of html.matchAll(/<div\b|<\/div>/g)) {
      depth += m[0] === '</div>' ? -1 : 1;
      if (depth <= 0) { closedAt = m.index + m[0].length; break; }
    }
    if (depth !== 0 || closedAt !== html.length) {
      throw new Error(`cn-contact: the block must be one root element; its first <div closes at ${closedAt} of ${html.length}`);
    }
  }
  /* Everything plan B2 drops, proved gone in the rendered block. */
  for (const [needle, what] of DROPPED) {
    if (html.includes(needle)) throw new Error(`cn-contact: ${needle} survived (${what}) — this block must be the card alone`);
  }
  if (html.includes(DONOR_HEADING)) throw new Error('cn-contact: the donor heading\'s words survived the element being dropped');

  /* the form element itself */
  once('method="post"', 'a GET would put the visitor\'s details in the url and the Function only answers POST');
  once('action="/api/contact"', 'that is the Cloudflare Function that relays the mail');
  if (html.includes('data-stargo-form')) {
    throw new Error('cn-contact: the block must NOT carry data-stargo-form — tools/chrome.mjs stamps it onto every form, and writing it here duplicates the attribute');
  }
  for (const attr of ['data-wf-page-id', 'data-wf-element-id']) {
    if (html.includes(attr)) throw new Error(`cn-contact: ${attr} survived — it names cinery's own Webflow project, not ours`);
  }

  /* the ten names the Function reads */
  const labels = (html.match(/class="cn-form-label"/g) ?? []).length;
  if (labels !== FIELDS.length) throw new Error(`cn-contact: expected ${FIELDS.length} .form-label units, found ${labels}`);
  for (const f of FIELDS) {
    onceAttr('name', f.name, 'functions/api/contact.js keys this field on its name attribute');
    if (!html.includes(`<label for="${f.name}" class="cn-form-label">`)) {
      throw new Error(`cn-contact: the ${f.name} field has no <label for="${f.name}"> — js/stargo-forms.js names a field by it when it mails the submission`);
    }
    onceAttr('id', f.name, 'the label above it is bound to the control by this id');
  }
  /* Exactly one field may resolve to each of the Function's two required keys,
     or it answers 422 and nothing is ever sent. */
  const emails = (html.match(/\stype="email"/g) ?? []).length;
  if (emails !== 1) throw new Error(`cn-contact: expected exactly one type="email" control, found ${emails} — functions/api/contact.js rejects a submission with any other number`);
  const names = (html.match(/\sname="[Nn]ame"/g) ?? []).length;
  if (names !== 1) throw new Error(`cn-contact: expected exactly one input[name="name"], found ${names} — js/stargo-forms.js queries for it and the Function requires exactly one`);

  /* the controls */
  const inputs = (html.match(/<input\b/g) ?? []).length;
  if (inputs !== 10) throw new Error(`cn-contact: expected ten <input> (eight fields, the honeypot and the submit), found ${inputs}`);
  for (const [open, close] of [['<select', '</select>'], ['<textarea', '</textarea>']]) {
    const a = (html.match(new RegExp(open, 'g')) ?? []).length;
    const b = html.split(close).length - 1;
    if (a !== 1 || b !== 1) throw new Error(`cn-contact: expected one ${open}…${close}, found ${a} open / ${b} close`);
  }
  const opts = (html.match(/<option\b/g) ?? []).length;
  if (opts !== K.options.length + 1) throw new Error(`cn-contact: expected ${K.options.length + 1} <option> (the placeholder and the twelve entry points), found ${opts}`);
  if (!/<select[^>]*><option value="">/.test(html)) {
    throw new Error('cn-contact: the placeholder is not the select\'s first option — js/stargo-forms.js skips index 0 and would send the placeholder as an answer');
  }
  /* The one donor spacer this block keeps, still doing its job. */
  once(SPACER_LARGE, 'it is the gap between the message field and the send button');
  if (html.indexOf(SPACER_LARGE) > html.indexOf('</form>')) throw new Error('cn-contact: the .spacer-large left the form');
  const smalls = html.split(SPACER_SMALL).length - 1;
  if (smalls !== FIELDS.length - 1) throw new Error(`cn-contact: expected ${FIELDS.length - 1} ${SPACER_SMALL} between ${FIELDS.length} fields, found ${smalls}`);
  onceAttr('type', 'submit', 'js/stargo-forms.js disables [type=submit] while a request is in flight');
  onceAttr('name', 'website', 'js/stargo-forms.js and functions/api/contact.js both read the honeypot');
  once('class="stargo-hp"', 'the honeypot must stay off-screen, not merely be present');
  once(NOTE, 'js/stargo-forms.js writes every non-success message into .stargo-form-note');
  once(BEFORE_OPEN, 'the demo-request note (V5 P07) sits under the button, once');
  if (html.indexOf(BEFORE_OPEN) < html.indexOf(NOTE) || html.indexOf(BEFORE_OPEN) > html.indexOf('</form>')) {
    throw new Error('cn-contact: the demo-request note must follow the status line and stay inside the form');
  }
  /* The one placeholder this block fills, on the one field it belongs to. */
  const hinted = [...html.matchAll(/<(input|textarea)\b[^>]*\splaceholder="([^"]+)"/g)];
  if (hinted.length !== 1 || hinted[0][1] !== 'textarea') {
    throw new Error(`cn-contact: expected exactly one filled placeholder, on the message box — found ${hinted.map((m) => m[1]).join(', ') || 'none'}`);
  }

  /* the card around it */
  for (const notice of ['class="cn-form-message-success w-form-done"', 'class="cn-form-message-error w-form-fail"']) {
    once(notice, 'js/stargo-forms.js reaches both through form.parentElement, and Webflow\'s own runtime looks in the same place');
  }
  const closeForm = html.indexOf('</form>');
  for (const notice of ['w-form-done', 'w-form-fail']) {
    if (html.indexOf(notice) < closeForm) throw new Error(`cn-contact: .${notice} is inside the form; js/stargo-forms.js looks for it on form.parentElement`);
  }

  /* ----------------------------------------------------- nothing left -- */

  if (html.includes('Cinery')) throw new Error('cn-contact: donor copy survives in the rendered block');
  for (const s of [DONOR_HEADING, DONOR_SUCCESS, DONOR_FAIL, DONOR_SUBMIT, ...DONOR_LABELS.map((f) => `>${f}</label>`)]) {
    if (html.includes(s)) throw new Error(`cn-contact: the donor's own copy survives: ${s}`);
  }

  /* 「不是所有的观众都能看得懂英文」: the Chinese page carries Chinese, and the
     only Latin allowed to stand in it is a product name. */
  if (lang === 'zh') {
    const text = html.replace(/<[^>]+>/g, ' ');
    const stray = [...new Set(text.match(/[A-Za-z]{2,}/g) ?? [])].filter((w) => !PRODUCT_WORDS.has(w.toUpperCase()));
    if (stray.length) throw new Error(`cn-contact: English on the Chinese page: ${stray.join(', ')}`);
  }
  return html;
}

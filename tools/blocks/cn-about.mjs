/**
 * 关于 STARGO WORK — cinery's studio-introduction band, ported whole for this
 * site's About page.
 *
 * WHAT IS CUT
 *   `section.section-home-intro` out of tools/templates/cinery/index.html: the
 *   one block on cinery's home page that introduces the studio, and the only
 *   "about" section that page has (cinery ships no about.html in this export).
 *   `<section …>` appears nine times in index.html — partner, INTRO, projects,
 *   service, testimonial, pricing, section-home-faq, faq and call-to-action —
 *   and three of the other eight are already owned here: service by
 *   cn-service, section-home-faq by cn-faq, call-to-action by cn-produce. Its
 *   shape, outermost first, with the donor's own numbers:
 *
 *     section.section-home-intro        position: relative; overflow: clip
 *       .intro-opacity                  12rem tall, absolute top, a linear
 *                                       gradient #000 -> transparent
 *       .intro-background               the theatre photograph, 50% / cover /
 *                                       no-repeat / attachment: fixed
 *                                       (+ 3rem of padding-block ≤991, where
 *                                       cinery narrows the band)
 *         .padding-global > .container-large > .padding-section-large
 *                                       2.5rem side gutters (1.25rem ≤767);
 *                                       100rem container; 8rem of padding-block
 *                                       (6rem ≤767, 5rem ≤479) — the band's own
 *                                       height, since nothing here sets one
 *           .intro-content-wrapper      z-index 2, flex centred
 *             .intro-container          a 1px + 5px frame of #ffffff1a around
 *                                       the card, `--_sizes---border-radius
 *                                       --xhuge` = 4rem (3rem ≤767), 95% wide
 *                                       at ≤479
 *               .intro-content-block    55rem max, 3rem padding, #232324,
 *                                       3.75rem radius (2.75rem ≤767), column,
 *                                       centred, overflow: clip
 *                 img.star-icon         2.5rem tall (2.25rem ≤479)
 *                 .text-align-center
 *                   p.text-size-large   2rem / 1.4 / 500 (1.625 / 1.5 / 1.375rem
 *                                       down the breakpoints)
 *                 .social-media-wrapper 1rem gap (.75rem ≤479), five links
 *                   a.social-link ×5    2.5rem square, #ffffff1a, round, each
 *                                       holding a 1.25rem `overflow: hidden`
 *                                       wrap with TWO copies of its glyph
 *                 a.main-button         1rem/2rem, .875rem radius,
 *                                       `overflow: hidden`, `transition: all
 *                                       .35s`, `:hover { transform: scale(.95) }`
 *                   .button-border      inset 0%, #232324, .875rem
 *                   .border-wrap        inset 0%, flex centred
 *                     .glow-border      #b0b0b0 at `filter: blur(10px)` — the
 *                                       glow the two backgrounds below mask
 *                   .button-background-01  inset 0%, #232324, `margin: 1px`,
 *                                       leaving 1px of that glow as the border
 *                   .button-background-02  transparent -> --primary-color--dark-03
 *                                       at blur(5px)
 *                   .button-text-wrap   1.125rem tall, overflow: hidden, column
 *                     p.button-text ×2  1rem / 1.2 / 500, uppercase, nowrap
 *       .intro-opacity.is-bottom        the same fade, upside down
 *                                       (`--border-color--transparent` = #0000
 *                                       -> #000, `inset: auto 0% 0%`)
 *
 *   Nothing is wrapped and nothing is re-cut. The section is self-contained:
 *   `.intro-background` is a plain block child, so it is full width and as tall
 *   as the card it holds plus `.padding-section-large`'s 8rem above and below
 *   (6rem ≤767, 5rem ≤479), and its `cover` photograph is therefore the block's
 *   own ground at every width. That is why `donor.ground` is NOT set here —
 *   unlike cn-service and cn-produce, which paint nothing themselves and needed
 *   cinery's `body` black written onto their root. The two `.intro-opacity`
 *   gradients fade to `--background-color--primary-background` (#000) and this
 *   site's About page is #000002 twice over —
 *   `.lx-scope { background: #000002 }` (css/stargo-fusion.css:137) inside
 *   `body.lx-page { background: #000002 }` (:153) — two parts in 255 of blue
 *   apart, so the band still dissolves into the page above and below it exactly
 *   as it does on cinery's own black page.
 *
 * WHAT THE WORDS BECOME  (this is the whole of render())
 *   Every string comes from tools/copy.mjs. The slots are one paragraph, one
 *   button label in two copies, five accessible names and one alt attribute,
 *   and there is no sixth; the donor has no eyebrow and no heading here, so
 *   `ABOUT.eyebrow` and `ABOUT.storyTitle` have nowhere to go and are not
 *   printed — a heading is not added, because adding one is structure, and the
 *   brief is 「仅仅针对文字进行改动」. `ABOUT.title` IS printed, since V6
 *   (2026-09-16): as the paragraph's first line — see render().
 *
 *     the paragraph   `We craft high-end video experiences …narratives ™.`
 *                     -> ABOUT.title, a line break, ABOUT.desc and
 *                        ABOUT.closing (V5 P06: headline, body, closing). It is
 *                        the register's own About copy and the same kind of
 *                        statement in the same slot: the studio saying, once,
 *                        what it is. Longer than the donor's, so the card grows
 *                        (its height is its content's; see below). Measured on
 *                        the built page (V6, 2026-09-16), lines of the one
 *                        paragraph, zh / en:
 *
 *                          320   17 / 26      1024   6 / 9
 *                          390   12 / 17      1440   6 / 9
 *                           768   7 /  9      1920   6 / 9
 *
 *                        — against 4 lines for the pre-V6 Chinese sentence at
 *                        1440. Nothing overflows or is clipped at any of them,
 *                        the headline takes its own line(s) at every width, and
 *                        no type size changed. The arithmetic that follows is
 *                        the pre-V6 sentence's and is kept as the record of how
 *                        the card was first sized. The card
 *                        offers 784px of measure (55rem max-width less 2×3rem
 *                        of padding) at the donor's 2rem. The max-width is what
 *                        binds at every width the card is wide: at 1440 the
 *                        `.container-large` is 1440 − 2×2.5rem = 1360px, under
 *                        its own 100rem cap, and `.intro-container`'s 1px
 *                        border plus 5px padding leave the card 1348px to take
 *                        — against the 880px it asks for. Counted:
 *                        cinery's sentence is 202 characters, ABOUT.desc is 264
 *                        in English and 95 in Chinese, 79 of them CJK. At a
 *                        0.5em average advance that is 4.1 line-widths for the
 *                        donor against 5.4 for our English; the Chinese runs
 *                        79 × 32px = 2528px of ideographs plus "STARGO WORK"
 *                        and "AI", i.e. 3.2 line-widths — so the English card
 *                        grows by about a line and a half and the Chinese one
 *                        shrinks by about a line. (Arithmetic, not a browser
 *                        measurement — nothing here is built or served.)
 *                        `.intro-content-block` sets no height, only
 *                        `max-width`, so the card takes whatever the sentence
 *                        needs and no donor value is touched either way.
 *     the button      `About Us` ×2 -> ABOUT.button.label. Two copies because
 *                        the roll swaps one for the other; both must say the
 *                        same thing or the hover shows the donor's word.
 *     the button href `about.html` -> ABOUT.button.href (contact.html). The
 *                        block sits ON about.html, so the donor's link is a
 *                        self-link here; copy.mjs already points this button at
 *                        contact. Same move cn-service makes with
 *                        `href="services.html"`.
 *     the five social `aria-label="Instagram Link"` and its four siblings ->
 *     links              the name this site's own navigation gives the page
 *                        they now go to, resolved by href out of C.NAV rather
 *                        than retyped (cn-produce names its pill the same way).
 *                        Their hrefs are handled at extraction — see below.
 *     the star icon   `alt="Icon - Cinery Template"` -> `alt=""`. The mark is a
 *                        rule between the top of the card and the sentence, it
 *                        names nothing, and it is drawn in both languages — so
 *                        it is announced as decoration, exactly as qx-orbit and
 *                        ro-gallery announce their photographs.
 *
 *   No customer, metric, logo, price or date is stated anywhere in the block,
 *   because there is no slot that could carry one.
 *
 * WHAT THE PICTURES ARE
 *   cinery's own, both of them, and neither is substituted: the star mark in the
 *   card (`695c47e4e7da0bba805165b3_star-icon.svg`) and the projector-theatre
 *   photograph `.intro-background` is painted with
 *   (`695dad3f0ac964e0b5734ca9_view-black-white-light-projector-theatre.jpg`).
 *   `donor.mirror` keeps its default, so both are rewritten to assets/cinery/
 *   and fetched by `node tools/try-block.mjs cn-about`. cinery also ships an
 *   `.intro-background.about-page` variant of that rule; the extractor keeps it
 *   (its selector contains `.intro-background`) even though no element in the
 *   cut carries `about-page`, so its photograph is mirrored too — it is already
 *   on disk as assets/cinery/695fea0be6ff3256aa407acf_pexels-23515909-6664782.jpg,
 *   pulled in by an earlier block, so it costs nothing and is left alone rather
 *   than dropped with `cssImages`, which would be editing the donor's sheet.
 *
 * WHAT THE FIVE SOCIAL HREFS BECOME, AND WHY AT EXTRACTION
 *   The donor's five links point at the bare platform roots —
 *   https://www.instagram.com/, /www.x.com/, /www.linkedin.com/,
 *   /www.youtube.com/, /www.facebook.com/ — Webflow placeholders, not accounts.
 *   tools/donor-lib.mjs refuses ANY off-origin `href` in a cut ("unmapped
 *   off-origin assets"), so they cannot simply be left: they have to be mapped
 *   in `donor.images`, which is an exact-string substitution applied before
 *   that check (this is why qx-orbit maps three of the same platforms). They are mapped
 *   straight to contact.html rather than to `#`, because that is the treatment
 *   this site already gives a donor's social row — tools/build-site.mjs, the
 *   workforce page:
 *
 *     b = b.replace(/href="https:\/\/(?:www\.)?(?:linkedin|instagram|facebook
 *                   |x|twitter|tiktok|youtube)\.com[^"]*"/g, 'href="contact.html"');
 *
 *   and because STARGO publishes no social accounts: CONTACT_INFO carries an
 *   email, a WhatsApp number and a website, and nothing else. Pointing an
 *   Instagram glyph at an account that does not exist would be inventing one.
 *   `target="_blank"` is left exactly where the donor put it, as the workforce
 *   page leaves it: it is an attribute, not a word.
 *
 *   V7-LX r2 supersedes the rest of this at render time: contact.html is only
 *   the extraction-time placeholder. render() keeps the first three links with
 *   the company's three real channels (website, WhatsApp, email — the footer's
 *   list, from CONTACT_INFO) and neutral glyphs, and drops the last two, so no
 *   network logo is drawn and no icon promises an account.
 *
 * THE MOTION
 *   Three things move in this section. Two of them travel with the cut and one
 *   does not, and the one that does not is why this block ships a .css and a
 *   .js beside it. Written out in full in tools/blocks/cn-about.css.
 *
 *     travels    the five social glyphs' roll — IX2 events e-13/e-24 and their
 *                siblings (MOUSE_OVER -> action list `a`, MOUSE_OUT -> `a-2`),
 *                bound to the five `data-w-id`s, which are untouched here.
 *     travels    `.main-button:hover { transform: scale(.95) }` and its
 *                `transition: all .35s` — plain css in cinery's own sheet.
 *     does not   the button label's roll (ix3 timeline `t-bf9e6807`) and the
 *                paragraph's masked line reveal (ix3 `t-a0ad7ea5`). ix3 is GSAP
 *                data and donor-lib returns `{events, actionLists}` (IX2) only.
 *                The label's roll is replayed in tools/blocks/cn-about.css,
 *                where a css transition reproduces it exactly; the paragraph's
 *                cannot be — it animates LINES, and a stylesheet cannot find a
 *                line box — so it is replayed in tools/blocks/cn-about.js with
 *                the gsap / SplitText / ScrollTrigger this site already loads
 *                and the timeline's own numbers. Neither file hides anything:
 *                a page that runs no script, or loads no plugin, shows the
 *                block exactly as cinery draws it at rest.
 */
import { setText, setTextAll, DONORS } from '../block-lib.mjs';
import { zhKeep as zhKeepWords } from '../lib-html.mjs';

/** cinery's five placeholder social urls, in the order the row draws them. */
const SOCIAL_URLS = [
  'https://www.instagram.com/',
  'https://www.x.com/',
  'https://www.linkedin.com/',
  'https://www.youtube.com/',
  'https://www.facebook.com/',
];
/** Where all five now go. See the header: this site publishes no social accounts. */
const SOCIAL_HREF = 'contact.html';

export const donor = {
  id: 'cn-about',
  donor: 'cinery',
  scope: '.cn-about',
  page: 'index.html',
  /* Unique in index.html (checked: one occurrence each). donor-lib matches the
     anchors against the RAW donor page, before the `cn-` namespace is applied,
     so these are the donor's own class names; every selector inside render()
     below is the prefixed form the fragment actually carries. */
  start: '<section class="section-home-intro">',
  end: '<div class="intro-opacity is-bottom"></div></section>',

  /* Not artwork: the five social hrefs, which the extractor's off-origin check
     refuses unmapped. See the header for why they become contact.html here
     rather than in render(). */
  images: Object.fromEntries(SOCIAL_URLS.map((u) => [u, SOCIAL_HREF])),

  /* No `ground`. The block paints its own: `.intro-background` is a full-width
     block child carrying a `cover` photograph, so nothing of the page shows
     through it. See the header. */
};

/** The donor's own copy, exactly as the cut ships it. */
const DONOR_PARAGRAPH = 'We craft high-end video experiences that blend storytelling, cinematography, and motion. From concept to final cut, we help brands connect, inspire, and stand out through visually powerful narratives ™.';
const DONOR_ALT = 'alt="Icon - Cinery Template"';
const DONOR_BUTTON_HREF = 'href="about.html"';
const DONOR_BUTTON_LABEL = 'About Us';
/** aria-label, in the order the row draws the five links. */
const DONOR_ARIA = ['Instagram Link', 'X Link', 'Linkedin Link', 'Youtube Link', 'Facebook Link'];

/* Latin that is allowed to stand on the Chinese page: product names, which the
   brief exempts ("STARGO WORK, CRM, AI, SKU, SEO"). ABOUT.desc's Chinese form
   carries two of them, so cn-service's blanket "no Latin word on the zh page"
   assertion cannot be used verbatim here; the check below names what survived
   instead of only saying that something did. */
const PRODUCT_WORDS = new Set(['STARGO', 'WORK', 'CRM', 'AI', 'SKU', 'SEO', 'OS', 'PI', 'QC']);

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-about: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-about: donor ${donor.donor} is not registered`);

  const A = C.ABOUT;
  if (!A?.title || !A?.desc || !A?.closing || !A?.button?.label || !A?.button?.href) {
    throw new Error('cn-about: copy.mjs ABOUT needs title, desc, closing and button {label, href}');
  }

  /* --------------------------------------------------------- the shape --- */

  /* Assert the cut is the shape this module was written against, before a
     single word is replaced. A silent miss here ships cinery's own sentence to
     production, which is the one failure tools/blocks/README.md names. */
  const links = (frag.match(/class="cn-social-link w-inline-block"/g) ?? []).length;
  if (links !== 5) throw new Error(`cn-about: cinery draws five .social-link rows, found ${links}`);
  const glyphs = (frag.match(/class="cn-social-icon w-embed"/g) ?? []).length;
  if (glyphs !== 10) throw new Error(`cn-about: each social link stacks two glyph copies for its roll — expected 10, found ${glyphs}`);
  const labels = (frag.match(/class="cn-button-text"/g) ?? []).length;
  if (labels !== 2) throw new Error(`cn-about: the roll-over button stacks two .button-text copies, found ${labels}`);
  /* Both copies must already say the same thing, or setTextAll below is
     replacing two different words with one and the donor's roll is not what we
     think it is. */
  const said = (frag.match(new RegExp(`>${DONOR_BUTTON_LABEL}<`, 'g')) ?? []).length;
  if (said !== 2) throw new Error(`cn-about: expected both button copies to read "${DONOR_BUTTON_LABEL}", found ${said}`);
  const fades = (frag.match(/class="cn-intro-opacity/g) ?? []).length;
  if (fades !== 2) throw new Error(`cn-about: the band fades top and bottom — expected two .intro-opacity, found ${fades}`);
  if (!frag.includes('class="cn-intro-background"')) {
    throw new Error('cn-about: .intro-background is not in the cut — the block would have no ground of its own');
  }
  if (!frag.includes(DONOR_PARAGRAPH)) {
    throw new Error('cn-about: cinery\'s introduction paragraph is not in the cut; the block has nothing to say');
  }
  /* The five hrefs were rewritten at extraction (donor.images). If that ever
     stops happening the fragment carries five links to Instagram. */
  const mapped = (frag.match(new RegExp(`href="${SOCIAL_HREF}"`, 'g')) ?? []).length;
  if (mapped !== 5) throw new Error(`cn-about: expected donor.images to have retargeted five social hrefs, found ${mapped}`);
  /* Same shape donor-lib checks, and for the same reason: this site fetches
     nothing off-origin. Attribute-scoped rather than a bare url test, because
     the ten social glyphs are inline `<svg xmlns="http://www.w3.org/2000/svg">`
     and that is a namespace name, not a request. */
  const remote = frag.match(/(?:src|srcset|href|poster|data-src)="(https?:\/\/[^"]+)"/);
  if (remote) throw new Error(`cn-about: an off-origin url survived the cut: ${remote[1]}`);

  let html = frag;

  /* ------------------------------------------------------- the sentence --- */

  /* The card's one paragraph. `.text-size-large` is 2rem / 1.4 / 500 in a card
     that is `max-width: 55rem` with `padding: 3rem` and NO height, so the slot
     takes whatever the sentence needs and every donor value stays where it is.
     The copy is the register's own About copy — nothing here is written for
     this block.

     V6 (2026-09-16) gives the page a headline, a body and a closing line (V5
     P06), and this card is the only place on the page that can carry words of
     that length. So the three are read here in that order: the headline, a
     `<br/>`, then the body and the closing line as one run — the closing line
     is the last thing read before the demo button. The line break is the only
     markup added, and it is what lets the headline stand on a line of its own
     instead of being run into the body; no heading element is added
     (「仅仅针对文字进行改动」). cn-about.js splits this paragraph into lines for
     its entrance and reverts the split afterwards; SplitText treats a `<br>`
     as a line end, so the headline keeps its own line through the entrance. */
  const run = lang === 'zh' ? '' : ' ';
  /* V7-LX: on the Chinese page each clause of the headline and of the closing
     line is kept whole (`.stargo-keep`, white-space: nowrap in
     css/stargo-fusion.css), so the headline breaks at its comma —
     「从真实业务出发，」/「把分散的工作连接起来。」 — instead of leaving
     「起来。」 alone at 390. A span survives the entrance's line split, so the
     break is the same during and after it. Only clauses of eleven characters
     or fewer are bound: the card's narrowest line (320) holds twelve. */
  const keep = (s) => (lang === 'zh'
    ? s.split(/(?<=，)/).map((c) => (c.length <= 11 ? `<span class="stargo-keep">${escapeHtml(c)}</span>` : escapeHtml(c))).join('')
    : escapeHtml(s));
  /* V7-LX r2: the body between them breaks between words only on the Chinese
     page: each word of two or more characters is its own `.stargo-keep` span
     (tools/lib-html.mjs zhKeep; punctuation rides on the word before it), and
     「STARGO WORK」 is one span. It read 「结」/「束。」 from 1024 up, 「需」/「要」
     at 390, 「经」/「营」 at 430 and 768, 「STARGO」/「WORK」 at 320. Every word
     is far shorter than the 320 line (twelve characters), so nothing can
     overflow, and the spans survive the entrance's line split. */
  const words = (s) => zhKeepWords(s, 'stargo-keep')
    .replace('<span class="stargo-keep">STARGO</span> <span class="stargo-keep">WORK</span>', '<span class="stargo-keep">STARGO WORK</span>')
    // the word list cuts 「报价单后」 as 报价|单后
    .replace('<span class="stargo-keep">报价</span><span class="stargo-keep">单后</span>', '<span class="stargo-keep">报价单后</span>')
    // and the product term 「数字员工」 as 数字|员工 (「数字」/「员工。」 at 320)
    .replace('<span class="stargo-keep">数字</span><span class="stargo-keep">员工。</span>', '<span class="stargo-keep">数字员工。</span>');
  const body = lang === 'zh' ? words(t(A.desc)) : escapeHtml(t(A.desc));
  const statement = `${keep(t(A.title))}<br/>${body}${run}${keep(t(A.closing))}`;
  html = setText(html, 'cn-text-size-large', statement);
  if ((html.match(/<br\/>/g) ?? []).length !== 1) {
    throw new Error('cn-about: expected exactly one <br/> in the block — the one after the headline');
  }

  /* ---------------------------------------------------------- the icon --- */

  /* One `<img class="star-icon">`, the rule between the card's top edge and the
     sentence. It is decoration in both languages, so it is announced as none. */
  if (!html.includes(DONOR_ALT)) throw new Error(`cn-about: the star icon has no ${DONOR_ALT} to replace`);
  html = html.split(DONOR_ALT).join('alt=""');

  /* --------------------------------------------------- the social links --- */

  /* V7-LX r2: STARGO has no social accounts, and five network logos that all
     opened the contact form promised profiles that do not exist. The row now
     shows the company's three real channels, the ones the site footer lists
     (C.CONTACT_INFO), each with a plain glyph of what it is and a name that
     says where it goes, in the footer's own words: the website (a globe),
     WhatsApp (a speech bubble) and email (an envelope). The first three
     donor links are kept — their `data-w-id`s carry the glyph roll (IX2
     MOUSE_OVER/OUT) — and the last two are removed, so the row stays a
     centred row of equal circles. Both stacked copies of each glyph are
     replaced, as the roll swaps one for the other. */
  const CI = C.CONTACT_INFO;
  if (!CI?.siteHref || !CI?.whatsappHref || !CI?.email) throw new Error('cn-about: copy.mjs CONTACT_INFO needs siteHref, whatsappHref and email');
  const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  const CHANNELS = [
    { href: CI.siteHref, external: true, label: { zh: 'STARGO 企业官网', en: 'STARGO corporate website' },
      glyph: svg('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z"></path>') },
    { href: CI.whatsappHref, external: true, label: { zh: '通过 WhatsApp 联系 STARGO WORK', en: 'WhatsApp STARGO WORK' },
      glyph: svg('<path d="M20.5 11.6a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"></path>') },
    { href: `mailto:${CI.email}`, external: false, label: { zh: '发邮件给 STARGO WORK', en: 'Email STARGO WORK' },
      glyph: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m4 7 8 6 8-6"></path>') },
  ];
  {
    const OPEN = '<div class="cn-social-media-wrapper">';
    const at = html.indexOf(OPEN);
    if (at < 0 || html.indexOf(OPEN, at + 1) >= 0) throw new Error('cn-about: expected one social row');
    const end = html.indexOf('</a></div>', at);
    if (end < 0) throw new Error('cn-about: the social row does not end with its fifth link');
    const rows = html.slice(at + OPEN.length, end + 4).match(/<a\b[^>]*class="cn-social-link w-inline-block">[\s\S]*?<\/a>/g) ?? [];
    if (rows.length !== 5 || rows.join('') !== html.slice(at + OPEN.length, end + 4)) throw new Error(`cn-about: the social row is not five adjacent links (${rows.length})`);
    DONOR_ARIA.forEach((aria, i) => { if (!rows[i].includes(`aria-label="${aria}"`)) throw new Error(`cn-about: social link ${i + 1} is not "${aria}"`); });
    const out = CHANNELS.map((ch, i) => {
      const name = escapeHtml(ch.label[lang]);
      let a = rows[i]
        .replace(/aria-label="[^"]*"/, `aria-label="${name}" title="${name}"`)
        .replace(`href="${SOCIAL_HREF}"`, `href="${escapeHtml(ch.href)}"${ch.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`)
        .replace(/\s*target="_blank"(?![^>]*rel=)/, '');
      const glyphs = (a.match(/<svg\b[\s\S]*?<\/svg>/g) ?? []).length;
      if (glyphs !== 2) throw new Error(`cn-about: social link ${i + 1} should stack two glyphs, found ${glyphs}`);
      a = a.replace(/<svg\b[\s\S]*?<\/svg>/g, ch.glyph);
      if (!a.includes(`href="${escapeHtml(ch.href)}"`)) throw new Error(`cn-about: social link ${i + 1} did not take its channel`);
      return a;
    }).join('');
    html = html.slice(0, at + OPEN.length) + out + html.slice(end + 4);
    if ((html.match(/class="cn-social-link w-inline-block"/g) ?? []).length !== 3) throw new Error('cn-about: the social row should hold the three channels');
  }

  /* -------------------------------------------------------- the button --- */

  /* Two stacked copies inside a 1.125rem `overflow: hidden` window; the hover
     rolls the first out and the second in, so both have to carry the same word.
     Write one and the roll shows the donor's. */
  if (!html.includes(DONOR_BUTTON_HREF)) {
    throw new Error(`cn-about: the button no longer carries ${DONOR_BUTTON_HREF}`);
  }
  html = html.split(DONOR_BUTTON_HREF).join(`href="${A.button.href}"`);
  html = setTextAll(html, 'cn-button-text', escapeHtml(t(A.button.label)));

  /* ------------------------------------------------------ nothing left --- */

  if (/Cinery|About Us|We craft|storytelling|cinematography|Instagram Link|Facebook Link/.test(html)) {
    throw new Error('cn-about: donor copy survives in the rendered block');
  }
  /* 「不是所有的观众都能看得懂英文」: the Chinese page carries Chinese, and the
     only Latin allowed to stand in it is a product name. */
  if (lang === 'zh') {
    const text = html.replace(/<[^>]+>/g, ' ');
    const stray = [...new Set(text.match(/[A-Za-z]{2,}/g) ?? [])].filter((w) => !PRODUCT_WORDS.has(w.toUpperCase()));
    if (stray.length) throw new Error(`cn-about: English on the Chinese page: ${stray.join(', ')}`);
  }
  return html;
}

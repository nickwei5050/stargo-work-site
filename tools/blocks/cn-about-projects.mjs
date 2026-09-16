/**
 * 数字员工 — cinery's selected-work grid, carrying four AI-employee roles
 * instead of four client case studies.
 *
 * WHAT IS CUT
 *   `section.section-home-projects` out of tools/templates/cinery/index.html —
 *   the projects / selected-work band, the third of the nine `<section>`s on
 *   that page. Four of the other eight are already owned here: section-home-
 *   service by cn-service, section-home-intro by cn-about, section-home-faq by
 *   cn-faq and call-to-action by cn-produce. The cut is the whole section,
 *   balanced (110 `<div>` opened, 110 closed), and nothing is wrapped back:
 *   the section already carries its own
 *   `.padding-global > .container-large > .padding-section-large` chain.
 *
 *   Its shape, outermost first, with the donor's own numbers:
 *
 *     section.section-home-projects     no rules at all in cinery's sheet — see
 *                                       `ground` below
 *       .padding-global                 2.5rem side gutters (1.25rem ≤767)
 *         .container-large              100% wide, max-width 100rem, centred
 *           .padding-section-large      8rem of padding-block
 *             .w-layout-grid.top-content-grid   1fr 1fr (Webflow's own default;
 *                                       `.top-content-grid` only sets the 2rem
 *                                       gaps and `width: 100%`)
 *               #w-node-a34212dd… .heading-wrap    flex column, z-index 5
 *                 [data-w-id 2c7b9291…] .subtitle-block   the pill: 1px #2c2c2e
 *                                       top+left border, #232324, 8px radius,
 *                                       .5rem/1rem padding, `overflow: hidden`
 *                   .subtitle           .75rem, uppercase, .025rem tracking,
 *                                       `line-height: 1` — ONE short line
 *                   .subtitle-blur      a 1.5rem #232324 square at blur(8px),
 *                                       parked at translate3d(-400%) by the
 *                                       inline style the export carries; e-225
 *                                       loops it across the pill
 *                 .title-wrapper        `position: relative; overflow: hidden`
 *                   .top-title > h2.heading-style-h2
 *                 .title-wrapper
 *                   .bottom-title > h2.heading-style-h2
 *                                       10rem, 12rem ≥1440, 8rem ≤991, 6rem
 *                                       ≤767, 3.5rem ≤479; uppercase; .1rem
 *                                       tracking; white→black gradient painted
 *                                       with `background-clip: text`
 *               #w-node-_43f5e317… .content-item   `place-self: end`
 *                 a.main-button         the roll-over button, two stacked
 *                                       `.button-text` copies in a 1.125rem
 *                                       `overflow: hidden` window
 *             .spacer-huge              6rem
 *             .case-study-component     flex column, 2rem gaps,
 *                                       `perspective: 1000px`
 *               .case-study-block._01   z-index 4
 *                 .w-layout-grid.case-study-component-grid   1fr 1fr, 2rem gaps
 *                                       (1fr — one column — at ≤991)
 *                   .w-dyn-list > [role=list] > [role=listitem]   ×2
 *               [data-w-id fb6f08c0…fea4] .case-study-block._02   z-index 3;
 *                                       e-227 runs a continuous scroll action
 *                                       on it, `mediaQueries: ["main"]`
 *                 .case-study-component-grid
 *                   .w-dyn-list …       ×2
 *             .dividing-line            1px, --border-color--primary-border
 *
 *   and each of the four list items is one tile:
 *
 *     a.case-study-link                 1.5rem radius, 100% wide, its own
 *                                       data-w-id (e-228 MOUSE_OVER / e-229
 *                                       MOUSE_OUT → a-35 / a-36)
 *       .background-glass.case-study    backdrop-filter blur(30px), #5c5c5c1a
 *       .case-study-container           --border-color--primary-border,
 *                                       1.5rem radius, 1rem padding
 *         .video-wrapper                1.25rem radius, overflow hidden
 *           .case-video                 a Webflow background video, 25rem tall
 *                                       (28rem ≥1280, 35rem ≥1920, 30rem ≤991,
 *                                       22rem ≤767, 12rem ≤479), holding a
 *                                       `<video autoplay loop muted playsinline>`
 *                                       with an mp4 and a webm `<source>` and a
 *                                       poster frame. The box and the clip in it
 *                                       are both kept exactly as the donor ships
 *                                       them — see WHAT THE PICTURES ARE.
 *           .case-logo-wrap             absolute, inset 0, flex centred
 *             .case-logo-block          2.5rem tall, column, overflow hidden
 *               img.case-logo ×2        the SAME mark twice — the roll a-35
 *                                       lifts on hover
 *             .case-study-overlay       #0a0a0a4d over the clip
 *         .w-layout-grid.case-study-content-grid   the pill under the clip:
 *                                       #70707026 on #70707026, 100px radius,
 *                                       1fr 1fr, 10px/10px/10px/20px padding
 *           #w-node-…fe7b .case-study-item    `place-self: center start`
 *             .text-size-medium.text-style-allcaps   the CLIENT'S NAME
 *             .text-size-medium                      "•"
 *             .text-size-medium.text-color-secondary the YEAR
 *           #w-node-…fe80 .case-study-item    `place-self: center end`
 *             .case-arrow-wrap          4rem × 2.5rem pill, `:hover { scale
 *                                       1.1 }`, two stacked arrow glyphs
 *
 * ────────────────────────────────────────────────────────────────────────────
 * THE TILES: WHY NOT ONE OF THEM IS A CASE STUDY
 *
 *   cinery fills this grid with its own case studies — VISAGE · 2025,
 *   HORIZON · 2024, BEYOND · 2023, STRIDE · 2022 — each with a client logo over
 *   a clip and a link to that project's page. STARGO publishes NO case studies
 *   and NO customers: tools/copy.mjs carries none, the site has no
 *   case-studies.html, and the register's own words for anything customer-shaped
 *   are 「示例场景」/"illustrative scenario" (HOME_MONO, and cn-reviews.mjs, which
 *   had to solve this for cinery's testimonial slider). Writing a client name,
 *   a project name or a year into these four tiles would invent four customers
 *   and four dates. So the grid keeps every tile — its markup, its data-w-id,
 *   its hover roll, its clip, its logo slot, its arrow — and shows something
 *   this site actually has.
 *
 *   WHAT IT SHOWS: the four AI-employee roles `ABOUT.circles` already names.
 *   Not chosen here, and not a subset of anything: copy.mjs carries exactly
 *   four, they are the About page's own copy, and they are already on the About
 *   page today — tools/build-site.mjs's `PAGES['about.html']` prints all four
 *   into the lifelogx about template's four circles. The cinery rebuild must
 *   not lose them. copy.mjs's own comment on that list records why they exist:
 *
 *     "The template shows four named people here. STARGO's role emblems (its
 *      own conceptual visuals, not portraits) stand for four AI-employee roles
 *      instead."
 *
 *   — four named people replaced by four AI-employee roles, one donor ago. This
 *   block makes the same substitution for four named clients, which is the same
 *   problem in a different design. (It is also one of the three kinds of honest
 *   content the brief for this block named, alongside the capability groups and
 *   the nine-stage loop; both of those were measured against the slot and are
 *   written up under THE TWO SLOTS THAT ARE LEFT EMPTY below.)
 *
 * WHAT THE WORDS BECOME
 *
 *   Every string is read out of tools/copy.mjs. Nothing is written for this
 *   block, and no fact, number, name or date is stated that the register does
 *   not already state.
 *
 *     .subtitle          `Selected Projects` → the name this site's own
 *                        navigation gives the page the tiles and the button now
 *                        go to, resolved out of `C.NAV` BY HREF rather than
 *                        retyped — 「数字员工」/"AI Workforce". Same move
 *                        cn-produce makes with its pill ("the pill says what the
 *                        navigation already calls that page") and cn-about with
 *                        its five accessible names, so a renamed page cannot
 *                        leave the eyebrow saying something the menu no longer
 *                        says. `.subtitle` is `text-transform: uppercase`, so
 *                        the English page draws AI WORKFORCE; the Chinese is
 *                        unaffected by the transform.
 *
 *     h2 ×2              `Case` / `Studies` → 「AI」/「团队」, "AI"/"Team".
 *                        See THE HEADING below: it used to be
 *                        `CAPABILITY_SHOWCASE.headlineTop`/`headlineBottom`
 *                        (「每项」/「工作」, "Every"/"Job") and the owner asked for
 *                        a heading that names what the grid actually shows and
 *                        does not repeat the capability page's, 2026-09-15.
 *
 *     .button-text ×2    `Explore More` → `LX_WORKFORCE.store1.name`,
 *                        「288 位 AI 员工」/"288 AI Employees". The donor's button
 *                        goes to the index of the things the tiles are; ours
 *                        says how many of them there are, in the workforce
 *                        page's own words. Two copies because the roll swaps one
 *                        for the other; both must say the same thing or the
 *                        hover shows the donor's word. 288 is the register's
 *                        own owner-approved number (copy.mjs's file header:
 *                        "288 AI employees"), and the site states what it means
 *                        elsewhere — 「288 是岗位目录，不是 288 个并发运行」.
 *
 *     button href        `case-studies.html`, a page this site does not have →
 *                        `workforce.html`, which it does. Same repair cn-service
 *                        makes with `href="services.html"` and cn-about with
 *                        `href="about.html"`.
 *
 *     tile ×4, the       the client's name → the AI-employee role the tile
 *     allcaps slot       shows, `ABOUT.circles[i].label`, in copy.mjs's order:
 *                        市场信号 AI 员工 / 报价 AI 员工 / 跟进 AI 员工 / 统筹 AI
 *                        员工, and Market Signal Agent / Quote Agent / Follow-up
 *                        Agent / Coordinator Agent (the fourth was 调度中枢 /
 *                        Orchestrator until V6, 2026-09-16, which retired that
 *                        engineering word; COORDINATOR AGENT is two characters
 *                        shorter than MARKET SIGNAL AGENT, the longest line the
 *                        measurement below was taken on, and was re-measured on
 *                        the built page). The slot is no longer a client-name
 *                        slot: it names what the tile is about, which is what
 *                        qx-projects does with the same kind of slot ("The
 *                        category slot is not a category").
 *
 *     tile ×4, href      `project_visage.html` and its three siblings — pages
 *                        this site does not have → `workforce.html`, the page
 *                        that explains the AI employees. All four go to the same
 *                        place because there is no per-role page to send them
 *                        to; qx-projects sends all of its card links to one
 *                        `#atlas` for the same reason.
 *
 *     tile ×4, the       `alt="Visage"` and its three siblings, twice each →
 *     logo alt           `alt="STARGO"`, because the mark itself is now this
 *                        site's (see WHAT THE PICTURES ARE). Both copies carry
 *                        it, exactly as the donor gives both copies of its own
 *                        mark the same alt: the second copy is the one the
 *                        hover roll brings up, and changing only one would be
 *                        changing the donor's treatment rather than its words.
 *
 * THE HEADING — what it says, where the words come from, and what it must not
 * collide with (owner decision, 2026-09-15)
 *
 *   It used to read 「每项」/「工作」, "Every"/"Job" — `CAPABILITY_SHOWCASE`'s
 *   `headlineTop`/`headlineBottom`. Two things were wrong with that. It is word
 *   for word the heading capabilities.html already carries (twice: cn-service
 *   and cn-produce both set that pair, and `node tools/blocks` aside, a grep of
 *   the built pages finds 「每项」/「工作」 as an `<h2>` on capabilities.html and
 *   nowhere else), so about.html was borrowing another page's title. And it
 *   names a scope — every job — rather than the thing under it, which is four
 *   AI employees.
 *
 *   WHAT IT SAYS NOW: 「AI」/「团队」, "AI"/"Team". Both halves, in both
 *   languages, are read out of `LX_WORKFORCE.heroDesc` — 「AI 团队已经上线。」 /
 *   "Your AI team is already online." — the workforce page's own one-line
 *   description of the thing these four tiles are, and the page all five links
 *   in this block go to. Nothing is coined: `heroDesc` is asserted to contain
 *   both lines in the language being rendered, so a rewrite of that sentence
 *   fails the build instead of leaving a heading nobody wrote. Same move
 *   cn-about-reviews makes for its own 「四个」 (a substring of HOME_MONO's
 *   eyebrow, asserted) rather than typing a word into the module.
 *
 *   WHY NOT 「数字员工」/"AI Workforce", the obvious name and the one the pill
 *   above it already carries: the Chinese fits (数字 / 员工, two characters a
 *   line) and the English does not. Measured in the browser on the built
 *   about.html with cinery's own Overused Grotesk loaded, the same harness
 *   tools/blocks/cn-about-reviews.mjs records its table from:
 *
 *     viewport  h2      heading track budget   AI/WORKFORCE   AI/TEAM (ours)
 *      1680    192px    1600 − 32 − 195 = 1373     1144  ✓         494  ✓
 *      1440    192px    1360 − 32 − 195 = 1133     1144  ✗ +11     494  ✓
 *      1280    160px    1200 − 32 − 195 =  973      956  ✓         412  ✓
 *      1024    160px     944 − 32 − 195 =  717      956  ✗ +239    412  ✓
 *       992    160px     912 − 32 − 195 =  685      956  ✗ +271    412  ✓
 *       768    128px     688 (one column)           767  ✗  +79    331  ✓
 *       375     56px     335 (one column)           344  ✗   +9    149  ✓
 *
 *   `.top-content-grid` is `1fr 1fr`, i.e. two `minmax(auto, 1fr)` tracks, so an
 *   unbreakable Latin word wider than its share does not shrink: it raises the
 *   first track's automatic minimum, eats the button's track and then the
 *   container. "WORKFORCE" overflows at five of the seven widths. "EMPLOYEES"
 *   (877px at 160px) fails the same way. The pill keeps 「数字员工」, where
 *   `.subtitle` is .75rem and the phrase is twelve characters on one short line.
 *
 *   Every line above is ONE line box tall at every width (192/160/128/56px,
 *   measured, never doubled), and both of ours are narrower than cinery's own
 *   "CLIENT"/"STORIES". Nothing in tools/blocks/cn-about-projects.css changes a
 *   type size to make this true.
 *
 *   WHAT IT MUST NOT COLLIDE WITH. about.html carries a second cinery band with
 *   this same split heading — cn-about-reviews, 「四个」/「岗位」, "Four"/"Roles" —
 *   so 「岗位」/"Roles" is spoken for on this page, and 「每项」/「工作」 is spoken
 *   for on capabilities.html. Checked against every built page: no `<h1>`–`<h6>`
 *   anywhere reads 「AI」, 「团队」, "AI" or "Team".
 *
 * THE TWO SLOTS THAT ARE LEFT EMPTY, AND WHY — read this before filling them
 *
 *   The donor's tile line is three elements: NAME • YEAR. Two of them cannot be
 *   filled here.
 *
 *     the year           `2025` / `2024` / `2023` / `2022`. A date about a
 *     .text-color-       project this site has never published is exactly the
 *     secondary          kind of fact that may not be invented, and copy.mjs
 *                        carries no date for an AI-employee role — nor for a
 *                        capability, a capability group or a stage of the trade
 *                        loop. Its text is removed, and the element, its class
 *                        and its `#w-node-…` grid placement stay.
 *
 *     the "•"            the separator between the two. With nothing on its
 *     .text-size-medium  right it separates nothing, so its glyph goes with the
 *                        year. This is the one place this block does NOT keep a
 *                        donor glyph — cn-service keeps its `◉` and its `▶︎`,
 *                        cn-reviews keeps the `-` between its label and its
 *                        stars — and the difference is that those still have
 *                        something on both sides of them.
 *
 *   WHAT WAS TRIED FIRST, and why it does not fit. The slot is not wide. At 992
 *   — the narrowest width at which `.case-study-component-grid` is still two
 *   columns; below it the rule is `grid-template-columns: 1fr` — a tile is
 *   440px, its container's 1rem padding leaves 408, the pill's 20/10px padding
 *   leaves 378, and the pill is `1fr 1fr` with a 16px gap holding a 4rem arrow
 *   on the right: 298px for the whole NAME • SECOND line. Measured with the
 *   donor's own letter widths at the pill's 1.25rem:
 *
 *     donor            VISAGE • 2025                     141px   ✓
 *     role name only   MARKET SIGNAL AGENT               248px   ✓ (50px spare)
 *     + its group      MARKET SIGNAL AGENT • AI Workforce  389px   ✗ (+91)
 *     + a bare label   MARKET SIGNAL AGENT • AI employee   384px   ✗ (+86)
 *
 *   Nothing the register has for these four roles fits in the 27px the longest
 *   of them leaves. Filling three tiles and leaving the fourth short is worse
 *   than leaving all four alike — that is the lesson cn-service wrote down when
 *   the owner reported one row at a different size as a mistake
 *   (「这里有一行字调整成统一大小」) — so all four are alike and empty.
 *
 *   The same measurement is what rules out the other two kinds of honest content
 *   the brief offered for this grid:
 *
 *     capability groups  `CAPABILITY_GROUPS` has fourteen, and four tiles would
 *                        need four of them chosen — there is no four-way pick of
 *                        that list anywhere in copy.mjs. Six of the fourteen
 *                        English names fit the 298px line beside a group number
 *                        (01, 03, 07, 10, 13, 14) and eight do not ("AI Growth &
 *                        Customer Acquisition" is 32 characters), so any four
 *                        would have been chosen for their width.
 *     the nine-stage     `HOME_LOOP_TABLE.rows` fits the slot perfectly — its
 *     trade loop         keys are literally `01 · DISCOVER`, a number and one
 *                        uppercase word, and 「发现」 is two characters — but
 *                        there are nine of them and four tiles. Showing four
 *                        would print four of the nine stages under a heading
 *                        this block does not get to qualify, which says the loop
 *                        has four stages. It has nine, and the site says so
 *                        「(九个阶段)」. Cloning two more tiles is the other way
 *                        out and is worse: each tile carries its own clip and
 *                        its own `#w-node-…` id, so nine tiles would repeat five
 *                        clips and five ids, and the 2×2 the donor draws would
 *                        become a 2×4 plus one — a layout change, which the
 *                        brief forbids.
 *
 * WHAT THE PICTURES ARE (owner decision, 2026-09-15 — and the reversal, same day)
 *
 *   The four clips STAY, and each tile plays the one cinery put in it: the
 *   donor's `<video class="… w-background-video">` with its poster frame, its
 *   mp4 and its webm, exactly as the template ships it, pointed at this site's
 *   own mirrored copies instead of Webflow's CDN.
 *
 *     tile 1  市场信号 AI 员工 / Market Signal Agent
 *             683f6a1d3749cee9a45775ce_6840ae36c2dab521d144e25c_case-study-1-…
 *     tile 2  报价 AI 员工     / Quote Agent
 *             6773dce23469ef07fffcf87e_6776fa0ce62367e64242f0fd_case-video-2-…
 *     tile 3  跟进 AI 员工     / Follow-up Agent
 *             6773dce23469ef07fffcf87e_6776f8447c59f1e277e1ee94_case-video-03-…
 *     tile 4  统筹 AI 员工     / Coordinator Agent (调度中枢 / Orchestrator before V6)
 *             6773dce23469ef07fffcf87e_6776f90cc1fa6522b3738b2d_case-video-01-…
 *
 *   — each of the four as `…-poster-00001.jpg`, `…-transcode.mp4` and
 *   `…-transcode.webm` under assets/cinery/. Twelve files, 11,922,110 bytes on
 *   disk: 11.9 MB, or 11.4 MiB, which is the 11.3 MB the owner's note names.
 *   They are the template's own footage, kept the way every other donor
 *   photograph on this site is kept (「只改文字，图片都要保留」), and nothing around
 *   them claims they are STARGO's work: the tile's line names an AI-employee
 *   role, the logo slot carries this site's wordmark, and there is no client
 *   name, no project name and no year anywhere in the band. See WHAT MUST NOT
 *   COME BACK, below.
 *
 *   WHAT WAS TRIED, AND WHY IT WAS REVERTED. Earlier on 2026-09-15 these four
 *   boxes were swapped for still images: each `<video>` and its two `<source>`s
 *   became one `<img class="stargo-still">` carrying the matching role emblem
 *   from `ABOUT.circles`, the four attributes that mean "Webflow, play a video
 *   here" (`data-poster-url`, `data-video-urls`, `data-autoplay`, `data-loop`)
 *   came off the wrapper the way tools/chrome.mjs's `stillImage()` strips them,
 *   and a helper called `stillMaps()` pointed all twelve CDN urls at the stills
 *   so the films dropped out of `out.assets`, out of
 *   tools/fragments/donor-assets.json and out of what
 *   tools/mirror-donor-assets.mjs fetches. The argument was that another
 *   studio's case-study reel under this site's wordmark reads as this site's
 *   work. The owner decided otherwise the same day, 2026-09-15:
 *
 *     「11.3 MB 无引用的 cinery 案例片，帮我恢复原模版」
 *
 *   — 11.3 MB of cinery case-study footage left on disk with nothing referencing
 *   it; restore the original template. So the clips are back, the twelve files
 *   are referenced and mirrored again, `stillMaps()` is gone, and `clipMaps()` —
 *   the helper that stood here before the swap — is back under its own name.
 *   Nothing else about that swap survives: the tiles' words, links and logos are
 *   unchanged by this reversal (again, see WHAT MUST NOT COME BACK).
 *
 *   HOW THE TWELVE URLS GET HOME. `mirror` is donor-lib's default for this donor
 *   (assets/cinery): every clean CDN url in the cut is rewritten to
 *   `assets/cinery/<decoded file name, non-word runs collapsed to _>` and
 *   recorded in `out.assets`, which is what puts it in
 *   tools/fragments/donor-assets.json for tools/mirror-donor-assets.mjs. Two of
 *   a Webflow clip's four written url positions are not clean, and `clipMaps()`
 *   pre-maps exactly those two to the same local names — see the comment on that
 *   function. `out.assets` therefore holds, for this block, the twelve clip
 *   files plus what it always held besides them: cinery's nine Overused Grotesk
 *   woff2 faces and the one background photograph its stylesheet names, both of
 *   which come from the extracted CSS rather than from this markup, and both of
 *   which other cinery blocks reference too. render() asserts both ends: every
 *   clip url is local under assets/cinery/, and no `cdn.prod.website-files.com`
 *   survives.
 *
 *   WHAT THIS COSTS ON FIRST PAINT, AND WHAT IS NOT DONE ABOUT IT HERE. The
 *   donor's `<video>` is `autoplay loop muted playsinline` with no `preload`, so
 *   a browser takes the first source it can play — the mp4 — and starts fetching
 *   it as soon as the page parses. Four posters (138,816 bytes) plus four mp4s
 *   (4,054,950) is 4,193,766 bytes — 4.2 MB, 4.0 MiB — fetched on a first visit
 *   to about.html before the reader has scrolled to the band. (The webms, 7.7 MB,
 *   are fetched by nothing that can play the mp4, which is every current browser;
 *   they are mirrored because the donor's `<source>` offers them.) A repeat visit
 *   costs nothing: the files are static and cached. The site already owns the
 *   fix — js/stargo-video-defer.js, which restores a held-back `<source>` when
 *   the band comes within a screen, together with the
 *   `<source src>` → `<source data-src>` rewrite in tools/build-site.mjs
 *   that feeds it — but that rewrite and that script tag are written only by
 *   `PAGES['capabilities.html']`; `PAGES['about.html']` emits neither. Wiring
 *   them into the About page is a change to tools/build-site.mjs, which is not
 *   this block's file and not this block's decision. It is recorded here so the
 *   next reader of this module knows the cost is known and unpaid.
 *
 * WHAT MUST NOT COME BACK — the parts of this band that are NOT the template's
 *
 *   Restoring the clips restored the donor's pictures and nothing else. Three
 *   things stay substituted, and a future "restore the original template" must
 *   not be read as covering them, because each one would state a fact this site
 *   does not have. Every one is asserted at the foot of render().
 *
 *     no client names   The all-caps slot carries `ABOUT.circles[i].label`, the
 *                       four AI-employee roles, and the secondary slot and the
 *                       "•" beside it stay empty. VISAGE · 2025 and its three
 *                       siblings would invent four customers and four dates on a
 *                       site that publishes no case studies. See THE TILES and
 *                       THE TWO SLOTS THAT ARE LEFT EMPTY above.
 *     no client logos   The four logos are logoipsum marks in a client-logo slot,
 *                       and a client's logo over a tile asserts a customer as
 *                       loudly as a client's name under it. They are replaced —
 *                       not dropped — by this site's own wordmark
 *                       (`imageStems: { logoipsum: WORDMARK }`), exactly as
 *                       cn-reviews replaces the same four logoipsum files in
 *                       cinery's testimonial cards and rk-testimonials replaces
 *                       renok's "Cairo": the tile keeps its logo block, both
 *                       copies, the roll between them and the overlay under
 *                       them, and what it now says is that the tile is STARGO's.
 *     no dead links     All four tiles and the button go to `workforce.html`.
 *                       `project_visage.html` and `case-studies.html` are pages
 *                       this site does not have.
 *
 * THE MOTION
 *
 *   Four things move in this section. Three travel with the cut and one does
 *   not. Written out in full in tools/blocks/cn-about-projects.css.
 *
 *     travels    the pill's blur — IX2 `e-225` SCROLL_INTO_VIEW → `a-33` (and
 *                `e-226` to stop it), bound to the `.subtitle-block`'s
 *                data-w-id. The export writes it page-scoped
 *                (`695c47e4e7da0bba805165a1|2c7b9291-…`); donor-lib strips the
 *                page id, which is the whole reason it exists.
 *     travels    the second block's parallax — `e-227` SCROLLING_IN_VIEW →
 *                `a-34`, on `.case-study-block._02`'s data-w-id,
 *                `mediaQueries: ["main"]`.
 *     travels    each tile's hover — `e-228` MOUSE_OVER → `a-35` and `e-229`
 *                MOUSE_OUT → `a-36`, four times, on the four
 *                `.case-study-link` data-w-ids, plus the plain css
 *                `.case-arrow-wrap:hover { transform: scale(1.1) }` and
 *                `.main-button:hover { transform: scale(.95) }`.
 *     does not   the button label's roll (ix3 timeline `t-bf9e6807`, trigger
 *                `i-84a682e6` on `.main-button`) and the heading's two-line rise
 *                (ix3 `t-864fc814`, trigger `i-9f439e20` on `.heading-wrap`).
 *                ix3 is GSAP data and donor-lib returns `{events, actionLists}`
 *                (IX2) only. The label's roll is replayed with a css transition
 *                in tools/blocks/cn-about-projects.css, where it reproduces the
 *                timeline exactly and in both directions. The heading's rise is
 *                NOT replayed: it needs an observer, i.e. a script, and this
 *                block ships none — cn-service, which draws the same two masked
 *                lines, does not replay it either. Nothing in this block's css
 *                hides the heading, so a page that runs no script simply shows
 *                it, which is the guarantee cn-produce.css and cn-about.css both
 *                write down for their own replays.
 */
import { readFileSync } from 'node:fs';
import { setText, setTextAll, splitRepeat, DONORS } from '../block-lib.mjs';

/* ------------------------------------------------------------- the cut -- */

/** Unique in cinery's index.html (checked: one occurrence). */
const START = '<section class="section-home-projects">';
/**
 * The end of the section, and it has to be this long. The obvious anchor —
 * `<div class="dividing-line"></div></div></div></section>` — appears FOUR
 * times in index.html, so the cut would be decided by whichever section happens
 * to close first after the start. From the last tile's `</a>` the string is
 * unique (checked: one occurrence), and it closes the list item, its list, its
 * collection wrapper, the component grid, `.case-study-block._02`, the
 * component and `.padding-section-large`, then draws the rule and closes the
 * container, the gutter and the section.
 */
const END = '</a></div></div></div></div></div></div></div><div class="dividing-line"></div></div></div></section>';

/* ------------------------------------------------------------- the clips -- */

const CLIPS = 4;

/** The mirror donor-lib rewrites cinery's CDN urls into; its default for this donor. */
const MIRROR = 'assets/cinery';
/** Exactly donor-lib's own `localName()`, so a pre-mapped url lands on the file it fetches. */
const localName = (url) => `${MIRROR}/${decodeURIComponent(url.split('?')[0].split('/').pop()).replace(/[^\w.\-]+/g, '_')}`;

/**
 * The four clips, read off the donor page, in the order the grid draws them:
 * `{ poster, mp4, webm }` of CDN urls per tile, and the local file each one is
 * mirrored to. Read at module scope because `donor.images` is extraction-time
 * configuration and has no ctx; render() asserts the same twelve files against
 * the fragment it is handed, so a re-cut cannot leave the map and the markup
 * disagreeing.
 */
function donorClips() {
  const page = readFileSync(`${DONORS.cinery.dir}/index.html`, 'utf8');
  const a = page.indexOf(START);
  if (a < 0) throw new Error('cn-about-projects: cinery index.html has no section.section-home-projects');
  const b = page.indexOf(END, a);
  if (b < 0) throw new Error('cn-about-projects: the projects section does not close where this block expects');
  const cut = page.slice(a, b + END.length);
  const tiles = [...cut.matchAll(/data-poster-url="([^"]+)" data-video-urls="([^"]+)"/g)];
  if (tiles.length !== CLIPS) {
    throw new Error(`cn-about-projects: cinery draws ${CLIPS} tiles, each with one clip; found ${tiles.length}`);
  }
  return tiles.map(([, poster, pair]) => {
    const [mp4, webm] = pair.split(',');
    if (pair.split(',').length !== 2) throw new Error(`cn-about-projects: expected mp4,webm in data-video-urls, got ${pair}`);
    if (!/\.mp4$/.test(mp4) || !/\.webm$/.test(webm)) {
      throw new Error(`cn-about-projects: data-video-urls is not an mp4 then a webm: ${pair}`);
    }
    return { poster, mp4, webm };
  });
}

const CLIP_URLS = donorClips();
/** The twelve mirrored files, `{ poster, mp4, webm }` per tile. render() checks every one. */
const CLIP_FILES = CLIP_URLS.map(({ poster, mp4, webm }) => ({
  poster: localName(poster), mp4: localName(mp4), webm: localName(webm),
}));

/**
 * Webflow writes each background video's urls in four places, and the
 * extractor's url scanner (`/https?:\/\/cdn\.prod\.website-files\.com\/[^\s"')]+/`)
 * can only read two of them:
 *
 *   data-poster-url="…jpg"                     ends at a quote — clean
 *   <source src="…mp4">                        ends at a quote — clean
 *   data-video-urls="…mp4,…webm"               TWO urls joined by a comma, and
 *                                              a comma is not a terminator
 *   <video style="background-image:url(&quot;…jpg&quot;)">   the closing quote is
 *                                              an entity, so the url swallows it
 *
 * The scanner takes each of the last two as one url, asks the CDN for that and
 * gets a 403. `images` is an exact-string map applied BEFORE the scan, so those
 * two shapes are pre-mapped here to exactly the local names the mirror gives the
 * clean copies — the comma-joined pair to the two local paths joined by the same
 * comma, and the `&quot;`-wrapped poster with its entity kept. The clean poster
 * and the two `<source src>`s are deliberately NOT mapped: they are what
 * donor-lib's scan rewrites and records in `out.assets`, which is what lists the
 * twelve files in tools/fragments/donor-assets.json for
 * tools/mirror-donor-assets.mjs to fetch.
 *
 * This is not a substitution. Every one of the twelve is the donor's own file,
 * served from this origin instead of Webflow's. See WHAT THE PICTURES ARE in the
 * header, including what the still-image version of this block did instead and
 * why it was reverted.
 */
function clipMaps() {
  const images = {};
  for (const { poster, mp4, webm } of CLIP_URLS) {
    images[`${mp4},${webm}`] = `${localName(mp4)},${localName(webm)}`;
    images[`${poster}&quot;`] = `${localName(poster)}&quot;`;
  }
  if (Object.keys(images).length !== CLIPS * 2) {
    throw new Error(`cn-about-projects: expected ${CLIPS * 2} pre-mapped url shapes (a pair and a poster per tile), `
      + `got ${Object.keys(images).length} — two tiles share a clip?`);
  }
  return images;
}

/** This site's own mark, in the slot cinery filled with a client's. */
const WORDMARK = 'assets/brand/stargo-wordmark.png';

/** Where the four tiles and the button now go. See the header. */
const DEST = 'workforce.html';

export const donor = {
  id: 'cn-about-projects',
  donor: 'cinery',
  scope: '.cn-about-projects',
  page: 'index.html',
  /* donor-lib matches both anchors against the RAW donor page, before the `cn-`
     namespace is applied, so these are cinery's own class names; every selector
     inside render() below is the prefixed form the fragment carries. */
  start: START,
  end: END,

  /* Not a substitution: the same donor files the mirror fetches, written in the
     two shapes the extractor cannot scan. The clean poster and the two
     `<source src>`s are left for donor-lib's own rewrite, which is what records
     the twelve files in tools/fragments/donor-assets.json. See clipMaps(). */
  images: clipMaps(),

  /* Four different logoipsum marks, one per tile, drawn twice each for the
     hover roll — a client's logo in a client-logo slot, and the one thing in
     this band that is substituted rather than mirrored. A stem catches all four
     and any responsive variant in one line. Nothing else is mapped: the arrow
     glyphs are inline `w-embed` svg and carry no url at all, so what is left
     off-origin is the four clips, which `mirror` (the default, assets/cinery)
     rewrites and records. See WHAT MUST NOT COME BACK in the header. */
  imageStems: { logoipsum: WORDMARK },

  /* `.section-home-projects` carries no rule at all in cinery's stylesheet
     (checked: the class appears nowhere in cinery.app.shared.3e3418b8f.css), and
     everything drawn in it is white type, a #232324 button and two translucent
     greys — `.background-glass` is #5c5c5c1a, the pill is #70707026, the arrow
     is #ffffff1a. All of that only reads against cinery's
     `body { background-color: var(--background-color--primary-background) }`,
     which is #000. Same case as cn-service and cn-produce, and the same
     declaration. The About page's own ground is #000002 — `.lx-scope`
     (css/stargo-fusion.css:137) inside `body.lx-page` (:153) — two parts in 255
     of blue away, so the band sits on the page without a seam. */
  ground: '#000',
};

/* ------------------------------------------------------- the donor's copy -- */

/** The eyebrow, the two heading lines and the button label, as the cut ships them. */
const DONOR_SUBTITLE = 'Selected Projects';
const DONOR_H2 = ['Case', 'Studies'];
const DONOR_BUTTON_LABEL = 'Explore More';
const DONOR_BUTTON_HREF = 'href="case-studies.html"';
/** One per tile, in the order the grid draws them. */
const DONOR_TILE_HREFS = ['project_visage.html', 'project_horizon.html', 'project_beyond.html', 'project_stride.html'];
/** The client each tile named, twice over in its two logo copies. */
const DONOR_CLIENTS = ['Visage', 'Horizon', 'Beyond', 'Stride'];
/** The separator between the client and the year. See THE TWO SLOTS in the header. */
const DONOR_BULLET = '<div class="cn-text-size-medium">•</div>';
const EMPTY_BULLET = '<div class="cn-text-size-medium"></div>';

/**
 * The two heading lines. See THE HEADING in the header for the measurements and
 * for why this is not 「数字员工」/"AI Workforce", which is what the pill above it
 * says. Both lines in both languages are lifted out of `LX_WORKFORCE.heroDesc`
 * (「AI 团队已经上线。」 / "Your AI team is already online.") and asserted against
 * it below, so no word here is this module's invention — the same way
 * tools/blocks/cn-about-reviews.mjs takes its own 「四个」/"Four".
 */
const HEADING_TOP = { zh: 'AI', en: 'AI' };
const HEADING_BOTTOM = { zh: '团队', en: 'Team' };

/* Latin that is allowed to stand on the Chinese page: product names, which the
   brief exempts. 「288 位 AI 员工」 and three of the four role labels carry `AI`,
   so this block cannot use cn-service's blanket "no Latin on the zh page" test;
   the check at the foot names what survived instead of only saying that
   something did. */
const PRODUCT_WORDS = new Set(['STARGO', 'WORK', 'CRM', 'AI', 'SKU', 'SEO', 'OS', 'PI', 'QC']);

/**
 * A line this module draws has to still be inside the copy.mjs string it was
 * read out of, in both languages, or it has become this module's own words.
 * English is compared case-blind because `.heading-style-h2` is
 * `text-transform: uppercase` and the sentence it comes from is a sentence.
 * Lifted verbatim from tools/blocks/cn-about-reviews.mjs, which needs the same
 * guarantee for the same donor's other split heading on the same page.
 */
function assertInside(part, whole, what) {
  for (const lang of ['zh', 'en']) {
    const hay = lang === 'en' ? whole[lang].toLowerCase() : whole[lang];
    const needle = lang === 'en' ? part[lang].toLowerCase() : part[lang];
    if (!hay.includes(needle)) {
      throw new Error(`cn-about-projects: ${what} is "${part[lang]}", which is no longer part of `
        + `copy.mjs's own "${whole[lang]}" (${lang})`);
    }
  }
}

export function render(frag, ctx) {
  const { C, lang, t, escapeHtml } = ctx;
  if (lang !== 'zh' && lang !== 'en') throw new Error(`cn-about-projects: unknown lang ${lang}`);
  if (!DONORS[donor.donor]) throw new Error(`cn-about-projects: donor ${donor.donor} is not registered`);

  /* ------------------------------------------------------------ the copy -- */

  const roles = C.ABOUT?.circles;
  if (!Array.isArray(roles)) throw new Error('cn-about-projects: copy.mjs ABOUT has no circles list');
  roles.forEach((r, i) => {
    if (!r?.label || typeof r.label.zh !== 'string' || typeof r.label.en !== 'string') {
      throw new Error(`cn-about-projects: ABOUT.circles[${i}] has no {zh,en} label`);
    }
  });

  /* The heading, both lines, out of the one sentence copy.mjs already uses to
     describe what these four tiles are. See THE HEADING in the header. */
  const heroDesc = C.LX_WORKFORCE?.heroDesc;
  if (!heroDesc?.zh || !heroDesc?.en) {
    throw new Error('cn-about-projects: LX_WORKFORCE.heroDesc is gone; the split heading has nothing to be read out of');
  }
  assertInside(HEADING_TOP, heroDesc, "the heading's first line");
  assertInside(HEADING_BOTTOM, heroDesc, "the heading's second line");
  /* The capability page's own heading, which this one used to repeat. Kept as a
     check, not as copy: if the two ever say the same thing again, say so here
     rather than on two pages. */
  const S = C.CAPABILITY_SHOWCASE;
  if (!S?.headlineTop || !S?.headlineBottom) {
    throw new Error('cn-about-projects: CAPABILITY_SHOWCASE needs headlineTop and headlineBottom to be checked against');
  }
  for (const [ours, theirs, which] of [[HEADING_TOP, S.headlineTop, 'first'], [HEADING_BOTTOM, S.headlineBottom, 'second']]) {
    if (ours.zh === theirs.zh || ours.en.toLowerCase() === theirs.en.toLowerCase()) {
      throw new Error(`cn-about-projects: the ${which} heading line is CAPABILITY_SHOWCASE's own `
        + `("${theirs.zh}" / "${theirs.en}") — that is capabilities.html's heading, not about.html's`);
    }
  }

  const store = C.LX_WORKFORCE?.store1;
  if (!store?.name) throw new Error('cn-about-projects: LX_WORKFORCE.store1 has no name for the button label');

  /* The eyebrow is the navigation's own name for the page every link in this
     block now goes to, found by href so a rename cannot strand it. */
  const dest = C.NAV.find((n) => n.href === DEST);
  if (!dest) throw new Error(`cn-about-projects: NAV has no ${DEST} entry to name the eyebrow`);

  /* ----------------------------------------------------------- the shape -- */

  /* Assert the cut is what this module was written against, before a single
     word is replaced. A silent miss here ships cinery's own clients to
     production, which is the one failure tools/blocks/README.md names. */
  const links = (frag.match(/class="cn-case-study-link w-inline-block"/g) ?? []).length;
  if (links !== CLIPS) throw new Error(`cn-about-projects: cinery draws ${CLIPS} tiles, found ${links} .case-study-link`);
  const lists = (frag.match(/<div class="w-dyn-list">/g) ?? []).length;
  if (lists !== CLIPS) throw new Error(`cn-about-projects: each tile sits in its own collection list — expected ${CLIPS}, found ${lists}`);
  const logos = (frag.match(/class="cn-case-logo"/g) ?? []).length;
  if (logos !== CLIPS * 2) throw new Error(`cn-about-projects: each tile stacks two logo copies for its roll — expected ${CLIPS * 2}, found ${logos}`);
  const clips = (frag.match(/class="cn-case-video w-background-video w-background-video-atom"/g) ?? []).length;
  if (clips !== CLIPS) throw new Error(`cn-about-projects: expected ${CLIPS} background videos, found ${clips}`);
  const blocks = (frag.match(/class="cn-case-study-block cn-_0[12]"/g) ?? []).length;
  if (blocks !== 2) throw new Error(`cn-about-projects: the grid is two .case-study-block rows, found ${blocks}`);
  const labels = (frag.match(/class="cn-button-text"/g) ?? []).length;
  if (labels !== 2) throw new Error(`cn-about-projects: the roll-over button stacks two .button-text copies, found ${labels}`);
  const said = (frag.match(new RegExp(`>${DONOR_BUTTON_LABEL}<`, 'g')) ?? []).length;
  if (said !== 2) throw new Error(`cn-about-projects: expected both button copies to read "${DONOR_BUTTON_LABEL}", found ${said}`);
  /* Six interactions hang on this cut: the pill, the four tiles and the second
     block's parallax. They are what makes it move; none is touched below. */
  const wids = (frag.match(/data-w-id="/g) ?? []).length;
  if (wids !== 6) throw new Error(`cn-about-projects: expected six data-w-id (pill, ${CLIPS} tiles, block 02), found ${wids}`);
  if (!frag.includes('class="cn-dividing-line"')) {
    throw new Error('cn-about-projects: the rule that closes the band is not in the cut — the end anchor has moved');
  }
  for (const line of DONOR_H2) {
    if (!frag.includes(`<h2 class="cn-heading-style-h2">${line}</h2>`)) {
      throw new Error(`cn-about-projects: the split heading has lost its "${line}" line`);
    }
  }
  if (!frag.includes(`<div class="cn-subtitle">${DONOR_SUBTITLE}</div>`)) {
    throw new Error(`cn-about-projects: the eyebrow pill no longer reads "${DONOR_SUBTITLE}"`);
  }
  /* Each background-video box still holds its `<video>`, its poster and its two
     `<source>`s. cinery's own clips are what these tiles play; a box that lost
     its player would be a tile drawing nothing. */
  const players = (frag.match(/<video\b/g) ?? []).length;
  if (players !== CLIPS) throw new Error(`cn-about-projects: expected ${CLIPS} <video> elements, one per tile, found ${players}`);
  const sources = (frag.match(/<source\b/g) ?? []).length;
  if (sources !== CLIPS * 2) {
    throw new Error(`cn-about-projects: each clip ships an mp4 and a webm <source> — expected ${CLIPS * 2}, found ${sources}`);
  }
  for (const attr of ['data-poster-url', 'data-video-urls', 'data-autoplay', 'data-loop']) {
    const n = (frag.match(new RegExp(`${attr}="`, 'g')) ?? []).length;
    if (n !== CLIPS) throw new Error(`cn-about-projects: expected ${CLIPS} ${attr} attributes, one per tile, found ${n}`);
  }
  /* The clips' four url shapes were all pointed at the mirror at extraction —
     two by donor-lib's scan, two by clipMaps() ahead of it. If that ever stops
     happening the page fetches from Webflow on every load — the failure that hid
     in renok's hero for a week. */
  if (frag.includes('cdn.prod.website-files.com')) {
    throw new Error('cn-about-projects: a Webflow CDN url survived the cut — check clipMaps() against the donor page');
  }
  /* And every one of them must have landed on the twelve files this block
     expects, spelled exactly as tools/mirror-donor-assets.mjs writes them. The
     set is compared both ways: a missing file means a url went somewhere else, an
     extra one means the cut picked up cinery media this block does not know
     about. Nothing else in the band is a cinery file — the logos are the
     wordmark and the arrows are inline svg. */
  const want = CLIP_FILES.flatMap((f) => [f.poster, f.mp4, f.webm]);
  const kept = [...new Set(frag.match(/assets\/cinery\/[\w.\-]+/g) ?? [])];
  const lost = want.filter((f) => !kept.includes(f));
  const extra = kept.filter((f) => !want.includes(f));
  if (lost.length || extra.length) {
    throw new Error("cn-about-projects: the cut no longer points at cinery's four mirrored clips"
      + `${lost.length ? `\n  missing: ${lost.join(', ')}` : ''}`
      + `${extra.length ? `\n  unexpected: ${extra.join(', ')}` : ''}`);
  }
  /* And each of the twelve stands in both places Webflow writes it: the poster in
     `data-poster-url` and again in the `<video>`'s inline background-image, the
     mp4 and the webm in `data-video-urls` and again in a `<source src>`. This is
     what catches a clipMaps() entry that stopped matching — the comma-joined pair
     and the `&quot;`-wrapped poster are the two the url scan cannot repair. */
  const PER_URL = 2;
  CLIP_FILES.forEach((files, i) => {
    for (const which of ['poster', 'mp4', 'webm']) {
      const n = (frag.match(new RegExp(files[which].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length;
      if (n !== PER_URL) {
        throw new Error(`cn-about-projects: tile ${i + 1}'s ${which} ${files[which]} should stand in both places that url `
          + `is written, found ${n} — check clipMaps()`);
      }
    }
  });
  const marks = (frag.match(new RegExp(`src="${WORDMARK}"`, 'g')) ?? []).length;
  if (marks !== CLIPS * 2) {
    throw new Error(`cn-about-projects: expected donor.imageStems to have replaced ${CLIPS * 2} logoipsum marks with the wordmark, found ${marks}`);
  }

  /* ------------------------------------------------------------ the cut --- */

  /* Four tiles, four roles, so nothing is cloned and nothing is dropped: the
     units are cut where they stand and filled one for one. The last unit runs
     to the end of the fragment — it carries the closing tail with it — so the
     tail is empty by construction. */
  const OPEN = '<div class="w-dyn-list">';
  const { head, units, tail } = splitRepeat(frag, OPEN, frag.length);
  if (units.length !== CLIPS) throw new Error(`cn-about-projects: splitRepeat found ${units.length} tiles, expected ${CLIPS}`);
  if (tail !== '') throw new Error(`cn-about-projects: expected the last tile to carry the closing tail, found ${tail.length} characters after it`);
  if (units.length !== roles.length) {
    throw new Error(`cn-about-projects: cinery draws ${units.length} tiles and ABOUT.circles carries ${roles.length} AI-employee roles. `
      + 'They are filled one for one and never cloned: every tile holds its own clip and its own #w-node id, '
      + 'so re-emitting a unit would repeat both.');
  }

  /* --------------------------------------------------------- the opening -- */

  /* Two h2s carrying the same class, one per line box. The gradient is painted
     on each line separately with `background-clip: text` and each sits inside
     its own `overflow: hidden` mask, so the two lines are filled where they
     stand rather than restructured into one. */
  const BOTTOM = 'class="cn-bottom-title"';
  const splitAt = head.indexOf(BOTTOM);
  if (splitAt < 0) throw new Error('cn-about-projects: .bottom-title is not in the cut — the split heading needs both lines');
  const top = head.slice(0, splitAt);
  const bottom = head.slice(splitAt);
  if (!top.includes('class="cn-top-title"')) {
    throw new Error('cn-about-projects: .top-title is not in the cut before .bottom-title');
  }
  /* One h2 each side of the split, because `setText` fills the FIRST match it
     finds: two on one side would leave the donor's other word on the page. */
  const h2 = (s) => (s.match(/class="cn-heading-style-h2"/g) ?? []).length;
  if (h2(top) !== 1 || h2(bottom) !== 1) {
    throw new Error(`cn-about-projects: the split heading needs one h2 per line box, found ${h2(top)} above .bottom-title and ${h2(bottom)} below it`);
  }

  let open = setText(top, 'cn-heading-style-h2', escapeHtml(t(HEADING_TOP)))
    + setText(bottom, 'cn-heading-style-h2', escapeHtml(t(HEADING_BOTTOM)));

  /* The pill: one short line, `line-height: 1` inside an `overflow: hidden`
     box, so it holds the navigation's own two-word name for the destination and
     nothing longer. cinery's own "SELECTED PROJECTS" is seventeen characters;
     "AI WORKFORCE" is twelve. */
  open = setText(open, 'cn-subtitle', escapeHtml(t(dest.label)));

  /* Two stacked copies inside a 1.125rem `overflow: hidden` window; the hover
     rolls the first out and the second in, so both have to carry the same word.
     Write one and the roll shows the donor's. */
  open = setTextAll(open, 'cn-button-text', escapeHtml(t(store.name)));

  if (!open.includes(DONOR_BUTTON_HREF)) {
    throw new Error(`cn-about-projects: the button no longer carries ${DONOR_BUTTON_HREF}`);
  }
  open = open.split(DONOR_BUTTON_HREF).join(`href="${DEST}"`);

  /* ------------------------------------------------------------ the tiles -- */

  const filled = units.map((unit, i) => fillTile(unit, roles[i], i));

  let html = open + filled.join('');

  /* -------------------------------------------------------- what is left -- */

  /* Every tile still plays the clip the donor put in it. Checked again on the
     rendered block, after the tiles are back together, so a unit that lost its
     box inside fillTile cannot hide inside the join. */
  const played = (html.match(/<video\b/g) ?? []).length;
  if (played !== CLIPS) {
    throw new Error(`cn-about-projects: expected one <video> per tile (${CLIPS}) in the rendered block, found ${played}`);
  }
  const shippedSources = (html.match(/<source\b/g) ?? []).length;
  if (shippedSources !== CLIPS * 2) {
    throw new Error(`cn-about-projects: expected an mp4 and a webm <source> per tile (${CLIPS * 2}) in the rendered block, `
      + `found ${shippedSources}`);
  }
  for (const attr of ['data-poster-url', 'data-video-urls', 'data-autoplay', 'data-loop']) {
    const n = (html.match(new RegExp(`${attr}="`, 'g')) ?? []).length;
    if (n !== CLIPS) {
      throw new Error(`cn-about-projects: the rendered block should carry ${CLIPS} ${attr} attributes, one per tile, found ${n}`);
    }
  }

  /* The `src` attributes are read out first: what is tested is what the block
     SAYS. */
  const spoken = html.replace(/<[^>]+>/g, ' ');
  const survived = [DONOR_SUBTITLE, ...DONOR_H2, DONOR_BUTTON_LABEL, ...DONOR_CLIENTS, 'Cinery']
    .filter((w) => spoken.includes(w));
  if (survived.length) throw new Error(`cn-about-projects: donor copy survives in the rendered block: ${survived.join(', ')}`);
  /* A year in this slot would be an invented date. All four are gone with it. */
  const years = spoken.match(/\b(19|20)\d{2}\b/g);
  if (years) throw new Error(`cn-about-projects: a year survives in the tile line: ${[...new Set(years)].join(', ')}`);
  const donorHrefs = [...DONOR_TILE_HREFS, 'case-studies.html'].filter((h) => html.includes(h));
  if (donorHrefs.length) {
    throw new Error(`cn-about-projects: links to pages this site does not have survive: ${donorHrefs.join(', ')}`);
  }
  if (html.includes('logoipsum')) throw new Error('cn-about-projects: a logoipsum client mark survives in the rendered block');
  /* The same two checks the cut was given, asked again of what actually ships —
     so no path through this module can put a fetch to Webflow on about.html, or
     drop a clip on the way through. */
  if (html.includes('cdn.prod.website-files.com')) {
    throw new Error('cn-about-projects: the rendered block fetches from Webflow — every clip url must be local');
  }
  const shipped = [...new Set(html.match(/assets\/cinery\/[\w.\-]+/g) ?? [])];
  const missing = want.filter((f) => !shipped.includes(f));
  const strange = shipped.filter((f) => !want.includes(f));
  if (missing.length || strange.length) {
    throw new Error("cn-about-projects: the rendered block does not point at cinery's four mirrored clips"
      + `${missing.length ? `\n  missing: ${missing.join(', ')}` : ''}`
      + `${strange.length ? `\n  unexpected: ${strange.join(', ')}` : ''}`);
  }

  /* 「不是所有的观众都能看得懂英文」: the Chinese page carries Chinese, and the
     only Latin allowed to stand in it is a product name. The inline arrow svgs
     are stripped with every other tag above, so `xmlns` and `viewBox` are not
     read as words. */
  if (lang === 'zh') {
    const stray = [...new Set(spoken.match(/[A-Za-z]{2,}/g) ?? [])].filter((w) => !PRODUCT_WORDS.has(w.toUpperCase()));
    if (stray.length) throw new Error(`cn-about-projects: English on the Chinese page: ${stray.join(', ')}`);
  }

  return html;

  /**
   * One tile. Three text slots sit in its `.case-study-item`: the client's name,
   * the "•" and the year. The first becomes the role; the other two are emptied.
   * See THE TWO SLOTS THAT ARE LEFT EMPTY in the header before changing this.
   */
  function fillTile(unit, role, i) {
    const names = (unit.match(/class="[^"]*cn-text-style-allcaps[^"]*"/g) ?? []).length;
    const seconds = (unit.match(/class="[^"]*cn-text-color-secondary[^"]*"/g) ?? []).length;
    const mediums = (unit.match(/class="cn-text-size-medium"/g) ?? []).length;
    if (names !== 1 || seconds !== 1 || mediums !== 1) {
      throw new Error(`cn-about-projects: tile ${i + 1}: expected one name, one separator and one year slot, found ${names}, ${mediums} and ${seconds}`);
    }

    /* The name slot. `text-style-allcaps` is `text-transform: uppercase`, which
       draws the product name on the English page and leaves the Chinese one
       alone. Measured against the donor's own letter widths at the pill's
       1.25rem, the longest of the four — MARKET SIGNAL AGENT — is 248px in the
       298px this line has at 992, the narrowest width the two-column tile grid
       is used at. */
    let u = setText(unit, 'cn-text-style-allcaps', escapeHtml(t(role.label)));

    /* The year, and then the separator that pointed at it. Both elements, both
       classes and both `#w-node-…` placements stay exactly where the donor put
       them; only the words go. */
    u = setText(u, 'cn-text-color-secondary', '');
    if (!u.includes(DONOR_BULLET)) {
      throw new Error(`cn-about-projects: tile ${i + 1} has no ${DONOR_BULLET} to empty`);
    }
    u = u.split(DONOR_BULLET).join(EMPTY_BULLET);

    /* The tile's own link, and the alt on both copies of its mark. */
    const href = `href="${DONOR_TILE_HREFS[i]}"`;
    if (!u.includes(href)) throw new Error(`cn-about-projects: tile ${i + 1} no longer carries ${href}`);
    u = u.split(href).join(`href="${DEST}"`);

    const alt = `alt="${DONOR_CLIENTS[i]}"`;
    const alts = (u.match(new RegExp(alt, 'g')) ?? []).length;
    if (alts !== 2) throw new Error(`cn-about-projects: tile ${i + 1}: expected two × ${alt}, found ${alts}`);
    u = u.split(alt).join('alt="STARGO"');

    /* The media box is not touched at all: the wrapper keeps its four
       background-video attributes, the `<video>` keeps its poster, its two
       `<source>`s, its autoplay/loop/muted/playsinline and its `#…-video` id, and
       every url in it is already this site's own copy of the donor's file. See
       WHAT THE PICTURES ARE in the header before changing that — it records the
       still-image version that stood here and why it was reverted. */
    const box = /<div(?:\s+[a-z-]+="[^"]*")*?\s+class="cn-case-video w-background-video w-background-video-atom">(<video\b[^>]*>[\s\S]*?<\/video>)<\/div>/;
    const m = u.match(box);
    if (!m) {
      throw new Error(`cn-about-projects: tile ${i + 1}: no .case-video background-video box holding one <video> — `
        + 'the cut has changed shape, re-read WHAT THE PICTURES ARE before editing');
    }
    if ((m[1].match(/<source\b/g) ?? []).length !== 2) {
      throw new Error(`cn-about-projects: tile ${i + 1}: its clip no longer ships both an mp4 and a webm <source>`);
    }
    for (const which of ['poster', 'mp4', 'webm']) {
      if (!u.includes(CLIP_FILES[i][which])) {
        throw new Error(`cn-about-projects: tile ${i + 1} does not play its clip — ${CLIP_FILES[i][which]} is not in the tile`);
      }
    }

    return u;
  }
}

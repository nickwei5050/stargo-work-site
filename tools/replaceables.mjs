/**
 * Reserved visual slots for the STARGO WORK marketing site (stargo.pages.dev).
 *
 * This is the list to edit when a hero film, a module card, a product
 * screenshot, or the share cover is replaced. The human-readable map is
 * assets/replaceables/README.md.
 *
 * Two kinds of path:
 *   - A token `assets/stargo/<id>.<ext>` is what the generator writes.
 *     tools/editorial-images.mjs rewrites that prefix to
 *     `assets/stargo-editorial/` before the page is saved. The file on disk
 *     is the editorial path. Do not write the editorial path into a token
 *     slot: the rewrite would run twice.
 *   - A product path (`assets/stargo-product/…`) or the hero film
 *     (`assets/stargo-motion/…`) is written as the final URL. Overwrite that
 *     file, including its width variants, and leave the name alone.
 *   - An owner photograph (`assets/stargo-photo/<id>-<width>.webp`, registered
 *     in tools/imagegen/photo-assets.json; AI-generated, captioned as such by
 *     tools/editorial-images.mjs) is written as the final URL too, but never
 *     overwritten: /assets is cached immutable for a year, so a new picture
 *     gets a new id and tools/imagegen/prepare-photos.mjs writes it (it
 *     refuses to replace a file with different bytes).
 *
 * The Open Graph file stays `og-cover.png` at 1200×630. Renaming it means
 * updating OG.token, OG.file, and every built meta tag together.
 *
 * Nothing here is new artwork. Every id is a file that already ships.
 */

/** Generator token. Rewritten to assets/stargo-editorial/ at page-write time. */
export const editorialToken = (id, ext = 'webp') => `assets/stargo/${id}.${ext}`;
/** File on disk, and the URL after the editorial rewrite. */
export const editorialFile = (id, ext = 'webp') => `assets/stargo-editorial/${id}.${ext}`;
/** Owner product screenshot. Written as this path; width variants sit beside it. */
export const productFile = (id) => `assets/stargo-product/${id}.webp`;
/** Owner photograph: its widest file. The narrower ones carry their own width in the name. */
export const photoFile = (id, width = 2048) => `assets/stargo-photo/${id}-${width}.webp`;

/** Share cover. chrome.mjs writes `token`; pages publish `file`. */
export const OG = {
  token: editorialToken('og-cover', 'png'),
  file: editorialFile('og-cover', 'png'),
  width: 1200,
  height: 630,
};

/**
 * Homepage sticky video grid (the Fearless Vision centre film plus the
 * stills around it, under 「同一个工作空间，连接日常经营。」). `theatre[centreIndex]`
 * is replaced by `film` / `poster` and is not shown as a still. The opening
 * overlay (tools/blocks/og-intro.mjs) has no image file.
 *
 * Since 2026-10-21 the six stills are the owner's photographs
 * (site-images/batch-3, W01–W06): trade office, workshop, warehouse, QC
 * room, owner's office, showroom. They replaced the os-* stills here only; the
 * os-* files keep their other places (hero mosaic, photo strips, dashboard and
 * slide images, other pages).
 */
export const HERO = {
  film: 'assets/stargo-motion/orbit.mp4',
  poster: 'assets/stargo-motion/orbit-poster.webp',
  centreIndex: 3,
  theatre: [
    photoFile('w01-trade-office'),
    photoFile('w02-workshop'),
    photoFile('w03-warehouse'),
    editorialToken('os-desktop'),
    photoFile('w04-qc-lab'),
    photoFile('w05-owner-office'),
    photoFile('w06-showroom'),
  ],
};

/**
 * The side menu's 预约企业演示 contact card, on every page that has the menu
 * (tools/chrome.mjs): a still photograph where the magical-orb clip played
 * (G02, 2026-10-21). The orb clip stays everywhere else it is drawn — the
 * navbar logo and the pricing cards.
 */
export const MENU_CARD = photoFile('g02-menu-harbour-night', 768);

/**
 * Capability page, 「每项 工作」 ring (tools/blocks/cn-produce.mjs): cards that
 * show a still photograph instead of their clip, by the clip's video id.
 * W02 (2026-10-21) takes the outer ring's video-15 card and the inner ring's
 * card that repeats video-11.
 *
 * Since the owner's batches 1, 2 and 6 (2026-10-21) every card is a still.
 * The outer ring's thirteen clips take H01-H10, P03, C08 and W02 in DOM order;
 * the inner ring repeats the outer ring's clips, so each of its cards takes the
 * still of the clip it repeats (video-10 twice: H09 both times), except the
 * second repeat of video-11, which takes C08 instead of a second P03 so every
 * still is in the inner ring too. The ids are the manifests' own.
 */
export const RING_STILLS = {
  /* outer ring */
  '883ab066-dd39-71d8-e308-0e0f4d18fa80': photoFile('h01-port-blue-hour', 1024),      // video-8
  '883ab066-dd39-71d8-e308-0e0f4d18fa82': photoFile('h02-night-inquiry', 1024),       // video-2
  '883ab066-dd39-71d8-e308-0e0f4d18fa84': photoFile('h03-sample-wall', 1024),         // video-1
  '883ab066-dd39-71d8-e308-0e0f4d18fa86': photoFile('h04-caliper-qc', 1024),          // video-6
  '883ab066-dd39-71d8-e308-0e0f4d18fa88': photoFile('h05-assembly-line', 1024),       // video-4
  '883ab066-dd39-71d8-e308-0e0f4d18fa8a': photoFile('h06-packing', 1024),             // video-3
  '883ab066-dd39-71d8-e308-0e0f4d18fa8c': photoFile('h07-owner-walk', 1024),          // video-7
  '883ab066-dd39-71d8-e308-0e0f4d18fa8e': photoFile('h08-product-shoot', 1024),       // video-9
  '883ab066-dd39-71d8-e308-0e0f4d18fa90': photoFile('h09-container-loading', 1024),   // video-10
  '883ab066-dd39-71d8-e308-0e0f4d18fa92': photoFile('h10-video-showing', 1024),       // video014
  '883ab066-dd39-71d8-e308-0e0f4d18fa94': photoFile('p03-fulfilment', 768),           // video-11
  '883ab066-dd39-71d8-e308-0e0f4d18fa96': photoFile('c08-product-references', 1024),  // video-16
  '883ab066-dd39-71d8-e308-0e0f4d18fa98': photoFile('w02-workshop'),                  // video-15
  /* inner ring, in DOM order */
  '883ab066-dd39-71d8-e308-0e0f4d18fa9c': photoFile('h01-port-blue-hour', 1024),      // video-8
  '883ab066-dd39-71d8-e308-0e0f4d18fa9e': photoFile('h03-sample-wall', 1024),         // video-1
  '883ab066-dd39-71d8-e308-0e0f4d18faa0': photoFile('h02-night-inquiry', 1024),       // video-2
  '883ab066-dd39-71d8-e308-0e0f4d18faa2': photoFile('h05-assembly-line', 1024),       // video-4
  '883ab066-dd39-71d8-e308-0e0f4d18faa4': photoFile('h04-caliper-qc', 1024),          // video-6
  '883ab066-dd39-71d8-e308-0e0f4d18faa6': photoFile('h07-owner-walk', 1024),          // video-7
  '883ab066-dd39-71d8-e308-0e0f4d18faa8': photoFile('h06-packing', 1024),             // video-3
  '883ab066-dd39-71d8-e308-0e0f4d18faaa': photoFile('h09-container-loading', 1024),   // video-10
  '883ab066-dd39-71d8-e308-0e0f4d18faab': photoFile('p03-fulfilment', 768),           // video-11
  '883ab066-dd39-71d8-e308-0e0f4d18faad': photoFile('h09-container-loading', 1024),   // video-10 again
  '883ab066-dd39-71d8-e308-0e0f4d18faae': photoFile('h08-product-shoot', 1024),       // video-9
  '883ab066-dd39-71d8-e308-0e0f4d18faaf': photoFile('c08-product-references', 1024),  // video-11, 2nd repeat
  '883ab066-dd39-71d8-e308-0e0f4d18fab1': photoFile('w02-workshop'),                  // video-11 repeat (W02)
  '883ab066-dd39-71d8-e308-0e0f4d18fab3': photoFile('h10-video-showing', 1024),       // video014
};

/**
 * The capability page's other photograph slots (the owner's batches 1, 2, 5
 * and 6, 2026-10-21), each named by the batch manifest with the picture it
 * showed until then. Every path is the photograph's widest file; the blocks
 * write it as the src and tools/editorial-images.mjs adds the narrower widths,
 * the size and the manifest's alt. Crop points are in css/stargo-fusion.css
 * (the "capability page" block). The other places the replaced files appear
 * (the homepage, enterprise, the side menu's slides, the Growth OS rows'
 * hover thumbnails) keep them.
 */
export const CAP_PHOTOS = {
  /* 四个板块，十四类能力 (tools/build-site.mjs): the four area cards, in card
     order, where brand-family-01, os-inquiries, brand-family-02 and
     brand-family-04 were. */
  areas: [
    photoFile('c01-command-growth'),       // 指挥与增长 · #g01
    photoFile('c02-customer-knowledge'),   // 客户与知识 · #g04
    photoFile('c03-commerce-fulfilment'),  // 商务、履约与创作 · #g07
    photoFile('c04-team-management'),      // 员工与管理 · #g10
  ],
  /* 一条业务主线 (tools/blocks/qx-orbit.mjs): the eight thumbnails that orbit
     STARGO WORK, by the qubix file each one replaces (its name without the
     extension; qx-rotated-one … eight, steps 01 and 03-09; step 02 has no
     thumbnail of its own). */
  orbit: {
    '69ad4171521df4f0bc234d0f_Rectangle_9': photoFile('p01-prospecting', 480),          // 01 发现
    '69ad0fbadd6325cf79cf0dea_Rectangle_5': photoFile('h10-video-showing', 1024),       // 03 触达
    '69ad4172e2f6cf6c085066c0_Rectangle_7': photoFile('c05-unified-inbox', 768),        // 04 理解
    '69ad417163eb1d1417d4efe7_Rectangle_11': photoFile('h02-night-inquiry', 1024),      // 05 回复
    '69ad41712a2f75c0ed1f8027_Rectangle_10': photoFile('c07-quote-approval', 768),      // 06 报价
    '69ad4171baff849bf5f57a38_Rectangle_8': photoFile('h09-container-loading', 1024),   // 07 执行
    '69ad41721ce44afffca4eaf8_Rectangle_12': photoFile('d02-follow-up', 1024),          // 08 跟进
    '69ad417169d8a230caca089c_Rectangle_6': photoFile('p05-reorder', 480),              // 09 学习
  },
  /* Growth OS (tools/blocks/cn-service.mjs): the four full-bleed night
     backgrounds under the rows' 65% black wash, in row order (company
     research, trade intelligence, reorder judgement, key decision roles).
     GROWTH_ROWS[].art still names the hover thumbnail of a row with no
     product screen. */
  growth: [
    photoFile('c11-company-research'),
    photoFile('c12-trade-intelligence'),
    photoFile('c13-restock'),
    photoFile('c14-decision-makers'),
  ],
  /* Sales Desk (tools/blocks/qx-news.mjs, through SALES_ROWS): 统一询盘入口 and
     客户全景. The middle row keeps its product screen. */
  inbox: photoFile('c05-unified-inbox', 768),
  customer360: photoFile('c06-customer-360', 1600),
  /* 报价 (tools/blocks/rk-stats.mjs, CAP_V6A.quote.image in tools/copy.mjs). */
  quote: photoFile('c07-quote-approval', 768),
  /* 图片 / 视频 (tools/blocks/cn-faq.mjs): the portrait beside the accordion. */
  creative: photoFile('c08-product-references', 1024),
  /* 让 AI 团队把活干完 (tools/blocks/qx-projects.mjs, CAP_V6A.team.cards in
     tools/copy.mjs): the first two cards. The third keeps its product screen. */
  team: [photoFile('c09-288-flatlay', 1024), photoFile('c10-progress-board', 1024)],
};

/* The demo band behind the glass form (index, capabilities, enterprise) is a
   CSS background: css/stargo-fusion.css sets .photo-section to G01,
   assets/stargo-photo/g01-cta-loading-bay-dusk-2048.webp. */

/**
 * Editorial ids, no extension. Order is the chrome photo-strip cycle
 * (tools/chrome.mjs SCREENS). Published file: editorialFile(id).
 */
export const OS_ART = {
  cockpit: 'os-cockpit',
  salesDesk: 'os-sales-desk',
  inquiries: 'os-inquiries',
  agentCenter: 'os-agent-center',
  quoteStudio: 'os-quote-studio',
  tradeExecution: 'os-trade-execution',
  desktop: 'os-desktop',
  login: 'os-login',
  boot: 'os-boot',
  loading: 'os-loading',
};

/** Released product screenshots. Stems match tools/imagegen/product-assets.json.
 *  gos01, gos09, gos11 and sw033 keep these names; their pixels are the
 *  2026-09-22 curated stills (growth analytics, control centre, workspace
 *  home, sales workbench). */
export const PRODUCT_IDS = {
  workspace: 'sw003-ai-workspace-home',
  experts: 'sw004-experts-library',
  teams: 'sw006-expert-teams',
  workflows: 'sw008-workflow-library',
  inquiry: 'sw028-sales-desk-inquiry-reply',
  documents: 'sw033-sales-desk-document-pack',
  growth: 'gos10-growth-control-tower',
  market: 'gos01-market-thesis',
  reorder: 'gos09-reorder-radar',
  committee: 'gos05-buying-committee',
  reactivation: 'gos11-dormant-reactivation',
  /* Clean captures of the product with demonstration data (2026-10-21,
     site-images/screens-final), cut to the slot that shows them. They replace
     sw033 and gos01 (a live mailbox and an infrastructure panel) and the
     generated renders behind sw028 and brand-family-02. */
  caseDesk: 'live09-sales-desk-case-4x3',
  caseStage: 'live09-sales-desk-case-3x2',
  erpItems: 'live23-erp-items-16x9',
  erpStage: 'live23-erp-items-3x2',
  growthHome: 'live05-growth-home-2x1',
  growthStartThumb: 'live05-growth-home-start-5x4',
  needs: 'live52-mobile-case-needs',
  quoteApproval: 'live18-quote-approval-16x9',
};

export const PRODUCT = Object.fromEntries(
  Object.entries(PRODUCT_IDS).map(([key, id]) => [key, productFile(id)]),
);
/* Names the homepage and notices builders already use. */
PRODUCT.workspaceHome = PRODUCT.workspace;
PRODUCT.expertsLibrary = PRODUCT.experts;
PRODUCT.inquiryReply = PRODUCT.inquiry;
PRODUCT.documentPack = PRODUCT.documents;

/**
 * Hero rotating gallery (tools/blocks/ro-gallery.mjs). Six screens, each
 * shown four times. Stems only; the block adds assets/stargo-product/ and .webp.
 */
export const GALLERY_TILES = [
  PRODUCT_IDS.workspace,
  PRODUCT_IDS.experts,
  PRODUCT_IDS.teams,
  PRODUCT_IDS.workflows,
  PRODUCT_IDS.inquiry,
  PRODUCT_IDS.quoteApproval,
];

/**
 * Homepage core-system cards (Scalora product switcher), desktop and phone.
 * Keys are the start of the slot title in both languages.
 */
export const HOME_MODULES = {
  'Growth OS': PRODUCT.growth,
  'Sales Desk': PRODUCT.caseDesk,
  ERP: PRODUCT.erpItems,
  'AI 创作': editorialToken('os-boot'),
  'AI Creative': editorialToken('os-boot'),
};

/**
 * Homepage five business-stage cards, in page order. `file` is the generator
 * path (a product path, an editorial token or an owner photograph).
 *
 * Since 2026-10-21 all five are the owner's photographs (site-images/batch-2,
 * P01–P05). They replaced, in order, the Growth OS home, the Sales Desk case
 * and the ERP item list (the clean captures placed the same morning), the
 * brand-family-01 illustration and the gos11 workspace home. Those product
 * files keep their other places; the old values are kept here so the owner
 * can put a screen back by swapping one line.
 *   001 PRODUCT.growthHome · 002 PRODUCT.caseStage · 003 PRODUCT.erpStage
 *   004 editorialToken('brand-family-01') · 005 PRODUCT.reactivation
 */
export const HOME_STAGES = [
  { id: 'acquisition', label: '001 主动获客', file: photoFile('p01-prospecting', 480) },
  { id: 'sales', label: '002 外贸销售', file: photoFile('p02-sales', 480) },
  { id: 'fulfillment', label: '003 企业履约', file: photoFile('p03-fulfilment', 768) },
  { id: 'collection', label: '004 回款与服务', file: photoFile('p04-payment-docs', 480) },
  { id: 'reorder', label: '005 复购与改进', file: photoFile('p05-reorder', 480) },
];

/**
 * The homepage's other owner photographs (2026-10-21; site-images/batch-1,
 * batch-2, batch-4 and batch-8), slot by slot. Each value is the photograph's
 * widest file; tools/editorial-images.mjs writes the narrower ones into the
 * srcset, the alt and the size, and css/stargo-fusion.css (the "home" block
 * at its end) the crop point. Only these homepage slots change: every file
 * they replace keeps its other places.
 */
/** The opening mosaic the white hero card shrinks to reveal
 *  (`.hero-photo-wrapper` up and down; tools/chrome.mjs). The mosaic cycles
 *  the os-* stills in a fixed order; each os-* still becomes, wherever it
 *  falls in the mosaic, the photograph the batch-1 manifest names for it
 *  (H01–H10). The cursor tooltip's picture rotator (`.image-text-rotator`)
 *  after it keeps the os-* stills. */
export const HOME_MOSAIC = {
  'os-cockpit': photoFile('h05-assembly-line', 1024),
  'os-sales-desk': photoFile('h02-night-inquiry', 1024),
  'os-inquiries': photoFile('h03-sample-wall', 1024),
  'os-agent-center': photoFile('h06-packing', 1024),
  'os-quote-studio': photoFile('h04-caliper-qc', 1024),
  'os-trade-execution': photoFile('h01-port-blue-hour', 1024),
  'os-desktop': photoFile('h10-video-showing', 1024),
  'os-login': photoFile('h07-owner-walk', 1024),
  'os-boot': photoFile('h08-product-shoot', 1024),
  'os-loading': photoFile('h09-container-loading', 1024),
};
/** The four pain-point cards under the loop band, in page order (S01–S04).
 *  They replaced silo-email, silo-whatsapp, silo-excel and silo-erp. */
export const HOME_SILOS = [
  photoFile('s01-inquiry-rework', 1600),
  photoFile('s02-scattered-chats', 1600),
  photoFile('s03-spreadsheet-memory', 1600),
  photoFile('s04-chasing-order', 2048),
];
/** The four scenario cards' film card (`.testimonials-card._03`): R2, the
 *  trade manager at the whiteboard, as a still where the template's
 *  portrait film played. The split photograph behind the cards
 *  (`.photo-half`, R1) is a CSS background: css/stargo-fusion.css. */
export const HOME_ROLE_CARD = photoFile('r2-trade-manager', 1024);
/** The pricing band's image card beside 企业版 (T01), in place of
 *  brand-glow-square. */
export const HOME_PRICING_CARD = photoFile('t01-enterprise-campus', 1024);
/** The homepage's four newest-article cards (B01–B04), by article slug. A
 *  slug not listed keeps its article cover from assets/blog/. The blog
 *  index, the articles and the share images keep those covers. */
export const HOME_BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
  'approval-gates-for-ai-in-trade': photoFile('b04-approval-handover', 1600),
};

/**
 * Capability page, Growth OS rows (tools/blocks/cn-service.mjs).
 * `art` was the full-bleed editorial id; since 2026-10-21 the full-bleed
 * backgrounds are the owner's photographs (CAP_PHOTOS.growth, C11-C14) and
 * `art` is only the hover thumbnail of a row whose `shot` (the hover
 * thumbnail's product stem) is null.
 */
export const GROWTH_ROWS = [
  { art: 'brand-family-01', shot: null },
  { art: OS_ART.salesDesk, shot: PRODUCT_IDS.growthStartThumb },
  { art: OS_ART.loading, shot: PRODUCT_IDS.reorder },
  { art: 'mobile-approvals', shot: PRODUCT_IDS.committee },
];

/**
 * Capability page, Sales Desk rows (tools/blocks/qx-news.mjs).
 * An editorial id, or a product or photograph path written as-is. Rows 1 and
 * 3 are the owner's photographs since 2026-10-21 (C05, C06; they had
 * os-desktop and os-inquiries).
 */
export const SALES_ROWS = [CAP_PHOTOS.inbox, PRODUCT.needs, CAP_PHOTOS.customer360];

/** Capability showcase story pictures. Editorial ids. */
export const STORY_ART = {
  growthOs: OS_ART.cockpit,
  salesDesk: OS_ART.salesDesk,
  quote: OS_ART.quoteStudio,
  erp: OS_ART.tradeExecution,
  creative: 'brand-family-01',
  team: OS_ART.agentCenter,
  desktop: OS_ART.desktop,
  login: OS_ART.login,
  knowledge: 'brand-ontology',
  improvement: 'brand-loop',
};

/** Notices “keep reading” cards, in card order. */
export const NOTICES_CARDS = [PRODUCT.workspaceHome, PRODUCT.expertsLibrary, PRODUCT.quoteApproval];

/** Workforce / About pictures that reuse a hero or product slot. */
export const PLACED = {
  workforceTile: PRODUCT.teams,
  aboutBigImage: HERO.poster,
  teamCard: PRODUCT.teams,
};
/* The quote band's picture and the 图片 / 视频 portrait (STORY_ART.quoteBand
   and PLACED.creativePicture until 2026-10-21) are CAP_PHOTOS.quote and
   CAP_PHOTOS.creative. */

/**
 * Enterprise page (enterprise.html and en/enterprise.html, the Mono studio
 * layout: tools/build-site.mjs PAGES['enterprise.html'] and fromStudio). Since
 * 2026-10-21 every picture on it is one of the owner's photographs
 * (site-images/batch-7, E01–E13), in place of the site's concept art; the
 * editorial files they replaced keep their places on the other pages and in
 * the hidden nav-menu rotator.
 * - `cockpit`: the three scroll-revealed pictures in the column beside
 *   「(老板驾驶舱)」, in page order: E05 the dawn office, E06 the owner on the
 *   phone at a stopped machine (portrait), E07 the ledger.
 * - `principle`: the rounded parallax picture beside 「(原则)」, E08 the
 *   emergency stop.
 * - `modules`: the five cards under 「五个管理组件 (5)」, in card order: E09
 *   pegboard, E10 badge reader, E11 stamp, E12 clipboard, E13 key cabinet
 *   (its own file, not os-login). A card draws its picture whole, so the
 *   picture's shape sets the card's height.
 * The four sticky story panels (决定, 核对, 连接, 经营; E01–E04) are CSS
 * backgrounds, set in css/stargo-fusion.css (the batch 7 block).
 */
export const ENTERPRISE_PHOTOS = {
  cockpit: [photoFile('e05-cockpit-overview', 1024), photoFile('e06-cockpit-blocker', 1024), photoFile('e07-cockpit-budget', 1024)],
  principle: photoFile('e08-emergency-stop', 1024),
  modules: ['e09-capabilities', 'e10-access', 'e11-approval', 'e12-records', 'e13-key-cabinet'].map((id) => photoFile(id, 480)),
};

if (HERO.theatre.length !== 7) throw new Error('replaceables: hero theatre is seven cells');
if (HERO.centreIndex !== 3) throw new Error('replaceables: the film replaces theatre cell 3');
if (OG.width !== 1200 || OG.height !== 630) throw new Error('replaceables: og-cover stays 1200×630');
if (!OG.file.endsWith('/og-cover.png') || !OG.token.endsWith('/og-cover.png')) {
  throw new Error('replaceables: og-cover.png keeps its name');
}

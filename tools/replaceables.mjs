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
 *     in tools/imagegen/photo-assets.json) is written as the final URL too, but
 *     never overwritten: /assets is cached immutable for a year, so a new
 *     picture gets a new id and tools/imagegen/prepare-photos.mjs writes it.
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
 */
export const RING_STILLS = {
  '883ab066-dd39-71d8-e308-0e0f4d18fa98': photoFile('w02-workshop'),
  '883ab066-dd39-71d8-e308-0e0f4d18fab1': photoFile('w02-workshop'),
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
 * path (a product path, or an editorial token).
 */
export const HOME_STAGES = [
  { id: 'acquisition', label: '001 主动获客', file: PRODUCT.growthHome },
  { id: 'sales', label: '002 外贸销售', file: PRODUCT.caseStage },
  { id: 'fulfillment', label: '003 企业履约', file: PRODUCT.erpStage },
  { id: 'collection', label: '004 回款与服务', file: editorialToken('brand-family-01') },
  { id: 'reorder', label: '005 复购与改进', file: PRODUCT.reactivation },
];

/**
 * Capability page, Growth OS rows (tools/blocks/cn-service.mjs).
 * `art` is the full-bleed editorial id. `shot` is the hover thumbnail stem,
 * or null when the row keeps the editorial art.
 */
export const GROWTH_ROWS = [
  { art: 'brand-family-01', shot: null },
  { art: OS_ART.salesDesk, shot: PRODUCT_IDS.growthStartThumb },
  { art: OS_ART.loading, shot: PRODUCT_IDS.reorder },
  { art: 'mobile-approvals', shot: PRODUCT_IDS.committee },
];

/**
 * Capability page, Sales Desk rows (tools/blocks/qx-news.mjs).
 * An editorial id, or a product path written as-is.
 */
export const SALES_ROWS = [OS_ART.desktop, PRODUCT.needs, OS_ART.inquiries];

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
  quoteBand: OS_ART.quoteStudio,
  knowledge: 'brand-ontology',
  improvement: 'brand-loop',
};

/** Notices “keep reading” cards, in card order. */
export const NOTICES_CARDS = [PRODUCT.workspaceHome, PRODUCT.expertsLibrary, PRODUCT.quoteApproval];

/**
 * The owner's photographs on about, contact, pricing and workforce
 * (2026-10-21; site-images/batch-4, batch-5 and batch-8), slot by slot. Each
 * value is the photograph's widest file; tools/editorial-images.mjs writes the
 * narrower ones into the srcset, the alt and the size, and
 * css/stargo-fusion.css (the "pages" block at its end) the crop point. Only
 * these slots change: every file they replace keeps its other places.
 *
 * The about page's introduction band behind 「从真实业务出发…」 (A01, the
 * empty workshop at dawn) is a CSS background: css/stargo-fusion.css.
 */
/** The four scenario slides of the testimonial slider on about.html
 *  (tools/blocks/cn-about-reviews.mjs) and pricing.html (cn-reviews.mjs),
 *  keyed by the cinery portrait each one showed (R1–R4, the slides' own
 *  order: sales rep, trade manager, sales director, general manager). Only
 *  the slides' cover picture changes; the 56px avatars in the pricing card's
 *  rating block keep the template portraits. */
export const ROLE_SLIDES = {
  '695ffb11547e68b53adbfd91_client-04': photoFile('r1-sales-rep', 1639),
  '695ffb11eb1deaba179419b4_client-02': photoFile('r2-trade-manager', 1024),
  '695ffb115a835fdec642a548_client-03': photoFile('r3-sales-director', 1024),
  '695ffb11be2d7e781e33b929_client-01': photoFile('r4-general-manager', 1024),
};
/** about.html's four AI-employee tiles (tools/blocks/cn-about-projects.mjs),
 *  by the clip's video id: a still in place of each cinery case-study film,
 *  matched by the tile's role (D01 市场信号, D07 报价, D02 跟进, D05 统筹). */
export const ABOUT_CASE_STILLS = {
  'fb6f08c0-bccf-aeab-a33d-45198963fe74': photoFile('d01-market-research', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963fe90': photoFile('d07-quotation', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963feae': photoFile('d02-follow-up', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963feca': photoFile('d05-coordination', 1024),
};
/** contact.html's quote card (`.testimonials-card._03.rl`, beside the
 *  form): K01, the meeting table, as a still where the template's
 *  Professional Portrait film played. */
export const CONTACT_CARD = photoFile('k01-meeting-table', 768);
/** workforce.html's five marquee role cards (`.lx-feature-hero-card.lx-_1`
 *  … `lx-_5`, each drawn twice for the loop) and the collage card in the
 *  desktop item (报告 AI 员工), keyed by the lifelogx asset id of the
 *  picture each showed (D01–D06). */
export const WORKFORCE_ROLES = {
  '6941e78a09a85d0bd053b266': photoFile('d01-market-research', 1024),   // Item → Variant 1
  '694ab25174cbe821ec5d8930': photoFile('d02-follow-up', 1024),         // ChatGPT Image Dec 23, 2025, 04_16_19 PM
  '6942777374324a552a47ab30': photoFile('d03-product-spec', 480),       // Link - image 64 → bELwQd7…
  '694277a49143d5ea0557c371': photoFile('d04-finance', 480),            // Link - image 64 → ujtmvGk…
  '694aada59524a64f6280d410': photoFile('d05-coordination', 1024),      // ChatGPT Image Dec 23, 2025, 03_56_21 PM
  '694277bf9dc048830e6fca2e': photoFile('d06-reporting', 480),          // Link - image 64 → V9yoYRx… (the collage card)
};
/** workforce.html's three article cards under 文章 / 我们写下来的 (B01–B03),
 *  by article slug. They showed the articles' covers, which are fitted
 *  product screenshots (tools/blog-covers.mjs: sw004, sw008, sw028); the
 *  blog index, the articles and the share images keep those covers. */
export const WORKFORCE_BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
};

/** Workforce / About pictures that reuse a hero or product slot. */
export const PLACED = {
  workforceTile: PRODUCT.teams,
  aboutBigImage: HERO.poster,
  teamCard: PRODUCT.teams,
  creativePicture: OS_ART.boot,
};

if (HERO.theatre.length !== 7) throw new Error('replaceables: hero theatre is seven cells');
if (HERO.centreIndex !== 3) throw new Error('replaceables: the film replaces theatre cell 3');
if (OG.width !== 1200 || OG.height !== 630) throw new Error('replaceables: og-cover stays 1200×630');
if (!OG.file.endsWith('/og-cover.png') || !OG.token.endsWith('/og-cover.png')) {
  throw new Error('replaceables: og-cover.png keeps its name');
}

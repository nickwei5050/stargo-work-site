/**
 * Mechanical web encoding of the owner's graded photographs; never retouches.
 *
 * The owner's site photographs (site-images/batch-1 … batch-8, 2026-10-21):
 * graded finals, 2048 px on the long side, sRGB, each with the slots it
 * replaces, its crop point and its bilingual alt text in its batch's
 * manifest.json. They are finished pictures, so this only resizes (lanczos3)
 * and writes WebP at quality 82: no crop, no sharpening, no colour or tone
 * change, never wider than the supplied file. What each picture shows and
 * where it is cropped live in tools/editorial-images.mjs and
 * css/stargo-fusion.css; where it goes, in tools/replaceables.mjs.
 * Batch 8's og-share-cover.png (O01) is the Open Graph share card; it is
 * written separately as a 1200x630 JPEG, not here.
 *
 * File names carry the width (`<id>-<width>.webp`) and are never overwritten:
 * /assets is served immutable for a year, so a changed picture needs a new
 * name. A file already on disk must come out byte for byte the same, or the
 * run stops. Each id is the manifest's own id (W01, G02, H01, R1 …) plus a
 * slug of the supplied file name.
 *
 * Widths follow the slot. A picture's widths are the steps from 480 up to
 * the first one at least as wide as any of its slots ever draws it: the width
 * of the cover-cropped picture (not of the box) in the manifest's
 * measurements, x1.34 for a 1920-wide screen (d1440) and x2 for a phone's
 * 2x screen (d390); the capability ring cards (22rem x 20rem, 12.5 x 11.9rem on
 * phones) and the orbit thumbnails (148 x 168, 100 x 130 on phones) have no
 * measurement in the manifests and are taken from the CSS. Never wider than
 * the original: a narrower original tops out at its own width. A CSS
 * background cannot pick a file by width, so a picture placed only as one,
 * and needing the top step at every width, ships that step alone. The six
 * homepage grid tiles (W01-W06) are drawn up to ~2300 px wide at 1440 while
 * the grid zooms, so they keep the full 2048 above the usual steps (W02's
 * smaller steps also serve its ring card on the capability page). The demo
 * band background (G01) is a CSS background that needs at least ~1550 CSS px
 * at every width, so it ships at 2048 only. The side-menu card (G02) is at
 * most 220 px wide. The comment on each entry below names the slot that sets
 * its widest file.
 *
 *   STARGO_TOOL_PACKAGE=<an install with sharp>/package.json \
 *     node tools/imagegen/prepare-photos.mjs <folder holding site-images/>
 *
 * Writes assets/stargo-photo/ and tools/imagegen/photo-assets.json. The PNG
 * originals stay in the owner's shared folder; the registry keeps each one's
 * path, SHA-256 and pixels so a file can be traced back to its source.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, req } from '../paths.mjs';
/* STARGO_TOOL_PACKAGE borrows another install's sharp; see tools/paths.mjs. */
const sharp = req('sharp');

const SOURCE = process.argv[2] ?? process.env.STARGO_PHOTO_SOURCE;
if (!SOURCE) throw new Error('usage: node tools/imagegen/prepare-photos.mjs <folder holding site-images/>');
const TARGET = 'assets/stargo-photo';
const STEPS = [480, 768, 1024, 1600, 2048];
const TILE = STEPS;
/** The steps from 480 up to and including `top`. */
const upTo = (top) => STEPS.filter((w) => w <= top);
const BATCH = (n) => `site-images/batch-${n}`;

const PHOTOS = [
  /* Batch 1: the homepage opening mosaic (index, en/index), and the capability
     page's ring cards and orbit thumbnails, which reuse some of them. */
  // mosaic 684x400, cover 710: 951 at 1920; phone 187x250, cover 444: 888
  { id: 'h01-port-blue-hour', ref: 'H01', file: `${BATCH(1)}/home-hero-01-port-blue-hour.png`, widths: upTo(1024) },
  // mosaic 684x385: 917 at 1920; ring card ~570 (cover), orbit 148x168
  { id: 'h02-night-inquiry', ref: 'H02', file: `${BATCH(1)}/home-hero-02-night-inquiry.png`, widths: upTo(1024) },
  // square; mosaic 684x684: 917 at 1920; phone 187x250, cover 250: 500
  { id: 'h03-sample-wall', ref: 'H03', file: `${BATCH(1)}/home-hero-03-sample-wall.png`, widths: upTo(1024) },
  // mosaic 684x456: 917 at 1920; phone 187x250, cover 375: 750
  { id: 'h04-caliper-qc', ref: 'H04', file: `${BATCH(1)}/home-hero-04-caliper-qc.png`, widths: upTo(1024) },
  // mosaic 684x385: 917 at 1920; ring card ~570 (cover)
  { id: 'h05-assembly-line', ref: 'H05', file: `${BATCH(1)}/home-hero-05-assembly-line.png`, widths: upTo(1024) },
  // mosaic 684x456: 917 at 1920; phone 187x250, cover 375: 750
  { id: 'h06-packing', ref: 'H06', file: `${BATCH(1)}/home-hero-06-packing.png`, widths: upTo(1024) },
  // square; mosaic 684x400: 917 at 1920; phone 187x250, cover 250: 500
  { id: 'h07-owner-walk', ref: 'H07', file: `${BATCH(1)}/home-hero-07-owner-walk.png`, widths: upTo(1024) },
  // mosaic 684x400, cover 710: 951 at 1920; phone 187x250, cover 444: 888
  { id: 'h08-product-shoot', ref: 'H08', file: `${BATCH(1)}/home-hero-08-product-shoot.png`, widths: upTo(1024) },
  // square; mosaic 684x400: 917 at 1920; phone 187x250, cover 250: 500
  { id: 'h09-container-loading', ref: 'H09', file: `${BATCH(1)}/home-hero-09-container-loading.png`, widths: upTo(1024) },
  // mosaic 684x400, cover 710: 951 at 1920; phone 187x250, cover 444: 888
  { id: 'h10-video-showing', ref: 'H10', file: `${BATCH(1)}/home-hero-10-video-showing.png`, widths: upTo(1024) },

  /* Batch 2: the homepage stage cards (P) and problem cards (S). */
  // stage card 334x222: 448 at 1920; orbit 100x130 on phones, cover 195: 390
  { id: 'p01-prospecting', ref: 'P01', file: `${BATCH(2)}/home-stage-01-prospecting.png`, widths: upTo(480) },
  // stage card 334x222: 448 at 1920; not drawn on phones
  { id: 'p02-sales', ref: 'P02', file: `${BATCH(2)}/home-stage-02-sales.png`, widths: upTo(480) },
  // ring card 352x320, cover 480: 643 at 1920; phone ring 200x190, cover 285: 570
  { id: 'p03-fulfilment', ref: 'P03', file: `${BATCH(2)}/home-stage-03-fulfilment.png`, widths: upTo(768) },
  // stage card 334x234, cover 351: 470 at 1920; not drawn on phones
  { id: 'p04-payment-docs', ref: 'P04', file: `${BATCH(2)}/home-stage-04-payment-docs.png`, widths: upTo(480) },
  // stage card 334x222: 448 at 1920; orbit 100x130 on phones, cover 195: 390
  { id: 'p05-reorder', ref: 'P05', file: `${BATCH(2)}/home-stage-05-reorder.png`, widths: upTo(480) },
  // problem card 1000x735, cover 1103: 1478 at 1920; phone 374x255, cover 383: 766
  { id: 's01-inquiry-rework', ref: 'S01', file: `${BATCH(2)}/home-silo-01-inquiry-rework.png`, widths: upTo(1600) },
  // problem card 1029x756, cover 1134: 1520 at 1920; phone 374x255, cover 383: 766
  { id: 's02-scattered-chats', ref: 'S02', file: `${BATCH(2)}/home-silo-02-scattered-chats.png`, widths: upTo(1600) },
  // problem card 1029x756, cover 1134: 1520 at 1920; phone 374x255, cover 383: 766
  { id: 's03-spreadsheet-memory', ref: 'S03', file: `${BATCH(2)}/home-silo-03-spreadsheet-memory.png`, widths: upTo(1600) },
  // the dusk version, 2048x1266 (1.62:1); problem card 1029x756, cover 1223: 1639 at 1920
  { id: 's04-chasing-order', ref: 'S04', file: `${BATCH(2)}/home-silo-04-chasing-order.png`, widths: upTo(2048) },

  /* Batch 3: the homepage workspace grid, the demo band and the side-menu card. */
  { id: 'g01-cta-loading-bay-dusk', ref: 'G01', file: `${BATCH(3)}/site-cta-loading-bay-dusk.png`, widths: [2048] },
  { id: 'g02-menu-harbour-night', ref: 'G02', file: `${BATCH(3)}/site-menu-harbour-night.png`, widths: [480, 768] },
  { id: 'w01-trade-office', ref: 'W01', file: `${BATCH(3)}/home-space-01-trade-office.png`, widths: TILE },
  { id: 'w02-workshop', ref: 'W02', file: `${BATCH(3)}/home-space-02-workshop.png`, widths: TILE },
  { id: 'w03-warehouse', ref: 'W03', file: `${BATCH(3)}/home-space-03-warehouse.png`, widths: TILE },
  { id: 'w04-qc-lab', ref: 'W04', file: `${BATCH(3)}/home-space-04-qc-lab.png`, widths: TILE },
  { id: 'w05-owner-office', ref: 'W05', file: `${BATCH(3)}/home-space-05-owner-office.png`, widths: TILE },
  { id: 'w06-showroom', ref: 'W06', file: `${BATCH(3)}/home-space-06-showroom.png`, widths: TILE },

  /* Batch 4: about, contact and pricing, the role scenes, the enterprise card. */
  // CSS background only (about intro, background-attachment: fixed): 1440 wide
  // at 1440, 1930 at 1920, phone 390x709, cover 1064: 2128 -> 2048 at every width
  { id: 'a01-empty-workshop', ref: 'A01', file: `${BATCH(4)}/about-intro-empty-workshop.png`, widths: [2048] },
  // 1677 wide; contact card 370x450: 496 at 1920; phone 374x350: 748
  { id: 'k01-meeting-table', ref: 'K01', file: `${BATCH(4)}/contact-meeting-table.png`, widths: upTo(768) },
  // 1639 wide; the homepage photo-half is a CSS background at 200% of the
  // viewport (attachment fixed), ~2880 px at 1440, so it takes the whole
  // original (1639; a 1600 step would be the same picture). The about and
  // pricing cards (646x699: 866 at 1920) use the steps below it.
  { id: 'r1-sales-rep', ref: 'R1', file: `${BATCH(4)}/role-01-sales-rep.png`, widths: [...upTo(1024), 1639] },
  // 1639 wide; about/pricing card 646x699: 866 at 1920; phone 374x350: 748
  { id: 'r2-trade-manager', ref: 'R2', file: `${BATCH(4)}/role-02-trade-manager.png`, widths: upTo(1024) },
  // 1639 wide; about/pricing card 646x699: 866 at 1920; phone 329x320: 658
  { id: 'r3-sales-director', ref: 'R3', file: `${BATCH(4)}/role-03-sales-director.png`, widths: upTo(1024) },
  // 1365 wide; about/pricing card 646x699: 866 at 1920; phone 329x320: 658
  { id: 'r4-general-manager', ref: 'R4', file: `${BATCH(4)}/role-04-general-manager.png`, widths: upTo(1024) },
  // square; homepage card 683x662: 915 at 1920; phone 374x252: 748
  { id: 't01-enterprise-campus', ref: 'T01', file: `${BATCH(4)}/pricing-enterprise-campus.png`, widths: upTo(1024) },

  /* Batch 5: the AI role cards (workforce) and the about page's case cards. */
  // square; about case card 632x544: 847 at 1920; workforce card 208x266
  { id: 'd01-market-research', ref: 'D01', file: `${BATCH(5)}/ai-role-01-market-research.png`, widths: upTo(1024) },
  // 1597 wide; about case card: the manifest's 559x481 is the card scaled down
  // between slides; its box is 632x544 like D01's (752x560 at 1920): 847
  { id: 'd02-follow-up', ref: 'D02', file: `${BATCH(5)}/ai-role-02-follow-up.png`, widths: upTo(1024) },
  // square; workforce card 205x262, cover 262: 351 at 1920; phone 95x122: 244
  { id: 'd03-product-spec', ref: 'D03', file: `${BATCH(5)}/ai-role-03-product-spec.png`, widths: upTo(480) },
  // square; workforce card 201x257, cover 257: 344 at 1920; phone 94x121: 242
  { id: 'd04-finance', ref: 'D04', file: `${BATCH(5)}/ai-role-04-finance.png`, widths: upTo(480) },
  // square; about case card as D02 (632x544 box): 847 at 1920
  { id: 'd05-coordination', ref: 'D05', file: `${BATCH(5)}/ai-role-05-coordination.png`, widths: upTo(1024) },
  // square; workforce collage card 175x217, cover 217: 291; phone 102x126: 252
  { id: 'd06-reporting', ref: 'D06', file: `${BATCH(5)}/ai-role-06-reporting.png`, widths: upTo(480) },
  // square; about case card 632x544: 847 at 1920; phone 326x192: 652
  { id: 'd07-quotation', ref: 'D07', file: `${BATCH(5)}/ai-role-07-quotation.png`, widths: upTo(1024) },

  /* Batch 6: the capability page. */
  // pillar 1379x754: 1848 at 1920; phone 374x255, cover 453: 906
  { id: 'c01-command-growth', ref: 'C01', file: `${BATCH(6)}/cap-pillar-01-command-growth.png`, widths: upTo(2048) },
  // pillar 1382x756: 1852 at 1920; phone 374x255, cover 453: 906
  { id: 'c02-customer-knowledge', ref: 'C02', file: `${BATCH(6)}/cap-pillar-02-customer-knowledge.png`, widths: upTo(2048) },
  // pillar 1382x756: 1852 at 1920; phone 374x255, cover 453: 906
  { id: 'c03-commerce-fulfilment', ref: 'C03', file: `${BATCH(6)}/cap-pillar-03-commerce-fulfilment.png`, widths: upTo(2048) },
  // pillar 1382x756: 1852 at 1920; phone 374x255, cover 453: 906
  { id: 'c04-team-management', ref: 'C04', file: `${BATCH(6)}/cap-pillar-04-team-management.png`, widths: upTo(2048) },
  // Sales Desk card 349x244, cover 366: 490 at 1920; phone 358x201: 716
  { id: 'c05-unified-inbox', ref: 'C05', file: `${BATCH(6)}/cap-salesdesk-unified-inbox.png`, widths: upTo(768) },
  // Sales Desk card 349x244: 490 at 1920; phone 1:1 358x358, cover 537: 1074
  { id: 'c06-customer-360', ref: 'C06', file: `${BATCH(6)}/cap-salesdesk-customer-360.png`, widths: upTo(1600) },
  // quote card 439x292: 588 at 1920; phone 360x240: 720
  { id: 'c07-quote-approval', ref: 'C07', file: `${BATCH(6)}/cap-quote-approval.png`, widths: upTo(768) },
  // 1365 wide, portrait; AI studio card 640x857: 858 at 1920; phone 342x360: 684
  { id: 'c08-product-references', ref: 'C08', file: `${BATCH(6)}/cap-ai-studio-product-references.png`, widths: upTo(1024) },
  // square; team card 632x724, cover 724: 970 at 1920; phone 358x350: 716
  { id: 'c09-288-flatlay', ref: 'C09', file: `${BATCH(6)}/cap-ai-team-288-flatlay.png`, widths: upTo(1024) },
  // square; team card 632x724, cover 724: 970 at 1920; phone 358x350: 716
  { id: 'c10-progress-board', ref: 'C10', file: `${BATCH(6)}/cap-ai-team-progress-board.png`, widths: upTo(1024) },
  // full-bleed night background 1440x1157, cover 1736: 2326 at 1920; the only
  // one drawn on phones, 390x1215, cover 1823: 3646
  { id: 'c11-company-research', ref: 'C11', file: `${BATCH(6)}/cap-bg-01-company-research.png`, widths: upTo(2048) },
  // full-bleed night background 1440x1157, cover 1736: 2326 at 1920
  { id: 'c12-trade-intelligence', ref: 'C12', file: `${BATCH(6)}/cap-bg-02-trade-intelligence.png`, widths: upTo(2048) },
  // full-bleed night background 1440x1157, cover 1736: 2326 at 1920
  { id: 'c13-restock', ref: 'C13', file: `${BATCH(6)}/cap-bg-03-restock.png`, widths: upTo(2048) },
  // full-bleed night background 1440x1157, cover 1736: 2326 at 1920
  { id: 'c14-decision-makers', ref: 'C14', file: `${BATCH(6)}/cap-bg-04-decision-makers.png`, widths: upTo(2048) },

  /* Batch 7: the enterprise page. */
  // CSS background only (.image-about._01): 1800x1125: 2412 at 1920; phone
  // 488x897, cover 1346: 2692 -> 2048 at every width
  { id: 'e01-decide', ref: 'E01', file: `${BATCH(7)}/ent-tab-01-decide.png`, widths: [2048] },
  // CSS background only (.image-about._02), as E01
  { id: 'e02-verify', ref: 'E02', file: `${BATCH(7)}/ent-tab-02-verify.png`, widths: [2048] },
  // CSS background only (.image-about._03), as E01
  { id: 'e03-connect', ref: 'E03', file: `${BATCH(7)}/ent-tab-03-connect.png`, widths: [2048] },
  // CSS background only (.image-about._04), as E01
  { id: 'e04-operate', ref: 'E04', file: `${BATCH(7)}/ent-tab-04-operate.png`, widths: [2048] },
  // 4:3; cockpit 681x536, cover 715: 958 at 1920; phone 142x120: 320
  { id: 'e05-cockpit-overview', ref: 'E05', file: `${BATCH(7)}/ent-cockpit-01-overview.png`, widths: upTo(1024) },
  // 1639 wide, portrait; cockpit 681x728: 913 at 1920; phone 118x150: 240
  { id: 'e06-cockpit-blocker', ref: 'E06', file: `${BATCH(7)}/ent-cockpit-02-blocker.png`, widths: upTo(1024) },
  // cockpit 681x488, cover 732: 981 at 1920; phone 142x108: 324
  { id: 'e07-cockpit-budget', ref: 'E07', file: `${BATCH(7)}/ent-cockpit-03-budget.png`, widths: upTo(1024) },
  // square; principle card 683x662: 915 at 1920; phone 374x252: 748
  { id: 'e08-emergency-stop', ref: 'E08', file: `${BATCH(7)}/ent-principle-emergency-stop.png`, widths: upTo(1024) },
  // module card 334x222: 448 at 1920; phone 182x121: 364
  { id: 'e09-capabilities', ref: 'E09', file: `${BATCH(7)}/ent-module-01-capabilities.png`, widths: upTo(480) },
  // module card 334x188: 448 at 1920; phone 182x102: 364
  { id: 'e10-access', ref: 'E10', file: `${BATCH(7)}/ent-module-02-access.png`, widths: upTo(480) },
  // module card 334 wide, uncropped (478 even if cover-cropped to 334x238)
  { id: 'e11-approval', ref: 'E11', file: `${BATCH(7)}/ent-module-03-approval.png`, widths: upTo(480) },
  // square; module card 334x334: 448 at 1920; phone 182x182: 364
  { id: 'e12-records', ref: 'E12', file: `${BATCH(7)}/ent-module-04-records.png`, widths: upTo(480) },
  // square; module card 334x334, uncropped: 448 at 1920; its own name, not os-login
  { id: 'e13-key-cabinet', ref: 'E13', file: `${BATCH(7)}/ent-module-05-key-cabinet.png`, widths: upTo(480) },

  /* Batch 8: the blog covers and the intelligence page. */
  // article hero 1180x787: 1583 at 1920 (measured 1180 there); 1:1 list card
  // on phones 358x358, cover 537: 1074
  { id: 'b01-visual-guide', ref: 'B01', file: `${BATCH(8)}/blog-cover-visual-guide.png`, widths: upTo(1600) },
  // as B01
  { id: 'b02-one-workflow', ref: 'B02', file: `${BATCH(8)}/blog-cover-one-workflow.png`, widths: upTo(1600) },
  // as B01
  { id: 'b03-inquiry-to-quote', ref: 'B03', file: `${BATCH(8)}/blog-cover-inquiry-to-quote.png`, widths: upTo(1600) },
  // as B01
  { id: 'b04-approval-handover', ref: 'B04', file: `${BATCH(8)}/blog-cover-approval-handover.png`, widths: upTo(1600) },
  // as B01 (blog list card on phones 355x355, cover 533: 1066)
  { id: 'b05-288-relay', ref: 'B05', file: `${BATCH(8)}/blog-cover-288-relay.png`, widths: upTo(1600) },
  // as B05
  { id: 'b06-browser-os', ref: 'B06', file: `${BATCH(8)}/blog-cover-browser-os.png`, widths: upTo(1600) },
  // as B05
  { id: 'b07-knowledge-library', ref: 'B07', file: `${BATCH(8)}/blog-cover-knowledge-library.png`, widths: upTo(1600) },
  // full-bleed 1440x900: 1930 at 1920; phone 390x844, cover 1266: 2532
  { id: 'i01-observe-process', ref: 'I01', file: `${BATCH(8)}/intel-observe-process.png`, widths: upTo(2048) },
  // square; closing card 511x386: 685 at 1920; phone 358x358: 716
  { id: 'i02-keep-or-revert', ref: 'I02', file: `${BATCH(8)}/intel-keep-or-revert.png`, widths: upTo(768) },
  // 1365 wide, portrait; phone photo 531x720: 712 at 1920; phone 358x418: 716
  { id: 'i03-hand-phone-blank', ref: 'I03', file: `${BATCH(8)}/intel-hand-phone-blank.png`, widths: upTo(768) },
];

mkdirSync(`${SITE}/${TARGET}`, { recursive: true });
const assets = [];
const hashes = new Set();
const ids = new Set();
for (const job of PHOTOS) {
  if (ids.has(job.id)) throw new Error(`${job.id}: listed twice`);
  ids.add(job.id);
  const input = readFileSync(`${SOURCE}/${job.file}`);
  const sourceSha256 = createHash('sha256').update(input).digest('hex');
  if (hashes.has(sourceSha256)) throw new Error(`${job.id}: the same original as another photograph`);
  hashes.add(sourceSha256);
  const meta = await sharp(input).metadata();
  if (meta.space !== 'srgb') throw new Error(`${job.id}: expected an sRGB original, got ${meta.space}`);
  const files = [];
  for (const w of [...new Set(job.widths)].sort((a, b) => a - b)) {
    if (w > meta.width) throw new Error(`${job.id}: ${w}px would upscale a ${meta.width}px original`);
    const buffer = await sharp(input)
      .resize({ width: w, kernel: 'lanczos3', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    const out = await sharp(buffer).metadata();
    const src = `${TARGET}/${job.id}-${w}.webp`;
    /* Served immutable: a file that is already there may only be rewritten
       with the very same bytes. */
    if (existsSync(`${SITE}/${src}`)) {
      if (!readFileSync(`${SITE}/${src}`).equals(buffer)) throw new Error(`${src} exists with other bytes; a changed picture needs a new name`);
    } else writeFileSync(`${SITE}/${src}`, buffer);
    files.push({ src, width: out.width, height: out.height, bytes: buffer.length });
  }
  const main = files.pop();
  assets.push({
    id: job.id, ref: job.ref, ...main,
    sourceFile: job.file, sourceSha256, sourcePixels: [meta.width, meta.height],
    upscaled: false,
    variants: files.map(({ src, width, bytes }) => ({ src, width, bytes })),
  });
}
writeFileSync(`${SITE}/tools/imagegen/photo-assets.json`, JSON.stringify({
  note: 'Owner-supplied graded photographs. Written by tools/imagegen/prepare-photos.mjs: WebP q82 (lanczos3) resizes of the supplied sRGB originals, never cropped, retouched or upscaled; every file name carries its width. Alt text lives in tools/editorial-images.mjs, crop points in css/stargo-fusion.css, slots in tools/replaceables.mjs.',
  authorization: 'Owner image thread, site-images/batch-1 to batch-8 (2026-10-21): graded finals for the homepage (opening mosaic, workspace grid, stage and problem cards, role scenes), the capability, enterprise, workforce, intelligence, about, contact and pricing pages, the blog covers, the demo band background and the side-menu card; resize and convert only. The share card (batch-8 O01) is not among them.',
  assets,
}, null, 1) + '\n');
for (const a of assets) console.log(`${a.id}: ${[...a.variants, a].map((v) => `${v.width}w ${Math.round(v.bytes / 1024)}k`).join(', ')}`);

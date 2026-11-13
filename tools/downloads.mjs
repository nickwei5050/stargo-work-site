/**
 * 下载 — the client download page (download.html, en/download.html).
 *
 * The owner asked (2026-11-13) for download buttons with proper system icons,
 * presented the way peer SaaS sites do it (Feishu, DingTalk, Notion, Slack):
 * one big button for the visitor's own system, every platform listed under it,
 * a QR code so a desktop visitor can open the page on a phone, and the plain
 * install notes underneath.
 *
 * Every number here comes from the published releases, not from memory:
 *   desktop  nickwei5050/stargo-work-windows v0.5.3 (Windows x64 Setup and
 *            Portable, macOS arm64 and x64 DMG), SHA256SUMS.txt of that release;
 *   Android  nickwei5050/stargo-work-app v0.5.1 (STARGO-WORK-Android-0.5.1.apk).
 * Both source repositories are private, so their release links answer 404 to a
 * visitor. The desktop installers (110–134 MB) are over Cloudflare Pages' 25 MiB
 * file cap, so they are served from the public, binaries-only repository the
 * desktop auto-updater already reads (DESKTOP_BASE); the 5 MB APK is served by
 * this site (assets/stargo-download/).
 *
 * iOS and the WeChat mini program are NOT installable yet (the v0.5.1 release
 * has only a simulator build and an unsigned archive, no IPA; the mini program
 * is a DevTools project, not published). They are listed as 即将上线 with no
 * button, never as a link that does not install.
 *
 * Icons: Apple, Android and WeChat paths are from Simple Icons 16.0.0 (CC0);
 * the Windows mark is the four-pane logo drawn here. All are shown in one
 * colour (white on the dark band), which every one of those brand guides allows,
 * and which keeps the page inside the site's one-blue palette.
 *
 * Self-contained: css/stargo-download.css and js/stargo-download.js, class
 * prefix `sg-dl`.
 *
 * A new release: change VERSION / sizes / sha256 / file names below, rebuild.
 */
import { escapeHtml } from './lib-html.mjs';

const DESKTOP_TAG = 'v0.5.3';
const DESKTOP_BASE = `https://github.com/nickwei5050/stargo-work-releases/releases/download/${DESKTOP_TAG}/`;
const LOCAL = 'assets/stargo-download/';
const B = (zh, en) => ({ zh, en });
const t = (p, lang) => (typeof p === 'string' ? p : p[lang]);
const mb = (bytes) => `${Math.round(bytes / 1048576)} MB`;

export const ICONS = {
  windows: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M1 1h10.4v10.4H1zM12.6 1H23v10.4H12.6zM1 12.6h10.4V23H1zM12.6 12.6H23V23H12.6z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>',
  android: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z"/></svg>',
  wechat: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="sg-dl-arrow"><path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* `os` is what js/stargo-download.js matches the visitor's system against. */
export const PLATFORMS = [
  {
    os: 'windows', icon: 'windows', name: 'Windows', version: '0.5.3',
    req: B('Windows 10 / 11 · 64 位', 'Windows 10 / 11 · 64-bit'),
    files: [
      { label: B('下载安装版', 'Download installer'), short: B('安装版', 'Installer'), file: 'STARGO-WORK-Setup-0.5.3.exe', bytes: 110667782, sha: '760281ead24c0839aa99312d12bdb9122040b3ea445950e3c4289fafc8a6a5cb', base: DESKTOP_BASE },
      { label: B('免安装版', 'Portable'), short: B('免安装版', 'Portable'), file: 'STARGO-WORK-Portable-0.5.3.exe', bytes: 110448312, sha: 'ff6a3c6267be94c488951388f4b6151a060ab38d7fa190240b5aa8370a12e9e9', base: DESKTOP_BASE },
    ],
  },
  {
    os: 'mac', icon: 'apple', name: 'macOS', version: '0.5.3',
    req: B('Apple 芯片（M 系列）与 Intel 芯片', 'Apple silicon (M series) and Intel'),
    files: [
      { label: B('Apple 芯片', 'Apple silicon'), short: B('Apple 芯片', 'Apple silicon'), file: 'STARGO-WORK-macOS-0.5.3-arm64.dmg', bytes: 128750610, sha: '4bcb8d243e9a51267538bdf0a16ca3ac4fce44992c089436089095562c8c955b', base: DESKTOP_BASE },
      { label: B('Intel 芯片', 'Intel'), short: B('Intel 芯片', 'Intel'), file: 'STARGO-WORK-macOS-0.5.3-x64.dmg', bytes: 134046611, sha: '1d841133f2fda1a866379311ee20aa094fb257778d98850ad87064ffc71f9922', base: DESKTOP_BASE },
    ],
  },
  {
    os: 'android', icon: 'android', name: 'Android', version: '0.5.1',
    req: B('Android 手机与平板 · APK 安装包', 'Android phones and tablets · APK'),
    files: [
      { label: B('下载 APK', 'Download APK'), short: 'APK', file: 'STARGO-WORK-Android-0.5.1.apk', bytes: 5106421, sha: 'd01123fe5b94ae850f70bca4edfea5fa726c5b1e4474472f0ee73cd3d2d16697', base: LOCAL },
    ],
  },
  {
    os: 'ios', icon: 'apple', name: 'iPhone / iPad', soon: B('即将上架 App Store', 'Coming to the App Store'),
    req: B('上架前，可先用 Safari 打开企业工作台', 'Meanwhile, open your company workspace in Safari'),
  },
  {
    os: 'wechat', icon: 'wechat', name: B('微信小程序', 'WeChat Mini Program'), soon: B('即将上线', 'Coming soon'),
    req: B('上线后微信搜索「STARGO WORK」', 'Search “STARGO WORK” in WeChat once live'),
  },
];

const COPY = {
  eyebrow: B('(客户端下载)', '(Download the apps)'),
  h1: B('下载 STARGO WORK', 'Download STARGO WORK'),
  bandEyebrow: B('(为你推荐)', '(Recommended for you)'),
  bandTitle: B(['电脑、手机，', '同一个工作台。'], ['One workspace,', ' on every screen.']),
  bandLead: B('客户端打开后连接你企业自己的 STARGO WORK 工作区，用公司账号登录。电脑上不装服务端，数据留在企业的服务器上。', 'The apps connect to your company’s own STARGO WORK workspace and sign in with your company account. Nothing server-side is installed on your computer; your data stays on your company’s server.'),
  forYou: B('适用于', 'For'),
  other: B('全部平台', 'All platforms'),
  qrTitle: B('用手机扫码', 'Scan with your phone'),
  qrText: B('在手机上打开本页，下载安卓版。', 'Open this page on your phone to get the Android app.'),
  sha: B('SHA-256 校验值', 'SHA-256 checksum'),
  noAccount: B('还没有开通企业工作区？', 'No company workspace yet?'),
  demo: B('预约企业演示', 'Book an enterprise demo'),
  notesTitle: B('安装说明', 'Installation notes'),
  back: B('返回首页', 'Back to home'),
};

const NOTES = B(`
<p>STARGO WORK 客户端是连接企业工作区的轻量外壳：第一次打开时输入企业代号（例如 <strong>acme</strong>）或企业地址（例如 <strong>acme.stargowork.com</strong>），点「连接」，再用公司账号登录。选择「记住账号密码」后，密码只用系统安全存储加密保存在这台设备上。</p>
<h3>Windows</h3>
<p>一般选「安装版」，装好后会自动检查并推送更新；「免安装版」双击即可运行，适合不能安装软件的电脑。正式代码签名证书正在办理中，首次运行如果出现「Windows 已保护你的电脑」，点「更多信息」，再点「仍要运行」。</p>
<h3>macOS</h3>
<p>M1 及以后的 Mac 选「Apple 芯片」，2020 年以前的 Mac 一般选「Intel 芯片」（左上角苹果菜单 →「关于本机」可以查看）。打开 DMG，把 STARGO WORK 拖进「应用程序」。Apple 开发者公证正在办理中，首次打开如果提示无法验证开发者，到「系统设置 → 隐私与安全性」点「仍要打开」。</p>
<h3>Android</h3>
<p>用手机浏览器下载 APK 后点开安装；如果系统提示，允许这个浏览器「安装未知应用」。以后升级直接安装新版本即可，账号设置会保留。</p>
<h3>iPhone、iPad 与微信小程序</h3>
<p>iOS 版正在准备上架 App Store，微信小程序正在准备上线，上线后会在本页更新。在此之前，用 Safari 或微信打开你企业的工作台地址，手机上也能处理询盘和审批。</p>
<h3>核对安装包</h3>
<p>每个安装包下面都列出了 SHA-256 校验值。只从本页下载；如果校验值对不上，请不要安装，并联系我们。</p>
`, `
<p>The STARGO WORK apps are a light shell around your company workspace. The first time you open one, enter your company code (for example <strong>acme</strong>) or address (for example <strong>acme.stargowork.com</strong>), choose Connect, and sign in with your company account. If you choose to remember your password, it is encrypted in the device’s own secure storage.</p>
<h3>Windows</h3>
<p>Most people want the installer: it checks for updates and installs them for you. The portable version runs with a double-click, for computers where you cannot install software. Our code-signing certificate is still being issued, so if Windows shows “Windows protected your PC” the first time, choose “More info”, then “Run anyway”.</p>
<h3>macOS</h3>
<p>Choose Apple silicon for M1 or newer Macs and Intel for most Macs from before 2020 (Apple menu → About This Mac tells you which). Open the DMG and drag STARGO WORK into Applications. Apple notarization is still in progress, so if macOS says it cannot verify the developer, go to System Settings → Privacy &amp; Security and choose “Open Anyway”.</p>
<h3>Android</h3>
<p>Download the APK in your phone’s browser and open it; if asked, allow that browser to install unknown apps. To upgrade later, install the new version over the old one; your settings stay.</p>
<h3>iPhone, iPad and WeChat</h3>
<p>The iOS app is being prepared for the App Store and the WeChat Mini Program for launch; this page will say when they are live. Until then, open your company’s workspace address in Safari or WeChat to handle inquiries and approvals on the phone.</p>
<h3>Check what you downloaded</h3>
<p>Every installer lists its SHA-256 checksum. Download only from this page; if a checksum does not match, do not install it and contact us.</p>
`);

const href = (f) => f.base + f.file;
const nameOf = (p, lang) => t(p.name, lang);

function card(p, lang) {
  const head = `<div class="sg-dl-card-head"><span class="sg-dl-icon sg-dl-icon-${p.icon}">${ICONS[p.icon]}</span><div><h3 class="sg-dl-card-name">${escapeHtml(nameOf(p, lang))}</h3><p class="sg-dl-card-req">${escapeHtml(t(p.req, lang))}</p></div></div>`;
  if (p.soon) {
    return `<li class="sg-dl-card is-soon" data-os="${p.os}" data-name="${escapeHtml(nameOf(p, lang))}" data-meta="${escapeHtml(t(p.req, lang))}" data-soon="${escapeHtml(t(p.soon, lang))}">${head}<div class="sg-dl-card-foot"><span class="sg-dl-soon">${escapeHtml(t(p.soon, lang))}</span></div></li>`;
  }
  const buttons = p.files.map((f, i) => `<a class="sg-dl-btn${i === 0 ? ' is-primary' : ''}" href="${href(f)}" download="${f.file}" data-sg-dl="${p.os}-${i}">${ICONS.down}<span>${escapeHtml(t(p.files.length > 1 ? f.short : f.label, lang))}</span></a>`).join('');
  return `<li class="sg-dl-card" data-os="${p.os}" data-name="${escapeHtml(nameOf(p, lang))}" data-meta="v${p.version} · ${mb(p.files[0].bytes)} · ${escapeHtml(t(p.req, lang))}">${head}<p class="sg-dl-ver">v${p.version} · ${mb(p.files[0].bytes)}</p><div class="sg-dl-card-foot">${buttons}</div><details class="sg-dl-sums"><summary>${escapeHtml(t(COPY.sha, lang))}</summary><ul>${p.files.map((f) => `<li><span>${f.file}</span><code>${f.sha}</code></li>`).join('')}</ul></details></li>`;
}

/* The big recommendation. Rendered for Windows (the most common office
   desktop); js/stargo-download.js re-renders it from the matching card's own
   links once it knows the visitor's system, so there is one source for every
   link on the page. */
function feature(lang) {
  const p = PLATFORMS[0];
  const f = p.files[0];
  return `<div class="sg-dl-feature" data-sg-dl-feature="">`
    + `<p class="sg-dl-eyebrow">${escapeHtml(t(COPY.bandEyebrow, lang))}</p>`
    + `<h2 class="sg-dl-title">${t(COPY.bandTitle, lang).map((w) => `<span>${escapeHtml(w)}</span>`).join('')}</h2>`
    + `<p class="sg-dl-lead">${escapeHtml(t(COPY.bandLead, lang))}</p>`
    + `<div class="sg-dl-pick"><span class="sg-dl-icon is-big sg-dl-icon-${p.icon}" data-sg-dl-icon="">${ICONS[p.icon]}</span>`
    + `<div class="sg-dl-pick-text"><p class="sg-dl-for">${escapeHtml(t(COPY.forYou, lang))} <strong data-sg-dl-name="">${escapeHtml(nameOf(p, lang))}</strong></p><p class="sg-dl-pick-meta" data-sg-dl-meta="">v${p.version} · ${mb(f.bytes)} · ${escapeHtml(t(p.req, lang))}</p></div></div>`
    + `<div class="sg-dl-pick-actions" data-sg-dl-actions=""><a class="sg-dl-btn is-primary is-big" href="${href(f)}" download="${f.file}">${ICONS.down}<span>${escapeHtml(t(f.label, lang))}</span></a><a class="sg-dl-btn is-ghost is-big" href="#sg-dl-all">${escapeHtml(t(COPY.other, lang))}</a></div>`
    + `</div>`;
}

function qr(lang) {
  const src = `${LOCAL}${lang === 'en' ? 'qr-download-en.svg' : 'qr-download.svg'}`;
  return `<div class="sg-dl-qr"><div class="sg-dl-qr-img"><img src="${src}" width="132" height="132" alt="${escapeHtml(lang === 'en' ? 'QR code: stargowork.com/en/download' : '二维码：stargowork.com/download')}" loading="lazy" decoding="async"/></div><div><p class="sg-dl-qr-title">${escapeHtml(t(COPY.qrTitle, lang))}</p><p class="sg-dl-qr-text">${escapeHtml(t(COPY.qrText, lang))}</p></div></div>`;
}

/** The dark band that takes the post template's photo slot. */
export function downloadBand(lang) {
  return `<section id="get" class="section sg-dl" aria-labelledby="sg-dl-title-all"><div class="sg-dl-glow" aria-hidden="true"></div><div class="sg-dl-inner">`
    + `<div class="sg-dl-top">${feature(lang)}${qr(lang)}</div>`
    + `<h2 id="sg-dl-title-all" class="sg-dl-all-title"><span id="sg-dl-all"></span>${escapeHtml(t(COPY.other, lang))}</h2>`
    + `<ul class="sg-dl-grid">${PLATFORMS.map((p) => card(p, lang)).join('')}</ul>`
    + `<p class="sg-dl-foot">${escapeHtml(t(COPY.noAccount, lang))} <a href="contact.html">${escapeHtml(t(COPY.demo, lang))}</a></p>`
    + `</div></section>`;
}

export const DOWNLOAD_COPY = COPY;
export const DOWNLOAD_NOTES = NOTES;

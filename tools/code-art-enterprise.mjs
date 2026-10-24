/**
 * Enterprise page (enterprise.html, en/enterprise.html): the pictures that are
 * drawn in code since 2026-10-23 (owner: 能用代码画的图片都改成代码). They were
 * the owner's photographs of batch 7 (tools/replaceables.mjs ENTERPRISE_PHOTOS).
 *
 *   - The four sticky story panels 决定 / 核对 / 连接 / 经营 (E01–E04, CSS
 *     backgrounds of `.image-about._01…_04`): each panel's box holds a motion
 *     host that tells the panel's sentence — the gate where you approve or
 *     reject with the reason on record, a draft checked against its sources,
 *     systems that join one by one once authorized, the week rolling up.
 *     js/stargo-motion-enterprise.js + css/stargo-motion-enterprise.css.
 *   - The 「(原则)」 picture (E08, the emergency stop): an AI run with a large
 *     human stop control — paused, logged, resumed from the step it stopped at.
 *   - The five cards under 「五个管理模块」 (E09–E13): static code drawings
 *     (HTML and inline SVG, a CSS-only hover), one per card, each in the box
 *     its photograph had (the same aspect ratio, so no card changes height).
 *
 * Everything here is applied to the page fromStudio() built, so the template
 * pipeline and the cockpit column (another lane) are untouched; the page's
 * motion files are added only where they are not already linked.
 */
import { motionHost, motionAssets } from './motion-scenes.mjs';
import { escapeHtml } from './lib-html.mjs';

export const ENT_PANEL_SCENES = ['ent-decide', 'ent-verify', 'ent-connect', 'ent-operate'];
export const ENT_STOP_SCENE = 'ent-stop';

const B = (zh, en) => ({ zh, en });

/* ---------------------------------------------------------------- cards */
/* line glyphs, 24 × 24, stroked with currentColor */
const P = {
  brain: 'M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 9 17.5V4.5zM15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6 3 3 0 0 1-4.5 4.4V4.5z',
  book: 'M5 5.5A1.5 1.5 0 0 1 6.5 4H18v13H6.5A1.5 1.5 0 0 0 5 18.5zM5 18.5A1.5 1.5 0 0 0 6.5 20H18v-3',
  chat: 'M12 4.5a7.5 7.5 0 0 0-6.6 11.1L4.5 19.5l4-1a7.5 7.5 0 1 0 3.5-14z',
  target: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12h.01',
  film: 'M5 6.5h14v11H5zM9 6.5v11M15 6.5v11M5 10h4M15 10h4M5 14h4M15 14h4',
  flow: 'M5 6h5v4H5zM14 14h5v4h-5zM10 8h2.5a1.5 1.5 0 0 1 1.5 1.5V16',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  cross: 'M7 7l10 10M17 7 7 17',
  lock: 'M7 11V8.5a5 5 0 0 1 10 0V11M6 11h12v9H6zM12 14.5v2',
  person: 'M12 11.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM5.4 19.4c.9-3.2 3.4-4.8 6.6-4.8s5.7 1.6 6.6 4.8',
  bot: 'M7 9.4h10a2 2 0 0 1 2 2v5.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5.2a2 2 0 0 1 2-2zM12 9.4V6.7M12 5.2v.01M9.6 14h.01M14.4 14h.01',
  stop: 'M8 8h8v8H8z',
  key: 'M14.5 4a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM10.6 13.4 4 20M6.5 17.5 9 20M14.5 9.5h.01',
  mail: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM5 7l7 5.5L19 7',
  box: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  folder: 'M4 7.5A1.5 1.5 0 0 1 5.5 6H10l2 2h6.5A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z',
  shield: 'M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5z',
  pause: 'M9.2 6.5v11M14.8 6.5v11',
};
const ico = (name, cls = 'sg-em-ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${P[name]}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* What each card draws, in the page's two languages. `label` is the sentence
   screen readers hear (the drawing itself is aria-hidden). `two(full, short)`
   writes both wordings; the narrow cards (phones, 768–991 tablets) show the
   short one (css/stargo-ent-cards.css), so nothing there is cut off. */
const two = (t, full, short) => `<span class="sg-em-f">${t(full)}</span><span class="sg-em-s">${t(short)}</span>`;
const CARDS = [
  {
    ratio: '480 / 320',
    label: B('示意（演示数据）：应用开通管理——六个应用里四个已开通，视频制作还需配置，流程编排未开通；本月用量是预算上限的 62%。',
      'Illustration (demo data): application access — four of six apps are enabled, Video Studio still needs setup and Workflows is off; usage this month is 62% of the budget limit.'),
    draw: (t) => {
      /* the tiles carry launcher-style short English names (the full ones are in the label): a card is at most
         338px wide, and 「Knowledge Base」 does not fit a third of it at 12px */
      const apps = [['brain', B('智脑', 'AI Brain'), 'on'], ['book', B('知识库', 'Knowledge'), 'on'], ['chat', B('客户会话', 'Chat'), 'on'],
        ['target', B('拓客', 'Outreach'), 'on'], ['film', B('视频制作', 'Video'), 'set'], ['flow', B('流程编排', 'Workflows'), 'off']];
      const tiles = apps.map(([i, n, s]) => `<span class="sg-em-app is-${s}"><span class="sg-em-tile">${ico(i)}<i class="sg-em-sw"></i></span><span class="sg-em-an">${t(n)}</span></span>`).join('');
      return `<div class="sg-em-apps">${tiles}</div>
<div class="sg-em-use"><div class="sg-em-use-k"><span>${two(t, B('本月用量', 'Usage this month'), B('用量', 'Usage'))} <b>62%</b></span><span>${t(B('预算上限', 'Budget limit'))}</span></div><div class="sg-em-meter"><i></i></div></div>`;
    },
  },
  {
    ratio: '480 / 270',
    label: B('示意（演示数据）：账号与岗位权限——销售经理可以查看和修改客户资料，销售 AI 可以查看、修改要审批，跟单只能查看。',
      'Illustration (demo data): account and role permissions — the sales manager may read and change customer records, the sales AI may read and needs approval to change, and the orders desk may only read.'),
    draw: (t) => {
      const Y = `<span class="sg-em-c is-y">${ico('check')}</span>`;
      // a noun on phones too (「Approve」 read as the AI approving): its edits need approval
      const A = `<span class="sg-em-c is-a">${t(B('需审批', 'Approval'))}</span>`;
      const N = `<span class="sg-em-c is-n">${ico('lock')}</span>`;
      const rows = [[ico('person'), B('销售经理', 'Sales manager'), B('经理', 'Manager'), Y, Y], [ico('bot'), B('销售 AI', 'Sales AI'), B('销售 AI', 'Sales AI'), Y, A], [ico('person'), B('跟单', 'Orders desk'), B('跟单', 'Orders'), Y, N]];
      return `<div class="sg-em-mx"><div class="sg-em-mx-h"><span>${t(B('客户资料', 'Customer records'))}</span><span>${two(t, B('查看', 'Read'), B('看', 'Read'))}</span><span>${two(t, B('修改', 'Change'), B('改', 'Edit'))}</span></div>${rows.map(([i, n, ns, a, b]) => `<div class="sg-em-mx-r"><span class="sg-em-who">${i}<b>${two(t, n, ns)}</b></span>${a}${b}</div>`).join('')}</div>`;
    },
  },
  {
    ratio: '480 / 320',
    label: B('示意（演示数据）：关键操作审批——报价 Q-1042 低于底价，销售 AI 提交、销售经理已批，还在等你批准，批准前不会发出。',
      'Illustration (demo data): approval of key actions — quote Q-1042 is below the floor price; the sales AI submitted it, the sales manager signed off, and it waits for you: nothing goes out before you approve.'),
    draw: (t) => `<div class="sg-em-ap-item"><b>${two(t, B('报价 Q-1042', 'Quote Q-1042'), B('Q-1042', 'Q-1042'))}</b><span>${t(B('低于底价', 'Below floor'))}</span></div>
<div class="sg-em-chain"><span class="sg-em-step is-ok">${ico('bot')}<em>${two(t, B('销售 AI 提交', 'Sales AI'), B('AI', 'AI'))}</em></span><i></i><span class="sg-em-step is-ok">${ico('person')}<em>${two(t, B('经理已批', 'Manager'), B('经理', 'Manager'))}</em></span><i></i><span class="sg-em-step is-wait">${ico('person')}<em>${two(t, B('等你批准', 'You'), B('你', 'You'))}</em></span></div>
<div class="sg-em-ap-btns"><span class="sg-em-btn">${t(B('驳回', 'Reject'))}</span><span class="sg-em-btn is-primary"><span class="sg-em-btn-a">${t(B('批准', 'Approve'))}</span><span class="sg-em-btn-b">${ico('check')}${t(B('已批准', 'Approved'))}</span></span></div>`,
  },
  {
    ratio: '480 / 480',
    label: B('示意（演示数据）：工作与结果记录——Müller Energie 的报价，每一步记下时间、谁做的和结果：交期核对不符时出错即停，转给跟单，修正后复核通过，再由你批准。',
      'Illustration (demo data): work and result records — the Müller Energie quote, each step logged with the time, who did it and the result: the lead-time check fails, so the work stops and passes to the orders desk; once fixed it passes the re-check, and then you approve.'),
    draw: (t) => {
      const rows = [
        ['09:12', 'bot', B('销售 AI · 起草报价', 'Sales AI · drafts the quote'), B('AI 起草', 'AI drafts'), 'ok'],
        ['09:14', 'stop', B('核对交期 · 不符，已停', 'Lead-time check · stopped'), B('交期不符 · 停', 'Lead time · stop'), 'stop'],
        ['09:15', 'person', B('转人工 · 跟单接手', 'Passed to the orders desk'), B('转给跟单', 'To orders desk'), 'hand'],
        ['09:40', 'check', B('复核 · 符合要求', 'Re-check · meets spec'), B('复核通过', 'Re-check passed'), 'ok'],
        ['09:42', 'person', B('你 · 批准', 'You · approve'), B('你批准', 'You approve'), 'ok'],
      ];
      return `<div class="sg-em-log-h"><b>${t(B('工作记录', 'Work record'))}</b><span>${t(B('报价 · Müller Energie', 'Quote · Müller Energie'))}</span></div><ol class="sg-em-log">${rows.map(([tm, i, s, ss, k]) => `<li class="is-${k}"><time>${tm}</time><span class="sg-em-li">${ico(i)}</span><span class="sg-em-lt">${two(t, s, ss)}</span><span class="sg-em-lr">${ico(k === 'stop' ? 'pause' : k === 'hand' ? 'person' : 'check')}</span></li>`).join('')}</ol>`;
    },
  },
  {
    ratio: '480 / 480',
    label: B('示意（演示数据）：账号连接与保护——企业邮箱、ERP 和网盘经授权接入，登录凭据集中保管、不显示，AI 员工看不到；每个账号只开给用得到的岗位，其他岗位没有访问权限。',
      'Illustration (demo data): linked accounts and protection — company email, the ERP and the shared drive are connected with authorization; their logins are held centrally and never shown, so AI employees never see them; each account is open only to the roles that need it, and other roles have no access.'),
    draw: (t) => {
      const rows = [['mail', B('企业邮箱', 'Company email'), B('销售', 'Sales')], ['box', B('ERP', 'ERP'), B('跟单', 'Orders')], ['folder', B('网盘', 'Shared drive'), B('产品', 'Product')]];
      return `<div class="sg-em-vault-h"><span class="sg-em-shield">${ico('shield')}<i class="sg-em-lockbody">${ico('lock')}</i></span><span><b>${two(t, B('已授权的账号', 'Authorized accounts'), B('授权账号', 'Accounts'))}</b><em>${t(B('凭据集中保管 · AI 员工看不到', 'Logins never shown to AI'))}</em></span></div>
<ul class="sg-em-acc">${rows.map(([i, n, r]) => `<li><span class="sg-em-acc-i">${ico(i)}</span><span class="sg-em-acc-n"><b>${t(n)}</b><span class="sg-em-dots">••••••••</span></span><span class="sg-em-role">${t(r)}</span></li>`).join('')}</ul>
<div class="sg-em-deny">${ico('lock')}<span>${two(t, B('其他岗位：无访问权限', 'Other roles: no access'), B('其他岗位无权限', 'Others: no access'))}</span></div>`;
    },
  },
];

function moduleCard(i, lang) {
  const t = (p) => (typeof p === 'string' ? p : p[lang]);
  const c = CARDS[i];
  return `<div class="sg-em sg-em-${i + 1}" style="aspect-ratio:${c.ratio}" role="img" aria-label="${escapeHtml(t(c.label))}"><div class="sg-em-in" aria-hidden="true">${c.draw(t)}<span class="sg-em-tag">${two(t, B('示意 · 演示数据', 'Illustration · demo data'), B('演示数据', 'Demo data'))}</span></div></div>`;
}

/* ---------------------------------------------------------------- page */
export function enterpriseArt(html, lang) {
  let h = html;
  /* 1. The four story panels: an empty `.image-about._0N` box each. The host goes inside the box, so the
        template's sideways slide (and the last panel's zoom and dim) carry the scene exactly as they carried
        the photograph; css/stargo-motion-enterprise.css sizes it to the panel within the 125% box. */
  ENT_PANEL_SCENES.forEach((scene, i) => {
    const box = `<div class="image-about _0${i + 1}"></div>`;
    if (h.split(box).length !== 2) throw new Error(`enterprise art: expected one ${box}`);
    h = h.replace(box, `<div class="image-about _0${i + 1} sg-en-box">${motionHost(scene, lang, 'sg-en-host')}</div>`);
  });
  /* 2. 「(原则)」: the parallax picture becomes the host, with the picture's class, so Mono's parallax moves it. */
  {
    const re = /<img\b[^>]*stargo-photo\/e08-emergency-stop-[^>]*>/g;
    const hits = h.match(re) ?? [];
    if (hits.length !== 1 || !/class="paralax-image"/.test(hits[0])) throw new Error('enterprise art: expected one 原则 .paralax-image (e08)');
    h = h.replace(re, motionHost(ENT_STOP_SCENE, lang, 'paralax-image sg-en-stop-host'));
  }
  /* 3. The five module cards: each <img> in `.team-image` becomes its drawing, in the photograph's ratio. */
  ['e09-capabilities', 'e10-access', 'e11-approval', 'e12-records', 'e13-key-cabinet'].forEach((id, i) => {
    const re = new RegExp(`<img\\b[^>]*stargo-photo/${id}-[^>]*>`, 'g');
    if ((h.match(re) ?? []).length !== 1) throw new Error(`enterprise art: expected one module card picture ${id}`);
    h = h.replace(re, moduleCard(i, lang));
  });
  if (/stargo-photo\/e(?:0[1-4]|0[89]|1[0-3])-/.test(h)) throw new Error('enterprise art: a replaced photograph is still referenced');

  /* 4. Files. The scene file loads before the engine; if the page already loads the engine (the cockpit
        column's scenes), the scene file goes in front of that tag instead of a second engine. */
  const { css, js } = motionAssets([...ENT_PANEL_SCENES, ENT_STOP_SCENE]);
  const sheets = [...css.split('\n'), '<link href="css/stargo-ent-cards.css" rel="stylesheet" type="text/css"/>']
    .filter((tag) => !h.includes(tag.match(/href="([^"]+)"/)[1]));
  const monoLink = /<link href="css\/monof-template\.app\.shared\.[a-f0-9]+\.css" rel="stylesheet" type="text\/css"\/>/;
  if (!monoLink.test(h)) throw new Error('enterprise art: Mono stylesheet link not found');
  if (sheets.length) h = h.replace(monoLink, (m) => `${m}\n${sheets.join('\n')}`);
  const ENGINE = '<script src="js/stargo-motion.js" defer></script>';
  const scripts = js.match(/<script\b[^>]*><\/script>/g).filter((tag) => tag !== ENGINE && !h.includes(tag));
  if (h.includes(ENGINE)) h = h.replace(ENGINE, `${scripts.join('')}${ENGINE}`);
  else {
    if (h.split('</body>').length !== 2) throw new Error('enterprise art: </body>');
    h = h.replace('</body>', `${scripts.join('')}${ENGINE}</body>`);
  }
  return h;
}

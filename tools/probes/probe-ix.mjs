import { createRequire } from 'node:module';
const { chromium } = createRequire('F:/stargo 网站/stargo-work-website/package.json')('@playwright/test');
const S='C:/Users/1/AppData/Local/Temp/claude/F--stargo---/b31df949-b6bc-4f89-9d0e-7fa0dc333312/scratchpad/shots-site';
const b = await chromium.launch();
// 1. sticky switcher crossfade on index
let p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto('http://127.0.0.1:4200/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const top = await p.evaluate(()=>document.querySelector('.product-sticky-block').getBoundingClientRect().top+scrollY);
const h = await p.evaluate(()=>document.querySelector('.product-sticky-block').offsetHeight);
const seen=[];
for (const f of [0.05,0.35,0.6,0.85]) { for (let y=0;y<=top+f*h;y+=500){ await p.evaluate(v=>scrollTo(0,v),y); await p.waitForTimeout(25);} await p.evaluate(v=>scrollTo(0,v),top+f*h); await p.waitForTimeout(900);
  seen.push(await p.evaluate(()=>[...document.querySelectorAll('.products-cards-dashboard-block')].map(e=>getComputedStyle(e).opacity).join(','))); }
console.log('switcher opacity per scroll stop:', seen);
// 2. awards hover on capabilities (moved module)
p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto('http://127.0.0.1:4200/capabilities.html',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
const row = p.locator('#atlas .award-wrapper').nth(3);
await row.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
const before = await row.locator('.button-overlay').evaluate(e=>getComputedStyle(e).transform);
await row.hover(); await p.waitForTimeout(800);
const after = await row.locator('.button-overlay').evaluate(e=>getComputedStyle(e).transform);
console.log('atlas row hover transform:', before, '->', after);
// 3. overlay menu open + screenshot
await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(300);
await p.locator('.circle-wrap').first().click(); await p.waitForTimeout(1500);
await p.screenshot({path:`${S}/overlay-menu.png`});
// 4. mobile
for (const pg of ['index.html','capabilities.html','workforce.html']) {
  const m = await (await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:0.6, isMobile:true, hasTouch:true })).newPage();
  const errs=[]; m.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await m.goto('http://127.0.0.1:4200/'+pg,{waitUntil:'networkidle'}); await m.waitForTimeout(2500);
  const H=await m.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0;y<H;y+=500){ await m.evaluate(v=>scrollTo(0,v),y); await m.waitForTimeout(40);} await m.evaluate(()=>scrollTo(0,0)); await m.waitForTimeout(500);
  const overflow = await m.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth ? document.documentElement.scrollWidth : 0);
  await m.screenshot({path:`${S}/m-${pg.replace('.html','')}.png`, fullPage:true});
  console.log('mobile', pg, 'height', H, 'hOverflow', overflow, errs);
}
await b.close();

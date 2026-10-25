import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { onRequestPost } from '../functions/api/contact.js';
import { SITE, req } from './paths.mjs';
const {chromium}=req('@playwright/test'); const browser=await chromium.launch();
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const results=[]; const OUT='.wrangler/fix-qa-20260905';mkdirSync(OUT,{recursive:true});
async function check(name,fn){try{await fn();console.log('PASS',name);results.push({name,pass:true});}catch(e){console.log('FAIL',name,e.message);results.push({name,pass:false,error:e.message});}}
try {
 for(const lang of ['', 'en/']) for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:900}});p.setDefaultTimeout(10000);
  await p.goto(BASE+'/'+lang+'index.html',{waitUntil:'load'});await p.waitForTimeout(5500);
  await check(`${lang}home ${width} FAQ keyboard`,async()=>{
   const buttons=p.locator('.toggle-header');assert.equal(await buttons.count(),4);
   for(let i=0;i<4;i++){
    const button=buttons.nth(i);await button.scrollIntoViewIfNeeded();await button.focus();await p.keyboard.press('Enter');await p.waitForTimeout(650);
    assert.equal(await button.getAttribute('aria-expanded'),'true');
    const id=await button.getAttribute('aria-controls');assert((await p.locator('#'+id).boundingBox()).height>20);
    await p.keyboard.press('Space');await p.waitForTimeout(650);assert.equal(await button.getAttribute('aria-expanded'),'false');
   }
  });
  await p.goto(BASE+'/'+lang+'pricing.html',{waitUntil:'load'});await p.waitForTimeout(1200);
  await check(`${lang}pricing ${width} ten FAQs`,async()=>{
   const qs=p.locator('.faq-question-block');assert.equal(await qs.count(),10);
   for(let i=0;i<10;i++){const q=qs.nth(i);await q.scrollIntoViewIfNeeded();await q.focus();await p.keyboard.press('Enter');await p.waitForTimeout(500);assert.equal(await q.getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');await p.waitForTimeout(500);assert.equal(await q.getAttribute('aria-expanded'),'false');}
  });
  if(width===390) await check(`${lang}dark mobile menu open/close/language`,async()=>{
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
   const menu=p.locator('.menu-button');await menu.click();await p.waitForTimeout(600);
   assert.equal(await menu.getAttribute('aria-expanded'),'true');
   assert.equal(await menu.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(244, 244, 244)');
   await p.screenshot({path:`${OUT}/${lang?'en':'zh'}-pricing-mobile-menu.png`});
   await p.locator('.nav-menu a[hreflang]').first().click();await p.waitForURL(lang?'**/pricing':'**/en/pricing');
   assert.equal(await p.locator('html').getAttribute('lang'),lang?'zh-CN':'en');
  });
  await p.close();
 }
 /* The homepage opening (tools/blocks/og-intro*.js): once per browser session, gone
    at the first tap without following what was under it, and never there for reduced
    motion or without JavaScript. Every context is a new session. `seen` is filled the
    moment the overlay is parsed, just before its inline script runs, so it is exactly
    what the first frame shows: shown>0 means the overlay covered the page. */
 const seen=()=>{const s=window.__og={play:false,shown:0};const look=()=>{const h=document.documentElement;if(h.classList.contains('og-intro-play'))s.play=true;const o=document.querySelector('[data-og-intro]');if(o&&getComputedStyle(o).display!=='none')s.shown++;};new MutationObserver(look).observe(document,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});const f=()=>{look();requestAnimationFrame(f);};requestAnimationFrame(f);};
 const og=(p)=>p.evaluate(()=>({...window.__og,inDom:!!document.querySelector('[data-og-intro]'),stored:sessionStorage.getItem('stargo-intro')}));
 /* Presses on the hero's own button at given moments of the opening (ms from its first frame),
    while the page's main thread is held busy from `from` for `ms` — as Webflow's start-up task holds
    it for seconds on a slow machine — so they wait in the queue and are handled late. They are sent
    over CDP, which stamps each with the moment it is sent, as a real press is stamped with the
    moment it happens. Images are held so that the window `load`, and Webflow's own start-up after
    it, cannot land somewhere else in the sequence by chance, and let go once the presses have been
    handled: Chromium does not start a navigation while a held request is still open. Returns each
    pointerdown as the page saw it (stamp and handling, in ms from the opening's first frame;
    whether the overlay was still in the document), whether the button was followed, and — with
    `again` — whether one more, ordinary click on it a second later is. */
 const lateClicks=async(home,{from,ms,at,again=false})=>{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const downs=[];
  await ctx.addInitScript(()=>addEventListener('pointerdown',(e)=>console.debug('__og '+JSON.stringify([e.timeStamp,performance.now(),!!document.querySelector('[data-og-intro]')])),{capture:true,passive:true}));
  p.on('console',(m)=>{if(m.text().startsWith('__og '))downs.push(JSON.parse(m.text().slice(5)));});
  const held=[];await p.route(/\.(webp|jpe?g|png|avif|gif|svg)(\?|$)/,(r)=>held.push(r));
  try{
   await p.goto(home,{waitUntil:'domcontentloaded'});
   const o=await p.waitForFunction(()=>{const a=document.querySelector('[data-og-intro] .og-is-hero')?.getAnimations()[0];return a&&a.startTime!=null&&{origin:performance.timeOrigin,start:a.startTime};},null,{timeout:3000,polling:10}).then((h)=>h.jsonValue());
   const box=await p.evaluate(()=>{const a=[...document.querySelectorAll('a.contact-info.for-button')].find(a=>!a.closest('[data-og-intro]'));const r=a.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};});
   const cdp=await ctx.newCDPSession(p);await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:box.x,y:box.y});
   /* Last, so that nothing above waits behind it: busy from `from` (or now, if later) to from+ms. */
   await p.evaluate(([from,ms,start])=>{setTimeout(()=>{while(performance.now()<start+from+ms);},start+from-performance.now());},[from,ms,o.start]);
   const sent=[];
   for(const t of at){
    while(Date.now()<o.origin+o.start+t)await new Promise((r)=>setTimeout(r,2));
    for(const type of ['mousePressed','mouseReleased'])sent.push(cdp.send('Input.dispatchMouseEvent',{type,x:box.x,y:box.y,button:'left',clickCount:1}));
   }
   await Promise.all(sent);for(const r of held.splice(0))r.abort().catch(()=>{});await p.unroute(/\.(webp|jpe?g|png|avif|gif|svg)(\?|$)/);
   const followed=await p.waitForURL(/\/contact(?:\.html)?$/,{timeout:2500,waitUntil:'commit'}).then(()=>true,()=>false);
   const res={followed,downs:downs.map(([stamp,handled,inDom])=>({stamp:Math.round(stamp-o.start),handled:Math.round(handled-o.start),inDom}))};
   if(again&&!followed){await p.waitForTimeout(1000);await p.mouse.click(box.x,box.y);res.again=await p.waitForURL(/\/contact(?:\.html)?$/,{timeout:2500,waitUntil:'commit'}).then(()=>true,()=>false);}
   return res;
  }finally{await p.unrouteAll({behavior:'ignoreErrors'});await ctx.close();}
 };
 for(const lang of ['', 'en/']){
  const home=BASE+'/'+lang+'index.html';
  await check(`${lang}home opening plays once per session`,async()=>{
   const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(seen);const p=await ctx.newPage();
   try{
    await p.goto(home,{waitUntil:'domcontentloaded'});let s=await og(p);
    assert(s.play&&s.shown>0,'first view plays: '+JSON.stringify(s));assert.equal(s.stored,'1');
    await p.waitForFunction(()=>!document.querySelector('[data-og-intro]'),null,{timeout:9000});
    assert.equal(await p.evaluate(()=>document.documentElement.classList.contains('og-intro-play')),false,'class removed when it ends');
    await p.goto(BASE+'/'+lang+'about.html',{waitUntil:'load'});await p.locator('a.logo-first:visible').first().click();await p.waitForURL(/\/(?:en\/)?(?:index\.html)?$/);
    await p.waitForLoadState('domcontentloaded');s=await og(p);assert(!s.play&&s.shown===0&&!s.inDom,'logo back home: not covered for a frame '+JSON.stringify(s));
    await p.goto(BASE+'/'+lang+'pricing.html',{waitUntil:'load'});await p.goBack({waitUntil:'domcontentloaded'});await p.waitForTimeout(300);
    s=await og(p);assert(!s.play&&s.shown===0&&!s.inDom,'back button: not covered for a frame '+JSON.stringify(s));
    await p.reload({waitUntil:'domcontentloaded'});s=await og(p);assert(!s.play&&s.shown===0&&!s.inDom,'reload: not covered '+JSON.stringify(s));
   }finally{await ctx.close();}
   const again=await browser.newContext({viewport:{width:390,height:844}});await again.addInitScript(seen);const q=await again.newPage();
   try{await q.goto(home,{waitUntil:'domcontentloaded'});const s=await og(q);assert(s.play&&s.shown>0,'a new session plays it again '+JSON.stringify(s));}finally{await again.close();}
  });
  await check(`${lang}home opening ends at the first tap`,async()=>{
   const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(seen);const p=await ctx.newPage();
   /* Hold the page's images, so the window `load` — and Webflow's start-up task after it, seconds of
      busy main thread on a slow machine — waits until the tap is done. The tap then lands while the
      opening is certainly still playing, rather than queued behind that task until it has ended.
      They are let go once the tap is in: Chromium does not start a navigation while a held request
      is still open, so a followed link would only show seconds later. */
   const held=[];await p.route(/\.(webp|jpe?g|png|avif|gif|svg)(\?|$)/,(r)=>held.push(r));
   try{
    await p.goto(home,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1000);
    assert.equal((await og(p)).inDom,true,'still playing at 1s');
    /* Tap where the hero's own button lies under the overlay: the opening goes, the
       button is not followed. */
    const box=await p.evaluate(()=>{const a=[...document.querySelectorAll('a.contact-info.for-button')].find(a=>!a.closest('[data-og-intro]'));const r=a.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};});
    const t0=Date.now();await p.mouse.click(box.x,box.y);
    await p.waitForFunction(()=>!document.querySelector('[data-og-intro]'),null,{timeout:1000});assert(Date.now()-t0<1000);
    for(const r of held.splice(0))r.abort().catch(()=>{});await p.unroute(/\.(webp|jpe?g|png|avif|gif|svg)(\?|$)/);
    await p.waitForTimeout(1500);assert.match(p.url(),/\/index\.html$/,'the skipping tap did not follow the link');
    assert.equal(await p.evaluate(()=>document.documentElement.classList.contains('og-intro-play')),false);
   }finally{await p.unrouteAll({behavior:'ignoreErrors'});await ctx.close();}
  });
  /* The opening never takes the pointer itself (og-intro.css); og-intro.js judges a press by its
     own timeStamp, so how late a busy main thread handles it must not change what it does. */
  await check(`${lang}home opening: a press while covered follows no link, however late it is handled`,async()=>{
   /* 3.6s is the black beat (all columns down 3405-3905): pressed once with the main thread free
      and once while it is busy. */
   for(const ms of [0,1500]){
    const r=await lateClicks(home,{from:3200,ms,at:[3600],again:true});const d=r.downs[0];
    assert(d&&d.stamp>=3405&&d.stamp<3905,'pressed in the black beat '+JSON.stringify(r));
    if(ms)assert(d.handled-d.stamp>=300,'handled late, behind the busy main thread '+JSON.stringify(r));
    assert.equal(r.followed,false,'the button under the black screen was not followed '+JSON.stringify(r));
    assert.equal(r.again,true,'a later, ordinary click on the uncovered button is followed '+JSON.stringify(r));
   }
  });
  await check(`${lang}home opening: a click after it has visibly ended is not swallowed, however late it is handled`,async()=>{
   /* 5.6s: the last column went at 5.11s, but the main thread is busy from 3.0s to 6.6s — through
      the whole wipe, as Webflow's start-up task was when this was measured — so the overlay's own
      timer has not run when the press is handled and the node is still there. */
   const r=await lateClicks(home,{from:3000,ms:3600,at:[5600]});const d=r.downs[0];
   assert(d&&d.stamp>=5110,'pressed after the end '+JSON.stringify(r));
   assert.equal(d.inDom,true,'handled before the overlay\'s timer could take it out '+JSON.stringify(r));
   assert.equal(r.followed,true,'the visible button was followed '+JSON.stringify(r));
  });
  await check(`${lang}home opening: a click after a late skip is not swallowed`,async()=>{
   /* A skip at 2.2s, handled at 3.0s; the page is uncovered from the next frame, and a separate
      press at 3.5s — still before the lift, when the opening would have covered it — is an
      ordinary click. */
   const r=await lateClicks(home,{from:2000,ms:1000,at:[2200,3500]});
   assert(r.downs.length===2&&r.downs[0].handled-r.downs[0].stamp>=500,'the skip was handled late '+JSON.stringify(r));
   assert.equal(r.followed,true,'the second click was followed '+JSON.stringify(r));
  });
  /* Mono's load timeline t-7c6ce201 hid the hero and animated it in again at the window `load`,
     after the opening had uncovered it (tools/fuse-ix.mjs takes the homepage out of it). Sampled
     from the first frame to 3.5s after Webflow's start-up: the big STARGO WORK letters, the copy and
     the dots are never split or moved, the button never fades; on another page the same timeline
     still plays as Mono wrote it. */
  await check(`${lang}home hero stays put after the opening`,async()=>{
   const watch=()=>{const s=window.__hero={split:0,minCta:1,dots:'none',started:false,lateAtReady:null};window.addEventListener('__wf_ix3_ready',()=>{s.lateAtReady=document.documentElement.classList.contains('sg-ix-late');});const f=()=>{const cta=[...document.querySelectorAll('a.contact-info.for-button')].find(a=>!a.closest('[data-og-intro]'));
    if(cta&&document.documentElement.classList.contains('w-mod-ix3')){s.started=true;s.minCta=Math.min(s.minCta,+getComputedStyle(cta).opacity);s.split=Math.max(s.split,document.querySelectorAll('.hero h1 div, .hero h2 div, .hero .top-text.big div').length);const d=document.querySelector('.hero .circle-divider');if(d&&getComputedStyle(d).transform!=='none')s.dots=getComputedStyle(d).transform;}setTimeout(f,25);};f();};
   const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(watch);const p=await ctx.newPage();
   try{
    await p.goto(home,{waitUntil:'load'});await p.waitForTimeout(3500);const s=await p.evaluate(()=>window.__hero);
    assert(s.started&&s.minCta===1&&s.split===0&&s.dots==='none','homepage hero untouched '+JSON.stringify(s));
    await p.goto(BASE+'/'+lang+'about.html',{waitUntil:'load'});await p.waitForTimeout(3500);const t=await p.evaluate(()=>window.__hero);
    /* Unless Webflow started more than a second after the first paint: then the hero has been
       readable for a second and its load timeline is put at its end, not hidden and replayed
       (tools/speed.mjs, js/stargo-splittext-cjk.js). */
    if(t.lateAtReady)assert(t.started&&t.minCta===1,'about: a late start does not hide the shown button '+JSON.stringify(t));
    else assert(t.started&&t.minCta===0,'about: the button still fades in at load '+JSON.stringify(t));
   }finally{await ctx.close();}
  });
  await check(`${lang}home opening absent for reduced motion and without JavaScript`,async()=>{
   const rm=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await rm.addInitScript(seen);const p=await rm.newPage();
   try{await p.goto(home,{waitUntil:'domcontentloaded'});const s=await og(p);assert(!s.play&&s.shown===0&&!s.inDom,'reduced motion '+JSON.stringify(s));assert.equal(s.stored,null,'not played, so not marked');
    /* Nor Mono's black page-load curtain, which used to drop over the page at Webflow's start-up
       whatever the motion setting (tools/fuse-ix.mjs). */
    assert.equal(await p.locator('.preloader').count(),0,'no .preloader on the homepage');}finally{await rm.close();}
   const nojs=await browser.newContext({viewport:{width:1440,height:900},javaScriptEnabled:false});const q=await nojs.newPage();
   try{await q.goto(home,{waitUntil:'load'});assert.equal(await q.locator('[data-og-intro]').count(),1);assert.equal(await q.locator('[data-og-intro]').isVisible(),false,'no JavaScript: never displayed');}finally{await nojs.close();}
  });
 }
 for(const lang of ['', 'en/']){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  // Intelligence keeps the lifelogx homepage and its in-page anchors; workforce moved to
  // the lifelogx feature template, whose hero button books a demo instead.
  await check(`${lang}intelligence anchor lands`,async()=>{
   await p.goto(BASE+'/'+lang+'intelligence.html');await p.waitForTimeout(1000);
   await p.locator('a[href="#lx-ontology"]').click();await p.waitForTimeout(1800);
   const y=await p.locator('#lx-ontology').evaluate(e=>e.getBoundingClientRect().top);assert(y>=-5&&y<250,`target y=${y}`);
  });
  await check(`${lang}workforce hero cta`,async()=>{
   await p.goto(BASE+'/'+lang+'workforce.html');await p.waitForTimeout(1200);
   const btn=p.locator('.lx-feature-description-holder a, .lx-hero-features a.lx-button').first();
   assert.equal(await btn.count(),1,'hero button');
   await btn.click();await p.waitForURL(u=>/contact/.test(u.pathname),{timeout:15000});
   assert.equal(await p.locator('form').count()>0,true,'lands on the contact form');
  });
  await check(`${lang}short contact and newsletter relay`,async()=>{
   const original=globalThis.fetch;const mails=[];globalThis.fetch=async(url,opts)=>{mails.push(JSON.parse(opts.body));return Response.json({id:'fixture'});};
   await p.route('**/api/contact',async route=>{const req=route.request();const r=await onRequestPost({request:new Request(req.url(),{method:'POST',headers:req.headers(),body:req.postData()}),env:{RESEND_API_KEY:'fixture'}});await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
   try{
    await p.goto(BASE+'/'+lang+'enterprise.html');await p.waitForTimeout(1200);
    const f=p.locator('#email-form');await f.locator('[name=Name]').fill('QA not delivered');await f.locator('[type=email]').fill('qa@example.invalid');await f.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);assert.equal(mails.length,1);assert.equal(await f.isVisible(),false);
    const n=p.locator('#Subscribe-Footer');await n.locator('[type=email]').fill('qa@example.invalid');await n.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);assert.equal(mails.length,2);assert.equal(await n.isVisible(),false);assert.match(mails[1].subject,/Newsletter request/);
   }finally{globalThis.fetch=original;await p.unroute('**/api/contact');}
  });await p.close();
 }
}finally{await browser.close();}
writeFileSync(`${OUT}/interactions-results.json`,JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;

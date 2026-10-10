import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { onRequestPost } from '../functions/api/contact.js';
import { SITE, req } from './paths.mjs';
import { DEMO_PHONE_MEDIA } from './ow-blocks/demo-video.mjs';
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
  /* The desktop side menu sits behind the page and is shown by moving the page
     aside (review 2026-10-09: on the OPEN WORK pages a rule that held the page
     still on load also held it still here, and the menu opened invisibly).
     Opened by mouse and by keyboard, its first link must be what is on screen
     at its own centre, and the keyboard's focus must be on it. */
  if(width===1440) await check(`${lang}pricing 1440 side menu shows its links`,async()=>{
   await p.evaluate(()=>{if(typeof lenis!=='undefined')lenis.scrollTo(0,{immediate:true});else scrollTo(0,0);});await p.waitForTimeout(400);
   const trigger=p.locator('[aria-controls="stargo-side-menu"]');
   const onTop=()=>p.evaluate(()=>{const a=document.querySelector('#stargo-side-menu .menu-item a[href]');const r=a.getBoundingClientRect();const e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {hit:!!e&&(e===a||a.contains(e)),focused:document.activeElement===a,what:e?e.tagName+'.'+e.className:'none'};});
   await trigger.click();await p.waitForTimeout(1500);
   assert.equal(await trigger.getAttribute('aria-expanded'),'true');
   let r=await onTop();assert(r.hit,`mouse: the first menu link is covered by ${r.what}`);
   await p.keyboard.press('Escape');await p.waitForTimeout(1500);
   assert.equal(await trigger.getAttribute('aria-expanded'),'false');
   await trigger.focus();await p.keyboard.press('Enter');await p.waitForTimeout(1500);
   r=await onTop();assert(r.focused,'keyboard: focus is not on the first menu link');assert(r.hit,`keyboard: the focused link is covered by ${r.what}`);
   await p.keyboard.press('Escape');await p.waitForTimeout(1500);
  });
  if(width===390) await check(`${lang}dark mobile menu open/close/language`,async()=>{
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
   const menu=p.locator('.menu-button');await menu.click();await p.waitForTimeout(600);
   assert.equal(await menu.getAttribute('aria-expanded'),'true');
   assert.equal(await menu.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(244, 244, 244)');
   await p.screenshot({path:`${OUT}/${lang?'en':'zh'}-pricing-mobile-menu.png`});
   await p.locator('.nav-menu a[hreflang]').first().click();await p.waitForURL(lang?'**/pricing.html':'**/en/pricing.html');
   assert.equal(await p.locator('html').getAttribute('lang'),lang?'zh-CN':'en');
  });
  await p.close();
 }
 for(const lang of ['', 'en/']){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  // Intelligence keeps its in-page anchors (#lx-ontology, the memory section). Since
  // 2026-10-09 (C2) the four product pages are built like the homepage
  // (tools/ow-blocks/pages.mjs): the workforce hero's first button books a demo,
  // and the product page's catalogue opens the group an address names.
  await check(`${lang}intelligence anchor lands`,async()=>{
   await p.goto(BASE+'/'+lang+'intelligence.html');await p.waitForTimeout(1000);
   await p.locator('a[href="#lx-ontology"]').click();await p.waitForTimeout(1800);
   const y=await p.locator('#lx-ontology').evaluate(e=>e.getBoundingClientRect().top);assert(y>=-5&&y<250,`target y=${y}`);
  });
  await check(`${lang}workforce hero cta`,async()=>{
   await p.goto(BASE+'/'+lang+'workforce.html');await p.waitForTimeout(1200);
   const btn=p.locator('.ow-hero .ow-cta-row a.ow-hero-cta');
   assert.equal(await btn.count(),1,'hero button');
   await btn.click();await p.waitForURL(u=>/contact/.test(u.pathname),{timeout:15000});
   assert.equal(await p.locator('form').count()>0,true,'lands on the contact form');
  });
  await check(`${lang}capabilities catalogue opens the named group`,async()=>{
   await p.goto(BASE+'/'+lang+'capabilities.html#g08');await p.waitForTimeout(1200);
   assert.equal(await p.locator('details#g08').evaluate(d=>d.open),true,'#g08 open');
   assert.equal(await p.locator('details.ow-cat-g[open]').count(),1,'only the named group');
   const box=await p.locator('#g08 .ow-cat-body').boundingBox();assert(box&&box.height>40,'its detail is shown');
  });
  /* The demo form (homepage band and contact.html): name + company + mobile / WeChat are required, the
     e-mail is optional but valid when given (owner, 2026-10-10). Real client script, real handler, stubbed mail. */
  for(const page of ['index.html','contact.html']) await check(`${lang}${page} demo form: three required fields, optional e-mail`,async()=>{
   const original=globalThis.fetch;const mails=[];const requests=[];let configured=true;
   globalThis.fetch=async(url,opts)=>{mails.push(JSON.parse(opts.body));return Response.json({id:'fixture'});};
   await p.route('**/api/contact',async route=>{const req=route.request();requests.push(req.postDataJSON());const r=await onRequestPost({request:new Request(req.url(),{method:'POST',headers:req.headers(),body:req.postData()}),env:configured?{RESEND_API_KEY:'fixture'}:{}});await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
   try{
    await p.goto(BASE+'/'+lang+page,{waitUntil:'load'});await p.waitForTimeout(1000);
    const f=p.locator('form[data-stargo-form="contact"]');assert.equal(await f.count(),1,'one demo form');
    /* the form's kind for a post without the script: one hidden input, which the script does not send as a field */
    assert.deepEqual(await f.evaluate(form=>[...form.querySelectorAll('input[type=hidden]')].map(e=>[e.name,e.value])),[['form','contact']],'a hidden form=contact');
    const fields=await f.evaluate(form=>[...form.querySelectorAll('input:not([type=submit]):not([type=hidden]):not([name=website]), select, textarea')].map(e=>({name:e.name,type:e.type,required:e.required,autocomplete:e.autocomplete,label:(form.querySelector(`label[for="${e.id}"]`)||{}).textContent||'',ariaLabel:e.getAttribute('aria-label')})));
    assert.deepEqual(fields.filter(x=>x.required).map(x=>x.name),['name','company','phone'],'required: name, company, phone');
    assert.deepEqual(fields.slice(0,4).map(x=>[x.name,x.autocomplete]),[['name','name'],['company','organization'],['phone','tel'],['email','email']],'order and autocomplete');
    assert.equal(fields[3].type,'email');assert.equal(fields[3].required,false,'e-mail is not required');
    assert.match(fields[3].label,lang?/optional/:/选填/,'the e-mail says it is optional');
    for(const x of fields.slice(0,4)){assert(x.label.trim(),`${x.name} has a visible label`);assert.equal(x.ariaLabel,null,`${x.name}: the visible label names it`);}
    assert.deepEqual(fields.slice(0,3).map(x=>/\*/.test(x.label)),[true,true,true],'the three required carry the * marker');
    if(page==='contact.html'){assert.deepEqual(fields.slice(4).map(x=>x.name),['plan','focus','message'],'the contact page keeps its optional extras');}
    // nothing filled: blocked client-side, focus on the first field
    await f.evaluate(e=>e.requestSubmit());assert.equal(requests.length,0,'empty form sends nothing');
    assert.equal(await p.evaluate(()=>document.activeElement.name),'name','focus on the first invalid field');
    assert.equal(await f.locator('[aria-invalid="true"]').count(),3,'the three missing fields are flagged');
    assert(await f.locator('.stargo-form-note').isVisible());
    // a name and a company are still not enough
    await f.locator('[name=name]').fill('QA not delivered');await f.locator('[name=company]').fill('QA Ltd');
    await f.evaluate(e=>e.requestSubmit());assert.equal(requests.length,0,'phone is required');assert.equal(await p.evaluate(()=>document.activeElement.name),'phone');
    // junk phone, then a bad optional e-mail
    await f.locator('[name=phone]').fill('12');await f.evaluate(e=>e.requestSubmit());assert.equal(requests.length,0,'junk phone is blocked');assert.equal(await p.evaluate(()=>document.activeElement.name),'phone');
    await f.locator('[name=phone]').fill('wxid_qa_test');assert.equal(await f.locator('[name=phone]').getAttribute('aria-invalid'),null,'correcting a field clears its flag');
    await f.locator('[name=email]').fill('not-an-email');await f.evaluate(e=>e.requestSubmit());assert.equal(requests.length,0,'a bad e-mail is blocked even though optional');assert.equal(await p.evaluate(()=>document.activeElement.name),'email');
    // a good form without an e-mail goes through, and carries no e-mail key
    await f.locator('[name=email]').fill('');await f.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);
    assert.equal(requests.length,1);assert.equal(mails.length,1,'relayed');assert.equal(await f.isVisible(),false,'success replaces the form');
    assert.deepEqual(requests[0].fields.map(x=>x.key),['name','company','phone'],'stable keys, no empty e-mail');
    assert.equal(requests[0].fields.find(x=>x.key==='phone').value,'wxid_qa_test');
    assert(!('reply_to' in mails[0]),'no reply_to without an e-mail');assert.match(mails[0].subject,/Inquiry · QA not delivered · QA Ltd$/);
    assert.match(await p.locator('.w-form-done[role="status"]').innerText(),lang?/12 hours/:/12 小时/);
    // again with an e-mail: it is sent and becomes reply_to
    await p.goto(BASE+'/'+lang+page,{waitUntil:'load'});await p.waitForTimeout(800);
    const g=p.locator('form[data-stargo-form="contact"]');
    await g.locator('[name=name]').fill('QA not delivered');await g.locator('[name=company]').fill('QA Ltd');await g.locator('[name=phone]').fill('+86 187 7512 7878');await g.locator('[name=email]').fill('qa@example.invalid');
    await g.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);
    assert.deepEqual(requests[1].fields.map(x=>x.key),['name','company','phone','email']);assert.equal(mails[1].reply_to,'qa@example.invalid');
    // the mail service is not configured: no success, the fallback offers WeChat and the phone
    configured=false;await p.goto(BASE+'/'+lang+page,{waitUntil:'load'});await p.waitForTimeout(800);
    const h=p.locator('form[data-stargo-form="contact"]');
    await h.locator('[name=name]').fill('QA not delivered');await h.locator('[name=company]').fill('QA Ltd');await h.locator('[name=phone]').fill('wxid_qa_test');
    await h.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);
    assert.equal(requests.length,3);assert(await h.isVisible(),'503 is never shown as success');
    const note=await h.locator('.stargo-form-note').innerText();assert(note.includes('505099021')&&note.includes('+86 187 7512 7878'),`fallback offers WeChat and phone: ${note}`);
    assert.equal(await h.locator('.stargo-form-note a[href^="mailto:"]').count(),1);assert.equal(await h.locator('.stargo-form-note a[href^="tel:"]').count(),1);
    assert.match(decodeURIComponent(await h.locator('.stargo-form-note a[href^="mailto:"]').getAttribute('href')),/company: QA Ltd|Company: QA Ltd|公司: QA Ltd/);
   }finally{globalThis.fetch=original;await p.unroute('**/api/contact');}
  });
  await check(`${lang}newsletter relay needs only an e-mail`,async()=>{
   const original=globalThis.fetch;const mails=[];globalThis.fetch=async(url,opts)=>{mails.push(JSON.parse(opts.body));return Response.json({id:'fixture'});};
   await p.route('**/api/contact',async route=>{const req=route.request();const r=await onRequestPost({request:new Request(req.url(),{method:'POST',headers:req.headers(),body:req.postData()}),env:{RESEND_API_KEY:'fixture'}});await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
   try{
    await p.goto(BASE+'/'+lang+'enterprise.html');await p.waitForTimeout(1200);
    const n=p.locator('#Subscribe-Footer');
    await n.evaluate(e=>e.requestSubmit());await p.waitForTimeout(300);assert.equal(mails.length,0,'an empty newsletter form sends nothing');
    await n.locator('[type=email]').fill('qa@example.invalid');await n.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);assert.equal(mails.length,1);assert.equal(await n.isVisible(),false);assert.match(mails[0].subject,/Newsletter request/);
   }finally{globalThis.fetch=original;await p.unroute('**/api/contact');}
  });await p.close();
 }
 /* The OPEN WORK demo video (round 2, 2026-10-10; tools/ow-blocks/demo-video.mjs), zh and en, on the homepage and the
    product page: muted, inline, looping, preload="none", no autoplay attribute, data-start; in the markup the desktop
    MP4 + WebM of the page's language, then the phone cut's MP4 + WebM for DEMO_PHONE_MEDIA, and in the page (the
    script chooses) only this screen's pair; its still (a <picture>: the phone cut's at 390, the desktop one at 1440 —
    each screen fetches only its own). The box has the film's proportions
    before anything loads (16:10, 3:5 on a phone). The first load fetches no film; it plays once it is on screen —
    the phone cut on a phone, from data-start the first time — pauses when it leaves, and a pause by hand (its button,
    by keyboard) holds. With prefers-reduced-motion, or the browser's data saver, it never starts by itself, and the
    button still plays it. */
 const toY=(p,y)=>p.evaluate(y=>{if(typeof lenis!=='undefined')lenis.scrollTo(y,{immediate:true});else scrollTo(0,y);},y);
 const FILM=/ow-demo-[a-z]+(?:-phone)?\.(?:mp4|webm)/;
 const filmCentre=(p)=>p.evaluate(()=>{const r=document.querySelector('video[data-ow-demo]').getBoundingClientRect();return Math.max(0,r.top+scrollY+r.height/2-innerHeight/2);});
 const playing=(p,timeout=15000)=>p.waitForFunction(()=>{const v=document.querySelector('video[data-ow-demo]');return !v.paused&&v.currentTime>0.3;},null,{timeout});
 const paused=(p)=>p.locator('video[data-ow-demo]').evaluate(v=>v.paused);
 for(const lang of ['', 'en/']) for(const page of ['index.html','capabilities.html']) for(const width of [1440,390]) await check(`${lang}${page} ${width} demo video: poster only on load, plays in view, pauses out of view, button`,async()=>{
  const L=lang?'en':'zh';const label=(k)=>({zh:{play:'播放演示视频',pause:'暂停演示视频'},en:{play:'Play the demo video',pause:'Pause the demo video'}})[L][k];
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:900}});const p=await ctx.newPage();p.setDefaultTimeout(15000);
  const film=[],stills=[];p.on('request',r=>{if(FILM.test(r.url()))film.push(r.url());if(/ow-demo-[a-z]+(?:-phone)?-poster\.webp/.test(r.url()))stills.push(r.url());});
  const phone=width<=640,cut=phone?'-phone':'';
  try{
   await p.goto(BASE+'/'+lang+page,{waitUntil:'load'});await p.waitForTimeout(1500);
   const v=p.locator('video[data-ow-demo]');assert.equal(await v.count(),1,'one demo video');
   const a=await v.evaluate(v=>{const r=v.getBoundingClientRect();const pic=v.previousElementSibling;const img=pic&&pic.querySelector('img');return {muted:v.muted&&v.hasAttribute('muted'),inline:v.playsInline,loop:v.loop,preload:v.getAttribute('preload'),autoplay:v.hasAttribute('autoplay'),controls:v.controls,poster:v.getAttribute('poster'),start:v.getAttribute('data-start'),label:v.getAttribute('aria-label'),sources:[...v.querySelectorAll('source')].map(s=>[s.getAttribute('media')||'',s.getAttribute('type').split(';')[0],s.getAttribute('src')]),paused:v.paused,ratio:r.width/r.height,still:pic&&pic.matches('picture.ow-demo-poster')&&img?{src:img.currentSrc,natural:img.naturalWidth,complete:img.complete,alt:img.alt,hidden:pic.getAttribute('aria-hidden'),phone:pic.querySelector('source').getAttribute('srcset')}:null};});
   assert(a.muted,'muted');assert(a.inline,'playsinline');assert(a.loop,'loop');assert.equal(a.preload,'none');assert.equal(a.autoplay,false,'no autoplay attribute');
   assert.equal(a.poster,null,'no poster attribute (the still is the picture under it)');assert.equal(a.start,'2','data-start');
   /* the markup: the desktop pair first (what a browser that ignores media plays without the script), then the phone pair */
   const html=await (await p.request.get(BASE+'/'+lang+page)).text();
   const markup=[...((/<video\b[^>]*\sdata-ow-demo[\s\S]*?<\/video>/.exec(html)||[''])[0]).matchAll(/<source\b([^>]*)>/g)].map(m=>[(/\smedia="([^"]*)"/.exec(m[1])||[0,''])[1],(/\stype="([^";]*)/.exec(m[1])||[0,''])[1],(/\ssrc="([^"]*)"/.exec(m[1])||[0,''])[1]]);
   assert.deepEqual(markup.map(x=>[x[0],x[1]]),[['','video/mp4'],['','video/webm'],[DEMO_PHONE_MEDIA,'video/mp4'],[DEMO_PHONE_MEDIA,'video/webm']],'markup: MP4 + WebM, then the phone cut\'s MP4 + WebM');
   markup.forEach(([m,type,src])=>assert.match(src,new RegExp(`ow-demo-${L}${m?'-phone':''}\\.${type.split('/')[1]}\\?v=[0-9a-f]{12}$`),`${m} ${type}`));
   /* the page: the script put only this screen's pair in the video */
   assert.deepEqual(a.sources.map(x=>[x[1],x[2].replace(/\?v=.*$/,'').split('/').pop()]),[['video/mp4',`ow-demo-${L}${cut}.mp4`],['video/webm',`ow-demo-${L}${cut}.webm`]],`only this screen's pair is in the video: ${a.sources.map(x=>x[2]).join(', ')}`);
   assert.match(a.label,lang?/demo data/:/演示数据/,'its name says demo data');
   assert.equal(a.controls,false,'the script replaced the browser controls');
   assert(Math.abs(a.ratio-(phone?0.6:1.6))<0.01,`a ${phone?'3:5':'16:10'} box before anything loads (${a.ratio})`);
   assert.equal(a.paused,true,'paused off screen');assert.deepEqual(film,[],'the first load fetches no film');
   assert(a.still,'its still: a picture right before the video');assert.equal(a.still.hidden,'true','the still is hidden from screen readers (the video has the name)');
   assert.match(a.still.alt,lang?/demo data/:/演示数据/,'the still says demo data');assert.match(a.still.phone,new RegExp(`ow-demo-${L}-phone-poster\\.webp\\?v=[0-9a-f]{12}$`),'the phone still');
   assert.match(a.still.src,new RegExp(`ow-demo-${L}${cut}-poster\\.webp\\?v=[0-9a-f]{12}$`),`this screen's still (${a.still.src})`);
   assert(a.still.complete&&a.still.natural===(phone?720:1440),`the still loads (${a.still.natural}px)`);
   assert(stills.every(u=>new RegExp(`ow-demo-${L}${cut}-poster`).test(u)),`only this screen's still is fetched: ${stills.join(', ')}`);
   const b=p.locator('[data-ow-demo-toggle]');assert(await b.isVisible(),'its button shows');assert.equal(await b.evaluate(e=>e.tagName),'BUTTON');
   assert.equal(await b.getAttribute('aria-label'),label('play'));
   await toY(p,await filmCentre(p));await playing(p);
   assert(film.length>0,'on screen, the film is fetched');assert.equal(await b.getAttribute('aria-label'),label('pause'));
   const cs=await v.evaluate(v=>({src:v.currentSrc,t:v.currentTime}));
   assert.match(cs.src,new RegExp(`ow-demo-${L}${cut}\\.(?:mp4|webm)\\?v=`),`this screen's cut plays (${cs.src.split('/').pop()})`);
   assert(cs.t>=2,`the first play opens at data-start (${cs.t.toFixed(2)} s)`);
   await toY(p,0);await p.waitForFunction(()=>document.querySelector('video[data-ow-demo]').paused,null,{timeout:5000});
   await toY(p,await filmCentre(p));await playing(p,8000);
   assert.equal(film.filter(u=>!new RegExp(`ow-demo-${L}${cut}\\.`).test(u)).length,0,`only this screen's cut is fetched: ${film.join(', ')}`);
   await b.focus();await p.keyboard.press('Enter');await p.waitForTimeout(300);
   assert.equal(await paused(p),true,'Enter on the button pauses it');assert.equal(await b.getAttribute('aria-label'),label('play'));
   await toY(p,0);await p.waitForTimeout(500);await toY(p,await filmCentre(p));await p.waitForTimeout(1500);
   assert.equal(await paused(p),true,'a pause by hand holds when it comes back on screen');
   await b.focus();await p.keyboard.press('Space');await playing(p,8000);
   if(width===1440)await p.screenshot({path:`${OUT}/${L}-${page.replace('.html','')}-demo-video.png`});
  }finally{await ctx.close();}
 });
 for(const lang of ['', 'en/']) await check(`${lang}index.html demo video under reduced motion: never starts by itself`,async()=>{
  const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await ctx.newPage();p.setDefaultTimeout(15000);
  const film=[];p.on('request',r=>{if(FILM.test(r.url()))film.push(r.url());});
  try{
   await p.goto(BASE+'/'+lang+'index.html',{waitUntil:'load'});await p.waitForTimeout(1000);
   await toY(p,await filmCentre(p));await p.waitForTimeout(2500);
   assert.equal(await paused(p),true,'on screen, still paused');assert.deepEqual(film,[],'no film fetched');
   await p.locator('[data-ow-demo-toggle]').click();await playing(p);
  }finally{await ctx.close();}
 });
 /* The browser's data saver (navigator.connection.saveData) is honoured like reduced motion. */
 /* A browser that ignores `media` on a video's <source> — Chrome and Firefox before 120 (Chrome 109 on Windows 7/8,
    browsers on an older Chromium core) — plays the first source whatever the screen (review, round 2: a desktop played
    the 3:5 phone cut, cropped). Simulated by serving the page with media="all" on the video's sources, which every
    engine then counts as matching; the still's <picture> keeps its query. The film must still be this screen's cut and
    match its still: the desktop film at 1440, the phone cut at 390. A phone turned sideways (568×320, 640×360) gets
    the 16:10 desktop film in a 16:10 box, and it plays once it fills half the screen. */
 for(const [lang,page,width,height,cut] of [['','index.html',1440,900,''],['','index.html',390,844,'-phone'],['en/','capabilities.html',1440,900,''],['en/','capabilities.html',390,844,'-phone'],['','index.html',568,320,''],['en/','index.html',640,360,'']]) await check(`${lang}${page} ${width}×${height} demo video where <source media> is ignored: this screen's cut plays`,async()=>{
  const L=lang?'en':'zh';
  const ctx=await browser.newContext({viewport:{width,height}});const p=await ctx.newPage();p.setDefaultTimeout(15000);
  const url=BASE+'/'+lang+page;
  await p.route(url,async route=>{const r=await route.fetch();const body=(await r.text()).replace(/<video\b[^>]*\sdata-ow-demo[\s\S]*?<\/video>/,v=>v.replace(/\smedia="[^"]*"/g,' media="all"'));await route.fulfill({response:r,body});});
  try{
   await p.goto(url,{waitUntil:'load'});await p.waitForTimeout(1200);
   await toY(p,await filmCentre(p));await playing(p);
   /* currentTime reads data-start as soon as play() runs: wait for the first decoded frame */
   await p.waitForFunction(()=>{const v=document.querySelector('video[data-ow-demo]');return v.readyState>=2&&v.videoWidth>0;},null,{timeout:15000});
   const r=await p.evaluate(()=>{const v=document.querySelector('video[data-ow-demo]');const b=v.getBoundingClientRect();return {src:v.currentSrc,w:v.videoWidth,h:v.videoHeight,ratio:b.width/b.height,still:document.querySelector('.ow-demo-poster img').currentSrc};});
   assert.match(r.src,new RegExp(`ow-demo-${L}${cut}\\.(?:mp4|webm)\\?v=`),`this screen's cut plays (${r.src.split('/').pop()})`);
   assert.deepEqual([r.w,r.h],cut?[720,1200]:[1440,900],'the film\'s own size');
   assert.match(r.still,new RegExp(`ow-demo-${L}${cut}-poster\\.webp`),`the still is the same cut (${r.still.split('/').pop()})`);
   assert(Math.abs(r.ratio-(cut?0.6:1.6))<0.01,`a ${cut?'3:5':'16:10'} box (${r.ratio.toFixed(3)})`);
  }finally{await ctx.close();}
 });
 for(const lang of ['', 'en/']) await check(`${lang}index.html demo video with the data saver on: never starts by itself`,async()=>{
  const ctx=await browser.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.setDefaultTimeout(15000);
  await p.addInitScript(()=>{Object.defineProperty(navigator,'connection',{configurable:true,get:()=>({saveData:true,effectiveType:'4g'})});});
  const film=[];p.on('request',r=>{if(FILM.test(r.url()))film.push(r.url());});
  try{
   await p.goto(BASE+'/'+lang+'index.html',{waitUntil:'load'});await p.waitForTimeout(1000);
   await toY(p,await filmCentre(p));await p.waitForTimeout(2500);
   assert.equal(await paused(p),true,'on screen, still paused');assert.deepEqual(film,[],'no film fetched');
   await p.locator('[data-ow-demo-toggle]').click();await playing(p);
  }finally{await ctx.close();}
 });
}finally{await browser.close();}
writeFileSync(`${OUT}/interactions-results.json`,JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;

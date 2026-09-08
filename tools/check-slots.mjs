// Diagnostic: which template strings in copy.mjs fail to match their template?
import { readFileSync } from 'node:fs';
import * as C from './copy.mjs';
import { SITE } from './paths.mjs';
const idx = readFileSync(`${SITE}/tools/templates/index.en.html`, 'utf8');
const miss = [];
for (const [old] of C.HOME_MONO) { const n = idx.split(old).length - 1; if (n === 0) miss.push(['home', old]); }
if (!idx.includes(C.HOME_DUP_DESC.original)) miss.push(['home-dup', C.HOME_DUP_DESC.original]);
const hero = readFileSync(`${SITE}/tools/fragments/hero.html`, 'utf8');
for (const [old] of C.HOME_SC_HERO) if (!hero.includes(old)) miss.push(['sc-hero', old]);
const prod = readFileSync(`${SITE}/tools/fragments/products.html`, 'utf8');
for (const [old] of C.HOME_SC_PRODUCTS) if (!prod.includes(old)) miss.push(['sc-products', old]);
const integ = readFileSync(`${SITE}/tools/fragments/integration.html`, 'utf8');
for (const [old] of C.HOME_SC_INTEGRATION) if (!integ.includes(old)) miss.push(['sc-integration', old]);
const lx = readFileSync(`${SITE}/tools/fragments/lx-home.html`, 'utf8');
for (const old of ['<div class="lx-hero-text">Lifelogx</div>', '>Tomato Store<', 'Download on the Tomato Store', '>Market Play<', 'Get it on Market Play', 'The friend who never forgets.',
  'Natural, human-like chats that keep users engaged and understood.', '<h3 class="lx-expandable-text">Interaction</h3>', 'Smooth, intuitive actions that make every tap feel effortless.', '<h3 class="lx-expandable-text">Conversation</h3>',
  'Ready made features your users already expect.', '<h3 class="lx-expandable-text">Organised</h3>', '>CARDS<', '>transfers<', '>financing<', '<h3 class="lx-heading-style-h3 lx-home-feature">', '<div class="lx-text-size-regular lx-text-weight-light">',
  '<h3 class="lx-heading-style-h1 lx-_1">', '<h3 class="lx-heading-style-h1 lx-_4">', '>Is this you<', "I'll remember that for later", "It's too boring to document.", 'IT Support', 'Logistics Analyst', '<h3 class="lx-big-gradient-text lx-_1">', '<h3 class="lx-heading-style-h1 lx-pink">Add your Notes in minutes</h3>',
  '<h3 class="lx-heading-style-h1">As simple as talking</h3>', '>Get started<', '>Your story,<', '>Your memories,<', '>Your moments<', '>Your AI companion<', '<h4 class="lx-cta-text lx-_2nd">As simple as talking</h4>', '<div class="lx-cta-logo-text">Lifelogx</div>', 'The smartest friend you’ll ever have.', 'lx-gradient-section', '<div class="lx-cta-wrapper">']) {
  const n = lx.split(old).length - 1; if (n === 0) miss.push(['lx', old]); else if (['<h3 class="lx-heading-style-h3 lx-home-feature">', '<div class="lx-text-size-regular lx-text-weight-light">'].includes(old)) console.log('lx count', old, n);
}
for (const m of lx.matchAll(/I&#x27;ll remember[^<]*|I&#x27;d rather[^<]*|It&#x27;s too[^<]*/g)) console.log('lx apostrophe form:', m[0].slice(0, 40));
const pr = readFileSync(`${SITE}/tools/templates/scalora-pricing.html`, 'utf8');
for (const old of ['>Pricing plan<', '>Pay monthly<', '>Pay yearly (save 30%)<', '<h2>Compare all of our plans</h2>', '<div class="heading-style-h5">Features</div>', '>Questions and Answers<', '<h2>Frequently asked questions</h2>']) if (!pr.includes(old)) miss.push(['pricing', old]);
console.log(JSON.stringify(miss, null, 1));

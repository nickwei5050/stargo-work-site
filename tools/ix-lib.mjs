/**
 * Shared helpers for reading Webflow interaction payloads out of a page bundle.
 *
 * Every Mono page bundle and the Scalora bundle end with the same two calls:
 *   Webflow.require("ix2").init({events, actionLists, site})
 *   ... a.register([interactions], [timelines])
 * Both are pure data literals, so they are located by marker, brace-matched,
 * and evaluated into real objects. Nothing here edits minified code by regex.
 */
const BACKSLASH = String.fromCharCode(92);

export function matchBracket(src, open) {
  const pairs = { '{': '}', '[': ']', '(': ')' };
  if (!pairs[src[open]]) throw new Error(`not a bracket at ${open}: ${src[open]}`);
  let depth = 0;
  let inStr = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === BACKSLASH) { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{' || c === '[' || c === '(') depth++;
    else if (c === '}' || c === ']' || c === ')') {
      depth--;
      if (depth === 0) return { start: open, end: i + 1, text: src.slice(open, i + 1) };
    }
  }
  throw new Error(`unbalanced from ${open}`);
}

export function evalLiteral(text) {
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${text});`)();
}

export function findIx2(src) {
  const marker = 'Webflow.require("ix2").init(';
  const i = src.indexOf(marker);
  if (i === -1) throw new Error('no ix2 init');
  const arg = matchBracket(src, i + marker.length);
  return { argStart: i + marker.length, argEnd: arg.end, text: arg.text };
}

export function findIx3(src) {
  const marker = 'a.register(';
  const i = src.indexOf(marker);
  if (i === -1) return null;
  const args = matchBracket(src, i + marker.length - 1);
  const inner = args.text.slice(1, -1);
  const firstOpen = inner.indexOf('[');
  const first = matchBracket(inner, firstOpen);
  const rest = inner.slice(first.end);
  const secondOpen = rest.indexOf('[');
  const second = secondOpen === -1 ? null : matchBracket(rest, secondOpen);
  return { args, arrays: second ? [first.text, second.text] : [first.text] };
}

export function readBundle(src) {
  const ix2 = findIx2(src);
  const ix3 = findIx3(src);
  return {
    ix2,
    ix2Payload: evalLiteral(ix2.text),
    ix3,
    ix3Interactions: ix3 ? evalLiteral(ix3.arrays[0]) : [],
    ix3Timelines: ix3 && ix3.arrays[1] ? evalLiteral(ix3.arrays[1]) : [],
  };
}

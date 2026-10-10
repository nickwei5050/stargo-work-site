/**
 * Where this repository is, and where its few third-party modules come from.
 *
 * Every script here used to open with the author's own absolute path
 * (`const SITE = 'F:/stargo .../stargo-site'`) and to resolve @playwright/test
 * out of a sibling project's node_modules. That builds on exactly one machine.
 * The site is checked out by CI and by anyone else at a path nobody can know
 * in advance, so the root is derived from this file's own location instead.
 *
 * SITE is normalised to forward slashes with no trailing separator, because
 * the scripts compose paths as template strings (`${SITE}/tools/...`) and one
 * of them turns a path into a file: URL. On Windows that yields exactly the
 * string the scripts used to carry; on Linux it is the checkout directory.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

/** Repository root: the directory that contains tools/, css/, js/, en/. */
export const SITE = fileURLToPath(new URL('..', import.meta.url)).replace(/\\/g, '/').replace(/\/+$/, '');

/** tools/ itself — the directory this file lives in. */
export const TOOLS = `${SITE}/tools`;

/**
 * The build's non-builtin modules: @playwright/test and axe-core for the
 * verifiers, sharp for the image steps. Resolved from this repository's own
 * node_modules (`npm ci` at the root is all a runner needs).
 *
 * STARGO_TOOL_PACKAGE keeps the escape hatch tools/imagegen/prepare-assets.mjs
 * already had: point it at a package.json (or any file) inside another install
 * to borrow that install's modules instead — useful for sharp, which is a
 * heavy native dependency this repository deliberately does not install.
 */
const ownReq = createRequire(import.meta.url);
const toolReq = process.env.STARGO_TOOL_PACKAGE ? createRequire(process.env.STARGO_TOOL_PACKAGE) : null;
const missing = (e) => e && e.code === 'MODULE_NOT_FOUND';
/*
 * With STARGO_TOOL_PACKAGE set, a module is looked up in that install first and,
 * when it is not there, in this repository's node_modules — so exporting the
 * variable for the image steps does not break the verifiers (@playwright/test
 * lives here, sharp lives there).
 */
const pick = (fn) => (id, ...rest) => {
  if (toolReq) {
    try { return fn(toolReq, id, ...rest); } catch (e) { if (!missing(e)) throw e; }
  }
  return fn(ownReq, id, ...rest);
};
export const req = Object.assign(pick((r, id) => r(id)), {
  resolve: pick((r, id, opts) => r.resolve(id, opts)),
});

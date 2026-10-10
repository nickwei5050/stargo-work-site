/**
 * The static server the site is verified against.
 *
 *   node tools/serve.mjs                    # http://127.0.0.1:4200/, repo root
 *   PORT=4300 HOST=0.0.0.0 ROOT=dist node tools/serve.mjs
 *   node tools/serve.mjs --port 4300 --root dist
 *
 * This stands in for `python -m http.server 4200 --protocol HTTP/1.1`, which is
 * what the release process used and what a Linux runner cannot be assumed to
 * have at a known version. node: builtins only — a static file server is not
 * worth a dependency, and this repository ships no runtime JavaScript from npm.
 *
 * Deliberately dumb: no compression, no caching, no directory listing. It does
 * serve byte ranges, because a <video> element asks for them, and it maps the
 * extensions this site actually contains, because a font or a video served as
 * application/octet-stream is a failure the verifiers would report as ours.
 * When the root has a Cloudflare Pages `_redirects` file (dist/, written by
 * tools/make-dist.mjs), its plain `from to status` lines are answered the way
 * Pages answers them, so tools/verify-release.mjs can check the redirects
 * against a local dist/ too (review, round 3); splats and placeholders are
 * not supported, and a line with one stops the server.
 */
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, resolve as resolvePath, isAbsolute, sep } from 'node:path';
import { SITE } from './paths.mjs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const PORT = Number(arg('port', process.env.PORT || 4200));
const HOST = arg('host', process.env.HOST || '127.0.0.1');
/* Native separators, no trailing one: everything below compares against it, and
   SITE is written with forward slashes while path.join() uses the platform's. */
const ROOT = (() => {
  const r = arg('root', process.env.ROOT || SITE);
  return resolvePath(isAbsolute(r) ? r : join(SITE, r));
})();

/** Exact-path redirects from ROOT/_redirects: path → [target, status]. */
const REDIRECTS = new Map();
if (existsSync(join(ROOT, '_redirects'))) {
  for (const line of readFileSync(join(ROOT, '_redirects'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to, status = '302'] = t.split(/\s+/);
    if (!to || /[*:]/.test(from) || !/^30[1278]$/.test(status)) throw new Error(`serve: unsupported _redirects line: ${t}`);
    REDIRECTS.set(from, [to, Number(status)]);
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

/** Map a request path onto a file inside ROOT, or null if it escapes or is missing. */
function resolve(urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0].split('#')[0]); } catch { return null; }
  /* normalize() collapses ".." before the prefix test, so "/../etc/passwd" and
     its encoded forms cannot reach outside ROOT. */
  const full = normalize(join(ROOT, rel));
  if (full !== ROOT && !full.startsWith(ROOT + sep) && !full.startsWith(ROOT + '/')) return null;
  if (existsSync(full)) {
    const st = statSync(full);
    if (st.isFile()) return { full, size: st.size };
    if (st.isDirectory() && existsSync(join(full, 'index.html'))) {
      return { full: join(full, 'index.html'), size: statSync(join(full, 'index.html')).size };
    }
    return null;
  }
  /* Clean URLs, the way Cloudflare Pages serves this site: /pricing -> pricing.html. */
  if (!extname(full) && existsSync(`${full}.html`)) return { full: `${full}.html`, size: statSync(`${full}.html`).size };
  return null;
}

const server = createServer((reqst, res) => {
  const method = reqst.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' });
    return res.end('method not allowed\n');
  }
  const { pathname, search } = new URL(reqst.url, `http://${HOST}:${PORT}`);
  const redirect = REDIRECTS.get(pathname);
  if (redirect) {
    res.writeHead(redirect[1], { location: redirect[0] + search, 'cache-control': 'no-store' });
    return res.end();
  }
  const hit = resolve(pathname);
  if (!hit) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    return res.end('404 not found\n');
  }

  const headers = {
    'content-type': TYPES[extname(hit.full).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',              // a verifier must never read a stale build
    'x-content-type-options': 'nosniff',
    'accept-ranges': 'bytes',
  };

  /* Byte ranges: a single "bytes=a-b". Anything else is answered in full, which
     is what a range-less server does and what every client tolerates. */
  const range = /^bytes=(\d*)-(\d*)$/.exec(reqst.headers.range || '');
  if (range && hit.size > 0) {
    const [, a, b] = range;
    let start = a === '' ? hit.size - Number(b) : Number(a);
    let end = a === '' ? hit.size - 1 : (b === '' ? hit.size - 1 : Number(b));
    if (Number.isFinite(start) && Number.isFinite(end) && start >= 0 && start <= end && end < hit.size) {
      headers['content-range'] = `bytes ${start}-${end}/${hit.size}`;
      headers['content-length'] = String(end - start + 1);
      res.writeHead(206, headers);
      if (method === 'HEAD') return res.end();
      return send(createReadStream(hit.full, { start, end }), res);
    }
    res.writeHead(416, { ...headers, 'content-range': `bytes */${hit.size}` });
    return res.end();
  }

  headers['content-length'] = String(hit.size);
  res.writeHead(200, headers);
  if (method === 'HEAD') return res.end();
  send(createReadStream(hit.full), res);
});

/**
 * Pipe a file to the response, and survive the client hanging up.
 *
 * A browser abandons requests all the time — a <video> that has buffered
 * enough, a page navigated away from mid-download, a range request the media
 * element no longer wants. When it does, the read stream and the response both
 * emit `error` (ECONNRESET / EPIPE). An unhandled `error` on a stream is an
 * uncaught exception, and node exits the process.
 *
 * That is not theoretical: it is what kept killing this server part-way
 * through tools/verify-restore.mjs. The run would stop at 14, 30 or 87 of ~300
 * checks with no failure reported and no stack printed, which reads exactly
 * like a finished run that happened to be short — the most expensive kind of
 * wrong, because the missing checks look like passing ones. The verifier now
 * re-probes the server after it finishes for the same reason.
 *
 * A client that has gone away is not an error this server can do anything
 * about, so it is swallowed and the stream destroyed; anything else is logged
 * and the response ended, but the process stays up either way. A test server
 * that dies under its own test suite is worse than a slow one.
 */
function send(stream, res) {
  const stop = (e) => {
    stream.destroy();
    if (e && !/ECONNRESET|EPIPE|ERR_STREAM_PREMATURE_CLOSE/.test(e.code || e.message || '')) {
      console.error(`serve: ${e.message}`);
    }
    if (!res.writableEnded) res.end();
  };
  stream.on('error', stop);
  res.on('error', stop);
  res.on('close', () => stream.destroy());
  return stream.pipe(res);
}

server.on('error', (e) => { console.error(`serve: ${e.message}`); process.exit(1); });
/* Last resort. Nothing above should throw asynchronously any more, but this
   server exists to be hammered by a browser for twenty minutes at a time, and
   staying up on an unexpected socket error is always the right call for it. */
process.on('uncaughtException', (e) => {
  if (/ECONNRESET|EPIPE|ERR_STREAM_PREMATURE_CLOSE/.test(e.code || e.message || '')) return;
  console.error(`serve: uncaught ${e.stack || e.message}`);
});
server.listen(PORT, HOST, () => console.log(`serving ${ROOT} at http://${HOST}:${PORT}/`));

/* CI stops this with SIGTERM/SIGINT; exit without a stack trace. */
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)));

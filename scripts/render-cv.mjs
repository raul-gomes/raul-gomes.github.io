/**
 * Prints the built CV pages (dist/cv, dist/en/cv) to PDF, one per locale.
 * Runs after `astro build`, so every deploy ships a CV generated from the
 * current content. Chrome comes from PW_EXECUTABLE or Playwright's own install.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { CV_TARGETS } from './cv-targets.mjs';

const DIST = resolve('dist');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

/** Serves dist/ read-only on a random local port, so the pages load exactly as deployed. */
function serveDist() {
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let file = resolve(join(DIST, pathname));
    if (file !== DIST && !file.startsWith(DIST + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'content-type': MIME_TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      response.writeHead(404).end();
    }
  });
  return new Promise((resolveServer) => server.listen(0, '127.0.0.1', () => resolveServer(server)));
}

const server = await serveDist();
const { port } = server.address();
const browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined });
try {
  const page = await browser.newPage();
  for (const target of CV_TARGETS) {
    const url = `http://127.0.0.1:${port}/${target.page.replace(/index\.html$/, '')}`;
    const response = await page.goto(url, { waitUntil: 'load' });
    if (!response?.ok()) throw new Error(`CV page ${url} answered ${response?.status()}`);
    await page.pdf({ path: join(DIST, target.pdf), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log(`CV (${target.locale}) written to dist/${target.pdf}`);
  }
} finally {
  await browser.close();
  server.close();
}

import { readdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://localhost:4321';
// Every project has one file per locale; the site lists all of them.
const PROJECT_COUNT = readdirSync('src/content/projects').filter((file) => file.endsWith('.pt.md')).length;

const browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok, extra });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`);
};

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
check('reader: default mode', (await page.getAttribute('html', 'data-mode')) === 'reader');
check('reader: hero name', (await page.locator('.hero__name').innerText()).includes('RAUL'));
check('reader: projects present', (await page.locator('.win').count()) === PROJECT_COUNT);
check('reader: nav anchors', (await page.locator('.bar__nav a').count()) === 6);
check('reader: desktop hidden', !(await page.locator('.desk').isVisible()));
check('reader: cv link', (await page.locator('a.cta').getAttribute('href')) === '/cv/Raul_SGomes_CV-pt.pdf');

await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
check('en: locale attr', (await page.getAttribute('html', 'data-locale')) === 'en');
check('en: cv link', (await page.locator('a.cta').getAttribute('href')) === '/cv/Raul_SGomes_CV-en.pdf');
check('en: hero role', (await page.locator('.hero__role').innerText()).toLowerCase().includes('software engineer'));
check('en: project tagline', (await page.locator('.project__tagline').first().innerText()).includes('financial BPO'));

await page.goto(`${BASE}/?mode=desktop`, { waitUntil: 'networkidle' });
check('desktop: mode attr', (await page.getAttribute('html', 'data-mode')) === 'desktop');
check('desktop: reader hidden', !(await page.locator('.reader').isVisible()));
check('desktop: power screen visible', await page.locator('[data-power-on]').isVisible());

await page.locator('[data-power-on]').click();
await page.waitForSelector('[data-desk]:not([hidden])', { timeout: 5000 });
check('desktop: boots to desk', await page.locator('.taskbar').isVisible());
check('desktop: desktop icons rendered', (await page.locator('.desk-icon').count()) === 8);
check('desktop: themed folder icons', (await page.locator('.desk-icon[data-node="projetos"]').count()) === 1);

const firstIcon = page.locator('.desk-icon[data-node="sobre"]');
const ib = await firstIcon.boundingBox();
const beforeLeft = await firstIcon.evaluate((el) => el.style.left);
await page.mouse.move(ib.x + ib.width / 2, ib.y + ib.height / 2);
await page.mouse.down();
await page.mouse.move(ib.x + ib.width / 2 + 420, ib.y + ib.height / 2 + 260, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(60);
const afterLeft = await firstIcon.evaluate((el) => el.style.left);
check('desktop: icon drags freely', afterLeft !== beforeLeft);

await page.locator('.desk-icon[data-node="projetos"]').dblclick();
await page.waitForSelector('.app-window[data-win-id="folder-projetos"]', { timeout: 3000 });
check('desktop: projects folder opens', (await page.locator('.app-window[data-win-id="folder-projetos"] .fm li').count()) === PROJECT_COUNT);

// Projects with a gallery open as a folder holding info.txt and the screenshots.
await page.locator('.app-window[data-win-id="folder-projetos"] .fm li').first().dblclick();
await page.waitForSelector('.app-window[data-win-id="folder-cafe-com-bpo"]', { timeout: 3000 });
const projectFolder = page.locator('.app-window[data-win-id="folder-cafe-com-bpo"]');
check('desktop: project folder has screenshots', (await projectFolder.locator('.fm li').count()) >= 2);

await projectFolder.locator('.fm li[data-node="cafe-com-bpo-info"]').dblclick();
await page.waitForSelector('.app-window[data-win-id="doc-cafe-com-bpo-info"]', { timeout: 3000 });
check('desktop: project detail opens', await page.locator('.app-window[data-win-id="doc-cafe-com-bpo-info"]').isVisible());
check('desktop: three windows open', (await page.locator('.app-window').count()) === 3);

await page.locator('.app-window[data-win-id="doc-cafe-com-bpo-info"] [data-act="close"]').click();
check('desktop: window closes', (await page.locator('.app-window[data-win-id="doc-cafe-com-bpo-info"]').count()) === 0);

await page.locator('.desk-icon[data-node="terminal"]').dblclick();
await page.waitForSelector('.app-window[data-win-id="terminal"]', { timeout: 3000 });
const termInput = page.locator('.app-window[data-win-id="terminal"] [data-term-input]');
await termInput.fill('whoami');
await termInput.press('Enter');
await page.waitForTimeout(120);
check(
  'terminal: whoami output',
  (await page.locator('.app-window[data-win-id="terminal"] .term__out').innerText()).includes('Software Engineer') ||
    (await page.locator('.app-window[data-win-id="terminal"] .term__out').innerText()).includes('Engenheiro'),
);

await termInput.fill('open skills');
await termInput.press('Enter');
await page.waitForTimeout(150);
check('terminal: open skills works', (await page.locator('.app-window[data-win-id="app-skills"]').count()) === 1);

await termInput.fill('bogus');
await termInput.press('Enter');
await page.waitForTimeout(120);
check('terminal: unknown command', (await page.locator('.app-window[data-win-id="terminal"] .term__out').innerText()).includes('bogus'));

const win = page.locator('.app-window[data-win-id="app-skills"]');
const before = await win.boundingBox();
const bar = win.locator('.app-window__bar');
const bb = await bar.boundingBox();
await page.mouse.move(bb.x + 40, bb.y + 8);
await page.mouse.down();
// Drag up-left: the skills window is large and a downward drag hits the viewport limit.
await page.mouse.move(bb.x - 60, bb.y + 8, { steps: 8 });
await page.mouse.up();
const after = await win.boundingBox();
check('desktop: window drags', Math.abs(after.x - before.x) > 30);

await page.locator('.taskbar [data-mode-toggle]').click();
await page.waitForLoadState('networkidle');
check('toggle: back to reader', (await page.getAttribute('html', 'data-mode')) === 'reader');
check('toggle: reader visible', await page.locator('.hero__name').isVisible());

const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1000, height: 700 } });
const rmPage = await rm.newPage();
await rmPage.goto(`${BASE}/?mode=desktop`, { waitUntil: 'networkidle' });
await rmPage.locator('[data-power-on]').click();
await rmPage.waitForSelector('[data-desk]:not([hidden])', { timeout: 5000 });
check('reduced-motion: desktop still boots', await rmPage.locator('.taskbar').isVisible());
await rm.close();

check('no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
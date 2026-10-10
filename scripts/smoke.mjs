import { chromium } from 'playwright-core';

const EXEC =
  process.env.PW_EXECUTABLE ||
  '/home/raulgomes/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://localhost:4321';

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
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
check('reader: projects present', (await page.locator('.win').count()) === 4);
check('reader: nav anchors', (await page.locator('.bar__nav a').count()) === 6);
check('reader: desktop hidden', !(await page.locator('.desk').isVisible()));
check('reader: cv link', (await page.locator('a.cta').getAttribute('href')) === '/cv/Raul_SGomes_CV.pdf');

await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
check('en: locale attr', (await page.getAttribute('html', 'data-locale')) === 'en');
check('en: hero role', (await page.locator('.hero__role').innerText()).toLowerCase().includes('software engineer'));
check('en: project tagline', (await page.locator('.project__tagline').first().innerText()).includes('Financial BPO'));

await page.goto(`${BASE}/?mode=desktop`, { waitUntil: 'networkidle' });
check('desktop: mode attr', (await page.getAttribute('html', 'data-mode')) === 'desktop');
check('desktop: reader hidden', !(await page.locator('.reader').isVisible()));
check('desktop: power screen visible', await page.locator('[data-power-on]').isVisible());

await page.locator('[data-power-on]').click();
await page.waitForSelector('[data-desk]:not([hidden])', { timeout: 5000 });
check('desktop: boots to desk', await page.locator('.taskbar').isVisible());
check('desktop: launchers rendered', (await page.locator('.taskbar__app').count()) === 6);

await page.locator('.taskbar__app[data-app="projects"]').click();
await page.waitForSelector('.app-window[data-win-id="projects"]', { timeout: 3000 });
check('desktop: projects window opens', (await page.locator('.fm li').count()) === 4);

await page.locator('.fm li').first().click();
await page.waitForSelector('.app-window[data-win-id="project-cafe-com-bpo"]', { timeout: 3000 });
check('desktop: project detail opens', await page.locator('.app-window[data-win-id="project-cafe-com-bpo"]').isVisible());
check('desktop: two windows open', (await page.locator('.app-window').count()) === 2);

await page.locator('.app-window[data-win-id="project-cafe-com-bpo"] [data-act="close"]').click();
check('desktop: window closes', (await page.locator('.app-window[data-win-id="project-cafe-com-bpo"]').count()) === 0);

await page.locator('.taskbar__app[data-app="terminal"]').click();
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

await termInput.fill('open stack');
await termInput.press('Enter');
await page.waitForTimeout(150);
check('terminal: open stack works', (await page.locator('.app-window[data-win-id="stack"]').count()) === 1);

await termInput.fill('bogus');
await termInput.press('Enter');
await page.waitForTimeout(120);
check('terminal: unknown command', (await page.locator('.app-window[data-win-id="terminal"] .term__out').innerText()).includes('bogus'));

const win = page.locator('.app-window[data-win-id="stack"]');
const before = await win.boundingBox();
const bar = win.locator('.app-window__bar');
const bb = await bar.boundingBox();
await page.mouse.move(bb.x + 40, bb.y + 8);
await page.mouse.down();
await page.mouse.move(bb.x + 140, bb.y + 88, { steps: 8 });
await page.mouse.up();
const after = await win.boundingBox();
check('desktop: window drags', Math.abs(after.x - before.x) > 30 && Math.abs(after.y - before.y) > 30);

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
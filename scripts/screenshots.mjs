import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const EXEC = process.env.PW_EXECUTABLE || '/home/raulgomes/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.OUT || '/tmp/opencode/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });

// Reader full page
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/reader.png`, fullPage: true });

// EN reader top
await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/reader-en-top.png` });
await page.close();

// Desktop with windows + terminal
const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await desk.goto(`${BASE}/?mode=desktop`, { waitUntil: 'networkidle' });
await desk.locator('[data-power-on]').click();
await desk.waitForSelector('[data-desk]:not([hidden])', { timeout: 5000 });
await desk.waitForTimeout(600);
await desk.screenshot({ path: `${OUT}/desktop-booted.png` });

await desk.locator('.taskbar__app[data-app="projects"]').click();
await desk.waitForSelector('.app-window[data-win-id="projects"]', { timeout: 3000 });
await desk.waitForTimeout(250);
await desk.locator('.fm li').nth(1).click();
await desk.waitForSelector('.app-window[data-win-id="project-placo"]', { timeout: 3000 });
await desk.locator('.taskbar__app[data-app="terminal"]').click();
await desk.waitForSelector('.app-window[data-win-id="terminal"]', { timeout: 3000 });
const input = desk.locator('.app-window[data-win-id="terminal"] [data-term-input]');
await input.fill('whoami');
await input.press('Enter');
await input.fill('ls');
await input.press('Enter');
await desk.waitForTimeout(300);
await desk.screenshot({ path: `${OUT}/desktop-windows.png` });
await desk.close();

console.log(`screenshots written to ${OUT}`);
await browser.close();
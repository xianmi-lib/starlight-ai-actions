import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4341';
const browser = await chromium.launch();
const page = await browser.newPage();
const events = [];
await page.exposeFunction('__aiEvt', (d) => events.push(d));
await page.addInitScript(() => window.addEventListener('ai-actions', (e) => window.__aiEvt(e.detail)));
await page.goto(`${base}/a/`);
// 1) 菜单四键存在
for (const t of ['view', 'copyContent', 'copyUrl', 'copyPrompt']) {
  if (!(await page.locator(`[data-ai-action="${t}"]`).count())) throw new Error(`missing ${t}`);
}
// 2) 复制 prompt 项：真实点击（Playwright 点击=trusted），读剪贴板
await page.locator('details.pa-md summary').click();
await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
await page.locator('[data-ai-action="copyPrompt"]').click();
const clip = await page.evaluate(() => navigator.clipboard.readText());
if (!clip.includes('/md/') || !clip.includes('请先阅读全文')) throw new Error('prompt clipboard wrong: ' + clip.slice(0, 80));
// 3) dialog 开合
await page.locator('[aria-haspopup="dialog"]').click();
if (!(await page.locator('dialog[open]').count())) throw new Error('dialog not open');
await page.keyboard.press('Escape');
if (await page.locator('dialog[open]').count()) throw new Error('dialog not closed');
// 4) 事件断言
const acts = events.map((e) => `${e.type}/${e.action}`).join(',');
if (!acts.includes('markdown/copyPrompt') || !acts.includes('paste/open')) throw new Error('events wrong: ' + acts);
console.log('SMOKE OK', acts);
await browser.close();

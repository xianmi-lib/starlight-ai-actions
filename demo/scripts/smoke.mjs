import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4341/starlight-ai-actions';
const browser = await chromium.launch();
const page = await browser.newPage();
const events = [];
await page.exposeFunction('__aiEvt', (d) => events.push(d));
await page.addInitScript(() => window.addEventListener('ai-actions', (e) => window.__aiEvt(e.detail)));
await page.goto(`${base}/a/`);
// 0) Markdown 菜单图标（v5 sprite）：summary 含 #ic-markdown
const summaryHtml = await page.locator('details.pa-md summary').innerHTML();
if (!summaryHtml.includes('#ic-markdown')) throw new Error('missing #ic-markdown icon: ' + summaryHtml.slice(0, 120));
// 1) 菜单四键存在
for (const t of ['view', 'copyContent', 'copyUrl', 'copyPrompt']) {
  if (!(await page.locator(`[data-ai-action="${t}"]`).count())) throw new Error(`missing ${t}`);
}
await page.locator('details.pa-md summary').click();
await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
const readClip = () => page.evaluate(() => navigator.clipboard.readText());
const waitForClip = async (marker) => {
  const t0 = Date.now();
  while (Date.now() - t0 < 4000) {
    const txt = await readClip();
    if (txt.includes(marker)) return txt;
    await page.waitForTimeout(100);
  }
  throw new Error('clipboard missing marker: ' + marker + ' — got: ' + (await readClip()).slice(0, 80));
};
// 2) 复制 Markdown 内容：真实点击（Playwright 点击=trusted），剪贴板=public/md/a.md 真源正文
await page.locator('[data-ai-action="copyContent"]').click();
await waitForClip('Article A body');
// 3) 复制 prompt 项：剪贴板含 md URL + en 缺省 prompt（/a/ 是 root=en 页）
await page.locator('[data-ai-action="copyPrompt"]').click();
const clip = await waitForClip('/md/');
if (clip.includes('请先阅读全文')) throw new Error('prompt should be en on root locale, got: ' + clip.slice(0, 80));
if (!clip.includes('Please read it first')) throw new Error('prompt clipboard wrong: ' + clip.slice(0, 80));
// 4) dialog 开合
await page.locator('[aria-haspopup="dialog"]').click();
if (!(await page.locator('dialog[open]').count())) throw new Error('dialog not open');
await page.keyboard.press('Escape');
if (await page.locator('dialog[open]').count()) throw new Error('dialog not closed');
// 5) 事件断言
const acts = events.map((e) => `${e.type}/${e.action}`).join(',');
if (!acts.includes('markdown/copyContent') || !acts.includes('markdown/copyPrompt') || !acts.includes('paste/open')) throw new Error('events wrong: ' + acts);
console.log('SMOKE OK', acts);
await browser.close();

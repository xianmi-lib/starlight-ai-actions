import { chromium } from 'playwright';
const base = process.env.BASE ?? 'http://127.0.0.1:4341';
const paths = (process.env.PATHS ?? '/starlight-ai-actions/a/,/starlight-ai-actions/').split(',');
const widths = [320, 390, 640, 768, 1400];
const browser = await chromium.launch();
let bad = 0;
for (const p of paths) for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 844 } });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) { bad++; console.log('OVERFLOW', p, w); }
  await page.close();
}
await browser.close();
console.log(bad ? `FAIL ${bad}` : 'ZERO OVERFLOW');
process.exit(bad ? 1 : 0);

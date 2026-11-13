// 広告画像（PNG）を書き出すスクリプト。
// 使い方： node ads/src/render.js   （リポジトリの一番上のフォルダで実行。Playwright が必要）
const { chromium } = require('playwright');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VARIANTS = { a: 'a-anxiety', b: 'b-knowledge', c: 'c-expert' };
// Meta公式の推奨解像度（1:1 は同じ幅にそろえた 1440×1440）
const SIZES = { sq: [1440, 1440, '1x1_1440x1440'], p: [1440, 1800, '4x5_1440x1800'], st: [1440, 2560, '9x16_1440x2560'] };

(async () => {
  const proxy = process.env.HTTPS_PROXY;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const shoot = async (v, s, w, h, out) => {
    const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
    await page.goto('file://' + path.join(__dirname, 'ad.html') + `?v=${v}&s=${s}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: out, type: 'png' });
    await page.close();
    console.log('written', path.relative(ROOT, out));
  };
  for (const [v, dir] of Object.entries(VARIANTS)) {
    for (const [s, [w, h, name]] of Object.entries(SIZES)) {
      await shoot(v, s, w, h, path.join(ROOT, dir, `fukumana_${v}_${name}.png`));
    }
  }
  await shoot('a', 'ogp', 1200, 630, path.join(ROOT, '..', 'lp', 'assets', 'img', 'ogp.png'));
  await browser.close();
})();

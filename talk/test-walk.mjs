// test-walk.mjs: every one-step move gives the same pixels as a jump.
//
//   THEME=light|dark NODE_PATH=$(npm root -g) node test-walk.mjs my-talk.html
//
// For every slide s and state k (Playwright WebKit, 1920 x 1080):
//   Right from k-1 (after the tween)      == jump to k
//   Left from k+1                         == jump to k
//   Right at the last state               == jump to the next slide's state 0
// A failure means a picture's state(k) is not pure, or its tween does not end at state(k).
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { webkit } = require("playwright");
const FILE = path.resolve(process.argv[2] || (console.error("usage: node test-walk.mjs <talk.html>"), process.exit(2)));
const THEME = process.env.THEME || "light";

const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const cmp = await browser.newPage({ viewport: { width: 200, height: 200 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(pathToFileURL(FILE).href + `?theme=${THEME}#/1/0`);
await page.waitForFunction(() => window.Deck && window.Deck.ready);
await page.evaluate(() => document.fonts.ready);

const frames = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function shot() { await page.mouse.move(4, 540); await frames(); await page.waitForTimeout(60); return page.screenshot(); }
async function diff(a, b) {
  if (a.equals(b)) return 0;
  return cmp.evaluate(async ([a, b]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
    const [A, B] = await Promise.all([load(a), load(b)]);
    const get = (img) => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const da = get(A), db = get(B);
    let n = 0;
    for (let i = 0; i < da.length; i += 4) if (da[i] !== db[i] || da[i + 1] !== db[i + 1] || da[i + 2] !== db[i + 2]) n++;
    return n;
  }, [a.toString("base64"), b.toString("base64")]);
}
const go = async (s, k) => { await page.evaluate(([s, k]) => Deck.goto(s, k, { instant: true }), [s, k]); await frames(); };
const where = () => page.evaluate(() => Deck.where());

const count = await page.evaluate(() => Deck.count());
let compared = 0;
const fails = [];
for (let s = 1; s <= count.slides; s++) {
  const K = count.states[s - 1] - 1;
  for (let k = 0; k <= K; k++) {
    await go(s, k);
    const jump = await shot();
    if (k >= 1) {
      await go(s, k - 1);
      const ms = await page.evaluate(([s, k]) => Deck.tweenMs(s, k), [s, k]);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(ms + 400);
      const w = await where(), n = await diff(await shot(), jump);
      compared++;
      if (w.slide !== s || w.state !== k || n) fails.push(`Right ${s}/${k - 1} -> ${w.slide}/${w.state}: ${n} px differ from a jump to ${s}/${k}`);
    }
    if (k < K) {
      await go(s, k + 1);
      await page.keyboard.press("ArrowLeft");
      const w = await where(), n = await diff(await shot(), jump);
      compared++;
      if (w.slide !== s || w.state !== k || n) fails.push(`Left ${s}/${k + 1} -> ${w.slide}/${w.state}: ${n} px differ from a jump to ${s}/${k}`);
    }
  }
  if (s < count.slides) {
    await go(s + 1, 0);
    const jump = await shot();
    await go(s, K);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    const w = await where(), n = await diff(await shot(), jump);
    compared++;
    if (w.slide !== s + 1 || w.state !== 0 || n) fails.push(`Right at ${s}/${K} -> ${w.slide}/${w.state}: ${n} px differ from a jump to ${s + 1}/0`);
  }
}
await browser.close();
errors.forEach((e) => fails.push("page error: " + e));
fails.forEach((f) => console.log("FAIL  " + f));
console.log(`${THEME}: ${compared} moves compared with jumps, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);

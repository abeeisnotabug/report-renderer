// test-live.mjs: the live controls and the deck keys, for any talk.
//
//   THEME=light|dark NODE_PATH=$(npm root -g) node test-live.mjs my-talk.html
//
// For every slide with data-live, at its last state (Playwright WebKit, 1920 x 1080):
//   each control moved to one end changes the picture; moved back to its fixed value, the
//   picture equals a fresh jump pixel for pixel and the readouts equal their fixed text;
//   moved to the other end, the reset button restores the fixed picture;
//   a click on a slider's track moves the value; with a slider focused, Right moves the deck;
//   after a move, Left gives the previous state as a fresh jump, Right the fixed picture.
// Then the keys: Shift+Right/Left, digits + Enter, digits + Escape, D (twice).
// This checks the mechanics only. Whether the numbers are right is the talk's own test: compute
// them independently and compare with Deck.liveCompute(name, values) and Deck.liveInfo().
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { webkit } = require("playwright");
const FILE = path.resolve(process.argv[2] || (console.error("usage: node test-live.mjs <talk.html>"), process.exit(2)));
const THEME = process.env.THEME || "light";

let fails = 0, oks = 0;
const ok = (cond, what) => { if (cond) oks++; else { fails++; console.log("FAIL  " + what); } };

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
const info = () => page.evaluate(() => Deck.liveInfo());
const setv = async (id, x) => { await page.evaluate(([id, x]) => Deck.liveSet(id, x), [id, x]); await frames(); };

const count = await page.evaluate(() => Deck.count());
const live = await page.evaluate(() => Array.from(document.querySelectorAll("#stage > section.slide"))
  .map((el, i) => ({ s: i + 1, name: el.dataset.live })).filter((x) => x.name));
console.log(`${live.length} slides with live controls`);

for (const { s, name } of live) {
  const K = count.states[s - 1] - 1;
  await go(s, K);
  const i0 = await info();
  ok(i0.active && i0.name === name && !i0.moved, `slide ${s}: live "${name}" active and unmoved at its last state`);
  if (!i0.active) continue;
  const fixedShot = await shot();
  const limits = await page.evaluate((n) => Deck.liveLimits(n), name);
  for (const id of Object.keys(limits)) {
    const [lo, hi] = limits[id], fx = i0.fixed[id];
    const end1 = fx === lo ? hi : lo, end2 = fx === hi ? lo : hi;
    await setv(id, end1);
    ok((await info()).moved, `slide ${s} ${id}: moved at ${end1}`);
    ok((await diff(await shot(), fixedShot)) > 0, `slide ${s} ${id}: moving to ${end1} changes the picture`);
    await setv(id, fx);
    const back = await info();
    ok(!back.moved, `slide ${s} ${id}: unmoved again at the fixed value`);
    ok(JSON.stringify(back.readouts) === JSON.stringify(i0.readouts), `slide ${s} ${id}: readouts at the fixed value as before`);
    ok((await diff(await shot(), fixedShot)) === 0, `slide ${s} ${id}: back at the fixed value, the picture equals a fresh jump`);
    await setv(id, end2);
    await page.click(`#stage > section.slide.current .lv-reset`);
    await frames();
    ok(!(await info()).moved && (await diff(await shot(), fixedShot)) === 0, `slide ${s} ${id}: reset restores the fixed picture`);
  }
  // a click on the first slider's track
  const slider = await page.$("#stage > section.slide.current .live-panel input[type=range]");
  if (slider) {
    const b = await slider.boundingBox();
    const before = JSON.stringify((await info()).values);
    await page.mouse.click(b.x + b.width * 0.13, b.y + b.height / 2);
    await frames();
    ok(JSON.stringify((await info()).values) !== before, `slide ${s}: a click on the slider's track moves the value`);
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await frames();
    const w = await where();
    ok(w.slide !== s || w.state !== K || s === count.slides, `slide ${s}: with the slider focused, Right moves the deck`);
    await go(s, K);
  }
  // after a move: Left, then Right
  if (K >= 1) {
    await go(s, K - 1);
    const prevShot = await shot();
    await go(s, K);
    const id = Object.keys(limits)[0];
    await setv(id, limits[id][0] === i0.fixed[id] ? limits[id][1] : limits[id][0]);
    await page.keyboard.press("ArrowLeft");
    ok((await diff(await shot(), prevShot)) === 0, `slide ${s}: Left after a move shows state ${K - 1} as a fresh jump`);
    const ms = await page.evaluate(([s, k]) => Deck.tweenMs(s, k), [s, K]);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(ms + 400);
    ok(!(await info()).moved && (await diff(await shot(), fixedShot)) === 0, `slide ${s}: Right back shows the fixed picture`);
  }
}

// keys
await go(1, 0);
await page.keyboard.press("Shift+ArrowRight");
let w = await where();
ok(count.slides < 2 || (w.slide === 2 && w.state === 0), `Shift+Right from 1/0 gives 2/0 (got ${w.slide}/${w.state})`);
await page.keyboard.press("Shift+ArrowLeft");
w = await where();
ok(w.slide === 1 && w.state === 0, `Shift+Left gives 1/0 (got ${w.slide}/${w.state})`);
const last = String(count.slides);
for (const c of last) await page.keyboard.press(c);
await page.keyboard.press("Enter");
w = await where();
ok(w.slide === count.slides && w.state === 0, `digits ${last} + Enter jump to slide ${last} (got ${w.slide}/${w.state})`);
await page.keyboard.press("1");
await page.keyboard.press("Escape");
w = await where();
ok(w.slide === count.slides, `digit + Escape stays (got ${w.slide}/${w.state})`);
const t0 = await page.evaluate(() => document.documentElement.dataset.theme);
await page.keyboard.press("d");
const t1 = await page.evaluate(() => document.documentElement.dataset.theme);
await page.keyboard.press("d");
const t2 = await page.evaluate(() => document.documentElement.dataset.theme);
ok(t1 !== t0 && t2 === t0, `D toggles the theme and back (${t0} -> ${t1} -> ${t2})`);

await browser.close();
errors.forEach((e) => ok(false, "page error: " + e));
console.log(`${THEME}: ${oks} checks passed, ${fails} failed`);
process.exit(fails ? 1 : 0);

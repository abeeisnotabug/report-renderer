// shoot.mjs: a screenshot of every slide and state, plus a report of content that leaves the
// content area or overflows its box, and of page errors and network requests.
//
//   THEME=light|dark NODE_PATH=$(npm root -g) node shoot.mjs my-talk.html [first [last]]
//
// Pictures go to my-talk-shots-<theme>/ next to the HTML file (delete the folder when done),
// with report.txt. Also shoots the presenter view at the first, middle and last slide, and the
// overview. Playwright's WebKit, the engine behind Safari. Exit code 1 on any finding.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { webkit } = require("playwright");
const FILE = path.resolve(process.argv[2] || (console.error("usage: node shoot.mjs <talk.html> [first [last]]"), process.exit(2)));
const THEME = process.env.THEME || "light";
if (!["light", "dark"].includes(THEME)) { console.error("THEME must be light or dark"); process.exit(2); }
const SHOTS = FILE.replace(/\.html$/, "") + `-shots-${THEME}`;
const URL0 = pathToFileURL(FILE).href + `?theme=${THEME}`;
fs.mkdirSync(SHOTS, { recursive: true });
const pad = (n) => String(n).padStart(2, "0");
const from = +(process.argv[3] || 1), to = +(process.argv[4] || 999);

const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("request", (r) => { if (!/^(file|data|about|blob):/.test(r.url())) errors.push("network request: " + r.url()); });

await page.goto(URL0 + "#/1/0");
await page.waitForFunction(() => window.Deck && window.Deck.ready);
await page.evaluate(() => document.fonts.ready);
const count = await page.evaluate(() => Deck.count());
const shown = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
if (shown !== THEME) errors.push(`theme: the page shows ${shown}, expected ${THEME}`);

const findings = [];
for (let s = Math.max(1, from); s <= Math.min(count.slides, to); s++) {
  for (let k = 0; k < count.states[s - 1]; k++) {
    await page.evaluate(([s, k]) => Deck.goto(s, k, { instant: true }), [s, k]);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: path.join(SHOTS, `s${pad(s)}-k${pad(k)}.png`) });
    const f = await page.evaluate(() => {
      const out = [];
      const slide = document.querySelector("#stage > section.slide.current");
      const sr = slide.getBoundingClientRect(), sc = sr.width / 1920;
      const name = (e) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") +
        (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "") +
        (e.dataset && e.dataset.lbl ? `[data-lbl=${e.dataset.lbl}]` : "");
      const visible = (e) => {
        for (let n = e; n && n !== slide; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
          if (n.classList && n.classList.contains("bleed")) return false;
        }
        return true;
      };
      for (const e of slide.querySelectorAll("*")) {
        if (e.closest(".foot") || e.closest("aside.notes")) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 1 && r.height < 1) continue;
        if (!visible(e)) continue;
        const x0 = (r.left - sr.left) / sc, x1 = (r.right - sr.left) / sc, y0 = (r.top - sr.top) / sc, y1 = (r.bottom - sr.top) / sc;
        const over = Math.max(96 - x0, x1 - 1824, 40 - y0, y1 - 1000);
        if (over > 1.5) out.push([name(e), "leaves the content area", Math.round(over)]);
        if (e.matches("p, li, h1, h2, td, th, header, .kicker, .card, .katex-display, .body, .col")) {
          // formula struts and descenders stick out a few px below a line box without showing:
          // vertical overflow counts from 7 px, horizontal from 2 px
          const ow = e.scrollWidth - e.clientWidth, oh = e.scrollHeight - e.clientHeight;
          if (e.clientWidth > 0 && ow > 1) out.push([name(e), "content overflows its box sideways", ow]);
          if (e.clientWidth > 0 && oh > 6) out.push([name(e), "content overflows its box downwards", oh]);
        }
      }
      return out;
    });
    const seen = new Set();
    for (const [sel, what, px] of f) {
      if (seen.has(sel + what)) continue;
      seen.add(sel + what);
      findings.push(`slide ${s} state ${k}: ${sel} ${what} by ${px} px`);
    }
  }
}

// presenter view at the first, middle and last slide; the overview
for (const s of [...new Set([1, Math.ceil(count.slides / 2), count.slides])]) {
  if (s < from || s > to) continue;
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => errors.push("presenter: " + e));
  await p.goto(URL0 + `#presenter/${s}/0`);
  await p.waitForFunction(() => window.Deck && window.Deck.ready);
  await p.waitForTimeout(2500);
  const pt = [];
  for (const fr of p.frames()) pt.push(await fr.evaluate(() => document.documentElement.dataset.theme));
  if (pt.some((t) => t !== THEME)) errors.push(`presenter at slide ${s}: themes ${pt.join(",")}, expected ${THEME}`);
  await p.screenshot({ path: path.join(SHOTS, `presenter-s${pad(s)}.png`) });
  await p.close();
}
if (from === 1) {
  await page.evaluate(() => Deck.goto(1, 0, { instant: true }));
  await page.keyboard.press("o");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, "overview.png") });
  await page.keyboard.press("Escape");
}
await browser.close();

const report = [...findings, ...errors.map((e) => "error: " + e)];
fs.writeFileSync(path.join(SHOTS, "report.txt"), report.join("\n") + (report.length ? "\n" : ""));
const n = count.states.slice(from - 1, Math.min(to, count.slides)).reduce((a, b) => a + b, 0);
console.log(`${THEME}: ${n} pictures in ${path.basename(SHOTS)}/; ${findings.length} overflow findings, ${errors.length} errors`);
report.slice(0, 40).forEach((l) => console.log("  " + l));
process.exit(report.length ? 1 : 0);

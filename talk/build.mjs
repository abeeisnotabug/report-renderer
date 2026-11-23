// build.mjs: builds one self-contained HTML talk from a deck folder and the kit (kit/).
//
//   node ~/Documents/Works/report-renderer/talk/build.mjs path/to/my-talk [out.html]
//
// The deck folder holds:
//   config.json     title, kicker, shortTitle, subtitle, author, affiliation, date, lang,
//                   minutes (planned length), parts {label: heading}, colors {alias: slot a..f},
//                   output (optional file name, relative to the deck folder)
//   slides*.html    the slides, in file-name order
//   anim-*.js       pictures (Deck.anim), live-*.js live controls (Deck.live)
//   style.css       optional, the deck's own styles (loaded after the kit's)
//   assets/         optional, files referenced as asset:NAME (looked up here, then in kit/assets)
// The output defaults to <deck folder>.html next to the folder. Everything is inlined (fonts,
// images, KaTeX); the page makes no network request. Formulas are rendered here by KaTeX.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const TALK = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(TALK, "kit");
const KATEX_DIR = path.join(TALK, "..", "node_modules", "katex");
const fail = (msg) => { console.error("BUILD FAILED: " + msg); process.exit(1); };
if (!fs.existsSync(KATEX_DIR)) fail(`KaTeX not found at ${KATEX_DIR}: run npm install in the renderer folder`);
const katex = createRequire(import.meta.url)(path.join(KATEX_DIR, "dist", "katex.js"));

const DECK = path.resolve(process.argv[2] || fail("usage: node build.mjs <deck folder> [out.html]"));
if (!fs.existsSync(path.join(DECK, "config.json"))) fail(`${DECK}/config.json is missing`);
const config = JSON.parse(fs.readFileSync(path.join(DECK, "config.json"), "utf8"));
const OUT = process.argv[3] ? path.resolve(process.argv[3])
  : config.output ? path.resolve(DECK, config.output) : DECK.replace(/\/+$/, "") + ".html";

const readK = (f) => fs.readFileSync(path.join(KIT, f), "utf8");
const readD = (f) => fs.readFileSync(path.join(DECK, f), "utf8");
const deckFiles = (re) => fs.readdirSync(DECK).filter((f) => re.test(f)).sort();
const b64 = (file) => fs.readFileSync(file).toString("base64");
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- colours: slots a..f and the deck's aliases ----------
const SLOTS = ["a", "b", "c", "d", "e", "f"];
const aliases = config.colors || {};
for (const [a, s] of Object.entries(aliases)) {
  if (!/^[A-Za-z]+$/.test(a)) fail(`config colors: alias "${a}" must be letters only (it becomes the macro \\${a})`);
  if (!SLOTS.includes(s)) fail(`config colors: "${a}" points to "${s}", not a slot a..f`);
  if (SLOTS.includes(a)) fail(`config colors: alias "${a}" is a slot name`);
}
// KaTeX writes a macro's colour as color:#HEX; each macro gets a unique marker hex, which is then
// replaced by the theme's custom property, so formulas follow the theme.
const MACROS = {}, MARK = {};
const names = [...SLOTS.map((s) => ["c" + s, s]), ...Object.entries(aliases)];
names.forEach(([name, slot], i) => {
  const hex = (0xA10000 + i).toString(16).toUpperCase();
  MACROS["\\" + name] = `\\textcolor{${hex}}{#1}`;
  MARK[hex] = slot;
});
const themeMath = (h) => h.replace(/color:#([0-9A-Fa-f]{6})/g, (m, hex) => {
  const slot = MARK[hex.toUpperCase()];
  if (!slot) fail(`a formula has a fixed colour #${hex}: use \\ca … \\cf or an alias from config.json`);
  return `color:var(--c-${slot})`;
});
const aliasCss = Object.entries(aliases).map(([a, s]) => `.c-${a} { color: var(--c-${s}); }`).join("\n");

// ---------- slides: read and check ----------
const slideFiles = deckFiles(/^slides.*\.html$/);
if (!slideFiles.length) fail("no slides*.html in the deck folder");
const SEC = /<section\b([^>]*)>([\s\S]*?)<\/section>/g;
const attr = (s, a) => { const m = new RegExp(`\\b${a}="([^"]*)"`).exec(s); return m ? m[1] : null; };
const slides = [];
for (const file of slideFiles) {
  for (const m of readD(file).matchAll(SEC)) {
    if (!/class="[^"]*\bslide\b/.test(m[1])) continue;
    const n = slides.length + 1, K = +(attr(m[1], "data-steps") || 0);
    const title = ((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(m[2]) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
    const name = `slide ${n} (${file}, "${title.slice(0, 60)}")`;
    let maxIdx = -1;
    for (const a of m[2].matchAll(/data-(?:show|hide|hl|strike)="(\d+)"/g)) maxIdx = Math.max(maxIdx, +a[1]);
    if (maxIdx > K) fail(`${name}: a step index ${maxIdx} exceeds data-steps=${K}`);
    const notes = (/<aside class="notes">([\s\S]*?)<\/aside>/.exec(m[2]) || [])[1];
    if (notes === undefined) fail(`${name}: no <aside class="notes">`);
    if (/<p data-step=/.test(notes)) fail(`${name}: notes are bullet lists, <ul data-step="k"><li>…</li></ul>, not paragraphs`);
    const have = [...notes.matchAll(/<ul data-step="(\d+)"/g)].map((x) => +x[1]);
    for (let k = 0; k <= K; k++) if (have.filter((h) => h === k).length !== 1) fail(`${name}: needs exactly one <ul data-step="${k}">`);
    if (have.some((k) => k > K)) fail(`${name}: notes for a state beyond ${K}`);
    const words = notes.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " x ").replace(/<[^>]+>/g, " ")
      .split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
    slides.push({ n, K, title, words, min: +(attr(m[1], "data-min") || 0) });
  }
}

// ---------- formulas ----------
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
function where(src, pos) {
  const before = src.slice(0, pos);
  const k = (before.match(/<section\b/g) || []).length;
  const h = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(src.slice(before.lastIndexOf("<section")));
  return `section ${k} of this file${h ? ` ("${h[1].replace(/<[^>]+>/g, "").slice(0, 60)}")` : ""}`;
}
function renderMath(src, file) {
  let out = "", i = 0;
  while (i < src.length) {
    if (src[i] === "\\" && src[i + 1] === "$") { out += "$"; i += 2; continue; }
    if (src[i] !== "$") { out += src[i++]; continue; }
    const display = src[i + 1] === "$", open = display ? 2 : 1;
    let j = i + open;
    while (j < src.length) {
      if (src[j] === "\\") { j += 2; continue; }
      if (display ? src.startsWith("$$", j) : src[j] === "$") break;
      j++;
    }
    if (j >= src.length) fail(`${file}: unclosed $ at ${where(src, i)}`);
    const tex = decode(src.slice(i + open, j));
    try {
      out += themeMath(katex.renderToString(tex, { displayMode: display, throwOnError: true, output: "html", macros: { ...MACROS }, strict: "ignore" }));
    } catch (e) {
      fail(`${file}, ${where(src, i)}: KaTeX error in "${tex}": ${e.message}`);
    }
    i = j + open;
  }
  return out;
}

// ---------- assets, styles, scripts ----------
const MIME = { ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".png": "image/png",
               ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
function assetFile(f) {
  for (const dir of [path.join(DECK, "assets"), path.join(KIT, "assets")]) if (fs.existsSync(path.join(dir, f))) return path.join(dir, f);
  fail(`asset:${f} not found in the deck's assets/ or the kit's`);
}
const assets = (s) => s.replace(/asset:([A-Za-z0-9_.-]+\.(?:ttf|otf|woff2|png|jpe?g|svg))/g, (_, f) =>
  `data:${MIME[path.extname(f).toLowerCase()]};base64,${b64(assetFile(f))}`);

const slidesHtml = slideFiles.map((f) => assets(renderMath(readD(f), f))).join("\n");
let katexCss = fs.readFileSync(path.join(KATEX_DIR, "dist", "katex.min.css"), "utf8");
katexCss = katexCss.replace(/src:url\(fonts\/([^)]+?\.woff2)\) format\("woff2"\)[^;}]*/g, (_, f) =>
  `src:url(data:font/woff2;base64,${b64(path.join(KATEX_DIR, "dist", "fonts", f))}) format("woff2")`);
const css = [katexCss, assets(readK("style.css")), readK("theme.css"), aliasCss,
             fs.existsSync(path.join(DECK, "style.css")) ? assets(readD("style.css")) : ""].filter(Boolean);
const kitJs = ["lib.js", "theme.js", "engine.js", "live.js"].map((f) => [f, readK(f)]);
const deckJs = [...deckFiles(/^anim-.*\.js$/), ...deckFiles(/^live-.*\.js$/)].map((f) => [f, readD(f)]);
const scripts = [...kitJs, ...deckJs].map(([f, s]) => `<script>/* ${f} */\n${s}\n</script>`);

const html = readK("shell.html")
  .replace("<!--LANG-->", () => escHtml(config.lang || "en"))
  .replace("<!--TITLE-->", () => escHtml(config.title || path.basename(DECK)))
  .replace("<!--STYLES-->", () => css.map((c) => `<style>\n${c}\n</style>`).join("\n"))
  .replace("<!--SLIDES-->", () => slidesHtml)
  .replace("<!--CONFIG-->", () => `<script>window.DECK_CONFIG = ${JSON.stringify(config)};</script>`)
  .replace("<!--SCRIPTS-->", () => scripts.join("\n"));

// ---------- no network ----------
const NS_OK = /^http:\/\/www\.w3\.org\/(2000\/svg|1999\/xhtml|1999\/xlink|1998\/Math\/MathML)$/;
for (const m of html.matchAll(/https?:\/\/[^\s"'<>)]*/g)) {
  const before = html.slice(Math.max(0, m.index - 20), m.index);
  if (/xmlns(:\w+)?=["']$/.test(before) || NS_OK.test(m[0])) continue; // namespace names, never fetched
  fail(`a URL in the output: ${m[0]} (…${before})`);
}

fs.writeFileSync(OUT, html);

// ---------- report ----------
const states = slides.reduce((a, s) => a + s.K + 1, 0);
const words = slides.reduce((a, s) => a + s.words, 0), minutes = slides.reduce((a, s) => a + s.min, 0);
console.log(`${path.relative(process.cwd(), OUT)}: ${slides.length} slides, ${states} states, ${(html.length / 1e6).toFixed(2)} MB`);
for (const s of slides) console.log(`  ${String(s.n).padStart(2)}  states ${String(s.K + 1).padStart(2)}  words ${String(s.words).padStart(4)}  min ${s.min}  ${s.title.slice(0, 70)}`);
console.log(`notes: ${words} words; planned: ${minutes.toFixed(1)} min` + (config.minutes ? ` of ${config.minutes}` : ""));
if (config.minutes && Math.abs(minutes - config.minutes) > 1) console.warn(`WARNING: the planned minutes (${minutes.toFixed(1)}) differ from config.json minutes (${config.minutes})`);

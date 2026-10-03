// Renders a Markdown file with LaTeX maths to one self-contained HTML page, the only output.
// Usage: render.sh some-folder/some-file.md  -> writes some-file.html next to it.
// Maths is rendered by KaTeX here, not in the browser, and the KaTeX fonts are embedded, so the
// page works offline. Display formulas are regrouped by breaks.mjs, so the reader's browser breaks
// them by fixed rules (STYLE.md); nothing is measured and no browser runs here.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const katex = require('katex');
import * as breaks from './breaks.mjs';

const md = path.resolve(process.argv[2]);
const base = md.replace(/\.md$/, '');
const pandoc = process.env.PANDOC || 'pandoc';
const here = path.dirname(fileURLToPath(import.meta.url));
// layers.lua folds sections, items and R code, but only in documents with `layered: true`
let body = execFileSync(pandoc, ['-f', 'markdown', '-t', 'html5', '--math-method=katex', '--wrap=none',
  '--lua-filter', path.join(here, 'layers.lua'), md], { encoding: 'utf8' });
const layered = body.includes('id="layer-toolbar"');

const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
let nMath = 0;
body = body.replace(/<span class="math (inline|display)">([\s\S]*?)<\/span>/g, (m, kind, tex) => {
  nMath++;
  return kind === 'display' ? breaks.render(unesc(tex)) : katex.renderToString(unesc(tex), { throwOnError: true, output: 'html' });
});
if (/class="math /.test(body)) throw new Error('unrendered math left');

// Embed local images (e.g. knitr figures) as data URIs, so the HTML stays self-contained
body = body.replace(/<img([^>]*?) src="([^"]+)"/g, (m, pre, src) => {
  if (/^(data:|https?:)/.test(src)) return m;
  const f = path.resolve(path.dirname(md), decodeURI(src));
  const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(f).toLowerCase()];
  if (!mime || !fs.existsSync(f)) throw new Error('image not found or unknown type: ' + src);
  return `<img${pre} src="data:${mime};base64,${fs.readFileSync(f).toString('base64')}"`;
});

// KaTeX CSS with woff2 fonts inlined, other formats dropped
const kdir = path.dirname(require.resolve('katex/dist/katex.min.css'));
let kcss = fs.readFileSync(path.join(kdir, 'katex.min.css'), 'utf8');
kcss = kcss.replace(/src:url\((fonts\/[^)]+\.woff2)\) format\("woff2"\)(,url\([^)]+\) format\("[^"]+"\))*/g, (m, f) =>
  `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(kdir, f)).toString('base64')}) format("woff2")`);

// Light mode white, dark mode dark grey. Phones: 17 px text over the full width; wider screens:
// 20 px text in a column of 40em (800 px).
const css = `
:root{--bg:#fff;--fg:#1a1a1a;--muted:#5f6368;--rule:#dadce0;--quote-bg:#f4f5f7;--quote-bar:#9aa0a6;--code-bg:#f2f3f5;--link:#1f5f8b}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#17181a;--fg:#e6e3db;--muted:#a19d93;--rule:#3a3a3c;--quote-bg:#222326;--quote-bar:#8a826b;--code-bg:#26272a;--link:#7fb6e0}}
:root[data-theme="dark"]{--bg:#17181a;--fg:#e6e3db;--muted:#a19d93;--rule:#3a3a3c;--quote-bg:#222326;--quote-bar:#8a826b;--code-bg:#26272a;--link:#7fb6e0}
html{-webkit-text-size-adjust:100%}
body{background:var(--bg);color:var(--fg);font-family:"KaTeX_Main",Georgia,"Times New Roman",serif;font-size:17px;line-height:1.5;margin:0;padding:12px 16px 48px;max-width:40em;margin-inline:auto;overflow-wrap:break-word}
@media (min-width:700px){body{font-size:20px;padding-top:24px}}
h1{font-size:1.45em;line-height:1.25;margin:.6em 0 .5em}
h2{font-size:1.25em;line-height:1.3;margin:1.8em 0 .5em;border-bottom:1px solid var(--rule);padding-bottom:.15em}
h3{font-size:1.07em;margin:1.4em 0 .4em}
p,li{margin:.55em 0}
ol,ul{padding-left:1.4em}
hr{border:0;border-top:1px solid var(--rule);margin:2em 0}
blockquote{margin:1em 0;padding:.4em .8em;background:var(--quote-bg);border-left:3px solid var(--quote-bar);border-radius:3px}
blockquote p{margin:.4em 0}
code{font-family:"DejaVu Sans Mono",Menlo,monospace;font-size:.82em;background:var(--code-bg);padding:.05em .25em;border-radius:3px;overflow-wrap:anywhere}
a{color:var(--link)}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--code-bg);padding:.45em .6em;border-radius:3px;font-size:.92em;line-height:1.35}
pre code{background:none;padding:0}
img{max-width:100%;height:auto}
figure{margin:1em 0}figcaption{font-size:.9em;color:var(--muted)}
table{border-collapse:collapse;font-size:.88em;margin:.8em 0;display:block;overflow-x:auto;max-width:100%}th,td{padding:.25em .45em;border-bottom:1px solid var(--rule);vertical-align:top}
.katex{font-size:1.02em}
.katex-display{margin:.7em 0;overflow-x:auto;overflow-y:hidden;padding:2px 0}
.katex-display>.katex{font-size:1.02em}
${breaks.css}`;
const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
const title = h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : path.basename(base);
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${kcss}</style><style>${css}</style>${layered ? `<style>${fs.readFileSync(path.join(here, 'layers.css'), 'utf8')}</style>` : ''}</head>
<body>
${body}
${layered ? `<script>${fs.readFileSync(path.join(here, 'layers.js'), 'utf8')}</script>` : ''}
<script>${breaks.script}</script>
</body></html>`;
fs.writeFileSync(base + '.html', html);
console.log(path.basename(base) + '.html:', nMath, 'formulas');

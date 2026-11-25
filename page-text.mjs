// Dumps a rendered report page as plain text in reading order, for a reader who sees only the page.
// Headings are kept as "#" lines; each fold (details) is included, opened, between a start and an
// end line with its title: ">>> FOLD: title" ... "<<< END FOLD: title"; formulas appear as $TeX$
// (display formulas as $$TeX$$); numbered lists get "1. ", "2. ", ... (lists of type a, A, i, I: "a. ", "ii. ", ...); the table of contents, the
// toolbar, scripts and styles are left out. A need line, a punch and a source are folds like the
// others (">>> FOLD: Why here", "Why it holds", "What it demands", "What it shows", "Key idea",
// "Source"), in the item's fold order. The page itself holds no TeX (KaTeX output is HTML
// only), so the TeX is taken from report.md next to report.html: pandoc is run as in render.mjs and
// its formulas are matched, in document order, to the formulas of the page. If the .md is missing
// or the counts differ, a warning goes to stderr and the formulas come out as KaTeX's text.
//   node page-text.mjs /abs/path/report.html [out.txt]      (without out.txt: to the screen)
// Links: every link to an anchor of the page gets its target id after the link text:
//   "Lemma K.6 [→ lec-K-6]". Links to other pages or the web are left as they are.
// With out.txt (stem = out.txt without its extension) two more outputs are written next to it:
//   <stem>-fig-<n>.png   a screenshot of figure n (an img, or an inline svg that is a figure; KaTeX
//                        and icon svgs are not figures); in the text the figure stands as one line
//                        "[FIGURE <n>: <caption or alt>; image: <stem>-fig-<n>.png]" (its figcaption
//                        is then left out of the text, being in that line)
//   <stem>-targets.txt   one block per id that a link points to: "## <id>" and the target's text as
//                        in the dump (an item or box: its statement block without its folds; a
//                        section: its heading and gist). Blocks are separated by a line "----".
// Without out.txt no image and no targets file are written, and a figure is dumped as the old
// line "[figure: alt]".
// Needs Playwright with WebKit, installed globally with Homebrew's npm (as phone-check.js).
import { createRequire } from 'node:module';
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { webkit } = require('/opt/homebrew/lib/node_modules/playwright');
const [page_, out] = process.argv.slice(2);
if (!page_) { console.error('usage: node page-text.mjs <page.html> [out.txt]'); process.exit(1); }
// TeX of the formulas, as render.mjs reads them from pandoc's output (punctuation after an inline one is kept)
let tex = null;
const md = resolve(page_).replace(/\.html?$/, '.md');
if (existsSync(md)) {
  const here = dirname(fileURLToPath(import.meta.url));
  const body = execFileSync(process.env.PANDOC || 'pandoc', ['-f', 'markdown', '-t', 'html5', '--math-method=katex', '--wrap=none',
    '--lua-filter', join(here, 'layers.lua'), md], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  tex = [...body.matchAll(/<span class="math (inline|display)">([\s\S]*?)<\/span>([.,;:!?)\]]*)/g)]
    .map(m => ({ display: m[1] === 'display', tex: unesc(m[2]).trim(), punct: m[3] }));
}
const b = await webkit.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
p.on('console', m => console.error(m.text()));
await p.goto('file://' + resolve(page_)); await p.waitForTimeout(1500);
await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
await p.waitForTimeout(500);
const stem = out ? resolve(out).replace(/\.[^./]*$/, '') : null;
const images = !!out;
const { text, targets, nfig } = await p.evaluate(({ tex, images, prefix }) => {
  const figName = k => prefix + '-fig-' + k + '.png';
  const SKIP = 'script,style,nav#toc,#layer-toolbar,.peek-bar,.katex-html,.katex-mathml math > *:not(semantics),noscript';
  const BLOCK = /^(P|DIV|UL|OL|LI|TABLE|TR|H[1-6]|BLOCKQUOTE|PRE|SECTION|ARTICLE|HEADER|FIGURE|FIGCAPTION|DL|DT|DD|HR|BODY|MAIN|ASIDE)$/;
  const clean = s => s.replace(/\s+/g, ' ').trim();
  let buf = '';
  const maths = [...document.querySelectorAll('.katex')].filter(k => !k.parentElement.closest('.katex'));
  if (tex && tex.length !== maths.length) { console.warn('page-text: ' + maths.length + ' formulas in the page, ' + tex.length + ' in the .md; TeX not used'); tex = null; }
  const texOf = new Map(maths.map((k, i) => [k, i]));
  let skipFolds = false, collecting = true;
  const linked = new Set(), figs = new Map();
  const isFigSvg = n => !n.closest('.katex,button,a,summary,#layer-toolbar') &&
    (n.closest('figure') || n.getAttribute('role') === 'img' || (() => { const r = n.getBoundingClientRect(); return r.width >= 48 && r.height >= 48; })());
  const sub = f => { const keep = buf; buf = ''; f(); const r = buf; buf = keep; return r; };
  const nl = () => { if (!buf.endsWith('\n')) buf += '\n'; };
  const blank = () => { nl(); if (!buf.endsWith('\n\n')) buf += '\n'; };
  // the marker of item k of an ol in its type: "a"/"A" letters, "i"/"I" roman numerals, else digits
  const alpha = k => { let s = ''; for (; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(97 + (k - 1) % 26) + s; return s; };
  const roman = k => [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']].reduce((s, [v, r]) => { while (k >= v) { s += r; k -= v; } return s; }, '');
  const marker = (k, t) => k < 1 ? String(k) : t === 'a' ? alpha(k) : t === 'A' ? alpha(k).toUpperCase()
    : t === 'i' ? roman(k) : t === 'I' ? roman(k).toUpperCase() : String(k);
  function walk(n) {
    if (n.nodeType === 3) { buf += n.nodeValue.replace(/\s+/g, ' '); return; }
    if (n.nodeType !== 1) return;
    if (n.matches(SKIP) || n.hidden) return;
    const cs = getComputedStyle(n);
    if (cs.display === 'none') return;
    const tag = n.tagName;
    if (tag === 'FIGCAPTION' && images) return;   // its text stands in the FIGURE line
    if (tag === 'svg' || tag === 'IMG') {
      if (tag === 'svg' && !isFigSvg(n)) return;
      if (!images) { if (tag === 'IMG') buf += '[figure' + (n.alt ? ': ' + clean(n.alt) : '') + ']'; return; }
      if (!figs.has(n)) { figs.set(n, figs.size + 1); n.setAttribute('data-pt-fig', figs.size); }
      const fc = n.closest('figure') && n.closest('figure').querySelector('figcaption');
      let cap = fc ? clean(sub(() => { for (const c of fc.childNodes) walk(c); })) : '';
      if (!cap) cap = clean(n.getAttribute('alt') || n.getAttribute('aria-label') || '') || '(no caption)';
      const k = figs.get(n);
      nl(); buf += '[FIGURE ' + k + ': ' + cap + '; image: ' + figName(k) + ']'; nl();
      return;
    }
    if (n.classList.contains('katex')) {
      const f = tex && texOf.has(n) ? tex[texOf.get(n)] : null;
      const a = n.querySelector('annotation[encoding="application/x-tex"]');
      const t = f ? f.tex : a ? clean(a.textContent) : clean(n.textContent);
      buf += n.closest('.katex-display') ? ' $$' + t + '$$ ' : '$' + t + '$' + (f && !f.display ? f.punct : '');
      return;
    }
    if (tag === 'BR') { nl(); return; }
    if (tag === 'A') {
      const h = n.getAttribute('href') || '';
      if (h.length > 1 && h[0] === '#' && n.getAttribute('aria-hidden') !== 'true') {
        const id = decodeURIComponent(h.slice(1));
        for (const c of n.childNodes) walk(c);
        buf += ' [→ ' + id + ']';
        if (collecting) linked.add(id);
        return;
      }
    }
    if (tag === 'DETAILS') {
      if (skipFolds) return;
      const s = n.querySelector(':scope > summary');
      const h = s && s.querySelector('h1,h2,h3,h4,h5,h6');
      const title = h ? clean(h.textContent) : (s ? clean(s.textContent) : '');
      blank();
      if (h) { for (const c of s.childNodes) walk(c); blank(); }   // heading and takeaway stay above the marker
      buf += '>>> FOLD: ' + title; blank();
      for (const c of n.childNodes) if (c !== s) walk(c);
      blank(); buf += '<<< END FOLD: ' + title; blank();
      return;
    }
    if (/^H[1-6]$/.test(tag)) { blank(); buf += '#'.repeat(+tag[1]) + ' '; for (const c of n.childNodes) walk(c); blank(); return; }
    if (tag === 'LI') { nl(); const o = n.parentNode.tagName === 'OL' ? n.parentNode : null;
      buf += o ? marker(o.start + [...o.children].filter(c => c.tagName === 'LI').indexOf(n), o.getAttribute('type')) + '. ' : '- '; for (const c of n.childNodes) walk(c); nl(); return; }
    if (tag === 'TR') { nl(); [...n.children].forEach((c, i) => { if (i) buf += ' | '; for (const k of c.childNodes) walk(k); }); nl(); return; }
    const blk = BLOCK.test(tag);
    if (blk) nl();
    for (const c of n.childNodes) walk(c);
    if (blk) nl();
  }
  const tidy = b => b.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n')
    .replace(/^(\d+\.|[a-z]{1,4}\.|[A-Z]{1,4}\.|-)\n+/gm, '$1 ')   // a list marker stays on the line of its item's first paragraph
    .replace(/\n{3,}/g, '\n\n').trim() + '\n';
  walk(document.body);
  const text = tidy(buf);
  collecting = false;
  // targets: text of each element that a link points to, folds left out
  const targets = [];
  if (images) {
    const els = [...linked].map(id => [id, document.getElementById(id)]);
    for (const [id] of els.filter(e => !e[1])) console.warn('page-text: link to #' + id + ', but no such id in the page');
    els.filter(e => e[1]).sort((a, b) => a[1].compareDocumentPosition(b[1]) & 4 ? -1 : 1).forEach(([id, el]) => {
      skipFolds = true;
      const t = sub(() => {
        if (el.matches('nav#toc')) { buf += '(the table of contents of the page)'; return; }
        if (/^H[1-6]$/.test(el.tagName)) {
          walk(el);
          const g = (el.closest('summary') || el.parentElement).querySelector('.gist');
          if (g) walk(g);
        } else walk(el);
      });
      skipFolds = false;
      targets.push([id, tidy(t)]);
    });
  }
  return { text, targets, nfig: figs.size };
}, { tex, images, prefix: basename(stem || '') });
if (out) {
  await p.waitForFunction(() => [...document.images].every(i => i.complete));
  for (let k = 1; k <= nfig; k++) await p.locator('[data-pt-fig="' + k + '"]').screenshot({ path: stem + '-fig-' + k + '.png' });
  writeFileSync(stem + '-targets.txt', targets.map(([id, t]) => '## ' + id + '\n' + t).join('\n----\n\n') );
}
await b.close();
if (out) {
  writeFileSync(out, text);
  console.log('wrote', out, text.split('\n').length, 'lines;', nfig, 'figures;', targets.length, 'link targets in', stem + '-targets.txt');
} else process.stdout.write(text);

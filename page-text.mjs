// Dumps a rendered report page as plain text in reading order, for a reader who sees only the page.
// Headings are kept as "#" lines; each fold (details) is included, opened, between a start and an
// end line with its title: ">>> FOLD: title" ... "<<< END FOLD: title"; formulas appear as $TeX$
// (display formulas as $$TeX$$); the table of contents, the toolbar, scripts and styles are left out.
//   node page-text.mjs /abs/path/report.html [out.txt]      (without out.txt: to the screen)
// Needs Playwright with WebKit, installed globally with Homebrew's npm (as phone-check.js).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { webkit } = require('/opt/homebrew/lib/node_modules/playwright');
const [page_, out] = process.argv.slice(2);
if (!page_) { console.error('usage: node page-text.mjs <page.html> [out.txt]'); process.exit(1); }
const b = await webkit.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('file://' + resolve(page_)); await p.waitForTimeout(1500);
await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
await p.waitForTimeout(500);
const text = await p.evaluate(() => {
  const SKIP = 'script,style,nav#toc,#layer-toolbar,.peek-bar,.katex-html,.katex-mathml math > *:not(semantics),svg,noscript';
  const BLOCK = /^(P|DIV|UL|OL|LI|TABLE|TR|H[1-6]|BLOCKQUOTE|PRE|SECTION|ARTICLE|HEADER|FIGURE|FIGCAPTION|DL|DT|DD|HR|BODY|MAIN|ASIDE)$/;
  const clean = s => s.replace(/\s+/g, ' ').trim();
  let buf = '';
  const nl = () => { if (!buf.endsWith('\n')) buf += '\n'; };
  const blank = () => { nl(); if (!buf.endsWith('\n\n')) buf += '\n'; };
  function walk(n) {
    if (n.nodeType === 3) { buf += n.nodeValue.replace(/\s+/g, ' '); return; }
    if (n.nodeType !== 1) return;
    if (n.matches(SKIP) || n.hidden) return;
    const cs = getComputedStyle(n);
    if (cs.display === 'none') return;
    const tag = n.tagName;
    if (n.classList.contains('katex')) {
      const a = n.querySelector('annotation[encoding="application/x-tex"]');
      const tex = a ? clean(a.textContent) : clean(n.textContent);
      buf += n.closest('.katex-display') ? ' $$' + tex + '$$ ' : '$' + tex + '$';
      return;
    }
    if (tag === 'IMG') { buf += '[figure' + (n.alt ? ': ' + clean(n.alt) : '') + ']'; return; }
    if (tag === 'BR') { nl(); return; }
    if (tag === 'DETAILS') {
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
    if (tag === 'LI') { nl(); buf += '- '; for (const c of n.childNodes) walk(c); nl(); return; }
    if (tag === 'TR') { nl(); [...n.children].forEach((c, i) => { if (i) buf += ' | '; for (const k of c.childNodes) walk(k); }); nl(); return; }
    const blk = BLOCK.test(tag);
    if (blk) nl();
    for (const c of n.childNodes) walk(c);
    if (blk) nl();
  }
  walk(document.body);
  return buf.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
});
await b.close();
if (out) { writeFileSync(out, text); console.log('wrote', out, text.split('\n').length, 'lines'); } else process.stdout.write(text);

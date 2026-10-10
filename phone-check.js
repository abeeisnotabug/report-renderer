// Opens a rendered page in WebKit at iPhone width (393 px), opens every fold, and prints:
// scrollW (page width; 393 means no sideways scroll), items, scrollingDisplays (items whose
// display formulas scroll), uses (each item's "Uses:" line), deadLocal (links to anchors missing
// on the page), crossPage (links to anchors on other pages, to check by hand), and script errors.
// Optional: screenshots of the listed items into a folder.
//   node phone-check.js /abs/path/report.html [shots-folder item-id,item-id]
// Needs Playwright with WebKit, installed globally with Homebrew's npm.
const { webkit } = require('/opt/homebrew/lib/node_modules/playwright');
(async () => {
  const b = await webkit.launch();
  const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const out = { scrollW: document.documentElement.scrollWidth };
    out.items = document.querySelectorAll('.item').length;
    out.scrollingDisplays = [...document.querySelectorAll('.katex-display')].filter(d => { const s = d.closest('.math-scroll') || d; return d.scrollWidth > d.clientWidth + 1 || s.scrollWidth > s.clientWidth + 1; }).map(d => (d.closest('.item')||{}).id);
    out.uses = [...document.querySelectorAll('.item')].map(e => e.id + ': ' + (e.querySelector('.uses')?.textContent.replace(/\s+/g,' ').trim() || '-'));
    const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
    out.deadLocal = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !ids.has(h));
    out.crossPage = [...new Set([...document.querySelectorAll('a[href*=".html#"]')].map(a => a.getAttribute('href')).filter(h => !/^https?:/.test(h)))];
    return out;
  });
  console.log(JSON.stringify(r, null, 1)); console.log('errors', errs);
  for (const id of (process.argv[4]||'').split(',').filter(Boolean)) { const e = await p.$('#' + id); await e.scrollIntoViewIfNeeded(); await e.screenshot({ path: process.argv[3] + '/h-' + id + '.png' }); }
  await b.close();
})();

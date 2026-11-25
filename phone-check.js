// Opens a rendered page in WebKit at iPhone width (393 px), opens every fold, and prints:
// scrollW (page width; 393 means no sideways scroll), items, scrollingDisplays (items whose
// display formulas scroll), uses (each item's "Uses" list), deadLocal (links to anchors missing
// on the page), crossPage (links to anchors on other pages, to check by hand), and script errors.
// On a page with interactive figures (livefig.js) it also prints, under "live": the number of
// figures; then, in light and in dark mode, every move it made (each slider to its minimum and
// maximum, each switch flipped, each option picked, each draggable point to its limits, Reset)
// and every problem after a move: a script error (with the figure's id), a page wider than the
// screen, a figure not drawn; and the smallest text size in the figures (13 px at least).
// Pages without interactive figures print exactly what they printed before.
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
    out.uses = [...document.querySelectorAll('.item')].map(e => e.id + ': ' + (() => { const u = e.querySelector('.uses'); if (!u) return '-'; const c = u.cloneNode(true); c.querySelector('summary')?.remove(); return 'Uses: ' + c.textContent.replace(/\s+/g,' ').replace(/^\s*Uses:\s*/,'').trim(); })());
    const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
    out.deadLocal = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !ids.has(h));
    out.crossPage = [...new Set([...document.querySelectorAll('a[href*=".html#"]')].map(a => a.getAttribute('href')).filter(h => !/^https?:/.test(h)))];
    return out;
  });
  // interactive figures: exercise every control, in light and in dark mode
  if (await p.evaluate(() => document.querySelectorAll('figure.live').length)) {
    r.live = { figures: await p.evaluate(() => document.querySelectorAll('figure.live').length) };
    for (const scheme of ['light', 'dark']) {
      await p.emulateMedia({ colorScheme: scheme }); await p.waitForTimeout(400);
      r.live[scheme] = await p.evaluate(exercise);
    }
  }
  console.log(JSON.stringify(r, null, 1)); console.log('errors', errs);
  for (const id of (process.argv[4]||'').split(',').filter(Boolean)) { const e = await p.$('#' + id); await e.scrollIntoViewIfNeeded(); await e.screenshot({ path: process.argv[3] + '/h-' + id + '.png' }); }
  await b.close();
})();

// Runs in the page: every move on every interactive figure, then a check after each move.
async function exercise() {
  const frames = () => new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
  const W = innerWidth, problems = [];
  let moves = 0;
  const LF = window.LiveFig;
  if (!LF) return { problems: ['livefig.js is not on the page (or failed to load)'] };
  // errors from loading the page (before any move)
  for (const e of LF.errors.splice(0)) problems.push(e.fig + ': at load: ' + e.message);
  const after = async (fig, what) => {
    await frames();
    moves++;
    const sw = document.documentElement.scrollWidth;
    if (sw > W) problems.push(fig + ': ' + what + ': page ' + sw + ' px wide, screen ' + W + ' px');
    for (const e of LF.errors.splice(0)) problems.push(e.fig + ': ' + what + ': ' + e.message);
  };
  const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  for (const f of document.querySelectorAll('figure.live')) {
    const id = f.id;
    if (!f.classList.contains('lf-ready')) { problems.push(id + ': not made (no L.figure call, or an error before it)'); continue; }
    if (!f.querySelector('svg.lf-panel path, svg.lf-panel text')) problems.push(id + ': nothing drawn');
    for (const inp of f.querySelectorAll('.lf-slider input[type=range]')) {
      const lab = inp.closest('[data-label]').dataset.label, v0 = inp.value;
      for (const v of [inp.min, inp.max]) { inp.value = v; fire(inp, 'input'); await after(id, 'slider "' + lab + '" = ' + v); }
      inp.value = v0; fire(inp, 'input'); await after(id, 'slider "' + lab + '" back');
    }
    for (const inp of f.querySelectorAll('.lf-switch input')) {
      const lab = inp.closest('[data-label]').dataset.label;
      inp.click(); await after(id, 'switch "' + lab + '" ' + (inp.checked ? 'on' : 'off'));
      inp.click(); await after(id, 'switch "' + lab + '" ' + (inp.checked ? 'on' : 'off'));
    }
    for (const c of f.querySelectorAll('.lf-choice')) {
      const bs = [...c.querySelectorAll('.lf-opts button')], first = bs.find(x => x.getAttribute('aria-pressed') === 'true');
      for (const x of bs) { x.click(); await after(id, 'choice "' + c.dataset.label + '" = ' + x.textContent); }
      if (first) { first.click(); await after(id, 'choice back'); }
    }
    const api = LF.figures.find(x => x.id === id);
    if (api) for (const pt of api._points()) {
      const corners = pt.axis === 'x' ? [[pt.x0, 0], [pt.x1, 0]] : pt.axis === 'y' ? [[0, pt.y0], [0, pt.y1]]
        : [[pt.x0, pt.y0], [pt.x1, pt.y1], [pt.x0, pt.y1], [pt.x1, pt.y0]];
      for (const [x, y] of corners) { api._place(pt.id, x, y); await after(id, 'point "' + pt.label + '" to (' + x + ', ' + y + ')'); }
    }
    const reset = f.querySelector('.lf-reset');
    if (reset) { reset.click(); await after(id, 'Reset'); }
  }
  // the smallest text in the figures (SVG text and its tspans, controls, readouts)
  let minText = Infinity;
  for (const e of document.querySelectorAll('figure.live .lf-root text, figure.live .lf-root tspan, figure.live .lf-root .lf-ctl *, figure.live .lf-readout *')) {
    if (!e.textContent.trim() || e.closest('[hidden]')) continue;
    minText = Math.min(minText, parseFloat(getComputedStyle(e).fontSize));
  }
  if (minText < 13) problems.push('text of ' + minText + ' px in a figure (13 px at least)');
  return { moves, minText, problems };
}

// Line breaking for display formulas. Regroups KaTeX's pieces of a display formula so that the
// reader's browser breaks it by its ordinary line wrapping; nothing is measured here. The rules
// (STYLE.md, "Display formulas"):
// - centred; a formula that fits stays on one line;
// - too wide: break before the first = outside brackets, later lines indented 1.5em; a part that
//   still does not fit breaks before + or × outside brackets, its last line pushed to the right;
// - a chain (two or more = outside brackets) always gets one line per =;
// - inside brackets: before a conditioning bar first, then after a comma, anywhere else last.
// Uses an internal KaTeX function (__renderToDomTree): keep KaTeX pinned in package.json.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const katex = require('katex');
const cls = n => (n && n.classes) || [];
const find = (n, c) => { if (cls(n).includes(c)) return n; for (const ch of (n.children || [])) { const r = find(ch, c); if (r) return r; } return null; };
const wrap = (c, children) => ({ classes: [c], children, toMarkup() { return `<span class="${c}">${children.map(x => x.toMarkup()).join('')}</span>`; } });
const textOf = n => (n.text || '') + (n.children || []).map(textOf).join('');
const has = (n, c) => cls(n).includes(c) || (n.children || []).some(ch => has(ch, c));
function delta(a) {
  if (cls(a).includes('nulldelimiter')) return 0;
  if (cls(a).includes('mopen')) return [...textOf(a)].length;
  if (cls(a).includes('mclose')) return -[...textOf(a)].length;
  if (has(a, 'delimsizing')) { const t = textOf(a); if (/[([{⟨]/.test(t)) return 1; if (/[)\]}⟩]/.test(t)) return -1; }
  return 0;
}
// a copy of one of KaTeX's pieces with other children (keeps KaTeX's own way of writing it out)
const copy = (b, children) => Object.assign(Object.create(Object.getPrototypeOf(b)), b, { children });
const blank = a => cls(a).includes('katex-strut') || cls(a).includes('mspace');
const bar = a => (cls(a).includes('mrel') || cls(a).includes('mord')) && /^[∣|]$/.test(textOf(a));
const comma = a => cls(a).includes('mpunct') && textOf(a) === ',';
export function render(tex) {
  const tree = katex.__renderToDomTree(tex, { displayMode: true, output: 'html', throwOnError: true });
  const html = find(tree, 'katex-html');
  let bases = html.children.filter(b => cls(b).includes('katex-base'));
  const other = html.children.filter(b => !cls(b).includes('katex-base'));
  const isOp = a => cls(a).includes('mrel') || cls(a).includes('mbin');
  const isRel = a => cls(a).includes('mrel') && textOf(a) !== '∣';
  // inside brackets, a conditioning bar (\mid, or a | that is the only one inside its brackets) and
  // a comma are better places to break than an = or a +: find them
  let depth = 0; const stack = [], id = new Map(), bars = new Map(); let next = 0;
  for (const b of bases) for (const a of b.children) {
    const d = delta(a);
    if (d < 0) for (let k = 0; k < -d; k++) stack.pop();
    id.set(a, stack.length ? stack[stack.length - 1] : -1);
    if (bar(a) && stack.length) bars.set(id.get(a), (bars.get(id.get(a)) || 0) + 1);
    if (d > 0) for (let k = 0; k < d; k++) stack.push(next++);
  }
  const condBar = a => bar(a) && id.get(a) >= 0 && (textOf(a) === '∣' && cls(a).includes('mrel') || bars.get(id.get(a)) === 1);
  // cut KaTeX's pieces before such a bar and after such a comma (and its space); the cut is a soft break
  const soft = new Set(), softBar = new Set(), cut = [];
  for (const b of bases) {
    const ch = b.children, strut = ch.find(a => cls(a).includes('katex-strut'));
    let cur = [];
    const flush = () => { if (cur.some(a => !blank(a))) { cut.push(cur.length === ch.length ? b : copy(b, cur)); return true; } return false; };
    for (let j = 0; j < ch.length; j++) {
      const a = ch[j];
      if (condBar(a) && cur.some(x => !blank(x))) { flush(); cur = strut ? [strut] : []; softBar.add(a); }
      cur.push(a);
      if (comma(a) && id.get(a) >= 0 && ch.slice(j + 1).some(x => !blank(x))) {
        while (j + 1 < ch.length && cls(ch[j + 1]).includes('mspace')) cur.push(ch[++j]);
        flush(); cur = strut ? [strut] : []; soft.add(ch[j + 1]);
      }
    }
    flush();
  }
  bases = cut;
  // break before operators: move each piece's closing operator (and the space after it) to the next piece
  for (let i = 0; i < bases.length - 1; i++) {
    const ch = bases[i].children;
    let j = ch.length - 1;
    while (j >= 0 && cls(ch[j]).includes('mspace')) j--;
    if (j < 0 || !isOp(ch[j])) continue;
    const moved = ch.splice(j);
    const nx = bases[i + 1].children;
    nx.splice(nx.length && cls(nx[0]).includes('katex-strut') ? 1 : 0, 0, ...moved);
  }
  depth = 0;
  const info = bases.map(b => {
    const d0 = depth;
    for (const a of b.children) depth = Math.max(0, depth + delta(a));
    const first = b.children.find(a => !blank(a));
    return { b, segStart: d0 === 0 && isRel(first), pieceStart: d0 === 0 && isOp(first), bar: softBar.has(first) || condBar(first || {}), soft: soft.has(first) };
  });
  // groups: the pieces between conditioning bars inside brackets, and within them the pieces between
  // commas, so a break inside brackets falls before a bar first, then after a comma
  const segs = []; let seg = [], piece = [], grp = [], sub = [];
  const endSub = () => { if (sub.length) grp.push(sub.length > 1 ? wrap('katex-grp', sub) : sub[0]); sub = []; };
  const endGrp = () => { endSub(); if (grp.length) piece.push(grp.length > 1 ? wrap('katex-grp', grp) : grp[0]); grp = []; };
  const endPiece = () => { endGrp(); if (piece.length) seg.push(piece.length > 1 ? wrap('katex-piece', piece) : piece[0]); piece = []; };
  const endSeg = () => { endPiece(); if (seg.length) segs.push(wrap('katex-seg', seg)); seg = []; };
  for (const x of info) { if (x.segStart) endSeg(); else if (x.pieceStart) endPiece(); else if (x.bar) endGrp(); else if (x.soft) endSub(); sub.push(x.b); }
  endSeg();
  const nest = s => s.length === 1 ? s[0] : wrap('katex-seg', [s[0], nest(s.slice(1))]);
  const firstAtom = n => { for (const ch of (n.children || [])) { if (blank(ch)) continue; return /katex-(base|piece|seg|grp)/.test(cls(ch).join(' ')) ? firstAtom(ch) : ch; } return null; };
  const eqStarts = segs.map((s, k) => k > 0 && textOf(firstAtom(s) || {}) === '=');
  if (eqStarts.filter(Boolean).length >= 2) {
    const lines = []; let cur = [];
    segs.forEach((s, k) => { if (eqStarts[k]) { lines.push(cur); cur = [s]; } else cur.push(s); });
    lines.push(cur);
    html.children = [wrap('fx-stack', lines.map((l, k) => wrap(k ? 'fx-rel' : 'fx-lhs', l))), ...other];
  } else html.children = [...(segs.length > 1 ? [segs[0], nest(segs.slice(1))] : segs), ...other];
  return tree.toMarkup();
}
// style rules for the regrouped formulas, equation numbers and the faded edge
export const css = `
.katex-display>.katex{white-space:normal}
.katex-display>.katex>.katex-html{display:inline-block;max-width:100%;text-align:left;text-indent:1.5em hanging}
.katex-display>.katex>.katex-html *{text-indent:0}
.katex-display{container-type:inline-size}
td .katex-display,th .katex-display{container-type:normal}
.katex-seg,.katex-piece,.katex-grp{display:inline-block;max-width:calc(100cqw - 1.5em)}
.katex-html>.katex-seg:first-child,.katex-html>.katex-seg:first-child :is(.katex-seg,.katex-piece,.katex-grp),.fx-lhs :is(.katex-seg,.katex-piece,.katex-grp){max-width:100cqw}
.katex-seg{text-align:left;text-align-last:right}
.katex-html .katex-base{text-align-last:auto}
.fx-stack,.fx-lhs{display:block}.fx-rel{display:block;margin-left:1.5em}
.katex-display{position:relative}
.katex-display>.katex,.katex-display>.katex>.katex-html{position:static}
.katex-display:has(.katex-tag){padding-right:3.4em}
.katex-display>.katex>.katex-html>.katex-tag{position:absolute!important;right:0;bottom:2px;margin:0;color:var(--muted)}
.katex-display.more{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 3em),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 3em),transparent)}
`;
// In the reader's browser: shrink a broken formula's box to its widest line, so it is centred as a
// whole, and fade the right edge of a formula that scrolls. Redone whenever a formula's size
// changes (a fold opens, the window turns) and for formulas in newly shown previews.
export const script = `(() => {
  const fit = d => {
    const h = d.querySelector('.katex-html');
    if (!h) return;
    h.style.width = '';
    if (d.clientWidth > 0) {
      const left = h.getBoundingClientRect().left;
      const right = Math.max(...[...h.querySelectorAll('.katex-base')].map(b => b.getBoundingClientRect().right));
      if (isFinite(right) && right > left) h.style.width = Math.ceil(right - left + 4) + 'px';
    }
    d.classList.toggle('more', d.clientWidth > 0 && d.scrollLeft + d.clientWidth < d.scrollWidth - 1);
  };
  // only a change of width needs a new fit; fitting itself changes the height
  const ro = new ResizeObserver(es => es.forEach(e => { if (e.target._w !== e.contentRect.width) { e.target._w = e.contentRect.width; fit(e.target); } }));
  // formulas in table cells are left alone: the cell's width comes from the formula
  const watch = root => root.querySelectorAll('.katex-display').forEach(d => {
    if (d.dataset.watched || d.closest('td,th')) return;
    d.dataset.watched = 1;
    ro.observe(d);
    d.addEventListener('scroll', () => d.classList.toggle('more', d.scrollLeft + d.clientWidth < d.scrollWidth - 1));
  });
  document.fonts.ready.then(() => {
    watch(document);
    document.querySelectorAll('.katex-display').forEach(d => { if (!d.closest('td,th')) fit(d); });
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      n.querySelectorAll('[data-watched]').forEach(d => delete d.dataset.watched);
      if (n.matches && n.matches('.katex-display')) { delete n.dataset.watched; watch(n.parentNode); }
      watch(n);
    }))).observe(document.body, { childList: true, subtree: true });
  });
})();`;

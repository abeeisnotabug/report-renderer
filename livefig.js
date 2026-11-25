/* livefig.js: interactive figures in reports. Plain JavaScript and SVG, no other libraries.
   render.mjs puts this file once into every page that has an interactive figure (and into no
   other page). This comment is the whole manual: a figure can be written from it alone.

   ======================================================================================
   1. MARKUP (in the report's Markdown or R Markdown)

     ::: {.live src="live-hurst.js" #fig-hurst}
     **Figure 3.** The claim in the first sentence. Then the panels and the controls, in order,
     with the notation repeated ($B_t$, $H$). Several paragraphs are fine.
     :::

     ::: {.fold summary="How it is computed"}
     In words and formulas: which draws, which formula, which numbers the readout shows.
     :::

   The div becomes a figure with the caption under it (maths typeset at build time, as in
   every caption). The script file is found relative to the .md and put into the page right
   after the figure; the page stays one file that works offline. The id (#fig-...) and src are
   required. A missing file or a syntax error in it stops the build with the file's name.
   Works in plain and in layered pages, in sections, items and folds (also in a fold that is
   closed at load: the figure is drawn when it first becomes visible). Keep a figure out of an
   item's title paragraph and out of the part before `::: more` (that part is the clickable
   summary of the item).
   Without scripts, and in print, the figure shows its caption and the note "Interactive figure".

   ======================================================================================
   2. THE SCRIPT FILE live-<id>.js

   The file is the body of a function. Two names are given to it:
     host   the empty element inside the figure, where the plot goes
     L      this library (also reachable as the global LiveFig)
   The file computes what does not change (the random draws) once, at the top, and then calls
   L.figure(host, spec) once. spec.draw is called on every change (a slider, a switch, a drag,
   a new width, a new colour scheme): it computes from the current values, then draws. Every
   draw starts from empty panels, so draw() only says what to show now.

   Complete small example (a Brownian path from fixed draws; a slider for sigma, a switch for
   a band, a time t dragged along the axis, a readout):

     const n = 400, z = L.rng(1).normals(n);        // the draws: once, outside draw
     const ts = L.seq(0, 1, n + 1);                  // the grid 0, 1/n, ..., 1
     L.figure(host, {
       panels: [{ id: 'path', aspect: 0.6, x: [0, 1], y: [-3, 3], xlabel: '$t$', ylabel: '$\\sigma B_t$' }],
       controls: [
         { type: 'slider', id: 'sigma', label: '$\\sigma$', min: 0.2, max: 2, step: 0.1, value: 1 },
         { type: 'switch', id: 'band', label: 'band $\\pm 2\\sigma\\sqrt{t}$', value: true },
       ],
       points: [{ id: 't', panel: 'path', x: 0.5, y: 0, axis: 'x', label: '$t$', color: 'b' }],
       draw(v, P, fig) {
         const p = P.path, s = v.sigma;
         const b = [0];
         for (let i = 0; i < n; i++) b.push(b[i] + s * Math.sqrt(1 / n) * z[i]);
         if (v.band) p.area(ts, ts.map(t => -2 * s * Math.sqrt(t)), ts.map(t => 2 * s * Math.sqrt(t)), { color: 'b' });
         p.line(ts, b, { color: 'a' });
         const k = Math.round(v.t.x * n);
         p.vline(ts[k], { color: 'b', dash: '4 3' });
         fig.readout('$\\sigma B_t = ' + L.fmt(b[k], 2) + '$ at $t = ' + L.fmt(ts[k], 2) + '$');
       },
     });

   (In a .js file a backslash in a string is written twice: '$\\sigma$'.)

   ======================================================================================
   3. L.figure(host, spec) -> fig

   spec.panels    list of panels, stacked top to bottom, each the column's width:
       { id,                 name used in draw: P.<id>
         aspect: 0.62,       height / width of the whole panel (fixed; redrawn at every width)
         x: [a, b], y: [c, d],   the visible ranges (data units)
         xlabel, ylabel,     axis labels (labels: section 5); ylabel stands above the y axis
         xticks, yticks,     optional: a list of numbers, or of [value, label] pairs
                             ([[0.3, '$s$'], [0.7, '$t$']]); default: about 5 round numbers
         maxWidth: 420,      optional: at most this many px wide, centred (for a square
                             panel, which would be 800 px tall on a laptop)
         zero: true,         a thin line at y = 0 (and x = 0) where it is in range
         axes: false }       no axes, ticks or labels (for a picture without coordinates)
   spec.controls  list, shown under the plot in this order:
       { type: 'slider', id, label, min, max, step, value, format }
                     format(v) -> text of the shown value (default: as many decimals as step);
                     shown as "label = value"
       { type: 'switch', id, label, value: true|false }
       { type: 'choice', id, label, options: ['bm', 'ou'] or [['bm', 'Brownian'], ['ou', 'OU']], value }
     A "Reset" button is added under the controls (spec.reset: false leaves it out).
   spec.points    points that can be dragged with mouse or finger (and moved with the arrow
                  keys after Tab):
       { id, panel, x, y,    start position (data units); panel: its id (default the first)
         axis: 'x'|'y',      move only along this axis (default: both)
         xmin, xmax, ymin, ymax,   limits (default: the panel's range)
         step,               snap to multiples of step (from the lower limit)
         constrain(x, y, v) -> [x, y],   optional: put the point where it may be (e.g. on a circle)
         color: 'a', label: '$s$' }
     Dragging a point never scrolls the page; swiping anywhere else on the figure does.
   spec.draw(v, P, fig)  called on every change:
       v     current values: v.<slider id> a number, v.<switch id> true/false, v.<choice id>
             the chosen value, v.<point id> = { x, y }
       P     the panels by id (section 4)
       fig   this figure: fig.readout(text) adds a line of text under the plot for this draw
             (text with $...$ maths, numbers through L.fmt)
   fig (the returned object): fig.set(id, value) sets a control or a point ({x, y}) and
   redraws; fig.values() the current values; fig.reset(); fig.redraw().

   ======================================================================================
   4. DRAWING ON A PANEL p (in draw: const p = P.<id>), all in data units

     p.setX([a, b]), p.setY([c, d])   change the range for this draw (call before drawing)
     p.line(xs, ys, o)       a path through the points (a NaN breaks it)
     p.fn(f, o)              the graph of x -> f(x) over the x range (o.n = 200 points, o.from, o.to)
     p.points(xs, ys, o)     dots (o.r = 3 px); thousands are fine
     p.segment(x0, y0, x1, y1, o), p.hline(y, o), p.vline(x, o)   straight lines (default muted)
     p.rect(x0, y0, x1, y1, o)   a rectangle between two corners
     p.bars(xs, ys, o)       bars from o.base = 0 to ys; o.barWidth (default 0.8 of the spacing);
                             o.align 'center' (default) or 'left' (xs = left edges)
     p.steps(xs, ys, o)      a step function: value ys[i] on [xs[i], xs[i+1]] (xs one longer)
     p.area(xs, lo, hi, o)   shaded between two curves; lo or hi may be a number (under a curve:
                             p.area(xs, 0, ys))
     p.hist(data, o)         histogram over o.range (default the x range) with o.bins = 20 (or
                             o.edges); o.density: true scales it to area 1; o.curve: a function
                             (a density) drawn over it; returns { edges, heights }
     p.text(x, y, label, o)  a label at a point: o.anchor 'start'|'middle'|'end' (default
                             middle), o.valign 'baseline'|'middle'|'top', o.dx, o.dy (px), o.small
     p.legend(entries, o)    entries [{ label, color, kind: 'line'|'fill'|'dot', dash }]; o.corner
                             'tr' (default) | 'tl' | 'br' | 'bl'; on a backing in the page colour
     p.x(v), p.y(v) data -> pixel; p.width, p.height, p.left, p.top the plot area in pixels;
     p.svg(tag, attrs) any other SVG element (pixel units; colours through L.css(name))
   Style options o, for every mark: color (lines, outlines, dots, text), fill (areas, bars;
   default: the color's translucent fill), width (line width in px), dash ('4 3'), opacity.
   Marks are cut at the plot area; text and the legend are not.

   ======================================================================================
   5. LABELS WITH MATHS

   KaTeX runs only at build time, so a label in a figure is written in a small part of TeX
   between dollars: 'Hurst index $H$', '$B_t$', '$\\xi_{n+1}$', '$e^{-t}$', '$X \\sim N(0, 1)$'.
   Possible: letters (italic, the page's maths font), digits and + - = < > ( ) [ ] , . | / (upright),
   _ and ^ with one character or a {group} (both on one letter stack as in TeX: '$B^H_t$'), the Greek letters (\\alpha ... \\omega, \\varepsilon,
   \\varphi, \\vartheta; capitals \\Gamma \\Delta \\Theta \\Lambda \\Xi \\Pi \\Sigma \\Phi \\Psi
   \\Omega), \\le \\ge \\ne \\approx \\sim \\in \\to \\mapsto \\equiv \\propto \\pm \\cdot \\times
   \\infty \\partial \\ell \\nabla \\sum \\int \\prod \\dots \\ldots \\mid \\langle \\rangle, \\mathbb{R}
   (also N Z Q C E P), \\text{...} \\mathrm{...} \\operatorname{...} (upright), \\sqrt{x} (as √x),
   \\frac{a}{b} (as a/b), spaces \\, \\; \\quad, and \\{ \\} \\$.
   Not possible: fractions stacked, roots with a bar, accents (hat, bar, tilde), bold, matrices.
   An unknown command is an error (the phone check reports it). Text outside dollars is plain.
   Put heavier notation into the caption, which KaTeX typesets.

   ======================================================================================
   6. HELPERS

     L.rng(seed)        random numbers with a seed: r.unif(), r.normal(), r.unifs(n), r.normals(n).
                        The same seed gives the same draws on every load. Make the draws once,
                        at the top of the file; if draw() needs draws whose number depends on a
                        slider, make a new L.rng(seed) inside draw(): the first k draws are then
                        the same for every k, so a slider changes only what it controls.
     L.seq(a, b, n)     n equally spaced numbers from a to b
     L.sum(a), L.mean(a), L.cumsum(a), L.clamp(x, a, b)
     L.edges(a, b, bins), L.histogram(data, edges) -> counts
     L.dnorm(x, m = 0, s = 1), L.pnorm(x, m = 0, s = 1)   normal density and distribution function
     L.cholesky(K) -> lower triangular C with C C^T = K;  L.matvec(C, z) -> C z
                        (a Gaussian vector with covariance K from standard normal draws z)
     L.fmt(x, d = 2)    x with d decimals and a true minus sign ("−0.42")
     L.css(name)        a theme colour for p.svg: 'var(--c-a)'
     L.color(name)      the colour's current value ('#1f5fbf'), for the rare case that needs it

   ======================================================================================
   7. RULES (STYLE.md, "Interactive figures")

   - Colours: only theme colours, by name: 'a' ... 'f' (six series colours), 'a-fill' ...
     'f-fill' (their translucent fills), 'fg' (text), 'muted', 'rule', 'bg'. Any other colour
     is an error, and render.mjs warns about a literal colour (#..., rgb(...)) in a script.
     They follow the theme (default or fsu) and light and dark mode by themselves. The hues
     differ between themes (slot a is blue in the default theme, magenta in fsu), so a caption
     names a mark by what it is ("the shaded area", "the dashed line") or by the legend, never
     by its hue.
   - Size: the figure takes the column's width (361 px on a phone, at most 800 px on a laptop);
     each panel keeps its aspect. Text is 15 px on a phone and 17 px wider (ticks 13 and 15 px,
     sub- and superscripts at least 13 px). Keep labels short: a phone has room for about
     35 characters across.
   - Seeds: every random number comes from L.rng with a fixed seed.
   - Every interactive figure has a closed fold "How it is computed" right after it.
   - Check: node phone-check.js page.html moves every slider to its ends, flips every switch,
     picks every option and drags every point to its limits, in light and dark mode, and
     reports script errors (with the figure's id) and any widening of the page.
*/
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const L = (window.LiveFig = {});
  L.errors = [];     // { fig, message } for every error, read by phone-check.js
  L.figures = [];    // every figure made by L.figure, for the checks

  /* ---------- errors: kept, logged with the figure's id, and shown in the figure ---------- */
  function fail(id, e, host) {
    const message = String((e && e.message) || e);
    L.errors.push({ fig: id, message });
    console.error('livefig #' + id + ': ' + message);
    if (host) {
      let box = host.querySelector('.lf-error');
      if (!box) { box = document.createElement('p'); box.className = 'lf-error'; host.appendChild(box); }
      box.textContent = 'This figure has an error: ' + message;
    }
  }
  // the wrapper render.mjs writes around each figure script
  L.run = (id, fn) => {
    const fig = document.getElementById(id);
    const host = fig && fig.querySelector('.live-host');
    try {
      if (!host) throw new Error('no interactive figure with id ' + id);
      fn(host, L);
    } catch (e) { fail(id, e, host); }
  };

  /* ---------- numbers ---------- */
  L.fmt = (x, d = 2) => {
    if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '–';
    let s = x.toFixed(d);
    if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
    return s.replace('-', '−');
  };
  L.seq = (a, b, n) => Array.from({ length: n }, (_, i) => (n === 1 ? a : a + (b - a) * i / (n - 1)));
  L.sum = a => a.reduce((s, x) => s + x, 0);
  L.mean = a => L.sum(a) / a.length;
  L.cumsum = a => { let s = 0; return a.map(x => (s += x)); };
  L.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  L.edges = (a, b, bins) => L.seq(a, b, bins + 1);
  L.histogram = (data, edges) => {
    const k = edges.length - 1, c = new Array(k).fill(0);
    for (const x of data) {
      if (!(x >= edges[0] && x <= edges[k])) continue;
      let lo = 0, hi = k;   // binary search: edges[lo] <= x < edges[lo+1]
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (x >= edges[m]) lo = m; else hi = m; }
      c[lo]++;
    }
    return c;
  };
  L.dnorm = (x, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  // distribution function of N(m, s^2), through erf (Abramowitz and Stegun 7.1.26, error < 1.5e-7)
  L.pnorm = (x, m = 0, s = 1) => {
    const z = (x - m) / (s * Math.SQRT2), t = 1 / (1 + 0.3275911 * Math.abs(z));
    const y = 1 - t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-z * z);
    return 0.5 * (1 + (z >= 0 ? y : -y));
  };
  L.cholesky = K => {
    const n = K.length, C = K.map(() => new Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      let s = K[i][j];
      for (let k = 0; k < j; k++) s -= C[i][k] * C[j][k];
      C[i][j] = i === j ? Math.sqrt(Math.max(s, 0)) : (C[j][j] > 0 ? s / C[j][j] : 0);
    }
    return C;
  };
  L.matvec = (C, z) => C.map(row => row.reduce((s, c, j) => s + c * z[j], 0));

  /* ---------- random numbers with a seed: mulberry32, normals by Box-Muller ---------- */
  L.rng = seed => {
    let a = (seed >>> 0) || 1, spare = null;
    const unif = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const normal = () => {
      if (spare !== null) { const s = spare; spare = null; return s; }
      let u = 0; while (u === 0) u = unif();
      const r = Math.sqrt(-2 * Math.log(u)), th = 2 * Math.PI * unif();
      spare = r * Math.sin(th);
      return r * Math.cos(th);
    };
    return { unif, normal, unifs: n => Array.from({ length: n }, unif), normals: n => Array.from({ length: n }, normal) };
  };

  /* ---------- theme colours, by name only ---------- */
  const TOKENS = { fg: '--fg', muted: '--muted', rule: '--rule', bg: '--bg' };
  for (const k of 'abcdef') { TOKENS[k] = '--c-' + k; TOKENS[k + '-fill'] = '--c-' + k + '-fill'; }
  L.css = name => {
    if (name === 'none') return 'none';
    if (!TOKENS[name]) throw new Error('colour "' + name + '" is not a theme colour (a to f, a-fill to f-fill, fg, muted, rule, bg)');
    return 'var(' + TOKENS[name] + ')';
  };
  L.color = name => (name === 'none' ? 'none' : getComputedStyle(document.documentElement).getPropertyValue(TOKENS[name] || L.css(name)).trim());

  /* ---------- labels: a small part of TeX, turned into runs of text ----------
     A run is { t: text, v: italic (a variable), sh: shift down in em of the base size,
     sm: smaller (a sub- or superscript) }. Two writers below turn runs into HTML or SVG. */
  const GREEK = {}, UPPER = {};
  'alpha α beta β gamma γ delta δ epsilon ϵ varepsilon ε zeta ζ eta η theta θ vartheta ϑ iota ι kappa κ lambda λ mu μ nu ν xi ξ pi π rho ρ varrho ϱ sigma σ tau τ upsilon υ phi ϕ varphi φ chi χ psi ψ omega ω'
    .split(' ').forEach((w, i, a) => { if (i % 2 === 0) GREEK[w] = a[i + 1]; });
  'Gamma Γ Delta Δ Theta Θ Lambda Λ Xi Ξ Pi Π Sigma Σ Upsilon Υ Phi Φ Psi Ψ Omega Ω'
    .split(' ').forEach((w, i, a) => { if (i % 2 === 0) UPPER[w] = a[i + 1]; });
  const REL = { le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', sim: '∼', in: '∈',
    to: '→', mapsto: '↦', equiv: '≡', propto: '∝', subset: '⊂', mid: '|' };
  const BIN = { pm: '±', cdot: '⋅', times: '×' };
  const ORD = { infty: '∞', partial: '∂', ell: 'ℓ', nabla: '∇', sum: '∑', int: '∫', prod: '∏', dots: '…',
    ldots: '…', langle: '⟨', rangle: '⟩', lvert: '|', rvert: '|' };
  const BB = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', E: '𝔼', P: 'ℙ' };
  const SPACE = { ',': ' ', ';': ' ', ':': ' ', '!': '', ' ': ' ', quad: ' ', qquad: '  ' };
  const RELSP = ' ', BINSP = ' ';   // three- and four-per-em spaces, close to TeX's spacing

  // A script (after _ or ^) is a group: its runs carry grp (an id) and kind ('_' or '^'). A
  // subscript right after a superscript of the same letter, or the other way round, stacks under
  // it as in TeX ($B^H_t$): its first run carries back = the id of the script it stacks on.
  let grpN = 0;
  function parseMath(src, runs) {
    let i = 0, last = 'open';   // the kind of the last atom: open, ord, rel, bin (for unary minus)
    const push = (t, v, lv) => {
      const back = lv.back !== undefined && !lv.backDone ? lv.back : undefined;
      if (back !== undefined) lv.backDone = true;
      runs.push({ t, v, sh: lv.sh, sm: lv.sm, grp: lv.grp, kind: lv.kind, back });
    };
    const rel = (ch, lv) => { push(lv.sm ? ch : RELSP + ch + RELSP, false, lv); last = 'rel'; };
    const bin = (ch, lv) => {
      const unary = last === 'open' || last === 'rel' || last === 'bin';
      push(unary || lv.sm ? ch : BINSP + ch + BINSP, false, lv); last = unary ? 'ord' : 'bin';
    };
    const arg = () => {   // a {group} or one character, as raw text
      while (src[i] === ' ') i++;
      if (src[i] !== '{') return src[i++] || '';
      let depth = 0, s = '';
      for (i++; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && depth-- === 0) { i++; break; }
        s += src[i];
      }
      return s;
    };
    const sub = (text, lv) => { const keep = [src, i]; src = text; i = 0; group(lv); [src, i] = keep; };
    function atom(lv) {
      const c = src[i];
      if (c === ' ') { i++; return; }
      if (c !== '_' && c !== '^') lv.prev = null;   // a script stacks only right after a script
      if (c === '{') { i++; group(lv); if (src[i] === '}') i++; last = 'ord'; return; }
      if (c === '_' || c === '^') {
        i++;
        const top = lv.grp === undefined;   // stacking only for scripts of the base line
        const on = top && lv.prev && lv.prev.kind !== c ? lv.prev.grp : undefined;
        const g = top ? ++grpN : lv.grp;
        const lv2 = { sh: lv.sh + (c === '_' ? (on !== undefined ? 0.3 : 0.22) : -0.42) * (lv.sm ? 0.75 : 1), sm: true,
          grp: g, kind: top ? c : lv.kind, back: on };
        while (src[i] === ' ') i++;
        atom(lv2);
        lv.prev = top && on === undefined ? { kind: c, grp: g } : null;
        last = 'ord';
        return;
      }
      if (c === '\\') {
        i++;
        let name = (src.slice(i).match(/^[A-Za-z]+/) || [''])[0];
        if (!name) name = src[i] || '';
        i += name.length;
        if (GREEK[name]) { push(GREEK[name], true, lv); last = 'ord'; }
        else if (UPPER[name]) { push(UPPER[name], false, lv); last = 'ord'; }
        else if (REL[name]) rel(REL[name], lv);
        else if (BIN[name]) bin(BIN[name], lv);
        else if (ORD[name]) { push(ORD[name], false, lv); last = 'ord'; }
        else if (name in SPACE) push(SPACE[name], false, lv);
        else if (name === 'mathbb') { push(arg().split('').map(ch => BB[ch] || ch).join(''), false, lv); last = 'ord'; }
        else if (/^(text|textrm|mathrm|operatorname)$/.test(name)) { push(arg(), false, lv); last = 'ord'; }
        else if (name === 'sqrt') { push('√', false, lv); sub(arg(), lv); last = 'ord'; }
        else if (name === 'frac') { const a = arg(), b = arg(); sub(a, lv); push('/', false, lv); sub(b, lv); last = 'ord'; }
        else if ('{}$%&#_'.includes(name)) { push(name, false, lv); last = name === '{' ? 'open' : 'ord'; }
        else throw new Error('label "' + src + '": \\' + name + ' is not possible in a figure label (livefig.js, section 5)');
        return;
      }
      i++;
      if (/[A-Za-z]/.test(c)) { push(c, true, lv); last = 'ord'; }
      else if (c === '-') bin('−', lv);
      else if (c === '+') bin('+', lv);
      else if (c === '*') bin('∗', lv);
      else if ('=<>:'.includes(c)) rel(c, lv);
      else if (c === ',') { push(lv.sm ? ',' : ', ', false, lv); last = 'open'; }
      else if (c === "'") { push('′', false, lv); last = 'ord'; }
      else if (c === '~') push(' ', false, lv);
      else { push(c, false, lv); last = '([|'.includes(c) && last !== 'ord' ? 'open' : 'ord'; }
    }
    function group(lv) { while (i < src.length && src[i] !== '}') atom(lv); }
    while (i < src.length) { group({ sh: 0, sm: false }); if (src[i] === '}') i++; }   // a stray } is skipped
  }
  function parseLabel(s) {
    const runs = [];
    // split at unescaped $: even parts are text, odd parts maths
    const parts = [''];
    s = String(s);
    for (let k = 0; k < s.length; k++) {
      if (s[k] === '\\' && s[k + 1] === '$') { parts[parts.length - 1] += '\\$'; k++; }
      else if (s[k] === '$') parts.push('');
      else parts[parts.length - 1] += s[k];
    }
    parts.forEach((p, k) => {
      if (k % 2) parseMath(p, runs);
      else if (p) runs.push({ t: p.replace(/\\\$/g, '$'), v: false, sh: 0, sm: false, plain: true });
    });
    // merge neighbours of the same style
    const out = [];
    for (const r of runs) {
      const q = out[out.length - 1];
      if (q && q.v === r.v && q.sh === r.sh && q.sm === r.sm && !q.plain === !r.plain && q.grp === r.grp && r.back === undefined) q.t += r.t;
      else if (r.t) out.push({ ...r });
    }
    return out;
  }
  L.parseLabel = parseLabel;   // for tests
  // HTML for a label (controls, readouts): spans, the maths in KaTeX's fonts
  // (stacked scripts: a box of two rows, superscript above, subscript below)
  function labelHtml(s) {
    const frag = document.createDocumentFragment();
    const spans = {}, row = {}, base = {};   // per script group: its spans, its row in a stack, its shift
    for (const r of parseLabel(s)) {
      const sp = document.createElement('span');
      sp.textContent = r.t;
      if (!r.plain) sp.className = r.v ? 'lf-m lf-v' : 'lf-m';
      if (r.sm) { sp.classList.add('lf-s'); sp.style.top = (r.sh / 0.78).toFixed(3) + 'em'; }
      if (r.grp !== undefined && base[r.grp] === undefined) base[r.grp] = r.sh;
      if (r.back !== undefined && spans[r.back]) {
        const box = document.createElement('span'), up = document.createElement('span'), dn = document.createElement('span');
        box.className = 'lf-stack';
        box.append(up, dn);
        frag.insertBefore(box, spans[r.back][0]);
        const firstUp = spans[r.back].kind === '^';
        row[r.back] = firstUp ? up : dn;
        row[r.grp] = firstUp ? dn : up;
        for (const x of spans[r.back]) { x.classList.remove('lf-s'); x.style.top = ''; row[r.back].appendChild(x); }
      }
      if (row[r.grp]) {   // inside a stack the row places the script; only deeper scripts move
        sp.classList.remove('lf-s');
        sp.style.top = r.sh === base[r.grp] ? '' : ((r.sh - base[r.grp]) / 0.78).toFixed(3) + 'em';
        row[r.grp].appendChild(sp);
      } else frag.appendChild(sp);
      if (r.grp !== undefined) { (spans[r.grp] = spans[r.grp] || []).push(sp); spans[r.grp].kind = r.kind; }
    }
    return frag;
  }
  // SVG text for a label: one tspan per run, scripts moved with dy
  // (stacked scripts: the second one moves back, with dx, by the measured width of the first;
  // the text after them starts after the wider of the two)
  function labelSvg(textEl, s, fs) {
    let sh = 0, prev;
    const small = Math.max(13, Math.round(fs * 0.78)), width = {}, on = {};
    const len = (ts, r) => { try { return ts.getComputedTextLength() || 0; } catch (e) { return r.t.length * small * 0.5; } };
    for (const r of parseLabel(s)) {
      const ts = document.createElementNS(NS, 'tspan');
      ts.textContent = r.t;
      if (r.v) { ts.setAttribute('font-family', 'KaTeX_Math'); ts.setAttribute('font-style', 'italic'); }
      if (r.sm) ts.setAttribute('font-size', small);
      let dx = 0;
      if (prev && prev.grp !== undefined && on[prev.grp] !== undefined && r.grp !== prev.grp) dx += Math.max(0, width[on[prev.grp]] - width[prev.grp]);
      if (r.back !== undefined) { on[r.grp] = r.back; dx -= width[r.back] || 0; }
      if (dx) ts.setAttribute('dx', dx.toFixed(2));
      const dy = (r.sh - sh) * fs;
      if (dy) ts.setAttribute('dy', dy.toFixed(2));
      sh = r.sh;
      textEl.appendChild(ts);
      if (r.grp !== undefined) width[r.grp] = (width[r.grp] || 0) + len(ts, r);
      prev = r;
    }
  }
  // rough width of a label in px (for margins and legends; no measuring needed)
  const labelWidth = (s, fs) => parseLabel(s).reduce((w, r) => w + r.t.length * fs * (r.sm ? 0.42 : 0.55), 0);

  /* ---------- SVG helpers ---------- */
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const r1 = v => Math.round(v * 10) / 10;
  // "round" tick values: about n of them between a and b
  function niceTicks(a, b, n) {
    const span = b - a;
    if (!(span > 0)) return { vals: [a], step: 1 };
    const raw = span / Math.max(1, n), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    const step = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
    const vals = [];
    for (let k = Math.ceil(a / step - 1e-9); k * step <= b + step * 1e-9; k++) vals.push(Math.abs(k * step) < step * 1e-9 ? 0 : k * step);
    return { vals, step };
  }
  const tickText = (v, step) => L.fmt(v, Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));

  /* ---------- a panel: one SVG, the column's width, a fixed aspect ---------- */
  let clipCount = 0;
  function Panel(fig, spec) {
    const p = this;
    p.spec = spec;
    p.id = spec.id;
    p.aspect = spec.aspect || 0.62;
    p.svgEl = el('svg', { class: 'lf-panel', role: 'img', 'aria-label': 'plot ' + spec.id });
    const defs = el('defs', {}, p.svgEl), clip = el('clipPath', { id: 'lf-clip-' + (++clipCount) }, defs);
    p.clipRect = el('rect', {}, clip);
    p.gAxes = el('g', {}, p.svgEl);
    p.gMarks = el('g', { 'clip-path': 'url(#lf-clip-' + clipCount + ')' }, p.svgEl);
    p.gOver = el('g', {}, p.svgEl);
    p.gHandles = el('g', {}, p.svgEl);
    p.fig = fig;
  }
  Panel.prototype = {
    // margins from the tick labels and axis labels, then the plot area
    layout() {
      const p = this, s = p.spec, fs = p.fig.fs, tfs = p.fig.tfs, ax = s.axes !== false;
      p.W = Math.min(p.fig.width, s.maxWidth || Infinity); p.H = Math.round(p.W * p.aspect);
      const yl = ax ? p.ticks('y').map(t => labelWidth(t[1], tfs)) : [];
      p.left = ax ? Math.max(26, Math.round(Math.max(0, ...yl) + 12)) : 6;
      p.top = s.ylabel ? fs + 14 : 10;
      p.right = 12;
      const bottom = ax ? tfs + 12 + (s.xlabel ? fs + 8 : 0) : 6;
      p.width = p.W - p.left - p.right;
      p.height = Math.max(20, p.H - p.top - bottom);
      p.svgEl.setAttribute('width', p.W);
      p.svgEl.style.width = p.W + 'px';
      p.svgEl.setAttribute('height', p.H);
      p.svgEl.setAttribute('viewBox', '0 0 ' + p.W + ' ' + p.H);
      for (const [k, v] of Object.entries({ x: p.left, y: p.top, width: p.width, height: p.height })) p.clipRect.setAttribute(k, v);
    },
    ticks(axis) {
      const p = this, given = p.spec[axis + 'ticks'], d = axis === 'x' ? p.xd : p.yd;
      if (given) return given.map(t => (Array.isArray(t) ? [t[0], t[1]] : [t, L.fmt(t, Math.max(0, (String(t).split('.')[1] || '').length))]));
      const room = axis === 'x' ? (p.W || 300) / 75 : (p.W || 300) * p.aspect / 48;
      const nt = niceTicks(d[0], d[1], Math.max(2, Math.min(7, Math.round(room))));
      return nt.vals.map(v => [v, tickText(v, nt.step)]);
    },
    begin() {
      const p = this;
      p.xd = p.spec.x.slice(); p.yd = p.spec.y.slice();
      p.layout();
      p.gAxes.replaceChildren(); p.gMarks.replaceChildren(); p.gOver.replaceChildren();
    },
    setX(d) { this.xd = d.slice(); this.layout(); },
    setY(d) { this.yd = d.slice(); this.layout(); },
    x(v) { const p = this; return p.left + (v - p.xd[0]) / (p.xd[1] - p.xd[0]) * p.width; },
    y(v) { const p = this; return p.top + (1 - (v - p.yd[0]) / (p.yd[1] - p.yd[0])) * p.height; },
    xi(px) { const p = this; return p.xd[0] + (px - p.left) / p.width * (p.xd[1] - p.xd[0]); },
    yi(py) { const p = this; return p.yd[0] + (1 - (py - p.top) / p.height) * (p.yd[1] - p.yd[0]); },
    // the style attribute of a mark from its options and the mark's defaults
    style(o, def) {
      o = Object.assign({}, def, o);
      const st = [];
      const color = o.color || def.color || 'a';
      // fill 'auto': the colour's translucent fill (areas, bars, rectangles)
      const fill = o.fill === 'auto' ? (TOKENS[color + '-fill'] ? color + '-fill' : 'none') : o.fill || 'none';
      st.push('fill:' + L.css(fill));
      st.push('stroke:' + (o.stroke === false ? 'none' : L.css(color)));
      st.push('stroke-width:' + (o.width !== undefined ? o.width : def.width !== undefined ? def.width : 2));
      if (o.dash) st.push('stroke-dasharray:' + o.dash);
      if (o.opacity !== undefined) st.push('opacity:' + o.opacity);
      return st.join(';');
    },
    path(d, o, def, parent) { return el('path', { d, style: this.style(o, def), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, parent || this.gMarks); },
    line(xs, ys, o = {}) {
      let d = '', pen = false;
      for (let i = 0; i < xs.length; i++) {
        const X = this.x(xs[i]), Y = this.y(ys[i]);
        if (!isFinite(X) || !isFinite(Y)) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + r1(X) + ',' + r1(Y);
        pen = true;
      }
      return this.path(d || 'M0,0', o, { color: 'a', width: 2 });
    },
    fn(f, o = {}) {
      const xs = L.seq(o.from !== undefined ? o.from : this.xd[0], o.to !== undefined ? o.to : this.xd[1], o.n || 200);
      return this.line(xs, xs.map(f), o);
    },
    points(xs, ys, o = {}) {
      // one path of zero-length round strokes: fast for thousands of dots
      let d = '';
      for (let i = 0; i < xs.length; i++) {
        const X = this.x(xs[i]), Y = this.y(ys[i]);
        if (isFinite(X) && isFinite(Y)) d += 'M' + r1(X) + ',' + r1(Y) + 'h0';
      }
      return this.path(d || 'M0,0', Object.assign({}, o, { width: 2 * (o.r || 3), fill: 'none' }), { color: 'a' });
    },
    segment(x0, y0, x1, y1, o = {}) {
      return this.path('M' + r1(this.x(x0)) + ',' + r1(this.y(y0)) + 'L' + r1(this.x(x1)) + ',' + r1(this.y(y1)), o, { color: 'muted', width: 1.5 });
    },
    hline(y, o = {}) { return this.segment(this.xd[0], y, this.xd[1], y, o); },
    vline(x, o = {}) { return this.segment(x, this.yd[0], x, this.yd[1], o); },
    rect(x0, y0, x1, y1, o = {}) {
      const X0 = this.x(x0), X1 = this.x(x1), Y0 = this.y(y0), Y1 = this.y(y1);
      return el('rect', { x: r1(Math.min(X0, X1)), y: r1(Math.min(Y0, Y1)), width: r1(Math.abs(X1 - X0)), height: r1(Math.abs(Y1 - Y0)),
        style: this.style(o, { color: 'a', width: 1, fill: 'auto' }) }, this.gMarks);
    },
    bars(xs, ys, o = {}) {
      let gap = Infinity;
      for (let i = 1; i < xs.length; i++) gap = Math.min(gap, Math.abs(xs[i] - xs[i - 1]));
      const w = o.barWidth || (isFinite(gap) ? gap * 0.8 : (this.xd[1] - this.xd[0]) / 20);
      const base = o.base || 0, left = o.align === 'left';
      xs.forEach((x, i) => this.rect(left ? x : x - w / 2, base, left ? x + w : x + w / 2, ys[i], o));
    },
    steps(xs, ys, o = {}) {
      let d = '';
      for (let i = 0; i < ys.length; i++) d += 'M' + r1(this.x(xs[i])) + ',' + r1(this.y(ys[i])) + 'H' + r1(this.x(xs[i + 1]));
      return this.path(d || 'M0,0', o, { color: 'a', width: 2.5 });
    },
    area(xs, lo, hi, o = {}) {
      const at = (a, i) => (typeof a === 'number' ? a : a[i]);
      let d = '';
      for (let i = 0; i < xs.length; i++) d += (i ? 'L' : 'M') + r1(this.x(xs[i])) + ',' + r1(this.y(at(hi, i)));
      for (let i = xs.length - 1; i >= 0; i--) d += 'L' + r1(this.x(xs[i])) + ',' + r1(this.y(at(lo, i)));
      return this.path(d + 'Z', Object.assign({ stroke: false }, o), { color: 'a', fill: 'auto', width: 0 });
    },
    hist(data, o = {}) {
      const range = o.range || this.xd;
      const edges = o.edges || L.edges(range[0], range[1], o.bins || 20);
      const counts = L.histogram(data, edges);
      const heights = counts.map((c, i) => (o.density ? c / (data.length * (edges[i + 1] - edges[i])) : c));
      const so = Object.assign({ color: 'a', width: 1 }, o);
      delete so.curve; delete so.curveColor;
      heights.forEach((h, i) => this.rect(edges[i], 0, edges[i + 1], h, so));
      if (o.curve) this.fn(o.curve, { color: o.curveColor || 'fg', width: 2, from: range[0], to: range[1] });
      return { edges, heights };
    },
    text(x, y, label, o = {}) {
      const fs = o.small ? this.fig.tfs : this.fig.fs;
      let dy = o.dy || 0;
      if (o.valign === 'middle') dy += fs * 0.35; else if (o.valign === 'top') dy += fs * 0.8;
      const t = el('text', { x: r1(this.x(x) + (o.dx || 0)), y: r1(this.y(y) + dy), 'text-anchor': o.anchor || 'middle', 'font-size': fs,
        style: 'fill:' + L.css(o.color || 'fg') + (o.opacity !== undefined ? ';opacity:' + o.opacity : '') }, this.gOver);
      labelSvg(t, label, fs);
      return t;
    },
    legend(entries, o = {}) {
      const p = this, fs = p.fig.tfs, lh = Math.round(fs * 1.45), c = o.corner || 'tr';
      const right = c[1] === 'r', bottom = c[0] === 'b';
      // a backing in the page's colour, so that marks under the legend do not cross its text
      const bw = Math.max(...entries.map(e => labelWidth(e.label, fs))) + 18 + 6 + 12;
      const by = bottom ? p.top + p.height - 8 - entries.length * lh - 2 : p.top + 6;
      el('rect', { x: right ? p.left + p.width - 8 - bw + 4 : p.left + 4, y: by, width: bw, height: entries.length * lh + 4, rx: 3,
        style: 'fill:' + L.css('bg') + ';opacity:.85' }, p.gOver);
      entries.forEach((e, k) => {
        const yy = bottom ? p.top + p.height - 8 - (entries.length - 1 - k) * lh - lh / 2 : p.top + 8 + k * lh + lh / 2;
        const sx = right ? p.left + p.width - 8 - 18 : p.left + 8;   // swatch, 18 px wide
        const col = e.color || 'a';
        if (e.kind === 'fill') el('rect', { x: sx, y: yy - 6, width: 18, height: 12, style: 'fill:' + L.css(TOKENS[col + '-fill'] ? col + '-fill' : col) + ';stroke:' + L.css(col) }, p.gOver);
        else if (e.kind === 'dot') el('circle', { cx: sx + 9, cy: yy, r: 4, style: 'fill:' + L.css(col) }, p.gOver);
        else el('path', { d: 'M' + sx + ',' + yy + 'h18', style: 'stroke:' + L.css(col) + ';stroke-width:2.5' + (e.dash ? ';stroke-dasharray:' + e.dash : '') }, p.gOver);
        const t = el('text', { x: right ? sx - 6 : sx + 24, y: yy + fs * 0.35, 'text-anchor': right ? 'end' : 'start', 'font-size': fs, style: 'fill:' + L.css('fg') }, p.gOver);
        labelSvg(t, e.label, fs);
      });
    },
    svg(tag, attrs) { return el(tag, attrs, this.gMarks); },
    // axes, ticks and labels: drawn after draw(), with the ranges draw() chose
    axes() {
      const p = this, s = p.spec, fs = p.fig.fs, tfs = p.fig.tfs, g = p.gAxes;
      if (s.zero) {
        if (p.yd[0] < 0 && p.yd[1] > 0) el('path', { d: 'M' + p.left + ',' + r1(p.y(0)) + 'h' + p.width, style: 'stroke:' + L.css('rule') + ';stroke-width:1' }, g);
        if (p.xd[0] < 0 && p.xd[1] > 0) el('path', { d: 'M' + r1(p.x(0)) + ',' + p.top + 'v' + p.height, style: 'stroke:' + L.css('rule') + ';stroke-width:1' }, g);
      }
      if (s.axes === false) return;
      const ink = 'stroke:' + L.css('muted') + ';stroke-width:1';
      const yb = p.top + p.height;
      el('path', { d: 'M' + p.left + ',' + yb + 'h' + p.width + 'M' + p.left + ',' + p.top + 'v' + p.height, style: ink, fill: 'none' }, g);
      for (const [v, lab] of p.ticks('x')) {
        if (v < p.xd[0] - 1e-9 || v > p.xd[1] + 1e-9) continue;
        const X = r1(p.x(v));
        el('path', { d: 'M' + X + ',' + yb + 'v5', style: ink }, g);
        labelSvg(el('text', { x: X, y: yb + 5 + tfs, 'text-anchor': 'middle', 'font-size': tfs, style: 'fill:' + L.css('muted') }, g), lab, tfs);
      }
      for (const [v, lab] of p.ticks('y')) {
        if (v < p.yd[0] - 1e-9 || v > p.yd[1] + 1e-9) continue;
        const Y = r1(p.y(v));
        el('path', { d: 'M' + p.left + ',' + Y + 'h-5', style: ink }, g);
        labelSvg(el('text', { x: p.left - 7, y: Y + tfs * 0.35, 'text-anchor': 'end', 'font-size': tfs, style: 'fill:' + L.css('muted') }, g), lab, tfs);
      }
      if (s.xlabel) labelSvg(el('text', { x: r1(p.left + p.width / 2), y: yb + 10 + tfs + fs, 'text-anchor': 'middle', 'font-size': fs, style: 'fill:' + L.css('fg') }, g), s.xlabel, fs);
      if (s.ylabel) labelSvg(el('text', { x: 2, y: fs + 2, 'text-anchor': 'start', 'font-size': fs, style: 'fill:' + L.css('fg') }, g), s.ylabel, fs);
    },
  };

  /* ---------- controls under the plot ---------- */
  const decimals = step => Math.max(0, (String(step).split('.')[1] || '').length);
  function makeControl(F, c) {
    const wrap = document.createElement(c.type === 'choice' ? 'div' : 'label');
    wrap.className = 'lf-ctl lf-' + c.type;
    wrap.dataset.label = c.label || c.id;
    if (c.type === 'slider') {
      const row = document.createElement('span'), lab = document.createElement('span'), out = document.createElement('output');
      row.className = 'lf-row'; lab.className = 'lf-lab'; out.className = 'lf-val';
      lab.appendChild(labelHtml(c.label || c.id));
      row.append(lab, document.createTextNode(' = '), out);
      const inp = document.createElement('input');
      Object.assign(inp, { type: 'range', min: c.min, max: c.max, step: c.step || (c.max - c.min) / 100 });
      const d = decimals(inp.step), fmt = c.format || (v => L.fmt(v, d));
      const show = () => { out.replaceChildren(labelHtml(fmt(F.values[c.id]))); };
      F.setters[c.id] = v => { inp.value = v; F.values[c.id] = Number(Number(inp.value).toFixed(d + 2)); show(); };
      inp.addEventListener('input', () => { F.values[c.id] = Number(Number(inp.value).toFixed(d + 2)); show(); F.schedule(); });
      wrap.append(row, inp);
    } else if (c.type === 'switch') {
      const inp = document.createElement('input'), lab = document.createElement('span');
      Object.assign(inp, { type: 'checkbox' });
      inp.setAttribute('role', 'switch');
      lab.className = 'lf-lab';
      lab.appendChild(labelHtml(c.label || c.id));
      F.setters[c.id] = v => { inp.checked = !!v; F.values[c.id] = !!v; };
      inp.addEventListener('change', () => { F.values[c.id] = inp.checked; F.schedule(); });
      wrap.append(inp, lab);
    } else if (c.type === 'choice') {
      const lab = document.createElement('span'), opts = document.createElement('span');
      lab.className = 'lf-lab'; opts.className = 'lf-opts';
      lab.appendChild(labelHtml(c.label || c.id));
      opts.setAttribute('role', 'group');
      const buttons = (c.options || []).map(o => {
        const [val, text] = Array.isArray(o) ? o : [o, String(o)];
        const b = document.createElement('button');
        b.type = 'button';
        b.appendChild(labelHtml(text));
        b.addEventListener('click', () => { F.setters[c.id](val); F.schedule(); });
        opts.appendChild(b);
        return [val, b];
      });
      F.setters[c.id] = v => { F.values[c.id] = v; for (const [val, b] of buttons) b.setAttribute('aria-pressed', String(val === v)); };
      wrap.append(lab, opts);
    } else throw new Error('control "' + c.id + '": type "' + c.type + '" is none of slider, switch, choice');
    F.setters[c.id](c.value !== undefined ? c.value : c.type === 'slider' ? c.min : c.type === 'switch' ? false : (c.options[0] && (Array.isArray(c.options[0]) ? c.options[0][0] : c.options[0])));
    F.init[c.id] = F.values[c.id];
    return wrap;
  }

  /* ---------- points that can be dragged ---------- */
  function makeHandle(F, pt) {
    const p = F.P[pt.panel] || F.panels[0];
    if (!p) throw new Error('point "' + pt.id + '": no panel "' + pt.panel + '"');
    const g = el('g', { class: 'lf-handle', tabindex: 0, 'data-label': 'drag ' + (pt.label || pt.id), 'aria-label': 'drag ' + pt.id }, p.gHandles);
    const col = pt.color || 'a';
    el('circle', { r: 22, class: 'lf-hit', style: 'fill:transparent' }, g);
    el('circle', { r: 7, style: 'fill:' + L.css(col) + ';stroke:' + L.css('bg') + ';stroke-width:2' }, g);
    if (pt.label) el('text', { x: 10, y: -10, style: 'fill:' + L.css(col) }, g);   // written at every draw
    const lim = () => ({ x0: pt.xmin !== undefined ? pt.xmin : p.xd[0], x1: pt.xmax !== undefined ? pt.xmax : p.xd[1],
      y0: pt.ymin !== undefined ? pt.ymin : p.yd[0], y1: pt.ymax !== undefined ? pt.ymax : p.yd[1] });
    // where a wanted position (data units) may go: axis, limits, step, constrain
    const place = (x, y) => { try { place1(x, y); } catch (e) { fail(F.id, e, F.host); } };
    const place1 = (x, y) => {
      const cur = F.values[pt.id], m = lim();
      if (pt.axis === 'x') y = cur.y; else y = L.clamp(y, Math.min(m.y0, m.y1), Math.max(m.y0, m.y1));
      if (pt.axis === 'y') x = cur.x; else x = L.clamp(x, Math.min(m.x0, m.x1), Math.max(m.x0, m.x1));
      if (pt.step) {
        if (pt.axis !== 'y') x = L.clamp(m.x0 + Math.round((x - m.x0) / pt.step) * pt.step, m.x0, m.x1);
        if (pt.axis !== 'x') y = L.clamp(m.y0 + Math.round((y - m.y0) / pt.step) * pt.step, m.y0, m.y1);
      }
      if (pt.constrain) [x, y] = pt.constrain(x, y, F.copy());
      F.values[pt.id] = { x, y };
      F.schedule();
    };
    F.setters[pt.id] = v => { F.values[pt.id] = { x: v.x, y: v.y }; };
    F.placers[pt.id] = place;
    F.limits[pt.id] = lim;
    let off = null;
    const local = e => { const r = p.svgEl.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    g.addEventListener('pointerdown', e => {
      e.preventDefault();
      try { g.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
      const [px, py] = local(e), v = F.values[pt.id];
      off = [p.x(v.x) - px, p.y(v.y) - py];   // keep the grip: the point does not jump to the finger
      g.classList.add('lf-dragging');
    });
    g.addEventListener('pointermove', e => {
      if (!off) return;
      const [px, py] = local(e);
      place(p.xi(px + off[0]), p.yi(py + off[1]));
    });
    const up = () => { off = null; g.classList.remove('lf-dragging'); };
    g.addEventListener('pointerup', up);
    g.addEventListener('pointercancel', up);
    // iPhone: a touch that starts on a point never scrolls the page
    g.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
    g.addEventListener('keydown', e => {
      const m = lim(), v = F.values[pt.id];
      const dx = pt.step || (m.x1 - m.x0) / 50, dy = pt.step || (m.y1 - m.y0) / 50;
      const mv = { ArrowLeft: [-dx, 0], ArrowRight: [dx, 0], ArrowUp: [0, dy], ArrowDown: [0, -dy] }[e.key];
      if (!mv) return;
      e.preventDefault();
      place(v.x + mv[0], v.y + mv[1]);
    });
    F.setters[pt.id]({ x: pt.x, y: pt.y });
    F.init[pt.id] = { x: pt.x, y: pt.y };
    return { pt, p, g };
  }

  /* ---------- the figure ---------- */
  L.figure = (host, spec) => {
    const figEl = host.closest('figure.live');
    const id = (figEl && figEl.id) || '(no id)';
    if (!spec || !Array.isArray(spec.panels) || !spec.panels.length) throw new Error('L.figure: spec.panels needs at least one panel');
    if (typeof spec.draw !== 'function') throw new Error('L.figure: spec.draw must be a function');
    const F = { id, host, spec, values: {}, init: {}, setters: {}, placers: {}, limits: {}, panels: [], P: {}, lines: [], width: 0, raf: 0 };
    F.copy = () => { const v = {}; for (const k in F.values) v[k] = typeof F.values[k] === 'object' ? { ...F.values[k] } : F.values[k]; return v; };

    const root = document.createElement('div');
    root.className = 'lf-root';
    const plots = document.createElement('div');
    plots.className = 'lf-plots';
    const readout = document.createElement('div');
    readout.className = 'lf-readout';
    readout.setAttribute('aria-live', 'polite');
    const controls = document.createElement('div');
    controls.className = 'lf-controls';
    root.append(plots, readout, controls);

    F.fs = 15; F.tfs = 13;
    for (const ps of spec.panels) {
      if (!ps.id || F.P[ps.id]) throw new Error('L.figure: every panel needs its own id');
      if (!ps.x || !ps.y) throw new Error('panel "' + ps.id + '": x and y ranges are needed, x: [a, b], y: [c, d]');
      const p = new Panel(F, ps);
      F.panels.push(p); F.P[ps.id] = p;
      plots.appendChild(p.svgEl);
      p.xd = ps.x.slice(); p.yd = ps.y.slice();
    }
    for (const c of spec.controls || []) {
      if (!c.id || F.setters[c.id]) throw new Error('L.figure: every control needs its own id');
      controls.appendChild(makeControl(F, c));
    }
    F.handles = (spec.points || []).map(pt => {
      if (!pt.id || F.setters[pt.id]) throw new Error('L.figure: every point needs its own id');
      return makeHandle(F, pt);
    });
    if (spec.reset !== false && ((spec.controls || []).length || F.handles.length)) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lf-reset'; b.textContent = 'Reset';
      b.addEventListener('click', () => api.reset());
      controls.appendChild(b);
    }
    // a click on the plot inside a <summary> must not fold the item
    root.addEventListener('click', e => { if (root.closest('summary') && !e.target.closest('input,button,label')) e.preventDefault(); });

    F.draw = () => {
      F.raf = 0;
      const w = Math.floor(host.clientWidth);
      if (w < 60) return;   // not visible (a closed fold): drawn when it opens
      F.width = w;
      F.fs = w < 560 ? 15 : 17; F.tfs = w < 560 ? 13 : 15;
      try {
        for (const p of F.panels) p.begin();
        F.lines = [];
        spec.draw(F.copy(), F.P, api);
        for (const p of F.panels) p.axes();
        for (const h of F.handles) {
          const v = F.values[h.pt.id];
          h.g.setAttribute('transform', 'translate(' + r1(L.clamp(h.p.x(v.x), 0, h.p.W)) + ',' + r1(L.clamp(h.p.y(v.y), 0, h.p.H)) + ')');
          const t = h.g.querySelector('text');
          if (t) { t.replaceChildren(); t.setAttribute('font-size', F.fs); labelSvg(t, h.pt.label, F.fs); }
        }
        readout.replaceChildren(...F.lines.map(s => { const d = document.createElement('div'); d.appendChild(labelHtml(s)); return d; }));
        const err = host.querySelector('.lf-error');
        if (err) err.remove();
      } catch (e) { fail(id, e, host); }
    };
    F.schedule = () => { if (!F.raf) F.raf = requestAnimationFrame(F.draw); };

    const api = {
      id,
      readout: text => { F.lines.push(String(text)); },
      values: () => F.copy(),
      set: (k, v) => { if (!F.setters[k]) throw new Error('no control or point "' + k + '"'); F.setters[k](v); F.schedule(); },
      reset: () => { for (const k in F.init) F.setters[k](F.init[k]); F.schedule(); },
      redraw: () => F.schedule(),
      // for the checks (phone-check.js): every point's limits, and a move as if dragged
      _points: () => F.handles.map(h => ({ id: h.pt.id, label: h.pt.label || h.pt.id, axis: h.pt.axis || 'xy', ...F.limits[h.pt.id]() })),
      _place: (k, x, y) => F.placers[k](x, y),
      _draw: () => F.draw(),
    };

    host.appendChild(root);
    if (figEl) figEl.classList.add('lf-ready');
    // drawn at the first width, again at every new width (a phone turned, a fold opened)
    if (window.ResizeObserver) new ResizeObserver(() => { if (Math.floor(host.clientWidth) !== F.width) F.schedule(); }).observe(host);
    else addEventListener('resize', F.schedule);
    F.schedule();
    L.figures.push(api);
    return api;
  };

  /* ---------- redraw all on a new colour scheme and once the fonts are in ---------- */
  const redrawAll = () => L.figures.forEach(f => f.redraw());
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawAll); } catch (e) { /* old browsers */ }
  new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redrawAll);

  /* ---------- style: the figure, the controls (big enough for a finger), print ---------- */
  const css = `
figure.live{margin:1em 0}
figure.live.lf-ready .live-note{display:none}
.live-note{font-size:.9em;color:var(--muted);border:1px dashed var(--rule);border-radius:4px;padding:.4em .6em;margin:0 0 .4em}
.lf-root{width:100%;max-width:100%;overflow:hidden}
.lf-panel{display:block;max-width:100%;height:auto;margin-inline:auto;font-family:KaTeX_Main,Georgia,serif;white-space:pre;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
.lf-panel text{white-space:pre}
.lf-handle{cursor:grab;touch-action:none;outline:none}
.lf-handle.lf-dragging{cursor:grabbing}
.lf-handle:focus-visible circle.lf-hit{stroke:var(--fg);stroke-width:1.5;stroke-dasharray:3 3}
.lf-m{font-family:KaTeX_Main,Georgia,serif;font-style:normal}
.lf-v{font-family:KaTeX_Math,KaTeX_Main,Georgia,serif;font-style:italic}
.lf-s{font-size:max(13px,.78em);position:relative;line-height:0}
.lf-stack{display:inline-flex;flex-direction:column;vertical-align:.6em;font-size:max(13px,.78em);line-height:1.05}
.lf-stack>span{display:block}
.lf-stack span{position:relative}
.lf-readout{font-size:.9em;margin:.25em 0 .1em;font-variant-numeric:tabular-nums}
.lf-readout:empty{display:none}
.lf-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14em),1fr));gap:.35em 1.2em;align-items:end;margin:.3em 0 .5em;font-size:.88em}
.lf-ctl{display:flex;flex-direction:column;gap:.1em;min-width:0}
.lf-row{font-variant-numeric:tabular-nums}
.lf-ctl input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:36px;margin:0;background:transparent;cursor:pointer}
.lf-ctl input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:var(--rule)}
.lf-ctl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-10px;border-radius:50%;background:var(--accent,var(--link));border:2px solid var(--bg);box-shadow:0 0 0 1px var(--rule)}
.lf-ctl input[type=range]::-moz-range-track{height:6px;border-radius:3px;background:var(--rule)}
.lf-ctl input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--accent,var(--link));border:2px solid var(--bg)}
.lf-switch{flex-direction:row;align-items:center;gap:.5em;min-height:36px;cursor:pointer}
.lf-switch input{-webkit-appearance:none;appearance:none;flex:none;width:44px;height:26px;margin:0;border-radius:13px;background:var(--rule);position:relative;cursor:pointer;transition:background .15s}
.lf-switch input::before{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--bg);transition:left .15s}
.lf-switch input:checked{background:var(--accent,var(--link))}
.lf-switch input:checked::before{left:21px}
.lf-opts{display:flex;flex-wrap:wrap;gap:4px}
.lf-opts button,.lf-reset{font:inherit;color:var(--fg);background:var(--code-bg);border:1px solid var(--rule);border-radius:4px;min-height:36px;padding:.2em .7em;cursor:pointer}
.lf-opts button[aria-pressed=true]{background:var(--accent,var(--link));border-color:var(--accent,var(--link));color:var(--bg)}
.lf-reset{justify-self:start;align-self:end;color:var(--muted)}
.lf-error{font-size:.85em;color:var(--fg);border-left:3px solid var(--sol,var(--muted));padding-left:.5em}
figure.live figcaption p{margin:.4em 0}
@media print{figure.live .lf-root{display:none!important}figure.live .live-note{display:block!important}}`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();

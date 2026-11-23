/* lib.js: drawing helpers for the pictures. Everything hangs on window.lib. Coordinates are SVG
   user units, which equal px of the 1920 x 1080 slide.

   svg(host, w, h)             an SVG element (class anim-svg) filling the host, viewBox 0 0 w h
   el(parent, tag, attrs)      create an SVG child; set(node, attrs) sets attributes (null removes)
   scale(d0, d1, r0, r1)       linear map from data to px, with .inv
   curve(pts)                  path d-string through [[x, y], ...]
   arrow(g, o) / arrowSet(h, o)  an arrow drawn up to a fraction o.draw (0..1), optionally bent
   label(ctx, id, x, y, alpha, anchor)  place the host's HTML label <span class="lbl" data-lbl=id>
   labels(host)                {id: node} of the host's labels
   axes(g, o)                  two axes with ticks
   normalPdf(x, m, v)          normal density, v = variance
   ellipsePath(mean, cov, r, sx, sy)  contour of a bivariate normal at r standard deviations
   rng(seed), normal(r)        seeded uniform generator (mulberry32) and a standard normal draw
   fmt(x)                      x rounded to 2 decimals, for path strings
   COLORS, col(name), fill(name), readColors()

   COLOURS. Pictures never contain a fixed colour, not even white. lib.COLORS holds the current
   theme's values (theme.css): bg, ink, muted, mutedText, data, dataFill, box, the slots a..f and
   aFill..fFill, plus every alias of config.json "colors" (alias -> slot), with aliasFill.
   col(name) gives a colour by name (or passes a CSS colour through); fill(name) its fill.
   theme.js calls readColors() on a switch; the engine then rebuilds the pictures.
*/
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const SLOTS = ["a", "b", "c", "d", "e", "f"];
  const BASE = ["bg", "ink", "muted", "mutedText", "data", "dataFill", "box"];
  const ALIASES = (window.DECK_CONFIG && window.DECK_CONFIG.colors) || {};
  const COLORS = {};
  const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (name) => cs.getPropertyValue("--c-" + name).trim();
    BASE.forEach((k) => (COLORS[k] = v(kebab(k))));
    SLOTS.forEach((s) => { COLORS[s] = v(s); COLORS[s + "Fill"] = v(s + "-fill"); });
    for (const a in ALIASES) {
      const s = ALIASES[a];
      if (!SLOTS.includes(s)) { console.error(`config colors: "${a}" points to "${s}", not a slot a..f`); continue; }
      COLORS[a] = COLORS[s];
      COLORS[a + "Fill"] = COLORS[s + "Fill"];
    }
    return COLORS;
  }
  readColors();
  const col = (c) => COLORS[c] || c || COLORS.ink;
  const fill = (c) => COLORS[c + "Fill"] || "none";

  function set(node, attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined) node.removeAttribute(k);
      else node.setAttribute(k, v);
    }
    return node;
  }
  function el(parent, tag, attrs) {
    const n = document.createElementNS(NS, tag);
    if (attrs) set(n, attrs);
    if (parent) parent.appendChild(n);
    return n;
  }
  function svg(host, w, h) {
    const s = el(null, "svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, class: "anim-svg" });
    host.insertBefore(s, host.firstChild);
    return s;
  }
  function scale(d0, d1, r0, r1) {
    const f = (x) => r0 + ((x - d0) / (d1 - d0)) * (r1 - r0);
    f.inv = (y) => d0 + ((y - r0) / (r1 - r0)) * (d1 - d0);
    return f;
  }
  const fmt = (x) => (Math.round(x * 100) / 100).toString();
  const curve = (pts) => pts.map((p, i) => (i ? "L" : "M") + fmt(p[0]) + " " + fmt(p[1])).join("");

  function normalPdf(x, m, v) {
    return Math.exp(-((x - m) * (x - m)) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
  }
  /* mean [mx, my], cov [[a, b], [b, c]] in data units; sx, sy map data -> px */
  function ellipsePath(mean, cov, r, sx, sy) {
    const a = cov[0][0], b = cov[0][1], c = cov[1][1];
    const l11 = Math.sqrt(a), l21 = b / l11, l22 = Math.sqrt(Math.max(c - l21 * l21, 0));
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = (2 * Math.PI * i) / 120, u = Math.cos(t) * r, w = Math.sin(t) * r;
      pts.push([sx(mean[0] + l11 * u), sy(mean[1] + l21 * u + l22 * w)]);
    }
    return curve(pts) + "Z";
  }

  /* o = {x1, y1, x2, y2, color, width, draw (0..1, default 1), dash, bend, head (false: none)}.
     bend: sideways offset of a quadratic curve's control point, px. Returns handles {line, head};
     arrowSet returns {mid, end}, points on the drawn part. */
  function arrow(g, o) {
    const h = { line: el(g, "path", { fill: "none" }), head: el(g, "path", {}) };
    arrowSet(h, o);
    return h;
  }
  function arrowSet(h, o) {
    const c = col(o.color), w = o.width || 3, d = o.draw === undefined ? 1 : o.draw;
    const dx = o.x2 - o.x1, dy = o.y2 - o.y1, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len, bend = o.bend || 0;
    const cx = (o.x1 + o.x2) / 2 + nx * bend, cy = (o.y1 + o.y2) / 2 + ny * bend;
    const P = (t) => [(1 - t) * (1 - t) * o.x1 + 2 * (1 - t) * t * cx + t * t * o.x2,
                      (1 - t) * (1 - t) * o.y1 + 2 * (1 - t) * t * cy + t * t * o.y2];
    const D = (t) => [2 * (1 - t) * (cx - o.x1) + 2 * t * (o.x2 - cx), 2 * (1 - t) * (cy - o.y1) + 2 * t * (o.y2 - cy)];
    const N = 40, pts = [];
    for (let i = 0; i <= N; i++) pts.push(P((d * i) / N));
    const hs = o.head === false ? 0 : 7 + 3 * w;
    const end = pts[pts.length - 1], tan = D(Math.max(d, 1e-3)), tl = Math.hypot(tan[0], tan[1]) || 1;
    const ux = tan[0] / tl, uy = tan[1] / tl;
    const linePts = pts.slice();
    if (hs && d > 0) linePts[linePts.length - 1] = [end[0] - ux * hs * 0.8, end[1] - uy * hs * 0.8];
    set(h.line, { d: d > 0 ? curve(linePts) : "M0 0", stroke: c, "stroke-width": w,
                  "stroke-dasharray": o.dash || null, "stroke-linecap": "round" });
    if (hs && d > 0) {
      const bx = end[0] - ux * hs, by = end[1] - uy * hs, pw = hs * 0.5;
      set(h.head, { d: `M${fmt(end[0])} ${fmt(end[1])}L${fmt(bx + uy * pw)} ${fmt(by - ux * pw)}L${fmt(bx - uy * pw)} ${fmt(by + ux * pw)}Z`,
                    fill: c, opacity: d > 0.02 ? 1 : 0 });
    } else set(h.head, { d: "M0 0" });
    return { mid: P(d * 0.5), end };
  }

  /* anchor: "c" (centre, default), "l" (left edge at x), "r", "t" (top edge at y), "b", or two
     letters such as "lb". alpha 0 hides the label. */
  function label(ctx, id, x, y, alpha, anchor) {
    const n = ctx.labels && ctx.labels[id];
    if (!n) return;
    const a = anchor || "c";
    const tx = a.includes("l") ? "0%" : a.includes("r") ? "-100%" : "-50%";
    const ty = a.includes("t") ? "0%" : a.includes("b") ? "-100%" : "-50%";
    n.style.left = x + "px";
    n.style.top = y + "px";
    n.style.transform = `translate(${tx}, ${ty})`;
    n.style.opacity = alpha === undefined ? 1 : alpha;
    n.style.visibility = alpha === 0 ? "hidden" : "visible";
  }
  function labels(host) {
    const out = {};
    host.querySelectorAll("[data-lbl]").forEach((n) => (out[n.dataset.lbl] = n));
    return out;
  }

  /* o = {x0, x1, y0, y1: the px box; xticks: [values], xs: value -> px, xfmt(v) -> text;
          yticks, ys, yfmt}. The axes meet at the bottom left (x0, y1). */
  function axes(g, o) {
    const minus = (v) => String(v).replace("-", "−");
    el(g, "line", { x1: o.x0, y1: o.y1, x2: o.x1, y2: o.y1, class: "axis" });
    el(g, "line", { x1: o.x0, y1: o.y0, x2: o.x0, y2: o.y1, class: "axis" });
    (o.yticks || []).forEach((v) => {
      el(g, "line", { x1: o.x0 - 10, x2: o.x0, y1: o.ys(v), y2: o.ys(v), class: "axis" });
      const t = el(g, "text", { x: o.x0 - 16, y: o.ys(v) + 9, class: "tick", "text-anchor": "end" });
      t.textContent = o.yfmt ? o.yfmt(v) : minus(v);
    });
    (o.xticks || []).forEach((v) => {
      el(g, "line", { x1: o.xs(v), x2: o.xs(v), y1: o.y1, y2: o.y1 + 10, class: "axis" });
      const t = el(g, "text", { x: o.xs(v), y: o.y1 + 42, class: "tick", "text-anchor": "middle" });
      t.textContent = o.xfmt ? o.xfmt(v) : minus(v);
    });
  }

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(r) {
    const u = 1 - r(), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  window.lib = { NS, SLOTS, COLORS, readColors, col, fill, set, el, svg, scale, fmt, curve, normalPdf, ellipsePath,
                 arrow, arrowSet, label, labels, axes, rng, normal };
})();

/* anim-shapes.js: example picture. Three bars grow one step at a time; at the last step an arrow
   is drawn from the first bar to the last. Shows setup / state / draw, labels, colours by name,
   and a tween longer than the default (opts.tweenMs). */
Deck.anim("shapes", {
  setup(host, opts) {
    const { w, h } = Deck.size(host);
    const svg = lib.svg(host, w, h);
    const ctx = { w, h, labels: lib.labels(host), bars: [] };
    ctx.base = lib.el(svg, "line", { x1: 40, x2: w - 40, y1: h - 80, y2: h - 80, class: "axis" });
    ["a", "b", "c"].forEach((c) => ctx.bars.push(lib.el(svg, "rect", { fill: lib.fill(c), stroke: lib.col(c), "stroke-width": 4 })));
    ctx.arrow = lib.arrow(svg, { x1: 0, y1: 0, x2: 0, y2: 0, color: "ink", width: 4, draw: 0 });
    return ctx;
  },
  // every drawn number for state k; the arrays keep their length in every state
  state(k, opts) {
    const hs = opts.heights || [200, 320, 440];
    return {
      heights: hs.map((v, i) => (k >= i + 1 ? v : 24)),
      alpha: hs.map((_, i) => (k >= i + 1 ? 1 : 0)),
      arrow: k >= 4 ? 1 : 0,
    };
  },
  draw(ctx, S) {
    const bw = 160, gap = 120, x0 = (ctx.w - 3 * bw - 2 * gap) / 2, yb = ctx.h - 80;
    S.heights.forEach((v, i) => {
      const x = x0 + i * (bw + gap);
      lib.set(ctx.bars[i], { x, y: yb - v, width: bw, height: v });
      lib.label(ctx, "bar" + i, x + bw / 2, yb - v - 16, S.alpha[i], "b");
    });
    lib.arrowSet(ctx.arrow, { x1: x0 + bw / 2, y1: yb - S.heights[0] - 70, x2: x0 + 2 * (bw + gap) + bw / 2,
                              y2: yb - S.heights[2] - 70, color: "ink", width: 4, draw: S.arrow, bend: -60 });
  },
});
Deck.opts("shapes-main", { heights: [200, 320, 440], tweenMs: { 4: 900 } });

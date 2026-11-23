/* anim-wave.js: example picture for live controls. A wave A sin(f x) is drawn from left to right;
   its first crest is marked. live-wave.js changes A and f at the last state. */
const WAVE = { A: 1, f: 1, xmax: 2 * Math.PI, ymax: 2.2 };
Deck.anim("wave", {
  setup(host, opts) {
    const { w, h } = Deck.size(host);
    const svg = lib.svg(host, w, h);
    const ctx = { labels: lib.labels(host) };
    ctx.xs = lib.scale(0, WAVE.xmax, 90, w - 30);
    ctx.ys = lib.scale(-WAVE.ymax, WAVE.ymax, h - 60, 20);
    lib.axes(svg, { x0: 90, x1: w - 30, y0: 20, y1: h - 60, xs: ctx.xs, ys: ctx.ys, yticks: [-2, -1, 0, 1, 2], xticks: [] });
    ctx.zero = lib.el(svg, "line", { x1: 90, x2: w - 30, y1: ctx.ys(0), y2: ctx.ys(0), stroke: lib.col("muted"), "stroke-width": 2, "stroke-dasharray": "6 8" });
    ctx.path = lib.el(svg, "path", { fill: "none", stroke: lib.col("wave"), "stroke-width": 5, "stroke-linejoin": "round" });
    ctx.crest = lib.el(svg, "circle", { r: 12, fill: lib.col("crest") });
    return ctx;
  },
  state(k, opts) {
    return { A: WAVE.A, f: WAVE.f, draw: k >= 1 ? 1 : 0, crest: k >= 2 ? 1 : 0 };
  },
  draw(ctx, S) {
    const N = 240, pts = [];
    for (let i = 0; i <= N * S.draw; i++) {
      const x = (WAVE.xmax * i) / N;
      pts.push([ctx.xs(x), ctx.ys(S.A * Math.sin(S.f * x))]);
    }
    lib.set(ctx.path, { d: pts.length > 1 ? lib.curve(pts) : "M0 0" });
    const cx = Math.PI / (2 * S.f), cy = S.A;
    lib.set(ctx.crest, { cx: ctx.xs(cx), cy: ctx.ys(cy), opacity: S.crest });
    lib.label(ctx, "crest", ctx.xs(cx) + 22, ctx.ys(cy) - 14, S.crest, "lb");
  },
});
Deck.opts("wave-main", { tweenMs: { 1: 1500 } });

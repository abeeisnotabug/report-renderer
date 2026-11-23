/* live-wave.js: example live controls. A slider for the frequency f and a draggable crest for
   the amplitude A; a readout of the crest's position. */
Deck.live("wave", {
  panel: { left: 1180, top: 650, width: 640 },
  hint: "drag the crest up or down",
  controls: [
    { id: "f", label: "frequency " + Deck.liveFmt.m(Deck.liveFmt.i("f")), color: "wave", kind: "slider",
      min: 0.5, max: 3, step: 0.1, fixed: 1, fmt: (x) => Deck.liveFmt.fx(x, 1) },
    { id: "A", label: "amplitude " + Deck.liveFmt.m(Deck.liveFmt.i("A")), color: "crest", kind: "drag",
      min: 0.2, max: 2, step: 0.05, fixed: 1, fmt: (x) => Deck.liveFmt.fx(x, 2) },
  ],
  setup(X) {
    X.readout("pos", { after: X.$("[data-ro-after]"), color: "crest" });
  },
  compute(v) {
    return { x: Math.PI / (2 * v.f), y: v.A };
  },
  draw(X, v) {
    const S = X.S(0);
    S.A = v.A;
    S.f = v.f;
    X.draw(0, S);
  },
  readouts(X, v, c) {
    const F = Deck.liveFmt;
    X.ro("pos", `crest at (${F.fx(c.x, 2)}, ${F.fx(c.y, 2)})`);
  },
  drags: [{
    id: "A", anim: 0,
    pos: (X, v) => { const ctx = X.anim(0).ctx; return [ctx.xs(Math.PI / (2 * v.f)), ctx.ys(v.A)]; },
    value: (X, x, y) => X.anim(0).ctx.ys.inv(y),
  }],
});

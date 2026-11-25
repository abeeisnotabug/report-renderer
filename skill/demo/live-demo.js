// live-demo.js: the interactive figure of demo.md (markup and API: the top of livefig.js).
// 400 fixed standard normal draws z, scaled to X = sigma z; a slider for sigma, a point a dragged
// along the axis, the area P(X <= a) shaded under the density, a switch for the histogram.
const z = L.rng(7).normals(400);               // the draws: once, so the slider only rescales them

L.figure(host, {
  panels: [{ id: 'dens', aspect: 0.62, x: [-4, 4], y: [0, 0.85], xlabel: '$x$', ylabel: 'density' }],
  controls: [
    { type: 'slider', id: 'sigma', label: '$\\sigma$', min: 0.5, max: 2, step: 0.05, value: 1 },
    { type: 'switch', id: 'hist', label: 'histogram of the 400 draws', value: true },
  ],
  points: [{ id: 'a', panel: 'dens', x: 1, y: 0, axis: 'x', xmin: -3.5, xmax: 3.5, label: '$a$', color: 'b' }],
  draw(v, P, fig) {
    const p = P.dens, s = v.sigma, a = v.a.x;
    const f = x => L.dnorm(x, 0, s);
    if (v.hist) p.hist(z.map(zi => s * zi), { bins: 32, density: true, color: 'c' });
    const xs = L.seq(-4, a, 120);
    p.area(xs, 0, xs.map(f), { color: 'b' });
    p.fn(f, { color: 'a', width: 2.5 });
    p.vline(a, { color: 'b', dash: '4 3' });
    p.legend([{ label: '$N(0, \\sigma^2)$ density', color: 'a' }, { label: '$P(X \\le a)$', color: 'b', kind: 'fill' }]);
    const share = z.filter(zi => s * zi <= a).length / z.length;
    fig.readout('$P(X \\le a) = ' + L.fmt(L.pnorm(a, 0, s), 3) + '$; share of the draws $\\le a$: ' + L.fmt(share, 3));
  },
});

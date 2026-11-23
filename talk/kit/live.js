/* live.js: live controls at a slide's last state. Loaded after engine.js; a deck defines its
   controls in files live-*.js.

   WHAT IT DOES. A slide with data-live="name" gets, at its last state only, a panel of sliders
   and, in its pictures, points that can be dragged. Moving one recomputes the pictures, the
   readouts and any swapped text in the browser. "reset" restores the fixed values. Any move of
   the deck (a key, a jump, the overview) resets the controls, so every state shows the fixed
   picture when arrived at. At all other states the panel, the readouts and the drag handles are
   hidden (the slide lacks the class "live-on").

   HOW A PICTURE IS DRAWN LIVE. Through the picture's own draw(): the definition takes state(K)
   of the slide's picture (X.S(j)), changes its numbers and calls X.draw(j, S'). While all values
   equal the fixed ones, the engine's own drawing of state(K) stands and every swapped text is
   restored, so reset gives exactly the fixed picture. Formulas are never rendered at run time:
   live numbers are plain HTML (Deck.liveFmt.m for formula-like HTML in KaTeX's fonts).

   THREE KINDS OF LIVE TEXT.
     readouts   numbers next to or under an element, or in the panel; visible at the last state,
                always computed (at the fixed values they equal the slide's numbers)
     swaps      a label or table cell whose HTML is replaced while a control is moved and
                restored exactly when not (X.swap, X.swapAttr)
     controls   each shows its current value in the panel

   DEFINITION (in live-<name>.js):
     Deck.live("name", {
       panel: {left, top, width, cls},  // px in the 1920 x 1080 slide; cls "narrow" or "cols-2"/"cols-3"
       hint: "…",                       // optional line in the panel
       controls: [{id, label, color, kind: "slider"|"drag", min, max, fixed,
                   step | int | log (+ sig: significant digits), fmt(x) -> text,
                   group}],             // drags of one group share a panel row
       setup(X),                        // once per slide: create readouts (X.readout)
       compute(v) -> c,                 // pure: every number shown, from the values v
       draw(X, v, c),                   // while moved: pictures (X.S, X.draw) and swaps
       readouts(X, v, c),               // always: X.ro(id, html)
       drags: [{id, anim, pos(X, v) -> [x, y] px in the host, value(X, x, y) -> value}],
     });
   Colours are names: "text", a slot a..f, or an alias from config.json "colors". A label has
   the colour of the object it names.

   KEYS. A slider never keeps the focus: it is blurred after each use, and the engine handles
   every deck key on the document, so Left/Right move the deck, not the slider.

   FOR TESTS: Deck.liveInfo(), Deck.liveSet(id, value), Deck.liveReset(), Deck.liveLimits(name),
   Deck.liveCompute(name, values), Deck.liveDefs().
*/
(function () {
  const defs = {};
  Deck.live = (name, def) => (defs[name] = def);
  Deck.liveDefs = () => Object.keys(defs);
  const POS = 1000; // slider positions 0..POS

  /* ---------- number and formula text ---------- */
  const F = (Deck.liveFmt = {
    // x rounded to d decimals, trailing zeros dropped, a true minus sign
    fx(x, d) {
      if (!isFinite(x)) return "–";
      let s = (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
      if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
      if (s === "-0") s = "0";
      return s.replace("-", "−");
    },
    // x with n significant digits (fixed notation), trailing zeros dropped
    sig(x, n) {
      if (x === 0) return "0";
      const d = Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(x))));
      return F.fx(x, d);
    },
    // a formula in plain HTML: wraps in span.lvm (KaTeX's fonts), _x -> subscript, ^x -> superscript
    m(html) { return `<span class="lvm">${html}</span>`; },
    i(s) { return `<i>${s}</i>`; },
    sub(s) { return `<sub>${s}</sub>`; },
    sup(s) { return `<sup>${s}</sup>`; },
  });
  const ALIASES = (window.DECK_CONFIG && window.DECK_CONFIG.colors) || {};
  // a colour name: "text" (or none), a slot a..f, an alias of config.json "colors", or ink/data/muted
  const colVar = (c) => (c === "text" || !c ? "var(--dark)" : `var(--c-${ALIASES[c] || c})`);

  /* ---------- slider value <-> position ---------- */
  function toPos(c, x) {
    const t = c.log ? (Math.log(x) - Math.log(c.min)) / (Math.log(c.max) - Math.log(c.min)) : (x - c.min) / (c.max - c.min);
    return Math.round(Math.max(0, Math.min(1, t)) * POS);
  }
  function round(c, x) {
    x = Math.max(c.min, Math.min(c.max, x));
    if (c.int) x = Math.round(x);
    else if (c.log) {
      const n = c.sig || 2, e = Math.floor(Math.log10(x)) - n + 1, q = Math.pow(10, e);
      x = Math.round(x / q) * q;
      x = +x.toFixed(Math.max(0, -e));
    } else if (c.step) {
      const d = Math.max(0, -Math.floor(Math.log10(c.step) + 1e-9));
      x = +(c.min + Math.round((x - c.min) / c.step) * c.step).toFixed(d);
    }
    return Math.max(c.min, Math.min(c.max, x));
  }
  function fromPos(c, p) {
    // near the fixed value's position: the fixed value itself
    if (Math.abs(p - toPos(c, c.fixed)) <= 3) return c.fixed;
    const t = p / POS;
    return round(c, c.log ? Math.exp(Math.log(c.min) + t * (Math.log(c.max) - Math.log(c.min))) : c.min + t * (c.max - c.min));
  }

  /* ---------- the active slide ---------- */
  let A = null; // {i, s, def, X, v, panel, rows}
  const built = new Map(); // slide element -> {X, panel, rows, handles}

  function makeX(s, def) {
    const saved = [];
    const rnodes = {};
    const X = {
      el: s.el, K: s.K, s, def, rnodes,
      $: (q) => s.el.querySelector(q),
      $$: (q) => Array.from(s.el.querySelectorAll(q)),
      anim: (j) => s.anims[j],
      S: (j) => JSON.parse(JSON.stringify(s.anims[j].def.state(s.K, s.anims[j].opts))),
      draw: (j, S) => s.anims[j].def.draw(s.anims[j].ctx, S),
      lbl: (j, id) => s.anims[j].host.querySelector(`[data-lbl="${id}"]`),
      // swaps: text or an attribute changed while moved, restored exactly when not
      swap(node, html) {
        if (!node) return;
        if (!saved.some((r) => r.node === node && r.kind === "html")) saved.push({ node, kind: "html", v: node.innerHTML });
        if (node.innerHTML !== html) node.innerHTML = html;
      },
      swapAttr(node, name, value) {
        if (!node) return;
        if (!saved.some((r) => r.node === node && r.kind === name)) saved.push({ node, kind: name, v: node.getAttribute(name) });
        node.setAttribute(name, value);
      },
      restore() {
        for (let j = saved.length - 1; j >= 0; j--) {
          const r = saved[j];
          if (r.kind === "html") r.node.innerHTML = r.v;
          else if (r.v === null) r.node.removeAttribute(r.kind);
          else r.node.setAttribute(r.kind, r.v);
        }
        saved.length = 0;
      },
      swapped: () => saved.length,
      // a readout: a span after (or inside) a node, or a line in the panel ({panel: true})
      readout(id, o) {
        const n = document.createElement(o.block ? "div" : "span");
        n.className = "lv-ro" + (o.block ? " lv-ro-line" : "") + (o.cls ? " " + o.cls : "");
        n.dataset.ro = id;
        n.style.setProperty("--lv-c", colVar(o.color));
        if (o.size) n.style.fontSize = o.size;
        if (o.panel) X.panelRo.appendChild(n);
        else if (o.into) o.into.appendChild(n);
        else o.after.insertAdjacentElement("afterend", n);
        rnodes[id] = n;
        return n;
      },
      ro: (id, html) => { const n = rnodes[id]; if (n && n.innerHTML !== html) n.innerHTML = html; },
    };
    return X;
  }

  function buildPanel(s, def, X) {
    const p = document.createElement("div");
    p.className = "live-panel" + (def.panel.cls ? " " + def.panel.cls.split(" ").map((c) => "lv-" + c).join(" ") : "");
    p.style.left = def.panel.left + "px";
    p.style.top = def.panel.top + "px";
    p.style.width = def.panel.width + "px";
    p.innerHTML = `<div class="lv-ros"></div><div class="lv-rows"></div><div class="lv-foot"><button type="button" class="lv-reset">reset</button></div>`;
    X.panelRo = p.querySelector(".lv-ros");
    const rowsBox = p.querySelector(".lv-rows");
    const rows = {};
    const groups = {};
    def.controls.forEach((c) => {
      if (c.kind === "drag" && c.group && groups[c.group]) { rows[c.id] = groups[c.group]; return; }
      const r = document.createElement("div");
      r.className = "lv-row" + (c.kind === "drag" ? " lv-dragrow" : "");
      r.style.setProperty("--lv-c", colVar(c.color));
      r.innerHTML = `<span class="lv-lab">${c.label}</span>` +
        (c.kind === "drag" ? `<span class="lv-gap"></span>` : `<input type="range" min="0" max="${POS}" step="1" aria-label="${c.label.replace(/<[^>]+>/g, "")}">`) +
        `<output class="lv-val"></output>`;
      rowsBox.appendChild(r);
      const row = { el: r, input: r.querySelector("input"), out: r.querySelector("output"), ids: [c.id] };
      rows[c.id] = row;
      if (c.kind === "drag" && c.group) groups[c.group] = row;
      if (row.input) {
        row.input.addEventListener("input", () => set(c.id, fromPos(c, +row.input.value)));
        ["change", "pointerup", "mouseup", "touchend"].forEach((ev) => row.input.addEventListener(ev, () => row.input.blur()));
      }
    });
    Object.values(groups).forEach((g) => { g.ids = def.controls.filter((c) => rows[c.id] === g).map((c) => c.id); });
    if (def.hint) rowsBox.insertAdjacentHTML("beforeend", `<div class="lv-hint">${def.hint}</div>`);
    const btn = p.querySelector(".lv-reset");
    btn.addEventListener("click", () => { reset(); btn.blur(); });
    s.el.appendChild(p);
    return { panel: p, rows };
  }

  function buildHandles(s, def) {
    return (def.drags || []).map((d) => {
      const host = s.anims[d.anim].host;
      const h = document.createElement("div");
      h.className = "lv-handle";
      h.dataset.drag = d.id;
      host.appendChild(h);
      h.addEventListener("pointerdown", (e) => {
        if (!A || A.s !== s) return;
        e.preventDefault();
        try { h.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
        h.classList.add("on");
        const move = (ev) => {
          const r = host.getBoundingClientRect(), sc = r.width / host.offsetWidth;
          const x = (ev.clientX - r.left) / sc, y = (ev.clientY - r.top) / sc;
          const c = def.controls.find((q) => q.id === d.id);
          set(d.id, round(c, d.value(A.X, x, y)));
        };
        const up = () => {
          h.classList.remove("on");
          h.removeEventListener("pointermove", move);
          h.removeEventListener("pointerup", up);
          h.removeEventListener("pointercancel", up);
        };
        h.addEventListener("pointermove", move);
        h.addEventListener("pointerup", up);
        h.addEventListener("pointercancel", up);
        move(e);
      });
      return { d, h };
    });
  }

  function enter(i, s) {
    const def = defs[s.el.dataset.live];
    if (!def) { console.error("no live definition", s.el.dataset.live); return; }
    let b = built.get(s.el);
    if (!b) {
      const X = makeX(s, def);
      const pr = buildPanel(s, def, X);
      if (def.setup) def.setup(X);
      b = { X, panel: pr.panel, rows: pr.rows, handles: buildHandles(s, def) };
      built.set(s.el, b);
    }
    const fixed = {};
    def.controls.forEach((c) => (fixed[c.id] = c.fixed));
    A = { i, s, def, X: b.X, b, v: Object.assign({}, fixed), fixed };
    s.el.classList.add("live-on");
    refresh(false);
  }
  function leave() {
    if (!A) return;
    A.X.restore();
    A.s.el.classList.remove("live-on");
    A = null;
  }
  const isMoved = () => !!A && A.def.controls.some((c) => A.v[c.id] !== c.fixed);

  // draw everything from A.v; static: the engine's state(K) (after a reset)
  function refresh(redrawStatic) {
    const { def, X, v, s, b } = A;
    const c = def.compute(v);
    if (isMoved()) {
      Deck.stopTween();
      def.draw(X, v, c);
    } else {
      X.restore();
      if (redrawStatic) { Deck.stopTween(); s.anims.forEach((a) => a.def.draw(a.ctx, a.def.state(s.K, a.opts))); }
    }
    if (def.readouts) def.readouts(X, v, c);
    def.controls.forEach((q) => {
      const row = b.rows[q.id];
      if (row.input) { const p = toPos(q, v[q.id]); if (+row.input.value !== p) row.input.value = p; }
      const txt = row.ids.map((id) => { const cc = def.controls.find((z) => z.id === id); return cc.fmt ? cc.fmt(v[id]) : F.fx(v[id], 2); }).join(" · ");
      if (row.out.innerHTML !== txt) row.out.innerHTML = txt;
    });
    b.handles.forEach(({ d, h }) => {
      const p = d.pos(X, v);
      h.style.left = p[0] + "px";
      h.style.top = p[1] + "px";
    });
    b.panel.classList.toggle("moved", isMoved());
  }
  function set(id, x) {
    if (!A || !(id in A.v)) return;
    const c = A.def.controls.find((q) => q.id === id);
    x = round(c, +x);
    if (A.v[id] === x) return;
    const was = isMoved();
    A.v[id] = x;
    refresh(was && !isMoved());
  }
  function reset() {
    if (!A) return;
    const was = isMoved();
    A.def.controls.forEach((c) => (A.v[c.id] = c.fixed));
    refresh(was);
  }

  Deck.onGo((i, k) => {
    leave();
    const s = Deck.slideAt(i);
    if (s && s.el.dataset.live && k === s.K && s.anims) enter(i, s);
  });
  // after a theme switch the engine has redrawn state(K): draw the live values again
  if (window.Theme) Theme.onChange(() => { if (A && isMoved()) refresh(false); });

  /* ---------- for tests ---------- */
  Deck.liveInfo = () => {
    if (!A) return { active: false };
    const ro = {};
    for (const id in A.X.rnodes) ro[id] = A.X.rnodes[id].textContent;
    return { active: true, name: A.s.el.dataset.live, slide: A.i + 1, moved: isMoved(), values: Object.assign({}, A.v),
             fixed: Object.assign({}, A.fixed), readouts: ro, swapped: A.X.swapped(), compute: A.def.compute(A.v) };
  };
  Deck.liveSet = (id, x) => set(id, x);
  Deck.liveLimits = (name) => Object.fromEntries(defs[name].controls.map((c) => [c.id, [c.min, c.max]]));
  Deck.liveReset = () => reset();
  Deck.liveCompute = (name, v) => {
    const d = defs[name], vv = {};
    d.controls.forEach((c) => (vv[c.id] = c.fixed));
    return d.compute(Object.assign(vv, v || {}));
  };
})();

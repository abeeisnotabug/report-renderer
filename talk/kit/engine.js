/* engine.js: navigation, steps, tweens, presenter view, overview, full screen.

   A SLIDE is a <section class="slide"> in a slides*.html file of the deck folder:
     <section class="slide" data-steps="2" data-min="1.5" data-part="I">
       <header><div class="kicker">Kicker</div><h1>The slide's message as a sentence.</h1></header>
       <div class="body cols"> … </div>
       <aside class="notes"><ul data-step="0"><li>…</li></ul> … <ul data-step="2">…</ul></aside>
     </section>
   data-steps="K" gives the states 0..K, and the notes hold one <ul data-step="k"> per state.
   data-min is the planned minutes; data-part groups slides in the overview, under the heading
   config.json "parts"[label] (or the label itself). The engine adds the footer, except on
   slides with class "title". Classes "title" and "divider" give the title and part slides.

   STEPS. Any element may carry data-show="k" (visible from state k on), data-hide="k" (hidden
   from state k on), data-hl="k" (highlighted from k on) or data-strike="k" (struck through from
   k on). Hidden elements keep their space; to swap two things in one place, wrap them in
   <div class="stack"> (its children overlap in one grid cell).

   PICTURES. In a file anim-<name>.js of the deck folder:
     Deck.anim("name", {
       setup(host, opts) { return ctx },  // build the SVG once (lib.svg); ctx holds DOM handles only
       state(k, opts)    { return S },    // pure: every drawn number, flag and string for state k
       draw(ctx, S)      { … }            // set every drawn attribute from S
     });
     Deck.opts("my-opts", {...});         // named options: data-anim-opts="my-opts" (or inline JSON)
   Host in the slide: <div class="anim" data-anim="name" data-anim-opts="my-opts"
   style="--w:900px;--h:700px"> <span class="lbl" data-lbl="id">$x$</span> … </div>
   Moving forward by one state tweens every number of S (450 ms, or opts.tweenMs: a number, or
   {k: ms} for the step into state k). Moving back and jumping draw state(k) at once, so arrays
   in S must keep their length (hide an element with an alpha of 0). Labels: ctx.labels =
   lib.labels(host), placed with lib.label(ctx, id, x, y, alpha, anchor).
   Because state(k) is pure, every state looks the same however it was reached.

   COLOURS. Pictures take their colours from lib.COLORS, never as literal values. On a theme
   switch the engine rebuilds a slide's pictures (setup again on the same hosts, the old SVG
   removed): the current slide at once, the others when next shown. So setup must be repeatable
   on its host: it adds one SVG through lib.svg and keeps all other state in ctx.

   KEYS (main window and presenter window):
     Right, Down, PageDown, Space        next state (next slide after the last state)
     Left, Up, PageUp, Shift+Space       previous state
     Shift+Right / Shift+Left            next / previous slide, at state 0
     digits, then Enter                  jump to that slide (Escape cancels)
     Home / End                          first slide / last slide at its last state
     S presenter window, F full screen, O overview, D light <-> dark theme
   Overview: arrows move the selection, Enter or a click opens the slide, Escape or O closes.
   Every key is handled on the document with its default action prevented, so a focused slider
   of a live panel (live.js) never takes Left or Right.

   LIVE CONTROLS (live.js) appear at a slide's last state; the engine tells live.js about every
   move (Deck.onGo) and gives it the slide's pictures (Deck.slideAt).

   <span data-config="author"></span> and the like take their text from config.json.
   Public: Deck.goto(slide from 1, state, {instant}), Deck.count(), Deck.where(), Deck.size(host),
   Deck.tweenMs(slide from 1, state): the longest tween into that state (for tests).
*/
(function () {
  const Deck = (window.Deck = {});
  const animDefs = {}, optsReg = {};
  Deck.anim = (name, def) => (animDefs[name] = def);
  Deck.opts = (name, o) => (optsReg[name] = o);
  Deck.def = (name) => animDefs[name];
  const goHooks = [];
  Deck.onGo = (f) => goHooks.push(f);      // f(slide index from 0, state, {tween}) after every move
  Deck.size = (host) => {
    const cs = getComputedStyle(host);
    return { w: parseFloat(cs.getPropertyValue("--w")) || 860, h: parseFloat(cs.getPropertyValue("--h")) || 720 };
  };

  const TWEEN = 450;
  const hash = location.hash || "";
  const mode = hash.startsWith("#presenter") ? "presenter" : hash.startsWith("#embed") ? "embed" : "main";
  const cfg = window.DECK_CONFIG || {};
  let slides = [], cur = 0, st = 0, tweenId = 0, other = null, overviewOpen = false, ovSel = 0;

  /* ---------- setup ---------- */
  function init() {
    document.body.classList.add("mode-" + mode);
    document.querySelectorAll("[data-config]").forEach((n) => { if (cfg[n.dataset.config]) n.textContent = cfg[n.dataset.config]; });
    slides = Array.from(document.querySelectorAll("#stage > section.slide")).map((el, i) => {
      const K = +el.dataset.steps || 0;
      const s = { el, K, i, part: el.dataset.part || "", min: +el.dataset.min || 0, anims: [],
                  stepEls: Array.from(el.querySelectorAll("[data-show],[data-hide],[data-hl],[data-strike]")) };
      if (!el.classList.contains("title")) addFooter(el);
      return s;
    });
    if (mode !== "presenter") slides.forEach(setupAnims);
    if (window.Theme) {
      if (mode !== "embed") Theme.chooser();
      Theme.onChange(onTheme);
    }
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("message", onMessage);
    if (mode !== "embed") document.addEventListener("keydown", onKey);
    const m = /(\d+)\/(\d+)/.exec(hash);
    const s0 = m ? +m[1] - 1 : 0, k0 = m ? +m[2] : 0;
    if (mode === "presenter") presenterInit(s0, k0);
    else go(s0, k0, { instant: true, quiet: true });
    if (mode === "embed" && window.parent !== window) window.parent.postMessage({ kdeck: "ready" }, "*");
    if (mode === "main" && window.opener) other = window.opener;
    Deck.ready = true;
  }

  function addFooter(el) {
    const f = document.createElement("footer");
    f.className = "foot";
    f.innerHTML = `<div class="stripe"></div><div class="foot-row"><div class="wordmark"></div>
      <div class="short">${cfg.shortTitle || ""}</div>
      <div class="pg">${cfg.date ? cfg.date + " · " : ""}<span class="pgnum"></span></div></div>`;
    el.appendChild(f);
  }

  function resolveOpts(v) {
    if (!v) return {};
    if (optsReg[v]) return optsReg[v];
    try { return JSON.parse(v); } catch (e) { console.error("anim opts", v, e); return {}; }
  }
  const themeNow = () => (window.Theme ? Theme.get() : "");
  function setupAnims(s) {
    s.hosts = Array.from(s.el.querySelectorAll(".anim[data-anim]"));
    buildAnims(s);
  }
  function buildAnims(s) {
    s.anims = [];
    s.theme = themeNow();
    s.hosts.forEach((host) => {
      const def = animDefs[host.dataset.anim];
      if (!def) { console.error("no picture definition", host.dataset.anim); return; }
      const opts = resolveOpts(host.dataset.animOpts);
      const ctx = def.setup(host, opts);
      s.anims.push({ def, ctx, opts, host });
    });
  }
  function rebuildAnims(s) {
    s.hosts.forEach((host) => host.querySelectorAll(":scope > svg.anim-svg").forEach((n) => n.remove()));
    buildAnims(s);
  }

  /* ---------- state ---------- */
  function applySteps(s, k) {
    s.stepEls.forEach((e) => {
      const d = e.dataset;
      let on = true;
      if (d.show !== undefined && k < +d.show) on = false;
      if (d.hide !== undefined && k >= +d.hide) on = false;
      e.classList.toggle("step-off", !on);
      if (d.hl !== undefined) e.classList.toggle("hl", k >= +d.hl);
      if (d.strike !== undefined) e.classList.toggle("struck", k >= +d.strike);
    });
  }
  function lerp(a, b, t) {
    if (typeof b === "number" && typeof a === "number") return a + (b - a) * t;
    if (Array.isArray(b) && Array.isArray(a) && a.length === b.length) return b.map((x, i) => lerp(a[i], x, t));
    if (b && typeof b === "object" && a && typeof a === "object" && !Array.isArray(b)) {
      const o = {};
      for (const key in b) o[key] = key in a ? lerp(a[key], b[key], t) : b[key];
      return o;
    }
    return b;
  }
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const durOf = (a, k) => { const tm = a.opts.tweenMs; return typeof tm === "number" ? tm : (tm && tm[k]) || TWEEN; };

  function render(i, k, tween) {
    const s = slides[i];
    if (s.hosts && s.theme !== themeNow()) rebuildAnims(s);
    applySteps(s, k);
    const id = ++tweenId;
    s.anims.forEach((a) => {
      const to = a.def.state(k, a.opts);
      if (!tween || k === 0) { a.def.draw(a.ctx, to); return; }
      const from = a.def.state(k - 1, a.opts), t0 = performance.now(), dur = durOf(a, k);
      const frame = (now) => {
        if (id !== tweenId) return;
        const t = Math.min(1, (now - t0) / dur);
        a.def.draw(a.ctx, t < 1 ? lerp(from, to, ease(t)) : to);
        if (t < 1) requestAnimationFrame(frame);
      };
      a.def.draw(a.ctx, lerp(from, to, 0));
      requestAnimationFrame(frame);
    });
  }

  function go(i, k, o) {
    o = o || {};
    i = Math.max(0, Math.min(slides.length - 1, i));
    k = Math.max(0, Math.min(slides[i].K, k));
    const tween = !o.instant && i === cur && k === st + 1;
    slides.forEach((s, j) => s.el.classList.toggle("current", j === i));
    const s = slides[i];
    s.el.classList.toggle("instant", !tween);
    cur = i; st = k;
    render(i, k, tween);
    const pg = s.el.querySelector(".pgnum");
    if (pg) pg.textContent = `${i + 1} / ${slides.length}`;
    // browsers limit address updates per second; the address is cosmetic
    if (mode === "main") { try { history.replaceState(null, "", `#/${i + 1}/${k}`); } catch (e) { /* ignored */ } }
    goHooks.forEach((f) => f(i, k, { tween }));
    if (!o.quiet) send({ kdeck: "goto", s: i, k, tween, key: !!o.key });
  }
  Deck.goto = (slide, state, o) => go(slide - 1, state, Object.assign({ instant: true }, o || {}));
  Deck.slideAt = (i) => slides[i];          // {el, K, anims: [{def, ctx, opts, host}], …}
  Deck.stopTween = () => { ++tweenId; };    // a running tween stops drawing
  Deck.count = () => ({ slides: slides.length, states: slides.map((s) => s.K + 1) });
  Deck.where = () => ({ slide: cur + 1, state: st });
  Deck.tweenMs = (slide, k) => {
    const s = slides[slide - 1];
    return s && k > 0 ? s.anims.reduce((m, a) => Math.max(m, durOf(a, k)), TWEEN) : TWEEN;
  };

  function next(key) {
    if (st < slides[cur].K) go(cur, st + 1, { key });
    else if (cur < slides.length - 1) go(cur + 1, 0, { instant: true, key });
  }
  function prev(key) {
    if (st > 0) go(cur, st - 1, { instant: true, key });
    else if (cur > 0) go(cur - 1, slides[cur - 1].K, { instant: true, key });
  }

  /* ---------- keys ---------- */
  let typed = "", typedBox = null, typedTimer = null;
  function showTyped() {
    if (!typedBox) {
      typedBox = document.createElement("div");
      typedBox.id = "slide-jump";
      document.body.appendChild(typedBox);
    }
    typedBox.textContent = typed ? "slide " + typed : "";
    typedBox.classList.toggle("on", !!typed);
    clearTimeout(typedTimer);
    if (typed) typedTimer = setTimeout(() => { typed = ""; showTyped(); }, 6000);
  }
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (overviewOpen) return overviewKey(e);
    const k = e.key;
    let used = true;
    if (/^[0-9]$/.test(k)) { if (typed.length < 3) typed += k; showTyped(); e.preventDefault(); return; }
    if (typed && k === "Enter") { const n = +typed; typed = ""; showTyped(); if (n >= 1) nav("slide", n - 1); e.preventDefault(); return; }
    if (typed && k === "Backspace") { typed = typed.slice(0, -1); showTyped(); e.preventDefault(); return; }
    if (typed) { typed = ""; showTyped(); if (k === "Escape") { e.preventDefault(); return; } }
    if (k === "ArrowRight" && e.shiftKey) nav("nextSlide");
    else if (k === "ArrowLeft" && e.shiftKey) nav("prevSlide");
    else if (k === "ArrowRight" || k === "PageDown" || k === "ArrowDown" || (k === " " && !e.shiftKey)) nav("next");
    else if (k === "ArrowLeft" || k === "PageUp" || k === "ArrowUp" || (k === " " && e.shiftKey)) nav("prev");
    else if (k === "Home") nav("home");
    else if (k === "End") nav("end");
    else if (k === "s" || k === "S") openPresenter();
    else if (k === "f" || k === "F") toggleFull();
    else if ((k === "o" || k === "O") && mode === "main") openOverview();
    else if ((k === "d" || k === "D") && window.Theme) { if (!e.repeat) Theme.toggleDark(); else Theme.flash(); }
    else used = false;
    if (used) e.preventDefault();
  }
  function nav(what, n) {
    if (mode === "presenter") return pNav(what, n);
    if (what === "nextSlide") go(Math.min(slides.length - 1, cur + 1), 0, { instant: true, key: true });
    else if (what === "prevSlide") go(Math.max(0, cur - 1), 0, { instant: true, key: true });
    else if (what === "slide") go(Math.min(slides.length - 1, n), 0, { instant: true, key: true });
    else if (what === "next") next(true);
    else if (what === "prev") prev(true);
    else if (what === "home") go(0, 0, { instant: true, key: true });
    else if (what === "end") go(slides.length - 1, slides[slides.length - 1].K, { instant: true, key: true });
  }
  function toggleFull() {
    const d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  }

  /* ---------- scaling ---------- */
  function fit() {
    const stage = document.getElementById("stage");
    if (!stage || mode === "presenter") return;
    const sc = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${sc})`;
  }

  /* ---------- main and presenter window in step ---------- */
  function send(msg) {
    if (mode === "embed") return;
    try { if (other && !other.closed) other.postMessage(msg, "*"); } catch (e) { /* closed */ }
  }
  function onMessage(e) {
    const m = e.data;
    if (!m || !m.kdeck) return;
    if (m.kdeck === "goto") {
      if (mode === "presenter") pShow(m.s, m.k, m.tween, m.key);
      else go(m.s, m.k, { instant: !m.tween, quiet: true });
    } else if (m.kdeck === "theme" && window.Theme) Theme.set(m.n, { quiet: true, keep: mode === "embed" });
    else if (m.kdeck === "ready" && mode === "presenter") pFrames();
    else if (m.kdeck === "hello" && mode === "main") {
      other = e.source;
      send({ kdeck: "goto", s: cur, k: st });
      if (window.Theme) send({ kdeck: "theme", n: Theme.get() });
    }
  }
  function onTheme(n, o) {
    if (mode !== "presenter") render(cur, st, false);
    if (overviewOpen) { const sel = ovSel; closeOverview(); openOverview(); ovSel = sel; markSel(); }
    if (!o.quiet) send({ kdeck: "theme", n });
    if (mode === "presenter") pFrames();
  }
  Deck.retheme = () => { if (mode !== "presenter") render(cur, st, false); };
  function openPresenter() {
    if (mode !== "main") return;
    const url = location.href.split("#")[0] + `#presenter/${cur + 1}/${st}`;
    other = window.open(url, "talk-presenter", "width=1600,height=1000");
  }

  /* ---------- presenter view: current and next state, notes, clocks ---------- */
  let pCur = 0, pSt = 0, clockStart = null, P = {};
  function presenterInit(s0, k0) {
    const box = document.getElementById("presenter");
    const base = location.href.split("#")[0];
    box.innerHTML = `
      <div class="p-left"><div class="p-label">Now <span class="p-pos"></span></div>
        <div class="p-frame p-cur"><iframe src="${base}#embed/${s0 + 1}/${k0}"></iframe></div>
        <div class="p-clock" title="click: reset the clock"><div><span class="p-el">0:00</span><small>elapsed</small></div>
          <div><span class="p-plan">0:00</span><small>slide planned at</small></div>
          <div><span class="p-wall"></span><small>time</small></div></div></div>
      <div class="p-right"><div class="p-label">Next</div>
        <div class="p-frame p-next"><iframe src="${base}#embed/1/0"></iframe></div>
        <div class="p-notes"></div></div>`;
    P = { cur: box.querySelector(".p-cur iframe"), next: box.querySelector(".p-next iframe"),
          notes: box.querySelector(".p-notes"), pos: box.querySelector(".p-pos"), el: box.querySelector(".p-el"),
          plan: box.querySelector(".p-plan"), wall: box.querySelector(".p-wall"), clock: box.querySelector(".p-clock") };
    P.clock.addEventListener("click", () => { clockStart = Date.now(); tick(); });
    setInterval(tick, 1000);
    if (window.opener) { other = window.opener; other.postMessage({ kdeck: "hello" }, "*"); }
    pShow(s0, k0, false, false);
  }
  function pNav(what, n) {
    let i = pCur, k = pSt, tween = false;
    if (what === "nextSlide") { i = Math.min(slides.length - 1, i + 1); k = 0; }
    else if (what === "prevSlide") { i = Math.max(0, i - 1); k = 0; }
    else if (what === "slide") { i = Math.min(slides.length - 1, n); k = 0; }
    else if (what === "next") { if (k < slides[i].K) { k++; tween = true; } else if (i < slides.length - 1) { i++; k = 0; } }
    else if (what === "prev") { if (k > 0) k--; else if (i > 0) { i--; k = slides[i].K; } }
    else if (what === "home") { i = 0; k = 0; }
    else if (what === "end") { i = slides.length - 1; k = slides[i].K; }
    pShow(i, k, tween, true);
    send({ kdeck: "goto", s: i, k, tween, key: true });
  }
  function nextPos(i, k) {
    if (k < slides[i].K) return [i, k + 1];
    if (i < slides.length - 1) return [i + 1, 0];
    return [i, k];
  }
  function pFrames(tween) {
    const n = nextPos(pCur, pSt);
    if (window.Theme) [P.cur, P.next].forEach((f) => { if (f && f.contentWindow) f.contentWindow.postMessage({ kdeck: "theme", n: Theme.get() }, "*"); });
    [[P.cur, pCur, pSt, tween], [P.next, n[0], n[1], false]].forEach(([f, i, k, tw]) => {
      if (f && f.contentWindow) f.contentWindow.postMessage({ kdeck: "goto", s: i, k, tween: !!tw }, "*");
    });
  }
  function pShow(i, k, tween, key) {
    if (key && clockStart === null) clockStart = Date.now();
    pCur = i; pSt = k;
    pFrames(tween);
    const s = slides[i];
    P.pos.textContent = `slide ${i + 1} / ${slides.length}, state ${k} / ${s.K}`;
    const notes = s.el.querySelector("aside.notes");
    const h1 = s.el.querySelector("h1");
    P.notes.innerHTML = `<h2>${h1 ? h1.innerHTML : ""}</h2>` + (notes ? notes.innerHTML : "");
    let now = null;
    P.notes.querySelectorAll("[data-step]").forEach((p) => {
      const on = +p.dataset.step === k;
      p.classList.toggle("now", on);
      if (on) now = p;
    });
    if (now) now.scrollIntoView({ block: "center" });
    tick();
  }
  const mmss = (ms) => { const t = Math.round(ms / 1000), m = Math.floor(Math.abs(t) / 60), s = Math.abs(t) % 60;
    return (t < 0 ? "−" : "") + m + ":" + String(s).padStart(2, "0"); };
  function tick() {
    if (!P.el) return;
    const el = clockStart === null ? 0 : Date.now() - clockStart;
    const plan = slides.slice(0, pCur).reduce((a, s) => a + s.min, 0) * 60000;
    P.el.textContent = mmss(el);
    P.plan.textContent = mmss(plan);
    P.clock.classList.toggle("late", el - plan > 60000);
    const d = new Date();
    P.wall.textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  /* ---------- overview ---------- */
  const partName = (p) => (cfg.parts && cfg.parts[p]) || p;
  function openOverview() {
    const box = document.getElementById("overview");
    const keep = [cur, st];
    const cw = Math.floor((window.innerWidth - 80 - 5 * 16) / 6);
    let lastPart = null;
    box.innerHTML = "";
    const cells = [];
    slides.forEach((s, i) => {
      if (s.part !== lastPart || i === 0) {
        if (s.part) {
          const h = document.createElement("h2");
          h.textContent = partName(s.part);
          box.appendChild(h);
        }
        lastPart = s.part;
        box.appendChild(Object.assign(document.createElement("div"), { className: "ov-grid" }));
      }
      go(i, s.K, { instant: true, quiet: true });
      const cell = document.createElement("div");
      cell.className = "ov-cell";
      cell.style.width = cw + "px";
      cell.style.height = Math.round((cw * 9) / 16) + "px";
      const inner = document.createElement("div");
      inner.className = "ov-scale";
      inner.style.transform = `scale(${cw / 1920})`;
      const c = s.el.cloneNode(true);
      c.classList.add("current", "instant");
      inner.appendChild(c);
      cell.appendChild(inner);
      cell.addEventListener("click", () => { closeOverview(); go(i, 0, { instant: true, key: true }); });
      box.lastChild.appendChild(cell);
      cells.push(cell);
    });
    go(keep[0], keep[1], { instant: true, quiet: true });
    ovSel = cur;
    overviewOpen = true;
    document.body.classList.add("overview");
    markSel(cells);
  }
  function markSel(cells) {
    cells = cells || Array.from(document.querySelectorAll("#overview .ov-cell"));
    cells.forEach((c, i) => c.classList.toggle("sel", i === ovSel));
    if (cells[ovSel]) cells[ovSel].scrollIntoView({ block: "nearest" });
  }
  function closeOverview() {
    overviewOpen = false;
    document.body.classList.remove("overview");
    document.getElementById("overview").innerHTML = "";
  }
  function overviewKey(e) {
    const k = e.key;
    if (k === "Escape" || k === "o" || k === "O") closeOverview();
    else if ((k === "d" || k === "D") && window.Theme) { if (!e.repeat) Theme.toggleDark(); }
    else if (k === "Enter") { closeOverview(); go(ovSel, 0, { instant: true, key: true }); }
    else if (k === "ArrowRight") ovSel = Math.min(slides.length - 1, ovSel + 1);
    else if (k === "ArrowLeft") ovSel = Math.max(0, ovSel - 1);
    else if (k === "ArrowDown") ovSel = Math.min(slides.length - 1, ovSel + 6);
    else if (k === "ArrowUp") ovSel = Math.max(0, ovSel - 6);
    else return;
    e.preventDefault();
    if (overviewOpen) markSel();
  }
  Deck.overview = () => (overviewOpen ? closeOverview() : openOverview());

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

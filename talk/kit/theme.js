/* theme.js: switching between the two colour themes of theme.css. Loaded after lib.js and
   before engine.js.

   Themes: "light" (default) and "dark".
   Key D (engine.js passes it here) toggles them and shows the chooser for a moment; it works on
   the slides, in the overview and in the presenter view. The chooser sits in the bottom-right
   corner (also shown on hover); a click picks a theme.

   Start theme, in this order: URL parameter ?theme=light|dark, the stored choice
   (localStorage "talk-theme"), light. Every storage access is in try/catch: without storage the
   deck works and forgets the choice.

   Theme.set(name) writes data-theme on <html>, refills lib.COLORS (lib.readColors) and calls
   the listeners of Theme.onChange. The engine's listener redraws the current slide; other slides
   are rebuilt when next shown. HTML text and formulas follow the custom properties at once. The
   main window and the presenter window tell each other about a switch ({kdeck: "theme", n}).
*/
(function () {
  const ALL = ["light", "dark"], DEFAULT = "light", KEY = "talk-theme";
  const L = window.lib, root = document.documentElement;
  const listeners = [];
  let cur = null, hideTimer = null, box = null;

  const valid = (v) => (v && ALL.includes(String(v).toLowerCase()) ? String(v).toLowerCase() : null);
  function fromUrl() {
    try { return valid(new URLSearchParams(location.search).get("theme")); } catch (e) { return null; }
  }
  function load() {
    try { return valid(window.localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function store(n) {
    try { window.localStorage.setItem(KEY, n); } catch (e) { /* no storage: not remembered */ }
  }
  // a ?theme= in the address would win over the stored choice on reload: keep it current
  function syncUrl(n) {
    try {
      const u = new URL(location.href);
      if (!u.searchParams.has("theme") || u.searchParams.get("theme") === n) return;
      u.searchParams.set("theme", n);
      history.replaceState(history.state, "", u.href);
    } catch (e) { /* file URLs, or the browser's rate limit on address updates: cosmetic */ }
  }

  function apply(n) {
    cur = n;
    root.setAttribute("data-theme", n);
    L.readColors();
    if (box) box.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.n === n));
  }
  /* o.quiet: do not tell other windows (the switch came from one); o.keep: do not store */
  function set(n, o) {
    o = o || {};
    n = valid(n);
    if (!n || n === cur) return;
    apply(n);
    if (!o.keep) { store(n); syncUrl(n); }
    listeners.forEach((f) => f(n, o));
  }

  function chooser() {
    if (box || !document.body) return;
    const hot = document.createElement("div");
    hot.id = "theme-hot";
    box = document.createElement("div");
    box.id = "theme-chooser";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Colour theme");
    const btn = (n) => `<button type="button" data-n="${n}" data-theme="${n}" title="${n} theme (key D toggles)"><span>${n}</span></button>`;
    box.innerHTML = `<span class="tc-h">theme</span>` + btn("light") + `<span class="tc-sep"></span>` + btn("dark");
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) { set(b.dataset.n); flash(); b.blur(); }
    });
    hot.appendChild(box);
    document.body.appendChild(hot);
    apply(cur);
  }
  function flash() {
    if (!document.body) return;
    document.body.classList.add("theme-open");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => document.body.classList.remove("theme-open"), 2200);
  }

  window.Theme = {
    themes: ALL.slice(),
    get: () => cur,
    isDark: () => cur === "dark",
    set,
    toggleDark() { set(cur === "dark" ? "light" : "dark"); flash(); },
    onChange: (f) => listeners.push(f),
    chooser,
    flash,
  };
  // before the first paint and before any picture is built
  apply(fromUrl() || load() || DEFAULT);
})();

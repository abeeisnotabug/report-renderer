// Layered reports (see layers.lua): toolbar, previews of cited items, opening folded targets,
// and the current section in the contents list. Inlined by render.mjs.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const byId = id => document.getElementById(id);
  // open every folded block that contains el (and el itself, if it folds)
  // (and show side trips again if "Core only" would hide the target)
  const openTo = el => {
    if (el.closest('.side') && document.documentElement.classList.contains('core-only')) setCore(false);
    for (let d = el; d; d = d.parentElement) if (d.tagName === 'DETAILS') d.open = true;
  };

  // toolbar
  $('#tb-open').onclick = () => document.querySelectorAll('details:not(.rcode)').forEach(d => { d.open = true; });
  $('#tb-close').onclick = () => document.querySelectorAll('details').forEach(d => { d.open = false; });
  // "Core only" exists only on pages with side trips
  const core = $('#tb-core');
  const setCore = on => {
    if (!core) return;
    document.documentElement.classList.toggle('core-only', on);
    core.checked = on;
    try { localStorage.setItem('layers-core-only', on ? '1' : '0'); } catch (e) {}
  };
  if (core) {
    try { if (localStorage.getItem('layers-core-only') === '1') setCore(true); } catch (e) {}
    core.onchange = () => setCore(core.checked);
  }

  // preview panel
  const peek = document.createElement('div');
  peek.id = 'peek';
  peek.hidden = true;
  peek.setAttribute('role', 'dialog');
  peek.innerHTML = '<div class="peek-bar"><a class="peek-go" href="#">Go there</a>' +
    '<button class="peek-close" aria-label="Close">×</button></div><div class="peek-body"></div>';
  document.body.appendChild(peek);
  const body = $('.peek-body', peek), go = $('.peek-go', peek);
  const close = () => { peek.hidden = true; };
  $('.peek-close', peek).onclick = close;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // what a preview shows: an item's statement, a section's title and takeaway, or the whole block
  const preview = el => {
    let nodes;
    if (el.tagName === 'DETAILS') nodes = [...el.querySelector(':scope > summary').childNodes];
    else if (el.tagName === 'H2' && el.closest('summary')) nodes = [...el.closest('summary').childNodes];
    else nodes = [...el.childNodes];
    const frag = document.createDocumentFragment();
    for (const n of nodes) {
      const c = n.cloneNode(true);
      if (c.nodeType === 1) {
        if (c.matches('.uses, .more-hint, details.sub')) continue;
        c.removeAttribute('id');
        c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
      }
      frag.appendChild(c);
    }
    return frag;
  };
  const show = (id, label) => {
    const el = byId(id);
    if (!el) return;
    body.replaceChildren(preview(el));
    // an item of the other report opens that report
    go.href = el.dataset.href || '#' + id;
    go.textContent = 'Go to ' + label + ' →';
    peek.hidden = false;
    peek.scrollTop = 0;
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) {
      if (!peek.hidden && !peek.contains(e.target)) close();
      return;
    }
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (a.classList.contains('xref')) {
      // preventDefault also stops a link inside a <summary> from toggling the block
      e.preventDefault();
      show(id, /^[A-Z][a-z]?\d+$/.test(id) ? id : a.textContent);
      return;
    }
    // ordinary in-page link: unfold the way to the target, then the browser scrolls there
    const el = byId(id);
    if (el) openTo(el);
    if (a.classList.contains('peek-go')) close();
  });

  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && byId(id);
    if (el) { openTo(el); el.scrollIntoView(); }
  };
  addEventListener('hashchange', fromHash);
  fromHash();
  // figures and fonts change the layout after this script runs; scroll again once they are in
  addEventListener('load', () => requestAnimationFrame(fromHash));

  // current section in the contents list
  const links = [...document.querySelectorAll('#toc a')];
  const heads = links.map(a => byId(decodeURIComponent(a.getAttribute('href').slice(1))));
  const mark = () => {
    let cur = 0;
    heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < innerHeight * 0.3) cur = i; });
    links.forEach((a, i) => a.classList.toggle('current', i === cur));
  };
  addEventListener('scroll', mark, { passive: true });
  mark();
})();

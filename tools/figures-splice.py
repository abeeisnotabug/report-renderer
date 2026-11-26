#!/usr/bin/env python3
# figures-splice.py: puts the figure workers' fragments into a companion's parts (SKILL.md Mc4a).
#
# Usage: figures-splice.py <work folder> <page tag>
#        figures-splice.py split <work folder> <page tag> <figures per worker>
#
# split: cuts the contract's figure list `figs-<page>.md` (entries headed `## <id>`, anything
# before the first entry is a preamble every worker gets) into `figs-<page>/list-<k>.md`, about
# <figures per worker> consecutive entries each, and prints the number of workers (0: no list).
#
# The writers leave a marker line `<!-- live: <id> -->` where the contract places figure <id>
# (after an item, before one, or inside a figure item of the notes). The figure workers write
# `figs-<page>/frag-<id>.Rmd` and `figs-<page>/live-<id>.js`. This script replaces each marker
# line in `part-<page>-<k>.Rmd` by its fragment, points the fragment's `src="live-<id>.js"` to
# `live/live-<id>.js`, and copies the script into `live/` of the work folder (the renderer
# inlines it at render time, so `live/` must sit next to the page whenever it is rendered).
# Writes `figures-<page>.md`: what was placed, which markers had no fragment, which fragments had
# no marker. Rerunnable: a placed marker is gone, so a second run changes nothing.
import pathlib, re, shutil, sys

if sys.argv[1] == 'split':
    work, page, per = pathlib.Path(sys.argv[2]).resolve(), sys.argv[3], max(1, int(sys.argv[4]))
    src = work / f'figs-{page}.md'
    if not src.exists(): print(0); sys.exit(0)
    pre, entries = [], []
    for l in src.read_text().split('\n'):
        if re.match(r'^## \S', l): entries.append([l])
        elif entries: entries[-1].append(l)
        else: pre.append(l)
    if not entries: print(0); sys.exit(0)
    n = -(-len(entries) // per)   # workers: the list cut into n nearly equal runs of entries
    (work / f'figs-{page}').mkdir(exist_ok=True)
    for k in range(n):
        chunk = entries[k * len(entries) // n:(k + 1) * len(entries) // n]
        (work / f'figs-{page}' / f'list-{k + 1}.md').write_text(
            '\n'.join(pre + [l for e in chunk for l in e]).strip('\n') + '\n')
    print(n); sys.exit(0)

work, page = pathlib.Path(sys.argv[1]).resolve(), sys.argv[2]
figs, live = work / f'figs-{page}', work / 'live'
MARK = re.compile(r'^\s*<!--\s*live:\s*([A-Za-z0-9_-]+)\s*-->\s*$')
frags = {f.stem[len('frag-'):]: f for f in sorted(figs.glob('frag-*.Rmd'))} if figs.is_dir() else {}
placed, missing = [], []
for part in sorted(work.glob(f'part-{page}-*.Rmd'), key=lambda p: int(p.stem.rsplit('-', 1)[1])):
    lines, out, changed = part.read_text().split('\n'), [], False
    for l in lines:
        m = MARK.match(l)
        if not m:
            out.append(l); continue
        fid = m.group(1)
        if fid not in frags:
            missing.append(f'{fid} ({part.name})'); out.append(l); continue
        t = frags[fid].read_text().strip('\n')
        for js in re.findall(r'src="(live-[^"/]+\.js)"', t):
            live.mkdir(exist_ok=True)
            if not (figs / js).exists(): sys.exit(f'figures-splice: {frags[fid].name} names {js}, which is missing')
            shutil.copy(figs / js, live / js)
        t = re.sub(r'src="(live-[^"/]+\.js)"', r'src="live/\1"', t)
        out += ['', t, '']; placed.append(f'{fid} ({part.name})'); changed = True
    if changed: part.write_text('\n'.join(out))
done = {p.split(' ')[0] for p in placed}
already = {f for f in frags if any(f'live/live-{f}.js' in p.read_text() for p in work.glob(f'part-{page}-*.Rmd'))}
unused = sorted(set(frags) - done - already)
report = [f'# Figures of page {page}', '',
          f'Placed now: {", ".join(placed) or "none"}.',
          f'Placed in an earlier run: {", ".join(sorted(already - done)) or "none"}.',
          f'Markers without a fragment (left in place): {", ".join(missing) or "none"}.',
          f'Fragments without a marker (not placed): {", ".join(unused) or "none"}.']
(work / f'figures-{page}.md').write_text('\n'.join(report) + '\n')
print('\n'.join(report[2:]))
sys.exit(1 if missing or unused else 0)

#!/usr/bin/env python3
# figures-splice.py: puts the figure workers' fragments into a companion's parts (SKILL.md Mc4a).
#
# Usage: figures-splice.py <work folder> <page tag> [--parts <glob>]
#        figures-splice.py split <work folder> <page tag> <figures per worker> [--tag <t>] [--only-parts 1,2]
#
# Parts are `part-<page>-<k>.Rmd` (companions) or the files `--parts` names, e.g. 'part-*.Rmd'
# (topic introductions, page tag `page`).
#
# split: cuts the figure list `figs-<page>.md` (entries headed `## <id>`, anything before the
# first entry is a preamble every worker gets) into `figs-<page>/list-<t><k>.md`, about
# <figures per worker> consecutive entries each, and prints the number of workers (0: nothing to
# do). It takes only entries whose marker still stands in a part (so figures already placed are
# not made again), and with --only-parts only entries whose line `Part: <n>` names one of them.
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

def opt(name, default):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def part_files(work, page):
    fs = list(work.glob(opt('--parts', f'part-{page}-*.Rmd')))
    return sorted(fs, key=lambda p: [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', p.name)])

if sys.argv[1] == 'split':
    work, page, per = pathlib.Path(sys.argv[2]).resolve(), sys.argv[3], max(1, int(sys.argv[4]))
    tag, only = opt('--tag', ''), opt('--only-parts', '')
    src = work / f'figs-{page}.md'
    if not src.exists(): print(0); sys.exit(0)
    pre, entries = [], []
    for l in src.read_text().split('\n'):
        if re.match(r'^## \S', l): entries.append([l])
        elif entries: entries[-1].append(l)
        else: pre.append(l)
    text = '\n'.join(p.read_text() for p in part_files(work, page))
    standing = set(re.findall(r'<!--\s*live:\s*([A-Za-z0-9_-]+)\s*-->', text))
    entries = [e for e in entries if e[0][3:].strip() in standing]
    if only:
        want = set(only.split(','))
        entries = [e for e in entries
                   if any((m := re.match(r'^\s*\**Part:?\**:?\s*(\d+)', l)) and m.group(1) in want for l in e)]
    if not entries: print(0); sys.exit(0)
    n = -(-len(entries) // per)   # workers: the list cut into n nearly equal runs of entries
    (work / f'figs-{page}').mkdir(exist_ok=True)
    for k in range(n):
        chunk = entries[k * len(entries) // n:(k + 1) * len(entries) // n]
        (work / f'figs-{page}' / f'list-{tag}{k + 1}.md').write_text(
            '\n'.join(pre + [l for e in chunk for l in e]).strip('\n') + '\n')
    print(n); sys.exit(0)

work, page = pathlib.Path(sys.argv[1]).resolve(), sys.argv[2]
figs, live = work / f'figs-{page}', work / 'live'
MARK = re.compile(r'^\s*<!--\s*live:\s*([A-Za-z0-9_-]+)\s*-->\s*$')
frags = {f.stem[len('frag-'):]: f for f in sorted(figs.glob('frag-*.Rmd'))} if figs.is_dir() else {}
placed, missing = [], []
for part in part_files(work, page):
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
already = {f for f in frags if any(f'live/live-{f}.js' in p.read_text() for p in part_files(work, page))}
unused = sorted(set(frags) - done - already)
report = [f'# Figures of page {page}', '',
          f'Placed now: {", ".join(placed) or "none"}.',
          f'Placed in an earlier run: {", ".join(sorted(already - done)) or "none"}.',
          f'Markers without a fragment (left in place): {", ".join(missing) or "none"}.',
          f'Fragments without a marker (not placed): {", ".join(unused) or "none"}.']
(work / f'figures-{page}.md').write_text('\n'.join(report) + '\n')
print('\n'.join(report[2:]))
sys.exit(1 if missing or unused else 0)

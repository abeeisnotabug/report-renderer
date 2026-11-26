#!/usr/bin/env python3
# punches.py: the script steps around the punch stage of a companion (SKILL.md Mc4b).
#
#   punches.py items  <page.Rmd> <items.md>
#       Writes every item's statement under `## <id>`: the text of each `::: {#<id> .item}` div
#       without its inner divs (folds, Steps, Source, Hint, Solution, need lines, punches), R
#       chunks and figure markers. This is the input of brief-punch.md.
#   punches.py insert <work folder> <page tag> <punch file> <need file>
#       Reads the two answers (format of brief-punch.md: `## <id>`, `Punch: ...`, `Need: ...`),
#       takes the punch from <punch file> and the need line from <need file> (the same file twice
#       is allowed), and writes them into the parts `part-<page>-<k>.Rmd` directly after each
#       item's opening line, as `::: need` and `::: {.punch kind="..."}` (the renderer orders the
#       folds). "none" writes nothing. The kind comes from the item: an exercise (id sheet-, tut-,
#       exer-, or "Exercise" in its bold title) gets key, a definition demands, an example or a
#       figure shows, everything else why. An item that already has a need line or punch is left
#       as it is, so a rerun changes nothing. Writes `punches-<page>.md` (counts, ids skipped,
#       ids in the answers that are not on the page).
import pathlib, re, sys

OPEN = re.compile(r'^:{3,}\s*\{#([^\s}]+)[^}]*\.item\b')
FENCE_OPEN, FENCE_CLOSE = re.compile(r'^:{3,}\s*\S'), re.compile(r'^:{3,}\s*$')
MARK = re.compile(r'^\s*<!--\s*live:')

def item_spans(lines):
    """(id, start, end) of every item div: start is its opening line, end its closing line."""
    out, i = [], 0
    while i < len(lines):
        m = OPEN.match(lines[i])
        if not m: i += 1; continue
        depth, code, j = 0, False, i
        while j < len(lines):
            l = lines[j]
            if l.startswith('```'): code = not code
            elif not code and FENCE_CLOSE.match(l): depth -= 1
            elif not code and FENCE_OPEN.match(l): depth += 1
            if depth == 0: break
            j += 1
        out.append((m.group(1), i, j)); i = j + 1
    return out

def statement(lines, start, end):
    keep, depth, code = [], 0, False
    for l in lines[start + 1:end]:
        if l.startswith('```'): code = not code; continue
        if code or MARK.match(l): continue
        if FENCE_CLOSE.match(l): depth -= 1; continue
        if FENCE_OPEN.match(l): depth += 1; continue
        if depth == 0: keep.append(l)
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(keep)).strip()

def items(src, dst):
    lines = pathlib.Path(src).read_text().split('\n')
    spans = item_spans(lines)
    text = ['# Items of the page: statements only (no folds, no steps, no status lines)', '']
    for fid, s, e in spans: text += [f'## {fid}', statement(lines, s, e), '']
    pathlib.Path(dst).write_text('\n'.join(text))
    print(f'{len(spans)} items -> {dst}')

def answers(path):
    res, cur, field = {}, None, None
    for l in pathlib.Path(path).read_text().split('\n'):
        m = re.match(r'^##\s+(\S+)\s*$', l)
        if m: cur, field = m.group(1), None; res[cur] = {}; continue
        f = re.match(r'^(Punch|Need|Kind):\s*(.*)$', l)
        if cur and f: field = f.group(1).lower(); res[cur][field] = f.group(2).strip(); continue
        if cur and field and l.strip(): res[cur][field] += ' ' + l.strip()
    return res

def none(t): return not t or t.strip().lower().rstrip('.') == 'none'

def kind(fid, title):
    if re.match(r'(sheet|tut|exer)-', fid) or re.search(r'\bExercise\b', title): return 'key'
    if re.search(r'\bDefinition\b', title): return 'demands'
    if re.search(r'\b(Example|Counterexample|Figure)\b', title) or fid.startswith('fig-'): return 'shows'
    return 'why'

def insert(work, page, punch_file, need_file):
    work = pathlib.Path(work)
    P, N = answers(punch_file), answers(need_file)
    seen, n_need, n_punch, skipped = set(), 0, 0, []
    for part in sorted(work.glob(f'part-{page}-*.Rmd'), key=lambda p: int(p.stem.rsplit('-', 1)[1])):
        lines = part.read_text().split('\n')
        spans = item_spans(lines)
        for fid, s, e in reversed(spans):   # from the end, so earlier line numbers stay valid
            seen.add(fid)
            body = lines[s + 1:e]
            if any(re.match(r'^:{3,}\s*(need\b|\{[^}]*\.(punch|need)\b)', l) for l in body):
                skipped.append(fid); continue
            title = next((l for l in body if l.startswith('**')), '')
            need, punch = N.get(fid, {}).get('need'), P.get(fid, {}).get('punch')
            add = []
            if not none(need): add += ['::: need', need, ':::', '']; n_need += 1
            if not none(punch): add += [f'::: {{.punch kind="{kind(fid, title)}"}}', punch, ':::', '']; n_punch += 1
            lines[s + 1:s + 1] = add
        part.write_text('\n'.join(lines))
    unknown = sorted((set(P) | set(N)) - seen)
    report = [f'# Punches of page {page}', '',
              f'Need lines written: {n_need} (from {pathlib.Path(need_file).name}); punches written: {n_punch} (from {pathlib.Path(punch_file).name}).',
              f'Items left as they were (already had a need line or punch): {", ".join(skipped) or "none"}.',
              f'Ids in the answers that are not items of the page: {", ".join(unknown) or "none"}.']
    (work / f'punches-{page}.md').write_text('\n'.join(report) + '\n')
    print('\n'.join(report[2:]))

if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == 'items': items(sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 6 and sys.argv[1] == 'insert': insert(*sys.argv[2:])
    else: sys.exit('usage: punches.py items <page.Rmd> <items.md> | insert <work folder> <page> <punch file> <need file>')

#!/usr/bin/env python3
"""Rewrites, in place, the status line of every item of a page into a `::: source` block.

  python3 tools/status-to-source.py page.Rmd

The status line is the first italic paragraph standing directly inside an item (not inside a fold)
whose text starts with one of: "The notes", "Sheet <n>, p.", "New here", "Known", "Redrawn here",
"Status:". The paragraph  *The notes, p. 10: defined.*  becomes

  ::: source
  The notes, p. 10: defined.
  :::

(the italics are dropped, because the fold's title "Source" says what it is). The renderer
(layers.lua) shows it as the closed fold "Source". Items that have none are left alone; one
status line per item. Prints how many items and status lines were found and rewritten.

Note, to rename the named fold "Why it is needed" (now "Where it is used") in a page; not run by
this script:

  sed -i '' 's/summary="Why it is needed"/summary="Where it is used"/g' page.Rmd
"""
import re
import sys

OPENINGS = re.compile(r'^(The notes\b|Sheet \d+, p\.|New here\b|Known\b|Redrawn here\b|Status:)')
FENCE_OPEN = re.compile(r'^(:{3,})\s*(\S.*)?$')
CODE_FENCE = re.compile(r'^\s*(`{3,}|~{3,})')


def is_item(attrs):
    return bool(re.search(r'(^|[\s{])\.item(?=[\s}]|$)', attrs or ''))


def convert(lines):
    """-> (new lines, items seen, status lines found)"""
    out = []
    stack = []          # one entry per open fenced div: True for an item whose status line is still open
    in_code = None
    items = found = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        if in_code:
            out.append(line)
            if CODE_FENCE.match(line) and line.strip().startswith(in_code):
                in_code = None
            i += 1
            continue
        m = CODE_FENCE.match(line)
        if m:
            in_code = m.group(1)[0] * 3
            out.append(line)
            i += 1
            continue
        f = FENCE_OPEN.match(line.rstrip('\n'))
        if f:
            attrs = f.group(2)
            if attrs is None:                    # a closing fence
                if stack:
                    stack.pop()
            else:
                item = is_item(attrs)
                items += item
                stack.append(item)               # item: True until its status line is found
            out.append(line)
            i += 1
            continue
        # a paragraph directly inside an item whose status line has not been found yet
        if stack and stack[-1] is True and line.strip():
            j = i
            while j < len(lines) and lines[j].strip() and not FENCE_OPEN.match(lines[j].rstrip('\n')) \
                    and not CODE_FENCE.match(lines[j]):
                j += 1
            para = ' '.join(l.strip() for l in lines[i:j])
            m = re.match(r'^\*(?!\*)(.*?)\*$', para)
            if m and OPENINGS.match(m.group(1).strip()):
                text = m.group(1).strip()
                out += ['::: source\n', text + '\n', ':::\n']
                stack[-1] = False
                found += 1
                i = j
                continue
            out.extend(lines[i:j])
            i = j
            continue
        out.append(line)
        i += 1
    return out, items, found


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    path = sys.argv[1]
    with open(path, encoding='utf-8') as fh:
        lines = fh.readlines()
    if lines and not lines[-1].endswith('\n'):
        lines[-1] += '\n'
    new, items, found = convert(lines)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.writelines(new)
    print(f'{path}: {items} items, {found} status lines rewritten into ::: source')


if __name__ == '__main__':
    main()

<!-- Template: stage 2 of a talk (talk-writing skill, Sg2). Fill every <...>, delete text in [...]
that does not apply, and delete this comment. One brief per builder; with several builders, each
writes its own slides file and the shared pieces are fixed in plan.md beforehand. -->

# Brief, stage 2: build slides <first> to <last> of the talk on <topic>

## Why this task exists

W1. RMB approved `outline.md` (the storyboard) and `plan.md` (the contract) in this folder. You
build [slides <first> to <last> of] the deck with the talk kit into `<deck folder>/`, starting
from a copy of `~/Documents/Works/report-renderer/talk/starter/` [made by <whom>].

W2. The audience: <one line from the outline>.

## What you do

D1. Read in full: the talk-writing skill (`~/Documents/Works/report-renderer/talk/SKILL.md`), the
comments at the top of `kit/engine.js`, `kit/live.js` and `kit/lib.js`, `outline.md`, `plan.md`
and the sources it names.

D2. Build every slide as the outline says: title, states, pictures, live controls, notes
(SKILL.md N1 to N7), colours by the outline's colour map (C1 to C3). Replace all placeholder
content of the starter.

D3. Numbers and formulas exactly as `plan.md` gives them. [Write `test-numbers.mjs`: it
recomputes every live number independently and compares (SKILL.md P2).]

## Check

K1. Run SKILL.md K1 in both themes until all pass, and look at every slide's contact sheet
(K2). Delete the screenshots at the end.

## Output

O1. The deck folder and its built HTML. `notes-build.md` last, at most 300 words: what differs
from the outline and why, the checks' results, the planned minutes and note words, anything
RMB must decide, and "done" on its last line.

## Limits

L1. Read only this brief, the files named in it, this folder and
`~/Documents/Works/report-renderer`. Write only in this folder. Do not edit the kit (`talk/kit/`);
report a kit problem in your notes. No git. No memory or note files outside this folder. No
subagents, other models or web search. No network at build or run time; no package installs.

L2. <The project's data rules, verbatim.>

L3. Final reply: three lines.

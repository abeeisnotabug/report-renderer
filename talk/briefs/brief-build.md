<!-- Template: stage 2 of a talk (talk-writing skill, Sg2). Fill every <...>, delete text in [...]
that does not apply, and delete this comment. One brief per builder; with several builders, each
writes its own slides file and the shared pieces are fixed in plan.md beforehand. -->

# Brief, stage 2: build slides <first> to <last> of the talk on <topic>

## Why this task exists

W1. An earlier session wrote `plan.md` (the contract) in this folder and built sample slides
<numbers> in `<deck folder>/`. RMB approved the sample slides [with corrections, now in
`plan.md` and the samples]. You build [slides <first> to <last> of] the rest of the deck with the
talk kit into `<deck folder>/`. The sample slides are the model for form: how much is on a
slide, how derivations and results are shown, how pictures label their lines, what the notes
say and how long they are.

W2. The audience: <one line from the sample brief>.

## What you do

D1. Read in full: the talk-writing skill (`~/Documents/Works/report-renderer/talk/SKILL.md`), the
comments at the top of `kit/engine.js`, `kit/live.js` and `kit/lib.js`, `plan.md`, the sample
slides and their notes, and the sources `plan.md` names.

D2. Build every slide as `plan.md` says: title, states, pictures, live controls, notes, colours
by its colour map (C1 to C3), in its order and structure, in the form of the sample slides. Do
not change the sample slides. Take markup for each mechanism from `talk/demo/`, never its text,
order or slide kinds.

D2a. Follow SKILL.md N1 to N14. In particular: every symbol, abbreviation and named assumption
defined or restated on the slide where it is used, never by a pointer (N8); no number without
its derivation on the slide, and a number without room for its derivation dropped (N9); the
notation table of `plan.md` (N10); its arrow convention, and each picture says what its lines
mean (N11); results in a box with assumptions and statement (N12); no status tags or review
marks (N14). Notes as in N3: 3 to 6 bullet points per state on what the speaker must understand
and say, numbers with their derivation, no section or line numbers, report labels, file names or
other pointers into sources, earlier slides restated, not numbered.

D3. Numbers, derivations and formulas exactly as `plan.md` gives them. [Write `test-numbers.mjs`: it
recomputes every live number independently and compares (SKILL.md P2).]

## Check

K1. Run SKILL.md K1 in both themes until all pass, and look at every slide's contact sheet
(K2). Delete the screenshots at the end.

## Output

O1. The deck folder and its built HTML. `notes-build.md` last, at most 300 words: what differs
from `plan.md` and why, the checks' results, the planned minutes and note words, anything
RMB must decide, and "done" on its last line.

## Limits

L1. Read only this brief, the files named in it, this folder and
`~/Documents/Works/report-renderer`. Write only in this folder. Do not edit the kit (`talk/kit/`);
report a kit problem in your notes. No git. No memory or note files outside this folder. No
subagents, other models or web search. No network at build or run time; no package installs.

L2. <The project's data rules, verbatim.>

L3. Final reply: three lines.

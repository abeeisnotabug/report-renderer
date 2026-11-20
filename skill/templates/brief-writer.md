<!-- Template: stage 2 of a topic introduction (SKILL.md, "Making a topic introduction", Ti5).
One copy of this common brief serves every writer; the section "Your part" at the end is filled
once per writer (the run script appends it). Fill every <...>, delete text in [...] that does
not apply, and delete this comment. -->

# Brief, stage 2: write one part of a topic introduction on <topic>

## Why this task exists

W1. `sources/<source report>` is a checked report on <topic>[, a companion to <paper>
(`sources/<paper>.txt`, page images in `sources/<paper>.pdf`)]. Its reader, RMB
(`sources/notes/<reader notes>`), wants it rewritten as a **topic introduction**: a page that
reads like a textbook chapter. The rules of that type are in
`~/Documents/Works/report-renderer/skill/topic-introduction.md`.

W2. An earlier session wrote the outline (`outline.md`, approved by RMB, with RMB's changes) and
the writers' plan (`plan.md`). <n> writers write one part each, one after another; a final
session assembles the page. You write the part named at the end of this brief.

W3. The page must read as one text by one author. So follow the plan's notation, labels and
fixed hand-over sentences exactly, and read the parts already written (if any) before you start:
match their voice, and refer back to their items rather than repeating them.

## What you read

R1. In full: `topic-introduction.md` (it overrides `STYLE.md` where they differ),
`~/Documents/Works/report-renderer/STYLE.md`, the markup description at the top of
`~/Documents/Works/report-renderer/layers.lua`, `outline.md`, `plan.md`, every note in
`sources/notes/`, and the parts already written in this folder.

R2. From `sources/<source report>`: the line ranges that `plan.md` gives for your part, plus
whatever else you need to keep the text consistent. [The paper where your part reports it.]

## What you write

D1. Your fragment, `part-N.Rmd` (N your part's number): R Markdown with no YAML header. It holds
your sections in the outline's order, with the paragraph jobs and items the outline gives them,
from the sources the plan gives.

D2. **Content.** Every claim, formula and number comes from the source or from the additions
listed in `plan.md`. Nothing else is new. This is a rewrite of form and order: keep every step
of a derivation that the source has, unless the outline cuts it.

D3. **Form.** The rules in `topic-introduction.md`, in particular: the outline's paragraph jobs,
each paragraph's first sentence stating its move (M5); a section opens with what it adds (M2)
and ends with its hand-over (M3), the plan's **fixed** sentences word for word; prose and items
take turns (P1); the one-word status in the item title (P4); references written for a human
reader (P3); "we" and "let's", never "I" (P6); plain technical English (P7); reasons over
relation signs where the source has them (F2), no display for a step done at a glance (F3);
known results cited from the "Known results" boxes (K1). Lecture links: <none, or as RMB asked
for this report (K2)>. Side-trip folds and sections as the plan names them.

D4. **Display formulas** follow `STYLE.md`.

D5. **Check your part on the page.** Make a test file `test-N.Rmd`: the YAML header of
`sources/<source report>` with `layered: true`, then the fragments written so far, yours last.
From this folder knit it with `Rscript -e 'knitr::knit("test-N.Rmd")'`, render it with
`~/Documents/Works/report-renderer/render.sh test-N.md`, and run
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/test-N.html"`.
Fix every warning of the renderer and every finding of the phone check in your part (a link to
a later part, which does not exist yet, is fine; list it). Read the "Uses:" lines of your items.
Then delete `test-N.*` and its figure files, but keep your fragment.

D6. **Before you finish,** read your part's first sentences alone: they should give the outline
of your sections. Read your part once from top to bottom as RMB would, and cut what serves no
node (H3).

D7. Write `notes-N.md` last, at most 300 words, for the final session: what you could not follow
in the plan or the rules and why, any error you found in the source or in an earlier part (do
not fix another part; report it), and any link to a later part you used.

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only in this folder. No
git. No memory or note files outside this folder. No subagents, other models or web search.

L2. Never open, list or run anything that reads a project file outside this folder[, nor
<folders the project's rules forbid>]. [The R scripts in `sources/` read nothing outside it;
you need not run them, because the plan gives their numbers.]

L3. Final reply: three lines.

## Your part
<!-- One paragraph per writer, in its own file `brief-writer-N.md`, appended by the run script:
"Writer N: `part-N.Rmd`. <its sections, from plan.md>. <which parts are already written: read
them first and cite their items>. `plan.md` section <...> says what goes where. In your test file
put parts 1 to N-1 before yours." The first writer also writes the section "Known results",
because the others cite its boxes; it moves to the end at assembly. -->

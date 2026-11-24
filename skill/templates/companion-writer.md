<!-- Template: stage 3 of a companion (SKILL.md, "Making a companion", Mc4). Copy it into the
work folder as brief-writer.md. One brief serves every writer of every page: the runner replaces
<PAGE> by the page's tag, <K> by the writer's number and <N> by the page's number of writers, and
gives each writer `contract-<PAGE>-<K>.md` (the contract's shared part and its own part). Fill
every other <...>, keep the variant for this companion's type ([lecture: ...] or [paper: ...])
and delete the other, delete text in [...] that does not apply, and delete this comment. -->

# Brief, stage 3: write one part of a companion page

## Why this task exists

W1. RMB wants a **<lecture | paper> companion**: a layered HTML page that goes with <the
lecture's notes, result by result, with the exercises | the paper, in its order>. The rules for
every report are in `~/Documents/Works/report-renderer/STYLE.md`; what differs for this type is
in `~/Documents/Works/report-renderer/skill/<lecture | paper>-companion.md`.

W2. An earlier session wrote the contract of page `<PAGE>`. You are writer <K> of <N> for this
page; the writers work one after another, and a reader then checks the whole page. Your file
`contract-<PAGE>-<K>.md` holds the contract's shared part (opening, notation map, sections,
results used, slips, check list) and your own part (`## Part <K>`: your sections, your items,
your fixed hand-over sentences).

W3. The page must read as one text by one author. Follow the contract's notation, labels and
fixed hand-over sentences exactly, and read the parts of this page already written (if any)
before you start: match their voice, and refer back to their items rather than repeating them.

W4. **The contract is fixed.** Do not change a statement, symbol, label, id or status word. If
one is wrong, keep it and report it in your notes.

## What you read

R1. In full: `STYLE.md`, `skill/<lecture | paper>-companion.md`, the markup description at the
top of `~/Documents/Works/report-renderer/layers.lua` (up to the first function),
`skill/demo/demo.md` (copy markup, never text or placement), every note in `sources/notes/`,
`contract-<PAGE>-<K>.md`, `header-<PAGE>.Rmd`, and the parts of this page already written
(`part-<PAGE>-<j>.Rmd` for every j below <K>; none if <K> is 1).

R2. From the transcripts in `sources/`: only the passages your part needs, as the contract
places them (find them with Grep on the label or the `[p. N]` marker, then Read with offset and
limit). Statements are copied from there verbatim. Read no PDF and no image: a passage that looks
wrong in the transcript is reported in your notes, not checked on the page.
[lecture: For an exercise whose solution follows a source the contract names, that file, only
the exercise's part.]

## What you write

D1. Your fragment, `part-<PAGE>-<K>.Rmd`: R Markdown with no YAML header, your sections in the
contract's order with the items it gives them, ids exactly as in the contract. Write it in one
Write call; then fix what the check (D4) finds with as few edits as possible.

D2. **Content.** Every statement of your sections appears ([lecture: Lc1] [paper: Pc1]). Steps
follow the source's proof and add every step the reader does not do at a glance; a proof the
source leaves out is written here, marked as its status line says. Steps are a chain of equations
with the reasons on the line or in a Why fold (F2). Nothing passed off as obvious that is not.

D3. **Form.** The rules of `STYLE.md` and the type file, in particular: a section opens with a
"So far." recap and then what it adds (M2), and ends with its hand-over (M3), the contract's
fixed sentences word for word; a paragraph's first sentence states its move (M5); prose and items
take turns (P1); references written for a human reader (P3); "we", never "I" (P6); "In words"
folds after displays that define or derive (P7); checks after definitions and results (F4);
figures only where E1 holds (TikZ as `fig-<PAGE>-<name>.tex`, compiled with
`~/Documents/Works/report-renderer/tikz2svg.sh`; plots in R chunks); examples as the contract
gives them (E3); display formulas as `STYLE.md`, "Display formulas", says.
[lecture: Exercises with the task, a Hint fold that names the property needed and not the
mechanism, and the solution fold the contract names (Lc6); slips in a "Slip in the notes" or
"Slip in the sheet" fold where they occur (Lc7).]
[paper: The paper's equations as printed, with section and page, next to the page's version and
its term-by-term notation map (Pc3); status lines with the verbs of Pc5; each folding section's
plain-words fold, written last, after the section is done (Pc6, SKILL.md L3).]
If <K> is <N> (you are the last writer), also: the slips overview (Lc7) or own-commentary sections (Pc5), the
conclusion (M8), and the final section of results used (Lc8 or Pc8), as the contract places
them.

D4. **Check your part on the page.** Make `test-<PAGE>-<K>.Rmd`: `header-<PAGE>.Rmd`, then the
parts of this page written so far, yours last. From this folder:
`Rscript -e 'knitr::knit("test-<PAGE>-<K>.Rmd")'`, then
`~/Documents/Works/report-renderer/render.sh test-<PAGE>-<K>.md`, then
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/test-<PAGE>-<K>.html"`.
Fix every renderer warning and phone-check finding in your part; build again only after a round
of fixes, not after each one. Links to later parts or other pages may be missing; list them.
Read the "Uses:" lines of your items. Then delete `test-<PAGE>-<K>.*`; keep your fragment and
figure files.

D5. **Before you finish,** read your part's first sentences alone: they should give the outline
of your sections. Read the part once from top to bottom as RMB would, and cut what serves no node
(H3).

D6. Write `notes-<PAGE>-<K>.md` last, at most 300 words, for the reader: what you could not
follow in the contract or the rules and why, errors you found in the contract, a transcript or an
earlier part (do not fix another part; report it), transcript passages that looked wrong, links
to later parts, the figure files you made, and your part's word count.

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only in this folder. No
git. No memory or note files outside this folder. No subagents, other models or web search.

L2. Never open, list or run anything outside this folder and the renderer folder.

L3. Final reply: three lines.

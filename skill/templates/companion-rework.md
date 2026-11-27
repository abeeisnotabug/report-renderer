<!-- Template: the planner of a companion rework (SKILL.md Mc9): one finished page brought up to
rules that came after it was written. Copy into the work folder as brief-rework.md; the runner
(run-companion.sh with REWORK=1) replaces <PAGE> by each page's tag and appends
brief-rework-<page>.md (one paragraph per page: file, range, what it already has, the transcripts
of its slips). Fill every other <...>, delete text in [...] that does not apply, and delete this
comment. One session per page; pages side by side or one after another. -->

# Brief: bring one finished companion page up to the current rules

## Why this task exists

W1. RMB has a finished <lecture | paper> companion, rendered with RMB's report renderer
(`~/Documents/Works/report-renderer`). Its body is `part-<PAGE>-1.Rmd` in this folder (its YAML
header is `header-<PAGE>.Rmd`; the page as it was is `before-<PAGE>.Rmd`). Its content stays: the
statements, the steps, the solutions and the slip folds are checked and are not your task. The
rules have changed since it was written, and you bring the page up to them in three points:

W1a. **Interactive figures.** Every plot is an interactive figure, and there are as many as
`STYLE.md`, "Interactive figures", "How many", asks. You do not draw them: you write the list
that figure workers build from, and you put a marker line where each figure goes.

W1b. **Visible slip lines** ([lecture: Lc7] [paper: Pc5]): a slip that makes a statement the
reader sees with every fold closed wrong is flagged right after the statement, in one visible
line.

W1c. **The reading guide** names the folds the page now has.

W2. After you, other stages work on the same file: figure workers replace your markers by figures;
a punch stage writes a need line ("Why here") and a punch ("Why it holds", "What it demands",
"What it shows", "Key idea") into every item; the theme is set by script; a reader and a fixer
check the result. Do not write need lines, punches or figure code yourself.

## What you read

R1. In full: in `~/Documents/Works/report-renderer/STYLE.md` the sections "Figures, examples,
tables, code", "Figures and plots" (with "Interactive figures") and "Page";
`~/Documents/Works/report-renderer/skill/<lecture | paper>-companion.md`; the markup
description at the top of `~/Documents/Works/report-renderer/layers.lua` (up to the first
function).

R2. `part-<PAGE>-1.Rmd`, top to bottom, once (it is long: read it in pieces with offset and
limit). Write down as you go: each R chunk and what it does, each item where a reader could move
something, each slip fold.

R3. The transcripts in `sources/transcripts/` only for a slip's passage (Grep for its page or
label, then Read with offset and limit). No PDF, no image.

## What you do

D1. **Sort every R chunk** by reading its body, not only its name:
D1a. A chunk that includes a static figure (a TikZ SVG, for example with
`knitr::include_graphics`): keep it, with its caption.
D1b. A chunk that draws a plot: delete the chunk with its `fig.cap`, and the sentence before it
that leads into it or cites it; put the marker line `<!-- live: <id> -->` in its place; and give
the figure an entry in the list (D3) that keeps what the plot showed and how it was made (law,
sample size, seed, grid, from the chunk's code).
D1c. A chunk that computes numbers the text quotes: keep the computation, hidden
(`include=FALSE`), so the numbers stay; if it also draws, the drawing becomes a figure as in D1b.
D1d. The setup chunk stays.

D2. **New figures.** Go through every item and ask what a reader could move in it ("How many" in
`STYLE.md`): a parameter, a sample size or a mesh going to its limit, a law chosen among several,
a point or a time, a hypothesis switched off, the steps of a construction; for an exercise, what
shows why the answer is what it is without giving the solution away. Each such item gets a
figure, with a marker after the item's closing `:::` (or before the item, or inside a figure item
of the source).

D3. **The figure list** `figs-<PAGE>.md`, for the figure workers (each gets a few consecutive
entries plus everything before the first entry): first one short paragraph: the page and where
its notation section stands. Then one entry per figure, in page order, headed `## <id>` (lower
case, letters, digits and hyphens, unique on the page), with: its place (the item's id and
"after", "before" or "inside"; for a replaced plot "replaces the plot <chunk name>"); what it must
make visible, as one claim the reader should see; the controls (two or three) and what moving
each shows; the construction where it matters (law, formula, grid, seed); and the reason it earns
its place (E1).

D4. **Figure numbers.** Interactive figures have no number: the text cites them by its lead-in
sentence. Static figures keep a numbered caption ("**Figure 2.**"). After D1, renumber the static
figures in page order if a number changed, and fix every citation: Grep for `Figure [0-9]` in the
part and make each one name the right static figure, or, for a removed plot, point to its
interactive figure in words.

D5. **Slip lines.** For each slip fold ("Slip in the notes", "Slip in the sheet"): if the slip
makes something wrong that the reader sees with every fold closed (the statement, a visible
formula), add right after that statement the line
`**Slip in the notes:** <what is wrong>; corrected: <the corrected formula or clause>.` (or "Slip
in the sheet"). The fold keeps its explanation. A slip that only concerns a fold's content gets no
line.

D6. **Reading guide.** In the section "How to read this page", the list of what the folds hold
gains: "Why here" (why the page needs the item at this point), "Why it holds", "What it demands",
"What it shows" (the punch: why a result holds, what a definition demands, what an example shows),
"Key idea" (an exercise's decisive idea, before its solution), and "How it is computed" (under each
interactive figure: what it simulates or computes). Keep the guide's form; change nothing else in it
unless a sentence has become false.

D7. Change nothing else: no statement, step, solution, label, status or slip fold. If you find an
error, report it in your notes, do not fix it.

D8. **Check.** Make `test-<PAGE>.Rmd` = `header-<PAGE>.Rmd` and the part; from this folder:
`Rscript -e 'knitr::knit("test-<PAGE>.Rmd")'`,
`~/Documents/Works/report-renderer/render.sh test-<PAGE>.md`,
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/test-<PAGE>.html"`.
Fix what your edits broke (markers are HTML comments and render as nothing). Then delete
`test-<PAGE>.*`.

D9. Last, `rework-<PAGE>.md` (at most 300 words): the R chunks and what you did with each (kept,
replaced by <id>, hidden); the number of new figures; the slip lines added (item ids); figure
numbers changed; errors you found and did not fix.

## Limits

L1. Edit only `part-<PAGE>-1.Rmd`; write only `figs-<PAGE>.md`, `rework-<PAGE>.md` and the test
files. Read only this folder and the renderer folder. No git, no memory files, no subagents, other
models or web search.

L2. Final reply: three lines.

## Your page

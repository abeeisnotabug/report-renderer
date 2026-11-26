<!-- Template: one figure worker for a companion page (SKILL.md Mc4a) or any report. Copy into the
work folder as brief-figures.md. In a companion run, run-companion.sh fills <PAGE> and <K> and
appends the worker's list `figs-<PAGE>/list-<K>.md` (cut from the contract's `figs-<PAGE>.md`:
one entry per figure, `## <id>`, with its place, what it must make visible, and its controls).
Outside the runner, the conductor writes the list and appends it. Fill every other <...>, delete
text in [...] that does not apply, and delete this comment. Workers run side by side; each writes
only in its own folder, never the page. -->

# Brief: make the figures of list <K> for page <PAGE>

## Why

W1. The page is `page-<PAGE>.Rmd` in this folder, a <lecture companion | paper companion | topic
introduction> on <what the page covers>, rendered with RMB's report renderer. RMB, a
mathematician and statistician who knows R well (not web programming), reads it on a phone and a
laptop, in light and dark mode.

W2. RMB's rule (2026-11-25, final): every plot is an **interactive figure**: a slider, a switch
or a point to drag shows how the picture changes, and a closed fold "How it is computed" says in
words and formulas what is drawn. No R plots: RMB seldom reads the code. A plot in the source is
not reproduced as it stands; draw the page's own version with controls. Every figure must deepen
the understanding of the item it sits next to; it is judged by `STYLE.md` E1 (what a figure must
do), E2 (captions) and "Interactive figures".

W3. Your list (appended below) fixes for each figure its id, place and what it must make
visible. It is the contract: do not move, drop or add figures. If an entry is wrong
mathematically or cannot work as specified, do the closest correct thing and say so in your notes.

## What you read

R1. In full: in `~/Documents/Works/report-renderer/STYLE.md` the sections "Figures, examples,
tables, code" and "Figures and plots" (with "Interactive figures"); the comment at the top of
`~/Documents/Works/report-renderer/livefig.js` (how a figure script is written); the lines on
interactive figures at the top of `layers.lua`.

R2. From `page-<PAGE>.Rmd`: the YAML header, the notation section, and for each of your figures
the item it sits next to: find the marker `<!-- live: <id> -->` with Grep and read that item with
offset and limit. Not the whole page.

R3. The transcripts in `sources/transcripts/` only where an item's statement is not enough.

## What you write

D1. Everything in the folder `figs-<PAGE>/`. For each figure `<id>` of your list, a fragment
`frag-<id>.Rmd`: exactly the R Markdown that replaces the marker on the page. It starts with one
sentence of running text that leads into the figure and cites it ("Figure: ..." is not a
sentence), except inside a figure item of the source, whose caption the page already has. Then:
- the markup `::: {.live src="live-<id>.js" #fig-<id>}` with the caption inside (E2: first
  sentence the claim, then what each control does), and the script `live-<id>.js` beside the
  fragment;
- right after it, a closed fold `::: {.fold summary="How it is computed"}`: in words and formulas,
  what is simulated or computed for each control value (grid, seed, formula), so the figure
  can be trusted without reading JavaScript.
Labels and text in the figure use the page's notation. Colours only from the theme (never a
literal colour), so that light and dark mode and the page's theme work.

D2. Correctness first: every simulated object has exactly the law the page defines (state the
construction in the caption or fold); fixed seeds, so the figure is the same at each load;
grids fine enough that what the figure claims is visible.

D3. Check your figures on a test page in `figs-<PAGE>/`: `test-<K>.Rmd` = the YAML header of
`page-<PAGE>.Rmd`, then your fragments in order. From that folder:
`Rscript -e 'knitr::knit("test-<K>.Rmd")'`, `~/Documents/Works/report-renderer/render.sh test-<K>.md`,
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/test-<K>.html"`
(it also moves every control to its ends, in light and dark mode). Fix every warning, error and
overflow. Do not read images of the result: the conductor looks at the figures at the end
(SKILL.md Mc7).

D4. Last, `figs-<PAGE>/notes-<K>.md` (at most 250 words): for each figure, one line on what it
shows and anything you changed from the list and why; the files you wrote.

## Limits

L1. Read only the files named here. Write only in `figs-<PAGE>/`. No git, no subagents, no web.
Do not edit the page, the parts or the renderer; a renderer problem goes into your notes.
L2. Final reply: three lines.

# Your list (worker <K>)

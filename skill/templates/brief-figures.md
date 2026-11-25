<!-- Template: one figure worker for a report or companion page. Copy into the work folder as
brief-figures.md; the runner appends the worker's own list `figs-<K>.md` (one entry per figure:
id, kind, place, what it must make visible, controls for an interactive one). Fill every <...>,
delete text in [...] that does not apply, and delete this comment. Workers run side by side;
each writes only its own files, never the page. -->

# Brief: make the figures of list <K> for a page

## Why

W1. The page is <page: title, file>, a <lecture companion | paper companion | topic
introduction> rendered with RMB's report renderer. RMB, a mathematician and statistician who
knows R well (not web programming), reads it on a phone and a laptop, in light and dark mode.

W2. RMB's rule for the two kinds (2026-11-25): an **R plot** where the construction is the point:
the data are simulated in R in the page's notation, and the code sits folded under the plot, so
that RMB sees exactly what is drawn and how the construction works. An **interactive figure**
where a parameter or a choice is the point: a slider, a switch or a point to drag shows how the
picture changes. Every figure must deepen the understanding of the item it sits next to; it is
judged by `STYLE.md` E1 (what a figure must do) and E2 (captions).

W3. Your list `figs-<K>.md` (appended below) fixes for each figure its id, kind, place and what
it must make visible. It is the contract: do not move, drop or add figures. If an entry is wrong
mathematically or cannot work as specified, do the closest correct thing and say so in your notes.

## What you read

R1. In full: in `STYLE.md` the sections "Figures, examples, tables, code" and "Figures and
plots"; <for interactive figures: the docs of the interactive figures (the file the renderer
feature names)>; <the type file, e.g. skill/lecture-companion.md, rules on figures and code>.

R2. From the page source <page source path>: the setup chunk at the top, <an existing R plot
chunk as the model of style>, and for each of your figures the item it sits next to (find it by
its id with Grep, read that item with offset and limit). Not the whole page.

R3. The notes' transcripts in <transcripts folder> only where an item's statement is not enough.

## What you write

D1. For each figure `<id>`, a fragment `frag-<id>.Rmd`: exactly the R Markdown that goes into the
page at its place, starting with one sentence of running text that leads into the figure and
cites it ("Figure: ..." is not a sentence). The figure:
- R plot: one R chunk, `echo=TRUE`, with `fig.cap` (E2), chunk label `<id>`, plotting in the
  style of the page's existing plots; the code readable for an R user: the construction in the
  page's notation, a comment per step, no plotting tricks that hide the maths.
- Interactive: the markup of the interactive figure (caption inside it, E2: first sentence the
  claim, then what each control does), the script `live-<id>.js` beside the fragment, and a
  closed fold `::: {.fold summary="How it is computed"}` right after it: in words and formulas,
  what is simulated or computed for each control value (grid, seed, formula), so the figure
  can be trusted without reading JavaScript.
Labels and text in the figure use the page's notation. Colours only from the theme (never a
literal colour), so that light and dark mode and the page's theme work.

D2. Correctness first: every simulated object has exactly the law the page defines (state the
construction in the caption or fold); fixed seeds, so the figure is the same at each load;
grids fine enough that what the figure claims is visible.

D3. Check your figures on a test page: `test-<K>.Rmd` = the page's YAML header and setup chunk,
then your fragments in order. Knit, render, phone-check from this folder:
`Rscript -e 'knitr::knit("test-<K>.Rmd")'`, `<renderer>/render.sh test-<K>.md`,
`NODE_PATH=$(npm root -g) node <renderer>/phone-check.js "$PWD/test-<K>.html"`
[and the interactive check the feature's docs name]. Fix every warning, error and overflow. Do
not read images of the result: a later stage looks at the figures.

D4. Last, `notes-<K>.md` (at most 250 words): for each figure, one line on what it shows and
anything you changed from the list and why; the files you wrote.

## Limits

L1. Read only the files named here. Write only in this folder <work folder>. No git, no
subagents, no web. Do not edit the page or the renderer; a renderer problem goes into your notes.
L2. Final reply: three lines.

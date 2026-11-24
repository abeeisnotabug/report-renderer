<!-- Template: stage 5 of a companion (SKILL.md, "Making a companion", Mc5). Copy it into the
work folder as brief-fixer.md; the runner replaces <PAGE> by each page's tag. Fill every other
<...>, keep the type's variant, and delete this comment. -->

# Brief, stage 5: apply the reader's findings to one companion page

## Why this task exists

W1. A reader listed the problems of the <lecture | paper> companion `page-<PAGE>` that the rules,
the contract or a transcript settle, in `review-<PAGE>.md`. You apply them, nothing else.
Questions that need a decision are in `open-<PAGE>.md`; they wait for RMB, and you leave the
places they name as they are. The rules are `~/Documents/Works/report-renderer/STYLE.md` and
`skill/<lecture | paper>-companion.md`; the contract is `contract-<PAGE>.md`.

## What you do

D1. Read `review-<PAGE>.md`, `open-<PAGE>.md`, and the parts `part-<PAGE>-*.Rmd` where the
findings point. Edit the parts (not `page-<PAGE>.Rmd`, which the runner generates). Apply each
finding. Do not change any other statement, formula or label. A finding you find wrong, or one
that touches a place named in `open-<PAGE>.md`: skip it and say why.

D2. Rebuild once, after all edits: from this folder, `cat header-<PAGE>.Rmd` followed by the parts
in order (a blank line between) into `page-<PAGE>.Rmd`; then
`Rscript -e 'knitr::knit("page-<PAGE>.Rmd")'`,
`~/Documents/Works/report-renderer/render.sh page-<PAGE>.md`, and
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/page-<PAGE>.html"`.
Fix what your edits broke. Links to other pages of the same run may be missing; ignore them.

D3. Write `fixed-<PAGE>.md` last, at most 200 words: each finding with done or skipped (why).

## Limits

L1. Write only in this folder. Read only this folder and the renderer folder. No git, no memory
files, no subagents, other models or web search.

L2. Final reply: three lines.

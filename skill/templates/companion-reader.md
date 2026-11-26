<!-- Template: stage 4 of a companion (SKILL.md, "Making a companion", Mc5). Copy it into the
work folder as brief-reader.md; the runner replaces <PAGE> by each page's tag. Fill every other
<...>, keep the type's variant, and delete this comment. -->

# Brief, stage 4: read one companion page once and list what breaks it

## Why this task exists

W1. Several writers, one after another, wrote the <lecture | paper> companion `page-<PAGE>` from
a fixed contract, `contract-<PAGE>.md`. Writers working one after another drift. You are a fresh
reader (big-tasks T6): you read the whole page once and **list** problems; you do not rewrite.

W2. The run goes on without anyone looking in between: a fixer applies **every** finding you put
into `review-<PAGE>.md`, and RMB answers the questions in `open-<PAGE>.md` after the run. So sort
each problem: a finding the rules, the contract or a transcript settle goes into the review; a
problem that needs a decision (a change to the contract, a status that may be wrong, a statement
that may differ from the source, anything you are unsure of) goes to RMB.

## What you read

R1. `~/Documents/Works/report-renderer/STYLE.md` and `skill/<lecture | paper>-companion.md` in
the same folder, `contract-<PAGE>.md` (its check list is for you), `items-<PAGE>.txt` (every numbered statement
of the source and its item), the writers' notes
`notes-<PAGE>-*.md`, the figure workers' notes `figs-<PAGE>/notes-*.md`, the reports of the two
scripts after them (`figures-<PAGE>.md`, `punches-<PAGE>.md`), the build output `build-<PAGE>.out` (renderer warnings and the phone check),
and the knitted page `page-<PAGE>.md`, top to bottom, once. Transcripts in `sources/transcripts/` only to
check a statement or formula that looks wrong, and only that passage (Grep, then Read with offset
and limit). No PDF, no image.

## What you look for

L1. Contradictions: two places that state the same thing differently (a statement, a formula,
notation, a status).

L2. Repeated derivations or explanations: name the first place and the repeat.

L3. Broken references: a label cited that does not exist, a "Uses:" line that misses what an item
uses, a fixed hand-over sentence that was changed, a section or item of the contract or of
`items-<PAGE>.txt` missing.

L4. Every problem the writers' notes report that is still open.

L5. Every renderer warning and phone-check finding in `build-<PAGE>.out`, except links to other
pages of the same run (they resolve when the pages are built together).

L6. A statement that differs from the contract or the transcript, a step that is wrong, or a
claim passed off as obvious that is not.

L7. Interactive figures: a figure of the contract's list `figs-<PAGE>.md` that is missing, a
marker `<!-- live: ... -->` still in the page, a caption or "How it is computed" fold that
disagrees with the item or the notation. Need lines and punches ("Why here", "Why it holds" and
the others): one that is mathematically wrong, or a key idea that gives an exercise's solution
away. These texts were chosen to RMB's taste by a separate stage: a problem with one goes to
`open-<PAGE>.md`, never to the review, unless it is a plain error of fact or notation.

## What you write

D1. `open-<PAGE>.md`, first (write it even if it is empty): the questions for RMB, each one
paragraph labelled Q1, Q2, ...: the place (section and item label), the problem, the options in
one or two sentences. At most 400 words.

D2. `review-<PAGE>.md`, last: the findings for the fixer, each one paragraph labelled R1, R2, ...
(most important first): the place, the problem, and the fix exactly enough to apply without a
decision. At most 900 words. End with one line: the page's word count outside folds, if you can
tell.

## Limits

L1. Write only `open-<PAGE>.md` and `review-<PAGE>.md`. Read only this folder and the renderer
folder. No git, no memory files, no subagents, other models or web search.

L2. Final reply: three lines.

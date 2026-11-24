<!-- Template: optional stage of a companion, run on finished pages (SKILL.md, "Making a
companion", Mc8). Copy it into the work folder as brief-mathcheck.md; the runner replaces <PAGE>
and <K> for each part and appends brief-mathcheck-<page>-<k>.md, a short "Your part" section that
lists exactly the transcript files and line ranges, sheets and solutions that part touches
("none" where it needs none), so that no session reads more than its part needs. Fill every other
<...>, keep the type's variant, and delete this comment. -->

# Brief: check the mathematics of one part of a companion page, and correct it

## Why this task exists

W1. `part-<PAGE>-<K>.Rmd` is one part of the <lecture | paper> companion `page-<PAGE>`, which
retells <source> with added steps, solutions and examples. The page is finished and has been read
for coherence, but nobody has checked its mathematics line by line. You do that for this part, in
a fresh session, and correct what is wrong. Other sessions check the other parts at the same
time; you touch only your part.

## What you read

R0. Few calls: every call re-reads your whole context. Read each file once, in the fewest slices
your reading tool allows; do not re-read your part after editing it; collect the corrections of one
section and apply corrections that sit close together in one Edit.

R1. `part-<PAGE>-<K>.Rmd` in full. Keep its markup (fenced divs, item ids, folds) as it is; read the
markup description at the top of `~/Documents/Works/report-renderer/layers.lua` only if you add or
rewrite markup.

R2. From `sources/transcripts/`: exactly the files and line ranges that the section "Your part"
at the end of this brief lists, and nothing else unless a citation in your part sends you there
(then only that place, found with Grep; name the file in every Grep). Small files (a sheet, a
solution file) are read whole rather than found piece by piece. The transcripts were checked against the page images, so a formula that is
merely unusual is not a doubt. Note truly doubtful transcript formulas while you read, and check
them together at the end, in one Read of the PDF (`sources/<pdf>`, with a `pages` range of at
most 3 pages); a doubt that would need more pages goes under D2 instead. Otherwise read no images.

R3. Where an exercise solution says it follows RMB's own solution: the solution files that "Your
part" lists (<where RMB's solutions are, and how they mark help and additions>).

## What you check

C1. Every statement against the source transcript: hypotheses, quantifiers, formulas, labels.
A statement the page restates must say what the source says; a slip of the source is corrected
only in its "Slip in the ..." fold, and the statement itself stays as the source has it.

C2. Every step of every Steps fold, solution, example and "The computation in full" fold: does
each line follow from the previous ones and from what it cites? Is each cited result the right
one, with its hypotheses met? Are cases, signs, indices, limits and measurability claims right?
Is a step passed off as obvious that is not?

C3. Every number in an example or a figure caption that can be checked by hand or by a short R
computation (run R from this folder if needed; nothing of it goes on the page).

C4. The status lines: a *Reminder* must follow the source's proof; a proof the page adds must not
be called *Reminder*.

## What you do

D1. **Correct each definite error in place** with the smallest edit that makes the part right:
same notation, same voice, same markup, same labels and ids. Where a step is missing, add it.
Where a proof is wrong and cannot be mended locally, rewrite that proof's Steps. Do not restyle,
shorten or reorder text that is correct.

D2. **Doubts you cannot settle** (the source is ambiguous, two readings are possible, a fix would
change a statement of the source): do not edit; list them.

D3. Write `mathcheck-<PAGE>-<K>.md` last, at most 600 words: first a line with the number of
items checked and the number of errors corrected; then each correction as one paragraph (place
by item label, what was wrong, what it says now); then the doubts (D2), each with the place and
the question; then errors of the source you found that the page does not yet mark as slips.

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only `part-<PAGE>-<K>.Rmd`
and `mathcheck-<PAGE>-<K>.md`. No git. No memory or note files. No subagents, other models or web
search.

L2. Never open, list or run anything outside this folder and the renderer folder.

L3. Final reply: three lines.

## Your part


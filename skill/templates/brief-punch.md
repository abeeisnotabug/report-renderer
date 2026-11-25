<!-- Template: punches and need lines for the items of a report or lecture companion (RMB, 2026-11-25;
study and results: big-tasks "Measured facts", 2026-11-25). Copy into the work folder as
brief-punch.md, fill every <...>, delete this comment. Append `punch-examples.md` (RMB's picks, with
RMB's comments) after it. Engines, from blind tests against RMB's own picks: Codex gpt-6.2-astra
(high) writes the punches, Claude Opus (high) the need lines; run both on the same brief and take
each engine's field. Examples beat rules: a brief with these examples and no rule list won 6 of 7
punches and 7 of 8 need lines against a brief with 33 rules. Do not add rules here; add RMB's next
picks to punch-examples.md instead. -->

# Brief: write a "punch" and a "need line" for every item of a page

W1. The reader is RMB, a mathematician and statistician <reading situation: e.g. working through
a course's notes alone, without a lecturer>. The page is <page: title, what it covers>. For each
item RMB wants two short texts:
- a **punch**: what makes the item true or necessary, in as few words as the idea allows: for a
  result, the reason it holds; for a definition, what it demands beyond the obvious weaker notion;
  for an example, what it shows; for an exercise, the decisive idea (it stays in a closed fold, so
  it may give the idea away; write "none" if a punch would give away the whole solution);
- a **need line**: why the page needs this item at this point, what the items before it leave
  open, so that the item feels inevitable rather than one more fact ("none" where the step is
  obvious).
There are no further rules. What RMB means is shown by the examples at the end, RMB's own picks
among many candidates on another page, with RMB's comments. Learn from them what makes a good
punch and a good need line for this reader, and write in that spirit; do not copy their wording.

W2. Input: `items.md` in this folder (every item, statement only, under `## <id>`), made by script
from the page. The sources are here too (<transcripts>): read a passage only when you need an
item's proof idea (search, then read the passage).

T1. For every item of `items.md`, in order:

    ## <id>
    Punch: <text, or "none">
    Need: <text, or "none">

No preamble, no closing remarks.

L1. Read only the files of this folder. Write only the output file named at the end. No git, no web.

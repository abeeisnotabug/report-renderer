<!-- Template: punches and need lines for the items of a report or lecture companion (RMB, 2026-11-25;
study and results: big-tasks "Measured facts", 2026-11-25). Copy into the work folder as
brief-punch.md with `punch-examples.md` beside it, fill every <...>, delete this comment. In a
companion run, run-companion.sh does the rest (SKILL.md Mc4b): it fills <PAGE>, makes
`punch-items-<PAGE>.md` from the page (tools/punches.py items), appends punch-examples.md (RMB's
picks, with RMB's comments) and the output file's name, runs Codex gpt-6.2-astra (high) and
Claude Opus (high) on the same brief side by side, and puts astra's punches and Opus's need lines
into the parts (tools/punches.py insert; the punch's kind comes from the item). Engines, from
blind tests against RMB's own picks: astra won the punches, Opus the need lines. Examples beat
rules: a brief with these examples and no rule list won 6 of 7 punches and 7 of 8 need lines
against a brief with 33 rules, which had pushed both engines into compressed, hard-to-parse text.
Do not add rules here; add RMB's next picks, with RMB's comments, to punch-examples.md instead.
For the conductor, not for the brief: what RMB likes and rejects, in sum. Likes: plain words,
readable in one pass; restating what we already have; saying what a result does not settle;
reusing the item's exact terms (e.g. "symmetric bilinear") so the reader can connect them; need
lines that give a new perspective or a real reason for the item here. Rejects: text that needs
several readings; notions RMB does not know ("sub-/superadditive"); proof-step register; too much
packed after a comma; pedantic need lines; a punch for an exercise that gives the solution away;
a need line where the step is obvious. Use this to judge a run's output and to pick new examples. -->

# Brief: write a "punch" and a "need line" for every item of a page

W1. The reader is RMB, a mathematician and statistician <reading situation: e.g. working through
a course's notes alone, without a lecturer>. The page is `page-<PAGE>.Rmd` in this folder (its
title in the YAML header says what it covers; read only the header). For each
item RMB wants two short texts:
- a **punch**: what makes the item true or necessary, in as few words as the idea allows: for a
  result, the reason it holds; for a definition, what it demands beyond the obvious weaker notion;
  for an example, what it shows; for an exercise, the decisive idea (every punch is a closed fold of the
  item, so the idea may be given away there; write "none" if a punch would give away the whole solution);
- a **need line** (a closed fold "Why here", the item's first fold): why the page needs this item at this point, what the items before it leave
  open, so that the item feels inevitable rather than one more fact ("none" where the step is
  obvious).
There are no further rules. What RMB means is shown by the examples at the end, RMB's own picks
among many candidates on another page, with RMB's comments. Learn from them what makes a good
punch and a good need line for this reader, and write in that spirit; do not copy their wording.

W2. Input: `punch-items-<PAGE>.md` in this folder (every item, statement only, under `## <id>`),
made by script from the page. The sources are in `sources/transcripts/`: read a passage only
when you need an item's proof idea (search, then read the passage).

T1. For every item of `punch-items-<PAGE>.md`, in order:

    ## <id>
    Punch: <text, or "none">
    Need: <text, or "none">

No preamble, no closing remarks.

L1. Read only the files of this folder. Write only the output file named at the end. No git, no web.
Final reply: one line.

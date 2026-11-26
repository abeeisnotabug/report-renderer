# Lecture companions

What differs for a lecture companion. Everything else is in `STYLE.md`, which holds for every
report: its teaching rules (prose that weaves the items into a narrative, recaps, "In words"
folds, figures, plots and tables, examples) apply here in full.

Lc1. **Order and coverage.** The page follows the lecture's order. Every statement of the
lecture's notes appears, including the proofs the notes leave to exercises and the material not
covered in class. These statements are nodes of the outline by definition (H3); explanations,
steps, figures, examples and overviews are added to them. A statement that goes beyond the
lecture is marked **(beyond the lecture)**.

Lc1a. **Items are copied, running text is explained** (RMB, 2026-11-25). The notes' numbered
items (definitions, results, examples, remarks with a number) and boxed exercises are copied
verbatim. Their running text is not: the page follows its flow in its own words, keeps the notes'
displays, explains each display right after it (its steps directly under it, not after the whole
passage), and quotes a sentence only where the wording matters. Running text never becomes a page
item just to be covered, and it is never labelled with a kind word the notes do not give it. A
claim made in running text still appears (Lc1), in the prose or, if it needs a proof, as a page
item stating just that claim.

Lc1b. **Need lines and punches** are closed folds of the item. Every item gets both from a stage
of their own after the writers (SKILL.md Mc4b), unless the text would be "none"; the writers write
none. An item carries a need line
(`::: need`, written before it or inside it: why the page needs it at this point; fold "Why
here", the item's first fold) and a punch (`::: {.punch kind="why"}`: why a result holds, fold
"Why it holds"; "demands": what a definition requires beyond the obvious weaker notion, "What it
demands"; "shows": what an example shows, "What it shows"). For an exercise the punch is its key
idea (`kind="key"`, fold "Key idea", before the Solution). The renderer fixes the order of an
item's folds (`STYLE.md`, "Layered page"). Running text that is treated like an item may carry
them too, as folds where they stand. Markup: the top of `layers.lua`; how they are written:
`skill/templates/brief-punch.md`.

Lc2. **Labels.** The lecture's numbers are the primary labels ("Lemma 3.38"). A lecture item's
title is "**Theorem 2.3. [core] Descriptive title.**", without repeating the kind word. The
page's own items get section letters and a kind word ("**M1. [core] Remark: ...**"). How
citations of the lecture, its exercise sheets, tutorials and other pages are written: the top of
`layers.lua`.

Lc3. **Opening.** After the opening of M1:
- a reading guide, "How to read this page": what the folds hold, what the labels and the status
  lines mean, where the numbers come from, which sources (notes, sheets, solutions) the page
  uses, and how slips are marked;
- a section "Big picture" with a map of the core items.

Lc4. **Sections follow the lecture's sections**, with the lecture's section number in the title
("(§3.2)"). The page's own sections (overviews, a question the lecture leaves open) are placed
where they serve the order of the lecture.

Lc5. **Status lines.** Each item has one, in its closed fold "Source" (`::: source`, after the
statement in the source; the renderer places the fold near the end). It says where the item comes
from and whose the steps are:
- the source, with its page or number, and what it does with the statement: *defined*;
  *stated* (no proof there); *derived* (proved there); *set* (an exercise);
- the steps on the page, with one of: *Reminder* (they follow the source's proof, with steps
  added; only after comparing with the source's text); *Known for new objects* (a source's proof,
  redone for other objects, which the line names); *Second route* (the source proves it, the page
  another way, with what that adds); *New here* (no source proves it); *Known* (not proved on the
  page; the line says where it is proved).
- Overview items prove nothing; their line is *Known*, with each row citing the item that proves
  it.

Lc6. **Exercises** (the sheets' and the lecture's boxed ones) go where they fit in the lecture's
order: the task; a fold "Hint" that names the property needed, not the mechanism; and a fold
"Solution (official)" or "Solution (this page's)". An exercise has no Steps fold. Its "Uses:"
line sits inside the solution (the renderer puts it there), so it does not give the tools away;
every other item's list is the last closed fold, "Uses". The fold order of an exercise: Hint,
Key idea, Solution (red), Source, Uses.
Errors in a sheet or an official solution are pointed out where they occur.

Lc7. **Slips.** A slip in the notes or a sheet (a wrong cross-reference, a missing hypothesis, a
typo in a formula) is corrected in a fold "Slip in the notes" (or "Slip in the sheet") where it
occurs, with the corrected statement. All slips are collected again in an overview at the end.
A reader may keep folds closed (so as not to see solutions), so a slip that makes a visible
statement wrong is also flagged in the visible text: right after the statement, one line
"**Slip in the notes:** <what is wrong>; corrected: <the corrected formula or clause>." The fold
keeps the explanation (RMB, 2026-11-24).

Lc8. **Final section** of results used without proof (K1): "Earlier results used", restating each
result cited from earlier courses or chapters under its source's number.

Lc9. **Plots are interactive figures**, each with its "How it is computed" fold; no R plots, and the notes' own plots are replaced by the page's versions with controls (`STYLE.md`, "Interactive figures"; RMB, 2026-11-25). As many as "How many" there asks: the contract lists them, figure workers build them after the writers (SKILL.md Mc4a).

Lc10. **Theme:** `theme: fsu`, as for every report (`STYLE.md`, "Page").

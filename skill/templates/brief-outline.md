<!-- Template: stage 1 of a topic introduction (SKILL.md, "Making a topic introduction", Ti3).
Fill every <...> from the request and the work folder, delete text in [...] that does not apply,
and delete this comment. The template holds only wording that every run shares; everything about
the topic comes from the placeholders. -->

# Brief, stage 1: the outline and plan of a topic introduction on <topic>

## Why this task exists

W1. `sources/<source report>` is a checked report on <topic>[, a companion to <paper>
(`sources/<paper>.txt`, page images in `sources/<paper>.pdf`)]. [Its numbers are checked by
`sources/<check script>`.] Its reader, RMB (`sources/notes/<reader notes>`), wants it rewritten
as a **topic introduction**: a report that reads like a textbook chapter. The rules for every
report are in `~/Documents/Works/report-renderer/STYLE.md`; what differs for this type is in
`~/Documents/Works/report-renderer/skill/topic-introduction.md`.

W2. The report answers one question in <n> parts, one at a time (rule H2). RMB's words:
"<RMB's question, verbatim>".

W2a. <part 1, one line: what it answers>

W2b. <part 2, ...>

W3. Your stage writes the outline and the plan only. <n> writers then write one part each, one after another,
and a final session assembles the page. RMB does not read your outline. RMB approves the page of
writer 1 (a sample part) before writer 2 starts, and corrects the outline and plan through it.

## What you do

D1. Read in full: `~/Documents/Works/report-renderer/STYLE.md` (its hierarchy rules H1 to H4
come first), `topic-introduction.md`, `skill/SKILL.md` in the same folder, the markup
description at the top of `~/Documents/Works/report-renderer/layers.lua`, every note in
`sources/notes/`, and `sources/<source report>` [and the paper where the source cites it].

D2. Write `outline.md`, the writers' contract (not for RMB). It is the tree of rule H1. Every
writer reads it in full, so keep it short (about 1,500 words at most):

D2a. the question and its parts (W2), and the opening tree of the page (M1);

D2b. per section: its title, its contribution to its part (one sentence), its paragraphs' jobs
in order, one short line each, with the items it states (label, one-word status, kind, one line),
and the hand-over to the next section (M3);

D2c. the examples (one running example, or one per line of thought), their variants with the
property each changes, and where each piece appears (E3, E6);

D2d. the figures, each with the reason of rule E1 it meets and one sentence on what to see.
Every plot is an interactive figure (`STYLE.md`, "Interactive figures", including "How many": go
through every item and ask what a reader could move in it); static TikZ only for structures with
no parameter. The full list goes into `figs-page.md` (D3h);

D2e. the known-results boxes (K1): number, kind word, one line each;

D2f. "Cut": material of the source that no node needs, one line each with the node it fails.
Side trips that serve the question but not the main line are listed as side trips, not cut.

D3. Write `plan.md`, also for the writers (not for RMB). Part 1 is the sample part RMB approves, so
choose the split such that part 1 shows the page's form: its first section, a derivation, an
example with numbers, and an interactive figure. Then:

D3a. the split into <n> parts, one writer each, with each part's sections and the source's
material for them (item labels and line ranges in `sources/<source report>`);

D3b. the shared notation (keep the source's), the labels and the section letters;

D3c. which numbers of the check scripts each part quotes, and which computations are written
out by hand in "The computation in full" folds (F8). No R chunks on the page (E4): a plot of the
source becomes an interactive figure of the list (D3h), redrawn with controls;

D3d. the hand-overs between parts, word for word where the first sentence of a part depends on
the last of the one before (mark these **fixed**);

D3e. additions: any link a node needs that the source lacks (D4), with its justification;

D3f. any rule of `STYLE.md` or `topic-introduction.md` you found unclear or in conflict
when applying it, and how the plan resolves it;

D3g. a check list for the final session: order of the parts, the fixed hand-overs, old labels
that must not remain, and anything else the assembler should verify;

D3h. a third file, `figs-page.md`, the list of interactive figures for the figure workers (they
run after the writers, side by side, and each gets a few consecutive entries plus everything
before the first entry). First one short paragraph: the topic and where the notation stands in
`plan.md`. Then one entry per figure, in page order, headed `## <id>` (lower case, letters,
digits and hyphens), with a line `Part: <n>`; its place (the item's label and "after" or
"before"); what it must make visible, as one claim the reader should see; the controls (two or
three) and what moving each shows; the construction where it matters (law, formula, grid, the
source's numbers); and the reason it earns its place (E1). In `plan.md`, each part's figure ids,
so that its writer puts the marker lines.

D4. Keep every claim and formula of the source true. This is a rewrite of form and order, not
of content: no new results, except where a node needs a link the source lacks (D3e).

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only `outline.md` and
`plan.md` in this folder. No git. No memory or note files anywhere. No subagents, other models
or web search.

L2. Never open, list or run anything that reads a project file outside this folder[, nor
<folders the project's rules forbid>].

L3. Final reply: three lines.

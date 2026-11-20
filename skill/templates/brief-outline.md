<!-- Template: stage 1 of a topic introduction (SKILL.md, "Making a topic introduction", Ti3).
Fill every <...> from the request and the work folder, delete text in [...] that does not apply,
and delete this comment. The template holds only wording that every run shares; everything about
the topic comes from the placeholders. -->

# Brief, stage 1: the outline of a topic introduction on <topic>

## Why this task exists

W1. `sources/<source report>` is a checked report on <topic>[, a companion to <paper>
(`sources/<paper>.txt`, page images in `sources/<paper>.pdf`)]. [Its numbers are checked by
`sources/<check script>`.] Its reader, RMB (`sources/notes/<reader notes>`), wants it rewritten
as a **topic introduction**: a report that reads like a textbook chapter. The rules for that type
are in `~/Documents/Works/report-renderer/skill/topic-introduction.md`.

W2. The report answers one question in <n> parts, one at a time (rule H2). RMB's words:
"<RMB's question, verbatim>".

W2a. <part 1, one line: what it answers>

W2b. <part 2, ...>

W3. Your stage writes the outline only. <n> writers then write one part each, one after another,
and a final session assembles the page. RMB approves your outline before they start.

## What you do

D1. Read in full: `topic-introduction.md` (its hierarchy rules H1 to H4 come first),
`~/Documents/Works/report-renderer/STYLE.md`, `skill/SKILL.md` in the same folder, the markup
description at the top of `~/Documents/Works/report-renderer/layers.lua`, every note in
`sources/notes/`, and `sources/<source report>`. Skim
`~/Documents/Works/report-renderer/skill/drafts/textbook-style-notes.md` [and the paper where the
source cites it].

D2. Write `outline.md`, the document RMB reads and approves. It is the tree of rule H1, and it
must itself be easy to read (about 1,500 words at most):

D2a. the question and its parts (W2), and the opening tree of the page (M1);

D2b. per section: its title, its contribution to its part (one sentence), its paragraphs' jobs
in order, one short line each, with the items it states (label, one-word status, kind, one line),
and the hand-over to the next section (M3);

D2c. the running example and where each piece of it appears (E3);

D2d. the figures, each with the reason of rule E1 it meets and one sentence on what to see;

D2e. the known-results boxes (K1): number, kind word, one line each;

D2f. "Cut": material of the source that no node needs, one line each with the node it fails.
Side trips that serve the question but not the main line are listed as side trips, not cut.

D3. Write `plan.md` for the writers (not for RMB):

D3a. the split into <n> parts, one writer each, with each part's sections and the source's
material for them (item labels and line ranges in `sources/<source report>`);

D3b. the shared notation (keep the source's), the labels and the section letters;

D3c. which R chunks of the source move where (figures and checks), and which numbers of the
check scripts each part quotes;

D3d. the hand-overs between parts, word for word where the first sentence of a part depends on
the last of the one before (mark these **fixed**);

D3e. additions: any link a node needs that the source lacks (D4), with its justification;

D3f. anything in `topic-introduction.md` you found unclear or in conflict with `STYLE.md` when
applying it, and how the plan resolves it;

D3g. a check list for the final session: order of the parts, the fixed hand-overs, old labels
that must not remain, and anything else the assembler should verify.

D4. Keep every claim and formula of the source true. This is a rewrite of form and order, not
of content: no new results, except where a node needs a link the source lacks (D3e).

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only `outline.md` and
`plan.md` in this folder. No git. No memory or note files anywhere. No subagents, other models
or web search.

L2. Never open, list or run anything that reads a project file outside this folder[, nor
<folders the project's rules forbid>].

L3. Final reply: three lines.

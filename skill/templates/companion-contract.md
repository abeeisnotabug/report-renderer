<!-- Template: stage 2 of a companion (SKILL.md, "Making a companion", Mc3). Copy it into the
work folder as brief-contract.md; the runner replaces <PAGE> by each page's tag. The section
"Your page" is filled once per page, in its own file brief-contract-<page>.md (the runner
appends it). Fill every other <...>, keep the variant for this companion's type ([lecture: ...]
or [paper: ...]) and delete the other, delete text in [...] that does not apply, and delete this
comment. The template holds only wording that every run shares. -->

# Brief, stage 2: the contract of one companion page

## Why this task exists

W1. RMB wants a **<lecture | paper> companion**: a layered HTML page that goes with <the
lecture's notes, result by result, with the exercises | the paper, in its order>. The rules for
every report are in `~/Documents/Works/report-renderer/STYLE.md`; what differs for this type is in
`~/Documents/Works/report-renderer/skill/<lecture | paper>-companion.md`; the workflow is
`skill/SKILL.md` in the same folder. [lecture: RMB does not approve an outline, because the page
follows the lecture.] [paper: RMB's request for this page: "<RMB's words>".]

W2. You write the **contract** of one page (SKILL.md Mc3): its statement layer and everything that
keeps the page coherent. After you, writers fill the page, one part each, one after another, in
fresh sessions. Each writer gets only the shared part of your contract and its own part (the
runner cuts the file at its `## Part` headings), its own sources and the parts already written.
Whatever a writer needs from another part must therefore be in the shared part.

W3. Every source is already text: the transcripts in `sources/` (format: `[p. N]` page markers,
statements verbatim, `[slip? ...]` and `[unclear: ...]` marks). Read no PDF and no image. Where a
transcript is unclear, record it in your done file; do not guess.

## What you read

R1. In full: `STYLE.md`, `skill/<lecture | paper>-companion.md`, `skill/SKILL.md`, the markup
description at the top of `~/Documents/Works/report-renderer/layers.lua` (up to the first
function), `skill/demo/demo.md` (the markup of each device), and every note in `sources/notes/`
(who RMB is and the decisions for this run).

R2. The transcripts that "Your page" names, in full, once. Other sources only where "Your page"
says so, and only the parts you need (find them with Grep, then Read with offset and limit).

R3. If "Your page" names a contract that comes before this one: from that file only the shared
part (everything before its first `## Part` heading), its notation map and labels, so that this
page cites them consistently.

## What you write

D1. `contract-<PAGE>.md`, in one Write call, in two halves.

D1a. **The shared part** (before the first `## Part` heading), for every writer:
the page title and file name; the opening (M1 [lecture: plus Lc3, the reading guide and "Big
picture" with the map's form] [paper: plus Pc2, "Big picture", and the status convention of
Pc4 and Pc5]); the notation map (every symbol used outside the section that defines it: symbol,
name, object, defining item; keep the source's notation and settle clashes here); the list of
sections in order (Lc4 or Pc1) with anchor id, title, gist (one claim), the formulas its "So
far." recap writes out, and its hand-over; the [lecture: earlier results used (Lc8)] [paper:
known results, boxes K.1, K.2, ... (Pc8)] with ids and where each statement stands in the
sources; the slips found (Lc7 or Pc5's own-commentary sections), each with place and corrected
statement; rules you found unclear in `STYLE.md` or the type file and how the contract resolves
them; and the reader's check list (labels that must exist, fixed hand-overs, items that must
appear).

D1b. **One section per writer**, headed exactly `## Part 1`, `## Part 2`, ... (the runner cuts at
these headings), in page order. Each holds: the writer's sections; the fixed hand-over sentence
into its first section and out of its last one, word for word; and, for every item in its
sections, in order:
the id (as the top of `layers.lua` gives ids for the source's items, exercises and results used;
the page's own items with the section letter); the title as it will appear ([lecture: Lc2] [paper: with
the one-word status]); **where the statement stands**: transcript file and the item's bold label
or `[p. N]` (the writer copies it from there; do not copy statements into the contract); the
status line in full ([lecture: Lc5; for *Reminder* you have compared with the source's proof]
[paper: Pc4 and Pc5, with the verb from Pc5's closed list]); and one or two lines on what the
Steps fold must do, which named folds it gets, and which checks (F4).
[lecture: Exercises (Lc6) go where they fit in the lecture's order, with where the task stands,
the property the Hint names, and the solution's source: <RMB's decision for this run on
solutions>.]
[paper: For each equation of the paper the page prints (Pc3): where it stands, and the
report's own version with its term-by-term notation map.]
Figures and examples (E1, E3): each with the reason it earns its place, and the property an added
example has or lacks. No quotas (H3).

D2. `header-<PAGE>.Rmd`, in one Write call: the YAML (`title`, `layered: true`, and `pages:` with the
other pages this page cites, if "Your page" names any), the build comment of `skill/starter/report.Rmd`, and the setup
chunk with `fig.path = "_figures/<PAGE>-"`.

D3. **Coverage.** Every numbered statement of the source in this page's range is an item
([lecture: Lc1] [paper: Pc1, within the scope RMB's request names]). Check it once with
`grep -n '^\*\*' <this page's transcripts>` (the transcripts put every label in bold at the start
of a line) against your parts, and write `items-<PAGE>.txt`: one line per numbered statement of
the range, the label as printed, followed by the item's id, or by "left out: <reason>".

D4. `done-contract-<PAGE>.md` last: at most 200 words, what you could not settle (each with its
place), and any transcript passage marked unclear that the page needs.

D5. Write each file in one go; do not build a file from many small edits.

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only the files named in
"What you write". No git. No memory or note files. No subagents, other models or web search.

L2. Never open, list or run anything outside this folder and the renderer folder.

L3. Final reply: three lines.

## Your page
<!-- In brief-contract-<page>.md, one paragraph: "Page `<tag>`: <file name>, <what it covers:
the sections, or the paper's sections>. Transcripts: `sources/transcript-<chunk>.md` [, ...].
[Other sources and what to take from them.] Writers: <n>; split: Part 1 = <sections>, Part 2 =
<sections>, ... (change a split only if a section's size makes it necessary; say why in the done
file). [Contract that comes before: `contract-<tag>.md` (its shared part only).] [Other pages
this page cites (for `pages:` in the header): `<file>.md`.]" -->

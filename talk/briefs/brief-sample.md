<!-- Template: stage 1 of a talk (talk-writing skill, Sg1): the plan and sample slides. Fill every
<...> from the request and the sources, delete text in [...] that does not apply, and delete this
comment. Everything about the topic comes from the placeholders. Done-file: notes-sample.md. -->

# Brief, stage 1: the plan and sample slides of a talk on <topic>

## Why this task exists

W1. RMB gives a talk of <minutes> minutes on <topic> to <audience>. <What the audience knows,
and what it does not know; how it thinks, for example in path diagrams (SEMs).>

W1a. The structure: <the structure RMB's request gives, in RMB's words: what the talk does and
in what order; parts only if RMB asks for them>. Follow it; where it leaves something open,
choose the order the audience needs to follow (SKILL.md N13) and say why in your notes. A source
document's order is not a talk's order. Nothing in the kit's `starter/` or `demo/` is a model
for the structure.

W2. The content comes from <sources in `sources/`: a checked report, a paper, an earlier deck>.
[Its numbers are checked by `sources/<check script>`.] The talk adds no claim that is not in the
sources, except where `plan.md` says so and why.

W3. Your stage writes `plan.md`, the builders' contract, and builds two or three sample slides.
RMB looks at the built sample slides, not at a document, and approves or corrects them before
anything else is built. Builders then build the rest in the samples' form, and a reader checks
the deck.

## What you do

D1. Read in full: the talk-writing skill (`~/Documents/Works/report-renderer/talk/SKILL.md`), the
comments at the top of `kit/engine.js`, `kit/live.js` and `kit/lib.js` in the same folder, and
every source.

D2. Write `plan.md`:

D2a. the structure of W1a, in a few lines, and what the first slide after the title says the
talk will show (N13);

D2b. per slide: number, [part,] title (the slide's message as a sentence), what is on the slide
at each state, the picture (what it shows, what changes per step) and any live control (what
moves, what the audience should see change), the planned minutes, and a line on what the notes
say;

D2c. every number and formula each slide shows, with its derivation as it appears on the slide
(N9) and its source; example values chosen so that derivations are short;

D2d. the colour map: each recurring object, its alias and its slot (a to f);

D2e. the notation table (N10): each letter and index, its one meaning, and the slide where it is
first defined;

D2f. the arrow convention (N11): each kind of line and what it means, the same on every picture;

D2g. the files and who builds which slides, and the checks each live slide needs;

D2h. the planned minutes, adding up to <minutes>.

D3. Copy `~/Documents/Works/report-renderer/talk/starter/` to `<deck folder>/`, fill
`config.json`, and build two or three sample slides that represent the deck: <for example the
running example, one typical slide, the densest result slide>. Put each into the slides file
`plan.md` assigns it to. Build them completely, with pictures, live controls and notes, so that
the builders can copy their form.

D4. The samples and `plan.md` follow SKILL.md N1 to N14: every symbol, abbreviation and named
assumption defined or restated on the slide where it is used (N8); no number without its
derivation on the slide (N9); one notation (N10); one meaning per kind of line, stated on each
picture, models as path diagrams where the audience thinks in them (N11); results in a box with
assumptions and statement (N12); the audience's order (N13); no status tags or review marks
(N14). Notes as in N3: what the speaker must understand and say, numbers with their derivation,
no pointers into sources (no section or line numbers, report labels or file names), earlier
slides restated, not numbered.

## Check

K1. Run SKILL.md K1 on the sample deck in both themes until all pass, and look at each sample
slide's contact sheet (K2). Delete the screenshots at the end.

## Output

O1. `plan.md` (at most <words> words), the deck folder with the sample slides and its built
HTML; `notes-sample.md` last, at most 200 words: which slides are the samples and why they
represent the deck, the checks' results, open questions for RMB, and "done" on its last line.

## Limits

L1. Read only this brief, the files named in it, this folder and
`~/Documents/Works/report-renderer`. Write only in this folder. Do not edit the kit
(`talk/kit/`). No git. No memory or note files outside this folder. No subagents, other models
or web search. No network at build or run time; no package installs.

L2. <The project's data rules, verbatim.>

L3. Final reply: three lines.

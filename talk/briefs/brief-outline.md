<!-- Template: stage 1 of a talk (talk-writing skill, Sg1). Fill every <...> from the request and
the sources, delete text in [...] that does not apply, and delete this comment. Everything about
the topic comes from the placeholders. -->

# Brief, stage 1: the outline of a talk on <topic>

## Why this task exists

W1. RMB gives a talk of <minutes> minutes on <topic> to <audience>. <What the audience knows,
and what it does not know.>

W1a. The structure: <the structure RMB's request gives, in RMB's words: what the talk does and
in what order; parts only if RMB asks for them>. Follow it; where it leaves something open,
choose what fits the content and say why in your notes. Nothing in the kit's `starter/` or
`demo/` is a model for the structure.

W2. The content comes from <sources in `sources/`: a checked report, a paper, an earlier deck>.
[Its numbers are checked by `sources/<check script>`.] The talk adds no claim that is not in the
sources, except where the outline says so and why.

W3. Your stage writes the outline only. Builders then build the deck from it with the talk kit
(`~/Documents/Works/report-renderer/talk/SKILL.md`), and a reader checks it. RMB approves your
outline before they start.

## What you do

D1. Read in full: the talk-writing skill (`~/Documents/Works/report-renderer/talk/SKILL.md`), the
comments at the top of `kit/engine.js`, `kit/live.js` and `kit/lib.js` in the same folder, and
every source.

D2. Write `outline.md`:

D2a. the structure of W1a, in a few lines;

D2b. per slide: number, [part,] title (the slide's message as a sentence), what is on the slide
at each state, the picture (what it shows, what changes per step) and any live control (what
moves, what the audience should see change), the planned minutes, and in one line what the notes
say;

D2c. the colour map: each recurring object, its alias and its slot (a to f);

D2d. the planned minutes, adding up to <minutes>.

D3. Write `plan.md` for the builders: the files and who builds which slides, every number and
formula each slide shows with its source, and the checks each live slide needs.

## Output

O1. `outline.md` (at most <words> words) and `plan.md`; `notes-outline.md` last, at most 200
words: open questions for RMB, and "done" on its last line.

## Limits

L1. Read only this brief, the files named in it, this folder and
`~/Documents/Works/report-renderer`. Write only in this folder. No git. No memory or note files
outside this folder. No subagents, other models or web search. No package installs.

L2. <The project's data rules, verbatim.>

L3. Final reply: three lines.

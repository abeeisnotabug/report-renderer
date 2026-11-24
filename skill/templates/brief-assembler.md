<!-- Template: stage 3 of a topic introduction (SKILL.md, "Making a topic introduction", Ti6).
Fill every <...>, delete text in [...] that does not apply, and delete this comment. -->

# Brief, stage 3: assemble the topic introduction on <topic>

## Why this task exists

W1. <n> writers have written one part each of a topic introduction (a report that reads like a
textbook chapter) on <topic>: `part-1.Rmd` to `part-<n>.Rmd` in this folder, with their notes
`notes-1.md` to `notes-<n>.md`. The contract they followed is `outline.md` and `plan.md` (RMB did not read these; RMB approved
part 1 as a sample, and its corrections are in them); the rules are in `~/Documents/Works/report-renderer/STYLE.md`, and what
differs for this type in `~/Documents/Works/report-renderer/skill/topic-introduction.md`. Their source is
`sources/<source report>`, a checked report.

W2. You make the parts one page and check it. Writers working one after another drift: in
voice, in how much they explain, in what they repeat. The page must read as one text, top to
bottom, and every element must serve its node of the outline (rule H3).

## What you read

R1. In full: `~/Documents/Works/report-renderer/STYLE.md`, `topic-introduction.md`, the markup
description at the top of `~/Documents/Works/report-renderer/layers.lua`, `outline.md`,
`plan.md` (its check list is for you), the notes, the parts, and the notes in `sources/notes/`.
Parts of `sources/<source report>` where you need to check a claim.

## What you do

D1. **Assemble** `<report name>.Rmd` in this folder: the YAML header (`pagetitle`,
`layered: true`), a build comment with the knit and render commands, then the parts in order,
with the section "Known results" moved to the very end. [Links to other reports, such as
`<file>.html#<anchor>`, stay as they are; the page is later moved next to those files.]

D2. **Resolve the notes.** Each problem a writer reported: fix it, or say in your report why
not. Where two parts disagree on notation, a label or a statement, `plan.md` decides; where
`plan.md` is silent, the source decides.

D3. **One text.** Read the whole page once as RMB would.
- The first sentences alone should give the outline (M5); fix those that do not.
- A derivation, definition or explanation that appears twice: keep the first, and let the
  second refer back to it in words with the label (P3).
- Hand-overs between parts: the fixed sentences of `plan.md`, word for word.
- Voice: "we", never "I" (P6). Lecture links: <none, or as RMB asked (K2)>.
- Cut what serves no node (H3). Cutting is the main tool here, not adding. Do not change a
  claim, formula or number; if one looks wrong, check it against the source and report it.

D4. **Run the check list** in `plan.md`. In addition: every Known-results box is cited at least
once, and every general result the text uses has a box.

D5. **Build and check.** From this folder: `Rscript -e 'knitr::knit("<report name>.Rmd")'`,
then `~/Documents/Works/report-renderer/render.sh <report name>.md`, then
`NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js "$PWD/<report name>.html"`.
Fix every renderer warning and every phone-check finding [except links to other reports, which
resolve after the move]. Read the "Uses:" lines: each item lists what it really uses.

D6. **Report** in `assembly-report.md`, at most 400 words: what you fixed from the notes, what
you cut (one line each), anything you could not resolve, and the page's word count.

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only in this folder. No
git. No memory or note files outside this folder. No subagents, other models or web search.

L2. Never open, list or run anything that reads a project file outside this folder[, nor
<folders the project's rules forbid>].

L3. Final reply: three lines.

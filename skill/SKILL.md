---
name: report-writing
description: Write, rework or extend a report rendered with RMB's shared report renderer (~/Documents/Works/report-renderer): a layered HTML page about a paper, a method, a derivation or a lecture topic. Use when the user asks for a report, a paper summary, a background report, or changes to an existing report (.md or .Rmd rendered with render.sh). Covers which rules to read, how the explanation levels L1 to L5 map onto the page's layers, and how to build and check the page. Not for answers in chat; those follow the explanation-levels skill.
---

# Writing a report

The rules for how reports look and are written are in `STYLE.md` in the renderer folder. That
file, with `topic-introduction.md` in this folder for topic introductions (Ty1), is the only
authority; this skill is the workflow around it and repeats none of its rules.
If the renderer folder is missing (a fresh cloud session), clone it first:
`git clone https://github.com/abeeisnotabug/report-renderer ~/Documents/Works/report-renderer`.

## Two types of report

Ty1. A **paper companion** retells a paper with added explanations and steps: `STYLE.md` alone.
A **topic introduction** introduces a topic, usually framed by a question, and reads like a
textbook chapter: `STYLE.md` plus `topic-introduction.md` in this folder, which overrides
`STYLE.md` where they differ; how one is made: "Making a topic introduction" below. If a
request does not make the type clear, ask RMB.

## Before writing

W1. Read `~/Documents/Works/report-renderer/STYLE.md` in full, every time. It changes.

W2. Read the markup description at the top of `layers.lua` in the same folder: sections, gists,
items, plain-words folds, Intuition, Steps, named folds, restated results, links.

W3. Read the project's own notes on reports (its CLAUDE.md and its memory notes). They add to
`STYLE.md` and never replace it. Read the report the new one builds on, if any, so derivations
stay consistent across reports (STYLE.md, "Remind, never re-derive differently").

W4. Example report: pending. RMB chooses one from the Sørensen (2026) comparison of November 2026;
until then, follow `STYLE.md` alone.

## Long reports

R1. A report that takes more than one session (a long paper, many sections) is a big task: read
`~/.agent-skills-shared/big-tasks/SKILL.md` first and ask RMB for the cast before anything
starts (its S1). Effort is high at most.

R2. The contract is the statement layer. One architect session writes it for the whole report:
every section's gist, every item's statement and status line, the notation map and the labels.
Equations are first transcribed once from the page images (big-tasks Co2).

R3. Workers then fill one section each, in fresh sessions: Intuition, Steps and named folds, then
the plain-words fold last (L3 below). A worker reads the contract and its own section's sources
only. It writes each step out where it is needed, and points elsewhere only to a labelled
statement, never into another section's folds. It may not change a statement, symbol or label;
if one is wrong, it reports this instead.

R4. A fresh reader then reads the whole page once (big-tasks T6) and lists contradictions,
repeated derivations and broken references. The render and phone check (B1, B2) are run by a
script, not by a model.

R1 to R4 are for paper companions. A topic introduction has no statement layer to serve as a
contract; it is made as in the next section.

## Making a topic introduction

Recorded from the first run (the Kalman introduction, 2026-11-17, approved by RMB). Write the
briefs from the templates in `templates/` in this folder (`brief-outline.md`, `brief-writer.md`,
`brief-assembler.md`, and `run-stage.sh` to run them): fill their placeholders from the request
and the sources. Do not read an earlier run's briefs or outline to write new ones: their
topic-specific details (number of parts, section letters, notation) carry over into an unrelated
report. Cost of that run: big-tasks, the cost records of 2026-11-17.

Ti1. **Source first.** The run rewrote a checked report on the same topic (a paper companion,
its R checks and the paper) into the new form. The content was fixed by the source: a rewrite of
form and order, with new claims only where a node of the outline needs a link the source lacks,
listed in the plan. If no checked source exists, ask RMB whether to write and check the content
first.

Ti2. **Work folder.** An ignored folder next to the report (e.g. `.work/<name>/`) with
`sources/`: copies of the source report, the paper (text and PDF), the R check scripts, and the
project's notes on the reader and on reports. Each stage runs headless in that folder
(`templates/run-stage.sh`). Every brief limits it to the folder and the
renderer: write only in the folder, no git, no memory files, no subagents or web search, the
project's data rules, final reply three lines. Accounts and models: big-tasks (the run used Opus,
effort high, throughout).

Ti3. **Stage 1, outline.** One fresh session. The brief states the question and its parts in
RMB's words (rule H2 of `topic-introduction.md`). It reads `topic-introduction.md`, `STYLE.md`,
this file, the markup in `layers.lua`, the notes and the source, and writes two files:

Ti3a. `outline.md`, for RMB, about 1,500 words at most: the question and its parts, the opening
tree (M1); per section its contribution, its paragraphs' jobs in order with the items they state
(label, one-word status, one line) and its hand-over (M3); the running example (E3); the figures
with the reason each earns its place (E1); the known-results boxes (K1); and a "Cut" list of
source material no node needs.

Ti3b. `plan.md`, for the writers: the split into parts, one writer each, with each part's
sections and its sources (labels and line ranges); notation, labels and section letters; which R
chunks and which numbers go where; the hand-over sentences between parts, word for word where a
part's first sentence depends on the last one before it; additions to the content (Ti1); rules
found unclear and how the plan resolves them; a check list for the assembler.

Ti4. **RMB approves the outline** (render it as a page) before any writer starts. RMB's changes
go into `outline.md` and `plan.md`.

Ti5. **Stage 2, writers.** One fresh session per part (three for the Kalman page), **one after
another**, each reading the parts already written so that the page keeps one voice and cites
earlier items instead of repeating them. One common brief plus a paragraph per writer naming its
part. Each writer writes its fragment (`part-N.Rmd`, no YAML header), builds a test page from the
fragments so far (knit, render, phone check) and fixes its own findings, then writes
`notes-N.md` last (at most 300 words: what it could not follow, errors it found in the source or
in an earlier part, which it reports and does not fix, and links to later parts). The first
writer also writes the "Known results" section, because the others cite its boxes. The script
stops when a writer leaves no notes file or ends with an error (a usage limit).

Ti6. **Stage 3, assembler.** One fresh session joins the parts, moves "Known results" to the
end, settles each writer's note (`plan.md` decides between parts; where it is silent, the
source), and reads the page once as RMB would. Cutting is its main tool: a repeated derivation
keeps its first place and the second refers back. It changes no claim, formula or number; a
doubtful one it checks against the source and reports. It runs the plan's check list, builds and
phone-checks the page, and writes `assembly-report.md` (at most 400 words: fixes, cuts, what is
left open, word count).

Ti7. **Last, in the main session:** move the page next to the reports it links to, build and
check it again (B1, B2), commit, and give it to RMB. Open points from the assembly report (in
the Kalman run, a gap the source shared) go to RMB as decisions. RMB's vetoes and fixes are
made in the main session.

## Levels in a report

L1. A report holds every level at once, as layers (table in `STYLE.md`, "Levels are layers"):
L1 plain-words fold per section, L2 gist and Intuition, L3 statement and status line, L4 Steps,
L5 named folds and side trips. The reader picks the level by what they open.

L2. The explanation-levels skill governs answers in chat. Two of its rules do not apply to a
report. A report never asks for a level, since it holds all of them. A report is not limited to
one question: its scope is the paper or the request, and material beyond that scope is listed
at the end as possible additions. Its writing style (ASD-STE100-inspired) and its method
(central idea first, no nontrivial claim passed off as obvious, simple deductions shown and
substantial theorems named) apply to every layer of a report; `STYLE.md` has the style rules.

L3. Write the plain-words fold of a section after the section itself, so it says what the section
really does.

## Building and checking

B0. Figures: after changing a TikZ figure `fig-name.tex`, run
`~/Documents/Works/report-renderer/tikz2svg.sh fig-name.tex` and commit the `.svg` with it
(`STYLE.md`, "Figures and plots").

B1. Render: `~/Documents/Works/report-renderer/render.sh path/to/report.md`, which writes
`report.html` next to it. R Markdown is first knitted to `.md` with `knitr::knit()`, run from the
report's folder. Fix every warning about missing links or lecture entries, and every warning that
a wrapped line starts a list (move the line break so that no line inside a paragraph starts with
"1." or "-"). A warning that an image is over 500 KB means: rasterise that plot's heavy
layer.

B2. Phone check: `NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js
/absolute/path/report.html`. It opens the page in WebKit at 393 px with every fold open. Fix
until the page width is 393, no display formula scrolls, and no local link is dead. A formula
that scrolls is split as `STYLE.md` says (aligned rows, short rows), never broken by hand.

B3. Read the "Uses:" lines in the phone check's output: each item should list what it really
uses. A label inside `\overset` or another macro is not linked, so say the dependence in words
as well.

B4. Commit and push as the project's rules say.

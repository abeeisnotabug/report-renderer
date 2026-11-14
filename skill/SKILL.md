---
name: report-writing
description: Write, rework or extend a report rendered with RMB's shared report renderer (~/Documents/Works/report-renderer): a layered HTML page about a paper, a method, a derivation or a lecture topic. Use when the user asks for a report, a paper summary, a background report, or changes to an existing report (.md or .Rmd rendered with render.sh). Covers which rules to read, how the explanation levels L1 to L5 map onto the page's layers, and how to build and check the page. Not for answers in chat; those follow the explanation-levels skill.
---

# Writing a report

The rules for how reports look and are written are in `STYLE.md` in the renderer folder. That
file is the only authority; this skill is the workflow around it and repeats none of its rules.
If the renderer folder is missing (a fresh cloud session), clone it first:
`git clone https://github.com/abeeisnotabug/report-renderer ~/Documents/Works/report-renderer`.

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

B1. Render: `~/Documents/Works/report-renderer/render.sh path/to/report.md`, which writes
`report.html` next to it. R Markdown is first knitted to `.md` with `knitr::knit()`, run from the
report's folder. Fix every warning about missing links or lecture entries.

B2. Phone check: `NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/phone-check.js
/absolute/path/report.html`. It opens the page in WebKit at 393 px with every fold open. Fix
until the page width is 393, no display formula scrolls, and no local link is dead. A formula
that scrolls is split as `STYLE.md` says (aligned rows, short rows), never broken by hand.

B3. Read the "Uses:" lines in the phone check's output: each item should list what it really
uses. A label inside `\overset` or another macro is not linked, so say the dependence in words
as well.

B4. Commit and push as the project's rules say.

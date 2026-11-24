---
name: report-writing
description: Write, rework or extend a report rendered with RMB's shared report renderer (~/Documents/Works/report-renderer): a layered HTML page of one of three types: a paper companion, a topic introduction (a topic or method framed by a question), or a lecture companion (a lecture's notes with the exercises). Use when the user asks for a report, a paper summary, a background report, or changes to an existing report (.md or .Rmd rendered with render.sh). Covers which rules to read, how the explanation levels L1 to L5 map onto the page's layers, and how to build and check the page. Not for answers in chat; those follow the explanation-levels skill.
---

# Writing a report

The rules for how reports look and are written are in `STYLE.md` in the renderer folder, for
every report, and in one type file in this folder for each type (Ty1). These files are the only
authority; this skill is the workflow around them and repeats none of their rules.
If the renderer folder is missing (a fresh cloud session), clone it first:
`git clone https://github.com/abeeisnotabug/report-renderer ~/Documents/Works/report-renderer`.

## Three types of report

Ty1. Each type follows `STYLE.md` and its own type file in this folder, which holds only what
differs for that type (`STYLE.md`, "Types"):
- **paper companion**: `paper-companion.md`;
- **topic introduction**: `topic-introduction.md`; how one is made: "Making a topic
  introduction" below;
- **lecture companion**: `lecture-companion.md`.

If a request does not make the type clear, ask RMB.

## Start

St1. **Structure comes from RMB.** A report's structure, its parts, the number and kind of its
sections, and its framing come from RMB's request and the outline RMB approves. Nothing in
`starter/`, `demo/` or an earlier report is a model for them.

St2. **A report starts from `starter/report.Rmd`** in this folder: copy it into the project and
rename it. It holds the header, the Notation section and an empty final section, and nothing in
between; the type file names the final section and anything the opening adds. `demo/demo.md`
(rendered: `demo/demo.html`) shows the markup of each device of `STYLE.md`, "Teaching", once,
with placeholders; copy a device's markup, never its text or its place on the page. Do not open
earlier reports as models; the one exception is W3.

## Before writing

W1. Read `~/Documents/Works/report-renderer/STYLE.md` and the type file in full, every time. They
change.

W2. Read the markup description at the top of `layers.lua` in the same folder: sections, gists,
items, plain-words folds, Intuition, Steps, named folds, restated results, links.

W3. Read the project's own notes on reports (its CLAUDE.md and its memory notes). They add to
`STYLE.md` and never replace it. Read the report the new one builds on, if any, so derivations
stay consistent across reports (STYLE.md, "Remind, never re-derive differently"): for its
notation and derivations only, never for its structure (St1).

## Long reports

R1. A report that takes more than one session (a long paper, many sections, a lecture chapter) is
a big task: read `~/.agent-skills-shared/big-tasks/SKILL.md` first and ask RMB for the cast before
anything starts (its S1, in its short form). Effort is high at most.

R2. **Briefs come from the templates in `templates/`, never freehand.** Copy the type's
templates into the work folder, fill their placeholders from the request and the sources, and
delete the variants that do not apply. What a template does not say is added in its marked
places ("Your chunk", "Your page", the notes in `sources/notes/`), never by rewriting its rules.
Do not read an earlier run's briefs, contracts or outlines to write new ones: their
source-specific details (number of parts, labels, page ranges) carry over into an unrelated
report. A template that lacks something every run needs is extended in the renderer.

R3. **Waste check before the launch.** Every runner starts only after the waste check of
big-tasks (Wc1 to Wc5) has seen its briefs, the runner and its config; the runner refuses
otherwise (`waste_gate` in `templates/runlib.sh`).

## Making a companion

Paper and lecture companions: the source's statements, transcribed once, are the contract.
Templates: `templates/companion-transcribe.md`, `companion-contract.md`, `companion-writer.md`,
`companion-reader.md`, `companion-fixer.md`, run by `templates/run-companion.sh` with its
`run.conf` (copy `runlib.sh` and `logstate.py` too). Each template has a lecture and a paper
variant where the type files differ.

Mc1. **Work folder.** An ignored folder next to the page (e.g. `.work/<name>/`) with `sources/`:
the transcripts, the source PDFs (for the transcription stage only), the project's notes on the
reader and on reports in `sources/notes/`, and other files a stage reads (for example RMB's own
solutions). Every brief limits its session to the folder and the renderer: write only in the
folder, no git, no memory files, no subagents or web search, final reply three lines.

Mc2. **Stage 1, transcription: its own cheap stage.** Page images are read once, by Sonnet
sessions of at most about 20 pages each, side by side, into `sources/transcripts/` in the format
the template fixes (the same as a course folder's `transcripts/`); every later stage reads text
only, never a PDF page or an image. A source that a course folder's `transcripts/` already covers
(its file's `source` comment names the PDF and the pages) is copied into `sources/transcripts/`
unchanged, and gets no chunk in `run.conf`.

Mc3. **Stage 2, contract: one session per page.** Its statement layer (every item's id, title,
status line and where its statement stands in a transcript; sections, gists, recaps, hand-overs;
the notation map; slips; results used; the writers' split and the reader's check list). The
contract does not copy statements: writers copy them from the transcript. It is written in two
halves: a shared part and one `## Part k` per writer, so that each writer reads only the shared
part and its own. A page that cites another page's labels has its contract written after that
page's, and reads only that contract's shared part.

Mc4. **Stage 3, writers.** One fresh session per part, one after another within a page, each
reading the parts of its page already written, so that the page keeps one voice. Pages run side
by side. A writer may not change a statement, symbol or label; if one is wrong, it reports this.
A paper companion's plain-words fold is written last in its section (L3).

Mc5. **Stage 4 and 5, reader and fixer** (big-tasks T6), Sonnet. The render and phone check run
by script before the reader and after the fixer. The reader sorts its findings: what the rules,
the contract or a transcript settle goes to the fixer, who applies all of it; what needs a
decision goes to `open-<page>.md` for RMB. So nothing in the run waits for the conductor.

Mc6. **One launch.** `run-companion.sh all` chains all stages unattended, with the usage-limit
handling of big-tasks (Co5a to Co5c) inside, and writes `run-done.md` at the end (each page's
state, RMB's open questions, usage per stage). The conductor waits for `run-done.md` or a
`limit-*.txt`.

Mc7. **Last, in the main session:** move each page next to the pages it links to, build and check
it again (B1, B2), commit, give it to RMB with the questions in `open-<page>.md`, and log the
usage (big-tasks Co6).

## Making a topic introduction

Agreed with RMB on 2026-11-17. Briefs from the templates in `templates/` (R2):
`brief-outline.md`, `brief-writer.md`, `brief-assembler.md`, and `run-stage.sh` (with
`runlib.sh` and `logstate.py`) to run them. Costs of earlier runs: big-tasks, its measured facts.

Ti1. **Source first.** The content comes from a checked source (for example a checked report on
the topic, its R checks and the paper it is based on), and the topic introduction rewrites its
form and order, with new claims only where a node of the outline needs a link the source lacks,
listed in the plan. If no checked source exists, ask RMB whether to write and check the content
first.

Ti2. **Work folder.** An ignored folder next to the report (e.g. `.work/<name>/`) with
`sources/`: copies of the source report, the paper (text and PDF), the R check scripts, and the
project's notes on the reader and on reports. Each stage runs headless in that folder
(`templates/run-stage.sh`). Every brief limits it to the folder and the
renderer: write only in the folder, no git, no memory files, no subagents or web search, the
project's data rules, final reply three lines. Accounts and models: big-tasks.

Ti3. **Stage 1, outline.** One fresh session. The brief states the question and its parts in
RMB's words (rule H2 of `STYLE.md`). It reads `topic-introduction.md`, `STYLE.md`,
this file, the markup in `layers.lua`, the notes and the source, and writes two files:

Ti3a. `outline.md`, for RMB, about 1,500 words at most: the question and its parts, the opening
tree (M1); per section its contribution, its paragraphs' jobs in order with the items they state
(label, one-word status, one line) and its hand-over (M3); the examples and their variants (E3); the figures
with the reason each earns its place (E1); the known-results boxes (K1); and a "Cut" list of
source material no node needs.

Ti3b. `plan.md`, for the writers: the split into parts, one writer each, with each part's
sections and its sources (labels and line ranges); notation, labels and section letters; which plot
chunks and which numbers go where; the hand-over sentences between parts, word for word where a
part's first sentence depends on the last one before it; additions to the content (Ti1); rules
found unclear and how the plan resolves them; a check list for the assembler.

Ti4. **RMB approves the outline** (render it as a page) before any writer starts. RMB's changes
go into `outline.md` and `plan.md`.

Ti5. **Stage 2, writers.** One fresh session per part, **one after
another**, each reading the parts already written so that the page keeps one voice and cites
earlier items instead of repeating them. One common brief plus a paragraph per writer naming its
part. Each writer writes its fragment (`part-N.Rmd`, no YAML header), builds a test page from the
fragments so far (knit, render, phone check) and fixes its own findings, then writes
`notes-N.md` last (at most 300 words: what it could not follow, errors it found in the source or
in an earlier part, which it reports and does not fix, and links to later parts). The first
writer also writes the "Known results" section, because the others cite its boxes. The script
stops when a writer leaves no notes file or ends with an error. At a usage limit it does not
stop: it writes `limit.txt`, the main session asks RMB, and the answer in `decision.txt` (wait,
move, restart) decides (big-tasks Co5a–Co5c; how: the comments at the top of
`templates/runlib.sh`). The main
session's wait on the run also ends when `limit.txt` appears.

Ti6. **Stage 3, assembler.** One fresh session joins the parts, moves "Known results" to the
end, settles each writer's note (`plan.md` decides between parts; where it is silent, the
source), and reads the page once as RMB would. Cutting is its main tool: a repeated derivation
keeps its first place and the second refers back. It changes no claim, formula or number; a
doubtful one it checks against the source and reports. It runs the plan's check list, builds and
phone-checks the page, and writes `assembly-report.md` (at most 400 words: fixes, cuts, what is
left open, word count).

Ti7. **Last, in the main session:** move the page next to the reports it links to, build and
check it again (B1, B2), commit, and give it to RMB. Open points from the assembly report go to RMB
as decisions. RMB's vetoes and fixes are
made in the main session.

## Levels in a report

L1. A report holds every level at once, as layers (table in `STYLE.md`, "Levels are layers"):
L1 "In words" folds (and a paper companion's plain-words folds), L2 gist, recap and Intuition,
L3 statement and status, L4 Steps, L5 named folds and side trips. The reader picks the level by what they open.

L2. The explanation-levels skill governs answers in chat. Two of its rules do not apply to a
report. A report never asks for a level, since it holds all of them. A report is not limited to
one question: its scope is the paper or the request, and material beyond that scope is listed
at the end as possible additions. Its writing style (ASD-STE100-inspired) and its method
(central idea first, no nontrivial claim passed off as obvious, simple deductions shown and
substantial theorems named) apply to every layer of a report; `STYLE.md` has the style rules.

L3. A paper companion's plain-words fold is written after its section, so it says what the
section really does (`paper-companion.md`, Pc6).

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

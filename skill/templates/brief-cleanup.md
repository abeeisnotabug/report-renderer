<!-- Template: one headless session that removes the run history from a project repository
(the logs, briefs, run scripts and intermediate files of earlier agent runs), keeping everything
the current results need. Copy into a work folder outside the repository as brief-cleanup.md,
fill every <...>, delete this comment. -->

# Brief: remove the run history from <repository>

W1. RMB asked (<date>): "<RMB's words>". The repository `<path>` holds RMB's current work
(<the deliverables: e.g. a paper, notes, a report, a talk>) and, around it, the history of how
agents made it: run scripts, logs (`*.log.jsonl`, `*.stderr`), briefs, worker notes, status and
pid files, waste checks, intermediate drafts, outputs of earlier runs that later work replaced.

W2. **Keep** everything a current result needs, and nothing else:
- the deliverables and their sources: <list, with paths>;
- what is needed to build, check and edit them again: <build inputs: e.g. a report's .Rmd, its
  figure sources and data; a deck folder>, and the check scripts their skill uses;
- every file that the repository's `CLAUDE.md`, a README, a deliverable, or the memory notes in
  `<memory folder>` point to, unless the pointer is itself history (then report it, see D3).

W3. **Remove** the run history: files that only record how a result was made. Tracked files
with `git rm` (git history keeps them); untracked and ignored files by moving them, with their
folder structure, into `<trash folder>` (never `rm`). Do not commit: the conductor commits.

## What you do

D1. Inventory first: `git ls-files`, then `git status --short --ignored`, and folder sizes.
Read a file only where its name and folder do not settle whether it is history. Write the
plan into `<work folder>/cleanup-plan.md` (keep / remove, by folder, with a reason per group)
before you remove anything.

D2. Remove what the plan says. Then rebuild every deliverable that has a build
(<build commands>) and compare the new output with the old one (keep a copy of the old output
first, in the work folder): it must be the same, apart from <allowed differences>. If a build
fails or differs because of a removed file, bring that file back and note it.

D3. Last, `<work folder>/cleanup-report.md` (at most 300 words): what was removed (counts and
sizes per folder), what was kept and why, the rebuild results, and every pointer in CLAUDE.md,
a README or a memory note that now points to a removed file (the conductor updates those).

## Limits

L1. Change only the repository and write only in the work folder and the trash folder. No
commits, no pushes, no edits of memory notes or CLAUDE.md. No subagents, no web.
L2. Final reply: three lines.

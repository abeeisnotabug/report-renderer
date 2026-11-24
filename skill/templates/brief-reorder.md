<!-- Template: reorder a reference notes file (Markdown) into a reading order agreed with RMB,
content unchanged. Fill every <...>, delete text in [...] that does not apply, and delete this
comment. One fresh session (Opus high: deciding where each item goes and writing the bridges
needs judgement). Check afterwards with a script that the multisets of numbers, labels and
status marks agree between the old and the new file. -->

# Brief: reorder the notes file `<file>` into <the agreed order, one line>

## Why this task exists

W1. `<file>` (<words> words) records <what it records>. RMB will use it later as the reference
for <later use>. Its order is a reference order (<the current order>), which RMB finds hard to
follow. RMB agreed a new order: <where the agreed order is written down, e.g. a file in
`sources/`, with its labels>.

W2. The content stays as it is: every definition, statement, number, formula, label, status mark
(<the file's status marks>), pointer into other documents (<report labels, line numbers>) and
caveat is kept, word for word where possible. [Rules made for slides or a talk (no references,
no status tags) do not apply to this file.]

## What you do

D1. Read in full: this brief, `sources/<file>`, <the file with the agreed order>.

D2. Write `<new file>`:
D2a. at the top, a short layer for a reader new to the material (at most <n> words): <what it
states, e.g. what changed and what follows from it>, each point with a link to the section that
holds the details;
D2b. then the content in the agreed order. Move whole items; split an item only where the agreed
order puts its parts in different places. Where an item now comes before something it uses,
add a one-line restatement of what it uses (not a pointer alone).
D2c. reference material that the agreed order puts at the end goes there under a heading saying
it is reference material.
D2d. renumber sections; keep item labels (<the file's label scheme>) unchanged, and add a table
at the end mapping old section numbers to new ones, so that pointers from other files still work.

D3. Check by script before you finish: the multisets of numbers, of labels and of status marks
in the old and the new file agree, apart from what you added in D2a, D2b and D2d (list those
additions). Write the check's output to `reorder-check.txt`.

## Output

O1. `<new file>`, `reorder-check.txt`, and `notes-reorder.md` last (at most 200 words: what you
could not place, anything you found inconsistent in the source, and "done" on its last line).

## Limits

L1. Read only this brief, the files named in it, and this folder. Write only in this folder. No
git. No memory files. No subagents, other models or web search.

L2. <The project's data rules, verbatim.>

L3. Final reply: three lines.

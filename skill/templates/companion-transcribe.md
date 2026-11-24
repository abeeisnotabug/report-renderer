<!-- Template: stage 1 of a companion (SKILL.md, "Making a companion", Mc2). Copy it into the
work folder as brief-transcribe.md. The section "Your chunk" is filled once per chunk, in its own
file brief-transcribe-<chunk>.md (the runner appends it). Fill every <...>, delete text in [...]
that does not apply, and delete this comment. The template holds only wording that every run
shares; everything about the source comes from the placeholders. Skip this stage for every source
that a course's `transcripts/` folder already covers: a file there covers it if its first line's
`source` comment names the PDF and a page range containing the pages. Copy such files into
`sources/transcripts/` unchanged; they follow the format below. -->

# Brief, stage 1: transcribe source pages into text

## Why this task exists

W1. A companion page is being written from <a lecture's notes and its sheets | a paper>. Later
sessions read only text, never page images: an image costs far more than its text, and every
session that reads it pays again. You turn the pages named at the end of this brief into text,
once, so that every later session reads your file instead. Exactness is the whole job: a writer
copies statements and proofs from your file and cannot check them against the page.

## What you do

D1. Read the pages named in "Your chunk" with the Read tool's `pages` parameter (at most 20 pages
per call), once each. The text dump next to the PDF, if any, garbles formulas; use it only to
find things.

D2. Write the transcript file or files named in "Your chunk", in the format below, in one Write call (two
if the chunk is long). Then look once more at the formulas you marked as doubtful and fix them
with as few edits as possible.

D3. Write the done file named in "Your chunk" last, at most 100 words: pages done, the number of
`[unclear: ...]` and `[slip? ...]` marks, anything left out.

## Format of a transcript

This is the format of the transcripts that course folders keep (`transcripts/`, its rules in the
README there); keep it exactly, so that later stages can read either kind the same way. The
language is that of the PDF.

T1. Verbatim: every sentence, formula, definition, theorem, proof, remark, example, exercise,
solution, footnote and margin note, in the printed order. Do not summarise, shorten, reorder,
correct or comment, and add no explanations.

T2. Every page starts with a line `[p. N]` on its own: N is the PDF page number (the Nth page of
the file, as in the Read tool's `pages` parameter), not the printed one. A sheet in its own file
counts from 1. A file that starts in the middle of a page starts with that page's marker.

T3. Headings as Markdown headings (`#` chapter, `##` section, `###` subsection) with their
printed numbers. Numbered items keep their printed label exactly, in bold at the start of the
item (`**<Kind> <number>.**`, kind and number as printed), followed by the text. Sub-parts as
printed. Proofs start with *Proof.* (or the source's word) and end with `$\square$`.

T4. Math as LaTeX that KaTeX parses: `$...$` inline, `$$...$$` on their own lines for displays,
equation numbers as `\tag{...}`, `\begin{aligned}` only inside `$$`. Every symbol as printed
(blackboard bold, calligraphic, hats, tildes); formulas as printed, not simplified.

T5. Footnotes as `[footnote k: text]` right after the sentence with the mark; margin remarks and
boxes as `[margin: ...]` and `[box: ...]`; tables as Markdown tables.

T6. A figure, plot or diagram: one line `[Figure: what it shows, with the labels printed in it]`.
Code listings and their printed output in fenced code blocks.

T7. Markers such as the end of a lecture stay as a line of their own, as printed. Running headers,
footers and page numbers are left out (only the `[p. N]` line).

T8. A suspected slip is transcribed as printed and marked right after it with `[slip? short
reason]`; never corrected. A passage you cannot read with certainty gets `[unclear: your best
reading]`.

T9. The file's first line is `<!-- source: <pdf file name>, pages A-B -->`, A-B the PDF pages whose
content it holds. Nothing else outside the transcript: no introduction, no closing remarks, no
list of doubts (those go into the done file).

## Limits

L1. Read only this brief and the pages and files named in it. Write only the files named in "Your
chunk". No git. No memory or note files. No subagents, other models or web search.

L2. Never open, list or run anything outside this folder.

L3. Final reply: three lines.

## Your chunk
<!-- In brief-transcribe-<chunk>.md, one paragraph: "Source: `sources/<file>.pdf`, PDF pages
<a> to <b> [up to and including the next chapter heading, so that nothing printed above it is
lost]. Write `sources/transcripts/<name>.md` [one file per chapter of notes, named
`notes-ch<NN>.md`; one per sheet, with the sheet PDF's base name], then
`done-transcribe-<chunk>.md`." Chunks of at most about 20 pages; several chunks run side by
side. -->

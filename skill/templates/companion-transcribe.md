<!-- Template: stage 1 of a companion (SKILL.md, "Making a companion", Mc2). Copy it into the
work folder as brief-transcribe.md. The section "Your chunk" is filled once per chunk, in its own
file brief-transcribe-<chunk>.md (the runner appends it). Fill every <...>, delete text in [...]
that does not apply, and delete this comment. The template holds only wording that every run
shares; everything about the source comes from the placeholders. Skip this stage for any source
whose transcript already exists (a course's transcripts/ folder): copy that file into sources/. -->

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

D2. Write the transcript file named in "Your chunk", in the format below, in one Write call (two
if the chunk is long). Then look once more at the formulas you marked as doubtful and fix them
with as few edits as possible.

D3. Write the done file named in "Your chunk" last, at most 100 words: pages done, the number of
`[unclear: ...]` and `[slip? ...]` marks, anything left out.

## Format of a transcript

Keep this format exactly. A transcript that a course folder keeps (`transcripts/`) replaces this
stage only if it follows this format; otherwise it is converted first.

T1. Markdown with LaTeX math: `$...$` inline, `$$...$$` for displays, `\begin{aligned}` inside
`$$` for aligned rows. Macros the source defines are written out.

T2. A marker `[p. N]` on its own line at the start of each PDF page (N the PDF's page number, not
the printed one; add the printed one in brackets if it differs: `[p. N (printed M)]`).

T3. In the source's order and verbatim: headings with their numbers, every numbered item with its
label in bold as printed at the start of a line
(`**<Kind> <number>.**`, exactly as the source prints kind and number), its
statement, its proof, the prose between items, footnotes (`[^n]` at the place, the text at the
end of the page), equation numbers (`\tag{3.1}`), and markers such as the end of a lecture.

T4. No paraphrase and no correction. A slip you notice stays as printed, with a bracketed note
`[slip? ...]` after it. A spot you cannot read gets `[unclear: what it seems to say]`.

T5. A figure gets one line: `[Figure N: what it shows, with its caption verbatim]`.

T6. Exercise sheets: each exercise verbatim with its parts, points and any rule the sheet states
for it.

## Limits

L1. Read only this brief and the pages and files named in it. Write only the two files named in
"Your chunk". No git. No memory or note files. No subagents, other models or web search.

L2. Never open, list or run anything outside this folder.

L3. Final reply: three lines.

## Your chunk
<!-- In brief-transcribe-<chunk>.md, one paragraph: "Source: `sources/<file>.pdf`, PDF pages
<a> to <b> [up to and including the next chapter heading, so that nothing printed above it is
lost]. Write `sources/transcript-<chunk>.md`, then `done-transcribe-<chunk>.md`." Chunks of
about 10 to 15 pages; several chunks run side by side. -->

<!-- Template: one headless session that adds a feature to the shared report renderer
(~/Documents/Works/report-renderer). Copy into the work folder as brief-feature.md, fill every
<...>, delete text in [...] that does not apply, and delete this comment. One feature per session. -->

# Brief: add <feature, a few words> to the report renderer

## Why

W1. RMB renders every report with one shared renderer, `~/Documents/Works/report-renderer`
(`render.sh` -> `render.mjs`, the pandoc filter `layers.lua`, `layers.css`, `layers.js`, the
checks `phone-check.js` and `page-text.mjs`; how reports look and are written: `STYLE.md`).
RMB is a mathematician and statistician who knows R well but not web programming: every
explanation you write (comments, docs) is in plain words.

W2. The feature: <what it is for, who asked, the use case that starts it>.

W3. Who uses it next: <the sessions or pages that will build on it right after you; they read
only the docs you write, so the docs are the contract>.

## What it must do

F1. <requirement>
F2. <requirement>
<...>

F-last. It must not change how any existing report looks or behaves. Pages that do not use the
feature render byte for byte as before, apart from <allowed differences, or "nothing">.

## What you read

R1. In full: `README.md`, `render.mjs`, `layers.css`, `layers.js`, `phone-check.js`, the
comment block at the top of `layers.lua` (up to the first function), and in `STYLE.md` the
sections <sections>. Other files only where you need them (search, then read the part).
[R2. For ideas only, not to copy: <related code elsewhere, e.g. the talk kit's file>.]

## What you deliver

D1. The code, in the renderer folder, following its existing style (short functions, a comment
saying what each part does and why).

D2. Docs: <where: a comment block at the top of each new file, a row in README.md's file table,
a section in STYLE.md "<section>", the markup description at the top of layers.lua>. The docs
must let a later session use the feature without reading your code.

D3. A demo: <where, e.g. skill/demo/demo.md gets one use of the feature>, rendered.

D4. Checks: render the demo and <test pages>, run `phone-check.js` on each, <extra checks the
feature needs>. Re-render `<one existing page that does not use the feature>` and confirm with
`cmp` (or a diff of the HTML) that it is unchanged.

D5. Last, `feature-notes.md` in the work folder (at most 300 words): what you built, the markup
and the API in one screen, what you tested and how, what you left out and why.

## Limits

L1. Write only in the renderer folder and the work folder <work folder>. No git (the conductor
commits). No subagents, no web search, no network installs.
L2. Final reply: three lines.

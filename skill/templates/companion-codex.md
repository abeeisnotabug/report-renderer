<!-- Template: appended to a brief when a stage runs in Codex instead of Claude
(run-companion.sh, ENGINE_MATHCHECK=codex). Copy it into the work folder as brief-codex.md. -->

## Working in Codex

X1. This brief names Claude's tools (Read, Grep, Edit); use your own instead: `sed -n` for line
ranges, `rg -n` for search (name the file), `apply_patch` for edits. The same economy holds. Where the brief points to known places (a list of findings), do not
read whole files: find each place with `rg -n` on a distinctive string and read a window of about
60 lines around it. Otherwise read
each file once, in slices of about 200 lines (`sed -n '1,200p'`, `'201,400p'`, ...; your shell
output is capped, so larger slices get cut), batch nearby edits, no re-reading after an edit.

X2. A PDF page: render only that page, `pdftoppm -f N -l N -r 110 -png sources/<pdf> /tmp/page`,
and view the image. At most the pages the brief allows.

X3. The calling script knits, renders and phone-checks the page after your turn (your sandbox
cannot run the phone check's WebKit): skip every build step of the brief.

X4. Your final message is saved as your reply; keep it to three lines. The files the brief asks
for are what counts.

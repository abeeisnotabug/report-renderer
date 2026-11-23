---
name: talk-writing
description: Make or change an HTML talk deck with RMB's talk kit (~/Documents/Works/report-renderer/talk): slides with steps, animated pictures, live sliders, presenter view with bullet notes, light and dark FSU themes, one self-contained HTML file. Use when the user asks for a talk, a presentation, slides or a deck (without naming PowerPoint), or for changes to a deck built with this kit. Covers the deck folder, the build and checks, the rules for slides and notes, how a talk is made in stages, and publishing.
---

# Making a talk

The kit in this folder builds one self-contained HTML file per talk: no network at run time,
formulas rendered at build time, opens in any browser. It is versioned with the report renderer.

## Start

St1. **Structure comes from RMB.** The talk's structure, length, number of slides, parts (if
any) and framing come from RMB's request and the outline RMB approves. Nothing in `starter/`,
`demo/` or an earlier talk is a model for them.

St2. **Copy `starter/`**, which holds an empty `config.json` and an empty title slide, to a
folder in the project named after the talk. Read `demo/` for markup only: each of its slides
shows one mechanism and has no content; copy a mechanism's markup, never its text or order. Do
not open earlier talks' deck folders unless RMB names one.

St3. The kit (`kit/`) is shared by every talk. A talk never edits it; a talk's own styles go in
its `style.css`. A change to the kit is a change for all future talks: ask RMB first, then
rebuild `demo/` and run all checks on it.

St4. Before a talk of more than a few slides, read `~/.agent-skills-shared/big-tasks/SKILL.md`
and ask RMB for the cast (its S1). The stages are below (Stages).

## The deck folder

D1. `config.json`: `title` (browser tab), `kicker`, `shortTitle` (footer), `subtitle`, `author`,
`affiliation`, `date`, `lang`, `minutes` (planned length), `parts` (overview heading per
`data-part` label), `colors` (alias to slot, below), `output` (optional file name).

D2. `slides*.html`, read in file-name order (several files let several workers write in
parallel). The slide markup, steps, pictures and keys are described at the top of
`kit/engine.js`; the live controls at the top of `kit/live.js`; the drawing helpers at the top of
`kit/lib.js`. `demo/` shows each mechanism once. Part slides (class `divider`) and `data-part`
are optional; a part slide's route takes any number of items.

D3. `anim-*.js` (pictures), `live-*.js` (live controls), optional `style.css` and `assets/`
(files used as `asset:NAME`).

D4. Build: `node ~/Documents/Works/report-renderer/talk/build.mjs <deck folder>` writes
`<deck folder>.html` next to the folder. The build fails on a step index beyond `data-steps`, a
missing notes list for a state, notes written as paragraphs, a formula error, a fixed colour in
a formula, or a URL in the output. It prints slides, states, note words and planned minutes.

## Colours

C1. Two themes, light and dark (key D). The palette is RMB's and fixed (`kit/theme.css`): six
slots `a` to `f` (light: FSU Recht magenta, Sowi sky, Physik orange, Mathe teal-green, Theo
blue, Wiwi amber; dark: lifted versions), accent FSU pink.

C2. Each talk gives its objects names and maps them to slots in `config.json` `colors`, e.g.
`{"signal": "b"}`. Then `\signal{…}` colours a formula, `class="c-signal"` colours HTML text, and
`lib.COLORS.signal` (or the name "signal" wherever a colour is asked for) colours a picture.
Without an alias: `\ca` … `\cf`, `c-a` … `c-f`, `lib.COLORS.a`.

C3. One object, one colour, on every slide. Text that names an object has exactly the object's
colour (no darker text shades). Never write a literal colour into a slide, picture or style.

## Slides and notes

N1. Audience first: the outline brief states who listens, what they know and what they do not.
Every slide is pitched at that.

N2. A slide's title states its message as a sentence. The titles alone tell the story.

N3. Notes are bullet points (Stichpunkte), one list per state: `<ul data-step="k"><li>…</li></ul>`,
3 to 6 keywords or short phrases each, saying what to say, the numbers to mention, and links
back to earlier slides by number. About a quarter of the words of spoken text.

N4. No colour names in notes or slide text (there are two themes): name the object.

N5. A slide with live controls ends its last notes list with a "Try:" cue: which control to move
and what to watch.

N6. `data-min` per slide; the planned minutes add up to the talk's length (`config.json`
`minutes`). The presenter view's clock compares elapsed and planned time.

N7. Labels in pictures at least 24 px. Content stays inside x 96..1824, y 40..1000 (the screenshot
check reports anything outside, except elements with class `bleed`).

## Pictures and live controls

P1. A picture is `setup` / `state(k)` / `draw`. `state(k)` is pure: every state looks the same
however it was reached (the walk test checks this pixel for pixel). Arrays keep their length
across states.

P2. Live controls exist only at a slide's last state; any move of the deck resets them. Every
number a live slide shows is computed in the browser from the controls (`compute`). A talk whose
live slides show computed results gets its own test that recomputes them independently (a
different method, not the same formula) and compares with `Deck.liveCompute` and
`Deck.liveInfo`.

## Checks

K1. In this order, with `export NODE_PATH=$(npm root -g)` (Playwright's WebKit, the engine
behind Safari):

K1a. `node build.mjs <deck>`;

K1b. `THEME=light node shoot.mjs <deck>.html` and `THEME=dark …`: screenshots of every state,
the presenter view and the overview, and a report of overflow, page errors and network requests;

K1c. `THEME=light node test-walk.mjs <deck>.html` (and dark): every step equals a jump;

K1d. `THEME=light node test-live.mjs <deck>.html` (and dark): every control moves, returns,
resets; the keys;

K1e. the talk's own number test, if it has live numbers.

K2. Look at the pictures, slide by slide, as contact sheets:
`magick montage -font ~/Documents/Works/report-renderer/talk/kit/assets/RobotoCondensed-Regular.ttf <shots>/s05-*.png -tile 4x -geometry 640x360+8+8 sheet.png`.
Delete the `*-shots-*` folders afterwards.

## Stages

Sg1. **Outline.** One session writes the storyboard in the structure RMB's request gives (St1):
per slide the title, what is on it per
state, the pictures and controls, the planned minutes, and the notes' content in a line.
Template: `briefs/brief-outline.md`. RMB approves it before anything is built.

Sg2. **Build.** One session per slides file (or one for a short talk) builds the approved
outline into the deck folder and runs K1. Template: `briefs/brief-build.md`.

Sg3. **Reader.** A fresh session reads the built deck once as the audience would, fixes only
clear local errors (a wrong number, overflow, a typo, a broken step) and lists the rest for RMB.
Template: `briefs/brief-reader.md`.

Sg4. Fill the templates' placeholders from the request and the sources. Do not reuse an earlier
talk's briefs. Run each stage headless in an ignored work folder next to the talk, with
`~/Documents/Works/report-renderer/skill/templates/run-stage.sh`.

Sg5. Costs of earlier runs: big-tasks, its measured facts. Log each new run's costs there
(big-tasks Co6).

## Publishing

Pu1. The group server: `~/Documents/Works/report-renderer/site/publish.sh` (VPN needed). Add the
talk's HTML to the project's page list there and a line to `site/index.md`, then run it.

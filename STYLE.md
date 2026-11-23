# How reports look and are written

Rules for every report rendered with this folder. A project's own notes may add to them, never
replace them. The workflow for writing a report is the skill in `skill/SKILL.md`.

## Types

There are three types of report. Each follows this file and its own type file in `skill/`, which
holds only what differs for that type. If a request does not make the type clear, ask RMB.

- **Paper companion** (`skill/paper-companion.md`): retells a paper with added explanations and
  steps. Its order follows the paper.
- **Topic introduction** (`skill/topic-introduction.md`): introduces a topic, framed by a
  question, so that a reader who does not know it yet can follow; reads like a textbook chapter.
  Its order follows the question.
- **Lecture companion** (`skill/lecture-companion.md`): goes with a lecture's notes, result by
  result, with the exercises. Its order follows the lecture.

No report is a model for another. A report's structure comes from RMB's request, its source and
the outline RMB approves (H1).

Links to lectures are RMB's choice per report, never a rule: without a request, a restated result
names no lecture, course or theorem number. (A lecture companion cites its own lecture.)

## Reading

- The product is one self-contained HTML page per report, read in Safari on a phone (393 px wide)
  and in a browser on a laptop. No PDF.
- Render with `render.sh path/to/report.md`. R Markdown reports are first knitted to `.md` with
  `knitr::knit()`, run from the report's folder.
- Nothing is measured: formulas are broken by the rules below, in the reader's browser.

## Form of a report

- **Layered page** (`layered: true` in the YAML header; markup at the top of `layers.lua`):
  - sections that fold, each with a takeaway stated as a claim (`::: gist`);
  - items tagged **[core]** or **[side trip]** (a topic introduction puts its one-word status
    there instead, P4); the statement stays visible, and everything else sits in separate
    closed folds under it, in this order:
    - **Intuition** (`::: intuition`): what the statement means, a picture, where it fails;
    - **Steps** (`::: steps`): the derivation, numbered;
    - **named folds** (`::: {.fold summary="..."}`) for anything else, each labelled with the kind
      of material it holds: "In words", "The computation in full", "Example: the numbers", "Why
      it is needed", "Beyond the lecture". Never a generic label such as "Details".
  - Older pages fold everything after the statement into one block (`::: more`, "steps and
    details"); the renderer still supports it, and a page moves to the separate folds when it is
    next reworked.
- **Levels are layers.** A report holds every level of explanation at once, each in its own
  layer, so the reader picks the level by what they open. The levels are those of the
  explanation-levels skill:

  | Level | Layer |
  | --- | --- |
  | L1, plain words | the **"In words" folds** after displays (P7); in a paper companion also a section's plain-words fold (`skill/paper-companion.md`) |
  | L2, conceptual | the section's takeaway (`::: gist`), its recap (M2), and the items' **Intuition** folds |
  | L3, technical | the visible statement with its status (P4) |
  | L4, rigorous | the **Steps** fold, with "Why" folds inside the steps and after chains (F2) |
  | L5, full depth | **named folds** and side trips: proofs of invoked results, subtleties, counterexamples, limits, connections |

  - **A report fixes its levels itself.** Writing a report never asks for a level, and its
    text is not limited to one question. Material beyond the report's scope (the source's or
    the request's) does not go into the text: list it at the end as possible additions, one
    line each.
- **Item titles** carry a kind word, which colours the title: "**M1. [core] Definition: ...**",
  with Definition, Result, Example, Remark, Figure or Overview. A restated lecture result keeps the
  lecture's own label: "**Lemma 3.38. [core] ...**".
- **"Uses:" lines point backward only.** Each item gets a "Uses:" line listing what it uses; it is
  built from the labels cited in the text. No forward "used in" lists. Forward pointers in words
  are fine, in the running text or in a "Why it is needed" fold, and may cite the later item.
- **Exercises, hints and solutions** appear only in lecture companions.
- **R code**, where a type shows it (E4), folds away; it uses the native pipe `|>` and ggplot2 for
  every plot. The renderer colours code by token. A block meant to be read on the page, such as
  two scripts compared line by line, stays open: fence it as `{.r .open}`.

## Teaching

The rules below serve the purpose given with each group. Where following the letter of a rule
would defeat its purpose, the purpose wins (H4).

### The hierarchy comes first

Prevents: text that loses the overall argument while it explains a detail, and rules applied
for their own sake.

H1. Before writing any prose, write the outline as a tree: the aim; the parts it breaks into, in
the order they are treated; for each section, what it contributes to its part; for each
paragraph, its job in the section. Everything in the text answers to one node of this tree. The
order comes from the type: the question's sub-questions (topic introduction), the paper
(paper companion), the lecture (lecture companion). It never comes from an earlier report, the
starter or the demo.

H2. If the aim has layers, treat them one at a time, each part building on the one before
(for example: what is the method; why can it do what is needed; how is it used). A part is
finished before the next begins.

H3. Every element must serve its node better than plain text would: a figure, a fold, an
example, a check, a restated formula, a side remark. What serves no node is cut. The statements
of a paper or a lecture that a companion reports are nodes by definition; this test applies to
everything added to them. There are no quotas: the number of figures, folds or items follows
from this test, not from a limit.

H4. A rule in this file serves the purpose given with it. Where following the letter of a rule
would defeat its purpose, the purpose wins.

### Moving through the text

Prevents: a reader who does not know why a section is there, or where the argument stands.

M1. **Opening:** a prose paragraph with the problem, what its answer gives, what it costs (what is
hard), and the route; then the same route as a short tree for scanning. The tree is the
outline's top levels (H1), in plain sentences. Not a question and answer about the request. A
type file may add to the opening.

M2. **A section opens with a short recap, then with what it adds.** The recap, a paragraph that
starts "**So far.**", says what the text has shown that this section needs, with the formulas
the section will use written out. Then the section says what it adds, often by naming what the
text so far cannot yet do. The first section after the opening needs no recap.

M3. **A section ends by handing over:** a question, an obstacle or a suspicion that the next
section takes up in its first sentence.

M4. **Recaps** where the displays are densest: one short paragraph that says in words what has
been shown and how it serves the aim.

M5. **A paragraph's first sentence states its move** (a definition, an obstacle, a consequence,
an example), so the first sentences alone give the outline.

M6. **Simple case first, in the form of the general case.** The simple case is written so that
the general case extends it and nothing has to be unlearned. Where a familiar notion does not
generalise, show it failing before replacing it.

M7. **General facts that are known are cited, not re-derived for the special case.** If an
argument rests on a general fact (such as the chain rule for densities), state the general fact
and apply it. Proving it again is not the text's purpose; a proof, if any, goes in a fold. (This
is not a generalising lemma in the sense of "Writing": the fact is known, not introduced for the
case.)

M8. **End** with a short conclusion: what the text has answered, what it has left open, and where
that is treated.

M9. **Notation table.** A section "Notation" right after the opening lists every symbol and
named assumption that the text uses outside the section that defines it, in the order of the
text: the symbol, its name, what it is as a mathematical object (a random variable, a number, a
σ-algebra, an equation), and a link to the item that defines it. Each recap (M2) links to it.

### Prose and items

Prevents: an argument buried under labels and status blocks, and also losing the labels that let
the reader check an earlier result with one click.

P1. **The main line is prose.** Sections hold running paragraphs and labelled items, taking
turns: prose leads to an item, the item states the result, prose takes it up, connects it to the
results before it and says what it is for.

P2. **Items, labels, kind words and "Uses:" lines** as in "Form of a report". A label is a link
the reader clicks to recall an item; that is its use.

P3. **References are written for a human reader.** A reference says in words or as a formula what
is used, and the label follows as a clickable aside: "the update holds because the pair is
jointly normal (Lemma K.1)", "setting $p=2$ in $f(x)=\dots$ (Eq. 13 in P9)". Never a chain of
bare labels such as "this is what M23 in L2 does, with p=2 in M13 under P9".

P4. **Status.** Every statement says what it is ("Writing", "Say what every piece is"). The form
depends on the type: one word in the item title (topic introduction), a status line after the
statement (paper and lecture companions). The type files give the words.

P5. **The kind of a statement is also carried by its sentence:**
- a new term is set in bold where it is defined, after the object has been built;
- a term of the field is stated as a mathematical object (a random variable, an equation, a
  set) before it is used as a word;
- an assumption comes with its reason, and when it is lifted later, the text says so;
- a result used without proof is marked by its verb ("is known", "is stated") and the reason
  there is no proof here;
- a result from earlier in the text is used through what the step needs: the equation the step
  uses is written out where it is used, with the label after it as a link, never the whole item;
- an object from another section is described in words at its first use in an item, so the
  reader need not click to know what it is;
- a basic fact of the reader's toolkit (a property of expectations, of independence, of
  measurability) is stated once as a formula, in the final section of results (K1) or at its
  first use, and is cited by label afterwards, never repeated as a gloss in brackets.

P6. **Voice.** "We" and "let's" for steps the reader follows. No "I": a choice of notation or
emphasis is written in the passive voice or as "the text"; the page's own steps or solutions are
"this page's".

P7. **"In words" folds.** The reading of a display in words goes in a fold right after it,
`::: {.fold summary="In words"}`: the display said as a sentence, with every object named. Every
display that defines or derives something gets one; a display that only repeats an earlier one
does not. Only the reading goes in the fold: new claims, computations and links stay outside.
The main line does not repeat the reading.

### Formulas and derivations

Prevents: unreadable chains, and also trivial algebra spread over many displays.

F1. Display formulas follow "Display formulas" below. Short conditions and short relations stay
inline; not every formula gets its own line.

F2. **A chain carries its reasons, at the reader's level.** A reason the target reader would not
supply goes on the line: over the relation sign, or in a sentence before the chain. Reasons the
reader supplies at once (the toolkit of P5, applied as usual) go together in a `::: why` fold
right after the chain, one sentence per move, with known results cited by label, not restated.

F3. Steps that a reader of the target level does at a glance (expanding a product, collecting
terms) are not split into displays of their own. A step gets its own line where something is
used.

F4. **Checks after a definition or result:** the extreme cases, a case the reader already knows,
or a reduction back to the simple case. They show what the object does before any
interpretation.

F5. **Notation** is announced with its reason when it is chosen. A formula far away is written
out again, or cited by a label whose preview shows it. Every symbol used outside its section is
in the notation table (M9).

F6. **Derive in the general objects.** A derivation inside an example keeps the symbols of the
general definitions; the example's special values are stated once, before the derivation, and
enter only where the step needs them. The definitions the derivation uses are written into it.

F7. **Claims are read off formulas.** A claim follows a displayed formula and says what it reads
off it. A number never stands in for the formula. A number that is the pay-off of a displayed
formula, the point the formula leads to, may follow it in the main line; all other numbers go
into the example fold (E3). A later item that needs the same fact cites the formula with its
label instead of redoing the computation.

F8. **The computation in full.** A computation the reader may want to check, but that would
interrupt the main line, goes in a fold `::: {.fold summary="The computation in full"}`, written
out by hand: every term, and a table where terms are paired off, with the reason each pair gives
what it gives.

### Results used without proof

Prevents: the main line interrupted by results the reader may or may not remember.

K1. General results the text uses but does not derive are restated on the page, in boxes in a
final section, whatever their source, so a click shows them: `::: {#lec-K-1 .lec}` with the title
"**Lemma K.1 (name).**", cited in the text as "Lemma K.1". The kind word is one of Theorem,
Lemma, Definition, Proposition, Corollary, Remark, Example (the renderer links only these). The
citation is clickable and enters the "Uses:" lines. The section's title and numbering: the type
files.

K2. Without a request, a box names no lecture, course or theorem number (see "Types").

### Figures, examples, tables, code

Prevents: a figure for everything, and also a text without the one picture that would make the
point at once.

E1. **A figure earns its place** when it does what the text does worse: it shows how parts are
arranged (sets, graphs, dependencies over time); it tells two or three similar objects or
readings apart; it shows which information an object uses and which it ignores; it shows an
intuition failing; or it shows behaviour across a range when that behaviour is the argument. No
figure for a check, a computation or a formula that is already its clearest form. How figures
and plots are made: "Figures and plots" below.

E2. **Captions** state the claim in the first sentence, letter the panels and walk through them in
order, and repeat the notation, so the figure reads on its own. The text cites the figure at the
sentence it supports.

E3. **Examples.** The source's own examples come first, where a paper or a lecture has them. A
running example serves a whole chapter when one example fits the chapter's aim; otherwise there
is one example per line of thought. Each example is chosen for a property it has or lacks, and
introduced where its concept is introduced.
- An example is defined once, in full. Later places cite that definition and write into a
  derivation only the parts the step uses (F6); no copy of the whole model at each use.
- **Variants** of an example each change one property, so that an assumption or a result has a
  case where it holds and a case where it fails. A variant states only what it changes.
- Its numbers are woven into the items whose results they illustrate, in a fold
  `::: {.fold summary="Example: the numbers"}` under the item (F7), not collected in a section
  of their own.

E4. **R code on the page** depends on the type: a topic introduction shows none; the type files
say where companions show it. Where no code is shown, plots are made in R chunks with
`echo = FALSE`, number checks run off the page, and what the reader should see of a computation
is written out by hand (F8).

E5. **Tables** where cases or constructions are compared along the same rows: two constructions
side by side, cases sorted by the assumptions they satisfy, terms of a computation paired off.

E6. **Named instances.** A few concrete outcomes of an example, given names, are followed through
the text, so that a claim also reads as a statement about one named case. They sit in the
example folds (E3) and in figures.

E7. **Overview sections** after the material they summarise, where they fit: what each condition
or object buys, side by side, and the example that breaks each.

### Length and side trips

Prevents: length that the reader has to sort through.

L1. Length along the line is fine: steps written out, checks, the simple case before the general
one. The reader reads top to bottom and never has to look anything up.

L2. Length beside the line is not: terminology asides, remarks the text does not use later,
second derivations. Such material goes into a named fold under the item it belongs to, into a
side-trip section (`.side`, which brings the "Core only" button), or is cut.

L3. The length of a page is the number of words outside folds (section folds aside). Folds hold
the layers the reader opens on demand.

## Writing

- **Say what every piece is.** This rule comes first. For every statement and every step the
  text says which of these it is: an assumption; a definition; a known result, cited (from the
  page, another report or a lecture); a reminder of a derivation done elsewhere; a new result; or
  a known result for new objects, naming what is new. An item that restates an earlier result
  says so and never presents it as something to be reached again. An item that proves something
  again says why and what is new (a stronger statement, another filtration, an instructive tool),
  and which steps use the earlier result and which do not. The form (one word or a status line)
  is set by the type (P4).
- **Plain technical English** (inspired by ASD-STE100 Simplified Technical English; its
  controlled vocabulary is not enforced, and nothing here claims compliance). For every level
  and every layer:
  - short, direct sentences; one main idea or one logical step per sentence;
  - one term per concept, kept the whole way: no synonyms for variety;
  - active voice where it makes clear who or what acts;
  - assumptions before the conclusions drawn from them;
  - logical connections said out loud: because, so, if, then, therefore;
  - a specialised term defined by simpler concepts when it first appears, while established
    mathematical terms stay as they are;
  - no needless nominalisations ("the estimation of" → "estimating"), no long subordinate
    clauses, no abstract academic phrasing.

  Simple language never simplifies the mathematics, and a concise argument is not split into
  trivial steps to satisfy these rules.
- **Don't simplify; add steps.** Keep definitions and formal statements; where something is hard,
  insert the missing steps.
- **Understanding, not elegance.** A derivation is written to be understood, not to be short or
  clever. No trick that merges two steps, no detour through a more general statement. Citing a
  result that is stated on the page or restated in the final section is not a detour: it is
  usually the shortest and the clearest route.
- **Shortest route first.** Before proving a claim, look for a result already on the page or
  restated in the final section that gives it directly, and cite it instead of proving it again.
- **Remind, never re-derive differently.** Redundancy helps: a result from an earlier item or
  another report may be restated with a reminder or summary of its derivation and a link to the
  original, which is the gold standard. A reminder follows the original's steps. As a rule, do
  not derive the same result again by another route or with other steps: the reader then has to
  ask whether the new route is needed or the result differs. Derivations stay consistent across
  reports.
- **No generalising lemmas.** Never introduce a lemma, a general set, a general function or a
  general statement to prove the case at hand when the case's own chain of equations would do,
  not even when it would cover two places at once, and never re-prove a result that is already
  available. A lemma is fine when it states a separate fact that the proof needs and the page does
  not have yet, such as an inequality for complex numbers inside a limit argument. A known general
  fact is cited and applied (M7).
- **A proof is a chain of equations.** Write the equations; add a step only where something is
  derived, and say there what is used.
- **Every likelihood with every factor.** A likelihood is the probability or density of the
  observed data given the parameters. Write that probability out first with every factor: for
  censored data, event part × censoring part (× the other parts of the record), with the censoring
  factors as formulas, such as $S_C(Y)^{\Delta}f_C(Y)^{1-\Delta}$. Then say why a factor goes (it
  contains no parameter; with latent quantities it is also free of them, so it leaves the integral
  first), and only then drop it. "$\propto$" or "up to factors without parameters" is not a
  start. A likelihood written out elsewhere is restated as a reminder with a link, with the full
  display.
- **Last check.** List the named objects a proof introduces, and delete every one that can go.
- **Purpose first.** Say why an object is introduced and what a derivation buys before doing it.
- **One symbol, one meaning.**
- **Use the field's terms** (in probability: measurable, predictable, adapted), never home-made
  paraphrases.

## Figures and plots

- **Two kinds, made two ways.** A *figure* draws a structure whose positions are chosen by hand:
  nodes and arrows, sets, a timeline, the dependencies of a model. A *plot* shows numbers that code
  computes. The test: if the numbers changed, would the picture change? Then it is a plot. On the
  page both are "Figure n", in one numbering.
- **Figures: TikZ, compiled ahead.** Each figure is a standalone document next to the report,
  `fig-name.tex`, starting `\documentclass[tikz,border=2pt]{standalone}`. The renderer's
  `tikz2svg.sh fig-name.tex` turns it into `fig-name.svg`, with the text as outlines. Commit both.
  The report includes the SVG, so knitting and rendering never need LaTeX: in R Markdown,
  `knitr::include_graphics("fig-name.svg")` in a chunk with `echo=FALSE` and the caption in
  `fig.cap`; in Markdown, `![caption](fig-name.svg)`. The drawing's code stays off the page.
  - Labels are LaTeX maths in the page's notation, 10 pt (standalone's default).
  - Size: the renderer scales a TikZ figure so that its 10 pt labels show at the size of the
    text, which is set in the same Computer Modern, and centres it. Draw it 7 to 8 cm wide: then
    it fills a phone's width, and about half the column on a laptop. A wider figure shrinks on
    the phone, and its labels with it.
  - Dark mode: see "Dark mode" below.
- **Plots: vector graphics from svglite.** Set `knitr::opts_chunk$set(dev = "svglite")` in the
  setup chunk. Maths in axis labels and legends uses R's plotmath (`expression()`, `bquote()`);
  heavier notation goes into the caption, which KaTeX typesets. No tikzDevice: it needs LaTeX at
  every knit and is slow, for nothing but the typesetting of labels.
- **Rasterise the heavy layer of a plot over 500 KB.** A vector plot grows with its marks, about
  140 bytes per scatter point and 13 bytes per line vertex; a raster layer does not grow. If a
  plot's SVG is over 500 KB (roughly 3,500 scatter points, or 37,000 line vertices), wrap only
  the heavy layer in `ggrastr::rasterise(geom, dpi = 220)`; axes, text and the other layers stay
  vector. 220 dpi is enough for a phone at three pixels per point; 300 dpi adds 40 to 50 % to
  the size with no visible gain. The renderer warns about every image over 500 KB. (Measured in
  WebKit, November 2026: below 500 KB a vector plot loads as fast as a rasterised one, and is
  about as small.)
- **Dark mode.** The renderer inverts the lightness of every TikZ figure and svglite plot and
  keeps the hues, so black lines and text turn light, and white backgrounds and fills turn the
  page's dark grey. (PNG images stay on a white box.) So draw on a white or transparent
  background, never a dark one, and use colours that read in both themes. A caption tells marks
  apart by hue ("orange"), by shape ("diamonds") or as "grey", never by "black" or "white",
  which swap in dark mode.

## Display formulas

- **Write every display formula on one line** in the source. Never break one by hand or because it
  looks long.
- **Separate equations** (a system, or several definitions) are aligned rows,
  `\begin{aligned} ... \end{aligned}`. An aligned row cannot break, so keep rows short; a row that
  is too wide scrolls.
- **Equation numbers** with `\tag{...}`: shown in the right margin, level with the formula's last
  line.
- What the renderer does (`breaks.mjs`):
  - a formula that fits stays on one line, centred;
  - too wide: it breaks before the first = outside brackets, and the lines after it are indented;
  - a part that still does not fit breaks before +, × or a slash (/ or \big/) outside brackets,
    and its last line is pushed to the right edge;
  - factors written side by side outside brackets ("p(a | b) p(c | d)") break between each other,
    after a closing bracket, before anything inside the brackets breaks;
  - a `\quad` or `\qquad` outside brackets starts a side condition ("..., \qquad r(0)=1",
    "\quad(i=1,\dots,n)"): it moves to the next line before the formula breaks anywhere else, and
    its relations do not count towards a chain;
  - a chain, a formula with two or more relations (=, <, ≤, ≥, ≈, ...) outside brackets, always
    gets one line per relation, on every screen; ∈, ⊂, → and ∼ do not count;
  - a right-hand side that has to wrap starts its own line under a short left-hand side;
  - inside brackets it breaks first before a conditioning bar, then after a comma, anywhere else
    only as a last resort;
  - a broken formula is centred as a whole;
  - what cannot break scrolls sideways and fades out at the right edge.
- Write the conditioning bar as `\mid` or as a single `|` inside its brackets; a pair of `|` is
  read as an absolute value.
- **Tables** that are too wide scroll on their own.

## Page

- White background in light mode, dark grey in dark mode (follows the device).
- Phones: 17 px text over the full width. Wider screens: 20 px text in a column of 800 px.

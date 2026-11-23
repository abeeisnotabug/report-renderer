# How reports look and are written

Rules for every report rendered with this folder. A project's own notes may add to them, never
replace them. The model for form, style, language and links is a lecture companion built with
this renderer (its chapter on discrete-time martingales was the worked example); reports follow it
except where this file says otherwise. That model predates the plain-words layer and the
STE rules below; a new example report, with both, replaces it once RMB has chosen one (pending:
the Sørensen 2026 comparison, November 2026). The workflow for writing a report is the skill in
`skill/SKILL.md`.

There are two types of report. A **paper companion** follows this file alone. A **topic
introduction**, which reads like a textbook chapter, follows this file and
`skill/topic-introduction.md`, which overrides this file where they differ (opening instead of
"Big picture", status lines, plain-words folds replaced by "In words" folds, generalising
statements, known results, no R code on the page).

Links to lectures are RMB's choice per report, never a rule: without a request, a restated result
names no lecture, course or theorem number.

## Reading

- The product is one self-contained HTML page per report, read in Safari on a phone (393 px wide)
  and in a browser on a laptop. No PDF.
- Render with `render.sh path/to/report.md`. R Markdown reports are first knitted to `.md` with
  `knitr::knit()`, run from the report's folder.
- Nothing is measured: formulas are broken by the rules below, in the reader's browser.

## Form of a report

- **Layered page** (`layered: true` in the YAML header; markup at the top of `layers.lua`):
  - a "Big picture" section with a map of the core items at the top;
  - sections that fold, each with a one-line takeaway (`::: gist`);
  - items tagged **[core]** or **[side trip]**; the statement stays visible, and everything else
    sits in separate closed folds under it, in this order:
    - **Intuition** (`::: intuition`): what the statement means, a picture, where it fails;
    - **Steps** (`::: steps`): the derivation, numbered;
    - **named folds** (`::: {.fold summary="..."}`) for anything else, each labelled with the kind
      of material it holds: "Why it is needed", "Example", "The paper's version", "Beyond the
      lecture". Never a generic label such as "Details".
  - Older pages fold everything after the statement into one block (`::: more`, "steps and
    details"); the renderer still supports it, and a page moves to the separate folds when it is
    next reworked.
- **Levels are layers.** A report holds every level of explanation at once, each in its own
  layer, so the reader picks the level by what they open. The levels are those of the
  explanation-levels skill:

  | Level | Layer |
  | --- | --- |
  | L1, plain words | a section's **plain-words fold** (`::: plain`, "In plain words") |
  | L2, conceptual | the section's takeaway (`::: gist`) and the items' **Intuition** folds |
  | L3, technical | the visible statement with its status line |
  | L4, rigorous | the **Steps** fold, with "Why" folds inside the steps |
  | L5, full depth | **named folds** and side trips: proofs of invoked results, subtleties, counterexamples, limits, connections |

  - **Plain-words fold**, one per folding section, at the section's top level right after the
    gist: what the section does and why, in everyday words, with a concrete example or an
    analogy and almost no notation. It is written for a reader who has not read the section,
    and it may say where the analogy fails. It never replaces a definition; the section still
    states everything precisely. "Plain words only" in the toolbar then shows only the opening,
    the section titles, their takeaways and these folds, so the whole report reads in a few
    minutes as a way in.
  - **A report fixes its levels itself.** Writing a report never asks for a level, and its
    text is not limited to one question. Material beyond the report's scope (the paper's or
    the request's) does not go into the text: list it at the end as possible additions, one
    line each.
- **Item titles** carry a kind word, which colours the title: "**M1. [core] Definition: ...**",
  with Definition, Result, Example, Remark, Figure or Overview. A restated lecture result keeps the
  lecture's own label: "**Lemma 3.38. [core] ...**".
- **"Uses:" lines point backward only.** Each item gets a "Uses:" line listing what it uses; it is
  built from the labels cited in the text. No forward "used in" lists. Forward pointers in words
  are fine, in the running text or in a "Why it is needed" fold, and may cite the later item.
- **Restated results.** Results from lectures or other reports that an item uses are restated on
  the page (`.lec` blocks), so a click shows them.
- **Overview sections** after the material they summarise, where they fit: what each condition or
  object buys, side by side, and the example that breaks each.
- **Opening:** a starting point and a roadmap of what each section shows. Not a question and
  answer about the request.
- **End** a long report with a summary.
- **Reports about a paper** print the paper's equations as printed, with section and page, next
  to the report's own version, with a term-by-term map of the notation.
- **Paper summaries** take the same form.
- **No exercises, hints or solutions** in reports. (Lecture companions have them; reports do not.)
- **R code** folds away; it uses the native pipe `|>` and ggplot2 for every plot. The renderer colours
  code by token. A block meant to be read on the page, such as two scripts compared line by line, stays
  open: fence it as `{.r .open}`.

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

## Writing

- **Say what every piece is.** This rule comes first. For every statement and every step the
  text says which of these it is: an assumption; a definition; a known result, cited (from the
  page, another report or a lecture); a reminder of a derivation done elsewhere; a new result; or
  a known result for new objects, naming what is new. An item that restates an earlier result
  says so ("known, restated from T4") and never presents it as something to be reached again. An
  item that proves something again says why and what is new (a stronger statement, another
  filtration, an instructive tool), and which steps use the earlier result and which do not.
  In reports, write it as a status line after the statement, with these words: *Known* (cited,
  with a link; not shown again), *Reminder* (the steps follow the original's steps), *Known for
  new objects*, *Second route* (with what it adds), *New here*. State the convention once in the
  reading notes; an item without a status line is new on the page.
  - **Papers.** Every report says what is the paper's and what is the report's. In a paper
    summary every item that reports the paper has a status line "*Paper, §2.2* (p. 468):
    defined."; in any other report, every line that prints or reports a paper's statement
    ("*Paper, Eq. 3* (§2.2, p. 468): defined. As printed:") carries the verb too, and the
    report states the verbs it uses next to its status-line convention. The verb says what the
    paper does with the statement and comes from this closed list:
    - *assumed*: a model assumption;
    - *defined*: an object, a model, a notation or a design;
    - *stated*: claimed without an argument;
    - *argued*: claimed with an argument shorter than a derivation (say how long);
    - *quoted* (source): taken from the named source, not derived;
    - *derived*: derived in the paper;
    - *found* (simulation or data): a result of the paper's simulation or data analysis;
    - *judged*: the paper's interpretation, attribution or recommendation;
    - *described*: data, aims, a plan or an algorithm, with no claim.

    An item that reports several things gives one verb per part. After the verb, *Derived in*
    links a report that derives the statement, *Explained in* a report that explains what it
    means without deriving it. Slips in the paper and the report's commentary go in sections of
    their own; their items' status lines start with *My own*, followed by the five words above.
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
  result that is stated on the page or restated from a lecture is not a detour: it is usually the
  shortest and the clearest route.
- **Shortest route first.** Before proving a claim, look for a result already on the page or in a
  restated lecture result that gives it directly, and cite it instead of proving it again.
- **Remind, never re-derive differently.** Redundancy helps: a result from an earlier item or
  another report may be restated with a reminder or summary of its derivation and a link to the
  original, which is the gold standard. A reminder follows the original's steps. Never derive the
  same result again by another route or with other steps: the reader then has to ask whether the
  new route is needed or the result differs. Derivations stay
  consistent across reports.
- **No generalising lemmas.** Never introduce a lemma, a general set, a general function or a
  general statement to prove the case at hand when the case's own chain of equations would do,
  not even when it would cover two places at once, and never re-prove a result that is already
  available. A lemma is fine when it states a separate fact that the proof needs and the page does
  not have yet, such as an inequality for complex numbers inside a limit argument.
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
- **Reprint, don't point.** A formula far away is written out again, or cited by a label whose
  preview shows it.
- **One symbol, one meaning.**
- **Use the lecture's terms** (measurable, predictable, adapted), never home-made paraphrases.

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

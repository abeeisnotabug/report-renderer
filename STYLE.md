# How reports look and are written

Rules for every report rendered with this folder. A project's own notes may add to them, never
replace them. The model for form, style, language and links is a lecture companion built with
this renderer (its chapter on discrete-time martingales was the worked example); reports follow it
except where this file says otherwise.

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
- **Item titles** carry a kind word, which colours the title: "**M1. [core] Definition: ...**",
  with Definition, Result, Example, Remark, Figure or Overview. A restated lecture result keeps the
  lecture's own label: "**Lemma 3.38. [core] ...**".
- **Links point backward only.** Each item gets a "Uses:" line listing what it uses; it is built
  from the labels cited in the text. No forward "used in" lists.
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
- **R code** folds away; it uses the native pipe `|>` and ggplot2 for every figure.

## Writing

- **Don't simplify; add steps.** Keep definitions and formal statements; where something is hard,
  insert the missing steps.
- **Understanding, not elegance.** A derivation is written to be understood, not to be short or
  clever. No trick that merges two steps, no detour through a more general statement. Citing a
  result that is stated on the page or restated from a lecture is not a detour: it is usually the
  shortest and the clearest route.
- **Shortest route first.** Before proving a claim, look for a result already on the page or in a
  restated lecture result that gives it directly, and cite it instead of proving it again.
- **No generalising lemmas.** Never introduce a lemma, a general set, a general function or a
  general statement to prove the case at hand when the case's own chain of equations would do,
  not even when it would cover two places at once, and never re-prove a result that is already
  available. A lemma is fine when it states a separate fact that the proof needs and the page does
  not have yet, such as an inequality for complex numbers inside a limit argument.
- **A proof is a chain of equations.** Write the equations; add a step only where something is
  derived, and say there what is used.
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
  - a part that still does not fit breaks before + or × outside brackets, and its last line is
    pushed to the right edge;
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

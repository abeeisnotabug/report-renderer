---
title: "Devices of a topic introduction"
author: "Demo page of the report-writing skill"
date: ""
layered: true
---

<!-- This page shows the markup of each device of STYLE.md, "Teaching", once, with
placeholders. Its order, its section titles, its number of sections and its words are not a
model: a report's structure comes from RMB's request and the approved outline (H1). Copy a
device's markup, never its text or its place on this page.
Build: ~/Documents/Works/report-renderer/render.sh demo.md -->

This page shows the markup of each teaching device of a report once, with placeholders: symbols $A$, $B$, $C$ and slots in square brackets. Its order and its section titles are not a model for a report; each section shows one device.

[Opening paragraph (M1): the problem, what its answer gives, what it costs, and the route.]

- **[First part of the route.]** [What it shows, in one sentence.]
- **[Second part of the route.]** [What it shows, in one sentence.]

## Notation {#sec-notation .fold}

::: gist
Every symbol used outside the section that defines it: what it is as a mathematical object, and the item that defines it (M9).
:::

| Symbol | Name | What it is | Defined in |
|---|---|---|---|
| $A$ | [name] | [what it is as a mathematical object] | A1 |
| $B$ | [name] | [what it is as a mathematical object] | [label] |

## A. Device: a definition with its reading in words {#sec-a .fold}

::: gist
[The section's contribution to the question, as a claim.]
:::

[Sentence that says what this section adds, often by naming what the text cannot yet do (M2).]

::: {#A1 .item}
**A1. [core] Definition: [name of the object].** [The objects it is built from.] The **[new term]** is

$$A:=[\text{definition}].$$

::: {.fold summary="In words"}
[The display said as a sentence, with every object named.]
:::

::: {.punch kind="demands"}
[What the definition demands beyond the obvious weaker notion, in one to three sentences.]
:::

::: intuition
[What the object means, where the meaning fails.]
:::
:::

[Hand-over (M3): the question, obstacle or suspicion that the next section takes up in its first sentence.]

## B. Device: a recap, an item with every fold, claims read off the result {#sec-b .fold}

::: gist
[Claim.]
:::

**So far.** [What the text has shown that this section needs, with the formulas it uses written out (M2):] Section A defined $A$ as [the definition, written out] (A1). Symbols: [Notation](#sec-notation).

[What this section adds.]

<!-- B1 carries every fold an item may have, written in reading order; the renderer shows them in its
fixed order whatever the order here: Why here, Why it holds, Intuition, Steps, named folds, Source,
Uses (the last, written by the renderer from the labels cited). B2 shows the folds of an exercise. -->

::: need
[One or two sentences: why this section needs B1 at this point. Shown as the item's first fold, "Why here".]
:::

::: {#B1 .item}
**B1. [core] Result: [title].** [Assumption, with its reason.] Then

$$\begin{aligned}A&=B\\ &=C.\end{aligned}$$

::: why
[One sentence per move, for moves the reader supplies at once (F2):] [reason for the first move] (Lemma K.1). [Reason for the second move.]
:::

::: {.fold summary="In words"}
[The result said as a sentence.]
:::

Two consequences follow, each read off this formula (F7).

a. [Claim (a), and the part of the formula it reads off.]
b. [Claim (b), and the part of the formula it reads off.]

::: source
[Where B1 comes from: "Notes, p. 3: derived. Steps: New here." The status line, as the fold "Source".]
:::

::: {.punch kind="why"}
[Why the result holds, in one to three sentences. Shown as the fold "Why it holds".]
:::

::: intuition
[What the result means, a picture, where it fails.]
:::

::: steps
1. [A step that uses something, with what it uses: the equation written out, the label after it as a link, e.g. "inserting [the equation of A1] (A1)".]
2. [Next step.]
:::

::: {.fold summary="The computation in full"}
[A check written out by hand (F8), with a table where terms are paired off:]

| term | [first factor] | [second factor] | why |
|---|---|---|---|
| [term 1] | [value] | 0 | [reason the pair gives 0] |
| [term 2] | 0 | [value] | [reason] |
:::

::: {.fold summary="Example: the numbers"}
[The example's numbers for (a) and (b) (E3), and the named instances (E6):] [For the named case [name], the formula gives ...]
:::

::: {.fold summary="Where it is used"}
[A forward pointer in words: which later item needs B1, and for what.]
:::
:::

::: {#B2 .item}
**B2. [core] Exercise: [task].** [The task, as a sentence; it uses B1.]

::: source
[Notes, p. 4: set (a boxed exercise). Solution: this page's.]
:::

::: {.fold summary="Hint"}
[The property needed, not the mechanism.]
:::

::: {.punch kind="key"}
[The decisive idea, in one to three sentences. Shown as the fold "Key idea", between Hint and Solution.]
:::

::: {.fold summary="Solution (this page's)"}
1. [Step that uses B1 (B1).]
2. [Last step.]
:::
:::

## C. Device: an example, a variant, and a table of cases {#sec-c .fold}

::: gist
[Claim.]
:::

::: {#C1 .item}
**C1. [core] Example: [name of the example].** [Chosen because it has or lacks the property ... (E3).] [The example's model, in full, once:]

$$B=[\text{model}].$$

::: {.fold summary="In words"}
[The model said as a sentence.]
:::
:::

::: {#C2 .item}
**C2. [core] Example: [variant name].** As C1, except that [the one property that changes, and only that].
:::

| | [assumption 1] | [assumption 2] |
|---|---|---|
| C1 | holds | holds |
| C2 | holds | fails |

## D. Device: a figure {#sec-d .fold}

::: gist
[Claim.]
:::

[The sentence the figure supports cites it (E2): [claim] (Figure 1).]

![**Figure 1.** [The claim, in the first sentence.] [Walk through the parts in order, repeating the notation.]](fig-demo.svg)

## E. Device: a side trip {#sec-e .fold .side}

::: gist
[Claim.]
:::

::: {#E1 .item}
**E1. [side trip] Remark: [title].** [Material that serves the question but not the main line (L2).]
:::

## [Final section: title from the type file] {#sec-known .fold}

::: gist
General results the text uses without proof (K1).
:::

::: {#lec-K-1 .lec}
**Lemma K.1 ([name]).** [Statement as a formula.]
:::

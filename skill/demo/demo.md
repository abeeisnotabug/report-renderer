---
title: "Devices of a topic introduction"
author: "Demo page of the report-writing skill"
date: ""
layered: true
---

<!-- This page shows the markup of each device of skill/topic-introduction.md once, with
placeholders. Its order, its section titles, its number of sections and its words are not a
model: a report's structure comes from RMB's request and the approved outline (H1). Copy a
device's markup, never its text or its place on this page.
Build: ~/Documents/Works/report-renderer/render.sh demo.md -->

This page shows the markup of each device of a topic introduction once, with placeholders: symbols such as $X$, $Y$, $Z$ and slots in square brackets. Its order and its section titles are not a model for a report; each section shows one device.

[Opening paragraph (M1): the problem, what its answer gives, what it costs, and the route.]

- **[First part of the route.]** [What it shows, in one sentence.]
- **[Second part of the route.]** [What it shows, in one sentence.]

## Notation {#sec-notation .fold}

::: gist
Every symbol used outside the section that defines it: what it is as a mathematical object, and the item that defines it (M9).
:::

| Symbol | Name | What it is | Defined in |
|---|---|---|---|
| $X$, $Y$ | [name] | [random variables on the probability space of A1] | A1 |
| $Z$ | [name] | [random variable $f(X)+g(Y)$] | A1 |
| $f$, $g$ | [name] | [measurable functions] | A1 |

## A. Device: a definition with its reading in words {#sec-a .fold}

::: gist
[The section's contribution to the question, as a claim.]
:::

[Sentence that says what this section adds, often by naming what the text cannot yet do (M2).]

::: {#A1 .item}
**A1. [defined] Definition: [name of the object].** Let $X$ and $Y$ be [what they are]. The **[new term]** is the random variable

$$Z:=f(X)+g(Y).$$

::: {.fold summary="In words"}
[The display said as a sentence, with every object named: $Z$ is the sum of ...]
:::

::: intuition
[What the object means, where the meaning fails.]
:::
:::

[Hand-over (M3): the question, obstacle or suspicion that the next section takes up in its first sentence.]

## B. Device: a recap, a derivation with a Why fold, claims read off the result {#sec-b .fold}

::: gist
[Claim.]
:::

**So far.** [What the text has shown that this section needs, with the formulas it uses written out (M2):] Section A defined $Z=f(X)+g(Y)$ (A1). Symbols: [Notation](#sec-notation).

[What this section adds.]

::: {#B1 .item}
**B1. [derived] Result: [title].** [Assumption, with its reason.] Then

$$\begin{aligned}\mathbb E(Z\mid X)&=\mathbb E\big(f(X)+g(Y)\mid X\big)\\ &=f(X)+\mathbb E\,g(Y).\end{aligned}$$

::: why
[One sentence per move, for moves the reader supplies at once (F2):] $f(X)$ is known given $X$, and $g(Y)$ is independent of $X$, so its conditional mean is its mean (Lemma K.1).
:::

::: {.fold summary="In words"}
[The result said as a sentence.]
:::

Two consequences follow, each read off this formula (F7).

a. [Claim (a), and the part of the formula it reads off.]
b. [Claim (b), and the part of the formula it reads off.]

::: steps
1. [A step that uses something, with what it uses: the equation written out, the label after it as a link, e.g. "inserting $Z=f(X)+g(Y)$ (A1)".]
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
:::

## C. Device: an example, a variant, and a table of cases {#sec-c .fold}

::: gist
[Claim.]
:::

::: {#C1 .item}
**C1. [defined] Example: [name of the example].** [Chosen because it has or lacks the property ... (E3).] [The example's model, in full, once:]

$$Z=X+Y,\qquad X,Y\ \text{[distribution]}.$$

::: {.fold summary="In words"}
[The model said as a sentence.]
:::
:::

::: {#C2 .item}
**C2. [defined] Example: [variant name].** As C1, except that [the one property that changes, and only that].
:::

| | [assumption 1] | [assumption 2] |
|---|---|---|
| C1 | holds | holds |
| C2 | holds | fails |

## D. Device: a figure {#sec-d .fold}

::: gist
[Claim.]
:::

[The sentence the figure supports cites it (E2): $Z$ depends on $X$ only through $f$ (Figure 1).]

![**Figure 1.** [The claim, in the first sentence.] [Walk through the parts in order, repeating the notation: $Z$ is built from $X$ through $f$ and from $Y$ through $g$.]](fig-demo.svg)

## E. Device: a side trip {#sec-e .fold .side}

::: gist
[Claim.]
:::

::: {#E1 .item}
**E1. [side trip] Remark: [title].** [Material that serves the question but not the main line (L2).]
:::

## Known results {#sec-known .fold}

::: gist
General results the text uses without proof (K1).
:::

::: {#lec-K-1 .lec}
**Lemma K.1 ([name]).** [Statement as a formula, e.g.: if $W$ is independent of $X$, then $\mathbb E(W\mid X)=\mathbb E\,W$.]
:::

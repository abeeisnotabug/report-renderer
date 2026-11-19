# Topic introductions

Rules for the second type of report, agreed with RMB on 2026-11-17. `STYLE.md` holds for every
report; this file overrides it where the two differ, and says so at each such point. Background:
`drafts/textbook-style-notes.md` (notes on the probability chapters by M. Betancourt that served
as the model).

## Which type

Ty1. **Paper companion.** Retells a paper with added explanations and steps. Follows `STYLE.md`
alone.

Ty2. **Topic introduction.** Introduces a topic so that a reader who does not know it yet can
follow, and reads like a textbook chapter. Most topics can be stated as a question ("when does a
process exist, given its finite-dimensional distributions?"), and most questions name a topic, so
the rules below speak of "the question" for either. If RMB names no question, the writer states
the purpose of the text as one and shows it in the opening.

Ty3. If it is unclear which type a request is, ask.

## The hierarchy comes first

Prevents: text that loses the overall argument while it explains a detail, and rules applied
for their own sake.

H1. Before writing any prose, write the outline as a tree: the question; the sub-questions it
breaks into, in the order they are answered; for each section, what it contributes to its
sub-question; for each paragraph, its job in the section. Everything in the text answers to one
node of this tree.

H2. If the question has layers, answer them one at a time, each part building on the one before
(for example: what is the method; why can it do what the question needs; how does a paper use
this). A part is finished before the next begins.

H3. Every element must serve its node better than plain text would: a figure, a fold, an
example, a check, a restated formula, a side remark. What serves no node is cut. There are no
quotas: the number of figures, folds or items follows from this test, not from a limit.

H4. A rule in this file serves the purpose given with it. Where following the letter of a rule
would defeat its purpose, the purpose wins.

## Moving through the text

Prevents: a reader who does not know why a section is there, or where the argument stands.

M1. **Opening:** a prose paragraph with the problem, what its answer gives, what it costs (what is
hard), and the route; then the same route as a short tree for scanning. The tree is the
outline's top levels (H1), in plain sentences.

M2. **A section opens with what it adds**, often by naming what the text so far cannot yet do.

M3. **A section ends by handing over:** a question, an obstacle or a suspicion that the next
section takes up in its first sentence.

M4. **Recaps** where the displays are densest: one short paragraph that says in words what has
been shown and how it serves the question.

M5. **A paragraph's first sentence states its move** (a definition, an obstacle, a consequence,
an example), so the first sentences alone give the outline.

M6. **Simple case first, in the form of the general case.** The simple case is written so that
the general case extends it and nothing has to be unlearned. Where a familiar notion does not
generalise, show it failing before replacing it.

M7. **General facts that are known are cited, not re-derived for the special case.** This
overrides `STYLE.md` ("no detour through a more general statement", "no generalising lemmas")
for known results: if the question's answer rests on a general fact (such as the chain rule for
densities), state the general fact and apply it. Proving it again is not the text's purpose; a
proof, if any, goes in a fold.

M8. **End** with a short conclusion: what the text has answered, what it has left open, and where
that is treated.

## Prose and items

Prevents: an argument buried under labels and status blocks, and also losing the labels that let
the reader check an earlier result with one click.

P1. **The main line is prose.** Sections hold running paragraphs and labelled items, taking
turns: prose leads to an item, the item states the result, prose takes it up.

P2. **Items, labels, kind words and "Uses:" lines stay as in `STYLE.md`.** A label is a link the
reader clicks to recall an item; that is its use.

P3. **References are written for a human reader.** A reference says in words or as a formula what
is used, and the label follows as a clickable aside: "the update holds because the pair is
jointly normal (Lemma K.1)", "setting $p=2$ in $f(x)=\dots$ (Eq. 13 in P9)". Never a chain of
bare labels such as "this is what M23 in L2 does, with p=2 in M13 under P9".

P4. **Status as one word in the item title** (assumed, defined, known, derived, quoted), so the
reader sees at a glance whether to check it. No status lines. This overrides `STYLE.md`'s status
lines. Open: whether the one word is enough is judged on the first pages.

P5. **The kind of a statement is also carried by its sentence:**
- a new term is set in bold where it is defined, after the object has been built;
- an assumption comes with its reason, and when it is lifted later, the text says so;
- a result used without proof is marked by its verb ("is known", "is stated") and the reason
  there is no proof here;
- a result from earlier in the text is restated where it is used, with its label.

P6. **Voice.** "We" and "let's" for steps the reader follows. No "I": a choice of notation or
emphasis is written in the passive voice or as "the text".

P7. **Plain technical English stays** (`STYLE.md`, "Plain technical English"). Interpretation is
woven into the main line ("In words, ..." after a display), so there are no plain-words folds
(`::: plain`), and the "Plain words only" button does not appear. This overrides `STYLE.md`'s
plain-words layer for this type.

## Formulas and derivations

Prevents: unreadable chains, and also trivial algebra spread over many displays.

F1. Display formulas follow `STYLE.md`. Short conditions and short relations stay inline; not
every formula gets its own line.

F2. A chain carries its reasons over the relation signs, as in other reports; a sentence before
the chain may also give the reason for the whole chain. Both may be used together.

F3. Steps that a reader of the target level does at a glance (expanding a product, collecting
terms) are not split into displays of their own. A step gets its own line where something is
used.

F4. **Checks after a definition or result:** the extreme cases, a case the reader already knows,
or a reduction back to the simple case. They show what the object does before any
interpretation.

F5. **Notation** is announced with its reason when it is chosen. A formula needed again is
written out again, or cited by a label whose preview shows it.

## Known results

Prevents: the main line interrupted by results the reader may or may not remember.

K1. General results the text uses but does not derive go in boxes in a final section, "Known
results", whatever their source. Each box has the report's own number and one of the kind words
Theorem, Lemma, Definition, Proposition, Corollary, Remark, Example (the renderer links only
these): `::: {#lec-K-1 .lec}` with the title "**Lemma K.1 (name).**", cited in the text as
"Lemma K.1". The citation is clickable and enters the "Uses:" lines.

K2. **Links to lectures are RMB's choice**, per report, and never a rule. Without a request, a
box names no lecture, course or theorem number. (This holds for paper companions too, which need
no lecture links at all.)

## Figures, examples, code

Prevents: a figure for everything, and also a text without the one picture that would make the
point at once.

E1. **A figure earns its place** when it does what the text does worse: it shows how parts are
arranged (sets, graphs, dependencies over time); it tells two or three similar objects or
readings apart; it shows an intuition failing; or it shows behaviour across a range when that
behaviour is the argument. No figure for a check, a computation or a formula that is already
its clearest form.

E2. **Captions** state the claim in the first sentence, letter the panels and walk through them in
order, and repeat the notation, so the figure reads on its own. The text cites the figure at the
sentence it supports.

E3. **Examples:** one running example, reused through the text, chosen for a property it has or
lacks, and introduced where its concept is introduced. A numerical example is woven into the
sections whose results it checks, not collected in a section of its own.

E4. **R code** for plots and number checks folds away. How figures (TikZ) and plots (svglite,
rasterised above 500 KB) are made: `STYLE.md`, "Figures and plots".

## Length and side trips

Prevents: length that the reader has to sort through.

L1. Length along the line is fine: steps written out, checks, the simple case before the general
one. The reader reads top to bottom and never has to look anything up.

L2. Length beside the line is not: terminology asides, remarks the text does not use later,
second derivations. Such material goes into a named fold under the item it belongs to, into a
side-trip section (`.side`, which brings the "Core only" button), or is cut.

## Markup

The renderer needs no change for this type (markup: the top of `layers.lua`).
- `layered: true`; sections `## X. Title {#sec-x .fold}`, each with `::: gist` (the section's
  contribution to the question, as a claim). Sections fold.
- Prose and displays at a section's top level, between items.
- Items as in `STYLE.md`, with the one-word status (P4) in the brackets where other reports put
  [core]: "**X3. [derived] Result: title.**"; a side trip keeps "[side trip]". Under the
  statement: `::: steps`, `::: why` and named folds whose summary names the kind of material.
- Side trips: `[side trip]` items or `.side` sections.
- Known results: `.lec` boxes in a final section "Known results" (K1).
- No `::: plain` folds, no status lines.
- Render and check as in the skill (render.sh, phone-check.js).

<!-- DRAFT INPUT, not a template and not a rule. Notes from one Opus run (2026-11-17) on Betancourt, quarto_chapters (preface, ch. 1, 6, 8, 11; text CC BY-NC 4.0, paraphrased). They inform a future "topic introduction" report type; RMB decides what enters the template. -->

# What makes Betancourt's probability chapters teach well

Notes for RMB's decision on a template for topic introductions. They describe; they do not
prescribe. Recommendations are marked **Recommendation**. Sources: Pref (preface), Ch1 (Measure and
Probability on Finite Sets), Ch6 (Density Functions), Ch8 (Conditional Probability Theory), Ch11
(Conditional Decompositions), each cited by its section heading. Examples marked *(invented)* are
mine and use the notation of `ours/kalman-tree.md`.

Two facts about the sources. The chapter files license their **text and figures as CC BY-NC
4.0**; the BSD licence in `source/LICENSE` covers the code. The brief calls the sources
BSD-licensed, but since nothing below copies more than short phrases, this changes nothing here.
Ch11 and Pref are drafts (author's notes, broken indices). Prose words without displays: Ch1 about
3,100, Ch8 5,700 (about 90 displays, 13 figures, 7 links elsewhere), Ch11 4,300 (15 figures), Ch6
9,800. No chapter uses an equation number.

---

## A. How the hierarchy is kept visible

**A1. The chapter opening gives a problem, a payoff, a cost and a plan in about 150 words.** Ch6:
expectation values are what we need, they can rarely be computed directly, and rescaling the few
measures we can integrate gets around this. So the chapter formalizes the rescaling, then applies
it to discrete and real spaces. Ch8 names the two operations conditioning provides (splitting a
calculation, building a distribution from pieces), warns that they cost subtlety, gives the order
of the chapter, and defers densities to the next chapter. Ch1 states a thesis (the foundations are
easy, and the trouble comes from complicated spaces and from interpretation), which justifies
working on a finite set. *Purpose:* the reader knows what every later section works towards before
the first definition. Pref ("Overlapping Progressions") names the cost he is paying for: in a
progression without detours, the intermediate steps are hard to connect to the goal.

**A2. A section opens with what it adds, usually by naming a limitation of what came before.** Ch6
"Density Functions": one measure cannot be translated into just any other, so compatibility is
needed, first on finite spaces, then in general. Ch6 "General Spaces": the atomic conditions just
derived must be generalized carefully. Ch8 "Conditioning on Countable And Explicit Partitions":
the partition is the basis, and the simplest case comes first. Parent headings get a single
routing paragraph of 40 to 70 words (Ch6 "Probability Density Functions on Real Spaces", Ch8
"Conditioning On Implicit Partitions"). *Purpose:* each section is placed on the chapter's line, so
nobody wonders why it is there.

**A3. A section ends on a question or a suspicion, and the next one opens by answering it.** Ch8
"Conditional Probabilities" ends by noticing that conditional probabilities behave like
restricted distributions. The next section opens by asking whether they really are distributions,
and checks the Kolmogorov axioms one by one. Ch8 "General Implicit Partitions" shows two obstacles
(uncountable sums, 0/0), asks outright whether any hope remains, and answers yes. Long sections
contain recap paragraphs: "Let's take a breath and summarize what we've done so far" (Ch8
"Decomposing Spaces With Partitions"), and a second in "Countable Implicit Partitions". The second
states the chapter's central insight in words: the pushforward says how much probability each
level set receives, and the kernel says how it spreads across the level set. *Purpose:* the recaps
appear where the displays are densest, and they bring the chapter's goal back into view. In W3's
terms, the paragraph level reports back to the chapter level.

**A4. A paragraph's first sentence states its move, and a few connectors mark its role.**
*Unfortunately* opens an obstacle, *Fortunately* its resolution, *Consequently* a conclusion,
*In other words* a restatement, *For example* an instance (Ch6 and Ch8 use
Fortunately/Unfortunately 6 to 7 times each). First sentences give the reason and the move
together, e.g. that because every cell has positive probability, the law can be rearranged (Ch8).
*Purpose:* the first sentences alone give the argument's outline, and the connector tells the
reader whether the paragraph advances the argument, blocks it, or illustrates it.

**A5. Simple to general: the simple case is written in the form that survives.** This is the
preface's overlapping progression ("nothing has to be unlearned", Pref "Overlapping Progressions")
inside a chapter.
- Ch8 defines conditional probability as a ratio for countable non-null partitions. Before
  generalizing, it recasts the law of total probability as an expectation, π(x) = E[p_x] ("Law of
  Total Expectation", "Countable Implicit Partitions"). The general case keeps this form and drops
  the ratio. Then he checks that the general definition gives back the ratio when the outputs are
  countable ("General Implicit Partitions"). The kernel figure's caption announces the plan in
  advance: for null partitions, the order is reversed, kernel first.
- Ch6 derives on finite spaces that rescaling works only if every atom with zero reference measure
  also has zero target measure. "Absolute Continuity" is the same condition, extended from atoms
  to all null sets. "Probability Mass Functions" then returns to discrete spaces: the familiar mass
  function is the density with respect to counting measure. What the reader knew is given a place
  in the general theory, not replaced.
- Where a simple notion does not generalize, he shows it failing. Ch8 "Independence" starts with
  two independent subsets, shows that demanding this for every subset forces the conditioning set
  to be the whole space, and only then gives the useful notion.

**A6. Where the hierarchy is missing (Ch11).** Ch11's opening says what the chapter does but
hardly why. Its first section stacks 15 displays in 200 words of index notation, and every use of
a decomposition is deferred to later chapters. Its mathematics is easier than Ch6's, yet it is the
hardest chapter to follow, because the cues of A1 to A4 are missing.

**A7. What this would mean for RMB's topic introductions.** A topic introduction has what
Betancourt's chapters lack: one question. Every section can name its contribution to that
question, so the motivation cost of the overlapping progression (A1) largely disappears.
*(invented)* An opening for section L: "Section M gave one joint normal model for states and
answers. The likelihood needs only the answers, so the states are integrated out, an integral of
dimension nk. The chain rule turns it into n normal densities, each needing only ŷ_t and F_t,
which section R computes." And an ending that hands over: "Both come from today's predicted state
mean and covariance; getting these from yesterday's is the filter's job." The tree's "Start"
bullet in section R is already an overlapping move: day 1 is the general step with empty
conditioning (a_{1|0} = a_1). The non-overlapping version would teach day 1 as "state plus noise,
so variances add" (F_1 = P_1 + H_1). At day 2 the reader would then have to relearn this as
Z_tP_{t|t-1}Z_t^⊤ + H_t, with a *predicted* covariance.

---

## B. How the status of a statement is conveyed without labels

**B1. Definitions: a bold term, in a sentence about what the object does, often after it has been
built.** In Ch8 "Conditional Probabilities", the ratio appears in the last line of a chain (marked
≡), and only then is it bolded, named, and described as a proportion. Ch1 builds the reservoir and
the allocation first, and only then names the result a **measure**. The verbs separate standard
terms from coined ones: "known as" for the literature's terms (law of total probability; Hausdorff
σ-algebra, with a citation), and "I will refer to … as" for his own (π-non-null, conditional
probability kernel, dependency subsequences). Where the literature disagrees, he says so and fixes
his usage (Ch8 "Conditional Probability Kernels"; Ch6 "The Normal Family", where he avoids the
term "normal distribution").

**B2. An assumption arrives with its purpose and leaves explicitly.** Ch6 "Finite Spaces" first
assumes that every atom has positive finite measure, so that one may divide. Two paragraphs later
he weakens the assumption and derives the exact condition. Ch8 introduces its non-null
restriction as a simplification for first steps and lifts it in "General Implicit Partitions".
Standing regularity assumptions are stated once, with a reason to stop worrying about them: almost
every σ-algebra is Hausdorff, and every distribution in the book is Radon (Ch8).

**B3. A result stated without proof is marked by a verb and a reason.** The Radon-Nikodym theorem
is never called a theorem. It appears as an if-then sentence, unproved and unapologetic (Ch6
"Radon-Nikodym Derivatives"). The existence of disintegrations is credited to a difficult analysis
in two cited papers (Ch8 "General Implicit Partitions"). He admits he left the regularity
condition vague on purpose and that it lies beyond the book. The Ch8 conclusion says plainly that
existence was stated, not shown. Verbs such as *stated*, *shows*, *turns out* do what STYLE.md's
*Known* does.

**B4. Earlier results are restated with a link, not cited bare.** Ch8's first section restates
Ch6's partition with all four displays and the figure, as a refresher. Ch11 opens with "Recall
that" and the full disintegration statement. Ch6 "Probability Mass Functions" says it repeats the
steps of its first section and does them again for the counting measure. These are STYLE.md's
*Reminder* and *Known for new objects*, written as prose.

**B5. Skippable derivations are moved out and labelled by need.** Ch6 states the Poisson and normal
moments in the text and derives them in an appendix that will "absolutely not be necessary for
keeping up with future chapters". Derivations that carry the concept (the finite-space rescaling,
the axiom checks) stay in the main line.

**B6. "I" marks a choice, "we" marks a step.** First person singular marks decisions that could
have gone otherwise: notation, terminology, taste (Ch1 "Subsets", Ch8 "General Implicit
Partitions"). "We" and "let's" mark steps that follow and can be checked. *Purpose:* the reader can
tell what to verify from what to accept as a convention.

**B7. Compared with the status lines.** *Better:* status sits in the sentence that makes the claim.
It adds no block, and it carries the reason (why the assumption, why no proof), which is exactly
the "is this necessary for me to read?" question in `ours/reports-lose-the-forest.md`. Status is
marked only where a reader could misjudge it. *Worse:* nothing can be scanned or filtered. The
difference between a reminder and a new derivation is only implicit. Everything depends on the
writer judging when status matters, and W3 says this judgment fails when it is handed over as a
rule. *(invented)* The status line RMB read five times ("(a) is Known for new objects: it is the
operation πQ…") would not exist in this style, because the argument does not use it. Where status
does matter, the prose form is: "That jointly normal vectors have normal conditionals, with this
mean and covariance, is a Stochastik I result, used here as it stands."

---

## C. How formulas and derivations are written

**C1. Displays are dense and are part of sentences.** Ch8 has about one display per 60 words of
prose; even "c_i ≠ ∅" gets its own line. A display carries the sentence's punctuation and is often
followed by a closing clause such as "as needed". *Purpose:* each object can be found by eye, and
the sentence says what each display is for. *Cost:* length (E3).

**C2. Chains are aligned, one relation and one change per line, and justified once, before the
chain.** The reason precedes the chain (the cells are disjoint, so the intersections are; this
calls for countable additivity, Ch8 "Law of Total Probability"). Lines are not annotated one by
one. A derivation that needs two reasons becomes two chains with a sentence between them: Ch6
"Finite Spaces" handles the μ-sum and the ν-sum separately and then compares them. Trivial steps
are written out (multiplying by ν/ν = 1). *Purpose:* each chain does one thing, so it needs one
reason. The kalman tree's "First equality: …, second equality: …" is the other way to handle a
chain that does two things.

**C3. "In words" after the result, the name after the words.** The display comes first, then "In
words, …", then the bolded name: additivity (Ch1), the law of total probability (Ch8), the
translation of integrals (Ch6). Each chapter has 3 to 8 of these. *Purpose:* the name labels
something the reader already understands.

**C4. Checks right after a definition: extremes, non-examples, reduction.** Right after defining
conditional probability, he computes the extremes (disjoint from the cell gives 0, containing it
gives 1), before any interpretation (Ch8). σ-finiteness gets examples (finite, counting and
Lebesgue measures) and an obstruction (an infinite atom), and the RN derivative gets dν/dν = 1
(Ch6). The general disintegration is reduced back to the countable case (Ch8). *(invented)* For
a_{t|t} = a_{t|t-1} + K_tv_t: if Z_t = 0 or H_t → ∞, then K_t → 0 and the answer changes nothing.
In the scalar model with Z_t = 1 and H_t → 0, K_t → 1 and the filtered mean is the answer itself.
Two lines make the gain readable as a weight before any regression interpretation.

**C5. Notation choices are announced with their reason, and their costs are admitted.** Elements
are roman and subsets sans-serif, so they cannot be confused. Overloading μ for elements and
subsets is admitted as a sin (Ch1). Almost-everywhere equality is written as "=" with ν above it,
so the qualification sits inside the formula (Ch6). Greek letters for distributions are paired
with roman letters for their densities, with a warning that this hides the reference measure (Ch6
"Specifying…"). Each new object gets a two-row type display (domain → codomain, element ↦ value).
A formula needed again is displayed again, never referred to by number. *(invented)* A type display
for the filter step shows at once what depends on the answers: (a_{t-1|t-1}, P_{t-1|t-1}, y_t) ↦
(a_{t|t}, P_{t|t}), where P_{t|t} does not depend on y_t.

**C6. Weaknesses.** Typos inside formulas (φ and ϖ for one map in Ch8), and padded chains (Ch8
"Over Partition Cells" repeats the previous section's five-line chain for a one-line fact).

---

## D. Figures and examples

**D1. Ch8, figure by figure** (13 figures, most with several panels).

| Section | Shows | Job |
|---|---|---|
| Partitions | a space; a valid partition; an overlapping cover; a disjoint non-cover | definition, with both ways to fail |
| Partitions | three maps: point→cell, cell→index, point→index | keep similar maps apart |
| Partitions | a map, and its level sets rebuilding the partition | the reversal: function → partition |
| Partitions | a finite-output function and its partition | the general claim at finite size |
| Partitions | an uncountable partition | the case the chapter heads for |
| Partitions | ℝ² as vertical lines; as circles | concrete instances, reused in Independence |
| Total probability | partition; subset cut by the cells; probability split | the law, in the order of the derivation |
| Conditional probabilities | x∩c as a share of c | the ratio |
| Over partition cells | concentrated on c within X; living on c alone | two readings side by side |
| Kernels | probabilities → distributions → kernel | the hierarchy of objects; the caption announces the null-partition plan |
| Countable implicit | function; initial; pushforward; kernel | the central picture: two pieces hold all the information |
| General implicit | a subset cut into uncountably many pieces | the obstacle |
| General implicit | expectation over level-set probabilities | the resolution |

There is no figure for the axiom checks, the law of total expectation, the kernel's partial
evaluations, or independence. These are algebra.

**D2. Ch11** (15 figures). The first half has only one: ordered Bell numbers on a log scale, a data
plot used as an argument for restricting to atomic decompositions. "Directed Acyclic Graphs" has
four vocabulary figures, one per term. "Graphical Models of Conditional Decompositions" builds the
I = 8 graph edge by edge, one panel per sentence, then refines it. "Bells and Whistles" has one
figure per notation feature, and "Subtleties and Limitations" shows three failed drawings of
dependence on differences. In this half the figures *are* the subject, since a graphical model is
a visual notation. The algebraic first half, where a picture of the nested thinned spaces would
help most, has none.

**D3. Captions** state the claim in the first sentence, letter the panels and walk through them in
order. They repeat the notation, so they stand alone, and they sometimes add content: the kernel
caption gives the plan, and the caption for intervals of unequal length gives the number (almost
twice the probability, Ch6 "As Visualizations"). The text cites the figure in parentheses at the
sentence it supports.

**D4. The criterion he seems to follow.** A figure appears where at least one of these holds:
(i) the claim is about how parts are arranged (sets, level sets, edges), and prose could only list
them; (ii) the reader must tell two or three similar objects or readings apart; (iii) an intuition
must be shown failing (unequal intervals; a circle cut at its peak, Ch6; the difference DAGs);
(iv) behaviour across a range *is* the argument (Bell numbers; Poisson mass functions as λ grows).
No figure appears where the content is a check or a computation, or where the formula is already
the clearest form. The criterion is relative to the reader: the Ch11 vocabulary figures serve
readers new to graphs, and for RMB they would be the "figure for everything" that
`ours/limits-are-guards-not-targets.md` guards against. *(invented, applied)* The tree's two
figures pass: the three filter days under (ii) and (iv), and the DSEM before and after augmentation
under (i) and (ii). **Recommendation:** the criterion also admits the model's graph in section M
(η_t → η_{t+1}, η_t → y_t). It would show the point of Ch11 "Conditional Independencies" in this
model: there is no edge y_{t-1} → y_t, yet y_t depends on every earlier answer through the states,
and that is why the likelihood's factors need the filter. The DSEM figure draws this graph already,
so one drawing could serve both.

**D5. Examples and code.** These chapters have no code (Pref says code comes later). Ch1 carries one
toy set through the whole chapter, chosen, as he says, because its symbols suggest no order. Ch8's
ℝ² projection and radial examples appear in "Partitions" and return in "Independence", so their
cost is paid once. Ch6's Poisson and normal families are worked examples, with results in the text
and calculations in the appendix. Ch11's examples are index patterns (I = 3, 4, 8) with no meaning,
which is the other reason it reads dry. *Criterion:* one running example, reused, chosen for a
property it has or lacks, and placed where its concept is introduced.

---

## E. Tone and length

**E1. Voice.** "We" for the shared derivation, "I" for choices (B6). He is honest about gaps:
"Admittedly, I'm being a bit mathematically sloppy here" (Ch6 "Operator Perspective"). He warns
never to read densities "outside of the shadow of an integral" (Ch6 "Radon-Nikodym Derivatives"),
and he calls ubiquitous conventions sloppy while using them (Ch6 "Abusing The Equals Sign"). The
light humour is optional; the honesty is not.

**E2. Sizes.** Chapters run 3,000 to 10,000 prose words. Sections run 150 to 1,300 words.
Conclusions take 75 to 105 words and say what is still missing and what comes next, rather than
summarizing.

**E3. What makes them long, and whether that serves the reader.** Five sources: (a) every formula
displayed and every trivial step written out; (b) extremes and examples after each definition;
(c) each concept twice, simple and general, with a check that they agree; (d) terminology asides
(three paragraphs on density notation, Ch6 "Specifying…"); (e) side trips the chapter does not use
later (Ch6 "Operator Perspective", about 800 words; "Geometric Probability Density Functions",
about 900). Sources (a) to (c) are length *along the line*: the reader reads top to bottom, never
decides what to skip, and never looks anything up. That kind of length addresses RMB's complaint,
which was about material beside the argument at the argument's level, not about length. Sources
(d) and (e) are length *beside the line*. In the main text they would recreate the complaint; in
the renderer they belong in folds. Much of Ch6 and Ch8 is also Stochastik I for RMB. A topic
introduction would recall those results in a sentence or a `.lec` block, so the same technique
would produce much shorter text.

**E4. What he leaves out:** proofs of the deep theorems, Radon measures, rigorous conditional
independence, the interpretation of probability, how to choose a decomposition. Each omission is
named, with where it is treated or why it is beyond scope.

---

## F. What the current style does well, and where it conflicts

**Keep.** The **page-top tree with its root display** does what Betancourt cannot: his chapters
answer no single question, so they cannot show the answer first. **Folds for steps and side trips**
do what his appendix does, but in place. **Collapsible sections with a gist** are the one-line
form of his section-opening paragraph (A2). **Number checks** (ℓ ≈ −5.9613 by two routes) have no
counterpart in his chapters, which check with symbolic extremes (C4); both are worth having.
Several STYLE.md rules are already his practice: purpose first, assumptions before conclusions,
reprint rather than point, remind without re-deriving differently, one term per concept.

**Conflicts.**

1. *Status lines against status in prose (B7).* Lines are uniform and scannable, but they sit
   beside the argument and multiply with the items. Prose carries the reason and costs nothing
   where status is obvious, but it relies on the writer's judgment and cannot be filtered.
2. *Numbered items, "Uses:" lines and tags against unnumbered linear prose.* Labels let a reader
   jump and check dependencies, but they are the cross-reference load RMB named in W2. In linear
   prose, order shows the dependencies, and restating replaces pointing.
3. *A plain-words layer and Intuition folds against interpretation woven into the main line (C3,
   A3).* Layers let a reader read only plain words. Weaving makes each formula interpretable where
   it stands, so the main line needs nothing opened, and weaving is most of what makes his text
   read like a textbook.
4. *"No detour through a more general statement" against overlapping progression (A5).* The rule
   blocks lemmas the case does not need. His general forms are not detours, because the simple
   case is written as an instance of the general one. In a topic introduction the general fact is
   often the point: the chain rule holds for any density, and that is why the Kalman likelihood
   factorizes.
5. *STE style against narrative connectors (A4).* *Unfortunately/Fortunately* mark a paragraph's
   role, which because/so/then do not. They are compatible if these connectors count as logical
   words.
6. *Kind words in item titles against topic headings.* "Definition: …" shows status at a glance.
   "Abusing The Equals Sign" shows the section's contribution, which is what A2 relies on.

---

## G. A topic introduction in the existing markup

**Carries over.**
- `layered: true`, and sections `## L. Title {#sec-l .fold}` with `::: gist`. The gist states the
  section's contribution to the question as a claim (A2).
- Running prose and displays at the section's top level, outside items. The markup description is
  silent on this, Pandoc should pass it through, and one render would confirm it. "Plain words
  only" mode would hide it.
- Few items, or none. Labels in the text auto-link and every item gets a "Uses:" line, so fewer
  items mean fewer links. `uses: false` switches the lines off. **Recommendation:** items only for
  the two or three statements that later sections recall (the root, the filter step).
- `::: steps` and `::: why` for derivations off the main line, such as the proof of the normal
  conditioning formula. They are Betancourt's appendix, placed where it is needed.
- Named folds whose `summary` gives the kind *and* whether it is needed ("Proof (not needed
  later)", "Terminology: other names"). Any summary text is accepted, so the label answers "do I
  need this?" without a status line.
- `.lec` blocks for recalled Stochastik results (B4).
- `.side` sections for side trips (E3 (e)), which bring the "Core only" button.
- Chains: the renderer gives each relation its own line, which reproduces his aligned chains. The
  justification goes in the sentence before the chain (C2) or in `::: why`.
- R code folds for the number checks.

**Does not apply, or optional.** The status-line words and paper verbs (except where a paper's
equation is quoted), routes pages, `\tag` (he uses none; the root display is the only candidate),
and `::: plain` folds if plain words are woven in. Without plain folds, the "Plain words only"
button does not appear.

---

## H. Open questions for RMB

1. Does a topic introduction number its items, or use section letters plus a few labelled
   statements?
2. Is status conveyed only in prose, or does a one-word marker remain for statements whose status a
   reader cannot infer, such as results stated without proof?
3. Are plain words woven into the main line, kept in `::: plain` folds, or both?
4. Which Stochastik I and II results go on the main line and which into `.lec` blocks (for example
   the normal conditioning formula)?
5. Do the main sections fold (`.fold`) when the page is meant to be read top to bottom?
6. Does the opening stay a nested tree, or become a prose paragraph with the root display?
7. Is the number example woven into the sections it checks, or kept in its own section as D is now?
8. Is the DSEM augmentation (section N) on the introduction's line or a side trip?

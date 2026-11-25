---
pagetitle: "Reports"
---

# Reports

Reports rendered with the shared report renderer, one page each. Every page is self-contained and
reads on a phone; within a project the pages link to each other.

**Contents**

- [MLTS count and survival](#mlts)
  - [Basics](#mlts-basics)
  - [Henderson, Diggle & Dobson (2000)](#mlts-henderson)
  - [Wang & Zhong (2025)](#mlts-wang-zhong)
  - [Sørensen (2026)](#mlts-sorensen)
- [Stochastik](#stochastik)
  - [Stochastik II companion](#stochastik-ii)
  - [Stochastik III](#stochastik-iii)
- [CCFA and LST-R](#ccfa)

## MLTS count and survival {#mlts}

Background for extending multilevel latent time series models to count and event outcomes.

### Basics {#mlts-basics}

- [Survival and counting processes with Stochastik II](mlts/basics/survival.html): hazard,
  compensator, censoring and the likelihood on a grid, many events, random hazards.
- [Gaussian processes and the Ornstein–Uhlenbeck process](mlts/basics/gp-ou-crash-course.html):
  a crash course for Henderson et al. (2000).
- [Densities, dominating measures and the Kiefer–Wolfowitz likelihood](mlts/basics/radon-nikodym-report.html):
  the Radon–Nikodym theorem and what a likelihood is when no measure dominates.

### Henderson, Diggle & Dobson (2000) {#mlts-henderson}

- [Background: the martingale route](mlts/henderson-2000/hdd-background.html): the paper's
  likelihood derived on a grid.
- [Summary of the paper](mlts/henderson-2000/henderson-2000.html).

### Wang & Zhong (2025) {#mlts-wang-zhong}

- [The joint likelihood](mlts/wang-zhong-2025/wz-likelihood.html): the paper's Eq. 8 derived,
  the nonparametric likelihood, and a Stan fit.
- [Summary of the paper](mlts/wang-zhong-2025/wang-zhong-2025.html).

### Sørensen (2026) {#mlts-sorensen}

- [The Kalman filter, and how Sørensen (2026) marginalises a DSEM](mlts/sorensen-2026/kalman-intro.html):
  what the filter computes, why it gives the marginal likelihood exactly, and how the paper gives
  a DSEM the filter's shape.
- [Talk (RMB version): the same story in about 45 minutes](mlts/sorensen-2026/kalman-talk-RMB.html): animated
  slides; arrow keys step, S opens the presenter view with the talk text.
- [Talk (group version)](mlts/sorensen-2026/kalman-talk-group.html): the same story for the
  research group, without the measure-theoretic layer, with a slide on why drawing the states is
  slow; arrow keys step, S opens the presenter view, D switches light and dark.

## Stochastik {#stochastik}

Lecture companions for Perkowski's Stochastik II and a crash course in Stochastik III: every result
of the lecture with the missing steps, intuitions, the exercises with hints and solutions, and
overviews.

### Stochastik II companion {#stochastik-ii}

Perkowski's Stochastik II, winter 2026/27: one page per finished chapter of the lecture notes.

- [Introduction and chapter 1: the conditional expectation](stochastik/stochastik2/ch1-conditional-expectation.html):
  the orthogonal projection in $L^2$, the construction of the conditional expectation, and its
  rules.
- [Chapter 2: construction of stochastic processes](stochastik/stochastik2/ch2-construction.html):
  finite-dimensional distributions, Kolmogorov's extension theorem, product measures, Gaussian
  processes, Markov chains and the Poisson process.

### Stochastik III {#stochastik-iii}

- [Chapter 1 companion - GPT](stochastik/stochastik3/ch1-gaussian-processes-GPT.html): Gaussian processes, pre-Brownian motion and white noise (Galeati, 2024/25).
- [Chapter 1 companion - Claude](stochastik/stochastik3/ch1-gaussian-processes-Claude.html): the same chapter, written independently by Claude for comparison.
- [Chapter 1 companion - Claude, theme test](stochastik/stochastik3/ch1-gaussian-processes-Claude-fsu.html): the same page in the colours of the FSU talk theme (light and dark follow the phone's setting).
- [Crash course](stochastik/stochastik3/crash-course.html): stochastic calculus without proofs,
  each result with an intuition, and the bridge to continuous-time MLTS models.

## CCFA and LST-R {#ccfa}

Background for the paper "A Latent State–Trait Perspective on Cross-Classified Factor Analysis"
(with Tobias Koch).

- [The cross-classified model inside LST-R theory](ccfa/cc-in-lstr.html): how the CC factor
  model must be defined inside revised latent state–trait theory, the restrictions R1–R5 it
  adds, and where trait change, autoregression and noninvariance go; with a running example
  computed in R.
- [Talk for Tobias Koch: the setup in 30 minutes](ccfa/cc-lstr-setup-talk.html): the setup
  for CC models inside LST-R, from the definitions and assumptions to the results, the comparison
  with the draft and the choices left open; slides tagged "not yet reviewed" rest on parts not yet
  checked. Arrow keys step, S opens the presenter view, D switches light and dark.
- [Talk, version 3: CC models inside LST-R in about 40 minutes](ccfa/cc-lstr-talk.html): the
  rebuilt talk in seven parts and a summary, from the design and its assumptions to the
  definitions, what follows and the open choice of the context; appendix A on what a fitted CC
  model reports, appendix B on further topics. Arrow keys step, S opens the presenter view, D
  switches light and dark.

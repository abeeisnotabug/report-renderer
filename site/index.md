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
- [Stochastik](#stochastik)
  - [Stochastik II companion](#stochastik-ii)
  - [Stochastik III](#stochastik-iii)

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

## Stochastik {#stochastik}

Lecture companions for Perkowski's Stochastik II and a crash course in Stochastik III: every result
of the lecture with the missing steps, intuitions, the exercises with hints and solutions, and
overviews.

### Stochastik II companion {#stochastik-ii}

- [The course on one page](stochastik/stochastik2/course-overview.html): what each chapter does,
  the threads through the course, the limit theorems side by side, every exercise and every slip.
- [Chapter 0: basics from measure theory and topology](stochastik/stochastik2/ch0-basics.html):
  Dynkin's π-λ theorem, uniqueness and extension of measures, the topology of metric spaces.
- [Chapter 1: construction of stochastic processes](stochastik/stochastik2/ch1-construction.html):
  finite-dimensional distributions, Kolmogorov's extension theorem, Polish spaces.
- [Chapter 2: the conditional expectation](stochastik/stochastik2/ch2-condexp.html): the best
  guess from the information in a σ-algebra, its construction through the projection in $L^2$,
  and its rules.
- [Chapter 3: martingales](stochastik/stochastik2/ch3-martingales.html): stopping, almost sure
  convergence, uniform integrability, Doob's inequalities.
- [Chapter 4: Markov chains](stochastik/stochastik2/ch4-markov.html): stationary measures,
  recurrence, the fundamental theorem and the ergodic theorem.
- [Chapter 5: applications of Markov chains](stochastik/stochastik2/ch5-applications.html):
  PageRank, Markov chain Monte Carlo, a glimpse of Bayesian inference.
- [Chapter 6: weak convergence](stochastik/stochastik2/ch6-weak.html): Portmanteau, Prohorov,
  the space of continuous paths, Donsker's theorem.

### Stochastik III {#stochastik-iii}

- [Crash course](stochastik/stochastik3/crash-course.html): stochastic calculus without proofs,
  each result with an intuition, and the bridge to continuous-time MLTS models.

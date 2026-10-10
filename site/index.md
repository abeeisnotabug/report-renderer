---
pagetitle: "Reports"
---

# Reports

Reports rendered with the shared report renderer, one page each. Every page is self-contained and
reads on a phone; within a project the pages link to each other.

## MLTS count and survival

Background for extending multilevel latent time series models to count and event outcomes.

**Basics**

- [Survival and counting processes with Stochastik II](mlts/basics/survival.html): hazard,
  compensator, censoring and the likelihood on a grid, many events, random hazards.
- [Gaussian processes and the Ornstein–Uhlenbeck process](mlts/basics/gp-ou-crash-course.html):
  a crash course for Henderson et al. (2000).
- [Densities, dominating measures and the Kiefer–Wolfowitz likelihood](mlts/basics/radon-nikodym-report.html):
  the Radon–Nikodym theorem and what a likelihood is when no measure dominates.

**Henderson, Diggle & Dobson (2000)**

- [Background: the martingale route](mlts/henderson-2000/hdd-background.html): the paper's
  likelihood derived on a grid.
- [Summary of the paper](mlts/henderson-2000/henderson-2000.html).

**Wang & Zhong (2025)**

- [The joint likelihood](mlts/wang-zhong-2025/wz-likelihood.html): the paper's Eq. 8 derived,
  the nonparametric likelihood, and a Stan fit.
- [Summary of the paper](mlts/wang-zhong-2025/wang-zhong-2025.html).

## Examples picked by the reader

Each example is the punch and the need line the reader picked as best for one item of the page (some slightly edited by the reader), with the reader's comments when picking. Use them to see what the reader wants; do not copy their wording for other items.

### lec-1-1 (Definition 1.1, Gaussian process)
Punch: The test examines every direction in each finite vector of coordinates. Knowing each coordinate's marginal law only tests the directions that pick out one coordinate.
Need: Gaussian vectors have finitely many coordinates, while Brownian motion and white noise have uncountably many, so the page needs a notion that imposes Gaussianity on every finite set of indices without forming one big vector.
Reader: another candidate needed several readings to parse; a need line that sounded like a counterexample was bad.

### lec-1-2 (Proposition 1.2, existence of Gaussian processes)
Punch: Each finite restriction of the kernel gives an ordinary covariance matrix. The finite Gaussian laws agree when we drop coordinates because the mean and covariance of the coordinates we keep are the same in both laws. By this consistency, Kolmogorov's extension theorem builds the process.
Need: Uniqueness of the law came with the definition, but a pair $(m,\Gamma)$ on an infinite index set does not yet come with any process, and the finite-dimensional recipe, an affine image of a standard normal vector, has no infinite analogue.
Reader: bad were a candidate that makes the reader recall the analytic form of the characteristic function, and one that reads like a proof step, not a punch; a need line was bad because it did not say why its point mattered here.

### lec-1-4 (Lemma 1.4, independent increments)
Punch: (ii): Both endpoints of an increment have the same covariance with each earlier observation. Subtraction cancels it, and joint Gaussianity turns those cancellations into independence from the past.
Need: The minimum covariance describes observations at fixed times. Restarting the process at one of those times requires separating future increments from past observations.
Reader: liked this need line because it gives a new perspective.

### lec-1-5 (Example 1.5, fractional pre-Brownian motion)
Punch: $\Phi(t,\cdot)-\Phi(s,\cdot)$ is $\Phi(t-s,\cdot)$ shifted by $s$, and $\Phi(u,\cdot)$ has squared $L^2$ norm proportional to $u^{2H}$ by scaling $r$. So $\Phi(t,\cdot)$ and $\Phi(s,\cdot)$ are at squared $L^2$ distance proportional to $|t-s|^{2H}$, and expanding this square yields $\Gamma^H(s,t)$.
Need: The minimum was an inner product of interval indicators. Those indicators give squared distances proportional to elapsed time, whereas the fractional covariance calls for a different power.
Reader: other candidates assumed notions the reader does not know ("translation and dilation"), and remarks about a constant factor read like a limitation and confused.

### lec-1-7 (Example 1.7, naive white noise)
Punch: Every restriction of $\mathbb 1_{s=t}$ to finitely many times is an identity matrix, so the existence result yields this process; but that result fixes only finite-dimensional laws, nothing about how $\xi_s(\omega)$ depends on $s$.
Need: The examples so far have variance growing in time, as candidates for accumulated noise; the noisy ODE needs the noise itself at each time, and the most direct candidate is a process whose values at different times are independent.
Reader: liked that the punch goes beyond the example by announcing what it does not settle.

### lec-1-8 (Lemma 1.8, naive white noise is not jointly measurable)
Punch: Joint measurability would let Fubini give $\mathbb E[(\int_0^r\xi_s\,ds)^2]=0$, since the covariance is nonzero only on the diagonal of $[0,r]^2$, a null set. So almost every path would vanish a.e., although $\mathbb E|\xi_s|>0$ at every time.
Need: Existence of the Gaussian process gives measurable random variables at fixed times. Interchanging expectation and time integration requires measurability in the sample and time together.

### lec-1-9 (Definition 1.9, white noise)
Punch: Functions that vanish outside disjoint intervals are orthogonal. Their white-noise values are independent by joint Gaussianity and zero covariance. Each value represents the noise accumulated with its own weight.
Need: Pointwise noise cannot be integrated, and the formal computation gives only the covariance its integrals against weights would have; the noisy ODE needs $\int_0^t\xi_s\,ds$ as a genuine random variable, which a process indexed by weights supplies as its value at $\mathbb 1_{[0,t]}$.
Reader: other candidates spoke of "the right variance" without saying what that is, and a weaker notion spelled out with formulas (and $\xi(2f)$) was confusing at this point.

### formal-computation (the notes' formal computation before Definition 1.9)
Punch: Imagine first using a finite grid with independent standard normals. If a cell has width $h$, give its accumulated noise the form $\sqrt h$ times its standard normal. The covariance of weighted sums is then $\sum_j h f(t_j)g(t_j)$ because cross-cell terms vanish. This finite calculation motivates the single integral for sufficiently regular weights.
Need: The non-measurability lemma rules out integrating noise path by path, but the ODE needs only the random variables $\int\xi_tf(t)\,dt$, and a centred Gaussian family is fixed by its covariance; the formal computation supplies the covariance such a family must have.
Reader: what makes this one is "because cross-cell terms vanish": it shows why one single integral carries both functions.

### lec-1-11 (Lemma 1.11, white noise is a linear isometry)
Punch (written by the reader from a candidate that only repeated the proof): (Linearity): By bilinearity of the covariance $\langle f,g\rangle$, $a\xi(f)+b\xi(g)-\xi(af+bg)$ is orthogonal to every noise variable. Being a linear combination of them, it is orthogonal to itself, hence zero in mean square and thus zero almost surely, giving linearity.
Need: The white-noise definition fixes covariances, each $\xi(f)$ a separate random variable; nothing in it says that $\xi(f+g)=\xi(f)+\xi(g)$, so that $\xi(\mathbb 1_{(s,t]})=\xi(\mathbb 1_{[0,t]})-\xi(\mathbb 1_{[0,s]})$, or that nearby functions give nearby random variables. Something we can call an integral of the noise must have both properties.
Reader: the formulas with indicators make the need immediately intuitive.

### lec-1-12 (Lemma 1.12, the Wiener integral)
Punch: Increments of $B$ over disjoint intervals are independent and centred, so all cross terms of $\mathbb E[\xi(f)^2]$ vanish; each diagonal term is $x_k^2$ times the variance of the Brownian increment, which by definition equals the length of its interval, and these sum to $\|f\|_{L^2}^2$.
Need: White noise gives a pre-Brownian motion through its values at indicators, but not conversely: the paths of a given pre-Brownian motion need not be of bounded variation or even measurable, so $\int f\,dB$ has no pathwise meaning from which to recover the white noise.
Reader: likes it when a punch repeats what we already have (here: the variance of an increment is the length of its interval).

### sheet-1-3 (Sheet 1, Exercise 3)
Punch: (c): The covariance compares two increases of $x\mapsto x^{2H}$ over equal lengths, one starting at zero and one shifted by the other increment's length. Convexity makes the shifted increase larger, concavity makes it smaller, and linearity makes them equal.
Need: Disjoint Brownian increments are independent because the minimum covariance stops changing at the earlier time. The fractional covariance has a distance term that still changes.
Reader: a candidate using "sub- and superadditive" was worse (unfamiliar words), and one that packed too much after a comma was hard to hold in the head.

## Further picks (second sample: items the engines had not seen as examples)

### A4 (A4. Lemma: uncorrelated jointly Gaussian families are independent.)
Punch: Take the product of the two families' laws. Under this law the families are independent and jointly Gaussian, with zero covariance across families. If the original joint Gaussian law has those same zero covariances, it agrees with the product law because all means and covariances match.
Need: The finite fact "uncorrelated coordinates of a Gaussian vector are independent" concerns finitely many coordinates. The page will read independence off covariances for infinite families, such as a future increment against the whole past $(B_r)_{r\le s}$, or white-noise values against each other.
Reader: Best need line because it gives reasons; other need lines read pedantic, used unclear phrases ("read off") or did not give the full arc.

### sheet-1-1 (Sheet 1, Exercise 1. Independence of $X+Y$ and $X-Y$ characterises the standard normal law.)
Punch: $X+Y$ and $X-Y$ have covariance $\mathrm{var}(X)-\mathrm{var}(Y)=0$. For the converse, their sum is $2X$, and by symmetry each has characteristic function $\varphi(u)^2$. Independence therefore gives $\varphi(2u)=\varphi(u)^4$. Repeated halving determines $\varphi(u)$ from its expansion $1-u^2/2+o(u^2)$ at zero.
Need: For any i.i.d. pair with equal variances, $X+Y$ and $X-Y$ are uncorrelated, but A4 turns this into independence only for jointly Gaussian variables. The exercise shows how special that step is: among symmetric laws with variance 1, only the normal law makes these two combinations independent.

### lec-1-3 (Example 1.3. Pre-Brownian motion.)
Punch: $s\wedge t$ is the length common to $[0,s]$ and $[0,t]$. It is therefore the inner product of their indicators, so the covariance quadratic form is the squared $L^2$ norm of a weighted sum of indicators.
Need: Proposition 1.2 reduces building a process to choosing a positive semi-definite kernel. Noise accumulated over time should have variance equal to the elapsed time, and for $s<t$ the later value should share with the earlier one exactly the earlier variance, since what is added after $s$ is new; that kernel is $s\wedge t$, and only its positive semi-definiteness remains to be checked.

### lec-1-6 (Example 1.6. Brownian bridge.)
Punch: $\mathrm{cov}(B_s,B_1)=s$, so $sB_1$ is the part of $B_s$ explained linearly by the endpoint. Removing it from both $B_s$ and $B_t$ turns the minimum into $s\wedge t-st$, and the variance $t(1-t)$ vanishes at both ends.
Need: Pre-Brownian and fractional motion run freely, their variance growing with time. A Gaussian process can also carry a constraint, here being back at $0$ at time $1$, and the covariance alone has to express it.
Reader: The need line is the only one giving a real reason why this example is considered here; but where the step is obvious, no need line is needed.

### D1 (D1. Exercise in the notes (p. 14): a function whose integrals vanish is zero almost everywhere.)
Punch: none.
Need: The non-measurability proof below ends with a path whose integrals over every $[0,r]$ vanish and needs that path to be 0 almost everywhere; intervals $[0,r]$ test the path against a family far smaller than the Borel sets, and an integrable function can integrate to zero over many sets without vanishing.
Reader: No punch: in this exercise a punch would give the solution away.

### lec-1-10 (Definition 1.10. Isometry.)
Punch: An isometry preserves the distance between each pair exactly. Here that will mean that changing a weight from $f$ to $g$ produces a root mean square change of exactly $\|f-g\|_2$ in its noise integral.
Need: White noise sends each weight $f$ to a random variable, and its covariance gives $\mathbb E[(\xi(f)-\xi(g))^2]=\|f-g\|^2$ once $\xi$ is linear. To say that nearby weights give nearby noise variables, at exactly the same distance, the page needs a name for maps that keep distances.

### E3 (E3. Exercise in the notes (p. 15): the integrals of white noise form a pre-Brownian motion.)
Punch: $B$ is the restriction of the centred Gaussian process $\xi$ to the indicators of $[0,t]$, hence centred Gaussian, and its covariance $\langle\mathbb 1_{[0,s]},\mathbb 1_{[0,t]}\rangle$ is the length of $[0,s\wedge t]$, namely $s\wedge t$.
Need: White noise gives one random variable $\xi(\mathbb 1_{[0,t]})$ for each $t$, standing for $\int_0^t\xi_s\,ds$. The noisy ODE needs these as a process in $t$, and the exercise identifies that process with the model of accumulated noise we already have.

### F3 (F3. Remark: polarization.)
Punch: Expanding by bilinearity, $[x+y,x+y]-[x-y,x-y]=4[x,y]$, because the squared terms cancel. So a symmetric bilinear form is determined by its values on the diagonal.
Need: The Wiener integral comes with only $\mathbb E[\xi(f)^2]=\|f\|^2$, while white noise demands $\mathbb E[\xi(f)\xi(g)]=\langle f,g\rangle$ for every pair. Once $\xi$ is linear, both sides are symmetric bilinear in $(f,g)$.
Reader: Best need line because it reuses "symmetric bilinear" from the remark itself, so the reader can connect the two.

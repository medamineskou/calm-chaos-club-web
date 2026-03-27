window.POSTS = [
  {
    slug: "likelihood-ols-ridge-from-first-principles",
    title: "Why Gaussian Likelihood Leads to OLS, and Why Ridge Is More Than a Numerical Trick",
    theme: "Actuarial & Statistical Theory",
    tags: ["likelihood", "regression", "ridge", "bayesian", "actuarial"],
    date: "2026-03-27",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
    sourceUrl: "https://en.wikipedia.org/wiki/Ridge_regression",
    excerpt:
      "A clear end-to-end derivation: Gaussian likelihood, MLE, normal equations, profile variance estimate, Ridge as penalized optimization, constrained problem, Bayesian MAP, Tikhonov, and spectral shrinkage.",
    rawHtml: true,
    content: String.raw`
<h2>1) Model, assumptions, and what is actually being optimized</h2>
<p>
Consider the standard linear model:
</p>
<p>
$$
y = X\beta + \varepsilon,\qquad \varepsilon \sim \mathcal N(0,\sigma^2 I_n),
$$
</p>
<p>
with \(y\in\mathbb R^n\), \(X\in\mathbb R^{n\times p}\), and \(\beta\in\mathbb R^p\).
Under this assumption, we have:
\(y\mid X,\beta,\sigma^2 \sim \mathcal N(X\beta,\sigma^2 I_n)\).
</p>
<p>
The key point is conceptual: OLS does not appear because "the loss is linear."
OLS appears because Gaussian noise implies a <em>quadratic</em> negative log-likelihood in the residuals.
</p>

<h2>2) Likelihood and log-likelihood</h2>
<p>
The likelihood is
</p>
<p>
$$
L(\beta,\sigma^2; y,X)
=(2\pi\sigma^2)^{-n/2}
\exp\!\left(-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2\right).
$$
</p>
<p>
Taking logs:
</p>
<p>
$$
\ell(\beta,\sigma^2)
= -\frac n2\log(2\pi)
-\frac n2\log(\sigma^2)
-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2.
$$
</p>
<p>
At fixed \(\sigma^2\), maximizing \(\ell\) over \(\beta\) is equivalent to minimizing
\(\|y-X\beta\|_2^2\), i.e. the residual sum of squares.
</p>
<p>
$$
\arg\max_{\beta}\ell(\beta,\sigma^2)
=
\arg\min_{\beta}\|y-X\beta\|_2^2.
$$
</p>

<h2>3) MLE for \(\beta\): normal equations and geometry</h2>
<p>
Define \(Q(\beta)=\|y-X\beta\|_2^2\). Then
\(\nabla_\beta Q(\beta)=-2X^\top(y-X\beta)\).
Setting the gradient to zero gives:
</p>
<p>$$X^\top X\,\hat\beta = X^\top y.$$</p>
<p>
If \(X^\top X\) is invertible:
</p>
<p>$$\hat\beta_{\text{OLS}}=(X^\top X)^{-1}X^\top y.$$</p>
<p>
Geometrically, \(\hat y=X\hat\beta\) is the orthogonal projection of \(y\) onto the column space of \(X\),
and residuals satisfy \(X^\top(y-\hat y)=0\).
</p>

<h2>4) MLE for \(\sigma^2\): profile likelihood</h2>
<p>
Plugging \(\hat\beta\) into \(\ell\):
</p>
<p>
$$
\ell(\hat\beta,\sigma^2)
= -\frac n2\log(2\pi)
-\frac n2\log(\sigma^2)
-\frac{1}{2\sigma^2}\operatorname{RSS}(\hat\beta).
$$
</p>
<p>
Differentiating in \(\sigma^2\) and setting to zero yields
\(\hat\sigma^2_{\text{MLE}}=\operatorname{RSS}(\hat\beta)/n\).
</p>

<h2>5) Ridge: penalized formulation</h2>
<p>
Ridge solves
</p>
<p>
$$
\hat\beta_\lambda
=\arg\min_\beta\left\{
\|y-X\beta\|_2^2 + \lambda\|\beta\|_2^2
\right\},\qquad \lambda\ge 0.
$$
</p>
<p>
First-order condition:
</p>
<p>$$\left(X^\top X+\lambda I\right)\hat\beta_\lambda=X^\top y,$$</p>
<p>
thus
</p>
<p>$$\hat\beta_\lambda=(X^\top X+\lambda I)^{-1}X^\top y.$$</p>
<p>
For \(\lambda>0\), invertibility is guaranteed even if \(X^\top X\) is singular.
This is one reason Ridge is central in high-dimensional or collinear settings.
</p>

<h2>6) Ridge equivalences you should remember</h2>
<p><strong>(a) Constrained optimization view</strong></p>
<p>
$$
\min_\beta \|y-X\beta\|_2^2
\quad\text{s.t.}\quad
\|\beta\|_2^2\le t.
$$
</p>
<p>
There is a one-to-one correspondence between \(t\) and \(\lambda\) (KKT theory).
</p>

<p><strong>(b) Bayesian MAP view</strong></p>
<p>
Assume a Gaussian prior on coefficients:
\(\beta\sim\mathcal N(0,\tau^2 I)\).
This means, before seeing data, we believe coefficients are centered around zero,
with uncertainty controlled by \(\tau^2\).
</p>
<p>
Combining Gaussian likelihood and Gaussian prior, maximizing the posterior is equivalent to minimizing:
</p>
<p>
$$
\|y-X\beta\|_2^2 + \frac{\sigma^2}{\tau^2}\|\beta\|_2^2.
$$
</p>
<p>
So Ridge is exactly a MAP estimator, with \(\lambda=\sigma^2/\tau^2\).
Interpretation: stronger prior concentration around zero implies stronger shrinkage.
</p>

<p><strong>(c) Tikhonov regularization</strong></p>
<p>
Ridge is the special case \(L=I\) of:
\(\min_\beta \|y-X\beta\|_2^2+\lambda\|L\beta\|_2^2\).
</p>

<p><strong>(d) Augmented-data OLS view</strong></p>
<p>
$$
\tilde X=
\begin{bmatrix}
X\\
\sqrt{\lambda}I_p
\end{bmatrix},
\qquad
\tilde y=
\begin{bmatrix}
y\\
0
\end{bmatrix}.
$$
</p>
<p>
Then
\(\|\tilde y-\tilde X\beta\|_2^2=\|y-X\beta\|_2^2+\lambda\|\beta\|_2^2\),
so Ridge is just OLS on an augmented system.
</p>

<h2>7) Spectral view: why Ridge stabilizes unstable directions</h2>
<p>
Let \(X=U\Sigma V^\top\). Then:
</p>
<p>
$$
\hat\beta_\lambda
=V\,\operatorname{diag}\!\left(\frac{\sigma_j}{\sigma_j^2+\lambda}\right)U^\top y.
$$
</p>
<p>
Each principal direction is shrunk by
\(\kappa_j(\lambda)=\frac{\sigma_j^2}{\sigma_j^2+\lambda}\in(0,1)\).
Small \(\sigma_j\) (noisy/weakly identified directions) get stronger attenuation.
</p>

<h2>8) Practical takeaway</h2>
<p>
Ridge is not merely "add lambda and hope." It is a mathematically coherent object:
optimization regularizer, constrained estimator, Bayesian MAP estimator, and spectral filter at once.
</p>
<p>
In actuarial and risk modeling workflows, this matters because we care about stable estimates,
out-of-sample behavior, and explainable parameter shrinkage under collinearity.
</p>
`
  },
  {
    slug: "ml-data-playbook-for-real-projects",
    title: "A Practical ML & Data Playbook for Real Business Projects",
    theme: "ML & Data",
    tags: ["ml", "data", "feature-engineering", "validation", "production"],
    date: "2026-03-26",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    sourceUrl: "",
    excerpt:
      "A compact framework for moving from notebook experiments to production-grade ML systems with clear assumptions and measurable impact.",
    content: `
## The core rule
If it cannot be validated, monitored, and explained, it is not production ML.

## Execution framework
1. Define one business target and one measurable metric.
2. Build a strong baseline first.
3. Stress-test leakage and time-split robustness.
4. Only then invest in complex models.

## Typical failure points
- Data drift ignored
- Target leakage hidden in features
- Optimizing AUC while business needs calibration

## Better default
Start simple, measure aggressively, deploy safely, iterate fast.
`
  },
  {
    slug: "philosophy-of-clear-thinking",
    title: "Clarity Before Brilliance: Notes on Thinking, Culture, and Writing",
    theme: "Philosophy, Culture & Literature",
    tags: ["philosophy", "culture", "literature", "thinking"],
    date: "2026-03-25",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    sourceUrl: "",
    excerpt:
      "A reflection on why clear language is intellectual honesty, and why writing is one of the best tools for building precise thought.",
    content: `
Great ideas are often lost in vague language.

For me, writing is not just communication. It is a diagnostic tool.
If I cannot explain an idea in plain words, I usually do not understand it well enough yet.

Culture and literature matter here: they train nuance, rhythm, and precision.
Technical work needs that same discipline.

A practical habit:
- Write one paragraph per day on one difficult idea.
- Remove one unnecessary sentence from it.
- Keep only what is true, precise, and useful.
`
  }
];

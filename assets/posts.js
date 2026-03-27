window.POSTS = [
  {
    slug: "mle-reg-lineaire-rss-ridge",
    title: "Pourquoi le MLE en regression lineaire revient a minimiser la somme des residus au carre",
    type: "Math",
    tags: ["math", "stats", "machine-learning", "ridge"],
    date: "2026-03-27",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    sourceUrl: "https://en.wikipedia.org/wiki/Ridge_regression",
    excerpt:
      "Sous bruit gaussien, maximiser la log-vraisemblance revient a minimiser RSS. Et Ridge est equivalent a MAP gaussien, Tikhonov et une contrainte L2.",
    content: String.raw`
> Point important: ce n'est pas parce que la loss est lineaire. C'est parce que le bruit est **gaussien**, ce qui donne une penalite **quadratique**.

On part du modele:

$$
y = X\beta + \varepsilon,\quad \varepsilon \sim \mathcal N(0,\sigma^2 I).
$$

La log-vraisemblance (a constante pres) est:

$$
\ell(\beta,\sigma^2) = -\frac{n}{2}\log(\sigma^2) - \frac{1}{2\sigma^2}\|y-X\beta\|_2^2.
$$

Si \(\sigma^2\) est fixe, maximiser \(\ell\) en \(\beta\) est exactement equivalent a:

$$
\min_\beta \|y - X\beta\|_2^2
$$

donc a minimiser \(\sum_i (y_i-\hat y_i)^2\), la RSS.

## Ridge: equivalent a quoi ?

Ridge:

$$
\min_\beta \|y-X\beta\|_2^2 + \lambda\|\beta\|_2^2
$$

est equivalent a:

1. **Contrainte L2**: \(\min \|y-X\beta\|_2^2\) s.c. \(\|\beta\|_2^2 \le t\)
2. **MAP bayesien** avec prior gaussien \(\beta\sim\mathcal N(0,\tau^2I)\), avec \(\lambda=\sigma^2/\tau^2\)
3. **Regularisation de Tikhonov**
4. **OLS sur donnees augmentees**:

$$
\tilde X=
\begin{bmatrix}
X\\
\sqrt{\lambda}I
\end{bmatrix},
\quad
\tilde y=
\begin{bmatrix}
y\\
0
\end{bmatrix}
$$

et on fait simplement OLS sur \((\tilde X,\tilde y)\).

Ce sont les memes solutions, juste des interpretations differentes.
`
  }
];

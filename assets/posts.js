window.POSTS = [
  {
    slug: "mle-reg-lineaire-rss-ridge",
    title: "Vraisemblance gaussienne, MLE en regression lineaire et anatomie mathematique de Ridge",
    type: "Math",
    tags: ["math", "stats", "econometrie", "machine-learning", "ridge"],
    date: "2026-03-27",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
    sourceUrl: "https://en.wikipedia.org/wiki/Ridge_regression",
    excerpt:
      "Une derivation complete, rigoureuse et elegante: de la log-vraisemblance gaussienne a OLS, puis de Ridge comme regularisation, probleme contraint, estimateur MAP et operateur de shrinkage spectral.",
    content: String.raw`
## 1) Cadre probabiliste et notation

Considérons le modèle linéaire gaussien standard:

$$
y = X\beta + \varepsilon,\qquad \varepsilon \sim \mathcal N(0,\sigma^2 I_n),
$$

où $y\in\mathbb R^n$, $X\in\mathbb R^{n\times p}$, $\beta\in\mathbb R^p$ et $\sigma^2>0$.

Hypothèse clé: conditionnellement à $(X,\beta,\sigma^2)$, les observations sont gaussiennes indépendantes.
Cela implique:

$$
y\mid X,\beta,\sigma^2 \sim \mathcal N(X\beta,\sigma^2 I_n).
$$

Cette formulation est la source exacte du lien entre MLE et minimisation de la somme des carrés des résidus.
Ce n'est **pas** la linéarité de la loss qui crée ce résultat, mais la structure gaussienne de la vraisemblance.

---

## 2) Vraisemblance et log-vraisemblance

La densité jointe vaut:

$$
L(\beta,\sigma^2; y, X)
= (2\pi\sigma^2)^{-n/2}
\exp\!\left(
-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2
\right).
$$

En prenant le logarithme:

$$
\ell(\beta,\sigma^2)
= -\frac n2\log(2\pi)
-\frac n2\log(\sigma^2)
-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2.
$$

La constante $-\frac n2\log(2\pi)$ est inoffensive pour l'optimisation.
Le terme d'ajustement dépendant de $\beta$ est uniquement
$-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2$.

Donc, à $\sigma^2$ fixé:

$$
\arg\max_\beta \ell(\beta,\sigma^2)
=
\arg\min_\beta \|y-X\beta\|_2^2.
$$

On retrouve exactement le critère OLS:

$$
\mathrm{RSS}(\beta)=\sum_{i=1}^n (y_i-\hat y_i)^2
=\|y-X\beta\|_2^2.
$$

---

## 3) Estimation de $\beta$ par MLE/OLS

La fonction objectif est:

$$
Q(\beta)=\|y-X\beta\|_2^2
=(y-X\beta)^\top(y-X\beta).
$$

Son gradient:

$$
\nabla_\beta Q(\beta)=-2X^\top(y-X\beta).
$$

Condition du premier ordre:

$$
X^\top X\,\hat\beta = X^\top y.
$$

Si $X^\top X$ est inversible:

$$
\hat\beta_{\mathrm{OLS}}
=(X^\top X)^{-1}X^\top y.
$$

Si $X^\top X$ est singulière (colinéarité, $p\gg n$), la solution n'est pas unique sans régularisation.
C'est précisément la zone où Ridge devient structurellement utile.

---

## 4) MLE de $\sigma^2$ (profil de vraisemblance)

En remplaçant $\beta$ par $\hat\beta$, on obtient:

$$
\ell(\hat\beta,\sigma^2)
= -\frac n2\log(2\pi)
-\frac n2\log(\sigma^2)
-\frac{1}{2\sigma^2}\mathrm{RSS}(\hat\beta).
$$

Dérivée par rapport à $\sigma^2$:

$$
\frac{\partial \ell}{\partial \sigma^2}
=-\frac{n}{2\sigma^2}
+\frac{\mathrm{RSS}(\hat\beta)}{2\sigma^4}.
$$

En annulant:

$$
\hat\sigma^2_{\mathrm{MLE}}
=\frac{\mathrm{RSS}(\hat\beta)}{n}.
$$

Remarque: la version non biaisée classique utilise $\frac{1}{n-p}$, mais ce n'est plus le MLE pur.

---

## 5) Lecture géométrique (projection orthogonale)

Le vecteur ajusté $\hat y=X\hat\beta$ est la projection orthogonale de $y$ sur l'espace colonne $\mathcal C(X)$.
Le résidu $r=y-\hat y$ est orthogonal à $\mathcal C(X)$:

$$
X^\top r=0.
$$

Cette orthogonalité est exactement l'équation normale.
Le MLE gaussien se lit donc comme une projection euclidienne avec métrique isotrope.

---

## 6) Ridge: formulation pénalisée

Ridge résout:

$$
\hat\beta_{\lambda}
=\arg\min_\beta
\left\{
\|y-X\beta\|_2^2 + \lambda\|\beta\|_2^2
\right\},
\qquad \lambda\ge 0.
$$

FOC:

$$
(X^\top X+\lambda I)\hat\beta_\lambda = X^\top y.
$$

D'où la forme fermée:

$$
\hat\beta_\lambda=(X^\top X+\lambda I)^{-1}X^\top y.
$$

Même si $X^\top X$ est singulière, $X^\top X+\lambda I$ est inversible pour $\lambda>0$.
La régularisation stabilise donc l'algorithme et le problème statistique.

---

## 7) Équivalences fondamentales de Ridge

### (a) Problème contraint

Ridge est équivalent à:

$$
\min_\beta \|y-X\beta\|_2^2
\quad\text{sous la contrainte}\quad
\|\beta\|_2^2 \le t,
$$

pour un $t$ correspondant biunivoquement à $\lambda$ via les conditions KKT.

### (b) Interprétation bayésienne MAP

Supposons:

$$
\beta \sim \mathcal N(0,\tau^2 I),\qquad
\varepsilon\sim\mathcal N(0,\sigma^2 I).
$$

Le log-posterior (à constante près) vaut:

$$
-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2
-\frac{1}{2\tau^2}\|\beta\|_2^2.
$$

Maximiser le posterior revient à minimiser:

$$
\|y-X\beta\|_2^2 + \frac{\sigma^2}{\tau^2}\|\beta\|_2^2.
$$

Donc $\lambda=\sigma^2/\tau^2$ et Ridge est exactement un estimateur MAP gaussien isotrope.

### (c) Tikhonov

Ridge est un cas particulier de Tikhonov:

$$
\min_\beta \|y-X\beta\|_2^2 + \lambda\|L\beta\|_2^2
$$

avec $L=I$.

### (d) Données augmentées

Définissons:

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

Alors:

$$
\|\tilde y-\tilde X\beta\|_2^2
=\|y-X\beta\|_2^2+\lambda\|\beta\|_2^2,
$$

et Ridge devient un OLS standard sur le système augmenté.

---

## 8) Lecture spectrale (SVD) et shrinkage

Soit la SVD $X=U\Sigma V^\top$, avec valeurs singulières $\sigma_j$.
Alors:

$$
\hat\beta_\lambda
=V\,\mathrm{diag}\!\left(\frac{\sigma_j}{\sigma_j^2+\lambda}\right)U^\top y.
$$

Chaque direction principale est contractée par un facteur:

$$
\kappa_j(\lambda)=\frac{\sigma_j^2}{\sigma_j^2+\lambda}\in(0,1).
$$

Les petites valeurs singulières (directions instables) sont fortement amorties.
Ridge est donc un opérateur de filtrage spectral continu.

---

## 9) Biais-variance et degrés de liberté effectifs

Ridge introduit un biais, mais réduit souvent fortement la variance.
Le risque quadratique peut diminuer en présence de colinéarité ou faible signal/bruit.

La matrice de lissage est:

$$
S_\lambda = X(X^\top X+\lambda I)^{-1}X^\top.
$$

Les degrés de liberté effectifs:

$$
\mathrm{df}(\lambda)=\mathrm{tr}(S_\lambda)
=\sum_{j=1}^{r}\frac{\sigma_j^2}{\sigma_j^2+\lambda},
$$

décroissent avec $\lambda$, ce qui quantifie la complexité réellement utilisée.

---

## 10) Choix de $\lambda$ en pratique

Méthodes robustes:

1. Validation croisée ($K$-fold CV)
2. LOOCV / GCV
3. Critères informationnels adaptés au lissage

En pratique empirique: standardiser les covariables avant Ridge est souvent indispensable
pour que la pénalisation soit équitable entre dimensions.

---

## 11) Synthèse concise

- Sous bruit gaussien isotrope, MLE en $\beta$ est OLS, donc minimisation de RSS.
- Ridge ajoute une courbure $\lambda\|\beta\|_2^2$ qui régularise et stabilise.
- Cette même solution possède des lectures équivalentes: contrainte, MAP, Tikhonov, données augmentées.
- Spectralement, Ridge agit comme un shrinkage sélectif des directions fragiles.

En ce sens, Ridge n'est pas seulement une "astuce numérique":
c'est une structure statistique complète, cohérente à la fois en optimisation, en géométrie et en inférence.
`
  }
];

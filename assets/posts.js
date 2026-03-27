window.POSTS = [
  {
    slug: "mle-reg-lineaire-rss-ridge",
    title: "Vraisemblance gaussienne, MLE lineaire et theorie complete de Ridge",
    type: "Math",
    tags: ["math", "stats", "econometrie", "machine-learning", "ridge"],
    date: "2026-03-27",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
    sourceUrl: "https://en.wikipedia.org/wiki/Ridge_regression",
    excerpt:
      "Derivation rigoureuse de la log-vraisemblance, equivalence MLE-OLS, puis anatomie mathematique de Ridge (penalise, contraint, MAP, Tikhonov, SVD).",
    rawHtml: true,
    content: String.raw`
<h2>1) Cadre probabiliste</h2>
<p>
On part du modele lineaire gaussien:
</p>
<p>$$y = X\beta + \varepsilon,\qquad \varepsilon \sim \mathcal N(0,\sigma^2 I_n).$$</p>
<p>
Ainsi, conditionnellement a \(X,\beta,\sigma^2\), on a
\(y\mid X,\beta,\sigma^2 \sim \mathcal N(X\beta,\sigma^2 I_n)\).
Le point central est le suivant: l'equivalence entre MLE et minimisation de la somme des carres des residus
provient de l'hypothese gaussienne, pas d'une supposée "loss lineaire".
</p>

<h2>2) Vraisemblance et log-vraisemblance</h2>
<p>La densite jointe s'ecrit:</p>
<p>
$$
L(\beta,\sigma^2)
=(2\pi\sigma^2)^{-n/2}
\exp\!\left(-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2\right).
$$
</p>
<p>Donc la log-vraisemblance:</p>
<p>
$$
\ell(\beta,\sigma^2)
= -\frac n2\log(2\pi) - \frac n2\log(\sigma^2)
-\frac{1}{2\sigma^2}\|y-X\beta\|_2^2.
$$
</p>
<p>
A \(\sigma^2\) fixe:
</p>
<p>
$$
\arg\max_{\beta}\,\ell(\beta,\sigma^2)
=
\arg\min_{\beta}\,\|y-X\beta\|_2^2.
$$
</p>
<p>
On retrouve donc exactement le critere OLS:
</p>
<p>$$\mathrm{RSS}(\beta)=\sum_{i=1}^n (y_i-\hat y_i)^2=\|y-X\beta\|_2^2.$$</p>

<h2>3) Estimateur MLE de \(\beta\)</h2>
<p>
On minimise \(Q(\beta)=\|y-X\beta\|_2^2\). Son gradient vaut
\(\nabla_\beta Q(\beta)=-2X^\top(y-X\beta)\).
La condition du premier ordre donne les equations normales:
</p>
<p>$$X^\top X\,\hat\beta = X^\top y.$$</p>
<p>
Si \(X^\top X\) est inversible:
</p>
<p>$$\hat\beta_{\mathrm{OLS}}=(X^\top X)^{-1}X^\top y.$$</p>
<p>
Le MLE de \(\sigma^2\) (profil de vraisemblance) est:
</p>
<p>$$\hat\sigma^2_{\mathrm{MLE}}=\frac{\mathrm{RSS}(\hat\beta)}{n}.$$</p>

<h2>4) Interpretation geometrique</h2>
<p>
Le vecteur ajuste \(\hat y = X\hat\beta\) est la projection orthogonale de \(y\) sur l'espace colonne de \(X\).
Le residu \(r=y-\hat y\) verifie:
</p>
<p>$$X^\top r=0.$$</p>
<p>
Cette orthogonalite est une lecture geometrique directe des equations normales.
</p>

<h2>5) Ridge: formulation penalisee</h2>
<p>
Ridge definit:
</p>
<p>
$$
\hat\beta_{\lambda}
=\arg\min_{\beta}\left\{
\|y-X\beta\|_2^2+\lambda\|\beta\|_2^2
\right\},\qquad \lambda\ge 0.
$$
</p>
<p>
Condition du premier ordre:
</p>
<p>$$\left(X^\top X+\lambda I\right)\hat\beta_\lambda=X^\top y,$$</p>
<p>
d'ou
</p>
<p>$$\hat\beta_\lambda=(X^\top X+\lambda I)^{-1}X^\top y.$$</p>
<p>
Pour \(\lambda>0\), la matrice \(X^\top X+\lambda I\) est inversible meme si \(X^\top X\) est singuliere:
Ridge regularise simultanement l'optimisation et la variance statistique.
</p>

<h2>6) Equivalences mathematiques de Ridge</h2>
<p><strong>(a) Probleme contraint</strong></p>
<p>
$$
\min_\beta \|y-X\beta\|_2^2
\quad\text{s.c.}\quad
\|\beta\|_2^2\le t.
$$
</p>
<p>
Pour un \(t\) approprie, cette formulation est equivalente a la forme penalisee.
</p>

<p><strong>(b) Estimateur MAP bayesien</strong></p>
<p>
Sous prior gaussien isotrope
\(\beta\sim\mathcal N(0,\tau^2 I)\),
la maximisation du posterior equivaut a minimiser:
</p>
<p>$$\|y-X\beta\|_2^2+\frac{\sigma^2}{\tau^2}\|\beta\|_2^2,$$</p>
<p>
donc \(\lambda=\sigma^2/\tau^2\).
</p>

<p><strong>(c) Tikhonov</strong></p>
<p>
Ridge est le cas \(L=I\) de
\(\min_\beta \|y-X\beta\|_2^2+\lambda\|L\beta\|_2^2\).
</p>

<p><strong>(d) Donnees augmentees</strong></p>
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
Alors
\(\|\tilde y-\tilde X\beta\|_2^2=\|y-X\beta\|_2^2+\lambda\|\beta\|_2^2\):
Ridge devient un OLS standard sur \((\tilde X,\tilde y)\).
</p>

<h2>7) Vue spectrale (SVD) et shrinkage</h2>
<p>
Si \(X=U\Sigma V^\top\), alors
</p>
<p>
$$
\hat\beta_\lambda
=V\,\mathrm{diag}\!\left(\frac{\sigma_j}{\sigma_j^2+\lambda}\right)U^\top y.
$$
</p>
<p>
Chaque direction principale est contractee par
\(\kappa_j(\lambda)=\frac{\sigma_j^2}{\sigma_j^2+\lambda}\in(0,1)\).
Les petites valeurs singulieres (directions instables) sont amorties davantage.
</p>

<h2>8) Biais-variance et degres de liberte effectifs</h2>
<p>
Ridge introduit un biais, mais reduit souvent fortement la variance.
Le compromis peut ameliorer le risque quadratique hors echantillon.
</p>
<p>
Matrice de lissage:
</p>
<p>$$S_\lambda=X(X^\top X+\lambda I)^{-1}X^\top.$$</p>
<p>
Degres de liberte effectifs:
</p>
<p>
$$
\mathrm{df}(\lambda)=\mathrm{tr}(S_\lambda)
=\sum_{j=1}^r\frac{\sigma_j^2}{\sigma_j^2+\lambda}.
$$
</p>

<h2>9) Synthese</h2>
<p>
1) Sous bruit gaussien isotrope, MLE en \(\beta\) coincide avec OLS.<br/>
2) Ridge ajoute une penalisation quadratique qui stabilise la solution.<br/>
3) La meme solution admet des lectures equivalentes: optimisation contrainte, MAP gaussien, Tikhonov, donnees augmentees et shrinkage spectral.<br/>
4) Statistiquement, Ridge organise explicitement le compromis biais-variance.
</p>
`
  }
];

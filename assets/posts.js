window.POSTS = [
  {
    slug: "vision-2026",
    title: "Vision 2026: ce que je veux construire",
    type: "Idee",
    tags: ["strategie", "carriere", "journal"],
    date: "2026-03-27",
    excerpt:
      "Ma direction perso sur 12 mois: expertise technique, impact business et discipline creative.",
    sourceUrl: "",
    content: `
## Pourquoi ce journal
Je veux un espace personnel pour documenter mes idees et les transformer en execution.

## Cap principal
- Approfondir la data science appliquee a l'assurance.
- Publier des notes utiles, pas juste des pensees.
- Construire des produits qui ont une vraie utilite.

> Regle perso: "Une idee par semaine doit devenir un livrable partageable."
`
  },
  {
    slug: "note-math-var",
    title: "Note mathematique: VaR simplifiee",
    type: "Math",
    tags: ["math", "risk", "finance"],
    date: "2026-03-26",
    excerpt:
      "Petit rappel sur la Value-at-Risk avec une hypothese gaussienne.",
    sourceUrl: "",
    content: `
Pour un portefeuille de rendement \(R\\sim\\mathcal{N}(\\mu,\\sigma^2)\), une approximation de la VaR au niveau \\(\\alpha\\) est:

$$
\\mathrm{VaR}_{\\alpha} = -\\left(\\mu + \\sigma\\Phi^{-1}(1-\\alpha)\\right).
$$

Avec \\(\\alpha=95\\%\\), \\(\\Phi^{-1}(0.05)\\approx -1.645\\).
`
  },
  {
    slug: "lecture-climat",
    title: "Lecture utile: climat et sinistres",
    type: "Lien",
    tags: ["climat", "lecture", "assurance"],
    date: "2026-03-25",
    excerpt:
      "Un papier interessant sur la modelisation des sinistres lies aux evenements meteo.",
    sourceUrl:
      "https://www.cambridge.org/core/journals/annals-of-actuarial-science",
    content: `
J'ai compile ici mes lectures de reference.

- Angle 1: modelisation statistique des evenements extremes.
- Angle 2: impact business sur la tarification.
- Angle 3: robustesse et communication du modele.
`
  }
];

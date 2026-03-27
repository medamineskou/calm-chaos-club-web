# Calm Chaos Club (GitHub Pages)

Site statique (gratuit sur GitHub Pages) en style feed social.

## Ajouter un post

1. Ouvre `assets/posts.js`.
2. Duplique un objet dans `window.POSTS`.
3. Champs utiles:
   - `slug`, `title`, `type`, `tags`, `date`, `excerpt`
   - `image` (affiche image a gauche dans le feed)
   - `content` (Markdown + formules KaTeX)
   - `sourceUrl` (optionnel)
   - `lang` et `dir` pour arabe (ex: `lang: "ar"`, `dir: "rtl"`)

## Formules

- Inline: `\\(a^2+b^2=c^2\\)`
- Bloc:
  `$$
  E[X]=\\int x f(x) dx
  $$`

## Theme

- Clair par defaut
- Toggle `Mode nuit` en haut a droite
- Preference sauvegardee localement

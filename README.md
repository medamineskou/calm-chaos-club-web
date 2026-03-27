# Calm Chaos Club (GitHub Pages)

Site statique (gratuit sur GitHub Pages) en style feed social.

## Pour poster ;) :
1. Ouvrir `assets/posts.js`.
2. Dupliquer un objet dans `window.POSTS`.
3. Champs utiles:
   - `slug`, `title`, `type`, `tags`, `date`, `excerpt`
   - `image` (affiche image a gauche dans le feed)
   - `content` (Markdown + formules KaTeX)
   - `sourceUrl` (optionnel)
   - `lang` et `dir` pour arabe (ex: `lang: "ar"`, `dir: "rtl"`)

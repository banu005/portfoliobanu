# Portfolio — Banumathey BALENDRAN

Portfolio personnel de **Banumathey BALENDRAN**, développeuse Full Stack.
Site vitrine statique présentant son parcours, ses projets et ses compétences,
dans une esthétique pixel-art / rétro.

## Aperçu

- Thème sombre par défaut, thème clair disponible (choix mémorisé)
- Entièrement responsive (mobile, tablette, desktop)
- Modales de détail pour chaque projet, accessibles au clavier
- Formulaire de contact fonctionnel (Web3Forms)

## Stack technique

- **HTML5 / CSS3 / JavaScript** (vanilla, sans build ni framework)
- **Web3Forms** pour l'envoi du formulaire de contact
- **Font Awesome** et **Devicon** pour les icônes
- **Google Fonts** : Inter, Space Grotesk, JetBrains Mono
- Images optimisées en **WebP** avec `loading="lazy"`

## Structure

```
.
├── index.html          # Page unique (sections : accueil, à propos, projets, compétences, contact)
├── style.css           # Styles (variables CSS, thèmes dark/light, responsive)
├── script.js           # Interactions (modales, thème, menu mobile, formulaire, scroll-spy)
├── favicon.svg         # Favicon
├── Images/             # Captures des projets (.webp) + logos de certifications
└── Documents/          # CV et certifications (PDF)
```

## Accessibilité

- Lien d'évitement (« Aller au contenu principal »)
- Attributs ARIA (navigation, modales, barre de progression)
- Piège de focus dans les modales, fermeture via `Échap`
- Respect de `prefers-reduced-motion` et `prefers-color-scheme`

## Déploiement

Le site est publié via **GitHub Pages** :
<https://banu005.github.io/portfoliobanu/>

## Contact

- Email : banumathey5@gmail.com
- GitHub : [@banu005](https://github.com/banu005)
- LinkedIn : [banumathey-balendran](https://www.linkedin.com/in/banumathey-balendran)

---

Site conçu et réalisé par Banumathey BALENDRAN.

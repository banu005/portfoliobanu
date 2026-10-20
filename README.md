# Portfolio — Banumathey BALENDRAN

Portfolio personnel de **Banumathey BALENDRAN**, développeuse Full Stack.
Site vitrine statique présentant son parcours, ses projets et ses compétences,
dans une esthétique pixel-art / rétro.

## Aperçu

- Thème clair ou sombre selon les préférences du système, choix mémorisé après un clic
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
├── index.html                    # Page principale
├── mentions-legales.html         # Mentions légales (LCEN)
├── politique-confidentialite.html # Confidentialité et cookies (RGPD)
├── style.css                     # Styles (variables CSS, thèmes dark/light, responsive)
├── script.js                     # Interactions (modales, thème, menu mobile, formulaire, scroll-spy)
├── sitemap.xml                   # Plan du site pour les moteurs de recherche
├── favicon.svg                   # Favicon
├── Images/                       # Captures des projets (.webp) + logos de certifications
└── Documents/                    # CV et certifications (PDF)
```

## Accessibilité

- Lien d'évitement (« Aller au contenu principal »)
- Attributs ARIA (navigation, modales, barre de progression)
- Piège de focus dans les modales, fermeture via `Échap`
- Contrastes de texte vérifiés, focus visible renforcé
- Libellés de formulaire explicites et icônes décoratives masquées aux lecteurs d'écran
- Respect de `prefers-reduced-motion` et `prefers-color-scheme`

## Conformité

- Mentions légales et politique de confidentialité présentes et liées en pied de page.
- Aucun cookie de mesure d'audience, de publicité ou de réseau social.
- Formulaire traité par Web3Forms puis Gmail, conservation des messages : 12 mois maximum.
- L'adresse postale et le téléphone ne sont pas publiés : ils doivent être communiqués à
  l'hébergeur (GitHub) conformément à la LCEN.
- Avant mise en ligne : restreindre la clé Web3Forms au domaine du site depuis son tableau de bord.

## Sécurité

- En-tête `Content-Security-Policy` restrictif sur les trois pages.
- Intégrité SRI sur les feuilles de style Font Awesome et Devicon.
- Aucun secret n'est stocké dans le dépôt ; la clé Web3Forms est publique par conception.
- Restreindre la clé Web3Forms au domaine du site depuis son tableau de bord.

## Déploiement

Le site est publié via **GitHub Pages** :
<https://banu005.github.io/portfoliobanu/>

## Contact

- Email : banumathey5@gmail.com
- GitHub : [@banu005](https://github.com/banu005)
- LinkedIn : [banumathey-balendran](https://www.linkedin.com/in/banumathey-balendran)

---

Site conçu et réalisé par Banumathey BALENDRAN.

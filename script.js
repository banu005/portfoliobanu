// Portfolio Banumathey BALENDRAN — script.js
// Ce fichier gère toutes les interactions de la page : la barre de
// progression de lecture, le formulaire de contact, le thème clair/sombre,
// le menu mobile, le lien actif du menu (scroll-spy) et les fenêtres de
// détail des projets (modales).


// 1. BARRE DE PROGRESSION DE LECTURE
// La petite barre en haut de la page se remplit au fur et à mesure
// qu'on descend dans la page.
let scrollTicking = false; // évite de recalculer 100 fois par seconde
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        // requestAnimationFrame = "fais ça juste avant le prochain affichage"
        // (plus fluide et économe qu'un calcul à chaque micro-déplacement).
        requestAnimationFrame(() => {
            const fill = document.getElementById('progressFill');
            if (!fill) return;
            // Pourcentage de la page déjà parcouru.
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            fill.style.width = Math.min(pct, 100) + '%'; // largeur de la barre
            fill.parentElement.setAttribute('aria-valuenow', Math.round(Math.min(pct, 100)));
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});


// 2. FORMULAIRE DE CONTACT
// Envoie le message via le service externe Web3Forms, puis affiche un
// retour visuel sur le bouton (envoi, succès ou erreur).
async function handleFormSubmit(e) {
    e.preventDefault(); // empêche le rechargement de page par défaut du formulaire
    const form = e.target;
    const btn = form.querySelector('.form-submit');
    // Texte d'origine du bouton, pour le remettre à la fin.
    const defaultBtn = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';

    // Validation : on contrôle chaque champ obligatoire et le format de l'email.
    const statusEl = form.querySelector('#formStatus');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const requiredFields = ['#contact-prenom', '#contact-nom', '#contact-email', '#contact-message'];
    let firstInvalid = null;

    requiredFields.forEach(sel => {
        const field = form.querySelector(sel);
        if (!field) return;
        const value = field.value.trim();
        // Un champ est invalide s'il est vide, ou si c'est l'email mal formé.
        let invalid = value === '';
        if (sel === '#contact-email' && value !== '') {
            invalid = !emailRegex.test(value);
        }
        field.classList.toggle('is-invalid', invalid);
        if (invalid) {
            field.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = field; // on retiendra le 1er pour le focus
        } else {
            field.removeAttribute('aria-invalid');
        }
    });

    if (firstInvalid) {
        // Au moins un champ invalide : on affiche le message et on focus le premier.
        if (statusEl) statusEl.textContent = 'Merci de remplir correctement les champs en rouge.';
        firstInvalid.focus();
        return;
    }
    if (statusEl) statusEl.textContent = '';

    // Récupération des champs (désormais validés).
    const email = form.querySelector('#contact-email').value.trim();
    const prenom = form.querySelector('#contact-prenom')?.value.trim() || '';
    const nom = form.querySelector('#contact-nom')?.value.trim() || '';
    const sujet = form.querySelector('#contact-sujet')?.value.trim() || 'Contact depuis le portfolio';

    // FormData = objet qui contient tous les champs du formulaire.
    // On ajoute / remplace quelques valeurs attendues par Web3Forms.
    const formData = new FormData(form);
    formData.set('name', `${prenom} ${nom}`.trim() || 'Visiteur');
    formData.set('subject', sujet);
    formData.set('replyto', email);

    // On désactive le bouton et on affiche "Envoi en cours...".
    btn.disabled = true;
    btn.innerHTML = '<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.style.background = '';

    try {
        // Envoi réel vers l'API Web3Forms.
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const data = await res.json(); // réponse de l'API

        if (data.success) {
            // Succès : bouton vert + on vide le formulaire.
            btn.innerHTML = '<span>Message envoyé !</span> <i class="fas fa-check"></i>';
            btn.style.background = '#28C840';
            form.reset();
        } else {
            // L'API a répondu mais a refusé : on déclenche le "catch".
            throw new Error(data.message || 'Échec de l\'envoi');
        }
    } catch (err) {
        // Erreur (réseau ou refus) : bouton rouge.
        btn.innerHTML = '<span>Erreur, réessayez</span> <i class="fas fa-exclamation-triangle"></i>';
        btn.style.background = '#FF5F57';
        console.error('Web3Forms:', err);
    } finally {
        // Dans tous les cas, après 4 secondes on remet le bouton à l'état normal.
        setTimeout(() => {
            btn.innerHTML = defaultBtn;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    }
}


// 3. MODE CLAIR / SOMBRE (THÈME)
// Le thème se choisit en changeant l'attribut data-theme sur <html>.
// Le choix est mémorisé dans le navigateur (localStorage).
// Tous les boutons qui servent à basculer le thème.
const themeButtons = document.querySelectorAll('.theme-btn, .theme-btn-small');
const html = document.documentElement; // la balise <html>

// Met à jour l'icône (soleil / lune) et le texte d'aide de chaque bouton.
function updateThemeIcons() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeButtons.forEach(btn => {
        const icon = btn.querySelector('i'); // l'icône Font Awesome
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        btn.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
    });
}

// Applique un thème ("light" ou "dark"), le mémorise et met à jour l'icône.
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons();
}

// Au chargement : on regarde la préférence système et le choix déjà mémorisé.
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    setTheme(savedTheme); // on réutilise le dernier choix de l'utilisateur
} else {
    setTheme(prefersDark ? 'dark' : 'light'); // sinon, on suit le système
}

// Au clic sur un bouton, on inverse le thème actuel.
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
});


// 4. MENU MOBILE
// Ouvre / ferme le menu affiché sur petit écran (téléphone).
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    // classList.toggle('active') ajoute la classe si absente, la retire sinon.
    const isOpen = menu.classList.toggle('active');
    // aria-expanded = info d'accessibilité (menu ouvert ou non).
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    menu.classList.remove('active');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}


// 5. SCROLL-SPY (lien actif dans le menu)
// Met en surbrillance le lien du menu correspondant à la section
// actuellement visible à l'écran.
const navPills = document.querySelectorAll('.nav-pill');           // liens du menu (desktop)
const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]'); // liens du menu mobile
const spySections = document.querySelectorAll('section[id]');      // toutes les sections avec un id

function updateActiveNav() {
    if (!navPills.length || !spySections.length) return;

    // Hauteur de l'en-tête + une petite marge, pour considérer qu'une section
    // est "atteinte" quand elle arrive sous le menu fixé.
    const headerOffset = (document.querySelector('.header')?.offsetHeight || 0) + 40;

    // Par défaut, la section active est la première.
    let current = spySections[0].id;

    // Cas particulier : si on est tout en bas de la page, la dernière
    // section est forcément celle qui est visible.
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (atBottom) {
        current = spySections[spySections.length - 1].id;
    } else {
        // On parcourt les sections : la dernière dont le haut est déjà
        // passé (au-dessus de la position du scroll) est la section active.
        spySections.forEach(section => {
            if (window.scrollY + headerOffset >= section.offsetTop) {
                current = section.id;
            }
        });
    }

    // On ajoute la classe 'active' au bon lien, et on la retire des autres.
    navPills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('href') === '#' + current);
    });
    mobileLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

// On recalcule à chaque défilement (via requestAnimationFrame pour la fluidité),
// au chargement, et quand l'adresse (le #ancre) change.
window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
}, { passive: true });
window.addEventListener('load', updateActiveNav);
window.addEventListener('hashchange', updateActiveNav);
updateActiveNav(); // et une fois au démarrage


// 6. FENÊTRES DE DÉTAIL DES PROJETS (MODALES)

// Toutes les informations des projets.
// La clé (ex: 'sixiemeEtoile') correspond à l'attribut onclick dans le HTML.
// Pour ajouter un projet : copier un bloc et adapter les champs.
const projectsData = {
    'sixiemeEtoile': {
        title: 'Portail Agence',
        category: 'Full Stack',
        year: '2026',
        description: 'Création du Portail Agence en stage alterné de 2 mois chez Sixième Etoile (mars — juin 2026). Stack technique : Next.js, Prisma et Turborepo.',
        images: ['Images/agence-dashboard-1.webp', 'Images/agence-grille-1.webp', 'Images/agence-login-1.webp'],
        techs: ['TypeScript', 'Next.js', 'Prisma', 'Turborepo', 'API Hono', 'Tailwind CSS', 'PostgreSQL'],
        github: null,
        role: 'Développeuse Full Stack - Stagiaire',
        roleDesc: 'Stage alterné de 2 mois : création du Portail Agence avec Next.js, Prisma et Turborepo, collaboration en équipe sur un projet complet.'
    },
    'colocation': {
        title: 'Application de colocation',
        category: 'Web',
        year: '2024',
        description: 'Application web permettant de gérer une colocation : inscription, tâches ménagères, courses et charges communes.',
        images: ['Images/colocation1.webp', 'Images/colocation2.webp', 'Images/colocation3.webp', 'Images/colocation4.webp', 'Images/colocation5.webp', 'Images/colocation6.webp', 'Images/colocation7.webp'],
        video: 'https://www.youtube.com/embed/Teqj2Syxauk',
        techs: ['Python', 'Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        github: 'https://github.com/balletFrancois18/Projet-IHM-Colocation/tree/main2',
        role: 'Réalisé en groupe',
        roleDesc: 'Projet de gestion de colocation réalisé en groupe'
    },
    'appRecette': {
        title: 'Gestionnaire de recettes',
        category: 'CLI · Script',
        year: '2024',
        description: 'Application en ligne de commande pour gérer une collection de recettes de cuisine.',
        images: ['Images/appRecette1.webp', 'Images/appRecette2.webp'],
        techs: ['Python', 'argparse', 'JSON', 'CLI'],
        github: 'https://github.com/banu005/Application_Recettes',
        role: 'Solo',
        roleDesc: 'Projet personnel'
    },
    'clientserveur': {
        title: 'Client-Serveur IPC',
        category: 'API',
        year: '2024',
        description: 'Application client-serveur de réservation de places pour des spectacles, avec Communication Inter-Processus (IPC).',
        images: ['Images/progclient.webp', 'Images/progserveur.webp'],
        techs: ['C', 'Linux'],
        github: 'https://github.com/banu005/Mini-projet-ProgSysRep',
        role: 'En binôme',
        roleDesc: 'Programmation système répartie'
    },
    'snake': {
        title: 'Site web Snake Game',
        category: 'Web · Jeu',
        year: '2024',
        description: 'Site web présentant le mini jeu Snake, codé en HTML CSS PHP et JavaScript.',
        images: ['Images/jeusnakelogin.webp', 'Images/jeusnakejouer.webp', 'Images/jeusnakegameover.webp'],
        techs: ['HTML', 'CSS', 'PHP', 'JavaScript'],
        github: 'https://github.com/Lazurnet/Snake',
        role: 'Réalisé en groupe',
        roleDesc: 'Site web Snake Game réalisé en groupe'
    },
    '93mooveV2': {
        title: '93Moove v2',
        category: 'Full Stack',
        year: '2025',
        description: 'Plateforme web pour une association d\'activités sportives et créatives avec système d\'inscription aux cours. Méthode Scrum.',
        images: ['Images/93moove2.webp', 'Images/93moove2login.webp'],
        techs: ['Angular', 'Spring', 'Java', 'TypeScript', 'API REST', 'PostgreSQL'],
        github: [
            { label: 'Voir le back-end', url: 'https://github.com/banu005/93MooveBackEnd' },
            { label: 'Voir le front-end', url: 'https://github.com/banu005/93MooveFrontEnd' }
        ],
        role: 'Product Owner & Développeuse',
        roleDesc: 'Gestion du backlog, mise en sprint des fonctionnalités utilisateurs, utilisation de Trello pour la gestion des missions et suivi du projet. Développement d\'API REST et gestion de la base de données.'
    },
    '2dgame': {
        title: 'Jeu 2D Shooter',
        category: 'Jeu',
        year: '2023',
        description: 'Jeu de survie développé avec Godot pour découvrir le développement de jeux vidéo.',
        images: ['Images/2dgame.webp'],
        techs: ['Godot', 'C#'],
        github: null,
        role: 'Solo',
        roleDesc: 'Auto-formation'
    },
    'cineweb': {
        title: 'Cineweb Invest',
        category: 'Stage',
        year: '2024',
        description: 'Site web d\'investissement pour Images30 : analyse du besoin, cahier des charges, maquettage et développement.',
        images: ['Images/cineweb.webp'],
        techs: ['Google Sites', 'Balsamiq'],
        github: null,
        role: 'Développeuse Web - Stagiaire',
        roleDesc: 'Première année BTS SIO - Stage de 5 semaines'
    },
    '93mooveV1': {
        title: '93Moove v1',
        category: 'Web',
        year: '2024',
        description: 'Plateforme web complète pour une association proposant des activités sportives et créatives.',
        images: ['Images/93moove1.webp'],
        techs: ['PHP', 'PostgreSQL'],
        github: 'https://github.com/cisse000/lab1-93moov/tree/master',
        role: 'Développeuse',
        roleDesc: 'Développement de la page d\'authentification et gestion de la base de données'
    }
};

// Ouvre la fenêtre de détail pour le projet demandé.
// "projectId" est la clé utilisée dans projectsData (ex: 'snake').
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return; // projet inconnu : on ne fait rien

    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');

    // On mémorise l'élément cliqué pour lui redonner le focus à la fermeture
    // (important pour l'accessibilité au clavier).
    modal._previousFocus = document.activeElement;

    // Construction des images du projet.
    // Si c'est un PDF, on l'intègre ; sinon, on affiche l'image en fond.
    let imagesHtml = '';
    project.images.forEach(img => {
        if (img.endsWith('.pdf')) {
            imagesHtml += `<embed src="${img}" type="application/pdf" class="modal-pdf">`;
        } else {
            imagesHtml += `<div class="modal-image" style="background-image: url('${img}');" role="img" aria-label="${project.title}"></div>`;
        }
    });

    // Construction des liens en bas de la fenêtre (bouton(s) GitHub + bouton Fermer).
    // "github" peut être une URL unique (string) ou une liste de dépôts
    // ({ label, url }) quand un projet est réparti sur plusieurs repos.
    let linksHtml = '';
    if (project.github) {
        const repos = Array.isArray(project.github)
            ? project.github
            : [{ label: 'Voir le code', url: project.github }];
        repos.forEach(repo => {
            linksHtml += `<a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="modal-link primary">
                <i class="fab fa-github" aria-hidden="true"></i>
                <span>${repo.label}</span>
            </a>`;
        });
    }
    linksHtml += `<button class="modal-link secondary" data-modal-close>
        <i class="fas fa-times"></i>
        <span>Fermer</span>
    </button>`;

    // Bloc "Rôle" affiché uniquement si l'info existe pour le projet.
    let roleHtml = '';
    if (project.role) {
        roleHtml = `
            <div class="modal-role">
                <h4 class="modal-techs-title">Rôle</h4>
                <p class="modal-role-text"><strong>${project.role}</strong></p>
                <p class="modal-role-desc">${project.roleDesc}</p>
            </div>
        `;
    }

    // On remplit toute la fenêtre avec le contenu du projet (gabarit HTML).
    content.innerHTML = `
        <div class="modal-header">
            <div class="modal-category">${project.category}</div>
            <h2 class="modal-title" id="modalTitle">${project.title}</h2>
            <span class="modal-year">${project.year}</span>
        </div>
        <p class="modal-description">${project.description}</p>
        ${project.video ? `<div class="modal-video"><iframe src="${project.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : ''}
        <div class="modal-images">${imagesHtml}</div>
        ${roleHtml}
        <div class="modal-techs">
            <h4 class="modal-techs-title">Technologies utilisées</h4>
            <div class="modal-techs-list">
                ${project.techs.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="modal-links">${linksHtml}</div>
    `;

    // On rend la fenêtre visible et on bloque le défilement de la page derrière.
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Le bouton "Fermer" du contenu vient d'être créé : on lui attache l'action.
    content.querySelector('[data-modal-close]')?.addEventListener('click', closeProjectModal);

    // On place le focus sur le bouton "fermer" (confort au clavier).
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

// Ferme la fenêtre de détail.
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // on réautorise le défilement de la page

    // On redonne le focus à l'élément qui avait ouvert la fenêtre.
    if (modal._previousFocus) {
        modal._previousFocus.focus();
        modal._previousFocus = null;
    }
}

// Fermer la fenêtre si on clique sur le fond sombre (en dehors du contenu).
document.getElementById('projectModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectModal();
    }
});

// Fermer la fenêtre avec la touche Échap, et piéger le focus (trap)
// à l'intérieur tant qu'elle est ouverte (accessibilité clavier).
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('projectModal');
    if (!modal.classList.contains('active')) return; // modale fermée : rien à faire

    if (e.key === 'Escape') {
        closeProjectModal();
        return;
    }

    // Piège de focus : Tab ne doit pas sortir de la modale.
    if (e.key !== 'Tab') return;

    const focusables = modal.querySelectorAll(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});


// 7. OBFUSCATION DE L'EMAIL
// L'adresse n'est jamais écrite en clair dans le HTML : on la reconstitue
// ici à partir de data-email-user / data-email-domain. Cela complique la
// récupération automatique par les robots spammeurs.
document.querySelectorAll('[data-email-user]').forEach(el => {
    const user = el.dataset.emailUser;
    const domain = el.dataset.emailDomain;
    if (!user || !domain) return;
    const address = `${user}@${domain}`;
    el.setAttribute('href', `mailto:${address}`);
    const display = el.querySelector('[data-email-display]');
    if (display) display.textContent = address;
});


// 8. LIAISON DES ÉVÉNEMENTS
// Tous les gestionnaires sont attachés ici (plus aucun onclick dans le HTML),
// ce qui garde le balisage propre et le JS centralisé.
document.addEventListener('DOMContentLoaded', () => {

    // Bouton d'ouverture du menu mobile.
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', toggleMobileMenu);

    // Chaque lien du menu mobile referme le menu après le clic.
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cartes projet : ouverture de la modale au clic et au clavier (Entrée / Espace).
    document.querySelectorAll('.study-card').forEach(card => {
        const id = card.dataset.project;
        if (!id) return;

        card.addEventListener('click', e => {
            // On ne déclenche pas la modale si l'utilisateur clique sur un lien
            // externe (YouTube, GitHub...) : on le laisse agir normalement.
            if (e.target.closest('a[href]')) return;
            openProjectModal(id);
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // évite de faire défiler la page avec Espace
                openProjectModal(id);
            }
        });
    });

    // Bouton "croix" qui ferme la modale.
    document.querySelector('.modal-close')?.addEventListener('click', closeProjectModal);

    // Formulaire de contact.
    document.querySelector('.contact-form')?.addEventListener('submit', handleFormSubmit);
});

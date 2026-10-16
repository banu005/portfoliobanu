// Portfolio Banumathey BALENDRAN — script.js
// Ce fichier gère toutes les interactions de la page : le terminal animé,
// la barre de progression de lecture, le formulaire de contact, le thème
// clair/sombre, le menu mobile, le lien actif du menu (scroll-spy) et les
// fenêtres de détail des projets (modales).


// 1. TERMINAL ANIMÉ
// Simule un vrai terminal : on "tape" une commande, puis on affiche le
// résultat, et on recommence en boucle.
function initTerminal() {
    // On récupère les 2 zones du terminal dans le HTML.
    // "linesEl" = la zone où s'empilent les lignes déjà affichées.
    // "inputEl" = la zone où l'on voit la commande en train d'être tapée.
    const linesEl = document.getElementById('terminalLines');
    const inputEl = document.getElementById('terminalInput');
    // Si ces éléments n'existent pas sur la page, on arrête (sécurité).
    if (!linesEl || !inputEl) return;

    // La liste des commandes à jouer en boucle.
    // Chaque élément a : cmd (la commande) et out (le résultat affiché).
    // "cls" est une classe CSS qui colore le résultat ('' = gris,
    // 'success' = vert, 'info' = bleu).
    const sequence = [
        { cmd: 'whoami',                                out: { text: 'banumathey — développeuse full stack', cls: 'info' } },
        { cmd: 'ls ~/projets',                          out: { text: 'gestionnaire-recettes/  jeu-snake/', cls: '' } },
        { cmd: 'python recettes.py add "Tiramisu"',     out: { text: 'Recette ajoutée avec succès.', cls: 'success' } },
        { cmd: 'godot --run jeu-2d',                    out: { text: 'Niveau 1 chargé — bonne partie !', cls: 'success' } },
        { cmd: 'git commit -m "feat: nouveau projet"',  out: { text: '[main 3a7f2c1] 2 files changed, 54 insertions(+)', cls: '' } },
        { cmd: 'git push origin main',                  out: { text: 'To github.com/banu005 · main → main ✓', cls: 'success' } },
    ];

    // Nombre maximum de lignes gardées à l'écran.
    // Au-delà, les plus anciennes disparaissent (pour ne pas déborder).
    const MAX_LINES = 9;

    // Petite fonction utilitaire : crée une ligne HTML prête à afficher.
    // "type" = 'cmd' (commande) ou 'out' (résultat), "modifier" = couleur.
    function renderLine(type, text, modifier) {
        const div = document.createElement('div');
        div.className = `t-line-${type}${modifier ? ' ' + modifier : ''}`;
        div.textContent = text;
        return div;
    }

    // Accessibilité : si l'utilisateur a activé "réduire les animations"
    // dans son système, on n'anime rien : on affiche directement les
    // 5 dernières commandes, et on cache le curseur clignotant.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sequence.slice(-5).forEach(({ cmd, out }) => {
            linesEl.appendChild(renderLine('cmd', cmd));
            linesEl.appendChild(renderLine('out', out.text, out.cls));
        });
        document.querySelector('.terminal-active')?.style.setProperty('display', 'none');
        return;
    }

    // Tableau qui garde la trace des lignes affichées (pour pouvoir les retirer).
    const displayed = [];
    // Compteur : à quelle commande de la "sequence" on est rendu.
    let step = 0;

    // Ajoute une ligne et retire la plus ancienne si on dépasse MAX_LINES.
    function addLine(text, type, modifier) {
        const div = renderLine(type, text, modifier);
        linesEl.appendChild(div);
        displayed.push(div);
        if (displayed.length > MAX_LINES) displayed.shift().remove();
    }

    // Joue une étape : tape la commande lettre par lettre, puis affiche
    // le résultat, puis rappelle runStep() après une courte pause.
    function runStep() {
        // On prend la commande courante. Le "%" permet de repartir au début
        // quand on arrive à la fin de la liste (boucle infinie).
        const { cmd, out } = sequence[step % sequence.length];
        let i = 0; // nombre de lettres déjà tapées
        inputEl.textContent = '';

        // setInterval = exécute la fonction toutes les X millisecondes.
        const interval = setInterval(() => {
            inputEl.textContent = cmd.slice(0, ++i); // affiche 1 lettre de plus
            if (i >= cmd.length) {
                // La commande est entièrement tapée : on arrête le "typage".
                clearInterval(interval);
                setTimeout(() => {
                    addLine(cmd, 'cmd');          // la commande rejoint les lignes du haut
                    inputEl.textContent = '';      // on vide la zone de saisie
                    setTimeout(() => {
                        addLine(out.text, 'out', out.cls); // on affiche le résultat
                        step++;                    // on passe à la commande suivante
                        setTimeout(runStep, 1400);  // pause avant de recommencer
                    }, 350);
                }, 180);
            }
        }, 55 + Math.random() * 25); // vitesse de frappe légèrement aléatoire
    }

    // Démarre l'animation après 700 ms.
    setTimeout(runStep, 700);
}

initTerminal(); // <- on lance le terminal au chargement du script.


// 2. BARRE DE PROGRESSION DE LECTURE
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


// 3. FORMULAIRE DE CONTACT
// Envoie le message via le service externe Web3Forms, puis affiche un
// retour visuel sur le bouton (envoi, succès ou erreur).
async function handleFormSubmit(e) {
    e.preventDefault(); // empêche le rechargement de page par défaut du formulaire
    const form = e.target;
    const btn = form.querySelector('.form-submit');
    // Texte d'origine du bouton, pour le remettre à la fin.
    const defaultBtn = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';

    // On récupère l'email. Le "?." évite une erreur si le champ est absent.
    const email = form.querySelector('#contact-email')?.value.trim() || '';
    if (!email) {
        // Pas d'email : on remet le focus dessus et on annule l'envoi.
        form.querySelector('#contact-email')?.focus();
        return;
    }

    // Récupération des autres champs du formulaire.
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


// 4. MODE CLAIR / SOMBRE (THÈME)
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


// 5. MENU MOBILE
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


// 6. SCROLL-SPY (lien actif dans le menu)
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


// 7. FENÊTRES DE DÉTAIL DES PROJETS (MODALES)

// Toutes les informations des projets.
// La clé (ex: 'sixiemeEtoile') correspond à l'attribut onclick dans le HTML.
// Pour ajouter un projet : copier un bloc et adapter les champs.
const projectsData = {
    'sixiemeEtoile': {
        title: 'Portail Agence',
        category: 'Full Stack',
        year: '2026',
        description: 'Création du Portail Agence en stage alterné de 2 mois chez Sixième Etoile (mars — juin 2026). Stack technique : Next.js, Prisma et Turborepo.',
        images: ['Images/agence-dashboard-1.png', 'Images/agence-grille-1.png', 'Images/agence-login-1.png'],
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
        images: ['Images/colocation1.png', 'Images/colocation2.png', 'Images/colocation3.png', 'Images/colocation4.png', 'Images/colocation5.png', 'Images/colocation6.png', 'Images/colocation7.png'],
        video: 'https://www.youtube.com/embed/Teqj2Syxauk',
        techs: ['Python', 'Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        github: null,
        role: 'Réalisé en groupe',
        roleDesc: 'Projet de gestion de colocation réalisé en groupe'
    },
    'appRecette': {
        title: 'Gestionnaire de recettes',
        category: 'CLI · Script',
        year: '2024',
        description: 'Application en ligne de commande pour gérer une collection de recettes de cuisine.',
        images: ['Images/appRecette1.png', 'Images/appRecette2.png'],
        techs: ['Python', 'argparse', 'JSON', 'CLI'],
        github: null,
        role: 'Solo',
        roleDesc: 'Projet personnel'
    },
    'clientserveur': {
        title: 'Client-Serveur IPC',
        category: 'API',
        year: '2024',
        description: 'Application client-serveur de réservation de places pour des spectacles, avec Communication Inter-Processus (IPC).',
        images: ['Images/progclient.png', 'Images/progserveur.png'],
        techs: ['C', 'Linux'],
        github: null,
        role: 'En binôme',
        roleDesc: 'Programmation système répartie'
    },
    'snake': {
        title: 'Site web Snake Game',
        category: 'Web · Jeu',
        year: '2024',
        description: 'Site web présentant le mini jeu Snake, codé en HTML CSS PHP et JavaScript.',
        images: ['Images/jeusnakelogin.png', 'Images/jeusnakejouer.png', 'Images/jeusnakegameover.png'],
        techs: ['HTML', 'CSS', 'PHP', 'JavaScript'],
        github: null,
        role: 'Réalisé en groupe',
        roleDesc: 'Site web Snake Game réalisé en groupe'
    },
    '93mooveV2': {
        title: '93Moove v2',
        category: 'Full Stack',
        year: '2025',
        description: 'Plateforme web pour une association d\'activités sportives et créatives avec système d\'inscription aux cours. Méthode Scrum.',
        images: ['Images/93moove2.png', 'Images/93moove2login.png'],
        techs: ['Angular', 'Spring', 'Java', 'TypeScript', 'API REST', 'PostgreSQL'],
        github: null,
        role: 'Product Owner & Développeuse',
        roleDesc: 'Gestion du backlog, mise en sprint des fonctionnalités utilisateurs, utilisation de Trello pour la gestion des missions et suivi du projet. Développement d\'API REST et gestion de la base de données.'
    },
    '2dgame': {
        title: 'Jeu 2D Shooter',
        category: 'Jeu',
        year: '2023',
        description: 'Jeu de survie développé avec Godot pour découvrir le développement de jeux vidéo.',
        images: ['Images/2dgame.png'],
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
        images: ['Images/cineweb.png'],
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
        images: ['Images/93moove1.png'],
        techs: ['PHP', 'PostgreSQL'],
        github: null,
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

    // Construction des liens en bas de la fenêtre (bouton GitHub + bouton Fermer).
    let linksHtml = '';
    if (project.github) {
        linksHtml += `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="modal-link primary">
            <i class="fab fa-github"></i>
            <span>Voir le code</span>
        </a>`;
    }
    linksHtml += `<button class="modal-link secondary" onclick="closeProjectModal()">
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

// Fermer la fenêtre avec la touche Échap.
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

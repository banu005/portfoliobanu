const carouselState = {};

// Terminal animé
function initTerminal() {
    const linesEl = document.getElementById('terminalLines');
    const inputEl = document.getElementById('terminalInput');
    if (!linesEl || !inputEl) return;

    const sequence = [
        { cmd: 'git pull origin main',                                    out: { text: 'Already up to date.', cls: 'success' } },
        { cmd: 'python -m venv venv && source venv/bin/activate',         out: { text: '(venv) banu@dev:~/recettes$', cls: 'info' } },
        { cmd: 'pip install -r requirements.txt',                         out: { text: 'Successfully installed argparse json', cls: 'success' } },
        { cmd: 'python recettes.py add "Gateau au chocolat"',             out: { text: 'Recette ajoutée avec succès.', cls: 'success' } },
        { cmd: 'python recettes.py list',                                 out: { text: '1. Gateau au chocolat', cls: 'info' } },
        { cmd: 'git add .',                                               out: { text: 'Changes staged for commit', cls: '' } },
        { cmd: 'git commit -m "feat: ajout commande recherche"',          out: { text: '[main 3a7f2c1] 2 files changed, 54 insertions(+)', cls: '' } },
        { cmd: 'git push origin main',                                    out: { text: 'To github.com/banu005 · main → main ✓', cls: 'success' } },
    ];

    const MAX_LINES = 9;
    const displayed = [];
    let step = 0;

    function addLine(text, type, modifier) {
        const div = document.createElement('div');
        div.className = `t-line-${type}${modifier ? ' ' + modifier : ''}`;
        div.textContent = text;
        linesEl.appendChild(div);
        displayed.push(div);
        if (displayed.length > MAX_LINES) displayed.shift().remove();
    }

    function runStep() {
        const { cmd, out } = sequence[step % sequence.length];
        let i = 0;
        inputEl.textContent = '';
        const interval = setInterval(() => {
            inputEl.textContent = cmd.slice(0, ++i);
            if (i >= cmd.length) {
                clearInterval(interval);
                setTimeout(() => {
                    addLine(cmd, 'cmd');
                    inputEl.textContent = '';
                    setTimeout(() => {
                        addLine(out.text, 'out', out.cls);
                        step++;
                        setTimeout(runStep, 1400);
                    }, 350);
                }, 180);
            }
        }, 55 + Math.random() * 25);
    }

    setTimeout(runStep, 700);
}

initTerminal();


// Barre de progression au scroll
window.addEventListener('scroll', () => {
    const fill = document.getElementById('progressFill');
    if (!fill) return;
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    fill.style.width = Math.min(pct, 100) + '%';
});

// Formulaire contact → ouvre le client mail avec les données pré-remplies
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.form-submit');
    const defaultBtn = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';

    const email = form.querySelector('#contact-email')?.value.trim() || '';
    if (!email) {
        form.querySelector('#contact-email')?.focus();
        return;
    }

    // Construit les données pour Web3Forms
    const prenom = form.querySelector('#contact-prenom')?.value.trim() || '';
    const nom = form.querySelector('#contact-nom')?.value.trim() || '';
    const sujet = form.querySelector('#contact-sujet')?.value.trim() || 'Contact depuis le portfolio';

    const formData = new FormData(form);
    formData.set('name', `${prenom} ${nom}`.trim() || 'Visiteur');
    formData.set('subject', sujet);
    formData.set('replyto', email);

    // État "envoi en cours"
    btn.disabled = true;
    btn.innerHTML = '<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.style.background = '';

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            btn.innerHTML = '<span>Message envoyé !</span> <i class="fas fa-check"></i>';
            btn.style.background = '#28C840';
            form.reset();
        } else {
            throw new Error(data.message || 'Échec de l\'envoi');
        }
    } catch (err) {
        btn.innerHTML = '<span>Erreur, réessayez</span> <i class="fas fa-exclamation-triangle"></i>';
        btn.style.background = '#FF5F57';
        console.error('Web3Forms:', err);
    } finally {
        setTimeout(() => {
            btn.innerHTML = defaultBtn;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    }
}

const themeButtons = document.querySelectorAll('.theme-btn, .theme-btn-small');
const html = document.documentElement;

// Update all theme button icons
function updateThemeIcons() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons();
}

// Détecter le thème système
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme(prefersDark ? 'dark' : 'light');
}

// Add click event to all theme buttons
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
});

// Mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    const isOpen = menu.classList.toggle('active');
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    menu.classList.remove('active');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function moveCarousel(id, direction) {
    const totals = {
        'p2': 2,
        'colocation': 7,
        'snake': 3,
        'clientserveur': 2,
        'apprecette': 2
    };
    const total = totals[id] || 3;
    
    if (!carouselState[id]) carouselState[id] = { index: 0, total: total };
    const state = carouselState[id];
    state.index = (state.index + direction + state.total) % state.total;
    updateCarousel(id, state.index);
}
function goToSlide(id, index) {
    const totals = {
        'p2': 2,
        'colocation': 7,
        'snake': 3,
        'clientserveur': 2,
        'apprecette': 2
    };
    const total = totals[id] || 3;
    if (!carouselState[id]) carouselState[id] = { index: 0, total: total };
    carouselState[id].index = index;
    updateCarousel(id, index);
}
function updateCarousel(id, index) {
    const track = document.getElementById('carousel-' + id);
    if (!track) return;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    const state = carouselState[id];
    if (!state) return;
    for (let i = 0; i < state.total; i++) {
        const dot = document.getElementById(`dot-${id}-${i}`);
        if (dot) {
            dot.classList.toggle('active', i === index);
            dot.classList.toggle('inactive', i !== index);
        }
    }
}

// ========================================
// PROJECT MODAL
// ========================================

const projectsData = {
    '93mooveV1': {
        title: 'Site web 93moove - Première année BTS SIO',
        category: 'Web',
        year: '2024',
        description: 'Plateforme web complète pour une association proposant des activités sportives et créatives. Le site permet aux utilisateurs de se connecter et de s\'inscrire aux cours proposés.',
        images: ['Images/93moove1.png'],
        techs: ['PHP', 'HTML', 'CSS', 'PostgreSQL', 'Laragon'],
        github: null,
        role: 'Développeuse',
        roleDesc: "Développement de la page d'authentification et gestion de la base de données"
    },
    '93mooveV2': {
        title: 'Site web 93moove - Deuxième année BTS SIO',
        category: 'Full Stack',
        year: '2025',
        description: 'Deuxième version du site 93moove, une plateforme web pour une association d\'activités sportives et créatives avec système d\'inscription aux cours. Utilisation de la méthode Scrum.',
        images: ['Images/93moove2.png', 'Images/93moove2login.png'],
        techs: ['Angular', 'Spring', 'Java', 'HTML', 'CSS', 'TypeScript', 'API REST', 'Supabase', 'PostgreSQL'],
        github: 'https://github.com/angelo1967817162/angular.git',
        role: 'Product Owner & Développeuse',
        roleDesc: 'Gestion du backlog, mise en sprint des fonctionnalités utilisateurs, utilisation de Trello pour la gestion des missions et suivi du projet. Développement d\'API REST et gestion de la base de données.'
    },
    'cineweb': {
        title: 'Site web Cineweb Invest - Stage Images30',
        category: 'Stage',
        year: '2024',
        description: 'Création d\'un site web d\'investissement pour Images30. Réalisation complète du projet : analyse du besoin, cahier des charges, maquettage sur Balsamiq et développement sur Google Sites.',
        images: ['Images/cineweb.png'],
        techs: ['Google Sites', 'Balsamiq', 'Cahier des charges', 'Analyse fonctionnelle'],
        github: null,
        role: 'Développeuse Web - Stagiaire',
        roleDesc: 'Première année BTS SIO - Stage de 5 semaines'
    },
    '2dgame': {
        title: 'Jeu 2D - Shooter Survival',
        category: 'Jeu',
        year: '2023',
        description: 'Jeu de survie où le personnage doit éliminer des blobs verts en tirant pour survivre. Développé en suivant un tutoriel pour découvrir le développement de jeux vidéo avec Godot.',
        images: ['Images/2dgame.png'],
        techs: ['Godot', 'C#'],
        github: 'https://github.com/banu005/2dgame.git',
        role: 'Solo',
        roleDesc: 'Auto-formation'
    },
    'supersimpledev': {
        title: 'HTML CSS Course - SuperSimpleDev',
        category: 'Formation',
        year: '2024',
        description: 'Réplique de l\'interface YouTube pour apprendre les bases du HTML et CSS. Formation complète avec cours théoriques, exemples pratiques et exercices pour maîtriser les fondamentaux du développement web.',
        images: ['Images/expractice.png'],
        techs: ['HTML5', 'CSS3', 'VS Code'],
        github: null,
        role: 'Auto-formation',
        roleDesc: 'Formation vidéo SuperSimpleDev'
    },
    'snake': {
        title: 'Site web Snake Game',
        category: 'Web',
        year: '2024',
        description: 'Création d\'un site web qui présente le mini jeu Snake. Réalisation complète du projet : utiliser les méthodes d\'IHM, coder le site en HTML CSS PHP et déployer le projet sur un hébergeur web.',
        images: ['Images/jeusnakelogin.png', 'Images/jeusnakejouer.png', 'Images/jeusnakegameover.png'],
        techs: ['HTML', 'CSS', 'PHP', 'JavaScript'],
        github: 'https://github.com/laize-loucia/Game_App.git',
        role: 'Réalisé en groupe',
        roleDesc: 'Site web Snake Game réalisé en groupe'
    },
    'clientserveur': {
        title: 'Mini projet en programmation système répartie',
        category: 'API',
        year: '2024',
        description: 'Création d\'une application client serveur permettant de réserver des places pour un ensemble de spectacles. Cette application dispose de deux programmes : client et serveur. Le client fait une requête de consultation ou de réservation et le serveur répond à la demande et affiche les nombres de places disponibles sur les spectacles et réserve la place du client. Utilisation de Communication Inter-Processus (IPC).',
        images: ['Images/progclient.png', 'Images/progserveur.png'],
        techs: ['C', 'Linux'],
        github: 'https://github.com/banu005/Mini-projet-ProgSysRep.git',
        role: 'En binôme',
        roleDesc: 'Programmation système répartie'
    },
    'appRecette': {
        title: 'Gestionnaire de recettes - Application CLI',
        category: 'Script',
        year: '2024',
        description: 'Application en ligne de commande permettant de gérer une collection de recettes de cuisine. L\'utilisateur peut ajouter, afficher, rechercher et supprimer des recettes directement depuis le terminal.',
        images: ['Images/appRecette1.png', 'Images/appRecette2.png'],
        techs: ['Python', 'argparse', 'JSON', 'CLI'],
        github: 'https://github.com/banu005',
        role: 'Solo',
        roleDesc: 'Projet personnel'
    },
    'sixiemeEtoile': {
        title: 'Application Sixième Etoile — Stage Alterné 2 mois',
        category: 'Full Stack',
        year: '2026',
        description: 'Création du Portail Agence en stage alterné de 2 mois chez Sixième Etoile (mars — juin 2026). Stack technique : Next.js, Prisma et Turborepo.',
        images: ['Images/agence-dashboard-1.png', 'Images/agence-grille-1.png', 'Images/agence-login-1.png'],
        techs: ['Next.js', 'Prisma', 'Turborepo', 'TypeScript'],
        github: null,
        role: 'Développeuse Full Stack - Stagiaire',
        roleDesc: 'Stage alterné de 2 mois : création du Portail Agence avec Next.js, Prisma et Turborepo, collaboration en équipe sur un projet complet.'
    },
    'colocation': {
        title: 'Application web de colocation',
        category: 'Web',
        year: '2024',
        description: 'Application web permettant de gérer une colocation. Les utilisateurs peuvent s\'inscrire, se connecter, gérer les tâches ménagères, les courses et les charges communes.',
        images: ['Images/colocation1.png', 'Images/colocation2.png', 'Images/colocation3.png', 'Images/colocation4.png', 'Images/colocation5.png', 'Images/colocation6.png', 'Images/colocation7.png'],
        video: 'https://www.youtube.com/embed/Teqj2Syxauk',
        techs: ['Python', 'HTML', 'CSS', 'JavaScript', 'Flask', 'MySQL'],
        github: 'https://github.com/balletFrancois18/Projet-IHM-Colocation.git',
        role: 'Réalisé en groupe',
        roleDesc: 'Projet de gestion de colocation réalisé en groupe'
    }
};

function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    
    let imagesHtml = '';
    project.images.forEach(img => {
        if (img.endsWith('.pdf')) {
            imagesHtml += `<embed src="${img}" type="application/pdf" class="modal-pdf">`;
        } else {
            imagesHtml += `<div class="modal-image" style="background-image: url('${img}');"></div>`;
        }
    });
    
    let linksHtml = '';
    if (project.github) {
        linksHtml += `<a href="${project.github}" target="_blank" class="modal-link primary">
            <i class="fab fa-github"></i>
            <span>Voir le code</span>
        </a>`;
    }
    linksHtml += `<button class="modal-link secondary" onclick="closeProjectModal()">
        <i class="fas fa-times"></i>
        <span>Fermer</span>
    </button>`;
    
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
    
    content.innerHTML = `
        <div class="modal-header">
            <div class="modal-category">${project.category}</div>
            <h2 class="modal-title">${project.title}</h2>
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
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Fermer la modal en cliquant à l'extérieur
document.getElementById('projectModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectModal();
    }
});

// Fermer avec la touche Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});
const carouselState = {};

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    const label = themeToggle.querySelector('.theme-label');
    
    function updateThemeIcon() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        if (label) {
            label.textContent = isDark ? 'Sombre' : 'Clair';
        }
    }
    
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon();
    }
    
    // Détecter le thème système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}
function moveCarousel(id, direction) {
    // Déterminer le nombre d'images selon l'ID
    const totals = {
        'p2': 2,
        'colocation': 7
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
        'colocation': 7
    };
    const total = totals[id] || 3;
    if (!carouselState[id]) carouselState[id] = { index: 0, total: total };
    carouselState[id].index = index;
    updateCarousel(id, index);
}
function updateCarousel(id, index) {
    const track = document.getElementById('carousel-' + id);
    track.style.transform = `translateX(-${index * 100}%)`;
    
    const state = carouselState[id];
    for (let i = 0; i < state.total; i++) {
        const dot = document.getElementById(`dot-${id}-${i}`);
        if (dot) {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-white/40', i !== index);
        }
    }
}
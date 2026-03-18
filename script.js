const carouselState = {};
function moveCarousel(id, direction) {
    // Déterminer le nombre d'images selon l'ID
    const total = (id === 'p2') ? 2 : 3; // 2 images pour projet 2, 3 pour les autres
    
    if (!carouselState[id]) carouselState[id] = { index: 0, total: total };
    const state = carouselState[id];
    state.index = (state.index + direction + state.total) % state.total;
    updateCarousel(id, state.index);
}
function goToSlide(id, index) {
    const total = (id === 'p2') ? 2 : 3;
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
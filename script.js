const carouselState = {};

function moveCarousel(id, direction) {
    if (!carouselState[id]) carouselState[id] = { index: 0, total: 3 };
    const state = carouselState[id];
    state.index = (state.index + direction + state.total) % state.total;
    updateCarousel(id, state.index);
}

function goToSlide(id, index) {
    if (!carouselState[id]) carouselState[id] = { index: 0, total: 3 };
    carouselState[id].index = index;
    updateCarousel(id, index);
}

function updateCarousel(id, index) {
    const track = document.getElementById('carousel-' + id);
    track.style.transform = `translateX(-${index * 100}%)`;

    for (let i = 0; i < 3; i++) {
        const dot = document.getElementById(`dot-${id}-${i}`);
        dot.classList.toggle('bg-white', i === index);
        dot.classList.toggle('bg-white/40', i !== index);
    }
}
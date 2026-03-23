document.addEventListener('DOMContentLoaded', () => {
    const translateXSlider = document.getElementById('translateX');
    const rotateSlider = document.getElementById('rotate');
    const scaleSlider = document.getElementById('scale');
    const colorPicker = document.getElementById('color');

    const house = document.querySelector('.house');

    translateXSlider.addEventListener('input', () => {
        anime({
            targets: house,
            translateX: translateXSlider.value,
            duration: 0
        });
    });

    rotateSlider.addEventListener('input', () => {
        anime({
            targets: house,
            rotate: rotateSlider.value,
            duration: 0
        });
    });

    scaleSlider.addEventListener('input', () => {
        anime({
            targets: house,
            scale: scaleSlider.value,
            duration: 0
        });
    });

    colorPicker.addEventListener('input', () => {
        anime({
            targets: '.walls',
            backgroundColor: colorPicker.value,
            duration: 0
        });
    });
});
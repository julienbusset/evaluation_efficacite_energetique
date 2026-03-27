document.addEventListener('DOMContentLoaded', () => {
    const roofThicknessSlider = document.getElementById('roofThickness');
    const wallsThicknessSlider = document.getElementById('wallsThickness');
    const roofRSlider = document.getElementById('roofR');
    const wallsRSlider = document.getElementById('wallsR');

    const roofThicknessValue = document.getElementById('roofThicknessValue');
    const wallsThicknessValue = document.getElementById('wallsThicknessValue');
    const roofRValue = document.getElementById('roofRValue');
    const wallsRValue = document.getElementById('wallsRValue');

    const house = document.querySelector('.house');
    const roof = document.querySelector('.roof');
    const walls = document.querySelector('.walls');

    function updateRoofClipPath() {
        const r = roofRSlider.value;
        const thickness = roofThicknessSlider.value;
        const innerR = 100 - thickness;
        roof.style.clipPath = `polygon(0% 50%, 50% 0%, 100% 50%, ${innerR}% 50%, 50% ${thickness}%, ${thickness}% 50%)`;

        // Ajustement de la luminosité proportionnelle à R
        const brightness = 1 - (r / 10); // R varie de 0 à 10
        roof.style.filter = `brightness(${brightness})`;
    }

    function updateWallsClipPath() {
        const r = wallsRSlider.value;
        const thickness = wallsThicknessSlider.value;
        const innerR = 100 - thickness;
        walls.style.clipPath = `polygon(0% 0%, ${thickness}% 0%, ${thickness}% 50%, 0% 50%, 0% 0%, ${innerR}% 0%, ${innerR}% 50%, 100% 50%, 100% 0%)`;

        // Ajustement de la luminosité proportionnelle à R
        const brightness = 1 - (r / 10); // R varie de 0 à 10
        walls.style.filter = `brightness(${brightness})`;
    }

    function updateSliderValues() {
        roofThicknessValue.textContent = roofThicknessSlider.value + ' mm';
        wallsThicknessValue.textContent = wallsThicknessSlider.value + ' mm';
        roofRValue.textContent = parseFloat(roofRSlider.value).toFixed(1);
        wallsRValue.textContent = parseFloat(wallsRSlider.value).toFixed(1);
    }

    roofThicknessSlider.addEventListener('input', () => {
        updateRoofClipPath();
        updateSliderValues();
    });

    wallsThicknessSlider.addEventListener('input', () => {
        updateWallsClipPath();
        updateSliderValues();
    });

    roofRSlider.addEventListener('input', () => {
        updateRoofClipPath();
        updateSliderValues();
    });

    wallsRSlider.addEventListener('input', () => {
        updateWallsClipPath();
        updateSliderValues();
    });

    // Initial update
    updateRoofClipPath();
    updateWallsClipPath();
    updateSliderValues();
});
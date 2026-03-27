document.addEventListener('DOMContentLoaded', () => {
    const roofThicknessSlider = document.getElementById('roofThickness');
    const wallsThicknessSlider = document.getElementById('wallsThickness');
    const roofRSlider = document.getElementById('roofR');
    const wallsRSlider = document.getElementById('wallsR');

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

    roofThicknessSlider.addEventListener('input', updateRoofClipPath);
    wallsThicknessSlider.addEventListener('input', updateWallsClipPath);
    roofRSlider.addEventListener('input', updateRoofClipPath);
    wallsRSlider.addEventListener('input', updateWallsClipPath);

    // Initial update
    updateRoofClipPath();
    updateWallsClipPath();
});
function getModeName() {
    const randomBtn = document.querySelector('.random-btn.active-particle');
    if (randomBtn) return 'random';

    const snowBtn = document.querySelector('.snow-btn.active-particle');
    if (snowBtn) return 'snow';

    return 'random'; // Default jika tidak ada yang aktif
}

function resetParticleUI() {
    // Reset Slider Kecepatan
    const speedSliders = document.querySelectorAll('.particle-speed');
    speedSliders.forEach(slider => {
        slider.value = DEFAULT_SETTINGS.speed;
        updateSliderBackground(slider);
        const display = slider.closest('.particle-card')?.querySelector('.particle-value');
        if (display) display.textContent = DEFAULT_SETTINGS.speed;
    });

    // Reset Slider Jumlah
    const countSliders = document.querySelectorAll('.particle-count');
    countSliders.forEach(slider => {
        slider.value = DEFAULT_SETTINGS.count;
        updateSliderBackground(slider);
        const display = slider.closest('.particle-card')?.querySelector('.particle-value-count');
        if (display) display.textContent = DEFAULT_SETTINGS.count;
    });

    // Reset Checkbox Fitur
    document.querySelectorAll('.cb-size-random').forEach(cb => {
        cb.checked = DEFAULT_SETTINGS.sizeRandom;
    });
    document.querySelectorAll('.cb-linked-line').forEach(cb => {
        cb.checked = DEFAULT_SETTINGS.lineLinked;
    });
}

let userSettings = {
    speed: 5,
    count: 20,
    sizeRandom: true,
    lineLinked: false
};

const DEFAULT_SETTINGS = {
    speed: 5,
    count: 20,
    sizeRandom: true,
    lineLinked: false
};

const particlePresets = {
    // Mode Default/Random (Sesuai dengan kode inisialisasi awal Anda)
    'random': {
        "number": { "value": 20, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FEFEFE" },
        "line_linked": { "enable": false},
        "shape": { "type": "circle" },
        "opacity": { "value": 0.8, "random": true },
        "size": { "value": 3, "random": true },
        "move": { "enable": true, "speed": 5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
    },
    // Mode Snow (Contoh konfigurasi salju/turun ke bawah)
    'snow': {
        "number": { "value": 20, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FEFEFE" },
        "line_linked": { "enable": false }, // Salju biasanya tidak terhubung
        "shape": { "type": "circle" },
        "opacity": { "value": 0.8, "random": true },
        "size": { "value": 3, "random": true },
        "move": { "enable": true, "speed": 1, "direction": "bottom", "random": true, "straight": false, "out_mode": "out" }
    }
};
function setupParticleToggle() {
    const animationToggles = document.querySelectorAll('.animation-particle');
    const particlesContainer = document.getElementById('particles-js');

    if (!particlesContainer) return;

    animationToggles.forEach(clickedCheckbox => {
        clickedCheckbox.addEventListener('change', function () {
            const isChecked = this.checked;

            // Sinkronkan semua toggle
            animationToggles.forEach(otherCheckbox => {
                otherCheckbox.checked = isChecked;
            });

            if (isChecked) {
                // Gunakan nilai yang ada di userSettings (bisa nilai default atau hasil perubahan terakhir)
                loadParticleMode(getModeName(), userSettings.speed); 

                particlesContainer.style.visibility = 'visible';
                particlesContainer.style.opacity = '1';

            } else {
                // 1. Sembunyikan kontainer
                particlesContainer.style.opacity = '0';

                // 2. RESET STATE ke nilai default
                userSettings = { ...DEFAULT_SETTINGS };

                // 3. RESET UI (Slider & Checkbox) ke nilai default agar tidak 'menipu' saat dinyalakan lagi
                resetParticleUI();

                setTimeout(() => {
                    particlesContainer.style.visibility = 'hidden';
                    particlesContainer.innerHTML = '';
                    if (pJSDom.length > 0) {
                        pJSDom.splice(0, 1);
                    }
                }, 500);
            }
        });
    });
}

function loadParticleMode(modeName) { 
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;

    // Ambil template dari preset
    const modeConfig = JSON.parse(JSON.stringify(particlePresets[modeName] || particlePresets['random']));

    // PAKSA menggunakan nilai dari userSettings
    modeConfig.move.speed = userSettings.speed; 
    modeConfig.number.value = userSettings.count;
    modeConfig.size.random = userSettings.sizeRandom;
    modeConfig.line_linked.enable = userSettings.lineLinked;

    const finalConfig = {
        "particles": modeConfig,
        "retina_detect": false
    };

    if (pJSDom.length > 0) {
        particlesContainer.innerHTML = '';
        pJSDom.splice(0, 1);
    }

    // Jalankan inisialisasi
    particlesJS("particles-js", finalConfig);

    // Re-attach kontrol setelah library selesai render
    setTimeout(() => {
        setupParticleSpeedControls();
        setupParticleCountControls();
        setupParticleFeatureToggles();
    }, 100);
}

function setupParticleModeControls() {
    const allRandomButtons = document.querySelectorAll('.random-btn');
    const allSnowButtons = document.querySelectorAll('.snow-btn');
    const allModeButtons = document.querySelectorAll('.random-btn, .snow-btn');
    let initialMode = 'random';

    function updateActiveModeUI(newMode) {
        allModeButtons.forEach(btn => btn.classList.remove('active-particle'));
        if (newMode === 'random') {
            allRandomButtons.forEach(btn => btn.classList.add('active-particle'));
        } else if (newMode === 'snow') {
            allSnowButtons.forEach(btn => btn.classList.add('active-particle'));
        }
    }

    allModeButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('active-particle')) {
                return;
            }

            const newMode = this.classList.contains('random-btn') ? 'random' : 'snow';
            // let currentSpeed = 5;

            if (typeof pJSDom[0] !== 'undefined') {
                currentSpeed = pJSDom[0].pJS.particles.move.speed;
            }
            loadParticleMode(newMode, userSettings.speed);
            updateActiveModeUI(newMode);
        });
    });

    const initiallyActiveButton = document.querySelector('.random-btn.active-particle') || document.querySelector('.snow-btn.active-particle');
    if (initiallyActiveButton) {
        initialMode = initiallyActiveButton.classList.contains('random-btn') ? 'random' : 'snow';
    } else {
        if (allRandomButtons.length > 0) allRandomButtons[0].classList.add('active-particle');
        initialMode = 'random';
    }

    updateActiveModeUI(initialMode);
    loadParticleMode(initialMode, 5);
}
document.addEventListener('DOMContentLoaded', () => {

    // Inisialisasi particles.js Anda
    // particlesJS("particles-js", {
    //     "particles": {
    //         "number": {
    //             "value": 20,
    //             "density": {
    //                 "enable": true,
    //                 "value_area": 800
    //             }
    //         },
    //         "color": {
    //             "value": "#FEFEFE"
    //         },
    //         "line_linked": {
    //             "enable": true,
    //             "distance": 100,
    //             "color": "#ffffff",
    //             "opacity": 0.5,
    //             "width": 2
    //         },
    //         "shape": {
    //             "type": "circle"
    //         },
    //         "opacity": {
    //             "value": 1.0
    //         },
    //         "size": {
    //             "value": 5,
    //             "random": false
    //         },
    //         "move": {
    //             "enable": true,
    //             "speed": 5,
    //             "direction": "none"
    //         }
    //     },
    //     "retina_detect": false
    // });

    // Panggil fungsi setup toggle
    setupParticleToggle();
    setupParticleModeControls();
    // setupParticleSpeedControls();
});

function updateSliderBackground(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const percent = ((val - min) / (max - min)) * 100;

    let activeColor = '#2ecc71'; // default
    let backgroundColor = '#1e2a3a'; // default

    // Cek konteks slider
    if (slider.closest('.panel-setting-info')) {
        activeColor = '#2ecc71'; // warna untuk panel-setting-info
        backgroundColor = '#1e2a3a';
    } else if (slider.closest('.bloom-indi')) {
        activeColor = '#2ecc71'; // warna untuk card-wrapper
        backgroundColor = '#3b4b5d';
    }

    slider.style.background = `linear-gradient(to right, ${activeColor} ${percent}%, ${backgroundColor} ${percent}%)`;
}

function setupParticleSpeedControls() {
    // 1. Ambil semua slider dengan class 'particle-speed'
    const speedSliders = document.querySelectorAll('.particle-speed');

    // Cek apakah particles.js sudah dimuat dan diinisialisasi
    if (typeof pJSDom[0] === 'undefined' || typeof pJSDom[0].pJS.particles.move === 'undefined') {
        console.error("particles.js belum sepenuhnya siap. Kecepatan partikel tidak dapat dikontrol!");
        return;
    }

    const pJS_move = pJSDom[0].pJS.particles.move;
    // Ambil nilai awal dari particlesJS sebagai Single Source of Truth
    const initialSpeed = pJS_move.speed;

    speedSliders.forEach(slider => {
        // --- INISIALISASI AWAL (Pastikan semua UI menampilkan nilai particlesJS) ---
        slider.value = initialSpeed; // Set nilai slider ke nilai particlesJS
        updateSliderBackground(slider);

        // Ambil elemen display value (particle-value)
        const card = slider.closest('.particle-card');
        const display = card?.querySelector('.particle-value');
        if (display) {
            // Pastikan nilai awal di display sesuai dengan nilai particlesJS
            display.textContent = initialSpeed;
        }
        // ------------------------------------------------------------------------

        // 2. Tambahkan event listener 'input'
        slider.addEventListener('input', e => {
            const newSpeed = parseFloat(e.target.value);
            userSettings.speed = newSpeed;

            // --- PERUBAHAN KECEPATAN particles.js KRUSIAL ---
            pJS_move.speed = newSpeed; // Update particles.js sekali

            // --- SINKRONISASI SLIDER & UI (UNTUK SEMUA SLIDER) ---
            speedSliders.forEach(s => {
                s.value = newSpeed;
                updateSliderBackground(s);

                const otherCard = s.closest('.particle-card');
                const otherDisplay = otherCard?.querySelector('.particle-value');

                if (otherDisplay) {
                    otherDisplay.textContent = newSpeed; // Update semua tampilan nilai!
                }
            });
        });
    });
}

function setupParticleCountControls() {
    // 1. Ambil semua slider dengan class 'particle-count'
    const countSliders = document.querySelectorAll('.particle-count');

    // Cek apakah particles.js sudah siap
    if (typeof pJSDom[0] === 'undefined') {
        return;
    }

    const pJS = pJSDom[0].pJS;
    const initialCount = pJS.particles.number.value;

    countSliders.forEach(slider => {
        // Inisialisasi awal UI berdasarkan nilai partikel saat ini
        slider.value = initialCount;
        updateSliderBackground(slider);

        const card = slider.closest('.particle-card');
        const display = card?.querySelector('.particle-value-count');
        if (display) {
            display.textContent = initialCount;
        }

        // Listener saat slider digeser
        slider.addEventListener('input', e => {
            const newCount = parseInt(e.target.value);
            userSettings.count = newCount;

            // 2. Update nilai di instance particles.js
            pJS.particles.number.value = newCount;
            
            // 3. Panggil density function untuk menerapkan perubahan secara instan
            // Tanpa ini, jumlah partikel tidak akan berubah sampai re-inisialisasi
            if (pJS.fn.particlesRefresh) {
                pJS.fn.particlesRefresh();
                pJS.particles.move.speed = userSettings.speed;
            }

            // 4. Sinkronisasi semua UI Slider & Display
            countSliders.forEach(s => {
                s.value = newCount;
                updateSliderBackground(s);
                
                const otherCard = s.closest('.particle-card');
                const otherDisplay = otherCard?.querySelector('.particle-value-count');
                if (otherDisplay) {
                    otherDisplay.textContent = newCount;
                }
            });
        });
    });
}

function setupParticleFeatureToggles() {
    const sizeRandomToggles = document.querySelectorAll('.cb-size-random');
    const lineLinkedToggles = document.querySelectorAll('.cb-linked-line');

    if (typeof pJSDom[0] === 'undefined') return;
    const pJS = pJSDom[0].pJS;

    // --- SINKRONISASI AWAL (Saat halaman dimuat) ---
    const isSizeRandom = pJS.particles.size.random;
    const isLineLinked = pJS.particles.line_linked.enable;

    sizeRandomToggles.forEach(cb => cb.checked = isSizeRandom);
    lineLinkedToggles.forEach(cb => cb.checked = isLineLinked);

    // --- EVENT LISTENER: RANDOM SIZE ---
    sizeRandomToggles.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const status = this.checked;
            userSettings.sizeRandom = this.checked;
            pJS.particles.size.random = status;
            
            // Sinkronkan semua checkbox dengan class yang sama
            sizeRandomToggles.forEach(cb => cb.checked = status);
            
            // Refresh untuk melihat efeknya
            if (pJS.fn.particlesRefresh) {
                pJS.fn.particlesRefresh();
                pJS.particles.move.speed = userSettings.speed;
            }
        });
    });

    // --- EVENT LISTENER: LINE LINKED ---
    lineLinkedToggles.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const status = this.checked;
            userSettings.lineLinked = this.checked;
            pJS.particles.line_linked.enable = status;
            
            // Sinkronkan semua checkbox dengan class yang sama
            lineLinkedToggles.forEach(cb => cb.checked = status);

            // Refresh untuk merender ulang garis
            if (pJS.fn.particlesRefresh) {
                pJS.fn.particlesRefresh();
                pJS.particles.move.speed = userSettings.speed;
            }
        });
    });
}

function getModeName() {
    const randomBtn = document.querySelector('.random-btn.active-particle');
    if (randomBtn) return 'random';

    const snowBtn = document.querySelector('.snow-btn.active-particle');
    if (snowBtn) return 'snow';

    return 'random'; // Default jika tidak ada yang aktif
}

const particlePresets = {
    // Mode Default/Random (Sesuai dengan kode inisialisasi awal Anda)
    'random': {
        "number": { "value": 20, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FEFEFE" },
        "line_linked": { "enable": true, "distance": 100, "color": "#ffffff", "opacity": 0.5, "width": 2 },
        "shape": { "type": "circle" },
        "opacity": { "value": 1.0 },
        "size": { "value": 5, "random": false },
        "move": { "enable": true, "speed": 5, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
    },
    // Mode Snow (Contoh konfigurasi salju/turun ke bawah)
    'snow': {
        "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FFFFFF" },
        "line_linked": { "enable": false }, // Salju biasanya tidak terhubung
        "shape": { "type": "circle" },
        "opacity": { "value": 0.8, "random": true },
        "size": { "value": 3, "random": true },
        "move": { "enable": true, "speed": 1, "direction": "bottom", "random": true, "straight": false, "out_mode": "out" }
    }
};

function setupParticleToggle() {
    // 1. Ambil semua checkbox dengan class 'animation-particle'
    const animationToggles = document.querySelectorAll('.animation-particle');

    // 2. Ambil elemen WADAH particles.js menggunakan ID
    const particlesContainer = document.getElementById('particles-js');

    if (!particlesContainer) {
        console.error("Wadah dengan ID 'particles-js' tidak ditemukan. Partikel Anda tersesat di dimensi lain!");
        return;
    }

    // Ambil konfigurasi default dari preset (dipakai saat diaktifkan kembali)
    const initialConfig = particlePresets['random'];

    // 3. Tambahkan event listener ke setiap toggle
    animationToggles.forEach(clickedCheckbox => {
        clickedCheckbox.addEventListener('change', function () {

            // --- SINKRONISASI KRUSIAL --- 
            const isChecked = this.checked;

            // Paksa semua toggle (termasuk yang baru diklik) memiliki status yang SAMA
            animationToggles.forEach(otherCheckbox => {
                otherCheckbox.checked = isChecked;
            });

            // --- LOGIKA MENGHEMAT CPU: HANCURKAN/RE-INISIALISASI ---
            if (isChecked) {
                // 1. Dapatkan kecepatan saat ini dari kontrol slider
                let currentSpeed = 5;
                // Kita akan menggunakan nilai dari slider UI jika ada, 
                // karena instance particles.js saat ini sudah dihancurkan
                const speedSlider = document.querySelector('.particle-speed');
                if (speedSlider) {
                    currentSpeed = parseFloat(speedSlider.value);
                }

                // 2. Inisialisasi ulang (membuat partikel baru)
                loadParticleMode(getModeName(), currentSpeed); // Fungsi ini akan membuat ulang partikel

                // 3. Tampilkan kontainer
                particlesContainer.style.visibility = 'visible';
                particlesContainer.style.opacity = '1';

            } else {
                // 1. Sembunyikan dengan fade-out
                particlesContainer.style.opacity = '0';

                // 2. Hancurkan instance setelah fade-out selesai (500ms)
                setTimeout(() => {
                    particlesContainer.style.visibility = 'hidden';

                    // === LOGIKA PENGHEMATAN CPU KRUSIAL ===
                    // Hapus elemen DOM kanvas particles.js
                    particlesContainer.innerHTML = '';
                    // Hapus instance dari array global particles.js (menghentikan perulangan)
                    if (pJSDom.length > 0) {
                        pJSDom.splice(0, 1);
                    }
                    // =====================================

                }, 500);
            }
        });
    });
}

function loadParticleMode(modeName, initialSpeed) {
    // console.log("Memuat mode: " + modeName);
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) {
        console.error("Elemen dengan ID 'particles-js' tidak ditemukan!");
        return;
    }

    // 1. Dapatkan konfigurasi preset
    const modeConfig = particlePresets[modeName] || particlePresets['random'];

    // 2. Buat konfigurasi particlesJS lengkap
    const finalConfig = {
        "particles": modeConfig,
        "retina_detect": false
    };

    // Terapkan kecepatan dari kontrol terakhir jika tersedia
    if (initialSpeed !== undefined) {
        finalConfig.particles.move.speed = initialSpeed;
    }

    // 3. Hapus instance particles.js yang lama (jika ada)
    // Menghapus elemen DOM dan memanggil pJSDom.splice(0, 1) adalah cara yang umum
    // untuk 'menghancurkan' instance particles.js
    if (pJSDom.length > 0) {
        particlesContainer.innerHTML = '';
        pJSDom.splice(0, 1);
    }

    // 4. Inisialisasi ulang particles.js
    particlesJS("particles-js", finalConfig);

    // **Penundaan Krusial**: Beri waktu sebentar agar pJSDom terisi dengan instance baru
    // sebelum kita mencoba mengaksesnya di setupParticleSpeedControls.
    setTimeout(setupParticleSpeedControls, 100);
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
            let currentSpeed = 5;

            if (typeof pJSDom[0] !== 'undefined') {
                currentSpeed = pJSDom[0].pJS.particles.move.speed;
            }
            loadParticleMode(newMode, currentSpeed);
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
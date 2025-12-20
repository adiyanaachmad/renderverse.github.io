// Menambahkan animasi pada tombol
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('animate');
    void btn.offsetWidth;  // Memicu reflow untuk animasi
    btn.classList.add('animate');
  });
});

document.querySelectorAll('.set-jut').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('animate');
    void btn.offsetWidth;  // Memicu reflow untuk animasi
    btn.classList.add('animate');
  });
});


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
gainNode.gain.value = 5.0;

gainNode.connect(audioContext.destination);

// 4. Memuat file suara
const clickSound = new Audio('sounds/684505__saha213131__click.mp3');
clickSound.crossOrigin = "anonymous";

let source;
clickSound.addEventListener('canplaythrough', () => {
  source = audioContext.createMediaElementSource(clickSound);
  source.connect(gainNode);
});

function playSoundEffect() {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  clickSound.currentTime = 0;
  clickSound.play().catch(error => {
    console.error('Gagal memutar sound:', error);
  });
}

const soundElements = document.querySelectorAll('.sound-init');
soundElements.forEach(element => {
  element.addEventListener('click', () => {
    playSoundEffect();
  });
});

// Mengambil elemen tombol maximize
const maximizeBtn = document.getElementById("maximize");
const icon = maximizeBtn.querySelector("i");

// Fungsi untuk masuk dan keluar dari fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // Masuk fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }

    // Mengubah ikon dan menambahkan class active
    icon.classList.remove("fa-arrows-maximize");
    icon.classList.add("fa-arrows-minimize");  // Ganti ke fa-arrows-minimize
    maximizeBtn.classList.add("active-maximize");
  } else {
    // Keluar fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }

    // Mengubah ikon dan menghapus class active
    icon.classList.remove("fa-arrows-minimize");
    icon.classList.add("fa-arrows-maximize");  // Kembali ke fa-arrows-maximize
    maximizeBtn.classList.remove("active-maximize");
  }
}

// Menambahkan event listener untuk tombol maximize
maximizeBtn.addEventListener("click", toggleFullscreen);


const setgToggle = document.getElementById('setg-toggle');
const setgContainer = document.getElementById('setpi');
const cardBottomContainer = document.querySelector('.card-object-r');
const toggleIcon = document.getElementById('toggle-icon');

setgToggle.addEventListener('click', function () {
  // Toggle visibility of setg-container
  setgContainer.classList.toggle('active');

  // Toggle visibility of card-bottom-container
  if (setgContainer.classList.contains('active')) {
    cardBottomContainer.style.display = 'none';  // Hide the card-bottom-container
    toggleIcon.classList.remove('fa-gear');      // Remove the gear icon
    toggleIcon.classList.add('fa-times');        // Add the close icon
  } else {
    cardBottomContainer.style.display = 'flex'; // Show the card-bottom-container
    toggleIcon.classList.remove('fa-times');     // Remove the close icon
    toggleIcon.classList.add('fa-gear');          // Add the gear icon
  }
});

const setAdsl = document.getElementById('set-adsl');
const adsContainer = document.getElementById('ads-allk');
const adsBottomContainer = document.querySelector('.ads-container');
const toggleIconAds = document.getElementById('toggle-icon-ads');

setAdsl.addEventListener('click', function () {
  // Toggle visibility of setg-container
  adsContainer.classList.toggle('active');

  // Toggle visibility of card-bottom-container
  if (adsContainer.classList.contains('active')) {
    adsBottomContainer.style.display = 'none';  
    toggleIconAds.classList.remove('fa-circle-bolt');     
    toggleIconAds.classList.add('fa-circle-xmark');        
  } else {
    adsBottomContainer.style.display = 'flex'; 
    toggleIconAds.classList.remove('fa-circle-xmark');    
    toggleIconAds.classList.add('fa-circle-bolt');          
  }
});

// Mendapatkan elemen tombol minimize dan container minimize-des
const minimizeButton = document.getElementById('minimize-ads');
const minimizeContainer = document.querySelector('.minimize-des');
const minimizeIcon = document.getElementById('btn-minim');

// Menambahkan event listener pada tombol minimize
minimizeButton.addEventListener('click', function () {
  // Mengecek apakah container minimize-des memiliki kelas 'hidden'
  if (minimizeContainer.classList.contains('hidden')) {
    // Jika sudah tersembunyi, tampilkan dan ubah ikon<i class="fa-duotone fa-solid fa-arrows-maximize"></i>
    minimizeContainer.classList.remove('hidden');
    minimizeIcon.classList.remove('fa-arrow-down-left-and-arrow-up-right-to-center');
    minimizeIcon.classList.add('fa-arrows-maximize');
  } else {
    // Jika terlihat, sembunyikan dan ubah ikon
    minimizeContainer.classList.add('hidden');
    minimizeIcon.classList.remove('fa-arrows-maximize');
    minimizeIcon.classList.add('fa-arrow-down-left-and-arrow-up-right-to-center');
  }
});


const btn = document.getElementById('set-des');
const bottomSelect = document.querySelector('.bottom-select');
const btnIcon = document.getElementById('btn-icon');

let isOpen = false;  // Menandakan apakah bottom-select sudah terbuka atau belum

btn.addEventListener('click', function() {
    if (isOpen) {
        // Kembalikan posisi bottom ke 90px dan sembunyikan bottom-select
        bottomSelect.style.bottom = '90px';
        btnIcon.classList.remove('rotated');
    } else {
        // Ubah posisi bottom menjadi 20px dan tampilkan bottom-select
        bottomSelect.style.bottom = '10px';
        bottomSelect.style.borderRadius = '10px';
        btnIcon.classList.add('rotated');
    }

    // Toggle status
    isOpen = !isOpen;
});
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('animate');
    void btn.offsetWidth;
    btn.classList.add('animate');
  });
});

document.querySelectorAll('.set-jut').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('animate');
    void btn.offsetWidth;
    btn.classList.add('animate');
  });
});

const clickSound = new Audio('sounds/minecraft_click.mp3');
clickSound.volume = 1.0;

clickSound.load();

function playSoundEffect() {
  clickSound.currentTime = 0; 
  clickSound.play().catch(error => {
    console.error('Gagal memutar sound:', error);
  });
}

const soundElements = document.querySelectorAll('.sound-init');
soundElements.forEach(element => {
  element.addEventListener('click', playSoundEffect);
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

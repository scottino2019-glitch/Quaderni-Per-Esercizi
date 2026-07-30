// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] ServiceWorker registration failed:', err);
      });
  });
}

let deferredPrompt = null;

// Capture beforeinstallprompt event (Chrome, Edge, Android)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] beforeinstallprompt event captured');
});

// Hide banner if already installed/running in standalone mode
window.addEventListener('DOMContentLoaded', () => {
  const pwaBanner = document.getElementById('pwa-install-banner');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (isStandalone && pwaBanner) {
    pwaBanner.style.display = 'none';
  }
});

// Primary install trigger function
function installPwaApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User installed the app');
        closePwaBanner();
      }
      deferredPrompt = null;
    });
  } else {
    // If prompt is not directly available, show instructions modal
    showPwaInstructionsModal();
  }
}

function showPwaInstructionsModal() {
  const modal = document.getElementById('pwa-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closePwaModal() {
  const modal = document.getElementById('pwa-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function closePwaBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App successfully installed');
  closePwaBanner();
});

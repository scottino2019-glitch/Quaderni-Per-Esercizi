// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] ServiceWorker registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] ServiceWorker registration failed:', err);
      });
  });
}

// Handle PWA Installation Banner
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome automatic prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  console.log('[PWA] Captured beforeinstallprompt event');
});

function installPwaApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        closePwaBanner();
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    // If beforeinstallprompt hasn't fired (e.g. inside an iframe preview or on iOS), open guidance modal
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

function openInNewTab() {
  window.open(window.location.href, '_blank');
}

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  closePwaBanner();
});


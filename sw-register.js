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

const isInIframe = window.self !== window.top;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome automatic prompt
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] Captured beforeinstallprompt event');

  // If we get beforeinstallprompt, update banner button state if present
  const btnText = document.getElementById('pwa-btn-text');
  if (btnText) {
    btnText.textContent = 'Installa App 📱';
  }
});

// Update UI on load depending on iframe vs top window
window.addEventListener('DOMContentLoaded', () => {
  const iframeNotice = document.getElementById('pwa-iframe-notice');
  const standaloneNotice = document.getElementById('pwa-standalone-notice');
  const pwaBanner = document.getElementById('pwa-install-banner');

  if (isInIframe) {
    if (iframeNotice) iframeNotice.classList.remove('hidden');
    if (standaloneNotice) standaloneNotice.classList.add('hidden');
  } else {
    if (iframeNotice) iframeNotice.classList.add('hidden');
    if (standaloneNotice) standaloneNotice.classList.remove('hidden');
  }

  // Check if already running as installed PWA (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    if (pwaBanner) pwaBanner.style.display = 'none';
  }
});

function installPwaApp() {
  if (isInIframe) {
    // Inside iframe preview, browsers block install prompts & browser menu installation.
    // Open in new tab so browser allows PWA installation!
    window.open(window.location.href, '_blank');
    return;
  }

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
    // If beforeinstallprompt hasn't fired yet or iOS Safari, show step-by-step modal
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


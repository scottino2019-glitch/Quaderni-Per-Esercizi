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

let deferredPrompt = null;
const isInIframe = window.self !== window.top;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] Captured beforeinstallprompt event');

  const installBtn = document.getElementById('pwa-direct-install-btn');
  if (installBtn) {
    installBtn.classList.remove('hidden');
  }
});

// Update UI on load
window.addEventListener('DOMContentLoaded', () => {
  const currentUrl = window.location.href;

  // Set links to current URL for target="_blank"
  const tabLinks = document.querySelectorAll('.pwa-tab-link');
  tabLinks.forEach(link => {
    link.href = currentUrl;
  });

  const urlInput = document.getElementById('pwa-url-input');
  if (urlInput) {
    urlInput.value = currentUrl;
  }

  const iframeNotice = document.getElementById('pwa-iframe-notice');
  const standaloneNotice = document.getElementById('pwa-standalone-notice');
  const openTabContainer = document.getElementById('pwa-open-tab-container');
  const installBtnContainer = document.getElementById('pwa-install-btn-container');

  if (isInIframe) {
    if (iframeNotice) iframeNotice.classList.remove('hidden');
    if (standaloneNotice) standaloneNotice.classList.add('hidden');
    if (openTabContainer) openTabContainer.classList.remove('hidden');
    if (installBtnContainer) installBtnContainer.classList.add('hidden');
  } else {
    if (iframeNotice) iframeNotice.classList.add('hidden');
    if (standaloneNotice) standaloneNotice.classList.remove('hidden');
    if (openTabContainer) openTabContainer.classList.add('hidden');
    if (installBtnContainer) installBtnContainer.classList.remove('hidden');
  }

  // Check if running in standalone mode (already installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'none';
  }
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted prompt');
        closePwaBanner();
      }
      deferredPrompt = null;
    });
  } else {
    showPwaInstructionsModal();
  }
}

function copyAppUrl() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    const copyText = document.getElementById('pwa-copy-btn-text');
    if (copyText) {
      const old = copyText.textContent;
      copyText.textContent = 'Copiato! ✅';
      setTimeout(() => { copyText.textContent = old; }, 2000);
    }
  }).catch(() => {
    alert('Copia questo link: ' + currentUrl);
  });
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
  closePwaBanner();
});


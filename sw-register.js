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
const isInIframe = window.self !== window.top;

// Capture beforeinstallprompt event (Chrome, Edge, Android)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] beforeinstallprompt event captured');

  // Highlight install button if available
  const installBtn = document.getElementById('pwa-direct-install-btn');
  if (installBtn) {
    installBtn.classList.remove('bg-gray-200', 'text-gray-700');
    installBtn.classList.add('bg-emerald-400', 'text-blue-950', 'animate-pulse');
  }
});

// Setup page state on load
window.addEventListener('DOMContentLoaded', () => {
  const pwaBanner = document.getElementById('pwa-install-banner');
  const iframeNotice = document.getElementById('pwa-iframe-notice');
  const topNotice = document.getElementById('pwa-top-notice');
  const openTabBtn = document.getElementById('pwa-open-tab-btn');
  const installBtn = document.getElementById('pwa-install-btn');

  // Check if already running in standalone PWA mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (isStandalone && pwaBanner) {
    pwaBanner.style.display = 'none';
    return;
  }

  if (isInIframe) {
    if (iframeNotice) iframeNotice.classList.remove('hidden');
    if (topNotice) topNotice.classList.add('hidden');
    if (openTabBtn) openTabBtn.classList.remove('hidden');
    if (installBtn) installBtn.classList.add('hidden');
  } else {
    if (iframeNotice) iframeNotice.classList.add('hidden');
    if (topNotice) topNotice.classList.remove('hidden');
    if (openTabBtn) openTabBtn.classList.add('hidden');
    if (installBtn) installBtn.classList.remove('hidden');
  }
});

// Single function to open app in a fixed named window (reuses existing tab, prevents opening multiple tabs)
function openAppInSingleTab() {
  window.open(window.location.href, 'LaboratorioLinguisticoPWAApp');
}

// Function called when clicking 'Installa App'
function triggerPwaInstall() {
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
    // If prompt is not directly available (e.g., iOS Safari, Firefox, or beforeinstallprompt pending)
    showPwaInstructionsModal();
  }
}

function copyAppUrl() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    const btn = document.getElementById('pwa-copy-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Copiato! ✅';
      setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    }
  }).catch(() => {
    alert('Link dell\'app: ' + currentUrl);
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
  console.log('[PWA] App successfully installed');
  closePwaBanner();
});

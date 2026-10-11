let deferredPrompt = null;

// Catch PWA Install Prompt for Android/Chrome
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA Install Prompt captured!');
});

function handleAppDownload() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    // Check if mobileconfig profile exists or show Safari Add to Home screen instructions
    if (confirm("iOS Installation:\n\nTo install the Pepsi app on iPhone:\n1. Tap the Share button in Safari\n2. Scroll down and tap 'Add to Home Screen'\n\nWould you like to download the iOS configuration profile instead?")) {
      window.location.href = "pepsi.mobileconfig";
    }
  } else if (deferredPrompt) {
    // Show Chrome / Android Native Install Prompt
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted app install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    // Fallback if browser doesn't support PWA prompt or already installed
    alert("To install Pepsi App:\n\n1. Open browser menu (⋮ or Share)\n2. Select 'Install App' or 'Add to Home screen'");
  }
}
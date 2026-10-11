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
    // Direct iOS Configuration Profile Installation Flow
    alert("iOS Installation Instructions:\n\n1. Tap 'Allow' when Safari prompts to download the profile.\n2. Open your iPhone 'Settings'.\n3. Tap 'Profile Downloaded' near the top.\n4. Tap 'Install' and enter your device passcode to confirm.");
    
    // Trigger download of the mobileconfig profile
    window.location.href = "profile.mobileconfig";
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
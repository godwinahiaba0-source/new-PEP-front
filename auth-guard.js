/**
 * Auth Guard & Centralized Request Helper
 */

// Helper to check for token with key fallbacks
function getToken() {
  return localStorage.getItem('userToken') || localStorage.getItem('token');
}

// Helper to purge all tokens from client storage
function clearTokens() {
  localStorage.removeItem('userToken');
  localStorage.removeItem('token');
  sessionStorage.clear();
}

(function checkAuth() {
  const token = getToken();
  const currentPath = window.location.pathname;

  // Pages that DO NOT require authentication
  const publicPages = ['auth.html', 'login.html', 'register.html', 'welcome.html'];
  const isPublicPage = publicPages.some(page => currentPath.endsWith(page));

  // 1. Redirect unauthenticated users trying to access protected pages
  if (!token && !isPublicPage) {
    clearTokens();
    window.location.href = 'welcome.html';
    return;
  }

  // 2. Redirect authenticated users away from login/auth pages to home/dashboard
  if (token && isPublicPage) {
    window.location.href = 'me.html';
  }
})();

// Re-verify auth when user navigates using browser Back/Forward buttons (Cache Fallback)
window.addEventListener('pageshow', (event) => {
  const token = getToken();
  const currentPath = window.location.pathname;
  const publicPages = ['auth.html', 'login.html', 'register.html', 'welcome.html'];
  const isPublicPage = publicPages.some(page => currentPath.endsWith(page));

  if (!token && !isPublicPage) {
    clearTokens();
    window.location.href = 'welcome.html';
  }
});

/**
 * Global helper for authenticated API requests
 * Automatically attaches Authorization headers and handles 401/403 responses
 */
async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Handle expired, invalid, or forbidden tokens automatically
    if (response.status === 401 || response.status === 403) {
      clearTokens();
      if (typeof showToast === 'function') {
        showToast('Session expired. Please log in again.', 'error');
      }
      setTimeout(() => {
        window.location.href = 'welcome.html';
      }, 1000);
      return null;
    }

    return response;
  } catch (error) {
    console.error('Fetch Auth Error:', error);
    throw error;
  }
}

/**
 * Global Logout Helper
 */
function logoutUser() {
  clearTokens();
  if (typeof showToast === 'function') {
    showToast('Logged out successfully', 'info');
  }
  setTimeout(() => {
    window.location.href = 'welcome.html';
  }, 800);
}

/**
 * Helper to manage button loading states
 */
function setButtonLoading(button, isLoading, loadingText = 'Processing...') {
  const btn = typeof button === 'string' ? document.querySelector(button) : button;
  if (!btn) return;

  if (isLoading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = loadingText;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'not-allowed';
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
}
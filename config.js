// Centralized API configuration and storage access helpers

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:8080"
  : "https://pep-back-production.up.railway.app";

/**
 * Fallback token getter to safely handle key mismatches across logins
 */
function getAuthToken() {
  return localStorage.getItem('userToken') || localStorage.getItem('token') || '';
}

/**
 * Centralized session wiper for logout and expired session fallbacks
 */
function clearAuthSession() {
  localStorage.removeItem('userToken');
  localStorage.removeItem('token');
  sessionStorage.clear();
}

// ==========================================
// INSTANT 0-DELAY PAGE TRANSITION ENGINE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const pageCache = {};
  const navPages = ['home.html', 'invite.html', 'device.html', 'profit.html', 'me.html'];

  // 1. Silently pre-cache core navigation pages in the background right after load
  navPages.forEach(page => {
    if (window.location.pathname.indexOf(page) === -1) {
      fetch(page)
        .then(res => res.text())
        .then(html => { pageCache[page] = html; })
        .catch(() => {});
    }
  });

  // 2. Intercept bottom navigation clicks for instant zero-delay swapping with styles
  document.querySelectorAll('.bottom-nav .nav-item').forEach(link => {
    link.addEventListener('click', async (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      e.preventDefault();

      // Update active state on tabs instantly
      document.querySelectorAll('.bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
      link.classList.add('active');

      let htmlContent = pageCache[href];

      // If not cached yet, fetch it immediately
      if (!htmlContent) {
        try {
          const res = await fetch(href);
          htmlContent = await res.text();
          pageCache[href] = htmlContent;
        } catch (err) {
          window.location.href = href;
          return;
        }
      }

      // Parse the incoming HTML document completely
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const newContainer = doc.querySelector('.app-container') || doc.body;
      const currentContainer = document.querySelector('.app-container');

      if (currentContainer && newContainer) {
        // Swap out the visual container content
        currentContainer.innerHTML = newContainer.innerHTML;
        window.history.pushState({ path: href }, '', href);

        // Extract and inject any page-specific <style> tags so formatting doesn't break
        document.querySelectorAll('style[data-dynamic-page-style]').forEach(s => s.remove());
        doc.querySelectorAll('style').forEach(styleTag => {
          const newStyle = document.createElement('style');
          newStyle.setAttribute('data-dynamic-page-style', 'true');
          newStyle.textContent = styleTag.textContent;
          document.head.appendChild(newStyle);
        });
        
        // Also ensure page title updates matching the tab
        if (doc.title) {
          document.title = doc.title;
        }

        // Re-run any scripts embedded inside the loaded view
        currentContainer.querySelectorAll('script').forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
          script.remove();
        });
      } else {
        window.location.href = href;
      }
    });
  });
});
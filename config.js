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
  const navPages = ['home.html', 'invite.html', 'device.html', 'profit.html', 'me.html', 'yf-life fund.html'];

  // 1. Immediately pre-cache ALL navigation pages in the background on startup
  navPages.forEach(page => {
    fetch(page)
      .then(res => res.text())
      .then(html => { pageCache[page] = html; })
      .catch(() => {});
  });

  // Helper function to render page content instantly
  function renderPageContent(htmlContent, href) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const newContainer = doc.querySelector('.app-container') || doc.body;
    const currentContainer = document.querySelector('.app-container');

    if (currentContainer && newContainer) {
      currentContainer.innerHTML = newContainer.innerHTML;
      window.history.pushState({ path: href }, '', href);

      // Inject page-specific styles
      document.querySelectorAll('style[data-dynamic-page-style]').forEach(s => s.remove());
      doc.querySelectorAll('style').forEach(styleTag => {
        const newStyle = document.createElement('style');
        newStyle.setAttribute('data-dynamic-page-style', 'true');
        newStyle.textContent = styleTag.textContent;
        document.head.appendChild(newStyle);
      });
      
      if (doc.title) {
        document.title = doc.title;
      }

      // Re-run scripts embedded inside the loaded view
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
  }

  // 2. Intercept bottom navigation clicks for instant single-tap rendering
  document.querySelectorAll('.bottom-nav .nav-item').forEach(link => {
    link.addEventListener('click', async (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      e.preventDefault();

      // Update active tab styling instantly
      document.querySelectorAll('.bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
      link.classList.add('active');

      let htmlContent = pageCache[href];

      // If cached, render instantly on the first click
      if (htmlContent) {
        renderPageContent(htmlContent, href);
      } else {
        // Fallback: If not cached yet, fetch it right now and render immediately
        try {
          const res = await fetch(href);
          htmlContent = await res.text();
          pageCache[href] = htmlContent;
          renderPageContent(htmlContent, href);
        } catch (err) {
          window.location.href = href;
        }
      }
    });
  });
});
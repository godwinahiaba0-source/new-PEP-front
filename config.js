// Centralized API configuration and storage access helpers

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:8080"
  : "pep-back-production.up.railway.app";

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
// toast.js - Custom popup notifications

function showToast(message, type = 'info') {
  // Check if container exists, else create it
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  // Define colors based on notification type
  const colors = {
    success: '#10B981', // Green
    error: '#EF4444',   // Red
    info: '#3B82F6'     // Blue
  };

  // Create toast item
  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: ${colors[type] || colors.info};
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  `;
  toast.innerText = message;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
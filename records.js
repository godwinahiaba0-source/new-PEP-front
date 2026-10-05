document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve token stored during login
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");

  if (!token) {
    // Redirect unauthenticated users back to login
    window.location.href = "welcome.html";
    return;
  }

  // Fetch and display user profile records
  await fetchUserProfile(token);

  // Fetch and display transaction records (if container exists on the page)
  if (document.getElementById("transaction-list")) {
    await fetchTransactionHistory(token);
  }
});

/**
 * Fetches user profile data from backend API
 */
async function fetchUserProfile(token) {
  try {
    const baseUrl = typeof API_BASE_URL !== "undefined" ? API_BASE_URL : "";
    const response = await fetch(`https://pep-back-production.up.railway.app/api/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Update UI elements if present
      const phoneElem = document.getElementById("user-phone");
      const balanceElem = document.getElementById("user-balance");

      if (phoneElem) phoneElem.textContent = data.user.phone || "N/A";
      if (balanceElem) balanceElem.textContent = `$${parseFloat(data.user.balance || 0).toFixed(2)}`;

      // Update cached user data
      localStorage.setItem("userData", JSON.stringify(data.user));
    } else {
      console.warn("Failed to fetch profile:", data.message);
    }
  } catch (error) {
    console.error("Profile Fetch Error:", error);
  }
}

/**
 * Fetches transaction history records from backend API
 */
async function fetchTransactionHistory(token) {
  const container = document.getElementById("transaction-list");

  try {
    const baseUrl = typeof API_BASE_URL !== "undefined" ? API_BASE_URL : "";
    const response = await fetch(`https://pep-back-production.up.railway.app/api/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.success && Array.isArray(data.transactions)) {
      if (data.transactions.length === 0) {
        container.innerHTML = `<p class="no-records">No transaction records found.</p>`;
        return;
      }

      container.innerHTML = data.transactions.map(item => `
        <div class="record-card ${item.type}">
          <div class="record-info">
            <span class="record-type">${item.type.toUpperCase()}</span>
            <span class="record-date">${new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="record-amount ${item.type === 'deposit' ? 'positive' : 'negative'}">
            ${item.type === 'deposit' ? '+' : '-'}$${Math.abs(item.amount).toFixed(2)}
          </div>
        </div>
      `).join("");
    } else {
      container.innerHTML = `<p class="error-msg">Failed to load history.</p>`;
    }
  } catch (error) {
    console.error("Transactions Fetch Error:", error);
    container.innerHTML = `<p class="error-msg">Server error fetching records.</p>`;
  }
}
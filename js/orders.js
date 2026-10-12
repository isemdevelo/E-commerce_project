// ===== orders.js =====
// Displays order history and keeps the header cart count in sync.

// Load cart safely (for header count)
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (e) {
  cart = [];
}

// ===== Header cart count =====
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// ===== Display orders =====
function displayOrders() {
  const container = document.getElementById("order-history");
  if (!container) return;

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
  } catch (e) {
    orders = [];
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <p class="empty-orders">
        No past orders found. <a href="index.html">Start shopping</a>.
      </p>`;
    return;
  }

  container.innerHTML = "";

  // Show latest first (non-mutating)
  [...orders].reverse().forEach(order => {
    const div = document.createElement("div");
    div.classList.add("order-card");

    const itemsHtml = (order.items || []).map(item => {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      return `${item.name} × ${item.quantity} ($${lineTotal})`;
    }).join("<br>");

    const total = Number(order.total || 0).toFixed(2);
    const shortId = String(order.id).slice(-6);

    div.innerHTML = `
      <div><strong>Order #${shortId}</strong> — ${order.date || ""}</div>
      <div class="order-items">${itemsHtml}</div>
      <div><strong>Total: $${total}</strong></div>
    `;
    container.appendChild(div);
  });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayOrders();
});
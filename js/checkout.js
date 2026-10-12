// ===== checkout.js =====
// Handles the checkout page: display items, totals, and placing an order.

const TAX_RATE = 0.10;

// Load cart safely
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

// ===== Display items on checkout page =====
function displayCheckoutItems() {
  const container = document.getElementById("checkout-items");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    container.appendChild(div);
  });
}

// ===== Totals =====
function calculateCheckout() {
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (!subtotalEl || !taxEl || !totalEl) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = "$" + subtotal.toFixed(2);
  taxEl.textContent = "$" + tax.toFixed(2);
  totalEl.textContent = "$" + total.toFixed(2);
}

// ===== Place order =====
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Capture shipping info
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !address) {
    alert("Please fill in all shipping fields.");
    return;
  }

  // Prevent double submission
  const submitBtn = document.querySelector("#checkout-form button[type='submit']");
  if (submitBtn) submitBtn.disabled = true;

  // Load existing orders safely
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
  } catch (e) {
    orders = [];
  }

  // Build totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Create new order
  const newOrder = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    customer: { name, email, address },
    items: cart,
    subtotal,
    tax,
    total
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.setItem("cart", JSON.stringify([]));

  // Show thank-you, hide form + items
  const thankYou = document.getElementById("thank-you");
  const form = document.getElementById("checkout-form");
  const items = document.getElementById("checkout-items");
  const summary = document.querySelector(".checkout-summary");
  const links = document.querySelector(".checkout-links");

  if (thankYou) thankYou.style.display = "block";
  if (form) form.style.display = "none";
  if (items) items.style.display = "none";
  if (summary) summary.style.display = "none";
  if (links) links.style.display = "none";

  // Redirect after a short pause
  setTimeout(() => {
    window.location.href = "orders.html";
  }, 1800);
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCheckoutItems();
  calculateCheckout();

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      placeOrder();
    });
  }
});
// ===== script.js =====
// Main cart logic used on index.html and cart.html

const TAX_RATE = 0.10;

// Load cart from localStorage (safe)
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (e) {
  cart = [];
}

// ===== Header count =====
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) cartCountElement.textContent = count;
}

// ===== Persistence =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== Toast =====
function showAddedMessage(productName) {
  // Remove any existing toast so they don't stack
  const existing = document.querySelector(".added-message");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.className = "added-message";
  msg.textContent = `${productName} added to cart!`;
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.classList.add("fade-out");
    setTimeout(() => msg.remove(), 400);
  }, 1200);
}

// ===== Add to cart =====
function addToCart(id, name, price, imgSrc) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      name,
      price: Number(price),
      quantity: 1,
      image: imgSrc   // 👈 renamed from "img" → "image" to match checkout.js
    });
  }
  saveCart();
  updateCartCount();
  showAddedMessage(name);
}

// ===== Display cart (cart.html) =====
function displayCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const taxEl = document.getElementById("cart-tax");
  const totalEl = document.getElementById("cart-total");

  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (taxEl) taxEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
      <div class="quantity-controls">
        <button onclick="changeQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
      <span>$${itemTotal.toFixed(2)}</span>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove" aria-label="Remove ${item.name}">×</button>
    `;
    cartContainer.appendChild(div);
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(2);
  if (taxEl) taxEl.textContent = "$" + tax.toFixed(2);
  if (totalEl) totalEl.textContent = "$" + total.toFixed(2);
}

// ===== Quantity (now by id, not index) =====
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  saveCart();
  displayCartItems();
  updateCartCount();
}

// ===== Remove (now by id) =====
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  displayCartItems();
  updateCartCount();
}

// ===== Clear =====
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    saveCart();
    displayCartItems();
    updateCartCount();
  }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCartItems();

  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }
});

// ❌ placeOrder() REMOVED — it lives in checkout.js only
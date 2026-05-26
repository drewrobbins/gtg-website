/**
 * Emerald Coast Gourmet To Go — Cart Engine
 * localStorage-based cart, works with any page on the site.
 */

const CART_KEY = 'ecgtg_cart';
const DELIVERY_FEE = 20;
const DELIVERY_FREE_THRESHOLD = 200;
const MIN_ORDER = 100;

/* ── Core Storage ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  dispatchCartEvent();
}

/* ── Mutations ── */
function addToCart(id, name, price, tier, imageUrl) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, tier, imageUrl: imageUrl || '', qty: 1 });
  }
  saveCart(cart);
  showAddedFeedback(id);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (qty <= 0) { removeFromCart(id); return; }
  item.qty = qty;
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  dispatchCartEvent();
}

/* ── Calculations ── */
function getSubtotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function getDeliveryFee(method) {
  if (method !== 'delivery') return 0;
  const sub = getSubtotal();
  if (sub >= DELIVERY_FREE_THRESHOLD) return 0;
  if (sub >= MIN_ORDER) return DELIVERY_FEE;
  return DELIVERY_FEE; // still show it even if under min
}
function getTotal(method) {
  return getSubtotal() + getDeliveryFee(method);
}
function getItemCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}
function meetsMinOrder() {
  return getSubtotal() >= MIN_ORDER;
}

/* ── UI Helpers ── */
function updateCartBadge() {
  const count = getItemCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('.cart-btn-text').forEach(el => {
    el.textContent = count > 0 ? `Cart (${count})` : 'Cart';
  });
}

function showAddedFeedback(id) {
  const btn = document.querySelector(`[data-item-id="${id}"] .add-to-cart-btn`);
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('added'); }, 1500);
}

function dispatchCartEvent() {
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: getCart() } }));
}

/* ── Minimum order date (48 hr lead time) ── */
function getMinOrderDate() {
  const d = new Date();
  d.setHours(d.getHours() + 48);
  // Round up to next available business day slot
  const day = d.getDay(); // 0=Sun, 6=Sat
  if (day === 0) d.setDate(d.getDate() + 1); // skip Sunday → Mon
  // Format as YYYY-MM-DD
  return d.toISOString().split('T')[0];
}

/* ── Order summary for form submission ── */
function buildOrderSummary(method) {
  const cart = getCart();
  const lines = cart.map(i => `${i.qty}x ${i.name} @ $${i.price} = $${(i.price * i.qty).toFixed(2)}`);
  lines.push('---');
  lines.push(`Subtotal: $${getSubtotal().toFixed(2)}`);
  if (method === 'delivery') {
    const fee = getDeliveryFee(method);
    lines.push(`Delivery fee: ${fee === 0 ? 'FREE' : '$' + fee.toFixed(2)}`);
  }
  lines.push(`TOTAL: $${getTotal(method).toFixed(2)}`);
  return lines.join('\n');
}

/* ── Init: run on every page ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

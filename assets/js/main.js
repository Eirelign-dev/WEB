(function () {
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');

  if (header && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => header.classList.toggle('compact', !e.isIntersecting));
    }, { threshold: 0.2 });
    io.observe(hero);
  } else if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('compact', window.scrollY > 40);
    });
  }

  // Active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });

  // Cart utilities
  function readCart() {
    try { return JSON.parse(localStorage.getItem('eirelign_cart') || '[]'); }
    catch { return []; }
  }
  function writeCart(items) { localStorage.setItem('eirelign_cart', JSON.stringify(items)); }
  function updateCartBadge() {
    const b = document.querySelector('[data-cart-count]');
    if (b) b.textContent = readCart().length;
  }

  // Accessible toast via aria-live region
  let live = document.getElementById('live-region');
  if (!live) {
    live = document.createElement('div');
    live.id = 'live-region';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.style.position = 'fixed';
    live.style.right = '14px';
    live.style.bottom = '14px';
    live.style.zIndex = '2000';
    document.body.appendChild(live);
  }
  function notify(msg) {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.background = '#111';
    n.style.color = '#fff';
    n.style.padding = '10px 14px';
    n.style.borderRadius = '10px';
    n.style.marginTop = '6px';
    live.appendChild(n);
    setTimeout(() => n.remove(), 1600);
  }

  function addToCart(item) {
    const items = readCart();
    items.push(item);
    writeCart(items);
    notify(`${item.name} added to cart`);
    updateCartBadge();
  }
  function clearCart() { writeCart([]); updateCartBadge(); }

  window.EirelignCart = { readCart, writeCart, addToCart, clearCart, updateCartBadge };
  updateCartBadge();
})();


// Mini Cart Preview Logic
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-add');
  const miniCart = document.getElementById('mini-cart');
  const miniCartItems = document.getElementById('mini-cart-items');
  if (!btn || !miniCart) return;



    const items = window.EirelignCart.readCart();
    const grouped = {};
    items.forEach(it => {
      const key = it.sku || it.name;
      if (!grouped[key]) grouped[key] = { ...it, qty: 0 };
      grouped[key].qty += 1;
    });

    miniCartItems.innerHTML = Object.values(grouped)
      .map(it => `<li>${it.name} × ${it.qty} — €${it.price.toFixed(2)}</li>`)
      .join('');

    miniCart.style.display = 'block';
    setTimeout(() => { miniCart.style.display = 'none'; }, 3000);
  });
});


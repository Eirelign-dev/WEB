(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const tbody = $('#cart-body');
  const subtotalEl = $('#subtotal');
  const emptyEl = $('#cart-empty');
  const filledEl = $('#cart-filled');

  const fmt = n => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n);
  const keyOf = (item) => {
    const opts = item.options ? JSON.stringify(item.options) : '';
    return `${item.sku || item.name}::${opts}`;
  };

  function group(items) {
    const m = new Map();
    items.forEach(it => {
      const k = keyOf(it);
      const e = m.get(k) || { item: it, qty: 0 };
      e.qty++;
      m.set(k, e);
    });
    return [...m.values()];
  }

  function render() {
    const items = window.EirelignCart.readCart();
    if (!items.length) {
      emptyEl.style.display = 'block';
      filledEl.style.display = 'none';
      window.EirelignCart.updateCartBadge();
      return;
    }
    emptyEl.style.display = 'none';
    filledEl.style.display = 'block';
    tbody.innerHTML = '';

    let subtotal = 0;
    group(items).forEach(({ item, qty }) => {
      const opts = item.options || {};
      const optsText = [
        opts.primary ? `Primary: ${opts.primary}` : '',
        opts.accent ? `Accent: ${opts.accent}` : '',
        opts.pattern ? `Pattern: ${opts.pattern}` : '',
        opts.finish ? `Finish: ${opts.finish}` : '',
        opts.engraving ? `Engraving: ${opts.engraving}` : ''
      ].filter(Boolean).join(' · ');

      const line = item.price * qty;
      subtotal += line;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div><strong>${item.name}</strong></div>
          <div class="meta">${item.sku ? `SKU: ${item.sku}` : ''}${optsText ? ` — ${optsText}` : ''}</div>
        </td>
        <td>${fmt(item.price)}</td>
        <td>
          <span class="qty">
            <button type="button" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" value="${qty}" aria-label="Quantity for ${item.name}" />
            <button type="button" aria-label="Increase quantity">+</button>
          </span>
        </td>
        <td>${fmt(line)}</td>
        <td><button type="button" class="link-remove">Remove</button></td>
      `;

      const [dec, input, inc] = tr.querySelectorAll('.qty > *');
      dec.addEventListener('click', () => changeQty(item, qty - 1));
      inc.addEventListener('click', () => changeQty(item, qty + 1));
      input.addEventListener('change', () => {
        const n = Math.max(1, parseInt(input.value || '1', 10));
        changeQty(item, n);
      });
      tr.querySelector('.link-remove').addEventListener('click', () => changeQty(item, 0));
      tbody.appendChild(tr);
    });

    subtotalEl.textContent = fmt(subtotal);
    window.EirelignCart.updateCartBadge();
  }

  function changeQty(item, n) {
    const items = window.EirelignCart.readCart();
    const sig = keyOf(item);
    const left = items.filter(it => keyOf(it) !== sig);
    for (let i = 0; i < n; i++) left.push(item);
    window.EirelignCart.writeCart(left);
    render();
  }

  if (tbody) render();
})();

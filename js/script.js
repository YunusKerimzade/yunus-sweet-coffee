document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'coffeeCart';

  // Читать/писать корзину
  function getCart(){
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
  }

  function updateBadge(){
    document.getElementById('cart-count').textContent = getCart().length;
  }

  if (!document.getElementById('floating-cart')) {
    const a = document.createElement('a');
    a.href = 'shop.html';
    a.id   = 'floating-cart';
    a.innerHTML = '<span class="cart-icon">🛒</span><span id="cart-count">0</span>';
    document.body.append(a);
  }
  updateBadge();
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.currentTarget.closest('.coffee-card');
      const item = {
        id:    card.dataset.id,
        name:  card.dataset.name,
        price: parseFloat(card.dataset.price)
      };
      const cart = getCart();
      cart.push(item);
      saveCart(cart);

      btn.textContent = '✔ Added';
      setTimeout(() => btn.textContent = 'Buy Now', 1000);
    });
  });
  function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return; 

    const cart        = getCart();
    const totalEl     = document.getElementById('totalAmount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    let total         = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      totalEl.textContent      = '0.00';
      checkoutBtn.disabled     = true;
      return;
    }
    cartContainer.innerHTML = cart.map((item, index) => {
      total += item.price;
      return `
        <div class="cart-item" data-index="${index}">
          <span class="item-name">${item.name}</span>
          <span class="item-price">₼${item.price.toFixed(2)}</span>
          <button class="remove-btn" data-index="${index}">✖</button>
        </div>`;
    }).join('');

    totalEl.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = Number(e.currentTarget.dataset.index);
        const updated = getCart();
        updated.splice(i, 1);
        saveCart(updated);
        renderCart();  
      });
    });
    checkoutBtn.onclick = () => {
      window.location.href = 'payment.html';
    };
  }

  renderCart();
});



// Payment JS
document.addEventListener('DOMContentLoaded', ()=> {
  const cart = JSON.parse(localStorage.getItem('coffeeCart') || '[]');
  const total = cart.reduce((sum, it) => sum + it.price, 0);
  document.getElementById('total').textContent = total.toFixed(2);

  const form = document.getElementById('payment-form');

  const cardInput = form.querySelector('input[name="cardNumber"]');
  cardInput.addEventListener('input', e => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 16);      
    let groups = digits.match(/.{1,4}/g);
    e.target.value = groups ? groups.join(' ') : digits;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    ['type','number','expiry','cvc'].forEach(f => {
      document.getElementById('err-'+f).textContent = '';
    });

    const data = new FormData(form);
    let ok = true;

    if (!data.get('cardType')) {
      ok = false;
      document.getElementById('err-type').textContent = 'Select card type';
    }

    const num = data.get('cardNumber').replace(/\s+/g,'');
    if (!/^\d{16}$/.test(num)) {
      ok = false;
      document.getElementById('err-number').textContent = 'Enter 16 digits';
    }

    if (!data.get('expiry')) {
      ok = false;
      document.getElementById('err-expiry').textContent = 'Expiry required';
    }

    const cvc = data.get('cvc');
    if (!/^\d{3}$/.test(cvc)) {
      ok = false;
      document.getElementById('err-cvc').textContent = 'Enter 3 digits';
    }

    if (!ok) return;

    alert('✔ Payment successful! Thank you.');
    localStorage.removeItem('coffeeCart');
    window.location.href = 'index.html';
  });
});

// Modal
document.addEventListener('DOMContentLoaded', ()=> {
  const openBtn      = document.getElementById('openAboutModal');
  const modal        = document.getElementById('aboutModal');
  const closeEls     = modal.querySelectorAll('.close-modal, .modal-overlay');
  const shopNowBtn   = document.getElementById('modal-shop-btn'); // ваша кнопка

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  closeEls.forEach(el => {
    el.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  shopNowBtn.addEventListener('click', e => {
    e.preventDefault();
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.querySelector('#coffeeSelection').scrollIntoView({ behavior: 'smooth' });
  });
});




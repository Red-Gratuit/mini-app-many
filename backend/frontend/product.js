// Initialize Telegram WebApp
let tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
  tg.ready();
  
  // Only use features if supported
  if (tg.enableClosingConfirmation) {
    tg.enableClosingConfirmation();
  }
  
  // Show back button only if supported
  if (tg.BackButton && tg.BackButton.show) {
    try {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        window.location.href = 'index.html';
      });
    } catch (e) {
      console.log('BackButton not supported');
    }
  }
  
  // Apply Telegram theme colors
  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1a1a2e');
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#aaaaaa');
}

// API Configuration - MODE LOCAL
const USE_API = false; // Mettre à true quand le backend est prêt
const API_BASE_URL = 'https://your-backend.herokuapp.com';

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// State
let currentProduct = null;
let selectedFlavor = null;
let quantity = 1;

// Product data (fallback)
const productData = {
  16: {
    id: 16,
    name: "16K JNR",
    price: 25,
    puffs: "16000 bouffées",
    nicotine: "2%",
    battery: "Rechargeable USB-C",
    image: "16k.jpg",
    flavors: ["Fraise", "Mangue", "Cola", "Ice", "Pastèque"]
  },
  18: {
    id: 18,
    name: "18K JNR",
    price: 30,
    puffs: "18000 bouffées",
    nicotine: "2%",
    battery: "Rechargeable USB-C",
    image: "18k.jpg",
    flavors: ["Fraise Ice", "Blueberry", "Energy Drink", "Menthe", "Cherry"]
  }
};

// Load product details
async function loadProduct() {
  const container = document.getElementById('product-detail');

  if (!productId) {
    container.innerHTML = '<div class="loading">Produit introuvable</div>';
    return;
  }

  // Mode local: utiliser les données intégrées
  if (!USE_API) {
    currentProduct = productData[productId];
    if (!currentProduct) {
      container.innerHTML = '<div class="loading">Produit introuvable</div>';
      return;
    }
    selectedFlavor = currentProduct.flavors[0];
    renderProduct();
    return;
  }

  // Mode API
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    const products = await response.json();
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error loading product:', error);
    currentProduct = productData[productId];
  }

  if (!currentProduct) {
    container.innerHTML = '<div class="loading">Produit introuvable</div>';
    return;
  }

  selectedFlavor = currentProduct.flavors[0];
  renderProduct();
}

// Render product HTML
function renderProduct() {
  const container = document.getElementById('product-detail');
  
  container.innerHTML = `
    <div class="product-image-container">
      <img src="${currentProduct.image}" alt="${currentProduct.name}" class="product-image" onerror="this.src='bg.jpg'">
      <div class="product-badge">✨ Premium</div>
    </div>

    <div class="product-header">
      <h1 class="product-name">${currentProduct.name}</h1>
      <div class="product-price">${currentProduct.price} €</div>
      <p class="product-subtitle">Prix unitaire</p>
    </div>

    <div class="product-specs">
      <div class="spec-item">
        <div class="spec-icon">💨</div>
        <div class="spec-label">Bouffées</div>
        <div class="spec-value">${currentProduct.puffs}</div>
      </div>
      <div class="spec-item">
        <div class="spec-icon">⚡</div>
        <div class="spec-label">Nicotine</div>
        <div class="spec-value">${currentProduct.nicotine}</div>
      </div>
      <div class="spec-item">
        <div class="spec-icon">🔋</div>
        <div class="spec-label">Batterie</div>
        <div class="spec-value">USB-C</div>
      </div>
      <div class="spec-item">
        <div class="spec-icon">🎨</div>
        <div class="spec-label">Saveurs</div>
        <div class="spec-value">${currentProduct.flavors.length}</div>
      </div>
    </div>

    <div class="flavor-section">
      <h3 class="section-title">🍓 Choisir une saveur</h3>
      <div class="flavors" id="flavor-buttons">
        ${currentProduct.flavors.map(flavor => `
          <button class="flavor-btn ${flavor === selectedFlavor ? 'selected' : ''}" 
                  onclick="selectFlavor('${flavor}')">
            ${flavor}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="quantity-section">
      <span class="quantity-label">Quantité</span>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="changeQuantity(-1)">−</button>
        <span class="quantity-value" id="quantity-value">${quantity}</span>
        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
      </div>
    </div>

    <div class="total-price">
      <div class="total-label">Total</div>
      <div class="total-amount" id="total-amount">${calculateTotal()} €</div>
    </div>

    <button class="order-button" onclick="placeOrder()">
      <span class="icon">🛒</span>
      <span>Commander</span>
    </button>
  `;
}

// Select flavor
function selectFlavor(flavor) {
  selectedFlavor = flavor;
  
  if (tg && tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
    try {
      tg.HapticFeedback.impactOccurred('light');
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  }
  
  document.querySelectorAll('.flavor-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === flavor) {
      btn.classList.add('selected');
    }
  });
}
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.nav-item')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    if (tab === 'menu') {
      window.location.href = 'index.html';
    }

    if (tab === 'infos') {
      alert('Infos boutique\nLivraison • Qualité • Support');
    }

    if (tab === 'contact') {
      window.open('https://t.me/TON_TELEGRAM', '_blank');
    }
  });
});


// Change quantity
function changeQuantity(delta) {
  const newQuantity = quantity + delta;
  
  if (newQuantity < 1 || newQuantity > 10) {
    if (tg && tg.HapticFeedback && tg.HapticFeedback.notificationOccurred) {
      try {
        tg.HapticFeedback.notificationOccurred('error');
      } catch (e) {
        console.log('Haptic feedback not available');
      }
    }
    return;
  }
  
  quantity = newQuantity;
  
  if (tg && tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
    try {
      tg.HapticFeedback.impactOccurred('medium');
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  }
  
  document.getElementById('quantity-value').textContent = quantity;
  document.getElementById('total-amount').textContent = `${calculateTotal()} €`;
}

// Calculate total price
function calculateTotal() {
  return (currentProduct.price * quantity).toFixed(2);
}

// Place order
function placeOrder() {
  if (!selectedFlavor) {
    if (tg && tg.HapticFeedback && tg.HapticFeedback.notificationOccurred) {
      try {
        tg.HapticFeedback.notificationOccurred('error');
      } catch (e) {
        console.log('Haptic feedback not available');
      }
    }
    alert('Veuillez sélectionner une saveur');
    return;
  }

  if (tg && tg.HapticFeedback && tg.HapticFeedback.notificationOccurred) {
    try {
      tg.HapticFeedback.notificationOccurred('success');
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  }

  const btn = document.querySelector('.order-button');
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 500);

  const orderData = {
    product: currentProduct.name,
    productId: currentProduct.id,
    flavor: selectedFlavor,
    quantity: quantity,
    total: calculateTotal(),
    timestamp: new Date().toISOString(),
    user: tg ? tg.initDataUnsafe?.user : null
  };

  console.log('Order placed:', orderData);

  if (tg && tg.MainButton) {
    try {
      // Show confirmation in main button
      tg.MainButton.setText(`✓ Commander ${quantity}x ${currentProduct.name} - ${calculateTotal()}€`);
      if (tg.MainButton.color) {
        tg.MainButton.color = '#7c5ce0';
      }
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        if (tg.sendData) {
          tg.sendData(JSON.stringify(orderData));
        }
        if (tg.showAlert) {
          tg.showAlert('Commande envoyée avec succès! 🎉');
        } else {
          alert('Commande envoyée avec succès! 🎉');
        }
        setTimeout(() => {
          if (tg.close) {
            tg.close();
          }
        }, 1500);
      });
    } catch (e) {
      console.error('Error with MainButton:', e);
      alert(`✓ Commande confirmée!\n\nProduit: ${currentProduct.name}\nSaveur: ${selectedFlavor}\nQuantité: ${quantity}\nTotal: ${calculateTotal()}€`);
    }
  } else {
    alert(`✓ Commande confirmée!\n\nProduit: ${currentProduct.name}\nSaveur: ${selectedFlavor}\nQuantité: ${quantity}\nTotal: ${calculateTotal()}€`);
  }
}

// Go back to main page
function goBack() {
  if (tg && tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
    try {
      tg.HapticFeedback.impactOccurred('light');
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  }
  
  window.location.href = 'index.html';
}

// Make functions global
window.selectFlavor = selectFlavor;
window.changeQuantity = changeQuantity;
window.placeOrder = placeOrder;
window.goBack = goBack;

// Initialize
document.addEventListener('DOMContentLoaded', loadProduct);
document.addEventListener('DOMContentLoaded', () => {

  console.log('Bottom nav ready');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      if (tab === 'menu') {
        window.location.href = 'index.html';
      }

      if (tab === 'infos') {
        alert('Infos boutique\nLivraison • Qualité • Support');
      }

      if (tab === 'contact') {
        window.open('https://t.me/TON_TELEGRAM', '_blank');
      }
    });
  });

});

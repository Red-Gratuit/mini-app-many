// ==========================================
// 🚀 TELEGRAM WEB APP INITIALIZATION
// ==========================================
let tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();

  if (tg.enableClosingConfirmation) {
    tg.enableClosingConfirmation();
  }

  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1a1a2e');
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#aaaaaa');

  console.log('✅ Telegram WebApp initialisé');
}

// ==========================================
// 📦 PRODUITS - VIDES POUR PRODUITS PERSONNALISÉS
// ==========================================
const products = [];  // Plus de produits par défaut

// ==========================================
// 📱 AFFICHER LES PRODUITS - UNIQUMENT PERSONNALISÉS
// ==========================================
function displayProducts(filter = 'all') {
  const container = document.getElementById('products-container');

  // Uniquement les produits personnalisés
  const allProducts = [...customProducts];

  const filtered = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => {
        if (filter === 'douce') {
          // Produits personnalisés catégorie douce
          return p.category === 'douce';
        }
        if (filter === 'dur') {
          // Produits personnalisés catégorie dur
          return p.category === 'dur';
        }
        if (filter === 'custom') {
          // Tous les produits personnalisés
          return p.custom;
        }
        return true;
      });

  if (filtered.length === 0) {
    if (filter === 'all') {
      container.innerHTML = '<div class="loading">Aucun produit. Ajoutez-en depuis le panel admin !</div>';
    } else {
      container.innerHTML = '<div class="loading">Aucun produit dans cette catégorie</div>';
    }
    return;
  }

  container.innerHTML = filtered.map(p => {
    const imageUrl = p.image;
    const mediaElement = p.mediaType === 'video' ? 
      `<video src="${imageUrl}" muted loop playsinline style="width: 100%; height: 200px; object-fit: cover;"></video>` :
      `<img src="${imageUrl}" alt="${p.name}" onerror="this.src='bg.jpg'">`;
    
    // Badge de catégorie pour les produits personnalisés
    const categoryBadge = p.custom ? 
      (p.category === 'douce' ? '<div class="category-badge douce">💎</div>' :
       p.category === 'dur' ? '<div class="category-badge dur">👑</div>' :
       '<div class="category-badge custom">🆕</div>') : '';
    
    return `
    <div class="card" onclick="showProduct(${p.id})">
      ${mediaElement}
      ${categoryBadge}
      <h2>${p.name}</h2>
      <div class="card-info">
        <span class="card-price">${p.price}</span>
        <span class="card-puffs">${p.puffs}</span>
      </div>
      ${p.custom ? '<div class="custom-badge">🆕</div>' : ''}
    </div>
  `;
  }).join('');
  
  // Démarrer les vidéos dans les cartes
  container.querySelectorAll('video').forEach(video => {
    video.play().catch(() => {});
  });
}

// ==========================================
// 🎯 AFFICHER DÉTAILS PRODUIT (MODAL) - PRODUITS PERSONNALISÉS
// ==========================================
function showProduct(id) {
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred('medium');
    } catch (e) {}
  }

  // Chercher uniquement dans les produits personnalisés
  const product = customProducts.find(p => p.id === id);
  if (!product) return;

  const imageUrl = product.image;
  const mediaElement = product.mediaType === 'video' ? 
    `<video src="${imageUrl}" controls autoplay muted loop style="width: 100%; max-height: 300px; border-radius: 12px;"></video>` :
    `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px;" onerror="this.src='bg.jpg'">`;

  const categoryText = product.category === 'douce' ? '💎 Douce' : 
                        product.category === 'dur' ? '👑 Dur' : '🆕 Personnalisée';

  const html = `
    ${mediaElement}
    <h2>${product.name}</h2>
    <div class="product-price-big">${product.price}</div>

    <div class="product-info-item">
      <strong>📦 Catégorie :</strong> ${categoryText}
    </div>
    <div class="product-info-item">
      <strong>� Quantité :</strong> ${product.puffs}
    </div>
    ${product.description ? `<div class="product-info-item"><strong>📝 Description :</strong><br>${product.description}</div>` : ''}
    <div class="product-info-item">
      <strong>🆕 Produit personnalisé</strong>
    </div>

    <p style="margin-top: 25px; text-align: center; font-size: 1.1rem; color: #aaa;">
      💬 Contacte-moi sur <strong style="color: #667eea;">Snap : Le_Shop_De_Many</strong>
    </p>
  `;

  document.getElementById('modal-product-details').innerHTML = html;
  document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (e.target === modal) closeProductModal();
});

// ==========================================
// 🎛️ FILTRES CATÉGORIES
// ==========================================
function setupFilters() {
  const buttons = document.querySelectorAll('.cat');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      displayProducts(cat);
    });
  });
}

// ==========================================
// 🧭 NAVIGATION TABS - AVEC PROTECTION ADMIN COMPLÈTE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // Vérification OBLIGATOIRE pour l'onglet admin
      if (tab === 'admin' && !isAdminAuthenticated) {
        showAdminLogin();
        return;
      }

      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }

      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('active');
        t.scrollTop = 0;
      });

      const target = document.getElementById(`tab-${tab}`);
      if (target) target.classList.add('active');
    });
  });
});

// ==========================================
// 🎵 GESTION MUSIQUE - DÉMARRE AU 1ER CLIC
// ==========================================
let audioStarted = false;
let audioPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('intro-audio');
  const soundBtn = document.getElementById('sound-toggle');

  if (!audio) return;

  // Fonction pour démarrer l'audio au PREMIER clic
  function startAudioOnFirstClick() {
    if (!audioStarted) {
      audio.muted = false;
      audio.play()
        .then(() => {
          console.log('🎵 Musique démarrée au premier clic !');
          audioStarted = true;
          audioPlaying = true;
          soundBtn.innerHTML = '🔊';
        })
        .catch(err => {
          console.log('⏸️ Audio bloqué par le navigateur:', err);
        });
    }
  }

  // DÉMARRER AU 1ER CLIC N'IMPORTE OÙ sur la page
  document.body.addEventListener('click', startAudioOnFirstClick, { once: true });
  document.body.addEventListener('touchstart', startAudioOnFirstClick, { once: true });

  // Bouton son pour TOGGLE (ON/OFF)
  soundBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Si l'audio n'a jamais été démarré, on le démarre
    if (!audioStarted) {
      audio.muted = false;
      audio.play()
        .then(() => {
          audioStarted = true;
          audioPlaying = true;
          soundBtn.innerHTML = '🔊';
        })
        .catch(() => {});
    } 
    // Sinon, on toggle ON/OFF
    else {
      if (audio.paused) {
        audio.play().catch(() => {});
        soundBtn.innerHTML = '🔊';
        audioPlaying = true;
      } else {
        audio.pause();
        soundBtn.innerHTML = '🔇';
        audioPlaying = false;
      }
    }

    if (tg?.HapticFeedback) {
      try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
    }
  });
});

// ==========================================
// 🎬 SPLASH SCREEN AVEC BELLE ANIMATION
// ==========================================
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Durée totale : 3.5 secondes
  setTimeout(() => {
    // Ajouter la classe pour l'animation de disparition
    splash.classList.add('fade-out');

    // Supprimer complètement après l'animation
    setTimeout(() => {
      splash.remove();
      console.log('✨ Splash screen terminé !');
    }, 1000); // 1 seconde pour l'animation de fade-out

  }, 2500); // 2.5 secondes d'affichage
});

// ==========================================
// 🎨 CARTES D'ALERTES PERSONNALISÉES
// ==========================================
function showCustomAlert(title, message, type = 'info') {
  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  // Créer la carte d'alerte
  const alertCard = document.createElement('div');
  alertCard.className = 'custom-alert-card';
  alertCard.style.cssText = `
    background: var(--card-bg);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    max-width: 400px;
    width: 100%;
    padding: 30px 20px;
    text-align: center;
    animation: slideUp 0.4s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  // Définir les couleurs selon le type
  const colors = {
    success: { bg: 'linear-gradient(135deg, #4CAF50, #45a049)', icon: '✅' },
    warning: { bg: 'linear-gradient(135deg, #ff9800, #f57c00)', icon: '⚠️' },
    info: { bg: 'linear-gradient(135deg, #2196F3, #1976D2)', icon: 'ℹ️' },
    error: { bg: 'linear-gradient(135deg, #f44336, #d32f2f)', icon: '❌' }
  };

  const color = colors[type] || colors.info;

  alertCard.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">${color.icon}</div>
    <h2 style="color: var(--tg-theme-text-color); margin-bottom: 10px;">${title}</h2>
    <p style="color: var(--tg-theme-hint-color); margin-bottom: 25px; line-height: 1.4;">${message}</p>
    <button class="admin-btn" style="background: ${color.bg}; width: 100%;" onclick="this.closest('.custom-alert-overlay').remove()">
      OK
    </button>
  `;

  overlay.appendChild(alertCard);
  document.body.appendChild(overlay);

  // Fermer automatiquement après 3 secondes pour les messages de succès
  if (type === 'success') {
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 3000);
  }

  // Fermer au clic sur l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function showCustomConfirm(title, message, onConfirm) {
  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'custom-confirm-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  // Créer la carte de confirmation
  const confirmCard = document.createElement('div');
  confirmCard.className = 'custom-confirm-card';
  confirmCard.style.cssText = `
    background: var(--card-bg);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    max-width: 400px;
    width: 100%;
    padding: 30px 20px;
    text-align: center;
    animation: slideUp 0.4s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  confirmCard.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">🗑️</div>
    <h2 style="color: var(--tg-theme-text-color); margin-bottom: 10px;">${title}</h2>
    <p style="color: var(--tg-theme-hint-color); margin-bottom: 25px; line-height: 1.4;">${message}</p>
    <div style="display: flex; gap: 15px;">
      <button class="admin-btn cancel-btn" style="flex: 1;" onclick="this.closest('.custom-confirm-overlay').remove()">
        Annuler
      </button>
      <button class="admin-btn" style="flex: 1; background: linear-gradient(135deg, #f44336, #d32f2f);" onclick="confirmAction()">
        Confirmer
      </button>
    </div>
  `;

  overlay.appendChild(confirmCard);
  document.body.appendChild(overlay);

  // Fonction de confirmation
  window.confirmAction = function() {
    overlay.remove();
    onConfirm();
  };

  // Fermer au clic sur l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// ==========================================
// 📦 FONCTIONS PRODUITS PERSONNALISÉS - LOCALSTORAGE (TEMPORAIRE)
// ==========================================
let customProducts = [];
let currentProductMedia = null;

// Charger les produits personnalisés depuis localStorage
function loadCustomProducts() {
  const saved = localStorage.getItem('le_shop_de_many_products');
  if (saved) {
    try {
      customProducts = JSON.parse(saved);
    } catch (e) {
      customProducts = [];
    }
  }
}

// Sauvegarder les produits personnalisés
function saveCustomProducts() {
  localStorage.setItem('le_shop_de_many_products', JSON.stringify(customProducts));
}

// Sauvegarder un produit localement
function saveProductToServer(product) {
  try {
    customProducts.push({
      ...product,
      id: Date.now(),
      custom: true,
      created: new Date().toISOString()
    });
    saveCustomProducts();
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde locale:', error);
    return false;
  }
}

// Supprimer un produit localement
function deleteProductFromServer(productId) {
  try {
    customProducts = customProducts.filter(p => p.id !== productId);
    saveCustomProducts();
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression locale:', error);
    return false;
  }
}

// Prévisualiser le média du nouveau produit
function previewProductMedia(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('media-preview');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentProductMedia = {
        type: file.type.startsWith('video/') ? 'video' : 'image',
        data: e.target.result,
        name: file.name
      };
      
      preview.innerHTML = currentProductMedia.type === 'video' ?
        `<video src="${currentProductMedia.data}" controls style="max-width: 200px; max-height: 200px; border-radius: 8px;"></video>` :
        `<img src="${currentProductMedia.data}" style="max-width: 200px; max-height: 200px; border-radius: 8px;" alt="Aperçu">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '';
    currentProductMedia = null;
  }
}

// Ajouter un nouveau produit
async function addNewProduct() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  const name = document.getElementById('new-product-name').value.trim();
  const category = document.getElementById('new-product-category').value;
  const price = document.getElementById('new-product-price').value.trim();
  const puffs = document.getElementById('new-product-puffs').value.trim();
  const desc = document.getElementById('new-product-desc').value.trim();
  
  if (!name || !price || !category) {
    showCustomAlert('⚠️ Champs requis', 'Veuillez remplir le nom, la catégorie et le prix du produit.', 'warning');
    return;
  }
  
  const newProduct = {
    name: name,
    category: category,
    price: price,
    puffs: puffs || 'Non spécifié',
    description: desc || '',
    image: currentProductMedia ? currentProductMedia.data : 'bg.jpg',
    mediaType: currentProductMedia ? currentProductMedia.type : 'image'
  };
  
  // Sauvegarder localement
  const success = saveProductToServer(newProduct);
  
  if (success) {
    // Recharger les produits depuis localStorage
    loadCustomProducts();
    
    // Réinitialiser le formulaire
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-category').value = '';
    document.getElementById('new-product-price').value = '';
    document.getElementById('new-product-puffs').value = '';
    document.getElementById('new-product-desc').value = '';
    document.getElementById('new-product-media').value = '';
    document.getElementById('media-preview').innerHTML = '';
    currentProductMedia = null;
    
    showCustomAlert('✅ Succès', 'Produit ajouté avec succès dans la catégorie ' + category + ' !', 'success');
    refreshProducts();
  } else {
    showCustomAlert('❌ Erreur', 'Impossible de sauvegarder le produit. Réessayez.', 'error');
  }
}

// Supprimer un produit personnalisé
async function deleteCustomProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  showCustomConfirm('🗑️ Supprimer le produit', 'Êtes-vous sûr de vouloir supprimer ce produit ?', () => {
    const success = deleteProductFromServer(id);
    
    if (success) {
      // Recharger les produits depuis localStorage
      loadCustomProducts();
      refreshProducts();
      showCustomAlert('✅ Succès', 'Produit supprimé avec succès !', 'success');
    } else {
      showCustomAlert('❌ Erreur', 'Impossible de supprimer le produit. Réessayez.', 'error');
    }
  });
}


let isAdminAuthenticated = false;

// ==========================================
// 🔐 FONCTIONS CONNEXION ADMIN PERSONNALISÉE
// ==========================================
function showAdminLogin() {
  // Afficher la carte de connexion personnalisée
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) {
    loginModal.style.display = 'flex';
    // Focus sur le champ de code
    setTimeout(() => {
      const codeInput = document.getElementById('admin-code-input');
      if (codeInput) {
        codeInput.focus();
        codeInput.value = '';
      }
    }, 100);
  }
}

function submitAdminCode() {
  const codeInput = document.getElementById('admin-code-input');
  const code = codeInput ? codeInput.value.trim() : '';
  
  if (code === 'Many59') {
    isAdminAuthenticated = true;
    hideAdminLogin();
    showCustomAlert('✅ Authentification réussie', 'Bienvenue dans le panel admin !', 'success');
    
    // Afficher le contenu admin
    const accessDenied = document.getElementById('admin-access-denied');
    const adminContent = document.getElementById('admin-content');
    if (accessDenied) accessDenied.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';
    
    loadAdminProducts();
    updateAdminStats();
    
    // Activer l'onglet admin après authentification
    const adminTab = document.querySelector('[data-tab="admin"]');
    if (adminTab) {
      adminTab.click();
    }
  } else {
    // Code incorrect - animation d'erreur
    if (codeInput) {
      codeInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        codeInput.style.animation = '';
        codeInput.focus();
      }, 500);
    }
  }
}

function cancelAdminLogin() {
  hideAdminLogin();
  // Rediriger vers le menu principal
  const menuTab = document.querySelector('[data-tab="menu"]');
  if (menuTab) {
    menuTab.click();
  }
}

function hideAdminLogin() {
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) {
    loginModal.style.display = 'none';
  }
}

// Animation shake pour erreur
const shakeStyle = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

// Ajouter le style shake dynamiquement
if (!document.getElementById('shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = shakeStyle;
  document.head.appendChild(style);
}

// Gérer la touche Entrée dans le champ de code
document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('admin-code-input');
  if (codeInput) {
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitAdminCode();
      }
    });
  }
});



// Mettre à jour les statistiques admin
function updateAdminStats() {
  const totalProducts = document.getElementById('total-products');
  if (totalProducts) {
    const allProducts = [...products, ...customProducts];
    totalProducts.textContent = allProducts.length;
  }
}

function loadAdminProducts() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  const container = document.getElementById('admin-products-list');
  if (!container) return;
  
  const allProducts = [...products, ...customProducts];
  
  container.innerHTML = allProducts.map(p => `
    <div class="admin-product-card">
      ${p.mediaType === 'video' ? 
        `<video src="${p.image}" muted loop playsinline style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></video>` :
        `<img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">`
      }
      <div class="admin-product-info">
        <h3>${p.name} ${p.custom ? '🆕' : ''}</h3>
        <p>${p.puffs} • ${p.price}€</p>
      </div>
      <div class="admin-product-actions">
        ${p.custom ? `<button class="admin-btn-small delete" onclick="deleteCustomProduct(${p.id})">🗑️</button>` : ''}
      </div>
    </div>
  `).join('');
  
  // Démarrer les vidéos
  container.querySelectorAll('video').forEach(video => {
    video.play().catch(() => {});
  });
}

function addProduct() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomAlert('ℹ️ Information', 'Utilisez le formulaire "Ajouter un nouveau produit" ci-dessus !', 'info');
}

function editProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomAlert('ℹ️ Information', 'Fonctionnalité d\'édition en développement !', 'info');
}

function deleteProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomConfirm('🗑️ Supprimer le produit', 'Êtes-vous sûr de vouloir supprimer ce produit par défaut ?', () => {
    showCustomAlert('ℹ️ Information', 'Fonctionnalité en développement !', 'info');
  });
}

function refreshProducts() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  loadAdminProducts();
  showCustomAlert('🔄 Actualisation', 'Liste des produits mise à jour !', 'info');
}

function saveConfig() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  const snapUsername = document.getElementById('snap-username').value;
  const defaultPrice = document.getElementById('default-price').value;
  
  // Sauvegarder dans localStorage
  localStorage.setItem('snap_username', snapUsername);
  localStorage.setItem('default_price', defaultPrice);
  localStorage.setItem('admin_code', 'Many59');
  
  showCustomAlert('✅ Configuration sauvegardée', 'Vos paramètres ont été enregistrés avec succès !', 'success');
}

// ==========================================
// 📞 FONCTIONS CONTACT
// ==========================================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      product: formData.get('product'),
      message: formData.get('message')
    };
    
    // Simuler l'envoi
    console.log('Message reçu :', data);
    showCustomAlert('✅ Message envoyé', 'Votre message a été envoyé avec succès ! Je vous répondrai rapidement sur Snapchat.', 'success');
    form.reset();
  });
}

// ==========================================
// 🚀 INITIALISATION - LOCALSTORAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  setupFilters();
  setupContactForm();
  
  // Charger les produits personnalisés depuis localStorage
  loadCustomProducts();
  
  // Configurer l'upload de média pour les nouveaux produits
  const mediaUpload = document.getElementById('new-product-media');
  if (mediaUpload) {
    mediaUpload.addEventListener('change', previewProductMedia);
  }
  
  // PAS de chargement auto des produits admin
  // Ils seront chargés seulement quand l'utilisateur cliquera sur une fonction admin
  
  console.log('✅ App initialisée - Produits chargés depuis localStorage !');
});

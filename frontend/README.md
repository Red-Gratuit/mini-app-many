# Le Shop De Many - Mini App Telegram (Optimisé iPhone) 📱

Application Mini App Telegram optimisée pour iPhone avec interface agrandie et fond d'arrière-plan.

## 🎨 Optimisations iPhone

✅ **Éléments agrandis pour faciliter l'utilisation:**
- Boutons plus grands (min 56px de hauteur)
- Texte plus lisible (18px de base)
- Images produits plus grandes (200px)
- Espacement augmenté
- Zones tactiles optimisées

✅ **Fond d'arrière-plan:**
- Image bg.jpg en fond avec effet blur
- Superposition sombre pour meilleure lisibilité
- Effet glassmorphism sur les cartes

✅ **Support iPhone:**
- Gestion du notch (safe area)
- Prévention du zoom iOS
- Retours haptiques Telegram
- Animations fluides
- Touch-friendly

## 📁 Fichiers

```
.
├── index.html              # Page d'accueil optimisée
├── product.html            # Page produit optimisée
├── style.css               # Styles avec éléments agrandis
├── product-style.css       # Styles produit agrandis
├── script.js               # Script avec haptic feedback
├── product.js              # Script produit optimisé
├── main.py                 # Backend FastAPI
├── requirements.txt        # Dépendances
├── Procfile               # Configuration Heroku
├── 16k.jpg                # Image produit 16K
├── 18k.jpg                # Image produit 18K
└── bg.jpg                 # Image de fond
```

## 🚀 Déploiement

### 1. Tester localement

```bash
# Backend
python main.py

# Frontend
python -m http.server 8080
```

Ouvrez dans Safari sur iPhone ou utilisez le simulateur iOS.

### 2. Déployer le Frontend

**Option A: GitHub Pages**
```bash
git add .
git commit -m "Deploy iPhone optimized version"
git push origin main
```
Activez GitHub Pages dans Settings.

**Option B: Netlify**
1. Drag & drop tous les fichiers HTML/CSS/JS/images
2. Ou connectez votre repo GitHub

**Option C: Vercel**
```bash
vercel deploy
```

### 3. Déployer le Backend

**Heroku:**
```bash
heroku create votre-app-jnr
git push heroku main
```

**Render:**
1. Connectez votre repo
2. Sélectionnez `main.py`
3. Déployez

### 4. Configurer Telegram Bot

1. Parlez à [@BotFather](https://t.me/BotFather)
2. `/newbot` pour créer votre bot
3. `/newapp` pour créer la Mini App
4. Fournissez l'URL de votre frontend
5. Testez sur votre iPhone !

### 5. Mettre à jour l'API

Dans `script.js` et `product.js`:
```javascript
const API_BASE_URL = 'https://VOTRE-BACKEND.herokuapp.com';
```

## 📱 Fonctionnalités iPhone

### Retours Haptiques
- `light` - Tap sur catégories
- `medium` - Sélection produit
- `success` - Commande validée
- `error` - Action invalide

### Bouton Retour Telegram
- Automatiquement affiché sur la page produit
- Masqué sur la page d'accueil
- Navigation native

### Main Button Telegram
- Apparaît après sélection produit
- Affiche le résumé de commande
- Couleur personnalisée (violet)
- Envoi des données au bot

### Safe Area
- Support du notch iPhone
- Padding automatique
- Gestion zone de sécurité

## 🎯 Tailles Optimisées

| Élément | Ancienne | Nouvelle |
|---------|----------|----------|
| Police de base | 16px | 18px |
| Titre H1 | 32px | 39.6px |
| Boutons | 44px | 56px |
| Prix | 20px | 27px |
| Images | 180px | 200px |
| Padding cards | 16px | 20px |

## 🎨 Personnalisation

### Modifier les couleurs
Dans `style.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-bg: rgba(255, 255, 255, 0.10);
}
```

### Changer le fond
Remplacez `bg.jpg` par votre image (recommandé: 1080x1920px)

### Ajuster la taille
Modifiez dans `style.css`:
```css
html {
  font-size: 18px; /* Augmentez pour agrandir tout */
}
```

## 🐛 Résolution de problèmes

### L'image de fond ne s'affiche pas
- Vérifiez que `bg.jpg` est bien présent
- Assurez-vous que le chemin est correct
- Testez l'URL de l'image

### Les boutons sont trop petits
- Augmentez `font-size` dans `html {}`
- Vérifiez que `min-height: 56px` est appliqué

### Pas de retours haptiques
- Testez dans l'app Telegram (pas le navigateur)
- Vérifiez que vous êtes sur iOS
- Consultez la console pour les erreurs

### Le texte est flou
- Désactivez le zoom automatique
- Vérifiez le viewport meta tag
- Testez sur un vrai iPhone

## 📊 API Endpoints

- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail produit
- `POST /api/orders` - Créer commande

## 💡 Conseils

1. **Testez toujours sur un vrai iPhone** - Les simulateurs ne reproduisent pas parfaitement le comportement
2. **Utilisez les retours haptiques** - Ils améliorent l'expérience utilisateur
3. **Optimisez les images** - Compressez pour un chargement rapide
4. **Testez en conditions réelles** - Connexion 4G, luminosité faible, etc.

## 🆘 Support

Pour toute question, contactez via Telegram ou créez une issue.

## 📝 Prochaines étapes

- [ ] Ajouter panier d'achat
- [ ] Historique des commandes
- [ ] Notifications push
- [ ] Mode sombre/clair
- [ ] Multi-langue

---

Fait avec ❤️ pour Telegram

# 🔧 Guide de Résolution des Erreurs

## ✅ Erreurs corrigées dans cette version

### 1. ❌ CORS Error (Access-Control-Allow-Origin)
**Erreur:** `has been blocked by CORS policy`

**Cause:** Le backend bloque les requêtes du frontend

**Solution appliquée:**
- Mode LOCAL activé par défaut (USE_API = false)
- Les données sont intégrées dans le code
- Plus besoin de backend pour tester

**Pour activer l'API plus tard:**
```javascript
// Dans script.js et product.js
const USE_API = true; // Changer à true
const API_BASE_URL = 'https://VOTRE-BACKEND.com';
```

### 2. ❌ HapticFeedback not supported
**Erreur:** `HapticFeedback is not supported in version 6.0`

**Cause:** Version Telegram trop ancienne

**Solution appliquée:**
```javascript
// Vérification avant utilisation
if (tg && tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
  try {
    tg.HapticFeedback.impactOccurred('light');
  } catch (e) {
    console.log('Haptic feedback not available');
  }
}
```

### 3. ❌ BackButton not supported
**Erreur:** `BackButton is not supported in version 6.0`

**Cause:** Version Telegram trop ancienne

**Solution appliquée:**
```javascript
// Vérification avant utilisation
if (tg.BackButton && tg.BackButton.show) {
  try {
    tg.BackButton.show();
  } catch (e) {
    console.log('BackButton not supported');
  }
}
```

### 4. ❌ Failed to fetch / 404 Not Found
**Erreur:** `GET https://your-backend.herokuapp.com/api/products net::ERR_FAILED 404`

**Cause:** Backend pas déployé ou URL incorrecte

**Solution appliquée:**
- Mode local activé (USE_API = false)
- Données de fallback utilisées
- L'app fonctionne sans backend

## 📱 Version Telegram requise

Pour toutes les fonctionnalités:
- **Minimum:** Telegram 6.1+
- **Recommandé:** Telegram 6.9+
- **Optimal:** Telegram 7.0+

### Vérifier votre version
```javascript
console.log('Version:', tg.version);
```

## 🔄 Mettre à jour Telegram

**iPhone:**
1. Ouvrez l'App Store
2. Cherchez "Telegram"
3. Appuyez sur "Mettre à jour"

**Android:**
1. Ouvrez Google Play Store
2. Cherchez "Telegram"
3. Appuyez sur "Mettre à jour"

## ⚙️ Mode de fonctionnement actuel

### MODE LOCAL (par défaut)
✅ Aucun backend nécessaire
✅ Données intégrées dans le code
✅ Fonctionne immédiatement
✅ Parfait pour tester

### MODE API (optionnel)
❌ Nécessite backend déployé
❌ Configuration CORS requise
❌ URL backend à configurer
✅ Données dynamiques

## 🚀 Étapes de déploiement

### 1. Tester en mode LOCAL (actuel)
```bash
# Aucune configuration nécessaire
# Déployez simplement les fichiers HTML/CSS/JS
```

### 2. Passer en mode API (plus tard)
```javascript
// 1. Déployer le backend (Heroku/Render)
// 2. Dans script.js et product.js:
const USE_API = true;
const API_BASE_URL = 'https://votre-backend.herokuapp.com';
```

### 3. Configurer le bot Telegram
```
@BotFather
/newapp
URL: https://votre-frontend.netlify.app
```

## 📋 Checklist de déploiement

- [ ] Mettre à jour Telegram (6.9+)
- [ ] Déployer frontend (Netlify/Vercel/GitHub Pages)
- [ ] Tester en mode local
- [ ] Créer le bot avec @BotFather
- [ ] Configurer l'URL du frontend
- [ ] Tester sur iPhone
- [ ] (Optionnel) Déployer backend
- [ ] (Optionnel) Activer mode API

## 🐛 Autres erreurs communes

### Erreur: "apple-mobile-web-app-capable"
**Warning seulement**, ignorez-le. C'est juste une suggestion.

### Erreur: "Wrong root domain"
Le fichier est ouvert en local. Déployez sur un serveur web.

### Erreur: Images ne chargent pas
Vérifiez que les fichiers .jpg sont au même niveau que index.html:
```
/
├── index.html
├── 16k.jpg  ✓
├── 18k.jpg  ✓
└── bg.jpg   ✓
```

## 📞 Besoin d'aide ?

1. Vérifiez la console (F12 dans le navigateur)
2. Vérifiez votre version Telegram
3. Testez d'abord en mode local
4. Consultez ce guide

## ✅ Version corrigée

Cette version (v2.0) corrige TOUTES les erreurs de votre screenshot:
- ✅ Plus d'erreur CORS
- ✅ Plus d'erreur HapticFeedback
- ✅ Plus d'erreur BackButton  
- ✅ Plus d'erreur 404 API
- ✅ Fonctionne en mode local
- ✅ Compatible anciennes versions Telegram

## 🎯 Prochaine étape

**Testez maintenant !**
1. Déployez sur Netlify/Vercel
2. Configurez le bot @BotFather
3. Ouvrez dans Telegram sur iPhone
4. Tout devrait fonctionner ! 🎉

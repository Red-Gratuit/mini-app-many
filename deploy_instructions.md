# 🚀 Instructions de déploiement sur GitHub + Railway

## Étape 1 : Initialiser Git et se connecter
```bash
git init
git config user.name "Red-Gratuit"
git config user.email "votre-email@gmail.com"
```

## Étape 2 : Ajouter le repository distant
```bash
git remote add origin https://github.com/Red-Gratuit/le-shop-de-many.git
```

## Étape 3 : Ajouter tous les fichiers
```bash
git add .
git commit -m "Initial commit - Le Shop De Many Telegram Mini App"
```

## Étape 4 : Push sur GitHub
```bash
git branch -M main
git push -u origin main
```

## Étape 5 : Déployer sur Railway
1. Allez sur https://railway.app
2. Connectez votre compte GitHub
3. Cliquez "New Project" → "Deploy from GitHub repo"
4. Sélectionnez "Red-Gratuit/le-shop-de-many"
5. Railway détectera automatiquement l'application Python
6. Patientez 2-3 minutes pour le déploiement

## 🎯 Résultat final
Votre app sera accessible sur : `https://le-shop-de-many.up.railway.app`

## 📱 Intégration Telegram
1. Créez un bot via @BotFather
2. Configurez la Web App avec l'URL Railway
3. Testez dans Telegram !

## ✅ Fichiers déjà configurés
- `requirements.txt` : Dépendances Flask
- `Procfile` : Configuration Railway
- `railway.json` : Build settings
- `.gitignore` : Fichiers ignorés
- `README.md` : Documentation

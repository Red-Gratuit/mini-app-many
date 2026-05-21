# Le Shop De Many - Telegram Web App

## Déploiement sur Railway

### Prérequis
- Un compte Railway
- Git installé

### Étapes de déploiement

1. **Créer un repository Git**
```bash
git init
git add .
git commit -m "Initial commit - Le Shop De Many Telegram App"
```

2. **Connecter à Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez votre compte GitHub
   - Créez un nouveau projet
   - Importez votre repository

3. **Configuration automatique**
   - Railway détectera automatiquement l'application Python
   - Il installera les dépendances depuis `requirements.txt`
   - Il démarrera avec `python main.py`

4. **Variables d'environnement (optionnelles)**
   - `PORT`: Railway le définit automatiquement (généralement 8080)
   - `FLASK_ENV`: `production` (recommandé)

### Structure du projet
```
project/
├── backend/
│   ├── main.py              # Serveur Flask
│   ├── requirements.txt     # Dépendances Python
│   └── frontend/           # Fichiers statiques
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── images/
├── Procfile               # Configuration Railway
├── railway.json           # Configuration Railway
└── package.json           # Métadonnées
```

### Fonctionnalités
- 🏠 Menu principal avec catalogue de produits
- 📞 Formulaire de contact
- 🔐 Panel d'administration (protégé par code "Many59")
- ℹ️ Page d'informations
- 🎵 Audio d'ambiance
- 📱 Optimisé pour Telegram Web App

### Déploiement terminé !
Une fois déployé, votre application sera accessible via une URL Railway comme :
`https://your-app-name.up.railway.app`

### Intégration avec Telegram
1. Créez un bot Telegram via [@BotFather](https://t.me/BotFather)
2. Configurez votre Web App dans BotFather
3. Utilisez l'URL Railway fournie

## Support
Pour toute question, contactez : enzoxr.59 sur Snapchat

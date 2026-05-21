const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware pour traiter le JSON
app.use(express.json());

// Configuration du bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Configuration des URLs
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://web-production-77d3d.up.railway.app';
const CANAL_URL = 'https://t.me/LeShopDeMany';
const CONTACT_URL = 'https://snapchat.com/add/many.zz5';

// Handler /start - Message d'accueil avec photo et boutons
bot.start(async (ctx) => {
  try {
    // Essayer d'envoyer la photo d'abord
    try {
      await ctx.replyWithPhoto(
        { source: 'logo.jpg' }, // Utilise le logo.jpg à la racine du projet
        {
          caption: `🌟 BIENVENUE CHEZ LE SHOP DE MANY 🌟
NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 🔥`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📢 CANAL TELEGRAM ↗",
                  url: CANAL_URL
                }
              ],
              [
                {
                  text: "📸 SNAPCHAT ↗",
                  url: CONTACT_URL
                }
              ],
              [
                {
                  text: "📱 MENU MINI-APP",
                  web_app: { url: MINI_APP_URL }
                }
              ]
            ]
          }
        }
      );
    } catch (photoError) {
      // Si la photo ne fonctionne pas, envoyer juste le texte avec les boutons
      console.log('Photo non trouvée, envoi du texte seulement:', photoError.message);
      await ctx.reply(`🌟 **BIENVENUE CHEZ LE SHOP DE MANY** 🌟

NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 🔥`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 CANAL TELEGRAM ↗",
                url: CANAL_URL
              }
            ],
            [
              {
                text: "📸 SNAPCHAT ↗",
                url: CONTACT_URL
              }
            ],
            [
              {
                text: "📱 MENU MINI-APP",
                web_app: { url: MINI_APP_URL }
              }
            ]
          ]
        },
        parse_mode: 'Markdown'
      });
    }
  } catch (error) {
    console.error('Erreur dans /start:', error);
    await ctx.reply('Désolé, une erreur est survenue. Réessayez plus tard.');
  }
});

// Handler /help - Commande d'aide
bot.help((ctx) => {
  ctx.reply(`🤖 *Commandes disponibles:*
/start - Lancer le bot et voir la mini-app
/help - Voir cette aide

📱 *Mini App:* Tous nos produits et commandes
📢 *Canal:* Les dernières nouveautés
📞 *Contact:* Commande directe sur Snapchat`, {
    parse_mode: 'Markdown'
  });
});

// Handler pour les messages non reconnus
bot.on('message', (ctx) => {
  ctx.reply('Utilisez /start pour accéder à la mini-app Le Shop De Many 🌿');
});

// Endpoint webhook pour Telegram
app.use(bot.webhookCallback('/webhook'));

// Endpoint pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le Shop De Many - Server is running');
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Serveur démarré sur le port ${PORT}`);
  console.log(`🤖 Bot Telegram configuré`);
});

// Configurer le webhook si l'URL est disponible
if (MINI_APP_URL) {
  bot.telegram.setWebhook(`${MINI_APP_URL}/webhook`)
    .then(() => {
      console.log(`✅ Webhook configuré: ${MINI_APP_URL}/webhook`);
    })
    .catch((err) => {
      console.error('❌ Erreur configuration webhook:', err);
    });
} else {
  console.log('⚠️ MINI_APP_URL non défini, utilisation du polling');
  bot.launch();
}

module.exports = app;

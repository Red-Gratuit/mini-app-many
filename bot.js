const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

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
          caption: `🌟 BIENVENUE CHEZ LE SHOP DE MANY �
NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 �`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "� CANAL TELEGRAM ↗",
                  url: CANAL_URL
                }
              ],
              [
                {
                  text: "� SNAPCHAT ↗",
                  url: CONTACT_URL
                }
              ],
              [
                {
                  text: "� MENU MINI-APP",
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
      await ctx.reply(`� **BIENVENUE CHEZ LE SHOP DE MANY** �

NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 �`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "� CANAL TELEGRAM ↗",
                url: CANAL_URL
              }
            ],
            [
              {
                text: "� SNAPCHAT ↗",
                url: CONTACT_URL
              }
            ],
            [
              {
                text: "� MENU MINI-APP",
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

// Gestion des erreurs
bot.catch((err, ctx) => {
  console.error(`Erreur pour ${ctx.updateType}:`, err);
  ctx.reply('Une erreur est survenue. Réessayez plus tard.');
});

// Démarrage du bot
bot.launch()
  .then(() => {
    console.log('🤖 Le Shop De Many Bot démarré avec succès!');
  })
  .catch((err) => {
    console.error('❌ Erreur au démarrage du bot:', err);
  });

// Arrêt propre du bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;

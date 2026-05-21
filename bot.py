#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Le Shop De Many - Bot Telegram en Python
Compatible avec le service Flask existant
"""

import requests
import json
import time
import threading
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

app = Flask(__name__)

# ==========================================
# ROUTES API - WEBHOOK
# ==========================================
@app.route('/webhook', methods=['POST'])
def webhook():
    """Endpoint pour le webhook Telegram"""
    try:
        update = request.json
        handle_message(update)
        return jsonify({'ok': True})
    except Exception as e:
        print(f"Erreur webhook: {e}")
        return jsonify({'ok': False}), 500

# ==========================================
# CONFIGURATION DU BOT
# ==========================================
BOT_TOKEN = os.environ.get('BOT_TOKEN')
MINI_APP_URL = os.environ.get('MINI_APP_URL')
CANAL_URL = 'https://t.me/LeShopDeMany'  # URL directe du canal
CONTACT_URL = os.environ.get('CONTACT_URL')
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def send_message(chat_id, text, reply_markup=None):
    """Envoyer un message Telegram"""
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }
    if reply_markup:
        data['reply_markup'] = reply_markup
    
    try:
        response = requests.post(f"{TELEGRAM_API_URL}/sendMessage", json=data)
        return response.json()
    except Exception as e:
        print(f"Erreur envoi message: {e}")
        return None

def send_photo(chat_id, photo_path, caption, reply_markup=None):
    """Envoyer une photo avec caption"""
    data = {
        'chat_id': chat_id,
        'caption': caption,
        'parse_mode': 'Markdown'
    }
    if reply_markup:
        data['reply_markup'] = reply_markup
    
    try:
        # Essayer d'envoyer la photo depuis le fichier
        with open(photo_path, 'rb') as photo:
            files = {'photo': photo}
            response = requests.post(f"{TELEGRAM_API_URL}/sendPhoto", files=files, data=data)
            return response.json()
    except FileNotFoundError:
        print(f"Photo {photo_path} non trouvée, envoi du texte seulement")
        return send_message(chat_id, caption, reply_markup)
    except Exception as e:
        print(f"Erreur envoi photo: {e}")
        return send_message(chat_id, caption, reply_markup)

def get_updates(offset=None):
    """Récupérer les mises à jour du bot (optimisé)"""
    params = {'timeout': 20}  # Timeout plus court
    if offset:
        params['offset'] = offset
    
    try:
        response = requests.get(f"{TELEGRAM_API_URL}/getUpdates", params=params, timeout=25)
        return response.json()
    except Exception as e:
        print(f"Erreur getUpdates: {e}")
        return {'ok': False, 'result': []}

def handle_start(chat_id):
    """Gérer la commande /start"""
    caption = """🌟 BIENVENUE CHEZ LE SHOP DE MANY �
NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 �"""
    
    reply_markup = {
        'inline_keyboard': [
            [
                {
                    'text': "� CANAL TELEGRAM ↗",
                    'url': CANAL_URL
                }
            ],
            [
                {
                    'text': "� SNAPCHAT ↗",
                    'url': CONTACT_URL
                }
            ],
            [
                {
                    'text': "� MENU MINI-APP",
                    'web_app': {'url': MINI_APP_URL}
                }
            ]
        ]
    }
    
    # Essayer d'envoyer la photo
    result = send_photo(chat_id, 'logo.jpg', caption, json.dumps(reply_markup))
    
    if not result or not result.get('ok'):
        # Fallback: envoyer juste le texte
        send_message(chat_id, f"� **BIENVENUE CHEZ LE SHOP DE MANY** �\n\n{caption}", json.dumps(reply_markup))

def handle_help(chat_id):
    """Gérer la commande /help"""
    text = """🤖 *Commandes disponibles:*
/start - Lancer le bot et voir la mini-app
/help - Voir cette aide

📱 *Mini App:* Tous nos produits et commandes
📢 *Canal:* Les dernières nouveautés
📞 *Contact:* Commande directe sur Snapchat"""
    
    send_message(chat_id, text)

def handle_message(update):
    """Gérer les messages entrants"""
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    
    if not chat_id or not text:
        return
    
    if text == '/start':
        handle_start(chat_id)
    elif text == '/help':
        handle_help(chat_id)
    else:
        send_message(chat_id, 'Utilisez /start pour accéder à la mini-app Le Shop De Many 🌿')

def bot_polling():
    """Boucle de polling optimisée"""
    print("🤖 Démarrage du bot Telegram optimisé...")
    offset = 0
    
    while True:
        try:
            updates = get_updates(offset)
            
            if updates.get('ok'):
                for update in updates.get('result', []):
                    handle_message(update)
                    offset = update.get('update_id', 0) + 1
            
            # Pause plus longue pour économiser les ressources
            time.sleep(3)  # 3 secondes au lieu de 1
            
        except KeyboardInterrupt:
            print("🛑 Arrêt du bot...")
            break
        except Exception as e:
            print(f"Erreur dans la boucle du bot: {e}")
            time.sleep(10)  # Attendre plus longtemps en cas d'erreur

def set_webhook():
    """Configurer le webhook pour Railway"""
    webhook_url = f"{MINI_APP_URL}/webhook"
    data = {'url': webhook_url}
    
    try:
        response = requests.post(f"{TELEGRAM_API_URL}/setWebhook", json=data)
        result = response.json()
        if result.get('ok'):
            print(f"✅ Webhook configuré: {webhook_url}")
        else:
            print(f"❌ Erreur webhook: {result}")
        return result.get('ok', False)
    except Exception as e:
        print(f"Erreur configuration webhook: {e}")
        return False

def start_bot_thread():
    """Démarrer le bot dans un thread séparé"""
    if not BOT_TOKEN:
        print("❌ BOT_TOKEN non défini")
        return
    
    # Essayer de configurer le webhook pour Railway
    if MINI_APP_URL:
        webhook_success = set_webhook()
        if webhook_success:
            print("🤖 Bot Telegram configuré avec webhook")
            return  # Ne pas démarrer le polling si webhook configuré
        else:
            print("⚠️ Webhook échoué, utilisation du polling")
    
    # Fallback: utiliser le polling
    bot_thread = threading.Thread(target=bot_polling, daemon=True)
    bot_thread.start()
    print("🤖 Bot Telegram démarré en arrière-plan (polling)")

# Point d'entrée pour le bot
if __name__ == '__main__':
    start_bot_thread()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("🛑 Arrêt du bot...")

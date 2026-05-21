#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Le Shop De Many - Bot Telegram en Python
Compatible avec webhooks pour Railway
"""

import requests
import json
import os

# Configuration
BOT_TOKEN = os.environ.get('BOT_TOKEN')
MINI_APP_URL = os.environ.get('MINI_APP_URL', 'https://web-production-77d3d.up.railway.app')
CANAL_URL = 'https://t.me/LeShopDeMany'
CONTACT_URL = 'https://snapchat.com/add/many.zz5'
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

def send_photo(chat_id, caption, reply_markup=None):
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
        with open('logo.jpg', 'rb') as photo:
            files = {'photo': photo}
            response = requests.post(f"{TELEGRAM_API_URL}/sendPhoto", files=files, data=data)
            return response.json()
    except FileNotFoundError:
        print(f"Photo non trouvée, envoi du texte seulement")
        return send_message(chat_id, caption, reply_markup)
    except Exception as e:
        print(f"Erreur envoi photo: {e}")
        return send_message(chat_id, caption, reply_markup)

def handle_start(chat_id):
    """Gérer la commande /start"""
    print(f"🎯 Traitement /start pour chat_id: {chat_id}")
    caption = """🌟 BIENVENUE CHEZ LE SHOP DE MANY 🌟
NOUS TE LAISSONS NAVIGUER SUR NOTRE MINI-APP 📱
🔥 Produits Premium - 59-62 🔥"""
    
    reply_markup = {
        'inline_keyboard': [
            [
                {
                    'text': "📢 CANAL TELEGRAM ↗",
                    'url': CANAL_URL
                }
            ],
            [
                {
                    'text': "📸 SNAPCHAT ↗",
                    'url': CONTACT_URL
                }
            ],
            [
                {
                    'text': "📱 MENU MINI-APP",
                    'web_app': {'url': MINI_APP_URL}
                }
            ]
        ]
    }
    
    print(f"📤 Envoi message à {chat_id}")
    # Essayer d'envoyer la photo
    result = send_photo(chat_id, caption, json.dumps(reply_markup))
    print(f"📊 Résultat envoi photo: {result}")
    
    if not result or not result.get('ok'):
        # Fallback: envoyer juste le texte
        print("⚠️ Photo échouée, envoi texte")
        send_message(chat_id, f"🌟 **BIENVENUE CHEZ LE SHOP DE MANY** 🌟\n\n{caption}", json.dumps(reply_markup))

def handle_message(update):
    """Gérer les messages entrants"""
    print(f"📨 Message reçu: {update}")
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    
    print(f"📊 Chat ID: {chat_id}, Text: {text}")
    
    if not chat_id or not text:
        print("⚠️ Chat ID ou texte manquant")
        return
    
    if text == '/start':
        print("🚀 Commande /start détectée")
        handle_start(chat_id)
    else:
        print("❓ Commande inconnue")
        send_message(chat_id, 'Utilisez /start pour accéder à la mini-app Le Shop De Many 🌿')

def set_webhook(webhook_url):
    """Configurer le webhook"""
    data = {'url': webhook_url}
    
    try:
        response = requests.post(f"{TELEGRAM_API_URL}/setWebhook", json=data)
        result = response.json()
        if result.get('ok'):
            print(f"✅ Webhook configuré: {webhook_url}")
            return True
        else:
            print(f"❌ Erreur webhook: {result}")
            return False
    except Exception as e:
        print(f"Erreur configuration webhook: {e}")
        return False

if __name__ == '__main__':
    # Test local
    print("Bot Telegram prêt")
    print(f"BOT_TOKEN: {BOT_TOKEN[:10]}..." if BOT_TOKEN else "BOT_TOKEN non défini")

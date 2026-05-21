#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Farm Island - Mini App Telegram
Serveur web + Bot Telegram combinés
"""

import os
import json
import requests
from flask import Flask, send_from_directory, request, jsonify
from datetime import datetime
import threading
import subprocess
import time
import base64
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='frontend')

# ==========================================
# FICHIER DE DONNÉES
# ==========================================
import os
DATA_FILE = os.path.join(os.getcwd(), 'products.json')

def load_products():
    """Charger les produits depuis le fichier JSON"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Erreur chargement produits: {e}")
            return []
    else:
        print(f"📁 Fichier {DATA_FILE} non trouvé, création vide")
        return []

def save_products(products):
    """Sauvegarder les produits dans le fichier JSON"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"✅ {len(products)} produits sauvegardés dans {DATA_FILE}")
        return True
    except Exception as e:
        print(f"❌ Erreur sauvegarde produits: {e}")
        return False

# ==========================================
# ROUTES API - WEBHOOK TELEGRAM
# ==========================================
@app.route('/webhook', methods=['POST'])
def telegram_webhook():
    """Endpoint pour le webhook Telegram"""
    try:
        from bot import handle_message
        update = request.json
        if not update:
            return jsonify({'ok': False}), 400
        
        handle_message(update)
        return jsonify({'ok': True})
    except Exception as e:
        print(f"Erreur webhook: {e}")
        return jsonify({'ok': False}), 500

# ==========================================
# ROUTES API
# ==========================================
@app.route('/api/upload', methods=['POST'])
def upload_media():
    """Uploader un fichier média (photo/vidéo)"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'Aucun fichier'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'Nom de fichier vide'}), 400
        
        # Sécuriser le nom du fichier
        filename = secure_filename(file.filename)
        
        # Créer le dossier uploads s'il n'existe pas
        upload_dir = os.path.join(os.getcwd(), 'uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Sauvegarder le fichier
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)
        
        # Retourner l'URL du fichier
        file_url = f"/uploads/{filename}"
        
        print(f"✅ Fichier uploadé: {file_path}")
        return jsonify({
            'success': True, 
            'url': file_url,
            'filename': filename
        })
        
    except Exception as e:
        print(f"❌ Erreur upload: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Servir les fichiers uploadés"""
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_dir, filename)

@app.route('/api/products', methods=['GET'])
def get_products():
    """Récupérer tous les produits personnalisés"""
    products = load_products()
    return jsonify({'success': True, 'products': products})

@app.route('/api/products', methods=['POST'])
def add_product():
    """Ajouter un nouveau produit"""
    try:
        product_data = request.get_json()
        
        # Validation des données
        required_fields = ['name', 'price', 'category']
        for field in required_fields:
            if not product_data.get(field):
                return jsonify({'success': False, 'error': f'Champ {field} requis'}), 400
        
        # Si une image est fournie en base64, l'uploader d'abord
        image_url = product_data.get('image', 'bg.jpg')
        if image_url and image_url.startswith('data:'):
            # Convertir base64 en fichier et l'uploader
            try:
                # Extraire les données base64
                header, data = image_url.split(',', 1)
                file_data = base64.b64decode(data)
                
                # Créer le nom de fichier
                media_type = product_data.get('mediaType', 'image')
                ext = 'mp4' if media_type == 'video' else 'jpg'
                filename = f"product_{int(time.time())}.{ext}"
                
                # Sauvegarder le fichier
                upload_dir = os.path.join(os.getcwd(), 'uploads')
                if not os.path.exists(upload_dir):
                    os.makedirs(upload_dir)
                
                file_path = os.path.join(upload_dir, filename)
                with open(file_path, 'wb') as f:
                    f.write(file_data)
                
                # Utiliser l'URL du fichier sauvegardé
                image_url = f"/uploads/{filename}"
                print(f"✅ Média sauvegardé: {file_path}")
                
            except Exception as e:
                print(f"❌ Erreur sauvegarde média: {e}")
                image_url = 'bg.jpg'  # Fallback
        
        # Ajouter le produit
        products = load_products()
        new_product = {
            'id': len(products) + 1,
            'name': product_data['name'],
            'category': product_data['category'],  # Nouveau champ catégorie
            'price': product_data['price'],  # Garder en texte pour "1G: 20€, 2G: 35€..."
            'puffs': product_data.get('puffs', 'Non spécifié'),
            'description': product_data.get('description', ''),
            'image': image_url,
            'mediaType': product_data.get('mediaType', 'image'),
            'custom': True,
            'created': datetime.now().isoformat()
        }
        
        products.append(new_product)
        
        if save_products(products):
            return jsonify({'success': True, 'product': new_product})
        else:
            return jsonify({'success': False, 'error': 'Erreur sauvegarde'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Supprimer un produit"""
    try:
        products = load_products()
        original_length = len(products)
        
        # Filtrer le produit à supprimer
        products = [p for p in products if p['id'] != product_id]
        
        if len(products) == original_length:
            return jsonify({'success': False, 'error': 'Produit non trouvé'}), 404
        
        if save_products(products):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Erreur sauvegarde'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==========================================
# ROUTES STATIQUES
# ==========================================
# Route principale - sert index.html
@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

# Route pour servir tous les fichiers statiques
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)

# ==========================================
# DÉMARRAGE BOT TELEGRAM
# ==========================================
def start_telegram_bot():
    """Démarrer le bot Telegram en Python dans un thread séparé"""
    try:
        # Importer et lancer le bot Python
        from bot import start_bot_thread
        start_bot_thread()
    except Exception as e:
        print(f"❌ Erreur démarrage bot: {e}")

# ==========================================
# DÉMARRAGE
# ==========================================
if __name__ == '__main__':
    # Créer le fichier JSON s'il n'existe pas
    if not os.path.exists(DATA_FILE):
        save_products([])
    
    # Démarrer le bot Telegram en arrière-plan léger
    # Configurer le webhook au démarrage
    try:
        from bot import set_webhook
        MINI_APP_URL = os.environ.get('MINI_APP_URL', 'https://web-production-77d3d.up.railway.app')
        
        # S'assurer que l'URL a le protocole HTTPS
        if MINI_APP_URL and not MINI_APP_URL.startswith('https://'):
            MINI_APP_URL = 'https://' + MINI_APP_URL
        
        if MINI_APP_URL:
            webhook_url = f"{MINI_APP_URL}/webhook"
            set_webhook(webhook_url)
        else:
            print("⚠️ MINI_APP_URL non défini")
    except Exception as e:
        print(f"⚠️ Erreur configuration webhook: {e}")
    
    # Démarrer le serveur Flask (priorité absolue)
    port = int(os.environ.get('PORT', 8080))
    print(f"🌐 Démarrage du serveur web sur le port {port}")
    app.run(host='0.0.0.0', port=port, threaded=True)

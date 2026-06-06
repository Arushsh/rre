from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import os
import requests
from io import BytesIO
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/face-search', methods=['POST'])
def face_search():
    data = request.json
    target_image_url = data.get('target_image_url')
    gallery_urls = data.get('gallery_urls')
    
    if not target_image_url or not gallery_urls:
        return jsonify({"error": "Missing data"}), 400

    try:
        # Load target image
        response = requests.get(target_image_url)
        target_img = face_recognition.load_image_file(BytesIO(response.content))
        target_encodings = face_recognition.face_encodings(target_img)
        
        if not target_encodings:
            return jsonify({"error": "No face found in target image"}), 400
        
        target_encoding = target_encodings[0]
        matches = []

        # Scan gallery
        for url in gallery_urls:
            try:
                res = requests.get(url)
                img = face_recognition.load_image_file(BytesIO(res.content))
                encodings = face_recognition.face_encodings(img)
                
                for enc in encodings:
                    results = face_recognition.compare_faces([target_encoding], enc, tolerance=0.6)
                    if results[0]:
                        matches.append(url)
                        break
            except Exception as e:
                print(f"Error processing {url}: {e}")
                continue

        return jsonify({"matches": matches})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-caption', methods=['POST'])
def generate_caption():
    data = request.json
    event_type = data.get('event_type', 'wedding')
    
    captions = {
        "wedding": [
            "A match made in heaven. ✨ #WeddingVibes",
            "Together is a beautiful place to be. ❤️",
            "Locked in forever! 💍 #JustMarried"
        ],
        "instagram": [
            "Capturing moments, creating memories. 📸",
            "Living my best life! ✨",
            "Style is a reflection of your attitude. 👗"
        ]
    }
    
    import random
    selected = random.choice(captions.get(event_type, captions['instagram']))
    return jsonify({"caption": selected})

if __name__ == '__main__':
    app.run(port=8000, debug=True)

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from models import db
from auth import auth_bp
from io import BytesIO
import qrcode
from qr import generate_qr_buffer
from qr_scan import scan_qr_from_image

app=Flask(__name__)
CORS(app) # Allow requests from React frontend


#Database configuration
app.config['SQLALCHEMY_DATABASE_URI']="sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db.init_app(app)


@app.route('/')
def home():
    return jsonify({"message": "QR Code Generator API is running!"})

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json.get("data") if request.is_json else None
    if not data:
        return jsonify({"error": "Missing 'data' parameter"}), 400

    buffer = generate_qr_buffer(data)
    return send_file(buffer, mimetype="image/png")

@app.route('/verify_qr', methods=['POST'])
def verify_qr():
    data = request.json.get("data")
    if not data:
        return jsonify({"error": "No QR data provided"}), 400
    # (In a real app, you could verify against a database or token)
    if data.strip():
        return jsonify({
            "status": "approved",
            "message": "QR code approved successfully ✅",
            "data": data
        })
    else:
        return jsonify({
            "status": "rejected",
            "message": "Invalid QR code ❌"
        }), 400

@app.route('/decode_qr', methods=['POST'])
def decode_qr():
    data = request.json.get("image")
    if not data:
        return jsonify({"error": "No image provided"}), 400

    decoded_text = scan_qr_from_image(data)
    if decoded_text:
        # You can verify it if you want (like in /verify_qr)
        return jsonify({
            "status": "approved",
            "message": "QR decoded successfully ✅",
            "data": decoded_text
        })
    else:
        return jsonify({
            "status": "rejected",
            "message": "No valid QR found ❌"
        }), 400



if __name__ == "__main__":
    app.run(debug=True, port=5000)

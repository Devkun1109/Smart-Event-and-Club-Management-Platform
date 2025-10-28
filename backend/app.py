from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import qrcode
from qr import generate_qr_buffer

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

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


if __name__ == "__main__":
    app.run(debug=True, port=5000)

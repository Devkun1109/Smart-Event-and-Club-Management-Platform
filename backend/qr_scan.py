import cv2
import numpy as np
import base64

def scan_qr_from_image(base64_image):
    try:
        # Remove the base64 header (data:image/png;base64, ...)
        img_data = base64_image.split(",")[1]
        img_bytes = base64.b64decode(img_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        detector = cv2.QRCodeDetector()
        value, _, _ = detector.detectAndDecode(img)

        if value:
            return value
        else:
            return None
    except Exception as e:
        print("Error scanning QR:", e)
        return None

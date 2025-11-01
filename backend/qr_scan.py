import cv2
import numpy as np
import base64
import json
from models import db, User, Event, Registration  # make sure these exist

def scan_qr_from_image(base64_image):
    try:
        # Remove the base64 header (data:image/png;base64, ...)
        img_data = base64_image.split(",")[1]
        img_bytes = base64.b64decode(img_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        detector = cv2.QRCodeDetector()
        value, _, _ = detector.detectAndDecode(img)

        if not value:
            return None

        # Try parsing QR data (assuming JSON format)
        try:
            qr_data = json.loads(value)
        except json.JSONDecodeError:
            print("Invalid QR format (not JSON):", value)
            return None

        student_email = qr_data.get("student_email")
        event_id = qr_data.get("event_id")

        if not (student_email and event_id):
            print("Missing required QR fields")
            return None

        # Check if student and registration exist
        user = User.query.filter_by(email=student_email, role="student").first()
        event = Event.query.get(event_id)

        if not user or not event:
            print("Invalid student or event")
            return None

        registration = Registration.query.filter_by(
            student_id=user.id,
            event_id=event.id
        ).first()

        if not registration:
            print("Student not registered for this event ❌")
            return None

        # Mark attendance
        if not registration.is_present:
            registration.is_present = True
            db.session.commit()
            print(f"✅ Marked {student_email} present for {event.name}")
        else:
            print(f"⚠️ {student_email} already marked present")

        return {
            "student": user.name,
            "email": user.email,
            "event": event.name,
            "status": "Present"
        }

    except Exception as e:
        print("Error scanning QR:", e)
        return None

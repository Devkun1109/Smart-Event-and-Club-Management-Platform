# backend/auth.py
from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash

auth_bp = Blueprint("auth", __name__)

# ------------------------------------------------
# 🧩 SEED DEFAULT USERS (created only if missing)
# ------------------------------------------------
def seed_default_users():
    defaults = [
        {"name": "Dev Student", "email": "student@dev.local", "password": "student123", "role": "student"},
        {"name": "Dev Organizer", "email": "organizer@dev.local", "password": "organizer123", "role": "organizer"},
        {"name": "Dev Admin", "email": "admin@dev.local", "password": "admin123", "role": "admin"},
    ]
    created = []
    for user_data in defaults:
        existing = User.query.filter_by(email=user_data["email"]).first()
        if not existing:
            new_user = User(
                name=user_data["name"],
                email=user_data["email"],
                role=user_data["role"]
            )
            new_user.set_password(user_data["password"])
            db.session.add(new_user)
            created.append(user_data["email"])
    if created:
        db.session.commit()
        print(f"✅ Seeded users: {created}")
    else:
        print("⚙️ Default users already exist.")


# ------------------------------------------------
# ✅ Signup route
# ------------------------------------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([name, email, password, role]):
        return jsonify({"error": "All fields (name, email, password, role) are required"}), 400

    if role.lower() not in ["student", "organizer", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(name=name, email=email, role=role.lower())
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"{role.capitalize()} signed up successfully ✅",
        "user": {"name": name, "email": email, "role": role}
    }), 201


# ------------------------------------------------
# ✅ Login route
# ------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([email, password, role]):
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(email=email, role=role.lower()).first()

    if not user or not user.check_password(password):
        return jsonify({
            "status": "failed",
            "message": "Invalid email or password ❌"
        }), 401

    return jsonify({
        "status": "success",
        "message": f"{role.capitalize()} login successful ✅",
        "user": {"name": user.name, "email": user.email, "role": user.role}
    }), 200


# ------------------------------------------------
# 🔧 Register seeding when blueprint is loaded
# ------------------------------------------------
@auth_bp.record_once
def on_load(state):
    with state.app.app_context():
        db.create_all()
        seed_default_users()

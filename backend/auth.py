from flask import Blueprint, request, jsonify
from models import db, User

auth_bp = Blueprint("auth", __name__)

# ✅ Signup route
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

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    # Create new user
    new_user = User(name=name, email=email, role=role.lower())
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"{role.capitalize()} signed up successfully ✅",
        "user": {"name": name, "email": email, "role": role}
    }), 201


# ✅ Login route
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

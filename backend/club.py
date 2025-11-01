# backend/club.py
from flask import Blueprint, request, jsonify
from models import db, Club, User
from werkzeug.security import generate_password_hash

club_bp = Blueprint("club", __name__)

# ✅ Register a new club (admin only)
@club_bp.route("/register", methods=["POST"])
def register_club():
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    club_name = data.get("clubName")
    email = data.get("email")
    password = data.get("password")
    description = data.get("description")
    category = data.get("category")
    coordinator = data.get("coordinator")
    contact = data.get("contact")
    admin_email = data.get("admin_email")  # who is performing the action

    # ✅ Validate fields
    if not all([club_name, email, password, description, category]):
        return jsonify({"error": "Missing required fields"}), 400

    # ✅ Check if admin is valid
    admin = User.query.filter_by(email=admin_email, role="admin").first()
    if not admin:
        return jsonify({"error": "Unauthorized — only admins can register clubs"}), 403

    # ✅ Check for duplicates
    if Club.query.filter((Club.club_name == club_name) | (Club.email == email)).first():
        return jsonify({"error": "Club name or email already exists"}), 409

    # ✅ Create and store the club
    new_club = Club(
        club_name=club_name,
        email=email,
        description=description,
        category=category,
        coordinator=coordinator,
        contact=contact,
    )
    new_club.set_password(password)

    db.session.add(new_club)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Club '{club_name}' registered successfully ✅",
        "club": {
            "id": new_club.id,
            "club_name": new_club.club_name,
            "email": new_club.email,
            "category": new_club.category,
            "coordinator": new_club.coordinator,
            "contact": new_club.contact
        }
    }), 201


# ✅ Get all clubs
@club_bp.route("/list", methods=["GET"])
def list_clubs():
    clubs = Club.query.all()
    club_list = [{
        "id": c.id,
        "club_name": c.club_name,
        "email": c.email,
        "category": c.category,
        "coordinator": c.coordinator,
        "contact": c.contact,
        "description": c.description
    } for c in clubs]

    return jsonify({
        "status": "success",
        "clubs": club_list
    }), 200


# ✅ Delete a club (admin only)
@club_bp.route("/delete/<int:club_id>", methods=["DELETE"])
def delete_club(club_id):
    admin_email = request.args.get("admin_email")
    if not admin_email:
        return jsonify({"error": "Missing admin_email parameter"}), 400

    admin = User.query.filter_by(email=admin_email, role="admin").first()
    if not admin:
        return jsonify({"error": "Unauthorized — only admins can delete clubs"}), 403

    club = Club.query.get(club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Club '{club.club_name}' deleted successfully 🗑️"
    }), 200

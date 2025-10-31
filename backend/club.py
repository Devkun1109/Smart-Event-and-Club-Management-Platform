# backend/club.py
from flask import Blueprint, request, jsonify
from models import db, Club, User

club_bp = Blueprint("club", __name__)

# ✅ Add a new club (admin only)
@club_bp.route("/add", methods=["POST"])
def add_club():
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get("name")
    description = data.get("description", "")
    created_by = data.get("created_by")

    if not all([name, created_by]):
        return jsonify({"error": "Missing required fields"}), 400

    # Verify that creator is an admin
    admin = User.query.filter_by(email=created_by, role="admin").first()
    if not admin:
        return jsonify({"error": "Unauthorized – only admins can add clubs"}), 403

    # Prevent duplicate club names
    existing = Club.query.filter_by(name=name).first()
    if existing:
        return jsonify({"error": "Club already exists"}), 409

    new_club = Club(name=name, description=description, created_by=created_by)
    db.session.add(new_club)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Club '{name}' added successfully ✅",
        "club": new_club.to_dict()
    }), 201


# ✅ View all clubs
@club_bp.route("/list", methods=["GET"])
def list_clubs():
    clubs = Club.query.all()
    return jsonify({
        "status": "success",
        "clubs": [club.to_dict() for club in clubs]
    })


# ✅ Delete a club (admin only)
@club_bp.route("/delete/<int:club_id>", methods=["DELETE"])
def delete_club(club_id):
    admin_email = request.args.get("admin_email")

    if not admin_email:
        return jsonify({"error": "Missing admin_email parameter"}), 400

    admin = User.query.filter_by(email=admin_email, role="admin").first()
    if not admin:
        return jsonify({"error": "Unauthorized – only admins can delete clubs"}), 403

    club = Club.query.get(club_id)
    if not club:
        return jsonify({"error": "Club not found"}), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Club '{club.name}' deleted successfully 🗑️"
    }), 200

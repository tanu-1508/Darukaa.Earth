from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json() or {}
    response, status_code = AuthService.register_user(data)
    return jsonify(response), status_code


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and issue a token."""
    data = request.get_json() or {}
    response, status_code = AuthService.login_user(data)
    return jsonify(response), status_code


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Retrieve authenticated user identity."""
    response, status_code = AuthService.get_current_user_profile()
    return jsonify(response), status_code


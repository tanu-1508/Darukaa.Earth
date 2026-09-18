"""Authentication service module for Darukaa.Earth."""

from typing import Tuple, Dict, Any

from flask_jwt_extended import create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from extensions.database import db
from models.user import User


class AuthService:
    """Service handling user registration, authentication, and token issuance."""

    @staticmethod
    def register_user(data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """Validate and persist a new user with a hashed password."""
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = data.get("password")

        if not name or not email or not isinstance(password, str) or len(password) < 8:
            return {
                "success": False,
                "message": "Name, email, and a password of at least 8 characters are required.",
            }, 400

        if User.query.filter_by(email=email).first():
            return {"success": False, "message": "An account with this email already exists."}, 409

        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"success": False, "message": "An account with this email already exists."}, 409

        return {
            "success": True,
            "message": "User registered successfully",
            "data": {"user": user.to_dict()},
        }, 201

    @staticmethod
    def login_user(data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """Verify credentials and issue an access token."""
        email = str(data.get("email", "")).strip().lower()
        password = data.get("password")
        user = User.query.filter_by(email=email).first()

        if not user or not isinstance(password, str) or not user.check_password(password):
            return {"success": False, "message": "Invalid email or password."}, 401

        return {
            "success": True,
            "message": "User logged in successfully",
            "data": {
                "token": create_access_token(identity=str(user.id)),
                "user": user.to_dict(),
            },
        }, 200

    @staticmethod
    def get_current_user_profile(user_id: Any = None) -> Tuple[Dict[str, Any], int]:
        """Fetch the authenticated user's safe profile."""
        identity = user_id or get_jwt_identity()
        user = db.session.get(User, int(identity))
        if not user:
            return {"success": False, "message": "User not found."}, 404

        return {
            "success": True,
            "message": "User profile retrieved",
            "data": {"user": user.to_dict()},
        }, 200


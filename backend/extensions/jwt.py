from flask import jsonify
from flask_jwt_extended import JWTManager

# Initialize Flask-JWT-Extended extension
jwt = JWTManager()


def init_jwt(app):
    """Initialize JWT extension with custom error handlers returning consistent JSON."""
    jwt.init_app(app)

    @jwt.unauthorized_loader
    def custom_unauthorized_response(err_str):
        return jsonify({
            "success": False,
            "message": "Missing Authorization Header",
            "error": err_str
        }), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_response(err_str):
        return jsonify({
            "success": False,
            "message": "Invalid JWT token",
            "error": err_str
        }), 401

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "The token has expired",
            "error": "token_expired"
        }), 401

    @jwt.revoked_token_loader
    def custom_revoked_token_response(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Token has been revoked",
            "error": "token_revoked"
        }), 401


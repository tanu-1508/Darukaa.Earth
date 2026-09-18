from flask import Flask
from .auth_routes import auth_bp
from .project_routes import project_bp
from .site_routes import site_bp
from .analytics_routes import analytics_bp


def register_blueprints(app: Flask) -> None:
    """Register all API route blueprints with the Flask application."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(site_bp)
    app.register_blueprint(analytics_bp)


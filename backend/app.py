import os
import sys
from pathlib import Path

# Ensure the backend directory is in sys.path for robust resolution
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import config_by_name
from extensions import db, migrate, init_jwt
from routes import register_blueprints
import models  # Register SQLAlchemy models with metadata


def register_error_handlers(app: Flask) -> None:
    """Register JSON error handlers for standard HTTP errors."""

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "message": "Bad Request",
            "error": str(error.description if hasattr(error, "description") else error)
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            "success": False,
            "message": "Unauthorized access",
            "error": str(error.description if hasattr(error, "description") else error)
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            "success": False,
            "message": "Forbidden",
            "error": str(error.description if hasattr(error, "description") else error)
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "Resource not found",
            "error": str(error.description if hasattr(error, "description") else error)
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "message": "Method Not Allowed",
            "error": str(error.description if hasattr(error, "description") else error)
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "message": "Internal Server Error",
            "error": "An unexpected server error occurred."
        }), 500

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({
            "success": False,
            "message": error.name,
            "error": error.description
        }), error.code

    @app.errorhandler(Exception)
    def handle_unhandled_exception(error):
        app.logger.error(f"Unhandled Exception: {str(error)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": "Internal Server Error",
            "error": str(error) if app.config.get("DEBUG") else "An internal server error occurred."
        }), 500


def create_app(config_name: str | None = None) -> Flask:
    """Application factory for Darukaa.Earth Flask backend."""
    app = Flask(__name__)

    # Load configuration
    env_name = config_name or os.getenv("FLASK_ENV", "development")
    app_config = config_by_name.get(env_name, config_by_name["default"])
    app.config.from_object(app_config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    init_jwt(app)

    # Configure CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Register API blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "success": True,
            "message": "Darukaa.Earth API is running"
        }), 200

    # Database health check endpoint
    @app.route("/api/health/db", methods=["GET"])
    def health_db():
        """Verify database connection and PostGIS availability."""
        try:
            with db.engine.connect() as conn:
                database = conn.execute(
                    db.text("SELECT current_database()")
                ).scalar_one()
                postgis_exists = bool(
                    conn.execute(
                        db.text(
                            "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis')"
                        )
                    ).scalar_one()
                )
                version = conn.execute(
                    db.text("SELECT postgis_version()")
                ).scalar_one()
            return jsonify({
                "success": True,
                "database": "PostgreSQL",
                "database_name": database,
                "postgis": postgis_exists,
                "postgis_version": version,
            }), 200
        except Exception as exc:
            app.logger.error("Database health check failed: %s", exc, exc_info=True)
            return jsonify({
                "success": False,
                "message": "Database connection failed",
                "error": exc.__class__.__name__,
            }), 503

    # Custom CLI command to initialize database tables
    @app.cli.command("init-db")
    def init_db():
        """Initialize database tables for local development."""
        with app.app_context():
            db.create_all()
            print("Database tables initialized successfully.")

    @app.cli.command("seed-analytics-dev")
    def seed_analytics_dev():
        """Add non-destructive development analytics for the first available site."""
        from datetime import date
        from models.analytics import SiteAnalytics
        from models.site import Site

        with app.app_context():
            site = Site.query.order_by(Site.id.asc()).first()
            if not site:
                print("No site found; create a site before seeding development analytics.")
                return
            existing_dates = {record.date for record in SiteAnalytics.query.filter_by(site_id=site.id).all()}
            seed_records = [
                (date(2026, 1, 1), 118.0, 74.0, 0.58),
                (date(2026, 3, 1), 121.5, 76.0, 0.63),
                (date(2026, 5, 1), 125.2, 79.0, 0.69),
                (date(2026, 7, 1), 129.8, 81.0, 0.73),
            ]
            added = 0
            for record_date, carbon, biodiversity, vegetation in seed_records:
                if record_date not in existing_dates:
                    db.session.add(SiteAnalytics(site_id=site.id, date=record_date, carbon_value=carbon, biodiversity_score=biodiversity, vegetation_index=vegetation))
                    added += 1
            db.session.commit()
            print(f"Added {added} development analytics records for site {site.id}; existing records were preserved.")

    return app


# Application entry point for `python app.py` or WSGI servers
app = create_app()

if __name__ == "__main__":
    with app.app_context():
        # Ensure database tables exist automatically in development SQLite mode
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)


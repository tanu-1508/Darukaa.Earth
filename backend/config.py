import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Base directory of the backend package
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env if present
load_dotenv(BASE_DIR / ".env")


class Config:
    """Base configuration class."""

    # Environment & Debugging
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = False
    TESTING = False

    # Security Keys
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-darukaa-earth-platform")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-darukaa-earth-platform")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Database Configuration
    # DATABASE_URL must be set via environment variable; testing config uses SQLite memory
    _env_name = os.getenv("FLASK_ENV", "development")
    _raw_db_url = os.getenv("DATABASE_URL", "").strip()
    if not _raw_db_url:
        if _env_name == "testing":
            _raw_db_url = "sqlite:///:memory:"
        else:
            raise RuntimeError(
                "DATABASE_URL is required. Copy backend/.env.example to backend/.env "
                "and set a PostgreSQL connection string."
            )
    elif _raw_db_url.startswith("postgres://"):
        # Fix legacy Heroku / cloud provider PostgreSQL schema prefix
        _raw_db_url = _raw_db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = _raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS Configuration
    _cors_env = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
    )
    CORS_ORIGINS = [origin.strip() for origin in _cors_env.split(",") if origin.strip()]


class DevelopmentConfig(Config):
    """Development environment configuration."""

    DEBUG = True


class TestingConfig(Config):
    """Testing environment configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProductionConfig(Config):
    """Production environment configuration."""

    DEBUG = False
    # Ensure production environment enforces explicit secure keys
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


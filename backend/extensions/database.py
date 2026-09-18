from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize SQLAlchemy and Flask-Migrate extensions
# Both can be initialized with an app instance via init_app(app)
db = SQLAlchemy()
migrate = Migrate()


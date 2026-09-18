from datetime import datetime, timezone
from extensions.database import db


class Project(db.Model):
    """Project model representing geospatial monitoring initiatives."""

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    project_type = db.Column(db.String(50), default="canopy_surveillance", nullable=False)
    status = db.Column(db.String(30), default="active", nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    sites = db.relationship("Site", backref="project", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_sites: bool = False) -> dict:
        """Return dictionary representation of the project."""
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "project_type": self.project_type,
            "status": self.status,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "sites_count": len(self.sites) if self.sites else 0,
        }
        if include_sites and self.sites:
            data["sites"] = [site.to_dict() for site in self.sites]
        return data

    def __repr__(self) -> str:
        return f"<Project {self.name}>"


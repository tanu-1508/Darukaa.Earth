import json
from datetime import datetime, timezone

from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from extensions.database import db


class Site(db.Model):
    """Site model representing monitored land parcels, sectors, and survey stations."""

    __tablename__ = "sites"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    area_hectares = db.Column(db.Float, nullable=True)
    geometry = db.Column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=False),
        nullable=True,
    )

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    analytics = db.relationship("SiteAnalytics", backref="site", lazy=True, cascade="all, delete-orphan")

    def get_geojson(self) -> dict | None:
        """Parse PostGIS geometry and return a GeoJSON-compatible dict."""
        if self.geometry is None:
            return None
        if isinstance(self.geometry, dict):
            return self.geometry
        if isinstance(self.geometry, str):
            try:
                return json.loads(self.geometry)
            except (ValueError, TypeError):
                return None
        try:
            shape = to_shape(self.geometry)
            geojson = mapping(shape)
            return {"type": geojson["type"], "coordinates": geojson["coordinates"]}
        except Exception:
            return None

    def to_dict(self, include_analytics: bool = False) -> dict:
        """Return dictionary representation of the site."""
        data = {
            "id": self.id,
            "project_id": self.project_id,
            "name": self.name,
            "description": self.description,
            "area_hectares": self.area_hectares,
            "geometry": self.get_geojson(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_analytics and self.analytics:
            data["analytics"] = [record.to_dict() for record in self.analytics]
        return data

    def __repr__(self) -> str:
        return f"<Site {self.name}>"


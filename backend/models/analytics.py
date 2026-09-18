from datetime import datetime, timezone, date
from extensions.database import db


class SiteAnalytics(db.Model):
    """SiteAnalytics model representing temporal environmental metrics, NDVI, and telemetry."""

    __tablename__ = "site_analytics"

    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey("sites.id"), nullable=False)
    date = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date(), nullable=False)
    carbon_value = db.Column(db.Float, nullable=True)  # e.g., metric tons CO2 equivalent / hectare
    biodiversity_score = db.Column(db.Float, nullable=True)  # Index score (e.g. 0 - 100)
    vegetation_index = db.Column(db.Float, nullable=True)  # NDVI index (-1.0 to 1.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self) -> dict:
        """Return dictionary representation of the analytics record."""
        return {
            "id": self.id,
            "site_id": self.site_id,
            "date": self.date.isoformat() if isinstance(self.date, (date, datetime)) else self.date,
            "carbon_value": self.carbon_value,
            "biodiversity_score": self.biodiversity_score,
            "vegetation_index": self.vegetation_index,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<SiteAnalytics site_id={self.site_id} date={self.date}>"


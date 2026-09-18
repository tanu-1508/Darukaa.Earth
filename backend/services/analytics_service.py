"""Analytics service module for Darukaa.Earth."""

import math
from datetime import date
from typing import Tuple, Dict, Any

from geoalchemy2.shape import to_shape

from extensions.database import db
from models.analytics import SiteAnalytics
from models.project import Project
from models.site import Site


class AnalyticsService:
    """Service handling environmental telemetry, carbon density, and NDVI time-series."""

    @staticmethod
    def _demo_values(site_id: int, geometry: Any) -> Dict[str, float]:
        """Compute deterministic demo metrics from the site's actual PostGIS geometry."""
        area = 0.0
        if geometry is not None:
            try:
                area = float(to_shape(geometry).area)
            except Exception:
                area = 0.0

        seed = (int(site_id) * 97) + max(int(round(area * 1000)), 0)
        carbon_value = round(110.0 + (seed % 61) + (area * 0.18), 2)
        biodiversity_score = round(54.0 + ((seed * 7) % 31) + math.sqrt(max(area, 0.0)) * 0.02, 2)
        vegetation_index = round(0.45 + (((seed * 11) % 1000) / 1000.0) * 0.44, 4)

        return {
            "carbon_value": carbon_value,
            "biodiversity_score": biodiversity_score,
            "vegetation_index": vegetation_index,
        }

    @staticmethod
    def get_site_analytics(site_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Return analytics only when the site belongs to the authenticated user."""
        site = Site.query.join(Project).filter(Site.id == site_id, Project.created_by == user_id).first()
        if not site:
            return {"success": False, "message": "Site not found."}, 404

        records = SiteAnalytics.query.filter_by(site_id=site_id).order_by(SiteAnalytics.date.asc()).all()
        return {
            "success": True,
            "message": "Analytics retrieved successfully",
            "data": {"site_id": site_id, "analytics": [record.to_dict() for record in records]},
        }, 200

    @staticmethod
    def generate_demo_analysis(site_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Create a deterministic demo spectral-analysis record in the existing site_analytics table."""
        site = Site.query.join(Project).filter(Site.id == site_id, Project.created_by == user_id).first()
        if not site:
            return {"success": False, "message": "Site not found."}, 404
        if site.geometry is None:
            return {"success": False, "message": "Site geometry is required before running a demo spectral analysis."}, 400

        metrics = AnalyticsService._demo_values(site_id, site.geometry)
        record = SiteAnalytics(
            site_id=site.id,
            date=date.today(),
            carbon_value=metrics["carbon_value"],
            biodiversity_score=metrics["biodiversity_score"],
            vegetation_index=metrics["vegetation_index"],
        )
        db.session.add(record)
        db.session.commit()

        return {
            "success": True,
            "message": "Demo spectral analysis completed successfully for this site.",
            "data": {"site_id": site.id, "analysis": record.to_dict()},
        }, 200

    @staticmethod
    def record_analytics(site_id: int, data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """Placeholder for appending a telemetry record."""
        return {
            "success": True,
            "message": f"Telemetry recorded for site {site_id} (placeholder)",
            "data": {
                "site_id": site_id,
                "recorded": data
            }
        }, 201


"""Site service module for Darukaa.Earth."""

import math
from typing import Tuple, Dict, Any, Optional

from geoalchemy2.shape import from_shape
from shapely.geometry import MultiPolygon, shape
from shapely.validation import explain_validity

from extensions.database import db
from models.project import Project
from models.site import Site


class SiteService:
    """Service handling CRUD operations for monitored sites and GeoJSON geometry."""

    @staticmethod
    def _geometry_from_geojson(geometry: Any):
        """Validate GeoJSON and normalize Polygon input to PostGIS MULTIPOLYGON."""
        if not isinstance(geometry, dict) or geometry.get("type") not in {"Polygon", "MultiPolygon"}:
            raise ValueError("Geometry must be a GeoJSON Polygon or MultiPolygon.")
        try:
            coordinates = geometry["coordinates"]
            coordinate_values = [value for polygon in coordinates for ring in (polygon if geometry["type"] == "MultiPolygon" else [polygon]) for point in ring for value in point]
            if any(not isinstance(value, (int, float)) or not math.isfinite(value) for value in coordinate_values):
                raise ValueError("Geometry coordinates must be finite numbers.")
            if any(abs(coordinate_values[index]) > (180 if index % 2 == 0 else 90) for index in range(len(coordinate_values))):
                raise ValueError("Geometry coordinates must use valid longitude and latitude ranges.")
            polygon = shape(geometry)
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            raise ValueError("Geometry must contain valid GeoJSON coordinates.") from exc
        if polygon.is_empty or not polygon.is_valid:
            raise ValueError(f"Geometry is invalid: {explain_validity(polygon)}")
        multipolygon = polygon if geometry["type"] == "MultiPolygon" else MultiPolygon([polygon])
        return from_shape(multipolygon, srid=4326)

    @staticmethod
    def _project_for_user(project_id: int, user_id: Any):
        return Project.query.filter_by(id=project_id, created_by=user_id).first()

    @staticmethod
    def get_all_sites(project_id: Optional[int] = None, user_id: Any = None) -> Tuple[Dict[str, Any], int]:
        """List sites belonging to projects owned by the authenticated user."""
        query = Site.query.join(Project).filter(Project.created_by == user_id)
        if project_id is not None:
            query = query.filter(Site.project_id == project_id)
        return {
            "success": True,
            "message": "Sites retrieved successfully",
            "data": [site.to_dict() for site in query.order_by(Site.updated_at.desc()).all()],
        }, 200

    @staticmethod
    def get_site_by_id(site_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Retrieve a site belonging to the authenticated user."""
        site = Site.query.join(Project).filter(Site.id == site_id, Project.created_by == user_id).first()
        if not site:
            return {"success": False, "message": "Site not found."}, 404
        return {
            "success": True,
            "message": "Site retrieved successfully",
            "data": site.to_dict(include_analytics=True),
        }, 200

    @staticmethod
    def create_site(data: Dict[str, Any], user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Create a site with validated PostGIS geometry."""
        name = str(data.get("name", "")).strip()
        project_id = data.get("project_id")
        if not name or not isinstance(project_id, int):
            return {"success": False, "message": "Project ID and site name are required."}, 400
        if not SiteService._project_for_user(project_id, user_id):
            return {"success": False, "message": "Project not found."}, 404
        try:
            geometry = SiteService._geometry_from_geojson(data.get("geometry"))
        except ValueError as exc:
            return {"success": False, "message": str(exc)}, 400
        site = Site(
            project_id=project_id,
            name=name,
            description=str(data.get("description", "")).strip() or None,
            area_hectares=data.get("area_hectares"),
            geometry=geometry,
        )
        db.session.add(site)
        db.session.commit()
        return {
            "success": True,
            "message": "Site created successfully",
            "data": site.to_dict(),
        }, 201

    @staticmethod
    def update_site(site_id: int, data: Dict[str, Any], user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Update a site belonging to the authenticated user."""
        site = Site.query.join(Project).filter(Site.id == site_id, Project.created_by == user_id).first()
        if not site:
            return {"success": False, "message": "Site not found."}, 404
        if "name" in data:
            site.name = str(data["name"]).strip()
            if not site.name:
                return {"success": False, "message": "Site name is required."}, 400
        if "description" in data:
            site.description = str(data["description"]).strip() or None
        if "area_hectares" in data:
            site.area_hectares = data["area_hectares"]
        if "geometry" in data:
            try:
                site.geometry = SiteService._geometry_from_geojson(data["geometry"])
            except ValueError as exc:
                return {"success": False, "message": str(exc)}, 400
        db.session.commit()
        return {
            "success": True,
            "message": "Site updated successfully",
            "data": site.to_dict(),
        }, 200

    @staticmethod
    def delete_site(site_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Delete a site belonging to the authenticated user."""
        site = Site.query.join(Project).filter(Site.id == site_id, Project.created_by == user_id).first()
        if not site:
            return {"success": False, "message": "Site not found."}, 404
        db.session.delete(site)
        db.session.commit()
        return {
            "success": True,
            "message": "Site deleted successfully",
            "data": {"deleted_id": site_id}
        }, 200


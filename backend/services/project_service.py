"""Project service module for Darukaa.Earth."""

from typing import Tuple, Dict, Any

from extensions.database import db
from models.project import Project


class ProjectService:
    """Service handling CRUD operations for geospatial projects."""

    @staticmethod
    def get_all_projects(user_id: Any) -> Tuple[Dict[str, Any], int]:
        """List projects owned by the authenticated user."""
        return {
            "success": True,
            "message": "Projects retrieved successfully",
            "data": [project.to_dict() for project in Project.query.filter_by(created_by=user_id).order_by(Project.updated_at.desc()).all()]
        }, 200

    @staticmethod
    def get_project_by_id(project_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Fetch one project owned by the authenticated user."""
        project = Project.query.filter_by(id=project_id, created_by=user_id).first()
        if not project:
            return {"success": False, "message": "Project not found."}, 404
        return {
            "success": True,
            "message": "Project retrieved successfully",
            "data": project.to_dict(include_sites=True),
        }, 200

    @staticmethod
    def create_project(data: Dict[str, Any], user_id: Any = None) -> Tuple[Dict[str, Any], int]:
        """Validate and create a project owned by the authenticated user."""
        name = str(data.get("name", "")).strip()
        if not name:
            return {"success": False, "message": "Project name is required."}, 400

        project = Project(
            name=name,
            description=str(data.get("description", "")).strip() or None,
            project_type=str(data.get("project_type", "canopy_surveillance")).strip() or "canopy_surveillance",
            status=str(data.get("status", "active")).strip() or "active",
            created_by=user_id,
        )
        db.session.add(project)
        db.session.commit()
        return {
            "success": True,
            "message": "Project created successfully",
            "data": project.to_dict(),
        }, 201

    @staticmethod
    def update_project(project_id: int, data: Dict[str, Any], user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Update a project owned by the authenticated user."""
        project = Project.query.filter_by(id=project_id, created_by=user_id).first()
        if not project:
            return {"success": False, "message": "Project not found."}, 404
        if "name" in data:
            project.name = str(data["name"]).strip()
            if not project.name:
                return {"success": False, "message": "Project name is required."}, 400
        for field in ("description", "project_type", "status"):
            if field in data:
                setattr(project, field, str(data[field]).strip())
        db.session.commit()
        return {
            "success": True,
            "message": "Project updated successfully",
            "data": project.to_dict(include_sites=True),
        }, 200

    @staticmethod
    def delete_project(project_id: int, user_id: Any) -> Tuple[Dict[str, Any], int]:
        """Delete a project owned by the authenticated user."""
        project = Project.query.filter_by(id=project_id, created_by=user_id).first()
        if not project:
            return {"success": False, "message": "Project not found."}, 404
        db.session.delete(project)
        db.session.commit()
        return {
            "success": True,
            "message": "Project deleted successfully",
            "data": {"deleted_id": project_id},
        }, 200


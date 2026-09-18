from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from services.project_service import ProjectService

project_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


@project_bp.route("", methods=["GET"])
@jwt_required()
def get_projects():
    """List all geospatial projects."""
    response, status_code = ProjectService.get_all_projects(get_jwt_identity())
    return jsonify(response), status_code


@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    """Create a new geospatial project."""
    data = request.get_json() or {}
    response, status_code = ProjectService.create_project(data, get_jwt_identity())
    return jsonify(response), status_code


@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id: int):
    """Retrieve details for a specific project."""
    response, status_code = ProjectService.get_project_by_id(project_id, get_jwt_identity())
    return jsonify(response), status_code


@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id: int):
    """Update project metadata."""
    data = request.get_json() or {}
    response, status_code = ProjectService.update_project(project_id, data, get_jwt_identity())
    return jsonify(response), status_code


@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id: int):
    """Delete a geospatial project."""
    response, status_code = ProjectService.delete_project(project_id, get_jwt_identity())
    return jsonify(response), status_code


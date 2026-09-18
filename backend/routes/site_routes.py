from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from services.site_service import SiteService

site_bp = Blueprint("sites", __name__, url_prefix="/api/sites")


@site_bp.route("", methods=["GET"])
@jwt_required()
def get_sites():
    """List monitored sites (optionally filtered by project_id)."""
    project_id = request.args.get("project_id", type=int)
    response, status_code = SiteService.get_all_sites(project_id=project_id, user_id=get_jwt_identity())
    return jsonify(response), status_code


@site_bp.route("", methods=["POST"])
@jwt_required()
def create_site():
    """Register a new monitored site with boundary geometry."""
    data = request.get_json() or {}
    response, status_code = SiteService.create_site(data, get_jwt_identity())
    return jsonify(response), status_code


@site_bp.route("/<int:site_id>", methods=["GET"])
@jwt_required()
def get_site(site_id: int):
    """Retrieve details for a specific site."""
    response, status_code = SiteService.get_site_by_id(site_id, get_jwt_identity())
    return jsonify(response), status_code


@site_bp.route("/<int:site_id>", methods=["PUT"])
@jwt_required()
def update_site(site_id: int):
    """Update site information and boundary."""
    data = request.get_json() or {}
    response, status_code = SiteService.update_site(site_id, data, get_jwt_identity())
    return jsonify(response), status_code


@site_bp.route("/<int:site_id>", methods=["DELETE"])
@jwt_required()
def delete_site(site_id: int):
    """Delete a monitored site."""
    response, status_code = SiteService.delete_site(site_id, get_jwt_identity())
    return jsonify(response), status_code


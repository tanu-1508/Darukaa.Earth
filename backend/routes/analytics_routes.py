from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.route("/site/<int:site_id>", methods=["GET"])
@jwt_required()
def get_site_analytics(site_id: int):
    """Retrieve environmental and vegetation analytics for a site."""
    response, status_code = AnalyticsService.get_site_analytics(site_id, get_jwt_identity())
    return jsonify(response), status_code


@analytics_bp.route("/site/<int:site_id>/run-demo", methods=["POST"])
@jwt_required()
def run_demo_site_analysis(site_id: int):
    """Run a deterministic demo spectral-analysis simulation for the authenticated site's owner."""
    payload = request.get_json(silent=True) or {}
    _ = payload
    response, status_code = AnalyticsService.generate_demo_analysis(site_id, get_jwt_identity())
    return jsonify(response), status_code


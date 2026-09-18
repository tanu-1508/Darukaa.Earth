import sys
import unittest
from pathlib import Path

from geoalchemy2.shape import from_shape
from shapely.geometry import Polygon

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app import create_app
from extensions.database import db
from models.project import Project
from models.site import Site
from models.user import User
from services.analytics_service import AnalyticsService


class DemoSpectralAnalysisTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        self.user = User(name="Test User", email="user@example.com")
        self.user.set_password("StrongPassword123")
        db.session.add(self.user)
        db.session.commit()

        self.project = Project(name="Test Project", created_by=self.user.id)
        db.session.add(self.project)
        db.session.commit()

        polygon = Polygon([(0, 0), (1, 0), (1, 1), (0, 1), (0, 0)])
        self.site = Site(
            project_id=self.project.id,
            name="Test Site",
            description="Demo site",
            geometry=from_shape(polygon, srid=4326),
        )
        db.session.add(self.site)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_generate_demo_analysis_creates_and_returns_record(self):
        result, status = AnalyticsService.generate_demo_analysis(self.site.id, self.user.id)

        self.assertEqual(status, 200)
        self.assertTrue(result["success"])
        self.assertIn("Demo spectral analysis", result["message"])
        self.assertIn("analysis", result["data"])
        record = result["data"]["analysis"]
        self.assertEqual(record["site_id"], self.site.id)
        self.assertIsNotNone(record["carbon_value"])
        self.assertIsNotNone(record["biodiversity_score"])
        self.assertIsNotNone(record["vegetation_index"])


if __name__ == "__main__":
    unittest.main()

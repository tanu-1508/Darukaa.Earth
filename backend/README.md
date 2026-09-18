# Darukaa.Earth Backend

> Flask REST API & Geospatial Data Analytics Backend

This service powers the **Darukaa.Earth** platform, providing RESTful endpoints for user authentication, geospatial project management, monitored site boundaries, and environmental analytics.

---

## 1. Requirements

- **Python**: 3.10+ (Tested on Python 3.13)
- **Database**:
  - Development: SQLite (built-in, zero setup)
  - Production / Geospatial: PostgreSQL 14+ with PostGIS extension

---

## 2. Windows Quickstart Setup

### Step A: Navigate to backend
```powershell
cd backend
```

### Step B: Create a Virtual Environment
```powershell
python -m venv venv
```

### Step C: Activate the Virtual Environment
On Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
```
*(If script execution is restricted, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` or use `venv\Scripts\activate.bat`)*

On Command Prompt (cmd.exe):
```cmd
venv\Scripts\activate
```

On macOS / Linux:
```bash
source venv/bin/activate
```

### Step D: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step E: Configure Environment Variables
Copy the example template to `.env`:
```powershell
copy .env.example .env
```
*(On bash: `cp .env.example .env`)*

---

## 3. Running the Backend Server

### Development Mode (Standard)
```powershell
python app.py
```

### Or using the Flask CLI:
```powershell
flask --app app run --debug --port 5000
```

The server will start listening at: `http://127.0.0.1:5000`

---

## 4. Health Check Verification

Test that the service is running:
```powershell
curl http://127.0.0.1:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Darukaa.Earth API is running"
}
```

---

## 5. API Endpoints Overview

| Blueprint | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Health-check status endpoint |
| **Auth** | `POST` | `/api/auth/register` | Register new organization user |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| **Auth** | `GET` | `/api/auth/me` | Retrieve active user identity |
| **Projects** | `GET` | `/api/projects` | List all geospatial projects |
| **Projects** | `POST` | `/api/projects` | Create a new project |
| **Projects** | `GET` | `/api/projects/<id>` | Get project details & site count |
| **Projects** | `PUT` | `/api/projects/<id>` | Update project metadata |
| **Projects** | `DELETE`| `/api/projects/<id>` | Delete project |
| **Sites** | `GET` | `/api/sites` | List monitored sites (filter: `?project_id=1`) |
| **Sites** | `POST` | `/api/sites` | Create a monitored site with GeoJSON boundary |
| **Sites** | `GET` | `/api/sites/<id>` | Get site details and geometry |
| **Sites** | `PUT` | `/api/sites/<id>` | Update site geometry / metadata |
| **Sites** | `DELETE`| `/api/sites/<id>` | Delete monitored site |
| **Analytics**| `GET` | `/api/analytics/site/<site_id>` | Get temporal NDVI, carbon, and telemetry data |

---

## 6. Folder Architecture

```
backend/
├── app.py                   # Application Factory (create_app) & runner
├── config.py                # Configuration classes (Dev, Test, Prod)
├── requirements.txt         # Pinned Python package dependencies
├── .env.example             # Environment configuration template
├── .gitignore               # Ignores .env, *.db, venv/
├── README.md                # Documentation
│
├── extensions/
│   ├── __init__.py
│   ├── database.py          # SQLAlchemy (db) & Flask-Migrate (migrate)
│   └── jwt.py               # Flask-JWT-Extended (jwt) & JSON error hooks
│
├── models/
│   ├── __init__.py          # Exports User, Project, Site, SiteAnalytics
│   ├── user.py              # User account & password hashing
│   ├── project.py           # Geospatial projects
│   ├── site.py              # Monitored sites & geometry
│   └── analytics.py         # Environmental metrics & NDVI
│
├── services/
│   ├── __init__.py
│   ├── auth_service.py      # Authentication logic
│   ├── project_service.py   # Project operations
│   ├── site_service.py      # Site & geometry processing
│   └── analytics_service.py # Telemetry calculations
│
├── routes/
│   ├── __init__.py          # Blueprint registration helper
│   ├── auth_routes.py       # /api/auth endpoints
│   ├── project_routes.py    # /api/projects endpoints
│   ├── site_routes.py       # /api/sites endpoints
│   └── analytics_routes.py  # /api/analytics endpoints
│
└── migrations/
    └── .gitkeep             # Database migrations placeholder
```

---

## 7. Dual Database & PostGIS Strategy

1. **Development (Zero-Config SQLite)**:
   By default, leaving `DATABASE_URL` empty automatically defaults to `sqlite:///darukaa.db`.
   Geometries are stored as valid GeoJSON structures in `db.JSON`, requiring no local C-libraries or spatial extensions to run.
2. **Production / Spatial (PostgreSQL + PostGIS)**:
   Set `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/darukaa_earth
   ```
   Run PostGIS activation:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
   The `Site.geometry` column can then be represented via GeoAlchemy2:
   ```python
   from geoalchemy2 import Geometry
   geometry = db.Column(Geometry('POLYGON', srid=4326))
   ```


# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial data analytics platform for managing carbon and biodiversity monitoring projects. Authenticated administrators can create projects, add polygonal sites, inspect PostGIS boundaries, and view time-series analytics.

## Architecture

```text
React + Vite -> Flask REST API -> SQLAlchemy / GeoAlchemy2 -> PostgreSQL + PostGIS
```

### Technologies

- Frontend: React, React Router, Vite, Mapbox GL JS, Mapbox Draw, Chart.js
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- Database: PostgreSQL with PostGIS; boundaries are SRID 4326 `MULTIPOLYGON` geometries
- Quality: ESLint, Prettier, Husky, lint-staged, GitHub Actions

## Business Workflow

1. Register and log in to receive a JWT.
2. Create a project from the dashboard.
3. Open a project and draw one or more site polygons on the Mapbox map.
4. Save site metadata and GeoJSON; Flask validates and stores geometry in PostGIS.
5. Open a real site ID to view its boundary and analytics charts.

## Database Schema

- `users`: account identity and password hash. Passwords are never stored as plaintext.
- `projects`: project metadata and authenticated `created_by` owner.
- `sites`: project-owned sites, metadata, optional area, and PostGIS geometry.
- `site_analytics`: dated carbon, biodiversity, and vegetation index records related to sites.

## Authentication and API

JWT-protected project, site, and analytics endpoints enforce ownership through the authenticated user and project relationship. The centralized frontend client is `frontend/src/services/api.js`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Issue an access token |
| GET | `/api/auth/me` | Read the current user |
| GET/POST | `/api/projects` | List or create projects |
| GET/PUT/DELETE | `/api/projects/<id>` | Manage one owned project |
| GET/POST | `/api/sites` | List or create owned sites |
| GET/PUT/DELETE | `/api/sites/<id>` | Manage one owned site |
| GET | `/api/analytics/site/<site_id>` | Read ordered site analytics |
| GET | `/api/health` | API health |
| GET | `/api/health/db` | PostgreSQL/PostGIS health |

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, and `CORS_ORIGINS`.

Copy `frontend/.env.example` to `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

Never commit `.env` files or real credentials. `VITE_MAPBOX_TOKEN` is required for map rendering and polygon drawing. Without it, the app intentionally shows a configuration message.

## Local Setup

### Database and migrations

Create a PostgreSQL database with PostGIS enabled, configure `DATABASE_URL`, then run from `backend`:

```powershell
pip install -r requirements.txt
flask --app app db upgrade
```

The existing migration creates `users`, `projects`, `sites`, and `site_analytics`, including the PostGIS geometry column.

### Backend

```powershell
cd backend
flask --app app run --debug --port 5000
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:5000/api`.

## Development Analytics Seed

The non-destructive development command adds four dated records to the first existing site and never deletes or overwrites existing dates:

```powershell
cd backend
flask --app app seed-analytics-dev
```

Create at least one site first. Analytics are read from PostgreSQL; React contains no analytics fixture values.

## Testing and Code Quality

```powershell
cd frontend
npm run lint
npm run format:check
npm run build
```

Husky runs lint-staged before commits and formats/lints staged frontend source files. GitHub Actions in `.github/workflows/ci.yml` runs frontend install, lint, formatting, and production build plus backend dependency installation and compilation.

## Deployment Preparation

`render.yaml` prepares the Flask API for Render. Set `DATABASE_URL` to a hosted PostgreSQL/PostGIS-compatible database, secure `SECRET_KEY` and `JWT_SECRET_KEY`, and set `CORS_ORIGINS` to the deployed frontend origin. `vercel.json` enables SPA routing for a Vercel frontend deployment. Configure `VITE_API_BASE_URL` and `VITE_MAPBOX_TOKEN` in the frontend host.

No public deployment is claimed: deployment accounts, hosted database, domains, and credentials must be supplied by the project owner.

## Known Limitations

- Mapbox is blocked until `VITE_MAPBOX_TOKEN` is configured; no token is stored in source.
- Telemetry uptime and critical alerts show `Not available` because no legitimate source exists.
- Satellite feeds, spectral analysis, and live telemetry are intentionally outside this release scope.
- Analytics ingestion is currently provided through the development seed command; chart display is fully API-backed.

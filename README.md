# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial data analytics platform for managing carbon and biodiversity monitoring projects. Authenticated users create projects, draw polygonal site boundaries on a Mapbox map, and view time-series environmental analytics.

## Live Demo

- Frontend: https://darukaa-earth-xi.vercel.app
- Backend API: https://darukaa-earth-4pvy.onrender.com/api
- Backend health: https://darukaa-earth-4pvy.onrender.com/api/health

## Quick Evaluator Guide

1. Open https://darukaa-earth-xi.vercel.app
2. Register a new account (click "Create an account")
3. Log in
4. Create a new project
5. Open the project
6. Draw a polygon site boundary on the Mapbox map
7. Enter site information and click "Save Site Boundary"
8. Reopen the project/site to verify the saved boundary
9. Run Spectral Analysis and view the generated charts

**If a blank/404 page appears after step 7 or step 9:** return to https://darukaa-earth-xi.vercel.app and reopen the project/site. The underlying request may have already completed and persisted the change.

## Architecture

```text
Browser -> Vercel React frontend -> Render Flask REST API -> PostgreSQL + PostGIS
```

## Core Features

- JWT-based authentication with password hashes (never plaintext)
- Project management owned by authenticated users
- Polygon site boundary drawing with Mapbox Draw (SRID 4326 MULTIPOLYGON)
- Site metadata and boundary persistence in PostGIS
- Environmental analytics visualization with Chart.js

## Business Workflow

1. Register and log in to receive a JWT.
2. Create a project from the dashboard.
3. Open a project and draw one or more site polygons on the Mapbox map.
4. Save site metadata and GeoJSON; Flask validates and stores geometry in PostGIS.
5. Open a saved site to view its boundary and analytics charts.

## Multi-User Data Isolation

Project ownership is associated with the authenticated user. Backend API operations validate ownership, so users can only access their own projects and sites.

Example:

- **User 1** registers, creates Project A and Site A. User 1 can access their own project/site.
- **User 2** registers a different account, logs in, creates Project B. User 2 does not see User 1's Project A or Site A.

## Technologies

- Frontend: React, Vite, React Router, Mapbox GL JS, Mapbox Draw, Chart.js
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, SQLAlchemy, GeoAlchemy2
- Database: PostgreSQL with PostGIS; site boundaries are SRID 4326 `MULTIPOLYGON` geometries
- Quality: ESLint, Prettier, Husky, lint-staged, GitHub Actions
- Deployment: Vercel (frontend), Render (backend)

## Database Schema

**users**

- `id`, `name`, `email`, `password_hash`, `timestamps`

**projects**

- `id`, `name`, `description`, `project_type`, `status`, `created_by`, `timestamps`

**sites**

- `id`, `project_id`, `name`, `description`, `area_hectares`, `geometry`, `timestamps`

**site_analytics**

- `id`, `site_id`, `date`, `carbon_value`, `biodiversity_score`, `vegetation_index`, `timestamps`

**Relationships:** User 1 -> many Projects -> many Sites -> many Analytics records

## Authentication and API

JWT-protected project, site, and analytics endpoints enforce ownership through the authenticated user and project relationship.

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

## Demo Spectral Analysis

"Spectral Analysis" is a deterministic demo/mock workflow. It uses the site's stored geometry and generates demo environmental metrics. It does not process real satellite imagery, perform real remote sensing, or claim real-time telemetry.

- Generated analytics are stored in the `site_analytics` table through the backend.
- Chart.js displays carbon, biodiversity, and vegetation index trends.
- This is a hackathon-permitted mock/demo analysis, not a production satellite-processing pipeline.

## Local Setup

### Database and migrations

Create a PostgreSQL database with PostGIS enabled, configure `DATABASE_URL`, then run from `backend`:

```bash
pip install -r requirements.txt
flask --app app db upgrade
```

The existing migration creates `users`, `projects`, `sites`, and `site_analytics`, including the PostGIS geometry column.

### Backend

```bash
cd backend
flask --app app run --debug --port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:5000/api`.

## Environment Variables

**Backend** (`backend/.env`): `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `CORS_ORIGINS`

**Frontend** (`frontend/.env`):

```text
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

**Warnings:**

- Never commit `.env` files or real credentials.
- `VITE_MAPBOX_TOKEN` is a browser-side public Mapbox token. Restrict it appropriately in your Mapbox account.

## Testing and Code Quality

```bash
cd frontend
npm run lint
npm run format:check
npm run build
```

Husky runs lint-staged before commits on staged frontend files. GitHub Actions in `.github/workflows/ci.yml` runs frontend install, lint, formatting, and production build plus backend dependency installation and compilation.

## Deployment

- Frontend: Vercel -> https://darukaa-earth-xi.vercel.app
- Backend: Render -> https://darukaa-earth-4pvy.onrender.com/api
- Database: PostgreSQL + PostGIS hosted for the deployed backend

## Known Deployment Limitation

After "Save Site Boundary" or "Run Spectral Analysis", the deployed frontend may occasionally navigate to a blank/404 page due to the current deployed navigation behavior. This does not mean the database operation definitely failed. The underlying request may have already completed and persisted the change. If this occurs, return to https://darukaa-earth-xi.vercel.app and reopen the relevant project/site to verify and continue.

The main application URL is the correct entry point. Authentication works through the application's registration/login flow. The backend API is deployed separately. Project/site data is persisted in PostgreSQL/PostGIS.

## Hackathon Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| React | Frontend built with React + Vite |
| Mapbox GL JS | Interactive map with site boundary drawing |
| Chart.js | Carbon, biodiversity, and vegetation index charts |
| Flask | Flask REST API backend |
| PostgreSQL | Primary database |
| PostGIS | Spatial geometry storage (SRID 4326 MULTIPOLYGON) |
| JWT authentication | Registration, login, and protected endpoints |
| Project management | Create, read, update, delete projects |
| Polygon site drawing | Mapbox Draw polygon boundary tool |
| Interactive map | Mapbox GL JS with site boundary visualization |
| Analytics visualization | Chart.js time-series charts on site details |
| ESLint/Prettier | Frontend linting and formatting |
| Husky/lint-staged | Pre-commit checks on staged files |
| GitHub Actions | CI workflow for lint, format, build, and backend checks |
| Public deployment | Vercel frontend + Render backend (live URLs above) |
| GitHub repository | The current repository is public |

# Darukaa.Earth

> Full-Stack Geospatial Data Analytics Platform

Darukaa.Earth is a modern earth observation and geospatial intelligence platform engineered for monitoring canopy cover, coastal mangroves, hydrological patterns, and multispectral telemetry.

---

## Project Structure

```
Darukaa.Earth/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation bar with branding & quick actions
    │   │   ├── Sidebar.jsx         # Geospatial analytics navigation sidebar
    │   │   └── Layout.jsx          # Shell layout wrapping routes
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Main overview with telemetry stats & project feeds
    │   │   ├── ProjectDetails.jsx  # Individual project view with polygon & site list
    │   │   ├── SiteDetails.jsx     # Site telemetry metrics & coordinate monitoring
    │   │   ├── Login.jsx           # Clean authentication sign-in
    │   │   ├── Register.jsx        # Organization onboarding & registration
    │   │   └── NotFound.jsx        # 404 unmapped route fallback
    │   ├── services/
    │   │   └── api.js              # REST / GraphQL API service placeholder
    │   ├── hooks/
    │   │   └── useGeospatial.js    # Geospatial layers & coordinate custom hook
    │   ├── App.jsx                 # Route definitions (React Router)
    │   ├── main.jsx                # React root mount
    │   └── index.css               # Professional dark & emerald geospatial styling
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Quickstart

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Running the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (already installed)
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

By default, the development server runs on `http://localhost:5173`.


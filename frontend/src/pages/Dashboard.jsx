import React from 'react'
import { Link } from 'react-router-dom'
import { Map, Layers, Compass, Globe, ArrowRight, Activity, Shield } from 'lucide-react'

export default function Dashboard() {
  const sampleProjects = [
    { id: 'project-alpha', name: 'Western Ghats Canopy Surveillance', sites: 14, status: 'Active', updated: '2 hours ago' },
    { id: 'project-bravo', name: 'Sundarbans Coastal Mangrove Monitor', sites: 8, status: 'Monitoring', updated: '5 hours ago' },
    { id: 'project-charlie', name: 'Deccan Plateau Groundwater Survey', sites: 22, status: 'Processing', updated: '1 day ago' },
  ]

  const sampleSites = [
    { id: 'site-sector-01', name: 'Sector 01 - North Ridge', lat: '14.2831° N', lon: '74.8329° E', condition: 'Optimal' },
    { id: 'site-sector-02', name: 'Sector 02 - Estuary Basin', lat: '21.9497° N', lon: '89.1833° E', condition: 'Action Required' },
    { id: 'site-sector-03', name: 'Sector 03 - South Aquifer', lat: '17.3850° N', lon: '78.4867° E', condition: 'Optimal' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Geospatial Analytics Dashboard</h1>
          <p className="page-subtitle">Welcome to Darukaa.Earth — Global Earth Observation & Environmental Intelligence Platform.</p>
        </div>
        <Link to="/projects/project-alpha" className="btn btn-primary">
          <Compass size={16} />
          <span>Explore Projects</span>
        </Link>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Globe size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">44</div>
            <div className="stat-label">Active Monitored Sites</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">12.8k km²</div>
            <div className="stat-label">Surveyed Surface Area</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">99.8%</div>
            <div className="stat-label">Telemetry Feed Uptime</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">3</div>
            <div className="stat-label">Critical Alerts</div>
          </div>
        </div>
      </div>

      <div className="placeholder-banner">
        <Map size={40} className="banner-icon" />
        <h4>Interactive Map View Placeholder</h4>
        <p>
          Mapbox GL JS / WebGL geospatial viewport will be rendered here with dynamic vector tiles, satellite imagery layers, and site overlays.
        </p>
        <span className="status-badge" style={{ marginTop: '0.5rem' }}>
          Future Integration Ready
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Projects</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3 Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sampleProjects.map((proj) => (
              <Link
                key={proj.id}
                to={`/projects/${proj.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{proj.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {proj.sites} Sites • Updated {proj.updated}
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Monitored Sites</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sampleSites.map((site) => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{site.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Coords: {site.lat}, {site.lon}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: site.condition === 'Optimal' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: site.condition === 'Optimal' ? 'var(--primary)' : 'var(--accent-amber)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {site.condition}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


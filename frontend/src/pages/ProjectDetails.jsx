import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FolderGit2, MapPin, Layers, ArrowLeft, Calendar, User, Tag } from 'lucide-react'

export default function ProjectDetails() {
  const { projectId = 'project-alpha' } = useParams()

  const projectSites = [
    { id: 'site-sector-01', name: 'Ridge Ingress Site', status: 'Healthy', elevation: '840m' },
    { id: 'site-sector-02', name: 'Canopy Density Station 3', status: 'Alert', elevation: '1,120m' },
    { id: 'site-sector-03', name: 'Riparian Buffer Zone', status: 'Healthy', elevation: '620m' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
              ID: {projectId}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Geospatial Project</span>
          </div>
          <h1 className="page-title">Western Ghats Canopy Surveillance</h1>
          <p className="page-subtitle">Long-term multispectral satellite and UAV forest canopy tracking.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm">Export GeoJSON</button>
          <button className="btn btn-primary btn-sm">+ Add Site Boundary</button>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon"><Calendar size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">March 2026</div>
            <div className="stat-label">Project Inception</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><MapPin size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">3 Sites</div>
            <div className="stat-label">Survey Locations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Layers size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">6 Bands</div>
            <div className="stat-label">Multispectral Layers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><User size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">Lead Analyst</div>
            <div className="stat-label">Darukaa Operations</div>
          </div>
        </div>
      </div>

      <div className="placeholder-banner">
        <Layers size={36} className="banner-icon" />
        <h4>Geospatial Layer View & Bounding Polygon Placeholder</h4>
        <p>
          Coordinates: Bounding Box [74.12° E, 13.98° N, 75.22° E, 14.85° N].
          Visualizing NDVI (Normalized Difference Vegetation Index) & Sentinel-2 overlays.
        </p>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Sites in this Project</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projectSites.map((site) => (
            <div
              key={site.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{site.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Elevation: {site.elevation} • Status: {site.status}
                </div>
              </div>
              <Link to={`/sites/${site.id}`} className="btn btn-outline btn-sm">
                View Site Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Navigation, ArrowLeft, Thermometer, Wind, Droplets, Radio } from 'lucide-react'

export default function SiteDetails() {
  const { siteId = 'site-sector-01' } = useParams()

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
              SITE: {siteId}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Geospatial Monitored Point</span>
          </div>
          <h1 className="page-title">Sector 01 - North Ridge Station</h1>
          <p className="page-subtitle">Coordinates: 14.2831° N, 74.8329° E | Elevation: 840m MSL</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/projects/project-alpha" className="btn btn-outline btn-sm">
            View Parent Project
          </Link>
          <button className="btn btn-primary btn-sm">Run Spectral Analysis</button>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon"><Thermometer size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">24.2 °C</div>
            <div className="stat-label">Surface Temperature</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Droplets size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">68%</div>
            <div className="stat-label">Soil Moisture Index</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Wind size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">12 km/h</div>
            <div className="stat-label">Wind Velocity</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Radio size={20} /></div>
          <div className="stat-info">
            <div className="stat-value">Active</div>
            <div className="stat-label">Telemetry Status</div>
          </div>
        </div>
      </div>

      <div className="placeholder-banner">
        <Navigation size={36} className="banner-icon" />
        <h4>High-Resolution Aerial / Satellite View Placeholder</h4>
        <p>
          Sensor telemetry, localized orthomosaic tiles, and point-cloud elevation data will be mapped here for site: <strong>{siteId}</strong>.
        </p>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Sensor Telemetry Log (Placeholder)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No live backend connected yet. When integrated, time-series sensor feeds and historical imagery will appear in this section.
        </p>
      </div>
    </div>
  )
}


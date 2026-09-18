import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Map,
  Layers,
  Compass,
  Globe,
  ArrowRight,
  Activity,
  Shield,
} from 'lucide-react'
import { apiService } from '../services/api.js'
import SiteMap from '../components/SiteMap.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [sites, setSites] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const loadProjects = async () => {
    try {
      const [projectData, siteData] = await Promise.all([
        apiService.getProjects(),
        apiService.getSites(),
      ])
      setProjects(projectData)
      setSites(siteData)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreateProject = async (event) => {
    event.preventDefault()
    setError('')
    setIsCreating(true)
    try {
      const project = await apiService.createProject({
        name: projectName,
        description: projectDescription,
      })
      setProjects((current) => [project, ...current])
      setProjectName('')
      setProjectDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Geospatial Analytics Dashboard</h1>
          <p className="page-subtitle">
            Welcome to Darukaa.Earth — Global Earth Observation & Environmental
            Intelligence Platform.
          </p>
        </div>
        <Link
          to={projects.length ? `/projects/${projects[0].id}` : '#'}
          className="btn btn-primary"
          aria-disabled={!projects.length}
        >
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
            <div className="stat-value">{sites.length}</div>
            <div className="stat-label">Active Monitored Sites</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">Not available</div>
            <div className="stat-label">Telemetry Feed Uptime</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">Not available</div>
            <div className="stat-label">Critical Alerts</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}
        >
          Projects and Site Boundaries
        </h3>
        {sites.length ? (
          <SiteMap
            sites={sites}
            onSiteClick={(siteId) => navigate(`/sites/${siteId}`)}
          />
        ) : (
          <div className="placeholder-banner">
            <Map size={40} className="banner-icon" />
            <h4>No site boundaries yet</h4>
            <p>
              Create a project and add a site boundary to see it on the map.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Active Projects
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {projects.length} Total
            </span>
          </div>

          <form
            onSubmit={handleCreateProject}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginBottom: '1.25rem',
            }}
          >
            <input
              className="form-control"
              type="text"
              placeholder="New project name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Description (optional)"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </form>
          {error && (
            <p
              role="alert"
              style={{
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </p>
          )}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {isLoading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                No projects yet. Create your first project above.
              </p>
            ) : (
              projects.map((proj) => (
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
                    transition: 'all 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {proj.name}
                    </div>
                    <div
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                    >
                      {proj.sites_count || 0} Sites • Updated{' '}
                      {proj.updated_at
                        ? new Date(proj.updated_at).toLocaleDateString()
                        : 'recently'}
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Monitored Sites
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time
            </span>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {sites.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                No monitored sites yet.
              </p>
            ) : (
              sites.map((site) => (
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
                    transition: 'all 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {site.name}
                    </div>
                    <div
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                    >
                      Project {site.project_id} • Area:{' '}
                      {site.area_hectares ?? 'Unknown'} ha
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {site.geometry ? 'Boundary saved' : 'No boundary'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FolderGit2,
  MapPin,
  Layers,
  ArrowLeft,
  Calendar,
  User,
  Tag,
} from 'lucide-react'
import { apiService } from '../services/api.js'
import SiteMap from '../components/SiteMap.jsx'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [siteGeometry, setSiteGeometry] = useState(null)
  const [siteName, setSiteName] = useState('')
  const [siteDescription, setSiteDescription] = useState('')
  const [isSavingSite, setIsSavingSite] = useState(false)

  useEffect(() => {
    apiService
      .getProjectById(projectId)
      .then(setProject)
      .catch((err) => setError(err.message))
  }, [projectId])

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return
    try {
      await apiService.deleteProject(projectId)
      window.location.href = '/'
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSaveSite = async (event) => {
    event.preventDefault()
    if (!siteGeometry) {
      setError('Draw a polygon on the map before saving the site.')
      return
    }
    setError('')
    setIsSavingSite(true)
    try {
      const site = await apiService.createSite({
        project_id: project.id,
        name: siteName,
        description: siteDescription,
        geometry: siteGeometry,
      })
      setProject((current) => ({
        ...current,
        sites: [...(current.sites || []), site],
        sites_count: (current.sites_count || 0) + 1,
      }))
      setSiteName('')
      setSiteDescription('')
      setSiteGeometry(null)
      setIsDrawing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSavingSite(false)
    }
  }

  if (error)
    return (
      <p role="alert" style={{ color: '#f87171' }}>
        {error}
      </p>
    )
  if (!project)
    return <p style={{ color: 'var(--text-muted)' }}>Loading project...</p>

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                background: 'var(--bg-surface-elevated)',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                color: 'var(--primary)',
              }}
            >
              ID: {project.id}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • Geospatial Project
            </span>
          </div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">
            {project.description || 'No project description provided.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm">Export GeoJSON</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsDrawing((current) => !current)}
          >
            {isDrawing ? 'Cancel Drawing' : '+ Add Site Boundary'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleDelete}>
            Delete Project
          </button>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {project.created_at
                ? new Date(project.created_at).toLocaleDateString()
                : 'Unknown'}
            </div>
            <div className="stat-label">Project Inception</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <MapPin size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{project.sites_count || 0} Sites</div>
            <div className="stat-label">Survey Locations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{project.project_type}</div>
            <div className="stat-label">Multispectral Layers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <User size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">User {project.created_by}</div>
            <div className="stat-label">Darukaa Operations</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}
        >
          Site Boundary Map
        </h3>
        <SiteMap
          sites={project.sites || []}
          isDrawing={isDrawing}
          onGeometryChange={setSiteGeometry}
        />
        {isDrawing && (
          <form
            onSubmit={handleSaveSite}
            style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}
          >
            <input
              className="form-control"
              type="text"
              placeholder="Site name"
              value={siteName}
              onChange={(event) => setSiteName(event.target.value)}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Description (optional)"
              value={siteDescription}
              onChange={(event) => setSiteDescription(event.target.value)}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSavingSite || !siteGeometry}
            >
              {isSavingSite ? 'Saving Site...' : 'Save Site Boundary'}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" style={{ color: '#f87171', marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}
        >
          Sites in this Project
        </h3>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {(project.sites || []).map((site) => (
            <div
              key={site.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{site.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Area: {site.area_hectares ?? 'Unknown'} ha
                </div>
              </div>
              <Link to={`/sites/${site.id}`} className="btn btn-outline btn-sm">
                View Site Details
              </Link>
            </div>
          ))}
          {(!project.sites || project.sites.length === 0) && (
            <p style={{ color: 'var(--text-muted)' }}>
              No sites in this project yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

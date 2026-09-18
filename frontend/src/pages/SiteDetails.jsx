import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Thermometer,
  Wind,
  Droplets,
  Radio,
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { apiService } from '../services/api.js'
import SiteMap from '../components/SiteMap.jsx'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

function MetricChart({ title, records, field, color }) {
  const points = records.filter(
    (record) => record[field] !== null && record[field] !== undefined
  )
  return (
    <div className="card" style={{ minWidth: 0 }}>
      <Line
        data={{
          labels: points.map((record) => record.date),
          datasets: [
            {
              label: title,
              data: points.map((record) => record[field]),
              borderColor: color,
              backgroundColor: `${color}33`,
              tension: 0.3,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#9ca3af' } },
            tooltip: { enabled: true },
          },
          scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f293d' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f293d' } },
          },
        }}
        height={220}
      />
    </div>
  )
}

export default function SiteDetails() {
  const { siteId } = useParams()
  const [site, setSite] = useState(null)
  const [analytics, setAnalytics] = useState([])
  const [error, setError] = useState('')
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analysisRunning, setAnalysisRunning] = useState(false)

  const loadAnalytics = async () => {
    try {
      const analyticsData = await apiService.getSiteAnalytics(siteId)
      setAnalytics(analyticsData.analytics || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadSite = async () => {
      try {
        const [siteData, analyticsData] = await Promise.all([
          apiService.getSiteById(siteId),
          apiService.getSiteAnalytics(siteId),
        ])
        setSite(siteData)
        setAnalytics(analyticsData.analytics || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setAnalyticsLoading(false)
      }
    }
    loadSite()
  }, [siteId])

  const handleRunSpectralAnalysis = async () => {
    if (!siteId) return
    setAnalysisRunning(true)
    setError('')

    try {
      await apiService.runDemoSpectralAnalysis(siteId)
      await loadAnalytics()
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalysisRunning(false)
    }
  }

  if (error)
    return (
      <p role="alert" style={{ color: '#f87171' }}>
        {error}
      </p>
    )
  if (!site)
    return <p style={{ color: 'var(--text-muted)' }}>Loading site...</p>

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
              SITE: {site.id}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • Geospatial Monitored Point
            </span>
          </div>
          <h1 className="page-title">{site.name}</h1>
          <p className="page-subtitle">
            {site.description || 'No site description provided.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            to={`/projects/${site.project_id}`}
            className="btn btn-outline btn-sm"
          >
            View Parent Project
          </Link>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleRunSpectralAnalysis}
            disabled={analysisRunning}
            aria-label="Run demo spectral analysis"
          >
            {analysisRunning ? 'Running...' : 'Run Spectral Analysis'}
          </button>
        </div>
      </div>

      <div
        style={{
          marginBottom: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        Demo Spectral Analysis: deterministic mock carbon, biodiversity, and
        vegetation values generated from the stored site geometry.
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Thermometer size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{site.area_hectares ?? 'Unknown'}</div>
            <div className="stat-label">Area (hectares)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Droplets size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{site.project_id}</div>
            <div className="stat-label">Parent Project</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Wind size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{site.geometry?.type || 'None'}</div>
            <div className="stat-label">Stored Geometry</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Radio size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {site.geometry ? 'Saved' : 'Missing'}
            </div>
            <div className="stat-label">Boundary Status</div>
          </div>
        </div>
      </div>

      <div className="placeholder-banner">
        <Navigation size={36} className="banner-icon" />
        <h4>High-Resolution Aerial / Satellite View Placeholder</h4>
        <p>
          Saved geometry:{' '}
          <strong>
            {site.geometry
              ? `${site.geometry.type} in EPSG:4326`
              : 'No geometry'}
          </strong>
          . Sensor telemetry and imagery will be added in a later milestone.
        </p>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}
        >
          Saved Site Boundary
        </h3>
        <SiteMap sites={[site]} />
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3
          style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}
        >
          Environmental Analytics
        </h3>
        {analyticsLoading && (
          <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
        )}
        {!analyticsLoading && !analytics.length && (
          <p style={{ color: 'var(--text-muted)' }}>
            No analytics data available for this site yet.
          </p>
        )}
        {!analyticsLoading && analytics.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            <MetricChart
              title="Carbon Value Over Time"
              records={analytics}
              field="carbon_value"
              color="#10b981"
            />
            <MetricChart
              title="Biodiversity Score Over Time"
              records={analytics}
              field="biodiversity_score"
              color="#06b6d4"
            />
            <MetricChart
              title="Vegetation Index Over Time"
              records={analytics}
              field="vegetation_index"
              color="#f59e0b"
            />
          </div>
        )}
      </div>
    </div>
  )
}

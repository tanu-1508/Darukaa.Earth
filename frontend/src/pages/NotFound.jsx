import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div
        style={{
          display: 'inline-flex',
          padding: '1rem',
          background: 'var(--bg-surface-elevated)',
          borderRadius: '50%',
          marginBottom: '1.5rem',
          color: 'var(--primary)',
        }}
      >
        <Compass size={48} />
      </div>
      <h1
        style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
        }}
      >
        Coordinates Unmapped / Page Not Found
      </h2>
      <p
        style={{
          color: 'var(--text-subdued)',
          maxWidth: '420px',
          margin: '0 auto 2rem',
        }}
      >
        The geospatial layer or route you requested does not exist in the
        Darukaa.Earth registry.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Lock, Mail, ArrowRight } from 'lucide-react'
import { apiService } from '../services/api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await apiService.login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div
            className="brand"
            style={{ justifyContent: 'center', marginBottom: '1rem' }}
          >
            <div className="brand-icon">
              <Globe size={22} />
            </div>
            <div className="brand-title">
              Darukaa<span>.Earth</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Platform Sign In
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Access geospatial analytics, maps, and earth observation feeds.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="analyst@darukaa.earth"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create an account</Link>
          <div style={{ marginTop: '0.75rem' }}>
            <Link
              to="/"
              style={{ color: 'var(--text-subdued)', fontSize: '0.8rem' }}
            >
              ← Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

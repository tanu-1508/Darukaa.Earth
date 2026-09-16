import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, ArrowRight } from 'lucide-react'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder interaction: Navigate to dashboard
    navigate('/')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="brand-icon">
              <Globe size={22} />
            </div>
            <div className="brand-title">
              Darukaa<span>.Earth</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Register Organization</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Start monitoring land, environmental metrics, and satellite layers.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="form-control"
              placeholder="Dr. Maya Rao"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="org">Organization / Agency</label>
            <input
              id="org"
              type="text"
              className="form-control"
              placeholder="Ecology Remote Sensing Dept."
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Work Email</label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              placeholder="maya.rao@institution.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-control"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <span>Create Account</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
          <div style={{ marginTop: '0.75rem' }}>
            <Link to="/" style={{ color: 'var(--text-subdued)', fontSize: '0.8rem' }}>
              ← Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


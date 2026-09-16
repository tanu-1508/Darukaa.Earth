import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, User, LogIn, Activity } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <div className="brand-icon">
          <Globe size={20} />
        </div>
        <div className="brand-title">
          Darukaa<span>.Earth</span>
        </div>
      </Link>

      <div className="nav-actions">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>Geospatial Core Active</span>
        </div>

        <Link to="/login" className="btn btn-outline btn-sm">
          <LogIn size={15} />
          <span>Sign In</span>
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          <User size={15} />
          <span>Register</span>
        </Link>
      </div>
    </header>
  )
}


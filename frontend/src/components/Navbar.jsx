import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, User, LogIn, LogOut } from 'lucide-react'
import { apiService } from '../services/api.js'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(apiService.getToken())
  )
  const navigate = useNavigate()

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(apiService.getToken()))
    window.addEventListener('darukaa-auth-change', syncAuth)
    return () => window.removeEventListener('darukaa-auth-change', syncAuth)
  }, [])

  const handleLogout = () => {
    apiService.logout()
    navigate('/login')
  }

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

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              <User size={15} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

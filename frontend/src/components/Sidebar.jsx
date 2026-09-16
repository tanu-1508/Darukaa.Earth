import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderGit2, MapPin, Layers, Satellite, ShieldCheck, UserPlus } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-section-title">Navigation</div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/projects/project-alpha" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FolderGit2 size={18} />
              <span>Project Details</span>
              <span className="nav-counter">Demo</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sites/site-sector-01" className={({ isActive }) => (isActive ? 'active' : '')}>
              <MapPin size={18} />
              <span>Site Details</span>
              <span className="nav-counter">Demo</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <div className="sidebar-section-title">Geospatial Modules (Planned)</div>
        <ul className="nav-list">
          <li className="nav-item">
            <a href="#layers" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              <Layers size={18} />
              <span>Map Layers</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#satellite" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              <Satellite size={18} />
              <span>Satellite Feeds</span>
            </a>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="sidebar-section-title">Authentication</div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ShieldCheck size={18} />
              <span>Login</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
              <UserPlus size={18} />
              <span>Register</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  )
}


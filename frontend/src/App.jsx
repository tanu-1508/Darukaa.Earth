import React, { useEffect, useState } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectDetails from './pages/ProjectDetails'
import SiteDetails from './pages/SiteDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { apiService } from './services/api.js'

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(apiService.getToken())
  )

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(apiService.getToken()))
    window.addEventListener('darukaa-auth-change', syncAuth)
    return () => window.removeEventListener('darukaa-auth-change', syncAuth)
  }, [])

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Main Platform Shell Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
        <Route path="sites/:siteId" element={<SiteDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Standalone Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectDetails from './pages/ProjectDetails'
import SiteDetails from './pages/SiteDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Main Platform Shell Routes */}
      <Route path="/" element={<Layout />}>
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


import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { apiService } from '../services/api.js'

export default function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    apiService.currentUser().catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/**
 * Darukaa.Earth API Client Service (Placeholder)
 * 
 * Future integration for backend geospatial REST / GraphQL endpoints.
 * Currently stubbed per initial frontend setup requirements.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiService = {
  // Placeholder endpoints
  getProjects: async () => {
    // To be connected to backend API
    return []
  },

  getProjectById: async (id) => {
    // To be connected to backend API
    return { id }
  },

  getSites: async () => {
    // To be connected to backend API
    return []
  },

  getSiteById: async (id) => {
    // To be connected to backend API
    return { id }
  }
}

export default apiService


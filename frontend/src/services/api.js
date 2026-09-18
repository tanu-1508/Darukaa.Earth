const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'darukaa_access_token'

const request = async (path, options = {}) => {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (
      response.status === 401 &&
      path !== '/auth/login' &&
      path !== '/auth/register'
    ) {
      localStorage.removeItem(TOKEN_KEY)
      notifyAuthChange()
    }
    const error = new Error(
      payload.message || payload.error || `Request failed (${response.status})`
    )
    error.status = response.status
    throw error
  }
  return payload
}

const notifyAuthChange = () =>
  window.dispatchEvent(new Event('darukaa-auth-change'))

export const apiService = {
  baseUrl: BASE_URL,

  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
    notifyAuthChange()
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    notifyAuthChange()
  },

  getHealth: async () => {
    return request('/health')
  },

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: async (data) => {
    const payload = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    apiService.setToken(payload.data.token)
    return payload
  },

  currentUser: () => request('/auth/me'),

  getProjects: async () => (await request('/projects')).data,

  getProjectById: async (id) => (await request(`/projects/${id}`)).data,

  createProject: async (data) =>
    (await request('/projects', { method: 'POST', body: JSON.stringify(data) }))
      .data,

  updateProject: async (id, data) =>
    (
      await request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    ).data,

  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  getSites: async (projectId) =>
    (await request(projectId ? `/sites?project_id=${projectId}` : '/sites'))
      .data,

  getSiteById: async (id) => (await request(`/sites/${id}`)).data,

  createSite: async (data) =>
    (await request('/sites', { method: 'POST', body: JSON.stringify(data) }))
      .data,

  updateSite: async (id, data) =>
    (
      await request(`/sites/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    ).data,

  deleteSite: (id) => request(`/sites/${id}`, { method: 'DELETE' }),

  getSiteAnalytics: async (siteId) =>
    (await request(`/analytics/site/${siteId}`)).data,

  runDemoSpectralAnalysis: async (siteId) =>
    (
      await request(`/analytics/site/${siteId}/run-demo`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
    ).data,
}

export default apiService

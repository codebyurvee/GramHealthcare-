import axios from 'axios'

/**
 * GramHealthcare API service
 *
 * Base URL is proxied through Vite dev server (/api → http://localhost:5000)
 * so no CORS issues in development.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach Bearer token from localStorage ──
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('gh_user')
    if (stored) {
      try {
        const { token } = JSON.parse(stored)
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        // ignore malformed storage
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gh_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
export const authAPI = {
  /** POST /api/auth/login  — { identifier, pin, role } */
  login: (credentials) => api.post('/auth/login', credentials),

  /** POST /api/auth/logout */
  logout: () => api.post('/auth/logout'),

  /** POST /api/auth/otp  — { phone } */
  requestOtp: (phone) => api.post('/auth/otp', { phone }),
}

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────
export const usersAPI = {
  getAll:  (params) => api.get('/users', { params }),
  getById: (id)     => api.get(`/users/${id}`),
  create:  (data)   => api.post('/users', data),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id)     => api.delete(`/users/${id}`),
}

// ──────────────────────────────────────────────
// Facilities
// ──────────────────────────────────────────────
export const facilitiesAPI = {
  getAll:      (params) => api.get('/facilities', { params }),
  getById:     (id)     => api.get(`/facilities/${id}`),
  getNearby:   (lat, lng, radius) =>
    api.get('/facilities/nearby', { params: { lat, lng, radius } }),
  create:      (data)   => api.post('/facilities', data),
  update:      (id, data) => api.put(`/facilities/${id}`, data),
  updateBeds:  (id, beds) => api.patch(`/facilities/${id}/beds`, { beds }),
}

// ──────────────────────────────────────────────
// Referrals
// ──────────────────────────────────────────────
export const referralsAPI = {
  getAll:        (params) => api.get('/referrals', { params }),
  getById:       (id)     => api.get(`/referrals/${id}`),
  getByToken:    (token)  => api.get(`/referrals/token/${token}`),
  create:        (data)   => api.post('/referrals', data),
  updateStatus:  (id, status) => api.patch(`/referrals/${id}/status`, { status }),
  saveDraft:     (data)   => api.post('/referrals/draft', data),
  syncDrafts:    (drafts) => api.post('/referrals/sync', { drafts }),
}

// ──────────────────────────────────────────────
// Analytics (Admin)
// ──────────────────────────────────────────────
export const analyticsAPI = {
  getSummary:   (params) => api.get('/analytics/summary', { params }),
  getUserStats: (params) => api.get('/analytics/users',   { params }),
  getReferralStats: (params) => api.get('/analytics/referrals', { params }),
}

// ──────────────────────────────────────────────
// System Settings (Admin)
// ──────────────────────────────────────────────
export const settingsAPI = {
  get:    () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
}

export default api

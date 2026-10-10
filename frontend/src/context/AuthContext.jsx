import { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext
 *
 * Provides:
 *   user        — { id, name, role, token, facility? } | null
 *   login(data) — stores user in state + localStorage
 *   logout()    — clears state + localStorage
 *   loading     — true while hydrating from localStorage on first mount
 *
 * Roles: 'worker' | 'facility' | 'patient' | 'admin'
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage on first load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gh_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('gh_user')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * login — call this after a successful API auth response
   * @param {{ id, name, role, token, facility? }} userData
   */
  function login(userData) {
    setUser(userData)
    localStorage.setItem('gh_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('gh_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/** useAuth — consume AuthContext in any component */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

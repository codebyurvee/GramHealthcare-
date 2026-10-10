import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../services/api.js'
import './Login.css'

const ROLES = [
  { id: 'worker',   label: 'CHW / ASHA',     icon: 'diversity_1',        badge: 'Field Ready' },
  { id: 'facility', label: 'Facility Staff',  icon: 'local_hospital',     badge: 'Clinical Queue' },
  { id: 'patient',  label: 'Patient',         icon: 'personal_injury',    badge: 'Direct Access' },
  { id: 'admin',    label: 'Admin',           icon: 'admin_panel_settings',badge: 'Gov Console' },
]

const ROLE_REDIRECT = {
  worker: '/worker', facility: '/facility', patient: '/patient', admin: '/admin',
}

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [activeRole, setActiveRole] = useState('worker')
  const [identifier, setIdentifier] = useState('')
  const [pin, setPin]               = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login({ identifier, pin, role: activeRole })
      login(res.data.user)
      navigate(ROLE_REDIRECT[activeRole] ?? '/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const role = ROLES.find(r => r.id === activeRole)

  return (
    <div className="login-page">
      <Navbar variant="public" subtitle="Portal Login" />

      <main className="login-main">
        {/* Emergency ribbon */}
        <a href="tel:108" className="login-emergency-ribbon">
          <div className="login-emergency-left">
            <span className="material-symbols-outlined">emergency</span>
            <span>Emergency 24/7 Helpline: 108</span>
          </div>
          <span className="login-emergency-cta">
            Call <span className="material-symbols-outlined">arrow_forward</span>
          </span>
        </a>

        {/* Heading */}
        <div className="login-heading">
          <h1>Sign in to GramHealth</h1>
          <p>Select your portal below to access your account</p>
        </div>

        {/* Role selector */}
        <div className="login-roles">
          {ROLES.map(r => (
            <button
              key={r.id}
              type="button"
              className={`login-role-btn ${activeRole === r.id ? 'login-role-btn--active' : ''}`}
              onClick={() => { setActiveRole(r.id); setError('') }}
            >
              <span className="login-role-icon">
                <span className="material-symbols-outlined">{r.icon}</span>
              </span>
              <span className="login-role-label">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Auth form */}
        <div className="login-form-card">
          <div className="login-form-header">
            <span className="login-form-icon">
              <span className="material-symbols-outlined">{role.icon}</span>
            </span>
            <div>
              <h2>{role.label} Login</h2>
              <span className="login-form-badge">{role.badge}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="identifier">
                {activeRole === 'admin' ? 'Admin Email' : 'Worker ID / Phone / Token'}
              </label>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">badge</span>
                <input
                  id="identifier"
                  type={activeRole === 'admin' ? 'email' : 'text'}
                  placeholder={activeRole === 'worker' ? 'e.g. ASHA-DEL-8924' : activeRole === 'admin' ? 'admin@gramhealth.in' : 'Enter ID'}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="pin">
                  {activeRole === 'admin' ? 'Security Code / TOTP' : 'Security PIN'}
                </label>
                <button type="button" className="login-forgot">Forgot?</button>
              </div>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">pin</span>
                <input
                  id="pin"
                  type="password"
                  placeholder="••••••"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="gh-btn-primary login-submit" disabled={loading}>
              <span className="material-symbols-outlined">login</span>
              <span>{loading ? 'Signing in…' : 'Sign In'}</span>
            </button>

            <button type="button" className="gh-btn-secondary login-otp">
              <span className="material-symbols-outlined">sms</span>
              Login with OTP
            </button>
          </form>
        </div>

        {/* Trust badge */}
        <div className="login-trust">
          <span className="material-symbols-outlined">lock</span>
          <span>256-Bit Encrypted &amp; ABDM Compliant</span>
        </div>

        {/* Help links */}
        <div className="login-help">
          <a href="#"><span className="material-symbols-outlined">contact_support</span> Need Setup Help?</a>
          <span>•</span>
          <a href="#"><span className="material-symbols-outlined">download</span> Offline Guide</a>
          <span>•</span>
          <a href="#"><span className="material-symbols-outlined">support_agent</span> Call Coordinator</a>
        </div>
      </main>

      <Footer variant="public" />
    </div>
  )
}

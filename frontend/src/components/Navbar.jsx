import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NetworkBadge from './NetworkBadge.jsx'
import './Navbar.css'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1Xx1QbeiZ6R9RK2cwtWiHrADKB6_VS6Y4QnW7A4f1XY2IonkWq569z8IbilQSnYwpBBEYq2zEYfnPDcdPOM935IQE1sGDZUsbe2q6QT340q90ZiPUcuOOtFYOS7fMS4pw4XkHsinM4OXKP9j3p8XwkH0Kbj09sZD7Ch0Hnv8nc1NpXhTEW5tQn9LwxrswjPf26XAEKIAWFJly-EMcU2_zCffDidh5Fko92HW5bIoNLjZfzG1YDwT7BUjv4'

/** Role → dashboard route map */
const ROLE_HOME = {
  worker:   '/worker',
  facility: '/facility',
  patient:  '/patient',
  admin:    '/admin',
}

/**
 * Navbar — two variants:
 *  variant="public"    → status bar + logo row (login / facilities / home)
 *  variant="dashboard" → compact h-24 header with facility context row
 */
export default function Navbar({
  variant = 'public',
  subtitle = 'Portal',
  facility = 'PHC Rampur · Dr. S. Sharma',
  syncText = 'Online · Connected',
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  /* ── Public variant ─────────────────────────────────────── */
  if (variant === 'public') {
    return (
      <header className="navbar-public">
        {/* Row 1 — status bar */}
        <div className="navbar-status-bar">
          <div className="navbar-status-left">
            <NetworkBadge />
          </div>
          <div className="navbar-status-right">
            <button className="navbar-lang-btn" type="button">
              <span className="material-symbols-outlined">translate</span>
              <span>EN / हिन्दी</span>
            </button>
            <a className="navbar-sos-btn" href="tel:108">
              <span className="material-symbols-outlined">sos</span>
              <span>108</span>
            </a>
          </div>
        </div>

        {/* Row 2 — logo + avatar */}
        <div className="navbar-logo-row">
          <Link to="/" className="navbar-brand">
            <img src={LOGO_URL} alt="GramHealth Logo" className="navbar-logo-img" />
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">GramHealth</span>
              <span className="navbar-brand-subtitle">{subtitle}</span>
            </div>
          </Link>
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/facilities" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0d9488' }}>map</span>
              <span>Facilities</span>
            </Link>
            <Link to="/analytics" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0d9488' }}>analytics</span>
              <span>Analytics</span>
            </Link>
            {user ? (
              <button className="navbar-avatar" onClick={handleLogout} title="Logout">
                <span className="material-symbols-outlined">person</span>
              </button>
            ) : (
              <Link to="/login" className="navbar-avatar">
                <span className="material-symbols-outlined">person</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    )
  }

  /* ── Dashboard variant ──────────────────────────────────── */
  return (
    <header className="navbar-dashboard">
      <div className="navbar-dashboard-inner">
        {/* Row 1 — logo + actions */}
        <div className="navbar-dash-row1">
          <Link to={user ? ROLE_HOME[user.role] ?? '/' : '/'} className="navbar-dash-brand">
            <div className="navbar-dash-icon">
              <span className="material-symbols-outlined">local_hospital</span>
            </div>
            <span className="navbar-dash-name">GramHealth</span>
          </Link>

          <div className="navbar-dash-actions">
            <a href="tel:108" className="navbar-sos-dash">
              <span className="material-symbols-outlined">e911_emergency</span>
              <span>SOS</span>
            </a>
            <button className="navbar-lang-dash" type="button">
              <span>EN</span>
              <span className="navbar-lang-sep">/</span>
              <span>हिं</span>
            </button>
            <button className="navbar-avatar-dash" onClick={handleLogout} title="Logout">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>

        {/* Row 2 — facility context + sync status */}
        <div className="navbar-dash-row2">
          <span className="navbar-facility-badge">
            <span className="material-symbols-outlined">apartment</span>
            {user?.facility ?? facility}
          </span>
          <div className="navbar-sync-badge">
            <span className="navbar-sync-dot" />
            <span>{syncText}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

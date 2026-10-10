import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Footer.css'

/**
 * Footer — fixed bottom navigation bar
 *
 * variant="public"    → Login / Facilities / Urgent Help / Support  (h-16)
 * variant="dashboard" → Queue / Facilities / Tracker|Admin / Settings (h-20)
 */
export default function Footer({ variant = 'public' }) {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'

  if (variant === 'public') {
    return (
      <nav className="footer-nav footer-nav--public" aria-label="Main navigation">
        <div className="footer-tabs">
          <NavLink to="/login" className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}>
            <span className="material-symbols-outlined">badge</span>
            <span>Login</span>
          </NavLink>
          <NavLink to="/facilities" className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}>
            <span className="material-symbols-outlined">local_hospital</span>
            <span>Facilities</span>
          </NavLink>
          <a href="tel:108" className="footer-tab footer-tab--emergency">
            <span className="material-symbols-outlined">emergency</span>
            <span>Urgent Help</span>
          </a>
          <a href="#support" className="footer-tab">
            <span className="material-symbols-outlined">support_agent</span>
            <span>Support</span>
          </a>
        </div>
      </nav>
    )
  }

  return (
    <nav className="footer-nav footer-nav--dashboard" aria-label="Dashboard navigation">
      <div className="footer-tabs">
        <NavLink
          to={user ? `/${user.role}` : '/'}
          className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}
        >
          <span className="material-symbols-outlined">view_kanban</span>
          <span>Queue</span>
        </NavLink>

        <NavLink to="/facilities" className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}>
          <span className="material-symbols-outlined">domain</span>
          <span>Facilities</span>
        </NavLink>

        {isAdmin ? (
          <NavLink to="/admin" className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}>
            <span className="material-symbols-outlined">query_stats</span>
            <span>Admin</span>
          </NavLink>
        ) : (
          <NavLink to="/patient" className={({ isActive }) => `footer-tab ${isActive ? 'footer-tab--active' : ''}`}>
            <span className="material-symbols-outlined">personal_injury</span>
            <span>Tracker</span>
          </NavLink>
        )}

        <NavLink to="/login" className="footer-tab">
          <span className="material-symbols-outlined">manage_accounts</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  )
}

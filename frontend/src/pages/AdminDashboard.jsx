import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AnalyticsSection from '../components/AnalyticsSection.jsx'
import './AdminDashboard.css'

const SECTIONS = ['overview', 'users', 'facilities', 'referrals', 'analytics', 'audit', 'settings']

const MOCK_USERS = [
  { id: 1, name: 'Sunita Devi',   role: 'worker',   status: 'active',   joined: '12 Jan 2025' },
  { id: 2, name: 'Dr. S. Sharma', role: 'facility',  status: 'active',   joined: '05 Mar 2025' },
  { id: 3, name: 'Meena Devi',    role: 'patient',   status: 'active',   joined: '20 Jun 2025' },
  { id: 4, name: 'Ravi Kumar',    role: 'admin',     status: 'active',   joined: '01 Jan 2024' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [userSearch, setUserSearch] = useState('')
  const [settings, setSettings] = useState({ platformName: 'GramHealthcare', supportEmail: '', twoFactor: false, passwordExpiry: false, offlineCacheSize: 100 })
  const [settingsSaved, setSettingsSaved] = useState(false)

  function handleSettingsSave(e) {
    e.preventDefault()
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2000)
  }

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  )

  const NAV_LABELS = { overview:'Overview', users:'Users', facilities:'Facilities', referrals:'Referrals', analytics:'Analytics', audit:'Audit Logs', settings:'Settings' }

  return (
    <div className="ad-page">
      <Navbar variant="dashboard" syncText="Cloud Synchronized" facility="Admin Console" />

      <main className="ad-main">
        <div className="ad-layout">
          {/* Sidebar */}
          <aside className="ad-sidebar">
            {SECTIONS.map(s => (
              <button key={s} type="button"
                className={`ad-nav-item ${activeSection === s ? 'ad-nav-item--active' : ''}`}
                onClick={() => setActiveSection(s)}>
                {NAV_LABELS[s]}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="ad-content">

            {/* ── Overview ── */}
            {activeSection === 'overview' && (
              <section>
                <h2 className="ad-section-title">System Overview</h2>
                <div className="ad-stats-grid">
                  <div className="ad-stat-card">
                    <p className="ad-stat-label">Total Users</p>
                    <p className="ad-stat-value">24</p>
                  </div>
                  <div className="ad-stat-card">
                    <p className="ad-stat-label">Total Facilities</p>
                    <p className="ad-stat-value">14</p>
                  </div>
                  <div className="ad-stat-card">
                    <p className="ad-stat-label">Active Referrals</p>
                    <p className="ad-stat-value">8</p>
                  </div>
                  <div className="ad-stat-card ad-stat-card--green">
                    <p className="ad-stat-label">System Health</p>
                    <p className="ad-stat-value ad-stat-value--text">Good</p>
                  </div>
                </div>

                <div className="ad-overview-cards">
                  <div className="ad-overview-card">
                    <span className="material-symbols-outlined ad-ov-icon">trending_up</span>
                    <div>
                      <h3>Referrals This Month</h3>
                      <p>142 referrals processed — 94% completion rate</p>
                    </div>
                  </div>
                  <div className="ad-overview-card">
                    <span className="material-symbols-outlined ad-ov-icon">cloud_sync</span>
                    <div>
                      <h3>Offline Sync Queue</h3>
                      <p>3 pending drafts from field workers awaiting network</p>
                    </div>
                  </div>
                  <div className="ad-overview-card">
                    <span className="material-symbols-outlined ad-ov-icon">verified_user</span>
                    <div>
                      <h3>Compliance Status</h3>
                      <p>ABDM compliant · Last audit: 7 Oct 2025</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Users ── */}
            {activeSection === 'users' && (
              <section>
                <div className="ad-section-header">
                  <h2 className="ad-section-title">User Management</h2>
                  <button className="gh-btn-primary ad-add-btn">
                    <span className="material-symbols-outlined">person_add</span> Add User
                  </button>
                </div>
                <div className="ad-search-row">
                  <div className="ad-search-wrap">
                    <span className="material-symbols-outlined">search</span>
                    <input type="search" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
                </div>
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>Name</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td><span className={`ad-role-badge ad-role-badge--${u.role}`}>{u.role}</span></td>
                          <td><span className="ad-status-dot" /> {u.status}</td>
                          <td>{u.joined}</td>
                          <td>
                            <button className="ad-action-btn">Edit</button>
                            <button className="ad-action-btn ad-action-btn--danger">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ── Facilities ── */}
            {activeSection === 'facilities' && (
              <section>
                <div className="ad-section-header">
                  <h2 className="ad-section-title">Facilities Management</h2>
                  <button className="gh-btn-primary ad-add-btn">
                    <span className="material-symbols-outlined">add_location</span> Add Facility
                  </button>
                </div>
                <p className="ad-placeholder-text">14 verified facilities in Moradabad District. Connect to backend to manage.</p>
              </section>
            )}

            {/* ── Referrals ── */}
            {activeSection === 'referrals' && (
              <section>
                <h2 className="ad-section-title">Referral System</h2>
                <div className="ad-tabs">
                  {['All Referrals', 'Pending', 'Completed', 'Rejected'].map(t => (
                    <button key={t} className="ad-tab">{t}</button>
                  ))}
                </div>
                <p className="ad-placeholder-text">Connect to backend API to load referral data.</p>
              </section>
            )}

            {/* ── Analytics ── */}
            {activeSection === 'analytics' && (
              <section>
                <h2 className="ad-section-title">Analytics &amp; Operational Reports</h2>
                <AnalyticsSection />
              </section>
            )}

            {/* ── Audit Logs ── */}
            {activeSection === 'audit' && (
              <section>
                <h2 className="ad-section-title">Audit Logs</h2>
                <div className="ad-search-row">
                  <div className="ad-search-wrap">
                    <span className="material-symbols-outlined">search</span>
                    <input type="search" placeholder="Search logs..." />
                  </div>
                </div>
                <p className="ad-placeholder-text">Audit log data loads from backend. All user actions are tracked.</p>
              </section>
            )}

            {/* ── Settings ── */}
            {activeSection === 'settings' && (
              <section>
                <h2 className="ad-section-title">System Settings</h2>
                <form className="ad-settings-form" onSubmit={handleSettingsSave}>
                  <h3>General</h3>
                  <div className="ad-field">
                    <label>Platform Name</label>
                    <input type="text" value={settings.platformName} onChange={e => setSettings(s => ({...s, platformName: e.target.value}))} required />
                  </div>
                  <div className="ad-field">
                    <label>Support Email</label>
                    <input type="email" placeholder="support@gramhealth.in" value={settings.supportEmail} onChange={e => setSettings(s => ({...s, supportEmail: e.target.value}))} />
                  </div>

                  <h3>Security</h3>
                  <label className="ad-checkbox-label">
                    <input type="checkbox" checked={settings.twoFactor} onChange={e => setSettings(s => ({...s, twoFactor: e.target.checked}))} />
                    Enable Two-Factor Authentication
                  </label>
                  <label className="ad-checkbox-label">
                    <input type="checkbox" checked={settings.passwordExpiry} onChange={e => setSettings(s => ({...s, passwordExpiry: e.target.checked}))} />
                    Enable Password Expiry
                  </label>

                  <h3>Offline</h3>
                  <div className="ad-field">
                    <label>Offline Cache Size (MB)</label>
                    <input type="number" value={settings.offlineCacheSize} onChange={e => setSettings(s => ({...s, offlineCacheSize: e.target.value}))} />
                  </div>

                  <button type="submit" className="gh-btn-primary ad-save-btn">
                    <span className="material-symbols-outlined">save</span>
                    {settingsSaved ? 'Saved ✓' : 'Save Settings'}
                  </button>
                </form>
              </section>
            )}

          </div>
        </div>
      </main>

      <Footer variant="dashboard" />
    </div>
  )
}

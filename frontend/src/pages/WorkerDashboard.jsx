import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { referralsAPI } from '../services/api.js'
import './WorkerDashboard.css'

const FACILITIES = [
  { value: 'phc-rampur',        label: 'PHC Rampur — 3.2 km (Open Now)' },
  { value: 'chc-shivnagar',     label: 'CHC Shivnagar — 7.8 km (24x7 Emergency)' },
  { value: 'hwc-kalyanpur',     label: 'Kalyanpur HWC — 1.1 km' },
  { value: 'district-moradabad',label: 'Moradabad District Hospital — 18.5 km' },
]

const URGENCY = ['Routine', 'Priority', 'Emergency']
const GENDERS = ['Female', 'Male', 'Child']

const INITIAL_DRAFTS = [
  { id: 'draft-1', name: 'Ramesh Kumar (Age 52)',  complaint: 'Chest Pain',    facility: 'Shivnagar CHC',  urgency: 'Emergency', time: '25m ago', status: 'pending' },
  { id: 'draft-2', name: 'Baby of Anita (Infant)', complaint: 'Immunization',  facility: 'PHC Rampur',     urgency: 'Routine',   time: '1h ago',  status: 'cached' },
  { id: 'draft-3', name: 'Kavita Devi (Age 34)',   complaint: 'Severe Anemia', facility: 'Kalyanpur HWC',  urgency: 'Priority',  time: '3h ago',  status: 'cached' },
]

export default function WorkerDashboard() {
  const { user } = useAuth()

  // Form state
  const [patientId,  setPatientId]  = useState('Meena Devi')
  const [age,        setAge]        = useState(26)
  const [gender,     setGender]     = useState('Female')
  const [facility,   setFacility]   = useState('phc-rampur')
  const [symptoms,   setSymptoms]   = useState('High fever 3 days, pedal edema, ANC 3rd trimester specialized sonography consultation required.')
  const [urgency,    setUrgency]    = useState('Priority')
  const [submitting, setSubmitting] = useState(false)

  // Generated token
  const [token,      setToken]      = useState({ id: 'REF-1092', visible: true })

  // Drafts
  const [drafts,     setDrafts]     = useState(INITIAL_DRAFTS)
  const [syncing,    setSyncing]    = useState(false)

  async function handleGenerateToken(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const facilityLabel = FACILITIES.find(f => f.value === facility)?.label.split('—')[0].trim()
      const newId = `REF-${Math.floor(1000 + Math.random() * 9000)}`
      setToken({ id: newId, patientName: `${patientId} (${age}${gender[0]})`, facilityName: facilityLabel, visible: true })
      // await referralsAPI.create({ patientId, age, gender, facility, symptoms, urgency })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveDraft() {
    const draft = {
      id: `draft-${Date.now()}`,
      name: `${patientId} (Age ${age})`,
      complaint: symptoms.substring(0, 30),
      facility: FACILITIES.find(f => f.value === facility)?.label.split('—')[0].trim(),
      urgency,
      time: 'Just now',
      status: 'cached',
    }
    setDrafts(prev => [draft, ...prev])
  }

  async function handleForceSync(draftId) {
    setSyncing(true)
    setTimeout(() => {
      setDrafts(prev => prev.filter(d => d.id !== draftId))
      setSyncing(false)
    }, 1200)
  }

  return (
    <div className="wd-page">
      <Navbar variant="dashboard" syncText="Online · Auto-Sync Active" facility={user?.facility ?? 'Sub-Centre Kalyanpur • Moradabad'} />

      <main className="wd-main">
        {/* Profile banner */}
        <section className="wd-profile">
          <div className="wd-profile-left">
            <div className="wd-avatar">
              <span>{(user?.name ?? 'Sunita Devi').split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
              <span className="wd-avatar-dot" />
            </div>
            <div>
              <div className="wd-profile-name-row">
                <h1>{user?.name ?? 'Sunita Devi'}</h1>
                <span className="wd-badge">ASHA #8924</span>
              </div>
              <p className="wd-profile-sub">Sub-Centre Kalyanpur • Moradabad District</p>
            </div>
          </div>
          <button className="wd-sync-btn" type="button" onClick={() => setSyncing(s => !s)}>
            <span className={`material-symbols-outlined ${syncing ? 'wd-spin' : ''}`}>sync</span>
            <span>Sync Now</span>
          </button>
        </section>

        {/* Quick stats */}
        <div className="wd-stats">
          <div className="wd-stat-card">
            <p className="wd-stat-value">05</p>
            <p className="wd-stat-label">Today's Ref.</p>
          </div>
          <div className="wd-stat-card wd-stat-card--orange">
            <p className="wd-stat-value">04</p>
            <p className="wd-stat-label">Pending Visits</p>
          </div>
          <div className="wd-stat-card wd-stat-card--green">
            <p className="wd-stat-value">{drafts.length}</p>
            <p className="wd-stat-label">Drafts Stored</p>
          </div>
        </div>

        {/* ── Section 1: Referral Form ── */}
        <section className="wd-card">
          <div className="wd-section-header">
            <div className="wd-section-title-row">
              <span className="material-symbols-outlined">assignment_add</span>
              <h2>Digital Assistance Request</h2>
            </div>
            <span className="wd-tag">Field Intake</span>
          </div>
          <p className="wd-section-desc">Generate instant referral tokens for rural patients directly to nearby facilities.</p>

          <form className="wd-form" onSubmit={handleGenerateToken}>
            {/* Patient ID */}
            <div className="wd-field">
              <label htmlFor="patientId">Patient Name or ABHA / Aadhaar ID</label>
              <div className="wd-input-wrap">
                <span className="material-symbols-outlined wd-input-icon">badge</span>
                <input id="patientId" type="text" placeholder="e.g., Meena Devi or 9821-4321-0012"
                  value={patientId} onChange={e => setPatientId(e.target.value)} required />
                <button type="button" className="wd-scan-btn">
                  <span className="material-symbols-outlined">qr_code_scanner</span> Scan
                </button>
              </div>
            </div>

            {/* Age + Gender */}
            <div className="wd-row">
              <div className="wd-field wd-field--half">
                <label htmlFor="age">Age (Years)</label>
                <div className="wd-input-wrap">
                  <span className="material-symbols-outlined wd-input-icon">calendar_today</span>
                  <input id="age" type="number" min="0" max="120"
                    value={age} onChange={e => setAge(e.target.value)} required />
                </div>
              </div>
              <div className="wd-field wd-field--half">
                <label>Gender</label>
                <div className="wd-gender-group">
                  {GENDERS.map(g => (
                    <button key={g} type="button"
                      className={`wd-gender-pill ${gender === g ? 'wd-gender-pill--active' : ''}`}
                      onClick={() => setGender(g)}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Facility */}
            <div className="wd-field">
              <label htmlFor="facility">Target Healthcare Facility</label>
              <div className="wd-input-wrap wd-input-wrap--select">
                <span className="material-symbols-outlined wd-input-icon">local_hospital</span>
                <select id="facility" value={facility} onChange={e => setFacility(e.target.value)}>
                  {FACILITIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <span className="material-symbols-outlined wd-select-arrow">expand_more</span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="wd-field">
              <label htmlFor="symptoms">Patient Symptoms &amp; Chief Complaints</label>
              <textarea id="symptoms" rows={3} placeholder="e.g., High fever 3 days..."
                value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </div>

            {/* Urgency */}
            <div className="wd-field">
              <label>Urgency / Triage Level</label>
              <div className="wd-urgency-group">
                {URGENCY.map(u => (
                  <button key={u} type="button"
                    className={`wd-urgency-btn wd-urgency-btn--${u.toLowerCase()} ${urgency === u ? 'wd-urgency-btn--active' : ''}`}
                    onClick={() => setUrgency(u)}>
                    <span className="wd-urgency-dot" />
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="gh-btn-primary wd-submit-btn" disabled={submitting}>
              <span className="material-symbols-outlined">confirmation_number</span>
              {submitting ? 'Generating…' : 'Generate Instant Referral Token'}
            </button>
            <button type="button" className="gh-btn-secondary wd-draft-btn" onClick={handleSaveDraft}>
              <span className="material-symbols-outlined">save</span>
              Save to Offline Drafts
            </button>
          </form>
        </section>

        {/* ── Section 2: Token card ── */}
        {token.visible && (
          <section className="wd-token-card">
            <div className="wd-token-header">
              <div className="wd-token-title">
                <span className="material-symbols-outlined">verified</span>
                <span>Active Referral Token</span>
              </div>
              <span className="wd-token-badge">Live Validated</span>
            </div>

            <div className="wd-token-id-row">
              <div>
                <span className="wd-token-id-label">GramHealth Token ID</span>
                <span className="wd-token-id">{token.id}</span>
              </div>
              <button className="wd-copy-btn" onClick={() => navigator.clipboard?.writeText(token.id)}
                title="Copy Token ID">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>

            <div className="wd-token-meta">
              <div className="wd-token-meta-item">
                <span>Patient</span>
                <strong>{token.patientName ?? `${patientId} (${age}${gender[0]})`}</strong>
              </div>
              <div className="wd-token-meta-item">
                <span>Referred To</span>
                <strong>{token.facilityName ?? FACILITIES.find(f => f.value === facility)?.label.split('—')[0].trim()}</strong>
              </div>
              <div className="wd-token-meta-item">
                <span>Urgency</span>
                <strong>{urgency}</strong>
              </div>
              <div className="wd-token-meta-item">
                <span>Issued</span>
                <strong>Today • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
              </div>
            </div>

            <div className="wd-token-actions">
              <button className="wd-token-sms-btn" onClick={() => alert(`SMS sent for ${token.id}`)}>
                <span className="material-symbols-outlined">sms</span> SMS to Patient
              </button>
              <button className="wd-token-wa-btn" onClick={() => alert(`WhatsApp slip for ${token.id}`)}>
                <span className="material-symbols-outlined">share</span> WhatsApp Slip
              </button>
            </div>
          </section>
        )}

        {/* ── Section 3: Offline Drafts ── */}
        <section className="wd-card">
          <div className="wd-section-header">
            <div className="wd-section-title-row">
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>offline_pin</span>
              <h2>Offline Drafts Queue</h2>
            </div>
            <span className="wd-tag wd-tag--green">{drafts.length} Stored</span>
          </div>
          <p className="wd-info-bar">
            <span className="material-symbols-outlined">info</span>
            Saved safely in phone storage. Syncs automatically when 3G/4G reconnects.
          </p>
          <div className="wd-drafts-list">
            {drafts.map(d => (
              <div key={d.id} className="wd-draft-item">
                <div className="wd-draft-top">
                  <div>
                    <div className="wd-draft-name">
                      <span className={`wd-draft-dot wd-draft-dot--${d.status === 'pending' ? 'error' : 'green'}`} />
                      {d.name}
                    </div>
                    <p className="wd-draft-sub">{d.complaint} • <strong>{d.facility}</strong></p>
                  </div>
                  <span className="wd-draft-time">{d.time}</span>
                </div>
                <div className="wd-draft-actions">
                  <span className={`wd-draft-status ${d.status === 'pending' ? 'wd-draft-status--error' : ''}`}>
                    <span className="material-symbols-outlined">{d.status === 'pending' ? 'cloud_queue' : 'sd_card'}</span>
                    {d.status === 'pending' ? 'Pending Network' : 'Cached in IndexedDB'}
                  </span>
                  <div className="wd-draft-btns">
                    <button className="wd-draft-edit">Edit</button>
                    <button className="wd-draft-sync" onClick={() => handleForceSync(d.id)} disabled={syncing}>
                      <span className="material-symbols-outlined">sync</span> Force Sync
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {drafts.length === 0 && <p className="wd-drafts-empty">All drafts synced ✓</p>}
          </div>
        </section>
      </main>

      <Footer variant="dashboard" />
    </div>
  )
}

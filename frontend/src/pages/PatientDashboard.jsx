import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './PatientDashboard.css'

const STAGES = [
  { key: 'REQUESTED',       label: 'Stage 1: REQUESTED',         icon: 'check',         sub: 'Community HWC initiated by ASHA Sunita Devi.',   facility: 'Kalyanpur Sub-Centre', time: '08:30 AM', done: true  },
  { key: 'REFERRED',        label: 'Stage 2: REFERRED & TRANSIT', icon: 'check',         sub: 'Dispatched with JSSK transport to PHC Rampur.',   facility: 'Driver: Rakesh (Ambulance 108)', time: '09:15 AM', done: true },
  { key: 'RECEIVED',        label: 'Stage 3: RECEIVED & TRIAGED', icon: 'stethoscope',   sub: 'Triaged at PHC Rampur • Doctor OPD in progress (Room 03).', facility: 'Dr. S. Sharma & Staff Nurse Sunita Verma', time: '10:45 AM (Now)', done: false, active: true },
  { key: 'COMPLETED',       label: 'Stage 4: VISIT COMPLETED',    icon: 'medication',    sub: 'Discharge slip, prescribed medicines & digital Rx.', facility: '~11:15 AM', time: '', done: false },
  { key: 'CLOSED',          label: 'Stage 5: CLOSED & FOLLOW-UP', icon: 'home_health',   sub: 'Home recovery review by Village ASHA Worker.',   facility: 'In 7 Days', time: '', done: false },
]

const VITALS = [
  { label: 'Blood Pressure', value: '144/92', unit: 'mmHg', type: 'alert', icon: 'priority_high', note: 'Under Clinical Watch' },
  { label: 'SpO2 Oxygen',    value: '97',     unit: '%',    type: 'ok',    icon: 'air',           note: 'Optimal' },
  { label: 'Temperature',    value: '101.8',  unit: '°F',   type: 'warn',  icon: 'thermostat',    note: 'Mild Fever' },
  { label: 'Fetal Heart Rate', value: '148',  unit: 'bpm',  type: 'ok',    icon: 'favorite',      note: 'Healthy Range' },
]

export default function PatientDashboard() {
  const { user } = useAuth()
  const [tokenInput, setTokenInput] = useState('REF-1092')
  const [activeToken, setActiveToken] = useState('REF-1092')
  const [reminderOn, setReminderOn] = useState(true)

  function handleTrack(e) {
    e.preventDefault()
    setActiveToken(tokenInput)
  }

  return (
    <div className="pd-page">
      <Navbar variant="dashboard" syncText="Online · OPD Connected" facility={user?.facility ?? 'PHC Rampur · Dr. S. Sharma'} />

      <main className="pd-main">
        {/* Patient identity header */}
        <section className="pd-card pd-identity">
          <div className="pd-identity-left">
            <div className="pd-identity-avatar-wrap">
              <div className="pd-identity-avatar">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuADv3NRfkRim4Kh8OEQS_IEGnH2XA5SG1VhTIxwZh5GBfdQwcKAymp7a-7gNfz5kiMHic06t_PhXTM_ftk6YElblkClC_aWOTYMfrC8Va8Tb2GBlmDH4rWW7dNvp46GmxqMzxmn9GlAS9LXGmFRex6JmDacXscUQywwlLJxiQn0OTI_5_kYa1VVx-ovIHsbMur8xeH3xQStLx9RSEBX-1bIlf7BTafw198pUmo9T6BwJV_R3B9ZTA0J"
                  alt="Patient" className="pd-avatar-img" />
                <span className="pd-avatar-online" />
              </div>
            </div>
            <div className="pd-identity-info">
              <div className="pd-identity-name-row">
                <h1>नमस्ते, {user?.name ?? 'Meena Devi'}</h1>
                <span className="pd-verified-badge">
                  <span className="material-symbols-outlined">verified_user</span> Verified
                </span>
              </div>
              <p className="pd-abha"><span className="material-symbols-outlined">badge</span> ABHA: 91-8273-0912</p>
              <p className="pd-location">Kalyanpur Gram Panchayat • Sector 4</p>
            </div>
          </div>
          <span className="pd-portal-badge">
            <span className="material-symbols-outlined">clinical_notes</span>
            मरीज पोर्टल
          </span>
        </section>

        {/* Token search */}
        <section className="pd-card">
          <div className="pd-token-header">
            <span className="material-symbols-outlined">pin_drop</span>
            <h2>Track Care Journey</h2>
            <span className="pd-token-sub-label">रेफरल ट्रैक करें</span>
          </div>
          <p className="pd-token-desc">Enter token ID from your clinic slip or SMS to view real-time doctor status.</p>
          <form className="pd-token-form" onSubmit={handleTrack}>
            <div className="pd-token-input-wrap">
              <span className="material-symbols-outlined pd-token-icon">confirmation_number</span>
              <input type="text" placeholder="e.g. REF-1092" value={tokenInput}
                onChange={e => setTokenInput(e.target.value)} />
              <button type="button" className="pd-qr-btn">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </button>
            </div>
            <button type="submit" className="gh-btn-primary pd-track-btn">
              <span className="material-symbols-outlined">search</span> Track
            </button>
          </form>
          <div className="pd-recent-tokens">
            <span className="pd-recent-label">Recent:</span>
            <button className="pd-recent-btn" onClick={() => setTokenInput('REF-1092')}>
              <span className="material-symbols-outlined">history</span> REF-1092 (Meena Devi)
            </button>
            <button className="pd-recent-btn" onClick={() => setTokenInput('REF-1081')}>REF-1081 (Kavita)</button>
          </div>
        </section>

        {/* Live journey stepper */}
        <section className="pd-card">
          <div className="pd-journey-header">
            <div className="pd-journey-title-row">
              <span className="pd-pulse-dot" />
              <h2>Live Referral Pathway</h2>
            </div>
            <div className="pd-journey-token-info">
              <span className="pd-journey-priority">High Priority ANC</span>
              <p className="pd-journey-eta">Est. Complete: ~15 mins</p>
            </div>
          </div>
          <p className="pd-journey-token-label">Token #{activeToken} • Phase 3 of 5</p>

          {/* Active status banner */}
          <div className="pd-active-banner">
            <div className="pd-active-icon">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <div>
              <div className="pd-active-status-row">
                <span>Current Status:</span>
                <span className="pd-active-status">In OPD Exam Room 03</span>
              </div>
              <p className="pd-active-sub">Arrived at PHC: 10:45 AM • Dr. S. Sharma evaluating ultrasound &amp; vitals.</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="pd-stepper">
            {STAGES.map((s, i) => (
              <div key={s.key} className={`pd-step ${s.active ? 'pd-step--active' : ''} ${!s.done && !s.active ? 'pd-step--upcoming' : ''}`}>
                <div className={`pd-step-dot ${s.done ? 'pd-step-dot--done' : ''} ${s.active ? 'pd-step-dot--active' : ''}`}>
                  {s.done ? <span className="material-symbols-outlined">check</span>
                           : <span className="material-symbols-outlined">{s.icon}</span>}
                  {s.active && <span className="pd-step-pulse" />}
                </div>
                <div className={`pd-step-content ${s.active ? 'pd-step-content--active' : ''}`}>
                  <div className="pd-step-header">
                    <h3 className="pd-step-title">{s.label}</h3>
                    <span className="pd-step-time">{s.time}</span>
                  </div>
                  <p className="pd-step-sub">{s.sub}</p>
                  {s.facility && <span className="pd-step-facility">{s.facility}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vitals */}
        <section className="pd-card">
          <div className="pd-vitals-header">
            <span className="material-symbols-outlined">monitor_heart</span>
            <h2>Key Vitals Recorded Today</h2>
            <span className="pd-vitals-time">10:50 AM</span>
          </div>
          <div className="pd-vitals-grid">
            {VITALS.map(v => (
              <div key={v.label} className={`pd-vital-card pd-vital-card--${v.type}`}>
                <div className="pd-vital-card-top">
                  <span className="pd-vital-label">{v.label}</span>
                  <span className="material-symbols-outlined pd-vital-icon">{v.icon}</span>
                </div>
                <div className="pd-vital-value-row">
                  <span className="pd-vital-value">{v.value}</span>
                  <span className="pd-vital-unit">{v.unit}</span>
                </div>
                <span className="pd-vital-note">{v.note}</span>
              </div>
            ))}
          </div>

          {/* Prescription */}
          <div className="pd-rx-card">
            <div className="pd-rx-header">
              <span className="material-symbols-outlined">receipt_long</span>
              <h3>Doctor's Clinical Instructions</h3>
              <span className="pd-rx-badge">Live Rx</span>
            </div>
            <p className="pd-rx-text">
              <strong>Prescribed Medicines:</strong> Oral Iron-Folic Acid tablets (2x daily after meals),
              Calcium carbonate 500mg, Paracetamol for fever if temp &gt; 101°F. Rest in left lateral position.
            </p>
            <div className="pd-rx-actions">
              <button className="gh-btn-secondary pd-rx-btn"
                onClick={() => alert('Downloading Digital OPD Slip PDF...')}>
                <span className="material-symbols-outlined">download</span> Download Slip (PDF)
              </button>
              <button className="gh-btn-primary pd-rx-btn"
                onClick={() => alert('Sending to WhatsApp...')}>
                <span className="material-symbols-outlined">share</span> WhatsApp
              </button>
            </div>
          </div>

          {/* Follow-up */}
          <div className="pd-followup-card">
            <div className="pd-followup-header">
              <span className="material-symbols-outlined">calendar_clock</span>
              <div>
                <h3>Next Scheduled Follow-up</h3>
                <p className="pd-followup-date">October 24, 2025 (In 7 Days)</p>
              </div>
              <span className="pd-followup-badge">Sonography USG</span>
            </div>
            <p className="pd-followup-desc">Specialist Sonography checkup at PHC Rampur &amp; scheduled home visit by ASHA Sunita Devi.</p>
            <div className="pd-reminder-row">
              <span className="pd-reminder-label">
                <span className="material-symbols-outlined">notifications_active</span>
                SMS &amp; WhatsApp Visit Reminders
              </span>
              <label className="pd-toggle">
                <input type="checkbox" checked={reminderOn} onChange={e => setReminderOn(e.target.checked)} />
                <span className="pd-toggle-track" />
              </label>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="dashboard" />
    </div>
  )
}

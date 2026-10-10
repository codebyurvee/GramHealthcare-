import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './FacilityDashboard.css'

const STAGES = ['REQUESTED', 'REFERRED', 'RECEIVED', 'COMPLETED', 'CLOSED']

const INITIAL_REFERRALS = [
  {
    id: 'REF-1092', priority: 'High Priority ANC', priorityType: 'error',
    status: 'REFERRED', statusNext: 'RECEIVED',
    patient: 'Meena Devi', age: '26F', ga: '32 Wks GA', abha: '91-8273-0912',
    referredBy: 'Sunita Devi (ASHA #8924)', referredFrom: 'Sub-Centre Kalyanpur (4.2 km)',
    complaint: 'High fever 3 days, bilateral pedal edema (++), 3rd trimester pregnancy. BP 144/92 mmHg.',
    vitals: ['SpO2: 97%', 'Temp: 101.8°F', 'BP: 144/92 mmHg', 'Fetal HR: 148 bpm'],
    time: '11:15 AM', category: 'pending',
  },
  {
    id: 'REF-1087', priority: 'Priority NCD', priorityType: 'tertiary',
    status: 'RECEIVED', statusNext: 'COMPLETED',
    patient: 'Ramesh Kumar', age: '52M', ga: null, abha: '91-3341-8890',
    referredBy: 'Manoj Kumar (ASHA)', referredFrom: 'Shivnagar HWC',
    complaint: 'Substernal chest tightness 2h, diaphoresis. BP 150/95 mmHg. 12-lead ECG done.',
    vitals: ['BP: 150/95', 'Pulse: 92 bpm'],
    time: '10:45 AM', category: 'active',
  },
  {
    id: 'REF-1081', priority: 'Routine Care', priorityType: 'success',
    status: 'COMPLETED', statusNext: 'CLOSED',
    patient: 'Kavita Devi', age: '34F', ga: null, abha: '91-1192-3401',
    referredBy: 'Priya Sharma (ASHA)', referredFrom: 'Kalyanpur HWC',
    complaint: 'Severe Anemia (Hb 7.2 g/dL). IV Iron Sucrose infused. Vitals stable.',
    vitals: ['Hb: 7.2 g/dL'],
    time: '09:30 AM', category: 'completed',
  },
]

const FILTERS = ['all', 'pending', 'active', 'completed']

export default function FacilityDashboard() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS)
  const [activeFilter, setActiveFilter] = useState('all')

  function advanceStage(id) {
    setReferrals(prev => prev.map(r => {
      if (r.id !== id) return r
      const idx = STAGES.indexOf(r.status)
      const nextStatus = STAGES[Math.min(idx + 1, STAGES.length - 1)]
      const nextNext   = STAGES[Math.min(idx + 2, STAGES.length - 1)]
      return { ...r, status: nextStatus, statusNext: nextNext }
    }))
  }

  const visible = referrals.filter(r => activeFilter === 'all' || r.category === activeFilter)

  return (
    <div className="fd-page">
      <Navbar variant="dashboard" syncText="Online · OPD Connected" facility={user?.facility ?? 'PHC Rampur · Dr. S. Sharma'} />

      <main className="fd-main">
        {/* Station overview */}
        <section className="fd-card">
          <div className="fd-overview-top">
            <div>
              <div className="fd-overview-badges">
                <span className="fd-badge fd-badge--primary">
                  <span className="material-symbols-outlined">local_pharmacy</span> OPD &amp; Triage
                </span>
                <span className="fd-room-label">Room 03 · Desk A</span>
              </div>
              <h1 className="fd-facility-title">PHC Rampur — Intake &amp; Triage</h1>
            </div>
            <span className="fd-live-badge">
              <span className="fd-live-dot" /> Live Shift Active
            </span>
          </div>

          {/* Staff row */}
          <div className="fd-staff-row">
            <div className="fd-staff-left">
              <div className="fd-staff-icon">
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <div>
                <p className="fd-staff-name">Dr. S. Sharma <span className="fd-staff-role">(Medical Officer)</span></p>
                <p className="fd-staff-sub">Nurse In-charge: Sunita Verma (Staff RN-04)</p>
              </div>
            </div>
            <button className="fd-handover-btn">
              <span className="material-symbols-outlined">swap_horiz</span> Handover
            </button>
          </div>

          {/* KPI grid */}
          <div className="fd-kpi-grid">
            <div className="fd-kpi fd-kpi--default">
              <span className="fd-kpi-label">Incoming Today</span>
              <div className="fd-kpi-value-row"><span className="fd-kpi-value">14</span><span className="material-symbols-outlined">transfer_within_a_station</span></div>
            </div>
            <div className="fd-kpi fd-kpi--light">
              <span className="fd-kpi-label">In OPD / Exam</span>
              <div className="fd-kpi-value-row"><span className="fd-kpi-value">06</span><span className="material-symbols-outlined">medical_services</span></div>
            </div>
            <div className="fd-kpi fd-kpi--green">
              <span className="fd-kpi-label">Completed</span>
              <div className="fd-kpi-value-row"><span className="fd-kpi-value">08</span><span className="material-symbols-outlined">task_alt</span></div>
            </div>
            <div className="fd-kpi fd-kpi--error">
              <span className="fd-kpi-label">Critical Triage</span>
              <div className="fd-kpi-value-row"><span className="fd-kpi-value">02</span><span className="material-symbols-outlined">e911_emergency</span></div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="fd-filter-tabs">
            {FILTERS.map(f => (
              <button key={f} type="button"
                className={`fd-filter-tab ${activeFilter === f ? 'fd-filter-tab--active' : ''}`}
                onClick={() => setActiveFilter(f)}>
                {f === 'all' ? `All Referrals (${referrals.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* State machine guide */}
        <section className="fd-card fd-lifecycle">
          <div className="fd-lifecycle-header">
            <span className="material-symbols-outlined">conversion_path</span>
            <h2>Referral Lifecycle</h2>
          </div>
          <div className="fd-stages">
            {STAGES.map((s, i) => (
              <div key={s} className="fd-stage">
                <div className={`fd-stage-dot ${i < 3 ? 'fd-stage-dot--done' : ''} ${i === 2 ? 'fd-stage-dot--active' : ''}`}>
                  {i < 2 ? <span className="material-symbols-outlined">check</span> : i + 1}
                </div>
                <span className="fd-stage-label">{i + 1}. {s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Referral cards */}
        <h2 className="fd-section-heading">
          <span className="material-symbols-outlined">clinical_notes</span>
          Incoming &amp; In-Clinic Referrals
        </h2>

        {visible.map(r => (
          <section key={r.id} className={`fd-referral-card fd-referral-card--${r.priorityType}`}>
            <div className="fd-ref-top">
              <div className="fd-ref-badges">
                <span className="fd-ref-id">{r.id}</span>
                <span className={`fd-ref-priority fd-ref-priority--${r.priorityType}`}>{r.priority}</span>
              </div>
              <span className="fd-ref-time">{r.time}</span>
            </div>

            <div className="fd-ref-patient">
              <div className="fd-ref-avatar">{r.patient.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
              <div>
                <p className="fd-ref-patient-name">{r.patient} <span className="fd-ref-patient-age">({r.age}{r.ga ? ` · ${r.ga}` : ''})</span></p>
                <p className="fd-ref-abha"><span className="material-symbols-outlined">badge</span>ABHA #{r.abha}</p>
              </div>
              <div className="fd-ref-ref-by">
                <p className="fd-ref-by-name">{r.referredBy}</p>
                <p className="fd-ref-by-from">{r.referredFrom}</p>
              </div>
            </div>

            <div className="fd-ref-complaint">
              <span className="material-symbols-outlined">emergency</span>
              <p>{r.complaint}</p>
            </div>

            <div className="fd-ref-vitals">
              {r.vitals.map(v => <span key={v} className="fd-vital-tag">{v}</span>)}
            </div>

            <div className="fd-ref-actions">
              <div className="fd-ref-stage-row">
                <span className="fd-ref-current-stage">{r.status}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
                <span className="fd-ref-next-stage">Next: {r.statusNext}</span>
              </div>
              <div className="fd-ref-btns">
                {r.status !== 'CLOSED' && (
                  <button className="fd-advance-btn" onClick={() => advanceStage(r.id)}>
                    <span className="material-symbols-outlined">bolt</span>
                    {r.status === 'REFERRED' ? 'Mark Received' :
                     r.status === 'RECEIVED' ? 'Complete Visit' :
                     r.status === 'COMPLETED' ? 'Archive & Close' : 'Advance'}
                  </button>
                )}
                {r.status === 'COMPLETED' && (
                  <button className="fd-print-btn">
                    <span className="material-symbols-outlined">print</span> Print Slip
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}

        {visible.length === 0 && <p className="fd-empty">No referrals in this category.</p>}
      </main>

      <Footer variant="dashboard" />
    </div>
  )
}

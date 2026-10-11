import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import PwaInstallBanner from '../components/PwaInstallBanner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { referralsAPI } from '../services/api.js'
import {
  getAllDrafts,
  saveDraft,
  updateDraft,
  deleteDraft,
  seedInitialDraftsIfEmpty,
  clearSyncedDrafts,
  generateOfflineId
} from '../services/draftStorage.js'
import { syncSingleDraft, syncAllDrafts } from '../services/syncService.js'
import { VERIFIED_FACILITIES } from '../services/facilitiesData.js'
import './WorkerDashboard.css'

const URGENCY = ['Routine', 'Priority', 'Emergency']
const GENDERS = ['Female', 'Male', 'Child']

export default function WorkerDashboard() {
  const { user } = useAuth()
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

  // Form state
  const [patientId, setPatientId] = useState('Meena Devi')
  const [age, setAge] = useState(26)
  const [gender, setGender] = useState('Female')
  const [facility, setFacility] = useState('phc-rampur')
  const [symptoms, setSymptoms] = useState(
    'High fever 3 days, pedal edema, ANC 3rd trimester specialized sonography consultation required.'
  )
  const [urgency, setUrgency] = useState('Priority')
  const [submitting, setSubmitting] = useState(false)

  // Generated token
  const [token, setToken] = useState({ id: 'REF-1092', visible: true, isOffline: false })

  // Drafts state (backed by IndexedDB)
  const [drafts, setDrafts] = useState([])
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState(null)

  // Edit / View modal state
  const [editingDraft, setEditingDraft] = useState(null)
  const [viewingDraft, setViewingDraft] = useState(null)

  // Load facility options (combine defaults + verified facilities)
  const facilityOptions = VERIFIED_FACILITIES.map(f => ({
    value: f.id,
    label: `${f.name} — ${f.district} (${f.type})`
  }))

  // Initial load from IndexedDB + preselect facility from session
  useEffect(() => {
    let isMounted = true
    async function initStorage() {
      try {
        await seedInitialDraftsIfEmpty()
        const records = await getAllDrafts()
        if (isMounted) setDrafts(records)
      } catch (err) {
        console.warn('Draft storage init warning:', err)
      }
    }
    initStorage()

    // Preselect facility if chosen from Facilities map
    const picked = sessionStorage.getItem('gh_selected_facility')
    if (picked) {
      try {
        const parsed = JSON.parse(picked)
        if (parsed.id) setFacility(parsed.id)
      } catch (e) {}
    }

    // Auto-sync listener when network returns
    const handleNetworkOnline = async () => {
      setSyncMessage({ type: 'info', text: 'Network reconnected! Initiating automatic draft sync...' })
      try {
        const res = await syncAllDrafts()
        const updated = await getAllDrafts()
        if (isMounted) {
          setDrafts(updated)
          setSyncMessage({
            type: 'success',
            text: `Auto-sync complete: ${res.synced} synced, ${res.failed} pending retry.`
          })
        }
      } catch (err) {
        if (isMounted) setSyncMessage({ type: 'error', text: err.message })
      }
    }

    window.addEventListener('online', handleNetworkOnline)
    return () => {
      isMounted = false
      window.removeEventListener('online', handleNetworkOnline)
    }
  }, [])

  // Refresh drafts list from IndexedDB
  async function reloadDrafts() {
    const list = await getAllDrafts()
    setDrafts(list)
  }

  // Generate instant token with online/offline fallback
  async function handleGenerateToken(e) {
    e.preventDefault()
    setSubmitting(true)
    setSyncMessage(null)

    const facilityLabel = facilityOptions.find(f => f.value === facility)?.label.split('—')[0].trim() || facility
    const offlineId = generateOfflineId()

    try {
      if (navigator.onLine) {
        // Attempt live API submission
        try {
          const res = await referralsAPI.create({
            patient_name: patientId,
            age,
            gender,
            facility_id: facility,
            facility_name: facilityLabel,
            symptoms,
            urgency,
            offline_id: offlineId
          })
          const liveToken = res?.data?.token || res?.data?.id || `REF-${Math.floor(1000 + Math.random() * 9000)}`
          setToken({
            id: liveToken,
            patientName: `${patientId} (${age}${gender[0]})`,
            facilityName: facilityLabel,
            visible: true,
            isOffline: false
          })
          setSyncMessage({ type: 'success', text: `Referral submitted to server successfully! Token: ${liveToken}` })
          return
        } catch (apiErr) {
          console.warn('Live API unavailable, storing in offline IndexedDB:', apiErr)
        }
      }

      // Offline or API unreachable: safely store in IndexedDB
      const localDraft = await saveDraft({
        offlineId,
        patientName: patientId,
        age,
        gender,
        facilityId: facility,
        facilityName: facilityLabel,
        symptoms,
        urgency,
        syncStatus: 'sync_pending'
      })

      const offlineToken = `OFF-${offlineId.slice(-6)}`
      setToken({
        id: offlineToken,
        patientName: `${patientId} (${age}${gender[0]})`,
        facilityName: facilityLabel,
        visible: true,
        isOffline: true
      })
      await reloadDrafts()
      setSyncMessage({
        type: 'warning',
        text: `Offline Mode Active: Referral saved to device IndexedDB. Token ${offlineToken} issued. Will sync automatically upon reconnection.`
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Save manual offline draft
  async function handleSaveDraft() {
    const facilityLabel = facilityOptions.find(f => f.value === facility)?.label.split('—')[0].trim() || facility
    try {
      await saveDraft({
        patientName: patientId,
        age,
        gender,
        facilityId: facility,
        facilityName: facilityLabel,
        symptoms,
        urgency,
        syncStatus: 'local_draft'
      })
      await reloadDrafts()
      setSyncMessage({
        type: 'success',
        text: 'Referral draft saved to phone storage (IndexedDB). Accessible anytime offline.'
      })
    } catch (err) {
      setSyncMessage({ type: 'error', text: `Failed to save draft: ${err.message}` })
    }
  }

  // Sync single draft
  async function handleSingleSync(draft) {
    setSyncing(true)
    setSyncMessage(null)
    try {
      const res = await syncSingleDraft(draft)
      await reloadDrafts()
      if (res.success) {
        setSyncMessage({ type: 'success', text: `Draft "${draft.patientName}" synced successfully with server!` })
      } else {
        setSyncMessage({ type: 'error', text: `Sync failed for "${draft.patientName}": ${res.error}` })
      }
    } finally {
      setSyncing(false)
    }
  }

  // Sync all pending drafts
  async function handleSyncAll() {
    if (!navigator.onLine) {
      setSyncMessage({
        type: 'error',
        text: 'Internet connection required to synchronize drafts with server. Please connect to 3G/4G or Wi-Fi.'
      })
      return
    }

    setSyncing(true)
    setSyncMessage(null)
    try {
      const res = await syncAllDrafts()
      await reloadDrafts()
      if (res.total === 0) {
        setSyncMessage({ type: 'info', text: 'No pending drafts require synchronization.' })
      } else {
        setSyncMessage({
          type: res.failed === 0 ? 'success' : 'warning',
          text: `Synchronization complete: ${res.synced} synced, ${res.failed} failed/retained in draft queue.`
        })
      }
    } catch (err) {
      setSyncMessage({ type: 'error', text: `Sync error: ${err.message}` })
    } finally {
      setSyncing(false)
    }
  }

  // Delete draft
  async function handleDeleteDraft(id, name) {
    if (window.confirm(`Are you sure you want to delete the draft for "${name}"?`)) {
      await deleteDraft(id)
      await reloadDrafts()
      setSyncMessage({ type: 'info', text: `Draft for "${name}" deleted.` })
    }
  }

  // Save edit changes to draft
  async function handleUpdateDraftSubmit(e) {
    e.preventDefault()
    if (!editingDraft) return
    try {
      await updateDraft(editingDraft.id, {
        patientName: editingDraft.patientName,
        age: editingDraft.age,
        gender: editingDraft.gender,
        facilityId: editingDraft.facilityId,
        facilityName: editingDraft.facilityName,
        symptoms: editingDraft.symptoms,
        urgency: editingDraft.urgency
      })
      setEditingDraft(null)
      await reloadDrafts()
      setSyncMessage({ type: 'success', text: 'Draft updated successfully.' })
    } catch (err) {
      setSyncMessage({ type: 'error', text: `Update error: ${err.message}` })
    }
  }

  // Clear synced drafts
  async function handleClearSynced() {
    const pruned = await clearSyncedDrafts()
    await reloadDrafts()
    setSyncMessage({ type: 'info', text: `Cleared ${pruned} synchronized records from local cache.` })
  }

  return (
    <div className="wd-page">
      <Navbar
        variant="dashboard"
        syncText={isOnline ? 'Online · Auto-Sync Active' : 'Offline · Local IndexedDB Storage'}
        facility={user?.facility ?? 'Sub-Centre Kalyanpur • Moradabad'}
      />

      <PwaInstallBanner />

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
          <button className="wd-sync-btn" type="button" onClick={handleSyncAll} disabled={syncing}>
            <span className={`material-symbols-outlined ${syncing ? 'wd-spin' : ''}`}>sync</span>
            <span>{syncing ? 'Syncing…' : 'Sync All'}</span>
          </button>
        </section>

        {/* Sync Feedback Message Banner */}
        {syncMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              background:
                syncMessage.type === 'success' ? '#ecfdf5' :
                syncMessage.type === 'error' ? '#fef2f2' :
                syncMessage.type === 'warning' ? '#fffbeb' : '#f0fdfa',
              color:
                syncMessage.type === 'success' ? '#065f46' :
                syncMessage.type === 'error' ? '#991b1b' :
                syncMessage.type === 'warning' ? '#92400e' : '#115e59',
              border: `1px solid ${
                syncMessage.type === 'success' ? '#a7f3d0' :
                syncMessage.type === 'error' ? '#fecaca' :
                syncMessage.type === 'warning' ? '#fde68a' : '#99f6e4'
              }`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {syncMessage.type === 'success' ? 'check_circle' : syncMessage.type === 'error' ? 'error' : 'info'}
              </span>
              <span>{syncMessage.text}</span>
            </div>
            <button
              onClick={() => setSyncMessage(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick stats */}
        <div className="wd-stats">
          <div className="wd-stat-card">
            <p className="wd-stat-value">05</p>
            <p className="wd-stat-label">Today's Ref.</p>
          </div>
          <div className="wd-stat-card wd-stat-card--orange">
            <p className="wd-stat-value">
              {drafts.filter(d => d.syncStatus === 'sync_pending' || d.syncStatus === 'sync_failed').length}
            </p>
            <p className="wd-stat-label">Pending Sync</p>
          </div>
          <div className="wd-stat-card wd-stat-card--green">
            <p className="wd-stat-value">{drafts.length}</p>
            <p className="wd-stat-label">IndexedDB Drafts</p>
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
          <p className="wd-section-desc">
            Generate instant referral tokens for rural patients. Works completely offline.
          </p>

          <form className="wd-form" onSubmit={handleGenerateToken}>
            {/* Patient ID */}
            <div className="wd-field">
              <label htmlFor="patientId">Patient Name or ABHA / Aadhaar ID</label>
              <div className="wd-input-wrap">
                <span className="material-symbols-outlined wd-input-icon">badge</span>
                <input
                  id="patientId"
                  type="text"
                  placeholder="e.g., Meena Devi or 9821-4321-0012"
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="wd-scan-btn"
                  onClick={() => alert('Camera scanner requires internet for online ABHA validation.')}
                >
                  <span className="material-symbols-outlined">qr_code_scanner</span> Scan
                </button>
              </div>
            </div>

            {/* Age + Gender row */}
            <div className="wd-row">
              <div className="wd-field">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  required
                />
              </div>
              <div className="wd-field">
                <label>Gender</label>
                <div className="wd-radio-group">
                  {GENDERS.map(g => (
                    <label key={g} className={`wd-radio-pill ${gender === g ? 'wd-radio-pill--active' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Target facility */}
            <div className="wd-field">
              <label htmlFor="facility">Target Healthcare Facility</label>
              <div className="wd-select-wrap">
                <span className="material-symbols-outlined wd-input-icon">local_hospital</span>
                <select id="facility" value={facility} onChange={e => setFacility(e.target.value)}>
                  {facilityOptions.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symptoms */}
            <div className="wd-field">
              <label htmlFor="symptoms">Symptoms &amp; Clinical Referral Notes</label>
              <textarea
                id="symptoms"
                rows="3"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Describe triage findings, duration of fever, vitals, etc."
                required
              />
            </div>

            {/* Urgency */}
            <div className="wd-field">
              <label>Triage Priority</label>
              <div className="wd-urgency-group">
                {URGENCY.map(u => (
                  <label
                    key={u}
                    className={`wd-urgency-pill wd-urgency-pill--${u.toLowerCase()} ${urgency === u ? 'wd-urgency-pill--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={u}
                      checked={urgency === u}
                      onChange={() => setUrgency(u)}
                    />
                    {u}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="gh-btn-primary wd-submit-btn" disabled={submitting}>
              <span className="material-symbols-outlined">confirmation_number</span>
              {submitting ? 'Generating…' : 'Generate Instant Referral Token'}
            </button>
            <button type="button" className="gh-btn-secondary wd-draft-btn" onClick={handleSaveDraft}>
              <span className="material-symbols-outlined">save</span>
              Save to Offline Drafts (IndexedDB)
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
              <span className={`wd-token-badge ${token.isOffline ? 'wd-token-badge--offline' : ''}`}>
                {token.isOffline ? 'Offline Token (Local)' : 'Live Validated'}
              </span>
            </div>

            <div className="wd-token-id-row">
              <div>
                <span className="wd-token-id-label">GramHealth Token ID</span>
                <span className="wd-token-id">{token.id}</span>
              </div>
              <button
                className="wd-copy-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(token.id)
                  alert(`Copied Token ID: ${token.id}`)
                }}
                title="Copy Token ID"
              >
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
                <strong>
                  {token.facilityName ??
                    facilityOptions.find(f => f.value === facility)?.label.split('—')[0].trim()}
                </strong>
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
              <button
                className="wd-token-sms-btn"
                onClick={() => {
                  if (!navigator.onLine) {
                    alert('Direct SMS dispatch gateway requires internet connection. Token is saved offline for patient verbal handoff.')
                  } else {
                    alert(`SMS sent to patient phone for token ${token.id}`)
                  }
                }}
              >
                <span className="material-symbols-outlined">sms</span> SMS to Patient
              </button>
              <button
                className="wd-token-wa-btn"
                onClick={() => alert(`WhatsApp slip generated for ${token.id}`)}
              >
                <span className="material-symbols-outlined">share</span> WhatsApp Slip
              </button>
            </div>
          </section>
        )}

        {/* ── Section 3: Offline Drafts Queue ── */}
        <section className="wd-card">
          <div className="wd-section-header">
            <div className="wd-section-title-row">
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>offline_pin</span>
              <h2>Offline Drafts Queue (IndexedDB)</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="wd-tag wd-tag--green">{drafts.length} Stored</span>
              {drafts.some(d => d.syncStatus === 'synced') && (
                <button
                  type="button"
                  onClick={handleClearSynced}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    cursor: 'pointer'
                  }}
                  title="Remove successfully synced drafts from phone storage"
                >
                  Clear Synced
                </button>
              )}
            </div>
          </div>

          <p className="wd-info-bar">
            <span className="material-symbols-outlined">info</span>
            Structured drafts persisted safely in IndexedDB. Automatically synchronizes when network reconnects.
          </p>

          <div className="wd-drafts-list">
            {drafts.map(d => {
              const isSynced = d.syncStatus === 'synced'
              const isPending = d.syncStatus === 'sync_pending'
              const isFailed = d.syncStatus === 'sync_failed'
              const isLocal = d.syncStatus === 'local_draft'

              return (
                <div
                  key={d.id}
                  className="wd-draft-item"
                  style={isSynced ? { opacity: 0.85, borderLeft: '4px solid #10b981' } : isFailed ? { borderLeft: '4px solid #ef4444' } : {}}
                >
                  <div className="wd-draft-top">
                    <div>
                      <div className="wd-draft-name">
                        <span
                          className={`wd-draft-dot ${
                            isSynced ? 'wd-draft-dot--green' :
                            isFailed ? 'wd-draft-dot--error' :
                            isPending ? 'wd-draft-dot--orange' : ''
                          }`}
                          style={isPending ? { background: '#f59e0b' } : {}}
                        />
                        {d.patientName} {d.age ? `(Age ${d.age}${d.gender ? ', ' + d.gender : ''})` : ''}
                      </div>
                      <p className="wd-draft-sub">
                        {d.symptoms?.slice(0, 45) || 'No symptoms specified'}… • <strong>{d.facilityName}</strong>
                      </p>
                      {d.offlineId && (
                        <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                          ID: <code>{d.offlineId}</code>
                          {d.serverTokenId && <span style={{ color: '#059669', marginLeft: '6px' }}>• Server Token: {d.serverTokenId}</span>}
                        </p>
                      )}
                      {d.syncError && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                          ⚠️ {d.syncError} (Attempt {d.retryCount || 1})
                        </p>
                      )}
                    </div>
                    <span className="wd-draft-time">
                      {new Date(d.updatedAt || d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="wd-draft-actions">
                    <span
                      className={`wd-draft-status ${isFailed || isPending ? 'wd-draft-status--error' : ''}`}
                      style={
                        isSynced ? { color: '#059669' } :
                        isPending ? { color: '#d97706' } : {}
                      }
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {isSynced ? 'cloud_done' : isFailed ? 'sync_problem' : isPending ? 'cloud_queue' : 'sd_card'}
                      </span>
                      {isSynced ? 'Synced to Server ✓' :
                       isFailed ? 'Sync Failed (Retry)' :
                       isPending ? 'Pending Network' : 'Cached in IndexedDB'}
                    </span>

                    <div className="wd-draft-btns">
                      <button
                        className="wd-draft-edit"
                        onClick={() => setViewingDraft(d)}
                        title="View Full Details"
                      >
                        View
                      </button>
                      <button
                        className="wd-draft-edit"
                        onClick={() => setEditingDraft(d)}
                        title="Edit Draft"
                      >
                        Edit
                      </button>
                      <button
                        className="wd-draft-edit"
                        style={{ color: '#ef4444' }}
                        onClick={() => handleDeleteDraft(d.id, d.patientName)}
                        title="Delete Draft"
                      >
                        Delete
                      </button>
                      {!isSynced && (
                        <button
                          className="wd-draft-sync"
                          onClick={() => handleSingleSync(d)}
                          disabled={syncing}
                        >
                          <span className="material-symbols-outlined">sync</span> Force Sync
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {drafts.length === 0 && <p className="wd-drafts-empty">All drafts synced ✓ (Queue empty)</p>}
          </div>
        </section>

        {/* ── Edit Draft Modal ── */}
        {editingDraft && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '480px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Edit Referral Draft</h3>
                <button
                  onClick={() => setEditingDraft(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateDraftSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Patient Name</label>
                  <input
                    type="text"
                    value={editingDraft.patientName || ''}
                    onChange={e => setEditingDraft({ ...editingDraft, patientName: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Age</label>
                    <input
                      type="number"
                      value={editingDraft.age || ''}
                      onChange={e => setEditingDraft({ ...editingDraft, age: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Gender</label>
                    <select
                      value={editingDraft.gender || 'Female'}
                      onChange={e => setEditingDraft({ ...editingDraft, gender: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Facility</label>
                  <select
                    value={editingDraft.facilityId || facility}
                    onChange={e => {
                      const sel = facilityOptions.find(f => f.value === e.target.value)
                      setEditingDraft({
                        ...editingDraft,
                        facilityId: e.target.value,
                        facilityName: sel ? sel.label.split('—')[0].trim() : e.target.value
                      })
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    {facilityOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Symptoms / Notes</label>
                  <textarea
                    rows="3"
                    value={editingDraft.symptoms || ''}
                    onChange={e => setEditingDraft({ ...editingDraft, symptoms: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Triage Urgency</label>
                  <select
                    value={editingDraft.urgency || 'Routine'}
                    onChange={e => setEditingDraft({ ...editingDraft, urgency: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    {URGENCY.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button type="submit" className="gh-btn-primary" style={{ flex: 1, padding: '8px' }}>
                    Save Draft Changes
                  </button>
                  <button
                    type="button"
                    className="gh-btn-secondary"
                    onClick={() => setEditingDraft(null)}
                    style={{ padding: '8px 16px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── View Draft Details Modal ── */}
        {viewingDraft && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '460px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>IndexedDB Draft Details</h3>
                <button
                  onClick={() => setViewingDraft(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                <div><strong>Patient:</strong> {viewingDraft.patientName} (Age: {viewingDraft.age}, {viewingDraft.gender})</div>
                <div><strong>Facility:</strong> {viewingDraft.facilityName}</div>
                <div><strong>Urgency:</strong> {viewingDraft.urgency}</div>
                <div><strong>Symptoms:</strong> {viewingDraft.symptoms}</div>
                <div><strong>Offline ID:</strong> <code>{viewingDraft.offlineId}</code></div>
                <div>
                  <strong>Sync Status:</strong>{' '}
                  <span style={{ fontWeight: 600, color: viewingDraft.syncStatus === 'synced' ? '#059669' : '#d97706' }}>
                    {viewingDraft.syncStatus}
                  </span>
                </div>
                {viewingDraft.serverTokenId && (
                  <div><strong>Server Token:</strong> <code>{viewingDraft.serverTokenId}</code></div>
                )}
                <div><strong>Created:</strong> {new Date(viewingDraft.createdAt).toLocaleString()}</div>
                <div><strong>Last Updated:</strong> {new Date(viewingDraft.updatedAt).toLocaleString()}</div>
              </div>

              <button
                className="gh-btn-secondary"
                onClick={() => setViewingDraft(null)}
                style={{ width: '100%', marginTop: '20px', padding: '8px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer variant="dashboard" />
    </div>
  )
}

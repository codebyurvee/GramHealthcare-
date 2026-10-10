import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import './Facilities.css'

const FACILITIES = [
  {
    id: 'phc-rampur',
    name: 'Primary Health Centre (PHC) Rampur',
    address: 'Rampur Block, Moradabad District',
    distance: '3.2 km',
    status: 'Open Now',
    statusType: 'open',
    phone: '9876543210',
    hours: '8:00 AM – 4:00 PM (Emergency 24x7)',
    beds: '6 / 10 Free',
    doctor: 'Dr. S. Sharma',
    services: ['Maternal Care (ANC/PNC)', 'General OPD', 'Immunization', '24/7 Delivery Room'],
    category: ['maternal', 'opd', 'immunization'],
  },
  {
    id: 'chc-shivnagar',
    name: 'Shivnagar Community Health Centre (CHC)',
    address: 'Shivnagar Main Road, Moradabad',
    distance: '8.5 km',
    status: '24x7 Emergency',
    statusType: 'emergency',
    phone: '0591244102',
    hours: '24x7 Open (Round-the-clock)',
    beds: '12 / 20 Free',
    doctor: '3 Surgeons Active',
    services: ['Specialist OB/GYN', 'Pediatric Care', 'X-Ray & Lab', 'Ambulance Station'],
    category: ['emergency', 'maternal'],
  },
  {
    id: 'hwc-kalyanpur',
    name: 'Kalyanpur Sub-Centre & Health Wellness Centre',
    address: 'Kalyanpur Gram Panchayat',
    distance: '1.8 km',
    status: 'ASHA Hub',
    statusType: 'sub',
    phone: '9412055112',
    hours: '9:00 AM – 3:00 PM',
    beds: '—',
    doctor: 'ANM Sunita Verma',
    services: ['NCD Screening', 'Immunization', 'ASHA Training'],
    category: ['immunization', 'opd'],
  },
  {
    id: 'district-moradabad',
    name: 'Moradabad District Hospital',
    address: 'Civil Lines, Moradabad',
    distance: '18.5 km',
    status: '24x7 Open',
    statusType: 'open',
    phone: '0591222100',
    hours: '24x7 All Departments',
    beds: '40 / 80 Free',
    doctor: 'Multiple Specialists',
    services: ['Surgery', 'ICU', 'Blood Bank', 'Radiology', 'Dialysis'],
    category: ['emergency', 'maternal', 'opd'],
  },
]

const FILTERS = [
  { id: 'all',          label: 'All Services' },
  { id: 'maternal',     label: 'Maternal & Child (ANC)' },
  { id: 'emergency',    label: '24x7 Emergency' },
  { id: 'immunization', label: 'Immunization' },
  { id: 'opd',          label: 'General OPD' },
]

export default function Facilities() {
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')
  const [view,      setView]      = useState('list') // 'list' | 'map'
  const [selected,  setSelected]  = useState(null)

  const visible = FACILITIES.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.address.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || f.category.includes(filter)
    return matchSearch && matchFilter
  })

  function handleSelect(facility) {
    setSelected(facility)
    alert(`Selected: ${facility.name}\nFor referral — integrate with WorkerDashboard.`)
  }

  return (
    <div className="facilities-page">
      <Navbar variant="public" subtitle="Find Facilities" />

      <main className="facilities-main">
        {/* Context bar */}
        <div className="facilities-context-bar">
          <div className="facilities-context-left">
            <span className="material-symbols-outlined">verified</span>
            <div>
              <p className="facilities-context-district">Moradabad District Grid</p>
              <p className="facilities-context-sync">
                <span className="facilities-sync-dot" />
                Sync Updated 4m ago
              </p>
            </div>
          </div>
          <button className="facilities-datasaver-btn" type="button">
            <span className="material-symbols-outlined">signal_cellular_alt</span>
            Data-Saver
          </button>
        </div>

        {/* Title + search */}
        <div className="facilities-header">
          <div>
            <span className="facilities-header-tag">Care Network Directory</span>
            <h1 className="facilities-title">Find Facilities</h1>
          </div>
          <span className="facilities-count-badge">{FACILITIES.length} Verified Hubs</span>
        </div>

        <div className="facilities-search-wrap">
          <span className="material-symbols-outlined facilities-search-icon">search</span>
          <input
            type="text"
            className="facilities-search-input"
            placeholder="Village, Block, or Facility (e.g. Rampur, CHC)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="facilities-voice-btn" type="button" title="Voice Search">
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>

        {/* Filter pills */}
        <div className="facilities-filters">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              className={`facilities-filter-pill ${filter === f.id ? 'facilities-filter-pill--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id && <span className="material-symbols-outlined">check</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* View switcher */}
        <div className="facilities-view-switcher">
          <button
            type="button"
            className={`facilities-view-btn ${view === 'map' ? 'facilities-view-btn--active' : ''}`}
            onClick={() => setView('map')}
          >
            <span className="material-symbols-outlined">map</span> Map View
          </button>
          <button
            type="button"
            className={`facilities-view-btn ${view === 'list' ? 'facilities-view-btn--active' : ''}`}
            onClick={() => setView('list')}
          >
            <span className="material-symbols-outlined">view_agenda</span> List View
          </button>
        </div>

        {/* Map placeholder */}
        {view === 'map' && (
          <div className="facilities-map-placeholder">
            <span className="material-symbols-outlined">map</span>
            <p>Interactive map coming soon.<br />Use List View for offline access.</p>
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="facilities-list">
            {visible.length === 0 && (
              <p className="facilities-empty">No facilities match your search.</p>
            )}
            {visible.map(f => (
              <article key={f.id} className="facility-card">
                <div className="facility-card-top">
                  <div>
                    <div className="facility-card-badges">
                      <span className={`facility-status facility-status--${f.statusType}`}>
                        <span className="facility-status-dot" />
                        {f.status}
                      </span>
                      <span className="facility-distance">{f.distance}</span>
                    </div>
                    <h3 className="facility-name">{f.name}</h3>
                    <p className="facility-address">{f.address}</p>
                  </div>
                  <a href={`tel:${f.phone}`} className="facility-call-btn" title="Call">
                    <span className="material-symbols-outlined">
                      {f.statusType === 'emergency' ? 'sos' : 'call'}
                    </span>
                  </a>
                </div>

                <div className="facility-services">
                  {f.services.map(s => (
                    <span key={s} className="facility-service-tag">{s}</span>
                  ))}
                </div>

                <div className="facility-meta">
                  <span><span className="material-symbols-outlined">schedule</span>{f.hours}</span>
                  <span><span className="material-symbols-outlined">bed</span>{f.beds} beds</span>
                  <span><span className="material-symbols-outlined">stethoscope</span>{f.doctor}</span>
                </div>

                <div className="facility-actions">
                  <button className="gh-btn-primary facility-select-btn" onClick={() => handleSelect(f)}>
                    <span className="material-symbols-outlined">task_alt</span>
                    Select Facility
                  </button>
                  <button className="gh-btn-secondary facility-details-btn">
                    <span className="material-symbols-outlined">directions</span>
                    Directions
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer variant="public" />
    </div>
  )
}

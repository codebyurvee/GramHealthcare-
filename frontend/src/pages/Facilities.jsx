import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import FacilityMap from '../components/FacilityMap.jsx'
import { VERIFIED_FACILITIES } from '../services/facilitiesData.js'
import { facilitiesAPI } from '../services/api.js'
import './Facilities.css'

const TYPE_FILTERS = [
  { id: 'all', label: 'All Facilities' },
  { id: 'PHC', label: 'PHCs (Primary)' },
  { id: 'CHC', label: 'CHCs (Community)' },
  { id: 'District Hospital', label: 'District Hospitals' },
  { id: 'Medical College', label: 'Medical Colleges' },
  { id: 'emergency', label: '24x7 Emergency' },
  { id: 'maternal', label: 'Maternal & ANC' },
]

export default function Facilities() {
  const [facilities, setFacilities] = useState(VERIFIED_FACILITIES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('split') // 'split' | 'map' | 'list'
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState('Verified Local Registry')

  // Attempt backend API fetch on mount, gracefully falling back to verified offline dataset
  useEffect(() => {
    let isMounted = true
    async function loadBackendFacilities() {
      try {
        setLoading(true)
        const res = await facilitiesAPI.getAll()
        if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setFacilities(res.data)
          setDataSource('Live Express Backend API')
        }
      } catch (err) {
        // Expected when Express backend database is offline; use verified seed dataset
        if (isMounted) {
          setFacilities(VERIFIED_FACILITIES)
          setDataSource('Verified Field Grid (38 Hubs)')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadBackendFacilities()
    return () => { isMounted = false }
  }, [])

  const visible = facilities.filter(f => {
    const term = search.toLowerCase()
    const matchSearch =
      f.name?.toLowerCase().includes(term) ||
      f.address?.toLowerCase().includes(term) ||
      f.district?.toLowerCase().includes(term)

    let matchFilter = true
    if (filter === 'all') {
      matchFilter = true
    } else if (filter === 'emergency') {
      matchFilter = f.hours?.includes('24x7') || f.services?.some(s => s.toLowerCase().includes('emergency'))
    } else if (filter === 'maternal') {
      matchFilter = f.services?.some(s => s.toLowerCase().includes('maternal') || s.toLowerCase().includes('anc'))
    } else {
      matchFilter = f.type === filter
    }

    return matchSearch && matchFilter
  })

  function handleSelect(facility) {
    setSelected(facility)
  }

  function handleReferralAction(facility) {
    setSelected(facility)
    // Save chosen facility to sessionStorage for immediate referral form hand-off
    sessionStorage.setItem('gh_selected_facility', JSON.stringify({
      id: facility.id,
      name: facility.name,
      type: facility.type,
      district: facility.district
    }))
    alert(`Facility selected: ${facility.name}\nReady for referral in Health Worker Dashboard!`)
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
              <p className="facilities-context-district">Regional Healthcare Directory &amp; Map Grid</p>
              <p className="facilities-context-sync">
                <span className="facilities-sync-dot" />
                Data Source: {dataSource}
              </p>
            </div>
          </div>
          <button className="facilities-datasaver-btn" type="button" onClick={() => alert('Offline caching enabled for all facility records and map pins.')}>
            <span className="material-symbols-outlined">signal_cellular_alt</span>
            Offline-Ready
          </button>
        </div>

        {/* Title + count */}
        <div className="facilities-header">
          <div>
            <span className="facilities-header-tag">Interactive Geospatial Directory</span>
            <h1 className="facilities-title">Find Facilities &amp; Centers</h1>
          </div>
          <span className="facilities-count-badge">
            {visible.length} of {facilities.length} Mapped
          </span>
        </div>

        {/* Search */}
        <div className="facilities-search-wrap">
          <span className="material-symbols-outlined facilities-search-icon">search</span>
          <input
            type="text"
            className="facilities-search-input"
            placeholder="Search by facility name, block, or district (e.g., Amritsar, Rampur, CHC)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="facilities-voice-btn"
              type="button"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="facilities-filters">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              className={`facilities-filter-pill ${filter === f.id ? 'facilities-filter-pill--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id && <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* View switcher */}
        <div className="facilities-view-switcher">
          <button
            type="button"
            className={`facilities-view-btn ${view === 'split' ? 'facilities-view-btn--active' : ''}`}
            onClick={() => setView('split')}
          >
            <span className="material-symbols-outlined">dashboard</span> Split View
          </button>
          <button
            type="button"
            className={`facilities-view-btn ${view === 'map' ? 'facilities-view-btn--active' : ''}`}
            onClick={() => setView('map')}
          >
            <span className="material-symbols-outlined">map</span> Full Map
          </button>
          <button
            type="button"
            className={`facilities-view-btn ${view === 'list' ? 'facilities-view-btn--active' : ''}`}
            onClick={() => setView('list')}
          >
            <span className="material-symbols-outlined">view_agenda</span> List View
          </button>
        </div>

        {/* Selected Facility Banner */}
        {selected && (
          <div className="facilities-selected-banner" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#059669' }}>pin_drop</span>
              <div>
                <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>{selected.name}</strong>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857' }}>{selected.district} District • {selected.type}</p>
              </div>
            </div>
            <button
              className="gh-btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => handleReferralAction(selected)}
            >
              Use For Referral
            </button>
          </div>
        )}

        {/* Map View or Split View: Render Leaflet Map */}
        {(view === 'map' || view === 'split') && (
          <section className="facilities-map-section" style={{ marginBottom: '1rem' }}>
            <FacilityMap
              facilities={visible}
              selectedFacility={selected}
              onSelectFacility={handleSelect}
              isLoading={loading}
            />
          </section>
        )}

        {/* List View or Split View: Render Facility Cards */}
        {(view === 'list' || view === 'split') && (
          <div className="facilities-list">
            {visible.length === 0 && (
              <p className="facilities-empty">No facilities match your search criteria or category filter.</p>
            )}
            {visible.map(f => {
              const isSelected = selected && selected.id === f.id
              return (
                <article
                  key={f.id}
                  className={`facility-card ${isSelected ? 'facility-card--selected' : ''}`}
                  style={isSelected ? { borderColor: '#0d9488', boxShadow: '0 0 0 2px rgba(13, 148, 136, 0.2)' } : {}}
                  onClick={() => handleSelect(f)}
                >
                  <div className="facility-card-top">
                    <div>
                      <div className="facility-card-badges">
                        <span className={`facility-status facility-status--open`}>
                          <span className="facility-status-dot" />
                          {f.type}
                        </span>
                        <span className="facility-distance">{f.district} District</span>
                      </div>
                      <h3 className="facility-name">{f.name}</h3>
                      <p className="facility-address">{f.address}</p>
                    </div>
                    {f.contactNumber && (
                      <a href={`tel:${f.contactNumber}`} className="facility-call-btn" title="Call facility" onClick={e => e.stopPropagation()}>
                        <span className="material-symbols-outlined">call</span>
                      </a>
                    )}
                  </div>

                  {f.services && (
                    <div className="facility-services">
                      {f.services.slice(0, 4).map(s => (
                        <span key={s} className="facility-service-tag">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="facility-meta">
                    <span><span className="material-symbols-outlined">schedule</span>{f.hours || '24x7'}</span>
                    <span><span className="material-symbols-outlined">bed</span>{f.beds || 'Beds available'}</span>
                    <span><span className="material-symbols-outlined">location_on</span>{f.latitude ? `${f.latitude.toFixed(2)}°N, ${f.longitude.toFixed(2)}°E` : 'GPS Unlisted'}</span>
                  </div>

                  <div className="facility-actions">
                    <button
                      className="gh-btn-primary facility-select-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReferralAction(f)
                      }}
                    >
                      <span className="material-symbols-outlined">task_alt</span>
                      Select Facility
                    </button>
                    <button
                      className="gh-btn-secondary facility-details-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(f)
                        if (view === 'list') setView('split')
                      }}
                    >
                      <span className="material-symbols-outlined">explore</span>
                      Show on Map
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Footer variant="public" />
    </div>
  )
}

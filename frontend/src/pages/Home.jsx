import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      <Navbar variant="public" subtitle="Rural Healthcare" />

      <main className="home-main">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-hero-tag">🌿 Powered for Rural India</span>
            <h1 className="home-hero-title">
              Healthcare that reaches<br />every village
            </h1>
            <p className="home-hero-desc">
              Connecting rural patients, community health workers, and
              facilities through coordinated referrals and verified
              facility information — even offline.
            </p>
            <div className="home-hero-actions">
              <Link to="/login" className="gh-btn-primary">Get Started</Link>
              <Link to="/facilities" className="gh-btn-secondary">Find Facilities</Link>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="home-stats">
          <div className="home-stat">
            <span className="home-stat-value">14+</span>
            <span className="home-stat-label">Verified Facilities</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">1200+</span>
            <span className="home-stat-label">Referrals Processed</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">98%</span>
            <span className="home-stat-label">Offline Reliability</span>
          </div>
        </section>

        {/* Features */}
        <section className="home-features">
          <h2 className="home-features-title">Why GramHealthcare?</h2>
          <div className="home-features-grid">
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">confirmation_number</span>
              <h3>Instant Referral Tokens</h3>
              <p>Generate digital referral tokens for patients directly from the field, shared via SMS or WhatsApp.</p>
            </div>
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">offline_pin</span>
              <h3>Offline-First</h3>
              <p>Works reliably in low-connectivity villages. Drafts saved to IndexedDB sync automatically when online.</p>
            </div>
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">local_hospital</span>
              <h3>Verified Facilities</h3>
              <p>Access live bed availability, duty doctors, and services at PHCs, CHCs, and district hospitals nearby.</p>
            </div>
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">track_changes</span>
              <h3>Live Care Journey</h3>
              <p>Patients track their referral status through 5 stages in real time — from request to ASHA follow-up.</p>
            </div>
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">translate</span>
              <h3>Multilingual</h3>
              <p>Available in Hindi, English, and regional languages so every ASHA worker can use it comfortably.</p>
            </div>
            <div className="home-feature-card">
              <span className="material-symbols-outlined home-feature-icon">verified_user</span>
              <h3>ABDM Compliant</h3>
              <p>Integrated with ABHA IDs and Ayushman Bharat Digital Mission standards for secure health records.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta">
          <h2>Ready to connect your village?</h2>
          <p>Join thousands of ASHA workers and health facilities already using GramHealthcare.</p>
          <Link to="/login" className="gh-btn-primary">Sign In Now</Link>
        </section>
      </main>

      <Footer variant="public" />
    </div>
  )
}

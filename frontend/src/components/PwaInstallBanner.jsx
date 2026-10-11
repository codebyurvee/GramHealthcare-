import { useState, useEffect } from 'react'

/**
 * PwaInstallBanner — Provides native PWA installation prompt support
 * Catches the browser's `beforeinstallprompt` event and presents
 * a non-intrusive install banner/button.
 */
export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      // Prevent automatic browser mini-infobar
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    const appInstalledHandler = () => {
      setInstalled(true)
      setShowBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', appInstalledHandler)

    // Check if already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', appInstalledHandler)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  if (!showBanner || installed) return null

  return (
    <div
      className="pwa-install-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: '#ffffff',
        borderRadius: '0.75rem',
        margin: '0.5rem 1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '0.875rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#a7f3d0' }}>
          install_mobile
        </span>
        <div>
          <strong style={{ display: 'block', fontWeight: 700 }}>Install GramHealth Connect</strong>
          <span style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
            Work seamlessly offline without an active mobile connection.
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleInstallClick}
          style={{
            background: '#ffffff',
            color: '#065f46',
            fontWeight: 700,
            padding: '0.4rem 0.85rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          Install
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          style={{
            background: 'transparent',
            color: '#a7f3d0',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0.25rem'
          }}
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import './NetworkBadge.css'

/**
 * NetworkBadge — shows live online/offline status
 *
 * Online  → green pulse dot + "Online / Rural Sync Ready"
 * Offline → red static dot + "Offline — Data saved locally"
 */
export default function NetworkBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline  = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return (
    <div className={`network-badge ${isOnline ? 'network-badge--online' : 'network-badge--offline'}`}>
      <span className="network-dot">
        {isOnline && <span className="network-dot-ping" />}
        <span className="network-dot-core" />
      </span>
      <span className="network-label">
        {isOnline ? 'Online / Rural Sync Ready' : 'Offline — Data saved locally'}
      </span>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

import Home               from './pages/Home.jsx'
import Login              from './pages/Login.jsx'
import Facilities         from './pages/Facilities.jsx'
import WorkerDashboard    from './pages/WorkerDashboard.jsx'
import FacilityDashboard  from './pages/FacilityDashboard.jsx'
import PatientDashboard   from './pages/PatientDashboard.jsx'
import AdminDashboard     from './pages/AdminDashboard.jsx'

/**
 * ProtectedRoute — redirects to /login if user is not authenticated
 * or does not have the required role.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/facilities" element={<Facilities />} />

        {/* Role-protected routes */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={['worker', 'admin']}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facility"
          element={
            <ProtectedRoute allowedRoles={['facility', 'admin']}>
              <FacilityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

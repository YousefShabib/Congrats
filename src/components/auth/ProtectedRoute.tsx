import { Navigate, useLocation } from 'react-router-dom'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { useAuth } from '@/providers/AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireGraduate?: boolean
}

export function ProtectedRoute({ children, requireGraduate = true }: ProtectedRouteProps) {
  const { session, graduateId, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LuxuryLoader />

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireGraduate && !graduateId) {
    return <Navigate to="/register/profile" replace />
  }

  return children
}

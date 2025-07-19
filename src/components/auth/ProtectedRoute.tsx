

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingState } from '@/components/ui/loading-state'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute: user:', !!user, 'loading:', loading, 'path:', location.pathname)

  if (loading) {
    console.log('ProtectedRoute: Showing loading state')
    return <LoadingState isLoading={true}>Loading...</LoadingState>
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('ProtectedRoute: User authenticated, showing protected content')

  // Role-based access control would be implemented here
  // if (requiredRole && !requiredRole.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return <>{children}</>
}

// Add default export
export default ProtectedRoute

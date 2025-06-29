import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingState } from '@/components/ui/loading-state'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingState />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role-based access control would be implemented here
  // if (requiredRole && !requiredRole.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return <>{children}</>
}
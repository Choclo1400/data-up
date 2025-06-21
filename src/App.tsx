
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { UserRole } from './types';

// Pages
import LoginPage from './pages/LoginPage';
import Index from './pages/Index';
import Requests from './pages/Requests';
import NewRequestPage from './pages/NewRequestPage';
import Users from './pages/Users';
import Clients from './pages/Clients';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

// Components
import { LoadingState } from './components/ui/loading-state';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/requests/new"
          element={
            <ProtectedRoute>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
              <Users />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta específica para 404 - debe aparecer antes del wildcard */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Wildcard para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      
      <Toaster />
    </>
  );
}

export default App;

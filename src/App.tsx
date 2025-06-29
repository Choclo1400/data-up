import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import NotificationCenter from '@/components/notifications/NotificationCenter'

// Pages
import LoginPage from '@/pages/LoginPage'
import Index from '@/pages/Index'
import Requests from '@/pages/Requests'
import NewRequestPage from '@/pages/NewRequestPage'
import ServicesPage from '@/pages/ServicesPage'
import Clients from '@/pages/Clients'
import Technicians from '@/pages/Technicians'
import EmployeesPage from '@/pages/EmployeesPage'
import Users from '@/pages/Users'
import Analytics from '@/pages/Analytics'
import ReportsPage from '@/pages/ReportsPage'
import AuditPage from '@/pages/AuditPage'
import Settings from '@/pages/Settings'
import ProfilePage from '@/pages/ProfilePage'
import HelpPage from '@/pages/HelpPage'
import NotFound from '@/pages/NotFound'
import PendingManagerPage from '@/pages/PendingManagerPage'
import PendingSupervisorPage from '@/pages/PendingSupervisorPage'
import Operations from '@/pages/Operations'
import Operators from '@/pages/Operators'
import Forklifts from '@/pages/Forklifts'
import GasSupply from '@/pages/GasSupply'
import Maintenance from '@/pages/Maintenance'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/new" element={<NewRequestPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/operators" element={<Operators />} />
            <Route path="/forklifts" element={<Forklifts />} />
            <Route path="/gas-supply" element={<GasSupply />} />
            <Route path="/maintenance" element={<Maintenance />} />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requiredRole={["admin", "manager"]}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requiredRole={["admin", "manager", "supervisor"]}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pending-manager" 
              element={
                <ProtectedRoute requiredRole="manager">
                  <PendingManagerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pending-supervisor" 
              element={
                <ProtectedRoute requiredRole="supervisor">
                  <PendingSupervisorPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <NotificationCenter />
    </div>
  )
}

export default App
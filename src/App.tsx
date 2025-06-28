import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

// Pages
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';
import Requests from '@/pages/Requests';
import NewRequestPage from '@/pages/NewRequestPage';
import Clients from '@/pages/Clients';
import Users from '@/pages/Users';
import Technicians from '@/pages/Technicians';
import ServicesPage from '@/pages/ServicesPage';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import ProfilePage from '@/pages/ProfilePage';
import HelpPage from '@/pages/HelpPage';
import AuditPage from '@/pages/AuditPage';
import NotFound from '@/pages/NotFound';
import EmployeesPage from '@/pages/EmployeesPage';
import PendingManagerPage from '@/pages/PendingManagerPage';
import PendingSupervisorPage from '@/pages/PendingSupervisorPage';
import Forklifts from '@/pages/Forklifts';
import GasSupply from '@/pages/GasSupply';
import Operators from '@/pages/Operators';
import Operations from '@/pages/Operations';
import Maintenance from '@/pages/Maintenance';
import ReportsPage from '@/pages/ReportsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <Navbar />
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/requests" element={<Requests />} />
                              <Route path="/requests/new" element={<NewRequestPage />} />
                              <Route path="/clients" element={<Clients />} />
                              <Route path="/users" element={<Users />} />
                              <Route path="/technicians" element={<Technicians />} />
                              <Route path="/services" element={<ServicesPage />} />
                              <Route path="/analytics" element={<Analytics />} />
                              <Route path="/reports" element={<ReportsPage />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/profile" element={<ProfilePage />} />
                              <Route path="/help" element={<HelpPage />} />
                              <Route path="/audit" element={<AuditPage />} />
                              <Route path="/employees" element={<EmployeesPage />} />
                              <Route path="/pending-manager" element={<PendingManagerPage />} />
                              <Route path="/pending-supervisor" element={<PendingSupervisorPage />} />
                              <Route path="/forklifts" element={<Forklifts />} />
                              <Route path="/gas-supply" element={<GasSupply />} />
                              <Route path="/operators" element={<Operators />} />
                              <Route path="/operations" element={<Operations />} />
                              <Route path="/maintenance" element={<Maintenance />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
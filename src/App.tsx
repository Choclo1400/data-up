
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/shared/theme';
import { KeyboardNavigationProvider, SkipLink } from '@/components/shared/accessibility';
import { ProtectedRoute } from '@/components/features/auth';
import { Navbar, Sidebar } from '@/components/layout';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import ServiceRequests from '@/pages/ServiceRequests';
import Clients from '@/pages/Clients';
import UsersManagement from '@/pages/UsersManagement';
import TechniciansPage from '@/pages/TechniciansPage';
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <KeyboardNavigationProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <SkipLink href="#main-content">Skip to main content</SkipLink>
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
                            <main id="main-content" className="flex-1 overflow-auto p-6">
                              <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/requests" element={<ServiceRequests />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/users" element={<UsersManagement />} />
                                <Route path="/technicians" element={<TechniciansPage />} />
                                <Route path="/reports" element={<ReportsPage />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </main>
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

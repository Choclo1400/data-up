import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-state';

// Lazy load components for better performance with proper error handling
const ProtectedRoute = React.lazy(() => 
  import('@/components/auth/ProtectedRoute').catch(() => ({
    default: () => <div>Error loading Protected Route</div>
  }))
);

const Navbar = React.lazy(() => 
  import('@/components/layout/Navbar').catch(() => ({
    default: () => <div>Error loading Navbar</div>
  }))
);

const Sidebar = React.lazy(() => 
  import('@/components/layout/Sidebar').catch(() => ({
    default: () => <div>Error loading Sidebar</div>
  }))
);

const NotificationCenter = React.lazy(() => 
  import('@/components/notifications/NotificationCenter').catch(() => ({
    default: () => null
  }))
);

const Index = React.lazy(() => 
  import('@/pages/Index').catch(() => ({
    default: () => <div>Error loading Dashboard</div>
  }))
);

const LoginPage = React.lazy(() => 
  import('@/pages/LoginPage').catch(() => ({
    default: () => <div>Error loading Login Page</div>
  }))
);

const Users = React.lazy(() => 
  import('@/pages/Users').catch(() => ({
    default: () => <div>Error loading Users</div>
  }))
);

const Clients = React.lazy(() => 
  import('@/pages/Clients').catch(() => ({
    default: () => <div>Error loading Clients</div>
  }))
);

const Requests = React.lazy(() => 
  import('@/pages/Requests').catch(() => ({
    default: () => <div>Error loading Requests</div>
  }))
);

const Technicians = React.lazy(() => 
  import('@/pages/Technicians').catch(() => ({
    default: () => <div>Error loading Technicians</div>
  }))
);

const ReportsPage = React.lazy(() => 
  import('@/pages/ReportsPage').catch(() => ({
    default: () => <div>Error loading Reports</div>
  }))
);

const Settings = React.lazy(() => 
  import('@/pages/Settings').catch(() => ({
    default: () => <div>Error loading Settings</div>
  }))
);

const NotFound = React.lazy(() => 
  import('@/pages/NotFound').catch(() => ({
    default: () => <div>Page Not Found</div>
  }))
);

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppLayout: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => (
  <div className="min-h-screen bg-background">
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />
    </Suspense>
    <div className="flex">
      <Suspense fallback={<div className="w-64 bg-card border-r" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 p-6">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
    <Suspense fallback={null}>
      <NotificationCenter />
    </Suspense>
  </div>
));

AppLayout.displayName = 'AppLayout';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                              <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/requests" element={<Requests />} />
                                <Route path="/technicians" element={<Technicians />} />
                                <Route path="/reports" element={<ReportsPage />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </Suspense>
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </Router>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
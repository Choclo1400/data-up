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
    default: () => React.createElement('div', null, 'Error loading Protected Route')
  }))
);

const Navbar = React.lazy(() => 
  import('@/components/layout/Navbar').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Navbar')
  }))
);

const Sidebar = React.lazy(() => 
  import('@/components/layout/Sidebar').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Sidebar')
  }))
);

const NotificationCenter = React.lazy(() => 
  import('@/components/notifications/NotificationCenter').catch(() => ({
    default: () => null
  }))
);

const Index = React.lazy(() => 
  import('@/pages/Index').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Dashboard')
  }))
);

const LoginPage = React.lazy(() => 
  import('@/pages/LoginPage').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Login Page')
  }))
);

const Users = React.lazy(() => 
  import('@/pages/Users').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Users')
  }))
);

const Clients = React.lazy(() => 
  import('@/pages/Clients').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Clients')
  }))
);

const Requests = React.lazy(() => 
  import('@/pages/Requests').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Requests')
  }))
);

const Technicians = React.lazy(() => 
  import('@/pages/Technicians').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Technicians')
  }))
);

const ReportsPage = React.lazy(() => 
  import('@/pages/ReportsPage').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Reports')
  }))
);

const Settings = React.lazy(() => 
  import('@/pages/Settings').catch(() => ({
    default: () => React.createElement('div', null, 'Error loading Settings')
  }))
);

const NotFound = React.lazy(() => 
  import('@/pages/NotFound').catch(() => ({
    default: () => React.createElement('div', null, 'Page Not Found')
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
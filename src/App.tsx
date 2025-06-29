import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-state';

// Error fallback component
const ErrorFallback: React.FC<{ error?: string }> = ({ error = "Component failed to load" }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <p className="text-destructive">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Lazy load components with proper error handling
const ProtectedRoute = React.lazy(() => 
  import('@/components/auth/ProtectedRoute')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Protected Route failed to load" /> }))
);

const Navbar = React.lazy(() => 
  import('@/components/layout/Navbar')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Navbar failed to load" /> }))
);

const Sidebar = React.lazy(() => 
  import('@/components/layout/Sidebar')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Sidebar failed to load" /> }))
);

const NotificationCenter = React.lazy(() => 
  import('@/components/notifications/NotificationCenter')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => null }))
);

const Index = React.lazy(() => 
  import('@/pages/Index')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Dashboard failed to load" /> }))
);

const LoginPage = React.lazy(() => 
  import('@/pages/LoginPage')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Login Page failed to load" /> }))
);

const Users = React.lazy(() => 
  import('@/pages/Users')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Users page failed to load" /> }))
);

const Clients = React.lazy(() => 
  import('@/pages/Clients')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Clients page failed to load" /> }))
);

const Requests = React.lazy(() => 
  import('@/pages/Requests')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Requests page failed to load" /> }))
);

const Technicians = React.lazy(() => 
  import('@/pages/Technicians')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Technicians page failed to load" /> }))
);

const ReportsPage = React.lazy(() => 
  import('@/pages/ReportsPage')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Reports page failed to load" /> }))
);

const Settings = React.lazy(() => 
  import('@/pages/Settings')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Settings page failed to load" /> }))
);

const NotFound = React.lazy(() => 
  import('@/pages/NotFound')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ErrorFallback error="Page Not Found" /> }))
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
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Navbar />
      </Suspense>
    </ErrorBoundary>
    <div className="flex">
      <ErrorBoundary>
        <Suspense fallback={<div className="w-64 bg-card border-r" />}>
          <Sidebar />
        </Suspense>
      </ErrorBoundary>
      <main className="flex-1 p-6">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
    <ErrorBoundary>
      <Suspense fallback={null}>
        <NotificationCenter />
      </Suspense>
    </ErrorBoundary>
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
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <AppLayout>
                              <ErrorBoundary>
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
                              </ErrorBoundary>
                            </AppLayout>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
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
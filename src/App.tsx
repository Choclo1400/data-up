import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingState } from '@/components/ui/loading-state';

// Import components directly instead of lazy loading to avoid undefined errors
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import Users from '@/pages/Users';
import Clients from '@/pages/Clients';
import Requests from '@/pages/Requests';
import Technicians from '@/pages/Technicians';
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
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
                          <main className="flex-1 overflow-auto p-6">
                            <Suspense fallback={<LoadingState />}>
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
                          </main>
                        </div>
                        <NotificationCenter />
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
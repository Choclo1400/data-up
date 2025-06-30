import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'

// Lazy loading para reducir bundle inicial
const Index = lazy(() => import('@/pages/Index'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const UsersManagement = lazy(() => import('@/pages/UsersManagement'))
const Clients = lazy(() => import('@/pages/Clients'))
const OptimizedServiceRequests = lazy(() => import('@/pages/OptimizedServiceRequests'))
const TechniciansPage = lazy(() => import('@/pages/TechniciansPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Cliente de React Query optimizado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Componente de loading optimizado
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Suspense fallback={<LoadingFallback />}>
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
                              <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/users" element={<UsersManagement />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/requests" element={<OptimizedServiceRequests />} />
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
              </Suspense>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
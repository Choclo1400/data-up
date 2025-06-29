import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/sonner'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { Index } from '@/pages/Index'
import { Users } from '@/pages/Users'
import { Clients } from '@/pages/Clients'
import { Requests } from '@/pages/Requests'
import { Settings } from '@/pages/Settings'
import { ReportsPage } from '@/pages/ReportsPage'
import { Technicians } from '@/pages/Technicians'
import { NotFound } from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen bg-background">
                    <Sidebar />
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-auto p-6">
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
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
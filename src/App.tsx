
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TourOverlay from "@/components/help/TourOverlay";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Requests from "./pages/Requests";
import NewRequestPage from "./pages/NewRequestPage";
import PendingSupervisorPage from "./pages/PendingSupervisorPage";
import PendingManagerPage from "./pages/PendingManagerPage";
import Technicians from "./pages/Technicians";
import ServicesPage from "./pages/ServicesPage";
import EmployeesPage from "./pages/EmployeesPage";
import Settings from "./pages/Settings";
import AuditPage from "./pages/AuditPage";
import ProfilePage from "./pages/ProfilePage";
import Analytics from "./pages/Analytics";
import Forklifts from "./pages/Forklifts";
import Operators from "./pages/Operators";
import Operations from "./pages/Operations";
import Maintenance from "./pages/Maintenance";
import GasSupply from "./pages/GasSupply";
import HelpPage from "./pages/HelpPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <HelpPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Rutas con permisos específicos */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute requiredPermission="manage_users">
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <ProtectedRoute requiredPermission="manage_clients">
                      <Clients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests"
                  element={
                    <ProtectedRoute requiredPermission="view_requests">
                      <Requests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/new"
                  element={
                    <ProtectedRoute requiredPermission="create_requests">
                      <NewRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/pending-supervisor"
                  element={
                    <ProtectedRoute requiredPermission="approve_requests">
                      <PendingSupervisorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/pending-manager"
                  element={
                    <ProtectedRoute requiredPermission="approve_manager">
                      <PendingManagerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technicians"
                  element={
                    <ProtectedRoute requiredPermission="manage_technicians">
                      <Technicians />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute requiredPermission="manage_services">
                      <ServicesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute requiredPermission="manage_employees">
                      <EmployeesPage />
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
                  path="/audit"
                  element={
                    <ProtectedRoute requiredPermission="view_audit">
                      <AuditPage />
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
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requiredPermission="view_reports">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forklifts"
                  element={
                    <ProtectedRoute requiredPermission="manage_equipment">
                      <Forklifts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operators"
                  element={
                    <ProtectedRoute requiredPermission="manage_operators">
                      <Operators />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations"
                  element={
                    <ProtectedRoute requiredPermission="manage_operations">
                      <Operations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute requiredPermission="manage_maintenance">
                      <Maintenance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gas-supply"
                  element={
                    <ProtectedRoute requiredPermission="manage_gas">
                      <GasSupply />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute requiredPermission="view_calendar">
                      <div className="p-8 text-center text-muted-foreground">
                        Página de Calendario (En desarrollo)
                      </div>
                    </ProtectedRoute>
                  }
                />
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Tour overlay global */}
              <TourOverlay />
            </div>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

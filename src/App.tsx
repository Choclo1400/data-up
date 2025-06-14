import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForkliftsPage from "./pages/Forklifts";
import ReportsPage from "./pages/Reports";
import OperatorsPage from "./pages/Operators";
import OperationsPage from "./pages/Operations";
import MaintenancePage from "./pages/Maintenance";
import GasSupplyPage from "./pages/GasSupply";
import RequestsPage from "./pages/Requests";
import ClientsPage from "./pages/Clients";
import TechniciansPage from "./pages/Technicians";
import AnalyticsPage from "./pages/Analytics";
import UsersPage from "./pages/Users";
import SettingsPage from "./pages/Settings";
import NewRequestPage from "./pages/NewRequestPage";
import PendingManagerPage from "./pages/PendingManagerPage";
import PendingSupervisorPage from "./pages/PendingSupervisorPage";
import ServicesPage from "./pages/ServicesPage";
import EmployeesPage from "./pages/EmployeesPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Rutas principales del sistema de solicitudes técnicas */}
            <Route path="/requests" element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/new" element={
              <ProtectedRoute>
                <NewRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/pending-manager" element={
              <ProtectedRoute requiredPermission="approve_manager">
                <PendingManagerPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/pending-supervisor" element={
              <ProtectedRoute requiredPermission="approve_requests">
                <PendingSupervisorPage />
              </ProtectedRoute>
            } />
            
            <Route path="/clients" element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            } />
            <Route path="/technicians" element={
              <ProtectedRoute>
                <TechniciansPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requiredPermission="manage_users">
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute requiredPermission="manage_services">
                <ServicesPage />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute requiredPermission="manage_employees">
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
            
            {/* Rutas existentes mantenidas para compatibilidad */}
            <Route path="/forklifts" element={
              <ProtectedRoute>
                <ForkliftsPage />
              </ProtectedRoute>
            } />
            <Route path="/operators" element={
              <ProtectedRoute>
                <OperatorsPage />
              </ProtectedRoute>
            } />
            <Route path="/operations" element={
              <ProtectedRoute>
                <OperationsPage />
              </ProtectedRoute>
            } />
            <Route path="/maintenance" element={
              <ProtectedRoute>
                <MaintenancePage />
              </ProtectedRoute>
            } />
            <Route path="/gas-supply" element={
              <ProtectedRoute>
                <GasSupplyPage />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

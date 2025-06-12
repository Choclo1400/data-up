
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rutas principales del sistema de solicitudes técnicas */}
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Rutas existentes mantenidas para compatibilidad */}
          <Route path="/forklifts" element={<ForkliftsPage />} />
          <Route path="/operators" element={<OperatorsPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/gas-supply" element={<GasSupplyPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

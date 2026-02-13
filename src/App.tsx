import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layouts/MainLayout";
import AgentLayout from "@/components/layouts/AgentLayout";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AgentDashboard from "./pages/agent/Dashboard";
import MyProperties from "./pages/agent/MyProperties";
import CreateProperty from "./pages/agent/CreateProperty";
import EditProperty from "./pages/agent/EditProperty";
import Inquiries from "./pages/agent/Inquiries";
import Appointments from "./pages/agent/Appointments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToAnchor />
          <Routes>
            {/* Public Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Agent Routes - Wrapped in AgentLayout */}
            <Route element={
              <ProtectedRoute requireAgent>
                <AgentLayout />
              </ProtectedRoute>
            }>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/properties" element={<MyProperties />} />
              <Route path="/agent/properties/create" element={<CreateProperty />} />
              <Route path="/agent/properties/edit/:id" element={<EditProperty />} />
              <Route path="/agent/inquiries" element={<Inquiries />} />
              <Route path="/agent/appointments" element={<Appointments />} />
            </Route>

            {/* Catch-all - uses MainLayout implicitly or standalone? 
                NotFound typically has its own layout or main layout.
                Let's put it outside or inside MainLayout. Inside is safer for navigation. 
            */}
            <Route element={<MainLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

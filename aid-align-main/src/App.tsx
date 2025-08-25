import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuggestedMatches from "./pages/SuggestedMatches";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matches" element={<SuggestedMatches />} />
        <Route path="donations" element={<div>Donations Page (Coming Soon)</div>} />
        <Route path="requests" element={<div>Requests Page (Coming Soon)</div>} />
        <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
      </Route>
      {/* Redirect authenticated users to dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Navigate to="/app/dashboard" replace />
        </ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute>
          <Navigate to="/app/matches" replace />
        </ProtectedRoute>
      } />
      <Route path="/donations" element={
        <ProtectedRoute>
          <Navigate to="/app/donations" replace />
        </ProtectedRoute>
      } />
      <Route path="/requests" element={
        <ProtectedRoute>
          <Navigate to="/app/requests" replace />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Navigate to="/app/reports" replace />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Navigate to="/app/profile" replace />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

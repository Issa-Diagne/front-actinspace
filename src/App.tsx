import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';
import ThreatsPage from '@/pages/ThreatsPage';
import SatellitesPage from '@/pages/SatellitesPage';
import CommunicationsPage from '@/pages/CommunicationsPage';
import ResiliencePage from '@/pages/ResiliencePage';
import SimulationPage from '@/pages/SimulationPage';
import SettingsPage from '@/pages/SettingsPage';
import ReportsPage from '@/pages/ReportsPage';
import AutonomousDefensePage from '@/pages/AutonomousDefensePage';
import NotFound from '@/pages/NotFound';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/threats"
        element={
          <ProtectedRoute>
            <ThreatsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/satellites"
        element={
          <ProtectedRoute>
            <SatellitesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/communications"
        element={
          <ProtectedRoute>
            <CommunicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resilience"
        element={
          <ProtectedRoute>
            <ResiliencePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulation"
        element={
          <ProtectedRoute>
            <SimulationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/autonomous-defense"
        element={
          <ProtectedRoute>
            <AutonomousDefensePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;

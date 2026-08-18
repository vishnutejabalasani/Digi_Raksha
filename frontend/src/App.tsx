import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MissionPhishing } from './pages/MissionPhishing';
import { MissionOTP } from './pages/MissionOTP';
import { MissionVishing } from './pages/MissionVishing';
import { MissionUPI } from './pages/MissionUPI';
import { Passport } from './pages/Passport';
import { Quiz } from './pages/Quiz';
import { Leaderboard } from './pages/Leaderboard';
import { Certificate } from './pages/Certificate';
import { AdminPanel } from './pages/AdminPanel';
import { VolunteerPanel } from './pages/VolunteerPanel';
import { Pledge } from './pages/Pledge';

// Premium Features Import
import { CyberCityMap } from './pages/CyberCityMap';
import { CyberEscapeRoom } from './pages/CyberEscapeRoom';
import { AvatarCustomizer } from './pages/AvatarCustomizer';
import { GraduationCeremony } from './pages/GraduationCeremony';

// Guard for authenticated pages
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useGame();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Guard for admin pages
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useGame();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Guard for volunteer pages
const VolunteerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useGame();
  if (!user || (user.role !== 'volunteer' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Cadet Routes */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/mission/phishing" element={<AuthGuard><MissionPhishing /></AuthGuard>} />
          <Route path="/mission/otp" element={<AuthGuard><MissionOTP /></AuthGuard>} />
          <Route path="/mission/vishing" element={<AuthGuard><MissionVishing /></AuthGuard>} />
          <Route path="/mission/upi" element={<AuthGuard><MissionUPI /></AuthGuard>} />
          <Route path="/passport" element={<AuthGuard><Passport /></AuthGuard>} />
          <Route path="/quiz" element={<AuthGuard><Quiz /></AuthGuard>} />
          <Route path="/leaderboard" element={<AuthGuard><Leaderboard /></AuthGuard>} />
          <Route path="/certificate" element={<AuthGuard><Certificate /></AuthGuard>} />
          <Route path="/pledge" element={<AuthGuard><Pledge /></AuthGuard>} />

          {/* Premium Features Routes */}
          <Route path="/city-map" element={<AuthGuard><CyberCityMap /></AuthGuard>} />
          <Route path="/escape-room" element={<AuthGuard><CyberEscapeRoom /></AuthGuard>} />
          <Route path="/avatar" element={<AuthGuard><AvatarCustomizer /></AuthGuard>} />
          <Route path="/graduation" element={<AuthGuard><GraduationCeremony /></AuthGuard>} />

          {/* Management Panels */}
          <Route path="/admin" element={<AdminGuard><AdminPanel /></AdminGuard>} />
          <Route path="/volunteer" element={<VolunteerGuard><VolunteerPanel /></VolunteerGuard>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
};

export default App;

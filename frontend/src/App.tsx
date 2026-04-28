import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateAssetPage from './pages/CreateAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import IconographyPage from './pages/IconographyPage';
import ImagesPage from './pages/ImagesPage';
import PitchDeckPage from './pages/PitchDeckPage';
import BrandGuidelinesPage from './pages/BrandGuidelinesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UserManagement from './pages/UserManagement';
import Preloader from './components/Preloader';
import CursorSwitcher from './components/CursorSwitcher';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); 
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="bg-orb bg-orb-1" style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }} />
          <div className="bg-orb bg-orb-2" style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }} />
          <div className="bg-orb bg-orb-3" style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }} />
          <div className="bg-geo bg-geo-ring-1" />
          <div className="bg-geo bg-geo-ring-2" />
          <div className="bg-geo bg-geo-diamond" />
          <Preloader isLoading={isLoading} />
          <CursorSwitcher />
          <Router>
        <Routes>
          {/* Public routes - No login required */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* All routes are now protected except for /login */}
          <Route path="/iconography" element={
            <ProtectedRoute>
              <Layout>
                <IconographyPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/images" element={
            <ProtectedRoute>
              <Layout>
                <ImagesPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/pitch-decks" element={
            <ProtectedRoute>
              <Layout>
                <PitchDeckPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/pitch-deck" element={<Navigate to="/pitch-decks" replace />} />

          <Route path="/brand-guidelines" element={
            <ProtectedRoute>
              <BrandGuidelinesPage />
            </ProtectedRoute>
          } />

          <Route path="/contact" element={
            <ProtectedRoute>
              <Layout>
                <ContactPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Protected routes - Login required */}
          <Route path="/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateAssetPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <EditAssetPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

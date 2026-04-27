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
import TrailingCursor from './components/GhostCursor';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    
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
        <TrailingCursor />
        <Router>
        <Routes>
          {/* Public routes - No login required */}
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/iconography" element={
            <Layout>
              <IconographyPage />
            </Layout>
          } />

          <Route path="/images" element={
            <Layout>
              <ImagesPage />
            </Layout>
          } />

          <Route path="/pitch-decks" element={
            <Layout>
              <PitchDeckPage />
            </Layout>
          } />
          
          <Route path="/pitch-deck" element={<Navigate to="/pitch-decks" replace />} />

          {/* Standalone Brand Guidelines Experience */}
          <Route path="/brand-guidelines" element={<BrandGuidelinesPage />} />

          <Route path="/contact" element={
            <Layout>
              <ContactPage />
            </Layout>
          } />

          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateAssetPage from './pages/CreateAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import LogosPage from './pages/LogosPage';
import BrandGuidelinesPage from './pages/BrandGuidelinesPage';
import LoginPage from './pages/LoginPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UsersPage from './pages/UsersPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          {/* Public routes - No login required */}
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/logos" element={
            <Layout>
              <LogosPage />
            </Layout>
          } />

          <Route path="/brand-guidelines" element={
            <BrandGuidelinesPage />
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
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

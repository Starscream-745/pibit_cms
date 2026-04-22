import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User } from 'lucide-react';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, isAuthEnabled, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">PIBIT.AI CMS</Link>
          </h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Assets</Link>
            <Link to="/logos" className="nav-link">Logos</Link>
            <Link to="/brand-guidelines" className="nav-link">Brand Guidelines</Link>
            {isAuthenticated && isAdmin && (
              <>
                <Link to="/analytics" className="nav-link">Analytics</Link>
                <Link to="/users" className="nav-link">Users</Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/create" className="nav-link nav-link-primary">+ Add Asset</Link>
                )}
                {isAuthEnabled && (
                  <div className="user-info">
                    <span className="user-role-badge">
                      {userRole === 'admin' ? (
                        <>
                          <ShieldCheck size={16} />
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <User size={16} />
                          <span>User</span>
                        </>
                      )}
                    </span>
                    <button onClick={handleLogout} className="nav-link nav-link-logout">
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              isAuthEnabled && (
                <Link to="/login" className="nav-link nav-link-login">
                  Login
                </Link>
              )
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2026 PIBIT.AI - Content Management System</p>
      </footer>
    </div>
  );
};

export default Layout;

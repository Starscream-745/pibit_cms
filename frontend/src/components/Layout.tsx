import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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

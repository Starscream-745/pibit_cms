import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
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

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">PIBIT.AI CMS</Link>
          </h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Assets</Link>
            <div 
              className={`nav-dropdown ${isDropdownOpen ? 'active' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Categories <ChevronDown size={14} />
              </button>
              <div className="dropdown-menu">
                <Link to="/iconography" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Iconography</Link>
                <Link to="/images" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Images</Link>
                <Link to="/pitch-decks" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Pitch Decks</Link>
              </div>
            </div>
            <Link to="/brand-guidelines" className="nav-link">Brand Guidelines</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>

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
                    <ThemeToggle />
                  </div>
                )}
              </>
            ) : (
              <div className="user-info">
                {isAuthEnabled && (
                  <Link to="/login" className="nav-link nav-link-login">
                    Login
                  </Link>
                )}
                <ThemeToggle />
              </div>
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

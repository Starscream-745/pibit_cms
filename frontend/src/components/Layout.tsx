import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User, ChevronDown, ChevronRight, Home, BookOpen, Mail, PieChart, Users, Plus, Image, Presentation, LayoutGrid, Folders } from 'lucide-react';
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

  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="layout">
      {/* TOP HEADER */}
      <header className="header">
        <div className="header-left">
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <LayoutGrid size={24} />
          </button>
          <h1 className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Pibit.AI CMS" style={{ height: '32px', width: 'auto' }} />
            </Link>
          </h1>
        </div>

        <div className="header-right">
          {isAuthenticated ? (
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
              <button onClick={handleLogout} className="header-btn">
                Logout
              </button>
            </div>
          ) : (
            isAuthEnabled && (
              <Link to="/login" className="header-btn">
                Login
              </Link>
            )
          )}
        </div>
      </header>

      <div className="layout-body">
        {/* SIDEBAR */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          {isAuthenticated && isAdmin && (
            <div className="sidebar-action-container">
              <Link to="/create" className="sidebar-btn-new">
                <Plus size={22} />
                <span>New</span>
              </Link>
            </div>
          )}

          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">
              <Home size={20} />
              <span>Assets</span>
            </Link>

            <div className="sidebar-section">
              <button
                className="sidebar-section-toggle"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                {isCategoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Categories</span>
              </button>

              {isCategoriesOpen && (
                <div className="sidebar-sublinks">
                  <Link to="/iconography" className="sidebar-link sub-link">
                    <Image size={18} />
                    <span>Iconography</span>
                  </Link>
                  <Link to="/images" className="sidebar-link sub-link">
                    <Folders size={18} />
                    <span>Images</span>
                  </Link>
                  <Link to="/pitch-decks" className="sidebar-link sub-link">
                    <Presentation size={18} />
                    <span>Pitch Decks</span>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/brand-guidelines" className="sidebar-link">
              <BookOpen size={20} />
              <span>Brand Guidelines</span>
            </Link>

            <Link to="/contact" className="sidebar-link">
              <Mail size={20} />
              <span>Contact Us</span>
            </Link>

            {isAuthenticated && isAdmin && (
              <>
                <div className="sidebar-divider"></div>
                <Link to="/analytics" className="sidebar-link">
                  <PieChart size={20} />
                  <span>Analytics</span>
                </Link>
                <Link to="/users" className="sidebar-link">
                  <Users size={20} />
                  <span>Users</span>
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* MAIN CONTENT */}
        <main className="main-content">
          {children}

          <footer className="footer">
            <p>&copy; 2026 Pibit.AI - Content Management System</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;

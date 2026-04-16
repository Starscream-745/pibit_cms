import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthEnabled: boolean;
  userRole: 'admin' | 'user' | null;
  login: (username: string, password: string, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthEnabled, setIsAuthEnabled] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if auth is enabled
      const statusResponse = await fetch(`${apiUrl}/api/auth/status`);
      const statusData = await statusResponse.json();
      setIsAuthEnabled(statusData.authEnabled);

      // If auth is disabled, user is always "authenticated"
      if (!statusData.authEnabled) {
        setIsAuthenticated(true);
        setUserRole('admin'); // Default to admin when auth is disabled
        setLoading(false);
        return;
      }

      // Check if user has valid token
      const token = localStorage.getItem('authToken');
      const savedRole = localStorage.getItem('userRole') as 'admin' | 'user' | null;
      
      if (token && savedRole) {
        const verifyResponse = await fetch(`${apiUrl}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          setIsAuthenticated(true);
          setUserRole(data.user?.role || savedRole);
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string, role: 'admin' | 'user') => {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthEnabled, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

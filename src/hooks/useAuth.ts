import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('dh_auth');
    setIsAuthenticated(auth === 'true');
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    if (!email || !password) return false;
    localStorage.setItem('dh_auth', 'true');
    localStorage.setItem('dh_user_email', email);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('dh_auth');
    localStorage.removeItem('dh_user_email');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
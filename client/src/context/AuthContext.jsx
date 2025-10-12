import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();
  const API_BASE = 'http://localhost:5000/api/olheiro'; // Same as LoginPage.jsx

  // Sync user state with localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token, user]);

  const login = async (email, senha) => {
    try {
      const { data } = await axios.post(`${API_BASE}/login`, { email, senha });
      setToken(data.token);
      setUser(data.user);
      // Don't navigate here — let the caller (LoginPage) decide where to go
      return { success: true, user: data.user };
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        'Falha no login. Verifique email e senha.';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
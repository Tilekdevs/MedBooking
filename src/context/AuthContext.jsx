/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Ошибка парсинга JWT:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      return payload ? { email: payload.sub, role: payload.role } : null;
    }
    return null;
  });

  const login = async ({ email, password }) => {
    try {
      // Хардкод администратора
      if (email === 'admin@example.com' && password === 'admin123') {
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          btoa(JSON.stringify({ sub: 'admin@example.com', role: 'ADMIN' })) +
          '.signature';
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('role', 'ADMIN');
        setUser({ email: 'admin@example.com', role: 'ADMIN' });
        return { role: 'ADMIN' };
      }

      // Обычный запрос к бэкенду
      const response = await axios.post(
        'http://localhost:8085/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );
      const token = response.data.token || response.data;
      if (!token) throw new Error('Токен не получен');
      localStorage.setItem('token', token);
      const payload = parseJwt(token);
      if (!payload) throw new Error('Невалидный токен');
      if (payload.role) {
        localStorage.setItem('role', payload.role);
      }
      setUser({ email: payload.sub, role: payload.role });
      return { role: payload.role };
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
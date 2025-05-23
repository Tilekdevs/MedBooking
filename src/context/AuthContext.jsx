/* eslint-disable react/prop-types */
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const fakeUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin', token: 'admin-token' },
  { email: 'user@example.com', password: 'user123', role: 'user', token: 'user-token' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // При загрузке пытаемся считать из localStorage
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setUser({ token, role })
    }
  }, [])

  const login = ({ email, password }) => {
    // Ищем пользователя
    const found = fakeUsers.find(
      u => u.email === email && u.password === password
    )
    if (!found) {
      throw new Error('Неверный email или пароль')
    }
    // Сохраняем в localStorage и state
    localStorage.setItem('token', found.token)
    localStorage.setItem('role', found.role)
    setUser({ token: found.token, role: found.role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => {
			const token = localStorage.getItem('token')
			if (token) {
				setUser({ id: 1, email: 'admin@example.com', role: 'ADMIN' })
			}
			setLoading(false)
		}, 1000)
	}, [])

	const login = async ({ email, password }) => {
		try {
			console.log('Sending login:', { email, password })
			const { data } = await axios.post('http://localhost:8085/api/auth/login', {
				email,
				password,
			})
			localStorage.setItem('token', data.token || data) // в зависимости что возвращает сервер
			setUser(data.user || { email }) // пример, надо уточнить
			return data.user || { email }
		} catch (err) {
			console.error('Login error response:', err.response)
			throw err
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}

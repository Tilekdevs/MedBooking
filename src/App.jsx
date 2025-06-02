import { Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import AdminPanel from './pages/AdminPanel'
import BookAppointment from './pages/BookAppointment'
import Dashboard from './pages/Dashboard'
import DoctorPage from './pages/DoctorPage'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route
					path='/dashboard'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path='/book/:doctorId'
					element={
						<PrivateRoute>
							<BookAppointment />
						</PrivateRoute>
					}
				/>
				<Route
					path='/doctor'
					element={
						<AdminRoute>
							<DoctorPage />
						</AdminRoute>
					}
				/>
				<Route
					path='/admin'
					element={
						<AdminRoute>
							<AdminPanel />
						</AdminRoute>
					}
				/>
			</Routes>
		</AuthProvider>
	)
}

export default App

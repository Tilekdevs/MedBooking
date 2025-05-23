import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './index.css'
import PrivateRoute from './components/PrivateRoute'
import BookAppointment from './pages/BookAppointment'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/book/:doctorId' element={<BookAppointment />} />
				<Route
					path='/dashboard'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
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
		</Router>
	)
}

export default App

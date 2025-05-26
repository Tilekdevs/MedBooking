import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
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
            path='/admin'
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
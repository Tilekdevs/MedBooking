/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;

  return children;
}

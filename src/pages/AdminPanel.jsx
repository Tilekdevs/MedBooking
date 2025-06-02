import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../style/AdminPanel.scss';

export default function AdminPanel() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '', experience: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      setError('Доступ запрещен. Требуется роль администратора.');
      return;
    }
    fetchDoctors();
  }, [user]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки врачей');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async e => {
    e.preventDefault();
    try {
      await API.post(
        '/doctors',
        { ...form, experience: Number(form.experience) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', specialization: '', experience: '' });
      fetchDoctors();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении врача');
    }
  };

  const handleDeleteDoctor = async id => {
    if (!window.confirm('Удалить этого врача?')) return;
    try {
      await API.delete(`/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {},
      });
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении врача');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <p className="error">Доступ запрещен</p>;
  }

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      {error && <p className="error">{error}</p>}

      <form className="doctor-form" onSubmit={handleAddDoctor}>
        <input
          type="text"
          placeholder="Имя"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Специализация"
          value={form.specialization}
          onChange={e => setForm({ ...form, specialization: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Опыт (лет)"
          value={form.experience}
          onChange={e => setForm({ ...form, experience: e.target.value })}
          required
          min="0"
        />
        <button type="submit" disabled={loading}>Добавить врача</button>
      </form>

      <h2>Список врачей</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul className="doctor-list">
          {doctors.map(doc => (
            <li key={doc.id} className="doctor-item">
              <div>
                <strong>{doc.name}</strong> — {doc.specialization} ({doc.experience} лет)
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteDoctor(doc.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

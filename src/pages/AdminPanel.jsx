import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { Layout } from '../components/Layout';
import API from '../services/api';
import { useAuth } from '../context/AuthContext'; // Импортируем useAuth
import '../style/AdminPanel.scss';

export default function AdminPanel() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '', experience: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [timeSlots, setTimeSlots] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth(); // Получаем пользователя
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Проверка роли
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      setError('Доступ запрещен. Требуется роль администратора.');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchDoctors();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      if (!token) throw new Error('Токен отсутствует');

      // Временный обход для хардкодного админа
      if (user?.email === 'admin@example.com') {
        // Моковые данные для тестирования
        const mockDoctors = [
          { id: 1, name: 'Test Doctor', specialization: 'Test', experience: 5 },
          { id: 2, name: 'Admin Doctor', specialization: 'Admin', experience: 10 }
        ];
        console.log('Моковые врачи:', mockDoctors);
        setDoctors(mockDoctors);
        return;
      }

      const { data } = await API.get('/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Врачи:', data);
      setDoctors(data);
    } catch (err) {
      console.error('Ошибка при загрузке врачей:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при загрузке врачей');
    }
  };

  const handleScheduleSubmit = async e => {
    e.preventDefault();
    try {
      if (!selectedDoctor) throw new Error('Врач не выбран');
      const timesArray = timeSlots.split(',').map(t => t.trim());

      if (user?.email === 'admin@example.com') {
        // Моковый успех для хардкодного админа
        alert('Расписание обновлено (мок)');
        setSelectedDoctor(null);
        setScheduleDate('');
        setTimeSlots('');
        setError('');
        return;
      }

      await API.post(
        `/doctors/${selectedDoctor.id}/schedule`,
        { date: scheduleDate, times: timesArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Расписание обновлено');
      setSelectedDoctor(null);
      setScheduleDate('');
      setTimeSlots('');
      setError('');
      fetchDoctors();
    } catch (err) {
      console.error('Ошибка при обновлении расписания:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при обновлении расписания');
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      if (user?.email === 'admin@example.com') {
        // Моковый успех для хардкодного админа
        alert('Врач добавлен (мок)');
        setForm({ name: '', specialization: '', experience: '' });
        setError('');
        fetchDoctors();
        return;
      }

      await API.post(
        '/doctors',
        { ...form, experience: parseInt(form.experience) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', specialization: '', experience: '' });
      setError('');
      fetchDoctors();
    } catch (err) {
      console.error('Ошибка при добавлении врача:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при добавлении врача');
    }
  };

  const handleDelete = async id => {
    try {
      if (user?.email === 'admin@example.com') {
        // Моковый успех для хардкодного админа
        alert('Врач удален (мок)');
        fetchDoctors();
        return;
      }

      await API.delete(`/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDoctors();
    } catch (err) {
      console.error('Ошибка при удалении врача:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при удалении врача');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <p>Загрузка...</p>;
  }

  return (
    <Layout title='Панель администратора'>
      {error && <p className="error">{error}</p>}
      <form
        onSubmit={handleAdd}
        className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'
      >
        <input
          placeholder='Имя'
          name='name'
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          required
        />
        <input
          placeholder='Специализация'
          name='specialization'
          value={form.specialization}
          onChange={e => setForm({ ...form, specialization: e.target.value })}
          className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          required
        />
        <input
          placeholder='Опыт (лет)'
          type='number'
          name='experience'
          value={form.experience}
          onChange={e => setForm({ ...form, experience: e.target.value })}
          className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
          required
        />
        <button
          type='submit'
          className='bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition'
        >
          Добавить
        </button>
      </form>

      <div className='space-y-6'>
        {doctors.map(doc => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onDelete={() => handleDelete(doc.id)}
            onEdit={() => setSelectedDoctor(doc)}
          />
        ))}
      </div>

      {selectedDoctor && (
        <div className='mt-8 p-6 bg-white rounded-lg shadow-md border-t'>
          <h3 className='text-xl font-bold mb-4'>
            Расписание для {selectedDoctor.name}
          </h3>
          <form onSubmit={handleScheduleSubmit} className='space-y-4 max-w-md'>
            <input
              type='date'
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              className='border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
              required
            />
            <input
              type='text'
              placeholder='Часы через запятую (напр. 09:00,10:00,14:00)'
              value={timeSlots}
              onChange={e => setTimeSlots(e.target.value)}
              className='border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
              required
            />
            <button
              type='submit'
              className='bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 transition'
            >
              Сохранить
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
}
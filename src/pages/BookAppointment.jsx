import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { Layout } from '../components/Layout';
import '../style/BookAppointment.scss';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const isValidTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!date || !time) {
      setError('Укажите дату и время');
      return;
    }

    if (!isValidTime(time)) {
      setError('Введите время в формате HH:MM (например, 14:30)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');

      await API.post(
        '/appointments',
        {
          doctorId: parseInt(doctorId),
          date,
          time,
          status: 'SCHEDULED'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Запись успешно создана');
      setTimeout(() => {
        setSuccess('');
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании записи');
      console.error('Ошибка при записи:', err.response?.data || err.message);
    }
  };

  return (
    <Layout title="Запись к врачу">
      <form onSubmit={handleSubmit} className="book-appointment-form">
        <label>
          <span className="label-text">Дата</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
        </label>
        <label>
          <span className="label-text">Время</span>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <button type="submit" className="btn-submit">
          Записаться
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </Layout>
  );
}

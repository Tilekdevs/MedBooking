/* eslint-disable react/prop-types */
import { useState } from 'react';
import API from '../services/api';
import '../style/DoctorModal.scss';

export default function DoctorModal({ doctor, onClose, onAppointmentBooked }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!doctor) return null;

  const isValidTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot && (!date || !time)) {
      setError('Выберите время из расписания или укажите дату и время');
      return;
    }

    if (!selectedSlot && !isValidTime(time)) {
      setError('Введите время в формате HH:MM (например, 14:30)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');

      if (localStorage.getItem('role') === 'ADMIN' && localStorage.getItem('email') === 'admin@example.com') {
        setSuccess('Запись успешно создана (мок)');
        setError('');
        setDate('');
        setTime('');
        setSelectedSlot(null);
        setTimeout(() => {
          setSuccess('');
          onClose();
          if (onAppointmentBooked) onAppointmentBooked();
        }, 2000);
        return;
      }

      const appointmentData = {
        doctorId: doctor.id,
        date: selectedSlot ? selectedSlot.day : date,
        time: selectedSlot ? selectedSlot.time : time,
        status: 'SCHEDULED'
      };

      await API.post('/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Запись успешно создана!');
      setError('');
      setDate('');
      setTime('');
      setSelectedSlot(null);
      setTimeout(() => {
        setSuccess('');
        onClose();
        if (onAppointmentBooked) onAppointmentBooked();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании записи');
      console.error('Ошибка при записи:', err.response?.data || err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{doctor.name}</h2>
        <p>
          <strong>Специализация:</strong> {doctor.specialization || 'Не указана'}
        </p>
        <p>
          <strong>Опыт:</strong> {doctor.experience || 0} лет
        </p>
        <p>
          <strong>Описание:</strong> {doctor.description || 'Описание отсутствует'}
        </p>

        <h3>📅 Расписание</h3>
        {doctor.schedule?.length > 0 ? (
          <ul>
            {doctor.schedule.map((slot, i) => (
              <li
                key={i}
                onClick={() => setSelectedSlot(slot)}
                className={selectedSlot === slot ? 'selected-slot' : ''}
                style={{ cursor: 'pointer' }}
              >
                {slot.day}: {slot.time}
              </li>
            ))}
          </ul>
        ) : (
          <p>Расписание отсутствует</p>
        )}

        <h3>⭐ Отзывы</h3>
        {doctor.reviews?.length > 0 ? (
          <ul>
            {doctor.reviews.map((r, i) => (
              <li key={i}>
                <strong>{r.author}:</strong> {r.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>Отзывы отсутствуют</p>
        )}

        <h3>Запись на прием</h3>
        <form className="appointment-form">
          <label>
            <span className="label-text">Дата</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled={selectedSlot}
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
              disabled={selectedSlot}
              className="input-field"
            />
          </label>
          {selectedSlot && (
            <div className="selected-slot-info">
              <p>
                Выбрано: {selectedSlot.day}, {selectedSlot.time}
              </p>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="btn btn-cancel"
              >
                Сбросить выбор
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleBookAppointment}
            className="btn btn-book"
          >
            Подтвердить запись
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
}
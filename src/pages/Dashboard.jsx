import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import DoctorModal from '../components/DoctorModal';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import '../style/Dashboard.scss';

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');
      const { data } = await API.get('/appointments/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Записи:', data);
      setAppointments(data);
    } catch (err) {
      console.error('Ошибка при загрузке записей:', err.response?.data || err.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');
      const { data } = await API.get('/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Врачи:', data);
      setDoctors(data);
    } catch (err) {
      console.error('Ошибка при загрузке врачей:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title='Добро пожаловать!'>
      <div className='dashboard-logout'>
        <button onClick={handleLogout} className='btn btn-logout'>
          Выйти
        </button>
      </div>

      <section className='dashboard-appointments'>
        <h2 className='section-title'>Мои записи</h2>
        {appointments.length === 0 ? (
          <p className='no-appointments'>Записей пока нет.</p>
        ) : (
          <div className='appointments-list'>
            {appointments.map(appt => (
              <div key={appt.id} className='appointment-card'>
                <p><strong>Врач:</strong> {appt.doctorName}</p>
                <p><strong>Дата:</strong> {appt.date}</p>
                <p><strong>Время:</strong> {appt.time}</p>
                <p><strong>Статус:</strong> {appt.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className='dashboard-doctors'>
        <h2 className='section-title'>Доступные врачи</h2>
        <div className='doctor-controls'>
          <input
            type='text'
            placeholder='Поиск по имени'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='doctor-search'
          />
        </div>
        <div className='doctors-grid'>
          {filteredDoctors.length === 0 ? (
            <p className='no-doctors'>Врачи не найдены.</p>
          ) : (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className='doctor-card-wrapper'>
                <DoctorCard
                  doctor={doctor}
                  onBook={() => setSelectedDoctor(doctor)}
                />
                {doctor.schedule?.length > 0 && (
                  <div className='doctor-schedule'>
                    <h4>Расписание:</h4>
                    <ul>
                      {doctor.schedule.map((slot, i) => (
                        <li key={i}>{slot.day} {slot.time}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
          {selectedDoctor && (
            <DoctorModal
              doctor={selectedDoctor}
              onClose={() => setSelectedDoctor(null)}
              onAppointmentBooked={fetchAppointments}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
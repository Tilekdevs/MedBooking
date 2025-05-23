import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { Layout } from '../components/Layout';
import '../style/Dashboard.scss';

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await API.get('/appointments/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(data);
      } catch (err) {
        console.error('Ошибка при загрузке записей:', err);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await API.get('/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(data);
      } catch (err) {
        console.error('Ошибка при загрузке врачей:', err);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <Layout title="Добро пожаловать!">
      <div className="dashboard-logout">
        <button onClick={logout} className="btn btn-logout">
          Выйти
        </button>
      </div>

      <section className="dashboard-appointments">
        <h2 className="section-title">Мои записи</h2>
        {appointments.length === 0 ? (
          <p className="no-appointments">Записей пока нет.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <div key={appt.id} className="appointment-card">
                <p><strong>Врач:</strong> {appt.doctorName}</p>
                <p><strong>Дата:</strong> {appt.date}</p>
                <p><strong>Время:</strong> {appt.time}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-doctors">
        <h2 className="section-title">Доступные врачи</h2>
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => navigate(`/book/${doctor.id}`)}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}

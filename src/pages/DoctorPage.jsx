import { useEffect, useState } from 'react';
import '../style/DoctorPage.scss';

function DoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8085/doctors')
      .then((res) => res.json())
      .then(setDoctors)
      .catch(() => setError('Не удалось загрузить список докторов'));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Валидация простая
    if (!formData.name || !formData.specialization || !formData.experience) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8085/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          specialization: formData.specialization,
          experience: Number(formData.experience),
        }),
      });
      const newDoctor = await response.json();

      setDoctors((prev) => [...prev, newDoctor]);
      setFormData({ name: '', specialization: '', experience: '' });
    } catch {
      setError('Ошибка при добавлении доктора');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-page">
      <h1>Управление докторами</h1>

      <form className="doctor-form" onSubmit={handleSubmit}>
        <h2>Добавить нового доктора</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Имя доктора"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="text"
          name="specialization"
          placeholder="Специализация"
          value={formData.specialization}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="number"
          name="experience"
          placeholder="Опыт (лет)"
          min="0"
          value={formData.experience}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить доктора'}
        </button>
      </form>

      <section className="doctor-list">
        <h2>Список докторов</h2>
        {doctors.length === 0 ? (
          <p>Доктора отсутствуют</p>
        ) : (
          <div className="cards">
            {doctors.map(({ id, name, specialization, experience }) => (
              <div key={id} className="card">
                <h3>{name}</h3>
                <p><strong>Специализация:</strong> {specialization}</p>
                <p><strong>Опыт:</strong> {experience} {experience === 1 ? 'год' : 'лет'}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorPage;

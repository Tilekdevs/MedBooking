import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Register.scss';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setError(''); 

    if (!form.name || !form.email || !form.password || !form.role) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role.trim().toUpperCase(),
    };

    try {
      const response = await axios.post(
        '/api/auth/register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const token = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', payload.role);
      localStorage.setItem('email', payload.email);

      if (payload.role === 'ADMIN') navigate('/admin');
      else if (payload.role === 'DOCTOR') navigate('/doctor');
      else navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка регистрации:', err.response?.status, err.response?.data);
      setError(err.response?.data || 'Ошибка при регистрации.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          className="register-input"
          autoComplete="name"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="register-input"
          autoComplete="email"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="register-input"
          autoComplete="new-password"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="register-input"
          required
        >
          <option value="">Выберите роль</option>
          <option value="PATIENT">Пациент</option>
          <option value="DOCTOR">Доктор</option>
          <option value="ADMIN">Администратор</option>
        </select>

        {error && <p className="register-error">{error}</p>}

        <button type="submit" className="register-button">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

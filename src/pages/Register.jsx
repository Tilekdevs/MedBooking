import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../style/Register.scss'; // импорт стилей

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      console.error('Ошибка при регистрации:', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="name"
          placeholder="Имя"
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          className="register-input"
        />
        <button className="register-button">Зарегистрироваться</button>
      </form>
    </div>
  );
}

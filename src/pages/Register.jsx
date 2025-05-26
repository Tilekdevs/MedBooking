import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Register.scss';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleChange = e => {
  setForm(prev => {
    const updated = { ...prev, [e.target.name]: e.target.value };
    console.log('Изменение формы:', updated);  // <-- лог текущего состояния
    return updated;
  });
};


  const handleSubmit = async e => {
  e.preventDefault();
  if (!form.name || !form.email || !form.password || !form.role) {
    alert('Заполните все поля');
    return;
  }

  console.log('Данные формы для отправки:', form);  // <-- тут лог

  try {
    const response = await axios.post('http://localhost:8085/auth/register', form, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Успешная регистрация:', response.data);
    navigate('/login');
  } catch (err) {
    console.error('Ошибка при регистрации:', err.response?.data?.message || err.message);
  }
};


  return (
    <div className="register-container">
      <h2 className="register-title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input name="name" value={form.name} placeholder="Имя" onChange={handleChange} className="register-input" />
        <input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} className="register-input" />
        <input name="password" type="password" value={form.password} placeholder="Пароль" onChange={handleChange} className="register-input" />
        <select name="role" value={form.role} onChange={handleChange} className="register-input">
          <option value="USER">Пользователь</option>
          <option value="ADMIN">Администратор</option>
          <option value="DOCTOR">Доктор</option>
        </select>
        <button type="submit" className="register-button">Зарегистрироваться</button>
      </form>
    </div>
  );
}

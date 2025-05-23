import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style//Login.scss';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      login(form);
      navigate(localStorage.getItem('role') === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Вход в систему</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="login-input"
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
}

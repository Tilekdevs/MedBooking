import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Login.scss';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { role } = await login(form);
      console.log('Вход успешен:', { email: form.email, role });
      setForm({ email: '', password: '' });
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Ошибка входа:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <form onSubmit={handleSubmit} className='login-form'>
        <h2 className='login-title'>Вход в систему</h2>
        <div className='input-group'>
          <label htmlFor='email' className='input-label'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='Введите email'
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className='login-input'
            required
            disabled={loading}
          />
        </div>
        <div className='input-group'>
          <label htmlFor='password' className='input-label'>Пароль</label>
          <input
            id='password'
            type='password'
            placeholder='Введите пароль'
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className='login-input'
            required
            disabled={loading}
          />
        </div>
        {error && <p className='login-error'>{error}</p>}
        <button type='submit' className='login-button' disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <p className='login-register-link'>
          Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
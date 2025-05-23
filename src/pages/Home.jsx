import { Link } from 'react-router-dom';
import '../style/Home.scss';

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="home-title">Добро пожаловать в MedBooking</h1>
      <p className="home-subtitle">Онлайн-запись к врачу за 2 минуты. Без очередей.</p>
      <div className="home-buttons">
        <Link to="/login" className="btn btn-primary">Войти</Link>
        <Link to="/register" className="btn btn-secondary">Регистрация</Link>
      </div>
    </div>
  );
}

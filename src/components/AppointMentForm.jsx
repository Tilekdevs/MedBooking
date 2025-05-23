/* eslint-disable react/prop-types */
import '../style/AppointmentForm.scss'

export default function AppointmentForm({ onSubmit, date, time, setDate, setTime, availableTimes }) {
  return (
    <form onSubmit={onSubmit} className="appointment-form">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="appointment-form__input"
        required
      />

      <select
        value={time}
        onChange={e => setTime(e.target.value)}
        className="appointment-form__select"
        required
      >
        <option value="">Выберите время</option>
        {availableTimes?.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button type="submit" className="appointment-form__button">
        Подтвердить
      </button>
    </form>
  );
}

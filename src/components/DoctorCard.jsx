/* eslint-disable react/prop-types */
import '../style/DoctorCard.scss'

export default function DoctorCard({ doctor, onBook, onEdit, onDelete }) {
  return (
    <div className="doctor-card">
      <h3 className="doctor-card__name">{doctor.name}</h3>
      <p className="doctor-card__specialty">Специализация: {doctor.specialty}</p>
      <p className="doctor-card__experience">
        Опыт: {doctor.experience} {doctor.experience > 1 ? 'лет' : 'год'}
      </p>

      <div className="doctor-card__actions">
        {onBook && (
          <button onClick={onBook} className="btn btn--green">
            Записаться
          </button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="btn btn--yellow">
            Редактировать
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="btn btn--red">
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}

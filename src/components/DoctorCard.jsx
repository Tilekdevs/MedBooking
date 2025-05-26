/* eslint-disable react/prop-types */
import '../style/DoctorCard.scss'

export default function DoctorCard({ doctor, onBook, onDelete, onEdit }) {
  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p>
        <strong>Специализация:</strong> {doctor.specialization || 'Не указана'}
      </p>
      <p>
        <strong>Опыт:</strong> {doctor.experience || 0} лет
      </p>
      <div className="doctor-card-actions">
        {onBook && (
          <button onClick={onBook} className="btn btn-book">
            Записаться
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="btn btn-delete">
            Удалить
          </button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="btn btn-edit">
            Редактировать
          </button>
        )}
      </div>
    </div>
  )
}
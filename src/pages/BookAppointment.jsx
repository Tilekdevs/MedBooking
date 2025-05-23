import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'
import { Layout } from '../components/Layout'
import '../style/BookAppointment.scss'

export default function BookAppointment() {
  const { doctorId } = useParams()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await API.post(
        '/appointments',
        { doctorId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Запись успешно создана')
      navigate('/dashboard')
    } catch (err) {
      alert(err)
    }
  }

  return (
    <Layout title="Запись к врачу">
      <form onSubmit={handleSubmit} className="book-appointment-form">
        <label>
          <span className="label-text">Дата</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="input-field"
          />
        </label>

        <label>
          <span className="label-text">Время</span>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="input-field"
          />
        </label>

        <button type="submit" className="btn-submit">
          Записаться
        </button>
      </form>
    </Layout>
  )
}

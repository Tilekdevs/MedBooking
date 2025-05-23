import { useEffect, useState } from 'react'
import DoctorCard from '../components/DoctorCard'
import { Layout } from '../components/Layout'
import API from '../services/api'
import '../style/AdminPanel.scss'

export default function AdminPanel() {
	const [doctors, setDoctors] = useState([])
	const [form, setForm] = useState({ name: '', specialty: '', experience: '' })
	const [selectedDoctor, setSelectedDoctor] = useState(null)
	const [scheduleDate, setScheduleDate] = useState('')
	const [timeSlots, setTimeSlots] = useState('')

	const token = localStorage.getItem('token')

	useEffect(() => {
		fetchDoctors()
	}, [])

	const fetchDoctors = async () => {
		const { data } = await API.get('/doctors', {
			headers: { Authorization: `Bearer ${token}` },
		})
		setDoctors(data)
	}

	const handleScheduleSubmit = async e => {
		e.preventDefault()
		const timesArray = timeSlots.split(',').map(t => t.trim())
		await API.post(
			`/doctors/${selectedDoctor.id}/schedule`,
			{ date: scheduleDate, times: timesArray },
			{ headers: { Authorization: `Bearer ${token}` } },
		)
		alert('Расписание обновлено')
		setSelectedDoctor(null)
	}

	const handleAdd = async e => {
		e.preventDefault()
		await API.post('/doctors', form, {
			headers: { Authorization: `Bearer ${token}` },
		})
		setForm({ name: '', specialty: '', experience: '' })
		fetchDoctors()
	}

	const handleDelete = async id => {
		await API.delete(`/doctors/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		fetchDoctors()
	}

	return (
		<Layout title='Панель администратора'>
			<form
				onSubmit={handleAdd}
				className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'
			>
				<input
					placeholder='Имя'
					name='name'
					value={form.name}
					onChange={e => setForm({ ...form, name: e.target.value })}
					className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
					required
				/>
				<input
					placeholder='Специализация'
					name='specialty'
					value={form.specialty}
					onChange={e => setForm({ ...form, specialty: e.target.value })}
					className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
					required
				/>
				<input
					placeholder='Опыт (лет)'
					type='number'
					name='experience'
					value={form.experience}
					onChange={e => setForm({ ...form, experience: e.target.value })}
					className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
					required
				/>
				<button
					type='submit'
					className='bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition'
				>
					Добавить
				</button>
			</form>

			<div className='space-y-6'>
				{doctors.map(doc => (
					<DoctorCard
						key={doc.id}
						doctor={doc}
						onDelete={() => handleDelete(doc.id)}
						onEdit={() => setSelectedDoctor(doc)} // Или поменяй название пропса на onSchedule, если хочешь
					/>
				))}
			</div>

			{selectedDoctor && (
				<div className='mt-8 p-6 bg-white rounded-lg shadow-md border-t'>
					<h3 className='text-xl font-bold mb-4'>
						Расписание для {selectedDoctor.name}
					</h3>
					<form onSubmit={handleScheduleSubmit} className='space-y-4 max-w-md'>
						<input
							type='date'
							value={scheduleDate}
							onChange={e => setScheduleDate(e.target.value)}
							className='border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
							required
						/>
						<input
							type='text'
							placeholder='Часы через запятую (напр. 09:00,10:00,14:00)'
							value={timeSlots}
							onChange={e => setTimeSlots(e.target.value)}
							className='border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
							required
						/>
						<button
							type='submit'
							className='bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 transition'
						>
							Сохранить
						</button>
					</form>
				</div>
			)}
		</Layout>
	)
}

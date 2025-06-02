import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8085/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = data => API.post('/auth/login', data);
export const registerUser = data => API.post('/auth/register', data);

export const fetchDoctors = () => API.get('/doctors');
export const fetchDoctorSchedule = (id, date) =>
  API.get(`/doctors/${id}/schedule`, { params: { date } });

export const bookAppointment = data => API.post('/appointments', data);

export default API;

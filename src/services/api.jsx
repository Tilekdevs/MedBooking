import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8085', 
});

export default API;
const API_BASE = 'http://localhost:8085';

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.text();
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.text();
}

export async function fetchDoctors() {
  const res = await fetch(`${API_BASE}/doctors`);
  return res.json();
}

export async function fetchDoctorSchedule(id, date) {
  const res = await fetch(`${API_BASE}/doctors/${id}/schedule?date=${date}`);
  return res.json();
}
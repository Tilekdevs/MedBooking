import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // замените на ваш бекенд URL
});

export default API;

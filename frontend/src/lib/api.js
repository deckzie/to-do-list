import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false, // set true if you add Sanctum later
});

export default api;

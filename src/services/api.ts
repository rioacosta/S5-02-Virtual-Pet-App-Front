// api.ts
import axios from 'axios';

const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL});

// Interceptor para añadir token JWT a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// api.ts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirigir a login
    }
    return Promise.reject(error);
  }
);
// authService.ts
import api from './api';

export const login = async (credentials: { username: string; password: string }) => {
  const response = await api.post('/auth/signin', credentials);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token); // Guardar token
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
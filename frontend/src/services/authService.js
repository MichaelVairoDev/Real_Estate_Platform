import api from './api';

const API_URL = '/auth';

// Registrar usuario
const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Iniciar sesión
const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Obtener perfil de usuario
const getProfile = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
};

// Actualizar perfil de usuario
const updateProfile = async (userData) => {
  const response = await api.put(`${API_URL}/profile`, userData);
  return response.data;
};

// Actualizar contraseña
const updatePassword = async (passwordData) => {
  const response = await api.put(`${API_URL}/password`, passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
};

export default authService; 
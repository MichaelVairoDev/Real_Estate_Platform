import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
      return Promise.reject({ message: 'No se pudo conectar con el servidor' });
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
      return Promise.reject({ message: 'Error al realizar la petición' });
    }
  }
);

export default api; 
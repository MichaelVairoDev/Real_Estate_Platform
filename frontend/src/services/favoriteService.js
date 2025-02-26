import api from './api';

// Obtener favoritos del usuario
const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data;
};

// Añadir a favoritos
const addToFavorites = async (propertyId) => {
  const response = await api.post(`/favorites/${propertyId}`);
  return response.data;
};

// Eliminar de favoritos
const removeFromFavorites = async (propertyId) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};

const favoriteService = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
};

export default favoriteService; 
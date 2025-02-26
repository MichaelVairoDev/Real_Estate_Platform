import api from './api';

// Obtener todas las propiedades
const getProperties = async (params = {}) => {
  const { page = 1, limit = 10 } = params;
  const response = await api.get(`/properties?page=${page}&limit=${limit}`);
  return response.data;
};

// Obtener una propiedad por ID
const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

// Buscar propiedades
const searchProperties = async (searchParams) => {
  const response = await api.post('/properties/search', searchParams);
  return response.data;
};

// Crear una propiedad
const createProperty = async (propertyData, token) => {
  const formData = new FormData();
  
  // Añadir datos de texto
  Object.keys(propertyData).forEach(key => {
    if (key !== 'images' && key !== 'features') {
      formData.append(key, propertyData[key]);
    }
  });
  
  // Añadir características como array
  if (propertyData.features && propertyData.features.length > 0) {
    propertyData.features.forEach(feature => {
      formData.append('features', feature);
    });
  }
  
  // Añadir imágenes
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach(image => {
      formData.append('images', image);
    });
  }

  const response = await api.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Actualizar una propiedad
const updateProperty = async (id, propertyData, token) => {
  const formData = new FormData();
  
  // Añadir datos de texto
  Object.keys(propertyData).forEach(key => {
    if (key !== 'images' && key !== 'features') {
      formData.append(key, propertyData[key]);
    }
  });
  
  // Añadir características como array
  if (propertyData.features && propertyData.features.length > 0) {
    propertyData.features.forEach(feature => {
      formData.append('features', feature);
    });
  }
  
  // Añadir imágenes
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach(image => {
      formData.append('images', image);
    });
  }

  const response = await api.put(`/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Eliminar una propiedad
const deleteProperty = async (id, token) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

const propertyService = {
  getProperties,
  getPropertyById,
  searchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};

export default propertyService; 
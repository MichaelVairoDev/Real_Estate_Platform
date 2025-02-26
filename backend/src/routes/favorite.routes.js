const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Todas las rutas de favoritos requieren autenticación
router.use(authenticate);

// Obtener favoritos del usuario autenticado
router.get('/', favoriteController.getUserFavorites);

// Añadir propiedad a favoritos
router.post('/:propertyId', favoriteController.addToFavorites);

// Eliminar propiedad de favoritos
router.delete('/:propertyId', favoriteController.removeFromFavorites);

module.exports = router; 
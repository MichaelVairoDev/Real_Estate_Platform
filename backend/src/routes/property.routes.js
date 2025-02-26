const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authenticate, authorize, checkOwnership } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Rutas públicas
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/search', propertyController.searchProperties);

// Rutas protegidas - requieren autenticación
router.use(authenticate);

// Crear una propiedad (agentes y admin)
router.post(
  '/',
  authorize(['AGENT', 'ADMIN']),
  upload.array('images', 10),
  propertyController.createProperty
);

// Actualizar una propiedad (solo propietario o admin)
router.put(
  '/:id',
  checkOwnership('property'),
  upload.array('images', 10),
  propertyController.updateProperty
);

// Eliminar una propiedad (solo propietario o admin)
router.delete(
  '/:id',
  checkOwnership('property'),
  propertyController.deleteProperty
);

module.exports = router; 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Obtener todos los usuarios (solo admin)
router.get('/', authenticate, authorize(['ADMIN']), userController.getAllUsers);

// Obtener un usuario por ID (autenticado o admin)
router.get('/:id', authenticate, userController.getUserById);

// Actualizar un usuario (solo el propio usuario o admin)
router.put('/:id', authenticate, userController.checkUserAccess, userController.updateUser);

// Eliminar un usuario (solo el propio usuario o admin)
router.delete('/:id', authenticate, userController.checkUserAccess, userController.deleteUser);

// Obtener agentes inmobiliarios
router.get('/agents/all', userController.getAllAgents);

module.exports = router; 
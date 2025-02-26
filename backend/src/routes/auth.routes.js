const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Registro de usuario
router.post('/register', authController.register);

// Inicio de sesión
router.post('/login', authController.login);

// Obtener usuario actual
router.get('/me', authenticate, authController.getMe);

// Actualizar contraseña
router.put('/password', authenticate, authController.updatePassword);

module.exports = router; 
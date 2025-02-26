const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Todas las rutas de mensajes requieren autenticación
router.use(authenticate);

// Obtener mensajes del usuario autenticado
router.get('/user', messageController.getUserMessages);

// Obtener mensajes para un agente (solo agentes y admin)
router.get(
  '/agent',
  authorize(['AGENT', 'ADMIN']),
  messageController.getAgentMessages
);

// Enviar un mensaje a un agente sobre una propiedad
router.post(
  '/:propertyId/:agentId',
  messageController.sendMessage
);

// Responder a un mensaje
router.post(
  '/reply/:messageId',
  messageController.replyToMessage
);

// Eliminar un mensaje
router.delete(
  '/:messageId',
  messageController.deleteMessage
);

module.exports = router; 
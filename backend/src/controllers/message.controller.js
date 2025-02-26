const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Esquema de validación para mensajes
const messageSchema = Joi.object({
  content: Joi.string().required().min(5).max(1000)
});

/**
 * Obtener mensajes del usuario autenticado
 */
const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        senderId: userId
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            images: {
              take: 1
            }
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

/**
 * Obtener mensajes para un agente
 */
const getAgentMessages = async (req, res) => {
  try {
    const agentId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        agentId
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            images: {
              take: 1
            }
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

/**
 * Enviar un mensaje a un agente sobre una propiedad
 */
const sendMessage = async (req, res) => {
  try {
    const { propertyId, agentId } = req.params;
    const senderId = req.user.id;

    // Validar datos de entrada
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar si el agente existe
    const agent = await prisma.user.findFirst({
      where: {
        id: agentId,
        role: 'AGENT'
      }
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agente no encontrado' });
    }

    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        content: value.content,
        property: {
          connect: { id: propertyId }
        },
        sender: {
          connect: { id: senderId }
        },
        agent: {
          connect: { id: agentId }
        }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      data: message
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
};

/**
 * Responder a un mensaje
 */
const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Validar datos de entrada
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verificar si el mensaje existe
    const originalMessage = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        property: true
      }
    });

    if (!originalMessage) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    // Verificar permisos (solo el agente o el remitente original pueden responder)
    if (userId !== originalMessage.agentId && userId !== originalMessage.senderId) {
      return res.status(403).json({ message: 'No tiene permiso para responder a este mensaje' });
    }

    // Determinar remitente y destinatario para la respuesta
    let senderId, agentId;
    if (userId === originalMessage.agentId) {
      // El agente está respondiendo
      senderId = originalMessage.agentId;
      agentId = originalMessage.agentId; // El agente sigue siendo el mismo
    } else {
      // El usuario está respondiendo
      senderId = originalMessage.senderId;
      agentId = originalMessage.agentId;
    }

    // Crear mensaje de respuesta
    const reply = await prisma.message.create({
      data: {
        content: value.content,
        property: {
          connect: { id: originalMessage.propertyId }
        },
        sender: {
          connect: { id: senderId }
        },
        agent: {
          connect: { id: agentId }
        }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Respuesta enviada exitosamente',
      data: reply
    });
  } catch (error) {
    console.error('Error al responder mensaje:', error);
    res.status(500).json({ message: 'Error al responder mensaje' });
  }
};

/**
 * Eliminar un mensaje
 */
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Verificar si el mensaje existe
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    // Verificar permisos (solo el propietario del mensaje o admin pueden eliminar)
    if (userId !== message.senderId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'No tiene permiso para eliminar este mensaje' });
    }

    // Eliminar mensaje
    await prisma.message.delete({
      where: { id: messageId }
    });

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ message: 'Error al eliminar mensaje' });
  }
};

module.exports = {
  getUserMessages,
  getAgentMessages,
  sendMessage,
  replyToMessage,
  deleteMessage
}; 
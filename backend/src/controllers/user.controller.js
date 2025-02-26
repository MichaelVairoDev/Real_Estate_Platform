const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Esquema de validación para actualizar usuario
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  phone: Joi.string().allow(''),
  role: Joi.string().valid('USER', 'AGENT', 'ADMIN')
});

/**
 * Obtener todos los usuarios (solo admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

/**
 * Obtener un usuario por ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        properties: {
          include: {
            images: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar permisos: solo el propio usuario o un admin puede ver detalles completos
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      // Si es otro usuario, devolver información limitada
      const { properties, ...publicUserInfo } = user;
      return res.json(publicUserInfo);
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

/**
 * Actualizar un usuario
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar datos de entrada
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Solo un admin puede cambiar el rol
    if (value.role && req.user.role !== 'ADMIN') {
      delete value.role;
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: value,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

/**
 * Eliminar un usuario
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar usuario
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

/**
 * Obtener todos los agentes inmobiliarios
 */
const getAllAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'AGENT' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        properties: {
          include: {
            images: true
          }
        }
      }
    });

    res.json(agents);
  } catch (error) {
    console.error('Error al obtener agentes:', error);
    res.status(500).json({ message: 'Error al obtener agentes inmobiliarios' });
  }
};

/**
 * Middleware para verificar acceso a un usuario
 */
const checkUserAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Los administradores pueden editar cualquier usuario
    if (userRole === 'ADMIN') {
      return next();
    }

    // Los usuarios solo pueden editar su propio perfil
    if (id !== userId) {
      return res.status(403).json({ message: 'No tiene permiso para modificar este usuario' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar acceso:', error);
    res.status(500).json({ message: 'Error al verificar acceso' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllAgents,
  checkUserAccess
}; 
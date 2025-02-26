const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para verificar si el usuario está autenticado
 */
const authenticate = async (req, res, next) => {
  try {
    // Verificar si existe el token en los headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado. Token no proporcionado' });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'No autorizado. Usuario no encontrado' });
    }

    // Añadir el usuario al objeto request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'No autorizado. Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'No autorizado. Token inválido' });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {Array} roles - Array de roles permitidos
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado. Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Prohibido. No tiene permisos suficientes' });
    }

    next();
  };
};

/**
 * Middleware para verificar propiedad de un recurso
 * @param {string} resourceType - Tipo de recurso ('property', 'message', etc.)
 */
const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Si es admin, permitir acceso
      if (req.user.role === 'ADMIN') {
        return next();
      }

      let resource;
      switch (resourceType) {
        case 'property':
          resource = await prisma.property.findUnique({
            where: { id }
          });
          break;
        case 'message':
          resource = await prisma.message.findUnique({
            where: { id }
          });
          break;
        default:
          return res.status(400).json({ message: 'Tipo de recurso no válido' });
      }

      if (!resource) {
        return res.status(404).json({ message: 'Recurso no encontrado' });
      }

      // Verificar propiedad
      const isOwner = resource.ownerId === userId || 
                     (resourceType === 'message' && (resource.senderId === userId || resource.agentId === userId));

      if (!isOwner) {
        return res.status(403).json({ message: 'No tiene permiso para acceder a este recurso' });
      }

      next();
    } catch (error) {
      console.error('Error al verificar propiedad:', error);
      res.status(500).json({ message: 'Error al verificar propiedad del recurso' });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  checkOwnership
}; 
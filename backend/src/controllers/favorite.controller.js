const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtener favoritos del usuario autenticado
 */
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          include: {
            images: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

/**
 * Añadir propiedad a favoritos
 */
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await prisma.user.findFirst({
      where: {
        id: userId,
        favorites: {
          some: {
            id: propertyId
          }
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'La propiedad ya está en favoritos' });
    }

    // Añadir a favoritos
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: propertyId }
        }
      }
    });

    res.json({ message: 'Propiedad añadida a favoritos exitosamente' });
  } catch (error) {
    console.error('Error al añadir a favoritos:', error);
    res.status(500).json({ message: 'Error al añadir a favoritos' });
  }
};

/**
 * Eliminar propiedad de favoritos
 */
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar si está en favoritos
    const existingFavorite = await prisma.user.findFirst({
      where: {
        id: userId,
        favorites: {
          some: {
            id: propertyId
          }
        }
      }
    });

    if (!existingFavorite) {
      return res.status(400).json({ message: 'La propiedad no está en favoritos' });
    }

    // Eliminar de favoritos
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          disconnect: { id: propertyId }
        }
      }
    });

    res.json({ message: 'Propiedad eliminada de favoritos exitosamente' });
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    res.status(500).json({ message: 'Error al eliminar de favoritos' });
  }
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
}; 
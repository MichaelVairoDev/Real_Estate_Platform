const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Esquema de validación para crear/actualizar propiedad
const propertySchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(20),
  price: Joi.number().required().positive(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  latitude: Joi.number().allow(null),
  longitude: Joi.number().allow(null),
  bedrooms: Joi.number().required().integer().min(0),
  bathrooms: Joi.number().required().integer().min(0),
  area: Joi.number().required().positive(),
  yearBuilt: Joi.number().integer().allow(null),
  propertyType: Joi.string().valid(
    'HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OTHER'
  ).required(),
  status: Joi.string().valid('ACTIVE', 'PENDING', 'SOLD', 'RENTED').default('ACTIVE'),
  features: Joi.array().items(Joi.string()),
  tour3D: Joi.string().allow(null, '')
});

// Esquema de validación para búsqueda
const searchSchema = Joi.object({
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  minBedrooms: Joi.number().integer().min(0),
  maxBedrooms: Joi.number().integer().min(0),
  minBathrooms: Joi.number().integer().min(0),
  maxBathrooms: Joi.number().integer().min(0),
  minArea: Joi.number().min(0),
  maxArea: Joi.number().min(0),
  propertyType: Joi.string().valid(
    'HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OTHER'
  ),
  status: Joi.string().valid('ACTIVE', 'PENDING', 'SOLD', 'RENTED'),
  features: Joi.array().items(Joi.string()),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid('price', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

/**
 * Obtener todas las propiedades con paginación
 */
const getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await prisma.property.findMany({
      skip,
      take: limit,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.property.count();

    res.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};

/**
 * Obtener una propiedad por ID
 */
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
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
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error al obtener propiedad:', error);
    res.status(500).json({ message: 'Error al obtener propiedad' });
  }
};

/**
 * Crear una nueva propiedad
 */
const createProperty = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Procesar imágenes si existen
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/${file.filename}`);
      });
    }

    // Crear propiedad
    const property = await prisma.property.create({
      data: {
        ...value,
        ownerId: req.user.id,
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
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
    });

    res.status(201).json({
      message: 'Propiedad creada exitosamente',
      property
    });
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ message: 'Error al crear propiedad' });
  }
};

/**
 * Actualizar una propiedad
 */
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar datos de entrada
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Procesar imágenes si existen
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/${file.filename}`);
      });
    }

    // Actualizar propiedad
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...value,
        ...(imageUrls.length > 0 && {
          images: {
            create: imageUrls.map(url => ({ url }))
          }
        })
      },
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
    });

    res.json({
      message: 'Propiedad actualizada exitosamente',
      property
    });
  } catch (error) {
    console.error('Error al actualizar propiedad:', error);
    res.status(500).json({ message: 'Error al actualizar propiedad' });
  }
};

/**
 * Eliminar una propiedad
 */
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener imágenes para eliminarlas del sistema de archivos
    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Eliminar imágenes del sistema de archivos
    property.images.forEach(image => {
      const imagePath = path.join(__dirname, '../../', image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    // Eliminar propiedad (las imágenes se eliminarán en cascada)
    await prisma.property.delete({
      where: { id }
    });

    res.json({ message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    res.status(500).json({ message: 'Error al eliminar propiedad' });
  }
};

/**
 * Buscar propiedades por filtros
 */
const searchProperties = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = searchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      city, state, country, minPrice, maxPrice, minBedrooms, maxBedrooms,
      minBathrooms, maxBathrooms, minArea, maxArea, propertyType, status,
      features, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'
    } = value;

    // Construir filtros
    const where = {};

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }
    
    if (minBedrooms !== undefined || maxBedrooms !== undefined) {
      where.bedrooms = {};
      if (minBedrooms !== undefined) where.bedrooms.gte = Number(minBedrooms);
      if (maxBedrooms !== undefined) where.bedrooms.lte = Number(maxBedrooms);
    }
    
    if (minBathrooms !== undefined || maxBathrooms !== undefined) {
      where.bathrooms = {};
      if (minBathrooms !== undefined) where.bathrooms.gte = Number(minBathrooms);
      if (maxBathrooms !== undefined) where.bathrooms.lte = Number(maxBathrooms);
    }
    
    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {};
      if (minArea !== undefined) where.area.gte = Number(minArea);
      if (maxArea !== undefined) where.area.lte = Number(maxArea);
    }
    
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    
    if (features && features.length > 0) {
      where.features = { hasEvery: features };
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Ejecutar consulta
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
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
        },
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al buscar propiedades:', error);
    res.status(500).json({ message: 'Error al buscar propiedades' });
  }
};

/**
 * Middleware para verificar propiedad de una propiedad
 */
const checkPropertyOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Los administradores pueden editar cualquier propiedad
    if (userRole === 'ADMIN') {
      return next();
    }

    // Verificar si la propiedad existe y pertenece al usuario
    const property = await prisma.property.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Los agentes pueden editar sus propias propiedades
    if (property.ownerId !== userId) {
      return res.status(403).json({ message: 'No tiene permiso para modificar esta propiedad' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar propiedad:', error);
    res.status(500).json({ message: 'Error al verificar propiedad' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  checkPropertyOwnership
}; 
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const prisma = new PrismaClient();

// Esquema de validación para registro
const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phone: Joi.string().allow(''),
  role: Joi.string().valid('USER', 'AGENT').default('USER')
});

// Esquema de validación para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Esquema de validación para actualizar contraseña
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6)
});

/**
 * Registrar un nuevo usuario
 */
const register = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, phone, role } = value;

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role
      }
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Responder sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

/**
 * Iniciar sesión
 */
const login = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Responder sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

/**
 * Obtener usuario actual
 */
const getMe = async (req, res) => {
  try {
    // El usuario ya está en req.user gracias al middleware de autenticación
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};

/**
 * Actualizar contraseña
 */
const updatePassword = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = updatePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { currentPassword, newPassword } = value;
    const userId = req.user.id;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar contraseña' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword
}; 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const userRoutes = require('./routes/user.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const messageRoutes = require('./routes/message.routes');

// Inicializar Prisma
const prisma = new PrismaClient();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', process.env.CORS_ORIGIN].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Real Estate Platform funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de cierre limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor y conexiones DB');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = { app, prisma }; 
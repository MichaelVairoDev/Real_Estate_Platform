# Real Estate Platform 🏢

## 📝 Descripción

Una plataforma inmobiliaria completa que permite a los usuarios buscar, filtrar y visualizar propiedades inmobiliarias con características avanzadas como búsqueda por ubicación, precio y amenidades. Incluye tours virtuales en 3D, sistema de favoritos, contacto con agentes inmobiliarios y panel de administración.

## 📸 Capturas de Pantalla

### 🏠 Página Principal
![Página Principal](/screenshots/home.png)
_Vista del catálogo principal con propiedades destacadas y búsqueda_

### 🏘️ Detalles de Propiedad
![Detalle de Propiedad](/screenshots/property.png)
_Vista detallada de una propiedad con tour virtual_

### 📝 Listado de Propiedades
![Listado de Propiedades](/screenshots/properties.png)
_Listado de propiedades con filtros y búsqueda_

### 💼 Zona Perfil de Agente o usuario
![Perfil](/screenshots/perfil.png)
_Panel de control de perfil de usuario o agente_

## 🚀 Tecnologías Utilizadas

### Frontend:
- React con Material-UI
- Redux Toolkit para gestión de estado
- Framer Motion para animaciones
- Three.js para tours virtuales 3D
- React Hook Form para formularios
- Leaflet para mapas interactivos

### Backend:
- Node.js con Express
- Prisma ORM
- JWT para autenticación
- Multer para carga de imágenes

### Base de datos:
- PostgreSQL

### DevOps:
- Docker y Docker Compose
- GitHub Actions para CI/CD

## 🛠️ Requisitos Previos

- Node.js 18.x o superior
- Docker 20.x o superior
- NPM o Yarn
- PostgreSQL (si se ejecuta localmente)

## ⚙️ Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/yourusername/real-estate-platform.git
cd real-estate-platform
```

2. **Configurar variables de entorno**

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Backend (.env):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/real_estate
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Iniciar el Proyecto

### Con Docker (Recomendado)

1. **Construir y levantar los contenedores**
```bash
# Iniciar todos los servicios
docker compose up -d

# Detener todos los servicios
docker compose down

# Reiniciar con limpieza completa
docker compose down -v && docker system prune -af && docker compose up -d --build
```

### Desarrollo Local

1. **Iniciar Backend**
```bash
cd backend
npm install
npm run dev
```

2. **Iniciar Frontend**
```bash
cd frontend
npm install
npm start
```

## 📊 Estructura de Datos

El proyecto utiliza PostgreSQL con Prisma ORM, incluyendo los siguientes modelos principales:

- 👤 Users (ADMIN, AGENT, USER)
- 🏠 Properties
- 📸 Images
- ❤️ Favorites
- 💬 Messages

## 🗂️ Estructura del Proyecto

```
real-estate-platform/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🔍 Características Principales

- 🏠 Catálogo de propiedades con filtros avanzados
- 🗺️ Búsqueda por ubicación con mapa interactivo
- 🏛️ Tours virtuales en 3D
- ❤️ Sistema de favoritos
- 💬 Mensajería entre usuarios y agentes
- 📱 Diseño responsive
- 🌙 Modo oscuro/claro
- 📊 Panel de administración

## 📝 API Endpoints

### Autenticación
- POST /api/auth/register - Registro de usuario
- POST /api/auth/login - Inicio de sesión
- GET /api/auth/me - Obtener usuario actual

### Propiedades
- GET /api/properties - Listar propiedades con filtros
- GET /api/properties/:id - Obtener detalles de propiedad
- POST /api/properties - Crear propiedad (admin/agente)
- PUT /api/properties/:id - Actualizar propiedad
- DELETE /api/properties/:id - Eliminar propiedad

### Favoritos
- GET /api/favorites - Listar favoritos del usuario
- POST /api/favorites/:propertyId - Añadir a favoritos
- DELETE /api/favorites/:propertyId - Eliminar de favoritos

### Mensajes
- GET /api/messages/user - Obtener mensajes del usuario
- GET /api/messages/agent - Obtener mensajes del agente
- POST /api/messages/:propertyId/:agentId - Enviar mensaje
- POST /api/messages/reply/:messageId - Responder mensaje

## 🔐 Seguridad

- Autenticación mediante JWT
- Roles de usuario (ADMIN, AGENT, USER)
- Middleware de autorización por ruta
- Validación de datos en frontend y backend
- Sanitización de entradas
- CORS configurado

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio.

---

⌨️ con ❤️ por [Michael Vairo]

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpiar la base de datos
    await prisma.image.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    console.log('Base de datos limpiada');

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Usuario administrador creado');

    // Crear agente inmobiliario
    const agentPassword = await bcrypt.hash('agent123', 10);
    const agent = await prisma.user.create({
      data: {
        name: 'Juan Agente',
        email: 'agent@example.com',
        password: agentPassword,
        role: 'AGENT',
        phone: '+51 999 888 777',
      },
    });

    console.log('Usuario agente creado');

    // Propiedades de ejemplo
    const properties = [
      {
        title: 'Ático de lujo con terraza en Miraflores',
        description: 'Espectacular ático con vistas panorámicas al mar, terraza de 50m² y acabados de alta calidad. Incluye 2 estacionamientos y depósito.',
        price: 1450000,
        address: 'Malecón de la Reserva 123',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15074',
        country: 'Perú',
        latitude: -12.1219,
        longitude: -77.0474,
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        yearBuilt: 2020,
        propertyType: 'APARTMENT',
        status: 'ACTIVE',
        features: ['Terraza', 'Estacionamiento', 'Ascensor', 'Aire acondicionado'],
        ownerId: agent.id,
      },
      {
        title: 'Casa de playa en Asia',
        description: 'Lujosa casa con piscina privada, jardín y vistas al mar. Diseño moderno y materiales de primera calidad.',
        price: 2850000,
        address: 'Boulevard Asia km 97.5',
        city: 'Asia',
        state: 'Lima',
        zipCode: '15711',
        country: 'Perú',
        latitude: -12.7947,
        longitude: -76.6053,
        bedrooms: 4,
        bathrooms: 3,
        area: 300,
        yearBuilt: 2019,
        propertyType: 'HOUSE',
        status: 'ACTIVE',
        features: ['Piscina', 'Jardín', 'Estacionamiento', 'Seguridad', 'Aire acondicionado'],
        ownerId: agent.id,
      },
      {
        title: 'Departamento céntrico en San Isidro',
        description: 'Departamento totalmente remodelado en el corazón financiero. Ideal para ejecutivos o inversores.',
        price: 720000,
        address: 'Calle Las Begonias 150',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15046',
        country: 'Perú',
        latitude: -12.0933,
        longitude: -77.0244,
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        yearBuilt: 1995,
        propertyType: 'APARTMENT',
        status: 'ACTIVE',
        features: ['Ascensor', 'Aire acondicionado', 'Amueblado'],
        ownerId: agent.id,
      },
      {
        title: 'Casa en La Molina',
        description: 'Amplia casa en zona residencial exclusiva. Perfecta para familias.',
        price: 1385000,
        address: 'Calle Los Eucaliptos 215',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15026',
        country: 'Perú',
        latitude: -12.0867,
        longitude: -76.9286,
        bedrooms: 4,
        bathrooms: 2,
        area: 180,
        yearBuilt: 2015,
        propertyType: 'HOUSE',
        status: 'ACTIVE',
        features: ['Jardín', 'Estacionamiento', 'Aire acondicionado'],
        ownerId: agent.id,
      },
      {
        title: 'Local comercial en San Isidro',
        description: 'Local comercial a pie de calle en zona empresarial. Excelente oportunidad de inversión.',
        price: 895000,
        address: 'Av. Javier Prado Este 456',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15046',
        country: 'Perú',
        latitude: -12.0933,
        longitude: -77.0244,
        bedrooms: 0,
        bathrooms: 1,
        area: 120,
        yearBuilt: 2000,
        propertyType: 'COMMERCIAL',
        status: 'ACTIVE',
        features: ['Aire acondicionado', 'Seguridad'],
        ownerId: agent.id,
      },
      {
        title: 'Departamento cerca a UNMSM',
        description: 'Departamento ideal para estudiantes, completamente amueblado y equipado. Cerca de todas las facultades.',
        price: 385000,
        address: 'Av. Venezuela 1234',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15081',
        country: 'Perú',
        latitude: -12.0558,
        longitude: -77.0844,
        bedrooms: 3,
        bathrooms: 1,
        area: 90,
        yearBuilt: 1985,
        propertyType: 'APARTMENT',
        status: 'ACTIVE',
        features: ['Amueblado', 'Aire acondicionado'],
        ownerId: agent.id,
      },
      {
        title: 'Terreno en Pachacámac',
        description: 'Terreno con hermosa vista. Ideal para construir casa de campo.',
        price: 480000,
        address: 'Valle de Pachacámac',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15823',
        country: 'Perú',
        latitude: -12.2271,
        longitude: -76.8673,
        bedrooms: 0,
        bathrooms: 0,
        area: 800,
        yearBuilt: null,
        propertyType: 'LAND',
        status: 'ACTIVE',
        features: [],
        ownerId: agent.id,
      },
      {
        title: 'Penthouse en San Borja',
        description: 'Magnífico penthouse con amplias terrazas y vistas espectaculares. Zona residencial exclusiva.',
        price: 1550000,
        address: 'Av. San Borja Sur 890',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15036',
        country: 'Perú',
        latitude: -12.1089,
        longitude: -76.9989,
        bedrooms: 3,
        bathrooms: 2,
        area: 160,
        yearBuilt: 2018,
        propertyType: 'APARTMENT',
        status: 'ACTIVE',
        features: ['Terraza', 'Estacionamiento', 'Ascensor', 'Aire acondicionado', 'Seguridad'],
        ownerId: agent.id,
      },
      {
        title: 'Casa de campo en Cieneguilla',
        description: 'Encantadora casa de campo con huerto y árboles frutales. Ideal para amantes de la naturaleza.',
        price: 645000,
        address: 'Valle de Cieneguilla km 5',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15823',
        country: 'Perú',
        latitude: -12.1156,
        longitude: -76.7664,
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        yearBuilt: 1990,
        propertyType: 'HOUSE',
        status: 'ACTIVE',
        features: ['Jardín', 'Estacionamiento'],
        ownerId: agent.id,
      },
      {
        title: 'Oficina moderna en San Isidro',
        description: 'Oficina implementada con acabados de lujo en el corazón financiero.',
        price: 920000,
        address: 'Av. República de Panamá 3220',
        city: 'Lima',
        state: 'Lima',
        zipCode: '15047',
        country: 'Perú',
        latitude: -12.0933,
        longitude: -77.0244,
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        yearBuilt: 2010,
        propertyType: 'COMMERCIAL',
        status: 'ACTIVE',
        features: ['Aire acondicionado', 'Seguridad', 'Ascensor'],
        ownerId: agent.id,
      }
    ];

    // Insertar propiedades
    for (const property of properties) {
      await prisma.property.create({
        data: {
          ...property,
          images: {
            create: [
              { url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}` },
              { url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}` },
              { url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}` }
            ]
          }
        }
      });
    }

    console.log('Propiedades creadas');
    console.log('Base de datos poblada con éxito');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Error en el script de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
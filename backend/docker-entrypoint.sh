#!/bin/sh
set -e

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté lista..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Base de datos lista"

# Ejecutar migraciones
echo "Ejecutando migraciones..."
npx prisma migrate reset --force

# Ejecutar seed
echo "Poblando la base de datos..."
node prisma/seed.js

# Iniciar la aplicación
echo "Iniciando la aplicación..."
npm start 
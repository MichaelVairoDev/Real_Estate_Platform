FROM node:18-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache openssl libc6-compat netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# Dar permisos de ejecución al script de entrada
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000

# Usar el script de entrada como comando principal
CMD ["./docker-entrypoint.sh"] 
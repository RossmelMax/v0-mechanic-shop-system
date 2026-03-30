#!/bin/bash

# Script de configuración inicial de la base de datos

echo "🔧 Inicializando base de datos del taller mecánico..."

# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init

echo "✅ Base de datos configurada correctamente"
echo "📦 Próximo paso: npm run dev"

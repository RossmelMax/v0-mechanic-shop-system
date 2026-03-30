# Inicio Rápido - Sistema de Gestión de Taller Mecánico

## 3 Pasos Simples para Empezar

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Base de Datos (Esto crea la BD y carga datos de ejemplo)
```bash
npm run setup
```

### 3️⃣ Ejecutar la Aplicación
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ¿Listo para Usar?

La aplicación viene con:
- ✅ 2 clientes de ejemplo (Juan García y María López)
- ✅ 5 fallas comunes pre-registradas
- ✅ 7 productos en inventario
- ✅ Base de datos SQLite local (archivo `dev.db`)

## Flujo de Uso Recomendado

1. **Clientes** → Agrega tu base de clientes
2. **Productos** → Configura tu inventario
3. **Cotizaciones** → Crea una cotización para un cliente
4. **Base de Fallas** → Busca fallas para diagnosticar vehículos
5. **Órdenes** → Convierte cotizaciones aceptadas en órdenes

## Comandos Útiles

```bash
# Ver logs en tiempo real
npm run dev

# Resetear base de datos (cuidado!)
npm run prisma:migrate reset

# Solo seed (sin migración)
npm run prisma:seed

# Build para producción
npm run build
```

## Solución de Problemas

**Error: Database not found**
```bash
npm run setup
```

**Error: Cannot find module '@prisma/client'**
```bash
npm install
npm run prisma:generate
```

**Quiero limpiar todo y empezar de nuevo**
```bash
rm dev.db
npm run setup
```

---

## Documentación Completa

Ver [README.md](./README.md) para más detalles sobre arquitectura, tablas de base de datos, y características avanzadas.

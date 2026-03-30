# Sistema de Gestión para Taller Mecánico - Setup

## Instalación y Configuración

Sigue estos pasos para configurar el proyecto:

### 1. Instalar dependencias
```bash
npm install
# o
pnpm install
```

### 2. Configurar la base de datos
```bash
npm run prisma:migrate
```

Este comando creará la base de datos SQLite local (`dev.db`) y todas las tablas necesarias.

### 3. Poblar datos iniciales (opcional)
```bash
npm run prisma:seed
```

Este comando carga datos de ejemplo incluyendo:
- 2 clientes de ejemplo
- 7 productos en el inventario
- 5 fallas comunes en la base de datos de jurisprudencia

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura de la Base de Datos

El sistema incluye 10 tablas principales:

- **Client**: Información de clientes
- **Vehicle**: Datos de vehículos
- **Quotation**: Cotizaciones / Presupuestos
- **Diagnostic**: Diagnósticos vinculados a cotizaciones
- **FaultDatabase**: Base de fallas (jurisprudencia)
- **WorkOrder**: Órdenes de trabajo
- **Product**: Inventario de productos
- **OrderItem**: Ítems en órdenes de trabajo
- **QuotationItem**: Ítems en cotizaciones
- **StockMovement**: Registro de movimientos de inventario
- **Sale**: Ventas y facturación

## Características Principales

### 1. Gestión de Clientes y Vehículos
- Registrar clientes con información de contacto
- Asociar múltiples vehículos a cada cliente
- Incluye marca, modelo, año, placa y tipo de vehículo

### 2. Sistema de Cotizaciones
- Crear cotizaciones vinculadas a cliente y vehículo
- Estados: PENDING, IN_DIAGNOSIS, QUOTED, ACCEPTED, REJECTED, CONVERTED_TO_ORDER
- Adjuntar diagnósticos y detalles de fallas

### 3. Diagnóstico Avanzado
- Soporte para autos con computadora (lectura de códigos DTC)
- Registrar diagnósticos manuales con descripción detallada
- Vincular fallas a la base de datos de jurisprudencia

### 4. Base de Fallas (Jurisprudencia)
- Base de datos centralizada de fallas comunes
- Búsqueda full-text por título, síntomas y palabras clave
- Información de soluciones, tiempo estimado y costo
- Imágenes y videos de referencia

### 5. Órdenes de Trabajo
- Convertir cotizaciones aceptadas en órdenes
- Seguimiento de estado: PENDING, IN_PROGRESS, COMPLETED, DELIVERED
- Asociar productos y servicios
- Registrar mecánico responsable

### 6. Inventario
- Gestionar productos y repuestos
- Registrar movimientos de stock
- Alertas de stock mínimo

### 7. Ventas y Facturación
- Registrar ventas finales
- Métodos de pago: CASH, CARD, CHECK, TRANSFER
- Control de estado de pago

## Acceso a la Base de Datos

Para ver o modificar datos directamente:
```bash
npx prisma studio
```

Esto abre una interfaz web para gestionar los datos.

## Próximos Pasos

1. Crear el módulo de Clientes
2. Crear el módulo de Vehículos
3. Crear el módulo de Cotizaciones con búsqueda en base de fallas
4. Implementar órdenes de trabajo
5. Crear dashboard y reportes

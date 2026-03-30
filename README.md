# Sistema de Gestión para Taller Mecánico 🔧

Sistema integral de gestión para talleres mecánicos con enfoque en diagnóstico de vehículos y base de fallas (jurisprudencia).

## Características Principales

### 1. **Gestión de Clientes y Vehículos**
- Registro completo de clientes con contacto
- Múltiples vehículos por cliente
- Datos técnicos del vehículo (marca, modelo, año, placa, tipo de motor, etc.)

### 2. **Sistema de Cotizaciones**
- Crear cotizaciones desde clientes y vehículos
- Estados de cotización: PENDING, IN_DIAGNOSIS, QUOTED, ACCEPTED, REJECTED, CONVERTED_TO_ORDER
- Total estimado y seguimiento

### 3. **Diagnóstico Avanzado**
- Soporte para autos con computadora (lectura de códigos DTC)
- Diagnóstico manual detallado para vehículos sin computadora
- Registro de síntomas, sistemas afectados, y análisis detallado
- Vinculación automática a la base de fallas

### 4. **Base de Fallas - El Diferenciador Clave** ⭐
- Base de datos centralizada de fallas comunes
- **Búsqueda full-text avanzada** por:
  - Título y descripción
  - Síntomas específicos
  - Palabras clave
  - Códigos de error (DTC)
  - Sistemas afectados
- Información completa por falla:
  - Causas comunes
  - Proceso de solución paso a paso
  - Tiempo estimado
  - Costo estimado
  - Partes requeridas
  - Herramientas necesarias
  - Imágenes y videos de referencia
  - Enlaces a documentación externa

### 5. **Órdenes de Trabajo**
- Conversión automática de cotizaciones aceptadas
- Estados: PENDING, IN_PROGRESS, COMPLETED, DELIVERED
- Asignación de mecánico
- Seguimiento detallado

### 6. **Inventario de Productos**
- Gestión de repuestos y materiales
- Control de stock (mínimo y máximo)
- Movimientos de inventario
- Categorización de productos

### 7. **Ventas y Facturación**
- Registro de ventas finales
- Métodos de pago: CASH, CARD, CHECK, TRANSFER
- Control de estado de pago
- Generación de facturas

### 8. **Dashboard y Reportes**
- Vista general de estadísticas
- Acceso rápido a funciones principales
- Reportes de actividad

## Stack Tecnológico

- **Frontend**: React 19.2, Next.js 16.2
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: SQLite (local) - escalable a PostgreSQL
- **ORM**: Prisma 5.20
- **Estado**: SWR (caching y sincronización)

## Instalación

### Requisitos
- Node.js 18+ (con npm o pnpm)

### Pasos

1. **Clonar o descargar el proyecto**
```bash
cd taller-mecanico
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar base de datos**
```bash
npm run prisma:migrate
```

Este comando crea la base de datos SQLite local y todas las tablas.

4. **Cargar datos iniciales (opcional)**
```bash
npm run prisma:seed
```

Esto carga 2 clientes de ejemplo, 7 productos, y 5 fallas comunes.

5. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

6. **Acceder a la aplicación**
Abre http://localhost:3000 en tu navegador

## Estructura del Proyecto

```
app/
├── api/                          # Rutas de API
│   ├── clients/                  # APIs de clientes
│   ├── vehicles/                 # APIs de vehículos
│   ├── quotations/               # APIs de cotizaciones
│   ├── diagnostics/              # APIs de diagnósticos
│   ├── faults/                   # APIs de base de fallas
│   └── ...
├── clients/                      # Páginas de clientes
├── quotations/                   # Páginas de cotizaciones
├── faults/                       # Página de base de fallas
├── dashboard/                    # Dashboard principal
└── ...
components/
├── clients/                      # Componentes de clientes
├── quotations/                   # Componentes de cotizaciones
├── faults/                       # Componentes de faults
├── layout/                       # Componentes de layout (sidebar)
└── ui/                          # Componentes shadcn/ui
hooks/
├── use-clients.ts               # Hook para clientes y vehículos
├── use-quotations.ts            # Hook para cotizaciones
└── use-faults.ts                # Hook para búsqueda de fallas
prisma/
├── schema.prisma                # Schema de base de datos
├── seed.ts                      # Script de datos iniciales
└── migrations/                  # Migraciones de base de datos
lib/
├── prisma.ts                    # Cliente Prisma configurado
└── utils.ts                     # Utilidades
```

## Base de Datos

### Tablas Principales

1. **Client** - Información de clientes
2. **Vehicle** - Datos de vehículos
3. **Quotation** - Cotizaciones/presupuestos
4. **Diagnostic** - Diagnósticos vinculados a cotizaciones
5. **FaultDatabase** - Base de fallas (jurisprudencia)
6. **WorkOrder** - Órdenes de trabajo
7. **Product** - Inventario de productos
8. **OrderItem** - Items en órdenes
9. **QuotationItem** - Items en cotizaciones
10. **StockMovement** - Movimientos de inventario
11. **Sale** - Ventas y facturación

## Usar Prisma Studio

Para ver y editar datos directamente en la base de datos:

```bash
npx prisma studio
```

Se abrirá una interfaz web en http://localhost:5555

## Escalado a PostgreSQL

Para cambiar de SQLite a PostgreSQL:

1. Actualizar `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/taller_mecanico"
```

2. Ejecutar migración:
```bash
npm run prisma:migrate
```

## Flujo de Uso Típico

1. **Registrar Cliente** → Ingresar a Clientes → Nueva Cotización
2. **Registrar Vehículo** → Desde el cliente, agregar vehículo
3. **Crear Cotización** → Cliente + Vehículo → Sistema genera número único
4. **Diagnóstico**:
   - Para autos CON computadora: Leer códigos DTC
   - Para autos SIN computadora: Describir síntomas detalladamente
5. **Buscar en Base de Fallas** → Usar búsqueda con síntomas o palabras clave
6. **Estimar Costo** → Con datos de la falla encontrada
7. **Convertir a Orden** → Aceptar cotización = crear orden de trabajo
8. **Ejecutar Trabajo** → Cambiar estado a IN_PROGRESS → COMPLETED
9. **Registrar Venta** → Final del proceso con facturación

## Búsqueda en Base de Fallas

La búsqueda es el corazón del sistema. Busca en:
- **Título**: Nombre de la falla
- **Descripción**: Detalles completos
- **Síntomas**: Qué observó el cliente
- **Palabras clave**: Tags para búsqueda rápida
- **Códigos**: Códigos DTC para autos con computadora
- **Sistemas**: Motor, transmisión, frenos, eléctrica, etc.

### Ejemplo de búsqueda:
- "motor no arranca"
- "ruido detonación"
- "pérdida de refrigerante"
- "P0101" (código de error)
- Sistema: "engine", Severidad: "HIGH"

## Próximas Mejoras

- [ ] Módulo completo de órdenes de trabajo
- [ ] Gestión de inventario avanzada
- [ ] Reportes y gráficas estadísticas
- [ ] Facturación automática
- [ ] Exportación a PDF
- [ ] Backup automático de datos
- [ ] Soporte para múltiples usuarios con roles
- [ ] Sincronización en la nube

## Licencia

Uso interno - Sistema de taller mecánico

## Soporte

Para preguntas o sugerencias sobre el sistema, contacta al equipo de desarrollo.

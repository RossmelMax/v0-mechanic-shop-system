# Propuesta de Reestructuración: Sistema Completo de Taller Mecánico

## Resumen Ejecutivo

Esta propuesta describe una reestructuración completa del sistema de taller mecánico actual, transformándolo de una aplicación básica de visualización de datos a un sistema completo y funcional con autenticación, landing page y flujo de trabajo optimizado. El enfoque es crear una experiencia simple, intuitiva y completa que permita gestionar eficientemente un taller mecánico desde la captación de clientes hasta la facturación.

## Arquitectura General

### Tecnologías Mantendidas y Nuevas

- **Frontend**: Next.js 16 con App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: NextAuth.js (para sign in/sign up)
- **UI Components**: Radix UI + shadcn/ui
- **Formularios**: React Hook Form + Zod
- **Estado**: SWR para data fetching

### Estructura de Carpetas Propuesta

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── clients/
│   │   ├── vehicles/
│   │   ├── orders/
│   │   ├── sales/
│   │   ├── reports/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── vehicles/
│   │   ├── orders/
│   │   ├── sales/
│   │   └── reports/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Landing Page)
├── components/
│   ├── ui/ (shadcn components)
│   ├── auth/
│   ├── dashboard/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── middleware.ts
```

## Flujo de Usuario

### 1. Landing Page (Pública)

- **URL**: `/`
- **Contenido**:
  - Hero section con servicios destacados
  - Sección "Sobre Nosotros"
  - Servicios ofrecidos
  - Testimonios de clientes
  - Contacto rápido
  - Call-to-action: "Acceder al Sistema"
- **Navegación**: Header con botones "Iniciar Sesión" y "Registrarse"

### 2. Autenticación

- **Sign Up**: Formulario simple (email, password, nombre del taller)
- **Sign In**: Login con email/password
- **Protección**: Middleware que redirige usuarios no autenticados al login
- **Roles**: Por ahora, un solo rol de "Administrador" (extensible a futuro)

### 3. Dashboard Principal

- **URL**: `/dashboard`
- **Layout**: Sidebar con navegación, header con usuario y logout
- **Métricas**: Cards con estadísticas clave (clientes activos, órdenes pendientes, ventas del mes)
- **Acceso rápido**: Botones para crear nueva orden, cliente, etc.

### Sistema de Diagnóstico y Sugeridor de Soluciones

Una de las funcionalidades más poderosas del sistema es su **base de datos inteligente de fallas y soluciones**, que actúa como un asistente experto para mecánicos:

#### Características Principales

- **Base de Datos de Fallas**: Catálogo completo de problemas comunes en vehículos
- **Búsqueda Inteligente**: Por síntomas, códigos DTC, sistemas afectados, marcas/modelos
- **Diagnósticos Vinculados**: Cada cotización puede incluir diagnósticos detallados
- **Sugerencias Automáticas**: El sistema propone soluciones basadas en síntomas reportados

#### Funcionalidades del Sugeridor

- **Análisis de Síntomas**: Input de síntomas para encontrar fallas relacionadas
- **Códigos de Error**: Soporte para códigos DTC de computadoras de vehículo
- **Sistemas Afectados**: Filtrado por motor, transmisión, eléctrico, etc.
- **Compatibilidad de Vehículos**: Soporte para diferentes marcas y tipos
- **Proceso Paso a Paso**: Guías detalladas de solución
- **Multimedia**: Imágenes, videos y enlaces a documentación externa

#### Integración en el Flujo

1. **Durante Cotización**: Mecánico puede buscar fallas similares
2. **Diagnóstico**: Vincular síntomas a fallas conocidas
3. **Presupuesto**: Estimar tiempo y costo basado en soluciones previas
4. **Seguimiento**: Registrar soluciones aplicadas para mejorar la base de datos

#### Beneficios

- **Ahorro de Tiempo**: Diagnósticos más rápidos
- **Consistencia**: Soluciones probadas y documentadas
- **Aprendizaje**: Base de conocimiento que crece con cada caso
- **Precisión**: Reducción de errores de diagnóstico

## Funcionalidades Principales

### Gestión de Clientes

- **Crear Cliente**: Formulario con datos personales y contacto
- **Listar Clientes**: Tabla con búsqueda y filtros
- **Editar/Eliminar**: Acciones desde la lista
- **Historial**: Órdenes y ventas asociadas

### Gestión de Vehículos

- **Vincular a Cliente**: Cada vehículo pertenece a un cliente
- **Datos Técnicos**: Marca, modelo, año, placa, VIN, etc.
- **Historial de Servicio**: Órdenes de trabajo realizadas

### Órdenes de Trabajo

- **Crear Orden**: Desde cotización aceptada o directamente
- **Estados**: Pendiente → En Progreso → COMPLETED → Entregada
- **Items**: Productos y servicios utilizados
- **Asignación**: Mecánico responsable
- **Tiempos**: Estimados vs reales

### Cotizaciones

- **Crear Cotización**: Para diagnósticos y presupuestos
- **Estados**: Pendiente → En Diagnóstico → Cotizada → Aceptada/Rechazada
- **Diagnósticos**: Vinculados a cotizaciones
- **Conversión**: A orden de trabajo si se acepta

### Ventas y Facturación

- **Crear Venta**: Desde orden completada
- **Cálculo Automático**: Subtotal, IVA, descuentos, total
- **Estados de Pago**: Pendiente, Parcial, Pagado, Vencido
- **Métodos de Pago**: Efectivo, tarjeta, transferencia, etc.

### Inventario de Productos

- **Catálogo**: Productos con código, nombre, precio, stock
- **Movimientos**: Entradas, salidas, ajustes
- **Alertas**: Productos con stock bajo

### Reportes

- **Dashboard**: Métricas generales
- **Ventas**: Por período, método de pago, etc.
- **Productos**: Más vendidos, stock bajo
- **Clientes**: Activos, nuevos, top clientes

## Base de Datos (Prisma Schema)

### Modelo de Usuario (Nuevo)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Modelos Existentes Mejorados

- **Client**: Agregar campos opcionales (dirección, teléfono secundario)
- **Vehicle**: Mantener como está
- **Quotation**: Mejorar estados y agregar campos de diagnóstico
- **WorkOrder**: Agregar campo de mecánico asignado
- **Sale**: Mantener pero mejorar cálculo de totales
- **Product**: Agregar categorías y proveedores
- **StockMovement**: Para tracking de inventario

## Flujo de Trabajo Optimizado

### Proceso de Servicio Típico

1. **Cliente llega** → Crear/Seleccionar cliente
2. **Registro del vehículo** → Si es nuevo
3. **Creación de cotización** → Diagnóstico inicial
4. **Aprobación de cotización** → Cliente acepta presupuesto
5. **Creación de orden de trabajo** → Asignación de mecánico
6. **Ejecución del trabajo** → Actualización de progreso
7. **Completación** → Marcado como terminado
8. **Creación de venta** → Facturación y cobro
9. **Entrega del vehículo** → Actualización final

### Navegación Simplificada

- **Sidebar**: Agrupar funcionalidades relacionadas
  - Clientes y Vehículos
  - Órdenes y Cotizaciones
  - Ventas e Inventario
  - Reportes

## Implementación por Fases

### Fase 1: Autenticación y Landing

- Crear landing page
- Implementar NextAuth.js
- Proteger rutas del dashboard
- Layout básico del dashboard

### Fase 2: Gestión Básica

- CRUD completo de clientes
- CRUD de vehículos
- Listado básico de órdenes

### Fase 3: Flujo de Trabajo

- Sistema completo de cotizaciones
- Órdenes de trabajo con estados
- Conversión cotización → orden

### Fase 4: Ventas e Inventario

- Sistema de ventas
- Gestión de productos
- Reportes básicos

### Fase 5: Optimizaciones

- Reportes avanzados
- Notificaciones
- Exportación de datos

## Consideraciones Técnicas

### Seguridad

- Autenticación robusta con NextAuth.js
- Validación de formularios con Zod
- Sanitización de inputs
- Protección CSRF

### Performance

- Server Components donde sea posible
- SWR para caching inteligente
- Optimización de imágenes
- Lazy loading de componentes

### UX/UI

- Diseño responsive
- Loading states
- Error handling
- Confirmaciones de acciones
- Búsqueda y filtros eficientes

### Escalabilidad

- Estructura modular de componentes
- Tipos TypeScript consistentes
- API RESTful
- Base de datos normalizada

## Beneficios de Esta Propuesta

1. **Simplicidad**: Flujo lineal y fácil de seguir
2. **Completitud**: Cubre todo el ciclo de negocio
3. **Escalabilidad**: Arquitectura preparada para crecimiento
4. **Mantenibilidad**: Código organizado y tipado
5. **Experiencia de Usuario**: Desde landing hasta gestión completa

## Riesgos y Mitigaciones

- **Complejidad Inicial**: Implementar por fases para reducir riesgo
- **Curva de Aprendizaje**: Documentación clara y ejemplos
- **Dependencias**: Usar versiones estables y bien mantenidas

## Próximos Pasos

1. Aprobación de esta propuesta
2. Definición de prioridades específicas
3. Estimación de tiempo por fase
4. Inicio de implementación por fases
5. Testing continuo y feedback

Esta propuesta transforma el proyecto actual en un sistema completo y profesional para la gestión de talleres mecánicos, manteniendo la simplicidad mientras se asegura funcionalidad completa.</content>
<parameter name="filePath">/home/rossmel/code/v0-mechanic-shop-system/PROPOSAL.md

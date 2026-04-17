# 🛠️ PLAN MAESTRO TÉCNICO: AutoMec SaaS v2.0

**De CRUD Genérico a Sistema de Gestión Transaccional Profesional – Edición para Agentes de IA**

---

## 📌 1. VISIÓN GENERAL Y DIFERENCIADOR ESTRATÉGICO

AutoMec SaaS v2.0 es un **Pipeline Inteligente de Conversión de Servicio Automotriz**. El objetivo central es que cada vehículo que ingresa al taller "fluya" a través de estados lógicos predefinidos **sin duplicación de datos, sin fricción operativa y con la menor cantidad de decisiones manuales posibles**.

El **verdadero diferenciador competitivo** es el **FaultFinder™ Engine**: una base de conocimiento de fallas y diagnósticos que actúa como el "cerebro" del taller. Este motor no solo sugiere causas probables, sino que **inyecta automáticamente repuestos, mano de obra y precios sugeridos** dentro de un presupuesto, estandarizando la rentabilidad del taller y reduciendo la dependencia de la memoria del mecánico.

**Meta de Experiencia de Usuario (UX):**

- Registro de un vehículo nuevo y cliente en **menos de 45 segundos** (desde placa hasta síntoma registrado).
- Generación de un presupuesto técnico completo **sin escribir manualmente el nombre de un solo repuesto** (basado en FaultFinder).
- Cierre de Orden de Trabajo con **descuento automático y auditado de inventario**.

---

## 🗃️ 2. ARQUITECTURA DE DATOS (Prisma Schema Definitivo)

Para garantizar inmutabilidad del flujo transaccional y auditoría profesional, el esquema de base de datos se basa estrictamente en **Enums** y **Relaciones 1:N estrictas**.

### 2.1. Enumeraciones de Estado (State Machines)

```prisma
enum QuotationStatus {
  DRAFT           // Borrador interno, no enviado al cliente.
  SENT            // Enviado vía WhatsApp/Email, esperando aprobación.
  APPROVED        // Cliente aprueba, listo para convertir.
  REJECTED        // Cliente rechaza, se archiva.
  CONVERTED       // Convertido exitosamente a WorkOrder (terminal).
}

enum WorkOrderStatus {
  BACKLOG         // En cola, esperando inicio de trabajo.
  IN_PROGRESS     // Mecánico asignado trabajando activamente.
  WAITING_PARTS   // Bloqueado por falta de stock o pedido externo.
  QA              // Trabajo terminado, en control de calidad.
  READY_FOR_DELIVERY // Listo para entregar al cliente.
  DELIVERED       // Entregado y facturado.
  CANCELLED       // Orden cancelada.
}

enum PaymentStatus {
  PENDING         // Pendiente de pago.
  PARTIAL         // Abono parcial registrado.
  PAID            // Pagado en su totalidad.
  REFUNDED        // Reembolsado.
}

2.2. Relaciones Transaccionales Críticas (Lógica de Negocio Protegida)
Entidad	Relación Clave	Regla de Negocio Inquebrantable
VehicleReception	Client + Vehicle + InitialSymptoms	Sesión de Ingreso Inmutable. Una vez creada, el odometer y el symptomText inicial no se pueden editar. Sirve como base legal para el diagnóstico.
Fault	FaultCategory + FaultSymptom + FaultSolution	Knowledge Base. Contiene estimatedHours y un array de FaultParts (relación sugerida de repuestos).
QuotationItem	Quotation + Product (o Service)	Origen de la venta. Cuando la Quotation pasa a CONVERTED, estos items se clonan a WorkOrderItem.
WorkOrderItem	WorkOrder + Product	Inventario Comprometido. Estado StockReservation que bloquea el stock para mostrador.
StockMovement	WorkOrder + Product + Quantity	Traza de Auditoría. Cada movimiento de inventario (salida por taller, devolución, ajuste) queda registrado con userId y timestamp.
Invoice	WorkOrder + Payment	Factura de cierre. Se genera automáticamente al cambiar estado a READY_FOR_DELIVERY.
🔄 3. FLUJO OPERATIVO DETALLADO (Core Workflow Loop)

Este es el Golden Path que el Agente de IA debe entender para implementar la lógica de negocio.
🟢 Fase 1: Quick Intake (Recepción Inteligente)

Componente: SmartIntake.tsx (Modal Único)

    Búsqueda Predictiva (Search-as-you-type):

        Endpoint: /api/vehicles/search?q={placa}

        Lógica: Si existe Vehicle, se precargan Client y historial. Si NO existe, se despliegan campos inline para crear Client y Vehicle dentro de la misma transacción.

    Registro del "Dolor":

        Campo de texto enriquecido (TipTap o textarea mejorado) para anotar exactamente lo que dice el cliente: "El carro tirita al prender el aire en las mañanas".

        Acción: Al hacer clic en "Iniciar Diagnóstico", el sistema:

            Crea/Actualiza VehicleReception.

            Crea un Quotation en estado DRAFT.

            Redirige automáticamente al Panel de FaultFinder.

🔵 Fase 2: FaultFinder Engine (El Cerebro - DIFERENCIAL)

Componente: DiagnosticPanel.tsx

Este módulo es el corazón que justifica el ROI del sistema. No es un buscador de texto; es un inyector de datos transaccionales.

Paso 2.1: Búsqueda de Diagnóstico (DTC o Síntoma)

    Entrada: El mecánico puede ingresar:

        Código DTC (Ej: P0301).

        Síntoma semántico (Ej: temblor al acelerar).

    Backend Logic (FaultMatcher):

        Consulta FTS (Full-Text Search) o ILIKE en la tabla Fault.

        Retorna una lista de Fault candidatos con metadatos: estimatedRepairCost, commonParts.

Paso 2.2: Inyección Automática de Presupuesto (Data Injection)

    Evento: El mecánico selecciona una fila de Fault.

    Acción del Sistema (Hook useFaultInjection):

        Lee Fault.suggestedParts (Relación Many-to-Many con Product).

        Lee Fault.suggestedLabor (Relación con ServiceType).

        Verifica Stock en Tiempo Real: Consulta inventory_level para cada Product. Si qty < 1, marca el ítem como "Pendiente de Pedido" en el presupuesto.

        Construcción del Presupuesto: Inserta masivamente los QuotationItems.

            Precio de Venta = Product.salePrice o ServiceType.hourlyRate * estimatedHours.

            Costo = Product.costPrice (Oculto para el mecánico, visible en Dashboard de Margen).

🟠 Fase 3: Gestión de Taller (Kanban & Orden de Trabajo)

Componente: WorkshopKanban.tsx

    Conversión (One-Click):

        El cliente aprueba (click en link de WhatsApp/Email o manual por recepción).

        Transacción Atómica en DB:

            Quotation.status = CONVERTED.

            WorkOrder creada con estado BACKLOG.

            Inventario Bloqueado: Se crean registros StockReservation para los repuestos del presupuesto. Regla de Negocio: Si al momento de iniciar el trabajo (IN_PROGRESS) el stock físico ya no existe, se genera una alerta de "Inventario Negativo Detectado".

    Tablero Visual (Drag & Drop con @dnd-kit):

        Columnas: BACKLOG, IN_PROGRESS, WAITING_PARTS, QA.

        Validación en Drop: Si arrastro a QA, valido que todos los WorkOrderItems tengan estado INSTALLED. Si arrastro a WAITING_PARTS, valido que al menos un item tenga StockReservation.status = 'OUT_OF_STOCK'.

🔴 Fase 4: Checkout y Sincronización de Inventario

Componente: DeliveryCheckout.tsx

    Paso a READY_FOR_DELIVERY:

        El sistema genera automáticamente el Invoice (Factura) con total calculado.

        Pregunta al Usuario: "¿Confirmar entrega y descontar inventario?"

    Acción de Cierre (Server Action):

        WorkOrder.status = DELIVERED.

        Bulk Insert en StockMovement: Por cada WorkOrderItem (tipo Producto), se crea un movimiento SALE con quantity = -1 * used_qty.

        Liberación de Stock: Se eliminan las StockReservation pendientes.

🧩 4. ESPECIFICACIÓN DE COMPONENTES UI/UX (Shadcn UI + Tailwind)
4.1. Command Palette (Omnisearch Global)

    Implementación: cmdk (React) + useDebounce.

    Contexto: Global (Ctrl + K).

    Alcance (Scoped Search):

        > Cliente: Juan Perez -> Redirige a ficha de cliente.

        > Placa: ABC123 -> Redirige a historial del vehículo.

        > Orden: WO-001 -> Abre Kanban en esa orden.

        > Falla: P0300 -> Abre directamente el FaultFinder.

4.2. Smart Forms (React Hook Form + Zod)

    Componente Crítico: ClientVehicleCombobox.

    Lógica:

        Si el usuario escribe un nombre/placa que no existe, el sistema NO muestra "Sin resultados". Muestra "Crear 'Nuevo Cliente'".

        Al hacer clic en "Crear", se abre un Sheet lateral (Drawer) con el formulario mínimo de alta rápida.

4.3. Visualización de Estados (Kanban)

    Tarjeta de Orden: Muestra:

        Cliente y Vehículo (Primera línea).

        Temporizador: Tiempo transcurrido desde que entró a IN_PROGRESS (rojo si excede estimatedHours).

        Badge de Inventario: Icono de caja si la orden tiene repuestos reservados.

📅 5. ROADMAP DE IMPLEMENTACIÓN DETALLADO (Plan de Sprints)
🚀 Sprint 1: Fundación Inmutable y Tipado Estricto

    Objetivo: Consolidar la estructura de datos y la capa de API.

    Tareas:

        Refactorizar schema.prisma con los Enums y Relaciones definidos en la Sección 2.

        Generar migración y sembrar datos de prueba para Fault (Base de Conocimiento).

        Implementar @tanstack/react-query (reemplazo de SWR para mejor control de cache transaccional) con Mutaciones Optimistas en todas las tablas (useQuotations, useWorkOrders).

        Configurar el middleware de autenticación con roles (Mecánico vs. Admin).

🚀 Sprint 2: FaultFinder Engine (Núcleo de Valor)

    Objetivo: Que el sistema pueda generar un presupuesto solo con un código DTC.

    Tareas:

        Crear API Route POST /api/diagnostic/match (Lógica de matching borroso).

        Crear Componente DiagnosticSearch con lista de resultados y preview de repuestos.

        Implementar Hook useInjectFaultIntoQuotation: Recibe faultId y quotationId, hace append de items verificando precios de venta actuales.

        Testing Manual: Probar con código P0301 -> Inyectar Bujías y 1.5h de MO.

🚀 Sprint 3: Smart Intake 2.0 y Conversión

    Objetivo: Eliminar el formulario de creación de clientes lento.

    Tareas:

        Rehacer SmartIntake con transacciones de base de datos atómicas (crear cliente/vehículo/recepción en una sola llamada API).

        Implementar flujo de Aprobación Digital: Generar link público efímero de Quotation (/quote/[id]?token=xxx) para que el cliente apruebe sin login.

        Acción "Convertir a Orden": Lógica en Server Action para el cambio de estado y bloqueo de stock.

🚀 Sprint 4: Kanban y Gestión Visual del Taller

    Objetivo: Visualizar la carga de trabajo y el estado del inventario reservado.

    Tareas:

        Implementar @dnd-kit/sortable para el tablero Kanban.

        Crear endpoint PATCH /api/work-order/[id]/status que actualice estado y registre StockMovement si se mueve a DELIVERED.

        Dashboard de "Eficiencia del Mecánico" (Recharts): Comparar estimatedHours vs. actualHours.

🚀 Sprint 5: Business Intelligence y Cierre Financiero

    Objetivo: Dashboard de Rentabilidad en Tiempo Real.

    Tareas:

        Vista SQL o consulta Prisma para calcular Margen Bruto: SUM(salePrice - costPrice) de WorkOrderItem agrupado por día/mes.

        Widget de "Repuestos Más Rentables" y "Servicios Más Vendidos".

        Exportación de Reportes a PDF (Facturas y Cierres de Caja).

✅ 6. DEFINICIÓN DE ÉXITO (Checklist de Demo para UDABOL)

El sistema se considera "Ready for Production" cuando se cumple estrictamente:
#	Criterio de Aceptación	Evidencia Observable
1	Speed Intake: Registro de Cliente + Vehículo + Síntoma inicial en menos de 45 segundos.	Cronómetro en la demo. El recepcionista solo usa el teclado (Tab y Enter).
2	Diagnóstico Automatizado: Presupuesto generado con al menos 3 items (repuestos + MO) sin que el mecánico escriba el nombre de ningún producto.	Seleccionar falla "Fallo Bujía Cilindro 1" -> Los items aparecen en pantalla automáticamente con precio.
3	Flujo Kanban: Al arrastrar una orden a READY_FOR_DELIVERY, el stock de "Bujías NGK" se descuenta inmediatamente en la vista de Inventario.	Refrescar pantalla de Inventario y ver la cantidad disminuida.
4	Auditoría Transaccional: No se puede eliminar una WorkOrder ni editar precios de una factura ya pagada.	Intentar hacer click en "Eliminar" en una orden entregada: El botón debe estar deshabilitado o mostrar "No Permitido".
```

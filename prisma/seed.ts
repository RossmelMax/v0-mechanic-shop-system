import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando datos iniciales...')

  // Limpiar datos existentes
  await prisma.faultDatabase.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.client.deleteMany({})

  // ============================================
  // CREAR CLIENTES DE EJEMPLO
  // ============================================
  const client1 = await prisma.client.create({
    data: {
      name: 'Juan García',
      email: 'juan@example.com',
      phone: '555-0101',
      address: 'Calle Principal 123, Apt 4B',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'María López',
      email: 'maria@example.com',
      phone: '555-0102',
      address: 'Avenida Central 456',
    },
  })

  // ============================================
  // CREAR PRODUCTOS / INVENTARIO DE EJEMPLO
  // ============================================
  const products = [
    {
      code: 'BATT-001',
      name: 'Batería 12V 50Ah',
      category: 'Eléctrica',
      price: 120.0,
      cost: 80.0,
      quantity: 15,
    },
    {
      code: 'OIL-005W40',
      name: 'Aceite Motor 5W40 5L',
      category: 'Lubricantes',
      price: 45.0,
      cost: 30.0,
      quantity: 25,
    },
    {
      code: 'AIR-FILTER',
      name: 'Filtro de Aire',
      category: 'Filtros',
      price: 25.0,
      cost: 15.0,
      quantity: 40,
    },
    {
      code: 'BRAKE-PAD',
      name: 'Pastillas de Freno',
      category: 'Frenos',
      price: 85.0,
      cost: 55.0,
      quantity: 20,
    },
    {
      code: 'SPARK-PLUG',
      name: 'Bujías (Juego 4)',
      category: 'Encendido',
      price: 35.0,
      cost: 20.0,
      quantity: 30,
    },
    {
      code: 'COOLANT-1L',
      name: 'Refrigerante 1L',
      category: 'Refrigeración',
      price: 12.0,
      cost: 7.0,
      quantity: 50,
    },
    {
      code: 'BRAKE-FLUID',
      name: 'Líquido de Frenos 1L',
      category: 'Fluidos',
      price: 15.0,
      cost: 9.0,
      quantity: 35,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        unit: 'unit',
      },
    })
  }

  // ============================================
  // CREAR BASE DE FALLAS (JURISPRUDENCIA)
  // ============================================
  const faults = [
    {
      title: 'Batería Descargada',
      code: null,
      description:
        'La batería no tiene suficiente carga para arrancar el motor',
      symptoms:
        'El motor no arranca, luces débiles, sin energía eléctrica',
      keywords: JSON.stringify([
        'batería',
        'descarga',
        'no arranca',
        'starter',
        'sin energía',
      ]),
      affectedSystems: JSON.stringify(['electrical']),
      vehicleTypes: JSON.stringify(['auto', 'camión', 'suv']),
      vehicleMakes: null,
      commonCauses: JSON.stringify([
        'Batería envejecida (más de 5 años)',
        'Alternador defectuoso',
        'Conexiones corroídas',
        'Luz olvidada encendida',
      ]),
      solutionProcess: JSON.stringify([
        '1. Verificar voltaje con multímetro (debe estar entre 12-13.8V)',
        '2. Si está baja, revisar alternador',
        '3. Limpiar conexiones si hay corrosión',
        '4. Cargar o reemplazar batería según sea necesario',
      ]),
      estimatedTime: 30,
      estimatedCost: 120.0,
      requiredParts: JSON.stringify(['Batería de repuesto (opcional)']),
      tools: JSON.stringify(['Multímetro', 'Cables de arranque']),
      relatedFaults: null,
      imagesUrls: null,
      videoUrl: null,
      relatedDocLink: null,
      isCommon: true,
      severity: 'HIGH',
      computerRequired: false,
    },
    {
      title: 'Luces del Tablero Parpadean / Se Encienden',
      code: 'P0001',
      description:
        'Diferentes luces de advertencia se encienden en el tablero de instrumentos',
      symptoms:
        'Luces rojas o amarillas en el tablero, parpadeos, advertencias múltiples',
      keywords: JSON.stringify([
        'tablero',
        'luces',
        'advertencia',
        'check engine',
        'falla',
      ]),
      affectedSystems: JSON.stringify(['electrical', 'engine']),
      vehicleTypes: JSON.stringify(['auto', 'suv']),
      vehicleMakes: null,
      commonCauses: JSON.stringify([
        'Contacto deficiente en batería',
        'Alternador con problemas',
        'Sensores defectuosos',
        'Módulos de control fallando',
      ]),
      solutionProcess: JSON.stringify([
        '1. Conectar lector de códigos para ver fallas específicas',
        '2. Verificar voltaje de batería y alternador',
        '3. Revisar conexiones',
        '4. Diagnosticar sensor o módulo específico según códigos',
      ]),
      estimatedTime: 60,
      estimatedCost: 150.0,
      requiredParts: JSON.stringify(['Depende del diagnóstico']),
      tools: JSON.stringify(['Escáner de diagnóstico']),
      relatedFaults: null,
      imagesUrls: null,
      videoUrl: null,
      relatedDocLink: null,
      isCommon: true,
      severity: 'MEDIUM',
      computerRequired: true,
    },
    {
      title: 'Pérdida de Refrigerante',
      code: null,
      description:
        'El sistema de refrigeración pierde líquido continuamente',
      symptoms:
        'Temperatura del motor alta, charcos debajo del auto, olor a refrigerante',
      keywords: JSON.stringify([
        'refrigerante',
        'pérdida',
        'temperatura',
        'radiador',
        'fugas',
      ]),
      affectedSystems: JSON.stringify(['cooling']),
      vehicleTypes: JSON.stringify(['auto', 'camión', 'suv']),
      vehicleMakes: null,
      commonCauses: JSON.stringify([
        'Mangueras desgastadas o rotas',
        'Radiador con grietas',
        'Juntas defectuosas',
        'Bomba de agua con fugas',
      ]),
      solutionProcess: JSON.stringify([
        '1. Esperar a que se enfríe el motor',
        '2. Inspeccionar todas las mangueras',
        '3. Revisar radiador y bomba de agua',
        '4. Reemplazar componentes defectuosos',
        '5. Purgar y llenar el sistema',
      ]),
      estimatedTime: 90,
      estimatedCost: 250.0,
      requiredParts: JSON.stringify([
        'Mangueras de radiador (depende del modelo)',
        'Líquido refrigerante',
      ]),
      tools: JSON.stringify(['Llave inglesa', 'Junta de goma']),
      relatedFaults: null,
      imagesUrls: null,
      videoUrl: null,
      relatedDocLink: null,
      isCommon: true,
      severity: 'HIGH',
      computerRequired: false,
    },
    {
      title: 'Frenos Suave o Sin Respuesta',
      code: 'C0035',
      description:
        'El pedal de freno está suave o no hay respuesta al frenar',
      symptoms:
        'Pedal muy suave, viaja hacia el piso, requiere más presión para frenar',
      keywords: JSON.stringify([
        'freno',
        'suave',
        'pedal',
        'no frena',
        'fallo de freno',
      ]),
      affectedSystems: JSON.stringify(['braking']),
      vehicleTypes: JSON.stringify(['auto', 'camión', 'suv', 'moto']),
      vehicleMakes: null,
      commonCauses: JSON.stringify([
        'Aire en las líneas de freno',
        'Pastillas de freno gastadas',
        'Fuga en cilindro maestro',
        'Líquido de freno bajo',
      ]),
      solutionProcess: JSON.stringify([
        '1. Verificar nivel de líquido de freno',
        '2. Revisar si hay fugas',
        '3. Purgar el sistema de aire',
        '4. Inspeccionar pastillas y discos',
        '5. Reemplazar componentes según sea necesario',
      ]),
      estimatedTime: 120,
      estimatedCost: 300.0,
      requiredParts: JSON.stringify([
        'Pastillas de freno',
        'Líquido de freno',
      ]),
      tools: JSON.stringify([
        'Purga de frenos',
        'Llave inglesa',
        'Llaves hexagonales',
      ]),
      relatedFaults: null,
      imagesUrls: null,
      videoUrl: null,
      relatedDocLink: null,
      isCommon: true,
      severity: 'CRITICAL',
      computerRequired: false,
    },
    {
      title: 'Ruido de Motor Fuerte / Golpeteo',
      code: 'P0325',
      description:
        'Se escucha un ruido de golpeteo o detonación en el motor',
      symptoms:
        'Ruido metálico fuerte, especialmente bajo aceleración, pérdida de potencia',
      keywords: JSON.stringify([
        'ruido',
        'golpe',
        'detonación',
        'engine knock',
        'motor',
      ]),
      affectedSystems: JSON.stringify(['engine']),
      vehicleTypes: JSON.stringify(['auto', 'suv']),
      vehicleMakes: null,
      commonCauses: JSON.stringify([
        'Combustible de baja octanaje',
        'Sensor de detonación defectuoso',
        'Carbón acumulado en cilindros',
        'Válvulas desgastadas',
        'Tiempo de ignición incorrecto',
      ]),
      solutionProcess: JSON.stringify([
        '1. Conectar lector de códigos',
        '2. Verificar presión de combustible',
        '3. Inspeccionar sensor de detonación',
        '4. Hacer limpieza de depósitos si es necesario',
        '5. Ajustar tiempo si aplica',
      ]),
      estimatedTime: 90,
      estimatedCost: 200.0,
      requiredParts: JSON.stringify([
        'Sensor de detonación (si aplica)',
      ]),
      tools: JSON.stringify(['Escáner de diagnóstico', 'Medidor de presión']),
      relatedFaults: null,
      imagesUrls: null,
      videoUrl: null,
      relatedDocLink: null,
      isCommon: true,
      severity: 'HIGH',
      computerRequired: true,
    },
  ]

  for (const fault of faults) {
    await prisma.faultDatabase.create({
      data: fault as any,
    })
  }

  console.log('✅ Datos iniciales sembrados correctamente')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos iniciales...");

  // Limpiar datos existentes en orden de dependencias
  await prisma.sale.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.diagnostic.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.workOrder.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.faultDatabase.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.client.deleteMany({});

  console.log("✓ Base de datos limpiada");

  // ============================================
  // CREAR USUARIO ADMIN
  // ============================================
  const adminUser = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@taller.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password123"
      role: "ADMIN",
    },
  });

  console.log("✓ Usuario admin creado (admin@taller.com / password123)");
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Juan García López",
        email: "juan.garcia@email.com",
        phone: "+34 555-0101",
        address: "Calle Principal 123, Apt 4B",
      },
    }),
    prisma.client.create({
      data: {
        name: "María López Rodríguez",
        email: "maria.lopez@email.com",
        phone: "+34 555-0102",
        address: "Avenida Central 456",
      },
    }),
    prisma.client.create({
      data: {
        name: "Carlos Martínez Pérez",
        email: "carlos.martinez@email.com",
        phone: "+34 555-0103",
        address: "Plaza Mayor 789",
      },
    }),
    prisma.client.create({
      data: {
        name: "Ana Fernández García",
        email: "ana.fernandez@email.com",
        phone: "+34 555-0104",
        address: "Calle del Comercio 321",
      },
    }),
    prisma.client.create({
      data: {
        name: "Roberto Sánchez Moreno",
        email: "roberto.sanchez@email.com",
        phone: "+34 555-0105",
        address: "Calle Industria 654",
      },
    }),
    prisma.client.create({
      data: {
        name: "Sandra Romero Castro",
        email: "sandra.romero@email.com",
        phone: "+34 555-0106",
        address: "Avenida del Parque 987",
      },
    }),
    prisma.client.create({
      data: {
        name: "Empresa Transportes García",
        email: "contacto@transportes-garcia.com",
        phone: "+34 555-0200",
        address: "Polígono Industrial, Nave B5",
      },
    }),
    prisma.client.create({
      data: {
        name: "Taxi Madrid Central",
        email: "admin@taxi-madrid.com",
        phone: "+34 555-0201",
        address: "Terminal de Taxis, Avenida Castellana",
      },
    }),
  ]);

  console.log("✓ 8 clientes creados");

  // ============================================
  // CREAR VEHÍCULOS
  // ============================================
  const vehicles = await Promise.all([
    // Cliente 1: Juan García
    prisma.vehicle.create({
      data: {
        clientId: clients[0].id,
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        licensePlate: "MAD-1234-AB",
        vin: "TOY20200001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "automática",
        mileage: 35000,
        color: "blanco",
        engineType: "WITH_COMPUTER",
        notes: "Mantenimiento completo en regla",
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[0].id,
        make: "Renault",
        model: "Megane",
        year: 2018,
        licensePlate: "MAD-5678-CD",
        vin: "REN20180001",
        type: "auto",
        fuelType: "diésel",
        transmission: "manual",
        mileage: 62000,
        color: "rojo",
        engineType: "WITH_COMPUTER",
        notes: "Revisión de frenos pendiente",
      },
    }),
    // Cliente 2: María López
    prisma.vehicle.create({
      data: {
        clientId: clients[1].id,
        make: "Volkswagen",
        model: "Golf",
        year: 2021,
        licensePlate: "MAD-9012-EF",
        vin: "VW20210001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "automática",
        mileage: 28000,
        color: "negro",
        engineType: "WITH_COMPUTER",
        notes: "Coche nuevo",
      },
    }),
    // Cliente 3: Carlos Martínez
    prisma.vehicle.create({
      data: {
        clientId: clients[2].id,
        make: "Ford",
        model: "Ranger",
        year: 2019,
        licensePlate: "MAD-3456-GH",
        vin: "FOR20190001",
        type: "camión",
        fuelType: "diésel",
        transmission: "automática",
        mileage: 78000,
        color: "gris",
        engineType: "WITH_COMPUTER",
        notes: "Uso comercial",
      },
    }),
    // Cliente 4: Ana Fernández
    prisma.vehicle.create({
      data: {
        clientId: clients[3].id,
        make: "BMW",
        model: "320i",
        year: 2022,
        licensePlate: "MAD-7890-IJ",
        vin: "BMW20220001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "automática",
        mileage: 15000,
        color: "azul",
        engineType: "WITH_COMPUTER",
        notes: null,
      },
    }),
    // Cliente 5: Roberto Sánchez
    prisma.vehicle.create({
      data: {
        clientId: clients[4].id,
        make: "Mercedes-Benz",
        model: "C-Class",
        year: 2020,
        licensePlate: "MAD-2345-KL",
        vin: "MB20200001",
        type: "auto",
        fuelType: "diésel",
        transmission: "automática",
        mileage: 45000,
        color: "plata",
        engineType: "WITH_COMPUTER",
        notes: "Servicio cliente VIP",
      },
    }),
    // Cliente 6: Sandra Romero
    prisma.vehicle.create({
      data: {
        clientId: clients[5].id,
        make: "Opel",
        model: "Astra",
        year: 2017,
        licensePlate: "MAD-6789-MN",
        vin: "OPL20170001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "manual",
        mileage: 95000,
        color: "gris",
        engineType: "WITH_COMPUTER",
        notes: "Coche con alto kilometraje",
      },
    }),
    // Cliente 7: Empresa Transportes
    prisma.vehicle.create({
      data: {
        clientId: clients[6].id,
        make: "Volvo",
        model: "FH16",
        year: 2019,
        licensePlate: "MAD-0123-OP",
        vin: "VOL20190001",
        type: "camión",
        fuelType: "diésel",
        transmission: "automática",
        mileage: 180000,
        color: "naranja",
        engineType: "WITH_COMPUTER",
        notes: "Camión de carga pesada",
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[6].id,
        make: "Volvo",
        model: "FH16",
        year: 2020,
        licensePlate: "MAD-4567-QR",
        vin: "VOL20200001",
        type: "camión",
        fuelType: "diésel",
        transmission: "automática",
        mileage: 145000,
        color: "naranja",
        engineType: "WITH_COMPUTER",
        notes: "Camión de carga pesada - flota 2",
      },
    }),
    // Cliente 8: Taxi
    prisma.vehicle.create({
      data: {
        clientId: clients[7].id,
        make: "Seat",
        model: "Toledo",
        year: 2016,
        licensePlate: "MAD-8901-ST",
        vin: "SEAT20160001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "manual",
        mileage: 220000,
        color: "blanco",
        engineType: "WITH_COMPUTER",
        notes: "Taxi con licencia",
      },
    }),
    prisma.vehicle.create({
      data: {
        clientId: clients[7].id,
        make: "Seat",
        model: "Toledo",
        year: 2017,
        licensePlate: "MAD-2345-UV",
        vin: "SEAT20170001",
        type: "auto",
        fuelType: "gasolina",
        transmission: "manual",
        mileage: 195000,
        color: "blanco",
        engineType: "WITH_COMPUTER",
        notes: "Taxi con licencia - taxi 2",
      },
    }),
  ]);

  console.log("✓ 11 vehículos creados");

  // ============================================
  // CREAR PRODUCTOS
  // ============================================
  const products = await Promise.all([
    // Baterías y Eléctrica
    prisma.product.create({
      data: {
        code: "BATT-001",
        name: "Batería 12V 50Ah",
        category: "Eléctrica",
        price: 120.0,
        cost: 80.0,
        quantity: 15,
        unit: "unit",
        supplier: "EuroAuto Parts",
        minStock: 5,
        maxStock: 30,
      },
    }),
    prisma.product.create({
      data: {
        code: "BATT-002",
        name: "Batería 12V 70Ah Premium",
        category: "Eléctrica",
        price: 180.0,
        cost: 120.0,
        quantity: 8,
        unit: "unit",
        supplier: "EuroAuto Parts",
        minStock: 3,
        maxStock: 15,
      },
    }),
    prisma.product.create({
      data: {
        code: "ALT-050",
        name: "Alternador 50A",
        category: "Eléctrica",
        price: 250.0,
        cost: 150.0,
        quantity: 6,
        unit: "unit",
        supplier: "TechMotor",
        minStock: 2,
        maxStock: 10,
      },
    }),
    // Lubricantes
    prisma.product.create({
      data: {
        code: "OIL-005W40",
        name: "Aceite Motor 5W40 5L",
        category: "Lubricantes",
        price: 45.0,
        cost: 30.0,
        quantity: 45,
        unit: "unit",
        supplier: "Mobil",
        minStock: 20,
        maxStock: 60,
      },
    }),
    prisma.product.create({
      data: {
        code: "OIL-010W40",
        name: "Aceite Motor 10W40 5L",
        category: "Lubricantes",
        price: 38.0,
        cost: 25.0,
        quantity: 52,
        unit: "unit",
        supplier: "Castrol",
        minStock: 20,
        maxStock: 70,
      },
    }),
    prisma.product.create({
      data: {
        code: "OIL-TRANS",
        name: "Aceite Transmisión Automática 4L",
        category: "Lubricantes",
        price: 35.0,
        cost: 22.0,
        quantity: 28,
        unit: "unit",
        supplier: "Mobil",
        minStock: 10,
        maxStock: 40,
      },
    }),
    // Filtros
    prisma.product.create({
      data: {
        code: "AIR-FILTER",
        name: "Filtro de Aire",
        category: "Filtros",
        price: 25.0,
        cost: 15.0,
        quantity: 60,
        unit: "unit",
        supplier: "Bosch",
        minStock: 20,
        maxStock: 80,
      },
    }),
    prisma.product.create({
      data: {
        code: "CABIN-FILTER",
        name: "Filtro de Cabina / Polen",
        category: "Filtros",
        price: 30.0,
        cost: 18.0,
        quantity: 45,
        unit: "unit",
        supplier: "Bosch",
        minStock: 15,
        maxStock: 60,
      },
    }),
    prisma.product.create({
      data: {
        code: "OIL-FILTER",
        name: "Filtro de Aceite",
        category: "Filtros",
        price: 20.0,
        cost: 12.0,
        quantity: 75,
        unit: "unit",
        supplier: "Bosch",
        minStock: 30,
        maxStock: 100,
      },
    }),
    // Frenos
    prisma.product.create({
      data: {
        code: "BRAKE-PAD",
        name: "Pastillas de Freno Delantera",
        category: "Frenos",
        price: 85.0,
        cost: 55.0,
        quantity: 32,
        unit: "unit",
        supplier: "ABS",
        minStock: 10,
        maxStock: 50,
      },
    }),
    prisma.product.create({
      data: {
        code: "BRAKE-RIM",
        name: "Disco de Freno",
        category: "Frenos",
        price: 95.0,
        cost: 60.0,
        quantity: 24,
        unit: "unit",
        supplier: "ABS",
        minStock: 8,
        maxStock: 40,
      },
    }),
    prisma.product.create({
      data: {
        code: "BRAKE-FLUID",
        name: "Líquido de Frenos 1L",
        category: "Fluidos",
        price: 15.0,
        cost: 9.0,
        quantity: 68,
        unit: "unit",
        supplier: "ATE",
        minStock: 25,
        maxStock: 100,
      },
    }),
    // Bujías y Encendido
    prisma.product.create({
      data: {
        code: "SPARK-PLUG",
        name: "Bujías (Juego de 4)",
        category: "Encendido",
        price: 35.0,
        cost: 20.0,
        quantity: 48,
        unit: "unit",
        supplier: "NGK",
        minStock: 15,
        maxStock: 60,
      },
    }),
    prisma.product.create({
      data: {
        code: "SPARK-PLUG-IRID",
        name: "Bujías Iridio (Juego de 4)",
        category: "Encendido",
        price: 65.0,
        cost: 40.0,
        quantity: 20,
        unit: "unit",
        supplier: "NGK",
        minStock: 8,
        maxStock: 30,
      },
    }),
    // Fluidos y Refrigeración
    prisma.product.create({
      data: {
        code: "COOLANT-1L",
        name: "Refrigerante Rojo 1L",
        category: "Refrigeración",
        price: 12.0,
        cost: 7.0,
        quantity: 85,
        unit: "unit",
        supplier: "Prestone",
        minStock: 30,
        maxStock: 120,
      },
    }),
    prisma.product.create({
      data: {
        code: "COOLANT-GREEN",
        name: "Refrigerante Verde 1L",
        category: "Refrigeración",
        price: 11.0,
        cost: 6.5,
        quantity: 72,
        unit: "unit",
        supplier: "Prestone",
        minStock: 25,
        maxStock: 100,
      },
    }),
    prisma.product.create({
      data: {
        code: "POWER-STEER",
        name: "Líquido Dirección Asistida 1L",
        category: "Fluidos",
        price: 16.0,
        cost: 10.0,
        quantity: 34,
        unit: "unit",
        supplier: "Pentosin",
        minStock: 10,
        maxStock: 50,
      },
    }),
    // Cables y Conexiones
    prisma.product.create({
      data: {
        code: "CABLES-BUJIA",
        name: "Juego Cables de Bujía",
        category: "Encendido",
        price: 42.0,
        cost: 28.0,
        quantity: 26,
        unit: "unit",
        supplier: "Bosch",
        minStock: 8,
        maxStock: 40,
      },
    }),
    prisma.product.create({
      data: {
        code: "CORREA-DISTRIB",
        name: "Correa de Distribución",
        category: "Motor",
        price: 180.0,
        cost: 110.0,
        quantity: 12,
        unit: "unit",
        supplier: "Contitech",
        minStock: 4,
        maxStock: 20,
      },
    }),
    // Mangueras
    prisma.product.create({
      data: {
        code: "RADIATOR-HOSE",
        name: "Manguera Radiador Superior",
        category: "Refrigeración",
        price: 28.0,
        cost: 18.0,
        quantity: 31,
        unit: "unit",
        supplier: "Gates",
        minStock: 10,
        maxStock: 50,
      },
    }),
    prisma.product.create({
      data: {
        code: "HEATER-HOSE",
        name: "Manguera Calefacción",
        category: "Refrigeración",
        price: 22.0,
        cost: 14.0,
        quantity: 27,
        unit: "unit",
        supplier: "Gates",
        minStock: 8,
        maxStock: 40,
      },
    }),
  ]);

  console.log("✓ 21 productos creados");

  // ============================================
  // CREAR BASE DE FALLAS
  // ============================================
  const faults = await Promise.all([
    prisma.faultDatabase.create({
      data: {
        title: "Motor No Arranca - Batería Descargada",
        code: "P0001",
        description:
          "La batería no tiene suficiente carga para arrancar el motor",
        symptoms:
          "El motor no arranca, luces débiles, sin energía eléctrica, clics al girar la llave",
        keywords: JSON.stringify([
          "batería",
          "descarga",
          "no arranca",
          "starter",
          "sin energía",
        ]),
        affectedSystems: JSON.stringify(["electrical", "engine"]),
        vehicleTypes: JSON.stringify(["auto", "camión", "suv", "moto"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Batería envejecida (más de 5 años)",
          "Alternador defectuoso no carga",
          "Conexiones corroídas en bornes",
          "Luz olvidada encendida",
          "Batería de baja calidad",
        ]),
        solutionProcess: JSON.stringify([
          "1. Verificar voltaje batería con multímetro (debe estar 12-13.8V)",
          "2. Limpiar bornes si hay corrosión",
          "3. Revisar alternador con motor en marcha (voltaje debe subir)",
          "4. Si falla, cargar batería 12-24 horas",
          "5. Reemplazar batería si no recupera carga",
        ]),
        estimatedTime: 45,
        estimatedCost: 120.0,
        requiredParts: JSON.stringify(["Batería de repuesto (opcional)"]),
        tools: JSON.stringify(["Multímetro", "Cables de arranque", "Cargador"]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "HIGH",
        computerRequired: false,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Luces del Tablero Parpadean",
        code: "P0011",
        description:
          "Diferentes luces de advertencia se encienden en el tablero",
        symptoms:
          "Luces rojas o amarillas en tablero, parpadeos, advertencias CHECK ENGINE",
        keywords: JSON.stringify([
          "tablero",
          "luces",
          "advertencia",
          "check engine",
          "falla",
          "parpadea",
        ]),
        affectedSystems: JSON.stringify(["electrical", "engine", "sensor"]),
        vehicleTypes: JSON.stringify(["auto", "suv", "camión"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Contacto deficiente en batería",
          "Alternador con problemas",
          "Sensores defectuosos",
          "Módulos de control fallando",
          "Fuga en combustible",
        ]),
        solutionProcess: JSON.stringify([
          "1. Conectar lector de códigos OBD2",
          "2. Verificar y anotar todos los códigos de falla",
          "3. Verificar voltaje batería y alternador",
          "4. Revisar conexiones eléctricas",
          "5. Diagnosticar sensor o módulo específico según códigos",
        ]),
        estimatedTime: 90,
        estimatedCost: 200.0,
        requiredParts: JSON.stringify([
          "Depende del diagnóstico",
          "Posible sensor o módulo",
        ]),
        tools: JSON.stringify(["Escáner OBD2", "Multímetro", "Osciloscopio"]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "MEDIUM",
        computerRequired: true,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Pérdida de Refrigerante",
        code: "P0008",
        description: "Sistema de refrigeración pierde líquido continuamente",
        symptoms:
          "Temperatura motor alta, charcos debajo auto, olor a refrigerante dulce",
        keywords: JSON.stringify([
          "refrigerante",
          "pérdida",
          "temperatura",
          "radiador",
          "fugas",
          "recalentamiento",
        ]),
        affectedSystems: JSON.stringify(["cooling", "engine"]),
        vehicleTypes: JSON.stringify(["auto", "camión", "suv"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Mangueras desgastadas o rotas",
          "Radiador con grietas",
          "Juntas defectuosas",
          "Bomba de agua con fugas",
          "Tapa de radiador fallida",
        ]),
        solutionProcess: JSON.stringify([
          "1. Dejar motor enfríe completamente (20-30 min)",
          "2. Inspeccionar todas mangueras radiador",
          "3. Revisar radiador por grietas",
          "4. Inspeccionar conexiones y juntas",
          "5. Reemplazar componentes defectuosos",
          "6. Purgar y llenar sistema con refrigerante",
          "7. Purgar aire del sistema",
        ]),
        estimatedTime: 120,
        estimatedCost: 350.0,
        requiredParts: JSON.stringify([
          "Mangueras radiador",
          "Líquido refrigerante",
          "Juntas",
        ]),
        tools: JSON.stringify([
          "Llave inglesa",
          "Destornilladores",
          "Junta de goma",
          "Purgador aire",
        ]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "HIGH",
        computerRequired: false,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Frenos Suave o Sin Respuesta",
        code: "C0035",
        description: "Pedal de freno está suave o no hay respuesta",
        symptoms:
          "Pedal muy suave, viaja hacia piso, requiere más presión frenar",
        keywords: JSON.stringify([
          "freno",
          "suave",
          "pedal",
          "no frena",
          "fallo",
          "blando",
        ]),
        affectedSystems: JSON.stringify(["braking", "hydraulic"]),
        vehicleTypes: JSON.stringify(["auto", "camión", "suv", "moto"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Aire en líneas de freno",
          "Pastillas desgastadas",
          "Fuga cilindro maestro",
          "Líquido freno bajo",
          "Tuberías rotas",
          "Pastillas mojadas",
        ]),
        solutionProcess: JSON.stringify([
          "1. Verificar nivel líquido freno",
          "2. Revisar si hay fugas",
          "3. Purgar aire del sistema freno",
          "4. Inspeccionar pastillas y discos",
          "5. Revisar cilindro maestro",
          "6. Reemplazar componentes defectuosos",
          "7. Purgar sistema completo después reparación",
        ]),
        estimatedTime: 150,
        estimatedCost: 350.0,
        requiredParts: JSON.stringify([
          "Pastillas freno",
          "Líquido freno DOT 4",
          "Discos freno",
        ]),
        tools: JSON.stringify([
          "Purga frenos",
          "Llaves",
          "Hexagonales",
          "Extractor pastillas",
        ]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "CRITICAL",
        computerRequired: false,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Ruido de Motor Fuerte - Golpeteo",
        code: "P0325",
        description: "Se escucha ruido de golpeteo o detonación",
        symptoms:
          "Ruido metálico fuerte especialmente bajo aceleración, pérdida potencia",
        keywords: JSON.stringify([
          "ruido",
          "golpe",
          "detonación",
          "engine knock",
          "motor",
          "golpeteo",
        ]),
        affectedSystems: JSON.stringify(["engine", "sensor"]),
        vehicleTypes: JSON.stringify(["auto", "suv", "camión"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Combustible octanaje bajo",
          "Sensor detonación defectuoso",
          "Carbón acumulado cilindros",
          "Válvulas desgastadas",
          "Tiempo ignición incorrecto",
          "Bujías desgastadas",
        ]),
        solutionProcess: JSON.stringify([
          "1. Cambiar a combustible octanaje más alto",
          "2. Usar aditivo limpiador combustible",
          "3. Verificar sensor detonación con escáner",
          "4. Revisar tiempo ignición",
          "5. Limpiar cámara combustión",
          "6. Cambiar bujías si gastadas",
          "7. Reemplazar sensor si defectuoso",
        ]),
        estimatedTime: 180,
        estimatedCost: 250.0,
        requiredParts: JSON.stringify([
          "Bujías",
          "Aditivo limpiador",
          "Sensor detonación",
        ]),
        tools: JSON.stringify([
          "Escáner OBD2",
          "Llaves bujías",
          "Multímetro",
          "Destornilladores",
        ]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "HIGH",
        computerRequired: true,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Aceite en Bajo Nivel",
        code: null,
        description: "Nivel de aceite por debajo del mínimo recomendado",
        symptoms: "Luz aceite en tablero, bajo nivel varilla, ruido motor seco",
        keywords: JSON.stringify([
          "aceite",
          "bajo",
          "nivel",
          "luz",
          "varilla",
          "cambio",
        ]),
        affectedSystems: JSON.stringify(["engine", "lubrication"]),
        vehicleTypes: JSON.stringify(["auto", "camión", "suv", "moto"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Mantenimiento atrasado",
          "Fuga aceite",
          "Consumo excesivo aceite",
          "Juntas gastadas",
          "Aro segmento defectuoso",
        ]),
        solutionProcess: JSON.stringify([
          "1. Estacionar en superficie plana",
          "2. Dejar motor reposar 5 minutos",
          "3. Extraer y revisar varilla aceite",
          "4. Agregar aceite especificado hasta máximo",
          "5. Si sigue bajo, revisar fugas",
          "6. Si consume mucho, revisar motivo",
          "7. Cambiar aceite y filtro si atrasado",
        ]),
        estimatedTime: 30,
        estimatedCost: 50.0,
        requiredParts: JSON.stringify(["Aceite motor (según especificación)"]),
        tools: JSON.stringify(["Varilla aceite", "Embudo", "Trapo limpio"]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: true,
        severity: "MEDIUM",
        computerRequired: false,
      },
    }),
    prisma.faultDatabase.create({
      data: {
        title: "Dirección Dura o Pesada",
        code: "P0857",
        description:
          "Volante muy difícil de girar, dirección requiere mucho esfuerzo",
        symptoms:
          "Volante pesado, difícil de girar, especialmente estacionamiento",
        keywords: JSON.stringify([
          "dirección",
          "pesada",
          "dura",
          "hidráulica",
          "volante",
          "esfuerzo",
        ]),
        affectedSystems: JSON.stringify(["steering", "hydraulic"]),
        vehicleTypes: JSON.stringify(["auto", "camión", "suv"]),
        vehicleMakes: null,
        commonCauses: JSON.stringify([
          "Líquido dirección bajo",
          "Bomba dirección falha",
          "Correa distribución desgastada",
          "Tubería pinzada",
          "Pastilla desgastada",
        ]),
        solutionProcess: JSON.stringify([
          "1. Revisar nivel líquido dirección",
          "2. Agregar si bajo",
          "3. Revisar correa distribución",
          "4. Inspeccionar bomba dirección",
          "5. Revisar tuberías por daño",
          "6. Probar con motor encendido",
          "7. Cambiar líquido si sucio",
        ]),
        estimatedTime: 90,
        estimatedCost: 200.0,
        requiredParts: JSON.stringify([
          "Líquido dirección",
          "Posible bomba",
          "Correa",
        ]),
        tools: JSON.stringify(["Llaves", "Extractor correa", "Bomba líquido"]),
        relatedFaults: null,
        imagesUrls: null,
        videoUrl: null,
        relatedDocLink: null,
        isCommon: false,
        severity: "MEDIUM",
        computerRequired: false,
      },
    }),
  ]);

  console.log("✓ 7 fallas creadas en base de conocimiento");

  // ============================================
  // CREAR COTIZACIONES
  // ============================================
  const quotations = await Promise.all([
    prisma.quotation.create({
      data: {
        quotationNumber: "COT-2024-001",
        clientId: clients[0].id,
        vehicleId: vehicles[0].id,
        status: "PENDING",
        estimatedTotal: 450.0,
        diagnosisDate: new Date("2024-03-15"),
        diagnosisMechanicNotes:
          "Revisión completa solicitada. Revisar frenos y aceite",
        externalDiagnosisCode: null,
        quotationDate: new Date("2024-03-15"),
      },
    }),
    prisma.quotation.create({
      data: {
        quotationNumber: "COT-2024-002",
        clientId: clients[1].id,
        vehicleId: vehicles[2].id,
        status: "ACCEPTED",
        estimatedTotal: 280.0,
        diagnosisDate: new Date("2024-03-16"),
        diagnosisMechanicNotes: "Cambio de aceite y filtro",
        externalDiagnosisCode: null,
        quotationDate: new Date("2024-03-16"),
      },
    }),
    prisma.quotation.create({
      data: {
        quotationNumber: "COT-2024-003",
        clientId: clients[2].id,
        vehicleId: vehicles[3].id,
        status: "IN_DIAGNOSIS",
        estimatedTotal: 750.0,
        diagnosisDate: new Date("2024-03-18"),
        diagnosisMechanicNotes: "Revisar dirección y batería",
        externalDiagnosisCode: "P0001",
        quotationDate: new Date("2024-03-18"),
      },
    }),
  ]);

  console.log("✓ 3 cotizaciones creadas");

  // ============================================
  // CREAR ÓRDENES DE TRABAJO
  // ============================================
  const workOrders = await Promise.all([
    prisma.workOrder.create({
      data: {
        workOrderNumber: "WO-2024-001",
        quotationId: quotations[1].id,
        clientId: clients[1].id,
        vehicleId: vehicles[2].id,
        status: "COMPLETED",
        startDate: new Date("2024-03-16 09:00"),
        completionDate: new Date("2024-03-16 11:30"),
        estimatedHours: 2.0,
        actualHours: 2.5,
        mechanic: "Carlos Ruiz",
        notes: "Cambio aceite 5W40 y filtro. Vehículo en perfect estado",
        totalCost: 280.0,
      },
    }),
    prisma.workOrder.create({
      data: {
        workOrderNumber: "WO-2024-002",
        quotationId: quotations[0].id,
        clientId: clients[0].id,
        vehicleId: vehicles[0].id,
        status: "IN_PROGRESS",
        startDate: new Date("2024-03-19 08:00"),
        completionDate: null,
        estimatedHours: 4.0,
        actualHours: 2.0,
        mechanic: "Miguel Sánchez",
        notes:
          "Revisión completa en proceso. Frenos OK. Esperando aprobación para cambio batería",
        totalCost: 450.0,
      },
    }),
  ]);

  console.log("✓ 2 órdenes de trabajo creadas");

  // ============================================
  // CREAR DIAGNÓSTICOS
  // ============================================
  await Promise.all([
    prisma.diagnostic.create({
      data: {
        quotationId: quotations[0].id,
        vehicleId: vehicles[0].id,
        faultType: "MANUAL_INSPECTION",
        faultCodes: null,
        symptoms: "Ruido en frenos, batería débil",
        affectedSystems: JSON.stringify(["braking", "electrical"]),
        severity: "MEDIUM",
        detailedAnalysis:
          "Inspección manual realizada. Pastillas freno con 30% desgaste. Batería con 3.5 años",
        recommendedFix:
          "Cambiar pastillas freno y reemplazar batería por precaución",
        relatedFaults: JSON.stringify([faults[0].id, faults[3].id]),
        imagesUrls: null,
      },
    }),
    prisma.diagnostic.create({
      data: {
        quotationId: quotations[1].id,
        vehicleId: vehicles[2].id,
        faultType: "MANUAL_INSPECTION",
        faultCodes: null,
        symptoms: "Mantenimiento preventivo",
        affectedSystems: JSON.stringify(["engine", "lubrication"]),
        severity: "LOW",
        detailedAnalysis: "Inspección visual completada. Todo OK",
        recommendedFix:
          "Ejecutar cambio aceite y filtro. Revisar nuevamente en 6 meses",
        relatedFaults: null,
        imagesUrls: null,
      },
    }),
  ]);

  console.log("✓ 2 diagnósticos creados");

  // ============================================
  // CREAR ITEMS DE ORDEN DE TRABAJO
  // ============================================
  await Promise.all([
    prisma.orderItem.create({
      data: {
        workOrderId: workOrders[0].id,
        productId: products[3].id, // OIL-005W40
        quantity: 1,
        unitPrice: 45.0,
        subtotal: 45.0,
      },
    }),
    prisma.orderItem.create({
      data: {
        workOrderId: workOrders[0].id,
        productId: products[8].id, // OIL-FILTER
        quantity: 1,
        unitPrice: 20.0,
        subtotal: 20.0,
      },
    }),
    prisma.orderItem.create({
      data: {
        workOrderId: workOrders[1].id,
        productId: products[0].id, // BATT-001
        quantity: 1,
        unitPrice: 120.0,
        subtotal: 120.0,
      },
    }),
    prisma.orderItem.create({
      data: {
        workOrderId: workOrders[1].id,
        productId: products[9].id, // BRAKE-PAD
        quantity: 1,
        unitPrice: 85.0,
        subtotal: 85.0,
      },
    }),
  ]);

  console.log("✓ 4 items de orden de trabajo creados");

  // ============================================
  // CREAR VENTAS
  // ============================================
  const sales = await Promise.all([
    prisma.sale.create({
      data: {
        saleNumber: "V-2024-001",
        workOrderId: workOrders[0].id,
        clientId: clients[1].id,
        paymentMethod: "tarjeta_crédito",
        paymentStatus: "paid",
        invoiceNumber: "INV-2024-001",
        saleDate: new Date("2024-03-16 12:00"),
        subtotal: 65.0,
        tax: 13.65,
        discount: 0,
        total: 78.65,
        notes: "Pago recibido correctamente",
      },
    }),
  ]);

  console.log("✓ 1 venta creada");

  // ============================================
  // CREAR ITEMS DE COTIZACIÓN
  // ============================================
  await Promise.all([
    prisma.quotationItem.create({
      data: {
        quotationId: quotations[0].id,
        productId: products[0].id, // BATT-001
        quantity: 1,
        unitPrice: 120.0,
        subtotal: 120.0,
      },
    }),
    prisma.quotationItem.create({
      data: {
        quotationId: quotations[0].id,
        productId: products[9].id, // BRAKE-PAD
        quantity: 1,
        unitPrice: 85.0,
        subtotal: 85.0,
      },
    }),
    prisma.quotationItem.create({
      data: {
        quotationId: quotations[1].id,
        productId: products[3].id, // OIL-005W40
        quantity: 1,
        unitPrice: 45.0,
        subtotal: 45.0,
      },
    }),
    prisma.quotationItem.create({
      data: {
        quotationId: quotations[1].id,
        productId: products[8].id, // OIL-FILTER
        quantity: 1,
        unitPrice: 20.0,
        subtotal: 20.0,
      },
    }),
    prisma.quotationItem.create({
      data: {
        quotationId: quotations[2].id,
        productId: products[0].id, // BATT-001
        quantity: 1,
        unitPrice: 120.0,
        subtotal: 120.0,
      },
    }),
  ]);

  console.log("✓ 5 items de cotización creados");

  console.log("✅ ¡Base de datos poblada exitosamente!");
  console.log(`
📊 Resumen de datos creados:
   - 8 Clientes
   - 11 Vehículos
   - 21 Productos
   - 7 Fallas en BD
   - 3 Cotizaciones (1 Pendiente, 1 Aceptada, 1 En Diagnóstico)
   - 2 Órdenes de Trabajo (1 Completada, 1 En Progreso)
   - 2 Diagnósticos
   - 1 Venta completada
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error al sembrar datos:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

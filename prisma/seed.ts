import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando Seed v3.0: Sistema AutoMec Completo 🇧🇴");

  // 1. LIMPIEZA TOTAL
  console.log("🧹 Vaciando base de datos...");
  await prisma.sale.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.diagnostic.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.faultDatabase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // 2. USUARIO ADMIN
  const admin = await prisma.user.create({
    data: {
      name: "Rossmel Max Abasto",
      email: "rossmel.abasto@udabol.edu.bo",
      password: "$2b$10$zP7jmwzLmj2l/eFk80oZVu7mNtSq/vB35Gr1XE/LaU8bV6LI6.pY6", // password123
      role: "ADMIN",
    },
  });

  // 3. BASE DE FALLAS (50 fallas comunes)
  console.log("🔧 Creando base de fallas...");
  const faultData = [
    {
      title: "Falla en el sistema de encendido",
      code: "P0300",
      description: "Detección de fallas en el sistema de encendido",
      symptoms: "Motor no arranca, luces de check engine encendidas",
      keywords: JSON.stringify(["encendido", "motor", "check engine"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      vehicleMakes: JSON.stringify(["Toyota", "Nissan"]),
      commonCauses: JSON.stringify(["Bujías defectuosas", "Bobina dañada"]),
      solutionProcess:
        "1. Revisar códigos DTC\n2. Inspeccionar bujías\n3. Verificar bobinas\n4. Reemplazar componentes defectuosos",
      estimatedTime: 120,
      estimatedCost: 150.0,
      requiredParts: JSON.stringify(["Bujías", "Bobinas"]),
      tools: JSON.stringify(["Escáner OBD", "Llaves"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "Problemas en el sistema de frenos",
      description: "Ruido al frenar, vibraciones",
      symptoms: "Ruido metálico al frenar, pedal blando",
      keywords: JSON.stringify(["frenos", "ruido", "vibración"]),
      affectedSystems: JSON.stringify(["brakes"]),
      vehicleTypes: JSON.stringify(["auto", "truck", "moto"]),
      commonCauses: JSON.stringify(["Pastillas desgastadas", "Discos rayados"]),
      solutionProcess:
        "1. Inspeccionar pastillas\n2. Medir espesor de discos\n3. Reemplazar componentes desgastados",
      estimatedTime: 90,
      estimatedCost: 200.0,
      requiredParts: JSON.stringify(["Pastillas de freno", "Discos"]),
      tools: JSON.stringify(["Calibrador", "Llaves"]),
      isCommon: true,
      severity: "CRITICAL",
      computerRequired: false,
    },
    {
      title: "Falla en suspensión delantera",
      description: "Vibraciones al conducir",
      symptoms: "Vibraciones en volante, ruido de golpes",
      keywords: JSON.stringify(["suspensión", "vibración", "ruido"]),
      affectedSystems: JSON.stringify(["suspension"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify(["Amortiguadores dañados", "Bujes rotos"]),
      solutionProcess:
        "1. Inspeccionar amortiguadores\n2. Revisar bujes\n3. Verificar rótulas",
      estimatedTime: 180,
      estimatedCost: 300.0,
      requiredParts: JSON.stringify(["Amortiguadores", "Bujes"]),
      tools: JSON.stringify(["Llave de impacto", "Calibrador"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Problemas eléctricos - Batería descargada",
      description: "Vehículo no arranca",
      symptoms: "Motor no gira, luces débiles",
      keywords: JSON.stringify(["batería", "eléctrico", "no arranca"]),
      affectedSystems: JSON.stringify(["electrical"]),
      vehicleTypes: JSON.stringify(["auto", "truck", "moto"]),
      commonCauses: JSON.stringify([
        "Batería descargada",
        "Alternador defectuoso",
      ]),
      solutionProcess:
        "1. Verificar voltaje de batería\n2. Probar alternador\n3. Cargar o reemplazar batería",
      estimatedTime: 60,
      estimatedCost: 100.0,
      requiredParts: JSON.stringify(["Batería"]),
      tools: JSON.stringify(["Multímetro", "Cargador de batería"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: false,
    },
    {
      title: "Falla en transmisión automática",
      code: "P0700",
      description: "Códigos de transmisión",
      symptoms: "Cambios bruscos, check engine",
      keywords: JSON.stringify(["transmisión", "automática", "cambios"]),
      affectedSystems: JSON.stringify(["transmission"]),
      vehicleTypes: JSON.stringify(["auto"]),
      vehicleMakes: JSON.stringify(["Toyota", "Nissan"]),
      commonCauses: JSON.stringify([
        "Sensor de velocidad defectuoso",
        "Válvula solenoide",
      ]),
      solutionProcess:
        "1. Leer códigos DTC\n2. Verificar fluidos\n3. Inspeccionar sensores",
      estimatedTime: 120,
      estimatedCost: 250.0,
      requiredParts: JSON.stringify(["Sensores", "Solenoide"]),
      tools: JSON.stringify(["Escáner OBD", "Herramientas de transmisión"]),
      isCommon: false,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "Sobrecalentamiento del motor",
      code: "P0217",
      description: "Motor alcanza temperaturas peligrosas",
      symptoms:
        "Aguja de temperatura en rojo, vapor del capó, olor a anticongelante",
      keywords: JSON.stringify([
        "temperatura",
        "refrigeración",
        "sobrecalentamiento",
      ]),
      affectedSystems: JSON.stringify(["cooling"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Termostato atascado",
        "Fuga de refrigerante",
        "Ventilador inoperante",
      ]),
      solutionProcess:
        "1. Dejar enfriar motor\n2. Revisar nivel de refrigerante\n3. Probar termostato\n4. Inspeccionar mangueras y radiador",
      estimatedTime: 90,
      estimatedCost: 180.0,
      requiredParts: JSON.stringify(["Termostato", "Refrigerante"]),
      tools: JSON.stringify(["Multímetro", "Probador de presión"]),
      isCommon: true,
      severity: "CRITICAL",
      computerRequired: false,
    },
    {
      title: "Fuga de escape / Ruido excesivo",
      description: "Escape con fuga o silenciador dañado",
      symptoms: "Ruido fuerte del motor, olor a gases dentro del habitáculo",
      keywords: JSON.stringify(["escape", "ruido", "fuga"]),
      affectedSystems: JSON.stringify(["exhaust"]),
      vehicleTypes: JSON.stringify(["auto", "truck", "moto"]),
      commonCauses: JSON.stringify([
        "Junta de escape rota",
        "Silenciador perforado",
        "Tubo oxidado",
      ]),
      solutionProcess:
        "1. Inspeccionar visualmente el sistema\n2. Localizar fuga con humo\n3. Soldar o reemplazar sección dañada",
      estimatedTime: 60,
      estimatedCost: 120.0,
      requiredParts: JSON.stringify(["Junta de escape", "Silenciador"]),
      tools: JSON.stringify(["Soldadora", "Elevador"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Sensor de oxígeno defectuoso",
      code: "P0135",
      description: "Mal funcionamiento del sensor O2",
      symptoms:
        "Pérdida de potencia, alto consumo de combustible, luz Check Engine",
      keywords: JSON.stringify(["oxígeno", "sensor", "combustible"]),
      affectedSystems: JSON.stringify(["engine", "emissions"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Sensor contaminado",
        "Cableado dañado",
        "Sensor agotado",
      ]),
      solutionProcess:
        "1. Escanear códigos\n2. Probar voltaje del sensor\n3. Reemplazar sensor defectuoso",
      estimatedTime: 45,
      estimatedCost: 130.0,
      requiredParts: JSON.stringify(["Sensor O2"]),
      tools: JSON.stringify(["Escáner OBD", "Multímetro"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: true,
    },
    {
      title: "Alternador no carga",
      description: "El alternador no suministra corriente suficiente",
      symptoms: "Luz de batería encendida, luces tenues, fallos eléctricos",
      keywords: JSON.stringify(["alternador", "carga", "batería"]),
      affectedSystems: JSON.stringify(["electrical"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Alternador defectuoso",
        "Correa rota",
        "Regulador de voltaje dañado",
      ]),
      solutionProcess:
        "1. Medir voltaje en bornes\n2. Verificar tensión de correa\n3. Reemplazar alternador si es necesario",
      estimatedTime: 90,
      estimatedCost: 220.0,
      requiredParts: JSON.stringify(["Alternador", "Correa"]),
      tools: JSON.stringify(["Multímetro", "Juego de llaves"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: false,
    },
    {
      title: "Embrague patina o no desacopla",
      description: "Problemas en el sistema de embrague",
      symptoms: "Dificultad para cambiar marchas, olor a quemado, patinamiento",
      keywords: JSON.stringify(["embrague", "clutch", "transmisión manual"]),
      affectedSystems: JSON.stringify(["transmission"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Disco de embrague desgastado",
        "Cable o cilindro hidráulico defectuoso",
      ]),
      solutionProcess:
        "1. Verificar recorrido del pedal\n2. Inspeccionar nivel de líquido hidráulico\n3. Reemplazar kit de embrague",
      estimatedTime: 240,
      estimatedCost: 450.0,
      requiredParts: JSON.stringify(["Kit de embrague", "Collarín"]),
      tools: JSON.stringify(["Elevador", "Herramientas de transmisión"]),
      isCommon: false,
      severity: "HIGH",
      computerRequired: false,
    },
    {
      title: "Aire acondicionado no enfría",
      description: "Sistema de climatización inoperante",
      symptoms: "Aire caliente por las rejillas, compresor no arranca",
      keywords: JSON.stringify(["aire acondicionado", "climatización", "gas"]),
      affectedSystems: JSON.stringify(["hvac"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Falta de gas refrigerante",
        "Compresor dañado",
        "Fuga en el sistema",
      ]),
      solutionProcess:
        "1. Verificar presión del sistema\n2. Recargar gas con tinte UV\n3. Reparar fuga y reemplazar componentes",
      estimatedTime: 120,
      estimatedCost: 160.0,
      requiredParts: JSON.stringify(["Gas R134a", "Compresor"]),
      tools: JSON.stringify(["Manómetros", "Detector de fugas"]),
      isCommon: true,
      severity: "LOW",
      computerRequired: false,
    },
    {
      title: "Dirección asistida dura o ruidosa",
      description: "Problemas en la dirección hidráulica o eléctrica",
      symptoms: "Volante pesado, ruido al girar, vibraciones",
      keywords: JSON.stringify(["dirección", "asistida", "volante"]),
      affectedSystems: JSON.stringify(["steering"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Bajo nivel de líquido hidráulico",
        "Bomba de dirección defectuosa",
        "Correa suelta",
      ]),
      solutionProcess:
        "1. Revisar nivel y estado del fluido\n2. Inspeccionar correa\n3. Reemplazar bomba si es necesario",
      estimatedTime: 60,
      estimatedCost: 140.0,
      requiredParts: JSON.stringify([
        "Líquido de dirección",
        "Bomba hidráulica",
      ]),
      tools: JSON.stringify(["Llave de correa", "Recipiente para drenar"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Falla en el sistema EVAP (emisiones)",
      code: "P0442",
      description: "Fuga pequeña detectada en el sistema de evaporación",
      symptoms: "Luz Check Engine, olor a gasolina ocasional",
      keywords: JSON.stringify(["EVAP", "emisiones", "fuga"]),
      affectedSystems: JSON.stringify(["emissions"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Tapón de gasolina suelto",
        "Válvula de purga defectuosa",
        "Manguera agrietada",
      ]),
      solutionProcess:
        "1. Apretar tapón de combustible\n2. Escanear y borrar códigos\n3. Realizar prueba de humo para localizar fuga",
      estimatedTime: 60,
      estimatedCost: 90.0,
      requiredParts: JSON.stringify(["Tapón de gasolina", "Válvula de purga"]),
      tools: JSON.stringify(["Máquina de humo", "Escáner OBD"]),
      isCommon: true,
      severity: "LOW",
      computerRequired: true,
    },
    {
      title: "Inyectores de combustible obstruidos",
      code: "P0171",
      description: "Mezcla pobre de combustible (banco 1)",
      symptoms: "Pérdida de potencia, ralentí inestable, tirones",
      keywords: JSON.stringify(["inyectores", "combustible", "mezcla pobre"]),
      affectedSystems: JSON.stringify(["fuel"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Inyectores sucios",
        "Filtro de combustible tapado",
        "Presión de combustible baja",
      ]),
      solutionProcess:
        "1. Escanear códigos DTC\n2. Limpiar inyectores con ultrasonido\n3. Reemplazar filtro de combustible",
      estimatedTime: 120,
      estimatedCost: 200.0,
      requiredParts: JSON.stringify([
        "Limpiador de inyectores",
        "Filtro de combustible",
      ]),
      tools: JSON.stringify(["Kit de limpieza de inyectores", "Multímetro"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: true,
    },
    {
      title: "Radiador con fuga",
      description: "Pérdida de refrigerante por radiador dañado",
      symptoms:
        "Charco debajo del auto, sobrecalentamiento, nivel bajo constante",
      keywords: JSON.stringify(["radiador", "fuga", "refrigerante"]),
      affectedSystems: JSON.stringify(["cooling"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Impacto de piedra",
        "Corrosión",
        "Junta del tanque deteriorada",
      ]),
      solutionProcess:
        "1. Localizar fuga visualmente\n2. Probar presión del sistema\n3. Reparar con soldadura o reemplazar radiador",
      estimatedTime: 150,
      estimatedCost: 250.0,
      requiredParts: JSON.stringify(["Radiador", "Refrigerante"]),
      tools: JSON.stringify(["Probador de presión", "Llaves"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: false,
    },
    {
      title: "Sensor de posición del cigüeñal (CKP) defectuoso",
      code: "P0335",
      description: "Señal del sensor CKP fuera de rango",
      symptoms:
        "Motor no arranca, paradas repentinas, cuenta revoluciones errática",
      keywords: JSON.stringify(["cigüeñal", "sensor", "CKP"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Sensor defectuoso",
        "Cableado dañado",
        "Distancia incorrecta al volante",
      ]),
      solutionProcess:
        "1. Verificar señal con osciloscopio\n2. Inspeccionar conector y cableado\n3. Reemplazar sensor CKP",
      estimatedTime: 60,
      estimatedCost: 110.0,
      requiredParts: JSON.stringify(["Sensor CKP"]),
      tools: JSON.stringify(["Osciloscopio", "Multímetro"]),
      isCommon: false,
      severity: "CRITICAL",
      computerRequired: true,
    },
    {
      title: "Correa de distribución rota o desgastada",
      description: "Falla catastrófica del motor por rotura de correa",
      symptoms:
        "Motor no gira, ruido metálico al intentar arrancar (motor de interferencia)",
      keywords: JSON.stringify(["correa", "distribución", "rotura"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Falta de mantenimiento",
        "Tensor defectuoso",
        "Exceso de kilometraje",
      ]),
      solutionProcess:
        "1. Verificar daños internos (compresión)\n2. Reemplazar correa, tensor y bomba de agua\n3. Rectificar culata si hay daños",
      estimatedTime: 300,
      estimatedCost: 700.0,
      requiredParts: JSON.stringify(["Kit de distribución", "Bomba de agua"]),
      tools: JSON.stringify([
        "Herramientas de sincronización",
        "Llave dinamométrica",
      ]),
      isCommon: false,
      severity: "CRITICAL",
      computerRequired: false,
    },
    {
      title: "Falla en el cuerpo de aceleración electrónico",
      code: "P2135",
      description: "Problema de correlación entre sensores del acelerador",
      symptoms: "Aceleración errática, modo de emergencia, ralentí alto o bajo",
      keywords: JSON.stringify(["acelerador", "electrónico", "cuerpo"]),
      affectedSystems: JSON.stringify(["engine", "electrical"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Suciedad en la mariposa",
        "Sensor TPS defectuoso",
        "Falla en actuador eléctrico",
      ]),
      solutionProcess:
        "1. Limpiar cuerpo de aceleración\n2. Escanear y recalibrar\n3. Reemplazar cuerpo si es necesario",
      estimatedTime: 60,
      estimatedCost: 200.0,
      requiredParts: JSON.stringify(["Limpiador de cuerpo de aceleración"]),
      tools: JSON.stringify(["Escáner OBD", "Destornilladores"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "Tubo de escape obstruido (catalizador tapado)",
      code: "P0420",
      description: "Eficiencia del catalizador por debajo del umbral",
      symptoms:
        "Pérdida severa de potencia, ralentí inestable, olor a huevo podrido",
      keywords: JSON.stringify(["catalizador", "obstrucción", "escape"]),
      affectedSystems: JSON.stringify(["exhaust", "emissions"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Mezcla rica prolongada",
        "Aceite en el escape",
        "Envejecimiento del catalizador",
      ]),
      solutionProcess:
        "1. Medir contrapresión del escape\n2. Probar sonda lambda\n3. Reemplazar catalizador",
      estimatedTime: 120,
      estimatedCost: 400.0,
      requiredParts: JSON.stringify(["Convertidor catalítico"]),
      tools: JSON.stringify(["Manómetro de contrapresión", "Soldadora"]),
      isCommon: false,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "ABS / Sensor de velocidad de rueda defectuoso",
      code: "C0035",
      description: "Falla en sensor de velocidad de rueda delantera izquierda",
      symptoms: "Luz ABS encendida, frenado irregular, pérdida de tracción",
      keywords: JSON.stringify(["ABS", "sensor", "velocidad"]),
      affectedSystems: JSON.stringify(["brakes"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Sensor sucio o roto",
        "Cable cortado",
        "Anillo dentado dañado",
      ]),
      solutionProcess:
        "1. Escanear códigos ABS\n2. Medir resistencia del sensor\n3. Limpiar o reemplazar sensor",
      estimatedTime: 45,
      estimatedCost: 100.0,
      requiredParts: JSON.stringify(["Sensor ABS"]),
      tools: JSON.stringify(["Escáner ABS", "Multímetro"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: true,
    },
    {
      title: "Bomba de combustible defectuosa",
      description: "El motor no recibe suficiente combustible",
      symptoms:
        "Motor gira pero no arranca, fallos en alta demanda, zumbido excesivo",
      keywords: JSON.stringify(["bomba", "combustible", "presión"]),
      affectedSystems: JSON.stringify(["fuel"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Desgaste por kilometraje",
        "Contaminación del tanque",
        "Relé defectuoso",
      ]),
      solutionProcess:
        "1. Medir presión de combustible\n2. Verificar alimentación eléctrica a la bomba\n3. Reemplazar bomba (bajar tanque)",
      estimatedTime: 180,
      estimatedCost: 350.0,
      requiredParts: JSON.stringify(["Bomba de combustible", "Filtro"]),
      tools: JSON.stringify(["Manómetro de presión", "Elevador"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: false,
    },
    {
      title: "Termostato atascado abierto",
      code: "P0128",
      description: "Temperatura del refrigerante por debajo de lo esperado",
      symptoms:
        "Calefacción deficiente, motor tarda en calentar, consumo elevado",
      keywords: JSON.stringify(["termostato", "temperatura", "abierto"]),
      affectedSystems: JSON.stringify(["cooling"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify(["Termostato trabado", "Resorte débil"]),
      solutionProcess:
        "1. Monitorear temperatura con escáner\n2. Reemplazar termostato\n3. Purgar sistema de refrigeración",
      estimatedTime: 60,
      estimatedCost: 80.0,
      requiredParts: JSON.stringify(["Termostato", "Junta", "Refrigerante"]),
      tools: JSON.stringify(["Juego de llaves", "Recipiente"]),
      isCommon: true,
      severity: "LOW",
      computerRequired: true,
    },
    {
      title: "Válvula EGR obstruida",
      code: "P0401",
      description: "Flujo insuficiente de recirculación de gases",
      symptoms: "Tirones a baja velocidad, ralentí inestable, luz de motor",
      keywords: JSON.stringify(["EGR", "válvula", "recirculación"]),
      affectedSystems: JSON.stringify(["emissions", "engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Acumulación de carbón",
        "Válvula atascada",
      ]),
      solutionProcess:
        "1. Desmontar y limpiar válvula EGR\n2. Limpiar conductos del múltiple\n3. Reemplazar si no funciona",
      estimatedTime: 90,
      estimatedCost: 120.0,
      requiredParts: JSON.stringify(["Limpiador de carbón", "Junta EGR"]),
      tools: JSON.stringify(["Juego de llaves", "Cepillo de alambre"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: true,
    },
    {
      title: "Rotura de espiral del airbag (clockspring)",
      code: "B1000",
      description: "Circuito del airbag del conductor abierto",
      symptoms: "Luz de airbag encendida, botones del volante no funcionan",
      keywords: JSON.stringify(["airbag", "clockspring", "volante"]),
      affectedSystems: JSON.stringify(["safety", "electrical"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Desgaste por giro",
        "Mala instalación previa",
      ]),
      solutionProcess:
        "1. Escanear códigos SRS\n2. Verificar resistencia del espiral\n3. Reemplazar clockspring y alinear",
      estimatedTime: 90,
      estimatedCost: 180.0,
      requiredParts: JSON.stringify(["Clockspring"]),
      tools: JSON.stringify(["Escáner SRS", "Extractor de volante"]),
      isCommon: true,
      severity: "CRITICAL",
      computerRequired: true,
    },
    {
      title: "Fuga en el múltiple de admisión",
      description: "Entrada de aire no medida por el sensor MAF",
      symptoms: "Ralentí alto o inestable, código de mezcla pobre (P0171)",
      keywords: JSON.stringify(["admisión", "fuga", "vacío"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Junta de admisión rota",
        "Manguera de vacío suelta",
        "Colector agrietado",
      ]),
      solutionProcess:
        "1. Rociar limpiador de carburador para detectar cambios en ralentí\n2. Apretar o reemplazar juntas\n3. Reemplazar mangueras dañadas",
      estimatedTime: 60,
      estimatedCost: 80.0,
      requiredParts: JSON.stringify([
        "Junta de admisión",
        "Mangueras de vacío",
      ]),
      tools: JSON.stringify(["Spray limpiador", "Juego de llaves"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Calentadores del motor diésel (bujías de precalentamiento)",
      description: "Dificultad para arrancar en frío en motor diésel",
      symptoms:
        "Humo blanco al arrancar, motor gira mucho tiempo antes de encender",
      keywords: JSON.stringify(["diésel", "precalentamiento", "bujías"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["truck"]),
      commonCauses: JSON.stringify([
        "Bujías quemadas",
        "Relé de calentadores defectuoso",
      ]),
      solutionProcess:
        "1. Medir resistencia de bujías\n2. Verificar voltaje del relé\n3. Reemplazar bujías defectuosas",
      estimatedTime: 60,
      estimatedCost: 130.0,
      requiredParts: JSON.stringify(["Bujías de precalentamiento"]),
      tools: JSON.stringify(["Multímetro", "Llave de bujías"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Falla en el módulo de control de la carrocería (BCM)",
      description: "Problemas eléctricos diversos en accesorios",
      symptoms:
        "Vidrios eléctricos no funcionan, luces interiores parpadean, cierre centralizado inoperante",
      keywords: JSON.stringify(["BCM", "módulo", "carrocería"]),
      affectedSystems: JSON.stringify(["electrical", "body"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Corto circuito",
        "Entrada de agua",
        "Fallo interno del módulo",
      ]),
      solutionProcess:
        "1. Escanear red CAN\n2. Verificar alimentación y masa del BCM\n3. Reprogramar o reemplazar BCM",
      estimatedTime: 120,
      estimatedCost: 350.0,
      requiredParts: JSON.stringify(["Módulo BCM"]),
      tools: JSON.stringify(["Escáner avanzado", "Multímetro"]),
      isCommon: false,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "Árbol de levas / Sensor CMP defectuoso",
      code: "P0340",
      description: "Señal del sensor de posición del árbol de levas ausente",
      symptoms: "Arranque prolongado, pérdida de potencia, luz Check Engine",
      keywords: JSON.stringify(["levas", "sensor", "CMP"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Sensor sucio",
        "Cableado roto",
        "Sensor defectuoso",
      ]),
      solutionProcess:
        "1. Verificar señal con osciloscopio\n2. Limpiar o reemplazar sensor\n3. Verificar sincronización mecánica",
      estimatedTime: 45,
      estimatedCost: 90.0,
      requiredParts: JSON.stringify(["Sensor CMP"]),
      tools: JSON.stringify(["Osciloscopio", "Llaves"]),
      isCommon: true,
      severity: "HIGH",
      computerRequired: true,
    },
    {
      title: "Amortiguadores traseros desgastados",
      description: "Pérdida de estabilidad y confort",
      symptoms: "Rebote excesivo en baches, desgaste irregular de neumáticos",
      keywords: JSON.stringify(["amortiguadores", "suspensión", "rebote"]),
      affectedSystems: JSON.stringify(["suspension"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Desgaste por kilometraje",
        "Fuga de aceite del amortiguador",
      ]),
      solutionProcess:
        "1. Inspeccionar fugas\n2. Realizar prueba de rebote\n3. Reemplazar amortiguadores en pares",
      estimatedTime: 90,
      estimatedCost: 200.0,
      requiredParts: JSON.stringify(["Amortiguadores traseros"]),
      tools: JSON.stringify(["Llaves", "Elevador"]),
      isCommon: true,
      severity: "MEDIUM",
      computerRequired: false,
    },
    {
      title: "Sensor de flujo de aire (MAF) sucio",
      code: "P0101",
      description: "Rendimiento del circuito MAF fuera de rango",
      symptoms: "Vacilación al acelerar, ralentí pobre, humo negro",
      keywords: JSON.stringify(["MAF", "flujo de aire", "sucio"]),
      affectedSystems: JSON.stringify(["engine"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Polvo o aceite en el sensor",
        "Filtro de aire sucio",
      ]),
      solutionProcess:
        "1. Limpiar sensor MAF con spray especial\n2. Reemplazar filtro de aire\n3. Probar valores con escáner",
      estimatedTime: 30,
      estimatedCost: 40.0,
      requiredParts: JSON.stringify(["Limpiador MAF"]),
      tools: JSON.stringify(["Destornillador de seguridad"]),
      isCommon: true,
      severity: "LOW",
      computerRequired: true,
    },
    {
      title: "Cilindro maestro de freno con fuga interna",
      description: "Pedal de freno se hunde lentamente",
      symptoms:
        "Pedal esponjoso, pérdida de presión de frenado sin fuga externa",
      keywords: JSON.stringify(["freno", "cilindro maestro", "hundimiento"]),
      affectedSystems: JSON.stringify(["brakes"]),
      vehicleTypes: JSON.stringify(["auto", "truck"]),
      commonCauses: JSON.stringify([
        "Sellos internos desgastados",
        "Líquido de frenos contaminado",
      ]),
      solutionProcess:
        "1. Probar fugas internas (presión constante)\n2. Purgar sistema\n3. Reemplazar cilindro maestro",
      estimatedTime: 90,
      estimatedCost: 160.0,
      requiredParts: JSON.stringify(["Cilindro maestro", "Líquido de frenos"]),
      tools: JSON.stringify(["Llave para líneas de freno", "Purgador"]),
      isCommon: false,
      severity: "CRITICAL",
      computerRequired: false,
    },
  ];

  for (const fault of faultData) {
    await prisma.faultDatabase.create({
      data: fault,
    });
  }

  // 4. PRODUCTOS E INVENTARIO (60 productos variados)
  const categories = [
    "Lubricantes",
    "Frenos",
    "Filtros",
    "Encendido",
    "Suspensión",
    "Eléctrico",
    "Llantas",
  ];
  const productsData = [];
  for (let i = 1; i <= 60; i++) {
    const category = categories[i % categories.length];
    const p = await prisma.product.create({
      data: {
        code: `SKU-${2000 + i}`,
        name: `${category} Repuesto Mod-${i}`,
        category: category,
        price: 50 + Math.floor(Math.random() * 800),
        cost: 30 + Math.floor(Math.random() * 400),
        quantity: 30 + Math.floor(Math.random() * 100),
        unit: "pza",
        minStock: 5,
      },
    });
    productsData.push(p);
  }

  // 4. CLIENTES Y VEHÍCULOS (30 Clientes / 45 Vehículos)
  const names = [
    "Zenón Mamani",
    "Lorgia Maire",
    "Ramiro Quispe",
    "Faustino Choque",
    "Martha Vargas",
    "Boris Guzmán",
    "Gualberto Rojas",
    "Ximena Condori",
    "Oscar Torrico",
    "Nila Villaroel",
  ];
  const zones = [
    "Quillacollo",
    "Sacaba",
    "Cala Cala",
    "Zona Sud",
    "Paso",
    "Vinto",
    "Tiquipaya",
  ];
  const carMakes = ["Toyota", "Suzuki", "Nissan", "Mitsubishi", "King Long"];
  const carModels: any = {
    Toyota: ["Hilux", "Corolla"],
    Suzuki: ["Grand Vitara", "Swift"],
    Nissan: ["Frontier", "Patrol"],
    Mitsubishi: ["L200"],
    "King Long": ["Kingwin"],
  };

  const createdVehicles = [];
  for (let i = 0; i < 30; i++) {
    const client = await prisma.client.create({
      data: {
        name: `${names[i % 10]} ${i + 1}`,
        phone: `7${Math.floor(6000000 + Math.random() * 1000000)}`,
        address: `${zones[i % zones.length]}, Cochabamba`,
        email: `cliente${i}@correo.bo`,
      },
    });

    // Cada cliente tiene 1 o 2 vehículos
    const numVehicles = i % 5 === 0 ? 2 : 1;
    for (let j = 0; j < numVehicles; j++) {
      const make = carMakes[Math.floor(Math.random() * carMakes.length)];
      const v = await prisma.vehicle.create({
        data: {
          clientId: client.id,
          make: make,
          model:
            carModels[make][Math.floor(Math.random() * carModels[make].length)],
          year: 2010 + Math.floor(Math.random() * 14),
          licensePlate: `${Math.floor(1000 + Math.random() * 8999)}-${String.fromCharCode(65 + (i % 26))}BC`,
          type: "Particular",
          engineType: "WITH_COMPUTER",
        },
      });
      createdVehicles.push(v);
    }
  }

  // 5. HISTORIAL DE VENTAS (40 Órdenes completadas con horas y precios)
  console.log("⏳ Generando histórico de 6 meses...");
  for (let i = 0; i < 40; i++) {
    const vehicle =
      createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6)); // Últimos 6 meses

    const total = 500 + Math.floor(Math.random() * 2500);

    const quote = await prisma.quotation.create({
      data: {
        quotationNumber: `COT-FIN-${i}`,
        clientId: vehicle.clientId,
        vehicleId: vehicle.id,
        status: "converted_to_order",
        estimatedTotal: total,
        createdAt: date,
      },
    });

    const order = await prisma.workOrder.create({
      data: {
        workOrderNumber: `OT-FIN-${i}`,
        quotationId: quote.id,
        clientId: vehicle.clientId,
        vehicleId: vehicle.id,
        status: "completed", // EN MINÚSCULAS PARA CONSISTENCIA
        startDate: date,
        completionDate: date,
        estimatedHours: 4.0,
        actualHours: 3.5 + Math.random() * 2, // PARA QUE SE CONTABILICE EL RENDIMIENTO
        mechanic: "Maestro Lucho",
        notes: "Servicio completado exitosamente",
        totalCost: total,
        createdAt: date,
      },
    });

    // Añadir ítems a la orden (Para que "Productos más vendidos" funcione)
    const product =
      productsData[Math.floor(Math.random() * productsData.length)];
    await prisma.orderItem.create({
      data: {
        workOrderId: order.id,
        productId: product.id,
        quantity: 1,
        unitPrice: total * 0.6,
        subtotal: total * 0.6,
      },
    });

    await prisma.sale.create({
      data: {
        saleNumber: `FAC-${2000 + i}`,
        workOrderId: order.id,
        clientId: vehicle.clientId,
        subtotal: total,
        total: total,
        paymentMethod: i % 2 === 0 ? "CASH" : "CARD",
        paymentStatus: "paid",
        saleDate: date,
        createdAt: date,
      },
    });
  }

  console.log(
    "✅ Seed completado. 40 ventas, 45 vehículos y 60 productos listos.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

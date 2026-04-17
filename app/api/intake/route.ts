import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      clientPhone,
      vehicleId,
      licensePlate,
      make,
      model,
      year,
      symptoms,
    } = body;

    // Validaciones
    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: "Los síntomas son requeridos" },
        { status: 400 },
      );
    }

    // Prisma Transaction: Hacemos todo de golpe para que no queden datos huérfanos si algo falla
    const result = await prisma.$transaction(async (tx) => {
      let client;

      // 1. Cliente: Usar existente o crear nuevo
      if (clientId) {
        client = await tx.client.findUnique({
          where: { id: clientId },
        });
        if (!client) {
          return NextResponse.json(
            { error: "Cliente seleccionado no encontrado" },
            { status: 404 },
          );
        }
      } else {
        if (!clientName) {
          return NextResponse.json(
            { error: "Nombre del cliente es requerido" },
            { status: 400 },
          );
        }
        client = await tx.client.findUnique({
          where: { name: clientName },
        });
        if (!client) {
          client = await tx.client.create({
            data: {
              name: clientName,
              phone: clientPhone || null,
            },
          });
        }
      }

      let vehicle;

      // 2. Vehículo: Usar existente o crear nuevo
      if (vehicleId) {
        vehicle = await tx.vehicle.findUnique({
          where: { id: vehicleId },
        });
        if (!vehicle) {
          return NextResponse.json(
            { error: "Vehículo seleccionado no encontrado" },
            { status: 404 },
          );
        }
      } else {
        if (!licensePlate || !make || !model) {
          return NextResponse.json(
            {
              error: "Placa, marca y modelo son requeridos para nuevo vehículo",
            },
            { status: 400 },
          );
        }
        vehicle = await tx.vehicle.findUnique({
          where: { licensePlate: licensePlate.toUpperCase() },
        });
        if (!vehicle) {
          vehicle = await tx.vehicle.create({
            data: {
              clientId: client.id,
              licensePlate: licensePlate.toUpperCase(),
              make,
              model,
              year: parseInt(year) || new Date().getFullYear(),
              type: "Auto", // Default
            },
          });
        }
      }

      // 3. Crear el Borrador de Cotización
      // Buscar todas las cotizaciones que empiecen con COT- y encontrar el número más alto válido
      const allQuotations = await tx.quotation.findMany({
        where: {
          quotationNumber: {
            startsWith: "COT-",
          },
        },
        select: { quotationNumber: true },
      });

      let maxNumber = 0;
      for (const q of allQuotations) {
        const match = q.quotationNumber.match(/^COT-(\d{4})$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }

      const nextNumber = `COT-${String(maxNumber + 1).padStart(4, "0")}`;

      const quotation = await tx.quotation.create({
        data: {
          quotationNumber: nextNumber,
          clientId: client.id,
          vehicleId: vehicle.id,
          status: "in_diagnosis",
          diagnosisMechanicNotes: symptoms,
          quotationDate: new Date(),
        },
      });

      return { client, vehicle, quotation };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error en Recepción Rápida:", error);
    return NextResponse.json(
      { error: "Error procesando la recepción", details: error.message },
      { status: 500 },
    );
  }
}
